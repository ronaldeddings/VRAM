export type LegacyKnobKind = "hostAdapterConfig" | "settingsOverlay" | "policy" | "cliOnly" | "deprecated";

export type LegacyEnvVarMapping = {
  name: string;
  kind: LegacyKnobKind;
  notes?: string;
};

export type LegacyCliFlagMapping = {
  flag: string;
  kind: LegacyKnobKind;
  notes?: string;
};

export const LEGACY_ENV_VARS: readonly LegacyEnvVarMapping[] = [
  { name: "CLAUDE_CODE_SESSION_ACCESS_TOKEN", kind: "hostAdapterConfig", notes: "Node/CLI-only credential ingress" },
  { name: "CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR", kind: "hostAdapterConfig", notes: "Node/CLI-only credential ingress (fd)" },

  { name: "ENABLE_EXPERIMENTAL_MCP_CLI", kind: "cliOnly", notes: "Gates `--mcp-cli` behavior" },
  { name: "ENABLE_MCP_CLI_ENDPOINT", kind: "cliOnly", notes: "Gates endpoint mode inside MCP CLI" },
  { name: "MCP_TOOL_TIMEOUT", kind: "settingsOverlay", notes: "Maps to MCP tool timeout in effective config" },
  { name: "MAX_MCP_OUTPUT_TOKENS", kind: "settingsOverlay", notes: "Maps to output token limits in effective config" },

  { name: "CLAUDE_CODE_SHELL_PREFIX", kind: "cliOnly", notes: "Legacy command-hook shell prefix; redesign candidate" },

  { name: "CLAUDE_CODE_ENTRYPOINT", kind: "cliOnly", notes: "Selects special entrypoint behavior" },
  { name: "CLAUDE_CODE_ACTION", kind: "cliOnly", notes: "GitHub Action entrypoint" },
  { name: "GITHUB_ACTIONS", kind: "cliOnly", notes: "GitHub Actions runtime detection" }
] as const;

export const LEGACY_CLI_FLAGS: readonly LegacyCliFlagMapping[] = [
  { flag: "--mcp-cli", kind: "cliOnly", notes: "Internal MCP CLI entrypoint (gated by env var)" },
  { flag: "--ripgrep", kind: "cliOnly", notes: "Embedded ripgrep entrypoint (desktop/CLI only)" },
  { flag: "--version", kind: "cliOnly", notes: "Version fast path" }
] as const;

export type LegacyMcpCliGateSnapshot = {
  enableExperimentalMcpCli: boolean;
  enableMcpCliEndpoint: boolean;
  mcpToolTimeoutMs: number | null;
  maxMcpOutputTokens: number | null;
};

function parseIntEnv(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function computeLegacyMcpCliGateSnapshot(env: Record<string, string | undefined>): LegacyMcpCliGateSnapshot {
  const experimental =
    env["ENABLE_EXPERIMENTAL_MCP_CLI"] === "1" ||
    env["ENABLE_EXPERIMENTAL_MCP_CLI"] === "true" ||
    env["ENABLE_EXPERIMENTAL_MCP_CLI"] === "TRUE";

  const endpointDisabled =
    env["ENABLE_MCP_CLI_ENDPOINT"] === "0" ||
    env["ENABLE_MCP_CLI_ENDPOINT"] === "false" ||
    env["ENABLE_MCP_CLI_ENDPOINT"] === "FALSE";

  return {
    enableExperimentalMcpCli: experimental,
    enableMcpCliEndpoint: experimental && !endpointDisabled,
    mcpToolTimeoutMs: parseIntEnv(env["MCP_TOOL_TIMEOUT"]),
    maxMcpOutputTokens: parseIntEnv(env["MAX_MCP_OUTPUT_TOKENS"])
  };
}

