import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import type { LongRunningTaskEntityV1, DurableTaskRecordV1 } from "../types/agents.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import type { HostStorage, StorageNamespace } from "../types/host.js";

export const DURABLE_TASKS_STORAGE_KEY = "tasks/durable_tasks_v1";

export type DurableTasksDocumentV1 = {
  schemaVersion: 1;
  tasks: Record<string, DurableTaskRecordV1>;
};

export function encodeDurableTasksDocument(doc: DurableTasksDocumentV1): string {
  return canonicalJsonStringify(doc);
}

export function decodeDurableTasksDocument(text: string): DurableTasksDocumentV1 {
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== "object") throw new Error("Durable tasks document is not an object");
  const obj = parsed as Record<string, unknown>;
  if (obj["schemaVersion"] !== 1) throw new Error(`Unsupported durable tasks schemaVersion: ${String(obj["schemaVersion"])}`);
  if (!("tasks" in obj)) throw new Error("Durable tasks document missing tasks");
  return parsed as DurableTasksDocumentV1;
}

export async function loadDurableTasks(storage: HostStorage, namespace: StorageNamespace, key = DURABLE_TASKS_STORAGE_KEY): Promise<DurableTasksDocumentV1 | null> {
  const found = await storage.get(namespace, key);
  if (!found) return null;
  return decodeDurableTasksDocument(found.value);
}

export async function saveDurableTasks(
  storage: HostStorage,
  namespace: StorageNamespace,
  doc: DurableTasksDocumentV1,
  key = DURABLE_TASKS_STORAGE_KEY,
  options?: { expectedVersion?: string | null }
): Promise<{ version: string }> {
  const encoded = encodeDurableTasksDocument(doc);
  return await storage.set(namespace, key, encoded, options);
}

export type TaskRegistrySnapshot = {
  tasks: Record<string, LongRunningTaskEntityV1>;
};

export class TaskRegistry {
  private readonly idSource: IdSource;
  private readonly clock: MonotonicClock;
  private readonly tasks = new Map<string, LongRunningTaskEntityV1>();

  constructor(options: { idSource: IdSource; clock: MonotonicClock }) {
    this.idSource = options.idSource;
    this.clock = options.clock;
  }

  snapshot(): TaskRegistrySnapshot {
    return { tasks: Object.fromEntries([...this.tasks.entries()].sort((a, b) => a[0].localeCompare(b[0]))) };
  }

  create(label: string, initial?: Partial<LongRunningTaskEntityV1>): LongRunningTaskEntityV1 {
    const id = this.idSource.nextId("lrt");
    const now = this.clock.nowMs();
    const task: LongRunningTaskEntityV1 = {
      id,
      kind: initial?.kind ?? "custom",
      label,
      state: "scheduled",
      createdAtMonoMs: now,
      updatedAtMonoMs: now,
      ...(initial ?? {})
    };
    this.tasks.set(id, task);
    return task;
  }

  upsert(task: LongRunningTaskEntityV1): void {
    this.tasks.set(task.id, task);
  }

  get(id: string): LongRunningTaskEntityV1 | null {
    return this.tasks.get(id) ?? null;
  }

  update(id: string, updater: (prev: LongRunningTaskEntityV1) => LongRunningTaskEntityV1): LongRunningTaskEntityV1 | null {
    const prev = this.tasks.get(id);
    if (!prev) return null;
    const next = updater(prev);
    this.tasks.set(id, next);
    return next;
  }

  remove(id: string): void {
    this.tasks.delete(id);
  }
}
