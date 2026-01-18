# Phase 14: Testing Strategy

Goal: keep the portable async engine deterministic while preserving legacy semantics during migration.

## What this repo uses

- **Unit tests (pure core logic)**: settings merge/patching, permissions evaluation, hook matching/normalization, tool runner pipeline.
- **Deterministic fakes**: in-memory CAS storage and host capability doubles for stable settings/permissions tests.
- **Deterministic time/scheduling**: `TestClock` + `DeterministicScheduler` and kernel-level cancellation/timeout tests.
- **Integration smoke**: engine boots against Node/Web/RN-like host adapters (capability stubs) without device runtimes.
- **Regression harness**: fixture-driven scenarios that replay settings/permissions/hooks outputs and compare normalized results.
- **Conformance checks**: no-subprocess static scans for portable core; tool capability gating and cancellation stream closure.

## Coverage goals (Phase 14 scope)

- Settings: precedence + merge semantics (deep merge, array union-dedupe, patch semantics).
- Permissions: rule parsing, precedence, deny/ask/allow behavior + attribution/reason codes.
- Hooks: matcher normalization + managed-only gating behavior (policy-managed hooks only).
- Tools: schema validation, capability gating, cancellation/stream closure behavior.

## How to run (local)

- `bun test`
- `node scripts/check-import-boundaries.mjs`
- Phase-14-only subset: `bun test ./tests/phase14-*.test.ts`

## CI matrix (recommended, not yet wired)

- Node baseline: `bun test`, `bun run typecheck`, `bun run build`, `bun run check:boundaries`
- Web/RN packaging checks: build-only (no device execution) until later phases add e2e tooling.

### Later iteration plan (device/e2e tooling)

Requirements-first (tooling TBD):

- Web: headless runner can boot the engine and run a golden session replay (no real network).
- RN: simulator harness (Hermes/JSC) can boot the engine and run a minimal conformance suite.
- Keep Phase 14 focused on deterministic unit/integration tests; defer full e2e selection to a later phase.

### Minimum RN test requirements (pre-launch)

- Engine boots under Hermes with minimal mobile-safe capabilities conformance suite.
- Background/foreground lifecycle events are delivered and cancel/pause tasks correctly.
- Storage quota and secure-storage failure paths are exercised with deterministic fakes.

## Regression harness (Phase 14)

- Fixture corpus: `tests/fixtures/phase14-regression-corpus.json`
- Runner: `tests/helpers/regressionHarness.ts` (normalizes settings/permissions/hooks outputs for stable diffs)
