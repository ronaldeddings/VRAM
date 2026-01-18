import { normalizePortablePath } from "../filesystem/path.js";
import type { PermissionDiagnostic } from "./types.js";

export function normalizeWorkingDirectoryPath(input: string): { ok: true; path: string; diagnostics: PermissionDiagnostic[] } | { ok: false; diagnostics: PermissionDiagnostic[] } {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, diagnostics: [{ kind: "invalid_working_directory", input, normalizedTo: null }] };

  const replaced = trimmed.replace(/\\/g, "/");

  if (replaced.startsWith("~/") || replaced === "~") {
    const rest = replaced === "~" ? "" : replaced.slice(2);
    const normalized = rest ? `~/${normalizePortablePath(rest)}` : "~";
    return { ok: true, path: normalized, diagnostics: [] };
  }

  const driveMatch = /^([a-zA-Z]):\/(.*)$/.exec(replaced);
  if (driveMatch) {
    const drive = driveMatch[1]!.toUpperCase();
    const rest = driveMatch[2] ?? "";
    const normalized = rest ? `${drive}:/${normalizePortablePath(rest)}` : `${drive}:/`;
    return { ok: true, path: normalized, diagnostics: [] };
  }

  if (replaced.startsWith("//")) {
    const normalized = normalizePortablePath(replaced);
    return { ok: true, path: normalized, diagnostics: [] };
  }

  if (replaced.startsWith("/")) {
    const normalized = normalizePortablePath(replaced);
    return { ok: true, path: normalized, diagnostics: [] };
  }

  return { ok: false, diagnostics: [{ kind: "invalid_working_directory", input, normalizedTo: null }] };
}

