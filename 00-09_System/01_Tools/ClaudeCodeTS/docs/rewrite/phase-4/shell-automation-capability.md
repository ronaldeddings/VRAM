# Optional Shell-Like Automation Capability (Phase 4)

The rewrite must be portable and must not treat OS process spawning as a concurrency model.

## Capability boundary

`HostShell` represents an *optional* “shell-like automation” surface that may exist on desktop hosts, but:

- it is **never required** for the engine to function
- it is **not** the runtime’s concurrency model
- it is always **policy- and permission-gated** (Phase 7/12 wiring)

## Explicit constraints

- Core engine logic must not depend on OS process spawning (no `child_process` / spawn-per-tool designs inside portable modules).
- Hooks must never be granted any `shell` capability, even on desktop; hooks are declarative and must remain side-effect constrained.
- If `shell` is absent, features that need it must be:
  - explicitly unavailable, and
  - surfaced with actionable guidance (typed capability errors, UX messaging).

## Alternatives for shell-dependent legacy features

- Pure TS/WASM substitutes (search, diff, parsing).
- Remote execution via a trusted host/server (explicit policy + auth; never a hidden fallback).
- Feature gating: hide/disable with explicit UX when absent.

## “Desktop power feature” stance (still no subprocess model)

Preferred approaches:

- host-native libraries (e.g. libgit2 bindings) instead of invoking `git`
- portable WASM bundles for deterministic execution
- optional authenticated RPC to a separately installed companion (not spawned by the app)

## Failure semantics

If `shell` is unavailable:

- tools/features that require it must fail with typed errors (`CapabilityUnavailableError` / `CapabilityPolicyDeniedError`)
- the UI must be able to attribute the failure to the missing capability and guide the user to remediation

