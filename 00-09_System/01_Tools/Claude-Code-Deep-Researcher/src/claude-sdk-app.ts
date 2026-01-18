import type { Options } from '@anthropic-ai/claude-agent-sdk';
import type { 
  ExecutionResult, 
  DuplicationResult, 
  DuplicateAndResumeResult, 
  TaskRequirements,
  SessionInfo,
  Todo
} from './types/index.ts';

import { 
  ConfigManager,
  ClaudeCodeService,
  SessionManager,
  PromptExecutor,
  TodoManager,
  ConversationManager,
  SessionBuilder,
  ProjectAnalyzer,
  ContextDistiller
} from './services/index.ts';

/**
 * Main Claude Code SDK Application class
 * Provides unified interface for all 6 core features
 */
export class ClaudeCodeApp {
  private configManager: ConfigManager;
  private claudeCodeService: ClaudeCodeService;
  private sessionManager: SessionManager;
  private promptExecutor: PromptExecutor;
  private todoManager: TodoManager;
  private conversationManager: ConversationManager;
  private sessionBuilder: SessionBuilder;
  private projectAnalyzer: ProjectAnalyzer;
  private contextDistiller: ContextDistiller;

  constructor(configPath?: string) {
    // Initialize configuration
    this.configManager = new ConfigManager(configPath);
    
    // Initialize core services
    this.claudeCodeService = new ClaudeCodeService(this.configManager);
    this.sessionManager = new SessionManager(this.configManager.get('projectsDirectory'));
    this.promptExecutor = new PromptExecutor(this.claudeCodeService);
    
    // Initialize todo manager with defaults from config
    this.todoManager = new TodoManager(this.configManager.get('todoDefaults'));
    
    // Initialize conversation manager
    this.conversationManager = new ConversationManager(this.claudeCodeService, this.promptExecutor, this.sessionManager);
    
    // Initialize session builder
    this.sessionBuilder = new SessionBuilder();
    
    // Initialize project context services
    this.projectAnalyzer = new ProjectAnalyzer(this.promptExecutor);
    this.contextDistiller = new ContextDistiller();

    console.log('🚀 Claude Code SDK Application initialized');
  }

  /**
   * Core Feature 1: Run Prompt - Execute prompts through Claude Code SDK
   */
  async runPrompt(prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    console.log(`\n🎯 FEATURE 1: Running prompt`);
    return await this.promptExecutor.runPrompt(prompt, options);
  }

  /**
   * Core Feature 1 (Extended): Run prompt with streaming for real-time feedback
   */
  async *runPromptStream(prompt: string, options: Partial<Options> = {}) {
    console.log(`\n🎯 FEATURE 1 (Stream): Running prompt with streaming`);
    yield* this.promptExecutor.runPromptStream(prompt, options);
  }

  /**
   * Core Feature 2: Max Task Control - Specify maximum number of tasks in todo lists
   */
  async setTodoLimits(maxTasks: number, requiredTasks?: string[]): Promise<void> {
    console.log(`\n🎯 FEATURE 2: Setting todo limits`);
    this.todoManager.setMaxTasks(maxTasks);
    
    if (requiredTasks) {
      this.todoManager.setRequiredTasks(requiredTasks);
    }
    
    console.log(`✅ Todo limits configured - Max: ${maxTasks}, Required: ${requiredTasks?.length || 0}`);
  }

  /**
   * Core Feature 2 (Extended): Run prompt with todo control
   */
  async runPromptWithTodoControl(prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    console.log(`\n🎯 FEATURE 2 (Extended): Running prompt with todo control`);
    const controlledOptions = this.todoManager.createOptionsWithTodoControl(options);
    return await this.promptExecutor.runPrompt(prompt, controlledOptions);
  }

  /**
   * Core Feature 3: Resume Conversation - Resume previous conversations from where they left off
   */
  async resumeConversation(sessionId: string, prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    console.log(`\n🎯 FEATURE 3: Resuming conversation`);
    return await this.conversationManager.resumeConversation(sessionId, prompt, options);
  }

