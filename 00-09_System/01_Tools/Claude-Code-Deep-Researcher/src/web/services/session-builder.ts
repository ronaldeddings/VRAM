/**
 * Session Builder Service
 *
 * Provides a fluent API for building new conversation sessions
 * with proper structure, UUID chains, and timestamps.
 */

import { randomUUID } from 'crypto';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { homedir } from 'os';
import type { ConversationEntry } from '../../types/claude-conversation';

export interface MessageContent {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: string;
}

export interface BuilderOptions {
  /** Project path (will be base64 encoded) */
  projectPath: string;
  /** Optional session name */
  sessionName?: string;
  /** System prompt to use */
  systemPrompt?: string;
  /** Model to use */
  model?: string;
}

export class SessionBuilder {
  private claudeDir: string;
  private entries: ConversationEntry[] = [];
  private projectPath: string;
  private sessionId: string;
  private lastUuid: string | null = null;
  private model: string;

  constructor(options: BuilderOptions) {
    this.claudeDir = join(homedir(), '.claude', 'projects');
    this.projectPath = this.encodeProjectPath(options.projectPath);
    this.sessionId = options.sessionName || this.generateSessionId();
    this.model = options.model || 'claude-sonnet-4-20250514';

    // Add system message if provided
    if (options.systemPrompt) {
      this.addSystemMessage(options.systemPrompt);
    }
  }

  /**
   * Add a system message
   */
  addSystemMessage(content: string): this {
    const uuid = randomUUID();
    const entry: ConversationEntry = {
      uuid,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'system',
      message: {
        role: 'system',
        content,
      },
    } as ConversationEntry;

    this.entries.push(entry);
    this.lastUuid = uuid;
    return this;
  }

  /**
   * Add a user message
   */
  addUserMessage(content: string | MessageContent[]): this {
    const uuid = randomUUID();
    const messageContent = typeof content === 'string'
      ? content
      : content;

    const entry: ConversationEntry = {
      uuid,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'user',
      message: {
        role: 'user',
        content: messageContent,
      },
    } as ConversationEntry;

    this.entries.push(entry);
    this.lastUuid = uuid;
    return this;
  }

  /**
   * Add an assistant message
   */
  addAssistantMessage(content: string | MessageContent[]): this {
    const uuid = randomUUID();
    const messageContent = typeof content === 'string'
      ? [{ type: 'text' as const, text: content }]
      : content;

    const entry: ConversationEntry = {
      uuid,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'assistant',
      message: {
        role: 'assistant',
        content: messageContent,
        model: this.model,
      },
    } as ConversationEntry;

    this.entries.push(entry);
    this.lastUuid = uuid;
    return this;
  }

  /**
   * Add a tool use message (assistant using a tool)
   */
  addToolUse(toolName: string, input: Record<string, unknown>): this {
    const uuid = randomUUID();
    const toolUseId = `toolu_${randomUUID().replace(/-/g, '').slice(0, 24)}`;

    const entry: ConversationEntry = {
      uuid,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'assistant',
      toolUseId,
      message: {
        role: 'assistant',
        content: [
          {
            type: 'tool_use',
            id: toolUseId,
            name: toolName,
            input,
          },
        ],
        model: this.model,
      },
    } as ConversationEntry;

    this.entries.push(entry);
    this.lastUuid = uuid;
    return this;
  }

