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

        // Enhanced filter parameters
        const year = url.searchParams.get("year") ? parseInt(url.searchParams.get("year")!) : undefined;
        const month = url.searchParams.get("month") ? parseInt(url.searchParams.get("month")!) : undefined;
        const quarter = url.searchParams.get("quarter") ? parseInt(url.searchParams.get("quarter")!) : undefined;
        const person = url.searchParams.get("person") || undefined;
        const company = url.searchParams.get("company") || undefined;
        const sentByMe = url.searchParams.has("sent_by_me") ? url.searchParams.get("sent_by_me") === "true" : undefined;
        const hasAttachments = url.searchParams.has("has_attachments") ? url.searchParams.get("has_attachments") === "true" : undefined;
        const isInternal = url.searchParams.has("is_internal") ? url.searchParams.get("is_internal") === "true" : undefined;

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
            speaker,
            year,
            month,
            quarter,
            person,
            company,
            sentByMe,
            hasAttachments,
            isInternal
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

    // ==================== NEW METADATA ENDPOINTS ====================

    // Contacts list and search
    "/contacts": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Contacts not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q") || undefined;
        const company = url.searchParams.get("company") || undefined;
        const domain = url.searchParams.get("domain") || undefined;
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const sortBy = url.searchParams.get("sort") || "email_count";
        const order = url.searchParams.get("order") === "asc" ? "ASC" : "DESC";

        try {
          const sql = getConnection();

          // Build dynamic query
          let whereConditions: string[] = [];
          let params: any[] = [];
          let paramIndex = 1;

          if (q) {
            whereConditions.push(`(c.name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex})`);
            params.push(`%${q}%`);
            paramIndex++;
          }

          if (company) {
            whereConditions.push(`co.name ILIKE $${paramIndex}`);
            params.push(`%${company}%`);
            paramIndex++;
          }

          if (domain) {
            whereConditions.push(`co.domain = $${paramIndex}`);
            params.push(domain);
            paramIndex++;
          }

          const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(" AND ")}`
            : "";

          // Valid sort columns
          const validSorts: Record<string, string> = {
            email_count: "c.email_count",
            slack_count: "c.slack_count",
            meeting_count: "c.meeting_count",
            last_seen: "c.last_seen_at",
            name: "c.name"
          };
          const sortColumn = validSorts[sortBy] || "c.email_count";

          const query = `
            SELECT c.id, c.name, c.email, co.domain, c.role,
                   c.email_count, c.slack_count, c.meeting_count,
                   c.first_seen_at, c.last_seen_at,
                   co.name as company_name
            FROM contacts c
            LEFT JOIN companies co ON c.company_id = co.id
            ${whereClause}
            ORDER BY ${sortColumn} ${order}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
          `;

          const results = await sql.unsafe(query, [...params, limit, offset]);

          // Get total count
          const countQuery = `
            SELECT COUNT(*)::int as total
            FROM contacts c
            LEFT JOIN companies co ON c.company_id = co.id
            ${whereClause}
          `;
          const countResult = await sql.unsafe(countQuery, params);
          const total = countResult[0]?.total || 0;

          return jsonResponse({
            contacts: results.map((r: any) => ({
              id: r.id,
              name: r.name,
              email: r.email,
              domain: r.domain,
              role: r.role,
              company: r.company_name,
              email_count: r.email_count,
              slack_count: r.slack_count,
              meeting_count: r.meeting_count,
              first_seen: r.first_seen_at,
              last_seen: r.last_seen_at
            })),
            total,
            limit,
            offset,
            has_more: offset + results.length < total
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Single contact details
    "/contacts/:id": async (req) => {
      if (!pgAvailable) {
        return jsonResponse({ error: "Contact not available - PostgreSQL not connected" }, 503);
      }

      const contactId = parseInt(req.params.id);
      if (isNaN(contactId)) {
        return jsonResponse({ error: "Invalid contact ID" }, 400);
      }

      try {
        const sql = getConnection();

        // Get contact with company
        const contactResult = await sql`
          SELECT c.*, co.name as company_name, co.domain as company_domain
          FROM contacts c
          LEFT JOIN companies co ON c.company_id = co.id
          WHERE c.id = ${contactId}
        `;

        if (contactResult.length === 0) {
          return jsonResponse({ error: "Contact not found" }, 404);
        }

        const contact = contactResult[0];

        // Get recent emails from/to this contact
        const recentEmails = await sql`
          SELECT DISTINCT ON (e.email_id)
            e.email_id, e.subject, e.from_email, e.email_date
          FROM email_chunks e
          WHERE e.from_email = ${contact.email}
             OR ${contact.email} = ANY(e.to_emails)
          ORDER BY e.email_id, e.email_date DESC
          LIMIT 5
        `;

        // Get recent Slack messages
        const recentSlack = await sql`
          SELECT DISTINCT s.channel, s.message_date, s.speakers
          FROM slack_chunks s
          WHERE ${contact.email} = ANY(s.real_names)
             OR ${contact.name} = ANY(s.speakers)
          ORDER BY s.message_date DESC
          LIMIT 5
        `;

        // Get meetings attended
        const meetings = await sql`
          SELECT tm.meeting_id, tm.title, tm.start_time, tm.duration_minutes
          FROM meeting_participants mp
          JOIN transcript_meetings tm ON mp.meeting_id = tm.id
          WHERE mp.contact_id = ${contactId}
          ORDER BY tm.start_time DESC
          LIMIT 5
        `;

        return jsonResponse({
          contact: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            role: contact.role,
            company: contact.company_name,
            company_domain: contact.company_domain,
            email_count: contact.email_count,
            slack_count: contact.slack_count,
            meeting_count: contact.meeting_count,
            first_seen: contact.first_seen_at,
            last_seen: contact.last_seen_at
          },
          recent_emails: recentEmails.map((e: any) => ({
            email_id: e.email_id,
            subject: e.subject,
            from: e.from_email,
            date: e.email_date
          })),
          recent_slack: recentSlack.map((s: any) => ({
            channel: s.channel,
            date: s.message_date,
            speakers: s.speakers
          })),
          meetings: meetings.map((m: any) => ({
            id: m.meeting_id,
            title: m.title,
            date: m.start_time,
            duration: m.duration_minutes
          }))
        });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    },

    // Companies list and search
    "/companies": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Companies not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q") || undefined;
        const domain = url.searchParams.get("domain") || undefined;
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const sortBy = url.searchParams.get("sort") || "contact_count";
        const order = url.searchParams.get("order") === "asc" ? "ASC" : "DESC";

        try {
          const sql = getConnection();

          // Build dynamic query
          let whereConditions: string[] = [];
          let params: any[] = [];
          let paramIndex = 1;

          if (q) {
            whereConditions.push(`(name ILIKE $${paramIndex} OR domain ILIKE $${paramIndex})`);
            params.push(`%${q}%`);
            paramIndex++;
          }

          if (domain) {
            whereConditions.push(`domain = $${paramIndex}`);
            params.push(domain);
            paramIndex++;
          }

          const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(" AND ")}`
            : "";

          // Valid sort columns
          const validSorts: Record<string, string> = {
            contact_count: "contact_count",
            name: "name",
            created: "created_at"
          };
          const sortColumn = validSorts[sortBy] || "contact_count";

          const query = `
            SELECT id, name, domain, contact_count, created_at
            FROM companies
            ${whereClause}
            ORDER BY ${sortColumn} ${order}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
          `;

          const results = await sql.unsafe(query, [...params, limit, offset]);

          // Get total count
          const countQuery = `SELECT COUNT(*)::int as total FROM companies ${whereClause}`;
          const countResult = await sql.unsafe(countQuery, params);
          const total = countResult[0]?.total || 0;

          return jsonResponse({
            companies: results.map((r: any) => ({
              id: r.id,
              name: r.name,
              domain: r.domain,
              contact_count: r.contact_count,
              created_at: r.created_at
            })),
            total,
            limit,
            offset,
            has_more: offset + results.length < total
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Single company details
    "/companies/:id": async (req) => {
      if (!pgAvailable) {
        return jsonResponse({ error: "Company not available - PostgreSQL not connected" }, 503);
      }

      const companyId = parseInt(req.params.id);
      if (isNaN(companyId)) {
        return jsonResponse({ error: "Invalid company ID" }, 400);
      }

      try {
        const sql = getConnection();

        // Get company
        const companyResult = await sql`
          SELECT * FROM companies WHERE id = ${companyId}
        `;

        if (companyResult.length === 0) {
          return jsonResponse({ error: "Company not found" }, 404);
        }

        const company = companyResult[0];

        // Get top contacts at this company
        const contacts = await sql`
          SELECT id, name, email, title, email_count, slack_count, meeting_count
          FROM contacts
          WHERE company_id = ${companyId}
          ORDER BY email_count + slack_count + meeting_count DESC
          LIMIT 10
        `;

        // Get email activity stats
        const emailStats = await sql`
          SELECT
            COUNT(DISTINCT e.email_id) as total_emails,
            COUNT(DISTINCT e.email_id) FILTER (WHERE e.email_date > NOW() - INTERVAL '30 days') as emails_30d
          FROM email_chunks e
          JOIN contacts c ON e.from_email = c.email OR c.email = ANY(e.to_emails)
          WHERE c.company_id = ${companyId}
        `;

        // Get meeting stats
        const meetingStats = await sql`
          SELECT
            COUNT(DISTINCT tm.id) as total_meetings,
            COUNT(DISTINCT tm.id) FILTER (WHERE tm.start_time > NOW() - INTERVAL '30 days') as meetings_30d
          FROM transcript_meetings tm
          JOIN meeting_participants mp ON tm.id = mp.meeting_id
          JOIN contacts c ON mp.contact_id = c.id
          WHERE c.company_id = ${companyId}
        `;

        return jsonResponse({
          company: {
            id: company.id,
            name: company.name,
            domain: company.domain,
            contact_count: company.contact_count,
            created_at: company.created_at
          },
          contacts: contacts.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            title: c.title,
            email_count: c.email_count,
            slack_count: c.slack_count,
            meeting_count: c.meeting_count
          })),
          stats: {
            total_emails: emailStats[0]?.total_emails || 0,
            emails_30d: emailStats[0]?.emails_30d || 0,
            total_meetings: meetingStats[0]?.total_meetings || 0,
            meetings_30d: meetingStats[0]?.meetings_30d || 0
          }
        });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    },

    // Meetings list and search
    "/meetings": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Meetings not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const q = url.searchParams.get("q") || undefined;
        const year = url.searchParams.get("year") ? parseInt(url.searchParams.get("year")!) : undefined;
        const month = url.searchParams.get("month") ? parseInt(url.searchParams.get("month")!) : undefined;
        const quarter = url.searchParams.get("quarter") ? parseInt(url.searchParams.get("quarter")!) : undefined;
        const isInternal = url.searchParams.has("is_internal") ? url.searchParams.get("is_internal") === "true" : undefined;
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 200);
        const offset = parseInt(url.searchParams.get("offset") || "0");

        try {
          const sql = getConnection();

          // Build dynamic query
          let whereConditions: string[] = [];
          let params: any[] = [];
          let paramIndex = 1;

          if (q) {
            whereConditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
            params.push(`%${q}%`);
            paramIndex++;
          }

          if (year !== undefined) {
            whereConditions.push(`year = $${paramIndex}`);
            params.push(year);
            paramIndex++;
          }

          if (month !== undefined) {
            whereConditions.push(`month = $${paramIndex}`);
            params.push(month);
            paramIndex++;
          }

          if (quarter !== undefined) {
            whereConditions.push(`quarter = $${paramIndex}`);
            params.push(quarter);
            paramIndex++;
          }

          if (isInternal !== undefined) {
            whereConditions.push(`is_internal = $${paramIndex}`);
            params.push(isInternal);
            paramIndex++;
          }

          const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(" AND ")}`
            : "";

          const query = `
            SELECT meeting_id, title, description, start_time, duration_minutes,
                   year, month, quarter, is_internal, participant_count, video_url
            FROM transcript_meetings
            ${whereClause}
            ORDER BY start_time DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
          `;

          const results = await sql.unsafe(query, [...params, limit, offset]);

          // Get total count
          const countQuery = `SELECT COUNT(*)::int as total FROM transcript_meetings ${whereClause}`;
          const countResult = await sql.unsafe(countQuery, params);
          const total = countResult[0]?.total || 0;

          return jsonResponse({
            meetings: results.map((r: any) => ({
              id: r.meeting_id,
              title: r.title,
              description: r.description,
              start_time: r.start_time,
              duration_minutes: r.duration_minutes,
              year: r.year,
              month: r.month,
              quarter: r.quarter,
              is_internal: r.is_internal,
              participant_count: r.participant_count,
              video_url: r.video_url
            })),
            total,
            limit,
            offset,
            has_more: offset + results.length < total
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Single meeting details
    "/meetings/:id": async (req) => {
      if (!pgAvailable) {
        return jsonResponse({ error: "Meeting not available - PostgreSQL not connected" }, 503);
      }

      const meetingId = req.params.id;

      try {
        const sql = getConnection();

        // Get meeting
        const meetingResult = await sql`
          SELECT * FROM transcript_meetings WHERE meeting_id = ${meetingId}
        `;

        if (meetingResult.length === 0) {
          return jsonResponse({ error: "Meeting not found" }, 404);
        }

        const meeting = meetingResult[0];

        // Get participants
        const participants = await sql`
          SELECT c.id, c.name, c.email, c.title, mp.role,
                 co.name as company_name
          FROM meeting_participants mp
          JOIN contacts c ON mp.contact_id = c.id
          LEFT JOIN companies co ON c.company_id = co.id
          WHERE mp.meeting_id = ${meeting.id}
        `;

        // Get transcript chunks if available
        const transcriptChunks = await sql`
          SELECT chunk_text, chunk_index
          FROM chunks
          WHERE meeting_id = ${meeting.id}
          ORDER BY chunk_index
          LIMIT 10
        `;

        return jsonResponse({
          meeting: {
            id: meeting.meeting_id,
            title: meeting.title,
            description: meeting.description,
            start_time: meeting.start_time,
            duration_minutes: meeting.duration_minutes,
            year: meeting.year,
            month: meeting.month,
            quarter: meeting.quarter,
            is_internal: meeting.is_internal,
            participant_count: meeting.participant_count,
            video_url: meeting.video_url,
            file_path: meeting.file_path
          },
          participants: participants.map((p: any) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            title: p.title,
            role: p.role,
            company: p.company_name
          })),
          transcript_preview: transcriptChunks.map((c: any) => ({
            index: c.chunk_index,
            text: c.chunk_text
          }))
        });
      } catch (err: any) {
        return jsonResponse({ error: err.message }, 500);
      }
    },

    // Analytics endpoints
    "/analytics/activity": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Analytics not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const year = url.searchParams.get("year") ? parseInt(url.searchParams.get("year")!) : new Date().getFullYear();
        const groupBy = url.searchParams.get("group_by") || "month"; // month, quarter, week

        try {
          const sql = getConnection();

          let timeGroup: string;
          let timeSelect: string;

          if (groupBy === "quarter") {
            timeGroup = "quarter";
            timeSelect = "quarter as period";
          } else if (groupBy === "week") {
            timeGroup = "EXTRACT(WEEK FROM email_date)::int";
            timeSelect = "EXTRACT(WEEK FROM email_date)::int as period";
          } else {
            timeGroup = "month";
            timeSelect = "month as period";
          }

          // Email activity by time period
          const emailActivity = await sql.unsafe(`
            SELECT ${timeSelect},
                   COUNT(DISTINCT email_id)::int as email_count,
                   COUNT(DISTINCT from_email)::int as unique_senders
            FROM email_chunks
            WHERE year = $1
            GROUP BY ${timeGroup}
            ORDER BY ${timeGroup}
          `, [year]);

          // Slack activity by time period
          const slackActivity = await sql.unsafe(`
            SELECT ${timeSelect.replace(/email_date/g, 'message_date')},
                   COUNT(DISTINCT id)::int as message_count,
                   COUNT(DISTINCT channel)::int as active_channels
            FROM slack_chunks
            WHERE year = $1
            GROUP BY ${timeGroup.replace(/email_date/g, 'message_date')}
            ORDER BY ${timeGroup.replace(/email_date/g, 'message_date')}
          `, [year]);

          // Meeting activity by time period
          const meetingActivity = await sql.unsafe(`
            SELECT ${timeSelect.replace(/email_date/g, 'start_time')},
                   COUNT(*)::int as meeting_count,
                   SUM(duration_minutes)::int as total_minutes,
                   COUNT(*) FILTER (WHERE is_internal)::int as internal_count,
                   COUNT(*) FILTER (WHERE NOT is_internal)::int as external_count
            FROM transcript_meetings
            WHERE year = $1
            GROUP BY ${timeGroup.replace(/email_date/g, 'start_time')}
            ORDER BY ${timeGroup.replace(/email_date/g, 'start_time')}
          `, [year]);

          return jsonResponse({
            year,
            group_by: groupBy,
            email_activity: emailActivity,
            slack_activity: slackActivity,
            meeting_activity: meetingActivity
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Top contacts analytics
    "/analytics/top-contacts": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Analytics not available - PostgreSQL not connected" }, 503);
        }

        const url = new URL(req.url);
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
        const metric = url.searchParams.get("metric") || "total"; // total, email, slack, meeting
        const excludeInternal = url.searchParams.get("exclude_internal") === "true";

        try {
          const sql = getConnection();

          let orderBy: string;
          switch (metric) {
            case "email":
              orderBy = "c.email_count";
              break;
            case "slack":
              orderBy = "c.slack_count";
              break;
            case "meeting":
              orderBy = "c.meeting_count";
              break;
            default:
              orderBy = "(c.email_count + c.slack_count + c.meeting_count)";
          }

          const whereClause = excludeInternal
            ? `WHERE c.domain != 'hackervalley.com'`
            : "";

          const query = `
            SELECT c.id, c.name, c.email, c.domain, c.title,
                   c.email_count, c.slack_count, c.meeting_count,
                   (c.email_count + c.slack_count + c.meeting_count) as total_interactions,
                   c.last_seen_at,
                   co.name as company_name
            FROM contacts c
            LEFT JOIN companies co ON c.company_id = co.id
            ${whereClause}
            ORDER BY ${orderBy} DESC
            LIMIT $1
          `;

          const results = await sql.unsafe(query, [limit]);

          return jsonResponse({
            metric,
            exclude_internal: excludeInternal,
            contacts: results.map((r: any) => ({
              id: r.id,
              name: r.name,
              email: r.email,
              domain: r.domain,
              title: r.title,
              company: r.company_name,
              email_count: r.email_count,
              slack_count: r.slack_count,
              meeting_count: r.meeting_count,
              total_interactions: r.total_interactions,
              last_seen: r.last_seen_at
            }))
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
    },

    // Summary analytics
    "/analytics/summary": {
      GET: async (req) => {
        if (!pgAvailable) {
          return jsonResponse({ error: "Analytics not available - PostgreSQL not connected" }, 503);
        }

        try {
          const sql = getConnection();

          // Overall counts
          const counts = await sql`
            SELECT
              (SELECT COUNT(*) FROM contacts) as total_contacts,
              (SELECT COUNT(*) FROM companies) as total_companies,
              (SELECT COUNT(*) FROM transcript_meetings) as total_meetings,
              (SELECT COUNT(DISTINCT email_id) FROM email_chunks) as total_emails,
              (SELECT COUNT(*) FROM slack_chunks) as total_slack_messages
          `;

          // Activity in last 30 days
          const recent = await sql`
            SELECT
              (SELECT COUNT(DISTINCT email_id) FROM email_chunks WHERE email_date > NOW() - INTERVAL '30 days') as emails_30d,
              (SELECT COUNT(*) FROM slack_chunks WHERE message_date > NOW() - INTERVAL '30 days') as slack_30d,
              (SELECT COUNT(*) FROM transcript_meetings WHERE start_time > NOW() - INTERVAL '30 days') as meetings_30d
          `;

          // Top domains by contact count (from companies)
          const topDomains = await sql`
            SELECT c.domain, COUNT(ct.id) as count
            FROM companies c
            JOIN contacts ct ON ct.company_id = c.id
            WHERE c.domain IS NOT NULL AND c.domain != 'hackervalley.com'
            GROUP BY c.domain
            ORDER BY count DESC
            LIMIT 10
          `;

          // Meetings by type
          const meetingTypes = await sql`
            SELECT
              is_internal,
              COUNT(*) as count,
              AVG(duration_minutes)::int as avg_duration
            FROM transcript_meetings
            GROUP BY is_internal
          `;

          return jsonResponse({
            totals: {
              contacts: counts[0].total_contacts,
              companies: counts[0].total_companies,
              meetings: counts[0].total_meetings,
              emails: counts[0].total_emails,
              slack_messages: counts[0].total_slack_messages
            },
            last_30_days: {
              emails: recent[0].emails_30d,
              slack_messages: recent[0].slack_30d,
              meetings: recent[0].meetings_30d
            },
            top_external_domains: topDomains,
            meeting_breakdown: meetingTypes.map((m: any) => ({
              type: m.is_internal ? "internal" : "external",
              count: m.count,
              avg_duration_minutes: m.avg_duration
            }))
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }
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
console.log(`  GET /                    - Web UI`);
console.log(`  GET /search              - Keyword search (PostgreSQL tsvector)`);
console.log(`  GET /semantic            - Semantic search (pgvector)`);
console.log(`  GET /hybrid              - Combined search (RRF fusion)`);
console.log(`  GET /explain             - Search explanation`);
console.log(`  GET /search/emails       - Email-specific search`);
console.log(`  GET /search/slack        - Slack-specific search`);
console.log(`  POST /embed              - Generate embedding`);
console.log(`  GET /embedding/status    - Embedding server status`);
console.log(`  GET /file                - File metadata`);
console.log(`  GET /browse/:area        - Browse by area`);
console.log(`  GET /stats               - Index statistics`);
console.log(`  GET /health              - Health check`);
console.log(`\nMetadata Endpoints:`);
console.log(`  GET /contacts            - List/search contacts`);
console.log(`  GET /contacts/:id        - Contact details`);
console.log(`  GET /companies           - List/search companies`);
console.log(`  GET /companies/:id       - Company details`);
console.log(`  GET /meetings            - List/search meetings`);
console.log(`  GET /meetings/:id        - Meeting details`);
console.log(`\nAnalytics Endpoints:`);
console.log(`  GET /analytics/summary      - Summary statistics`);
console.log(`  GET /analytics/activity     - Activity by time period`);
console.log(`  GET /analytics/top-contacts - Top contacts by interaction`);
console.log(`\nBackend: PostgreSQL (FTS + pgvector)`);
console.log(`Model: Qwen3-Embedding-8B (4096 dimensions, port 8081)`);
