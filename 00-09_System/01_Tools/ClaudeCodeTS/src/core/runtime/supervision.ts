import type { RuntimeSnapshot, TaskId, TaskScopeId, TaskScopeSnapshot } from "../types/runtime.js";

export type SupervisionNode = {
  scope: TaskScopeSnapshot;
  children: SupervisionNode[];
};

export function buildSupervisionForest(snapshot: RuntimeSnapshot): SupervisionNode[] {
  const scopesById = new Map<TaskScopeId, TaskScopeSnapshot>();
  for (const s of snapshot.scopes) scopesById.set(s.id, s);

  const childrenByParent = new Map<TaskScopeId, TaskScopeSnapshot[]>();
  const roots: TaskScopeSnapshot[] = [];

  for (const scope of snapshot.scopes) {
    const parent = scope.parentScopeId;
    if (!parent) {
      roots.push(scope);
      continue;
    }
    const list = childrenByParent.get(parent) ?? [];
    list.push(scope);
    childrenByParent.set(parent, list);
  }

  for (const list of childrenByParent.values()) list.sort((a, b) => a.id.localeCompare(b.id));
  roots.sort((a, b) => a.id.localeCompare(b.id));

  const visit = (scope: TaskScopeSnapshot): SupervisionNode => {
    const kids = childrenByParent.get(scope.id) ?? [];
    return { scope, children: kids.map(visit) };
  };

  void scopesById;
  return roots.map(visit);
}

export function detectLeakedTasks(snapshot: RuntimeSnapshot, options: { endedScopeIds: readonly TaskScopeId[] }): TaskId[] {
  const ended = new Set<TaskScopeId>(options.endedScopeIds);
  const leaked: TaskId[] = [];
  for (const task of snapshot.tasks) {
    const scopeId = task.scopeId;
    if (!scopeId) continue;
    if (!ended.has(scopeId)) continue;
    if (task.state === "completed") continue;
    leaked.push(task.id);
  }
  leaked.sort((a, b) => a.localeCompare(b));
  return leaked;
}

