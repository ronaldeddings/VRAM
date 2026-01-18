/**
 * Context Optimizer Service
 *
 * Intelligently optimizes Claude conversation logs by:
 * - Ranking message importance with multi-factor scoring
 * - Summarizing large tool results
 * - Deduplicating content (within and across conversations)
 * - Preserving conversation coherence for session resumption
 * - Supporting multi-source optimization
 */

import type {
  ConversationEntry,
  ConversationSource,
  ConversationIndex,
} from './multi-conversation-analyzer';
import {
  buildConversationIndex,
  getDuplicatePatterns,
  getFrequentFilePatterns,
} from './multi-conversation-analyzer';

// =====================================
// Optimization Configuration Types
// =====================================

/** Optimization level presets */
export type OptimizationLevel =
  | 'minimal'       // 10-20% reduction, very conservative
  | 'balanced'      // 30-50% reduction, recommended default
  | 'aggressive'    // 50-70% reduction, more aggressive
  | 'maximum';      // 70-85% reduction, maximum compression

/** Optimization strategy options */
export interface OptimizationOptions {
  /** Optimization level (or custom thresholds) */
  level: OptimizationLevel | 'custom';

  /** Custom importance threshold (0.0-1.0) if level is 'custom' */
  customThreshold?: number;

  /** Always preserve recent messages (last N messages) */
  preserveRecentCount?: number;

  /** Always preserve all user messages */
  preserveAllUserMessages?: boolean;

  /** Summarize large tool results (>N characters) */
  summarizeLargeResults?: number;

  /** Enable cross-conversation deduplication */
  crossConversationDedup?: boolean;

  /** Enable pattern detection for frequently accessed files */
  patternDetection?: boolean;

  /** Enable intelligent partial content extraction */
  partialExtraction?: boolean;

  /** Multi-source mode: analyze multiple conversations */
  multiSource?: {
    /** Multiple conversation sources to analyze */
    sources: ConversationSource[];
    /** Strategy for merging conversations */
    mergeStrategy: 'best-of-each' | 'chronological' | 'importance-ranked';
  };

  /** Preserve specific entry UUIDs */
  preserveUuids?: string[];

  /** Maximum output size in characters (soft limit) */
  maxOutputSize?: number;
}

/** Optimization result with statistics */
export interface OptimizationResult {
  /** Optimized conversation entries */
  optimized: ConversationEntry[];

  /** Original entry count */
  originalCount: number;

  /** Optimized entry count */
  optimizedCount: number;

  /** Reduction percentage */
  reductionPercent: number;

  /** Original size in characters */
  originalSize: number;

  /** Optimized size in characters */
  optimizedSize: number;

  /** Size reduction percentage */
  sizeReductionPercent: number;

  /** Statistics about what was optimized */
  statistics: {
    /** Number of messages summarized */
    summarizedMessages: number;
    /** Number of deduplicated entries */
    deduplicatedEntries: number;
    /** Number of low-importance entries removed */
    removedLowImportance: number;
    /** Number of partial extractions performed */
    partialExtractions?: number;
    /** Cross-conversation duplicates found */
    crossConvDuplicates?: number;
    /** Patterns detected */
    patternsDetected?: number;
  };

  /** Warnings about potential issues */
  warnings: string[];
}

/** Detailed optimization report */
export interface OptimizationReport {
  /** Summary statistics */
  summary: {
    level: OptimizationLevel | 'custom';
    threshold: number;
    originalEntries: number;
    optimizedEntries: number;
    reductionPercent: number;
    originalSizeMB: number;
    optimizedSizeMB: number;
    sizeReductionPercent: number;
  };

  /** Breakdown by operation type */
  operations: {
    summarized: number;
    deduplicated: number;
    removedLowImportance: number;
    preserved: number;
    partialExtractions?: number;
  };

  /** Cross-conversation insights (if multi-source) */
  crossConversation?: {
    totalConversations: number;
    duplicatesFound: number;
    bestInstancesSelected: number;
    frequentFilesDetected: number;
    toolUsageStats: Array<{
      tool: string;
      count: number;
      percentage: number;
    }>;
  };

  /** Warnings and recommendations */
  warnings: string[];
  recommendations: string[];

  /** Processing time */
  processingTimeMs: number;
}

// =====================================
// Optimization Level Presets
// =====================================

