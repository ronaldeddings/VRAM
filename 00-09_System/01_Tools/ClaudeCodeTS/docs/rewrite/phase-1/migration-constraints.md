# Migration constraints (Phase 1)

Goal: keep the rewrite shippable by defining migration stages and early compatibility requirements.

## Migration target stages (baseline)

1. Engine library boots and runs deterministically under tests (portable).
2. New CLI adapter uses engine for a limited command subset (parity mode).
3. RN host runs engine in “mobile-safe mode” (no filesystem/shell assumed).
4. Web host runs engine where capabilities exist; explicit missing-capability failures elsewhere.

## Shadow-run strategy (baseline)

Where feasible on Node/desktop:
- Run legacy and new engine in parallel on the same inputs.
- Compare:
  - effective settings snapshot (normalized)
  - permission decisions + explanations
  - hook selection outputs + diagnostics
  - emitted event stream hashes

## Compatibility budget (Phase 1 stub)

Required for initial v3 launch (likely):
- settings merge + IO parity (including policy/flag sources)
- permission rules + prompts parity
- core hook events + gating parity
- MCP invocation parity (at least direct mode; endpoint semantics documented)

Deferred if necessary:
- legacy “process boundary artifacts” that do not translate to mobile/web (to be redesigned behind compatibility layers first).

