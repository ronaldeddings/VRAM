import { availableCapability, unavailableCapability, type HostCapabilities, type HostNetwork, type HostSecrets, type HostStorage } from "../../src/core/types/host.js";

export function createInMemorySecrets(seed: Record<string, string> = {}): HostSecrets {
  const map = new Map<string, string>(Object.entries(seed));
  return {
    getSecret: async (name) => map.get(name) ?? null,
    setSecret: async (name, value) => void map.set(name, value),
    deleteSecret: async (name) => void map.delete(name),
    invalidateSecret: async (name) => void map.delete(name)
  };
}

export function createHostWithDeterministicStorage(options: {
  storage: HostStorage;
  secrets?: HostSecrets;
  network?: HostNetwork;
}): HostCapabilities {
  return {
    clock: unavailableCapability({ kind: "not-provided" }),
    random: unavailableCapability({ kind: "not-provided" }),
    crypto: unavailableCapability({ kind: "not-provided" }),
    secrets: availableCapability(options.secrets ?? createInMemorySecrets()),
    storage: availableCapability(options.storage),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: options.network ? availableCapability(options.network) : unavailableCapability({ kind: "not-provided" }),
    lifecycle: unavailableCapability({ kind: "not-provided" }),
    telemetry: unavailableCapability({ kind: "not-provided" }),
    background: unavailableCapability({ kind: "not-provided" }),
    fileTransfer: unavailableCapability({ kind: "not-provided" }),
    shell: unavailableCapability({ kind: "not-provided" }),
    localEndpoint: unavailableCapability({ kind: "not-provided" }),
    ipc: unavailableCapability({ kind: "not-provided" }),
    process: unavailableCapability({ kind: "not-provided" }),
    clipboard: unavailableCapability({ kind: "not-provided" }),
    notifications: unavailableCapability({ kind: "not-provided" }),
    haptics: unavailableCapability({ kind: "not-provided" })
  };
}

