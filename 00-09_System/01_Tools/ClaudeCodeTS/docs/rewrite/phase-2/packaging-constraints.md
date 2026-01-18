# Phase 2 — Provisional Build & Packaging Approach (Constraints Only)

This phase records constraints the eventual toolchain/layout must satisfy without committing to a final bundler.

## Workspace/monorepo layout (provisional)

Current layout keeps everything in one `src/` tree; future phases may split into packages:
- engine library (`core/*`)
- platform adapters (`platform/*`)
- UI adapters (`ui/*`)

Constraint: the packaging must prevent `core/*` from importing host code.

## TypeScript target constraints (RN + web compatible)

- Avoid Node globals/types in `core/*`.
- Prefer standard Web APIs (`fetch`, `AbortSignal`, `ReadableStream`) in portable layers.
- Use explicit host capability wrappers for anything not universally available.

## Shipping schemas/types

- All shared schemas live in `src/core/types/*`.
- Schemas must be versioned and JSON-serializable.
- Avoid bundler-specific tricks (no source-map assumptions, no runtime `require` hacks).

## Toolchain constraints (must satisfy)

- Tree-shaking friendly for `core/*`
- Conditional exports support for host adapters (Node vs web/RN)
- RN compatibility (no Node built-in assumptions)

