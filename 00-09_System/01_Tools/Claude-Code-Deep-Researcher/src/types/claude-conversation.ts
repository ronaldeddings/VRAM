/**
 * Complete TypeScript type definitions for Claude Code JSONL conversation entries.
 * Based on analysis of actual conversation files from ~/.claude/projects/.
 * 
 * All types derived from real JSONL structure patterns discovered in production files.
 */

// =====================================
// Base Conversation Entry Types
// =====================================

/** Base metadata fields shared by all conversation entries */
interface BaseConversationEntry {
  /** Unique identifier for this entry */
  uuid: string;
  /** ISO timestamp when entry was created */
  timestamp: string;
  /** UUID of parent entry (null for root entries) */
  parentUuid: string | null;
  /**
   * Optional logical parent UUID for complex hierarchies.
   * Used in compact boundaries to track relationships before compaction.
   */
  logicalParentUuid?: string;
  /** Whether this entry is part of a sidechain */
  isSidechain: boolean;
  /** Type of user interaction (always "external" in discovered data) */
  userType: "external";
  /** Current working directory when entry was created */
  cwd: string;
  /** Session identifier this entry belongs to */
  sessionId: string;
  /** Claude Code version used */
  version: string;
  /** Git branch name at time of entry */
  gitBranch: string;
  /**
   * Agent identifier for multi-agent scenarios.
   * Present when conversation involves Task tool sub-agents or multiple agents.
   */
  agentId?: string;
}

// =====================================
// Message Content Types
// =====================================

/** Text content block in messages */
interface TextContent {
  type: "text";
  text: string;
}

/** Tool use content block in assistant messages */
interface ToolUseContent {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, any>;
}

/** Tool result content block in user messages */
interface ToolResultContent {
  type: "tool_result";
  tool_use_id: string;
  content: string | Array<{ type: string; text?: string; [key: string]: any }>;
  is_error?: boolean;
}

/** Union of all possible message content types */
type MessageContent = TextContent | ToolUseContent | ToolResultContent;

// =====================================
// Core Entry Type Definitions
// =====================================

/** User message entry from conversation */
interface UserMessageEntry extends BaseConversationEntry {
  type: "user";
  message: {
    role: "user";
    content: string | MessageContent[];
  };
  /** Tool result data when entry contains tool results */
  toolUseResult?: {
    oldTodos?: TodoItem[];
    newTodos?: TodoItem[];
    [key: string]: any;
  };
  /**
   * Extended thinking metadata controlling Claude's reasoning depth.
   * Configures thinking mode for the conversation turn.
   */
  thinkingMetadata?: {
    /** Thinking depth level: high, medium, low */
    level: "high" | "medium" | "low" | string;
    /** Whether thinking is disabled for this turn */
    disabled: boolean;
    /** Trigger conditions that activated thinking mode */
    triggers: string[];
  };
  /**
   * Flag indicating this is a compact summary message.
   * These messages contain conversation summaries after compaction.
   */
  isCompactSummary?: boolean;
  /**
   * Flag indicating this message is only visible in transcript view.
   * Used for system-generated summaries and compact boundaries.
   */
  isVisibleInTranscriptOnly?: boolean;
}

/** Assistant message entry with tool usage and responses */
interface AssistantMessageEntry extends BaseConversationEntry {
  type: "assistant";
  /** Request ID for tracking API calls */
  requestId?: string;
  message: {
    id: string;
    type: "message";
    role: "assistant";
    model: string;
    content: MessageContent[];
    stop_reason: string | null;
    stop_sequence: string | null;
    usage: {
      input_tokens: number;
      cache_creation_input_tokens: number;
      cache_read_input_tokens: number;
      cache_creation: {
        ephemeral_5m_input_tokens: number;
        ephemeral_1h_input_tokens: number;
      };
      output_tokens: number;
      service_tier: string;
    };
  };
  /**
   * Flag indicating this is a synthetic API error message.
   * When true, the message contains error information rather than actual Claude response.
   * Typically has model: "<synthetic>" and zero token usage.
   */
  isApiErrorMessage?: boolean;
}

