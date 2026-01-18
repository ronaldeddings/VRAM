import type { EngineError } from "./errors.js";
import type { VersionedEnvelopeBase } from "./schema.js";
import type { RuntimeShutdownSummary, RuntimeSnapshot, TaskId } from "./runtime.js";
import type { StateSnapshotV1 } from "./state.js";
import type { AgentId, AgentProgressV1, AgentRunResultV1, AgentSummaryV1 } from "./agents.js";
import type { AppState } from "../state/state.js";
import type { StructuredLogRecordV1, TelemetryEventEnvelopeV1 } from "./observability.js";

export type EngineEventChannel = "ui" | "diagnostic" | "telemetry" | "transcript" | "debug";
export type EngineEventSeverity = "debug" | "info" | "warn" | "error";

export type EngineEventSensitivity = "public" | "internal" | "pii" | "secret";

export type EngineEventCorrelationIds = {
  promptId?: string;
  taskId?: TaskId;
  toolRunId?: string;
  hookRunId?: string;
  mcpRequestId?: string;
  agentId?: AgentId;
};

export type EngineEventCursor = {
  channel: EngineEventChannel;
  seq: number;
};

export type EngineEvent =
  | { type: "engine/ready" }
  | { type: "engine/stopped"; reason: string }
  | { type: "engine/error"; error: EngineError }
  | { type: "diag/log"; level: EngineEventSeverity; message: string; fields?: unknown }
  | { type: "diag/structured-log"; record: StructuredLogRecordV1 }
  | { type: "telemetry/event"; event: TelemetryEventEnvelopeV1 }
  | { type: "runtime/snapshot"; snapshot: RuntimeSnapshot }
  | { type: "runtime/hang-detected"; snapshot: RuntimeSnapshot; summary: string }
  | { type: "runtime/shutdown-summary"; summary: RuntimeShutdownSummary }
  | { type: "state/snapshot"; snapshot: StateSnapshotV1 }
  | { type: "state/app-state"; state: AppState }
  | { type: "settings/snapshot"; settings: unknown }
  | { type: "ui/notification"; message: string; title?: string; kind?: string }
  | { type: "ui/prompt"; promptId: string; message: string }
  | { type: "agent/updated"; agent: AgentSummaryV1 }
  | { type: "agent/progress"; agentId: AgentId; progress: AgentProgressV1 }
  | { type: "agent/result"; agentId: AgentId; result: AgentRunResultV1 }
  | {
      type: "ui/approval-request";
      requestId: string;
      kind: "tool" | "network" | "sandbox" | "other";
      message: string;
      details?: unknown;
    };

export type EngineEventEnvelope = VersionedEnvelopeBase & {
  kind: "engine_event_envelope";
  eventId: string;
  sessionId?: string;
  workspaceId?: string;
  channel: EngineEventChannel;
  severity: EngineEventSeverity;
  seq: number;
  tsMonoMs: number;
  tsWallMs?: number;
  correlationIds?: EngineEventCorrelationIds;
  sensitivity: EngineEventSensitivity;
  payload: EngineEvent;
};

export type HostEvent =
  | { type: "host/user-input"; text: string }
  | { type: "host/cancel"; requestId?: string }
  | { type: "host/stop" }
  | { type: "host/backgrounded" }
  | { type: "host/foregrounded" }
  | { type: "host/network-state"; state: "online" | "offline" | "unknown" }
  | { type: "host/memory-pressure"; level: "low" | "medium" | "high" | "unknown" };
