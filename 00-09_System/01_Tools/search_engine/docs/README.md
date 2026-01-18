# VRAM Search System

A high-performance full-text search engine for the VRAM (Video RAM) local data asset system. Built with Bun and SQLite FTS5 for sub-100ms search across 180,000+ files.

## Overview

VRAM Search provides instant full-text search across all text-based files in your VRAM data store, including:
- Markdown documents (`.md`)
- Plain text files (`.txt`)
- JSON data files (`.json`)

### Key Features

- **Fast Search**: ~25ms average query time using SQLite FTS5
- **Multiple Interfaces**: Web UI, CLI, API, and Raycast integration
- **Area Filtering**: Search within Work, Finance, Personal, Archive, or System areas
- **Real-time Indexing**: File watcher automatically updates the index
- **Johnny.Decimal Integration**: Respects the folder organization structure

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VRAM Search System                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────┐    │
│  │   CLI   │   │  Web UI │   │ Raycast │   │   API    │    │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬─────┘    │
│       │             │             │              │          │
│       └─────────────┴──────┬──────┴──────────────┘          │
│                            │                                 │
│                     ┌──────▼──────┐                         │
│                     │   Server    │ ← Port 3000             │
│                     │  (Bun.serve)│                         │
│                     └──────┬──────┘                         │
│                            │                                 │
│                     ┌──────▼──────┐                         │
│                     │   SQLite    │                         │
│                     │    FTS5     │ ← search.db             │
│                     └──────┬──────┘                         │
│                            │                                 │
│  ┌─────────┐        ┌──────▼──────┐                         │
│  │ Watcher │───────▶│   Indexer   │                         │
│  └─────────┘        └─────────────┘                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

| Component | File | Purpose |
|-----------|------|---------|
| Indexer | `indexer.ts` | Scans VRAM and populates the FTS5 database |
| Server | `server.ts` | HTTP API server with Web UI |
| CLI | `cli.ts` | Command-line search interface |
| Watcher | `watcher.ts` | Real-time file change detection |
| Raycast | `vram-search.sh` | Raycast script command |

## Quick Start

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Start the server (includes Web UI)
bun server.ts

# In another terminal, start the file watcher
bun watcher.ts
```

Then open http://localhost:3000/ in your browser.

## Index Statistics

- **Total Files**: 181,399
- **Total Size**: 4,087 MB
- **Areas**: Work (177,167), System (4,190), Personal (42)
- **File Types**: JSON (98,146), Markdown (80,641), Text (2,612)

## Directory Structure

```
/Volumes/VRAM/
├── 00-09_System/
│   ├── 00_Index/
│   │   └── search.db          # SQLite FTS5 database
│   └── 01_Tools/
│       └── search_engine/     # This project
│           ├── indexer.ts
│           ├── server.ts
│           ├── cli.ts
│           ├── watcher.ts
│           ├── index.html
│           ├── vram-search.sh
│           └── docs/
├── 10-19_Work/
├── 20-29_Finance/
├── 30-39_Personal/
└── 40-49_Archive/
```

## Requirements

- [Bun](https://bun.sh) v1.0+
- macOS (for launchd auto-start)
- VRAM volume mounted at `/Volumes/VRAM`

## Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Search latency | <100ms | ~25ms |
| Index size | - | 181,399 files |
| Database size | - | ~500MB |
| Watcher CPU | Low | <1% idle |

## See Also

- [API Reference](./API.md) - REST API documentation
- [CLI Guide](./CLI.md) - Command-line usage
- [Configuration](./CONFIG.md) - Setup and configuration options
