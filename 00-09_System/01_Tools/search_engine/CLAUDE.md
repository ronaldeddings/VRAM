# CLAUDE.md - VRAM Search Engine

## Project Overview

Full-text search engine for the VRAM (Video RAM) personal data asset management system. Built with Bun runtime, SQLite FTS5, and REST API.

**Purpose**: Index and search text files (`.md`, `.txt`, `.json`) across the VRAM filesystem with sub-100ms query performance.

## Architecture

```
VRAM Volume (/Volumes/VRAM)
├── 00-09_System/
│   ├── 00_Index/search.db      ← SQLite database with FTS5
│   └── 01_Tools/search_engine/ ← This project
├── 10-19_Work/
├── 20-29_Finance/
├── ...other Johnny.Decimal areas
```

### Components

| File | Purpose | Run Command |
|------|---------|-------------|
| `indexer.ts` | Full reindex of VRAM filesystem | `bun run index` |
| `server.ts` | REST API server (port 3000) | `bun run serve` |
| `cli.ts` | Terminal search interface | `bun run search "query"` |
| `watcher.ts` | Real-time file change monitor | `bun run watch` |
| `index.html` | Web UI (served at `/`) | via server |

## Bun Runtime

Default to Bun instead of Node.js:

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`

### Bun APIs Used

- `bun:sqlite` - SQLite with FTS5 full-text search
- `Bun.serve()` - HTTP server with routes
- `Bun.file()` - File reading
- `Bun.Glob` - Filesystem globbing

## Database Schema

**Location**: `/Volumes/VRAM/00-09_System/00_Index/search.db`

```sql
-- Main files table
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  extension TEXT,
  content TEXT,
  file_size INTEGER,
  modified_at TEXT,
  indexed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  area TEXT,
  category TEXT
);

-- FTS5 virtual table for full-text search
CREATE VIRTUAL TABLE files_fts USING fts5(
  path, filename, content, area, category,
  content='files', content_rowid='id',
  tokenize='porter unicode61'
);
```

### Area Mapping

Areas are extracted from Johnny.Decimal folder prefixes:

| Prefix | Area |
|--------|------|
| `00-09` | System |
| `10-19` | Work |
| `20-29` | Finance |
| `30-39` | Personal |
| `40-49` | Family |
| `50-59` | Social |
| `60-69` | Growth |
| `70-79` | Lifestyle |
| `80-89` | Resources |
| `90-99` | Archive |

## REST API

Base URL: `http://localhost:3000`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web UI |
| `/search?q=<query>&limit=20&offset=0&area=<area>` | GET | Full-text search |
| `/file?path=<path>&content=true` | GET | Get file metadata/content |
| `/browse/<area>?limit=50` | GET | Browse files by area |
| `/stats` | GET | Index statistics |
| `/health` | GET | Health check |

### Search Query Syntax

Uses SQLite FTS5 query syntax:
- `meeting notes` - matches both terms (AND)
- `"meeting notes"` - exact phrase
- `meeting OR notes` - either term
- `meet*` - prefix matching
- `meeting NOT notes` - exclusion

## CLI Usage

```bash
# Basic search
bun cli.ts "meeting with Emily"

# Filter by area
bun cli.ts "budget 2024" -a Finance

# Filter by file type
bun cli.ts "API documentation" -t md

# JSON output
bun cli.ts "project plan" --json

# Show statistics
bun cli.ts -s
```

## Development Commands

```bash
# Install dependencies
bun install

# Run full index
bun run index

# Start API server (foreground)
bun run serve

# Start API server (background)
bun server.ts &

# Start file watcher
bun run watch

# Search from CLI
bun run search "query"

# Type checking
bunx tsc --noEmit
```

## Common Operations

### Rebuild Index

```bash
# Stop running server if any
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Run full reindex
bun run index

# Restart server
bun server.ts &
```

### Check Server Status

```bash
curl http://localhost:3000/health
curl http://localhost:3000/stats
```

### Test Search

```bash
curl "http://localhost:3000/search?q=test&limit=5"
```

## File Exclusions

The indexer skips these paths:
- `00_Index/` - The search database itself
- `node_modules/` - Dependencies
- `Backup/` - Backup directories
- `tools/` - Tool directories at root

## Performance Targets

- Search queries: <100ms
- Index rebuild: <60s for 10K files
- File watcher debounce: 500ms

## Troubleshooting

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database locked
The database uses WAL mode. If locked:
```bash
# Stop all processes accessing the DB
pkill -f "bun.*search"
# Rebuild index
bun run index
```

### Search returns no results
1. Check if database exists: `ls -la /Volumes/VRAM/00-09_System/00_Index/search.db`
2. Check file count: `bun cli.ts -s`
3. Rebuild if needed: `bun run index`

## Related Documentation

- `docs/README.md` - User documentation
- `docs/API.md` - API reference
- `docs/CLI.md` - CLI guide
- `docs/CONFIG.md` - Configuration and setup
- `docs/plans/implementation-plan.md` - Original implementation plan
