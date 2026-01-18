import type { JsonObject } from "../types/json.js";
import type { EffectiveSettingsResult, SettingsSource } from "../settings/types.js";
import { normalizePermissionMode } from "./modes.js";
import type { PermissionDiagnostic, PermissionPolicySnapshot, ToolPermissionContext } from "./types.js";
import { LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE } from "./sources.js";
import { normalizeWorkingDirectoryPath } from "./workingDirs.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(obj: JsonObject, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
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

export type PermissionsSettingsFragment = {
  defaultMode?: string;
  allow: string[];
  deny: string[];
  ask: string[];
  additionalDirectories: string[];
  bypassPermissionsModeAvailable?: boolean;
};

export function readPermissionsSettingsFragment(settings: JsonObject): PermissionsSettingsFragment {
  const permissionsRaw = settings["permissions"];
  const permissions = permissionsRaw && isPlainObject(permissionsRaw) ? permissionsRaw : null;
  if (!permissions) {
    return { allow: [], deny: [], ask: [], additionalDirectories: [] };
  }
  const defaultMode = readString(permissions, "defaultMode");
  const bypassPermissionsModeAvailable = readBoolean(permissions, "bypassPermissionsModeAvailable");
  return {
    ...(defaultMode !== null ? { defaultMode } : {}),
    allow: readStringArray(permissions, "allow") ?? [],
    deny: readStringArray(permissions, "deny") ?? [],
    ask: readStringArray(permissions, "ask") ?? [],
    additionalDirectories: readStringArray(permissions, "additionalDirectories") ?? [],
    ...(bypassPermissionsModeAvailable !== null ? { bypassPermissionsModeAvailable } : {})
  };
}

export function createEmptyToolPermissionContext(): ToolPermissionContext {
  return {
    mode: "default",
    additionalWorkingDirectories: new Map(),
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: false
  };
}

export type BuildToolPermissionContextOptions = {
  overrides?: Partial<Pick<ToolPermissionContext, "mode" | "isBypassPermissionsModeAvailable">>;
};

export function buildToolPermissionContextFromSettings(
  effective: EffectiveSettingsResult,
  policy: PermissionPolicySnapshot,
  options: BuildToolPermissionContextOptions = {}
): { ctx: ToolPermissionContext; diagnostics: PermissionDiagnostic[] } {
  const diagnostics: PermissionDiagnostic[] = [];

  const merged = effective.settings;
  const mergedPermissions = readPermissionsSettingsFragment(merged);

  const normalizedMode = normalizePermissionMode(mergedPermissions.defaultMode ?? undefined);
  diagnostics.push(...normalizedMode.diagnostics);

  const ctx: ToolPermissionContext = createEmptyToolPermissionContext();
  ctx.mode = options.overrides?.mode ?? normalizedMode.mode;

  const bypassAvailableFromSettings = mergedPermissions.bypassPermissionsModeAvailable ?? false;
  ctx.isBypassPermissionsModeAvailable = options.overrides?.isBypassPermissionsModeAvailable ?? bypassAvailableFromSettings;

  if (!policy.allowBypassPermissionsMode && (ctx.mode === "bypassPermissions" || ctx.mode === "plan")) {
    ctx.mode = "default";
    diagnostics.push({ kind: "unknown_permission_mode", input: "policy_disallowed_bypass_or_plan", normalizedTo: "default" });
  }

  for (const source of LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE) {
    const per = effective.perSource[source as SettingsSource]?.settings ?? null;
    const settings = per && isPlainObject(per) ? (per as JsonObject) : null;
    const frag = settings ? readPermissionsSettingsFragment(settings) : { allow: [], deny: [], ask: [], additionalDirectories: [] };

    ctx.alwaysAllowRules[source] = frag.allow.slice();
    ctx.alwaysDenyRules[source] = frag.deny.slice();
    ctx.alwaysAskRules[source] = frag.ask.slice();

    for (const dir of frag.additionalDirectories) {
      const norm = normalizeWorkingDirectoryPath(dir);
      if (!norm.ok) {
        diagnostics.push(...norm.diagnostics);
        continue;
      }
      ctx.additionalWorkingDirectories.set(norm.path, { path: norm.path, source });
    }
  }

  return { ctx, diagnostics };
}
