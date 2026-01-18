# Iteration 1: Tool Calling Gap Analysis

## Executive Summary
The bundled upstream `cli.js` implements a full end-to-end tool-calling loop (tool registry → schema serialization → streamed `tool_use` parsing → permission gating + hooks → tool execution → `tool_result` back to the model). The TypeScript rewrite contains partial *infrastructure* (tool runner, MCP tool wrappers, hook pipeline, permission gate), but it does not currently wire tools into the model request/response flow, and it is missing most first-party tools.

## Tool Registry

### Original (CLI.js)
**Where it lives**
- Built-in tool registry is composed by `m81()` (2.0.69 / `ClaudeCodeCode/cli.js`) and filtered for the model via `UH(toolPermissionContext)`.
- 2.0.67 / `ClaudeAgentSDKCode/cli.js` has the same concept but different symbol names (e.g. `StructuredOutput` constant is `PC` vs `wC`).

**How tools are represented**
- Tools are objects with (at minimum) `name`, `prompt()`, `description()`, `inputSchema`, `outputSchema`, `call()`, `checkPermissions()`, and UI render helpers.
- Schemas are Zod-based (`P.object(...)`, `.parse(...)`); tools are serialized for the model via `ZB1(tool, ...)`, which emits `{ name, description, input_schema, strict?, input_examples?, defer_loading? }`.
- There is explicit per-tool input normalization before execution (e.g. Bash `cd <cwd> &&` stripping, timeout shaping for TaskOutput, etc.) via `$02(toolDef, rawInput, agentId)` plus reverse mapping via `w02(...)`.

**Built-in vs dynamically loaded**
- Built-in, always-present tools (confirmed by string constants in `ClaudeCodeCode/cli.js`):
  - `Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`, `WebFetch`, `WebSearch`
  - `Task` (sub-agent tool), `TaskOutput`, `KillShell`
  - `TodoWrite`, `NotebookEdit`, `AskUserQuestion`
  - `ExitPlanMode`
  - `Skill` (used to invoke custom “skills”/slash-command prompt expansions)
  - `StructuredOutput` (special “validated JSON” output tool; excluded from default `UH()` list and used only when requested)
  - `LSP` (optional, gated by `ENABLE_LSP_TOOL`)
- Dynamically loaded tools:
  - MCP tools: namespaced as `mcp__<server>__<tool>` and surfaced from connected MCP servers; also includes first-party MCP helpers `ListMcpResourcesTool` and `ReadMcpResourceTool`.
  - Plugins/skills: not “tools” directly, but they expand command/skill inventories; the `Skill` tool is the executor.

### TypeScript Implementation
**Where it lives**
- Tool infrastructure exists under `src/core/tools/*`:
  - `ToolRegistry` (`src/core/tools/registry.ts`) supports `registerBuiltin()` and `registerMcp()`.
  - `ToolRunner` (`src/core/tools/runner.ts`) runs tools with input/output schema validation and streaming.
  - Hook bridge `createToolPipelineHooks` (`src/core/hooks/toolPipeline.ts`) implements `PreToolUse`/`PostToolUse`/`PostToolUseFailure`.
  - MCP tool wrappers exist (`src/core/mcp/tools.ts`) and create `mcp__<server>__<tool>` tool definitions.
- Actual registration is effectively absent for the main CLI:
  - Only `--ripgrep` registers a tool (`registry.registerBuiltin(searchGrepTool)` in `src/cli/ripgrep.ts`).
  - No “built-in tools list composition” exists analogous to `m81()`/`UH()`.

**How tools are represented**
- Tools are typed as `ToolDefinition<Input, Output>` (`src/core/tools/types.ts`) with `inputSchema.parse(...)` / `outputSchema.parse(...)`.
- Unlike upstream, there is no Zod schema-to-JSON-schema generation for built-in tools; only MCP tools may carry `jsonSchema` (from server tool descriptors).

### Gap Assessment
- No global tool registry composition in TS (no equivalent to upstream `m81()` + `UH()`), and no wiring that sends a tool list to the model.
- The TS tool set is tiny (only `search.grep` + `patch.apply` built-ins), and their names/schemas do not match upstream first-party tool names/schemas.
- Dynamic MCP tool *definitions* exist, but there is no end-to-end “model sees MCP tools → emits tool_use → TS executes → returns tool_result” path.

