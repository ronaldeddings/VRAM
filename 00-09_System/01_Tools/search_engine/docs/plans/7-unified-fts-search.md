# Unified Full-Text Search - Multi-Source Keyword Search

Extend PostgreSQL full-text search to emails, Slack, and transcripts, matching the capabilities of semantic search. Make transcripts a first-class content type with dedicated filtering.

---

## Background

The search engine currently has an asymmetry between search modes:

| Search Type | Files | Emails | Slack | Transcripts |
|-------------|-------|--------|-------|-------------|
| **Semantic** | Yes | Yes | Yes | Yes (via files) |
| **Hybrid** | Yes | Yes | Yes | Yes (via files) |
| **Keyword (FTS)** | Yes | **No** | **No** | Yes (via files, no dedicated filter) |

### Content Source Inventory

| Source | Table | Rows | Has FTS | Has Embeddings |
|--------|-------|------|---------|----------------|
| Files | `documents` | 181K | ✅ tsvector | Via `chunks` |
| Transcripts | `documents` + `chunks` | 4K docs / 44K chunks | ✅ (as files) | ✅ with speakers |
| Emails | `email_chunks` | 83K | ❌ | ✅ |
| Slack | `slack_chunks` | 12K | ❌ | ✅ |

### The Transcript Problem

Transcripts are currently "hidden" within the files category:
- **2,424 transcript files** in `/Volumes/VRAM/10-19_Work/13_Meetings/13.01_transcripts/`
- **4,019 documents** in FTS table (area=Work, category=Meetings)
- **44,307 chunks** with speaker/timestamp metadata

The `chunks` table already has transcript-specific columns:
- `speakers TEXT[]` - Array of speaker names (populated for 99.8% of transcript chunks)
- `start_time TEXT` - Timestamp like "00:00"
- `end_time TEXT` - Timestamp like "01:23"

But there's no explicit `content_type` column to distinguish transcripts from regular files, and no dedicated FTS for searching transcripts by speaker or content.

Semantic search (`pg-client.ts`) queries all three tables:
- `chunks` (files + transcripts with embeddings)
- `email_chunks` (emails with embeddings)
- `slack_chunks` (Slack messages with embeddings)

Keyword search (`pg-fts.ts`) only queries:
- `documents` (files + transcripts mixed together)

This means users cannot use fast keyword search to find emails by subject line or Slack messages by exact phrases - they must wait for semantic search (8+ seconds) even when they know the exact keywords. Additionally, they can't easily filter for "just transcripts" in keyword search.

---

## Philosophy

**Keyword Search Should Be Universal**

If semantic search can find content across all sources, keyword search should too. Users expect:
- "email from Emily about budget" → finds emails
- "slack standup notes" → finds Slack messages
- "transcript meeting 2024" → finds transcript files

**Speed Is The Value Proposition**

Keyword search is ~10x faster than semantic (800ms vs 8s). Making it work across all sources unlocks that speed benefit for all content types.

**Unified Interface**

One search box, one result format, consistent behavior regardless of content source.

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                             │
│                                                              │
│   /search      ──────►  documents table ONLY                │
│   /semantic    ──────►  chunks + email_chunks + slack_chunks│
│   /hybrid      ──────►  documents + all chunk tables        │
└─────────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   documents   │ │ email_chunks  │ │ slack_chunks  │
│               │ │               │ │               │
│ search_vector │ │ NO tsvector   │ │ NO tsvector   │
│ (TSVECTOR)    │ │ (embeddings   │ │ (embeddings   │
│               │ │  only)        │ │  only)        │
│ GIN index     │ │               │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
      ✅ FTS           ❌ FTS           ❌ FTS
