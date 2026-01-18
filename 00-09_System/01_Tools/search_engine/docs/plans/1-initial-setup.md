# VRAM: Local Data Asset System

A complete manual for organizing, automating, and searching your local data assets.

---

## Philosophy

This system is built on three principles:

**1. Dump and Search**
Data flows in one direction: into the system. You don't edit files in place. You dump exports from various services (email, meetings, recordings, messages) and then search across everything. The files themselves are artifacts—the value comes from being able to find and reference them.

**2. Structure Enables Discovery**
A consistent folder structure with predictable naming means you can find things even without search. When search fails or you're browsing, the hierarchy makes sense. Johnny.Decimal numbering gives every location a unique address.

**3. Applications on Top**
The folder structure is the foundation. Search, AI, automation—these are layers that sit on top. The data remains portable, human-readable, and independent of any specific tool.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ACCESS LAYER                            │
│                                                              │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│   │   CLI    │   │  Web UI  │   │  Raycast │               │
│   │  search  │   │  search  │   │  plugin  │               │
│   └────┬─────┘   └────┬─────┘   └────┬─────┘               │
│        └──────────────┼──────────────┘                      │
│                       ▼                                      │
├─────────────────────────────────────────────────────────────┤
│                      SEARCH LAYER                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  Bun.serve() API                     │   │
│   │                                                      │   │
│   │   /search?q=          Full-text search (FTS5)       │   │
│   │   /files/:path        Retrieve file content         │   │
│   │   /browse/:area       List files in area            │   │
│   │   /stats              Index statistics              │   │
│   └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│   ┌───────────────────┴───────────────────┐                 │
│   │           bun:sqlite + FTS5            │                 │
│   │                                        │                 │
│   │   files table      File metadata       │                 │
│   │   files_fts        Full-text index     │                 │
│   │   tags table       Optional tagging    │                 │
│   └────────────────────────────────────────┘                 │
│                       │                                      │
├───────────────────────┴─────────────────────────────────────┤
│                    AUTOMATION LAYER                          │
│                                                              │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│   │ File Watcher │  │  Scheduled   │  │   Import     │     │
│   │  (node:fs)   │  │   Indexer    │  │   Scripts    │     │
│   └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                       DATA LAYER                             │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                   /Volumes/VRAM/                      │  │
│   │                                                       │  │
│   │   Markdown  │  JSON  │  TXT  │  MP4  │  Audio        │  │
│   │                                                       │  │
│   │   All files are read-only artifacts                  │  │
│   └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

The system uses Johnny.Decimal numbering with underscore-based naming.

### Naming Rules

- **Areas**: `XX-XX_Name/` (e.g., `10-19_Work/`)
- **Categories**: `XX_Name/` (e.g., `13_Meetings/`)
- **Subcategories**: `XX.XX_name/` (e.g., `13.01_transcripts/`)
- **No spaces**: Use underscores everywhere
- **Lowercase**: Except proper nouns
- **Dates**: ISO format `YYYY-MM-DD` or `YYYY/` for year folders

### Complete Structure

