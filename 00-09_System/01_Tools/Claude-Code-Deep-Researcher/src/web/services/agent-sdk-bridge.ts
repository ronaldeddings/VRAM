/**
 * Agent SDK Bridge
 *
 * Integrates with the Claude Agent SDK to provide:
 * - Session resume capabilities
 * - Context prebaking
 * - Prompt execution
 * - Streaming responses
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import type { ConversationEntry } from '../../types/claude-conversation';

/**
 * Session context for resuming
 */
export interface SessionContext {
  sessionId: string;
  projectPath: string;
  entries: ConversationEntry[];
  summary?: string;
  tokenCount?: number;
  lastActivity: string;
}

/**
 * Resume options
 */
export interface ResumeOptions {
  /** Maximum tokens for context */
  maxTokens?: number;
  /** Include system messages */
  includeSystem?: boolean;
  /** Include tool interactions */
  includeTools?: boolean;
  /** Summarize older entries */
  summarizeOlder?: boolean;
  /** Number of recent entries to keep full */
  recentEntryCount?: number;
}

/**
 * Prebaked context for session resume
 */
export interface PrebakedContext {
  systemPrompt?: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{ type: string; [key: string]: unknown }>;
  }>;
  metadata: {
    sessionId: string;
    entryCount: number;
    tokenEstimate: number;
    timestamp: string;
  };
}

/**
 * Agent SDK Bridge
 *
 * Provides integration between the Web UI and Claude Agent SDK.
 */
export class AgentSDKBridge {
  private claudeDir: string;

  constructor() {
    this.claudeDir = join(homedir(), '.claude', 'projects');
  }

  /**
   * Get session context for resuming
   */
  async getSessionContext(sessionId: string): Promise<SessionContext | null> {
    const sessionPath = await this.findSessionPath(sessionId);
    if (!sessionPath) return null;

    const entries = await this.readSessionEntries(sessionPath);
    const projectPath = this.extractProjectPath(sessionPath);

    // Get last activity timestamp
    const fileStat = await stat(sessionPath);
    const lastActivity = fileStat.mtime.toISOString();

    // Estimate token count
    const tokenCount = this.estimateTokenCount(entries);

    return {
      sessionId,
      projectPath,
      entries,
      tokenCount,
      lastActivity,
    };
  }

