/**
 * Performance benchmarks for Claude Code conversation analyzer.
 * Tests parsing speed, memory usage, and scalability with large files.
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { join } from 'path';
import { JSONLParser } from '../src/services/jsonl-parser.ts';
import { ConversationBuilder } from '../src/services/conversation-builder.ts';
import { StepAnalyzer } from '../src/services/step-analyzer.ts';
import { ConversationValidator } from '../src/validators/index.ts';
import type { ConversationEntry } from '../src/types/claude-conversation.ts';

describe('Performance Benchmarks', () => {
  let testDataDir: string;
  let smallFile: string;
  let mediumFile: string;
  let largeFile: string;
  
  beforeAll(async () => {
    testDataDir = join(import.meta.dir, 'performance-fixtures');
    
    // Create test files
    const mkdirResult = await Bun.spawn(['mkdir', '-p', testDataDir]);
    await mkdirResult.exited;
    
    smallFile = join(testDataDir, 'small-conversation.jsonl');
    mediumFile = join(testDataDir, 'medium-conversation.jsonl');
    largeFile = join(testDataDir, 'large-conversation.jsonl');
    
    // Generate test data
    await generateTestFile(smallFile, 100);     // ~50KB
    await generateTestFile(mediumFile, 1000);   // ~500KB
    await generateTestFile(largeFile, 10000);   // ~5MB
    
    console.log('📊 Performance test files generated:');
    console.log(`   Small: ${(Bun.file(smallFile).size / 1024).toFixed(1)}KB`);
    console.log(`   Medium: ${(Bun.file(mediumFile).size / 1024).toFixed(1)}KB`);
    console.log(`   Large: ${(Bun.file(largeFile).size / 1024 / 1024).toFixed(1)}MB`);
  });
  
  afterAll(async () => {
    // Clean up test files
    try {
      await Bun.spawn(['rm', '-rf', testDataDir]);
    } catch (error) {
      console.warn('Failed to clean up performance test files:', error);
    }
  });
  
  describe('Parsing Performance', () => {
    test('should parse small files quickly (<100ms)', async () => {
      const parser = new JSONLParser();
      const startTime = performance.now();
      
      const entries: ConversationEntry[] = [];
      for await (const entry of parser.parseFile(smallFile)) {
        entries.push(entry);
      }
      
      const duration = performance.now() - startTime;
      
      expect(entries.length).toBe(100);
      expect(duration).toBeLessThan(100);
      
      console.log(`✅ Small file (100 entries): ${duration.toFixed(1)}ms`);
    });
    
    test('should parse medium files efficiently (<500ms)', async () => {
      const parser = new JSONLParser();
      const startTime = performance.now();
      
      const entries: ConversationEntry[] = [];
      for await (const entry of parser.parseFile(mediumFile)) {
        entries.push(entry);
      }
      
      const duration = performance.now() - startTime;
      
      expect(entries.length).toBe(1000);
      expect(duration).toBeLessThan(500);
      
      console.log(`✅ Medium file (1,000 entries): ${duration.toFixed(1)}ms`);
    });
    
    test('should parse large files within reasonable time (<5s)', async () => {
      const parser = new JSONLParser();
      const startTime = performance.now();
      
      let entryCount = 0;
      for await (const entry of parser.parseFile(largeFile)) {
        entryCount++;
      }
      
      const duration = performance.now() - startTime;
      
      expect(entryCount).toBe(10000);
      expect(duration).toBeLessThan(5000);
      
      console.log(`✅ Large file (10,000 entries): ${duration.toFixed(1)}ms`);
    });
    
    test('should demonstrate streaming efficiency', async () => {
      const parser = new JSONLParser();
      const startTime = performance.now();
      const initialMemory = process.memoryUsage().heapUsed;
      
      let entryCount = 0;
      let maxMemory = initialMemory;
      
      for await (const entry of parser.parseFile(largeFile)) {
        entryCount++;
        
        // Check memory usage every 1000 entries
        if (entryCount % 1000 === 0) {
          const currentMemory = process.memoryUsage().heapUsed;
          maxMemory = Math.max(maxMemory, currentMemory);
        }
        
        // Stop early for memory test
        if (entryCount >= 5000) break;
      }
      
      const duration = performance.now() - startTime;
      const memoryIncrease = maxMemory - initialMemory;
      
      expect(entryCount).toBe(5000);
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // Less than 100MB increase
      
      console.log(`✅ Streaming 5,000 entries: ${duration.toFixed(1)}ms, memory: +${(memoryIncrease / 1024 / 1024).toFixed(1)}MB`);
    });
  });
  
  describe('Analysis Performance', () => {
    test('should build conversation trees efficiently', async () => {
      const parser = new JSONLParser();
      const builder = new ConversationBuilder();
      
      const entries = await parser.parseFileToArray(mediumFile);
      
      const startTime = performance.now();
      const tree = builder.buildConversationTree(entries);
      const duration = performance.now() - startTime;
      
      expect(tree.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(200);
      
      console.log(`✅ Tree building (1,000 entries): ${duration.toFixed(1)}ms`);
    });
    
    test('should extract action sequences quickly', async () => {
      const parser = new JSONLParser();
      const builder = new ConversationBuilder();
      
      const entries = await parser.parseFileToArray(mediumFile);
      
      const startTime = performance.now();
      const sequence = builder.extractActionSequence(entries);
      const duration = performance.now() - startTime;
      
      expect(sequence.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(100);
      
      console.log(`✅ Action sequence (1,000 entries): ${duration.toFixed(1)}ms`);
    });
    
    test('should perform comprehensive analysis within limits', async () => {
      const parser = new JSONLParser();
      const analyzer = new StepAnalyzer();
      
      const entries = await parser.parseFileToArray(mediumFile);
      
      const startTime = performance.now();
      const analysis = await analyzer.analyzeConversation(entries);
      const duration = performance.now() - startTime;
      
      expect(analysis.sessionId).toBeDefined();
      expect(analysis.summary.totalEntries).toBe(1000);
      expect(duration).toBeLessThan(300);
      
      console.log(`✅ Full analysis (1,000 entries): ${duration.toFixed(1)}ms`);
    });
  });
  
  describe('Validation Performance', () => {
    test('should validate conversations efficiently', async () => {
      const parser = new JSONLParser();
      const validator = new ConversationValidator();
      
      const entries = await parser.parseFileToArray(mediumFile);
      
      const startTime = performance.now();
      const report = await validator.validateConversation(entries);
      const duration = performance.now() - startTime;
      
      expect(report.summary.totalEntries).toBe(1000);
      expect(duration).toBeLessThan(500);
      
      console.log(`✅ Full validation (1,000 entries): ${duration.toFixed(1)}ms`);
    });
    
    test('should perform quick validation very fast', async () => {
      const parser = new JSONLParser();
      const validator = new ConversationValidator();
      
      const entries = await parser.parseFileToArray(mediumFile);
      
      const startTime = performance.now();
      const result = validator.quickValidate(entries);
      const duration = performance.now() - startTime;
      
      expect(result.entryCount).toBe(1000);
      expect(duration).toBeLessThan(50);
      
      console.log(`✅ Quick validation (1,000 entries): ${duration.toFixed(1)}ms`);
    });
  });
  
  describe('Memory Usage', () => {
    test('should maintain reasonable memory usage during parsing', async () => {
      const parser = new JSONLParser();
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Parse large file in chunks
      let entryCount = 0;
      let maxMemoryUsage = initialMemory;
      
      for await (const entry of parser.parseFile(largeFile)) {
        entryCount++;
        
        if (entryCount % 1000 === 0) {
          const currentMemory = process.memoryUsage().heapUsed;
          maxMemoryUsage = Math.max(maxMemoryUsage, currentMemory);
          
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }
        }
        
        if (entryCount >= 5000) break;
      }
      
      const memoryIncrease = maxMemoryUsage - initialMemory;
      const memoryPerEntry = memoryIncrease / entryCount;
      
      expect(memoryPerEntry).toBeLessThan(10 * 1024); // Less than 10KB per entry
      
      console.log(`✅ Memory usage: ${(memoryIncrease / 1024 / 1024).toFixed(1)}MB for ${entryCount} entries`);
      console.log(`   Per entry: ${(memoryPerEntry / 1024).toFixed(1)}KB`);
    });
    
    test('should handle batch processing without memory leaks', async () => {
      const parser = new JSONLParser();
      const builder = new ConversationBuilder();
      
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Process multiple small batches
      for (let batch = 0; batch < 10; batch++) {
        const entries = await parser.parseFileToArray(smallFile);
        const tree = builder.buildConversationTree(entries);
        const sequence = builder.extractActionSequence(entries);
        
        // Clear references
        entries.length = 0;
        
        if (global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Should not increase memory significantly after processing multiple batches
      expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024); // Less than 20MB increase
      
      console.log(`✅ Batch processing memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(1)}MB`);
    });
  });
  
  describe('Scalability Tests', () => {
    test('should demonstrate linear parsing performance', async () => {
      const parser = new JSONLParser();
      const fileSizes = [100, 500, 1000];
      const results: Array<{ size: number; time: number; rate: number }> = [];
      
      for (const size of fileSizes) {
        const testFile = join(testDataDir, `scale-test-${size}.jsonl`);
        await generateTestFile(testFile, size);
        
        const startTime = performance.now();
        let entryCount = 0;
        
        for await (const entry of parser.parseFile(testFile)) {
          entryCount++;
        }
        
        const duration = performance.now() - startTime;
        const rate = entryCount / (duration / 1000); // entries per second
        
        results.push({ size, time: duration, rate });
        
        console.log(`📊 ${size} entries: ${duration.toFixed(1)}ms (${rate.toFixed(0)} entries/sec)`);
      }
      
      // Performance should scale roughly linearly
      const rateVariation = Math.max(...results.map(r => r.rate)) / Math.min(...results.map(r => r.rate));
      expect(rateVariation).toBeLessThan(4); // Should not vary by more than 4x
    });
    
    test('should handle concurrent parsing', async () => {
      const parser = new JSONLParser();
      
      const startTime = performance.now();
      
      // Parse multiple files concurrently
      const promises = [
        parser.parseFileToArray(smallFile),
        parser.parseFileToArray(smallFile),
        parser.parseFileToArray(smallFile)
      ];
      
      const results = await Promise.all(promises);
      const duration = performance.now() - startTime;
      
      expect(results.length).toBe(3);
      expect(results.every(r => r.length === 100)).toBe(true);
      expect(duration).toBeLessThan(300); // Should be faster than sequential
      
      console.log(`✅ Concurrent parsing (3x100 entries): ${duration.toFixed(1)}ms`);
    });
  });
  
  describe('Performance Regression Tests', () => {
    test('should meet performance targets', async () => {
      const targets = {
        parseRate: 2000,      // entries per second
        memoryPerEntry: 5,    // KB per entry
        validationTime: 500,  // ms for 1000 entries
        analysisTime: 300     // ms for 1000 entries
      };
      
      const parser = new JSONLParser();
      const validator = new ConversationValidator();
      const analyzer = new StepAnalyzer();
      
      // Test parsing rate
      const parseStart = performance.now();
      const entries = await parser.parseFileToArray(mediumFile);
      const parseDuration = performance.now() - parseStart;
      const parseRate = entries.length / (parseDuration / 1000);
      
      // Test validation time
      const validationStart = performance.now();
      await validator.validateConversation(entries);
      const validationTime = performance.now() - validationStart;
      
      // Test analysis time
      const analysisStart = performance.now();
      await analyzer.analyzeConversation(entries);
      const analysisTime = performance.now() - analysisStart;
      
      // Check targets
      expect(parseRate).toBeGreaterThan(targets.parseRate);
      expect(validationTime).toBeLessThan(targets.validationTime);
      expect(analysisTime).toBeLessThan(targets.analysisTime);
      
      console.log('🎯 Performance Targets:');
      console.log(`   Parse rate: ${parseRate.toFixed(0)} entries/sec (target: ${targets.parseRate})`);
      console.log(`   Validation: ${validationTime.toFixed(1)}ms (target: <${targets.validationTime}ms)`);
      console.log(`   Analysis: ${analysisTime.toFixed(1)}ms (target: <${targets.analysisTime}ms)`);
    });
  });
});

// Test data generator
async function generateTestFile(filePath: string, entryCount: number): Promise<void> {
  const baseEntry = {
    uuid: 'test-uuid',
    timestamp: new Date().toISOString(),
    sessionId: 'test-session',
    parentUuid: null,
    isSidechain: false,
    userType: 'external',
    cwd: '/test',
    version: '1.0.0',
    gitBranch: 'main'
  };
  
  const entries = [];
  
  for (let i = 0; i < entryCount; i++) {
    const isUser = i % 2 === 0;
    
    if (isUser) {
      entries.push({
        ...baseEntry,
        type: 'user',
        uuid: `user-${i}`,
        timestamp: new Date(Date.now() + i * 1000).toISOString(),
        parentUuid: i > 0 ? `assistant-${i - 1}` : null,
        message: {
          role: 'user',
          content: `User message ${i} with some content to make it realistic. This simulates a typical conversation entry with reasonable length and structure.`
        }
      });
    } else {
      entries.push({
        ...baseEntry,
        type: 'assistant',
        uuid: `assistant-${i}`,
        timestamp: new Date(Date.now() + i * 1000).toISOString(),
        parentUuid: `user-${i - 1}`,
        message: {
          id: `msg-${i}`,
          type: 'message',
          role: 'assistant',
          model: 'claude-3-sonnet',
          content: [
            {
              type: 'text',
              text: `Assistant response ${i} with detailed content to simulate real conversation patterns. This includes explanations, code examples, and helpful information.`
            },
            ...(i % 5 === 0 ? [{
              type: 'tool_use',
              id: `tool-${i}`,
              name: 'Read',
              input: {
                file_path: `/test/file-${i}.txt`
              }
            }] : [])
          ],
          stop_reason: i % 5 === 0 ? 'tool_use' : 'stop_sequence',
          stop_sequence: null,
          usage: {
            input_tokens: 100 + (i * 10),
            output_tokens: 50 + (i * 5),
            cache_creation_input_tokens: 0,
            cache_read_input_tokens: 0,
            cache_creation: {
              ephemeral_5m_input_tokens: 0,
              ephemeral_1h_input_tokens: 0
            },
            service_tier: 'standard'
          }
        }
      });
    }
  }
  
  const content = entries.map(entry => JSON.stringify(entry)).join('\n');
  await Bun.write(filePath, content);
}