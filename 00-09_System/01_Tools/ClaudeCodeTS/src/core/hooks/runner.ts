import type { HostCapabilities } from "../types/host.js";
import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import type { DeterministicScheduler } from "../runtime/scheduler.js";
import type { HookRunId } from "../types/state.js";
import { asHookRunId } from "../types/state.js";
import type { ToolResult } from "../tools/types.js";
import type {
  HookAction,
  HookConfigError,
  HookDefinition,
  HookEffect,
  HookEffectAuditEvent,
  HookEventName,
  HookOutcome,
  HookRunResult,
  HooksConfig,
  WorkflowHookDefinition
} from "./types.js";
import { matchesCompiledMatcher } from "./matchers.js";
import { HookError } from "./errors.js";
import { createHookStream, type HookStream } from "./stream.js";

export type HookExecutionContext = {
  host: HostCapabilities;
  eventName: HookEventName;
  matchQuery?: string;
  tool?: { name: string; input?: unknown; result?: ToolResult<unknown>; error?: { message: string; isInterrupt?: boolean } };
  sessionId?: string;
  workspaceTrusted?: boolean;
  signal?: AbortSignal;
  reentrancyStack?: HookEventName[];
  callTool?: (toolName: string, input: unknown, options?: { withHooks?: boolean; signal?: AbortSignal }) => Promise<ToolResult<unknown>>;
  runModelCheck?: (prompt: string, options?: { maxTokens?: number; signal?: AbortSignal }) => Promise<{ ok: boolean; reason?: string }>;
  runHookAgent?: (prompt: string, options?: { maxTurns?: number; signal?: AbortSignal }) => Promise<{ ok: boolean; reason?: string }>;
};

export type HookEngineOptions = {
  host: HostCapabilities;
  clock: MonotonicClock;
  idSource: IdSource;
  hooks: HooksConfig;
  scheduler?: DeterministicScheduler;
  eventConcurrency?: Partial<Record<HookEventName, "sequential" | "parallel">>;
  maxBufferedEvents?: number;
  maxHooksPerEvent?: number;
  maxEffectsPerRun?: number;
  recursionMaxDepth?: number;
};

type ExecutionMode = "streaming" | "batch";

function nowMs(clock: MonotonicClock): number {
  return clock.nowMs();
}

function stableHookSortKey(h: HookDefinition): string {
  const pri = h.priority ?? 0;
  return `${String(pri).padStart(12, "0")}:${h.hookId}`;
}

function buildMatchQuery(eventName: HookEventName, ctx: HookExecutionContext): string | undefined {
  switch (eventName) {
    case "PreToolUse":
    case "PostToolUse":
    case "PostToolUseFailure":
    case "PermissionRequest":
      return ctx.tool?.name ?? ctx.matchQuery;
    case "SessionStart":
      return ctx.matchQuery;
    case "PreCompact":
      return ctx.matchQuery;
    case "Notification":
      return ctx.matchQuery;
    case "SessionEnd":
      return ctx.matchQuery;
    case "SubagentStart":
      return ctx.matchQuery;
    default:
      return undefined;
  }
}

