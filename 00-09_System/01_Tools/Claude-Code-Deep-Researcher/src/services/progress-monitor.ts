import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';

// Progress monitoring interfaces
interface ProgressEvent {
  eventId: string;
  timestamp: string;
  operationId: string;
  stage: number;
  stageId: string;
  eventType: 'started' | 'progress' | 'completed' | 'failed' | 'warning';
  message: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  metadata: Record<string, any>;
}

interface StageProgress {
  stageNumber: number;
  stageId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  durationMs: number;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  events: ProgressEvent[];
  metadata: Record<string, any>;
}

interface OperationProgress {
  operationId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  totalDurationMs: number;
  overallProgress: {
    current: number;
    total: number;
    percentage: number;
  };
  stages: StageProgress[];
  realtimeMetrics: {
    tokensProcessed: number;
    entriesProcessed: number;
    memoryUsageMB: number;
    averageProcessingTimeMs: number;
  };
  errorCount: number;
  warningCount: number;
}

interface MonitoringOptions {
  enableRealtimeUpdates: boolean;
  updateIntervalMs: number;
  enableMemoryMonitoring: boolean;
  enablePerformanceMetrics: boolean;
  maxEventHistory: number;
}

/**
 * Progress Monitor for Claude Code instances in prebake orchestration
 * Provides real-time monitoring and reporting for long-running operations
 */
export class ProgressMonitor extends EventEmitter {
  private operations: Map<string, OperationProgress> = new Map();
  private options: MonitoringOptions;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(options: Partial<MonitoringOptions> = {}) {
    super();
    
    this.options = {
      enableRealtimeUpdates: true,
      updateIntervalMs: 1000, // 1 second updates
      enableMemoryMonitoring: true,
      enablePerformanceMetrics: true,
      maxEventHistory: 1000,
      ...options
    };

    if (this.options.enableRealtimeUpdates) {
      this.startRealtimeUpdates();
    }
  }

  /**
   * Start monitoring a new operation
   */
  startOperation(operationId: string, totalStages: number = 3): void {
    console.log(`📊 Starting progress monitoring for operation: ${operationId}`);
    
    const operation: OperationProgress = {
      operationId,
      status: 'running',
      startTime: new Date().toISOString(),
      totalDurationMs: 0,
      overallProgress: {
        current: 0,
        total: totalStages,
        percentage: 0
      },
      stages: [],
      realtimeMetrics: {
        tokensProcessed: 0,
        entriesProcessed: 0,
        memoryUsageMB: 0,
        averageProcessingTimeMs: 0
      },
      errorCount: 0,
      warningCount: 0
    };

    this.operations.set(operationId, operation);
    this.emit('operation-started', operation);
  }

  /**
   * Start monitoring a specific stage
   */
  startStage(
    operationId: string, 
    stageNumber: number, 
    stageId: string, 
    totalItems: number = 0,
    metadata: Record<string, any> = {}
  ): void {
    const operation = this.operations.get(operationId);
    if (!operation) {
      console.error(`❌ Operation ${operationId} not found for stage monitoring`);
      return;
    }

    console.log(`🔄 Starting Stage ${stageNumber} monitoring (${stageId})`);

    const stage: StageProgress = {
      stageNumber,
      stageId,
      status: 'running',
      startTime: new Date().toISOString(),
      durationMs: 0,
      progress: {
        current: 0,
        total: totalItems,
        percentage: 0
      },
      events: [],
      metadata
    };

    operation.stages.push(stage);
    
    const event = this.createProgressEvent(
      operationId,
      stageNumber,
      stageId,
      'started',
      `Stage ${stageNumber} started`,
      stage.progress,
      metadata
    );
    
    stage.events.push(event);
    this.emit('stage-started', stage, operation);
  }

