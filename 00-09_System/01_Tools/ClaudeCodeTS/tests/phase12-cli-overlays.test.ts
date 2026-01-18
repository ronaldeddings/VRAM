import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { availableCapability, unavailableCapability, type HostCapabilities } from "../src/core/types/host.js";
import { createEngine } from "../src/core/engine/createEngine.js";
import { CliAdapter } from "../src/ui/cli/adapter.js";

function createMinimalHost(clock: TestClock): HostCapabilities {
  return {
    clock: availableCapability({ nowMs: () => clock.nowMs(), nowWallMs: () => 0 }),
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
}

async function flushMicrotasks(times = 10): Promise<void> {
  for (let i = 0; i < times; i++) await Promise.resolve();
}

describe("Phase 12: CLI overlay interactions (minimum viable)", () => {
  test("tool permission overlay renders and accepts y/n", async () => {
    const clock = new TestClock(0);
    const engine = createEngine({ host: createMinimalHost(clock), clock, idSource: createMonotonicIdSource({ startAt: 0 }) });
    const cli = new CliAdapter(engine);

    await cli.start();
    await flushMicrotasks();

    await engine.dispatch({
      type: "engine/dispatchUiAction",
      action: {
        type: "ui/tool-permission/enqueue",
        request: { requestId: "t1", toolName: "Read", createdAtMonoMs: 0, rememberChoiceAllowed: true, rememberChoiceKey: "k1" }
      }
    });
    await flushMicrotasks();
    expect(cli.getFrameLines().join("\n")).toContain("overlay: tool-permission");

    await cli.sendText("y!");
    await flushMicrotasks();
    expect(cli.getFrameLines().join("\n")).toContain("overlay: none");

    await cli.stop("done");
  });

  test("elicitation overlay accepts a text response and dequeues", async () => {
    const clock = new TestClock(0);
    const engine = createEngine({ host: createMinimalHost(clock), clock, idSource: createMonotonicIdSource({ startAt: 0 }) });
    const cli = new CliAdapter(engine);

    await cli.start();
    await flushMicrotasks();

    await engine.dispatch({
      type: "engine/dispatchUiAction",
      action: {
        type: "ui/elicitation/enqueue",
        request: { requestId: "e1", createdAtMonoMs: 0, prompt: "Continue?", source: "mcp", concurrency: "serial" }
      }
    });
    await flushMicrotasks();
    expect(cli.getFrameLines().join("\n")).toContain("overlay: elicitation");

    await cli.sendText("yes");
    await flushMicrotasks();
    expect(cli.getFrameLines().join("\n")).toContain("overlay: none");

    await cli.stop("done");
  });
});
