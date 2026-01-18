# Legacy async hook stdout JSON protocol → v3 replacement

Legacy (bundled `cli.js`) behavior for shell hooks:

- A command hook is spawned and receives a JSON stdin payload (`hookInput`).
- While streaming stdout, once `stdout.trim()` contains `}` the client attempts `JSON.parse(stdout.trim())`.
- If it parses to `{ async: true, asyncTimeout?: number }`, the hook is treated as **accepted** and continues in the background.
- Otherwise, stdout is treated as plain text and the hook completes in the foreground.

Notable failure modes:

- Invalid JSON (or stdout not starting with `{`) is treated as plain text.
- If stdin is closed early, the legacy client normalizes EPIPE to a hook error.
- Cancellation is normalized to `"Hook cancelled"`.

v3 replacement (no stdout parsing):

- Hooks return a typed `StartBackgroundTask` effect (with optional timeout/budget) to request background execution.
- The engine emits a structured “started” event keyed by the hook identity, and the background task streams progress via engine events.

Implementation artifacts:

- `src/core/hooks/legacyAsync.ts` implements the parsing heuristic for regression tests only (no subprocess use).

