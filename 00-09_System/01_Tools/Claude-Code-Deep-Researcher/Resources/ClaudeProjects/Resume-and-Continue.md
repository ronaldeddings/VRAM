# `-c/--continue` and `-r/--resume` (How resume works)

This document ties the CLI implementation (`Resources/ClaudeCodeSource/cli.js`) to what you see in `~/.claude/projects/`.

It focuses on:
- `-c, --continue`
- `-r, --resume [value]`
- `--fork-session`
- `--resume-session-at <message-id>` (print mode)
- `--rewind-files <user-message-uuid>`

If you are trying to *extend/abstract* these behaviors (custom resume resolvers, alternate project-key strategies, different “continue” policies), also see:
- `Resources/ClaudeProjects/Extending-Projects-and-Resume.md`
- `Resources/ClaudeProjects/CLI-Resume-Flow.md`

## Where “conversations” live on disk

From `cli.js`:
- Projects root: `~/.claude/projects` (or `${CLAUDE_CONFIG_DIR}/projects`)
- Project key: `eu(projectPath)`, where `eu(A) = A.replace(/[^a-zA-Z0-9]/g, "-")`

Inside a project directory, conversations are stored as JSONL logs:
- Primary session: `~/.claude/projects/<projectKey>/<sessionId>.jsonl`
- Sidechain agent: `~/.claude/projects/<projectKey>/agent-<agentId>.jsonl`

### Project “identity” vs per-record `cwd`

Two related but distinct fields exist:
- **Project identity**: the `projectPath` the CLI uses to decide which `~/.claude/projects/<projectKey>/` directory to read/write.
- **Per-record `cwd`**: each `user`/`assistant`/`system` record often includes a `cwd` field that reflects the working directory at the moment that record was emitted.

In `cli.js` the runtime context distinguishes:
- `pQ()` → `QQ.originalCwd` (process start directory)
- `TBA()` → `QQ.cwd` (current working directory tracked by the CLI)

Most resume/continue behavior is scoped to the **project identity** bucket, even if per-record `cwd` changes during the session.

### Cross-project resume (interactive picker)

When using the interactive picker (e.g. `--resume` with no argument), selecting a conversation from a different `projectPath` does not directly resume it in-place.

Instead, the CLI constructs a command:
- `cd <projectPath> && claude --resume <sessionId>`

…copies it to your clipboard, and asks you to run it from that directory.

See `Resources/ClaudeProjects/CLI-Resume-Flow.md` for a deeper walkthrough.

## `-c, --continue` (interactive mode)

CLI help string: “Continue the most recent conversation”.

Behavior:
- The CLI calls an internal “load conversation” function (`Dl(void 0, void 0)` in `cli.js`) to fetch the most recent conversation for the current project.
- If found, it opens the UI loop with `initialMessages` loaded from that session file.
- If `--fork-session` is **not** set, it reuses the existing `sessionId` for continued writes (so the same `<sessionId>.jsonl` continues growing).

Practical meaning:
- `--continue` chooses *the most recently modified* conversation in the current project’s `~/.claude/projects/<projectKey>/` directory, then loads it.

## `-r, --resume [value]` (interactive mode)

CLI option definition (from `cli.js`):
- `-r, --resume [value]`: “Resume a conversation by session ID, or open interactive picker with optional search term”
- Parser: if you pass no value, it becomes boolean `true`.

There are three main interactive behaviors:

### A) `--resume <sessionId>`

If `<sessionId>` is a valid UUID, the CLI loads that session’s messages:
- Reads `~/.claude/projects/<projectKey>/<sessionId>.jsonl`
- Parses transcript records and metadata records (summaries, custom titles, tags, file-history snapshots)
- Starts the UI with those messages as `initialMessages`

If `--fork-session` is **not** set:
- The CLI sets the current session ID to the resumed session ID (subsequent events append to the same JSONL file).

### B) `--resume <customTitleExactMatch>`

If the resume argument is not a UUID:
- The CLI attempts an **exact match** on conversation “custom title”.
- If exactly one matching session is found, it resumes that session ID.

Custom titles are stored in JSONL as:
```json
{ "type":"custom-title", "customTitle":"...", "sessionId":"..." }
```

### C) `--resume` (no argument) or ambiguous title

If you pass `--resume` with no value, or you pass a non-UUID value that matches multiple sessions (or none):
- The CLI opens an **interactive conversation picker** for the current project.
- The optional search term (your provided value) is used to filter/prefill the picker.

## `--fork-session` (resume/continue)

`--fork-session` changes what happens after messages are loaded:
- Without `--fork-session`: continuing/resuming reuses the existing session ID, appending new records into the same `<sessionId>.jsonl`.
- With `--fork-session`: the CLI loads the historical messages but generates/uses a new session ID for subsequent writes, creating a new `<newSessionId>.jsonl`.

This is how “branching”/forking a conversation works locally.

## `--resume` in `--print` mode (non-interactive)

In `--print` mode, resume/continue is handled by a separate path (`SH5(...)` in `cli.js`) before the model request is run.

### `--print --resume <value>`

The CLI parses `<value>` via a helper that accepts:
- A session UUID
- A `.jsonl` path (treated as an input transcript)
- A URL (remote ingress)

Then it calls the same conversation loader (`Dl(...)`) to load messages.

### `--resume-session-at <message-uuid>`

CLI help text says: “only messages up to and including the assistant message with <message.id>”.

Implementation detail from `cli.js`:
- The filter is applied by matching the **record** `uuid` (top-level `uuid`), not the nested `message.id` (`msg_...`).

Effect:
- The loaded message list is truncated to `messages.slice(0, index+1)` at the matching record uuid.

This is useful for:
- Replaying a conversation up to a point
- Running deterministic “print mode” operations against a partial transcript

## `--rewind-files <user-message-uuid>`

This is a standalone operation and requires:
- `--resume` (so a session is loaded)
- A **user record UUID** (top-level `uuid` where `type === "user"`)

Behavior (high level):
- The CLI loads the session transcript, including file-history snapshots/checkpoints.
- It validates that the UUID refers to a user message in the loaded transcript.
- It attempts to restore files to the state checkpointed at that point, then exits.

This feature relates to:
- `file-history-snapshot` records in JSONL
- per-session file checkpointing behavior (outside the JSONL itself)
