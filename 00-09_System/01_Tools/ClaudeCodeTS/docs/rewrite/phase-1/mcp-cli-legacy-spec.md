# MCP CLI — legacy spec (endpoint vs state-file/direct mode)

This document formalizes the legacy `--mcp-cli` behavior.

Primary source: `CLI_ENCYCLOPEDIA.md` Chapter 1 (“MCP CLI”).

## 1) Modes

Legacy supports two modes:
1. Endpoint mode: talks to an HTTP endpoint exposed by a running session.
2. State-file/direct mode: reads a state JSON file and may direct-connect to servers.

## 2) Feature gates and timeouts

Reference: Chapter 1 §1.1.

- `ENABLE_EXPERIMENTAL_MCP_CLI` must be enabled for `--mcp-cli` to function.
- Endpoint mode allowed when experimental is enabled and `ENABLE_MCP_CLI_ENDPOINT` is not explicitly disabled.
- `MCP_TOOL_TIMEOUT` sets the tool timeout (very large default).

## 3) Endpoint discovery and fallback warning

Reference: Chapter 1 §1.2.

Legacy decides endpoint mode by:
- “endpoint allowed” AND endpoint config present.
- If allowed but missing config, it emits a warning once and falls back to state-file mode.

## 4) Telemetry behavior

Reference: Chapter 1 §1.4.

Legacy skips MCP CLI telemetry logging in endpoint mode (to avoid double-logging because the running session logs centrally).

## 5) CLI surface

Reference: Chapter 1 §1.8.

Subcommands:
- `servers`
- `tools [server]`
- `info <server/tool>`
- `call <server/tool> <args|- (stdin)>`
- `grep <pattern>`
- `resources [server]`
- `read <resource> [uri]`

