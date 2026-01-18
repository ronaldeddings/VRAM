import { toEngineError } from "../types/errors.js";
import type { EngineError } from "../types/errors.js";
import type { PermissionDecision, PermissionRule, ToolPermissionCheckContext, ToolPermissionSubject } from "./types.js";
import { LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE } from "./sources.js";
import { formatPermissionRuleValue, isBashToolName, matchesToolName, parsePermissionRuleString } from "./rules.js";
import { formatPermissionExplanation } from "./explain.js";

function flattenRules(ctx: ToolPermissionCheckContext["toolPermissionContext"], behavior: "allow" | "deny" | "ask"): PermissionRule[] {
  const out: PermissionRule[] = [];
  for (const source of LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE) {
    const raw =
      behavior === "allow"
        ? ctx.alwaysAllowRules[source] ?? []
        : behavior === "deny"
          ? ctx.alwaysDenyRules[source] ?? []
          : ctx.alwaysAskRules[source] ?? [];
    for (const ruleString of raw) {
      out.push({ source, ruleBehavior: behavior, ruleValue: parsePermissionRuleString(ruleString) });
    }
  }
  return out;
}

export function findFirstPlainRule(
  ctx: ToolPermissionCheckContext["toolPermissionContext"],
  toolName: string,
  behavior: "allow" | "deny" | "ask"
): PermissionRule | null {
  const rules = flattenRules(ctx, behavior);
  for (const rule of rules) {
    if (rule.ruleValue.ruleContent !== undefined) continue;
    if (matchesToolName(rule.ruleValue.toolName, toolName)) return rule;
  }
  return null;
}

export function buildContentRuleIndex(
  ctx: ToolPermissionCheckContext["toolPermissionContext"],
  toolName: string,
  behavior: "allow" | "deny" | "ask"
): Map<string, PermissionRule> {
  const map = new Map<string, PermissionRule>();
  const rules = flattenRules(ctx, behavior);
  for (const rule of rules) {
    if (rule.ruleValue.toolName !== toolName) continue;
    const key = rule.ruleValue.ruleContent;
    if (key === undefined) continue;
    map.set(key, rule);
  }
  return map;
}

function denyDontAsk(toolName: string, ctx: ToolPermissionCheckContext): PermissionDecision {
  return {
    behavior: "deny",
    reasonCode: "mode_dont_ask_denied",
    explanation: `Permission mode (${ctx.toolPermissionContext.mode}) does not allow prompts. Denying ${toolName}.`,
    attribution: { sources: [] }
  };
}

