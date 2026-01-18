# Phase 4 — Host Capability Abstraction (iOS/Web/Desktop-Safe)

This phase introduces a portable host capability boundary so the engine can run without assuming Node globals, a filesystem, raw sockets, or subprocess execution.

Primary artifacts:

- Capability taxonomy + descriptors: `src/core/capabilities/catalog.ts`
- Capability compliance report: `src/core/capabilities/compliance.ts`
- Capability policy + filtered views + audit mode: `src/core/capabilities/policy.ts`, `src/core/capabilities/view.ts`, `src/core/capabilities/audit.ts`
- Canonical host capability types + typed errors: `src/core/types/host.ts`
- Workspace identity primitives: `src/core/types/workspace.ts`
- Platform adapters (initial): `src/platform/node/*`, `src/platform/web/*`, `src/platform/rn/*`, `src/platform/desktop/*`
- Storage + secrets rules: `docs/rewrite/phase-4/storage-secrets-and-watchers.md`
- Workspace discovery + trust: `docs/rewrite/phase-4/workspace-flows.md`
- Optional shell capability boundary: `docs/rewrite/phase-4/shell-automation-capability.md`
- Network permissions + backgrounding: `docs/rewrite/phase-4/network-permissions-and-background.md`

Review checklist (leak prevention):

- Pass `HostCapabilities` only through `createCapabilityView(...)` filtered subsets when handing to tools/hooks/agents.
- Do not stash full `HostCapabilities` objects in long-lived singletons; keep them scoped to the engine/session lifetime.
- Prefer passing narrow capability values (e.g. `HostNetwork`) into short-lived task functions rather than capturing `host` in closures.

Non-goals (explicitly deferred):

- Any subprocess-centric “spawn-per-tool” execution model.
- Full permissions engine wiring (Phase 7) and state/persistence schemas (Phase 5/6).
- Full parity implementations for all optional capabilities on all hosts.
