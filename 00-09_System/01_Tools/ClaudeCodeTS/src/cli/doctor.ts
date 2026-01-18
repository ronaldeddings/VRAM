import fs from "node:fs/promises";
import path from "node:path";
import { createSettingsManager } from "../core/settings/manager.js";
import { buildDoctorReport } from "../core/observability/doctor.js";
import { buildDiagnosticBundle, lintDiagnosticBundle } from "../core/observability/bundle.js";
import { isTelemetryOptedOutFromEnv } from "../core/observability/telemetry.js";
import { requireCapability } from "../core/types/host.js";
import { createMcpEndpointConfigProvider } from "../core/mcp/client.js";
import { computeMcpCliGateSnapshotFromEnv } from "../core/settings/effectiveConfig.js";
import type { HostCapabilities } from "../core/types/host.js";
import { deriveWorkspaceIdFromPath } from "../platform/node/workspace.js";

function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts doctor [options]",
      "",
      "Options:",
      "  --json                  Output machine-readable JSON (doctor report only)",
      "  --bundle <path>         Write a redacted diagnostic bundle JSON file",
      "  --bundle-max-bytes <n>  Maximum bundle size (default: 250000)",
      "  --help                  Show help"
    ].join("\n") + "\n"
  );
}

function parseArgs(argv: string[]): { json: boolean; bundlePath?: string; bundleMaxBytes?: number; help: boolean } {
  let json = false;
  let help = false;
  let bundlePath: string | undefined = undefined;
  let bundleMaxBytes: number | undefined = undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--json") {
      json = true;
      continue;
    }
    if (a === "--bundle") {
      bundlePath = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === "--bundle-max-bytes") {
      const v = argv[i + 1];
      i += 1;
      const n = v ? Number.parseInt(v, 10) : NaN;
      if (Number.isFinite(n) && n > 0) bundleMaxBytes = n;
      continue;
    }
    if (a === "--help" || a === "-h") {
      help = true;
      continue;
    }
  }

  return {
    json,
    help,
    ...(typeof bundlePath === "string" ? { bundlePath } : {}),
    ...(typeof bundleMaxBytes === "number" ? { bundleMaxBytes } : {})
  };
}

function printHuman(report: ReturnType<typeof buildDoctorReport>): void {
  const lines: string[] = [];
  lines.push(`claude-ts doctor`);
  lines.push(`engine: ${report.engine.name} ${report.engine.version}`);
  if (report.host.platform) lines.push(`platform: ${report.host.platform}`);
  if (report.host.connectionState) lines.push(`network: ${report.host.connectionState}`);
  lines.push(`telemetry: ${report.settings.telemetryOptOut ? "disabled (opt-out)" : "enabled"}`);
  lines.push(`mcp: ${report.mcp.mode}${report.mcp.endpointAllowed ? "" : " (endpoint disabled)"}`);
  lines.push("");
  lines.push(`settings: ${report.settings.doctor.hasErrors ? "issues detected" : "ok"}`);
  for (const e of report.settings.doctor.errors) lines.push(`- ${e.kind}: ${e.message}`);
  lines.push("");
  const missing = report.capabilities.filter((c) => c.status === "unavailable");
  lines.push(`capabilities: ${missing.length === 0 ? "ok" : `${missing.length} unavailable`}`);
  for (const m of missing) lines.push(`- ${m.key}: ${m.reason?.kind ?? "unavailable"}${m.reason?.message ? ` (${m.reason.message})` : ""}`);
  process.stdout.write(lines.join("\n") + "\n");
}

async function ensureParentDir(p: string): Promise<void> {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

export async function runDoctor(argv: string[], options: { host: HostCapabilities; engine: { name: string; version: string } }): Promise<number> {
  const parsed = parseArgs(argv);
  if (parsed.help) {
    printHelp();
    return 0;
  }

  const host = options.host;
  const workspaceId = deriveWorkspaceIdFromPath(process.cwd());
  const settings = createSettingsManager(host, { workspaceId, sessionId: "doctor" });
  await settings.initialize();

  const effective = settings.getEffective();
  const gates = computeMcpCliGateSnapshotFromEnv(process.env);

  const endpointProvider = createMcpEndpointConfigProvider({
    host,
    ttlMs: 1_000,
    discover: async () => null
  });
  const endpointConfigPresent = (await endpointProvider.get()) !== null;

  const report = buildDoctorReport({
    host,
    engine: options.engine,
    effectiveSettings: effective,
    telemetryOptOut: isTelemetryOptedOutFromEnv(process.env),
    mcp: { endpointAllowed: gates.enableMcpCliEndpoint, endpointConfigPresent }
  });

  if (parsed.json) process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  else printHuman(report);

  if (parsed.bundlePath) {
    const rnd = host.random.kind === "available" ? host.random.value : null;
    const bundleId = rnd ? `diag_${rnd.randomUUID()}` : `diag_${Date.now()}`;
    const telemetry = host.telemetry.kind === "available" ? host.telemetry.value : null;

    const bundle = buildDiagnosticBundle({
      host,
      bundleId,
      engine: options.engine,
      doctor: report,
      effectiveSettings: effective.settings,
      logs: { recent: [], dropped: 0 },
      telemetry: { recent: [], ...(telemetry?.getDropStats ? { dropStats: telemetry.getDropStats() } : {}) },
      mcpErrors: [],
      ...(parsed.bundleMaxBytes ? { maxBytes: parsed.bundleMaxBytes } : {})
    });

    const issues = lintDiagnosticBundle(bundle);
    if (issues.length > 0) {
      for (const i of issues) process.stderr.write(`Bundle lint: ${i.code}: ${i.message}\n`);
      return 1;
    }

    await ensureParentDir(parsed.bundlePath);
    await fs.writeFile(parsed.bundlePath, JSON.stringify(bundle, null, 2) + "\n", { encoding: "utf8" });
    process.stderr.write(`Wrote diagnostic bundle: ${parsed.bundlePath}\n`);
  }

  if (host.telemetry.kind === "available" && host.telemetry.value.flush) await host.telemetry.value.flush();
  return report.settings.doctor.hasErrors ? 1 : 0;
}
