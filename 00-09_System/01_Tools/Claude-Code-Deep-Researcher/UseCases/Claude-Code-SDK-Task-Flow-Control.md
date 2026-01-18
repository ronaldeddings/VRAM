# Claude Code SDK Task Flow Control and Thread Duplication

This document explains how Claude Code manages conversations through the `~/.claude/projects` directory structure and provides comprehensive insights into creating duplicate threads for feature development with optimal context preservation.

## Overview

Based on analysis of the `~/.claude/projects` directory structure and SDK implementation, Claude Code provides several mechanisms for conversation management and thread duplication:

1. **JSONL Thread Storage** - Persistent conversation history in JSON Lines format
2. **Session Management** - UUID-based thread identification and context preservation
3. **Context Window Management** - Token usage tracking and optimization
4. **Thread Duplication Strategy** - Creating focused conversation branches

## Directory Structure Analysis

### Project Storage Location
- **Base Directory**: `~/.claude/projects/`
- **Project Naming Convention**: `-{user}-{project-path-escaped}`
  - Slashes in paths are replaced with hyphens
  - Examples:
    - `/Users/ronaldeddings/ClaudeCodeDeepResearcher` → `-Users-ronaldeddings-ClaudeCodeDeepResearcher`
    - `/Users/ronaldeddings/Downloads/testclaude` → `-Users-ronaldeddings-Downloads-testclaude`

### Thread Storage Format

Each project directory contains multiple `.jsonl` (JSON Lines) files, where each file represents a conversation thread:

- **File naming**: Uses UUID format (e.g., `527aeaec-8901-4558-a077-081569cc1f73.jsonl`)
- **File format**: JSONL - one JSON object per line, each representing a message or event
- **File sizes**: Variable, from small (~268 bytes) to large (~2MB+) depending on conversation length and complexity

## JSONL Structure Analysis

Based on analysis of the conversation thread files, each line contains:

### Message Object Structure

```typescript
{
  parentUuid: string | null,           // Parent message UUID for threading
  isSidechain: boolean,                // Whether this is a side conversation
  userType: "external",                // Type of user (typically "external")
  cwd: string,                         // Current working directory when message was sent
  sessionId: string,                   // Unique session identifier (matches filename)
  version: string,                     // Claude Code version (e.g., "1.0.111")
  gitBranch: string,                   // Git branch context ("main")
  type: "user" | "assistant" | "system", // Message type
  message: {                           // The actual message content
    role: "user" | "assistant",
    content: string | object[],        // Text or structured content
    // Additional fields for assistant messages:
    id?: string,                       // API message ID
    model?: string,                    // Model used (e.g., "claude-sonnet-4-20250514")
    usage?: object,                    // Token usage information
    stop_reason?: string               // Why the response stopped
  },
  uuid: string,                        // Unique message identifier
  timestamp: string,                   // ISO timestamp
  requestId?: string,                  // API request identifier
  toolUseResult?: object              // Results from tool usage
}
```

### Key Fields for Thread Management

1. **sessionId**: Unique identifier linking all messages in a conversation thread
2. **parentUuid**: Creates message hierarchy and threading relationships
3. **cwd**: Working directory context preservation
4. **version**: Claude Code version for compatibility
5. **gitBranch**: Source code context
6. **timestamp**: Chronological ordering

## Thread Duplication Strategy

### Understanding Context Preservation

The JSONL format preserves:
- **Conversation History**: Complete message chain with parent-child relationships
- **Working Directory Context**: File system location where commands were executed
- **Git Context**: Branch information for code versioning
- **Tool Usage Results**: Complete history of tool executions and results
- **Token Usage**: Cost and performance metrics
- **Temporal Relationships**: Exact timing of all interactions

### Duplication Approach for Feature Development

To create duplicate threads that maintain optimal context without exceeding context windows:

#### 1. **Thread Analysis and Segmentation**
- Parse JSONL files to identify natural conversation boundaries
- Look for completion markers (successful tool results, task completions)
- Identify context-heavy sections (large file reads, extensive tool usage)

#### 2. **Context Window Management**
- Calculate token usage from the `usage` fields in assistant messages
- Identify high-value context vs. redundant information
- Preserve essential file system state and git context

#### 3. **Strategic Duplication Points**
- After major milestones or feature completions
- Before context window approaches limits (based on `usage.input_tokens`)
- At natural conversation breaks where new features begin

#### 4. **Thread Creation Process**
```bash
# Create new project directory for duplicated thread
mkdir ~/.claude/projects/-{user}-{project-path}-{feature-branch}

# Generate new session ID (UUID)
new_session_id=$(uuidgen | tr '[:upper:]' '[:lower:]')

# Copy and modify essential messages
# - Update sessionId to new UUID
# - Reset parentUuid for starting message
# - Preserve cwd and gitBranch context
# - Include summary of previous work as initial context
```

