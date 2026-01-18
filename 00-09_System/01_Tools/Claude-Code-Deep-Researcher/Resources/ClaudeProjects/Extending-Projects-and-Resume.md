# Extending/Abstracting “Projects + Resume” (from `Resources/ClaudeCodeSource/cli.js`)

This document is for **deep customization**: you want to “extend” the components that map a project → session store → resume/continue behavior, similar to how you may have extended higher-level `query()` / `tool()` abstractions in the past.

Claude Code’s CLI is bundled into a single large file (`Resources/ClaudeCodeSource/cli.js`), so “extension” can mean different things:

1) You are **forking/modifying** the CLI code (true subclassing/overrides in-source).
2) You are building your own tool that **reuses the same on-disk store** (`~/.claude/projects/`) but wants different policies (composition/adapters).
3) You want to “monkey patch” behavior at runtime (possible but brittle in a bundled artifact).

This doc maps the relevant components and then proposes clean abstraction layers you can implement.

For a deeper, module-by-module “how to refactor `cli.js` into TypeScript” breakdown (with suggested TS interfaces), see:
- `Resources/ClaudeProjects/CLI-JS-to-TS-Decomposition.md`

## Quick navigation (CLI internals)

The “projects + resume” pipeline is primarily built from:

### Project store pathing
- `mQ()` (config dir root, default `~/.claude`)
- `Ub()` (projects root dir: `join(mQ(), "projects")`)
- `eu()` (project-key sanitizer: replaces non-alphanumerics with `-`)
- `KH(projectPath)` (project directory path: `join(Ub(), eu(projectPath))`)
- `yNA(sessionId)` / `kGA(agentId)` (session and sidechain filenames)

You can locate these around `Resources/ClaudeCodeSource/cli.js:1107` and the `eu(...)` helper around `Resources/ClaudeCodeSource/cli.js:76`.

### Transcript store (core “class” for persistence)
- `rW()` (singleton accessor)
- `class $LB` (in-memory indexes + JSONL append + “load all sessions”)

This is the main “projects DB” abstraction and is the best starting point for extension.

### Resume resolution and loading
- `bc2(value)` (parses `--resume` argument into UUID / URL / JSONL-file mode)
- `Dl(sessionIdOrObject?, jsonlPath?)` (loads/normalizes messages and returns `{messages, fileHistorySnapshots, sessionId}`)
- `SH5(...)` (print-mode loader for `--continue`, `--resume`, `--teleport`)
- `fGA(searchTerm, {exact, limit})` (find by custom title)
- `bGA(jsonlPath)` / `yn1(sessionId)` (parse a JSONL file into typed maps)

For readability, I extracted and lightly formatted key functions/classes into:
- `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_bc2_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_Dl_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_SH5_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_fGA_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_bGA_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_yn1_extracted.txt`

They are derived directly from `Resources/ClaudeCodeSource/cli.js` and exist solely to make the bundled code easier to reason about.

## Mental model: the 4 layers you can abstract

Think of the “projects + resume” subsystem as four stacked layers:

1) **Project identity → project key**  
   Input: “project path” (usually your repo/worktree path)  
   Output: `<projectKey>` directory name inside `~/.claude/projects/`

2) **Session log storage**  
   Append-only JSONL logs per session: `<sessionId>.jsonl` and `agent-<agentId>.jsonl`

3) **Indexing and query**  
   Parse logs and build:
   - message map (`uuid` → record)
   - summaries (`leafUuid` → summary string)
   - custom titles (`sessionId` → title)
   - tags (`sessionId` → tag)
   - fileHistorySnapshots (`messageId` → snapshot record)

4) **Resume selection policy**  
   Given `--continue` / `--resume` / picker selections, decide:
   - which session to load
   - whether to fork (`--fork-session`)
   - how to truncate (`--resume-session-at`)
   - whether to load from remote URL / local jsonl file / local store

If you want “extensibility like query() and tool()”, you should build an explicit interface at each layer and make the rest depend on that interface.

## The core class to extend: `$LB`

`class $LB` (see `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`) behaves like a combined:
- **append-only event store** (writes JSONL entries)
- **in-memory index/cache** (maps for messages/summaries/titles/tags/snapshots)
- **query engine** (last log, all transcripts)
- **persistence coordinator** (optional remote session persistence)

### What `$LB` owns (state)

