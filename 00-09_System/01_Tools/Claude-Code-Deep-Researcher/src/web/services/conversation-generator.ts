/**
 * Conversation Generator Service
 *
 * Generates conversation sessions from templates, DSL definitions,
 * or programmatic specifications. Supports:
 * - Template-based generation
 * - DSL parsing for conversation scripts
 * - Pattern-based generation
 * - Tool interaction simulation
 */

import { randomUUID } from 'crypto';
import { SessionBuilder, createSession } from './session-builder';
import type { ConversationEntry } from '../../types/claude-conversation';

/**
 * DSL Token types for conversation scripts
 */
type TokenType =
  | 'USER'
  | 'ASSISTANT'
  | 'SYSTEM'
  | 'TOOL'
  | 'RESULT'
  | 'SUMMARY'
  | 'STRING'
  | 'IDENTIFIER'
  | 'ARROW'
  | 'COLON'
  | 'LBRACE'
  | 'RBRACE'
  | 'NEWLINE'
  | 'EOF';

interface Token {
  type: TokenType;
  value: string;
  line: number;
}

/**
 * Conversation DSL Parser
 *
 * Parses a simple DSL for defining conversations:
 *
 * @system "You are a helpful assistant"
 *
 * @user "Hello, how are you?"
 *
 * @assistant "I'm doing well, thank you!"
 *
 * @tool Read { file_path: "/test.txt" }
 * @result "File contents here"
 *
 * @summary "User greeted assistant"
 */
export class ConversationDSL {
  private tokens: Token[] = [];
  private current = 0;

  /**
   * Parse DSL string into session builder
   */
  parse(dsl: string, projectPath: string): SessionBuilder {
    this.tokens = this.tokenize(dsl);
    this.current = 0;

    const builder = createSession({ projectPath });

    while (!this.isAtEnd()) {
      this.parseStatement(builder);
    }

    return builder;
  }

  /**
   * Tokenize the DSL string
   */
  private tokenize(dsl: string): Token[] {
    const tokens: Token[] = [];
    const lines = dsl.split('\n');

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum].trim();
      if (!line || line.startsWith('//') || line.startsWith('#')) continue;

      // Match directives
      const directiveMatch = line.match(/^@(\w+)\s*(.*)/);
      if (directiveMatch) {
        const [, directive, rest] = directiveMatch;
        tokens.push({
          type: directive.toUpperCase() as TokenType,
          value: directive,
          line: lineNum + 1,
        });

        // Parse the rest of the line
        const restTokens = this.tokenizeValue(rest.trim(), lineNum + 1);
        tokens.push(...restTokens);
      }

