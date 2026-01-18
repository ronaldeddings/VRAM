// watcher.ts
import { watch } from "node:fs";
import { stat } from "node:fs/promises";
import { Database } from "bun:sqlite";

const VRAM = "/Volumes/VRAM";
const DB_PATH = `${VRAM}/00-09_System/00_Index/search.db`;

const db = new Database(DB_PATH);
db.run("PRAGMA journal_mode = WAL;");

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

const insertFile = db.prepare(`
  INSERT OR REPLACE INTO files
    (path, filename, extension, content, file_size, modified_at, area, category)
  VALUES
    ($path, $filename, $extension, $content, $size, $modified, $area, $category)
`);

const deleteFile = db.prepare(`DELETE FROM files WHERE path = $path`);

async function indexFile(filepath: string): Promise<boolean> {
  const bunFile = Bun.file(filepath);
  if (!(await bunFile.exists())) return false;

  try {
    const content = await bunFile.text();
    const stats = await stat(filepath);
    const filename = filepath.split("/").pop() || filepath;
    const extension = filename.split(".").pop() || "";

    insertFile.run({
      $path: filepath,
      $filename: filename,
      $extension: extension,
      $content: content,
      $size: stats.size,
      $modified: stats.mtime.toISOString(),
      $area: extractArea(filepath),
      $category: extractCategory(filepath),
    });

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

console.log(`VRAM File Watcher`);
console.log(`Watching: ${VRAM}`);
console.log(`Database: ${DB_PATH}`);
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
        deleteFile.run({ $path: filepath });
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

process.on("SIGINT", () => {
  console.log("\n\nStopping watcher...");
  console.log(`Session stats: ${added} added, ${updated} updated, ${removed} removed`);
  db.close();
  process.exit(0);
});

// Keep process alive
setInterval(() => {}, 60000);
