import type { HostCapabilities } from "../core/types/host.js";
import type { JsonObject } from "../core/types/json.js";
import { canonicalJsonStringify } from "../core/types/canonicalJson.js";
import { createSettingsManager } from "../core/settings/manager.js";
import { computePermissionPolicySnapshot } from "../core/permissions/policy.js";
import { resolveHooksConfig } from "../core/hooks/sources.js";
import { McpServerRegistry } from "../core/mcp/registry.js";
import { asWorkspaceId } from "../core/types/workspace.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function runEngineOnlyDiagnostics(
  _argv: string[],
  options: { host: HostCapabilities; engine: { name: string; version: string } }
): Promise<{ exitCode: number; reportJson: string }> {
  const host = options.host;
  const workspaceId = asWorkspaceId("engine_only");

  const mgr = createSettingsManager(host, { workspaceId, sessionId: "sess_engine_only" });
  await mgr.initialize();
  const effective = mgr.getEffective();
  const effectiveConfig = mgr.getEffectiveConfig();

  const policy = computePermissionPolicySnapshot(effective);
  const policySettingsRaw = effective.perSource.policySettings?.settings ?? null;
  const policySettings = policySettingsRaw && isPlainObject(policySettingsRaw) ? policySettingsRaw : null;

  const hooks = resolveHooksConfig({ effectiveSettings: effective.settings, policySettings, effectiveConfig });

  const mcpRegistry = new McpServerRegistry({ host, workspaceId });
  const mcpServers = await mcpRegistry.listServers().catch(() => []);

  const report = {
    kind: "engine_only_report",
    schemaVersion: 1,
    engine: options.engine,
    effectiveSettings: effective.settings,
    effectiveConfig,
    policy,
    hooks: { canonical: hooks.canonical, errorCount: hooks.errors.length },
    mcp: { serverCount: mcpServers.length }
  };

  mgr.dispose();
  return { exitCode: 0, reportJson: canonicalJsonStringify(report) };
}

