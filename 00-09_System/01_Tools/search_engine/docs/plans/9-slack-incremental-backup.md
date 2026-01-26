# Slack Incremental Backup & Indexing Workflow

**Created:** 2026-01-24
**Completed:** 2026-01-24
**Status:** ✅ IMPLEMENTED
**Goal:** Automated, incremental Slack backup that runs quickly (<5 min), formats to JSON/Markdown, and indexes into search engine

---

## Executive Summary

This plan creates an automated pipeline that:
1. **Incrementally exports** new Slack messages (not full re-exports)
2. **Converts to JSON** in the existing VRAM structure
3. **Generates Markdown** for new/updated channels
4. **Indexes into PostgreSQL** with embeddings for search
5. **Runs on a schedule** (daily recommended) without manual intervention

**Current State:**
- Last export: December 22, 2025 (slackdump_20251222_043714)
- Most recent message: December 14, 2025 (viral_growth_coordination)
- ~426 channels, ~18,834 JSON day files
- Slackdump installed but **workspace not authenticated**

---

## Phase 1: Authentication Setup

### 1.1 Authenticate Slackdump

**Why:** The slackdump workspace has no authenticated credentials.

```bash
# Interactive browser-based authentication (recommended)
slackdump workspace new

# This opens a browser to authenticate with Slack
# Follow the OAuth flow to grant permissions
```

**Alternative: Token-based authentication**
```bash
# If you have a Slack token (from api.slack.com > Your Apps)
slackdump workspace new -token xoxc-YOUR-TOKEN -cookie "xoxd=YOUR-COOKIE"
```

**Verification:**
```bash
slackdump workspace list
# Should show your authenticated workspace
```

### 1.2 Workspace Configuration

After authentication, set the workspace as current:
```bash
slackdump workspace select <workspace-name>
```

---

## Phase 2: Incremental Export Infrastructure

### 2.1 Create State Tracking Directory

**Location:** `/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/`

```bash
mkdir -p /Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync
```

**Contents:**
- `last_sync.txt` - Timestamp of last successful sync
- `archive.db` - Slackdump SQLite database (incremental state)
- `sync.log` - Sync operation logs

### 2.2 Slackdump Archive Strategy

**Key Insight:** Slackdump's `archive` + `resume` commands enable true incremental backups.

**Initial Archive (one-time):**
```bash
cd /Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync

# Create initial archive database from existing data
slackdump archive \
  -files=true \
  -threads=true \
  -member-only \
  -time-from 2024-12-14 \
  ./slackdump_archive
```

**Incremental Updates (daily):**
```bash
# Resume from where we left off - only fetches NEW messages
slackdump resume \
  -files=true \
  -threads=true \
  ./slackdump_archive
```

### 2.3 Convert Archive to JSON Export Format

After each resume, convert to the JSON structure your tools expect:

```bash
# Convert database to Slack Export format (directory structure)
slackdump convert \
  -format export \
  -o /Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/export_temp \
  ./slackdump_archive
```

---

## Phase 3: JSON Sync Script

**File:** `/Volumes/VRAM/00-09_System/01_Tools/search_engine/scripts/sync-slack-json.ts`

### 3.1 Script Specification

```typescript
/**
 * sync-slack-json.ts
 *
 * Syncs new/updated JSON files from slackdump export to VRAM structure.
 * Only copies files newer than last sync timestamp.
 */

const SYNC_DIR = "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync";
const EXPORT_TEMP = `${SYNC_DIR}/export_temp`;
const JSON_TARGET = "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json";
const LAST_SYNC_FILE = `${SYNC_DIR}/last_sync.txt`;

interface SyncResult {
  channelsUpdated: string[];
  filesAdded: number;
  filesUpdated: number;
  newLatestDate: string;
}

async function syncSlackJson(): Promise<SyncResult> {
  // 1. Read last sync timestamp
  const lastSync = await getLastSyncTime();

  // 2. Find all JSON files in export_temp newer than lastSync
  const newFiles = await findNewFiles(EXPORT_TEMP, lastSync);

  // 3. Copy to target, preserving directory structure
  const result = await copyNewFiles(newFiles, JSON_TARGET);

  // 4. Update last sync timestamp
  await updateLastSyncTime();

  // 5. Copy users.json if updated
  await syncUsersFile();

  return result;
}
```