```
/Volumes/VRAM/
│
├── 00-09_System/
│   │
│   ├── 00_Index/
│   │   ├── search.db                 # SQLite database
│   │   ├── config.json               # Index configuration
│   │   └── file_registry.json        # All files manifest
│   │
│   ├── 01_Tools/
│   │   ├── search_engine/            # Bun search API
│   │   ├── indexer/                  # Index builder
│   │   └── importers/                # Data import scripts
│   │
│   ├── 02_Config/
│   │   ├── scripts/                  # Shell scripts
│   │   └── automation/               # Watcher configs
│   │
│   └── 03_Docs/
│       ├── this_manual.md
│       └── naming_conventions.md
│
├── 10-19_Work/
│   │
│   ├── 10_Hacker_Valley_Media/
│   │   ├── 10.01_episodes/
│   │   ├── 10.02_guests/
│   │   ├── 10.03_marketing/
│   │   ├── 10.04_partnerships/
│   │   ├── 10.05_operations/
│   │   ├── 10.06_finance/            # HVM invoices, P&L
│   │   ├── 10.07_legal/              # HVM contracts
│   │   └── 10.08_archive/
│   │
│   ├── 11_Mozilla/
│   │   ├── 11.01_projects/
│   │   ├── 11.02_documents/
│   │   ├── 11.03_pay_stubs/
│   │   └── 11.04_archive/
│   │
│   ├── 12_Clients/
│   │   └── [client_name]/
│   │       ├── projects/
│   │       ├── finance/
│   │       └── communications/
│   │
│   ├── 13_Meetings/
│   │   ├── 13.01_transcripts/
│   │   │   └── [year]/               # 2023/, 2024/, 2025/, 2026/
│   │   ├── 13.02_recordings/
│   │   │   └── [year]/
│   │   └── 13.03_metadata/
│   │       └── [year]/
│   │
│   ├── 14_Communications/
│   │   ├── 14.01_emails/
│   │   │   └── [year]/               # 2020/ through 2025/
│   │   ├── 14.02_slack/
│   │   │   ├── json/
│   │   │   ├── markdown/
│   │   │   └── search/
│   │   └── 14.03_other/
│   │
│   └── 15_Archive/
│
├── 20-29_Finance/
│   │
│   ├── 20_Banking/
│   │   ├── 20.01_checking/
│   │   ├── 20.02_savings/
│   │   └── 20.03_credit_cards/
│   │
│   ├── 21_Investments/
│   │   ├── 21.01_brokerage/
│   │   ├── 21.02_retirement/
│   │   └── 21.03_crypto/
│   │
│   ├── 22_Taxes/
│   │   └── [year]/                   # 22.01_2023/, 22.02_2024/, etc.
│   │
│   ├── 23_Insurance/
│   │   ├── 23.01_health/
│   │   ├── 23.02_life/
│   │   ├── 23.03_auto/
│   │   └── 23.04_home/
│   │
│   ├── 24_Real_Estate/
│   │   └── [property]/
│   │
│   └── 25_Archive/
│
├── 30-39_Personal/
│   │
│   ├── 30_Journals/
│   │   ├── 30.01_daily/
│   │   ├── 30.02_weekly/
│   │   └── 30.03_monthly/
│   │
│   ├── 31_Recordings/
│   │   ├── 31.01_voice_memos/
│   │   ├── 31.02_limitless/
│   │   │   └── [year]/
│   │   └── 31.03_rewind/
│   │       └── [date_folder]/        # 2025_06_21/
│   │
│   ├── 32_Health/
│   │   ├── 32.01_workouts/
│   │   ├── 32.02_medical/
│   │   └── 32.03_nutrition/
│   │
│   ├── 33_Learning/
│   │   ├── 33.01_books/
│   │   ├── 33.02_courses/
│   │   └── 33.03_notes/
│   │
│   ├── 34_Goals/
│   │   ├── 34.01_vision/
│   │   ├── 34.02_annual/
│   │   └── 34.03_reviews/
│   │
│   ├── 35_Messages/
│   │   ├── 35.01_imessage/
│   │   │   ├── exports/
│   │   │   └── threads/
│   │   ├── 35.02_signal/
│   │   │   ├── exports/
│   │   │   └── groups/
│   │   ├── 35.03_whatsapp/
│   │   │   ├── exports/
│   │   │   └── groups/
│   │   └── 35.04_other/
│   │
│   └── 36_Archive/
│
├── 40-49_Family/
│   ├── 40_Memories/
│   ├── 41_Events/
│   ├── 42_Photos/
│   │   └── [year]/
│   ├── 43_Documents/
│   │   ├── legal/
│   │   ├── medical/
│   │   └── important/
│   └── 44_Archive/
│
├── 50-59_Social/
│   ├── 50_People/
│   │   ├── family/
│   │   ├── friends/
│   │   ├── colleagues/
│   │   └── clients/
│   ├── 51_Events/
│   └── 52_Archive/
│
├── 60-69_Growth/
│   ├── 60_Career/
│   │   ├── skills/
│   │   ├── achievements/
│   │   └── portfolio/
│   ├── 61_Character/
│   ├── 62_Emotional/
│   ├── 63_Spiritual/
│   └── 64_Vision/
│
├── 70-79_Lifestyle/
│   ├── 70_Experiences/
│   ├── 71_Travel/
│   ├── 72_Environment/
│   └── 73_Archive/
│
├── 80-89_Resources/
│   ├── 80_Reference/
│   │   ├── books/
│   │   ├── articles/
│   │   └── research/
│   ├── 81_Templates/
│   ├── 82_Knowledge/
│   │   ├── how_tos/
│   │   ├── processes/
│   │   └── standards/
│   └── 83_Archive/
│
└── 90-99_Archive/
    ├── 90_Work_Archive/
    ├── 91_Personal_Archive/
    ├── 92_Project_Archive/
    └── 93_Media_Archive/
```