export async function decideToolInvocationPermission(
  subject: ToolPermissionSubject,
  ctx: ToolPermissionCheckContext,
  options: { signal?: AbortSignal } = {}
): Promise<PermissionDecision> {
  const toolName = subject.toolName;
  const signal = options.signal;
  if (signal?.aborted) {
    return {
      behavior: "deny",
      reasonCode: "aborted",
      explanation: "Request cancelled",
      attribution: { sources: [] },
      errors: [{ code: "task_cancelled", message: "aborted" }]
    };
  }

  const denyRule = findFirstPlainRule(ctx.toolPermissionContext, toolName, "deny");
  if (denyRule) {
    return {
      behavior: "deny",
      reasonCode: "rule_deny",
      explanation: `Permission to use ${toolName} has been denied.`,
      attribution: { sources: [denyRule.source], matchedRule: denyRule }
    };
  }

  const askRule = findFirstPlainRule(ctx.toolPermissionContext, toolName, "ask");
  if (askRule) {
    const isBash = isBashToolName(toolName);
    const ignoreAskForBash =
      isBash && ctx.sandbox.sandboxingEnabled && ctx.sandbox.autoAllowBashIfSandboxed === true;
    if (!ignoreAskForBash) {
      if (ctx.toolPermissionContext.mode === "dontAsk") return denyDontAsk(toolName, ctx);
      return {
        behavior: "ask",
        reasonCode: "rule_ask",
        explanation: formatPermissionExplanation(toolName, { type: "rule", rule: askRule }),
        attribution: { sources: [askRule.source], matchedRule: askRule }
      };
    }
  }

  let toolSpecific: { decision: "deny" | "ask" | "allow" | "passthrough"; explanation?: string; updatedInput?: unknown; requiresUserInteraction?: boolean } = {
    decision: "passthrough"
  };
  const toolErrors: EngineError[] = [];

  if (subject.checkPermissions) {
    try {
      const res = await subject.checkPermissions(subject.input, ctx);
      toolSpecific =
        res.behavior === "deny"
          ? { decision: "deny", ...(res.explanation !== undefined ? { explanation: res.explanation } : {}) }
          : res.behavior === "ask"
            ? {
                decision: "ask",
                ...(res.explanation !== undefined ? { explanation: res.explanation } : {}),
                ...(res.requiresUserInteraction !== undefined ? { requiresUserInteraction: res.requiresUserInteraction } : {})
              }
            : res.behavior === "allow"
              ? {
                  decision: "allow",
                  ...(res.explanation !== undefined ? { explanation: res.explanation } : {}),
                  ...(res.updatedInput !== undefined ? { updatedInput: res.updatedInput } : {})
                }
              : { decision: "passthrough", ...(res.explanation !== undefined ? { explanation: res.explanation } : {}) };
    } catch (error) {
      toolErrors.push(toEngineError(error));
      toolSpecific = { decision: "passthrough", explanation: `Tool-specific permission check failed for ${toolName}` };
    }
  }

  if (toolSpecific.decision === "deny") {
    return {
      behavior: "deny",
      reasonCode: "tool_specific_deny",
      explanation: toolSpecific.explanation ?? `Tool ${toolName} denied by tool-specific check.`,
      attribution: { sources: [] },
      ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
    };
  }

  const requiresInteraction = subject.requiresUserInteraction === true || toolSpecific.requiresUserInteraction === true;
  if (requiresInteraction && toolSpecific.decision === "ask") {
    if (ctx.toolPermissionContext.mode === "dontAsk") return denyDontAsk(toolName, ctx);
    return {
      behavior: "ask",
      reasonCode: "tool_specific_ask",
      explanation: toolSpecific.explanation ?? formatPermissionExplanation(toolName),
      attribution: { sources: [] },
      ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
    };
  }

  const mode = ctx.toolPermissionContext.mode;
  const bypassAllowedByPolicy = ctx.policy.allowBypassPermissionsMode === true;
  if ((mode === "bypassPermissions" || (mode === "plan" && ctx.toolPermissionContext.isBypassPermissionsModeAvailable)) && bypassAllowedByPolicy) {
    return {
      behavior: "allow",
      reasonCode: "mode_override_allow",
      explanation: `Allowed by permission mode (${mode}).`,
      attribution: { sources: [] },
      ...(toolSpecific.updatedInput !== undefined ? { updatedInput: toolSpecific.updatedInput } : { updatedInput: subject.input }),
      ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
    };
  }

  const allowRule = findFirstPlainRule(ctx.toolPermissionContext, toolName, "allow");
  if (allowRule) {
    return {
      behavior: "allow",
      reasonCode: "rule_allow",
      explanation: `Allowed by permission rule '${formatPermissionRuleValue(allowRule.ruleValue)}'.`,
      attribution: { sources: [allowRule.source], matchedRule: allowRule },
      ...(toolSpecific.updatedInput !== undefined ? { updatedInput: toolSpecific.updatedInput } : { updatedInput: subject.input }),
      ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
    };
  }

  if (ctx.toolPermissionContext.mode === "dontAsk") return denyDontAsk(toolName, ctx);

  if (toolSpecific.decision === "allow") {
    return {
      behavior: "allow",
      reasonCode: "tool_specific_allow",
      explanation: toolSpecific.explanation ?? `Allowed by tool-specific decision.`,
      attribution: { sources: [] },
      ...(toolSpecific.updatedInput !== undefined ? { updatedInput: toolSpecific.updatedInput } : { updatedInput: subject.input }),
      ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
    };
  }

  if (toolSpecific.decision === "ask") {
    return {
      behavior: "ask",
      reasonCode: "tool_specific_ask",
      explanation: toolSpecific.explanation ?? formatPermissionExplanation(toolName),
      attribution: { sources: [] },
      ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
    };
  }

  return {
    behavior: "ask",
    reasonCode: "passthrough",
    explanation: toolSpecific.explanation ?? formatPermissionExplanation(toolName),
    attribution: { sources: [] },
    ...(toolErrors.length > 0 ? { errors: toolErrors } : {})
  };
}