### 3.2 Key Functions

**Find new files:**
```typescript
async function findNewFiles(exportDir: string, since: Date): Promise<string[]> {
  const glob = new Bun.Glob("**/*.json");
  const files: string[] = [];

  for await (const file of glob.scan(exportDir)) {
    const stat = await Bun.file(`${exportDir}/${file}`).stat();
    if (stat.mtime > since) {
      files.push(file);
    }
  }

  return files;
}
```

**Incremental copy with deduplication:**
```typescript
async function copyNewFiles(files: string[], targetDir: string): Promise<SyncResult> {
  const channelsUpdated = new Set<string>();
  let filesAdded = 0;
  let filesUpdated = 0;

  for (const file of files) {
    const channel = file.split('/')[0];
    const targetPath = `${targetDir}/${file}`;

    // Check if file exists and is different
    const targetFile = Bun.file(targetPath);
    const exists = await targetFile.exists();

    if (!exists) {
      filesAdded++;
    } else {
      filesUpdated++;
    }

    // Ensure directory exists
    await Bun.write(targetPath, await Bun.file(`${EXPORT_TEMP}/${file}`).text());
    channelsUpdated.add(channel);
  }

  return {
    channelsUpdated: Array.from(channelsUpdated),
    filesAdded,
    filesUpdated,
    newLatestDate: new Date().toISOString()
  };
}
```

---

## Phase 4: Incremental Markdown Conversion

**File:** `/Volumes/VRAM/00-09_System/01_Tools/search_engine/scripts/convert-slack-md-incremental.ts`

### 4.1 Modification to Existing Converter

The existing `convert-to-md.ts` processes ALL channels. Create an incremental version:

```typescript
/**
 * convert-slack-md-incremental.ts
 *
 * Converts only new/updated channels to Markdown.
 * Takes list of updated channels from sync step.
 */

const JSON_PATH = '/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json';
const MD_PATH = '/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/markdown';

interface ConvertOptions {
  channels?: string[];  // If empty, convert all
  since?: Date;         // Only process files modified after this date
}

async function convertIncrementalToMd(options: ConvertOptions): Promise<void> {
  const { channels, since } = options;

  // Get channels to process
  const channelsToProcess = channels?.length
    ? channels
    : await getAllChannels();

  for (const channel of channelsToProcess) {
    await convertChannel(channel, since);
  }
}

async function convertChannel(channelName: string, since?: Date): Promise<void> {
  const channelDir = `${JSON_PATH}/${channelName}`;
  const files = await readdir(channelDir);

  // Filter to files modified since last run
  const jsonFiles = files
    .filter(f => f.endsWith('.json'))
    .filter(async f => {
      if (!since) return true;
      const stat = await Bun.file(`${channelDir}/${f}`).stat();
      return stat.mtime > since;
    });

  if (jsonFiles.length === 0) return;

  // Group by year/month and regenerate those markdown files
  const yearMonths = new Set<string>();
  for (const file of jsonFiles) {
    const [year, month] = file.split('-');
    yearMonths.add(`${year}-${month}`);
  }

  for (const ym of yearMonths) {
    await regenerateMarkdownForMonth(channelName, ym);
  }
}
```

### 4.2 Output Structure

Maintains existing structure:
```
markdown/
├── 2025/
│   └── 12/
│       ├── 2025-12-announcements.md
│       └── 2025-12-viral_growth_coordination.md
└── 2026/
    └── 01/
        └── 2026-01-announcements.md
```

---

## Phase 5: Incremental Search Engine Indexing

### 5.1 Existing Incremental Logic

