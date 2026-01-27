# Plan 10: Speaker Embeddings in pgvector

**Status:** DRAFT
**Created:** 2026-01-27
**Author:** PAI

## Overview

Integrate speaker voice embeddings from the transcription-app into the existing PostgreSQL + pgvector database (`vram_embeddings`). This enables:

1. **Centralized storage** - All embeddings (documents, emails, Slack, speakers) in one database
2. **Fast similarity search** - HNSW index for sub-second speaker identification
3. **Multi-agent safe** - PostgreSQL MVCC enables concurrent writes
4. **Eliminates JSON cache** - No more base64-encoded JSON files

## Current State

### Transcription App (`/Volumes/VRAM/00-09_System/01_Tools/transcription-app`)

- **Embedding Model:** 3D-Speaker eres2net via sherpa-onnx-node
- **Embedding Dimension:** 512 (Float32Array)
- **Storage:** JSON file with base64-encoded embeddings (`embeddings_cache.json`)
- **Speakers:** 359 registered speakers
- **Cache Format:**
  ```json
  {
    "version": 1,
    "embedding_dim": 512,
    "threshold": 0.55,
    "speakers": {
      "Speaker Name": {
        "name": "Speaker Name",
        "embeddings": [
          {
            "data": "base64-encoded-float32array",
            "samplePath": "/path/to/sample.wav"
          }
        ]
      }
    }
  }
  ```

### Search Engine (`/Volumes/VRAM/00-09_System/01_Tools/search_engine`)

- **Database:** PostgreSQL `vram_embeddings` at `localhost:5432`
- **Extension:** pgvector for vector similarity search
- **Existing Tables:** documents, chunks (4096-dim), email_chunks, slack_chunks
- **Client:** Bun.SQL native PostgreSQL driver

## Schema Design

### Tables

```sql
-- Speaker embeddings table
-- Stores individual voice sample embeddings
CREATE TABLE speaker_embeddings (
  id SERIAL PRIMARY KEY,
  speaker_name TEXT NOT NULL,
  sample_path TEXT NOT NULL,
  embedding vector(512) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(speaker_name, sample_path)
);

-- Speaker metadata table (optional, for fast lookups)
CREATE TABLE speakers (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  embedding_count INTEGER DEFAULT 0,
  threshold FLOAT DEFAULT 0.55,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- HNSW index for fast cosine similarity search
-- m=16: connections per layer (good for 512-dim vectors)
-- ef_construction=64: build-time accuracy vs speed tradeoff
CREATE INDEX idx_speaker_embeddings_hnsw
ON speaker_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Index for speaker name lookups
CREATE INDEX idx_speaker_embeddings_name ON speaker_embeddings(speaker_name);

-- Index for speakers table
CREATE INDEX idx_speakers_name ON speakers(name);
```

### Stored Functions

```sql
-- Find similar speakers by embedding
CREATE OR REPLACE FUNCTION find_similar_speakers(
  query_embedding vector(512),
  similarity_threshold FLOAT DEFAULT 0.55,
  max_results INTEGER DEFAULT 5
)
RETURNS TABLE(
  speaker_name TEXT,
  similarity FLOAT,
  sample_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.speaker_name,
    1 - (se.embedding <=> query_embedding) as similarity,
    COUNT(*) OVER (PARTITION BY se.speaker_name) as sample_count
  FROM speaker_embeddings se
  WHERE 1 - (se.embedding <=> query_embedding) >= similarity_threshold
  ORDER BY se.embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Add or update speaker embedding
CREATE OR REPLACE FUNCTION add_speaker_embedding(
  p_speaker_name TEXT,
  p_sample_path TEXT,
  p_embedding vector(512)
)
RETURNS INTEGER AS $$
DECLARE
  new_id INTEGER;
BEGIN
  INSERT INTO speaker_embeddings (speaker_name, sample_path, embedding)
  VALUES (p_speaker_name, p_sample_path, p_embedding)
  ON CONFLICT (speaker_name, sample_path)
  DO UPDATE SET embedding = p_embedding, updated_at = NOW()
  RETURNING id INTO new_id;

  -- Update speaker metadata
  INSERT INTO speakers (name, embedding_count)
  VALUES (p_speaker_name, 1)
  ON CONFLICT (name)
  DO UPDATE SET
    embedding_count = (SELECT COUNT(*) FROM speaker_embeddings WHERE speaker_name = p_speaker_name),
    updated_at = NOW();

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Remove speaker and all embeddings
CREATE OR REPLACE FUNCTION remove_speaker(p_speaker_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM speaker_embeddings WHERE speaker_name = p_speaker_name;
  DELETE FROM speakers WHERE name = p_speaker_name;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Get speaker statistics
CREATE OR REPLACE FUNCTION get_speaker_stats()
RETURNS TABLE(
  total_speakers BIGINT,
  total_embeddings BIGINT,
  avg_embeddings_per_speaker FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT speaker_name)::BIGINT,
    COUNT(*)::BIGINT,
    COUNT(*)::FLOAT / NULLIF(COUNT(DISTINCT speaker_name), 0)
  FROM speaker_embeddings;
END;
$$ LANGUAGE plpgsql;
```

