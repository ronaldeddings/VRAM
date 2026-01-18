import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, "src");
const coreRoot = path.join(srcRoot, "core");
const platformRoot = path.join(srcRoot, "platform");
const uiRoot = path.join(srcRoot, "ui");

const nodeBuiltins = new Set([
  "assert",
  "buffer",
  "child_process",
  "cluster",
  "crypto",
  "dgram",
  "dns",
  "events",
  "fs",
  "http",
  "https",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "stream",
  "timers",
  "tls",
  "tty",
  "url",
  "util",
  "worker_threads",
  "zlib"
]);

async function listTsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listTsFiles(abs)));
    else if (entry.isFile() && abs.endsWith(".ts")) out.push(abs);
  }
  return out;
}

function* extractImportSpecifiers(sourceText) {
  const patterns = [
    /\bfrom\s+["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g
  ];
  for (const re of patterns) {
    for (const match of sourceText.matchAll(re)) yield match[1];
  }
}

function resolveRelativeImport(fromFileAbs, specifier) {
  const base = path.dirname(fromFileAbs);
  const resolved = path.resolve(base, specifier);
  return resolved;
}

function isWithin(childAbs, parentAbs) {
  const rel = path.relative(parentAbs, childAbs);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

function isNodeOnlyImport(specifier) {
  if (specifier.startsWith("node:")) return true;
  const root = specifier.split("/")[0];
  if (nodeBuiltins.has(root)) return true;
  return false;
}

async function main() {
  const files = await listTsFiles(coreRoot);
  const violations = [];

  for (const fileAbs of files) {
    const text = await readFile(fileAbs, "utf8");
    for (const specifier of extractImportSpecifiers(text)) {
      if (isNodeOnlyImport(specifier)) {
        violations.push({
          fileAbs,
          specifier,
          rule: "core-imports-node-builtins"
        });
        continue;
      }

      const isRelative = specifier.startsWith(".") || specifier.startsWith("..");
      if (!isRelative) continue;

      const resolvedAbs = resolveRelativeImport(fileAbs, specifier);
      if (isWithin(resolvedAbs, platformRoot) || isWithin(resolvedAbs, uiRoot)) {
        violations.push({
          fileAbs,
          specifier,
          rule: "core-imports-host-code"
        });
      }
    }
  }

  if (violations.length > 0) {
    // eslint-disable-next-line no-console
    console.error("Import boundary violations found:");
    for (const v of violations) {
      // eslint-disable-next-line no-console
      console.error(`- ${path.relative(repoRoot, v.fileAbs)} imports "${v.specifier}" (${v.rule})`);
    }
    process.exitCode = 1;
    return;
  }

  // eslint-disable-next-line no-console
  console.log("Import boundary check passed.");
}

await main();
