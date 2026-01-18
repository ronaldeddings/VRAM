// indexer.ts
import { Database } from "bun:sqlite";
import { Glob } from "bun";
import { stat } from "node:fs/promises";

const VRAM = "/Volumes/VRAM";
const DB_PATH = `${VRAM}/00-09_System/00_Index/search.db`;

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

// Initialize database
const db = new Database(DB_PATH);
db.run("PRAGMA journal_mode = WAL;");

db.run(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    filename TEXT NOT NULL,
    extension TEXT,
    content TEXT,
    file_size INTEGER,
    modified_at TEXT,
    indexed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    area TEXT,
    category TEXT
  )
`);

db.run(`
  CREATE VIRTUAL TABLE IF NOT EXISTS files_fts USING fts5(
    path, filename, content, area, category,
    content='files', content_rowid='id',
    tokenize='porter unicode61'
  )
`);

// Create triggers if they don't exist
db.run(`
  CREATE TRIGGER IF NOT EXISTS files_ai AFTER INSERT ON files BEGIN
    INSERT INTO files_fts(rowid, path, filename, content, area, category)
    VALUES (new.id, new.path, new.filename, new.content, new.area, new.category);
  END
`);

db.run(`
  CREATE TRIGGER IF NOT EXISTS files_ad AFTER DELETE ON files BEGIN
    INSERT INTO files_fts(files_fts, rowid, path, filename, content, area, category)
    VALUES ('delete', old.id, old.path, old.filename, old.content, old.area, old.category);
  END
`);

db.run(`
  CREATE TRIGGER IF NOT EXISTS files_au AFTER UPDATE ON files BEGIN
    INSERT INTO files_fts(files_fts, rowid, path, filename, content, area, category)
    VALUES ('delete', old.id, old.path, old.filename, old.content, old.area, old.category);
    INSERT INTO files_fts(rowid, path, filename, content, area, category)
    VALUES (new.id, new.path, new.filename, new.content, new.area, new.category);
  END
`);

const insertFile = db.prepare(`
  INSERT OR REPLACE INTO files
    (path, filename, extension, content, file_size, modified_at, area, category)
  VALUES
    ($path, $filename, $extension, $content, $size, $modified, $area, $category)
`);

// Index files
const glob = new Glob("**/*.{md,txt,json}");
let count = 0;
let errors = 0;

console.log("Indexing files...\n");
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

    count++;
    if (count % 1000 === 0) {
      console.log(`Indexed ${count} files...`);
    }
  } catch (err) {
    errors++;
    if (errors <= 10) {
      console.error(`Error indexing ${filepath}:`, err);
    } else if (errors === 11) {
      console.error("(suppressing further errors...)");
    }
  }
}

// Rebuild FTS index
console.log("\nRebuilding FTS index...");
db.run(`INSERT INTO files_fts(files_fts) VALUES('rebuild')`);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\nComplete! Indexed ${count} files in ${elapsed}s.`);
if (errors > 0) {
  console.log(`Encountered ${errors} errors.`);
}

db.close();
