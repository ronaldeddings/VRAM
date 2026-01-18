/**
 * Multi-Conversation Analyzer Service
 *
 * Analyzes multiple JSONL conversation files simultaneously to:
 * - Find best examples of similar actions across sessions
 * - Deduplicate cross-conversation content
 * - Identify patterns in frequently accessed files
 * - Build consolidated context from related conversations
 */

import crypto from 'crypto';
import type {
  ConversationEntry,
  ToolResultContent,
  AssistantMessageEntry,
  UserMessageEntry,
} from '../types/claude-conversation';

// =====================================
// Core Types for Multi-Conversation Analysis
// =====================================

/** Source conversation file to analyze */
export interface ConversationSource {
  /** Path to JSONL file */
  filePath: string;
  /** Parsed conversation entries */
  entries: ConversationEntry[];
  /** Session ID from the conversation */
  sessionId: string;
  /** Optional label for this conversation */
  label?: string;
}

/** Content fingerprint for deduplication */
export interface ContentFingerprint {
  /** Hash of the content for deduplication */
  hash: string;
  /** Type of content (tool_result, text, etc) */
  contentType: string;
  /** Size of content in characters */
  size: number;
  /** Tool name if this is a tool result */
  toolName?: string;
  /** File path if this is a file read/write */
  filePath?: string;
  /** First 200 chars for quick visual comparison */
  preview: string;
}

/** Pattern detected across conversations */
export interface CrossConversationPattern {
  /** Content fingerprint for this pattern */
  fingerprint: ContentFingerprint;
  /** All occurrences of this content across conversations */
  occurrences: Array<{
    /** Which conversation this appeared in */
    sessionId: string;
    /** File path where this conversation is stored */
    conversationFilePath: string;
    /** Entry index within that conversation */
    entryIndex: number;
    /** Entry UUID */
    entryUuid: string;
    /** Tool use ID if this is a tool result */
    toolUseId?: string;
    /** Surrounding context to assess quality */
    surroundingContext: {
      /** User message before this entry */
      userMessageBefore?: string;
      /** Assistant message after this entry */
      assistantMessageAfter?: string;
      /** Whether this content was actually used in the conversation */
      wasUsedInConversation: boolean;
      /** Whether the conversation succeeded after using this */
      ledToSuccess: boolean;
      /** Number of messages in the conversation after this point */
      conversationDepthAfter: number;
    };
  }>;
  /** Index of the best occurrence to keep */
  bestInstanceIndex: number;
  /** Reason why this instance was selected as best */
  bestInstanceReason: string;
  /** Total times this pattern appeared */
  totalOccurrences: number;
}

/** Index of all conversations for quick lookup */
export interface ConversationIndex {
  /** All conversation sources */
  sources: ConversationSource[];
  /** Map of content hash -> pattern */
  contentPatterns: Map<string, CrossConversationPattern>;
  /** Map of file paths that were read -> pattern */
  fileReadPatterns: Map<string, CrossConversationPattern>;
  /** Map of tool names -> usage count across sessions */
  toolUsageFrequency: Map<string, number>;
  /** Total entries across all conversations */
  totalEntries: number;
  /** Build timestamp */
  indexedAt: Date;
}

// =====================================
// Content Fingerprinting Functions
// =====================================

/**
 * Generate content fingerprint for deduplication
 */
export function generateContentFingerprint(
  content: string | ToolResultContent['content'],
  toolName?: string,
  filePath?: string
): ContentFingerprint {
  // Handle undefined/null content
  if (content === undefined || content === null) {
    const emptyHash = crypto
      .createHash('sha256')
      .update('')
      .digest('hex');

    return {
      hash: emptyHash,
      contentType: 'text',
      size: 0,
      toolName,
      filePath,
      preview: '',
    };
  }

  // Normalize content to string
  const contentStr = typeof content === 'string'
    ? content
    : JSON.stringify(content);

  // Generate hash
  const hash = crypto
    .createHash('sha256')
    .update(contentStr)
    .digest('hex');

  // Get preview (first 200 chars)
  const preview = contentStr.substring(0, 200);

  return {
    hash,
    contentType: typeof content === 'string' ? 'text' : 'structured',
    size: contentStr.length,
    toolName,
    filePath,
    preview,
  };
}

/**
 * Extract file path from tool result content if it's a file operation
 */
export function extractFilePathFromToolResult(
  toolName: string,
  toolInput: Record<string, any>
): string | undefined {
  // Common file path parameter names
  const filePathKeys = ['file_path', 'filepath', 'path', 'filePath'];

  for (const key of filePathKeys) {
    if (toolInput[key] && typeof toolInput[key] === 'string') {
      return toolInput[key];
    }
  }

  return undefined;
}

