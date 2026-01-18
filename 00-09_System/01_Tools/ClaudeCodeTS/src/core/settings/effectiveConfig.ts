import type { HostCapabilities } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import type { SettingsPolicyOrigin, SettingsSourceReadResult } from "./types.js";

export type FeatureGateKind = "portable" | "host_only" | "env_alias";

export type FeatureGateDescriptor = {
  key: string;
  kind: FeatureGateKind;
  notes?: string;
};

export const LEGACY_FEATURE_GATES: readonly FeatureGateDescriptor[] = [
  { key: "disableAllHooks", kind: "portable" },
  { key: "allowManagedHooksOnly", kind: "portable", notes: "Policy-only gate; excludes non-managed hooks" },
  { key: "ENABLE_EXPERIMENTAL_MCP_CLI", kind: "env_alias", notes: "CLI-only MCP CLI entrypoint gate" },
  { key: "ENABLE_MCP_CLI_ENDPOINT", kind: "env_alias", notes: "CLI-only MCP endpoint-mode gate" },
  { key: "MCP_TOOL_TIMEOUT", kind: "env_alias", notes: "CLI env overlay for MCP timeouts" },
  { key: "MAX_MCP_OUTPUT_TOKENS", kind: "env_alias", notes: "CLI env overlay for MCP token caps" }
];

export type EffectiveConfig = {
  schemaVersion: 1;
  policy: { origin: SettingsPolicyOrigin };
  hooks: { disabled: boolean; managedOnly: boolean };
  mcpCli: {
    enableExperimentalMcpCli: boolean;
    enableMcpCliEndpoint: boolean;
    mcpToolTimeoutMs: number | null;
    maxMcpOutputTokens: number | null;
  };
  capabilities: { hasFilesystem: boolean; hasNetwork: boolean; hasSecrets: boolean };
};

export type PersistableEffectiveConfig = Omit<EffectiveConfig, "capabilities">;

export function toPersistableEffectiveConfig(cfg: EffectiveConfig): PersistableEffectiveConfig {
  const { capabilities: _capabilities, ...rest } = cfg;
  return rest;
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readBoolean(obj: JsonObject, key: string): boolean | null {
  const v = obj[key];
  return typeof v === "boolean" ? v : null;
}

function readString(obj: JsonObject, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

function parseIntEnv(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function computeMcpCliGateSnapshotFromEnv(env: Record<string, string | undefined>): EffectiveConfig["mcpCli"] {
  const experimental = env["ENABLE_EXPERIMENTAL_MCP_CLI"] === "1" || env["ENABLE_EXPERIMENTAL_MCP_CLI"]?.toLowerCase() === "true";
  const endpointDisabledRaw = env["ENABLE_MCP_CLI_ENDPOINT"]?.trim().toLowerCase();
  const endpointDisabled = endpointDisabledRaw === "0" || endpointDisabledRaw === "false" || endpointDisabledRaw === "off";
  return {
    enableExperimentalMcpCli: experimental,
    enableMcpCliEndpoint: experimental && !endpointDisabled,
    mcpToolTimeoutMs: parseIntEnv(env["MCP_TOOL_TIMEOUT"]),
    maxMcpOutputTokens: parseIntEnv(env["MAX_MCP_OUTPUT_TOKENS"])
  };
}

export function computeEffectiveConfig(options: {
  effectiveSettings: JsonObject;
  policySource: SettingsSourceReadResult | undefined;
  policyOrigin: SettingsPolicyOrigin;
  host: HostCapabilities;
  env?: Record<string, string | undefined>;
}): EffectiveConfig {
  const disableAllHooks = readBoolean(options.effectiveSettings, "disableAllHooks") ?? false;

  const policySettings = options.policySource?.settings ?? null;
  const managedOnly =
    (policySettings && isPlainObject(policySettings) ? readBoolean(policySettings, "allowManagedHooksOnly") : null) ?? false;

  const mcpCli = computeMcpCliGateSnapshotFromEnv(options.env ?? {});

  const hasFilesystem = options.host.filesystem.kind === "available";
  const hasNetwork = options.host.network.kind === "available";
  const hasSecrets = options.host.secrets.kind === "available";

  const policyOrigin = options.policyOrigin;
  const failClosed = policyOrigin === "invalid";

  return {
    schemaVersion: 1,
    policy: { origin: policyOrigin },
    hooks: { disabled: disableAllHooks || failClosed, managedOnly: managedOnly || failClosed },
    mcpCli,
    capabilities: { hasFilesystem, hasNetwork, hasSecrets }
  };
}
