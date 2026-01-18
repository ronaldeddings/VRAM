#!/usr/bin/env bash
set -euo pipefail

# REMEDIATION SCRIPT
# Generated from investigation run: investigation-20251220-112837
#
# This script addresses gaps found in the CLI.js → TypeScript migration.
#
# Usage:
#   ./investigation/remediate-gaps.sh
#
# Options:
#   DRY_RUN=1 ./investigation/remediate-gaps.sh   # print prompts only
#

export PATH="$HOME/.bun/bin:$PATH"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUN_ID="investigation-20251220-112837"
GAP_SUMMARY_FILE="$ROOT_DIR/investigation/FINAL-gap-summary.md"
PLAN_ADDENDUM_FILE="$ROOT_DIR/investigation/additional-plan-items.md"
PLAN_FILE="$ROOT_DIR/implementation/1-initial-rewrite-implementation-checklist.md"
AGENT_CMD="${AGENT_CMD:-codex}"
DRY_RUN="${DRY_RUN:-0}"

cd "$ROOT_DIR"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1" >&2; exit 1; }
}

banner() {
  echo
  echo "===============================================================================";
  echo "$1"
  echo "===============================================================================";
}

validate_quick() {
  if [[ "$DRY_RUN" == "1" ]]; then
    banner "Validation: quick (skipped; DRY_RUN=1)"
    return 0
  fi
  banner "Validation: quick"
  bun run typecheck
  bun run cli --help >/dev/null
}

validate_full() {
  if [[ "$DRY_RUN" == "1" ]]; then
    banner "Validation: full (skipped; DRY_RUN=1)"
    return 0
  fi
  banner "Validation: full"
  bun test
  bun run typecheck
  bun run build
  bun run check:boundaries
  bun run cli --help
  bun run cli --version

  if [[ -n "${ANTHROPIC_API_KEY:-}" || -n "${ANTHROPIC_AUTH_TOKEN:-}" ]]; then
    bun run cli -p "test prompt"
  else
    echo "Skipping 'bun run cli -p ...' (no ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN set)."
  fi
}

run_codex_fix() {
  local fix_id="$1"
  local prompt="$2"

  banner "Fixing: $fix_id"
  echo "$prompt"
  echo

  if [[ "$DRY_RUN" == "1" ]]; then
    echo "DRY_RUN=1 set; not invoking codex."
    return 0
  fi

  if [[ "$AGENT_CMD" == "codex" ]]; then
    require_cmd codex
    printf "%s\n" "$prompt" | codex exec - --cd "$ROOT_DIR"
    return 0
  fi

  echo "AGENT_CMD=$AGENT_CMD is not supported for automated execution in this script."
  echo "Run the above prompt manually (recommended: \`codex exec - --cd \"$ROOT_DIR\"\`)."
  return 0
}

require_cmd bun

#===============================================================================
# PHASE 1: CRITICAL TOOL CALLING FIXES (P0)
#===============================================================================

banner "PHASE 1: CRITICAL TOOL CALLING FIXES (P0)"

run_codex_fix "T1+T2+T5+T7" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-1-tool-gaps.md

You are fixing the TS rewrite to support real tool calling (parity with bundled CLI.js).

Implement an end-to-end model ↔ tools loop:
- When calling Anthropic (currently `src/cli/prompt.ts`), include the session tool manifest (tools array with correct `input_schema`) and support tool calling.
- Parse streamed responses for tool-use blocks (assemble `input_json_delta`), execute tools via `ToolRunner` with permission gate + tool pipeline hooks, then send `tool_result` blocks back to the model and continue until final assistant text.

Constraints:
- Keep portable core: no Node-only APIs in `src/core/*` beyond existing host capabilities.
- Reuse existing tool infrastructure: `src/core/tools/registry.ts`, `src/core/tools/runner.ts`, `src/core/tools/permissionGate.ts`, `src/core/hooks/toolPipeline.ts`.
- Implement a Zod→JSON-schema export for builtin tools so the model receives `input_schema` (upstream emits JSON-schema-like tool schemas).
- Ensure errors become tool_result blocks (not uncaught exceptions).