  /**
   * Update progress for a specific stage
   */
  updateStageProgress(
    operationId: string,
    stageNumber: number,
    current: number,
    message?: string,
    metadata: Record<string, any> = {}
  ): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    const stage = operation.stages.find(s => s.stageNumber === stageNumber);
    if (!stage) return;

    // Update stage progress
    stage.progress.current = current;
    stage.progress.percentage = stage.progress.total > 0 
      ? (current / stage.progress.total) * 100 
      : 0;
    
    stage.durationMs = Date.now() - new Date(stage.startTime).getTime();

    // Create progress event
    const event = this.createProgressEvent(
      operationId,
      stageNumber,
      stage.stageId,
      'progress',
      message || `Processing ${current}/${stage.progress.total}`,
      stage.progress,
      metadata
    );

    this.addEventToStage(stage, event);

    // Update overall operation progress
    this.updateOperationProgress(operation);
    
    this.emit('stage-progress', stage, operation);
  }

  /**
   * Complete a stage
   */
  completeStage(
    operationId: string,
    stageNumber: number,
    finalCount: number,
    message?: string,
    metadata: Record<string, any> = {}
  ): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    const stage = operation.stages.find(s => s.stageNumber === stageNumber);
    if (!stage) return;

    console.log(`✅ Completing Stage ${stageNumber} monitoring`);

    // Update stage completion
    stage.status = 'completed';
    stage.endTime = new Date().toISOString();
    stage.progress.current = finalCount;
    stage.progress.percentage = 100;
    stage.durationMs = Date.now() - new Date(stage.startTime).getTime();

    const event = this.createProgressEvent(
      operationId,
      stageNumber,
      stage.stageId,
      'completed',
      message || `Stage ${stageNumber} completed: ${finalCount} items processed`,
      stage.progress,
      metadata
    );

    this.addEventToStage(stage, event);

    // Update overall operation progress
    this.updateOperationProgress(operation);
    
    this.emit('stage-completed', stage, operation);
  }

  /**
   * Mark a stage as failed
   */
  failStage(
    operationId: string,
    stageNumber: number,
    errorMessage: string,
    metadata: Record<string, any> = {}
  ): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    const stage = operation.stages.find(s => s.stageNumber === stageNumber);
    if (!stage) return;

    console.log(`❌ Failing Stage ${stageNumber} monitoring: ${errorMessage}`);

    // Update stage failure
    stage.status = 'failed';
    stage.endTime = new Date().toISOString();
    stage.durationMs = Date.now() - new Date(stage.startTime).getTime();

    const event = this.createProgressEvent(
      operationId,
      stageNumber,
      stage.stageId,
      'failed',
      `Stage ${stageNumber} failed: ${errorMessage}`,
      stage.progress,
      metadata
    );

    this.addEventToStage(stage, event);
    operation.errorCount++;

    // Update overall operation
    this.updateOperationProgress(operation);
    
    this.emit('stage-failed', stage, operation);
  }

  /**
   * Add a warning to a stage
   */
  addStageWarning(
    operationId: string,
    stageNumber: number,
    warningMessage: string,
    metadata: Record<string, any> = {}
  ): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    const stage = operation.stages.find(s => s.stageNumber === stageNumber);
    if (!stage) return;

    const event = this.createProgressEvent(
      operationId,
      stageNumber,
      stage.stageId,
      'warning',
      warningMessage,
      stage.progress,
      metadata
    );

    this.addEventToStage(stage, event);
    operation.warningCount++;

    this.emit('stage-warning', stage, operation);
  }

  /**
   * Complete an entire operation
   */
  completeOperation(operationId: string, finalMessage?: string): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    console.log(`🎉 Completing operation monitoring: ${operationId}`);

    operation.status = 'completed';
    operation.endTime = new Date().toISOString();
    operation.totalDurationMs = Date.now() - new Date(operation.startTime).getTime();
    operation.overallProgress.percentage = 100;

    this.emit('operation-completed', operation);
  }

  /**
   * Fail an entire operation
   */
  failOperation(operationId: string, errorMessage: string): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    console.log(`❌ Failing operation monitoring: ${operationId} - ${errorMessage}`);

    operation.status = 'failed';
    operation.endTime = new Date().toISOString();
    operation.totalDurationMs = Date.now() - new Date(operation.startTime).getTime();

    this.emit('operation-failed', operation);
  }

  /**
   * Cancel an operation
   */
  cancelOperation(operationId: string): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    console.log(`🛑 Cancelling operation monitoring: ${operationId}`);

    operation.status = 'cancelled';
    operation.endTime = new Date().toISOString();
    operation.totalDurationMs = Date.now() - new Date(operation.startTime).getTime();

    // Cancel any running stages
    operation.stages.forEach(stage => {
      if (stage.status === 'running') {
        stage.status = 'failed';
        stage.endTime = new Date().toISOString();
        stage.durationMs = Date.now() - new Date(stage.startTime).getTime();
      }
    });

    this.emit('operation-cancelled', operation);
  }

  /**
   * Update real-time metrics for an operation
   */
  updateRealtimeMetrics(
    operationId: string,
    metrics: Partial<OperationProgress['realtimeMetrics']>
  ): void {
    const operation = this.operations.get(operationId);
    if (!operation) return;

    Object.assign(operation.realtimeMetrics, metrics);
    this.emit('metrics-updated', operation);
  }

  /**
   * Get current progress for an operation
   */
  getOperationProgress(operationId: string): OperationProgress | null {
    return this.operations.get(operationId) || null;
  }

  /**
   * Get progress for a specific stage
   */
  getStageProgress(operationId: string, stageNumber: number): StageProgress | null {
    const operation = this.operations.get(operationId);
    if (!operation) return null;

    return operation.stages.find(s => s.stageNumber === stageNumber) || null;
  }

  /**
   * Get all active operations
   */
  getActiveOperations(): OperationProgress[] {
    return Array.from(this.operations.values()).filter(op => op.status === 'running');
  }

  /**
   * Generate progress report for an operation
   */
  generateProgressReport(operationId: string): string {
    const operation = this.operations.get(operationId);
    if (!operation) {
      return `Operation ${operationId} not found`;
    }

    let report = '\n=== PROGRESS MONITORING REPORT ===\n';
    report += `📊 Operation: ${operation.operationId}\n`;
    report += `📈 Status: ${operation.status}\n`;
    report += `⏱️ Duration: ${(operation.totalDurationMs / 1000).toFixed(1)}s\n`;
    report += `🎯 Overall Progress: ${operation.overallProgress.current}/${operation.overallProgress.total} (${operation.overallProgress.percentage.toFixed(1)}%)\n`;
    
    if (operation.errorCount > 0 || operation.warningCount > 0) {
      report += `⚠️ Issues: ${operation.errorCount} errors, ${operation.warningCount} warnings\n`;
    }

    report += '\n📋 Stage Progress:\n';
    operation.stages.forEach(stage => {
      const statusEmoji = {
        pending: '⏳',
        running: '🔄',
        completed: '✅',
        failed: '❌'
      }[stage.status];

      report += `  ${statusEmoji} Stage ${stage.stageNumber}: ${stage.progress.current}/${stage.progress.total} (${stage.progress.percentage.toFixed(1)}%) - ${(stage.durationMs / 1000).toFixed(1)}s\n`;
      
      // Show recent events
      const recentEvents = stage.events.slice(-3);
      recentEvents.forEach(event => {
        const eventEmoji = {
          started: '🚀',
          progress: '📊',
          completed: '✅',
          failed: '❌',
          warning: '⚠️'
        }[event.eventType];
        
        report += `    ${eventEmoji} ${event.message}\n`;
      });
    });

    if (this.options.enablePerformanceMetrics) {
      report += '\n📊 Real-time Metrics:\n';
      report += `  • Tokens processed: ${operation.realtimeMetrics.tokensProcessed.toLocaleString()}\n`;
      report += `  • Entries processed: ${operation.realtimeMetrics.entriesProcessed.toLocaleString()}\n`;
      report += `  • Memory usage: ${operation.realtimeMetrics.memoryUsageMB.toFixed(1)} MB\n`;
      report += `  • Avg processing time: ${operation.realtimeMetrics.averageProcessingTimeMs.toFixed(1)}ms\n`;
    }

    report += '\n=== END PROGRESS REPORT ===\n';
    return report;
  }

  /**
   * Clean up old operations to prevent memory leaks
   */
  cleanup(maxAge: number = 86400000): void { // 24 hours default
    const cutoff = Date.now() - maxAge;
    
    for (const [operationId, operation] of this.operations.entries()) {
      const operationTime = new Date(operation.startTime).getTime();
      
      if (operationTime < cutoff && operation.status !== 'running') {
        console.log(`🧹 Cleaning up old operation: ${operationId}`);
        this.operations.delete(operationId);
      }
    }
  }

  /**
   * Shutdown the progress monitor
   */
  shutdown(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Cancel all running operations
    for (const operation of this.operations.values()) {
      if (operation.status === 'running') {
        this.cancelOperation(operation.operationId);
      }
    }
    
    console.log('📊 Progress monitor shutdown complete');
  }

  /**
   * Private helper methods
   */

  private createProgressEvent(
    operationId: string,
    stage: number,
    stageId: string,
    eventType: ProgressEvent['eventType'],
    message: string,
    progress: ProgressEvent['progress'],
    metadata: Record<string, any>
  ): ProgressEvent {
    return {
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      operationId,
      stage,
      stageId,
      eventType,
      message,
      progress: { ...progress },
      metadata: { ...metadata }
    };
  }

  private addEventToStage(stage: StageProgress, event: ProgressEvent): void {
    stage.events.push(event);
    
    // Limit event history to prevent memory issues
    if (stage.events.length > this.options.maxEventHistory) {
      stage.events = stage.events.slice(-this.options.maxEventHistory);
    }
  }

  private updateOperationProgress(operation: OperationProgress): void {
    // Calculate overall progress based on completed stages
    const completedStages = operation.stages.filter(s => s.status === 'completed').length;
    operation.overallProgress.current = completedStages;
    operation.overallProgress.percentage = operation.overallProgress.total > 0
      ? (completedStages / operation.overallProgress.total) * 100
      : 0;

    operation.totalDurationMs = Date.now() - new Date(operation.startTime).getTime();

    // Check if all stages are complete
    if (completedStages === operation.overallProgress.total && operation.status === 'running') {
      this.completeOperation(operation.operationId);
    }

    // Check if any stage has failed
    const failedStages = operation.stages.filter(s => s.status === 'failed');
    if (failedStages.length > 0 && operation.status === 'running') {
      this.failOperation(operation.operationId, `${failedStages.length} stage(s) failed`);
    }
  }

  private startRealtimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      if (this.options.enableMemoryMonitoring) {
        this.updateMemoryMetrics();
      }
      
      // Emit realtime update event
      const activeOperations = this.getActiveOperations();
      if (activeOperations.length > 0) {
        this.emit('realtime-update', activeOperations);
      }
    }, this.options.updateIntervalMs);
  }

  private updateMemoryMetrics(): void {
    if (!this.options.enableMemoryMonitoring) return;

    try {
      const memUsage = process.memoryUsage();
      const memoryUsageMB = memUsage.heapUsed / 1024 / 1024;

      // Update memory metrics for all active operations
      for (const operation of this.getActiveOperations()) {
        operation.realtimeMetrics.memoryUsageMB = memoryUsageMB;
      }
    } catch (error) {
      console.error('Error updating memory metrics:', error);
    }
  }
}