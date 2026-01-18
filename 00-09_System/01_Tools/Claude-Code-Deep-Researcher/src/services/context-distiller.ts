import { readFileSync, writeFileSync, mkdirSync, existsSync, createReadStream } from 'fs';
import { randomUUID } from 'crypto';
import { dirname } from 'path';
import { createInterface } from 'readline';
import type { SessionBuilder } from './session-builder.ts';
import type { AnalysisResult } from './project-analyzer.ts';
import { getSessionFilePath } from '../utils/path.ts';
import { ClaudeCodeService } from './claude-code.ts';
import { ConfigManager } from './config.ts';

export interface ContextTemplate {
  projectName: string;
  sessionId: string;
  originalSessionId: string;
  curatedSessionId: string;
  optimizedSessionId?: string;
  originalMessages: number;
  curatedMessages: number;
  optimizedMessages?: number;
  linesRemoved?: number;
  contentCondensed?: number;
  createdAt: Date;
  reductionRatio: number;
  optimizationRatio?: number;
  totalReduction?: number;
  cost: number;
  tokensUsed: {
    input: number;
    output: number;
  };
  keyFiles: string[];
  commonTasks: string[];
}

export interface DistillationOptions {
  maxMessages?: number;
  keepUserMessages?: boolean;
  keepToolResults?: boolean;
  prioritizeKeywords?: string[];
  // Stage 3: Content Optimization options
  enableOptimization?: boolean;
  maxTokensPerMessage?: number;
  preserveCodeExamples?: boolean;
  aggressiveCompression?: boolean;
}

interface ConversationMessage {
  parentUuid: string | null;
  isSidechain: boolean;
  userType: string;
  cwd: string;
  sessionId: string;
  version: string;
  gitBranch: string;
  type: string;
  message: any;
  uuid: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Service for cherry-picking essential messages from conversation threads
 * Stage 2 of the context pre-baking system - Conversation Curation
 */
export class ContextDistiller {
  private projectRoot: string;
  private claudeCodeService: ClaudeCodeService;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    const configManager = new ConfigManager();
    this.claudeCodeService = new ClaudeCodeService(configManager);
  }

  /**
   * Cherry-picks essential messages from the analysis conversation thread with custom prompt
   */
  async distillContextWithCustomPrompt(
    analysisResult: AnalysisResult,
    customPrompt: string,
    options: DistillationOptions = {}
  ): Promise<ContextTemplate> {
    console.log('🍒 Starting conversation cherry-picking with custom prompt...');

    // Enhance the custom prompt with project context
    const enhancedPrompt = this.enhanceCustomPromptForDistillation(customPrompt, analysisResult);

    // Default options
    const opts = {
      maxMessages: 20,
      keepUserMessages: true,
      keepToolResults: false,
      prioritizeKeywords: ['structure', 'purpose', 'organization', 'content', 'key', 'important', 'main', 'summary'],
      ...options
    };

    // Read the original conversation file
    const originalMessages = await this.readConversationFile(analysisResult.sessionId);
    console.log(`📖 Read ${originalMessages.length} messages from original conversation`);

    // Use custom prompt for cherry-picking (would typically involve Claude Code analysis)
    // For now, we'll use the same cherry-picking logic but with enhanced keywords from the custom prompt
    const customKeywords = this.extractKeywordsFromPrompt(customPrompt);
    const enhancedOpts = {
      ...opts,
      prioritizeKeywords: [...(opts.prioritizeKeywords || []), ...customKeywords]
    };

    // Use Claude Code SDK to intelligently select messages
    const curatedMessages = await this.cherryPickMessagesWithClaude(originalMessages, enhancedPrompt, enhancedOpts);
    console.log(`🎯 Selected ${curatedMessages.length} essential messages (${Math.round(curatedMessages.length / originalMessages.length * 100)}% reduction)`);

    // Create new conversation file with curated messages
    const curatedSessionId = await this.createCuratedConversation(curatedMessages);
    
    const projectName = analysisResult.structure ? this.extractProjectName(analysisResult.structure) : 'Project';
    
    const template: ContextTemplate = {
      projectName,
      sessionId: curatedSessionId,
      originalSessionId: analysisResult.sessionId,
      curatedSessionId,
      originalMessages: originalMessages.length,
      curatedMessages: curatedMessages.length,
      createdAt: new Date(),
      reductionRatio: Math.round((1 - curatedMessages.length / originalMessages.length) * 100),
      cost: analysisResult.analysis?.cost || 0,
      tokensUsed: {
        input: analysisResult.analysis?.tokenUsage?.input || 0,
        output: analysisResult.analysis?.tokenUsage?.output || 0
      },
      keyFiles: analysisResult.structure?.keyFiles?.map(f => f.relativePath) || [],
      commonTasks: ['Development', 'Testing', 'Building', 'Deployment'] // Default tasks
    };

    console.log(`✨ Curated conversation created: ${curatedSessionId}`);
    console.log(`📊 Reduced from ${originalMessages.length} to ${curatedMessages.length} messages (${template.reductionRatio}% reduction)`);

    return template;
  }

