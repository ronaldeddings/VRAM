import type { HostCapabilities } from "../types/host.js";

export type CapabilitySubjectKind = "engine" | "tool" | "hook" | "agent" | "mcp";

export type CapabilityPolicyContext = {
  subject: CapabilitySubjectKind;
  toolName?: string;
  hookName?: string;
  agentName?: string;
  workspaceId?: string;
  sessionId?: string;
};

export type CapabilityPolicyDecision =
  | { allowed: true }
  | { allowed: false; reason: string; policyId?: string; userMessage?: string };

export type CapabilityPolicy = {
  decide: (capability: keyof HostCapabilities, context: CapabilityPolicyContext) => CapabilityPolicyDecision;
};

export function allowAllCapabilitiesPolicy(): CapabilityPolicy {
  return { decide: () => ({ allowed: true }) };
}

export function denyAllCapabilitiesPolicy(reason = "Denied by policy"): CapabilityPolicy {
  return { decide: () => ({ allowed: false, reason }) };
}

export function composeCapabilityPolicies(...policies: CapabilityPolicy[]): CapabilityPolicy {
  return {
    decide: (cap, context) => {
      for (const policy of policies) {
        const decision = policy.decide(cap, context);
        if (!decision.allowed) return decision;
      }
      return { allowed: true };
    }
  };
}

