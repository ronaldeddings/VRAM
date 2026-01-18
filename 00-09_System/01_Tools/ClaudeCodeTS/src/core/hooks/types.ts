import type { PermissionUpdate } from "../permissions/types.js";
import type { ToolName, ToolResult } from "../tools/types.js";
import type { HookRunId } from "../types/state.js";
import type { CancellationReason } from "../types/runtime.js";

export type HookEventName =
  | "PreToolUse"
  | "PostToolUse"
  | "PostToolUseFailure"
  | "PermissionRequest"
  | "Stop"
  | "SubagentStop"
  | "SubagentStart"
  | "UserPromptSubmit"
  | "SessionStart"
  | "SessionEnd"
  | "Notification"
  | "PreCompact"
  | "StatusLine"
  | "FileSuggestion";

export type HookSource = "settings" | "policy" | "plugin" | "session";

export type HookConfigError = {
  kind: "validation_error" | "parse_error";
  source: HookSource;
  eventName?: HookEventName;
  message: string;
  pointer?: string;
  details?: unknown;
};

export type HookMatcherCompiled =
  | { kind: "match_all"; original?: string }
  | { kind: "exact"; original: string; value: string }
  | { kind: "one_of"; original: string; values: string[] }
  | { kind: "regex"; original: string; regex: RegExp }
  | { kind: "invalid"; original: string; error: string };

export type HookAction =
  | { kind: "EmitNotification"; title: string; message: string; notificationKind?: string }
  | { kind: "AppendTranscriptContext"; text: string; dedupeKey?: string; sensitivity?: "public" | "internal" | "pii" | "secret" }
  | { kind: "BlockContinuation"; reasonCode: string; message: string }
  | { kind: "UpdateToolInput"; mode: "replace" | "merge"; value: unknown }
  | { kind: "UpdateToolOutput"; mode: "replace_data" | "merge_data"; value: unknown }
  | { kind: "RequestPermissionDecision"; reason: string; suggestedUpdates?: PermissionUpdate[] }
  | { kind: "RunTool"; toolName: ToolName; input: unknown; withHooks?: boolean }
  | { kind: "RunModelCheck"; promptTemplate: string; arguments?: string[]; maxTokens?: number }
  | { kind: "RunHookAgent"; promptTemplate: string; arguments?: string[]; maxTurns?: number }
  | { kind: "StartBackgroundTask"; label: string; timeoutMs?: number }
  | { kind: "SetStatusLine"; lines: string[] }
  | { kind: "SuggestFiles"; files: string[] };

export type HookBudget = {
  timeoutMs?: number;
  maxToolCalls?: number;
};

export type HookDefinitionBase = {
  hookId: string;
  source: HookSource;
  definitionVersion: number;
  priority?: number;
  maxRunsPerSession?: number;
  cooldownMs?: number;
  concurrency?: "sequential" | "parallel";
  budget?: HookBudget;
};

export type WorkflowHookDefinition = HookDefinitionBase & {
  type: "workflow";
  actions: HookAction[];
  allowNestedToolRuns?: boolean;
  migratedFrom?: { legacyType: string; legacyKey: string };
};

export type LegacyCommandHookDefinition = HookDefinitionBase & {
  type: "command";
  command: string;
  timeoutMs?: number;
};

export type LegacyPromptHookDefinition = HookDefinitionBase & {
  type: "prompt";
  prompt: string;
};

export type LegacyAgentHookDefinition = HookDefinitionBase & {
  type: "agent";
  promptTemplate: string;
  maxTurns: number;
};

export type HookDefinition = WorkflowHookDefinition | LegacyCommandHookDefinition | LegacyPromptHookDefinition | LegacyAgentHookDefinition;

export type HookMatcher = {
  source: HookSource;
  eventName: HookEventName;
  matcher?: string;
  matcherCompiled: HookMatcherCompiled;
  hooks: HookDefinition[];
};

export type HooksConfig = Partial<Record<HookEventName, HookMatcher[]>>;

export type HookMatcherInput = { matcher?: string; hooks: unknown[] };
export type HooksConfigInput = Partial<Record<HookEventName, HookMatcherInput[]>>;

export type HookRunIdLike = HookRunId;

export type HookStreamEventKind =
  | "progress"
  | "success"
  | "non_blocking_error"
  | "blocking_error"
  | "cancelled"
  | "diagnostic"
  | "close";

export type HookStreamEvent = {
  hookRunId: HookRunIdLike;
  hookId: string;
  seq: number;
  tsMonoMs: number;
  kind: HookStreamEventKind;
  payload: unknown;
};

export type HookEffect =
  | { kind: "BlockContinuation"; reasonCode: string; message: string; hookId: string; source: HookSource }
  | { kind: "UpdateToolInput"; mode: "replace" | "merge"; value: unknown; hookId: string; source: HookSource }
  | { kind: "UpdateToolOutput"; mode: "replace_data" | "merge_data"; value: unknown; hookId: string; source: HookSource }
  | { kind: "AppendTranscriptContext"; text: string; dedupeKey?: string; sensitivity?: "public" | "internal" | "pii" | "secret"; hookId: string; source: HookSource }
  | { kind: "ProposePermissionUpdates"; updates: PermissionUpdate[]; hookId: string; source: HookSource }
  | { kind: "EmitNotification"; title: string; message: string; notificationKind?: string; hookId: string; source: HookSource }
  | { kind: "SetStatusLine"; lines: string[]; hookId: string; source: HookSource }
  | { kind: "SuggestFiles"; files: string[]; hookId: string; source: HookSource }
  | { kind: "StartBackgroundTask"; label: string; timeoutMs?: number; hookId: string; source: HookSource }
  | { kind: "ToolResult"; toolName: ToolName; result: ToolResult<unknown>; hookId: string; source: HookSource };

export type HookEffectAuditEvent =
  | { kind: "effect_requested"; hookId: string; hookSource: HookSource; effect: HookEffect["kind"]; details?: unknown }
  | { kind: "effect_applied"; hookId: string; hookSource: HookSource; effect: HookEffect["kind"]; details?: unknown }
  | { kind: "effect_denied"; hookId: string; hookSource: HookSource; effect: HookEffect["kind"]; reason: string; details?: unknown };

export type HookOutcome =
  | { hookId: string; status: "success"; effects: HookEffect[] }
  | { hookId: string; status: "non_blocking_error"; error: string; effects: HookEffect[] }
  | { hookId: string; status: "blocking_error"; error: string; effects: HookEffect[] }
  | { hookId: string; status: "cancelled"; reason?: string; effects: HookEffect[] };

export type HookRunResult = {
  hookRunId: HookRunIdLike;
  eventName: HookEventName;
  matchedHookIds: string[];
  outcomes: HookOutcome[];
  effects: HookEffect[];
  audit: HookEffectAuditEvent[];
  cancelled?: CancellationReason;
};

export type HookConfigDiffReport =
  | { kind: "hook_config_diff"; changed: false }
  | { kind: "hook_config_diff"; changed: true; message: string; before?: string; after?: string };
