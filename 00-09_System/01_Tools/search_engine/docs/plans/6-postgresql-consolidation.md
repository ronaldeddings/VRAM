# PostgreSQL Consolidation - Unified Database Architecture

Consolidate SQLite FTS5 and PostgreSQL pgvector into a single PostgreSQL database for better multi-agent concurrency.

---

## Background

The search engine currently uses two databases:
1. **SQLite** (`search.db`) - FTS5 keyword search, file metadata
2. **PostgreSQL** - pgvector embeddings, semantic search

This dual-database architecture creates issues for multi-agent workflows:
- SQLite allows only ONE writer at a time
- Concurrent AI agents cause "database is locked" errors
- Two databases = two connections, two schemas, duplicated metadata

---

## Philosophy

**Why Consolidate to PostgreSQL?**

| Aspect | SQLite | PostgreSQL |
|--------|--------|------------|
| Concurrent readers | ✅ Unlimited | ✅ Unlimited |
| Concurrent writers | ❌ ONE only | ✅ Multiple (MVCC) |
| Full-text search | ✅ FTS5 (excellent) | ✅ tsvector (good) |
| Vector search | ⚠️ sqlite-vec (limited) | ✅ pgvector (mature) |
| Multi-agent safe | ❌ No | ✅ Yes |

**Trade-offs:**
- PostgreSQL FTS is slightly more verbose than FTS5
- Requires keeping PostgreSQL server running
- Migration effort required

**Benefits:**
- Single database, single connection
- True concurrent writes for AI agents
- Unified schema, no data duplication
- Better monitoring and tooling

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│                      (server.ts)                             │
│                                                              │
│   /search      ──────►  SQLite FTS5 (bun:sqlite)            │
│   /semantic    ──────►  PostgreSQL pgvector                 │
│   /hybrid      ──────►  Both (merged in hybrid-search.ts)   │
└─────────────────────────────────────────────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐
│  SQLite (search.db) │    │     PostgreSQL      │
│                     │    │  (vram_embeddings)  │
│  • files table      │    │                     │
│  • files_fts (FTS5) │    │  • chunks           │
│  • 181K records     │    │  • email_chunks     │
│                     │    │  • slack_chunks     │
│  Writer: ONE only   │    │  • 178K embeddings  │
└─────────────────────┘    └─────────────────────┘
```

**Problems:**
1. Multi-agent writes to SQLite cause blocking
2. File metadata duplicated (SQLite has full content, PostgreSQL has chunks)
3. Two connections to manage
4. Hybrid search requires coordinating two databases

---

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│                      (server.ts)                             │
│                                                              │
│   /search      ──────►  PostgreSQL FTS (tsvector)           │
│   /semantic    ──────►  PostgreSQL pgvector                 │
│   /hybrid      ──────►  Single PostgreSQL query             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │       PostgreSQL        │
              │    (vram_embeddings)    │
              │                         │
              │  • documents (NEW)      │  ◄─ File metadata + FTS
              │  • chunks               │  ◄─ Vector embeddings
              │  • email_chunks         │
              │  • slack_chunks         │
              │                         │
              │  Writers: UNLIMITED     │
              │  (MVCC concurrency)     │
              └─────────────────────────┘
```

**Benefits:**
1. Multi-agent concurrent writes
2. Single source of truth for all data
3. Hybrid search in single query (FTS + vector in one SQL statement)
4. Simplified architecture

---

## Database Schema

### New `documents` Table

```sql
-- Main documents table (replaces SQLite files table)
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

    -- Full-text search vector (auto-generated)
    search_vector TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(filename, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'B')
    ) STORED
);

-- GIN index for fast FTS
CREATE INDEX idx_documents_search ON documents USING GIN (search_vector);

-- B-tree indexes for filtering
CREATE INDEX idx_documents_area ON documents (area);
CREATE INDEX idx_documents_path ON documents (path);
CREATE INDEX idx_documents_modified ON documents (modified_at DESC);
```

### Updated `chunks` Table

