/**
 * Message Scoring Engine
 *
 * Multi-factor scoring system to rank message importance with:
 * - Position-based recency (NOT time-based)
 * - User intent detection
 * - Task criticality assessment
 * - Tool impact evaluation
 * - Content uniqueness
 * - Cross-conversation uniqueness
 * - Information quality
 * - Branch relevance
 * - Pattern frequency
 */

import type {
  ConversationEntry,
  UserMessageEntry,
  AssistantMessageEntry,
  ToolResultContent,
} from '../types/claude-conversation';
import type { ConversationIndex } from './multi-conversation-analyzer';

// =====================================
// Scoring Types
// =====================================

/** Individual scoring factors */
export interface ScoringFactors {
  /** Position-based recency: 1.0 - (position_from_end / total_messages) */
  recency: number;

  /** User intent strength (0.0-1.0) */
  userIntent: number;

  /** Task criticality (0.0-1.0) */
  taskCriticality: number;

  /** Tool impact/importance (0.0-1.0) */
  toolImpact: number;

  /** Content uniqueness within conversation (0.0-1.0) */
  uniqueness: number;

  /** Cross-conversation uniqueness (0.0-1.0) */
  crossConvUniqueness: number;

  /** Information quality (0.0-1.0) */
  informationQuality: number;

  /** Branch relevance (0.0-1.0) */
  branchRelevance: number;

  /** Pattern frequency (0.0-1.0) - lower for common patterns */
  patternFrequency: number;

  /** Content size factor (negative impact for very large content) */
  contentSize: number;
}

/** Message score with detailed breakdown */
export interface MessageScore {
  /** Entry UUID */
  uuid: string;

  /** Final weighted score (0.0-1.0) */
  finalScore: number;

  /** Individual factor scores */
  factors: ScoringFactors;

  /** Position in conversation (0 = start) */
  position: number;

  /** Total messages in conversation */
  totalMessages: number;

  /** Whether this message should be preserved regardless of score */
  forcePreserve: boolean;

  /** Reason for force preserve if applicable */
  preserveReason?: string;
}

/** Scoring configuration */
export interface ScoringConfig {
  /** Weights for each scoring factor (must sum to ~1.0) */
  weights: {
    recency: number;            // Position-based recency
    userIntent: number;         // User intent strength
    taskCriticality: number;    // Task importance
    toolImpact: number;         // Tool impact
    uniqueness: number;         // Content uniqueness
    crossConvUniqueness: number; // Cross-conversation uniqueness
    informationQuality: number; // Information quality
    branchRelevance: number;    // Branch relevance
    patternFrequency: number;   // Pattern frequency
  };

  /** Content size penalty weight */
  contentSizePenalty: number;

  /** Enable cross-conversation scoring */
  enableCrossConversation: boolean;
}

// =====================================
// Default Configuration
// =====================================

/** Default scoring weights aligned with implementation plan */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  weights: {
    recency: 0.20,            // Position-based, not time-based
    userIntent: 0.20,         // User messages and explicit requests
    taskCriticality: 0.15,    // Critical operations and decisions
    toolImpact: 0.12,         // Important tool operations
    uniqueness: 0.08,         // Unique content within conversation
    crossConvUniqueness: 0.10, // Unique across conversations
    informationQuality: 0.08, // Quality of information
    branchRelevance: 0.05,    // Relevance to current branch
    patternFrequency: 0.02,   // Lower score for common patterns
  },
  contentSizePenalty: 0.1,    // Penalty for very large content
  enableCrossConversation: false,
};

// =====================================
// Core Scoring Functions
// =====================================

/**
 * Calculate position-based recency score
 * Recent messages (closer to end) get higher scores
 */
export function calculateRecency(
  position: number,
  totalMessages: number
): number {
  if (totalMessages === 0) return 0;

  // Position-based: 1.0 - (position_from_end / total_messages)
  const positionFromEnd = totalMessages - position - 1;
  return 1.0 - (positionFromEnd / totalMessages);
}

/**
 * Calculate user intent score
 * Higher for user messages, especially those with explicit requests
 */
export function calculateUserIntent(entry: ConversationEntry): number {
  if (entry.type === 'user') {
    let score = 0.8; // Base score for all user messages

    // Check for explicit intent keywords
    const content = typeof entry.message.content === 'string'
      ? entry.message.content
      : entry.message.content
          .filter(c => c.type === 'text')
          .map(c => c.type === 'text' ? c.text : '')
          .join(' ');

    const intentKeywords = [
      'please', 'help', 'create', 'fix', 'implement', 'analyze',
      'explain', 'update', 'refactor', 'optimize', 'debug',
      'test', 'review', 'check', 'find', 'search'
    ];

    const hasIntent = intentKeywords.some(keyword =>
      content.toLowerCase().includes(keyword)
    );

    if (hasIntent) {
      score = 1.0; // Maximum score for explicit requests
    }

    return score;
  }

  return 0.2; // Low score for non-user messages
}

/**
 * Calculate task criticality score
 * Higher for critical operations like file writes, deployments, etc.
 */
