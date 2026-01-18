import type { PermissionDiagnostic, PermissionRuleBehavior, PermissionRuleValue, PermissionScope, PermissionUpdate, ToolPermissionContext } from "./types.js";
import { formatPermissionRuleValue } from "./rules.js";
import { normalizeWorkingDirectoryPath } from "./workingDirs.js";

function cloneRecordArrays(obj: Record<string, string[]>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(obj)) out[k] = Array.isArray(v) ? v.slice() : [];
  return out;
}

export function cloneToolPermissionContext(ctx: ToolPermissionContext): ToolPermissionContext {
  return {
    mode: ctx.mode,
    additionalWorkingDirectories: new Map(ctx.additionalWorkingDirectories),
    alwaysAllowRules: cloneRecordArrays(ctx.alwaysAllowRules),
    alwaysDenyRules: cloneRecordArrays(ctx.alwaysDenyRules),
    alwaysAskRules: cloneRecordArrays(ctx.alwaysAskRules),
    isBypassPermissionsModeAvailable: ctx.isBypassPermissionsModeAvailable
  };
}

function getRuleBucket(ctx: ToolPermissionContext, behavior: PermissionRuleBehavior): Record<string, string[]> {
  if (behavior === "allow") return ctx.alwaysAllowRules;
  if (behavior === "deny") return ctx.alwaysDenyRules;
  return ctx.alwaysAskRules;
}

function ensureList(bucket: Record<string, string[]>, destination: PermissionScope): string[] {
  const key = String(destination);
  const existing = bucket[key];
  if (Array.isArray(existing)) return existing;
  bucket[key] = [];
  return bucket[key]!;
}

function stringifyRules(rules: PermissionRuleValue[]): string[] {
  return rules.map((r) => formatPermissionRuleValue(r));
}

function removeRuleStrings(existing: string[], toRemove: string[]): string[] {
  if (toRemove.length === 0) return existing.slice();
  const removeSet = new Set(toRemove);
  return existing.filter((r) => !removeSet.has(r));
}

export function applyPermissionUpdate(
  current: ToolPermissionContext,
  update: PermissionUpdate
): { ctx: ToolPermissionContext; diagnostics: PermissionDiagnostic[] } {
  const ctx = cloneToolPermissionContext(current);
  const diagnostics: PermissionDiagnostic[] = [];

  switch (update.type) {
    case "setMode": {
      ctx.mode = update.mode;
      return { ctx, diagnostics };
    }
    case "addRules": {
      const bucket = getRuleBucket(ctx, update.behavior);
      const list = ensureList(bucket, update.destination);
      list.push(...stringifyRules(update.rules));
      return { ctx, diagnostics };
    }
    case "replaceRules": {
      const bucket = getRuleBucket(ctx, update.behavior);
      bucket[String(update.destination)] = stringifyRules(update.rules);
      return { ctx, diagnostics };
    }
    case "removeRules": {
      const bucket = getRuleBucket(ctx, update.behavior);
      const list = ensureList(bucket, update.destination);
      bucket[String(update.destination)] = removeRuleStrings(list, stringifyRules(update.rules));
      return { ctx, diagnostics };
    }
    case "addDirectories": {
      for (const raw of update.directories) {
        const normalized = normalizeWorkingDirectoryPath(raw);
        if (!normalized.ok) {
          diagnostics.push(...normalized.diagnostics);
          continue;
        }
        ctx.additionalWorkingDirectories.set(normalized.path, { path: normalized.path, source: update.destination });
      }
      return { ctx, diagnostics };
    }
    case "removeDirectories": {
      for (const raw of update.directories) {
        const normalized = normalizeWorkingDirectoryPath(raw);
        if (!normalized.ok) {
          diagnostics.push(...normalized.diagnostics);
          continue;
        }
        ctx.additionalWorkingDirectories.delete(normalized.path);
      }
      return { ctx, diagnostics };
    }
  }
}

export function applyPermissionUpdates(
  current: ToolPermissionContext,
  updates: PermissionUpdate[]
): { ctx: ToolPermissionContext; diagnostics: PermissionDiagnostic[] } {
  let ctx = current;
  const diagnostics: PermissionDiagnostic[] = [];
  for (const u of updates) {
    const res = applyPermissionUpdate(ctx, u);
    ctx = res.ctx;
    diagnostics.push(...res.diagnostics);
  }
  return { ctx, diagnostics };
}

