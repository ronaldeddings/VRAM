# Phase 8 — Tool Execution Layer (Async, Streaming, No Subprocess Model)

This phase introduces the portable, async-first tool boundary in `src/core/tools/*`.

## What exists in code

- Tool contract: typed input/output schemas, structured results, streaming events, cancellation via `AbortSignal`, and basic budgeting hooks (`ToolBudget`).
- Tool registry: built-in tool registration, MCP namespacing policy (`mcp__<server>__<tool>`), and collision prevention.
- Tool runner: deterministic tool run IDs, monotonic stream sequence numbers, pre/post hook extension points, permission-gate hook point, and capability-membrane enforcement via filtered `HostCapabilities` views.
- Built-in tools (initial): `search.grep` and `patch.apply`.

## Design notes tracked as docs

- Legacy subprocess mapping and internal entrypoint replacement (`--ripgrep`, `--mcp-cli`).
- `search.grep` parity/limitations and evaluation matrix.
- `vcs.git` capability boundary and fallback UX expectations.
- Plugin packaging and sandboxing constraints (design-gate only).

