import type { EngineInternalCommandDefinition } from "../commands/types.js";
import type { McpClient } from "./client.js";
import type { McpResourceDescriptor, McpServerStatus, McpToolDescriptor } from "./types.js";

function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}

function bad(message: string, details?: unknown): { ok: false; message: string; details?: unknown } {
  return { ok: false, message, ...(details !== undefined ? { details } : {}) };
}

function parseObject<T extends object>(value: unknown): value is T {
  return typeof value === "object" && value !== null;
}

export function createMcpEngineCommands(client: McpClient): Array<EngineInternalCommandDefinition<any, any>> {
  const listServers: EngineInternalCommandDefinition<{}, { servers: McpServerStatus[] }> = {
    name: "mcp.servers/list",
    requestSchema: { schemaName: "mcp.servers/list.in", schemaVersion: 1, parse: (v) => (v === undefined || parseObject(v) ? ok({}) : bad("expected object")) },
    responseSchema: { schemaName: "mcp.servers/list.out", schemaVersion: 1, parse: (v) => (parseObject(v) ? ok(v as any) : bad("expected object")) },
    run: async () => ({ servers: await client.listServers() })
  };

  const listTools: EngineInternalCommandDefinition<{ serverId?: string }, { tools: McpToolDescriptor[] }> = {
    name: "mcp.tools/list",
    requestSchema: {
      schemaName: "mcp.tools/list.in",
      schemaVersion: 1,
      parse: (v) => {
        if (v === undefined) return ok({});
        if (!parseObject(v)) return bad("expected object");
        const serverId = typeof (v as any).serverId === "string" ? (v as any).serverId : undefined;
        return ok({ ...(serverId ? { serverId } : {}) });
      }
    },
    responseSchema: { schemaName: "mcp.tools/list.out", schemaVersion: 1, parse: (v) => (parseObject(v) ? ok(v as any) : bad("expected object")) },
    run: async (p, options) => ({
      tools: await client.listTools({ ...(p.serverId ? { serverId: p.serverId } : {}), ...(options?.signal ? { signal: options.signal } : {}) })
    })
  };

  const listResources: EngineInternalCommandDefinition<{ serverId?: string }, { resources: McpResourceDescriptor[] }> = {
    name: "mcp.resources/list",
    requestSchema: listTools.requestSchema,
    responseSchema: { schemaName: "mcp.resources/list.out", schemaVersion: 1, parse: (v) => (parseObject(v) ? ok(v as any) : bad("expected object")) },
    run: async (p, options) => ({
      resources: await client.listResources({ ...(p.serverId ? { serverId: p.serverId } : {}), ...(options?.signal ? { signal: options.signal } : {}) })
    })
  };

  const grep: EngineInternalCommandDefinition<{ pattern: string }, { tools: McpToolDescriptor[] }> = {
    name: "mcp.grep",
    requestSchema: {
      schemaName: "mcp.grep.in",
      schemaVersion: 1,
      parse: (v) => {
        if (!parseObject(v)) return bad("expected object");
        const pattern = typeof (v as any).pattern === "string" ? (v as any).pattern : null;
        if (!pattern) return bad("expected pattern:string");
        return ok({ pattern });
      }
    },
    responseSchema: { schemaName: "mcp.grep.out", schemaVersion: 1, parse: (v) => (parseObject(v) ? ok(v as any) : bad("expected object")) },
    run: async (p, options) => ({ tools: await client.grepTools(new RegExp(p.pattern), options?.signal ? { signal: options.signal } : undefined) })
  };

  const toolInfo: EngineInternalCommandDefinition<{ serverId: string; toolName: string }, { tool: McpToolDescriptor | null }> = {
    name: "mcp.tools/info",
    requestSchema: {
      schemaName: "mcp.tools/info.in",
      schemaVersion: 1,
      parse: (v) => {
        if (!parseObject(v)) return bad("expected object");
        const serverId = typeof (v as any).serverId === "string" ? (v as any).serverId : null;
        const toolName = typeof (v as any).toolName === "string" ? (v as any).toolName : null;
        if (!serverId || !toolName) return bad("expected {serverId,toolName}");
        return ok({ serverId, toolName });
      }
    },
    responseSchema: { schemaName: "mcp.tools/info.out", schemaVersion: 1, parse: (v) => (parseObject(v) ? ok(v as any) : bad("expected object")) },
    run: async (p, options) => ({ tool: await client.getToolInfo(p.serverId, p.toolName, options?.signal ? { signal: options.signal } : undefined) })
  };

  const callTool: EngineInternalCommandDefinition<{ serverId: string; tool: string; args: unknown; timeoutMs?: number }, { result: unknown }> = {
    name: "mcp.tools/call",
    requestSchema: {
      schemaName: "mcp.tools/call.in",
      schemaVersion: 1,
      parse: (v) => {
        if (!parseObject(v)) return bad("expected object");
        const serverId = typeof (v as any).serverId === "string" ? (v as any).serverId : null;
        const tool = typeof (v as any).tool === "string" ? (v as any).tool : null;
        if (!serverId || !tool) return bad("expected {serverId,tool}");
        const timeoutMs = typeof (v as any).timeoutMs === "number" ? (v as any).timeoutMs : undefined;
        return ok({ serverId, tool, args: (v as any).args, ...(timeoutMs !== undefined ? { timeoutMs } : {}) });
      }
    },
    responseSchema: { schemaName: "mcp.tools/call.out", schemaVersion: 1, parse: (v) => (parseObject(v) ? ok(v as any) : bad("expected object")) },
    run: async (p, options) => ({
      result: await client.callToolOnce(
        { serverId: p.serverId, tool: p.tool, args: p.args, timeoutMs: p.timeoutMs ?? 100_000_000 },
        options?.signal ? { signal: options.signal } : undefined
      )
    })
  };

  const readResource: EngineInternalCommandDefinition<{ serverId: string; uri: string; timeoutMs?: number }, { result: unknown }> = {
    name: "mcp.resources/read",
    requestSchema: {
      schemaName: "mcp.resources/read.in",
      schemaVersion: 1,
      parse: (v) => {
        if (!parseObject(v)) return bad("expected object");
        const serverId = typeof (v as any).serverId === "string" ? (v as any).serverId : null;
        const uri = typeof (v as any).uri === "string" ? (v as any).uri : null;
        if (!serverId || !uri) return bad("expected {serverId,uri}");
        const timeoutMs = typeof (v as any).timeoutMs === "number" ? (v as any).timeoutMs : undefined;
        return ok({ serverId, uri, ...(timeoutMs !== undefined ? { timeoutMs } : {}) });
      }
    },
    responseSchema: { schemaName: "mcp.resources/read.out", schemaVersion: 1, parse: (v) => ok({ result: v }) },
    run: async (p, options) => ({
      result: await client.readResource(p.serverId, p.uri, { ...(options?.signal ? { signal: options.signal } : {}), ...(p.timeoutMs !== undefined ? { timeoutMs: p.timeoutMs } : {}) })
    })
  };

  return [listServers, listTools, toolInfo, listResources, grep, callTool, readResource];
}