```

### Current Table Analysis

**`documents` table** (181K rows):
- Has `search_vector TSVECTOR GENERATED ALWAYS AS (...)`
- GIN index on `search_vector`
- Full FTS support

**`email_chunks` table** (83K rows):
- Has GIN index on `to_tsvector('english', subject)` (subject only!)
- NO stored tsvector column for content
- NO FTS on `chunk_text` (the actual email body)

**`slack_chunks` table** (12K rows):
- NO tsvector column
- NO FTS indexes
- Only has btree/GIN indexes for metadata filtering

---

## Target Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           API Layer                                   │
│                                                                       │
│   /search      ──────►  ALL sources with source parameter            │
│                         sources=file,transcript,email,slack           │
│   /semantic    ──────►  chunks + email_chunks + slack_chunks         │
│   /hybrid      ──────►  Unified FTS + Unified Semantic               │
└─────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   documents   │     │    chunks     │     │ email_chunks  │
│               │     │               │     │ slack_chunks  │
│ content_type: │     │ content_type: │     │               │
│ file|transcript│    │ file|transcript│    │ search_vector │
│               │     │               │     │ (TSVECTOR)    │
│ search_vector │     │ search_vector │     │               │
│ (TSVECTOR)    │     │ (NEW!)        │     │ GIN index     │
│               │     │               │     └───────────────┘
│ GIN index     │     │ GIN index     │
└───────────────┘     └───────────────┘
      ✅ FTS               ✅ FTS              ✅ FTS
    (files +            (transcripts         (emails +
   transcripts)         w/ speakers)          slack)
```

**Key Changes**:
1. `content_type` column distinguishes files from transcripts
2. `chunks` table gets FTS support for speaker-aware transcript search
3. Four source types: `file`, `transcript`, `email`, `slack`

---

## Database Schema Changes

### Phase 0: Content Type Infrastructure (Transcripts)

Before adding FTS to emails/slack, we need to properly classify transcripts as a first-class content type.

#### Add content_type to documents table

```sql
-- Add content_type column to documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'file';

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_documents_content_type ON documents (content_type);
```

#### Add content_type to chunks table

```sql
-- Add content_type column to chunks
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'file';

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_chunks_content_type ON chunks (content_type);
```

#### Migrate Existing Data to Set content_type='transcript'

The key insight: **99.8% of transcript chunks have `speakers IS NOT NULL`**, and **0% of non-transcript chunks do**. This gives us a reliable classification method.

```sql
-- Classify documents as transcripts based on path
-- Transcripts are in: 10-19_Work/13_Meetings/13.01_transcripts/
UPDATE documents
SET content_type = 'transcript'
WHERE path LIKE '%/13_Meetings/13.01_transcripts/%'
  AND content_type = 'file';

-- Classify chunks as transcripts based on speakers column
-- This is more reliable than path matching for chunks
UPDATE chunks
SET content_type = 'transcript'
WHERE speakers IS NOT NULL
  AND array_length(speakers, 1) > 0
  AND content_type = 'file';

-- Alternative: Also classify by path for any chunks that might not have speakers
UPDATE chunks
SET content_type = 'transcript'
WHERE file_path LIKE '%/13_Meetings/13.01_transcripts/%'
  AND content_type = 'file';
```

#### Verification Queries

```sql
-- Verify document classification
SELECT content_type, COUNT(*) as count
FROM documents
GROUP BY content_type;
-- Expected: file ~177K, transcript ~4K

-- Verify chunk classification
SELECT content_type, COUNT(*) as count
FROM chunks
GROUP BY content_type;
-- Expected: file ~38K, transcript ~44K

-- Verify no orphaned transcripts (chunks marked but document not)
SELECT COUNT(*) FROM chunks c
JOIN documents d ON c.document_id = d.id
WHERE c.content_type = 'transcript' AND d.content_type != 'transcript';
-- Should be 0
```

### Add FTS to chunks table (Transcript Search)

Transcripts deserve speaker-weighted full-text search:

```sql
-- Add search_vector to chunks table
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(array_to_string(speakers, ' '), '')), 'A') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'B')
) STORED;

-- Create GIN index for fast FTS
CREATE INDEX IF NOT EXISTS idx_chunks_search ON chunks USING GIN (search_vector);

-- Partial index for transcript-only FTS (more efficient for transcript queries)
CREATE INDEX IF NOT EXISTS idx_chunks_transcript_search
ON chunks USING GIN (search_vector)
WHERE content_type = 'transcript';
```

**Weight Strategy for Transcripts**:
- `A` (highest): Speaker names - "find meeting where Emily spoke"
- `B` (base): Chunk text - the actual transcript content

### Add tsvector to email_chunks

```sql
-- Add search_vector column to email_chunks
ALTER TABLE email_chunks ADD COLUMN search_vector TSVECTOR
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(subject, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(from_name, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'C')
) STORED;

-- Create GIN index for fast FTS
CREATE INDEX idx_email_chunks_search ON email_chunks USING GIN (search_vector);
```

