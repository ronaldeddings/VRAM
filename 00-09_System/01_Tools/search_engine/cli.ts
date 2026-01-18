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
    // New enhanced filters
    year: { type: "string", short: "y" },
    month: { type: "string", short: "m" },
    quarter: { type: "string", short: "q" },
    person: { type: "string", short: "p" },
    company: { type: "string", short: "c" },
    "sent-by-me": { type: "boolean", default: false },
    "has-attachments": { type: "boolean", default: false },
    "internal": { type: "boolean", short: "i", default: false },
    json: { type: "boolean", short: "j", default: false },
    stats: { type: "boolean", short: "s", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
VRAM Search CLI (PostgreSQL - Unified FTS with Enhanced Metadata)

Usage:
  bun cli.ts <query>              Search across all sources
  bun cli.ts -s                   Show index statistics

Basic Options:
  -l, --limit <n>         Max results (default: 10)
  -a, --area <name>       Filter by area (Work, Finance, Personal, etc.)
  -t, --type <ext>        Filter by file type (md, txt, json)
      --sources <list>    Comma-separated sources (default: file,transcript,email,slack)
      --speaker <name>    Filter transcripts by speaker name
  -j, --json              Output as JSON
  -s, --stats             Show index statistics
  -h, --help              Show this help

Enhanced Filters:
  -y, --year <year>       Filter by year (e.g., 2024, 2025)
  -m, --month <1-12>      Filter by month
  -q, --quarter <1-4>     Filter by quarter
  -p, --person <name>     Filter by person name or email
  -c, --company <name>    Filter by company name
      --sent-by-me        Only show emails/messages sent by me
      --has-attachments   Only show emails with attachments
  -i, --internal          Only show internal meetings/messages

Sources:
  file        - Regular files (documents, notes)
  transcript  - Meeting transcripts (speaker-aware)
  email       - Email messages (with threading, attachments)
  slack       - Slack messages (with threads, reactions)

Examples:
  bun cli.ts "meeting with Emily"
  bun cli.ts "budget 2024" -a Finance -l 5
  bun cli.ts "API documentation" -t md --json
  bun cli.ts "project update" --sources transcript --speaker "Ronald"
  bun cli.ts "quarterly review" --sources email,slack

Enhanced Filter Examples:
  bun cli.ts "project" -y 2024 -q 4              # Q4 2024 only
  bun cli.ts "invoice" -p "john@example.com"    # From/to specific person
  bun cli.ts "meeting" -c "Acme Corp"           # With specific company
  bun cli.ts "attachment" --has-attachments     # Emails with attachments
  bun cli.ts "standup" --internal               # Internal meetings only
  bun cli.ts "sent report" --sent-by-me         # Emails I sent
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

  // Enhanced filters
  const year = values.year ? parseInt(values.year as string) : undefined;
  const month = values.month ? parseInt(values.month as string) : undefined;
  const quarter = values.quarter ? parseInt(values.quarter as string) : undefined;
  const person = values.person as string | undefined;
  const company = values.company as string | undefined;
  const sentByMe = values["sent-by-me"] as boolean | undefined;
  const hasAttachments = values["has-attachments"] as boolean | undefined;
  const isInternal = values["internal"] as boolean | undefined;

  const startTime = performance.now();

  try {
    let results = await unifiedKeywordSearch(query, {
      limit,
      sources,
      area,
      speaker,
      extension,
      year,
      month,
      quarter,
      person,
      company,
      sentByMe: sentByMe || undefined,
      hasAttachments: hasAttachments || undefined,
      isInternal: isInternal || undefined
    });

    const elapsed = performance.now() - startTime;

    // Source icons for display
    const sourceIcons: Record<string, string> = {
      file: "📄",
      transcript: "🎙️",
      email: "📧",
      slack: "💬"
    };

    // Build filter summary for display
    const activeFilters: string[] = [];
    if (year) activeFilters.push(`year:${year}`);
    if (quarter) activeFilters.push(`Q${quarter}`);
    if (month) activeFilters.push(`month:${month}`);
    if (person) activeFilters.push(`person:${person}`);
    if (company) activeFilters.push(`company:${company}`);
    if (sentByMe) activeFilters.push("sent-by-me");
    if (hasAttachments) activeFilters.push("has-attachments");
    if (isInternal) activeFilters.push("internal-only");

    if (values.json) {
      console.log(JSON.stringify({
        query,
        sources,
        speaker: speaker || null,
        filters: {
          year, month, quarter, person, company,
          sentByMe: sentByMe || false,
          hasAttachments: hasAttachments || false,
          isInternal: isInternal || false
        },
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
        backend: "postgresql_unified_fts_enhanced"
      }, null, 2));
    } else {
      if (results.length === 0) {
        const filterStr = activeFilters.length > 0 ? ` [${activeFilters.join(", ")}]` : "";
        console.log(`\nNo results for "${query}" in [${sources.join(", ")}]${speaker ? ` (speaker: ${speaker})` : ""}${filterStr}\n`);
      } else {
        const filterStr = activeFilters.length > 0 ? ` | Filters: ${activeFilters.join(", ")}` : "";
        console.log(`\n🔍 Found ${results.length} results for "${query}" (${elapsed.toFixed(1)}ms)${filterStr}\n`);
        for (const row of results) {
          const icon = sourceIcons[row.source] || "📄";
          console.log(`${icon} ${row.title} [${row.source}]`);
          console.log(`   ${row.area} → ${row.category}`);

          // Show metadata badges
          const meta = row.metadata || {};
          const badges: string[] = [];

          if (row.source === "email") {
            if (meta.has_attachments) badges.push("📎");
            if (meta.is_reply) badges.push("↩ reply");
            if (meta.from_name) badges.push(`👤 ${meta.from_name}`);
          } else if (row.source === "slack") {
            if (meta.is_thread_reply) badges.push("🧵 thread");
            if (meta.has_reactions) badges.push("😀");
            if (meta.channel) badges.push(`#${meta.channel}`);
          } else if (row.source === "transcript") {
            if (meta.is_internal !== undefined) {
              badges.push(meta.is_internal ? "🏠 internal" : "🌐 external");
            }
            if (meta.duration_minutes) badges.push(`⏱ ${meta.duration_minutes}m`);
          }

          // Show year/month if available
          if (meta.year) {
            badges.push(`📅 ${meta.year}${meta.month ? '/' + String(meta.month).padStart(2, '0') : ''}`);
          }

          if (badges.length > 0) {
            console.log(`   ${badges.join(" | ")}`);
          }

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
