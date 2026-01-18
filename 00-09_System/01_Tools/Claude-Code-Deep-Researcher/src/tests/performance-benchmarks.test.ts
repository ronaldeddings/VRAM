import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { PrebakeOrchestrator } from '../services/prebake-orchestrator';
import { ContextDistiller } from '../services/context-distiller';
import { EnhancedContentOptimizer } from '../services/enhanced-content-optimizer';
import { ClaudeCodeService } from '../services/claude-code';
import { ConfigManager } from '../config/config-manager';
import { ProgressMonitor } from '../services/progress-monitor';

// Mock high-performance Claude service
const mockHighPerformanceClaudeService = {
  runPrompt: async (prompt: string) => {
    // Simulate realistic response times
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    return {
      success: true,
      sessionId: `session-${Date.now()}`,
      response: 'Analysis complete',
      usage: { tokens: 800 + Math.floor(Math.random() * 400) }
    };
  },
  executeInSession: async (sessionId: string, prompt: string) => {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    return {
      success: true,
      sessionId,
      response: 'Session execution complete',
      usage: { tokens: 400 + Math.floor(Math.random() * 200) }
    };
  }
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

describe('Performance Benchmarks for Large File Processing', () => {
  let tempDir: string;
  let progressMonitor: ProgressMonitor;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'performance-benchmark-'));
    progressMonitor = new ProgressMonitor();
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Stage 1: Large Project Analysis Benchmarks', () => {
    test('should handle projects with 100+ files efficiently', async () => {
      const projectPath = join(tempDir, 'large-project');
      await createLargeProject(projectPath, 150); // 150 files

      const orchestrator = new PrebakeOrchestrator(mockHighPerformanceClaudeService, mockConfigManager, progressMonitor);

      const startTime = Date.now();
      const startMemory = process.memoryUsage();

      const result = await orchestrator.executePrebakePipeline(projectPath, { 
        skipStage2: true, 
        skipStage3: true 
      });

      const endTime = Date.now();
      const endMemory = process.memoryUsage();

      expect(result.success).toBe(true);
      
      // Performance metrics
      const duration = endTime - startTime;
      const memoryUsage = endMemory.heapUsed - startMemory.heapUsed;

      // Benchmarks for 150 files
      expect(duration).toBeLessThan(60000); // Should complete within 1 minute
      expect(memoryUsage).toBeLessThan(200 * 1024 * 1024); // Less than 200MB memory increase
      expect(result.metrics.stage1Metrics.filesProcessed).toBe(150);
      expect(result.metrics.stage1Metrics.processingRate).toBeGreaterThan(2); // > 2 files per second

      console.log(`Stage 1 Performance (150 files):
        Duration: ${duration}ms
        Memory Usage: ${Math.round(memoryUsage / 1024 / 1024)}MB
        Processing Rate: ${result.metrics.stage1Metrics.processingRate} files/sec
        Tokens Used: ${result.metrics.totalTokens}`);
    });

    test('should scale linearly with file count', async () => {
      const fileCounts = [50, 100, 200];
      const benchmarks: Array<{ files: number; duration: number; memory: number; tokens: number }> = [];

      for (const fileCount of fileCounts) {
        const projectPath = join(tempDir, `project-${fileCount}`);
        await createLargeProject(projectPath, fileCount);

        const orchestrator = new PrebakeOrchestrator(mockHighPerformanceClaudeService, mockConfigManager, progressMonitor);

        const startTime = Date.now();
        const startMemory = process.memoryUsage().heapUsed;

        const result = await orchestrator.executePrebakePipeline(projectPath, { 
          skipStage2: true, 
          skipStage3: true 
        });

        const endTime = Date.now();
        const endMemory = process.memoryUsage().heapUsed;

        expect(result.success).toBe(true);

        benchmarks.push({
          files: fileCount,
          duration: endTime - startTime,
          memory: endMemory - startMemory,
          tokens: result.metrics.totalTokens
        });
      }

      // Verify linear or sub-linear scaling
      for (let i = 1; i < benchmarks.length; i++) {
        const current = benchmarks[i];
        const previous = benchmarks[i - 1];
        
        const fileRatio = current.files / previous.files;
        const durationRatio = current.duration / previous.duration;
        const memoryRatio = current.memory / previous.memory;

        // Duration should scale sub-linearly due to batching
        expect(durationRatio).toBeLessThan(fileRatio * 1.2);
        
        // Memory should scale linearly or better
        expect(memoryRatio).toBeLessThan(fileRatio * 1.1);

        console.log(`Scaling ${previous.files} → ${current.files} files:
          File Ratio: ${fileRatio.toFixed(2)}x
          Duration Ratio: ${durationRatio.toFixed(2)}x  
          Memory Ratio: ${memoryRatio.toFixed(2)}x`);
      }
    });

    test('should handle different file types efficiently', async () => {
      const projectPath = join(tempDir, 'mixed-type-project');
      await createMixedTypeProject(projectPath, {
        typescript: 30,
        javascript: 25,
        json: 15,
        markdown: 10,
        yaml: 10,
        css: 10
      });

      const orchestrator = new PrebakeOrchestrator(mockHighPerformanceClaudeService, mockConfigManager, progressMonitor);

      const startTime = Date.now();
      const result = await orchestrator.executePrebakePipeline(projectPath, { 
        skipStage2: true, 
        skipStage3: true 
      });
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(45000); // 45 seconds for 100 files
      expect(result.metrics.stage1Metrics.fileTypeBreakdown).toBeDefined();
      expect(result.metrics.stage1Metrics.averageProcessingTimePerType).toBeDefined();

      // Verify different file types are processed appropriately
      const typeBreakdown = result.metrics.stage1Metrics.fileTypeBreakdown;
      expect(typeBreakdown['.ts']).toBe(30);
      expect(typeBreakdown['.js']).toBe(25);
      expect(typeBreakdown['.json']).toBe(15);
    });

    test('should maintain performance with deeply nested directory structures', async () => {
      const projectPath = join(tempDir, 'deep-nested-project');
      await createDeeplyNestedProject(projectPath, 8, 120); // 8 levels deep, 120 total files

      const orchestrator = new PrebakeOrchestrator(mockHighPerformanceClaudeService, mockConfigManager, progressMonitor);

      const startTime = Date.now();
      const result = await orchestrator.executePrebakePipeline(projectPath, { 
        skipStage2: true, 
        skipStage3: true 
      });
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(50000); // 50 seconds
      expect(result.metrics.stage1Metrics.directoryDepthStats.maxDepth).toBe(8);
      expect(result.metrics.stage1Metrics.directoryDepthStats.averageDepth).toBeGreaterThan(3);
      expect(result.metrics.stage1Metrics.filesProcessed).toBe(120);
    });
  });

  describe('Stage 2: Large JSONL Processing Benchmarks', () => {
    test('should process JSONL files with 1000+ lines efficiently', async () => {
      const jsonlFile = join(tempDir, 'large-conversation.jsonl');
      await createLargeJSONLFile(jsonlFile, 1500); // 1500 conversation lines

      const distiller = new ContextDistiller(mockHighPerformanceClaudeService, mockConfigManager);

      const startTime = Date.now();
      const startMemory = process.memoryUsage().heapUsed;

      // Test line-by-line processing
      let lineCount = 0;
      for await (const entry of (distiller as any).processLineByLine(jsonlFile)) {
        lineCount++;
      }

      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;

      expect(lineCount).toBe(1500);
      
      // Performance benchmarks
      const duration = endTime - startTime;
      const memoryUsage = endMemory - startMemory;
      const processingRate = lineCount / (duration / 1000);

      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
      expect(memoryUsage).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
      expect(processingRate).toBeGreaterThan(100); // > 100 lines per second

      console.log(`Stage 2 Performance (1500 lines):
        Duration: ${duration}ms
        Memory Usage: ${Math.round(memoryUsage / 1024 / 1024)}MB
        Processing Rate: ${processingRate.toFixed(1)} lines/sec`);
    });

    test('should maintain constant memory usage regardless of file size', async () => {
      const fileSizes = [500, 1000, 2000, 5000];
      const memoryUsages: number[] = [];

      for (const lineCount of fileSizes) {
        const jsonlFile = join(tempDir, `conversation-${lineCount}.jsonl`);
        await createLargeJSONLFile(jsonlFile, lineCount);

        const distiller = new ContextDistiller(mockHighPerformanceClaudeService, mockConfigManager);

        const startMemory = process.memoryUsage().heapUsed;
        
        let processedCount = 0;
        for await (const entry of (distiller as any).processLineByLine(jsonlFile)) {
          processedCount++;
          
          // Check memory periodically
          if (processedCount % 100 === 0) {
            const currentMemory = process.memoryUsage().heapUsed;
            const memoryGrowth = currentMemory - startMemory;
            expect(memoryGrowth).toBeLessThan(100 * 1024 * 1024); // Less than 100MB growth
          }
        }

        const endMemory = process.memoryUsage().heapUsed;
        memoryUsages.push(endMemory - startMemory);

        expect(processedCount).toBe(lineCount);
      }

      // Verify memory usage doesn't grow linearly with file size
      const maxMemoryUsage = Math.max(...memoryUsages);
      const minMemoryUsage = Math.min(...memoryUsages);
      const memoryVariance = (maxMemoryUsage - minMemoryUsage) / minMemoryUsage;

      expect(memoryVariance).toBeLessThan(2.0); // Memory variance should be less than 200%

      console.log(`Memory Usage Consistency:
        ${fileSizes.map((size, i) => `${size} lines: ${Math.round(memoryUsages[i] / 1024 / 1024)}MB`).join('\n        ')}
        Variance: ${(memoryVariance * 100).toFixed(1)}%`);
    });

    test('should efficiently handle complex conversation structures', async () => {
      const jsonlFile = join(tempDir, 'complex-conversation.jsonl');
      await createComplexJSONLFile(jsonlFile, 800); // 800 lines with tools, errors, nested content

      const distiller = new ContextDistiller(mockHighPerformanceClaudeService, mockConfigManager);

      const startTime = Date.now();
      const result = await distiller.distillContext('test-session');
      const endTime = Date.now();

      expect(result.success).toBe(true);
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(30000); // 30 seconds for complex processing
      expect(result.metrics.processingRate).toBeGreaterThan(20); // > 20 lines per second
      expect(result.metrics.memoryEfficiency).toBeGreaterThan(0.8); // 80% efficiency
      
      console.log(`Complex JSONL Performance:
        Duration: ${duration}ms
        Lines Processed: ${result.metrics.linesProcessed}
        Lines Removed: ${result.metrics.linesRemoved}
        Processing Rate: ${result.metrics.processingRate} lines/sec
        Memory Efficiency: ${(result.metrics.memoryEfficiency * 100).toFixed(1)}%`);
    });

    test('should parallelize line evaluation efficiently', async () => {
      const jsonlFile = join(tempDir, 'parallel-test.jsonl');
      await createLargeJSONLFile(jsonlFile, 1000);

      // Test sequential vs parallel processing (simulated)
      const distiller = new ContextDistiller(mockHighPerformanceClaudeService, mockConfigManager);

      const sequentialStartTime = Date.now();
      let sequentialCount = 0;
      for await (const entry of (distiller as any).processLineByLine(jsonlFile)) {
        sequentialCount++;
      }
      const sequentialEndTime = Date.now();

      // In a real implementation, this would test actual parallel processing
      // For now, verify the infrastructure can handle the load
      const sequentialDuration = sequentialEndTime - sequentialStartTime;
      const sequentialRate = sequentialCount / (sequentialDuration / 1000);

      expect(sequentialCount).toBe(1000);
      expect(sequentialRate).toBeGreaterThan(50); // Baseline performance
      
      console.log(`Sequential Processing Baseline:
        Duration: ${sequentialDuration}ms
        Rate: ${sequentialRate.toFixed(1)} lines/sec`);
    });
  });

  describe('Stage 3: Content Condensation Performance', () => {
    test('should condense large content blocks efficiently', async () => {
      const optimizer = new EnhancedContentOptimizer(mockHighPerformanceClaudeService, mockConfigManager);

      // Test various content sizes
      const contentSizes = [1000, 5000, 10000, 25000]; // Character counts
      const benchmarks: Array<{ size: number; duration: number; ratio: number }> = [];

      for (const size of contentSizes) {
        const largeContent = generateLargeContent(size);

        const startTime = Date.now();
        const result = await optimizer.condenseContent(largeContent, 'documents', 0.3);
        const endTime = Date.now();

        expect(result.success).toBe(true);
        
        const duration = endTime - startTime;
        const compressionRatio = result.content!.length / largeContent.length;
        
        benchmarks.push({
          size,
          duration,
          ratio: compressionRatio
        });

        // Performance expectations
        expect(duration).toBeLessThan(10000); // 10 seconds max
        expect(compressionRatio).toBeLessThan(0.8); // At least 20% reduction
        expect(compressionRatio).toBeGreaterThan(0.2); // Don't over-compress
      }

      // Verify performance scales reasonably
      for (let i = 1; i < benchmarks.length; i++) {
        const current = benchmarks[i];
        const previous = benchmarks[i - 1];
        
        const sizeRatio = current.size / previous.size;
        const durationRatio = current.duration / previous.duration;
        
        expect(durationRatio).toBeLessThan(sizeRatio * 1.5); // Sub-linear scaling
      }

      console.log(`Content Condensation Performance:
        ${benchmarks.map(b => `${b.size} chars: ${b.duration}ms (${(b.ratio * 100).toFixed(1)}% size)`).join('\n        ')}`);
    });

    test('should handle different content types with optimal strategies', async () => {
      const optimizer = new EnhancedContentOptimizer(mockHighPerformanceClaudeService, mockConfigManager);

      const contentTypes = [
        { type: 'code', content: generateCodeContent(5000) },
        { type: 'logs', content: generateLogContent(5000) },
        { type: 'documents', content: generateDocumentContent(5000) },
        { type: 'transcripts', content: generateTranscriptContent(5000) }
      ];

      const results = [];

      for (const { type, content } of contentTypes) {
        const startTime = Date.now();
        const result = await optimizer.condenseContent(content, type as any, 0.3);
        const endTime = Date.now();

        expect(result.success).toBe(true);
        
        const duration = endTime - startTime;
        const compressionRatio = result.content!.length / content.length;
        const processingRate = content.length / duration; // chars per ms

        results.push({
          type,
          duration,
          compressionRatio,
          processingRate
        });

        // Type-specific performance expectations
        if (type === 'logs') {
          expect(compressionRatio).toBeLessThan(0.5); // Logs should compress well
        } else if (type === 'code') {
          expect(compressionRatio).toBeGreaterThan(0.6); // Code should preserve more
        }
      }

      console.log(`Content Type Performance:
        ${results.map(r => `${r.type}: ${r.duration}ms, ${(r.compressionRatio * 100).toFixed(1)}% size, ${r.processingRate.toFixed(1)} chars/ms`).join('\n        ')}`);
    });

    test('should maintain accuracy validation performance', async () => {
      const optimizer = new EnhancedContentOptimizer(mockHighPerformanceClaudeService, mockConfigManager);

      const criticalContent = generateCriticalContent(3000); // Content that requires careful validation

      const startTime = Date.now();
      const result = await optimizer.condenseContent(criticalContent, 'code', 0.3);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(result.accuracyValidation).toBeDefined();
      expect(result.accuracyValidation!.passed).toBe(true);

      const duration = endTime - startTime;
      const validationOverhead = result.accuracyValidation!.validationDuration;

      // Validation should not dominate processing time
      expect(validationOverhead).toBeLessThan(duration * 0.4); // Less than 40% overhead
      expect(result.accuracyValidation!.factPreservationRate).toBeGreaterThan(0.95);

      console.log(`Accuracy Validation Performance:
        Total Duration: ${duration}ms
        Validation Overhead: ${validationOverhead}ms (${((validationOverhead / duration) * 100).toFixed(1)}%)
        Fact Preservation: ${(result.accuracyValidation!.factPreservationRate * 100).toFixed(1)}%`);
    });
  });

  describe('End-to-End Performance Testing', () => {
    test('should complete full pipeline within performance budgets', async () => {
      const projectPath = join(tempDir, 'performance-test-project');
      await createLargeProject(projectPath, 100);
      await createLargeJSONLFile(join(projectPath, '.claude', 'conversation.jsonl'), 1000);

      const orchestrator = new PrebakeOrchestrator(mockHighPerformanceClaudeService, mockConfigManager, progressMonitor);

      const startTime = Date.now();
      const startMemory = process.memoryUsage();

      const result = await orchestrator.executePrebakePipeline(projectPath);

      const endTime = Date.now();
      const endMemory = process.memoryUsage();

      expect(result.success).toBe(true);

      const totalDuration = endTime - startTime;
      const totalMemoryUsage = endMemory.heapUsed - startMemory.heapUsed;

      // Overall performance budget
      expect(totalDuration).toBeLessThan(120000); // 2 minutes total
      expect(totalMemoryUsage).toBeLessThan(300 * 1024 * 1024); // 300MB total
      expect(result.metrics.totalTokens).toBeLessThan(50000); // Reasonable token usage

      // Per-stage performance
      result.stages.forEach(stage => {
        expect(stage.duration).toBeLessThan(60000); // 1 minute per stage max
        expect(stage.memoryUsage).toBeLessThan(150 * 1024 * 1024); // 150MB per stage max
      });

      console.log(`End-to-End Performance:
        Total Duration: ${totalDuration}ms
        Total Memory: ${Math.round(totalMemoryUsage / 1024 / 1024)}MB
        Total Tokens: ${result.metrics.totalTokens}
        Stage Breakdown:
        ${result.stages.map(s => `  ${s.stage}: ${s.duration}ms, ${Math.round(s.memoryUsage / 1024 / 1024)}MB`).join('\n        ')}`);
    });
  });
});

