import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { DeterministicScheduler } from "../src/core/runtime/scheduler.js";
import { createSimulatedMcpTransport } from "./helpers/mcpSimulator.js";

describe("Phase 14: MCP portable transport simulator", () => {
  test("simulated transport can delay deterministically via scheduler/clock", async () => {
    const clock = new TestClock(0);
    const scheduler = new DeterministicScheduler({ clock });

    const transport = createSimulatedMcpTransport({
      scheduler,
      delayMs: 50,
      handler: async (req) => ({
        kind: "mcp_envelope",
        schemaVersion: 1,
        type: "response",
        requestId: req.requestId,
        op: req.op,
        correlation: req.correlation,
        ok: true,
        result: { ok: true }
      })
    });

    let resolved = false;
    const pending = transport
      .send({
        kind: "mcp_envelope",
        schemaVersion: 1,
        type: "request",
        requestId: "req1",
        op: "mcp.tools/list",
        correlation: { serverId: "srv1" },
        params: {}
      })
      .then(() => {
        resolved = true;
      });

    await Promise.resolve();
    expect(resolved).toBe(false);

    clock.advanceBy(50);
    await scheduler.tick();
    await pending;
    expect(resolved).toBe(true);
  });
});

