import type { CancellationReason, TaskId, TaskPriority } from "../types/runtime.js";
import { createDeferred, type Deferred } from "./deferred.js";
import type { MonotonicClock } from "./clock.js";

export type SchedulerInstrumentation = {
  onQueued?: (info: { taskId: TaskId; priority: TaskPriority; tick: number }) => void;
  onStarted?: (info: { taskId: TaskId; tick: number }) => void;
  onYielded?: (info: { taskId: TaskId; tick: number }) => void;
  onCompleted?: (info: { taskId: TaskId; tick: number }) => void;
};

export type SchedulerTickOptions = {
  maxRunnables?: number;
};

type Runnable = {
  taskId: TaskId;
  priority: TaskPriority;
  queuedAtTick: number;
  cancelled: boolean;
  run: () => void | Promise<void>;
};

type TimerRecord = {
  id: string;
  ownerTaskId: TaskId | undefined;
  deadlineMonoMs: number;
  reason?: CancellationReason;
  deferred: Deferred<void>;
  priority: TaskPriority;
  cancelled: boolean;
};

export type SchedulerSnapshot = {
  tick: number;
  queueDepths: Record<TaskPriority, number>;
  timers: Array<{ id: string; ownerTaskId?: TaskId; deadlineMonoMs: number; reason?: CancellationReason }>;
};

export class DeterministicScheduler {
  private readonly clock: MonotonicClock;
  private readonly instrumentation: SchedulerInstrumentation;

  private tickCount = 0;
  private inTick = false;

  private readonly current: Record<TaskPriority, Runnable[]> = {
    immediate: [],
    high: [],
    normal: [],
    low: []
  };
  private readonly next: Record<TaskPriority, Runnable[]> = {
    immediate: [],
    high: [],
    normal: [],
    low: []
  };

  private readonly timers = new Map<string, TimerRecord>();
  private timerCounter = 0;

  private dequeueCursor = 0;
  private readonly dequeueSchedule: readonly TaskPriority[] = ["immediate", "high", "high", "high", "normal", "normal", "low"] as const;

  constructor(options: { clock: MonotonicClock; instrumentation?: SchedulerInstrumentation }) {
    this.clock = options.clock;
    this.instrumentation = options.instrumentation ?? {};
  }

  get currentTick(): number {
    return this.tickCount;
  }

  snapshot(): SchedulerSnapshot {
    return {
      tick: this.tickCount,
      queueDepths: this.queueDepths(),
      timers: [...this.timers.values()]
        .filter((t) => !t.cancelled)
        .map((t) => ({
          id: t.id,
          ...(t.ownerTaskId ? { ownerTaskId: t.ownerTaskId } : {}),
          deadlineMonoMs: t.deadlineMonoMs,
          ...(t.reason ? { reason: t.reason } : {})
        }))
        .sort((a, b) => a.deadlineMonoMs - b.deadlineMonoMs)
    };
  }

  queueDepths(): Record<TaskPriority, number> {
    return {
      immediate: this.current.immediate.length + this.next.immediate.length,
      high: this.current.high.length + this.next.high.length,
      normal: this.current.normal.length + this.next.normal.length,
      low: this.current.low.length + this.next.low.length
    };
  }

  enqueue(taskId: TaskId, run: () => void | Promise<void>, priority: TaskPriority = "normal"): void {
    const target = this.inTick ? this.next : this.current;
    target[priority].push({ taskId, priority, queuedAtTick: this.tickCount, cancelled: false, run });
    this.instrumentation.onQueued?.({ taskId, priority, tick: this.tickCount });
  }

  yield(taskId: TaskId, priority: TaskPriority = "normal", options: { signal?: AbortSignal } = {}): Promise<void> {
    if (options.signal?.aborted) return Promise.reject(options.signal.reason ?? new Error("aborted"));
    const deferred = createDeferred<void>();
    const runnable: Runnable = {
      taskId,
      priority,
      queuedAtTick: this.tickCount,
      cancelled: false,
      run: () => {
        if (runnable.cancelled) return;
        this.instrumentation.onYielded?.({ taskId, tick: this.tickCount });
        deferred.resolve();
      }
    };
    const target = this.inTick ? this.next : this.current;
    target[priority].push(runnable);
    this.instrumentation.onQueued?.({ taskId, priority, tick: this.tickCount });

    const onAbort = () => {
      runnable.cancelled = true;
      deferred.reject(options.signal?.reason ?? new Error("aborted"));
    };
    options.signal?.addEventListener("abort", onAbort, { once: true });
    return deferred.promise.finally(() => {
      options.signal?.removeEventListener("abort", onAbort);
    });
  }

