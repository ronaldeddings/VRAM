import type { HostStorage } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { createSettingsDocumentFromObject, writeSettingsSourceToStorage, type SettingsStorageContext } from "./storage.js";
import type { SettingsError, SettingsPolicyOrigin } from "./types.js";

export type PolicySettingsProvider = {
  fetchPolicySettings: (options: { nowWallMs: number }) => Promise<JsonObject | null>;
};

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function refreshRemotePolicySettings(options: {
  storage: HostStorage;
  ctx: SettingsStorageContext;
  provider: PolicySettingsProvider;
  nowWallMs: number;
}): Promise<{ updated: boolean; errors: SettingsError[]; origin: SettingsPolicyOrigin }> {
  try {
    const fetched = await options.provider.fetchPolicySettings({ nowWallMs: options.nowWallMs });
    if (fetched === null) return { updated: false, errors: [], origin: "absent" };
    if (!isPlainObject(fetched)) {
      return {
        updated: false,
        errors: [{ kind: "validation_error", source: "policySettings", message: "Remote policy settings must be an object", severity: "error" }],
        origin: "invalid"
      };
    }

    const doc = createSettingsDocumentFromObject(fetched, { origin: "remote", updatedAtWallMs: options.nowWallMs });
    const res = await writeSettingsSourceToStorage(options.storage, "policySettings", options.ctx, doc);
    if (!res.ok) return { updated: false, errors: [res.error], origin: "invalid" };
    return { updated: true, errors: [], origin: "remote" };
  } catch (cause) {
    return {
      updated: false,
      errors: [{ kind: "io_error", source: "policySettings", message: "Failed to refresh remote policy settings", cause, severity: "warning" }],
      origin: "absent"
    };
  }
}

