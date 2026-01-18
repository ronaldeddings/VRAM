#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

// Types
interface UserProfile {
  avatar_hash?: string;
  image_72?: string;
  first_name?: string;
  real_name?: string;
  display_name?: string;
  team?: string;
  name?: string;
  is_restricted?: boolean;
  is_ultra_restricted?: boolean;
}

interface SlackFile {
  id: string;
  name: string;
  title?: string;
  mimetype?: string;
  filetype?: string;
  size?: number;
  url_private?: string;
}

interface Reaction {
  name: string;
  count: number;
  users: string[];
}

interface SlackMessage {
  client_msg_id?: string;
  type: string;
  subtype?: string;
  user?: string;
  text: string;
  ts: string;
  team?: string;
  user_profile?: UserProfile;
  files?: SlackFile[];
  reactions?: Reaction[];
  edited?: { user: string; ts: string };
  thread_ts?: string;
  // Internal tracking
  _channel?: string;
  _date?: string;
}

interface SearchOptions {
  from?: string;
  to?: string;
  user?: string;
  channel?: string;
  text?: string;
  mentions?: string;
  limit?: number;
  format?: 'compact' | 'full' | 'json';
  dms?: boolean;
  files?: boolean;
}

// Default export path
const DEFAULT_EXPORT_PATH = '/Volumes/InstaBackup/laws/Slack/slackdump_20251222_043714';

// Helpers
function parseDate(dateStr: string): Date {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${dateStr}`);
  }
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function tsToDate(ts: string): Date {
  return new Date(parseFloat(ts) * 1000);
}

function formatTimestamp(ts: string): string {
  const date = tsToDate(ts);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function getDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const start = parseDate(from);
  const end = parseDate(to);

  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + '...';
}

function cleanText(text: string): string {
  return text
    .replace(/<@[A-Z0-9]+>/g, (match) => chalk.cyan(match))
    .replace(/<#[A-Z0-9]+\|([^>]+)>/g, (_, name) => chalk.blue(`#${name}`))
    .replace(/<([^|>]+)\|([^>]+)>/g, (_, url, label) => chalk.underline(label))
    .replace(/<([^>]+)>/g, (_, url) => chalk.underline(url))
    .replace(/\n/g, ' ');
}

// Core Search Class
class SlackSearcher {
  private exportPath: string;
  private userCache: Map<string, string> = new Map();

  constructor(exportPath: string) {
    this.exportPath = exportPath;
    if (!fs.existsSync(exportPath)) {
      throw new Error(`Export path not found: ${exportPath}`);
    }
  }

  async getChannels(): Promise<string[]> {
    const entries = fs.readdirSync(this.exportPath, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .sort();
  }

  async getDMChannels(): Promise<string[]> {
    const channels = await this.getChannels();
    return channels.filter(c => c.startsWith('D') || c.startsWith('mpdm-'));
  }

  async getPublicChannels(): Promise<string[]> {
    const channels = await this.getChannels();
    return channels.filter(c => !c.startsWith('D') && !c.startsWith('mpdm-'));
  }

  private async loadJsonFile(filePath: string): Promise<SlackMessage[]> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private async findFiles(options: SearchOptions): Promise<string[]> {
    const { from, to, channel, dms } = options;
    let pattern: string;
    let baseDir = this.exportPath;

    if (channel) {
      baseDir = path.join(this.exportPath, channel);
      if (!fs.existsSync(baseDir)) {
        throw new Error(`Channel not found: ${channel}`);
      }
    }

    if (from && to) {
      const dates = getDateRange(from, to);
      const files: string[] = [];

      const searchDirs = channel
        ? [channel]
        : dms
          ? (await this.getDMChannels())
          : (await this.getChannels());

      for (const dir of searchDirs) {
        for (const date of dates) {
          const filePath = path.join(this.exportPath, dir, `${date}.json`);
          if (fs.existsSync(filePath)) {
            files.push(filePath);
          }
        }
      }
      return files;
    }

    pattern = channel
      ? path.join(baseDir, '*.json')
      : dms
        ? path.join(this.exportPath, '{D*,mpdm-*}', '*.json')
        : path.join(this.exportPath, '*', '*.json');

    return glob.sync(pattern);
  }

  async search(options: SearchOptions): Promise<SlackMessage[]> {
    const files = await this.findFiles(options);
    let messages: SlackMessage[] = [];

    for (const file of files) {
      const channelName = path.basename(path.dirname(file));
      const date = path.basename(file, '.json');
      const fileMessages = await this.loadJsonFile(file);

      for (const msg of fileMessages) {
        msg._channel = channelName;
        msg._date = date;

        // Cache user names
        if (msg.user && msg.user_profile?.real_name) {
          this.userCache.set(msg.user, msg.user_profile.real_name);
        }
      }

      messages.push(...fileMessages);
    }

    // Apply filters
    if (options.user) {
      const userFilter = options.user.toLowerCase();
      messages = messages.filter(m =>
        m.user === options.user ||
        m.user_profile?.name?.toLowerCase().includes(userFilter) ||
        m.user_profile?.real_name?.toLowerCase().includes(userFilter)
      );
    }

    if (options.text) {
      const textFilter = options.text.toLowerCase();
      messages = messages.filter(m =>
        m.text?.toLowerCase().includes(textFilter)
      );
    }

    if (options.mentions) {
      messages = messages.filter(m =>
        m.text?.includes(`<@${options.mentions}>`)
      );
    }

    if (options.files) {
      messages = messages.filter(m => m.files && m.files.length > 0);
    }

    // Sort by timestamp
    messages.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));

