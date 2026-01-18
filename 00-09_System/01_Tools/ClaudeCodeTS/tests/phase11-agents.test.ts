import { describe, expect, test } from "bun:test";
import { availableCapability, unavailableCapability } from "../src/core/types/host.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import { EventBus } from "../src/core/events/bus.js";
import { AgentManager, createBuiltInAgentId } from "../src/core/agents/manager.js";
import type { AgentDefinition } from "../src/core/agents/types.js";
import { suppressPromptSuggestion } from "../src/core/agents/builtins/promptSuggestion.js";
import { parseMagicDocHeader, renderMagicDocsTemplate } from "../src/core/agents/builtins/magicDocs.js";
import { filterHostCapabilitiesForWorker } from "../src/core/runtime/worker.js";
import { decodeDurableTasksDocument, encodeDurableTasksDocument } from "../src/core/agents/tasks.js";

describe("Phase 11: background agents + long-running tasks", () => {
  test("prompt suggestion suppression heuristics are stable", () => {
    expect(suppressPromptSuggestion("")).toEqual({ suppressed: true, reason: "empty" });
    expect(suppressPromptSuggestion("done")).toEqual({ suppressed: true, reason: "done" });
    expect(suppressPromptSuggestion("**formatting**")).toEqual({ suppressed: true, reason: "formatting" });
    expect(suppressPromptSuggestion("We hit the context limit.")).toEqual({ suppressed: true, reason: "context_limit_error" });
    expect(suppressPromptSuggestion("Next: run tests and ship")).toEqual({ suppressed: false });
  });

  test("magic docs parsing and template rendering match legacy behavior", () => {
    const contents = `# MAGIC DOC: My Doc\n\n*Keep it short*\n\nrest`;
    expect(parseMagicDocHeader(contents)).toEqual({ title: "My Doc", instructions: "Keep it short" });

    const contents2 = `# magic doc: Title Only\n\nrest`;
    expect(parseMagicDocHeader(contents2)).toEqual({ title: "Title Only" });

    expect(renderMagicDocsTemplate("Hello {{name}} {{name}}", { name: "World" })).toBe("Hello World World");
  });

  test("agent manager cancels background agents on host backgrounded", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource();

    const host = {
      clock: availableCapability({ nowMs: () => clock.nowMs() }),
      random: unavailableCapability({ kind: "not-provided" }),
      crypto: unavailableCapability({ kind: "not-provided" }),
      secrets: unavailableCapability({ kind: "not-provided" }),
      storage: unavailableCapability({ kind: "not-provided" }),
      filesystem: unavailableCapability({ kind: "not-provided" }),
      network: unavailableCapability({ kind: "not-provided" }),
      lifecycle: unavailableCapability({ kind: "not-provided" }),
      telemetry: unavailableCapability({ kind: "not-provided" }),
      background: unavailableCapability({ kind: "not-provided" }),
      fileTransfer: unavailableCapability({ kind: "not-provided" }),
      shell: unavailableCapability({ kind: "not-provided" }),
      localEndpoint: unavailableCapability({ kind: "not-provided" }),
      ipc: unavailableCapability({ kind: "not-provided" }),
      process: unavailableCapability({ kind: "not-provided" }),
      clipboard: unavailableCapability({ kind: "not-provided" }),
      notifications: unavailableCapability({ kind: "not-provided" }),
      haptics: unavailableCapability({ kind: "not-provided" })
    };

    const runtime = new RuntimeKernel({ clock, idSource });
    const bus = new EventBus({ idSource, clock });
    const mgr = new AgentManager({ host, idSource, clock, runtime, bus });

    const agentId = createBuiltInAgentId("test_background");
    const def: AgentDefinition = {
      id: agentId,
      name: "Test background agent",
      kind: "background",
      budget: { timeoutMs: 1_000, priority: "low" },
      run: async (ctx) => {
        await ctx.task.yield("low");
        return { kind: "completed" };
      }
    };
    mgr.register(def);

    await mgr.startAgent(agentId);
    await mgr.handleHostEvent({ type: "host/backgrounded" });
    await runtime.getScheduler().runUntilIdle();

    const summary = mgr.getAgent(agentId);
    expect(summary?.state).toBe("cancelled");
  });

  test("worker capability filtering never exposes secrets/ipc", () => {
    const host = {
      clock: availableCapability({ nowMs: () => 1 }),
      random: unavailableCapability({ kind: "not-provided" }),
      crypto: unavailableCapability({ kind: "not-provided" }),
      secrets: availableCapability({ getSecret: async () => "x" }),
      storage: unavailableCapability({ kind: "not-provided" }),
      filesystem: unavailableCapability({ kind: "not-provided" }),
      network: unavailableCapability({ kind: "not-provided" }),
      lifecycle: unavailableCapability({ kind: "not-provided" }),
      telemetry: unavailableCapability({ kind: "not-provided" }),
      background: unavailableCapability({ kind: "not-provided" }),
      fileTransfer: unavailableCapability({ kind: "not-provided" }),
      shell: unavailableCapability({ kind: "not-provided" }),
      localEndpoint: unavailableCapability({ kind: "not-provided" }),
      ipc: availableCapability({ send: async () => {}, onMessage: () => () => {} }),
      process: unavailableCapability({ kind: "not-provided" }),
      clipboard: unavailableCapability({ kind: "not-provided" }),
      notifications: unavailableCapability({ kind: "not-provided" }),
      haptics: unavailableCapability({ kind: "not-provided" })
    };

    const filtered = filterHostCapabilitiesForWorker(host, ["clock", "secrets", "ipc"]);
    expect(filtered.clock.kind).toBe("available");
    expect(filtered.secrets.kind).toBe("unavailable");
    expect(filtered.ipc.kind).toBe("unavailable");
  });

  test("durable task document is stable via canonical JSON and decodes", () => {
    const encoded = encodeDurableTasksDocument({ schemaVersion: 1, tasks: { t1: { schemaVersion: 1, id: "t1", scope: "app", createdAtMonoMs: 1, updatedAtMonoMs: 2 } } });
    const decoded = decodeDurableTasksDocument(encoded);
    expect(decoded.schemaVersion).toBe(1);
    expect(decoded.tasks.t1?.id).toBe("t1");
  });
});
