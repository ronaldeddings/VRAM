/**
 * Unit tests for ConversationBuilder service.
 * Tests conversation tree building and action sequence extraction.
 */

import { describe, test, expect, beforeAll } from 'bun:test';
import { ConversationBuilder } from '../src/services/conversation-builder.ts';
import type { ConversationEntry, UserMessageEntry, AssistantMessageEntry } from '../src/types/claude-conversation.ts';

describe('ConversationBuilder', () => {
  let builder: ConversationBuilder;
  let testEntries: ConversationEntry[];
  
  beforeAll(() => {
    builder = new ConversationBuilder();
    testEntries = createTestEntries();
  });
  
  describe('buildConversationChain', () => {
    test('should build conversation chain with correct metadata', () => {
      const chain = builder.buildConversationChain(testEntries);
      
      expect(chain.sessionId).toBe('test-session');
      expect(chain.entries.length).toBe(testEntries.length);
      expect(chain.totalEntries).toBe(testEntries.length);
      expect(chain.projectPath).toBeDefined();
      expect(chain.startTime).toBeDefined();
      expect(chain.endTime).toBeDefined();
      expect(new Date(chain.endTime).getTime()).toBeGreaterThanOrEqual(new Date(chain.startTime).getTime());
    });
    
    test('should calculate costs correctly', () => {
      const chain = builder.buildConversationChain(testEntries);
      
      expect(chain.totalCost).toBeGreaterThan(0);
      expect(chain.tokenUsage).toBeDefined();
      expect(chain.tokenUsage!.input).toBeGreaterThan(0);
      expect(chain.tokenUsage!.output).toBeGreaterThan(0);
    });
    
    test('should handle empty entries array', () => {
      const chain = builder.buildConversationChain([]);
      
      expect(chain.entries.length).toBe(0);
      expect(chain.totalEntries).toBe(0);
      expect(chain.totalCost).toBe(0);
    });
  });
  
  describe('buildConversationTree', () => {
    test('should build tree structure with correct hierarchy', () => {
      const tree = builder.buildConversationTree(testEntries);
      
      expect(tree.length).toBeGreaterThan(0);
      
      // Find root nodes (no parent)
      const rootNodes = tree.filter(node => !node.entry.parentUuid);
      expect(rootNodes.length).toBeGreaterThan(0);
      
      // Check tree structure
      const firstRoot = rootNodes[0];
      expect(firstRoot.depth).toBe(0);
      expect(firstRoot.children).toBeDefined();
      
      // Verify children have correct depth
      if (firstRoot.children.length > 0) {
        expect(firstRoot.children[0].depth).toBe(1);
      }
    });
    
    test('should handle circular references gracefully', () => {
      const circularEntries = createCircularReferenceEntries();
      
      // Should not throw an error
      const tree = builder.buildConversationTree(circularEntries);
      expect(tree).toBeDefined();
      expect(tree.length).toBeGreaterThan(0);
    });
    
    test('should identify branching points', () => {
      const branchingEntries = createBranchingEntries();
      const tree = builder.buildConversationTree(branchingEntries);
      
      const branchingNodes = tree.filter(node => node.isBranch);
      expect(branchingNodes.length).toBeGreaterThan(0);
    });
  });
  
  describe('extractActionSequence', () => {
    test('should extract tool usage steps', () => {
      const sequence = builder.extractActionSequence(testEntries);
      
      const toolSteps = sequence.filter(step => step.type === 'tool_use');
      expect(toolSteps.length).toBeGreaterThan(0);
      
      const readStep = toolSteps.find(step => step.tool === 'Read');
      expect(readStep).toBeDefined();
      expect(readStep!.description).toContain('Read');
      expect(readStep!.timestamp).toBeDefined();
    });
    
    test('should extract response steps', () => {
      const sequence = builder.extractActionSequence(testEntries);
      
      const responseSteps = sequence.filter(step => step.type === 'response');
      expect(responseSteps.length).toBeGreaterThan(0);
      
      const responseStep = responseSteps[0];
      expect(responseStep.description).toBeDefined();
      expect(responseStep.timestamp).toBeDefined();
    });
    
    test('should order steps chronologically', () => {
      const sequence = builder.extractActionSequence(testEntries);
      
      for (let i = 1; i < sequence.length; i++) {
        const prevTime = new Date(sequence[i - 1].timestamp);
        const currTime = new Date(sequence[i].timestamp);
        expect(currTime.getTime()).toBeGreaterThanOrEqual(prevTime.getTime());
      }
    });
    
    test('should handle entries without tools', () => {
      const noToolEntries = testEntries.filter(e => 
        !(e.type === 'assistant' && 
          Array.isArray(e.message.content) && 
          e.message.content.some(c => c.type === 'tool_use'))
      );
      
      const sequence = builder.extractActionSequence(noToolEntries);
      expect(sequence).toBeDefined();
      expect(Array.isArray(sequence)).toBe(true);
    });
  });
  
  describe('getFlowSummary', () => {
    test('should provide flow summary', () => {
      const summary = builder.getFlowSummary(testEntries);
      
      expect(summary.totalSteps).toBeGreaterThan(0);
      expect(summary.toolUses).toBeGreaterThan(0);
      expect(summary.responses).toBeGreaterThan(0);
      expect(summary.decisions).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(summary.toolsUsed)).toBe(true);
      expect(summary.toolsUsed.length).toBeGreaterThan(0);
    });
    
    test('should calculate duration', () => {
      const summary = builder.getFlowSummary(testEntries);
      
      expect(summary.duration).toBeGreaterThan(0);
    });
    
    test('should handle empty entries', () => {
      const summary = builder.getFlowSummary([]);
      
      expect(summary.totalSteps).toBe(0);
      expect(summary.toolUses).toBe(0);
      expect(summary.responses).toBe(0);
      expect(summary.decisions).toBe(0);
      expect(summary.toolsUsed).toEqual([]);
      expect(summary.duration).toBe(0);
    });
  });
  
  describe('error handling', () => {
    test('should handle malformed entries gracefully', () => {
      const malformedEntries = [
        {
          type: 'user',
          uuid: 'test-1',
          timestamp: 'invalid-date',
          sessionId: 'test',
          parentUuid: null,
          isSidechain: false,
          userType: 'external',
          cwd: '/test',
          version: '1.0.0',
          gitBranch: 'main',
          message: null // Invalid message
        } as any
      ];
      
      // Should not throw
      const chain = builder.buildConversationChain(malformedEntries);
      expect(chain).toBeDefined();
    });
    
    test('should handle missing UUIDs', () => {
      const noUuidEntries = testEntries.map(e => ({
        ...e,
        uuid: undefined
      })) as any;
      
      // Should handle gracefully
      const tree = builder.buildConversationTree(noUuidEntries);
      expect(tree).toBeDefined();
    });
  });
});

