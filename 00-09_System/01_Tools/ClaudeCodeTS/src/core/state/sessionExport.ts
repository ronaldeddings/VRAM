import type {
  AttachmentRefV1,
  ExportedSessionPayloadV1,
  PersistedSessionStateV1,
  SessionExportV1
} from "../types/state.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import { redactTranscriptLog } from "./transcript.js";

function redactAttachmentForExport(attachment: AttachmentRefV1): AttachmentRefV1 {
  const { inlineJson, inlineText, storageKey, ...rest } = attachment;
  return rest;
}

export function createSessionExport(session: PersistedSessionStateV1, exportedAtWallMs: number): SessionExportV1 {
  const { log: transcript } = redactTranscriptLog(session.transcript);
  const attachments: Record<string, AttachmentRefV1> = {};
  for (const [key, ref] of Object.entries(session.attachments)) attachments[key] = redactAttachmentForExport(ref);

  const payload: ExportedSessionPayloadV1 = {
    schemaVersion: 1,
    id: session.id,
    exportedAtWallMs,
    lifecycle: session.lifecycle,
    mode: "replay",
    createdAtMonoMs: session.createdAtMonoMs,
    ...(session.endedAtMonoMs !== undefined ? { endedAtMonoMs: session.endedAtMonoMs } : {}),
    transcript,
    attachments
  };

  return { kind: "session_export", schemaVersion: SCHEMA_VERSION.sessionExport, session: payload };
}

export function importSessionExport(exported: SessionExportV1, nowMonoMs: number): PersistedSessionStateV1 {
  if (exported.kind !== "session_export") throw new Error(`Not a session export: ${String((exported as { kind?: unknown }).kind)}`);
  if (exported.schemaVersion !== SCHEMA_VERSION.sessionExport) {
    throw new Error(`Unsupported session export version: ${exported.schemaVersion}`);
  }

  const imported = exported.session;
  if (imported.schemaVersion !== 1) throw new Error(`Unsupported exported session payload version: ${imported.schemaVersion}`);

  return {
    schemaVersion: 1,
    id: imported.id,
    lifecycle: "ended",
    mode: "replay",
    createdAtMonoMs: imported.createdAtMonoMs,
    updatedAtMonoMs: nowMonoMs,
    endedAtMonoMs: imported.endedAtMonoMs ?? nowMonoMs,
    transcript: imported.transcript,
    attachments: imported.attachments,
    toolRuns: {},
    hookRuns: {},
    mcpConnections: {}
  };
}
