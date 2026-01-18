# Replay Capture Format

This phase defines a capture artifact format for deterministic reproduction without relying on host APIs.

## Capture type (Phase 3 baseline)

`ReplayCapture` in `src/core/runtime/replay.ts` includes:
- capability descriptors (availability/versions; no secrets)
- a deterministic seed identity
- injected host events and UI inputs with monotonic timestamps
- recorded nondeterministic responses (filesystem/network/random) keyed by stable IDs
- captured `EngineEventEnvelope[]` plus optional checkpoints
- required redaction manifest describing what was removed/hashed

The capture schema is types-only in Phase 3; replay execution harness is staged for later phases.

