/**
 * VRAM Search API Server
 *
 * REST API for full-text and semantic search across VRAM content.
 * Uses SQLite FTS5 for keyword search and PostgreSQL pgvector for semantic search.
 * Embedding model: Qwen3-VL-Embedding-8B (4096 dimensions, port 8081)
 */

import { Database } from "bun:sqlite";
import { generateEmbedding, checkHealth } from "./qwen3vl-client";
import {
  semanticSearch,
  searchEmails,
  searchSlack,
  getVectorStats,
  getConnection,
  closeConnection,
  type VectorSearchResult
} from "./pg-client";
import {
  hybridSearch,
  keywordSearch,
  explainSearch,
  getFileMetadata,
  browseByArea,
  getFTSStats,
  closeFTSDb
} from "./hybrid-search";

const DB_PATH = "/Volumes/VRAM/00-09_System/00_Index/search.db";

// Open FTS database
const db = new Database(DB_PATH, { readonly: true });
db.run("PRAGMA journal_mode = WAL;");

// Check pgvector availability
let pgvectorAvailable = false;
try {
  const sql = getConnection();
  await sql`SELECT 1`;
  pgvectorAvailable = true;
  console.log("✅ PostgreSQL pgvector connected");
} catch (err) {
  console.warn("⚠️  PostgreSQL not available:", (err as Error).message);
  console.warn("   Semantic search will be disabled.");
}

// Check embedding server
let embeddingAvailable = false;
try {
  const health = await checkHealth();
  embeddingAvailable = true;
  console.log(`✅ Embedding server ready: ${health.model || "Qwen3-VL"}`);
} catch (err) {
  console.warn("⚠️  Embedding server not available on port 8081");
  console.warn("   Semantic search will be disabled.");
}

// Prepared queries for direct FTS search
const searchFTS = db.prepare(`
  SELECT
    files.path,
    files.filename,
    files.area,
    files.category,
    files.extension,
    files.file_size,
    files.modified_at,
    snippet(files_fts, 2, '→', '←', '...', 40) as snippet
  FROM files_fts
  JOIN files ON files_fts.rowid = files.id
  WHERE files_fts MATCH $query
  ORDER BY rank
  LIMIT $limit
  OFFSET $offset
`);

const searchFTSWithArea = db.prepare(`
  SELECT
    files.path,
    files.filename,
    files.area,
    files.category,
    files.extension,
    files.file_size,
    files.modified_at,
    snippet(files_fts, 2, '→', '←', '...', 40) as snippet
  FROM files_fts
  JOIN files ON files_fts.rowid = files.id
  WHERE files_fts MATCH $query AND files.area = $area
  ORDER BY rank
  LIMIT $limit
  OFFSET $offset
`);

const getFile = db.prepare(`SELECT * FROM files WHERE path = $path`);

const browseArea = db.prepare(`
  SELECT path, filename, extension, file_size, modified_at, category
  FROM files
  WHERE area = $area
  ORDER BY modified_at DESC
  LIMIT $limit
`);

const getStats = db.prepare(`
  SELECT
    COUNT(*) as total_files,
    SUM(file_size) as total_size,
    COUNT(DISTINCT area) as areas,
    COUNT(DISTINCT category) as categories,
    MAX(indexed_at) as last_indexed
  FROM files
`);

const getStatsByArea = db.prepare(`
  SELECT area, COUNT(*) as count, SUM(file_size) as size
  FROM files
  GROUP BY area
  ORDER BY count DESC
`);

const getStatsByExtension = db.prepare(`
  SELECT extension, COUNT(*) as count
  FROM files
  GROUP BY extension
  ORDER BY count DESC
  LIMIT 10
`);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}

const HTML_PATH = "/Volumes/VRAM/00-09_System/01_Tools/search_engine/index.html";