---

## Data Flow

### How Data Enters the System

Data comes from exports and dumps. You don't create files here—you import them.

**Email**: Export from Gmail/Outlook → Markdown files with YAML frontmatter
**Meetings**: Fathom/Otter exports → TXT transcripts + JSON metadata + MP4 recordings
**Messages**: Platform exports → Organized by platform and thread
**Recordings**: Rewind/Limitless/Voice Memos → Audio/video by date
**Documents**: Manual dumps or sync → Appropriate category

### File Format Strategy

Keep files in their original format. Don't convert unless necessary.

- **Markdown (.md)**: Human-readable, searchable, lightweight
- **JSON (.json)**: Structured metadata, machine-parseable
- **Plain text (.txt)**: Transcripts, logs, simple content
- **Media files**: Store as-is, index metadata only

### What Gets Indexed

The search index includes:

- All `.md` files (full content)
- All `.txt` files (full content)
- All `.json` files (full content, searchable as text)
- File paths (always searchable)
- File metadata (size, modified date, type)

Media files (.mp4, .mp3, .wav) are not indexed by content—only their paths and any associated metadata files.

---

## Search Layer

### Database Schema

```sql
-- Core files table
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  extension TEXT,
  content TEXT,
  file_size INTEGER,
  modified_at TEXT,
  indexed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  area TEXT,                    -- Extracted from path: "Work", "Finance", etc.
  category TEXT                 -- Extracted from path: "Meetings", "Emails", etc.
);

-- Full-text search virtual table
CREATE VIRTUAL TABLE files_fts USING fts5(
  path,
  filename,
  content,
  area,
  category,
  content='files',
  content_rowid='id',
  tokenize='porter unicode61'
);

-- Triggers to keep FTS in sync
CREATE TRIGGER files_ai AFTER INSERT ON files BEGIN
  INSERT INTO files_fts(rowid, path, filename, content, area, category)
  VALUES (new.id, new.path, new.filename, new.content, new.area, new.category);
END;

CREATE TRIGGER files_ad AFTER DELETE ON files BEGIN
  INSERT INTO files_fts(files_fts, rowid, path, filename, content, area, category)
  VALUES('delete', old.id, old.path, old.filename, old.content, old.area, old.category);
END;

CREATE TRIGGER files_au AFTER UPDATE ON files BEGIN
  INSERT INTO files_fts(files_fts, rowid, path, filename, content, area, category)
  VALUES('delete', old.id, old.path, old.filename, old.content, old.area, old.category);
  INSERT INTO files_fts(rowid, path, filename, content, area, category)
  VALUES (new.id, new.path, new.filename, new.content, new.area, new.category);
END;
```

### Search API

```typescript
// server.ts
import { Database } from "bun:sqlite";

const DB_PATH = "/Volumes/VRAM/00-09_System/00_Index/search.db";
const db = new Database(DB_PATH);
db.run("PRAGMA journal_mode = WAL;");

// Prepared queries
const searchFTS = db.prepare(`
  SELECT
    path,
    filename,
    area,
    category,
    snippet(files_fts, 2, '→', '←', '...', 40) as snippet
  FROM files_fts
  WHERE files_fts MATCH $query
  ORDER BY rank
  LIMIT $limit
  OFFSET $offset
`);

const getFile = db.prepare(`SELECT * FROM files WHERE path = $path`);

const browseArea = db.prepare(`
  SELECT path, filename, extension, file_size, modified_at
  FROM files
  WHERE area = $area
  ORDER BY modified_at DESC
  LIMIT $limit
`);

const getStats = db.prepare(`
  SELECT
    COUNT(*) as total_files,
    SUM(file_size) as total_size,
    COUNT(DISTINCT area) as areas,
    MAX(indexed_at) as last_indexed
  FROM files
