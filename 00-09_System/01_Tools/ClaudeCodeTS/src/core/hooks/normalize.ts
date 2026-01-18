import { canonicalJsonStringify } from "../types/canonicalJson.js";
import type {
  HookConfigDiffReport,
  HookConfigError,
  HookDefinition,
  HookEventName,
  HookMatcher,
  HookSource,
  HooksConfig
} from "./types.js";
import { compileMatcher } from "./matchers.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    out[k] = v;
  }
  return out as Partial<T>;
}

function stripUndefinedDeep(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (const item of value) {
      const next = stripUndefinedDeep(item);
      if (next === undefined) continue;
      out.push(next);
    }
    return out;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const next = stripUndefinedDeep(v);
      if (next === undefined) continue;
      out[k] = next;
    }
    return out;
  }
  return String(value);
}

function stableStringHash(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = (Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)) >>> 0;
  h2 = (Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)) >>> 0;
  return (h2.toString(16).padStart(8, "0") + h1.toString(16).padStart(8, "0")).slice(0, 16);
}

function inferHookId(def: HookDefinition, seed: unknown): string {
  if (def.hookId) return def.hookId;
  const key = canonicalJsonStringify(seed);
  return `hk_${stableStringHash(key)}`;
}

function normalizeHookDefinition(
  raw: unknown,
  options: { source: HookSource; eventName: HookEventName; matcherIndex: number; hookIndex: number }
): { hook: HookDefinition | null; errors: HookConfigError[] } {
  const errors: HookConfigError[] = [];
  if (!isPlainObject(raw)) {
    errors.push({
      kind: "validation_error",
      source: options.source,
      eventName: options.eventName,
      message: "Hook definition must be an object",
      pointer: `/hooks/${options.eventName}/${options.matcherIndex}/hooks/${options.hookIndex}`
    });
    return { hook: null, errors };
  }

  const type = raw.type;
  if (type !== "workflow" && type !== "command" && type !== "prompt" && type !== "agent") {
    errors.push({
      kind: "validation_error",
      source: options.source,
      eventName: options.eventName,
      message: "Unknown hook type",
      pointer: `/hooks/${options.eventName}/${options.matcherIndex}/hooks/${options.hookIndex}/type`,
      details: { type }
    });
    return { hook: null, errors };
  }

  const base = {
    type,
    source: options.source,
    definitionVersion: readNumber(raw.definitionVersion) ?? 1,
    priority: readNumber(raw.priority) ?? 0,
    maxRunsPerSession: readNumber(raw.maxRunsPerSession),
    cooldownMs: readNumber(raw.cooldownMs),
    concurrency: raw.concurrency === "parallel" ? "parallel" : "sequential",
    budget:
      isPlainObject(raw.budget) && (raw.budget.timeoutMs !== undefined || raw.budget.maxToolCalls !== undefined)
        ? {
            ...(typeof raw.budget.timeoutMs === "number" ? { timeoutMs: raw.budget.timeoutMs } : {}),
            ...(typeof raw.budget.maxToolCalls === "number" ? { maxToolCalls: raw.budget.maxToolCalls } : {})
          }
        : undefined
  } as const;

  if (type === "workflow") {
    const actionsRaw = raw.actions;
    if (!Array.isArray(actionsRaw)) {
      errors.push({
        kind: "validation_error",
        source: options.source,
        eventName: options.eventName,
        message: "workflow hook requires an actions array",
        pointer: `/hooks/${options.eventName}/${options.matcherIndex}/hooks/${options.hookIndex}/actions`
      });
      return { hook: null, errors };
    }
    const hookId = inferHookId({ type: "workflow" } as any, { ...raw, source: options.source, event: options.eventName });
    return {
      hook: {
        ...(omitUndefined({ ...base }) as any),
        hookId,
        type: "workflow",
        actions: actionsRaw as any,
        ...(raw.allowNestedToolRuns === true ? { allowNestedToolRuns: true } : {})
      },
      errors
    };
  }

  if (type === "command") {
    const command = typeof raw.command === "string" ? raw.command : null;
    if (!command) {
      errors.push({
        kind: "validation_error",
        source: options.source,
        eventName: options.eventName,
        message: "command hook requires a command string",
        pointer: `/hooks/${options.eventName}/${options.matcherIndex}/hooks/${options.hookIndex}/command`
      });
      return { hook: null, errors };
    }
    const hookId = inferHookId({ type: "command" } as any, { type, command, source: options.source, event: options.eventName });
    return {
      hook: {
        ...(omitUndefined({ ...base }) as any),
        hookId,
        type: "command",
        command,
        ...(typeof raw.timeoutMs === "number" ? { timeoutMs: raw.timeoutMs } : {})
      },
      errors
    };
  }

  if (type === "prompt") {
    const prompt = typeof raw.prompt === "string" ? raw.prompt : null;
    if (!prompt) {
      errors.push({
        kind: "validation_error",
        source: options.source,
        eventName: options.eventName,
        message: "prompt hook requires a prompt string",
        pointer: `/hooks/${options.eventName}/${options.matcherIndex}/hooks/${options.hookIndex}/prompt`
      });
      return { hook: null, errors };
    }
    const hookId = inferHookId({ type: "prompt" } as any, { type, prompt, source: options.source, event: options.eventName });
    return { hook: { ...(omitUndefined({ ...base }) as any), hookId, type: "prompt", prompt }, errors };
  }

  const template = typeof raw.promptTemplate === "string" ? raw.promptTemplate : typeof raw.prompt === "string" ? raw.prompt : null;
  if (!template) {
    errors.push({
      kind: "validation_error",
      source: options.source,
      eventName: options.eventName,
      message: "agent hook requires a promptTemplate string",
      pointer: `/hooks/${options.eventName}/${options.matcherIndex}/hooks/${options.hookIndex}/promptTemplate`
    });
    return { hook: null, errors };
  }
  const hookId = inferHookId({ type: "agent" } as any, { type, template, source: options.source, event: options.eventName });
  return {
    hook: {
      ...(omitUndefined({ ...base }) as any),
      hookId,
      type: "agent",
      promptTemplate: template,
      maxTurns: typeof raw.maxTurns === "number" ? raw.maxTurns : 50
    },
    errors
  };
}

