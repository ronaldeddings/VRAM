import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { availableCapability, unavailableCapability, type HostCapabilities } from "../src/core/types/host.js";
import { createSeededRandom } from "../src/core/runtime/seededRandom.js";
import { createEngine } from "../src/core/engine/createEngine.js";
import { CliAdapter } from "../src/ui/cli/adapter.js";

function createMinimalHost(clock: TestClock): HostCapabilities {
  const rng = createSeededRandom("phase12");
  return {
    clock: availableCapability({ nowMs: () => clock.nowMs(), nowWallMs: () => 0 }),
    random: availableCapability({ randomUUID: () => rng.randomUUID() }),
    crypto: unavailableCapability({ kind: "not-provided" }),
    secrets: unavailableCapability({ kind: "not-provided" }),
    storage: unavailableCapability({ kind: "not-provided" }),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: unavailableCapability({ kind: "not-provided" }),
    lifecycle: availableCapability({ subscribe: () => () => {}, getConnectionState: () => "unknown" }),
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

describe("Phase 12: CLI adapter wiring", () => {
  test("feeds user input into engine and supports transcript toggle", async () => {
    const clock = new TestClock(0);
    const engine = createEngine({ host: createMinimalHost(clock), clock, idSource: createMonotonicIdSource({ startAt: 0 }) });
    const cli = new CliAdapter(engine);

    await cli.start();
    expect(cli.getFrameLines().join("\n")).toContain("screen: prompt");

    await cli.sendText("hello");
    expect(cli.getFrameLines().join("\n")).toContain("last: user: hello");

    cli.applyHotkey("ctrl+o");
    const transcriptLines = cli.getFrameLines().join("\n");
    expect(transcriptLines).toContain("screen: transcript");
    expect(transcriptLines).toContain("Showing detailed transcript · ctrl+o to toggle");
    expect(transcriptLines).toContain("- user: hello");

    await cli.stop("done");
  });
});