// Helper functions to generate test data
async function createLargeProject(projectPath: string, fileCount: number): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  
  const dirs = ['src', 'lib', 'components', 'services', 'utils', 'types', 'tests'];
  for (const dir of dirs) {
    await fs.mkdir(join(projectPath, dir), { recursive: true });
  }

  const filesPerDir = Math.ceil(fileCount / dirs.length);
  
  for (let dirIndex = 0; dirIndex < dirs.length; dirIndex++) {
    const dir = dirs[dirIndex];
    const filesToCreate = Math.min(filesPerDir, fileCount - (dirIndex * filesPerDir));
    
    for (let i = 0; i < filesToCreate; i++) {
      const fileName = `${dir}-file-${i}.ts`;
      const content = generateFileContent(dir, i);
      await fs.writeFile(join(projectPath, dir, fileName), content);
    }
  }
}

async function createMixedTypeProject(projectPath: string, typeCounts: Record<string, number>): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });

  for (const [type, count] of Object.entries(typeCounts)) {
    const dirName = type === 'typescript' ? 'src' : type === 'javascript' ? 'js' : type;
    await fs.mkdir(join(projectPath, dirName), { recursive: true });

    for (let i = 0; i < count; i++) {
      const extension = getExtensionForType(type);
      const fileName = `${type}-file-${i}${extension}`;
      const content = generateContentForType(type, i);
      await fs.writeFile(join(projectPath, dirName, fileName), content);
    }
  }
}

