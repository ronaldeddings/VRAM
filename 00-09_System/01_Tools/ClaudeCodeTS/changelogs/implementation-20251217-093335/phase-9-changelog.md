## Summary (Phase 9)

- Implemented a portable, async-first hooks subsystem in `src/core/hooks/*` with deterministic config normalization, matcher compilation, dedup, and two execution surfaces (streaming + batch) using `HookRunId` + per-run monotonic event seq.
- Added a declarative actions/effects model (`HookAction` → `HookEffect`) plus a deterministic effect interpreter (`applyHookEffects`) with conflict detection, first-win blocking semantics, capability gating for IO-like effects, and per-effect audit events.
- Integrated hooks into the tool execution pipeline via `createToolPipelineHooks`, and extended `ToolRunner` to support `afterToolFailure` for `PostToolUseFailure`.
- Added plugin hook loading (`plugins/*/hooks/hooks.json`) and legacy async stdout JSON protocol mapping utilities + behavior-spec docs.
- Checked off all Phase 9 items in `implementation/1-initial-rewrite-implementation-checklist.md`.

## Files changed

Modified:
- `implementation/1-initial-rewrite-implementation-checklist.md`
- `src/core/hooks/index.ts`
- `src/core/tools/runner.ts`

Added:
- `src/core/hooks/errors.ts`
- `src/core/hooks/interpreter.ts`
- `src/core/hooks/legacyAsync.ts`
- `src/core/hooks/matchers.ts`
- `src/core/hooks/normalize.ts`
- `src/core/hooks/plugins.ts`
- `src/core/hooks/runner.ts`
- `src/core/hooks/session.ts`
- `src/core/hooks/sources.ts`
- `src/core/hooks/stream.ts`
- `src/core/hooks/toolPipeline.ts`
- `src/core/hooks/types.ts`
- `docs/rewrite/phase-9/README.md`
- `docs/rewrite/phase-9/legacy-async-hook-protocol.md`
- `tests/phase9-hooks.test.ts`

## Decisions made

- Legacy hook execution: `command`/`prompt`/`agent` hook types are not executed (no shell/model loop in Phase 9); policy-sourced legacy hooks fail-closed by emitting a blocking effect, while non-policy legacy hooks surface as non-blocking errors. Rationale: enforce “no shell” while preventing silent policy bypass.
- Merge conflict policy: `UpdateToolInput`/`UpdateToolOutput` in merge mode reject conflicting writes (no implicit last-writer-wins); identical writes are allowed. Rationale: deterministic, auditable behavior.
- Hook chaining: added explicit per-event chaining (`sequential` default, optional `parallel`). In parallel mode, the first blocking hook (by stable order) determines the applied effect cutoff. Rationale: allow concurrency without breaking determinism.
- Timeouts: added per-event default timeouts with optional per-hook overrides; execution can use a provided runtime scheduler for deterministic timing or falls back to host timers. Rationale: portability across runtime adapters while keeping deterministic option available.

## Tests/validation run + results

- `bun test` (bun v1.3.4): PASS
- `bun run typecheck`: PASS
- `bun run check:boundaries`: PASS (`Import boundary check passed.`)
- Legacy CLI sanity (auth): `claude --dangerously-skip-permissions -p sayhello` => PASS
- Legacy bundle entrypoints:
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/*/cli.js --mcp-cli --help` => PASS (note: glob expansion does not exercise `--mcp-cli` mode reliably)
  - `node bundles/*/cli.js --ripgrep --help` => PASS (note: glob expansion does not exercise `--ripgrep` mode reliably)
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` => PASS (warns about missing endpoint file; falls back to state file)
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` => PASS (warns about missing endpoint file; falls back to state file)
  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --help` => FAIL (`ripgrep.node` missing from bundle dir)
  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --help` => FAIL (`ripgrep.node` missing from bundle dir)

## Remaining work inside Phase 9

- None in the Phase 9 checklist; legacy `--ripgrep` bundle validation remains blocked on the missing `ripgrep.node` artifact in `bundles/*`.

## Handoff notes for next phase

- Phase 10 (MCP integration) can now attach hooks to MCP tool flows by treating each MCP tool invocation as a `ToolRunner` run and applying `PostToolUse` output transforms (parity target: legacy “updatedMCPToolOutput”).
- If Phase 10 introduces an engine-wide runtime scheduler/kernel, wire it into `HookEngineOptions.scheduler` so hook timeouts are fully deterministic under replay.
## Attempt 1

