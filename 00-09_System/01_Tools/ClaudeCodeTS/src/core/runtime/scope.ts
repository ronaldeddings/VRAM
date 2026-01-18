import type { CancellationReason, TaskFailurePolicy, TaskId, TaskPriority, TaskResult, TaskScopeId, TaskScopeKind } from "../types/runtime.js";
import { createDeferred, type Deferred } from "./deferred.js";

export type SpawnTaskOptions = {
  label?: string;
  priority?: TaskPriority;
  failurePolicy?: TaskFailurePolicy;
  parentTaskId?: TaskId;
  timeoutMs?: number;
  correlationIds?: Record<string, string>;
  metadata?: Readonly<Record<string, unknown>>;
};

export type TaskExecutionContext = {
  taskId: TaskId;
  scopeId: TaskScopeId;
  signal: AbortSignal;
  nowMonoMs: () => number;
  yield: (priority?: TaskPriority) => Promise<void>;
  sleep: (delayMs: number, reason?: CancellationReason) => Promise<void>;
};

export type TaskFn<T> = (ctx: TaskExecutionContext) => Promise<T>;

export type TaskHandle<T = unknown> = {
  id: TaskId;
  done: Promise<TaskResult<T>>;
  cancel: (reason: CancellationReason) => void;
};

export type TaskScopeRuntime = {
  spawnTask: <T>(scopeId: TaskScopeId, fn: TaskFn<T>, options?: SpawnTaskOptions) => TaskHandle<T>;
  closeScope: (scopeId: TaskScopeId, reason?: CancellationReason) => Promise<void>;
  nowMonoMs: () => number;
};

export class TaskScope {
  readonly id: TaskScopeId;
  readonly kind: TaskScopeKind;
  readonly label: string | undefined;
  readonly parentScopeId: TaskScopeId | undefined;

  private readonly runtime: TaskScopeRuntime;
  private readonly createdAtMonoMs: number;

  private readonly taskIds = new Set<TaskId>();
  private closedAtMonoMs: number | undefined;
  private closing: Deferred<void> | undefined;

  constructor(options: {
    id: TaskScopeId;
    kind: TaskScopeKind;
    label?: string;
    parentScopeId?: TaskScopeId;
    runtime: TaskScopeRuntime;
  }) {
    this.id = options.id;
    this.kind = options.kind;
    this.label = options.label;
    this.parentScopeId = options.parentScopeId;
    this.runtime = options.runtime;
    this.createdAtMonoMs = options.runtime.nowMonoMs();
  }

  get isClosed(): boolean {
    return this.closedAtMonoMs !== undefined;
  }

  getSnapshotTaskIds(): TaskId[] {
    return [...this.taskIds.values()];
  }

  get createdAt(): number {
    return this.createdAtMonoMs;
  }

  get closedAt(): number | undefined {
    return this.closedAtMonoMs;
  }

  spawn<T>(fn: TaskFn<T>, options: SpawnTaskOptions = {}): TaskHandle<T> {
    if (this.isClosed) throw new Error(`TaskScope(${this.id}) is closed`);
    const handle = this.runtime.spawnTask(this.id, fn, options);
    this.taskIds.add(handle.id);
    handle.done.finally(() => this.taskIds.delete(handle.id)).catch(() => {});
    return handle;
  }

  async close(reason: CancellationReason = { kind: "stop_request", message: "scope closed" }): Promise<void> {
    if (this.isClosed) return;
    if (!this.closing) this.closing = createDeferred<void>();
    this.closedAtMonoMs = this.runtime.nowMonoMs();
    await this.runtime.closeScope(this.id, reason);
    this.closing.resolve();
    this.closing = undefined;
  }
}
