# Decomposing `Resources/ClaudeCodeSource/cli.js` into TypeScript (Projects + Resume Focus)

This document is a **developer-facing refactor guide** for turning the bundled `Resources/ClaudeCodeSource/cli.js` into clean, testable TypeScript modules — specifically the pieces that:
- decide “what project am I in?”
- map that to `~/.claude/projects/<projectKey>/`
- read/write session `.jsonl`
- implement `-c/--continue`, `-r/--resume`, `--fork-session`, `--resume-session-at`, `--rewind-files`

It is **reverse-engineered** from `cli.js` and meant for:
- extending/overriding resume semantics
- abstracting the project/session store (e.g., local JSONL vs remote, different key strategies)
- extracting those behaviors into TS functions/classes with clear boundaries

If you primarily want *how the JSONL works*, start with:
- `Resources/ClaudeProjects/Directory-Layout.md`
- `Resources/ClaudeProjects/Record-Types.md`
- `Resources/ClaudeProjects/Field-Reference.md`

If you want a ready-made “pluggable store” sketch, see:
- `Resources/ClaudeProjects/Extending-Projects-and-Resume-TS-Blueprint.md`

---

## 0) Ground truth: the few “global runtime facts” `cli.js` assumes

In the bundled CLI, there is a runtime singleton object (named `QQ` in the minified bundle) that acts as ambient context.

Extracted helpers show the important fields:
- `Resources/ClaudeProjects/_cli_function_TBA_extracted.txt` → `function TBA(){return QQ.cwd}`
- `Resources/ClaudeProjects/_cli_function_pQ_extracted.txt` → `function pQ(){return QQ.originalCwd}`
- `Resources/ClaudeProjects/_cli_function_W0_extracted.txt` → `function W0(){return QQ.sessionId}`
- `Resources/ClaudeProjects/_cli_function_r1_extracted.txt` → `function r1(){ try { return TI1() } catch { return pQ() } }` where `TI1()` delegates to `TBA()`

In plain terms:
- `QQ.originalCwd`: the directory the process started in (project “identity” for resume/picker and default project bucket)
- `QQ.cwd`: the “current” working directory as tracked by the CLI (changes when the CLI decides the working directory changed)
- `QQ.sessionId`: the current session UUID (changes on `--fork-session`, `--session-id`, etc.)

### TS refactor rule #1: make `RuntimeContext` explicit

When you refactor, you want to eliminate implicit reads of `QQ.*` and pass a context object:

```ts
export interface RuntimeContext {
  originalCwd: string;
  cwd: string;
  sessionId: string;
  now(): Date;
}
```

This is the single biggest move that makes the projects/resume logic testable.

---

## 1) On-disk model: what “projects” and “sessions” mean in the CLI

### 1.1 Projects root (`~/.claude/projects`)

From the extracted helpers:
- `Resources/ClaudeProjects/_cli_function_Ub_extracted.txt` → `function Ub(){ return join(mQ(), "projects") }`
- `Resources/ClaudeProjects/_cli_function_mQ_extracted.txt` is not separately extracted, but in `cli.js`:
  - `CLAUDE_CONFIG_DIR` overrides
  - otherwise `~/.claude`

TS module:

```ts
export interface ClaudePaths {
  configDir(): string;     // ~/.claude or $CLAUDE_CONFIG_DIR
  projectsRoot(): string;  // configDir()/projects
}
```

### 1.2 Project key strategy (`eu(projectPath)`)

`cli.js` uses a very simple “sanitize to filename-safe-ish” mapping:

```ts
// cli-compatible
export function toProjectKey(projectPath: string): string {
  return projectPath.replace(/[^a-zA-Z0-9]/g, "-");
}
```

This explains the directory names under `~/.claude/projects/` like:
- `-Users-<user>-...`
- `-Applications-Warp-app-Contents`

TS module:

```ts
export interface ProjectKeyStrategy {
  toKey(projectPath: string): string;
}
```

### 1.3 Project identity vs per-record `cwd`

Two different concepts exist simultaneously in the JSONL system:

1) **Project identity**: which `~/.claude/projects/<projectKey>/` bucket a session belongs to  
   - In practice: the CLI tends to bucket sessions by the process start dir (`originalCwd`) and/or an initial captured value.

