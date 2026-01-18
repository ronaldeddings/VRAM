# Claude Code Task Validation Architecture & Data Flow

## Executive Summary

This document outlines the architecture and data flow for implementing a task validation system using Claude Code's conversation history and SDK capabilities. The system enables spawning independent Claude Code instances to validate task completion before proceeding to subsequent tasks, creating a robust validation loop.

## Conversation History Storage Architecture

### Directory Structure
```
~/.claude/projects/
├── -{project-path}/           # Project directories named with escaped absolute paths
│   ├── {session-uuid}.jsonl  # Individual conversation histories
│   └── ...                   # Multiple session files per project
```

### Session File Format (.jsonl)
Each conversation session is stored as a JSONL (JSON Lines) file where each line represents a discrete interaction:

```typescript
// Session metadata and message structure
type SDKMessage = 
  | SDKUserMessage          // User inputs and prompts
  | SDKAssistantMessage     // Assistant responses
  | SDKResultMessage        // Task completion summaries
  | SDKSystemMessage        // System initialization data
  | SDKPartialAssistantMessage // Streaming events
```

### Key Data Points for Validation
From conversation history analysis, each task interaction contains:

- **Task Definition**: Original user prompts and goals
- **Tool Invocations**: Specific tools used (Read, Write, Edit, Bash, etc.)
- **Tool Results**: Actual outputs from tool executions
- **State Transitions**: TodoWrite entries showing task progression
- **Error Handling**: Failed operations and recovery attempts
- **Completion Artifacts**: Final results and verification data

## SDK Architecture for Validation Instances

### Core SDK Components

#### 1. Query Function
```typescript
function query({
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: Options;
}): Query
```

**Validation Usage**: Spawn new instances with specific validation prompts extracted from completed task history.

#### 2. Options Configuration
```typescript
type Options = {
  cwd?: string;                    // Set to original task working directory
  resume?: string;                 // Resume from specific conversation point
  mcpServers?: Record<string, McpServerConfig>;
  hooks?: Partial<Record<HookEvent, HookCallbackMatcher[]>>;
  maxTurns?: number;               // Limit validation conversation scope
  abortController?: AbortController; // Enable validation timeout control
}
```

#### 3. Hook System for State Management
```typescript
type HookEvent = "PreToolUse" | "PostToolUse" | "SessionStart" | "SessionEnd" | "Stop";
```

**Validation Integration**: Hook into tool usage to capture validation evidence and coordinate between primary and validator instances.

## Validation System Architecture

### 1. Data Extraction Layer

#### Conversation Parser
```typescript
interface ConversationParser {
  extractTaskDefinitions(sessionId: string): TaskDefinition[];
  extractToolInvocations(taskId: string): ToolInvocation[];
  extractCompletionCriteria(taskId: string): CompletionCriteria;
  extractArtifacts(taskId: string): TaskArtifact[];
}
```

#### Task State Extraction
From TodoWrite tool usage patterns:
```typescript
interface TaskDefinition {
  content: string;           // Task description
  status: 'completed';       // Only extract completed tasks
  activeForm: string;        // Task execution description
  toolSequence: ToolInvocation[]; // Ordered tool usage
  artifacts: TaskArtifact[]; // Generated files, outputs
  validationCriteria: string[]; // Success conditions
}
```

### 2. Validation Instance Spawning

#### Primary → Validator Communication
```typescript
interface ValidationRequest {
  originalTaskId: string;
  taskDefinition: TaskDefinition;
  completionArtifacts: TaskArtifact[];
  validationInstructions: string;
  workingDirectory: string;
  timeoutMs: number;
}
```

#### Validator Instance Configuration
```typescript
const validatorOptions: Options = {
  cwd: originalTask.workingDirectory,
  maxTurns: 10,  // Limit validation scope
  mcpServers: originalTask.mcpConfig,
  hooks: {
    PostToolUse: [validationResultCapture],
    SessionEnd: [validationSummaryGeneration]
  },
  abortController: validationTimeoutController
};
```

### 3. Control Loop Architecture

#### State Machine Design
```
Primary Instance States:
├── TaskExecution
├── TaskCompleted → ValidationRequested
├── ValidationPending
├── ValidationPassed → NextTask
└── ValidationFailed → TaskRetry | TaskAbort
```

