import { describe, expect, test } from "bun:test";
import path from "node:path";
import fs from "node:fs/promises";

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

describe("Phase 12: no-subprocess constraint (CLI host adapter)", () => {
  test("CLI host adapter code avoids subprocess helpers", async () => {
    const roots = [
      path.join(process.cwd(), "src", "cli"),
      path.join(process.cwd(), "src", "ui", "cli"),
      path.join(process.cwd(), "src", "core", "mcp"),
      path.join(process.cwd(), "src", "core", "hooks")
    ];

    const files = (await Promise.all(roots.map(collectTsFiles))).flat();

    const banned = ["child_process", "node:child_process", "Bun.spawn", "Bun.spawnSync", "spawn-rx", "execFile("];
    for (const f of files) {
      const content = await fs.readFile(f, "utf8");
      for (const token of banned) {
        expect(content.includes(token), `Found banned token ${token} in ${path.relative(process.cwd(), f)}`).toBe(false);
      }
    }
  });
});

