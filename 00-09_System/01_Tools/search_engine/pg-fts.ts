/**
 * PostgreSQL Full-Text Search Client
 *
 * Provides keyword search using PostgreSQL tsvector/tsquery.
 * Replaces SQLite FTS5 for multi-agent concurrency support.
 */

import { getConnection } from "./pg-client";

/**
 * FTS search result (matches SQLite FTS interface)
 */
export interface FTSResult {
  id: number;
  path: string;
  filename: string;
  area: string;
  category: string;
  extension: string;
  fileSize: number;
  modifiedAt: string;
  snippet: string;
  rank: number;
}

/**
 * Unified FTS result from any source
 */
export interface UnifiedFTSResult {
  id: number;
  source: "file" | "transcript" | "email" | "slack";
  path: string;
  title: string;
  snippet: string;
  area: string;
  category: string;
  rank: number;
  metadata: Record<string, any>;
}

/**
 * Document for indexing
 */
export interface DocumentInput {
  path: string;
  filename: string;
  extension: string;
  content: string;
  fileSize: number;
  modifiedAt: Date;
  area: string;
  category: string;
  contentType?: "file" | "transcript";
}

/**
 * Convert user query to PostgreSQL tsquery format
 * Handles common search patterns:
 * - Simple words: "meeting notes" -> "meeting & notes"
 * - Phrases: '"exact phrase"' -> "'exact phrase'"
 * - OR: "meeting OR notes" -> "meeting | notes"
 * - Prefix: "meet*" -> "meet:*"
 * - NOT: "meeting NOT notes" -> "meeting & !notes"
 */
function toTsQuery(query: string): string {
  // Handle quoted phrases
  let processed = query.replace(/"([^"]+)"/g, (_, phrase) => {
    return `'${phrase.trim()}'`;
  });

  // Handle OR (case insensitive)
  processed = processed.replace(/\bOR\b/gi, '|');

  // Handle NOT
  processed = processed.replace(/\bNOT\s+(\w+)/gi, '& !$1');

  // Handle prefix wildcards
  processed = processed.replace(/(\w+)\*/g, '$1:*');

  // Split remaining words and join with AND
  const words = processed.split(/\s+/).filter(w => w.length > 0);

  // Join with & if not already operators
  const result = words.map((word, i) => {
    if (word === '|' || word === '&' || word.startsWith('!')) {
      return word;
    }
    // Add & before word if previous word wasn't an operator
    if (i > 0 && words[i-1] !== '|' && words[i-1] !== '&') {
      return `& ${word}`;
    }
    return word;
  }).join(' ');

  return result || query;
}

/**
 * Perform full-text search using PostgreSQL
 */
export async function keywordSearch(
  query: string,
  options: {
    limit?: number;
    offset?: number;
    area?: string;
    extension?: string;
    pathPrefix?: string;
    contentType?: 'file' | 'transcript';
  } = {}
): Promise<FTSResult[]> {
  const { limit = 20, offset = 0, area, extension, pathPrefix, contentType } = options;
  const sql = getConnection();

  const tsQuery = toTsQuery(query);

  try {
    const results = await sql.unsafe(`
      SELECT
        id,
        path,
        filename,
        area,
        category,
        extension,
        file_size,
        modified_at,
        ts_headline('english', content, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM documents
      WHERE search_vector @@ to_tsquery('english', $1)
        AND ($2::text IS NULL OR area = $2)
        AND ($3::text IS NULL OR extension = $3)
        AND ($4::text IS NULL OR path LIKE $4 || '%')
        AND ($5::text IS NULL OR content_type = $5)
      ORDER BY rank DESC
      LIMIT $6
      OFFSET $7
    `, [tsQuery, area || null, extension || null, pathPrefix || null, contentType || null, limit, offset]);

    return results.map((row: any) => ({
      id: row.id,
      path: row.path,
      filename: row.filename,
      area: row.area || '',
      category: row.category || '',
      extension: row.extension || '',
      fileSize: row.file_size || 0,
      modifiedAt: row.modified_at?.toISOString() || '',
      snippet: row.snippet || '',
      rank: row.rank || 0
    }));
  } catch (error) {
    // If tsquery fails (invalid syntax), fall back to simple plainto_tsquery
    console.warn(`tsquery failed for "${tsQuery}", falling back to plainto_tsquery`);

    const results = await sql.unsafe(`
      SELECT
        id,
        path,
        filename,
        area,
        category,
        extension,
        file_size,
        modified_at,
        ts_headline('english', content, plainto_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank
      FROM documents
      WHERE search_vector @@ plainto_tsquery('english', $1)
        AND ($2::text IS NULL OR area = $2)
        AND ($3::text IS NULL OR extension = $3)
        AND ($4::text IS NULL OR path LIKE $4 || '%')
        AND ($5::text IS NULL OR content_type = $5)
      ORDER BY rank DESC
      LIMIT $6
      OFFSET $7
    `, [query, area || null, extension || null, pathPrefix || null, contentType || null, limit, offset]);

    return results.map((row: any) => ({
      id: row.id,
      path: row.path,
      filename: row.filename,
      area: row.area || '',
      category: row.category || '',
      extension: row.extension || '',
      fileSize: row.file_size || 0,
      modifiedAt: row.modified_at?.toISOString() || '',
      snippet: row.snippet || '',
      rank: row.rank || 0
    }));
  }
}

