import type { JsonObject } from "../types/json.js";
import type { EffectiveSettingsResult, SettingsError, SettingsSourceReadResult, SettingsPolicyOrigin } from "./types.js";

export type SettingsDoctorReport = {
  policyOrigin: SettingsPolicyOrigin;
  hasErrors: boolean;
  errors: SettingsError[];
  perSource: Array<{ source: SettingsSourceReadResult["source"]; status: "missing" | "ok" | "invalid"; errorCount: number }>;
  policyOverrides: Array<{ pointer: string; overriddenSources: string[] }>;
};

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function enumeratePointers(obj: JsonObject, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const pointer = `${prefix}/${k}`;
    out.push(pointer);
    if (isPlainObject(v)) out.push(...enumeratePointers(v, pointer));
  }
  return out;
}

function getPointerValue(obj: JsonObject, pointer: string): unknown {
  const parts = pointer.split("/").slice(1);
  let cur: unknown = obj;
  for (const part of parts) {
    if (!isPlainObject(cur)) return undefined;
    cur = cur[part];
  }
  return cur;
}

function jsonStableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return JSON.stringify(value.map((v) => JSON.parse(jsonStableStringify(v))));
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const normalized: Record<string, unknown> = {};
  for (const k of keys) normalized[k] = JSON.parse(jsonStableStringify(obj[k]));
  return JSON.stringify(normalized);
}

export function buildSettingsDoctorReport(effective: EffectiveSettingsResult): SettingsDoctorReport {
  const errors = effective.errors;
  const perSource: SettingsDoctorReport["perSource"] = [];
  for (const src of Object.values(effective.perSource)) {
    if (!src) continue;
    const status = src.settings === null && src.errors.length === 0 ? "missing" : src.errors.length > 0 ? "invalid" : "ok";
    perSource.push({ source: src.source, status, errorCount: src.errors.length });
  }
  perSource.sort((a, b) => a.source.localeCompare(b.source));

  const policy = effective.perSource.policySettings?.settings ?? null;
  const policyOverrides: SettingsDoctorReport["policyOverrides"] = [];
  if (policy && effective.policyOrigin !== "invalid") {
    const pointers = enumeratePointers(policy);
    const overriddenByPointer = new Map<string, Set<string>>();

    for (const pointer of pointers) {
      const policyValue = getPointerValue(policy, pointer);
      if (policyValue === undefined) continue;
      const overriddenSources = new Set<string>();
      for (const [source, src] of Object.entries(effective.perSource)) {
        if (!src?.settings) continue;
        if (source === "policySettings") continue;
        const srcValue = getPointerValue(src.settings, pointer);
        if (srcValue === undefined) continue;
        if (jsonStableStringify(srcValue) !== jsonStableStringify(policyValue)) overriddenSources.add(source);
      }
      if (overriddenSources.size > 0) overriddenByPointer.set(pointer, overriddenSources);
    }

    for (const [pointer, sources] of overriddenByPointer) {
      policyOverrides.push({ pointer, overriddenSources: Array.from(sources).sort() });
    }
    policyOverrides.sort((a, b) => a.pointer.localeCompare(b.pointer));
  }

  return {
    policyOrigin: effective.policyOrigin,
    hasErrors: errors.length > 0 || effective.policyOrigin === "invalid",
    errors,
    perSource,
    policyOverrides
  };
}
