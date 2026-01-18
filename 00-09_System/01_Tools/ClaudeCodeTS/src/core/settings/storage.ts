import type { JsonObject } from "../types/json.js";
import type { HostStorage, StorageNamespace } from "../types/host.js";
import { StorageConflictError } from "../types/host.js";
import type { WorkspaceId } from "../types/workspace.js";
import { parseSettingsJson, serializeSettingsDocument, type SettingsDocumentV1 } from "./schema.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { FileBackedSettingsSource, SettingsError, SettingsSource, SettingsSourceReadResult, SettingsPolicyOrigin } from "./types.js";

export type SettingsStorageContext = {
  workspaceId?: WorkspaceId;
  sessionId?: string;
};

export const SETTINGS_STORAGE_KEY_PREFIX = "settings/source/";

export function settingsStorageKey(source: SettingsSource): string {
  return `${SETTINGS_STORAGE_KEY_PREFIX}${source}`;
}

export function namespaceForSettingsSource(source: SettingsSource, ctx: SettingsStorageContext): StorageNamespace {
  switch (source) {
    case "userSettings":
    case "policySettings":
      return { scope: "app" };
    case "projectSettings":
    case "localSettings":
      return ctx.workspaceId ? { scope: "workspace", workspaceId: ctx.workspaceId } : { scope: "workspace" };
    case "flagSettings":
      return ctx.sessionId ? { scope: "session", sessionId: ctx.sessionId } : { scope: "session" };
    case "cliArg":
    case "command":
    case "session":
      return ctx.sessionId ? { scope: "session", sessionId: ctx.sessionId } : { scope: "session" };
  }
}

function originFromDoc(doc: SettingsDocumentV1 | null, source: SettingsSource): SettingsPolicyOrigin | undefined {
  if (source !== "policySettings") return undefined;
  if (!doc) return "absent";
  const origin = doc.meta?.origin;
  if (origin === "remote") return "remote";
  return "local";
}

export async function readSettingsSourceFromStorage(
  storage: HostStorage,
  source: SettingsSource,
  ctx: SettingsStorageContext
): Promise<SettingsSourceReadResult> {
  const ns = namespaceForSettingsSource(source, ctx);
  const key = settingsStorageKey(source);

  if ((ns.scope === "workspace" && !ns.workspaceId) || (ns.scope === "session" && !ns.sessionId)) {
    return {
      source,
      settings: null,
      errors: [{ kind: "validation_error", source, message: `Missing required namespace context for ${source}`, severity: "error" }]
    };
  }

  try {
    const rec = await storage.get(ns, key);
    if (!rec) {
      const doc: SettingsDocumentV1 | null = null;
      const origin = originFromDoc(doc, source);
      return {
        source,
        settings: null,
        errors: [],
        ...(origin ? { origin } : {}),
        storageVersion: null
      };
    }

    const parsed = parseSettingsJson(rec.value, source);
    const origin = originFromDoc(parsed.document, source);
    return {
      source,
      settings: parsed.document?.settings ?? null,
      errors: parsed.errors,
      ...(origin ? { origin } : {}),
      storageVersion: rec.version
    };
  } catch (cause) {
    return {
      source,
      settings: null,
      errors: [{ kind: "io_error", source, message: "Failed to read settings from storage", cause, severity: "error" }]
    };
  }
}

export async function writeSettingsSourceToStorage(
  storage: HostStorage,
  source: SettingsSource,
  ctx: SettingsStorageContext,
  doc: SettingsDocumentV1,
  options?: { expectedVersion?: string | null }
): Promise<{ ok: true; version: string } | { ok: false; error: SettingsError }> {
  const ns = namespaceForSettingsSource(source, ctx);
  const key = settingsStorageKey(source);

  if ((ns.scope === "workspace" && !ns.workspaceId) || (ns.scope === "session" && !ns.sessionId)) {
    return {
      ok: false,
      error: { kind: "validation_error", source, message: `Missing required namespace context for ${source}`, severity: "error" }
    };
  }

  try {
    const value = serializeSettingsDocument(doc);
    const res = await storage.set(
      ns,
      key,
      value,
      options?.expectedVersion === undefined ? undefined : { expectedVersion: options.expectedVersion }
    );
    return { ok: true, version: res.version };
  } catch (error) {
    if (error instanceof StorageConflictError) {
      return { ok: false, error: { kind: "conflict", source, message: "Settings write conflict", cause: error, severity: "error" } };
    }
    return { ok: false, error: { kind: "io_error", source, message: "Failed to write settings to storage", cause: error, severity: "error" } };
  }
}

export function createSettingsDocumentFromObject(settings: JsonObject, meta?: SettingsDocumentV1["meta"]): SettingsDocumentV1 {
  return {
    kind: "settings_document",
    schemaVersion: SCHEMA_VERSION.settingsDocument,
    settings,
    ...(meta ? { meta } : {})
  };
}

export function isFileBackedSettingsSource(source: SettingsSource): source is FileBackedSettingsSource {
  return (
    source === "userSettings" ||
    source === "projectSettings" ||
    source === "localSettings" ||
    source === "policySettings" ||
    source === "flagSettings"
  );
}
