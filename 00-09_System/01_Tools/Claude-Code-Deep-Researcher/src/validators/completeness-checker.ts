/**
 * Completeness Checker for Claude Code conversation entries.
 * Validates conversation completeness, data integrity, and expected patterns.
 */

import type {
  ConversationEntry,
  ValidationResult,
  AssistantMessageEntry,
  UserMessageEntry,
  SystemMessageEntry,
  ResultEntry,
  QueueOperationEntry,
  FileHistorySnapshotEntry
} from '../types/claude-conversation.ts';

export class CompletenessChecker {
  
  /**
   * Check conversation completeness and integrity.
   * 
   * @param entries - Array of conversation entries to check
   * @returns Completeness validation result
   */
  checkConversationCompleteness(entries: ConversationEntry[]): {
    isComplete: boolean;
    hasProperEnding: boolean;
    missingComponents: string[];
    structuralIssues: string[];
    dataIntegrityIssues: string[];
    recommendations: string[];
  } {
    const missingComponents: string[] = [];
    const structuralIssues: string[] = [];
    const dataIntegrityIssues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for essential components
    const hasUserMessages = entries.some(e => e.type === 'user');
    const hasAssistantMessages = entries.some(e => e.type === 'assistant');
    const hasSystemInit = entries.some(e => e.type === 'system' && e.subtype === 'init');
    const hasResultEntry = entries.some(e => e.type === 'result');
    
    if (!hasUserMessages) {
      missingComponents.push('No user messages found');
    }
    
    if (!hasAssistantMessages) {
      missingComponents.push('No assistant messages found');
    }
    
    if (!hasSystemInit) {
      missingComponents.push('No system initialization entry found');
    }
    
    if (!hasResultEntry) {
      missingComponents.push('No result entry found - conversation may be incomplete');
    }
    
    // Check conversation flow
    this.validateConversationFlow(entries, structuralIssues);
    
    // Check data integrity
    this.validateDataIntegrity(entries, dataIntegrityIssues);
    
    // Check proper ending
    const hasProperEnding = this.checkProperEnding(entries);
    if (!hasProperEnding) {
      structuralIssues.push('Conversation does not end properly');
    }
    
    // Generate recommendations
    this.generateRecommendations(entries, missingComponents, structuralIssues, recommendations);
    
    const isComplete = missingComponents.length === 0 && 
                      structuralIssues.length === 0 && 
                      dataIntegrityIssues.length === 0;
    
    return {
      isComplete,
      hasProperEnding,
      missingComponents,
      structuralIssues,
      dataIntegrityIssues,
      recommendations
    };
  }
  
  /**
   * Validate conversation flow patterns.
   */
  private validateConversationFlow(entries: ConversationEntry[], issues: string[]): void {
    const messageEntries = entries.filter(e => e.type === 'user' || e.type === 'assistant');
    
    if (messageEntries.length === 0) {
      issues.push('No conversation messages found');
      return;
    }
    
    // Check alternating pattern (user -> assistant -> user -> ...)
    let expectedNextType: 'user' | 'assistant' = 'user';
    let patternViolations = 0;
    
    for (const entry of messageEntries) {
      if (entry.type !== expectedNextType) {
        patternViolations++;
      }
      expectedNextType = entry.type === 'user' ? 'assistant' : 'user';
    }
    
    // Allow some flexibility in conversation flow
    if (patternViolations > messageEntries.length * 0.3) {
      issues.push(`Irregular conversation flow: ${patternViolations} pattern violations`);
    }
    
    // Check for orphaned user messages (user message not followed by assistant response)
    const lastMessage = messageEntries[messageEntries.length - 1];
    if (lastMessage.type === 'user' && !entries.some(e => e.type === 'result')) {
      issues.push('Last user message has no assistant response');
    }
  }
  