/**
 * Index a document into PostgreSQL
 */
export async function indexDocument(doc: DocumentInput): Promise<number> {
  const sql = getConnection();

  const contentType = doc.contentType || "file";

  const result = await sql`
    INSERT INTO documents (path, filename, extension, content, file_size, modified_at, area, category, content_type)
    VALUES (${doc.path}, ${doc.filename}, ${doc.extension}, ${doc.content}, ${doc.fileSize}, ${doc.modifiedAt}, ${doc.area}, ${doc.category}, ${contentType})
    ON CONFLICT (path) DO UPDATE SET
      filename = EXCLUDED.filename,
      extension = EXCLUDED.extension,
      content = EXCLUDED.content,
      file_size = EXCLUDED.file_size,
      modified_at = EXCLUDED.modified_at,
      area = EXCLUDED.area,
      category = EXCLUDED.category,
      content_type = EXCLUDED.content_type,
      indexed_at = NOW()
    RETURNING id
  `;

  return (result[0] as any).id;
}

/**
 * Index multiple documents in a batch
 */
export async function indexDocumentsBatch(docs: DocumentInput[]): Promise<number[]> {
  const sql = getConnection();
  const ids: number[] = [];

  // Process in batches of 100
  const BATCH_SIZE = 100;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);

    for (const doc of batch) {
      const contentType = doc.contentType || "file";
      const result = await sql`
        INSERT INTO documents (path, filename, extension, content, file_size, modified_at, area, category, content_type)
        VALUES (${doc.path}, ${doc.filename}, ${doc.extension}, ${doc.content}, ${doc.fileSize}, ${doc.modifiedAt}, ${doc.area}, ${doc.category}, ${contentType})
        ON CONFLICT (path) DO UPDATE SET
          filename = EXCLUDED.filename,
          extension = EXCLUDED.extension,
          content = EXCLUDED.content,
          file_size = EXCLUDED.file_size,
          modified_at = EXCLUDED.modified_at,
          area = EXCLUDED.area,
          category = EXCLUDED.category,
          content_type = EXCLUDED.content_type,
          indexed_at = NOW()
        RETURNING id
      `;
      ids.push((result[0] as any).id);
    }
  }

  return ids;
}

/**
 * Delete a document by path
 */
export async function deleteDocument(path: string): Promise<boolean> {
  const sql = getConnection();

  const result = await sql`
    DELETE FROM documents WHERE path = ${path}
  `;

  return result.count > 0;
}

/**
 * Get document by path
 */
export async function getDocument(path: string): Promise<{
  id: number;
  path: string;
  filename: string;
  area: string;
  category: string;
  extension: string;
  fileSize: number;
  modifiedAt: string;
  content: string | null;
} | null> {
  const sql = getConnection();

  const results = await sql`
    SELECT id, path, filename, area, category, extension, file_size, modified_at, content
    FROM documents
    WHERE path = ${path}
  `;

  if (results.length === 0) return null;

  const row = results[0] as any;
  return {
    id: row.id,
    path: row.path,
    filename: row.filename,
    area: row.area || '',
    category: row.category || '',
    extension: row.extension || '',
    fileSize: row.file_size || 0,
    modifiedAt: row.modified_at?.toISOString() || '',
    content: row.content
  };
}

/**
 * Browse files by area
 */
export async function browseByArea(
  area: string,
  options: { limit?: number } = {}
): Promise<Array<{
  path: string;
  filename: string;
  category: string;
  extension: string;
  fileSize: number;
  modifiedAt: string;
}>> {
  const { limit = 50 } = options;
  const sql = getConnection();

  const results = await sql`
    SELECT path, filename, category, extension, file_size, modified_at
    FROM documents
    WHERE area = ${area}
    ORDER BY modified_at DESC
    LIMIT ${limit}
  `;

  return results.map((row: any) => ({
    path: row.path,
    filename: row.filename,
    category: row.category || '',
    extension: row.extension || '',
    fileSize: row.file_size || 0,
    modifiedAt: row.modified_at?.toISOString() || ''
  }));
}