  /**
   * Cherry-picks essential messages from the analysis conversation thread
   */
  async distillContext(
    analysisResult: AnalysisResult, 
    options: DistillationOptions = {}
  ): Promise<ContextTemplate> {
    console.log('🍒 Starting conversation cherry-picking...');

    // Default options
    const opts = {
      maxMessages: 20,
      keepUserMessages: true,
      keepToolResults: false,
      prioritizeKeywords: ['structure', 'purpose', 'organization', 'content', 'key', 'important', 'main', 'summary'],
      ...options
    };

    // Read the original conversation file
    const originalMessages = await this.readConversationFile(analysisResult.sessionId);
    console.log(`📖 Read ${originalMessages.length} messages from original conversation`);

    // Use Claude Code SDK to intelligently select messages
    const defaultPrompt = this.createDefaultDistillationPrompt(analysisResult);
    const curatedMessages = await this.cherryPickMessagesWithClaude(originalMessages, defaultPrompt, opts);
    console.log(`🎯 Selected ${curatedMessages.length} essential messages (${Math.round(curatedMessages.length / originalMessages.length * 100)}% reduction)`);

    // Create new conversation file with curated messages
    const curatedSessionId = await this.createCuratedConversation(curatedMessages);
    
    const projectName = this.extractProjectName(analysisResult.structure);
    
    const template: ContextTemplate = {
      projectName,
      sessionId: curatedSessionId,
      originalSessionId: analysisResult.sessionId,
      curatedSessionId,
      originalMessages: originalMessages.length,
      curatedMessages: curatedMessages.length,
      createdAt: new Date(),
      reductionRatio: Math.round((1 - curatedMessages.length / originalMessages.length) * 100),
      cost: analysisResult.analysis?.cost || 0,
      tokensUsed: {
        input: analysisResult.analysis?.tokenUsage?.input || 0,
        output: analysisResult.analysis?.tokenUsage?.output || 0
      },
      keyFiles: analysisResult.structure?.keyFiles?.map(f => f.relativePath) || [],
      commonTasks: ['Development', 'Testing', 'Building', 'Deployment'] // Default tasks
    };

    console.log(`✨ Curated conversation created: ${curatedSessionId}`);
    console.log(`📊 Reduced from ${originalMessages.length} to ${curatedMessages.length} messages (${template.reductionRatio}% reduction)`);

    return template;
  }

  /**
   * Reads the conversation file from the projects directory using line-by-line streaming
   * Memory efficient approach that never loads the entire file into memory
   */
  private async readConversationFile(sessionId: string): Promise<ConversationMessage[]> {
    // Analysis sessions are created in the project root directory, not the current working directory
    const filePath = getSessionFilePath(this.projectRoot, sessionId);
    
    try {
      const messages: ConversationMessage[] = [];
      
      // Process file line by line using streaming
      for await (const entry of this.processLineByLine(filePath)) {
        messages.push(entry);
      }
      
      return messages;
    } catch (error) {
      throw new Error(`Failed to read conversation file ${filePath}: ${error}`);
    }
  }