    // Apply limit
    if (options.limit && messages.length > options.limit) {
      messages = messages.slice(0, options.limit);
    }

    return messages;
  }

  async getUsers(): Promise<Map<string, string>> {
    // Scan some files to build user cache
    const files = await glob.sync(path.join(this.exportPath, '*', '2025-*.json'));
    const sampleFiles = files.slice(0, 100);

    for (const file of sampleFiles) {
      const messages = await this.loadJsonFile(file);
      for (const msg of messages) {
        if (msg.user && msg.user_profile?.real_name) {
          this.userCache.set(msg.user, msg.user_profile.real_name);
        }
      }
    }

    return this.userCache;
  }

  formatMessage(msg: SlackMessage, format: 'compact' | 'full' | 'json'): string {
    if (format === 'json') {
      return JSON.stringify(msg, null, 2);
    }

    const time = formatTimestamp(msg.ts);
    const user = msg.user_profile?.real_name || msg.user_profile?.name || msg.user || 'Unknown';
    const channel = msg._channel || 'unknown';
    const text = cleanText(msg.text || '');

    if (format === 'compact') {
      return `${chalk.gray(time)} ${chalk.cyan(channel)} ${chalk.yellow(user)}: ${truncate(text, 100)}`;
    }

    // Full format
    let output = '';
    output += chalk.gray('─'.repeat(80)) + '\n';
    output += `${chalk.gray(time)} | ${chalk.cyan('#' + channel)} | ${chalk.yellow(user)}`;

    if (msg.edited) {
      output += chalk.gray(' (edited)');
    }
    output += '\n';
    output += text + '\n';

    if (msg.files && msg.files.length > 0) {
      output += chalk.magenta(`📎 Files: ${msg.files.map(f => f.name).join(', ')}`) + '\n';
    }

    if (msg.reactions && msg.reactions.length > 0) {
      const reactions = msg.reactions.map(r => `${r.name}(${r.count})`).join(' ');
      output += chalk.gray(`Reactions: ${reactions}`) + '\n';
    }

    return output;
  }
}

// CLI
const program = new Command();

program
  .name('slack-search')
  .description('Search slackdump exports')
  .version('1.0.0')
  .option('-p, --path <path>', 'Path to slackdump export', DEFAULT_EXPORT_PATH);

