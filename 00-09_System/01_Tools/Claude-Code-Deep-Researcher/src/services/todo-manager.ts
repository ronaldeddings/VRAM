import type { Options, HookCallback, PreToolUseHookInput, PostToolUseHookInput } from '@anthropic-ai/claude-agent-sdk';
import type { Todo, TaskRequirements } from '../types/index.ts';

/**
 * Todo list management service with max task control and specification
 * Implements Core Features 2 and 6
 */
export class TodoManager {
  private maxTasks: number;
  private requiredTasks: string[];
  private forbiddenTasks: string[];
  private currentTodos: Todo[] = [];

  constructor(config: {
    maxTasks?: number;
    requiredTasks?: string[];
    forbiddenTasks?: string[];
  } = {}) {
    this.maxTasks = config.maxTasks || 10;
    this.requiredTasks = config.requiredTasks || [];
    this.forbiddenTasks = config.forbiddenTasks || [];
  }

  /**
   * Core Feature 2: Max Task Control - Specify maximum number of tasks in todo lists
   * Sets the maximum number of tasks allowed in todo lists
   */
  setMaxTasks(maxTasks: number): void {
    if (maxTasks < 1 || maxTasks > 50) {
      throw new Error('Max tasks must be between 1 and 50');
    }
    
    this.maxTasks = maxTasks;
    console.log(`📋 Max tasks set to: ${maxTasks}`);
  }

  /**
   * Gets the current maximum task limit
   */
  getMaxTasks(): number {
    return this.maxTasks;
  }

  /**
   * Core Feature 6: Task Specification - Specify which specific tasks must be included
   * Sets required tasks that must be present in todo lists
   */
  setRequiredTasks(requiredTasks: string[]): void {
    this.requiredTasks = [...requiredTasks];
    console.log(`✅ Required tasks set: ${requiredTasks.join(', ')}`);
  }

  /**
   * Gets the current required tasks
   */
  getRequiredTasks(): string[] {
    return [...this.requiredTasks];
  }

  /**
   * Sets forbidden tasks that should not appear in todo lists
   */
  setForbiddenTasks(forbiddenTasks: string[]): void {
    this.forbiddenTasks = [...forbiddenTasks];
    console.log(`🚫 Forbidden tasks set: ${forbiddenTasks.join(', ')}`);
  }

  /**
   * Gets the current forbidden tasks
   */
  getForbiddenTasks(): string[] {
    return [...this.forbiddenTasks];
  }

  /**
   * Validates a todo list against current constraints
   */
  validateTodos(todos: Todo[]): { valid: boolean; issues: string[]; validatedTodos: Todo[] } {
    const issues: string[] = [];
    let validatedTodos = [...todos];

    // Check max tasks limit
    if (todos.length > this.maxTasks) {
      issues.push(`Todo list exceeds maximum of ${this.maxTasks} tasks (has ${todos.length})`);
      // Truncate to max limit
      validatedTodos = todos.slice(0, this.maxTasks);
    }

    // Check for required tasks
    const todoContents = validatedTodos.map(todo => todo.content.toLowerCase());
    for (const requiredTask of this.requiredTasks) {
      const found = todoContents.some(content => 
        content.includes(requiredTask.toLowerCase())
      );
      if (!found) {
        issues.push(`Required task missing: "${requiredTask}"`);
        // Add missing required task
        validatedTodos.push({
          content: requiredTask,
          status: 'pending',
          activeForm: `Working on ${requiredTask.toLowerCase()}`
        });
        todoContents.push(requiredTask.toLowerCase()); // Update contents array
      }
    }

    // Check for forbidden tasks
    const forbiddenFound: string[] = [];
    validatedTodos = validatedTodos.filter(todo => {
      const isForbidden = this.forbiddenTasks.some(forbidden => 
        todo.content.toLowerCase().includes(forbidden.toLowerCase())
      );
      if (isForbidden) {
        forbiddenFound.push(todo.content);
        return false;
      }
      return true;
    });

    if (forbiddenFound.length > 0) {
      issues.push(`Forbidden tasks removed: ${forbiddenFound.join(', ')}`);
    }

    // Ensure only one task is in progress
    const inProgressTasks = validatedTodos.filter(todo => todo.status === 'in_progress');
    if (inProgressTasks.length > 1) {
      issues.push(`Multiple tasks in progress (${inProgressTasks.length}), keeping only the first one`);
      // Set all but first to pending
      for (let i = 1; i < inProgressTasks.length; i++) {
        const taskIndex = validatedTodos.findIndex(todo => 
          todo.content === inProgressTasks[i]!.content && todo.status === 'in_progress'
        );
        if (taskIndex !== -1) {
          validatedTodos[taskIndex]!.status = 'pending';
        }
      }
    }

    // Re-check max tasks after adding required tasks
    if (validatedTodos.length > this.maxTasks) {
      const excess = validatedTodos.length - this.maxTasks;
      issues.push(`After adding required tasks, list still exceeds max (removing ${excess} optional tasks)`);
      
      // Keep required tasks and trim optional ones
      const requiredTodoIndices: number[] = [];
      validatedTodos.forEach((todo, index) => {
        if (this.requiredTasks.some(req => todo.content.toLowerCase().includes(req.toLowerCase()))) {
          requiredTodoIndices.push(index);
        }
      });

      const requiredTodos = requiredTodoIndices.map(i => validatedTodos[i]!).filter((todo): todo is Todo => todo !== undefined);
      const optionalTodos = validatedTodos.filter((_, i) => !requiredTodoIndices.includes(i));
      
      validatedTodos = [
        ...requiredTodos,
        ...optionalTodos.slice(0, this.maxTasks - requiredTodos.length)
      ];
    }

    return {
      valid: issues.length === 0,
      issues,
      validatedTodos
    };
  }