`);

const server = Bun.serve({
  port: 3000,

  routes: {
    "/search": {
      GET: (req) => {
        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const offset = parseInt(url.searchParams.get("offset") || "0");

        if (!q) {
          return Response.json({ error: "Missing ?q= parameter" }, { status: 400 });
        }

        const results = searchFTS.all({ $query: q, $limit: limit, $offset: offset });
        return Response.json({ query: q, results, count: results.length });
      },
    },

    "/file": {
      GET: (req) => {
        const url = new URL(req.url);
        const path = url.searchParams.get("path");

        if (!path) {
          return Response.json({ error: "Missing ?path= parameter" }, { status: 400 });
        }

        const file = getFile.get({ $path: path });
        if (!file) {
          return Response.json({ error: "File not found" }, { status: 404 });
        }

        return Response.json(file);
      },
    },

    "/browse/:area": (req) => {
      const area = req.params.area;
      const url = new URL(req.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");

      const files = browseArea.all({ $area: area, $limit: limit });
      return Response.json({ area, files, count: files.length });
    },

    "/stats": () => {
      const stats = getStats.get();
      return Response.json(stats);
    },

    "/health": new Response("OK"),
  },

  fetch(req) {
    return Response.json({ error: "Not found" }, { status: 404 });
  },
});

console.log(`Search API: http://localhost:${server.port}`);
```

---

## Automation

### Index Builder

Run this to build or rebuild the full index.

```typescript
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

const insertFile = db.prepare(`
  INSERT OR REPLACE INTO files
    (path, filename, extension, content, file_size, modified_at, area, category)
  VALUES
    ($path, $filename, $extension, $content, $size, $modified, $area, $category)
`);

// Index files
const glob = new Glob("**/*.{md,txt,json}");
let count = 0;

console.log("Indexing files...\n");

for await (const file of glob.scan(VRAM)) {
  // Skip the index database itself
  if (file.includes("00_Index/")) continue;

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
    if (count % 100 === 0) {
      console.log(`Indexed ${count} files...`);
    }
  } catch (err) {
    console.error(`Error indexing ${filepath}:`, err);
  }
}

// Rebuild FTS index
db.run(`INSERT INTO files_fts(files_fts) VALUES('rebuild')`);

console.log(`\nComplete! Indexed ${count} files.`);
```

### File Watcher

Keep the index up to date as files change.

```typescript
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

async function indexFile(filepath: string) {
  const bunFile = Bun.file(filepath);
  if (!(await bunFile.exists())) return false;

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
}

console.log(`Watching ${VRAM} for changes...`);
console.log("Press Ctrl+C to stop.\n");

watch(VRAM, { recursive: true }, async (event, filename) => {
  if (!filename) return;

  // Only index text files
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext || !["md", "txt", "json"].includes(ext)) return;

  // Skip index directory
  if (filename.includes("00_Index/")) return;

  const filepath = `${VRAM}/${filename}`;
  const timestamp = new Date().toLocaleTimeString();

  if (event === "rename") {
    const exists = await Bun.file(filepath).exists();
    if (exists) {
      await indexFile(filepath);
      console.log(`[${timestamp}] Added: ${filename}`);
    } else {
      deleteFile.run({ $path: filepath });
      console.log(`[${timestamp}] Removed: ${filename}`);
    }
  } else if (event === "change") {
    await indexFile(filepath);
    console.log(`[${timestamp}] Updated: ${filename}`);
  }
});

process.on("SIGINT", () => {
  console.log("\nStopping watcher...");
  db.close();
  process.exit(0);
});
```

---

## CLI Tool

A command-line interface for quick searches.

```typescript
// cli.ts
import { Database } from "bun:sqlite";
import { parseArgs } from "util";

