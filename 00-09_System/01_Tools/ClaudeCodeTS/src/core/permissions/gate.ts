import type { HostCapabilities, HostNetwork } from "../types/host.js";
import { availableCapability } from "../types/host.js";
import type { NetworkApprovalDecision, NetworkApprovalReason, NetworkApprovalRequest, PermissionPolicySnapshot } from "./types.js";
import { canonicalizeNetworkTargetFromUrl } from "./network.js";

function urlFromRequestInfo(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  const anyInput = input as any;
  if (typeof anyInput?.url === "string") return anyInput.url;
  return String(input);
}

export type NetworkApprovalHandler = (request: NetworkApprovalRequest) => Promise<NetworkApprovalDecision>;

export function createPermissionGatedCapabilities(options: {
  host: HostCapabilities;
  policy: PermissionPolicySnapshot;
  approveNetwork: NetworkApprovalHandler;
  createRequestId: () => string;
  nowMonoMs: () => number;
  workspaceScope?: "workspace" | "global";
  origin?: NetworkApprovalRequest["origin"];
  reason?: NetworkApprovalReason;
}): { host: HostCapabilities; gated: HostCapabilities } {
  const workspaceScope = options.workspaceScope ?? "workspace";
  const origin = options.origin ?? "local";
  const reason = options.reason ?? { kind: "sandbox" };

  const gated: HostCapabilities = { ...options.host };
  if (options.host.network.kind !== "available") return { host: options.host, gated };

  const baseNetwork = options.host.network.value;
  const rememberedAllow = new Set<string>();

  const gatedNetwork: HostNetwork = {
    fetch: async (input, init) => {
      const urlStr = urlFromRequestInfo(input as any);
      const canonical = canonicalizeNetworkTargetFromUrl(urlStr);
      if (!canonical.ok) {
        throw { code: "permission_denied", message: "Invalid network target", details: canonical.diagnostics };
      }

      if (canonical.target.classification !== "public" && options.policy.allowLocalNetwork !== true) {
        throw { code: "policy_override", message: "Local network access denied by policy", details: canonical.target };
      }

      const key = `${canonical.target.scheme}://${canonical.target.host}:${canonical.target.port}`;
      if (!rememberedAllow.has(key)) {
        const decision = await options.approveNetwork({
          requestId: options.createRequestId(),
          createdAtMonoMs: options.nowMonoMs(),
          workspaceScope,
          target: canonical.target,
          reason,
          origin
        });
        if (decision.decision !== "allow") {
          throw { code: "permission_denied", message: "Network access denied", details: { target: canonical.target } };
        }
        if (decision.remember) rememberedAllow.add(key);
      }

      return await baseNetwork.fetch(input as any, init as any);
    }
  };

  gated.network = availableCapability(gatedNetwork);
  return { host: options.host, gated };
}