The `slack-indexer.ts` already has incremental logic:
```typescript
// Check if already indexed
const existing = await sql`
  SELECT COUNT(*)::int as cnt FROM slack_chunks
  WHERE channel = ${channel} AND message_date = ${date}::date
`;

if ((existing[0] as { cnt: number }).cnt > 0) {
  skipped++;  // Skip already indexed
  continue;
}
```

### 5.2 Enhanced Incremental Indexer

**File:** `/Volumes/VRAM/00-09_System/01_Tools/search_engine/scripts/index-slack-incremental.ts`

```typescript
/**
 * index-slack-incremental.ts
 *
 * Indexes only channels/dates that have new or updated content.
 * Much faster than full reindex.
 */

interface IndexOptions {
  channels?: string[];      // Specific channels to index
  since?: Date;             // Only index files modified after this
  forceReindex?: boolean;   // Force reindex even if already indexed
}

async function indexSlackIncremental(options: IndexOptions): Promise<void> {
  const { channels, since, forceReindex } = options;

  // If forceReindex, delete existing chunks for specified channels/dates
  if (forceReindex && channels) {
    for (const channel of channels) {
      await sql`DELETE FROM slack_chunks WHERE channel = ${channel}`;
    }
  }

  // Use existing iterator but filter
  for await (const { channel, date, messages } of iterateSlackChannels()) {
    // Skip if not in our target list
    if (channels && !channels.includes(channel)) continue;

    // Skip if file older than since date
    if (since) {
      const filePath = `${SLACK_BASE}/${channel}/${date}.json`;
      const stat = await Bun.file(filePath).stat();
      if (stat.mtime < since) continue;
    }

    // Rest of existing indexing logic...
    await indexChannel(channel, date, messages);
  }
}
```

### 5.3 Re-run Enhancer for New Chunks

After indexing, run the enhancer on new chunks:
```typescript
// In slack-enhancer.ts, add option to only enhance unenhanced chunks
const unenhanced = await sql`
  SELECT id, channel, chunk_text FROM slack_chunks
  WHERE real_names IS NULL OR array_length(real_names, 1) IS NULL
`;
```

---

## Phase 6: Unified Sync Script

**File:** `/Volumes/VRAM/00-09_System/01_Tools/search_engine/scripts/slack-sync.ts`

### 6.1 Master Orchestration Script

