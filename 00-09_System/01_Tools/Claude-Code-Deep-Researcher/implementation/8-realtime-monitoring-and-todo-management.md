# Real-Time Claude Monitoring and Interactive Todo Management

## Executive Summary

This plan implements a comprehensive real-time monitoring system that wraps the Claude Agent SDK to provide:
1. **Live message streaming** with TodoWrite detection
2. **Interactive todo management** via MultipleChoiceQuestionInput
3. **Background duplicate removal** in separate conversation thread
4. **Intelligent context window monitoring** with auto-optimization prompts
5. **Always-on multi-agent optimization** for superior context preservation

### Key Innovations

#### 1. **Dual-Thread Architecture**
- **Main Thread**: User ↔ Claude conversation via Agent SDK
- **Background Thread**: Autonomous JSONL monitoring and optimization
- **Zero Interference**: Background thread never interrupts user workflow

#### 2. **Interactive Todo Control**
User sees todo items AS THEY'RE CREATED and can:
- ✅ Accept all todos
- ✏️ Modify specific todos
- ➕ Add new todos
- ❌ Remove todos
- 🚫 Skip todo creation entirely

#### 3. **Smart Context Management**
- Real-time token tracking across conversation
- Predictive warning at 75% context capacity
- Auto-prompt for multi-agent optimization at 85%
- Seamless session continuation after optimization

---

## Problem Statement

### Current Limitations

1. **No Real-Time Visibility**: Can't see what Claude is doing until it's done
2. **No Todo Control**: Todos appear after the fact, no user input
3. **Manual Optimization**: User must manually optimize large conversations
4. **Duplicate Bloat**: Same file reads/tool results accumulate across session
5. **Context Overflow**: Sessions die when hitting context limits
6. **Loss of Quality**: Emergency rule-based optimization loses context

### Solution Goals

1. ✅ Stream Claude responses in real-time to monitor actions
2. ✅ Detect TodoWrite calls before execution
3. ✅ Present interactive UI for todo management
4. ✅ Background duplicate removal without interrupting flow
5. ✅ Proactive context window monitoring
6. ✅ Always use multi-agent optimization for quality preservation
7. ✅ Seamless session resume after optimization

---

## Architecture Design

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         User Application                              │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │               Main Conversation Thread                       │    │
│  │                                                                │    │
│  │  User ──→ App ──→ Claude Agent SDK ──→ Claude               │    │
│  │            ↓                               ↓                  │    │
│  │      [Message Monitor]              [Streaming Response]     │    │
│  │            ↓                               ↓                  │    │
│  │      [TodoWrite Detector]           [Real-time Display]      │    │
│  │            ↓                                                  │    │
│  │      [MultipleChoiceInput] ←── User Feedback                │    │
│  │            ↓                                                  │    │
│  │      [Modified Todos] ──→ Claude Agent SDK                  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │            Background Optimization Thread                     │    │
│  │                                                                │    │
│  │  ┌───────────────────────────────────────────────┐           │    │
│  │  │   JSONL File Watcher                          │           │    │
│  │  │   - Monitors session .jsonl file               │           │    │
│  │  │   - Detects new entries in real-time          │           │    │
│  │  │   - Triggers duplicate detection               │           │    │
│  │  └───────────────────────────────────────────────┘           │    │
│  │                    ↓                                          │    │
│  │  ┌───────────────────────────────────────────────┐           │    │
│  │  │   Duplicate Removal Engine                     │           │    │
│  │  │   - Compares new entries with history          │           │    │
│  │  │   - Identifies redundant tool results          │           │    │
│  │  │   - Maintains deduplication metadata           │           │    │
│  │  └───────────────────────────────────────────────┘           │    │
│  │                    ↓                                          │    │
│  │  ┌───────────────────────────────────────────────┐           │    │
│  │  │   Context Window Monitor                       │           │    │
│  │  │   - Tracks total token usage                   │           │    │
│  │  │   - Calculates % of context capacity           │           │    │
│  │  │   - Triggers optimization prompts              │           │    │
│  │  └───────────────────────────────────────────────┘           │    │
│  │                    ↓                                          │    │
│  │  ┌───────────────────────────────────────────────┐           │    │
│  │  │   Optimization Trigger                         │           │    │
│  │  │   - Prompts user at 85% capacity               │           │    │
│  │  │   - Runs multi-agent optimizer                 │           │    │
│  │  │   - Creates optimized session file             │           │    │
│  │  │   - Enables seamless resume                    │           │    │
│  │  └───────────────────────────────────────────────┘           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **Main Conversation Monitor** (`src/services/conversation-monitor.ts`)

**Purpose**: Real-time streaming and message analysis

**Key Features**:
- Wraps Claude Agent SDK `query()` function
- Streams all SDK messages (user, assistant, system, tool_progress)
- Detects TodoWrite tool calls in real-time
- Extracts todo items from tool_use content
- Triggers user prompts for todo management

**Core Methods**:
```typescript
class ConversationMonitor {
  async monitorConversation(
    prompt: string,
    options: Options
  ): AsyncGenerator<MonitoredMessage>;

  private detectTodoWrite(message: SDKMessage): Todo[] | null;
  private promptUserForTodos(detectedTodos: Todo[]): Promise<Todo[]>;
  private updateToolUseWithModifiedTodos(
    toolUseId: string,
    modifiedTodos: Todo[]
  ): void;
}
```

**Message Flow**:
```typescript
for await (const message of conversationMonitor.monitorConversation(prompt, options)) {
  switch (message.type) {
    case 'assistant':
      // Check for TodoWrite in tool_use content
      const todos = detectTodoWrite(message);
      if (todos) {
        const userApprovedTodos = await promptUserForTodos(todos);
        updateToolUseWithModifiedTodos(message.toolUseId, userApprovedTodos);
      }
      break;

    case 'user':
    case 'system':
    case 'tool_progress':
      // Display real-time progress
      displayProgress(message);
      break;
  }
}
```

#### 2. **Interactive Todo Prompt** (`src/ui/todo-prompt.ts`)

**Purpose**: Present MultipleChoiceQuestionInput for todo management

**User Interface**:
```
┌──────────────────────────────────────────────────────────────┐
│ 📋 Claude wants to create the following todos:               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ ☐ 1. Review codebase structure                               │
│ ☐ 2. Implement real-time monitoring                          │
│ ☐ 3. Add duplicate removal                                   │
│ ☐ 4. Test context window detection                           │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│ What would you like to do?                                   │
│                                                               │
│ ○ Accept all todos                                           │
│ ○ Modify todos (select which to keep/change)                 │
│ ○ Add additional todos                                       │
│ ○ Skip todo creation                                         │
└──────────────────────────────────────────────────────────────┘
```

