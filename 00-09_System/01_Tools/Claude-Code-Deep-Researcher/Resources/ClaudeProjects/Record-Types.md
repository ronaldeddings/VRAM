# Record Types (Top-Level `"type"`)

Each `.jsonl` file is a sequence of JSON objects (one object per line). Each object is a **record** with a top-level `"type"` field.

Observed top-level record types in `~/.claude/projects/**/*.jsonl` (from the corpus scan summarized in `Resources/ClaudeProjects/Appendix-Observed-Frequencies.md`):

**Common transcript/storage record types**
- `"user"`
- `"assistant"`
- `"system"`

Additional values supported by `cli.js` parsers (may or may not appear in your local logs):
- `"attachment"`

**Indexing/metadata record types**
- `"summary"`
Additional values supported by `cli.js` (not observed in the scanned corpus, but indexed if present):
- `"custom-title"` (used for naming sessions)
- `"tag"` (used for labeling sessions)

**File/tool bookkeeping record types**
- `"file-history-snapshot"`
- `"queue-operation"`

This document describes:
- The role of each record type
- Common and optional keys
- The most common **key combinations** (schema variants)

## Typical sequences (“how it’s built” at runtime)

Although the log is not formally documented, the records commonly appear as an append-only trace of events during an interactive session.

### Typical session file prefix

Many session files begin with a `file-history-snapshot` record, followed by the first user/assistant records.

### Typical user ↔ assistant turn

A common pattern in session logs:
1. `user` (human prompt) — text or rich blocks
2. `assistant` (assistant reply) — often streamed across multiple `assistant` records sharing the same `requestId`

### Typical tool call cycle

Tool use is recorded using Anthropic’s tool-calling shape:
1. `assistant` record contains `message.content` with one or more `tool_use` blocks
2. A subsequent `user` record contains `message.content` with corresponding `tool_result` blocks
3. That same `user` tool-result record often includes top-level `toolUseResult` with structured output
4. Another `assistant` record continues the conversation after tool completion

### System events interleaving

`system` records can be injected between turns, for example:
- Compaction boundary records when context is compacted
- Local command executions (`/status`, `/mcp`, etc.)
- API error/retry events

## Common concepts across record types

### `uuid` and `parentUuid` (linkage)

Many records include:
- `"uuid"`: unique ID for the record
- `"parentUuid"`: the previous record in the chain

This forms a **linked list** (and occasionally a branching graph) representing the transcript order and tool call ordering.

#### `logicalParentUuid` (branch/compaction linkage)

Some records may include `logicalParentUuid` in addition to `parentUuid`.

In `cli.js`, when inserting message chains, certain events are emitted with:
- `parentUuid: null` (a new “root” for reconstruction)
- `logicalParentUuid: <previousUuid>` (the prior record in the logical chain)

This is used to represent “logical continuation” while allowing a new chain root (for example, when compaction or other boundary events occur).

### `sessionId` (conversation scope)

Most records include `"sessionId"` indicating which session transcript they belong to.

In session files, `sessionId` usually matches the filename (UUID).

### `timestamp`

Many records include ISO-8601 timestamps like:

```
2025-12-13T14:06:52.962Z
```

Not all record types include timestamps (e.g. `file-history-snapshot` frequently does not at the top level).

### `cwd`, `gitBranch`, `version`, `userType`

Many transcript records include:
- `"cwd"`: working directory when the event occurred
- `"gitBranch"`: branch name or `""`
- `"version"`: app/cli version string (e.g. `2.0.69`)
- `"userType"`: often `"external"` (human user)

### `isSidechain`

Records frequently include:
- `"isSidechain": false` in primary session logs
- `"isSidechain": true` in agent/subagent logs

Treat this as a “this record belongs to a sidechain transcript” indicator.

## `"assistant"` records

### Purpose

An `"assistant"` record logs assistant output in Anthropic “Messages API” style:
- Natural language text output
- Tool invocations (`tool_use`)
- Optional “thinking” blocks, depending on configuration

### Typical keys

