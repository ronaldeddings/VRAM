import { availableCapability, unavailableCapability } from "../../core/types/host.js";
import type {
  HostCapabilities,
  HostClock,
  HostCrypto,
  HostFilesystem,
  HostLifecycle,
  HostNetwork,
  HostProcess,
  HostRandom,
  HostSecrets,
  HostStorage,
  HostTelemetry,
  StorageNamespace
} from "../../core/types/host.js";
import { StorageConflictError, StorageCorruptionDetectedError } from "../../core/types/host.js";
import type { TelemetryDropStats, TelemetryEventEnvelopeV1 } from "../../core/types/observability.js";
import crypto from "node:crypto";
import { execFile as execFileCb } from "node:child_process";
import { watch as watchFs } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { promisify } from "node:util";

const execFile = promisify(execFileCb);

export type NodeHostOptions = {
  configDir?: string;
  storageSubdir?: string;
  enableKeychain?: boolean;
  enablePlaintextSecretFallback?: boolean;
  allowSubprocess?: boolean;
  envAllowlist?: readonly string[];
};

function defaultConfigDir(): string {
  return process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude");
}

function baseStorageDir(options: NodeHostOptions): string {
  const root = options.configDir ?? defaultConfigDir();
  const subdir = options.storageSubdir ?? path.join("rewrite", "storage-v1");
  return path.join(root, subdir);
}