  /**
   * Processes JSONL file one line at a time using streaming approach
   * Yields each parsed JSONL line individually without loading entire file
   */
  private async* processLineByLine(filepath: string): AsyncGenerator<ConversationMessage, void> {
    const stream = createReadStream(filepath);
    const rl = createInterface({ 
      input: stream,
      crlfDelay: Infinity // Handle different line endings (Windows/Unix)
    });
    
    let lineNumber = 0;
    let validLines = 0;
    let malformedLines = 0;
    
    try {
      for await (const line of rl) {
        lineNumber++;
        
        // Skip empty lines
        if (!line.trim()) {
          continue;
        }
        
        try {
          // Validate line is proper JSON before parsing
          if (!this.validateLineFormat(line)) {
            malformedLines++;
            console.error(`⚠️ Line ${lineNumber}: Invalid JSON format`);
            console.error(`   Content: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
            continue;
          }
          
          let entry = JSON.parse(line) as ConversationMessage;
          
          // Handle edge cases in JSONL processing
          entry = this.handleEdgeCases(entry, lineNumber);
          
          validLines++;
          yield entry;
        } catch (parseError) {
          // Handle malformed lines gracefully with error logging
          malformedLines++;
          const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error';
          console.error(`⚠️ Line ${lineNumber}: Malformed JSON - ${errorMessage}`);
          console.error(`   Content: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
          // Continue processing despite individual line failures
        }
      }
      
      // Report validation summary at completion
      this.reportValidationSummary(lineNumber, validLines, malformedLines);
      
    } finally {
      // Ensure stream is properly closed
      stream.destroy();
    }
  }

  /**
   * Validates that a line is proper JSON format before parsing
   */
  private validateLineFormat(line: string): boolean {
    const trimmed = line.trim();
    
    // Basic JSON object validation - should start with { and end with }
    if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
      return false;
    }
    
    // Check for obviously malformed JSON patterns
    if (trimmed.includes('}{') || trimmed.match(/[{}]/g)?.length % 2 !== 0) {
      return false;
    }
    
    return true;
  }

  /**
   * Reports validation summary at completion
   */
  private reportValidationSummary(totalLines: number, validLines: number, malformedLines: number): void {
    if (malformedLines === 0) {
      console.log(`✅ JSONL validation: ${validLines} valid lines processed successfully`);
    } else {
      console.log(`📊 JSONL validation summary:`);
      console.log(`   - Total lines processed: ${totalLines}`);
      console.log(`   - Valid lines: ${validLines}`);
      console.log(`   - Malformed lines: ${malformedLines}`);
      console.log(`   - Success rate: ${Math.round((validLines / (validLines + malformedLines)) * 100)}%`);
    }
  }

  /**
   * Cherry-picks the most important messages from the conversation
   * Focus on removing redundant tool confirmations and keeping essential content
   */
  private cherryPickMessages(
    messages: ConversationMessage[], 
    options: DistillationOptions
  ): ConversationMessage[] {
    console.log('🔍 Analyzing message importance...');
    
    const filteredMessages: ConversationMessage[] = [];
    
    for (const message of messages) {
      // Always keep user messages that aren't just tool confirmations
      if (message.type === 'user') {
        if (this.isToolConfirmationMessage(message)) {
          // Skip tool confirmation messages like "Todos have been modified successfully"
          continue;
        }
        filteredMessages.push(message);
      }
      // Always keep assistant messages that have substantive content
      else if (message.type === 'assistant') {
        if (this.hasSubstantiveContent(message)) {
          filteredMessages.push(message);
        }
      }
      // Always keep system messages
      else if (message.type === 'system') {
        filteredMessages.push(message);
      }
    }

    console.log(`🎯 Filtered ${messages.length} → ${filteredMessages.length} messages`);
    return filteredMessages;
  }

  /**
   * Determines if a user message is just a tool confirmation
   */
  private isToolConfirmationMessage(message: ConversationMessage): boolean {
    if (message.type !== 'user') return false;
    
    // Check if it's a tool result with confirmation text
    if (Array.isArray(message.message.content)) {
      const hasToolResult = message.message.content.some((block: any) => {
        if (block.type === 'tool_result') {
          const content = block.content || '';
          // Look for confirmation patterns
          return typeof content === 'string' && (
            content.includes('modified successfully') ||
            content.includes('proceed with') ||
            content.includes('continue to use') ||
            content.length < 200 // Short confirmations
          );
        }
        return false;
      });
      return hasToolResult;
    }
    
    return false;
  }

  /**
   * Determines if an assistant message has substantive content worth keeping
   */
  private hasSubstantiveContent(message: ConversationMessage): boolean {
    if (message.type !== 'assistant') return false;
    
    // Always keep messages with text content
    if (Array.isArray(message.message.content)) {
      const hasText = message.message.content.some((block: any) => 
        block.type === 'text' && block.text && block.text.length > 10
      );
      if (hasText) return true;
      
      // Keep tool use messages for important tools
      const hasImportantTool = message.message.content.some((block: any) => 
        block.type === 'tool_use' && 
        ['Read', 'Glob', 'Grep', 'Write', 'Edit', 'WebSearch'].includes(block.name)
      );
      if (hasImportantTool) return true;
    }
    
    // Keep if it has direct text content
    if (typeof message.message.content === 'string' && message.message.content.length > 10) {
      return true;
    }
    
    return false;
  }

  /**
   * Scores a message based on its importance for project context
   */
  private scoreMessageImportance(
    message: ConversationMessage, 
    options: DistillationOptions
  ): number {
    let score = 0;

    // Base scores by message type
    if (message.type === 'system') score += 10;
    if (message.type === 'user' && options.keepUserMessages) score += 8;
    if (message.type === 'assistant') score += 5;
    if (message.type === 'user' && !options.keepToolResults) score += 3;

    // Content analysis for assistant messages
    if (message.type === 'assistant' && message.message.content) {
      const content = this.extractTextFromContent(message.message.content);
      
      // Prioritize messages containing key information
      const keywordScore = this.calculateKeywordScore(content, options.prioritizeKeywords || []);
      score += keywordScore;

      // Boost longer, more detailed responses
      if (content.length > 500) score += 3;
      if (content.length > 1000) score += 2;
      
      // Penalize very short responses
      if (content.length < 50) score -= 2;
    }

    // Tool results scoring
    if (message.type === 'user' && message.message.content && Array.isArray(message.message.content)) {
      const hasToolResult = message.message.content.some((block: any) => block.type === 'tool_result');
      if (hasToolResult && !options.keepToolResults) {
        return 0; // Completely exclude tool results if not wanted
      }
    }

    return Math.max(0, score);
  }

  /**
   * Extracts text content from various message content formats
   */
  private extractTextFromContent(content: any): string {
    if (typeof content === 'string') {
      return content;
    }
    
    if (Array.isArray(content)) {
      return content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join(' ');
    }
    
    return '';
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
      
      // Also extract tool result content for summary
      const toolResults = message.message.content
        .filter((block: any) => block.type === 'tool_result')
        .map((block: any) => `[Tool: ${block.tool_use_id || 'unknown'}]`)
        .join(' ');
      
      return [textParts, toolResults].filter(Boolean).join(' ') || null;
    }
    
    return null;
  }

