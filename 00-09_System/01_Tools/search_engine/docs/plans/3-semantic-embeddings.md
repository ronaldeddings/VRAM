# Semantic Embeddings Feature

Add vector embeddings for semantic search using sqlite-vec and ComfyUI's Qwen3-VL embedding model.

---

## Philosophy

**Semantic Beyond Keywords**
Full-text search (FTS5) excels at exact keyword matching. Semantic search finds conceptually similar content even when keywords differ. "budget planning" finds documents about "financial forecasting" because the meaning is related.

**Local-First AI**
Use ComfyUI running locally to generate embeddings. No external API calls, no data leaving your machine. The Qwen3-VL-Embedding-8B model produces 4096-dimensional vectors optimized for text similarity.

**Hybrid Search**
FTS5 for speed and precision, vectors for semantic relevance. Combine both for comprehensive results.

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Search Layer                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  Bun.serve() API                     │   │
│   │                                                      │   │
│   │   /search?q=          Full-text search (FTS5)       │   │
│   │   /file?path=         Retrieve file content         │   │
│   │   /browse/:area       List files in area            │   │
│   │   /stats              Index statistics              │   │
│   └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│   ┌───────────────────┴───────────────────┐                 │
│   │           bun:sqlite + FTS5            │                 │
│   │                                        │                 │
│   │   files table      File metadata       │                 │
│   │   files_fts        Full-text index     │ ← CURRENT      │
│   └────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Search Layer                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  Bun.serve() API                     │   │
│   │                                                      │   │
│   │   /search?q=          Full-text search (FTS5)       │   │
│   │   /semantic?q=        Semantic vector search (NEW)  │   │
│   │   /hybrid?q=          Combined FTS + vector (NEW)   │   │
│   │   /embed              Generate embedding (NEW)      │   │
│   │   /file?path=         Retrieve file content         │   │
│   │   /browse/:area       List files in area            │   │
│   │   /stats              Index statistics              │   │
│   └─────────────────────────────────────────────────────┘   │
│                       │                                      │
│   ┌───────────────────┴───────────────────┐                 │
│   │     bun:sqlite + FTS5 + sqlite-vec     │                 │
│   │                                        │                 │
│   │   files table        File metadata     │                 │
│   │   files_fts          Full-text index   │                 │
│   │   files_vec (NEW)    Vector embeddings │ ← NEW          │
│   └────────────────────────────────────────┘                 │
│                       │                                      │
│   ┌───────────────────┴───────────────────┐                 │
│   │         ComfyUI Integration (NEW)      │                 │
│   │                                        │                 │
│   │   WebSocket connection                 │                 │
│   │   Qwen3-VL-Embedding-8B workflow      │                 │
│   │   4096-dimensional vectors             │                 │
│   └────────────────────────────────────────┘                 │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                       Data Layer                             │
│                                                              │
│   /Volumes/VRAM/00-09_System/00_Index/                      │
│   ├── search.db          FTS5 database (existing)           │
│   └── embeddings.db      Vector database (NEW)              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Technical Approach

### sqlite-vec Extension

**Why sqlite-vec?**
- Pure C, no dependencies, runs anywhere
- SIMD-accelerated (AVX/NEON) for fast KNN queries
- Works with bun:sqlite via loadExtension
- Supports float32, int8, and binary vectors

**Installation**:
```bash
# Download pre-built binary for macOS ARM64
curl -L https://github.com/asg017/sqlite-vec/releases/download/v0.1.6/sqlite-vec-0.1.6-loadable-macos-aarch64.tar.gz | tar xz

# Place in project directory
mv vec0.dylib /Volumes/VRAM/00-09_System/01_Tools/search_engine/extensions/
```

**Vector Table Schema**:
```sql
-- Create virtual table for 4096-dimensional vectors
CREATE VIRTUAL TABLE files_vec USING vec0(
  file_id INTEGER PRIMARY KEY,
  embedding float[4096]
);
```

**KNN Query Pattern**:
```sql
SELECT
  files.path,
  files.filename,
  vec.distance
FROM files_vec AS vec
JOIN files ON vec.file_id = files.id
WHERE embedding MATCH $query_vector
ORDER BY distance
LIMIT 10;
```

### ComfyUI Integration

