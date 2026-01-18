# Field Reference (Top-Level + Key Nested Fields)

This is a reference for observed fields in `~/.claude/projects/**/*.jsonl`.

It’s organized in two sections:
1) Top-level record fields
2) Nested fields for `"message"` and `toolUseResult`

This is **observational**: fields are included if they appeared in your local data set.

Where applicable, this file also notes additional record/field types that are **supported by the CLI implementation** (`Resources/ClaudeCodeSource/cli.js`) even if they were not present in the scanned corpus.

## 1) Top-level fields

### `type` (string)

Record discriminator. Observed values:
- `user`
- `assistant`
- `system`
- `summary`
- `file-history-snapshot`
- `queue-operation`

Additional values supported by `cli.js` (may or may not appear in your local logs):
- `attachment`
- `custom-title`
- `tag`

### `uuid` (string, UUID)

Unique ID for a record/event in a transcript chain.

### `parentUuid` (string | null)

Back-reference to the previous record in the chain.

### `sessionId` (string, UUID)

Session identifier. Often matches the session filename for non-agent logs.

### `timestamp` (string, ISO-8601)

Event timestamp in UTC (Z suffix).

### `cwd` (string)

Working directory at the time of the event.

### `gitBranch` (string)

Git branch name (may be empty).

### `version` (string)

Claude Code / tooling version (e.g. `2.0.69`).

### `userType` (string)

Often `"external"` for human user sessions.

### `isSidechain` (boolean)

Indicates whether the record belongs to a sidechain transcript.

### `agentId` (string)

Sidechain identifier used for agent logs (commonly matches `agent-<agentId>.jsonl`).

### `isTeammate` (boolean)

Set by `cli.js` when inserting records, likely to indicate “teammate”/collaborator or multi-user session behavior.

This field is **not always present** and may depend on configuration or environment.

### `slug` (string)

Human-friendly label for the session (e.g. adjective-noun).

### `optimizationStrategy` / `optimizedFrom` (string | object)

Optional optimization metadata.

Observed on some `assistant`, `user`, and `system` records.

### `requestId` (string)

Correlates assistant output chunks to a single API request (stream grouping).

### `message` (object)

Anthropic-style message object containing role/content and assistant metadata.

See “Nested fields: message”.

### `toolUseResult` (any)

Structured representation of a tool output, typically paired with a `tool_result` block in `message.content`.

See “Nested fields: toolUseResult”.

### `thinkingMetadata` (object)

Seen on some user records. Observed fields:
- `level` (e.g. `"high"`)
- `disabled` (boolean)
- `triggers` (array)

Likely controls whether assistant thinking blocks are enabled/recorded.

### `todos` (array)

Seen on some user records; list of todo items with fields:
- `content` (string)
- `status` (`pending` | `in_progress` | `completed`)
- `activeForm` (string; human-friendly “active” phrasing)

### `isCompactSummary` (boolean)

Marks a user record whose `message.content` contains a continuation summary after context compaction.

### `isVisibleInTranscriptOnly` (boolean)

Indicates a record is presented in the transcript UI but may not be part of the model’s message history in the same way.

### `content` (string)

Top-level content field used in:
- `system` records (system event text/markup)
- `queue-operation` records (enqueued content)

Do not confuse this with `message.content`.

### `subtype` (string) and `level` (string)

Used primarily in `system` records.

Observed `subtype` values:
- `compact_boundary`
- `api_error`
- `local_command`

Observed `level` values:
- `info`
- `error`

### `compactMetadata` (object)

Used in `system` records with `subtype: "compact_boundary"`.

Observed fields:
- `trigger` (e.g. `"auto"`)
- `preTokens` (number; token count before compaction)

### `logicalParentUuid` (string | null)

Used in compaction boundary system records to link the logical chain.

### Retry/error fields (system api_error)

Observed on `system` records with `subtype: "api_error"`:
- `retryAttempt` (number)
- `maxRetries` (number)
- `retryInMs` (number)
- `error` (object)
- `cause` (object)

### `isApiErrorMessage` (boolean) and `error` (object)

Observed on some `assistant` and `system` records.

These appear to represent assistant-visible or system-visible API failures or error state injected into the transcript.

The shape of `error` varies; treat it as opaque structured error data.

### `sourceToolUseID` (string)

Observed rarely on `user` records.

Interpretation: a back-reference to the originating tool call ID (e.g. a `tool_use.id` like `toolu_...`) for user-side metadata records.

### `summary` (string) and `leafUuid` (string)

Used on `summary` records:
- `summary`: short title
- `leafUuid`: leaf identifier

### `customTitle` (string)

Used on `custom-title` records:
- `customTitle`: user-assigned title for a session
- `sessionId`: the session being titled

### `tag` (string)

Used on `tag` records:
- `tag`: user-assigned label for a session
- `sessionId`: the session being tagged

### `operation` (string)

Used on `queue-operation` records. Observed values:
- `enqueue`
- `dequeue`
- `remove`
- `popAll`

### Snapshot fields (file-history-snapshot)

Top-level:
- `messageId` (string)
- `snapshot` (object)
- `isSnapshotUpdate` (boolean)

Snapshot object fields:
- `messageId` (string)
- `timestamp` (string)
- `trackedFileBackups` (object map)

Tracked backup metadata:
- `backupFileName` (string | null)
- `version` (number)
- `backupTime` (string)

## 2) Nested fields: `message`

### `message.role`

Observed values:
- `assistant`
- `user`
- `system` (rare)

### `message.content`

Either:
- A string (legacy/simple)
- An array of blocks

See `Resources/ClaudeProjects/Message-Content-Blocks.md`.

### Assistant-only fields

Observed in assistant message objects:
- `model` (string)
- `id` (string, `msg_…`)
- `type` (string, often `"message"`)
- `context_management` (object; context/compaction metadata)
- `container` (object; container/runtime metadata)
- `stop_reason` (string | null)
- `stop_sequence` (string | null)
- `usage` (object)

#### `message.context_management` (object)

Observed as an opaque object in some message records.

Interpretation:
- likely includes context window management, compaction, or cache hints emitted/consumed by the client
- treat as a forward-compatible bag of metadata (do not rely on stable keys without versioning)

#### `message.container` (object)

Observed as an opaque object in some message records.

Interpretation:
- likely includes runtime/container metadata about the environment that produced the message
- treat as an opaque forward-compatible structure

#### `message.usage`

Observed fields:
- `input_tokens`
- `cache_creation_input_tokens`
- `cache_read_input_tokens`
- `output_tokens`
- `cache_creation` (object with ephemeral token buckets)
- `service_tier` (e.g. `"standard"`)
- `server_tool_use` (rare)

## 3) Nested fields: `toolUseResult`

`toolUseResult` shape depends on the tool.

Common patterns:
- Bash-like dict (`stdout`, `stderr`, `exitCode` variants)
- Read-like typed dict (`type: text|image`, `file: {...}`)
- Write/Edit structured patch output (`structuredPatch`)
- MCP list outputs (arrays)

See `Resources/ClaudeProjects/Tools-and-toolUseResult.md` for tool-specific field meaning.