2) **Per-record `cwd`**: the working directory at the moment that record/event was written  
   - This can change during a session (`cd` within tools, repo changes, etc.)

Your TS decomposition should preserve this distinction:
- Use `originalCwd` (or an explicit `projectPath`) to choose the project directory
- Use `cwd` when emitting per-record metadata

---

## 2) Core “projects + sessions” modules to extract

This section lists the minimum set of modules/classes that cover all project/resume behavior while being highly extensible.

### 2.1 `ProjectLocator` (paths only)

Responsibilities:
- compute projects root
- compute the project directory for a given `projectPath`
- compute the session JSONL file path(s)

```ts
export interface ProjectLocator {
  projectsRoot(): string;
  projectDir(projectPath: string): string;
  sessionJsonlPath(projectPath: string, sessionId: string): string;
  agentJsonlPath(projectPath: string, agentId: string): string;
}
```

Concrete CLI-compatible implementation:

```ts
export class CliCompatibleProjectLocator implements ProjectLocator {
  constructor(
    private readonly paths: ClaudePaths,
    private readonly keyStrategy: ProjectKeyStrategy,
    private readonly path = require("node:path")
  ) {}

  projectsRoot() {
    return this.path.join(this.paths.configDir(), "projects");
  }

  projectDir(projectPath: string) {
    return this.path.join(this.projectsRoot(), this.keyStrategy.toKey(projectPath));
  }

  sessionJsonlPath(projectPath: string, sessionId: string) {
    return this.path.join(this.projectDir(projectPath), `${sessionId}.jsonl`);
  }

  agentJsonlPath(projectPath: string, agentId: string) {
    return this.path.join(this.projectDir(projectPath), `agent-${agentId}.jsonl`);
  }
}
```

### 2.2 `JsonlReader` / `JsonlWriter`

`cli.js` reads JSONL “best effort”:
- parse line-by-line
- skip blank lines
- skip malformed JSON lines

TS interfaces:

```ts
export interface JsonlReader {
  readObjects<T extends object>(path: string): Promise<T[]>;
}

export interface JsonlWriter {
  appendObject(path: string, obj: object): Promise<void>;
}
```

Design choice:
- Keep JSONL IO tiny and pure; no domain logic here.
- Make “atomicity” a policy decision (sync append, flush, etc.)

### 2.3 `SessionIndexBuilder` (the `bGA(...)` idea)

In `cli.js`, indexing a session JSONL is not just “read messages”:
- It extracts multiple maps:
  - transcript events (`user`/`assistant`/`system`/`attachment`)
  - `summary` records
  - `custom-title` records
  - `tag` records
  - `file-history-snapshot` records

TS shape:

```ts
export interface SessionIndex<Record extends { type?: string }> {
  messages: Map<string, Record>;            // uuid -> record
  summaries: Map<string, string>;           // leafUuid -> summary
  customTitles: Map<string, string>;        // sessionId -> customTitle
  tags: Map<string, string>;                // sessionId -> tag
  fileHistorySnapshots: Map<string, Record>; // messageId -> snapshot record
}

export interface SessionIndexBuilder<Record extends { type?: string }> {
  build(jsonlPath: string): Promise<SessionIndex<Record>>;
}
```

This is the seam you extend if you add new record types that affect indexing.

### 2.4 `TranscriptReconstructor` (the `atA(...)` linked-list walk)

In `cli.js`, transcript order is reconstructed using `uuid` + `parentUuid`.

TS shape:

```ts
export interface LinkedRecord {
  uuid?: string;
  parentUuid?: string | null;
}

export interface TranscriptReconstructor<Record extends LinkedRecord> {
  reconstruct(all: Map<string, Record>, leaf: Record): Record[];
}
```

### 2.5 `SessionStore` (what `$LB` actually is)

In the bundle, `$LB` is the in-memory cache + persistence manager:
- holds maps (messages/summaries/titles/tags/snapshots)
- appends records to session JSONL files
- loads all sessions from the current project directory
- supports remote persistence (optional)
- exposes helpers like `getLastLog()` and `getAllTranscripts()`

