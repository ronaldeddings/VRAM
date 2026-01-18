/**
 * Step Analyzer Service for Claude Code conversation analysis.
 * Provides detailed analysis of conversation steps, tool evolution, and patterns.
 */

import type { 
  ConversationEntry, 
  TodoItem,
  SessionAnalysis,
  StepSummary
} from '../types/claude-conversation.ts';

/**
 * Service for analyzing conversation steps and extracting insights.
 * Focuses on tool usage patterns, todo evolution, and error analysis.
 */
export class StepAnalyzer {

  /**
   * Perform comprehensive analysis of a conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Complete session analysis with summary, timeline, costs, and performance
   */
  analyzeConversation(entries: ConversationEntry[]): SessionAnalysis {
    const sessionId = entries.length > 0 && 'sessionId' in entries[0] ? entries[0].sessionId : 'unknown';
    
    // Extract basic metrics
    const uniqueTools = this.extractUniqueTools(entries);
    const todoEvolution = this.extractTodoEvolution(entries);
    const decisionPoints = this.findDecisionPoints(entries);
    const errorAnalysis = this.analyzeErrors(entries);
    const toolUsageAnalysis = this.analyzeToolUsage(entries);
    const timeline = this.buildTimeline(entries);
    const costs = this.calculateCosts(entries);
    const performance = this.analyzePerformance(entries);

    return {
      sessionId,
      summary: {
        totalEntries: entries.length,
        uniqueTools,
        todoEvolution,
        decisionPoints,
        errorCount: errorAnalysis.totalErrors,
        successfulToolUses: toolUsageAnalysis.successful,
        failedToolUses: toolUsageAnalysis.failed
      },
      timeline,
      costs,
      performance
    };
  }

