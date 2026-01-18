import type { EventBus } from "../events/bus.js";
import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import type { RuntimeKernel } from "../runtime/kernel.js";
import type { TaskScope } from "../runtime/scope.js";
import type { HostCapabilities } from "../types/host.js";
import type { HostEvent } from "../types/events.js";
import type { AgentId, AgentSummaryV1 } from "../types/agents.js";
import { asAgentId } from "../types/agents.js";
import type { CancellationReason, TaskResult } from "../types/runtime.js";
import type { AgentDefinition, AgentInstance, AgentRunResult } from "./types.js";
import { AgentRegistry } from "./registry.js";

type LifecycleState = {
  backgrounded: boolean;
  network: "online" | "offline" | "unknown";
  memoryPressure: "low" | "medium" | "high" | "unknown";
};

function initialLifecycleState(): LifecycleState {
  return { backgrounded: false, network: "unknown", memoryPressure: "unknown" };
}

export class AgentManager {
  private readonly host: HostCapabilities;
  private readonly idSource: IdSource;
  private readonly clock: MonotonicClock;
  private readonly runtime: RuntimeKernel;
  private readonly bus: EventBus;

  private readonly registry = new AgentRegistry();
  private readonly scope: TaskScope;
  private lifecycle: LifecycleState = initialLifecycleState();
  private lastUserInputAtMonoMs: number | null = null;

  private readonly backgroundLimiterName = "agents_background";
  private readonly backgroundMaxConcurrent: number;
  private readonly userActiveWindowMs: number;

  private readonly agents = new Map<AgentId, AgentInstance>();
  private readonly warnOnce = new Set<string>();

  constructor(options: {
    host: HostCapabilities;
    idSource: IdSource;
    clock: MonotonicClock;
    runtime: RuntimeKernel;
    bus: EventBus;
    backgroundBudget?: { maxConcurrentBackgroundAgents?: number; userActiveWindowMs?: number };
  }) {
    this.host = options.host;
    this.idSource = options.idSource;
    this.clock = options.clock;
    this.runtime = options.runtime;
    this.bus = options.bus;
    this.scope = this.runtime.createScope({ kind: "agent", label: "agent_manager" });
    this.backgroundMaxConcurrent = Math.max(1, options.backgroundBudget?.maxConcurrentBackgroundAgents ?? 2);
    this.userActiveWindowMs = Math.max(0, options.backgroundBudget?.userActiveWindowMs ?? 5_000);
    this.runtime.defineLimiter(this.backgroundLimiterName, this.backgroundMaxConcurrent);
  }

  getRegistry(): AgentRegistry {
    return this.registry;
  }

  register(def: AgentDefinition): void {
    this.registry.register(def);
    const now = this.clock.nowMs();
    const summary: AgentSummaryV1 = {
      id: def.id,
      kind: def.kind,
      name: def.name,
      state: "scheduled",
      createdAtMonoMs: now,
      updatedAtMonoMs: now,
      ...(def.persistence ? { persistence: def.persistence } : {})
    };
    const agentScope = this.runtime.createScope({ kind: "agent", label: `agent:${def.name}`, parentScopeId: this.scope.id });
    this.agents.set(def.id, { def, summary, scope: agentScope, taskId: null, turnsUsed: 0 });
    void this.bus.emit({ type: "agent/updated", agent: summary }, { channel: "debug", severity: "info", sensitivity: "internal" });
  }

  getAgent(id: AgentId): AgentSummaryV1 | null {
    return this.agents.get(id)?.summary ?? null;
  }

