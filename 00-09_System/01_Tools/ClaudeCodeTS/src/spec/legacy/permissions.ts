export type PermissionRuleBehavior = "allow" | "deny" | "ask";

export type PermissionRuleSource =
  | "session"
  | "userSettings"
  | "projectSettings"
  | "localSettings"
  | "flagSettings"
  | "policySettings"
  | "cliArg"
  | "command"
  | (string & {});

export type PermissionMode =
  | "default"
  | "bypassPermissions"
  | "plan"
  | "acceptEdits"
  | "dontAsk"
  | "delegate"
  | (string & {});

export type PermissionRuleValue = {
  toolName: string;
  ruleContent?: string;
};

export function parsePermissionRuleString(rule: string): PermissionRuleValue {
  const match = /^([^(]+)\(([^)]+)\)$/.exec(rule);
  if (!match) return { toolName: rule };
  const [, toolName, ruleContent] = match;
  if (!toolName) return { toolName: rule };
  if (!ruleContent) return { toolName: rule };
  return { toolName, ruleContent };
}

export function formatPermissionRuleValue(value: PermissionRuleValue): string {
  if (value.ruleContent !== undefined) return `${value.toolName}(${value.ruleContent})`;
  return value.toolName;
}

export const LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE = [
  "userSettings",
  "projectSettings",
  "localSettings",
  "flagSettings",
  "policySettings",
  "cliArg",
  "command",
  "session"
] as const satisfies ReadonlyArray<
  Extract<
    PermissionRuleSource,
    | "userSettings"
    | "projectSettings"
    | "localSettings"
    | "flagSettings"
    | "policySettings"
    | "cliArg"
    | "command"
    | "session"
  >
>;