#### 5. **Context Optimization Techniques**

**Preserve Essential Context:**
- Current file structure and modifications
- Key configuration and dependency information
- Recent successful patterns and approaches
- Critical error resolutions and learnings

**Minimize Redundant Context:**
- Detailed tool output from exploratory commands
- Repetitive file reading operations
- Intermediate debugging steps that were resolved
- Verbose API responses and token usage details

#### 6. **Initialization Pattern for New Threads**

Start duplicated threads with:
1. **Summary Message**: Concise overview of previous work and current state
2. **File System Context**: Current project structure and key files
3. **Git State**: Current branch, recent commits, working tree status
4. **Configuration Context**: Essential project settings and dependencies
5. **Objective Statement**: Clear goal for the new feature development

### Implementation Considerations

#### SDK Integration Points
Based on the SDK analysis:

- **query() function**: Entry point for new conversations
- **Options.resume**: Mechanism for continuing existing sessions
- **Options.cwd**: Working directory preservation
- **SDKMessage types**: Structure for message continuity

#### Thread Management Workflow
1. **Monitor Context Usage**: Track token consumption via `usage` fields
2. **Identify Duplication Triggers**: Set thresholds for context window utilization
3. **Create Branch Points**: Establish clean break points for new threads
4. **Maintain Context Chain**: Link related threads through metadata
5. **Optimize Context Transfer**: Include only essential information in new threads

## Best Practices for Thread Duplication

### 1. **Context Continuity**
- Include project README and key documentation references
- Preserve essential environment and dependency information
- Maintain awareness of previous architectural decisions

### 2. **Feature Isolation**
- Create clean separation points between features
- Include comprehensive context for the specific feature being developed
- Avoid carrying forward unrelated debugging context

### 3. **Performance Optimization**
- Regular context pruning to maintain optimal response times
- Strategic use of file references vs. inline content
- Efficient tool usage patterns that minimize context overhead

### 4. **Quality Assurance**
- Validate that essential context is preserved across thread boundaries
- Test that duplicated threads can successfully continue feature development
- Ensure no critical project state is lost in the duplication process

## SDK-Based Task Flow Control

Claude Code also provides several mechanisms for controlling task flow during active development:

## Todo List Management

### TodoWrite Tool

The primary mechanism for todo list control is the `TodoWrite` tool, which allows direct manipulation of task lists.

#### TodoWrite Schema

```typescript
interface TodoWriteInput {
  todos: Array<{
    content: string;                              // Task description
    status: "pending" | "in_progress" | "completed"; // Task status
    activeForm: string;                           // Present continuous form
  }>;
}
```

#### Controlling Todo Completion

**1. Status Management**
- `pending` - Task not yet started
- `in_progress` - Currently active task (only one at a time)
- `completed` - Task finished successfully

**2. Adding Tasks**
```typescript
// Add new tasks to existing list
const currentTodos = [
  { content: "Analyze codebase", status: "completed", activeForm: "Analyzing codebase" },
  { content: "Write documentation", status: "in_progress", activeForm: "Writing documentation" }
];

const newTodos = [
  ...currentTodos,
  { content: "Run tests", status: "pending", activeForm: "Running tests" },
  { content: "Deploy changes", status: "pending", activeForm: "Deploying changes" }
];
```

**3. Removing Tasks**
```typescript
// Remove specific tasks by filtering
const filteredTodos = currentTodos.filter(todo => 
  todo.content !== "Unwanted task"
);
```

**4. Modifying Task Status**
```typescript
// Update task status
const updatedTodos = currentTodos.map(todo => 
  todo.content === "Write documentation" 
    ? { ...todo, status: "completed" }
    : todo
);
```

### Preventing Automatic Todo Creation

**Using Tool Control**
```typescript
// Limit tools to prevent todo creation
query({
  prompt: "Analyze code without creating todos",
  options: {
    disallowedTools: ["TodoWrite"],
    // or specify only allowed tools
    allowedTools: ["Read", "Grep", "Glob"]
  }
});
```

**Using Custom Permission Control**
```typescript
query({
  prompt: "Perform analysis",
  options: {
    canUseTool: async (toolName, input) => {
      if (toolName === "TodoWrite") {
        // Block TodoWrite unless explicitly needed
        return {
          behavior: "deny",
          message: "Todo creation disabled for this session"
        };
      }
      return { behavior: "allow", updatedInput: input };
    }
  }
});
```

## Task Flow Control Mechanisms

### 1. Hooks System for Todo Interception

Use hooks to intercept and modify todo operations:

