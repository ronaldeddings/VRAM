import type { BashRedirection, PermissionDecision, PermissionMode, PermissionPolicySnapshot, PermissionPromptRequest, PermissionScope } from "./types.js";
import { formatPermissionRuleSource } from "./sources.js";
import { formatPermissionModeLabel, summarizeMatchedRule } from "./explain.js";
import { parseBashRedirections } from "./bash.js";

export function computeAllowedPersistenceDestinations(policy: PermissionPolicySnapshot): { allowed: PermissionScope[]; defaultDestination: PermissionScope } {
  const allowed: PermissionScope[] = ["session"];
  if (policy.canPersistTo.userSettings) allowed.push("userSettings");
  if (policy.canPersistTo.projectSettings) allowed.push("projectSettings");
  if (policy.canPersistTo.localSettings) allowed.push("localSettings");

  const defaultDestination: PermissionScope =
    policy.canPersistTo.localSettings ? "localSettings" : policy.canPersistTo.projectSettings ? "projectSettings" : policy.canPersistTo.userSettings ? "userSettings" : "session";

  return { allowed, defaultDestination };
}

function toolInputSummary(toolName: string, input: unknown): { inputSummary?: string; bash?: BashContext } {
  if (toolName === "Bash") {
    if (typeof input === "string") {
      const parsed = parseBashRedirections(input);
      return { inputSummary: input, bash: parsed };
    }
    if (input && typeof input === "object" && "command" in (input as any) && typeof (input as any).command === "string") {
      const cmd = String((input as any).command);
      const parsed = parseBashRedirections(cmd);
      return { inputSummary: cmd, bash: parsed };
    }
  }
  if (typeof input === "string") return { inputSummary: input };
  return {};
}

type BashContext = { commandWithoutRedirections?: string; redirections?: BashRedirection[] };

export function buildToolPermissionPromptRequest(options: {
  requestId: string;
  createdAtMonoMs: number;
  decision: PermissionDecision;
  toolName: string;
  toolInput: unknown;
  policy: PermissionPolicySnapshot;
  mode: PermissionMode;
}): PermissionPromptRequest {
  const { allowed, defaultDestination } = computeAllowedPersistenceDestinations(options.policy);
  const matchedRule = options.decision.attribution.matchedRule ? summarizeMatchedRule(options.decision.attribution.matchedRule) : null;
  const sourceLabel = matchedRule ? formatPermissionRuleSource(matchedRule.source, "title") : undefined;

  const input = toolInputSummary(options.toolName, options.toolInput);
  const why: PermissionPromptRequest["why"] = {
    mode: options.mode,
    modeLabel: formatPermissionModeLabel(options.mode),
    ...(matchedRule
      ? {
          matchedRule: {
            source: matchedRule.source,
            behavior: options.decision.attribution.matchedRule!.ruleBehavior,
            rule: matchedRule.rule,
            ...(sourceLabel !== undefined ? { sourceLabel } : {})
          }
        }
      : {})
  };
  return {
    requestId: options.requestId,
    createdAtMonoMs: options.createdAtMonoMs,
    kind: "tool",
    title: "Permission required",
    body: options.decision.explanation,
    context: {
      toolName: options.toolName,
      ...(input.inputSummary !== undefined ? { inputSummary: input.inputSummary } : {}),
      ...(input.bash !== undefined ? { bash: input.bash } : {})
    },
    why,
    allowedResponses: ["allow_once", "deny_once", "allow_and_persist", "deny_and_persist", "edit_scope"],
    persistence: { allowedDestinations: allowed, defaultDestination }
  };
}
