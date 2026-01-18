/**
 * PostgreSQL Client Utilities for pgvector
 *
 * Provides semantic search, similarity operations, and vector database utilities.
 * Uses Qwen3-VL-Embedding-8B (4096 dimensions) via port 8081.
 */

import { SQL } from "bun";
import { generateEmbedding } from "./qwen3vl-client";

const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings";

// Singleton connection
let _sql: SQL | null = null;

/**
 * Get or create PostgreSQL connection
 */
export function getConnection(): SQL {
  if (!_sql) {
    _sql = new SQL(POSTGRES_URL);
  }
  return _sql;
}

/**
 * Close the PostgreSQL connection
 */
export async function closeConnection(): Promise<void> {
  if (_sql) {
    await _sql.close();
    _sql = null;
  }
}

/**
 * Search result from vector similarity search
 */
export interface VectorSearchResult {
  id: number;
  filePath: string;
  filename: string;
  area: string;
  category: string;
  chunkIndex: number;
  chunkText: string;
  chunkSize: number;
  speakers: string[] | null;
  similarity: number;
  source: "file" | "email" | "slack";
}

/**
 * Email search result with email-specific metadata
 */
export interface EmailSearchResult {
  id: number;
  emailId: string;
  emailPath: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  toEmails: string[];
  date: string;
  labels: string[];
  hasAttachments: boolean;
  isReply: boolean;
  chunkIndex: number;
  chunkText: string;
  similarity: number;
}

/**
 * Slack search result with conversation metadata
 */
export interface SlackSearchResult {
  id: number;
  channel: string;
  channelType: string;
  speakers: string[];
  userIds: string[];
  date: string;
  messageCount: number;
  hasFiles: boolean;
  hasReactions: boolean;
  chunkIndex: number;
  chunkText: string;
  similarity: number;
}

/**
 * Semantic search across all content sources
 * Uses cosine distance for similarity (lower = more similar)
 */
export async function semanticSearch(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
    sources?: ("file" | "email" | "slack")[];
    area?: string;
    extension?: string;
    pathPrefix?: string;
  } = {}
): Promise<VectorSearchResult[]> {
  const { limit = 20, threshold = 0.8, sources = ["file", "email", "slack"], area, extension, pathPrefix } = options;

  const sql = getConnection();
  const embedding = await generateEmbedding(query);
  const vectorLiteral = `[${embedding.join(",")}]`;

  const results: VectorSearchResult[] = [];

  // Search files if included
  if (sources.includes("file")) {
    const areaFilter = area ? `AND area = '${area}'` : "";
    const extFilter = extension ? `AND file_path LIKE '%.${extension}'` : "";
    const pathFilter = pathPrefix ? `AND file_path LIKE '%${pathPrefix}%'` : "";
    const fileResults = await sql.unsafe(`
      SELECT
        id,
        file_path,
        filename,
        area,
        category,
        chunk_index,
        chunk_text,
        chunk_size,
        speakers,
        1 - (embedding <=> $1::vector) as similarity
      FROM chunks
      WHERE 1 - (embedding <=> $1::vector) > $2
      ${areaFilter}
      ${extFilter}
      ${pathFilter}
      ORDER BY embedding <=> $1::vector
      LIMIT $3
    `, [vectorLiteral, threshold, limit]);

    for (const row of fileResults) {
      results.push({
        id: row.id,
        filePath: row.file_path,
        filename: row.filename,
        area: row.area,
        category: row.category,
        chunkIndex: row.chunk_index,
        chunkText: row.chunk_text,
        chunkSize: row.chunk_size,
        speakers: row.speakers,
        similarity: row.similarity,
        source: "file"
      });
    }
  }

  // Search emails if included
  if (sources.includes("email")) {
    const emailResults = await sql.unsafe(`
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
        chunk_text,
        1 - (embedding <=> $1::vector) as similarity
      FROM email_chunks
      WHERE 1 - (embedding <=> $1::vector) > $2
      ORDER BY embedding <=> $1::vector
      LIMIT $3
    `, [vectorLiteral, threshold, limit]);

    for (const row of emailResults) {
      results.push({
        id: row.id,
        filePath: row.email_path,
        filename: row.subject,
        area: "Email",
        category: (row.labels || [])[0] || "Inbox",
        chunkIndex: row.chunk_index,
        chunkText: row.chunk_text,
        chunkSize: row.chunk_text?.length || 0,
        speakers: [row.from_name || row.from_email],
        similarity: row.similarity,
        source: "email"
      });
    }
  }

  // Search slack if included
  if (sources.includes("slack")) {
    const slackResults = await sql.unsafe(`
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
        chunk_text,
        1 - (embedding <=> $1::vector) as similarity
      FROM slack_chunks
      WHERE 1 - (embedding <=> $1::vector) > $2
      ORDER BY embedding <=> $1::vector
      LIMIT $3
    `, [vectorLiteral, threshold, limit]);

    for (const row of slackResults) {
      results.push({
        id: row.id,
        filePath: `slack://${row.channel}`,
        filename: row.channel,
        area: "Slack",
        category: row.channel_type,
        chunkIndex: row.chunk_index,
        chunkText: row.chunk_text,
        chunkSize: row.chunk_text?.length || 0,
        speakers: row.speakers,
        similarity: row.similarity,
        source: "slack"
      });
    }
  }

  // Sort all results by similarity and return top N
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, limit);
}

