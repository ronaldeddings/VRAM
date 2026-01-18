# Practical Extension Recipes (Projects + Resume)

This is “do-this-next” developer documentation for extending the **projects + resume** subsystem described in:
- `Resources/ClaudeProjects/Extending-Projects-and-Resume.md`
For deeper reference material while implementing, also see:
- `Resources/ClaudeProjects/CLI-Resume-Flow.md`
- `Resources/ClaudeProjects/CLI-JS-to-TS-Decomposition.md`
- `Resources/ClaudeProjects/cli.js-Symbols-to-TypeScript-Signatures.md`

All guidance is based on the bundled implementation in:
- `Resources/ClaudeCodeSource/cli.js`

Because `cli.js` is a single bundled artifact, you have three realistic extension paths:
1) **Fork/patch the CLI** (edit the bundle or, ideally, edit the original source and rebuild).
2) **Write your own tool/app** that *implements compatible storage semantics* for `~/.claude/projects/` (recommended for long-term stability).
3) **Runtime monkey-patching** of the bundle (only for experiments; high breakage risk).

This file is explicit about which functions/classes are involved, what to override, and what to keep compatible.

---

## Recipe 0: Identify the seams you’re extending

Before writing code, decide which of these you’re changing:

### A) Project keying / directory layout

The CLI uses:
- `eu(projectPath)`: sanitize to `[A-Za-z0-9-]` with `-` replacements
- `Ub()`: projects root directory (`~/.claude/projects` unless `CLAUDE_CONFIG_DIR` changes it)
- `KH(projectPath)`: project directory (`join(Ub(), eu(projectPath))`)

If you change this, you are changing **where sessions are found on disk**.

### B) Session selection (“continue” and “resume” policy)

Selection logic is a combination of:
- “most recent session in this project”
- `custom-title`/`tag` indexing and search
- CLI flags: `--continue`, `--resume`, `--fork-session`, `--resume-session-at`, `--rewind-files`

If you change this, you’re changing **which transcript** gets loaded, and whether subsequent writes fork.

### C) Parsing and indexing of JSONL

The CLI parses JSONL into maps:
- `messages` for `user|assistant|system|attachment`
- `summaries`, `customTitles`, `tags`, `fileHistorySnapshots`

If you change this, you’re changing **what metadata exists** and how the picker/search behaves.

### D) Write path (append + dedupe + routing)

All writes flow through the store class (`$LB`) and its `appendEntry(...)`.

If you change this, you can implement:
- new record types
- different dedupe semantics
- alternate sidechain routing rules
- additional sinks (mirror to another DB)

---

## Recipe 1 (Recommended): Build a reusable “SessionStore” library in TypeScript

This is the safest, most maintainable approach:
- You do **not** depend on private CLI internals.
- You can still read/write the exact same on-disk format as Claude Code.
- You can version and test your own behaviors (resume resolvers, project keying, etc.).

### Step 1: Create a folder for your library

Example structure (in your own repo):

```
src/claudeProjects/
  ProjectKeyStrategy.ts
  ResumeResolver.ts
  SessionStore.ts
  JsonlStore.ts
  CliCompatibleIndex.ts
  policies/
    ContinuePolicy.ts
    ForkPolicy.ts
    TruncatePolicy.ts
```

### Step 2: Implement CLI-compatible pathing by default

Match the CLI’s defaults:
- config dir: `process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude")`
- projects root: `<configDir>/projects`
- project key: `projectPath.replace(/[^a-zA-Z0-9]/g, "-")`

Then add a strategy interface so you can swap it.

### Step 3: Implement JSONL parsing into indexes

At minimum, replicate `bGA(jsonlPath)` behavior from `cli.js`:
- Treat `type in {user, assistant, system, attachment}` as “message-like transcript events”.
- Parse metadata types: `summary`, `custom-title`, `tag`, `file-history-snapshot`.

### Step 4: Implement resume selection policies

Implement a resolver chain similar to `bc2()` + title search:
- UUID → session
- `.jsonl` path → load that file as a transcript input
- URL → remote ingress (optional; you can support this later)
- exact custom-title match → session
- fallback → open picker / return candidates

### Step 5: Add extension points

Expose explicit plugin points (composition):
- `ProjectKeyStrategy`
- `ResumeResolver[]`
- `ContinuePolicy`
- `ForkPolicy`
- `TruncatePolicy`

This gives you the “extend query()/tool()” feel: you override the policy object rather than forking core store mechanics.

---

## Recipe 2: Fork/patch the CLI (edit in-source)

If you control the upstream source, implement extension points directly in the codebase before bundling.

### Step 1: Extract the “store” into a module

In `cli.js`, the central store class is `class $LB` (see `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`).

You want to move it to something like:

```
src/sessionStore/SessionStore.ts
```