// =====================================
// Pattern Detection Functions
// =====================================

/**
 * Build cross-conversation index from multiple sources
 */
export function buildConversationIndex(
  sources: ConversationSource[]
): ConversationIndex {
  const contentPatterns = new Map<string, CrossConversationPattern>();
  const fileReadPatterns = new Map<string, CrossConversationPattern>();
  const toolUsageFrequency = new Map<string, number>();
  let totalEntries = 0;

  // Process each conversation
  for (const source of sources) {
    totalEntries += source.entries.length;

    // Process each entry
    source.entries.forEach((entry, index) => {
      // Track tool usage frequency
      if (entry.type === 'assistant') {
        const toolUses = entry.message.content.filter(c => c.type === 'tool_use');
        toolUses.forEach(toolUse => {
          if (toolUse.type === 'tool_use') {
            const count = toolUsageFrequency.get(toolUse.name) || 0;
            toolUsageFrequency.set(toolUse.name, count + 1);
          }
        });
      }

      // Process tool results for deduplication
      if (entry.type === 'user') {
        const toolResults = Array.isArray(entry.message.content)
          ? entry.message.content.filter(c => c.type === 'tool_result')
          : [];

        toolResults.forEach(toolResult => {
          if (toolResult.type === 'tool_result') {
            // Find the corresponding tool use to get tool name and input
            const toolUse = findToolUseForResult(source.entries, toolResult.tool_use_id);

            if (toolUse) {
              const filePath = extractFilePathFromToolResult(
                toolUse.name,
                toolUse.input
              );

              // Generate fingerprint
              const fingerprint = generateContentFingerprint(
                toolResult.content,
                toolUse.name,
                filePath
              );

              // Get surrounding context
              const surroundingContext = analyzeSurroundingContext(
                source.entries,
                index
              );

              // Add to patterns
              addToPattern(
                contentPatterns,
                fingerprint,
                source,
                index,
                entry,
                toolResult.tool_use_id,
                surroundingContext
              );

              // Add to file patterns if this is a file read
              if (filePath && ['Read', 'read'].includes(toolUse.name)) {
                addToPattern(
                  fileReadPatterns,
                  fingerprint,
                  source,
                  index,
                  entry,
                  toolResult.tool_use_id,
                  surroundingContext
                );
              }
            }
          }
        });
      }
    });
  }

  // Select best instances for each pattern
  for (const pattern of contentPatterns.values()) {
    selectBestInstance(pattern);
  }

  for (const pattern of fileReadPatterns.values()) {
    selectBestInstance(pattern);
  }

  return {
    sources,
    contentPatterns,
    fileReadPatterns,
    toolUsageFrequency,
    totalEntries,
    indexedAt: new Date(),
  };
}

/**
 * Find the tool use that corresponds to a tool result
 */
function findToolUseForResult(
  entries: ConversationEntry[],
  toolUseId: string
): { name: string; input: Record<string, any> } | undefined {
  // Search backwards from current position
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry.type === 'assistant') {
      const toolUse = entry.message.content.find(
        c => c.type === 'tool_use' && c.id === toolUseId
      );
      if (toolUse && toolUse.type === 'tool_use') {
        return { name: toolUse.name, input: toolUse.input };
      }
    }
  }
  return undefined;
}

/**
 * Analyze surrounding context to determine usage quality
 */
function analyzeSurroundingContext(
  entries: ConversationEntry[],
  currentIndex: number
): CrossConversationPattern['occurrences'][0]['surroundingContext'] {
  let userMessageBefore: string | undefined;
  let assistantMessageAfter: string | undefined;
  let wasUsedInConversation = false;
  let ledToSuccess = false;
  let conversationDepthAfter = 0;

  // Look for user message before
  for (let i = currentIndex - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry.type === 'user' && typeof entry.message.content === 'string') {
      userMessageBefore = entry.message.content.substring(0, 500);
      break;
    }
  }

  // Look for assistant message after and check if content was used
  for (let i = currentIndex + 1; i < entries.length; i++) {
    const entry = entries[i];
    conversationDepthAfter++;

    if (entry.type === 'assistant') {
      if (!assistantMessageAfter) {
        const textContent = entry.message.content.find(c => c.type === 'text');
        if (textContent && textContent.type === 'text') {
          assistantMessageAfter = textContent.text.substring(0, 500);
          wasUsedInConversation = true;
        }
      }
    }

    // Check if conversation succeeded
    if (entry.type === 'result') {
      ledToSuccess = !entry.is_error;
      break;
    }
  }

  return {
    userMessageBefore,
    assistantMessageAfter,
    wasUsedInConversation,
    ledToSuccess,
    conversationDepthAfter,
  };
}

/**
 * Add occurrence to pattern map
 */
