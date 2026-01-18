# Phase 10 — MCP integration (portable, endpoint vs direct)

This phase introduces a transport-agnostic MCP layer in `src/core/mcp/*`:

- Versioned request/response envelopes (`src/core/mcp/envelope.ts`) with validation.
- Error taxonomy and retryability (`src/core/mcp/errors.ts`).
- Endpoint mode over HTTP POST `/mcp` (`src/core/mcp/endpointTransport.ts`) with bearer auth and AbortSignal timeouts.
- Direct mode as a host/injected transport (`src/core/mcp/transport.ts`).
- Storage-backed server registry + trust model (`src/core/mcp/registry.ts`).
- Storage-backed manifest caching + schema drift hash (`src/core/mcp/cache.ts`).
- Tool integration by mapping MCP tools into the tool registry (`src/core/mcp/tools.ts`).
- Engine command surface for “mcp-cli style” operations without spawning a subprocess (`src/core/mcp/commands.ts`).

Notes:

- Endpoint-mode telemetry is intentionally treated as “skip by default” to avoid double-logging when a running session proxies MCP centrally.
- Large MCP outputs are truncated deterministically to attachments when a `ToolAttachmentStore` is present (see `src/core/mcp/tools.ts`).

