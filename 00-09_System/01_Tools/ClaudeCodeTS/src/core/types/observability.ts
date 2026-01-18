import type { JsonObject, JsonValue } from "./json.js";
import type { VersionedEnvelopeBase } from "./schema.js";
import { SCHEMA_VERSION } from "./schema.js";

export type LogPrivacyTier = "public" | "internal" | "sensitive";
export type LogSeverity = "debug" | "info" | "warn" | "error";

export type LogCorrelationIds = {
  promptId?: string;
  taskId?: string;
  toolRunId?: string;
  hookRunId?: string;
  mcpRequestId?: string;
  agentId?: string;
};

export type StructuredLogRecordV1 = VersionedEnvelopeBase & {
  kind: "structured_log_record";
  schemaVersion: typeof SCHEMA_VERSION.structuredLogRecord;
  tsWallMs: number;
  subsystem: string;
  severity: LogSeverity;
  message: string;
  correlationIds?: LogCorrelationIds;
  privacy: LogPrivacyTier;
  redacted?: boolean;
  fields?: JsonObject;
  sampling?: { sampled: boolean; rule?: string };
};

export type TelemetryPrivacyTier = "public" | "internal";

export type TelemetryFieldValue = string | number | boolean | null;
export type TelemetryFields = Record<string, TelemetryFieldValue | TelemetryFieldValue[]>;

export type TelemetryEventV1 = VersionedEnvelopeBase & {
  kind: "telemetry_event";
  schemaVersion: typeof SCHEMA_VERSION.telemetryEvent;
  name: string;
  tsWallMs: number;
  privacy: TelemetryPrivacyTier;
  correlationId?: string;
  fields?: TelemetryFields;
};

export type TelemetryEventClass = "usage" | "health" | "crash" | "debug";

export type TelemetryEventEnvelopeV1 = TelemetryEventV1 & {
  class: TelemetryEventClass;
};

export type TelemetryDropStats = {
  dropped: number;
  droppedSinceLastFlush?: number;
  lastDropReason?: string;
};

export function isJsonPrimitive(value: unknown): value is JsonValue {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

