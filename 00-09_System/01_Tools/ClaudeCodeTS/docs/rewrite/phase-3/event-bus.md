# Engine Event Bus

## Goals

- Portable event delivery from core → UI adapters without console-centric coupling.
- Multiple subscribers, AsyncIterable-based consumption, bounded buffering, and resumable cursors.

## Envelope contract (Phase 3 baseline)

Implemented in `src/core/types/events.ts` as `EngineEventEnvelope`:
- `eventId`: stable ID (deterministic in tests via injected `IdSource`)
- `sessionId` / `workspaceId` (optional)
- `channel`: `ui` | `diagnostic` | `telemetry` | `transcript` | `debug`
- `severity`: `debug` | `info` | `warn` | `error`
- `seq`: monotonic per `(sessionId, channel)` within a bus instance
- `tsMonoMs`: monotonic timestamp for ordering
- `tsWallMs`: optional wall clock timestamp (display only)
- `correlationIds`: task/tool/hook/MCP IDs when applicable
- `sensitivity`: coarse redaction marker
- `payload`: versioned engine event payload

## Event bus implementation

`src/core/events/bus.ts` provides:
- `EventBus.emit()` → builds an envelope and fans out to subscribers
- `subscribe()` → returns an `AsyncIterable` + `unsubscribe()`
- `EngineEventCursor` support (`seq` per channel)
- optional “snapshot on subscribe” and bounded in-memory replay of recent events

## Stream bridging

`src/core/events/streamAdapters.ts` provides:
- `asyncIterableToReadableStream()`
- `readableStreamToAsyncIterable()`

