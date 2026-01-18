#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

// Types
interface UserProfile {
  real_name?: string;
  display_name?: string;
  name?: string;
}

interface SlackFile {
  name: string;
  title?: string;
  mimetype?: string;
  filetype?: string;
  url_private?: string;
  permalink?: string;
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
  is_archived: boolean;
  topic?: { value: string };
  purpose?: { value: string };
}

// Aggregated data: year -> month -> channel -> messages
interface MonthlyData {
  [year: string]: {
    [month: string]: {
      [channel: string]: {
        messages: SlackMessage[];
        channelType: string;
      };
    };
  };
}

// Config
const JSON_PATH = '/Volumes/VRAM/messages/slack/slack_json';
const MD_PATH = '/Volumes/VRAM/messages/slack/slack_md';

// Human-only subtypes to exclude
const EXCLUDE_SUBTYPES = new Set([
  'channel_join',
  'channel_leave',
  'channel_purpose',
  'channel_topic',
  'channel_name',
  'channel_archive',
  'channel_unarchive',
  'bot_message',
  'bot_add',
  'bot_remove',
  'file_share',
  'me_message',
  'reminder_add',
  'pinned_item',
  'unpinned_item',
  'group_join',
  'group_leave',
  'group_purpose',
  'group_topic',
  'group_name',
  'group_archive',
  'group_unarchive',
]);

// Helpers
function tsToDate(ts: string): Date {
  return new Date(parseFloat(ts) * 1000);
}

