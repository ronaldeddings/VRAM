# Storage, Secrets, and Watchers (Phase 4)

This phase defines the **portable persistence boundary** and the security rules around storing sensitive data.

## Encryption at rest (host-owned)

- The engine treats `HostStorage` as **non-secret** persistence and assumes:
  - host may encrypt at rest, but **the engine does not provision or manage encryption keys**
  - host may use OS facilities (Keychain/Keystore/WebCrypto-backed stores) to implement encryption
- Any encryption keys (or key material) are owned by the host and are **not** exposed to the engine.

## Plain settings vs secret storage

Rules:

- **May live in `HostStorage`**:
  - non-sensitive settings and feature flags
  - workspace records (IDs, display names, trust state)
  - caches that do not contain credentials
- **Must live in `HostSecrets` (never in settings JSON)**:
  - bearer tokens / access tokens
  - MCP endpoint keys and auth tokens
  - any value that would grant account/workspace access if leaked

Rationale: settings are routinely exported/diagnosed/compared in tests, while secrets must be tightly scoped and revocable.

## Rotation and invalidation semantics

The portable contract supports rotation without requiring a specific host implementation strategy:

- `HostSecrets.invalidateSecret(name, reason?)` (optional) is the canonical “rotation happened” signal.
- When secrets are invalidated:
  - new tasks should fail fast with attributable “needs re-auth” messaging (Phase 7/12 wiring)
  - long-running tasks should observe cancellation or re-auth prompts at the next yield boundary

## Storage change notifications (watchers)

Hosts may expose watchers without relying on filesystem-specific APIs:

- `HostStorage.subscribe(namespace, handler)` (optional) delivers `StorageChangeEvent` for:
  - `set` (with new `version`)
  - `delete`
- This is the portability-safe mechanism used for “settings changed” flows on:
  - mobile/web (no filesystem watchers)
  - desktop (may still be backed by filesystem, but surfaced as events)

If `subscribe` is absent, the engine must fall back to explicit refresh triggers (user action, lifecycle events, polling if allowed).

