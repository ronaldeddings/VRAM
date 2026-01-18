export type MigrationStage = "engine_library" | "cli_adapter" | "rn_host" | "web_host";

export type MigrationSubsystem = "settings" | "permissions" | "hooks" | "mcp";

export type MigrationFeatureFlags = {
  stage: MigrationStage;
  compatibilityMode: boolean;
  subsystem: Record<MigrationSubsystem, "v3" | "legacy">;
  dataMigration: {
    settingsSchema: "legacy_object" | "envelope_v1" | "auto";
    sessionLogFormat: "legacy" | "v3" | "auto";
  };
  engineOnlyDiagnostics: boolean;
  shadowMode: {
    enabled: boolean;
    recordDiffs: boolean;
    telemetry: boolean;
  };
};

function parseBool(v: string | undefined, defaultValue: boolean): boolean {
  if (v === undefined) return defaultValue;
  const t = v.trim().toLowerCase();
  if (t === "1" || t === "true" || t === "yes" || t === "on") return true;
  if (t === "0" || t === "false" || t === "no" || t === "off") return false;
  return defaultValue;
}

function parseStage(v: string | undefined): MigrationStage {
  const t = (v ?? "").trim();
  if (t === "engine_library" || t === "cli_adapter" || t === "rn_host" || t === "web_host") return t;
  return "cli_adapter";
}

function parseSubsystemMode(v: string | undefined): "v3" | "legacy" {
  const t = (v ?? "").trim().toLowerCase();
  if (t === "legacy") return "legacy";
  return "v3";
}

export function readMigrationFeatureFlagsFromEnv(env: Record<string, string | undefined>): MigrationFeatureFlags {
  const compatibilityMode = parseBool(env["CLAUDE_TS_COMPAT_MODE"], true);
  const engineOnlyDiagnostics = parseBool(env["CLAUDE_TS_ENGINE_ONLY"], false);

  const settingsSchema = ((env["CLAUDE_TS_MIGRATE_SETTINGS_SCHEMA"] ?? "auto").trim().toLowerCase() ||
    "auto") as MigrationFeatureFlags["dataMigration"]["settingsSchema"];
  const sessionLogFormat = ((env["CLAUDE_TS_MIGRATE_SESSION_LOG_FORMAT"] ?? "auto").trim().toLowerCase() ||
    "auto") as MigrationFeatureFlags["dataMigration"]["sessionLogFormat"];

  const shadowEnabled = parseBool(env["CLAUDE_TS_SHADOW_MODE"], false);
  const recordDiffs = parseBool(env["CLAUDE_TS_SHADOW_RECORD_DIFFS"], shadowEnabled);
  const telemetry = parseBool(env["CLAUDE_TS_SHADOW_TELEMETRY"], false);

  return {
    stage: parseStage(env["CLAUDE_TS_MIGRATION_STAGE"]),
    compatibilityMode,
    subsystem: {
      settings: parseSubsystemMode(env["CLAUDE_TS_CUTOVER_SETTINGS"]),
      permissions: parseSubsystemMode(env["CLAUDE_TS_CUTOVER_PERMISSIONS"]),
      hooks: parseSubsystemMode(env["CLAUDE_TS_CUTOVER_HOOKS"]),
      mcp: parseSubsystemMode(env["CLAUDE_TS_CUTOVER_MCP"])
    },
    dataMigration: {
      settingsSchema: settingsSchema === "legacy_object" || settingsSchema === "envelope_v1" ? settingsSchema : "auto",
      sessionLogFormat: sessionLogFormat === "legacy" || sessionLogFormat === "v3" ? sessionLogFormat : "auto"
    },
    engineOnlyDiagnostics,
    shadowMode: { enabled: shadowEnabled, recordDiffs, telemetry }
  };
}

