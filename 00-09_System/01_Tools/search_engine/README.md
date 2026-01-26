# VRAM Search Engine

Full-text and semantic search engine for the VRAM personal data asset management system. Built with Bun runtime and PostgreSQL (tsvector FTS + pgvector embeddings).

## Features

- **Hybrid Search**: Combines keyword (PostgreSQL FTS) and semantic (pgvector) search
- **Multi-Source**: Files, emails, transcripts, and Slack messages
- **Real-Time**: File watcher for automatic index updates
- **Web UI**: Browser-based search interface at `localhost:3000`
- **CLI**: Command-line search with filters
- **Automated Sync**: Daily Slack backup with launchd

## Quick Start

```bash
# Install dependencies
bun install

# Start server (embedding + API)
bun start

# Search from CLI
bun cli.ts "meeting notes"

# Full reindex
bun run index
```

## Architecture

```
PostgreSQL (vram_embeddings)
├── documents      ← File metadata + FTS tsvector
├── chunks         ← File embeddings (4096-dim)
├── email_chunks   ← Email embeddings
└── slack_chunks   ← Slack message embeddings

Embedding Server (port 8081)
└── Qwen3-Embedding-8B via llama-server

API Server (port 3000)
├── /search        ← Keyword search
├── /semantic      ← Semantic search
├── /hybrid        ← Combined search (RRF)
├── /search/slack  ← Slack-specific search
└── /health/*      ← Health checks
```

## Search Types

| Endpoint | Method | Speed | Use Case |
|----------|--------|-------|----------|
| `/search` | Keyword (FTS) | ~50ms | Exact terms, names |
| `/semantic` | Vector similarity | ~2s | Concepts, meaning |
| `/hybrid` | RRF fusion | ~1s | Best of both |

## Slack Sync

Automated daily backup of Slack messages with search indexing:

```bash
# Manual sync
bun scripts/slack-sync.ts

# Check sync status
curl http://localhost:3000/health/slack-sync
```

**Pipeline**: slackdump → JSON → Markdown → PostgreSQL

See [Slack Sync Documentation](docs/SLACK.md) for details.

## Scripts

| Script | Purpose |
|--------|---------|
| `start.ts` | Unified server startup |
| `server.ts` | REST API server |
| `indexer.ts` | Full filesystem reindex |
| `watcher.ts` | Real-time file monitoring |
| `cli.ts` | Command-line interface |
| `scripts/slack-sync.ts` | Master Slack sync orchestrator |

## Documentation

- [API Reference](docs/API.md) - REST endpoints
- [CLI Guide](docs/CLI.md) - Command-line usage
- [Configuration](docs/CONFIG.md) - Setup options
- [Slack Sync](docs/SLACK.md) - Slack backup system

## Requirements

- [Bun](https://bun.sh) v1.0+
- PostgreSQL 15+ with pgvector extension
- macOS (for launchd automation)
- VRAM volume at `/Volumes/VRAM`
