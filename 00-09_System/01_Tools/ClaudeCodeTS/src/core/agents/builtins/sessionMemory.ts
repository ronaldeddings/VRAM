import type { AgentDefinition } from "../types.js";
import { createBuiltInAgentId } from "../manager.js";
import { canonicalJsonStringify } from "../../types/canonicalJson.js";
import type { BuiltInSubsystemPlan } from "./plans.js";

export type SessionMemoryNotesV1 = {
  schemaVersion: 1;
  sessionId: string;
  createdAtMonoMs: number;
  updatedAtMonoMs: number;
  lastCheckpointId?: string;
  notes: string;
};

export type SessionMemoryCheckpointV1 = {
  checkpointId: string;
  transcriptEventId: string;
  createdAtMonoMs: number;
};

export function encodeSessionMemoryNotes(notes: SessionMemoryNotesV1): string {
  return canonicalJsonStringify(notes);
}

export function decodeSessionMemoryNotes(text: string): SessionMemoryNotesV1 {
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== "object") throw new Error("Session memory notes is not an object");
  const obj = parsed as Record<string, unknown>;
  if (obj["schemaVersion"] !== 1) throw new Error(`Unsupported session memory notes schemaVersion: ${String(obj["schemaVersion"])}`);
  if (typeof obj["sessionId"] !== "string") throw new Error("Session memory notes missing sessionId");
  if (typeof obj["notes"] !== "string") throw new Error("Session memory notes missing notes");
  return parsed as SessionMemoryNotesV1;
}

export const SESSION_MEMORY_PLAN: BuiltInSubsystemPlan = {
  id: "session_memory",
  name: "Session memory",
  featureGates: ["tengu_session_memory", "tengu_sm_compact"],
  configKnobs: ["sessionMemory.enabled", "sessionMemory.compactionPreference", "sessionMemory.checkpointIntervalTurns"],
  triggers: [
    { kind: "event", event: "repl_main_thread_turn_end", note: "Legacy requires querySource === repl_main_thread; v3 should mirror via host events." }
  ],
  requiredCapabilities: [{ key: "storage", note: "Notes and checkpoints persist via host storage; filesystem is optional." }],
  mobileSafeFallback: "If storage is unavailable, disable memory updates and fall back to in-memory summarization only for the current run.",
  privacyNotes: ["Notes are user-visible summaries; never persist raw prompts/responses beyond what transcript already stores."]
};

export const SESSION_MEMORY_AGENT: AgentDefinition = {
  id: createBuiltInAgentId("session_memory"),
  name: "Session memory",
  kind: "background",
  budget: { maxConcurrent: 1, timeoutMs: 60_000, priority: "low" },
  persistence: { kind: "summary", sensitivity: "internal" },
  requiredCapabilities: ["storage"],
  run: async (ctx) => {
    void ctx;
    return { kind: "completed" };
  }
};
