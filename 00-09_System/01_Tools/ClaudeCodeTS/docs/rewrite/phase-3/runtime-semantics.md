# Phase 3 — Runtime Semantics (Coverage for remaining checklist items)

This document fills in the “define …” items in Phase 3 of `implementation/1-initial-rewrite-implementation-checklist.md` by specifying the intended semantics and pointing at the current baseline implementation where it already exists.

It is intentionally behavioral/spec-like (not a promise that every subsystem is fully implemented yet).

## 3.1 Supervision + task metadata

- **Supervision model**: `TaskScope` is the unit of supervision. A scope owns all tasks spawned within it; closing the scope cancels all child tasks and waits for completion. This is the portable replacement for process-boundary supervision.
- **Failure policy**: task `failurePolicy` is carried as metadata (`fail-fast` | `isolate` | `escalate`). Current baseline implements the field and surfaces it in snapshots; enforcement policies are staged behind engine orchestration.
- **Task-local metadata**: metadata is immutable at task creation (`SpawnTaskOptions.metadata`) and stored on the task record. Updates must be done via explicit state/event emission (no hidden global mutable task-local state).

## 3.2 Scheduling fairness + starvation

- **Queue model**: priority queues are `immediate`, `high`, `normal`, `low` (`src/core/runtime/scheduler.ts`).
- **Fairness rule (baseline)**: weighted round-robin over priorities to avoid starvation, with a deterministic rotating dequeue schedule. This is testable because ticks are explicit.
- **Starvation definition**: a runnable task is “starved” if it remains queued beyond a bounded number of ticks under a fixed workload model (documented as a test invariant; future: add aging).
- **Yield points**: long-running engine loops must call `ctx.yield()` at defined checkpoints (agent loops, hook chains, tool streaming adapters) to avoid blocking UI.

## 3.3 Cancellation + timeouts

- **Cancellation propagation**:
  - fan-out: cancelling a scope cancels all tasks in the scope (scope → tasks).
  - fan-in: a child cancellation does not automatically cancel its scope/peers; the orchestration layer decides escalation.
- **Timeout ownership**: timeouts are owned by the runtime kernel/scheduler. The kernel schedules a deterministic timer and aborts the task signal when deadline is reached; the timer is cleaned up when the task completes.
- **Cancellation vs streams**: stream producers must close with an explicit `close` event; cancellation should still result in a final close reason (`cancelled`/`timeout`), not silent truncation.
- **Persisted cancellation representation**: transcripts/store must include cancellation reason markers so replay can reproduce the stop condition (Phase 5 transcript schema already includes `cancelled?: CancellationReason` on entities; engine wiring will emit the corresponding transcript events).

## 3.4 Event ordering, cursors, subscription lifecycle

- **Ordering**:
  - per `(channel)` monotonic `seq` is guaranteed within a bus instance.
  - `tsMonoMs` provides ordering across channels but is only monotonic, not globally unique.
- **Late subscribers**:
  - `includeSnapshot` can emit an immediate snapshot envelope (if a snapshot provider is configured).
  - `replayBuffered` can replay buffered events after a cursor.
- **Cursor concept**: `EngineEventCursor = { channel, seq }` is the minimal resumable cursor for each channel.
- **Cursor persistence rules (host guidance)**:
  - cursors may live in ephemeral memory for CLI and in durable storage for mobile/web (host decision).
  - flush cursors periodically and on important lifecycle events (host background/terminate).
  - delivery semantics are channel-specific: `ui/transcript` should aim for at-least-once with idempotent rendering; `telemetry/debug` may drop.

## 3.5 Determinism and replay

- **Deterministic means**:
  - scheduler order is fully determined by enqueue order + priority + explicit tick schedule
  - timestamps are provided by injected clocks in tests (`TestClock`)
  - IDs are provided by injected `IdSource` (monotonic IDs in tests)
  - seeded randomness is available for tests via `createSeededRandom` (`src/core/runtime/seededRandom.ts`)
  - nondeterministic I/O is captured as keyed responses (filesystem/network/random) for replay
