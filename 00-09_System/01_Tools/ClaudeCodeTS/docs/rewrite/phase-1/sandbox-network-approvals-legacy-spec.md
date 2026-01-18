# Sandbox + network approvals — legacy spec (Phase 1)

This document captures the externally observable UX + queue semantics for “network request outside sandbox” approvals, including the 2.0.69 worker/leader mediated flow.

Primary source: `CLI_ENCYCLOPEDIA.md` Chapter 9 §9.8.

## 1) Local prompt queue (both versions)

Stable behaviors:
- When sandboxing is enabled, the sandbox layer calls a callback to decide whether a host may be contacted.
- The UI maintains a local FIFO-like queue of prompts shaped like:
  - `hostPattern: { host: string; port?: number }`
  - `resolvePromise(allow: boolean)`
- UI offers:
  - allow once
  - allow and don’t ask again (persist allow rule)
  - deny once (and Claude should be told what to do differently)

Persistence behavior:
- “Don’t ask again” writes a permission rule for a network tool with:
  - `ruleContent: domain:<host>`
  - destination: `localSettings`
- After writing settings, sandbox config is refreshed (legacy calls `NB.refreshConfig()`).

## 2) Worker/leader mediated approvals (2.0.69 only)

Stable behaviors:
- When operating as a “worker” (team mode), the worker cannot decide network access locally and must ask a “leader”.
- Worker path:
  - generates a request id (legacy format: `sandbox-${Date.now()}-${random}`)
  - attempts to send request to leader
  - on success:
    - registers a resolver callback
    - sets `AppState.pendingSandboxRequest = { requestId, host }`
    - UI shows a “Waiting for leader…” overlay
  - on failure to reach leader: falls back to local prompt queue

Leader path:
- Leader UI shows queued worker sandbox requests via `AppState.workerSandboxPermissions.queue`.
- Leader can approve/deny and optionally persist allow rules locally.
- Decision is sent back to worker and the queue advances.

Rewrite requirement:
- Model this as an explicit “approval broker” capability with deterministic queue semantics and typed request IDs (no implicit `Date.now()` dependency in tests).

