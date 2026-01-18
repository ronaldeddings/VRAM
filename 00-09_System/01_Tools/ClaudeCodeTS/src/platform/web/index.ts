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

export const WEB_MINIMAL_REQUIRED_CAPABILITIES = [
  "clock",
  "random",
  "secrets",
  "storage",
  "network",
  "lifecycle"
] as const satisfies readonly CapabilityKey[];

export type WebPlatform = {
  phase: "4";
  host: "web";
};

function createWebClock(): HostClock {
  const t0Wall = Date.now();
  const t0Mono = typeof performance !== "undefined" ? performance.now() : 0;
  return {
    nowMs: () => (typeof performance !== "undefined" ? performance.now() - t0Mono : Date.now() - t0Wall),
    nowWallMs: () => Date.now()
  };
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

function createWebRandom(): HostRandom {
  return {
    randomUUID: () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as Crypto).randomUUID() : randomUuidFallback())
  };
}

function createWebCrypto(): HostCrypto | null {
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

function storageKey(ns: StorageNamespace, key: string): string {
  const workspace = ns.scope === "workspace" ? ns.workspaceId ?? "unknown" : "na";
  const session = ns.scope === "session" ? ns.sessionId ?? "unknown" : "na";
  return `cc:storage:v1:${ns.scope}:${workspace}:${session}:${key}`;
}

type WebStored = { version: string; value: string };

function createWebStorage(): HostStorage {
  const store = typeof localStorage !== "undefined" ? localStorage : null;
  return {
    get: async (ns, key) => {
      if (!store) return null;
      const raw = store.getItem(storageKey(ns, key));
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as WebStored;
        if (!parsed || typeof parsed.value !== "string" || typeof parsed.version !== "string") return null;
        return { value: parsed.value, version: parsed.version };
      } catch {
        return null;
      }
    },
    set: async (ns, key, value) => {
      if (!store) throw Error("Storage unavailable");
      const version = `${Date.now()}`;
      store.setItem(storageKey(ns, key), JSON.stringify({ version, value } satisfies WebStored));
      return { version };
    },
    delete: async (ns, key) => {
      if (!store) return;
      store.removeItem(storageKey(ns, key));
    }
  };
}

function createWebSecrets(): HostSecrets {
  const store = typeof sessionStorage !== "undefined" ? sessionStorage : null;
  return {
    getSecret: async (name) => {
      if (!store) return null;
      return store.getItem(`cc:secrets:v1:${name}`);
    },
    setSecret: async (name, value) => {
      if (!store) throw Error("Secrets unavailable");
      store.setItem(`cc:secrets:v1:${name}`, value);
    },
    deleteSecret: async (name) => {
      if (!store) return;
      store.removeItem(`cc:secrets:v1:${name}`);
    }
  };
}

function createWebNetwork(): HostNetwork | null {
  if (typeof fetch !== "function") return null;
  return { fetch };
}

function createWebLifecycle(): HostLifecycle {
  const handlers = new Set<(event: any) => void>();
  const emit = (event: any) => {
    for (const h of handlers) h(event);
  };

  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("visibilitychange", () => {
      emit(document.hidden ? { type: "host/backgrounded" } : { type: "host/foregrounded" });
    });
  }
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("online", () => emit({ type: "host/foregrounded" }));
    window.addEventListener("offline", () => emit({ type: "host/backgrounded" }));
  }

  return {
    subscribe: (handler) => {
      handlers.add(handler as (event: any) => void);
      return () => handlers.delete(handler as (event: any) => void);
    },
    getConnectionState: () =>
      typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
        ? navigator.onLine
          ? "online"
          : "offline"
        : "unknown"
  };
}

export function createWebHostCapabilities(): HostCapabilities {
  const network = createWebNetwork();
  const webCrypto = createWebCrypto();
  return {
    clock: availableCapability(createWebClock()),
    random: availableCapability(createWebRandom()),
    crypto: webCrypto ? availableCapability(webCrypto) : unavailableCapability({ kind: "not-provided" }),
    secrets: availableCapability(createWebSecrets()),
    storage: availableCapability(createWebStorage()),
    network: network ? availableCapability(network) : unavailableCapability({ kind: "not-provided" }),
    lifecycle: availableCapability(createWebLifecycle()),
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
