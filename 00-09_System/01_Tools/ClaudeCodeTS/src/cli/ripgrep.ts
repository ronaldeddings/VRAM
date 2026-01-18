import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { createMonotonicIdSource } from "../core/runtime/ids.js";
import { systemMonotonicClock } from "../core/runtime/clock.js";
import { ToolRegistry, ToolRunner, searchGrepTool } from "../core/tools/index.js";
import { createNodeHostCapabilities } from "../platform/node/host.js";

function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts --ripgrep <pattern> [root] [options]",
      "",
      "Options:",
      "  -i, --ignore-case         Case-insensitive (default: true)",
      "  --fixed-string            Treat pattern as a literal string (default: regex)",
      "  --json                    Output JSON (tool result data)",
      "  --help                    Show help",
      "",
      "Notes:",
      "  This is not a full ripgrep flag-compatible implementation.",
      "  It maps to the portable `search.grep` tool (no subprocess)."
    ].join("\n") + "\n"
  );
}

function parseArgs(argv: string[]): {
  pattern: string | null;
  root: string | null;
  ignoreCase: boolean;
  regex: boolean;
  json: boolean;
} {
  let ignoreCase = true;
  let regex = true;
  let json = false;
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--help") return { pattern: null, root: null, ignoreCase, regex, json };
    if (a === "--json") {
      json = true;
      continue;
    }
    if (a === "-i" || a === "--ignore-case") {
      ignoreCase = true;
      continue;
    }
    if (a === "--no-ignore-case") {
      ignoreCase = false;
      continue;
    }
    if (a === "--fixed-string") {
      regex = false;
      continue;
    }
    if (a.startsWith("-")) continue;
    positionals.push(a);
  }
  const pattern = positionals[0] ?? null;
  const root = positionals[1] ?? null;
  return { pattern, root, ignoreCase, regex, json };
}

export async function runRipgrep(argv: string[]): Promise<number> {
  const parsed = parseArgs(argv);
  if (parsed.pattern === null) {
    printHelp();
    return 0;
  }

  const tmp = await mkdtemp(path.join(os.tmpdir(), "claude-ts-rg-"));
  try {
    const host = createNodeHostCapabilities({ enableKeychain: false, configDir: tmp, storageSubdir: "rg-tmp" });
    const idSource = createMonotonicIdSource();
    const clock = systemMonotonicClock();

    const registry = new ToolRegistry();
    registry.registerBuiltin(searchGrepTool);
    const runner = new ToolRunner(registry, { host, idSource, clock });

    const root = parsed.root ?? process.cwd();
    const out = await runner.run({
      toolName: "search.grep",
      input: { query: parsed.pattern, root, regex: parsed.regex, ignoreCase: parsed.ignoreCase }
    });

    if (out.kind !== "completed") {
      process.stderr.write(`ripgrep: ${out.error.message}\n`);
      return 1;
    }

    const data = out.result.data as any;
    if (parsed.json) {
      process.stdout.write(JSON.stringify(data) + "\n");
      return 0;
    }

    const matches: Array<{ path: string; line: number; column: number; lineText: string }> = Array.isArray(data.matches)
      ? data.matches
      : [];
    for (const m of matches) {
      process.stdout.write(`${m.path}:${m.line}:${m.column}:${m.lineText}\n`);
    }
    return matches.length > 0 ? 0 : 1;
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}
