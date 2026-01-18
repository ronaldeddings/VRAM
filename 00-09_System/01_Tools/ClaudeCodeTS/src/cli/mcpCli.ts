import { computeMcpCliGateSnapshotFromEnv, type EffectiveConfig } from "../core/settings/effectiveConfig.js";
import { McpClient, createMcpEndpointConfigProvider } from "../core/mcp/client.js";
import { createNodeHostCapabilities } from "../platform/node/host.js";
import type { McpEndpointConfig } from "../core/mcp/types.js";
import { ConfigMissingError } from "../core/mcp/errors.js";
import { createEndpointModeTelemetryDedupePolicy, createTelemetryReporter } from "../core/observability/telemetry.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { canonicalizeLegacyToolIdentifier } from "../core/migration/toolMapping.js";

type McpCliGates = EffectiveConfig["mcpCli"];

function printHelp(): void {
  process.stdout.write(
    [
      "Usage: claude-ts --mcp-cli <command> [options]",
      "",
      "Commands:",
      "  info                    Print MCP CLI mode info (endpoint/state-file)",
      "  servers                 List connected MCP servers (endpoint or state-file)",
      "  tools [--server <id>]   List tools (endpoint or state-file)",
      "  resources [--server <id>]  List resources (endpoint or state-file)",
      "  grep <pattern>          Grep tool names/descriptions (endpoint or state-file)",
      "  call <server/tool> <jsonArgs>   Call a tool once (endpoint only)",
      "  read <server> <uri>     Read a resource (endpoint only)",
      "",
      "Options:",
      "  --json                  Output JSON",
      "  --endpoint-url <url>    Explicit MCP endpoint URL (overrides stored config)",
      "  --endpoint-bearer-key <key>  Explicit MCP endpoint bearer key",
      "  --timeout <ms>          Timeout (call/read)",
      "  --help                  Show help",
      "",
      "Env:",
      "  ENABLE_EXPERIMENTAL_MCP_CLI=1 to enable this mode",
      "  ENABLE_MCP_CLI_ENDPOINT=off to disable endpoint usage",
      "  MCP_CLI_ENDPOINT_URL / MCP_CLI_ENDPOINT_BEARER_KEY for manual endpoint config",
      "  USE_MCP_CLI_DIR overrides legacy state/endpoint dir (default: OS tmpdir)",
      "  CLAUDE_CODE_SESSION_ID selects which legacy state/endpoint files to read"
    ].join("\n") + "\n"
  );
}

function parseArgs(argv: string[]): {
  cmd: string | null;
  positionals: string[];
  json: boolean;
  timeoutMs: number | undefined;
  endpointUrl: string | undefined;
  endpointBearerKey: string | undefined;
  serverId: string | undefined;
} {
  let json = false;
  const positionals: string[] = [];
  let timeoutMs: number | undefined = undefined;
  let endpointUrl: string | undefined = undefined;
  let endpointBearerKey: string | undefined = undefined;
  let serverId: string | undefined = undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--json") {
      json = true;
      continue;
    }
    if (a === "--timeout") {
      const v = argv[i + 1];
      i += 1;
      const n = v ? Number.parseInt(v, 10) : NaN;
      if (Number.isFinite(n)) timeoutMs = n;
      continue;
    }
    if (a === "--endpoint-url") {
      endpointUrl = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === "--endpoint-bearer-key") {
      endpointBearerKey = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === "--server") {
      serverId = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === "--help") return { cmd: null, positionals: [], json, timeoutMs, endpointUrl, endpointBearerKey, serverId };
    if (a.startsWith("-")) continue;
    positionals.push(a);
  }

  const cmd = positionals[0] ?? null;
  return { cmd, positionals: positionals.slice(1), json, timeoutMs, endpointUrl, endpointBearerKey, serverId };
}

