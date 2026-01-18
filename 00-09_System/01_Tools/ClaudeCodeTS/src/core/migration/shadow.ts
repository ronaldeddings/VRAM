import type { HostCapabilities } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import { computePermissionPolicySnapshot, buildToolPermissionContextFromSettings, decideToolInvocationPermission } from "../permissions/index.js";
import type { PermissionDecision } from "../permissions/types.js";
import { resolveHooksConfig } from "../hooks/sources.js";
import type { EffectiveConfig } from "../settings/effectiveConfig.js";
import { readLegacySettingsFilesSnapshot } from "./legacySettingsFiles.js";
import type { EffectiveSettingsResult, SettingsSourceReadResult } from "../settings/types.js";
import type { TelemetryEventEnvelopeV1 } from "../types/observability.js";
import { SCHEMA_VERSION } from "../types/schema.js";

export type ShadowDiffKind = "effective_settings" | "permission_decision" | "hooks_canonical" | "mcp_mode";

export type ShadowDiff = {
  kind: ShadowDiffKind;
  legacy: string;
  v3: string;
};

export type ShadowRunResult = {
  diffs: ShadowDiff[];
  legacy: {
    effectiveSettings: JsonObject;
    permissionDecision?: PermissionDecision | null;
    hooksCanonical?: string | null;
    mcpSelectedMode?: "endpoint" | "direct" | null;
  };
  v3: {
    effectiveSettings: JsonObject;
    permissionDecision?: PermissionDecision | null;
    hooksCanonical?: string | null;
    mcpSelectedMode?: "endpoint" | "direct" | null;
  };
};

function normalizePermissionDecision(decision: PermissionDecision | null | undefined): unknown {
  if (!decision) return null;
  return {
    behavior: decision.behavior,
    reasonCode: decision.reasonCode,
    attribution: decision.attribution
  };
}

function toEffectiveSettingsResultLike(options: {
  settings: JsonObject;
  policy: SettingsSourceReadResult | undefined;
  policyOrigin: EffectiveSettingsResult["policyOrigin"];
}): EffectiveSettingsResult {
  const policySettings: SettingsSourceReadResult =
    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };

  return {
    settings: options.settings,
    errors: [],
    enabledSources: [],
    perSource: {
      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
      policySettings,
      cliArg: { source: "cliArg", settings: null, errors: [] },
      command: { source: "command", settings: null, errors: [] },
      session: { source: "session", settings: null, errors: [] }
    } satisfies EffectiveSettingsResult["perSource"],
    policyOrigin: options.policyOrigin
  };
}

