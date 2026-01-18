import { ConversationEntry, MessageContent, isTextContent, isToolResultContent, isUserMessage, isAssistantMessage } from '../types/claude-conversation.js';
import { ClaudeCodeService } from './claude-code-service.js';
import { ConfigManager } from './config.js';

// Content detection and type classification interfaces
interface ContentTypeDetection {
  type: 'code' | 'logs' | 'documents' | 'transcripts' | 'data' | 'unknown';
  confidence: number; // 0-1 score
  characteristics: string[];
  sizeThreshold: number; // bytes
}

interface ContentAnalysisResult {
  isCondensable: boolean;
  contentType: ContentTypeDetection;
  estimatedReduction: number; // 0-1 ratio
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

// Content condensation strategy interfaces
interface CondensationStrategy {
  canHandle(contentType: string): boolean;
  condense(content: string, targetReduction: number): Promise<string>;
  validateQuality(original: string, condensed: string): QualityValidationResult;
}

interface QualityValidationResult {
  isValid: boolean;
  qualityScore: number; // 0-1 score
  preservedElements: string[];
  lostElements: string[];
  recommendations: string[];
}

interface CondensationResult {
  success: boolean;
  condensedContent: string;
  actualReduction: number;
  qualityScore: number;
  processingTime: number;
  strategy: string;
  errors?: string[];
}

// Condensation ratio control interfaces
interface CondensationRatioConfig {
  targetCondensationRatio: number; // 0-1, target overall reduction
  maxContentSize: number; // Maximum size in characters before condensation
  contentTypeRatios: Record<string, number>; // Per-type target ratios
  maintainFactualAccuracy: boolean;
  qualityThreshold: number; // Minimum quality score (0-1)
  adaptiveRatios: boolean; // Allow dynamic adjustment based on content
}

interface CondensationMetrics {
  totalEntriesProcessed: number;
  entriesCondensed: number;
  condensationAttempts: number;
  successfulCondensations: number;
  targetRatio: number;
  actualRatio: number;
  ratioAchievement: number; // actualRatio / targetRatio
  averageQualityScore: number;
  processingTimeMs: number;
  byContentType: Record<string, {
    processed: number;
    condensed: number;
    targetRatio: number;
    actualRatio: number;
    averageQuality: number;
  }>;
  failureReasons: Record<string, number>;
}

/**
 * Code content condensation strategy
 */
class CodeContentStrategy implements CondensationStrategy {
  canHandle(contentType: string): boolean {
    return contentType === 'code';
  }

  async condense(content: string, targetReduction: number): Promise<string> {
    // Remove excessive whitespace and comments while preserving structure
    let condensed = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/^\s*\n/gm, '') // Remove empty lines
      .replace(/\s+/g, ' ') // Collapse whitespace
      .trim();

    // If still too large, remove non-essential parts
    if (condensed.length > content.length * (1 - targetReduction)) {
      condensed = condensed
        .replace(/console\.(log|debug|info)\([^)]*\);?/g, '') // Remove console logs
        .replace(/\s*(;|\{|\})\s*/g, '$1') // Minimize spacing around punctuation
        .trim();
    }

    return condensed;
  }

  validateQuality(original: string, condensed: string): QualityValidationResult {
    const preservedElements: string[] = [];
    const lostElements: string[] = [];
    
    // Check for preserved essential code elements
    const codeElements = ['function', 'class', 'import', 'export', 'const', 'let', 'var'];
    codeElements.forEach(element => {
      const originalCount = (original.match(new RegExp(`\\b${element}\\b`, 'g')) || []).length;
      const condensedCount = (condensed.match(new RegExp(`\\b${element}\\b`, 'g')) || []).length;
      
      if (condensedCount === originalCount) {
        preservedElements.push(`${element} declarations`);
      } else if (condensedCount < originalCount) {
        lostElements.push(`${originalCount - condensedCount} ${element} declarations`);
      }
    });

    const qualityScore = preservedElements.length / (preservedElements.length + lostElements.length);
    
    return {
      isValid: qualityScore > 0.8,
      qualityScore,
      preservedElements,
      lostElements,
      recommendations: lostElements.length > 0 ? ['Review condensation to preserve essential code elements'] : []
    };
  }
}

/**
 * Log content condensation strategy
 */
class LogContentStrategy implements CondensationStrategy {
  canHandle(contentType: string): boolean {
    return contentType === 'logs';
  }

  async condense(content: string, targetReduction: number): Promise<string> {
    const lines = content.split('\n');
    const condensedLines: string[] = [];
    const seenPatterns = new Set<string>();

    for (const line of lines) {
      // Always keep error and warning lines
      if (/\b(ERROR|WARN|CRITICAL|FATAL)\b/i.test(line)) {
        condensedLines.push(line);
        continue;
      }

      // Consolidate repetitive log patterns
      const pattern = line.replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}[^\s]*/, 'TIMESTAMP')
                         .replace(/\d+/g, 'NUM');
      
