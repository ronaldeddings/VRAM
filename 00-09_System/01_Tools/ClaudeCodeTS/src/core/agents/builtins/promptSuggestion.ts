import type { AgentDefinition } from "../types.js";
import { createBuiltInAgentId } from "../manager.js";
import type { BuiltInSubsystemPlan } from "./plans.js";

export type PromptSuggestionSuppressionReason =
  | "empty"
  | "done"
  | "too_long"
  | "formatting"
  | "context_limit_error"
  | "gratitude_or_closure";

export function suppressPromptSuggestion(text: string, options: { maxChars?: number } = {}): { suppressed: boolean; reason?: PromptSuggestionSuppressionReason } {
  const maxChars = options.maxChars ?? 100;
  const trimmed = text.trim();
  if (trimmed.length === 0) return { suppressed: true, reason: "empty" };
  if (trimmed.toLowerCase() === "done") return { suppressed: true, reason: "done" };
  if (trimmed.length >= maxChars) return { suppressed: true, reason: "too_long" };
  if (/[`*_#>\[\]\(\)]/.test(trimmed)) return { suppressed: true, reason: "formatting" };
  if (/context\s+limit|maximum\s+context|too\s+many\s+tokens/i.test(trimmed)) return { suppressed: true, reason: "context_limit_error" };
  if (/\b(thanks|thank you|thx|great job|good job|all set|that'?s all|no further action)\b/i.test(trimmed)) {
    return { suppressed: true, reason: "gratitude_or_closure" };
  }
  return { suppressed: false };
}

export function shouldOfferPromptSuggestion(options: {
  nowMonoMs: number;
  lastShownAtMonoMs: number | null;
  lastUserPromptAtMonoMs: number | null;
  minIntervalMs?: number;
}): boolean {
  const minIntervalMs = options.minIntervalMs ?? 60_000;
  if (options.lastUserPromptAtMonoMs === null) return false;
  if (options.lastShownAtMonoMs !== null && options.nowMonoMs - options.lastShownAtMonoMs < minIntervalMs) return false;
  if (options.nowMonoMs < options.lastUserPromptAtMonoMs) return false;
  return true;
}

export const PROMPT_SUGGESTION_PLAN: BuiltInSubsystemPlan = {
  id: "prompt_suggestion",
  name: "Prompt suggestion",
  featureGates: ["tengu_prompt_suggestion", "CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION"],
  configKnobs: ["promptSuggestion.minIntervalMs", "promptSuggestion.maxChars"],
  triggers: [{ kind: "event", event: "post_turn_idle", note: "Legacy runs from main UI loop when idle; v3 should schedule via agent manager." }],
  requiredCapabilities: [{ key: "storage", note: "Stores last-shown timestamps and suppression state." }],
  mobileSafeFallback: "If storage is unavailable, do not generate suggestions; suppress silently.",
  privacyNotes: ["Never store raw model thoughts; store only the displayed suggestion string (or a hash) and timestamps."]
};

export const PROMPT_SUGGESTION_AGENT: AgentDefinition = {
  id: createBuiltInAgentId("prompt_suggestion"),
  name: "Prompt suggestion",
  kind: "background",
  budget: { maxTurns: 1, timeoutMs: 10_000, priority: "low" },
  persistence: { kind: "none" },
  requiredCapabilities: ["storage"],
  triggers: { onHostEvent: (evt) => evt.type === "host/foregrounded" },
  run: async (ctx) => {
    void ctx;
    return { kind: "completed" };
  }
};
