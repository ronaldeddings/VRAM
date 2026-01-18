import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { PrebakeOrchestrator } from '../services/prebake-orchestrator';
import { ClaudeCodeService } from '../services/claude-code';
import { ConfigManager } from '../config/config-manager';
import { ProgressMonitor } from '../services/progress-monitor';

// Mock dependencies
const mockClaudeCodeService = {
  runPrompt: async (prompt: string) => ({
    success: true,
    sessionId: `session-${Date.now()}`,
    response: 'Mock analysis complete',
    usage: { tokens: 1000 }
  }),
  executeInSession: async (sessionId: string, prompt: string) => ({
    success: true,
    sessionId,
    response: 'Mock session execution complete',
    usage: { tokens: 500 }
  })
} as ClaudeCodeService;

const mockConfigManager = {
  getPrebakeConfig: () => ({
    stage1: {
      maxFilesPerBatch: 50,
      includeAllFiles: true,
      customPrompt: null
    },
    stage2: {
      maxLineRemovalRatio: 0.5,
      minLinesThreshold: 10,
      preserveEssentialLines: true
    },
    stage3: {
      targetCondensationRatio: 0.3,
      maxContentSize: 10000,
      maintainFactualAccuracy: true,
      contentTypeRatios: {
        code: 0.2,
        logs: 0.1,
        documents: 0.3,
        transcripts: 0.4
      }
    },
    skipStages: {
      skipStage1: false,
      skipStage2: false,
      skipStage3: false
    }
  })
} as ConfigManager;

