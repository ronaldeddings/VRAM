/**
 * Unit tests for validation system.
 * Tests schema, relationship, tool usage, and completeness validation.
 */

import { describe, test, expect, beforeAll } from 'bun:test';
import { 
  ConversationValidator,
  SchemaValidator, 
  RelationshipValidator, 
  ToolUseValidator, 
  CompletenessChecker 
} from '../src/validators/index.ts';
import type { ConversationEntry, UserMessageEntry, AssistantMessageEntry } from '../src/types/claude-conversation.ts';

describe('Validation System', () => {
  let validator: ConversationValidator;
  let validEntries: ConversationEntry[];
  let invalidEntries: ConversationEntry[];
  
  beforeAll(() => {
    validator = new ConversationValidator();
    validEntries = createValidEntries();
    invalidEntries = createInvalidEntries();
  });
  
  describe('ConversationValidator', () => {
    test('should validate complete conversation successfully', async () => {
      const report = await validator.validateConversation(validEntries);
      
      expect(report.isValid).toBe(true);
      expect(report.summary.totalEntries).toBe(validEntries.length);
      expect(report.summary.validationTypes.length).toBeGreaterThan(0);
      expect(report.summary.criticalIssues).toBe(0);
      expect(report.timestamp).toBeDefined();
    });
    
    test('should detect invalid conversation', async () => {
      const report = await validator.validateConversation(invalidEntries);
      
      expect(report.isValid).toBe(false);
      expect(report.summary.issuesFound).toBeGreaterThan(0);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });
    
    test('should support selective validation', async () => {
      const report = await validator.validateConversation(validEntries, {
        includeSchema: true,
        includeRelationships: false,
        includeToolUsage: false,
        includeCompleteness: false
      });
      
      expect(report.validationResults.schema).toBeDefined();
      expect(report.validationResults.relationships).toBeUndefined();
      expect(report.validationResults.toolUsage).toBeUndefined();
      expect(report.validationResults.completeness).toBeUndefined();
    });
    
    test('should apply strict mode', async () => {
      const entriesWithWarnings = createEntriesWithWarnings();
      
      const normalReport = await validator.validateConversation(entriesWithWarnings, { strict: false });
      const strictReport = await validator.validateConversation(entriesWithWarnings, { strict: true });
      
      expect(normalReport.summary.warnings).toBeGreaterThan(0);
      expect(strictReport.isValid).toBe(false);
    });
    
    test('should format report correctly', async () => {
      const report = await validator.validateConversation(validEntries);
      const formatted = validator.formatReport(report);
      
      expect(typeof formatted).toBe('string');
      expect(formatted).toContain('Conversation Validation Report');
      expect(formatted).toContain('Summary:');
      expect(formatted).toContain('✅ Valid');
    });
    
    test('should perform quick validation', () => {
      const quick = validator.quickValidate(validEntries);
      
      expect(quick.isValid).toBe(true);
      expect(quick.entryCount).toBe(validEntries.length);
      expect(quick.criticalIssues.length).toBe(0);
      expect(quick.hasErrors).toBe(false);
    });
  });
  
  describe('SchemaValidator', () => {
    test('should validate correct entry structure', () => {
      const schemaValidator = new SchemaValidator();
      const validEntry = validEntries[0];
      
      const result = schemaValidator.validateConversationEntry(validEntry);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
    
    test('should detect missing required fields', () => {
      const schemaValidator = new SchemaValidator();
      const invalidEntry = { type: 'user' }; // Missing required fields
      
      const result = schemaValidator.validateConversationEntry(invalidEntry);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.includes('Missing'))).toBe(true);
    });
    
    test('should validate type-specific requirements', () => {
      const schemaValidator = new SchemaValidator();
      
      // Test user entry validation
      const invalidUserEntry = {
        type: 'user',
        uuid: 'test',
        timestamp: new Date().toISOString(),
        sessionId: 'test',
        parentUuid: null,
        isSidechain: false,
        userType: 'external',
        cwd: '/test',
        version: '1.0.0',
        gitBranch: 'main',
        message: { role: 'assistant' } // Wrong role
      };
      
      const result = schemaValidator.validateConversationEntry(invalidUserEntry);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('role'))).toBe(true);
    });
    
    test('should validate batch entries', () => {
      const schemaValidator = new SchemaValidator();
      const result = schemaValidator.validateEntries(validEntries);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
  
  describe('RelationshipValidator', () => {
    test('should validate conversation chain relationships', () => {
      const relationshipValidator = new RelationshipValidator();
      const result = relationshipValidator.validateConversationChain(validEntries);
      
      expect(result.isValid).toBe(true);
      expect(result.orphanedEntries.length).toBe(0);
      expect(result.circularReferences.length).toBe(0);
    });
    
    test('should detect orphaned entries', () => {
      const relationshipValidator = new RelationshipValidator();
      const orphanedEntries = [
        {
          type: 'user',
          uuid: 'user-1',
          timestamp: new Date().toISOString(),
          sessionId: 'test',
          parentUuid: 'non-existent-parent',
          isSidechain: false,
          userType: 'external',
          cwd: '/test',
          version: '1.0.0',
          gitBranch: 'main',
          message: { role: 'user', content: 'test' }
        } as UserMessageEntry
      ];
      
      const result = relationshipValidator.validateConversationChain(orphanedEntries);
      
      expect(result.isValid).toBe(false);
      expect(result.orphanedEntries.length).toBe(1);
      expect(result.missingParents.length).toBe(1);
    });
    
    test('should validate tree structure', () => {
      const relationshipValidator = new RelationshipValidator();
      const structure = relationshipValidator.validateTreeStructure(validEntries);
      
      expect(structure.isValid).toBe(true);
      expect(structure.maxDepth).toBeGreaterThan(0);
      expect(structure.rootEntries.length).toBeGreaterThan(0);
      expect(structure.issues.length).toBe(0);
    });
    
    test('should validate session consistency', () => {
      const relationshipValidator = new RelationshipValidator();
      const consistency = relationshipValidator.validateSessionConsistency(validEntries);
      
      expect(consistency.isValid).toBe(true);
      expect(consistency.sessionIds.length).toBe(1);
      expect(consistency.inconsistentEntries.length).toBe(0);
    });
    
    test('should validate temporal order', () => {
      const relationshipValidator = new RelationshipValidator();
      const temporal = relationshipValidator.validateTemporalOrder(validEntries);
      
      expect(temporal.isValid).toBe(true);
      expect(temporal.outOfOrderEntries.length).toBe(0);
    });
  });
  
  describe('ToolUseValidator', () => {
    test('should validate tool usage patterns', () => {
      const toolValidator = new ToolUseValidator();
      const result = toolValidator.validateToolUsage(validEntries);
      
      expect(result.isValid).toBe(true);
      expect(result.invalidToolUses.length).toBe(0);
      expect(result.missingToolResults.length).toBe(0);
    });
    
    test('should detect missing tool results', () => {
      const toolValidator = new ToolUseValidator();
      const entriesWithMissingResults = [
        {
          type: 'assistant',
          uuid: 'assistant-1',
          timestamp: new Date().toISOString(),
          sessionId: 'test',
          parentUuid: null,
          isSidechain: false,
          userType: 'external',
          cwd: '/test',
          version: '1.0.0',
          gitBranch: 'main',
          message: {
            id: 'msg-1',
            type: 'message',
            role: 'assistant',
            model: 'claude-3',
            content: [
              {
                type: 'tool_use',
                id: 'tool-1',
                name: 'Read',
                input: { file_path: '/test' }
              }
            ],
            stop_reason: 'tool_use',
            stop_sequence: null,
            usage: {
              input_tokens: 100,
              output_tokens: 50,
              cache_creation_input_tokens: 0,
              cache_read_input_tokens: 0,
              cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: 0 },
              service_tier: 'standard'
            }
          }
        } as AssistantMessageEntry
      ];
      
      const result = toolValidator.validateToolUsage(entriesWithMissingResults);
      
      expect(result.isValid).toBe(false);
      expect(result.missingToolResults.length).toBe(1);
    });
    
    test('should analyze tool usage patterns', () => {
      const toolValidator = new ToolUseValidator();
      const analysis = toolValidator.analyzeToolUsagePatterns(validEntries);
      
      expect(analysis.toolFrequency).toBeInstanceOf(Map);
      expect(analysis.toolSuccessRate).toBeInstanceOf(Map);
      expect(typeof analysis.averageToolsPerMessage).toBe('number');
      expect(Array.isArray(analysis.toolSequences)).toBe(true);
    });
  });
  
  describe('CompletenessChecker', () => {
    test('should check conversation completeness', () => {
      const completenessChecker = new CompletenessChecker();
      const result = completenessChecker.checkConversationCompleteness(validEntries);
      
      expect(result.isComplete).toBe(true);
      expect(result.hasProperEnding).toBe(true);
      expect(result.missingComponents.length).toBe(0);
      expect(result.structuralIssues.length).toBe(0);
    });
    
    test('should detect incomplete conversations', () => {
      const completenessChecker = new CompletenessChecker();
      const incompleteEntries = validEntries.filter(e => e.type !== 'result'); // Remove result entry
      
      const result = completenessChecker.checkConversationCompleteness(incompleteEntries);
      
      expect(result.isComplete).toBe(false);
      expect(result.missingComponents.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
    
    test('should check conversation patterns', () => {
      const completenessChecker = new CompletenessChecker();
      const result = completenessChecker.checkConversationPatterns(validEntries);
      
      expect(result.patterns).toBeDefined();
      expect(result.quality).toBeDefined();
      expect(Array.isArray(result.insights)).toBe(true);
      
      expect(typeof result.quality.averageMessageLength).toBe('number');
      expect(typeof result.quality.toolUsageBalance).toBe('number');
      expect(typeof result.quality.errorRate).toBe('number');
      expect(typeof result.quality.completionRate).toBe('number');
    });
  });
  
  describe('error handling', () => {
    test('should handle empty entry arrays', async () => {
      const report = await validator.validateConversation([]);
      
      expect(report).toBeDefined();
      expect(report.summary.totalEntries).toBe(0);
    });
    
    test('should handle malformed entries gracefully', async () => {
      const malformedEntries = [
        { type: 'unknown', invalidField: 'test' } as any,
        null as any,
        undefined as any
      ];
      
      const report = await validator.validateConversation(malformedEntries);
      
      expect(report).toBeDefined();
      expect(report.isValid).toBe(false);
    });
    
    test('should handle validation errors', async () => {
      // Test with entries that might cause validation errors
      const problematicEntries = [
        {
          type: 'user',
          uuid: 'test',
          timestamp: 'invalid-date',
          sessionId: '',
          parentUuid: 'self-reference',
          message: null
        } as any
      ];
      
      const report = await validator.validateConversation(problematicEntries);
      
      expect(report).toBeDefined();
      expect(report.error || !report.isValid).toBeTruthy();
    });
  });
});

// Test data generators
function createValidEntries(): ConversationEntry[] {
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
        content: 'Can you read a file?'
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
      type: 'result',
      uuid: 'result-1',
      timestamp: new Date(baseTimestamp.getTime() + 4000).toISOString(),
      sessionId: 'test-session',
      parentUuid: 'user-2',
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      subtype: 'success',
      duration_ms: 4000,
      duration_api_ms: 2500,
      is_error: false,
      num_turns: 2,
      total_cost_usd: 0.001,
      usage: {
        input_tokens: 300,
        output_tokens: 150,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
        service_tier: 'standard'
      }
    }
  ];
}

function createInvalidEntries(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: '', // Invalid empty UUID
      timestamp: 'invalid-date', // Invalid timestamp
      sessionId: 'test',
      parentUuid: 'non-existent', // Orphaned reference
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: {
        role: 'assistant', // Wrong role for user entry
        content: 'test'
      }
    } as any,
    {
      type: 'assistant',
      uuid: 'assistant-1',
      timestamp: new Date().toISOString(),
      sessionId: 'different-session', // Different session ID
      parentUuid: null,
      isSidechain: false,
      userType: 'external',
      cwd: '/test',
      version: '1.0.0',
      gitBranch: 'main',
      message: {
        // Missing required fields like id, usage
        role: 'assistant',
        content: []
      }
    } as any
  ];
}

function createEntriesWithWarnings(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'user-1',
      timestamp: new Date().toISOString(),
      sessionId: 'test',
      parentUuid: null,
      isSidechain: false,
      userType: 'external',
      // Missing optional fields that generate warnings
      cwd: '',
      version: '',
      gitBranch: '',
      message: {
        role: 'user',
        content: 'test'
      }
    } as UserMessageEntry
  ];
}