      if (!seenPatterns.has(pattern)) {
        seenPatterns.add(pattern);
        condensedLines.push(line);
      }
      
      // Stop if we've reached target reduction
      if (condensedLines.join('\n').length <= content.length * (1 - targetReduction)) {
        break;
      }
    }

    return condensedLines.join('\n');
  }

  validateQuality(original: string, condensed: string): QualityValidationResult {
    const originalErrors = (original.match(/\b(ERROR|WARN|CRITICAL|FATAL)\b/gi) || []).length;
    const condensedErrors = (condensed.match(/\b(ERROR|WARN|CRITICAL|FATAL)\b/gi) || []).length;
    
    const preservedElements = ['timestamps', 'log levels'];
    const lostElements: string[] = [];
    
    if (condensedErrors < originalErrors) {
      lostElements.push(`${originalErrors - condensedErrors} error messages`);
    }

    const qualityScore = condensedErrors / Math.max(originalErrors, 1);
    
    return {
      isValid: qualityScore > 0.9, // High standard for log preservation
      qualityScore,
      preservedElements,
      lostElements,
      recommendations: lostElements.length > 0 ? ['Ensure all critical errors are preserved'] : []
    };
  }
}

/**
 * Document content condensation strategy
 */
class DocumentContentStrategy implements CondensationStrategy {
  canHandle(contentType: string): boolean {
    return contentType === 'documents';
  }

  async condense(content: string, targetReduction: number): Promise<string> {
    // Preserve structure while removing verbose explanations
    let condensed = content
      .replace(/\n{3,}/g, '\n\n') // Reduce excessive line breaks
      .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
      .replace(/(\w+)\s+\1(\s+\1)*/g, '$1') // Remove word repetition
      .trim();

    // Remove example blocks if content is still too large
    if (condensed.length > content.length * (1 - targetReduction)) {
      condensed = condensed
        .replace(/```[\s\S]*?```/g, '```[code example removed]```')
        .replace(/\bfor example[^.]*\./gi, '[example omitted].')
        .trim();
    }

    return condensed;
  }