## Migration Plan

### Migration File: `004-speaker-embeddings.sql`

Located at: `/Volumes/VRAM/00-09_System/01_Tools/search_engine/migrations/004-speaker-embeddings.sql`

```sql
-- Migration 004: Speaker Embeddings
-- Adds tables and functions for voice speaker identification using pgvector

-- Ensure pgvector extension exists
CREATE EXTENSION IF NOT EXISTS vector;

-- Create speaker_embeddings table
CREATE TABLE IF NOT EXISTS speaker_embeddings (
  id SERIAL PRIMARY KEY,
  speaker_name TEXT NOT NULL,
  sample_path TEXT NOT NULL,
  embedding vector(512) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(speaker_name, sample_path)
);

-- Create speakers metadata table
CREATE TABLE IF NOT EXISTS speakers (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  embedding_count INTEGER DEFAULT 0,
  threshold FLOAT DEFAULT 0.55,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create HNSW index for similarity search
CREATE INDEX IF NOT EXISTS idx_speaker_embeddings_hnsw
ON speaker_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create supporting indexes
CREATE INDEX IF NOT EXISTS idx_speaker_embeddings_name ON speaker_embeddings(speaker_name);
CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);

-- Create stored functions
-- (include all functions from Schema Design section above)
```

## Integration Plan

### Phase 1: Add PostgreSQL Client to Transcription App

Create `lib/pg-speaker-store.ts`:

```typescript
import { SQL } from "bun";

const db = new SQL({
  url: "postgres://ronaldeddings@localhost:5432/vram_embeddings"
});

export class PgSpeakerStore {
  // Convert Float32Array to pgvector format [x,y,z,...]
  private toVectorString(embedding: Float32Array): string {
    return `[${Array.from(embedding).join(",")}]`;
  }

  // Convert pgvector string to Float32Array
  private fromVectorString(vectorStr: string): Float32Array {
    const values = vectorStr.slice(1, -1).split(",").map(Number);
    return new Float32Array(values);
  }

  async addEmbedding(
    speakerName: string,
    samplePath: string,
    embedding: Float32Array
  ): Promise<number> {
    const result = await db.query`
      SELECT add_speaker_embedding(
        ${speakerName},
        ${samplePath},
        ${this.toVectorString(embedding)}::vector
      ) as id
    `;
    return result[0].id;
  }

  async findSimilar(
    embedding: Float32Array,
    threshold: number = 0.55,
    limit: number = 5
  ): Promise<Array<{speaker_name: string, similarity: number}>> {
    return await db.query`
      SELECT * FROM find_similar_speakers(
        ${this.toVectorString(embedding)}::vector,
        ${threshold},
        ${limit}
      )
    `;
  }

  async getAllSpeakers(): Promise<string[]> {
    const result = await db.query`
      SELECT DISTINCT speaker_name FROM speaker_embeddings ORDER BY speaker_name
    `;
    return result.map(r => r.speaker_name);
  }

  async getSpeakerEmbeddings(speakerName: string): Promise<Float32Array[]> {
    const result = await db.query`
      SELECT embedding::text FROM speaker_embeddings WHERE speaker_name = ${speakerName}
    `;
    return result.map(r => this.fromVectorString(r.embedding));
  }

  async removeSpeaker(speakerName: string): Promise<boolean> {
    const result = await db.query`SELECT remove_speaker(${speakerName}) as success`;
    return result[0].success;
  }

  async getStats(): Promise<{total_speakers: number, total_embeddings: number}> {
    const result = await db.query`SELECT * FROM get_speaker_stats()`;
    return result[0];
  }
}
```

