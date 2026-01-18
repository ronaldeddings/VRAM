# Legacy behavior matrix (externally observable)

Goal: list the *externally observable* behaviors that must remain stable until explicitly changed, and map each to its legacy source (encyclopedia) and bundle entrypoints.

Legend:
- “Encyclopedia” references are the review anchor.
- “Bundle entrypoints” are included to help locate exact implementation sites when needed, but the TS rewrite should not mirror bundle internals.

| Area | Behavior (stable contract) | Encyclopedia reference | Bundle entrypoints (2.0.67 / 2.0.69) | Notes / redesign flags |
|---|---|---|---|---|
| CLI modes | Interactive REPL vs `--print` non-interactive behavior selection | Chapter 3 + Chapter 9 | main (`fD5` / `BF5`) and CLI arg parse (commander) | Non-interactive must remain async-first and streaming-friendly |
| Output formats | `--output-format text|json|stream-json` semantics in `--print` mode | Chapter 3 (bootstrap) + CLI help captures | commander options on main program | Rewrite should preserve streaming envelope stability |
| Settings precedence | Enabled sources = `allowedSettingSources` subset + always include `policySettings` + `flagSettings` | Chapter 5 §5.2 | `us/Os` | Preserve exact enabled-source computation |
| Settings merge | Merge objects deep, arrays via union (dedupe + stable order), errors aggregated + deduped | Chapter 5 §5.6 | `UK5/gV5`, `zK5/hV5` | Deterministic merge is required for replay and tests |
| Settings IO | Per-source file locations (`~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, managed settings path, flag path) | Chapter 5 §5.3 | `xF/qF`, `J71/E71`, `ig2/ru2` | Must remain stable until migration phase explicitly changes |
| Permissions: context | Tool permission context shape + permission modes (`default`, `bypassPermissions`, `plan`, …) | Chapter 4 §4.1 + §4.8 | context factory (`Uw/s$`) | Treat as engine-level state later, not UI-only |
| Permissions: rule syntax | Rule strings are either `Tool(ruleContent)` or bare tool name; no escaping/nesting | Chapter 4 §4.2 | `NL/IL`, `X5/B5` | Preserve parse/stringify exactly |
| Permissions: source precedence | Rule sources checked in order: `userSettings`, `projectSettings`, `localSettings`, `flagSettings`, `policySettings`, `cliArg`, `command`, `session` | Chapter 4 §4.3 | `OY0/oY0` | Surprising but must be preserved for parity unless deliberately changed |
| Permissions: decision order | Deny → Ask (with Bash sandbox shortcut) → Tool-specific check → Mode override → Allow → fallback | Chapter 4 §4.7 | `QW5/LK5` | Mode overrides + sandbox shortcuts are compatibility sensitive |
| Hooks: events | Canonical hook event names list (PreToolUse, PostToolUse, … UserPromptSubmit, SessionStart/End, etc.) | Chapter 6 (event table) | exported wrappers | Event taxonomy must remain stable |
| Hooks: gates | `disableAllHooks` global disable + `policySettings.allowManagedHooksOnly` restricting hooks source set | Chapter 6 §6.2 + §6.9 | `CQ/NQ` checks | Gate precedence must remain stable |
| Hooks: selection | Matchers + dedupe (command/prompt/agent keyed; callback appended) | Chapter 6 §6.2-§6.3 | `bY0/IJ0`, normalizers | Deterministic selection + diagnostics required |
| Hooks: async protocol | “Async hook protocol”: stdout JSON `{ async:true, asyncTimeout? }` and background streaming handling | Chapter 6 §6.5.1 | `e51/Y71` + async handling | Marked for redesign (process-boundary artifact) but baseline must be documented |
| MCP CLI modes | `--mcp-cli` endpoint-mode vs state-file/direct mode behavior selection + warnings | Chapter 1 §1.2 + §1.9 | `lH/mH`, `wu2/Mm2` | Endpoint-mode telemetry de-dupe behavior must match legacy |
| MCP CLI gates | `ENABLE_EXPERIMENTAL_MCP_CLI`, `ENABLE_MCP_CLI_ENDPOINT`, `MCP_TOOL_TIMEOUT` semantics | Chapter 1 §1.1 | `hZ/uZ`, `_XA/_n`, `KAA/se` | Preserve env var semantics as host-config knobs later |
| AppState queues | Notifications, elicitation, worker permission queues, worker sandbox queue + pending wait overlays | Chapter 7 + Chapter 9 §9.7-§9.8 | AppState provider + overlay selector | Overlay ordering is externally visible UX behavior |
| Overlay ordering | Single-choice overlay selection order (message selector, sandbox, tool permission, worker, worker sandbox, elicitation, cost, IDE onboarding) | Chapter 9 §9.7 | `_W/OW` overlay selector | Must become deterministic state machine in rewrite |

## Coverage note

This matrix is scoped to Phase 1’s “behavioral baseline”. It is expected to expand as more chapters of the encyclopedia are formally captured into phase specs and fixtures.

