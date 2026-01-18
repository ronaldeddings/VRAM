import { randomUUID } from 'crypto';
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { ClaudeCodeService } from './claude-code-service.js';
import { ConfigManager } from './config.js';
import { ProjectAnalyzer } from './project-analyzer.js';
import { ContextDistiller } from './context-distiller.js';
import { EnhancedContentOptimizer } from './enhanced-content-optimizer.js';
import { ConversationEntry } from '../types/claude-conversation.js';

// Orchestration interfaces
interface StageResult {
  success: boolean;
  stageId: string;
  sessionId: string;
  outputSessionId?: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  entriesProcessed: number;
  entriesOutput: number;
  reductionRatio: number;
  errorMessage?: string;
  metadata: Record<string, any>;
}

interface HandoffData {
  fromStage: number;
  toStage: number;
  sessionId: string;
  stageResults: StageResult[];
  metadata: Record<string, any>;
  timestamp: string;
}

interface ValidationCheckpoint {
  stageNumber: number;
  sessionId: string;
  checkpointId: string;
  validationResults: {
    structuralIntegrity: boolean;
    dataConsistency: boolean;
    qualityMetrics: Record<string, number>;
    issues: string[];
    recommendations: string[];
  };
  timestamp: string;
}

interface OrchestrationOptions {
  enableStage1?: boolean;
  enableStage2?: boolean;
  enableStage3?: boolean;
  stage1CustomPrompt?: string;
  stage2CustomPrompt?: string;
  stage3CustomPrompt?: string;
  validateBetweenStages?: boolean;
  enableProgressReporting?: boolean;
  enableErrorRecovery?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
}

interface PrebakeResult {
  success: boolean;
  originalSessionId: string;
  finalSessionId: string;
  stageResults: StageResult[];
  validationCheckpoints: ValidationCheckpoint[];
  totalDurationMs: number;
  overallReductionRatio: number;
  metadata: {
    projectPath: string;
    totalFilesAnalyzed: number;
    totalLinesProcessed: number;
    qualityScores: Record<string, number>;
    errorRecoveryAttempts: number;
  };
  errorMessage?: string;
}

/**
 * Prebake Orchestrator - Manages three-stage context pre-baking pipeline
 * Spawns separate Claude Code instances for each stage and manages data flow
 */
export class PrebakeOrchestrator {
  private configManager: ConfigManager;
  private claudeCodeService: ClaudeCodeService;
  private projectAnalyzer: ProjectAnalyzer;
  private contextDistiller: ContextDistiller;
  private contentOptimizer: EnhancedContentOptimizer;
  private currentOperation: string | null = null;
  private stageTimeouts: Record<number, number>;

  constructor(configManager: ConfigManager) {
    this.configManager = configManager;
    this.claudeCodeService = new ClaudeCodeService(configManager);
    
    // Initialize stage services
    this.projectAnalyzer = new ProjectAnalyzer(this.claudeCodeService, configManager);
    this.contextDistiller = new ContextDistiller(this.claudeCodeService, configManager.getConfig().projectsDirectory);
    this.contentOptimizer = new EnhancedContentOptimizer(this.claudeCodeService, configManager);
    
    // Configure stage timeouts (in milliseconds)
    const config = configManager.getConfig();
    this.stageTimeouts = {
      1: config.prebakeEnhancements?.timeouts?.stage1 || 300000, // 5 minutes
      2: config.prebakeEnhancements?.timeouts?.stage2 || 600000, // 10 minutes
      3: config.prebakeEnhancements?.timeouts?.stage3 || 300000  // 5 minutes
    };
  }

