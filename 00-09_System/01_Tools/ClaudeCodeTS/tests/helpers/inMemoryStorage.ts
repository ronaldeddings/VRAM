import crypto from "node:crypto";
import type { HostStorage, StorageChangeEvent, StorageNamespace } from "../../src/core/types/host.js";
import { StorageConflictError } from "../../src/core/types/host.js";

function nsKey(ns: StorageNamespace): string {
  return `${ns.scope}:${ns.workspaceId ?? ""}:${ns.sessionId ?? ""}`;
}

function computeVersion(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

export function createInMemoryCasStorage(): HostStorage {
  const data = new Map<string, { value: string; version: string }>();
  const subs = new Map<string, Set<(e: StorageChangeEvent) => void>>();

  function emit(ns: StorageNamespace, event: StorageChangeEvent): void {
    const k = nsKey(ns);
    const set = subs.get(k);
    if (!set) return;
    for (const h of set) h(event);
  }

  return {
    get: async (ns, key) => {
      const rec = data.get(`${nsKey(ns)}:${key}`);
      if (!rec) return null;
      return { value: rec.value, version: rec.version };
    },
    set: async (ns, key, value, options) => {
      const full = `${nsKey(ns)}:${key}`;
      const existing = data.get(full) ?? null;
      const expected = options?.expectedVersion ?? undefined;
      if (expected !== undefined) {
        const actual = existing?.version ?? null;
        if (expected === null) {
          if (existing !== null) throw new StorageConflictError({ key, expectedVersion: null, actualVersion: actual });
        } else if (existing === null || existing.version !== expected) {
          throw new StorageConflictError({ key, expectedVersion: expected, actualVersion: actual });
        }
      }
      const version = computeVersion(value);
      data.set(full, { value, version });
      emit(ns, { namespace: ns, key, kind: "set", version });
      return { version };
    },
    delete: async (ns, key, options) => {
      const full = `${nsKey(ns)}:${key}`;
      const existing = data.get(full) ?? null;
      const expected = options?.expectedVersion ?? undefined;
      if (expected !== undefined) {
        const actual = existing?.version ?? null;
        if (expected === null) {
          if (existing !== null) throw new StorageConflictError({ key, expectedVersion: null, actualVersion: actual });
        } else if (existing === null || existing.version !== expected) {
          throw new StorageConflictError({ key, expectedVersion: expected, actualVersion: actual });
        }
      }
      data.delete(full);
      emit(ns, { namespace: ns, key, kind: "delete" });
    },
    subscribe: (ns, handler) => {
      const k = nsKey(ns);
      const set = subs.get(k) ?? new Set();
      set.add(handler);
      subs.set(k, set);
      return () => {
        const cur = subs.get(k);
        cur?.delete(handler);
        if (cur && cur.size === 0) subs.delete(k);
      };
    }
  };
}

