# Message Content Blocks (`message.content`)

Many record types include a `"message"` object with:
- `"role"`: `"user"` / `"assistant"` / `"system"`
- `"content"`: either a **string** (legacy/simple form) or an **array** of content blocks (rich form)

This document describes the rich content block format used by Claude tooling.

## `message` object overview

### Minimal user message (legacy/simple)

Some `"user"` records store content as a plain string:

```json
{
  "message": {
    "role": "user",
    "content": "Hello"
  }
}
```

This is common in older logs and in some compaction/continuation messages.

### Rich content (array of blocks)

Assistant messages always use an array in observed data; user messages often do too:

```json
{
  "message": {
    "role": "assistant",
    "content": [
      { "type": "text", "text": "…" },
      { "type": "tool_use", "id": "toolu_…", "name": "Bash", "input": { "command": "…" } }
    ]
  }
}
```

The content array is ordered; the sequence is meaningful for:
- Interleaving thinking and text
- Issuing multiple tool calls in one assistant turn
- Returning multiple tool results

## Block types (observed)

The following content block `"type"` values are observed:
- `"text"`
- `"thinking"`
- `"tool_use"`
- `"tool_result"`
- `"image"`

## `"text"` blocks

### Schema

```json
{ "type": "text", "text": "…" }
```

### Meaning

Natural language text shown in the transcript.

## `"thinking"` blocks

### Schema (observed)

```json
{
  "type": "thinking",
  "thinking": "…",
  "signature": "…"
}
```

### Meaning

Model reasoning content emitted when “thinking” is enabled.

Notes:
- The `"signature"` may be used for integrity/verification of thinking content.
- Thinking blocks may appear alone, or alongside text/tool_use blocks.

## `"tool_use"` blocks

### Schema

```json
{
  "type": "tool_use",
  "id": "toolu_…",
  "name": "Bash",
  "input": { ... tool-specific ... }
}
```

### Meaning

An assistant request to invoke a tool. The `"id"` is later referenced by tool result blocks (`"tool_use_id"`).

Notes:
- A single assistant message can include multiple tool calls (multiple `"tool_use"` blocks).
- Tool names are product/tooling specific (examples: `Bash`, `Read`, `Edit`, `Write`, `Grep`, `Glob`, `WebSearch`, MCP tool names, etc.).

## `"tool_result"` blocks

### Schema (observed)

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_…",
  "content": "…",
  "is_error": false
}
```

Notes:
- `"is_error"` is present in some logs; in other cases it may be omitted.
- `"content"` is frequently a plain string (stdout, file content, error text, etc.).

### Meaning

A tool result is recorded as a `"user"` role message, matching Anthropic tool calling conventions:
- Assistant emits `tool_use` requests
- Client executes tools
- Client returns `tool_result` blocks as user messages

In Claude project logs, tool results often include a **structured** top-level companion field:
- `toolUseResult` (on the `"user"` record)

See `Resources/ClaudeProjects/Tools-and-toolUseResult.md`.

## `"image"` blocks

### Schema (observed)

```json
{
  "type": "image",
  "source": {
    "type": "base64",
    "media_type": "image/png",
    "data": "<base64>"
  }
}
```

### Meaning

User-provided image input embedded directly in the transcript.

Notes:
- Images are stored inline as base64; this can significantly inflate `.jsonl` size.

## Content combinations you should expect

From observed data, these combinations appear frequently:

### Assistant
- `["text"]` — normal completion chunks and final responses
- `["tool_use"]` — tool call chunks (often the terminal chunk for a request)
- `["thinking"]` — thinking chunks
- `["text","tool_use"]` — assistant both speaks and invokes tools in the same turn
- `["thinking","tool_use"]` / `["text","thinking","tool_use"]` — thinking-enabled tool calling

### User
- `["text"]` — user message in block form
- `["image","text"]` — user sends an image plus accompanying text
- `["tool_result"]` — tool outputs (very common)
- `content: "string"` — legacy/simple messages and some compaction-summary messages

