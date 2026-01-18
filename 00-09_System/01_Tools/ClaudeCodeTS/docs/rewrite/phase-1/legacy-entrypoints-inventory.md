# Legacy entrypoints + sidecar modes (Phase 1 inventory)

Goal: inventory legacy “special entrypoints” and classify them for the rewrite.

Primary sources: `CLI_ENCYCLOPEDIA.md` Chapters 1, 2, 8, 12; bundle scans.

## Known entrypoints (baseline)

| Entry/Mode | Invocation form (legacy) | Source | Classification (rewrite target) |
|---|---|---|---|
| MCP CLI | `--mcp-cli ...` | Chapter 1 | in-process engine command + CLI adapter |
| Chrome native host | length-prefixed stdin protocol | Chapter 2 | host adapter feature (desktop-only capability) |
| Teleport / remote sessions | `--teleport <id>` and related flows | Chapter 8 | host adapter feature + engine session resume |
| Embedded ripgrep | `--ripgrep ...` | Chapter 12 | host adapter feature (desktop-only) |
| Update/install/doctor | `claude update/install/doctor ...` | Chapter 12 | host adapter feature (desktop-only) |

## Phase 1 note

This inventory is a baseline and is expected to expand as remaining encyclopedia chapters are captured.

