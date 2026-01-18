import type { HostCapabilities } from "../types/host.js";
import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import type { ToolName, ToolResult } from "../tools/types.js";
import type { ToolExecutionPipelineHooks } from "../tools/runner.js";
import type { HooksConfig } from "./types.js";
import { HookEngine } from "./runner.js";
import { applyHookEffects } from "./interpreter.js";

export type HookToolPipelineOptions = {
  host: HostCapabilities;
  clock: MonotonicClock;
  idSource: IdSource;
  hooks: HooksConfig;
  workspaceTrusted?: boolean;
};

export function createToolPipelineHooks(options: HookToolPipelineOptions): ToolExecutionPipelineHooks {
  const engine = new HookEngine({ host: options.host, clock: options.clock, idSource: options.idSource, hooks: options.hooks });
  const trusted = options.workspaceTrusted ?? true;

  return {
    beforeTool: async (toolName, input, ctx) => {
      const res = await engine.runEventBatch({
        host: options.host,
        eventName: "PreToolUse",
        tool: { name: toolName, input },
        ...(ctx.sessionId !== undefined ? { sessionId: ctx.sessionId } : {}),
        workspaceTrusted: trusted,
        ...(ctx.signal !== undefined ? { signal: ctx.signal } : {})
      });
      const applied = applyHookEffects(res.effects, { host: options.host, eventName: "PreToolUse", toolInput: input });
      return {
        blocked: Boolean(applied.blocked),
        ...(applied.updatedToolInput !== undefined ? { updatedInput: applied.updatedToolInput } : {}),
        hookRun: res
      };
    },
    afterTool: async (toolName, input, result, ctx) => {
      const res = await engine.runEventBatch({
        host: options.host,
        eventName: "PostToolUse",
        tool: { name: toolName, input, result: result as ToolResult<unknown> },
        ...(ctx.sessionId !== undefined ? { sessionId: ctx.sessionId } : {}),
        workspaceTrusted: trusted,
        ...(ctx.signal !== undefined ? { signal: ctx.signal } : {})
      });
      const applied = applyHookEffects(res.effects, { host: options.host, eventName: "PostToolUse", toolInput: input, toolResult: result as ToolResult<unknown> });
      return {
        blocked: Boolean(applied.blocked),
        ...(applied.updatedToolResult !== undefined ? { updatedResult: applied.updatedToolResult } : {}),
        hookRun: res
      };
    },
    afterToolFailure: async (toolName, input, error, ctx) => {
      const res = await engine.runEventBatch({
        host: options.host,
        eventName: "PostToolUseFailure",
        tool: { name: toolName, input, error: { message: error.message, isInterrupt: error.code === "cancelled" } },
        ...(ctx.sessionId !== undefined ? { sessionId: ctx.sessionId } : {}),
        workspaceTrusted: trusted,
        ...(ctx.signal !== undefined ? { signal: ctx.signal } : {})
      });
      const applied = applyHookEffects(res.effects, { host: options.host, eventName: "PostToolUseFailure", toolInput: input });
      return { blocked: Boolean(applied.blocked), hookRun: res };
    }
  };
}