export async function runShadowEvaluation(options: {
  host: HostCapabilities;
  legacySettingsCtx: Parameters<typeof readLegacySettingsFilesSnapshot>[1];
  v3EffectiveSettings: JsonObject;
  v3EffectiveConfig: EffectiveConfig;
  legacyEffectiveConfig: EffectiveConfig;
  toolInvocation?: { toolName: string; input: unknown };
  hookResolution?: { policySettings: JsonObject | null };
  mcpModeSelection?: {
    preferredMode: "direct" | "endpoint";
    endpointAllowed: boolean;
    endpointPresent: boolean;
    directAvailable: boolean;
  };
  emitTelemetry?: boolean;
}): Promise<ShadowRunResult> {
  const legacySnapshot = await readLegacySettingsFilesSnapshot(options.host, options.legacySettingsCtx);
  const legacySettings = legacySnapshot.effectiveSettings;
  const v3Settings = options.v3EffectiveSettings;

  const diffs: ShadowDiff[] = [];
  const legacySettingsCanon = canonicalJsonStringify(legacySettings);
  const v3SettingsCanon = canonicalJsonStringify(v3Settings);
  if (legacySettingsCanon !== v3SettingsCanon) diffs.push({ kind: "effective_settings", legacy: legacySettingsCanon, v3: v3SettingsCanon });

  const legacyEffective = toEffectiveSettingsResultLike({
    settings: legacySettings,
    policy: legacySnapshot.perSource.policySettings,
    policyOrigin: legacySnapshot.policyOrigin
  });

  const v3Effective = toEffectiveSettingsResultLike({
    settings: v3Settings,
    policy:
      options.hookResolution?.policySettings !== undefined
        ? ({
            source: "policySettings",
            settings: options.hookResolution.policySettings,
            errors: [],
            origin: options.hookResolution.policySettings ? "local" : "absent",
            storageVersion: null
          } satisfies SettingsSourceReadResult)
        : undefined,
    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
  });

  const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
  const v3Policy = computePermissionPolicySnapshot(v3Effective);

  const legacyPermissionDecision = options.toolInvocation
    ? await (async () => {
        const { ctx: toolPermissionContext } = buildToolPermissionContextFromSettings(legacyEffective, legacyPolicy);
        return await decideToolInvocationPermission(options.toolInvocation!, {
          settings: legacyEffective,
          toolPermissionContext,
          host: options.host,
          policy: legacyPolicy,
          sandbox: { sandboxingEnabled: true, autoAllowBashIfSandboxed: true }
        });
      })()
    : null;

  const v3PermissionDecision = options.toolInvocation
    ? await (async () => {
        const { ctx: toolPermissionContext } = buildToolPermissionContextFromSettings(v3Effective, v3Policy);
        return await decideToolInvocationPermission(options.toolInvocation!, {
          settings: v3Effective,
          toolPermissionContext,
          host: options.host,
          policy: v3Policy,
          sandbox: { sandboxingEnabled: true, autoAllowBashIfSandboxed: true }
        });
      })()
    : null;

  const legacyPermCanon = canonicalJsonStringify(normalizePermissionDecision(legacyPermissionDecision));
  const v3PermCanon = canonicalJsonStringify(normalizePermissionDecision(v3PermissionDecision));
  if (options.toolInvocation && legacyPermCanon !== v3PermCanon) diffs.push({ kind: "permission_decision", legacy: legacyPermCanon, v3: v3PermCanon });

  const legacyHooksCanonical = options.hookResolution
    ? resolveHooksConfig({
        effectiveSettings: legacySettings,
        policySettings: options.hookResolution.policySettings,
        effectiveConfig: options.legacyEffectiveConfig,
        pluginHooks: null,
        sessionHooks: null
      }).canonical
    : null;

  const v3HooksCanonical = options.hookResolution
    ? resolveHooksConfig({
        effectiveSettings: v3Settings,
        policySettings: options.hookResolution.policySettings,
        effectiveConfig: options.v3EffectiveConfig,
        pluginHooks: null,
        sessionHooks: null
      }).canonical
    : null;

  if (options.hookResolution && legacyHooksCanonical !== v3HooksCanonical) {
    diffs.push({
      kind: "hooks_canonical",
      legacy: legacyHooksCanonical ?? "",
      v3: v3HooksCanonical ?? ""
    });
  }

  const selectMode = (m: NonNullable<typeof options.mcpModeSelection>): "endpoint" | "direct" | null => {
    const preferred = m.preferredMode;
    const endpointOk = m.endpointAllowed && m.endpointPresent;
    const directOk = m.directAvailable;
    if (preferred === "endpoint") {
      if (endpointOk) return "endpoint";
      if (directOk) return "direct";
      return null;
    }
    if (directOk) return "direct";
    if (endpointOk) return "endpoint";
    return null;
  };

  const legacyMcpSelectedMode = options.mcpModeSelection ? selectMode(options.mcpModeSelection) : null;
  const v3McpSelectedMode = options.mcpModeSelection ? selectMode(options.mcpModeSelection) : null;
  if (options.mcpModeSelection && legacyMcpSelectedMode !== v3McpSelectedMode) {
    diffs.push({
      kind: "mcp_mode",
      legacy: legacyMcpSelectedMode ?? "null",
      v3: v3McpSelectedMode ?? "null"
    });
  }

  if (options.emitTelemetry && diffs.length > 0 && options.host.telemetry.kind === "available") {
    const evt: TelemetryEventEnvelopeV1 = {
      kind: "telemetry_event",
      schemaVersion: SCHEMA_VERSION.telemetryEvent,
      class: "usage",
      name: "tengu_migration_shadow_diffs",
      tsWallMs: Date.now(),
      privacy: "internal",
      fields: {
        diff_count: diffs.length,
        diff_kinds: diffs.map((d) => d.kind)
      }
    };
    await Promise.resolve(options.host.telemetry.value.enqueue(evt));
    if (options.host.telemetry.value.flush) await options.host.telemetry.value.flush();
  }

  return {
    diffs,
    legacy: {
      effectiveSettings: legacySettings,
      permissionDecision: legacyPermissionDecision as any,
      hooksCanonical: legacyHooksCanonical,
      mcpSelectedMode: legacyMcpSelectedMode
    },
    v3: {
      effectiveSettings: v3Settings,
      permissionDecision: v3PermissionDecision as any,
      hooksCanonical: v3HooksCanonical,
      mcpSelectedMode: v3McpSelectedMode
    }
  };
}
