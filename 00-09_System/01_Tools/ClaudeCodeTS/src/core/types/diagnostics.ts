import type { VersionedEnvelopeBase } from "./schema.js";
import { SCHEMA_VERSION } from "./schema.js";
import type { JsonObject } from "./json.js";
import type { StructuredLogRecordV1, TelemetryDropStats, TelemetryEventEnvelopeV1 } from "./observability.js";
import type { SettingsDoctorReport } from "../settings/doctor.js";

export type CapabilityMatrixEntry = {
  key: string;
  status: "available" | "unavailable";
  reason?: { kind: string; message?: string; policyId?: string };
};

export type DoctorReportV1 = VersionedEnvelopeBase & {
  kind: "doctor_report";
  schemaVersion: typeof SCHEMA_VERSION.doctorReport;
  generatedAtWallMs: number;
  engine: { name: string; version: string };
  host: { platform?: string; connectionState?: "online" | "offline" | "unknown" };
  capabilities: CapabilityMatrixEntry[];
  settings: {
    doctor: SettingsDoctorReport;
    telemetryOptOut: boolean;
  };
  mcp: {
    endpointAllowed: boolean;
    endpointConfigPresent: boolean;
    mode: "endpoint" | "direct_or_state_file";
  };
};

export type BundleTruncation = { field: string; reason: string; droppedCount?: number; originalBytes?: number; maxBytes?: number };

export type DiagnosticBundleV1 = VersionedEnvelopeBase & {
  kind: "diagnostic_bundle";
  schemaVersion: typeof SCHEMA_VERSION.diagnosticBundle;
  generatedAtWallMs: number;
  bundleId: string;
  engine: { name: string; version: string };
  doctor: DoctorReportV1;
  effectiveSettingsRedacted: JsonObject;
  logs: { recent: StructuredLogRecordV1[]; dropped: number };
  telemetry: { recent: TelemetryEventEnvelopeV1[]; dropStats?: TelemetryDropStats; suppressedByDedupe?: Record<string, number> };
  transcript?: { eventCount: number; sha256Hex: string; redactedNodes: number };
  mcp: { errors: Array<{ message: string; tsWallMs: number }> };
  meta: { maxBytes: number; approxBytes: number; truncations: BundleTruncation[]; correlationId: string };
};
