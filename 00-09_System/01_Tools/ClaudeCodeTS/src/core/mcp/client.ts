import type { HostCapabilities } from "../types/host.js";
import type { BackoffConfig } from "../network/retry.js";
import { retryWithBackoff } from "../network/retry.js";
import type { McpRequestEnvelopeV1, McpResponseEnvelopeV1 } from "./envelope.js";
import { assertValidMcpRequestEnvelopeV1 } from "./envelope.js";
import { AuthFailedError, CancelledError, ConfigMissingError, ProtocolError, ServerDisabledError, toMcpError } from "./errors.js";
import type {
  McpConnectionStatus,
  McpCorrelationIds,
  McpEndpointConfig,
  McpManifest,
  McpResourceDescriptor,
  McpServerConfig,
  McpServerId,
  McpServerStatus,
  McpToolCallParams,
  McpToolDescriptor,
  McpToolStreamEvent,
  McpTransportMode
} from "./types.js";
import type { McpTransport } from "./transport.js";
import { WarnOnce, type WarnSink } from "./warnOnce.js";
import { callMcpEndpoint } from "./endpointTransport.js";
import { McpManifestCache } from "./cache.js";
import { McpServerRegistry } from "./registry.js";
import { sha256HexForString } from "./hash.js";
import { asWorkspaceId, type WorkspaceId } from "../types/workspace.js";

export type McpRetryPolicy = {
  maxAttempts: number;
  backoff: BackoffConfig;
  sleep: (ms: number) => Promise<void>;
};

export type McpConcurrencyPolicy = {
  maxInFlightGlobal: number;
  maxInFlightPerServer: number;
};

type Limiter = {
  acquire: (key: string, options?: { signal?: AbortSignal }) => Promise<() => void>;
};

function createInMemoryLimiter(max: number): Limiter {
  let current = 0;
  const waiters: Array<() => void> = [];
  return {
    acquire: async (_key, options) => {
      if (options?.signal?.aborted) throw new CancelledError("MCP request cancelled", { cause: options.signal.reason });
      if (current < max) {
        current += 1;
        return () => {
          current -= 1;
          const next = waiters.shift();
          next?.();
        };
      }
      await new Promise<void>((resolve, reject) => {
        const onAbort = () => reject(new CancelledError("MCP request cancelled", { cause: options?.signal?.reason }));
        options?.signal?.addEventListener("abort", onAbort, { once: true });
        waiters.push(() => {
          options?.signal?.removeEventListener("abort", onAbort);
          resolve();
        });
      });
      current += 1;
      return () => {
        current -= 1;
        const next = waiters.shift();
        next?.();
      };
    }
  };
}

function nowWallMs(host: HostCapabilities): number {
  const clock = host.clock;
  if (clock.kind !== "available") return Date.now();
  return clock.value.nowWallMs ? clock.value.nowWallMs() : Date.now();
}

export type McpEndpointConfigProvider = {
  get: (options?: { signal?: AbortSignal }) => Promise<McpEndpointConfig | null>;
  invalidate?: (reason?: string) => Promise<void>;
};