  validateQuality(original: string, condensed: string): QualityValidationResult {
    const originalHeaders = (original.match(/^#+\s/gm) || []).length;
    const condensedHeaders = (condensed.match(/^#+\s/gm) || []).length;
    
    const preservedElements: string[] = [];
    const lostElements: string[] = [];
    
    if (condensedHeaders === originalHeaders) {
      preservedElements.push('document structure');
    } else {
      lostElements.push(`${originalHeaders - condensedHeaders} headers`);
    }

    const qualityScore = condensedHeaders / Math.max(originalHeaders, 1);
    
    return {
      isValid: qualityScore > 0.85,
      qualityScore,
      preservedElements,
      lostElements,
      recommendations: lostElements.length > 0 ? ['Preserve document structure and headers'] : []
    };
  }
}

/**
 * Transcript content condensation strategy  
 */
class TranscriptContentStrategy implements CondensationStrategy {
  canHandle(contentType: string): boolean {
    return contentType === 'transcripts';
  }

  async condense(content: string, targetReduction: number): Promise<string> {
    const lines = content.split('\n');
    const condensedLines: string[] = [];
    
    for (const line of lines) {
      // Always preserve tool use and results
      if (/\b(tool_use|tool_result)\b/i.test(line)) {
        condensedLines.push(line);
        continue;
      }
      
      // Keep system messages and decision points
      if (/^(system|assistant|user):/i.test(line) && 
          /(decision|important|error|success|complete)/i.test(line)) {
        condensedLines.push(line);
        continue;
      }
      
      // Remove conversational filler
      if (!/^(>\s|Q:|A:|\*\*|#)/m.test(line) && 
          !/\b(implement|create|fix|update|change)\b/i.test(line)) {
        continue; // Skip this line
      }
      
      condensedLines.push(line);
      
      // Check if we've reached target reduction
      if (condensedLines.join('\n').length <= content.length * (1 - targetReduction)) {
        break;
      }
    }
    
    return condensedLines.join('\n');
  }

  validateQuality(original: string, condensed: string): QualityValidationResult {
    const originalToolUses = (original.match(/\btool_use\b/gi) || []).length;
    const condensedToolUses = (condensed.match(/\btool_use\b/gi) || []).length;
    
    const preservedElements: string[] = [];
    const lostElements: string[] = [];
    
    if (condensedToolUses === originalToolUses) {
      preservedElements.push('tool uses');
    } else {
      lostElements.push(`${originalToolUses - condensedToolUses} tool uses`);
    }

    const qualityScore = condensedToolUses / Math.max(originalToolUses, 1);
    
    return {
      isValid: qualityScore > 0.95, // Very high standard for transcript preservation
      qualityScore,
      preservedElements,
      lostElements,
      recommendations: lostElements.length > 0 ? ['Preserve all tool uses and results'] : []
    };
  }
}

/**
 * Enhanced Content Optimizer with ratio controls and comprehensive metrics
 */
export class EnhancedContentOptimizer {
  private claudeService: ClaudeCodeService;
  private configManager: ConfigManager;
  private contentTypeThresholds: Record<string, number>;
  private condensationStrategies: CondensationStrategy[];
  private ratioConfig: CondensationRatioConfig;
  private currentMetrics: CondensationMetrics;

  constructor(claudeService: ClaudeCodeService, configManager: ConfigManager) {
    this.claudeService = claudeService;
    this.configManager = configManager;
    
    // Load configuration from config.json
    const config = this.configManager.getConfig();
    const stage3Config = config.prebakeEnhancements?.stage3 || {};
    
    this.ratioConfig = {
      targetCondensationRatio: stage3Config.targetCondensationRatio || 0.3,
      maxContentSize: stage3Config.maxContentSize || 10000,
      contentTypeRatios: stage3Config.contentTypeRatios || {
        code: 0.2,
        logs: 0.1,
        documents: 0.3,
        transcripts: 0.4
      },
      maintainFactualAccuracy: stage3Config.maintainFactualAccuracy !== false,
      qualityThreshold: 0.8, // Minimum quality score
      adaptiveRatios: true
    };
    
    // Configurable size thresholds per content type (in characters)
    this.contentTypeThresholds = {
      code: 800,         // Code files can be condensed if > 800 chars
      logs: 400,         // Log files can be condensed if > 400 chars
      documents: 1000,   // Documentation can be condensed if > 1KB
      transcripts: 600,  // Conversation transcripts if > 600 chars
      data: 300,         // Data structures/JSON if > 300 chars
      unknown: 500       // Unknown content types if > 500 chars
    };

    // Initialize content-specific condensation strategies
    this.condensationStrategies = [
      new CodeContentStrategy(),
      new LogContentStrategy(),
      new DocumentContentStrategy(),
      new TranscriptContentStrategy()
    ];

    // Initialize metrics tracking
    this.initializeMetrics();
  }

  /**
   * Initialize metrics tracking for condensation operations
   */
  private initializeMetrics(): void {
    this.currentMetrics = {
      totalEntriesProcessed: 0,
      entriesCondensed: 0,
      condensationAttempts: 0,
      successfulCondensations: 0,
      targetRatio: this.ratioConfig.targetCondensationRatio,
      actualRatio: 0,
      ratioAchievement: 0,
      averageQualityScore: 0,
      processingTimeMs: 0,
      byContentType: {},
      failureReasons: {}
    };

    // Initialize per-content-type metrics
    Object.keys(this.ratioConfig.contentTypeRatios).forEach(type => {
      this.currentMetrics.byContentType[type] = {
        processed: 0,
        condensed: 0,
        targetRatio: this.ratioConfig.contentTypeRatios[type],
        actualRatio: 0,
        averageQuality: 0
      };
    });
  }

  /**
   * Get current condensation configuration
   */
  public getCondensationConfig(): CondensationRatioConfig {
    return { ...this.ratioConfig };
  }

  /**
   * Update condensation ratio configuration
   */
  public updateCondensationRatios(newConfig: Partial<CondensationRatioConfig>): void {
    this.ratioConfig = { ...this.ratioConfig, ...newConfig };
    console.log(`📊 Updated condensation configuration:`, this.ratioConfig);
  }

  /**
   * Get current metrics for monitoring condensation effectiveness
   */
  public getCondensationMetrics(): CondensationMetrics {
    return { ...this.currentMetrics };
  }

  /**
   * Reset metrics for a new condensation session
   */
  public resetMetrics(): void {
    this.initializeMetrics();
    console.log('📊 Condensation metrics reset for new session');
  }

  /**
   * Enhanced content detection for better identification of condensable content within JSONL lines
   * Supports different content types with configurable thresholds and detailed analysis
   */
  isLargeFileContent(entry: ConversationEntry): ContentAnalysisResult {
    try {
      // Extract content from conversation entry
      const extractedContent = this.extractContentFromEntry(entry);
      if (!extractedContent) {
        return {
          isCondensable: false,
          contentType: { type: 'unknown', confidence: 0, characteristics: [], sizeThreshold: 0 },
          estimatedReduction: 0,
          priority: 'low',
          reasoning: 'No extractable content found'
        };
      }

      // Detect content type and characteristics
      const contentType = this.detectContentType(extractedContent);
      
      // Check if content exceeds threshold for its type
      const threshold = this.contentTypeThresholds[contentType.type];
      const isCondensable = extractedContent.length > threshold;
      
      // Get target reduction ratio for this content type
      const targetReduction = this.getTargetReductionRatio(contentType.type, extractedContent.length);
      
      // Determine priority based on size, type, and reduction potential
      const priority = this.determinePriority(extractedContent.length, contentType, targetReduction);
      
      const reasoning = this.generateReasoningForDetection(
        extractedContent.length, 
        threshold, 
        contentType, 
        targetReduction
      );

      return {
        isCondensable,
        contentType,
        estimatedReduction: targetReduction,
        priority,
        reasoning
      };
    } catch (error) {
      console.error('Error in enhanced content detection:', error);
      return {
        isCondensable: false,
        contentType: { type: 'unknown', confidence: 0, characteristics: ['error'], sizeThreshold: 0 },
        estimatedReduction: 0,
        priority: 'low',
        reasoning: `Error during analysis: ${error}`
      };
    }
  }

  /**
   * Get target reduction ratio for specific content type with adaptive adjustment
   */
  private getTargetReductionRatio(contentType: string, contentSize: number): number {
    let baseRatio = this.ratioConfig.contentTypeRatios[contentType] || this.ratioConfig.targetCondensationRatio;
    
    if (this.ratioConfig.adaptiveRatios) {
      // Adjust ratio based on content size
      if (contentSize > this.ratioConfig.maxContentSize * 2) {
        baseRatio += 0.1; // More aggressive for very large content
      } else if (contentSize < this.ratioConfig.maxContentSize * 0.5) {
        baseRatio -= 0.05; // Less aggressive for smaller content
      }
      
      // Ensure ratio stays within reasonable bounds
      baseRatio = Math.max(0.05, Math.min(0.8, baseRatio));
    }
    
    return baseRatio;
  }

  /**
   * Extract textual content from various conversation entry types
   */
  private extractContentFromEntry(entry: ConversationEntry): string | null {
    try {
      if (isUserMessage(entry)) {
        if (typeof entry.message.content === 'string') {
          return entry.message.content;
        } else if (Array.isArray(entry.message.content)) {
          return entry.message.content
            .filter(c => isTextContent(c) || isToolResultContent(c))
            .map(c => {
              if (isTextContent(c)) return c.text;
              if (isToolResultContent(c)) {
                return typeof c.content === 'string' 
                  ? c.content 
                  : JSON.stringify(c.content);
              }
              return '';
            })
            .join(' ');
        }
      } else if (isAssistantMessage(entry)) {
        return entry.message.content
          .filter(c => isTextContent(c))
          .map(c => isTextContent(c) ? c.text : '')
          .join(' ');
      }
      return null;
    } catch (error) {
      console.error('Error extracting content from entry:', error);
      return null;
    }
  }

  /**
   * Detect content type based on content analysis and pattern matching
   */
  private detectContentType(content: string): ContentTypeDetection {
    const characteristics: string[] = [];
    let type: ContentTypeDetection['type'] = 'unknown';
    let confidence = 0;

    // Code detection patterns
    const codePatterns = [
      /\b(function|class|import|export|const|let|var)\b/g,
      /[{}();]/g,
      /\/\/.*$/gm,
      /\/\*[\s\S]*?\*\//g,
      /<[^>]+>/g, // HTML/XML tags
      /\b(def|if|for|while|return|print)\b/g // Python keywords
    ];

    // Log detection patterns
    const logPatterns = [
      /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, // Timestamps
      /\b(ERROR|WARN|INFO|DEBUG|TRACE)\b/g,
      /\b(Stack trace|Exception|at\s+[\w.]+\(\w+\.java:\d+\))/g,
      /\[\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\]/g
    ];

    // Document detection patterns
    const documentPatterns = [
      /^#+\s/gm, // Markdown headers
      /\*\*[^*]+\*\*/g, // Bold text
      /\[[^\]]+\]\([^)]+\)/g, // Markdown links
      /```[\s\S]*?```/g, // Code blocks
      /^[-*+]\s/gm // List items
    ];

    // Transcript detection patterns
    const transcriptPatterns = [
      /\b(user|assistant|system):\s/gi,
      /Q:\s.*?\nA:\s/g,
      /^>\s/gm, // Quoted text
      /\btool_use\b|\btool_result\b/g
    ];

    // Data structure patterns
    const dataPatterns = [
      /^\s*[{\[]/,
      /[}\]]\s*$/,
      /"[^"]*":\s*[^,}\]]+/g, // JSON key-value pairs
      /\b\d+\.\d+\b/g, // Decimal numbers
      /<\w+[^>]*>[\s\S]*?<\/\w+>/g // XML structures
    ];

    // Analyze patterns and build characteristics
    const codeMatches = this.countMatches(content, codePatterns);
    const logMatches = this.countMatches(content, logPatterns);
    const documentMatches = this.countMatches(content, documentPatterns);
    const transcriptMatches = this.countMatches(content, transcriptPatterns);
    const dataMatches = this.countMatches(content, dataPatterns);

    // Determine type based on highest scoring pattern category
    const scores = {
      code: codeMatches,
      logs: logMatches,
      documents: documentMatches,
      transcripts: transcriptMatches,
      data: dataMatches
    };

    const maxScore = Math.max(...Object.values(scores));
    const contentLength = content.length;
    
    if (maxScore > 0) {
      const topType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as ContentTypeDetection['type'];
      if (topType) {
        type = topType;
        confidence = Math.min(maxScore / (contentLength / 100), 1.0); // Normalize confidence
      }
    }

    // Add characteristics based on detected patterns
    if (codeMatches > 0) characteristics.push('code-like syntax');
    if (logMatches > 0) characteristics.push('timestamp patterns');
    if (documentMatches > 0) characteristics.push('markdown formatting');
    if (transcriptMatches > 0) characteristics.push('conversation structure');
    if (dataMatches > 0) characteristics.push('structured data');

    // Add size characteristics
    if (contentLength > 10000) characteristics.push('very large');
    else if (contentLength > 5000) characteristics.push('large');
    else if (contentLength > 2000) characteristics.push('medium');

    return {
      type,
      confidence,
      characteristics,
      sizeThreshold: this.contentTypeThresholds[type] || this.contentTypeThresholds.unknown
    };
  }

  /**
   * Count pattern matches across multiple regex patterns
   */
  private countMatches(content: string, patterns: RegExp[]): number {
    return patterns.reduce((total, pattern) => {
      const matches = content.match(pattern);
      return total + (matches ? matches.length : 0);
    }, 0);
  }

  /**
   * Determine condensation priority based on size, type, and reduction potential
   */
  private determinePriority(
    contentSize: number, 
    contentType: ContentTypeDetection, 
    estimatedReduction: number
  ): 'high' | 'medium' | 'low' {
    // High priority: Large content with good reduction potential
    if (contentSize > 5000 && estimatedReduction > 0.4) {
      return 'high';
    }
    
    // High priority: Log files (usually very compressible)
    if (contentType.type === 'logs' && contentSize > 2000) {
      return 'high';
    }
    
    // Medium priority: Moderate size with decent reduction potential
    if (contentSize > 2000 && estimatedReduction > 0.25) {
      return 'medium';
    }
    
    // Medium priority: Documents and transcripts (often good candidates)
    if ((contentType.type === 'documents' || contentType.type === 'transcripts') && contentSize > 1500) {
      return 'medium';
    }
    
    // Low priority: Everything else
    return 'low';
  }

  /**
   * Generate human-readable reasoning for the content detection decision
   */
  private generateReasoningForDetection(
    contentSize: number, 
    threshold: number, 
    contentType: ContentTypeDetection, 
    estimatedReduction: number
  ): string {
    const sizeStatus = contentSize > threshold ? 'exceeds' : 'below';
    const characteristics = contentType.characteristics.join(', ');
    
    return `Content size (${contentSize} chars) ${sizeStatus} ${contentType.type} threshold (${threshold} chars). ` +
           `Detected as ${contentType.type} with ${(contentType.confidence * 100).toFixed(1)}% confidence. ` +
           `Characteristics: ${characteristics}. ` +
           `Target ${(estimatedReduction * 100).toFixed(1)}% reduction based on type-specific ratios.`;
  }

  /**
   * Track metrics for a condensation operation
   */
  private updateMetrics(
    entry: ConversationEntry,
    analysis: ContentAnalysisResult,
    result: CondensationResult,
    processingTimeMs: number
  ): void {
    this.currentMetrics.totalEntriesProcessed++;
    this.currentMetrics.condensationAttempts++;
    
    if (result.success) {
      this.currentMetrics.successfulCondensations++;
      this.currentMetrics.entriesCondensed++;
      
      // Update content type specific metrics
      const contentType = analysis.contentType.type;
      if (!this.currentMetrics.byContentType[contentType]) {
        this.currentMetrics.byContentType[contentType] = {
          processed: 0,
          condensed: 0,
          targetRatio: this.ratioConfig.contentTypeRatios[contentType] || this.ratioConfig.targetCondensationRatio,
          actualRatio: 0,
          averageQuality: 0
        };
      }
      
      const typeMetrics = this.currentMetrics.byContentType[contentType];
      typeMetrics.processed++;
      typeMetrics.condensed++;
      
      // Update running averages
      const prevQualitySum = typeMetrics.averageQuality * (typeMetrics.condensed - 1);
      typeMetrics.averageQuality = (prevQualitySum + result.qualityScore) / typeMetrics.condensed;
      typeMetrics.actualRatio = (typeMetrics.actualRatio * (typeMetrics.condensed - 1) + result.actualReduction) / typeMetrics.condensed;
      
    } else {
      // Track failure reasons
      const reason = result.errors?.[0] || 'Unknown error';
      this.currentMetrics.failureReasons[reason] = (this.currentMetrics.failureReasons[reason] || 0) + 1;
    }
    
    // Update overall metrics
    this.currentMetrics.processingTimeMs += processingTimeMs;
    
    // Recalculate overall ratios and quality
    const totalReductions = Object.values(this.currentMetrics.byContentType)
      .reduce((sum, type) => sum + (type.actualRatio * type.condensed), 0);
    const totalCondensed = Object.values(this.currentMetrics.byContentType)
      .reduce((sum, type) => sum + type.condensed, 0);
    
    if (totalCondensed > 0) {
      this.currentMetrics.actualRatio = totalReductions / totalCondensed;
      this.currentMetrics.ratioAchievement = this.currentMetrics.actualRatio / this.currentMetrics.targetRatio;
      
      const totalQualitySum = Object.values(this.currentMetrics.byContentType)
        .reduce((sum, type) => sum + (type.averageQuality * type.condensed), 0);
      this.currentMetrics.averageQualityScore = totalQualitySum / totalCondensed;
    }
  }

  /**
   * Generate comprehensive metrics report
   */
  public generateMetricsReport(): string {
    const metrics = this.currentMetrics;
    
    let report = '\n=== CONDENSATION METRICS REPORT ===\n';
    report += `📊 Overall Performance:\n`;
    report += `  • Total entries processed: ${metrics.totalEntriesProcessed}\n`;
    report += `  • Entries condensed: ${metrics.entriesCondensed}\n`;
    report += `  • Success rate: ${((metrics.successfulCondensations / Math.max(metrics.condensationAttempts, 1)) * 100).toFixed(1)}%\n`;
    report += `  • Target condensation ratio: ${(metrics.targetRatio * 100).toFixed(1)}%\n`;
    report += `  • Actual condensation ratio: ${(metrics.actualRatio * 100).toFixed(1)}%\n`;
    report += `  • Ratio achievement: ${(metrics.ratioAchievement * 100).toFixed(1)}%\n`;
    report += `  • Average quality score: ${(metrics.averageQualityScore * 100).toFixed(1)}%\n`;
    report += `  • Total processing time: ${metrics.processingTimeMs}ms\n\n`;

    report += `📈 By Content Type:\n`;
    Object.entries(metrics.byContentType).forEach(([type, typeMetrics]) => {
      if (typeMetrics.processed > 0) {
        report += `  • ${type}:\n`;
        report += `    - Processed: ${typeMetrics.processed}\n`;
        report += `    - Condensed: ${typeMetrics.condensed}\n`;
        report += `    - Target ratio: ${(typeMetrics.targetRatio * 100).toFixed(1)}%\n`;
        report += `    - Actual ratio: ${(typeMetrics.actualRatio * 100).toFixed(1)}%\n`;
        report += `    - Quality score: ${(typeMetrics.averageQuality * 100).toFixed(1)}%\n`;
      }
    });

    if (Object.keys(metrics.failureReasons).length > 0) {
      report += `\n❌ Failure Analysis:\n`;
      Object.entries(metrics.failureReasons).forEach(([reason, count]) => {
        report += `  • ${reason}: ${count} occurrences\n`;
      });
    }

    report += '\n=== END METRICS REPORT ===\n';
    return report;
  }

  /**
   * Main condensation method with ratio controls and metrics tracking
   */
  async condenseWithRatioControls(entry: ConversationEntry): Promise<{
    condensedEntry: ConversationEntry;
    condensed: boolean;
    metrics: {
      actualReduction: number;
      qualityScore: number;
      processingTime: number;
      strategy: string;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const analysis = this.isLargeFileContent(entry);
      if (!analysis.isCondensable) {
        this.currentMetrics.totalEntriesProcessed++;
        return {
          condensedEntry: entry,
          condensed: false,
          metrics: {
            actualReduction: 0,
            qualityScore: 1.0,
            processingTime: Date.now() - startTime,
            strategy: 'no-condensation-needed'
          }
        };
      }
      
      console.log(`🎯 Condensing ${analysis.contentType.type} content with target ${(analysis.estimatedReduction * 100).toFixed(1)}% reduction`);

      // Try content-specific strategy first
      const strategyResult = await this.condenseWithStrategy(entry, analysis);
      
      let finalResult: CondensationResult;
      if (strategyResult.success && strategyResult.qualityScore >= this.ratioConfig.qualityThreshold) {
        finalResult = strategyResult;
      } else {
        console.log(`⚠️ Strategy condensation failed or quality too low (${(strategyResult.qualityScore * 100).toFixed(1)}%), falling back to Claude prompt`);
        
        // Fallback to Claude prompt-based condensation
        const promptResult = await this.condenseWithClaudePrompt(entry, analysis);
        finalResult = promptResult;
      }

      const processingTime = Date.now() - startTime;
      
      // Update metrics
      this.updateMetrics(entry, analysis, finalResult, processingTime);
      
      if (finalResult.success) {
        console.log(`✅ Successfully condensed ${analysis.contentType.type} content (${(finalResult.actualReduction * 100).toFixed(1)}% reduction, quality: ${(finalResult.qualityScore * 100).toFixed(1)}%)`);
        return {
          condensedEntry: JSON.parse(finalResult.condensedContent),
          condensed: true,
          metrics: {
            actualReduction: finalResult.actualReduction,
            qualityScore: finalResult.qualityScore,
            processingTime,
            strategy: finalResult.strategy
          }
        };
      } else {
        console.log(`❌ Condensation failed: ${finalResult.errors?.join(', ')}`);
        return {
          condensedEntry: entry,
          condensed: false,
          metrics: {
            actualReduction: 0,
            qualityScore: 0,
            processingTime,
            strategy: 'failed'
          }
        };
      }
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('Error in ratio-controlled condensation:', error);
      
      // Update failure metrics
      this.currentMetrics.totalEntriesProcessed++;
      this.currentMetrics.condensationAttempts++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.currentMetrics.failureReasons[errorMessage] = (this.currentMetrics.failureReasons[errorMessage] || 0) + 1;
      
      return {
        condensedEntry: entry,
        condensed: false,
        metrics: {
          actualReduction: 0,
          qualityScore: 0,
          processingTime,
          strategy: 'error'
        }
      };
    }
  }

  /**
   * Condense content using content-specific strategies
   */
  private async condenseWithStrategy(entry: ConversationEntry, analysis: ContentAnalysisResult): Promise<CondensationResult> {
    const startTime = Date.now();
    
    try {
      // Find appropriate strategy
      const strategy = this.condensationStrategies.find(s => s.canHandle(analysis.contentType.type));
      if (!strategy) {
        return {
          success: false,
          condensedContent: '',
          actualReduction: 0,
          qualityScore: 0,
          processingTime: Date.now() - startTime,
          strategy: 'none',
          errors: ['No strategy available for content type']
        };
      }

      // Extract content for condensation
      const originalContent = this.extractContentFromEntry(entry);
      if (!originalContent) {
        return {
          success: false,
          condensedContent: '',
          actualReduction: 0,
          qualityScore: 0,
          processingTime: Date.now() - startTime,
          strategy: strategy.constructor.name,
          errors: ['No content to condense']
        };
      }

      // Apply strategy
      const condensedContent = await strategy.condense(originalContent, analysis.estimatedReduction);
      
      // Validate quality
      const validation = strategy.validateQuality(originalContent, condensedContent);
      
      if (!validation.isValid) {
        return {
          success: false,
          condensedContent: '',
          actualReduction: 0,
          qualityScore: validation.qualityScore,
          processingTime: Date.now() - startTime,
          strategy: strategy.constructor.name,
          errors: validation.recommendations
        };
      }

      // Calculate actual reduction
      const actualReduction = 1 - (condensedContent.length / originalContent.length);
      
      // Apply condensed content back to entry structure
      const condensedEntry = this.applyCondensedContentToEntry(entry, condensedContent);
      
      return {
        success: true,
        condensedContent: JSON.stringify(condensedEntry),
        actualReduction,
        qualityScore: validation.qualityScore,
        processingTime: Date.now() - startTime,
        strategy: strategy.constructor.name
      };
      
    } catch (error) {
      return {
        success: false,
        condensedContent: '',
        actualReduction: 0,
        qualityScore: 0,
        processingTime: Date.now() - startTime,
        strategy: 'error',
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * Condense content using Claude Code with factual accuracy verification
   */
  private async condenseWithClaudePrompt(entry: ConversationEntry, analysis: ContentAnalysisResult): Promise<CondensationResult> {
    const startTime = Date.now();
    
    try {
      const prompt = this.createFactualAccuracyPrompt(entry, analysis);
      const response = await this.claudeService.runPrompt(prompt);
      
      const condensedEntry = JSON.parse(response);
      
      // Verify factual accuracy
      const accuracyResult = await this.verifyFactualAccuracy(entry, condensedEntry);
      
      if (!accuracyResult.isAccurate || accuracyResult.confidence < this.ratioConfig.qualityThreshold) {
        return {
          success: false,
          condensedContent: '',
          actualReduction: 0,
          qualityScore: accuracyResult.confidence,
          processingTime: Date.now() - startTime,
          strategy: 'claude-prompt-failed',
          errors: accuracyResult.issues
        };
      }

      // Calculate actual reduction
      const originalContent = this.extractContentFromEntry(entry) || '';
      const condensedContent = this.extractContentFromEntry(condensedEntry) || '';
      const actualReduction = originalContent.length > 0 ? 1 - (condensedContent.length / originalContent.length) : 0;
      
      return {
        success: true,
        condensedContent: JSON.stringify(condensedEntry),
        actualReduction,
        qualityScore: accuracyResult.confidence,
        processingTime: Date.now() - startTime,
        strategy: 'claude-prompt'
      };
      
    } catch (error) {
      return {
        success: false,
        condensedContent: '',
        actualReduction: 0,
        qualityScore: 0,
        processingTime: Date.now() - startTime,
        strategy: 'claude-prompt-error',
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * Apply condensed content back to the conversation entry structure
   */
  private applyCondensedContentToEntry(entry: ConversationEntry, condensedContent: string): ConversationEntry {
    try {
      if (isUserMessage(entry)) {
        if (typeof entry.message.content === 'string') {
          return {
            ...entry,
            message: {
              ...entry.message,
              content: condensedContent
            }
          };
        } else if (Array.isArray(entry.message.content)) {
          return {
            ...entry,
            message: {
              ...entry.message,
              content: entry.message.content.map(c => 
                isTextContent(c) ? { ...c, text: condensedContent } : c
              )
            }
          };
        }
      } else if (isAssistantMessage(entry)) {
        return {
          ...entry,
          message: {
            ...entry.message,
            content: entry.message.content.map(c => 
              isTextContent(c) ? { ...c, text: condensedContent } : c
            )
          }
        };
      }
      
      return entry; // Return unchanged if no applicable content found
    } catch (error) {
      console.error('Error applying condensed content to entry:', error);
      return entry;
    }
  }

  /**
   * Create factual accuracy preserving condensation prompt
   */
  private createFactualAccuracyPrompt(entry: ConversationEntry, analysis: ContentAnalysisResult): string {
    const targetReduction = (analysis.estimatedReduction * 100).toFixed(1);
    
    return `CONTENT CONDENSATION WITH ABSOLUTE FACTUAL ACCURACY

🚨 ABSOLUTE FACTUAL ACCURACY REQUIREMENTS:
- ZERO TOLERANCE for information fabrication or hallucination
- NEVER add, invent, or guess any information not present in the original
- NEVER modify numerical values, dates, names, or technical specifications
- Target ${targetReduction}% reduction through redundancy removal only
- Preserve ALL UUIDs, timestamps, and metadata exactly

CONTENT TYPE: ${analysis.contentType.type} (${(analysis.contentType.confidence * 100).toFixed(1)}% confidence)

CONTENT TO CONDENSE:
${JSON.stringify(entry, null, 2)}

Provide ONLY the condensed JSON with 100% factual accuracy.`;
  }

  /**
   * Verify factual accuracy between original and condensed content
   */
  private async verifyFactualAccuracy(original: ConversationEntry, condensed: ConversationEntry): Promise<{
    isAccurate: boolean;
    confidence: number;
    issues: string[];
  }> {
    try {
      const issues: string[] = [];

      // Check metadata preservation
      if (original.uuid !== condensed.uuid) {
        issues.push(`UUID mismatch: ${original.uuid} != ${condensed.uuid}`);
      }
      if (original.timestamp !== condensed.timestamp) {
        issues.push(`Timestamp mismatch`);
      }

      // Extract and compare content
      const originalText = this.extractContentFromEntry(original) || '';
      const condensedText = this.extractContentFromEntry(condensed) || '';
      
      // Check numerical preservation
      const originalNumbers = originalText.match(/\b\d+(\.\d+)?\b/g) || [];
      const condensedNumbers = condensedText.match(/\b\d+(\.\d+)?\b/g) || [];
      
      if (originalNumbers.length !== condensedNumbers.length) {
        issues.push(`Number count mismatch: ${originalNumbers.length} vs ${condensedNumbers.length}`);
      }

      const confidence = Math.max(0, 1 - (issues.length / 5)); // Scale confidence
      
      return {
        isAccurate: issues.length === 0,
        confidence,
        issues
      };

    } catch (error) {
      return {
        isAccurate: false,
        confidence: 0,
        issues: [`Verification error: ${error}`]
      };
    }
  }
}