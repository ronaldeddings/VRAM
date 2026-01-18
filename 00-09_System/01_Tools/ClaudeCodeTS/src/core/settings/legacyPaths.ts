import type { HostFilesystem, HostProcess } from "../types/host.js";
import type { FileBackedSettingsSource } from "./types.js";

export type LegacySettingsPathContext = {
  process?: HostProcess;
  filesystem?: HostFilesystem;
  configDir?: string;
  projectRoot?: string;
  flagSettingsPath?: string | null;
  policySystemDir?: string | null;
};

export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
  const viaEnv = process?.getEnv?.("CLAUDE_CONFIG_DIR");
  if (viaEnv) return viaEnv;
  return null;
}

export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
  if (ctx.policySystemDir) return ctx.policySystemDir;
  const platform = ctx.process?.platform?.() ?? "unknown";
  if (platform === "win32") {
    return "C:\\\\ProgramData\\\\ClaudeCode";
  }
  if (platform === "darwin") return "/Library/Application Support/ClaudeCode";
  return "/etc/claude-code";
}

export function resolveLegacySettingsBaseDir(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): string | null {
  switch (source) {
    case "userSettings":
      return ctx.configDir ?? defaultLegacyConfigDir(ctx.process);
    case "projectSettings":
    case "localSettings":
      return ctx.projectRoot ?? ctx.process?.getCwd?.() ?? null;
    case "policySettings":
      return ctx.projectRoot ?? ctx.process?.getCwd?.() ?? null;
    case "flagSettings": {
      const flagPath = ctx.flagSettingsPath ?? null;
      if (flagPath) {
        const idx = Math.max(flagPath.lastIndexOf("/"), flagPath.lastIndexOf("\\")); // tolerate Windows separators
        return idx >= 0 ? flagPath.slice(0, idx) : ".";
      }
      return ctx.projectRoot ?? ctx.process?.getCwd?.() ?? null;
    }
  }
}

export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
  if (source === "flagSettings") return ctx.flagSettingsPath ?? null;

  switch (source) {
    case "userSettings": {
      const base = resolveLegacySettingsBaseDir(source, ctx);
      if (!base) return null;
      return `${base}/settings.json`;
    }
    case "projectSettings": {
      const base = resolveLegacySettingsBaseDir(source, ctx);
      if (!base) return null;
      return `${base}/.claude/settings.json`;
    }
    case "localSettings": {
      const base = resolveLegacySettingsBaseDir(source, ctx);
      if (!base) return null;
      return `${base}/.claude/settings.local.json`;
    }
    case "policySettings": {
      const sys = await resolveLegacyPolicySystemDir(ctx);
      return `${sys}/managed-settings.json`;
    }
  }
}