and explicitly inject dependencies:
- filesystem implementation (`jA()` in the bundle)
- config dir provider (`mQ()`)
- project key function (`eu()`)
- session id provider (`W0()`)
- remote persistence sink (`DLB(...)`)

### Step 2: Replace global helpers with injected strategies

Concrete changes:
- Replace `function eu(...)` with `ProjectKeyStrategy.toKey(projectPath)`
- Replace `function KH(...)` with `ProjectLocator.projectDir(projectPath)`
- Replace calls to `Ub()` with `ProjectLocator.projectsRoot()`

### Step 3: Patch “resume” and “continue” selectors

The CLI uses:
- `Dl(...)` to load a session’s messages into runtime shape.
- `SH5(...)` for non-interactive `--print` mode resume/continue.

Introduce a `ResumeService` module that:
- parses `--resume` values (resolver chain)
- selects sessions (continue policy)
- applies `--fork-session` + `--resume-session-at` truncation

Then make `Dl` / `SH5` call into `ResumeService`.

### Step 4: Add new record types safely

If you add record types, keep these invariants:
- Unknown record types must not break the parser.
- “message-like” events are only those you want to be part of the transcript chain.
- Metadata records should be indexable without being in the message chain.

---

## Recipe 3: Customize resume inputs (add your own `--resume` syntax)

Goal: allow things like:
- `--resume latest`
- `--resume title:\"My Session\"`
- `--resume tag:incident`
- `--resume branch:main`

### Implement as a resolver chain

Create resolvers ordered by specificity:
1. `UrlResolver` (if it parses as URL)
2. `JsonlPathResolver` (endsWith `.jsonl`)
3. `UuidResolver` (UUID regex)
4. `KeywordResolver` (`latest`, `recent`, `last`)
5. `PrefixResolver` (`title:`, `tag:`, etc.)
6. `FallbackResolver` (picker)

Resolver output should be normalized to one of:
- `{ kind: "sessionId", sessionId }`
- `{ kind: "jsonlPath", path }`
- `{ kind: "remoteIngress", url, sessionId }`
- `{ kind: "picker", initialQuery }`

This is exactly how to “extend resume without rewriting storage”.

---

## Recipe 4: Customize “continue” behavior (most recent session)

The CLI’s effective `--continue` meaning is:
- pick the most recently modified session in this project
- load it
- optionally keep same sessionId unless forked

Common customizations:

### A) Ignore “sidechain” sessions

Filter candidate transcripts where the first record indicates `isSidechain: true`.

### B) Ignore sessions with API errors at end

If the last few records are `system` with `subtype: "api_error"` (or summaries starting with “API Error”), skip.

### C) Prefer sessions tagged “active”

If your parser indexes `tag` records (CLI does), you can prefer tagged sessions.

### D) Prefer sessions whose `cwd` matches current repo/worktree

Some logs may include `cwd` for the session; prefer exact match.

Implement these as a `ContinuePolicy` that takes a list of candidate sessions and returns one.

---

## Recipe 5: Add/extend indexing (custom-title and tag)

The CLI stores these as JSONL entries written by appending:
- `{ type: "custom-title", customTitle, sessionId }`
- `{ type: "tag", tag, sessionId }`

and parses them into maps (`sessionId -> value`).

To extend:
- Add additional metadata record types like `pinned`, `archived`, `owner`, `workspace`.
- Update your parser/index builder to store them in maps.
- Update resume selection to incorporate them.

---

## Recipe 6: Fork semantics (new session id after resume)

Fork is a policy decision:
- Load messages from “old session”.
- Choose a **new session id** for writes.

If you implement this outside the CLI:
- Keep the loaded transcript as history.
- When you begin writing new events, set `sessionId` to the new id.
- Optionally copy file history artifacts if you also implement file-history snapshots.

This gives you “branch conversations” reliably.

---

## Recipe 7: Truncation semantics (`--resume-session-at`)

The CLI truncates by **record uuid** (top-level `uuid`), not nested `message.id`.

If you want better truncation options:
- support truncation by:
  - record uuid
  - nested assistant message id (`message.id`)
  - timestamp cutoff
  - “turn number”

Write a `TruncatePolicy(messages, selector)` and apply it immediately after loading a session and before sending to the model.

---

## Recipe 8: “Where to change what” cheat sheet

If you’re patching the CLI:
- Pathing / project identity: `eu()`, `Ub()`, `KH()`
- Storage mechanics: `class $LB` and `rW()`
- Print-mode resume/continue: `SH5(...)`
- Resume parsing: `bc2(...)`
- Session load normalization: `Dl(...)`
- Title search: `fGA(...)`
- JSONL parse to maps: `bGA(...)`, `yn1(...)`

If you’re writing your own tool:
- Implement the same behaviors as above behind your own interfaces.