**Existing Workflow**: `Qwen3VL-TextEmbedding.json`
- Node: `WASQwen3VLEmbedding`
- Model: Qwen3-VL-Embedding-8B
- Dimensions: 4096
- Normalization: enabled

**API Workflow**:
1. Connect to ComfyUI WebSocket at `ws://127.0.0.1:8188/ws?clientId={uuid}`
2. POST workflow to `/prompt` endpoint
3. Monitor WebSocket for completion
4. GET results from `/history/{prompt_id}`
5. Parse `embedding_json` output

**ComfyUI Client**:
```typescript
// comfyui-client.ts
import { randomUUID } from "crypto";

const COMFYUI_URL = "http://127.0.0.1:8188";

interface EmbeddingResult {
  embedding: number[];
  dimensions: number;
}

export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const clientId = randomUUID();

  // Load workflow template
  const workflow = await Bun.file("./workflows/embedding-api.json").json();

  // Set input text
  workflow["1"].inputs.text = text;

  // Submit to ComfyUI
  const response = await fetch(`${COMFYUI_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: workflow,
      client_id: clientId
    })
  });

  const { prompt_id } = await response.json();

  // Poll for completion (or use WebSocket for real-time)
  let result;
  while (!result) {
    await Bun.sleep(100);
    const history = await fetch(`${COMFYUI_URL}/history/${prompt_id}`);
    const data = await history.json();
    if (data[prompt_id]?.outputs) {
      result = data[prompt_id].outputs;
    }
  }

  // Parse embedding from output
  const embeddingJson = result["1"].embedding_json[0];
  const embedding = JSON.parse(embeddingJson);

  return {
    embedding,
    dimensions: embedding.length
  };
}
```

### Embedding Strategy

**What to Embed**:
- File content (truncated to first 8K characters for large files)
- Filename and path for context
- Area and category metadata

**Chunking Strategy**:
For files >8K characters, create multiple embeddings with overlapping windows:
```
File content: [====================================]
Chunk 1:     [========]
Chunk 2:          [========]
Chunk 3:               [========]
```

**Batch Processing**:
Process files in batches to avoid overwhelming ComfyUI:
- Batch size: 10 files
- Delay between batches: 500ms
- Progress tracking with TodoWrite

---

## Database Schema

### New Embeddings Database

Location: `/Volumes/VRAM/00-09_System/00_Index/embeddings.db`

```sql
-- Load sqlite-vec extension
.load ./extensions/vec0

-- Embedding metadata
CREATE TABLE embedding_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id INTEGER NOT NULL,          -- References files.id in search.db
  file_path TEXT NOT NULL,           -- Denormalized for fast lookup
  chunk_index INTEGER DEFAULT 0,     -- For multi-chunk files
  chunk_text TEXT,                   -- The text that was embedded
  model_name TEXT DEFAULT 'qwen3-vl-embedding-8b',
  dimensions INTEGER DEFAULT 4096,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(file_path, chunk_index)
);

-- Vector storage (sqlite-vec virtual table)
CREATE VIRTUAL TABLE file_embeddings USING vec0(
  embedding_id INTEGER PRIMARY KEY,  -- References embedding_metadata.id
  embedding float[4096]
);

-- Index for fast file lookups
CREATE INDEX idx_embedding_file_path ON embedding_metadata(file_path);
CREATE INDEX idx_embedding_file_id ON embedding_metadata(file_id);
```

### Integration with Existing Database

Keep embeddings separate from `search.db` for:
- Independent scaling
- Easier rebuilds
- No impact on FTS performance

Cross-database queries via ATTACH:
```sql
ATTACH DATABASE '/Volumes/VRAM/00-09_System/00_Index/embeddings.db' AS emb;

