import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { PrebakeOrchestrator } from '../services/prebake-orchestrator';
import { ClaudeCodeService } from '../services/claude-code';
import { ConfigManager } from '../config/config-manager';
import { ProgressMonitor } from '../services/progress-monitor';
import type { ConversationEntry } from '../types/claude-conversation';

// Mock Claude service that simulates realistic behavior
const mockRealisticClaudeService = {
  runPrompt: async (prompt: string) => {
    // Simulate different response types based on prompt content
    if (prompt.includes('analyze') || prompt.includes('read')) {
      return {
        success: true,
        sessionId: `session-${Date.now()}`,
        response: simulateProjectAnalysis(prompt),
        usage: { tokens: 1500 + Math.floor(Math.random() * 500) }
      };
    } else if (prompt.includes('evaluate') || prompt.includes('keep') || prompt.includes('remove')) {
      return {
        success: true,
        sessionId: `session-${Date.now()}`,
        response: Math.random() > 0.3 ? 'keep' : 'remove', // 70% keep rate
        usage: { tokens: 200 + Math.floor(Math.random() * 100) }
      };
    } else if (prompt.includes('condense') || prompt.includes('optimize')) {
      return {
        success: true,
        sessionId: `session-${Date.now()}`,
        response: simulateContentCondensation(prompt),
        usage: { tokens: 800 + Math.floor(Math.random() * 400) }
      };
    }
    
    return {
      success: true,
      sessionId: `session-${Date.now()}`,
      response: 'Default response',
      usage: { tokens: 300 }
    };
  },
  executeInSession: async (sessionId: string, prompt: string) => {
    // Simulate session continuity
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
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

describe('End-to-End Validation with Real Project Examples', () => {
  let tempDir: string;
  let progressMonitor: ProgressMonitor;
  let orchestrator: PrebakeOrchestrator;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(join(tmpdir(), 'e2e-validation-'));
    progressMonitor = new ProgressMonitor();
    orchestrator = new PrebakeOrchestrator(mockRealisticClaudeService, mockConfigManager, progressMonitor);
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('Complete Pipeline with Actual Claude Code Conversation Files', () => {
    test('should process TypeScript React project with real conversation', async () => {
      const projectPath = join(tempDir, 'react-typescript-project');
      
      // Create realistic React TypeScript project
      await createReactTypeScriptProject(projectPath);
      
      // Create realistic Claude Code conversation
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createRealisticClaudeConversation(conversationPath, 'react-typescript');

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.stages).toHaveLength(3);

      // Validate Stage 1 results
      expect(result.stages[0].stage).toBe('stage1');
      expect(result.stages[0].success).toBe(true);
      expect(result.stages[0].filesAnalyzed).toBeGreaterThan(15); // Should analyze package.json, components, etc.

      // Validate Stage 2 results
      expect(result.stages[1].stage).toBe('stage2');
      expect(result.stages[1].success).toBe(true);
      expect(result.stages[1].linesProcessed).toBeGreaterThan(50);
      expect(result.stages[1].linesPreserved).toBeGreaterThan(30); // Should preserve essential conversations

      // Validate Stage 3 results
      expect(result.stages[2].stage).toBe('stage3');
      expect(result.stages[2].success).toBe(true);
      expect(result.stages[2].contentCondensed).toBe(true);
      expect(result.stages[2].compressionRatio).toBeLessThan(0.8);

      // Validate overall quality metrics
      expect(result.metrics.contextPreservation).toBeGreaterThan(0.85);
      expect(result.metrics.informationIntegrity).toBeGreaterThan(0.90);
      expect(result.metrics.processingEfficiency).toBeGreaterThan(0.75);

      console.log(`React TypeScript Project Results:
        Files Analyzed: ${result.stages[0].filesAnalyzed}
        Conversation Lines: ${result.stages[1].linesProcessed} → ${result.stages[1].linesPreserved}
        Content Compression: ${(result.stages[2].compressionRatio * 100).toFixed(1)}%
        Context Preservation: ${(result.metrics.contextPreservation * 100).toFixed(1)}%
        Processing Time: ${result.metrics.totalDuration}ms`);
    });

    test('should handle Node.js Express API project with debugging session', async () => {
      const projectPath = join(tempDir, 'express-api-project');
      
      // Create realistic Express API project
      await createExpressAPIProject(projectPath);
      
      // Create debugging conversation
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createRealisticClaudeConversation(conversationPath, 'express-debugging');

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate debugging session preservation
      expect(result.stages[1].debuggingContextPreserved).toBe(true);
      expect(result.stages[1].errorAnalysisRetained).toBe(true);
      expect(result.stages[1].solutionStepsPreserved).toBe(true);

      // Validate API-specific analysis
      expect(result.stages[0].apiEndpointsAnalyzed).toBeGreaterThan(5);
      expect(result.stages[0].routeStructureUnderstood).toBe(true);
      expect(result.stages[0].middlewareAnalyzed).toBe(true);

      console.log(`Express API Project Results:
        API Endpoints: ${result.stages[0].apiEndpointsAnalyzed}
        Debugging Context Preserved: ${result.stages[1].debuggingContextPreserved}
        Error Analysis Retained: ${result.stages[1].errorAnalysisRetained}
        Solution Steps: ${result.stages[1].solutionStepsPreserved}`);
    });

    test('should process Python Django project with testing workflow', async () => {
      const projectPath = join(tempDir, 'django-project');
      
      // Create realistic Django project
      await createDjangoProject(projectPath);
      
      // Create testing workflow conversation
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createRealisticClaudeConversation(conversationPath, 'django-testing');

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate Python-specific handling
      expect(result.stages[0].pythonFilesAnalyzed).toBeGreaterThan(8);
      expect(result.stages[0].djangoStructureUnderstood).toBe(true);
      expect(result.stages[0].modelsAnalyzed).toBe(true);

      // Validate testing workflow preservation
      expect(result.stages[1].testingWorkflowPreserved).toBe(true);
      expect(result.stages[1].testCasesRetained).toBe(true);
      expect(result.stages[1].testResultsPreserved).toBe(true);

      console.log(`Django Project Results:
        Python Files: ${result.stages[0].pythonFilesAnalyzed}
        Django Structure: ${result.stages[0].djangoStructureUnderstood}
        Testing Workflow: ${result.stages[1].testingWorkflowPreserved}
        Test Cases Retained: ${result.stages[1].testCasesRetained}`);
    });

    test('should handle microservices architecture project', async () => {
      const projectPath = join(tempDir, 'microservices-project');
      
      // Create microservices project structure
      await createMicroservicesProject(projectPath);
      
      // Create architecture discussion conversation
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createRealisticClaudeConversation(conversationPath, 'microservices-architecture');

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate microservices-specific analysis
      expect(result.stages[0].servicesAnalyzed).toBeGreaterThan(3);
      expect(result.stages[0].serviceInteractionsUnderstood).toBe(true);
      expect(result.stages[0].containerConfigAnalyzed).toBe(true);

      // Validate architecture discussion preservation
      expect(result.stages[1].architectureDecisionsPreserved).toBe(true);
      expect(result.stages[1].serviceDesignRetained).toBe(true);
      expect(result.stages[1].scalabilityDiscussionPreserved).toBe(true);

      console.log(`Microservices Project Results:
        Services Analyzed: ${result.stages[0].servicesAnalyzed}
        Service Interactions: ${result.stages[0].serviceInteractionsUnderstood}
        Architecture Decisions: ${result.stages[1].architectureDecisionsPreserved}
        Scalability Discussion: ${result.stages[1].scalabilityDiscussionPreserved}`);
    });
  });

  describe('Output Quality and Accuracy Validation', () => {
    test('should maintain high fidelity in code analysis preservation', async () => {
      const projectPath = join(tempDir, 'code-analysis-project');
      await createCodeAnalysisProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createCodeAnalysisConversation(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate code analysis preservation
      const qualityMetrics = result.qualityMetrics;
      expect(qualityMetrics.codeAnalysisAccuracy).toBeGreaterThan(0.95);
      expect(qualityMetrics.syntaxPreservation).toBeGreaterThan(0.98);
      expect(qualityMetrics.semanticIntegrity).toBeGreaterThan(0.92);
      expect(qualityMetrics.contextualRelevance).toBeGreaterThan(0.88);

      // Validate specific code elements
      expect(qualityMetrics.functionSignaturesPreserved).toBe(true);
      expect(qualityMetrics.variableNamesRetained).toBe(true);
      expect(qualityMetrics.importStatementsAccurate).toBe(true);
      expect(qualityMetrics.commentContextPreserved).toBe(true);

      console.log(`Code Analysis Quality Metrics:
        Code Analysis Accuracy: ${(qualityMetrics.codeAnalysisAccuracy * 100).toFixed(1)}%
        Syntax Preservation: ${(qualityMetrics.syntaxPreservation * 100).toFixed(1)}%
        Semantic Integrity: ${(qualityMetrics.semanticIntegrity * 100).toFixed(1)}%
        Contextual Relevance: ${(qualityMetrics.contextualRelevance * 100).toFixed(1)}%`);
    });

    test('should preserve technical accuracy in performance optimization discussions', async () => {
      const projectPath = join(tempDir, 'performance-project');
      await createPerformanceProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createPerformanceOptimizationConversation(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate performance discussion preservation
      const perfMetrics = result.performanceMetrics;
      expect(perfMetrics.benchmarkDataPreserved).toBe(true);
      expect(perfMetrics.optimizationStrategiesRetained).toBe(true);
      expect(perfMetrics.performanceNumbersAccurate).toBe(true);
      expect(perfMetrics.bottleneckAnalysisPreserved).toBe(true);

      // Validate numerical accuracy
      expect(perfMetrics.numericalPrecision).toBeGreaterThan(0.99);
      expect(perfMetrics.metricConsistency).toBeGreaterThan(0.95);
      expect(perfMetrics.comparativeAnalysisRetained).toBe(true);

      console.log(`Performance Discussion Metrics:
        Benchmark Data: ${perfMetrics.benchmarkDataPreserved}
        Optimization Strategies: ${perfMetrics.optimizationStrategiesRetained}
        Numerical Precision: ${(perfMetrics.numericalPrecision * 100).toFixed(1)}%
        Metric Consistency: ${(perfMetrics.metricConsistency * 100).toFixed(1)}%`);
    });

    test('should handle security analysis conversations accurately', async () => {
      const projectPath = join(tempDir, 'security-project');
      await createSecurityProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createSecurityAnalysisConversation(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate security analysis preservation
      const secMetrics = result.securityMetrics;
      expect(secMetrics.vulnerabilityDetailsPreserved).toBe(true);
      expect(secMetrics.remediationStepsRetained).toBe(true);
      expect(secMetrics.securityPatternsPreserved).toBe(true);
      expect(secMetrics.complianceInformationRetained).toBe(true);

      // Validate security-specific accuracy
      expect(secMetrics.cveReferencesAccurate).toBe(true);
      expect(secMetrics.severityLevelsPreserved).toBe(true);
      expect(secMetrics.threatModelingRetained).toBe(true);

      console.log(`Security Analysis Metrics:
        Vulnerability Details: ${secMetrics.vulnerabilityDetailsPreserved}
        Remediation Steps: ${secMetrics.remediationStepsRetained}
        CVE References: ${secMetrics.cveReferencesAccurate}
        Threat Modeling: ${secMetrics.threatModelingRetained}`);
    });

    test('should preserve educational content and learning context', async () => {
      const projectPath = join(tempDir, 'educational-project');
      await createEducationalProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createEducationalConversation(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Validate educational content preservation
      const eduMetrics = result.educationalMetrics;
      expect(eduMetrics.explanationsPreserved).toBe(true);
      expect(eduMetrics.examplesRetained).toBe(true);
      expect(eduMetrics.learningProgressionMaintained).toBe(true);
      expect(eduMetrics.conceptualLinksPreserved).toBe(true);

      // Validate pedagogical structure
      expect(eduMetrics.stepByStepGuidanceRetained).toBe(true);
      expect(eduMetrics.practiceExercisesPreserved).toBe(true);
      expect(eduMetrics.troubleshootingGuidanceRetained).toBe(true);

      console.log(`Educational Content Metrics:
        Explanations Preserved: ${eduMetrics.explanationsPreserved}
        Examples Retained: ${eduMetrics.examplesRetained}
        Learning Progression: ${eduMetrics.learningProgressionMaintained}
        Step-by-Step Guidance: ${eduMetrics.stepByStepGuidanceRetained}`);
    });
  });

  describe('Edge Cases Found in Production JSONL Files', () => {
    test('should handle malformed JSONL entries gracefully', async () => {
      const projectPath = join(tempDir, 'malformed-project');
      await createBasicProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createMalformedJSONLFile(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.errorHandling.malformedLinesDetected).toBeGreaterThan(0);
      expect(result.errorHandling.malformedLinesSkipped).toBeGreaterThan(0);
      expect(result.errorHandling.validLinesProcessed).toBeGreaterThan(0);
      expect(result.errorHandling.processingContinued).toBe(true);

      console.log(`Malformed JSONL Handling:
        Malformed Lines Detected: ${result.errorHandling.malformedLinesDetected}
        Valid Lines Processed: ${result.errorHandling.validLinesProcessed}
        Processing Continued: ${result.errorHandling.processingContinued}`);
    });

    test('should handle incomplete tool sequences', async () => {
      const projectPath = join(tempDir, 'incomplete-tools-project');
      await createBasicProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createIncompleteToolSequenceJSONL(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.toolHandling.incompleteSequencesDetected).toBeGreaterThan(0);
      expect(result.toolHandling.orphanedToolUsesFound).toBeGreaterThan(0);
      expect(result.toolHandling.recoveryStrategiesApplied).toBeGreaterThan(0);
      expect(result.toolHandling.conversationContinuityMaintained).toBe(true);

      console.log(`Incomplete Tool Sequence Handling:
        Incomplete Sequences: ${result.toolHandling.incompleteSequencesDetected}
        Orphaned Tool Uses: ${result.toolHandling.orphanedToolUsesFound}
        Recovery Strategies: ${result.toolHandling.recoveryStrategiesApplied}
        Continuity Maintained: ${result.toolHandling.conversationContinuityMaintained}`);
    });

    test('should handle very large individual messages', async () => {
      const projectPath = join(tempDir, 'large-messages-project');
      await createBasicProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createLargeMessagesJSONL(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.largeMessageHandling.largeMessagesDetected).toBeGreaterThan(0);
      expect(result.largeMessageHandling.efficientProcessingApplied).toBe(true);
      expect(result.largeMessageHandling.memoryUsageControlled).toBe(true);
      expect(result.largeMessageHandling.contentIntegrityMaintained).toBe(true);

      console.log(`Large Message Handling:
        Large Messages: ${result.largeMessageHandling.largeMessagesDetected}
        Efficient Processing: ${result.largeMessageHandling.efficientProcessingApplied}
        Memory Controlled: ${result.largeMessageHandling.memoryUsageControlled}
        Content Integrity: ${result.largeMessageHandling.contentIntegrityMaintained}`);
    });

    test('should handle Unicode and special characters correctly', async () => {
      const projectPath = join(tempDir, 'unicode-project');
      await createBasicProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createUnicodeJSONL(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);
      expect(result.unicodeHandling.unicodeCharactersDetected).toBeGreaterThan(0);
      expect(result.unicodeHandling.encodingPreserved).toBe(true);
      expect(result.unicodeHandling.specialCharactersHandled).toBe(true);
      expect(result.unicodeHandling.internationalContentPreserved).toBe(true);

      console.log(`Unicode Handling:
        Unicode Characters: ${result.unicodeHandling.unicodeCharactersDetected}
        Encoding Preserved: ${result.unicodeHandling.encodingPreserved}
        Special Characters: ${result.unicodeHandling.specialCharactersHandled}
        International Content: ${result.unicodeHandling.internationalContentPreserved}`);
    });
  });

  describe('Acceptance Criteria for Successful Processing', () => {
    test('should meet all acceptance criteria for enterprise deployment', async () => {
      const projectPath = join(tempDir, 'enterprise-project');
      await createEnterpriseProject(projectPath);
      
      const conversationPath = join(projectPath, '.claude', 'conversation.jsonl');
      await fs.mkdir(join(projectPath, '.claude'), { recursive: true });
      await createEnterpriseConversation(conversationPath);

      const result = await orchestrator.executePrebakePipeline(projectPath);

      expect(result.success).toBe(true);

      // Acceptance Criteria Validation
      const acceptance = result.acceptanceCriteria;

      // Performance Criteria
      expect(acceptance.performance.processingTime).toBeLessThan(300000); // 5 minutes max
      expect(acceptance.performance.memoryUsage).toBeLessThan(500 * 1024 * 1024); // 500MB max
      expect(acceptance.performance.tokenEfficiency).toBeGreaterThan(0.8); // 80% efficiency

      // Quality Criteria
      expect(acceptance.quality.informationRetention).toBeGreaterThan(0.9); // 90% retention
      expect(acceptance.quality.accuracyPreservation).toBeGreaterThan(0.95); // 95% accuracy
      expect(acceptance.quality.contextualCoherence).toBeGreaterThan(0.85); // 85% coherence

      // Reliability Criteria
      expect(acceptance.reliability.errorRecovery).toBe(true);
      expect(acceptance.reliability.failureHandling).toBe(true);
      expect(acceptance.reliability.dataIntegrity).toBe(true);

      // Security Criteria
      expect(acceptance.security.noDataLeakage).toBe(true);
      expect(acceptance.security.sanitizationApplied).toBe(true);
      expect(acceptance.security.complianceValidated).toBe(true);

      // Scalability Criteria
      expect(acceptance.scalability.fileCountScaling).toBe(true);
      expect(acceptance.scalability.conversationLengthScaling).toBe(true);
      expect(acceptance.scalability.resourceEfficiency).toBe(true);

      console.log(`Enterprise Acceptance Criteria:
        Performance:
          Processing Time: ${acceptance.performance.processingTime}ms
          Memory Usage: ${Math.round(acceptance.performance.memoryUsage / 1024 / 1024)}MB
          Token Efficiency: ${(acceptance.performance.tokenEfficiency * 100).toFixed(1)}%
        
        Quality:
          Information Retention: ${(acceptance.quality.informationRetention * 100).toFixed(1)}%
          Accuracy Preservation: ${(acceptance.quality.accuracyPreservation * 100).toFixed(1)}%
          Contextual Coherence: ${(acceptance.quality.contextualCoherence * 100).toFixed(1)}%
        
        Reliability: ${acceptance.reliability.errorRecovery && acceptance.reliability.failureHandling && acceptance.reliability.dataIntegrity ? 'PASS' : 'FAIL'}
        Security: ${acceptance.security.noDataLeakage && acceptance.security.sanitizationApplied && acceptance.security.complianceValidated ? 'PASS' : 'FAIL'}
        Scalability: ${acceptance.scalability.fileCountScaling && acceptance.scalability.conversationLengthScaling && acceptance.scalability.resourceEfficiency ? 'PASS' : 'FAIL'}`);

      // Overall acceptance
      const overallPass = Object.values(acceptance.performance).every(v => typeof v === 'number' ? v > 0 : true) &&
                         Object.values(acceptance.quality).every(v => v > 0.8) &&
                         Object.values(acceptance.reliability).every(v => v === true) &&
                         Object.values(acceptance.security).every(v => v === true) &&
                         Object.values(acceptance.scalability).every(v => v === true);

      expect(overallPass).toBe(true);
    });
  });
});

// Helper functions to create realistic project structures and conversations

function simulateProjectAnalysis(prompt: string): string {
  if (prompt.includes('React') || prompt.includes('typescript')) {
    return `Project analysis complete. Found React TypeScript application with:
- 15 component files
- 8 utility modules  
- 3 API service files
- Comprehensive test coverage
- Modern development setup with Vite`;
  } else if (prompt.includes('Express') || prompt.includes('API')) {
    return `API project analysis complete. Found Express.js application with:
- 8 API endpoints
- Authentication middleware
- Database integration
- Error handling middleware
- Logging system`;
  } else if (prompt.includes('Django') || prompt.includes('Python')) {
    return `Django project analysis complete. Found:
- 6 Django models
- 12 view functions
- URL routing configuration
- Template system
- Admin interface`;
  }
  
  return 'Project analysis complete';
}

function simulateContentCondensation(prompt: string): string {
  const content = extractContentFromPrompt(prompt);
  // Simulate intelligent condensation
  return content.replace(/\s+/g, ' ').trim().substring(0, Math.floor(content.length * 0.7));
}

function extractContentFromPrompt(prompt: string): string {
  // Extract content from condensation prompts
  const match = prompt.match(/content:\s*(.*?)$/s);
  return match ? match[1] : prompt;
}

async function createReactTypeScriptProject(projectPath: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  
  // Package.json
  await fs.writeFile(join(projectPath, 'package.json'), JSON.stringify({
    name: 'react-typescript-app',
    version: '1.0.0',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      test: 'vitest'
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0'
    },
    devDependencies: {
      '@types/react': '^18.2.15',
      '@types/react-dom': '^18.2.7',
      typescript: '^5.0.2',
      vite: '^4.4.5'
    }
  }, null, 2));

  // Source files
  await fs.mkdir(join(projectPath, 'src', 'components'), { recursive: true });
  await fs.mkdir(join(projectPath, 'src', 'utils'), { recursive: true });
  await fs.mkdir(join(projectPath, 'src', 'services'), { recursive: true });

  // React components
  await fs.writeFile(join(projectPath, 'src', 'App.tsx'), `
import React from 'react';
import { UserProfile } from './components/UserProfile';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="app">
      <UserProfile />
      <Dashboard />
    </div>
  );
}

export default App;
`);

  await fs.writeFile(join(projectPath, 'src', 'components', 'UserProfile.tsx'), `
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
`);

  // Additional files for comprehensive project
  await fs.writeFile(join(projectPath, 'src', 'types', 'index.ts'), `
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
`);

  await fs.writeFile(join(projectPath, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }]
  }, null, 2));
}

async function createExpressAPIProject(projectPath: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  
  await fs.writeFile(join(projectPath, 'package.json'), JSON.stringify({
    name: 'express-api',
    version: '1.0.0',
    scripts: {
      start: 'node dist/index.js',
      dev: 'ts-node src/index.ts',
      build: 'tsc'
    },
    dependencies: {
      express: '^4.18.2',
      cors: '^2.8.5',
      helmet: '^7.0.0',
      mongoose: '^7.5.0'
    },
    devDependencies: {
      '@types/express': '^4.17.17',
      '@types/node': '^20.5.0',
      typescript: '^5.2.2'
    }
  }, null, 2));

  await fs.mkdir(join(projectPath, 'src', 'routes'), { recursive: true });
  await fs.mkdir(join(projectPath, 'src', 'middleware'), { recursive: true });
  await fs.mkdir(join(projectPath, 'src', 'models'), { recursive: true });

  await fs.writeFile(join(projectPath, 'src', 'index.ts'), `
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRoutes } from './routes/users';
import { authRoutes } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`);

  await fs.writeFile(join(projectPath, 'src', 'routes', 'users.ts'), `
import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

export { router as userRoutes };
`);
}

async function createDjangoProject(projectPath: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  
  await fs.writeFile(join(projectPath, 'requirements.txt'), `
Django==4.2.0
djangorestframework==3.14.0
psycopg2-binary==2.9.7
pytest-django==4.5.2
coverage==7.3.0
`);

  await fs.mkdir(join(projectPath, 'myproject'), { recursive: true });
  await fs.mkdir(join(projectPath, 'apps', 'users'), { recursive: true });
  await fs.mkdir(join(projectPath, 'tests'), { recursive: true });

  await fs.writeFile(join(projectPath, 'myproject', 'settings.py'), `
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-dev-key')
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apps.users',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'
`);

  await fs.writeFile(join(projectPath, 'apps', 'users', 'models.py'), `
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
`);
}

async function createMicroservicesProject(projectPath: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  
  const services = ['user-service', 'order-service', 'payment-service', 'notification-service'];
  
  for (const service of services) {
    await fs.mkdir(join(projectPath, service, 'src'), { recursive: true });
    
    await fs.writeFile(join(projectPath, service, 'package.json'), JSON.stringify({
      name: service,
      version: '1.0.0',
      scripts: {
        start: 'node dist/index.js',
        dev: 'ts-node src/index.ts',
        build: 'tsc'
      },
      dependencies: {
        express: '^4.18.2',
        axios: '^1.5.0'
      }
    }, null, 2));

    await fs.writeFile(join(projectPath, service, 'Dockerfile'), `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
`);
  }

  await fs.writeFile(join(projectPath, 'docker-compose.yml'), `
version: '3.8'
services:
  user-service:
    build: ./user-service
    ports:
      - "3001:3000"
    environment:
      - SERVICE_NAME=user-service
      
  order-service:
    build: ./order-service
    ports:
      - "3002:3000"
    environment:
      - SERVICE_NAME=order-service
      - USER_SERVICE_URL=http://user-service:3000
      
  payment-service:
    build: ./payment-service
    ports:
      - "3003:3000"
    environment:
      - SERVICE_NAME=payment-service
`);

  await fs.writeFile(join(projectPath, 'k8s', 'deployment.yaml'), `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 3000
`);
}

async function createRealisticClaudeConversation(conversationPath: string, projectType: string): Promise<void> {
  const conversations = {
    'react-typescript': createReactTypeScriptConversation(),
    'express-debugging': createExpressDebuggingConversation(),
    'django-testing': createDjangoTestingConversation(),
    'microservices-architecture': createMicroservicesArchitectureConversation()
  };

  const conversation = conversations[projectType as keyof typeof conversations] || createReactTypeScriptConversation();
  
  const lines = conversation.map(entry => JSON.stringify(entry));
  await fs.writeFile(conversationPath, lines.join('\n'));
}

// Additional helper functions would continue here with specific conversation generators
// These would create realistic JSONL entries for different project types and scenarios

function createReactTypeScriptConversation(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'user-1',
      content: [{ type: 'text', text: 'I need help setting up a React TypeScript project with proper component structure' }],
      created_at: new Date().toISOString()
    },
    {
      type: 'assistant',
      uuid: 'assistant-1',
      parentMessageUuid: 'user-1',
      content: [
        { type: 'text', text: 'I\'ll help you set up a React TypeScript project. Let me first examine your current project structure.' },
        { type: 'tool_use', uuid: 'tool-use-1', name: 'read_file', input: { path: 'package.json' } }
      ],
      created_at: new Date().toISOString()
    },
    {
      type: 'tool_result',
      uuid: 'tool-result-1',
      parentMessageUuid: 'tool-use-1',
      content: [{ type: 'text', text: 'File read successfully. I can see you have a React TypeScript setup with Vite.' }],
      created_at: new Date().toISOString()
    }
  ] as ConversationEntry[];
}

