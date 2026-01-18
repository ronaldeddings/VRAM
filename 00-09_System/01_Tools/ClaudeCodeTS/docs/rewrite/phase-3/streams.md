# Portable Streams

Core uses a single internal stream event model (`CoreStreamEvent` in `src/core/types/runtime.ts`) so tool/hook/MCP streaming behaves consistently across hosts.

## Event set (Phase 3 baseline)

- `chunk`: string or bytes with explicit encoding (`utf-8` or `binary`)
- `progress`: typed progress with optional `taskId`, coalescable by host/UI
- `diagnostic`: redacted debug-only stream events
- `close`: explicit stream completion with reason + counters

## Implementation

`src/core/runtime/stream.ts` provides `createCoreStream()`:
- returns an `AsyncIterable<CoreStreamEvent>` with bounded buffering and drop policies
- assigns a monotonic `seq` per stream and a `tsMonoMs` from injected clock

