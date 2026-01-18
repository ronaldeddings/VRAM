import type { PermissionMode } from "../../core/permissions/types.js";

export function formatPermissionModeLabel(mode: PermissionMode): string {
  switch (mode) {
    case "default":
      return "Default";
    case "plan":
      return "Plan Mode";
    case "acceptEdits":
      return "Accept edits";
    case "bypassPermissions":
      return "Bypass Permissions";
    case "dontAsk":
      return "Don't Ask";
    default:
      return String(mode);
  }
}

export function getPermissionModeIcon(mode: PermissionMode): string {
  switch (mode) {
    case "default":
      return "";
    case "plan":
      return "⏸";
    case "acceptEdits":
    case "bypassPermissions":
    case "dontAsk":
      return "⏵⏵";
    default:
      return "";
  }
}

export type PermissionModeThemeKey = "text" | "planMode" | "autoAccept" | "permission";

export function getPermissionModeThemeKey(mode: PermissionMode): PermissionModeThemeKey {
  switch (mode) {
    case "plan":
      return "planMode";
    case "acceptEdits":
    case "bypassPermissions":
    case "dontAsk":
      return "autoAccept";
    case "default":
    default:
      return "text";
  }
}

