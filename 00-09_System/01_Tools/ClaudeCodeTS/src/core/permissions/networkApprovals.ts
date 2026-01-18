import type { NetworkApprovalDecision, NetworkApprovalRequest, PermissionUpdate } from "./types.js";
import { LEGACY_NETWORK_DOMAIN_RULE_TOOL_NAME, formatLegacyNetworkDomainRule } from "./network.js";

export function suggestPermissionUpdatesForNetworkApproval(options: {
  request: NetworkApprovalRequest;
  decision: NetworkApprovalDecision;
  destination: PermissionUpdate["destination"];
}): PermissionUpdate[] {
  if (!options.decision.remember) return [];
  const ruleContent = formatLegacyNetworkDomainRule(options.request.target.host);
  const behavior = options.decision.decision === "allow" ? "allow" : "deny";
  return [
    {
      type: "addRules",
      behavior,
      destination: options.destination,
      rules: [{ toolName: LEGACY_NETWORK_DOMAIN_RULE_TOOL_NAME, ruleContent }]
    }
  ];
}

