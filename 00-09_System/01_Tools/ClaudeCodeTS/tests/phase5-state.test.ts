import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { createStateStore } from "../src/core/state/store.js";
import { selectOverlay } from "../src/core/state/selectors.js";
import { renderTranscriptLogSemantic } from "../src/core/state/render.js";

describe("Phase 5: app/session state model", () => {
  test("create session command sets active session when requested", async () => {
    const clock = new TestClock(123);
    const idSource = createMonotonicIdSource();
    const store = createStateStore({ idSource, clock });

    await store.dispatchCommand({ type: "cmd/create-session", activate: true });
    const state = store.getState();
    expect(state.persisted.activeSessionId).toBeTruthy();
    const sessionId = state.persisted.activeSessionId!;
    expect(state.persisted.sessions[sessionId]?.lifecycle).toBe("active");
  });

  test("overlay selection reflects queue state deterministically", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const store = createStateStore({ idSource, clock });

    expect(selectOverlay(store.getState().ui)).toBeNull();

    await store.dispatch({ type: "ui/message-selector/set-open", open: true });
    expect(selectOverlay(store.getState().ui)).toBe("message-selector");

    await store.dispatch({ type: "ui/message-selector/set-open", open: false });
    await store.dispatch({
      type: "ui/sandbox-permission/enqueue",
      request: { requestId: "r1", hostPattern: { host: "example.com" }, createdAtMonoMs: 0, origin: "local" }
    });
    expect(selectOverlay(store.getState().ui)).toBe("sandbox-permission");

    await store.dispatch({ type: "ui/tool-permission/set-active", active: { requestId: "t1", toolName: "Read", createdAtMonoMs: 0 } });
    expect(selectOverlay(store.getState().ui)).toBe("sandbox-permission");

    await store.dispatch({ type: "ui/sandbox-permission/dequeue", requestId: "r1" });
    expect(selectOverlay(store.getState().ui)).toBe("tool-permission");
  });

  test("transcript semantic renderer produces stable summaries", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const store = createStateStore({ idSource, clock });

    await store.dispatchCommand({ type: "cmd/create-session", activate: true, nowMonoMs: 1 });
    const sessionId = store.getState().persisted.activeSessionId!;

    await store.dispatch({
      type: "session/transcript/append-event",
      sessionId,
      tsMonoMs: 2,
      event: { id: "e1", tsMonoMs: 2, type: "message", role: "user", content: "hi" }
    });

    const log = store.getState().persisted.sessions[sessionId]!.transcript;
    const rendered = renderTranscriptLogSemantic(log);
    expect(rendered.map((r) => r.summary)).toEqual(["user: hi"]);
  });

  test("snapshotPersisted + restoreFromSnapshot roundtrip preserves sessions and transcript", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const store = createStateStore({ idSource, clock });

    await store.dispatchCommand({ type: "cmd/create-session", activate: true, nowMonoMs: 1, sessionId: "s1" as any });
    const sessionId = store.getState().persisted.activeSessionId!;

    await store.dispatch({
      type: "session/transcript/append-event",
      sessionId,
      tsMonoMs: 2,
      event: { id: "e1", tsMonoMs: 2, type: "message", role: "user", content: "hi" }
    });

    const snapshot = store.snapshotPersisted();

    const store2 = createStateStore({ idSource: createMonotonicIdSource(), clock: new TestClock(0) });
    await store2.restoreFromSnapshot(snapshot);

    const state2 = store2.getState();
    expect(state2.persisted.activeSessionId).toBe("s1");
    const transcript2 = renderTranscriptLogSemantic(state2.persisted.sessions["s1"]!.transcript);
    expect(transcript2.map((t) => t.summary)).toEqual(["user: hi"]);
  });
});