function formatTime(ts: string): string {
  const date = tsToDate(ts);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatFullDate(ts: string): string {
  const date = tsToDate(ts);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function getYearMonth(dateStr: string): { year: string; month: string } {
  // dateStr is YYYY-MM-DD from filename
  const parts = dateStr.split('-');
  return { year: parts[0], month: parts[1] };
}

function getUserName(msg: SlackMessage): string {
  if (msg.user_profile?.real_name) return msg.user_profile.real_name;
  if (msg.user_profile?.display_name) return msg.user_profile.display_name;
  if (msg.user_profile?.name) return msg.user_profile.name;
  return msg.user || 'Unknown';
}

function cleanText(text: string): string {
  if (!text) return '';

  return text
    .replace(/<@([A-Z0-9]+)>/g, '@user')
    .replace(/<#[A-Z0-9]+\|([^>]+)>/g, '#$1')
    .replace(/<([^|>]+)\|([^>]+)>/g, '[$2]($1)')
    .replace(/<(https?:\/\/[^>]+)>/g, '[$1]($1)')
    .replace(/<mailto:([^|>]+)\|([^>]+)>/g, '[$2](mailto:$1)')
    .replace(/<mailto:([^>]+)>/g, '[$1](mailto:$1)')
    .replace(/([*_~`])/g, '\\$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/```([^`]+)```/g, '\n```\n$1\n```\n')
    .replace(/`([^`]+)`/g, '`$1`');
}

function getChannelType(channelName: string, channelInfo?: ChannelInfo): string {
  if (channelName.startsWith('D')) return 'dm';
  if (channelName.startsWith('mpdm-')) return 'group-dm';
  if (channelInfo?.is_private) return 'private';
  return 'public';
}

function isHumanMessage(msg: SlackMessage): boolean {
  if (msg.type !== 'message') return false;
  if (msg.bot_id) return false;
  if (msg.subtype && EXCLUDE_SUBTYPES.has(msg.subtype)) return false;
  if (!msg.text || msg.text.trim().length === 0) return false;
  const cleanedText = msg.text.replace(/<@[A-Z0-9]+>/g, '').trim();
  if (cleanedText.length === 0 && !msg.files?.length) return false;
  return true;
}

function formatMessage(msg: SlackMessage, isReply: boolean = false): string {
  const time = formatTime(msg.ts);
  const user = getUserName(msg);
  const text = cleanText(msg.text);
  const prefix = isReply ? '> ' : '';
  const indent = isReply ? '> ' : '';

  let output = '';

  if (isReply) {
    output += `${prefix}**${time} - ${user}** (reply)\n`;
    const lines = text.split('\n');
    for (const line of lines) {
      output += `${indent}${line}\n`;
    }
  } else {
    output += `#### ${time} - ${user}\n`;
    output += text + '\n';
  }

  if (msg.files && msg.files.length > 0) {
    const fileList = msg.files.map(f => f.name || f.title || 'unnamed file').join(', ');
    output += `${indent}*Attachments: ${fileList}*\n`;
  }

  if (msg.reactions && msg.reactions.length > 0) {
    const reactionStr = msg.reactions.map(r => `:${r.name}: ${r.count}`).join(' ');
    output += `${indent}*Reactions: ${reactionStr}*\n`;
  }

  if (msg.edited) {
    output += `${indent}*(edited)*\n`;
  }

  output += '\n';
  return output;
}

function loadChannelInfo(): Map<string, ChannelInfo> {
  const channelMap = new Map<string, ChannelInfo>();
  const channelsFile = path.join(JSON_PATH, 'channels.json');

  if (fs.existsSync(channelsFile)) {
    try {
      const content = fs.readFileSync(channelsFile, 'utf-8');
      const channels: ChannelInfo[] = JSON.parse(content);
      for (const ch of channels) {
        channelMap.set(ch.name, ch);
      }
    } catch (e) {
      console.warn('Could not load channels.json:', e);
    }
  }

  return channelMap;
}

function buildMonthlyData(channelInfo: Map<string, ChannelInfo>): MonthlyData {
  const data: MonthlyData = {};

  // Get all channel directories
  const entries = fs.readdirSync(JSON_PATH, { withFileTypes: true });
  const channelDirs = entries
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort();

  console.log(`Scanning ${channelDirs.length} channels...`);

  let totalMessages = 0;
  let processedChannels = 0;

  for (const channelName of channelDirs) {
    const channelDir = path.join(JSON_PATH, channelName);
    const info = channelInfo.get(channelName);
    const channelType = getChannelType(channelName, info);

    // Get all JSON files in channel
    const files = fs.readdirSync(channelDir)
      .filter(f => f.endsWith('.json'))
      .sort();

    for (const file of files) {
      const dateStr = path.basename(file, '.json'); // YYYY-MM-DD
      const { year, month } = getYearMonth(dateStr);
      const filePath = path.join(channelDir, file);

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const messages: SlackMessage[] = JSON.parse(content);

        const humanMessages = messages.filter(isHumanMessage);
        if (humanMessages.length === 0) continue;

        // Initialize nested structure
        if (!data[year]) data[year] = {};
        if (!data[year][month]) data[year][month] = {};
        if (!data[year][month][channelName]) {
          data[year][month][channelName] = {
            messages: [],
            channelType: channelType
          };
        }

        // Add messages with date info for grouping
        for (const msg of humanMessages) {
          (msg as any)._date = dateStr;
          data[year][month][channelName].messages.push(msg);
        }

        totalMessages += humanMessages.length;
      } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
      }
    }

    processedChannels++;
    if (processedChannels % 100 === 0) {
      console.log(`  Scanned ${processedChannels}/${channelDirs.length} channels...`);
    }
  }

  console.log(`\nTotal human messages collected: ${totalMessages}`);
  return data;
}

function writeMarkdownFiles(data: MonthlyData): { files: number; messages: number } {
  let totalFiles = 0;
  let totalMessages = 0;

  const years = Object.keys(data).sort();

  for (const year of years) {
    const months = Object.keys(data[year]).sort();

    for (const month of months) {
      const channels = Object.keys(data[year][month]).sort();

      // Create directory: slack_md/YYYY/MM/
      const outputDir = path.join(MD_PATH, year, month);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      for (const channelName of channels) {
        const channelData = data[year][month][channelName];
        const messages = channelData.messages;

        if (messages.length === 0) continue;

        // Sort messages by timestamp
        messages.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));

        // Group by thread
        const threadMap = new Map<string, SlackMessage[]>();
        const standalone: SlackMessage[] = [];

        for (const msg of messages) {
          if (msg.thread_ts && msg.thread_ts !== msg.ts) {
            const replies = threadMap.get(msg.thread_ts) || [];
            replies.push(msg);
            threadMap.set(msg.thread_ts, replies);
          } else {
            standalone.push(msg);
          }
        }

        // Build markdown
        let markdown = `---\nchannel: ${channelName}\ntype: ${channelData.channelType}\nyear: ${year}\nmonth: ${month}\nmessages: ${messages.length}\n---\n\n`;

        // Group messages by date for readability
        let currentDate = '';

        for (const msg of standalone) {
          const msgDate = (msg as any)._date || '';

          // Add date header when date changes
          if (msgDate !== currentDate) {
            currentDate = msgDate;
            const dateDisplay = formatFullDate(msg.ts);
            markdown += `### ${dateDisplay}\n\n`;
          }

          markdown += formatMessage(msg, false);

          // Add thread replies
          const replies = threadMap.get(msg.ts);
          if (replies && replies.length > 0) {
            replies.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));
            for (const reply of replies) {
              markdown += formatMessage(reply, true);
            }
          }
        }

        // Write file: YYYY-MM-channel_name.md
        const filename = `${year}-${month}-${channelName}.md`;
        const outputPath = path.join(outputDir, filename);
        fs.writeFileSync(outputPath, markdown);

        totalFiles++;
        totalMessages += messages.length;
      }
    }
  }

  return { files: totalFiles, messages: totalMessages };
}

async function main() {
  console.log('Slack JSON to Markdown Converter (Year/Month Structure)');
  console.log('========================================================\n');

  // Load channel metadata
  console.log('Loading channel metadata...');
  const channelInfo = loadChannelInfo();
  console.log(`Found metadata for ${channelInfo.size} channels\n`);

  // Build aggregated data
  console.log('Building monthly aggregated data...');
  const data = buildMonthlyData(channelInfo);

  // Write markdown files
  console.log('\nWriting markdown files...');
  const { files, messages } = writeMarkdownFiles(data);

  console.log('\n========================================================');
  console.log('Conversion Complete!');
  console.log(`  Markdown files created: ${files}`);
  console.log(`  Total human messages: ${messages}`);
  console.log(`  Output directory: ${MD_PATH}`);
  console.log('\nStructure: YYYY/MM/YYYY-MM-channel_name.md');
}

main().catch(console.error);