      tokens.push({ type: 'NEWLINE', value: '\n', line: lineNum + 1 });
    }

    tokens.push({ type: 'EOF', value: '', line: lines.length });
    return tokens;
  }

  /**
   * Tokenize a value string
   */
  private tokenizeValue(value: string, line: number): Token[] {
    const tokens: Token[] = [];

    if (!value) return tokens;

    // String literal
    if (value.startsWith('"') || value.startsWith("'")) {
      const quote = value[0];
      const endQuote = value.lastIndexOf(quote);
      if (endQuote > 0) {
        tokens.push({
          type: 'STRING',
          value: value.slice(1, endQuote),
          line,
        });
        const remaining = value.slice(endQuote + 1).trim();
        if (remaining) {
          tokens.push(...this.tokenizeValue(remaining, line));
        }
      }
    }
    // Object literal
    else if (value.startsWith('{')) {
      const endBrace = this.findMatchingBrace(value);
      if (endBrace > 0) {
        tokens.push({ type: 'LBRACE', value: '{', line });
        tokens.push({
          type: 'STRING',
          value: value.slice(1, endBrace),
          line,
        });
        tokens.push({ type: 'RBRACE', value: '}', line });
      }
    }
    // Identifier
    else {
      const match = value.match(/^(\w+)\s*(.*)/);
      if (match) {
        tokens.push({
          type: 'IDENTIFIER',
          value: match[1],
          line,
        });
        if (match[2]) {
          tokens.push(...this.tokenizeValue(match[2].trim(), line));
        }
      }
    }

    return tokens;
  }

  /**
   * Find matching closing brace
   */
  private findMatchingBrace(str: string): number {
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  /**
   * Parse a single statement
   */
  private parseStatement(builder: SessionBuilder): void {
    const token = this.peek();

    switch (token.type) {
      case 'USER':
        this.parseUserMessage(builder);
        break;
      case 'ASSISTANT':
        this.parseAssistantMessage(builder);
        break;
      case 'SYSTEM':
        this.parseSystemMessage(builder);
        break;
      case 'TOOL':
        this.parseToolUse(builder);
        break;
      case 'RESULT':
        this.parseToolResult(builder);
        break;
      case 'SUMMARY':
        this.parseSummary(builder);
        break;
      case 'NEWLINE':
      case 'EOF':
        this.advance();
        break;
      default:
        this.advance(); // Skip unknown tokens
    }
  }

  /**
   * Parse @user directive
   */
  private parseUserMessage(builder: SessionBuilder): void {
    this.advance(); // consume @user
    const content = this.consumeString();
    if (content) {
      builder.addUserMessage(content);
    }
    this.consumeNewline();
  }

  /**
   * Parse @assistant directive
   */
  private parseAssistantMessage(builder: SessionBuilder): void {
    this.advance(); // consume @assistant
    const content = this.consumeString();
    if (content) {
      builder.addAssistantMessage(content);
    }
    this.consumeNewline();
  }

  /**
   * Parse @system directive
   */
  private parseSystemMessage(builder: SessionBuilder): void {
    this.advance(); // consume @system
    const content = this.consumeString();
    if (content) {
      builder.addSystemMessage(content);
    }
    this.consumeNewline();
  }

  /**
   * Parse @tool directive
   */
  private parseToolUse(builder: SessionBuilder): void {
    this.advance(); // consume @tool
    const toolName = this.consumeIdentifier();
    const input = this.consumeObject();

    if (toolName) {
      builder.addToolUse(toolName, input || {});
    }
    this.consumeNewline();
  }

  /**
   * Parse @result directive
   */
  private parseToolResult(builder: SessionBuilder): void {
    this.advance(); // consume @result
    const content = this.consumeString();

    // Find the last tool use to get its ID
    const entries = builder.getEntries();
    const lastToolUse = [...entries].reverse().find(
      (e) => 'toolUseId' in e && e.toolUseId
    );

    if (lastToolUse && 'toolUseId' in lastToolUse && content) {
      builder.addToolResult(lastToolUse.toolUseId as string, content);
    }
    this.consumeNewline();
  }

  /**
   * Parse @summary directive
   */
  private parseSummary(builder: SessionBuilder): void {
    this.advance(); // consume @summary
    const content = this.consumeString();
    if (content) {
      builder.addSummary(content);
    }
    this.consumeNewline();
  }

  /**
   * Consume a string token
   */
  private consumeString(): string | null {
    if (this.check('STRING')) {
      return this.advance().value;
    }
    return null;
  }

  /**
   * Consume an identifier token
   */
  private consumeIdentifier(): string | null {
    if (this.check('IDENTIFIER')) {
      return this.advance().value;
    }
    return null;
  }

  /**
   * Consume an object literal
   */
  private consumeObject(): Record<string, unknown> | null {
    if (this.check('LBRACE')) {
      this.advance(); // consume {
      const content = this.consumeString();
      if (this.check('RBRACE')) {
        this.advance(); // consume }
      }

      if (content) {
        try {
          // Parse as JSON-like object
          return JSON.parse(`{${content}}`);
        } catch {
          // Try parsing as key-value pairs
          return this.parseKeyValuePairs(content);
        }
      }
    }
    return null;
  }

  /**
   * Parse key-value pairs from a string
   */
  private parseKeyValuePairs(str: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const pairs = str.split(',');

    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split(':');
      if (key && valueParts.length > 0) {
        const cleanKey = key.trim().replace(/^["']|["']$/g, '');
        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        result[cleanKey] = value;
      }
    }

    return result;
  }

  /**
   * Consume newline tokens
   */
  private consumeNewline(): void {
    while (this.check('NEWLINE')) {
      this.advance();
    }
  }

  /**
   * Check current token type
   */
  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  /**
   * Get current token
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Advance to next token
   */
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  /**
   * Check if at end of tokens
   */
  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }
}

/**
 * Pattern-based Conversation Generator
 *
 * Generates conversations from predefined patterns.
 */
export class PatternGenerator {
  /**
   * Generate a multi-turn conversation
   */
  static generateMultiTurn(
    projectPath: string,
    turns: Array<{ user: string; assistant: string }>
  ): SessionBuilder {
    const builder = createSession({ projectPath });

    for (const turn of turns) {
      builder.addTurn(turn.user, turn.assistant);
    }

    return builder;
  }