### Phase 2: Modify SpeakerRegistry to Use PostgreSQL

Update `lib/speaker-registry.ts`:

1. Add `PgSpeakerStore` as optional backend
2. Create `loadFromPostgres()` method
3. Create `saveToPostgres()` method
4. Add migration script to move JSON cache to PostgreSQL

### Phase 3: Migration Script

Create `scripts/migrate-speakers-to-postgres.ts`:

```typescript
import { PgSpeakerStore } from "../lib/pg-speaker-store";
import { readFileSync } from "fs";

const CACHE_PATH = "./data/speaker_registry/embeddings_cache.json";

async function migrate() {
  const store = new PgSpeakerStore();
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));

  console.log(`Migrating ${Object.keys(cache.speakers).length} speakers...`);

  for (const [name, speaker] of Object.entries(cache.speakers)) {
    for (const emb of speaker.embeddings) {
      const embedding = deserializeEmbedding(emb.data);
      await store.addEmbedding(name, emb.samplePath, embedding);
    }
    console.log(`  Migrated: ${name}`);
  }

  const stats = await store.getStats();
  console.log(`Done! ${stats.total_speakers} speakers, ${stats.total_embeddings} embeddings`);
}

function deserializeEmbedding(base64: string): Float32Array {
  const buffer = Buffer.from(base64, "base64");
  return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.length / 4);
}

migrate();
```

## Testing Plan

### Unit Tests

1. **Vector conversion tests**
   - Float32Array → pgvector string → Float32Array roundtrip
   - Verify 512 dimensions preserved

2. **CRUD tests**
   - Add speaker embedding
   - Get speaker embeddings
   - Remove speaker
   - Update existing embedding

3. **Similarity search tests**
   - Find exact match (same embedding)
   - Find similar speakers above threshold
   - Verify threshold filtering works

### Integration Tests

1. **Migration test**
   - Migrate JSON cache to PostgreSQL
   - Verify all speakers and embeddings transferred
   - Compare similarity search results

2. **Performance test**
   - Compare JSON cache load time vs PostgreSQL load time
   - Measure similarity search latency
   - Test concurrent writes from multiple processes

### Acceptance Criteria

- [ ] All 359 speakers migrated successfully
- [ ] Speaker identification produces same results as JSON backend
- [ ] Cold start time < 1 second (current: 0.01s from JSON cache)
- [ ] Similarity search < 100ms for single query
- [ ] No data loss during migration

## Rollback Plan

1. Keep JSON cache as backup (`embeddings_cache.json.backup`)
2. Add feature flag to switch between backends
3. `USE_POSTGRES_SPEAKERS=false` falls back to JSON cache

## Performance Considerations

### HNSW Index Tuning

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| m | 16 | Good balance for 512-dim vectors |
| ef_construction | 64 | Higher = more accurate index, slower build |
| ef_search | 40 | Runtime parameter, can tune per query |

### Expected Performance

| Operation | JSON Cache | PostgreSQL + HNSW |
|-----------|------------|-------------------|
| Cold start | 0.01s | ~0.5s (connect + warm cache) |
| Add speaker | ~50ms | ~5ms |
| Find similar | N/A (uses sherpa-onnx) | ~10ms |
| List all | ~1ms | ~5ms |

## Future Enhancements

1. **Cross-source speaker linking** - Link speakers to transcripts, meeting records
2. **Speaker analytics** - Track speaker activity over time
3. **Bulk operations** - Batch insert for faster initial load
4. **Replication** - Sync with cloud PostgreSQL for backup

## Files to Create/Modify

### New Files
- `/search_engine/migrations/004-speaker-embeddings.sql`
- `/transcription-app/lib/pg-speaker-store.ts`
- `/transcription-app/scripts/migrate-speakers-to-postgres.ts`

### Modified Files
- `/transcription-app/lib/speaker-registry.ts` - Add PostgreSQL backend
- `/transcription-app/lib/config.ts` - Add PostgreSQL config options
- `/transcription-app/package.json` - Verify bun:sql dependency

## Estimated Effort

| Task | Effort |
|------|--------|
| Migration file | 30 min |
| pg-speaker-store.ts | 1 hour |
| Modify speaker-registry.ts | 2 hours |
| Migration script | 30 min |
| Testing | 2 hours |
| **Total** | ~6 hours |