function parseServerTool(input: string): { serverId: string; tool: string } | null {
  const idx = input.indexOf("/");
  if (idx <= 0) return null;
  const serverId = input.slice(0, idx);
  const tool = input.slice(idx + 1);
  if (!serverId || !tool) return null;
  return { serverId, tool };
}

function endpointFromEnv(): McpEndpointConfig | null {
  const url = process.env.MCP_CLI_ENDPOINT_URL ?? process.env.MCP_ENDPOINT_URL ?? null;
  const bearerKey = process.env.MCP_CLI_ENDPOINT_BEARER_KEY ?? process.env.MCP_ENDPOINT_BEARER_KEY ?? null;
  if (!url || !bearerKey) return null;
  return { url, bearerKey };
}

function legacyMcpCliDir(): string {
  return process.env.USE_MCP_CLI_DIR ?? path.join(os.tmpdir(), "claude-code-mcp-cli");
}

function legacySessionId(): string | null {
  const v = process.env.CLAUDE_CODE_SESSION_ID;
  return v && v.trim() ? v.trim() : null;
}

async function endpointFromLegacyFile(): Promise<McpEndpointConfig | null> {
  const sessionId = legacySessionId();
  if (!sessionId) return null;
  const filePath = path.join(legacyMcpCliDir(), `${sessionId}.endpoint`);
  try {
    const raw = (await fs.readFile(filePath, "utf8")).trim();
    if (!raw) return null;
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as any;
    const url = typeof parsed?.url === "string" ? parsed.url : null;
    const key = typeof parsed?.key === "string" ? parsed.key : typeof parsed?.bearerKey === "string" ? parsed.bearerKey : null;
    if (!url || !key) return null;
    return { url, bearerKey: key };
  } catch {
    return null;
  }
}

type LegacyMcpStateFile = {
  clients?: Array<{ name?: string; type?: string; capabilities?: { tools?: unknown; resources?: unknown; prompts?: unknown } }>;
  tools?: Array<{ name?: string; description?: unknown }>;
  resources?: Record<string, Array<{ uri: string; name?: string; description?: string; mimeType?: string }>>;
};

