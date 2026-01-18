import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { createStateStore } from "../src/core/state/store.js";
import { canonicalJsonStringify } from "../src/core/types/canonicalJson.js";
import { selectCliViewModel } from "../src/ui/cli/index.js";
import { selectWebViewModel } from "../src/ui/web/index.js";
import { selectReactNativeViewModel } from "../src/ui/rn/index.js";

describe("Phase 5: queues, lifecycle, and UI adapter view models", () => {
  test("tool permission queue resolves deterministically and can request persistence", async () => {
    const clock = new TestClock(0);
    const store = createStateStore({ idSource: createMonotonicIdSource(), clock });

    const effects = store.subscribeEffects();
    const iter = effects[Symbol.asyncIterator]();

    await store.dispatch({
      type: "ui/tool-permission/enqueue",
      request: { requestId: "tp1", toolName: "Read", createdAtMonoMs: 0, rememberChoiceAllowed: true, rememberChoiceKey: "tool:Read" }
    });
    await store.dispatch({
      type: "ui/tool-permission/enqueue",
      request: { requestId: "tp2", toolName: "Write", createdAtMonoMs: 0 }
    });

    await store.dispatch({ type: "ui/tool-permission/resolve", requestId: "tp1", decision: "allow", remember: true });
    const eff = await iter.next();
    effects.unsubscribe();

    expect(eff.done).toBe(false);
    if (!eff.done && eff.value.type === "effect/tool-permission-decided") {
      expect(eff.value.decision).toBe("allow");
      expect(eff.value.remember).toBe(true);
      expect(eff.value.rememberChoiceKey).toBe("tool:Read");
    }

    expect(store.getState().ui.toolPermission.active?.requestId).toBe("tp2");
  });

  test("elicitation cancellation propagates via effects", async () => {
    const clock = new TestClock(0);
    const store = createStateStore({ idSource: createMonotonicIdSource(), clock });

    const effects = store.subscribeEffects();
    const iter = effects[Symbol.asyncIterator]();

    await store.dispatch({ type: "ui/elicitation/enqueue", request: { requestId: "e1", createdAtMonoMs: 0, prompt: "?", source: "mcp", concurrency: "serial" } });
    await store.dispatch({ type: "ui/elicitation/cancel", requestId: "e1", reason: { kind: "user_cancel", message: "no" } });

    const a = await iter.next();
    const b = await iter.next();
    effects.unsubscribe();

    const types = [a.value?.type, b.value?.type].sort();
    expect(types).toEqual(["effect/elicitation-cancelled", "effect/request-cancelled"]);
    expect(store.getState().ui.elicitation.queue.length).toBe(0);
  });

  test("backgrounding clears ephemeral UI queues and emits cancellation effects", async () => {
    const clock = new TestClock(0);
    const store = createStateStore({ idSource: createMonotonicIdSource(), clock });

    const effects = store.subscribeEffects();
    const received: string[] = [];
    const pump = (async () => {
      for await (const eff of effects) received.push(eff.type);
    })();

    await store.dispatch({
      type: "ui/sandbox-permission/enqueue",
      request: { requestId: "s1", hostPattern: { host: "example.com" }, createdAtMonoMs: 0, origin: "local" }
    });
    await store.dispatch({
      type: "ui/tool-permission/enqueue",
      request: { requestId: "tp1", toolName: "Read", createdAtMonoMs: 0 }
    });
    await store.dispatch({ type: "ui/worker-permissions/enqueue", request: { requestId: "w1", createdAtMonoMs: 0 } });
    await store.dispatch({ type: "ui/worker-sandbox-permissions/enqueue", request: { requestId: "ws1", createdAtMonoMs: 0 } });
    await store.dispatch({ type: "ui/elicitation/enqueue", request: { requestId: "e1", createdAtMonoMs: 0, prompt: "?", source: "mcp", concurrency: "serial" } });

    await store.dispatchCommand({ type: "cmd/host-event", event: { type: "host/backgrounded" } });

    effects.unsubscribe();
    await pump;

    expect(received.includes("effect/request-cancelled")).toBe(true);
    expect(store.getState().ui.sandboxPermissions.queue.length).toBe(0);
    expect(store.getState().ui.toolPermission.active).toBeNull();
    expect(store.getState().ui.workerPermissions.queue.length).toBe(0);
    expect(store.getState().ui.workerSandboxPermissions.queue.length).toBe(0);
    expect(store.getState().ui.elicitation.queue.length).toBe(0);
  });

  test("multi-session model enforces a single active session", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const store = createStateStore({ idSource, clock });

    await store.dispatchCommand({ type: "cmd/create-session", activate: true, nowMonoMs: 1, sessionId: "s1" as any });
    await store.dispatchCommand({ type: "cmd/create-session", activate: true, nowMonoMs: 2, sessionId: "s2" as any });

    const s1 = store.getState().persisted.sessions["s1"];
    const s2 = store.getState().persisted.sessions["s2"];
    expect(s2?.lifecycle).toBe("active");
    expect(s1?.lifecycle).toBe("paused");
  });

  test("UI view models share identical transcript semantics across adapters", async () => {
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
    await store.dispatch({
      type: "session/transcript/append-event",
      sessionId,
      tsMonoMs: 3,
      event: { id: "e2", tsMonoMs: 3, type: "tool", toolRunId: "tr1" as any, stage: "start", toolName: "Read" }
    });

    const state = store.getState();
    const cli = selectCliViewModel(state);
    const web = selectWebViewModel(state);
    const rn = selectReactNativeViewModel(state);

    expect(canonicalJsonStringify(cli.transcript)).toBe(canonicalJsonStringify(web.transcript));
    expect(canonicalJsonStringify(cli.transcript)).toBe(canonicalJsonStringify(rn.transcript));

    const stripPrefix = (line: string) => line.split(" ").slice(1).join(" ");
    expect(cli.lines.map(stripPrefix)).toEqual(web.lines.map(stripPrefix));
    expect(cli.lines.map(stripPrefix)).toEqual(rn.lines.map(stripPrefix));
  });
});
