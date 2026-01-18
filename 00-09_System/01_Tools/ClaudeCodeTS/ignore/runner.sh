#!/usr/bin/env bash
set -euo pipefail

# Ensure bun + codex are available
export PATH="$HOME/.bun/bin:$PATH"

ROOT_DIR="$(pwd)"
INSTRUCTION_FILE="$ROOT_DIR/instruction.md"

CHANGELOG_ROOT="$ROOT_DIR/changelogs"
PLAN_ROOT="$ROOT_DIR/implementation"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
RUN_ID="1-rewrite-plan-$TIMESTAMP"

RUN_CHANGELOG_DIR="$CHANGELOG_ROOT/$RUN_ID"
RUN_PLAN_DIR="$PLAN_ROOT/$RUN_ID"

mkdir -p "$RUN_CHANGELOG_DIR"
mkdir -p "$RUN_PLAN_DIR"

if [[ ! -f "$INSTRUCTION_FILE" ]]; then
  echo "❌ instruction.md not found"
  exit 1
fi

echo "📁 Run ID:"
echo "   $RUN_ID"
echo ""

run_codex() {
  local prompt_file="$1"
  local output_file="$2"

  mkdir -p "$(dirname "$output_file")"

  # Allocate TTY and feed prompt via STDIN (THIS IS REQUIRED)
  script -q /dev/null bash -c "
    codex exec --dangerously-bypass-approvals-and-sandbox < \"$prompt_file\"
  " > "$output_file"
}

ITERATIONS=5

for ((i=1; i<=ITERATIONS; i++)); do
  echo "🚀 Iteration $i / $ITERATIONS"

  PROMPT_FILE="$(mktemp)"
  CHANGELOG_FILE="$RUN_CHANGELOG_DIR/agent-change-log-iteration-$i.md"
  PREV_CHANGELOG="$RUN_CHANGELOG_DIR/agent-change-log-iteration-$((i-1)).md"

  {
    echo "You are performing ITERATION $i of $ITERATIONS."
    echo ""
    echo "AUTHORITATIVE INPUTS:"
    echo "- @instruction.md"
    if [[ -f "$PREV_CHANGELOG" ]]; then
      echo "- @$PREV_CHANGELOG"
    fi
    echo ""
    echo "PRIMARY OBJECTIVE:"
    echo "Design and continuously refine a VERY DEEP, VERY TECHNICAL implementation plan"
    echo "for a full rewrite of the application described in instruction.md."
    echo ""
    echo "THIS IS NOT A SUMMARY."
    echo "THIS IS NOT A HIGH-LEVEL OUTLINE."
    echo "THIS IS A STAFF-ENGINEER-LEVEL IMPLEMENTATION CHECKLIST."
    echo ""
    echo "MANDATORY TECHNICAL REQUIREMENTS:"
    echo "- The plan MUST be structured into numbered PHASES."
    echo "- Each phase MUST contain subsections (e.g., 3.1, 3.2, 3.3)."
    echo "- Each subsection MUST contain checklist items."
    echo "- Checklist items MUST be concrete, testable, and technical."
    echo "- Err on the side of TOO MUCH detail."
    echo ""
    echo "MANDATORY SUBSYSTEM COVERAGE (do not omit):"
    echo "- Core async runtime & scheduling model"
    echo "- Tool execution without subprocesses"
    echo "- Hooks system redesign (pure async, no shell)"
    echo "- Permissions & policy engine"
    echo "- MCP integration (endpoint vs direct, mobile-safe)"
    echo "- Settings & configuration system"
    echo "- App/session state model"
    echo "- Background agents & long-running tasks"
    echo "- Host capability abstraction (iOS, Web, Desktop)"
    echo "- Observability, logging, telemetry boundaries"
    echo "- Testing strategy (unit, integration, cross-platform)"
    echo "- Migration strategy from existing CLI"
    echo "- Risk register & deferred decisions"
    echo "- Completion criteria"
    echo ""
    echo "ITERATION-SPECIFIC INSTRUCTIONS:"
    if [[ "$i" -eq 1 ]]; then
      echo "- Create the INITIAL exhaustive plan from scratch."
    else
      echo "- Read the existing implementation plan on disk."
      echo "- Expand, deepen, and refine it."
      echo "- Break vague checklist items into smaller ones."
      echo "- Add missing phases or subsystems."
      echo "- Increase technical specificity."
    fi
    echo ""
    echo "ABSOLUTE CONSTRAINTS:"
    echo "- Do NOT write production code."
    echo "- Do NOT write full function implementations."
    echo "- Small illustrative snippets are allowed ONLY if essential."
    echo "- Do NOT assume Node-only APIs."
    echo ""
    echo "FILE OUTPUT REQUIREMENT:"
    echo "- Write or overwrite the implementation plan ON DISK"
    echo "- Location is defined in instruction.md"
    echo ""
    echo "STDOUT CONTRACT (CRITICAL):"
    echo "- DO NOT print the implementation plan."
    echo "- Output ONLY an Agent Change Log."
    echo "- The change log MUST include:"
    echo "  - What sections were added or expanded"
    echo "  - What technical depth was increased"
    echo "  - What assumptions were made"
    echo "  - What remains incomplete or risky"
    echo ""
    echo "Begin now."
  } > "$PROMPT_FILE"

  run_codex "$PROMPT_FILE" "$CHANGELOG_FILE"
  rm "$PROMPT_FILE"

  echo "✅ Wrote:"
  echo "   $CHANGELOG_FILE"
  echo ""
done

echo "🎉 All iterations complete."
echo ""
echo "Artifacts:"
echo " - Implementation Plan directory: $RUN_PLAN_DIR"
echo " - Agent Change Logs: $RUN_CHANGELOG_DIR"
