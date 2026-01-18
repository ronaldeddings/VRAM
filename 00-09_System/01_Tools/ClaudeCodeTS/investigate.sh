#!/usr/bin/env bash
set -euo pipefail

#===============================================================================
# CLI.JS → TYPESCRIPT INVESTIGATION SCRIPT
#===============================================================================
# This script performs 5 deep investigation iterations to verify that the
# original CLI.js files have been fully and correctly implemented in TypeScript.
#
# Key focus areas:
# - Tool calling implementation
# - Encyclopedia accuracy
# - Actual CLI execution tests (bun run cli)
# - Feature parity verification
#
# Output: A remediation script to fix any gaps found
#===============================================================================

export PATH="$HOME/.bun/bin:$PATH"

ROOT_DIR="$(pwd)"
SRC_DIR="$ROOT_DIR/src"
BUNDLES_DIR="${BUNDLES_DIR:-$ROOT_DIR/bundles}"
PLAN_FILE="${PLAN_FILE:-$ROOT_DIR/implementation/1-initial-rewrite-implementation-checklist.md}"
ENCYCLOPEDIA_FILE="${ENCYCLOPEDIA_FILE:-$ROOT_DIR/CLI_ENCYCLOPEDIA.md}"

INVESTIGATION_DIR="$ROOT_DIR/investigation"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
RUN_ID="investigation-$TIMESTAMP"
RUN_DIR="$INVESTIGATION_DIR/$RUN_ID"

TOTAL_ITERATIONS="${TOTAL_ITERATIONS:-5}"
MAX_RETRIES="${MAX_RETRIES:-2}"

# CLI.js files to investigate
CLAUDE_CODE_CLI="$BUNDLES_DIR/ClaudeCodeCode/cli.js"
CLAUDE_AGENT_CLI="$BUNDLES_DIR/ClaudeAgentSDKCode/cli.js"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

#===============================================================================
# SETUP
#===============================================================================

mkdir -p "$RUN_DIR"
mkdir -p "$RUN_DIR/iterations"
mkdir -p "$RUN_DIR/cli-tests"
mkdir -p "$RUN_DIR/extractions"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  CLI.JS → TYPESCRIPT DEEP INVESTIGATION                            ║${NC}"
echo -e "${CYAN}║  5-Iteration Verification & Gap Analysis                           ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "📁 Run ID:         $RUN_ID"
echo "📂 Output:         $RUN_DIR"
echo "🔄 Iterations:     $TOTAL_ITERATIONS"
echo ""
echo "📦 Bundles:"
echo "   - ClaudeCode:   $CLAUDE_CODE_CLI"
echo "   - ClaudeAgent:  $CLAUDE_AGENT_CLI"
echo ""
echo "📂 TypeScript src: $SRC_DIR"
echo ""

#===============================================================================
# PRE-FLIGHT CHECKS
#===============================================================================

