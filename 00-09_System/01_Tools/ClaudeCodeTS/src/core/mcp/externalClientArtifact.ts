import type { VersionedEnvelopeBase } from "../types/schema.js";
import { SCHEMA_VERSION } from "../types/schema.js";

export type McpExternalClientArtifactV1 = VersionedEnvelopeBase & {
  kind: "mcp_envelope";
  schemaVersion: typeof SCHEMA_VERSION.mcpEnvelope;
  artifact: "external_client";
  createdAtWallMs: number;
  sessionId?: string;
  endpoint?: { url: string };
  notes?: string;
};

export function createMcpExternalClientArtifactV1(options: {
  createdAtWallMs: number;
  sessionId?: string;
  endpointUrl?: string;
}): McpExternalClientArtifactV1 {
  return {
    kind: "mcp_envelope",
    schemaVersion: SCHEMA_VERSION.mcpEnvelope,
    artifact: "external_client",
    createdAtWallMs: options.createdAtWallMs,
    ...(options.sessionId ? { sessionId: options.sessionId } : {}),
    ...(options.endpointUrl ? { endpoint: { url: options.endpointUrl } } : {}),
    notes: "This artifact intentionally contains no secrets; auth must be provided via secure storage."
  };
}

