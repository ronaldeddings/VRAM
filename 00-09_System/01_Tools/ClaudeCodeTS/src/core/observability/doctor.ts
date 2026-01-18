import type { HostCapabilities } from "../types/host.js";
import type { CapabilityMatrixEntry, DoctorReportV1 } from "../types/diagnostics.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { EffectiveSettingsResult } from "../settings/types.js";
import { buildSettingsDoctorReport } from "../settings/doctor.js";

function hostPlatform(host: HostCapabilities): string | undefined {
  if (host.process.kind !== "available") return undefined;
  return typeof host.process.value.platform === "function" ? host.process.value.platform() : undefined;
}

function hostConnectionState(host: HostCapabilities): "online" | "offline" | "unknown" | undefined {
  if (host.lifecycle.kind !== "available") return undefined;
  if (typeof host.lifecycle.value.getConnectionState !== "function") return undefined;
  return host.lifecycle.value.getConnectionState();
}

export function buildCapabilityMatrix(host: HostCapabilities): CapabilityMatrixEntry[] {
  const out: CapabilityMatrixEntry[] = [];
  for (const [k, cap] of Object.entries(host)) {
    if (!cap || typeof cap !== "object" || !("kind" in cap)) continue;
    if (cap.kind === "available") out.push({ key: k, status: "available" });
    else {
      const reason = cap.reason;
      out.push({
        key: k,
        status: "unavailable",
        reason: {
          kind: reason.kind,
          ...(reason.message ? { message: reason.message } : {}),
          ...("policyId" in reason && typeof reason.policyId === "string" ? { policyId: reason.policyId } : {})
        }
      });
    }
  }
  out.sort((a, b) => a.key.localeCompare(b.key));
  return out;
}

export function buildDoctorReport(options: {
  host: HostCapabilities;
  engine: { name: string; version: string };
  effectiveSettings: EffectiveSettingsResult;
  telemetryOptOut: boolean;
  mcp: { endpointAllowed: boolean; endpointConfigPresent: boolean };
}): DoctorReportV1 {
  const { host, engine, effectiveSettings } = options;
  const endpointAllowed = options.mcp.endpointAllowed;
  const endpointConfigPresent = options.mcp.endpointConfigPresent;
  const platform = hostPlatform(host);
  const connectionState = hostConnectionState(host);

  return {
    kind: "doctor_report",
    schemaVersion: SCHEMA_VERSION.doctorReport,
    generatedAtWallMs: Date.now(),
    engine,
    host: { ...(platform ? { platform } : {}), ...(connectionState ? { connectionState } : {}) },
    capabilities: buildCapabilityMatrix(host),
    settings: {
      doctor: buildSettingsDoctorReport(effectiveSettings),
      telemetryOptOut: options.telemetryOptOut
    },
    mcp: {
      endpointAllowed,
      endpointConfigPresent,
      mode: endpointAllowed && endpointConfigPresent ? "endpoint" : "direct_or_state_file"
    }
  };
}