function selectHooks(hooks: HooksConfig, eventName: HookEventName, matchQuery: string | undefined): HookDefinition[] {
  const matchers = hooks[eventName] ?? [];
  const selected: HookDefinition[] = [];
  for (const m of matchers) {
    if (!matchQuery) {
      selected.push(...m.hooks);
      continue;
    }
    if (!m.matcher || matchesCompiledMatcher(matchQuery, m.matcherCompiled)) selected.push(...m.hooks);
  }

  const seen = new Set<string>();
  const out: HookDefinition[] = [];
  for (const h of selected.sort((a, b) => stableHookSortKey(a).localeCompare(stableHookSortKey(b)))) {
    const dedupeKey =
      h.type === "command"
        ? `command:${h.command}`
        : h.type === "prompt"
          ? `prompt:${h.prompt}`
          : h.type === "agent"
            ? `agent:${h.promptTemplate}`
            : `workflow:${h.hookId}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    out.push(h);
  }
  return out;
}

function defaultTimeoutMsForEvent(eventName: HookEventName): number {
  switch (eventName) {
    case "PreToolUse":
    case "PostToolUse":
    case "PostToolUseFailure":
      return 10_000;
    case "PermissionRequest":
      return 7_500;
    default:
      return 15_000;
  }
}

function withTimeout<T>(
  p: Promise<T>,
  timeoutMs: number,
  options: { signal?: AbortSignal; scheduler?: DeterministicScheduler }
): Promise<T> {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return p;
  if (options.signal?.aborted) return Promise.reject(options.signal.reason ?? new Error("aborted"));

  if (options.scheduler) {
    const timer = options.scheduler.sleep(undefined, timeoutMs, { ...(options.signal !== undefined ? { signal: options.signal } : {}) });
    return Promise.race([
      p,
      timer.then(() => {
        throw new HookError("hook_timeout", "hook timed out");
      })
    ]);
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new HookError("hook_timeout", "hook timed out")), timeoutMs);
    const onAbort = () => reject(options.signal?.reason ?? new HookError("hook_cancelled", "hook cancelled"));
    if (options.signal) options.signal.addEventListener("abort", onAbort, { once: true });
    p.then(resolve, reject).finally(() => {
      clearTimeout(timer);
      if (options.signal) options.signal.removeEventListener("abort", onAbort);
    });
  });
}

async function interpretActions(
  actions: HookAction[],
  hook: WorkflowHookDefinition,
  ctx: HookExecutionContext,
  stream: HookStream | null
): Promise<{ effects: HookEffect[]; audit: HookEffectAuditEvent[] }> {
  const effects: HookEffect[] = [];
  const audit: HookEffectAuditEvent[] = [];
  let toolCalls = 0;
  const toolCallMax = hook.budget?.maxToolCalls ?? 0;

  for (const action of actions) {
    if (ctx.signal?.aborted) throw new HookError("hook_cancelled", "hook cancelled", { hookId: hook.hookId, hookEvent: ctx.eventName });

    await stream?.emit({ hookId: hook.hookId, kind: "progress", payload: { action: action.kind } });

    switch (action.kind) {
      case "EmitNotification": {
        const eff: HookEffect = {
          kind: "EmitNotification",
          title: action.title,
          message: action.message,
          ...(action.notificationKind !== undefined ? { notificationKind: action.notificationKind } : {}),
          hookId: hook.hookId,
          source: hook.source
        };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "AppendTranscriptContext": {
        const eff: HookEffect = {
          kind: "AppendTranscriptContext",
          text: action.text,
          ...(action.dedupeKey !== undefined ? { dedupeKey: action.dedupeKey } : {}),
          ...(action.sensitivity !== undefined ? { sensitivity: action.sensitivity } : {}),
          hookId: hook.hookId,
          source: hook.source
        };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "BlockContinuation": {
        const eff: HookEffect = { kind: "BlockContinuation", reasonCode: action.reasonCode, message: action.message, hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "UpdateToolInput": {
        const eff: HookEffect = { kind: "UpdateToolInput", mode: action.mode, value: action.value, hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "UpdateToolOutput": {
        const eff: HookEffect = { kind: "UpdateToolOutput", mode: action.mode, value: action.value, hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "RequestPermissionDecision": {
        const eff: HookEffect = { kind: "ProposePermissionUpdates", updates: action.suggestedUpdates ?? [], hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "RunTool": {
        if (!ctx.callTool) throw new HookError("hook_unsupported", "RunTool requires a callTool context", { hookId: hook.hookId, hookEvent: ctx.eventName });
        if (hook.allowNestedToolRuns !== true) {
          throw new HookError("effect_denied", "RunTool requires allowNestedToolRuns=true on the workflow hook", { hookId: hook.hookId, hookEvent: ctx.eventName });
        }
        if (toolCallMax > 0 && toolCalls >= toolCallMax) {
          throw new HookError("effect_denied", `RunTool exceeded maxToolCalls budget (${toolCallMax})`, { hookId: hook.hookId, hookEvent: ctx.eventName });
        }
        toolCalls += 1;
        const res = await ctx.callTool(action.toolName, action.input, {
          ...(action.withHooks !== undefined ? { withHooks: action.withHooks } : {}),
          ...(ctx.signal !== undefined ? { signal: ctx.signal } : {})
        });
        const eff: HookEffect = { kind: "ToolResult", toolName: action.toolName, result: res, hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "RunModelCheck": {
        if (!ctx.runModelCheck) throw new HookError("hook_unsupported", "RunModelCheck is not available in this host", { hookId: hook.hookId });
        const args = action.arguments ?? [];
        const prompt = action.promptTemplate.replace("$ARGUMENTS", args.join(" "));
        const result = await ctx.runModelCheck(prompt, {
          ...(action.maxTokens !== undefined ? { maxTokens: action.maxTokens } : {}),
          ...(ctx.signal !== undefined ? { signal: ctx.signal } : {})
        });
        if (!result.ok) {
          const eff: HookEffect = {
            kind: "BlockContinuation",
            reasonCode: "model_check_failed",
            message: result.reason ?? "Model check failed",
            hookId: hook.hookId,
            source: hook.source
          };
          audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
          effects.push(eff);
        }
        break;
      }
      case "RunHookAgent": {
        if (!ctx.runHookAgent) throw new HookError("hook_unsupported", "RunHookAgent is not available in this host", { hookId: hook.hookId });
        const args = action.arguments ?? [];
        const prompt = action.promptTemplate.replace("$ARGUMENTS", args.join(" "));
        const result = await ctx.runHookAgent(prompt, {
          ...(action.maxTurns !== undefined ? { maxTurns: action.maxTurns } : { maxTurns: 50 }),
          ...(ctx.signal !== undefined ? { signal: ctx.signal } : {})
        });
        if (!result.ok) {
          const eff: HookEffect = {
            kind: "BlockContinuation",
            reasonCode: "hook_agent_failed",
            message: result.reason ?? "Hook agent failed",
            hookId: hook.hookId,
            source: hook.source
          };
          audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
          effects.push(eff);
        }
        break;
      }
      case "StartBackgroundTask": {
        const eff: HookEffect = {
          kind: "StartBackgroundTask",
          label: action.label,
          ...(action.timeoutMs !== undefined ? { timeoutMs: action.timeoutMs } : {}),
          hookId: hook.hookId,
          source: hook.source
        };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "SetStatusLine": {
        const eff: HookEffect = { kind: "SetStatusLine", lines: action.lines, hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      case "SuggestFiles": {
        const eff: HookEffect = { kind: "SuggestFiles", files: action.files, hookId: hook.hookId, source: hook.source };
        audit.push({ kind: "effect_requested", hookId: hook.hookId, hookSource: hook.source, effect: eff.kind });
        effects.push(eff);
        break;
      }
      default: {
        const _exhaustive: never = action;
        throw new HookError("internal_error", "Unknown hook action", { details: _exhaustive });
      }
    }
  }

  return { effects, audit };
}

export class HookEngine {
  private readonly host: HostCapabilities;
  private readonly clock: MonotonicClock;
  private readonly idSource: IdSource;
  private readonly hooks: HooksConfig;
  private readonly scheduler: DeterministicScheduler | undefined;
  private readonly eventConcurrency: Partial<Record<HookEventName, "sequential" | "parallel">>;
  private readonly maxBuffered: number;
  private readonly maxHooksPerEvent: number;
  private readonly maxEffectsPerRun: number;
  private readonly recursionMaxDepth: number;
  private readonly runHistory = new Map<string, Map<string, { count: number; lastRunAtMonoMs: number }>>();

  constructor(options: HookEngineOptions) {
    this.host = options.host;
    this.clock = options.clock;
    this.idSource = options.idSource;
    this.hooks = options.hooks;
    this.scheduler = options.scheduler;
    this.eventConcurrency = options.eventConcurrency ?? {};
    this.maxBuffered = options.maxBufferedEvents ?? 256;
    this.maxHooksPerEvent = options.maxHooksPerEvent ?? 200;
    this.maxEffectsPerRun = options.maxEffectsPerRun ?? 200;
    this.recursionMaxDepth = options.recursionMaxDepth ?? 4;
  }

  runEventStreaming(ctx: HookExecutionContext, options: { recursionDepth?: number } = {}): { hookRunId: HookRunId; stream: HookStream; done: Promise<HookRunResult> } {
    const hookRunId = asHookRunId(this.idSource.nextId("hook_run"));
    const stream = createHookStream({ hookRunId, clock: this.clock, maxBuffered: this.maxBuffered, dropPolicy: "block_producer" });
    const done = this.runInternal(ctx, "streaming", stream, hookRunId, options.recursionDepth ?? 0).finally(() => {
      if (!stream.closed) stream.close("completed");
    });
    return { hookRunId, stream, done };
  }

  async runEventBatch(ctx: HookExecutionContext, options: { recursionDepth?: number } = {}): Promise<HookRunResult> {
    const hookRunId = asHookRunId(this.idSource.nextId("hook_run"));
    return await this.runInternal(ctx, "batch", null, hookRunId, options.recursionDepth ?? 0);
  }

  private async runInternal(
    ctx: HookExecutionContext,
    mode: ExecutionMode,
    stream: HookStream | null,
    hookRunId: HookRunId,
    recursionDepth: number
  ): Promise<HookRunResult> {
    if (ctx.workspaceTrusted === false) {
      return { hookRunId, eventName: ctx.eventName, matchedHookIds: [], outcomes: [], effects: [], audit: [] };
    }
    if (recursionDepth > this.recursionMaxDepth) {
      throw new HookError("internal_error", `Hook recursion depth exceeded (${recursionDepth} > ${this.recursionMaxDepth})`);
    }
    if (ctx.reentrancyStack && ctx.reentrancyStack.includes(ctx.eventName)) {
      throw new HookError("internal_error", `Hook event reentrancy detected for ${ctx.eventName}`);
    }

    const matchQuery = buildMatchQuery(ctx.eventName, ctx);
    const hooks = selectHooks(this.hooks, ctx.eventName, matchQuery);
    const limited = hooks.slice(0, this.maxHooksPerEvent);

    const outcomes: HookOutcome[] = [];
    const effects: HookEffect[] = [];
    const audit: HookEffectAuditEvent[] = [];

    if (hooks.length > this.maxHooksPerEvent) {
      await stream?.emit({
        hookId: "system",
        kind: "diagnostic",
        payload: { message: `Hook selection exceeded maxHooksPerEvent (${this.maxHooksPerEvent}); truncating` }
      });
    }

    const chaining = this.eventConcurrency[ctx.eventName] ?? "sequential";

    const canRunHook = (hook: HookDefinition): boolean => {
      const sessionId = ctx.sessionId ?? "__no_session__";
      const history = this.runHistory.get(sessionId) ?? new Map();
      const rec = history.get(hook.hookId) ?? { count: 0, lastRunAtMonoMs: -Infinity };
      const now = nowMs(this.clock);
      if (hook.maxRunsPerSession !== undefined && rec.count >= hook.maxRunsPerSession) return false;
      if (hook.cooldownMs !== undefined && now - rec.lastRunAtMonoMs < hook.cooldownMs) return false;
      return true;
    };

    const recordHookRun = (hook: HookDefinition): void => {
      const sessionId = ctx.sessionId ?? "__no_session__";
      const history = this.runHistory.get(sessionId) ?? new Map();
      const rec = history.get(hook.hookId) ?? { count: 0, lastRunAtMonoMs: -Infinity };
      history.set(hook.hookId, { count: rec.count + 1, lastRunAtMonoMs: nowMs(this.clock) });
      this.runHistory.set(sessionId, history);
    };

    const runOne = async (hook: HookDefinition): Promise<{ hook: HookDefinition; outcome: HookOutcome; effects: HookEffect[]; audit: HookEffectAuditEvent[] }> => {
      if (ctx.signal?.aborted) {
        const cancelled: HookOutcome = { hookId: hook.hookId, status: "cancelled", reason: "aborted", effects: [] };
        await stream?.emit({ hookId: hook.hookId, kind: "cancelled", payload: { reason: "aborted" } });
        return { hook, outcome: cancelled, effects: [], audit: [] };
      }

      if (!canRunHook(hook)) {
        await stream?.emit({ hookId: hook.hookId, kind: "diagnostic", payload: { message: "Hook skipped due to maxRunsPerSession/cooldown" } });
        const out: HookOutcome = { hookId: hook.hookId, status: "success", effects: [] };
        return { hook, outcome: out, effects: [], audit: [] };
      }

      recordHookRun(hook);

      if (hook.type !== "workflow") {
        const msg = `Legacy hook type '${hook.type}' is not supported in the rewrite`;
        if (hook.source === "policy") {
          await stream?.emit({ hookId: hook.hookId, kind: "blocking_error", payload: { message: msg } });
          const blockEffect: HookEffect = { kind: "BlockContinuation", reasonCode: "legacy_hook_unsupported", message: msg, hookId: hook.hookId, source: hook.source };
          return { hook, outcome: { hookId: hook.hookId, status: "blocking_error", error: msg, effects: [blockEffect] }, effects: [blockEffect], audit: [] };
        }
        await stream?.emit({ hookId: hook.hookId, kind: "non_blocking_error", payload: { message: msg } });
        return { hook, outcome: { hookId: hook.hookId, status: "non_blocking_error", error: msg, effects: [] }, effects: [], audit: [] };
      }

      const timeoutMs = hook.budget?.timeoutMs ?? defaultTimeoutMsForEvent(ctx.eventName);
      try {
        const actionEval = interpretActions(hook.actions, hook, ctx, stream);
        const res = await withTimeout(actionEval, timeoutMs, { ...(ctx.signal !== undefined ? { signal: ctx.signal } : {}), ...(this.scheduler ? { scheduler: this.scheduler } : {}) });
        const hookEffects = res.effects;
        const blocking = hookEffects.find((e) => e.kind === "BlockContinuation");
        if (blocking) {
          await stream?.emit({ hookId: hook.hookId, kind: "blocking_error", payload: { message: blocking.message, reasonCode: blocking.reasonCode } });
          return { hook, outcome: { hookId: hook.hookId, status: "blocking_error", error: blocking.message, effects: hookEffects }, effects: hookEffects, audit: res.audit };
        }
        await stream?.emit({ hookId: hook.hookId, kind: "success", payload: { effects: hookEffects.map((e) => e.kind) } });
        return { hook, outcome: { hookId: hook.hookId, status: "success", effects: hookEffects }, effects: hookEffects, audit: res.audit };
      } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        if (ctx.signal?.aborted) {
          await stream?.emit({ hookId: hook.hookId, kind: "cancelled", payload: { reason: err } });
          return { hook, outcome: { hookId: hook.hookId, status: "cancelled", reason: err, effects: [] }, effects: [], audit: [] };
        }
        await stream?.emit({ hookId: hook.hookId, kind: "non_blocking_error", payload: { message: err } });
        return { hook, outcome: { hookId: hook.hookId, status: "non_blocking_error", error: err, effects: [] }, effects: [], audit: [] };
      }
    };

    if (chaining === "parallel") {
      const results = await Promise.all(limited.map((h) => runOne(h)));
      results.sort((a, b) => stableHookSortKey(a.hook).localeCompare(stableHookSortKey(b.hook)));
      outcomes.push(...results.map((r) => r.outcome));
      for (const r of results) audit.push(...r.audit);
      const blockingIdx = results.findIndex((r) => r.effects.some((e) => e.kind === "BlockContinuation"));
      const allowed = blockingIdx === -1 ? results : results.slice(0, blockingIdx + 1);
      for (const r of allowed) effects.push(...r.effects);
    } else {
      for (const hook of limited) {
        const r = await runOne(hook);
        outcomes.push(r.outcome);
        audit.push(...r.audit);
        if (r.effects.length > 0) effects.push(...r.effects);
        if (effects.length > this.maxEffectsPerRun) throw new HookError("effect_invalid", `Exceeded maxEffectsPerRun (${this.maxEffectsPerRun})`);
        if (r.effects.some((e) => e.kind === "BlockContinuation")) break;
        if (r.outcome.status === "cancelled") break;
      }
    }

    if (effects.length > this.maxEffectsPerRun) throw new HookError("effect_invalid", `Exceeded maxEffectsPerRun (${this.maxEffectsPerRun})`);

    return {
      hookRunId,
      eventName: ctx.eventName,
      matchedHookIds: limited.map((h) => h.hookId),
      outcomes,
      effects,
      audit
    };
  }
}

export type HookLinterResult = { errors: HookConfigError[] };

export function lintLegacyHooks(hooks: HooksConfig): HookLinterResult {
  const errors: HookConfigError[] = [];
  for (const [eventName, matchers] of Object.entries(hooks) as Array<[HookEventName, any]>) {
    for (const m of matchers ?? []) {
      for (const h of m.hooks ?? []) {
        if (h.type === "command" || h.type === "prompt" || h.type === "agent") {
          errors.push({
            kind: "validation_error",
            source: h.source ?? "settings",
            eventName,
            message: `Legacy hook type '${h.type}' is not executable in v3; migrate to workflow actions`,
            pointer: `/hooks/${eventName}`
          });
        }
      }
    }
  }
  return { errors };
}
