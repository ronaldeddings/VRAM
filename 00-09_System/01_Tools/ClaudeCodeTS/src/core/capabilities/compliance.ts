import type { CapabilityUnavailableReason, HostCapabilities } from "../types/host.js";
import { HOST_CAPABILITIES } from "./catalog.js";

export type CapabilityComplianceEntry = {
  key: string;
  available: boolean;
  optional: boolean;
  reason?: CapabilityUnavailableReason;
};

export type CapabilityComplianceReport = {
  entries: CapabilityComplianceEntry[];
  missingRequired: string[];
};

export function buildCapabilityComplianceReport(host: HostCapabilities): CapabilityComplianceReport {
  const entries: CapabilityComplianceEntry[] = [];
  const missingRequired: string[] = [];

  for (const desc of HOST_CAPABILITIES) {
    const cap = host[desc.key];
    if (cap.kind === "available") {
      entries.push({ key: String(desc.key), available: true, optional: desc.optional });
    } else {
      entries.push({ key: String(desc.key), available: false, optional: desc.optional, reason: cap.reason });
      if (!desc.optional) missingRequired.push(String(desc.key));
    }
  }

  return { entries, missingRequired };
}