  /**
   * Core Feature 4: Duplicate Conversation - Create exact copies of existing conversations
   */
  async duplicateConversation(sourceSessionId: string): Promise<DuplicationResult> {
    console.log(`\n🎯 FEATURE 4: Duplicating conversation`);
    return await this.conversationManager.duplicateConversation(sourceSessionId);
  }

  /**
   * Core Feature 5: Duplicate & Resume - Duplicate a conversation and immediately continue it
   */
  async duplicateAndResume(sourceSessionId: string, prompt: string, options: Partial<Options> = {}): Promise<DuplicateAndResumeResult> {
    console.log(`\n🎯 FEATURE 5: Duplicating and resuming conversation`);
    return await this.conversationManager.duplicateAndResume(sourceSessionId, prompt, options);
  }

  /**
   * Core Feature 6: Task Specification - Specify which specific tasks must be included in todo lists
   */
  async specifyRequiredTasks(requiredTasks: string[], forbiddenTasks?: string[]): Promise<void> {
    console.log(`\n🎯 FEATURE 6: Specifying required tasks`);
    this.todoManager.setRequiredTasks(requiredTasks);
    
    if (forbiddenTasks) {
      this.todoManager.setForbiddenTasks(forbiddenTasks);
    }
    
    console.log(`✅ Task specification configured - Required: ${requiredTasks.length}, Forbidden: ${forbiddenTasks?.length || 0}`);
  }

  /**
   * Core Feature 6 (Extended): Run prompt with task specification
   * Creates a pre-configured session with required tasks, then resumes it
   */
  async runPromptWithTaskSpec(prompt: string, requirements: TaskRequirements, options: Partial<Options> = {}): Promise<ExecutionResult> {
    console.log(`\n🎯 FEATURE 6 (Extended): Running prompt with task specification`);
    
    // Apply task requirements to todo manager
    this.todoManager.updateTaskRequirements(requirements);
    
    // Create todos for the main prompt + required tasks
    const todos = this.todoManager.createTodosForRequiredTasks(prompt);
    
    console.log(`📋 Creating pre-configured session with ${todos.length} tasks`);
    
    // Create a session with pre-configured todos
    const sessionId = this.sessionBuilder.createSessionWithTodos(prompt, todos, process.cwd());
    
    // Resume the pre-configured session to complete the tasks
    const resumePrompt = "Please continue with the current tasks.";
    
    return await this.conversationManager.resumeConversation(sessionId, resumePrompt, options);
  }

