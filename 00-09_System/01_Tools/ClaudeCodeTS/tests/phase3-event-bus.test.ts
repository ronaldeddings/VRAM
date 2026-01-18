import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { EventBus, recordEventBus } from "../src/core/events/index.js";
import { SCHEMA_VERSION } from "../src/core/types/schema.js";

describe("Phase 3: event bus semantics", () => {
  test("emits monotonic seq per channel and supports cursors", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const bus = new EventBus({ idSource, clock, sessionId: "s1" });

    const sub = bus.subscribe({ channel: "ui", replayBuffered: true, cursor: { channel: "ui", seq: 0 } });
    const next = (async () => {
      const out: number[] = [];
      for await (const evt of sub) {
        out.push(evt.seq);
        if (out.length >= 2) break;
      }
      sub.unsubscribe();
      return out;
    })();

    await bus.emit({ type: "engine/ready" }, { channel: "ui", severity: "info" });
    await bus.emit({ type: "engine/stopped", reason: "x" }, { channel: "ui", severity: "info" });
    expect(await next).toEqual([1, 2]);

    const cursor = bus.getCursor("ui");
    expect(cursor.seq).toBe(2);

    await bus.emit({ type: "diag/log", level: "info", message: "hello" }, { channel: "diagnostic", severity: "info" });
    expect(bus.getCursor("diagnostic").seq).toBe(1);
  });

  test("recording helper captures envelopes and can be stopped", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const bus = new EventBus({ idSource, clock });

    const rec = recordEventBus(bus, { channel: "ui" });
    await bus.emit({ type: "engine/ready" }, { channel: "ui", severity: "info" });
    await bus.emit({ type: "engine/stopped", reason: "done" }, { channel: "ui", severity: "info" });
    await Promise.resolve();
    rec.stop();

    expect(rec.events.map((e) => e.payload.type)).toEqual(["engine/ready", "engine/stopped"]);
  });

  test("includeSnapshot yields a snapshot envelope before live events", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });

    const snapshotEnvelope = {
      kind: "engine_event_envelope",
      schemaVersion: SCHEMA_VERSION.engineEventEnvelope,
      eventId: idSource.nextId("evt"),
      channel: "ui",
      severity: "info",
      seq: 0,
      tsMonoMs: clock.nowMs(),
      sensitivity: "internal",
      payload: { type: "engine/ready" }
    } as const;

    const bus = new EventBus({
      idSource,
      clock,
      channelSnapshots: {
        ui: () => snapshotEnvelope
      }
    });

    const sub = bus.subscribe({ channel: "ui", includeSnapshot: true });
    const iter = sub[Symbol.asyncIterator]();

    const first = await iter.next();
    expect(first.done).toBe(false);
    expect(first.value.seq).toBe(0);

    await bus.emit({ type: "engine/stopped", reason: "x" }, { channel: "ui", severity: "info" });
    const second = await iter.next();
    expect(second.done).toBe(false);
    expect(second.value.seq).toBe(1);
    sub.unsubscribe();
  });

  test("coalescing policy can replace queued events deterministically", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });
    const bus = new EventBus({
      idSource,
      clock,
      channelPolicies: {
        diagnostic: {
          coalesce: { key: (e) => e.payload.type, minIntervalMs: 1000 }
        }
      }
    });

    const sub = bus.subscribe({ channel: "diagnostic" });
    const iter = sub[Symbol.asyncIterator]();

    await bus.emit({ type: "diag/log", level: "info", message: "first" }, { channel: "diagnostic", severity: "info" });
    await bus.emit({ type: "diag/log", level: "info", message: "second" }, { channel: "diagnostic", severity: "info" });

    const first = await iter.next();
    expect(first.done).toBe(false);
    if (!first.done) {
      expect(first.value.payload.type).toBe("diag/log");
      if (first.value.payload.type === "diag/log") expect(first.value.payload.message).toBe("second");
    }

    sub.unsubscribe();
    const done = await iter.next();
    expect(done.done).toBe(true);
  });
});
