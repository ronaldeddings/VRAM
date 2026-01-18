/**
 * Unit tests for JSONLParser service.
 * Tests parsing functionality, validation, and error handling.
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { join } from 'path';
import { JSONLParser } from '../src/services/jsonl-parser.ts';
import type { ConversationEntry } from '../src/types/claude-conversation.ts';

describe('JSONLParser', () => {
  let parser: JSONLParser;
  let testDataDir: string;
  
  beforeAll(async () => {
    parser = new JSONLParser();
    testDataDir = join(import.meta.dir, 'fixtures');
    
    // Create test data directory if it doesn't exist
    await Bun.write(join(testDataDir, 'valid-conversation.jsonl'), createValidTestData());
    await Bun.write(join(testDataDir, 'invalid-conversation.jsonl'), createInvalidTestData());
    await Bun.write(join(testDataDir, 'empty-conversation.jsonl'), '');
    await Bun.write(join(testDataDir, 'large-conversation.jsonl'), createLargeTestData());
  });
  
  afterAll(async () => {
    // Clean up test files
    try {
      await Bun.spawn(['rm', '-rf', testDataDir]);
    } catch (error) {
      console.warn('Failed to clean up test files:', error);
    }
  });
  
  describe('parseFile', () => {
    test('should parse valid JSONL file successfully', async () => {
      const filePath = join(testDataDir, 'valid-conversation.jsonl');
      const entries: ConversationEntry[] = [];
      
      for await (const entry of parser.parseFile(filePath)) {
        entries.push(entry);
      }
      
      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0].type).toBe('system');
      expect(entries[0].uuid).toBeDefined();
      expect(entries[0].timestamp).toBeDefined();
    });
    
    test('should handle malformed JSONL entries gracefully', async () => {
      const filePath = join(testDataDir, 'invalid-conversation.jsonl');
      const entries: ConversationEntry[] = [];
      
      // Should not throw, but collect valid entries
      for await (const entry of parser.parseFile(filePath)) {
        entries.push(entry);
      }
      
      // Should get at least one valid entry despite malformed ones
      expect(entries.length).toBeGreaterThan(0);
    });
    
    test('should handle empty file', async () => {
      const filePath = join(testDataDir, 'empty-conversation.jsonl');
      const entries: ConversationEntry[] = [];
      
      for await (const entry of parser.parseFile(filePath)) {
        entries.push(entry);
      }
      
      expect(entries.length).toBe(0);
    });
    
    test('should handle non-existent file', async () => {
      const filePath = join(testDataDir, 'non-existent.jsonl');
      
      try {
        for await (const entry of parser.parseFile(filePath)) {
          // Should not reach here
        }
        expect(true).toBe(false); // Should have thrown
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toContain('File not found');
      }
    });
  });
  
  describe('parseFileToArray', () => {
    test('should parse entire file to array', async () => {
      const filePath = join(testDataDir, 'valid-conversation.jsonl');
      const entries = await parser.parseFileToArray(filePath);
      
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0].type).toBe('system');
    });
  });
  
  describe('extractMetadata', () => {
    test('should extract metadata from valid file', async () => {
      const filePath = join(testDataDir, 'valid-conversation.jsonl');
      const metadata = await parser.extractMetadata(filePath);
      
      expect(metadata.sessionId).toBeDefined();
      expect(metadata.filePath).toBe(filePath);
      expect(metadata.size).toBeGreaterThan(0);
      expect(metadata.lastModified).toBeInstanceOf(Date);
      expect(metadata.entryCount).toBeGreaterThan(0);
      expect(Array.isArray(metadata.toolsUsed)).toBe(true);
    });
    
    test('should handle file with no entries', async () => {
      const filePath = join(testDataDir, 'empty-conversation.jsonl');
      const metadata = await parser.extractMetadata(filePath);
      
      expect(metadata.entryCount).toBe(0);
      expect(metadata.toolsUsed).toEqual([]);
      expect(metadata.completedSuccessfully).toBe(false);
    });
  });
  
  describe('countEntries', () => {
    test('should count entries correctly', async () => {
      const filePath = join(testDataDir, 'valid-conversation.jsonl');
      const count = await parser.countEntries(filePath);
      
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
    
    test('should return 0 for empty file', async () => {
      const filePath = join(testDataDir, 'empty-conversation.jsonl');
      const count = await parser.countEntries(filePath);
      
      expect(count).toBe(0);
    });
  });
  
  describe('validation', () => {
    test('should validate required fields', async () => {
      const invalidEntry = JSON.stringify({ type: 'user' }); // Missing required fields
      const tempFile = join(testDataDir, 'temp-invalid.jsonl');
      
      await Bun.write(tempFile, invalidEntry);
      
      const entries: ConversationEntry[] = [];
      try {
        for await (const entry of parser.parseFile(tempFile)) {
          entries.push(entry);
        }
      } catch (error) {
        // Expected to have validation errors
      }
      
      // Should handle validation gracefully
      expect(entries.length).toBe(0);
    });
    
    test('should validate entry types', async () => {
      const entries = [
        { type: 'user', uuid: 'test-1', timestamp: new Date().toISOString(), sessionId: 'test', parentUuid: null, isSidechain: false, userType: 'external', cwd: '/test', version: '1.0.0', gitBranch: 'main', message: { role: 'user', content: 'test' } },
        { type: 'assistant', uuid: 'test-2', timestamp: new Date().toISOString(), sessionId: 'test', parentUuid: 'test-1', isSidechain: false, userType: 'external', cwd: '/test', version: '1.0.0', gitBranch: 'main', message: { id: 'msg-1', type: 'message', role: 'assistant', model: 'claude-3', content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 100, output_tokens: 50, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 }, service_tier: 'standard' } } },
        { type: 'system', uuid: 'test-3', timestamp: new Date().toISOString(), sessionId: 'test', parentUuid: null, isSidechain: false, userType: 'external', cwd: '/test', version: '1.0.0', gitBranch: 'main', subtype: 'init' },
        { type: 'summary', summary: 'Test summary', leafUuid: 'test-2', sessionId: 'test' },
        { type: 'result', uuid: 'test-4', timestamp: new Date().toISOString(), sessionId: 'test', parentUuid: 'test-2', isSidechain: false, userType: 'external', cwd: '/test', version: '1.0.0', gitBranch: 'main', subtype: 'success', duration_ms: 1000, duration_api_ms: 800, is_error: false, num_turns: 2, total_cost_usd: 0.001, usage: { input_tokens: 100, output_tokens: 50, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, service_tier: 'standard' } }
      ];
      
      const tempFile = join(testDataDir, 'temp-types.jsonl');
      const content = entries.map(e => JSON.stringify(e)).join('\n');
      await Bun.write(tempFile, content);
      
      const parsed: ConversationEntry[] = [];
      for await (const entry of parser.parseFile(tempFile)) {
        parsed.push(entry);
      }
      
      expect(parsed.length).toBe(5);
      expect(parsed.map(e => e.type)).toEqual(['user', 'assistant', 'system', 'summary', 'result']);
    });
  });
  
  describe('performance', () => {
    test('should handle large files efficiently', async () => {
      const filePath = join(testDataDir, 'large-conversation.jsonl');
      const startTime = Date.now();
      
      let entryCount = 0;
      for await (const entry of parser.parseFile(filePath)) {
        entryCount++;
        // Process only first 100 entries for test performance
        if (entryCount >= 100) break;
      }
      
      const duration = Date.now() - startTime;
      
      expect(entryCount).toBe(100);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
    
    test('should have reasonable memory usage', async () => {
      const filePath = join(testDataDir, 'large-conversation.jsonl');
      const initialMemory = process.memoryUsage().heapUsed;
      
      let entryCount = 0;
      for await (const entry of parser.parseFile(filePath)) {
        entryCount++;
        if (entryCount >= 1000) break;
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 50MB for 1000 entries)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });
});

// Test data generators
function createValidTestData(): string {
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
  
  const entries = [
    {
      ...baseEntry,
      type: 'system',
      subtype: 'init',
      uuid: 'system-1'
    },
    {
      ...baseEntry,
      type: 'user',
      uuid: 'user-1',
      parentUuid: 'system-1',
      message: {
        role: 'user',
        content: 'Hello, can you help me?'
      }
    },
    {
      ...baseEntry,
      type: 'assistant',
      uuid: 'assistant-1',
      parentUuid: 'user-1',
      message: {
        id: 'msg-1',
        type: 'message',
        role: 'assistant',
        model: 'claude-3-sonnet',
        content: [
          {
            type: 'text',
            text: 'Hello! I\'d be happy to help you.'
          },
          {
            type: 'tool_use',
            id: 'tool-1',
            name: 'Read',
            input: {
              file_path: '/test/file.txt'
            }
          }
        ],
        stop_reason: 'tool_use',
        stop_sequence: null,
        usage: {
          input_tokens: 100,
          output_tokens: 50,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation: {
            ephemeral_5m_input_tokens: 0,
            ephemeral_1h_input_tokens: 0
          },
          service_tier: 'standard'
        }
      }
    },
    {
      ...baseEntry,
      type: 'user',
      uuid: 'user-2',
      parentUuid: 'assistant-1',
      message: {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: 'tool-1',
            content: 'File contents here',
            is_error: false
          }
        ]
      }
    },
    {
      type: 'summary',
      summary: 'User asked for help and I provided assistance using tools.',
      leafUuid: 'user-2',
      sessionId: 'test-session'
    },
    {
      ...baseEntry,
      type: 'result',
      uuid: 'result-1',
      parentUuid: 'user-2',
      subtype: 'success',
      duration_ms: 5000,
      duration_api_ms: 3000,
      is_error: false,
      num_turns: 2,
      total_cost_usd: 0.001,
      usage: {
        input_tokens: 200,
        output_tokens: 100,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        service_tier: 'standard'
      }
    }
  ];
  
  return entries.map(entry => JSON.stringify(entry)).join('\n');
}

function createInvalidTestData(): string {
  const lines = [
    '{"type": "user"}', // Missing required fields
    'invalid json line',
    '{"type": "unknown", "uuid": "test"}', // Unknown type
    '{"type": "user", "uuid": "valid-1", "timestamp": "2024-01-01T00:00:00Z", "sessionId": "test", "parentUuid": null, "isSidechain": false, "userType": "external", "cwd": "/test", "version": "1.0.0", "gitBranch": "main", "message": {"role": "user", "content": "Valid entry"}}', // Valid entry
    '', // Empty line
    '{"type": "assistant"}' // Missing required fields
  ];
  
  return lines.join('\n');
}

function createLargeTestData(): string {
  const baseEntry = {
    uuid: 'test-uuid',
    timestamp: new Date().toISOString(),
    sessionId: 'test-session',
    parentUuid: null,
    isSidechain: false,
    userType: 'external',
    cwd: '/test',
    version: '1.0.0',
    gitBranch: 'main',
    type: 'user',
    message: {
      role: 'user',
      content: 'Test message content that is reasonably long to simulate real conversation data. This helps test memory usage and parsing performance with larger datasets.'
    }
  };
  
  const entries = [];
  for (let i = 0; i < 2000; i++) {
    entries.push({
      ...baseEntry,
      uuid: `test-uuid-${i}`,
      timestamp: new Date(Date.now() + i * 1000).toISOString()
    });
  }
  
  return entries.map(entry => JSON.stringify(entry)).join('\n');
}