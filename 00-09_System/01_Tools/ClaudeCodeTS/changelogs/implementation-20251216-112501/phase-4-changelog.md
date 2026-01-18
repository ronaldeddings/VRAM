# Phase 4 Change Log — Host Capability Abstraction (iOS/Web/Desktop-Safe)

## 1) Summary (what you accomplished in Phase 4)

- Expanded the canonical host capability boundary (capability taxonomy, typed capability/storage errors, and workspace identity primitives) so the engine can run without Node-only assumptions.
- Added a capability catalog, compliance report, policy interface, filtered capability views, and an audit mode for tracking capability usage in tests.
- Implemented initial host adapters for Node/CLI, Web, React Native, and Desktop (Desktop currently aliases Node), including Node-safe storage and credential reading hooks aligned with legacy CLI behavior.
- Added portable filesystem path helpers and a deterministic retry/backoff helper for fetch-based network operations.
- Documented the Phase 4 capability matrix and portability stance in `docs/rewrite/phase-4/*`.

## 2) Files changed (created/modified/deleted)

- Modified: `package.json`
- Modified: `bun.lock`
- Modified: `src/core/types/errors.ts`
- Modified: `src/core/types/index.ts`
- Modified: `src/core/types/host.ts`
- Created: `src/core/types/workspace.ts`
- Created: `src/core/capabilities/index.ts`
- Created: `src/core/capabilities/catalog.ts`
- Created: `src/core/capabilities/compliance.ts`
- Created: `src/core/capabilities/policy.ts`
- Created: `src/core/capabilities/view.ts`
- Created: `src/core/capabilities/audit.ts`
- Created: `src/core/network/index.ts`
- Created: `src/core/network/retry.ts`
- Created: `src/core/filesystem/index.ts`
- Created: `src/core/filesystem/path.ts`
- Modified: `src/core/index.ts`
- Deleted/Replaced: `src/platform/node/index.ts`
- Created: `src/platform/node/index.ts`
- Created: `src/platform/node/host.ts`
- Created: `src/platform/node/workspace.ts`
- Deleted/Replaced: `src/platform/web/index.ts`
- Created: `src/platform/web/index.ts`
- Deleted/Replaced: `src/platform/rn/index.ts`
- Created: `src/platform/rn/index.ts`
- Deleted/Replaced: `src/platform/desktop/index.ts`
- Created: `src/platform/desktop/index.ts`
- Created: `scripts/phase4-conformance.ts`
- Created: `docs/rewrite/phase-4/README.md`
- Created: `docs/rewrite/phase-4/host-capability-matrix.md`
- Deleted/Recreated (to remove corrupted transcript content): `changelogs/implementation-20251216-112501/phase-4-changelog.md`

## 3) Decisions made (with rationale)

- Decision: Represent policy filtering as `CapabilityUnavailableReason.kind="policy-denied"` and throw `CapabilityPolicyDeniedError` from `requireCapability(...)` for a single, typed failure mode across hosts.
- Decision: Keep the network surface as `HostNetwork.fetch: typeof fetch` (rather than bespoke request/response types) to preserve streaming semantics and make polyfills/adapters straightforward.
- Decision: Make `shell` explicitly non-required and disabled by default in the Node adapter to enforce the “no subprocess-centric control flow” stance; only the boundary is defined here.
- Decision: Provide Web/RN storage and secret storage as explicit placeholders (local/session storage or in-memory) to keep the capability boundary portable while deferring host-secure primitives to later phases/hosts.
- Decision: Add `@types/node` as a dev dependency so platform/node adapters can be typechecked, while preserving portability via `check:boundaries` (core must not import Node builtins).

## 4) Tests/validation run + results

- Ran: `bun install` — succeeded.
- Ran: `bun run typecheck` — succeeded.
- Ran: `bun run check:boundaries` — succeeded.
- Ran: `bun scripts/phase4-conformance.ts` — succeeded.
- Ran: `claude --dangerously-skip-permissions -p sayhello` — succeeded.

## 5) Remaining work inside Phase 4 (if any)

- Implement real host adapters for `background` and `fileTransfer` capabilities (currently unavailable placeholders everywhere).
- Standardize and fully match legacy credential service-name derivation (including legacy `OAUTH_FILE_SUFFIX`) and reduce reliance on subprocess calls for keychain access where possible.
- Define/implement storage change notification/watch semantics in a host-agnostic way (current `HostStorage` boundary leaves watchers optional).
- Extend the compliance report to explicitly enumerate active polyfills and policy restrictions (currently reports availability + missing required only).

## 6) Handoff notes for next phase

- Phase 5 should build the UI-agnostic state model using `WorkspaceId` + `HostStorage` namespaces (avoid assuming filesystem paths exist).
- When passing capabilities into future tool/hook execution, always use `createCapabilityView(...)` and (optionally) `CapabilityAuditLog` to enforce least privilege and produce deterministic audit artifacts.
- Align future auth modules around stable secret names (e.g., `claude_code/accessToken`) and keep bearer tokens exclusively in `secrets`, not general settings storage.