describe('PrebakeOrchestrator - Multi-Stage Integration Tests', () => {
  let orchestrator: PrebakeOrchestrator;
  let progressMonitor: ProgressMonitor;
  let tempDir: string;
  let projectPath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'prebake-orchestrator-test-'));
    projectPath = join(tempDir, 'test-project');
    await fs.mkdir(projectPath, { recursive: true });
    
    progressMonitor = new ProgressMonitor();
    orchestrator = new PrebakeOrchestrator(mockClaudeCodeService, mockConfigManager, progressMonitor);
    
    // Create sample project structure
    await createSampleProject(projectPath);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Complete Three-Stage Processing Pipeline', () => {
    test('should execute all three stages in sequence successfully', async () => {
      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(3);
      
      // Verify each stage completed
      expect(result.stages[0].stage).toBe('stage1');
      expect(result.stages[0].success).toBe(true);
      expect(result.stages[0].sessionId).toBeDefined();
      
      expect(result.stages[1].stage).toBe('stage2');
      expect(result.stages[1].success).toBe(true);
      expect(result.stages[1].sessionId).toBeDefined();
      
      expect(result.stages[2].stage).toBe('stage3');
      expect(result.stages[2].success).toBe(true);
      expect(result.stages[2].sessionId).toBeDefined();
      
      // Verify session continuity
      expect(result.stages[1].sessionId).toBe(result.stages[0].sessionId);
      expect(result.stages[2].sessionId).toBe(result.stages[1].sessionId);
      
      // Verify metrics
      expect(result.metrics.totalDuration).toBeGreaterThan(0);
      expect(result.metrics.totalTokens).toBeGreaterThan(0);
      expect(result.metrics.stageMetrics).toHaveLength(3);
    });

    test('should handle custom prompts for each stage', async () => {
      const customOptions = {
        stage1CustomPrompt: 'Focus on security analysis',
        stage2CustomPrompt: 'Preserve security-related conversations',
        stage3CustomPrompt: 'Maintain security context in condensation'
      };

      const result = await orchestrator.executePrebakePipeline(projectPath, customOptions);

      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(3);
      
      // In a real implementation, we would verify the custom prompts were used
      // For now, verify the pipeline completed with custom options
      result.stages.forEach(stage => {
        expect(stage.success).toBe(true);
        expect(stage.duration).toBeGreaterThan(0);
      });
    });

    test('should respect stage skip configuration', async () => {
      // Test skipping Stage 2
      const skipStage2Config = {
        ...mockConfigManager.getPrebakeConfig(),
        skipStages: { skipStage1: false, skipStage2: true, skipStage3: false }
      };

      const mockConfigWithSkip = {
        getPrebakeConfig: () => skipStage2Config
      } as ConfigManager;

      const orchestratorWithSkip = new PrebakeOrchestrator(mockClaudeCodeService, mockConfigWithSkip, progressMonitor);
      
      const result = await orchestratorWithSkip.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(2); // Only Stage 1 and Stage 3
      expect(result.stages[0].stage).toBe('stage1');
      expect(result.stages[1].stage).toBe('stage3');
      
      // Verify no Stage 2 was executed
      const stage2Result = result.stages.find(s => s.stage === 'stage2');
      expect(stage2Result).toBeUndefined();
    });

    test('should handle timeout configuration', async () => {
      const timeoutOptions = {
        timeoutMs: 1000, // 1 second timeout for testing
        maxRetries: 1
      };

      // This test would verify timeout handling in a real implementation
      // For now, verify the options are accepted
      const result = await orchestrator.executePrebakePipeline(projectPath, timeoutOptions);
      
      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(3);
    });
  });

  describe('Data Handoff Between Stages', () => {
    test('should pass session ID from Stage 1 to Stage 2', async () => {
      let stage1SessionId: string;
      let stage2SessionId: string;

      // Mock Claude service that tracks session IDs
      const trackingClaudeService = {
        runPrompt: async (prompt: string) => {
          const sessionId = `session-${Date.now()}-${Math.random()}`;
          stage1SessionId = sessionId;
          return {
            success: true,
            sessionId,
            response: 'Stage 1 analysis complete',
            usage: { tokens: 1000 }
          };
        },
        executeInSession: async (sessionId: string, prompt: string) => {
          stage2SessionId = sessionId;
          return {
            success: true,
            sessionId,
            response: 'Stage 2 distillation complete',
            usage: { tokens: 500 }
          };
        }
      } as ClaudeCodeService;

      const trackingOrchestrator = new PrebakeOrchestrator(trackingClaudeService, mockConfigManager, progressMonitor);
      
      const result = await trackingOrchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(stage1SessionId).toBeDefined();
      expect(stage2SessionId).toBeDefined();
      expect(stage1SessionId).toBe(stage2SessionId);
    });

    test('should validate data consistency between stages', async () => {
      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      
      // Verify validation checkpoints passed
      result.stages.forEach((stage, index) => {
        expect(stage.success).toBe(true);
        expect(stage.validationPassed).toBe(true);
        
        if (index > 0) {
          // Verify handoff validation occurred
          expect(stage.handoffValidation).toBe(true);
        }
      });
    });

    test('should preserve context across stage boundaries', async () => {
      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      
      // Verify context preservation metrics
      expect(result.metrics.contextPreservation).toBeGreaterThan(0.9); // 90% context retention
      
      // Verify each stage maintained context
      result.stages.forEach(stage => {
        expect(stage.contextRetention).toBeGreaterThan(0.85); // 85% minimum per stage
      });
    });

    test('should handle large project data handoff efficiently', async () => {
      // Create larger project structure
      await createLargeProjectStructure(projectPath);

      const startTime = Date.now();
      const result = await orchestrator.executePrebakePipeline(projectPath);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(30000); // Should complete within 30 seconds
      
      // Verify efficient data handling
      expect(result.metrics.memoryEfficiency).toBeGreaterThan(0.8); // 80% memory efficiency
      expect(result.metrics.totalTokens).toBeLessThan(50000); // Reasonable token usage
    });
  });

  describe('Error Recovery and Retry Mechanisms', () => {
    test('should retry failed stages up to max retry limit', async () => {
      let attemptCount = 0;
      
      const flakyClaudeService = {
        runPrompt: async (prompt: string) => {
          attemptCount++;
          if (attemptCount <= 2) {
            throw new Error('Simulated failure');
          }
          return {
            success: true,
            sessionId: `session-${Date.now()}`,
            response: 'Success after retries',
            usage: { tokens: 1000 }
          };
        },
        executeInSession: async (sessionId: string, prompt: string) => ({
          success: true,
          sessionId,
          response: 'Session execution success',
          usage: { tokens: 500 }
        })
      } as ClaudeCodeService;

      const retryOrchestrator = new PrebakeOrchestrator(flakyClaudeService, mockConfigManager, progressMonitor);
      
      const result = await retryOrchestrator.executePrebakePipeline(projectPath, { maxRetries: 3 });

      expect(result.success).toBe(true);
      expect(attemptCount).toBe(3); // Should have retried twice
      expect(result.stages[0].retryAttempts).toBe(2);
    });

    test('should fail gracefully when max retries exceeded', async () => {
      const alwaysFailingClaudeService = {
        runPrompt: async (prompt: string) => {
          throw new Error('Persistent failure');
        },
        executeInSession: async (sessionId: string, prompt: string) => {
          throw new Error('Persistent failure');
        }
      } as ClaudeCodeService;

      const failingOrchestrator = new PrebakeOrchestrator(alwaysFailingClaudeService, mockConfigManager, progressMonitor);
      
      const result = await failingOrchestrator.executePrebakePipeline(projectPath, { maxRetries: 2 });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Max retries exceeded');
      expect(result.stages[0].retryAttempts).toBe(2);
    });

    test('should handle partial stage failures with recovery', async () => {
      let stage2FailureCount = 0;
      
      const partialFailureService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: `session-${Date.now()}`,
          response: 'Stage 1 success',
          usage: { tokens: 1000 }
        }),
        executeInSession: async (sessionId: string, prompt: string) => {
          if (prompt.includes('Stage 2') && stage2FailureCount === 0) {
            stage2FailureCount++;
            throw new Error('Stage 2 failure');
          }
          return {
            success: true,
            sessionId,
            response: 'Stage execution success',
            usage: { tokens: 500 }
          };
        }
      } as ClaudeCodeService;

      const partialFailureOrchestrator = new PrebakeOrchestrator(partialFailureService, mockConfigManager, progressMonitor);
      
      const result = await partialFailureOrchestrator.executePrebakePipeline(projectPath, { maxRetries: 2 });

      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(3);
      expect(result.stages[1].retryAttempts).toBe(1); // Stage 2 should have retried once
    });

    test('should implement exponential backoff for retries', async () => {
      let retryTimestamps: number[] = [];
      
      const timestampingClaudeService = {
        runPrompt: async (prompt: string) => {
          retryTimestamps.push(Date.now());
          if (retryTimestamps.length <= 2) {
            throw new Error('Retry failure');
          }
          return {
            success: true,
            sessionId: `session-${Date.now()}`,
            response: 'Success after backoff',
            usage: { tokens: 1000 }
          };
        },
        executeInSession: async (sessionId: string, prompt: string) => ({
          success: true,
          sessionId,
          response: 'Session success',
          usage: { tokens: 500 }
        })
      } as ClaudeCodeService;

      const backoffOrchestrator = new PrebakeOrchestrator(timestampingClaudeService, mockConfigManager, progressMonitor);
      
      const result = await backoffOrchestrator.executePrebakePipeline(projectPath, { maxRetries: 3 });

      expect(result.success).toBe(true);
      expect(retryTimestamps).toHaveLength(3);
      
      // Verify exponential backoff (each retry should take longer)
      if (retryTimestamps.length >= 3) {
        const firstRetryDelay = retryTimestamps[1] - retryTimestamps[0];
        const secondRetryDelay = retryTimestamps[2] - retryTimestamps[1];
        expect(secondRetryDelay).toBeGreaterThan(firstRetryDelay);
      }
    });

    test('should preserve partial results from successful stages', async () => {
      const stage3FailureService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: `session-${Date.now()}`,
          response: 'Stage 1 success',
          usage: { tokens: 1000 }
        }),
        executeInSession: async (sessionId: string, prompt: string) => {
          if (prompt.includes('Stage 3')) {
            throw new Error('Stage 3 persistent failure');
          }
          return {
            success: true,
            sessionId,
            response: 'Stage execution success',
            usage: { tokens: 500 }
          };
        }
      } as ClaudeCodeService;

      const stage3FailureOrchestrator = new PrebakeOrchestrator(stage3FailureService, mockConfigManager, progressMonitor);
      
      const result = await stage3FailureOrchestrator.executePrebakePipeline(projectPath, { maxRetries: 1 });

      expect(result.success).toBe(false);
      expect(result.stages).toHaveLength(2); // Stage 1 and 2 should be preserved
      expect(result.stages[0].success).toBe(true);
      expect(result.stages[1].success).toBe(true);
      expect(result.partialResults).toBe(true);
    });
  });

  describe('Session ID Consistency and Validation', () => {
    test('should maintain same session ID across all stages', async () => {
      const sessionTracker: string[] = [];
      
      const sessionTrackingService = {
        runPrompt: async (prompt: string) => {
          const sessionId = `tracked-session-${Date.now()}`;
          sessionTracker.push(sessionId);
          return {
            success: true,
            sessionId,
            response: 'Stage 1 complete',
            usage: { tokens: 1000 }
          };
        },
        executeInSession: async (sessionId: string, prompt: string) => {
          sessionTracker.push(sessionId);
          return {
            success: true,
            sessionId,
            response: 'Stage execution complete',
            usage: { tokens: 500 }
          };
        }
      } as ClaudeCodeService;

      const sessionConsistencyOrchestrator = new PrebakeOrchestrator(sessionTrackingService, mockConfigManager, progressMonitor);
      
      const result = await sessionConsistencyOrchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(sessionTracker).toHaveLength(3); // One per stage
      
      // Verify all stages used the same session ID
      const uniqueSessionIds = new Set(sessionTracker);
      expect(uniqueSessionIds.size).toBe(1);
    });

    test('should validate session continuity between stages', async () => {
      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      
      // Verify session validation passed
      expect(result.sessionValidation.continuityCheck).toBe(true);
      expect(result.sessionValidation.integrityCheck).toBe(true);
      
      // Verify no session breaks occurred
      expect(result.sessionValidation.sessionBreaks).toBe(0);
    });

    test('should handle session recovery after connection issues', async () => {
      let connectionIssueSimulated = false;
      
      const connectionIssueService = {
        runPrompt: async (prompt: string) => ({
          success: true,
          sessionId: 'stable-session-id',
          response: 'Stage 1 complete',
          usage: { tokens: 1000 }
        }),
        executeInSession: async (sessionId: string, prompt: string) => {
          if (!connectionIssueSimulated && prompt.includes('Stage 2')) {
            connectionIssueSimulated = true;
            throw new Error('Connection timeout');
          }
          return {
            success: true,
            sessionId,
            response: 'Stage execution recovered',
            usage: { tokens: 500 }
          };
        }
      } as ClaudeCodeService;

      const recoveryOrchestrator = new PrebakeOrchestrator(connectionIssueService, mockConfigManager, progressMonitor);
      
      const result = await recoveryOrchestrator.executePrebakePipeline(projectPath, { maxRetries: 2 });

      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(3);
      expect(result.stages[1].retryAttempts).toBe(1);
      
      // Verify session recovery maintained consistency
      const sessionIds = result.stages.map(s => s.sessionId);
      const uniqueIds = new Set(sessionIds);
      expect(uniqueIds.size).toBe(1);
    });
  });
});