**If "Modify todos" selected**:
```
┌──────────────────────────────────────────────────────────────┐
│ Select which todos to keep:                                  │
│                                                               │
│ ☑ 1. Review codebase structure                               │
│ ☑ 2. Implement real-time monitoring                          │
│ ☐ 3. Add duplicate removal                                   │
│ ☑ 4. Test context window detection                           │
│                                                               │
│ [ ] Add a new todo: ________________________________          │
│                                                               │
│ [Cancel] [Apply Changes]                                     │
└──────────────────────────────────────────────────────────────┘
```

**Core Methods**:
```typescript
class TodoPrompt {
  async promptForTodos(todos: Todo[]): Promise<TodoPromptResult>;

  private displayTodoList(todos: Todo[]): void;
  private getAction(): Promise<'accept' | 'modify' | 'add' | 'skip'>;
  private modifyTodos(todos: Todo[]): Promise<Todo[]>;
  private addNewTodos(): Promise<string[]>;
}

interface TodoPromptResult {
  action: 'accept' | 'modify' | 'add' | 'skip';
  todos: Todo[];
  userModified: boolean;
}
```

#### 3. **Background JSONL Monitor** (`src/services/background-jsonl-monitor.ts`)

**Purpose**: Autonomous duplicate detection and context tracking

**Key Features**:
- Runs in separate Node.js worker thread
- Watches session .jsonl file using fs.watch()
- Detects new entries without blocking main thread
- Maintains in-memory deduplication cache
- Tracks real-time token usage
- Triggers optimization prompts

**Worker Thread Communication**:
```typescript
// Main Thread
const monitor = new BackgroundJSONLMonitor(sessionId);
monitor.on('duplicate-detected', (entry) => {
  console.log(`🔍 Duplicate detected: ${entry.type}`);
});
monitor.on('context-warning', (stats) => {
  console.warn(`⚠️ Context at ${stats.percentUsed}%`);
});
monitor.on('optimization-needed', (stats) => {
  promptUserForOptimization(stats);
});

// Worker Thread
parentPort.postMessage({
  type: 'duplicate-detected',
  entry: duplicateEntry
});
parentPort.postMessage({
  type: 'context-warning',
  stats: contextStats
});
```

**Deduplication Strategy**:
1. **Hash-Based Detection**:
   - Generate content hash for each tool_result
   - Compare with historical hashes
   - Mark duplicates for removal

2. **Smart Exceptions**:
   - Always keep first occurrence
   - Keep if file was modified between reads
   - Keep if different line range (partial reads)
   - Keep if content differs by >5%

3. **Cross-Reference Tracking**:
   - Maintain map of file path → read history
   - Track tool_use_id → content hash
   - Preserve UUID relationships

**Core Methods**:
```typescript
class BackgroundJSONLMonitor {
  constructor(sessionId: string, jsonlPath: string);

  start(): void;
  stop(): void;

  private watchJSONLFile(): void;
  private processNewEntry(entry: ConversationEntry): void;
  private detectDuplicate(entry: ConversationEntry): boolean;
  private updateContextStats(): void;
  private checkOptimizationThreshold(): void;
}
```

#### 4. **Context Window Monitor** (`src/services/context-window-monitor.ts`)

**Purpose**: Track token usage and trigger optimization

**Monitoring Strategy**:
- Calculate tokens for each new entry using `@anthropic-ai/tokenizer`
- Maintain running total of conversation tokens
- Track percentage of model context window (200K for Sonnet)
- Trigger warnings and optimization prompts

**Thresholds**:
```typescript
enum ContextThreshold {
  SAFE = 0.60,        // < 60% - Safe zone
  WARNING = 0.75,     // 75% - Show warning
  CRITICAL = 0.85,    // 85% - Prompt for optimization
  EMERGENCY = 0.95    // 95% - Force optimization
}
```

**User Prompts**:
```
At 75%:
┌──────────────────────────────────────────────────────────────┐
│ ℹ️ Context Usage: 75%                                        │
│ You have approximately 50K tokens remaining.                 │
│ Consider optimizing soon to prevent interruption.            │
└──────────────────────────────────────────────────────────────┘

At 85%:
┌──────────────────────────────────────────────────────────────┐
│ ⚠️ Context Usage: 85% (Critical)                             │
│                                                               │
│ Would you like to optimize the conversation now?             │
│ This will use AI-driven multi-agent optimization to          │
│ preserve essential context while reducing token usage.       │
│                                                               │
│ ○ Yes, optimize now (Recommended)                            │
│ ○ Remind me at 90%                                           │
│ ○ Continue without optimizing (Risk: session may terminate)  │
└──────────────────────────────────────────────────────────────┘
```

**Core Methods**:
```typescript
class ContextWindowMonitor {
  constructor(maxTokens: number = 200000);

  addEntry(entry: ConversationEntry): void;
  getCurrentUsage(): ContextUsageStats;
  checkThreshold(): ContextThreshold;

  on(event: 'warning' | 'critical' | 'emergency', callback: Function): void;
}

interface ContextUsageStats {
  totalTokens: number;
  maxTokens: number;
  percentUsed: number;
  remainingTokens: number;
  threshold: ContextThreshold;
}
```

#### 5. **Optimization Orchestrator** (`src/services/optimization-orchestrator.ts`)

**Purpose**: Coordinate multi-agent optimization and session resume

**Workflow**:
1. **Pre-Optimization**:
   - Interrupt current Claude query
   - Save conversation state
   - Calculate current token usage

2. **Optimization**:
   - Run multi-agent optimizer (ALWAYS, not rule-based)
   - Generate optimized .jsonl file
   - Validate optimization quality

3. **Session Resume**:
   - Create new query with `resume` option
   - Point to optimized .jsonl file
   - Preserve user context with seamless transition message

**Core Methods**:
```typescript
class OptimizationOrchestrator {
  async optimizeAndResume(
    currentQuery: Query,
    sessionId: string,
    jsonlPath: string
  ): Promise<Query>;

  private interruptQuery(query: Query): Promise<void>;
  private runMultiAgentOptimization(jsonlPath: string): Promise<string>;
  private resumeWithOptimizedContext(
    sessionId: string,
    optimizedPath: string
  ): Promise<Query>;
}
```

**User Experience**:
```
User approves optimization at 85%:
┌──────────────────────────────────────────────────────────────┐
│ 🤖 Optimizing conversation...                                │
│                                                               │
│ [████████████████████░░░░] 85%                               │
│                                                               │
│ • Analyzing 427 conversation entries                         │
│ • Running 10 AI agents in parallel                           │
│ • Preserving essential context                               │
│                                                               │
│ This may take 30-60 seconds...                               │
└──────────────────────────────────────────────────────────────┘

After optimization:
┌──────────────────────────────────────────────────────────────┐
│ ✅ Optimization Complete!                                    │
│                                                               │
│ Original: 427 entries (170K tokens, 85% capacity)            │
│ Optimized: 142 entries (54K tokens, 27% capacity)            │
│ Preserved: 33% of entries, 68% reduction                     │
│                                                               │
│ Session has been seamlessly resumed.                         │
│ You can continue the conversation normally.                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Tasks

### Phase 1: Core Monitoring Infrastructure

#### Task 1.1: Create ConversationMonitor Service
**File**: `src/services/conversation-monitor.ts`

**Requirements**:
- Wrap Claude Agent SDK `query()` function
- Stream and yield all SDK messages
- Detect assistant messages with tool_use content
- Extract TodoWrite tool calls
- Parse todo items from tool input
- Implement message buffering for tool_use detection

**Implementation**:
```typescript
import { query, type SDKMessage, type Options } from '@anthropic-ai/claude-agent-sdk';
import type { Todo } from '../types/index';

