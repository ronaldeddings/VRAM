/**
 * JSONL Parser Service for Claude Code conversation files.
 * Provides streaming parser for large JSONL files with error recovery.
 */

import type { 
  ConversationEntry, 
  ValidationResult,
  ConversationMetadata,
  SummaryEntry 
} from '../types/claude-conversation.ts';

/**
 * Streaming JSONL parser optimized for Claude Code conversation files.
 * Uses Bun's file API for efficient large file processing.
 */
export class JSONLParser {
  private readonly maxLineLength = 1024 * 1024; // 1MB max line length
  private readonly bufferSize = 8192; // 8KB buffer size

  /**
   * Parse a JSONL file and yield conversation entries as they are processed.
   * Uses streaming to handle large files efficiently.
   * 
   * @param filePath - Absolute path to the JSONL file
   * @yields ConversationEntry objects as they are parsed
   */
  async *parseFile(filePath: string): AsyncGenerator<ConversationEntry, void, unknown> {
    let totalLinesProcessed = 0;
    let errorCount = 0;
    
    try {
      const file = Bun.file(filePath);
      
      // Check if file exists and is readable
      if (!(await file.exists())) {
        throw new Error(`File not found: ${filePath}`);
      }

      const stream = file.stream();
      const reader = stream.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let buffer = '';
      let lineNumber = 0;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          // Keep the last potentially incomplete line in buffer
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            lineNumber++;
            
            if (line.trim()) {
              try {
                const entry = this.parseLine(line, lineNumber);
                if (entry) {
                  yield entry;
                  totalLinesProcessed++;
                }
              } catch (error) {
                errorCount++;
                console.warn(`[JSONLParser] Failed to parse line ${lineNumber}: ${error}`);
                
                // Log problematic line (truncated for safety)
                const truncatedLine = line.length > 200 ? line.substring(0, 200) + '...' : line;
                console.warn(`[JSONLParser] Problematic line: ${truncatedLine}`);
                
                // Continue processing other lines
                continue;
              }
            }
          }
        }
        