  /**
   * Calculates keyword relevance score for content
   */
  private calculateKeywordScore(content: string, keywords: string[]): number {
    const lowerContent = content.toLowerCase();
    let score = 0;
    
    for (const keyword of keywords) {
      const regex = new RegExp(keyword.toLowerCase(), 'gi');
      const matches = lowerContent.match(regex);
      if (matches) {
        score += matches.length * 2; // 2 points per keyword match
      }
    }
    
    return Math.min(score, 15); // Cap keyword bonus at 15 points
  }

  /**
   * Creates a new conversation file with curated messages
   */
  private async createCuratedConversation(messages: ConversationMessage[]): Promise<string> {
    const newSessionId = randomUUID();
    
    // Update all message sessionIds to the new session ID
    const updatedMessages = messages.map(message => ({
      ...message,
      sessionId: newSessionId
    }));

    // Write to new conversation file
    const filePath = getSessionFilePath(this.projectRoot, newSessionId);
    const jsonlContent = updatedMessages.map(msg => JSON.stringify(msg)).join('\n') + '\n';
    
    // Create directory if it doesn't exist
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(filePath, jsonlContent);
    
    return newSessionId;
  }

  /**
   * Enhances a custom prompt with project analysis context for distillation
   */
  private enhanceCustomPromptForDistillation(customPrompt: string, analysisResult: AnalysisResult): string {
    const projectName = analysisResult.structure ? this.extractProjectName(analysisResult.structure) : 'Project';
    const fileTypeStats = analysisResult.structure?.fileTypes 
      ? Object.entries(analysisResult.structure.fileTypes)
          .sort(([,a], [,b]) => b - a)
          .map(([ext, count]) => `${ext}: ${count} files`)
          .join(', ')
      : 'Unknown';

    return `${customPrompt}

# CONVERSATION DISTILLATION CONTEXT

This is Stage 2 of context prebaking for the "${projectName}" project.

## Project Overview
- **Files**: ${analysisResult.structure?.totalFiles || 'Unknown'} (${analysisResult.structure ? Math.round(analysisResult.structure.totalSize / 1024) : 0}KB)
- **File Types**: ${fileTypeStats}
- **Key Files**: ${analysisResult.structure?.keyFiles?.map(f => f.relativePath).join(', ') || 'Unknown'}

## Original Analysis Summary
${analysisResult.summary || 'No summary available'}

Please use this project context to guide the conversation distillation process based on the above custom requirements.`;
  }

