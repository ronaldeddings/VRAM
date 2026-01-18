import type { HookConfigError, HookDefinition, HooksConfig, HooksConfigInput } from "../hooks/types.js";
import { normalizeHooksConfig } from "../hooks/normalize.js";

export type LegacyHooksMigrationReport = {
  counts: { workflow: number; command: number; prompt: number; agent: number };
  hasCommandHooks: boolean;
};

function countTypes(config: HooksConfig): LegacyHooksMigrationReport["counts"] {
  const counts = { workflow: 0, command: 0, prompt: 0, agent: 0 };
  for (const matchers of Object.values(config)) {
    for (const matcher of matchers) {
      const hooks = matcher.hooks ?? [];
      for (const h of hooks) {
        const t = (h as HookDefinition).type;
        if (t === "workflow") counts.workflow += 1;
        else if (t === "command") counts.command += 1;
        else if (t === "prompt") counts.prompt += 1;
        else if (t === "agent") counts.agent += 1;
      }
    }
  }
  return counts;
}

export function migrateLegacyHooksConfig(input: HooksConfigInput | null | undefined): {
  canonical: string;
  config: HooksConfig;
  errors: HookConfigError[];
  report: LegacyHooksMigrationReport;
} {
  const normalized = normalizeHooksConfig(input ?? {}, { source: "settings" });
  const counts = countTypes(normalized.config);
  return {
    canonical: normalized.canonical,
    config: normalized.config,
    errors: normalized.errors,
    report: { counts, hasCommandHooks: counts.command > 0 }
  };
}

