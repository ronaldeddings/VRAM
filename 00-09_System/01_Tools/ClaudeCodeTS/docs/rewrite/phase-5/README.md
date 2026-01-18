# Phase 5 — App/Session State Model (UI-Agnostic)

Primary artifacts:

- Deterministic state + store: `src/core/state/state.ts`, `src/core/state/store.ts`
- Overlay selection: `src/core/state/overlays.ts`
- Transcript semantic rendering: `src/core/state/render.ts`
- UI adapter view models (selectors over canonical state):
  - CLI: `src/ui/cli/index.ts`
  - Web: `src/ui/web/index.ts`
  - RN: `src/ui/rn/index.ts`

Additional notes:

- Queue persistence + cancellation rules, and multi-session concurrency boundaries: `docs/rewrite/phase-5/queues-and-concurrency.md`