```typescript
const todoControlHook: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === 'PreToolUse' && input.tool_name === 'TodoWrite') {
    const todoInput = input.tool_input as TodoWriteInput;
    
    // Modify todos before execution
    const modifiedTodos = todoInput.todos.map(todo => {
      // Skip certain tasks
      if (todo.content.includes("skip this")) {
        return { ...todo, status: "completed" as const };
      }
      return todo;
    });
    
    // Allow execution with modified input
    return {
      continue: true,
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        // Modified input will be used
      }
    };
  }
  
  return { continue: true };
};

query({
  prompt: "Create project plan",
  options: {
    hooks: {
      PreToolUse: [{
        matcher: "TodoWrite",
        hooks: [todoControlHook]
      }]
    }
  }
});
```

### 2. Post-Tool Hook for Todo Monitoring

```typescript
const todoMonitorHook: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === 'PostToolUse' && input.tool_name === 'TodoWrite') {
    const todoResponse = input.tool_response as any;
    
    // Log todo changes
    console.log('Todos updated:', todoResponse);
    
    // Trigger additional actions based on todo status
    // e.g., send notifications, update external systems
    
    return { continue: true };
  }
  
  return { continue: true };
};
```

### 3. Permission Mode Control

Use permission modes to control task execution:

```typescript
// Plan mode - only plan, don't execute
query({
  prompt: "Plan the implementation",
  options: {
    permissionMode: "plan",
    allowedTools: ["Read", "Grep", "ExitPlanMode"]
  }
});

// Accept edits mode - auto-approve file changes
query({
  prompt: "Implement the plan",
  options: {
    permissionMode: "acceptEdits",
    allowedTools: ["Read", "Write", "Edit", "TodoWrite"]
  }
});
```

### 4. Dynamic Control with Query Methods

For streaming conversations, use query control methods:

```typescript
const queryStream = query({
  prompt: streamingPrompts(),
  options: { maxTurns: 10 }
});

for await (const message of queryStream) {
  if (message.type === "assistant") {
    // Check if Claude is about to create todos
    if (message.message.content.includes("TodoWrite")) {
      // Change permission mode to block
      await queryStream.setPermissionMode("plan");
    }
  }
  
  if (message.type === "result") {
    console.log("Task completed:", message.result);
  }
}
```

## Practical Examples

### Example 1: Controlled Todo Management

```typescript
import { query } from "@anthropic-ai/claude-code";

// Function to manage todos manually
async function manageProjectTasks() {
  const initialTodos = [
    { content: "Setup project structure", status: "pending", activeForm: "Setting up project structure" },
    { content: "Implement authentication", status: "pending", activeForm: "Implementing authentication" },
    { content: "Write unit tests", status: "pending", activeForm: "Writing unit tests" }
  ];
  
  for await (const message of query({
    prompt: `Complete these tasks: ${JSON.stringify(initialTodos)}`,
    options: {
      allowedTools: ["Read", "Write", "Edit", "Bash", "TodoWrite"],
      canUseTool: async (toolName, input) => {
        if (toolName === "TodoWrite") {
          const todoInput = input as TodoWriteInput;
          
          // Only allow completing one task at a time
          const inProgressCount = todoInput.todos.filter(t => t.status === "in_progress").length;
          
          if (inProgressCount > 1) {
            return {
              behavior: "deny",
              message: "Only one task can be in progress at a time"
            };
          }
        }
        
        return { behavior: "allow", updatedInput: input };
      }
    }
  })) {
    if (message.type === "result") {
      console.log("Project tasks completed:", message.result);
    }
  }
}
```

### Example 2: Adding/Removing Tasks Dynamically

```typescript
// Custom tool for dynamic todo management
const todoManagerTool = tool(
  "manage_todos",
  "Add or remove tasks from the todo list",
  {
    action: z.enum(["add", "remove", "update"]),
    taskContent: z.string().optional(),
    newStatus: z.enum(["pending", "in_progress", "completed"]).optional(),
    currentTodos: z.array(z.object({
      content: z.string(),
      status: z.enum(["pending", "in_progress", "completed"]),
      activeForm: z.string()
    }))
  },
  async (args) => {
    const { action, taskContent, newStatus, currentTodos } = args;
    
    let updatedTodos = [...currentTodos];
    
    switch (action) {
      case "add":
        if (taskContent) {
          updatedTodos.push({
            content: taskContent,
            status: "pending",
            activeForm: `Working on ${taskContent.toLowerCase()}`
          });
        }
        break;
        
      case "remove":
        if (taskContent) {
          updatedTodos = updatedTodos.filter(todo => todo.content !== taskContent);
        }
        break;
        
      case "update":
        if (taskContent && newStatus) {
          updatedTodos = updatedTodos.map(todo => 
            todo.content === taskContent 
              ? { ...todo, status: newStatus }
              : todo
          );
        }
        break;
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(updatedTodos, null, 2)
      }]
    };
  }
);

// Create server with todo management tool
const todoServer = createSdkMcpServer({
  name: "todo-manager",
  tools: [todoManagerTool]
});

// Use in query
for await (const message of query({
  prompt: "Manage my project tasks dynamically",
  options: {
    mcpServers: {
      "todos": todoServer
    }
  }
})) {
  // Process messages
}
```

