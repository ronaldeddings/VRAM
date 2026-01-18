## Summary (Phase 8)

- Implemented a portable, async-first Tool Execution Layer in `src/core/tools/*` with typed schemas, streaming events (monotonic seq), cancellation hooks, output truncation, and a capability-membrane (filtered `HostCapabilities`) to enforce “no bypass”.
- Added a tool registry (`ToolRegistry`) with stable namespacing, collision prevention, and a registration policy hook for forbidden capability requests.
- Added built-in tools:
  - `search.grep` (in-process TS search) with deterministic traversal + streaming match events and a golden fixture test.
  - `patch.apply` (edit-set apply/preview) with deterministic application, preview diff attachment, newline handling, and tests including CRLF + unicode.
- Defined the engine-internal command surface registry in `src/core/commands/*` (parity targets for legacy `--mcp-cli`/`--ripgrep`), plus Phase 8 design docs under `docs/rewrite/phase-8/*`.
- Checked off all Phase 8 items in `implementation/1-initial-rewrite-implementation-checklist.md`.

## Files changed

Modified:
- `implementation/1-initial-rewrite-implementation-checklist.md`
- `src/core/index.ts`
- `src/core/tools/index.ts`

Added:
- `src/core/commands/index.ts`
- `src/core/commands/registry.ts`
- `src/core/commands/types.ts`
- `src/core/tools/attachments.ts`
- `src/core/tools/builtins/index.ts`
- `src/core/tools/builtins/patchApply.ts`
- `src/core/tools/builtins/searchGrep.ts`
- `src/core/tools/cache.ts`
- `src/core/tools/channels.ts`
- `src/core/tools/errors.ts`
- `src/core/tools/permissionGate.ts`
- `src/core/tools/registry.ts`
- `src/core/tools/runner.ts`
- `src/core/tools/schema.ts`
- `src/core/tools/stream.ts`
- `src/core/tools/types.ts`
- `docs/rewrite/phase-8/README.md`
- `docs/rewrite/phase-8/git-capability-boundary.md`
- `docs/rewrite/phase-8/legacy-process-to-tool-mapping.md`
- `docs/rewrite/phase-8/search-grep-parity.md`
- `docs/rewrite/phase-8/security-review-checklist.md`
- `docs/rewrite/phase-8/tool-packaging-and-sandboxing.md`
- `docs/rewrite/phase-8/tool-runner-pipeline.md`
- `docs/rewrite/phase-8/tool-streaming-contract.md`
- `tests/fixtures/phase8-grep-expected.json`
- `tests/fixtures/phase8-grep-repo/a.txt`
- `tests/fixtures/phase8-grep-repo/sub/b.txt`
- `tests/phase8-tools.test.ts`
- `changelogs/implementation-20251217-093335/phase-8-attempt-1.md`
- `changelogs/implementation-20251217-093335/phase-8-changelog.md`
- `changelogs/implementation-20251217-093335/phase-8-validation-attempt-1.txt`

## Decisions made

- Tool namespacing: reserved `mcp__<server>__<tool>` to mirror observed legacy MCP tool naming and avoid collisions with built-ins.
- Capability membrane: tools receive a filtered `HostCapabilities` view (deny-by-default) rather than the full host object, to prevent bypassing the tool runner.
- `search.grep` baseline: implemented a TS line-based matcher (literal + JS RegExp) with deterministic ordering; documented parity gaps vs ripgrep/WASM in `docs/rewrite/phase-8/search-grep-parity.md`.
- Patch format baseline: chose a deterministic, reviewable “edit set” with line-based hunks (startLine + delete/insert lines) for preview/apply and conflict detection.

## Tests/validation run + results

- `bun test` (bun v1.3.4): PASS
- `bun run typecheck`: PASS
- `bun run check:boundaries`: PASS (`Import boundary check passed.`)
- Legacy CLI sanity (auth): `claude --dangerously-skip-permissions -p sayhello` => PASS
- Legacy bundle entrypoints:
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/*/cli.js --mcp-cli --help` => PASS (warns about missing temp endpoint file)
  - `node bundles/*/cli.js --ripgrep --help` => FAIL (missing `ripgrep.node` in `bundles/*`; see validation log)

## Remaining work inside Phase 8

- None for the Phase 8 checklist; `--ripgrep` bundle validation requires the missing `ripgrep.node` artifact that is not present in this repo’s `bundles/*` directory.

## Handoff notes for next phase

- Phase 9 should plug the real hooks system into `ToolRunner`’s `beforeTool`/`afterTool` hook points and model effect transactions using the contracts in `docs/rewrite/phase-8/tool-runner-pipeline.md`.
- Hook-triggered permission updates should route through `src/core/tools/permissionGate.ts` + Phase 7 persistence (`persistPermissionUpdates`) rather than mutating permissions directly.
## Attempt 1

## Attempt 1

Implemented Phase 8 tool execution layer in `src/core/tools/*`, added built-in `search.grep` and `patch.apply`, updated the implementation checklist, and validated with `bun test`, typecheck, and boundary checks.


