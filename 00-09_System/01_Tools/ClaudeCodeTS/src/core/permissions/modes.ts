import type { PermissionDiagnostic, PermissionMode } from "./types.js";

export type NormalizePermissionModeResult = { mode: PermissionMode; diagnostics: PermissionDiagnostic[] };

export function normalizePermissionMode(input: string | undefined | null): NormalizePermissionModeResult {
  if (!input) return { mode: "default", diagnostics: [] };
  const raw = String(input);
  switch (raw) {
    case "default":
    case "plan":
    case "acceptEdits":
    case "bypassPermissions":
    case "dontAsk":
      return { mode: raw, diagnostics: [] };
    default:
      return {
        mode: "default",
        diagnostics: [{ kind: "unknown_permission_mode", input: raw, normalizedTo: "default" }]
      };
  }
}