export interface MonitoredMessage extends SDKMessage {
  detectedTodos?: Todo[];
  toolUseId?: string;
}

export class ConversationMonitor {
  private currentQuery?: AsyncGenerator<SDKMessage, void>;
  private messageBuffer: SDKMessage[] = [];

  async *monitorConversation(
    prompt: string,
    options: Options
  ): AsyncGenerator<MonitoredMessage> {
    this.currentQuery = query({ prompt, options });

    for await (const message of this.currentQuery) {
      const monitoredMessage = await this.processMessage(message);
      yield monitoredMessage;
    }
  }

  private async processMessage(message: SDKMessage): Promise<MonitoredMessage> {
    // Detect TodoWrite in assistant messages
    if (message.type === 'assistant' && message.message.content) {
      const todos = this.detectTodoWrite(message);
      if (todos) {
        return {
          ...message,
          detectedTodos: todos,
          toolUseId: this.extractToolUseId(message)
        };
      }
    }

    return message;
  }

  private detectTodoWrite(message: SDKAssistantMessage): Todo[] | null {
    const content = message.message.content;
    if (!Array.isArray(content)) return null;

    for (const block of content) {
      if (block.type === 'tool_use' && block.name === 'TodoWrite') {
        const input = block.input as { todos?: Todo[] };
        return input?.todos || null;
      }
    }

    return null;
  }

  private extractToolUseId(message: SDKAssistantMessage): string | undefined {
    const content = message.message.content;
    if (!Array.isArray(content)) return undefined;

    for (const block of content) {
      if (block.type === 'tool_use' && block.name === 'TodoWrite') {
        return block.id;
      }
    }

    return undefined;
  }

  async interrupt(): Promise<void> {
    if (this.currentQuery) {
      await this.currentQuery.interrupt();
    }
  }
}
```

**Tests**:
- ✅ Detects TodoWrite in assistant messages
- ✅ Extracts todo items correctly
- ✅ Preserves tool_use_id for modification
- ✅ Streams other messages unmodified
- ✅ Handles messages without tool_use

**Acceptance Criteria**:
- Successfully streams all SDK messages
- Detects 100% of TodoWrite calls
- Extracts todo items with correct format
- No message loss during streaming

---

#### Task 1.2: Create TodoPrompt UI Component
**File**: `src/ui/todo-prompt.ts`

**Requirements**:
- Display detected todos in readable format
- Present multiple choice options
- Handle "Modify todos" workflow
- Handle "Add todos" workflow
- Return user-approved todos

**Implementation**:
```typescript
import prompts from 'prompts';
import type { Todo } from '../types/index';

export interface TodoPromptResult {
  action: 'accept' | 'modify' | 'add' | 'skip';
  todos: Todo[];
  userModified: boolean;
}

export class TodoPrompt {
  async promptForTodos(todos: Todo[]): Promise<TodoPromptResult> {
    console.log('\n📋 Claude wants to create the following todos:\n');
    todos.forEach((todo, i) => {
      console.log(`   ${i + 1}. ${todo.content}`);
    });

    const actionResponse = await prompts({
      type: 'select',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { title: 'Accept all todos', value: 'accept' },
        { title: 'Modify todos', value: 'modify' },
        { title: 'Add additional todos', value: 'add' },
        { title: 'Skip todo creation', value: 'skip' }
      ]
    });

    const action = actionResponse.action as TodoPromptResult['action'];

    switch (action) {
      case 'accept':
        return { action, todos, userModified: false };

      case 'modify':
        const modifiedTodos = await this.modifyTodos(todos);
        return { action, todos: modifiedTodos, userModified: true };

      case 'add':
        const additionalTodos = await this.addNewTodos();
        const allTodos = [
          ...todos,
          ...additionalTodos.map(content => ({
            content,
            status: 'pending' as const,
            activeForm: `Working on ${content.toLowerCase()}`
          }))
        ];
        return { action, todos: allTodos, userModified: true };

      case 'skip':
        return { action, todos: [], userModified: true };

      default:
        return { action: 'accept', todos, userModified: false };
    }
  }

  private async modifyTodos(todos: Todo[]): Promise<Todo[]> {
    const selectedResponse = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: 'Select which todos to keep:',
      choices: todos.map((todo, i) => ({
        title: todo.content,
        value: i,
        selected: true
      }))
    });

    const selectedIndices: number[] = selectedResponse.selected || [];
    const selectedTodos = selectedIndices.map(i => todos[i]!);

    // Prompt for additional todos
    const addMoreResponse = await prompts({
      type: 'confirm',
      name: 'addMore',
      message: 'Add a new todo?',
      initial: false
    });

    if (addMoreResponse.addMore) {
      const newTodos = await this.addNewTodos();
      selectedTodos.push(
        ...newTodos.map(content => ({
          content,
          status: 'pending' as const,
          activeForm: `Working on ${content.toLowerCase()}`
        }))
      );
    }

    return selectedTodos;
  }

  private async addNewTodos(): Promise<string[]> {
    const newTodos: string[] = [];

    while (true) {
      const response = await prompts({
        type: 'text',
        name: 'todo',
        message: 'Enter todo (or press Enter to finish):'
      });

      if (!response.todo || response.todo.trim() === '') {
        break;
      }

      newTodos.push(response.todo.trim());
    }

    return newTodos;
  }
}
```

**Dependencies**:
```json
{
  "dependencies": {
    "prompts": "^2.4.2"
  },
  "devDependencies": {
    "@types/prompts": "^2.4.9"
  }
}
```

**Tests**:
- ✅ Displays todos correctly
- ✅ Handles "accept" action
- ✅ Handles "modify" action with selection
- ✅ Handles "add" action with new todos
- ✅ Handles "skip" action returning empty array

**Acceptance Criteria**:
- Clear, readable UI for todo selection
- All user actions work correctly
- Returns properly formatted todos
- Handles edge cases (empty input, cancel, etc.)

---

#### Task 1.3: Integrate Monitor with TodoPrompt
**File**: `src/services/interactive-claude-session.ts`

**Requirements**:
- Combine ConversationMonitor + TodoPrompt
- Intercept TodoWrite calls
- Prompt user for approval
- Modify tool_use with approved todos
- Continue conversation seamlessly

**Implementation**:
```typescript
import { ConversationMonitor, type MonitoredMessage } from './conversation-monitor';
import { TodoPrompt } from '../ui/todo-prompt';
import type { Options } from '@anthropic-ai/claude-agent-sdk';
import type { Todo } from '../types/index';