Make this explicit and injectable (details in `Resources/ClaudeProjects/SessionStore-$LB-API.md`):

```ts
export interface SessionStore<Record extends { type?: string }> {
  loadAllSessions(limit?: number): Promise<void>;
  getLastLog(limit?: number): Promise<Record[] | null>;
  getAllTranscripts(limit?: number): Promise<Record[][]>;
  appendEntry(entry: Record): Promise<void>;
  flush(): Promise<void>;
}
```

### 2.6 `ResumeService` (the policy layer above the store)

The resume/continue/fork logic is *not* just “read a file”.

It includes:
- interpreting CLI args
- resolving resume targets (uuid vs title vs picker vs URL/path in print mode)
- loading messages + metadata + file-history snapshots
- optional truncation to `--resume-session-at`
- optional rewinding files to `--rewind-files`
- deciding whether to reuse or fork `sessionId`

TS shape:

```ts
export type ResumeArg = true | string | undefined;

export interface ResumeFlags {
  resume?: ResumeArg;
  continue?: boolean;
  forkSession?: boolean;
  resumeSessionAt?: string;
  rewindFiles?: string;
  printMode?: boolean;
}

export interface ResumeResult<Record> {
  sessionId: string;
  messages: Record[];
  fileHistorySnapshots: unknown[]; // or a typed structure
  projectPath: string;
}

export interface ResumeService<Record> {
  resolve(flags: ResumeFlags): Promise<ResumeResult<Record> | null>;
}
```

This is where most extensions happen cleanly.

---

## 3) Mapping the bundled symbols to extracted TS modules

This is the “where does this live after refactor?” map.

### 3.1 Paths + keys

Bundled helpers:
- `mQ()` → config dir (`$CLAUDE_CONFIG_DIR` or `~/.claude`)
- `Ub()` → `mQ()/projects`
- `eu(projectPath)` → sanitize projectPath to a key
- `KH(projectPath)` → `Ub()/eu(projectPath)`

TS module: `src/projects/paths.ts`
- `ClaudePaths`
- `ProjectKeyStrategy`
- `ProjectLocator`

### 3.2 JSONL parsing and indexing

Bundled helpers:
- `xv(path)` → read JSONL file and parse objects (skips invalid lines)
- `bGA(jsonlPath)` → build per-session maps (messages/summaries/titles/tags/snapshots)

TS module: `src/projects/jsonl.ts`
- `JsonlReader`, `JsonlWriter`
- `SessionIndexBuilder`

### 3.3 Transcript reconstruction

Bundled helpers:
- `atA(map, leaf)` → walk `parentUuid` chain up to root
- `vu3(records)` → “redact” fields when building picker/search results

TS module: `src/projects/transcripts.ts`
- `TranscriptReconstructor`
- `TranscriptSearchText` (optional)

### 3.4 Store/persistence

Bundled class:
- `$LB` (see extracted text in `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`)

TS module: `src/projects/sessionStore.ts`
- `SessionStore` interface
- `LocalJsonlSessionStore` implementation
- optional `RemoteIngressWriter`

### 3.5 Resume parsing and resolution

Bundled helpers (names from extracts):
- `bc2(...)` → parse resume argument (uuid vs picker vs file path/URL in print mode)
- `fGA(...)` → search by custom-title
- `Dl(...)` → load a conversation (most recent, or a selected one)
- `SH5(...)` → print-mode orchestration for resume/continue

TS module: `src/projects/resume.ts`
- `ResumeService`
- `ResumeTarget` union
- `ResumeResolver` chain

---

## 4) “Extending” the CLI behavior cleanly in TS

You asked for developer documentation on **how to extend these classes**, e.g.:
- previously extending `query()` and `tool()`
- now wanting to extend “projects and resume”

The reliable way to extend this part of the system is to create narrow interfaces and provide *composition* points, rather than subclassing the bundled implementation.

### 4.1 Extension point: project key strategy

Use cases:
- multi-worktree repos: unify multiple paths into one “project”
- stable IDs: hash paths to hide sensitive directory names
- portability: base64 or URL-safe encoding

Interface:

```ts
export interface ProjectKeyStrategy {
  toKey(projectPath: string): string;
}
```