SELECT f.path, f.filename, e.distance
FROM emb.file_embeddings AS e
JOIN emb.embedding_metadata AS m ON e.embedding_id = m.id
JOIN files AS f ON m.file_id = f.id
WHERE e.embedding MATCH $query_vector
ORDER BY e.distance
LIMIT 10;
```

---

## API Endpoints

### New Endpoints

**`GET /semantic?q=<query>&limit=10`**
Semantic-only search using vector similarity.

```typescript
"/semantic": {
  GET: async (req) => {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!q) {
      return Response.json({ error: "Missing ?q= parameter" }, { status: 400 });
    }

    // Generate embedding for query
    const { embedding } = await generateEmbedding(q);

    // KNN search
    const results = semanticSearch.all({
      $query_vector: JSON.stringify(embedding),
      $limit: limit
    });

    return Response.json({
      query: q,
      results,
      count: results.length,
      search_type: "semantic"
    });
  }
}
```

**`GET /hybrid?q=<query>&limit=10&fts_weight=0.5`**
Combined FTS5 + semantic search with configurable weighting.

```typescript
"/hybrid": {
  GET: async (req) => {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const ftsWeight = parseFloat(url.searchParams.get("fts_weight") || "0.5");

    // Run both searches in parallel
    const [ftsResults, semanticResults] = await Promise.all([
      ftsSearch(q, limit * 2),
      semanticSearch(q, limit * 2)
    ]);

    // Merge and rank results
    const merged = mergeResults(ftsResults, semanticResults, ftsWeight);

    return Response.json({
      query: q,
      results: merged.slice(0, limit),
      count: merged.length,
      search_type: "hybrid",
      weights: { fts: ftsWeight, semantic: 1 - ftsWeight }
    });
  }
}
```

**`POST /embed`**
Generate embedding for arbitrary text.

```typescript
"/embed": {
  POST: async (req) => {
    const { text } = await req.json();

    if (!text) {
      return Response.json({ error: "Missing text field" }, { status: 400 });
    }

    const result = await generateEmbedding(text);

    return Response.json({
      text: text.substring(0, 100) + "...",
      dimensions: result.dimensions,
      embedding: result.embedding
    });
  }
}
```

### Updated Stats Endpoint

```typescript
"/stats": () => {
  const stats = getStats.get();
  const embStats = getEmbeddingStats.get();

  return Response.json({
    ...stats,
    embeddings: {
      total_embeddings: embStats.count,
      files_with_embeddings: embStats.file_count,
      model: "qwen3-vl-embedding-8b",
      dimensions: 4096
    }
  });
}
```

---

## Implementation

### Phase 1: Infrastructure Setup

**1.1 Download sqlite-vec extension**
```bash
mkdir -p /Volumes/VRAM/00-09_System/01_Tools/search_engine/extensions
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine/extensions

# Download for macOS ARM64
curl -L -o sqlite-vec.tar.gz \
  https://github.com/asg017/sqlite-vec/releases/download/v0.1.6/sqlite-vec-0.1.6-loadable-macos-aarch64.tar.gz
tar xzf sqlite-vec.tar.gz
rm sqlite-vec.tar.gz
```

**1.2 Create embeddings database**
```typescript
// init-embeddings-db.ts
import { Database } from "bun:sqlite";

const EXTENSIONS_PATH = "./extensions/vec0.dylib";
const DB_PATH = "/Volumes/VRAM/00-09_System/00_Index/embeddings.db";

const db = new Database(DB_PATH);
db.run("PRAGMA journal_mode = WAL;");

// Load sqlite-vec extension
db.loadExtension(EXTENSIONS_PATH);

// Create tables
db.run(`
  CREATE TABLE IF NOT EXISTS embedding_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_id INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    chunk_index INTEGER DEFAULT 0,
    chunk_text TEXT,
    model_name TEXT DEFAULT 'qwen3-vl-embedding-8b',
    dimensions INTEGER DEFAULT 4096,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(file_path, chunk_index)
  )
`);

db.run(`CREATE INDEX IF NOT EXISTS idx_embedding_file_path ON embedding_metadata(file_path)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_embedding_file_id ON embedding_metadata(file_id)`);

// Create vector table
db.run(`
  CREATE VIRTUAL TABLE IF NOT EXISTS file_embeddings USING vec0(
    embedding_id INTEGER PRIMARY KEY,
    embedding float[4096]
  )
`);

console.log("Embeddings database initialized at", DB_PATH);
db.close();
```

**1.3 Create API format workflow**
Convert the existing workflow to API format and save:
```bash
cp /Users/ronaldeddings/ComfyUI/user/default/workflows/Qwen3VL-TextEmbedding.json \
   /Volumes/VRAM/00-09_System/01_Tools/search_engine/workflows/embedding-api.json
```

### Phase 2: ComfyUI Client

**2.1 Create ComfyUI client module**
```typescript
// comfyui-client.ts
import { randomUUID } from "crypto";

