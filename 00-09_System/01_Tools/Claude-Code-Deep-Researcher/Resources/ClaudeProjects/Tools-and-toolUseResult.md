# Tools, Tool Calls, and `toolUseResult`

This document focuses on the **tool calling representation** inside Claude project `.jsonl` logs:
- How `tool_use` and `tool_result` link together
- Why tool results appear as `"user"` messages
- The top-level `"toolUseResult"` field and its many shapes
- Observed field meanings for common tools

## The tool call lifecycle in the logs

### 1) Assistant requests a tool call

An `"assistant"` record contains one or more `"tool_use"` blocks:

```json
{
  "type": "assistant",
  "message": {
    "role": "assistant",
    "content": [
      { "type": "tool_use", "id": "toolu_123", "name": "Bash", "input": { "command": "ls" } }
    ]
  }
}
```

### 2) Client executes the tool, then returns the tool result

The tool output is recorded as a `"user"` record containing a `"tool_result"` block:

```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": [
      { "type": "tool_result", "tool_use_id": "toolu_123", "content": "…", "is_error": false }
    ]
  }
}
```

### 3) (Often) the log also includes a structured companion: `toolUseResult`

Many tool-result `"user"` records contain a top-level field:

```json
{ "toolUseResult": { ... } }
```

This appears to be a parsed/structured representation of the tool output, used to:
- Preserve machine-readable fields (exit codes, filenames, patch hunks, etc.)
- Avoid needing to re-parse the string in `tool_result.content`

## Linking: `id` vs `tool_use_id`

- `tool_use.id` (assistant) is the unique ID of the tool call.
- `tool_result.tool_use_id` (user) references that same ID.

To associate a tool result with its tool call:
1. Build a map of `tool_use.id -> tool_use.name` while reading assistant records.
2. When you encounter a user record containing `tool_result.tool_use_id`, look it up.

## `toolUseResult`: general notes

`toolUseResult` is not a single stable schema. It can be:
- An object/dict
- A list/array (commonly for MCP tools)
- A plain string (often for errors)
- Absent (`null`/missing) in some cases

Additionally:
- Some `toolUseResult` dicts include a `"type"` discriminator (e.g. `{"type":"text","file":{...}}`).
- Others are “bare dicts” without `"type"` (e.g. Bash output fields).

## Common tool output schemas (observed)

Below are common tools and the *observed* `toolUseResult` shapes/keys.

### `Bash`

Most common `toolUseResult` shape:

```json
{
  "stdout": "…",
  "stderr": "…",
  "interrupted": false,
  "isImage": false
}
```

Observed optional keys:
- `returnCodeInterpretation`: human-friendly explanation (e.g. “Some directories were inaccessible”)
- `backgroundTaskId`: if the shell command was run async/in background

Error case:
- `toolUseResult` may be a **string** like `"Error: Exit code 1\n..."`.
- The `tool_result` block may include `"is_error": true`.

### `Read`

Often returns a typed dict:

```json
{
  "type": "text",
  "file": {
    "filePath": "path/to/file",
    "content": "…",
    "startLine": 1,
    "numLines": 200,
    "totalLines": 900
  }
}
```

Image read variant:

```json
{
  "type": "image",
  "file": {
    "type": "image/png",
    "base64": "<base64>",
    "originalSize": 123456,
    "dimensions": { "width": 800, "height": 600 }
  }
}
```

Error variant:
- `toolUseResult` can be a string describing an error.

### `Write`

`Write` commonly reports a typed result with a patch-like structure:

```json
{
  "type": "create",
  "filePath": "path/to/file",
  "content": "…",
  "originalFile": null,
  "structuredPatch": [ ... hunks ... ]
}
```

or:

```json
{
  "type": "update",
  "filePath": "path/to/file",
  "content": "…",
  "originalFile": "…",
  "structuredPatch": [
    {
      "oldStart": 10,
      "oldLines": 3,
      "newStart": 10,
      "newLines": 4,
      "lines": [" ", "-old", "+new", " "]
    }
  ]
}
```

Notes:
- `structuredPatch` is an array of **hunks** (see “Structured Patch Hunks” below).
- `originalFile` may be `null` (create) or a string (pre-edit content).
- Some logs record `Write` results as strings (error/edge cases).

### `Edit`

`Edit` is typically string-based replacement and includes:

```json
{
  "filePath": "path/to/file",
  "oldString": "…",
  "newString": "…",
  "replaceAll": false,
  "userModified": false,
  "originalFile": "…",
  "structuredPatch": [ ... hunks ... ]
}
```

Notes:
- `replaceAll` indicates global replacement vs first match.
- `userModified` may indicate the file changed between read and edit application.

### `TodoWrite`

Returns old and new todo lists:

```json
{
  "oldTodos": [ ... ],
  "newTodos": [ ... ]
}
```

Todo item shape (observed):

```json
{ "content": "…", "status": "pending|in_progress|completed", "activeForm": "…" }
```

### `Task`

Returns metadata about an invoked task/subagent run:

```json
{
  "status": "…",
  "prompt": "…",
  "agentId": "…",
  "isAsync": true,
  "description": "…",
  "outputFile": "…"
}
```

Some task results include rollups:
- `totalDurationMs`
- `totalTokens`
- `totalToolUseCount`
- `usage` (token usage summary)

### `TaskOutput`

Often returns a retrieval wrapper:

```json
{
  "retrieval_status": "…",
  "task": {
    "task_id": "…",
    "task_type": "…",
    "status": "…",
    "description": "…",
    "output": "…",
    "prompt": "…",
    "result": "…",
    "exitCode": 0
  }
}
```

### `Glob`

Typical fields:

```json
{
  "filenames": ["…", "…"],
  "numFiles": 12,
  "durationMs": 4.2,
  "truncated": false
}
```

### `Grep`

Observed variant depends on mode and limits:

```json
{
  "mode": "…",
  "numFiles": 3,
  "filenames": ["…"],
  "numLines": 120,
  "content": "…",
  "appliedLimit": 200
}
```

### `WebSearch`

Typical shape:

```json
{
  "query": "…",
  "results": [ ... ],
  "durationSeconds": 1.23
}
```

### `WebFetch`

Typical shape:

```json
{
  "url": "…",
  "code": 200,
  "codeText": "OK",
  "bytes": 12345,
  "durationMs": 350,
  "result": "…"
}
```

### MCP tool calls (e.g. `mcp__context7__get-library-docs`)

For many MCP tools, `toolUseResult` is often a **list/array** (not a dict).

Treat MCP outputs as tool-specific:
- Some return arrays of messages or structured objects.
- Some return strings for error cases.

## Structured Patch Hunks (`structuredPatch`)

When present, `structuredPatch` is an array of hunk objects:

```json
{
  "oldStart": 6,
  "oldLines": 10,
  "newStart": 6,
  "newLines": 12,
  "lines": [
    " unchanged line",
    "-removed line",
    "+added line"
  ]
}
```

Interpretation:
- `oldStart` / `oldLines`: the location/extent in the original file
- `newStart` / `newLines`: the location/extent in the updated file
- `lines`: line-level diff where each string begins with:
  - `" "` unchanged context
  - `"-"` removed line
  - `"+"` added line

This format is similar in spirit to unified diff, but structured for JSON.

