import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  LEGACY_SETTINGS_MERGE_SEMANTICS,
  LEGACY_SETTINGS_SOURCE_ORDER
} from "../src/spec/legacy/settings.js";
import { LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE } from "../src/spec/legacy/permissions.js";
import { computeLegacyMcpCliGateSnapshot } from "../src/spec/legacy/envFlags.js";

type BundleName = "ClaudeCodeCode" | "ClaudeAgentSDKCode";

type CaptureArgs = {
  bundle: BundleName;
  name: string;
  cliArgs: string[];
  env: Record<string, string>;
};

function usage(): never {
  // eslint-disable-next-line no-console
  console.error(
    [
      "Usage:",
      "  bun scripts/capture-legacy-fixture.ts --bundle <ClaudeCodeCode|ClaudeAgentSDKCode> --name <fixtureName> [--env KEY=VALUE ...] -- <cli args...>",
      "",
      "Examples:",
      '  bun scripts/capture-legacy-fixture.ts --bundle ClaudeCodeCode --name cc-2.0.69-version -- --version',
      '  bun scripts/capture-legacy-fixture.ts --bundle ClaudeCodeCode --name cc-2.0.69-mcp-cli-help --env ENABLE_EXPERIMENTAL_MCP_CLI=1 -- --mcp-cli --help'
    ].join("\n")
  );
  process.exit(2);
}

function parseArgs(argv: string[]): CaptureArgs {
  const bundleIdx = argv.indexOf("--bundle");
  const nameIdx = argv.indexOf("--name");
  const sepIdx = argv.indexOf("--");
  if (bundleIdx === -1 || nameIdx === -1 || sepIdx === -1) usage();

  const bundle = argv[bundleIdx + 1] as BundleName | undefined;
  const name = argv[nameIdx + 1];
  if (!bundle || (bundle !== "ClaudeCodeCode" && bundle !== "ClaudeAgentSDKCode")) usage();
  if (!name) usage();

  const cliArgs = argv.slice(sepIdx + 1);
  if (cliArgs.length === 0) usage();

  const env: Record<string, string> = {};
  for (let i = 0; i < sepIdx; i++) {
    if (argv[i] !== "--env") continue;
    const raw = argv[i + 1];
    if (!raw) usage();
    const eq = raw.indexOf("=");
    if (eq <= 0) usage();
    const key = raw.slice(0, eq);
    const value = raw.slice(eq + 1);
    env[key] = value;
    i += 1;
  }

  return { bundle, name, cliArgs, env };
}

function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const fixturesRoot = path.join("docs", "rewrite", "phase-1", "fixtures");
  const sessionsDir = path.join(fixturesRoot, "sessions");
  const manifestsDir = path.join(fixturesRoot, "manifests");
  await mkdir(sessionsDir, { recursive: true });
  await mkdir(manifestsDir, { recursive: true });

  const tmpConfigDir = await mkdtemp(path.join(os.tmpdir(), "claude-code-legacy-capture-"));
  try {
    const cliPath = path.join("bundles", args.bundle, "cli.js");
    const env = {
      ...process.env,
      ...args.env,
      CLAUDE_CONFIG_DIR: tmpConfigDir,
      COREPACK_ENABLE_AUTO_PIN: "0"
    } as Record<string, string>;

    const proc = Bun.spawnSync(["node", cliPath, ...args.cliArgs], {
      env,
      stdout: "pipe",
      stderr: "pipe"
    });

    const stdout = proc.stdout.toString();
    const stderr = proc.stderr.toString();

    const stdoutPath = path.join(sessionsDir, `${args.name}.stdout.txt`);
    const stderrPath = path.join(sessionsDir, `${args.name}.stderr.txt`);
    await writeFile(stdoutPath, stdout, "utf8");
    await writeFile(stderrPath, stderr, "utf8");

    const mcpGates = computeLegacyMcpCliGateSnapshot(env);

    const normalizedEffectiveSettingsSnapshot = {
      enabledSources: [...LEGACY_SETTINGS_SOURCE_ORDER],
      fileBackedSources: [...LEGACY_SETTINGS_SOURCE_ORDER],
      mergeSemantics: LEGACY_SETTINGS_MERGE_SEMANTICS,
      note:
        "Capture uses an empty CLAUDE_CONFIG_DIR temp dir; this snapshot records the known source order + merge semantics, not user machine settings."
    };

    const normalizedPermissionRuleSet = {
      sourcePrecedence: [...LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE],
      allow: {},
      deny: {},
      ask: {},
      note: "No settings files were loaded during capture (empty CLAUDE_CONFIG_DIR)."
    } as const;

    const manifest = {
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      bundle: args.bundle,
      command: `node ${cliPath} ${args.cliArgs.join(" ")}`,
      exitCode: proc.exitCode,
      env: {
        provided: Object.keys(args.env).sort(),
        derived: { mcpCliGates: mcpGates }
      },
      outputs: {
        stdoutPath,
        stderrPath,
        stdoutSha256: sha256Hex(stdout),
        stderrSha256: sha256Hex(stderr)
      },
      captured: {
        normalizedEffectiveSettingsSnapshot,
        normalizedPermissionRuleSet,
        hookSelectionResults: {
          note: "Not captured for this offline fixture yet."
        },
        toolInvocationTranscript: {
          note: "Not captured for this offline fixture yet."
        },
        mcpModeSelection: {
          note: "Infer from stderr/stdout text for `--mcp-cli` fixtures."
        }
      }
    } as const;

    const manifestPath = path.join(manifestsDir, `${args.name}.manifest.json`);
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

    // eslint-disable-next-line no-console
    console.log(`Wrote fixture:\n- ${stdoutPath}\n- ${stderrPath}\n- ${manifestPath}`);
  } finally {
    await rm(tmpConfigDir, { recursive: true, force: true });
  }
}

await main();