export function createMcpEndpointConfigProvider(options: {
  host: HostCapabilities;
  workspaceId?: WorkspaceId;
  ttlMs: number;
  explicit?: McpEndpointConfig | null;
  discover?: (options?: { signal?: AbortSignal }) => Promise<McpEndpointConfig | null>;
}): McpEndpointConfigProvider {
  const storage = options.host.storage;
  const crypto = options.host.crypto;
  const secrets = options.host.secrets;
  const ns = { scope: "workspace", workspaceId: options.workspaceId ?? asWorkspaceId("default") } as const;
  const key = "mcp/endpoint-config/v1";
  let memo: { value: McpEndpointConfig | null; expiresAtWallMs: number } | null = null;

  const identityHash = async (): Promise<string | null> => {
    if (crypto.kind !== "available") return null;
    if (secrets.kind !== "available") return null;
    const token = await secrets.value.getSecret("claude_code/session_access_token");
    if (!token) return null;
    return await sha256HexForString(crypto.value, token);
  };

  const loadStored = async (): Promise<McpEndpointConfig | null> => {
    if (storage.kind !== "available") return null;
    const rec = await storage.value.get(ns, key);
    if (!rec) return null;
    try {
      const parsed = JSON.parse(rec.value) as any;
      if (!parsed || typeof parsed.url !== "string" || typeof parsed.bearerKey !== "string") return null;
      const exp = typeof parsed.expiresAtWallMs === "number" ? parsed.expiresAtWallMs : null;
      if (exp !== null && exp <= nowWallMs(options.host)) return null;
      const storedAuth = typeof parsed.authIdentityHash === "string" ? parsed.authIdentityHash : null;
      const curAuth = await identityHash();
      if (storedAuth && curAuth && storedAuth !== curAuth) return null;
      return {
        url: parsed.url,
        bearerKey: parsed.bearerKey,
        fetchedAtWallMs: typeof parsed.fetchedAtWallMs === "number" ? parsed.fetchedAtWallMs : undefined,
        expiresAtWallMs: exp ?? undefined,
        ...(storedAuth ? { authIdentityHash: storedAuth } : {})
      };
    } catch {
      return null;
    }
  };

  const store = async (cfg: McpEndpointConfig): Promise<void> => {
    if (storage.kind !== "available") return;
    const auth = await identityHash();
    await storage.value.set(
      ns,
      key,
      JSON.stringify({
        schemaVersion: 1,
        url: cfg.url,
        bearerKey: cfg.bearerKey,
        fetchedAtWallMs: cfg.fetchedAtWallMs ?? nowWallMs(options.host),
        ...(cfg.expiresAtWallMs !== undefined ? { expiresAtWallMs: cfg.expiresAtWallMs } : {}),
        ...(auth ? { authIdentityHash: auth } : {})
      }),
      {}
    );
  };

  return {
    get: async (getOptions) => {
      if (options.explicit) return options.explicit;
      const now = nowWallMs(options.host);
      if (memo && memo.expiresAtWallMs > now) return memo.value;

      const cached = await loadStored();
      if (cached) {
        memo = { value: cached, expiresAtWallMs: now + Math.max(0, options.ttlMs) };
        return cached;
      }

      const discovered = options.discover ? await options.discover(getOptions) : null;
      if (discovered) await store(discovered);
      memo = { value: discovered, expiresAtWallMs: now + Math.max(0, options.ttlMs) };
      return discovered;
    },
    invalidate: async () => {
      memo = null;
      if (storage.kind !== "available") return;
      await storage.value.delete(ns, key, {});
    }
  };
}

export type McpClientOptions = {
  host: HostCapabilities;
  workspaceId?: WorkspaceId;
  endpoint: {
    allowed: boolean;
    provider: McpEndpointConfigProvider;
    warn?: WarnSink;
    skipTelemetry?: boolean;
  };
  direct?: McpTransport;
  retry?: McpRetryPolicy;
  concurrency?: Partial<McpConcurrencyPolicy>;
  manifestCacheTtlMs?: number;
};

export class McpClient {
  private readonly host: HostCapabilities;
  private readonly endpointAllowed: boolean;
  private readonly endpointProvider: McpEndpointConfigProvider;
  private readonly warnSink: WarnSink | undefined;
  private readonly warnOnce = new WarnOnce();
  private readonly direct: McpTransport | undefined;
  private readonly retry: McpRetryPolicy | null;
  private readonly globalLimiter: Limiter;
  private readonly perServerLimiters = new Map<string, Limiter>();
  private readonly maxPerServer: number;
  private readonly registry: McpServerRegistry;
  private readonly manifestCache: McpManifestCache;
  private readonly skipTelemetryInEndpointMode: boolean;
  private readonly connection = new Map<
    McpServerId,
    { status: McpConnectionStatus; mode?: McpTransportMode; error?: string; hasTools: boolean; hasResources: boolean }
  >();