/**
 * Get FTS database statistics
 */
export async function getFTSStats(): Promise<{
  totalFiles: number;
  totalSize: number;
  areas: number;
  categories: number;
  lastIndexed: string;
}> {
  const sql = getConnection();

  const results = await sql`
    SELECT
      COUNT(*)::int as total_files,
      COALESCE(SUM(file_size), 0)::bigint as total_size,
      COUNT(DISTINCT area)::int as areas,
      COUNT(DISTINCT category)::int as categories,
      MAX(indexed_at) as last_indexed
    FROM documents
  `;

  const row = results[0] as any;
  return {
    totalFiles: row.total_files || 0,
    totalSize: Number(row.total_size) || 0,
    areas: row.areas || 0,
    categories: row.categories || 0,
    lastIndexed: row.last_indexed?.toISOString() || ''
  };
}

/**
 * Link documents to their chunks for hybrid search
 */
export async function linkDocumentsToChunks(): Promise<number> {
  const sql = getConnection();

  const result = await sql`
    UPDATE chunks c
    SET document_id = d.id
    FROM documents d
    WHERE c.file_path = d.path
      AND c.document_id IS NULL
  `;

  return result.count;
}

/**
 * Search transcripts using FTS (from chunks table)
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
      title: row.filename || row.file_path?.split('/').pop() || 'Unknown',
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
      title: row.subject || 'No Subject',
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
        date: row.email_date?.toISOString?.() || row.email_date,
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
      category: row.channel_type || "channel",
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
 * Unified keyword search across all sources with enhanced filtering
 */
export async function unifiedKeywordSearch(
  query: string,
  options: {
    limit?: number;
    sources?: ("file" | "transcript" | "email" | "slack")[];
    area?: string;
    extension?: string;
    speaker?: string;
    // Enhanced filters
    year?: number;
    month?: number;
    quarter?: number;
    person?: string;
    company?: string;
    sentByMe?: boolean;
    hasAttachments?: boolean;
    isInternal?: boolean;
  } = {}
): Promise<UnifiedFTSResult[]> {
  const {
    limit = 20,
    sources = ["file", "transcript", "email", "slack"],
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
  } = options;

  const searches: Promise<UnifiedFTSResult[]>[] = [];
  const sql = getConnection();

  // Search files (non-transcript documents)
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

  // Search transcripts with enhanced filters
  if (sources.includes("transcript")) {
    searches.push(searchTranscriptsFTSEnhanced(query, {
      limit, speaker, year, month, quarter, person, company, isInternal
    }));
  }

  // Search emails with enhanced filters
  if (sources.includes("email")) {
    searches.push(searchEmailsFTSEnhanced(query, {
      limit, year, month, quarter, person, company, sentByMe, hasAttachments
    }));
  }

  // Search Slack with enhanced filters
  if (sources.includes("slack")) {
    searches.push(searchSlackFTSEnhanced(query, {
      limit, speaker, year, month, quarter, person, company
    }));
  }

  // Execute all searches in parallel
  const allResults = await Promise.all(searches);

  // Flatten and sort by rank
  const results: UnifiedFTSResult[] = [];
  for (const sourceResults of allResults) {
    results.push(...sourceResults);
  }

  results.sort((a, b) => b.rank - a.rank);

  return results.slice(0, limit);
}

/**
 * Enhanced email FTS search with new filters
 */
