// indexer.ts - PostgreSQL Version
/**
 * Full-text search indexer using PostgreSQL tsvector
 * Replaces SQLite FTS5 for multi-agent concurrency support
 */

import { Glob } from "bun";
import { stat } from "node:fs/promises";
import { indexDocument, type DocumentInput } from "./pg-fts";
import { getConnection } from "./pg-client";

const VRAM = "/Volumes/VRAM";

// Area mapping from path
function extractArea(filepath: string): string {
  const match = filepath.match(/\/(\d{2}-\d{2}_[^/]+)\//);
  if (!match) return "System";

  const folder = match[1];
  if (folder.startsWith("10-19")) return "Work";
  if (folder.startsWith("20-29")) return "Finance";
  if (folder.startsWith("30-39")) return "Personal";
  if (folder.startsWith("40-49")) return "Family";
  if (folder.startsWith("50-59")) return "Social";
  if (folder.startsWith("60-69")) return "Growth";
  if (folder.startsWith("70-79")) return "Lifestyle";
  if (folder.startsWith("80-89")) return "Resources";
  if (folder.startsWith("90-99")) return "Archive";
  return "System";
}

function extractCategory(filepath: string): string {
  const match = filepath.match(/\/\d{2}_([^/]+)\//);
  return match ? match[1] : "Uncategorized";
}

// Sanitize content to remove null bytes (PostgreSQL doesn't allow them)
function sanitizeContent(content: string): string {
  return content.replace(/\0/g, '');
}

// Index files
const glob = new Glob("**/*.{md,txt,json}");
let count = 0;
let errors = 0;

console.log("╔════════════════════════════════════════╗");
console.log("║   PostgreSQL Full-Text Indexer         ║");
console.log("╚════════════════════════════════════════╝\n");

console.log("📂 Scanning VRAM filesystem...\n");
const startTime = Date.now();

for await (const file of glob.scan(VRAM)) {
  // Skip the index database itself, node_modules, and backup directories
  if (file.includes("00_Index/")) continue;
  if (file.includes("node_modules/")) continue;
  if (file.includes("Backup/")) continue;
  if (file.startsWith("tools/")) continue;

  const filepath = `${VRAM}/${file}`;
  const bunFile = Bun.file(filepath);

  if (!(await bunFile.exists())) continue;

  try {
    const content = await bunFile.text();
    const stats = await stat(filepath);
    const filename = file.split("/").pop() || file;
    const extension = filename.split(".").pop() || "";

    const doc: DocumentInput = {
      path: filepath,
      filename: filename,
      extension: extension,
      content: sanitizeContent(content),
      fileSize: stats.size,
      modifiedAt: stats.mtime,
      area: extractArea(filepath),
      category: extractCategory(filepath),
    };

    await indexDocument(doc);

    count++;
    if (count % 1000 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (count / parseFloat(elapsed)).toFixed(0);
      console.log(`⏳ Indexed ${count.toLocaleString()} files... (${rate} files/sec)`);
    }
  } catch (err) {
    errors++;
    if (errors <= 10) {
      console.error(`❌ Error indexing ${filepath}:`, err);
    } else if (errors === 11) {
      console.error("(suppressing further errors...)");
    }
  }
}

// Link documents to chunks for hybrid search
console.log("\n🔗 Linking documents to chunks...");
const sql = getConnection();
const linkResult = await sql`
  UPDATE chunks c
  SET document_id = d.id
  FROM documents d
  WHERE c.file_path = d.path
    AND c.document_id IS NULL
`;
console.log(`   Linked ${linkResult.count} chunks to documents`);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

console.log("\n╔════════════════════════════════════════╗");
console.log("║           Indexing Complete!           ║");
console.log("╠════════════════════════════════════════╣");
console.log(`║  Files indexed:     ${count.toLocaleString().padStart(14)}  ║`);
console.log(`║  Errors:            ${errors.toLocaleString().padStart(14)}  ║`);
console.log(`║  Time:              ${elapsed.padStart(12)}s  ║`);
console.log("╚════════════════════════════════════════╝");

if (errors > 0) {
  console.log(`\n⚠️  ${errors} files failed to index. Check errors above.`);
} else {
  console.log("\n✅ All files indexed successfully!");
}

// Close connection
await sql.close();
