import type { HostCapabilities, HostStorage, StorageNamespace } from "../types/host.js";
import { CapabilityUnavailableError } from "../types/host.js";
import { sha256HexForCanonicalJson } from "./hash.js";
import type { McpManifest, McpServerId, McpToolDescriptor, McpResourceDescriptor } from "./types.js";
import { asWorkspaceId, type WorkspaceId } from "../types/workspace.js";

type StoredManifestV1 = {
  schemaVersion: 1;
  serverId: McpServerId;
  tools: McpToolDescriptor[];
  resources: McpResourceDescriptor[];
  manifestHash?: string;
  fetchedAtMonoMs: number;
  authIdentityHash?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function parseStored(raw: unknown): StoredManifestV1 | null {
  if (!isPlainObject(raw)) return null;
  if (raw.schemaVersion !== 1) return null;
  if (typeof raw.serverId !== "string") return null;
  if (!Array.isArray(raw.tools) || !Array.isArray(raw.resources)) return null;
  return raw as StoredManifestV1;
}

export type McpManifestCacheOptions = {
  host: HostCapabilities;
  workspaceId?: WorkspaceId;
  ttlMs: number;
};

export class McpManifestCache {
  private readonly host: HostCapabilities;
  private readonly ns: StorageNamespace;
  private readonly ttlMs: number;

  constructor(options: McpManifestCacheOptions) {
    this.host = options.host;
    this.ns = { scope: "workspace", workspaceId: options.workspaceId ?? asWorkspaceId("default") };
    this.ttlMs = Math.max(0, options.ttlMs);
  }

  private storage(): HostStorage {
    const cap = this.host.storage;
    if (cap.kind !== "available") throw new CapabilityUnavailableError("storage", cap.reason);
    return cap.value;
  }

  private clockNowMs(): number {
    const clock = this.host.clock;
    if (clock.kind !== "available") return 0;
    return clock.value.nowMs();
  }

  private key(serverId: McpServerId): string {
    return `mcp/manifest/v1/${serverId}`;
  }

  async get(serverId: McpServerId, options?: { authIdentityHash?: string }): Promise<McpManifest | null> {
    const rec = await this.storage().get(this.ns, this.key(serverId));
    if (!rec) return null;
    try {
      const parsed = parseStored(JSON.parse(rec.value));
      if (!parsed) return null;
      if (options?.authIdentityHash && parsed.authIdentityHash && options.authIdentityHash !== parsed.authIdentityHash) return null;
      const age = this.clockNowMs() - parsed.fetchedAtMonoMs;
      if (this.ttlMs > 0 && age > this.ttlMs) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async set(
    manifest: Omit<McpManifest, "manifestHash">,
    options?: { authIdentityHash?: string }
  ): Promise<{ stored: McpManifest; drift?: { previousHash?: string; nextHash: string } }> {
    const crypto = this.host.crypto;
    if (crypto.kind !== "available") throw new CapabilityUnavailableError("crypto", crypto.reason);
    const nextHash = await sha256HexForCanonicalJson(crypto.value, { tools: manifest.tools, resources: manifest.resources });
    const prev = await this.get(manifest.serverId, options);

    const stored: McpManifest = { ...manifest, manifestHash: nextHash, ...(options?.authIdentityHash ? { authIdentityHash: options.authIdentityHash } : {}) };
    const record: StoredManifestV1 = { schemaVersion: 1, ...stored };
    await this.storage().set(this.ns, this.key(manifest.serverId), JSON.stringify(record), {});

    const drift =
      prev && prev.manifestHash !== nextHash
        ? { ...(prev.manifestHash ? { previousHash: prev.manifestHash } : {}), nextHash }
        : undefined;
    return { stored, ...(drift ? { drift } : {}) };
  }

  async invalidate(serverId: McpServerId): Promise<void> {
    await this.storage().delete(this.ns, this.key(serverId), {});
  }
}
