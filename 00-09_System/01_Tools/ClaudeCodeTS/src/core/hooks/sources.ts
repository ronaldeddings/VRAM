import type { JsonObject } from "../types/json.js";
import type { EffectiveConfig } from "../settings/effectiveConfig.js";
import type { HookConfigError, HookSource, HooksConfigInput } from "./types.js";
import { normalizeHooksConfig } from "./normalize.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type HookSourcesInput = {
  effectiveSettings: JsonObject;
  policySettings: JsonObject | null;
  effectiveConfig: EffectiveConfig;
  pluginHooks?: HooksConfigInput | null;
  sessionHooks?: HooksConfigInput | null;
};

export type ResolvedHooksConfig = {
  canonical: string;
  errors: HookConfigError[];
  hooks: import("./types.js").HooksConfig;
};

function readHooksField(settings: JsonObject): HooksConfigInput | null {
  const hooks = settings.hooks;
  if (!hooks) return null;
  if (!isPlainObject(hooks)) return null;
  return hooks as HooksConfigInput;
}

function mergeHooksObjects(objects: Array<{ source: HookSource; hooks: HooksConfigInput | null }>): HooksConfigInput {
  const out: HooksConfigInput = {};
  for (const { hooks } of objects) {
    if (!hooks) continue;
    for (const [k, v] of Object.entries(hooks)) {
      const existing = (out as any)[k];
      if (!existing) {
        (out as any)[k] = v;
        continue;
      }
      if (Array.isArray(existing) && Array.isArray(v)) {
        (out as any)[k] = [...existing, ...v];
        continue;
      }
      (out as any)[k] = v;
    }
  }
  return out;
}

export function resolveHooksConfig(input: HookSourcesInput): ResolvedHooksConfig {
  const errors: HookConfigError[] = [];

  const disabled = input.effectiveConfig.hooks.disabled;
  if (disabled) {
    const empty = normalizeHooksConfig({}, { source: "settings" });
    return { canonical: empty.canonical, errors, hooks: {} };
  }

  const managedOnly = input.effectiveConfig.hooks.managedOnly;
  const settingsHooks = readHooksField(input.effectiveSettings);
  const policyHooks = input.policySettings && isPlainObject(input.policySettings) ? readHooksField(input.policySettings) : null;
  const pluginHooks = input.pluginHooks ?? null;
  const sessionHooks = input.sessionHooks ?? null;

  const mergedInput = managedOnly
    ? mergeHooksObjects([{ source: "policy", hooks: policyHooks }])
    : mergeHooksObjects([
        { source: "settings", hooks: settingsHooks },
        { source: "plugin", hooks: pluginHooks },
        { source: "session", hooks: sessionHooks },
        { source: "policy", hooks: policyHooks }
      ]);

  const normalized = normalizeHooksConfig(mergedInput, { source: "settings" });
  errors.push(...normalized.errors);
  return { canonical: normalized.canonical, errors, hooks: normalized.config };
}

