# Phase 15 — Migration Strategy (Incremental Replacement)

This document defines how the TypeScript rewrite ships incrementally alongside the legacy bundled CLI, with explicit flags, compatibility shims, and “shadow mode” diff validation.

## 15.1 Migration stages and feature flags

### Staged rollout plan

1. **Engine library mode** (`engine_library`): core runs in-process, driven by a host app (no CLI UI assumptions).
2. **New CLI adapter** (`cli_adapter`): CLI UI is a thin adapter over the engine; legacy CLI remains the fallback for unimplemented commands.
3. **React Native host** (`rn_host`): host capabilities are mobile-safe; missing capabilities are explicit and user-visible.
4. **Web host** (`web_host`): browser-safe transports + storage; same engine contracts.

### Feature flags (partial cutover)

Environment-driven flags (see `src/core/migration/flags.ts`) allow subsystem cutover independently:

- `settings`: legacy file-backed merge vs v3 storage-backed merge
- `permissions`: legacy semantics pinned vs refactor-safe mode
- `hooks`: legacy-compatible hook config + execution pipeline vs new semantics
- `mcp`: endpoint-first behavior with direct/state-file fallback only where supported

### Data migration flags

- Settings persistence format: `legacy_object` vs `envelope_v1` vs `auto`
- Session log format: `legacy` vs `v3` vs `auto`

### Compatibility mode

`compatibilityMode` pins legacy semantics (merge order, permission evaluation ordering, hook gating) while allowing refactors behind stable interfaces.

### Engine-only diagnostic mode

“Engine-only” is intended for CI/smoke tests: exercise settings merge, permissions policy snapshot, hook resolution, MCP mode selection without making model calls or running tools.

## 15.2 Legacy compatibility shims

### Settings files → v3 effective snapshot

`src/core/migration/legacySettingsFiles.ts` reads legacy settings files (`settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, managed policy file) and produces a merged effective snapshot with parse/validation errors attached.

### Permission rules + persistence destinations

- Permission rule string syntax is preserved.
- Permission updates can be applied back into legacy settings files for `userSettings`/`projectSettings`/`localSettings` (opt-in, host-capability dependent).

### Hook config compatibility

Legacy hook config is accepted via the normalized schema. Prompt/agent hooks are supported; command hooks are treated as redesign candidates when shell capability is unavailable.

### MCP compatibility (endpoint-first)

- Endpoint config discovery supports env vars and legacy endpoint files.
- State-file mode is supported for *read-only listing* commands; direct tool execution/read in state-file mode remains host-dependent.

### Stable legacy tool identifier mapping

Legacy MCP tool identifiers are canonicalized via a shared `mcp__<server>__<tool>` normalization to preserve allow/deny rules across server-name casing/format differences.

## 15.3 Shadow mode (diff-based validation)

Shadow mode runs the same deterministic comparison targets through two code paths and records diffs:

- effective settings (normalized JSON)
- permission decision behavior + reasoning code
- hook selection canonicalization
- MCP mode selection (endpoint vs direct) where applicable

Safety rule: shadow runs must never perform side effects twice; only side-effect-free targets may be compared unless a dry-run/simulation path exists.

Diff policy:

- allowed: benign formatting/ordering differences after canonical normalization
- must-fail: permission behavior change, hook blocking changes, MCP mode changes

Opt-in telemetry:

- diffs can be emitted as telemetry events only when enabled and policy permits; otherwise diffs stay local.

## 15.4 User-facing migration UX

- Capability-gated messages must explain why a feature is unavailable (e.g., no filesystem/network/shell).
- Policy-managed limitations must surface the policy source and reasoning code.
- Rollback: CLI stage must be able to fall back to legacy behavior when critical parity regressions occur.

## 15.5 Cutover criteria and deprecation plan

Minimum parity bar for CLI cutover:

- settings merge/parity + source precedence
- permissions parity (deny/ask/allow ordering + persistence)
- MCP endpoint mode parity for listing/calls used in practice
- core safe tools (read-only subset) parity
- hook system redesigned or explicit migration path exists for legacy command hooks

Deprecation plan:

- command hooks require linting + migration tooling; provide timelines and automated guidance.

## 15.6 Incremental subsystem cutover order

1. Settings merge + watcher semantics (engine computes; legacy consumes)
2. Permission engine (engine computes; legacy UI renders prompts)
3. MCP endpoint mode integration
4. Tool runner for safe, read-only subset
5. Hooks engine last (after migration tooling)

## 15.7 Persisted data migration

Define versioned formats and rollback semantics for:

- session transcripts/logs
- MCP endpoint cache + normalized server names
- secrets migration into secure storage, with recovery if interrupted

## 15.8 Rollout metrics and operational readiness

Track:

- crash rate
- permission prompt frequency
- MCP failures
- hook block frequency
- tool latency

Guardrails:

- auto-disable risky subsystems after repeated failures (policy permitting)

Support artifacts:

- export a diagnostic bundle that redacts secrets and raw file contents by default.

## 15.9 Sidecar entrypoints (`--mcp-cli`, `--ripgrep`)

- `--ripgrep` maps to `search.grep` (portable, no subprocess).
- `--mcp-cli` preserves the command surface and endpoint-mode telemetry dedupe; state-file mode is explicitly limited to read-only listing until a direct transport is supported.

## 15.10 Desktop extension / Chrome native host (if retained)

The desktop extension bridge must be desktop-only capability gated and must not bypass permissions; legacy envelope compatibility must remain versioned.

