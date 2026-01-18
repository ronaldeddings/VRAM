# PostgreSQL + pgvector Migration

Migrate vector embeddings from sqlite-vec to PostgreSQL with pgvector for improved semantic search with smart transcript-aware chunking.

---

## Data Sources

| Source | Location | Format | Count | Notes |
|--------|----------|--------|-------|-------|
| Files | `/Volumes/VRAM/*` | md, txt | ~83K | Meeting transcripts, docs |
| Emails | `14_Communications/14.01b_emails_json/` | JSON | ~70K+ | 2020-2025, Gmail export |
| Slack | `14_Communications/14.02_slack/json/` | JSON | 423 channels | Messages, DMs, threads |

---

## Philosophy

**Why PostgreSQL + pgvector?**

The current sqlite-vec implementation has limitations:
- ORDER BY bug causes null values in bun:sqlite
- Limited indexing options (brute-force KNN only)
- No support for filtered vector search
- Debugging challenges with binary vector storage

PostgreSQL with pgvector provides:
- **HNSW indexes** for fast approximate nearest neighbor search
- **Filtered vector search** combining metadata and similarity
- **Mature ecosystem** with excellent tooling and monitoring
- **ACID compliance** with proper transaction support
- **Native Bun support** via built-in `Bun.sql` client

**Smart Chunking for Transcripts**

Meeting transcripts have unique challenges:
- Conversations shift topics frequently
- Speaker context is essential for understanding
- Large 8K character chunks lose semantic precision
- Boilerplate openings ("Thank you", timestamps) pollute embeddings

Research-backed approach:
- **400-512 tokens** (~1500-2000 characters) optimal for semantic precision
- **20-50% overlap** preserves context across chunk boundaries
- **Speaker-aware splitting** keeps speaker context intact

**Email Embedding Strategy**

Emails have unique characteristics:
- Subject line is critical for topic identification
- Threading (reply chains) provides conversation context
- From/To metadata enables people-based search
- Attachments signal document type

Approach:
- Combine `subject + body` for embedding
- Preserve sender/recipient metadata for filtering
- Thread-aware chunking for long email chains
- Skip common boilerplate (signatures, disclaimers)

**Slack Embedding Strategy**

Slack conversations differ from emails:
- Real-time, informal communication
- Context spread across multiple messages
- Reactions and threads add meaning
- Channel context (public vs DM) matters

Approach:
- **Time-window chunking**: Group messages within 15-minute windows
- **Thread-aware**: Keep thread replies together
- **Speaker context**: Include username with each message
- **Channel metadata**: Enable channel/DM filtering

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Search Layer                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  Bun.serve() API                     │   │
│   │                                                      │   │
│   │   /search?q=       Full-text search (FTS5)          │   │
│   │   /semantic?q=     Vector search (sqlite-vec)       │   │
│   │   /hybrid?q=       Combined search                   │   │
│   └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│   ┌───────────────────┴───────────────────┐                 │
│   │     bun:sqlite + sqlite-vec            │                 │
│   │                                        │                 │
│   │   search.db        FTS5 index         │                 │
│   │   embeddings.db    Vector storage     │ ← PROBLEMATIC   │
│   └────────────────────────────────────────┘                 │
│                       │                                      │
│   ┌───────────────────┴───────────────────┐                 │
│   │         llama-server (C++)             │                 │
│   │         Qwen3-VL-Embedding-8B           │                 │
│   │         Port 8081                      │                 │
│   └────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘

Issues with Current Setup:
- 65% of embeddings share identical signatures (duplicate content)
- 8000 char chunks too large, lose semantic precision
- No speaker-aware chunking for transcripts
- sqlite-vec ORDER BY bug requires JS workaround
```

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Search Layer                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  Bun.serve() API                     │   │
│   │                                                      │   │
│   │   /search?q=       Full-text search (FTS5)          │   │
│   │   /semantic?q=     Vector search (pgvector)   NEW   │   │
│   │   /hybrid?q=       Combined FTS5 + pgvector   NEW   │   │
│   │   /embed           Generate embedding               │   │
│   └─────────────────────────────────────────────────────┘   │
│              │                           │                   │
│   ┌──────────┴──────────┐   ┌───────────┴───────────┐      │
│   │    bun:sqlite       │   │      Bun.sql          │      │
│   │                     │   │                       │      │
│   │   search.db         │   │   PostgreSQL          │      │
│   │   FTS5 keyword      │   │   + pgvector          │      │
│   │   search            │   │   Vector embeddings   │ NEW  │
│   └─────────────────────┘   └───────────────────────┘      │
│                                         │                   │
│              ┌──────────────────────────┘                   │
│              │                                              │
│   ┌──────────┴──────────────────────────────┐              │
│   │           llama-server (C++)             │              │
│   │                                          │              │
│   │   Qwen3-VL-Embedding-8B model           │              │
│   │   4096-dimensional vectors              │              │
│   │   Port 8081                             │              │
│   └─────────────────────────────────────────┘              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                       Data Layer                             │
│                                                              │
│   SQLite (existing)           PostgreSQL (new)              │
│   ──────────────────          ─────────────────             │
│   /Volumes/VRAM/              localhost:5432                │
│   00_Index/search.db          vram_embeddings DB            │
│                                                              │
│   - files table               - chunks table                │
│   - files_fts (FTS5)          - embeddings (pgvector)       │
│   - 83K+ documents            - HNSW index                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Chunking Strategy

**Research-Based Optimal Sizes**

| Content Type | Chunk Size | Overlap | Rationale |
|-------------|------------|---------|-----------|
| Meeting transcripts | 1500-2000 chars | 400 chars (25%) | Conversational context preservation |
| Markdown documents | 1500-2000 chars | 300 chars (20%) | Standard semantic chunks |
| Short files (<1500) | Full content | N/A | No chunking needed |

**Speaker-Aware Chunking Algorithm**

```typescript
interface TranscriptChunk {
  text: string;
  speakers: string[];      // Speakers in this chunk
  startTime?: string;      // First timestamp
  endTime?: string;        // Last timestamp
  chunkIndex: number;
}

function chunkTranscript(content: string): TranscriptChunk[] {
  const TARGET_SIZE = 1800;     // ~450 tokens
  const MIN_SIZE = 1200;        // Don't create tiny chunks
  const OVERLAP = 400;          // ~100 tokens overlap

  // Parse transcript into speaker turns
  const turns = parseTranscriptTurns(content);

  const chunks: TranscriptChunk[] = [];
  let currentChunk = { text: "", speakers: new Set<string>(), startTime: "" };

  for (const turn of turns) {
    // If adding this turn exceeds target, finalize chunk
    if (currentChunk.text.length + turn.text.length > TARGET_SIZE
        && currentChunk.text.length >= MIN_SIZE) {

      chunks.push(finalizeChunk(currentChunk, chunks.length));

      // Start new chunk with overlap from previous
      currentChunk = createOverlapChunk(currentChunk, OVERLAP);
    }

    // Add turn to current chunk
    currentChunk.text += turn.text + "\n\n";
    currentChunk.speakers.add(turn.speaker);
    if (!currentChunk.startTime) currentChunk.startTime = turn.timestamp;
    currentChunk.endTime = turn.timestamp;
  }

  // Don't forget the last chunk
  if (currentChunk.text.length >= MIN_SIZE) {
    chunks.push(finalizeChunk(currentChunk, chunks.length));
  }

  return chunks;
}

