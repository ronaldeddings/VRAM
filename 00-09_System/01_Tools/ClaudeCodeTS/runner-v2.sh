#!/usr/bin/env bash
set -euo pipefail

# Ensure bun + codex are available
export PATH="$HOME/.bun/bin:$PATH"

ROOT_DIR="$(pwd)"
SRC_DIR="$ROOT_DIR/src"
CHANGELOG_ROOT="$ROOT_DIR/changelogs"
PLAN_FILE="$ROOT_DIR/implementation/1-initial-rewrite-implementation-checklist.md"

# Where your minified bundles live (adjust this!)
BUNDLES_DIR="$ROOT_DIR/bundles"   # e.g. contains ClaudeAgentSDKCode/cli.js, ClaudeCodeCode/cli.js

# Optional: additional docs
DOCS_DIR="$ROOT_DIR/docs"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
RUN_ID="implementation-$TIMESTAMP"
RUN_CHANGELOG_DIR="$CHANGELOG_ROOT/$RUN_ID"

mkdir -p "$RUN_CHANGELOG_DIR"
mkdir -p "$SRC_DIR"

if [[ ! -f "$PLAN_FILE" ]]; then
  echo "❌ Implementation plan not found: $PLAN_FILE"
  exit 1
fi

if [[ ! -d "$BUNDLES_DIR" ]]; then
  echo "❌ Bundles directory not found: $BUNDLES_DIR"
  exit 1
fi

echo "📁 Run ID:"
echo "   $RUN_ID"
echo ""
echo "📄 Plan:    $PLAN_FILE"
echo "📦 Bundles: $BUNDLES_DIR"
echo "📂 Target:  $SRC_DIR"
echo ""

run_codex() {
  local prompt_file="$1"
  local output_file="$2"
  mkdir -p "$(dirname "$output_file")"

  # Allocate TTY and feed prompt via STDIN
  script -q /dev/null bash -c "
    codex exec --dangerously-bypass-approvals-and-sandbox < \"$prompt_file\"
  " > "$output_file"
}

# Extract phase headers from the plan (expects lines like: "## Phase 1: ...")
# mapfile -t PHASE_LINES < <(grep -nE '^##[[:space:]]+Phase[[:space:]]+[0-9]+:' "$PLAN_FILE" || true)

# if [[ ${#PHASE_LINES[@]} -eq 0 ]]; then
#   echo "❌ No phases found in plan. Expected headings like: '## Phase 1: ...'"
#   exit 1
# fi

TOTAL_PHASES="19"
echo "✅ Found $TOTAL_PHASES phases in plan."
echo ""

for ((p=5; p<=TOTAL_PHASES; p++)); do
  echo "🚀 Phase $p / $TOTAL_PHASES"

  CHANGELOG_FILE="$RUN_CHANGELOG_DIR/phase-$p-changelog.md"
  PREV_CHANGELOG="$RUN_CHANGELOG_DIR/phase-$((p-1))-changelog.md"

  PROMPT_FILE="$(mktemp)"

  {
    echo "You are implementing PHASE $p of $TOTAL_PHASES."
    echo ""
    echo "=============================================="
    echo "MISSION: IMPLEMENT THE REWRITE PLAN (PHASE-BY-PHASE)"
    echo "=============================================="
    echo ""
    echo "AUTHORITATIVE INPUTS:"
    echo "- Implementation Plan: @$PLAN_FILE"
    echo "- CLI Encyclopedia: @CLI_ENCYCLOPEDIA.md"
    echo "- Bundles directory: @$BUNDLES_DIR"
    echo "- Target source directory: @src"
    if [[ -d "$DOCS_DIR" ]]; then
      echo "- Local docs directory: @$DOCS_DIR"
    fi
    echo ""

    if [[ -f "$PREV_CHANGELOG" ]]; then
      echo "PREVIOUS PHASE CHANGELOG:"
      echo "- @$PREV_CHANGELOG"
      echo ""
    fi

    echo "CRITICAL RULES:"
    echo "1) Only implement PHASE $p right now."
    echo "2) Do NOT jump ahead to future phases."
    echo "3) Read the relevant files thoroughly, especially the bundled/minified cli.js files @bundles/ClaudeCodeCode/cli.js and @bundles/ClaudeAgentSDKCode/cli.js."
    echo "4) You must treat third-party code as dependencies — do not re-implement vendor internals."
    echo "5) You must build a clean TypeScript module graph in ./src that matches the plan and the encyclopedia and @implementation/1-initial-rewrite-implementation-checklist.md"
    echo "6) Prefer async-first JS/TS, no subprocess-centric control flow."
    echo ""
    echo "AUTHENTICATION REQUIREMENT (SAFE):"
    echo "- Use keychain to extract secrets, search for Claude Code-credentials .... within it there is an accessToken.... Also reference CLAUDE_CODE_SESSION_ACCESS_TOKEN in our old cli.js files"
    echo "- Assume that using the keychain secret will log you in and you do NOT need to run /login."
    echo "- If you're able to run 'claude --dangerously-skip-permissions -p sayhello' and if it works, then creds are good and your code is not good."
    echo ""
    echo "WHAT TO DO IN THIS PHASE:"
    echo "- Locate the '## Phase $p:' section in the implementation plan and implement it fully."
    echo "- If the plan references new files/modules to create, create them in ./src."
    echo "- If it references refactors or migrations, do the minimal necessary to complete this phase safely."
    echo "- If something is ambiguous, make a reasonable best decision and record it in the changelog as a 'Decision'."
    echo ""
    echo "VALIDATION:"
    echo "- Run whatever is appropriate to validate progress (typecheck, tests, basic run), but avoid destructive commands."
    echo "- YOU MUST RUN THE IDENTICAL COMMAANDS that are in the previous cli.js files...."
    echo "- If you cannot run something, explain why and what command should be run by the user."
    echo ""
    echo "STDOUT CONTRACT:"
    echo "- Output ONLY a PHASE Change Log."
    echo "- Include these sections:"
    echo "  1) Summary (what you accomplished in Phase $p)"
    echo "  2) Files changed (created/modified/deleted)"
    echo "  3) Decisions made (with rationale)"
    echo "  4) Tests/validation run + results"
    echo "  5) Remaining work inside Phase $p (if any)"
    echo "  6) Handoff notes for next phase"
    echo ""
    echo "DO NOT print source code to stdout."
    echo "Begin now."
  } > "$PROMPT_FILE"

  run_codex "$PROMPT_FILE" "$CHANGELOG_FILE"
  rm "$PROMPT_FILE"

  echo "✅ Phase $p complete:"
  echo "   $CHANGELOG_FILE"
  echo ""
done

echo "🎉 All phases complete."
echo ""
echo "Artifacts:"
echo "  - Rewritten source: $SRC_DIR"
echo "  - Phase change logs: $RUN_CHANGELOG_DIR"
