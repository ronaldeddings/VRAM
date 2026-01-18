import type { JsonObject } from "../types/json.js";
import type { EngineError } from "../types/errors.js";
import type { HostCapabilities } from "../types/host.js";
import type { EffectiveSettingsResult, SettingsSource, WritableSettingsSource } from "../settings/types.js";

export type PermissionRuleBehavior = "allow" | "deny" | "ask";

export type PermissionRuleSource = SettingsSource | (string & {});

export type PermissionMode = "default" | "plan" | "acceptEdits" | "bypassPermissions" | "dontAsk" | (string & {});

export type PermissionDiagnostic =
  | { kind: "unknown_permission_mode"; input: string; normalizedTo: "default" }
  | { kind: "invalid_tool_name"; input: string; normalizedTo: string }
  | { kind: "invalid_working_directory"; input: string; normalizedTo: string | null }
  | { kind: "invalid_network_target"; input: string; message: string };

export type PermissionRuleValue = { toolName: string; ruleContent?: string };

export type PermissionRule = {
  source: PermissionRuleSource;
  ruleBehavior: PermissionRuleBehavior;
  ruleValue: PermissionRuleValue;
};

export type AdditionalWorkingDirectoryEntry = { path: string; source: PermissionRuleSource };

export type ToolPermissionContext = {
  mode: PermissionMode;
  additionalWorkingDirectories: Map<string, AdditionalWorkingDirectoryEntry>;
  alwaysAllowRules: Record<string, string[]>;
  alwaysDenyRules: Record<string, string[]>;
  alwaysAskRules: Record<string, string[]>;
  isBypassPermissionsModeAvailable: boolean;
};

export type PermissionScope = "session" | WritableSettingsSource;

export type PermissionDecisionBehavior = "allow" | "deny" | "ask";

export type PermissionDecisionReasonCode =
  | "rule_deny"
  | "rule_ask"
  | "rule_allow"
  | "mode_override_allow"
  | "mode_dont_ask_denied"
  | "tool_specific_deny"
  | "tool_specific_ask"
  | "tool_specific_allow"
  | "passthrough"
  | "aborted"
  | "capability_missing"
  | "policy_denied";

export type PermissionDecisionAttribution = {
  sources: PermissionRuleSource[];
  matchedRule?: PermissionRule;
};

export type PermissionDecision = {
  behavior: PermissionDecisionBehavior;
  reasonCode: PermissionDecisionReasonCode;
  explanation: string;
  attribution: PermissionDecisionAttribution;
  suggestedUpdates?: PermissionUpdate[];
  updatedInput?: unknown;
  errors?: EngineError[];
  diagnostics?: PermissionDiagnostic[];
};

export type PermissionPromptResponseKind =
  | "allow_once"
  | "deny_once"
  | "allow_and_persist"
  | "deny_and_persist"
  | "edit_scope";

export type PermissionPromptRequest = {
  requestId: string;
  createdAtMonoMs: number;
  kind: "tool" | "network" | "sandbox";
  title: string;
  body: string;
  context: {
    toolName?: string;
    inputSummary?: string;
    bash?: { commandWithoutRedirections?: string; redirections?: BashRedirection[] };
    network?: { target: CanonicalNetworkTarget; originalUrl?: string };
  };
  why: {
    mode: PermissionMode;
    modeLabel?: string;
    matchedRule?: { source: PermissionRuleSource; behavior: PermissionRuleBehavior; rule: string; sourceLabel?: string };
  };
  allowedResponses: PermissionPromptResponseKind[];
  persistence: { allowedDestinations: PermissionScope[]; defaultDestination: PermissionScope } | null;
};

export type BashRedirectionOperator = ">" | ">>";

export type BashRedirection = {
  operator: BashRedirectionOperator;
  target: string;
  fd?: number;
};

export type SandboxConfigSnapshot = {
  sandboxingEnabled: boolean;
  autoAllowBashIfSandboxed: boolean;
  allowUnsandboxedCommands?: boolean;
};

export type ToolPermissionCheckContext = {
  settings: EffectiveSettingsResult;
  toolPermissionContext: ToolPermissionContext;
  host: HostCapabilities;
  policy: PermissionPolicySnapshot;
  sandbox: SandboxConfigSnapshot;
};

export type ToolSpecificPermissionDecision =
  | { behavior: "deny"; explanation?: string }
  | { behavior: "ask"; explanation?: string; requiresUserInteraction?: boolean }
  | { behavior: "allow"; explanation?: string; updatedInput?: unknown }
  | { behavior: "passthrough"; explanation?: string };

export type ToolPermissionSubject = {
  toolName: string;
  input: unknown;
  requiresUserInteraction?: boolean;
  checkPermissions?: (input: unknown, ctx: ToolPermissionCheckContext) => Promise<ToolSpecificPermissionDecision>;
};

export type PermissionPolicySnapshot = {
  schemaVersion: 1;
  policyOrigin: "absent" | "local" | "remote" | "invalid";
  managedOnly: boolean;
  canPersistTo: Record<WritableSettingsSource, boolean>;
  allowBypassPermissionsMode: boolean;
  allowSandboxOverride: boolean;
  allowLocalNetwork: boolean;
};

export type PermissionUpdate =
  | { type: "setMode"; mode: PermissionMode; destination: PermissionScope }
  | { type: "addRules"; behavior: PermissionRuleBehavior; destination: PermissionScope; rules: PermissionRuleValue[] }
  | { type: "replaceRules"; behavior: PermissionRuleBehavior; destination: PermissionScope; rules: PermissionRuleValue[] }
  | { type: "removeRules"; behavior: PermissionRuleBehavior; destination: PermissionScope; rules: PermissionRuleValue[] }
  | { type: "addDirectories"; destination: PermissionScope; directories: string[] }
  | { type: "removeDirectories"; destination: PermissionScope; directories: string[] };

export type PermissionAuditEvent = {
  schemaVersion: 1;
  type: "permission/updated";
  occurredAtWallMs: number;
  workspaceId?: string;
  sessionId?: string;
  actor: "user" | "policy" | "hook" | "tool" | "system";
  destination: PermissionScope;
  updates: PermissionUpdate[];
  preview?: { before?: JsonObject; after?: JsonObject };
  policyConstraintsApplied?: string[];
};

export type NetworkApprovalReason =
  | { kind: "tool"; toolName: string; message?: string }
  | { kind: "sandbox"; message?: string }
  | { kind: "redirect"; from: string; to: string }
  | { kind: "other"; message: string };

export type CanonicalNetworkTarget = {
  scheme: "http" | "https" | "ws" | "wss";
  host: string;
  port: number;
  hostKind: "hostname" | "ipv4" | "ipv6";
  classification: "public" | "loopback" | "private" | "link_local" | "unknown";
};

export type NetworkApprovalRequest = {
  requestId: string;
  createdAtMonoMs: number;
  workspaceScope: "workspace" | "global";
  target: CanonicalNetworkTarget;
  reason: NetworkApprovalReason;
  origin: "local" | "worker" | "leader";
};

export type NetworkApprovalDecision = {
  decision: "allow" | "deny";
  remember?: boolean;
  rememberScope?: "workspace" | "global";
  ttlMs?: number;
};

export type NetworkApprovalQueueItem = {
  request: NetworkApprovalRequest;
  resolve: (decision: NetworkApprovalDecision) => void;
  reject: (error: unknown) => void;
};

export type PermissionGatedCapabilities = {
  host: HostCapabilities;
  gated: HostCapabilities;
};

