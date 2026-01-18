import type { JsonObject } from "../../src/core/types/json.js";
import { createSettingsDocumentFromObject, createSettingsManager, writeSettingsSourceToStorage } from "../../src/core/settings/index.js";
import { computePermissionPolicySnapshot, buildToolPermissionContextFromSettings, decideToolInvocationPermission } from "../../src/core/permissions/index.js";
import { resolveHooksConfig } from "../../src/core/hooks/sources.js";
import { createInMemoryCasStorage } from "./inMemoryStorage.js";
import { createHostWithDeterministicStorage } from "./inMemoryHost.js";
import { asWorkspaceId } from "../../src/core/types/workspace.js";
import { McpClient } from "../../src/core/mcp/client.js";
import type { McpEndpointConfigProvider } from "../../src/core/mcp/client.js";
import type { McpTransport } from "../../src/core/mcp/transport.js";

export type RegressionScenario = {
  name: string;
  workspaceId: string;
  sources: Partial<Record<"userSettings" | "projectSettings" | "localSettings" | "policySettings" | "flagSettings", JsonObject>>;
  overlays?: Partial<Record<"cliArg" | "command" | "session", JsonObject>>;
  toolInvocation?: { toolName: string; input: unknown };
  hookResolution?: { effectiveSettings: JsonObject; policySettings: JsonObject | null; effectiveConfig: { hooks: { disabled: boolean; managedOnly: boolean } } };
  mcpModeSelection?: {
    serverId: string;
    preferredMode: "direct" | "endpoint";
    endpointAllowed: boolean;
    endpointPresent: boolean;
    directAvailable: boolean;
  };
};

export type RegressionScenarioResult = {
  effectiveSettings: JsonObject;
  policy: ReturnType<typeof computePermissionPolicySnapshot>;
  toolPermissionDecision?: Awaited<ReturnType<typeof decideToolInvocationPermission>>;
  hooksCanonical?: string;
  mcpSelectedMode?: "direct" | "endpoint";
};

export async function runRegressionScenario(scenario: RegressionScenario): Promise<RegressionScenarioResult> {
  const storage = createInMemoryCasStorage();
  const host = createHostWithDeterministicStorage({ storage });
  const ctx = { workspaceId: asWorkspaceId(scenario.workspaceId), sessionId: "sess_regression" };

  const writes: Array<Promise<unknown>> = [];
  for (const [source, settings] of Object.entries(scenario.sources)) {
    writes.push(writeSettingsSourceToStorage(storage, source as any, ctx, createSettingsDocumentFromObject(settings as JsonObject), { expectedVersion: null }));
  }
  await Promise.all(writes);

  const mgr = createSettingsManager(host, ctx);
  if (scenario.overlays?.cliArg) await mgr.setOverlay("cliArg", scenario.overlays.cliArg);
  if (scenario.overlays?.command) await mgr.setOverlay("command", scenario.overlays.command);
  if (scenario.overlays?.session) await mgr.setOverlay("session", scenario.overlays.session);

  await mgr.initialize();
  const effective = mgr.getEffective();
  const policy = computePermissionPolicySnapshot(effective);
  const { ctx: toolPermissionContext } = buildToolPermissionContextFromSettings(effective, policy);

  const toolPermissionDecision = scenario.toolInvocation
    ? await decideToolInvocationPermission(
        { toolName: scenario.toolInvocation.toolName, input: scenario.toolInvocation.input },
        {
          settings: effective,
          toolPermissionContext,
          host,
          policy,
          sandbox: { sandboxingEnabled: true, autoAllowBashIfSandboxed: true }
        }
      )
    : undefined;

  const hooksCanonical = scenario.hookResolution
    ? resolveHooksConfig({
        effectiveSettings: scenario.hookResolution.effectiveSettings,
        policySettings: scenario.hookResolution.policySettings,
        effectiveConfig: scenario.hookResolution.effectiveConfig as any
      }).canonical
    : undefined;

  const mcpSelectedMode = scenario.mcpModeSelection
    ? await (async () => {
        const provider: McpEndpointConfigProvider = {
          get: async () =>
            scenario.mcpModeSelection!.endpointPresent
              ? { url: "https://example.invalid/mcp", bearerKey: "test" }
              : null
        };

        const direct: McpTransport | undefined = scenario.mcpModeSelection!.directAvailable
          ? {
              mode: "direct",
              capabilities: { supportsStreaming: false },
              send: async (req) => ({
                kind: "mcp_envelope",
                schemaVersion: 1,
                type: "response",
                requestId: req.requestId,
                op: req.op,
                correlation: req.correlation,
                ok: true,
                result: { tools: [], resources: [] }
              }),
              callToolStream: async function* () {
                yield { kind: "final", value: { ok: true } };
              }
            }
          : undefined;

        const client = new McpClient({
          host,
          workspaceId: asWorkspaceId(scenario.workspaceId),
          endpoint: { allowed: scenario.mcpModeSelection!.endpointAllowed, provider },
          ...(direct ? { direct } : {})
        });

        await client.registerServer({
          id: scenario.mcpModeSelection!.serverId,
          displayName: "Server",
          enabled: true,
          trust: "trusted",
          preferredMode: scenario.mcpModeSelection!.preferredMode
        });

        await client.send({
          kind: "mcp_envelope",
          schemaVersion: 1,
          type: "request",
          requestId: "req_mode",
          op: "mcp.tools/list",
          correlation: { serverId: scenario.mcpModeSelection!.serverId },
          params: {}
        });

        const listed = await client.listServers();
        const found = listed.find((s) => s.id === scenario.mcpModeSelection!.serverId);
        return found?.mode;
      })()
    : undefined;

  mgr.dispose();
  return {
    effectiveSettings: effective.settings,
    policy,
    ...(toolPermissionDecision ? { toolPermissionDecision } : {}),
    ...(hooksCanonical ? { hooksCanonical } : {}),
    ...(mcpSelectedMode ? { mcpSelectedMode } : {})
  };
}
