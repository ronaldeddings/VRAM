/**
 * Slack Enhancer
 *
 * Populates new slack_chunks fields from original JSON files:
 * - real_names (from user_profile)
 * - companies (from user_profile)
 * - thread_ts
 * - is_thread_reply
 * - is_edited
 * - emoji_reactions
 * - reply_count
 */

import { getConnection } from "./pg-client";

const VRAM = "/Volumes/VRAM";
const SLACK_JSON_PATH = `${VRAM}/10-19_Work/14_Communications/14.02_slack/json`;

interface SlackMessage {
  client_msg_id?: string;
  type: string;
  user?: string;
  text: string;
  ts: string;
  team?: string;
  edited?: {
    user: string;
    ts: string;
  };
  thread_ts?: string;
  reply_count?: number;
  replies?: Array<{ user: string; ts: string }>;
  reactions?: Array<{ name: string; count: number; users: string[] }>;
  user_profile?: {
    avatar_hash?: string;
    image_72?: string;
    first_name?: string;
    real_name?: string;
    display_name?: string;
    team?: string;
    name?: string;
    is_restricted?: boolean;
    is_ultra_restricted?: boolean;
    email?: string;
    company?: string;
  };
  subtype?: string;
  bot_id?: string;
}

/**
 * Extract date from Slack timestamp
 */
function tsToDate(ts: string): Date {
  const epochSeconds = parseFloat(ts);
  return new Date(epochSeconds * 1000);
}

/**
 * Process all Slack files for a channel
 */
async function processChannel(channelPath: string, channelName: string, sql: ReturnType<typeof getConnection>): Promise<{ processed: number; updated: number }> {
  const glob = new Bun.Glob("*.json");
  let processed = 0;
  let updated = 0;

  // Collect all user profiles and message metadata from this channel
  const userProfiles = new Map<string, { realName: string; company?: string; email?: string }>();
  const messageMetadata = new Map<string, {
    isEdited: boolean;
    threadTs: string | null;
    isThreadReply: boolean;
    replyCount: number;
    reactions: string[];
  }>();

  try {
    for await (const file of glob.scan({ cwd: channelPath, absolute: true })) {
      try {
        const messages: SlackMessage[] = await Bun.file(file).json();
        processed++;

        for (const msg of messages) {
          // Collect user profile info
          if (msg.user_profile && msg.user) {
            userProfiles.set(msg.user, {
              realName: msg.user_profile.real_name || msg.user_profile.display_name || "",
              company: msg.user_profile.company,
              email: msg.user_profile.email
            });
          }

          // Collect message metadata
          if (msg.ts) {
            const isEdited = !!msg.edited;
            const threadTs = msg.thread_ts || null;
            const isThreadReply = !!msg.thread_ts && msg.thread_ts !== msg.ts;
            const replyCount = msg.reply_count || 0;
            const reactions = (msg.reactions || []).map(r => r.name);

            messageMetadata.set(msg.ts, {
              isEdited,
              threadTs,
              isThreadReply,
              replyCount,
              reactions
            });
          }
        }
      } catch {
        // Skip invalid files
      }
    }
  } catch {
    return { processed, updated };
  }

  // Now update the database with collected metadata
  // Get all chunks for this channel
  const chunks = await sql`
    SELECT id, user_ids, chunk_text
    FROM slack_chunks
    WHERE channel = ${channelName}
  `;

  for (const chunk of chunks) {
    const userIds: string[] = chunk.user_ids || [];

    // Collect real names and companies from user profiles
    const realNames: string[] = [];
    const companies: string[] = [];

    for (const userId of userIds) {
      const profile = userProfiles.get(userId);
      if (profile) {
        if (profile.realName) realNames.push(profile.realName);
        if (profile.company) companies.push(profile.company);
      }
    }

    // Dedupe
    const uniqueRealNames = [...new Set(realNames)];
    const uniqueCompanies = [...new Set(companies)];

    // Find any metadata from messages in this chunk
    // For simplicity, we'll check if we have any edited messages
    let hasEdited = false;
    let threadTs: string | null = null;
    let isThreadReply = false;
    let totalReplyCount = 0;
    const allReactions: string[] = [];

    for (const [ts, meta] of messageMetadata) {
      if (meta.isEdited) hasEdited = true;
      if (meta.threadTs && !threadTs) {
        threadTs = meta.threadTs;
        isThreadReply = meta.isThreadReply;
      }
      totalReplyCount += meta.replyCount;
      allReactions.push(...meta.reactions);
    }

    const uniqueReactions = [...new Set(allReactions)];

    // Update the chunk
    if (uniqueRealNames.length > 0 || uniqueCompanies.length > 0 || hasEdited || threadTs) {
      try {
        // Format arrays properly for PostgreSQL
        const realNamesArray = uniqueRealNames.length > 0 ? `{${uniqueRealNames.map(n => `"${n.replace(/"/g, '\\"')}"`).join(',')}}` : '{}';
        const companiesArray = uniqueCompanies.length > 0 ? `{${uniqueCompanies.map(c => `"${c.replace(/"/g, '\\"')}"`).join(',')}}` : '{}';
        const reactionsArray = uniqueReactions.length > 0 ? `{${uniqueReactions.map(r => `"${r}"`).join(',')}}` : '{}';

        await sql.unsafe(`
          UPDATE slack_chunks SET
            real_names = '${realNamesArray}'::text[],
            companies = '${companiesArray}'::text[],
            is_edited = ${hasEdited},
            thread_ts = ${threadTs ? `'${threadTs}'` : 'NULL'},
            is_thread_reply = ${isThreadReply},
            reply_count = ${totalReplyCount},
            emoji_reactions = '${reactionsArray}'::text[]
          WHERE id = ${chunk.id}
        `);
        updated++;
      } catch (err) {
        // Skip problematic records
      }
    }
  }

  return { processed, updated };
}

