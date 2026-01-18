# Workspace Identity, Discovery, and Trust (Phase 4)

This phase replaces “cwd is the workspace” assumptions with a portable `WorkspaceId` model.

## Workspace discovery / selection by host

- **CLI (Node)**:
  - default workspace is `cwd`, but it is captured as a workspace record (`WorkspaceId` + path)
  - switching workspace is an explicit operation (e.g. `--cwd` or UI selection in later phases)
- **Desktop GUI**:
  - user explicitly selects a folder; host persists a workspace record
- **Mobile / Web**:
  - user selects a “workspace profile” (remote repo binding, synced snapshot, document set)
  - no filesystem path is required to exist

## Project-scoped settings binding on non-filesystem hosts

- “Project-scoped” sources must bind to `WorkspaceId`, not to a path.
- Hosts that also have a filesystem may additionally store the path as an attribute of the workspace record.

## Workspace trust artifact

Each workspace has a trust state used by hooks/tools:

- `trusted`: hooks/tools may run subject to permission rules
- `untrusted`: hooks/tools that can touch the filesystem/network must be disabled or require explicit user confirmation

Trust must be:

- explicit (user action establishes trust)
- revocable (user can withdraw trust)
- visible (UI shows trust state)

## Optional workspace-to-repo binding

A `WorkspaceId` may map to a remote repo identity even without a local checkout:

- URL + optional branch/ref
- used for policy scoping, allowlists, and remote execution routing (if supported)

## Workspace renaming/migration rules

- `WorkspaceId` is stable.
- Display names and paths may change.
- Persisted settings/policy references must target `WorkspaceId`, not transient attributes.

