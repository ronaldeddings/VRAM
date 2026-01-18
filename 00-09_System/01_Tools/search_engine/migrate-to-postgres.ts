#!/usr/bin/env bun
/**
 * SQLite to PostgreSQL Migration Script
 *
 * Migrates all documents from SQLite (search.db) to PostgreSQL (documents table)
 * for unified FTS + pgvector architecture.
 */

import { Database } from "bun:sqlite";
import { SQL } from "bun";

const SQLITE_PATH = "/Volumes/VRAM/00-09_System/00_Index/search.db";
const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings";
const BATCH_SIZE = 500;

async function migrate() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   SQLite → PostgreSQL Migration        ║");
  console.log("╚════════════════════════════════════════╝\n");

  // Connect to SQLite
  console.log("📂 Connecting to SQLite...");
  const sqlite = new Database(SQLITE_PATH, { readonly: true });
  sqlite.run("PRAGMA journal_mode = WAL;");

  // Connect to PostgreSQL
  console.log("🐘 Connecting to PostgreSQL...");
  const postgres = new SQL(POSTGRES_URL);

  // Get total count from SQLite
  const countResult = sqlite.query("SELECT COUNT(*) as count FROM files").get() as { count: number };
  const totalRows = countResult.count;
  console.log(`\n📊 Found ${totalRows.toLocaleString()} documents to migrate\n`);

  // Prepare SQLite query
  const selectStmt = sqlite.query(`
    SELECT
      path,
      filename,
      extension,
      content,
      file_size,
      modified_at,
      indexed_at,
      area,
      category
    FROM files
    LIMIT ? OFFSET ?
  `);

  let migrated = 0;
  let errors = 0;
  let offset = 0;
  const startTime = Date.now();

  while (offset < totalRows) {
    const rows = selectStmt.all(BATCH_SIZE, offset) as any[];

    if (rows.length === 0) break;

    // Insert batch into PostgreSQL
    for (const row of rows) {
      try {
        await postgres.unsafe(`
          INSERT INTO documents (path, filename, extension, content, file_size, modified_at, indexed_at, area, category)
          VALUES ($1, $2, $3, $4, $5, $6::timestamptz, $7::timestamptz, $8, $9)
          ON CONFLICT (path) DO UPDATE SET
            filename = EXCLUDED.filename,
            extension = EXCLUDED.extension,
            content = EXCLUDED.content,
            file_size = EXCLUDED.file_size,
            modified_at = EXCLUDED.modified_at,
            indexed_at = NOW(),
            area = EXCLUDED.area,
            category = EXCLUDED.category
        `, [
          row.path,
          row.filename,
          row.extension,
          row.content,
          row.file_size,
          row.modified_at ? new Date(row.modified_at) : null,
          row.indexed_at ? new Date(row.indexed_at) : new Date(),
          row.area,
          row.category
        ]);
        migrated++;
      } catch (err) {
        errors++;
        if (errors <= 5) {
          console.error(`Error migrating ${row.path}:`, err);
        }
      }
    }

    offset += rows.length;

    // Progress update
    const percent = ((offset / totalRows) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = (migrated / parseFloat(elapsed)).toFixed(0);
    process.stdout.write(`\r⏳ Progress: ${offset.toLocaleString()}/${totalRows.toLocaleString()} (${percent}%) | ${rate} docs/sec | Errors: ${errors}`);
  }

  console.log("\n");

  // Link documents to existing chunks
  console.log("🔗 Linking documents to chunks...");
  const linkResult = await postgres.unsafe(`
    UPDATE chunks c
    SET document_id = d.id
    FROM documents d
    WHERE c.file_path = d.path
      AND c.document_id IS NULL
  `);
  console.log(`   Linked ${linkResult.count} chunks to documents`);

  // Verify counts
  const pgCount = await postgres`SELECT COUNT(*)::int as count FROM documents`;
  const pgTotal = (pgCount[0] as any).count;

  console.log("\n╔════════════════════════════════════════╗");
  console.log("║           Migration Complete!          ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  SQLite documents:    ${totalRows.toLocaleString().padStart(12)}  ║`);
  console.log(`║  PostgreSQL documents:${pgTotal.toLocaleString().padStart(12)}  ║`);
  console.log(`║  Migrated:            ${migrated.toLocaleString().padStart(12)}  ║`);
  console.log(`║  Errors:              ${errors.toLocaleString().padStart(12)}  ║`);
  console.log(`║  Time:                ${((Date.now() - startTime) / 1000).toFixed(1).padStart(10)}s  ║`);
  console.log("╚════════════════════════════════════════╝");

  // Cleanup
  sqlite.close();
  await postgres.close();

  if (errors > 0) {
    console.log(`\n⚠️  ${errors} documents failed to migrate. Check errors above.`);
  } else {
    console.log("\n✅ All documents migrated successfully!");
  }
}

migrate().catch(console.error);