```typescript
#!/usr/bin/env bun
/**
 * slack-sync.ts
 *
 * Master script that orchestrates the complete Slack sync workflow:
 * 1. Incremental slackdump export (via resume)
 * 2. JSON sync to VRAM structure
 * 3. Incremental Markdown conversion
 * 4. Incremental search engine indexing
 *
 * Usage: bun slack-sync.ts [--full] [--dry-run]
 */

const SYNC_DIR = "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync";
const ARCHIVE_DIR = `${SYNC_DIR}/slackdump_archive`;

interface SyncOptions {
  full?: boolean;      // Force full sync (not incremental)
  dryRun?: boolean;    // Show what would happen without doing it
  skipExport?: boolean; // Skip slackdump, just process existing data
}

async function main() {
  const args = process.argv.slice(2);
  const options: SyncOptions = {
    full: args.includes('--full'),
    dryRun: args.includes('--dry-run'),
    skipExport: args.includes('--skip-export')
  };

  console.log("🔄 VRAM Slack Sync\n");
  console.log("=".repeat(50));

  const startTime = performance.now();

  // Step 1: Incremental slackdump export
  if (!options.skipExport) {
    console.log("\n📥 Step 1: Fetching new messages from Slack...");
    await runSlackdumpResume(options);
  }

  // Step 2: Convert archive to export format
  console.log("\n📁 Step 2: Converting to JSON export format...");
  await convertArchiveToExport(options);

  // Step 3: Sync JSON to VRAM structure
  console.log("\n📋 Step 3: Syncing JSON files to VRAM...");
  const syncResult = await syncSlackJson(options);

  // Step 4: Convert updated channels to Markdown
  console.log("\n📝 Step 4: Converting to Markdown...");
  await convertToMarkdown(syncResult.channelsUpdated, options);

  // Step 5: Index new content
  console.log("\n🔍 Step 5: Indexing to search engine...");
  await indexNewContent(syncResult.channelsUpdated, options);

  // Step 6: Enhance new chunks
  console.log("\n✨ Step 6: Enhancing metadata...");
  await enhanceNewChunks(options);

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("✅ Sync Complete!\n");
  console.log(`  Channels updated: ${syncResult.channelsUpdated.length}`);
  console.log(`  Files added: ${syncResult.filesAdded}`);
  console.log(`  Files updated: ${syncResult.filesUpdated}`);
  console.log(`  Time: ${elapsed.toFixed(1)}s`);
  console.log("=".repeat(50));
}

// Step implementations...

async function runSlackdumpResume(options: SyncOptions): Promise<void> {
  if (options.dryRun) {
    console.log("  [DRY RUN] Would run: slackdump resume");
    return;
  }

  const proc = Bun.spawn([
    "slackdump", "resume",
    "-files=true",
    "-threads=true",
    ARCHIVE_DIR
  ], {
    cwd: SYNC_DIR,
    stdout: "inherit",
    stderr: "inherit"
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`slackdump resume failed with code ${exitCode}`);
  }
}

async function convertArchiveToExport(options: SyncOptions): Promise<void> {
  if (options.dryRun) {
    console.log("  [DRY RUN] Would run: slackdump convert");
    return;
  }

  const exportTemp = `${SYNC_DIR}/export_temp`;

  // Clean previous export
  await Bun.$`rm -rf ${exportTemp}`;

  const proc = Bun.spawn([
    "slackdump", "convert",
    "-format", "export",
    "-o", exportTemp,
    ARCHIVE_DIR
  ], {
    cwd: SYNC_DIR,
    stdout: "inherit",
    stderr: "inherit"
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`slackdump convert failed with code ${exitCode}`);
  }
}

main().catch(err => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
```

---

## Phase 7: Scheduling & Automation

### 7.1 Launchd Plist (macOS)

**File:** `~/Library/LaunchAgents/com.vram.slack-sync.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vram.slack-sync</string>

    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/bun</string>
        <string>/Volumes/VRAM/00-09_System/01_Tools/search_engine/scripts/slack-sync.ts</string>
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
    <string>/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/logs/sync.log</string>

    <key>StandardErrorPath</key>
    <string>/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/logs/sync-error.log</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
</dict>
</plist>
```

### 7.2 Load the Schedule

```bash
# Create log directory
mkdir -p /Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/logs

# Load the launchd job
launchctl load ~/Library/LaunchAgents/com.vram.slack-sync.plist

# Verify it's loaded
launchctl list | grep slack-sync

# Run manually to test
launchctl start com.vram.slack-sync
```

### 7.3 Alternative: Cron Job

```bash
# Edit crontab
crontab -e

# Add daily sync at 6 AM
0 6 * * * cd /Volumes/VRAM/00-09_System/01_Tools/search_engine && /opt/homebrew/bin/bun scripts/slack-sync.ts >> /Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/logs/sync.log 2>&1
```

---

## Phase 8: Monitoring & Health Checks

### 8.1 Health Check Endpoint

Add to search engine server:

```typescript
// In server.ts
app.get("/health/slack-sync", async (c) => {
  const syncDir = "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync";
  const lastSyncFile = `${syncDir}/last_sync.txt`;

  const lastSync = await Bun.file(lastSyncFile).text().catch(() => null);
  const lastSyncDate = lastSync ? new Date(lastSync) : null;

  const ageHours = lastSyncDate
    ? (Date.now() - lastSyncDate.getTime()) / (1000 * 60 * 60)
    : null;

  return c.json({
    status: ageHours && ageHours < 48 ? "healthy" : "stale",
    lastSync: lastSyncDate?.toISOString(),
    ageHours: ageHours?.toFixed(1),
    warning: ageHours && ageHours > 24 ? "Sync is more than 24 hours old" : null
  });
});
```

