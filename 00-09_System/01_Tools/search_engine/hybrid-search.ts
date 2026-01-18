/**
 * Hybrid Search Module
 *
 * Combines SQLite FTS5 (keyword search) with PostgreSQL pgvector (semantic search).
 * Uses Reciprocal Rank Fusion (RRF) for result merging.
 */

import { Database } from "bun:sqlite";
import { semanticSearch, type VectorSearchResult } from "./pg-client";

const SEARCH_DB = "/Volumes/VRAM/00-09_System/00_Index/search.db";

// FTS5 database connection
let _ftsDb: Database | null = null;

function getFTSDb(): Database {
  if (!_ftsDb) {
    _ftsDb = new Database(SEARCH_DB, { readonly: true });
    _ftsDb.run("PRAGMA journal_mode = WAL;");
  }
  return _ftsDb;
}

export function closeFTSDb(): void {
  if (_ftsDb) {
    _ftsDb.close();
    _ftsDb = null;
  }
}

/**
 * FTS5 search result
 */
export interface FTSResult {
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
 * Combined hybrid search result
 */
export interface HybridResult {
  path: string;
  filename: string;
  area: string;
  category: string;
  snippet: string;
  source: "file" | "email" | "slack";
  combinedScore: number;
  ftsScore: number;
  semanticScore: number;
  speakers?: string[];
}

/**
 * Perform FTS5 full-text search
 */
export function keywordSearch(
  query: string,
  options: { limit?: number; offset?: number; area?: string; pathPrefix?: string } = {}
): FTSResult[] {
  const { limit = 20, offset = 0, area, pathPrefix } = options;
  const db = getFTSDb();

  let results: any[];

  // Build dynamic WHERE clause based on filters
  let whereClause = "files_fts MATCH $query";
  const params: any = { $query: query, $limit: limit, $offset: offset };

  if (area) {
    whereClause += " AND files.area = $area";
    params.$area = area;
  }

  if (pathPrefix) {
    whereClause += " AND files.path LIKE $pathPrefix";
    params.$pathPrefix = pathPrefix + '%';
  }

  const stmt = db.prepare(`
    SELECT
      files.path,
      files.filename,
      files.area,
      files.category,
      files.extension,
      files.file_size,
      files.modified_at,
      snippet(files_fts, 2, '→', '←', '...', 40) as snippet,
      rank
    FROM files_fts
    JOIN files ON files_fts.rowid = files.id
    WHERE ${whereClause}
    ORDER BY rank
    LIMIT $limit
    OFFSET $offset
  `);
  results = stmt.all(params);

  return results.map(r => ({
    path: r.path,
    filename: r.filename,
    area: r.area,
    category: r.category,
    extension: r.extension,
    fileSize: r.file_size,
    modifiedAt: r.modified_at,
    snippet: r.snippet,
    rank: r.rank
  }));
}

/**
 * Reciprocal Rank Fusion (RRF) for combining rankings
 * RRF(d) = Σ 1 / (k + rank(d)) where k=60 by default
 */
function rrfScore(rank: number, k: number = 60): number {
  return 1 / (k + rank);
}

/**
 * Normalize scores to 0-1 range
 */
function normalizeScores(scores: number[]): number[] {
  if (scores.length === 0) return [];
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = max - min || 1;
  return scores.map(s => (s - min) / range);
}

/**
 * Perform hybrid search combining FTS5 and pgvector
 *
 * Strategy options:
 * - "rrf": Reciprocal Rank Fusion (default, best for diverse results)
 * - "weighted": Simple weighted combination
 * - "max": Take max score from either source
 */
export async function hybridSearch(
  query: string,
  options: {
    limit?: number;
    ftsWeight?: number;
    semanticWeight?: number;
    strategy?: "rrf" | "weighted" | "max";
    area?: string;
    sources?: ("file" | "email" | "slack")[];
    semanticThreshold?: number;
    pathPrefix?: string;
  } = {}
): Promise<HybridResult[]> {
  const {
    limit = 20,
    ftsWeight = 0.4,
    semanticWeight = 0.6,
    strategy = "rrf",
    area,
    sources = ["file", "email", "slack"],
    semanticThreshold = 0.5,
    pathPrefix
  } = options;

  // Fetch more results than needed for better fusion
  const fetchLimit = limit * 3;

  // Run both searches in parallel
  const [ftsResults, vectorResults] = await Promise.all([
    Promise.resolve(keywordSearch(query, { limit: fetchLimit, area, pathPrefix })),
    semanticSearch(query, { limit: fetchLimit, sources, threshold: semanticThreshold, area, pathPrefix })
  ]);

  // Score map: path -> scores
  const scoreMap = new Map<string, {
    ftsRank: number | null;
    semanticRank: number | null;
    ftsResult: FTSResult | null;
    vectorResult: VectorSearchResult | null;
  }>();

  // Add FTS results with rank
  ftsResults.forEach((result, index) => {
    scoreMap.set(result.path, {
      ftsRank: index,
      semanticRank: null,
      ftsResult: result,
      vectorResult: null
    });
  });

  // Add semantic results with rank
  vectorResults.forEach((result, index) => {
    const key = result.filePath;
    const existing = scoreMap.get(key);
    if (existing) {
      existing.semanticRank = index;
      existing.vectorResult = result;
    } else {
      scoreMap.set(key, {
        ftsRank: null,
        semanticRank: index,
        ftsResult: null,
        vectorResult: result
      });
    }
  });

  // Calculate combined scores based on strategy
  const combined: HybridResult[] = [];

  for (const [path, data] of scoreMap) {
    let ftsScore = 0;
    let semanticScore = 0;
    let combinedScore = 0;

    switch (strategy) {
      case "rrf":
        // RRF: higher is better
        ftsScore = data.ftsRank !== null ? rrfScore(data.ftsRank) : 0;
        semanticScore = data.semanticRank !== null ? rrfScore(data.semanticRank) : 0;
        combinedScore = (ftsScore * ftsWeight) + (semanticScore * semanticWeight);
        break;

      case "weighted":
        // Normalize ranks to 0-1 (inverse rank, so 0 = best)
        ftsScore = data.ftsRank !== null
          ? 1 - (data.ftsRank / Math.max(ftsResults.length, 1))
          : 0;
        semanticScore = data.semanticRank !== null
          ? 1 - (data.semanticRank / Math.max(vectorResults.length, 1))
          : 0;
        combinedScore = (ftsScore * ftsWeight) + (semanticScore * semanticWeight);
        break;

      case "max":
        ftsScore = data.ftsRank !== null
          ? 1 - (data.ftsRank / Math.max(ftsResults.length, 1))
          : 0;
        semanticScore = data.vectorResult?.similarity || 0;
        combinedScore = Math.max(ftsScore * ftsWeight, semanticScore * semanticWeight);
        break;
    }

    // Build result from available data
    const fts = data.ftsResult;
    const vec = data.vectorResult;

    combined.push({
      path,
      filename: fts?.filename || vec?.filename || path.split("/").pop() || "",
      area: fts?.area || vec?.area || "Unknown",
      category: fts?.category || vec?.category || "",
      snippet: fts?.snippet || vec?.chunkText?.substring(0, 200) || "",
      source: vec?.source || "file",
      combinedScore,
      ftsScore,
      semanticScore,
      speakers: vec?.speakers || undefined
    });
  }

  // Sort by combined score (descending) and limit
  combined.sort((a, b) => b.combinedScore - a.combinedScore);
  return combined.slice(0, limit);
}

/**
 * Explain search results - show why each result matched
 */
export async function explainSearch(
  query: string,
  options: { limit?: number } = {}
): Promise<{
  query: string;
  ftsMatches: number;
  semanticMatches: number;
  fusedResults: number;
  results: Array<HybridResult & {
    matchReason: string;
  }>;
}> {
  const { limit = 10 } = options;

  const [ftsResults, vectorResults, hybridResults] = await Promise.all([
    Promise.resolve(keywordSearch(query, { limit: limit * 2 })),
    semanticSearch(query, { limit: limit * 2, threshold: 0.5 }),
    hybridSearch(query, { limit })
  ]);

  const ftsSet = new Set(ftsResults.map(r => r.path));
  const semanticSet = new Set(vectorResults.map(r => r.filePath));

  const explained = hybridResults.map(r => {
    const inFTS = ftsSet.has(r.path);
    const inSemantic = semanticSet.has(r.path);

    let matchReason: string;
    if (inFTS && inSemantic) {
      matchReason = "Matched both keyword and semantic search";
    } else if (inFTS) {
      matchReason = "Matched keyword search only (exact terms found)";
    } else {
      matchReason = "Matched semantic search only (conceptually similar)";
    }

    return { ...r, matchReason };
  });

  return {
    query,
    ftsMatches: ftsResults.length,
    semanticMatches: vectorResults.length,
    fusedResults: hybridResults.length,
    results: explained
  };
}

/**
 * Multi-query search - search with multiple related queries and merge
 */
export async function multiQuerySearch(
  queries: string[],
  options: { limit?: number; dedup?: boolean } = {}
): Promise<HybridResult[]> {
  const { limit = 20, dedup = true } = options;

  // Search all queries in parallel
  const allResults = await Promise.all(
    queries.map(q => hybridSearch(q, { limit: Math.ceil(limit / queries.length) * 2 }))
  );

  // Merge and optionally deduplicate
  const merged: HybridResult[] = [];
  const seen = new Set<string>();

  for (const results of allResults) {
    for (const result of results) {
      if (dedup && seen.has(result.path)) {
        // Update score if this occurrence is higher
        const existing = merged.find(r => r.path === result.path);
        if (existing && result.combinedScore > existing.combinedScore) {
          existing.combinedScore = result.combinedScore;
        }
        continue;
      }
      seen.add(result.path);
      merged.push(result);
    }
  }

  // Re-sort and limit
  merged.sort((a, b) => b.combinedScore - a.combinedScore);
  return merged.slice(0, limit);
}

/**
 * Get file metadata from FTS database
 */
export function getFileMetadata(path: string): {
  path: string;
  filename: string;
  area: string;
  category: string;
  extension: string;
  fileSize: number;
  modifiedAt: string;
  content: string | null;
} | null {
  const db = getFTSDb();
  const stmt = db.prepare("SELECT * FROM files WHERE path = $path");
  const result = stmt.get({ $path: path }) as any;

  if (!result) return null;

  return {
    path: result.path,
    filename: result.filename,
    area: result.area,
    category: result.category,
    extension: result.extension,
    fileSize: result.file_size,
    modifiedAt: result.modified_at,
    content: result.content
  };
}

/**
 * Browse files by area using FTS database
 */
export function browseByArea(
  area: string,
  options: { limit?: number } = {}
): Array<{
  path: string;
  filename: string;
  category: string;
  extension: string;
  fileSize: number;
  modifiedAt: string;
}> {
  const { limit = 50 } = options;
  const db = getFTSDb();

  const stmt = db.prepare(`
    SELECT path, filename, category, extension, file_size, modified_at
    FROM files
    WHERE area = $area
    ORDER BY modified_at DESC
    LIMIT $limit
  `);

  const results = stmt.all({ $area: area, $limit: limit }) as any[];

  return results.map(r => ({
    path: r.path,
    filename: r.filename,
    category: r.category,
    extension: r.extension,
    fileSize: r.file_size,
    modifiedAt: r.modified_at
  }));
}

/**
 * Get FTS database statistics
 */
export function getFTSStats(): {
  totalFiles: number;
  totalSize: number;
  areas: number;
  categories: number;
  lastIndexed: string;
} {
  const db = getFTSDb();

  const stmt = db.prepare(`
    SELECT
      COUNT(*) as total_files,
      SUM(file_size) as total_size,
      COUNT(DISTINCT area) as areas,
      COUNT(DISTINCT category) as categories,
      MAX(indexed_at) as last_indexed
    FROM files
  `);

  const result = stmt.get() as any;

  return {
    totalFiles: result.total_files,
    totalSize: result.total_size,
    areas: result.areas,
    categories: result.categories,
    lastIndexed: result.last_indexed
  };
}