const DB_PATH = "/Volumes/VRAM/00-09_System/00_Index/search.db";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    limit: { type: "string", short: "l", default: "10" },
    area: { type: "string", short: "a" },
    type: { type: "string", short: "t" },
    json: { type: "boolean", short: "j", default: false },
    stats: { type: "boolean", short: "s", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
VRAM Search CLI

Usage:
  bun cli.ts <query>              Search for files
  bun cli.ts -s                   Show index statistics

Options:
  -l, --limit <n>     Max results (default: 10)
  -a, --area <name>   Filter by area (Work, Finance, Personal, etc.)
  -t, --type <ext>    Filter by file type (md, txt, json)
  -j, --json          Output as JSON
  -s, --stats         Show index statistics
  -h, --help          Show this help

Examples:
  bun cli.ts "meeting with Emily"
  bun cli.ts "budget 2024" -a Finance -l 5
  bun cli.ts "API documentation" -t md --json
`);
  process.exit(0);
}

const db = new Database(DB_PATH, { readonly: true });

if (values.stats) {
  const stats = db.query(`
    SELECT
      COUNT(*) as total_files,
      SUM(file_size) as total_bytes,
      COUNT(DISTINCT area) as areas,
      COUNT(DISTINCT category) as categories
    FROM files
  `).get() as any;

  const byArea = db.query(`
    SELECT area, COUNT(*) as count
    FROM files
    GROUP BY area
    ORDER BY count DESC
  `).all();

  console.log("\n📊 Index Statistics\n");
  console.log(`Total files: ${stats.total_files.toLocaleString()}`);
  console.log(`Total size: ${(stats.total_bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Areas: ${stats.areas}`);
  console.log(`Categories: ${stats.categories}`);
  console.log("\nFiles by area:");
  for (const row of byArea as any[]) {
    console.log(`  ${row.area}: ${row.count.toLocaleString()}`);
  }
  console.log();
  process.exit(0);
}

const query = positionals.join(" ");
if (!query) {
  console.error("Error: No search query provided. Use -h for help.");
  process.exit(1);
}

// Build search query
let sql = `
  SELECT
    path,
    filename,
    area,
    category,
    snippet(files_fts, 2, '\x1b[33m', '\x1b[0m', '...', 40) as snippet
  FROM files_fts
  JOIN files ON files_fts.rowid = files.id
  WHERE files_fts MATCH $query
`;

const params: Record<string, any> = { $query: query };

if (values.area) {
  sql += ` AND area = $area`;
  params.$area = values.area;
}

if (values.type) {
  sql += ` AND extension = $type`;
  params.$type = values.type;
}

sql += ` ORDER BY rank LIMIT $limit`;
params.$limit = parseInt(values.limit as string);

const results = db.prepare(sql).all(params) as any[];

if (values.json) {
  console.log(JSON.stringify(results, null, 2));
} else {
  if (results.length === 0) {
    console.log(`\nNo results for "${query}"\n`);
  } else {
    console.log(`\n🔍 Found ${results.length} results for "${query}"\n`);
    for (const row of results) {
      console.log(`📄 ${row.filename}`);
      console.log(`   ${row.area} → ${row.category}`);
      console.log(`   ${row.snippet}`);
      console.log(`   ${row.path}\n`);
    }
  }
}

db.close();
```

---

## Project Setup

### Directory Structure

```
/Volumes/VRAM/00-09_System/01_Tools/search_engine/
├── package.json
├── tsconfig.json
├── server.ts           # Search API
├── indexer.ts          # Full index builder
├── watcher.ts          # File watcher daemon
└── cli.ts              # Command-line search
```

### package.json

```json
{
  "name": "vram-search",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "index": "bun run indexer.ts",
    "serve": "bun run server.ts",
    "watch": "bun run watcher.ts",
    "search": "bun run cli.ts"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["bun-types"],
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Running the System

```bash
# Navigate to the search engine directory
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Install dependencies
bun install

# Build the initial index (run once, then after major imports)
bun run index

# Start the search API (run as daemon or in background)
bun run serve &

# Start the file watcher (run as daemon or in background)
bun run watch &

# Search from command line
bun run search "meeting with Emily"
bun run search "budget" -a Finance -l 5
bun run search --stats
```

---

## Implementation Checklist

### Phase 1: Foundation

- [ ] **Create folder structure**
  - [ ] Run structure creation script
  - [ ] Verify all directories exist
  - [ ] Create `00_Index/` with empty `search.db`

- [ ] **Set up search engine project**
  - [ ] Create `/00-09_System/01_Tools/search_engine/`
  - [ ] Initialize with `bun init`
  - [ ] Add `@types/bun` dependency
  - [ ] Create `package.json` with scripts
  - [ ] Create `tsconfig.json`

### Phase 2: Data Migration

- [ ] **Migrate meetings**
  - [ ] Move transcripts to `13.01_transcripts/[year]/`
  - [ ] Move recordings to `13.02_recordings/[year]/`
  - [ ] Move metadata to `13.03_metadata/[year]/`

- [ ] **Migrate emails**
  - [ ] Move markdown emails to `14.01_emails/[year]/`
  - [ ] Verify year folder organization

- [ ] **Migrate Slack**
  - [ ] Move JSON to `14.02_slack/json/`
  - [ ] Move markdown to `14.02_slack/markdown/`

- [ ] **Migrate journals**
  - [ ] Move daily notes to `30.01_daily/`
  - [ ] Move weekly notes to `30.02_weekly/`

- [ ] **Migrate recordings**
  - [ ] Move voice memos to `31.01_voice_memos/`
  - [ ] Move Limitless to `31.02_limitless/`
  - [ ] Move Rewind to `31.03_rewind/`

- [ ] **Migrate tools**
  - [ ] Move transcription app to `01_Tools/`
  - [ ] Move other tools to appropriate locations

- [ ] **Clean up old structure**
  - [ ] Remove empty original directories
  - [ ] Verify no data loss

### Phase 3: Search Infrastructure

- [ ] **Create indexer**
  - [ ] Write `indexer.ts`
  - [ ] Test with small dataset
  - [ ] Run full index build
  - [ ] Verify file count and size

- [ ] **Create search API**
  - [ ] Write `server.ts`
  - [ ] Test `/search` endpoint
  - [ ] Test `/browse/:area` endpoint
  - [ ] Test `/stats` endpoint

- [ ] **Create CLI tool**
  - [ ] Write `cli.ts`
  - [ ] Test basic search
  - [ ] Test filters (area, type)
  - [ ] Test statistics output

- [ ] **Create file watcher**
  - [ ] Write `watcher.ts`
  - [ ] Test file addition detection
  - [ ] Test file modification detection
  - [ ] Test file deletion detection

### Phase 4: Automation

- [ ] **Set up background services**
  - [ ] Create launchd plist for search API (macOS)
  - [ ] Create launchd plist for file watcher
  - [ ] Test auto-start on login

- [ ] **Create import scripts**
  - [ ] Email import script
  - [ ] Meeting import script
  - [ ] Message export import script

- [ ] **Set up backup strategy**
  - [ ] Identify backup destination
  - [ ] Create backup script
  - [ ] Schedule regular backups

### Phase 5: Access Interfaces

- [ ] **Web UI (optional)**
  - [ ] Create simple HTML search interface
  - [ ] Serve from search API
  - [ ] Add results display
  - [ ] Add file viewer

- [ ] **Raycast extension (optional)**
  - [ ] Create Raycast script command
  - [ ] Connect to search API
  - [ ] Display results in Raycast

### Verification

- [ ] **Search all data types**
  - [ ] Search finds emails
  - [ ] Search finds transcripts
  - [ ] Search finds journal entries
  - [ ] Search finds JSON metadata

- [ ] **Performance check**
  - [ ] Search returns in <100ms
  - [ ] Index rebuild completes in reasonable time
  - [ ] Watcher doesn't spike CPU

- [ ] **Data integrity**
  - [ ] All migrated files accessible
  - [ ] No duplicate entries in index
  - [ ] File paths resolve correctly

---

## Structure Creation Script

Run this to create all directories:

```bash
#!/bin/bash
# create_structure.sh

BASE="/Volumes/VRAM"

# System
mkdir -p "$BASE/00-09_System/00_Index"
mkdir -p "$BASE/00-09_System/01_Tools/search_engine"
mkdir -p "$BASE/00-09_System/01_Tools/importers"
mkdir -p "$BASE/00-09_System/02_Config"/{scripts,automation}
mkdir -p "$BASE/00-09_System/03_Docs"

# Work
mkdir -p "$BASE/10-19_Work/10_Hacker_Valley_Media"/{10.01_episodes,10.02_guests,10.03_marketing,10.04_partnerships,10.05_operations,10.06_finance,10.07_legal,10.08_archive}
mkdir -p "$BASE/10-19_Work/11_Mozilla"/{11.01_projects,11.02_documents,11.03_pay_stubs,11.04_archive}
mkdir -p "$BASE/10-19_Work/12_Clients"
mkdir -p "$BASE/10-19_Work/13_Meetings/13.01_transcripts"/{2023,2024,2025,2026}
mkdir -p "$BASE/10-19_Work/13_Meetings/13.02_recordings"/{2023,2024,2025,2026}
mkdir -p "$BASE/10-19_Work/13_Meetings/13.03_metadata"/{2023,2024,2025,2026}
mkdir -p "$BASE/10-19_Work/14_Communications/14.01_emails"/{2020,2021,2022,2023,2024,2025}
mkdir -p "$BASE/10-19_Work/14_Communications/14.02_slack"/{json,markdown,search}
mkdir -p "$BASE/10-19_Work/14_Communications/14.03_other"
mkdir -p "$BASE/10-19_Work/15_Archive"

# Finance
mkdir -p "$BASE/20-29_Finance/20_Banking"/{20.01_checking,20.02_savings,20.03_credit_cards}
mkdir -p "$BASE/20-29_Finance/21_Investments"/{21.01_brokerage,21.02_retirement,21.03_crypto}
mkdir -p "$BASE/20-29_Finance/22_Taxes"/{22.01_2023,22.02_2024,22.03_2025,22.04_2026}
mkdir -p "$BASE/20-29_Finance/23_Insurance"/{23.01_health,23.02_life,23.03_auto,23.04_home}
mkdir -p "$BASE/20-29_Finance/24_Real_Estate"
mkdir -p "$BASE/20-29_Finance/25_Archive"

# Personal
mkdir -p "$BASE/30-39_Personal/30_Journals"/{30.01_daily,30.02_weekly,30.03_monthly}
mkdir -p "$BASE/30-39_Personal/31_Recordings"/{31.01_voice_memos,31.02_limitless,31.03_rewind}
mkdir -p "$BASE/30-39_Personal/32_Health"/{32.01_workouts,32.02_medical,32.03_nutrition}
mkdir -p "$BASE/30-39_Personal/33_Learning"/{33.01_books,33.02_courses,33.03_notes}
mkdir -p "$BASE/30-39_Personal/34_Goals"/{34.01_vision,34.02_annual,34.03_reviews}
mkdir -p "$BASE/30-39_Personal/35_Messages/35.01_imessage"/{exports,threads}
mkdir -p "$BASE/30-39_Personal/35_Messages/35.02_signal"/{exports,groups}
mkdir -p "$BASE/30-39_Personal/35_Messages/35.03_whatsapp"/{exports,groups}
mkdir -p "$BASE/30-39_Personal/35_Messages/35.04_other"
mkdir -p "$BASE/30-39_Personal/36_Archive"

# Family
mkdir -p "$BASE/40-49_Family"/{40_Memories,41_Events,42_Photos,44_Archive}
mkdir -p "$BASE/40-49_Family/43_Documents"/{legal,medical,important}

# Social
mkdir -p "$BASE/50-59_Social/50_People"/{family,friends,colleagues,clients}
mkdir -p "$BASE/50-59_Social"/{51_Events,52_Archive}

# Growth
mkdir -p "$BASE/60-69_Growth/60_Career"/{skills,achievements,portfolio}
mkdir -p "$BASE/60-69_Growth"/{61_Character,62_Emotional,63_Spiritual,64_Vision}

# Lifestyle
mkdir -p "$BASE/70-79_Lifestyle"/{70_Experiences,71_Travel,72_Environment,73_Archive}

# Resources
mkdir -p "$BASE/80-89_Resources/80_Reference"/{books,articles,research}
mkdir -p "$BASE/80-89_Resources/81_Templates"
mkdir -p "$BASE/80-89_Resources/82_Knowledge"/{how_tos,processes,standards}
mkdir -p "$BASE/80-89_Resources/83_Archive"

# Archive
mkdir -p "$BASE/90-99_Archive"/{90_Work_Archive,91_Personal_Archive,92_Project_Archive,93_Media_Archive}

echo "✓ Structure created at $BASE"
```

---

## Quick Reference

### Johnny.Decimal Areas

| Range | Area | Purpose |
|-------|------|---------|
| 00-09 | System | Tools, index, config, docs |
| 10-19 | Work | HVM, Mozilla, clients, meetings, comms |
| 20-29 | Finance | Banking, investments, taxes, insurance |
| 30-39 | Personal | Journals, recordings, health, messages |
| 40-49 | Family | Memories, photos, documents |
| 50-59 | Social | People, events |
| 60-69 | Growth | Career, character, vision |
| 70-79 | Lifestyle | Experiences, travel |
| 80-89 | Resources | Reference, templates, knowledge |
| 90-99 | Archive | Long-term storage |

### Common Commands

```bash
# Build/rebuild index
bun run index

# Start search API
bun run serve

# Start file watcher
bun run watch

# Search
bun run search "query"
bun run search "query" -a Work -l 20
bun run search --stats
```

### API Endpoints

```
GET /search?q=<query>&limit=20&offset=0
GET /file?path=<filepath>
GET /browse/:area?limit=50
GET /stats
GET /health
```

---

*Last updated: 2026-01-11*
