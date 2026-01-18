import { toEngineError } from "../types/errors.js";
import type {
  CancellationReason,
  ConcurrencyLimiterSnapshot,
  PendingTimerSnapshot,
  RuntimeSnapshot,
  RuntimeShutdownSummary,
  RuntimeStreamKind,
  RuntimeStreamSnapshot,
  SchedulerQueueDepths,
  TaskFailurePolicy,
  TaskId,
  TaskInfoSnapshot,
  TaskLifecycleState,
  TaskPriority,
  TaskResult,
  TaskScopeId,
  TaskScopeKind,
  TaskScopeSnapshot
} from "../types/runtime.js";
import { createDeferred, type Deferred } from "./deferred.js";
import type { MonotonicClock } from "./clock.js";
import type { IdSource } from "./ids.js";
import { DeterministicScheduler } from "./scheduler.js";
import { TaskScope, type SpawnTaskOptions, type TaskExecutionContext, type TaskFn, type TaskHandle, type TaskScopeRuntime } from "./scope.js";
import { createCoreStream, type CoreStream } from "./stream.js";
import type { RuntimeSpanEvent } from "../observability/tracing.js";

type TaskRecord = {
  id: TaskId;
  parentId: TaskId | undefined;
  scopeId: TaskScopeId;
  label: string | undefined;
  priority: TaskPriority;
  failurePolicy: TaskFailurePolicy;
  state: TaskLifecycleState;
  correlationIds: Record<string, string> | undefined;
  createdAtMonoMs: number;
  startedAtMonoMs: number | undefined;
  lastYieldAtMonoMs: number | undefined;
  metadata: Readonly<Record<string, unknown>>;
  controller: AbortController;
  done: Deferred<TaskResult>;
  timeoutTimerId: string | undefined;
};

type ScopeRecord = {
  scope: TaskScope;
  kind: TaskScopeKind;
  label: string | undefined;
  parentScopeId: TaskScopeId | undefined;
  createdAtMonoMs: number;
  closedAtMonoMs: number | undefined;
  controller: AbortController;
  taskIds: Set<TaskId>;
};

type LimiterRecord = {
  name: string;
  max: number;
  current: number;
  waiters: Array<{ ownerTaskId: TaskId | undefined; deferred: Deferred<void> }>;
};

type StreamRecord = {
  id: string;
  kind: RuntimeStreamKind;
  lastEmittedSeq: number;
  closed: boolean;
};

type TimerRecord = {
  id: string;
  ownerTaskId: TaskId | undefined;
  deadlineMonoMs: number;
  reason?: CancellationReason;
};

export type RuntimeKernelOptions = {
  clock: MonotonicClock;
  idSource: IdSource;
  onScopeClosed?: (summary: RuntimeShutdownSummary) => void | Promise<void>;
  onTaskEvent?: (event: RuntimeSpanEvent) => void;
};

export class RuntimeKernel {
  private readonly clock: MonotonicClock;
  private readonly idSource: IdSource;
  private readonly scheduler: DeterministicScheduler;
  private readonly onScopeClosed: ((summary: RuntimeShutdownSummary) => void | Promise<void>) | undefined;
  private readonly onTaskEvent: ((event: RuntimeSpanEvent) => void) | undefined;

  private readonly tasks = new Map<TaskId, TaskRecord>();
  private readonly scopes = new Map<TaskScopeId, ScopeRecord>();
  private readonly limiters = new Map<string, LimiterRecord>();
  private readonly streams = new Map<string, StreamRecord>();
  private readonly timers = new Map<string, TimerRecord>();

  constructor(options: RuntimeKernelOptions) {
    this.clock = options.clock;
    this.idSource = options.idSource;
    this.onScopeClosed = options.onScopeClosed;
    this.onTaskEvent = options.onTaskEvent;
    this.scheduler = new DeterministicScheduler({ clock: this.clock });
  }

  nowMonoMs(): number {
    return this.clock.nowMs();
  }

