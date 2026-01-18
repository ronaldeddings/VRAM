# Directory Layout: `~/.claude/projects/`

## What lives here (high level)

`~/.claude/projects/` appears to be a local cache of **project-scoped conversation logs** for Claude tooling.

Within this directory:
- Each **project** corresponds to a folder whose name is derived from some “project identifier” (usually a path).
- Each project folder contains many `.jsonl` files that look like **session transcripts and sidechains**.

## Top-level structure

```
~/.claude/projects/
  <projectKeyA>/
    <sessionId>.jsonl
    <sessionId>.jsonl
    agent-<agentId>.jsonl
    bash-outputs/
      <sessionId>/
        *.txt
    <sessionId>/
      tool-results/
        ...
    ...
  <projectKeyB>/
    ...
```

There are no strict guarantees that every file exists for every project; this is an append-only-ish log store and sometimes contains **empty (`0` bytes) `.jsonl` files**.

## Project folder naming (`<projectKey>`)

Observed patterns for project folder names:

### 1) Current CLI behavior: “sanitize to `[A-Za-z0-9-]`”

In `Resources/ClaudeCodeSource/cli.js`, the project key function is:
- `eu(A) { return A.replace(/[^a-zA-Z0-9]/g, "-") }`

And the projects root is:
- `Ub() { return join(mQ(), "projects") }`, where `mQ()` defaults to `~/.claude` (or `CLAUDE_CONFIG_DIR`).

So, a project folder name is effectively:

```
<projectKey> = eu(<projectPath>)
```

This yields folder names that look like a filesystem path with separators and punctuation replaced by `-`:

```
-Users-<user>-<project>
-Applications-Warp-app-Contents
```

Interpretation:
- The original path likely was `/Users/<user>/<project>` etc.
- The leading `-` corresponds to the leading `/` in an absolute path.

### 2) Base64-encoded identifiers (likely legacy / other client versions)

Some project folder names can look like base64 strings and decode cleanly to:
- A short project name (e.g. `test-project`)
- A full absolute path (e.g. `/Users/.../Claude-Code-Deep-Researcher`)

Examples (decoded):
- `dGVzdC1wcm9qZWN0` → `test-project`
- `<base64_of_/Users/<user>/<project>>` → `/Users/<user>/<project>`

Heuristic:
- If a folder name is base64-ish and `len % 4 == 0`, decoding often yields a printable identifier.

### 3) “Base64 of a hyphenated path” (variant)

You may also see base64 that decodes to a hyphenated path string:

```
<base64_of_-Users-<user>-<project>>
  -> -Users-<user>-<project>
```

**Important:** The current `cli.js` code path uses the `eu(...)` sanitization scheme, not base64. Base64-named folders may be left over from older versions or created by other Claude clients.

## Session file naming (`<sessionId>.jsonl`)

Most `.jsonl` files inside a project folder are named like UUIDs:

```
4eb1a52a-b794-48c7-94db-f1a89519da5a.jsonl
```

The filename usually matches the top-level `"sessionId"` recorded in each line inside the file.

Interpretation:
- A session file is the primary transcript for one “chat session” within that project context.

## Agent / sidechain file naming (`agent-<agentId>.jsonl`)

Some `.jsonl` files are named:

```
agent-05112506.jsonl
agent-a511cb98.jsonl
```

Inside these files, records often include:
- `"isSidechain": true`
- `"agentId": "<same as filename suffix>"`

Interpretation:
- These are **sidechain logs** such as subagents, background tasks, or tool-driven agent flows associated with one or more parent sessions.

## File sizes and empties

It’s common to find:
- Large session logs (MBs) for long-running work.
- Tiny logs (hundreds of bytes) for aborted sessions.
- `0`-byte `.jsonl` files (created but never written, or truncated).

When building tooling around this directory:
- Treat `0`-byte files as valid-but-empty.
- Do not assume `.jsonl` always ends with a trailing newline (some files contain a single JSON object without a final `\n`).

## Additional on-disk artifacts (non-JSONL)

In addition to transcript `.jsonl` files, `cli.js` also references per-session artifact directories inside each project:

### `bash-outputs/`

`cli.js` references a `bash-outputs` directory under each project directory, with per-session subdirectories that contain `.txt` files.

This appears to be used for tools that write larger stdout/stderr to disk rather than embedding everything inline in JSONL.

### `<sessionId>/tool-results/`

`cli.js` defines a `tool-results` directory under a per-session directory:

```
~/.claude/projects/<projectKey>/<sessionId>/tool-results/...
```

This is used to persist tool results to files (e.g. large outputs), and the transcript may include placeholders or truncated previews that refer to these persisted outputs.

## Global artifacts outside `projects/`

Not everything related to resume/rewind lives under `~/.claude/projects/`.

### `~/.claude/file-history/` (backup store for rewind)

`cli.js` also uses a global file-history directory under the Claude config dir:

```
~/.claude/file-history/
  <sessionId>/
    <backupFileName>
    <backupFileName>
    ...
```

These backup files are referenced indirectly by `file-history-snapshot` records (which track `backupFileName`, `version`, and timestamps for tracked files).

This directory becomes important for:
- `--rewind-files` (restore files to a prior snapshot)
- `--fork-session` (backups may be copied/hardlinked from the original session id to the forked session id)

See:
- `Resources/ClaudeProjects/Record-Types.md` (`file-history-snapshot`)
- `Resources/ClaudeProjects/CLI-Resume-Flow.md` (`--rewind-files`)
