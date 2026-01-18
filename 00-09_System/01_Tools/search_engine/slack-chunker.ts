/**
 * Slack Chunking Module
 *
 * Processes Slack JSON exports with time-window grouping and speaker context.
 * Groups messages into 15-minute windows for conversation coherence.
 */

import { readdir } from "node:fs/promises";

const SLACK_BASE = "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json";

export interface SlackMessage {
  client_msg_id: string;
  type: string;
  user: string;                    // User ID (e.g., "U838WQGJE")
  text: string;
  ts: string;                      // Unix timestamp with microseconds
  edited?: { ts: string };
  blocks?: Array<{
    type: string;
    elements: any[];
  }>;
  user_profile?: {
    name: string;
    display_name: string;
    real_name: string;
    avatar_hash: string;
  };
  reactions?: Array<{
    name: string;
    users: string[];
    count: number;
  }>;
  thread_ts?: string;              // Parent thread timestamp
  reply_count?: number;
  reply_users_count?: number;
  files?: Array<{
    name: string;
    filetype: string;
    size: number;
  }>;
}

export interface SlackChunk {
  text: string;
  index: number;
  channel: string;
  channelType: "public" | "private" | "dm" | "group_dm";
  speakers: string[];            // Display names
  userIds: string[];             // Slack user IDs
  startTs: string;
  endTs: string;
  date: string;                  // YYYY-MM-DD
  messageCount: number;
  hasFiles: boolean;
  hasReactions: boolean;
}

const SLACK_CONFIG = {
  targetSize: 1800,
  minSize: 500,
  maxSize: 2200,
  overlap: 300,
  timeWindowMinutes: 15          // Group messages within this window
};

/**
 * Detect channel type from channel name/path
 */
function detectChannelType(channelName: string): SlackChunk["channelType"] {
  if (channelName.startsWith("mpdm-")) return "group_dm";
  if (channelName.includes("--")) return "dm";       // Direct message pattern
  // Could check channel metadata for private vs public
  return "private";
}

/**
 * Format a single Slack message for embedding
 */
function formatMessage(msg: SlackMessage): string {
  const userName = msg.user_profile?.display_name
    || msg.user_profile?.real_name
    || msg.user_profile?.name
    || msg.user;

  const timestamp = new Date(parseFloat(msg.ts) * 1000);
  const time = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  let formatted = `[${time}] ${userName}: ${msg.text}`;

  // Add file references
  if (msg.files && msg.files.length > 0) {
    const fileNames = msg.files.map(f => f.name).join(", ");
    formatted += `\n[Attached: ${fileNames}]`;
  }

  // Add reaction summary
  if (msg.reactions && msg.reactions.length > 0) {
    const reactions = msg.reactions.map(r => `:${r.name}:x${r.count}`).join(" ");
    formatted += `\n[Reactions: ${reactions}]`;
  }

  return formatted;
}

/**
 * Group messages into time-based windows
 */
function groupByTimeWindow(messages: SlackMessage[]): SlackMessage[][] {
  if (messages.length === 0) return [];

  const windowMs = SLACK_CONFIG.timeWindowMinutes * 60 * 1000;
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

/**
 * Chunk a day's worth of Slack messages
 */
export function chunkSlackDay(
  messages: SlackMessage[],
  channel: string,
  date: string
): SlackChunk[] {
  // Filter out system messages
  const userMessages = messages.filter(m =>
    m.type === "message" &&
    m.user &&
    m.text &&
    m.text.trim().length > 0
  );

  if (userMessages.length === 0) return [];

  // Group by time window
  const timeGroups = groupByTimeWindow(userMessages);
  const channelType = detectChannelType(channel);
  const chunks: SlackChunk[] = [];

  for (const group of timeGroups) {
    // Format all messages in group
    let groupText = "";
    const speakers = new Set<string>();
    const userIds = new Set<string>();
    let hasFiles = false;
    let hasReactions = false;

    for (const msg of group) {
      groupText += formatMessage(msg) + "\n\n";

      const speaker = msg.user_profile?.display_name
        || msg.user_profile?.real_name
        || msg.user;
      speakers.add(speaker);
      userIds.add(msg.user);

      if (msg.files && msg.files.length > 0) hasFiles = true;
      if (msg.reactions && msg.reactions.length > 0) hasReactions = true;
    }

    groupText = groupText.trim();

    // Skip if too short
    if (groupText.length < SLACK_CONFIG.minSize) continue;

    // If group fits in one chunk
    if (groupText.length <= SLACK_CONFIG.maxSize) {
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
        hasReactions
      });
    } else {
      // Split large groups
      let start = 0;
      while (start < groupText.length) {
        let end = Math.min(start + SLACK_CONFIG.targetSize, groupText.length);

        // Break at message boundary (double newline)
        if (end < groupText.length) {
          const nextBreak = groupText.indexOf("\n\n", end - 200);
          if (nextBreak !== -1 && nextBreak < end + 200) {
            end = nextBreak + 2;
          }
        }

        const chunkText = groupText.slice(start, end).trim();

        if (chunkText.length >= SLACK_CONFIG.minSize / 2) {
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
            hasReactions
          });
        }

        start = end - SLACK_CONFIG.overlap;
        if (start >= groupText.length - SLACK_CONFIG.overlap) break;
      }
    }
  }

  return chunks;
}

/**
 * Iterate through all Slack conversations
 */
export async function* iterateSlackChannels(): AsyncGenerator<{
  channel: string;
  date: string;
  messages: SlackMessage[];
}> {
  const channels = await readdir(SLACK_BASE);

  for (const channel of channels) {
    const channelPath = `${SLACK_BASE}/${channel}`;

    try {
      const files = await readdir(channelPath);
      const jsonFiles = files.filter(f => f.endsWith(".json"));

      for (const jsonFile of jsonFiles) {
        const date = jsonFile.replace(".json", "");
        const fullPath = `${channelPath}/${jsonFile}`;

        try {
          const file = Bun.file(fullPath);
          const messages = await file.json() as SlackMessage[];
          yield { channel, date, messages };
        } catch (err) {
          console.error(`Failed to parse: ${fullPath}`);
        }
      }
    } catch (err) {
      continue;
    }
  }
}

/**
 * Count total Slack day files for progress reporting
 */
export async function countSlackDays(): Promise<{ channels: number; days: number }> {
  let channels = 0;
  let days = 0;

  try {
    const channelDirs = await readdir(SLACK_BASE);

    for (const channel of channelDirs) {
      const channelPath = `${SLACK_BASE}/${channel}`;
      try {
        const files = await readdir(channelPath);
        const jsonFiles = files.filter(f => f.endsWith(".json"));
        if (jsonFiles.length > 0) {
          channels++;
          days += jsonFiles.length;
        }
      } catch {
        // Skip non-directories
      }
    }
  } catch {
    // SLACK_BASE might not exist
  }

  return { channels, days };
}
