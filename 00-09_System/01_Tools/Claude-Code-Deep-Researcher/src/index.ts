// Main entry point for Claude Agent SDK Application

import { ClaudeCodeApp } from './claude-sdk-app.ts';
export { ClaudeCodeApp };

// Export all services for advanced usage
export {
  ConfigManager,
  ClaudeCodeService,
  SessionManager,
  PromptExecutor,
  TodoManager,
  ConversationManager
} from './services/index.ts';

// Export all types
export type {
  AppConfig,
  SessionInfo,
  SessionMessage,
  SessionMetadata,
  Todo,
  TaskRequirements,
  ExecutionResult,
  DuplicationResult,
  DuplicateAndResumeResult,
  Options,
  SDKMessage,
  UUID
} from './types/index.ts';

// Export utilities
export {
  encodeProjectPath,
  decodeProjectPath,
  getClaudeProjectsDirectory,
  getEncodedProjectDirectory,
  getSessionFilePath,
  resolvePath
} from './utils/path.ts';

export {
  generateSessionId,
  validateSessionId,
  parseSessionFile,
  extractSessionMetadata,
  filterMessagesByType,
  getLatestUserMessage,
  getLatestAssistantMessage,
  createSessionSummary
} from './utils/session.ts';

export {
  extractResult,
  findToolUsage,
  getSessionSummary,
  filterMessagesByType as filterSDKMessagesByType,
  getLastMessageOfType,
  isConversationSuccessful,
  getTotalCost,
  getTotalTokenUsage
} from './utils/message.ts';

/**
 * Quick start function for basic usage
 */
export async function createClaudeApp(configPath?: string): Promise<ClaudeCodeApp> {
  const app = new ClaudeCodeApp(configPath);
  
  // Validate services are working
  const validation = app.validateServices();
  if (!validation.valid) {
    throw new Error(`Service validation failed: ${validation.issues.join(', ')}`);
  }
  
  return app;
}

/**
 * Version information
 */
export const VERSION = '1.0.0';
export const FEATURES = [
  'Run Prompt - Execute prompts through Claude Agent SDK',
  'Max Task Control - Specify maximum number of tasks in todo lists',
  'Resume Conversation - Resume previous conversations from where they left off',
  'Duplicate Conversation - Create exact copies of existing conversations',
  'Duplicate & Resume - Duplicate a conversation and immediately continue it',
  'Task Specification - Specify which specific tasks must be included in todo lists'
] as const;