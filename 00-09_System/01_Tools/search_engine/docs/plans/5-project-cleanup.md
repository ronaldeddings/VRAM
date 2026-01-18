# Project Cleanup - Obsolete File Removal

Remove obsolete files left over from the sqlite-vec to pgvector migration and development iterations.

---

## Background

The search engine has evolved through several iterations:
1. **Initial setup** - FTS5 keyword search
2. **Semantic embeddings (v1)** - sqlite-vec with llama-embed-client
3. **Semantic embeddings (v2)** - sqlite-vec with qwen3vl-client
4. **pgvector migration** - PostgreSQL with pgvector (current)

This migration left behind obsolete files that are now clutter:
- Old embedding clients and servers
- sqlite-vec related code and extensions
- One-time migration/analysis scripts
- Unused test files

---

## Current Architecture

```
Active Components (KEEP)
────────────────────────
server.ts ─────────────► qwen3vl-client.ts
    │                    pg-client.ts
    │                    hybrid-search.ts
    │
pgvector-indexer.ts ───► qwen3vl-client.ts
    │                    smart-chunker.ts
    │
email-indexer.ts ──────► qwen3vl-client.ts
    │                    email-chunker.ts
    │
slack-indexer.ts ──────► qwen3vl-client.ts
                         slack-chunker.ts

Obsolete Components (REMOVE)
────────────────────────────
embedding-indexer.ts ──► llama-embed-client.ts (OLD)
                         sqlite-vec (OLD)

comfyui-client.ts ─────► llama-server (OLD, misleading name)
llama-embed-server.py ─► OLD Python server
```

---

## Files Analysis

### Core Application (KEEP - 15 files)

| File | Purpose | Dependencies |
|------|---------|--------------|
| `server.ts` | REST API server | qwen3vl-client, pg-client, hybrid-search |
| `index.html` | Web UI | - |
| `cli.ts` | Terminal CLI | bun:sqlite |
| `indexer.ts` | FTS5 indexer | bun:sqlite |
| `watcher.ts` | File change monitor | bun:sqlite |
| `hybrid-search.ts` | Combined FTS + semantic | pg-client, bun:sqlite |
| `pg-client.ts` | PostgreSQL/pgvector client | qwen3vl-client |
| `smart-chunker.ts` | Transcript-aware chunking | - |
| `email-chunker.ts` | Email chunking | - |
| `email-indexer.ts` | Email embedding indexer | qwen3vl-client, email-chunker |
| `slack-chunker.ts` | Slack conversation chunking | - |
| `slack-indexer.ts` | Slack embedding indexer | qwen3vl-client, slack-chunker |
| `pgvector-indexer.ts` | File embedding indexer | qwen3vl-client, smart-chunker |
| `qwen3vl-client.ts` | Qwen3-VL embedding client | - |
| `qwen3vl-embed-server.py` | Python embedding server | llama-cpp-python |

### Configuration (KEEP - 6 files)

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies (needs update) |
| `bun.lock` | Bun lockfile |
| `tsconfig.json` | TypeScript config |
| `.env` | Environment variables |
| `CLAUDE.md` | Claude Code documentation |
| `README.md` | Project README |

### Documentation (KEEP - 5+ files)

| File | Purpose |
|------|---------|
| `docs/README.md` | User documentation |
| `docs/API.md` | API reference |
| `docs/CLI.md` | CLI guide |
| `docs/CONFIG.md` | Configuration |
| `docs/plans/*.md` | Implementation plans |

### Shell Scripts (KEEP - 3 files)

| File | Purpose |
|------|---------|
| `start-server.sh` | Start API server |
| `start-watcher.sh` | Start file watcher |
| `vram-search.sh` | Quick search script |

---

## Files to Remove

### Obsolete Embedding Code (6 files)

| File | Reason | Size |
|------|--------|------|
| `embedding-indexer.ts` | Replaced by `pgvector-indexer.ts` | ~3KB |
| `init-embeddings-db.ts` | sqlite-vec DB init, no longer needed | ~2KB |
| `llama-embed-client.ts` | Replaced by `qwen3vl-client.ts` | ~3KB |
| `llama-embed-server.py` | Replaced by `qwen3vl-embed-server.py` | ~2KB |
| `comfyui-client.ts` | Misleading name, old llama client | ~3KB |
| `extensions/vec0.dylib` | sqlite-vec extension, no longer needed | 162KB |

### Test/Development Scripts (8 files)

| File | Reason |
|------|--------|
| `test-comfyui-client.ts` | Tests obsolete comfyui-client |
| `test-embed-quality.ts` | Analyzes old sqlite-vec embeddings |
| `test-llama-embed.ts` | Tests obsolete llama-embed-client |
| `test-llama-parallel.ts` | Tests obsolete llama-embed-client |
| `test-lmstudio.ts` | Tests LMStudio (not used) |
| `test-sqlite-vec.ts` | Tests obsolete sqlite-vec |
| `test-pg-connection.ts` | One-time test, keep if useful for debugging |
| `test-qwen3vl-parallel.ts` | Keep for debugging qwen3vl-client |

### One-time Scripts (5 files)

| File | Reason |
|------|--------|
| `analyze-embeddings.ts` | One-time analysis of old embeddings |
| `clear-stale-embeddings.ts` | One-time cleanup of old embeddings |
| `investigate-duplicates.ts` | One-time analysis script |
| `rename-txt-to-md.ts` | One-time migration script |
| `index-single-file.ts` | Uses obsolete llama-embed-client |

### Unused Files (2 files + 1 directory)

| File | Reason |
|------|--------|
| `index.ts` | Placeholder "Hello via Bun!" |
| `workflows/embedding-api.json` | ComfyUI workflow, not used |
| `workflows/` | Empty after removing JSON |

