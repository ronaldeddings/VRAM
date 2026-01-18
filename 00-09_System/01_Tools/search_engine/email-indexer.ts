/**
 * Email Embedding Indexer
 *
 * Indexes Gmail JSON exports into PostgreSQL with pgvector.
 * Uses Qwen3-VL-Embedding-8B model (4096 dimensions) via port 8081.
 */

import { SQL } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { chunkEmail, iterateEmails, countEmails } from "./email-chunker";

const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings";

async function indexEmails() {
  console.log("VRAM Email Embedding Indexer\n");
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
    await sql`SELECT version()`;
    console.log("✅ PostgreSQL connected\n");
  } catch (err) {
    console.error("❌ PostgreSQL not available:", err);
    process.exit(1);
  }

  // Count total emails for progress
  const totalEmails = await countEmails();
  console.log(`Found approximately ${totalEmails.toLocaleString()} emails to process.\n`);

  let processed = 0;
  let totalChunks = 0;
  let skipped = 0;
  let errors = 0;

  const startTime = performance.now();

  for await (const { path, email } of iterateEmails()) {
    try {
      // Check if already indexed
      const existing = await sql`
        SELECT COUNT(*)::int as cnt FROM email_chunks WHERE email_id = ${email.id.hash}
      `;

      if ((existing[0] as { cnt: number }).cnt > 0) {
        skipped++;
        processed++;
        continue;
      }

      // Chunk and embed
      const chunks = chunkEmail(email, path);

      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.text);

        // Format embedding as PostgreSQL vector literal
        const vectorLiteral = `[${embedding.join(",")}]`;

        // Format arrays as PostgreSQL array literals
        const toEmailsArray = chunk.toEmails && chunk.toEmails.length > 0
          ? `{${chunk.toEmails.map(s => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
          : null;
        const labelsArray = chunk.labels && chunk.labels.length > 0
          ? `{${chunk.labels.map(s => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
          : null;

        await sql.unsafe(`
          INSERT INTO email_chunks (
            email_id, email_path, subject, from_name, from_email,
            to_emails, email_date, labels, has_attachments, is_reply,
            chunk_index, chunk_text, chunk_size, embedding
          ) VALUES (
            $1, $2, $3, $4, $5, $6::text[], $7::timestamptz, $8::text[], $9, $10, $11, $12, $13, $14::vector
          )
        `, [
          chunk.emailId,
          chunk.emailPath,
          chunk.subject,
          chunk.fromName,
          chunk.fromEmail,
          toEmailsArray,
          chunk.date,
          labelsArray,
          chunk.hasAttachments,
          chunk.isReply,
          chunk.index,
          chunk.text,
          chunk.text.length,
          vectorLiteral
        ]);

        totalChunks++;
      }

      const subjectPreview = (email.headers.subject || "(No Subject)").substring(0, 50);
      console.log(`✅ ${subjectPreview}...`);
      processed++;

      // Progress update every 100 emails
      if (processed % 100 === 0) {
        const elapsed = (performance.now() - startTime) / 1000;
        console.log(`\n[Progress: ${processed.toLocaleString()}] Chunks: ${totalChunks.toLocaleString()} | Rate: ${(processed / elapsed).toFixed(1)}/s\n`);
      }

    } catch (err) {
      console.error(`❌ ${email.id.hash}: ${err}`);
      errors++;
      processed++;
    }
  }

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("Email Indexing Complete!\n");
  console.log(`  Emails processed: ${processed.toLocaleString()}`);
  console.log(`  Chunks created: ${totalChunks.toLocaleString()}`);
  console.log(`  Skipped (existing): ${skipped.toLocaleString()}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Time: ${(elapsed / 60).toFixed(1)} min`);
  console.log("=".repeat(50));

  await sql.close();
}

indexEmails().catch(console.error);