export function calculateTaskCriticality(entry: ConversationEntry): number {
  if (entry.type !== 'assistant') return 0.3;

  const toolUses = entry.message.content.filter(c => c.type === 'tool_use');

  // Critical tools that modify state
  const criticalTools = [
    'Write', 'Edit', 'MultiEdit',           // File modifications
    'Bash',                                  // System commands
    'TodoWrite',                             // Task management
    'mcp__github__create_pull_request',      // GitHub operations
    'mcp__github__merge_pull_request',
  ];

  // Important analysis tools
  const importantTools = [
    'Read', 'Grep', 'Glob',                 // File analysis
    'WebSearch', 'WebFetch',                 // Research
    'Task',                                  // Sub-agent delegation
  ];

  let score = 0.3;

  for (const toolUse of toolUses) {
    if (toolUse.type === 'tool_use') {
      if (criticalTools.includes(toolUse.name)) {
        score = Math.max(score, 0.9);
      } else if (importantTools.includes(toolUse.name)) {
        score = Math.max(score, 0.6);
      }
    }
  }

  return score;
}

/**
 * Calculate tool impact score
 * Based on tool type and result success
 */
export function calculateToolImpact(
  entry: ConversationEntry,
  nextEntry?: ConversationEntry
): number {
  if (entry.type === 'assistant') {
    const toolUses = entry.message.content.filter(c => c.type === 'tool_use');
    if (toolUses.length === 0) return 0.3;

    // Check if tools succeeded (look at next entry for results)
    if (nextEntry?.type === 'user') {
      const toolResults = Array.isArray(nextEntry.message.content)
        ? nextEntry.message.content.filter(c => c.type === 'tool_result')
        : [];

      const hasErrors = toolResults.some(
        r => r.type === 'tool_result' && r.is_error
      );

      return hasErrors ? 0.4 : 0.8; // Lower score for failed tools
    }

    return 0.6; // Default for tool use
  }

  return 0.3;
}

/**
 * Calculate content uniqueness within conversation
 * Lower score for duplicate/similar content
 */
export function calculateUniqueness(
  entry: ConversationEntry,
  allEntries: ConversationEntry[],
  currentIndex: number
): number {
  // Get content hash for comparison
  const entryHash = getContentHash(entry);

  // Check previous entries for duplicates
  let duplicateCount = 0;

  for (let i = 0; i < currentIndex; i++) {
    const otherHash = getContentHash(allEntries[i]);
    if (entryHash === otherHash) {
      duplicateCount++;
    }
  }

  // Score decreases with more duplicates
  if (duplicateCount === 0) return 1.0;
  if (duplicateCount === 1) return 0.6;
  if (duplicateCount === 2) return 0.3;
  return 0.1; // 3+ duplicates
}

/**
 * Calculate cross-conversation uniqueness
 * Requires conversation index from multi-conversation analyzer
 */
export function calculateCrossConvUniqueness(
  entry: ConversationEntry,
  index?: ConversationIndex
): number {
  if (!index) return 0.5; // Neutral score if no index

  const entryHash = getContentHash(entry);

  // Check if this content appears in the index
  const pattern = index.contentPatterns.get(entryHash);

  if (!pattern) return 1.0; // Unique across conversations

  // Score based on total occurrences
  if (pattern.totalOccurrences === 1) return 1.0;
  if (pattern.totalOccurrences === 2) return 0.7;
  if (pattern.totalOccurrences === 3) return 0.4;
  return 0.2; // 4+ occurrences across conversations
}

/**
 * Calculate information quality score
 * Higher for messages with rich context and successful outcomes
 */
export function calculateInformationQuality(
  entry: ConversationEntry,
  previousEntry?: ConversationEntry,
  nextEntry?: ConversationEntry
): number {
  let score = 0.5;

  // User messages with context
  if (entry.type === 'user') {
    const content = typeof entry.message.content === 'string'
      ? entry.message.content
      : entry.message.content
          .filter(c => c.type === 'text')
          .map(c => c.type === 'text' ? c.text : '')
          .join(' ');

    // Length indicates richness
    if (content.length > 500) score += 0.2;
    if (content.length > 1000) score += 0.1;

    // Has tool results
    const hasToolResults = Array.isArray(entry.message.content) &&
      entry.message.content.some(c => c.type === 'tool_result');

    if (hasToolResults) score += 0.2;
  }

  // Assistant messages
  if (entry.type === 'assistant') {
    const textContent = entry.message.content
      .filter(c => c.type === 'text')
      .map(c => c.type === 'text' ? c.text : '')
      .join(' ');

    // Rich explanation
    if (textContent.length > 500) score += 0.2;

    // Has tool uses
    const hasToolUses = entry.message.content.some(c => c.type === 'tool_use');
    if (hasToolUses) score += 0.2;
  }

  return Math.min(1.0, score);
}

/**
 * Calculate branch relevance score
 * Higher for entries on the main conversation branch
 */
export function calculateBranchRelevance(entry: ConversationEntry): number {
  // Check if this is a sidechain
  if ('isSidechain' in entry && entry.isSidechain) {
    return 0.3; // Lower score for sidechain entries
  }

  return 1.0; // Main branch
}

