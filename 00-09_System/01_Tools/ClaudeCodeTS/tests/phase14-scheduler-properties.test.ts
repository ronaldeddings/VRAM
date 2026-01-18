import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { createSeededRandom } from "../src/core/runtime/seededRandom.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import type { TaskHandle } from "../src/core/runtime/scope.js";

function randInt(rng: ReturnType<typeof createSeededRandom>, maxExclusive: number): number {
  return rng.nextUint32() % maxExclusive;
}

describe("Phase 14: scheduler/cancellation property-like tests (deterministic)", () => {
  test("cancelling a parent task cancels all its descendants (randomized trees)", async () => {
    for (const seed of ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"]) {
      const rng = createSeededRandom(seed);
      const clock = new TestClock(0);
      const idSource = createMonotonicIdSource({ startAt: 0 });
      const kernel = new RuntimeKernel({ clock, idSource });
      const scheduler = kernel.getScheduler();

      const scope = kernel.createScope({ kind: "session", label: `prop:${seed}` });
      const handles: Array<{ id: string; parentIdx: number | null; handle: TaskHandle<string> }> = [];

      const n = 6 + randInt(rng, 8);
      for (let i = 0; i < n; i++) {
        const parentIdx = i === 0 ? null : randInt(rng, i);
        const parentTaskId = parentIdx === null ? undefined : (handles[parentIdx]!.id as any);
        const handle = scope.spawn(
          async (ctx) => {
            await ctx.sleep(50);
            return ctx.taskId;
          },
          parentTaskId ? { parentTaskId } : {}
        );
        handles.push({ id: handle.id, parentIdx, handle });
      }

      await scheduler.tick();
      const cancelIdx = 1 + randInt(rng, Math.max(1, n - 1));
      handles[cancelIdx]!.handle.cancel({ kind: "user_cancel", message: "prop cancel" });

      clock.advanceBy(100);
      await scheduler.runUntilIdle();
      const results = await Promise.all(handles.map((h) => h.handle.done));

      const descendants = new Set<number>();
      const isDescendantOf = (idx: number, ancestor: number): boolean => {
        let cur: number | null = handles[idx]!.parentIdx;
        while (cur !== null) {
          if (cur === ancestor) return true;
          cur = handles[cur]!.parentIdx;
        }
        return false;
      };
      for (let i = 0; i < n; i++) if (i === cancelIdx || isDescendantOf(i, cancelIdx)) descendants.add(i);

      for (const idx of descendants) {
        expect(results[idx]!.kind).toBe("cancelled");
      }

      await scope.close({ kind: "stop_request", message: "done" });
      await scheduler.runUntilIdle();
      expect(kernel.snapshot().timers.length).toBe(0);
    }
  });
});
