# TypeScript Blueprint: Pluggable Project/Session Store

This is a concrete “copy-and-adapt” blueprint for implementing a Claude Code compatible project/session store with extension points.

It is based on the behaviors in `Resources/ClaudeCodeSource/cli.js`, especially:
- project keying (`eu`)
- projects root (`Ub`)
- JSONL parsing (`bGA`)
- resume parsing (`bc2`)
- load/normalize (`Dl`)
- print-mode resume handler (`SH5`)
- the session store class (`$LB`)

You can use this blueprint to:
- build a standalone Node/TS tool that reads and writes `~/.claude/projects/`
- implement custom resume semantics (`--resume tag:...`, `--resume latest`, etc.)
- implement custom project-key strategies (base64, hashing, repo IDs)

---

## Core data models (minimal)

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
  // many records have uuid/sessionId/timestamp etc, but not all do.
  uuid?: string;
  sessionId?: string;
  timestamp?: string;
  parentUuid?: string | null;
  isSidechain?: boolean;
  agentId?: string;
  message?: unknown;
}
```

---

## Project keying and location

```ts
export interface ProjectKeyStrategy {
  toKey(projectPath: string): string;
}

export class CliCompatibleProjectKeyStrategy implements ProjectKeyStrategy {
  toKey(projectPath: string): string {
    return projectPath.replace(/[^a-zA-Z0-9]/g, "-");
  }
}

export interface ClaudeConfigDirProvider {
  getClaudeConfigDir(): string; // e.g. ~/.claude
}

export class DefaultClaudeConfigDirProvider implements ClaudeConfigDirProvider {
  getClaudeConfigDir(): string {
    const os = require("node:os");
    const path = require("node:path");
    return process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude");
  }
}

export interface ProjectLocator {
  projectsRoot(): string;
  projectDir(projectPath: string): string;
}

export class CliCompatibleProjectLocator implements ProjectLocator {
  constructor(
    private readonly configDir: ClaudeConfigDirProvider,
    private readonly keyStrategy: ProjectKeyStrategy,
    private readonly path = require("node:path")
  ) {}

  projectsRoot(): string {
    return this.path.join(this.configDir.getClaudeConfigDir(), "projects");
  }

  projectDir(projectPath: string): string {
    return this.path.join(this.projectsRoot(), this.keyStrategy.toKey(projectPath));
  }
}
```

---

## JSONL IO (read/write lines safely)

```ts
export interface JsonlIO {
  readLines(filePath: string): Promise<string[]>;
  appendLine(filePath: string, line: string): Promise<void>;
  ensureDir(dirPath: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
}

export class NodeJsonlIO implements JsonlIO {
  private readonly fs = require("node:fs/promises");
  private readonly fsSync = require("node:fs");
  private readonly path = require("node:path");

  async readLines(filePath: string): Promise<string[]> {
    if (!this.fsSync.existsSync(filePath)) return [];
    const text = await this.fs.readFile(filePath, "utf-8");
    return text.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
  }

  async appendLine(filePath: string, line: string): Promise<void> {
    await this.ensureDir(this.path.dirname(filePath));
    await this.fs.appendFile(filePath, line.endsWith("\n") ? line : line + "\n", "utf-8");
  }

  async ensureDir(dirPath: string): Promise<void> {
    await this.fs.mkdir(dirPath, { recursive: true });
  }

  async exists(filePath: string): Promise<boolean> {
    return this.fsSync.existsSync(filePath);
  }
}
```

---

## Index builder (CLI-compatible parsing of JSONL)

This is the `bGA(...)` idea from `cli.js`: split a JSONL file into multiple maps.

```ts
export interface SessionIndex {
  messages: Map<string, JsonlRecordBase>;
  summaries: Map<string, string>; // leafUuid -> summary
  customTitles: Map<string, string>; // sessionId -> title
  tags: Map<string, string>; // sessionId -> tag
  fileHistorySnapshots: Map<string, JsonlRecordBase>; // messageId -> snapshot record
}

export class CliCompatibleIndexBuilder {
  async buildFromJsonl(jsonlPath: string, io: JsonlIO): Promise<SessionIndex> {
    const lines = await io.readLines(jsonlPath);
    const messages = new Map<string, JsonlRecordBase>();
    const summaries = new Map<string, string>();
    const customTitles = new Map<string, string>();
    const tags = new Map<string, string>();
    const fileHistorySnapshots = new Map<string, JsonlRecordBase>();

    for (const line of lines) {
      let obj: any;
      try {
        obj = JSON.parse(line);
      } catch {
        continue;
      }

      const type = obj?.type;
      if (type === "user" || type === "assistant" || type === "system" || type === "attachment") {
        if (obj.uuid) messages.set(obj.uuid, obj);
        continue;
      }
      if (type === "summary" && obj.leafUuid && typeof obj.summary === "string") {
        summaries.set(obj.leafUuid, obj.summary);
        continue;
      }
      if (type === "custom-title" && obj.sessionId && typeof obj.customTitle === "string") {
        customTitles.set(obj.sessionId, obj.customTitle);
        continue;
      }
      if (type === "tag" && obj.sessionId && typeof obj.tag === "string") {
        tags.set(obj.sessionId, obj.tag);
        continue;
      }
      if (type === "file-history-snapshot" && obj.messageId) {
        fileHistorySnapshots.set(obj.messageId, obj);
        continue;
      }
    }

    return { messages, summaries, customTitles, tags, fileHistorySnapshots };
  }
}
```

---

## Resume resolution (pluggable resolvers)

This is the extensible version of `bc2(...)` + “title search”.

```ts
export type ResumeTarget =
  | { kind: "sessionId"; sessionId: string }
  | { kind: "jsonlPath"; path: string }
  | { kind: "remoteIngress"; url: string; sessionId: string }
  | { kind: "picker"; initialQuery?: string };

export interface ResumeResolverContext {
  projectPath: string;
}

export interface ResumeResolver {
  tryResolve(value: string | true | undefined, ctx: ResumeResolverContext): Promise<ResumeTarget | null>;
}

export class UuidResumeResolver implements ResumeResolver {
  async tryResolve(value: string | true | undefined): Promise<ResumeTarget | null> {
    if (typeof value !== "string") return null;
    const uuid = value.trim();
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(uuid)) return null;
    return { kind: "sessionId", sessionId: uuid };
  }
}

