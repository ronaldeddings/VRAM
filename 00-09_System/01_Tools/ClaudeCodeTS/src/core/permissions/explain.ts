import type { PermissionMode, PermissionRule, PermissionRuleSource } from "./types.js";
import { formatPermissionRuleValue } from "./rules.js";
import { formatPermissionRuleSource } from "./sources.js";

export type DecisionReason =
  | { type: "rule"; rule: PermissionRule }
  | { type: "mode"; mode: PermissionMode }
  | { type: "sandboxOverride" }
  | { type: "other"; reason: string };

export function formatPermissionExplanation(toolName: string, reason?: DecisionReason): string {
  if (!reason) return `Claude requested permissions to use ${toolName}, but you haven't granted it yet.`;
  switch (reason.type) {
    case "rule": {
      const rule = formatPermissionRuleValue(reason.rule.ruleValue);
      const src = formatPermissionRuleSource(reason.rule.source, "sentence");
      return `Permission rule '${rule}' from ${src} requires approval for this ${toolName} command`;
    }
    case "mode":
      return `Current permission mode (${formatPermissionModeLabel(reason.mode)}) requires approval for this ${toolName} command`;
    case "sandboxOverride":
      return "Run outside of the sandbox";
    case "other":
      return reason.reason;
  }
}

export function formatPermissionModeLabel(mode: PermissionMode): string {
  switch (mode) {
    case "default":
      return "Default";
    case "plan":
      return "Plan Mode";
    case "acceptEdits":
      return "Accept edits";
    case "bypassPermissions":
      return "Bypass Permissions";
    case "dontAsk":
      return "Don't Ask";
    default:
      return String(mode);
  }
}

export function summarizeMatchedRule(rule: PermissionRule): { source: PermissionRuleSource; rule: string } {
  return { source: rule.source, rule: formatPermissionRuleValue(rule.ruleValue) };
}