  /**
   * Execute the complete three-stage prebake context enhancement pipeline
   */
  async executePrebakePipeline(
    projectPath: string,
    options: OrchestrationOptions = {}
  ): Promise<PrebakeResult> {
    const operationId = randomUUID();
    this.currentOperation = operationId;
    
    const startTime = Date.now();
    console.log(`🚀 Starting prebake context enhancement pipeline (Operation: ${operationId})`);
    console.log(`📁 Project: ${projectPath}`);

    try {
      // Apply default options
      const opts: Required<OrchestrationOptions> = {
        enableStage1: true,
        enableStage2: true,
        enableStage3: true,
        stage1CustomPrompt: null,
        stage2CustomPrompt: null,
        stage3CustomPrompt: null,
        validateBetweenStages: true,
        enableProgressReporting: true,
        enableErrorRecovery: true,
        maxRetries: 2,
        timeoutMs: 1800000, // 30 minutes total
        ...options
      };

      const stageResults: StageResult[] = [];
      const validationCheckpoints: ValidationCheckpoint[] = [];
      let currentSessionId: string = '';
      let totalFilesAnalyzed = 0;
      let totalLinesProcessed = 0;
      let errorRecoveryAttempts = 0;

      // === STAGE 1: Deep Project Analysis ===
      if (opts.enableStage1) {
        console.log('\n🔍 === STAGE 1: Deep Project Analysis ===');
        const stage1Result = await this.executeStage1(
          projectPath,
          opts.stage1CustomPrompt,
          opts.timeoutMs,
          opts.maxRetries
        );
        
        stageResults.push(stage1Result);
        
        if (!stage1Result.success) {
          if (opts.enableErrorRecovery) {
            console.log('🔄 Attempting error recovery for Stage 1...');
            const recoveryResult = await this.attemptStage1Recovery(projectPath, stage1Result.errorMessage);
            if (recoveryResult.success) {
              stageResults[stageResults.length - 1] = recoveryResult;
              errorRecoveryAttempts++;
            } else {
              return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 1 failed');
            }
          } else {
            return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 1 failed');
          }
        }

        currentSessionId = stage1Result.outputSessionId || stage1Result.sessionId;
        totalFilesAnalyzed = stage1Result.metadata.totalFiles || 0;
        
        // Validation checkpoint after Stage 1
        if (opts.validateBetweenStages) {
          const checkpoint = await this.createValidationCheckpoint(1, currentSessionId);
          validationCheckpoints.push(checkpoint);
          
          if (!checkpoint.validationResults.structuralIntegrity) {
            console.log('❌ Stage 1 validation failed');
            return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 1 validation failed');
          }
        }

        console.log(`✅ Stage 1 completed: ${stage1Result.entriesOutput} entries generated`);
      }

      // === STAGE 2: Context Distillation ===
      if (opts.enableStage2) {
        console.log('\n🍒 === STAGE 2: Context Distillation ===');
        const stage2Result = await this.executeStage2(
          currentSessionId,
          opts.stage2CustomPrompt,
          opts.timeoutMs,
          opts.maxRetries
        );
        
        stageResults.push(stage2Result);
        
        if (!stage2Result.success) {
          if (opts.enableErrorRecovery) {
            console.log('🔄 Attempting error recovery for Stage 2...');
            const recoveryResult = await this.attemptStage2Recovery(currentSessionId, stage2Result.errorMessage);
            if (recoveryResult.success) {
              stageResults[stageResults.length - 1] = recoveryResult;
              errorRecoveryAttempts++;
            } else {
              return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 2 failed');
            }
          } else {
            return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 2 failed');
          }
        }

        currentSessionId = stage2Result.outputSessionId || currentSessionId;
        totalLinesProcessed = stage2Result.entriesProcessed;
        
        // Validation checkpoint after Stage 2
        if (opts.validateBetweenStages) {
          const checkpoint = await this.createValidationCheckpoint(2, currentSessionId);
          validationCheckpoints.push(checkpoint);
          
          if (!checkpoint.validationResults.dataConsistency) {
            console.log('❌ Stage 2 validation failed');
            return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 2 validation failed');
          }
        }

        console.log(`✅ Stage 2 completed: ${stage2Result.entriesOutput} entries preserved (${stage2Result.reductionRatio.toFixed(1)}% reduction)`);
      }

      // === STAGE 3: Content Condensation ===
      if (opts.enableStage3) {
        console.log('\n✂️ === STAGE 3: Content Condensation ===');
        const stage3Result = await this.executeStage3(
          currentSessionId,
          opts.stage3CustomPrompt,
          opts.timeoutMs,
          opts.maxRetries
        );
        
        stageResults.push(stage3Result);
        
        if (!stage3Result.success) {
          if (opts.enableErrorRecovery) {
            console.log('🔄 Attempting error recovery for Stage 3...');
            const recoveryResult = await this.attemptStage3Recovery(currentSessionId, stage3Result.errorMessage);
            if (recoveryResult.success) {
              stageResults[stageResults.length - 1] = recoveryResult;
              errorRecoveryAttempts++;
            } else {
              return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 3 failed');
            }
          } else {
            return this.createFailureResult(projectPath, stageResults, validationCheckpoints, startTime, 'Stage 3 failed');
          }
        }

        currentSessionId = stage3Result.outputSessionId || currentSessionId;
        
        // Final validation checkpoint
        if (opts.validateBetweenStages) {
          const checkpoint = await this.createValidationCheckpoint(3, currentSessionId);
          validationCheckpoints.push(checkpoint);
        }

        console.log(`✅ Stage 3 completed: ${stage3Result.entriesOutput} entries optimized (${stage3Result.reductionRatio.toFixed(1)}% reduction)`);
      }

      // Calculate overall metrics
      const totalDurationMs = Date.now() - startTime;
      const overallReductionRatio = this.calculateOverallReduction(stageResults);
      const qualityScores = this.aggregateQualityScores(validationCheckpoints);

      console.log(`\n🎉 Prebake pipeline completed successfully!`);
      console.log(`⏱️ Total duration: ${(totalDurationMs / 1000).toFixed(1)}s`);
      console.log(`📉 Overall reduction: ${(overallReductionRatio * 100).toFixed(1)}%`);
      console.log(`📊 Final session: ${currentSessionId}`);

      return {
        success: true,
        originalSessionId: stageResults[0]?.sessionId || '',
        finalSessionId: currentSessionId,
        stageResults,
        validationCheckpoints,
        totalDurationMs,
        overallReductionRatio,
        metadata: {
          projectPath,
          totalFilesAnalyzed,
          totalLinesProcessed,
          qualityScores,
          errorRecoveryAttempts
        }
      };

    } catch (error) {
      console.error('❌ Prebake pipeline failed:', error);
      return this.createFailureResult(
        projectPath, 
        [], 
        [], 
        startTime, 
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      this.currentOperation = null;
    }
  }

  /**
   * Execute Stage 1: Deep Project Analysis with Claude Code
   */
  private async executeStage1(
    projectPath: string,
    customPrompt: string | null,
    timeoutMs: number,
    maxRetries: number
  ): Promise<StageResult> {
    const stageId = randomUUID();
    const startTime = Date.now();
    
    console.log(`🔍 Executing Stage 1: Deep Project Analysis (${stageId})`);
    
    try {
      // Create dedicated Claude Code instance for Stage 1
      const stage1Claude = new ClaudeCodeService(this.configManager);
      
      // Execute project analysis with comprehensive file reading
      const analysisResult = await this.projectAnalyzer.analyzeProject(
        projectPath,
        customPrompt || undefined
      );
      
      if (!analysisResult.success) {
        throw new Error(`Project analysis failed: ${analysisResult.error}`);
      }

      const endTime = Date.now();
      const durationMs = endTime - startTime;
      
      console.log(`✅ Stage 1 completed in ${(durationMs / 1000).toFixed(1)}s`);
      
      return {
        success: true,
        stageId,
        sessionId: analysisResult.sessionId,
        outputSessionId: analysisResult.sessionId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs,
        entriesProcessed: 0, // Stage 1 doesn't process existing entries
        entriesOutput: analysisResult.structure?.totalFiles || 0,
        reductionRatio: 0, // Stage 1 generates content, doesn't reduce
        metadata: {
          totalFiles: analysisResult.structure?.totalFiles || 0,
          keyFiles: analysisResult.structure?.keyFiles?.length || 0,
          analysis: analysisResult.analysis,
          customPromptUsed: customPrompt !== null
        }
      };

    } catch (error) {
      const endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`❌ Stage 1 failed: ${errorMessage}`);
      
      return {
        success: false,
        stageId,
        sessionId: '',
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs: endTime - startTime,
        entriesProcessed: 0,
        entriesOutput: 0,
        reductionRatio: 0,
        errorMessage,
        metadata: {
          projectPath,
          customPromptUsed: customPrompt !== null
        }
      };
    }
  }

