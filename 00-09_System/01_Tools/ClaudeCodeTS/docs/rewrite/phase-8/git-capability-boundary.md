# Phase 8 — `vcs.git` Capability Boundary (Design)

This phase only defines the boundary; implementations are evaluated later.

## Read operations (portable)

- repo root detection
- branch info
- status
- diff (bounded, normalized)

## Write operations (permission gated)

- stash create/apply/drop
- checkout/switch
- apply edits/patch

## Credential boundary

- Host-managed; core must not store raw git credentials/tokens in settings.
- Any remote VCS integrations are policy-gated and treated as explicit network/auth tools.

## Fallback UX when absent (mobile/web)

- Explicit capability-unavailable messaging
- Teleport/local-only flows degrade gracefully