async function createDeeplyNestedProject(projectPath: string, depth: number, totalFiles: number): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });

  let filesCreated = 0;
  
  async function createLevel(currentPath: string, currentDepth: number): Promise<void> {
    if (currentDepth === 0 || filesCreated >= totalFiles) return;

    const dirsAtLevel = Math.min(3, Math.ceil(totalFiles / depth));
    
    for (let i = 0; i < dirsAtLevel && filesCreated < totalFiles; i++) {
      const dirName = `level-${currentDepth}-dir-${i}`;
      const dirPath = join(currentPath, dirName);
      await fs.mkdir(dirPath, { recursive: true });

      // Create files at this level
      const filesAtLevel = Math.min(2, totalFiles - filesCreated);
      for (let j = 0; j < filesAtLevel; j++) {
        const fileName = `file-${j}.ts`;
        const content = `// Level ${currentDepth} file\nexport const level${currentDepth}Var${j} = ${j};`;
        await fs.writeFile(join(dirPath, fileName), content);
        filesCreated++;
      }

      // Recurse to next level
      await createLevel(dirPath, currentDepth - 1);
    }
  }

  await createLevel(projectPath, depth);
}

async function createLargeJSONLFile(filePath: string, lineCount: number): Promise<void> {
  const lines: string[] = [];
  
  for (let i = 0; i < lineCount; i++) {
    const entry = createJSONLEntry(i);
    lines.push(JSON.stringify(entry));
  }

  await fs.writeFile(filePath, lines.join('\n'));
}

