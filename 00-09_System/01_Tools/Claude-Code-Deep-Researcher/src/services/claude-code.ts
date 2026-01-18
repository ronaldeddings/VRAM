import { query } from '@anthropic-ai/claude-agent-sdk';
import type { Options, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { ExecutionResult } from '../types/index.ts';
import { ConfigManager } from './config.ts';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

/**
 * Claude Code SDK service wrapper
 * Provides high-level interface for interacting with Claude Code SDK
 */
export class ClaudeCodeService {
  private configManager: ConfigManager;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
  }

  /**
   * Fallback method: calls Claude Code CLI directly when SDK fails
   */
  private async runPromptDirect(prompt: string, cwd: string = process.cwd()): Promise<ExecutionResult> {
    console.log('🔄 Falling back to direct Claude Code CLI execution...');
    
    return new Promise((resolve) => {
      const claude = spawn('claude', ['--dangerously-skip-permissions'], {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      claude.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      claude.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      claude.on('close', (code) => {
        if (code === 0) {
          // Generate a mock session ID
          const sessionId = randomUUID();
          const timestamp = new Date().toISOString();
          
          // Create mock messages that mimic SDK structure
          const userMessage: SDKMessage = {
            type: 'user',
            message: {
              role: 'user',
              content: prompt
            },
            parent_tool_use_id: null,
            session_id: sessionId,
            uuid: randomUUID()
          };

          const outputContent = stdout.trim() || 'Task completed successfully';

          const assistantMessage: SDKMessage = {
            type: 'assistant',
            message: {
              id: randomUUID(),
              type: 'message',
              role: 'assistant',
              content: [{ type: 'text', text: outputContent, citations: null }],
              model: 'claude-sonnet-4-20250514',
              stop_reason: 'end_turn',
              stop_sequence: null,
              container: null,
              context_management: null,
              usage: {
                input_tokens: 0,
                output_tokens: 0,
                cache_creation_input_tokens: 0,
                cache_read_input_tokens: 0,
                cache_creation: {
                  ephemeral_5m_input_tokens: 0,
                  ephemeral_1h_input_tokens: 0
                },
                server_tool_use: {
                  web_fetch_requests: 0,
                  web_search_requests: 0
                },
                service_tier: 'standard'
              }
            },
            parent_tool_use_id: null,
            session_id: sessionId,
            uuid: randomUUID()
          };

          const resultMessage: SDKMessage = {
            type: 'result',
            subtype: 'success',
            duration_ms: 0,
            duration_api_ms: 0,
            is_error: false,
            num_turns: 1,
            result: outputContent,
            total_cost_usd: 0,
            usage: {
              input_tokens: 0,
              output_tokens: 0,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 0,
              cache_creation: {
                ephemeral_5m_input_tokens: 0,
                ephemeral_1h_input_tokens: 0
              },
              server_tool_use: {
                web_fetch_requests: 0,
                web_search_requests: 0
              },
              service_tier: 'standard'
            },
            modelUsage: {},
            permission_denials: [],
            session_id: sessionId,
            uuid: randomUUID()
          };

          const messages = [userMessage, assistantMessage, resultMessage];

          // Create a proper session file in the projects directory
          try {
            this.createSessionFile(sessionId, messages, cwd);
          } catch (error) {
            console.warn('⚠️ Could not create session file:', error);
          }
          
          resolve({
            success: true,
            messages,
            sessionId,
            extractedResult: outputContent,
            cost: 0,
            tokenUsage: { input: 0, output: 0 },
            executionTime: 0
          });
        } else {
          resolve({
            success: false,
            messages: [],
            error: `Claude Code CLI failed (code ${code}): ${stderr || 'Unknown error'}`
          });
        }
      });

      // Send the prompt to Claude Code
      claude.stdin.write(prompt);
      claude.stdin.end();
    });
  }

  /**
   * Creates a session file compatible with Claude Code projects directory structure
   */
  private createSessionFile(sessionId: string, messages: SDKMessage[], cwd: string): void {
    const { getSessionFilePath } = require('../utils/path.ts');
    const { mkdirSync, existsSync } = require('fs');
    const { dirname } = require('path');
    
    try {
      const sessionPath = getSessionFilePath(cwd, sessionId);
      const dir = dirname(sessionPath);
      
      // Create directory if it doesn't exist
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      
      // Write JSONL format
      const jsonlContent = messages.map(msg => JSON.stringify(msg)).join('\n') + '\n';
      writeFileSync(sessionPath, jsonlContent);
      
      console.log(`📝 Created session file: ${sessionPath}`);
    } catch (error) {
      console.warn('⚠️ Failed to create session file:', error);
    }
  }

  /**
   * Executes a prompt through Claude Code SDK and collects all messages
   */
  async runPrompt(prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    // Merge configuration with provided options - declare outside try block for catch access
    const sdkOptions = this.configManager.createSdkOptions(options);
    
    try {
      
      // Debug: Log the SDK options being used
      console.log('🔧 SDK Options:', JSON.stringify(sdkOptions, null, 2));
      
      // Validate options
      if (!this.configManager.validateSdkOptions(sdkOptions)) {
        return {
          success: false,
          messages: [],
          error: 'Invalid SDK options'
        };
      }

      // Execute query and collect all messages
      const messages: SDKMessage[] = [];
      
      // Try with no options first to see if that works
      console.log('🔧 Executing query with prompt:', prompt.substring(0, 100) + '...');
      console.log('🔧 Trying with no options...');
      const queryStream = query({ prompt });

      for await (const message of queryStream) {
        console.log('📨 Received message:', message.type, message.session_id ? `(${message.session_id})` : '');
        messages.push(message);
        
        // Extract session ID from first message if available
        if (messages.length === 1 && message.session_id) {
          // Store session ID for potential use
        }
      }

      return {
        success: true,
        messages,
        sessionId: messages.length > 0 ? messages[0]?.session_id : undefined
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Handle JSON parsing errors from Claude Code SDK - try fallback
      if (errorMessage.includes('JSON Parse error') || errorMessage.includes('Unexpected identifier')) {
        console.log('⚠️ SDK failed with JSON parse error, trying direct CLI fallback...');
        try {
          return await this.runPromptDirect(prompt, sdkOptions.cwd || process.cwd());
        } catch (fallbackError) {
          return {
            success: false,
            messages: [],
            error: `Both SDK and CLI fallback failed. SDK: ${errorMessage}. CLI: ${fallbackError}`
          };
        }
      }
      
      if (errorMessage.includes('abort') || errorMessage.includes('cancelled')) {
        return {
          success: false,
          messages: [],
          error: 'Operation was aborted'
        };
      }

      // For other errors, also try the fallback
      console.log('⚠️ SDK failed, trying direct CLI fallback...');
      try {
        return await this.runPromptDirect(prompt, sdkOptions.cwd || process.cwd());
      } catch (fallbackError) {
        return {
          success: false,
          messages: [],
          error: `Both SDK and CLI fallback failed. SDK: ${errorMessage}. CLI: ${fallbackError}`
        };
      }
    }
  }

  /**
   * Resumes an existing conversation by session ID
   */
  async resumeConversation(sessionId: string, prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    try {
      // Add resume option to SDK options
      const resumeOptions = {
        ...options,
        resume: sessionId
      };

      return await this.runPrompt(prompt, resumeOptions);

    } catch (error) {
      return {
        success: false,
        messages: [],
        error: `Failed to resume conversation: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Executes a prompt with streaming support and custom message handling
   */
  async *streamPrompt(prompt: string, options: Partial<Options> = {}): AsyncGenerator<SDKMessage, void> {
    // Merge configuration with provided options
    const sdkOptions = this.configManager.createSdkOptions(options);
    
    // Validate options
    if (!this.configManager.validateSdkOptions(sdkOptions)) {
      throw new Error('Invalid SDK options');
    }

    try {
      const queryStream = query({ prompt, options: sdkOptions });

      for await (const message of queryStream) {
        yield message;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('abort') || errorMessage.includes('cancelled')) {
        throw new Error('Operation was aborted');
      }
      throw error;
    }
  }

  /**
   * Cancels an ongoing query using AbortController
   */
  createAbortableQuery(prompt: string, options: Partial<Options> = {}): {
    query: AsyncGenerator<SDKMessage, void>;
    abort: () => void;
  } {
    const abortController = new AbortController();
    
    const sdkOptions = {
      ...this.configManager.createSdkOptions(options),
      abortController
    };

    const queryStream = query({ prompt, options: sdkOptions });

    return {
      query: queryStream,
      abort: () => abortController.abort()
    };
  }

  /**
   * Gets the current configuration manager
   */
  getConfigManager(): ConfigManager {
    return this.configManager;
  }

  /**
   * Updates the service configuration
   */
  updateConfig(updates: any): void {
    this.configManager.updateConfig(updates);
  }

  /**
   * Validates a session ID exists and is accessible
   */
  async validateSession(sessionId: string): Promise<boolean> {
    try {
      // Try to resume with an empty prompt to test session validity
      const testOptions = {
        resume: sessionId,
        maxTurns: 1
      };

      // This is a minimal test - in practice you might want to check
      // if the session file exists in the filesystem
      const result = await this.runPrompt('', testOptions);
      return result.success;

    } catch (error) {
      return false;
    }
  }

  /**
   * Gets available tools from configuration
   */
  getAvailableTools(): string[] {
    return this.configManager.get('allowedTools');
  }

  /**
   * Sets allowed tools for subsequent operations
   */
  setAllowedTools(tools: string[]): void {
    this.configManager.set('allowedTools', tools);
  }

  /**
   * Gets current max turns setting
   */
  getMaxTurns(): number {
    return this.configManager.get('maxTurns');
  }

  /**
   * Sets max turns for subsequent operations
   */
  setMaxTurns(maxTurns: number): void {
    this.configManager.set('maxTurns', maxTurns);
  }
}