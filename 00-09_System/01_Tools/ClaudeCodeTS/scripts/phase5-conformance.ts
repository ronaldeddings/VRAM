import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { LEGACY_OVERLAY_PRECEDENCE } from "../src/spec/legacy/appstate.js";
import { OVERLAY_PRECEDENCE, selectActiveOverlay } from "../src/core/state/overlays.js";
import { createSessionExport, importSessionExport } from "../src/core/state/sessionExport.js";
import { renderTranscriptLogSemantic } from "../src/core/state/render.js";
import { createAppState, reduceAppState, recoverPersistedAppState } from "../src/core/state/state.js";
import { REDACTED, asAttachmentId, asHookRunId, asMcpConnectionId, asToolRunId, sensitive, type TranscriptEventV1 } from "../src/core/types/state.js";

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main(): Promise<void> {
  assert(deepEqual(OVERLAY_PRECEDENCE, LEGACY_OVERLAY_PRECEDENCE), "Overlay precedence drifted from legacy");
  assert(
    selectActiveOverlay({ messageSelectorOpen: true, sandboxPermissionQueueLength: 1 }) === "message-selector",
    "Overlay selection precedence is incorrect"
  );

  const idSource = createMonotonicIdSource();
  const clock = new TestClock(1000);
  let state = createAppState({ idSource, clock });

  state = reduceAppState(state, { type: "app/session-created", session: {
    schemaVersion: 1,
    id: "sess_1" as any,
    lifecycle: "created",
    mode: "live",
    createdAtMonoMs: 1000,
    updatedAtMonoMs: 1000,
    transcript: { schemaVersion: 1, events: [] },
    attachments: {},
    toolRuns: {},
    hookRuns: {},
    mcpConnections: {}
  } }).state;

  state = reduceAppState(state, { type: "app/session-created", session: {
    schemaVersion: 1,
    id: "sess_2" as any,
    lifecycle: "created",
    mode: "live",
    createdAtMonoMs: 1000,
    updatedAtMonoMs: 1000,
    transcript: { schemaVersion: 1, events: [] },
    attachments: {},
    toolRuns: {},
    hookRuns: {},
    mcpConnections: {}
  } }).state;

  state = reduceAppState(state, { type: "app/session-lifecycle-set", sessionId: "sess_1" as any, lifecycle: "active", tsMonoMs: 1100 }).state;
  state = reduceAppState(state, { type: "app/session-lifecycle-set", sessionId: "sess_2" as any, lifecycle: "active", tsMonoMs: 1200 }).state;
  assert(state.persisted.sessions["sess_1" as any]?.lifecycle === "paused", "Activating a session should pause other active sessions");

  const toolEvent: TranscriptEventV1 = {
    id: "evt_1",
    tsMonoMs: 1300,
    type: "tool",
    toolRunId: asToolRunId("toolrun_1"),
    stage: "start",
    toolName: "Bash",
    input: { accessToken: sensitive("secret-token") }
  };

  state = reduceAppState(state, { type: "session/transcript/append-event", sessionId: "sess_2" as any, event: toolEvent, tsMonoMs: 1300 }).state;
  state = reduceAppState(state, { type: "session/attachment/upsert", sessionId: "sess_2" as any, attachment: {
    id: asAttachmentId("att_1"),
    createdAtMonoMs: 1300,
    kind: "text",
    inlineText: "should-not-export",
    mediaType: "text/plain"
  }, tsMonoMs: 1300 }).state;

  state = reduceAppState(state, { type: "session/tool-run/upsert", sessionId: "sess_2" as any, toolRun: {
    id: asToolRunId("toolrun_1"),
    toolName: "Bash",
    createdAtMonoMs: 1300,
    status: "running"
  }, tsMonoMs: 1300 }).state;

  state = reduceAppState(state, { type: "session/hook-run/upsert", sessionId: "sess_2" as any, hookRun: {
    id: asHookRunId("hookrun_1"),
    eventName: "PreToolUse",
    createdAtMonoMs: 1300,
    status: "running"
  }, tsMonoMs: 1300 }).state;

  state = reduceAppState(state, { type: "session/mcp-connection/upsert", sessionId: "sess_2" as any, connection: {
    id: asMcpConnectionId("mcp_1"),
    serverName: "ide",
    mode: "direct",
    status: "connected",
    connectedAtMonoMs: 1200
  }, tsMonoMs: 1300 }).state;

  const exported = createSessionExport(state.persisted.sessions["sess_2" as any], Date.now());
  const exportedEvent = exported.session.transcript.events[0] as any;
  assert(exportedEvent.input.accessToken.kind === REDACTED.kind, "Export must redact Sensitive fields in transcript");
  const exportedAttachment = exported.session.attachments["att_1"];
  assert(exportedAttachment && !("inlineText" in exportedAttachment), "Export must not inline attachment payloads");

  const imported = importSessionExport(exported, 2000);
  assert(imported.mode === "replay", "Imported sessions should be replay mode");
  assert(imported.lifecycle === "ended", "Imported sessions should be ended/read-only by default");

  const rendered = renderTranscriptLogSemantic(imported.transcript);
  assert(rendered.length === 1 && rendered[0].summary.includes("tool:Bash"), "Transcript renderer should produce semantic tool lines");

  const recovered = recoverPersistedAppState(state.persisted, 3000);
  assert(
    recovered.persisted.sessions["sess_2" as any].toolRuns["toolrun_1"].status === "cancelled",
    "Crash recovery should cancel in-flight tool runs"
  );
  assert(
    recovered.persisted.sessions["sess_2" as any].hookRuns["hookrun_1"].status === "cancelled",
    "Crash recovery should cancel in-flight hook runs"
  );
}

await main();

