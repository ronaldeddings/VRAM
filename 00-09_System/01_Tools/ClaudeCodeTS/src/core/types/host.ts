import type { HostEvent } from "./events.js";
import type { WorkspaceId } from "./workspace.js";

export type CapabilityUnavailableReason =
  | { kind: "not-provided"; message?: string }
  | { kind: "unsupported"; message?: string }
  | { kind: "disabled"; message?: string }
  | { kind: "policy-denied"; message?: string; policyId?: string };

export type Capability<T> =
  | { kind: "available"; value: T }
  | { kind: "unavailable"; reason: CapabilityUnavailableReason };

export function availableCapability<T>(value: T): Capability<T> {
  return { kind: "available", value };
}

export function unavailableCapability(reason: CapabilityUnavailableReason): Capability<never> {
  return { kind: "unavailable", reason };
}

export type HostClock = {
  nowMs: () => number;
  nowWallMs?: () => number;
};

export type HostRandom = {
  randomUUID: () => string;
  randomBytes?: (size: number) => Uint8Array;
};

export type HostCrypto = {
  digest: (algorithm: "SHA-256", data: Uint8Array) => Promise<Uint8Array>;
};

export type HostSecrets = {
  getSecret: (name: string) => Promise<string | null>;
  setSecret?: (name: string, value: string) => Promise<void>;
  deleteSecret?: (name: string) => Promise<void>;
  invalidateSecret?: (name: string, reason?: string) => Promise<void>;
};

export type StorageScope = "app" | "workspace" | "session";

export type StorageNamespace = {
  scope: StorageScope;
  workspaceId?: WorkspaceId;
  sessionId?: string;
};

export type StorageReadResult = {
  value: string;
  version: string;
};

export type StorageWriteResult = {
  version: string;
};

export type StorageChangeEvent = {
  namespace: StorageNamespace;
  key: string;
  kind: "set" | "delete";
  version?: string;
};

export type HostStorage = {
  get: (namespace: StorageNamespace, key: string) => Promise<StorageReadResult | null>;
  set: (
    namespace: StorageNamespace,
    key: string,
    value: string,
    options?: { expectedVersion?: string | null }
  ) => Promise<StorageWriteResult>;
  delete: (namespace: StorageNamespace, key: string, options?: { expectedVersion?: string | null }) => Promise<void>;
  listKeys?: (namespace: StorageNamespace, options?: { prefix?: string }) => Promise<string[]>;
  subscribe?: (namespace: StorageNamespace, handler: (event: StorageChangeEvent) => void) => () => void;
};

export type PortablePath = string;

export type HostDirEntry = {
  name: string;
  kind: "file" | "dir" | "symlink" | "other";
};

export type HostFileStat = {
  kind: "file" | "dir" | "symlink" | "other";
  sizeBytes?: number;
  mtimeMs?: number;
};

export type HostFilesystem = {
  cwd?: () => PortablePath;
  getAllowedRoots?: () => Promise<PortablePath[]>;
  exists: (path: PortablePath) => Promise<boolean>;
  stat: (path: PortablePath) => Promise<HostFileStat>;
  readFileText: (path: PortablePath) => Promise<string>;
  readFileBytes: (path: PortablePath) => Promise<Uint8Array>;
  writeFileText: (path: PortablePath, text: string, options?: { atomic?: boolean; mode?: number }) => Promise<void>;
  writeFileBytes: (
    path: PortablePath,
    data: Uint8Array,
    options?: { atomic?: boolean; mode?: number }
  ) => Promise<void>;
  listDir: (path: PortablePath) => Promise<HostDirEntry[]>;
  mkdirp: (path: PortablePath) => Promise<void>;
  rm: (path: PortablePath, options?: { recursive?: boolean }) => Promise<void>;
  realpath?: (path: PortablePath) => Promise<PortablePath>;
};

export type HostNetwork = {
  fetch: typeof fetch;
};

export type HostTelemetry = {
  enqueue: (event: import("./observability.js").TelemetryEventEnvelopeV1) => Promise<void> | void;
  flush?: () => Promise<void>;
  getDropStats?: () => import("./observability.js").TelemetryDropStats;
};

export type HostLifecycle = {
  subscribe: (handler: (event: HostEvent) => void) => () => void;
  getConnectionState?: () => "online" | "offline" | "unknown";
};

export type HostClipboard = {
  readText?: () => Promise<string>;
  writeText?: (text: string) => Promise<void>;
};

export type HostNotifications = {
  notify?: (notification: { title: string; message: string; kind?: string }) => Promise<void>;
};

export type HostHaptics = {
  impact?: (style: "light" | "medium" | "heavy") => Promise<void>;
};

export type HostBackgroundExecution = {
  requestBackgroundExecution?: (options: { reason: string }) => Promise<{ granted: boolean; message?: string }>;
};

export type HostFileTransfer = {
  importFile?: (options?: { mimeTypes?: string[] }) => Promise<{ name: string; bytes: Uint8Array } | null>;
  exportFile?: (file: { name: string; bytes: Uint8Array; mimeType?: string }) => Promise<void>;
};

