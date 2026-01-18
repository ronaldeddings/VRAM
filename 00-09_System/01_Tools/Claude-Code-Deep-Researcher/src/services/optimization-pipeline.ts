/**
 * Optimization Pipeline
 *
 * Orchestrates the complete optimization process:
 * 1. Load conversation(s) from JSONL
 * 2. Build cross-conversation index (if multi-source)
 * 3. Score all messages
 * 4. Apply partial content extraction
 * 5. Deduplicate content
 * 6. Filter by importance threshold
 * 7. Write optimized JSONL
 * 8. Generate report
 */

import { readFile, writeFile } from 'fs/promises';
import { JSONLParser } from './jsonl-parser';
import type { ConversationEntry } from '../types/claude-conversation';
import type { ConversationSource, ConversationIndex } from './multi-conversation-analyzer';
import {
  buildConversationIndex,
  getDuplicatePatterns,
  findBestInstance,
} from './multi-conversation-analyzer';
import type {
  OptimizationOptions,
  OptimizationResult,
  OptimizationReport,
} from './context-optimizer';
import {
  getThresholdForLevel,
  generateOptimizationReport,
} from './context-optimizer';
import type { MessageScore, ScoringConfig } from './message-scoring-engine';
import {
  DEFAULT_SCORING_CONFIG,
  scoreAllEntries,
} from './message-scoring-engine';
import type { ExtractionConfig } from './partial-content-extractor';
import {
  DEFAULT_EXTRACTION_CONFIG,
  applyPartialExtraction,
} from './partial-content-extractor';
import {
  recalculateConversationTokens,
  type RecalculationStats,
} from './token-calculator';

// =====================================
// Pipeline Configuration
// =====================================

export interface PipelineConfig {
  /** Optimization options */
  optimization: OptimizationOptions;

  /** Scoring configuration */
  scoring?: ScoringConfig;

  /** Extraction configuration */
  extraction?: ExtractionConfig;

  /** Enable verbose logging */
  verbose?: boolean;

  /** Dry run (don't write output) */
  dryRun?: boolean;
}

export interface PipelineResult {
  /** Optimization result */
  result: OptimizationResult;

  /** Detailed report */
  report: OptimizationReport;

  /** Path where optimized file was written (if not dry run) */
  outputPath?: string;

  /** Execution time */
  executionTimeMs: number;
}

// =====================================
// Main Pipeline Function
// =====================================

/**
 * Run optimization pipeline on single conversation
 */
