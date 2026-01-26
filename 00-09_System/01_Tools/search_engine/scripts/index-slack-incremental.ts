#!/usr/bin/env bun
/**
 * index-slack-incremental.ts - Incremental Slack Search Engine Indexer
 *
 * Indexes only new/updated channels to PostgreSQL with pgvector embeddings.
 * Much faster than full reindex when only a few channels have changed.
 *
 * Can be used standalone or imported by slack-sync.ts
 */

import { SQL } from "bun";
import { readdir } from "node:fs/promises";

const CONFIG = {
  slackBase: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json",
  postgresUrl: process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings",
  embeddingPort: 8081,
  chunkConfig: {
    targetSize: 1800,
    minSize: 500,
    maxSize: 2200,
    overlap: 300,
    timeWindowMinutes: 15,
  },
};

// Types
interface SlackMessage {
  client_msg_id?: string;
  type: string;
  user: string;
  text: string;
  ts: string;
  edited?: { ts: string };
  user_profile?: {
    name: string;
    display_name: string;
    real_name: string;
  };
  reactions?: Array<{ name: string; users: string[]; count: number }>;
  thread_ts?: string;
  reply_count?: number;
  files?: Array<{ name: string; filetype: string; size: number }>;
}

interface SlackChunk {
  text: string;
  index: number;
  channel: string;
  channelType: "public" | "private" | "dm" | "group_dm";
  speakers: string[];
  userIds: string[];
  startTs: string;
  endTs: string;
  date: string;
  messageCount: number;
  hasFiles: boolean;
  hasReactions: boolean;
}

