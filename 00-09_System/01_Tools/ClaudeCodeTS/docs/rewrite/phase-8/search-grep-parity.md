# Phase 8 — `search.grep` Parity and Evaluation Matrix

## Contract summary

Tool: `search.grep`

- Inputs: `{ root?, query, regex?, ignoreCase?, includeGlobs?, excludeGlobs?, maxMatches?, maxFiles?, maxMatchesPerFile?, maxFileBytes? }`
- Streaming: per-file start events and per-match structured events with `{ path, line, column, match, lineText }`.
- Bounds: deterministic early-stop when any max is reached; emits a `truncated` stream event.
- Encoding: UTF-8 decode; binary detection via NUL-byte scan of first 2KB.

## Correctness stance (current)

- Line-based matching only (no multiline regex semantics).
- Regex engine is JS `RegExp`; unsupported legacy rg features are treated as out-of-scope until a WASM engine is adopted.
- Directory traversal and output ordering are deterministic (sorted paths).

## Implementation matrix (planned)

- Preferred: WASM ripgrep-like engine for parity (desktop/web; evaluate RN feasibility).
- Fallback: pure TS implementation (current).
- Optional: remote execution (policy-gated; never implemented via spawning local helpers).

## Doctor/diagnostics parity targets (planned)

- Report mode: `ts` / `wasm` / `remote`
- Report limits: file size cap, match caps, glob support level

