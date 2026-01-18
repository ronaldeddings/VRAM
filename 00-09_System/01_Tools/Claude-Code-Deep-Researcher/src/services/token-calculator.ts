/**
 * Token Calculator Service
 *
 * Calculates accurate token counts for conversation entries using
 * the official Anthropic tokenizer.
 */

import { countTokens } from '@anthropic-ai/tokenizer';
import type { ConversationEntry } from '../types/claude-conversation';

export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

export interface RecalculationStats {
  entriesProcessed: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  originalInputTokens: number;
  originalOutputTokens: number;
  tokenReduction: number;
  percentReduction: number;
}

/**
 * Calculate tokens for a text string
 */
export function calculateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  try {
    return countTokens(text);
  } catch (error) {
    console.warn('Token counting failed, using character estimate:', error);
    // Fallback: rough estimate of ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}

/**
 * Calculate tokens for message content (handles arrays and strings)
 */
export function calculateContentTokens(content: any): number {
  if (!content) {
    return 0;
  }

  // Handle string content
  if (typeof content === 'string') {
    return calculateTokens(content);
  }

  // Handle array of content blocks
  if (Array.isArray(content)) {
    let totalTokens = 0;

    for (const block of content) {
      if (typeof block === 'string') {
        totalTokens += calculateTokens(block);
      } else if (block.text) {
        totalTokens += calculateTokens(block.text);
      } else if (block.content) {
        totalTokens += calculateContentTokens(block.content);
      }
    }

    return totalTokens;
  }

  // Handle object with text property
  if (typeof content === 'object' && content.text) {
    return calculateTokens(content.text);
  }

  return 0;
}

/**
 * Recalculate token usage for a conversation entry
 *
 * NOTE: For assistant messages, input_tokens represents only the NEW tokens
 * since the last turn (user's input), NOT the cumulative conversation context.
 * Claude Code uses caching (cache_read_input_tokens) for conversation history.
 */
export function recalculateEntryTokens(
  entry: ConversationEntry,
  previousUserContent?: any
): TokenUsage | null {
  if (!entry.message) {
    return null;
  }

  const message = entry.message;

  // User messages: NO token usage in Claude Code
  // Token counting happens when assistant responds, not when user sends
  if (message.role === 'user') {
    return null; // User messages don't have usage metadata
  }

  // Assistant messages: count as output tokens
  // input_tokens = only the user's previous input (NEW tokens since last turn)
  if (message.role === 'assistant') {
    const outputTokens = calculateContentTokens(message.content);
    const inputTokens = previousUserContent
      ? calculateContentTokens(previousUserContent)
      : 0;

    return {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
    };
  }

  return null;
}

/**
 * Recalculate token usage for all entries in a conversation
 * Returns updated entries with corrected usage metadata
 *
 * Formula: For each message, input_tokens = user's input content ONLY (not cumulative)
 * Context is tracked via cache_read_input_tokens, which we preserve from original.
 */
export function recalculateConversationTokens(
  entries: ConversationEntry[]
): { entries: ConversationEntry[]; stats: RecalculationStats } {
  const updatedEntries: ConversationEntry[] = [];
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let originalInputTokens = 0;
  let originalOutputTokens = 0;
  let entriesProcessed = 0;

  // Track last user message content for assistant responses
  let lastUserContent: any = null;

  for (const entry of entries) {
    const updatedEntry = { ...entry };

    // Track original token counts
    if (entry.message?.usage) {
      originalInputTokens += entry.message.usage.input_tokens || 0;
      originalOutputTokens += entry.message.usage.output_tokens || 0;
    }

    // Recalculate tokens
    const newUsage = recalculateEntryTokens(entry, lastUserContent);

    if (newUsage && updatedEntry.message) {
      entriesProcessed++;

      // For user messages: track content for next assistant response
      // but DON'T add usage metadata (users don't have usage)
      if (updatedEntry.message.role === 'user') {
        lastUserContent = updatedEntry.message.content;
        // User messages don't have usage metadata in Claude Code
      }

      // For assistant messages: input = last user's content ONLY
      else if (updatedEntry.message.role === 'assistant') {
        totalInputTokens += newUsage.input_tokens;
        totalOutputTokens += newUsage.output_tokens;

        updatedEntry.message = {
          ...updatedEntry.message,
          usage: {
            input_tokens: newUsage.input_tokens,
            output_tokens: newUsage.output_tokens,
            // Reset cache tokens to 0 - cache is invalid after optimization
            // Claude Code will rebuild cache on session resume
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0,
          },
        };

        // Reset last user content after processing
        lastUserContent = null;
      }
    }

    updatedEntries.push(updatedEntry);
  }

  const tokenReduction = originalInputTokens - totalInputTokens;
  const percentReduction = originalInputTokens > 0
    ? (tokenReduction / originalInputTokens) * 100
    : 0;

  return {
    entries: updatedEntries,
    stats: {
      entriesProcessed,
      totalInputTokens,
      totalOutputTokens,
      originalInputTokens,
      originalOutputTokens,
      tokenReduction,
      percentReduction,
    },
  };
}

/**
 * Get final cumulative token count for a conversation
 */
export function getFinalTokenCount(entries: ConversationEntry[]): {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
} {
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  for (const entry of entries) {
    if (entry.message?.usage) {
      totalInputTokens += entry.message.usage.input_tokens || 0;
      totalOutputTokens += entry.message.usage.output_tokens || 0;
    }
  }

  return {
    totalInputTokens,
    totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens,
  };
}
