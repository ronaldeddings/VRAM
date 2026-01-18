# Runtime Snapshots and Hang Detection

## Snapshot schema

`RuntimeSnapshot` in `src/core/types/runtime.ts` captures:
- scheduler queue depths by priority
- live task records (state, relationships, correlation IDs, timestamps)
- live scopes and owned tasks
- concurrency limiters (current/max/waiters)
- active streams and last emitted sequences
- pending timers and their deadlines

`RuntimeKernel.snapshot()` (`src/core/runtime/kernel.ts`) produces a snapshot from current runtime state.

## Hang detection (Phase 3 baseline)

`HangDetector` (`src/core/runtime/hang.ts`) implements:
- deterministic “no progress for N ms” thresholds per category
- explicit “waiting on user” suppression
- single-fire escalation per category until progress resumes

