import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { availableCapability, unavailableCapability, type HostCapabilities } from "../src/core/types/host.js";
import { createEngine } from "../src/core/engine/createEngine.js";
import { selectOverlay } from "../src/core/state/selectors.js";
import { renderTranscriptLogSemantic } from "../src/core/state/render.js";
import type { EngineEventEnvelope } from "../src/core/types/events.js";

function createMinimalHost(clock: TestClock): HostCapabilities {
  return {
    clock: availableCapability({ nowMs: () => clock.nowMs(), nowWallMs: () => 0 }),
    random: unavailableCapability({ kind: "not-provided" }),
    crypto: unavailableCapability({ kind: "not-provided" }),
    secrets: unavailableCapability({ kind: "not-provided" }),
    storage: unavailableCapability({ kind: "not-provided" }),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: unavailableCapability({ kind: "not-provided" }),
    lifecycle: unavailableCapability({ kind: "not-provided" }),
    telemetry: unavailableCapability({ kind: "not-provided" }),
    background: unavailableCapability({ kind: "not-provided" }),
    fileTransfer: unavailableCapability({ kind: "not-provided" }),
    shell: unavailableCapability({ kind: "not-provided" }),
    localEndpoint: unavailableCapability({ kind: "not-provided" }),
    ipc: unavailableCapability({ kind: "not-provided" }),
    process: unavailableCapability({ kind: "not-provided" }),
    clipboard: unavailableCapability({ kind: "not-provided" }),
    notifications: unavailableCapability({ kind: "not-provided" }),
    haptics: unavailableCapability({ kind: "not-provided" })
  };
}

async function flushMicrotasks(times = 10): Promise<void> {
  for (let i = 0; i < times; i++) await Promise.resolve();
}

describe("Phases 1–5: end-to-end baseline", () => {
  test("engine boots, emits app state, accepts user input, and preserves deterministic event ordering", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });
    const host = createMinimalHost(clock);
    const engine = createEngine({ host, clock, idSource });

    const events: EngineEventEnvelope[] = [];
    const unsub = engine.subscribe((evt) => events.push(evt));

    await engine.start();
    await flushMicrotasks();

    expect(events.some((e) => e.payload.type === "engine/ready")).toBe(true);
    const lastState1 = [...events].reverse().find((e) => e.payload.type === "state/app-state");
    expect(lastState1?.payload.type).toBe("state/app-state");

    if (lastState1?.payload.type !== "state/app-state") throw new Error("missing app-state event");
    const state1 = lastState1.payload.state;
    expect(state1.persisted.activeSessionId).toBeTruthy();
    expect(selectOverlay(state1.ui)).toBeNull();

    await engine.dispatch({ type: "engine/dispatchHostEvent", event: { type: "host/user-input", text: "hi" } });
    await flushMicrotasks();

    const lastState2 = [...events].reverse().find((e) => e.payload.type === "state/app-state");
    if (lastState2?.payload.type !== "state/app-state") throw new Error("missing app-state after input");
    const state2 = lastState2.payload.state;
    const sessionId = state2.persisted.activeSessionId!;
    const transcript = renderTranscriptLogSemantic(state2.persisted.sessions[sessionId]!.transcript);
    expect(transcript.map((t) => t.summary)).toContain("user: hi");

    const uiSeqs = events.filter((e) => e.channel === "ui").map((e) => e.seq);
    expect(uiSeqs).toEqual([...uiSeqs].sort((a, b) => a - b));

    await engine.stop("done");
    await flushMicrotasks();
    expect(events.some((e) => e.payload.type === "engine/stopped")).toBe(true);
    unsub();
  });
});