  /**
   * New Feature: Pre-Bake Project Context
   * Two-stage process: Deep analysis → Context distillation → Clean template creation
   */
  async prebakeProjectContext(
    projectPath?: string,
    options: {
      maxContextLength?: number;
      focusAreas?: string[];
      includeCodeExamples?: boolean;
      includeArchitecture?: boolean;
      includeWorkflows?: boolean;
      enableOptimization?: boolean;
      // Custom prompts for each stage
      stage1Prompt?: string;
      stage2Prompt?: string;
      stage3Prompt?: string;
      stage3Options?: {
        removeToolCalls?: boolean;
        removeIntermediateSteps?: boolean;
        condenseLargeFiles?: boolean;
        maxFileSnippetLines?: number;
      };
      // Stage selection
      stages?: number[]; // e.g., [1, 3] to run only stages 1 and 3
      inputSessionId?: string; // For starting from a specific stage
    } = {}
  ) {
    const targetPath = projectPath || process.cwd();
    console.log(`\n🧠 PRE-BAKING PROJECT CONTEXT: ${targetPath}`);
    
    // Default to all stages if none specified
    const stagesToRun = options.stages || [1, 2, 3];
    console.log(`📋 Running stages: ${stagesToRun.join(', ')}`);
    
    let analysisResult: any = null;
    let contextTemplate: any = null;
    let currentSessionId = options.inputSessionId;
    
    // Stage 1: Deep Analysis
    if (stagesToRun.includes(1)) {
      console.log('\n📋 STAGE 1: Deep Project Analysis');
      const analyzer = new ProjectAnalyzer(this.promptExecutor, targetPath);
      
      // Use custom prompt if provided
      if (options.stage1Prompt) {
        console.log('🎯 Using custom Stage 1 prompt');
        analysisResult = await analyzer.analyzeProjectWithCustomPrompt(options.stage1Prompt);
      } else {
        analysisResult = await analyzer.analyzeProject();
      }
      
      console.log(`✅ Analysis complete - Session: ${analysisResult.sessionId}`);
      console.log(`💰 Analysis cost: $${analysisResult.analysis.cost?.toFixed(4) || '0.0000'}`);
      
      // Validate that analysis was successful before proceeding
      if (!analysisResult.analysis.success || !analysisResult.sessionId) {
        throw new Error(`Stage 1 analysis failed: ${analysisResult.analysis.error || 'No session created'}`);
      }
      
      currentSessionId = analysisResult.sessionId;
    }
    
    // Stage 2: Context Distillation  
    if (stagesToRun.includes(2)) {
      console.log('\n🧪 STAGE 2: Context Distillation');
      
      if (!currentSessionId) {
        throw new Error('Stage 2 requires a session ID from Stage 1 or via inputSessionId option');
      }
      
      const distiller = new ContextDistiller(targetPath);
      
      // Use existing analysis result or create mock one for stage-only execution
      const inputForStage2 = analysisResult || {
        sessionId: currentSessionId,
        structure: { totalFiles: 0, directories: [], keyFiles: [] } // Mock structure
      };
      
      if (options.stage2Prompt) {
        console.log('🎯 Using custom Stage 2 approach');
        contextTemplate = await distiller.distillContextWithCustomPrompt(inputForStage2, options.stage2Prompt, options);
      } else {
        contextTemplate = await distiller.distillContext(inputForStage2, options);
      }
      
      console.log(`✨ Curated template created - Session: ${contextTemplate.sessionId}`);
      console.log(`💰 Stage 2 cost: $${contextTemplate.cost.toFixed(4)}`);
      console.log(`🎯 Tokens: ${contextTemplate.tokensUsed.input}→${contextTemplate.tokensUsed.output}`);
      
      currentSessionId = contextTemplate.sessionId;
    }
    
    // Stage 3: JSONL Optimization
    if (stagesToRun.includes(3) && options.enableOptimization !== false) {
      console.log('\n✂️ STAGE 3: JSONL Line Removal and Content Condensation');
      
      if (!currentSessionId) {
        throw new Error('Stage 3 requires a session ID from previous stages or via inputSessionId option');
      }
      
      const { ContentOptimizer } = await import('./services/content-optimizer.ts');
      const optimizer = new ContentOptimizer(this.promptExecutor, targetPath);
      
      // Use custom stage 3 options if provided
      const stage3Options = options.stage3Options || {
        removeToolCalls: false, // Use improved conservative defaults
        removeIntermediateSteps: false,
        condenseLargeFiles: true,
        maxFileSnippetLines: 15,
        keepOnlyEssentials: false
      };
      
      let optimization;
      if (options.stage3Prompt) {
        console.log('🎯 Using custom Stage 3 prompt');
        optimization = await optimizer.optimizeContentWithCustomPrompt(currentSessionId, options.stage3Prompt, stage3Options);
      } else {
        optimization = await optimizer.optimizeContent(currentSessionId, stage3Options);
      }
      
      // Update context template with optimization results
      if (contextTemplate) {
        contextTemplate = {
          ...contextTemplate,
          sessionId: optimization.optimizedSessionId,
          optimizedSessionId: optimization.optimizedSessionId,
          linesRemoved: optimization.linesRemoved,
          contentCondensed: optimization.contentCondensed
        };
      } else {
        // Create minimal template for stage 3 only execution
        contextTemplate = {
          sessionId: optimization.optimizedSessionId,
          optimizedSessionId: optimization.optimizedSessionId,
          linesRemoved: optimization.linesRemoved,
          contentCondensed: optimization.contentCondensed,
          projectName: 'Stage 3 Only',
          cost: 0,
          tokensUsed: { input: 0, output: 0 },
          keyFiles: [],
          commonTasks: [],
          createdAt: new Date()
        };
      }
      
      console.log(`✨ Optimized template created - Session: ${contextTemplate.optimizedSessionId}`);
      console.log(`🎯 Lines optimized: ${optimization.originalLines}→${optimization.optimizedLines} (${optimization.linesRemoved} removed, ${optimization.contentCondensed} condensed)`);
      
      currentSessionId = optimization.optimizedSessionId;
    }
    
    // Create minimal template if only running stage 1
    if (!contextTemplate && analysisResult) {
      contextTemplate = {
        projectName: targetPath.split('/').pop() || 'Project',
        sessionId: analysisResult.sessionId,
        originalSessionId: analysisResult.sessionId,
        curatedSessionId: analysisResult.sessionId,
        originalMessages: 0,
        curatedMessages: 0,
        createdAt: new Date(),
        reductionRatio: 0,
        cost: analysisResult.analysis?.cost || 0,
        tokensUsed: {
          input: analysisResult.analysis?.tokenUsage?.input || 0,
          output: analysisResult.analysis?.tokenUsage?.output || 0
        },
        keyFiles: analysisResult.structure?.keyFiles?.map(f => f.relativePath) || [],
        commonTasks: ['Development', 'Testing', 'Building', 'Deployment']
      };
    }

    // Summary
    console.log(`\n📊 PRE-BAKING COMPLETE`);
    console.log(`Project: ${contextTemplate?.projectName || 'Unknown'}`);
    console.log(`Template Session: ${contextTemplate?.sessionId || currentSessionId || 'N/A'}`);
    console.log(`Key Files: ${contextTemplate?.keyFiles?.length || 0}`);
    console.log(`Common Tasks: ${contextTemplate?.commonTasks?.length || 0}`);
    console.log(`Created: ${contextTemplate?.createdAt?.toISOString() || new Date().toISOString()}`);
    
    return {
      success: true,
      analysisSession: analysisResult?.sessionId || null,
      templateSession: contextTemplate?.sessionId || currentSessionId || null,
      template: contextTemplate,
      cost: contextTemplate?.cost || 0,
      tokensUsed: contextTemplate?.tokensUsed || { input: 0, output: 0 },
      stageResults: {
        stage1: analysisResult ? { summary: analysisResult.summary } : null,
        stage2: { originalMessages: contextTemplate?.originalMessages || 0, curatedMessages: contextTemplate?.curatedMessages || 0 },
        stage3: contextTemplate?.optimizedMessages ? { optimizedMessages: contextTemplate.optimizedMessages } : null
      }
    };
  }

