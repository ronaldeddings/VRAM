import { describe, expect, test } from "bun:test";
import fs from "node:fs/promises";
import path from "node:path";

async function listTsFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === "bundles" || e.name.startsWith(".")) continue;
      out.push(...(await listTsFiles(p)));
    } else if (e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".tsx"))) {
      out.push(p);
    }
  }
  return out;
}

describe("Phase 4: capability leak prevention heuristics", () => {
  test("no module-level HostCapabilities singletons in portable src/core", async () => {
    const root = path.resolve(import.meta.dir, "..", "src", "core");
    const files = await listTsFiles(root);

    const offenders: string[] = [];
    const decl = /^(?:export\\s+)?(?:const|let|var)\\s+\\w+\\s*:\\s*HostCapabilities\\b/m;

    for (const file of files) {
      const text = await fs.readFile(file, "utf8");
      if (decl.test(text)) offenders.push(path.relative(process.cwd(), file));
    }

    expect(offenders).toEqual([]);
  });
});