  /**
   * Creates todos for required tasks based on a main prompt
   */
  createTodosForRequiredTasks(mainPrompt: string): Todo[] {
    const todos: Todo[] = [];
    
    // Add a todo for the main prompt if it's not just answering a simple question
    if (mainPrompt && mainPrompt.trim()) {
      const mainTask = this.inferMainTaskFromPrompt(mainPrompt);
      todos.push({
        content: mainTask,
        status: 'pending',
        activeForm: `Working on ${mainTask.toLowerCase()}`
      });
    }

    // Add required tasks
    for (const requiredTask of this.requiredTasks) {
      todos.push({
        content: requiredTask,
        status: 'pending', 
        activeForm: `Working on ${requiredTask.toLowerCase()}`
      });
    }

    return todos;
  }

  /**
   * Infers the main task description from a user prompt
   */
  private inferMainTaskFromPrompt(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase().trim();
    
    // Simple question patterns
    if (lowerPrompt.startsWith('what ') || lowerPrompt.startsWith('when ') || 
        lowerPrompt.startsWith('where ') || lowerPrompt.startsWith('who ') ||
        lowerPrompt.startsWith('how ') || lowerPrompt.startsWith('why ')) {
      return `Answer: ${prompt}`;
    }
    
    // Command patterns
    if (lowerPrompt.startsWith('create ') || lowerPrompt.startsWith('build ') ||
        lowerPrompt.startsWith('implement ')) {
      return prompt;
    }
    
    // Default - just use the prompt as-is for the main task
    return `Complete: ${prompt}`;
  }

  /**
   * Creates SDK options with todo control hooks
   */
  createOptionsWithTodoControl(baseOptions: Partial<Options> = {}): Options {
    const preToolUseHook: HookCallback = async (input, toolUseId, { signal }) => {
      if (input.hook_event_name === 'PreToolUse' && input.tool_name === 'TodoWrite') {
        const todoInput = input as PreToolUseHookInput;
        const toolInput = todoInput.tool_input as { todos: Todo[] } | undefined;
        
        if (!toolInput?.todos) {
          return { continue: true };
        }
        
        console.log(`🔍 Intercepting TodoWrite with ${toolInput.todos.length} tasks`);
        
        const validation = this.validateTodos(toolInput.todos);
        
        if (!validation.valid) {
          console.warn(`⚠️ Todo validation issues: ${validation.issues.join(', ')}`);
        }

        // Update current todos state
        this.currentTodos = validation.validatedTodos;
        
        // Return continue to allow the modified todos to be used
        return {
          continue: true,
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'allow',
            permissionDecisionReason: validation.issues.length > 0 
              ? `Modified todos: ${validation.issues.join('; ')}`
              : 'Todos validated successfully'
          }
        };
      }
      
      return { continue: true };
    };

    const postToolUseHook: HookCallback = async (input, toolUseId, { signal }) => {
      if (input.hook_event_name === 'PostToolUse' && input.tool_name === 'TodoWrite') {
        const postInput = input as PostToolUseHookInput;
        const toolResponse = postInput.tool_response as any;
        
        console.log(`📝 TodoWrite completed, monitoring progress`);
        
        // Extract todo state from response if available
        if (toolResponse?.todos) {
          this.currentTodos = toolResponse.todos;
          this.logTodoStats();
        }
        
        return { continue: true };
      }
      
      return { continue: true };
    };