export type NormalizeHooksConfigOptions = {
  source: HookSource;
  maxMatchersPerEvent?: number;
  maxHooksPerMatcher?: number;
  maxActionsPerHook?: number;
};

const DEFAULT_LIMITS = { maxMatchersPerEvent: 200, maxHooksPerMatcher: 200, maxActionsPerHook: 50 } as const;

export function normalizeHooksConfig(
  input: unknown,
  options: NormalizeHooksConfigOptions
): { config: HooksConfig; errors: HookConfigError[]; canonical: string } {
  const errors: HookConfigError[] = [];
  const out: HooksConfig = {};
  const limits = {
    maxMatchersPerEvent: options.maxMatchersPerEvent ?? DEFAULT_LIMITS.maxMatchersPerEvent,
    maxHooksPerMatcher: options.maxHooksPerMatcher ?? DEFAULT_LIMITS.maxHooksPerMatcher,
    maxActionsPerHook: options.maxActionsPerHook ?? DEFAULT_LIMITS.maxActionsPerHook
  } as const;

  if (input === null || input === undefined) return { config: out, errors, canonical: canonicalJsonStringify(out) };
  if (!isPlainObject(input)) {
    errors.push({ kind: "validation_error", source: options.source, message: "hooks config must be an object", pointer: "/hooks" });
    return { config: out, errors, canonical: canonicalJsonStringify(out) };
  }

  for (const [eventNameRaw, matchersRaw] of Object.entries(input)) {
    const eventName = eventNameRaw as HookEventName;
    if (!Array.isArray(matchersRaw)) continue;
    if (matchersRaw.length > limits.maxMatchersPerEvent) {
      errors.push({
        kind: "validation_error",
        source: options.source,
        eventName,
        message: `Too many matchers for event (max ${limits.maxMatchersPerEvent})`,
        pointer: `/hooks/${eventName}`
      });
      continue;
    }
    const matchers: HookMatcher[] = [];
    for (let matcherIndex = 0; matcherIndex < matchersRaw.length; matcherIndex++) {
      const matcherObj = matchersRaw[matcherIndex];
      if (!isPlainObject(matcherObj)) continue;
      const matcher = typeof matcherObj.matcher === "string" ? matcherObj.matcher : undefined;
      const hooksRaw = matcherObj.hooks;
      if (!Array.isArray(hooksRaw)) continue;
      if (hooksRaw.length > limits.maxHooksPerMatcher) {
        errors.push({
          kind: "validation_error",
          source: options.source,
          eventName,
          message: `Too many hooks in matcher (max ${limits.maxHooksPerMatcher})`,
          pointer: `/hooks/${eventName}/${matcherIndex}/hooks`
        });
        continue;
      }
      const compiled = compileMatcher(matcher, { source: options.source, eventName, matcherIndex });
      errors.push(...compiled.errors);

      const hooks: HookDefinition[] = [];
      for (let hookIndex = 0; hookIndex < hooksRaw.length; hookIndex++) {
        const normalized = normalizeHookDefinition(hooksRaw[hookIndex], { source: options.source, eventName, matcherIndex, hookIndex });
        errors.push(...normalized.errors);
        if (!normalized.hook) continue;
        if (normalized.hook.type === "workflow" && normalized.hook.actions.length > limits.maxActionsPerHook) {
          errors.push({
            kind: "validation_error",
            source: options.source,
            eventName,
            message: `Too many actions in workflow hook (max ${limits.maxActionsPerHook})`,
            pointer: `/hooks/${eventName}/${matcherIndex}/hooks/${hookIndex}/actions`,
            details: { hookId: normalized.hook.hookId }
          });
          continue;
        }
        hooks.push(normalized.hook);
      }

      matchers.push({
        source: options.source,
        eventName,
        ...(matcher !== undefined ? { matcher } : {}),
        matcherCompiled: compiled.compiled,
        hooks
      });
    }

    matchers.sort((a, b) => (a.matcher ?? "").localeCompare(b.matcher ?? ""));
    for (const m of matchers) {
      m.hooks.sort((a, b) => {
        const pa = a.priority ?? 0;
        const pb = b.priority ?? 0;
        if (pa !== pb) return pa - pb;
        return (a.hookId ?? "").localeCompare(b.hookId ?? "");
      });
    }

    out[eventName] = matchers;
  }

  const canonicalSource = (() => {
    const serializable: Record<string, unknown> = {};
    for (const [eventName, matchers] of Object.entries(out)) {
      serializable[eventName] = (matchers ?? []).map((m) => {
        const compiled = m.matcherCompiled;
        const compiledShape =
          compiled.kind === "regex"
            ? { kind: "regex", original: compiled.original }
            : compiled.kind === "exact"
              ? { kind: "exact", original: compiled.original }
              : compiled.kind === "one_of"
                ? { kind: "one_of", original: compiled.original, values: compiled.values }
                : compiled.kind === "invalid"
                  ? { kind: "invalid", original: compiled.original, error: compiled.error }
                  : { kind: "match_all", ...(compiled.original !== undefined ? { original: compiled.original } : {}) };

        return omitUndefined({
          source: m.source,
          ...(m.matcher !== undefined ? { matcher: m.matcher } : {}),
          matcherCompiled: compiledShape,
          hooks: m.hooks.map((h) => stripUndefinedDeep(h))
        } as any);
      });
    }
    return serializable;
  })();

  const canonical = canonicalJsonStringify(canonicalSource, { pretty: true });
  return { config: out, errors, canonical };
}

export function diffHooksConfig(prevCanonical: string | null, nextCanonical: string): HookConfigDiffReport | null {
  if (prevCanonical === null) return { kind: "hook_config_diff", changed: true, message: "Hooks configuration initialized" };
  if (prevCanonical === nextCanonical) return null;
  return {
    kind: "hook_config_diff",
    changed: true,
    message: "Hooks configuration changed",
    before: prevCanonical,
    after: nextCanonical
  };
}