// Helper functions to create test project structures
async function createSampleProject(projectPath: string): Promise<void> {
  // Create basic project structure
  await fs.mkdir(join(projectPath, 'src'), { recursive: true });
  await fs.mkdir(join(projectPath, 'tests'), { recursive: true });
  await fs.mkdir(join(projectPath, 'docs'), { recursive: true });

  // Create sample files
  await fs.writeFile(join(projectPath, 'package.json'), JSON.stringify({
    name: 'test-project',
    version: '1.0.0',
    dependencies: { 'lodash': '^4.17.21' }
  }, null, 2));

  await fs.writeFile(join(projectPath, 'src', 'index.ts'), `
export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}
`);

  await fs.writeFile(join(projectPath, 'src', 'utils.ts'), `
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
`);

  await fs.writeFile(join(projectPath, 'tests', 'index.test.ts'), `
import { hello } from '../src/index';

test('hello function', () => {
  expect(hello('World')).toBe('Hello, World!');
});
`);

  await fs.writeFile(join(projectPath, 'README.md'), `
# Test Project

This is a test project for the prebake orchestration system.
`);
}

async function createLargeProjectStructure(projectPath: string): Promise<void> {
  // Create larger project with more files and directories
  const directories = ['src', 'lib', 'components', 'services', 'utils', 'types', 'tests', 'docs'];
  
  for (const dir of directories) {
    await fs.mkdir(join(projectPath, dir), { recursive: true });
    
    // Create multiple files in each directory
    for (let i = 0; i < 5; i++) {
      const fileName = `${dir}-file-${i}.ts`;
      const content = `
// ${dir} file ${i}
export interface ${dir.charAt(0).toUpperCase() + dir.slice(1)}Interface${i} {
  id: string;
  name: string;
  value: number;
}

export class ${dir.charAt(0).toUpperCase() + dir.slice(1)}Class${i} {
  constructor(private config: ${dir.charAt(0).toUpperCase() + dir.slice(1)}Interface${i}) {}
  
  process(): string {
    return \`Processing \${this.config.name} with value \${this.config.value}\`;
  }
}
`;
      await fs.writeFile(join(projectPath, dir, fileName), content);
    }
  }

  // Create additional configuration files
  await fs.writeFile(join(projectPath, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      module: 'commonjs',
      strict: true,
      esModuleInterop: true
    },
    include: ['src/**/*', 'lib/**/*']
  }, null, 2));

  await fs.writeFile(join(projectPath, '.gitignore'), `
node_modules/
dist/
*.log
.env
`);
}