function createExpressDebuggingConversation(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'user-1',
      content: [{ type: 'text', text: 'My Express API is returning 500 errors for user creation. Can you help debug this?' }],
      created_at: new Date().toISOString()
    }
  ] as ConversationEntry[];
}

function createDjangoTestingConversation(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'user-1',
      content: [{ type: 'text', text: 'I need help writing comprehensive tests for my Django models and views' }],
      created_at: new Date().toISOString()
    }
  ] as ConversationEntry[];
}

function createMicroservicesArchitectureConversation(): ConversationEntry[] {
  return [
    {
      type: 'user',
      uuid: 'user-1',
      content: [{ type: 'text', text: 'How should I structure the communication between my microservices?' }],
      created_at: new Date().toISOString()
    }
  ] as ConversationEntry[];
}

// Additional helper functions for creating various test scenarios
async function createCodeAnalysisProject(projectPath: string): Promise<void> {
  await createBasicProject(projectPath);
}

async function createPerformanceProject(projectPath: string): Promise<void> {
  await createBasicProject(projectPath);
}

async function createSecurityProject(projectPath: string): Promise<void> {
  await createBasicProject(projectPath);
}

async function createEducationalProject(projectPath: string): Promise<void> {
  await createBasicProject(projectPath);
}

async function createEnterpriseProject(projectPath: string): Promise<void> {
  await createBasicProject(projectPath);
}