  /**
   * Prebake context for session resume
   */
  async prebakeContext(
    sessionId: string,
    options: ResumeOptions = {}
  ): Promise<PrebakedContext | null> {
    const context = await this.getSessionContext(sessionId);
    if (!context) return null;

    const {
      maxTokens = 100000,
      includeSystem = true,
      includeTools = true,
      summarizeOlder = true,
      recentEntryCount = 20,
    } = options;

    let entries = context.entries;

    // Filter by type
    if (!includeSystem) {
      entries = entries.filter((e) => !this.isSystemEntry(e));
    }
    if (!includeTools) {
      entries = entries.filter((e) => !this.isToolEntry(e));
    }

    // Build messages
    const messages: PrebakedContext['messages'] = [];
    let systemPrompt: string | undefined;

    // Extract system prompt
    const systemEntry = entries.find((e) => this.isSystemEntry(e));
    if (systemEntry && 'message' in systemEntry) {
      const msg = systemEntry.message as { content?: string };
      if (typeof msg.content === 'string') {
        systemPrompt = msg.content;
      }
    }

    // Handle summarization if needed
    if (summarizeOlder && entries.length > recentEntryCount) {
      const olderEntries = entries.slice(0, -recentEntryCount);
      const recentEntries = entries.slice(-recentEntryCount);

      // Generate summary of older entries
      const summary = this.summarizeEntries(olderEntries);
      if (summary) {
        messages.push({
          role: 'system',
          content: `[Previous conversation summary: ${summary}]`,
        });
      }

      // Add recent entries
      for (const entry of recentEntries) {
        const message = this.entryToMessage(entry);
        if (message) {
          messages.push(message);
        }
      }
    } else {
      // Add all entries
      for (const entry of entries) {
        if (this.isSystemEntry(entry)) continue; // Skip system, already handled
        const message = this.entryToMessage(entry);
        if (message) {
          messages.push(message);
        }
      }
    }

    // Truncate if over token limit
    let tokenEstimate = this.estimateMessageTokens(messages);
    while (tokenEstimate > maxTokens && messages.length > 1) {
      messages.shift();
      tokenEstimate = this.estimateMessageTokens(messages);
    }

    return {
      systemPrompt,
      messages,
      metadata: {
        sessionId,
        entryCount: context.entries.length,
        tokenEstimate,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate resume command for Claude Code CLI
   */
  generateResumeCommand(sessionId: string, prompt?: string): string {
    const args = ['claude', '--resume', sessionId];
    if (prompt) {
      args.push('--prompt', `"${prompt.replace(/"/g, '\\"')}"`);
    }
    return args.join(' ');
  }

  /**
   * Generate session resume script
   */
  async generateResumeScript(
    sessionId: string,
    options: ResumeOptions = {}
  ): Promise<string> {
    const context = await this.prebakeContext(sessionId, options);
    if (!context) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Generate TypeScript code for Agent SDK
    const script = `
import Anthropic from "@anthropic-ai/sdk";

// Prebaked context from session: ${sessionId}
const systemPrompt = ${JSON.stringify(context.systemPrompt || '')};
const messages = ${JSON.stringify(context.messages, null, 2)};

async function resumeSession() {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8096,
    system: systemPrompt,
    messages: messages,
  });

  console.log(response.content);
}

resumeSession().catch(console.error);
`.trim();

    return script;
  }

  /**
   * Get available sessions for resume
   */
  async getResumableSessions(): Promise<
    Array<{
      sessionId: string;
      projectPath: string;
      projectName: string;
      entryCount: number;
      lastActivity: string;
      size: number;
    }>
  > {
    const sessions: Array<{
      sessionId: string;
      projectPath: string;
      projectName: string;
      entryCount: number;
      lastActivity: string;
      size: number;
    }> = [];

    try {
      const projects = await readdir(this.claudeDir);

      for (const project of projects) {
        const projectDir = join(this.claudeDir, project);
        const projectStat = await stat(projectDir);

        if (!projectStat.isDirectory()) continue;

        // Decode project name
        let projectName = project;
        try {
          projectName = Buffer.from(project, 'base64').toString('utf-8');
        } catch {
          // Keep original if not base64
        }

        const files = await readdir(projectDir);
        for (const file of files) {
          if (!file.endsWith('.jsonl')) continue;

          const sessionPath = join(projectDir, file);
          const sessionStat = await stat(sessionPath);
          const sessionId = file.replace('.jsonl', '');

          // Count entries
          const entries = await this.readSessionEntries(sessionPath);

          sessions.push({
            sessionId,
            projectPath: project,
            projectName,
            entryCount: entries.length,
            lastActivity: sessionStat.mtime.toISOString(),
            size: sessionStat.size,
          });
        }
      }

      // Sort by last activity
      sessions.sort(
        (a, b) =>
          new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      );

      return sessions;
    } catch {
      return [];
    }
  }

  /**
   * Validate session can be resumed
   */
  async validateSessionResume(sessionId: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const context = await this.getSessionContext(sessionId);
    if (!context) {
      errors.push(`Session not found: ${sessionId}`);
      return { valid: false, errors, warnings };
    }

    // Check for minimum entries
    if (context.entries.length === 0) {
      errors.push('Session has no entries');
    }

    // Check for user messages
    const userMessages = context.entries.filter(
      (e) => 'message' in e && (e.message as any)?.role === 'user'
    );
    if (userMessages.length === 0) {
      warnings.push('Session has no user messages');
    }

    // Check for orphaned tool results
    const toolUseIds = new Set(
      context.entries
        .filter((e) => 'toolUseId' in e)
        .map((e) => (e as any).toolUseId)
    );
    const toolResultIds = new Set(
      context.entries
        .filter((e) => 'toolResultBlockId' in e)
        .map((e) => (e as any).toolResultBlockId)
    );

    for (const id of toolResultIds) {
      if (!toolUseIds.has(id)) {
        warnings.push(`Orphaned tool result: ${id}`);
      }
    }

    // Check token count
    if (context.tokenCount && context.tokenCount > 150000) {
      warnings.push(
        `High token count (${context.tokenCount}). Consider summarizing.`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // =================================================================
  // Private Helpers
  // =================================================================

  private async findSessionPath(sessionId: string): Promise<string | null> {
    try {
      const projects = await readdir(this.claudeDir);

      for (const project of projects) {
        const projectPath = join(this.claudeDir, project);
        const projectStat = await stat(projectPath);

        if (!projectStat.isDirectory()) continue;

        const files = await readdir(projectPath);
        for (const file of files) {
          if (file === `${sessionId}.jsonl`) {
            return join(projectPath, file);
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  private extractProjectPath(sessionPath: string): string {
    const parts = sessionPath.split('/');
    const projectIndex = parts.indexOf('projects');
    if (projectIndex >= 0 && projectIndex < parts.length - 2) {
      return parts[projectIndex + 1];
    }
    return '';
  }

  private async readSessionEntries(path: string): Promise<ConversationEntry[]> {
    const file = Bun.file(path);
    const content = await file.text();
    const lines = content.trim().split('\n');

    return lines
      .filter((line) => line.trim())
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter((entry): entry is ConversationEntry => entry !== null);
  }

  private isSystemEntry(entry: ConversationEntry): boolean {
    if ('message' in entry && entry.message) {
      return (entry.message as any).role === 'system';
    }
    if ('type' in entry) {
      return (entry as any).type === 'system';
    }
    return false;
  }

  private isToolEntry(entry: ConversationEntry): boolean {
    if ('toolUseId' in entry || 'toolResultBlockId' in entry) {
      return true;
    }
    if ('message' in entry && Array.isArray((entry.message as any)?.content)) {
      const content = (entry.message as any).content;
      return content.some(
        (c: any) => c.type === 'tool_use' || c.type === 'tool_result'
      );
    }
    return false;
  }

  private entryToMessage(
    entry: ConversationEntry
  ): PrebakedContext['messages'][0] | null {
    if (!('message' in entry) || !entry.message) return null;

    const msg = entry.message as {
      role?: string;
      content?: string | Array<{ type: string; [key: string]: unknown }>;
    };

    if (!msg.role || !msg.content) return null;

    return {
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    };
  }

  private estimateTokenCount(entries: ConversationEntry[]): number {
    let totalChars = 0;

    for (const entry of entries) {
      if ('message' in entry && entry.message) {
        const content = (entry.message as any).content;
        if (typeof content === 'string') {
          totalChars += content.length;
        } else if (Array.isArray(content)) {
          for (const block of content) {
            if (block.text) totalChars += block.text.length;
            if (block.content) totalChars += block.content.length;
            if (block.input) totalChars += JSON.stringify(block.input).length;
          }
        }
      }
      if ('summary' in entry) {
        totalChars += ((entry as any).summary || '').length;
      }
    }

    // Rough estimate: ~4 chars per token
    return Math.ceil(totalChars / 4);
  }

  private estimateMessageTokens(
    messages: PrebakedContext['messages']
  ): number {
    let totalChars = 0;

    for (const msg of messages) {
      if (typeof msg.content === 'string') {
        totalChars += msg.content.length;
      } else if (Array.isArray(msg.content)) {
        totalChars += JSON.stringify(msg.content).length;
      }
    }

    return Math.ceil(totalChars / 4);
  }

  private summarizeEntries(entries: ConversationEntry[]): string {
    const parts: string[] = [];

    // Count by type
    const userCount = entries.filter(
      (e) => 'message' in e && (e.message as any)?.role === 'user'
    ).length;
    const assistantCount = entries.filter(
      (e) => 'message' in e && (e.message as any)?.role === 'assistant'
    ).length;
    const toolCount = entries.filter((e) => this.isToolEntry(e)).length;

    parts.push(`${entries.length} entries`);
    if (userCount > 0) parts.push(`${userCount} user messages`);
    if (assistantCount > 0) parts.push(`${assistantCount} assistant responses`);
    if (toolCount > 0) parts.push(`${toolCount} tool interactions`);

    // Extract key topics from first few user messages
    const userMessages = entries
      .filter((e) => 'message' in e && (e.message as any)?.role === 'user')
      .slice(0, 3);

    const topics: string[] = [];
    for (const msg of userMessages) {
      const content = (msg as any).message?.content;
      if (typeof content === 'string') {
        const firstLine = content.split('\n')[0].slice(0, 100);
        if (firstLine) topics.push(firstLine);
      }
    }

    if (topics.length > 0) {
      parts.push(`Topics: ${topics.join('; ')}`);
    }

    return parts.join('. ');
  }
}

// Export singleton instance
export const agentSDKBridge = new AgentSDKBridge();