  // === Utility and Management Methods ===

  /**
   * Gets session history for a project or all projects
   */
  async getSessionHistory(projectPath?: string): Promise<SessionInfo[]> {
    if (projectPath) {
      return this.sessionManager.getProjectSessionHistory(projectPath);
    } else {
      const projects = this.sessionManager.findAllProjects();
      const allSessions: SessionInfo[] = [];
      
      for (const project of projects) {
        const projectSessions = this.sessionManager.getProjectSessionHistory(project);
        allSessions.push(...projectSessions);
      }
      
      // Sort by timestamp (most recent first)
      allSessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return allSessions;
    }
  }

  /**
   * Lists all available sessions for resume/duplicate operations
   */
  async listAvailableSessions(projectPath?: string) {
    return await this.conversationManager.listAvailableSessions(projectPath);
  }

  /**
   * Gets detailed information about a specific session
   */
  async getSessionDetails(sessionId: string) {
    return await this.conversationManager.getSessionDetails(sessionId);
  }

  /**
   * Gets current todo manager configuration
   */
  getTodoConfiguration(): TaskRequirements {
    return this.todoManager.getTaskRequirements();
  }

  /**
   * Gets current todo state and statistics
   */
  getTodoState(): {
    todos: Todo[];
    stats: ReturnType<TodoManager['getTodoStats']>;
    requirements: TaskRequirements;
  } {
    return {
      todos: this.todoManager.getCurrentTodos(),
      stats: this.todoManager.getTodoStats(),
      requirements: this.todoManager.getTaskRequirements()
    };
  }

  /**
   * Updates application configuration
   */
  updateConfiguration(updates: any): void {
    this.configManager.updateConfig(updates);
    console.log('⚙️ Configuration updated');
  }

  /**
   * Gets current application configuration
   */
  getConfiguration() {
    return this.configManager.getConfig();
  }

