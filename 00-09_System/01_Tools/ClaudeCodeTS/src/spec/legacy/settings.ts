export type LegacySettingsSource =
  | "userSettings"
  | "projectSettings"
  | "localSettings"
  | "policySettings"
  | "flagSettings"
  | "cliArg"
  | "command"
  | "session";

export type LegacyFileBackedSettingsSource =
  | "userSettings"
  | "projectSettings"
  | "localSettings"
  | "policySettings"
  | "flagSettings";

export type LegacyNonFileSettingsSource = Exclude<
  LegacySettingsSource,
  LegacyFileBackedSettingsSource
>;

export const LEGACY_SETTINGS_SOURCE_ORDER = [
  "userSettings",
  "projectSettings",
  "localSettings",
  "flagSettings",
  "policySettings"
] as const satisfies ReadonlyArray<LegacyFileBackedSettingsSource>;

export const LEGACY_ENABLED_SOURCES_ALWAYS_INCLUDED = [
  "policySettings",
  "flagSettings"
] as const satisfies ReadonlyArray<LegacyFileBackedSettingsSource>;

export type LegacySettingsMergeSemantics = {
  objects: "deep-merge";
  arrays: "union-dedupe-preserve-order";
  deleteOnUndefinedPatch: true;
};

export const LEGACY_SETTINGS_MERGE_SEMANTICS: LegacySettingsMergeSemantics = {
  objects: "deep-merge",
  arrays: "union-dedupe-preserve-order",
  deleteOnUndefinedPatch: true
};