  /**
   * Extracts keywords from a custom prompt to enhance message prioritization
   */
  private extractKeywordsFromPrompt(prompt: string): string[] {
    // Extract important words from the prompt (simple approach)
    const keywords = prompt
      .toLowerCase()
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && // Skip short words
        !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'would', 'make', 'like', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'new', 'years', 'way', 'may', 'say'].includes(word)
      )
      .slice(0, 10); // Limit to 10 keywords

    return keywords;
  }

  /**
   * Creates a default distillation prompt when no custom prompt is provided
   */
  private createDefaultDistillationPrompt(analysisResult: AnalysisResult): string {
    const projectName = this.extractProjectName(analysisResult.structure);
    
    return `You are helping to curate a conversation for context pre-baking. 

# TASK: Stage 2 - Intelligent Message Filtering

Please analyze the conversation messages and determine which ones should be removed for context optimization while preserving essential information.

## PROJECT CONTEXT
- **Project**: ${projectName}
- **Files**: ${analysisResult.structure?.totalFiles || 'Unknown'} files
- **Key Files**: ${analysisResult.structure?.keyFiles?.map(f => f.relativePath).join(', ') || 'Unknown'}

## FILTERING CRITERIA
- **Remove**: Tool confirmation messages, empty responses, redundant confirmations
- **Keep**: Substantive content, analysis results, important decisions, code implementations
- **Preserve**: Context needed for AI to understand what has been reviewed

The goal is reducing/shrinking rather than elimination. Keep important details so the AI knows what has been reviewed and can work confidently.

Please provide a list of message indices (0-based) that should be KEPT in the final conversation.`;
  }

  /**
   * Uses Claude Code SDK to intelligently filter messages with line-by-line evaluation
   */
  private async cherryPickMessagesWithClaude(
    messages: ConversationMessage[],
    prompt: string,
    options: DistillationOptions
  ): Promise<ConversationMessage[]> {
    try {
      console.log('🤖 Using Claude Code SDK for line-by-line message evaluation...');
      
      const filteredMessages: ConversationMessage[] = [];
      const uuidRelationships = this.trackUuidRelationships(messages);
      
      // Process messages individually for line-by-line evaluation
      for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        
        // Evaluate each message line individually
        const shouldKeep = await this.evaluateLineWithClaude(message, index, prompt, options);
        
        if (shouldKeep) {
          filteredMessages.push(message);
        } else {
          // Check if removing this message would break UUID chain integrity
          const chainIntegrity = this.validateUuidChainIntegrity(message, uuidRelationships, filteredMessages);
          if (!chainIntegrity.isValid) {
            console.log(`🔗 Preserving message ${index} to maintain UUID chain integrity: ${chainIntegrity.reason}`);
            filteredMessages.push(message);
          }
        }
        
        // Log progress for long evaluations
        if (index % 10 === 0 && index > 0) {
          console.log(`📊 Evaluated ${index}/${messages.length} messages (${filteredMessages.length} kept)`);
        }
      }
      
      console.log(`🎯 Line-by-line evaluation completed: ${filteredMessages.length}/${messages.length} messages kept`);
      return filteredMessages;
      
    } catch (error) {
      console.warn('⚠️ Error in line-by-line Claude evaluation:', error);
      console.log('📋 Falling back to rule-based filtering...');
      return this.cherryPickMessages(messages, options);
    }
  }

  /**
   * Evaluates a single JSONL line with Claude Code to determine if it should be kept
   */
  private async evaluateLineWithClaude(
    message: ConversationMessage,
    lineIndex: number,
    basePrompt: string,
    options: DistillationOptions
  ): Promise<boolean> {
    try {
      const content = this.extractMessageContent(message);
      const preview = content ? content.substring(0, 300) : '[No content]';
      
      const evaluationPrompt = `${basePrompt}

# SINGLE LINE EVALUATION

Evaluate this specific conversation line and determine if it should be KEPT or REMOVED for context optimization.

**Line ${lineIndex}**: [${message.type}] 
**UUID**: ${message.uuid}
**Timestamp**: ${message.timestamp}
**Content Preview**: ${preview}

## CRITERIA
- **KEEP**: Essential information, important decisions, code implementations, substantive analysis
- **REMOVE**: Tool confirmations, redundant responses, empty messages, verbose logs

## CONTEXT PRESERVATION
- Maintain conversation flow and UUID relationships  
- Preserve information needed for AI to understand what has been reviewed
- Keep messages that provide essential project context

**Respond with exactly "KEEP" or "REMOVE" - no other text.**`;

      const result = await this.claudeCodeService.runPrompt(evaluationPrompt, {
        cwd: this.projectRoot,
        maxTurns: 1
      });

      if (!result.success) {
        // Fallback to rule-based evaluation for this line
        return this.evaluateLineWithRules(message, options);
      }

      // Extract the response
      const assistantMessage = result.messages?.find(msg => msg.type === 'assistant');
      let response = assistantMessage?.message?.content || '';
      
      // Handle different content formats
      if (typeof response !== 'string') {
        if (Array.isArray(response)) {
          response = response
            .filter((block: any) => block.type === 'text')
            .map((block: any) => block.text || block.content)
            .join(' ');
        } else {
          response = JSON.stringify(response);
        }
      }
      
      // Parse Claude's decision
      const decision = response.trim().toUpperCase();
      if (decision.includes('KEEP')) {
        return true;
      } else if (decision.includes('REMOVE')) {
        return false;
      } else {
        // If unclear response, fallback to rule-based evaluation
        console.warn(`⚠️ Unclear Claude response for line ${lineIndex}: "${response}". Using rule-based fallback.`);
        return this.evaluateLineWithRules(message, options);
      }
      
    } catch (error) {
      // Fallback to rule-based evaluation for individual line failures
      console.warn(`⚠️ Claude evaluation failed for line ${lineIndex}, using rule-based fallback:`, error);
      return this.evaluateLineWithRules(message, options);
    }
  }

  /**
   * Fallback rule-based evaluation for individual messages
   */
  private evaluateLineWithRules(message: ConversationMessage, options: DistillationOptions): boolean {
    // Use existing logic from cherryPickMessages for individual message evaluation
    
    // Always keep user messages that aren't just tool confirmations
    if (message.type === 'user') {
      return !this.isToolConfirmationMessage(message);
    }
    
    // Always keep assistant messages that have substantive content
    if (message.type === 'assistant') {
      return this.hasSubstantiveContent(message);
    }
    
    // Always keep system messages
    if (message.type === 'system') {
      return true;
    }
    
    // Default to keeping unknown message types
    return true;
  }

  /**
   * Tracks UUID relationships between messages for conversation continuity
   */
  private trackUuidRelationships(messages: ConversationMessage[]): Map<string, { children: string[], parent: string | null }> {
    const relationships = new Map<string, { children: string[], parent: string | null }>();
    
    // Build relationship map
    messages.forEach(message => {
      if (!relationships.has(message.uuid)) {
        relationships.set(message.uuid, { children: [], parent: message.parentUuid });
      }
      
      // Track children for parent messages
      if (message.parentUuid && relationships.has(message.parentUuid)) {
        relationships.get(message.parentUuid)!.children.push(message.uuid);
      } else if (message.parentUuid) {
        relationships.set(message.parentUuid, { children: [message.uuid], parent: null });
      }
    });
    
    return relationships;
  }

  /**
   * Handles edge cases in JSONL processing
   */
  private handleEdgeCases(message: ConversationMessage, lineIndex: number): ConversationMessage {
    // Handle incomplete tool results that span multiple lines
    if (this.isIncompleteToolResult(message)) {
      console.warn(`⚠️ Line ${lineIndex}: Detected incomplete tool result, attempting to repair`);
      return this.repairIncompleteToolResult(message);
    }
    
    // Handle broken UUID references from previous processing
    if (this.hasBrokenUuidReferences(message)) {
      console.warn(`⚠️ Line ${lineIndex}: Detected broken UUID reference, attempting to repair`);
      return this.repairBrokenUuidReferences(message);
    }
    
    // Handle tool_use entries without matching tool_result
    if (this.isOrphanedToolUse(message)) {
      console.warn(`⚠️ Line ${lineIndex}: Detected orphaned tool_use, preserving for context`);
      // Orphaned tool uses are preserved as they may be important for understanding what was attempted
    }
    
    // Preserve system messages and conversation boundaries
    if (this.isSystemBoundary(message)) {
      console.log(`🏗️ Line ${lineIndex}: System boundary message preserved`);
    }
    
    return message;
  }

  /**
   * Detects incomplete tool results that span multiple lines
   */
  private isIncompleteToolResult(message: ConversationMessage): boolean {
    if (message.type !== 'user' || !Array.isArray(message.message?.content)) {
      return false;
    }
    
    return message.message.content.some((block: any) => {
      if (block.type === 'tool_result') {
        const content = block.content;
        if (typeof content === 'string') {
          // Check for truncated JSON or incomplete content patterns
          return content.includes('...') || 
                 content.includes('[truncated]') ||
                 (content.includes('{') && !content.includes('}')) ||
                 content.endsWith('...');
        }
      }
      return false;
    });
  }

  /**
   * Attempts to repair incomplete tool results
   */
  private repairIncompleteToolResult(message: ConversationMessage): ConversationMessage {
    if (!Array.isArray(message.message?.content)) {
      return message;
    }
    
    const repairedContent = message.message.content.map((block: any) => {
      if (block.type === 'tool_result' && typeof block.content === 'string') {
        // Add marker for incomplete results
        if (this.isIncompleteToolResult(message)) {
          return {
            ...block,
            content: `${block.content}\n[NOTE: This tool result may be incomplete]`,
            is_incomplete: true
          };
        }
      }
      return block;
    });
    
    return {
      ...message,
      message: {
        ...message.message,
        content: repairedContent
      }
    };
  }

  /**
   * Detects broken UUID references from previous processing
   */
  private hasBrokenUuidReferences(message: ConversationMessage): boolean {
    // Check for malformed UUIDs or references to non-existent messages
    if (message.parentUuid && !this.isValidUuid(message.parentUuid)) {
      return true;
    }
    
    if (!this.isValidUuid(message.uuid)) {
      return true;
    }
    
    return false;
  }

  /**
   * Validates UUID format
   */
  private isValidUuid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Attempts to repair broken UUID references
   */
  private repairBrokenUuidReferences(message: ConversationMessage): ConversationMessage {
    const repairedMessage = { ...message };
    
    // Generate new UUID if current one is invalid
    if (!this.isValidUuid(message.uuid)) {
      repairedMessage.uuid = randomUUID();
      console.log(`🔧 Generated new UUID: ${repairedMessage.uuid}`);
    }
    
    // Clear invalid parent UUID references
    if (message.parentUuid && !this.isValidUuid(message.parentUuid)) {
      repairedMessage.parentUuid = null;
      console.log(`🔧 Cleared invalid parentUuid for message ${repairedMessage.uuid}`);
    }
    
    return repairedMessage;
  }

  /**
   * Detects tool_use entries without matching tool_result
   */
  private isOrphanedToolUse(message: ConversationMessage): boolean {
    if (message.type !== 'assistant' || !Array.isArray(message.message?.content)) {
      return false;
    }
    
    return message.message.content.some((block: any) => 
      block.type === 'tool_use' && !block.tool_result_id
    );
  }

  /**
   * Detects system messages and conversation boundaries
   */
  private isSystemBoundary(message: ConversationMessage): boolean {
    if (message.type === 'system') {
      return true;
    }
    
    // Check for conversation boundary markers
    if (message.type === 'result' || 
        (message.message?.content && 
         typeof message.message.content === 'string' && 
         message.message.content.includes('session_boundary'))) {
      return true;
    }
    
    return false;
  }

  /**
   * Validates that removing a message won't break UUID chain integrity
   */
  private validateUuidChainIntegrity(
    message: ConversationMessage, 
    relationships: Map<string, { children: string[], parent: string | null }>,
    keptMessages: ConversationMessage[]
  ): { isValid: boolean; reason?: string } {
    const messageRelation = relationships.get(message.uuid);
    if (!messageRelation) {
      return { isValid: true }; // No relationships to break
    }
    
    // Check if this message has children that are being kept
    const hasKeptChildren = messageRelation.children.some(childUuid => 
      keptMessages.some(kept => kept.uuid === childUuid)
    );
    
    if (hasKeptChildren) {
      return { 
        isValid: false, 
        reason: 'Message has children that are being kept - preserving parent-child relationship' 
      };
    }
    
    // Check if removing this message would create orphans
    if (message.parentUuid) {
      const hasKeptParent = keptMessages.some(kept => kept.uuid === message.parentUuid);
      const hasKeptSiblings = relationships.get(message.parentUuid)?.children.some(siblingUuid => 
        siblingUuid !== message.uuid && keptMessages.some(kept => kept.uuid === siblingUuid)
      );
      
      if (hasKeptParent && !hasKeptSiblings && messageRelation.children.length === 0) {
        return { 
          isValid: false, 
          reason: 'Removing would isolate parent message - preserving conversation flow' 
        };
      }
    }
    
    return { isValid: true };
  }

  /**
   * Extracts project name from structure
   */
  private extractProjectName(structure: any): string {
    // Try to get from package.json
    const packageJson = structure.keyFiles?.find((f: any) => f.relativePath === 'package.json');
    if (packageJson?.content) {
      try {
        const parsed = JSON.parse(packageJson.content);
        if (parsed.name) return parsed.name;
      } catch (error) {
        // Ignore JSON parse errors
      }
    }

    // Fall back to directory name
    const parts = this.projectRoot.split('/');
    return parts[parts.length - 1] || 'Project';
  }
}