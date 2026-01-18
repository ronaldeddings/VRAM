# Phase 3 Change Log — Core Async Runtime and Scheduling Model (Deterministic Kernel)

## 1) Summary (what you accomplished in Phase 3)

- Implemented a deterministic, tick-driven async runtime kernel with portable primitives for tasks, scopes, timers, concurrency limiters, streams, and snapshots (`src/core/runtime/*`, `src/core/types/runtime.ts`).
- Implemented a portable engine event bus with bounded buffering, multi-subscriber fan-out, cursors, and optional snapshot/replay-on-subscribe semantics (`src/core/events/bus.ts`), plus AsyncIterable ↔ ReadableStream adapters (`src/core/events/streamAdapters.ts`).
- Upgraded the canonical `EngineEventEnvelope` contract to include stable metadata (channel, severity, seq, mono/wall timestamps, correlation IDs, sensitivity) and updated `EngineEventHandler` to consume envelopes (`src/core/types/events.ts`, `src/core/types/engine.ts`).
- Added Phase 3 documentation set describing the runtime kernel, event bus/envelopes, streams, snapshots/hang detection, and replay capture format (`docs/rewrite/phase-3/*`).

## 2) Files changed (created/modified/deleted)

- Created: `src/core/types/runtime.ts`
- Modified: `src/core/types/index.ts`
- Modified: `src/core/types/events.ts`
- Modified: `src/core/types/engine.ts`
- Created: `src/core/events/bus.ts`
- Created: `src/core/events/streamAdapters.ts`
- Modified: `src/core/events/index.ts`
- Created: `src/core/runtime/deferred.ts`
- Created: `src/core/runtime/ids.ts`
- Created: `src/core/runtime/clock.ts`
- Created: `src/core/runtime/queue.ts`
- Created: `src/core/runtime/scheduler.ts`
- Created: `src/core/runtime/scope.ts`
- Created: `src/core/runtime/kernel.ts`
- Created: `src/core/runtime/stream.ts`
- Created: `src/core/runtime/hang.ts`
- Created: `src/core/runtime/replay.ts`
- Modified: `src/core/runtime/index.ts`
- Created: `docs/rewrite/phase-3/README.md`
- Created: `docs/rewrite/phase-3/runtime-kernel.md`
- Created: `docs/rewrite/phase-3/event-bus.md`
- Created: `docs/rewrite/phase-3/streams.md`
- Created: `docs/rewrite/phase-3/snapshots-and-hang-detection.md`
- Created: `docs/rewrite/phase-3/replay-capture.md`
- Deleted/Recreated (to remove corrupted large content): `changelogs/implementation-20251216-112501/phase-3-changelog.md`

## 3) Decisions made (with rationale)

- Decision: Make the scheduler “tick” deterministic via double-buffered queues (work enqueued during a tick runs next tick) to enforce cooperative yielding and prevent same-tick self-resumption from starving other tasks.
- Decision: Define `EngineEventEnvelope` as the stable cross-host delivery unit and update `EngineEventHandler` to receive envelopes (not raw payloads) so UI adapters can rely on consistent metadata (seq, timestamps, redaction/sensitivity).
- Decision: Keep `RuntimeKernel` independent of the event bus (no imports on `src/core/events/*`) and instead expose runtime primitives + snapshots directly; avoids circular dependencies and keeps the kernel portable for non-CLI hosts.
- Decision: Implement replay capture as types-only in Phase 3 (`src/core/runtime/replay.ts`) to lock the artifact shape early without committing to a concrete runner/harness before host capability abstraction (Phase 4).

## 4) Tests/validation run + results

- Ran: `claude --dangerously-skip-permissions -p sayhello` — succeeded.
- Ran: `bun run typecheck` — succeeded.
- Ran: `bun run check:boundaries` — succeeded.

## 5) Remaining work inside Phase 3 (if any)

- Implement the “record/replay event sink” wiring (bounded, redacted) as a concrete `EventBus` sink and add deterministic event-sequence assertion helpers.
- Add deterministic conformance tests for scheduler fairness/cancellation propagation, snapshots determinism, and hang detection single-fire behavior.
- Flesh out supervision/failure escalation policies (fail-fast/isolate/escalate) beyond the current baseline wiring.
- Add explicit resource budgeting primitives (event/time/network/storage budgets) and typed `BudgetExceededError` behavior.

## 6) Handoff notes for next phase

- Phase 4 should provide host capability implementations (clock/random/storage/secrets/network/etc) and use them to instantiate `IdSource` + `MonotonicClock` for the runtime kernel and event bus without introducing Node-only imports into `src/core/**`.
- When wiring UI adapters, prefer consuming `EngineEventEnvelope` from `EventBus.subscribe()` and rendering payloads in UI layers; keep core emission structured and policy-driven.

