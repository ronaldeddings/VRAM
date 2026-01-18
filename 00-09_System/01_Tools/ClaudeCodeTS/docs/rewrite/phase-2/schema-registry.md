# Phase 2 — Protocol/Schema Registry

This phase defines where versioned schemas live and how compatibility is handled.

## Registry location

Single source of truth:
- `src/core/types/*`

This registry owns all versioned schemas:
- engine events (engine-facing)
- settings documents (persistence)
- state snapshots (persistence/debug)
- hook definitions + hook results
- tool invocation + tool result envelopes (including streaming)
- MCP envelopes (engine-facing)

## Versioning rules

- Use integer `schemaVersion` per document/envelope type (upgrade-only within a major rewrite iteration).
- Record `kind` + `schemaVersion` on every persisted/wire object.
- Migrations are explicit and scoped per kind.

## Compatibility policy (host UI ↔ engine)

- Default: strict reject on unknown `schemaVersion` for persisted documents.
- For engine↔UI event envelopes: best-effort forward compatibility via capability flags when safe; otherwise emit an explicit `engine/error` with a compatibility diagnostic.

## Conformance harness (Phase 2 scope)

- Canonical JSON stringify must be stable across hosts.
- Schema validators must agree across packages (future monorepo split), using the same registry definitions.

