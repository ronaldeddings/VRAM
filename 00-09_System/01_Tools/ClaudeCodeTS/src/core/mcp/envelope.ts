import type { VersionedEnvelopeBase } from "../types/schema.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { McpCorrelationIds } from "./types.js";
import { ProtocolError } from "./errors.js";

export type McpOperation =
  | "mcp.servers/list"
  | "mcp.tools/list"
  | "mcp.tools/info"
  | "mcp.tools/call"
  | "mcp.resources/list"
  | "mcp.resources/read"
  | "mcp.grep";

export type McpRequestEnvelopeV1 = VersionedEnvelopeBase & {
  kind: "mcp_envelope";
  schemaVersion: typeof SCHEMA_VERSION.mcpEnvelope;
  type: "request";
  requestId: string;
  op: McpOperation;
  correlation: McpCorrelationIds;
  params: unknown;
  resume?: { token?: string };
};

export type McpResponseEnvelopeV1 = VersionedEnvelopeBase & {
  kind: "mcp_envelope";
  schemaVersion: typeof SCHEMA_VERSION.mcpEnvelope;
  type: "response";
  requestId: string;
  op: McpOperation;
  correlation: McpCorrelationIds;
  ok: boolean;
  result?: unknown;
  error?: { code: string; message: string; retryable?: boolean; details?: unknown; type?: string };
  resume?: { token?: string };
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export function assertValidMcpRequestEnvelopeV1(value: unknown): McpRequestEnvelopeV1 {
  if (!isPlainObject(value)) throw new ProtocolError("MCP request envelope must be an object");
  if (value.kind !== "mcp_envelope") throw new ProtocolError("MCP envelope kind mismatch");
  if (value.schemaVersion !== SCHEMA_VERSION.mcpEnvelope) throw new ProtocolError("MCP envelope schemaVersion mismatch");
  if (value.type !== "request") throw new ProtocolError("MCP envelope type mismatch (expected request)");
  if (!isString(value.requestId) || value.requestId.trim() === "") throw new ProtocolError("MCP requestId missing");
  if (!isString(value.op) || value.op.trim() === "") throw new ProtocolError("MCP op missing");
  if (!("correlation" in value)) throw new ProtocolError("MCP correlation missing");
  if (!("params" in value)) throw new ProtocolError("MCP params missing");
  return value as McpRequestEnvelopeV1;
}

export function assertValidMcpResponseEnvelopeV1(value: unknown): McpResponseEnvelopeV1 {
  if (!isPlainObject(value)) throw new ProtocolError("MCP response envelope must be an object");
  if (value.kind !== "mcp_envelope") throw new ProtocolError("MCP envelope kind mismatch");
  if (value.schemaVersion !== SCHEMA_VERSION.mcpEnvelope) throw new ProtocolError("MCP envelope schemaVersion mismatch");
  if (value.type !== "response") throw new ProtocolError("MCP envelope type mismatch (expected response)");
  if (!isString(value.requestId) || value.requestId.trim() === "") throw new ProtocolError("MCP response requestId missing");
  if (!isString(value.op) || value.op.trim() === "") throw new ProtocolError("MCP response op missing");
  if (typeof value.ok !== "boolean") throw new ProtocolError("MCP response ok missing");
  return value as McpResponseEnvelopeV1;
}

