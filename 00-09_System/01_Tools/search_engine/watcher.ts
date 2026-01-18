// watcher.ts - PostgreSQL Version
/**
 * Real-time file watcher for VRAM filesystem
 * Indexes file changes to PostgreSQL for multi-agent concurrency
 */

import { watch } from "node:fs";
import { stat } from "node:fs/promises";
import { indexDocument, deleteDocument, type DocumentInput } from "./pg-fts";
import { closeConnection } from "./pg-client";
import { isTranscript } from "./smart-chunker";

const VRAM = "/Volumes/VRAM";

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

async function indexFile(filepath: string): Promise<boolean> {
  const bunFile = Bun.file(filepath);
  if (!(await bunFile.exists())) return false;

  try {
    const content = await bunFile.text();
    const stats = await stat(filepath);
    const filename = filepath.split("/").pop() || filepath;
    const extension = filename.split(".").pop() || "";

    // Detect if this is a transcript file
    const contentType = isTranscript(content) ? "transcript" : "file";

    const doc: DocumentInput = {
      path: filepath,
      filename: filename,
      extension: extension,
      content: sanitizeContent(content),
      fileSize: stats.size,
      modifiedAt: stats.mtime,
      area: extractArea(filepath),
      category: extractCategory(filepath),
      contentType: contentType,
    };

    await indexDocument(doc);
    return true;
  } catch (err) {
    console.error(`Error indexing ${filepath}:`, err);
    return false;
  }
}

// Debounce map to prevent multiple events for the same file
const debounceMap = new Map<string, NodeJS.Timeout>();
const DEBOUNCE_MS = 500;

function debounce(filepath: string, callback: () => Promise<void>) {
  const existing = debounceMap.get(filepath);
  if (existing) {
    clearTimeout(existing);
  }
  debounceMap.set(
    filepath,
    setTimeout(async () => {
      debounceMap.delete(filepath);
      await callback();
    }, DEBOUNCE_MS)
  );
}

console.log("╔════════════════════════════════════════╗");
console.log("║   VRAM File Watcher (PostgreSQL)       ║");
console.log("╚════════════════════════════════════════╝\n");
console.log(`📂 Watching: ${VRAM}`);
console.log(`🐘 Backend: PostgreSQL`);
console.log(`Press Ctrl+C to stop.\n`);

// Track stats
let added = 0;
let updated = 0;
let removed = 0;

watch(VRAM, { recursive: true }, (event, filename) => {
  if (!filename) return;

  // Only index text files
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext || !["md", "txt", "json"].includes(ext)) return;

  // Skip directories we don't want to index
  if (filename.includes("00_Index/")) return;
  if (filename.includes("node_modules/")) return;
  if (filename.includes("Backup/")) return;
  if (filename.startsWith("tools/")) return;

  const filepath = `${VRAM}/${filename}`;

  debounce(filepath, async () => {
    const timestamp = new Date().toLocaleTimeString();

    if (event === "rename") {
      const exists = await Bun.file(filepath).exists();
      if (exists) {
        await indexFile(filepath);
        added++;
        console.log(`[${timestamp}] ✅ Added: ${filename}`);
      } else {
        await deleteDocument(filepath);
        removed++;
        console.log(`[${timestamp}] ❌ Removed: ${filename}`);
      }
    } else if (event === "change") {
      await indexFile(filepath);
      updated++;
      console.log(`[${timestamp}] 🔄 Updated: ${filename}`);
    }
  });
});

process.on("SIGINT", async () => {
  console.log("\n\nStopping watcher...");
  console.log(`Session stats: ${added} added, ${updated} updated, ${removed} removed`);
  await closeConnection();
  process.exit(0);
});

// Keep process alive
setInterval(() => {}, 60000);