## Tool Inventory

Legend: ✅ present, ❌ missing, ⚠️ partial/mismatch

| Tool | CLI.js | TypeScript | Status |
|------|--------|------------|--------|
| `Bash` | ✅ | ❌ | MISSING (no shell tool in TS) |
| `Read` | ✅ | ❌ | MISSING (no file-read tool) |
| `Write` | ✅ | ❌ | MISSING (no file-write tool) |
| `Edit` | ✅ | ❌ | MISSING (no text editor tool; `patch.apply` is different) |
| `Glob` | ✅ | ❌ | MISSING |
| `Grep` | ✅ | ⚠️ | PARTIAL: TS has `search.grep` but different name/schema + not model-integrated |
| `WebSearch` | ✅ | ❌ | MISSING |
| `WebFetch` | ✅ | ❌ | MISSING |
| `Task` (subagent) | ✅ | ❌ | MISSING |
| `TaskOutput` | ✅ | ❌ | MISSING |
| `KillShell` | ✅ | ❌ | MISSING |
| `TodoWrite` | ✅ | ❌ | MISSING |
| `NotebookEdit` | ✅ | ❌ | MISSING |
| `AskUserQuestion` | ✅ | ❌ | MISSING |
| `ExitPlanMode` | ✅ | ❌ | MISSING |
| `Skill` | ✅ | ❌ | MISSING |
| `StructuredOutput` | ✅ | ❌ | MISSING |
| `LSP` (gated) | ✅ | ❌ | MISSING |
| `ListMcpResourcesTool` | ✅ | ❌ | MISSING as a tool (TS has MCP client ops, but not as ToolDefinition) |
| `ReadMcpResourceTool` | ✅ | ❌ | MISSING as a tool (TS has MCP client ops, but not as ToolDefinition) |
| `mcp` | ✅ | ❌ | MISSING as a tool (upstream uses it as an MCP tool execution wrapper) |
| `mcp__<server>__<tool>` | ✅ | ⚠️ | PARTIAL: TS can build ToolDefinitions, but not connected to model tool calls |
| `search.grep` | ❌ | ✅ | TS-only tool (portable grep) |
| `patch.apply` | ❌ | ✅ | TS-only tool (edit-set patch applier) |

Common tool categories audit:
- bash/shell execution: upstream ✅ (`Bash`) vs TS ❌
- file read/write/edit: upstream ✅ (`Read`/`Write`/`Edit`) vs TS ❌
- web search/fetch: upstream ✅ (`WebSearch`/`WebFetch`) vs TS ❌
- code execution: upstream ✅ (via `Bash`) vs TS ❌
- editor tools: upstream ✅ (`Edit`, `NotebookEdit`) vs TS ❌
- git tools: upstream “via Bash” ✅ vs TS ❌

## Tool Execution Flow

### Original Flow
1. Build tool list for the model:
   - Build registry (`m81()`), filter by permissions + enabled flags (`UH(toolPermissionContext)`), then add MCP tools and other dynamic sources.
2. Send model request with `tools` payload (tool schemas serialized by `ZB1`).
3. Stream model response:
   - Streaming parser tracks `content_block_start`/`input_json_delta` for `tool_use` blocks (e.g. `f0A(...)`).
4. Normalize + validate tool input:
   - Tool inputs may arrive as JSON strings; they are parsed and normalized per tool (e.g. `$02(...)` handles Bash command rewrite, TaskOutput key aliases, file edit/write shaping).
   - Validation uses Zod: `tool.inputSchema.parse(...)`; failures become user-visible tool-use errors.
5. Permission gate + hooks:
   - Tool permission decision uses global permission rules plus tool-specific checks; hooks run `PreToolUse` / `PostToolUse` / `PostToolUseFailure`.
6. Execute tool and stream progress:
   - Tool `call()` runs; output can be streamed/progressed and then mapped to `tool_result` blocks via `mapToolResultToToolResultBlockParam(...)`.
7. Feed `tool_result` back into the conversation and continue until the model produces a final assistant response.