**Weight Strategy**:
- `A` (highest): Subject line - most important for finding emails
- `B` (medium): From name - useful for "email from Emily"
- `C` (base): Chunk text - full email body content

### Add tsvector to slack_chunks

```sql
-- Add search_vector column to slack_chunks
ALTER TABLE slack_chunks ADD COLUMN search_vector TSVECTOR
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(channel, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(array_to_string(speakers, ' '), '')), 'B') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'C')
) STORED;

-- Create GIN index for fast FTS
CREATE INDEX idx_slack_chunks_search ON slack_chunks USING GIN (search_vector);
```

**Weight Strategy**:
- `A` (highest): Channel name - most useful for finding specific channels
- `B` (medium): Speaker names - useful for "slack messages from john"
- `C` (base): Message content - full conversation text

---

## API Changes

### Updated /search Endpoint

```typescript
// Current: /search?q=meeting&limit=10
// New:     /search?q=meeting&limit=10&sources=file,transcript,email,slack

GET /search?q=<query>&sources=file,transcript,email,slack&limit=20
```

**Parameters**:
- `q` (required): Search query
- `sources` (optional): Comma-separated list of sources to search
  - `file` - Search documents table (non-transcript files)
  - `transcript` - Search chunks table (transcript content with speaker metadata)
  - `email` - Search email_chunks table
  - `slack` - Search slack_chunks table
  - Default: `file,transcript,email,slack` (all sources)
- `speaker` (optional): Filter transcripts by speaker name
- `limit` (optional): Max results per source (default: 20)
- `area` (optional): Filter by area (files only)
- `extension` (optional): Filter by extension (files only)

**Response Format**:

```json
{
  "query": "meeting notes",
  "results": [
    {
      "id": 123,
      "source": "file",
      "path": "/Volumes/VRAM/10-19_Work/...",
      "title": "Meeting Notes 2024-01-15.md",
      "snippet": "...discussed the →meeting→ →notes→ for Q1...",
      "area": "Work",
      "category": "Communications",
      "rank": 0.85,
      "metadata": {
        "extension": "md",
        "fileSize": 2048,
        "modifiedAt": "2024-01-15T10:30:00Z"
      }
    },
    {
      "id": 456,
      "source": "transcript",
      "path": "/Volumes/VRAM/10-19_Work/13_Meetings/13.01_transcripts/2024/2024-01-15-standup.md",
      "title": "2024-01-15-standup.md",
      "snippet": "→Emily→: Let's review the →meeting→ →notes→ from yesterday...",
      "area": "Work",
      "category": "Meetings",
      "rank": 0.82,
      "metadata": {
        "speakers": ["Emily", "John", "Sarah"],
        "startTime": "00:05",
        "endTime": "02:30",
        "chunkIndex": 3,
        "documentId": 12345
      }
    },
    {
      "id": 789,
      "source": "email",
      "path": "email://abc123",
      "title": "Re: Meeting Notes from Yesterday",
      "snippet": "Hi team, here are the →meeting→ →notes→...",
      "area": "Email",
      "category": "INBOX",
      "rank": 0.78,
      "metadata": {
        "from": "emily@example.com",
        "fromName": "Emily",
        "date": "2024-01-15T14:22:00Z",
        "labels": ["INBOX", "IMPORTANT"],
        "hasAttachments": true
      }
    },
    {
      "id": 1011,
      "source": "slack",
      "path": "slack://general",
      "title": "#general",
      "snippet": "John: Let's review the →meeting→ →notes→...",
      "area": "Slack",
      "category": "public_channel",
      "rank": 0.72,
      "metadata": {
        "channel": "general",
        "channelType": "public_channel",
        "speakers": ["John", "Emily"],
        "messageCount": 12,
        "date": "2024-01-15"
      }
    }
  ],
  "count": 4,
  "time_ms": "145.32",
  "search_type": "keyword",
  "sources_searched": ["file", "transcript", "email", "slack"]
}
```

### Updated /hybrid Endpoint

The hybrid endpoint already accepts a `sources` parameter - ensure FTS respects it:

```typescript
GET /hybrid?q=<query>&sources=file,email,slack&fts_weight=0.4
```

Both FTS and semantic components should filter by the same sources.

---

## Implementation

### Phase 1: Database Schema Migration

