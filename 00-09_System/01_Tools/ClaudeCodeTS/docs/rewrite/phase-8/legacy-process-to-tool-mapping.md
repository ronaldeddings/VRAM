# Phase 8 — Legacy Process Boundary Mapping

Goal: enumerate legacy behaviors that depended on spawned helper processes/binaries and map them to in-process async constructs.

## Known legacy internal entrypoints

- `--ripgrep` (embedded ripgrep helper): replaced by in-process `search.grep` tool + `search.grep` engine-internal command.
- `--mcp-cli` (MCP helper CLI): replaced by engine-internal commands:
  - `mcp.servers/list`
  - `mcp.tools/list`
  - `mcp.resources/list`
  - `mcp.resources/read`
  - `mcp.tools/call`
  - `mcp.grep` (optional; server-scoped)

## Mapping table (rewrite target)

- Search:
  - legacy: `--ripgrep` / external rg-like behavior
  - v3: `search.grep` tool (filesystem capability gated; TS implementation for now; WASM/remote later)
- MCP tooling:
  - legacy: `--mcp-cli` invoked as a separate command mode
  - v3: engine commands (in-process) using the Phase 10 MCP client/transport layer
- Shell hooks / shell tools:
  - legacy: shell-spawn protocols
  - v3: no shell; replaced by declarative tool calls and hook effects (Phase 9)

## Enforcement stance

- Core engine/modules under `src/core/*` must not use subprocess APIs (`child_process`, `Bun.spawn`, etc.).
- Host adapters may provide optional `HostShell`/native bridges, but the Phase 8 tool layer does not depend on them.

