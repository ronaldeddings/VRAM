/**
 * Conversation Builder Service for Claude Code conversation analysis.
 * Builds conversation trees, extracts action sequences, and analyzes conversation flow.
 */

import type { 
  ConversationEntry, 
  ConversationNode, 
  ConversationChain,
  StepSummary,
  isAssistantMessage,
  isUserMessage,
  isSystemMessage,
  isResultEntry
} from '../types/claude-conversation.ts';

/**
 * Service for building structured representations of Claude Code conversations.
 * Handles parent-child relationships, branching, and action sequence extraction.
 */
export class ConversationBuilder {
  
  /**
   * Build a conversation tree from flat array of entries.
   * Creates hierarchical structure based on parentUuid relationships.
   * 
   * @param entries - Array of conversation entries
   * @returns Array of root conversation nodes with children
   */
  buildConversationTree(entries: ConversationEntry[]): ConversationNode[] {
    const entryMap = new Map<string, ConversationEntry>();
    const nodeMap = new Map<string, ConversationNode>();
    
    // Index all entries by UUID
    for (const entry of entries) {
      if ('uuid' in entry) {
        entryMap.set(entry.uuid, entry);
        nodeMap.set(entry.uuid, {
          entry,
          children: [],
          depth: 0,
          isBranch: false
        });
      }
    }
    
    // Build parent-child relationships with circular reference detection
    const roots: ConversationNode[] = [];
    const visitedForDepth = new Set<string>();
    
    for (const entry of entries) {
      if (!('uuid' in entry)) continue;
      
      const node = nodeMap.get(entry.uuid)!;
      
      if (entry.parentUuid && nodeMap.has(entry.parentUuid)) {
        // Check for circular reference
        if (entry.parentUuid === entry.uuid) {
          // Self-reference, treat as root
          roots.push(node);
          continue;
        }
        
        const parent = nodeMap.get(entry.parentUuid)!;
        parent.children.push(node);
        
        // Calculate depth with circular reference protection
        node.depth = this.calculateDepthSafely(entry.uuid, nodeMap, visitedForDepth);
        
        // Mark parent as branch if it has multiple children
        if (parent.children.length > 1) {
          parent.isBranch = true;
        }
      } else {
        // Root node (no parent or parent not found)
        roots.push(node);
      }
    }
    
    // If we have circular references and no roots, pick the first entry as root
    if (roots.length === 0 && entries.length > 0) {
      const firstEntry = entries.find(e => 'uuid' in e);
      if (firstEntry && 'uuid' in firstEntry) {
        const firstNode = nodeMap.get(firstEntry.uuid);
        if (firstNode) {
          roots.push(firstNode);
        }
      }
    }
    
    // Sort children by timestamp for consistent ordering
    this.sortNodesByTimestamp(roots);
    
    return roots;
  }

  /**
   * Calculate depth safely with circular reference protection.
   * 
   * @param uuid - UUID of the entry to calculate depth for
   * @param nodeMap - Map of UUIDs to nodes
   * @param visited - Set of visited UUIDs to detect circular references
   * @returns Calculated depth or 0 if circular reference detected
   */
  private calculateDepthSafely(
    uuid: string, 
    nodeMap: Map<string, ConversationNode>, 
    visited: Set<string>
  ): number {
    if (visited.has(uuid)) {
      // Circular reference detected, return safe default
      return 0;
    }
    
    visited.add(uuid);
    
    const node = nodeMap.get(uuid);
    if (!node || !('parentUuid' in node.entry)) {
      visited.delete(uuid);
      return 0;
    }
    
    const parentUuid = node.entry.parentUuid;
    if (!parentUuid || !nodeMap.has(parentUuid)) {
      visited.delete(uuid);
      return 0;
    }
    
    const depth = 1 + this.calculateDepthSafely(parentUuid, nodeMap, visited);
    visited.delete(uuid);
    return depth;
  }