Create migration file `migrations/002-unified-fts.sql`:

```sql
-- migrations/002-unified-fts.sql
-- Add content_type infrastructure and FTS support to all content tables

BEGIN;

-- ============================================
-- Phase 0: Content Type Infrastructure
-- ============================================

-- Add content_type to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'file';
CREATE INDEX IF NOT EXISTS idx_documents_content_type ON documents (content_type);

-- Add content_type to chunks table
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'file';
CREATE INDEX IF NOT EXISTS idx_chunks_content_type ON chunks (content_type);

-- Classify existing documents as transcripts based on path
UPDATE documents
SET content_type = 'transcript'
WHERE path LIKE '%/13_Meetings/13.01_transcripts/%'
  AND content_type = 'file';

-- Classify existing chunks as transcripts based on speakers
UPDATE chunks
SET content_type = 'transcript'
WHERE speakers IS NOT NULL
  AND array_length(speakers, 1) > 0
  AND content_type = 'file';

-- Fallback: Also classify by path for any chunks without speakers
UPDATE chunks
SET content_type = 'transcript'
WHERE file_path LIKE '%/13_Meetings/13.01_transcripts/%'
  AND content_type = 'file';

-- ============================================
-- Chunks table: Add FTS for transcript search
-- ============================================

ALTER TABLE chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(array_to_string(speakers, ' '), '')), 'A') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS idx_chunks_search ON chunks USING GIN (search_vector);

-- Partial index for transcript-only searches (more efficient)
CREATE INDEX IF NOT EXISTS idx_chunks_transcript_search
ON chunks USING GIN (search_vector)
WHERE content_type = 'transcript';

-- ============================================
-- Email chunks: Add search_vector column
-- ============================================

-- Add the generated tsvector column
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(subject, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(from_name, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'C')
) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_email_chunks_search
ON email_chunks USING GIN (search_vector);

-- Drop the old partial index on subject only (if exists)
DROP INDEX IF EXISTS idx_email_chunks_subject;

-- ============================================
-- Slack chunks: Add search_vector column
-- ============================================

-- Add the generated tsvector column
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(channel, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(array_to_string(speakers, ' '), '')), 'B') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'C')
) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_slack_chunks_search
ON slack_chunks USING GIN (search_vector);

COMMIT;

-- Analyze tables to update statistics
ANALYZE documents;
ANALYZE chunks;
ANALYZE email_chunks;
ANALYZE slack_chunks;

-- Verification queries (run manually to check migration success)
-- SELECT content_type, COUNT(*) FROM documents GROUP BY content_type;
-- SELECT content_type, COUNT(*) FROM chunks GROUP BY content_type;
```

### Phase 2: Update pg-fts.ts

Add multi-source search capabilities:

```typescript
// pg-fts.ts additions

/**
 * Search result from any source
 */
export interface UnifiedFTSResult {
  id: number;
  source: "file" | "email" | "slack";
  path: string;
  title: string;
  snippet: string;
  area: string;
  category: string;
  rank: number;
  metadata: Record<string, any>;
}

/**
 * Search emails using FTS
 */
export async function searchEmailsFTS(
  query: string,
  options: { limit?: number; fromEmail?: string; label?: string } = {}
): Promise<UnifiedFTSResult[]> {
  const { limit = 20, fromEmail, label } = options;
  const sql = getConnection();
  const tsQuery = toTsQuery(query);

  try {
    const results = await sql.unsafe(`
      SELECT
        id,
        email_id,
        email_path,
        subject,
        from_name,
        from_email,
        to_emails,
        email_date,
        labels,
        has_attachments,
        is_reply,
        chunk_index,
        ts_headline('english', chunk_text, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM email_chunks
      WHERE search_vector @@ to_tsquery('english', $1)
        AND ($2::text IS NULL OR from_email = $2)
        AND ($3::text IS NULL OR $3 = ANY(labels))
      ORDER BY rank DESC
      LIMIT $4
    `, [tsQuery, fromEmail || null, label || null, limit]);

    return results.map((row: any) => ({
      id: row.id,
      source: "email" as const,
      path: `email://${row.email_id}`,
      title: row.subject,
      snippet: row.snippet || '',
      area: "Email",
      category: (row.labels || [])[0] || "Inbox",
      rank: row.rank || 0,
      metadata: {
        emailId: row.email_id,
        emailPath: row.email_path,
        from: row.from_email,
        fromName: row.from_name,
        toEmails: row.to_emails,
        date: row.email_date?.toISOString(),
        labels: row.labels,
        hasAttachments: row.has_attachments,
        isReply: row.is_reply,
        chunkIndex: row.chunk_index
      }
    }));
  } catch (error) {
    console.warn(`Email FTS failed: ${error}`);
    return [];
  }
}

