# VRAM Search Configuration

Setup and configuration guide for the VRAM Search system.

## Installation

### Prerequisites

1. Install [Bun](https://bun.sh):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Ensure VRAM volume is mounted at `/Volumes/VRAM`

### Initial Setup

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Install dependencies (if any)
bun install

# Build the initial index
bun indexer.ts
```

## Components

### Server (`server.ts`)

The HTTP API server with Web UI.

**Configuration**:
- Port: 3000 (hardcoded)
- Database: `/Volumes/VRAM/00-09_System/00_Index/search.db`

**Start**:
```bash
bun server.ts
```

### Indexer (`indexer.ts`)

Scans VRAM and builds the FTS5 search index.

**Indexed Paths**:
- `/Volumes/VRAM/**/*.md`
- `/Volumes/VRAM/**/*.txt`
- `/Volumes/VRAM/**/*.json`

**Excluded Paths**:
- `00_Index/` - Database directory
- `node_modules/` - Dependencies
- `Backup/` - Backup files
- `tools/` - External tools

**Run**:
```bash
bun indexer.ts
```

### Watcher (`watcher.ts`)

Real-time file change detection and incremental indexing.

**Features**:
- Debounced updates (500ms)
- Handles create, modify, delete events
- Same exclusion rules as indexer

**Start**:
```bash
bun watcher.ts
```

### Raycast (`vram-search.sh`)

Raycast script command for quick searches.

**Installation**:
```bash
# Create Raycast script commands directory
mkdir -p ~/Documents/Raycast/script-commands

# Symlink the script
ln -sf /Volumes/VRAM/00-09_System/01_Tools/search_engine/vram-search.sh \
       ~/Documents/Raycast/script-commands/vram-search.sh
```

Then in Raycast:
1. Open Raycast preferences
2. Go to Extensions > Script Commands
3. Add the `~/Documents/Raycast/script-commands` directory

## Auto-Start (launchd)

### Server Service

Create `/Users/YOUR_USERNAME/Library/LaunchAgents/com.vram.search-server.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vram.search-server</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>export PATH="$HOME/.bun/bin:$PATH"; cd /Volumes/VRAM/00-09_System/01_Tools/search_engine; exec bun server.ts</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/vram-server.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/vram-server.err</string>
</dict>
</plist>
```

### Watcher Service

Create `/Users/YOUR_USERNAME/Library/LaunchAgents/com.vram.file-watcher.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vram.file-watcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>export PATH="$HOME/.bun/bin:$PATH"; cd /Volumes/VRAM/00-09_System/01_Tools/search_engine; exec bun watcher.ts</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/vram-watcher.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/vram-watcher.err</string>
</dict>
</plist>
```

### Load Services

```bash
launchctl load ~/Library/LaunchAgents/com.vram.search-server.plist
launchctl load ~/Library/LaunchAgents/com.vram.file-watcher.plist
```

### Manage Services

```bash
# Start
launchctl start com.vram.search-server
launchctl start com.vram.file-watcher

# Stop
launchctl stop com.vram.search-server
launchctl stop com.vram.file-watcher

# Unload
launchctl unload ~/Library/LaunchAgents/com.vram.search-server.plist
launchctl unload ~/Library/LaunchAgents/com.vram.file-watcher.plist

# Check status
launchctl list | grep vram
```

## Database Schema

The SQLite database at `/Volumes/VRAM/00-09_System/00_Index/search.db`:

```sql
-- Main files table
CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    filename TEXT NOT NULL,
    extension TEXT,
    area TEXT,
    category TEXT,
    content TEXT,
    file_size INTEGER,
    modified_at TEXT,
    indexed_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE files_fts USING fts5(
    filename,
    area,
    content,
    content='files',
    content_rowid='id',
    tokenize='porter'
);

-- Indexes
CREATE INDEX idx_files_area ON files(area);
CREATE INDEX idx_files_extension ON files(extension);
CREATE INDEX idx_files_modified ON files(modified_at);
```

## Rebuilding the Index

To completely rebuild the search index:

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Remove old database
rm /Volumes/VRAM/00-09_System/00_Index/search.db

# Rebuild
bun indexer.ts
```

## Troubleshooting

### Server won't start

1. Check if port 3000 is in use:
   ```bash
   lsof -i:3000
   ```

2. Kill existing process:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

### Watcher high CPU

1. Check file descriptor limit:
   ```bash
   ulimit -n
   ```

2. Increase limit:
   ```bash
   ulimit -n 10240
   ```

### Search returns no results

1. Verify database exists:
   ```bash
   ls -la /Volumes/VRAM/00-09_System/00_Index/search.db
   ```

2. Check file count:
   ```bash
   bun cli.ts -s
   ```

3. Rebuild index if needed:
   ```bash
   bun indexer.ts
   ```

### launchd services not starting

1. Check logs:
   ```bash
   cat /tmp/vram-server.log
   cat /tmp/vram-server.err
   ```

2. Verify Bun path:
   ```bash
   which bun
   ```

3. Test manually first:
   ```bash
   cd /Volumes/VRAM/00-09_System/01_Tools/search_engine
   bun server.ts
   ```
