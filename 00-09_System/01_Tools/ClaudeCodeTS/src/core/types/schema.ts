export type SchemaVersion = number;

export type SchemaKind =
  | "engine_event_envelope"
  | "settings_document"
  | "state_snapshot"
  | "session_export"
  | "hook_definition"
  | "hook_result"
  | "tool_invocation"
  | "tool_result"
  | "mcp_envelope"
  | "structured_log_record"
  | "telemetry_event"
  | "doctor_report"
  | "diagnostic_bundle";

export type VersionedEnvelopeBase = {
  kind: SchemaKind;
  schemaVersion: SchemaVersion;
};

export const SCHEMA_VERSION = {
  engineEventEnvelope: 1,
  settingsDocument: 1,
  stateSnapshot: 1,
  sessionExport: 1,
  hookDefinition: 1,
  hookResult: 1,
  toolInvocation: 1,
  toolResult: 1,
  mcpEnvelope: 1,
  structuredLogRecord: 1,
  telemetryEvent: 1,
  doctorReport: 1,
  diagnosticBundle: 1
} as const satisfies Record<string, SchemaVersion>;