export class InteractiveClaudeSession {
  private monitor: ConversationMonitor;
  private todoPrompt: TodoPrompt;
  private pendingTodoApproval: Map<string, Promise<Todo[]>> = new Map();

  constructor() {
    this.monitor = new ConversationMonitor();
    this.todoPrompt = new TodoPrompt();
  }

  async *runConversation(
    prompt: string,
    options: Options
  ): AsyncGenerator<MonitoredMessage> {
    // Setup hook to intercept TodoWrite
    const enhancedOptions = this.createOptionsWithTodoInterception(options);

    // Stream conversation
    for await (const message of this.monitor.monitorConversation(prompt, enhancedOptions)) {
      // If todos detected, prompt user
      if (message.detectedTodos && message.toolUseId) {
        const approvedTodos = await this.promptForTodoApproval(
          message.detectedTodos,
          message.toolUseId
        );

        // Modify message with approved todos
        message.detectedTodos = approvedTodos;
      }

      yield message;
    }
  }

  private async promptForTodoApproval(
    todos: Todo[],
    toolUseId: string
  ): Promise<Todo[]> {
    const result = await this.todoPrompt.promptForTodos(todos);
    return result.todos;
  }

  private createOptionsWithTodoInterception(options: Options): Options {
    return {
      ...options,
      hooks: {
        ...options.hooks,
        PreToolUse: [
          ...(options.hooks?.PreToolUse || []),
          {
            matcher: 'TodoWrite',
            hooks: [async (input, toolUseId, { signal }) => {
              if (input.hook_event_name === 'PreToolUse' && input.tool_name === 'TodoWrite') {
                const toolInput = input.tool_input as { todos?: Todo[] };

                if (!toolInput?.todos) {
                  return { continue: true };
                }

                // Prompt user for approval
                const result = await this.todoPrompt.promptForTodos(toolInput.todos);

                if (result.action === 'skip') {
                  return {
                    decision: 'block',
                    systemMessage: 'User skipped todo creation.'
                  };
                }

                // Return modified todos
                return {
                  continue: true,
                  hookSpecificOutput: {
                    hookEventName: 'PreToolUse',
                    permissionDecision: 'allow',
                    updatedInput: {
                      todos: result.todos
                    }
                  }
                };
              }

              return { continue: true };
            }]
          }
        ]
      }
    };
  }

  async interrupt(): Promise<void> {
    await this.monitor.interrupt();
  }
}
```

**Tests**:
- ✅ Detects TodoWrite and prompts user
- ✅ Passes approved todos to Claude
- ✅ Handles user skip action (blocks TodoWrite)
- ✅ Continues conversation after todo approval
- ✅ Preserves other hooks in options

**Acceptance Criteria**:
- Zero delay between detection and prompt
- User-approved todos replace original todos
- Conversation continues seamlessly
- Other tool uses unaffected

---

### Phase 2: Background Monitoring

#### Task 2.1: Create JSONL File Watcher
**File**: `src/services/jsonl-file-watcher.ts`

**Requirements**:
- Watch .jsonl file for changes using fs.watch()
- Detect new entries appended to file
- Parse new entries without re-reading entire file
- Maintain file offset to track read position
- Emit events for new entries

**Implementation**:
```typescript
import { watch, readFileSync, statSync } from 'fs';
import { EventEmitter } from 'events';
import type { ConversationEntry } from '../types/claude-conversation';

export class JSONLFileWatcher extends EventEmitter {
  private filePath: string;
  private fileOffset: number = 0;
  private watcher?: ReturnType<typeof watch>;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;

    // Initialize offset to current file size
    try {
      const stats = statSync(filePath);
      this.fileOffset = stats.size;
    } catch {
      this.fileOffset = 0;
    }
  }

  start(): void {
    this.watcher = watch(this.filePath, (eventType) => {
      if (eventType === 'change') {
        this.processNewEntries();
      }
    });
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
    }
  }

  private processNewEntries(): void {
    try {
      const stats = statSync(this.filePath);
      const currentSize = stats.size;

      if (currentSize > this.fileOffset) {
        const content = readFileSync(this.filePath, 'utf-8');
        const newContent = content.slice(this.fileOffset);

        const lines = newContent.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const entry: ConversationEntry = JSON.parse(line);
            this.emit('entry', entry);
          } catch (error) {
            console.error('Error parsing JSONL entry:', error);
          }
        }

        this.fileOffset = currentSize;
      }
    } catch (error) {
      console.error('Error processing new entries:', error);
    }
  }
}
```

**Tests**:
- ✅ Detects new entries appended to file
- ✅ Parses entries correctly
- ✅ Maintains correct file offset
- ✅ Handles file truncation gracefully
- ✅ Emits events for each new entry

**Acceptance Criteria**:
- Detects new entries within 100ms
- No duplicate entries emitted
- Handles rapid file updates
- Minimal CPU usage when idle

---

#### Task 2.2: Create Duplicate Detection Engine
**File**: `src/services/duplicate-detector.ts`

**Requirements**:
- Generate content hash for tool_result entries
- Compare with historical hashes
- Identify duplicates based on content
- Smart exceptions for legitimate duplicates
- Track file modification times

**Implementation**:
```typescript
import crypto from 'crypto';
import type { ConversationEntry } from '../types/claude-conversation';

interface DuplicateMetadata {
  hash: string;
  firstOccurrence: string; // UUID of first entry
  filePath?: string;
  toolName?: string;
  timestamp: string;
}

export class DuplicateDetector {
  private hashMap: Map<string, DuplicateMetadata> = new Map();
  private fileReadHistory: Map<string, {
    lastModified?: Date;
    readCount: number;
  }> = new Map();

  isDuplicate(entry: ConversationEntry): boolean {
    // Only check tool_result entries
    if (entry.type !== 'user') return false;

    const message = entry.message;
    if (!message || !('content' in message)) return false;

    const content = message.content;
    if (!Array.isArray(content)) return false;

    for (const block of content) {
      if (block.type === 'tool_result') {
        const hash = this.generateContentHash(block.content);

        if (this.hashMap.has(hash)) {
          // Found potential duplicate
          const metadata = this.hashMap.get(hash)!;

          // Check smart exceptions
          if (this.isLegitimateRepeat(entry, metadata)) {
            // Not a duplicate - legitimate repeat
            return false;
          }

          return true;
        }

        // First occurrence - store metadata
        this.hashMap.set(hash, {
          hash,
          firstOccurrence: entry.uuid,
          toolName: this.extractToolName(entry),
          filePath: this.extractFilePath(entry),
          timestamp: entry.timestamp
        });
      }
    }

    return false;
  }

  private generateContentHash(content: any): string {
    const normalized = typeof content === 'string'
      ? content
      : JSON.stringify(content);

    return crypto
      .createHash('sha256')
      .update(normalized)
      .digest('hex');
  }

