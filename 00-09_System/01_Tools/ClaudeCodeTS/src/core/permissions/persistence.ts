import type { JsonObject } from "../types/json.js";
import type { SettingsManager } from "../settings/manager.js";
import type { SettingsError, WritableSettingsSource } from "../settings/types.js";
import type { PermissionAuditEvent, PermissionDiagnostic, PermissionPolicySnapshot, PermissionRuleBehavior, PermissionScope, PermissionUpdate } from "./types.js";
import { formatPermissionRuleValue } from "./rules.js";
import { normalizeWorkingDirectoryPath } from "./workingDirs.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJsonObject(obj: JsonObject): JsonObject {
  const out: JsonObject = {};
  for (const [k, v] of Object.entries(obj)) out[k] = v;
  return out;
}

function ensurePermissionsObject(settings: JsonObject): JsonObject {
  const cur = settings.permissions;
  if (isPlainObject(cur)) return cur;
  const next: JsonObject = {};
  settings.permissions = next;
  return next;
}

function readStringArrayFromPermissions(permissions: JsonObject, key: string): string[] {
  const v = permissions[key];
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) if (typeof item === "string") out.push(item);
  return out;
}

function writeRuleArray(permissions: JsonObject, behavior: PermissionRuleBehavior, next: string[]): void {
  const key = behavior === "allow" ? "allow" : behavior === "deny" ? "deny" : "ask";
  permissions[key] = next;
}

function applyRuleUpdate(
  permissions: JsonObject,
  update: Extract<PermissionUpdate, { type: "addRules" | "replaceRules" | "removeRules" }>
): void {
  const key = update.behavior === "allow" ? "allow" : update.behavior === "deny" ? "deny" : "ask";
  const existing = readStringArrayFromPermissions(permissions, key);
  const delta = update.rules.map((r) => formatPermissionRuleValue(r));

  if (update.type === "replaceRules") {
    permissions[key] = delta;
    return;
  }
  if (update.type === "addRules") {
    permissions[key] = [...existing, ...delta];
    return;
  }
  const removeSet = new Set(delta);
  permissions[key] = existing.filter((r) => !removeSet.has(r));
}

function applyDirectoryUpdate(
  permissions: JsonObject,
  update: Extract<PermissionUpdate, { type: "addDirectories" | "removeDirectories" }>
): PermissionDiagnostic[] {
  const diagnostics: PermissionDiagnostic[] = [];
  const existingRaw = readStringArrayFromPermissions(permissions, "additionalDirectories");
  const normalizedExisting: string[] = [];
  for (const d of existingRaw) {
    const norm = normalizeWorkingDirectoryPath(d);
    if (!norm.ok) continue;
    normalizedExisting.push(norm.path);
  }

  const next = new Set(normalizedExisting);
  if (update.type === "addDirectories") {
    for (const d of update.directories) {
      const norm = normalizeWorkingDirectoryPath(d);
      if (!norm.ok) {
        diagnostics.push(...norm.diagnostics);
        continue;
      }
      next.add(norm.path);
    }
  } else {
    for (const d of update.directories) {
      const norm = normalizeWorkingDirectoryPath(d);
      if (!norm.ok) {
        diagnostics.push(...norm.diagnostics);
        continue;
      }
      next.delete(norm.path);
    }
  }

  permissions.additionalDirectories = [...next.values()].sort((a, b) => a.localeCompare(b));
  return diagnostics;
}

export function applyPermissionUpdateToSettingsObject(
  current: JsonObject,
  update: PermissionUpdate
): { next: JsonObject; diagnostics: PermissionDiagnostic[] } {
  const next = cloneJsonObject(current);
  const diagnostics: PermissionDiagnostic[] = [];

  if (update.type === "setMode") {
    const permissions = ensurePermissionsObject(next);
    permissions.defaultMode = update.mode;
    return { next, diagnostics };
  }

  if (update.type === "addRules" || update.type === "replaceRules" || update.type === "removeRules") {
    const permissions = ensurePermissionsObject(next);
    applyRuleUpdate(permissions, update);
    return { next, diagnostics };
  }

  if (update.type === "addDirectories" || update.type === "removeDirectories") {
    const permissions = ensurePermissionsObject(next);
    diagnostics.push(...applyDirectoryUpdate(permissions, update));
    return { next, diagnostics };
  }

  return { next, diagnostics };
}