  getScheduler(): DeterministicScheduler {
    return this.scheduler;
  }

  createScope(options: { kind: TaskScopeKind; label?: string; parentScopeId?: TaskScopeId } = { kind: "custom" }): TaskScope {
    const scopeId = this.idSource.nextId("scope");
    const controller = new AbortController();
    const scopeOptions = {
      id: scopeId,
      kind: options.kind,
      runtime: this.makeScopeRuntime(),
      ...(options.label !== undefined ? { label: options.label } : {}),
      ...(options.parentScopeId !== undefined ? { parentScopeId: options.parentScopeId } : {})
    } as const;
    const record: ScopeRecord = {
      scope: new TaskScope(scopeOptions),
      kind: options.kind,
      label: options.label,
      parentScopeId: options.parentScopeId,
      createdAtMonoMs: this.nowMonoMs(),
      closedAtMonoMs: undefined,
      controller,
      taskIds: new Set()
    };
    if (options.parentScopeId) {
      const parent = this.scopes.get(options.parentScopeId);
      if (parent) parent.controller.signal.addEventListener("abort", () => controller.abort(parent.controller.signal.reason), { once: true });
    }
    this.scopes.set(scopeId, record);
    return record.scope;
  }

  private makeScopeRuntime(): TaskScopeRuntime {
    return {
      spawnTask: (scopeId, fn, options) => this.spawnTask(scopeId, fn, options),
      closeScope: (scopeId, reason) => this.closeScope(scopeId, reason),
      nowMonoMs: () => this.nowMonoMs()
    };
  }