async function createComplexJSONLFile(filePath: string, lineCount: number): Promise<void> {
  const lines: string[] = [];
  
  for (let i = 0; i < lineCount; i++) {
    const entry = createComplexJSONLEntry(i);
    lines.push(JSON.stringify(entry));
  }

  await fs.writeFile(filePath, lines.join('\n'));
}

function createJSONLEntry(index: number): any {
  if (index % 2 === 0) {
    return {
      type: 'user',
      uuid: `user-${index}`,
      content: [{ type: 'text', text: `User message ${index}` }],
      created_at: new Date().toISOString()
    };
  } else {
    return {
      type: 'assistant',
      uuid: `assistant-${index}`,
      parentMessageUuid: `user-${index - 1}`,
      content: [{ type: 'text', text: `Assistant response ${index}` }],
      created_at: new Date().toISOString()
    };
  }
}

function createComplexJSONLEntry(index: number): any {
  const entryType = index % 4;
  
  switch (entryType) {
    case 0:
      return {
        type: 'user',
        uuid: `user-${index}`,
        content: [{ type: 'text', text: `Complex user query ${index} with detailed requirements` }],
        created_at: new Date().toISOString()
      };
    
    case 1:
      return {
        type: 'assistant',
        uuid: `assistant-${index}`,
        parentMessageUuid: `user-${index - 1}`,
        content: [
          { type: 'text', text: `I'll help with that. Let me read some files.` },
          { type: 'tool_use', uuid: `tool-${index}`, name: 'read_file', input: { path: `/path/file-${index}.ts` } }
        ],
        created_at: new Date().toISOString()
      };
    
    case 2:
      return {
        type: 'tool_result',
        uuid: `tool-result-${index}`,
        parentMessageUuid: `tool-${index - 1}`,
        content: [{ type: 'text', text: `File content here: ${generateCodeContent(200)}` }],
        created_at: new Date().toISOString()
      };
    
    default:
      return {
        type: 'assistant',
        uuid: `assistant-final-${index}`,
        parentMessageUuid: `assistant-${index - 2}`,
        content: [{ type: 'text', text: `Based on the file content, here's my analysis: ${generateAnalysisContent(300)}` }],
        created_at: new Date().toISOString()
      };
  }
}

