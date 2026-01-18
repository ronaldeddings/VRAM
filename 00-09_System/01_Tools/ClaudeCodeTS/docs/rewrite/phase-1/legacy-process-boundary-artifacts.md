# Legacy process-boundary artifacts (redesign candidates)

These are behaviors/subsystems whose *primary purpose* is to manage subprocess boundaries in the legacy CLI, and therefore are likely to be redesigned in the async-first rewrite. They are documented here so parity reviews can distinguish “must preserve behavior” from “artifact to replace”.

## Hook command execution via shell subprocesses

- Legacy: “command hooks” are executed via shell command invocation and pass `hookInput` JSON via stdin.
- Source: `CLI_ENCYCLOPEDIA.md` Chapter 6 §6.5 (“Hook command execution”) and §6.5.1 (“Async hook protocol”).
- Redesign driver: mobile/web cannot spawn a shell; async hooks should become explicit engine tasks/workflows.

## “Async hook protocol” background continuation

- Legacy: hook can return quickly with `{"async": true, "asyncTimeout"?: number}` and continue streaming output in background.
- Source: `CLI_ENCYCLOPEDIA.md` Chapter 6 §6.5.1.
- Redesign driver: this encodes concurrency in a subprocess IO protocol; rewrite should model long-running hook tasks explicitly (task IDs, cancellation, budgets).

## Tool execution built around spawned processes (desktop/CLI)

- Legacy bundles include `spawn` orchestration helpers (e.g., `spawn-rx`) and many integrations assume process execution.
- Source: bundles (`spawn-rx` present in both `cli.js` bundles); see also encyclopedia chapters that mention embedded binaries (update/install/doctor/ripgrep).
- Redesign driver: rewrite must treat shell/process as an optional host capability.

## Embedded ripgrep / “sidecar” CLI entrypoints

- Legacy exposes special entrypoints (`--ripgrep`, update/install/doctor flows) that are historically packaged around binaries.
- Source: `CLI_ENCYCLOPEDIA.md` Chapter 12 (update/install/doctor + embedded ripgrep).
- Redesign driver: isolate into host adapter capabilities; core should not assume binaries.

## Team-mediated approvals via mailbox/IPC (worker/leader)

- Legacy 2.0.69 implements worker/leader mediated sandbox approvals via request IDs and IPC-style messaging.
- Source: `CLI_ENCYCLOPEDIA.md` Chapter 9 §9.8.2.
- Redesign driver: rewrite should model this as a transport-agnostic “approval broker” capability, not Node IPC.