async function searchEmailsFTSEnhanced(
  query: string,
  options: {
    limit?: number;
    year?: number;
    month?: number;
    quarter?: number;
    person?: string;
    company?: string;
    sentByMe?: boolean;
    hasAttachments?: boolean;
  } = {}
): Promise<UnifiedFTSResult[]> {
  const { limit = 20, year, month, quarter, person, company, sentByMe, hasAttachments } = options;
  const sql = getConnection();
  const tsQuery = toTsQuery(query);

  try {
    // Build dynamic WHERE clause
    let whereConditions = [`search_vector @@ to_tsquery('english', $1)`];
    const params: any[] = [tsQuery];
    let paramIndex = 2;

    if (year !== undefined) {
      whereConditions.push(`year = $${paramIndex++}`);
      params.push(year);
    }
    if (month !== undefined) {
      whereConditions.push(`month = $${paramIndex++}`);
      params.push(month);
    }
    if (quarter !== undefined) {
      whereConditions.push(`quarter = $${paramIndex++}`);
      params.push(quarter);
    }
    if (sentByMe !== undefined) {
      whereConditions.push(`is_sent_by_me = $${paramIndex++}`);
      params.push(sentByMe);
    }
    if (hasAttachments !== undefined) {
      whereConditions.push(`(attachment_count > 0) = $${paramIndex++}`);
      params.push(hasAttachments);
    }
    if (person) {
      whereConditions.push(`(from_name ILIKE $${paramIndex} OR from_email ILIKE $${paramIndex})`);
      params.push(`%${person}%`);
      paramIndex++;
    }
    if (company) {
      // Search company in sender domain, recipient domains, and content
      whereConditions.push(`(
        from_email ILIKE $${paramIndex} OR
        array_to_string(to_emails, ',') ILIKE $${paramIndex} OR
        chunk_text ILIKE $${paramIndex}
      )`);
      params.push(`%${company}%`);
      paramIndex++;
    }

    params.push(limit);

    const results = await sql.unsafe(`
      SELECT
        id, email_id, email_path, subject, from_name, from_email, to_emails,
        email_date, labels, has_attachments, is_reply, is_sent_by_me,
        cc_emails, attachment_count, year, month, chunk_index,
        ts_headline('english', chunk_text, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM email_chunks
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY rank DESC
      LIMIT $${paramIndex}
    `, params);

    return results.map((row: any) => ({
      id: row.id,
      source: "email" as const,
      path: `email://${row.email_id}`,
      title: row.subject || 'No Subject',
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
        ccEmails: row.cc_emails,
        date: row.email_date?.toISOString?.() || row.email_date,
        labels: row.labels,
        hasAttachments: row.has_attachments,
        attachmentCount: row.attachment_count,
        isReply: row.is_reply,
        isSentByMe: row.is_sent_by_me,
        year: row.year,
        month: row.month,
        chunkIndex: row.chunk_index
      }
    }));
  } catch (error) {
    console.warn(`Enhanced Email FTS failed: ${error}`);
    return [];
  }
}

/**
 * Enhanced Slack FTS search with new filters
 */
async function searchSlackFTSEnhanced(
  query: string,
  options: {
    limit?: number;
    speaker?: string;
    year?: number;
    month?: number;
    quarter?: number;
    person?: string;
    company?: string;
  } = {}
): Promise<UnifiedFTSResult[]> {
  const { limit = 20, speaker, year, month, quarter, person, company } = options;
  const sql = getConnection();
  const tsQuery = toTsQuery(query);

  try {
    let whereConditions = [`search_vector @@ to_tsquery('english', $1)`];
    const params: any[] = [tsQuery];
    let paramIndex = 2;

    if (year !== undefined) {
      whereConditions.push(`year = $${paramIndex++}`);
      params.push(year);
    }
    if (month !== undefined) {
      whereConditions.push(`month = $${paramIndex++}`);
      params.push(month);
    }
    if (quarter !== undefined) {
      whereConditions.push(`quarter = $${paramIndex++}`);
      params.push(quarter);
    }
    if (speaker) {
      whereConditions.push(`$${paramIndex++} = ANY(speakers)`);
      params.push(speaker);
    }
    if (person) {
      whereConditions.push(`EXISTS (SELECT 1 FROM unnest(real_names) rn WHERE rn ILIKE $${paramIndex++})`);
      params.push(`%${person}%`);
    }
    if (company) {
      // Search company in companies array and content
      whereConditions.push(`(
        EXISTS (SELECT 1 FROM unnest(companies) co WHERE co ILIKE $${paramIndex}) OR
        chunk_text ILIKE $${paramIndex}
      )`);
      params.push(`%${company}%`);
      paramIndex++;
    }

    params.push(limit);

    const results = await sql.unsafe(`
      SELECT
        id, channel, channel_type, speakers, user_ids, message_date,
        message_count, has_files, has_reactions, chunk_index, year, month,
        real_names, companies, is_edited, thread_ts,
        ts_headline('english', chunk_text, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(search_vector, to_tsquery('english', $1)) AS rank
      FROM slack_chunks
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY rank DESC
      LIMIT $${paramIndex}
    `, params);

    return results.map((row: any) => ({
      id: row.id,
      source: "slack" as const,
      path: `slack://${row.channel}/${row.message_date}`,
      title: `#${row.channel}`,
      snippet: row.snippet || '',
      area: "Slack",
      category: row.channel_type || "channel",
      rank: row.rank || 0,
      metadata: {
        channel: row.channel,
        channelType: row.channel_type,
        speakers: row.speakers,
        realNames: row.real_names,
        companies: row.companies,
        userIds: row.user_ids,
        date: row.message_date,
        messageCount: row.message_count,
        hasFiles: row.has_files,
        hasReactions: row.has_reactions,
        isEdited: row.is_edited,
        threadTs: row.thread_ts,
        year: row.year,
        month: row.month,
        chunkIndex: row.chunk_index
      }
    }));
  } catch (error) {
    console.warn(`Enhanced Slack FTS failed: ${error}`);
    return [];
  }
}

