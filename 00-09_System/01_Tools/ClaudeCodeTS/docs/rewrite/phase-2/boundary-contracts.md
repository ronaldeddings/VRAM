# Phase 2 — Boundary Contracts (Types Before Code)

This phase defines the engine API surface, event taxonomy, error taxonomy, and serialization strategy as types/interfaces only.

## Engine API surface (canonical shape)

The engine is UI-agnostic. UIs talk to the engine via:
- Commands in (`EngineCommand`)
- Events out (`EngineEvent`)

The engine must be constructible with:
- `HostCapabilities` (all non-portable effects)
- initial configuration and settings sources

## Event taxonomy

### Engine → UI events (examples; not exhaustive)
- lifecycle: `engine/ready`, `engine/stopped`, `engine/error`
- transcript/streaming: `assistant/delta`, `assistant/final`, `tool/stream`, `tool/result`
- UI prompts: `ui/prompt`, `ui/approval-request`, `ui/notification`
- diagnostics: `diag/log`, `diag/trace`, `diag/snapshot`
- state: `state/snapshot`, `settings/snapshot`, `permissions/explain`

### Host → Engine events (examples; not exhaustive)
- lifecycle: `host/backgrounded`, `host/foregrounded`, `host/network-changed`
- UI input: `host/user-input` (submitted prompt, cancel, stop)
- time: `host/tick` (deterministic test driver)

## Error taxonomy (canonical)

All errors that cross the engine boundary must be representable as serializable shapes, at minimum:
- `capability_missing` (host lacks required capability)
- `permission_denied` (permissions engine denied)
- `policy_override` (policy forced outcome)
- `transport_failure` (network/MCP transport failed)
- `task_cancelled` (user/system cancellation)
- `timeout` (deterministic timeout)

## Serialization strategy (canonical)

All persisted/wire documents are JSON-serializable, versioned, and validated:
- Settings documents: versioned JSON with explicit source provenance metadata.
- State snapshots: versioned JSON for replay/debug (no platform handles).
- Hooks: versioned JSON hook definitions + results.
- Tools: versioned JSON invocation + result envelopes, including streaming deltas.
- MCP: engine-facing envelopes versioned independently of upstream MCP protocol changes.

For diffs/hashes, the system uses canonical JSON stringification (sorted keys, stable formatting) so that:
- snapshot diffs are deterministic
- hashes used for replay/idempotency keys are stable across hosts

