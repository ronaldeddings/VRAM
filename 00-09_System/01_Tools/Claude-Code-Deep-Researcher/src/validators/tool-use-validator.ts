/**
 * Tool Use Validator for Claude Code conversation entries.
 * Validates tool usage patterns, tool-result relationships, and tool input/output consistency.
 */

import type { 
  ConversationEntry,
  ToolValidationResult,
  AssistantMessageEntry,
  UserMessageEntry,
  ToolUseContent,
  ToolResultContent
} from '../types/claude-conversation.ts';

export class ToolUseValidator {
  
  // Known Claude Code tools based on analysis
  private readonly knownTools = new Set([
    'TodoWrite', 'Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 
    'Grep', 'Glob', 'WebSearch', 'WebFetch', 'Task', 'Notebook',
    'NotebookEdit', 'ExitPlanMode'
  ]);
  
  /**
   * Validate tool usage patterns and tool-result relationships.
   * 
   * @param entries - Array of conversation entries to validate
   * @returns Tool usage validation result
   */
  validateToolUsage(entries: ConversationEntry[]): ToolValidationResult {
    const invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }> = [];
    const missingToolResults: Array<{ toolUseId: string; toolName: string }> = [];
    
    // Maps to track tool use -> result relationships
    const toolUseMap = new Map<string, { toolName: string; entryUuid: string; input: any }>();
    const toolResultMap = new Map<string, { entryUuid: string; content: any; isError?: boolean }>();
    
    // First pass: collect all tool uses and results
    for (const entry of entries) {
      if (entry.type === 'assistant') {
        this.extractToolUses(entry, toolUseMap, invalidToolUses);
      } else if (entry.type === 'user') {
        this.extractToolResults(entry, toolResultMap, invalidToolUses);
      }
    }
    
    // Second pass: validate tool use -> result relationships
    for (const [toolUseId, toolUse] of toolUseMap.entries()) {
      const result = toolResultMap.get(toolUseId);
      if (!result) {
        missingToolResults.push({
          toolUseId,
          toolName: toolUse.toolName
        });
      } else {
        // Validate tool-specific input/output consistency
        this.validateToolConsistency(toolUse, result, invalidToolUses);
      }
    }
    
    // Check for orphaned tool results
    for (const [toolUseId, result] of toolResultMap.entries()) {
      if (!toolUseMap.has(toolUseId)) {
        invalidToolUses.push({
          entryUuid: result.entryUuid,
          toolName: 'unknown',
          issue: `Orphaned tool result with no corresponding tool use: ${toolUseId}`
        });
      }
    }
    
