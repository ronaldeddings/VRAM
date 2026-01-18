# Host Capability Matrix (Phase 4)

This matrix is the portability check-list for host adapters. “Required” means required for the engine boot surface; “Optional” means the engine must function without it.

| Capability | Required | Node/CLI | Desktop | Web | RN |
|---|---:|---:|---:|---:|---:|
| `clock` | yes | ✅ | ✅ | ✅ | ✅ |
| `random` | yes | ✅ | ✅ | ✅ (crypto/randomUUID or fallback) | ✅ (fallback) |
| `crypto` | no | ✅ (SHA-256 digest) | ✅ | ✅ (WebCrypto if present) | ✅ (if present) |
| `storage` | yes | ✅ (file-backed) | ✅ (node-backed placeholder) | ✅ (localStorage) | ✅ (in-memory placeholder) |
| `secrets` | yes | ✅ (env/keychain/plaintext fallback) | ✅ (node-backed placeholder) | ✅ (sessionStorage placeholder) | ✅ (in-memory placeholder) |
| `network` | yes | ✅ (`fetch` if present) | ✅ | ✅ | ✅ |
| `lifecycle` | yes | ✅ (no-op emitter) | ✅ | ✅ (visibility/online/offline) | ✅ (placeholder) |
| `background` | no | ❌ | ❌ | ❌ | ❌ |
| `fileTransfer` | no | ❌ | ❌ | ❌ | ❌ |
| `filesystem` | no | ✅ | ✅ | ❌ | ❌ |
| `shell` | no | ❌ (disabled by default) | ❌ | ❌ | ❌ |
| `localEndpoint` | no | ❌ | ❌ | ❌ | ❌ |
| `ipc` | no | ❌ | ❌ | ❌ | ❌ |
| `process` | no | ✅ (allowlist) | ✅ | ❌ | ❌ |
| `clipboard` | no | ❌ | ❌ | ❌ | ❌ |
| `notifications` | no | ❌ | ❌ | ❌ | ❌ |
| `haptics` | no | ❌ | ❌ | ❌ | ❌ |

Notes:

- `shell` is intentionally non-required and must not be an engine dependency.
- Web/RN secret and storage implementations are placeholders until host-secure primitives exist.
- Polyfill policy baseline (Phase 4): `fetch` polyfills may be allowed on RN; filesystem polyfills are not allowed where they would break the trust model.