  /**
   * Validate data integrity across entries.
   */
  private validateDataIntegrity(entries: ConversationEntry[], issues: string[]): void {
    // Check timestamp ordering
    const timestampedEntries = entries
      .filter(e => e.type !== 'summary' && e.type !== 'file-history-snapshot')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Check for significant timestamp gaps (>24 hours)
    for (let i = 1; i < timestampedEntries.length; i++) {
      const prevTime = new Date(timestampedEntries[i - 1].timestamp);
      const currTime = new Date(timestampedEntries[i].timestamp);
      const gapHours = (currTime.getTime() - prevTime.getTime()) / (1000 * 60 * 60);
      
      if (gapHours > 24) {
        issues.push(`Large timestamp gap: ${gapHours.toFixed(1)} hours between entries`);
      }
    }
    
    // Check for duplicate UUIDs
    const uuids = new Set<string>();
    const duplicateUuids: string[] = [];

    for (const entry of entries) {
      if (entry.type === 'summary' || entry.type === 'queue-operation' || entry.type === 'file-history-snapshot') continue;
      
      if (uuids.has(entry.uuid)) {
        duplicateUuids.push(entry.uuid);
      } else {
        uuids.add(entry.uuid);
      }
    }
    
    if (duplicateUuids.length > 0) {
      issues.push(`Duplicate UUIDs found: ${duplicateUuids.join(', ')}`);
    }
    
    // Check session consistency
    const sessionIds = new Set(
      entries
        .filter(e => e.type !== 'file-history-snapshot')
        .map(e => (e.type === 'summary' || e.type === 'queue-operation') ? e.sessionId : e.sessionId)
    );
    
    if (sessionIds.size > 1) {
      issues.push(`Multiple session IDs found: ${Array.from(sessionIds).join(', ')}`);
    }
    
    // Check version consistency
    const versions = new Set(
      entries
        .filter(e => e.type !== 'summary' && e.type !== 'queue-operation' && e.type !== 'file-history-snapshot')
        .map(e => e.version)
    );
    
    if (versions.size > 2) {
      issues.push(`Multiple Claude Code versions used: ${Array.from(versions).join(', ')}`);
    }
  }
  
  /**
   * Check if conversation has proper ending.
   */
  private checkProperEnding(entries: ConversationEntry[]): boolean {
    const sortedEntries = entries
      .filter(e => e.type !== 'summary' && e.type !== 'queue-operation' && e.type !== 'file-history-snapshot')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    if (sortedEntries.length === 0) {
      return false;
    }
    
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    
    // Conversation should end with either:
    // 1. A result entry indicating completion
    // 2. An assistant message followed by a result entry
    return lastEntry.type === 'result' || 
           (lastEntry.type === 'assistant' && entries.some(e => e.type === 'result'));
  }
  
  /**
   * Generate recommendations for improving conversation completeness.
   */
  private generateRecommendations(
    entries: ConversationEntry[],
    missingComponents: string[],
    structuralIssues: string[],
    recommendations: string[]
  ): void {
    if (missingComponents.includes('No result entry found')) {
      recommendations.push('Add result entry to properly close conversation');
    }
    
    if (missingComponents.includes('No system initialization entry found')) {
      recommendations.push('Include system initialization entry for better tracking');
    }
    
    if (structuralIssues.some(issue => issue.includes('Irregular conversation flow'))) {
      recommendations.push('Review conversation flow for proper user-assistant alternation');
    }
    
    if (structuralIssues.some(issue => issue.includes('timestamp gap'))) {
      recommendations.push('Investigate large timestamp gaps for potential data loss');
    }
    
    // Check for tool usage completeness
    const hasToolUses = entries.some(e => 
      e.type === 'assistant' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_use')
    );
    
    const hasToolResults = entries.some(e => 
      e.type === 'user' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_result')
    );
    
    if (hasToolUses && !hasToolResults) {
      recommendations.push('Tool uses found without corresponding results - check for incomplete operations');
    }
    
    // Check for cost tracking
    const hasCostData = entries.some(e => 
      e.type === 'result' && typeof e.total_cost_usd === 'number'
    );
    
    if (!hasCostData) {
      recommendations.push('Add cost tracking for better conversation analytics');
    }
  }
  
