# Reconstructing Conversations from `.jsonl`

This document describes how to rebuild a coherent transcript (and tool timeline) from `.jsonl` records.

## 1) Choose the scope: session file vs sidechain file

Within a project folder:
- `<uuid>.jsonl` files are typically **primary sessions** (`"isSidechain": false`)
- `agent-<agentId>.jsonl` files are typically **sidechains** (`"isSidechain": true`)

If you want “what the user saw” for a session:
- Start with a session file.
- Then optionally stitch in sidechains referenced by tool outputs (e.g. `Task` results) if desired.

## 2) Parse as JSON Lines (with care)

Implementation notes:
- Some files do not end with a newline; use `splitlines()` rather than `read().split('\n')`.
- Some files may be empty or contain invalid lines; skip gracefully.

## 3) Establish ordering

There are two useful orderings:

### A) File order

Records are generally appended chronologically, so file order is often “good enough”.

### B) Parent-linked order (`uuid` / `parentUuid`)

For a more robust reconstruction:
1. Build an index `byUuid[uuid] = record`.
2. Identify the “head” record(s): records where `parentUuid` is `null` or missing.
3. Walk forward by following child links (or, if you only have back-links, sort using the chain).

Notes:
- Many sessions behave like a simple linked list.
- Some record types (e.g. `file-history-snapshot`) do not participate in the `uuid` chain.

## 4) Group assistant streaming chunks into turns (`requestId`)

Assistant output for a single model request can be split across multiple `"assistant"` records.

Heuristic:
- Group consecutive `"assistant"` records that share the same top-level `"requestId"`.

Typical pattern:
- Several assistant chunks with `message.stop_reason: null`
- Final chunk with `message.stop_reason: "end_turn"` or `"tool_use"`

## 5) Tool calls: connect `tool_use` ↔ `tool_result`

To build an accurate tool timeline:
1. When reading assistant records, collect every `tool_use` block:
   - key: `tool_use.id`
   - value: `(tool name, tool input, originating assistant record uuid)`
2. When reading user records, locate `tool_result` blocks and join by `tool_use_id`.
3. Attach the top-level `toolUseResult` if present for structured fields.

This yields:
- Tool call start: assistant requests it
- Tool call finish: user returns result

## 6) Sidechains and subagents (`isSidechain`, `agentId`)

Sidechain records typically include:
- `isSidechain: true`
- `agentId: "…"`, matching the `agent-<agentId>.jsonl` filename

Two common ways to stitch sidechains into a session:

### A) Keep them separate

Present the main session transcript without sidechains; treat sidechains as “drill down” logs.

### B) Inline sidechain segments

If you have a `Task` or similar tool output in the main session that references an `agentId`, you can:
- Load `agent-<agentId>.jsonl`
- Reconstruct it as its own transcript
- Inline it under the corresponding tool call

## 7) Compaction boundaries and continuation summaries

When context is compacted, you may see:

### A) A system boundary record

`type: "system"`, `subtype: "compact_boundary"` with:
- `content: "Conversation compacted"`
- `compactMetadata` (e.g. token count)
- `logicalParentUuid` (links the logical conversation chain)

### B) A user “compact summary” message

`type: "user"` with:
- `isCompactSummary: true`
- `isVisibleInTranscriptOnly: true`
- `message.content` as a long string summary of the prior conversation

Interpretation:
- The “summary message” is injected so the new session can continue with compressed context.

## 8) Summaries (`type: "summary"`)

Summary records provide titles/labels and include `leafUuid`.

Use-cases:
- UI labels
- Quick indexing/search
- Annotating “conversation leaf” states

## 9) File-history snapshots

`type: "file-history-snapshot"` records do not usually participate in the message chain, but they can be used to:
- Track which files were “tracked” at points in time
- Correlate to message/tool activity by nearby position in file order

## 10) Resume/continue and forks

The CLI (`Resources/ClaudeCodeSource/cli.js`) implements:
- `--continue`: loads the most recent session for the current project
- `--resume`: loads by session ID, or opens an interactive picker
- `--fork-session`: loads history but writes to a new session ID

These features are implemented by loading historical messages from `~/.claude/projects/<projectKey>/...` and then either:
- continuing to append to the same `<sessionId>.jsonl`, or
- switching to a new session ID (fork) and writing a new JSONL file

See `Resources/ClaudeProjects/Resume-and-Continue.md`.

## Suggested reconstruction output model

If you’re building documentation or a parser, a useful normalized model is:
- `Session`
  - `sessionId`
  - `projectKey`
  - `events[]` (ordered)
    - `UserTurn` (text/image)
    - `AssistantTurn` (grouped by requestId)
    - `ToolCall` (tool_use + tool_result + toolUseResult)
    - `SystemEvent` (compaction, errors, commands)
    - `Summary` (title/leafUuid)
    - `FileHistorySnapshot`
