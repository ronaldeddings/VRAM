import type { PermissionUpdate } from "../permissions/types.js";
import type { ToolResult } from "../tools/types.js";
import type { HostCapabilities } from "../types/host.js";
import type { HookEffect, HookEffectAuditEvent, HookEventName } from "./types.js";
import { HookError } from "./errors.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeObjects(a: unknown, b: unknown): unknown {
  if (!isPlainObject(a) || !isPlainObject(b)) return b;
  const out: Record<string, unknown> = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (k in out && isPlainObject(out[k]) && isPlainObject(v)) out[k] = mergeObjects(out[k], v);
    else out[k] = v;
  }
  return out;
}

type MergeConflictState = {
  replaceBy?: string;
  touched: Map<string, string>;
};

function applyMergeWithConflicts(base: unknown, patch: unknown, state: MergeConflictState, prefix = ""): unknown {
  if (!isPlainObject(patch)) throw new HookError("effect_invalid", "merge mode requires a plain object patch");
  const baseObj = isPlainObject(base) ? base : {};
  const out: Record<string, unknown> = { ...baseObj };

  for (const [k, v] of Object.entries(patch)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(v) && isPlainObject(out[k])) {
      out[k] = applyMergeWithConflicts(out[k], v, state, path);
      continue;
    }

    const nextVal = v;
    const sig = canonicalJsonStringify(nextVal);
    const prevSig = state.touched.get(path);
    if (prevSig !== undefined && prevSig !== sig) {
      throw new HookError("effect_conflict", `Conflicting merge updates for '${path}'`);
    }
    state.touched.set(path, sig);
    out[k] = nextVal;
  }
  return out;
}

type ApplyContext = {
  host: HostCapabilities;
  eventName: HookEventName;
  toolInput?: unknown;
  toolResult?: ToolResult<unknown>;
};

export type HookEffectApplyResult = {
  blocked?: { reasonCode: string; message: string; hookId: string };
  updatedToolInput?: unknown;
  updatedToolResult?: ToolResult<unknown>;
  transcriptAppends: Array<{ text: string; dedupeKey?: string; sensitivity?: string; hookId: string }>;
  permissionUpdates: PermissionUpdate[];
  notifications: Array<{ title: string; message: string; kind?: string; hookId: string }>;
  statusLine?: { lines: string[]; hookId: string };
  fileSuggestions?: { files: string[]; hookId: string };
  backgroundTasks: Array<{ label: string; timeoutMs?: number; hookId: string }>;
  audit: HookEffectAuditEvent[];
};

