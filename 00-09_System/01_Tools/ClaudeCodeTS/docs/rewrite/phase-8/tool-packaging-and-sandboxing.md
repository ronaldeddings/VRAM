# Phase 8 — Tool Packaging and Plugin Sandboxing (Design Gate)

No plugin loading is implemented in Phase 8; this document captures the intended constraints.

## Packaging format (manifest)

- Tool IDs + versions
- Input/output schemas (versioned)
- Required capability requirements expression
- Integrity metadata (hash/signature) and trust source
- Engine compatibility range

## Loading policy model

- Disabled by default on mobile/web unless policy explicitly enables.
- Directory discovery only on filesystem hosts and only within user-approved scopes.
- Policy-managed allow/deny lists for plugin sources/identities.

## Sandboxing requirements

- Plugin tools never receive raw host capabilities; only mediated tool-context handles.
- Resource budgets and hard timeouts are mandatory.
- If isolation is used (worker/realm), message passing must be deterministic and versioned.

