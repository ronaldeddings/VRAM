# `cli.js` Symbols → TypeScript Signatures (Projects/Resume Subsystem)

This document is a **translation guide**: it maps the important bundled `cli.js` symbols involved in `~/.claude/projects/` + resume/continue into explicit TypeScript signatures and responsibilities.

It’s intentionally detailed so you can:
- re‑implement the behavior in TS
- add extension points (policies/resolvers)
- avoid common “minified bundle” misinterpretations

Primary source: `Resources/ClaudeCodeSource/cli.js`  
Convenience extracts:
- `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_TBA_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_pQ_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_W0_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_KH_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_Ub_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_xv_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_bGA_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_bc2_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_Dl_extracted.txt`
- `Resources/ClaudeProjects/_cli_function_SH5_extracted.txt`

---

## 1) Runtime context (`QQ`) accessors

Bundled helpers:
- `TBA()` → `QQ.cwd`
- `pQ()` → `QQ.originalCwd`
- `W0()` → `QQ.sessionId`
- `r1()` → prefers `QQ.cwd`, falls back to `QQ.originalCwd`

TypeScript:

```ts
export interface RuntimeContext {
  cwd: string;         // current working directory tracked by CLI
  originalCwd: string; // cwd at process startup
  sessionId: string;   // current active session ID
}

export interface RuntimeContextProvider {
  get(): RuntimeContext;
  setSessionId(sessionId: string): void;
  setCwd(cwd: string): void;
}
```

Why a provider?
- The bundled CLI mutates session id during resume/fork.
- The CLI can also update “tracked cwd”.

---

## 2) Project directory resolution (`mQ`, `Ub`, `eu`, `KH`)

Bundled functions:
- `mQ(): string` → `${CLAUDE_CONFIG_DIR || ~/.claude}`
- `Ub(): string` → `join(mQ(), "projects")`
- `eu(projectPath: string): string` → `projectPath.replace(/[^a-zA-Z0-9]/g, "-")`
- `KH(projectPath: string): string` → `join(Ub(), eu(projectPath))`

TypeScript:

```ts
export interface ClaudePaths {
  configDir(): string;     // ~/.claude or $CLAUDE_CONFIG_DIR
  projectsRoot(): string;  // configDir()/projects
}

export interface ProjectKeyStrategy {
  toKey(projectPath: string): string;
}

export interface ProjectLocator {
  projectDir(projectPath: string): string; // projectsRoot()/toKey(projectPath)
}
```

---

## 3) JSONL parsing (`xv`)

Bundled behavior (high level):
- read a `.jsonl` file
- split into lines
- parse JSON per line
- skip invalid JSON lines

TypeScript:

```ts
export interface JsonlReader {
  readObjects<T extends object>(path: string): Promise<T[]>;
}
```

Correctness note:
- Treat malformed lines as ignorable; don’t fail the entire read.

---

## 4) Index building (`bGA`)

Bundled behavior:
- reads a session JSONL file
- returns multiple maps used for resume/picker:
  - `messages` (uuid → record) for record types: `user|assistant|system|attachment`
  - `summaries` (leafUuid → summary)
  - `customTitles` (sessionId → customTitle)
  - `tags` (sessionId → tag)
  - `fileHistorySnapshots` (messageId → snapshot record)

TypeScript:

```ts
export type RecordType =
  | "user"
  | "assistant"
  | "system"
  | "attachment"
  | "summary"
  | "custom-title"
  | "tag"
  | "file-history-snapshot"
  | "queue-operation"
  | string;

export interface JsonlRecordBase {
  type: RecordType;
  uuid?: string;
  parentUuid?: string | null;
  sessionId?: string;
  timestamp?: string;
  cwd?: string;
  isSidechain?: boolean;
  agentId?: string;
  message?: unknown;
}

export interface SessionIndex<Record extends JsonlRecordBase> {
  messages: Map<string, Record>;
  summaries: Map<string, string>;
  customTitles: Map<string, string>;
  tags: Map<string, string>;
  fileHistorySnapshots: Map<string, Record>;
}

export interface SessionIndexBuilder<Record extends JsonlRecordBase> {
  build(jsonlPath: string): Promise<SessionIndex<Record>>;
}
```

---

## 5) Session store (`class $LB`)

Reference extract:
- `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`

In TypeScript, treat `$LB` as “the LocalJsonlSessionStore reference implementation”.

Suggested interface (minimal):

```ts
export interface SessionStore<Record extends JsonlRecordBase> {
  loadAllSessions(limit?: number): Promise<void>;
  appendEntry(record: Record): Promise<void>;
  flush(): Promise<void>;

  getAllTranscripts(limit?: number): Promise<Record[][]>;
  getLastLog(limit?: number): Promise<Record[] | null>;
}
```

Suggested additional methods (if you need CLI‑level fidelity):

