import type { EngineError } from "./errors.js";

export type TaskId = string;
export type TaskScopeId = string;
export type StreamId = string;

export type TaskPriority = "immediate" | "high" | "normal" | "low";
export type TaskFailurePolicy = "fail-fast" | "isolate" | "escalate";

export type TaskLifecycleState = "created" | "queued" | "running" | "waiting" | "completed";

export type CancellationReason =
  | { kind: "user_cancel"; message?: string }
  | { kind: "stop_request"; message?: string }
  | { kind: "timeout"; message?: string; deadlineMonoMs?: number }
  | { kind: "policy_denied"; message?: string }
  | { kind: "host_lifecycle"; message?: string; event?: string }
  | { kind: "unknown"; message?: string };

export type TaskResult<T = unknown> =
  | { kind: "success"; value: T }
  | { kind: "error"; error: EngineError }
  | { kind: "cancelled"; reason: CancellationReason }
  | { kind: "timeout"; reason: CancellationReason };

export type TaskInfoSnapshot = {
  id: TaskId;
  parentId?: TaskId;
  scopeId?: TaskScopeId;
  label?: string;
  priority: TaskPriority;
  failurePolicy: TaskFailurePolicy;
  state: TaskLifecycleState;
  correlationIds?: Record<string, string>;
  createdAtMonoMs: number;
  startedAtMonoMs?: number;
  lastYieldAtMonoMs?: number;
};

export type TaskScopeKind =
  | "app"
  | "session"
  | "tool_run"
  | "hook_run"
  | "mcp_connection"
  | "agent"
  | "custom";

export type TaskScopeSnapshot = {
  id: TaskScopeId;
  kind: TaskScopeKind;
  label?: string;
  parentScopeId?: TaskScopeId;
  taskIds: TaskId[];
  createdAtMonoMs: number;
  closedAtMonoMs?: number;
};

export type ConcurrencyLimiterSnapshot = {
  name: string;
  current: number;
  max: number;
  waitQueueLength: number;
};

export type RuntimeStreamKind = "tool" | "hook" | "mcp" | "telemetry" | "debug";

export type RuntimeStreamSnapshot = {
  id: StreamId;
  kind: RuntimeStreamKind;
  lastEmittedSeq: number;
  closed: boolean;
};

export type PendingTimerSnapshot = {
  id: string;
  ownerTaskId?: TaskId;
  deadlineMonoMs: number;
  reason?: CancellationReason;
};

export type SchedulerQueueDepths = Record<TaskPriority, number>;

export type RuntimeSnapshot = {
  queueDepths: SchedulerQueueDepths;
  tasks: TaskInfoSnapshot[];
  scopes: TaskScopeSnapshot[];
  limiters: ConcurrencyLimiterSnapshot[];
  streams: RuntimeStreamSnapshot[];
  timers: PendingTimerSnapshot[];
};

export type RuntimeShutdownSummary = {
  scopeId: TaskScopeId;
  scopeKind: TaskScopeKind;
  reason: CancellationReason;
  cancelledTasks: number;
  timeoutTasks: number;
  errorTasks: number;
  successTasks: number;
  snapshot: RuntimeSnapshot;
};

export type CoreStreamChunk = {
  kind: "chunk";
  seq: number;
  tsMonoMs: number;
  encoding: "utf-8" | "binary";
  data: string | Uint8Array;
};

export type CoreStreamProgress = {
  kind: "progress";
  seq: number;
  tsMonoMs: number;
  taskId?: TaskId;
  message?: string;
  percent?: number;
  details?: unknown;
};

export type CoreStreamDiagnostic = {
  kind: "diagnostic";
  seq: number;
  tsMonoMs: number;
  message: string;
  fields?: unknown;
};

export type CoreStreamClose = {
  kind: "close";
  seq: number;
  tsMonoMs: number;
  reason: "completed" | "cancelled" | "error" | "closed";
  counters?: Record<string, number>;
};

export type CoreStreamEvent = CoreStreamChunk | CoreStreamProgress | CoreStreamDiagnostic | CoreStreamClose;