function encodeStorageSegment(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeStorageSegment(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function namespaceToPathParts(ns: StorageNamespace): string[] {
  switch (ns.scope) {
    case "app":
      return ["app"];
    case "workspace":
      return ["workspace", ns.workspaceId ?? "unknown"];
    case "session":
      return ["session", ns.sessionId ?? "unknown"];
  }
}

function storageKeyPath(rootDir: string, ns: StorageNamespace, key: string): string {
  const parts = namespaceToPathParts(ns);
  const safeKey = encodeStorageSegment(key);
  return path.join(rootDir, ...parts, `${safeKey}.json`);
}

type StoredFile = { version: string; value: string; updatedAtMs: number };

function computeVersion(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

async function ensureParentDir(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function atomicWriteFile(filePath: string, data: string, mode?: number): Promise<void> {
  await ensureParentDir(filePath);
  const dir = path.dirname(filePath);
  const tmp = path.join(dir, `.tmp-${path.basename(filePath)}-${crypto.randomUUID()}`);
  await fs.writeFile(tmp, data, { encoding: "utf8", mode });
  await fs.rename(tmp, filePath);
}

async function atomicWriteFileBytes(filePath: string, data: Uint8Array, mode?: number): Promise<void> {
  await ensureParentDir(filePath);
  const dir = path.dirname(filePath);
  const tmp = path.join(dir, `.tmp-${path.basename(filePath)}-${crypto.randomUUID()}`);
  await fs.writeFile(tmp, data, { mode });
  await fs.rename(tmp, filePath);
}

function createNodeClock(): HostClock {
  const t0Wall = Date.now();
  const t0Mono = performance.now();
  return {
    nowMs: () => Math.max(0, performance.now() - t0Mono),
    nowWallMs: () => Math.max(0, t0Wall + (performance.now() - t0Mono))
  };
}

function createNodeRandom(): HostRandom {
  return {
    randomUUID: () => crypto.randomUUID(),
    randomBytes: (size) => crypto.randomBytes(size)
  };
}

function createNodeCrypto(): HostCrypto {
  return {
    digest: async (algorithm, data) => {
      if (algorithm !== "SHA-256") throw new Error(`Unsupported digest algorithm: ${algorithm}`);
      const buf = crypto.createHash("sha256").update(Buffer.from(data)).digest();
      return new Uint8Array(buf);
    }
  };
}

function createNodeNetwork(): HostNetwork | null {
  if (typeof fetch !== "function") return null;
  return { fetch };
}

function createNodeTelemetry(): HostTelemetry {
  const maxBuffered = 512;
  const buf: TelemetryEventEnvelopeV1[] = [];
  let dropped = 0;
  let droppedSinceLastFlush = 0;
  let lastDropReason: string | undefined = undefined;

  return {
    enqueue: async (evt) => {
      if (buf.length >= maxBuffered) {
        dropped += 1;
        droppedSinceLastFlush += 1;
        lastDropReason = "buffer_full";
        buf.shift();
      }
      buf.push(evt);
      if (process.env.CLAUDE_TS_TELEMETRY_STDERR === "1") process.stderr.write(`[telemetry] ${JSON.stringify(evt)}\n`);
    },
    flush: async () => {
      droppedSinceLastFlush = 0;
    },
    getDropStats: (): TelemetryDropStats => ({ dropped, droppedSinceLastFlush, ...(lastDropReason ? { lastDropReason } : {}) })
  };
}

function createNodeLifecycle(): HostLifecycle {
  const handlers = new Set<(event: unknown) => void>();
  return {
    subscribe: (handler) => {
      handlers.add(handler as (event: unknown) => void);
      return () => handlers.delete(handler as (event: unknown) => void);
    },
    getConnectionState: () => "unknown"
  };
}

function createNodeProcess(envAllowlist?: readonly string[]): HostProcess {
  const allowed = envAllowlist ? new Set(envAllowlist) : null;
  return {
    getEnv: (name) => {
      if (allowed && !allowed.has(name)) return undefined;
      return process.env[name];
    },
    getCwd: () => process.cwd(),
    platform: () => process.platform
  };
}

function createNodeFilesystem(): HostFilesystem {
  return {
    cwd: () => process.cwd(),
    getAllowedRoots: async () => [process.cwd()],
    exists: async (p) => {
      try {
        await fs.stat(p);
        return true;
      } catch {
        return false;
      }
    },
    stat: async (p) => {
      const st = await fs.lstat(p);
      const kind = st.isFile() ? "file" : st.isDirectory() ? "dir" : st.isSymbolicLink() ? "symlink" : "other";
      return { kind, sizeBytes: st.size, mtimeMs: st.mtimeMs };
    },
    readFileText: async (p) => {
      return await fs.readFile(p, { encoding: "utf8" });
    },
    readFileBytes: async (p) => {
      return await fs.readFile(p);
    },
    writeFileText: async (p, text, options) => {
      const atomic = options?.atomic ?? true;
      if (atomic) {
        await atomicWriteFile(p, text, options?.mode);
      } else {
        await ensureParentDir(p);
        await fs.writeFile(p, text, { encoding: "utf8", mode: options?.mode });
      }
    },
    writeFileBytes: async (p, data, options) => {
      const atomic = options?.atomic ?? true;
      if (atomic) {
        await atomicWriteFileBytes(p, data, options?.mode);
      } else {
        await ensureParentDir(p);
        await fs.writeFile(p, data, { mode: options?.mode });
      }
    },
    listDir: async (p) => {
      const entries = await fs.readdir(p, { withFileTypes: true });
      entries.sort((a, b) => a.name.localeCompare(b.name));
      return entries.map((e) => ({
        name: e.name,
        kind: e.isFile() ? "file" : e.isDirectory() ? "dir" : e.isSymbolicLink() ? "symlink" : "other"
      }));
    },
    mkdirp: async (p) => {
      await fs.mkdir(p, { recursive: true });
    },
    rm: async (p, options) => {
      await fs.rm(p, { recursive: options?.recursive ?? false, force: true });
    },
    realpath: async (p) => {
      return await fs.realpath(p);
    }
  };
}

function createNodeStorage(options: NodeHostOptions): HostStorage {
  const rootDir = baseStorageDir(options);
  return {
    get: async (ns, key) => {
      const filePath = storageKeyPath(rootDir, ns, key);
      try {
        const raw = await fs.readFile(filePath, { encoding: "utf8" });
        const parsed = JSON.parse(raw) as StoredFile;
        if (!parsed || typeof parsed.value !== "string" || typeof parsed.version !== "string") {
          throw new StorageCorruptionDetectedError("Invalid storage record shape", key);
        }
        return { value: parsed.value, version: parsed.version };
      } catch (error) {
        if (error instanceof StorageCorruptionDetectedError) throw error;
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    set: async (ns, key, value, opts) => {
      const filePath = storageKeyPath(rootDir, ns, key);
      const expected = opts?.expectedVersion ?? undefined;

      const existing = await (async () => {
        try {
          const raw = await fs.readFile(filePath, { encoding: "utf8" });
          const parsed = JSON.parse(raw) as StoredFile;
          if (!parsed || typeof parsed.value !== "string" || typeof parsed.version !== "string") return null;
          return parsed;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
          return null;
        }
      })();

      const actualVersion = existing?.version ?? null;
      if (expected !== undefined) {
        if (expected === null) {
          if (existing !== null) throw new StorageConflictError({ key, expectedVersion: null, actualVersion });
        } else {
          if (existing === null || existing.version !== expected) {
            throw new StorageConflictError({ key, expectedVersion: expected, actualVersion });
          }
        }
      }

      const version = computeVersion(value);
      const stored: StoredFile = { version, value, updatedAtMs: Date.now() };
      await atomicWriteFile(filePath, JSON.stringify(stored), 0o600);
      return { version };
    },
    delete: async (ns, key, opts) => {
      const filePath = storageKeyPath(rootDir, ns, key);
      if (opts?.expectedVersion !== undefined) {
        const existing = await (async () => {
          try {
            const raw = await fs.readFile(filePath, { encoding: "utf8" });
            const parsed = JSON.parse(raw) as StoredFile;
            if (!parsed || typeof parsed.version !== "string") return null;
            return parsed;
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
            return null;
          }
        })();
        const actualVersion = existing?.version ?? null;
        const expected = opts.expectedVersion;
        if (expected === null) {
          if (existing !== null) throw new StorageConflictError({ key, expectedVersion: null, actualVersion });
        } else if (existing === null || existing.version !== expected) {
          throw new StorageConflictError({ key, expectedVersion: expected, actualVersion });
        }
      }

      try {
        await fs.rm(filePath, { force: true });
      } catch {
        // ignore
      }
    },
    listKeys: async (ns, listOpts) => {
      const parts = namespaceToPathParts(ns);
      const dir = path.join(rootDir, ...parts);
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const keys: string[] = [];
        for (const entry of entries) {
          if (!entry.isFile()) continue;
          if (!entry.name.endsWith(".json")) continue;
          const base = entry.name.slice(0, -".json".length);
          const decoded = decodeStorageSegment(base);
          if (decoded === null) continue;
          if (listOpts?.prefix && !decoded.startsWith(listOpts.prefix)) continue;
          keys.push(decoded);
        }
        keys.sort();
        return keys;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }
    },
    subscribe: (ns, handler) => {
      const parts = namespaceToPathParts(ns);
      const dir = path.join(rootDir, ...parts);
      let closed = false;
      let watcher: ReturnType<typeof watchFs> | null = null;

      const start = async () => {
        try {
          await fs.mkdir(dir, { recursive: true });
        } catch {
          // ignore
        }
        if (closed) return;
        watcher = watchFs(dir, { persistent: false }, async (_eventType, filename) => {
          if (closed) return;
          const name = filename ? filename.toString() : "";
          if (!name) return;
          if (!name.endsWith(".json")) return;
          if (name.startsWith(".tmp-")) return;
          const base = name.slice(0, -".json".length);
          const decoded = decodeStorageSegment(base);
          if (decoded === null) return;
          const filePath = path.join(dir, name);
          try {
            const raw = await fs.readFile(filePath, { encoding: "utf8" });
            const parsed = JSON.parse(raw) as StoredFile;
            if (!parsed || typeof parsed.version !== "string") return;
            handler({ namespace: ns, key: decoded, kind: "set", version: parsed.version });
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
              handler({ namespace: ns, key: decoded, kind: "delete" });
              return;
            }
          }
        });
      };

      void start();
      return () => {
        closed = true;
        try {
          watcher?.close();
        } catch {
          // ignore
        }
        watcher = null;
      };
    }
  };
}

type ClaudeAiOauthCredentials = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

type ClaudeCodeCredentials = { accessToken?: string; claudeAiOauth?: ClaudeAiOauthCredentials };

function configDirHashSuffix(configDir: string): string {
  if (!process.env.CLAUDE_CONFIG_DIR) return "";
  const hash = crypto.createHash("sha256").update(configDir, "utf8").digest("hex").slice(0, 8);
  return `-${hash}`;
}

function candidateKeychainServiceNames(configDir: string): string[] {
  const suffix = configDirHashSuffix(configDir);
  const base = [`Claude Code-credentials`, `Claude Code (Beta)-credentials`];
  if (!suffix) return base;
  return [base[0]!, `${base[0]!}${suffix}`, base[1]!, `${base[1]!}${suffix}`];
}

function nodeUsername(): string {
  return process.env.USER ?? os.userInfo().username ?? "claude-code-user";
}

async function writeGenericPasswordToKeychain(options: NodeHostOptions, params: { service: string; account: string; value: string }): Promise<void> {
  if (process.platform !== "darwin") throw new Error("Keychain is only supported on darwin");
  if (options.enableKeychain === false) throw new Error("Keychain is disabled");
  if (options.allowSubprocess === false) throw new Error("Subprocess execution is disabled by host policy");
  await execFile("security", ["add-generic-password", "-U", "-a", params.account, "-s", params.service, "-w", params.value], {
    timeout: 10_000
  });
}

async function deleteGenericPasswordFromKeychain(options: NodeHostOptions, params: { service: string; account: string }): Promise<void> {
  if (process.platform !== "darwin") throw new Error("Keychain is only supported on darwin");
  if (options.enableKeychain === false) throw new Error("Keychain is disabled");
  if (options.allowSubprocess === false) throw new Error("Subprocess execution is disabled by host policy");
  await execFile("security", ["delete-generic-password", "-a", params.account, "-s", params.service], { timeout: 10_000 });
}

async function readClaudeCodeCredentialsFromKeychain(options: NodeHostOptions): Promise<ClaudeCodeCredentials | null> {
  if (process.platform !== "darwin") return null;
  if (options.enableKeychain === false) return null;
  if (options.allowSubprocess === false) return null;

  const configDir = options.configDir ?? defaultConfigDir();
  const account = nodeUsername();
  for (const service of candidateKeychainServiceNames(configDir)) {
    try {
      const { stdout } = await execFile("security", ["find-generic-password", "-a", account, "-s", service, "-w"], {
        timeout: 5_000
      });
      const trimmed = stdout.trim();
      if (!trimmed) continue;
      const parsed = JSON.parse(trimmed) as ClaudeCodeCredentials;
      return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

async function readClaudeCodeCredentialsRawFromKeychain(options: NodeHostOptions): Promise<string | null> {
  if (process.platform !== "darwin") return null;
  if (options.enableKeychain === false) return null;
  if (options.allowSubprocess === false) return null;

  const configDir = options.configDir ?? defaultConfigDir();
  const account = nodeUsername();
  for (const service of candidateKeychainServiceNames(configDir)) {
    try {
      const { stdout } = await execFile("security", ["find-generic-password", "-a", account, "-s", service, "-w"], {
        timeout: 5_000
      });
      const trimmed = stdout.trim();
      if (!trimmed) continue;
      return trimmed;
    } catch {
      continue;
    }
  }
  return null;
}

async function readClaudeCodeCredentialsFromPlaintextFile(options: NodeHostOptions): Promise<ClaudeCodeCredentials | null> {
  if (options.enablePlaintextSecretFallback !== true) return null;
  const configDir = options.configDir ?? defaultConfigDir();
  const filePath = path.join(configDir, ".credentials.json");
  try {
    const raw = await fs.readFile(filePath, { encoding: "utf8" });
    return JSON.parse(raw) as ClaudeCodeCredentials;
  } catch {
    return null;
  }
}

async function readClaudeCodeCredentialsRawFromPlaintextFile(options: NodeHostOptions): Promise<string | null> {
  if (options.enablePlaintextSecretFallback !== true) return null;
  const configDir = options.configDir ?? defaultConfigDir();
  const filePath = path.join(configDir, ".credentials.json");
  try {
    const raw = await fs.readFile(filePath, { encoding: "utf8" });
    return raw;
  } catch {
    return null;
  }
}

function candidateApiKeychainServiceNames(configDir: string): string[] {
  const suffix = configDirHashSuffix(configDir);
  const base = [`Claude Code`, `Claude Code (Beta)`];
  if (!suffix) return base;
  return [base[0]!, `${base[0]!}${suffix}`, base[1]!, `${base[1]!}${suffix}`];
}

async function readClaudeCodeApiKeyFromKeychain(options: NodeHostOptions): Promise<string | null> {
  if (process.platform !== "darwin") return null;
  if (options.enableKeychain === false) return null;
  if (options.allowSubprocess === false) return null;

  const configDir = options.configDir ?? defaultConfigDir();
  const account = nodeUsername();
  for (const service of candidateApiKeychainServiceNames(configDir)) {
    try {
      const { stdout } = await execFile("security", ["find-generic-password", "-a", account, "-s", service, "-w"], {
        timeout: 5_000
      });
      const trimmed = stdout.trim();
      if (!trimmed) continue;
      return trimmed;
    } catch (e: any) {
      if (process.env.CLAUDE_TS_DEBUG === "1") {
        console.error(`Debug: Failed to read from keychain ${service}: ${e instanceof Error ? e.message : String(e)}`);
      }
      continue;
    }
  }
  return null;
}

function createNodeSecrets(options: NodeHostOptions): HostSecrets {
  return {
    getSecret: async (name) => {
      if (name === "claude_code/credentials_json") {
        return (
          (await readClaudeCodeCredentialsRawFromKeychain(options)) ?? (await readClaudeCodeCredentialsRawFromPlaintextFile(options))
        );
      }

      if (name === "claude_code/api_key" || name === "anthropic/api_key") {
        const envApiKey = process.env.ANTHROPIC_API_KEY;
        if (envApiKey) return envApiKey;
        return await readClaudeCodeApiKeyFromKeychain(options);
      }

      const envToken = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
      if (
        envToken &&
        (name === "claude_code/accessToken" ||
          name === "claude_code/session_access_token" ||
          name === "CLAUDE_CODE_SESSION_ACCESS_TOKEN")
      ) {
        return envToken;
      }

      const creds =
        (await readClaudeCodeCredentialsFromKeychain(options)) ??
        (await readClaudeCodeCredentialsFromPlaintextFile(options));

      const accessToken = creds?.accessToken ?? creds?.claudeAiOauth?.accessToken;
      if (!accessToken) return null;
      if (
        name === "claude_code/accessToken" ||
        name === "claude_code/session_access_token" ||
        name === "CLAUDE_CODE_SESSION_ACCESS_TOKEN"
      ) {
        return accessToken;
      }
      return null;
    }
    ,
    setSecret: async (name, value) => {
      if (name === "claude_code/credentials_json") {
        const configDir = options.configDir ?? defaultConfigDir();
        const account = nodeUsername();
        const service = candidateKeychainServiceNames(configDir)[0]!;
        if (process.platform === "darwin" && options.enableKeychain !== false) {
          await writeGenericPasswordToKeychain(options, { service, account, value });
          return;
        }
        if (options.enablePlaintextSecretFallback === true) {
          const filePath = path.join(configDir, ".credentials.json");
          await atomicWriteFile(filePath, value, 0o600);
          return;
        }
        throw new Error("Cannot persist credentials: keychain disabled/unavailable and plaintext fallback disabled");
      }

      if (name === "claude_code/api_key" || name === "anthropic/api_key") {
        const configDir = options.configDir ?? defaultConfigDir();
        const account = nodeUsername();
        const service = candidateApiKeychainServiceNames(configDir)[0]!;
        if (process.platform === "darwin" && options.enableKeychain !== false) {
          await writeGenericPasswordToKeychain(options, { service, account, value });
          return;
        }
        throw new Error("Cannot persist API key: keychain disabled/unavailable");
      }
    },
    deleteSecret: async (name) => {
      if (name === "claude_code/credentials_json") {
        const configDir = options.configDir ?? defaultConfigDir();
        const account = nodeUsername();
        const service = candidateKeychainServiceNames(configDir)[0]!;
        if (process.platform === "darwin" && options.enableKeychain !== false) {
          await deleteGenericPasswordFromKeychain(options, { service, account });
          return;
        }
        if (options.enablePlaintextSecretFallback === true) {
          const filePath = path.join(configDir, ".credentials.json");
          try {
            await fs.rm(filePath, { force: true });
          } catch {
            // ignore
          }
          return;
        }
        return;
      }

      if (name === "claude_code/api_key" || name === "anthropic/api_key") {
        const configDir = options.configDir ?? defaultConfigDir();
        const account = nodeUsername();
        const service = candidateApiKeychainServiceNames(configDir)[0]!;
        if (process.platform === "darwin" && options.enableKeychain !== false) {
          await deleteGenericPasswordFromKeychain(options, { service, account });
          return;
        }
        return;
      }
    }
  };
}

export function createNodeHostCapabilities(options: NodeHostOptions = {}): HostCapabilities {
  const clock = createNodeClock();
  const lifecycle = createNodeLifecycle();
  const storage = createNodeStorage(options);
  const filesystem = createNodeFilesystem();
  const network = createNodeNetwork();
  const secrets = createNodeSecrets(options);
  const proc = createNodeProcess(options.envAllowlist);

  return {
    clock: availableCapability(clock),
    random: availableCapability(createNodeRandom()),
    crypto: availableCapability(createNodeCrypto()),
    secrets: availableCapability(secrets),
    storage: availableCapability(storage),
    filesystem: availableCapability(filesystem),
    network: network ? availableCapability(network) : unavailableCapability({ kind: "not-provided" }),
    lifecycle: availableCapability(lifecycle),
    telemetry: availableCapability(createNodeTelemetry()),
    background: unavailableCapability({ kind: "not-provided" }),
    fileTransfer: unavailableCapability({ kind: "not-provided" }),
    shell: unavailableCapability({ kind: "not-provided", message: "Shell automation is intentionally not provided by default" }),
    localEndpoint: unavailableCapability({ kind: "not-provided" }),
    ipc: unavailableCapability({ kind: "not-provided" }),
    process: availableCapability(proc),
    clipboard: unavailableCapability({ kind: "not-provided" }),
    notifications: unavailableCapability({ kind: "not-provided" }),
    haptics: unavailableCapability({ kind: "not-provided" })
  };
}
