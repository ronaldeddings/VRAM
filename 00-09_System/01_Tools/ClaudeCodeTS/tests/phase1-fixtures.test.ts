import { describe, expect, test } from "bun:test";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

async function listFiles(root: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(root, e.name);
    if (e.isDirectory()) out.push(...(await listFiles(p)));
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function looksLikeSecret(text: string): string | null {
  const patterns: Array<[string, RegExp]> = [
    ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g],
    ["bearer", /\bBearer\s+[A-Za-z0-9._-]{20,}\b/g],
    ["anthropic-sk", /\bsk-[A-Za-z0-9]{20,}\b/g],
    ["aws-access-key", /\bAKIA[0-9A-Z]{16}\b/g],
    ["ghp-token", /\bghp_[A-Za-z0-9]{20,}\b/g]
  ];
  for (const [name, re] of patterns) {
    if (re.test(text)) return name;
  }
  return null;
}

describe("Phase 1 fixtures: sanitization", () => {
  test("fixtures do not contain obvious secrets", async () => {
    const root = path.join("docs", "rewrite", "phase-1", "fixtures");
    const s = await stat(root).catch(() => null);
    if (!s) return;

    const files = await listFiles(root);
    for (const file of files) {
      if (file.endsWith(".gitkeep")) continue;
      if (!file.endsWith(".txt") && !file.endsWith(".json") && !file.endsWith(".md")) continue;
      const content = await readFile(file, "utf8");
      const hit = looksLikeSecret(content);
      expect(hit, `Possible secret (${hit}) in ${file}`).toBeNull();
    }
  });
});

