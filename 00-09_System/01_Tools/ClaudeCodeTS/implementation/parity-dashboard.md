# Parity Dashboard (Investigation-Driven)

Source of truth: `investigation/FINAL-gap-summary.md` (run: `investigation-20251220-112837`).

Purpose: one place to track whether each major legacy behavior is **implemented**, **stubbed (help-only / not-implemented tool_result)**, **deferred**, or **intentionally diverged** (with a written justification).

Status legend:
- `implemented` — end-to-end behavior exists and has deterministic tests
- `stubbed` — command/tool exists, is discoverable, but returns a typed “not implemented” outcome
- `deferred` — explicitly not targeted yet; must have a milestone
- `diverged` — intentionally different from legacy; must have a rationale + migration UX

## Tool Calling

| ID | Gap | Status | Owner | Notes |
|---|---|---|---|---|
| T1 | End-to-end model ↔ tools loop |  |  |  |
| T2 | Tool manifests included in model calls |  |  |  |
| T3 | Session tool registry composition/filtering |  |  |  |
| T4 | Built-in tool inventory parity |  |  |  |
| T5 | Built-in tool schema export (`input_schema`) |  |  |  |
| T6 | Tool input normalization parity |  |  |  |
| T7 | Permission gate + hooks wired into tool loop |  |  |  |
| T8 | `StructuredOutput` flow |  |  |  |
| T9 | `Skill` tool / skills executor |  |  |  |
| T10 | MCP tools exposed to model tool calling |  |  |  |
| T11 | Optional `LSP` tool parity |  |  |  |
| T12 | `HostShell` stance and gating |  |  |  |
| T13 | Bash redirection parsing parity |  |  |  |

## CLI Commands & Flags

| ID | Gap | Status | Owner | Notes |
|---|---|---|---|---|
| C1 | Interactive-by-default (no-args) |  |  |  |
| C2 | Unknown command/flag errors (no UI fallback) |  |  |  |
| C3 | `mcp` command group |  |  |  |
| C4 | `plugin` + marketplace commands |  |  |  |
| C5 | `install` + `update` commands |  |  |  |
| C6 | `setup-token` command |  |  |  |
| C7 | Permissions/tools flags plumbing |  |  |  |
| C8 | Session lifecycle flags plumbing |  |  |  |
| C9 | Model/request shaping flags plumbing |  |  |  |
| C10 | Env/config/debug flags plumbing |  |  |  |
| C11 | MCP config flags plumbing |  |  |  |
| C12 | `--mcp-cli` parity gaps |  |  |  |
| C13 | `-p` semantics mismatch |  |  |  |
| C14 | Slash commands + `--disable-slash-commands` |  |  |  |
| C15 | Teleport/remote sessions |  |  |  |
| C16 | Session browser/resume picker |  |  |  |
| C17 | Background agents |  |  |  |
| C18 | Deprecated default model in `-p` |  |  |  |

## Documentation (Encyclopedia)

| ID | Issue | Status | Owner | Notes |
|---|---|---|---|---|
| E1 | `claude mcp ...` chapter coverage |  |  |  |
| E2 | `claude plugin ...` + `setup-token` coverage |  |  |  |
| E3 | Clarify definition vs usage anchors |  |  |  |
| E4 | Windows policy directory mismatch |  |  |  |
| E5 | Endpoint-mode warning text divergence |  |  |  |
| E6 | Settings corruption messaging divergence |  |  |  |

## Subprocess / Host Layer

| ID | Issue | Status | Owner | Notes |
|---|---|---|---|---|
| S1 | Keychain subprocess hardening |  |  |  |
| S2 | Shell execution only via `HostShell` + policy |  |  |  |

