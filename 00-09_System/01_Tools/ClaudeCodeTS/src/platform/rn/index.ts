import { availableCapability, unavailableCapability } from "../../core/types/host.js";
import type {
  HostCapabilities,
  HostClock,
  HostCrypto,
  HostLifecycle,
  HostNetwork,
  HostRandom,
  HostSecrets,
  HostStorage,
  StorageNamespace
} from "../../core/types/host.js";

import type { CapabilityKey } from "../smoke.js";

export const RN_MINIMAL_REQUIRED_CAPABILITIES = [
  "clock",
  "random",
  "secrets",
  "storage",
  "network",
  "lifecycle"
] as const satisfies readonly CapabilityKey[];

export type ReactNativePlatform = {
  phase: "4";
  host: "rn";
};

export * from "./streamAdapters.js";

function createRnClock(): HostClock {
  return { nowMs: () => Date.now(), nowWallMs: () => Date.now() };
}

function randomUuidFallback(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function createRnRandom(): HostRandom {
  return {
    randomUUID: () =>
      typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as Crypto).randomUUID() : randomUuidFallback()
  };
}

function createRnCrypto(): HostCrypto | null {
  const subtle = typeof crypto !== "undefined" ? crypto.subtle : undefined;
  if (!subtle || typeof subtle.digest !== "function") return null;
  return {
    digest: async (algorithm, data) => {
      if (algorithm !== "SHA-256") throw new Error(`Unsupported digest algorithm: ${algorithm}`);
      const out = await subtle.digest("SHA-256", data as unknown as BufferSource);
      return new Uint8Array(out);
    }
  };
}

function createMemoryStorage(): HostStorage {
  const map = new Map<string, { value: string; version: string }>();
  const k = (ns: StorageNamespace, key: string) =>
    `${ns.scope}:${ns.workspaceId ?? "na"}:${ns.sessionId ?? "na"}:${key}`;
  return {
    get: async (ns, key) => map.get(k(ns, key)) ?? null,
    set: async (ns, key, value) => {
      const version = `${Date.now()}:${Math.random()}`;
      map.set(k(ns, key), { value, version });
      return { version };
    },
    delete: async (ns, key) => {
      map.delete(k(ns, key));
    }
  };
}

function createMemorySecrets(): HostSecrets {
  const map = new Map<string, string>();
  return {
    getSecret: async (name) => map.get(name) ?? null,
    setSecret: async (name, value) => {
      map.set(name, value);
    },
    deleteSecret: async (name) => {
      map.delete(name);
    }
  };
}

function createRnNetwork(): HostNetwork | null {
  if (typeof fetch !== "function") return null;
  return { fetch };
}

function createRnLifecycle(): HostLifecycle {
  const handlers = new Set<(event: any) => void>();
  return {
    subscribe: (handler) => {
      handlers.add(handler as (event: any) => void);
      return () => handlers.delete(handler as (event: any) => void);
    },
    getConnectionState: () => "unknown"
  };
}

export function createReactNativeHostCapabilities(): HostCapabilities {
  const network = createRnNetwork();
  const rnCrypto = createRnCrypto();
  return {
    clock: availableCapability(createRnClock()),
    random: availableCapability(createRnRandom()),
    crypto: rnCrypto ? availableCapability(rnCrypto) : unavailableCapability({ kind: "not-provided" }),
    secrets: availableCapability(createMemorySecrets()),
    storage: availableCapability(createMemoryStorage()),
    network: network ? availableCapability(network) : unavailableCapability({ kind: "not-provided" }),
    lifecycle: availableCapability(createRnLifecycle()),
    telemetry: unavailableCapability({ kind: "not-provided" }),
    background: unavailableCapability({ kind: "unsupported" }),
    fileTransfer: unavailableCapability({ kind: "unsupported" }),
    filesystem: unavailableCapability({ kind: "unsupported" }),
    shell: unavailableCapability({ kind: "unsupported" }),
    localEndpoint: unavailableCapability({ kind: "unsupported" }),
    ipc: unavailableCapability({ kind: "unsupported" }),
    process: unavailableCapability({ kind: "unsupported" }),
    clipboard: unavailableCapability({ kind: "unsupported" }),
    notifications: unavailableCapability({ kind: "unsupported" }),
    haptics: unavailableCapability({ kind: "unsupported" })
  };
}