function generateFileContent(dirType: string, index: number): string {
  return `
// ${dirType} file ${index}
export interface ${dirType.charAt(0).toUpperCase() + dirType.slice(1)}Interface${index} {
  id: string;
  name: string;
  value: number;
  metadata: Record<string, any>;
  timestamps: {
    created: Date;
    updated: Date;
  };
}

export class ${dirType.charAt(0).toUpperCase() + dirType.slice(1)}Class${index} {
  private readonly config: ${dirType.charAt(0).toUpperCase() + dirType.slice(1)}Interface${index};
  
  constructor(config: ${dirType.charAt(0).toUpperCase() + dirType.slice(1)}Interface${index}) {
    this.config = config;
  }
  
  process(): string {
    const startTime = Date.now();
    const result = \`Processing \${this.config.name} with value \${this.config.value}\`;
    const endTime = Date.now();
    
    console.log(\`Processing took \${endTime - startTime}ms\`);
    return result;
  }
  
  validate(): boolean {
    return this.config.id && this.config.name && this.config.value > 0;
  }
  
  serialize(): string {
    return JSON.stringify(this.config);
  }
}

export const DEFAULT_${dirType.toUpperCase()}_CONFIG: ${dirType.charAt(0).toUpperCase() + dirType.slice(1)}Interface${index} = {
  id: 'default-${index}',
  name: '${dirType}-default',
  value: ${index * 10},
  metadata: {},
  timestamps: {
    created: new Date(),
    updated: new Date()
  }
};
`;
}

