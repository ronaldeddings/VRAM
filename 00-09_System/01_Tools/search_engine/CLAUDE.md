# CLAUDE.md - VRAM Search Engine

## Project Overview

Full-text search engine for the VRAM (Video RAM) personal data asset management system. Built with Bun runtime, **PostgreSQL** (tsvector FTS + pgvector embeddings), and REST API.

**Purpose**: Index and search text files (`.md`, `.txt`, `.json`) across the VRAM filesystem with keyword, semantic, and hybrid search capabilities.

**Key Features**:
- **Keyword Search**: PostgreSQL tsvector full-text search
- **Semantic Search**: pgvector with Qwen3-Embedding-8B (4096 dimensions)
- **Hybrid Search**: Reciprocal Rank Fusion (RRF) combining both
- **Multi-Agent Safe**: PostgreSQL MVCC enables concurrent writes from AI agents

## Architecture

```
VRAM Volume (/Volumes/VRAM)
├── 00-09_System/
│   ├── 00_Index/search.db      ← SQLite (archived, not used)
│   └── 01_Tools/search_engine/ ← This project
├── 10-19_Work/
├── 20-29_Finance/
├── ...other Johnny.Decimal areas

PostgreSQL Database (vram_embeddings)
├── documents         ← File metadata + FTS tsvector
├── chunks            ← File chunk embeddings
├── email_chunks      ← Email embeddings
└── slack_chunks      ← Slack message embeddings
```

### Components

| File | Purpose | Run Command |
|------|---------|-------------|
| `start.ts` | Unified server startup (embedding + API) | `bun start` |
| `indexer.ts` | Full reindex of VRAM filesystem | `bun run index` |
| `server.ts` | REST API server (port 3000) | `bun run serve` |
| `cli.ts` | Terminal search interface | `bun run search "query"` |
| `watcher.ts` | Real-time file change monitor | `bun run watch` |
| `pg-fts.ts` | PostgreSQL FTS client module | imported |
| `pg-client.ts` | PostgreSQL/pgvector client | imported |
| `index.html` | Web UI (served at `/`) | via server |

### Slack Sync Scripts

| File | Purpose | Run Command |
|------|---------|-------------|
| `scripts/slack-sync.ts` | Master orchestrator | `bun scripts/slack-sync.ts` |
| `scripts/sync-slack-json.ts` | Extract JSON from slackdump | imported by slack-sync |
| `scripts/convert-slack-markdown.ts` | Convert JSON to markdown | imported by slack-sync |
| `scripts/index-slack-incremental.ts` | Index to PostgreSQL | imported by slack-sync |

**Slack Data Locations:**
- Archive: `/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/slackdump_archive/`
- JSON: `/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json/`
- Markdown: `/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/markdown/`

**Automated Schedule:** Daily at 6 AM via launchd (`~/Library/LaunchAgents/com.vram.slack-sync.plist`)

## Bun Runtime

Default to Bun instead of Node.js:

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install`
- Use `bun run <script>` instead of `npm run <script>`

### Bun APIs Used

- `Bun.SQL` - PostgreSQL client (FTS + pgvector)
- `Bun.serve()` - HTTP server with routes
- `Bun.file()` - File reading
- `Bun.Glob` - Filesystem globbing

## Database Schema

**Location**: PostgreSQL database `vram_embeddings` on `localhost:5432`

```sql
-- Main documents table with auto-generated tsvector
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  extension TEXT,
  content TEXT,
  file_size INTEGER,
  modified_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ DEFAULT NOW(),
  area TEXT,
  category TEXT,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(filename, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED
);

-- GIN index for fast FTS
CREATE INDEX idx_documents_search ON documents USING GIN (search_vector);