export class JsonlPathResumeResolver implements ResumeResolver {
  async tryResolve(value: string | true | undefined): Promise<ResumeTarget | null> {
    if (typeof value !== "string") return null;
    const v = value.trim();
    if (!v.endsWith(".jsonl")) return null;
    return { kind: "jsonlPath", path: v };
  }
}

export class UrlResumeResolver implements ResumeResolver {
  constructor(private readonly uuidFactory: () => string) {}
  async tryResolve(value: string | true | undefined): Promise<ResumeTarget | null> {
    if (typeof value !== "string") return null;
    try {
      const url = new URL(value.trim());
      return { kind: "remoteIngress", url: url.href, sessionId: this.uuidFactory() };
    } catch {
      return null;
    }
  }
}
```

Add your own resolvers:
- `KeywordResolver` (`latest`, `recent`)
- `PrefixResolver` (`tag:foo`, `title:bar`)

---

## Continue policy (choose which “most recent” session)

```ts
export interface ContinuePolicy {
  pickSessionId(candidates: Array<{ sessionId: string; modifiedMs: number; tag?: string; title?: string }>): string | null;
}

export class MostRecentlyModifiedContinuePolicy implements ContinuePolicy {
  pickSessionId(candidates: Array<{ sessionId: string; modifiedMs: number }>): string | null {
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => b.modifiedMs - a.modifiedMs)[0].sessionId;
  }
}
```

---

## Truncation and forking

```ts
export interface ForkPolicy {
  shouldForkOnResume(args: { resume: boolean; forkFlag: boolean }): boolean;
}

export class CliCompatibleForkPolicy implements ForkPolicy {
  shouldForkOnResume(args: { resume: boolean; forkFlag: boolean }): boolean {
    return args.resume && args.forkFlag;
  }
}

export interface TruncatePolicy {
  truncate(messages: JsonlRecordBase[], selector?: { uuid?: string }): JsonlRecordBase[];
}

export class TruncateByRecordUuidPolicy implements TruncatePolicy {
  truncate(messages: JsonlRecordBase[], selector?: { uuid?: string }): JsonlRecordBase[] {
    const uuid = selector?.uuid;
    if (!uuid) return messages;
    const idx = messages.findIndex((m) => m.uuid === uuid);
    if (idx < 0) return messages;
    return messages.slice(0, idx + 1);
  }
}
```

---

## Putting it together: a `ResumeService`

```ts
export class ResumeService {
  constructor(
    private readonly resolvers: ResumeResolver[],
    private readonly indexBuilder: CliCompatibleIndexBuilder,
    private readonly io: JsonlIO
  ) {}

  async resolve(value: string | true | undefined, ctx: ResumeResolverContext): Promise<ResumeTarget> {
    if (value === true || value === undefined) return { kind: "picker" };
    for (const resolver of this.resolvers) {
      const target = await resolver.tryResolve(value, ctx);
      if (target) return target;
    }
    return { kind: "picker", initialQuery: String(value) };
  }
}
```

From here you implement `SessionStore.load(...)` that:
1. Resolves a `ResumeTarget`
2. Loads the JSONL (from sessionId -> path, or direct jsonlPath)
3. Parses into maps
4. Returns ordered messages (by parent chain or file order)
5. Applies fork/truncate policies as needed

---

## What to implement first

If you want immediate wins:
1) implement a CLI-compatible `ProjectLocator`
2) implement JSONL parsing (`CliCompatibleIndexBuilder`)
3) implement a resolver chain for `--resume`
4) implement a `ContinuePolicy` for “most recent”

Then add the “nice” features:
- tag/title based selection
- fork policies
- remote ingress support

