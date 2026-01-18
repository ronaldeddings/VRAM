import type { JsonArray, JsonObject, JsonPrimitive, JsonValue } from "../types/json.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPrimitive(value: JsonValue): value is JsonPrimitive {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

export function unionDedupePreserveOrder(a: JsonArray, b: JsonArray): JsonArray {
  const out: JsonArray = [...a];
  const seen = new Set<string | number | boolean | null>();
  for (const item of a) {
    if (isPrimitive(item)) seen.add(item);
  }
  for (const item of b) {
    if (isPrimitive(item)) {
      if (seen.has(item)) continue;
      seen.add(item);
      out.push(item);
    } else {
      out.push(item);
    }
  }
  return out;
}

export function mergeJsonValue(base: JsonValue, next: JsonValue): JsonValue {
  if (Array.isArray(base) && Array.isArray(next)) return unionDedupePreserveOrder(base, next);
  if (isPlainObject(base) && isPlainObject(next)) return mergeJsonObject(base, next);
  return next;
}

export function mergeJsonObject(base: JsonObject, next: JsonObject): JsonObject {
  const out: JsonObject = { ...base };
  for (const [key, nextVal] of Object.entries(next)) {
    const baseVal = out[key];
    if (baseVal === undefined) {
      out[key] = nextVal;
      continue;
    }
    out[key] = mergeJsonValue(baseVal, nextVal);
  }
  return out;
}

export function mergeSettingsObjectsInOrder(objects: readonly JsonObject[]): JsonObject {
  let out: JsonObject = {};
  for (const obj of objects) out = mergeJsonObject(out, obj);
  return out;
}

export const LEGACY_SETTINGS_MERGE_NOTES = {
  objects: "deep-merge",
  arrays: "union-dedupe-preserve-order (primitive-only dedupe, legacy Set-like)",
  patches: "arrays-replace, delete-on-undefined"
} as const;

export type SettingsMergeFieldExpectation = {
  pointer: string;
  merge: "deep" | "replace";
  arrays: "union" | "replace";
  patchArrays: "replace";
  notes?: string;
};

export const LEGACY_SETTINGS_MERGE_FIELD_EXPECTATIONS: readonly SettingsMergeFieldExpectation[] = [
  {
    pointer: "/permissions",
    merge: "deep",
    arrays: "union",
    patchArrays: "replace",
    notes: "Permission rules are evaluated per-source later; the merged view is for defaults and UI display."
  },
  { pointer: "/hooks", merge: "deep", arrays: "union", patchArrays: "replace", notes: "Hook config merges across sources; policy may gate." },
  { pointer: "/mcp", merge: "deep", arrays: "union", patchArrays: "replace", notes: "MCP subtree merges across sources; later phases validate." }
] as const;
