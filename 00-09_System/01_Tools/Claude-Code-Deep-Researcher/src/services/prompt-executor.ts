import type { Options, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { ExecutionResult } from '../types/index.ts';
import { ClaudeCodeService } from './claude-code.ts';
import { extractResult, getTotalCost, getTotalTokenUsage, isConversationSuccessful } from '../utils/message.ts';

/**
 * Prompt execution service with enhanced features and result processing
 */
export class PromptExecutor {
  private claudeCodeService: ClaudeCodeService;

  constructor(claudeCodeService: ClaudeCodeService) {
    this.claudeCodeService = claudeCodeService;
  }

  /**
   * Core Feature 1: Run Prompt - Execute prompts through Claude Code SDK
   * Executes a prompt and returns comprehensive results
   */
  async runPrompt(prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🚀 Executing prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);
      
      const result = await this.claudeCodeService.runPrompt(prompt, options);
      
      if (!result.success) {
        console.error(`❌ Prompt execution failed: ${result.error}`);
        return result;
      }

      const executionTime = Date.now() - startTime;
      const extractedResult = extractResult(result.messages);
      const cost = getTotalCost(result.messages);
      const tokenUsage = getTotalTokenUsage(result.messages);
      const successful = isConversationSuccessful(result.messages);

      console.log(`✅ Prompt executed successfully in ${executionTime}ms`);
      console.log(`💰 Cost: $${cost.toFixed(4)} | Tokens: ${tokenUsage.input}→${tokenUsage.output}`);
      
      if (extractedResult) {
        console.log(`📝 Result: ${extractedResult.substring(0, 200)}${extractedResult.length > 200 ? '...' : ''}`);
      }

      return {
        success: true,
        messages: result.messages,
        sessionId: result.sessionId,
        executionTime,
        extractedResult,
        cost,
        tokenUsage,
        conversationSuccessful: successful
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ Prompt execution error after ${executionTime}ms:`, error);
      
      return {
        success: false,
        messages: [],
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime
      };
    }
  }

  /**
   * Executes a prompt with streaming output for real-time feedback
   */
  async *runPromptStream(prompt: string, options: Partial<Options> = {}): AsyncGenerator<{
    message: SDKMessage;
    progress: string;
  }, ExecutionResult> {
    const startTime = Date.now();
    const messages: SDKMessage[] = [];
    let sessionId: string | undefined;

    try {
      console.log(`🔄 Starting streaming execution: "${prompt.substring(0, 100)}..."`);

      for await (const message of this.claudeCodeService.streamPrompt(prompt, options)) {
        messages.push(message);
        
        if (!sessionId && message.session_id) {
          sessionId = message.session_id;
        }

        // Generate progress information
        let progress = '';
        switch (message.type) {
          case 'system':
            progress = '🔧 System initialization...';
            break;
          case 'user':
            progress = '👤 Processing user input...';
            break;
          case 'assistant':
            progress = '🤖 Claude is thinking...';
            break;
          case 'result':
            progress = '✅ Execution completed';
            break;
          case 'stream_event':
            progress = '📡 Streaming response...';
            break;
          default:
            progress = '⚡ Processing...';
        }

        yield { message, progress };
      }

      const executionTime = Date.now() - startTime;
      const extractedResult = extractResult(messages);
      const cost = getTotalCost(messages);
      const tokenUsage = getTotalTokenUsage(messages);
      const successful = isConversationSuccessful(messages);

      console.log(`✅ Streaming execution completed in ${executionTime}ms`);

      return {
        success: true,
        messages,
        sessionId,
        executionTime,
        extractedResult,
        cost,
        tokenUsage,
        conversationSuccessful: successful
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ Streaming execution error after ${executionTime}ms:`, error);

      return {
        success: false,
        messages,
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown streaming error',
        executionTime
      };
    }
  }

  /**
   * Executes multiple prompts in sequence with context preservation
   */
  async runPromptSequence(prompts: string[], options: Partial<Options> = {}): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    let sessionId: string | undefined;

    console.log(`📋 Executing ${prompts.length} prompts in sequence`);

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i]!;
      console.log(`🔄 Step ${i + 1}/${prompts.length}: "${prompt.substring(0, 50)}..."`);

      // Use session ID from previous execution to maintain context
      const currentOptions = sessionId ? { ...options, resume: sessionId } : options;
      
      const result = await this.runPrompt(prompt, currentOptions);
      results.push(result);

      if (result.success && result.sessionId) {
        sessionId = result.sessionId;
      } else {
        console.warn(`⚠️ Step ${i + 1} failed, continuing with next prompt`);
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`📊 Sequence completed: ${successCount}/${prompts.length} successful`);

    return results;
  }

  /**
   * Executes a prompt with custom timeout and cancellation support
   */
  async runPromptWithTimeout(
    prompt: string, 
    timeoutMs: number, 
    options: Partial<Options> = {}
  ): Promise<ExecutionResult> {
    return new Promise(async (resolve) => {
      const { query, abort } = this.claudeCodeService.createAbortableQuery(prompt, options);
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        console.warn(`⏰ Prompt execution timed out after ${timeoutMs}ms`);
        abort();
        resolve({
          success: false,
          messages: [],
          error: `Execution timed out after ${timeoutMs}ms`
        });
      }, timeoutMs);

      try {
        const messages: SDKMessage[] = [];
        
        for await (const message of query) {
          messages.push(message);
        }

        clearTimeout(timeoutId);

        const extractedResult = extractResult(messages);
        const cost = getTotalCost(messages);
        const tokenUsage = getTotalTokenUsage(messages);
        const successful = isConversationSuccessful(messages);

        resolve({
          success: true,
          messages,
          sessionId: messages.length > 0 ? messages[0]?.session_id : undefined,
          extractedResult,
          cost,
          tokenUsage,
          conversationSuccessful: successful
        });

      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error && error.message.includes('abort')) {
          resolve({
            success: false,
            messages: [],
            error: 'Execution was cancelled'
          });
        } else {
          resolve({
            success: false,
            messages: [],
            error: error instanceof Error ? error.message : 'Unknown timeout error'
          });
        }
      }
    });
  }

  /**
   * Validates a prompt before execution
   */
  validatePrompt(prompt: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!prompt || prompt.trim().length === 0) {
      issues.push('Prompt cannot be empty');
    }

    if (prompt.length > 50000) {
      issues.push('Prompt exceeds maximum length of 50,000 characters');
    }

    // Check for potentially problematic content
    const suspiciousPatterns = [
      /rm\s+-rf\s+\//, // Dangerous rm commands
      /format\s+c:/i,  // Format commands
      /del\s+\/s\s+\/q/i // Recursive delete commands
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(prompt)) {
        issues.push('Prompt contains potentially dangerous commands');
        break;
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Gets execution statistics and metrics
   */
  getExecutionStats(): {
    averageExecutionTime: number;
    totalCost: number;
    totalTokensUsed: number;
    successRate: number;
  } {
    // This would be implemented with persistent storage in a real application
    // For now, return placeholder values
    return {
      averageExecutionTime: 0,
      totalCost: 0,
      totalTokensUsed: 0,
      successRate: 0
    };
  }

  /**
   * Gets the underlying Claude Code service
   */
  getClaudeCodeService(): ClaudeCodeService {
    return this.claudeCodeService;
  }
}