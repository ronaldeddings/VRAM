# Phase 8 — Tool Streaming Contract

## Event envelope

All tool output is emitted as `ToolStreamEvent` with:

- `toolRunId`: stable identifier for the run
- `seq`: per-run monotonic sequence number
- `tsMonoMs`: monotonic timestamp
- `kind`: `text | structured | progress | diagnostic | attachment | truncated | close`
- `payload`: validated per-kind payload shape at emit time (Phase 8 establishes the envelope; Phase 13 tightens redaction and sinks)
- `sensitivity`: `public | internal | pii | secret`
- `replaceKey` (optional): UI-only replace semantics (status lines)
- `uiOnly` (optional): indicates the event is for UI-only views (not transcript persistence)

## Channel mapping (default)

Default mapping is defined in `src/core/tools/channels.ts`:

- `text`, `structured`, `attachment` → `transcript` (unless `uiOnly`)
- `progress` → `ui`
- `diagnostic`, `truncated`, `close` → `diagnostic` (unless `uiOnly`)

## Chunking and bounds

- Text events are chunked to a maximum byte budget per chunk (implementation-defined; Phase 8 uses a conservative default).
- Total output size can be bounded per run; when exceeded, the stream emits a `truncated` event and drops further output deterministically.

## Persistence rules (Phase 8 definition)

- Default: persist summaries and final results; do not persist high-volume per-chunk streams by default.
- Debug/diagnostic modes may persist bounded raw chunks with redaction (Phase 13/15).
- Sensitive streams should be persisted as hashes/counters instead of raw bytes unless policy explicitly permits raw capture.