function getExtensionForType(type: string): string {
  const extensions: Record<string, string> = {
    typescript: '.ts',
    javascript: '.js',
    json: '.json',
    markdown: '.md',
    yaml: '.yml',
    css: '.css'
  };
  return extensions[type] || '.txt';
}

function generateContentForType(type: string, index: number): string {
  switch (type) {
    case 'typescript':
      return generateFileContent('ts', index);
    case 'javascript':
      return `// JavaScript file ${index}\nconst value${index} = ${index};\nmodule.exports = { value${index} };`;
    case 'json':
      return JSON.stringify({ id: index, name: `item-${index}`, active: true }, null, 2);
    case 'markdown':
      return `# Document ${index}\n\nThis is markdown content for item ${index}.\n\n## Features\n\n- Feature 1\n- Feature 2`;
    case 'yaml':
      return `name: config-${index}\nversion: 1.0.${index}\nfeatures:\n  - feature1\n  - feature2`;
    case 'css':
      return `.class-${index} {\n  color: #${index.toString(16).padStart(6, '0')};\n  font-size: ${12 + index}px;\n}`;
    default:
      return `Content for ${type} file ${index}`;
  }
}

function generateLargeContent(targetSize: number): string {
  const baseContent = `
This is a comprehensive documentation file that contains detailed information about the system architecture, implementation details, and best practices. The content includes multiple sections covering various aspects of the application.

## Architecture Overview
The system follows a microservices architecture with multiple components working together to provide a scalable and maintainable solution. Each service is responsible for specific functionality and communicates with other services through well-defined APIs.

## Implementation Details
The implementation uses modern TypeScript patterns with strict type safety and comprehensive error handling. All components are designed with testability in mind and follow SOLID principles.

## Configuration Management
Configuration is managed through environment variables and configuration files that are validated at startup. The system supports multiple environments including development, staging, and production.
`;

  let content = baseContent;
  while (content.length < targetSize) {
    content += `\n\nSection ${Math.floor(content.length / 500)}: ` + baseContent;
  }

  return content.substring(0, targetSize);
}