  private isLegitimateRepeat(
    entry: ConversationEntry,
    metadata: DuplicateMetadata
  ): boolean {
    // Exception 1: File was modified between reads
    const filePath = this.extractFilePath(entry);
    if (filePath && metadata.filePath === filePath) {
      const history = this.fileReadHistory.get(filePath);
      if (history && history.lastModified) {
        const entryTime = new Date(entry.timestamp);
        if (entryTime > history.lastModified) {
          // File was modified, this is a legitimate re-read
          return true;
        }
      }
    }

    // Exception 2: Different line range (partial read)
    const currentRange = this.extractLineRange(entry);
    const originalRange = this.extractLineRange(metadata.firstOccurrence);
    if (currentRange && originalRange &&
        !this.rangesOverlap(currentRange, originalRange)) {
      return true;
    }

    // Exception 3: Content differs by >5%
    // (handled by hash comparison above)

    return false;
  }

  private extractToolName(entry: ConversationEntry): string | undefined {
    // Extract from parent tool_use if available
    return undefined; // TODO: Implement
  }

  private extractFilePath(entry: ConversationEntry): string | undefined {
    // Extract file path from Read tool results
    return undefined; // TODO: Implement
  }

  private extractLineRange(entry: ConversationEntry | string): {
    start: number;
    end: number;
  } | null {
    // Extract line range from Read tool results
    return null; // TODO: Implement
  }

  private rangesOverlap(
    range1: { start: number; end: number },
    range2: { start: number; end: number }
  ): boolean {
    return range1.start <= range2.end && range2.start <= range1.end;
  }

  getStats(): {
    totalHashes: number;
    duplicatesDetected: number;
  } {
    return {
      totalHashes: this.hashMap.size,
      duplicatesDetected: 0 // TODO: Track this
    };
  }
}
```

**Tests**:
- ✅ Detects exact duplicate tool_results
- ✅ Allows legitimate re-reads of modified files
- ✅ Allows partial reads of different line ranges
- ✅ Handles file path extraction correctly
- ✅ Generates consistent hashes

**Acceptance Criteria**:
- 100% detection of exact duplicates
- <1% false positive rate
- Fast hash generation (<10ms)
- Memory efficient for large conversations

---

#### Task 2.3: Create Background Monitor Service
**File**: `src/services/background-jsonl-monitor.ts`

**Requirements**:
- Run in Node.js worker thread
- Integrate JSONL watcher + duplicate detector
- Track context window usage
- Emit events to main thread
- Minimal resource usage

**Implementation**:
```typescript
import { Worker, isMainThread, parentPort } from 'worker_threads';
import { EventEmitter } from 'events';
import { JSONLFileWatcher } from './jsonl-file-watcher';
import { DuplicateDetector } from './duplicate-detector';
import { ContextWindowMonitor } from './context-window-monitor';
import type { ConversationEntry } from '../types/claude-conversation';

export class BackgroundJSONLMonitor extends EventEmitter {
  private worker?: Worker;
  private sessionId: string;
  private jsonlPath: string;

  constructor(sessionId: string, jsonlPath: string) {
    super();
    this.sessionId = sessionId;
    this.jsonlPath = jsonlPath;
  }

  start(): void {
    if (isMainThread) {
      // Main thread - spawn worker
      this.worker = new Worker(__filename);

      this.worker.on('message', (message) => {
        this.emit(message.type, message.data);
      });

      this.worker.postMessage({
        type: 'start',
        sessionId: this.sessionId,
        jsonlPath: this.jsonlPath
      });
    }
  }

  stop(): void {
    if (this.worker) {
      this.worker.postMessage({ type: 'stop' });
      this.worker.terminate();
    }
  }
}

// Worker thread code
if (!isMainThread && parentPort) {
  let watcher: JSONLFileWatcher;
  let duplicateDetector: DuplicateDetector;
  let contextMonitor: ContextWindowMonitor;

  parentPort.on('message', (message) => {
    switch (message.type) {
      case 'start':
        watcher = new JSONLFileWatcher(message.jsonlPath);
        duplicateDetector = new DuplicateDetector();
        contextMonitor = new ContextWindowMonitor();

        watcher.on('entry', (entry: ConversationEntry) => {
          // Check for duplicates
          if (duplicateDetector.isDuplicate(entry)) {
            parentPort!.postMessage({
              type: 'duplicate-detected',
              data: entry
            });
          }

          // Update context stats
          contextMonitor.addEntry(entry);
          const usage = contextMonitor.getCurrentUsage();

          if (usage.percentUsed >= 0.75 && usage.percentUsed < 0.85) {
            parentPort!.postMessage({
              type: 'context-warning',
              data: usage
            });
          } else if (usage.percentUsed >= 0.85) {
            parentPort!.postMessage({
              type: 'optimization-needed',
              data: usage
            });
          }
        });

        watcher.start();
        break;

      case 'stop':
        if (watcher) {
          watcher.stop();
        }
        break;
    }
  });
}
```

**Tests**:
- ✅ Worker thread starts correctly
- ✅ Events propagate to main thread
- ✅ Duplicate detection works in worker
- ✅ Context monitoring works in worker
- ✅ Worker terminates cleanly

**Acceptance Criteria**:
- Worker thread isolation (no blocking main thread)
- Events delivered within 50ms
- CPU usage <5% when monitoring
- Memory usage <50MB for large files

---

### Phase 3: Context Window Management

#### Task 3.1: Create Context Window Monitor
**File**: `src/services/context-window-monitor.ts`

**Requirements**:
- Calculate tokens for each entry
- Track running total
- Calculate percentage of max tokens
- Emit events at thresholds
- Support different models (different context limits)

**Implementation**:
```typescript
import { calculateTokens } from './token-calculator';
import { EventEmitter } from 'events';
import type { ConversationEntry } from '../types/claude-conversation';

export enum ContextThreshold {
  SAFE = 0.60,
  WARNING = 0.75,
  CRITICAL = 0.85,
  EMERGENCY = 0.95
}

export interface ContextUsageStats {
  totalTokens: number;
  maxTokens: number;
  percentUsed: number;
  remainingTokens: number;
  threshold: ContextThreshold;
}

export class ContextWindowMonitor extends EventEmitter {
  private maxTokens: number;
  private currentTokens: number = 0;
  private lastThreshold: ContextThreshold = ContextThreshold.SAFE;

  constructor(maxTokens: number = 200000) {
    super();
    this.maxTokens = maxTokens;
  }

  addEntry(entry: ConversationEntry): void {
    const tokens = calculateTokens(entry);
    this.currentTokens += tokens;

    this.checkThresholdChange();
  }

  getCurrentUsage(): ContextUsageStats {
    const percentUsed = this.currentTokens / this.maxTokens;

    return {
      totalTokens: this.currentTokens,
      maxTokens: this.maxTokens,
      percentUsed,
      remainingTokens: this.maxTokens - this.currentTokens,
      threshold: this.determineThreshold(percentUsed)
    };
  }