// Embedding client
async function checkEmbeddingServer(): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${CONFIG.embeddingPort}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`http://localhost:${CONFIG.embeddingPort}/embedding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text }),
  });

  if (!response.ok) {
    throw new Error(`Embedding failed: ${response.statusText}`);
  }

  const data = await response.json();
  // API returns array of [{index, embedding}] - extract first embedding
  if (Array.isArray(data) && data[0]?.embedding) {
    return data[0].embedding;
  }
  // Fallback for direct embedding response
  return data.embedding;
}

// Channel type detection
function detectChannelType(channelName: string): SlackChunk["channelType"] {
  if (channelName.startsWith("mpdm-")) return "group_dm";
  if (channelName.startsWith("D")) return "dm";
  return "private"; // Default, could check metadata for public
}

// Message formatting
function formatMessage(msg: SlackMessage): string {
  const userName =
    msg.user_profile?.display_name ||
    msg.user_profile?.real_name ||
    msg.user_profile?.name ||
    msg.user;

  const timestamp = new Date(parseFloat(msg.ts) * 1000);
  const time = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let formatted = `[${time}] ${userName}: ${msg.text}`;

  if (msg.files && msg.files.length > 0) {
    const fileNames = msg.files.map((f) => f.name).join(", ");
    formatted += `\n[Attached: ${fileNames}]`;
  }

  if (msg.reactions && msg.reactions.length > 0) {
    const reactions = msg.reactions.map((r) => `:${r.name}:x${r.count}`).join(" ");
    formatted += `\n[Reactions: ${reactions}]`;
  }

  return formatted;
}

// Time window grouping
function groupByTimeWindow(messages: SlackMessage[]): SlackMessage[][] {
  if (messages.length === 0) return [];

  const windowMs = CONFIG.chunkConfig.timeWindowMinutes * 60 * 1000;
  const groups: SlackMessage[][] = [];
  let currentGroup: SlackMessage[] = [];
  let windowStart = parseFloat(messages[0].ts) * 1000;

  for (const msg of messages) {
    const msgTime = parseFloat(msg.ts) * 1000;

    if (msgTime - windowStart > windowMs && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [msg];
      windowStart = msgTime;
    } else {
      currentGroup.push(msg);
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

// Chunk a day's messages
function chunkSlackDay(
  messages: SlackMessage[],
  channel: string,
  date: string
): SlackChunk[] {
  const userMessages = messages.filter(
    (m) => m.type === "message" && m.user && m.text && m.text.trim().length > 0
  );

  if (userMessages.length === 0) return [];

  const timeGroups = groupByTimeWindow(userMessages);
  const channelType = detectChannelType(channel);
  const chunks: SlackChunk[] = [];

  for (const group of timeGroups) {
    let groupText = "";
    const speakers = new Set<string>();
    const userIds = new Set<string>();
    let hasFiles = false;
    let hasReactions = false;

    for (const msg of group) {
      groupText += formatMessage(msg) + "\n\n";

      const speaker =
        msg.user_profile?.display_name || msg.user_profile?.real_name || msg.user;
      speakers.add(speaker);
      userIds.add(msg.user);

      if (msg.files && msg.files.length > 0) hasFiles = true;
      if (msg.reactions && msg.reactions.length > 0) hasReactions = true;
    }

    groupText = groupText.trim();

    if (groupText.length < CONFIG.chunkConfig.minSize) continue;

    if (groupText.length <= CONFIG.chunkConfig.maxSize) {
      chunks.push({
        text: groupText,
        index: chunks.length,
        channel,
        channelType,
        speakers: Array.from(speakers),
        userIds: Array.from(userIds),
        startTs: group[0].ts,
        endTs: group[group.length - 1].ts,
        date,
        messageCount: group.length,
        hasFiles,
        hasReactions,
      });
    } else {
      // Split large groups
      let start = 0;
      while (start < groupText.length) {
        let end = Math.min(start + CONFIG.chunkConfig.targetSize, groupText.length);

        if (end < groupText.length) {
          const nextBreak = groupText.indexOf("\n\n", end - 200);
          if (nextBreak !== -1 && nextBreak < end + 200) {
            end = nextBreak + 2;
          }
        }

        const chunkText = groupText.slice(start, end).trim();

        if (chunkText.length >= CONFIG.chunkConfig.minSize / 2) {
          chunks.push({
            text: chunkText,
            index: chunks.length,
            channel,
            channelType,
            speakers: Array.from(speakers),
            userIds: Array.from(userIds),
            startTs: group[0].ts,
            endTs: group[group.length - 1].ts,
            date,
            messageCount: group.length,
            hasFiles,
            hasReactions,
          });
        }

        start = end - CONFIG.chunkConfig.overlap;
        if (start >= groupText.length - CONFIG.chunkConfig.overlap) break;
      }
    }
  }

  return chunks;
}

/**
 * Index specific channels to PostgreSQL
 * Exported for use by slack-sync.ts
 */
export async function indexChannels(channels: string[]): Promise<number> {
  console.log(`Indexing ${channels.length} channels to search engine...`);

  // Check embedding server
  const embeddingAvailable = await checkEmbeddingServer();
  if (!embeddingAvailable) {
    console.warn("⚠️ Embedding server not available at port 8081");
    console.warn("   Skipping embedding generation. Run with embedding server for full indexing.");
    return 0;
  }

  // Connect to PostgreSQL
  let sql: SQL;
  try {
    sql = new SQL(CONFIG.postgresUrl);
    await sql`SELECT 1`;
    console.log("✅ PostgreSQL connected");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
    return 0;
  }

  let totalChunks = 0;
  let skipped = 0;

  for (const channel of channels) {
    const channelDir = `${CONFIG.slackBase}/${channel}`;

    try {
      const files = await readdir(channelDir);
      const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

      for (const jsonFile of jsonFiles) {
        const date = jsonFile.replace(".json", "");
        const fullPath = `${channelDir}/${jsonFile}`;

        // Check if already indexed
        const existing = await sql`
          SELECT COUNT(*)::int as cnt FROM slack_chunks
          WHERE channel = ${channel} AND message_date = ${date}::date
        `;

        if ((existing[0] as { cnt: number }).cnt > 0) {
          skipped++;
          continue;
        }

        // Load and chunk messages
        const messages: SlackMessage[] = await Bun.file(fullPath).json();
        const chunks = chunkSlackDay(messages, channel, date);

        if (chunks.length === 0) continue;

        // Generate embeddings and insert
        for (const chunk of chunks) {
          try {
            const embedding = await generateEmbedding(chunk.text);
            const vectorLiteral = `[${embedding.join(",")}]`;

            const speakersArray =
              chunk.speakers.length > 0
                ? `{${chunk.speakers.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
                : null;
            const userIdsArray =
              chunk.userIds.length > 0
                ? `{${chunk.userIds.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",")}}`
                : null;

            await sql.unsafe(
              `
              INSERT INTO slack_chunks (
                channel, channel_type, speakers, user_ids,
                start_ts, end_ts, message_date, message_count,
                has_files, has_reactions,
                chunk_index, chunk_text, chunk_size, embedding
              ) VALUES (
                $1, $2, $3::text[], $4::text[], $5, $6, $7::date, $8, $9, $10, $11, $12, $13, $14::vector
              )
            `,
              [
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
                vectorLiteral,
              ]
            );

            totalChunks++;
          } catch (err) {
            console.error(`  Error indexing chunk: ${err}`);
          }
        }
      }

      console.log(`  ${channel}: indexed`);
    } catch (err) {
      console.error(`  Error processing ${channel}: ${err}`);
    }
  }

  await sql.close();

  console.log(`\nIndexing complete:`);
  console.log(`  Chunks created: ${totalChunks}`);
  console.log(`  Days skipped (existing): ${skipped}`);

  return totalChunks;
}

/**
 * Index all channels (full index)
 */
export async function indexAllChannels(): Promise<number> {
  const entries = await readdir(CONFIG.slackBase, { withFileTypes: true });
  const channels = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => !n.startsWith(".") && !n.startsWith("__"));

  return indexChannels(channels);
}

// Run if executed directly
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length > 0 && !args[0].startsWith("--")) {
    // Index specific channels
    await indexChannels(args);
  } else {
    // Index all channels
    await indexAllChannels();
  }
}
