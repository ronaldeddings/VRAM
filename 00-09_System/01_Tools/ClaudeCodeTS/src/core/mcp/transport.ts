import type { McpRequestEnvelopeV1, McpResponseEnvelopeV1 } from "./envelope.js";
import type { McpToolCallParams, McpToolStreamEvent, McpTransportCapabilities, McpTransportMode } from "./types.js";

export type McpTransport = {
  readonly mode: McpTransportMode;
  readonly capabilities: McpTransportCapabilities;
  send: (req: McpRequestEnvelopeV1, options?: { signal?: AbortSignal; timeoutMs?: number }) => Promise<McpResponseEnvelopeV1>;
  callToolStream: (params: McpToolCallParams, options: { signal?: AbortSignal }) => AsyncIterable<McpToolStreamEvent>;
  close?: () => Promise<void>;
};