  private determineThreshold(percentUsed: number): ContextThreshold {
    if (percentUsed >= ContextThreshold.EMERGENCY) {
      return ContextThreshold.EMERGENCY;
    } else if (percentUsed >= ContextThreshold.CRITICAL) {
      return ContextThreshold.CRITICAL;
    } else if (percentUsed >= ContextThreshold.WARNING) {
      return ContextThreshold.WARNING;
    } else {
      return ContextThreshold.SAFE;
    }
  }

  private checkThresholdChange(): void {
    const usage = this.getCurrentUsage();

    if (usage.threshold !== this.lastThreshold) {
      this.lastThreshold = usage.threshold;

      switch (usage.threshold) {
        case ContextThreshold.WARNING:
          this.emit('warning', usage);
          break;
        case ContextThreshold.CRITICAL:
          this.emit('critical', usage);
          break;
        case ContextThreshold.EMERGENCY:
          this.emit('emergency', usage);
          break;
      }
    }
  }

  reset(newMaxTokens?: number): void {
    this.currentTokens = 0;
    if (newMaxTokens) {
      this.maxTokens = newMaxTokens;
    }
    this.lastThreshold = ContextThreshold.SAFE;
  }
}
```

**Tests**:
- ✅ Calculates tokens correctly
- ✅ Tracks running total accurately
- ✅ Emits events at correct thresholds
- ✅ Handles different max token values
- ✅ Reset functionality works

**Acceptance Criteria**:
- Token calculation accuracy ±2%
- Threshold events fire exactly once
- Supports all Claude models
- Fast calculation (<5ms per entry)

---

#### Task 3.2: Create Optimization Orchestrator
**File**: `src/services/optimization-orchestrator.ts`

**Requirements**:
- Interrupt current Claude query gracefully
- Run multi-agent optimization
- Resume session with optimized context
- Handle errors and rollback if needed
- Display progress to user

**Implementation**:
```typescript
import { query, type Query, type Options } from '@anthropic-ai/claude-agent-sdk';
import { MultiAgentOptimizer } from './multi-agent-optimizer';
import { readFileSync, writeFileSync } from 'fs';
import type { ConversationEntry } from '../types/claude-conversation';

export class OptimizationOrchestrator {
  private optimizer: MultiAgentOptimizer;

  constructor() {
    this.optimizer = new MultiAgentOptimizer({
      agentCount: 10,
      model: 'sonnet',
      verbose: true
    });
  }

  async optimizeAndResume(
    currentQuery: Query,
    sessionId: string,
    jsonlPath: string,
    options: Options
  ): Promise<Query> {
    console.log('🤖 Starting optimization process...\n');

    try {
      // Step 1: Interrupt current query
      console.log('⏸️  Pausing conversation...');
      await currentQuery.interrupt();

      // Step 2: Run multi-agent optimization
      console.log('🔄 Optimizing with 10 AI agents...\n');
      const optimizedPath = await this.runMultiAgentOptimization(jsonlPath);

      // Step 3: Resume with optimized context
      console.log('▶️  Resuming conversation with optimized context...\n');
      const newQuery = await this.resumeWithOptimizedContext(
        sessionId,
        optimizedPath,
        options
      );

      console.log('✅ Optimization complete! Session resumed.\n');

      return newQuery;
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      throw error;
    }
  }

  private async runMultiAgentOptimization(jsonlPath: string): Promise<string> {
    // Load conversation entries
    const fileContent = readFileSync(jsonlPath, 'utf-8');
    const entries: ConversationEntry[] = fileContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));

    console.log(`📊 Analyzing ${entries.length} entries...`);

    // Run optimization
    const result = await this.optimizer.optimizeConversation(entries);

    console.log(`✅ Optimization complete!`);
    console.log(`   Original: ${entries.length} entries`);
    console.log(`   Optimized: ${result.optimizedEntries.length} entries`);
    console.log(`   Reduction: ${((1 - result.optimizedEntries.length / entries.length) * 100).toFixed(1)}%\n`);

    // Write optimized entries to new file
    const optimizedPath = jsonlPath.replace('.jsonl', '-optimized.jsonl');
    const outputLines = result.optimizedEntries
      .map(entry => JSON.stringify(entry))
      .join('\n');

    writeFileSync(optimizedPath, outputLines + '\n');

    return optimizedPath;
  }

  private async resumeWithOptimizedContext(
    sessionId: string,
    optimizedPath: string,
    options: Options
  ): Promise<Query> {
    // Resume from optimized session
    const resumeOptions: Options = {
      ...options,
      resume: optimizedPath,
      forkSession: false // Continue same session ID
    };

    // Send seamless transition message
    const transitionPrompt =
      'The conversation has been optimized to preserve context. ' +
      'Please continue with the current task.';

    return query({
      prompt: transitionPrompt,
      options: resumeOptions
    });
  }
}
```

**Tests**:
- ✅ Interrupts query successfully
- ✅ Runs multi-agent optimization
- ✅ Resumes with optimized context
- ✅ Handles optimization errors gracefully
- ✅ Preserves session continuity

**Acceptance Criteria**:
- Optimization completes in <90 seconds
- Session resume is seamless (no context loss)
- Error handling prevents data loss
- Progress is visible to user

---

#### Task 3.3: Create User Prompt for Optimization
**File**: `src/ui/optimization-prompt.ts`

**Requirements**:
- Display context usage stats
- Present optimization options
- Show progress during optimization
- Display results after completion

**Implementation**:
```typescript
import prompts from 'prompts';
import type { ContextUsageStats } from '../services/context-window-monitor';

export class OptimizationPrompt {
  async promptForOptimization(stats: ContextUsageStats): Promise<OptimizationAction> {
    console.log('\n⚠️  Context Window Alert\n');
    console.log(`   Current usage: ${(stats.percentUsed * 100).toFixed(1)}%`);
    console.log(`   Total tokens: ${stats.totalTokens.toLocaleString()} / ${stats.maxTokens.toLocaleString()}`);
    console.log(`   Remaining: ${stats.remainingTokens.toLocaleString()} tokens\n`);

    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'Would you like to optimize the conversation now?',
      choices: [
        {
          title: 'Yes, optimize now (Recommended)',
          value: 'optimize',
          description: 'Use AI-driven optimization to preserve context'
        },
        {
          title: 'Remind me at 90%',
          value: 'remind',
          description: 'Continue for now, prompt again later'
        },
        {
          title: 'Continue without optimizing',
          value: 'continue',
          description: 'Risk: session may terminate if context fills'
        }
      ]
    });

    return response.action as OptimizationAction;
  }

  displayOptimizationProgress(message: string): void {
    console.log(message);
  }

  displayOptimizationResults(original: number, optimized: number): void {
    const reduction = ((1 - optimized / original) * 100).toFixed(1);

    console.log('\n✅ Optimization Complete!\n');
    console.log(`   Original: ${original} entries`);
    console.log(`   Optimized: ${optimized} entries`);
    console.log(`   Reduction: ${reduction}%\n`);
    console.log('Session has been seamlessly resumed.');
    console.log('You can continue the conversation normally.\n');
  }
}