export function applyHookEffects(effects: HookEffect[], ctx: ApplyContext): HookEffectApplyResult {
  const audit: HookEffectAuditEvent[] = [];
  let blocked: HookEffectApplyResult["blocked"] | undefined;
  let updatedToolInput = ctx.toolInput;
  let updatedToolResult = ctx.toolResult;
  const transcriptAppends: HookEffectApplyResult["transcriptAppends"] = [];
  const permissionUpdates: PermissionUpdate[] = [];
  const notifications: HookEffectApplyResult["notifications"] = [];
  const backgroundTasks: HookEffectApplyResult["backgroundTasks"] = [];
  let statusLine: HookEffectApplyResult["statusLine"] | undefined;
  let fileSuggestions: HookEffectApplyResult["fileSuggestions"] | undefined;
  const transcriptDedupe = new Set<string>();
  const permissionUpdateDedupe = new Set<string>();
  const inputMergeState: MergeConflictState = { touched: new Map() };
  const outputMergeState: MergeConflictState = { touched: new Map() };

  for (const effect of effects) {
    audit.push({ kind: "effect_requested", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });

    if (effect.kind === "BlockContinuation") {
      if (!blocked) {
        blocked = { reasonCode: effect.reasonCode, message: effect.message, hookId: effect.hookId };
        audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      } else {
        audit.push({
          kind: "effect_denied",
          hookId: effect.hookId,
          hookSource: effect.source,
          effect: effect.kind,
          reason: "another hook already blocked continuation"
        });
      }
      continue;
    }

    if (effect.kind === "UpdateToolInput") {
      if (ctx.eventName !== "PreToolUse" && ctx.eventName !== "PermissionRequest") {
        audit.push({
          kind: "effect_denied",
          hookId: effect.hookId,
          hookSource: effect.source,
          effect: effect.kind,
          reason: `UpdateToolInput is not allowed for event ${ctx.eventName}`
        });
        continue;
      }

      if (effect.mode === "replace") {
        const sig = canonicalJsonStringify(effect.value);
        const prev = inputMergeState.touched.get("$replace");
        if (prev !== undefined && prev !== sig) throw new HookError("effect_conflict", "Multiple conflicting UpdateToolInput replacements");
        inputMergeState.touched.set("$replace", sig);
        updatedToolInput = effect.value;
      } else {
        updatedToolInput = applyMergeWithConflicts(updatedToolInput, effect.value, inputMergeState);
      }
      audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      continue;
    }

    if (effect.kind === "UpdateToolOutput") {
      if (ctx.eventName !== "PostToolUse") {
        audit.push({
          kind: "effect_denied",
          hookId: effect.hookId,
          hookSource: effect.source,
          effect: effect.kind,
          reason: `UpdateToolOutput is not allowed for event ${ctx.eventName}`
        });
        continue;
      }
      if (!updatedToolResult) throw new HookError("effect_invalid", "UpdateToolOutput requires a tool result in context", { hookId: effect.hookId });
      if (effect.mode === "replace_data") {
        const sig = canonicalJsonStringify(effect.value);
        const prev = outputMergeState.touched.get("$replace");
        if (prev !== undefined && prev !== sig) throw new HookError("effect_conflict", "Multiple conflicting UpdateToolOutput replacements");
        outputMergeState.touched.set("$replace", sig);
        updatedToolResult = { ...updatedToolResult, data: effect.value };
      } else {
        updatedToolResult = { ...updatedToolResult, data: applyMergeWithConflicts(updatedToolResult.data, effect.value, outputMergeState) };
      }
      audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      continue;
    }

    if (effect.kind === "AppendTranscriptContext") {
      const key = effect.dedupeKey ?? `text:${canonicalJsonStringify(effect.text)}`;
      if (!transcriptDedupe.has(key)) {
        transcriptDedupe.add(key);
        transcriptAppends.push({
          text: effect.text,
          ...(effect.dedupeKey !== undefined ? { dedupeKey: effect.dedupeKey } : {}),
          ...(effect.sensitivity !== undefined ? { sensitivity: effect.sensitivity } : {}),
          hookId: effect.hookId
        });
        audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      } else {
        audit.push({
          kind: "effect_denied",
          hookId: effect.hookId,
          hookSource: effect.source,
          effect: effect.kind,
          reason: "duplicate transcript append"
        });
      }
      continue;
    }

    if (effect.kind === "ProposePermissionUpdates") {
      for (const u of effect.updates) {
        const key = canonicalJsonStringify(u);
        if (permissionUpdateDedupe.has(key)) continue;
        permissionUpdateDedupe.add(key);
        permissionUpdates.push(u);
      }
      audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      continue;
    }

    if (effect.kind === "EmitNotification") {
      if (ctx.host.notifications.kind !== "available" || !ctx.host.notifications.value.notify) {
        audit.push({
          kind: "effect_denied",
          hookId: effect.hookId,
          hookSource: effect.source,
          effect: effect.kind,
          reason: "host.notifications capability is unavailable"
        });
      } else {
        notifications.push({
          title: effect.title,
          message: effect.message,
          ...(effect.notificationKind !== undefined ? { kind: effect.notificationKind } : {}),
          hookId: effect.hookId
        });
        audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      }
      continue;
    }

    if (effect.kind === "SetStatusLine") {
      statusLine ??= { lines: effect.lines, hookId: effect.hookId };
      audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      continue;
    }

    if (effect.kind === "SuggestFiles") {
      fileSuggestions ??= { files: effect.files, hookId: effect.hookId };
      audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      continue;
    }

    if (effect.kind === "StartBackgroundTask") {
      if (ctx.host.background.kind !== "available" || !ctx.host.background.value.requestBackgroundExecution) {
        audit.push({
          kind: "effect_denied",
          hookId: effect.hookId,
          hookSource: effect.source,
          effect: effect.kind,
          reason: "host.background capability is unavailable"
        });
      } else {
        backgroundTasks.push({ label: effect.label, ...(effect.timeoutMs !== undefined ? { timeoutMs: effect.timeoutMs } : {}), hookId: effect.hookId });
        audit.push({ kind: "effect_applied", hookId: effect.hookId, hookSource: effect.source, effect: effect.kind });
      }
      continue;
    }

    if (effect.kind === "ToolResult") {
      audit.push({
        kind: "effect_denied",
        hookId: effect.hookId,
        hookSource: effect.source,
        effect: effect.kind,
        reason: "ToolResult effect is internal-only; it must be interpreted by the hook engine"
      });
      continue;
    }

    const _exhaustive: never = effect;
    throw new HookError("effect_invalid", "Unknown effect kind", { details: _exhaustive });
  }

  return {
    ...(blocked ? { blocked } : {}),
    ...(updatedToolInput !== ctx.toolInput ? { updatedToolInput } : {}),
    ...(updatedToolResult !== ctx.toolResult ? { updatedToolResult } : {}),
    transcriptAppends,
    permissionUpdates,
    notifications,
    ...(statusLine ? { statusLine } : {}),
    ...(fileSuggestions ? { fileSuggestions } : {}),
    backgroundTasks,
    audit
  };
}