```sql
-- Add reference to documents table
ALTER TABLE chunks ADD COLUMN document_id INTEGER REFERENCES documents(id);
CREATE INDEX idx_chunks_document ON chunks (document_id);
```

---

## Implementation Phases

### Phase 1: Create PostgreSQL FTS Schema

1. Create `documents` table with tsvector column
2. Create GIN index for FTS
3. Create supporting indexes
4. Test FTS queries manually

**Files to create:**
- `migrations/001-documents-table.sql`

### Phase 2: Create PostgreSQL FTS Client

1. Create `pg-fts.ts` module with FTS search functions
2. Mirror the interface of current SQLite FTS functions
3. Support highlighting with `ts_headline()`
4. Support ranking with `ts_rank()`

**Files to create:**
- `pg-fts.ts`

### Phase 3: Migrate Data from SQLite to PostgreSQL

1. Create migration script that reads from SQLite and writes to PostgreSQL
2. Migrate all 181K files with metadata and content
3. Verify row counts match
4. Create document_id links in chunks table

**Files to create:**
- `migrate-to-postgres.ts`

### Phase 4: Update Indexer for PostgreSQL

1. Modify `indexer.ts` to write to PostgreSQL instead of SQLite
2. Update to use upsert (INSERT ... ON CONFLICT)
3. Maintain backward compatibility during transition

**Files to modify:**
- `indexer.ts`

### Phase 5: Update Hybrid Search

1. Modify `hybrid-search.ts` to use PostgreSQL FTS
2. Create unified hybrid query combining FTS + vector in single SQL
3. Remove SQLite dependency from hybrid search

**Files to modify:**
- `hybrid-search.ts`

### Phase 6: Update Server and API

1. Update `server.ts` to use PostgreSQL FTS
2. Ensure all endpoints work with new backend
3. Update stats endpoint

**Files to modify:**
- `server.ts`

### Phase 7: Update Watcher for PostgreSQL

1. Modify `watcher.ts` to write to PostgreSQL
2. Handle file changes with PostgreSQL upserts

**Files to modify:**
- `watcher.ts`

### Phase 8: Update CLI

1. Modify `cli.ts` to query PostgreSQL
2. Remove bun:sqlite dependency

**Files to modify:**
- `cli.ts`

### Phase 9: Cleanup

1. Remove SQLite-specific code
2. Remove `bun:sqlite` imports
3. Update documentation
4. Archive SQLite database

**Files to remove/update:**
- Remove SQLite references from all files
- Update `CLAUDE.md`
- Update `docs/API.md`

---

## PostgreSQL FTS Quick Reference

### Basic Search

```sql
-- Simple search
SELECT * FROM documents
WHERE search_vector @@ to_tsquery('english', 'meeting & notes');

-- With ranking
SELECT *, ts_rank(search_vector, query) AS rank
FROM documents, to_tsquery('english', 'meeting & notes') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

### Highlighted Snippets

```sql
SELECT
    path,
    ts_headline('english', content, query,
        'StartSel=→, StopSel=←, MaxWords=50, MinWords=20'
    ) AS snippet
FROM documents, to_tsquery('english', 'meeting') query
WHERE search_vector @@ query;
```

### Hybrid Query (FTS + Vector in one query)

```sql
-- Combined keyword + semantic search with RRF fusion
WITH fts_results AS (
    SELECT id, path, ts_rank(search_vector, to_tsquery($1)) as fts_score
    FROM documents
    WHERE search_vector @@ to_tsquery($1)
    ORDER BY fts_score DESC
    LIMIT 50
),
vector_results AS (
    SELECT document_id, 1 - (embedding <=> $2::vector) as semantic_score
    FROM chunks
    WHERE document_id IS NOT NULL
    ORDER BY embedding <=> $2::vector
    LIMIT 50
),
combined AS (
    SELECT
        COALESCE(f.id, v.document_id) as id,
        COALESCE(f.fts_score, 0) as fts_score,
        COALESCE(v.semantic_score, 0) as semantic_score,
        -- RRF fusion: 1/(k + rank)
        COALESCE(1.0 / (60 + ROW_NUMBER() OVER (ORDER BY f.fts_score DESC NULLS LAST)), 0) +
        COALESCE(1.0 / (60 + ROW_NUMBER() OVER (ORDER BY v.semantic_score DESC NULLS LAST)), 0) as rrf_score
    FROM fts_results f
    FULL OUTER JOIN vector_results v ON f.id = v.document_id
)
SELECT d.*, c.rrf_score, c.fts_score, c.semantic_score
FROM combined c
JOIN documents d ON d.id = c.id
ORDER BY c.rrf_score DESC
LIMIT 20;
```

---

## Migration Script Overview

```typescript
// migrate-to-postgres.ts
import { Database } from "bun:sqlite";
import { SQL } from "bun";

