import type { JsonObject } from "../types/json.js";

export type SettingsSource =
  | "userSettings"
  | "projectSettings"
  | "localSettings"
  | "policySettings"
  | "flagSettings"
  | "cliArg"
  | "command"
  | "session";

export type FileBackedSettingsSource = Extract<
  SettingsSource,
  "userSettings" | "projectSettings" | "localSettings" | "policySettings" | "flagSettings"
>;

export type AllowedSettingSource = Extract<SettingsSource, "userSettings" | "projectSettings" | "localSettings">;

export type NonFileSettingsSource = Exclude<SettingsSource, FileBackedSettingsSource>;

export type WritableSettingsSource = Extract<SettingsSource, "userSettings" | "projectSettings" | "localSettings">;

export type SettingsPolicyOrigin = "absent" | "local" | "remote" | "invalid";

export type SettingsErrorKind =
  | "parse_error"
  | "validation_error"
  | "io_error"
  | "conflict"
  | "capability_missing"
  | "unsupported";

export type SettingsError = {
  kind: SettingsErrorKind;
  source: SettingsSource;
  message: string;
  filePath?: string;
  pointer?: string;
  cause?: unknown;
  severity?: "warning" | "error";
};

export type SettingsSourceReadResult = {
  source: SettingsSource;
  settings: JsonObject | null;
  errors: SettingsError[];
  origin?: SettingsPolicyOrigin;
  storageVersion?: string | null;
};

export type EffectiveSettingsResult = {
  settings: JsonObject;
  errors: SettingsError[];
  enabledSources: FileBackedSettingsSource[];
  perSource: Partial<Record<SettingsSource, SettingsSourceReadResult>>;
  policyOrigin: SettingsPolicyOrigin;
};

export type SettingsUpdateEvent = {
  type: "settings/updated";
  changedSource: SettingsSource | null;
  effective: EffectiveSettingsResult;
};

export type SettingsUnsubscribe = () => void;

export type SettingsEventBus = {
  subscribe: (handler: (evt: SettingsUpdateEvent) => void) => SettingsUnsubscribe;
  emit: (evt: SettingsUpdateEvent) => void;
  clear: () => void;
};

