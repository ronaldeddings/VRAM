export const LEGACY_MCP_ENV_VARS = {
  enableExperimentalMcpCli: "ENABLE_EXPERIMENTAL_MCP_CLI",
  enableMcpCliEndpoint: "ENABLE_MCP_CLI_ENDPOINT",
  mcpToolTimeout: "MCP_TOOL_TIMEOUT",
  maxMcpOutputTokens: "MAX_MCP_OUTPUT_TOKENS"
} as const;

export type LegacyMcpCliMode = "endpoint" | "state-file";

