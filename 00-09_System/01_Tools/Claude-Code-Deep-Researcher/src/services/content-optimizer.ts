import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { randomUUID } from 'crypto';
import { dirname } from 'path';
import type { PromptExecutor } from './prompt-executor.ts';
import { getSessionFilePath } from '../utils/path.ts';
import { ClaudeCodeService } from './claude-code.ts';
import { ConfigManager } from './config.ts';

export interface ContentOptimization {
  originalSessionId: string;
  optimizedSessionId: string;
  originalLines: number;
  optimizedLines: number;
  linesRemoved: number;
  contentCondensed: number;
  createdAt: Date;
}

export interface OptimizationOptions {
  removeToolCalls?: boolean;
  removeIntermediateSteps?: boolean;
  condenseLargeFiles?: boolean;
  maxFileSnippetLines?: number;
  keepOnlyEssentials?: boolean;
}

/**
 * Stage 3 of prebake-context: JSONL Line Removal and Content Condensation
 * Systematically removes unnecessary JSONL lines and condenses large content
 */
export class ContentOptimizer {
  private promptExecutor: PromptExecutor;
  private projectRoot: string;
  private claudeCodeService: ClaudeCodeService;

  constructor(promptExecutor: PromptExecutor, projectRoot: string = process.cwd()) {
    this.promptExecutor = promptExecutor;
    this.projectRoot = projectRoot;
    const configManager = new ConfigManager();
    this.claudeCodeService = new ClaudeCodeService(configManager);
  }

  /**
   * Optimizes a curated conversation by removing unnecessary lines and condensing content
   */
  async optimizeContent(
    curatedSessionId: string,
    options: OptimizationOptions = {}
  ): Promise<ContentOptimization> {
    console.log('✂️ Starting JSONL optimization...');

    // Default options
    const opts = {
      removeToolCalls: false, // Be conservative about removal in Stage 3
      removeIntermediateSteps: false,
      condenseLargeFiles: true,
      maxFileSnippetLines: 15, // More generous with content
      keepOnlyEssentials: false, // Keep more content
      ...options
    };

    // Read the JSONL conversation file
    const originalLines = await this.readJsonlLines(curatedSessionId);
    console.log(`📖 Read ${originalLines.length} JSONL lines`);

    // Stage 3: Remove truly unnecessary JSONL lines (conservative)
    const filteredLines = this.removeUnnecessaryLines(originalLines, opts);
    console.log(`🗑️ Removed ${originalLines.length - filteredLines.length} unnecessary lines`);

    // Stage 3: Condense content within remaining lines using Claude Code SDK
    const condensedLines = await this.condenseContentWithClaude(filteredLines, opts);
    console.log(`✂️ Condensed content in ${filteredLines.length - condensedLines.length} lines`);

    // Create optimized conversation file
    const optimizedSessionId = await this.createOptimizedJsonl(condensedLines);
    
    console.log(`✨ Optimization complete: ${originalLines.length}→${condensedLines.length} lines`);
    
    return {
      originalSessionId: curatedSessionId,
      optimizedSessionId,
      originalLines: originalLines.length,
      optimizedLines: condensedLines.length,
      linesRemoved: originalLines.length - filteredLines.length,
      contentCondensed: filteredLines.length - condensedLines.length,
      createdAt: new Date()
    };
  }

  /**
   * Optimizes content with custom prompt guidance (for Stage 3 custom prompts)
   */
  async optimizeContentWithCustomPrompt(
    curatedSessionId: string,
    customPrompt: string,
    options: OptimizationOptions = {}
  ): Promise<ContentOptimization> {
    console.log('✂️ Starting JSONL optimization with custom prompt...');

    // Extract guidance from custom prompt
    const guidance = this.extractOptimizationGuidance(customPrompt);
    
    // Apply custom guidance to options
    const enhancedOptions = {
      removeToolCalls: false,
      removeIntermediateSteps: false,
      condenseLargeFiles: true,
      maxFileSnippetLines: guidance.maxLines || 15,
      keepOnlyEssentials: false,
      ...options
    };

    // Read the JSONL conversation file
    const originalLines = await this.readJsonlLines(curatedSessionId);
    console.log(`📖 Read ${originalLines.length} JSONL lines`);

    // Stage 3: Remove truly unnecessary JSONL lines (conservative)
    const filteredLines = this.removeUnnecessaryLines(originalLines, enhancedOptions);
    console.log(`🗑️ Removed ${originalLines.length - filteredLines.length} unnecessary lines`);

    // Stage 3: Condense content within remaining lines using Claude Code SDK with custom prompt
    const condensedLines = await this.condenseContentWithClaudeCustomPrompt(filteredLines, customPrompt, enhancedOptions);
    console.log(`✂️ Condensed content in ${filteredLines.length - condensedLines.length} lines`);

    // Create optimized conversation file
    const optimizedSessionId = await this.createOptimizedJsonl(condensedLines);
    
    console.log(`✨ Optimization complete: ${originalLines.length}→${condensedLines.length} lines`);
    
    return {
      originalSessionId: curatedSessionId,
      optimizedSessionId,
      originalLines: originalLines.length,
      optimizedLines: condensedLines.length,
      linesRemoved: originalLines.length - filteredLines.length,
      contentCondensed: filteredLines.length - condensedLines.length,
      createdAt: new Date()
    };
  }

