import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import { EventBus, recordEventBus } from "../src/core/events/index.js";

describe("Phase 3: scope shutdown summaries", () => {
  test("closing a session scope can emit a bounded shutdown summary event", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });

    const bus = new EventBus({ idSource, clock, sessionId: "s1" });
    const rec = recordEventBus(bus, { channel: "diagnostic" });

    const kernel = new RuntimeKernel({
      clock,
      idSource,
      onScopeClosed: async (summary) => {
        await bus.emit({ type: "runtime/shutdown-summary", summary }, { channel: "diagnostic", severity: "info" });
      }
    });
    const scheduler = kernel.getScheduler();

    const scope = kernel.createScope({ kind: "session", label: "shutdown" });
    scope.spawn(async (ctx) => {
      await ctx.sleep(1_000);
      return "unreachable";
    });

    await scheduler.tick();
    await scope.close({ kind: "stop_request", message: "closing" });
    await scheduler.runUntilIdle();

    await Promise.resolve();
    rec.stop();

    const shutdown = rec.events.find((e) => e.payload.type === "runtime/shutdown-summary");
    expect(shutdown).toBeTruthy();
    if (shutdown && shutdown.payload.type === "runtime/shutdown-summary") {
      expect(shutdown.payload.summary.scopeKind).toBe("session");
      expect(shutdown.payload.summary.cancelledTasks).toBeGreaterThanOrEqual(1);
      expect(shutdown.payload.summary.snapshot.timers.length).toBe(0);
    }
  });
});

