import type { AllowedSettingSource, FileBackedSettingsSource, SettingsSource } from "./types.js";

export const LEGACY_FILE_BACKED_SETTINGS_SOURCE_ORDER: readonly FileBackedSettingsSource[] = [
  "userSettings",
  "projectSettings",
  "localSettings",
  "flagSettings",
  "policySettings"
];

export const LEGACY_ALWAYS_INCLUDED_SOURCES: readonly FileBackedSettingsSource[] = ["policySettings", "flagSettings"];

export function parseEnabledSettingSourcesFlag(input: string): AllowedSettingSource[] {
  if (input === "") return [];
  const parts = input
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const out: AllowedSettingSource[] = [];
  for (const p of parts) {
    switch (p) {
      case "user":
        out.push("userSettings");
        break;
      case "project":
        out.push("projectSettings");
        break;
      case "local":
        out.push("localSettings");
        break;
      default:
        throw new Error(`Invalid setting source: ${p}. Valid options are: user, project, local`);
    }
  }
  return out;
}

export function computeEnabledFileSettingsSources(allowed: AllowedSettingSource[]): FileBackedSettingsSource[] {
  const set = new Set<FileBackedSettingsSource>(allowed);
  set.add("policySettings");
  set.add("flagSettings");
  return Array.from(set);
}

export function isSettingsSourceEnabled(source: SettingsSource, enabledSources: readonly SettingsSource[]): boolean {
  return enabledSources.includes(source);
}

