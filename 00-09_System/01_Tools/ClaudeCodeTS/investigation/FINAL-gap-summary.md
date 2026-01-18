# FINAL Gap Summary

## Executive Summary
Investigation run: `investigation-20251220-112837`.

The TypeScript rewrite has strong portable foundations (capabilities, settings, hooks, MCP client, tool runner), and the minimal `doctor` + `-p/--prompt` path works. However, it is missing the upstream CLI’s end-to-end “model ↔ tools” loop and most of the user-facing command surface, which blocks core Claude Code behaviors (tool calling, interactive-first UX, and major command groups like `mcp`, `plugin`/`plugin marketplace`, `install`, `update`, `setup-token`).

## Gap Statistics
- Total gaps found: 39
- P0 Critical: 8
- P1 High: 13
- P2 Medium: 14
- P3 Low: 4

Note: Encyclopedia issues (E*) include their priority as a prefix in the “Issue” text and are included in the counts above.

## All Gaps by Category

### Tool Calling Gaps
| ID | Gap | Priority | Effort |
|----|-----|----------|--------|
| T1 | No end-to-end tool-calling loop in TS (parse streamed `tool_use`, execute, send `tool_result`, repeat) | P0 | High |
| T2 | TS model calls don’t include tools/tool manifests (e.g. `runNonInteractivePrompt` extracts only text blocks) | P0 | High |
| T3 | No session tool registry composition/filtering equivalent to upstream `m81()` + `UH()` (only `--ripgrep` registers a builtin) | P0 | High |
| T4 | Missing/mismatched core first‑party tool inventory (core blockers: `Read/Write/Edit/Glob/Grep`; plus upstream: `Bash/WebFetch/WebSearch/Task/TaskOutput/KillShell/TodoWrite/NotebookEdit/AskUserQuestion/ExitPlanMode/Skill/StructuredOutput` + optional `LSP`; TS: `search.grep`, `patch.apply`) | P0 | High |
| T5 | No built-in tool schema export layer for model (`input_schema` / JSON-schema-like tool manifests for builtins) | P0 | High |
| T6 | Upstream tool input normalization/parity not implemented (`$02`/`w02` equivalents: Bash cwd rewrite, TaskOutput aliasing, write/edit shaping) | P1 | Medium |
| T7 | Permission gating + tool pipeline hooks exist but are not invoked from any model/tool loop | P0 | Medium |
| T8 | `StructuredOutput` tool flow missing (validated JSON final output + retry loop) | P2 | Medium |
| T9 | `Skill` tool / skills executor path missing (used for skill + slash-command expansions upstream) | P2 | High |
| T10 | MCP tool definitions exist, but MCP tools are not exposed via model tool calling (only via `--mcp-cli`) | P1 | High |
| T11 | Optional `LSP` tool parity missing (`ENABLE_LSP_TOOL`) | P3 | Medium |
| T12 | `HostShell` capability exists but is unavailable by default across shipped platforms (blocks safe Bash/KillShell parity unless explicitly implemented + gated) | P1 | Medium |
| T13 | Bash redirection parsing parity gap: TS tokenizer/simplification does not match upstream edge cases | P2 | Medium |

