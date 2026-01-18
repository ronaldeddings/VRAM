import type { HostCapabilities } from "../types/host.js";
import { unavailableCapability } from "../types/host.js";
import type { CapabilityAuditLog } from "./audit.js";
import { auditWrap } from "./audit.js";
import type { CapabilityPolicy, CapabilityPolicyContext } from "./policy.js";

export type CapabilityViewOptions = {
  policy?: CapabilityPolicy;
  policyContext?: CapabilityPolicyContext;
  policyId?: string;
  audit?: CapabilityAuditLog;
};

export function createCapabilityView(
  host: HostCapabilities,
  allowed: readonly (keyof HostCapabilities)[],
  options?: CapabilityViewOptions
): HostCapabilities {
  const allowedSet = new Set<keyof HostCapabilities>(allowed);
  const out: Record<string, unknown> = {};
  const policy = options?.policy;
  const policyContext = options?.policyContext;

  for (const key of Object.keys(host) as (keyof HostCapabilities)[]) {
    const cap = host[key];
    if (!allowedSet.has(key)) {
      out[key as string] = unavailableCapability({
        kind: "policy-denied",
        ...(options?.policyId !== undefined ? { policyId: options.policyId } : {}),
        message: `Capability '${String(key)}' not granted to this subject`
      });
      continue;
    }

    if (cap.kind === "available" && policy && policyContext) {
      const decision = policy.decide(key, policyContext);
      if (!decision.allowed) {
        const policyId = decision.policyId ?? options?.policyId;
        out[key as string] = unavailableCapability({
          kind: "policy-denied",
          ...(policyId !== undefined ? { policyId } : {}),
          message: decision.reason
        });
        continue;
      }
    }

    if (cap.kind === "available" && options?.audit && typeof cap.value === "object" && cap.value !== null) {
      out[key as string] = { kind: "available", value: auditWrap(String(key), cap.value as object, options.audit) };
    } else {
      out[key as string] = cap;
    }
  }

  return out as HostCapabilities;
}