  /**
   * Extract all unique tools used in the conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Array of unique tool names
   */
  private extractUniqueTools(entries: ConversationEntry[]): string[] {
    const tools = new Set<string>();
    
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            tools.add(content.name);
          }
        }
      }
    }
    
    return Array.from(tools);
  }

  /**
   * Track the evolution of todo lists throughout the conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Array of todo states at different points in time
   */
  private extractTodoEvolution(entries: ConversationEntry[]): TodoItem[][] {
    const todoEvolution: TodoItem[][] = [];
    
    for (const entry of entries) {
      // Check assistant messages for TodoWrite tool use
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use' && content.name === 'TodoWrite') {
            const todos = content.input?.todos;
            if (Array.isArray(todos)) {
              // Deep clone todos to preserve snapshots
              todoEvolution.push(todos.map(todo => ({ ...todo })));
            }
          }
        }
      }
      
      // Check user messages for TodoWrite results
      if (entry.type === 'user' && entry.toolUseResult?.newTodos) {
        const newTodos = entry.toolUseResult.newTodos;
        if (Array.isArray(newTodos)) {
          todoEvolution.push(newTodos.map(todo => ({ ...todo })));
        }
      }
    }
    
    return todoEvolution;
  }

  /**
   * Find decision points in the conversation where user made significant inputs.
   * 
   * @param entries - Array of conversation entries
   * @returns Array of entries representing decision points
   */
  private findDecisionPoints(entries: ConversationEntry[]): ConversationEntry[] {
    const decisionPoints: ConversationEntry[] = [];
    
    for (const entry of entries) {
      if (entry.type === 'user' && 'message' in entry) {
        // Consider user messages as decision points if they:
        // 1. Have substantial content (>50 characters)
        // 2. Are not just tool results
        // 3. Have a parent (responding to something)
        
        const isSubstantialInput = typeof entry.message.content === 'string' && 
                                  entry.message.content.length > 50;
        
        const isNotJustToolResult = !Array.isArray(entry.message.content) ||
                                   !entry.message.content.every(c => c.type === 'tool_result');
        
        const hasParent = 'parentUuid' in entry && entry.parentUuid !== null;
        
        if (isSubstantialInput && isNotJustToolResult && hasParent) {
          decisionPoints.push(entry);
        }
      }
    }
    
    return decisionPoints;
  }

  /**
   * Analyze errors and failures throughout the conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Error analysis summary
   */
  private analyzeErrors(entries: ConversationEntry[]): {
    totalErrors: number;
    errorsByTool: Record<string, number>;
    errorSummary: Array<{ tool: string; error: string; timestamp: string }>;
  } {
    const errorsByTool: Record<string, number> = {};
    const errorSummary: Array<{ tool: string; error: string; timestamp: string }> = [];
    const toolIdToName = new Map<string, string>();
    
    // First pass: map tool IDs to names
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            toolIdToName.set(content.id, content.name);
          }
        }
      }
    }
    
    // Second pass: find errors
    for (const entry of entries) {
      if (entry.type === 'user' && 'message' in entry && Array.isArray(entry.message.content)) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_result' && content.is_error) {
            const toolName = toolIdToName.get(content.tool_use_id) || 'unknown';
            errorsByTool[toolName] = (errorsByTool[toolName] || 0) + 1;
            
            const errorContent = typeof content.content === 'string' 
              ? content.content 
              : JSON.stringify(content.content);
            
            errorSummary.push({
              tool: toolName,
              error: errorContent,
              timestamp: 'timestamp' in entry ? entry.timestamp : 'unknown'
            });
          }
        }
      }
      
      // Check for result entries with errors
      if (entry.type === 'result' && 'is_error' in entry && entry.is_error) {
        errorSummary.push({
          tool: 'session',
          error: `Session ended with error: ${entry.subtype}`,
          timestamp: 'timestamp' in entry ? entry.timestamp : 'unknown'
        });
      }
    }
    
    return {
      totalErrors: errorSummary.length,
      errorsByTool,
      errorSummary
    };
  }

  /**
   * Analyze tool usage success/failure rates.
   * 
   * @param entries - Array of conversation entries
   * @returns Tool usage analysis
   */
  private analyzeToolUsage(entries: ConversationEntry[]): {
    successful: number;
    failed: number;
    byTool: Record<string, { total: number; failed: number; successRate: number }>;
  } {
    const toolUsage: Record<string, { total: number; failed: number }> = {};
    const toolIdToName = new Map<string, string>();
    
    // Track tool uses
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            toolIdToName.set(content.id, content.name);
            
            if (!toolUsage[content.name]) {
              toolUsage[content.name] = { total: 0, failed: 0 };
            }
            toolUsage[content.name].total++;
          }
        }
      }
    }
    
    // Track failures
    for (const entry of entries) {
      if (entry.type === 'user' && 'message' in entry && Array.isArray(entry.message.content)) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_result' && content.is_error) {
            const toolName = toolIdToName.get(content.tool_use_id);
            if (toolName && toolUsage[toolName]) {
              toolUsage[toolName].failed++;
            }
          }
        }
      }
    }
    
    // Calculate totals and success rates
    let totalSuccessful = 0;
    let totalFailed = 0;
    const byTool: Record<string, { total: number; failed: number; successRate: number }> = {};
    
    for (const [toolName, stats] of Object.entries(toolUsage)) {
      const successful = stats.total - stats.failed;
      totalSuccessful += successful;
      totalFailed += stats.failed;
      
      byTool[toolName] = {
        total: stats.total,
        failed: stats.failed,
        successRate: stats.total > 0 ? (successful / stats.total) * 100 : 0
      };
    }
    
    return {
      successful: totalSuccessful,
      failed: totalFailed,
      byTool
    };
  }

  /**
   * Build detailed timeline of conversation events.
   * 
   * @param entries - Array of conversation entries
   * @returns Array of timeline steps
   */
  private buildTimeline(entries: ConversationEntry[]): StepSummary[] {
    const timeline: StepSummary[] = [];
    let stepNumber = 1;
    
    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => {
      const timeA = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0;
      const timeB = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
    
    let lastStepTime = 0;
    
    for (const entry of sortedEntries) {
      const entryTime = 'timestamp' in entry ? new Date(entry.timestamp).getTime() : 0;
      const duration = lastStepTime > 0 ? entryTime - lastStepTime : 0;
      
      // Process different entry types
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            timeline.push({
              stepNumber: stepNumber++,
              type: 'tool_use',
              tool: content.name,
              description: this.createToolDescription(content.name, content.input),
              timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
              success: true, // Will be updated if we find errors later
              duration: duration > 0 ? duration : undefined
            });
          } else if (content.type === 'text' && content.text.trim()) {
            timeline.push({
              stepNumber: stepNumber++,
              type: 'response',
              description: `Response: ${this.truncateText(content.text, 100)}`,
              timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
              success: true,
              duration: duration > 0 ? duration : undefined
            });
          }
        }
      } else if (entry.type === 'user' && 'message' in entry && typeof entry.message.content === 'string') {
        if (entry.message.content.trim()) {
          timeline.push({
            stepNumber: stepNumber++,
            type: 'decision',
            description: `User: ${this.truncateText(entry.message.content, 100)}`,
            timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
            success: true,
            duration: duration > 0 ? duration : undefined
          });
        }
      } else if (entry.type === 'system' && 'subtype' in entry) {
        timeline.push({
          stepNumber: stepNumber++,
          type: 'system',
          description: `System: ${entry.subtype}`,
          timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
          success: true,
          duration: duration > 0 ? duration : undefined
        });
      }
      
      lastStepTime = entryTime;
    }
    
    return timeline;
  }

  /**
   * Create descriptive text for tool usage.
   * 
   * @param toolName - Name of the tool
   * @param input - Tool input parameters
   * @returns Human-readable description
   */
  private createToolDescription(toolName: string, input: any): string {
    switch (toolName) {
      case 'TodoWrite':
        const todoCount = input?.todos?.length || 0;
        return `TodoWrite: Managing ${todoCount} todo items`;
      
      case 'Read':
        return `Read: ${input?.file_path || 'unknown file'}`;
      
      case 'Write':
        return `Write: ${input?.file_path || 'unknown file'}`;
      
      case 'Edit':
        const editType = input?.replace_all ? 'Replace all' : 'Replace first';
        return `Edit: ${editType} in ${input?.file_path || 'unknown file'}`;
      
      case 'Bash':
        const cmd = input?.command || 'unknown command';
        return `Bash: ${this.truncateText(cmd, 50)}`;
      
      case 'Grep':
        return `Grep: Search for "${input?.pattern || 'unknown'}"`;
      
      case 'Glob':
        return `Glob: Find files "${input?.pattern || 'unknown'}"`;
      
      case 'WebSearch':
        return `WebSearch: "${input?.query || 'unknown'}"`;
      
      case 'WebFetch':
        return `WebFetch: ${input?.url || 'unknown URL'}`;
      
      default:
        return `${toolName}: ${this.truncateText(JSON.stringify(input || {}), 80)}`;
    }
  }

  /**
   * Calculate costs and token usage from conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Cost and token analysis
   */
  private calculateCosts(entries: ConversationEntry[]): {
    totalUSD: number;
    tokenBreakdown: { input: number; output: number; cached: number };
  } {
    let totalUSD = 0;
    let totalInput = 0;
    let totalOutput = 0;
    let totalCached = 0;
    
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry && entry.message.usage) {
        const usage = entry.message.usage;
        totalInput += usage.input_tokens || 0;
        totalOutput += usage.output_tokens || 0;
        totalCached += (usage.cache_read_input_tokens || 0) + (usage.cache_creation_input_tokens || 0);
      } else if (entry.type === 'result' && 'total_cost_usd' in entry) {
        totalUSD += entry.total_cost_usd || 0;
      }
    }
    
    return {
      totalUSD,
      tokenBreakdown: {
        input: totalInput,
        output: totalOutput,
        cached: totalCached
      }
    };
  }

  /**
   * Analyze performance metrics of the conversation.
   * 
   * @param entries - Array of conversation entries
   * @returns Performance analysis
   */
  private analyzePerformance(entries: ConversationEntry[]): {
    averageResponseTime: number;
    longestOperation: number;
    toolUsageFrequency: Record<string, number>;
  } {
    const responseTimes: number[] = [];
    const toolFrequency: Record<string, number> = {};
    let longestOperation = 0;
    
    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => {
      const timeA = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0;
      const timeB = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const current = sortedEntries[i];
      const previous = sortedEntries[i - 1];
      
      if ('timestamp' in current && 'timestamp' in previous) {
        const currentTime = new Date(current.timestamp).getTime();
        const previousTime = new Date(previous.timestamp).getTime();
        const responseTime = currentTime - previousTime;
        
        if (responseTime > 0 && responseTime < 300000) { // Ignore gaps > 5 minutes
          responseTimes.push(responseTime);
          longestOperation = Math.max(longestOperation, responseTime);
        }
      }
      
      // Count tool usage
      if (current.type === 'assistant' && 'message' in current) {
        for (const content of current.message.content) {
          if (content.type === 'tool_use') {
            toolFrequency[content.name] = (toolFrequency[content.name] || 0) + 1;
          }
        }
      }
    }
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;
    
    return {
      averageResponseTime,
      longestOperation,
      toolUsageFrequency: toolFrequency
    };
  }

  /**
   * Truncate text to specified length with ellipsis.
   * 
   * @param text - Text to truncate
   * @param maxLength - Maximum length
   * @returns Truncated text
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Find conversation patterns and insights.
   * 
   * @param entries - Array of conversation entries
   * @returns Pattern analysis results
   */
  findPatterns(entries: ConversationEntry[]): {
    repeatedActions: Array<{ action: string; count: number }>;
    workflowPhases: Array<{ phase: string; duration: number; tools: string[] }>;
    efficiency: { fastActions: number; slowActions: number; averageToolsPerPhase: number };
  } {
    const actionCounts: Record<string, number> = {};
    const phases: Array<{ phase: string; duration: number; tools: string[] }> = [];
    let fastActions = 0;
    let slowActions = 0;
    
    // Analyze tool usage patterns
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            const actionKey = `${content.name}:${JSON.stringify(content.input).substring(0, 50)}`;
            actionCounts[actionKey] = (actionCounts[actionKey] || 0) + 1;
          }
        }
      }
    }
    
    // Find repeated actions (used more than once)
    const repeatedActions = Object.entries(actionCounts)
      .filter(([_, count]) => count > 1)
      .map(([action, count]) => ({ action: action.split(':')[0], count }))
      .sort((a, b) => b.count - a.count);
    
    // Simple workflow analysis based on timing
    const timestamps = entries
      .filter(e => 'timestamp' in e)
      .map(e => 'timestamp' in e ? new Date(e.timestamp).getTime() : 0)
      .sort((a, b) => a - b);
    
    if (timestamps.length > 0) {
      const totalDuration = timestamps[timestamps.length - 1] - timestamps[0];
      const phaseCount = Math.min(5, Math.max(1, Math.floor(entries.length / 10)));
      const phaseDuration = totalDuration / phaseCount;
      
      for (let i = 0; i < phaseCount; i++) {
        phases.push({
          phase: `Phase ${i + 1}`,
          duration: phaseDuration,
          tools: this.extractUniqueTools(entries.slice(i * 10, (i + 1) * 10))
        });
      }
    }
    
    const averageToolsPerPhase = phases.length > 0 
      ? phases.reduce((sum, phase) => sum + phase.tools.length, 0) / phases.length
      : 0;
    
    return {
      repeatedActions,
      workflowPhases: phases,
      efficiency: {
        fastActions,
        slowActions,
        averageToolsPerPhase
      }
    };
  }
}