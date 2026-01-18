import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import { EventBus, recordEventBus } from "../src/core/events/index.js";
import { canonicalJsonStringify } from "../src/core/types/canonicalJson.js";

type ScenarioResult = {
  eventsJson: string;
  snapshotJson: string;
};

async function runDeterministicScenario(): Promise<ScenarioResult> {
  const clock = new TestClock(0);
  const idSource = createMonotonicIdSource({ startAt: 0 });

  const bus = new EventBus({ idSource, clock, sessionId: "s1", workspaceId: "w1" });
  const rec = recordEventBus(bus);

  const kernel = new RuntimeKernel({ clock, idSource });
  const scope = kernel.createScope({ kind: "session", label: "scenario" });

  const handle = scope.spawn(async (ctx) => {
    await bus.emit({ type: "diag/log", level: "info", message: "task start", fields: { taskId: ctx.taskId } }, { channel: "diagnostic", severity: "info" });
    await ctx.yield();
    await bus.emit({ type: "diag/log", level: "info", message: "task end", fields: { taskId: ctx.taskId } }, { channel: "diagnostic", severity: "info" });
    return "ok";
  });

  await bus.emit({ type: "engine/ready" }, { channel: "ui", severity: "info" });
  await kernel.getScheduler().runUntilIdle();
  await handle.done;
  await scope.close({ kind: "stop_request", message: "done" });
  await kernel.getScheduler().runUntilIdle();

  await Promise.resolve();
  rec.stop();

  return {
    eventsJson: canonicalJsonStringify(rec.events),
    snapshotJson: canonicalJsonStringify(kernel.snapshot())
  };
}

describe("Phase 3: replay-style conformance (kernel/event bus baseline)", () => {
  test("deterministic scenario produces identical normalized outputs across runs", async () => {
    const a = await runDeterministicScenario();
    const b = await runDeterministicScenario();
    expect(a).toEqual(b);
  });
});