#### Validation Orchestrator
```typescript
class TaskValidationOrchestrator {
  private primaryInstance: Query;
  private validatorPool: Map<string, Query>;
  private taskQueue: TaskDefinition[];
  private validationResults: Map<string, ValidationResult>;

  async validateTask(task: TaskDefinition): Promise<ValidationResult>;
  async spawnValidator(request: ValidationRequest): Promise<Query>;
  async aggregateValidationResults(taskId: string): Promise<ValidationDecision>;
  async handleValidationFailure(taskId: string): Promise<RetryStrategy>;
}
```

## Data Flow Architecture

### 1. Task Execution Phase
```
User Request → Primary Claude Instance
├── Parse requirements into tasks
├── Execute tasks with TodoWrite tracking
├── Capture tool invocations and results
└── Mark tasks as completed with artifacts
```

### 2. Validation Trigger Phase
```
Task Completion Signal → Validation Orchestrator
├── Extract task definition from conversation history
├── Identify completion artifacts and criteria
├── Generate validation instructions
└── Spawn validator instance with constrained context
```

### 3. Validation Execution Phase
```
Validator Instance Spawn → Independent Validation
├── Receive task definition and artifacts
├── Execute verification procedures
├── Validate artifacts against criteria
├── Generate validation report
└── Return validation decision
```

### 4. Control Flow Decision Phase
```
Validation Result → Primary Instance Control
├── ValidationPassed → Proceed to next task
├── ValidationFailed → Retry strategy
│   ├── Retry with modifications
│   ├── Request user clarification
│   └── Abort task sequence
└── ValidationError → System error handling
```

## Inter-Instance State Management

### 1. Shared State Store
```typescript
interface ValidationState {
  sessionId: string;
  taskQueue: TaskDefinition[];
  activeValidations: Map<string, ValidationStatus>;
  completedTasks: Map<string, ValidationResult>;
  systemState: {
    workingDirectory: string;
    fileSystemSnapshot: FileSystemState;
    environmentVariables: Record<string, string>;
  };
}
```

### 2. State Synchronization Mechanisms

#### File System Checkpoints
- Capture file system state before/after each task
- Enable validators to verify expected changes
- Provide rollback capability for failed validations

#### Environment Consistency
- Preserve working directory context
- Maintain environment variable state
- Ensure tool availability across instances

#### Communication Protocols
```typescript
interface ValidationProtocol {
  requestValidation(task: TaskDefinition): Promise<ValidationResult>;
  reportProgress(validationId: string, status: ValidationStatus): void;
  shareArtifacts(artifacts: TaskArtifact[]): void;
  syncEnvironment(environmentState: EnvironmentState): void;
}
```

## Validation Strategies

### 1. Artifact Verification
- File existence and content validation
- Output format and structure verification
- Error state and exception handling validation

### 2. Behavioral Validation
- Re-execution of critical tool sequences
- Side effect verification (file changes, system state)
- Integration testing of complex workflows

### 3. Semantic Validation
- Goal achievement verification
- Requirements satisfaction checking
- Quality criteria assessment

## Implementation Considerations

### 1. Resource Management
- **Memory**: Limit validator instance memory footprint
- **CPU**: Implement validation timeouts and resource limits
- **Storage**: Manage conversation history growth and cleanup

### 2. Error Handling
- **Validation Failures**: Structured error reporting and recovery
- **System Errors**: Graceful degradation and fallback strategies
- **Communication Errors**: Inter-instance communication resilience

### 3. Security Considerations
- **Sandbox Isolation**: Isolate validator instances from primary environment
- **Data Privacy**: Limit validator access to relevant task data only
- **Resource Limits**: Prevent validator instances from system resource exhaustion

### 4. Performance Optimization
- **Parallel Validation**: Run multiple validators concurrently when possible
- **Caching**: Reuse validation results for similar tasks
- **Incremental Validation**: Validate only changed components when possible

## Monitoring and Observability

### 1. Validation Metrics
- Task validation success/failure rates
- Validation execution time distribution
- Resource utilization per validation
- False positive/negative rates

### 2. System Health Monitoring
- Instance spawn/cleanup success rates
- Inter-instance communication latency
- State synchronization consistency
- Error recovery effectiveness

### 3. Audit Trail
- Complete validation decision history
- Task execution and validation correlation
- Performance bottleneck identification
- System improvement opportunity tracking

## Conclusion

This architecture enables a robust task validation system that leverages Claude Code's conversation history and SDK capabilities to create independent validation instances. The system provides strong guarantees of task completion while maintaining system reliability and performance through structured state management, controlled resource usage, and comprehensive error handling.

The key innovation is the ability to extract rich task context from conversation history and replay validation scenarios in isolated instances, creating a self-validating system that can operate with high confidence in complex, multi-step workflows.