/**
 * Calculate pattern frequency score
 * Lower for frequently occurring patterns
 */
export function calculatePatternFrequency(
  entry: ConversationEntry,
  index?: ConversationIndex
): number {
  if (!index) return 0.5; // Neutral if no index

  // Check if this is a tool use
  if (entry.type === 'assistant') {
    const toolUses = entry.message.content.filter(c => c.type === 'tool_use');

    for (const toolUse of toolUses) {
      if (toolUse.type === 'tool_use') {
        const frequency = index.toolUsageFrequency.get(toolUse.name) || 0;
        const totalToolUses = Array.from(index.toolUsageFrequency.values())
          .reduce((sum, count) => sum + count, 0);

        const percentage = (frequency / totalToolUses) * 100;

        // Common patterns (>20%) get lower scores
        if (percentage > 20) return 0.3;
        if (percentage > 10) return 0.5;
        if (percentage > 5) return 0.7;
      }
    }
  }

  return 0.8; // Uncommon pattern
}

/**
 * Calculate content size factor (penalty for very large content)
 */
export function calculateContentSize(entry: ConversationEntry): number {
  const size = JSON.stringify(entry).length;

  // No penalty for small content
  if (size < 1000) return 0;

  // Increasing penalty for larger content
  if (size < 5000) return 0.1;
  if (size < 10000) return 0.2;
  if (size < 20000) return 0.3;
  return 0.4; // 20KB+
}

/**
 * Calculate final weighted score for an entry
 */
export function calculateMessageScore(
  entry: ConversationEntry,
  position: number,
  allEntries: ConversationEntry[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
  index?: ConversationIndex
): MessageScore {
  const totalMessages = allEntries.length;

  // Calculate individual factors
  const factors: ScoringFactors = {
    recency: calculateRecency(position, totalMessages),
    userIntent: calculateUserIntent(entry),
    taskCriticality: calculateTaskCriticality(entry),
    toolImpact: calculateToolImpact(entry, allEntries[position + 1]),
    uniqueness: calculateUniqueness(entry, allEntries, position),
    crossConvUniqueness: config.enableCrossConversation
      ? calculateCrossConvUniqueness(entry, index)
      : 0.5,
    informationQuality: calculateInformationQuality(
      entry,
      allEntries[position - 1],
      allEntries[position + 1]
    ),
    branchRelevance: calculateBranchRelevance(entry),
    patternFrequency: config.enableCrossConversation
      ? calculatePatternFrequency(entry, index)
      : 0.5,
    contentSize: calculateContentSize(entry),
  };

  // Calculate weighted final score
  const finalScore = (
    factors.recency * config.weights.recency +
    factors.userIntent * config.weights.userIntent +
    factors.taskCriticality * config.weights.taskCriticality +
    factors.toolImpact * config.weights.toolImpact +
    factors.uniqueness * config.weights.uniqueness +
    factors.crossConvUniqueness * config.weights.crossConvUniqueness +
    factors.informationQuality * config.weights.informationQuality +
    factors.branchRelevance * config.weights.branchRelevance +
    factors.patternFrequency * config.weights.patternFrequency
  ) - (factors.contentSize * config.contentSizePenalty);

  // Determine if should be force preserved
  let forcePreserve = false;
  let preserveReason: string | undefined;

  // Always preserve user messages (except in maximum optimization)
  if (entry.type === 'user') {
    forcePreserve = true;
    preserveReason = 'User message';
  }

  // Always preserve result entries
  if (entry.type === 'result') {
    forcePreserve = true;
    preserveReason = 'Conversation result';
  }

  // Always preserve system init messages
  if (entry.type === 'system' && entry.subtype === 'init') {
    forcePreserve = true;
    preserveReason = 'System initialization';
  }

  return {
    uuid: 'uuid' in entry ? entry.uuid : `generated-${position}`,
    finalScore: Math.max(0, Math.min(1, finalScore)),
    factors,
    position,
    totalMessages,
    forcePreserve,
    preserveReason,
  };
}

/**
 * Score all entries in a conversation
 */
export function scoreAllEntries(
  entries: ConversationEntry[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
  index?: ConversationIndex
): MessageScore[] {
  return entries.map((entry, position) =>
    calculateMessageScore(entry, position, entries, config, index)
  );
}

// =====================================
// Helper Functions
// =====================================

/**
 * Get simple content hash for deduplication
 */
function getContentHash(entry: ConversationEntry): string {
  // For user messages
  if (entry.type === 'user') {
    const content = typeof entry.message.content === 'string'
      ? entry.message.content
      : JSON.stringify(entry.message.content);
    return content.substring(0, 1000); // First 1000 chars
  }

  // For assistant messages
  if (entry.type === 'assistant') {
    return entry.message.content
      .filter(c => c.type === 'text')
      .map(c => c.type === 'text' ? c.text : '')
      .join('')
      .substring(0, 1000);
  }

  // For other types
  return JSON.stringify(entry).substring(0, 1000);
}
