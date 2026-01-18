import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import type { Todo } from '../types/index.ts';
import { getSessionFilePath, getEncodedProjectDirectory } from '../utils/path.ts';

/**
 * Service for building pre-configured session files
 * Creates JSONL conversation files with predefined todos
 */
export class SessionBuilder {
  constructor() {
    // Uses the standard Claude projects directory structure
  }

  /**
   * Creates a pre-configured session with todos already set up
   * Returns the session ID that can be used to resume the conversation
   */
  createSessionWithTodos(
    prompt: string, 
    todos: Todo[], 
    cwd: string = process.cwd()
  ): string {
    const sessionId = randomUUID();
    const timestamp = new Date().toISOString();
    const version = "1.0.113"; // Match the version from the example
    const gitBranch = "main"; // Default git branch

    // Create the session file path using the standard Claude directory structure
    const sessionPath = getSessionFilePath(cwd, sessionId);
    const projectDir = getEncodedProjectDirectory(cwd);
    
    // Ensure the project directory exists
    mkdirSync(projectDir, { recursive: true });

    const messages = [];

    // 1. Initial user message with the prompt
    const userUuid = randomUUID();
    messages.push({
      parentUuid: null,
      isSidechain: false,
      userType: "external",
      cwd,
      sessionId,
      version,
      gitBranch,
      type: "user",
      message: {
        role: "user",
        content: prompt
      },
      uuid: userUuid,
      timestamp
    });

    // 2. Assistant message with TodoWrite tool call
    const assistantUuid = randomUUID();
    const toolUseId = `toolu_${randomUUID().replace(/-/g, '')}`;
    
    messages.push({
      parentUuid: userUuid,
      isSidechain: false,
      userType: "external", 
      cwd,
      sessionId,
      version,
      gitBranch,
      message: {
        id: `msg_${randomUUID().replace(/-/g, '')}`,
        type: "message",
        role: "assistant",
        model: "claude-sonnet-4-20250514",
        content: [
          {
            type: "tool_use",
            id: toolUseId,
            name: "TodoWrite",
            input: { todos }
          }
        ],
        stop_reason: null,
        stop_sequence: null,
        usage: {
          input_tokens: 4,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 59247,
          cache_creation: {
            ephemeral_5m_input_tokens: 0,
            ephemeral_1h_input_tokens: 0
          },
          output_tokens: 1,
          service_tier: "standard"
        }
      },
      requestId: `req_${randomUUID().replace(/-/g, '')}`,
      type: "assistant",
      uuid: assistantUuid,
      timestamp
    });

    // 3. Tool result message
    const toolResultUuid = randomUUID();
    const toolResultTimestamp = new Date(Date.now() + 50).toISOString();
    
    messages.push({
      parentUuid: assistantUuid,
      isSidechain: false,
      userType: "external",
      cwd,
      sessionId,
      version,
      gitBranch,
      type: "user",
      message: {
        role: "user",
        content: [
          {
            tool_use_id: toolUseId,
            type: "tool_result",
            content: "Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
          }
        ]
      },
      uuid: toolResultUuid,
      timestamp: toolResultTimestamp,
      toolUseResult: {
        oldTodos: [],
        newTodos: todos
      }
    });

    // Write the JSONL file
    const jsonlContent = messages.map(msg => JSON.stringify(msg)).join('\n') + '\n';
    writeFileSync(sessionPath, jsonlContent);

    console.log(`📁 Pre-configured session created: ${sessionId}`);
    console.log(`📋 Todos initialized: ${todos.length} tasks`);
    
    return sessionId;
  }

  /**
   * Gets the expected session file path for a session ID
   */
  getSessionPath(sessionId: string, cwd: string = process.cwd()): string {
    return getSessionFilePath(cwd, sessionId);
  }
}