#!/usr/bin/env bun
/**
 * convert-slack-md-incremental.ts - Incremental Slack to Markdown Converter
 *
 * Converts only new/updated channels to Markdown format.
 * Much faster than full conversion when only a few channels have changed.
 *
 * Can be used standalone or imported by slack-sync.ts
 */

import { readdir } from "node:fs/promises";

const CONFIG = {
  jsonPath: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json",
  mdPath: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/markdown",
};

// Types
interface UserProfile {
  real_name?: string;
  display_name?: string;
  name?: string;
}

interface SlackFile {
  name: string;
  title?: string;
}

interface Reaction {
  name: string;
  count: number;
}

interface SlackMessage {
  type: string;
  subtype?: string;
  user?: string;
  text: string;
  ts: string;
  user_profile?: UserProfile;
  files?: SlackFile[];
  reactions?: Reaction[];
  edited?: { user: string; ts: string };
  thread_ts?: string;
  reply_count?: number;
  bot_id?: string;
}

interface ChannelInfo {
  id: string;
  name: string;
  is_private: boolean;
  is_im: boolean;
  is_mpim: boolean;
}

// Human-only subtypes to exclude
const EXCLUDE_SUBTYPES = new Set([
  "channel_join",
  "channel_leave",
  "channel_purpose",
  "channel_topic",
  "channel_name",
  "channel_archive",
  "channel_unarchive",
  "bot_message",
  "bot_add",
  "bot_remove",
  "file_share",
  "me_message",
  "reminder_add",
  "pinned_item",
  "unpinned_item",
  "group_join",
  "group_leave",
  "group_purpose",
  "group_topic",
  "group_name",
  "group_archive",
  "group_unarchive",
]);

// Helpers
function tsToDate(ts: string): Date {
  return new Date(parseFloat(ts) * 1000);
}

