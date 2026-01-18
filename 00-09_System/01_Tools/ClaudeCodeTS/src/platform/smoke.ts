import type { HostCapabilities } from "../core/types/host.js";

export type CapabilityKey = keyof HostCapabilities;

export type HostCapabilitySmokeResult = {
  missing: CapabilityKey[];
};

export function smokeCheckHostCapabilities(
  host: HostCapabilities,
  required: readonly CapabilityKey[]
): HostCapabilitySmokeResult {
  const missing: CapabilityKey[] = [];
  for (const key of required) {
    const cap = host[key];
    if (cap.kind === "unavailable") missing.push(key);
  }
  return { missing };
}

