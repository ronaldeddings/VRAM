import { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";

function runCli(args: string[], env?: Record<string, string | undefined>): { code: number; out: string } {
  const mergedEnv: Record<string, string> = { ...process.env } as Record<string, string>;
  for (const [k, v] of Object.entries(env ?? {})) {
    if (v === undefined) delete mergedEnv[k];
    else mergedEnv[k] = v;
  }
  const proc = Bun.spawnSync(["bun", "src/cli.ts", ...args], {
    env: mergedEnv,
    stdout: "pipe",
    stderr: "pipe"
  });
  const out = `${proc.stdout.toString()}\n${proc.stderr.toString()}`.trim();
  return { code: proc.exitCode, out };
}

describe("Phase 15: engine-only diagnostic mode", () => {
  test("engine-only prints a stable JSON report and exits 0", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-engine-only-"));
    try {
      const r = runCli(["engine-only"], { CLAUDE_CONFIG_DIR: dir, CLAUDE_TS_DISABLE_KEYCHAIN: "1" });
      expect(r.code).toBe(0);
      const parsed = JSON.parse(r.out) as any;
      expect(parsed.kind).toBe("engine_only_report");
      expect(parsed.schemaVersion).toBe(1);
      expect(parsed.engine?.name).toBe("claude-ts");
      expect(typeof parsed.engine?.version).toBe("string");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