### 8.2 CLI Status Command

```bash
# Add to slack-sync.ts
if (args.includes('--status')) {
  const lastSync = await getLastSyncTime();
  const stats = await getSlackStats();

  console.log("Slack Sync Status");
  console.log("=================");
  console.log(`Last sync: ${lastSync.toISOString()}`);
  console.log(`Channels: ${stats.channels}`);
  console.log(`Messages indexed: ${stats.chunks}`);
  console.log(`Age: ${getAgeString(lastSync)}`);
  process.exit(0);
}
```

---

## Implementation Checklist

### Prerequisites
- [x] Authenticate slackdump workspace (workspace: default)
- [x] Verify VRAM volume is mounted
- [x] Ensure PostgreSQL is running
- [x] Ensure embedding server is available (for indexing)

### Phase 1: Authentication
- [x] Run `slackdump workspace new`
- [x] Complete OAuth flow
- [x] Verify with `slackdump workspace list`

### Phase 2: Directory Setup
- [x] Create `.sync` directory
- [x] Create initial archive with `slackdump archive` (22.6 MB archive)
- [x] Create logs directory

### Phase 3: Scripts
- [x] Create `slack-sync.ts` master script
- [x] Create `sync-slack-json.ts` helper
- [x] Create `convert-slack-md-incremental.ts` helper
- [x] Create `index-slack-incremental.ts` helper

### Phase 4: Testing
- [x] Run sync manually: `bun slack-sync.ts`
- [x] Verify JSON files updated (436 files across 54 channels)
- [x] Verify Markdown files generated (2,234 files)
- [x] Verify search index updated (12,771 slack chunks)
- [x] Test incremental (run again, should be fast)

### Phase 5: Scheduling
- [x] Create launchd plist
- [x] Load with `launchctl load`
- [x] Verify job runs on schedule (daily at 6 AM)

### Phase 6: Monitoring
- [x] Add health check endpoint (`/health/slack-sync`)
- [x] Test health check: `curl localhost:3000/health/slack-sync`
- [x] Verified via Chrome MCP browser automation

---

## Performance Expectations

| Operation | Full Run | Incremental (daily) |
|-----------|----------|---------------------|
| Slackdump export | 30-60 min | 1-5 min |
| JSON sync | 10-20 min | <30 sec |
| Markdown conversion | 5-10 min | <1 min |
| Search indexing | 30-60 min | 1-5 min |
| **Total** | **1-2 hours** | **<10 min** |

---

## File Locations Summary

| Component | Location |
|-----------|----------|
| Master sync script | `/Volumes/VRAM/00-09_System/01_Tools/search_engine/scripts/slack-sync.ts` |
| Sync state directory | `/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/` |
| Slackdump archive | `.sync/slackdump_archive/` |
| JSON output | `14.02_slack/json/` |
| Markdown output | `14.02_slack/markdown/` |
| Sync logs | `.sync/logs/` |
| Launchd plist | `~/Library/LaunchAgents/com.vram.slack-sync.plist` |

---

## Troubleshooting

### "No authenticated workspaces"
```bash
slackdump workspace new
# Re-authenticate
```

### "Rate limited by Slack"
The slackdump tool handles rate limits automatically. If issues persist:
- Use `-time-from` to limit date range
- Add delays between batches

### "Embedding server not available"
```bash
# Check if running
curl http://localhost:8081/health

# Start via unified server
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine
bun start
```

### "PostgreSQL connection failed"
```bash
# Check PostgreSQL
pg_isready -h localhost -p 5432

# Start if needed
brew services start postgresql
```

---

## Next Steps After Implementation

1. **Run initial full sync** to establish baseline
2. **Verify incremental** works correctly
3. **Enable scheduled automation**
4. **Add to PAI status dashboard** for visibility
5. **Consider webhook integration** for real-time updates (advanced)