preflight_check() {
  local errors=0
  
  echo -e "${BLUE}Running pre-flight checks...${NC}"
  
  if [[ ! -d "$BUNDLES_DIR" ]]; then
    echo -e "${RED}❌ Bundles directory not found: $BUNDLES_DIR${NC}"
    errors=$((errors + 1))
  fi
  
  if [[ ! -f "$CLAUDE_CODE_CLI" ]]; then
    echo -e "${RED}❌ ClaudeCodeCode/cli.js not found${NC}"
    errors=$((errors + 1))
  else
    echo -e "${GREEN}✅ ClaudeCodeCode/cli.js found${NC}"
  fi
  
  if [[ ! -f "$CLAUDE_AGENT_CLI" ]]; then
    echo -e "${RED}❌ ClaudeAgentSDKCode/cli.js not found${NC}"
    errors=$((errors + 1))
  else
    echo -e "${GREEN}✅ ClaudeAgentSDKCode/cli.js found${NC}"
  fi
  
  if [[ ! -d "$SRC_DIR" ]]; then
    echo -e "${RED}❌ TypeScript source directory not found: $SRC_DIR${NC}"
    errors=$((errors + 1))
  else
    local ts_count
    ts_count=$(find "$SRC_DIR" -name "*.ts" 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ TypeScript source found ($ts_count .ts files)${NC}"
  fi
  
  if ! command -v bun >/dev/null 2>&1; then
    echo -e "${RED}❌ bun not found${NC}"
    errors=$((errors + 1))
  else
    echo -e "${GREEN}✅ bun available${NC}"
  fi
  
  if [[ $errors -gt 0 ]]; then
    echo ""
    echo -e "${RED}Pre-flight check failed with $errors errors${NC}"
    exit 1
  fi
  
  echo ""
}

#===============================================================================
# CLI EXTRACTION - Extract key patterns from original CLI.js
#===============================================================================

extract_cli_patterns() {
  echo -e "${BLUE}Extracting patterns from original CLI.js files...${NC}"
  
  local extract_dir="$RUN_DIR/extractions"
  
  # Extract tool-related patterns from ClaudeCodeCode
  if [[ -f "$CLAUDE_CODE_CLI" ]]; then
    echo "  Extracting from ClaudeCodeCode/cli.js..."
    
    # Tool definitions
    grep -oE 'name:\s*"[^"]+"|tool[A-Za-z]*:|registerTool|executeTool|toolCall|function_call' "$CLAUDE_CODE_CLI" 2>/dev/null | head -100 > "$extract_dir/claude-code-tools.txt" || true
    
    # Command patterns
    grep -oE 'command:\s*"[^"]+"|\.command\([^)]+\)|yargs\.[a-z]+' "$CLAUDE_CODE_CLI" 2>/dev/null | head -100 > "$extract_dir/claude-code-commands.txt" || true
    
    # API endpoints
    grep -oE 'https?://[^"'\'']+|/v1/[^"'\'']+|api\.[a-z]+' "$CLAUDE_CODE_CLI" 2>/dev/null | sort -u > "$extract_dir/claude-code-endpoints.txt" || true
    
    # Spawn/exec patterns (should be replaced)
    grep -oE 'spawn\(|exec\(|execSync\(|child_process|fork\(' "$CLAUDE_CODE_CLI" 2>/dev/null | sort | uniq -c > "$extract_dir/claude-code-subprocess.txt" || true
    
    # Permission patterns
    grep -oE 'permission|Permission|allow|deny|grant|PERMISSION' "$CLAUDE_CODE_CLI" 2>/dev/null | sort | uniq -c > "$extract_dir/claude-code-permissions.txt" || true
    
    # MCP patterns
    grep -oE 'mcp|MCP|modelContextProtocol|context_protocol' "$CLAUDE_CODE_CLI" 2>/dev/null | sort | uniq -c > "$extract_dir/claude-code-mcp.txt" || true
  fi
  
  # Extract from ClaudeAgentSDKCode
  if [[ -f "$CLAUDE_AGENT_CLI" ]]; then
    echo "  Extracting from ClaudeAgentSDKCode/cli.js..."
    
    grep -oE 'name:\s*"[^"]+"|tool[A-Za-z]*:|registerTool|executeTool|toolCall|function_call' "$CLAUDE_AGENT_CLI" 2>/dev/null | head -100 > "$extract_dir/claude-agent-tools.txt" || true
    grep -oE 'command:\s*"[^"]+"|\.command\([^)]+\)|yargs\.[a-z]+' "$CLAUDE_AGENT_CLI" 2>/dev/null | head -100 > "$extract_dir/claude-agent-commands.txt" || true
    grep -oE 'https?://[^"'\'']+|/v1/[^"'\'']+|api\.[a-z]+' "$CLAUDE_AGENT_CLI" 2>/dev/null | sort -u > "$extract_dir/claude-agent-endpoints.txt" || true
    grep -oE 'spawn\(|exec\(|execSync\(|child_process|fork\(' "$CLAUDE_AGENT_CLI" 2>/dev/null | sort | uniq -c > "$extract_dir/claude-agent-subprocess.txt" || true
  fi
  
  # Count what we found
  echo ""
  echo "  Extraction summary:"
  for f in "$extract_dir"/*.txt; do
    if [[ -f "$f" ]]; then
      local count
      count=$(wc -l < "$f")
      echo "    $(basename "$f"): $count patterns"
    fi
  done
  echo ""
}

#===============================================================================
# ACTUAL CLI EXECUTION TESTS
#===============================================================================

run_cli_tests() {
  echo -e "${BLUE}Running actual CLI execution tests...${NC}"
  
  local test_dir="$RUN_DIR/cli-tests"
  local test_results="$test_dir/results.md"
  
  {
    echo "# CLI Execution Test Results"
    echo ""
    echo "Timestamp: $(date)"
    echo ""
    echo "## Test Commands"
    echo ""
  } > "$test_results"
  
  # Define test commands
  local -a test_commands=(
    "bun run cli --help"
    "bun run cli --version"
    "bun run cli -p 'say hello'"
    "bun run cli --dangerously-skip-permissions -p 'echo test'"
    "bun run typecheck"
    "bun test"
  )
  
  for cmd in "${test_commands[@]}"; do
    echo "  Testing: $cmd"
    {
      echo "### \`$cmd\`"
      echo ""
      echo "\`\`\`"
    } >> "$test_results"
    
    local output
    local exit_code=0
    output=$(timeout 30 bash -c "$cmd" 2>&1) || exit_code=$?
    
    {
      echo "$output"
      echo "\`\`\`"
      echo ""
      if [[ $exit_code -eq 0 ]]; then
        echo "**Result:** ✅ PASS (exit code: $exit_code)"
      else
        echo "**Result:** ❌ FAIL (exit code: $exit_code)"
      fi
      echo ""
      echo "---"
      echo ""
    } >> "$test_results"
  done
  
  # Try to find and run any existing CLI test scripts
  if [[ -f "$ROOT_DIR/package.json" ]]; then
    local scripts
    scripts=$(grep -oE '"[^"]+"\s*:\s*"[^"]*(cli|test)[^"]*"' "$ROOT_DIR/package.json" 2>/dev/null || true)
    if [[ -n "$scripts" ]]; then
      {
        echo "## Package.json Scripts Found"
        echo ""
        echo "\`\`\`"
        echo "$scripts"
        echo "\`\`\`"
        echo ""
      } >> "$test_results"
    fi
  fi
  
  echo "  Results saved to: $test_results"
  echo ""
}

#===============================================================================
# CODEX RUNNER
#===============================================================================

run_codex() {
  local prompt_file="$1"
  local output_file="$2"
  mkdir -p "$(dirname "$output_file")"

  if command -v codex >/dev/null 2>&1; then
    script -q /dev/null bash -c "
      codex exec --dangerously-bypass-approvals-and-sandbox < \"$prompt_file\"
    " >"$output_file" 2>&1
  elif command -v claude >/dev/null 2>&1; then
    claude --dangerously-skip-permissions -p "$(cat "$prompt_file")" > "$output_file" 2>&1
  else
    echo "ERROR: Neither codex nor claude CLI found" > "$output_file"
    return 1
  fi
}

#===============================================================================
# ITERATION 1: Tool Calling Deep Dive
#===============================================================================

generate_iteration_1_prompt() {
  local prompt_file="$1"
  local extract_dir="$RUN_DIR/extractions"
  
  cat > "$prompt_file" << 'PROMPT_EOF'
==============================================
INVESTIGATION ITERATION 1: TOOL CALLING DEEP DIVE
==============================================

You are investigating whether the TypeScript implementation correctly covers
all tool calling functionality from the original CLI.js files.

MISSION: Find ALL gaps in tool calling implementation.

AUTHORITATIVE INPUTS:
PROMPT_EOF

  echo "- Original ClaudeCodeCode/cli.js: @$CLAUDE_CODE_CLI" >> "$prompt_file"
  echo "- Original ClaudeAgentSDKCode/cli.js: @$CLAUDE_AGENT_CLI" >> "$prompt_file"
  echo "- TypeScript source: @$SRC_DIR" >> "$prompt_file"
  
  if [[ -f "$ENCYCLOPEDIA_FILE" ]]; then
    echo "- Encyclopedia: @$ENCYCLOPEDIA_FILE" >> "$prompt_file"
  fi
  
  echo "" >> "$prompt_file"
  echo "EXTRACTED PATTERNS (from original CLI.js):" >> "$prompt_file"
  
  for f in "$extract_dir"/*tools*.txt "$extract_dir"/*commands*.txt; do
    if [[ -f "$f" ]]; then
      echo "- @$f" >> "$prompt_file"
    fi
  done

  cat >> "$prompt_file" << 'PROMPT_EOF'

INVESTIGATION TASKS:

1) TOOL REGISTRY ANALYSIS
   In the original CLI.js files, find:
   - How are tools registered?
   - What is the tool schema/interface?
   - What tools are built-in vs loaded dynamically?
   
   In the TypeScript src/, verify:
   - Is there a tool registry?
   - Does it match the original pattern?
   - Are all original tools present?

2) TOOL EXECUTION FLOW
   In the original CLI.js:
   - How is a tool invoked?
   - How are parameters validated?
   - How are results returned?
   - How is streaming handled?
   
   In TypeScript:
   - Is this flow replicated?
   - Are there any shortcuts taken?

3) SPECIFIC TOOL AUDIT
   Create a table:
   | Tool Name | In CLI.js? | In TypeScript? | Implementation Match? |
   
   Check for these common tools:
   - bash/shell execution
   - file read/write
   - web search
   - code execution
   - editor tools
   - git tools

4) RUN ACTUAL COMMANDS
   Execute these and report results:
   
   ```bash
   # List tool-related files
   find src/ -name "*tool*" -o -name "*Tool*"
   
   # Search for tool registration
   grep -r "registerTool\|toolRegistry\|addTool" src/
   
   # Search for tool execution
   grep -r "executeTool\|runTool\|invokeTool" src/
   
   # Check if bun run cli works with a tool
   bun run cli --help 2>&1 | head -50
   ```

5) CREATE GAP REPORT

Output file: investigation/iteration-1-tool-gaps.md

Format:
```markdown
# Iteration 1: Tool Calling Gap Analysis

## Executive Summary
[2-3 sentences]

## Tool Registry
### Original (CLI.js)
[How it works]

### TypeScript Implementation  
[How it works or "NOT FOUND"]

### Gap Assessment
[What's missing]

## Tool Inventory
| Tool | CLI.js | TypeScript | Status |
|------|--------|------------|--------|
| bash | ✅ | ❌ | MISSING |
| ... | | | |

## Tool Execution Flow
### Original Flow
[Step by step]

### TypeScript Flow
[Step by step or gaps]

## Command Test Results
[Output from bun run cli tests]

## Critical Gaps (Must Fix)
1. [gap]
2. [gap]

## Recommendations
[Ordered by priority]
```

OUTPUT CONTRACT:
- Create the gap report file
- Run ALL the bash commands specified
- Be thorough - this is investigation, not implementation
- End with "ITERATION 1 COMPLETE" and gap count

Begin now.
PROMPT_EOF
}

#===============================================================================
# ITERATION 2: Encyclopedia Verification
#===============================================================================

generate_iteration_2_prompt() {
  local prompt_file="$1"
  local prev_output="$RUN_DIR/iterations/iteration-1-output.md"
  
  cat > "$prompt_file" << 'PROMPT_EOF'
==============================================
INVESTIGATION ITERATION 2: ENCYCLOPEDIA VERIFICATION
==============================================

You are verifying that CLI_ENCYCLOPEDIA.md accurately describes the original
CLI.js files, and that the TypeScript implementation matches.

MISSION: Verify encyclopedia accuracy against actual code.

AUTHORITATIVE INPUTS:
PROMPT_EOF

  echo "- Original ClaudeCodeCode/cli.js: @$CLAUDE_CODE_CLI" >> "$prompt_file"
  echo "- Original ClaudeAgentSDKCode/cli.js: @$CLAUDE_AGENT_CLI" >> "$prompt_file"
  echo "- TypeScript source: @$SRC_DIR" >> "$prompt_file"
  
  if [[ -f "$ENCYCLOPEDIA_FILE" ]]; then
    echo "- Encyclopedia: @$ENCYCLOPEDIA_FILE" >> "$prompt_file"
  fi
  
  if [[ -f "$prev_output" ]]; then
    echo "- Previous iteration findings: @$prev_output" >> "$prompt_file"
  fi

  cat >> "$prompt_file" << 'PROMPT_EOF'

INVESTIGATION TASKS:

1) ENCYCLOPEDIA SECTION AUDIT
   For EACH major section in CLI_ENCYCLOPEDIA.md:
   - Find the corresponding code in CLI.js
   - Verify the description is accurate
   - Note any discrepancies
   
2) UNDOCUMENTED CODE SEARCH
   Search CLI.js files for functionality NOT in the encyclopedia:
   
   ```bash
   # Find exported functions
   grep -oE 'exports\.[a-zA-Z]+|module\.exports' bundles/ClaudeCodeCode/cli.js | head -50
   
   # Find class definitions
   grep -oE 'class [A-Z][a-zA-Z]+' bundles/ClaudeCodeCode/cli.js | sort -u
   
   # Find major function patterns
   grep -oE 'function [a-zA-Z]+|async function [a-zA-Z]+|[a-zA-Z]+\s*=\s*async' bundles/ClaudeCodeCode/cli.js | head -50
   ```

3) TYPESCRIPT COVERAGE CHECK
   For each encyclopedia entry:
   - Is there corresponding TypeScript code?
   - Does the TypeScript match the encyclopedia description?
   
4) VERSION DISCREPANCY CHECK
   The encyclopedia mentions:
   - ClaudeAgentSDKCode/cli.js (2.0.67)
   - ClaudeCodeCode/cli.js (2.0.69)
   
   Verify:
   ```bash
   # Check for version strings in bundles
   grep -oE 'version["\s:]+[0-9]+\.[0-9]+\.[0-9]+' bundles/*/cli.js
   
   # Check TypeScript version
   grep -r "version" src/ --include="*.ts" | grep -v node_modules | head -20
   ```

5) CREATE VERIFICATION REPORT

Output file: investigation/iteration-2-encyclopedia-verification.md

Format:
```markdown
# Iteration 2: Encyclopedia Verification

## Section-by-Section Audit

### [Section Name from Encyclopedia]
- Encyclopedia says: [summary]
- CLI.js actually: [what code shows]
- TypeScript has: [what's implemented]
- Accuracy: ✅ ACCURATE / ⚠️ PARTIAL / ❌ INACCURATE

[Repeat for each section]

## Undocumented Functionality Found
| Function/Class | In CLI.js | In Encyclopedia | In TypeScript |
|----------------|-----------|-----------------|---------------|
| | | | |

## Version Check
- Encyclopedia versions: 2.0.67, 2.0.69
- Actual bundle versions: [found]
- TypeScript version: [found or N/A]

## Encyclopedia Corrections Needed
1. [correction]
2. [correction]

## Missing TypeScript Coverage
1. [missing item]
2. [missing item]
```

Begin now.
PROMPT_EOF
}

#===============================================================================
# ITERATION 3: CLI Command Parity
#===============================================================================

generate_iteration_3_prompt() {
  local prompt_file="$1"
  local test_results="$RUN_DIR/cli-tests/results.md"
  
  cat > "$prompt_file" << 'PROMPT_EOF'
==============================================
INVESTIGATION ITERATION 3: CLI COMMAND PARITY
==============================================

You are verifying that ALL CLI commands from the original work in TypeScript.

MISSION: Test every CLI command and flag.

AUTHORITATIVE INPUTS:
PROMPT_EOF

  echo "- Original ClaudeCodeCode/cli.js: @$CLAUDE_CODE_CLI" >> "$prompt_file"
  echo "- TypeScript source: @$SRC_DIR" >> "$prompt_file"
  
  if [[ -f "$test_results" ]]; then
    echo "- Previous CLI test results: @$test_results" >> "$prompt_file"
  fi

  cat >> "$prompt_file" << 'PROMPT_EOF'

INVESTIGATION TASKS:

1) EXTRACT ALL CLI COMMANDS FROM ORIGINAL
   ```bash
   # Find yargs command definitions
   grep -oE '\.command\([^)]+\)' bundles/ClaudeCodeCode/cli.js | head -30
   
   # Find option definitions  
   grep -oE '\.option\([^)]+\)|--[a-z-]+' bundles/ClaudeCodeCode/cli.js | sort -u | head -50
   
   # Find alias definitions
   grep -oE '\.alias\([^)]+\)|alias:\s*["\'][^"'\'']+' bundles/ClaudeCodeCode/cli.js | head -20
   ```

2) TEST EACH COMMAND IN TYPESCRIPT
   For each command found, run:
   ```bash
   bun run cli [command] --help
   ```
   
   Test these specific commands:
   ```bash
   bun run cli --help
   bun run cli --version
   bun run cli -p "test prompt"
   bun run cli --dangerously-skip-permissions -p "test"
   bun run cli chat --help 2>&1 || echo "chat command not found"
   bun run cli run --help 2>&1 || echo "run command not found"
   bun run cli config --help 2>&1 || echo "config command not found"
   ```

3) FLAG COMPARISON
   Create a comprehensive flag comparison:
   
   | Flag | Original CLI.js | TypeScript CLI | Works? |
   |------|-----------------|----------------|--------|
   | --help | ✅ | ? | ? |
   | --version | ✅ | ? | ? |
   | -p/--prompt | ✅ | ? | ? |
   | --dangerously-skip-permissions | ✅ | ? | ? |
   | ... | | | |

4) INTERACTIVE MODE TEST
   ```bash
   # Test if interactive mode starts
   echo "exit" | timeout 5 bun run cli 2>&1 || echo "Interactive mode test"
   ```

5) CREATE PARITY REPORT

Output file: investigation/iteration-3-cli-parity.md

Format:
```markdown
# Iteration 3: CLI Command Parity

## Commands Found in Original
[List all commands]

## Command Test Results
| Command | Original | TypeScript | Test Output |
|---------|----------|------------|-------------|
| | | | |

## Flag Parity
| Flag | Original | TypeScript | Status |
|------|----------|------------|--------|
| | | | |

## Missing Commands
1. [command]

## Missing Flags
1. [flag]

## Broken Commands
1. [command]: [error]

## Working Commands
1. [command]: ✅
```

Begin now.
PROMPT_EOF
}

#===============================================================================
# ITERATION 4: Subprocess Pattern Migration
#===============================================================================

generate_iteration_4_prompt() {
  local prompt_file="$1"
  local extract_dir="$RUN_DIR/extractions"
  
  cat > "$prompt_file" << 'PROMPT_EOF'
==============================================
INVESTIGATION ITERATION 4: SUBPROCESS PATTERN MIGRATION
==============================================

The rewrite should eliminate subprocess-centric patterns.
You are verifying this migration is complete.

MISSION: Find any remaining subprocess patterns that should be async.

AUTHORITATIVE INPUTS:
PROMPT_EOF

  echo "- Original ClaudeCodeCode/cli.js: @$CLAUDE_CODE_CLI" >> "$prompt_file"
  echo "- TypeScript source: @$SRC_DIR" >> "$prompt_file"
  
  if [[ -f "$extract_dir/claude-code-subprocess.txt" ]]; then
    echo "- Subprocess patterns found: @$extract_dir/claude-code-subprocess.txt" >> "$prompt_file"
  fi

  cat >> "$prompt_file" << 'PROMPT_EOF'

INVESTIGATION TASKS:

1) CATALOG ORIGINAL SUBPROCESS USAGE
   ```bash
   # Count spawn/exec in original
   grep -c 'spawn\|exec\|fork\|child_process' bundles/ClaudeCodeCode/cli.js || echo "0"
   
   # Find specific patterns
   grep -n 'spawn\|exec\|fork' bundles/ClaudeCodeCode/cli.js | head -30
   ```

2) CHECK TYPESCRIPT FOR SUBPROCESS
   ```bash
   # Should be minimal or zero
   grep -rn 'spawn\|exec\|fork\|child_process' src/ --include="*.ts" || echo "None found"
   
   # Check for proper async patterns instead
   grep -rn 'async\|await\|Promise' src/ --include="*.ts" | wc -l
   ```

3) IDENTIFY WHAT SUBPROCESSES WERE USED FOR
   In original CLI.js, subprocesses are used for:
   - Shell command execution
   - Git operations
   - Editor launching
   - Hook execution
   - Background tasks
   
   For each, determine:
   - Was it migrated to async?
   - Is there a platform abstraction?
   - Does it work on non-Node platforms?

4) PLATFORM CAPABILITY CHECK
   ```bash
   # Look for capability abstraction
   grep -rn 'capability\|Capability\|platform\|Platform' src/ --include="*.ts" | head -20
   
   # Look for shell abstraction
   grep -rn 'ShellExecutor\|shell\|Shell' src/ --include="*.ts" | head -20
   ```

5) CREATE MIGRATION REPORT

Output file: investigation/iteration-4-subprocess-migration.md

Format:
```markdown
# Iteration 4: Subprocess Pattern Migration

## Original Subprocess Usage
| Pattern | Count | Purpose |
|---------|-------|---------|
| spawn() | X | shell commands |
| exec() | X | ... |
| fork() | X | ... |

## TypeScript Subprocess Usage
| Pattern | Count | Location | Justified? |
|---------|-------|----------|------------|
| | | | |

## Migration Status by Feature
| Feature | Original Method | New Method | Status |
|---------|-----------------|------------|--------|
| Shell commands | spawn() | ? | |
| Git operations | exec() | ? | |
| Hooks | fork() | ? | |

## Platform Abstraction
- Capability layer: [found/not found]
- Shell abstraction: [found/not found]
- Works on React Native: [yes/no/unknown]

## Remaining Issues
1. [issue]
```

Begin now.
PROMPT_EOF
}

#===============================================================================
# ITERATION 5: Comprehensive Gap Summary & Remediation Script
#===============================================================================

generate_iteration_5_prompt() {
  local prompt_file="$1"
  
  cat > "$prompt_file" << 'PROMPT_EOF'
==============================================
INVESTIGATION ITERATION 5: COMPREHENSIVE SUMMARY & REMEDIATION
==============================================

This is the FINAL iteration. Synthesize all findings and create a remediation script.

MISSION: Create actionable remediation plan and script.

PREVIOUS ITERATION OUTPUTS:
PROMPT_EOF

  for i in 1 2 3 4; do
    local prev="$RUN_DIR/iterations/iteration-$i-output.md"
    if [[ -f "$prev" ]]; then
      echo "- Iteration $i output: @$prev" >> "$prompt_file"
    fi
  done
  
  echo "" >> "$prompt_file"
  echo "INVESTIGATION FILES:" >> "$prompt_file"
  
  for f in "$INVESTIGATION_DIR"/*.md; do
    if [[ -f "$f" ]]; then
      echo "- @$f" >> "$prompt_file"
    fi
  done

  cat >> "$prompt_file" << 'PROMPT_EOF'

FINAL TASKS:

1) SYNTHESIZE ALL FINDINGS
   Review all previous iteration outputs and create a unified view of:
   - All tool calling gaps
   - All encyclopedia inaccuracies  
   - All CLI command gaps
   - All subprocess migration issues

2) PRIORITIZE GAPS
   Categorize all gaps by:
   - P0: Critical - breaks core functionality
   - P1: High - missing major feature
   - P2: Medium - missing minor feature
   - P3: Low - nice to have

3) CREATE COMPREHENSIVE SUMMARY

Output file: investigation/FINAL-gap-summary.md

Format:
```markdown
# FINAL Gap Summary

## Executive Summary
[Overall state of the implementation]

## Gap Statistics
- Total gaps found: X
- P0 Critical: X
- P1 High: X
- P2 Medium: X
- P3 Low: X

## All Gaps by Category

### Tool Calling Gaps
| ID | Gap | Priority | Effort |
|----|-----|----------|--------|
| T1 | ... | P0 | High |

### CLI Command Gaps
| ID | Gap | Priority | Effort |
|----|-----|----------|--------|
| C1 | ... | P1 | Medium |

### Encyclopedia Issues
| ID | Issue | Type |
|----|-------|------|
| E1 | ... | Inaccuracy |

### Subprocess Issues
| ID | Issue | Priority |
|----|-------|----------|
| S1 | ... | P1 |

## Recommended Fix Order
1. [First thing to fix]
2. [Second thing to fix]
...
```

4) CREATE REMEDIATION SHELL SCRIPT

Output file: investigation/remediate-gaps.sh

This script should:
- Be executable
- Have clear phases for each gap category
- Include validation after each fix
- Include the EXACT prompts to give to the agent

Format:
```bash
#!/usr/bin/env bash
set -euo pipefail

# REMEDIATION SCRIPT
# Generated from investigation run: [RUN_ID]
# 
# This script addresses all gaps found in the CLI.js → TypeScript migration.

export PATH="$HOME/.bun/bin:$PATH"

ROOT_DIR="$(pwd)"
PLAN_FILE="$ROOT_DIR/implementation/1-initial-rewrite-implementation-checklist.md"

#===============================================================================
# PHASE 1: CRITICAL TOOL CALLING FIXES
#===============================================================================

echo "Phase 1: Fixing critical tool calling gaps..."

# [Include specific codex prompts to fix each gap]

run_codex_fix() {
  local fix_id="$1"
  local prompt="$2"
  
  echo "Fixing: $fix_id"
  # ... codex invocation
}

# Fix T1: [description]
# Fix T2: [description]
# etc.

#===============================================================================
# PHASE 2: CLI COMMAND FIXES  
#===============================================================================

echo "Phase 2: Fixing CLI command gaps..."

# [Include specific fixes]

#===============================================================================
# PHASE 3: VALIDATION
#===============================================================================

echo "Phase 3: Validating fixes..."

bun test
bun run typecheck
bun run cli --help
bun run cli -p "test prompt"

echo "Remediation complete."
```

5) CREATE UPDATED IMPLEMENTATION PLAN ITEMS

Output file: investigation/additional-plan-items.md

List NEW checklist items that should be added to the implementation plan
to address the discovered gaps.

OUTPUT CONTRACT:
- Create FINAL-gap-summary.md
- Create remediate-gaps.sh (must be executable with chmod +x)
- Create additional-plan-items.md
- Print final statistics
- End with "INVESTIGATION COMPLETE - REMEDIATION SCRIPT READY"

Begin now.
PROMPT_EOF
}

#===============================================================================
# RUN INVESTIGATION ITERATION
#===============================================================================

run_iteration() {
  local iteration="$1"
  
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${MAGENTA}  INVESTIGATION ITERATION $iteration of $TOTAL_ITERATIONS${NC}"
  echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  local prompt_file="$RUN_DIR/iterations/iteration-$iteration-prompt.txt"
  local output_file="$RUN_DIR/iterations/iteration-$iteration-output.md"
  
  # Generate appropriate prompt
  case $iteration in
    1) generate_iteration_1_prompt "$prompt_file" ;;
    2) generate_iteration_2_prompt "$prompt_file" ;;
    3) generate_iteration_3_prompt "$prompt_file" ;;
    4) generate_iteration_4_prompt "$prompt_file" ;;
    5) generate_iteration_5_prompt "$prompt_file" ;;
    *)
      echo -e "${RED}Unknown iteration: $iteration${NC}"
      return 1
      ;;
  esac
  
  echo "📝 Prompt: $prompt_file"
  echo "🚀 Running investigation..."
  echo ""
  
  local attempt=1
  while [[ $attempt -le $MAX_RETRIES ]]; do
    if run_codex "$prompt_file" "$output_file"; then
      echo ""
      echo -e "${GREEN}✅ Iteration $iteration complete${NC}"
      echo "📄 Output: $output_file"
      
      # Show summary
      echo ""
      echo "--- Output tail ---"
      tail -15 "$output_file"
      echo "-------------------"
      return 0
    else
      echo -e "${YELLOW}⚠️  Attempt $attempt failed, retrying...${NC}"
      attempt=$((attempt + 1))
    fi
  done
  
  echo -e "${RED}❌ Iteration $iteration failed after $MAX_RETRIES attempts${NC}"
  return 1
}

#===============================================================================
# MAIN EXECUTION
#===============================================================================

main() {
  preflight_check
  extract_cli_patterns
  run_cli_tests
  
  echo ""
  echo -e "${CYAN}Starting $TOTAL_ITERATIONS investigation iterations...${NC}"
  echo ""
  
  for ((i = 1; i <= TOTAL_ITERATIONS; i++)); do
    run_iteration "$i"
    echo ""
    
    if [[ $i -lt $TOTAL_ITERATIONS ]]; then
      echo -e "${YELLOW}Continuing to iteration $((i + 1))...${NC}"
      echo ""
      sleep 2
    fi
  done
  
  # Copy investigation files to main investigation directory
  cp "$RUN_DIR"/iterations/*.md "$INVESTIGATION_DIR/" 2>/dev/null || true
  
  echo ""
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  INVESTIGATION COMPLETE                                            ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "📁 All artifacts in: $RUN_DIR"
  echo ""
  echo "📄 Key outputs:"
  echo "   - investigation/FINAL-gap-summary.md"
  echo "   - investigation/remediate-gaps.sh"
  echo "   - investigation/additional-plan-items.md"
  echo ""
  echo "🔧 Next steps:"
  echo "   1. Review FINAL-gap-summary.md"
  echo "   2. Run: chmod +x investigation/remediate-gaps.sh"
  echo "   3. Run: ./investigation/remediate-gaps.sh"
  echo ""
  
  # Make remediation script executable if it exists
  if [[ -f "$INVESTIGATION_DIR/remediate-gaps.sh" ]]; then
    chmod +x "$INVESTIGATION_DIR/remediate-gaps.sh"
    echo -e "${GREEN}✅ Remediation script is ready to run${NC}"
  fi
}

main "$@"