/** Get importance threshold for optimization level */
export function getThresholdForLevel(level: OptimizationLevel): number {
  switch (level) {
    case 'minimal':
      return 0.8;  // Keep entries scoring 0.8 or higher
    case 'balanced':
      return 0.6;  // Keep entries scoring 0.6 or higher (recommended)
    case 'aggressive':
      return 0.4;  // Keep entries scoring 0.4 or higher
    case 'maximum':
      return 0.2;  // Keep entries scoring 0.2 or higher
  }
}

/** Get default options for optimization level */
export function getDefaultOptions(level: OptimizationLevel): OptimizationOptions {
  const baseOptions: OptimizationOptions = {
    level,
    preserveRecentCount: 50,           // Always keep last 50 messages
    preserveAllUserMessages: true,     // Never remove user messages
    summarizeLargeResults: 5000,       // Summarize results >5KB
    crossConversationDedup: false,     // Disabled by default
    patternDetection: false,           // Disabled by default
    partialExtraction: true,           // Enabled by default
  };

  // Adjust based on level
  switch (level) {
    case 'minimal':
      return {
        ...baseOptions,
        preserveRecentCount: 100,
        summarizeLargeResults: 10000,
      };
    case 'balanced':
      return baseOptions;
    case 'aggressive':
      return {
        ...baseOptions,
        preserveRecentCount: 30,
        summarizeLargeResults: 3000,
      };
    case 'maximum':
      return {
        ...baseOptions,
        preserveRecentCount: 20,
        preserveAllUserMessages: false, // Can remove some user messages
        summarizeLargeResults: 2000,
      };
  }
}

// =====================================
// Core Optimization Functions
// =====================================

/**
 * Optimize a single conversation
 */
export async function optimizeConversation(
  entries: ConversationEntry[],
  options: OptimizationOptions
): Promise<OptimizationResult> {
  const startTime = Date.now();
  const originalCount = entries.length;
  const originalSize = calculateTotalSize(entries);

  // Get threshold
  const threshold = options.level === 'custom' && options.customThreshold
    ? options.customThreshold
    : getThresholdForLevel(options.level as OptimizationLevel);

  // Apply optimizations (will be implemented in Phase 2)
  const optimized = entries; // Placeholder - full implementation in Phase 2

  const optimizedCount = optimized.length;
  const optimizedSize = calculateTotalSize(optimized);

  return {
    optimized,
    originalCount,
    optimizedCount,
    reductionPercent: ((originalCount - optimizedCount) / originalCount) * 100,
    originalSize,
    optimizedSize,
    sizeReductionPercent: ((originalSize - optimizedSize) / originalSize) * 100,
    statistics: {
      summarizedMessages: 0,
      deduplicatedEntries: 0,
      removedLowImportance: 0,
    },
    warnings: [],
  };
}

/**
 * Optimize multiple conversations and optionally merge
 */
export async function optimizeMultipleConversations(
  sources: ConversationSource[],
  options: OptimizationOptions
): Promise<OptimizationResult> {
  const startTime = Date.now();

  // Build cross-conversation index
  const index = buildConversationIndex(sources);

  // Get duplicate patterns
  const duplicates = getDuplicatePatterns(index);
  const frequentFiles = getFrequentFilePatterns(index);

  // Optimize based on merge strategy
  let optimized: ConversationEntry[];

  switch (options.multiSource?.mergeStrategy) {
    case 'best-of-each':
      optimized = await optimizeBestOfEach(sources, index, options);
      break;
    case 'chronological':
      optimized = await optimizeChronological(sources, index, options);
      break;
    case 'importance-ranked':
      optimized = await optimizeByImportance(sources, index, options);
      break;
    default:
      optimized = await optimizeBestOfEach(sources, index, options);
  }

  // Calculate statistics
  const originalCount = sources.reduce((sum, s) => sum + s.entries.length, 0);
  const originalSize = sources.reduce(
    (sum, s) => sum + calculateTotalSize(s.entries),
    0
  );
  const optimizedSize = calculateTotalSize(optimized);

  return {
    optimized,
    originalCount,
    optimizedCount: optimized.length,
    reductionPercent: ((originalCount - optimized.length) / originalCount) * 100,
    originalSize,
    optimizedSize,
    sizeReductionPercent: ((originalSize - optimizedSize) / originalSize) * 100,
    statistics: {
      summarizedMessages: 0,
      deduplicatedEntries: duplicates.length,
      removedLowImportance: 0,
      crossConvDuplicates: duplicates.length,
      patternsDetected: frequentFiles.length,
    },
    warnings: [],
  };
}

