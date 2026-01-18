# Phase 2 — Portability Enforcement Strategy

Phase 2 defines *how* we prevent Node-only APIs from leaking into portable core modules.

## Design-time enforcement

- Keep `tsconfig.json` portable-first (`lib: ["ES2022","DOM"]`, no `@types/node`).
- Put all host APIs behind `HostCapabilities` in `src/core/types/*`.
- Treat any direct import of Node built-ins (`fs`, `path`, `child_process`, `process`, etc.) as a host-only concern under `src/platform/node/*` or `src/ui/cli/*`.

## Build-time enforcement (repo-local)

- Add a simple import-boundary check that fails CI/typecheck if any `src/core/**` file imports from `src/platform/**` or `src/ui/**`.
- Add a host-capability “smoke” module per host that ensures required capabilities are wired and can be marked unavailable explicitly.

## Mobile-safe mode gates (required)

Core must boot and run with these capabilities absent:
- filesystem
- shell/process execution
- clipboard
- notifications

In mobile-safe mode, the engine must:
- surface missing-capability errors deterministically
- never attempt hidden fallbacks to Node-only APIs