program
  .command('search')
  .description('Search messages')
  .option('-f, --from <date>', 'Start date (YYYY-MM-DD)')
  .option('-t, --to <date>', 'End date (YYYY-MM-DD)')
  .option('-u, --user <user>', 'Filter by user (ID or name)')
  .option('-c, --channel <channel>', 'Filter by channel')
  .option('-s, --text <text>', 'Search text content')
  .option('-m, --mentions <userId>', 'Find messages mentioning user ID')
  .option('--dms', 'Search only DMs')
  .option('--files', 'Only show messages with files')
  .option('-l, --limit <number>', 'Limit results', parseInt)
  .option('--format <format>', 'Output format: compact, full, json', 'compact')
  .action(async (opts) => {
    try {
      const searcher = new SlackSearcher(program.opts().path);
      const messages = await searcher.search({
        from: opts.from,
        to: opts.to,
        user: opts.user,
        channel: opts.channel,
        text: opts.text,
        mentions: opts.mentions,
        dms: opts.dms,
        files: opts.files,
        limit: opts.limit,
        format: opts.format
      });

      console.log(chalk.green(`Found ${messages.length} messages\n`));

      for (const msg of messages) {
        console.log(searcher.formatMessage(msg, opts.format));
      }
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program
  .command('channels')
  .description('List all channels')
  .option('--dms', 'Show only DM channels')
  .option('--public', 'Show only public channels')
  .action(async (opts) => {
    try {
      const searcher = new SlackSearcher(program.opts().path);
      let channels: string[];

      if (opts.dms) {
        channels = await searcher.getDMChannels();
      } else if (opts.public) {
        channels = await searcher.getPublicChannels();
      } else {
        channels = await searcher.getChannels();
      }

      console.log(chalk.green(`Found ${channels.length} channels:\n`));
      for (const ch of channels) {
        console.log(`  ${ch}`);
      }
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program
  .command('users')
  .description('List known users')
  .action(async () => {
    try {
      const searcher = new SlackSearcher(program.opts().path);
      const users = await searcher.getUsers();

      console.log(chalk.green(`Found ${users.size} users:\n`));
      const sorted = [...users.entries()].sort((a, b) => a[1].localeCompare(b[1]));
      for (const [id, name] of sorted) {
        console.log(`  ${chalk.gray(id)} ${name}`);
      }
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program
  .command('week <date>')
  .description('Show messages for the week containing a date')
  .option('-u, --user <user>', 'Filter by user')
  .option('-c, --channel <channel>', 'Filter by channel')
  .option('--dms', 'Search only DMs')
  .option('-l, --limit <number>', 'Limit results', parseInt)
  .option('--format <format>', 'Output format: compact, full, json', 'compact')
  .action(async (dateStr, opts) => {
    try {
      const date = parseDate(dateStr);
      const day = date.getDay();
      const start = new Date(date);
      start.setDate(date.getDate() - day); // Start of week (Sunday)
      const end = new Date(start);
      end.setDate(start.getDate() + 6); // End of week (Saturday)

      console.log(chalk.blue(`Week: ${formatDate(start)} to ${formatDate(end)}\n`));

      const searcher = new SlackSearcher(program.opts().path);
      const messages = await searcher.search({
        from: formatDate(start),
        to: formatDate(end),
        user: opts.user,
        channel: opts.channel,
        dms: opts.dms,
        limit: opts.limit,
        format: opts.format
      });

      console.log(chalk.green(`Found ${messages.length} messages\n`));

      for (const msg of messages) {
        console.log(searcher.formatMessage(msg, opts.format));
      }
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program
  .command('stats')
  .description('Show statistics for a date range')
  .option('-f, --from <date>', 'Start date (YYYY-MM-DD)')
  .option('-t, --to <date>', 'End date (YYYY-MM-DD)')
  .action(async (opts) => {
    try {
      const searcher = new SlackSearcher(program.opts().path);
      const messages = await searcher.search({
        from: opts.from,
        to: opts.to
      });

      // Count by user
      const byUser: Map<string, number> = new Map();
      const byChannel: Map<string, number> = new Map();
      const byDate: Map<string, number> = new Map();

      for (const msg of messages) {
        const user = msg.user_profile?.real_name || msg.user || 'Unknown';
        const channel = msg._channel || 'unknown';
        const date = msg._date || 'unknown';

        byUser.set(user, (byUser.get(user) || 0) + 1);
        byChannel.set(channel, (byChannel.get(channel) || 0) + 1);
        byDate.set(date, (byDate.get(date) || 0) + 1);
      }

      console.log(chalk.green(`Total messages: ${messages.length}\n`));

      console.log(chalk.yellow('Top 10 Users:'));
      const sortedUsers = [...byUser.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
      for (const [user, count] of sortedUsers) {
        console.log(`  ${count.toString().padStart(5)} ${user}`);
      }

      console.log(chalk.yellow('\nTop 10 Channels:'));
      const sortedChannels = [...byChannel.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
      for (const [channel, count] of sortedChannels) {
        console.log(`  ${count.toString().padStart(5)} ${channel}`);
      }

      console.log(chalk.yellow('\nMessages by Date:'));
      const sortedDates = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      for (const [date, count] of sortedDates) {
        const bar = '█'.repeat(Math.min(50, Math.round(count / 10)));
        console.log(`  ${date} ${count.toString().padStart(5)} ${chalk.cyan(bar)}`);
      }
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program
  .command('tome')
  .description('Show messages sent TO you (DMs from others + mentions)')
  .requiredOption('-u, --user <userId>', 'Your user ID')
  .option('-f, --from <date>', 'Start date (YYYY-MM-DD)')
  .option('-t, --to <date>', 'End date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Limit results', parseInt)
  .option('--format <format>', 'Output format: compact, full, json', 'full')
  .action(async (opts) => {
    try {
      const searcher = new SlackSearcher(program.opts().path);

      // Get DMs where you're NOT the sender
      console.log(chalk.blue('Searching DMs...\n'));
      const dms = await searcher.search({
        from: opts.from,
        to: opts.to,
        dms: true,
        limit: undefined
      });
      const dmMessages = dms.filter(m => m.user !== opts.user);

      // Get mentions in channels
      console.log(chalk.blue('Searching mentions...\n'));
      const mentions = await searcher.search({
        from: opts.from,
        to: opts.to,
        mentions: opts.user,
        limit: undefined
      });

      // Combine and sort
      const allMessages = [...dmMessages, ...mentions];
      allMessages.sort((a, b) => parseFloat(a.ts) - parseFloat(b.ts));

      const limited = opts.limit ? allMessages.slice(0, opts.limit) : allMessages;

      console.log(chalk.green(`Found ${allMessages.length} messages to you (${dmMessages.length} DMs, ${mentions.length} mentions)\n`));

      for (const msg of limited) {
        console.log(searcher.formatMessage(msg, opts.format));
      }
    } catch (err: any) {
      console.error(chalk.red(`Error: ${err.message}`));
      process.exit(1);
    }
  });

program.parse();