  constructor(options: McpClientOptions) {
    this.host = options.host;
    this.endpointAllowed = options.endpoint.allowed;
    this.endpointProvider = options.endpoint.provider;
    this.warnSink = options.endpoint.warn;
    this.direct = options.direct;
    this.retry = options.retry ?? null;
    const maxGlobal = Math.max(1, options.concurrency?.maxInFlightGlobal ?? 16);
    this.maxPerServer = Math.max(1, options.concurrency?.maxInFlightPerServer ?? 4);
    this.globalLimiter = createInMemoryLimiter(maxGlobal);
    this.registry = new McpServerRegistry({ host: options.host, ...(options.workspaceId ? { workspaceId: options.workspaceId } : {}) });
    this.manifestCache = new McpManifestCache({
      host: options.host,
      ...(options.workspaceId ? { workspaceId: options.workspaceId } : {}),
      ttlMs: options.manifestCacheTtlMs ?? 5 * 60_000
    });
    this.skipTelemetryInEndpointMode = options.endpoint.skipTelemetry ?? true;
  }

  private perServerLimiter(serverId: string): Limiter {
    const existing = this.perServerLimiters.get(serverId);
    if (existing) return existing;
    const limiter = createInMemoryLimiter(this.maxPerServer);
    this.perServerLimiters.set(serverId, limiter);
    return limiter;
  }

  private async acquireLimits(serverId: string, options?: { signal?: AbortSignal }): Promise<() => void> {
    const releaseGlobal = await this.globalLimiter.acquire("mcp_global", options);
    try {
      const releaseServer = await this.perServerLimiter(serverId).acquire(`mcp_server_${serverId}`, options);
      return () => {
        releaseServer();
        releaseGlobal();
      };
    } catch (err) {
      releaseGlobal();
      throw err;
    }
  }

  async listServers(): Promise<McpServerStatus[]> {
    const servers = await this.registry.listServers();
    return servers.map((s) => ({
      id: s.id,
      displayName: s.displayName,
      trust: s.trust,
      enabled: s.enabled,
      ...(this.connection.get(s.id)?.mode ? { mode: this.connection.get(s.id)!.mode } : {}),
      status: this.connection.get(s.id)?.status ?? "disconnected",
      hasTools: this.connection.get(s.id)?.hasTools ?? false,
      hasResources: this.connection.get(s.id)?.hasResources ?? false,
      ...(this.connection.get(s.id)?.error ? { error: this.connection.get(s.id)!.error } : {})
    }));
  }

  async registerServer(config: McpServerConfig, options?: { scope?: "app" | "workspace" }): Promise<void> {
    await this.registry.upsertServer(config, options);
  }

  async removeServer(serverId: McpServerId, options?: { scope?: "app" | "workspace" }): Promise<void> {
    await this.registry.removeServer(serverId, options);
    await this.manifestCache.invalidate(serverId);
  }

  async listTools(options: { serverId?: McpServerId; signal?: AbortSignal } = {}): Promise<McpToolDescriptor[]> {
    const servers = await this.registry.listServers();
    const ids = options.serverId ? [options.serverId] : servers.filter((s) => s.enabled).map((s) => s.id);
    const out: McpToolDescriptor[] = [];
    for (const id of ids) {
      const manifest = await this.getOrRefreshManifest(id, options.signal ? { signal: options.signal } : {});
      out.push(...manifest.tools);
    }
    return out;
  }

  async listResources(options: { serverId?: McpServerId; signal?: AbortSignal } = {}): Promise<McpResourceDescriptor[]> {
    const servers = await this.registry.listServers();
    const ids = options.serverId ? [options.serverId] : servers.filter((s) => s.enabled).map((s) => s.id);
    const out: McpResourceDescriptor[] = [];
    for (const id of ids) {
      const manifest = await this.getOrRefreshManifest(id, options.signal ? { signal: options.signal } : {});
      out.push(...manifest.resources);
    }
    return out;
  }

  async grepTools(pattern: RegExp, options?: { signal?: AbortSignal }): Promise<McpToolDescriptor[]> {
    const tools = await this.listTools(options?.signal ? { signal: options.signal } : {});
    return tools.filter((t) => pattern.test(`${t.serverId}/${t.name}${t.description ? ` ${t.description}` : ""}`));
  }

  async getToolInfo(serverId: McpServerId, toolName: string, options?: { signal?: AbortSignal }): Promise<McpToolDescriptor | null> {
    const manifest = await this.getOrRefreshManifest(serverId, options?.signal ? { signal: options.signal } : {});
    const found = manifest.tools.find((t) => t.name === toolName) ?? null;
    if (found) return found;
    const req: McpRequestEnvelopeV1 = {
      kind: "mcp_envelope",
      schemaVersion: 1,
      type: "request",
      requestId: this.newRequestId(),
      op: "mcp.tools/info",
      correlation: { serverId },
      params: { serverId, toolName }
    };
    const res = await this.sendWithFallback(serverId, req, options?.signal ? { signal: options.signal } : {});
    if (!res.ok) return null;
    return (res.result as any)?.tool ?? null;
  }