  /**
   * Extracts optimization guidance from custom prompt
   */
  private extractOptimizationGuidance(customPrompt: string): {
    maxLines?: number;
    preserveTypes?: string[];
    focusAreas?: string[];
  } {
    const guidance: any = {};
    
    // Extract max lines preference
    const maxLinesMatch = customPrompt.match(/(\d+)\s*(lines?|max)/i);
    if (maxLinesMatch) {
      guidance.maxLines = parseInt(maxLinesMatch[1]);
    }
    
    // Extract what to preserve
    const preserveTerms = ['preserve', 'keep', 'maintain', 'retain'];
    for (const term of preserveTerms) {
      if (customPrompt.toLowerCase().includes(term)) {
        // Could extract specific things to preserve
      }
    }
    
    return guidance;
  }

  /**
   * Reads JSONL conversation lines from the session file
   */
  private async readJsonlLines(sessionId: string): Promise<ConversationMessage[]> {
    const filePath = getSessionFilePath(this.projectRoot, sessionId);
    
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      return lines.map(line => JSON.parse(line) as ConversationMessage);
    } catch (error) {
      throw new Error(`Failed to read JSONL conversation file ${filePath}: ${error}`);
    }
  }

  /**
   * Removes unnecessary JSONL lines (Stage 3 is focused on content condensation, not line removal)
   * Most line removal should happen in Stage 2
   */
  private removeUnnecessaryLines(
    lines: ConversationMessage[],
    options: OptimizationOptions
  ): ConversationMessage[] {
    // In Stage 3, we focus on content condensation rather than line removal
    // Only remove truly unnecessary lines that Stage 2 might have missed
    return lines.filter(line => this.shouldKeepLine(line, options));
  }

  /**
   * Determines if a JSONL line should be kept or removed
   * This is conservative - most filtering should happen in Stage 2
   */
  private shouldKeepLine(line: ConversationMessage, options: OptimizationOptions): boolean {
    if (!line.message) {
      return false; // Remove completely malformed lines
    }

    // Keep almost everything - Stage 3 focuses on content condensation, not line removal
    // Only remove obvious duplicates or completely empty messages
    if (line.type === 'user' && Array.isArray(line.message.content)) {
      // Check for empty tool results
      const hasEmptyToolResult = line.message.content.some((block: any) => 
        block.type === 'tool_result' && (!block.content || block.content === '')
      );
      if (hasEmptyToolResult && line.message.content.length === 1) {
        return false; // Remove empty tool results
      }
    }

    return true; // Keep by default - let Stage 2 handle filtering
  }

  /**
   * Condenses large file content to essential snippets
   */
  private async condenseContent(
    lines: ConversationMessage[],
    options: OptimizationOptions
  ): Promise<ConversationMessage[]> {
    if (!options.condenseLargeFiles) {
      return lines;
    }

    const condensedLines = [];
    
    for (const line of lines) {
      if (this.isLargeFileContent(line)) {
        const condensed = this.condenseLargeFileContent(line, options.maxFileSnippetLines || 10);
        condensedLines.push(condensed);
      } else {
        condensedLines.push(line);
      }
    }

    return condensedLines;
  }

  /**
   * Checks if a message contains large file content that should be condensed
   */
  private isLargeFileContent(line: ConversationMessage): boolean {
    if (line.type !== 'user' || !Array.isArray(line.message.content)) {
      return false;
    }

    return line.message.content.some((block: any) => {
      if (block.type === 'tool_result' && block.content) {
        const content = typeof block.content === 'string' ? block.content : JSON.stringify(block.content);
        const lineCount = content.split('\n').length;
        const charCount = content.length;
        // Consider condensing files with >30 lines OR >2000 characters
        return lineCount > 30 || charCount > 2000;
      }
      return false;
    });
  }

  /**
   * Condenses large file content intelligently while keeping it factual
   */
  private condenseLargeFileContent(line: ConversationMessage, maxLines: number): ConversationMessage {
    const condensedLine = JSON.parse(JSON.stringify(line)); // Deep copy
    
    if (Array.isArray(condensedLine.message.content)) {
      condensedLine.message.content = condensedLine.message.content.map((block: any) => {
        if (block.type === 'tool_result' && block.content) {
          const content = typeof block.content === 'string' ? block.content : JSON.stringify(block.content);
          const lines = content.split('\n');
          
          if (lines.length > maxLines || content.length > 2000) {
            // Smart condensation: keep important parts
            const importantLines: string[] = [];
            const seenContent = new Set<string>();
            
            // Always keep first few lines (headers, imports, etc.)
            for (let i = 0; i < Math.min(5, lines.length); i++) {
              if (lines[i].trim() && !seenContent.has(lines[i].trim())) {
                importantLines.push(lines[i]);
                seenContent.add(lines[i].trim());
              }
            }
            
            // Keep lines with key information (headers, important declarations)
            for (const line of lines) {
              if (importantLines.length >= maxLines) break;
              
              const trimmed = line.trim();
              if (trimmed && !seenContent.has(trimmed)) {
                // Keep lines that look important
                if (trimmed.startsWith('#') || // Headers
                    trimmed.startsWith('##') || 
                    trimmed.includes('class ') ||
                    trimmed.includes('function ') ||
                    trimmed.includes('export ') ||
                    trimmed.includes('import ') ||
                    trimmed.includes('const ') ||
                    trimmed.startsWith('- **') || // Key points
                    trimmed.includes('TODO') ||
                    trimmed.includes('FIXME') ||
                    (trimmed.length > 20 && trimmed.length < 100)) { // Substantial but not too long
                  
                  importantLines.push(line);
                  seenContent.add(trimmed);
                }
              }
            }
            
            // Add final lines if we have room
            if (importantLines.length < maxLines) {
              const remaining = maxLines - importantLines.length;
              const lastLines = lines.slice(-remaining);
              for (const line of lastLines) {
                if (!seenContent.has(line.trim()) && line.trim()) {
                  importantLines.push(line);
                }
              }
            }
            
            const condensedContent = importantLines.join('\n') + 
              `\n\n[... content condensed from ${lines.length} lines to ${importantLines.length} essential lines ...]`;
            
            return {
              ...block,
              content: condensedContent
            };
          }
        }
        return block;
      });
    }

    return condensedLine;
  }

  /**
   * Creates the optimized JSONL file with new session ID
   */
  private async createOptimizedJsonl(lines: ConversationMessage[]): Promise<string> {
    const newSessionId = randomUUID();
    
    // Update all line sessionIds
    const updatedLines = lines.map(line => ({
      ...line,
      sessionId: newSessionId
    }));

    // Write optimized JSONL file
    const filePath = getSessionFilePath(this.projectRoot, newSessionId);
    const jsonlContent = updatedLines.map(line => JSON.stringify(line)).join('\n') + '\n';
    
    // Create directory if needed
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(filePath, jsonlContent);
    
    return newSessionId;
  }

  /**
   * Uses Claude Code SDK to intelligently condense content
   */
  private async condenseContentWithClaude(
    lines: ConversationMessage[],
    options: OptimizationOptions
  ): Promise<ConversationMessage[]> {
    if (!options.condenseLargeFiles) {
      return lines;
    }

    try {
      const condensedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (this.isLargeFileContent(line)) {
          console.log(`🤖 Using Claude Code SDK to condense line ${i}...`);
          const condensed = await this.condenseLineWithClaude(line, options.maxFileSnippetLines || 15);
          condensedLines.push(condensed);
        } else {
          condensedLines.push(line);
        }
      }

      return condensedLines;

    } catch (error) {
      console.warn('⚠️ Error in Claude-based condensation:', error);
      console.log('📋 Falling back to rule-based condensation...');
      return this.condenseContent(lines, options);
    }
  }

  /**
   * Uses Claude Code SDK to intelligently condense content with custom prompt
   */
  private async condenseContentWithClaudeCustomPrompt(
    lines: ConversationMessage[],
    customPrompt: string,
    options: OptimizationOptions
  ): Promise<ConversationMessage[]> {
    if (!options.condenseLargeFiles) {
      return lines;
    }

    try {
      const condensedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (this.isLargeFileContent(line)) {
          console.log(`🤖 Using Claude Code SDK with custom prompt to condense line ${i}...`);
          const condensed = await this.condenseLineWithClaudeCustomPrompt(line, customPrompt, options.maxFileSnippetLines || 15);
          condensedLines.push(condensed);
        } else {
          condensedLines.push(line);
        }
      }

      return condensedLines;

    } catch (error) {
      console.warn('⚠️ Error in Claude-based condensation:', error);
      console.log('📋 Falling back to rule-based condensation...');
      return this.condenseContent(lines, options);
    }
  }

  /**
   * Uses Claude Code SDK to condense a single line's content
   */
  private async condenseLineWithClaude(
    line: ConversationMessage,
    maxLines: number
  ): Promise<ConversationMessage> {
    const prompt = `You are helping to condense large file content for context optimization.

# TASK: Stage 3 - Intelligent Content Condensation

Please analyze the file content and create a condensed version that preserves essential information while reducing size.

## CONDENSATION CRITERIA
- **Preserve**: Headers, imports, key functions, important declarations, error messages
- **Condense**: Repetitive content, long file listings, verbose output, redundant information
- **Maintain**: 100% factual accuracy - never change or hallucinate content
- **Target**: Approximately ${maxLines} lines of most important content

The goal is reducing/shrinking rather than elimination. Keep important details so the AI knows what has been reviewed.

Please respond with only the condensed content, maintaining the original structure and accuracy.`;

    return await this.condenseLineWithClaudePrompt(line, prompt, maxLines);
  }

  /**
   * Uses Claude Code SDK to condense a single line's content with custom prompt
   */
  private async condenseLineWithClaudeCustomPrompt(
    line: ConversationMessage,
    customPrompt: string,
    maxLines: number
  ): Promise<ConversationMessage> {
    const enhancedPrompt = `${customPrompt}

# ADDITIONAL CONTEXT FOR CONDENSATION

Target approximately ${maxLines} lines of most important content. Maintain 100% factual accuracy.

Please respond with only the condensed content, maintaining the original structure and accuracy.`;

    return await this.condenseLineWithClaudePrompt(line, enhancedPrompt, maxLines);
  }

  /**
   * Core method to condense a line using Claude Code SDK with a given prompt
   */
  private async condenseLineWithClaudePrompt(
    line: ConversationMessage,
    prompt: string,
    maxLines: number
  ): Promise<ConversationMessage> {
    try {
      const condensedLine = JSON.parse(JSON.stringify(line)); // Deep copy
      
      if (Array.isArray(condensedLine.message.content)) {
        for (let i = 0; i < condensedLine.message.content.length; i++) {
          const block = condensedLine.message.content[i];
          
          if (block.type === 'tool_result' && block.content) {
            const content = typeof block.content === 'string' ? block.content : JSON.stringify(block.content);
            const lines = content.split('\n');
            
            if (lines.length > maxLines || content.length > 2000) {
              const fullPrompt = `${prompt}

# CONTENT TO CONDENSE

\`\`\`
${content}
\`\`\``;

              const result = await this.claudeCodeService.runPrompt(fullPrompt, {
                cwd: this.projectRoot,
                maxTurns: 1
              });

              if (result.success) {
                const assistantMessage = result.messages?.find(msg => msg.type === 'assistant');
                let condensedContent = assistantMessage?.message?.content || content;
                
                // Handle different content formats
                if (typeof condensedContent !== 'string') {
                  if (Array.isArray(condensedContent)) {
                    condensedContent = condensedContent
                      .filter((block: any) => block.type === 'text')
                      .map((block: any) => block.text || block.content)
                      .join('\n');
                  } else {
                    condensedContent = JSON.stringify(condensedContent);
                  }
                }
                
                // Add condensation note
                const finalContent = condensedContent + 
                  `\n\n[... content condensed from ${lines.length} lines via Claude Code SDK ...]`;
                
                condensedLine.message.content[i] = {
                  ...block,
                  content: finalContent
                };
              }
            }
          }
        }
      }

      return condensedLine;

    } catch (error) {
      console.warn('⚠️ Error condensing line with Claude:', error);
      // Fall back to original line
      return line;
    }
  }

  /**
   * Extracts content from message for analysis
   */
  private extractMessageContent(message: ConversationMessage): string | null {
    if (!message.message) return null;
    
    if (typeof message.message.content === 'string') {
      return message.message.content;
    }
    
    if (Array.isArray(message.message.content)) {
      // Extract text content from array format
      const textParts = message.message.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text || block.content)
        .join('\n');
      
      return textParts || null;
    }
    
    return null;
  }

}

// Type definitions for conversation messages
export interface ConversationMessage {
  type: string;
  sessionId: string;
  message: {
    role: string;
    content: string | any[];
  };
  timestamp: string;
  uuid: string;
  [key: string]: any;
}