export async function optimizeSingleConversation(
  inputPath: string,
  outputPath: string,
  config: PipelineConfig
): Promise<PipelineResult> {
  const startTime = Date.now();

  if (config.verbose) {
    console.log(`[Pipeline] Starting single conversation optimization`);
    console.log(`[Pipeline] Input: ${inputPath}`);
    console.log(`[Pipeline] Output: ${outputPath}`);
    console.log(`[Pipeline] Level: ${config.optimization.level}`);
  }

  // Step 1: Load conversation
  if (config.verbose) console.log(`[Pipeline] Step 1: Loading conversation...`);
  const entries = await loadConversation(inputPath);
  const originalCount = entries.length;

  if (config.verbose) {
    console.log(`[Pipeline] Loaded ${originalCount} entries`);
  }

  // Step 2: Score all messages
  if (config.verbose) console.log(`[Pipeline] Step 2: Scoring messages...`);
  const scoringConfig = config.scoring || DEFAULT_SCORING_CONFIG;
  const scores = scoreAllEntries(entries, scoringConfig);

  // Step 3: Apply partial content extraction
  if (config.verbose) console.log(`[Pipeline] Step 3: Extracting relevant content...`);
  let extractionCount = 0;
  const extractedEntries = await applyPartialExtractionToEntries(
    entries,
    config.extraction || DEFAULT_EXTRACTION_CONFIG
  );

  extractionCount = extractedEntries.filter((e, i) => e !== entries[i]).length;

  if (config.verbose) {
    console.log(`[Pipeline] Extracted content from ${extractionCount} entries`);
  }

  // Step 4: Filter by importance threshold
  if (config.verbose) console.log(`[Pipeline] Step 4: Filtering by importance...`);
  const threshold = config.optimization.level === 'custom' && config.optimization.customThreshold
    ? config.optimization.customThreshold
    : getThresholdForLevel(config.optimization.level as any);

  const preserveRecent = config.optimization.preserveRecentCount || 50;

  const optimized = filterByImportance(
    extractedEntries,
    scores,
    threshold,
    preserveRecent,
    config.optimization.preserveAllUserMessages !== false
  );

  if (config.verbose) {
    console.log(`[Pipeline] Filtered to ${optimized.length} entries (${((originalCount - optimized.length) / originalCount * 100).toFixed(1)}% reduction)`);
  }

  // Step 5: Recalculate token usage
  if (config.verbose) console.log(`[Pipeline] Step 5: Recalculating token usage...`);
  const { entries: recalculatedEntries, stats: tokenStats } = recalculateConversationTokens(optimized);
  if (config.verbose) {
    console.log(`[Pipeline] Token recalculation complete:`);
    console.log(`  - Processed ${tokenStats.entriesProcessed} entries`);
    console.log(`  - New total input tokens: ${tokenStats.totalInputTokens.toLocaleString()}`);
    console.log(`  - New total output tokens: ${tokenStats.totalOutputTokens.toLocaleString()}`);
    console.log(`  - Original input tokens: ${tokenStats.originalInputTokens.toLocaleString()}`);
    console.log(`  - Token reduction: ${tokenStats.tokenReduction.toLocaleString()} (${tokenStats.percentReduction.toFixed(1)}%)`);
  }

  // Step 6: Write optimized JSONL with recalculated tokens
  if (!config.dryRun) {
    if (config.verbose) console.log(`[Pipeline] Step 6: Writing optimized JSONL...`);
    await writeConversation(outputPath, recalculatedEntries);
    if (config.verbose) console.log(`[Pipeline] Written to ${outputPath}`);
  } else {
    if (config.verbose) console.log(`[Pipeline] Dry run - skipping write`);
  }

  // Step 7: Generate results
  const result: OptimizationResult = {
    optimized: recalculatedEntries,
    originalCount,
    optimizedCount: optimized.length,
    reductionPercent: ((originalCount - optimized.length) / originalCount) * 100,
    originalSize: calculateSize(entries),
    optimizedSize: calculateSize(optimized),
    sizeReductionPercent: 0, // Will be calculated
    statistics: {
      summarizedMessages: 0,
      deduplicatedEntries: 0,
      removedLowImportance: originalCount - optimized.length,
      partialExtractions: extractionCount,
    },
    warnings: [],
  };

  result.sizeReductionPercent = ((result.originalSize - result.optimizedSize) / result.originalSize) * 100;

  const executionTime = Date.now() - startTime;
  const report = generateOptimizationReport(result, config.optimization, executionTime);

  return {
    result,
    report,
    outputPath: config.dryRun ? undefined : outputPath,
    executionTimeMs: executionTime,
  };
}

/**
 * Run optimization pipeline on multiple conversations
 */