Acceptance criteria:
- `bun run cli -p "use a tool"`, with a fake tool registered, performs tool_use → tool_result loop.
- `bun run typecheck` passes.
- Add at least one unit test (or minimal deterministic harness) that validates tool_use parsing + tool_result emission without making network calls.
PROMPT
)"

validate_quick

run_codex_fix "T3" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-1-tool-gaps.md

Add a canonical “session tool registry composition” for the main CLI, equivalent to upstream’s built-in tool registry + filtering.

Implement:
- A single place that composes builtin tools + MCP tools into a ToolRegistry for a session.
- Filtering by permissions/settings (allowed/disallowed tools, permission mode) even if some settings are stubbed initially.
- Ensure `runNonInteractivePrompt` uses this composed registry.

Files to consider:
- `src/core/tools/index.ts` (or new `src/core/tools/builtins/index.ts`)
- `src/core/tools/registry.ts`
- `src/core/mcp/tools.ts` (for MCP tool definitions)

Acceptance:
- Tools registry can be constructed for a session and enumerated (names + schemas).
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

#===============================================================================
# PHASE 2: TOOL INVENTORY + MCP INTEGRATION (P0/P1/P2)
#===============================================================================

banner "PHASE 2: TOOL INVENTORY + MCP INTEGRATION (P0/P1/P2)"

run_codex_fix "T4+T6+T13" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-1-tool-gaps.md
- investigation/iteration-2-encyclopedia-verification.md

Implement the missing core first-party tools (or stub them with correct names/schemas if full behavior is too large), and add upstream-parity input normalization where known.

Target tools (upstream names):
- `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebFetch`, `WebSearch`
- `TodoWrite` (at minimum; others can be stubs with explicit "unimplemented" results)

Notes:
- Prefer implementing filesystem tools via `HostFilesystem` capability; no direct `fs` in core.
- Keep tool names aligned with upstream; if TS uses different internal names, add canonical mapping in `src/core/migration/toolMapping.ts`.
- Add normalization/parsing hooks (Bash cwd rewrite, write/edit content shaping, bash redirection parsing edge cases) in one place so it’s testable.

Acceptance:
- Tool manifests expose correct names + `input_schema`.
- Calling at least `Read/Write/Glob/Grep` works end-to-end via the tool loop in `-p`.
- Add unit tests for normalization + schema generation for at least two tools.
PROMPT
)"

validate_quick

run_codex_fix "T10" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-1-tool-gaps.md

Expose MCP tools through model tool calling (not only via `--mcp-cli`).

Implement:
- Session tool composition includes MCP tools when MCP capability is available.
- ToolRunner can execute MCP tool definitions end-to-end and return `tool_result`.
- Ensure tool names are canonicalized (e.g. `mcp__server__tool`) and match upstream naming conventions.
- Add the upstream-style MCP helper tools if they remain part of the intended surface area (`ListMcpResourcesTool`, `ReadMcpResourceTool`, and any `mcp` wrapper tool used to dispatch).

Acceptance:
- A mocked MCP tool can be executed through the same model tool loop and returns tool_result.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "T8" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-1-tool-gaps.md

Add `StructuredOutput` support (validated JSON output tool), matching upstream semantics at a high level:
- When requested, expose the tool and require the model to call it with JSON matching a schema.
- On validation failure, provide an error tool_result and allow retry.

Acceptance:
- Add tests showing invalid JSON fails with a tool_result error and can be retried.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "T9" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-1-tool-gaps.md

Add the missing `Skill` tool / skills executor path:
- Provide a minimal “skills registry” and an executor that expands a named skill into a prompt/system content (or returns an explicit unimplemented tool_result).
- Ensure the tool exists in the manifest and can be invoked via tool_use.

Acceptance:
- `Skill` appears in tool manifest.
- A unit test demonstrates `Skill` execution returning deterministic tool_result output.
PROMPT
)"

validate_quick

run_codex_fix "T11" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md