  /**
   * Validates that all services are properly initialized
   */
  validateServices(): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    try {
      // Test configuration
      const config = this.configManager.getConfig();
      if (!config) {
        issues.push('Configuration manager not properly initialized');
      }

      // Test session manager
      const projects = this.sessionManager.findAllProjects();
      // This is expected to work even if no projects exist

      // Test todo manager
      const todoConfig = this.todoManager.getTaskRequirements();
      if (!todoConfig) {
        issues.push('Todo manager not properly initialized');
      }

    } catch (error) {
      issues.push(`Service validation error: ${error}`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Gets service instances for advanced usage
   */
  getServices() {
    return {
      configManager: this.configManager,
      claudeCodeService: this.claudeCodeService,
      sessionManager: this.sessionManager,
      promptExecutor: this.promptExecutor,
      todoManager: this.todoManager,
      conversationManager: this.conversationManager
    };
  }

  /**
   * Demonstrates all 6 core features with a test workflow
   */
  async demonstrateAllFeatures(): Promise<{
    feature1: ExecutionResult;
    feature2: void;
    feature3: ExecutionResult;
    feature4: DuplicationResult;
    feature5: DuplicateAndResumeResult;
    feature6: void;
    summary: string;
  }> {
    console.log('\n🎬 DEMONSTRATING ALL 6 CORE FEATURES\n');

    // Feature 1: Run Prompt
    console.log('=== FEATURE 1: Run Prompt ===');
    const feature1Result = await this.runPrompt('Hello, this is a test prompt to demonstrate the Claude Code SDK application.');

    // Feature 2: Max Task Control
    console.log('\n=== FEATURE 2: Max Task Control ===');
    await this.setTodoLimits(5, ['Test task', 'Validation task']);

    // Feature 6: Task Specification
    console.log('\n=== FEATURE 6: Task Specification ===');
    await this.specifyRequiredTasks(['Required test task'], ['Forbidden task']);

    // Feature 3: Resume Conversation (if we have a session)
    console.log('\n=== FEATURE 3: Resume Conversation ===');
    let feature3Result: ExecutionResult;
    if (feature1Result.success && feature1Result.sessionId) {
      feature3Result = await this.resumeConversation(feature1Result.sessionId, 'This is a follow-up message to test resume functionality.');
    } else {
      feature3Result = { success: false, messages: [], error: 'No session available for resume test' };
    }

    // Feature 4: Duplicate Conversation
    console.log('\n=== FEATURE 4: Duplicate Conversation ===');
    let feature4Result: DuplicationResult;
    if (feature1Result.success && feature1Result.sessionId) {
      feature4Result = await this.duplicateConversation(feature1Result.sessionId);
    } else {
      feature4Result = { newSessionId: '', success: false, error: 'No session available for duplication test' };
    }

    // Feature 5: Duplicate & Resume
    console.log('\n=== FEATURE 5: Duplicate & Resume ===');
    let feature5Result: DuplicateAndResumeResult;
    if (feature1Result.success && feature1Result.sessionId) {
      feature5Result = await this.duplicateAndResume(feature1Result.sessionId, 'This tests the duplicate and resume functionality.');
    } else {
      feature5Result = { newSessionId: '', messages: [], success: false, error: 'No session available for duplicate & resume test' };
    }

    const summary = `
📊 FEATURE DEMONSTRATION SUMMARY:
✅ Feature 1 (Run Prompt): ${feature1Result.success ? 'SUCCESS' : 'FAILED'}
✅ Feature 2 (Max Task Control): CONFIGURED
✅ Feature 3 (Resume Conversation): ${feature3Result.success ? 'SUCCESS' : 'FAILED'}
✅ Feature 4 (Duplicate Conversation): ${feature4Result.success ? 'SUCCESS' : 'FAILED'}
✅ Feature 5 (Duplicate & Resume): ${feature5Result.success ? 'SUCCESS' : 'FAILED'}
✅ Feature 6 (Task Specification): CONFIGURED

🎯 All 6 core features have been demonstrated!
`;

    console.log(summary);

    return {
      feature1: feature1Result,
      feature2: undefined,
      feature3: feature3Result,
      feature4: feature4Result,
      feature5: feature5Result,
      feature6: undefined,
      summary
    };
  }
}