  private spawnTask<T>(scopeId: TaskScopeId, fn: TaskFn<T>, options: SpawnTaskOptions = {}): TaskHandle<T> {
    const scope = this.scopes.get(scopeId);
    if (!scope) throw new Error(`Unknown scope: ${scopeId}`);
    if (scope.closedAtMonoMs !== undefined) throw new Error(`Scope already closed: ${scopeId}`);

    const taskId = this.idSource.nextId("task");
    const controller = new AbortController();
    scope.controller.signal.addEventListener("abort", () => controller.abort(scope.controller.signal.reason), { once: true });
    if (options.parentTaskId) {
      const parent = this.tasks.get(options.parentTaskId);
      parent?.controller.signal.addEventListener("abort", () => controller.abort(parent.controller.signal.reason), { once: true });
    }

    const done = createDeferred<TaskResult>();
    const record: TaskRecord = {
      id: taskId,
      parentId: options.parentTaskId,
      scopeId,
      label: options.label,
      priority: options.priority ?? "normal",
      failurePolicy: options.failurePolicy ?? "isolate",
      state: "queued",
      correlationIds: options.correlationIds,
      createdAtMonoMs: this.nowMonoMs(),
      startedAtMonoMs: undefined,
      lastYieldAtMonoMs: undefined,
      metadata: options.metadata ?? {},
      controller,
      done,
      timeoutTimerId: undefined
    };
    this.tasks.set(taskId, record);
    scope.taskIds.add(taskId);
    this.onTaskEvent?.({
      type: "task/queued",
      taskId,
      scopeId,
      tsMonoMs: record.createdAtMonoMs,
      ...(record.label !== undefined ? { label: record.label } : {}),
      priority: record.priority,
      ...(record.correlationIds ? { correlationIds: record.correlationIds } : {})
    });

    const timeoutController = new AbortController();
    controller.signal.addEventListener("abort", () => timeoutController.abort(controller.signal.reason), { once: true });

    if (options.timeoutMs !== undefined) {
      const timerId = this.idSource.nextId("timeout");
      record.timeoutTimerId = timerId;
      const deadline = this.nowMonoMs() + options.timeoutMs;
      this.timers.set(timerId, { id: timerId, ownerTaskId: taskId, deadlineMonoMs: deadline, reason: { kind: "timeout", deadlineMonoMs: deadline } });
      this.scheduler
        .sleep(taskId, options.timeoutMs, { reason: { kind: "timeout", deadlineMonoMs: deadline }, priority: record.priority, signal: timeoutController.signal })
        .then(() => {
          if (record.state === "completed") return;
          controller.abort({ kind: "timeout", deadlineMonoMs: deadline } satisfies CancellationReason);
        })
        .catch(() => {});
    }

    this.scheduler.enqueue(
      taskId,
      () => {
        if (record.state === "completed") return;
        record.startedAtMonoMs = this.nowMonoMs();
        record.state = "running";
        this.onTaskEvent?.({ type: "task/started", taskId, tsMonoMs: record.startedAtMonoMs });
        const ctx: TaskExecutionContext = {
          taskId,
          scopeId,
          signal: controller.signal,
          nowMonoMs: () => this.nowMonoMs(),
          yield: async (priority) => {
            record.state = "waiting";
            record.lastYieldAtMonoMs = this.nowMonoMs();
            await this.scheduler.yield(taskId, priority ?? record.priority, { signal: controller.signal });
            record.state = "running";
          },
          sleep: async (delayMs, reason) => {
            record.state = "waiting";
            await this.scheduler.sleep(taskId, delayMs, {
              priority: record.priority,
              signal: controller.signal,
              ...(reason !== undefined ? { reason } : {})
            });
            record.state = "running";
          }
        };

        void (async () => {
          try {
            const value = await fn(ctx);
            record.state = "completed";
            if (controller.signal.aborted) {
              const reason = (controller.signal.reason ?? { kind: "unknown" }) as CancellationReason;
              if (reason.kind === "timeout") {
                done.resolve({ kind: "timeout", reason });
                this.onTaskEvent?.({ type: "task/completed", taskId, tsMonoMs: this.nowMonoMs(), outcome: "timeout" });
              } else {
                done.resolve({ kind: "cancelled", reason });
                this.onTaskEvent?.({ type: "task/completed", taskId, tsMonoMs: this.nowMonoMs(), outcome: "cancelled" });
              }
            } else {
              done.resolve({ kind: "success", value } as TaskResult);
              this.onTaskEvent?.({ type: "task/completed", taskId, tsMonoMs: this.nowMonoMs(), outcome: "success" });
            }
          } catch (e) {
            record.state = "completed";
            if (controller.signal.aborted) {
              const reason = (controller.signal.reason ?? { kind: "unknown" }) as CancellationReason;
              if (reason.kind === "timeout") {
                done.resolve({ kind: "timeout", reason });
                this.onTaskEvent?.({ type: "task/completed", taskId, tsMonoMs: this.nowMonoMs(), outcome: "timeout" });
              } else {
                done.resolve({ kind: "cancelled", reason });
                this.onTaskEvent?.({ type: "task/completed", taskId, tsMonoMs: this.nowMonoMs(), outcome: "cancelled" });
              }
            } else {
              const error = toEngineError(e);
              done.resolve({ kind: "error", error });
              this.onTaskEvent?.({ type: "task/completed", taskId, tsMonoMs: this.nowMonoMs(), outcome: "error" });
              if (record.failurePolicy === "fail-fast" || record.failurePolicy === "escalate") {
                scope.controller.abort({ kind: "unknown", message: `task failed (${record.failurePolicy})` } satisfies CancellationReason);
              }
            }
          } finally {
            timeoutController.abort({ kind: "unknown", message: "task finished" } satisfies CancellationReason);
            scope.taskIds.delete(taskId);
            this.tasks.delete(taskId);
            if (record.timeoutTimerId) this.timers.delete(record.timeoutTimerId);
          }
        })();
      },
      record.priority
    );

    return {
      id: taskId,
      done: done.promise as Promise<TaskResult<T>>,
      cancel: (reason) => controller.abort(reason)
    };
  }

