import type { HostCapabilities } from "../types/host.js";
import { CapabilityUnavailableError } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
import { createSettingsDocumentFromObject } from "../settings/storage.js";
import { applyPermissionUpdateToSettingsObject } from "../permissions/persistence.js";
import type { PermissionUpdate } from "../permissions/types.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export type LegacyFileBackedSettingsSnapshot = {
  enabledSources: FileBackedSettingsSource[];
  perSource: Partial<Record<FileBackedSettingsSource, SettingsSourceReadResult>>;
  policyOrigin: SettingsPolicyOrigin;
  effectiveSettings: JsonObject;
  errors: SettingsError[];
};

const DEFAULT_ENABLED_SOURCES: readonly FileBackedSettingsSource[] = [
  "userSettings",
  "projectSettings",
  "localSettings",
  "flagSettings",
  "policySettings"
];

async function readOne(
  host: HostCapabilities,
  source: FileBackedSettingsSource,
  ctx: LegacySettingsPathContext
): Promise<SettingsSourceReadResult & { raw?: string; filePath?: string | null }> {
  const filesystem = host.filesystem;
  if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);

  const filePath = await resolveLegacySettingsFilePath(source, ctx);
  if (!filePath) {
    const origin = source === "policySettings" ? ("absent" as const) : undefined;
    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
  }

  const exists = await filesystem.value.exists(filePath).catch(() => false);
  if (!exists) {
    const origin = source === "policySettings" ? ("absent" as const) : undefined;
    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
  }

  const raw = await filesystem.value.readFileText(filePath);
  const parsed = parseSettingsJson(raw, source);
  const settings = parsed.document?.settings ?? null;

  const origin: SettingsPolicyOrigin | undefined =
    source === "policySettings"
      ? parsed.errors.length > 0 && settings === null
        ? "invalid"
        : parsed.document?.meta?.origin === "remote"
          ? "remote"
          : "local"
      : undefined;

  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
  return {
    source,
    settings,
    errors,
    ...(origin ? { origin } : {}),
    storageVersion: null,
    raw,
    filePath
  };
}

export async function readLegacySettingsFilesSnapshot(
  host: HostCapabilities,
  ctx: LegacySettingsPathContext,
  options?: { enabledSources?: readonly FileBackedSettingsSource[] }
): Promise<LegacyFileBackedSettingsSnapshot> {
  const enabledSources = [...(options?.enabledSources ?? DEFAULT_ENABLED_SOURCES)];
  const perSource: LegacyFileBackedSettingsSnapshot["perSource"] = {};
  const errors: SettingsError[] = [];
  const mergedInputs: JsonObject[] = [];

  let policyOrigin: SettingsPolicyOrigin = "absent";

  for (const source of enabledSources) {
    const res = await readOne(host, source, ctx);
    perSource[source] = res;
    errors.push(...res.errors);
    if (source === "policySettings") {
      if (res.origin) policyOrigin = res.origin;
      if (res.raw !== undefined && res.errors.length > 0 && res.settings === null) policyOrigin = "invalid";
    }
    if (res.settings && isPlainObject(res.settings)) mergedInputs.push(res.settings);
  }

  return {
    enabledSources,
    perSource,
    policyOrigin,
    effectiveSettings: mergeSettingsObjectsInOrder(mergedInputs),
    errors
  };
}

export type LegacyPermissionFileWriteResult =
  | { ok: true; wrotePath: string | null; format: "legacy_object" | "envelope_v1"; diagnostics: string[] }
  | { ok: false; error: SettingsError };

export async function applyPermissionUpdatesToLegacySettingsFile(options: {
  host: HostCapabilities;
  ctx: LegacySettingsPathContext;
  source: Extract<FileBackedSettingsSource, "userSettings" | "projectSettings" | "localSettings">;
  updates: PermissionUpdate[];
}): Promise<LegacyPermissionFileWriteResult> {
  const filesystem = options.host.filesystem;
  if (filesystem.kind !== "available") return { ok: false, error: { kind: "unsupported", source: options.source, message: "filesystem unavailable" } };

  const filePath = await resolveLegacySettingsFilePath(options.source, options.ctx);
  if (!filePath) return { ok: true, wrotePath: null, format: "legacy_object", diagnostics: ["missing_settings_path"] };

  const exists = await filesystem.value.exists(filePath).catch(() => false);
  const raw = exists ? await filesystem.value.readFileText(filePath).catch(() => "") : "";
  const parsed = parseSettingsJson(raw, options.source);
  const base = parsed.document?.settings ?? {};
  const baseObj = isPlainObject(base) ? (base as JsonObject) : {};

  const diagnostics: string[] = [];
  let next = baseObj;
  for (const u of options.updates) {
    const applied = applyPermissionUpdateToSettingsObject(next, u);
    next = applied.next;
    if (applied.diagnostics.length > 0) diagnostics.push(`diagnostics:${applied.diagnostics.length}`);
  }

  const format = parsed.format === "envelope_v1" ? "envelope_v1" : "legacy_object";
  const toWrite =
    format === "envelope_v1"
      ? serializeSettingsDocument(createSettingsDocumentFromObject(next))
      : `${JSON.stringify(next, null, 2)}\n`;

  const mode = options.source === "userSettings" ? 0o600 : undefined;
  await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
  return { ok: true, wrotePath: filePath, format, diagnostics };
}
