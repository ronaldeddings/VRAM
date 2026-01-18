# Phase 2 — Canonical TypeScript Module Graph

This is the canonical “portable core first” module tree for the rewrite. File/dir names are provisional but dependency direction rules are not.

## Module tree (canonical)

```
src/
  core/
    types/         # types-only schemas + versioned envelopes
    runtime/       # scheduler/task model/cancellation (later phases implement)
    events/        # event taxonomy + bus interfaces
    state/         # store/reducers/selectors (later)
    settings/      # schema/sources/merge (later)
    permissions/   # rules/eval/explainability (later)
    hooks/         # schema/matching/execution (later)
    tools/         # tool contracts/registry/pipeline (later)
    mcp/           # mcp integration (later)
    agents/        # background agents (later)

  platform/
    node/          # host implementations for Node CLI
    web/           # browser host implementations
    rn/            # React Native host implementations
    desktop/       # desktop host implementations (TBD)

  ui/
    cli/           # CLI adapter (argv/stdio) over engine
    web/           # web adapter (TBD)
    rn/            # RN adapter (TBD)
```

## Responsibilities owned (and not owned)

### `core/*` (portable)
- Owns: deterministic behavior, typed contracts, orchestration logic, scheduling semantics.
- Does not own: reading/writing files, network access, spawning processes, keychain access, UI rendering.
- Legacy mapping: decomposes bundle subsystems documented in `CLI_ENCYCLOPEDIA.md` into explicit engines (settings/permissions/hooks/tools/MCP/agents).

### `platform/*` (host-dependent)
- Owns: capability implementations (storage/filesystem/network/shell/clipboard/notifications/secrets/time).
- Does not own: orchestration, policy decisions, tool/hook semantics.
- Legacy mapping: replaces Node-only “process boundary artifacts” documented in `docs/rewrite/phase-1/legacy-process-boundary-artifacts.md`.

### `ui/*` (host-dependent)
- Owns: translating host UI concerns into engine commands and rendering engine events.
- Does not own: policy decisions or business logic; those live in `core/*`.
- Legacy mapping: replaces CLI-only glue in the bundles (argv parsing, terminal UX).

## Allowed dependency directions (hard rules)

- `core/**` may import only from:
  - `core/**`
  - `spec/**` (Phase 1 legacy specs) when needed for migration correctness
- `platform/**` may import from:
  - `core/types/**` and other `core/**` modules
  - platform-local helpers
- `ui/**` may import from:
  - `core/**`
  - `platform/**` (only through host capability construction and wiring)
- `platform/**` and `ui/**` must not be imported by `core/**` (no “back edges”).

## Types-only module to prevent cycles

`src/core/types/*` is the single shared schema registry for:
- versioned wire/persistence schemas
- engine event envelopes
- tool invocation/result schemas (including streaming)
- hook definitions/results schemas
- MCP envelopes (engine-facing)

Other modules should depend on these types instead of re-defining shared shapes.

