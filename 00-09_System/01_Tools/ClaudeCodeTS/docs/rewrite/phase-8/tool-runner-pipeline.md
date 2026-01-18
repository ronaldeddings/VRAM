# Phase 8 — Tool Runner Pipeline Semantics

This document defines the canonical ordering and cancellation/transaction semantics for a tool invocation.

## Pipeline order (single tool run)

1. **Queued**: tool is enqueued with validated invocation metadata.
2. **Pre-tool hooks**: may block or rewrite input (Phase 9 provides the hook engine; Phase 8 provides hook points).
3. **Permission decision**: explicit `deny`/`ask`/`allow` via the Phase 7 permission engine; no implicit escalation.
4. **Started**: tool execution begins after permission is granted and pre-hooks have completed.
5. **Streaming**: tool emits `ToolStreamEvent` envelopes with monotonic sequence numbers.
6. **Post-tool hooks**: may modify output (allowed only here) and may request transcript injections.
7. **Completed/Failed/Cancelled**: stream closes with a terminal `close` event.

## Cancellation propagation

- Cancellation is represented by an `AbortSignal` on the tool context.
- Tools must treat `signal.aborted` as a cooperative cancellation request and should stop emitting new output as soon as practical.

## Transactional semantics for effects

- **Pre-tool effects** (like input rewrites) apply before permission decisions.
- **Post-tool effects** (like output rewrites) apply only after tool completion.
- **Persistence effects** (like “remember this permission”) only commit if the user selected a persistence scope and the policy allows that scope.

## Preventing pipeline bypass

- Tools receive a filtered `HostCapabilities` view (capability membrane). Any capability not explicitly granted to the tool is unavailable and yields a typed error (`CapabilityPolicyDeniedError`).