export type OptimizationAction = 'optimize' | 'remind' | 'continue';
```

**Tests**:
- ✅ Displays stats correctly
- ✅ Presents clear options
- ✅ Returns user choice
- ✅ Progress messages display properly
- ✅ Results formatted clearly

**Acceptance Criteria**:
- Clear, readable UI
- All actions work correctly
- Progress updates are timely
- Results are informative

---

### Phase 4: Integration and Testing

#### Task 4.1: Create Main Application Entry Point
**File**: `src/app/interactive-session-app.ts`

**Requirements**:
- Combine all services into cohesive app
- Handle initialization
- Coordinate main + background threads
- Handle graceful shutdown

**Implementation**:
```typescript
import { InteractiveClaudeSession } from '../services/interactive-claude-session';
import { BackgroundJSONLMonitor } from '../services/background-jsonl-monitor';
import { OptimizationOrchestrator } from '../services/optimization-orchestrator';
import { OptimizationPrompt } from '../ui/optimization-prompt';
import type { Options } from '@anthropic-ai/claude-agent-sdk';
import type { ContextUsageStats } from '../services/context-window-monitor';

export class InteractiveSessionApp {
  private session: InteractiveClaudeSession;
  private backgroundMonitor?: BackgroundJSONLMonitor;
  private orchestrator: OptimizationOrchestrator;
  private optimizationPrompt: OptimizationPrompt;
  private currentQuery?: AsyncGenerator<any, void>;

  constructor() {
    this.session = new InteractiveClaudeSession();
    this.orchestrator = new OptimizationOrchestrator();
    this.optimizationPrompt = new OptimizationPrompt();
  }

  async run(initialPrompt: string, options: Options): Promise<void> {
    // Get session ID from first message
    let sessionId: string | undefined;
    let jsonlPath: string | undefined;

    // Start conversation
    this.currentQuery = this.session.runConversation(initialPrompt, options);

    for await (const message of this.currentQuery) {
      // Extract session info from first system message
      if (!sessionId && message.type === 'system' && message.subtype === 'init') {
        sessionId = message.session_id;
        jsonlPath = this.deriveJSONLPath(sessionId);

        // Start background monitor
        this.startBackgroundMonitor(sessionId, jsonlPath);
      }

      // Display message to user
      this.displayMessage(message);
    }
  }

  private startBackgroundMonitor(sessionId: string, jsonlPath: string): void {
    this.backgroundMonitor = new BackgroundJSONLMonitor(sessionId, jsonlPath);

    // Listen for events
    this.backgroundMonitor.on('duplicate-detected', (entry) => {
      console.log(`🔍 Duplicate detected and marked for removal`);
    });

    this.backgroundMonitor.on('context-warning', (stats: ContextUsageStats) => {
      console.log(`\nℹ️  Context usage: ${(stats.percentUsed * 100).toFixed(1)}%`);
      console.log(`   ${stats.remainingTokens.toLocaleString()} tokens remaining\n`);
    });

    this.backgroundMonitor.on('optimization-needed', async (stats: ContextUsageStats) => {
      await this.handleOptimizationPrompt(stats, jsonlPath!);
    });

    this.backgroundMonitor.start();
  }

  private async handleOptimizationPrompt(
    stats: ContextUsageStats,
    jsonlPath: string
  ): Promise<void> {
    const action = await this.optimizationPrompt.promptForOptimization(stats);

    if (action === 'optimize' && this.currentQuery) {
      // Run optimization
      const newQuery = await this.orchestrator.optimizeAndResume(
        this.currentQuery as any,
        stats.sessionId,
        jsonlPath,
        {} // Pass original options
      );

      // Update current query
      this.currentQuery = newQuery as any;
    }
  }

  private deriveJSONLPath(sessionId: string): string {
    // Derive path from session ID
    return `~/.claude/projects/-Users-${process.env.USER}-${process.cwd().split('/').pop()}/${sessionId}.jsonl`;
  }

  private displayMessage(message: any): void {
    // Display message based on type
    switch (message.type) {
      case 'assistant':
        console.log(this.extractTextContent(message.message));
        break;
      case 'user':
        // Don't display user messages (they typed them)
        break;
      case 'system':
        if (message.subtype !== 'init') {
          console.log(`[System] ${JSON.stringify(message)}`);
        }
        break;
      case 'tool_progress':
        console.log(`⏳ ${message.tool_name} (${message.elapsed_time_seconds}s)`);
        break;
    }
  }

  private extractTextContent(message: any): string {
    if (!message.content) return '';
    if (typeof message.content === 'string') return message.content;

    const textBlocks = message.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text);

    return textBlocks.join('\n');
  }

  async shutdown(): void {
    if (this.currentQuery) {
      await this.session.interrupt();
    }

    if (this.backgroundMonitor) {
      this.backgroundMonitor.stop();
    }
  }
}
```

**Tests**:
- ✅ Initializes all services correctly
- ✅ Background monitor starts automatically
- ✅ Optimization prompts work
- ✅ Graceful shutdown
- ✅ Error handling

**Acceptance Criteria**:
- App runs end-to-end successfully
- All services coordinate properly
- No memory leaks
- Clean shutdown

---

#### Task 4.2: Create CLI Entry Point
**File**: `src/cli/interactive-session-cli.ts`

**Requirements**:
- Command-line interface for app
- Accept user prompt as argument
- Configure options via CLI flags
- Handle signals (SIGINT, SIGTERM)

**Implementation**:
```typescript
#!/usr/bin/env node

import { InteractiveSessionApp } from '../app/interactive-session-app';
import { parseArgs } from 'util';
import type { Options } from '@anthropic-ai/claude-agent-sdk';

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      model: {
        type: 'string',
        short: 'm',
        default: 'sonnet'
      },
      'max-turns': {
        type: 'string',
        default: '25'
      },
      resume: {
        type: 'string'
      },
      help: {
        type: 'boolean',
        short: 'h'
      }
    },
    allowPositionals: true
  });

  if (values.help) {
    console.log(`
Usage: interactive-session [OPTIONS] <prompt>

Options:
  -m, --model <model>       Model to use (sonnet, opus, haiku) [default: sonnet]
  --max-turns <n>           Maximum conversation turns [default: 25]
  --resume <path>           Resume from session file
  -h, --help                Show this help message

Examples:
  interactive-session "Build a todo app"
  interactive-session --model opus "Optimize my codebase"
  interactive-session --resume ~/.claude/sessions/abc123.jsonl "Continue working"
    `);
    process.exit(0);
  }

  const prompt = positionals[0];
  if (!prompt && !values.resume) {
    console.error('Error: Must provide a prompt or --resume flag');
    process.exit(1);
  }

  const options: Options = {
    model: values.model,
    maxTurns: parseInt(values['max-turns'] as string),
    resume: values.resume,
    pathToClaudeCodeExecutable: execSync('which claude', { encoding: 'utf-8' }).trim()
  };

  const app = new InteractiveSessionApp();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\nShutting down gracefully...');
    await app.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await app.shutdown();
    process.exit(0);
  });

  // Run app
  try {
    await app.run(prompt || 'Continue from previous session', options);
  } catch (error) {
    console.error('Error:', error);
    await app.shutdown();
    process.exit(1);
  }
}

