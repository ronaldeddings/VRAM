import type { HostCapabilities, HostFilesystem } from "../types/host.js";
import { joinPortablePath } from "../filesystem/path.js";
import type { HookConfigError, HooksConfigInput } from "./types.js";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeHooks(dest: HooksConfigInput, src: HooksConfigInput): HooksConfigInput {
  const out: HooksConfigInput = { ...dest };
  for (const [eventName, matchers] of Object.entries(src)) {
    const existing = (out as any)[eventName];
    if (!existing) {
      (out as any)[eventName] = matchers as any;
      continue;
    }
    if (Array.isArray(existing) && Array.isArray(matchers)) {
      (out as any)[eventName] = [...existing, ...matchers] as any;
      continue;
    }
    (out as any)[eventName] = matchers as any;
  }
  return out;
}

async function tryReadJson(fs: HostFilesystem, path: string): Promise<{ ok: true; value: unknown } | { ok: false; error: string }> {
  try {
    const text = await fs.readFileText(path);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function loadPluginHooks(options: { host: HostCapabilities; configDir: string }): Promise<{ hooks: HooksConfigInput; errors: HookConfigError[] }> {
  const errors: HookConfigError[] = [];
  const fsCap = options.host.filesystem;
  if (fsCap.kind !== "available") {
    return { hooks: {}, errors };
  }
  const fs = fsCap.value;

  const pluginsDir = joinPortablePath(options.configDir, "plugins");
  const exists = await fs.exists(pluginsDir);
  if (!exists) return { hooks: {}, errors };

  let merged: HooksConfigInput = {};
  const entries = await fs.listDir(pluginsDir);
  for (const ent of entries) {
    if (ent.kind !== "dir") continue;
    const hookFile = joinPortablePath(pluginsDir, ent.name, "hooks", "hooks.json");
    if (!(await fs.exists(hookFile))) continue;
    const parsed = await tryReadJson(fs, hookFile);
    if (!parsed.ok) {
      errors.push({ kind: "parse_error", source: "plugin", message: `Failed to read plugin hooks for ${ent.name}: ${parsed.error}`, pointer: hookFile });
      continue;
    }
    if (!isPlainObject(parsed.value)) {
      errors.push({ kind: "validation_error", source: "plugin", message: `Plugin hooks must be an object for ${ent.name}`, pointer: hookFile });
      continue;
    }
    merged = mergeHooks(merged, parsed.value as HooksConfigInput);
  }

  return { hooks: merged, errors };
}