  /**
   * Check for expected conversation patterns and best practices.
   * 
   * @param entries - Array of conversation entries
   * @returns Pattern analysis results
   */
  checkConversationPatterns(entries: ConversationEntry[]): {
    patterns: {
      hasInitialGreeting: boolean;
      hasProperTaskStructure: boolean;
      hasErrorHandling: boolean;
      hasValidation: boolean;
      hasSummary: boolean;
    };
    quality: {
      averageMessageLength: number;
      toolUsageBalance: number;
      errorRate: number;
      completionRate: number;
    };
    insights: string[];
  } {
    const patterns = {
      hasInitialGreeting: this.hasInitialGreeting(entries),
      hasProperTaskStructure: this.hasProperTaskStructure(entries),
      hasErrorHandling: this.hasErrorHandling(entries),
      hasValidation: this.hasValidation(entries),
      hasSummary: entries.some(e => e.type === 'summary')
    };
    
    const quality = this.analyzeConversationQuality(entries);
    const insights = this.generateQualityInsights(patterns, quality, entries);
    
    return {
      patterns,
      quality,
      insights
    };
  }
  
  /**
   * Check if conversation starts with proper greeting/context.
   */
  private hasInitialGreeting(entries: ConversationEntry[]): boolean {
    const firstUserMessage = entries.find(e => e.type === 'user');
    if (!firstUserMessage) return false;
    
    const content = typeof firstUserMessage.message.content === 'string' 
      ? firstUserMessage.message.content.toLowerCase()
      : '';
    
    const greetingWords = ['hello', 'hi', 'please', 'help', 'can you', 'i need'];
    return greetingWords.some(word => content.includes(word));
  }
  
  /**
   * Check if conversation follows proper task structure.
   */
  private hasProperTaskStructure(entries: ConversationEntry[]): boolean {
    // Look for TodoWrite tool usage indicating structured task management
    const hasTodoManagement = entries.some(e => 
      e.type === 'assistant' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_use' && c.name === 'TodoWrite')
    );
    
    // Look for structured approach in messages
    const hasStructuredMessages = entries.some(e => {
      if (e.type !== 'assistant') return false;
      
      const textContent = Array.isArray(e.message.content) 
        ? e.message.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
        : '';
      
      const structureWords = ['first', 'next', 'then', 'finally', 'step', 'phase'];
      return structureWords.some(word => textContent.toLowerCase().includes(word));
    });
    
    return hasTodoManagement || hasStructuredMessages;
  }
  
  /**
   * Check if conversation includes error handling.
   */
  private hasErrorHandling(entries: ConversationEntry[]): boolean {
    // Look for error tool results
    const hasErrorResults = entries.some(e => 
      e.type === 'user' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_result' && c.is_error)
    );
    
    // Look for error discussion in messages
    const hasErrorDiscussion = entries.some(e => {
      if (e.type !== 'assistant') return false;
      
      const textContent = Array.isArray(e.message.content) 
        ? e.message.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
        : '';
      
      const errorWords = ['error', 'failed', 'issue', 'problem', 'fix', 'troubleshoot'];
      return errorWords.some(word => textContent.toLowerCase().includes(word));
    });
    
    return hasErrorResults || hasErrorDiscussion;
  }
  
  /**
   * Check if conversation includes validation steps.
   */
  private hasValidation(entries: ConversationEntry[]): boolean {
    // Look for validation tools
    const validationTools = ['Bash', 'Grep', 'Read'];
    const hasValidationTools = entries.some(e => 
      e.type === 'assistant' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => 
        c.type === 'tool_use' && validationTools.includes(c.name)
      )
    );
    
