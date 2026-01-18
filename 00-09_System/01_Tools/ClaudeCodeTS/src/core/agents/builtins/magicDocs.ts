import type { AgentDefinition } from "../types.js";
import { createBuiltInAgentId } from "../manager.js";
import type { BuiltInSubsystemPlan } from "./plans.js";

export type MagicDocHeaderParseResult = { title: string; instructions?: string };

export function parseMagicDocHeader(contents: string): MagicDocHeaderParseResult | null {
  const header = /^#\s*MAGIC\s+DOC:\s*(.+)$/gim;
  const match = header.exec(contents);
  if (!match) return null;
  const title = (match[1] ?? "").trim();
  if (title === "") return null;

  const after = contents.slice(match.index + match[0].length);
  const lines = after.split(/\r?\n/);
  let cursor = 0;
  while (cursor < lines.length && lines[cursor] !== undefined && lines[cursor]!.trim() === "") cursor += 1;
  if (cursor < lines.length) {
    const line = lines[cursor]!.trim();
    const instr = /^[_*](.+?)[_*]\s*$/.exec(line);
    if (instr && instr[1]) return { title, instructions: instr[1].trim() };
  }
  return { title };
}

export function renderMagicDocsTemplate(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
  return out;
}

export const MAGIC_DOCS_PLAN: BuiltInSubsystemPlan = {
  id: "magic_docs",
  name: "Magic Docs",
  featureGates: ["tengu_magic_docs", "CLAUDE_CODE_ENABLE_MAGIC_DOCS"],
  configKnobs: ["magicDocs.promptTemplatePath", "magicDocs.concurrency", "magicDocs.globRoots"],
  triggers: [
    { kind: "event", event: "repl_main_thread_turn_end", note: "Legacy gating checks querySource and tool_use presence." },
    { kind: "time", intervalMs: 60_000, note: "Optional periodic rescan; must be cancellable on mobile." }
  ],
  requiredCapabilities: [
    { key: "filesystem", optional: true, note: "File discovery is capability-gated; absent on mobile/web." },
    { key: "storage", note: "Stores registry of Magic Doc refs + last-updated metadata." }
  ],
  mobileSafeFallback: "If filesystem is unavailable, keep the registry empty and skip updates; never attempt network-only work.",
  privacyNotes: ["Edit-only enforcement must be applied as a hard tool gate; never allow Read/Exec for other paths."]
};

export const MAGIC_DOCS_AGENT: AgentDefinition = {
  id: createBuiltInAgentId("magic_docs"),
  name: "Magic Docs",
  kind: "background",
  budget: { maxConcurrent: 1, timeoutMs: 60_000, priority: "low" },
  persistence: { kind: "summary", sensitivity: "internal" },
  requiredCapabilities: ["storage"],
  run: async (ctx) => {
    void ctx;
    return { kind: "completed" };
  }
};