/** System message entry for internal operations */
interface SystemMessageEntry extends BaseConversationEntry {
  type: "system";
  /**
   * System message subtype indicating the kind of system operation.
   * - compact_boundary: Marks compaction points in conversation
   * - informational: General information messages
   * - init: Session initialization messages
   * - local_command: Local slash command execution (e.g., /memory)
   */
  subtype: "compact_boundary" | "informational" | "init" | "local_command";
  content?: string;
  isMeta?: boolean;
  level?: "info";
  /**
   * Compaction metadata tracking token usage before compaction.
   * Note: Both camelCase and snake_case variants exist in production logs.
   * Parser should handle both for backward compatibility.
   */
  compact_metadata?: {
    trigger: "auto" | "manual";
    /** @deprecated Use preTokens instead. Kept for backward compatibility. */
    pre_tokens?: number;
    /** Token count before compaction (camelCase variant) */
    preTokens?: number;
  };
  /**
   * Compaction metadata (camelCase variant, preferred).
   * Same structure as compact_metadata but using camelCase naming.
   */
  compactMetadata?: {
    trigger: "auto" | "manual";
    /** Token count before compaction */
    preTokens?: number;
  };
  // Additional fields for system init messages
  apiKeySource?: string;
  tools?: string[];
  mcp_servers?: Array<{ name: string; status: string }>;
  model?: string;
  permissionMode?: string;
  slash_commands?: string[];
  output_style?: string;
}

/** Conversation summary entry */
interface SummaryEntry {
  type: "summary";
  summary: string;
  leafUuid: string;
  /**
   * Session identifier for the summary.
   * Present in most summaries but may be optional in some cases.
   */
  sessionId?: string;
  /** Whether summary is only visible in transcript */
  isVisibleInTranscriptOnly?: boolean;
}

/**
 * Queue operation entry for task management.
 * Tracks enqueued tasks and operations in the conversation flow.
 */
interface QueueOperationEntry {
  type: "queue-operation";
  /** Operation type (typically "enqueue") */
  operation: "enqueue" | string;
  /** ISO timestamp when operation occurred */
  timestamp: string;
  /** Content/description of the queued task */
  content: string;
  /** Session identifier this operation belongs to */
  sessionId: string;
}

/**
 * File history snapshot entry tracking file changes.
 * Captures snapshots of tracked files and their backup states.
 */
interface FileHistorySnapshotEntry {
  type: "file-history-snapshot";
  /** Message ID associated with this snapshot */
  messageId: string;
  /** Snapshot data containing tracked file information */
  snapshot: {
    /** Message ID this snapshot relates to */
    messageId: string;
    /** Map of file paths to their backup metadata */
    trackedFileBackups: Record<string, {
      /** Backup file name (null if no backup created yet) */
      backupFileName: string | null;
      /** Version number of the file */
      version: number;
      /** ISO timestamp when backup was created */
      backupTime: string;
    }>;
    /** ISO timestamp when snapshot was created */
    timestamp: string;
  };
  /**
   * Flag indicating if this is a snapshot update (vs initial snapshot).
   * false = initial snapshot, true = update to existing snapshot
   */
  isSnapshotUpdate: boolean;
}

/** Result entry marking end of conversation */
interface ResultEntry extends BaseConversationEntry {
  type: "result";
  subtype: "success" | "error_max_turns" | "error_during_execution";
  duration_ms: number;
  duration_api_ms: number;
  is_error: boolean;
  num_turns: number;
  result?: string;
  total_cost_usd: number;
  usage: {
    input_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
    output_tokens: number;
    service_tier: string;
  };
  modelUsage?: {
    [modelName: string]: {
      inputTokens: number;
      outputTokens: number;
      cacheReadInputTokens: number;
      cacheCreationInputTokens: number;
      webSearchRequests: number;
      costUSD: number;
    };
  };
  permission_denials?: Array<{
    tool_name: string;
    tool_use_id: string;
    tool_input: Record<string, unknown>;
  }>;
}

// =====================================
// Tool-Specific Type Definitions
// =====================================

/** Todo item structure used in TodoWrite tool */
interface TodoItem {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
}

/** TodoWrite tool input structure */
interface TodoWriteInput {
  todos: TodoItem[];
}

/** Bash tool input structure */
interface BashInput {
  command: string;
  description?: string;
  timeout?: number;
  run_in_background?: boolean;
}

