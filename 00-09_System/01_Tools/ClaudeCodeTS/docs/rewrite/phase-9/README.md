# Phase 9 — Hooks System Redesign (Portable, Async, No Shell)

This phase introduces an engine-native hooks subsystem that replaces legacy shell-based hooks.

Key properties:

- JSON-serializable hook config (`/hooks`), normalized and deterministically ordered.
- Deterministic matcher compilation (match-all, exact, one-of, regex) at config load time.
- Pure async execution (`workflow` hooks only); legacy `command`/`prompt`/`agent` hooks are linted and not executed.
- Typed, declarative effects interpreted by an effect interpreter (no direct engine state mutation).

See:

- `docs/rewrite/phase-9/legacy-async-hook-protocol.md`
- `src/core/hooks/*`