export async function optimizeMultipleConversations(
  inputPaths: string[],
  outputPath: string,
  config: PipelineConfig
): Promise<PipelineResult> {
  const startTime = Date.now();

  if (config.verbose) {
    console.log(`[Pipeline] Starting multi-conversation optimization`);
    console.log(`[Pipeline] Inputs: ${inputPaths.length} files`);
    console.log(`[Pipeline] Output: ${outputPath}`);
    console.log(`[Pipeline] Merge strategy: ${config.optimization.multiSource?.mergeStrategy || 'best-of-each'}`);
  }

  // Step 1: Load all conversations
  if (config.verbose) console.log(`[Pipeline] Step 1: Loading conversations...`);
  const sources: ConversationSource[] = [];

  for (const path of inputPaths) {
    const entries = await loadConversation(path);
    sources.push({
      filePath: path,
      entries,
      sessionId: extractSessionId(entries),
      label: path.split('/').pop() || path,
    });
  }

  const totalOriginal = sources.reduce((sum, s) => sum + s.entries.length, 0);

  if (config.verbose) {
    console.log(`[Pipeline] Loaded ${sources.length} conversations with ${totalOriginal} total entries`);
  }

  // Step 2: Build cross-conversation index
  if (config.verbose) console.log(`[Pipeline] Step 2: Building cross-conversation index...`);
  const index = buildConversationIndex(sources);

  if (config.verbose) {
    console.log(`[Pipeline] Index built: ${index.contentPatterns.size} unique patterns`);
    console.log(`[Pipeline] Found ${getDuplicatePatterns(index).length} duplicate patterns`);
  }

  // Step 3: Score all messages with cross-conversation context
  if (config.verbose) console.log(`[Pipeline] Step 3: Scoring messages across conversations...`);
  const scoringConfig = {
    ...DEFAULT_SCORING_CONFIG,
    ...config.scoring,
    enableCrossConversation: true,
  };

  const allScores = new Map<string, MessageScore[]>();

  for (const source of sources) {
    const scores = scoreAllEntries(source.entries, scoringConfig, index);
    allScores.set(source.sessionId, scores);
  }

  // Step 4: Apply deduplication across conversations
  if (config.verbose) console.log(`[Pipeline] Step 4: Deduplicating across conversations...`);
  const deduplicatedSources = await deduplicateAcrossConversations(sources, index);

  // Step 5: Merge based on strategy
  if (config.verbose) console.log(`[Pipeline] Step 5: Merging conversations...`);
  const mergeStrategy = config.optimization.multiSource?.mergeStrategy || 'best-of-each';
  const merged = await mergeConversations(deduplicatedSources, allScores, mergeStrategy, index);

  if (config.verbose) {
    console.log(`[Pipeline] Merged to ${merged.length} entries`);
  }

  // Step 6: Apply partial extraction
  if (config.verbose) console.log(`[Pipeline] Step 6: Extracting relevant content...`);
  const extracted = await applyPartialExtractionToEntries(
    merged,
    config.extraction || DEFAULT_EXTRACTION_CONFIG
  );

  // Step 7: Recalculate token usage
  if (config.verbose) console.log(`[Pipeline] Step 7: Recalculating token usage...`);
  const { entries: recalculatedEntries, stats: tokenStats } = recalculateConversationTokens(extracted);
  if (config.verbose) {
    console.log(`[Pipeline] Token recalculation complete:`);
    console.log(`  - Processed ${tokenStats.entriesProcessed} entries`);
    console.log(`  - New total input tokens: ${tokenStats.totalInputTokens.toLocaleString()}`);
    console.log(`  - New total output tokens: ${tokenStats.totalOutputTokens.toLocaleString()}`);
    console.log(`  - Original input tokens: ${tokenStats.originalInputTokens.toLocaleString()}`);
    console.log(`  - Token reduction: ${tokenStats.tokenReduction.toLocaleString()} (${tokenStats.percentReduction.toFixed(1)}%)`);
  }

  // Step 8: Write optimized JSONL
  if (!config.dryRun) {
    if (config.verbose) console.log(`[Pipeline] Step 8: Writing optimized JSONL...`);
    await writeConversation(outputPath, recalculatedEntries);
    if (config.verbose) console.log(`[Pipeline] Written to ${outputPath}`);
  }

  // Step 9: Generate results
  const result: OptimizationResult = {
    optimized: recalculatedEntries,
    originalCount: totalOriginal,
    optimizedCount: recalculatedEntries.length,
    reductionPercent: ((totalOriginal - recalculatedEntries.length) / totalOriginal) * 100,
    originalSize: sources.reduce((sum, s) => sum + calculateSize(s.entries), 0),
    optimizedSize: calculateSize(recalculatedEntries),
    sizeReductionPercent: 0,
    statistics: {
      summarizedMessages: 0,
      deduplicatedEntries: getDuplicatePatterns(index).length,
      removedLowImportance: totalOriginal - extracted.length,
      crossConvDuplicates: getDuplicatePatterns(index).length,
      patternsDetected: index.fileReadPatterns.size,
    },
    warnings: [],
  };

  result.sizeReductionPercent = ((result.originalSize - result.optimizedSize) / result.originalSize) * 100;

  const executionTime = Date.now() - startTime;
  const report = generateOptimizationReport(result, config.optimization, executionTime, index);

  return {
    result,
    report,
    outputPath: config.dryRun ? undefined : outputPath,
    executionTimeMs: executionTime,
  };
}

// =====================================
// Helper Functions
// =====================================

/**
 * Load conversation from JSONL file
 */
async function loadConversation(filePath: string): Promise<ConversationEntry[]> {
  const parser = new JSONLParser();
  const entries: ConversationEntry[] = [];

  for await (const entry of parser.parseFile(filePath)) {
    entries.push(entry);
  }

  return entries;
}

/**
 * Write conversation to JSONL file
 */
async function writeConversation(
  filePath: string,
  entries: ConversationEntry[]
): Promise<void> {
  const lines = entries.map(entry => JSON.stringify(entry)).join('\n');
  await writeFile(filePath, lines + '\n', 'utf-8');
}

/**
 * Extract session ID from conversation entries
 */
function extractSessionId(entries: ConversationEntry[]): string {
  const firstEntry = entries.find(e => 'sessionId' in e);
  return firstEntry && 'sessionId' in firstEntry ? firstEntry.sessionId : 'unknown';
}

/**
 * Calculate total size of entries
 */
function calculateSize(entries: ConversationEntry[]): number {
  return entries.reduce((sum, entry) => sum + JSON.stringify(entry).length, 0);
}

/**
 * Filter entries by importance score
 */