async function readLegacyStateFile(): Promise<LegacyMcpStateFile | null> {
  const sessionId = legacySessionId();
  if (!sessionId) return null;
  const filePath = path.join(legacyMcpCliDir(), `${sessionId}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as LegacyMcpStateFile;
  } catch {
    return null;
  }
}

export async function runMcpCli(argv: string[], options: { gates?: McpCliGates } = {}): Promise<number> {
  const gates = options.gates ?? computeMcpCliGateSnapshotFromEnv(process.env);
  const parsed = parseArgs(argv);
  if (!parsed.cmd) {
    printHelp();
    return 0;
  }

  const host = createNodeHostCapabilities({ enableKeychain: true });
  const explicitEndpoint =
    parsed.endpointUrl && parsed.endpointBearerKey ? { url: parsed.endpointUrl, bearerKey: parsed.endpointBearerKey } : null;

  const endpointProvider = createMcpEndpointConfigProvider({
    host,
    ttlMs: 1_000,
    explicit: explicitEndpoint,
    discover: async () => endpointFromEnv() ?? (await endpointFromLegacyFile())
  });

  const endpointModeActive = gates.enableMcpCliEndpoint && (await endpointProvider.get()) !== null;
  const telemetry = createTelemetryReporter({
    host,
    env: process.env,
    dedupe: createEndpointModeTelemetryDedupePolicy({ endpointModeActive }),
    samplerSeed: "mcp-cli"
  });

  const client = new McpClient({
    host,
    endpoint: { allowed: gates.enableMcpCliEndpoint, provider: endpointProvider, warn: (msg) => process.stderr.write(String(msg) + "\n") }
  });

  try {
    const withTelemetry = async <T>(
      command: string,
      thunk: () => Promise<T>,
      extraFields?: (data: T) => Record<string, string | number | boolean | null | Array<string | number | boolean | null>>
    ): Promise<T> => {
      const started = Date.now();
      try {
        const data = await thunk();
        const duration_ms = Date.now() - started;
        await telemetry.emit({
          name: "tengu_mcp_cli_command_executed",
          class: "usage",
          fields: { command, success: true, duration_ms, ...(extraFields ? extraFields(data) : {}) }
        });
        return data;
      } catch (err) {
        const duration_ms = Date.now() - started;
        const error = err instanceof Error ? err : new Error(String(err));
        await telemetry.emit({
          name: "tengu_mcp_cli_command_executed",
          class: "usage",
          fields: { command, success: false, duration_ms, error_type: error.name }
        });
        throw err;
      }
    };

    const stateFile = endpointModeActive ? null : await readLegacyStateFile();

    switch (parsed.cmd) {
      case "info": {
        const endpointCfg = await endpointProvider.get().catch(() => null);
        const info = {
          mode: endpointModeActive ? "endpoint" : "state-file",
          gates: {
            enableExperimentalMcpCli: gates.enableExperimentalMcpCli,
            enableMcpCliEndpoint: gates.enableMcpCliEndpoint
          },
          endpoint: endpointCfg ? { url: endpointCfg.url, bearerKeyPresent: true } : null,
          legacy: {
            dir: legacyMcpCliDir(),
            sessionId: legacySessionId(),
            stateFilePresent: Boolean(stateFile)
          },
          stateFileSummary: stateFile
            ? {
                clients: Array.isArray(stateFile.clients) ? stateFile.clients.length : 0,
                tools: Array.isArray(stateFile.tools) ? stateFile.tools.length : 0,
                resources: stateFile.resources ? Object.keys(stateFile.resources).length : 0
              }
            : null
        };
        await withTelemetry("info", async () => info);
        if (parsed.json) {
          process.stdout.write(JSON.stringify(info) + "\n");
          return 0;
        }
        process.stdout.write(`mode: ${info.mode}\n`);
        process.stdout.write(`endpoint: ${info.endpoint ? info.endpoint.url : "(none)"}\n`);
        process.stdout.write(`legacy dir: ${info.legacy.dir}\n`);
        process.stdout.write(`session: ${info.legacy.sessionId ?? "(none)"}\n`);
        if (info.stateFileSummary) {
          process.stdout.write(
            `state-file: present (clients=${info.stateFileSummary.clients}, tools=${info.stateFileSummary.tools}, resources=${info.stateFileSummary.resources})\n`
          );
        } else {
          process.stdout.write("state-file: (none)\n");
        }
        return 0;
      }
      case "servers": {
        if (endpointModeActive) {
          const servers = await withTelemetry("servers", async () => await client.listServers(), (s) => ({ server_count: s.length }));
          if (parsed.json) process.stdout.write(JSON.stringify(servers) + "\n");
          else for (const s of servers) process.stdout.write(`${s.id}\t${s.displayName}\t${s.enabled ? "enabled" : "disabled"}\n`);
          return 0;
        }
        const clients = stateFile?.clients ?? [];
        const rows = clients
          .map((c) => ({
            name: typeof c?.name === "string" ? c.name : "unknown",
            type: typeof c?.type === "string" ? c.type : "unknown",
            hasTools: !!c?.capabilities?.tools,
            hasResources: !!c?.capabilities?.resources,
            hasPrompts: !!c?.capabilities?.prompts
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        await withTelemetry("servers", async () => rows, (s) => ({ server_count: s.length }));
        if (parsed.json) process.stdout.write(JSON.stringify(rows) + "\n");
        else for (const s of rows) process.stdout.write(`${s.name}\t${s.type}\t${s.hasTools ? "tools" : "-"}\t${s.hasResources ? "resources" : "-"}\n`);
        return 0;
      }
      case "tools": {
        if (endpointModeActive) {
          const tools = await withTelemetry(
            "tools",
            async () => await client.listTools({ ...(parsed.serverId ? { serverId: parsed.serverId } : {}) }),
            (t) => ({ tool_count: t.length, filtered: parsed.serverId ? true : false })
          );
          if (parsed.json) process.stdout.write(JSON.stringify(tools) + "\n");
          else for (const t of tools) process.stdout.write(`${t.serverId}/${t.name}${t.description ? `\t${t.description}` : ""}\n`);
          return 0;
        }
        const filtered = parsed.serverId ? parsed.serverId.trim() : null;
        const tools = (stateFile?.tools ?? [])
          .map((t) => ({
            fullName: typeof t?.name === "string" ? t.name : "",
            description: typeof t?.description === "string" ? t.description : ""
          }))
          .filter((t) => t.fullName.startsWith("mcp__"))
          .map((t) => {
            const canonical = canonicalizeLegacyToolIdentifier({ kind: "mcp_rule", ruleToolName: t.fullName });
            const rest = canonical.slice("mcp__".length);
            const idx = rest.indexOf("__");
            const server = idx === -1 ? "unknown" : rest.slice(0, idx);
            const name = idx === -1 ? canonical : rest.slice(idx + 2);
            return { server, name, fullName: canonical, description: t.description };
          })
          .filter((t) => (filtered ? t.server === filtered : true))
          .sort((a, b) => `${a.server}/${a.name}`.localeCompare(`${b.server}/${b.name}`));
        await withTelemetry("tools", async () => tools, (t) => ({ tool_count: t.length, filtered: !!filtered }));
        if (parsed.json) process.stdout.write(JSON.stringify(tools) + "\n");
        else for (const t of tools) process.stdout.write(`${t.server}/${t.name}${t.description ? `\t${t.description}` : ""}\n`);
        return 0;
      }
      case "resources": {
        if (endpointModeActive) {
          const resources = await withTelemetry(
            "resources",
            async () => await client.listResources({ ...(parsed.serverId ? { serverId: parsed.serverId } : {}) }),
            (r) => ({ resource_count: r.length, filtered: parsed.serverId ? true : false })
          );
          if (parsed.json) process.stdout.write(JSON.stringify(resources) + "\n");
          else for (const r of resources) process.stdout.write(`${r.serverId}/${r.name ?? r.uri}\n`);
          return 0;
        }
        const filtered = parsed.serverId ? parsed.serverId.trim() : null;
        const entries: Array<{ server: string; uri: string; name?: string; mimeType?: string }> = [];
        for (const [server, list] of Object.entries(stateFile?.resources ?? {})) {
          if (filtered && server !== filtered) continue;
          for (const r of list) entries.push({ server, uri: r.uri, ...(r.name ? { name: r.name } : {}), ...(r.mimeType ? { mimeType: r.mimeType } : {}) });
        }
        entries.sort((a, b) => `${a.server}/${a.name ?? a.uri}`.localeCompare(`${b.server}/${b.name ?? b.uri}`));
        await withTelemetry("resources", async () => entries, (r) => ({ resource_count: r.length, filtered: !!filtered }));
        if (parsed.json) process.stdout.write(JSON.stringify(entries) + "\n");
        else for (const r of entries) process.stdout.write(`${r.server}/${r.name ?? r.uri}\n`);
        return 0;
      }
      case "grep": {
        const pattern = parsed.positionals[0];
        if (!pattern) {
          process.stderr.write("Error: missing grep pattern\n");
          return 1;
        }
        if (endpointModeActive) {
          const tools = await withTelemetry("grep", async () => await client.grepTools(new RegExp(pattern, "i")), (t) => ({ tool_count: t.length }));
          if (parsed.json) process.stdout.write(JSON.stringify(tools) + "\n");
          else for (const t of tools) process.stdout.write(`${t.serverId}/${t.name}${t.description ? `\t${t.description}` : ""}\n`);
          return 0;
        }
        const re = new RegExp(pattern, "i");
        const tools = (stateFile?.tools ?? [])
          .map((t) => ({
            fullName: typeof t?.name === "string" ? t.name : "",
            description: typeof t?.description === "string" ? t.description : ""
          }))
          .filter((t) => t.fullName.startsWith("mcp__"))
          .map((t) => {
            const canonical = canonicalizeLegacyToolIdentifier({ kind: "mcp_rule", ruleToolName: t.fullName });
            const rest = canonical.slice("mcp__".length);
            const idx = rest.indexOf("__");
            const serverId = idx === -1 ? "unknown" : rest.slice(0, idx);
            const name = idx === -1 ? canonical : rest.slice(idx + 2);
            return { serverId, name, description: t.description };
          })
          .filter((t) => re.test(t.name) || re.test(t.description))
          .sort((a, b) => `${a.serverId}/${a.name}`.localeCompare(`${b.serverId}/${b.name}`));
        await withTelemetry("grep", async () => tools, (t) => ({ tool_count: t.length }));
        if (parsed.json) process.stdout.write(JSON.stringify(tools) + "\n");
        else for (const t of tools) process.stdout.write(`${t.serverId}/${t.name}${t.description ? `\t${t.description}` : ""}\n`);
        return 0;
      }
      case "call": {
        if (!endpointModeActive) {
          process.stderr.write("Error: direct/state-file MCP tool calls are not implemented in this rewrite. Use endpoint mode.\n");
          return 1;
        }
        const target = parsed.positionals[0];
        const argsText = parsed.positionals[1];
        if (!target || !argsText) {
          process.stderr.write("Error: usage: call <server/tool> <jsonArgs>\n");
          return 1;
        }
        const parsedTarget = parseServerTool(target);
        if (!parsedTarget) {
          process.stderr.write("Error: target must be <server/tool>\n");
          return 1;
        }
        const args = JSON.parse(argsText) as unknown;
        const result = await withTelemetry("call", async () => {
          return await client.callToolOnce(
            { serverId: parsedTarget.serverId, tool: parsedTarget.tool, args, timeoutMs: parsed.timeoutMs ?? gates.mcpToolTimeoutMs ?? 100_000_000 },
            undefined
          );
        });
        process.stdout.write(parsed.json ? JSON.stringify(result) + "\n" : JSON.stringify(result, null, 2) + "\n");
        return 0;
      }
      case "read": {
        if (!endpointModeActive) {
          process.stderr.write("Error: direct/state-file MCP resource reads are not implemented in this rewrite. Use endpoint mode.\n");
          return 1;
        }
        const server = parsed.positionals[0];
        const uri = parsed.positionals[1];
        if (!server || !uri) {
          process.stderr.write("Error: usage: read <server> <uri>\n");
          return 1;
        }
        const timeoutMs = parsed.timeoutMs ?? gates.mcpToolTimeoutMs ?? undefined;
        const result = await withTelemetry("read", async () => await client.readResource(server, uri, timeoutMs !== undefined ? { timeoutMs } : undefined));
        process.stdout.write(parsed.json ? JSON.stringify(result) + "\n" : JSON.stringify(result, null, 2) + "\n");
        return 0;
      }
      default:
        process.stderr.write(`Unknown command: ${parsed.cmd}\n`);
        printHelp();
        return 1;
    }
  } catch (err) {
    if (err instanceof ConfigMissingError) {
      if (gates.enableMcpCliEndpoint && !endpointModeActive) {
        const sid = legacySessionId();
        process.stderr.write(
          `Warning: MCP endpoint file not found${sid ? ` for session ${sid}` : ""} in ${legacyMcpCliDir()}. Falling back to state file.\n`
        );
      }
    }
    process.stderr.write(String(err) + "\n");
    return 1;
  } finally {
    await telemetry.flush();
  }
}
