import { describe, expect, test } from "bun:test";
import { availableCapability, unavailableCapability, type HostCapabilities } from "../src/core/types/host.js";
import { createTelemetryReporter, createEndpointModeTelemetryDedupePolicy } from "../src/core/observability/telemetry.js";
import { buildDiagnosticBundle, lintDiagnosticBundle } from "../src/core/observability/bundle.js";
import type { DoctorReportV1 } from "../src/core/types/diagnostics.js";
import type { TelemetryEventEnvelopeV1 } from "../src/core/types/observability.js";
import { TraceBuffer, type RuntimeSpanEvent } from "../src/core/observability/tracing.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";

function createHostWithTelemetry(buffer: TelemetryEventEnvelopeV1[]): HostCapabilities {
  return {
    clock: unavailableCapability({ kind: "not-provided" }),
    random: unavailableCapability({ kind: "not-provided" }),
    crypto: unavailableCapability({ kind: "not-provided" }),
    secrets: unavailableCapability({ kind: "not-provided" }),
    storage: unavailableCapability({ kind: "not-provided" }),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: unavailableCapability({ kind: "not-provided" }),
    lifecycle: unavailableCapability({ kind: "not-provided" }),
    telemetry: availableCapability({
      enqueue: async (evt) => void buffer.push(evt),
      flush: async () => {},
      getDropStats: () => ({ dropped: 0 })
    }),
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

describe("Phase 13: observability/logging/telemetry boundaries", () => {
  test("telemetry dedupe suppresses usage events in endpoint mode (legacy MCP CLI behavior)", async () => {
    const buf: TelemetryEventEnvelopeV1[] = [];
    const host = createHostWithTelemetry(buf);
    const reporter = createTelemetryReporter({
      host,
      env: {},
      dedupe: createEndpointModeTelemetryDedupePolicy({ endpointModeActive: true }),
      samplerSeed: "test"
    });

    await reporter.emit({
      name: "tengu_mcp_cli_command_executed",
      class: "usage",
      fields: { command: "servers", success: true, duration_ms: 1 }
    });

    expect(buf.length).toBe(0);
    expect(reporter.getSuppressedByDedupe().endpoint_mode_dedupe).toBe(1);
  });

  test("diagnostic bundle redacts secret-looking settings fields and passes lint", () => {
    const host = createHostWithTelemetry([]);
    const doctor: DoctorReportV1 = {
      kind: "doctor_report",
      schemaVersion: 1,
      generatedAtWallMs: 1,
      engine: { name: "claude-ts", version: "0.0.0" },
      host: {},
      capabilities: [],
      settings: {
        doctor: { policyOrigin: "absent", hasErrors: false, errors: [], perSource: [], policyOverrides: [] },
        telemetryOptOut: false
      },
      mcp: { endpointAllowed: false, endpointConfigPresent: false, mode: "direct_or_state_file" }
    };

    const bundle = buildDiagnosticBundle({
      host,
      bundleId: "b1",
      engine: { name: "claude-ts", version: "0.0.0" },
      doctor,
      effectiveSettings: {
        claudeAiOauth: { accessToken: "SECRET_ACCESS", refreshToken: "SECRET_REFRESH" },
        anthropicApiKey: "SECRET_API_KEY"
      } as any,
      logs: { recent: [], dropped: 0 },
      telemetry: { recent: [] },
      mcpErrors: [],
      maxBytes: 250_000
    });

    const issues = lintDiagnosticBundle(bundle);
    expect(issues).toEqual([]);
    expect(JSON.stringify(bundle)).not.toContain("SECRET_ACCESS");
    expect(JSON.stringify(bundle)).not.toContain("SECRET_REFRESH");
    expect(JSON.stringify(bundle)).not.toContain("SECRET_API_KEY");
    expect(JSON.stringify(bundle.effectiveSettingsRedacted)).toContain("<redacted>");
  });

  test("runtime kernel emits span lifecycle events to an injected trace buffer", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });
    const traces = new TraceBuffer<RuntimeSpanEvent>({ maxEvents: 50 });
    const runtime = new RuntimeKernel({ clock, idSource, onTaskEvent: (e) => traces.record(e) });

    const scope = runtime.createScope({ kind: "custom", label: "trace" });
    scope.spawn(async () => "ok", { label: "t1" });
    await runtime.getScheduler().runUntilIdle();

    const snapshot = traces.snapshot();
    expect(snapshot.some((e) => e.type === "task/queued")).toBe(true);
    expect(snapshot.some((e) => e.type === "task/started")).toBe(true);
    expect(snapshot.some((e) => e.type === "task/completed" && e.outcome === "success")).toBe(true);
  });
});

