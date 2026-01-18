# Slack Search CLI

A TypeScript CLI tool to search your slackdump exports.

## Installation

```bash
cd slack-search
npm install
npm run build
```

## Your User ID

Based on the export, your user ID is: **U838WQGJE** (Ron Eddings)

## Quick Examples

### Messages sent TO you for Dec 1-7, 2025

```bash
node dist/index.js tome -u U838WQGJE --from 2025-12-01 --to 2025-12-07
```

### Search a specific week

```bash
node dist/index.js week 2025-12-03  # Shows full week containing Dec 3
```

### Get statistics for a date range

```bash
node dist/index.js stats --from 2025-12-01 --to 2025-12-07
```

### Search by text

```bash
node dist/index.js search --from 2025-12-01 --to 2025-12-07 --text "meeting"
```

### Search a specific channel

```bash
node dist/index.js search --channel announcements --from 2025-12-01 --to 2025-12-31
```

### Search only DMs

```bash
node dist/index.js search --from 2025-12-01 --to 2025-12-07 --dms
```

### List all channels

```bash
node dist/index.js channels
node dist/index.js channels --public  # Only public channels
node dist/index.js channels --dms     # Only DMs
```

### List known users

```bash
node dist/index.js users
```

## Commands

### `search`

Search messages with various filters.

```
Options:
  -f, --from <date>      Start date (YYYY-MM-DD)
  -t, --to <date>        End date (YYYY-MM-DD)
  -u, --user <user>      Filter by user (ID or name)
  -c, --channel <name>   Filter by channel
  -s, --text <text>      Search text content
  -m, --mentions <id>    Find messages mentioning user ID
  --dms                  Search only DMs
  --files                Only show messages with files
  -l, --limit <number>   Limit results
  --format <format>      Output format: compact, full, json
```

### `tome`

Show messages sent TO you (DMs from others + mentions).

```
Options:
  -u, --user <userId>    Your user ID (required)
  -f, --from <date>      Start date
  -t, --to <date>        End date
  -l, --limit <number>   Limit results
  --format <format>      Output format: compact, full, json
```

### `week <date>`

Show all messages for the week containing a date.

```
Options:
  -u, --user <user>      Filter by user
  -c, --channel <name>   Filter by channel
  --dms                  Search only DMs
  -l, --limit <number>   Limit results
  --format <format>      Output format
```

### `stats`

Show statistics for a date range.

```
Options:
  -f, --from <date>      Start date
  -t, --to <date>        End date
```

### `channels`

List all channels.

```
Options:
  --dms     Show only DM channels
  --public  Show only public channels
```

### `users`

List all known users (with IDs).

## Output Formats

- `compact` (default): One-line per message
- `full`: Detailed view with files, reactions, etc.
- `json`: Raw JSON output

## Global Options

```
-p, --path <path>   Path to slackdump export (default: auto-detected)
```

## Examples for Your Common Queries

### "What messages did I miss this week?"

```bash
node dist/index.js tome -u U838WQGJE --from 2025-12-16 --to 2025-12-22
```

### "What did the team discuss in #announcements this month?"

```bash
node dist/index.js search --channel announcements --from 2025-12-01 --to 2025-12-31
```

### "Find all messages about QuickBooks"

```bash
node dist/index.js search --text "QuickBooks" --from 2025-01-01 --to 2025-12-31
```

### "Who's been most active in the last week?"

```bash
node dist/index.js stats --from 2025-12-16 --to 2025-12-22
```

### "Show all files shared this week"

```bash
node dist/index.js search --from 2025-12-16 --to 2025-12-22 --files
```
