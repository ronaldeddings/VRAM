import { describe, expect, test } from "bun:test";
import crypto from "node:crypto";
import {
  StorageConflictError,
  availableCapability,
  unavailableCapability,
  type HostCapabilities,
  type HostStorage,
  type StorageNamespace
} from "../src/core/types/host.js";
import { asWorkspaceId } from "../src/core/types/workspace.js";
import {
  applySettingsPatch,
  computeEnabledFileSettingsSources,
  createSettingsDocumentFromObject,
  createSettingsManager,
  exportSettingsBundleV1,
  importSettingsBundleV1,
  parseEnabledSettingSourcesFlag,
  readSettingsSourceFromStorage,
  refreshRemotePolicySettings,
  writeSettingsSourceToStorage
} from "../src/core/settings/index.js";

function nsKey(ns: StorageNamespace): string {
  return `${ns.scope}:${ns.workspaceId ?? ""}:${ns.sessionId ?? ""}`;
}

function computeVersion(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function createInMemoryStorage(): HostStorage {
  const data = new Map<string, { value: string; version: string }>();
  const subs = new Map<string, Set<(e: any) => void>>();

  function emit(ns: StorageNamespace, event: any): void {
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
      const expected = options?.expectedVersion;
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
      const expected = options?.expectedVersion;
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

function createHostWithStorage(storage: HostStorage): HostCapabilities {
  return {
    clock: unavailableCapability({ kind: "not-provided" }),
    random: unavailableCapability({ kind: "not-provided" }),
    crypto: unavailableCapability({ kind: "not-provided" }),
    secrets: unavailableCapability({ kind: "not-provided" }),
    storage: availableCapability(storage),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: unavailableCapability({ kind: "not-provided" }),
    lifecycle: unavailableCapability({ kind: "not-provided" }),
    telemetry: unavailableCapability({ kind: "not-provided" }),
    background: unavailableCapability({ kind: "not-provided" }),
    fileTransfer: unavailableCapability({ kind: "not-provided" }),
    shell: unavailableCapability({ kind: "not-provided" }),
    localEndpoint: unavailableCapability({ kind: "not-provided" }),
    ipc: unavailableCapability({ kind: "not-provided" }),
    process: unavailableCapability({ kind: "not-provided" }),
    clipboard: unavailableCapability({ kind: "not-provided" }),
    notifications: unavailableCapability({ kind: "not-provided" }),
    haptics: unavailableCapability({ kind: "not-provided" })
  };
}

describe("Phase 6: settings system", () => {
  test("enabled sources flag parser matches legacy", () => {
    expect(parseEnabledSettingSourcesFlag("")).toEqual([]);
    expect(parseEnabledSettingSourcesFlag("user,project,local")).toEqual(["userSettings", "projectSettings", "localSettings"]);
    expect(parseEnabledSettingSourcesFlag("local,user")).toEqual(["localSettings", "userSettings"]);
    expect(() => parseEnabledSettingSourcesFlag("policy")).toThrow();
  });

  test("enabled file sources always include policy+flag (and preserve legacy order)", () => {
    expect(computeEnabledFileSettingsSources(["userSettings"])).toEqual(["userSettings", "policySettings", "flagSettings"]);
    expect(computeEnabledFileSettingsSources(["projectSettings", "userSettings"])).toEqual([
      "projectSettings",
      "userSettings",
      "policySettings",
      "flagSettings"
    ]);
  });

  test("patch semantics: delete on undefined + arrays replace", () => {
    const base = { a: 1, nested: { keep: true, drop: "x", arr: [1, 2, 3] } };
    const next = applySettingsPatch(base, { nested: { drop: undefined, arr: [2] } });
    expect((next.nested as any).keep).toBe(true);
    expect((next.nested as any).drop).toBeUndefined();
    expect((next.nested as any).arr).toEqual([2]);
  });

  test("storage-backed settings manager merges enabled sources and suppresses self-triggered watch events", async () => {
    const storage = createInMemoryStorage();
    const host = createHostWithStorage(storage);
    const ctx = { workspaceId: asWorkspaceId("ws_test"), sessionId: "sess_test" };

    await writeSettingsSourceToStorage(
      storage,
      "userSettings",
      ctx,
      createSettingsDocumentFromObject({ disableAllHooks: false, arr: [1], nested: { a: 1 } }),
      { expectedVersion: null }
    );
    await writeSettingsSourceToStorage(
      storage,
      "policySettings",
      ctx,
      createSettingsDocumentFromObject({ allowManagedHooksOnly: true, nested: { b: 2 } }, { origin: "local" }),
      { expectedVersion: null }
    );
    await writeSettingsSourceToStorage(
      storage,
      "flagSettings",
      ctx,
      createSettingsDocumentFromObject({ disableAllHooks: true, arr: [2, 3] }),
      { expectedVersion: null }
    );

    const mgr = createSettingsManager(host, ctx);
    let updates = 0;
    const unsub = mgr.subscribe(() => {
      updates += 1;
    });
    await mgr.initialize();

    const effective = mgr.getEffective();
    expect(effective.settings.disableAllHooks).toBe(true);
    expect(effective.settings.arr).toEqual([1, 2, 3]);

    const cfg = mgr.getEffectiveConfig();
    expect(cfg.hooks.disabled).toBe(true);
    expect(cfg.hooks.managedOnly).toBe(true);

    const before = updates;
    const patchRes = await mgr.patchSource("userSettings", { nested: { a: 3 }, newKey: "x" });
    expect(patchRes.ok).toBe(true);

    expect(updates - before).toBe(1);
    unsub();
    mgr.dispose();
  });

  test("export/import bundle captures per-source settings objects", async () => {
    const storage = createInMemoryStorage();
    const ctx = { workspaceId: asWorkspaceId("ws_bundle"), sessionId: "sess_bundle" };
    await writeSettingsSourceToStorage(storage, "userSettings", ctx, createSettingsDocumentFromObject({ a: 1 }), { expectedVersion: null });
    await writeSettingsSourceToStorage(
      storage,
      "policySettings",
      ctx,
      createSettingsDocumentFromObject({ allowManagedHooksOnly: true }, { origin: "remote" }),
      { expectedVersion: null }
    );

    const { bundle, errors } = await exportSettingsBundleV1(storage, ctx, ["userSettings", "policySettings"], Date.now());
    expect(errors.length).toBe(0);
    expect(bundle.sources.userSettings).toEqual({ a: 1 });
    expect(bundle.sources.policySettings).toEqual({ allowManagedHooksOnly: true });

    const storage2 = createInMemoryStorage();
    const importRes = await importSettingsBundleV1(storage2, ctx, bundle);
    expect(importRes.ok).toBe(true);
    const r1 = await readSettingsSourceFromStorage(storage2, "userSettings", ctx);
    expect(r1.settings).toEqual({ a: 1 });
  });

  test("invalid policy settings fail-closed in EffectiveConfig", async () => {
    const storage = createInMemoryStorage();
    const host = createHostWithStorage(storage);
    const ctx = { workspaceId: asWorkspaceId("ws_policy_invalid"), sessionId: "sess_policy_invalid" };

    await storage.set({ scope: "app" }, "settings/source/policySettings", "{ invalid json", { expectedVersion: null });
    await writeSettingsSourceToStorage(storage, "flagSettings", ctx, createSettingsDocumentFromObject({}), { expectedVersion: null });

    const mgr = createSettingsManager(host, ctx);
    await mgr.initialize();
    expect(mgr.getEffective().policyOrigin).toBe("invalid");
    expect(mgr.getEffectiveConfig().hooks.disabled).toBe(true);
    expect(mgr.getEffectiveConfig().hooks.managedOnly).toBe(true);
    mgr.dispose();
  });

  test("remote policy refresh writes to cache (storage)", async () => {
    const storage = createInMemoryStorage();
    const ctx = { workspaceId: asWorkspaceId("ws_policy_remote"), sessionId: "sess_policy_remote" };

    const res = await refreshRemotePolicySettings({
      storage,
      ctx,
      nowWallMs: 123,
      provider: { fetchPolicySettings: async () => ({ allowManagedHooksOnly: true }) }
    });
    expect(res.updated).toBe(true);

    const read = await readSettingsSourceFromStorage(storage, "policySettings", ctx);
    expect(read.settings).toEqual({ allowManagedHooksOnly: true });
    expect(read.origin).toBe("remote");
  });
});
