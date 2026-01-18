import type { HostCapabilities } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import type { DiagnosticBundleV1 } from "../types/diagnostics.js";
import type { DoctorReportV1 } from "../types/diagnostics.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { StructuredLogRecordV1, TelemetryDropStats, TelemetryEventEnvelopeV1 } from "../types/observability.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

const SECRET_KEY_RE = /(accessToken|refreshToken|apiKey|authToken|authorization|password|secret|session)/i;

export function redactJsonForBundle(value: unknown): unknown {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((v) => redactJsonForBundle(v));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (SECRET_KEY_RE.test(k)) out[k] = "<redacted>";
      else out[k] = redactJsonForBundle(v);
    }
    return out;
  }
  return value;
}

function approxBytes(value: unknown): number {
  const json = canonicalJsonStringify(value, { pretty: false });
  return new TextEncoder().encode(json).byteLength;
}

function truncateArray<T>(items: T[], maxCount: number): { kept: T[]; dropped: number } {
  const n = Math.max(0, maxCount);
  if (items.length <= n) return { kept: items, dropped: 0 };
  const dropped = items.length - n;
  return { kept: items.slice(items.length - n), dropped };
}

export type DiagnosticBundleInputs = {
  host: HostCapabilities;
  bundleId: string;
  engine: { name: string; version: string };
  doctor: DoctorReportV1;
  effectiveSettings: JsonObject;
  logs: { recent: StructuredLogRecordV1[]; dropped: number };
  telemetry: { recent: TelemetryEventEnvelopeV1[]; dropStats?: TelemetryDropStats; suppressedByDedupe?: Record<string, number> };
  transcript?: { eventCount: number; sha256Hex: string; redactedNodes: number };
  mcpErrors?: Array<{ message: string; tsWallMs: number }>;
  maxBytes?: number;
  maxLogRecords?: number;
  maxTelemetryEvents?: number;
};

export function buildDiagnosticBundle(inputs: DiagnosticBundleInputs): DiagnosticBundleV1 {
  const maxBytes = Math.max(16_384, inputs.maxBytes ?? 250_000);
  const truncations: DiagnosticBundleV1["meta"]["truncations"] = [];

  const logsTruncated = truncateArray(inputs.logs.recent, inputs.maxLogRecords ?? 200);
  if (logsTruncated.dropped > 0) truncations.push({ field: "logs.recent", reason: "max_count", droppedCount: logsTruncated.dropped });

  const telemetryTruncated = truncateArray(inputs.telemetry.recent, inputs.maxTelemetryEvents ?? 200);
  if (telemetryTruncated.dropped > 0) truncations.push({ field: "telemetry.recent", reason: "max_count", droppedCount: telemetryTruncated.dropped });

  const bundle: DiagnosticBundleV1 = {
    kind: "diagnostic_bundle",
    schemaVersion: SCHEMA_VERSION.diagnosticBundle,
    generatedAtWallMs: Date.now(),
    bundleId: inputs.bundleId,
    engine: inputs.engine,
    doctor: inputs.doctor,
    effectiveSettingsRedacted: (redactJsonForBundle(inputs.effectiveSettings) ?? {}) as JsonObject,
    logs: { recent: logsTruncated.kept, dropped: inputs.logs.dropped + logsTruncated.dropped },
    telemetry: {
      recent: telemetryTruncated.kept,
      ...(inputs.telemetry.dropStats ? { dropStats: inputs.telemetry.dropStats } : {}),
      ...(inputs.telemetry.suppressedByDedupe ? { suppressedByDedupe: inputs.telemetry.suppressedByDedupe } : {})
    },
    ...(inputs.transcript ? { transcript: inputs.transcript } : {}),
    mcp: { errors: inputs.mcpErrors ?? [] },
    meta: { maxBytes, approxBytes: 0, truncations, correlationId: inputs.bundleId }
  };

  let size = approxBytes(bundle);
  bundle.meta.approxBytes = size;

  if (size > maxBytes) {
    const original = size;
    const furtherLogs = truncateArray(bundle.logs.recent, 25);
    if (furtherLogs.dropped > 0) truncations.push({ field: "logs.recent", reason: "max_bytes", droppedCount: furtherLogs.dropped, originalBytes: original, maxBytes });
    bundle.logs.recent = furtherLogs.kept;
    size = approxBytes(bundle);
    bundle.meta.approxBytes = size;
  }

  return bundle;
}

export type BundleLintIssue = { code: string; message: string };

export function lintDiagnosticBundle(bundle: DiagnosticBundleV1): BundleLintIssue[] {
  const json = canonicalJsonStringify(bundle, { pretty: false });
  const issues: BundleLintIssue[] = [];

  const forbiddenValuePatterns: Array<{ code: string; re: RegExp; message: string }> = [
    { code: "secret_access_token", re: /\"accessToken\"\\s*:\\s*\"(?!<redacted>)/, message: "accessToken value must be redacted" },
    { code: "secret_refresh_token", re: /\"refreshToken\"\\s*:\\s*\"(?!<redacted>)/, message: "refreshToken value must be redacted" },
    { code: "secret_api_key", re: /\"apiKey\"\\s*:\\s*\"(?!<redacted>)/i, message: "apiKey value must be redacted" },
    { code: "secret_bearer", re: /Bearer\\s+[A-Za-z0-9\\-_.]{10,}/, message: "Bearer tokens must not appear in the bundle" }
  ];

  for (const p of forbiddenValuePatterns) {
    if (p.re.test(json)) issues.push({ code: p.code, message: p.message });
  }

  return issues;
}