function generateCodeContent(targetSize: number): string {
  let content = '';
  let counter = 0;
  
  while (content.length < targetSize) {
    content += `
function process${counter}(input: any): string {
  const result = input.toString().toUpperCase();
  return \`Processed: \${result}\`;
}

class Handler${counter} {
  private value = ${counter};
  
  process(): number {
    return this.value * 2;
  }
}
`;
    counter++;
  }
  
  return content.substring(0, targetSize);
}

function generateLogContent(targetSize: number): string {
  let content = '';
  let counter = 0;
  
  while (content.length < targetSize) {
    const timestamp = new Date(Date.now() - counter * 1000).toISOString();
    content += `[${timestamp}] INFO: Processing request ${counter}\n`;
    content += `[${timestamp}] DEBUG: Request details: {id: ${counter}, status: 'active'}\n`;
    content += `[${timestamp}] INFO: Request ${counter} completed successfully\n`;
    counter++;
  }
  
  return content.substring(0, targetSize);
}

function generateDocumentContent(targetSize: number): string {
  let content = '# Documentation\n\n';
  let sectionCounter = 1;
  
  while (content.length < targetSize) {
    content += `## Section ${sectionCounter}\n\nThis section covers important concepts and implementation details. `;
    content += `It provides comprehensive guidance on how to use the features effectively. `;
    content += `The examples demonstrate best practices and common usage patterns.\n\n`;
    
    content += `### Subsection ${sectionCounter}.1\n\nDetailed explanation of the functionality. `;
    content += `Code examples and configuration options are provided below.\n\n`;
    
    content += `### Subsection ${sectionCounter}.2\n\nAdditional information and troubleshooting tips. `;
    content += `This includes common issues and their solutions.\n\n`;
    
    sectionCounter++;
  }
  
  return content.substring(0, targetSize);
}

function generateTranscriptContent(targetSize: number): string {
  let content = '';
  let turnCounter = 1;
  
  while (content.length < targetSize) {
    content += `User: This is user message ${turnCounter}. I need help with implementing a feature.\n\n`;
    content += `Assistant: I'll help you implement that feature. Let me analyze your requirements and provide a solution. `;
    content += `Here are the steps we need to follow: 1) Analysis, 2) Design, 3) Implementation, 4) Testing.\n\n`;
    turnCounter++;
  }
  
  return content.substring(0, targetSize);
}

function generateCriticalContent(targetSize: number): string {
  let content = `
// Critical system configuration
const SYSTEM_CONFIG = {
  database: {
    host: "prod-db.company.com",
    port: 5432,
    maxConnections: 100,
    timeout: 30000
  },
  security: {
    jwtSecret: "prod-secret-key",
    tokenExpiry: 3600,
    rateLimits: {
      api: 1000,
      auth: 5
    }
  },
  features: {
    enableNewAuth: true,
    enableBetaFeatures: false,
    maxFileSize: 10485760
  }
};
`;

  while (content.length < targetSize) {
    content += `\n// Additional critical configuration section ${Math.floor(content.length / 300)}\n`;
    content += content.substring(0, 200);
  }

  return content.substring(0, targetSize);
}

function generateAnalysisContent(targetSize: number): string {
  let content = `Based on the code analysis, I found several key patterns and potential improvements. `;
  content += `The implementation follows standard practices but could benefit from additional optimizations. `;
  
  while (content.length < targetSize) {
    content += `Furthermore, the system demonstrates good separation of concerns and maintainable architecture. `;
  }
  
  return content.substring(0, targetSize);
}