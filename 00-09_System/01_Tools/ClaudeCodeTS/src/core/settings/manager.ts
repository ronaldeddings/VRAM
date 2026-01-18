import type { HostCapabilities, HostStorage, StorageChangeEvent } from "../types/host.js";
import { requireCapability } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { applySettingsPatch, type SettingsPatchObject } from "./patch.js";
import { mergeSettingsObjectsInOrder } from "./merge.js";
import { computeEnabledFileSettingsSources } from "./sources.js";
import type {
  AllowedSettingSource,
  EffectiveSettingsResult,
  FileBackedSettingsSource,
  SettingsError,
  SettingsEventBus,
  SettingsPolicyOrigin,
  SettingsSource,
  SettingsSourceReadResult,
  SettingsUpdateEvent,
  SettingsUnsubscribe,
  WritableSettingsSource
} from "./types.js";
import {
  createSettingsDocumentFromObject,
  namespaceForSettingsSource,
  readSettingsSourceFromStorage,
  settingsStorageKey,
  writeSettingsSourceToStorage,
  type SettingsStorageContext
} from "./storage.js";
import { computeEffectiveConfig, type EffectiveConfig } from "./effectiveConfig.js";

function createEventBus(): SettingsEventBus {
  const subs = new Set<(evt: SettingsUpdateEvent) => void>();
  return {
    subscribe: (handler) => {
      subs.add(handler);
      return () => subs.delete(handler);
    },
    emit: (evt) => {
      for (const h of subs) h(evt);
    },
    clear: () => subs.clear()
  };
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type SettingsManager = {
  initialize: () => Promise<void>;
  dispose: () => void;
  subscribe: (handler: (evt: SettingsUpdateEvent) => void) => SettingsUnsubscribe;
  notifyChange: (source: SettingsSource | null) => Promise<void>;
  getEffective: () => EffectiveSettingsResult;
  getEffectiveConfig: () => EffectiveConfig;
  setAllowedSources: (allowed: AllowedSettingSource[]) => Promise<void>;
  setOverlay: (source: Exclude<SettingsSource, FileBackedSettingsSource>, settings: JsonObject | null) => Promise<void>;
  patchSource: (source: WritableSettingsSource, patch: SettingsPatchObject) => Promise<{ ok: true } | { ok: false; errors: SettingsError[] }>;
  updateSource: (
    source: WritableSettingsSource,
    updater: (current: JsonObject) => JsonObject
  ) => Promise<{ ok: true } | { ok: false; errors: SettingsError[] }>;
};

type InternalWriteKey = string;

function internalWriteKey(ns: { scope: string; workspaceId?: string; sessionId?: string }, key: string): InternalWriteKey {
  return `${ns.scope}:${ns.workspaceId ?? ""}:${ns.sessionId ?? ""}:${key}`;
}

export function createSettingsManager(host: HostCapabilities, ctx: SettingsStorageContext = {}): SettingsManager {
  const storage = requireCapability(host, "storage") as HostStorage;
  const proc = host.process.kind === "available" ? host.process.value : null;

  let allowedSources: AllowedSettingSource[] = ["userSettings", "projectSettings", "localSettings"];
  let enabledSources: FileBackedSettingsSource[] = computeEnabledFileSettingsSources(allowedSources);

  const overlays: Partial<Record<SettingsSource, JsonObject | null>> = {
    cliArg: null,
    command: null,
    session: null
  };
  const perSource: Partial<Record<SettingsSource, SettingsSourceReadResult>> = {};
  let effective: EffectiveSettingsResult = {
    settings: {},
    errors: [],
    enabledSources,
    perSource,
    policyOrigin: "absent"
  };
  function envSnapshot(): Record<string, string | undefined> {
    if (!proc?.getEnv) return {};
    return {
      ENABLE_EXPERIMENTAL_MCP_CLI: proc.getEnv("ENABLE_EXPERIMENTAL_MCP_CLI"),
      ENABLE_MCP_CLI_ENDPOINT: proc.getEnv("ENABLE_MCP_CLI_ENDPOINT"),
      MCP_TOOL_TIMEOUT: proc.getEnv("MCP_TOOL_TIMEOUT"),
      MAX_MCP_OUTPUT_TOKENS: proc.getEnv("MAX_MCP_OUTPUT_TOKENS")
    };
  }

  let effectiveConfig: EffectiveConfig = computeEffectiveConfig({
    effectiveSettings: effective.settings,
    policySource: perSource.policySettings,
    policyOrigin: effective.policyOrigin,
    host,
    env: envSnapshot()
  });

  const bus = createEventBus();
  const internalWrites = new Map<InternalWriteKey, string>();
  const internalPending = new Set<InternalWriteKey>();
  const unsubscribers: Array<() => void> = [];

  async function loadAllFileBackedSources(): Promise<void> {
    enabledSources = computeEnabledFileSettingsSources(allowedSources);

    const errors: SettingsError[] = [];
    const mergedInputs: JsonObject[] = [];
    let policyOrigin: SettingsPolicyOrigin = "absent";

    for (const source of enabledSources) {
      const res = await readSettingsSourceFromStorage(storage, source, ctx);
      perSource[source] = res;
      errors.push(...res.errors);
      if (source === "policySettings") {
        if (res.origin) policyOrigin = res.origin;
        if (res.storageVersion && res.errors.length > 0 && res.settings === null) policyOrigin = "invalid";
      }
      if (res.settings) mergedInputs.push(res.settings);
    }

    for (const [source, settings] of Object.entries(overlays) as Array<[SettingsSource, JsonObject | null]>) {
      perSource[source] = { source, settings, errors: [] };
    }

    const settings = mergeSettingsObjectsInOrder(mergedInputs);
    effective = { settings, errors, enabledSources, perSource: { ...perSource }, policyOrigin };
    effectiveConfig = computeEffectiveConfig({
      effectiveSettings: settings,
      policySource: perSource.policySettings,
      policyOrigin,
      host,
      env: envSnapshot()
    });
  }

  async function emitUpdate(changedSource: SettingsSource | null): Promise<void> {
    await loadAllFileBackedSources();
    bus.emit({ type: "settings/updated", changedSource, effective });
  }

  function markInternalWrite(source: SettingsSource, version: string): void {
    const ns = namespaceForSettingsSource(source, ctx);
    const key = settingsStorageKey(source);
    const k = internalWriteKey(ns, key);
    const existing = internalWrites.get(k);
    if (existing === version) {
      internalWrites.delete(k);
      internalPending.delete(k);
      return;
    }
    internalWrites.set(k, version);
    internalPending.delete(k);
  }

  function shouldSuppressStorageEvent(event: StorageChangeEvent): boolean {
    if (event.kind !== "set") return false;
    const k = internalWriteKey(event.namespace as any, event.key);
    if (internalPending.has(k)) {
      if (event.version) internalWrites.set(k, event.version);
      internalPending.delete(k);
      return true;
    }
    if (!event.version) return false;
    const expected = internalWrites.get(k);
    if (!expected) return false;
    if (expected !== event.version) return false;
    internalWrites.delete(k);
    return true;
  }

  async function handleStorageEvent(event: StorageChangeEvent): Promise<void> {
    if (!event.key.startsWith("settings/source/")) return;
    if (shouldSuppressStorageEvent(event)) return;
    const source = event.key.slice("settings/source/".length) as SettingsSource;
    if (!source) return;
    await emitUpdate(source);
  }

  function subscribeStorage(): void {
    if (!storage.subscribe) return;
    const appUnsub = storage.subscribe({ scope: "app" }, (e: StorageChangeEvent) => {
      void handleStorageEvent(e);
    });
    unsubscribers.push(appUnsub);

    if (ctx.workspaceId) {
      const wsUnsub = storage.subscribe({ scope: "workspace", workspaceId: ctx.workspaceId }, (e: StorageChangeEvent) => {
        void handleStorageEvent(e);
      });
      unsubscribers.push(wsUnsub);
    }

    if (ctx.sessionId) {
      const sessUnsub = storage.subscribe({ scope: "session", sessionId: ctx.sessionId }, (e: StorageChangeEvent) => {
        void handleStorageEvent(e);
      });
      unsubscribers.push(sessUnsub);
    }
  }

  return {
    initialize: async () => {
      subscribeStorage();
      await emitUpdate(null);
    },
    dispose: () => {
      for (const u of unsubscribers) u();
      unsubscribers.length = 0;
      bus.clear();
    },
    subscribe: (handler) => bus.subscribe(handler),
    notifyChange: async (source) => {
      await emitUpdate(source);
    },
    getEffective: () => effective,
    getEffectiveConfig: () => effectiveConfig,
    setAllowedSources: async (allowed) => {
      allowedSources = allowed;
      await emitUpdate(null);
    },
    setOverlay: async (source, settings) => {
      overlays[source] = settings;
      await emitUpdate(source);
    },
    patchSource: async (source, patch) => {
      const current = await readSettingsSourceFromStorage(storage, source, ctx);
      const currentSettings = current.settings ?? {};
      const parsed = isPlainObject(currentSettings) ? (currentSettings as JsonObject) : {};
      const next = applySettingsPatch(parsed, patch);

      const ns = namespaceForSettingsSource(source, ctx);
      const k = internalWriteKey(ns, settingsStorageKey(source));
      internalPending.add(k);
      const doc = createSettingsDocumentFromObject(next);
      const res = await writeSettingsSourceToStorage(storage, source, ctx, doc, { expectedVersion: current.storageVersion ?? null });
      if (!res.ok) {
        internalPending.delete(k);
        return { ok: false, errors: [res.error] };
      }
      markInternalWrite(source, res.version);
      await emitUpdate(source);
      return { ok: true };
    },
    updateSource: async (source, updater) => {
      const current = await readSettingsSourceFromStorage(storage, source, ctx);
      const currentSettings = current.settings ?? {};
      const parsed = isPlainObject(currentSettings) ? (currentSettings as JsonObject) : {};
      const next = updater(parsed);
      if (!isPlainObject(next)) {
        return {
          ok: false,
          errors: [{ kind: "validation_error", source, message: "Settings updater must return a plain object", severity: "error" }]
        };
      }

      const ns = namespaceForSettingsSource(source, ctx);
      const k = internalWriteKey(ns, settingsStorageKey(source));
      internalPending.add(k);
      const doc = createSettingsDocumentFromObject(next);
      const res = await writeSettingsSourceToStorage(storage, source, ctx, doc, { expectedVersion: current.storageVersion ?? null });
      if (!res.ok) {
        internalPending.delete(k);
        return { ok: false, errors: [res.error] };
      }
      markInternalWrite(source, res.version);
      await emitUpdate(source);
      return { ok: true };
    }
  };
}
