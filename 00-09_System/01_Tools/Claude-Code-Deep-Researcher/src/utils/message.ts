import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

/**
 * Extracts the result from SDK messages, looking for assistant responses and result messages
 */
export function extractResult(messages: SDKMessage[]): string | null {
  // First, try to find result messages
  for (const message of messages) {
    if (message.type === 'result') {
      if (message.subtype === 'success') {
        return message.result;
      }
      // For error results, we could return error information
      if (message.subtype === 'error_max_turns' || message.subtype === 'error_during_execution') {
        return `Error: ${message.subtype}`;
      }
    }
  }
  
  // If no result messages found, collect all text content from assistant messages
  const assistantMessages = messages.filter(m => m.type === 'assistant');
  const textResponses: string[] = [];
  
  for (const message of assistantMessages) {
    const content = message.message.content;
    
    if (typeof content === 'string') {
      textResponses.push(content);
    } else if (Array.isArray(content)) {
      // Extract text content from content blocks
      for (const block of content) {
        if (block.type === 'text' && block.text && block.text.trim()) {
          textResponses.push(block.text.trim());
        }
      }
    }
  }
  
  if (textResponses.length > 0) {
    return textResponses.join('\n\n');
  }
  
  return null;
}

/**
 * Finds all tool usage in messages for a specific tool
 */
export function findToolUsage(messages: SDKMessage[], toolName: string): any[] {
  const toolUsages: any[] = [];
  
  for (const message of messages) {
    if (message.type === 'assistant') {
      // Check if the assistant message contains tool use
      const content = message.message.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'tool_use' && block.name === toolName) {
            toolUsages.push({
              id: block.id,
              name: block.name,
              input: block.input,
              messageUuid: message.uuid
            });
          }
        }
      }
    }
  }
  
  return toolUsages;
}

/**
 * Gets a summary of the conversation from SDK messages
 */
export function getSessionSummary(messages: SDKMessage[]): string {
  let summary = 'Session Summary:\n';
  
  const userMessages = messages.filter(m => m.type === 'user');
  const assistantMessages = messages.filter(m => m.type === 'assistant');
  const resultMessages = messages.filter(m => m.type === 'result');
  
  summary += `- ${userMessages.length} user messages\n`;
  summary += `- ${assistantMessages.length} assistant messages\n`;
  summary += `- ${resultMessages.length} result messages\n`;
  
  // Add tool usage summary
  const toolUsages = new Set<string>();
  for (const message of assistantMessages) {
    const content = message.message.content;
    if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'tool_use') {
          toolUsages.add(block.name);
        }
      }
    }
  }
  
  if (toolUsages.size > 0) {
    summary += `- Tools used: ${Array.from(toolUsages).join(', ')}\n`;
  }
  
  // Add result status
  const successResults = resultMessages.filter(r => r.type === 'result' && r.subtype === 'success');
  const errorResults = resultMessages.filter(r => r.type === 'result' && r.subtype !== 'success');
  
  if (successResults.length > 0) {
    summary += `- ${successResults.length} successful operations\n`;
  }
  if (errorResults.length > 0) {
    summary += `- ${errorResults.length} failed operations\n`;
  }
  
  return summary;
}

/**
 * Filters messages by type
 */
export function filterMessagesByType(messages: SDKMessage[], type: string): SDKMessage[] {
  return messages.filter(message => message.type === type);
}

/**
 * Gets the last message of a specific type
 */
export function getLastMessageOfType(messages: SDKMessage[], type: string): SDKMessage | null {
  const filtered = filterMessagesByType(messages, type);
  return filtered.length > 0 ? filtered[filtered.length - 1]! : null;
}

/**
 * Checks if the conversation ended successfully
 */
export function isConversationSuccessful(messages: SDKMessage[]): boolean {
  const resultMessage = getLastMessageOfType(messages, 'result');
  return resultMessage?.type === 'result' && resultMessage.subtype === 'success';
}

/**
 * Gets total cost from messages
 */
export function getTotalCost(messages: SDKMessage[]): number {
  let totalCost = 0;
  
  for (const message of messages) {
    if (message.type === 'result') {
      totalCost += message.total_cost_usd || 0;
    }
  }
  
  return totalCost;
}

/**
 * Gets total token usage from messages
 */
export function getTotalTokenUsage(messages: SDKMessage[]): { input: number; output: number } {
  let inputTokens = 0;
  let outputTokens = 0;
  
  for (const message of messages) {
    if (message.type === 'result' && message.usage) {
      inputTokens += message.usage.input_tokens || 0;
      outputTokens += message.usage.output_tokens || 0;
    }
  }
  
  return { input: inputTokens, output: outputTokens };
}