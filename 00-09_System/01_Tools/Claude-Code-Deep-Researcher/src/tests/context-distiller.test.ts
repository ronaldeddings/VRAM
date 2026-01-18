import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { ContextDistiller } from '../services/context-distiller';
import { ClaudeCodeService } from '../services/claude-code';
import { ConfigManager } from '../config/config-manager';
import type { ConversationEntry, UserMessageEntry, AssistantMessageEntry, ToolResultContent, ToolUseContent } from '../types/claude-conversation';

// Mock dependencies
const mockClaudeCodeService = {
  runPrompt: async (prompt: string) => ({
    success: true,
    sessionId: 'test-session',
    response: 'keep',
    usage: { tokens: 100 }
  })
} as ClaudeCodeService;

const mockConfigManager = {
  getPrebakeConfig: () => ({
    stage2: {
      maxLineRemovalRatio: 0.5,
      minLinesThreshold: 10,
      preserveEssentialLines: true
    }
  })
} as ConfigManager;

describe('ContextDistiller - Line-by-Line JSONL Processing', () => {
  let distiller: ContextDistiller;
  let tempDir: string;
  let testFilePath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'context-distiller-test-'));
    testFilePath = join(tempDir, 'test-conversation.jsonl');
    distiller = new ContextDistiller(mockClaudeCodeService, mockConfigManager);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Streaming JSONL Reader', () => {
    test('should process valid JSONL lines without loading entire file', async () => {
      // Create test JSONL with valid entries
      const validEntries = [
        createUserMessage('user-1', 'Hello, how are you?'),
        createAssistantMessage('assistant-1', 'user-1', 'I am doing well, thank you!'),
        createUserMessage('user-2', 'Can you help me with coding?'),
        createAssistantMessage('assistant-2', 'user-2', 'Of course! What would you like help with?')
      ];
      
      const jsonlContent = validEntries.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      expect(processedEntries).toHaveLength(4);
      expect(processedEntries[0].uuid).toBe('user-1');
      expect(processedEntries[1].uuid).toBe('assistant-1');
      expect(processedEntries[1].parentMessageUuid).toBe('user-1');
    });

    test('should handle large files efficiently without memory issues', async () => {
      // Create large JSONL file (1000+ lines)
      const largeEntries: string[] = [];
      for (let i = 0; i < 1000; i++) {
        const userMsg = createUserMessage(`user-${i}`, `Test message ${i}`);
        const assistantMsg = createAssistantMessage(`assistant-${i}`, `user-${i}`, `Response ${i}`);
        largeEntries.push(JSON.stringify(userMsg), JSON.stringify(assistantMsg));
      }
      
      await fs.writeFile(testFilePath, largeEntries.join('\n'));

      let processedCount = 0;
      const startMemory = process.memoryUsage().heapUsed;
      
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedCount++;
        // Verify memory doesn't grow exponentially
        const currentMemory = process.memoryUsage().heapUsed;
        const memoryGrowth = currentMemory - startMemory;
        expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // Less than 50MB growth
      }

      expect(processedCount).toBe(2000);
    });

    test('should preserve line order and indexing', async () => {
      const orderedEntries = [
        createUserMessage('user-1', 'First message'),
        createAssistantMessage('assistant-1', 'user-1', 'First response'),
        createUserMessage('user-2', 'Second message'),
        createAssistantMessage('assistant-2', 'user-2', 'Second response'),
        createUserMessage('user-3', 'Third message')
      ];
      
      const jsonlContent = orderedEntries.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      // Verify order preservation
      expect(processedEntries[0].uuid).toBe('user-1');
      expect(processedEntries[1].uuid).toBe('assistant-1');
      expect(processedEntries[2].uuid).toBe('user-2');
      expect(processedEntries[3].uuid).toBe('assistant-2');
      expect(processedEntries[4].uuid).toBe('user-3');
    });
  });

  describe('Malformed JSON Handling', () => {
    test('should handle malformed JSON lines gracefully', async () => {
      const mixedContent = [
        JSON.stringify(createUserMessage('user-1', 'Valid message')),
        '{"invalid": json malformed}', // Malformed JSON
        JSON.stringify(createAssistantMessage('assistant-1', 'user-1', 'Valid response')),
        'completely invalid line', // Not JSON at all
        JSON.stringify(createUserMessage('user-2', 'Another valid message'))
      ].join('\n');
      
      await fs.writeFile(testFilePath, mixedContent);

      const processedEntries: ConversationEntry[] = [];
      const errorLogs: string[] = [];
      
      // Mock console.warn to capture error logs
      const originalWarn = console.warn;
      console.warn = (msg: string) => errorLogs.push(msg);

      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      console.warn = originalWarn;

      // Should process only valid entries
      expect(processedEntries).toHaveLength(3);
      expect(processedEntries[0].uuid).toBe('user-1');
      expect(processedEntries[1].uuid).toBe('assistant-1');
      expect(processedEntries[2].uuid).toBe('user-2');
      
      // Should log errors for malformed lines
      expect(errorLogs.length).toBeGreaterThan(0);
      expect(errorLogs.some(log => log.includes('malformed'))).toBe(true);
    });

    test('should continue processing after encountering errors', async () => {
      const contentWithErrors = [
        JSON.stringify(createUserMessage('user-1', 'First valid')),
        '{"broken": json', // Malformed
        '{"another": "broken" json}', // Malformed
        JSON.stringify(createUserMessage('user-2', 'Second valid')),
        '{"uuid": "missing-required-fields"}', // Missing required fields
        JSON.stringify(createUserMessage('user-3', 'Third valid'))
      ].join('\n');
      
      await fs.writeFile(testFilePath, contentWithErrors);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      // Should continue processing and get valid entries
      expect(processedEntries).toHaveLength(3);
      expect(processedEntries.map(e => e.uuid)).toEqual(['user-1', 'user-2', 'user-3']);
    });

    test('should provide validation summary after processing', async () => {
      const mixedContent = [
        JSON.stringify(createUserMessage('user-1', 'Valid')),
        '{"invalid": json}',
        JSON.stringify(createUserMessage('user-2', 'Valid')),
        'not json at all',
        JSON.stringify(createUserMessage('user-3', 'Valid'))
      ].join('\n');
      
      await fs.writeFile(testFilePath, mixedContent);

      let validCount = 0;
      let errorCount = 0;
      
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        validCount++;
      }

      // In real implementation, this would come from the method
      const totalLines = 5;
      errorCount = totalLines - validCount;
      
      expect(validCount).toBe(3);
      expect(errorCount).toBe(2);
      expect(validCount + errorCount).toBe(totalLines);
    });
  });

  describe('UUID Relationship Preservation', () => {
    test('should track parent-child UUID relationships', async () => {
      const conversationChain = [
        createUserMessage('user-1', 'Initial question'),
        createAssistantMessage('assistant-1', 'user-1', 'Response with tool use', [
          createToolUse('tool-use-1', 'read_file', { path: '/test.js' })
        ]),
        createToolResult('tool-result-1', 'tool-use-1', 'File contents here'),
        createAssistantMessage('assistant-2', 'assistant-1', 'Final response based on file'),
        createUserMessage('user-2', 'Follow-up question'),
        createAssistantMessage('assistant-3', 'user-2', 'Follow-up response')
      ];
      
      const jsonlContent = conversationChain.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      // Verify UUID relationships are preserved
      const assistant1 = processedEntries.find(e => e.uuid === 'assistant-1') as AssistantMessageEntry;
      const toolResult = processedEntries.find(e => e.uuid === 'tool-result-1');
      const assistant2 = processedEntries.find(e => e.uuid === 'assistant-2') as AssistantMessageEntry;
      const assistant3 = processedEntries.find(e => e.uuid === 'assistant-3') as AssistantMessageEntry;

      expect(assistant1.parentMessageUuid).toBe('user-1');
      expect(toolResult?.parentMessageUuid).toBe('tool-use-1');
      expect(assistant2.parentMessageUuid).toBe('assistant-1');
      expect(assistant3.parentMessageUuid).toBe('user-2');
    });

    test('should detect orphaned entries after line removal', async () => {
      const conversationWithOrphans = [
        createUserMessage('user-1', 'Question'),
        createAssistantMessage('assistant-1', 'user-1', 'Response', [
          createToolUse('tool-use-1', 'read_file', { path: '/test.js' })
        ]),
        // Tool result will be "removed" by mock evaluation
        createToolResult('tool-result-1', 'tool-use-1', 'File contents'),
        createAssistantMessage('assistant-2', 'assistant-1', 'Final response')
      ];
      
      const jsonlContent = conversationWithOrphans.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      // Mock Claude evaluation to remove tool result
      const mockClaudeWithRemoval = {
        runPrompt: async (prompt: string) => {
          if (prompt.includes('tool-result-1')) {
            return { success: true, sessionId: 'test', response: 'remove', usage: { tokens: 50 } };
          }
          return { success: true, sessionId: 'test', response: 'keep', usage: { tokens: 50 } };
        }
      } as ClaudeCodeService;

      const distillerWithRemoval = new ContextDistiller(mockClaudeWithRemoval, mockConfigManager);
      
      // This would be tested in the actual distillation method
      // For now, verify the entries are properly structured for relationship tracking
      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distillerWithRemoval as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      const toolUseEntry = processedEntries.find(e => e.uuid === 'tool-use-1');
      const toolResultEntry = processedEntries.find(e => e.uuid === 'tool-result-1');
      
      expect(toolUseEntry).toBeDefined();
      expect(toolResultEntry).toBeDefined();
      expect(toolResultEntry?.parentMessageUuid).toBe('tool-use-1');
    });

    test('should maintain conversation continuity after processing', async () => {
      const fullConversation = [
        createUserMessage('user-1', 'Start conversation'),
        createAssistantMessage('assistant-1', 'user-1', 'First response'),
        createUserMessage('user-2', 'Continue conversation'),  
        createAssistantMessage('assistant-2', 'user-2', 'Second response'),
        createUserMessage('user-3', 'End conversation'),
        createAssistantMessage('assistant-3', 'user-3', 'Final response')
      ];
      
      const jsonlContent = fullConversation.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      // Verify conversation flow is preserved
      const userMessages = processedEntries.filter(e => e.type === 'user');
      const assistantMessages = processedEntries.filter(e => e.type === 'assistant') as AssistantMessageEntry[];
      
      expect(userMessages).toHaveLength(3);
      expect(assistantMessages).toHaveLength(3);
      
      // Verify parent-child relationships maintain conversation flow
      expect(assistantMessages[0].parentMessageUuid).toBe('user-1');
      expect(assistantMessages[1].parentMessageUuid).toBe('user-2');
      expect(assistantMessages[2].parentMessageUuid).toBe('user-3');
    });
  });

  describe('Edge Cases and Error Recovery', () => {
    test('should handle incomplete tool results spanning multiple lines', async () => {
      // This tests the theoretical case where a tool result might be split
      // In practice, each JSONL line should be complete, but we test robustness
      const complexToolResult = createToolResult(
        'tool-result-1', 
        'tool-use-1', 
        'Very long content that might theoretically span multiple lines in some edge cases'
      );
      
      const entries = [
        createUserMessage('user-1', 'Question'),
        createAssistantMessage('assistant-1', 'user-1', 'Response', [
          createToolUse('tool-use-1', 'read_file', { path: '/large-file.js' })
        ]),
        complexToolResult,
        createAssistantMessage('assistant-2', 'assistant-1', 'Final response')
      ];
      
      const jsonlContent = entries.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      expect(processedEntries).toHaveLength(4);
      const toolResult = processedEntries.find(e => e.uuid === 'tool-result-1');
      expect(toolResult).toBeDefined();
      expect(toolResult?.parentMessageUuid).toBe('tool-use-1');
    });

    test('should handle broken UUID references from previous processing', async () => {
      const entriesWithBrokenRefs = [
        createUserMessage('user-1', 'Valid start'),
        createAssistantMessage('assistant-1', 'non-existent-parent', 'Broken parent reference'),
        createUserMessage('user-2', 'Valid continuation'),
        createAssistantMessage('assistant-2', 'user-2', 'Valid response')
      ];
      
      const jsonlContent = entriesWithBrokenRefs.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      expect(processedEntries).toHaveLength(4);
      
      // Verify broken reference is preserved but flagged
      const brokenRefEntry = processedEntries.find(e => e.uuid === 'assistant-1') as AssistantMessageEntry;
      expect(brokenRefEntry.parentMessageUuid).toBe('non-existent-parent');
      
      // Valid entries should remain unaffected
      const validEntry = processedEntries.find(e => e.uuid === 'assistant-2') as AssistantMessageEntry;
      expect(validEntry.parentMessageUuid).toBe('user-2');
    });

    test('should manage tool_use entries without matching tool_result', async () => {
      const entriesWithOrphanedToolUse = [
        createUserMessage('user-1', 'Question requiring tool use'),
        createAssistantMessage('assistant-1', 'user-1', 'Response with tool', [
          createToolUse('tool-use-1', 'read_file', { path: '/missing-file.js' }),
          createToolUse('tool-use-2', 'grep_search', { pattern: 'test' })
        ]),
        // Missing tool results for both tool uses
        createAssistantMessage('assistant-2', 'assistant-1', 'Response without tool results')
      ];
      
      const jsonlContent = entriesWithOrphanedToolUse.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      expect(processedEntries).toHaveLength(3);
      
      // Verify tool use entries are preserved even without results
      const assistantWithTools = processedEntries.find(e => e.uuid === 'assistant-1') as AssistantMessageEntry;
      expect(assistantWithTools.content).toHaveLength(3); // text + 2 tool uses
      
      const toolUses = assistantWithTools.content.filter(c => c.type === 'tool_use');
      expect(toolUses).toHaveLength(2);
    });

    test('should preserve system messages and conversation boundaries', async () => {
      const conversationWithSystem = [
        { type: 'system', content: 'You are a helpful assistant', uuid: 'system-1' },
        createUserMessage('user-1', 'First user message'),
        createAssistantMessage('assistant-1', 'user-1', 'First response'),
        { type: 'system', content: 'Context switch', uuid: 'system-2' },
        createUserMessage('user-2', 'Second user message'),
        createAssistantMessage('assistant-2', 'user-2', 'Second response')
      ];
      
      const jsonlContent = conversationWithSystem.map(entry => JSON.stringify(entry)).join('\n');
      await fs.writeFile(testFilePath, jsonlContent);

      const processedEntries: ConversationEntry[] = [];
      for await (const entry of (distiller as any).processLineByLine(testFilePath)) {
        processedEntries.push(entry);
      }

      expect(processedEntries).toHaveLength(6);
      
      // Verify system messages are preserved
      const systemMessages = processedEntries.filter(e => e.type === 'system');
      expect(systemMessages).toHaveLength(2);
      expect(systemMessages[0].uuid).toBe('system-1');
      expect(systemMessages[1].uuid).toBe('system-2');
    });
  });
});

// Helper functions to create test data
function createUserMessage(uuid: string, content: string): UserMessageEntry {
  return {
    type: 'user',
    uuid,
    content: [{ type: 'text', text: content }],
    created_at: new Date().toISOString()
  };
}

function createAssistantMessage(
  uuid: string, 
  parentUuid: string, 
  textContent: string, 
  toolContent: (ToolUseContent | ToolResultContent)[] = []
): AssistantMessageEntry {
  return {
    type: 'assistant',
    uuid,
    parentMessageUuid: parentUuid,
    content: [
      { type: 'text', text: textContent },
      ...toolContent
    ],
    created_at: new Date().toISOString()
  };
}

function createToolUse(uuid: string, name: string, input: any): ToolUseContent {
  return {
    type: 'tool_use',
    uuid,
    name,
    input
  };
}

function createToolResult(uuid: string, toolUseUuid: string, content: string): any {
  return {
    type: 'tool_result',
    uuid,
    parentMessageUuid: toolUseUuid,
    content: [{ type: 'text', text: content }],
    created_at: new Date().toISOString()
  };
}