function isWritableDestination(dest: PermissionScope): dest is WritableSettingsSource {
  return dest === "userSettings" || dest === "projectSettings" || dest === "localSettings";
}

function destinationSortKey(dest: WritableSettingsSource): number {
  if (dest === "userSettings") return 1;
  if (dest === "projectSettings") return 2;
  return 3;
}

export type PersistPermissionUpdatesResult =
  | { ok: true; diagnostics: PermissionDiagnostic[]; audits: PermissionAuditEvent[] }
  | { ok: false; errors: SettingsError[]; diagnostics: PermissionDiagnostic[]; audits: PermissionAuditEvent[] };

export async function persistPermissionUpdates(options: {
  manager: SettingsManager;
  updates: PermissionUpdate[];
  policy: PermissionPolicySnapshot;
  actor: PermissionAuditEvent["actor"];
  nowWallMs: number;
  workspaceId?: string;
  sessionId?: string;
}): Promise<PersistPermissionUpdatesResult> {
  const diagnostics: PermissionDiagnostic[] = [];
  const audits: PermissionAuditEvent[] = [];

  const byDest = new Map<WritableSettingsSource, PermissionUpdate[]>();
  for (const u of options.updates) {
    if (u.destination === "session") continue;
    if (!isWritableDestination(u.destination)) continue;
    const list = byDest.get(u.destination) ?? [];
    list.push(u);
    byDest.set(u.destination, list);
  }

  const destinations = [...byDest.keys()].sort((a, b) => destinationSortKey(a) - destinationSortKey(b));
  const written: WritableSettingsSource[] = [];
  const rollbackSnapshots = new Map<WritableSettingsSource, JsonObject>();

  const errors: SettingsError[] = [];

  for (const dest of destinations) {
    if (options.policy.canPersistTo[dest] !== true) {
      errors.push({ kind: "unsupported", source: dest, message: `Policy forbids writing permission updates to ${dest}` });
    }
  }
  if (errors.length > 0) return { ok: false, errors, diagnostics, audits };

  for (const dest of destinations) {
    const destUpdates = byDest.get(dest) ?? [];
    const beforeSnapshot = options.manager.getEffective().perSource[dest]?.settings ?? {};
    const beforeObj = beforeSnapshot && isPlainObject(beforeSnapshot) ? (beforeSnapshot as JsonObject) : {};
    rollbackSnapshots.set(dest, beforeObj);

    const updater = (cur: JsonObject) => {
      let next = cur;
      for (const u of destUpdates) {
        const applied = applyPermissionUpdateToSettingsObject(next, u);
        diagnostics.push(...applied.diagnostics);
        next = applied.next;
      }
      return next;
    };

    const res = await options.manager.updateSource(dest, updater);
    if (!res.ok) {
      errors.push(...res.errors);
      break;
    }
    written.push(dest);

    let afterPreview = beforeObj;
    for (const u of destUpdates) afterPreview = applyPermissionUpdateToSettingsObject(afterPreview, u).next;

    audits.push({
      schemaVersion: 1,
      type: "permission/updated",
      occurredAtWallMs: options.nowWallMs,
      ...(options.workspaceId !== undefined ? { workspaceId: options.workspaceId } : {}),
      ...(options.sessionId !== undefined ? { sessionId: options.sessionId } : {}),
      actor: options.actor,
      destination: dest,
      updates: destUpdates,
      preview: { before: beforeObj, after: afterPreview },
      policyConstraintsApplied: []
    });
  }

  if (errors.length > 0) {
    for (const dest of written.reverse()) {
      const beforeObj = rollbackSnapshots.get(dest) ?? {};
      await options.manager.updateSource(dest, () => beforeObj);
    }
    return { ok: false, errors, diagnostics, audits };
  }

  return { ok: true, diagnostics, audits };
}
