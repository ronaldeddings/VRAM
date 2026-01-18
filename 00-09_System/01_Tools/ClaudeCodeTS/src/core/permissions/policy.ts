import type { JsonObject } from "../types/json.js";
import type { EffectiveSettingsResult, WritableSettingsSource } from "../settings/types.js";
import type { PermissionPolicySnapshot } from "./types.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readBoolean(obj: JsonObject, key: string): boolean | null {
  const v = obj[key];
  return typeof v === "boolean" ? v : null;
}

function readStringArray(obj: JsonObject, key: string): string[] | null {
  const v = obj[key];
  if (!Array.isArray(v)) return null;
  const out: string[] = [];
  for (const item of v) if (typeof item === "string") out.push(item);
  return out;
}

function readNested(obj: JsonObject, key: string): JsonObject | null {
  const v = obj[key];
  if (!isPlainObject(v)) return null;
  return v;
}

function defaultCanPersistTo(): Record<WritableSettingsSource, boolean> {
  return { userSettings: true, projectSettings: true, localSettings: true };
}

function applyDestinationRestrictions(
  canPersistTo: Record<WritableSettingsSource, boolean>,
  restrictTo: string[] | null
): Record<WritableSettingsSource, boolean> {
  if (!restrictTo) return canPersistTo;
  const allowed = new Set(restrictTo);
  return {
    userSettings: allowed.has("userSettings"),
    projectSettings: allowed.has("projectSettings"),
    localSettings: allowed.has("localSettings")
  };
}

export function computePermissionPolicySnapshot(effective: EffectiveSettingsResult): PermissionPolicySnapshot {
  const policyOrigin = effective.policyOrigin;
  const policySettingsRaw = effective.perSource.policySettings?.settings ?? null;
  const policySettings = policySettingsRaw && isPlainObject(policySettingsRaw) ? policySettingsRaw : null;

  const managedOnly = (policySettings ? readBoolean(policySettings, "allowManagedHooksOnly") : null) ?? false;

  const permissionsObj = policySettings ? readNested(policySettings, "permissions") : null;
  const restrictPersistenceDestinations = permissionsObj ? readStringArray(permissionsObj, "restrictPersistenceDestinations") : null;

  const allowBypassPermissionsMode = (permissionsObj ? readBoolean(permissionsObj, "allowBypassPermissionsMode") : null) ?? true;
  const allowSandboxOverride = (permissionsObj ? readBoolean(permissionsObj, "allowSandboxOverride") : null) ?? true;
  const allowLocalNetwork = (permissionsObj ? readBoolean(permissionsObj, "allowLocalNetwork") : null) ?? true;

  if (policyOrigin === "invalid") {
    return {
      schemaVersion: 1,
      policyOrigin,
      managedOnly: true,
      canPersistTo: { userSettings: false, projectSettings: false, localSettings: false },
      allowBypassPermissionsMode: false,
      allowSandboxOverride: false,
      allowLocalNetwork: false
    };
  }

  return {
    schemaVersion: 1,
    policyOrigin,
    managedOnly,
    canPersistTo: applyDestinationRestrictions(defaultCanPersistTo(), restrictPersistenceDestinations),
    allowBypassPermissionsMode,
    allowSandboxOverride,
    allowLocalNetwork
  };
}

