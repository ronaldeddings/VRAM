import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { HangDetector } from "../src/core/runtime/hang.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import { DeterministicScheduler } from "../src/core/runtime/scheduler.js";

describe("Phase 3: deterministic runtime kernel", () => {
  test("task yields and resumes deterministically", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });

    const scope = kernel.createScope({ kind: "custom", label: "test" });
    const handle = scope.spawn(async (ctx) => {
      await ctx.yield();
      await ctx.yield();
      return { ok: true, taskId: ctx.taskId };
    });

    await kernel.getScheduler().runUntilIdle();
    const result = await handle.done;
    expect(result.kind).toBe("success");
    if (result.kind === "success") expect(result.value.ok).toBe(true);
  });

  test("timeouts abort tasks and resolve as timeout results", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });
    const scheduler = kernel.getScheduler();

    const scope = kernel.createScope({ kind: "custom", label: "timeouts" });
    const handle = scope.spawn(
      async (ctx) => {
        await ctx.sleep(1000);
        return "unreachable";
      },
      { timeoutMs: 10 }
    );

    clock.advanceBy(20);
    await scheduler.runUntilIdle();

    const result = await handle.done;
    expect(result.kind).toBe("timeout");
  });

  test("concurrency limiter blocks and unblocks deterministically", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });
    const scheduler = kernel.getScheduler();

    kernel.defineLimiter("net", 1);
    const release1 = await kernel.acquireLimiter("net", { ownerTaskId: "t1" });

    let acquired2 = false;
    const p2 = kernel.acquireLimiter("net", { ownerTaskId: "t2" }).then((release2) => {
      acquired2 = true;
      release2();
    });

    await scheduler.runUntilIdle();
    expect(acquired2).toBe(false);

    release1();
    await scheduler.runUntilIdle();
    await p2;
    expect(acquired2).toBe(true);
  });

  test("streams emit sequenced events and snapshot tracks them", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });

    const stream = kernel.createStream("debug");
    await stream.pushDiagnostic({ message: "hello" });
    stream.close({ reason: "completed" });

    const snap = kernel.snapshot();
    expect(snap.streams.some((s) => s.id === stream.id)).toBe(true);
  });

  test("tool streams block producers under backpressure by default", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });

    const stream = kernel.createStream("tool", { maxBuffered: 1 });
    await stream.pushChunk({ encoding: "utf-8", data: "a" });

    let resolved = false;
    const blocked = stream.pushChunk({ encoding: "utf-8", data: "b" }).then(() => {
      resolved = true;
    });

    await Promise.resolve();
    expect(resolved).toBe(false);

    const iter = stream[Symbol.asyncIterator]();
    const first = await iter.next();
    expect(first.done).toBe(false);
    await blocked;
    expect(resolved).toBe(true);

    const second = await iter.next();
    expect(second.done).toBe(false);

    stream.close({ reason: "completed" });
    while (!(await iter.next()).done) {
      // drain
    }
  });

  test("closing a scope cancels in-flight tasks without leaking timers", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });
    const scheduler = kernel.getScheduler();

    const scope = kernel.createScope({ kind: "custom", label: "cancel" });
    const handle = scope.spawn(async (ctx) => {
      await ctx.sleep(1_000);
      return "unreachable";
    });

    await scope.close({ kind: "stop_request", message: "test close" });
    await scheduler.runUntilIdle();

    const result = await handle.done;
    expect(result.kind === "cancelled" || result.kind === "timeout").toBe(true);

    const snap = kernel.snapshot();
    expect(snap.timers.length).toBe(0);
  });

  test("parent task cancellation fans out to explicitly-parented child tasks", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });
    const scheduler = kernel.getScheduler();

    const scope = kernel.createScope({ kind: "session", label: "parented" });
    let childResult: unknown = null;

    const parent = scope.spawn(async (ctx) => {
      const child = scope.spawn(
        async (childCtx) => {
          await childCtx.sleep(1_000);
          return "unreachable";
        },
        { parentTaskId: ctx.taskId }
      );
      childResult = await child.done;
      return "parent";
    });

    await scheduler.tick();
    parent.cancel({ kind: "user_cancel", message: "stop parent" });
    await scheduler.runUntilIdle();

    const parentRes = await parent.done;
    expect(parentRes.kind).toBe("cancelled");
    expect(typeof childResult).toBe("object");
    if (typeof childResult === "object" && childResult && "kind" in (childResult as any)) {
      expect((childResult as any).kind).toBe("cancelled");
    }
  });

  test("fail-fast task errors cancel the rest of the scope deterministically", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });
    const scheduler = kernel.getScheduler();

    const scope = kernel.createScope({ kind: "session", label: "failfast" });
    const slow = scope.spawn(async (ctx) => {
      await ctx.sleep(1_000);
      return "slow";
    });
    const fail = scope.spawn(
      async () => {
        throw new Error("boom");
      },
      { failurePolicy: "fail-fast" }
    );

    await scheduler.runUntilIdle();
    const failRes = await fail.done;
    expect(failRes.kind).toBe("error");

    const slowRes = await slow.done;
    expect(slowRes.kind).toBe("cancelled");
  });

  test("hang detector fires once per category until progress resumes", () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();
    const kernel = new RuntimeKernel({ clock, idSource });
    const detector = new HangDetector({ clock, thresholdsMs: { generic: 10 } });

    detector.recordProgress("generic");
    clock.advanceBy(11);
    const incident1 = detector.check("generic", kernel.snapshot());
    expect(incident1?.category).toBe("generic");

    const incident2 = detector.check("generic", kernel.snapshot());
    expect(incident2).toBeNull();

    detector.recordProgress("generic");
    clock.advanceBy(11);
    const incident3 = detector.check("generic", kernel.snapshot());
    expect(incident3).not.toBeNull();

    detector.setWaitingOnUser(true);
    clock.advanceBy(100);
    expect(detector.check("generic", kernel.snapshot())).toBeNull();
  });

  test("scheduler fairness: low priority is not starved by high priority", async () => {
    const clock = new TestClock(0);
    const scheduler = new DeterministicScheduler({ clock });
    const executed: string[] = [];

    for (let i = 0; i < 3; i++) scheduler.enqueue(`high_${i}`, () => executed.push(`high_${i}`), "high");
    scheduler.enqueue("low_1", () => executed.push("low_1"), "low");
    for (let i = 3; i < 6; i++) scheduler.enqueue(`high_${i}`, () => executed.push(`high_${i}`), "high");

    await scheduler.tick({ maxRunnables: 10 });
    expect(executed.includes("low_1")).toBe(true);
    expect(executed.indexOf("low_1")).toBeLessThan(executed.length - 1);
  });
});
