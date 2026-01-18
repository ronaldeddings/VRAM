import type { EngineError } from "../types/errors.js";
import type { PermissionDecision, PermissionPromptRequest } from "./types.js";

function redactEngineError(error: EngineError): EngineError {
  return { code: error.code, message: error.message };
}

export function redactPermissionDecisionForTelemetry(decision: PermissionDecision): PermissionDecision {
  const matchedRule = decision.attribution.matchedRule
    ? {
        source: decision.attribution.matchedRule.source,
        ruleBehavior: decision.attribution.matchedRule.ruleBehavior,
        ruleValue: decision.attribution.matchedRule.ruleValue.ruleContent
          ? { toolName: decision.attribution.matchedRule.ruleValue.toolName, ruleContent: "<redacted>" }
          : { toolName: decision.attribution.matchedRule.ruleValue.toolName }
      }
    : null;

  return {
    behavior: decision.behavior,
    reasonCode: decision.reasonCode,
    explanation: decision.explanation,
    attribution: {
      sources: decision.attribution.sources,
      ...(matchedRule ? { matchedRule } : {})
    },
    ...(decision.errors ? { errors: decision.errors.map(redactEngineError) } : {})
  };
}

export function redactPermissionPromptRequestForTelemetry(req: PermissionPromptRequest): PermissionPromptRequest {
  return {
    ...req,
    context: {
      ...req.context,
      ...(req.context.inputSummary !== undefined ? { inputSummary: "<redacted>" } : {}),
      ...(req.context.bash?.commandWithoutRedirections !== undefined ? { bash: { ...req.context.bash, commandWithoutRedirections: "<redacted>" } } : {})
    }
  };
}