main();
```

**Tests**:
- ✅ Parses CLI arguments correctly
- ✅ Handles help flag
- ✅ Validates required arguments
- ✅ Handles SIGINT gracefully
- ✅ Error handling

**Acceptance Criteria**:
- Clean CLI interface
- All flags work correctly
- Graceful shutdown on Ctrl+C
- Clear error messages

---

#### Task 4.3: End-to-End Testing
**File**: `src/tests/interactive-session.test.ts`

**Requirements**:
- Test complete workflow
- Test todo interception
- Test background monitoring
- Test optimization flow
- Test error recovery

**Test Cases**:
```typescript
describe('Interactive Claude Session', () => {
  it('should detect and prompt for TodoWrite', async () => {
    // Test todo interception workflow
  });

  it('should monitor JSONL file in background', async () => {
    // Test background monitoring
  });

  it('should detect duplicates correctly', async () => {
    // Test duplicate detection
  });

  it('should prompt for optimization at 85%', async () => {
    // Test optimization prompting
  });

  it('should optimize and resume seamlessly', async () => {
    // Test optimization + resume
  });

  it('should handle user skipping todos', async () => {
    // Test skip action
  });

  it('should handle user modifying todos', async () => {
    // Test modify action
  });

  it('should recover from optimization errors', async () => {
    // Test error recovery
  });
});
```

---

## Additional Features to Consider

Based on Claude Agent SDK capabilities, here are additional features we could add:

### 1. **Custom MCP Tools** (using `createSdkMcpServer`)
Create custom tools that run in the same process:
- `OptimizeContext`: Manual trigger for optimization
- `TodoSnapshot`: Save current todo state
- `SessionSummary`: Generate conversation summary
- `ContextStats`: Display token usage statistics

### 2. **Agent Definitions** for Specialized Tasks
Define sub-agents for specific workflows:
- `code-reviewer`: Reviews code changes before commits
- `test-generator`: Generates tests for new code
- `doc-writer`: Writes documentation for features
- `optimizer-assistant`: Helps user configure optimization

### 3. **Hook-Based Extensions**
Additional hooks for more control:
- `SessionStart`: Initialize project-specific settings
- `SessionEnd`: Save session metadata and stats
- `Notification`: Capture important events for logging
- `PreCompact`: Customize compaction behavior

### 4. **Resume from Specific Point** (using `resumeSessionAt`)
Allow user to resume from specific message:
- "Resume from before that error"
- "Go back to when we discussed X"
- "Start from message #42"

### 5. **Multi-Model Support**
Allow user to switch models mid-conversation:
- Start with Haiku for simple tasks
- Switch to Sonnet for complex work
- Use Opus for critical decisions

### 6. **Session Forking** (using `forkSession`)
Create branches of conversations:
- Fork to explore alternative approaches
- Merge successful forks back
- Maintain conversation tree

### 7. **Thinking Token Limits** (using `setMaxThinkingTokens`)
Control thinking budget:
- Limit thinking for simple queries
- Increase for complex problems
- Monitor thinking token usage

---

## Success Metrics

### Performance Metrics
- ✅ TodoWrite detection: 100% accuracy
- ✅ User prompt latency: <200ms
- ✅ Background monitoring CPU: <5%
- ✅ Duplicate detection: >99% accuracy, <1% false positives
- ✅ Context monitoring accuracy: ±2%
- ✅ Optimization time: <90 seconds for 500 entries
- ✅ Session resume: seamless, zero context loss

### User Experience Metrics
- ✅ Todo modification adoption: >80% of users modify at least once
- ✅ Optimization acceptance rate: >90% at critical threshold
- ✅ User satisfaction with context preservation: >4.5/5
- ✅ Session continuation success rate: >95%

### Quality Metrics
- ✅ Multi-agent optimization preservation rate: 60-85% reduction (not >90%)
- ✅ Context coherence after optimization: >95%
- ✅ Conversation flow continuity: Seamless
- ✅ Error recovery rate: 100%

---

## Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "latest",
    "@anthropic-ai/tokenizer": "^0.2.0",
    "prompts": "^2.4.2"
  },
  "devDependencies": {
    "@types/prompts": "^2.4.9",
    "@types/node": "^20.0.0"
  }
}
```

---

## Timeline Estimate

- **Phase 1 (Core Monitoring)**: 3-4 days
- **Phase 2 (Background Monitoring)**: 2-3 days
- **Phase 3 (Context Management)**: 2-3 days
- **Phase 4 (Integration)**: 2-3 days
- **Testing & Polish**: 2 days

**Total**: 11-15 days

---

## Risk Mitigation

### Risk 1: TodoWrite Hook Timing
**Risk**: Hook might not fire before tool execution
**Mitigation**: Use PreToolUse hook (fires before execution)

### Risk 2: Background Thread Performance
**Risk**: Worker thread might use too much CPU
**Mitigation**: Implement throttling, use efficient file watching

### Risk 3: Optimization Interrupting User
**Risk**: Optimization might feel disruptive
**Mitigation**: Clear messaging, user control, seamless resume

### Risk 4: Duplicate Detection False Positives
**Risk**: Might mark legitimate reads as duplicates
**Mitigation**: Smart exceptions, file modification tracking

### Risk 5: Context Calculation Accuracy
**Risk**: Token count might be inaccurate
**Mitigation**: Use official tokenizer, test extensively

---

## Future Enhancements

1. **ML-Based Duplicate Detection**: Train model to detect semantic duplicates
2. **Smart Context Summarization**: Use Claude to summarize removed sections
3. **Multi-Session Optimization**: Optimize across related sessions
4. **Context Prediction**: Predict when optimization will be needed
5. **Auto-Recovery**: Automatic rollback if optimization fails
6. **Session Analytics**: Track metrics across all sessions
7. **Collaborative Filtering**: Share successful optimizations across users

---

## Appendix: Architecture Diagrams

### Message Flow
```
User → App → SDK → Claude
         ↓
    [Detect TodoWrite]
         ↓
    [Prompt User] ←─ User Input
         ↓
    [Modified Todos] → SDK → Claude
```

### Background Thread
```
JSONL File ─→ Watcher ─→ Duplicate Detector
                 ↓              ↓
           New Entry       Is Duplicate?
                 ↓              ↓
         Context Monitor    Mark Entry
                 ↓
         Calculate Tokens
                 ↓
         Check Threshold
                 ↓
         Emit Event → Main Thread
```

### Optimization Flow
```
85% Threshold ─→ Prompt User ─→ Run Multi-Agent ─→ Resume Session
                       ↓
                  User Approves
                       ↓
                Interrupt Query
                       ↓
              Optimize Conversation
                       ↓
              Write Optimized File
                       ↓
              Resume with New File
```