    return {
      isValid: invalidToolUses.length === 0 && missingToolResults.length === 0,
      invalidToolUses,
      missingToolResults
    };
  }
  
  /**
   * Extract tool uses from assistant message.
   */
  private extractToolUses(
    entry: AssistantMessageEntry, 
    toolUseMap: Map<string, { toolName: string; entryUuid: string; input: any }>,
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    if (!Array.isArray(entry.message.content)) {
      return;
    }
    
    for (const content of entry.message.content) {
      if (content.type === 'tool_use') {
        const toolUse = content as ToolUseContent;
        
        // Validate tool use structure
        const issues = this.validateToolUseStructure(toolUse);
        if (issues.length > 0) {
          for (const issue of issues) {
            invalidToolUses.push({
              entryUuid: entry.uuid,
              toolName: toolUse.name || 'unknown',
              issue
            });
          }
        } else {
          // Store valid tool use
          toolUseMap.set(toolUse.id, {
            toolName: toolUse.name,
            entryUuid: entry.uuid,
            input: toolUse.input
          });
          
          // Validate against known tools
          if (!this.knownTools.has(toolUse.name)) {
            invalidToolUses.push({
              entryUuid: entry.uuid,
              toolName: toolUse.name,
              issue: `Unknown tool: ${toolUse.name}`
            });
          }
        }
      }
    }
  }
  
  /**
   * Extract tool results from user message.
   */
  private extractToolResults(
    entry: UserMessageEntry,
    toolResultMap: Map<string, { entryUuid: string; content: any; isError?: boolean }>,
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Handle both string and array content
    const contentArray = Array.isArray(entry.message.content) 
      ? entry.message.content 
      : [{ type: 'text', text: entry.message.content }];
    
    for (const content of contentArray) {
      if (content.type === 'tool_result') {
        const toolResult = content as ToolResultContent;
        
        // Validate tool result structure
        const issues = this.validateToolResultStructure(toolResult);
        if (issues.length > 0) {
          for (const issue of issues) {
            invalidToolUses.push({
              entryUuid: entry.uuid,
              toolName: 'unknown',
              issue
            });
          }
        } else {
          // Store valid tool result
          toolResultMap.set(toolResult.tool_use_id, {
            entryUuid: entry.uuid,
            content: toolResult.content,
            isError: toolResult.is_error
          });
        }
      }
    }
  }
  
  /**
   * Validate tool use content structure.
   */
  private validateToolUseStructure(toolUse: ToolUseContent): string[] {
    const issues: string[] = [];
    
    if (!toolUse.id || typeof toolUse.id !== 'string') {
      issues.push('Tool use missing or invalid id field');
    }
    
    if (!toolUse.name || typeof toolUse.name !== 'string') {
      issues.push('Tool use missing or invalid name field');
    }
    
    if (toolUse.input === undefined || typeof toolUse.input !== 'object') {
      issues.push('Tool use missing or invalid input field');
    }
    
    return issues;
  }
  
  /**
   * Validate tool result content structure.
   */
  private validateToolResultStructure(toolResult: ToolResultContent): string[] {
    const issues: string[] = [];
    
    if (!toolResult.tool_use_id || typeof toolResult.tool_use_id !== 'string') {
      issues.push('Tool result missing or invalid tool_use_id field');
    }
    
    if (toolResult.content === undefined) {
      issues.push('Tool result missing content field');
    }
    
    if (toolResult.is_error !== undefined && typeof toolResult.is_error !== 'boolean') {
      issues.push('Tool result is_error field must be boolean');
    }
    
    return issues;
  }
  
  /**
   * Validate tool-specific input/output consistency.
   */
  private validateToolConsistency(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    switch (toolUse.toolName) {
      case 'Read':
        this.validateReadTool(toolUse, result, invalidToolUses);
        break;
      case 'Write':
        this.validateWriteTool(toolUse, result, invalidToolUses);
        break;
      case 'Edit':
        this.validateEditTool(toolUse, result, invalidToolUses);
        break;
      case 'Bash':
        this.validateBashTool(toolUse, result, invalidToolUses);
        break;
      case 'TodoWrite':
        this.validateTodoWriteTool(toolUse, result, invalidToolUses);
        break;
      case 'Grep':
        this.validateGrepTool(toolUse, result, invalidToolUses);
        break;
      case 'Glob':
        this.validateGlobTool(toolUse, result, invalidToolUses);
        break;
      // Add more tool-specific validations as needed
    }
  }
  
  /**
   * Validate Read tool usage.
   */
  private validateReadTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    if (!toolUse.input.file_path || typeof toolUse.input.file_path !== 'string') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Read',
        issue: 'Read tool missing file_path parameter'
      });
    }
    
    if (toolUse.input.limit !== undefined && typeof toolUse.input.limit !== 'number') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Read',
        issue: 'Read tool limit parameter must be number'
      });
    }
    
    if (toolUse.input.offset !== undefined && typeof toolUse.input.offset !== 'number') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Read',
        issue: 'Read tool offset parameter must be number'
      });
    }
    
    // Validate result format
    if (!result.isError) {
      if (typeof result.content !== 'string') {
        invalidToolUses.push({
          entryUuid: result.entryUuid,
          toolName: 'Read',
          issue: 'Read tool result should be string content'
        });
      }
    }
  }
  
  /**
   * Validate Write tool usage.
   */
  private validateWriteTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    if (!toolUse.input.file_path || typeof toolUse.input.file_path !== 'string') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Write',
        issue: 'Write tool missing file_path parameter'
      });
    }
    
    if (!toolUse.input.content || typeof toolUse.input.content !== 'string') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Write',
        issue: 'Write tool missing content parameter'
      });
    }
  }
  
  /**
   * Validate Edit tool usage.
   */
  private validateEditTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    const requiredFields = ['file_path', 'old_string', 'new_string'];
    for (const field of requiredFields) {
      if (!toolUse.input[field] || typeof toolUse.input[field] !== 'string') {
        invalidToolUses.push({
          entryUuid: toolUse.entryUuid,
          toolName: 'Edit',
          issue: `Edit tool missing ${field} parameter`
        });
      }
    }
    
    if (toolUse.input.replace_all !== undefined && typeof toolUse.input.replace_all !== 'boolean') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Edit',
        issue: 'Edit tool replace_all parameter must be boolean'
      });
    }
  }
  
  /**
   * Validate Bash tool usage.
   */
  private validateBashTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    if (!toolUse.input.command || typeof toolUse.input.command !== 'string') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Bash',
        issue: 'Bash tool missing command parameter'
      });
    }
    
    if (toolUse.input.timeout !== undefined && typeof toolUse.input.timeout !== 'number') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Bash',
        issue: 'Bash tool timeout parameter must be number'
      });
    }
    
    if (toolUse.input.run_in_background !== undefined && typeof toolUse.input.run_in_background !== 'boolean') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Bash',
        issue: 'Bash tool run_in_background parameter must be boolean'
      });
    }
  }
  
  /**
   * Validate TodoWrite tool usage.
   */
  private validateTodoWriteTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    if (!Array.isArray(toolUse.input.todos)) {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'TodoWrite',
        issue: 'TodoWrite tool missing todos array parameter'
      });
      return;
    }
    
    // Validate each todo item
    for (const [index, todo] of toolUse.input.todos.entries()) {
      if (typeof todo !== 'object' || todo === null) {
        invalidToolUses.push({
          entryUuid: toolUse.entryUuid,
          toolName: 'TodoWrite',
          issue: `TodoWrite todo item ${index} must be object`
        });
        continue;
      }
      
      if (!todo.content || typeof todo.content !== 'string') {
        invalidToolUses.push({
          entryUuid: toolUse.entryUuid,
          toolName: 'TodoWrite',
          issue: `TodoWrite todo item ${index} missing content`
        });
      }
      
      if (!todo.status || !['pending', 'in_progress', 'completed'].includes(todo.status)) {
        invalidToolUses.push({
          entryUuid: toolUse.entryUuid,
          toolName: 'TodoWrite',
          issue: `TodoWrite todo item ${index} invalid status: ${todo.status}`
        });
      }
      
      if (!todo.activeForm || typeof todo.activeForm !== 'string') {
        invalidToolUses.push({
          entryUuid: toolUse.entryUuid,
          toolName: 'TodoWrite',
          issue: `TodoWrite todo item ${index} missing activeForm`
        });
      }
    }
  }
  
  /**
   * Validate Grep tool usage.
   */
  private validateGrepTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    if (!toolUse.input.pattern || typeof toolUse.input.pattern !== 'string') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Grep',
        issue: 'Grep tool missing pattern parameter'
      });
    }
    
    if (toolUse.input.output_mode && !['content', 'files_with_matches', 'count'].includes(toolUse.input.output_mode)) {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Grep',
        issue: `Grep tool invalid output_mode: ${toolUse.input.output_mode}`
      });
    }
  }
  
  /**
   * Validate Glob tool usage.
   */
  private validateGlobTool(
    toolUse: { toolName: string; entryUuid: string; input: any },
    result: { entryUuid: string; content: any; isError?: boolean },
    invalidToolUses: Array<{ entryUuid: string; toolName: string; issue: string }>
  ): void {
    // Validate input
    if (!toolUse.input.pattern || typeof toolUse.input.pattern !== 'string') {
      invalidToolUses.push({
        entryUuid: toolUse.entryUuid,
        toolName: 'Glob',
        issue: 'Glob tool missing pattern parameter'
      });
    }
  }
  
  /**
   * Analyze tool usage patterns across conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Tool usage analysis
   */
  analyzeToolUsagePatterns(entries: ConversationEntry[]): {
    toolFrequency: Map<string, number>;
    toolSuccessRate: Map<string, { total: number; successful: number; rate: number }>;
    averageToolsPerMessage: number;
    mostUsedTool: string | null;
    toolSequences: Array<{ sequence: string[]; frequency: number }>;
  } {
    const toolFrequency = new Map<string, number>();
    const toolResults = new Map<string, { total: number; successful: number }>();
    const toolSequences: string[][] = [];
    let totalToolUses = 0;
    let totalMessages = 0;
    
    // Collect tool usage data
    for (const entry of entries) {
      if (entry.type === 'assistant') {
        totalMessages++;
        const messageTools: string[] = [];
        
        if (Array.isArray(entry.message.content)) {
          for (const content of entry.message.content) {
            if (content.type === 'tool_use') {
              const toolName = content.name;
              toolFrequency.set(toolName, (toolFrequency.get(toolName) || 0) + 1);
              messageTools.push(toolName);
              totalToolUses++;
              
              if (!toolResults.has(toolName)) {
                toolResults.set(toolName, { total: 0, successful: 0 });
              }
              toolResults.get(toolName)!.total++;
            }
          }
        }
        
        if (messageTools.length > 0) {
          toolSequences.push(messageTools);
        }
      } else if (entry.type === 'user') {
        // Count successful tool results
        const contentArray = Array.isArray(entry.message.content) 
          ? entry.message.content 
          : [{ type: 'text', text: entry.message.content }];
        
        for (const content of contentArray) {
          if (content.type === 'tool_result' && !content.is_error) {
            // Find corresponding tool use to get tool name
            // This is a simplified approach - in practice you'd track tool_use_id
            for (const [toolName, stats] of toolResults.entries()) {
              if (stats.total > stats.successful) {
                stats.successful++;
                break;
              }
            }
          }
        }
      }
    }
    
    // Calculate success rates
    const toolSuccessRate = new Map<string, { total: number; successful: number; rate: number }>();
    for (const [toolName, stats] of toolResults.entries()) {
      toolSuccessRate.set(toolName, {
        total: stats.total,
        successful: stats.successful,
        rate: stats.total > 0 ? stats.successful / stats.total : 0
      });
    }
    
    // Find most used tool
    let mostUsedTool: string | null = null;
    let maxFrequency = 0;
    for (const [toolName, frequency] of toolFrequency.entries()) {
      if (frequency > maxFrequency) {
        maxFrequency = frequency;
        mostUsedTool = toolName;
      }
    }
    
    // Analyze tool sequences
    const sequenceMap = new Map<string, number>();
    for (const sequence of toolSequences) {
      const key = sequence.join(' → ');
      sequenceMap.set(key, (sequenceMap.get(key) || 0) + 1);
    }
    
    const commonSequences = Array.from(sequenceMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([sequenceStr, frequency]) => ({
        sequence: sequenceStr.split(' → '),
        frequency
      }));
    
    return {
      toolFrequency,
      toolSuccessRate,
      averageToolsPerMessage: totalMessages > 0 ? totalToolUses / totalMessages : 0,
      mostUsedTool,
      toolSequences: commonSequences
    };
  }
}