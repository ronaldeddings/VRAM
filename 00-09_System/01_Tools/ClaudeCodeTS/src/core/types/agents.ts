import type { EngineEventSensitivity } from "./events.js";
import type { CancellationReason, TaskPriority } from "./runtime.js";

export type AgentId = string & { readonly __brand: "AgentId" };
export function asAgentId(value: string): AgentId {
  return value as AgentId;
}

export type AgentKindV1 = "background" | "foreground";

export type AgentLifecycleStateV1 =
  | "scheduled"
  | "running"
  | "awaiting_input"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type AgentBudgetV1 = {
  timeoutMs?: number;
  maxTurns?: number;
  maxConcurrent?: number;
  priority?: TaskPriority;
};

export type AgentPersistencePolicyV1 =
  | { kind: "none" }
  | { kind: "summary"; sensitivity?: EngineEventSensitivity }
  | { kind: "full_trace"; sensitivity?: EngineEventSensitivity };

export type AgentProgressV1 = {
  tsMonoMs: number;
  message?: string;
  percent?: number;
  details?: unknown;
};

export type AgentSummaryV1 = {
  id: AgentId;
  kind: AgentKindV1;
  name: string;
  state: AgentLifecycleStateV1;
  createdAtMonoMs: number;
  updatedAtMonoMs: number;
  startedAtMonoMs?: number;
  endedAtMonoMs?: number;
  lastProgress?: AgentProgressV1;
  error?: string;
  cancelled?: CancellationReason;
  persistence?: AgentPersistencePolicyV1;
};

export type AgentRunResultV1 =
  | { kind: "completed"; summary?: string }
  | { kind: "failed"; error: string }
  | { kind: "cancelled"; reason: CancellationReason };

export type DurableTaskCheckpointV1 = {
  cursor: string;
  tsMonoMs: number;
  summary?: string;
};

export type DurableTaskRetryStateV1 = {
  attempt: number;
  nextDelayMs?: number;
  lastError?: string;
};

export type DurableTaskRecordV1 = {
  schemaVersion: 1;
  id: string;
  label?: string;
  scope: "app" | "workspace" | "session";
  sessionId?: string;
  workspaceId?: string;
  requiredCapabilities?: string[];
  createdAtMonoMs: number;
  updatedAtMonoMs: number;
  lastCheckpoint?: DurableTaskCheckpointV1;
  retry?: DurableTaskRetryStateV1;
};

export type LongRunningTaskStateV1 = "scheduled" | "running" | "paused" | "completed" | "failed" | "cancelled";

export type LongRunningTaskKindV1 = "background_agent" | "remote_agent_task" | "local_bash" | "tool_run" | "custom";

export type LongRunningTaskEntityV1 = {
  id: string;
  kind: LongRunningTaskKindV1;
  label: string;
  state: LongRunningTaskStateV1;
  createdAtMonoMs: number;
  updatedAtMonoMs: number;
  startedAtMonoMs?: number;
  endedAtMonoMs?: number;
  priority?: TaskPriority;
  progress?: AgentProgressV1;
  nextAction?: string;
  error?: string;
  cancelled?: CancellationReason;
  durable?: DurableTaskRecordV1;
};
