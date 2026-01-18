# Queues, Lifecycle Persistence, and Multi-Session Boundaries (Phase 5)

This phase models the legacy CLI’s UI-driven queues (prompts/approvals/elicitation) as **portable state**, with explicit cancellation and lifecycle behavior.

## Queue semantics (portable)

- All UI overlays are modeled as queues in `AppState.ui` and are **exclusive**: at most one overlay renders at a time.
- Permission prompts:
  - tool approvals are represented as a deterministic queue with a single active prompt + FIFO pending queue
  - “don’t ask again” is represented as a *rememberable decision* (an effect that requests persistence); the actual rule write happens in Phase 7
- Sandbox-network approvals:
  - distinct from tool approvals
  - domain/host-pattern scoped requests; may be mediated by leader/worker (Phase 7/8 wiring)
- Elicitation (MCP ask-user):
  - always represented as a queue; serial/parallel concurrency is expressed by the producer, while the UI remains single-overlay
  - cancellation produces explicit cancellation effects so the underlying request can be aborted

## Queue persistence across lifecycle events

Rules:

- UI queues are **ephemeral** (not persisted in `StateSnapshotV1`).
- On host lifecycle transitions that invalidate interaction (e.g. background/stop):
  - clear all UI queues
  - emit cancellation effects for in-flight requests with a `host_lifecycle` reason

This is implemented via `cmd/host-event` → `ui/queues/clear` in `src/core/state/state.ts`.

## State diff emission rules

- UI consumers subscribe to `StateUiEvent` from `StateStore.subscribeUi()`.
- The default event is `ui/state-changed` with the triggering `actionType`, which acts as an incremental “diff key”.
- Full persisted state snapshots are available via `StateStore.snapshotPersisted()` and `StateStore.restoreFromSnapshot(...)`.

## Multi-session concurrency boundaries

Baseline (Phase 5):

- Multiple sessions may exist in persisted state, but **only one session may be active at a time**.
- Activating a session automatically pauses any other active session.
- Runtime task execution is expected to be scoped to the active session’s runtime scope (Phase 3), with background sessions not running work.

## Resource-sharing guidance (spec)

Resource sharing is explicitly scoped:

- app-global: caches, global network budgets, feature flags
- session-scoped: transcript, tool runs, MCP connections (default)

If shared resources are introduced (e.g. MCP connection pooling), the sharing rules must be explicit and reflected in state/events.

## Background agents scoping (spec)

Agents may be app-scoped or session-scoped:

- app-scoped agents: run independent of session, but must not require UI access
- session-scoped agents: are cancelled/paused with the session lifecycle

The Phase 5 state model records these decisions as explicit lifecycle transitions and cancellation markers.
