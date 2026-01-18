/**
 * Hybrid Search Module - PostgreSQL Version
 *
 * Combines PostgreSQL tsvector (keyword search) with PostgreSQL pgvector (semantic search).
 * Uses Reciprocal Rank Fusion (RRF) for result merging.
 *
 * All search is now unified in PostgreSQL for multi-agent concurrency.
 */

import { semanticSearch, type VectorSearchResult } from "./pg-client";
import {
  keywordSearch as pgKeywordSearch,
  unifiedKeywordSearch,
  getDocument,
  browseByArea as pgBrowseByArea,
  getFTSStats as pgGetFTSStats,
  type FTSResult,
  type UnifiedFTSResult
} from "./pg-fts";

// Re-export FTSResult type for backward compatibility
export type { FTSResult };

/**
 * Combined hybrid search result
 */
export interface HybridResult {
  path: string;
  filename: string;
  area: string;
  category: string;
  snippet: string;
  source: "file" | "transcript" | "email" | "slack";
  combinedScore: number;
  ftsScore: number;
  semanticScore: number;
  speakers?: string[];
}

// Re-export UnifiedFTSResult for server.ts
export type { UnifiedFTSResult };

/**
 * Perform keyword search using PostgreSQL FTS
 */
export async function keywordSearch(
  query: string,
  options: { limit?: number; offset?: number; area?: string; pathPrefix?: string } = {}
): Promise<FTSResult[]> {
  return pgKeywordSearch(query, options);
}

/**
 * Reciprocal Rank Fusion (RRF) for combining rankings
 * RRF(d) = Σ 1 / (k + rank(d)) where k=60 by default
 */
function rrfScore(rank: number, k: number = 60): number {
  return 1 / (k + rank);
}

/**
 * Perform hybrid search combining PostgreSQL FTS and pgvector
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
    sources?: ("file" | "transcript" | "email" | "slack")[];
    semanticThreshold?: number;
    pathPrefix?: string;
    speaker?: string;
  } = {}
): Promise<HybridResult[]> {
  const {
    limit = 20,
    ftsWeight = 0.4,
    semanticWeight = 0.6,
    strategy = "rrf",
    area,
    sources = ["file", "transcript", "email", "slack"],
    semanticThreshold = 0.5,
    pathPrefix,
    speaker
  } = options;

  // Fetch more results than needed for better fusion
  const fetchLimit = limit * 3;

  // Map sources for semantic search (transcript maps to file source in pg-client)
  const semanticSources = sources.map(s => s === "transcript" ? "file" : s) as ("file" | "email" | "slack")[];
  const uniqueSemanticSources = [...new Set(semanticSources)];

  // Run both searches in parallel
  const [ftsResults, vectorResults] = await Promise.all([
    unifiedKeywordSearch(query, { limit: fetchLimit, sources, area, speaker }),
    semanticSearch(query, { limit: fetchLimit, sources: uniqueSemanticSources, threshold: semanticThreshold, area, pathPrefix })
  ]);

  // Score map: path -> scores
  const scoreMap = new Map<string, {
    ftsRank: number | null;
    semanticRank: number | null;
    ftsResult: UnifiedFTSResult | null;
    vectorResult: VectorSearchResult | null;
  }>();

  // Add FTS results with rank (use path as key, may include source type prefix for uniqueness)
  ftsResults.forEach((result, index) => {
    const key = `${result.source}:${result.path}`;
    scoreMap.set(key, {
      ftsRank: index,
      semanticRank: null,
      ftsResult: result,
      vectorResult: null
    });
  });

  // Add semantic results with rank
  vectorResults.forEach((result, index) => {
    // Determine source type for key matching
    const sourceType = result.source || "file";
    const key = `${sourceType}:${result.filePath}`;
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

  for (const [key, data] of scoreMap) {
    // Extract actual path from key (format: "source:path")
    const colonIndex = key.indexOf(":");
    const path = colonIndex >= 0 ? key.substring(colonIndex + 1) : key;
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

    // Determine filename - use title for unified results, filename for vector
    const filename = fts?.title || vec?.filename || path.split("/").pop() || "";

    // Determine source - prioritize FTS source (which includes transcript), fallback to vector
    const resultSource = fts?.source || vec?.source || "file";

    combined.push({
      path,
      filename,
      area: fts?.area || vec?.area || "Unknown",
      category: fts?.category || vec?.category || "",
      snippet: fts?.snippet || vec?.chunkText?.substring(0, 200) || "",
      source: resultSource as "file" | "transcript" | "email" | "slack",
      combinedScore,
      ftsScore,
      semanticScore,
      speakers: fts?.metadata?.speakers || vec?.speakers || undefined
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
    pgKeywordSearch(query, { limit: limit * 2 }),
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
 * Get file metadata from PostgreSQL
 */
export async function getFileMetadata(path: string): Promise<{
  path: string;
  filename: string;
  area: string;
  category: string;
  extension: string;
  fileSize: number;
  modifiedAt: string;
  content: string | null;
} | null> {
  const doc = await getDocument(path);
  if (!doc) return null;

  return {
    path: doc.path,
    filename: doc.filename,
    area: doc.area,
    category: doc.category,
    extension: doc.extension,
    fileSize: doc.fileSize,
    modifiedAt: doc.modifiedAt,
    content: doc.content
  };
}

/**
 * Browse files by area using PostgreSQL
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
  return pgBrowseByArea(area, options);
}

/**
 * Get FTS database statistics from PostgreSQL
 */
export async function getFTSStats(): Promise<{
  totalFiles: number;
  totalSize: number;
  areas: number;
  categories: number;
  lastIndexed: string;
}> {
  return pgGetFTSStats();
}

/**
 * No-op for backward compatibility - PostgreSQL connections are managed by pg-client
 */
export function closeFTSDb(): void {
  // PostgreSQL connection management is handled by pg-client.ts
  // This function remains for backward compatibility
}
