/**
 * pgvector Embedding Indexer
 *
 * Indexes VRAM files into PostgreSQL with pgvector using smart chunking.
 * Uses Qwen3-VL-Embedding-8B model (4096 dimensions) via port 8081.
 */

import { Database } from "bun:sqlite";
import { SQL } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { smartChunk, isTranscript } from "./smart-chunker";

const SEARCH_DB = "/Volumes/VRAM/00-09_System/00_Index/search.db";
const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings";
const BATCH_SIZE = 10;

interface FileRecord {
  id: number;
  path: string;
  filename: string;
  content: string | null;
  area: string;
  category: string;
}

async function main() {
  console.log("VRAM pgvector Embedding Indexer\n");
  console.log("=".repeat(50));
  console.log("Model: Qwen3-VL-Embedding-8B (4096 dimensions)");
  console.log("Port: 8081");
  console.log("=".repeat(50));

  // Check Qwen3-VL embedding server
  console.log("\nChecking Qwen3-VL embedding server...");
  try {
    const health = await checkHealth();
    console.log(`✅ Embedding server ready: ${health.model || "Qwen3-VL"}`);
  } catch (err) {
    console.error("❌ Embedding server not available at port 8081");
    console.error("   Run: llama-server -m Qwen3-VL-Embedding-8B.gguf --port 8081");
    process.exit(1);
  }

  // Check PostgreSQL connection
  console.log("\nChecking PostgreSQL...");
  let sql: SQL;
  try {
    sql = new SQL(POSTGRES_URL);
    const result = await sql`SELECT version()`;
    console.log("✅ PostgreSQL connected\n");
  } catch (err) {
    console.error("❌ PostgreSQL not available:", err);
    process.exit(1);
  }

  const searchDb = new Database(SEARCH_DB, { readonly: true });

  const getFiles = searchDb.prepare(`
    SELECT id, path, filename, content, area, category
    FROM files
    WHERE extension IN ('md', 'txt')
    ORDER BY id
    LIMIT $limit OFFSET $offset
  `);

  const getFileCount = searchDb.prepare(`
    SELECT COUNT(*) as count FROM files WHERE extension IN ('md', 'txt')
  `);

  const { count: totalFiles } = getFileCount.get() as { count: number };
  console.log(`Found ${totalFiles.toLocaleString()} text files to process.\n`);

  let processed = 0;
  let totalChunks = 0;
  let skipped = 0;
  let errors = 0;
  let offset = 0;

  const startTime = performance.now();

  while (offset < totalFiles) {
    const files = getFiles.all({ $limit: BATCH_SIZE, $offset: offset }) as FileRecord[];

    for (const file of files) {
      try {
        // Check if file already indexed
        const existing = await sql`
          SELECT COUNT(*)::int as cnt FROM chunks WHERE file_path = ${file.path}
        `;

        if ((existing[0] as { cnt: number }).cnt > 0) {
          skipped++;
          processed++;
          continue;
        }

        // Smart chunk the content
        const chunks = smartChunk(file.content || "", file.path);

        if (chunks.length === 0) {
          skipped++;
          processed++;
          continue;
        }

        // Determine content_type based on file content or speakers
        const fileIsTranscript = isTranscript(file.content || "");

        // Generate embeddings for all chunks
        for (const chunk of chunks) {
          const embedding = await generateEmbedding(chunk.text);

          // Format embedding as PostgreSQL vector literal
          const vectorLiteral = `[${embedding.join(",")}]`;

          // Format speakers as PostgreSQL array literal
          const speakersArray = chunk.speakers && chunk.speakers.length > 0
            ? `{${chunk.speakers.map(s => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
            : null;

          // Determine content_type for this chunk (transcript if file is transcript or chunk has speakers)
          const chunkIsTranscript = fileIsTranscript || (chunk.speakers && chunk.speakers.length > 0);
          const contentType = chunkIsTranscript ? "transcript" : "file";

          await sql.unsafe(`
            INSERT INTO chunks (
              file_id, file_path, filename, area, category,
              chunk_index, chunk_text, chunk_size,
              speakers, start_time, end_time, embedding,
              content_type, search_vector
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9::text[], $10, $11, $12::vector,
              $13,
              setweight(to_tsvector('english', coalesce(array_to_string($9::text[], ' '), '')), 'A') ||
              setweight(to_tsvector('english', coalesce($7, '')), 'B')
            )
          `, [
            file.id,
            file.path,
            file.filename,
            file.area,
            file.category,
            chunk.index,
            chunk.text,
            chunk.text.length,
            speakersArray,
            chunk.startTime || null,
            chunk.endTime || null,
            vectorLiteral,
            contentType
          ]);

          totalChunks++;
        }

        console.log(`✅ ${file.filename}: ${chunks.length} chunk(s)`);
        processed++;

      } catch (err) {
        console.error(`❌ ${file.filename}: ${err}`);
        errors++;
        processed++;
      }
    }

    offset += BATCH_SIZE;

    // Progress update every 100 files
    if (offset % 100 === 0) {
      const elapsed = (performance.now() - startTime) / 1000;
      const rate = processed / elapsed;
      const eta = (totalFiles - processed) / rate;
      console.log(`\n[Progress: ${processed.toLocaleString()}/${totalFiles.toLocaleString()}] Rate: ${rate.toFixed(1)}/s ETA: ${(eta / 60).toFixed(1)}min\n`);
    }
  }

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("Indexing Complete!\n");
  console.log(`  Files processed: ${processed.toLocaleString()}`);
  console.log(`  Chunks created: ${totalChunks.toLocaleString()}`);
  console.log(`  Skipped (existing): ${skipped.toLocaleString()}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Time: ${elapsed.toFixed(1)}s`);
  console.log(`  Avg: ${(elapsed / processed * 1000).toFixed(0)}ms/file`);
  console.log("=".repeat(50));

  searchDb.close();
  await sql.close();
}

main().catch(console.error);