### CLI Command Gaps
| ID | Gap | Priority | Effort |
|----|-----|----------|--------|
| C1 | No default interactive REPL when invoked with no args (TS prints help and exits) | P0 | High |
| C2 | Unknown commands/flags fall through to interactive UI rendering instead of error/help (e.g. `install --help`, `mcp --help`) | P0 | Medium |
| C3 | Missing user-facing `mcp` command group: `serve`, `add`, `add-from-claude-desktop`, `add-json`, `get`, `list`, `remove`, `reset-project-choices` | P1 | High |
| C4 | Missing user-facing `plugin` + marketplace commands: `validate`, `install/i`, `update`, `enable`, `disable`, `remove/uninstall` plus `plugin marketplace add/list/remove/rm/update` (and any top-level `marketplace` alias if present upstream) | P1 | High |
| C5 | Missing `install` and `update` commands (and their help UX) | P1 | High |
| C6 | Missing `setup-token` command and token setup UX | P1 | Medium |
| C7 | Missing permissions/tooling controls: `--dangerously-skip-permissions`, `--allow-dangerously-skip-permissions`, `--permission-mode`, `--tools`, `--allowed-tools/--allowedTools`, `--disallowed-tools/--disallowedTools` | P1 | Medium |
| C8 | Missing session lifecycle controls: `-c/--continue`, `-r/--resume`, `--fork-session`, `--session-id`, `--no-session-persistence`, `--replay-user-messages` | P1 | High |
| C9 | Missing model/request shaping controls: `--model`, `--fallback-model`, `--betas`, `--max-budget-usd`, `--system-prompt`, `--append-system-prompt`, `--input-format`, `--output-format`, `--json-schema`, `--include-partial-messages` | P1 | High |
| C10 | Missing env/config/debug plumbing: `-d/--debug [filter]`, `--verbose`, `-e/--env`, `-H/--header`, `--ide`, `-s/--scope`, `--plugin-dir`, `--force`, `--add-dir`, `--agent`, `--agents`, `--settings`, `--setting-sources` | P2 | Medium |
| C11 | Missing MCP config flags for main CLI parity: `--mcp-config`, `--strict-mcp-config`, `--mcp-debug`, `-t/--transport` | P1 | Medium |
| C12 | Internal `--mcp-cli` parity gaps: missing `info` command; `call`/`read` work only in endpoint mode (should support state-file-mode direct-connect for parity) | P2 | Medium |
| C13 | Flag semantics mismatch: upstream `-p/--print` vs TS `-p/--prompt` (TS uses `--print-frame`) | P2 | Low |
| C14 | Slash commands UX missing (and `--disable-slash-commands` flag is missing) | P1 | High |
| C15 | Teleport/remote sessions and resume flows not implemented | P2 | High |
| C16 | Session browser / resume picker UI not implemented | P2 | Medium |
| C17 | Background agents not implemented (Magic Docs, classifier, session memory, prompt suggestion) | P2 | Medium |
| C18 | Default `-p` model is already deprecated (`src/cli/prompt.ts` defaults to `claude-3-7-sonnet-20250219`) | P2 | Low |

### Encyclopedia Issues
| ID | Issue | Type |
|----|-------|------|
| E1 | P2: Missing dedicated chapter for user-facing `claude mcp ...` (encyclopedia currently covers only internal `--mcp-cli`) | Missing coverage |
| E2 | P2: Missing chapters for `claude plugin`, `claude plugin marketplace ...` (and any top-level `claude marketplace ...` alias), plus `claude setup-token` | Missing coverage |
| E3 | P3: Some 2.0.69 anchors look like “definitions” but are usage sites; needs explicit clarification | Clarity |
| E4 | P2: Windows policy directory selection differs: bundles use “Program Files if exists else ProgramData”; TS currently always uses ProgramData | Platform mismatch |
| E5 | P3: Endpoint-mode warning text differs (TS omits legacy endpoint config path + session context) | TypeScript divergence |
| E6 | P3: Settings “corrupted file” backup/restore messaging exists in bundles but is not reproduced in TS (storage-backed settings abstraction) | TypeScript divergence |

### Subprocess Issues
| ID | Issue | Priority |
|----|-------|----------|
| S1 | Node host shells out to macOS `security` for keychain access (`execFile`), intentionally isolated to host layer | P2 |
| S2 | Shell execution parity requires an explicit `HostShell` implementation + policy surface; currently unavailable by default | P1 |

## Recommended Fix Order
1. Implement model ↔ tool loop end-to-end (T1, T2, T5, T7).
2. Add session tool registry composition and filtering (T3), then implement core builtin tools + normalization/parsing parity (T4, T6, T12, T13).
3. Fix CLI invocation semantics: interactive-by-default and unknown command/flag handling (C1, C2).
4. Expose MCP tools to model tool calling and close MCP CLI parity gaps (T10, C11, C12).
5. Restore major user-facing command groups and their flags (C3–C11, C14), even if initially as stubs with correct help/exit codes.
6. Implement deferred major subsystems (C15–C17) and optional tool features (T8–T11).
7. Update deprecated default model behavior (C18) and document override ergonomics.
8. Update encyclopedia chapters and platform notes (E1–E6).