/** File read tool input structure */
interface ReadInput {
  file_path: string;
  limit?: number;
  offset?: number;
}

/** File write tool input structure */
interface WriteInput {
  file_path: string;
  content: string;
}

/** File edit tool input structure */
interface EditInput {
  file_path: string;
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}

/** Multi-edit tool input structure */
interface MultiEditInput {
  file_path: string;
  edits: Array<{
    old_string: string;
    new_string: string;
    replace_all?: boolean;
  }>;
}

/** Grep tool input structure */
interface GrepInput {
  pattern: string;
  path?: string;
  glob?: string;
  output_mode?: "content" | "files_with_matches" | "count";
  "-B"?: number;
  "-A"?: number;
  "-C"?: number;
  "-n"?: boolean;
  "-i"?: boolean;
  type?: string;
  head_limit?: number;
  multiline?: boolean;
}

/** Glob tool input structure */
interface GlobInput {
  pattern: string;
  path?: string;
}

/** WebSearch tool input structure */
interface WebSearchInput {
  query: string;
  allowed_domains?: string[];
  blocked_domains?: string[];
}

/** WebFetch tool input structure */
interface WebFetchInput {
  url: string;
  prompt: string;
}

/** Union of all tool input types */
type ToolInput = 
  | TodoWriteInput 
  | BashInput 
  | ReadInput 
  | WriteInput 
  | EditInput 
  | MultiEditInput
  | GrepInput 
  | GlobInput 
  | WebSearchInput 
  | WebFetchInput;

// =====================================
// Main Conversation Types
// =====================================

/** Discriminated union of all conversation entry types */
type ConversationEntry =
  | UserMessageEntry
  | AssistantMessageEntry
  | SystemMessageEntry
  | SummaryEntry
  | QueueOperationEntry
  | FileHistorySnapshotEntry
  | ResultEntry;

/** Conversation tree node for hierarchy analysis */
interface ConversationNode {
  entry: ConversationEntry;
  children: ConversationNode[];
  depth: number;
  /** Whether this node represents a branching point */
  isBranch?: boolean;
}

/** Complete conversation chain representation */
interface ConversationChain {
  sessionId: string;
  entries: ConversationEntry[];
  startTime: string;
  endTime: string;
  totalEntries: number;
  /** Project path this conversation belongs to */
  projectPath: string;
  /** Total cost in USD for this conversation */
  totalCost?: number;
  /** Token usage summary */
  tokenUsage?: {
    input: number;
    output: number;
    cached: number;
  };
}

/** Individual step summary for action analysis */
interface StepSummary {
  stepNumber: number;
  type: "tool_use" | "response" | "decision" | "system";
  tool?: string;
  description: string;
  timestamp: string;
  success?: boolean;
  /** Duration in milliseconds if available */
  duration?: number;
  /** Token cost for this step */
  tokenCost?: number;
}

/** Conversation metadata for indexing and search */
interface ConversationMetadata {
  sessionId: string;
  filePath: string;
  projectPath: string;
  size: number;
  lastModified: Date;
  /** Number of entries in conversation */
  entryCount?: number;
  /** Unique tools used in conversation */
  toolsUsed?: string[];
  /** Whether conversation completed successfully */
  completedSuccessfully?: boolean;
  /** Total conversation duration */
  duration?: number;
}

/** Session analysis results */
interface SessionAnalysis {
  sessionId: string;
  summary: {
    totalEntries: number;
    uniqueTools: string[];
    todoEvolution: TodoItem[][];
    decisionPoints: ConversationEntry[];
    errorCount: number;
    successfulToolUses: number;
    failedToolUses: number;
  };
  timeline: StepSummary[];
  costs: {
    totalUSD: number;
    tokenBreakdown: {
      input: number;
      output: number;
      cached: number;
    };
  };
  performance: {
    averageResponseTime: number;
    longestOperation: number;
    toolUsageFrequency: Record<string, number>;
  };
}

// =====================================
// Validation and Error Types
// =====================================

/** Validation result for conversation entries */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  /** UUIDs of entries with issues */
  problematicEntries?: string[];
}

