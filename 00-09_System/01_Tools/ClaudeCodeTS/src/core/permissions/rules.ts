import type { PermissionDiagnostic, PermissionRuleValue } from "./types.js";
import { normalizeMcpIdentifierSegment } from "../tools/names.js";

export function parsePermissionRuleString(rule: string): PermissionRuleValue {
  const match = /^([^(]+)\(([^)]+)\)$/.exec(rule);
  if (!match) return { toolName: rule };
  const [, toolName, ruleContent] = match;
  if (!toolName) return { toolName: rule };
  if (!ruleContent) return { toolName: rule };
  return { toolName, ruleContent };
}

export function formatPermissionRuleValue(value: PermissionRuleValue): string {
  return value.ruleContent !== undefined ? `${value.toolName}(${value.ruleContent})` : value.toolName;
}

export type McpToolNameParts = { serverName: string; toolName?: string };

export function parseMcpToolName(name: string): McpToolNameParts | null {
  const n = name.trim();
  if (!n.startsWith("mcp__")) return null;
  const rest = n.slice("mcp__".length);
  const idx = rest.indexOf("__");
  if (idx === -1) return null;
  const serverName = rest.slice(0, idx);
  const after = rest.slice(idx + 2);
  if (!serverName) return null;
  const normalizedServer = normalizeMcpIdentifierSegment(serverName);
  const normalizedTool = after.length > 0 ? normalizeMcpIdentifierSegment(after) : "";
  if (after.length > 0) return { serverName: normalizedServer, toolName: normalizedTool };
  return { serverName: normalizedServer };
}

export function normalizeToolName(input: string): { toolName: string; diagnostics: PermissionDiagnostic[] } {
  const trimmed = input.trim();
  if (!trimmed) return { toolName: "", diagnostics: [{ kind: "invalid_tool_name", input, normalizedTo: "" }] };
  const mcp = parseMcpToolName(trimmed);
  if (!mcp) return { toolName: trimmed, diagnostics: [] };

  const normalized = `mcp__${mcp.serverName}__${mcp.toolName ?? ""}`;
  if (normalized === trimmed) return { toolName: normalized, diagnostics: [] };
  return { toolName: normalized, diagnostics: [{ kind: "invalid_tool_name", input, normalizedTo: normalized }] };
}

export function isBashToolName(toolName: string): boolean {
  return toolName === "Bash";
}

export function matchesToolName(ruleToolName: string, invocationToolName: string): boolean {
  if (ruleToolName === invocationToolName) return true;
  const ruleMcp = parseMcpToolName(ruleToolName);
  const invMcp = parseMcpToolName(invocationToolName);
  if (ruleMcp && invMcp && ruleMcp.serverName === invMcp.serverName && ruleMcp.toolName === undefined) return true;
  return false;
}
