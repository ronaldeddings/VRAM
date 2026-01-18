import type { AgentDefinition } from "../types.js";
import { createBuiltInAgentId } from "../manager.js";

export const SESSION_QUALITY_CLASSIFIER_AGENT: AgentDefinition = {
  id: createBuiltInAgentId("session_quality_classifier"),
  name: "Session quality classifier",
  kind: "background",
  budget: { maxTurns: 1, timeoutMs: 5_000, priority: "low" },
  requiredCapabilities: ["storage"],
  run: async (ctx) => {
    void ctx;
    return { kind: "completed" };
  }
};