/** Relationship validation results */
interface RelationshipValidationResult {
  isValid: boolean;
  orphanedEntries: string[];
  circularReferences: string[];
  missingParents: Array<{ childUuid: string; missingParentUuid: string }>;
}

/** Tool usage validation results */
interface ToolValidationResult {
  isValid: boolean;
  invalidToolUses: Array<{
    entryUuid: string;
    toolName: string;
    issue: string;
  }>;
  missingToolResults: Array<{
    toolUseId: string;
    toolName: string;
  }>;
}

// =====================================
// Exported Types
// =====================================

export type {
  // Base types
  BaseConversationEntry,
  MessageContent,
  TextContent,
  ToolUseContent,
  ToolResultContent,

  // Entry types
  ConversationEntry,
  UserMessageEntry,
  AssistantMessageEntry,
  SystemMessageEntry,
  SummaryEntry,
  QueueOperationEntry,
  FileHistorySnapshotEntry,
  ResultEntry,

  // Tool types
  TodoItem,
  ToolInput,
  TodoWriteInput,
  BashInput,
  ReadInput,
  WriteInput,
  EditInput,
  MultiEditInput,
  GrepInput,
  GlobInput,
  WebSearchInput,
  WebFetchInput,

  // Analysis types
  ConversationNode,
  ConversationChain,
  StepSummary,
  ConversationMetadata,
  SessionAnalysis,

  // Validation types
  ValidationResult,
  RelationshipValidationResult,
  ToolValidationResult,
};

/** Type guard to check if entry is a user message */
export function isUserMessage(entry: ConversationEntry): entry is UserMessageEntry {
  return entry.type === "user";
}

/** Type guard to check if entry is an assistant message */
export function isAssistantMessage(entry: ConversationEntry): entry is AssistantMessageEntry {
  return entry.type === "assistant";
}

/** Type guard to check if entry is a system message */
export function isSystemMessage(entry: ConversationEntry): entry is SystemMessageEntry {
  return entry.type === "system";
}

/** Type guard to check if entry is a summary */
export function isSummaryEntry(entry: ConversationEntry): entry is SummaryEntry {
  return entry.type === "summary";
}

/** Type guard to check if entry is a result */
export function isResultEntry(entry: ConversationEntry): entry is ResultEntry {
  return entry.type === "result";
}

/** Type guard to check if content is tool use */
export function isToolUseContent(content: MessageContent): content is ToolUseContent {
  return content.type === "tool_use";
}

/** Type guard to check if content is tool result */
export function isToolResultContent(content: MessageContent): content is ToolResultContent {
  return content.type === "tool_result";
}

/** Type guard to check if content is text */
export function isTextContent(content: MessageContent): content is TextContent {
  return content.type === "text";
}

/** Type guard to check if entry is a queue operation */
export function isQueueOperation(entry: ConversationEntry): entry is QueueOperationEntry {
  return entry.type === "queue-operation";
}

/** Type guard to check if entry is a file history snapshot */
export function isFileHistorySnapshot(entry: ConversationEntry): entry is FileHistorySnapshotEntry {
  return entry.type === "file-history-snapshot";
}

/** Type guard to check if entry has agent ID */
export function hasAgentId(entry: ConversationEntry): entry is (UserMessageEntry | AssistantMessageEntry) & { agentId: string } {
  return ('agentId' in entry && entry.agentId !== undefined);
}

/** Type guard to check if user message has thinking metadata */
export function hasThinkingMetadata(entry: ConversationEntry): entry is UserMessageEntry & { thinkingMetadata: NonNullable<UserMessageEntry['thinkingMetadata']> } {
  return entry.type === "user" && 'thinkingMetadata' in entry && entry.thinkingMetadata !== undefined;
}

/** Type guard to check if assistant message is an API error */
export function isApiErrorMessage(entry: ConversationEntry): entry is AssistantMessageEntry & { isApiErrorMessage: true } {
  return entry.type === "assistant" && 'isApiErrorMessage' in entry && entry.isApiErrorMessage === true;
}

/** Type guard to check if user message is a compact summary */
export function isCompactSummary(entry: ConversationEntry): entry is UserMessageEntry & { isCompactSummary: true } {
  return entry.type === "user" && 'isCompactSummary' in entry && entry.isCompactSummary === true;
}