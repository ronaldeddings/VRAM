import type { HostCapabilities } from "../types/host.js";
import type { EngineEventSensitivity, HostEvent } from "../types/events.js";
import type {
  AgentBudgetV1,
  AgentId,
  AgentKindV1,
  AgentLifecycleStateV1,
  AgentPersistencePolicyV1,
  AgentProgressV1,
  AgentRunResultV1,
  AgentSummaryV1
} from "../types/agents.js";
import type { TaskExecutionContext, TaskScope } from "../runtime/scope.js";
import type { CancellationReason } from "../types/runtime.js";

export type BackgroundAgentQualification = {
  kind: AgentKindV1;
  rationale: string;
};

export function qualifyAgentRun(input: { kind: AgentKindV1; invokedFrom: "user_prompt" | "event" | "timer" | "startup" }): BackgroundAgentQualification {
  if (input.kind === "foreground") return { kind: "foreground", rationale: "Explicitly user-invoked work bound to a prompt/command." };
  return {
    kind: "background",
    rationale:
      input.invokedFrom === "user_prompt"
        ? "Agent marked background but invoked from a prompt; treat as background with explicit UI surfacing."
        : "Non-blocking work that must be lifecycle-aware and cooperatively scheduled."
  };
}

export type AgentRunResult = AgentRunResultV1;

export type AgentEvent =
  | { type: "agent/state"; agent: AgentSummaryV1 }
  | { type: "agent/progress"; agentId: AgentId; progress: AgentProgressV1; sensitivity: EngineEventSensitivity }
  | { type: "agent/result"; agentId: AgentId; result: AgentRunResult; sensitivity: EngineEventSensitivity };

export type AgentEventSink = (event: AgentEvent) => Promise<void>;

export type AgentContext = {
  agentId: AgentId;
  signal: AbortSignal;
  host: HostCapabilities;
  task: TaskExecutionContext;
  scope: TaskScope;
  emit: AgentEventSink;
  nowMonoMs: () => number;
  getLifecycle: () => { backgrounded: boolean; network: "online" | "offline" | "unknown"; memoryPressure: "low" | "medium" | "high" | "unknown" };
};

export type AgentDefinition = {
  id: AgentId;
  name: string;
  kind: AgentKindV1;
  budget?: AgentBudgetV1;
  persistence?: AgentPersistencePolicyV1;
  requiredCapabilities?: Array<keyof HostCapabilities>;
  triggers?: {
    onHostEvent?: (event: HostEvent) => boolean;
    intervalMs?: number;
  };
  run: (ctx: AgentContext) => Promise<AgentRunResult>;
};

export type AgentInstance = {
  def: AgentDefinition;
  summary: AgentSummaryV1;
  scope: TaskScope;
  taskId: string | null;
  turnsUsed: number;
  lastHostEventAtMonoMs?: number;
};