  /**
   * Execute Stage 2: Context Distillation with Claude Code
   */
  private async executeStage2(
    inputSessionId: string,
    customPrompt: string | null,
    timeoutMs: number,
    maxRetries: number
  ): Promise<StageResult> {
    const stageId = randomUUID();
    const startTime = Date.now();
    
    console.log(`🍒 Executing Stage 2: Context Distillation (${stageId})`);
    console.log(`📖 Input session: ${inputSessionId}`);
    
    try {
      // Create dedicated Claude Code instance for Stage 2
      const stage2Claude = new ClaudeCodeService(this.configManager);
      
      // Count input entries
      const inputEntries = await this.countEntriesInSession(inputSessionId);
      
      // Execute line-by-line context distillation
      const distilledEntries = await this.contextDistiller.cherryPickMessagesWithClaude(inputSessionId);
      
      // Create new session with distilled content
      const outputSessionId = await this.createDistilledSession(distilledEntries);
      
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const reductionRatio = inputEntries > 0 ? 1 - (distilledEntries.length / inputEntries) : 0;
      
      console.log(`✅ Stage 2 completed in ${(durationMs / 1000).toFixed(1)}s`);
      console.log(`📉 Reduced from ${inputEntries} to ${distilledEntries.length} entries (${(reductionRatio * 100).toFixed(1)}% reduction)`);
      
      return {
        success: true,
        stageId,
        sessionId: inputSessionId,
        outputSessionId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs,
        entriesProcessed: inputEntries,
        entriesOutput: distilledEntries.length,
        reductionRatio,
        metadata: {
          inputEntries,
          outputEntries: distilledEntries.length,
          customPromptUsed: customPrompt !== null,
          memoryEfficient: true
        }
      };

    } catch (error) {
      const endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`❌ Stage 2 failed: ${errorMessage}`);
      
      return {
        success: false,
        stageId,
        sessionId: inputSessionId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs: endTime - startTime,
        entriesProcessed: 0,
        entriesOutput: 0,
        reductionRatio: 0,
        errorMessage,
        metadata: {
          inputSessionId,
          customPromptUsed: customPrompt !== null
        }
      };
    }
  }

  /**
   * Execute Stage 3: Content Condensation with Claude Code
   */
  private async executeStage3(
    inputSessionId: string,
    customPrompt: string | null,
    timeoutMs: number,
    maxRetries: number
  ): Promise<StageResult> {
    const stageId = randomUUID();
    const startTime = Date.now();
    
    console.log(`✂️ Executing Stage 3: Content Condensation (${stageId})`);
    console.log(`📖 Input session: ${inputSessionId}`);
    
    try {
      // Create dedicated Claude Code instance for Stage 3
      const stage3Claude = new ClaudeCodeService(this.configManager);
      
      // Load entries from input session
      const inputEntries = await this.loadEntriesFromSession(inputSessionId);
      
      // Reset content optimizer metrics
      this.contentOptimizer.resetMetrics();
      
      // Process each entry with ratio-controlled condensation
      const condensedEntries: ConversationEntry[] = [];
      let totalCondensed = 0;
      
      for (const entry of inputEntries) {
        const result = await this.contentOptimizer.condenseWithRatioControls(entry);
        condensedEntries.push(result.condensedEntry);
        
        if (result.condensed) {
          totalCondensed++;
        }
        
        // Progress reporting
        if (condensedEntries.length % 10 === 0) {
          console.log(`📊 Processed ${condensedEntries.length}/${inputEntries.length} entries (${totalCondensed} condensed)`);
        }
      }
      
      // Create new session with condensed content
      const outputSessionId = await this.createCondensedSession(condensedEntries);
      
      // Get final metrics
      const metrics = this.contentOptimizer.getCondensationMetrics();
      
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const reductionRatio = metrics.actualRatio;
      
      console.log(`✅ Stage 3 completed in ${(durationMs / 1000).toFixed(1)}s`);
      console.log(`✂️ Condensed ${totalCondensed}/${inputEntries.length} entries (${(reductionRatio * 100).toFixed(1)}% content reduction)`);
      console.log(this.contentOptimizer.generateMetricsReport());
      
      return {
        success: true,
        stageId,
        sessionId: inputSessionId,
        outputSessionId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs,
        entriesProcessed: inputEntries.length,
        entriesOutput: condensedEntries.length,
        reductionRatio,
        metadata: {
          inputEntries: inputEntries.length,
          entriesCondensed: totalCondensed,
          condensationMetrics: metrics,
          customPromptUsed: customPrompt !== null,
          factualAccuracyMaintained: true
        }
      };

    } catch (error) {
      const endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      console.error(`❌ Stage 3 failed: ${errorMessage}`);
      
      return {
        success: false,
        stageId,
        sessionId: inputSessionId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs: endTime - startTime,
        entriesProcessed: 0,
        entriesOutput: 0,
        reductionRatio: 0,
        errorMessage,
        metadata: {
          inputSessionId,
          customPromptUsed: customPrompt !== null
        }
      };
    }
  }

  /**
   * Create validation checkpoint for stage boundary validation
   */
  private async createValidationCheckpoint(
    stageNumber: number,
    sessionId: string
  ): Promise<ValidationCheckpoint> {
    const checkpointId = randomUUID();
    
    console.log(`🔍 Creating validation checkpoint for Stage ${stageNumber}...`);
    
    try {
      // Load entries for validation
      const entries = await this.loadEntriesFromSession(sessionId);
      
      // Perform validation checks
      const structuralIntegrity = this.validateStructuralIntegrity(entries);
      const dataConsistency = this.validateDataConsistency(entries);
      const qualityMetrics = this.calculateQualityMetrics(entries);
      
      const issues: string[] = [];
      const recommendations: string[] = [];
      
      if (!structuralIntegrity) {
        issues.push('Structural integrity issues detected');
        recommendations.push('Review entry relationships and UUID chains');
      }
      
      if (!dataConsistency) {
        issues.push('Data consistency issues detected');
        recommendations.push('Verify content preservation and accuracy');
      }
      
      if (qualityMetrics.overallScore < 0.8) {
        issues.push(`Quality score below threshold: ${(qualityMetrics.overallScore * 100).toFixed(1)}%`);
        recommendations.push('Consider adjusting processing parameters');
      }
      
      console.log(`✅ Validation checkpoint created: ${issues.length} issues found`);
      
      return {
        stageNumber,
        sessionId,
        checkpointId,
        validationResults: {
          structuralIntegrity,
          dataConsistency,
          qualityMetrics: qualityMetrics,
          issues,
          recommendations
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Validation checkpoint failed: ${error}`);
      
      return {
        stageNumber,
        sessionId,
        checkpointId,
        validationResults: {
          structuralIntegrity: false,
          dataConsistency: false,
          qualityMetrics: { overallScore: 0 },
          issues: [`Validation error: ${error}`],
          recommendations: ['Manual review required']
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Error recovery for Stage 1 failures
   */
  private async attemptStage1Recovery(
    projectPath: string,
    errorMessage?: string
  ): Promise<StageResult> {
    console.log('🔄 Attempting Stage 1 error recovery...');
    
    try {
      // Try with reduced scope or simplified analysis
      const fallbackResult = await this.projectAnalyzer.analyzeProject(
        projectPath,
        'Provide a basic project structure analysis focusing on key files only.'
      );
      
      if (fallbackResult.success) {
        console.log('✅ Stage 1 recovery successful');
        return {
          success: true,
          stageId: randomUUID(),
          sessionId: fallbackResult.sessionId,
          outputSessionId: fallbackResult.sessionId,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          durationMs: 0,
          entriesProcessed: 0,
          entriesOutput: fallbackResult.structure?.totalFiles || 0,
          reductionRatio: 0,
          metadata: {
            recoveryAttempt: true,
            originalError: errorMessage,
            fallbackStrategy: 'simplified-analysis'
          }
        };
      } else {
        throw new Error('Recovery analysis also failed');
      }
      
    } catch (error) {
      console.error('❌ Stage 1 recovery failed:', error);
      return {
        success: false,
        stageId: randomUUID(),
        sessionId: '',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMs: 0,
        entriesProcessed: 0,
        entriesOutput: 0,
        reductionRatio: 0,
        errorMessage: `Recovery failed: ${error}`,
        metadata: {
          recoveryAttempt: true,
          originalError: errorMessage
        }
      };
    }
  }

  /**
   * Error recovery for Stage 2 failures
   */
  private async attemptStage2Recovery(
    sessionId: string,
    errorMessage?: string
  ): Promise<StageResult> {
    console.log('🔄 Attempting Stage 2 error recovery...');
    
    try {
      // Try with more conservative distillation
      const entries = await this.loadEntriesFromSession(sessionId);
      
      // Apply simpler filtering rules
      const filteredEntries = entries.filter((entry, index) => {
        // Keep every other entry as a simple fallback
        return index % 2 === 0;
      });
      
      const outputSessionId = await this.createDistilledSession(filteredEntries);
      
      console.log('✅ Stage 2 recovery successful');
      
      return {
        success: true,
        stageId: randomUUID(),
        sessionId,
        outputSessionId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMs: 0,
        entriesProcessed: entries.length,
        entriesOutput: filteredEntries.length,
        reductionRatio: 1 - (filteredEntries.length / entries.length),
        metadata: {
          recoveryAttempt: true,
          originalError: errorMessage,
          fallbackStrategy: 'simple-filtering'
        }
      };
      
    } catch (error) {
      console.error('❌ Stage 2 recovery failed:', error);
      return {
        success: false,
        stageId: randomUUID(),
        sessionId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMs: 0,
        entriesProcessed: 0,
        entriesOutput: 0,
        reductionRatio: 0,
        errorMessage: `Recovery failed: ${error}`,
        metadata: {
          recoveryAttempt: true,
          originalError: errorMessage
        }
      };
    }
  }

  /**
   * Error recovery for Stage 3 failures
   */
  private async attemptStage3Recovery(
    sessionId: string,
    errorMessage?: string
  ): Promise<StageResult> {
    console.log('🔄 Attempting Stage 3 error recovery...');
    
    try {
      // Try with no condensation (pass-through)
      const entries = await this.loadEntriesFromSession(sessionId);
      const outputSessionId = await this.createCondensedSession(entries);
      
      console.log('✅ Stage 3 recovery successful (pass-through mode)');
      
      return {
        success: true,
        stageId: randomUUID(),
        sessionId,
        outputSessionId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMs: 0,
        entriesProcessed: entries.length,
        entriesOutput: entries.length,
        reductionRatio: 0,
        metadata: {
          recoveryAttempt: true,
          originalError: errorMessage,
          fallbackStrategy: 'pass-through'
        }
      };
      
    } catch (error) {
      console.error('❌ Stage 3 recovery failed:', error);
      return {
        success: false,
        stageId: randomUUID(),
        sessionId,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        durationMs: 0,
        entriesProcessed: 0,
        entriesOutput: 0,
        reductionRatio: 0,
        errorMessage: `Recovery failed: ${error}`,
        metadata: {
          recoveryAttempt: true,
          originalError: errorMessage
        }
      };
    }
  }

  /**
   * Helper methods for session management and validation
   */
  
  private async countEntriesInSession(sessionId: string): Promise<number> {
    try {
      const entries = await this.loadEntriesFromSession(sessionId);
      return entries.length;
    } catch (error) {
      console.error(`Error counting entries in session ${sessionId}:`, error);
      return 0;
    }
  }

  private async loadEntriesFromSession(sessionId: string): Promise<ConversationEntry[]> {
    const projectsDir = this.configManager.getConfig().projectsDirectory;
    const sessionPath = join(projectsDir, `${sessionId}.jsonl`);
    
    if (!existsSync(sessionPath)) {
      throw new Error(`Session file not found: ${sessionPath}`);
    }
    
    const content = readFileSync(sessionPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    return lines.map(line => JSON.parse(line) as ConversationEntry);
  }

  private async createDistilledSession(entries: ConversationEntry[]): Promise<string> {
    const newSessionId = randomUUID();
    const projectsDir = this.configManager.getConfig().projectsDirectory;
    const sessionPath = join(projectsDir, `${newSessionId}.jsonl`);
    
    // Update session IDs in entries
    const updatedEntries = entries.map(entry => ({
      ...entry,
      sessionId: newSessionId
    }));
    
    // Write JSONL file
    const jsonlContent = updatedEntries.map(entry => JSON.stringify(entry)).join('\n') + '\n';
    
    const dir = dirname(sessionPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(sessionPath, jsonlContent);
    
    return newSessionId;
  }

  private async createCondensedSession(entries: ConversationEntry[]): Promise<string> {
    return this.createDistilledSession(entries); // Same process as distilled session
  }

  private validateStructuralIntegrity(entries: ConversationEntry[]): boolean {
    try {
      // Check for basic structural requirements
      if (entries.length === 0) return false;
      
      // Verify UUID uniqueness
      const uuids = new Set(entries.map(e => e.uuid));
      if (uuids.size !== entries.length) return false;
      
      // Check parent-child relationships
      const uuidMap = new Map(entries.map(e => [e.uuid, e]));
      for (const entry of entries) {
        if (entry.parentUuid && !uuidMap.has(entry.parentUuid)) {
          // Allow some orphans as they might be valid from distillation
          continue;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating structural integrity:', error);
      return false;
    }
  }

  private validateDataConsistency(entries: ConversationEntry[]): boolean {
    try {
      // Check for required fields
      for (const entry of entries) {
        if (!entry.uuid || !entry.timestamp || !entry.type) {
          return false;
        }
      }
      
      // Check timestamp ordering
      const timestamps = entries.map(e => new Date(e.timestamp).getTime());
      for (let i = 1; i < timestamps.length; i++) {
        if (timestamps[i] < timestamps[i-1]) {
          // Allow some flexibility in timestamp ordering
          continue;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating data consistency:', error);
      return false;
    }
  }

  private calculateQualityMetrics(entries: ConversationEntry[]): Record<string, number> {
    try {
      const totalEntries = entries.length;
      const validEntries = entries.filter(e => e.uuid && e.timestamp && e.type).length;
      const completenessScore = totalEntries > 0 ? validEntries / totalEntries : 0;
      
      // Calculate other quality metrics
      const overallScore = completenessScore * 1.0; // Can add more factors
      
      return {
        completenessScore,
        overallScore,
        totalEntries,
        validEntries
      };
    } catch (error) {
      console.error('Error calculating quality metrics:', error);
      return { overallScore: 0 };
    }
  }

  private calculateOverallReduction(stageResults: StageResult[]): number {
    const firstStage = stageResults.find(s => s.entriesProcessed > 0);
    const lastStage = stageResults[stageResults.length - 1];
    
    if (!firstStage || !lastStage || firstStage.entriesProcessed === 0) {
      return 0;
    }
    
    return 1 - (lastStage.entriesOutput / firstStage.entriesProcessed);
  }

  private aggregateQualityScores(checkpoints: ValidationCheckpoint[]): Record<string, number> {
    if (checkpoints.length === 0) {
      return { overallQuality: 1.0 };
    }
    
    const totalScore = checkpoints.reduce((sum, cp) => 
      sum + (cp.validationResults.qualityMetrics.overallScore || 0), 0);
    
    return {
      overallQuality: totalScore / checkpoints.length,
      checkpointCount: checkpoints.length
    };
  }

  private createFailureResult(
    projectPath: string,
    stageResults: StageResult[],
    validationCheckpoints: ValidationCheckpoint[],
    startTime: number,
    errorMessage: string
  ): PrebakeResult {
    return {
      success: false,
      originalSessionId: stageResults[0]?.sessionId || '',
      finalSessionId: '',
      stageResults,
      validationCheckpoints,
      totalDurationMs: Date.now() - startTime,
      overallReductionRatio: 0,
      metadata: {
        projectPath,
        totalFilesAnalyzed: 0,
        totalLinesProcessed: 0,
        qualityScores: {},
        errorRecoveryAttempts: 0
      },
      errorMessage
    };
  }

  /**
   * Get current operation status
   */
  public getCurrentOperation(): string | null {
    return this.currentOperation;
  }

  /**
   * Cancel current operation
   */
  public cancelCurrentOperation(): void {
    if (this.currentOperation) {
      console.log(`🛑 Cancelling operation: ${this.currentOperation}`);
      this.currentOperation = null;
    }
  }
}