### TypeScript Flow
1. A tool can be run if *someone* constructs a `ToolRegistry`, registers tools, and calls `ToolRunner.run(...)`.
2. Input/output validation happens via `ToolSchema.parse(...)` in `ToolRunner` and streaming output is emitted via `ToolStream`.
3. Hook integration exists (`createToolPipelineHooks`) and matches upstream hook event names conceptually.

**Missing end-to-end replication**
- No Anthropic streaming “tool_use” parsing in TS (no `input_json_delta` assembly, no `tool_use`/`tool_result` message loop).
- `runNonInteractivePrompt` (`src/cli/prompt.ts`) does not pass any `tools` to the model; it extracts only text blocks.
- Interactive engine (`src/core/engine/*`) does not call models at all yet, so tool calling cannot occur.

## Command Test Results

### `find src/ -name "*tool*" -o -name "*Tool*"`
```bash
src/core/tools
src/core/mcp/tools.ts
src/core/hooks/toolPipeline.ts
src/core/migration/toolMapping.ts
```

### `grep -r "registerTool\|toolRegistry\|addTool" src/`
```bash
# (no matches)
```

### `grep -r "executeTool\|runTool\|invokeTool" src/`
```bash
# (no matches)
```

### `bun run cli --help 2>&1 | head -50`
```bash
$ bun src/cli.ts --help
claude-ts 0.1.0

Usage: claude-ts [options]

Options:
  --version, -v, -V     Print version and exit
  --help                Show help
  --mcp-cli ...         MCP CLI (gated by ENABLE_EXPERIMENTAL_MCP_CLI=1)
  --ripgrep ...         Minimal grep/search mode (portable replacement)
  doctor                Print a portable diagnostics report
  engine-only           Run core diagnostics (no model calls)
  --print-frame         Print one UI frame and exit
  -p, --prompt <text>   Send one prompt, print model output, and exit

Interactive:
  ctrl+o toggles transcript view
  ctrl+e toggles full transcript (in transcript view)

Notes:
  `-p` uses Claude Code credentials (Keychain) or ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN.
  This is a TS-first rewrite; many legacy CLI commands are not yet implemented.
```

## Critical Gaps (Must Fix)
1. No TS “main loop” that supports streamed tool calling: parse `tool_use` blocks, execute, and send `tool_result` back to the model.
2. No TS built-in tool registry equivalent to upstream `m81()` + `UH()`; tools are not assembled per-session or filtered by permissions/settings.
3. Missing core first-party tools (Bash/Read/Write/Edit/Glob/Grep/WebSearch/WebFetch/Task/TaskOutput/etc.).
4. Missing tool schema export to the model (upstream emits JSON-schema-like `input_schema` for each tool; TS built-ins do not produce JSON schema today).
5. Missing upstream normalization behaviors (`$02`/`w02`): Bash command rewriting, TaskOutput alias handling, file write content normalization, etc.
6. Missing permission + UI prompting integration for tool invocations (TS has a permission gate, but it is not invoked from any model/tool loop).
7. Missing StructuredOutput tool flow (validated JSON final output + retry loop).
8. Missing Skill tool / plugin/skills executor path (upstream uses it to run user-defined skills/commands under tool calling).
9. MCP tool integration is partial: TS can call MCP tools, but only via MCP CLI; tool calling from the model is not implemented.
10. Optional LSP tool parity is missing (upstream `ENABLE_LSP_TOOL`).

## Recommendations
1. Implement the end-to-end message loop for tool calling (model request includes tools; streamed response parsed for `tool_use`; tool runner executes; `tool_result` appended; repeat).
2. Port the upstream tool registry composition into TS (`tools/index.ts` + per-session filtering akin to `UH()`).
3. Add first-party tool implementations in TS, matching upstream names and input/output schemas.
4. Add a tool-schema-to-JSON-schema layer for TS built-ins (or migrate to Zod) so the model receives correct `input_schema`.
5. Port upstream input normalization equivalents for Bash/Edit/Write/TaskOutput and ensure output mapping matches `tool_result` expectations.
6. Wire permission gating + hook pipeline into the tool execution loop, including “remember” persistence.
7. Add StructuredOutput support (special tool handling + retry loop) and Skill tool support (skills inventory + invocation).