  /**
   * Generate a tool-heavy session
   */
  static generateToolSession(
    projectPath: string,
    tools: Array<{
      name: string;
      input: Record<string, unknown>;
      result: string;
    }>
  ): SessionBuilder {
    const builder = createSession({
      projectPath,
      systemPrompt: 'You are a helpful assistant with access to various tools.',
    });

    builder.addUserMessage('Please help me with my task.');

    for (const tool of tools) {
      builder.addToolInteraction(tool.name, tool.input, tool.result);
    }

    builder.addAssistantMessage('I have completed the requested operations.');

    return builder;
  }

  /**
   * Generate a code exploration session
   */
  static generateCodeExploration(
    projectPath: string,
    files: Array<{ path: string; content: string }>
  ): SessionBuilder {
    const builder = createSession({
      projectPath,
      systemPrompt: 'You are exploring a codebase to understand its structure.',
    });

    builder.addUserMessage('Please explore and explain this codebase.');

    for (const file of files) {
      builder.addToolInteraction(
        'Read',
        { file_path: file.path },
        file.content
      );
      builder.addAssistantMessage(`I've read ${file.path}. Let me analyze it...`);
    }

    return builder;
  }

  /**
   * Generate a debugging session
   */
  static generateDebuggingSession(
    projectPath: string,
    error: string,
    investigation: Array<{
      tool: string;
      input: Record<string, unknown>;
      result: string;
      analysis: string;
    }>
  ): SessionBuilder {
    const builder = createSession({
      projectPath,
      systemPrompt: 'You are debugging an issue in the codebase.',
    });

    builder.addUserMessage(`I'm seeing this error: ${error}`);

    for (const step of investigation) {
      builder.addToolInteraction(step.tool, step.input, step.result);
      builder.addAssistantMessage(step.analysis);
    }

    return builder;
  }
}

/**
 * Conversation Generator Service
 *
 * Main service for generating conversations.
 */
export class ConversationGenerator {
  private dslParser = new ConversationDSL();

  /**
   * Generate from DSL script
   */
  fromDSL(dsl: string, projectPath: string): SessionBuilder {
    return this.dslParser.parse(dsl, projectPath);
  }

  /**
   * Generate from JSON template
   */
  fromJSON(
    template: {
      systemPrompt?: string;
      entries: Array<{
        type: 'user' | 'assistant' | 'system' | 'tool' | 'result' | 'summary';
        content?: string;
        toolName?: string;
        toolInput?: Record<string, unknown>;
        toolResult?: string;
      }>;
    },
    projectPath: string
  ): SessionBuilder {
    const builder = createSession({
      projectPath,
      systemPrompt: template.systemPrompt,
    });

    let lastToolUseId: string | null = null;

    for (const entry of template.entries) {
      switch (entry.type) {
        case 'user':
          if (entry.content) builder.addUserMessage(entry.content);
          break;
        case 'assistant':
          if (entry.content) builder.addAssistantMessage(entry.content);
          break;
        case 'system':
          if (entry.content) builder.addSystemMessage(entry.content);
          break;
        case 'tool':
          if (entry.toolName) {
            builder.addToolUse(entry.toolName, entry.toolInput || {});
            // Capture the tool use ID for potential result
            const entries = builder.getEntries();
            const last = entries[entries.length - 1];
            if ('toolUseId' in last) {
              lastToolUseId = last.toolUseId as string;
            }
          }
          break;
        case 'result':
          if (lastToolUseId && entry.toolResult) {
            builder.addToolResult(lastToolUseId, entry.toolResult);
          }
          break;
        case 'summary':
          if (entry.content) builder.addSummary(entry.content);
          break;
      }
    }

    return builder;
  }

  /**
   * Generate multi-turn conversation
   */
  multiTurn(
    projectPath: string,
    turns: Array<{ user: string; assistant: string }>
  ): SessionBuilder {
    return PatternGenerator.generateMultiTurn(projectPath, turns);
  }

  /**
   * Generate tool-heavy session
   */
  toolSession(
    projectPath: string,
    tools: Array<{
      name: string;
      input: Record<string, unknown>;
      result: string;
    }>
  ): SessionBuilder {
    return PatternGenerator.generateToolSession(projectPath, tools);
  }
}

// Export singleton instance
export const conversationGenerator = new ConversationGenerator();
