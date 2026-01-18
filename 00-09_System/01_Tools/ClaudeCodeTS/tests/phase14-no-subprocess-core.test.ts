import { describe, expect, test } from "bun:test";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { requireCapability } from "../src/core/types/host.js";

async function collectTsFiles(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  const walk = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.isFile() && p.endsWith(".ts")) out.push(p);
    }
  };
  await walk(rootDir);
  return out;
}

describe("Phase 14: no-subprocess enforcement (portable core)", () => {
  test("core avoids subprocess APIs/imports", async () => {
    const root = path.join(process.cwd(), "src", "core");
    const files = await collectTsFiles(root);

    const banned = ["child_process", "node:child_process", "Bun.spawn", "Bun.spawnSync", "spawn-rx", "execFile("];
    for (const f of files) {
      const content = await fs.readFile(f, "utf8");
      for (const token of banned) {
        expect(content.includes(token), `Found banned token ${token} in ${path.relative(process.cwd(), f)}`).toBe(false);
      }
    }
  });

  test("node host adapter can disable subprocess-backed secret persistence (dev/test guard)", async () => {
    if (process.platform !== "darwin") return;
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "claude-code-ts-no-subprocess-"));
    try {
      const host = createNodeHostCapabilities({ configDir: tmp, enableKeychain: true, allowSubprocess: false });
      const secrets = requireCapability(host, "secrets");
      await expect(secrets.setSecret("claude_code/credentials_json", "{}")).rejects.toThrow("Subprocess execution is disabled by host policy");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});