Add optional `LSP` tool parity behind a gate (e.g. `ENABLE_LSP_TOOL`), matching upstream behavior:
- When disabled, the tool is absent.
- When enabled, tool exists but may return an explicit “unsupported” result unless a host provides it.

Acceptance:
- Tool manifest changes with env gate.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "T12+S2" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-4-subprocess-migration.md

Decide and implement how shell execution should work in the rewrite:
- If Bash/KillShell parity is desired on Node, implement `HostShell` for the Node host with explicit policy gating (no silent fallback).
- Ensure shell capability remains unavailable on web/RN.
- Wire tool permission gating so shell tool requests are denied unless explicitly allowed.

Acceptance:
- A Node-only shell capability exists and is clearly gated.
- Tool loop can execute a Bash-like tool only when enabled.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

#===============================================================================
# PHASE 3: CLI COMMAND SURFACE RESTORATION
#===============================================================================

banner "PHASE 3: CLI COMMAND SURFACE RESTORATION"

run_codex_fix "C1+C2" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Fix CLI invocation semantics in `src/cli.ts`:
- When invoked with no args, start interactive mode (or a clearly defined equivalent), not `--help`.
- Unknown commands/flags must produce a non-zero exit and a helpful error + usage (do not fall through to UI frame rendering).

Acceptance:
- `bun run cli` starts interactive mode (or prints a clear interactive banner).
- `bun run cli install --help` prints install help or an "unknown command" error, but never the UI frame dump.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "C3" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Implement the user-facing `mcp` command group (distinct from internal `--mcp-cli`), at least with correct help/exit codes:
- Commands: `mcp serve`, `mcp add`, `mcp add-from-claude-desktop`, `mcp add-json`, `mcp get`, `mcp list`, `mcp remove`, `mcp reset-project-choices`.
- Hook into existing settings + MCP subsystems where possible; if behavior is large, implement stubs that clearly say “not implemented yet” but match CLI structure.

Acceptance:
- `bun run cli mcp --help` and each subcommand `--help` works and exits 0.
- Unknown subcommands error and exit non-zero.
PROMPT
)"

validate_quick

run_codex_fix "C4" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Implement the user-facing `plugin` command group (and `plugin marketplace ...`) with correct structure and help UX:
- `plugin validate/install/i/update/enable/disable/remove/uninstall`
- `plugin marketplace add/list/remove/rm/update`
- If upstream exposes a top-level `marketplace` command alias, implement it as well (or add a compatibility shim/alias).

Acceptance:
- `bun run cli plugin --help` and subcommand `--help` work and exit 0.
PROMPT
)"

validate_quick

run_codex_fix "C5" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Add `install` and `update` commands with correct help/exit behavior.
If full implementation is out-of-scope, add stubs that:
- Print what would be done
- Exit non-zero only when invoked without `--help` and unimplemented

Acceptance:
- `bun run cli install --help` and `bun run cli update --help` work.
PROMPT
)"

validate_quick

run_codex_fix "C6" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Add `setup-token` command:
- Implement the non-interactive token setup flow at minimum (reading token from stdin/env, storing in secrets, validating format).
- If full UX is out-of-scope, implement a stub with clear instructions.

Acceptance:
- `bun run cli setup-token --help` works.
- Add a unit test for token parsing/validation logic.
PROMPT
)"

validate_quick

run_codex_fix "C7+C8+C9+C10+C11+C13" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Restore key CLI flags and align parsing behavior with upstream:
- Implement parsing + plumbing for: permissions/tools flags (C7), session lifecycle flags (C8), model/request shaping flags (C9), debug/env flags (C10), MCP config flags (C11).
- Ensure the long-tail parity flags from the investigation are covered (even if stubbed): `--add-dir`, `--agent`, `--agents`, `--settings`, `--setting-sources`, `--include-partial-messages`.
- Decide how to handle `-p`: upstream uses `-p/--print`, TS uses `-p/--prompt` + `--print-frame`; align or provide compatibility aliases.
- While doing model plumbing, ensure the default model is not already deprecated, and keep env/flag overrides working.

Acceptance:
- `bun run cli --help` lists the flags (even if some are stubbed).
- Passing each flag no longer falls through to UI frame dump.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "C18" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-3-cli-parity.md