Common keys:
- `type: "assistant"`
- `uuid`, `parentUuid`
- `timestamp`
- `sessionId`
- `cwd`, `gitBranch`, `version`, `userType`
- `isSidechain`
- `requestId` (API request correlation)
- `message` (the assistant message object)

Common optional keys:
- `agentId` (when in a sidechain)
- `slug` (human-friendly session label)
- `optimizationStrategy` (optional; optimization metadata)
- `optimizedFrom` (optional; optimization metadata)
- `isApiErrorMessage` / `error` (optional; when the assistant message represents an API error)

### Common key combinations (variants)

Most common `"assistant"` shapes observed:

1) Session assistant message (with `requestId`, no `agentId`, no `slug`)
```
('cwd','gitBranch','isSidechain','message','parentUuid','requestId','sessionId','timestamp','type','userType','uuid','version')
```

2) Session assistant message (with `slug`)
```
... plus 'slug'
```

3) Sidechain/agent assistant message (with `agentId`)
```
... plus 'agentId' (and sometimes 'slug')
```

### `message` object (assistant)

For assistant records, `"message"` is typically:

```json
{
  "model": "claude-…",
  "id": "msg_…",
  "type": "message",
  "role": "assistant",
  "content": [ ... ],
  "stop_reason": "tool_use|end_turn|…|null",
  "stop_sequence": null,
  "usage": { ... }
}
```

Notes:
- `"content"` is always an array for assistant messages in the observed data.
- `"stop_reason": null` is common for intermediate streamed chunks; the terminal chunk commonly has `"tool_use"` or `"end_turn"`.

See `Resources/ClaudeProjects/Message-Content-Blocks.md` for the content block formats.

## `"user"` records

### Purpose

A `"user"` record logs either:
- A human user input message, or
- A **tool result message** (in Anthropic tool calling, tool results are returned as messages with role `"user"`).

### Typical keys

Common keys:
- `type: "user"`
- `uuid`, `parentUuid`
- `timestamp`
- `sessionId`
- `cwd`, `gitBranch`, `version`, `userType`
- `isSidechain`
- `message`

Common optional keys:
- `toolUseResult` (structured form of a tool result)
- `slug`
- `agentId` (sidechain)
- `isMeta` (rare)
- `sourceToolUseID` (rare; links meta/system activity back to a tool use)
- `thinkingMetadata` (rare)
- `todos` (when Todo state is present)
- `isVisibleInTranscriptOnly` / `isCompactSummary` (compaction/continuation behavior)
- `optimizationStrategy` / `optimizedFrom` (optional; optimization metadata)

### Common key combinations (variants)

The most frequent `"user"` shapes are tool-result records that include `toolUseResult`:

1) Tool result with slug
```
('cwd','gitBranch','isSidechain','message','parentUuid','sessionId','slug','timestamp','toolUseResult','type','userType','uuid','version')
```

2) Tool result without slug
```
... same, minus 'slug'
```

3) Sidechain tool result (with `agentId`)
```
... plus 'agentId' (and sometimes 'slug')
```

Non-tool user messages tend to omit `toolUseResult` and may use either:
- `message.content` as a string (legacy/simple messages)
- `message.content` as an array of blocks (text/images)

### `toolUseResult` and tool results

If the `"user"` record contains a tool result block in `message.content` (type `"tool_result"`), it often also contains a top-level `"toolUseResult"` with a structured representation of the same output.

See `Resources/ClaudeProjects/Tools-and-toolUseResult.md`.

### Compaction/continuation message variant

Some `"user"` records include:
- `"isCompactSummary": true`
- `"isVisibleInTranscriptOnly": true`
- `message.content` as a *string* containing the “conversation summary so far”

This appears to be the mechanism used when a session is **continued** after running out of context.

## `"system"` records

### Purpose

System records are **local system events** related to the session:
- Automatic compaction boundaries
- Local slash commands (`/status`, `/mcp`, `/doctor`, etc.)
- API retry errors

### Typical keys

