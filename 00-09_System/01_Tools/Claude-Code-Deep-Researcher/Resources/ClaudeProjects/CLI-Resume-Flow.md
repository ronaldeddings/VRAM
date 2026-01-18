# CLI Resume/Continue Flow (`-c`, `-r`, `--fork-session`, `--resume-session-at`, `--rewind-files`)

This is a deep, developer-oriented explanation of how the bundled Claude Code CLI (`Resources/ClaudeCodeSource/cli.js`) implements resume and how that relates to the on-disk JSONL logs in `~/.claude/projects/`.

Related docs:
- `Resources/ClaudeProjects/Resume-and-Continue.md` (high-level summary)
- `Resources/ClaudeProjects/Directory-Layout.md`
- `Resources/ClaudeProjects/Record-Types.md`
- `Resources/ClaudeProjects/SessionStore-$LB-API.md`

---

## 1) Mental model: inputs → resume target → loaded transcript → session-id policy → side effects

Resume behavior is easiest to understand as a pipeline:

1) **Inputs**
   - `--continue` boolean
   - `--resume [value]` where `value` is optional
   - `--fork-session` boolean
   - `--resume-session-at <id>` optional (print mode)
   - `--rewind-files <id>` optional (requires resume)

2) **Resolve a resume target**
   - UUID session id
   - custom title match
   - interactive picker (possibly with a search term)
   - print mode only: `.jsonl` path or remote URL

3) **Load transcript**
   - Read JSONL (best effort)
   - Build indexes (messages/titles/tags/summaries/snapshots)
   - Reconstruct chain(s) via `uuid`/`parentUuid`

4) **Policy: reuse or fork session id**
   - reuse: keep writing to the same `<sessionId>.jsonl`
   - fork: assign a new `sessionId` and begin a new `<newSessionId>.jsonl` while inheriting loaded messages

5) **Optional side effects**
   - truncation (`--resume-session-at`)
   - file rewind (`--rewind-files`)
   - copy file-history backups on fork (so rewind works in forked sessions)

---

## 2) CLI argument parsing shapes (important for TS refactor)

In `cli.js`, `commander` is configured so that:
- `--continue` produces `boolean`
- `--resume [value]` produces:
  - `true` when the flag is passed with no value (e.g. `--resume`)
  - `string` when a value is provided (e.g. `--resume 1234...`)

In TypeScript, model it explicitly:

```ts
export type ResumeArg = true | string | undefined;

export interface ResumeFlags {
  continue?: boolean;
  resume?: ResumeArg;
  forkSession?: boolean;

  // print-mode only (as implemented today)
  resumeSessionAt?: string;
  rewindFiles?: string;
}
```

This avoids a common bug: treating `--resume` as `string | undefined` and accidentally losing the “picker” case.

---

## 3) Project scope rules (how it relates to `~/.claude/projects/`)

### 3.1 The “current project bucket”

The CLI buckets sessions into `~/.claude/projects/<projectKey>/` where:
- `projectPath` is typically the process start directory (`originalCwd`)
- `projectKey = projectPath.replace(/[^a-zA-Z0-9]/g, "-")`

Within a session, per-record `cwd` may change, but the bucket directory generally remains the bucket chosen for that run.

### 3.2 Cross-project resume behavior (interactive picker)

The interactive resume picker can show conversations from other directories.

When you select a conversation from a different `projectPath`, the CLI does not directly resume it in-place.
Instead it:
- constructs a command like:
  - `cd <thatProjectPath> && claude --resume <sessionId>`
- copies it to your clipboard
- shows instructions to run it

Why:
- the session JSONL lives under the other project bucket
- and the CLI wants “project identity” to be the current working directory bucket

If you want to remove this restriction in a TS refactor, you need:
- a resume target format that includes both `projectPath` and `sessionId`
- or a multi-project session store that can open any project directory

---

## 4) `--continue` flow (interactive mode)

Behavior:
- find the most recent conversation for the current project bucket
- load it as `initialMessages`
- start the UI loop

Implementation note:
- “most recent” is effectively based on file modification time (`mtime`) and/or latest record timestamp in the reconstructed transcript.

Fork interaction:
- `--continue` + `--fork-session` loads history but writes subsequent events to a new session id.

---

## 5) `--resume` flow (interactive mode)

### 5.1 `--resume <uuid>`

If `<uuid>` parses as a UUID:
- treat it as `sessionId`
- load `~/.claude/projects/<projectKey>/<sessionId>.jsonl`
- reconstruct transcript events + file-history snapshot metadata
- start UI with those messages

### 5.2 `--resume <string>` (non-UUID)

The CLI attempts “custom title” lookup:
- exact match
- if exactly one session matches, resume it
- otherwise fall back to interactive picker with search term

Custom titles exist as JSONL records:
```json
{ "type": "custom-title", "customTitle": "…", "sessionId": "…" }
```

### 5.3 `--resume` (no value)

`--resume` without a value means:
- open the picker directly

This is why the argument type is `true | string | undefined`.

---

## 6) Print mode resume flow (`--print`)

Print mode has a separate orchestration path because it needs to:
- build the request’s message list deterministically
- possibly run without interactive UI

In print mode, `--resume <value>` supports additional formats:
- session UUID
- path to a `.jsonl` file
- remote ingress URL (treated as a resumable “remote session” source)

This is primarily implemented in the bundle by:
- `bc2(...)` (parsing the resume target)
- `SH5(...)` (print-mode orchestration)
- `Dl(...)` (load conversation)

---

## 7) `--resume-session-at` (print mode truncation)

CLI help text implies truncation by nested assistant `message.id` (the `msg_...` id).

Implementation detail (as observed in `cli.js`):
- truncation matches the **top-level record `uuid`** (the JSONL record id), not the nested `message.id`.

Practical implication:
- To truncate, you need the record UUID shown in JSONL (or produced by tooling that knows the JSONL record ids).

In a TS refactor, consider supporting both:
- `--resume-session-at-record <uuid>`
- `--resume-session-at-message <msg_...>`

---

## 8) `--rewind-files` (file history restore and exit)

`--rewind-files <user-record-uuid>`:
- requires `--resume` (a session must be loaded)
- expects the UUID of a top-level `type: "user"` record

High-level behavior:
1) Load the session transcript and its `file-history-snapshot` records.
2) Find the snapshot state at/near the target user message.
3) Restore tracked files from backup store.
4) Exit without starting a new interactive loop.

This relates to:
- JSONL records: `type: "file-history-snapshot"`
- Backup store on disk: `${CLAUDE_CONFIG_DIR}/file-history/<sessionId>/<backupFileName>` (reverse‑engineered from `cli.js`)

Fork interaction:
- When you fork a session, backups may be copied/hardlinked from the original session id to the forked session id so that rewind still works.

---

## 9) What to implement first if you’re extending this

If your goal is “I need to extend projects/resume like I used to extend query()/tool()”, the most leverage comes from:

- A `ResumeResolver` chain (UUID/title/tag/latest/path/url…)
- A `ProjectKeyStrategy` (how sessions are bucketed)
- A `SessionStore` interface (local JSONL vs alternate stores)
- A `Truncator` abstraction (record-uuid vs message-id vs timestamp)

Concrete “copy/paste” recipes:
- `Resources/ClaudeProjects/Extending-Projects-and-Resume-Practical-Recipes.md`