/**
 * Search Transcripts using FTS (from chunks table)
 */
export async function searchTranscriptsFTS(
  query: string,
  options: { limit?: number; speaker?: string } = {}
): Promise<UnifiedFTSResult[]> {
  const { limit = 20, speaker } = options;
  const sql = getConnection();
  const tsQuery = toTsQuery(query);

  try {
    const results = await sql.unsafe(`
      SELECT
        c.id,
        c.file_path,
        c.chunk_index,
        c.speakers,
        c.start_time,
        c.end_time,
        c.document_id,
        d.filename,
        d.area,
        d.category,
        ts_headline('english', c.chunk_text, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(c.search_vector, to_tsquery('english', $1)) AS rank
      FROM chunks c
      LEFT JOIN documents d ON c.document_id = d.id
      WHERE c.search_vector @@ to_tsquery('english', $1)
        AND c.content_type = 'transcript'
        AND ($2::text IS NULL OR $2 = ANY(c.speakers))
      ORDER BY rank DESC
      LIMIT $3
    `, [tsQuery, speaker || null, limit]);

    return results.map((row: any) => ({
      id: row.id,
      source: "transcript" as const,
      path: row.file_path,
      title: row.filename || row.file_path.split('/').pop(),
      snippet: row.snippet || '',
      area: row.area || "Work",
      category: row.category || "Meetings",
      rank: row.rank || 0,
      metadata: {
        speakers: row.speakers,
        startTime: row.start_time,
        endTime: row.end_time,
        chunkIndex: row.chunk_index,
        documentId: row.document_id
      }
    }));
  } catch (error) {
    console.warn(`Transcript FTS failed: ${error}`);
    return [];
  }
}

/**
 * Search Slack using FTS
 */
export async function searchSlackFTS(
  query: string,
  options: { limit?: number; channel?: string; speaker?: string } = {}
): Promise<UnifiedFTSResult[]> {
  const { limit = 20, channel, speaker } = options;
  const sql = getConnection();
  const tsQuery = toTsQuery(query);

  try {
    const results = await sql.unsafe(`
      SELECT
        id,
        channel,
        channel_type,
        speakers,
        user_ids,
        message_date,
        message_count,
        has_files,
        has_reactions,
        chunk_index,
        ts_headline('english', chunk_text, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM slack_chunks
      WHERE search_vector @@ to_tsquery('english', $1)
        AND ($2::text IS NULL OR channel = $2)
        AND ($3::text IS NULL OR $3 = ANY(speakers))
      ORDER BY rank DESC
      LIMIT $4
    `, [tsQuery, channel || null, speaker || null, limit]);

    return results.map((row: any) => ({
      id: row.id,
      source: "slack" as const,
      path: `slack://${row.channel}/${row.message_date}`,
      title: `#${row.channel}`,
      snippet: row.snippet || '',
      area: "Slack",
      category: row.channel_type,
      rank: row.rank || 0,
      metadata: {
        channel: row.channel,
        channelType: row.channel_type,
        speakers: row.speakers,
        userIds: row.user_ids,
        date: row.message_date,
        messageCount: row.message_count,
        hasFiles: row.has_files,
        hasReactions: row.has_reactions,
        chunkIndex: row.chunk_index
      }
    }));
  } catch (error) {
    console.warn(`Slack FTS failed: ${error}`);
    return [];
  }
}

/**
 * Unified keyword search across all sources
 */