```ts
export interface SessionStoreAdvanced<Record extends JsonlRecordBase> extends SessionStore<Record> {
  removeMessageByUuid(uuid: string): Promise<void>;
  insertMessageChain(
    chain: Record[],
    isSidechain?: boolean,
    agentId?: string,
    /* unknown */ unused?: unknown,
    parentUuidOverride?: string
  ): Promise<void>;
  insertFileHistorySnapshot(messageId: string, snapshot: unknown, isSnapshotUpdate: boolean): Promise<void>;
  insertQueueOperation(record: Record): Promise<void>;
  setRemoteIngressUrl(url: string): void;
}
```

If you’re implementing extensions, prefer composition (interfaces) over subclassing.

See:
- `Resources/ClaudeProjects/SessionStore-$LB-API.md`

---

## 6) Resume target parsing (`bc2`)

Extract:
- `Resources/ClaudeProjects/_cli_function_bc2_extracted.txt`

Bundled behavior:
- If `value` parses as a URL: treat as remote ingress, generate a fresh session id
- Else if `value` is a UUID: treat as a session id
- Else if `value` ends with `.jsonl`: treat as a local JSONL path, generate a fresh session id
- Else: invalid

TypeScript:

```ts
export type ResumeParseResult =
  | { kind: "remoteIngress"; sessionId: string; url: string }
  | { kind: "sessionId"; sessionId: string }
  | { kind: "jsonlPath"; sessionId: string; path: string };

export interface ResumeTargetParser {
  parse(value: string): ResumeParseResult | null;
}
```

Extension point:
- Add additional parse forms without changing core resume service (e.g. `tag:foo`, `latest`, `path:<proj>#<sid>`).

---

## 7) Conversation loader (`Dl`)

Extract:
- `Resources/ClaudeProjects/_cli_function_Dl_extracted.txt`

Bundled behavior (normalized description):

Inputs:
- `Dl(A, Q)` where:
  - `A` is either:
    - `undefined` meaning “most recent”
    - `string` meaning `sessionId`
    - an already-built transcript object (from picker)
  - `Q` is an optional `.jsonl` path (print-mode / external transcript input)

Outputs:
- `null` when nothing found
- otherwise:
  - `messages: Record[]`
  - `fileHistorySnapshots: Snapshot[] | undefined`
  - `sessionId: string`

TypeScript:

```ts
export interface LoadedConversation<Record> {
  sessionId: string;
  messages: Record[];
  fileHistorySnapshots?: unknown[];
}

export interface ConversationLoader<Record> {
  loadMostRecent(): Promise<LoadedConversation<Record> | null>;
  loadBySessionId(sessionId: string): Promise<LoadedConversation<Record> | null>;
  loadFromJsonlPath(jsonlPath: string, sessionIdForWrite: string): Promise<LoadedConversation<Record> | null>;
}
```

Important side effects:
- The bundled implementation performs additional normalization/copying steps (e.g. file-history integration on resume).
- In TS, isolate those as separate services so loader remains “read-only”.

---

## 8) Print-mode orchestration (`SH5`)

Extract:
- `Resources/ClaudeProjects/_cli_function_SH5_extracted.txt`

Bundled behavior:
- If `--continue`: load most recent conversation and return its messages.
- Else if `--teleport`: load teleport log and return its messages.
- Else if `--resume`:
  - parse the resume target via `bc2`
  - optional remote hydration bootstrap if URL
  - load conversation via `Dl`
  - optional truncation via `--resume-session-at` (matches top-level record `uuid`)
  - optional set current session id (unless `--fork-session`)
  - return messages
- Else: return startup messages (`WU("startup")`)

TypeScript:

```ts
export interface PrintModeFlags {
  continue?: boolean;
  resume?: true | string;
  forkSession?: boolean;
  resumeSessionAt?: string;
  teleport?: string | boolean;
}

export interface PrintResumeOrchestrator<Record> {
  buildInitialMessages(flags: PrintModeFlags): Promise<Record[]>;
}
```

Compatibility gotcha:
- The bundled truncation compares `record.uuid === resumeSessionAt`, despite the help text referencing `message.id`.

---

## 9) “Don’t miss this” list (common refactor pitfalls)

If you’re converting `cli.js` into TS, these are the easy-to-miss details that affect compatibility:

- `--resume` has 3 states: `undefined` (no resume), `true` (open picker), `string` (value provided).
- `--resume-session-at` truncates by top-level record `uuid`, not nested `message.id`.
- Sessions are bucketed by a “project identity” path (project directory), but records still carry per-event `cwd`.
- Transcript reconstruction depends on `uuid`/`parentUuid` linkage; JSONL file order is not the authoritative transcript order.
- File rewind depends on both JSONL snapshots and an external file-history backup store under the config directory.

If you need a “system architecture” view, see:
- `Resources/ClaudeProjects/CLI-JS-to-TS-Decomposition.md`