// Test data generators
function createTestEntries(): ConversationEntry[] {
  const baseTimestamp = new Date('2024-01-01T10:00:00Z');
  
  return [
    {
      type: 'system',
      uuid: 'system-1',
      timestamp: new Date(baseTimestamp.getTime()).toISOString(),
      sessionId: 'test-session',
      parentUuid: null,
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      subtype: 'init'
    },
    {
      type: 'user',
      uuid: 'user-1',
      timestamp: new Date(baseTimestamp.getTime() + 1000).toISOString(),
      sessionId: 'test-session',
      parentUuid: 'system-1',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: {
        role: 'user',
        content: 'Can you read a file for me?'
      }
    } as UserMessageEntry,
    {
      type: 'assistant',
      uuid: 'assistant-1',
      timestamp: new Date(baseTimestamp.getTime() + 2000).toISOString(),
      sessionId: 'test-session',
      parentUuid: 'user-1',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: {
        id: 'msg-1',
        type: 'message',
        role: 'assistant',
        model: 'claude-3-sonnet',
        content: [
          {
            type: 'text',
            text: 'I\'ll read the file for you.'
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
          input_tokens: 150,
          output_tokens: 75,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation: {
            ephemeral_5m_input_tokens: 0,
            ephemeral_1h_input_tokens: 0
          },
          service_tier: 'standard'
        }
      }
    } as AssistantMessageEntry,
    {
      type: 'user',
      uuid: 'user-2',
      timestamp: new Date(baseTimestamp.getTime() + 3000).toISOString(),
      sessionId: 'test-session',
      parentUuid: 'assistant-1',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: {
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: 'tool-1',
            content: 'File contents: Hello, World!',
            is_error: false
          }
        ]
      }
    } as UserMessageEntry,
    {
      type: 'assistant',
      uuid: 'assistant-2',
      timestamp: new Date(baseTimestamp.getTime() + 4000).toISOString(),
      sessionId: 'test-session',
      parentUuid: 'user-2',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: {
        id: 'msg-2',
        type: 'message',
        role: 'assistant',
        model: 'claude-3-sonnet',
        content: [
          {
            type: 'text',
            text: 'I successfully read the file. The contents are: "Hello, World!"'
          }
        ],
        stop_reason: 'stop_sequence',
        stop_sequence: null,
        usage: {
          input_tokens: 200,
          output_tokens: 100,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation: {
            ephemeral_5m_input_tokens: 0,
            ephemeral_1h_input_tokens: 0
          },
          service_tier: 'standard'
        }
      }
    } as AssistantMessageEntry,
    {
      type: 'result',
      uuid: 'result-1',
      timestamp: new Date(baseTimestamp.getTime() + 5000).toISOString(),
      sessionId: 'test-session',
      parentUuid: 'assistant-2',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      subtype: 'success',
      duration_ms: 5000,
      duration_api_ms: 3000,
      is_error: false,
      num_turns: 2,
      total_cost_usd: 0.002,
      usage: {
        input_tokens: 350,
        output_tokens: 175,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        service_tier: 'standard'
      }
    }
  ];
}

function createCircularReferenceEntries(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'user-1',
      timestamp: new Date().toISOString(),
      sessionId: 'test',
      parentUuid: 'user-2', // Circular reference
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: { role: 'user', content: 'Test 1' }
    } as UserMessageEntry,
    {
      type: 'user',
      uuid: 'user-2',
      timestamp: new Date().toISOString(),
      sessionId: 'test',
      parentUuid: 'user-1', // Circular reference
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: { role: 'user', content: 'Test 2' }
    } as UserMessageEntry
  ];
}

function createBranchingEntries(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'root',
      timestamp: new Date().toISOString(),
      sessionId: 'test',
      parentUuid: null,
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: { role: 'user', content: 'Root message' }
    } as UserMessageEntry,
    {
      type: 'user',
      uuid: 'branch-1',
      timestamp: new Date().toISOString(),
      sessionId: 'test',
      parentUuid: 'root',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: { role: 'user', content: 'Branch 1' }
    } as UserMessageEntry,
    {
      type: 'user',
      uuid: 'branch-2',
      timestamp: new Date().toISOString(),
      sessionId: 'test',
      parentUuid: 'root', // Same parent as branch-1
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: { role: 'user', content: 'Branch 2' }
    } as UserMessageEntry
  ];
}