export async function unifiedKeywordSearch(
  query: string,
  options: {
    limit?: number;
    sources?: ("file" | "transcript" | "email" | "slack")[];
    area?: string;
    extension?: string;
    speaker?: string;
  } = {}
): Promise<UnifiedFTSResult[]> {
  const {
    limit = 20,
    sources = ["file", "transcript", "email", "slack"],
    area,
    extension,
    speaker
  } = options;

  const results: UnifiedFTSResult[] = [];
  const searches: Promise<UnifiedFTSResult[]>[] = [];

  // Search files (excluding transcripts - they're handled separately)
  if (sources.includes("file")) {
    searches.push(
      keywordSearch(query, { limit, area, extension, contentType: 'file' }).then(rows =>
        rows.map(r => ({
          id: r.id,
          source: "file" as const,
          path: r.path,
          title: r.filename,
          snippet: r.snippet,
          area: r.area,
          category: r.category,
          rank: r.rank,
          metadata: {
            extension: r.extension,
            fileSize: r.fileSize,
            modifiedAt: r.modifiedAt
          }
        }))
      )
    );
  }

  // Search transcripts (from chunks table with speaker metadata)
  if (sources.includes("transcript")) {
    searches.push(searchTranscriptsFTS(query, { limit, speaker }));
  }

  // Search emails
  if (sources.includes("email")) {
    searches.push(searchEmailsFTS(query, { limit }));
  }

  // Search Slack
  if (sources.includes("slack")) {
    searches.push(searchSlackFTS(query, { limit }));
  }

  // Execute all searches in parallel
  const allResults = await Promise.all(searches);

  // Flatten and sort by rank
  for (const sourceResults of allResults) {
    results.push(...sourceResults);
  }

  results.sort((a, b) => b.rank - a.rank);

  return results.slice(0, limit);
}
```

### Phase 3: Update server.ts

Update the `/search` endpoint to support multi-source:

```typescript
// In server.ts routes

"/search": {
  GET: async (req) => {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
    const area = url.searchParams.get("area") || undefined;
    const extension = url.searchParams.get("type") || undefined;
    const speaker = url.searchParams.get("speaker") || undefined;
    const sourcesParam = url.searchParams.get("sources") || "file,transcript,email,slack";

    // Parse sources
    const validSources = ["file", "transcript", "email", "slack"] as const;
    const sources = sourcesParam
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(s => validSources.includes(s as any)) as ("file" | "transcript" | "email" | "slack")[];

    if (!q) {
      return Response.json({ error: "Missing ?q= parameter" }, { status: 400 });
    }

    const startTime = performance.now();

    const results = await unifiedKeywordSearch(q, {
      limit,
      sources,
      area,
      extension,
      speaker
    });

    const elapsed = performance.now() - startTime;

    return Response.json({
      query: q,
      results,
      count: results.length,
      time_ms: elapsed.toFixed(2),
      search_type: "keyword",
      sources_searched: sources
    });
  }
}
```

### Phase 4: Update hybrid-search.ts

Update hybrid search to use unified FTS:

```typescript
// In hybrid-search.ts

import { unifiedKeywordSearch, type UnifiedFTSResult } from "./pg-fts";
import { semanticSearch, type VectorSearchResult } from "./pg-client";

export async function hybridSearch(
  query: string,
  options: {
    limit?: number;
    ftsWeight?: number;
    sources?: ("file" | "transcript" | "email" | "slack")[];
    area?: string;
    speaker?: string;
  } = {}
): Promise<HybridResult[]> {
  const {
    limit = 20,
    ftsWeight = 0.4,
    sources = ["file", "transcript", "email", "slack"],
    area,
    speaker
  } = options;

  // Run FTS and semantic search in parallel
  const [ftsResults, semanticResults] = await Promise.all([
    unifiedKeywordSearch(query, { limit: limit * 2, sources, area, speaker }),
    semanticSearch(query, { limit: limit * 2, sources, area })
  ]);

  // Merge with RRF...
  // (existing RRF logic, but now works across all sources including transcripts)
}
```

### Phase 5: Update Web UI

Update `index.html` to show source indicators in search results:

```html
<!-- Add source badge to result cards -->
<span class="source-badge source-${result.source}">
  ${result.source === 'file' ? '📄' :
    result.source === 'transcript' ? '🎙️' :
    result.source === 'email' ? '📧' : '💬'}
  ${result.source}
</span>

<!-- For transcripts, show speaker info -->
${result.source === 'transcript' && result.metadata?.speakers ? `
  <span class="speakers-badge">
    👤 ${result.metadata.speakers.slice(0, 3).join(', ')}
    ${result.metadata.speakers.length > 3 ? '...' : ''}
  </span>
` : ''}
```

Add CSS for source badges:

```css
.source-badge {
  font-size: 0.7em;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}