    return {
      ...baseOptions,
      hooks: {
        ...baseOptions.hooks,
        PreToolUse: [
          ...(baseOptions.hooks?.PreToolUse || []),
          {
            matcher: 'TodoWrite',
            hooks: [preToolUseHook]
          }
        ],
        PostToolUse: [
          ...(baseOptions.hooks?.PostToolUse || []),
          {
            matcher: 'TodoWrite', 
            hooks: [postToolUseHook]
          }
        ]
      }
    };
  }

  /**
   * Creates options that prevent automatic todo creation
   */
  createOptionsWithTodoBlocking(baseOptions: Partial<Options> = {}): Options {
    const blockingHook: HookCallback = async (input, toolUseId, { signal }) => {
      if (input.hook_event_name === 'PreToolUse' && input.tool_name === 'TodoWrite') {
        console.log(`🚫 Blocking automatic TodoWrite`);
        
        return {
          decision: 'block',
          stopReason: 'Automatic todo creation is disabled',
          systemMessage: 'Todo creation blocked. Use explicit todo management commands.'
        };
      }
      
      return { continue: true };
    };

    return {
      ...baseOptions,
      hooks: {
        ...baseOptions.hooks,
        PreToolUse: [
          ...(baseOptions.hooks?.PreToolUse || []),
          {
            matcher: 'TodoWrite',
            hooks: [blockingHook]
          }
        ]
      }
    };
  }

  /**
   * Creates options that filter tools to prevent todo creation
   */
  createOptionsWithoutTodoTool(baseOptions: Partial<Options> = {}): Options {
    const currentDisallowed = baseOptions.disallowedTools || [];
    
    return {
      ...baseOptions,
      disallowedTools: [...currentDisallowed, 'TodoWrite']
    };
  }

  /**
   * Manually creates and validates a todo list
   */
  createTodoList(tasks: string[]): { todos: Todo[]; validation: ReturnType<TodoManager['validateTodos']> } {
    const todos: Todo[] = tasks.map(task => ({
      content: task,
      status: 'pending' as const,
      activeForm: `Working on ${task.toLowerCase()}`
    }));

    const validation = this.validateTodos(todos);
    
    return {
      todos: validation.validatedTodos,
      validation
    };
  }

  /**
   * Updates the status of a specific task
   */
  updateTaskStatus(taskContent: string, newStatus: Todo['status']): boolean {
    const taskIndex = this.currentTodos.findIndex(todo => 
      todo.content.toLowerCase().includes(taskContent.toLowerCase())
    );

    if (taskIndex === -1) {
      return false;
    }

    // If setting to in_progress, ensure no other tasks are in_progress
    if (newStatus === 'in_progress') {
      this.currentTodos.forEach((todo: Todo) => {
        if (todo.status === 'in_progress') {
          todo.status = 'pending';
        }
      });
    }

    this.currentTodos[taskIndex]!.status = newStatus;
    console.log(`📋 Task "${taskContent}" status updated to: ${newStatus}`);
    
    this.logTodoStats();
    return true;
  }

  /**
   * Gets current todos state
   */
  getCurrentTodos(): Todo[] {
    return [...this.currentTodos];
  }

  /**
   * Gets todo progress statistics
   */
  getTodoStats(): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  } {
    const total = this.currentTodos.length;
    const pending = this.currentTodos.filter(t => t.status === 'pending').length;
    const inProgress = this.currentTodos.filter(t => t.status === 'in_progress').length;
    const completed = this.currentTodos.filter(t => t.status === 'completed').length;
    
    return {
      total,
      pending,
      inProgress,
      completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }

  /**
   * Logs current todo statistics
   */
  private logTodoStats(): void {
    const stats = this.getTodoStats();
    console.log(`📊 Todo Stats - Total: ${stats.total}, Pending: ${stats.pending}, In Progress: ${stats.inProgress}, Completed: ${stats.completed} (${stats.completionRate.toFixed(1)}%)`);
  }

  /**
   * Gets current task requirements configuration
   */
  getTaskRequirements(): TaskRequirements {
    return {
      requiredTasks: [...this.requiredTasks],
      maxTasks: this.maxTasks,
      forbiddenTasks: [...this.forbiddenTasks]
    };
  }

  /**
   * Updates task requirements configuration
   */
  updateTaskRequirements(requirements: Partial<TaskRequirements>): void {
    if (requirements.maxTasks !== undefined) {
      this.setMaxTasks(requirements.maxTasks);
    }
    
    if (requirements.requiredTasks !== undefined) {
      this.setRequiredTasks(requirements.requiredTasks);
    }
    
    if (requirements.forbiddenTasks !== undefined) {
      this.setForbiddenTasks(requirements.forbiddenTasks);
    }
  }
}