  private async closeScope(scopeId: TaskScopeId, reason: CancellationReason = { kind: "stop_request" }): Promise<void> {
    const scope = this.scopes.get(scopeId);
    if (!scope) return;
    if (scope.closedAtMonoMs !== undefined) return;

    scope.closedAtMonoMs = this.nowMonoMs();
    scope.controller.abort(reason);

    const cancelledQueued = [...scope.taskIds.values()].filter((taskId) => this.tasks.get(taskId)?.state === "queued").length;

    // Ensure queued tasks resolve deterministically even if the scheduler never ticks again.
    for (const taskId of [...scope.taskIds.values()]) {
      const record = this.tasks.get(taskId);
      if (!record) continue;
      if (record.state !== "queued") continue;

      record.state = "completed";
      record.controller.abort(reason);
      record.done.resolve({ kind: "cancelled", reason });
      if (record.timeoutTimerId) this.timers.delete(record.timeoutTimerId);
      scope.taskIds.delete(taskId);
      this.tasks.delete(taskId);
    }

    const pending = [...scope.taskIds.values()].map((taskId) => this.tasks.get(taskId)?.done.promise).filter(Boolean) as Array<
      Promise<TaskResult>
    >;

    const settled = await Promise.allSettled(pending);
    const results = settled
      .filter((r): r is PromiseFulfilledResult<TaskResult> => r.status === "fulfilled")
      .map((r) => r.value);

    if (this.onScopeClosed) {
      const snapshot = this.snapshot();
      const summary: RuntimeShutdownSummary = {
        scopeId,
        scopeKind: scope.kind,
        reason,
        cancelledTasks: cancelledQueued + results.filter((r) => r.kind === "cancelled").length,
        timeoutTasks: results.filter((r) => r.kind === "timeout").length,
        errorTasks: results.filter((r) => r.kind === "error").length,
        successTasks: results.filter((r) => r.kind === "success").length,
        snapshot
      };
      await this.onScopeClosed(summary);
    }
  }

  defineLimiter(name: string, max: number): void {
    if (this.limiters.has(name)) return;
    if (!Number.isInteger(max) || max < 1) throw new Error(`Limiter max must be >= 1, got ${max}`);
    this.limiters.set(name, { name, max, current: 0, waiters: [] });
  }

  async acquireLimiter(name: string, options: { ownerTaskId?: TaskId; signal?: AbortSignal } = {}): Promise<() => void> {
    const limiter = this.limiters.get(name);
    if (!limiter) throw new Error(`Unknown limiter: ${name}`);
    if (options.signal?.aborted) throw options.signal.reason ?? new Error("aborted");

    if (limiter.current < limiter.max) {
      limiter.current += 1;
      return () => {
        limiter.current -= 1;
        const next = limiter.waiters.shift();
        if (next) this.scheduler.enqueue(next.ownerTaskId ?? `limiter_${name}`, () => next.deferred.resolve(), "high");
      };
    }

    const deferred = createDeferred<void>();
    limiter.waiters.push({ ownerTaskId: options.ownerTaskId, deferred });

    const onAbort = () => {
      const idx = limiter.waiters.findIndex((w) => w.deferred === deferred);
      if (idx >= 0) limiter.waiters.splice(idx, 1);
      deferred.reject(options.signal?.reason ?? new Error("aborted"));
    };
    options.signal?.addEventListener("abort", onAbort, { once: true });
    try {
      await deferred.promise;
      limiter.current += 1;
      return () => {
        limiter.current -= 1;
        const next = limiter.waiters.shift();
        if (next) this.scheduler.enqueue(next.ownerTaskId ?? `limiter_${name}`, () => next.deferred.resolve(), "high");
      };
    } finally {
      options.signal?.removeEventListener("abort", onAbort);
    }
  }

