import type { HostStorage } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { createSettingsDocumentFromObject, readSettingsSourceFromStorage, writeSettingsSourceToStorage } from "./storage.js";
import type { SettingsError, SettingsSource } from "./types.js";
import type { SettingsStorageContext } from "./storage.js";

export type ExportedSettingsBundleV1 = {
  schemaVersion: 1;
  exportedAtWallMs: number;
  sources: Partial<Record<SettingsSource, JsonObject>>;
};

export async function exportSettingsBundleV1(
  storage: HostStorage,
  ctx: SettingsStorageContext,
  sources: readonly SettingsSource[],
  exportedAtWallMs: number
): Promise<{ bundle: ExportedSettingsBundleV1; errors: SettingsError[] }> {
  const out: ExportedSettingsBundleV1 = { schemaVersion: 1, exportedAtWallMs, sources: {} };
  const errors: SettingsError[] = [];

  for (const source of sources) {
    const res = await readSettingsSourceFromStorage(storage, source, ctx);
    errors.push(...res.errors);
    if (res.settings) out.sources[source] = res.settings;
  }

  return { bundle: out, errors };
}

export async function importSettingsBundleV1(
  storage: HostStorage,
  ctx: SettingsStorageContext,
  bundle: ExportedSettingsBundleV1
): Promise<{ ok: true } | { ok: false; errors: SettingsError[] }> {
  const errors: SettingsError[] = [];
  if (bundle.schemaVersion !== 1) {
    return { ok: false, errors: [{ kind: "validation_error", source: "userSettings", message: "Unsupported bundle schema version" }] };
  }

  for (const [source, settings] of Object.entries(bundle.sources) as Array<[SettingsSource, JsonObject]>) {
    const doc = createSettingsDocumentFromObject(settings);
    const res = await writeSettingsSourceToStorage(storage, source, ctx, doc);
    if (!res.ok) errors.push(res.error);
  }

  if (errors.length > 0) return { ok: false, errors };
  return { ok: true };
}
