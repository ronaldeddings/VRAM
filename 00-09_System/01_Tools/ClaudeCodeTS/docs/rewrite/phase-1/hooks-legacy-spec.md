# Hooks — legacy spec (events, selection, gating, async protocol)

This document formalizes the legacy hooks system contract.

Primary source: `CLI_ENCYCLOPEDIA.md` Chapter 6 (“Hooks subsystem”).

## 1) Canonical hook event names (baseline)

Reference: Chapter 6 event table.

Legacy hook events (stable names):
- `PreToolUse`
- `PostToolUse`
- `PostToolUseFailure`
- `PermissionRequest`
- `Stop` / `SubagentStop`
- `UserPromptSubmit`
- `SessionStart`
- `SessionEnd`
- `SubagentStart`
- `Notification`
- `PreCompact`
- `StatusLine`
- `FileSuggestion`

## 2) Hook sources and precedence

Reference: Chapter 6 §6.2.

Hook definitions can come from:
1. Effective settings `hooks` field.
2. Plugin hooks from `~/.claude/plugins/*/hooks/hooks.json` (when policy allows).
3. Session hooks stored in `AppState.sessionHooks[sessionId]`.

Policy gate:
- If `policySettings.allowManagedHooksOnly === true`, use only policy-managed hooks (exclude plugin + user/project/local hooks).

## 3) Global hook gating

Reference: Chapter 6 §6.9.

- If effective settings contain `disableAllHooks === true`, hook execution short-circuits (no hooks run).
- Workspace trust gating also applies (hooks can be suppressed in untrusted workspaces).

## 4) Hook selection algorithm (deterministic expectations)

Reference: Chapter 6 §6.3.

Selection inputs include:
- event name
- match query (varies per event; e.g., tool name)
- matcher definitions (per event)

Selection outputs:
- ordered list of hooks to execute
- diagnostics (which matchers matched, dedupe decisions, etc.)

Dedupe rules (legacy):
- `command` hooks deduped by `command`
- `prompt` hooks deduped by `prompt`
- `agent` hooks deduped by prompt stringification for empty args
- `callback` hooks are appended (not deduped)

## 5) Hook input shape (baseline)

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 6 §6.4.

Base `hookInput` fields (stable):
- `session_id` (defaults to current session id)
- `transcript_path` (path for that session transcript)
- `cwd` (current working directory)
- `permission_mode` (may be omitted in some contexts; see below)

Event-specific fields layered on top (stable keys as documented):
- `PreToolUse`: `hook_event_name`, `tool_name`, `tool_input`, `tool_use_id`
- `PostToolUse`: `hook_event_name`, `tool_name`, `tool_input`, `tool_response`, `tool_use_id`
- `PostToolUseFailure`: `hook_event_name`, `tool_name`, `tool_input`, `tool_use_id`, `error`, `is_interrupt`
- `PermissionRequest`: `hook_event_name`, `tool_name`, `tool_input`, `permission_suggestions`
- `Notification`: `hook_event_name`, `message`, `title`, `notification_type`
- `UserPromptSubmit`: `hook_event_name`, `prompt`
- `SessionStart`: `hook_event_name`, `source`
- `SessionEnd`: `hook_event_name`, `reason`
- `SubagentStart`: `hook_event_name`, `agent_id`, `agent_type`
- `Stop`: `hook_event_name`, `stop_hook_active`
- `SubagentStop`: `hook_event_name`, `stop_hook_active`, `agent_id`, `agent_transcript_path`
- `PreCompact`: `hook_event_name`, `trigger`, `custom_instructions`

Nuance (must be preserved):
- Some hooks are invoked with `permission_mode` omitted (`undefined`), especially outside-REPL executions.

## 6) Hook execution modes

Reference: Chapter 6 (intro) and §6.9–§6.10.

- REPL streaming executor yields progress and success/error messages as hooks run.
- Non-REPL executor returns simplified results and refuses to run some hook types outside REPL (prompt/agent).

## 7) Async hook protocol (legacy subprocess artifact)

Reference: Chapter 6 §6.5.1.

Legacy “command hook” can emit a JSON object on stdout like:
- `{ "async": true, "asyncTimeout"?: number }`

This triggers “background hook” continuation behavior (long-running hook handoff).

The rewrite must preserve this behavior as a documented compatibility target, but this protocol is a redesign candidate (see `legacy-process-boundary-artifacts.md`).

## 8) Command-hook environment injection (baseline)

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 6 §6.5.

Legacy “command hooks” run with an env that includes:
- inherited `process.env`
- `CLAUDE_PROJECT_DIR=<projectDir>`
- (SessionStart only, when present) `CLAUDE_ENV_FILE=<tempEnvFile>`

And supports a host-configured shell prefix:
- `CLAUDE_CODE_SHELL_PREFIX` (prefixes the command line before execution)

## 9) Hook agent safeguards (turn limits, budgeting defaults)

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 6 (“Prompt hooks and agent hooks”).

Legacy supports “model-driven hooks”:
- prompt hooks (`type:"prompt"`) that query the model to return structured `{ ok, reason? }`
- agent hooks (`type:"agent"`) that run a dedicated non-interactive agent loop which must terminate by calling a tool that returns structured output

Safeguards (baseline):
- agent hooks have a hard max-turns guard (legacy value: `50` turns); exceeding it results in an aborted/cancelled outcome
- hook agents run in a restricted permission context (legacy forces `"dontAsk"` and injects a transcript-read allow rule) to ensure deterministic completion
- hook outputs are validated (legacy uses a schema validator); validation failures are non-blocking unless explicitly marked as blocking

Rewrite requirement:
- preserve these guardrails as explicit budgeting constraints and deterministic cancellation reasons (not implicit subprocess behavior).

## 10) Failure handling and stop-hook behavior (blocking vs warnings)

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 6 (“Hook output interpretation”) + Chapter 9 overlay UX.

Legacy hook outcomes are classified into:
- **success**: hook ran and did not block continuation
- **blocking**: hook explicitly prevents continuation (e.g., stop hook blocks exit, prompt submit blocks prompt, pre-tool hook blocks tool run)
- **non-blocking error**: hook failed or produced invalid output but does not block continuation (reported as warnings/attachments)
- **cancelled/timeout**: hook was aborted by user/system/timeout (reported; continuation may proceed depending on hook type)

Stop hooks:
- stop hook events (`Stop` / `SubagentStop`) can block exit if they return a blocking outcome; the UI must render the “stop hook feedback” messaging and remain interactive until resolved.

Non-REPL execution:
- legacy refuses to run some hook types (prompt/agent/function) outside the REPL/interactive context; those are treated as unsupported or internal errors rather than silently skipped.