export type HostShell = {
  run?: (command: string, options?: { cwd?: PortablePath; env?: Record<string, string> }) => Promise<{
    exitCode: number;
    stdout: string;
    stderr: string;
  }>;
};

export type HostLocalEndpoint = {
  expose?: (options: { port: number; host?: string }) => Promise<{ url: string; close: () => Promise<void> }>;
};

export type HostIpcBridge = {
  send?: (channel: string, payload: unknown) => Promise<void>;
  onMessage?: (handler: (msg: { channel: string; payload: unknown }) => void) => () => void;
};

export type HostProcess = {
  getEnv?: (name: string) => string | undefined;
  getCwd?: () => PortablePath;
  platform?: () => string;
};

export type HostCapabilities = {
  clock: Capability<HostClock>;
  random: Capability<HostRandom>;
  crypto: Capability<HostCrypto>;
  secrets: Capability<HostSecrets>;
  storage: Capability<HostStorage>;
  filesystem: Capability<HostFilesystem>;
  network: Capability<HostNetwork>;
  lifecycle: Capability<HostLifecycle>;
  telemetry: Capability<HostTelemetry>;
  background: Capability<HostBackgroundExecution>;
  fileTransfer: Capability<HostFileTransfer>;
  shell: Capability<HostShell>;
  localEndpoint: Capability<HostLocalEndpoint>;
  ipc: Capability<HostIpcBridge>;
  process: Capability<HostProcess>;
  clipboard: Capability<HostClipboard>;
  notifications: Capability<HostNotifications>;
  haptics: Capability<HostHaptics>;
};

export type CapabilityValue<C> = C extends Capability<infer T> ? T : never;

export class CapabilityUnavailableError extends Error {
  readonly name = "CapabilityUnavailableError";
  readonly code = "capability_missing";
  readonly capability: string;
  readonly reason: CapabilityUnavailableReason;
  readonly userMessage?: string;

  constructor(capability: string, reason: CapabilityUnavailableReason, userMessage?: string) {
    super(`Capability '${capability}' is unavailable (${reason.kind})`);
    this.capability = capability;
    this.reason = reason;
    if (userMessage !== undefined) this.userMessage = userMessage;
  }
}

export class CapabilityPolicyDeniedError extends Error {
  readonly name = "CapabilityPolicyDeniedError";
  readonly code = "policy_override";
  readonly capability: string;
  readonly policyId?: string;
  readonly userMessage?: string;

  constructor(capability: string, details?: { policyId?: string; message?: string; userMessage?: string }) {
    super(details?.message ?? `Capability '${capability}' was denied by policy`);
    this.capability = capability;
    if (details?.policyId !== undefined) this.policyId = details.policyId;
    if (details?.userMessage !== undefined) this.userMessage = details.userMessage;
  }
}

export class StorageConflictError extends Error {
  readonly name = "StorageConflictError";
  readonly code = "conflict";
  readonly key: string;
  readonly expectedVersion: string | null;
  readonly actualVersion: string | null;

  constructor(details: { key: string; expectedVersion: string | null; actualVersion: string | null; message?: string }) {
    super(details.message ?? `Storage write conflict for key '${details.key}'`);
    this.key = details.key;
    this.expectedVersion = details.expectedVersion;
    this.actualVersion = details.actualVersion;
  }
}

export class StorageQuotaExceededError extends Error {
  readonly name = "StorageQuotaExceededError";
  readonly code = "quota_exceeded";
  readonly key?: string;

  constructor(message = "Storage quota exceeded", key?: string) {
    super(message);
    if (key !== undefined) this.key = key;
  }
}

export class StorageCorruptionDetectedError extends Error {
  readonly name = "StorageCorruptionDetectedError";
  readonly code = "corruption_detected";
  readonly key?: string;

  constructor(message = "Storage corruption detected", key?: string) {
    super(message);
    if (key !== undefined) this.key = key;
  }
}

export class StorageTransientFailureError extends Error {
  readonly name = "StorageTransientFailureError";
  readonly code = "transient_failure";
  readonly key?: string;

  constructor(message = "Transient storage failure", key?: string) {
    super(message);
    if (key !== undefined) this.key = key;
  }
}

export function requireCapability<K extends keyof HostCapabilities>(
  host: HostCapabilities,
  key: K
): CapabilityValue<HostCapabilities[K]> {
  const cap = host[key] as Capability<unknown>;
  if (cap.kind === "available") return cap.value as CapabilityValue<HostCapabilities[K]>;
  if (cap.reason.kind === "policy-denied") {
    throw new CapabilityPolicyDeniedError(String(key), {
      ...(cap.reason.policyId !== undefined ? { policyId: cap.reason.policyId } : {}),
      ...(cap.reason.message !== undefined ? { message: cap.reason.message } : {})
    });
  }
  throw new CapabilityUnavailableError(String(key), cap.reason);
}
