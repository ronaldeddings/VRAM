# Legacy corpus capture + golden fixtures (Phase 1)

Goal: establish how we will capture deterministic fixtures from the legacy system for later replay and migration parity checks.

## Fixture directory conventions (proposed)

- `docs/rewrite/phase-1/fixtures/`
  - `sessions/` (captured outputs)
  - `manifests/` (redaction manifests + provenance)

## What each captured session should include (Phase 1 target)

For each scenario:
- normalized effective settings snapshot (all sources + precedence applied)
- normalized permission rule set (all sources + precedence applied)
- ordered hook selection results per event (with match diagnostics)
- tool invocation transcript metadata (redacted; event hashes/counts)
- MCP mode selection + connection outcome

## Redaction requirements

- No secrets (tokens, API keys, auth headers).
- No raw file contents unless explicitly allowed for a fixture.
- Include a redaction manifest describing what was removed/hashed.

## Golden replay contract (Phase 1 target)

Given recorded nondeterministic inputs (clock/RNG/network stubs), the new engine must:
- emit stable, normalized event logs with deterministic ordering
- produce identical classification outcomes for permission decisions and hook selection

## Status (Phase 1)

Phase 1 establishes:
- fixture storage layout (`docs/rewrite/phase-1/fixtures/*`)
- a baseline redaction policy (no secrets / no raw file contents by default)
- an initial set of *offline* legacy fixtures (help/version + MCP CLI gating/fallback behavior)

Capture utility:
- `scripts/capture-legacy-fixture.ts` writes `stdout`, `stderr`, and a structured manifest for a legacy CLI invocation while forcing an empty `CLAUDE_CONFIG_DIR` (avoids reading user machine settings).

Full “interactive parity” corpus capture (permissions prompts, hook execution around real model/tool runs) still requires authenticated CLI runs and is deferred until the migration/testing phases where we can record nondeterminism and replay deterministically.
