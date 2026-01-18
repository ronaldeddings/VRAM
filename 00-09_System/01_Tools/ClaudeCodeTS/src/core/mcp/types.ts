import type { ToolRunId } from "../types/state.js";
import type { TaskId } from "../types/runtime.js";
import type { JsonObject } from "../types/json.js";

export type McpServerTrust = "trusted" | "untrusted" | "managed";
export type McpTransportMode = "endpoint" | "direct";

export type McpServerId = string;

export type McpServerConfig = {
  id: McpServerId;
  displayName: string;
  enabled: boolean;
  trust: McpServerTrust;
  preferredMode?: McpTransportMode;
};

export type McpConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export type McpServerStatus = {
  id: McpServerId;
  displayName: string;
  trust: McpServerTrust;
  enabled: boolean;
  mode?: McpTransportMode;
  status: McpConnectionStatus;
  hasTools: boolean;
  hasResources: boolean;
  error?: string;
};

export type McpCorrelationIds = {
  sessionId?: string;
  taskId?: TaskId;
  toolRunId?: ToolRunId;
  serverId?: McpServerId;
  mcpRequestId?: string;
};

export type McpToolDescriptor = {
  serverId: McpServerId;
  name: string;
  description?: string;
  inputSchema?: JsonObject;
  outputSchema?: JsonObject;
  signature?: string;
  originalToolName?: string;
};

export type McpResourceDescriptor = {
  serverId: McpServerId;
  uri: string;
  name?: string;
  mimeType?: string;
  description?: string;
};

export type McpManifest = {
  serverId: McpServerId;
  tools: McpToolDescriptor[];
  resources: McpResourceDescriptor[];
  manifestHash?: string;
  fetchedAtMonoMs: number;
  authIdentityHash?: string;
};

export type McpEndpointConfig = {
  url: string;
  bearerKey: string;
  fetchedAtWallMs?: number;
  expiresAtWallMs?: number;
  authIdentityHash?: string;
};

export type McpToolCallParams = {
  serverId: McpServerId;
  tool: string;
  args: unknown;
  timeoutMs: number;
};

export type McpToolStreamEvent =
  | { kind: "text"; text: string }
  | { kind: "structured"; value: unknown; schema?: string }
  | { kind: "progress"; message?: string; current?: number; total?: number }
  | { kind: "diagnostic"; message: string }
  | { kind: "final"; value: unknown };

export type McpTransportCapabilities = {
  supportsStreaming: boolean;
  supportsFetchStreaming?: boolean;
  supportsSse?: boolean;
  supportsWebSocket?: boolean;
};

