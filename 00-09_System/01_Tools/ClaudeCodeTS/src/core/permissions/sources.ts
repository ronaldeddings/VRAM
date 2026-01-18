import type { PermissionRuleSource } from "./types.js";

export const LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE = [
  "userSettings",
  "projectSettings",
  "localSettings",
  "flagSettings",
  "policySettings",
  "cliArg",
  "command",
  "session"
] as const;

export type PermissionRuleSourceLabelStyle = "sentence" | "title" | "short";

export function formatPermissionRuleSource(source: PermissionRuleSource, style: PermissionRuleSourceLabelStyle): string {
  const s = String(source);

  const table: Record<string, { sentence: string; title: string; short?: string }> = {
    userSettings: { sentence: "user settings", title: "User settings", short: "user" },
    projectSettings: { sentence: "shared project settings", title: "Shared project settings", short: "project" },
    localSettings: { sentence: "project local settings", title: "Project local settings", short: "project, gitignored" },
    flagSettings: { sentence: "command line arguments", title: "Command line arguments", short: "cli flag" },
    policySettings: { sentence: "enterprise managed settings", title: "Enterprise managed settings", short: "managed" },
    cliArg: { sentence: "CLI argument", title: "CLI argument" },
    command: { sentence: "command configuration", title: "Command configuration" },
    session: { sentence: "current session", title: "Current session" }
  };

  const mapped = table[s];
  if (mapped) {
    if (style === "sentence") return mapped.sentence;
    if (style === "title") return mapped.title;
    return mapped.short ?? mapped.title;
  }

  if (style === "sentence") return s;
  if (style === "title") return s;
  return s;
}

