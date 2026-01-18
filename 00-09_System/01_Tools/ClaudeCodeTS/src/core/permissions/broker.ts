import type { PermissionPromptRequest } from "./types.js";
import type { NetworkApprovalDecision, NetworkApprovalRequest } from "./types.js";

export type ApprovalTimeout = { timeoutMs: number };

export type ApprovalBroker = {
  requestToolPermission: (req: PermissionPromptRequest, options?: ApprovalTimeout) => Promise<{ decision: "allow" | "deny"; remember?: boolean; destination?: "session" | "userSettings" | "projectSettings" | "localSettings" }>;
  requestNetworkApproval: (req: NetworkApprovalRequest, options?: ApprovalTimeout) => Promise<NetworkApprovalDecision>;
};

export function createLocalOnlyApprovalBroker(handlers: {
  onTool: ApprovalBroker["requestToolPermission"];
  onNetwork: ApprovalBroker["requestNetworkApproval"];
}): ApprovalBroker {
  return {
    requestToolPermission: handlers.onTool,
    requestNetworkApproval: handlers.onNetwork
  };
}

export type LeaderWorkerApprovalMessage =
  | { type: "approval/request"; requestId: string; payload: PermissionPromptRequest | NetworkApprovalRequest }
  | { type: "approval/response"; requestId: string; decision: unknown }
  | { type: "approval/cancel"; requestId: string; reason: string }
  | { type: "approval/ack"; requestId: string };

export type LeaderWorkerApprovalTransport = {
  send: (msg: LeaderWorkerApprovalMessage) => Promise<void>;
  subscribe: (handler: (msg: LeaderWorkerApprovalMessage) => void) => () => void;
};