Key state fields:
- `messages: Map<uuid, record>`
- `summaries: Map<leafUuid, summary>`
- `customTitles: Map<sessionId, customTitle>`
- `tags: Map<sessionId, tag>`
- `fileHistorySnapshots: Map<messageId, snapshotRecord>`
- `sessionFile: string | null` (current session’s JSONL filepath)
- `remoteIngressUrl: string | null` (enables remote persistence)
- write tracking: `pendingWriteCount`, `flushResolvers`
- `didLoad` (whether index was populated from disk)

### What `$LB` does (methods)

The methods fall into categories:

**A) Write pipeline**
- `insertMessageChain(messages, isSidechain=false, agentId?, logicalParentUuid?)`  
  Wraps “raw” message records with session metadata and parent linkage, writes each via `appendEntry`.
- `insertFileHistorySnapshot(messageId, snapshot, isSnapshotUpdate)`
- `insertQueueOperation(op)`
- `appendEntry(entry)`  
  Resolves where to write the entry (main session file vs `agent-<agentId>.jsonl`), ensures directories exist, dedupes by UUID, optionally persists to remote.

**B) Remote persistence**
- `setRemoteIngressUrl(url)`
- `persistToRemote(sessionId, entry)` (calls a helper `DLB(...)` in the bundle)

**C) Query/index**
- `loadAllSessions(limit?)` (reads JSONL files under the project dir, populates maps)
- `getAllTranscripts(limit?)` (find leaf nodes, return transcripts)
- `getTranscript(leafRecord)` (walk parent links)
- `getLastLog(sessionId)` (loads a single session file, returns latest non-sidechain transcript)

**D) File operations**
- `removeMessageByUuid(uuid)` (rewrites a JSONL file without that record)

### Why `$LB` is your best “extension seam”

Because nearly everything ultimately flows through:
- “resolve project dir + session file path”
- “append entries”
- “load and index sessions”

…you can get massive leverage by abstracting `$LB` behind an interface and swapping implementations.

## Recommended abstraction: define a “SessionStore” interface

If you want to safely “extend” this logic, avoid “subclass everything and override random helpers”. Instead, define a stable interface your application depends on.

Example shape (conceptual):

- `SessionStore.getProjectKey(projectPath): string`
- `SessionStore.getProjectDir(projectPath): string`
- `SessionStore.loadSession(sessionId | {jsonlPath? | url?}): LoadedSession`
- `SessionStore.append(entry): void`
- `SessionStore.queryLatestSession(projectPath): sessionId | null`
- `SessionStore.searchByTitle(projectPath, term): sessionId[]`

Then implement:

### Implementation 1: “CLI-compatible store”

This implementation matches the on-disk format described in the other docs:
- Uses `~/.claude/projects/<projectKey>/...`
- Writes JSONL entries matching the CLI schema
- Reads existing JSONL logs and builds indexes

### Implementation 2: “Wrapped store” (policy overrides)

Wrap the CLI-compatible store but override policy:
- project-key scheme (base64 vs `eu(...)`)
- additional record types (your own metadata entries)
- alternate “continue” selection (by tag, by branch, by custom title, by recency threshold, etc.)
- resume input formats (aliases like `--resume latest`, `--resume title:foo`, etc.)

This is the closest analogue to “extending query() and tool()”: you keep core mechanics but override selection/parsing rules.

## Specific extension points (with concrete “what to override”)

### 1) Project identity and keying (folder names)

Current CLI behavior:
- `eu(path) = path.replace(/[^a-zA-Z0-9]/g, "-")`
- project dir is `join(~/.claude/projects, eu(projectPath))`

If you need to abstract or swap this:
- Extract `ProjectKeyStrategy`:
  - `toKey(projectPath) => projectKey`
  - `fromKey(projectKey) => projectPath?` (optional; not always reversible)

Common alternate strategies:
- base64url-encoded project path (reversible)
- hash(projectPath) (short; collision resistant; not reversible)
- “repo id” derived from git remote URL + branch

Where this affects everything:
- `KH(...)`, `Ub()`, and all file location functions (`yNA`, `kGA`, `loadAllSessions`, etc.)

### 2) Session file selection for `--continue`

`--continue` boils down to: “load most recent conversation for this project”.

The CLI has a “load last log” pathway:
- `$LB.loadAllSessions(limit?)` scans JSONL files and indexes them.
- `$LB.getLastLog(sessionId)` and/or `Dl(void 0, void 0)` are used to pick a session.

