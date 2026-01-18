# Claude Code SDK TypeScript Application Implementation Checklist

## Overview

This checklist provides concrete implementation tasks for building a TypeScript application with Bun that implements the 6 core features using the Claude Code SDK.

## Project Foundation

### 1. Bun/TypeScript Project Setup
**Complexity: Simple**

- [ ] **Initialize Bun project** 
  - Run `bun init` in project directory
  - Verify automatic `tsconfig.json` generation with Bun-specific settings

- [ ] **Install Claude Code SDK**
  - Install: `bun add @anthropic-ai/claude-code`
  - Install types: `bun add -d @types/node`
  - Verify SDK types are available in TypeScript

- [ ] **Configure TypeScript for Bun**
  - Update `tsconfig.json` with Bun's recommended settings:
    ```json
    {
      "compilerOptions": {
        "target": "ESNext",
        "module": "Preserve",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "strict": true,
        "skipLibCheck": true
      }
    }
    ```

- [ ] **Create project structure**
  - `src/` - Main application code
  - `src/types/` - TypeScript type definitions
  - `src/services/` - Core service implementations
  - `src/utils/` - Utility functions

### 2. Essential Dependencies
**Complexity: Simple**

- [ ] **Install core dependencies**
  - `bun add zod` - Schema validation (required by SDK)
  - `bun add uuid` - UUID generation for session management
  - `bun add -d @types/uuid` - UUID type definitions

## SDK Integration Setup

### 3. Claude Code SDK Configuration
**Complexity: Medium**

- [ ] **Create SDK configuration interface**
  - Define `AppConfig` type with default options
  - Include timeout, model, and tool preferences
  - Reference: Use `Options` type from SDK

- [ ] **Initialize SDK wrapper service**
  - Create `ClaudeCodeService` class
  - Import `query` function from `@anthropic-ai/claude-code`
  - Set up error handling with `AbortError` class

- [ ] **Configure project directory integration**
  - Implement path encoding: `-` + `path.replace(/\//g, '-')`
  - Create utility to find projects in `~/.claude/projects`
  - Handle cross-platform path resolution

### 4. Session State Management
**Complexity: Medium**

- [ ] **Define session interfaces**
  ```typescript
  interface SessionInfo {
    sessionId: string;
    projectPath: string;
    timestamp: string;
    cwd: string;
  }
  ```

- [ ] **Implement JSONL parser**
  - Parse line-by-line using `JSON.parse()`
  - Handle malformed JSON lines gracefully
  - Extract message types: `"summary"`, `"user"`, `"assistant"`

- [ ] **Create session utilities**
  - `findProjectSessions(projectPath: string): string[]`
  - `parseSessionFile(filePath: string): SessionMessage[]`
  - `getLatestSession(projectPath: string): SessionInfo | null`

## Feature Implementation Tasks

### 5. Prompt Execution System
**Complexity: Simple**

- [ ] **Create prompt execution service**
  ```typescript
  async function runPrompt(prompt: string, options?: Options): Promise<SDKMessage[]>
  ```

- [ ] **Implement message collection**
  - Iterate through `query()` async generator
  - Collect all messages: system, assistant, user, result
  - Handle streaming with `for await (const message of query())`

- [ ] **Add result extraction**
  - Filter messages by `message.type === "result"`
  - Extract `message.result` for success cases
  - Handle error cases: `"error_max_turns"`, `"error_during_execution"`

### 6. Todo List Control System
**Complexity: Medium**

- [ ] **Define todo interfaces**
  ```typescript
  interface Todo {
    content: string;
    status: "pending" | "in_progress" | "completed";
    activeForm: string;
  }
  ```

- [ ] **Implement max task limit**
  - Create `TodoManager` class with `maxTasks` parameter
  - Validate todo arrays before passing to SDK
  - Truncate or reject todos exceeding limit

- [ ] **Create task specification system**
  - `specifyRequiredTasks(required: string[]): Options`
  - Use `canUseTool` callback to filter `TodoWrite` calls
  - Ensure specified tasks are included in todo lists

- [ ] **Implement todo monitoring**
  - Use `PostToolUse` hooks to capture `TodoWrite` results
  - Extract `newTodos` from `toolUseResult`
  - Track todo state changes across conversation

### 7. Conversation Resume System  
**Complexity: Medium**

- [ ] **Implement session lookup**
  - `findSessionById(sessionId: string): string | null`
  - Search all project directories for matching session files
  - Use UUID format validation for session IDs

- [ ] **Create resume functionality**
  ```typescript
  async function resumeConversation(sessionId: string, prompt: string): Promise<SDKMessage[]>
  ```
  - Use SDK's `resume` option: `{ resume: sessionId }`
  - Validate session exists before attempting resume
  - Handle resume failures gracefully

- [ ] **Add session context restoration**
  - Extract `cwd` from session messages
  - Restore `gitBranch` context if available
  - Apply original session configuration options

### 8. Conversation Duplication System
**Complexity: Complex**

- [ ] **Implement conversation analysis**
  - Parse existing session JSONL file completely
  - Extract essential context: file operations, project state, decisions
  - Identify conversation boundaries and key insights

- [ ] **Create duplication logic**
  ```typescript
  async function duplicateConversation(sourceSessionId: string): Promise<string>
  ```
  - Generate new session UUID with `uuid.v4()`
  - Create summary of previous conversation
  - Extract key context without full conversation history

- [ ] **Implement context optimization**
  - Filter out redundant tool outputs (repeated file reads)
  - Preserve critical decisions and findings
  - Maintain project file structure awareness
  - Limit context to essential information only

