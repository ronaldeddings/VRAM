# Slack Sync System

Automated incremental backup and search indexing for Slack messages.

## Overview

The Slack sync system provides:
- **Incremental Backup**: Only syncs new/updated channels
- **Markdown Conversion**: Human-readable message format
- **Search Indexing**: Full-text and semantic search via PostgreSQL
- **Automated Scheduling**: Daily sync via launchd

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Slack Sync Pipeline                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  slackdump   │───▶│  JSON Files  │───▶│  sync-slack-json │  │
│  │  (archive)   │    │  (per day)   │    │  (incremental)   │  │
│  └──────────────┘    └──────────────┘    └────────┬─────────┘  │
│                                                    │            │
│                                                    ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  PostgreSQL  │◀───│  Embeddings  │◀───│ convert-markdown │  │
│  │ slack_chunks │    │ (Qwen3-8B)   │    │  (incremental)   │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

| Script | Purpose |
|--------|---------|
| `scripts/slack-sync.ts` | Master orchestrator - runs all steps |
| `scripts/sync-slack-json.ts` | Syncs JSON from slackdump archive |
| `scripts/convert-slack-markdown.ts` | Converts JSON to markdown |
| `scripts/index-slack-incremental.ts` | Indexes to PostgreSQL |

## Usage

### Manual Sync

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Full sync (all steps)
bun scripts/slack-sync.ts

# Individual steps
bun scripts/sync-slack-json.ts          # Step 1: Sync JSON
bun scripts/convert-slack-markdown.ts   # Step 2: Convert to markdown
bun scripts/index-slack-incremental.ts  # Step 3: Index to PostgreSQL
```

### Check Sync Status

```bash
# Via API
curl http://localhost:3000/health/slack-sync

# Response
{
  "status": "ok",
  "last_sync": "2026-01-24T16:45:29.513Z",
  "age_hours": 2.5,
  "archive_exists": true,
  "archive_size_mb": 156.2,
  "healthy": true
}
```

### Search Slack Messages

```bash
# Via API
curl "http://localhost:3000/search?q=podcast&sources=slack"

# Via CLI
bun cli.ts "podcast" --sources slack

# Via Web UI
# Select "Slack" checkbox in Sources filter
```

## File Locations

| Path | Content |
|------|---------|
| `14.02_slack/.sync/slackdump_archive/` | slackdump SQLite archive |
| `14.02_slack/.sync/last_sync.txt` | Last sync timestamp |
| `14.02_slack/json/` | Extracted JSON per channel |
| `14.02_slack/markdown/` | Converted markdown files |

### Markdown Structure

```
14.02_slack/markdown/
├── 2026/
│   └── 01/
│       ├── 2026-01-general.md
│       ├── 2026-01-random.md
│       └── 2026-01-D09NHB4ME1L.md  # DM channels
└── 2025/
    └── 12/
        └── ...
```

## Automated Scheduling

### launchd Configuration

Location: `~/Library/LaunchAgents/com.vram.slack-sync.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vram.slack-sync</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/ronaldeddings/.bun/bin/bun</string>
        <string>scripts/slack-sync.ts</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Volumes/VRAM/00-09_System/01_Tools/search_engine</string>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>6</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/slack-sync.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/slack-sync.err</string>
</dict>
</plist>
```

### Managing the Schedule

```bash
# Load (enable)
launchctl load ~/Library/LaunchAgents/com.vram.slack-sync.plist

# Unload (disable)
launchctl unload ~/Library/LaunchAgents/com.vram.slack-sync.plist

# Check status
launchctl list | grep slack-sync

# View logs
tail -f /tmp/slack-sync.log
```

## Database Schema

### slack_chunks Table

```sql
CREATE TABLE slack_chunks (
  id SERIAL PRIMARY KEY,
  channel TEXT NOT NULL,
  channel_type TEXT,           -- public, private, dm, group_dm
  speakers TEXT[],             -- Array of speaker names
  user_ids TEXT[],             -- Array of Slack user IDs
  start_ts TEXT,               -- First message timestamp
  end_ts TEXT,                 -- Last message timestamp
  message_date DATE,           -- Date for deduplication
  message_count INTEGER,
  has_files BOOLEAN,
  has_reactions BOOLEAN,
  chunk_index INTEGER,
  chunk_text TEXT,
  chunk_size INTEGER,
  embedding VECTOR(4096)       -- pgvector embedding
);

-- Indexes
CREATE INDEX idx_slack_channel ON slack_chunks(channel);
CREATE INDEX idx_slack_date ON slack_chunks(message_date);
CREATE INDEX idx_slack_embedding ON slack_chunks
  USING ivfflat (embedding vector_cosine_ops);
```

## Chunking Strategy

Messages are grouped by:
1. **Time Window**: 15-minute conversation blocks
2. **Size Limits**: 500-2200 characters per chunk
3. **Overlap**: 300 characters for context continuity

### Chunk Format

```
[09:42] Colin: @user - not sure where to post this ...

[11:42] Ron Eddings: I will take a look shortly - I'll also transcribe
and then upload the transcripts to Google Drive

[12:23] Colin: Thanks @user - can you post in #via-media please?

[12:37] Ron Eddings: will do :100:
```

## Health Monitoring

### Health Endpoint

`GET /health/slack-sync`

| Field | Description |
|-------|-------------|
| `status` | "ok", "stale", "warning", "error" |
| `last_sync` | ISO timestamp of last sync |
| `age_hours` | Hours since last sync |
| `archive_exists` | slackdump archive present |
| `archive_size_mb` | Archive size in MB |
| `healthy` | true if sync < 25 hours old |

### Alert Thresholds

- **Healthy**: Last sync < 25 hours
- **Stale**: Last sync > 25 hours
- **Warning**: Archive missing or sync never run

## Troubleshooting

### Sync Not Running

```bash
# Check launchd status
launchctl list | grep slack-sync

# Check for errors
cat /tmp/slack-sync.err

# Run manually to debug
bun scripts/slack-sync.ts
```

### Embedding Server Issues

```bash
# Check embedding server
curl http://localhost:8081/health

# Start unified server
bun start
```

### Missing Messages

1. Check slackdump archive has new data
2. Verify JSON files extracted: `ls 14.02_slack/json/<channel>/`
3. Check markdown generated: `ls 14.02_slack/markdown/2026/01/`
4. Query database directly:
   ```sql
   SELECT COUNT(*) FROM slack_chunks
   WHERE message_date = '2026-01-24';
   ```

## Dependencies

- [slackdump](https://github.com/rusq/slackdump) - Slack export tool
- PostgreSQL with pgvector extension
- Embedding server (Qwen3-Embedding-8B on port 8081)