---

## Implementation

### Phase 1: Backup Current State

```bash
# Create backup of all files before deletion
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine
mkdir -p /tmp/search-engine-backup
cp -r . /tmp/search-engine-backup/
```

### Phase 2: Remove Obsolete Embedding Code

```bash
# Remove old embedding infrastructure
rm embedding-indexer.ts
rm init-embeddings-db.ts
rm llama-embed-client.ts
rm llama-embed-server.py
rm comfyui-client.ts
rm -rf extensions/
```

### Phase 3: Remove Test Scripts

```bash
# Remove obsolete test files
rm test-comfyui-client.ts
rm test-embed-quality.ts
rm test-llama-embed.ts
rm test-llama-parallel.ts
rm test-lmstudio.ts
rm test-sqlite-vec.ts
```

### Phase 4: Remove One-time Scripts

```bash
# Remove one-time utility scripts
rm analyze-embeddings.ts
rm clear-stale-embeddings.ts
rm investigate-duplicates.ts
rm rename-txt-to-md.ts
rm index-single-file.ts
```

### Phase 5: Remove Unused Files

```bash
# Remove placeholder and unused files
rm index.ts
rm -rf workflows/
```

### Phase 6: Update package.json

Remove `sqlite-vec` dependency and update scripts:

```json
{
  "name": "vram-search",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "index": "bun run indexer.ts",
    "serve": "bun run server.ts",
    "watch": "bun run watcher.ts",
    "search": "bun run cli.ts",
    "embed-files": "bun run pgvector-indexer.ts",
    "embed-emails": "bun run email-indexer.ts",
    "embed-slack": "bun run slack-indexer.ts"
  },
  "devDependencies": {
    "@types/bun": "latest"
  },
  "peerDependencies": {
    "typescript": "^5"
  }
}
```

### Phase 7: Run bun install

```bash
# Remove sqlite-vec from node_modules and update lockfile
bun install
```

### Phase 8: Verification

```bash
# Verify core functionality still works
bun run serve &
sleep 2
curl http://localhost:3000/health
curl "http://localhost:3000/search?q=test&limit=1"
curl "http://localhost:3000/semantic?q=test&limit=1"
curl "http://localhost:3000/hybrid?q=test&limit=1"
pkill -f "bun.*server"

# Verify no broken imports
bun build server.ts --dry-run
bun build pgvector-indexer.ts --dry-run
```

---

## Summary

### Files to Remove (19 files + 1 directory)

**Obsolete Embedding Code (6 files, ~175KB):**
- `embedding-indexer.ts`
- `init-embeddings-db.ts`
- `llama-embed-client.ts`
- `llama-embed-server.py`
- `comfyui-client.ts`
- `extensions/vec0.dylib`

**Test Scripts (6 files):**
- `test-comfyui-client.ts`
- `test-embed-quality.ts`
- `test-llama-embed.ts`
- `test-llama-parallel.ts`
- `test-lmstudio.ts`
- `test-sqlite-vec.ts`

**One-time Scripts (5 files):**
- `analyze-embeddings.ts`
- `clear-stale-embeddings.ts`
- `investigate-duplicates.ts`
- `rename-txt-to-md.ts`
- `index-single-file.ts`

**Unused (2 files + 1 directory):**
- `index.ts`
- `workflows/embedding-api.json`
- `workflows/` (directory)

### Optional Retention

Consider keeping these for debugging:
- `test-pg-connection.ts` - PostgreSQL connection testing
- `test-qwen3vl-parallel.ts` - Embedding performance testing

---

## Post-Cleanup File Structure

```
/Volumes/VRAM/00-09_System/01_Tools/search_engine/
├── package.json            # Updated (sqlite-vec removed)
├── bun.lock                # Updated
├── tsconfig.json
├── .env
├── CLAUDE.md
├── README.md
│
├── # Core Application
├── server.ts               # REST API
├── index.html              # Web UI
├── cli.ts                  # CLI
├── indexer.ts              # FTS5 indexer
├── watcher.ts              # File watcher
├── hybrid-search.ts        # Combined search
├── pg-client.ts            # PostgreSQL client
│
├── # Chunking Modules
├── smart-chunker.ts        # Transcript/document chunking
├── email-chunker.ts        # Email chunking
├── slack-chunker.ts        # Slack chunking
│
├── # Embedding Indexers
├── pgvector-indexer.ts     # File embeddings
├── email-indexer.ts        # Email embeddings
├── slack-indexer.ts        # Slack embeddings
│
├── # Embedding Client
├── qwen3vl-client.ts       # Qwen3-VL client
├── qwen3vl-embed-server.py # Python embedding server
│
├── # Shell Scripts
├── start-server.sh
├── start-watcher.sh
├── vram-search.sh
│
├── # Optional Debug Scripts
├── test-pg-connection.ts   # (optional)
├── test-qwen3vl-parallel.ts # (optional)
│
└── docs/
    ├── README.md
    ├── API.md
    ├── CLI.md
    ├── CONFIG.md
    └── plans/
        ├── 1-initial-setup.md
        ├── 2-markdown-preview.md
        ├── 3-semantic-embeddings.md
        ├── 4-pgvector-migration.md
        └── 5-project-cleanup.md   # This plan
```

---

## Checklist

- [x] Create backup of current state
- [x] Remove obsolete embedding code (6 files)
- [x] Remove test scripts (6 files)
- [x] Remove one-time scripts (5 files)
- [x] Remove unused files (2 files + 1 directory)
- [x] Update package.json (remove sqlite-vec, update scripts)
- [x] Run `bun install`
- [x] Verify server starts and all endpoints work
- [x] Verify no broken imports in core files

---

*Created: 2026-01-17*