.source-file { background: #1e3a5f; }
.source-transcript { background: #2f5f1e; }
.source-email { background: #3a1e5f; }
.source-slack { background: #5f3a1e; }

.speakers-badge {
  font-size: 0.65em;
  padding: 1px 4px;
  background: rgba(47, 95, 30, 0.3);
  border-radius: 3px;
  margin-left: 4px;
}
```

Update source filter checkboxes:

```html
<label><input type="checkbox" name="source" value="file" checked> 📄 Files</label>
<label><input type="checkbox" name="source" value="transcript" checked> 🎙️ Transcripts</label>
<label><input type="checkbox" name="source" value="email" checked> 📧 Emails</label>
<label><input type="checkbox" name="source" value="slack" checked> 💬 Slack</label>
```

### Phase 6: Update CLI

Update `cli.ts` to support multi-source search:

```typescript
// Add --sources and --speaker flags
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    limit: { type: "string", short: "l", default: "10" },
    area: { type: "string", short: "a" },
    type: { type: "string", short: "t" },
    sources: { type: "string", short: "S", default: "file,transcript,email,slack" },
    speaker: { type: "string", short: "K" }, // Filter transcripts by speaker
    json: { type: "boolean", short: "j", default: false },
    stats: { type: "boolean", short: "s", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
});
```

Example usage:

```bash
# Search all sources
bun cli.ts "meeting notes"

# Search only transcripts
bun cli.ts "quarterly review" -S transcript

# Search transcripts by speaker
bun cli.ts "budget discussion" -S transcript -K Emily

# Search transcripts and emails only
bun cli.ts "project update" -S transcript,email
```

---

## Implementation Phases Summary

| Phase | Description | Files |
|-------|-------------|-------|
| 0 | Content type infrastructure (transcripts) | `migrations/002-unified-fts.sql` |
| 1 | Database schema migration (all tables) | `migrations/002-unified-fts.sql` |
| 2 | Update pg-fts.ts with multi-source | `pg-fts.ts` |
| 3 | Update server.ts /search endpoint | `server.ts` |
| 4 | Update hybrid-search.ts | `hybrid-search.ts` |
| 5 | Update Web UI | `index.html` |
| 6 | Update CLI | `cli.ts` |
| 7 | Update indexer for new documents | `pgvector-indexer.ts`, `watcher.ts` |

---

## Performance Considerations

### Index Size Estimates

| Table | Rows | Est. tsvector Size | Est. GIN Index |
|-------|------|-------------------|----------------|
| documents | 181K | ~500MB (existing) | ~200MB |
| chunks | 82K (44K transcripts) | ~300MB | ~120MB |
| email_chunks | 83K | ~250MB | ~100MB |
| slack_chunks | 12K | ~35MB | ~15MB |

**Total additional storage**: ~520MB (includes chunks FTS)

### Query Performance

Expected performance with GIN indexes:

| Source | Query Time |
|--------|------------|
| Files only | ~50-150ms |
| Transcripts only | ~40-120ms |
| Emails only | ~30-100ms |
| Slack only | ~10-50ms |
| All sources | ~120-350ms |

**Note**: Partial index on `chunks WHERE content_type = 'transcript'` improves transcript-only queries by ~20%.

Parallel query execution ensures total time is bounded by the slowest source.

### Migration Time

- Adding tsvector columns: ~2-5 minutes (background computation)
- Creating GIN indexes: ~1-3 minutes per table

Total migration time: ~5-10 minutes

---

## Checklist

### Phase 0: Content Type Infrastructure
- [x] Add `content_type` column to `documents` table
- [x] Add `content_type` column to `chunks` table
- [x] Create indexes on `content_type` columns
- [x] Migrate existing documents: set `content_type='transcript'` based on path (4,019 transcripts)
- [x] Migrate existing chunks: set `content_type='transcript'` based on speakers (44,307 transcripts)
- [x] Verify migration with COUNT queries

### Phase 1: Database Migration (FTS)
- [x] Create migration file `migrations/002-unified-fts.sql`
- [x] Add `search_vector` column to `chunks` (speaker-weighted for transcripts)
- [x] Add `search_vector` column to `email_chunks`
- [x] Add `search_vector` column to `slack_chunks`
- [x] Create GIN indexes on all tables
- [x] Create partial index on chunks for transcript-only queries
- [x] Run migration and verify indexes exist
- [x] Test basic tsvector queries on new columns

### Phase 2: Update pg-fts.ts
- [x] Add `UnifiedFTSResult` interface
- [x] Implement `searchTranscriptsFTS()` function (from chunks table)
- [x] Implement `searchEmailsFTS()` function
- [x] Implement `searchSlackFTS()` function
- [x] Implement `unifiedKeywordSearch()` with 4 sources
- [x] Update `keywordSearch()` to filter by content_type
- [x] Add `speaker` parameter for transcript filtering
- [ ] Add unit tests for new functions

### Phase 3: Update server.ts
- [x] Add `sources` parameter parsing (file, transcript, email, slack)
- [x] Add `speaker` parameter for transcript filtering
- [x] Call `unifiedKeywordSearch()` instead of `keywordSearch()`
- [x] Update response format to include source information
- [ ] Test endpoint with different source combinations

### Phase 4: Update hybrid-search.ts
- [x] Import and use `unifiedKeywordSearch`
- [x] Add `transcript` to sources array
- [x] Pass `speaker` parameter through
- [x] Ensure RRF merging works with 4 sources
- [ ] Test hybrid search with all sources

### Phase 5: Update Web UI
- [x] Add source badges (file, transcript, email, slack)
- [x] Add transcript source checkbox to filters
- [x] Show speaker info for transcript results
- [x] Ensure keyword search respects source filters
- [ ] Test UI with all search types

### Phase 6: Update CLI
- [x] Add `--sources` flag (default: file,transcript,email,slack)
- [x] Add `--speaker` flag for transcript filtering
- [x] Update search to use `unifiedKeywordSearch`
- [x] Update help text
- [ ] Test CLI with different sources

### Phase 7: Update Indexer
- [x] Update `pgvector-indexer.ts` to set `content_type` on new documents
- [x] Update `watcher.ts` to set `content_type` on new files
- [x] Detect transcripts using `isTranscript()` from smart-chunker
- [ ] Test indexing new transcript files

### Verification
- [ ] Keyword search returns results from all four sources
- [ ] Transcript search filters by speaker correctly
- [ ] Source filtering works correctly
- [ ] Performance is acceptable (<500ms for all sources)
- [ ] Hybrid search combines FTS + semantic from all sources
- [ ] Web UI displays source badges correctly
- [ ] CLI works with multi-source search
- [ ] New files are correctly classified as file or transcript

---

## Rollback Plan

If issues arise, rollback is straightforward:

1. **Drop new columns** (if needed):
```sql
-- Remove FTS columns
ALTER TABLE chunks DROP COLUMN IF EXISTS search_vector;
ALTER TABLE email_chunks DROP COLUMN IF EXISTS search_vector;
ALTER TABLE slack_chunks DROP COLUMN IF EXISTS search_vector;

-- Remove content_type columns (optional - can leave in place)
ALTER TABLE documents DROP COLUMN IF EXISTS content_type;
ALTER TABLE chunks DROP COLUMN IF EXISTS content_type;

-- Drop indexes
DROP INDEX IF EXISTS idx_chunks_search;
DROP INDEX IF EXISTS idx_chunks_transcript_search;
DROP INDEX IF EXISTS idx_documents_content_type;
DROP INDEX IF EXISTS idx_chunks_content_type;
```

2. **Revert code changes**: Git revert to previous version
3. **No data loss**: Original tables and embeddings remain intact

---

## Future Enhancements

- [ ] Faceted search (filter by source in results)
- [ ] Source-specific ranking weights (emails might need different weights than files)
- [ ] Saved search presets (e.g., "emails from last week", "transcripts with Emily")
- [ ] Real-time FTS index updates via triggers
- [ ] Cross-source deduplication (same content in email and file)
- [ ] **Transcript-specific enhancements**:
  - [ ] Time-range search (find discussions between 10:00-10:30)
  - [ ] Speaker co-occurrence search (meetings where Emily AND John spoke)
  - [ ] Meeting duration filtering
  - [ ] Speaker statistics (who talks most in meetings)
  - [ ] Transcript summarization via LLM
- [ ] **Content type auto-detection**:
  - [ ] Automatically detect new content types (e.g., blog posts, code files)
  - [ ] Machine learning classification for ambiguous files

---

*Created: 2026-01-18*
