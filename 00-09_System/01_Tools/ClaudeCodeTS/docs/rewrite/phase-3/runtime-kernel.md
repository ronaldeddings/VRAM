# Runtime Kernel

## Goals

- Replace subprocess-driven concurrency with explicit async tasks and cooperative scheduling.
- Ensure deterministic behavior under test (IDs, time, scheduling order) by injecting nondeterminism (clock/IDs) and making scheduling explicit.

## Implemented primitives (Phase 3 baseline)

- Task identities: `TaskId` and `TaskScopeId` (`src/core/types/runtime.ts`).
- Deterministic scheduler:
  - Priority queues: `immediate`, `high`, `normal`, `low`
  - Tick-driven execution with “next-tick” queueing for work enqueued during a tick
  - Manual timers using an injected monotonic clock
  - Abort-aware yields (yield promises reject on abort and cancelled runnables are skipped)
- Structured concurrency scopes: `TaskScope` + `RuntimeKernel.createScope()` + scope-close cancellation/join.
- Concurrency limiters (named semaphores): `RuntimeKernel.defineLimiter()` / `RuntimeKernel.acquireLimiter()`.

## Determinism contract

- IDs are generated via `IdSource` (`src/core/runtime/ids.ts`), allowing deterministic monotonic IDs in tests.
- Time is injected via `MonotonicClock` (`src/core/runtime/clock.ts`), with `TestClock` for deterministic advancement.
- Scheduling is explicit via `DeterministicScheduler.tick()` / `runUntilIdle()`.

