#!/usr/bin/env bun
// cli.ts - PostgreSQL Version
/**
 * Command-line search interface for VRAM
 * Uses PostgreSQL tsvector for full-text search
 */

import { parseArgs } from "util";
import { unifiedKeywordSearch, getFTSStats, type UnifiedFTSResult } from "./pg-fts";
import { getConnection, closeConnection } from "./pg-client";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    limit: { type: "string", short: "l", default: "10" },
    area: { type: "string", short: "a" },
    type: { type: "string", short: "t" },
    sources: { type: "string", default: "file,transcript,email,slack" },
    speaker: { type: "string" },
    json: { type: "boolean", short: "j", default: false },
    stats: { type: "boolean", short: "s", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
VRAM Search CLI (PostgreSQL - Unified FTS)

Usage:
  bun cli.ts <query>              Search across all sources
  bun cli.ts -s                   Show index statistics

Options:
  -l, --limit <n>         Max results (default: 10)
  -a, --area <name>       Filter by area (Work, Finance, Personal, etc.)
  -t, --type <ext>        Filter by file type (md, txt, json)
      --sources <list>    Comma-separated sources (default: file,transcript,email,slack)
      --speaker <name>    Filter transcripts by speaker name
  -j, --json              Output as JSON
  -s, --stats             Show index statistics
  -h, --help              Show this help

Sources:
  file        - Regular files (documents, notes)
  transcript  - Meeting transcripts (speaker-aware)
  email       - Email messages
  slack       - Slack messages

Examples:
  bun cli.ts "meeting with Emily"
  bun cli.ts "budget 2024" -a Finance -l 5
  bun cli.ts "API documentation" -t md --json
  bun cli.ts "project update" --sources transcript --speaker "Ronald"
  bun cli.ts "quarterly review" --sources email,slack
`);
  process.exit(0);
}

async function showStats() {
  const stats = await getFTSStats();

  const sql = getConnection();
  const byArea = await sql`
    SELECT area, COUNT(*)::int as count
    FROM documents
    GROUP BY area
    ORDER BY count DESC
  `;

  const byExtension = await sql`
    SELECT extension, COUNT(*)::int as count
    FROM documents
    GROUP BY extension
    ORDER BY count DESC
  `;

  console.log("\n📊 Index Statistics (PostgreSQL)\n");
  console.log(`Total files: ${stats.totalFiles.toLocaleString()}`);
  console.log(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Areas: ${stats.areas}`);
  console.log(`Categories: ${stats.categories}`);
  console.log(`Last indexed: ${stats.lastIndexed || "N/A"}`);
  console.log("\nFiles by area:");
  for (const row of byArea) {
    console.log(`  ${(row as any).area || "Unknown"}: ${(row as any).count.toLocaleString()}`);
  }
  console.log("\nFiles by type:");
  for (const row of byExtension) {
    console.log(`  .${(row as any).extension || "none"}: ${(row as any).count.toLocaleString()}`);
  }
  console.log();
  await closeConnection();
  process.exit(0);
}

async function search() {
  const query = positionals.join(" ");
  if (!query) {
    console.error("Error: No search query provided. Use -h for help.");
    process.exit(1);
  }

  const limit = parseInt(values.limit as string);
  const area = values.area as string | undefined;
  const extension = values.type as string | undefined;
  const sourcesStr = values.sources as string;
  const sources = sourcesStr.split(",").filter(s => ["file", "transcript", "email", "slack"].includes(s)) as ("file" | "transcript" | "email" | "slack")[];
  const speaker = values.speaker as string | undefined;

  const startTime = performance.now();

  try {
    let results = await unifiedKeywordSearch(query, { limit, sources, area, speaker, extension });

    const elapsed = performance.now() - startTime;

    // Source icons for display
    const sourceIcons: Record<string, string> = {
      file: "📄",
      transcript: "🎙️",
      email: "📧",
      slack: "💬"
    };

    if (values.json) {
      console.log(JSON.stringify({
        query,
        sources,
        speaker: speaker || null,
        results: results.map(r => ({
          source: r.source,
          path: r.path,
          title: r.title,
          area: r.area,
          category: r.category,
          snippet: r.snippet,
          metadata: r.metadata
        })),
        count: results.length,
        time_ms: elapsed.toFixed(2),
        backend: "postgresql_unified_fts"
      }, null, 2));
    } else {
      if (results.length === 0) {
        console.log(`\nNo results for "${query}" in [${sources.join(", ")}]${speaker ? ` (speaker: ${speaker})` : ""}\n`);
      } else {
        console.log(`\n🔍 Found ${results.length} results for "${query}" (${elapsed.toFixed(1)}ms)\n`);
        for (const row of results) {
          const icon = sourceIcons[row.source] || "📄";
          console.log(`${icon} ${row.title} [${row.source}]`);
          console.log(`   ${row.area} → ${row.category}`);
          // Show speakers for transcripts
          if (row.source === "transcript" && row.metadata?.speakers?.length > 0) {
            console.log(`   🎤 ${row.metadata.speakers.slice(0, 3).join(", ")}${row.metadata.speakers.length > 3 ? "..." : ""}`);
          }
          // Convert PostgreSQL highlighting markers to terminal colors
          const coloredSnippet = row.snippet
            .replace(/→/g, '\x1b[33m')
            .replace(/←/g, '\x1b[0m');
          console.log(`   ${coloredSnippet}`);
          console.log(`   ${row.path}\n`);
        }
      }
    }
  } catch (err: any) {
    console.error(`Search error: ${err.message}`);
    process.exit(1);
  }

  await closeConnection();
}

// Main
if (values.stats) {
  showStats();
} else {
  search();
}