  createStream(kind: RuntimeStreamKind, options: { maxBuffered?: number; dropPolicy?: "drop_oldest" | "drop_newest" | "block_producer" } = {}): CoreStream {
    const id = this.idSource.nextId("stream");
    this.streams.set(id, { id, kind, lastEmittedSeq: 0, closed: false });
    const defaults =
      kind === "tool" || kind === "hook" || kind === "mcp"
        ? ({ maxBuffered: 1024, dropPolicy: "block_producer" } as const)
        : ({ maxBuffered: 256, dropPolicy: "drop_oldest" } as const);
    return createCoreStream({
      id,
      clock: this.clock,
      maxBuffered: options.maxBuffered ?? defaults.maxBuffered,
      dropPolicy: options.dropPolicy ?? defaults.dropPolicy,
      onEmitSeq: (seq) => this.noteStreamEmit(id, seq),
      onClosed: () => this.closeStream(id)
    });
  }

  noteStreamEmit(streamId: string, seq: number): void {
    const s = this.streams.get(streamId);
    if (!s) return;
    s.lastEmittedSeq = Math.max(s.lastEmittedSeq, seq);
  }

  closeStream(streamId: string): void {
    const s = this.streams.get(streamId);
    if (!s) return;
    s.closed = true;
  }

  snapshot(): RuntimeSnapshot {
    const schedulerSnap = this.scheduler.snapshot();
    const queueDepths: SchedulerQueueDepths = schedulerSnap.queueDepths;

    const tasks: TaskInfoSnapshot[] = [...this.tasks.values()]
      .map((t) => ({
        id: t.id,
        ...(t.parentId ? { parentId: t.parentId } : {}),
        scopeId: t.scopeId,
        ...(t.label ? { label: t.label } : {}),
        priority: t.priority,
        failurePolicy: t.failurePolicy,
        state: t.state,
        ...(t.correlationIds ? { correlationIds: t.correlationIds } : {}),
        createdAtMonoMs: t.createdAtMonoMs,
        ...(t.startedAtMonoMs !== undefined ? { startedAtMonoMs: t.startedAtMonoMs } : {}),
        ...(t.lastYieldAtMonoMs !== undefined ? { lastYieldAtMonoMs: t.lastYieldAtMonoMs } : {})
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const scopes: TaskScopeSnapshot[] = [...this.scopes.values()]
      .map((s) => ({
        id: s.scope.id,
        kind: s.kind,
        ...(s.label ? { label: s.label } : {}),
        ...(s.parentScopeId ? { parentScopeId: s.parentScopeId } : {}),
        taskIds: [...s.taskIds.values()].sort((a, b) => a.localeCompare(b)),
        createdAtMonoMs: s.createdAtMonoMs,
        ...(s.closedAtMonoMs !== undefined ? { closedAtMonoMs: s.closedAtMonoMs } : {})
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const limiters: ConcurrencyLimiterSnapshot[] = [...this.limiters.values()]
      .map((l) => ({
        name: l.name,
        current: l.current,
        max: l.max,
        waitQueueLength: l.waiters.length
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const streams: RuntimeStreamSnapshot[] = [...this.streams.values()]
      .map((s) => ({
        id: s.id,
        kind: s.kind,
        lastEmittedSeq: s.lastEmittedSeq,
        closed: s.closed
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    const timers: PendingTimerSnapshot[] = [
      ...schedulerSnap.timers.map((t) => ({
        id: t.id,
        ...(t.ownerTaskId ? { ownerTaskId: t.ownerTaskId } : {}),
        deadlineMonoMs: t.deadlineMonoMs,
        ...(t.reason ? { reason: t.reason } : {})
      })),
      ...[...this.timers.values()].map((t) => ({
        id: t.id,
        ...(t.ownerTaskId ? { ownerTaskId: t.ownerTaskId } : {}),
        deadlineMonoMs: t.deadlineMonoMs,
        ...(t.reason ? { reason: t.reason } : {})
      }))
    ].sort((a, b) => a.deadlineMonoMs - b.deadlineMonoMs || a.id.localeCompare(b.id));

    return { queueDepths, tasks, scopes, limiters, streams, timers };
  }
}
