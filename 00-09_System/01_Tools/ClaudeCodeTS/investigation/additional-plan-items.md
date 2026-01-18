# Additional Implementation Plan Items (Discovered Gaps)

These items should be added to `implementation/1-initial-rewrite-implementation-checklist.md` to close the gaps found in the investigation.

Investigation run: `investigation-20251220-112837`.

## Tool Calling / Model Loop (Core Parity)
- [ ] [T1] Implement end-to-end model ↔ tools loop (streaming `tool_use` parse/assemble, execute, emit `tool_result`, repeat-to-final).
- [ ] [T2] Ensure all model requests include a tool manifest (builtins + MCP) when tool calling is enabled.
- [ ] [T3] Add canonical session tool registry composition + filtering (allowed/disallowed tools; permission mode).
- [ ] [T5] Implement builtin tool schema export (`input_schema`) via Zod→JSON Schema (and add tests).
- [ ] [T6] Port upstream tool input normalization (`$02`/`w02` equivalents) with unit tests.
- [ ] [T7] Wire permission gate + tool pipeline hooks into the tool loop (no bypass paths).
- [ ] [T8] Add `StructuredOutput` validated JSON tool flow + retry loop (with tests).
- [ ] [T9] Add `Skill` tool + skills registry/executor (and define relation to slash commands).
- [ ] [T10] Expose MCP tools to the model tool manifest (not only `--mcp-cli`) and make them executable end-to-end via tool loop (with deterministic mocked MCP tests).
- [ ] [T11] Add optional `LSP` tool behind `ENABLE_LSP_TOOL` (presence gate + host contract; may be “unsupported” by default).
- [ ] [T12] Decide and implement Bash/KillShell parity via explicit `HostShell` capability + policy surface (Node-only; web/RN remain unsupported).
- [ ] [T13] Close bash-redirection parsing parity gap with tests (or document intentional divergence).

## Built-in Tools (Inventory Parity)
- [ ] [T4] Implement core first-party tools (names + schemas aligned with upstream), prioritizing: `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebFetch`, `WebSearch`, `TodoWrite`; add explicit stubs for the rest until implemented.

## CLI Command Surface (User-Facing Parity)
- [ ] [C1] Make `bun run cli` (no args) start interactive mode instead of printing help.
- [ ] [C2] Make unknown commands/flags error and exit non-zero (no UI-frame fallthrough).
- [ ] [C3] Add `mcp` command group (`serve/add/add-from-claude-desktop/add-json/get/list/remove/reset-project-choices`) with correct help/exit codes (stubs acceptable initially).
- [ ] [C4] Add `plugin` command group (`validate/install/i/update/enable/disable/remove/uninstall`) and `plugin marketplace` subcommands (`add/list/remove/rm/update`) with correct help/exit codes (stubs acceptable initially).
- [ ] [C5] Add top-level `install` and `update` commands with correct help/exit behavior (stubs acceptable initially).
- [ ] [C6] Add `setup-token` command + token setup UX (at least non-interactive; add tests for parsing/validation).
- [ ] [C7] Implement permissions/tools flags plumbing (`--dangerously-skip-permissions`, `--allow-dangerously-skip-permissions`, `--permission-mode`, `--tools`, `--allowed-tools/--allowedTools`, `--disallowed-tools/--disallowedTools`).
- [ ] [C8] Implement session lifecycle flags plumbing (`-c/--continue`, `-r/--resume`, `--fork-session`, `--session-id`, `--no-session-persistence`, `--replay-user-messages`).
- [ ] [C9] Implement model/request shaping flags plumbing (`--model`, `--fallback-model`, `--betas`, `--max-budget-usd`, `--system-prompt`, `--append-system-prompt`, `--input-format`, `--output-format`, `--json-schema`, `--include-partial-messages`).
- [ ] [C10] Implement env/config/debug flags plumbing (`-d/--debug [filter]`, `--verbose`, `-e/--env`, `-H/--header`, `--ide`, `-s/--scope`, `--plugin-dir`, `--force`, `--add-dir`, `--agent`, `--agents`, `--settings`, `--setting-sources`).
- [ ] [C11] Implement MCP config flags plumbing for main CLI (`--mcp-config`, `--strict-mcp-config`, `--mcp-debug`, `-t/--transport`).
- [ ] [C12] Close internal `--mcp-cli` parity gaps (`info` command; state-file-mode `call`/`read` parity) or document intentional divergence.
- [ ] [C13] Resolve `-p` semantics mismatch (`--print` vs `--prompt`) via compatibility aliasing or a breaking-change decision (documented).
- [ ] [C14] Implement slash-commands UX (at least `/help` + `/resume`) and add `--disable-slash-commands`.
- [ ] [C15] Add tracked stubs for teleport/remote sessions (discoverable entrypoints; explicit “not implemented”).
- [ ] [C16] Add tracked stubs for session browser/resume picker UI (discoverable; explicit “not implemented”).
- [ ] [C17] Add tracked stubs for background agents (Magic Docs/classifier/session memory/prompt suggestion) (discoverable; explicit “not implemented”).
- [ ] [C18] Update default model for `-p/--prompt` to a non-deprecated model while preserving `--model` and `CLAUDE_TS_MODEL` overrides (add test).

## Encyclopedia Corrections
- [ ] [E1] Add a dedicated chapter for user-facing `claude mcp ...` commands (not only internal `--mcp-cli`).
- [ ] [E2] Add chapters for `claude plugin ...`, `claude plugin marketplace ...` (and any top-level `claude marketplace ...` alias), plus `claude setup-token`.
- [ ] [E3] Clarify 2.0.69 anchors that are usage sites vs definition sites.
- [ ] [E4] Document and/or align Windows policy directory selection (“Program Files if exists else ProgramData”) and call out TS divergence if it remains.
- [ ] [E5] Document endpoint-mode warning-text divergence (and decide whether to align).
- [ ] [E6] Document settings corruption backup/restore messaging divergence (and decide whether to align).

## Subprocess / Host Layer
- [ ] [S1] Audit and harden Node host keychain subprocess usage (`src/platform/node/host.ts`): explicit gating, bounded timeouts, and a “subprocess disabled” test.
- [ ] [S2] Ensure any shell execution feature is implemented only via explicit `HostShell` capability + policy gates (no ad-hoc subprocess usage).