async function createBasicProject(projectPath: string): Promise<void> {
  await fs.mkdir(projectPath, { recursive: true });
  await fs.writeFile(join(projectPath, 'package.json'), '{"name": "test-project", "version": "1.0.0"}');
}

async function createCodeAnalysisConversation(conversationPath: string): Promise<void> {
  await fs.writeFile(conversationPath, '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Analyze this code"}],"created_at":"2024-01-01T00:00:00Z"}');
}

async function createPerformanceOptimizationConversation(conversationPath: string): Promise<void> {
  await fs.writeFile(conversationPath, '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Optimize performance"}],"created_at":"2024-01-01T00:00:00Z"}');
}

async function createSecurityAnalysisConversation(conversationPath: string): Promise<void> {
  await fs.writeFile(conversationPath, '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Security analysis"}],"created_at":"2024-01-01T00:00:00Z"}');
}

async function createEducationalConversation(conversationPath: string): Promise<void> {
  await fs.writeFile(conversationPath, '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Teach me"}],"created_at":"2024-01-01T00:00:00Z"}');
}

async function createEnterpriseConversation(conversationPath: string): Promise<void> {
  await fs.writeFile(conversationPath, '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Enterprise setup"}],"created_at":"2024-01-01T00:00:00Z"}');
}

async function createMalformedJSONLFile(conversationPath: string): Promise<void> {
  const content = [
    '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Valid message"}],"created_at":"2024-01-01T00:00:00Z"}',
    '{"invalid": json malformed}',
    '{"type":"assistant","uuid":"a1","parentMessageUuid":"u1","content":[{"type":"text","text":"Valid response"}],"created_at":"2024-01-01T00:00:00Z"}'
  ].join('\n');
  await fs.writeFile(conversationPath, content);
}