Common keys:
- `type: "system"`
- `uuid`, `parentUuid`
- `timestamp`
- `sessionId`
- `cwd`, `gitBranch`, `version`, `userType`
- `isSidechain`
- `level` (e.g. `"info"`, `"error"`)
- `subtype` (e.g. `"compact_boundary"`, `"local_command"`, `"api_error"`)
- `content` (string, sometimes XML-like markup)

Optional keys by subtype:
- `compactMetadata` and `logicalParentUuid` for `"compact_boundary"`
- `retryAttempt`, `maxRetries`, `retryInMs`, `error`, `cause` for `"api_error"`
- `slug` sometimes present

### Known system subtypes (observed)

1) `subtype: "compact_boundary"`
- `content`: `"Conversation compacted"`
- `compactMetadata`: e.g. `{"trigger":"auto","preTokens":155180}`
- `logicalParentUuid`: links the “logical conversation chain” across compaction

2) `subtype: "api_error"`
- `level`: `"error"`
- retry metadata fields (attempt counters, delay, etc.)
- `error` / `cause` objects (often sparse)

3) `subtype: "local_command"`
- `content` often uses XML-like tags such as:
  - `<command-name>/status</command-name>`
  - `<local-command-stdout>...</local-command-stdout>`

### Legacy/system-prompt variant

Some rare `"system"` records have a nested `"message"` object like:

```json
{ "type":"system", "message": { "role":"system", "content":"..." }, ... }
```

Treat this as an alternate schema/version for system prompts.

## `"summary"` records

### Purpose

`"summary"` records provide short labels for a session state:
- `"summary"`: a concise title
- `"leafUuid"`: an identifier of the conversation leaf being summarized

Typical shape:

```json
{ "type":"summary", "summary":"...", "leafUuid":"..." }
```

Sometimes `"sessionId"` is also present.

## `"custom-title"` records (session naming)

### Purpose

These records store a user-assigned title for a session, used by resume/search flows.

Observed in `cli.js` session log appenders:

```json
{ "type":"custom-title", "customTitle":"...", "sessionId":"..." }
```

Notes:
- Titles are searched by `--resume <title>` in interactive mode (exact match path), and used to disambiguate conversations in the picker UI.

## `"tag"` records (session labeling)

### Purpose

These records attach a short label to a session (e.g. for filtering/grouping).

Observed in `cli.js` session log appenders:

```json
{ "type":"tag", "tag":"...", "sessionId":"..." }
```

## `"attachment"` records

### Purpose

`cli.js` transcript parsers treat `"attachment"` as a first-class “message-like” record type alongside `"user"`, `"assistant"`, and `"system"`.

This is used for structured/non-text payloads attached to a transcript (for example, structured outputs, file attachments, or other non-text events).

### Caveat

The exact schema of `"attachment"` records is not fully characterized here because it was not present in the scanned local corpus at documentation time, but the CLI tooling explicitly supports it.

## `"file-history-snapshot"` records

### Purpose

These records appear to track snapshots of “tracked file backup” metadata at points in time, likely related to file tools.

Typical shape:

```json
{
  "type": "file-history-snapshot",
  "messageId": "…",
  "snapshot": {
    "messageId": "…",
    "timestamp": "…",
    "trackedFileBackups": {
      "relative/path.ext": {
        "backupFileName": null,
        "version": 1,
        "backupTime": "…"
      }
    }
  },
  "isSnapshotUpdate": true
}
```

Notes:
- `trackedFileBackups` is a map of **relative file path** → backup metadata.
- `isSnapshotUpdate` indicates whether the snapshot is a delta/update.

## `"queue-operation"` records

### Purpose

These records track internal queue behavior for a session, such as pending user messages.

Observed keys:
- `type: "queue-operation"`
- `operation`: `"enqueue" | "dequeue" | "remove" | "popAll"`
- `timestamp`
- `sessionId`
- optional `content` (present mostly on `"enqueue"`)

Examples:
- `"enqueue"` often includes a `content` string (the enqueued item).
- `"remove"` often has `content: null` / no content.
