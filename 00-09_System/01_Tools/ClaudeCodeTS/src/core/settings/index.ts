export type {
  AllowedSettingSource,
  EffectiveSettingsResult,
  FileBackedSettingsSource,
  SettingsError,
  SettingsPolicyOrigin,
  SettingsSource,
  SettingsSourceReadResult,
  SettingsUpdateEvent,
  WritableSettingsSource
} from "./types.js";
export {
  LEGACY_SETTINGS_SCHEMA_URL,
  SETTINGS_SCHEMA_TOOLING_REQUIREMENTS,
  type SettingsDocumentV1,
  parseSettingsJson,
  serializeSettingsDocument
} from "./schema.js";
export { parseEnabledSettingSourcesFlag, computeEnabledFileSettingsSources } from "./sources.js";
export {
  LEGACY_SETTINGS_MERGE_FIELD_EXPECTATIONS,
  LEGACY_SETTINGS_MERGE_NOTES,
  mergeJsonObject,
  mergeSettingsObjectsInOrder,
  unionDedupePreserveOrder,
  type SettingsMergeFieldExpectation
} from "./merge.js";
export { applySettingsPatch, type SettingsPatchObject, type SettingsPatchValue } from "./patch.js";
export { isSecretRefV1, resolveSecretRefV1, type SecretRefV1, type SecretResolutionResult } from "./secrets.js";
export {
  SETTINGS_STORAGE_KEY_PREFIX,
  createSettingsDocumentFromObject,
  namespaceForSettingsSource,
  readSettingsSourceFromStorage,
  settingsStorageKey,
  writeSettingsSourceToStorage
} from "./storage.js";
export { resolveLegacySettingsFilePath, resolveLegacySettingsBaseDir, resolveLegacyPolicySystemDir } from "./legacyPaths.js";
export { buildSettingsDoctorReport, type SettingsDoctorReport } from "./doctor.js";
export {
  computeEffectiveConfig,
  computeMcpCliGateSnapshotFromEnv,
  LEGACY_FEATURE_GATES,
  toPersistableEffectiveConfig,
  type EffectiveConfig,
  type PersistableEffectiveConfig
} from "./effectiveConfig.js";
export { exportSettingsBundleV1, importSettingsBundleV1, type ExportedSettingsBundleV1 } from "./bundle.js";
export { createSettingsManager, type SettingsManager } from "./manager.js";
export { refreshRemotePolicySettings, type PolicySettingsProvider } from "./policy.js";
