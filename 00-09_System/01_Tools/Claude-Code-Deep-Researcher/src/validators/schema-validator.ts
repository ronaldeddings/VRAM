/**
 * Schema Validator for Claude Code conversation entries.
 * Validates JSONL entries against expected structure and field requirements.
 */

import type {
  ConversationEntry,
  ValidationResult,
  UserMessageEntry,
  AssistantMessageEntry,
  SystemMessageEntry,
  SummaryEntry,
  QueueOperationEntry,
  FileHistorySnapshotEntry,
  ResultEntry
} from '../types/claude-conversation.ts';

export class SchemaValidator {
  
  /**
   * Validate a conversation entry against schema requirements.
   * 
   * @param entry - Raw entry object to validate
   * @returns Validation result with errors and warnings
   */
  validateConversationEntry(entry: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Basic type check
    if (typeof entry !== 'object' || entry === null) {
      return {
        isValid: false,
        errors: ['Entry must be a valid object'],
        warnings: [],
        problematicEntries: ['invalid-object']
      };
    }
    
    // Common field validation for all non-summary entries
    if (entry.type !== 'summary') {
      this.validateBaseFields(entry, errors, warnings);
    }
    
    // Type field validation
    if (!entry.type || typeof entry.type !== 'string') {
      errors.push('Missing or invalid type field');
    } else {
      // Type-specific validation
      switch (entry.type) {
        case 'user':
          this.validateUserEntry(entry, errors, warnings);
          break;
        case 'assistant':
          this.validateAssistantEntry(entry, errors, warnings);
          break;
        case 'system':
          this.validateSystemEntry(entry, errors, warnings);
          break;
        case 'summary':
          this.validateSummaryEntry(entry, errors, warnings);
          break;
        case 'result':
          this.validateResultEntry(entry, errors, warnings);
          break;
        case 'queue-operation':
          this.validateQueueOperationEntry(entry, errors, warnings);
          break;
        case 'file-history-snapshot':
          this.validateFileHistorySnapshotEntry(entry, errors, warnings);
          break;
        default:
          errors.push(`Unknown entry type: ${entry.type}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      problematicEntries: errors.length > 0 ? [entry.uuid || 'unknown'] : undefined
    };
  }
  
  /**
   * Validate base fields common to most entry types.
   */
  private validateBaseFields(entry: any, errors: string[], warnings: string[]): void {
    // Required fields
    if (!entry.uuid || typeof entry.uuid !== 'string') {
      errors.push('Missing or invalid uuid field');
    }
    
    if (!entry.timestamp || typeof entry.timestamp !== 'string') {
      errors.push('Missing or invalid timestamp field');
    } else {
      // Validate timestamp format
      const date = new Date(entry.timestamp);
      if (isNaN(date.getTime())) {
        errors.push('Invalid timestamp format');
      }
    }
    
    if (!entry.sessionId || typeof entry.sessionId !== 'string') {
      errors.push('Missing or invalid sessionId field');
    }
    
    if (entry.parentUuid !== null && typeof entry.parentUuid !== 'string') {
      errors.push('parentUuid must be string or null');
    }
    
    if (typeof entry.isSidechain !== 'boolean') {
      warnings.push('Missing or invalid isSidechain field');
    }
    
    if (entry.userType && entry.userType !== 'external') {
      warnings.push(`Unexpected userType: ${entry.userType}`);
    }
    
    if (!entry.cwd || typeof entry.cwd !== 'string') {
      warnings.push('Missing or invalid cwd field');
    }
    
    if (!entry.version || typeof entry.version !== 'string') {
      warnings.push('Missing or invalid version field');
    }
    
    if (!entry.gitBranch || typeof entry.gitBranch !== 'string') {
      warnings.push('Missing or invalid gitBranch field');
    }
  }
  
  /**
   * Validate user message entry structure.
   */
  private validateUserEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.message || typeof entry.message !== 'object') {
      errors.push('User entry missing message object');
      return;
    }
    
    if (entry.message.role !== 'user') {
      errors.push('User entry must have message.role = "user"');
    }
    
    if (!entry.message.content) {
      errors.push('User entry missing message.content');
    } else {
      // Content can be string or array
      if (typeof entry.message.content !== 'string' && !Array.isArray(entry.message.content)) {
        errors.push('User message content must be string or array');
      }
      
      // If array, validate content blocks
      if (Array.isArray(entry.message.content)) {
        for (const [index, content] of entry.message.content.entries()) {
          this.validateMessageContent(content, errors, warnings, `user.content[${index}]`);
        }
      }
    }
    
    // Validate tool result data if present
    if (entry.toolUseResult) {
      this.validateToolUseResult(entry.toolUseResult, errors, warnings);
    }
  }
  
  /**
   * Validate assistant message entry structure.
   */
  private validateAssistantEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.message || typeof entry.message !== 'object') {
      errors.push('Assistant entry missing message object');
      return;
    }
    
    // Required message fields
    if (!entry.message.id || typeof entry.message.id !== 'string') {
      errors.push('Assistant entry missing message.id');
    }
    
    if (entry.message.type !== 'message') {
      warnings.push('Assistant message type should be "message"');
    }
    
    if (entry.message.role !== 'assistant') {
      errors.push('Assistant entry must have message.role = "assistant"');
    }
    
    if (!entry.message.model || typeof entry.message.model !== 'string') {
      warnings.push('Assistant entry missing model field');
    }
    
    // Content validation
    if (!Array.isArray(entry.message.content)) {
      errors.push('Assistant entry message.content must be an array');
    } else {
      for (const [index, content] of entry.message.content.entries()) {
        this.validateMessageContent(content, errors, warnings, `assistant.content[${index}]`);
      }
    }
    
    // Usage validation
    if (!entry.message.usage) {
      warnings.push('Assistant entry missing usage metrics');
    } else {
      this.validateUsageMetrics(entry.message.usage, errors, warnings);
    }
    
    // Optional fields validation
    if (entry.message.stop_reason && typeof entry.message.stop_reason !== 'string') {
      warnings.push('Invalid stop_reason field');
    }
    
    if (entry.requestId && typeof entry.requestId !== 'string') {
      warnings.push('Invalid requestId field');
    }
  }
  
  /**
   * Validate system message entry structure.
   */
  private validateSystemEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.subtype || typeof entry.subtype !== 'string') {
      errors.push('System entry missing subtype field');
    } else {
      const validSubtypes = ['compact_boundary', 'informational', 'init', 'local_command'];
      if (!validSubtypes.includes(entry.subtype)) {
        warnings.push(`Unknown system subtype: ${entry.subtype}`);
      }
    }
    
    if (entry.content && typeof entry.content !== 'string') {
      warnings.push('System entry content must be string');
    }
    
    if (entry.isMeta && typeof entry.isMeta !== 'boolean') {
      warnings.push('System entry isMeta must be boolean');
    }
    
    if (entry.level && entry.level !== 'info') {
      warnings.push(`Unknown system level: ${entry.level}`);
    }
    
    // Validate compact metadata if present
    if (entry.compact_metadata) {
      this.validateCompactMetadata(entry.compact_metadata, errors, warnings);
    }
  }
  
  /**
   * Validate summary entry structure.
   */
  private validateSummaryEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.summary || typeof entry.summary !== 'string') {
      errors.push('Summary entry missing summary field');
    }
    
    if (!entry.leafUuid || typeof entry.leafUuid !== 'string') {
      errors.push('Summary entry missing leafUuid field');
    }
    
    if (!entry.sessionId || typeof entry.sessionId !== 'string') {
      errors.push('Summary entry missing sessionId field');
    }
    
    if (entry.isVisibleInTranscriptOnly && typeof entry.isVisibleInTranscriptOnly !== 'boolean') {
      warnings.push('Invalid isVisibleInTranscriptOnly field');
    }
  }
  
  /**
   * Validate result entry structure.
   */
  private validateResultEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.subtype || typeof entry.subtype !== 'string') {
      errors.push('Result entry missing subtype field');
    } else {
      const validSubtypes = ['success', 'error_max_turns', 'error_during_execution'];
      if (!validSubtypes.includes(entry.subtype)) {
        warnings.push(`Unknown result subtype: ${entry.subtype}`);
      }
    }
    
    if (typeof entry.is_error !== 'boolean') {
      errors.push('Result entry missing is_error boolean');
    }
    
    if (typeof entry.duration_ms !== 'number') {
      warnings.push('Result entry missing duration_ms');
    }
    
    if (typeof entry.duration_api_ms !== 'number') {
      warnings.push('Result entry missing duration_api_ms');
    }
    
    if (typeof entry.num_turns !== 'number') {
      warnings.push('Result entry missing num_turns');
    }
    
    if (typeof entry.total_cost_usd !== 'number') {
      warnings.push('Result entry missing total_cost_usd');
    }
    
    // Validate usage metrics
    if (entry.usage) {
      this.validateUsageMetrics(entry.usage, errors, warnings);
    } else {
      warnings.push('Result entry missing usage metrics');
    }
    
    // Validate model usage if present
    if (entry.modelUsage) {
      this.validateModelUsage(entry.modelUsage, errors, warnings);
    }
    
    // Validate permission denials if present
    if (entry.permission_denials && Array.isArray(entry.permission_denials)) {
      for (const [index, denial] of entry.permission_denials.entries()) {
        this.validatePermissionDenial(denial, errors, warnings, index);
      }
    }
  }
  
  /**
   * Validate message content block structure.
   */
  private validateMessageContent(content: any, errors: string[], warnings: string[], context: string): void {
    if (!content || typeof content !== 'object') {
      errors.push(`${context}: content block must be object`);
      return;
    }
    
    if (!content.type || typeof content.type !== 'string') {
      errors.push(`${context}: missing content type`);
      return;
    }
    
    switch (content.type) {
      case 'text':
        if (!content.text || typeof content.text !== 'string') {
          errors.push(`${context}: text content missing text field`);
        }
        break;
        
      case 'tool_use':
        if (!content.id || typeof content.id !== 'string') {
          errors.push(`${context}: tool_use missing id`);
        }
        if (!content.name || typeof content.name !== 'string') {
          errors.push(`${context}: tool_use missing name`);
        }
        if (!content.input || typeof content.input !== 'object') {
          errors.push(`${context}: tool_use missing input object`);
        }
        break;
        
      case 'tool_result':
        if (!content.tool_use_id || typeof content.tool_use_id !== 'string') {
          errors.push(`${context}: tool_result missing tool_use_id`);
        }
        if (content.content === undefined) {
          errors.push(`${context}: tool_result missing content`);
        }
        if (content.is_error && typeof content.is_error !== 'boolean') {
          warnings.push(`${context}: invalid is_error field`);
        }
        break;
        
      default:
        warnings.push(`${context}: unknown content type: ${content.type}`);
    }
  }
  
  /**
   * Validate usage metrics structure.
   */
  private validateUsageMetrics(usage: any, errors: string[], warnings: string[]): void {
    if (typeof usage !== 'object' || usage === null) {
      errors.push('Usage metrics must be object');
      return;
    }
    
    const requiredFields = ['input_tokens', 'output_tokens'];
    for (const field of requiredFields) {
      if (typeof usage[field] !== 'number') {
        warnings.push(`Usage missing or invalid ${field}`);
      }
    }
    
    // Optional but common fields
    const optionalFields = ['cache_creation_input_tokens', 'cache_read_input_tokens'];
    for (const field of optionalFields) {
      if (usage[field] !== undefined && typeof usage[field] !== 'number') {
        warnings.push(`Usage invalid ${field}`);
      }
    }
    
    if (usage.service_tier && typeof usage.service_tier !== 'string') {
      warnings.push('Usage invalid service_tier');
    }
    
    // Validate cache creation object if present
    if (usage.cache_creation) {
      if (typeof usage.cache_creation !== 'object') {
        warnings.push('Usage cache_creation must be object');
      } else {
        const cacheFields = ['ephemeral_5m_input_tokens', 'ephemeral_1h_input_tokens'];
        for (const field of cacheFields) {
          if (usage.cache_creation[field] !== undefined && typeof usage.cache_creation[field] !== 'number') {
            warnings.push(`Usage cache_creation invalid ${field}`);
          }
        }
      }
    }
  }
  
  /**
   * Validate model usage structure.
   */
  private validateModelUsage(modelUsage: any, errors: string[], warnings: string[]): void {
    if (typeof modelUsage !== 'object' || modelUsage === null) {
      warnings.push('Model usage must be object');
      return;
    }
    
    for (const [modelName, usage] of Object.entries(modelUsage)) {
      if (typeof usage !== 'object' || usage === null) {
        warnings.push(`Model usage for ${modelName} must be object`);
        continue;
      }
      
      const usageObj = usage as any;
      const requiredFields = ['inputTokens', 'outputTokens', 'costUSD'];
      for (const field of requiredFields) {
        if (typeof usageObj[field] !== 'number') {
          warnings.push(`Model usage ${modelName} missing or invalid ${field}`);
        }
      }
    }
  }
  
  /**
   * Validate tool use result structure.
   */
  private validateToolUseResult(toolResult: any, errors: string[], warnings: string[]): void {
    if (typeof toolResult !== 'object' || toolResult === null) {
      warnings.push('Tool use result must be object');
      return;
    }
    
    // Validate todo arrays if present
    if (toolResult.oldTodos && !Array.isArray(toolResult.oldTodos)) {
      warnings.push('Tool result oldTodos must be array');
    }
    
    if (toolResult.newTodos && !Array.isArray(toolResult.newTodos)) {
      warnings.push('Tool result newTodos must be array');
    }
  }
  
  /**
   * Validate compact metadata structure.
   */
  private validateCompactMetadata(metadata: any, errors: string[], warnings: string[]): void {
    if (typeof metadata !== 'object' || metadata === null) {
      warnings.push('Compact metadata must be object');
      return;
    }
    
    if (metadata.trigger && !['auto', 'manual'].includes(metadata.trigger)) {
      warnings.push(`Invalid compact metadata trigger: ${metadata.trigger}`);
    }
    
    if (metadata.pre_tokens !== undefined && typeof metadata.pre_tokens !== 'number') {
      warnings.push('Compact metadata pre_tokens must be number');
    }
    
    if (metadata.preTokens !== undefined && typeof metadata.preTokens !== 'number') {
      warnings.push('Compact metadata preTokens must be number');
    }
  }
  
  /**
   * Validate permission denial structure.
   */
  private validatePermissionDenial(denial: any, errors: string[], warnings: string[], index: number): void {
    if (typeof denial !== 'object' || denial === null) {
      warnings.push(`Permission denial ${index} must be object`);
      return;
    }
    
    if (!denial.tool_name || typeof denial.tool_name !== 'string') {
      warnings.push(`Permission denial ${index} missing tool_name`);
    }
    
    if (!denial.tool_use_id || typeof denial.tool_use_id !== 'string') {
      warnings.push(`Permission denial ${index} missing tool_use_id`);
    }
    
    if (!denial.tool_input || typeof denial.tool_input !== 'object') {
      warnings.push(`Permission denial ${index} missing tool_input`);
    }
  }

  /**
   * Validate queue operation entry structure.
   */
  private validateQueueOperationEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.operation || typeof entry.operation !== 'string') {
      errors.push('Queue operation entry missing operation field');
    }

    if (!entry.timestamp || typeof entry.timestamp !== 'string') {
      errors.push('Queue operation entry missing timestamp field');
    } else {
      // Validate timestamp format
      const date = new Date(entry.timestamp);
      if (isNaN(date.getTime())) {
        errors.push('Queue operation entry has invalid timestamp format');
      }
    }

    if (!entry.content || typeof entry.content !== 'string') {
      errors.push('Queue operation entry missing content field');
    }

    if (!entry.sessionId || typeof entry.sessionId !== 'string') {
      errors.push('Queue operation entry missing sessionId field');
    }
  }

  /**
   * Validate file history snapshot entry structure.
   */
  private validateFileHistorySnapshotEntry(entry: any, errors: string[], warnings: string[]): void {
    if (!entry.messageId || typeof entry.messageId !== 'string') {
      errors.push('File history snapshot entry missing messageId field');
    }

    if (!entry.snapshot || typeof entry.snapshot !== 'object') {
      errors.push('File history snapshot entry missing snapshot object');
      return;
    }

    // Validate snapshot structure
    if (!entry.snapshot.messageId || typeof entry.snapshot.messageId !== 'string') {
      warnings.push('Snapshot missing messageId field');
    }

    if (!entry.snapshot.trackedFileBackups || typeof entry.snapshot.trackedFileBackups !== 'object') {
      errors.push('Snapshot missing or invalid trackedFileBackups object');
    } else {
      // Validate tracked file backups structure
      for (const [filePath, backup] of Object.entries(entry.snapshot.trackedFileBackups)) {
        if (typeof backup !== 'object' || backup === null) {
          warnings.push(`Invalid backup object for file: ${filePath}`);
          continue;
        }

        const backupObj = backup as any;

        if (backupObj.backupFileName !== null && typeof backupObj.backupFileName !== 'string') {
          warnings.push(`Invalid backupFileName for file: ${filePath}`);
        }

        if (typeof backupObj.version !== 'number') {
          warnings.push(`Invalid version for file: ${filePath}`);
        }

        if (!backupObj.backupTime || typeof backupObj.backupTime !== 'string') {
          warnings.push(`Invalid backupTime for file: ${filePath}`);
        } else {
          const date = new Date(backupObj.backupTime);
          if (isNaN(date.getTime())) {
            warnings.push(`Invalid backupTime format for file: ${filePath}`);
          }
        }
      }
    }

    if (!entry.snapshot.timestamp || typeof entry.snapshot.timestamp !== 'string') {
      errors.push('Snapshot missing timestamp field');
    } else {
      const date = new Date(entry.snapshot.timestamp);
      if (isNaN(date.getTime())) {
        errors.push('Snapshot has invalid timestamp format');
      }
    }

    if (typeof entry.isSnapshotUpdate !== 'boolean') {
      errors.push('File history snapshot entry missing isSnapshotUpdate boolean');
    }
  }

  /**
   * Validate multiple conversation entries in batch.
   *
   * @param entries - Array of entries to validate
   * @returns Consolidated validation result
   */
  validateEntries(entries: any[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const problematicEntries: string[] = [];
    
    for (const [index, entry] of entries.entries()) {
      const result = this.validateConversationEntry(entry);
      
      if (!result.isValid) {
        allErrors.push(...result.errors.map(err => `Entry ${index + 1}: ${err}`));
        if (result.problematicEntries) {
          problematicEntries.push(...result.problematicEntries);
        }
      }
      
      if (result.warnings.length > 0) {
        allWarnings.push(...result.warnings.map(warn => `Entry ${index + 1}: ${warn}`));
      }
    }
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      problematicEntries: problematicEntries.length > 0 ? problematicEntries : undefined
    };
  }
}