const sqlite = new Database("/Volumes/VRAM/00-09_System/00_Index/search.db");
const postgres = new SQL("postgres://...");

// Batch migrate documents
const BATCH_SIZE = 1000;
let offset = 0;

while (true) {
    const rows = sqlite.query(`
        SELECT path, filename, extension, content, file_size,
               modified_at, indexed_at, area, category
        FROM files
        LIMIT ${BATCH_SIZE} OFFSET ${offset}
    `).all();

    if (rows.length === 0) break;

    // Insert batch into PostgreSQL
    await postgres`
        INSERT INTO documents ${postgres(rows)}
        ON CONFLICT (path) DO UPDATE SET
            content = EXCLUDED.content,
            file_size = EXCLUDED.file_size,
            modified_at = EXCLUDED.modified_at,
            indexed_at = NOW()
    `;

    offset += BATCH_SIZE;
    console.log(`Migrated ${offset} documents...`);
}
```

---

## Performance Considerations

### FTS Performance: SQLite vs PostgreSQL

| Operation | SQLite FTS5 | PostgreSQL tsvector |
|-----------|-------------|---------------------|
| Simple search | ~20ms | ~30ms |
| Phrase search | ~25ms | ~35ms |
| Prefix search | ~15ms | ~40ms |
| Highlighting | Native | ts_headline() |
| Index size | Smaller | Larger |

PostgreSQL FTS is slightly slower but difference is negligible for your dataset size.

### Concurrency Performance

| Scenario | SQLite | PostgreSQL |
|----------|--------|------------|
| 1 writer | ✅ Fast | ✅ Fast |
| 5 concurrent writers | ❌ Queued/blocked | ✅ Parallel |
| 10 concurrent writers | ❌ Timeouts likely | ✅ Parallel |

---

## Rollback Plan

If issues arise, rollback is straightforward:
1. SQLite database remains untouched during migration
2. Simply revert code changes to use SQLite
3. No data loss possible

---

## Checklist

- [x] Create documents table schema in PostgreSQL
- [x] Create pg-fts.ts client module
- [x] Create and run migration script
- [x] Update indexer.ts for PostgreSQL
- [x] Update hybrid-search.ts for PostgreSQL FTS
- [x] Update server.ts endpoints
- [x] Update watcher.ts
- [x] Update cli.ts
- [x] Test all search types (keyword, semantic, hybrid)
- [x] Test multi-agent concurrent writes
- [x] Update documentation
- [x] Remove SQLite dependencies
- [x] Archive SQLite database (kept in place for rollback, 12GB)

---

## Files Summary

### New Files
| File | Purpose |
|------|---------|
| `migrations/001-documents-table.sql` | PostgreSQL schema |
| `pg-fts.ts` | PostgreSQL FTS client |
| `migrate-to-postgres.ts` | Data migration script |

### Modified Files
| File | Changes |
|------|---------|
| `indexer.ts` | PostgreSQL instead of SQLite |
| `hybrid-search.ts` | Remove SQLite, use PostgreSQL FTS |
| `server.ts` | Update to use pg-fts |
| `watcher.ts` | PostgreSQL writes |
| `cli.ts` | PostgreSQL queries |
| `CLAUDE.md` | Updated architecture docs |

### Removed Dependencies
- `bun:sqlite` (from hybrid-search, indexer, watcher, cli)
- SQLite database file (archived, not deleted)

---

*Created: 2026-01-18*