function parseTranscriptTurns(content: string) {
  // Match pattern: [HH:MM] Speaker Name: text
  const turnRegex = /\[(\d{1,2}:\d{2})\]\s*([^:]+):\s*([^\[]+)/g;
  const turns = [];

  let match;
  while ((match = turnRegex.exec(content)) !== null) {
    turns.push({
      timestamp: match[1],
      speaker: match[2].trim(),
      text: `[${match[1]}] ${match[2].trim()}: ${match[3].trim()}`
    });
  }

  return turns;
}
```

**Skip Boilerplate Detection**

```typescript
const SKIP_PATTERNS = [
  /^\[Transcript not available\]$/,
  /^Thank you\.?\s*$/i,
  /^\[Recording started\]/i,
];

function isBoilerplate(text: string): boolean {
  const trimmed = text.trim();
  return SKIP_PATTERNS.some(pattern => pattern.test(trimmed));
}
```

### pgvector Index Selection

**HNSW vs IVFFlat Comparison**

| Feature | HNSW | IVFFlat |
|---------|------|---------|
| Build time | Slower | Faster |
| Query speed | Faster | Slower |
| Memory usage | Higher | Lower |
| Recall accuracy | Higher (99%+) | Good (95%+) |
| No training step | Yes | No (requires data) |
| Incremental updates | Efficient | Requires rebuild |

**Recommendation: HNSW**

For VRAM search with ~100K chunks:
- Better recall for semantic search quality
- No training step means immediate indexing
- Efficient incremental updates for new files
- Memory overhead acceptable at this scale

**HNSW Parameters**

```sql
-- Create HNSW index with tuned parameters
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Query-time parameter for recall/speed tradeoff
SET hnsw.ef_search = 40;  -- Higher = better recall, slower
```

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| m | 16 | Connections per node (default, good balance) |
| ef_construction | 64 | Build-time search width (higher = better index) |
| ef_search | 40 | Query-time search width (tune for recall needs) |

### PostgreSQL Schema

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ====================
-- FILE CHUNKS (Transcripts, Documents)
-- ====================
CREATE TABLE chunks (
  id SERIAL PRIMARY KEY,
  file_id INTEGER NOT NULL,           -- References search.db files.id
  file_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  area TEXT,
  category TEXT,

  -- Chunk metadata
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,           -- The actual text content
  chunk_size INTEGER,                 -- Character count

  -- Transcript-specific metadata
  speakers TEXT[],                    -- Array of speaker names
  start_time TEXT,                    -- First timestamp in chunk
  end_time TEXT,                      -- Last timestamp in chunk

  -- Vector embedding
  embedding vector(4096),             -- Qwen3-VL-Embedding-8B dimensions

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(file_path, chunk_index)
);

-- Indexes
CREATE INDEX idx_chunks_file_path ON chunks(file_path);
CREATE INDEX idx_chunks_file_id ON chunks(file_id);
CREATE INDEX idx_chunks_area ON chunks(area);
CREATE INDEX idx_chunks_speakers ON chunks USING GIN(speakers);

-- HNSW vector index for cosine similarity
CREATE INDEX idx_chunks_embedding ON chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Function to update timestamp on modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chunks_updated_at
  BEFORE UPDATE ON chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ====================
-- EMAIL CHUNKS
-- ====================
CREATE TABLE email_chunks (
  id SERIAL PRIMARY KEY,
  email_id TEXT NOT NULL,             -- 16-char hash from JSON
  email_path TEXT NOT NULL,           -- Full path to JSON file

  -- Email metadata
  subject TEXT NOT NULL,
  from_name TEXT,
  from_email TEXT NOT NULL,
  to_emails TEXT[] NOT NULL,
  email_date TIMESTAMPTZ NOT NULL,
  labels TEXT[],
  has_attachments BOOLEAN DEFAULT FALSE,
  is_reply BOOLEAN DEFAULT FALSE,

  -- Chunk data
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_size INTEGER,

  -- Vector embedding
  embedding vector(4096),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(email_id, chunk_index)
);

-- Indexes for email search
CREATE INDEX idx_email_chunks_email_id ON email_chunks(email_id);
CREATE INDEX idx_email_chunks_from_email ON email_chunks(from_email);
CREATE INDEX idx_email_chunks_to_emails ON email_chunks USING GIN(to_emails);
CREATE INDEX idx_email_chunks_labels ON email_chunks USING GIN(labels);
CREATE INDEX idx_email_chunks_date ON email_chunks(email_date);
CREATE INDEX idx_email_chunks_subject ON email_chunks USING GIN(to_tsvector('english', subject));

-- HNSW vector index for email semantic search
CREATE INDEX idx_email_chunks_embedding ON email_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE TRIGGER email_chunks_updated_at
  BEFORE UPDATE ON email_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ====================
-- SLACK CHUNKS
-- ====================
CREATE TABLE slack_chunks (
  id SERIAL PRIMARY KEY,
  channel TEXT NOT NULL,
  channel_type TEXT NOT NULL,         -- 'public', 'private', 'dm', 'group_dm'

  -- Conversation metadata
  speakers TEXT[] NOT NULL,           -- Display names
  user_ids TEXT[] NOT NULL,           -- Slack user IDs
  start_ts TEXT NOT NULL,             -- Slack timestamp (sortable)
  end_ts TEXT NOT NULL,
  message_date DATE NOT NULL,         -- YYYY-MM-DD
  message_count INTEGER,
  has_files BOOLEAN DEFAULT FALSE,
  has_reactions BOOLEAN DEFAULT FALSE,

  -- Chunk data
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_size INTEGER,

  -- Vector embedding
  embedding vector(4096),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(channel, message_date, chunk_index)
);

-- Indexes for Slack search
CREATE INDEX idx_slack_chunks_channel ON slack_chunks(channel);
CREATE INDEX idx_slack_chunks_channel_type ON slack_chunks(channel_type);
CREATE INDEX idx_slack_chunks_speakers ON slack_chunks USING GIN(speakers);
CREATE INDEX idx_slack_chunks_user_ids ON slack_chunks USING GIN(user_ids);
CREATE INDEX idx_slack_chunks_date ON slack_chunks(message_date);

-- HNSW vector index for Slack semantic search
CREATE INDEX idx_slack_chunks_embedding ON slack_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE TRIGGER slack_chunks_updated_at
  BEFORE UPDATE ON slack_chunks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ====================
-- UNIFIED SEARCH VIEW (Optional)
-- ====================
-- Combines all sources for unified semantic search
CREATE VIEW all_chunks AS
SELECT
  'file' as source,
  id,
  file_path as identifier,
  filename as title,
  area as category,
  chunk_text,
  speakers,
  embedding,
  created_at
FROM chunks

UNION ALL

SELECT
  'email' as source,
  id,
  email_id as identifier,
  subject as title,
  from_email as category,
  chunk_text,
  ARRAY[from_name] as speakers,
  embedding,
  created_at
FROM email_chunks

UNION ALL

SELECT
  'slack' as source,
  id,
  channel as identifier,
  channel as title,
  channel_type as category,
  chunk_text,
  speakers,
  embedding,
  created_at
FROM slack_chunks;
```

### Bun.sql Client Integration

```typescript
// pg-client.ts
import { sql } from "bun";

// Connection configured via POSTGRES_URL environment variable
// export POSTGRES_URL="postgres://user:pass@localhost:5432/vram_embeddings"

interface Chunk {
  id: number;
  file_id: number;
  file_path: string;
  filename: string;
  area: string;
  category: string;
  chunk_index: number;
  chunk_text: string;
  speakers: string[];
  embedding: number[];
}

/**
 * Insert a chunk with embedding
 */
export async function insertChunk(chunk: Omit<Chunk, "id">): Promise<number> {
  const result = await sql`
    INSERT INTO chunks (
      file_id, file_path, filename, area, category,
      chunk_index, chunk_text, chunk_size, speakers,
      start_time, end_time, embedding
    ) VALUES (
      ${chunk.file_id},
      ${chunk.file_path},
      ${chunk.filename},
      ${chunk.area},
      ${chunk.category},
      ${chunk.chunk_index},
      ${chunk.chunk_text},
      ${chunk.chunk_text.length},
      ${chunk.speakers},
      ${chunk.start_time || null},
      ${chunk.end_time || null},
      ${JSON.stringify(chunk.embedding)}::vector
    )
    ON CONFLICT (file_path, chunk_index)
    DO UPDATE SET
      chunk_text = EXCLUDED.chunk_text,
      embedding = EXCLUDED.embedding,
      updated_at = NOW()
    RETURNING id
  `;
  return result[0].id;
}

/**
 * Semantic search with pgvector
 */
export async function semanticSearch(
  queryEmbedding: number[],
  limit: number = 10,
  area?: string
): Promise<Array<Chunk & { distance: number }>> {
  const embedding = JSON.stringify(queryEmbedding);

  if (area) {
    return await sql`
      SELECT
        id, file_id, file_path, filename, area, category,
        chunk_index, chunk_text, speakers,
        embedding <=> ${embedding}::vector AS distance
      FROM chunks
      WHERE area = ${area}
      ORDER BY embedding <=> ${embedding}::vector
      LIMIT ${limit}
    `;
  }

  return await sql`
    SELECT
      id, file_id, file_path, filename, area, category,
      chunk_index, chunk_text, speakers,
      embedding <=> ${embedding}::vector AS distance
    FROM chunks
    ORDER BY embedding <=> ${embedding}::vector
    LIMIT ${limit}
  `;
}

/**
 * Search by speaker
 */
export async function searchBySpeaker(
  queryEmbedding: number[],
  speaker: string,
  limit: number = 10
): Promise<Array<Chunk & { distance: number }>> {
  const embedding = JSON.stringify(queryEmbedding);

  return await sql`
    SELECT
      id, file_id, file_path, filename, area, category,
      chunk_index, chunk_text, speakers,
      embedding <=> ${embedding}::vector AS distance
    FROM chunks
    WHERE ${speaker} = ANY(speakers)
    ORDER BY embedding <=> ${embedding}::vector
    LIMIT ${limit}
  `;
}

/**
 * Delete chunks for a file (for re-indexing)
 */
export async function deleteFileChunks(filePath: string): Promise<number> {
  const result = await sql`
    DELETE FROM chunks WHERE file_path = ${filePath}
    RETURNING id
  `;
  return result.length;
}

/**
 * Get embedding statistics
 */
export async function getStats(): Promise<{
  totalChunks: number;
  uniqueFiles: number;
  avgChunkSize: number;
  byArea: Array<{ area: string; count: number }>;
}> {
  const [stats] = await sql`
    SELECT
      COUNT(*) as total_chunks,
      COUNT(DISTINCT file_path) as unique_files,
      AVG(chunk_size)::integer as avg_chunk_size
    FROM chunks
  `;

  const byArea = await sql`
    SELECT area, COUNT(*) as count
    FROM chunks
    GROUP BY area
    ORDER BY count DESC
  `;

  return {
    totalChunks: stats.total_chunks,
    uniqueFiles: stats.unique_files,
    avgChunkSize: stats.avg_chunk_size,
    byArea
  };
}
```

### Hybrid Search Implementation

```typescript
// hybrid-search.ts
import { Database } from "bun:sqlite";
import { sql } from "bun";
import { generateEmbedding } from "./qwen3vl-client";

const searchDb = new Database("/Volumes/VRAM/00-09_System/00_Index/search.db", { readonly: true });

interface HybridResult {
  path: string;
  filename: string;
  area: string;
  category: string;
  snippet: string;
  combinedScore: number;
  ftsScore: number;
  semanticScore: number;
}

export async function hybridSearch(
  query: string,
  options: {
    limit?: number;
    ftsWeight?: number;
    area?: string;
  } = {}
): Promise<HybridResult[]> {
  const { limit = 10, ftsWeight = 0.5, area } = options;
  const semanticWeight = 1 - ftsWeight;

  // Run FTS and semantic search in parallel
  const [ftsResults, semanticResults] = await Promise.all([
    // FTS5 search in SQLite
    (async () => {
      const stmt = area
        ? searchDb.prepare(`
            SELECT path, filename, area, category,
                   snippet(files_fts, 2, '→', '←', '...', 40) as snippet,
                   rank
            FROM files_fts
            JOIN files ON files_fts.rowid = files.id
            WHERE files_fts MATCH $query AND area = $area
            ORDER BY rank
            LIMIT $limit
          `)
        : searchDb.prepare(`
            SELECT path, filename, area, category,
                   snippet(files_fts, 2, '→', '←', '...', 40) as snippet,
                   rank
            FROM files_fts
            JOIN files ON files_fts.rowid = files.id
            WHERE files_fts MATCH $query
            ORDER BY rank
            LIMIT $limit
          `);

      return stmt.all({ $query: query, $area: area, $limit: limit * 2 });
    })(),

    // Semantic search in PostgreSQL
    (async () => {
      const { embedding } = await generateEmbedding(query);
      const embeddingStr = JSON.stringify(embedding);

      if (area) {
        return await sql`
          SELECT file_path as path, filename, area, category, chunk_text as snippet,
                 embedding <=> ${embeddingStr}::vector AS distance
          FROM chunks
          WHERE area = ${area}
          ORDER BY embedding <=> ${embeddingStr}::vector
          LIMIT ${limit * 2}
        `;
      }

      return await sql`
        SELECT file_path as path, filename, area, category, chunk_text as snippet,
               embedding <=> ${embeddingStr}::vector AS distance
        FROM chunks
        ORDER BY embedding <=> ${embeddingStr}::vector
        LIMIT ${limit * 2}
      `;
    })()
  ]);

  // Merge and score results
  const scoreMap = new Map<string, {
    ftsScore: number;
    semanticScore: number;
    data: any;
  }>();

  // Normalize FTS scores (rank is negative, lower is better)
  const ftsMax = Math.max(...ftsResults.map((r: any) => Math.abs(r.rank)), 1);
  ftsResults.forEach((r: any, i: number) => {
    const normalizedScore = 1 - (Math.abs(r.rank) / ftsMax);
    scoreMap.set(r.path, {
      ftsScore: normalizedScore,
      semanticScore: 0,
      data: r
    });
  });

  // Normalize semantic scores (distance, lower is better)
  const maxDist = Math.max(...semanticResults.map((r: any) => r.distance), 0.001);
  semanticResults.forEach((r: any) => {
    const normalizedScore = 1 - (r.distance / maxDist);
    const existing = scoreMap.get(r.path);

    if (existing) {
      existing.semanticScore = normalizedScore;
    } else {
      scoreMap.set(r.path, {
        ftsScore: 0,
        semanticScore: normalizedScore,
        data: r
      });
    }
  });

  // Calculate combined scores and sort
  const results: HybridResult[] = Array.from(scoreMap.entries())
    .map(([path, { ftsScore, semanticScore, data }]) => ({
      path,
      filename: data.filename,
      area: data.area,
      category: data.category,
      snippet: data.snippet,
      combinedScore: (ftsScore * ftsWeight) + (semanticScore * semanticWeight),
      ftsScore,
      semanticScore
    }))
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, limit);

  return results;
}
```

---

## Implementation

### Phase 1: PostgreSQL Setup

**1.1 Install PostgreSQL with pgvector**

```bash
# macOS with Homebrew
brew install postgresql@16
brew install pgvector

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb vram_embeddings

# Enable pgvector extension
psql vram_embeddings -c "CREATE EXTENSION vector;"
```

**1.2 Create schema**

```bash
# Run schema creation
psql vram_embeddings < /Volumes/VRAM/00-09_System/01_Tools/search_engine/schema/pgvector-schema.sql
```

**1.3 Configure environment**

```bash
# Add to ~/.zshrc or project .env
export POSTGRES_URL="postgres://localhost:5432/vram_embeddings"
```

### Phase 2: Smart Chunking Implementation

**2.1 Create chunking module**

```typescript
// smart-chunker.ts

interface ChunkConfig {
  targetSize: number;      // Target characters per chunk
  minSize: number;         // Minimum chunk size
  overlap: number;         // Overlap characters
  maxSize: number;         // Maximum chunk size
}

const TRANSCRIPT_CONFIG: ChunkConfig = {
  targetSize: 1800,
  minSize: 1200,
  overlap: 400,
  maxSize: 2200
};

const DOCUMENT_CONFIG: ChunkConfig = {
  targetSize: 1800,
  minSize: 1000,
  overlap: 300,
  maxSize: 2200
};

interface Chunk {
  text: string;
  index: number;
  speakers?: string[];
  startTime?: string;
  endTime?: string;
  isTranscript: boolean;
}

/**
 * Detect if content is a transcript
 */
function isTranscript(content: string): boolean {
  // Check for timestamp pattern [HH:MM] or [H:MM]
  const timestampPattern = /\[\d{1,2}:\d{2}\]/g;
  const matches = content.match(timestampPattern);
  return matches !== null && matches.length >= 3;
}

/**
 * Smart chunk content based on type detection
 */
export function smartChunk(content: string, filePath: string): Chunk[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  // Skip very short content
  if (content.length < 500) {
    return [{
      text: content,
      index: 0,
      isTranscript: false
    }];
  }

  if (isTranscript(content)) {
    return chunkTranscript(content, TRANSCRIPT_CONFIG);
  }

  return chunkDocument(content, DOCUMENT_CONFIG);
}

/**
 * Chunk transcript with speaker awareness
 */
function chunkTranscript(content: string, config: ChunkConfig): Chunk[] {
  const turns = parseTranscriptTurns(content);

  if (turns.length === 0) {
    // Fallback to document chunking if parsing fails
    return chunkDocument(content, config);
  }

  const chunks: Chunk[] = [];
  let currentText = "";
  let currentSpeakers = new Set<string>();
  let startTime = "";
  let endTime = "";

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const turnText = turn.fullText + "\n\n";

    // Check if adding this turn would exceed max size
    if (currentText.length + turnText.length > config.maxSize && currentText.length >= config.minSize) {
      // Finalize current chunk
      chunks.push({
        text: currentText.trim(),
        index: chunks.length,
        speakers: Array.from(currentSpeakers),
        startTime,
        endTime,
        isTranscript: true
      });

      // Start new chunk with overlap
      const overlapText = getOverlapText(currentText, config.overlap);
      currentText = overlapText + turnText;
      currentSpeakers = new Set([turn.speaker]);
      startTime = turn.timestamp;
      endTime = turn.timestamp;
    } else {
      currentText += turnText;
      currentSpeakers.add(turn.speaker);
      if (!startTime) startTime = turn.timestamp;
      endTime = turn.timestamp;
    }
  }

  // Add final chunk if substantial
  if (currentText.length >= config.minSize / 2) {
    chunks.push({
      text: currentText.trim(),
      index: chunks.length,
      speakers: Array.from(currentSpeakers),
      startTime,
      endTime,
      isTranscript: true
    });
  }

  return chunks;
}

/**
 * Chunk regular documents
 */
function chunkDocument(content: string, config: ChunkConfig): Chunk[] {
  const chunks: Chunk[] = [];
  let start = 0;

  while (start < content.length) {
    let end = start + config.targetSize;

    // Try to break at paragraph boundary
    if (end < content.length) {
      const nextParagraph = content.indexOf("\n\n", end - 200);
      if (nextParagraph !== -1 && nextParagraph < end + 200) {
        end = nextParagraph + 2;
      }
    } else {
      end = content.length;
    }

    const chunkText = content.slice(start, end).trim();

    if (chunkText.length >= config.minSize / 2) {
      chunks.push({
        text: chunkText,
        index: chunks.length,
        isTranscript: false
      });
    }

    // Move start with overlap
    start = end - config.overlap;
    if (start >= content.length - config.overlap) break;
  }

  return chunks;
}

/**
 * Parse transcript into speaker turns
 */
function parseTranscriptTurns(content: string): Array<{
  timestamp: string;
  speaker: string;
  text: string;
  fullText: string;
}> {
  const turnRegex = /\[(\d{1,2}:\d{2})\]\s*([^:]+):\s*([^\[]*)/g;
  const turns = [];

  let match;
  while ((match = turnRegex.exec(content)) !== null) {
    const text = match[3].trim();
    // Skip empty or boilerplate turns
    if (text.length < 10 || isBoilerplate(text)) continue;

    turns.push({
      timestamp: match[1],
      speaker: match[2].trim(),
      text: text,
      fullText: `[${match[1]}] ${match[2].trim()}: ${text}`
    });
  }

  return turns;
}

/**
 * Get overlap text from end of chunk
 */
function getOverlapText(text: string, overlapSize: number): string {
  if (text.length <= overlapSize) return text;

  // Try to start overlap at a sentence boundary
  const overlapStart = text.length - overlapSize;
  const sentenceEnd = text.lastIndexOf(". ", overlapStart + 100);

  if (sentenceEnd > overlapStart) {
    return text.slice(sentenceEnd + 2);
  }

  return text.slice(overlapStart);
}

/**
 * Check if text is boilerplate
 */
function isBoilerplate(text: string): boolean {
  const patterns = [
    /^thank you\.?$/i,
    /^thanks\.?$/i,
    /^okay\.?$/i,
    /^yes\.?$/i,
    /^no\.?$/i,
    /^mhm\.?$/i,
    /^uh-huh\.?$/i,
    /^right\.?$/i,
  ];

  const trimmed = text.trim();
  return patterns.some(p => p.test(trimmed));
}

export { isTranscript, ChunkConfig, TRANSCRIPT_CONFIG, DOCUMENT_CONFIG };
```

### Email Chunking Strategy

**Email JSON Schema** (from Gmail export):

```typescript
interface EmailJSON {
  id: {
    message_id: string;
    index: number;
    hash: string;           // 16-char unique hash
  };
  headers: {
    subject: string;
    date: {
      raw: string;
      iso: string;
      unix: number;
    };
    from: { name: string; email: string };
    to: Array<{ name: string; email: string }>;
    cc?: Array<{ name: string; email: string }>;
    in_reply_to?: string;
    references?: string[];
  };
  content: {
    body: string;           // Plain text body
    body_html?: string;
    has_html_version: boolean;
  };
  attachments?: {
    count: number;
    files: Array<{ filename: string; content_type: string; size_bytes: number }>;
  };
  metadata: {
    labels: string[];       // Gmail labels
  };
  threading?: {
    thread_topic: string;
    references_count: number;
  };
}
```

**Email Chunker Implementation**:

```typescript
// email-chunker.ts
import { readdir } from "node:fs/promises";

const EMAIL_BASE = "/Volumes/VRAM/10-19_Work/14_Communications/14.01b_emails_json";

interface EmailChunk {
  text: string;
  index: number;
  emailId: string;          // 16-char hash
  subject: string;
  fromName: string;
  fromEmail: string;
  toEmails: string[];
  date: string;             // ISO format
  labels: string[];
  hasAttachments: boolean;
  isReply: boolean;
}

const EMAIL_CONFIG = {
  targetSize: 1500,         // Emails tend to be shorter
  minSize: 200,             // Include short emails
  maxSize: 2000,
  overlap: 300
};

// Common signature patterns to remove
const SIGNATURE_PATTERNS = [
  /^--\s*$/m,                                    // Standard signature delimiter
  /^Sent from my iPhone/m,
  /^Sent from my iPad/m,
  /^Get Outlook for/m,
  /^\[?Disclaimer:?\]?/im,
  /^This email and any attachments/im,
  /^CONFIDENTIAL/im,
  /^_{10,}$/m,                                   // Long underscores
];

/**
 * Remove email signatures and boilerplate
 */
function removeSignature(body: string): string {
  let cleaned = body;

  for (const pattern of SIGNATURE_PATTERNS) {
    const match = cleaned.match(pattern);
    if (match && match.index !== undefined) {
      // Take content before signature
      cleaned = cleaned.slice(0, match.index).trim();
    }
  }

  return cleaned;
}

/**
 * Chunk a single email
 */
export function chunkEmail(email: EmailJSON): EmailChunk[] {
  const subject = email.headers.subject || "(No Subject)";
  const body = removeSignature(email.content.body || "");

  // Combine subject + body for embedding
  const fullText = `Subject: ${subject}\n\n${body}`.trim();

  // Short emails don't need chunking
  if (fullText.length <= EMAIL_CONFIG.maxSize) {
    return [{
      text: fullText,
      index: 0,
      emailId: email.id.hash,
      subject: subject,
      fromName: email.headers.from.name || "",
      fromEmail: email.headers.from.email,
      toEmails: email.headers.to.map(t => t.email),
      date: email.headers.date.iso,
      labels: email.metadata.labels || [],
      hasAttachments: (email.attachments?.count || 0) > 0,
      isReply: !!email.headers.in_reply_to
    }];
  }

  // Long emails need chunking
  const chunks: EmailChunk[] = [];
  let start = 0;

  while (start < fullText.length) {
    let end = Math.min(start + EMAIL_CONFIG.targetSize, fullText.length);

    // Try to break at paragraph boundary
    if (end < fullText.length) {
      const nextPara = fullText.indexOf("\n\n", end - 200);
      if (nextPara !== -1 && nextPara < end + 200) {
        end = nextPara + 2;
      }
    }

    const chunkText = fullText.slice(start, end).trim();

    if (chunkText.length >= EMAIL_CONFIG.minSize) {
      chunks.push({
        text: chunkText,
        index: chunks.length,
        emailId: email.id.hash,
        subject: subject,
        fromName: email.headers.from.name || "",
        fromEmail: email.headers.from.email,
        toEmails: email.headers.to.map(t => t.email),
        date: email.headers.date.iso,
        labels: email.metadata.labels || [],
        hasAttachments: (email.attachments?.count || 0) > 0,
        isReply: !!email.headers.in_reply_to
      });
    }

    start = end - EMAIL_CONFIG.overlap;
    if (start >= fullText.length - EMAIL_CONFIG.overlap) break;
  }

  return chunks;
}

/**
 * Iterate through all emails by year
 */
export async function* iterateEmails(): AsyncGenerator<{ path: string; email: EmailJSON }> {
  const years = ["2020", "2021", "2022", "2023", "2024", "2025"];

  for (const year of years) {
    const yearPath = `${EMAIL_BASE}/${year}`;

    try {
      const folders = await readdir(yearPath);

      for (const folder of folders) {
        const jsonPath = `${yearPath}/${folder}`;

        // Find .json file in folder
        const files = await readdir(jsonPath);
        const jsonFile = files.find(f => f.endsWith(".json"));

        if (jsonFile) {
          const fullPath = `${jsonPath}/${jsonFile}`;
          try {
            const file = Bun.file(fullPath);
            const email = await file.json() as EmailJSON;
            yield { path: fullPath, email };
          } catch (err) {
            console.error(`Failed to parse: ${fullPath}`);
          }
        }
      }
    } catch (err) {
      // Year folder may not exist
      continue;
    }
  }
}
```

### Slack Chunking Strategy

**Slack Message Schema** (from Slackdump export):

```typescript
interface SlackMessage {
  client_msg_id: string;
  type: string;
  user: string;                    // User ID (e.g., "U838WQGJE")
  text: string;
  ts: string;                      // Unix timestamp with microseconds
  edited?: { ts: string };
  blocks?: Array<{
    type: string;
    elements: any[];
  }>;
  user_profile?: {
    name: string;
    display_name: string;
    real_name: string;
    avatar_hash: string;
  };
  reactions?: Array<{
    name: string;
    users: string[];
    count: number;
  }>;
  thread_ts?: string;              // Parent thread timestamp
  reply_count?: number;
  reply_users_count?: number;
  files?: Array<{
    name: string;
    mimetype: string;
    filetype: string;
  }>;
}
```

**Slack Chunker Implementation**:

```typescript
// slack-chunker.ts
import { readdir } from "node:fs/promises";

const SLACK_BASE = "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json";

interface SlackChunk {
  text: string;
  index: number;
  channel: string;
  channelType: "public" | "private" | "dm" | "group_dm";
  speakers: string[];            // Display names
  userIds: string[];             // Slack user IDs
  startTs: string;
  endTs: string;
  date: string;                  // YYYY-MM-DD
  messageCount: number;
  hasFiles: boolean;
  hasReactions: boolean;
}

const SLACK_CONFIG = {
  targetSize: 1800,
  minSize: 500,
  maxSize: 2200,
  overlap: 300,
  timeWindowMinutes: 15          // Group messages within this window
};

/**
 * Detect channel type from channel name/path
 */
function detectChannelType(channelName: string): SlackChunk["channelType"] {
  if (channelName.startsWith("mpdm-")) return "group_dm";
  if (channelName.includes("--")) return "dm";       // Direct message pattern
  // Could check channel metadata for private vs public
  return "private";
}

/**
 * Format a single Slack message for embedding
 */
function formatMessage(msg: SlackMessage): string {
  const userName = msg.user_profile?.display_name
    || msg.user_profile?.real_name
    || msg.user_profile?.name
    || msg.user;

  const timestamp = new Date(parseFloat(msg.ts) * 1000);
  const time = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  let formatted = `[${time}] ${userName}: ${msg.text}`;

  // Add file references
  if (msg.files && msg.files.length > 0) {
    const fileNames = msg.files.map(f => f.name).join(", ");
    formatted += `\n[Attached: ${fileNames}]`;
  }

  // Add reaction summary
  if (msg.reactions && msg.reactions.length > 0) {
    const reactions = msg.reactions.map(r => `:${r.name}:x${r.count}`).join(" ");
    formatted += `\n[Reactions: ${reactions}]`;
  }

  return formatted;
}

/**
 * Group messages into time-based windows
 */
function groupByTimeWindow(messages: SlackMessage[]): SlackMessage[][] {
  if (messages.length === 0) return [];

  const windowMs = SLACK_CONFIG.timeWindowMinutes * 60 * 1000;
  const groups: SlackMessage[][] = [];
  let currentGroup: SlackMessage[] = [];
  let windowStart = parseFloat(messages[0].ts) * 1000;

  for (const msg of messages) {
    const msgTime = parseFloat(msg.ts) * 1000;

    if (msgTime - windowStart > windowMs && currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [msg];
      windowStart = msgTime;
    } else {
      currentGroup.push(msg);
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * Chunk a day's worth of Slack messages
 */
export function chunkSlackDay(
  messages: SlackMessage[],
  channel: string,
  date: string
): SlackChunk[] {
  // Filter out system messages
  const userMessages = messages.filter(m =>
    m.type === "message" &&
    m.user &&
    m.text &&
    m.text.trim().length > 0
  );

  if (userMessages.length === 0) return [];

  // Group by time window
  const timeGroups = groupByTimeWindow(userMessages);
  const channelType = detectChannelType(channel);
  const chunks: SlackChunk[] = [];

  for (const group of timeGroups) {
    // Format all messages in group
    let groupText = "";
    const speakers = new Set<string>();
    const userIds = new Set<string>();
    let hasFiles = false;
    let hasReactions = false;

    for (const msg of group) {
      groupText += formatMessage(msg) + "\n\n";

      const speaker = msg.user_profile?.display_name
        || msg.user_profile?.real_name
        || msg.user;
      speakers.add(speaker);
      userIds.add(msg.user);

      if (msg.files && msg.files.length > 0) hasFiles = true;
      if (msg.reactions && msg.reactions.length > 0) hasReactions = true;
    }

    groupText = groupText.trim();

    // Skip if too short
    if (groupText.length < SLACK_CONFIG.minSize) continue;

    // If group fits in one chunk
    if (groupText.length <= SLACK_CONFIG.maxSize) {
      chunks.push({
        text: groupText,
        index: chunks.length,
        channel,
        channelType,
        speakers: Array.from(speakers),
        userIds: Array.from(userIds),
        startTs: group[0].ts,
        endTs: group[group.length - 1].ts,
        date,
        messageCount: group.length,
        hasFiles,
        hasReactions
      });
    } else {
      // Split large groups
      let start = 0;
      while (start < groupText.length) {
        let end = Math.min(start + SLACK_CONFIG.targetSize, groupText.length);

        // Break at message boundary (double newline)
        if (end < groupText.length) {
          const nextBreak = groupText.indexOf("\n\n", end - 200);
          if (nextBreak !== -1 && nextBreak < end + 200) {
            end = nextBreak + 2;
          }
        }

        const chunkText = groupText.slice(start, end).trim();

        if (chunkText.length >= SLACK_CONFIG.minSize / 2) {
          chunks.push({
            text: chunkText,
            index: chunks.length,
            channel,
            channelType,
            speakers: Array.from(speakers),
            userIds: Array.from(userIds),
            startTs: group[0].ts,
            endTs: group[group.length - 1].ts,
            date,
            messageCount: group.length,
            hasFiles,
            hasReactions
          });
        }

        start = end - SLACK_CONFIG.overlap;
        if (start >= groupText.length - SLACK_CONFIG.overlap) break;
      }
    }
  }

  return chunks;
}

/**
 * Iterate through all Slack conversations
 */
export async function* iterateSlackChannels(): AsyncGenerator<{
  channel: string;
  date: string;
  messages: SlackMessage[];
}> {
  const channels = await readdir(SLACK_BASE);

  for (const channel of channels) {
    const channelPath = `${SLACK_BASE}/${channel}`;

    try {
      const files = await readdir(channelPath);
      const jsonFiles = files.filter(f => f.endsWith(".json"));

      for (const jsonFile of jsonFiles) {
        const date = jsonFile.replace(".json", "");
        const fullPath = `${channelPath}/${jsonFile}`;

        try {
          const file = Bun.file(fullPath);
          const messages = await file.json() as SlackMessage[];
          yield { channel, date, messages };
        } catch (err) {
          console.error(`Failed to parse: ${fullPath}`);
        }
      }
    } catch (err) {
      continue;
    }
  }
}
```

### Phase 3: Embedding Indexer

**3.1 Create pgvector indexer**

```typescript
// pgvector-indexer.ts
import { Database } from "bun:sqlite";
import { sql } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { smartChunk } from "./smart-chunker";

const SEARCH_DB = "/Volumes/VRAM/00-09_System/00_Index/search.db";
const BATCH_SIZE = 10;
const CONCURRENT_EMBEDDINGS = 2;

interface FileRecord {
  id: number;
  path: string;
  filename: string;
  content: string | null;
  area: string;
  category: string;
}

async function main() {
  console.log("VRAM pgvector Embedding Indexer\n");
  console.log("=".repeat(50));

  // Check llama-server
  console.log("\nChecking llama-server...");
  try {
    await checkHealth();
    console.log("✅ llama-server ready\n");
  } catch (err) {
    console.error("❌ llama-server not available");
    process.exit(1);
  }

  // Check PostgreSQL connection
  console.log("Checking PostgreSQL...");
  try {
    const [result] = await sql`SELECT version()`;
    console.log("✅ PostgreSQL connected\n");
  } catch (err) {
    console.error("❌ PostgreSQL not available:", err);
    process.exit(1);
  }

  const searchDb = new Database(SEARCH_DB, { readonly: true });

  const getFiles = searchDb.prepare(`
    SELECT id, path, filename, content, area, category
    FROM files
    WHERE extension IN ('md', 'txt')
    ORDER BY id
    LIMIT $limit OFFSET $offset
  `);

  const getFileCount = searchDb.prepare(`
    SELECT COUNT(*) as count FROM files WHERE extension IN ('md', 'txt')
  `);

  const { count: totalFiles } = getFileCount.get() as { count: number };
  console.log(`Found ${totalFiles} text files to process.\n`);

  let processed = 0;
  let totalChunks = 0;
  let skipped = 0;
  let offset = 0;

  const startTime = performance.now();

  while (offset < totalFiles) {
    const files = getFiles.all({ $limit: BATCH_SIZE, $offset: offset }) as FileRecord[];

    for (const file of files) {
      try {
        // Check if file already indexed
        const [existing] = await sql`
          SELECT COUNT(*) as cnt FROM chunks WHERE file_path = ${file.path}
        `;

        if (existing.cnt > 0) {
          skipped++;
          processed++;
          continue;
        }

        // Smart chunk the content
        const chunks = smartChunk(file.content || "", file.path);

        if (chunks.length === 0) {
          skipped++;
          processed++;
          continue;
        }

        // Generate embeddings for all chunks
        for (const chunk of chunks) {
          const embedding = await generateEmbedding(chunk.text);

          await sql`
            INSERT INTO chunks (
              file_id, file_path, filename, area, category,
              chunk_index, chunk_text, chunk_size,
              speakers, start_time, end_time, embedding
            ) VALUES (
              ${file.id},
              ${file.path},
              ${file.filename},
              ${file.area},
              ${file.category},
              ${chunk.index},
              ${chunk.text},
              ${chunk.text.length},
              ${chunk.speakers || null},
              ${chunk.startTime || null},
              ${chunk.endTime || null},
              ${JSON.stringify(embedding)}::vector
            )
          `;

          totalChunks++;
        }

        console.log(`✅ ${file.filename}: ${chunks.length} chunk(s)`);
        processed++;

      } catch (err) {
        console.error(`❌ ${file.filename}: ${err}`);
        processed++;
      }
    }

    offset += BATCH_SIZE;

    // Progress update
    if (offset % 100 === 0) {
      const elapsed = (performance.now() - startTime) / 1000;
      const rate = processed / elapsed;
      const eta = (totalFiles - processed) / rate;
      console.log(`\n[Progress: ${processed}/${totalFiles}] Rate: ${rate.toFixed(1)}/s ETA: ${(eta / 60).toFixed(1)}min\n`);
    }
  }

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("Indexing Complete!\n");
  console.log(`  Files processed: ${processed}`);
  console.log(`  Chunks created: ${totalChunks}`);
  console.log(`  Skipped (existing): ${skipped}`);
  console.log(`  Time: ${elapsed.toFixed(1)}s`);
  console.log(`  Avg: ${(elapsed / processed * 1000).toFixed(0)}ms/file`);

  searchDb.close();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
```

**3.2 Create Email Indexer**

```typescript
// email-indexer.ts
import { sql } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { chunkEmail, iterateEmails, EmailJSON } from "./email-chunker";

async function indexEmails() {
  console.log("VRAM Email Embedding Indexer\n");
  console.log("=".repeat(50));

  // Check llama-server
  await checkHealth();
  console.log("✅ llama-server ready\n");

  let processed = 0;
  let totalChunks = 0;
  let skipped = 0;
  let errors = 0;

  const startTime = performance.now();

  for await (const { path, email } of iterateEmails()) {
    try {
      // Check if already indexed
      const [existing] = await sql`
        SELECT COUNT(*) as cnt FROM email_chunks WHERE email_id = ${email.id.hash}
      `;

      if (existing.cnt > 0) {
        skipped++;
        processed++;
        continue;
      }

      // Chunk and embed
      const chunks = chunkEmail(email);

      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.text);

        await sql`
          INSERT INTO email_chunks (
            email_id, email_path, subject, from_name, from_email,
            to_emails, email_date, labels, has_attachments, is_reply,
            chunk_index, chunk_text, chunk_size, embedding
          ) VALUES (
            ${chunk.emailId},
            ${path},
            ${chunk.subject},
            ${chunk.fromName},
            ${chunk.fromEmail},
            ${chunk.toEmails},
            ${chunk.date}::timestamptz,
            ${chunk.labels},
            ${chunk.hasAttachments},
            ${chunk.isReply},
            ${chunk.index},
            ${chunk.text},
            ${chunk.text.length},
            ${JSON.stringify(embedding)}::vector
          )
        `;

        totalChunks++;
      }

      console.log(`✅ ${email.headers.subject?.substring(0, 50)}...`);
      processed++;

      // Progress update every 100 emails
      if (processed % 100 === 0) {
        const elapsed = (performance.now() - startTime) / 1000;
        console.log(`\n[Progress: ${processed}] Chunks: ${totalChunks} | Rate: ${(processed / elapsed).toFixed(1)}/s\n`);
      }

    } catch (err) {
      console.error(`❌ ${email.id.hash}: ${err}`);
      errors++;
      processed++;
    }
  }

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("Email Indexing Complete!\n");
  console.log(`  Emails processed: ${processed}`);
  console.log(`  Chunks created: ${totalChunks}`);
  console.log(`  Skipped (existing): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Time: ${(elapsed / 60).toFixed(1)} min`);
}

indexEmails().catch(console.error);
```

**3.3 Create Slack Indexer**

```typescript
// slack-indexer.ts
import { sql } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { chunkSlackDay, iterateSlackChannels } from "./slack-chunker";

async function indexSlack() {
  console.log("VRAM Slack Embedding Indexer\n");
  console.log("=".repeat(50));

  // Check llama-server
  await checkHealth();
  console.log("✅ llama-server ready\n");

  let channelsProcessed = 0;
  let daysProcessed = 0;
  let totalChunks = 0;
  let skipped = 0;
  let errors = 0;

  const startTime = performance.now();
  let currentChannel = "";

  for await (const { channel, date, messages } of iterateSlackChannels()) {
    // Track channel progress
    if (channel !== currentChannel) {
      if (currentChannel) {
        console.log(`  └─ ${currentChannel}: ${daysProcessed} days processed`);
      }
      currentChannel = channel;
      channelsProcessed++;
      daysProcessed = 0;
      console.log(`\n📁 ${channel}`);
    }

    try {
      // Check if already indexed
      const [existing] = await sql`
        SELECT COUNT(*) as cnt FROM slack_chunks
        WHERE channel = ${channel} AND message_date = ${date}::date
      `;

      if (existing.cnt > 0) {
        skipped++;
        daysProcessed++;
        continue;
      }

      // Chunk and embed
      const chunks = chunkSlackDay(messages, channel, date);

      if (chunks.length === 0) {
        daysProcessed++;
        continue;
      }

      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.text);

        await sql`
          INSERT INTO slack_chunks (
            channel, channel_type, speakers, user_ids,
            start_ts, end_ts, message_date, message_count,
            has_files, has_reactions,
            chunk_index, chunk_text, chunk_size, embedding
          ) VALUES (
            ${chunk.channel},
            ${chunk.channelType},
            ${chunk.speakers},
            ${chunk.userIds},
            ${chunk.startTs},
            ${chunk.endTs},
            ${chunk.date}::date,
            ${chunk.messageCount},
            ${chunk.hasFiles},
            ${chunk.hasReactions},
            ${chunk.index},
            ${chunk.text},
            ${chunk.text.length},
            ${JSON.stringify(embedding)}::vector
          )
        `;

        totalChunks++;
      }

      daysProcessed++;

    } catch (err) {
      console.error(`  ❌ ${date}: ${err}`);
      errors++;
      daysProcessed++;
    }
  }

  // Final channel summary
  if (currentChannel) {
    console.log(`  └─ ${currentChannel}: ${daysProcessed} days processed`);
  }

  const elapsed = (performance.now() - startTime) / 1000;

  console.log("\n" + "=".repeat(50));
  console.log("Slack Indexing Complete!\n");
  console.log(`  Channels processed: ${channelsProcessed}`);
  console.log(`  Chunks created: ${totalChunks}`);
  console.log(`  Skipped (existing): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Time: ${(elapsed / 60).toFixed(1)} min`);
}

indexSlack().catch(console.error);
```

### Phase 4: Server Integration

**4.1 Update server.ts**

```typescript
// server.ts (updated sections)
import { Database } from "bun:sqlite";
import { sql } from "bun";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import { hybridSearch } from "./hybrid-search";

// SQLite for FTS
const DB_PATH = "/Volumes/VRAM/00-09_System/00_Index/search.db";
const db = new Database(DB_PATH, { readonly: true });
db.run("PRAGMA journal_mode = WAL;");

// Check PostgreSQL availability at startup
let pgAvailable = false;
try {
  await sql`SELECT 1`;
  pgAvailable = true;
  console.log("✅ PostgreSQL connected");
} catch {
  console.warn("⚠️ PostgreSQL not available - semantic search disabled");
}

// ... existing FTS prepared statements ...

const server = Bun.serve({
  port: 3000,

  routes: {
    // ... existing routes ...

    "/semantic": {
      GET: async (req) => {
        if (!pgAvailable) {
          return Response.json({
            error: "Semantic search not available",
            details: "PostgreSQL connection failed"
          }, { status: 503 });
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
        const area = url.searchParams.get("area");
        const speaker = url.searchParams.get("speaker");

        if (!q) {
          return Response.json({ error: "Missing ?q= parameter" }, { status: 400 });
        }

        const startTime = performance.now();

        try {
          const embedding = await generateEmbedding(q);
          const embeddingStr = JSON.stringify(embedding);

          let results;
          if (speaker) {
            results = await sql`
              SELECT file_path as path, filename, area, category,
                     chunk_text as snippet, speakers,
                     embedding <=> ${embeddingStr}::vector AS distance
              FROM chunks
              WHERE ${speaker} = ANY(speakers)
              ORDER BY embedding <=> ${embeddingStr}::vector
              LIMIT ${limit}
            `;
          } else if (area) {
            results = await sql`
              SELECT file_path as path, filename, area, category,
                     chunk_text as snippet, speakers,
                     embedding <=> ${embeddingStr}::vector AS distance
              FROM chunks
              WHERE area = ${area}
              ORDER BY embedding <=> ${embeddingStr}::vector
              LIMIT ${limit}
            `;
          } else {
            results = await sql`
              SELECT file_path as path, filename, area, category,
                     chunk_text as snippet, speakers,
                     embedding <=> ${embeddingStr}::vector AS distance
              FROM chunks
              ORDER BY embedding <=> ${embeddingStr}::vector
              LIMIT ${limit}
            `;
          }

          const elapsed = performance.now() - startTime;

          return Response.json({
            query: q,
            results,
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "semantic"
          });
        } catch (err: any) {
          return Response.json({
            error: "Semantic search failed",
            details: err.message
          }, { status: 500 });
        }
      }
    },

    "/hybrid": {
      GET: async (req) => {
        if (!pgAvailable) {
          return Response.json({
            error: "Hybrid search not available",
            details: "PostgreSQL connection failed"
          }, { status: 503 });
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
        const ftsWeight = parseFloat(url.searchParams.get("fts_weight") || "0.5");
        const area = url.searchParams.get("area");

        if (!q) {
          return Response.json({ error: "Missing ?q= parameter" }, { status: 400 });
        }

        const startTime = performance.now();

        try {
          const results = await hybridSearch(q, { limit, ftsWeight, area });
          const elapsed = performance.now() - startTime;

          return Response.json({
            query: q,
            results,
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "hybrid",
            weights: { fts: ftsWeight, semantic: 1 - ftsWeight }
          });
        } catch (err: any) {
          return Response.json({
            error: "Hybrid search failed",
            details: err.message
          }, { status: 500 });
        }
      }
    },

    "/stats": async () => {
      const ftsStats = getStats.get() as any;
      const byArea = getStatsByArea.all();
      const byExtension = getStatsByExtension.all();

      let embeddingStats = null;
      if (pgAvailable) {
        try {
          const [pgStats] = await sql`
            SELECT
              COUNT(*) as total_chunks,
              COUNT(DISTINCT file_path) as files_with_embeddings,
              AVG(chunk_size)::integer as avg_chunk_size
            FROM chunks
          `;
          embeddingStats = {
            total_chunks: pgStats.total_chunks,
            files_with_embeddings: pgStats.files_with_embeddings,
            avg_chunk_size: pgStats.avg_chunk_size,
            model: "qwen3-vl-embedding-8b",
            dimensions: 4096,
            storage: "PostgreSQL + pgvector"
          };
        } catch {}
      }

      return Response.json({
        ...ftsStats,
        by_area: byArea,
        by_extension: byExtension,
        embeddings: embeddingStats
      });
    },

    "/pg/status": async () => {
      try {
        const [version] = await sql`SELECT version()`;
        const [stats] = await sql`
          SELECT
            COUNT(*) as chunks,
            COUNT(DISTINCT file_path) as files
          FROM chunks
        `;

        return Response.json({
          connected: true,
          version: version.version,
          chunks: stats.chunks,
          files: stats.files
        });
      } catch (err: any) {
        return Response.json({
          connected: false,
          error: err.message
        });
      }
    }
  }
});
```

---

## Performance Considerations

### Chunk Size Impact

| Chunk Size | Embeddings/File (avg) | Index Size | Query Recall |
|------------|----------------------|------------|--------------|
| 8000 chars | 1-2 | Small | Low (too broad) |
| 2000 chars | 4-8 | Medium | High |
| 500 chars | 15-30 | Large | Very High (noisy) |

**Recommendation**: 1500-2000 chars balances recall and index size.

### HNSW Performance

| ef_search | Recall@10 | Query Time |
|-----------|-----------|------------|
| 10 | ~90% | ~5ms |
| 40 | ~98% | ~15ms |
| 100 | ~99.5% | ~40ms |

**Recommendation**: Start with ef_search=40, tune based on quality needs.

### Connection Pooling

Bun.sql uses connection pooling automatically. For high concurrency:

```typescript
// Fine-tune via environment
process.env.POSTGRES_POOL_SIZE = "10";
```

### Index Maintenance

```sql
-- Periodically vacuum and analyze for optimal performance
VACUUM ANALYZE chunks;

-- Monitor index health
SELECT * FROM pg_stat_user_indexes WHERE relname = 'chunks';
```

---

## Implementation Checklist

### Phase 1: PostgreSQL Setup
- [ ] Install PostgreSQL 16 via Homebrew
- [ ] Install pgvector extension
- [ ] Create vram_embeddings database
- [ ] Create schema with chunks table
- [ ] Create email_chunks table
- [ ] Create slack_chunks table
- [ ] Create all_chunks unified view
- [ ] Create all HNSW indexes
- [ ] Configure POSTGRES_URL environment variable
- [ ] Verify connection from Bun

### Phase 2: Smart Chunking Modules
- [ ] Create smart-chunker.ts (transcripts/documents)
- [ ] Implement transcript detection
- [ ] Implement speaker-aware chunking
- [ ] Implement document chunking with overlap
- [ ] Add boilerplate filtering
- [ ] Create email-chunker.ts
- [ ] Implement signature removal
- [ ] Implement email iteration by year
- [ ] Create slack-chunker.ts
- [ ] Implement time-window grouping
- [ ] Implement channel type detection
- [ ] Test all chunkers with samples

### Phase 3: Embedding Indexers
- [ ] Create pgvector-indexer.ts (files)
- [ ] Integrate smart chunking
- [ ] Add progress reporting
- [ ] Add resume capability (skip existing)
- [ ] Create email-indexer.ts
- [ ] Add email iteration and chunking
- [ ] Add email metadata extraction
- [ ] Create slack-indexer.ts
- [ ] Add Slack channel iteration
- [ ] Add time-window chunking
- [ ] Test each indexer with small subset

### Phase 4: Server Integration
- [ ] Add Bun.sql PostgreSQL connection
- [ ] Update /semantic endpoint for pgvector
- [ ] Update /hybrid endpoint
- [ ] Add speaker search capability
- [ ] Add /email/search endpoint (by sender, date, label)
- [ ] Add /slack/search endpoint (by channel, user, date)
- [ ] Add /communications/search unified endpoint
- [ ] Add /pg/status endpoint
- [ ] Update /stats with all sources info
- [ ] Test all endpoints

### Phase 5: Full Indexing Run
- [ ] Backup existing embeddings.db
- [ ] Run pgvector-indexer.ts (83K files)
- [ ] Run email-indexer.ts (~70K emails)
- [ ] Run slack-indexer.ts (423 channels)
- [ ] Monitor progress and resource usage
- [ ] Verify chunk counts match expectations

### Phase 6: Verification & Cleanup
- [ ] Semantic search returns relevant file results
- [ ] "resignation" query finds resignation transcript
- [ ] Email search finds emails by subject/sender
- [ ] Slack search finds conversations by channel/user
- [ ] Speaker search works correctly
- [ ] Hybrid search combines FTS and semantic
- [ ] Performance meets <100ms target
- [ ] No duplicate signature issues
- [ ] Remove sqlite-vec dependencies
- [ ] Update CLAUDE.md documentation
- [ ] Archive old embeddings.db

### Estimated Indexing Time
| Source | Items | Est. Time | Notes |
|--------|-------|-----------|-------|
| Files | 83K | ~4 hours | Smart chunking = more chunks |
| Emails | 70K | ~3 hours | Most are single-chunk |
| Slack | 18K+ days | ~2 hours | Time-window grouping |
| **Total** | | **~9 hours** | Run in parallel possible |

---

## File Structure

After implementation:

```
/Volumes/VRAM/00-09_System/01_Tools/search_engine/
├── package.json
├── tsconfig.json
├── server.ts              # Updated with pgvector + communications
├── indexer.ts             # Existing FTS indexer
│
├── # Chunking Modules
├── smart-chunker.ts       # NEW: Transcript/document chunking
├── email-chunker.ts       # NEW: Email-specific chunking
├── slack-chunker.ts       # NEW: Slack conversation chunking
│
├── # Embedding Indexers
├── pgvector-indexer.ts    # NEW: File embeddings to PostgreSQL
├── email-indexer.ts       # NEW: Email embeddings to PostgreSQL
├── slack-indexer.ts       # NEW: Slack embeddings to PostgreSQL
│
├── # Utilities
├── pg-client.ts           # NEW: PostgreSQL client utilities
├── hybrid-search.ts       # NEW: Combined FTS + semantic search
├── qwen3vl-client.ts      # Existing Qwen3-VL embedding client (port 8081)
│
├── # Existing Tools
├── watcher.ts             # Existing file watcher
├── cli.ts                 # Existing CLI
├── index.html             # Updated with search options
│
├── schema/
│   └── pgvector-schema.sql # NEW: Full PostgreSQL schema
│
└── docs/
    └── plans/
        └── 4-pgvector-migration.md  # This plan

/Volumes/VRAM/00-09_System/00_Index/
├── search.db              # SQLite FTS database (unchanged)
└── embeddings.db          # DEPRECATED - will be archived

/Volumes/VRAM/10-19_Work/14_Communications/
├── 14.01b_emails_json/    # Source: ~70K emails (2020-2025)
│   ├── 2020/
│   ├── 2021/
│   ├── 2022/
│   ├── 2023/
│   ├── 2024/
│   └── 2025/
└── 14.02_slack/
    └── json/              # Source: 423 channels
        ├── channel-1/
        │   ├── 2022-01-01.json
        │   └── ...
        └── channel-n/
```

---

## References

- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [Bun.sql Documentation](https://bun.com/docs/runtime/sql)
- [postgres.js](https://github.com/porsager/postgres)
- [HNSW Algorithm Paper](https://arxiv.org/abs/1603.09320)
- [Chunking Strategies for RAG (Stack Overflow)](https://stackoverflow.blog/2024/12/27/breaking-up-is-hard-to-do-chunking-in-rag-applications/)
- [Chunking Best Practices (Weaviate)](https://weaviate.io/blog/chunking-strategies-for-rag)
- [pgvector Performance Guide (Timescale)](https://www.timescale.com/blog/postgresql-as-a-vector-database-create-store-and-query-openai-embeddings-with-pgvector)

---

*Created: 2026-01-15*