    // Look for validation language
    const hasValidationLanguage = entries.some(e => {
      if (e.type !== 'assistant') return false;
      
      const textContent = Array.isArray(e.message.content) 
        ? e.message.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
        : '';
      
      const validationWords = ['verify', 'check', 'validate', 'test', 'confirm'];
      return validationWords.some(word => textContent.toLowerCase().includes(word));
    });
    
    return hasValidationTools || hasValidationLanguage;
  }
  
  /**
   * Analyze conversation quality metrics.
   */
  private analyzeConversationQuality(entries: ConversationEntry[]): {
    averageMessageLength: number;
    toolUsageBalance: number;
    errorRate: number;
    completionRate: number;
  } {
    const messageEntries = entries.filter(e => e.type === 'user' || e.type === 'assistant');
    
    // Calculate average message length
    let totalLength = 0;
    let messageCount = 0;
    
    for (const entry of messageEntries) {
      if (entry.type === 'user' || entry.type === 'assistant') {
        const content = Array.isArray(entry.message.content) 
          ? entry.message.content.filter(c => c.type === 'text').map(c => c.text).join(' ')
          : typeof entry.message.content === 'string' ? entry.message.content : '';
        
        totalLength += content.length;
        messageCount++;
      }
    }
    
    const averageMessageLength = messageCount > 0 ? totalLength / messageCount : 0;
    
    // Calculate tool usage balance (ratio of tool uses to total messages)
    const toolUseCount = entries.filter(e => 
      e.type === 'assistant' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_use')
    ).length;
    
    const toolUsageBalance = messageCount > 0 ? toolUseCount / messageCount : 0;
    
    // Calculate error rate
    const errorCount = entries.filter(e => 
      e.type === 'user' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_result' && c.is_error)
    ).length;
    
    const totalToolResults = entries.filter(e => 
      e.type === 'user' && 
      Array.isArray(e.message.content) &&
      e.message.content.some(c => c.type === 'tool_result')
    ).length;
    
    const errorRate = totalToolResults > 0 ? errorCount / totalToolResults : 0;
    
    // Calculate completion rate
    const resultEntry = entries.find(e => e.type === 'result') as ResultEntry | undefined;
    const completionRate = resultEntry && !resultEntry.is_error ? 1.0 : 0.0;
    
    return {
      averageMessageLength,
      toolUsageBalance,
      errorRate,
      completionRate
    };
  }
  
  /**
   * Generate quality insights based on patterns and metrics.
   */
  private generateQualityInsights(
    patterns: any,
    quality: any,
    entries: ConversationEntry[]
  ): string[] {
    const insights: string[] = [];
    
    if (quality.averageMessageLength < 50) {
      insights.push('Messages are quite short - consider providing more context');
    } else if (quality.averageMessageLength > 1000) {
      insights.push('Messages are very long - consider breaking into smaller chunks');
    }
    
    if (quality.toolUsageBalance > 0.8) {
      insights.push('Heavy tool usage - good for automation but ensure readability');
    } else if (quality.toolUsageBalance < 0.2) {
      insights.push('Light tool usage - consider more automation opportunities');
    }
    
    if (quality.errorRate > 0.2) {
      insights.push('High error rate - review tool usage patterns and error handling');
    } else if (quality.errorRate === 0) {
      insights.push('No errors detected - excellent execution quality');
    }
    
    if (!patterns.hasProperTaskStructure) {
      insights.push('Consider using structured task management for better organization');
    }
    
    if (!patterns.hasValidation) {
      insights.push('Add validation steps to improve code quality and reliability');
    }
    
    if (!patterns.hasSummary && entries.length > 20) {
      insights.push('Long conversation could benefit from summary for better tracking');
    }
    
    if (quality.completionRate === 1.0) {
      insights.push('Conversation completed successfully - good task execution');
    } else {
      insights.push('Conversation did not complete successfully - review for issues');
    }
    
    return insights;
  }
}