/**
 * Generate detailed optimization report
 */
export function generateOptimizationReport(
  result: OptimizationResult,
  options: OptimizationOptions,
  processingTimeMs: number,
  index?: ConversationIndex
): OptimizationReport {
  const threshold = options.level === 'custom' && options.customThreshold
    ? options.customThreshold
    : getThresholdForLevel(options.level as OptimizationLevel);

  const report: OptimizationReport = {
    summary: {
      level: options.level,
      threshold,
      originalEntries: result.originalCount,
      optimizedEntries: result.optimizedCount,
      reductionPercent: result.reductionPercent,
      originalSizeMB: result.originalSize / (1024 * 1024),
      optimizedSizeMB: result.optimizedSize / (1024 * 1024),
      sizeReductionPercent: result.sizeReductionPercent,
    },
    operations: {
      summarized: result.statistics.summarizedMessages,
      deduplicated: result.statistics.deduplicatedEntries,
      removedLowImportance: result.statistics.removedLowImportance,
      preserved: result.optimizedCount,
      partialExtractions: result.statistics.partialExtractions,
    },
    warnings: result.warnings,
    recommendations: generateRecommendations(result, options),
    processingTimeMs,
  };

  // Add cross-conversation insights if available
  if (index) {
    const toolStats = Array.from(index.toolUsageFrequency.entries())
      .map(([tool, count]) => {
        const total = Array.from(index.toolUsageFrequency.values())
          .reduce((sum, c) => sum + c, 0);
        return {
          tool,
          count,
          percentage: (count / total) * 100,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10

    report.crossConversation = {
      totalConversations: index.sources.length,
      duplicatesFound: result.statistics.crossConvDuplicates || 0,
      bestInstancesSelected: result.statistics.crossConvDuplicates || 0,
      frequentFilesDetected: result.statistics.patternsDetected || 0,
      toolUsageStats: toolStats,
    };
  }

  return report;
}

// =====================================
// Helper Functions
// =====================================

/**
 * Calculate total size of entries in characters
 */
function calculateTotalSize(entries: ConversationEntry[]): number {
  return entries.reduce((sum, entry) => {
    return sum + JSON.stringify(entry).length;
  }, 0);
}

/**
 * Optimize by selecting best instances from each conversation
 */
async function optimizeBestOfEach(
  sources: ConversationSource[],
  index: ConversationIndex,
  options: OptimizationOptions
): Promise<ConversationEntry[]> {
  // Placeholder - will be implemented in Phase 2
  return sources[0]?.entries || [];
}

/**
 * Optimize by chronological order across conversations
 */
async function optimizeChronological(
  sources: ConversationSource[],
  index: ConversationIndex,
  options: OptimizationOptions
): Promise<ConversationEntry[]> {
  // Placeholder - will be implemented in Phase 2
  return sources[0]?.entries || [];
}

/**
 * Optimize by importance ranking across conversations
 */
async function optimizeByImportance(
  sources: ConversationSource[],
  index: ConversationIndex,
  options: OptimizationOptions
): Promise<ConversationEntry[]> {
  // Placeholder - will be implemented in Phase 2
  return sources[0]?.entries || [];
}

/**
 * Generate recommendations based on optimization results
 */
function generateRecommendations(
  result: OptimizationResult,
  options: OptimizationOptions
): string[] {
  const recommendations: string[] = [];

  // Check if reduction is too aggressive
  if (result.reductionPercent > 80) {
    recommendations.push(
      'Very high reduction rate. Consider using a less aggressive optimization level.'
    );
  }

  // Check if reduction is too minimal
  if (result.reductionPercent < 10) {
    recommendations.push(
      'Low reduction rate. Consider using a more aggressive optimization level for better compression.'
    );
  }

  // Recommend cross-conversation dedup if not enabled
  if (!options.crossConversationDedup && options.multiSource) {
    recommendations.push(
      'Enable --cross-session-dedup flag for better optimization across multiple conversations.'
    );
  }

  // Recommend pattern detection if not enabled
  if (!options.patternDetection && options.multiSource) {
    recommendations.push(
      'Enable --pattern-detection flag to identify frequently accessed files.'
    );
  }

  return recommendations;
}