Update the default model selection for `-p/--prompt` in `src/cli/prompt.ts`:
- Stop defaulting to a model that is already deprecated (currently `claude-3-7-sonnet-20250219`), since it produces warnings and will eventually fail.
- Keep existing override behavior: `--model` and `CLAUDE_TS_MODEL` should continue to work.
- Add/adjust a small unit test (or deterministic config test) that asserts the default model string is not the deprecated one, without making network calls.

Acceptance:
- `bun run cli -p "test prompt"` no longer prints a deprecation warning when no `--model` / env override is supplied.
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "C12" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-2-encyclopedia-verification.md

Close internal `--mcp-cli` parity gaps:
- Add `info` command if upstream has it.
- Support `call` and `read` in state-file mode via a direct-connect strategy (or print a parity warning with next steps).

Acceptance:
- `bun run cli --mcp-cli --help` documents `info` (if implemented).
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

run_codex_fix "C14" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-2-encyclopedia-verification.md

Implement slash commands UX (or an explicit, correct stub):
- Add `--disable-slash-commands` flag.
- Provide a minimal slash command parser in interactive mode for at least `/help` and `/resume` (even if unimplemented, must not crash).

Acceptance:
- Interactive mode recognizes `/help`.
- `--disable-slash-commands` disables parsing.
PROMPT
)"

validate_quick

run_codex_fix "C15+C16+C17" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-2-encyclopedia-verification.md

Add tracked stubs (with clear TODOs and correct telemetry hooks where applicable) for the remaining major CLI subsystems:
- Teleport/remote sessions (C15)
- Session browser/resume picker UI (C16)
- Background agents: Magic Docs, classifier, session memory, prompt suggestion (C17)

Acceptance:
- Commands/UI entrypoints exist and are discoverable, but explicitly state “not implemented”.
- No crashes; `bun run typecheck` passes.
PROMPT
)"

validate_quick

#===============================================================================
# PHASE 4: ENCYCLOPEDIA + SUBPROCESS CLEANUP
#===============================================================================

banner "PHASE 4: ENCYCLOPEDIA + SUBPROCESS CLEANUP"

run_codex_fix "E1+E2+E3+E4+E5+E6" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-2-encyclopedia-verification.md

Update `CLI_ENCYCLOPEDIA.md` to reflect verified bundle behavior:
- Add dedicated chapters for user-facing `claude mcp ...`, `claude plugin ...` (including `claude plugin marketplace ...`), and `claude setup-token`.
- Clarify in Chapter 1 when anchors are usage sites vs definition sites.
- Document Windows policy dir selection (“Program Files if exists else ProgramData”) and note TS divergence if still present.
- Note TS divergences discovered during verification (e.g. endpoint-mode warning text, settings corruption backup/restore messaging) and whether they are intentional.

If parity is desired (recommended), also update the TS implementation to match the bundles where feasible:
- Align Windows policy-dir selection logic in `src/core/settings/legacyPaths.ts` (Program Files if exists else ProgramData), with a small deterministic test.

Acceptance:
- Encyclopedia corrections match investigation findings.
PROMPT
)"

validate_quick

run_codex_fix "S1" "$(cat <<'PROMPT'
Context:
- investigation/FINAL-gap-summary.md
- investigation/iteration-4-subprocess-migration.md

Audit and harden the remaining subprocess usage for keychain (`src/platform/node/host.ts`):
- Ensure it is clearly gated (e.g. allowSubprocess), time-bounded, and error-handled.
- Add a short unit test (or host-level test) that validates behavior when subprocess use is disabled.

Acceptance:
- `bun run typecheck` passes.
PROMPT
)"

validate_quick

#===============================================================================
# PHASE 5: FINAL VALIDATION
#===============================================================================

validate_full

banner "Remediation complete."
echo "Generated from run: $RUN_ID"
echo "Gap summary: $GAP_SUMMARY_FILE"
echo "Plan addendum: $PLAN_ADDENDUM_FILE"
echo "Plan reference: $PLAN_FILE"
