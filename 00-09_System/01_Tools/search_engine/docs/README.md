# VRAM Search System

A high-performance search engine for the VRAM personal data asset management system. Built with Bun runtime and PostgreSQL for hybrid keyword + semantic search across 180,000+ files.

## Overview

VRAM Search provides instant full-text and semantic search across:
- **Files**: Markdown (`.md`), text (`.txt`), JSON (`.json`)
- **Emails**: Indexed email content with metadata
- **Transcripts**: Meeting transcriptions
- **Slack**: Message history with incremental sync

### Key Features

- **Hybrid Search**: PostgreSQL tsvector FTS + pgvector semantic search
- **Multiple Interfaces**: Web UI, CLI, REST API
- **Area Filtering**: Search within Johnny.Decimal areas
- **Real-time Indexing**: File watcher for automatic updates
- **Automated Slack Sync**: Daily backup via launchd

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      VRAM Search System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────┐        │
│  │   CLI   │   │  Web UI │   │ Raycast │   │   API    │        │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬─────┘        │
│       │             │             │              │              │
│       └─────────────┴──────┬──────┴──────────────┘              │
│                            │                                     │
│                     ┌──────▼──────┐                             │
│                     │   Server    │ ← Port 3000                 │
│                     │  (Bun.serve)│                             │
│                     └──────┬──────┘                             │
│                            │                                     │
│  ┌─────────────────────────┼─────────────────────────┐          │
│  │              PostgreSQL (vram_embeddings)          │          │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────────┐   │          │
│  │  │ documents │ │  chunks   │ │ slack_chunks  │   │          │
│  │  │ (FTS)     │ │ (vectors) │ │ (vectors)     │   │          │
│  │  └───────────┘ └───────────┘ └───────────────┘   │          │
│  └───────────────────────────────────────────────────┘          │
│                            │                                     │
│  ┌─────────┐  ┌────────────┴────────────┐  ┌──────────────┐    │
│  │ Watcher │──│      Embedding Server   │──│  Slack Sync  │    │
│  └─────────┘  │   (Qwen3-Embedding-8B)  │  │  (launchd)   │    │
│               │       Port 8081          │  └──────────────┘    │
│               └─────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## Components

| Component | File | Purpose |
|-----------|------|---------|
| Server | `server.ts` | HTTP API with Web UI |
| Start | `start.ts` | Unified startup (embedding + API) |
| Indexer | `indexer.ts` | Full filesystem reindex |
| CLI | `cli.ts` | Command-line search |
| Watcher | `watcher.ts` | Real-time file monitoring |
| Slack Sync | `scripts/slack-sync.ts` | Automated Slack backup |

## Quick Start

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Start the unified server (embedding + API)
bun start

# Or start just the API server
bun run serve
```

Open http://localhost:3000/ in your browser.

## Search Types

| Type | Endpoint | Speed | Best For |
|------|----------|-------|----------|
| Keyword | `/search` | ~50ms | Exact terms, names, filenames |
| Semantic | `/semantic` | ~2s | Concepts, similar meaning |
| Hybrid | `/hybrid` | ~1s | General search (recommended) |

## Index Statistics

- **Total Files**: ~188,000
- **Total Size**: ~4 GB
- **Embeddings**: ~345,000 (files, emails, slack)
- **Areas**: Work, Finance, Personal, Archive, System

## Directory Structure

```
/Volumes/VRAM/
├── 00-09_System/
│   └── 01_Tools/
│       └── search_engine/     # This project
│           ├── start.ts       # Unified startup
│           ├── server.ts      # API server
│           ├── indexer.ts     # Reindexer
│           ├── cli.ts         # CLI tool
│           ├── watcher.ts     # File watcher
│           ├── scripts/       # Automation scripts
│           │   └── slack-sync.ts
│           └── docs/          # Documentation
├── 10-19_Work/
│   └── 14_Communications/
│       └── 14.02_slack/       # Slack data
│           ├── json/          # Raw JSON exports
│           └── markdown/      # Converted markdown
├── 20-29_Finance/
├── 30-39_Personal/
└── 90-99_Archive/
```

## Requirements

- [Bun](https://bun.sh) v1.0+
- PostgreSQL 15+ with pgvector extension
- macOS (for launchd automation)
- VRAM volume mounted at `/Volumes/VRAM`

## Performance

| Metric | Value |
|--------|-------|
| Keyword search | ~50ms |
| Semantic search | ~2s |
| Hybrid search | ~1s |
| Full reindex | ~10min |

## See Also

- [API Reference](./API.md) - REST API documentation
- [CLI Guide](./CLI.md) - Command-line usage
- [Configuration](./CONFIG.md) - Setup and configuration
- [Slack Sync](./SLACK.md) - Slack backup automation