        // Process final buffer if it contains content
        if (buffer.trim()) {
          lineNumber++;
          try {
            const entry = this.parseLine(buffer, lineNumber);
            if (entry) {
              yield entry;
              totalLinesProcessed++;
            }
          } catch (error) {
            errorCount++;
            console.warn(`[JSONLParser] Failed to parse final line ${lineNumber}: ${error}`);
          }
        }
        
      } finally {
        reader.releaseLock();
      }
      
    } catch (error) {
      throw new Error(`Failed to parse JSONL file ${filePath}: ${error}`);
    }
    
    console.log(`[JSONLParser] Completed parsing: ${totalLinesProcessed} entries processed, ${errorCount} errors`);
  }

  /**
   * Parse a single JSONL line into a conversation entry.
   * 
   * @param line - Raw JSONL line
   * @param lineNumber - Line number for error reporting
   * @returns Parsed and validated conversation entry
   */
  private parseLine(line: string, lineNumber: number): ConversationEntry | null {
    if (line.trim() === '') {
      return null;
    }

    // Check line length limit
    if (line.length > this.maxLineLength) {
      throw new Error(`Line ${lineNumber} exceeds maximum length of ${this.maxLineLength} characters`);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(line);
    } catch (error) {
      throw new Error(`Invalid JSON on line ${lineNumber}: ${error}`);
    }

    // Validate required fields
    const validationResult = this.validateEntry(parsed, lineNumber);
    if (!validationResult.isValid) {
      throw new Error(`Invalid entry on line ${lineNumber}: ${validationResult.errors.join(', ')}`);
    }

    return parsed as ConversationEntry;
  }

  /**
   * Validate a parsed entry has required fields and proper structure.
   * 
   * @param entry - Parsed JSON object
   * @param lineNumber - Line number for error context
   * @returns Validation result with errors if any
   */
  private validateEntry(entry: any, lineNumber: number): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required base fields for most entry types
    // Note: summary, queue-operation, and file-history-snapshot have different field requirements
    if (entry.type !== 'summary' && entry.type !== 'queue-operation' && entry.type !== 'file-history-snapshot') {
      if (!entry.uuid || typeof entry.uuid !== 'string') {
        errors.push('Missing or invalid uuid field');
      }

      if (!entry.timestamp || typeof entry.timestamp !== 'string') {
        errors.push('Missing or invalid timestamp field');
      }

      if (!entry.sessionId || typeof entry.sessionId !== 'string') {
        errors.push('Missing or invalid sessionId field');
      }
    }

    if (!entry.type || typeof entry.type !== 'string') {
      errors.push('Missing or invalid type field');
    }

    // Type-specific validation
    switch (entry.type) {
      case 'user':
        if (!entry.message || typeof entry.message !== 'object') {
          errors.push('User entry missing message object');
        } else {
          if (entry.message.role !== 'user') {
            errors.push('User entry must have message.role = "user"');
          }
          if (!entry.message.content) {
            errors.push('User entry missing message.content');
          }
        }
        break;

      case 'assistant':
        if (!entry.message || typeof entry.message !== 'object') {
          errors.push('Assistant entry missing message object');
        } else {
          if (!entry.message.id) {
            errors.push('Assistant entry missing message.id');
          }
          if (!entry.message.usage) {
            warnings.push('Assistant entry missing usage metrics');
          }
          if (!Array.isArray(entry.message.content)) {
            errors.push('Assistant entry message.content must be an array');
          }
        }
        break;

      case 'system':
        if (!entry.subtype) {
          warnings.push('System entry missing subtype field');
        }
        break;

      case 'summary':
        if (!entry.summary || typeof entry.summary !== 'string') {
          errors.push('Summary entry missing summary field');
        }
        if (!entry.leafUuid) {
          errors.push('Summary entry missing leafUuid field');
        }
        break;

      case 'result':
        if (!entry.subtype) {
          errors.push('Result entry missing subtype field');
        }
        if (typeof entry.is_error !== 'boolean') {
          warnings.push('Result entry missing is_error boolean');
        }
        break;

      case 'queue-operation':
        if (!entry.operation || typeof entry.operation !== 'string') {
          errors.push('Queue operation entry missing operation field');
        }
        if (!entry.timestamp || typeof entry.timestamp !== 'string') {
          errors.push('Queue operation entry missing timestamp field');
        }
        if (!entry.content || typeof entry.content !== 'string') {
          errors.push('Queue operation entry missing content field');
        }
        if (!entry.sessionId || typeof entry.sessionId !== 'string') {
          errors.push('Queue operation entry missing sessionId field');
        }
        break;

      case 'file-history-snapshot':
        if (!entry.messageId || typeof entry.messageId !== 'string') {
          errors.push('File history snapshot entry missing messageId field');
        }
        if (!entry.snapshot || typeof entry.snapshot !== 'object') {
          errors.push('File history snapshot entry missing snapshot object');
        } else {
          if (!entry.snapshot.messageId) {
            warnings.push('Snapshot missing messageId');
          }
          if (!entry.snapshot.trackedFileBackups || typeof entry.snapshot.trackedFileBackups !== 'object') {
            warnings.push('Snapshot missing or invalid trackedFileBackups');
          }
          if (!entry.snapshot.timestamp) {
            warnings.push('Snapshot missing timestamp');
          }
        }
        if (typeof entry.isSnapshotUpdate !== 'boolean') {
          warnings.push('File history snapshot missing isSnapshotUpdate boolean');
        }
        break;

      default:
        warnings.push(`Unknown entry type: ${entry.type}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      problematicEntries: errors.length > 0 ? [entry.uuid || `line-${lineNumber}`] : undefined
    };
  }

  /**
   * Parse entire file and return all entries as an array.
   * Use with caution for large files as this loads everything into memory.
   * 
   * @param filePath - Path to JSONL file
   * @returns Array of all conversation entries
   */
  async parseFileToArray(filePath: string): Promise<ConversationEntry[]> {
    const entries: ConversationEntry[] = [];
    
    for await (const entry of this.parseFile(filePath)) {
      entries.push(entry);
    }
    
    return entries;
  }

  /**
   * Extract basic metadata from a JSONL file without parsing all entries.
   * Useful for quick file analysis and indexing.
   * 
   * @param filePath - Path to JSONL file
   * @returns Basic conversation metadata
   */
  async extractMetadata(filePath: string): Promise<ConversationMetadata> {
    const file = Bun.file(filePath);
    const stats = await file.stat();
    
    let sessionId = '';
    let entryCount = 0;
    let firstEntry: ConversationEntry | null = null;
    let lastEntry: ConversationEntry | null = null;
    const toolsUsed = new Set<string>();
    let hasErrors = false;

    // Extract session ID from filename
    const fileName = filePath.split('/').pop() || '';
    if (fileName.endsWith('.jsonl')) {
      sessionId = fileName.replace('.jsonl', '');
    }

    try {
      // Parse only a few entries to extract metadata
      let entryCounter = 0;
      for await (const entry of this.parseFile(filePath)) {
        entryCount++;
        entryCounter++;
        
        if (!firstEntry) {
          firstEntry = entry;
        }
        lastEntry = entry;

        // Extract tools used from assistant messages
        if (entry.type === 'assistant' && 'message' in entry) {
          for (const content of entry.message.content) {
            if (content.type === 'tool_use') {
              toolsUsed.add(content.name);
            }
          }
        }

        // Check for errors
        if (entry.type === 'result' && 'is_error' in entry && entry.is_error) {
          hasErrors = true;
        }

        // Only process first 100 entries for metadata extraction
        if (entryCounter >= 100) {
          // Continue counting remaining entries without full processing
          const remainingStream = file.stream();
          const reader = remainingStream.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              entryCount += lines.filter(line => line.trim()).length;
            }
            
            if (buffer.trim()) {
              entryCount++;
            }
          } finally {
            reader.releaseLock();
          }
          break;
        }
      }
    } catch (error) {
      console.warn(`[JSONLParser] Error extracting metadata from ${filePath}: ${error}`);
    }

    // Extract project path from file path
    const pathParts = filePath.split('/');
    const projectsIndex = pathParts.findIndex(part => part === 'projects');
    const projectPath = projectsIndex >= 0 && projectsIndex < pathParts.length - 1 
      ? pathParts[projectsIndex + 1] 
      : 'unknown';

    return {
      sessionId,
      filePath,
      projectPath,
      size: stats.size,
      lastModified: new Date(stats.mtime),
      entryCount,
      toolsUsed: Array.from(toolsUsed),
      completedSuccessfully: !hasErrors && lastEntry?.type === 'result',
      duration: firstEntry && lastEntry 
        ? new Date(lastEntry.timestamp).getTime() - new Date(firstEntry.timestamp).getTime()
        : undefined
    };
  }

  /**
   * Count entries in a JSONL file without parsing content.
   * Very fast for getting just the entry count.
   * 
   * @param filePath - Path to JSONL file
   * @returns Number of entries (non-empty lines)
   */
  async countEntries(filePath: string): Promise<number> {
    const file = Bun.file(filePath);
    const stream = file.stream();
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    
    let count = 0;
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        count += lines.filter(line => line.trim()).length;
      }
      
      if (buffer.trim()) {
        count++;
      }
    } finally {
      reader.releaseLock();
    }
    
    return count;
  }
}