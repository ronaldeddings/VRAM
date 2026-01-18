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
  `).get() as Record<string, number>;

  const byArea = db.query(`
    SELECT area, COUNT(*) as count
    FROM files
    GROUP BY area
    ORDER BY count DESC
  `).all() as Array<{ area: string; count: number }>;

  const byExtension = db.query(`
    SELECT extension, COUNT(*) as count
    FROM files
    GROUP BY extension
    ORDER BY count DESC
  `).all() as Array<{ extension: string; count: number }>;

  console.log("\n📊 Index Statistics\n");
  console.log(`Total files: ${stats.total_files.toLocaleString()}`);
  console.log(`Total size: ${(stats.total_bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Areas: ${stats.areas}`);
  console.log(`Categories: ${stats.categories}`);
  console.log("\nFiles by area:");
  for (const row of byArea) {
    console.log(`  ${row.area}: ${row.count.toLocaleString()}`);
  }
  console.log("\nFiles by type:");
  for (const row of byExtension) {
    console.log(`  .${row.extension}: ${row.count.toLocaleString()}`);
  }
  console.log();
  db.close();
  process.exit(0);
}

const query = positionals.join(" ");
if (!query) {
  console.error("Error: No search query provided. Use -h for help.");
  process.exit(1);
}

// Build search query with JOIN to get proper columns
let sql = `
  SELECT
    files.path,
    files.filename,
    files.area,
    files.category,
    files.extension,
    snippet(files_fts, 2, '\x1b[33m', '\x1b[0m', '...', 40) as snippet
  FROM files_fts
  JOIN files ON files_fts.rowid = files.id
  WHERE files_fts MATCH $query
`;

const params: Record<string, unknown> = { $query: query };

if (values.area) {
  sql += ` AND files.area = $area`;
  params.$area = values.area;
}

if (values.type) {
  sql += ` AND files.extension = $type`;
  params.$type = values.type;
}

sql += ` ORDER BY rank LIMIT $limit`;
params.$limit = parseInt(values.limit as string);

const startTime = performance.now();
const results = db.prepare(sql).all(params) as Array<{
  path: string;
  filename: string;
  area: string;
  category: string;
  extension: string;
  snippet: string;
}>;
const elapsed = performance.now() - startTime;

if (values.json) {
  console.log(JSON.stringify({ query, results, count: results.length, time_ms: elapsed.toFixed(2) }, null, 2));
} else {
  if (results.length === 0) {
    console.log(`\nNo results for "${query}"\n`);
  } else {
    console.log(`\n🔍 Found ${results.length} results for "${query}" (${elapsed.toFixed(1)}ms)\n`);
    for (const row of results) {
      console.log(`📄 ${row.filename}`);
      console.log(`   ${row.area} → ${row.category}`);
      console.log(`   ${row.snippet}`);
      console.log(`   ${row.path}\n`);
    }
  }
}

db.close();