### Example 3: Preventing Unwanted Todo Creation

```typescript
const preventTodoHook: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === 'PreToolUse' && input.tool_name === 'TodoWrite') {
    // Check if todos are being created automatically
    const prompt = input.prompt || '';
    
    if (!prompt.includes("create todo") && !prompt.includes("manage tasks")) {
      // Block automatic todo creation
      return {
        decision: 'block',
        stopReason: 'Automatic todo creation is disabled',
        systemMessage: 'Todo creation blocked. Use explicit todo management commands.'
      };
    }
  }
  
  return { continue: true };
};

query({
  prompt: "Analyze the codebase and fix bugs",
  options: {
    hooks: {
      PreToolUse: [{
        matcher: "TodoWrite",
        hooks: [preventTodoHook]
      }]
    }
  }
});
```

## Best Practices

### 1. Todo State Management
- Keep only one task `in_progress` at a time
- Use descriptive `content` and `activeForm` fields
- Update status immediately when tasks complete

### 2. Hook-Based Control
- Use PreToolUse hooks to validate todo operations
- Use PostToolUse hooks to monitor todo changes
- Implement error handling for hook failures

### 3. Permission Management
- Use `canUseTool` for fine-grained control
- Combine with permission modes for broader control
- Log tool usage for audit trails

### 4. Custom Tool Integration
- Create custom MCP tools for complex todo logic
- Implement validation and business rules
- Provide clear error messages and feedback

## Advanced Patterns

### Conditional Todo Execution

```typescript
const conditionalTodoHook: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === 'PreToolUse' && input.tool_name === 'TodoWrite') {
    const todoInput = input.tool_input as TodoWriteInput;
    
    // Apply business rules
    const filteredTodos = todoInput.todos.filter(todo => {
      // Skip todos based on conditions
      if (todo.content.includes("optional") && process.env.NODE_ENV === "production") {
        return false;
      }
      
      // Skip completed todos
      if (todo.status === "completed") {
        return false;
      }
      
      return true;
    });
    
    if (filteredTodos.length !== todoInput.todos.length) {
      // Modify the input to use filtered todos
      return {
        continue: true,
        // SDK will use the original input, but you can log the changes
      };
    }
  }
  
  return { continue: true };
};
```

### Todo Progress Tracking

```typescript
const progressTracker = new Map<string, number>();

const trackProgressHook: HookCallback = async (input, toolUseId, { signal }) => {
  if (input.hook_event_name === 'PostToolUse' && input.tool_name === 'TodoWrite') {
    const todoResponse = input.tool_response as any;
    const sessionId = input.session_id;
    
    // Calculate completion percentage
    const completedTasks = todoResponse.todos?.filter(t => t.status === "completed").length || 0;
    const totalTasks = todoResponse.todos?.length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    progressTracker.set(sessionId, progress);
    
    console.log(`Session ${sessionId} progress: ${progress.toFixed(1)}%`);
    
    // Trigger notifications at milestones
    if (progress >= 100) {
      console.log("🎉 All tasks completed!");
    } else if (progress >= 50 && !progressTracker.has(`${sessionId}-50`)) {
      progressTracker.set(`${sessionId}-50`, Date.now());
      console.log("🔥 Halfway there! Keep going!");
    }
  }
  
  return { continue: true };
};
```

## Conclusion

Claude Code's JSONL-based conversation storage provides a robust foundation for thread duplication and context management. By understanding the message structure and implementing strategic duplication points, developers can:

1. **Maintain Optimal Context**: Preserve essential information while avoiding context window limitations
2. **Enable Continuous Development**: Create focused conversation branches for specific features
3. **Preserve Project History**: Maintain complete audit trails of development decisions
4. **Optimize Performance**: Use token usage tracking to manage conversation efficiency
5. **Scale Development**: Support multiple concurrent feature development streams

The key to successful thread duplication lies in identifying the minimal essential context needed for continued productive work while eliminating redundant information that consumes valuable context window space. This enables seamless feature development across multiple focused conversation threads while maintaining the rich context that makes Claude Code effective for complex development tasks.

This comprehensive approach gives you full control over both thread duplication for project scaling and task flow management for precise development control in Claude Code SDK applications.