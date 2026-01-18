import type { Options, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { UUID } from 'crypto';

// Core application configuration
export interface AppConfig {
  defaultModel?: string;
  maxTurns: number;
  allowedTools: string[];
  projectsDirectory: string;
  todoDefaults: {
    maxTasks: number;
    requiredTasks: string[];
  };
}

// Session management types
export interface SessionInfo {
  sessionId: string;
  projectPath: string;
  timestamp: string;
  cwd: string;
}

export interface SessionMetadata {
  sessionId: string;
  projectPath: string;
  startTime: string;
  lastActivity: string;
  messageCount: number;
  toolsUsed: string[];
}

// Todo management types
export interface Todo {
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  activeForm: string;
}

export interface TaskRequirements {
  requiredTasks: string[];
  maxTasks?: number;
  forbiddenTasks?: string[];
}

// Session message types from JSONL parsing
export interface SessionMessage {
  parentUuid: string | null;
  isSidechain: boolean;
  userType: string;
  cwd: string;
  sessionId: string;
  version: string;
  gitBranch: string;
  type: 'user' | 'assistant' | 'system';
  message: {
    role: 'user' | 'assistant';
    content: string | object[];
    id?: string;
    model?: string;
    usage?: object;
    stop_reason?: string;
  };
  uuid: string;
  timestamp: string;
  requestId?: string;
  toolUseResult?: object;
}

// API response types
export interface ExecutionResult {
  success: boolean;
  messages: SDKMessage[];
  sessionId?: string;
  error?: string;
  executionTime?: number;
  extractedResult?: string | null;
  cost?: number;
  tokenUsage?: { input: number; output: number };
  conversationSuccessful?: boolean;
}

export interface DuplicationResult {
  newSessionId: string;
  success: boolean;
  error?: string;
}

export interface DuplicateAndResumeResult {
  newSessionId: string;
  messages: SDKMessage[];
  success: boolean;
  error?: string;
}

// Claude Code SDK re-exports for convenience
export type { Options, SDKMessage, UUID };