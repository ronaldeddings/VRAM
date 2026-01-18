import type { VersionedEnvelopeBase } from "./schema.js";
import { SCHEMA_VERSION } from "./schema.js";
import type { CancellationReason } from "./runtime.js";
import type { LongRunningTaskEntityV1 } from "./agents.js";

export type AppId = string & { readonly __brand: "AppId" };
export type SessionId = string & { readonly __brand: "SessionId" };
export type AttachmentId = string & { readonly __brand: "AttachmentId" };
export type ToolRunId = string & { readonly __brand: "ToolRunId" };
export type HookRunId = string & { readonly __brand: "HookRunId" };
export type McpConnectionId = string & { readonly __brand: "McpConnectionId" };

export function asAppId(value: string): AppId {
  return value as AppId;
}
export function asSessionId(value: string): SessionId {
  return value as SessionId;
}
export function asAttachmentId(value: string): AttachmentId {
  return value as AttachmentId;
}
export function asToolRunId(value: string): ToolRunId {
  return value as ToolRunId;
}
export function asHookRunId(value: string): HookRunId {
  return value as HookRunId;
}
export function asMcpConnectionId(value: string): McpConnectionId {
  return value as McpConnectionId;
}

export type SessionLifecycleState = "created" | "active" | "paused" | "ended" | "error";
export type SessionMode = "live" | "replay";

export type Sensitive<T> = { kind: "sensitive"; value: T };
export type Redacted = { kind: "redacted" };
export function sensitive<T>(value: T): Sensitive<T> {
  return { kind: "sensitive", value };
}
export const REDACTED: Redacted = { kind: "redacted" };

export type AttachmentRefV1 = {
  id: AttachmentId;
  createdAtMonoMs: number;
  kind: "text" | "json" | "binary";
  mediaType?: string;
  byteLength?: number;
  sha256Hex?: string;
  storageKey?: string;
  inlineText?: string;
  inlineJson?: unknown;
};

export type TranscriptEventBaseV1 = {
  id: string;
  tsMonoMs: number;
  tsWallMs?: number;
  sensitivity?: "public" | "internal" | "pii" | "secret";
};

export type TranscriptMessageEventV1 = TranscriptEventBaseV1 & {
  type: "message";
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: "text"; text: string } | { type: "attachment"; ref: AttachmentId }>;
};

export type TranscriptToolEventV1 = TranscriptEventBaseV1 & {
  type: "tool";
  toolRunId: ToolRunId;
  stage: "start" | "stream" | "result" | "error" | "cancelled";
  toolName: string;
  input?: unknown;
  output?: unknown;
  error?: string;
};

export type TranscriptHookEventV1 = TranscriptEventBaseV1 & {
  type: "hook";
  hookRunId: HookRunId;
  stage: "start" | "stream" | "result" | "error" | "cancelled";
  eventName: string;
  selectedHooks?: string[];
  message?: string;
  result?: unknown;
  error?: string;
};

export type TranscriptMcpEventV1 = TranscriptEventBaseV1 & {
  type: "mcp";
  connectionId: McpConnectionId;
  stage: "connected" | "disconnected" | "tools-snapshot" | "resources-snapshot" | "error";
  serverName?: string;
  payload?: unknown;
  error?: string;
};

export type TranscriptInterruptEventV1 = TranscriptEventBaseV1 & {
  type: "interrupt";
  reason: CancellationReason;
  message?: string;
};

export type TranscriptEventV1 =
  | TranscriptMessageEventV1
  | TranscriptToolEventV1
  | TranscriptHookEventV1
  | TranscriptMcpEventV1
  | TranscriptInterruptEventV1;

export type TranscriptLogV1 = {
  schemaVersion: 1;
  events: TranscriptEventV1[];
  bounded?: { truncatedBeforeEventId?: string; truncatedAtMonoMs?: number; reason?: string };
};

export type ToolRunEntityV1 = {
  id: ToolRunId;
  toolName: string;
  createdAtMonoMs: number;
  startedAtMonoMs?: number;
  endedAtMonoMs?: number;
  status: "created" | "running" | "completed" | "error" | "cancelled";
  permission?: { decision: "allow" | "deny" | "ask"; persistedKey?: string; decidedAtMonoMs?: number };
  input?: unknown;
  output?: unknown;
  error?: string;
  cancelled?: CancellationReason;
};

export type HookRunEntityV1 = {
  id: HookRunId;
  eventName: string;
  createdAtMonoMs: number;
  startedAtMonoMs?: number;
  endedAtMonoMs?: number;
  status: "created" | "running" | "completed" | "error" | "cancelled";
  selectedHooks?: string[];
  outcomes?: Array<{ hookId: string; status: "completed" | "error" | "cancelled"; error?: string }>;
  error?: string;
  cancelled?: CancellationReason;
};

export type McpConnectionEntityV1 = {
  id: McpConnectionId;
  serverName: string;
  mode: "direct" | "endpoint";
  status: "disconnected" | "connecting" | "connected" | "error";
  connectedAtMonoMs?: number;
  disconnectedAtMonoMs?: number;
  toolsSnapshot?: unknown;
  resourcesSnapshot?: unknown;
  error?: string;
};

export type PersistedSessionStateV1 = {
  schemaVersion: 1;
  id: SessionId;
  lifecycle: SessionLifecycleState;
  mode?: SessionMode;
  createdAtMonoMs: number;
  updatedAtMonoMs: number;
  endedAtMonoMs?: number;
  error?: string;
  transcript: TranscriptLogV1;
  attachments: Record<string, AttachmentRefV1>;
  toolRuns: Record<string, ToolRunEntityV1>;
  hookRuns: Record<string, HookRunEntityV1>;
  mcpConnections: Record<string, McpConnectionEntityV1>;
};

export type PersistedAppStateV1 = {
  schemaVersion: 1;
  appId: AppId;
  createdAtMonoMs: number;
  updatedAtMonoMs: number;
  activeSessionId?: SessionId;
  sessions: Record<string, PersistedSessionStateV1>;
  tasks?: Record<string, LongRunningTaskEntityV1>;
};

export type StateSnapshotV1 = VersionedEnvelopeBase & {
  kind: "state_snapshot";
  schemaVersion: typeof SCHEMA_VERSION.stateSnapshot;
  state: PersistedAppStateV1;
};

export type ExportedSessionPayloadV1 = {
  schemaVersion: 1;
  id: SessionId;
  exportedAtWallMs: number;
  lifecycle: SessionLifecycleState;
  mode: "replay";
  createdAtMonoMs: number;
  endedAtMonoMs?: number;
  transcript: TranscriptLogV1;
  attachments: Record<string, AttachmentRefV1>;
};

export type SessionExportV1 = VersionedEnvelopeBase & {
  kind: "session_export";
  schemaVersion: typeof SCHEMA_VERSION.sessionExport;
  session: ExportedSessionPayloadV1;
};