/**
 * Enhanced transcript FTS search with new filters
 */
async function searchTranscriptsFTSEnhanced(
  query: string,
  options: {
    limit?: number;
    speaker?: string;
    year?: number;
    month?: number;
    quarter?: number;
    person?: string;
    company?: string;
    isInternal?: boolean;
  } = {}
): Promise<UnifiedFTSResult[]> {
  const { limit = 20, speaker, year, month, quarter, person, company, isInternal } = options;
  const sql = getConnection();
  const tsQuery = toTsQuery(query);

  try {
    let whereConditions = [
      `c.search_vector @@ to_tsquery('english', $1)`,
      `c.content_type = 'transcript'`
    ];
    const params: any[] = [tsQuery];
    let paramIndex = 2;

    if (speaker) {
      whereConditions.push(`$${paramIndex++} = ANY(c.speakers)`);
      params.push(speaker);
    }
    if (year !== undefined) {
      whereConditions.push(`(c.year = $${paramIndex} OR tm.year = $${paramIndex})`);
      params.push(year);
      paramIndex++;
    }
    if (month !== undefined) {
      whereConditions.push(`(c.month = $${paramIndex} OR tm.month = $${paramIndex})`);
      params.push(month);
      paramIndex++;
    }
    if (quarter !== undefined) {
      whereConditions.push(`(c.quarter = $${paramIndex} OR tm.quarter = $${paramIndex})`);
      params.push(quarter);
      paramIndex++;
    }
    if (isInternal !== undefined) {
      whereConditions.push(`tm.is_internal = $${paramIndex++}`);
      params.push(isInternal);
    }
    if (person) {
      whereConditions.push(`(
        EXISTS (SELECT 1 FROM unnest(c.speakers) s WHERE s ILIKE $${paramIndex})
        OR EXISTS (
          SELECT 1 FROM meeting_participants mp
          JOIN contacts ct ON ct.id = mp.contact_id
          WHERE mp.meeting_id = tm.id AND ct.name ILIKE $${paramIndex}
        )
      )`);
      params.push(`%${person}%`);
      paramIndex++;
    }
    if (company) {
      whereConditions.push(`EXISTS (
        SELECT 1 FROM meeting_participants mp
        JOIN contacts ct ON ct.id = mp.contact_id
        JOIN companies co ON co.id = ct.company_id
        WHERE mp.meeting_id = tm.id AND co.name ILIKE $${paramIndex}
      )`);
      params.push(`%${company}%`);
      paramIndex++;
    }

    params.push(limit);

    const results = await sql.unsafe(`
      SELECT
        c.id, c.file_path, c.chunk_index, c.speakers, c.start_time, c.end_time,
        c.document_id, c.year, c.month,
        d.filename, d.area, d.category,
        tm.meeting_id AS fathom_meeting_id, tm.title AS meeting_title,
        tm.is_internal, tm.duration_minutes, tm.participant_count,
        ts_headline('english', c.chunk_text, to_tsquery('english', $1),
          'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(c.search_vector, to_tsquery('english', $1)) AS rank
      FROM chunks c
      LEFT JOIN documents d ON c.document_id = d.id
      LEFT JOIN transcript_meetings tm ON c.meeting_id = tm.id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY rank DESC
      LIMIT $${paramIndex}
    `, params);

    return results.map((row: any) => ({
      id: row.id,
      source: "transcript" as const,
      path: row.file_path,
      title: row.meeting_title || row.filename || row.file_path?.split('/').pop() || 'Unknown',
      snippet: row.snippet || '',
      area: row.area || "Work",
      category: row.category || "Meetings",
      rank: row.rank || 0,
      metadata: {
        speakers: row.speakers,
        startTime: row.start_time,
        endTime: row.end_time,
        chunkIndex: row.chunk_index,
        documentId: row.document_id,
        meetingId: row.fathom_meeting_id,
        isInternal: row.is_internal,
        duration: row.duration_minutes,
        participantCount: row.participant_count,
        year: row.year,
        month: row.month
      }
    }));
  } catch (error) {
    console.warn(`Enhanced Transcript FTS failed: ${error}`);
    return [];
  }
}
