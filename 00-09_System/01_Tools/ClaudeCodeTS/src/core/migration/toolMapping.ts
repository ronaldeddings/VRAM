import { normalizeMcpIdentifierSegment, toMcpToolName } from "../tools/names.js";

export type LegacyToolIdentifier =
  | { kind: "builtin"; name: string }
  | { kind: "mcp_rule"; ruleToolName: string }
  | { kind: "mcp_ref"; server: string; tool: string };

export function canonicalizeLegacyToolIdentifier(id: LegacyToolIdentifier): string {
  if (id.kind === "builtin") return id.name.trim();
  if (id.kind === "mcp_ref") return toMcpToolName(id.server, id.tool);

  const raw = id.ruleToolName.trim();
  if (!raw.startsWith("mcp__")) return raw;
  const rest = raw.slice("mcp__".length);
  const idx = rest.indexOf("__");
  if (idx === -1) return raw;
  const server = rest.slice(0, idx);
  const tool = rest.slice(idx + 2);
  if (!server) return raw;
  return `mcp__${normalizeMcpIdentifierSegment(server)}__${normalizeMcpIdentifierSegment(tool)}`;
}