function filterByImportance(
  entries: ConversationEntry[],
  scores: MessageScore[],
  threshold: number,
  preserveRecentCount: number,
  preserveAllUserMessages: boolean
): ConversationEntry[] {
  const filtered: ConversationEntry[] = [];

  entries.forEach((entry, index) => {
    const score = scores[index];

    // Force preserve
    if (score.forcePreserve && preserveAllUserMessages) {
      filtered.push(entry);
      return;
    }

    // Preserve recent messages
    if (index >= entries.length - preserveRecentCount) {
      filtered.push(entry);
      return;
    }

    // Preserve if score meets threshold
    if (score.finalScore >= threshold) {
      filtered.push(entry);
      return;
    }
  });

  return filtered;
}

/**
 * Apply partial extraction to all entries
 */
async function applyPartialExtractionToEntries(
  entries: ConversationEntry[],
  config: ExtractionConfig
): Promise<ConversationEntry[]> {
  return entries.map((entry, index) => {
    if (entry.type === 'user' && Array.isArray(entry.message.content)) {
      const modifiedContent = entry.message.content.map(content => {
        if (content.type === 'tool_result') {
          const extraction = applyPartialExtraction(content, index, entries, config);
          if (extraction.modified) {
            return {
              ...content,
              content: extraction.newContent,
            };
          }
        }
        return content;
      });

      return {
        ...entry,
        message: {
          ...entry.message,
          content: modifiedContent,
        },
      };
    }

    return entry;
  });
}

/**
 * Deduplicate content across conversations
 */
async function deduplicateAcrossConversations(
  sources: ConversationSource[],
  index: ConversationIndex
): Promise<ConversationSource[]> {
  const duplicates = getDuplicatePatterns(index);

  // For each duplicate pattern, keep only the best instance
  const removeSet = new Set<string>(); // UUIDs to remove

  for (const pattern of duplicates) {
    const bestOccurrence = pattern.occurrences[pattern.bestInstanceIndex];

    // Mark all other occurrences for removal
    pattern.occurrences.forEach((occurrence, idx) => {
      if (idx !== pattern.bestInstanceIndex) {
        removeSet.add(occurrence.entryUuid);
      }
    });
  }

  // Filter out marked entries
  return sources.map(source => ({
    ...source,
    entries: source.entries.filter(entry => {
      const uuid = 'uuid' in entry ? entry.uuid : '';
      return !removeSet.has(uuid);
    }),
  }));
}

/**
 * Merge conversations based on strategy
 */
async function mergeConversations(
  sources: ConversationSource[],
  scores: Map<string, MessageScore[]>,
  strategy: 'best-of-each' | 'chronological' | 'importance-ranked',
  index: ConversationIndex
): Promise<ConversationEntry[]> {
  switch (strategy) {
    case 'chronological':
      return mergeChronological(sources);
    case 'importance-ranked':
      return mergeByImportance(sources, scores);
    case 'best-of-each':
    default:
      return mergeBestOfEach(sources, scores);
  }
}

/**
 * Merge by chronological order
 */
function mergeChronological(sources: ConversationSource[]): ConversationEntry[] {
  const allEntries = sources.flatMap(s => s.entries);

  // Sort by timestamp
  return allEntries.sort((a, b) => {
    const timeA = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0;
    const timeB = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0;
    return timeA - timeB;
  });
}

/**
 * Merge by importance ranking
 */
function mergeByImportance(
  sources: ConversationSource[],
  scores: Map<string, MessageScore[]>
): ConversationEntry[] {
  const allWithScores: Array<{ entry: ConversationEntry; score: number }> = [];

  for (const source of sources) {
    const sourceScores = scores.get(source.sessionId) || [];
    source.entries.forEach((entry, index) => {
      allWithScores.push({
        entry,
        score: sourceScores[index]?.finalScore || 0,
      });
    });
  }

  // Sort by score descending
  allWithScores.sort((a, b) => b.score - a.score);

  return allWithScores.map(item => item.entry);
}

/**
 * Merge best of each conversation
 */
function mergeBestOfEach(
  sources: ConversationSource[],
  scores: Map<string, MessageScore[]>
): ConversationEntry[] {
  // Keep all user messages and high-scoring assistant messages
  const merged: ConversationEntry[] = [];

  for (const source of sources) {
    const sourceScores = scores.get(source.sessionId) || [];

    source.entries.forEach((entry, index) => {
      const score = sourceScores[index];

      // Keep user messages
      if (entry.type === 'user') {
        merged.push(entry);
      }
      // Keep high-scoring assistant messages
      else if (score && score.finalScore > 0.6) {
        merged.push(entry);
      }
      // Keep important system messages
      else if (entry.type === 'system' && entry.subtype === 'init') {
        merged.push(entry);
      }
    });
  }

  return merged;
}
