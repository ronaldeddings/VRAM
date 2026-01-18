# Phase 12 — Host adapters and UI integration (CLI / desktop)

This phase makes the portable engine usable through thin, host-specific adapters without leaking platform code into `src/core/*`.

## Node/CLI adapter: capability + policy model

The CLI entrypoint (`src/cli.ts`) constructs a Node host via `src/platform/node/host.ts` and passes it into the engine (`src/core/engine/createEngine.ts`).

- Host adapters **provide raw capabilities** (filesystem, network, secrets, storage, process, etc.).
- Core/tool code must **not** import platform modules; it only consumes `HostCapabilities`.
- Permission/policy enforcement is done through the engine/UI flow:
  - tools/capabilities that require user consent enqueue permission UI requests in state,
  - the CLI adapter renders those overlays and dispatches resolution actions back into the engine.

Notes:

- Clipboard/shell/local-endpoint capabilities are intentionally `unavailable` in the default Node host to preserve “no-subprocess” and reduce accidental leakage; these can be added later behind explicit gates.

## Terminal UX boundary (no UI logic in core)

Terminal rendering lives entirely in `src/ui/cli/*`:

- `src/ui/cli/adapter.ts` subscribes to engine events and forwards user input / hotkeys as engine host events + UI actions.
- `src/ui/cli/render.ts` renders **semantic** state (`AppState`) into stable, testable frame lines. Core never emits terminal formatting.

This keeps the core portable while allowing host-specific UX (Ink-like screens, overlays, hotkeys) to evolve independently.

