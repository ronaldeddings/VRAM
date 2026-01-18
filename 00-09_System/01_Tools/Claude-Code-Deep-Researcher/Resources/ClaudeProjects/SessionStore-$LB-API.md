# `$LB` Session Store API (Reverse‑Engineered) + TypeScript Interface

This document focuses on the bundled class named `$LB` in `Resources/ClaudeCodeSource/cli.js` and how to re-express it as a clean TypeScript interface and implementation.

`$LB` is the **central in-memory session database** plus the **JSONL persistence layer** for `~/.claude/projects/`.

Source extracts:
- `Resources/ClaudeProjects/_cli_class_$LB_extracted.txt`

Related docs:
- `Resources/ClaudeProjects/Directory-Layout.md`
- `Resources/ClaudeProjects/Record-Types.md`
- `Resources/ClaudeProjects/Resume-and-Continue.md`

---

## 1) What `$LB` stores in memory

The class owns five maps:

- `messages: Map<string, Record>`  
  Keyed by top-level record `uuid`. Contains transcript records and some “system-ish” records that are treated like messages.

- `summaries: Map<string, string>`  
  Keyed by `leafUuid` (record uuid at the end of a transcript).

- `customTitles: Map<string, string>`  
  Keyed by `sessionId`.

- `tags: Map<string, string>`  
  Keyed by `sessionId`.

- `fileHistorySnapshots: Map<string, Record>`  
  Keyed by `messageId` (not `uuid`). These correspond to `type: "file-history-snapshot"` records.

It also tracks:
- `didLoad: boolean` to avoid reloading all sessions repeatedly
- `sessionFile: string | null` to know the active session JSONL file path
- `remoteIngressUrl: string | null` (optional remote persistence)
- `pendingWriteCount` + `flushResolvers` to implement `flush()`

---

## 2) What `$LB` writes to disk

### 2.1 Writes are append-only JSONL

`appendEntry(entry)` appends `JSON.stringify(entry) + "\n"` to the correct file.

The active project directory is created if missing.

### 2.2 Which file gets appended?

From the extract, the write destination depends on record type and sidechain status:

- `summary`, `custom-title`, `tag`, `file-history-snapshot`, `queue-operation`  
  - appended to the **main session file** for the current session

- all other transcript records (`user`, `assistant`, `system`, `attachment`)  
  - appended only if the record uuid was not already written (dedupe set in `MLB(sessionId)`)
  - appended to:
    - main session file when `isSidechain` is false
    - `agent-<agentId>.jsonl` when `isSidechain` is true and `agentId` is present

### 2.3 Dedupe rule (“write-once uuid”)

`appendEntry` checks a per-session UUID set (`MLB(sessionId)`) and skips appending if the uuid is already present.

Practical meaning:
- If you re-emit a record object with the same `uuid`, the store will not append it again.
- This matters for streamed assistant chunks and rehydration paths.

---

## 3) Load behavior (`loadAllSessions`)

`loadAllSessions(limit?: number)`:
- Computes the current project directory.
- Lists `.jsonl` files in that directory.
- Optionally selects the most recent `limit` sessions by file `mtime`.
- Parses each selected JSONL file (best-effort).
- Merges all session maps into the store-level maps.

Important implications:
- The store becomes an **aggregate** of multiple sessions once you load all.
- Keys in maps may be overwritten by later-loaded sessions if collisions occur (uuid collisions are unlikely but logically possible).
- The bundle uses file `mtime` ordering to decide “most recent sessions”.

---

## 4) Transcript derivation (`getAllTranscripts`, `getLastLog`)

### 4.1 “Transcript root” selection

`getAllTranscripts(limit)`:
- loads sessions
- builds `allRecords = [...messages.values()]`
- computes `parentUuidSet = new Set(allRecords.map(r => r.parentUuid))`
- treats “leaf” records as those whose `uuid` is not referenced as a parent by any other record

Then for each leaf record it reconstructs the chain using `parentUuid` up to the root.

This produces a list of transcripts, each represented as `Record[]`.

### 4.2 “Last log”

`getLastLog(limit)`:
- loads sessions
- selects the most recent non-sidechain message by `timestamp`
- reconstructs its transcript chain and returns it

This is effectively one implementation of “continue most recent”.

---

## 5) Remote persistence (`remoteIngressUrl`)

If `remoteIngressUrl` is set:
- `appendEntry` may call `persistToRemote(sessionId, record)` for records that satisfy a predicate (`Rn1(record)` in the bundle).

Reverse-engineered intent:
- mirror session events to a remote endpoint for centralized storage or streaming.

For TS refactor:
- isolate this behind an interface; do not let it leak into core store behavior.

```ts
export interface RemoteIngressWriter<Record> {
  shouldSend(record: Record): boolean;
  send(sessionId: string, record: Record): Promise<void>;
}
```

---

## 6) TypeScript interface + CLI-compatible implementation sketch

### 6.1 Minimal record type

The store is generic over record shape but needs these fields:

```ts
export interface StoredRecord {
  type: string;
  uuid?: string;
  parentUuid?: string | null;
  sessionId?: string;
  timestamp?: string;
  isSidechain?: boolean;
  agentId?: string;
}
```

### 6.2 Store interface

```ts
export interface SessionStore<Record extends StoredRecord> {
  loadAllSessions(limit?: number): Promise<void>;
  appendEntry(record: Record): Promise<void>;
  flush(): Promise<void>;

  getLastLog(limit?: number): Promise<Record[] | null>;
  getAllTranscripts(limit?: number): Promise<Record[][]>;
}
```

### 6.3 CLI-compatible implementation boundaries

To keep your TS implementation close to `$LB` while still clean, inject these dependencies:

```ts
export interface SessionStoreDeps<Record extends StoredRecord> {
  runtime: { sessionId(): string; projectPath(): string }; // “what project bucket am I writing to?”
  locator: ProjectLocator;
  io: JsonlWriter & { ensureDir(path: string): Promise<void> };
  indexBuilder: SessionIndexBuilder<Record>;
  remote?: RemoteIngressWriter<Record>;
  shouldPersistToDisk(): boolean; // respects no-persistence, test mode, cleanup policy, etc.
  dedupe: { has(sessionId: string, uuid: string): Promise<boolean>; add(sessionId: string, uuid: string): Promise<void> };
}
```

This mirrors the bundled behavior but gives you clean extension points.

---

## 7) Extension guidance: how to “extend `$LB`” safely

Instead of subclassing:
- Treat `$LB` as a reference implementation and re-express it as an interface + composition.

Recommended extension seams:
- `ProjectKeyStrategy` (project bucket identity)
- `SessionIndexBuilder` (new record types / indexes)
- `RemoteIngressWriter` (mirroring)
- `DedupeStore` (in-memory, sqlite, bloom filter, etc.)
- `ContinuePolicy` (how “last log” is chosen)

For concrete recipes, see:
- `Resources/ClaudeProjects/Extending-Projects-and-Resume-Practical-Recipes.md`
