import { describe, expect, test } from "bun:test";
import crypto from "node:crypto";

import { availableCapability, unavailableCapability, type HostCapabilities, type HostCrypto, type HostStorage, type StorageNamespace } from "../src/core/types/host.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { ToolRegistry, ToolRunner } from "../src/core/tools/index.js";
import { createToolPipelineHooks, normalizeHooksConfig } from "../src/core/hooks/index.js";
import { computeMcpCliGateSnapshotFromEnv } from "../src/core/settings/effectiveConfig.js";
import { McpClient, createMcpEndpointConfigProvider } from "../src/core/mcp/client.js";
import { createMcpToolDefinition } from "../src/core/mcp/tools.js";
import { McpManifestCache } from "../src/core/mcp/cache.js";
import { CancelledError, ConnectionFailedError } from "../src/core/mcp/errors.js";
import type { McpToolStreamEvent } from "../src/core/mcp/types.js";
import type { McpTransport } from "../src/core/mcp/transport.js";
import { asWorkspaceId } from "../src/core/types/workspace.js";

function nsKey(ns: StorageNamespace): string {
  return `${ns.scope}:${ns.workspaceId ?? ""}:${ns.sessionId ?? ""}`;
}

function computeVersion(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function createInMemoryStorage(): HostStorage {
  const data = new Map<string, { value: string; version: string }>();
  return {
    get: async (ns, key) => {
      const rec = data.get(`${nsKey(ns)}:${key}`);
      if (!rec) return null;
      return { value: rec.value, version: rec.version };
    },
    set: async (ns, key, value) => {
      const version = computeVersion(value);
      data.set(`${nsKey(ns)}:${key}`, { value, version });
      return { version };
    },
    delete: async (ns, key) => {
      data.delete(`${nsKey(ns)}:${key}`);
    }
  };
}

function createHost(options: { fetchImpl?: typeof fetch; secrets?: Record<string, string> } = {}): HostCapabilities {
  const clock = new TestClock(1);
  const cryptoCap: HostCrypto = {
    digest: async (_alg, data) => new Uint8Array(crypto.createHash("sha256").update(Buffer.from(data)).digest())
  };

  return {
    clock: availableCapability(clock),
    random: availableCapability({ randomUUID: () => crypto.randomUUID() }),
    crypto: availableCapability(cryptoCap),
    secrets: availableCapability({
      getSecret: async (name) => options.secrets?.[name] ?? null
    }),
    storage: availableCapability(createInMemoryStorage()),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: options.fetchImpl ? availableCapability({ fetch: options.fetchImpl }) : unavailableCapability({ kind: "not-provided" }),
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

describe("Phase 10: MCP integration", () => {
  test("MCP CLI feature gate parsing treats ENABLE_MCP_CLI_ENDPOINT=off as disabled", () => {
    const snap = computeMcpCliGateSnapshotFromEnv({ ENABLE_EXPERIMENTAL_MCP_CLI: "1", ENABLE_MCP_CLI_ENDPOINT: "off" });
    expect(snap.enableExperimentalMcpCli).toBe(true);
    expect(snap.enableMcpCliEndpoint).toBe(false);
  });

  test("manifest cache detects schema drift by hash", async () => {
    const host = createHost();
    const cache = new McpManifestCache({ host, workspaceId: asWorkspaceId("ws"), ttlMs: 60_000 });
    const a = await cache.set({ serverId: "s1", tools: [{ serverId: "s1", name: "t1" }], resources: [], fetchedAtMonoMs: 1 });
    const b = await cache.set({ serverId: "s1", tools: [{ serverId: "s1", name: "t2" }], resources: [], fetchedAtMonoMs: 2 });
    expect(a.stored.manifestHash).toBeDefined();
    expect(b.drift?.previousHash).toBe(a.stored.manifestHash);
    expect(b.drift?.nextHash).toBe(b.stored.manifestHash);
  });

  test("retry/backoff retries retryable MCP errors deterministically", async () => {
    const host = createHost();
    const endpointProvider = createMcpEndpointConfigProvider({ host, workspaceId: asWorkspaceId("ws"), ttlMs: 1_000, explicit: null, discover: async () => null });
    let attempts = 0;
    const direct: McpTransport = {
      mode: "direct",
      capabilities: { supportsStreaming: false },
      send: async (req) => {
        attempts += 1;
        if (attempts < 3) throw new ConnectionFailedError("transient");
        return {
          kind: "mcp_envelope",
          schemaVersion: 1,
          type: "response",
          requestId: req.requestId,
          op: req.op,
          correlation: req.correlation,
          ok: true,
          result: { ok: true }
        };
      },
      callToolStream: async function* () {
        yield { kind: "final", value: { ok: true } };
      }
    };

    const client = new McpClient({
      host,
      workspaceId: asWorkspaceId("ws"),
      endpoint: { allowed: false, provider: endpointProvider },
      direct,
      retry: {
        maxAttempts: 3,
        backoff: { baseMs: 1, factor: 1, maxMs: 1, jitter: "none" },
        sleep: async () => {}
      }
    });

    await client.registerServer({ id: "srv1", displayName: "Server 1", enabled: true, trust: "trusted", preferredMode: "direct" });
    const res = await client.send({
      kind: "mcp_envelope",
      schemaVersion: 1,
      type: "request",
      requestId: "req",
      op: "mcp.tools/list",
      correlation: { serverId: "srv1" },
      params: {}
    });
    expect(res.ok).toBe(true);
    expect(attempts).toBe(3);
  });

  test("cancelled MCP requests stop cleanly", async () => {
    const host = createHost();
    const endpointProvider = createMcpEndpointConfigProvider({ host, workspaceId: asWorkspaceId("ws"), ttlMs: 1_000, explicit: null, discover: async () => null });
    const direct: McpTransport = {
      mode: "direct",
      capabilities: { supportsStreaming: true },
      send: async (req) => ({
        kind: "mcp_envelope",
        schemaVersion: 1,
        type: "response",
        requestId: req.requestId,
        op: req.op,
        correlation: req.correlation,
        ok: true,
        result: {}
      }),
      callToolStream: async function* (_params, options) {
        if (options.signal?.aborted) throw new CancelledError("aborted");
        yield { kind: "final", value: { ok: true } };
      }
    };

    const client = new McpClient({ host, workspaceId: asWorkspaceId("ws"), endpoint: { allowed: false, provider: endpointProvider }, direct });
    await client.registerServer({ id: "srv1", displayName: "Server 1", enabled: true, trust: "trusted", preferredMode: "direct" });

    const ctrl = new AbortController();
    ctrl.abort(new Error("cancel"));
    await expect(
      client.callToolOnce({ serverId: "srv1", tool: "x", args: {}, timeoutMs: 1_000 }, { signal: ctrl.signal })
    ).rejects.toBeInstanceOf(CancelledError);
  });

  test("MCP tools run through ToolRunner hooks, and endpoint-missing warning is warn-once", async () => {
    const host = createHost();
    const clock = host.clock.kind === "available" ? host.clock.value : new TestClock(1);
    const idSource = createMonotonicIdSource();

    let warnCount = 0;
    const endpointProvider = createMcpEndpointConfigProvider({
      host,
      workspaceId: asWorkspaceId("ws"),
      ttlMs: 1_000,
      explicit: null,
      discover: async () => null
    });

    const direct: McpTransport = {
      mode: "direct",
      capabilities: { supportsStreaming: true },
      send: async (req) => {
        return {
          kind: "mcp_envelope",
          schemaVersion: 1,
          type: "response",
          requestId: req.requestId,
          op: req.op,
          correlation: req.correlation,
          ok: true,
          result: { tools: [], resources: [] }
        };
      },
      callToolStream: async function* (_params, options) {
        if (options.signal?.aborted) throw options.signal.reason ?? new Error("aborted");
        yield { kind: "text", text: "hello" } satisfies McpToolStreamEvent;
        yield { kind: "final", value: { content: "hello" } } satisfies McpToolStreamEvent;
      }
    };

    const client = new McpClient({
      host,
      workspaceId: asWorkspaceId("ws"),
      endpoint: { allowed: true, provider: endpointProvider, warn: () => warnCount++ },
      direct
    });
    await client.registerServer({ id: "srv1", displayName: "Server 1", enabled: true, trust: "trusted", preferredMode: "endpoint" });

    const toolDef = createMcpToolDefinition({
      client,
      server: { id: "srv1", displayName: "Server 1", enabled: true, trust: "trusted", preferredMode: "endpoint" },
      tool: { serverId: "srv1", name: "echo" }
    });

    const registry = new ToolRegistry();
    registry.registerMcp(toolDef);

    const hooksInput = {
      PostToolUse: [
        {
          matcher: "*",
          hooks: [{ type: "workflow", actions: [{ kind: "UpdateToolOutput", mode: "merge_data", value: { note: "ok" } }] }]
        }
      ]
    };
    const normalized = normalizeHooksConfig(hooksInput, { source: "settings" });
    const pipelineHooks = createToolPipelineHooks({ host, clock, idSource, hooks: normalized.config, workspaceTrusted: true });
    const runner = new ToolRunner(registry, { host, idSource, clock, hooks: pipelineHooks });

    const res1 = await runner.run({ toolName: toolDef.name, input: { x: 1 } });
    expect(res1.kind).toBe("completed");
    expect((res1.result.data as any).note).toBe("ok");

    const res2 = await runner.run({ toolName: toolDef.name, input: { x: 2 } });
    expect(res2.kind).toBe("completed");
    expect(warnCount).toBe(1);
  });
});