  listAgents(): AgentSummaryV1[] {
    return [...this.agents.values()]
      .map((a) => a.summary)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async handleHostEvent(event: HostEvent): Promise<void> {
    const now = this.clock.nowMs();
    if (event.type === "host/user-input") this.lastUserInputAtMonoMs = now;
    if (event.type === "host/backgrounded") this.lifecycle = { ...this.lifecycle, backgrounded: true };
    if (event.type === "host/foregrounded") this.lifecycle = { ...this.lifecycle, backgrounded: false };
    if (event.type === "host/network-state") this.lifecycle = { ...this.lifecycle, network: event.state };
    if (event.type === "host/memory-pressure") this.lifecycle = { ...this.lifecycle, memoryPressure: event.level };

    for (const inst of this.agents.values()) inst.lastHostEventAtMonoMs = now;

    for (const inst of this.agents.values()) {
      const shouldRun = inst.def.triggers?.onHostEvent ? inst.def.triggers.onHostEvent(event) : false;
      if (shouldRun) await this.startAgent(inst.def.id);
    }

    if (event.type === "host/backgrounded") {
      for (const inst of this.agents.values()) {
        if (inst.def.kind !== "background") continue;
        if (inst.summary.state === "running" || inst.summary.state === "awaiting_input") {
          await this.cancelAgent(inst.def.id, { kind: "host_lifecycle", event: "backgrounded", message: "host backgrounded" });
        }
      }
    }
  }

  async startAgent(id: AgentId): Promise<void> {
    const inst = this.agents.get(id);
    if (!inst) throw new Error(`Unknown agent: ${id}`);
    if (inst.summary.state === "running") return;
    if (inst.def.kind === "background" && this.lifecycle.backgrounded) {
      this.noteWarnOnce(`agent_backgrounded:${id}`, `Skipping background agent '${inst.def.name}' while backgrounded`);
      return;
    }
    if (inst.def.requiredCapabilities?.includes("network") && this.lifecycle.network === "offline") {
      this.noteWarnOnce(`agent_offline:${id}`, `Skipping agent '${inst.def.name}' while offline`);
      return;
    }
    if (inst.def.kind === "background" && this.lifecycle.memoryPressure === "high") {
      this.noteWarnOnce(`agent_mem_high:${id}`, `Skipping background agent '${inst.def.name}' due to high memory pressure`);
      return;
    }
    if (inst.def.kind === "background" && this.lastUserInputAtMonoMs !== null && this.clock.nowMs() - this.lastUserInputAtMonoMs <= this.userActiveWindowMs) {
      this.noteWarnOnce(`agent_overload:${id}`, `Deferring background agent '${inst.def.name}' while user is active`);
      return;
    }

    const now = this.clock.nowMs();
    inst.turnsUsed += 1;
    if (inst.def.budget?.maxTurns !== undefined && inst.turnsUsed > inst.def.budget.maxTurns) {
      const next = { ...inst.summary, state: "completed" as const, updatedAtMonoMs: now, endedAtMonoMs: now };
      inst.summary = next;
      await this.bus.emit({ type: "agent/updated", agent: next }, { channel: "debug", severity: "info", sensitivity: "internal" });
      return;
    }

    const nextRunning: AgentSummaryV1 = { ...inst.summary, state: "running", updatedAtMonoMs: now, ...(inst.summary.startedAtMonoMs ? {} : { startedAtMonoMs: now }) };
    inst.summary = nextRunning;
    await this.bus.emit({ type: "agent/updated", agent: nextRunning }, { channel: "debug", severity: "info", sensitivity: "internal" });

    const taskHandle = inst.scope.spawn(
      async (task) => {
        const releases: Array<() => void> = [];
        try {
          if (inst.def.kind === "background") {
            const release = await this.runtime.acquireLimiter(this.backgroundLimiterName, { ownerTaskId: task.taskId, signal: task.signal });
            releases.push(release);
          }
          if (inst.def.budget?.maxConcurrent !== undefined) {
            const limiter = `agent:${inst.def.id}`;
            this.runtime.defineLimiter(limiter, Math.max(1, inst.def.budget.maxConcurrent));
            const release = await this.runtime.acquireLimiter(limiter, { ownerTaskId: task.taskId, signal: task.signal });
            releases.push(release);
          }

        const emit = async (evt: import("./types.js").AgentEvent) => {
          if (evt.type === "agent/state") await this.bus.emit({ type: "agent/updated", agent: evt.agent }, { channel: "debug", severity: "info" });
          if (evt.type === "agent/progress") {
            await this.bus.emit(
              { type: "agent/progress", agentId: evt.agentId, progress: evt.progress },
              { channel: "debug", severity: "info", sensitivity: evt.sensitivity }
            );
          }
          if (evt.type === "agent/result") {
            await this.bus.emit(
              { type: "agent/result", agentId: evt.agentId, result: evt.result },
              { channel: "debug", severity: evt.result.kind === "failed" ? "error" : "info", sensitivity: evt.sensitivity }
            );
          }
        };

        const ctx: import("./types.js").AgentContext = {
          agentId: inst.def.id,
          signal: task.signal,
          host: this.host,
          task,
          scope: inst.scope,
          emit,
          nowMonoMs: () => this.clock.nowMs(),
          getLifecycle: () => ({ ...this.lifecycle })
        };

        const result: AgentRunResult = await inst.def.run(ctx);
        void emit({ type: "agent/result", agentId: inst.def.id, result, sensitivity: "internal" });
        return result;
        } finally {
          for (const release of releases) release();
        }
      },
      {
        label: `agent_run:${inst.def.name}`,
        priority: inst.def.budget?.priority ?? "low",
        ...(inst.def.budget?.timeoutMs !== undefined ? { timeoutMs: inst.def.budget.timeoutMs } : {})
      }
    );

    inst.taskId = taskHandle.id;
    void taskHandle.done.then(
      async (res: TaskResult) => {
        const now2 = this.clock.nowMs();
        const agentResult: AgentRunResult =
          res.kind === "success"
            ? (res.value as AgentRunResult)
            : res.kind === "cancelled" || res.kind === "timeout"
              ? { kind: "cancelled", reason: res.reason }
              : res.kind === "error"
                ? { kind: "failed", error: res.error.message }
                : { kind: "failed", error: "unknown task outcome" };
        const final = this.finalizeFromResult(inst, agentResult);
        inst.summary = { ...final, updatedAtMonoMs: now2, endedAtMonoMs: now2 };
        inst.taskId = null;
        await this.bus.emit({ type: "agent/updated", agent: inst.summary }, { channel: "debug", severity: "info", sensitivity: "internal" });
      },
      async () => {
        const now2 = this.clock.nowMs();
        inst.summary = { ...inst.summary, state: "failed", updatedAtMonoMs: now2, endedAtMonoMs: now2, error: "agent task promise rejected" };
        inst.taskId = null;
        await this.bus.emit({ type: "agent/updated", agent: inst.summary }, { channel: "debug", severity: "error", sensitivity: "internal" });
      }
    );
  }

  async cancelAgent(id: AgentId, reason: CancellationReason): Promise<void> {
    const inst = this.agents.get(id);
    if (!inst) return;
    const now = this.clock.nowMs();
    if (inst.summary.state === "cancelled" || inst.summary.state === "completed" || inst.summary.state === "failed") return;
    inst.summary = { ...inst.summary, state: "cancelled", updatedAtMonoMs: now, endedAtMonoMs: now, cancelled: reason };
    inst.scope.close(reason).catch(() => {});
    await this.bus.emit({ type: "agent/updated", agent: inst.summary }, { channel: "debug", severity: "info", sensitivity: "internal" });
  }

  async stop(options: { timeoutMs?: number; maxTicks?: number } = {}): Promise<void> {
    const reason = { kind: "stop_request", message: "agent manager stopped" } as const;
    await this.scope.close(reason);

    const maxTicks = options.maxTicks ?? 10_000;
    const deadline = this.clock.nowMs() + (options.timeoutMs ?? 10_000);
    while (this.clock.nowMs() < deadline) {
      await this.runtime.getScheduler().tick({ maxRunnables: 1000 });
      const running = [...this.agents.values()].some((a) => a.summary.state === "running" || a.summary.state === "awaiting_input");
      if (!running) return;
      if (this.runtime.getScheduler().currentTick > maxTicks) break;
    }
  }

  private finalizeFromResult(inst: AgentInstance, result: AgentRunResult): AgentSummaryV1 {
    const base = inst.summary;
    if (result.kind === "completed") return { ...base, state: "completed" };
    if (result.kind === "cancelled") return { ...base, state: "cancelled", cancelled: result.reason };
    if (result.kind === "failed") return { ...base, state: "failed", error: result.error };
    return { ...base, state: "failed", error: "unknown agent result" };
  }

  private noteWarnOnce(key: string, message: string): void {
    if (this.warnOnce.has(key)) return;
    this.warnOnce.add(key);
    void this.bus.emit({ type: "diag/log", level: "warn", message }, { channel: "diagnostic", severity: "warn", sensitivity: "internal" });
  }
}

export function createBuiltInAgentId(name: string): AgentId {
  return asAgentId(`agent:${name}`);
}