function formatTime(ts: string): string {
  const date = tsToDate(ts);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatFullDate(ts: string): string {
  const date = tsToDate(ts);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getYearMonth(dateStr: string): { year: string; month: string } {
  const parts = dateStr.split("-");
  return { year: parts[0], month: parts[1] };
}

function getUserName(msg: SlackMessage): string {
  if (msg.user_profile?.real_name) return msg.user_profile.real_name;
  if (msg.user_profile?.display_name) return msg.user_profile.display_name;
  if (msg.user_profile?.name) return msg.user_profile.name;
  return msg.user || "Unknown";
}

function cleanText(text: string): string {
  if (!text) return "";

  return text
    .replace(/<@([A-Z0-9]+)>/g, "@user")
    .replace(/<#[A-Z0-9]+\|([^>]+)>/g, "#$1")
    .replace(/<([^|>]+)\|([^>]+)>/g, "[$2]($1)")
    .replace(/<(https?:\/\/[^>]+)>/g, "[$1]($1)")
    .replace(/<mailto:([^|>]+)\|([^>]+)>/g, "[$2](mailto:$1)")
    .replace(/<mailto:([^>]+)>/g, "[$1](mailto:$1)")
    .replace(/([*_~`])/g, "\\$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/```([^`]+)```/g, "\n```\n$1\n```\n")
    .replace(/`([^`]+)`/g, "`$1`");
}

function getChannelType(
  channelName: string,
  channelInfo?: ChannelInfo
): string {
  if (channelName.startsWith("D")) return "dm";
  if (channelName.startsWith("mpdm-")) return "group-dm";
  if (channelInfo?.is_private) return "private";
  return "public";
}

function isHumanMessage(msg: SlackMessage): boolean {
  if (msg.type !== "message") return false;
  if (msg.bot_id) return false;
  if (msg.subtype && EXCLUDE_SUBTYPES.has(msg.subtype)) return false;
  if (!msg.text || msg.text.trim().length === 0) return false;
  const cleanedText = msg.text.replace(/<@[A-Z0-9]+>/g, "").trim();
  if (cleanedText.length === 0 && !msg.files?.length) return false;
  return true;
}

function formatMessage(msg: SlackMessage, isReply: boolean = false): string {
  const time = formatTime(msg.ts);
  const user = getUserName(msg);
  const text = cleanText(msg.text);
  const prefix = isReply ? "> " : "";
  const indent = isReply ? "> " : "";

  let output = "";

  if (isReply) {
    output += `${prefix}**${time} - ${user}** (reply)\n`;
    const lines = text.split("\n");
    for (const line of lines) {
      output += `${indent}${line}\n`;
    }
  } else {
    output += `#### ${time} - ${user}\n`;
    output += text + "\n";
  }

  if (msg.files && msg.files.length > 0) {
    const fileList = msg.files
      .map((f) => f.name || f.title || "unnamed file")
      .join(", ");
    output += `${indent}*Attachments: ${fileList}*\n`;
  }

  if (msg.reactions && msg.reactions.length > 0) {
    const reactionStr = msg.reactions
      .map((r) => `:${r.name}: ${r.count}`)
      .join(" ");
    output += `${indent}*Reactions: ${reactionStr}*\n`;
  }

  if (msg.edited) {
    output += `${indent}*(edited)*\n`;
  }

  output += "\n";
  return output;
}

/**
 * Load channel metadata from channels.json
 */
async function loadChannelInfo(): Promise<Map<string, ChannelInfo>> {
  const channelMap = new Map<string, ChannelInfo>();
  const channelsFile = `${CONFIG.jsonPath}/channels.json`;

  try {
    const file = Bun.file(channelsFile);
    if (await file.exists()) {
      const channels: ChannelInfo[] = await file.json();
      for (const ch of channels) {
        channelMap.set(ch.name, ch);
      }
    }
  } catch (e) {
    console.warn("Could not load channels.json:", e);
  }

  return channelMap;
}

/**
 * Convert a single channel to Markdown
 */
async function convertChannel(
  channelName: string,
  channelInfo: Map<string, ChannelInfo>
): Promise<{ files: number; messages: number }> {
  const channelDir = `${CONFIG.jsonPath}/${channelName}`;
  const info = channelInfo.get(channelName);
  const channelType = getChannelType(channelName, info);

  let totalFiles = 0;
  let totalMessages = 0;

  try {
    const files = await readdir(channelDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

    // Group messages by year/month
    const monthlyData: Map<
      string,
      { messages: (SlackMessage & { _date: string })[]; channelType: string }
    > = new Map();

    for (const file of jsonFiles) {
      const dateStr = file.replace(".json", ""); // YYYY-MM-DD
      const { year, month } = getYearMonth(dateStr);
      const key = `${year}-${month}`;

      const filePath = `${channelDir}/${file}`;
      const content = await Bun.file(filePath).json();
      const messages: SlackMessage[] = content;

      const humanMessages = messages.filter(isHumanMessage);
      if (humanMessages.length === 0) continue;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { messages: [], channelType });
      }

      for (const msg of humanMessages) {
        (msg as any)._date = dateStr;
        monthlyData.get(key)!.messages.push(msg as SlackMessage & { _date: string });
      }

      totalMessages += humanMessages.length;
    }

    // Write markdown files for each month
    for (const [key, data] of monthlyData) {
      const [year, month] = key.split("-");
      const outputDir = `${CONFIG.mdPath}/${year}/${month}`;

      // Ensure directory exists
      await Bun.$`mkdir -p ${outputDir}`.quiet();

      // Sort messages by timestamp
      data.messages.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));

      // Group by thread
      const threadMap = new Map<string, (SlackMessage & { _date: string })[]>();
      const standalone: (SlackMessage & { _date: string })[] = [];

      for (const msg of data.messages) {
        if (msg.thread_ts && msg.thread_ts !== msg.ts) {
          const replies = threadMap.get(msg.thread_ts) || [];
          replies.push(msg);
          threadMap.set(msg.thread_ts, replies);
        } else {
          standalone.push(msg);
        }
      }

      // Build markdown
      let markdown = `---\nchannel: ${channelName}\ntype: ${data.channelType}\nyear: ${year}\nmonth: ${month}\nmessages: ${data.messages.length}\n---\n\n`;

      let currentDate = "";

      for (const msg of standalone) {
        const msgDate = msg._date || "";

        if (msgDate !== currentDate) {
          currentDate = msgDate;
          const dateDisplay = formatFullDate(msg.ts);
          markdown += `### ${dateDisplay}\n\n`;
        }

        markdown += formatMessage(msg, false);

        const replies = threadMap.get(msg.ts);
        if (replies && replies.length > 0) {
          replies.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));
          for (const reply of replies) {
            markdown += formatMessage(reply, true);
          }
        }
      }

      // Write file
      const filename = `${year}-${month}-${channelName}.md`;
      const outputPath = `${outputDir}/${filename}`;
      await Bun.write(outputPath, markdown);
      totalFiles++;
    }
  } catch (err) {
    console.error(`Error converting channel ${channelName}:`, err);
  }

  return { files: totalFiles, messages: totalMessages };
}

/**
 * Convert specific channels to Markdown (incremental)
 * Exported for use by slack-sync.ts
 */
export async function convertChannelsToMarkdown(
  channels: string[]
): Promise<{ files: number; messages: number }> {
  console.log(`Converting ${channels.length} channels to Markdown...`);

  const channelInfo = await loadChannelInfo();

  let totalFiles = 0;
  let totalMessages = 0;

  for (const channel of channels) {
    const result = await convertChannel(channel, channelInfo);
    totalFiles += result.files;
    totalMessages += result.messages;

    if (result.files > 0) {
      console.log(`  ${channel}: ${result.files} files, ${result.messages} messages`);
    }
  }

  console.log(`\nTotal: ${totalFiles} files, ${totalMessages} messages`);
  return { files: totalFiles, messages: totalMessages };
}

/**
 * Convert all channels (full conversion)
 */
export async function convertAllChannelsToMarkdown(): Promise<{
  files: number;
  messages: number;
}> {
  console.log("Converting all channels to Markdown...");

  const channelInfo = await loadChannelInfo();

  // Get all channel directories
  const entries = await readdir(CONFIG.jsonPath, { withFileTypes: true });
  const channelDirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((n) => !n.startsWith(".") && !n.startsWith("__"))
    .sort();

  console.log(`Found ${channelDirs.length} channels`);

  return convertChannelsToMarkdown(channelDirs);
}

// Run if executed directly
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length > 0 && !args[0].startsWith("--")) {
    // Convert specific channels
    await convertChannelsToMarkdown(args);
  } else {
    // Convert all channels
    await convertAllChannelsToMarkdown();
  }
}
