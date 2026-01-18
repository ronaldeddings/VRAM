import type { JsonObject, JsonValue } from "../types/json.js";

export type SettingsPatchValue = JsonValue | SettingsPatchObject | undefined;
export type SettingsPatchObject = { [key: string]: SettingsPatchValue };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJsonObject(obj: JsonObject): JsonObject {
  const out: JsonObject = {};
  for (const [k, v] of Object.entries(obj)) out[k] = v;
  return out;
}

export function applySettingsPatch(base: JsonObject, patch: SettingsPatchObject): JsonObject {
  const out = cloneJsonObject(base);
  for (const [key, rawPatchValue] of Object.entries(patch)) {
    const patchValue = rawPatchValue as unknown;

    if (patchValue === undefined) {
      delete out[key];
      continue;
    }

    if (Array.isArray(patchValue)) {
      out[key] = patchValue as unknown as JsonValue;
      continue;
    }

    if (isPlainObject(patchValue)) {
      const baseVal = out[key];
      if (isPlainObject(baseVal)) {
        out[key] = applySettingsPatch(baseVal as JsonObject, patchValue as SettingsPatchObject);
      } else {
        out[key] = patchValue as unknown as JsonValue;
      }
      continue;
    }

    out[key] = patchValue as JsonValue;
  }
  return out;
}