/**
 * Main enhancement function
 */
export async function runSlackEnhancement(): Promise<void> {
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║   Slack Enhancement                    ║");
  console.log("╚════════════════════════════════════════╝\n");

  const startTime = Date.now();
  const sql = getConnection();

  let totalProcessed = 0;
  let totalUpdated = 0;

  // Get list of channels
  const glob = new Bun.Glob("*");
  const channels: string[] = [];

  for await (const dir of glob.scan({ cwd: SLACK_JSON_PATH, onlyFiles: false })) {
    if (!dir.includes(".")) {
      channels.push(dir);
    }
  }

  console.log(`   Found ${channels.length} channels to process`);

  let channelCount = 0;
  for (const channel of channels) {
    const channelPath = `${SLACK_JSON_PATH}/${channel}`;
    const { processed, updated } = await processChannel(channelPath, channel, sql);
    totalProcessed += processed;
    totalUpdated += updated;
    channelCount++;

    if (channelCount % 50 === 0) {
      console.log(`   Processed ${channelCount}/${channels.length} channels, ${totalUpdated} chunks updated...`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Slack enhancement complete in ${elapsed}s`);
  console.log(`   Channels: ${channelCount}`);
  console.log(`   Files Processed: ${totalProcessed}`);
  console.log(`   Chunks Updated: ${totalUpdated}`);

  // Print stats
  const stats = await sql`
    SELECT
      COUNT(*) FILTER (WHERE array_length(real_names, 1) > 0) as with_real_names,
      COUNT(*) FILTER (WHERE is_edited = true) as edited,
      COUNT(*) FILTER (WHERE thread_ts IS NOT NULL) as threaded,
      COUNT(*) FILTER (WHERE array_length(emoji_reactions, 1) > 0) as with_reactions
    FROM slack_chunks
  `;

  console.log("\n📈 Slack Enhancement Stats:");
  console.log(`   With Real Names: ${stats[0].with_real_names}`);
  console.log(`   Edited Messages: ${stats[0].edited}`);
  console.log(`   Threaded: ${stats[0].threaded}`);
  console.log(`   With Reactions: ${stats[0].with_reactions}`);
}

// Run if called directly
if (import.meta.main) {
  runSlackEnhancement()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}