  sleep(
    ownerTaskId: TaskId | undefined,
    delayMs: number,
    options: { priority?: TaskPriority; reason?: CancellationReason; signal?: AbortSignal } = {}
  ): Promise<void> {
    if (!Number.isFinite(delayMs) || delayMs < 0) return Promise.reject(new Error(`sleep expects a non-negative finite delayMs, got ${delayMs}`));
    if (options.signal?.aborted) return Promise.reject(options.signal.reason ?? new Error("aborted"));

    const id = `tmr_${++this.timerCounter}`;
    const deferred = createDeferred<void>();
    const record: TimerRecord = {
      id,
      ownerTaskId,
      deadlineMonoMs: this.clock.nowMs() + delayMs,
      ...(options.reason ? { reason: options.reason } : {}),
      deferred,
      priority: options.priority ?? "normal",
      cancelled: false
    };
    this.timers.set(id, record);

    const onAbort = () => {
      record.cancelled = true;
      this.timers.delete(id);
      deferred.reject(options.signal?.reason ?? new Error("aborted"));
    };
    options.signal?.addEventListener("abort", onAbort, { once: true });

    return deferred.promise.finally(() => {
      options.signal?.removeEventListener("abort", onAbort);
    });
  }

  private pollDueTimers(): void {
    const now = this.clock.nowMs();
    for (const t of this.timers.values()) {
      if (t.cancelled) continue;
      if (t.deadlineMonoMs > now) continue;
      t.cancelled = true;
      this.timers.delete(t.id);
      this.enqueue(
        t.ownerTaskId ?? `timer_${t.id}`,
        () => {
          t.deferred.resolve();
        },
        t.priority
      );
    }
  }

  private dequeue(): Runnable | undefined {
    const schedule = this.dequeueSchedule;
    const start = this.dequeueCursor % schedule.length;
    for (let i = 0; i < schedule.length; i++) {
      const idx = (start + i) % schedule.length;
      const slot = schedule[idx]!;
      const q = this.current[slot];
      if (q.length > 0) {
        this.dequeueCursor = (idx + 1) % schedule.length;
        return q.shift();
      }
    }
    return undefined;
  }

  async tick(options: SchedulerTickOptions = {}): Promise<void> {
    const maxRunnables = options.maxRunnables ?? 1000;
    this.pollDueTimers();

    this.inTick = true;
    try {
      for (let i = 0; i < maxRunnables; i++) {
        const runnable = this.dequeue();
        if (!runnable) break;
        if (runnable.cancelled) continue;
        this.instrumentation.onStarted?.({ taskId: runnable.taskId, tick: this.tickCount });
        await runnable.run();
        this.instrumentation.onCompleted?.({ taskId: runnable.taskId, tick: this.tickCount });
        await Promise.resolve();
      }
    } finally {
      this.inTick = false;
      this.tickCount += 1;
      for (const p of ["immediate", "high", "normal", "low"] as const) {
        if (this.next[p].length > 0) this.current[p].push(...this.next[p]);
        this.next[p].length = 0;
      }
    }
  }

  async runUntilIdle(options: { maxTicks?: number; maxRunnablesPerTick?: number } = {}): Promise<void> {
    const maxTicks = options.maxTicks ?? 10_000;
    for (let i = 0; i < maxTicks; i++) {
      // Allow promise continuations to enqueue additional work before we decide we're idle.
      // This is important for cooperative tasks that resume after a yield/sleep resolves.
      await Promise.resolve();
      const depths = this.queueDepths();
      const hasRunnables = depths.immediate + depths.high + depths.normal + depths.low > 0;
      const hasTimers = this.timers.size > 0;
      if (!hasRunnables && !hasTimers) {
        await Promise.resolve();
        const depths2 = this.queueDepths();
        const hasRunnables2 = depths2.immediate + depths2.high + depths2.normal + depths2.low > 0;
        const hasTimers2 = this.timers.size > 0;
        if (!hasRunnables2 && !hasTimers2) return;
      }
      await this.tick(options.maxRunnablesPerTick !== undefined ? { maxRunnables: options.maxRunnablesPerTick } : {});
    }
    throw new Error(`runUntilIdle exceeded maxTicks=${maxTicks}`);
  }
}
