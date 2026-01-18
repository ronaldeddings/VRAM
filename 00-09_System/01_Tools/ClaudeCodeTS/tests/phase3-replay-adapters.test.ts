import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { classifyReplayEventDiff } from "../src/core/runtime/replayDiff.js";
import { EventBus, recordEventBus } from "../src/core/events/index.js";
import { asyncIterableToReadableStream, readableStreamToAsyncIterable } from "../src/core/events/streamAdapters.js";
import { asyncIterableToNodeReadable, nodeReadableToAsyncIterable } from "../src/platform/node/streamAdapters.js";
import { pumpAsyncIterableToEmitter } from "../src/platform/rn/streamAdapters.js";
import { canonicalJsonStringify } from "../src/core/types/canonicalJson.js";
import type { EngineEventEnvelope } from "../src/core/types/events.js";

async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = [];
  for await (const item of iterable) out.push(item);
  return out;
}

async function* asAsyncIterable<T>(items: readonly T[]): AsyncGenerator<T> {
  for (const item of items) yield item;
}

describe("Phase 3: replay/adapter conformance", () => {
  test("event streams roundtrip through web/node/RN adapter shapes", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });
    const bus = new EventBus({ idSource, clock, sessionId: "s1", workspaceId: "w1" });
    const rec = recordEventBus(bus);

    await bus.emit({ type: "engine/ready" }, { channel: "ui", severity: "info" });
    await bus.emit({ type: "diag/log", level: "info", message: "hello" }, { channel: "diagnostic", severity: "info" });
    await Promise.resolve();
    rec.stop();

    const original = rec.events;

    const webStream = asyncIterableToReadableStream(asAsyncIterable(original));
    const webRoundtrip = await collect(readableStreamToAsyncIterable(webStream));
    expect(canonicalJsonStringify(webRoundtrip)).toBe(canonicalJsonStringify(original));
    expect(classifyReplayEventDiff(original, webRoundtrip).classification).toBe("exact");

    const nodeReadable = asyncIterableToNodeReadable(asAsyncIterable(original));
    const nodeRoundtrip = await collect(nodeReadableToAsyncIterable(nodeReadable));
    expect(canonicalJsonStringify(nodeRoundtrip)).toBe(canonicalJsonStringify(original));
    expect(classifyReplayEventDiff(original, nodeRoundtrip as EngineEventEnvelope[]).classification).toBe("exact");

    const emitted: unknown[] = [];
    await pumpAsyncIterableToEmitter(asAsyncIterable(original), { emit: (_name, payload) => emitted.push(payload) });
    expect(canonicalJsonStringify(emitted)).toBe(canonicalJsonStringify(original));
  });

  test("diff classifier treats UI-only differences as benign_ui", () => {
    const base: EngineEventEnvelope[] = [
      {
        kind: "engine_event_envelope",
        schemaVersion: 1,
        eventId: "evt_1",
        channel: "ui",
        severity: "info",
        seq: 1,
        tsMonoMs: 1,
        sensitivity: "internal",
        payload: { type: "engine/ready" }
      }
    ];

    const changed: EngineEventEnvelope[] = [
      {
        ...base[0]!,
        payload: { type: "ui/notification", message: "different chrome" }
      }
    ];

    expect(classifyReplayEventDiff(base, changed).classification).toBe("benign_ui");
  });
});

