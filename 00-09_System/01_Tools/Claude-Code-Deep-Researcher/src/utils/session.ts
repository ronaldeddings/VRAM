import { v4 as uuidv4 } from 'uuid';
import type { SessionMessage, SessionInfo, SessionMetadata } from '../types/index.ts';

/**
 * Generates a new UUID v4 session ID
 */
export function generateSessionId(): string {
  return uuidv4();
}

/**
 * Validates that a string is a valid UUID v4
 */
export function validateSessionId(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Parses a JSONL session file line by line
 * Each line should be a valid JSON object representing a SessionMessage
 */
export function parseSessionFile(jsonlContent: string): SessionMessage[] {
  const lines = jsonlContent.trim().split('\n');
  const messages: SessionMessage[] = [];

  for (const line of lines) {
    if (line.trim() === '') continue;
    
    try {
      const parsed = JSON.parse(line);
      messages.push(parsed as SessionMessage);
    } catch (error) {
      // Log malformed JSON lines but continue parsing
      console.warn('Malformed JSON line in session file:', line);
    }
  }

  return messages;
}

/**
 * Extracts session metadata from parsed session messages
 */
export function extractSessionMetadata(messages: SessionMessage[]): SessionMetadata {
  if (messages.length === 0) {
    throw new Error('Cannot extract metadata from empty session');
  }

  const firstMessage = messages[0]!;
  const lastMessage = messages[messages.length - 1]!;
  
  // Extract unique tools used
  const toolsUsed = new Set<string>();
  messages.forEach(msg => {
    if (msg.toolUseResult) {
      // Extract tool name from tool use result if available
      // This would need to be adapted based on actual toolUseResult structure
      const toolName = extractToolNameFromResult(msg.toolUseResult);
      if (toolName) toolsUsed.add(toolName);
    }
  });

  return {
    sessionId: firstMessage.sessionId,
    projectPath: decodeProjectPathFromCwd(firstMessage.cwd),
    startTime: firstMessage.timestamp,
    lastActivity: lastMessage.timestamp,
    messageCount: messages.length,
    toolsUsed: Array.from(toolsUsed)
  };
}

/**
 * Extracts tool name from tool use result object
 * This is a helper function that may need customization based on actual structure
 */
function extractToolNameFromResult(toolUseResult: object): string | null {
  // This would need to be implemented based on the actual structure of toolUseResult
  // For now, return null as we don't have the exact structure
  return null;
}

/**
 * Attempts to decode project path from current working directory
 */
function decodeProjectPathFromCwd(cwd: string): string {
  // This is a best-effort attempt to extract project path from cwd
  // May need refinement based on actual usage patterns
  return cwd;
}

/**
 * Filters messages by type
 */
export function filterMessagesByType(messages: SessionMessage[], type: string): SessionMessage[] {
  return messages.filter(msg => msg.type === type);
}

/**
 * Gets the latest user message from a session
 */
export function getLatestUserMessage(messages: SessionMessage[]): SessionMessage | null {
  const userMessages = filterMessagesByType(messages, 'user');
  return userMessages.length > 0 ? userMessages[userMessages.length - 1]! : null;
}

/**
 * Gets the latest assistant message from a session
 */
export function getLatestAssistantMessage(messages: SessionMessage[]): SessionMessage | null {
  const assistantMessages = filterMessagesByType(messages, 'assistant');
  return assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1]! : null;
}

/**
 * Creates a session summary from messages
 */
export function createSessionSummary(messages: SessionMessage[]): string {
  const metadata = extractSessionMetadata(messages);
  const userMessages = filterMessagesByType(messages, 'user');
  const assistantMessages = filterMessagesByType(messages, 'assistant');
  
  let summary = `Session ${metadata.sessionId} summary:\n`;
  summary += `- Duration: ${metadata.startTime} to ${metadata.lastActivity}\n`;
  summary += `- Messages: ${userMessages.length} user, ${assistantMessages.length} assistant\n`;
  summary += `- Tools used: ${metadata.toolsUsed.join(', ') || 'none'}\n`;
  
  // Add key conversation highlights
  if (userMessages.length > 0) {
    const firstUserMsg = userMessages[0]!;
    summary += `- Started with: "${truncateContent(firstUserMsg.message.content)}"\n`;
  }
  
  if (userMessages.length > 1) {
    const lastUserMsg = userMessages[userMessages.length - 1]!;
    summary += `- Last request: "${truncateContent(lastUserMsg.message.content)}"\n`;
  }
  
  return summary;
}

/**
 * Helper function to truncate content for summaries
 */
function truncateContent(content: string | object[]): string {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
}