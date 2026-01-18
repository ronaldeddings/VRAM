# Portability rubric + constraints (Phase 1)

This rubric is used to label modules and behaviors throughout the rewrite.

## Rubric categories

- `portable`: runs in web + RN + Node without host-only APIs.
- `host-dependent`: requires a host adapter capability (filesystem, shell, keychain, native UI, etc.).
- `optional capability`: engine can run without it; behavior must be explicit when absent.
- `unsupported on mobile/web`: intentionally excluded; must fail with typed error and user-visible messaging.

## “No Node-only API in core” constraint

Phase 1 rule: core/portable modules must not import or rely on:
- `fs`, `path`, `os`, `child_process`, `net`, `tls`, `worker_threads`, `tty`, `inspector`
- `process` for configuration (use injected config + capability descriptors instead)
- Node-specific globals that do not exist on web/RN

Permitted baseline Web APIs (must be capability-checked where needed):
- `AbortController` / `AbortSignal`
- `fetch`, `Request`, `Response`, `Headers`
- `URL`
- `TextEncoder` / `TextDecoder`
- `ReadableStream` / `WritableStream` (where available; provide fallbacks/adapters)
- `crypto.getRandomValues` (or injected RNG/UUID provider)

## Minimum supported environments (Phase 1 target)

- React Native (Hermes/JSC)
- Modern browsers
- Node LTS (as a host, not an assumption)

## Missing capability semantics

When required capability is absent:
- Throw a typed error (`CapabilityUnavailableError`-style) with:
  - capability name
  - user-facing message
  - optional remediation (e.g., “requires desktop host”)
- Do not silently fall back to Node-only behavior in portable modules.

