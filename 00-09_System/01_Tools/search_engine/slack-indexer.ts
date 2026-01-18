/**
 * Slack Embedding Indexer
 *
 * Indexes Slack JSON exports into PostgreSQL with pgvector.
 * Uses Qwen3-VL-Embedding-8B model (4096 dimensions) via port 8081.
 */

import { SQL } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { chunkSlackDay, iterateSlackChannels, countSlackDays } from "./slack-chunker";

const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings";

async function indexSlack() {
  console.log("VRAM Slack Embedding Indexer\n");
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

  // Count total for progress
  const { channels: totalChannels, days: totalDays } = await countSlackDays();
  console.log(`Found ${totalChannels} channels with ${totalDays.toLocaleString()} day files to process.\n`);

  let channelsProcessed = 0;
  let daysProcessed = 0;
  let totalChunks = 0;
  let skipped = 0;
  let errors = 0;

  const startTime = performance.now();
  let currentChannel = "";
  let channelDays = 0;

  for await (const { channel, date, messages } of iterateSlackChannels()) {
    // Track channel progress
    if (channel !== currentChannel) {
      if (currentChannel) {
        console.log(`  └─ ${currentChannel}: ${channelDays} days processed`);
      }
      currentChannel = channel;
      channelsProcessed++;
      channelDays = 0;
      console.log(`\n📁 ${channel}`);
    }

    try {
      // Check if already indexed
      const existing = await sql`
        SELECT COUNT(*)::int as cnt FROM slack_chunks
        WHERE channel = ${channel} AND message_date = ${date}::date
      `;

      if ((existing[0] as { cnt: number }).cnt > 0) {
        skipped++;
        daysProcessed++;
        channelDays++;
        continue;
      }

      // Chunk and embed
      const chunks = chunkSlackDay(messages, channel, date);

      if (chunks.length === 0) {
        daysProcessed++;
        channelDays++;
        continue;
      }

      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.text);

        // Format embedding as PostgreSQL vector literal
        const vectorLiteral = `[${embedding.join(",")}]`;

        // Format arrays as PostgreSQL array literals
        const speakersArray = chunk.speakers && chunk.speakers.length > 0
          ? `{${chunk.speakers.map(s => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
          : null;
        const userIdsArray = chunk.userIds && chunk.userIds.length > 0
          ? `{${chunk.userIds.map(s => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
          : null;

        await sql.unsafe(`
          INSERT INTO slack_chunks (
            channel, channel_type, speakers, user_ids,
            start_ts, end_ts, message_date, message_count,
            has_files, has_reactions,
            chunk_index, chunk_text, chunk_size, embedding
          ) VALUES (
            $1, $2, $3::text[], $4::text[], $5, $6, $7::date, $8, $9, $10, $11, $12, $13, $14::vector
          )
        `, [
          chunk.channel,
          chunk.channelType,
          speakersArray,
          userIdsArray,
          chunk.startTs,
          chunk.endTs,
          chunk.date,
          chunk.messageCount,
          chunk.hasFiles,
          chunk.hasReactions,
          chunk.index,
          chunk.text,
          chunk.text.length,
          vectorLiteral
        ]);

        totalChunks++;
      }

      daysProcessed++;
      channelDays++;

    } catch (err) {
      console.error(`  ❌ ${date}: ${err}`);
      errors++;
      daysProcessed++;
      channelDays++;
    }
  }

  // Final channel summary
  if (currentChannel) {
    console.log(`  └─ ${currentChannel}: ${channelDays} days processed`);
  }

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("Slack Indexing Complete!\n");
  console.log(`  Channels processed: ${channelsProcessed}`);
  console.log(`  Days processed: ${daysProcessed.toLocaleString()}`);
  console.log(`  Chunks created: ${totalChunks.toLocaleString()}`);
  console.log(`  Skipped (existing): ${skipped.toLocaleString()}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Time: ${(elapsed / 60).toFixed(1)} min`);
  console.log("=".repeat(50));

  await sql.close();
}

indexSlack().catch(console.error);
