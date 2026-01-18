/**
 * VRAM Search API Server - PostgreSQL Version
 *
 * REST API for full-text and semantic search across VRAM content.
 * Uses PostgreSQL tsvector for keyword search and pgvector for semantic search.
 * Embedding model: Qwen3-Embedding-8B (4096 dimensions, port 8081)
 *
 * All search is now unified in PostgreSQL for multi-agent concurrency.
 */

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
import { unifiedKeywordSearch, type UnifiedFTSResult } from "./pg-fts";

// Check PostgreSQL/FTS availability
let pgAvailable = false;
try {
  const sql = getConnection();
  await sql`SELECT 1`;
  pgAvailable = true;
  console.log("✅ PostgreSQL connected (FTS + pgvector)");
} catch (err) {
  console.warn("⚠️  PostgreSQL not available:", (err as Error).message);
  console.warn("   All search features will be disabled.");
}

// Check embedding server
let embeddingAvailable = false;
try {
  const health = await checkHealth();
  embeddingAvailable = true;
  console.log(`✅ Embedding server ready: ${health.model || "Qwen3-Embedding-8B"}`);
} catch (err) {
  console.warn("⚠️  Embedding server not available on port 8081");
  console.warn("   Semantic search will be disabled.");
}

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

    // Keyword search (PostgreSQL FTS) - Unified across all sources
    "/search": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Search not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
        const area = url.searchParams.get("area") || undefined;
        const extension = url.searchParams.get("type") || url.searchParams.get("extension") || undefined;
        const speaker = url.searchParams.get("speaker") || undefined;
        const sourcesParam = url.searchParams.get("sources") || "file,transcript,email,slack";

        // Parse sources
        const validSources = ["file", "transcript", "email", "slack"] as const;
        const sources = sourcesParam
          .split(",")
          .map(s => s.trim().toLowerCase())
          .filter(s => validSources.includes(s as any)) as ("file" | "transcript" | "email" | "slack")[];

        if (!q) {
          return jsonResponse({ error: "Missing ?q= parameter" }, 400);
        }

        const startTime = performance.now();

        try {
          const results = await unifiedKeywordSearch(q, {
            limit,
            sources,
            area,
            extension,
            speaker
          });
          const elapsed = performance.now() - startTime;

          return jsonResponse({
            query: q,
            results: results.map(r => ({
              id: r.id,
              source: r.source,
              path: r.path,
              title: r.title,
              snippet: r.snippet,
              area: r.area,
              category: r.category,
              rank: parseFloat(r.rank.toFixed(3)),
              metadata: r.metadata
            })),
            count: results.length,
            time_ms: elapsed.toFixed(2),
            search_type: "keyword",
            sources_searched: sources,
            backend: "postgresql_tsvector"
          });
        } catch (err: any) {
          return jsonResponse({ error: "Search failed", details: err.message }, 500);
        }
      },
    },

    // Semantic search (pgvector)
    "/semantic": {
      GET: async (req) => {
        if (!pgAvailable || !embeddingAvailable) {
          return jsonResponse({
            error: "Semantic search not available",
            details: pgAvailable ? "Embedding server not running" : "PostgreSQL not connected"
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
            model: "qwen3-embedding-8b",
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

    // Hybrid search (PostgreSQL FTS + pgvector with RRF)
    "/hybrid": {
      GET: async (req) => {
        if (!pgAvailable || !embeddingAvailable) {
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
        const speaker = url.searchParams.get("speaker") || undefined;
        const sources = sourcesParam
          ? sourcesParam.split(",").filter(s => ["file", "transcript", "email", "slack"].includes(s)) as ("file" | "transcript" | "email" | "slack")[]
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
            pathPrefix,
            speaker
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
        if (!pgAvailable || !embeddingAvailable) {
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
        if (!pgAvailable || !embeddingAvailable) {
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
        if (!pgAvailable || !embeddingAvailable) {
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
          model: health.model || "qwen3-embedding-8b",
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

    // File metadata (handles regular files, emails, and slack messages)
    "/file": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "File lookup not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const path = url.searchParams.get("path");
        const includeContent = url.searchParams.get("content") === "true";

        if (!path) {
          return jsonResponse({ error: "Missing ?path= parameter" }, 400);
        }

        try {
          const sql = getConnection();

          // Handle email URIs (email://emailId)
          if (path.startsWith("email://")) {
            const emailId = path.replace("email://", "");
            const results = await sql`
              SELECT email_id, email_path, subject, from_name, from_email,
                     to_emails, email_date, labels, has_attachments, is_reply,
                     chunk_index, chunk_text
              FROM email_chunks
              WHERE email_id = ${emailId}
              ORDER BY chunk_index
            `;

            if (results.length === 0) {
              return jsonResponse({ error: "Email not found" }, 404);
            }

            const first = results[0];
            const content = results.map((r: any) => r.chunk_text).join("\n\n");

            return jsonResponse({
              path: path,
              filename: first.subject || `Email from ${first.from_name || first.from_email}`,
              extension: "email",
              area: "Email",
              category: first.labels?.[0] || "Inbox",
              modified_at: first.email_date,
              content: includeContent ? content : undefined,
              metadata: {
                source: "email",
                email_id: first.email_id,
                subject: first.subject,
                from_name: first.from_name,
                from_email: first.from_email,
                to_emails: first.to_emails,
                labels: first.labels,
                has_attachments: first.has_attachments,
                is_reply: first.is_reply,
                chunks: results.length
              }
            });
          }

          // Handle slack URIs (slack://channel/timestamp)
          if (path.startsWith("slack://")) {
            const slackPath = path.replace("slack://", "");
            const [channel, ...rest] = slackPath.split("/");
            const timestamp = rest.join("/");

            // Try to find by channel, or by exact path match
            let results;
            if (timestamp) {
              // Parse the timestamp to get the date
              const dateMatch = timestamp.match(/(\w+ \w+ \d+ \d+)/);
              if (dateMatch) {
                const messageDate = new Date(dateMatch[1]).toISOString().split('T')[0];
                results = await sql`
                  SELECT channel, channel_type, speakers, user_ids, start_ts, end_ts,
                         message_date, message_count, has_files, has_reactions,
                         chunk_index, chunk_text
                  FROM slack_chunks
                  WHERE channel = ${channel} AND message_date = ${messageDate}::date
                  ORDER BY chunk_index
                `;
              }
            }

            // Fallback: search by channel only
            if (!results || results.length === 0) {
              results = await sql`
                SELECT channel, channel_type, speakers, user_ids, start_ts, end_ts,
                       message_date, message_count, has_files, has_reactions,
                       chunk_index, chunk_text
                FROM slack_chunks
                WHERE channel = ${channel}
                ORDER BY message_date DESC, chunk_index
                LIMIT 10
              `;
            }

            if (results.length === 0) {
              return jsonResponse({ error: "Slack message not found" }, 404);
            }

            const first = results[0];
            const content = results.map((r: any) => r.chunk_text).join("\n\n---\n\n");

            return jsonResponse({
              path: path,
              filename: `#${first.channel} - ${first.message_date}`,
              extension: "slack",
              area: "Slack",
              category: first.channel_type || "channel",
              modified_at: first.message_date,
              content: includeContent ? content : undefined,
              metadata: {
                source: "slack",
                channel: first.channel,
                channel_type: first.channel_type,
                speakers: first.speakers,
                message_date: first.message_date,
                message_count: first.message_count,
                has_files: first.has_files,
                has_reactions: first.has_reactions,
                chunks: results.length
              }
            });
          }

          // Regular file path - use existing logic
          const file = await getFileMetadata(path);
          if (!file) {
            return jsonResponse({ error: "File not found in index" }, 404);
          }

          if (includeContent) {
            try {
              const content = await Bun.file(path).text();
              return jsonResponse({ ...file, content });
            } catch {
              return jsonResponse({ ...file });
            }
          }

          const { content: _, ...fileWithoutContent } = file;
          return jsonResponse(fileWithoutContent);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      },
    },

    // Browse by area
    "/browse/:area": async (req) => {
      if (!pgAvailable) {
        return jsonResponse({ error: "Browse not available - PostgreSQL not connected" }, 503);
      }

      const area = req.params.area;
      const url = new URL(req.url);
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 500);

      try {
        const files = await browseByArea(area, { limit });
        return jsonResponse({ area, files, count: files.length });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    },

    // Combined statistics
    "/stats": async () => {
      if (!pgAvailable) {
        return jsonResponse({ error: "Stats not available - PostgreSQL not connected" }, 503);
      }

      try {
        const ftsStats = await getFTSStats();

        // Get breakdown by area
        const sql = getConnection();
        const byArea = await sql`
          SELECT area, COUNT(*)::int as count, COALESCE(SUM(file_size), 0)::bigint as size
          FROM documents
          GROUP BY area
          ORDER BY count DESC
        `;
        const byExtension = await sql`
          SELECT extension, COUNT(*)::int as count
          FROM documents
          GROUP BY extension
          ORDER BY count DESC
          LIMIT 10
        `;

        // Add vector stats
        let vectorStats = null;
        try {
          vectorStats = await getVectorStats();
        } catch {
          // Ignore if vector stats fail
        }

        return jsonResponse({
          total_files: ftsStats.totalFiles,
          total_size: ftsStats.totalSize,
          areas: ftsStats.areas,
          categories: ftsStats.categories,
          last_indexed: ftsStats.lastIndexed,
          by_area: byArea,
          by_extension: byExtension,
          backend: "postgresql",
          embeddings: vectorStats ? {
            file_chunks: vectorStats.chunks,
            email_chunks: vectorStats.emails,
            slack_chunks: vectorStats.slack,
            total_chunks: vectorStats.total,
            model: "qwen3-embedding-8b",
            dimensions: 4096,
            storage: "postgresql_pgvector"
          } : null
        });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    },

    // Health check
    "/health": () => {
      return jsonResponse({
        status: "ok",
        fts_available: pgAvailable,
        fts_backend: "postgresql_tsvector",
        pgvector_available: pgAvailable,
        embedding_available: embeddingAvailable,
        embedding_model: "qwen3-embedding-8b",
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
  process.exit(0);
});

console.log(`\nVRAM Search API running at http://localhost:${server.port}`);
console.log(`\nEndpoints:`);
console.log(`  GET /                 - Web UI`);
console.log(`  GET /search           - Keyword search (PostgreSQL tsvector)`);
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
console.log(`\nBackend: PostgreSQL (FTS + pgvector)`);
console.log(`Model: Qwen3-Embedding-8B (4096 dimensions, port 8081)`);