- **Replay capture format**: `ReplayCapture` is types-defined in `src/core/runtime/replay.ts`. Execution/replayer is staged for later phases.

## 3.6 Failure classification + escalation (baseline)

- **Error classes crossing boundaries** use `EngineErrorCode` (`src/core/types/errors.ts`).
- **Fatal vs recoverable**: policy-denied and capability-missing are non-fatal (surface to UI); internal invariant violations may be fatal and require safe shutdown (engine wiring later).
- **Retry**: deterministic backoff is implemented as `retryWithBackoff` with injectable sleep/RNG (`src/core/network/retry.ts`).

## 3.7 Host integration points

- **Host lifecycle events** enter the system as typed `HostEvent` and are handled by engine orchestration (later); Phase 3 defines the event types and expects host adapters to forward them.
- **Yield hints**: host adapters may expose optional “idle/yield” hints; the runtime remains tick-driven and deterministic under tests.

## 3.8 Streams + backpressure + hashing rules

- **Core stream model** is `CoreStreamEvent` with bounded buffering and drop policies (`src/core/runtime/stream.ts`, `src/core/runtime/queue.ts`).
- **Backpressure** is modeled as bounded buffering plus explicit drop policies; future: add pause/resume signaling where hosts support it.
- **Hashing rule**: tests and diagnostics should prefer “hash + counters” for sensitive stream content (Phase 5 transcript summary uses SHA-256 via `HostCrypto`).

Adapters (host-layer):
- web: `AsyncIterable` ↔ `ReadableStream` (`src/core/events/streamAdapters.ts`)
- node: `AsyncIterable` ↔ Node `Readable` (`src/platform/node/streamAdapters.ts`)
- RN: pump `AsyncIterable` to an emitter (`src/platform/rn/streamAdapters.ts`)

## 3.9 Scheduler ticks vs JS runtime queues

- The scheduler runs in explicit `tick()` calls; it does not rely on Node-specific `setImmediate`.
- `runUntilIdle()` yields to microtasks before deciding the system is idle so promise continuations can enqueue deterministic work.

## 3.10 Scope invariants + resource accounting (baseline)

- **Scope invariants**: closing a scope must leave no owned tasks running; timers and streams must not leak (enforced by snapshot visibility + tests).
- **Resource accounting primitives** (defined, not fully enforced yet): time budgets (clock), event budgets (per-channel buffers), and concurrency budgets (limiters).

## 3.11 Snapshots, progress heartbeats, hang detection, debug dumps

- **Runtime snapshot schema**: `RuntimeSnapshot` is the canonical debug/introspection payload. It includes queue depths, tasks, scopes, limiters, streams, and timers (`src/core/types/runtime.ts`, `src/core/runtime/kernel.ts`).
- **Progress heartbeat**: “progress” is defined as any of:
  - task yielding (`ctx.yield()`)
  - stream emission (`CoreStreamEvent` `chunk|progress|diagnostic`)
  - engine event emission (`EngineEventEnvelope`)
  Hosts/engine orchestration must call `HangDetector.recordProgress(category)` when one of these occurs.
- **Hang detection rules**: deterministic “no progress for N ms” thresholds per category, suppressed while waiting on user; single-fire escalation until progress resumes (`src/core/runtime/hang.ts`).
- **Debug dump** (spec): an engine command should snapshot runtime state and emit a bounded, redacted summary event; stack traces are host-provided and optional. Phase 3 defines the payload shape and requires determinism under test; the concrete engine command wiring is staged for later phases.
- **Safety gates**: snapshot capture must be bounded and policy-controlled. Phase 3 requires that debug dumps never include secrets and are safe to emit in managed environments (or disabled entirely by policy).

## 3.12 Replay assertions and diff classification (spec baseline)

- **Replay assertions**: compare engine events by normalized envelope fields (channel/seq/payload type/correlation IDs) and compare persisted state via hash-based checkpoints.
- **Diff classifier**: classify diffs as `exact`, `benign_ui`, `allowed_nondeterminism`, or `regression` (`src/core/runtime/replay.ts`).
