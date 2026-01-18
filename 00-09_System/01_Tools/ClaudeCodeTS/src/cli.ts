#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeMcpCliGateSnapshotFromEnv } from "./core/settings/effectiveConfig.js";
import { createEngine } from "./core/engine/createEngine.js";
import { createNodeHostCapabilities } from "./platform/node/host.js";
import { CliAdapter } from "./ui/cli/adapter.js";
import { runNodeCli } from "./ui/cli/nodeEntrypoint.js";
import { runMcpCli } from "./cli/mcpCli.js";
import { runNonInteractivePrompt } from "./cli/prompt.js";
import { runRipgrep } from "./cli/ripgrep.js";
import { runDoctor } from "./cli/doctor.js";
import { runEngineOnlyDiagnostics } from "./cli/engineOnly.js";
import { runInstall } from "./cli/install.js";
import { runUpdate } from "./cli/update.js";
import { runSetupToken } from "./cli/setupToken.js";
import { runMcpCommand } from "./cli/mcp.js";
import { runPluginCommand } from "./cli/plugin.js";

function readPackageVersion(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, "..", "package.json"),
    path.resolve(here, "..", "..", "package.json")
  ];
  for (const p of candidates) {
    try {
      const raw = fs.readFileSync(p, "utf8");
      const parsed = JSON.parse(raw) as { version?: unknown };
      if (typeof parsed.version === "string" && parsed.version.trim()) return parsed.version.trim();
    } catch {
      // ignore
    }
  }
  return "0.0.0";
}

function printMainHelp(version: string): void {
  process.stdout.write(
    [
      `claude-ts ${version}`,
      "",
      "Usage: claude-ts [options]",
      "",
      "Options:",
      "  --version, -v, -V     Print version and exit",
      "  --help                Show help",
      "  --mcp-cli ...         MCP CLI (gated by ENABLE_EXPERIMENTAL_MCP_CLI=1)",
      "  --ripgrep ...         Minimal grep/search mode (portable replacement)",
      "  doctor                Print a portable diagnostics report",
      "  engine-only           Run core diagnostics (no model calls)",
      "  --print-frame         Print one UI frame and exit",
      "  -p, --prompt <text>   Send one prompt, print model output, and exit",
      "",
      "Legacy command surface (stubs until implemented):",
      "  install               Install the native build",
      "  update                Check for updates",
      "  setup-token           Set up credentials",
      "  mcp                   Manage MCP servers",
      "  plugin                Manage plugins and marketplace",
      "",
      "Interactive:",
      "  ctrl+o toggles transcript view",
      "  ctrl+e toggles full transcript (in transcript view)",
      "",
      "Notes:",
      "  `-p` uses Claude Code credentials (Keychain) or ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN.",
      "  This is a TS-first rewrite; many legacy CLI commands are not yet implemented."
    ].join("\n") + "\n"
  );
}

function createDefaultHost() {
  const disableKeychain = process.env.CLAUDE_TS_DISABLE_KEYCHAIN === "1";
  const enablePlaintextSecretFallback = process.env.CLAUDE_TS_ENABLE_PLAINTEXT_SECRETS === "1";
  return createNodeHostCapabilities({ enableKeychain: !disableKeychain, enablePlaintextSecretFallback });
}

async function waitForInitialFrame(adapter: CliAdapter, options?: { timeoutMs?: number }): Promise<void> {
  const deadline = Date.now() + (options?.timeoutMs ?? 500);
  while (!adapter.getAppState()) {
    await Promise.resolve();
    if (Date.now() > deadline) break;
  }
}

async function runOnce(options: { prompt?: string }): Promise<number> {
  const host = createDefaultHost();
  const engine = createEngine({ host });
  const adapter = new CliAdapter(engine);
  await adapter.start();
  await waitForInitialFrame(adapter);

  if (options.prompt) {
    await adapter.sendText(options.prompt);
    await waitForInitialFrame(adapter);
  }

  process.stdout.write(adapter.getFrameLines().join("\n") + "\n");
  await adapter.stop("run-once");
  return 0;
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  const version = readPackageVersion();

  if (!process.env.CLAUDE_CODE_ENTRYPOINT) {
    const nonInteractive = argv.includes("-p") || argv.includes("--prompt") || argv.includes("--print-frame");
    process.env.CLAUDE_CODE_ENTRYPOINT = nonInteractive ? "sdk-cli" : "cli";
  }

  if (argv.length === 1 && (argv[0] === "--version" || argv[0] === "-v" || argv[0] === "-V")) {
    process.stdout.write(`${version} (Claude Code TS rewrite)\n`);
    return 0;
  }

  if (argv.length === 0) return await runNodeCli(argv);
  if (argv[0] === "--help" || argv[0] === "help") {
    printMainHelp(version);
    return 0;
  }

  if (argv[0] === "--print-frame") return await runOnce({});

  if (argv[0] === "doctor") {
    const host = createDefaultHost();
    return await runDoctor(argv.slice(1), { host, engine: { name: "claude-ts", version } });
  }

  if (argv[0] === "install") return await runInstall(argv.slice(1));
  if (argv[0] === "update") return await runUpdate(argv.slice(1));
  if (argv[0] === "setup-token") return await runSetupToken(argv.slice(1));
  if (argv[0] === "mcp") return await runMcpCommand(argv.slice(1));
  if (argv[0] === "plugin") return await runPluginCommand(argv.slice(1));

  if (argv[0] === "engine-only") {
    const host = createDefaultHost();
    const res = await runEngineOnlyDiagnostics(argv.slice(1), { host, engine: { name: "claude-ts", version } });
    process.stdout.write(res.reportJson + "\n");
    return res.exitCode;
  }

  if (argv[0] === "--prompt" || argv[0] === "-p") {
    const prompt = argv.slice(1).join(" ").trim();
    if (!prompt) {
      process.stderr.write("Error: missing prompt text\n");
      return 1;
    }
    try {
      const host = createDefaultHost();
      const out = await runNonInteractivePrompt(prompt, { host });
      process.stdout.write(`${out}\n`);
      return 0;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error: ${msg}\n`);
      return 1;
    }
  }

  if (argv[0] === "--ripgrep") {
    return await runRipgrep(argv.slice(1));
  }

  if (argv[0] === "--mcp-cli") {
    const gates = computeMcpCliGateSnapshotFromEnv(process.env);
    if (!gates.enableExperimentalMcpCli) {
      printMainHelp(version);
      return 0;
    }
    return await runMcpCli(argv.slice(1), { gates });
  }

  process.stderr.write(`Error: unknown command or option: ${argv[0]}\n`);
  printMainHelp(version);
  return 1;
}

function isDirectRun(): boolean {
  const bunMain = (import.meta as unknown as { main?: boolean }).main;
  if (typeof bunMain === "boolean") return bunMain;
  try {
    const selfPath = fileURLToPath(import.meta.url);
    const argv1 = process.argv[1] ? path.resolve(process.argv[1]) : "";
    return argv1 === selfPath;
  } catch {
    return false;
  }
}

if (isDirectRun()) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      process.stderr.write(String(err) + "\n");
      process.exit(1);
    });
}