If you want different behavior, define a `ContinuePolicy`:
- recency by `mtime` (filesystem)
- recency by last `timestamp` inside transcript
- ignore sessions that are sidechains
- ignore sessions that end in API errors
- prefer sessions with a specific tag (`tag=active`)

### 3) Resume argument parsing (`--resume`)

Print-mode parsing is explicit in `bc2(value)`:
- URL → remote ingress session (new random sessionId created)
- UUID → resume local session
- `.jsonl` path → treat file as input transcript

To extend this, create a `ResumeResolver` chain:
- `tryResolve(value) => {kind, sessionId?, jsonlPath?, url?} | null`

Add resolvers like:
- `latest` / `recent` keyword resolver
- `title:` prefix resolver
- `tag:` prefix resolver
- `branch:` resolver

### 4) Title/tag metadata as first-class indexed entities

The CLI stores session metadata in the same JSONL:
- `custom-title` records
- `tag` records

Parsing happens in:
- `bGA(jsonlPath)` (and `$LB.loadAllSessions`)

If you want more metadata types (e.g. “pinned”, “archived”, “owner”, “workspace-id”), copy the pattern:
- Create a new record type: `{ type: "pinned", sessionId, pinned: true }`
- Update the log parser to recognize it
- Update the in-memory index maps
- Update any filtering logic in resume pickers

### 5) Fork semantics (`--fork-session`)

Forking means:
- load messages from one session ID
- then switch the **writer’s session ID** to a new UUID so future writes go to a new JSONL file

If you want “fork by default unless …”, implement a `ForkPolicy`:
- always fork when resuming older than N days
- fork unless you pass `--no-fork`
- fork only when the resumed session has tag `template`

### 6) Truncation semantics (`--resume-session-at`)

In print mode, the CLI truncates by top-level record `uuid` (not nested `message.id`).

If you need stronger truncation:
- allow truncation by:
  - record `uuid`
  - nested assistant `message.id` (`msg_...`)
  - timestamp cutoff
  - “turn number” cutoff

Implement `TruncatePolicy(messages, selector) => messages`.

### 7) Remote persistence injection

`$LB` supports remote persistence via `setRemoteIngressUrl` + `persistToRemote`.

If you want to abstract it:
- extract a `RemoteSessionSink` interface:
  - `persist(sessionId, entry): Promise<boolean>`
- plug in sinks for:
  - HTTP ingress
  - local mirror
  - S3/object store
  - custom audit log system

## What “extending” looks like in practice

### Option A (in-source): subclass `$LB` and override methods

If you control the actual source (not just the bundled artifact), this is straightforward:
- `appendEntry` (routing + dedupe + redaction/persistence)
- `loadAllSessions` (custom parse/index rules)
- `getLastLog` / `getAllTranscripts` (custom “continue” semantics)
- any path builders (project key/root)

This is the closest to classical OOP “extend a class”.

### Option B (recommended): wrap the store and inject strategies

Instead of subclassing:
- Keep a core `CliCompatibleStore` implementation.
- Wrap it with a `PolicyStore` that applies:
  - keying strategy
  - filtering
  - resume resolution
  - fork/truncate policies

This keeps your custom logic isolated and resilient to upstream changes.

### Option C (runtime monkey patch): not recommended

Because `cli.js` is a single bundle:
- symbols are not cleanly exported
- names are minified/aliased
- patching is fragile across releases

Only do this if you’re building an experimental local fork and accept breakage each update.

## “If I were abstracting this today” (suggested module boundaries)

If you want an architecture you can repeatedly extend, use these boundaries:

1) `ProjectKeyStrategy`
2) `SessionLogIO` (read/write JSONL lines, including sidechain files)
3) `SessionIndex` (build maps: messages/summaries/titles/tags/snapshots)
4) `ResumeResolver`
5) `ContinuePolicy`
6) `ForkPolicy`
7) `TruncatePolicy`
8) `RemoteSessionSink` (optional)

Each boundary should be testable independently using fixture `.jsonl` files.

## Practical next step (so I can tailor the docs)

When you say you previously extended `query()` and `tool()`, which environment are you extending now?
- A fork of Claude Code CLI itself?
- A custom Node/TS app that reads `~/.claude/projects/`?
- A plugin/hook system that’s executed by Claude Code?

If you tell me which one, I’ll add a concrete “extension recipe” section (with the exact methods to override and a minimal adapter skeleton in TS).
