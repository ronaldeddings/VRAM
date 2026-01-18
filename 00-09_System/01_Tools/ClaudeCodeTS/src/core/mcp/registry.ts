import type { HostCapabilities, HostStorage, StorageNamespace } from "../types/host.js";
import { CapabilityUnavailableError } from "../types/host.js";
import type { McpServerConfig, McpServerId, McpServerTrust } from "./types.js";
import { ProtocolError } from "./errors.js";
import type { WorkspaceId } from "../types/workspace.js";

export type McpRegistryRecordV1 = {
  schemaVersion: 1;
  servers: Record<string, McpServerConfig>;
  managedServers?: Record<string, McpServerConfig>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function parseTrust(value: unknown): McpServerTrust | null {
  return value === "trusted" || value === "untrusted" || value === "managed" ? (value as McpServerTrust) : null;
}

function parseServerConfig(raw: unknown): McpServerConfig | null {
  if (!isPlainObject(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : null;
  const displayName = typeof raw.displayName === "string" ? raw.displayName : null;
  const enabled = typeof raw.enabled === "boolean" ? raw.enabled : null;
  const trust = parseTrust(raw.trust);
  if (!id || !displayName || enabled === null || !trust) return null;
  const preferredMode = raw.preferredMode === "direct" || raw.preferredMode === "endpoint" ? raw.preferredMode : undefined;
  return { id, displayName, enabled, trust, ...(preferredMode ? { preferredMode } : {}) };
}

function parseRegistryRecord(raw: unknown): McpRegistryRecordV1 {
  if (!isPlainObject(raw)) throw new ProtocolError("Invalid MCP registry record");
  if (raw.schemaVersion !== 1) throw new ProtocolError("Unsupported MCP registry schemaVersion");
  const serversRaw = raw.servers;
  if (!isPlainObject(serversRaw)) throw new ProtocolError("Invalid MCP registry servers map");
  const servers: Record<string, McpServerConfig> = {};
  for (const [k, v] of Object.entries(serversRaw)) {
    const parsed = parseServerConfig(v);
    if (!parsed) continue;
    servers[k] = parsed;
  }
  const managedServers: Record<string, McpServerConfig> = {};
  const managedRaw = raw.managedServers;
  if (isPlainObject(managedRaw)) {
    for (const [k, v] of Object.entries(managedRaw)) {
      const parsed = parseServerConfig(v);
      if (!parsed) continue;
      managedServers[k] = { ...parsed, trust: "managed" };
    }
  }
  return { schemaVersion: 1, servers, ...(Object.keys(managedServers).length > 0 ? { managedServers } : {}) };
}

function defaultRecord(): McpRegistryRecordV1 {
  return { schemaVersion: 1, servers: {} };
}

export class McpServerRegistry {
  private readonly storageKey = "mcp/server-registry/v1";
  private readonly host: HostCapabilities;
  private readonly appNs: StorageNamespace;
  private readonly workspaceNs: StorageNamespace | null;

  constructor(options: { host: HostCapabilities; workspaceId?: WorkspaceId }) {
    this.host = options.host;
    this.appNs = { scope: "app" };
    this.workspaceNs = options.workspaceId ? { scope: "workspace", workspaceId: options.workspaceId } : null;
  }

  private storage(): HostStorage {
    const cap = this.host.storage;
    if (cap.kind !== "available") throw new CapabilityUnavailableError("storage", cap.reason);
    return cap.value;
  }

  private async read(ns: StorageNamespace): Promise<McpRegistryRecordV1> {
    const rec = await this.storage().get(ns, this.storageKey);
    if (!rec) return defaultRecord();
    try {
      return parseRegistryRecord(JSON.parse(rec.value));
    } catch {
      return defaultRecord();
    }
  }

  private async write(ns: StorageNamespace, record: McpRegistryRecordV1): Promise<void> {
    await this.storage().set(ns, this.storageKey, JSON.stringify(record), {});
  }

  async snapshot(): Promise<{ app: McpRegistryRecordV1; workspace: McpRegistryRecordV1 | null }> {
    const app = await this.read(this.appNs);
    const workspace = this.workspaceNs ? await this.read(this.workspaceNs) : null;
    return { app, workspace };
  }

  async listServers(): Promise<McpServerConfig[]> {
    const { app, workspace } = await this.snapshot();
    const merged: Record<string, McpServerConfig> = { ...app.servers, ...(app.managedServers ?? {}) };
    if (workspace) {
      for (const [id, cfg] of Object.entries(workspace.servers)) {
        if (merged[id]) merged[id] = { ...merged[id]!, ...cfg };
      }
    }
    return Object.values(merged).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  async upsertServer(config: McpServerConfig, options?: { scope?: "app" | "workspace" }): Promise<void> {
    const scope = options?.scope ?? "app";
    if (config.trust === "managed") throw new ProtocolError("Managed MCP servers cannot be edited");
    const ns = scope === "workspace" && this.workspaceNs ? this.workspaceNs : this.appNs;
    const record = await this.read(ns);
    record.servers[config.id] = config;
    await this.write(ns, record);
  }

  async removeServer(id: McpServerId, options?: { scope?: "app" | "workspace" }): Promise<void> {
    const scope = options?.scope ?? "app";
    const ns = scope === "workspace" && this.workspaceNs ? this.workspaceNs : this.appNs;
    const record = await this.read(ns);
    delete record.servers[id];
    await this.write(ns, record);
  }

  async setManagedServers(servers: McpServerConfig[]): Promise<void> {
    const record = await this.read(this.appNs);
    const managed: Record<string, McpServerConfig> = {};
    for (const s of servers) {
      managed[s.id] = { ...s, trust: "managed" };
    }
    record.managedServers = managed;
    await this.write(this.appNs, record);
  }

  async importLegacyServers(legacy: Array<{ id: string; displayName?: string; enabled?: boolean }>): Promise<void> {
    const record = await this.read(this.appNs);
    for (const s of legacy) {
      record.servers[s.id] = {
        id: s.id,
        displayName: s.displayName ?? s.id,
        enabled: s.enabled ?? true,
        trust: "trusted"
      };
    }
    await this.write(this.appNs, record);
  }
}