function addToPattern(
  patterns: Map<string, CrossConversationPattern>,
  fingerprint: ContentFingerprint,
  source: ConversationSource,
  index: number,
  entry: ConversationEntry,
  toolUseId: string,
  surroundingContext: CrossConversationPattern['occurrences'][0]['surroundingContext']
): void {
  const existing = patterns.get(fingerprint.hash);

  const occurrence = {
    sessionId: source.sessionId,
    conversationFilePath: source.filePath,
    entryIndex: index,
    entryUuid: 'uuid' in entry ? entry.uuid : '',
    toolUseId,
    surroundingContext,
  };

  if (existing) {
    existing.occurrences.push(occurrence);
    existing.totalOccurrences++;
  } else {
    patterns.set(fingerprint.hash, {
      fingerprint,
      occurrences: [occurrence],
      bestInstanceIndex: 0,
      bestInstanceReason: 'First occurrence',
      totalOccurrences: 1,
    });
  }
}

/**
 * Select the best instance from multiple occurrences
 * Based on:
 * 1. Was actually used in conversation (highest priority)
 * 2. Led to successful outcome
 * 3. Richer surrounding context
 * 4. Longer conversation depth after (more context about usage)
 */
function selectBestInstance(pattern: CrossConversationPattern): void {
  if (pattern.occurrences.length === 1) {
    pattern.bestInstanceIndex = 0;
    pattern.bestInstanceReason = 'Only occurrence';
    return;
  }

  let bestIndex = 0;
  let bestScore = 0;
  const scores: number[] = [];

  // Score each occurrence
  pattern.occurrences.forEach((occurrence, index) => {
    let score = 0;
    const reasons: string[] = [];

    // Was used in conversation (40 points)
    if (occurrence.surroundingContext.wasUsedInConversation) {
      score += 40;
      reasons.push('used in conversation');
    }

    // Led to success (30 points)
    if (occurrence.surroundingContext.ledToSuccess) {
      score += 30;
      reasons.push('led to success');
    }

    // Has user context before (10 points)
    if (occurrence.surroundingContext.userMessageBefore) {
      score += 10;
      reasons.push('has user context');
    }

    // Has assistant response after (10 points)
    if (occurrence.surroundingContext.assistantMessageAfter) {
      score += 10;
      reasons.push('has assistant response');
    }

    // Conversation depth after (up to 10 points, capped at 50 messages)
    const depthScore = Math.min(
      10,
      (occurrence.surroundingContext.conversationDepthAfter / 50) * 10
    );
    score += depthScore;
    if (depthScore > 5) {
      reasons.push(`rich conversation depth (${occurrence.surroundingContext.conversationDepthAfter} msgs)`);
    }

    scores.push(score);

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
      pattern.bestInstanceReason = reasons.join(', ');
    }
  });

  pattern.bestInstanceIndex = bestIndex;

  // If all scores are equal, add tie-breaker reason
  if (scores.every(s => s === bestScore)) {
    pattern.bestInstanceReason = 'First among equal quality occurrences';
  }
}

// =====================================
// Query Functions
// =====================================

/**
 * Get all duplicate patterns (occurring in multiple conversations)
 */
export function getDuplicatePatterns(
  index: ConversationIndex
): CrossConversationPattern[] {
  return Array.from(index.contentPatterns.values())
    .filter(pattern => pattern.totalOccurrences > 1)
    .sort((a, b) => b.totalOccurrences - a.totalOccurrences);
}

/**
 * Get frequently accessed files across conversations
 */
export function getFrequentFilePatterns(
  index: ConversationIndex,
  minOccurrences = 2
): CrossConversationPattern[] {
  return Array.from(index.fileReadPatterns.values())
    .filter(pattern => pattern.totalOccurrences >= minOccurrences)
    .sort((a, b) => b.totalOccurrences - a.totalOccurrences);
}

/**
 * Get tool usage statistics across all conversations
 */
export function getToolUsageStats(
  index: ConversationIndex
): Array<{ toolName: string; usageCount: number; percentage: number }> {
  const total = Array.from(index.toolUsageFrequency.values())
    .reduce((sum, count) => sum + count, 0);

  return Array.from(index.toolUsageFrequency.entries())
    .map(([toolName, usageCount]) => ({
      toolName,
      usageCount,
      percentage: (usageCount / total) * 100,
    }))
    .sort((a, b) => b.usageCount - a.usageCount);
}

/**
 * Find best instance of specific content across conversations
 */
export function findBestInstance(
  index: ConversationIndex,
  contentHash: string
): CrossConversationPattern['occurrences'][0] | undefined {
  const pattern = index.contentPatterns.get(contentHash);
  if (!pattern) return undefined;

  return pattern.occurrences[pattern.bestInstanceIndex];
}