  /**
   * Add a tool result message
   */
  addToolResult(toolUseId: string, result: string, isError = false): this {
    const uuid = randomUUID();

    const entry: ConversationEntry = {
      uuid,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'user',
      toolResultBlockId: toolUseId,
      message: {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUseId,
            content: result,
            is_error: isError,
          },
        ],
      },
    } as ConversationEntry;

    this.entries.push(entry);
    this.lastUuid = uuid;
    return this;
  }

  /**
   * Add a summary entry (context compression)
   */
  addSummary(summary: string, summarizedFrom?: string[]): this {
    const uuid = randomUUID();

    const entry: ConversationEntry = {
      uuid,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'summary',
      summary,
      summarizedFrom: summarizedFrom || [],
    } as ConversationEntry;

    this.entries.push(entry);
    this.lastUuid = uuid;
    return this;
  }

  /**
   * Add a conversation turn (user message + assistant response)
   */
  addTurn(userMessage: string, assistantMessage: string): this {
    return this
      .addUserMessage(userMessage)
      .addAssistantMessage(assistantMessage);
  }

  /**
   * Add a tool interaction (tool use + result)
   */
  addToolInteraction(
    toolName: string,
    input: Record<string, unknown>,
    result: string,
    isError = false
  ): this {
    // Get the tool use ID from the entry we're about to create
    const toolUseId = `toolu_${randomUUID().replace(/-/g, '').slice(0, 24)}`;

    // Add tool use
    const uuid1 = randomUUID();
    const toolUseEntry: ConversationEntry = {
      uuid: uuid1,
      parentUuid: this.lastUuid || undefined,
      timestamp: new Date().toISOString(),
      type: 'assistant',
      toolUseId,
      message: {
        role: 'assistant',
        content: [
          {
            type: 'tool_use',
            id: toolUseId,
            name: toolName,
            input,
          },
        ],
        model: this.model,
      },
    } as ConversationEntry;

    this.entries.push(toolUseEntry);
    this.lastUuid = uuid1;

    // Add tool result
    return this.addToolResult(toolUseId, result, isError);
  }

  /**
   * Get the current entries
   */
  getEntries(): ConversationEntry[] {
    return [...this.entries];
  }

  /**
   * Get the session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Build and save the session to disk
   */
  async build(): Promise<{
    sessionId: string;
    path: string;
    entryCount: number;
  }> {
    const projectDir = join(this.claudeDir, this.projectPath);
    const sessionPath = join(projectDir, `${this.sessionId}.jsonl`);

    // Ensure directory exists
    await mkdir(projectDir, { recursive: true });

    // Write entries
    const content = this.entries.map((e) => JSON.stringify(e)).join('\n') + '\n';
    await Bun.write(sessionPath, content);

    return {
      sessionId: this.sessionId,
      path: sessionPath,
      entryCount: this.entries.length,
    };
  }

  /**
   * Generate a session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 8);
    return `session-${timestamp}-${random}`;
  }

  /**
   * Encode project path to base64
   */
  private encodeProjectPath(path: string): string {
    return Buffer.from(path).toString('base64');
  }
}

/**
 * Conversation Factory
 *
 * Factory methods for creating common session types.
 */
export class ConversationFactory {
  /**
   * Create a simple Q&A session
   */
  static createQASession(
    projectPath: string,
    question: string,
    answer: string
  ): SessionBuilder {
    return new SessionBuilder({ projectPath })
      .addUserMessage(question)
      .addAssistantMessage(answer);
  }

  /**
   * Create a code review session
   */
  static createCodeReviewSession(
    projectPath: string,
    code: string,
    filePath: string
  ): SessionBuilder {
    return new SessionBuilder({
      projectPath,
      systemPrompt: 'You are a code review assistant. Analyze the provided code for issues, improvements, and best practices.',
    })
      .addUserMessage(`Please review this code from ${filePath}:\n\n\`\`\`\n${code}\n\`\`\``);
  }

  /**
   * Create a debugging session
   */
  static createDebuggingSession(
    projectPath: string,
    errorMessage: string,
    context: string
  ): SessionBuilder {
    return new SessionBuilder({
      projectPath,
      systemPrompt: 'You are a debugging assistant. Help identify and fix issues in code.',
    })
      .addUserMessage(`I'm getting this error:\n\n${errorMessage}\n\nContext:\n${context}`);
  }

  /**
   * Create a refactoring session
   */
  static createRefactoringSession(
    projectPath: string,
    code: string,
    goal: string
  ): SessionBuilder {
    return new SessionBuilder({
      projectPath,
      systemPrompt: 'You are a refactoring assistant. Help improve code structure and quality.',
    })
      .addUserMessage(`I want to refactor this code. Goal: ${goal}\n\n\`\`\`\n${code}\n\`\`\``);
  }

  /**
   * Create an exploration session
   */
  static createExplorationSession(
    projectPath: string,
    topic: string
  ): SessionBuilder {
    return new SessionBuilder({
      projectPath,
      systemPrompt: 'You are a helpful assistant exploring topics with the user.',
    })
      .addUserMessage(`Let's explore: ${topic}`);
  }

  /**
   * Create a session from a template
   */
  static fromTemplate(
    projectPath: string,
    template: SessionTemplate
  ): SessionBuilder {
    const builder = new SessionBuilder({
      projectPath,
      sessionName: template.name,
      systemPrompt: template.systemPrompt,
      model: template.model,
    });

    for (const entry of template.entries) {
      switch (entry.role) {
        case 'user':
          builder.addUserMessage(entry.content);
          break;
        case 'assistant':
          builder.addAssistantMessage(entry.content);
          break;
        case 'system':
          builder.addSystemMessage(entry.content);
          break;
      }
    }

    return builder;
  }
}

/**
 * Session template type
 */
export interface SessionTemplate {
  name?: string;
  systemPrompt?: string;
  model?: string;
  entries: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

// Export factory functions
export function createSession(options: BuilderOptions): SessionBuilder {
  return new SessionBuilder(options);
}