const COMFYUI_URL = process.env.COMFYUI_URL || "http://127.0.0.1:8188";
const WORKFLOW_PATH = "./workflows/embedding-api.json";

interface EmbeddingResult {
  embedding: number[];
  dimensions: number;
  model_info: string;
}

interface ComfyUIStatus {
  connected: boolean;
  queue_remaining: number;
}

export async function checkComfyUI(): Promise<ComfyUIStatus> {
  try {
    const response = await fetch(`${COMFYUI_URL}/system_stats`);
    const data = await response.json();
    return {
      connected: true,
      queue_remaining: data.execInfo?.queue_remaining || 0
    };
  } catch {
    return { connected: false, queue_remaining: 0 };
  }
}

export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const clientId = randomUUID();

  // Load workflow template
  const workflowFile = Bun.file(WORKFLOW_PATH);
  const workflow = await workflowFile.json();

  // Set input parameters
  workflow["1"].inputs.text = text;
  workflow["1"].inputs.normalize = true;
  workflow["1"].inputs.output_dim = 4096;

  // Submit to ComfyUI
  const submitResponse = await fetch(`${COMFYUI_URL}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: workflow,
      client_id: clientId
    })
  });

  if (!submitResponse.ok) {
    throw new Error(`ComfyUI submit failed: ${submitResponse.status}`);
  }

  const { prompt_id } = await submitResponse.json();

  // Poll for completion
  const maxWait = 30000; // 30 seconds
  const pollInterval = 100;
  let elapsed = 0;

  while (elapsed < maxWait) {
    await Bun.sleep(pollInterval);
    elapsed += pollInterval;

    const historyResponse = await fetch(`${COMFYUI_URL}/history/${prompt_id}`);
    const history = await historyResponse.json();

    if (history[prompt_id]?.outputs) {
      const outputs = history[prompt_id].outputs;

      // Parse embedding from node 1 output
      if (outputs["1"]?.embedding_json) {
        const embeddingJson = outputs["1"].embedding_json[0];
        const embedding = JSON.parse(embeddingJson);

        return {
          embedding,
          dimensions: embedding.length,
          model_info: outputs["1"].model_info?.[0] || "qwen3-vl-embedding-8b"
        };
      }
    }
  }

  throw new Error("ComfyUI embedding generation timed out");
}

export async function generateEmbeddingsBatch(
  texts: string[],
  onProgress?: (current: number, total: number) => void
): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];

  for (let i = 0; i < texts.length; i++) {
    const result = await generateEmbedding(texts[i]);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, texts.length);
    }

    // Small delay between requests
    if (i < texts.length - 1) {
      await Bun.sleep(100);
    }
  }

  return results;
}
```

### Phase 3: Embedding Indexer

**3.1 Create embedding indexer**
```typescript
// embedding-indexer.ts
import { Database } from "bun:sqlite";
import { generateEmbedding, checkComfyUI } from "./comfyui-client";

const SEARCH_DB = "/Volumes/VRAM/00-09_System/00_Index/search.db";
const EMB_DB = "/Volumes/VRAM/00-09_System/00_Index/embeddings.db";
const EXTENSIONS_PATH = "./extensions/vec0.dylib";

const MAX_CHUNK_SIZE = 8000; // Characters
const CHUNK_OVERLAP = 500;
const BATCH_SIZE = 10;

// Open databases
const searchDb = new Database(SEARCH_DB, { readonly: true });
const embDb = new Database(EMB_DB);
embDb.loadExtension(EXTENSIONS_PATH);
embDb.run("PRAGMA journal_mode = WAL;");

// Prepared statements
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

const checkEmbeddingExists = embDb.prepare(`
  SELECT id FROM embedding_metadata WHERE file_path = $path AND chunk_index = $chunk
`);

const insertMetadata = embDb.prepare(`
  INSERT OR REPLACE INTO embedding_metadata
    (file_id, file_path, chunk_index, chunk_text, dimensions)
  VALUES ($file_id, $file_path, $chunk_index, $chunk_text, $dimensions)
`);

const insertEmbedding = embDb.prepare(`
  INSERT INTO file_embeddings (embedding_id, embedding)
  VALUES ($id, $embedding)
`);

function chunkText(text: string): string[] {
  if (text.length <= MAX_CHUNK_SIZE) {
    return [text];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + MAX_CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end));
    start = end - CHUNK_OVERLAP;

    if (start >= text.length - CHUNK_OVERLAP) break;
  }

  return chunks;
}

async function indexFile(file: any): Promise<number> {
  const chunks = chunkText(file.content || "");
  let indexed = 0;

  for (let i = 0; i < chunks.length; i++) {
    // Skip if already indexed
    const existing = checkEmbeddingExists.get({ $path: file.path, $chunk: i });
    if (existing) continue;

    // Prepare text for embedding (include metadata for context)
    const textToEmbed = [
      `File: ${file.filename}`,
      `Area: ${file.area}`,
      `Category: ${file.category}`,
      "",
      chunks[i]
    ].join("\n");

    try {
      const { embedding, dimensions } = await generateEmbedding(textToEmbed);

      // Insert metadata
      const metaResult = insertMetadata.run({
        $file_id: file.id,
        $file_path: file.path,
        $chunk_index: i,
        $chunk_text: chunks[i].substring(0, 500), // Store first 500 chars for preview
        $dimensions: dimensions
      });

      // Insert vector
      insertEmbedding.run({
        $id: metaResult.lastInsertRowid,
        $embedding: JSON.stringify(embedding)
      });

      indexed++;
    } catch (err) {
      console.error(`Error embedding ${file.path} chunk ${i}:`, err);
    }
  }

  return indexed;
}

async function main() {
  // Check ComfyUI connection
  const status = await checkComfyUI();
  if (!status.connected) {
    console.error("ComfyUI not available. Please start ComfyUI first.");
    process.exit(1);
  }

  console.log("ComfyUI connected. Starting embedding indexer...\n");

  const { count: totalFiles } = getFileCount.get() as { count: number };
  console.log(`Found ${totalFiles} text files to process.\n`);

  let processed = 0;
  let totalEmbeddings = 0;
  let offset = 0;

  while (offset < totalFiles) {
    const files = getFiles.all({ $limit: BATCH_SIZE, $offset: offset }) as any[];

    for (const file of files) {
      const embeddings = await indexFile(file);
      totalEmbeddings += embeddings;
      processed++;

      if (embeddings > 0) {
        console.log(`[${processed}/${totalFiles}] ${file.filename}: ${embeddings} embeddings`);
      }
    }

    offset += BATCH_SIZE;

    // Small delay between batches
    if (offset < totalFiles) {
      await Bun.sleep(500);
    }
  }

  console.log(`\nComplete! Processed ${processed} files, created ${totalEmbeddings} embeddings.`);

  searchDb.close();
  embDb.close();
}

main();
```

### Phase 4: Server Integration

**4.1 Update server.ts with semantic endpoints**

Add to existing server.ts:

```typescript
// Add at top with other imports
import { generateEmbedding, checkComfyUI } from "./comfyui-client";

// Additional database setup
const EMB_DB = "/Volumes/VRAM/00-09_System/00_Index/embeddings.db";
const embDb = new Database(EMB_DB);
embDb.loadExtension("./extensions/vec0.dylib");

// Prepared queries for semantic search
const semanticSearch = embDb.prepare(`
  SELECT
    m.file_path,
    m.chunk_text,
    e.distance
  FROM file_embeddings AS e
  JOIN embedding_metadata AS m ON e.embedding_id = m.id
  WHERE e.embedding MATCH $query_vector
  ORDER BY e.distance
  LIMIT $limit
`);

const getEmbeddingStats = embDb.prepare(`
  SELECT
    COUNT(*) as count,
    COUNT(DISTINCT file_path) as file_count
  FROM embedding_metadata
`);

// Add new routes
const additionalRoutes = {
  "/semantic": {
    GET: async (req) => {
      const url = new URL(req.url);
      const q = url.searchParams.get("q");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);

      if (!q) {
        return jsonResponse({ error: "Missing ?q= parameter" }, 400);
      }

      const startTime = performance.now();

      try {
        // Generate embedding for query
        const { embedding } = await generateEmbedding(q);

        // Perform KNN search
        const results = semanticSearch.all({
          $query_vector: JSON.stringify(embedding),
          $limit: limit
        });

        // Enrich with file metadata from search.db
        const enrichedResults = results.map((r: any) => {
          const file = getFile.get({ $path: r.file_path });
          return {
            path: r.file_path,
            filename: file?.filename,
            area: file?.area,
            category: file?.category,
            snippet: r.chunk_text,
            distance: r.distance
          };
        });

        const elapsed = performance.now() - startTime;

        return jsonResponse({
          query: q,
          results: enrichedResults,
          count: enrichedResults.length,
          time_ms: elapsed.toFixed(2),
          search_type: "semantic"
        });
      } catch (err) {
        return jsonResponse({
          error: "Semantic search failed",
          details: err.message
        }, 500);
      }
    }
  },

  "/hybrid": {
    GET: async (req) => {
      const url = new URL(req.url);
      const q = url.searchParams.get("q");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
      const ftsWeight = parseFloat(url.searchParams.get("fts_weight") || "0.5");

      if (!q) {
        return jsonResponse({ error: "Missing ?q= parameter" }, 400);
      }

      const startTime = performance.now();

      // Run FTS and semantic search in parallel
      const [ftsResults, semanticResults] = await Promise.all([
        Promise.resolve(searchFTS.all({ $query: q, $limit: limit * 2, $offset: 0 })),
        (async () => {
          const { embedding } = await generateEmbedding(q);
          return semanticSearch.all({
            $query_vector: JSON.stringify(embedding),
            $limit: limit * 2
          });
        })()
      ]);

      // Merge results with weighted scoring
      const scoreMap = new Map<string, { ftsScore: number; semanticScore: number }>();

      // Normalize FTS scores (rank is negative, lower is better)
      ftsResults.forEach((r: any, i: number) => {
        const normalizedScore = 1 - (i / ftsResults.length);
        scoreMap.set(r.path, {
          ftsScore: normalizedScore,
          semanticScore: 0
        });
      });

      // Normalize semantic scores (distance, lower is better)
      const maxDist = Math.max(...semanticResults.map((r: any) => r.distance)) || 1;
      semanticResults.forEach((r: any) => {
        const normalizedScore = 1 - (r.distance / maxDist);
        const existing = scoreMap.get(r.file_path);
        if (existing) {
          existing.semanticScore = normalizedScore;
        } else {
          scoreMap.set(r.file_path, {
            ftsScore: 0,
            semanticScore: normalizedScore
          });
        }
      });

      // Calculate combined scores and sort
      const combined = Array.from(scoreMap.entries())
        .map(([path, scores]) => ({
          path,
          combinedScore: (scores.ftsScore * ftsWeight) +
                        (scores.semanticScore * (1 - ftsWeight)),
          ftsScore: scores.ftsScore,
          semanticScore: scores.semanticScore
        }))
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit);

      // Enrich with file metadata
      const results = combined.map(r => {
        const file = getFile.get({ $path: r.path }) as any;
        return {
          path: r.path,
          filename: file?.filename,
          area: file?.area,
          category: file?.category,
          combined_score: r.combinedScore.toFixed(3),
          fts_score: r.ftsScore.toFixed(3),
          semantic_score: r.semanticScore.toFixed(3)
        };
      });

      const elapsed = performance.now() - startTime;

      return jsonResponse({
        query: q,
        results,
        count: results.length,
        time_ms: elapsed.toFixed(2),
        search_type: "hybrid",
        weights: { fts: ftsWeight, semantic: 1 - ftsWeight }
      });
    }
  },

  "/embed": {
    POST: async (req) => {
      try {
        const { text } = await req.json();

        if (!text) {
          return jsonResponse({ error: "Missing text field" }, 400);
        }

        const result = await generateEmbedding(text);

        return jsonResponse({
          text_preview: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          dimensions: result.dimensions,
          embedding: result.embedding
        });
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }
  },

  "/comfyui/status": async () => {
    const status = await checkComfyUI();
    return jsonResponse(status);
  }
};
```

### Phase 5: Web UI Integration

**5.1 Add semantic search toggle to index.html**

Add UI controls for:
- Search type selector (FTS / Semantic / Hybrid)
- FTS weight slider for hybrid mode
- Distance display for semantic results

---

## Implementation Checklist

### Phase 1: Infrastructure Setup
- [x] Download sqlite-vec extension for macOS ARM64
- [x] Create extensions directory in search_engine
- [x] Verify sqlite-vec loads in bun:sqlite (using sqlite-vec npm package + homebrew sqlite)
- [x] Create embeddings.db with schema
- [x] Convert ComfyUI workflow to API format

### Phase 2: ComfyUI Client
- [x] Create comfyui-client.ts module
- [x] Implement checkComfyUI() health check
- [x] Implement generateEmbedding() function
- [x] Implement batch embedding function
- [x] Test with sample text (ComfyUI at port 8000)

### Phase 3: Embedding Indexer
- [x] Create embedding-indexer.ts
- [x] Implement text chunking logic
- [x] Implement incremental indexing (skip existing)
- [x] Add progress reporting
- [x] Add parallel processing (4 concurrent embeddings)
- [x] Test with small file subset (37 files, 131 embeddings)
- [ ] Run full embedding index (83,265 files - optional, time-consuming)

### Phase 4: Server Integration
- [x] Add embDb connection to server.ts
- [x] Implement /semantic endpoint
- [x] Implement /hybrid endpoint
- [x] Implement /embed endpoint
- [x] Implement /comfyui/status endpoint
- [x] Update /stats with embedding info
- [x] Test all new endpoints (verified via Chrome MCP)

### Phase 5: Web UI Integration
- [x] Add search type selector
- [x] Add hybrid weight slider
- [x] Display semantic distance in results
- [x] Handle ComfyUI unavailable gracefully
- [x] Test UI with all search types (verified via Chrome MCP)

### Verification (All Passing ✅)
ComfyUI running at http://127.0.0.1:8000/
- [x] Semantic search finds conceptually similar content (10 results in 621ms)
- [x] Hybrid search combines FTS and semantic effectively (shows combined/FTS/semantic scores)
- [x] Performance acceptable (~620ms for semantic, ~240ms for hybrid)
- [x] Graceful degradation when ComfyUI offline (UI shows status indicator)
- [x] Embedding index survives server restart (persistent embeddings.db)

---

## File Structure

After implementation:

```
/Volumes/VRAM/00-09_System/01_Tools/search_engine/
├── package.json
├── tsconfig.json
├── server.ts              # Updated with semantic endpoints
├── indexer.ts             # Existing FTS indexer
├── embedding-indexer.ts   # NEW: Vector embedding indexer
├── comfyui-client.ts      # NEW: ComfyUI API client
├── init-embeddings-db.ts  # NEW: Database initialization
├── watcher.ts             # Existing file watcher
├── cli.ts                 # Existing CLI
├── index.html             # Updated with semantic UI
├── extensions/
│   └── vec0.dylib         # NEW: sqlite-vec extension
└── workflows/
    └── embedding-api.json # NEW: ComfyUI workflow (API format)

/Volumes/VRAM/00-09_System/00_Index/
├── search.db              # Existing FTS database
└── embeddings.db          # NEW: Vector embeddings database
```

---

## Performance Considerations

### Embedding Generation
- ~500ms per embedding with Qwen3-VL-8B
- Batch processing reduces overhead
- Consider GPU acceleration if available

### Vector Search
- sqlite-vec uses SIMD for fast brute-force KNN
- O(n) complexity for exact nearest neighbor
- Works well up to ~100K vectors
- For larger scale, consider ANN indexing

### Storage
- 4096 float32 dimensions = 16KB per vector
- 10,000 files ≈ 160MB of vector data
- Compression options available (int8, binary)

---

## Future Enhancements

- [ ] Incremental embedding updates in watcher.ts
- [ ] Multi-modal embeddings (images via Qwen3-VL)
- [ ] Embedding model selection
- [ ] Vector compression (int8 quantization)
- [ ] Approximate nearest neighbor indexing
- [ ] Semantic clustering visualization
- [ ] RAG integration for AI assistants

---

## References

- [sqlite-vec GitHub](https://github.com/asg017/sqlite-vec)
- [sqlite-vec v0.1.0 Release](https://alexgarcia.xyz/blog/2024/sqlite-vec-stable-release/index.html)
- [ComfyUI API Guide](https://9elements.com/blog/hosting-a-comfyui-workflow-via-api/)
- [Qwen3-VL Embedding Model](https://huggingface.co/Alibaba-NLP/gte-Qwen2-7B-instruct)

---

*Created: 2025-01-14*