const server = Bun.serve({
  port: 3000,

  routes: {
    "/": async () => {
      const html = await Bun.file(HTML_PATH).text();
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },

    // Keyword search (FTS5 only)
    "/search": {
      GET: (req) => {
        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const area = url.searchParams.get("area");

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        const startTime = performance.now();

        let results;
        if (area) {
          results = searchFTSWithArea.all({ $query: q, $limit: limit, $offset: offset, $area: area });
        } else {
          results = searchFTS.all({ $query: q, $limit: limit, $offset: offset });
        }

        const elapsed = performance.now() - startTime;

        return jsonResponse({
          query: q,
          results,
          count: results.length,
          time_ms: elapsed.toFixed(2),
          search_type: "keyword"
        });
      },
    },

    // Semantic search (pgvector)
    "/semantic": {
      GET: async (req) => {
        if (!pgvectorAvailable || !embeddingAvailable) {
          return jsonResponse({
            error: "Semantic search not available",
            details: pgvectorAvailable ? "Embedding server not running" : "PostgreSQL not connected"
          }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
        const threshold = parseFloat(url.searchParams.get("threshold") || "0.5");
        const sources = url.searchParams.get("sources")?.split(",") as ("file" | "email" | "slack")[] || ["file", "email", "slack"];
        const area = url.searchParams.get("area") || undefined;
        const extension = url.searchParams.get("extension") || undefined;
        const pathPrefix = url.searchParams.get("pathPrefix") || undefined;

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        const startTime = performance.now();

        try {
          const results = await semanticSearch(q, { limit, threshold, sources, area, extension, pathPrefix });

          const elapsed = performance.now() - startTime;

          return jsonResponse({
            query: q,
            results: results.map(r => ({
              path: r.filePath,
              filename: r.filename,
              area: r.area,
              category: r.category,
              snippet: r.chunkText.substring(0, 300),
              similarity: parseFloat(r.similarity.toFixed(3)),
              source: r.source,
              speakers: r.speakers
            })),
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "semantic",
            model: "qwen3-vl-embedding-8b",
            dimensions: 4096
          });
        } catch (err: any) {
          return jsonResponse({
            error: "Semantic search failed",
            details: err.message
          }, 500);
        }
      }
    },

    // Hybrid search (FTS5 + pgvector with RRF)
    "/hybrid": {
      GET: async (req) => {
        if (!pgvectorAvailable || !embeddingAvailable) {
          return jsonResponse({
            error: "Hybrid search not available",
            details: "Semantic search component not available"
          }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 50);
        const ftsWeight = parseFloat(url.searchParams.get("fts_weight") || "0.4");
        const strategy = (url.searchParams.get("strategy") || "rrf") as "rrf" | "weighted" | "max";
        const area = url.searchParams.get("area") || undefined;
        const sourcesParam = url.searchParams.get("sources");
        const sources = sourcesParam
          ? sourcesParam.split(",").filter(s => ["file", "email", "slack"].includes(s)) as ("file" | "email" | "slack")[]
          : undefined;
        const pathPrefix = url.searchParams.get("pathPrefix") || undefined;

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        const startTime = performance.now();

        try {
          const results = await hybridSearch(q, {
            limit,
            ftsWeight,
            semanticWeight: 1 - ftsWeight,
            strategy,
            area,
            sources,
            pathPrefix
          });

          const elapsed = performance.now() - startTime;

          return jsonResponse({
            query: q,
            results: results.map(r => ({
              path: r.path,
              filename: r.filename,
              area: r.area,
              category: r.category,
              snippet: r.snippet,
              source: r.source,
              combined_score: parseFloat(r.combinedScore.toFixed(3)),
              fts_score: parseFloat(r.ftsScore.toFixed(3)),
              semantic_score: parseFloat(r.semanticScore.toFixed(3)),
              speakers: r.speakers
            })),
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "hybrid",
            strategy,
            weights: { fts: ftsWeight, semantic: 1 - ftsWeight }
          });
        } catch (err: any) {
          return jsonResponse({
            error: "Hybrid search failed",
            details: err.message
          }, 500);
        }
      }
    },

    // Explain search (debug endpoint)
    "/explain": {
      GET: async (req) => {
        if (!pgvectorAvailable || !embeddingAvailable) {
          return jsonResponse({ error: "Search explanation not available" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 20);

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        try {
          const explanation = await explainSearch(q, { limit });
          return jsonResponse(explanation);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Email-specific search
    "/search/emails": {
      GET: async (req) => {
        if (!pgvectorAvailable || !embeddingAvailable) {
          return jsonResponse({ error: "Email search not available" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
        const fromEmail = url.searchParams.get("from") || undefined;
        const label = url.searchParams.get("label") || undefined;
        const hasAttachments = url.searchParams.has("attachments")
          ? url.searchParams.get("attachments") === "true"
          : undefined;

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        const startTime = performance.now();

        try {
          const results = await searchEmails(q, { limit, fromEmail, label, hasAttachments });
          const elapsed = performance.now() - startTime;

          return jsonResponse({
            query: q,
            results,
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "email_semantic"
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Slack-specific search
    "/search/slack": {
      GET: async (req) => {
        if (!pgvectorAvailable || !embeddingAvailable) {
          return jsonResponse({ error: "Slack search not available" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
        const channel = url.searchParams.get("channel") || undefined;
        const speaker = url.searchParams.get("speaker") || undefined;

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        const startTime = performance.now();

        try {
          const results = await searchSlack(q, { limit, channel, speaker });
          const elapsed = performance.now() - startTime;

          return jsonResponse({
            query: q,
            results,
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "slack_semantic"
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Generate embedding for text
    "/embed": {
      POST: async (req) => {
        if (!embeddingAvailable) {
          return jsonResponse({ error: "Embedding server not available" }, 503);
        }

        try {
          const body = await req.json();
          const text = body.text;

          if (!text) {
            return jsonResponse({ error: "Missing text field in request body" }, 400);
          }

          const startTime = performance.now();
          const embedding = await generateEmbedding(text);
          const elapsed = performance.now() - startTime;

          return jsonResponse({
            text_preview: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
            dimensions: embedding.length,
            embedding,
            time_ms: elapsed.toFixed(2)
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Embedding server status
    "/embedding/status": async () => {
      try {
        const health = await checkHealth();
        return jsonResponse({
          available: true,
          model: health.model || "qwen3-vl-embedding-8b",
          device: health.device,
          dimensions: 4096,
          port: 8081
        });
      } catch (err: any) {
        return jsonResponse({
          available: false,
          error: err.message
        });
      }
    },

    // File metadata
    "/file": {
      GET: async (req) => {
        const url = new URL(req.url);
        const path = url.searchParams.get("path");
        const includeContent = url.searchParams.get("content") === "true";

        if (!path) {
          return jsonResponse({ error: "Missing ?path= parameter" }, 400);
        }

        const file = getFile.get({ $path: path }) as Record<string, unknown> | null;
        if (!file) {
          return jsonResponse({ error: "File not found in index" }, 404);
        }

        if (includeContent) {
          try {
            const content = await Bun.file(path).text();
            return jsonResponse({ ...file, content });
          } catch {
            return jsonResponse({ ...file, content: file.content });
          }
        }

        const { content: _, ...fileWithoutContent } = file;
        return jsonResponse(fileWithoutContent);
      },
    },

    // Browse by area
    "/browse/:area": (req) => {
      const area = req.params.area;
      const url = new URL(req.url);
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 500);

      const files = browseArea.all({ $area: area, $limit: limit });
      return jsonResponse({ area, files, count: files.length });
    },

    // Combined statistics
    "/stats": async () => {
      const ftsStats = getStats.get() as Record<string, unknown>;
      const byArea = getStatsByArea.all();
      const byExtension = getStatsByExtension.all();

      // Add vector stats if available
      let vectorStats = null;
      if (pgvectorAvailable) {
        try {
          vectorStats = await getVectorStats();
        } catch {
          // Ignore if pgvector stats fail
        }
      }

      return jsonResponse({
        ...ftsStats,
        by_area: byArea,
        by_extension: byExtension,
        embeddings: vectorStats ? {
          file_chunks: vectorStats.chunks,
          email_chunks: vectorStats.emails,
          slack_chunks: vectorStats.slack,
          total_chunks: vectorStats.total,
          model: "qwen3-vl-embedding-8b",
          dimensions: 4096,
          storage: "postgresql_pgvector"
        } : null
      });
    },

    // Health check
    "/health": () => {
      return jsonResponse({
        status: "ok",
        fts_available: true,
        pgvector_available: pgvectorAvailable,
        embedding_available: embeddingAvailable,
        embedding_model: "qwen3-vl-embedding-8b",
        embedding_port: 8081
      });
    },
  },

  fetch(req) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    return jsonResponse({ error: "Not found" }, 404);
  },
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down...");
  closeFTSDb();
  await closeConnection();
  db.close();
  process.exit(0);
});

console.log(`\nVRAM Search API running at http://localhost:${server.port}`);
console.log(`\nEndpoints:`);
console.log(`  GET /                 - Web UI`);
console.log(`  GET /search           - Keyword search (FTS5)`);
console.log(`  GET /semantic         - Semantic search (pgvector)`);
console.log(`  GET /hybrid           - Combined search (RRF fusion)`);
console.log(`  GET /explain          - Search explanation`);
console.log(`  GET /search/emails    - Email-specific search`);
console.log(`  GET /search/slack     - Slack-specific search`);
console.log(`  POST /embed           - Generate embedding`);
console.log(`  GET /embedding/status - Embedding server status`);
console.log(`  GET /file             - File metadata`);
console.log(`  GET /browse/:area     - Browse by area`);
console.log(`  GET /stats            - Index statistics`);
console.log(`  GET /health           - Health check`);
console.log(`\nModel: Qwen3-VL-Embedding-8B (4096 dimensions, port 8081)`);