Drop-in alternatives:
- `CliCompatibleProjectKeyStrategy` (sanitize non-alnum)
- `Sha256ProjectKeyStrategy` (stable, opaque)
- `RepoRootProjectKeyStrategy` (key on git root rather than cwd)

Compatibility warning:
- Changing keys will make existing sessions “disappear” from the picker unless you also implement a migration / multi-key lookup strategy.

### 4.2 Extension point: resume resolver chain

The CLI’s resume semantics are effectively “try these resolvers in order”:
- UUID → sessionId
- custom title match → sessionId
- otherwise picker
- in print mode: also allow `.jsonl` path or URL

Make this explicit:

```ts
export interface ResumeResolver {
  tryResolve(arg: ResumeArg, ctx: { projectPath: string; printMode: boolean }): Promise<ResumeTarget | null>;
}
```

Common custom resolvers:
- `tag:<value>` → resume latest session with that tag
- `latest` → same as `--continue`
- `path:<projectPath>#<sessionId>` → cross-project resume without `cd`

### 4.3 Extension point: transcript selection policy (`--continue`)

`--continue` means “pick the most recent transcript in the current project”.

But “most recent” could mean:
- by file `mtime` (what the CLI effectively does)
- by latest record timestamp (more semantically correct, but slower)
- excluding transcripts marked as errors (`subtype: api_error`, etc.)

Make it a pluggable policy:

```ts
export interface ContinuePolicy<Record> {
  pickMostRecent(transcripts: TranscriptSummary<Record>[]): TranscriptSummary<Record> | null;
}
```

### 4.4 Extension point: fork policy (`--fork-session`)

Forking is conceptually:
- load messages/history from old session
- choose a new `sessionId`
- ensure future appends go to the new session file
- optionally copy file-history backups from old session to new session

Make this explicit:

```ts
export interface ForkPolicy {
  shouldFork(flags: ResumeFlags): boolean;
  createForkSessionId(originalSessionId: string): string;
}
```

### 4.5 Extension point: truncation policy (`--resume-session-at`)

`cli.js` truncates by top-level record `uuid` (not nested `message.id`).

Make this a first-class API so you can:
- truncate by record uuid (CLI-compatible)
- truncate by message id (what the help text claims)
- truncate by N turns / timestamp

```ts
export interface TranscriptTruncator<Record> {
  truncate(records: Record[], opts: { recordUuid?: string; messageId?: string }): Record[];
}
```

---

## 5) Practical decomposition plan (do this in phases)

If you’re actually doing a real refactor, a staged plan minimizes risk:

### Phase 1: pure helpers (no IO)
- `toProjectKey(projectPath)`
- `isUuid(str)` (used by resume parsing)
- `reconstructTranscriptByParentUuid(recordsByUuid, leaf)`
- `truncateTranscriptByRecordUuid(records, uuid)`

Deliverable: 100% unit-tested helpers (no filesystem).

### Phase 2: JSONL IO and indexing
- `JsonlReader.readObjects(path)`
- `SessionIndexBuilder.build(jsonlPath)`

Deliverable: fixture-based tests using synthetic JSONL files.

### Phase 3: session store (local)
- implement `LocalJsonlSessionStore` equivalent to `$LB`
- implement `loadAllSessions(limit?)` and `appendEntry(entry)`
- keep remote ingress optional/disabled

Deliverable: integration tests writing to a temp directory.

### Phase 4: resume service
- implement `resolve({resume, continue, forkSession, ...})`
- implement interactive picker boundary behind an interface

Deliverable: deterministic tests for `--continue`, `--resume <uuid>`, `--fork-session`, `--resume-session-at`.

### Phase 5: file history rewind/copy integration
- model `file-history-snapshot` records
- implement “rewind files” as a service (filesystem side effects)
- implement “copy backups on fork” (hardlink/copy fallback)

Deliverable: integration tests using temp files (be careful with perms).

---

## 6) Where to look next

Companion docs:
- `Resources/ClaudeProjects/SessionStore-$LB-API.md`
- `Resources/ClaudeProjects/CLI-Resume-Flow.md`

Bundled extractions (useful when mapping):
- `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_bc2_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_SH5_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_Dl_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_bGA_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_xv_extracted.txt`
