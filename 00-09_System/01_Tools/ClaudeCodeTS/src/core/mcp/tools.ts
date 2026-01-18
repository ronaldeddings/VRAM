import type { ToolDefinition, ToolResult } from "../tools/types.js";
import { toMcpToolName } from "../tools/registry.js";
import type { McpClient } from "./client.js";
import type { McpServerConfig, McpServerId, McpToolDescriptor, McpToolStreamEvent } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function normalizeMcpToolOutput(value: unknown): { streamEvents: McpToolStreamEvent[]; result: unknown } {
  if (isPlainObject(value) && "content" in value) return { streamEvents: [{ kind: "structured", value }], result: value };
  if (typeof value === "string") return { streamEvents: [{ kind: "text", text: value }], result: value };
  return { streamEvents: [{ kind: "structured", value }], result: value };
}

export function createMcpToolDefinition(options: {
  client: McpClient;
  server: McpServerConfig;
  tool: McpToolDescriptor;
}): ToolDefinition<unknown, unknown> {
  const toolName = toMcpToolName(options.server.id, options.tool.name);
  const trust = options.server.trust;
  return {
    id: `mcp/${options.server.id}/${options.tool.name}`,
    name: toolName,
    inputSchema: {
      schemaName: `${toolName}.in`,
      schemaVersion: 1,
      ...(options.tool.inputSchema ? { jsonSchema: options.tool.inputSchema } : {}),
      parse: (v) => ({ ok: true, value: v })
    },
    outputSchema: {
      schemaName: `${toolName}.out`,
      schemaVersion: 1,
      parse: (v) => ({ ok: true, value: v })
    },
    permissionCategories: ["network", "remote_execution"],
    riskLevel: trust === "untrusted" ? "high" : trust === "managed" ? "low" : "medium",
    idempotency: "unknown",
    requiresUserInteraction: trust === "untrusted",
    checkPermissions: async (_input, _ctx) => {
      if (trust === "untrusted") {
        return { behavior: "ask", explanation: `MCP server '${options.server.displayName}' is untrusted`, requiresUserInteraction: true };
      }
      return { behavior: "passthrough" };
    },
    run: async (ctx, input) => {
      const timeoutMs = ctx.budget?.timeoutMs ?? 100_000_000;
      const maxBytes = ctx.budget?.maxTotalOutputBytes;
      const encoder = new TextEncoder();
      const maxAggregateBytes = 8 * 1024;
      let textBuf = "";
      let textBufBytes = 0;
      let emittedAny = false;

      const flushText = async (): Promise<void> => {
        if (!textBuf) return;
        emittedAny = true;
        await ctx.emit({ kind: "text", payload: textBuf, sensitivity: "internal" });
        textBuf = "";
        textBufBytes = 0;
      };

      const appendText = async (chunk: string): Promise<void> => {
        if (!chunk) return;
        textBuf += chunk;
        textBufBytes += encoder.encode(chunk).byteLength;
        if (textBufBytes >= maxAggregateBytes) await flushText();
      };

      let final: unknown = null;
      for await (const evt of options.client.callToolStream(
        { serverId: options.server.id, tool: options.tool.name, args: input, timeoutMs },
        ctx.signal ? { signal: ctx.signal } : {}
      )) {
        if (evt.kind === "text") {
          await appendText(evt.text);
        } else if (evt.kind === "structured") {
          await flushText();
          emittedAny = true;
          await ctx.emit({ kind: "structured", payload: evt.value, sensitivity: "internal" });
        }
        else if (evt.kind === "progress")
          await ctx.emit({
            kind: "progress",
            payload: { message: evt.message, current: evt.current, total: evt.total },
            sensitivity: "internal",
            replaceKey: `mcp_progress:${ctx.toolRunId}`,
            uiOnly: true
          });
        else if (evt.kind === "diagnostic")
          await ctx.emit({ kind: "diagnostic", payload: { message: evt.message }, sensitivity: "internal", uiOnly: true });
        else if (evt.kind === "final") final = evt.value;
      }

      await flushText();

      const normalized = normalizeMcpToolOutput(final);
      if (!emittedAny) {
        for (const e of normalized.streamEvents) {
          if (e.kind === "text") await ctx.emit({ kind: "text", payload: e.text, sensitivity: "internal" });
          if (e.kind === "structured") await ctx.emit({ kind: "structured", payload: e.value, sensitivity: "internal" });
        }
      }

      const attemptAttachment = async (value: unknown): Promise<ToolResult> => {
        if (!ctx.attachments) return { data: value };
        if (typeof value === "string") {
          const b = encoder.encode(value).byteLength;
          if (maxBytes !== undefined && maxBytes >= 0 && b > maxBytes) {
            const ref = await ctx.attachments.putText(value, { mediaType: "text/plain", sensitivity: "internal" });
            await ctx.emit({ kind: "attachment", payload: ref, sensitivity: "internal", uiOnly: true });
            return { data: { truncated: true, attachment: ref, byteLength: b } };
          }
          return { data: value };
        }
        try {
          const json = JSON.stringify(value);
          const b = encoder.encode(json).byteLength;
          if (maxBytes !== undefined && maxBytes >= 0 && b > maxBytes) {
            const ref = await ctx.attachments.putJson(value, { mediaType: "application/json", sensitivity: "internal" });
            await ctx.emit({ kind: "attachment", payload: ref, sensitivity: "internal", uiOnly: true });
            return { data: { truncated: true, attachment: ref, byteLength: b } };
          }
        } catch {
          // ignore
        }
        return { data: value };
      };

      return await attemptAttachment(normalized.result);
    }
  };
}

export async function buildMcpToolsFromServer(options: { client: McpClient; server: McpServerConfig; signal?: AbortSignal }): Promise<ToolDefinition<any, any>[]> {
  const tools = await options.client.listTools({ serverId: options.server.id, ...(options.signal ? { signal: options.signal } : {}) });
  return tools.map((t) => createMcpToolDefinition({ client: options.client, server: options.server, tool: t }));
}