-- Vector embeddings table
CREATE TABLE chunks (
  id SERIAL PRIMARY KEY,
  file_path TEXT,
  chunk_index INTEGER,
  chunk_text TEXT,
  embedding VECTOR(4096),
  document_id INTEGER REFERENCES documents(id)
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

### Search Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/search` | GET | Keyword search (PostgreSQL tsvector) |
| `/semantic` | GET | Semantic search (pgvector) |
| `/hybrid` | GET | Combined search (RRF fusion) |
| `/explain` | GET | Search explanation (debug) |
| `/search/emails` | GET | Email-specific semantic search |
| `/search/slack` | GET | Slack-specific semantic search |

### Other Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Web UI |
| `/file?path=<path>&content=true` | GET | Get file metadata/content |
| `/browse/<area>?limit=50` | GET | Browse files by area |
| `/stats` | GET | Index statistics |
| `/health` | GET | Health check |
| `/health/slack-sync` | GET | Slack sync status |
| `/embed` | POST | Generate embedding for text |
| `/embedding/status` | GET | Embedding server status |

### Search Query Syntax

Uses PostgreSQL tsquery syntax:
- `meeting notes` - matches both terms (AND)
- `"meeting notes"` - exact phrase (use single quotes in tsquery)
- `meeting OR notes` - either term (use `|`)
- `meet*` - prefix matching (use `:*`)
- `meeting NOT notes` - exclusion (use `!`)

### Hybrid Search Parameters

```
GET /hybrid?q=<query>&limit=10&fts_weight=0.4&strategy=rrf&sources=file,email,slack
```

- `fts_weight`: Weight for keyword results (0-1, default 0.4)
- `strategy`: `rrf` (default), `weighted`, or `max`
- `sources`: Comma-separated list of sources to search

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

# Start both embedding server and API server (recommended)
bun start

# Run full reindex
bun run index

# Start API server only (foreground)
bun run serve

# Start file watcher
bun run watch

# Search from CLI
bun run search "query"

# Type checking
bunx tsc --noEmit
```

## Common Operations

### Start Services

```bash
# Start unified server (embedding + API)
bun start

# Or start in background
bun start &
```

### Rebuild Index

```bash
# Stop running server if any
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Run full reindex to PostgreSQL
bun run index

# Restart server
bun start
```

### Check Server Status

```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/slack-sync
curl http://localhost:3000/stats
```

### Test Search Types

```bash
# Keyword search
curl "http://localhost:3000/search?q=meeting&limit=5"

# Semantic search
curl "http://localhost:3000/semantic?q=project%20planning&limit=5"

# Hybrid search
curl "http://localhost:3000/hybrid?q=documentation&limit=5"
```

## File Exclusions

The indexer skips these paths:
- `00_Index/` - The search database itself
- `node_modules/` - Dependencies
- `Backup/` - Backup directories
- `tools/` - Tool directories at root

## Performance

- **Keyword search**: ~50-200ms
- **Semantic search**: ~8-10s (embedding generation)
- **Hybrid search**: ~1-2s
- **Index rebuild**: ~5-10min for 180K files
- **File watcher debounce**: 500ms

## Embedding Server

The embedding server runs llama-server on port 8081 with Qwen3-Embedding-8B model:
- **Model**: Qwen3-Embedding-8B-Q8_0.gguf
- **Dimensions**: 4096
- **Location**: `/Users/ronaldeddings/.lmstudio/models/Qwen/Qwen3-Embedding-8B-GGUF/`

## Troubleshooting

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Port 8081 in use (embedding server)
```bash
lsof -ti:8081 | xargs kill -9
```

### PostgreSQL connection issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL (macOS)
brew services start postgresql
```

### Embedding server not responding
```bash
# Check embedding server status
curl http://localhost:8081/health

# Restart via unified start
pkill -f llama-server
bun start
```

### Search returns no results
1. Check if documents table has data: `bun cli.ts -s`
2. Check PostgreSQL connection: `curl http://localhost:3000/health`
3. Rebuild index if needed: `bun run index`

## Related Documentation

- `docs/README.md` - User documentation
- `docs/API.md` - API reference
- `docs/CLI.md` - CLI guide
- `docs/CONFIG.md` - Configuration and setup
- `docs/plans/6-postgresql-consolidation.md` - PostgreSQL migration plan