  /**
   * Recursively sort conversation nodes and their children by timestamp.
   * 
   * @param nodes - Array of conversation nodes to sort
   */
  private sortNodesByTimestamp(nodes: ConversationNode[], visited: Set<string> = new Set()): void {
    nodes.sort((a, b) => {
      const timeA = 'timestamp' in a.entry ? new Date(a.entry.timestamp).getTime() : 0;
      const timeB = 'timestamp' in b.entry ? new Date(b.entry.timestamp).getTime() : 0;
      return timeA - timeB;
    });
    
    for (const node of nodes) {
      const nodeId = 'uuid' in node.entry ? node.entry.uuid : 'unknown';
      
      if (node.children.length > 0 && !visited.has(nodeId)) {
        visited.add(nodeId);
        this.sortNodesByTimestamp(node.children, visited);
        visited.delete(nodeId);
      }
    }
  }

  /**
   * Extract action sequence from conversation entries.
   * Creates a timeline of tool uses, decisions, and system events.
   * 
   * @param entries - Array of conversation entries
   * @returns Array of step summaries in chronological order
   */
  extractActionSequence(entries: ConversationEntry[]): StepSummary[] {
    const steps: StepSummary[] = [];
    let stepNumber = 1;
    
    // Sort entries by timestamp for chronological processing
    const sortedEntries = [...entries].sort((a, b) => {
      const timeA = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0;
      const timeB = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
    
    for (const entry of sortedEntries) {
      // Process assistant messages for tool usage
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            const toolInput = content.input;
            let description = `Used ${content.name} tool`;
            
            // Create more descriptive step descriptions based on tool type
            switch (content.name) {
              case 'TodoWrite':
                const todoCount = toolInput.todos?.length || 0;
                description = `Created/updated ${todoCount} todo items`;
                break;
              case 'Read':
                description = `Read file: ${toolInput.file_path || 'unknown'}`;
                break;
              case 'Write':
                description = `Created file: ${toolInput.file_path || 'unknown'}`;
                break;
              case 'Edit':
                description = `Edited file: ${toolInput.file_path || 'unknown'}`;
                break;
              case 'Bash':
                const cmd = toolInput.command || 'unknown command';
                const shortCmd = cmd.length > 50 ? cmd.substring(0, 47) + '...' : cmd;
                description = `Executed: ${shortCmd}`;
                break;
              case 'Grep':
                description = `Searched for pattern: ${toolInput.pattern || 'unknown'}`;
                break;
              case 'Glob':
                description = `Found files matching: ${toolInput.pattern || 'unknown'}`;
                break;
              case 'WebSearch':
                description = `Web search: ${toolInput.query || 'unknown'}`;
                break;
              case 'WebFetch':
                description = `Fetched URL: ${toolInput.url || 'unknown'}`;
                break;
              default:
                description = `Used ${content.name}: ${JSON.stringify(toolInput).substring(0, 100)}`;
            }
            
            steps.push({
              stepNumber: stepNumber++,
              type: 'tool_use',
              tool: content.name,
              description,
              timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
              success: true // Assume success unless we find error in tool result
            });
          } else if (content.type === 'text' && content.text.trim()) {
            // Record text responses as steps
            const text = content.text.length > 100 
              ? content.text.substring(0, 97) + '...' 
              : content.text;
            
            steps.push({
              stepNumber: stepNumber++,
              type: 'response',
              description: `Response: ${text}`,
              timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
              success: true
            });
          }
        }
      }
      
      // Process user messages for decisions/inputs
      else if (entry.type === 'user' && 'message' in entry) {
        // Skip tool results, focus on user decisions
        if (typeof entry.message.content === 'string' && entry.message.content.trim()) {
          const content = entry.message.content.length > 100 
            ? entry.message.content.substring(0, 97) + '...' 
            : entry.message.content;
          
          steps.push({
            stepNumber: stepNumber++,
            type: 'decision',
            description: `User input: ${content}`,
            timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
            success: true
          });
        }
        
        // Check for tool errors in toolUseResult
        if (entry.toolUseResult && typeof entry.toolUseResult === 'object') {
          // Handle different toolUseResult structures
          if ('message' in entry.toolUseResult && typeof entry.toolUseResult.message === 'string') {
            // Update the last tool use step to mark as failed if error detected
            const lastToolStep = [...steps].reverse().find(s => s.type === 'tool_use');
            if (lastToolStep && entry.toolUseResult.message.includes('error')) {
              lastToolStep.success = false;
            }
          }
          // Handle TodoWrite results
          if ('newTodos' in entry.toolUseResult && Array.isArray(entry.toolUseResult.newTodos)) {
            steps.push({
              type: 'response',
              description: `Todo list updated: ${entry.toolUseResult.newTodos.length} tasks`,
              timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
              success: true
            });
          }
        }
      }
      
      // Process system messages
      else if (entry.type === 'system' && 'subtype' in entry) {
        let description = `System ${entry.subtype}`;
        
        switch (entry.subtype) {
          case 'compact_boundary':
            description = 'Conversation compacted to save tokens';
            break;
          case 'informational':
            description = 'System information message';
            break;
          case 'init':
            description = 'Session initialized';
            break;
        }
        
        steps.push({
          stepNumber: stepNumber++,
          type: 'system',
          description,
          timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
          success: true
        });
      }
      
      // Process result entries
      else if (entry.type === 'result' && 'subtype' in entry) {
        const isError = 'is_error' in entry ? entry.is_error : false;
        const description = isError 
          ? `Conversation ended with error (${entry.subtype})`
          : `Conversation completed successfully (${entry.subtype})`;
        
        steps.push({
          stepNumber: stepNumber++,
          type: 'system',
          description,
          timestamp: 'timestamp' in entry ? entry.timestamp : new Date().toISOString(),
          success: !isError
        });
      }
    }
    
