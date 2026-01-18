import { canonicalJsonStringify } from "../types/canonicalJson.js";

export type LegacyAsyncHookInitialJson = { async: true; asyncTimeout?: number };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLegacyAsyncHookInitialStdout(stdout: string): { kind: "plain" } | { kind: "json"; value: LegacyAsyncHookInitialJson } {
  const trimmed = stdout.trim();
  if (!trimmed.startsWith("{")) return { kind: "plain" };

  if (!trimmed.includes("}")) return { kind: "plain" };
  try {
    const obj = JSON.parse(trimmed) as unknown;
    if (!isPlainObject(obj)) return { kind: "plain" };
    if (obj.async !== true) return { kind: "plain" };
    const asyncTimeout = obj.asyncTimeout;
    return {
      kind: "json",
      value: { async: true, ...(typeof asyncTimeout === "number" ? { asyncTimeout } : {}) }
    };
  } catch {
    return { kind: "plain" };
  }
}

export type LegacyAsyncTimeoutPolicy = {
  defaultTimeoutMs: number;
  minTimeoutMs: number;
  maxTimeoutMs: number;
};

export function normalizeLegacyAsyncTimeoutMs(
  initial: LegacyAsyncHookInitialJson,
  policy: LegacyAsyncTimeoutPolicy
): { timeoutMs: number; report: string } {
  const raw = typeof initial.asyncTimeout === "number" ? initial.asyncTimeout : undefined;
  const chosenSeconds = raw ?? Math.round(policy.defaultTimeoutMs / 1000);
  const ms = Math.round(chosenSeconds * 1000);
  const clamped = Math.min(policy.maxTimeoutMs, Math.max(policy.minTimeoutMs, ms));
  return {
    timeoutMs: clamped,
    report: canonicalJsonStringify({ asyncTimeoutSeconds: raw ?? null, chosenMs: ms, clampedMs: clamped })
  };
}