- [ ] **Create new session initialization**
  - Start new conversation with optimized context
  - Include summary: "Continuing from previous session where we..."
  - Preserve current working directory and git state
  - Return new session ID for further operations

### 9. Duplicate & Resume Flow
**Complexity: Complex**

- [ ] **Combine duplication and resume**
  ```typescript
  async function duplicateAndResume(sourceSessionId: string, prompt: string): Promise<{
    newSessionId: string;
    messages: SDKMessage[];
  }>
  ```

- [ ] **Implement two-step process**
  1. Call `duplicateConversation()` to create optimized context
  2. Immediately start new conversation with provided prompt
  3. Return both new session ID and conversation results

- [ ] **Add context bridging**
  - Generate initialization prompt with context summary
  - Include essential project state in new conversation
  - Maintain continuity of thought and decision-making

### 10. Task Specification System
**Complexity: Medium**

- [ ] **Create task requirement interface**
  ```typescript
  interface TaskRequirements {
    requiredTasks: string[];
    maxTasks?: number;
    forbiddenTasks?: string[];
  }
  ```

- [ ] **Implement task validation hooks**
  - Use `PreToolUse` hook for `TodoWrite` tool
  - Validate required tasks are present
  - Reject todo lists missing required tasks

- [ ] **Add task injection logic**
  - Automatically add required tasks if missing
  - Maintain specified task priorities
  - Ensure required tasks use appropriate status values

## Data Management

### 11. Session State Persistence
**Complexity: Medium**

- [ ] **Implement session caching**
  - Create in-memory cache for frequently accessed sessions
  - Use LRU eviction policy for memory management
  - Cache parsed session data, not raw JSONL

- [ ] **Add session metadata extraction**
  ```typescript
  interface SessionMetadata {
    sessionId: string;
    projectPath: string;
    startTime: string;
    lastActivity: string;
    messageCount: number;
    toolsUsed: string[];
  }
  ```

- [ ] **Create session indexing**
  - Build index of all sessions by project path
  - Track session relationships (duplicated from)
  - Enable fast session lookup and filtering

### 12. Todo List Data Structures
**Complexity: Simple**

- [ ] **Define todo state tracking**
  ```typescript
  class TodoState {
    tasks: Todo[];
    maxTasks: number;
    requiredTasks: string[];
    lastUpdated: Date;
  }
  ```

- [ ] **Implement todo persistence**
  - Store todo state changes in session data
  - Track todo evolution across conversation turns
  - Enable todo state reconstruction from session history

### 13. Configuration Management
**Complexity: Simple**

- [ ] **Create application config**
  ```typescript
  interface AppConfiguration {
    defaultModel?: string;
    maxTurns: number;
    allowedTools: string[];
    projectsDirectory: string;
    todoDefaults: {
      maxTasks: number;
      requiredTasks: string[];
    };
  }
  ```

- [ ] **Implement config loading**
  - Support environment variables
  - Use configuration file (JSON/YAML)
  - Provide sensible defaults for all options

- [ ] **Add runtime config validation**
  - Use Zod schemas for configuration validation
  - Validate SDK options before query execution
  - Handle configuration errors gracefully

## Integration Tasks

### 14. Core Application Interface
**Complexity: Medium**

- [ ] **Create main application class**
  ```typescript
  class ClaudeCodeApp {
    async runPrompt(prompt: string): Promise<any>
    async resumeConversation(sessionId: string, prompt: string): Promise<any>
    async duplicateConversation(sessionId: string): Promise<string>
    async duplicateAndResume(sessionId: string, prompt: string): Promise<any>
    async setTodoLimits(maxTasks: number, required?: string[]): Promise<void>
    async getSessionHistory(projectPath?: string): Promise<SessionInfo[]>
  }
  ```

- [ ] **Implement unified error handling**
  - Catch and wrap SDK errors appropriately
  - Provide meaningful error messages
  - Handle session not found, parsing errors, network issues

### 15. Utility Functions Implementation
**Complexity: Simple**

- [ ] **Path utilities**
  - `encodeProjectPath(path: string): string`
  - `decodeProjectPath(encoded: string): string`
  - Cross-platform path handling

- [ ] **Session utilities**
  - `generateSessionId(): string`
  - `validateSessionId(id: string): boolean`
  - `getSessionFilePath(projectPath: string, sessionId: string): string`

- [ ] **Message utilities**
  - `extractResult(messages: SDKMessage[]): string | null`
  - `findToolUsage(messages: SDKMessage[], toolName: string): any[]`
  - `getSessionSummary(messages: SDKMessage[]): string`

## Implementation Priority Order

1. **Foundation** (Items 1-4): Project setup and SDK integration
2. **Basic Features** (Items 5, 11-13): Prompt execution and data management
3. **Session Management** (Items 6-7): Todo control and resume functionality  
4. **Advanced Features** (Items 8-10): Duplication and complex workflows
5. **Integration** (Items 14-15): Final application assembly and utilities

## Technical Notes

- **SDK Query Function**: Core interface is `query({ prompt, options })` returning `AsyncGenerator<SDKMessage>`
- **Session Storage**: JSONL files in `~/.claude/projects/-encoded-path/uuid.jsonl`
- **Message Types**: `"system"`, `"user"`, `"assistant"`, `"result"`, `"stream_event"`
- **Todo Tool**: Use `TodoWrite` tool input with `todos: Todo[]` array
- **Resume Option**: Pass `{ resume: sessionId }` in options to continue existing conversation
- **UUID Format**: Use `uuid.v4()` for new session IDs, validate existing IDs

Each checkbox represents a specific, implementable task that contributes to one of the 6 core features. Complete items in dependency order for smooth development progression.