    return steps;
  }

  /**
   * Build a complete conversation chain with metadata.
   * 
   * @param entries - Array of conversation entries
   * @param sessionId - Session identifier
   * @param projectPath - Project path for this conversation
   * @returns Complete conversation chain object
   */
  buildConversationChain(
    entries: ConversationEntry[], 
    sessionId?: string, 
    projectPath?: string
  ): ConversationChain {
    // Extract sessionId from entries if not provided
    const extractedSessionId = sessionId || entries.find(e => 
      'sessionId' in e ? e.sessionId : undefined
    )?.sessionId || 'unknown';
    
    // Extract project path from entries if not provided
    const extractedProjectPath = projectPath || 'unknown';
    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => {
      const timeA = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0;
      const timeB = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
    
    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    
    const startTime = firstEntry && 'timestamp' in firstEntry 
      ? firstEntry.timestamp 
      : new Date().toISOString();
    
    const endTime = lastEntry && 'timestamp' in lastEntry 
      ? lastEntry.timestamp 
      : new Date().toISOString();
    
    // Calculate costs and token usage
    let totalCost = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCachedTokens = 0;
    
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry && entry.message.usage) {
        const usage = entry.message.usage;
        totalInputTokens += usage.input_tokens || 0;
        totalOutputTokens += usage.output_tokens || 0;
        totalCachedTokens += (usage.cache_read_input_tokens || 0) + (usage.cache_creation_input_tokens || 0);
      } else if (entry.type === 'result' && 'total_cost_usd' in entry) {
        totalCost += entry.total_cost_usd || 0;
      }
    }
    
    return {
      sessionId: extractedSessionId,
      entries: sortedEntries,
      startTime,
      endTime,
      totalEntries: entries.length,
      projectPath: extractedProjectPath,
      totalCost: totalCost > 0 ? totalCost : 0,
      tokenUsage: {
        input: totalInputTokens,
        output: totalOutputTokens,
        cached: totalCachedTokens
      }
    };
  }

  /**
   * Extract tool usage statistics from conversation entries.
   * 
   * @param entries - Array of conversation entries
   * @returns Tool usage frequency and success rates
   */
  extractToolUsageStats(entries: ConversationEntry[]): {
    toolFrequency: Record<string, number>;
    toolSuccessRate: Record<string, { used: number; failed: number; successRate: number }>;
    totalToolUses: number;
    uniqueTools: string[];
  } {
    const toolFrequency: Record<string, number> = {};
    const toolResults: Record<string, { used: number; failed: number }> = {};
    const toolIds = new Map<string, string>(); // tool_use_id -> tool_name
    
    // First pass: collect tool uses
    for (const entry of entries) {
      if (entry.type === 'assistant' && 'message' in entry) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            const toolName = content.name;
            toolFrequency[toolName] = (toolFrequency[toolName] || 0) + 1;
            
            if (!toolResults[toolName]) {
              toolResults[toolName] = { used: 0, failed: 0 };
            }
            toolResults[toolName].used++;
            
            // Store mapping for checking results later
            toolIds.set(content.id, toolName);
          }
        }
      }
    }
    
    // Second pass: check for tool errors
    for (const entry of entries) {
      if (entry.type === 'user' && 'message' in entry && Array.isArray(entry.message.content)) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_result' && content.is_error) {
            const toolName = toolIds.get(content.tool_use_id);
            if (toolName && toolResults[toolName]) {
              toolResults[toolName].failed++;
            }
          }
        }
      }
    }
    
    // Calculate success rates
    const toolSuccessRate: Record<string, { used: number; failed: number; successRate: number }> = {};
    for (const [toolName, stats] of Object.entries(toolResults)) {
      toolSuccessRate[toolName] = {
        used: stats.used,
        failed: stats.failed,
        successRate: stats.used > 0 ? ((stats.used - stats.failed) / stats.used) * 100 : 0
      };
    }
    
    return {
      toolFrequency,
      toolSuccessRate,
      totalToolUses: Object.values(toolFrequency).reduce((sum, count) => sum + count, 0),
      uniqueTools: Object.keys(toolFrequency)
    };
  }

  /**
   * Find conversation branches and merge points.
   * 
   * @param tree - Conversation tree nodes
   * @returns Information about conversation branching
   */
  analyzeBranching(tree: ConversationNode[]): {
    branches: ConversationNode[];
    mergePoints: ConversationNode[];
    maxDepth: number;
    totalPaths: number;
  } {
    const branches: ConversationNode[] = [];
    const mergePoints: ConversationNode[] = [];
    let maxDepth = 0;
    let totalPaths = 0;
    
    const traverseTree = (nodes: ConversationNode[]): void => {
      for (const node of nodes) {
        maxDepth = Math.max(maxDepth, node.depth);
        
        if (node.isBranch) {
          branches.push(node);
        }
        
        // A merge point is a node that has multiple potential parents
        // (identified by having multiple references in the conversation)
        if (node.children.length === 0) {
          totalPaths++;
        }
        
        if (node.children.length > 0) {
          traverseTree(node.children);
        }
      }
    };
    
    traverseTree(tree);
    
    return {
      branches,
      mergePoints,
      maxDepth,
      totalPaths
    };
  }

  /**
   * Get conversation flow summary.
   * 
   * @param entries - Array of conversation entries
   * @returns High-level conversation flow summary
   */
  getFlowSummary(entries: ConversationEntry[]): {
    totalSteps: number;
    toolUses: number;
    responses: number;
    decisions: number;
    toolsUsed: string[];
    duration: number;
  } {
    if (entries.length === 0) {
      return { 
        totalSteps: 0, 
        toolUses: 0, 
        responses: 0, 
        decisions: 0, 
        toolsUsed: [], 
        duration: 0 
      };
    }

    const sortedEntries = [...entries].sort((a, b) => {
      const timeA = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0;
      const timeB = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0;
      return timeA - timeB;
    });
    
    const firstTime = 'timestamp' in sortedEntries[0] ? new Date(sortedEntries[0].timestamp).getTime() : 0;
    const lastTime = 'timestamp' in sortedEntries[sortedEntries.length - 1] 
      ? new Date(sortedEntries[sortedEntries.length - 1].timestamp).getTime() 
      : 0;
    
    const duration = lastTime - firstTime;
    
    let toolUses = 0;
    let responses = 0;
    let decisions = 0;
    const toolsUsedSet = new Set<string>();
    
    for (const entry of sortedEntries) {
      if (entry.type === 'assistant' && 'message' in entry) {
        responses++;
        
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            toolUses++;
            toolsUsedSet.add(content.name);
          }
        }
      }
      
      // Count user decisions (meaningful user inputs)
      if (entry.type === 'user' && 'message' in entry && typeof entry.message.content === 'string') {
        if (entry.message.content.trim().length > 10) {
          decisions++;
        }
      }
    }
    
    const totalSteps = toolUses + responses + decisions;
    
    return {
      totalSteps,
      toolUses,
      responses,
      decisions,
      toolsUsed: Array.from(toolsUsedSet),
      duration
    };
  }
}