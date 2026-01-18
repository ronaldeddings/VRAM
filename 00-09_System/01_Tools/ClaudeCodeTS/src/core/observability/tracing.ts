import type { TaskId, TaskPriority, TaskScopeId } from "../types/runtime.js";

export type RuntimeSpanEvent =
  | {
      type: "task/queued";
      taskId: TaskId;
      scopeId: TaskScopeId;
      tsMonoMs: number;
      label?: string;
      priority: TaskPriority;
      correlationIds?: Record<string, string>;
    }
  | {
      type: "task/started";
      taskId: TaskId;
      tsMonoMs: number;
    }
  | {
      type: "task/completed";
      taskId: TaskId;
      tsMonoMs: number;
      outcome: "success" | "error" | "cancelled" | "timeout";
    };

export class TraceBuffer<T> {
  private readonly max: number;
  private readonly events: T[] = [];

  constructor(options: { maxEvents: number }) {
    this.max = Math.max(0, options.maxEvents);
  }

  record(event: T): void {
    if (this.max === 0) return;
    this.events.push(event);
    while (this.events.length > this.max) this.events.shift();
  }

  snapshot(): T[] {
    return [...this.events];
  }

  size(): number {
    return this.events.length;
  }
}