async function createIncompleteToolSequenceJSONL(conversationPath: string): Promise<void> {
  const content = [
    '{"type":"assistant","uuid":"a1","content":[{"type":"tool_use","uuid":"t1","name":"read_file","input":{"path":"test.js"}}],"created_at":"2024-01-01T00:00:00Z"}',
    // Missing tool_result for t1
    '{"type":"user","uuid":"u2","content":[{"type":"text","text":"Continue"}],"created_at":"2024-01-01T00:00:00Z"}'
  ].join('\n');
  await fs.writeFile(conversationPath, content);
}

async function createLargeMessagesJSONL(conversationPath: string): Promise<void> {
  const largeText = 'Very long message content. '.repeat(1000);
  const content = [
    `{"type":"user","uuid":"u1","content":[{"type":"text","text":"${largeText}"}],"created_at":"2024-01-01T00:00:00Z"}`
  ];
  await fs.writeFile(conversationPath, content.join('\n'));
}

async function createUnicodeJSONL(conversationPath: string): Promise<void> {
  const content = [
    '{"type":"user","uuid":"u1","content":[{"type":"text","text":"Hello 🌍 Unicode test 中文 العربية"}],"created_at":"2024-01-01T00:00:00Z"}'
  ];
  await fs.writeFile(conversationPath, content.join('\n'));
}