  async readResource(serverId: McpServerId, uri: string, options?: { signal?: AbortSignal; timeoutMs?: number }): Promise<unknown> {
    const req: McpRequestEnvelopeV1 = {
      kind: "mcp_envelope",
      schemaVersion: 1,
      type: "request",
      requestId: this.newRequestId(),
      op: "mcp.resources/read",
      correlation: { serverId },
      params: { serverId, uri }
    };
    const res = await this.sendWithFallback(
      serverId,
      req,
      options?.signal ? { signal: options.signal, ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}) } : options?.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}
    );
    if (!res.ok) throw new ProtocolError(res.error?.message ?? "MCP resources/read failed", { details: res.error });
    return res.result;
  }

  async callToolOnce(params: McpToolCallParams, options?: { signal?: AbortSignal }): Promise<unknown> {
    let last: unknown = null;
    for await (const evt of this.callToolStream(params, options?.signal ? { signal: options.signal } : {})) {
      if (evt.kind === "final") last = evt.value;
    }
    return last;
  }

  private async getOrRefreshManifest(serverId: McpServerId, options?: { signal?: AbortSignal }): Promise<McpManifest> {
    const cached = await this.manifestCache.get(serverId);
    if (cached) return cached;
    const correlation: McpCorrelationIds = { ...(serverId ? { serverId } : {}) };
    const req: McpRequestEnvelopeV1 = {
      kind: "mcp_envelope",
      schemaVersion: 1,
      type: "request",
      requestId: this.newRequestId(),
      op: "mcp.tools/list",
      correlation,
      params: { serverId }
    };
    const res = await this.sendWithFallback(serverId, req, options?.signal ? { signal: options.signal } : {});
    if (!res.ok) throw new ProtocolError(res.error?.message ?? "MCP tools/list failed", { details: res.error });
    const tools = (res.result as any)?.tools;
    const resources = (res.result as any)?.resources;
    const m: Omit<McpManifest, "manifestHash"> = {
      serverId,
      tools: Array.isArray(tools) ? (tools as McpToolDescriptor[]) : [],
      resources: Array.isArray(resources) ? (resources as McpResourceDescriptor[]) : [],
      fetchedAtMonoMs: this.host.clock.kind === "available" ? this.host.clock.value.nowMs() : 0
    };
    const stored = await this.manifestCache.set(m);
    const prev = this.connection.get(serverId);
    this.connection.set(serverId, {
      status: "connected",
      ...(prev?.mode ? { mode: prev.mode } : {}),
      hasTools: stored.stored.tools.length > 0,
      hasResources: stored.stored.resources.length > 0
    });
    return stored.stored;
  }

  private newRequestId(): string {
    const rnd = this.host.random;
    if (rnd.kind === "available") return `mcp_req_${rnd.value.randomUUID()}`;
    return `mcp_req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  private async withRetry<T>(fn: () => Promise<T>, options?: { signal?: AbortSignal }): Promise<T> {
    if (!this.retry) return await fn();
    return await retryWithBackoff(
      async () => await fn(),
      {
        maxAttempts: this.retry.maxAttempts,
        backoff: this.retry.backoff,
        sleep: this.retry.sleep,
        ...(options?.signal ? { signal: options.signal } : {}),
        shouldRetry: (err) => toMcpError(err).retryable
      }
    );
  }

  private async sendEndpoint(req: McpRequestEnvelopeV1, options?: { signal?: AbortSignal; timeoutMs?: number }): Promise<McpResponseEnvelopeV1> {
    const endpoint = await this.endpointProvider.get(options?.signal ? { signal: options.signal } : undefined);
    if (!endpoint) throw new ConfigMissingError("MCP endpoint config missing");
    return await this.withRetry(
      async () =>
        await callMcpEndpoint(this.host, endpoint, req, {
          ...(options?.signal ? { signal: options.signal } : {}),
          ...(options?.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
          ...(this.retry
            ? { retry: { maxAttempts: this.retry.maxAttempts, backoff: this.retry.backoff, sleep: this.retry.sleep } }
            : {}),
          ...(this.skipTelemetryInEndpointMode ? { skipTelemetry: true } : {})
        }),
      options?.signal ? { signal: options.signal } : undefined
    );
  }

  private async sendDirect(req: McpRequestEnvelopeV1, options?: { signal?: AbortSignal; timeoutMs?: number }): Promise<McpResponseEnvelopeV1> {
    const direct = this.direct;
    if (!direct) throw new ConfigMissingError("Direct MCP transport not available");
    return await this.withRetry(async () => await direct.send(req, options), options?.signal ? { signal: options.signal } : undefined);
  }

  private shouldWarnMissingEndpoint(sessionKey?: string): void {
    if (!this.warnSink) return;
    const key = `mcp_endpoint_missing:${sessionKey ?? "default"}`;
    this.warnOnce.warn(key, "Warning: MCP endpoint config missing; falling back to direct mode if available.", this.warnSink);
  }

  private async sendWithFallback(
    serverId: McpServerId,
    req: McpRequestEnvelopeV1,
    options?: { signal?: AbortSignal; timeoutMs?: number; serverConfig?: McpServerConfig }
  ): Promise<McpResponseEnvelopeV1> {
    const cfg = options?.serverConfig ?? (await this.registry.listServers()).find((s) => s.id === serverId) ?? null;
    if (cfg && !cfg.enabled) throw new ServerDisabledError(`MCP server '${serverId}' is disabled`);

    const prefer: McpTransportMode = cfg?.preferredMode ?? "direct";
    const tryEndpointFirst = prefer === "endpoint";

    const attempt = async (mode: McpTransportMode): Promise<McpResponseEnvelopeV1> => {
      this.connection.set(serverId, { status: "connecting", mode, hasTools: false, hasResources: false });
      const release = await this.acquireLimits(serverId, options?.signal ? { signal: options.signal } : undefined);
      try {
        if (mode === "direct") return await this.sendDirect(req, options);
        if (!this.endpointAllowed) throw new ConfigMissingError("Endpoint mode not allowed");
        return await this.sendEndpoint(req, options);
      } finally {
        release();
      }
    };

    try {
      const res = await attempt(tryEndpointFirst ? "endpoint" : "direct");
      this.connection.set(serverId, { status: "connected", mode: tryEndpointFirst ? "endpoint" : "direct", hasTools: false, hasResources: false });
      return res;
    } catch (err) {
      const e = toMcpError(err);
      this.connection.set(serverId, { status: "error", ...(tryEndpointFirst ? { mode: "endpoint" } : { mode: "direct" }), error: e.message, hasTools: false, hasResources: false });
      if (e instanceof AuthFailedError && this.endpointProvider.invalidate) await this.endpointProvider.invalidate("auth_failed");
      if (!this.endpointAllowed && tryEndpointFirst) throw e;
      if (tryEndpointFirst) {
        this.shouldWarnMissingEndpoint(this.host.process.kind === "available" ? this.host.process.value.getCwd?.() : undefined);
        const res = await attempt("direct");
        this.connection.set(serverId, { status: "connected", mode: "direct", hasTools: false, hasResources: false });
        return res;
      }
      if (this.endpointAllowed) {
        try {
          const res = await attempt("endpoint");
          this.connection.set(serverId, { status: "connected", mode: "endpoint", hasTools: false, hasResources: false });
          return res;
        } catch (err2) {
          throw toMcpError(err2);
        }
      }
      throw e;
    }
  }

  async send(req: McpRequestEnvelopeV1, options?: { signal?: AbortSignal; timeoutMs?: number }): Promise<McpResponseEnvelopeV1> {
    const validated = assertValidMcpRequestEnvelopeV1(req);
    const serverId = validated.correlation.serverId;
    if (!serverId) throw new ProtocolError("MCP request missing correlation.serverId");
    return await this.sendWithFallback(serverId, validated, options);
  }

  async *callToolStream(params: McpToolCallParams, options?: { signal?: AbortSignal }): AsyncIterable<McpToolStreamEvent> {
    const cfg = (await this.registry.listServers()).find((s) => s.id === params.serverId) ?? null;
    if (cfg && !cfg.enabled) throw new ServerDisabledError(`MCP server '${params.serverId}' is disabled`);
    const release = await this.acquireLimits(params.serverId, options?.signal ? { signal: options.signal } : undefined);
    try {
      if (cfg?.preferredMode === "endpoint") {
        if (!this.endpointAllowed) throw new ConfigMissingError("Endpoint mode not allowed");
        const endpoint = await this.endpointProvider.get(options?.signal ? { signal: options.signal } : undefined);
        if (!endpoint) {
          this.shouldWarnMissingEndpoint();
          if (this.direct) yield* this.direct.callToolStream(params, options?.signal ? { signal: options.signal } : {});
          else throw new ConfigMissingError("MCP endpoint config missing");
          return;
        }
        const req: McpRequestEnvelopeV1 = {
          kind: "mcp_envelope",
          schemaVersion: 1,
          type: "request",
          requestId: this.newRequestId(),
          op: "mcp.tools/call",
          correlation: { serverId: params.serverId },
          params
        };
	        const res = await this.withRetry(
	          async () =>
	            await callMcpEndpoint(this.host, endpoint, req, {
	              ...(options?.signal ? { signal: options.signal } : {}),
	              timeoutMs: params.timeoutMs,
	              ...(this.retry
	                ? { retry: { maxAttempts: this.retry.maxAttempts, backoff: this.retry.backoff, sleep: this.retry.sleep } }
	                : {})
	            }),
	          options?.signal ? { signal: options.signal } : undefined
	        );
        if (!res.ok) throw new ProtocolError(res.error?.message ?? "MCP tool call failed", { details: res.error });
        yield { kind: "diagnostic", message: "streaming_unavailable: endpoint mode buffered response" };
        yield { kind: "final", value: res.result };
        return;
      }

      if (!this.direct) {
        if (this.endpointAllowed) {
          const endpoint = await this.endpointProvider.get(options?.signal ? { signal: options.signal } : undefined);
          if (!endpoint) throw new ConfigMissingError("MCP endpoint config missing");
          const req: McpRequestEnvelopeV1 = {
            kind: "mcp_envelope",
            schemaVersion: 1,
            type: "request",
            requestId: this.newRequestId(),
            op: "mcp.tools/call",
            correlation: { serverId: params.serverId },
            params
          };
          const res = await this.withRetry(
            async () => await callMcpEndpoint(this.host, endpoint, req, { ...(options?.signal ? { signal: options.signal } : {}), timeoutMs: params.timeoutMs }),
            options?.signal ? { signal: options.signal } : undefined
          );
          if (!res.ok) throw new ProtocolError(res.error?.message ?? "MCP tool call failed", { details: res.error });
          yield { kind: "diagnostic", message: "streaming_unavailable: endpoint mode buffered response" };
          yield { kind: "final", value: res.result };
          return;
        }
        throw new ConfigMissingError("No MCP transports available");
      }

      yield* this.direct.callToolStream(params, options?.signal ? { signal: options.signal } : {});
    } catch (err) {
      const e = toMcpError(err);
      if (e.code === "connection_failed" && this.endpointAllowed) {
        try {
          const endpoint = await this.endpointProvider.get(options?.signal ? { signal: options.signal } : undefined);
          if (!endpoint) throw e;
          const req: McpRequestEnvelopeV1 = {
            kind: "mcp_envelope",
            schemaVersion: 1,
            type: "request",
            requestId: this.newRequestId(),
            op: "mcp.tools/call",
            correlation: { serverId: params.serverId },
            params
          };
          const res = await this.withRetry(
            async () => await callMcpEndpoint(this.host, endpoint, req, { ...(options?.signal ? { signal: options.signal } : {}), timeoutMs: params.timeoutMs }),
            options?.signal ? { signal: options.signal } : undefined
          );
          if (!res.ok) throw new ProtocolError(res.error?.message ?? "MCP tool call failed", { details: res.error });
          yield { kind: "diagnostic", message: "streaming_unavailable: fallback to endpoint buffered response" };
          yield { kind: "final", value: res.result };
          return;
        } catch (err2) {
          throw toMcpError(err2);
        }
      }
      throw e;
    } finally {
      release();
    }
  }
}