/**
 * Search emails specifically with full metadata
 */
export async function searchEmails(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
    fromEmail?: string;
    label?: string;
    hasAttachments?: boolean;
  } = {}
): Promise<EmailSearchResult[]> {
  const { limit = 20, threshold = 0.7, fromEmail, label, hasAttachments } = options;

  const sql = getConnection();
  const embedding = await generateEmbedding(query);
  const vectorLiteral = `[${embedding.join(",")}]`;

  let whereClause = `WHERE 1 - (embedding <=> $1::vector) > $2`;
  const params: any[] = [vectorLiteral, threshold, limit];
  let paramIndex = 4;

  if (fromEmail) {
    whereClause += ` AND from_email = $${paramIndex}`;
    params.push(fromEmail);
    paramIndex++;
  }

  if (label) {
    whereClause += ` AND $${paramIndex} = ANY(labels)`;
    params.push(label);
    paramIndex++;
  }

  if (hasAttachments !== undefined) {
    whereClause += ` AND has_attachments = $${paramIndex}`;
    params.push(hasAttachments);
    paramIndex++;
  }

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
      chunk_text,
      1 - (embedding <=> $1::vector) as similarity
    FROM email_chunks
    ${whereClause}
    ORDER BY embedding <=> $1::vector
    LIMIT $3
  `, params);

  return results.map((row: any) => ({
    id: row.id,
    emailId: row.email_id,
    emailPath: row.email_path,
    subject: row.subject,
    fromName: row.from_name,
    fromEmail: row.from_email,
    toEmails: row.to_emails || [],
    date: row.email_date,
    labels: row.labels || [],
    hasAttachments: row.has_attachments,
    isReply: row.is_reply,
    chunkIndex: row.chunk_index,
    chunkText: row.chunk_text,
    similarity: row.similarity
  }));
}

/**
 * Search Slack conversations with metadata
 */
export async function searchSlack(
  query: string,
  options: {
    limit?: number;
    threshold?: number;
    channel?: string;
    speaker?: string;
  } = {}
): Promise<SlackSearchResult[]> {
  const { limit = 20, threshold = 0.7, channel, speaker } = options;

  const sql = getConnection();
  const embedding = await generateEmbedding(query);
  const vectorLiteral = `[${embedding.join(",")}]`;

  let whereClause = `WHERE 1 - (embedding <=> $1::vector) > $2`;
  const params: any[] = [vectorLiteral, threshold, limit];
  let paramIndex = 4;

  if (channel) {
    whereClause += ` AND channel = $${paramIndex}`;
    params.push(channel);
    paramIndex++;
  }

  if (speaker) {
    whereClause += ` AND $${paramIndex} = ANY(speakers)`;
    params.push(speaker);
    paramIndex++;
  }

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
      chunk_text,
      1 - (embedding <=> $1::vector) as similarity
    FROM slack_chunks
    ${whereClause}
    ORDER BY embedding <=> $1::vector
    LIMIT $3
  `, params);

  return results.map((row: any) => ({
    id: row.id,
    channel: row.channel,
    channelType: row.channel_type,
    speakers: row.speakers || [],
    userIds: row.user_ids || [],
    date: row.message_date,
    messageCount: row.message_count,
    hasFiles: row.has_files,
    hasReactions: row.has_reactions,
    chunkIndex: row.chunk_index,
    chunkText: row.chunk_text,
    similarity: row.similarity
  }));
}

/**
 * Get database statistics
 */
export async function getVectorStats(): Promise<{
  chunks: number;
  emails: number;
  slack: number;
  total: number;
}> {
  const sql = getConnection();

  const [chunksResult, emailsResult, slackResult] = await Promise.all([
    sql`SELECT COUNT(*)::int as count FROM chunks`,
    sql`SELECT COUNT(*)::int as count FROM email_chunks`,
    sql`SELECT COUNT(*)::int as count FROM slack_chunks`
  ]);

  const chunks = (chunksResult[0] as any).count;
  const emails = (emailsResult[0] as any).count;
  const slack = (slackResult[0] as any).count;

  return {
    chunks,
    emails,
    slack,
    total: chunks + emails + slack
  };
}

/**
 * Find similar chunks to a given chunk ID
 */
export async function findSimilar(
  table: "chunks" | "email_chunks" | "slack_chunks",
  id: number,
  limit: number = 10
): Promise<{ id: number; similarity: number; text: string }[]> {
  const sql = getConnection();

  const textColumn = table === "chunks" ? "chunk_text" : "chunk_text";

  const results = await sql.unsafe(`
    WITH source AS (
      SELECT embedding FROM ${table} WHERE id = $1
    )
    SELECT
      t.id,
      t.${textColumn} as text,
      1 - (t.embedding <=> source.embedding) as similarity
    FROM ${table} t, source
    WHERE t.id != $1
    ORDER BY t.embedding <=> source.embedding
    LIMIT $2
  `, [id, limit]);

  return results.map((row: any) => ({
    id: row.id,
    similarity: row.similarity,
    text: row.text
  }));
}

/**
 * Build IVFFlat indexes after data is loaded
 * Should be called after initial indexing completes
 */
export async function buildIndexes(): Promise<void> {
  const sql = getConnection();
  console.log("Building IVFFlat indexes (this may take a while)...");

  await sql`SELECT build_vector_indexes()`;

  console.log("✅ Vector indexes built successfully");
}

// Export connection URL for debugging
export { POSTGRES_URL };
