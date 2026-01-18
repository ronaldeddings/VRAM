Reading prompt from stdin...
OpenAI Codex v0.73.0 (research preview)
--------
[1mworkdir:[0m /Users/ronaldeddings/ClaudeCodeTS
[1mmodel:[0m gpt-5.2
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m danger-full-access
[1mreasoning effort:[0m high
[1mreasoning summaries:[0m auto
[1msession id:[0m 019b3c89-4cd1-7fe3-a6c9-505de0e8a530
--------
[36muser[0m
You are implementing PHASE 15 of 19.

==============================================
MISSION: IMPLEMENT THE REWRITE PLAN (PHASE-BY-PHASE)
==============================================

AUTHORITATIVE INPUTS:
- Implementation Plan: @/Users/ronaldeddings/ClaudeCodeTS/implementation/1-initial-rewrite-implementation-checklist.md
- CLI Encyclopedia: @CLI_ENCYCLOPEDIA.md
- Bundles directory: @/Users/ronaldeddings/ClaudeCodeTS/bundles
- Target source directory: @src
- Local docs directory: @/Users/ronaldeddings/ClaudeCodeTS/docs

LAST VALIDATION OUTPUT (FAILED):
- @/Users/ronaldeddings/ClaudeCodeTS/changelogs/implementation-20251220-094506/phase-15-validation-attempt-1.txt

Your job: fix the issues and re-run validation commands until they pass.

CRITICAL RULES:
1) Only implement PHASE 15 right now.
2) Do NOT jump ahead to future phases.
3) Read the relevant files thoroughly, especially the bundled/minified cli.js files @bundles/ClaudeCodeCode/cli.js and @bundles/ClaudeAgentSDKCode/cli.js.
4) You must treat third-party code as dependencies — do not re-implement vendor internals.
5) You must build a clean TypeScript module graph in ./src that matches the plan and the encyclopedia and @/Users/ronaldeddings/ClaudeCodeTS/implementation/1-initial-rewrite-implementation-checklist.md
6) Prefer async-first JS/TS, no subprocess-centric control flow.

AUTHENTICATION REQUIREMENT (SAFE):
- Use keychain to extract secrets, search for Claude Code-credentials .... within it there is an accessToken.... Also reference CLAUDE_CODE_SESSION_ACCESS_TOKEN in our old cli.js files
- Assume that using the keychain secret will log you in and you do NOT need to run /login.
- If you're able to run 'claude --dangerously-skip-permissions -p sayhello' and if it works, then creds are good and your code is not good.

WHAT TO DO IN THIS PHASE:
- Locate the 'Phase 15' section in the implementation plan and implement it fully.
- Check off every completed item in that Phase in the plan.
- Add at least one test that proves the phase works (or explain why a test is not applicable).
- If something is ambiguous, make a reasonable best decision and record it in the changelog as a 'Decision'.

VALIDATION:
- Run [0m[1mbun test [0m[2mv1.3.4 (5eb2145b)[0m, src/core/migration/legacySettingsFiles.ts(41,63): error TS2322: Type 'null' is not assignable to type 'SettingsPolicyOrigin'.
src/core/migration/legacySettingsFiles.ts(44,61): error TS2322: Type 'null' is not assignable to type 'SettingsPolicyOrigin'.
src/core/migration/legacySettingsFiles.ts(49,9): error TS2322: Type '"system" | "local" | "invalid"' is not assignable to type 'SettingsPolicyOrigin | null'.
  Type '"system"' is not assignable to type 'SettingsPolicyOrigin | null'.
src/core/migration/legacySettingsFiles.ts(55,5): error TS2322: Type 'SettingsPolicyOrigin | null' is not assignable to type 'SettingsPolicyOrigin'.
  Type 'null' is not assignable to type 'SettingsPolicyOrigin'.
src/core/migration/shadow.ts(62,10): error TS2352: Conversion of type '{ source: "policySettings"; settings: null; errors: never[]; origin: null; storageVersion: null; }' to type 'SettingsSourceReadResult' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Types of property 'origin' are incompatible.
    Type 'null' is not comparable to type 'SettingsPolicyOrigin'.
src/core/migration/shadow.ts(108,5): error TS2322: Type '"system" | "absent"' is not assignable to type 'SettingsPolicyOrigin'.
  Type '"system"' is not assignable to type 'SettingsPolicyOrigin'., and Import boundary check passed..
- ALSO: YOU MUST RUN THE IDENTICAL COMMAANDS that are in the previous cli.js files....
- If you cannot run something, explain why and what command should be run by the user.

STDOUT CONTRACT:
- Output ONLY a PHASE Change Log.
- Include these sections:
  1) Summary (what you accomplished in Phase 15)
  2) Files changed (created/modified/deleted)
  3) Decisions made (with rationale)
  4) Tests/validation run + results
  5) Remaining work inside Phase 15 (if any)
  6) Handoff notes for next phase

DO NOT print source code to stdout.
Begin now.

[36mmcp:[0m chrome-devtools starting
[36mmcp:[0m context7 starting
[36mmcp:[0m figma starting
[36mmcp:[0m figma ready
[36mmcp:[0m context7 ready
[36mmcp:[0m chrome-devtools ready
[36mmcp startup:[0m ready: figma, context7, chrome-devtools
[35mPlan update[0m
[3mImplement Phase 15 only: understand checklist, fix current TS errors in migration code, add tests, rerun bun test and legacy CLI-equivalent commands, then record changes.[0m
  [36m→[0m Read Phase 15 requirements
  [2m•[0m [2mInspect failing migration modules[0m
  [2m•[0m [2mFix type mismatches and behavior[0m
  [2m•[0m [2mAdd Phase 15 tests[0m
  [2m•[0m [2mRun required validation commands[0m
  [2m•[0m [2mUpdate Phase 15 checklist and changelog[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc ls[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 44ms:[0m
[2mbun.lock
bundles
changelogs
CLI_ENCYCLOPEDIA.md
CLI_FUNCTION_CLASS_MAP.md
dist
docs
ignore
implementation
instruction.md
node_modules
package.json
README.md
runner-v2.sh
runner-v3
scripts
src
tests
tsconfig.build.json
tsconfig.json[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,220p' src/core/migration/shadow.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 27ms:[0m
[2mimport type { HostCapabilities } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import { computePermissionPolicySnapshot, buildToolPermissionContextFromSettings, decideToolInvocationPermission } from "../permissions/index.js";
import type { PermissionDecision } from "../permissions/types.js";
import { resolveHooksConfig } from "../hooks/sources.js";
import type { EffectiveConfig } from "../settings/effectiveConfig.js";
import { readLegacySettingsFilesSnapshot } from "./legacySettingsFiles.js";
import type { EffectiveSettingsResult, SettingsSourceReadResult } from "../settings/types.js";
import type { TelemetryEventEnvelopeV1 } from "../types/observability.js";
import { SCHEMA_VERSION } from "../types/schema.js";

export type ShadowDiffKind = "effective_settings" | "permission_decision" | "hooks_canonical" | "mcp_mode";

export type ShadowDiff = {
  kind: ShadowDiffKind;
  legacy: string;
  v3: string;
};
[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "PHASE 15|Phase 15" implementation/1-initial-rewrite-implementation-checklist.md'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 33ms:[0m
[2m1525:  - [x] how dedupe interacts with shadow-mode diff logging during migration (Phase 15.3)
1617:***Phase 15: Migration Strategy from Existing CLI (Incremental Replacement)***
1820:Dependencies: Phase 2 architecture, Phase 8/9 tool+hook redesigns, Phase 15 migration plan, Phase 13 diagnostics.[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,200p' CLI_ENCYCLOPEDIA.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 23ms:[0m
[2m# CLI Encyclopedia (WIP) — Rebuilding `cli.js` into TypeScript

This is an **encyclopedia-style** guide to the two bundled/minified CLIs:

- `ClaudeAgentSDKCode/cli.js` (Claude Code 2.0.67 bundle)
- `ClaudeCodeCode/cli.js` (Claude Code 2.0.69 bundle)

Goal: document *what each top-level function/class does* (including minified symbol meanings) so we can **extract** it into a clean TypeScript module graph.

Important constraints:

1. These are **bundled + minified** with **no source maps** (no `sourceMappingURL`, no `*.map` files). That means:
   - Many identifiers are arbitrary (`uQ`, `coB`, `qV5`, …) and not stable across builds.
   - A symbol name alone is not meaningful without its **definition site** and **call sites**.
2. The bundle contains **a large amount of third-party code** (e.g., lodash, commander, AWS SDK, XML parsing, etc.). Rewriting those internals is usually the wrong goal; instead, we should treat them as **dependencies** in the TS rewrite.
3. Therefore, this encyclopedia is organized by **subsystems** and focuses first on **first-party/product logic** that should become your TS modules.

---

## How to read minified symbols (practical decoding rules)[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,120p' changelogs/implementation-20251220-094506/phase-15-validation-attempt-1.txt"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 21ms:[0m
[2m== VALIDATION: phase 15 ==

$ bun test tests/phase15*
bun test v1.3.4 (5eb2145b)

tests/phase15-engine-only-cli.test.ts:
(pass) Phase 15: engine-only diagnostic mode > engine-only prints a stable JSON report and exits 0 [36.51ms]

tests/phase15-migration.test.ts:
(pass) Phase 15: migration strategy primitives > legacy settings file snapshot merges sources in legacy order [2.00ms]
(pass) Phase 15: migration strategy primitives > legacy permission updates can be persisted back to legacy settings files [1.06ms]
(pass) Phase 15: migration strategy primitives > legacy MCP tool identifiers are canonicalized deterministically [0.07ms]
(pass) Phase 15: migration strategy primitives > shadow evaluation produces no diffs when settings are equivalent [2.18ms]

 5 pass
 0 fail
 17 expect() calls
Ran 5 tests across 2 files. [62.00ms]

$ bun test[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n \"legacySettingsFiles|shadow\\.ts|SettingsPolicyOrigin\" -S src/core/migration || true"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 26ms:[0m
[2msrc/core/migration/index.ts:3:export * from "./legacySettingsFiles.js";
src/core/migration/legacySettingsFiles.ts:5:import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
src/core/migration/legacySettingsFiles.ts:19:  policyOrigin: SettingsPolicyOrigin;
src/core/migration/legacySettingsFiles.ts:49:  const origin: SettingsPolicyOrigin | null =
src/core/migration/legacySettingsFiles.ts:72:  let policyOrigin: SettingsPolicyOrigin = "absent";
src/core/migration/shadow.ts:8:import { readLegacySettingsFilesSnapshot } from "./legacySettingsFiles.js";[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,220p' src/core/migration/legacySettingsFiles.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 22ms:[0m
[2mimport type { HostCapabilities } from "../types/host.js";
import { CapabilityUnavailableError } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
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
  effectiveSettings: JsonObject;[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '220,520p' src/core/migration/shadow.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 44ms:[0m
[2m    },
    v3: {
      effectiveSettings: v3Settings,
      permissionDecision: v3PermissionDecision as any,
      hooksCanonical: v3HooksCanonical,
      mcpSelectedMode: v3McpSelectedMode
    }
  };
}[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,220p' src/core/settings/types.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 50ms:[0m
[2mimport type { JsonObject } from "../types/json.js";

export type SettingsSource =
  | "userSettings"
  | "projectSettings"
  | "localSettings"
  | "policySettings"
  | "flagSettings"
  | "cliArg"
  | "command"
  | "session";

export type FileBackedSettingsSource = Extract<
  SettingsSource,
  "userSettings" | "projectSettings" | "localSettings" | "policySettings" | "flagSettings"
>;

export type AllowedSettingSource = Extract<SettingsSource, "userSettings" | "projectSettings" | "localSettings">;

export type NonFileSettingsSource = Exclude<SettingsSource, FileBackedSettingsSource>;[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "policyOrigin" src/core -S'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 67ms:[0m
[2msrc/core/migration/legacySettingsFiles.ts:19:  policyOrigin: SettingsPolicyOrigin;
src/core/migration/legacySettingsFiles.ts:72:  let policyOrigin: SettingsPolicyOrigin = "absent";
src/core/migration/legacySettingsFiles.ts:79:      if (res.origin) policyOrigin = res.origin;
src/core/migration/legacySettingsFiles.ts:80:      if (res.raw !== undefined && res.errors.length > 0 && res.settings === null) policyOrigin = "invalid";
src/core/migration/legacySettingsFiles.ts:88:    policyOrigin,
src/core/migration/shadow.ts:49:  policyOrigin: EffectiveSettingsResult["policyOrigin"];
src/core/migration/shadow.ts:67:    policyOrigin: options.policyOrigin
src/core/migration/shadow.ts:99:    policyOrigin: legacySnapshot.policyOrigin
src/core/migration/shadow.ts:108:    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
src/core/settings/effectiveConfig.ts:78:  policyOrigin: SettingsPolicyOrigin;
src/core/settings/effectiveConfig.ts:94:  const policyOrigin = options.policyOrigin;
src/core/settings/effectiveConfig.ts:95:  const failClosed = policyOrigin === "invalid";
src/core/settings/effectiveConfig.ts:99:    policy: { origin: policyOrigin },
src/core/settings/manager.ts:88:    policyOrigin: "absent"
src/core/settings/manager.ts:103:    policyOrigin: effective.policyOrigin,
src/core/settings/manager.ts:118:    let policyOrigin: SettingsPolicyOrigin = "absent";
src/core/settings/manager.ts:125:        if (res.origin) policyOrigin = res.origin;
src/core/settings/manager.ts:126:        if (res.storageVersion && res.errors.length > 0 && res.settings === null) policyOrigin = "invalid";
src/core/settings/manager.ts:136:    effective = { settings, errors, enabledSources, perSource: { ...perSource }, policyOrigin };
src/core/settings/manager.ts:140:      policyOrigin,[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,200p' src/core/settings/manager.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 54ms:[0m
[2mimport type { HostCapabilities, HostStorage, StorageChangeEvent } from "../types/host.js";
import { requireCapability } from "../types/host.js";
import type { JsonObject } from "../types/json.js";
import { applySettingsPatch, type SettingsPatchObject } from "./patch.js";
import { mergeSettingsObjectsInOrder } from "./merge.js";
import { computeEnabledFileSettingsSources } from "./sources.js";
import type {
  AllowedSettingSource,
  EffectiveSettingsResult,
  FileBackedSettingsSource,
  SettingsError,
  SettingsEventBus,
  SettingsPolicyOrigin,
  SettingsSource,
  SettingsSourceReadResult,
  SettingsUpdateEvent,
  SettingsUnsubscribe,
  WritableSettingsSource
} from "./types.js";
import {[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,240p' src/core/settings/storage.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 49ms:[0m
[2mimport type { JsonObject } from "../types/json.js";
import type { HostStorage, StorageNamespace } from "../types/host.js";
import { StorageConflictError } from "../types/host.js";
import type { WorkspaceId } from "../types/workspace.js";
import { parseSettingsJson, serializeSettingsDocument, type SettingsDocumentV1 } from "./schema.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { FileBackedSettingsSource, SettingsError, SettingsSource, SettingsSourceReadResult, SettingsPolicyOrigin } from "./types.js";

export type SettingsStorageContext = {
  workspaceId?: WorkspaceId;
  sessionId?: string;
};

export const SETTINGS_STORAGE_KEY_PREFIX = "settings/source/";

export function settingsStorageKey(source: SettingsSource): string {
  return `${SETTINGS_STORAGE_KEY_PREFIX}${source}`;
}

export function namespaceForSettingsSource(source: SettingsSource, ctx: SettingsStorageContext): StorageNamespace {[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,260p' src/core/settings/schema.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 45ms:[0m
[2mimport type { JsonObject } from "../types/json.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { SettingsError, SettingsSource } from "./types.js";

export const LEGACY_SETTINGS_SCHEMA_URL = "https://json.schemastore.org/claude-code-settings.json";

export const SETTINGS_SCHEMA_TOOLING_REQUIREMENTS = {
  runtimeValidation: true,
  jsonSchemaExport: true,
  rnCompatible: true
} as const;

export type SettingsDocumentV1 = {
  kind: "settings_document";
  schemaVersion: typeof SCHEMA_VERSION.settingsDocument;
  settings: JsonObject;
  meta?: {
    schemaUrl?: string;
    origin?: "local" | "remote";
    updatedAtWallMs?: number;[0m


[35m[3mthinking[0m[0m
**Clarifying code logic**

I see that the legacySettingsFiles snapshot uses a check for `res.origin` to set `policyOrigin`. It's expected to be present only for policy settings, while it should be absent for non-policy cases. Wait, if we’re missing a policy file, should we define the origin as "absent"? That means `policyOrigin` could rightfully be set to "absent," since non-empty strings are truthy in JS. Also, if the file doesn’t exist, origin is absent. I need to adjust our return type accordingly.
[35m[3mthinking[0m[0m
**Inspecting TypeScript errors**

I’m diving into the errors in shadow.ts, particularly at `toEffectiveSettingsResultLike` for `policySettings`. It looks like it’s using `origin: null`, but maybe it should be "absent" instead. The cast as `SettingsSourceReadResult` might be failing because of this origin mismatch. Later, we set the origin as "system," but should it be "remote" or "local"? I’ll fix the migration to ensure that when the policy is undefined, we create a read result with the origin set as "absent." I'll need to check how `computePermissionPolicySnapshot` interacts with this too.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,220p' src/core/permissions/policy.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 52ms:[0m
[2mimport type { JsonObject } from "../types/json.js";
import type { EffectiveSettingsResult, WritableSettingsSource } from "../settings/types.js";
import type { PermissionPolicySnapshot } from "./types.js";

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readBoolean(obj: JsonObject, key: string): boolean | null {
  const v = obj[key];
  return typeof v === "boolean" ? v : null;
}

function readStringArray(obj: JsonObject, key: string): string[] | null {
  const v = obj[key];
  if (!Array.isArray(v)) return null;
  const out: string[] = [];
  for (const item of v) if (typeof item === "string") out.push(item);
  return out;
}[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1600,1880p' implementation/1-initial-rewrite-implementation-checklist.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 51ms:[0m
[2m  - [x] cancellation terminates streams and releases concurrency permits
  - [x] tool output schema validation errors are surfaced consistently
- [x] Add conformance tests for the new tool tracks:
  - [x] `search.grep` correctness vs fixture expectations (ordering + match locations)
  - [ ] `vcs.git` read-only correctness on fixture repos (status/diff normalization)
  - [x] patch/apply-edits deterministic behavior across newline variants
- [x] Add a “no subprocess” enforcement test:
  - [x] static scan in CI for disallowed imports/APIs in core (`child_process`, `spawn`, `exec`, shell flags)
  - [x] runtime guard in dev/test hosts that throws if a subprocess API is invoked (host adapter only, not core)

14.7 Security, policy, and redaction tests (cross-platform invariants)
- [x] Add tests that assert redaction invariants for logs/telemetry/bundles (no secrets; no raw file contents by default).
- [x] Add tests for policy override explainability (every deny/force decision attributes a source + reasoning code).
- [x] Add tests for managed-only constraints (hooks/tools/telemetry) in “enterprise policy” fixtures.

---

***Phase 15: Migration Strategy from Existing CLI (Incremental Replacement)***

Why this phase exists: the rewrite must ship incrementally; migration must validate correctness while reducing risk to users.[0m




[35m[3mthinking[0m[0m
**Clarifying Phase 15 Tasks**

I see that Phase 15 is mostly checked off, with just the 15.6 items left. The user’s task is to focus on implementing Phase 15, which might involve tests we've encountered earlier. However, there are compile errors in the migration modules, likely due to type mismatches. My goal is to fix these errors and run the necessary tests. After doing so, I need to update the checklist for completed items in Phase 15, particularly regarding 15.6. It seems like this phase might include those items.
[35m[3mthinking[0m[0m
**Implementing Phase 15 Fully**

The user has asked me to implement Phase 15 completely, which might include the cutover order milestones from 15.6. However, that could be part of future phases. The validation output shows previous Phase 15 tests passed, but I'm currently facing compile errors that are blocking `bun test`. These seem to arise from type errors, but the last validation attempt indicated that tests passed. I also need to thoroughly read the relevant files, especially `cli.js`, to confirm the semantics for policy origin mapping. I'll search for "policySettings" and the origin string in those sections.
[35m[3mthinking[0m[0m
**Implementing Phase 15 Steps**

I’m planning to use search in the bundles for minimal reading and to avoid reimplementing vendor internals. There’s an authentication requirement where I need to use the keychain for extracting Claude Code credentials. It seems like Phase 15 involves migrating from the existing CLI and possibly reading a legacy settings file. 

I need to validate using the command `claude --dangerously-skip-permissions -p sayhello` to ensure our code’s prompt mode works correctly after `bun test` passes. I'll extract the token from the keychain for the environment variable needed to run the CLI.
[35m[3mthinking[0m[0m
**Inspecting Test Cases**

I see that `tests/phase12-cli-entrypoint` has a case for the `-p` option, which sends a prompt and prints the model's output. This likely uses a fixture token, or maybe it pulls from an environment variable. I'll need to inspect `tests/phase12-cli-entrypoint.test.ts` quickly to clarify how this is set up. Understanding this will help me ensure I’m implementing the expected behavior correctly.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,240p' tests/phase12-cli-entrypoint.test.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 46ms:[0m
[2mimport { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";

function runCli(args: string[], env?: Record<string, string | undefined>): { code: number; out: string } {
  const mergedEnv: Record<string, string> = { ...process.env } as Record<string, string>;
  for (const [k, v] of Object.entries(env ?? {})) {
    if (v === undefined) delete mergedEnv[k];
    else mergedEnv[k] = v;
  }
  const proc = Bun.spawnSync(["bun", "src/cli.ts", ...args], {
    env: mergedEnv,
    stdout: "pipe",
    stderr: "pipe"
  });
  const out = `${proc.stdout.toString()}\n${proc.stderr.toString()}`.trim();
  return { code: proc.exitCode, out };
}
[0m



[35m[3mthinking[0m[0m
**Evaluating Phase 15 Implementation**

I need to locate and fully implement the 'Phase 15' section in the plan. But I noticed that section 15.6 is unchecked, and I wonder if it’s out of scope. It seems phase 15 includes 15.6, but we’re facing immediate TS errors from migration, likely due to the bun test. We need to implement a fix and update the checklist, but 15.6 is significant and may not need to be completed right now.
[35m[3mthinking[0m[0m
**Analyzing Phase 15 Implementation**

I wonder if "Phase 15" in the implementation plan is primarily about stage definitions, shims, and shadow modes, while section 15.6, the "Incremental subsystem cutover order," might not need immediate implementation since it resembles a future phase. They probably expect us to at least have placeholders or gating flags for it. The tests mentioned for Phase 15 already exist, which brings up compile errors possibly from earlier changes. I’ll fix these and consider adding a test for policy origin types.
[35m[3mthinking[0m[0m
**Examining Phase 15 Tests**

In Phase 15, the migration's readLegacySettingsFilesSnapshot should correctly set the policy origin based on any errors from parsing the settings file. There’s already a test called "shadow evaluation produces no diffs when settings equivalent." However, I think it might be beneficial to add a new test specifically for origin mapping. I’ll take a closer look at the tests in phase15-migration.test.ts to see how we can implement this.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,260p' tests/phase15-migration.test.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 47ms:[0m
[2mimport { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { readLegacySettingsFilesSnapshot, applyPermissionUpdatesToLegacySettingsFile } from "../src/core/migration/legacySettingsFiles.js";
import { canonicalizeLegacyToolIdentifier } from "../src/core/migration/toolMapping.js";
import { computeEffectiveConfig } from "../src/core/settings/effectiveConfig.js";
import { runShadowEvaluation } from "../src/core/migration/shadow.js";

describe("Phase 15: migration strategy primitives", () => {
  test("legacy settings file snapshot merges sources in legacy order", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-settings-"));
    const configDir = path.join(dir, "config");
    const projectRoot = path.join(dir, "project");
    await mkdir(configDir, { recursive: true });
    await mkdir(path.join(projectRoot, ".claude"), { recursive: true });

    await writeFile(path.join(configDir, "settings.json"), JSON.stringify({ a: 1, list: [1], hooks: { Foo: [] } }, null, 2), "utf8");
    await writeFile(path.join(projectRoot, ".claude", "settings.json"), JSON.stringify({ a: 2, list: [2] }, null, 2), "utf8");[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,220p' src/core/settings/legacyPaths.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 49ms:[0m
[2mimport type { HostFilesystem, HostProcess } from "../types/host.js";
import type { FileBackedSettingsSource } from "./types.js";

export type LegacySettingsPathContext = {
  process?: HostProcess;
  filesystem?: HostFilesystem;
  configDir?: string;
  projectRoot?: string;
  flagSettingsPath?: string | null;
};

export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
  const viaEnv = process?.getEnv?.("CLAUDE_CONFIG_DIR");
  if (viaEnv) return viaEnv;
  return null;
}

export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
  const platform = ctx.process?.platform?.() ?? "unknown";
  if (platform === "win32") {[0m

[35m[3mthinking[0m[0m
**Evaluating permission policies**

I'm trying to figure out which matters when considering computePermissionPolicySnapshot. It only uses policyOrigin for invalid cases, and remote, local, and absent seem to behave the same, except possibly for telemetry. But for consistency, maybe I should choose "remote." However, "remote" implies a policy from a remote source, while there might be local systems involved. It seems "remote" links to an enterprise-managed policy, so I should check the documentation regarding settings origin in our CLI encyclopedia. Let's search!
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "SettingsPolicyOrigin|policy origin|managed-settings|policySettings" -S CLI_ENCYCLOPEDIA.md'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 59ms:[0m
[2m598:- 2.0.67: `wL=["userSettings","projectSettings","localSettings","flagSettings","policySettings"]` at `ClaudeAgentSDKCode/cli.js` (byte offset ~`4019467`)
599:- 2.0.69: `JL=["userSettings","projectSettings","localSettings","flagSettings","policySettings"]` at `ClaudeCodeCode/cli.js` (byte offset ~`4019440`)
607:5. `policySettings`
817:- `"policySettings"` → `"enterprise managed settings"`; `"Enterprise managed settings"`; `"managed"`
982:  - `"policySettings"` — enterprise/managed settings (local file or remote)
1010:2. Always add `"policySettings"` and `"flagSettings"`.
1020:- `type SettingsSource = "userSettings" | "projectSettings" | "localSettings" | "policySettings" | "flagSettings" | "cliArg" | "command" | "session";`
1032:  - `ig2()` returns `join(VM(), "managed-settings.json")`
1035:  - `ru2()` returns `join(sL(), "managed-settings.json")`
1051:- `"projectSettings"` / `"localSettings"` / `"policySettings"` base dir = resolved project root (`cQ()` / `pQ()`)
1052:  - note: for `"policySettings"` this is only used for some relative computations; the actual file is `managed-settings.json` in the system directory above
1065:- `"policySettings"` → `<systemDir>/managed-settings.json`
1115:- For `"policySettings"`:
1117:  - Otherwise fall back to reading `managed-settings.json`.
1162:   - If source is `"policySettings"`:
1163:     - merge in `uB("policySettings")` if present, and continue
1223:   - if `source === "policySettings" || source === "flagSettings"` → `{ error:null }`
1384:- If `policySettings.allowManagedHooksOnly === true`, the system uses **only** policy-managed hooks and excludes plugin hooks + user/project/local settings hooks.
1392:    - if `uB("policySettings")?.allowManagedHooksOnly===!0` → `policySettings.hooks ?? {}`
1406:    - if `uB("policySettings")?.allowManagedHooksOnly===!0` → `policySettings.hooks ?? {}`[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '940,1100p' CLI_ENCYCLOPEDIA.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 47ms:[0m
[2m- For rule updates:
  - writes to settings via a helper (`ocA` / `acA`) or `X2/E2` partial settings update.
- For directory updates:
  - updates `permissions.additionalDirectories` in the destination settings file.
- For `setMode`:
  - updates `permissions.defaultMode` in the destination settings file.

Batch persist:

- 2.0.67: `W8A(updates)` loops `$f`
- 2.0.69: `D8A(updates)` loops `eP`

Canonical TS:

- `applyPermissionUpdates(ctx, updates): ToolPermissionContext`
- `persistPermissionUpdates(updates): Promise<void>`

---

# Chapter 5 — Settings system (schema, merge, IO, watchers)[0m





[35m[3mthinking[0m[0m
**Evaluating path resolution changes**

I'm thinking about altering path resolution and how it might change behavior, possibly aligning better with the bundle. It seems safe, but I wonder if it could affect tests? I plan to add tests for policy path resolve to ensure it doesn’t require the project root. There's a compile error related to migration files rather than legacy paths, and I should check the plan for Phase 15 to address compatibility issues. I'll prioritize fixing the compile errors first.
[35m[3mthinking[0m[0m
**Reviewing migration instructions**

I realize we need to thoroughly read the bundles in cli.js, especially focusing on migration for Phase 15. I think it’s wise to limit our attention to relevant sections about settings origins and migration. The instructions suggest reading bundled or minified cli.js files, so I’ll open those files and search for relevant functions to note in the changelog. After confirming our progress, we can move to fixing code with apply_patch, ensuring changes are made to how origins are handled in legacy settings files.
[35m[3mthinking[0m[0m
**Updating shadow.ts and settings results**

In the file `src/core/migration/shadow.ts`, I'll focus on the function `toEffectiveSettingsResultLike`. It currently uses a `perSource` object where the origin is set to null, so I think we should omit that or mark it as absent. I want to replace "system" with "remote" and consider removing unsafe casts. I notice they use `as any`, which might not be necessary if we properly type `perSource` as `EffectiveSettingsResult["perSource"]`. 

In `legacySettingsFiles`, they imported `EffectiveSettingsResult` but aren't using it effectively, so I should clean that up to enhance clarity.
[35m[3mthinking[0m[0m
**Refining settings source return values**

I want to ensure that the `readOne` function returns `SettingsSourceReadResult` along with optional properties like `raw` and `filePath`. I’m considering conditionally adding the `origin` property using a spread operator. The conditional will check if the source is "policySettings" and handle the `origin` values accordingly. 

If `origin` is undefined, it won’t be included. Regarding the `filePath`, if it's missing, I might want to determine if `origin` is “absent.” For policy settings, I prefer computing the `systemDir` and returning its path, even if `resolveLegacySettingsFilePath` initially suggests defaulting to the project root. I should adjust these functions to work regardless of the project root’s existence by using the current working directory as a fallback.
[35m[3mthinking[0m[0m
**Adjusting base checks for paths**

I see that the `base` can be null if neither condition applies, and currently, `resolveLegacySettingsFilePath` uses the base check for all sources except flagSettings. I think I should move the base check after the policySettings case, so for policySettings, we can ignore the base and always return the system path. For the other sources, I'll still require the base.

However, I need to be cautious since this file may fall under the scope of some AGENTS instructions. I’ll need to search for any relevant AGENTS documentation, such as AGENTS.md, to ensure I’m following the proper guidelines.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'find .. -name AGENTS.md -print'[0m in /Users/ronaldeddings/ClaudeCodeTS[31m exited 124 in 10.02s:[0m
[2mfind: ../.fleet: Permission denied[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'find . -name AGENTS.md -print 2>/dev/null || true'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 143ms:[0m
[2m[0m

[35m[3mthinking[0m[0m
**Implementing changes**

Alright, I need to make sure we’re moving forward with the patch. It’s good that there are no AGENTS involved. However, I'm noticing some TypeScript errors in legacySettingsFiles.ts, specifically at lines 41 and 63. I should patch those issues as we implement the changes to avoid any complications later. Let’s get that sorted out and proceed carefully!
[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/src/core/migration/legacySettingsFiles.ts[0m
@@ -4,3 +4,3 @@
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
[31m-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";[0m
[32m+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";[0m
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
@@ -40,6 +40,12 @@
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
[31m-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };[0m
[32m+  if (!filePath) {[0m
[32m+    const origin = source === "policySettings" ? ("absent" as const) : undefined;[0m
[32m+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };[0m
[32m+  }[0m
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
[31m-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };[0m
[32m+  if (!exists) {[0m
[32m+    const origin = source === "policySettings" ? ("absent" as const) : undefined;[0m
[32m+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };[0m
[32m+  }[0m
 
@@ -48,4 +54,13 @@
   const settings = parsed.document?.settings ?? null;
[31m-  const origin: SettingsPolicyOrigin | null =[0m
[31m-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";[0m
[32m+[0m
[32m+  const origin: SettingsPolicyOrigin | undefined =[0m
[32m+    source === "policySettings"[0m
[32m+      ? parsed.errors.length > 0 && settings === null[0m
[32m+        ? "invalid"[0m
[32m+        : parsed.document?.meta?.origin === "remote"[0m
[32m+          ? "remote"[0m
[32m+          : "local"[0m
[32m+      : undefined;[0m
[32m+[0m
[32m+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));[0m
   return {
@@ -53,4 +68,4 @@
     settings,
[31m-    errors: parsed.errors,[0m
[31m-    origin,[0m
[32m+    errors,[0m
[32m+    ...(origin ? { origin } : {}),[0m
     storageVersion: null,
@@ -133,2 +148 @@
 }
[31m-[0m
[32mapply_patch(auto_approved=true) exited 0 in 17ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM src/core/migration/legacySettingsFiles.ts[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-

[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-

[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/src/core/migration/shadow.ts[0m
@@ -50,2 +50,5 @@
 }): EffectiveSettingsResult {
[32m+  const policySettings: SettingsSourceReadResult =[0m
[32m+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };[0m
[32m+[0m
   return {
@@ -55,9 +58,7 @@
     perSource: {
[31m-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },[0m
[31m-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },[0m
[31m-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },[0m
[31m-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },[0m
[31m-      policySettings:[0m
[31m-        options.policy ??[0m
[31m-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),[0m
[32m+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },[0m
[32m+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },[0m
[32m+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },[0m
[32m+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },[0m
[32m+      policySettings,[0m
       cliArg: { source: "cliArg", settings: null, errors: [] },
@@ -65,3 +66,3 @@
       session: { source: "session", settings: null, errors: [] }
[31m-    } as any,[0m
[32m+    } satisfies EffectiveSettingsResult["perSource"],[0m
     policyOrigin: options.policyOrigin
@@ -105,5 +106,11 @@
       options.hookResolution?.policySettings !== undefined
[31m-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)[0m
[32m+        ? ({[0m
[32m+            source: "policySettings",[0m
[32m+            settings: options.hookResolution.policySettings,[0m
[32m+            errors: [],[0m
[32m+            origin: options.hookResolution.policySettings ? "local" : "absent",[0m
[32m+            storageVersion: null[0m
[32m+          } satisfies SettingsSourceReadResult)[0m
         : undefined,
[31m-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"[0m
[32m+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"[0m
   });
[32mapply_patch(auto_approved=true) exited 0 in 20ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM src/core/migration/shadow.ts[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);



[35m[3mthinking[0m[0m
**Resolving TypeScript Errors**

I'm dealing with some TypeScript errors related to the settings policy origin. It looks like we adjusted the origin types to include "local" and "absent," which is good. However, there's another error in `legacySettingsFiles.ts` regarding `SettingsPolicyOrigin | null`. We need to ensure that the `res.origin` is optional but not null.

It seems I might need to fix the `resolveLegacySettingsFilePath` depending on policy settings, but I'll review that later. Right now, my focus is on completing Phase 15 and ensuring everything runs smoothly with no errors in TypeScript before running tests. I'll also update the plan as needed.
[35m[3mthinking[0m[0m
**Inspecting TypeScript Files**

First, I need to check `src/core/migration/legacySettingsFiles.ts` to ensure there are no TypeScript issues lingering. It’s important to avoid errors before proceeding. Checking that the error mapping adds the correct `filePath` is essential too, so that’s a good sign. Once I’ve inspected everything and confirmed that it’s all in order, I'll run `bun test` to catch any further issues that might pop up. Time to dive in and get this done!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'bun test'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 3.15s:[0m
[2mbun test v1.3.4 (5eb2145b)

tests/phase6-settings.test.ts:
(pass) Phase 6: settings system > enabled sources flag parser matches legacy [0.15ms]
(pass) Phase 6: settings system > enabled file sources always include policy+flag (and preserve legacy order) [0.10ms]
(pass) Phase 6: settings system > patch semantics: delete on undefined + arrays replace [0.15ms]
(pass) Phase 6: settings system > storage-backed settings manager merges enabled sources and suppresses self-triggered watch events [1.33ms]
(pass) Phase 6: settings system > export/import bundle captures per-source settings objects [0.08ms]
(pass) Phase 6: settings system > invalid policy settings fail-closed in EffectiveConfig [0.24ms]
(pass) Phase 6: settings system > remote policy refresh writes to cache (storage) [0.26ms]

tests/phase3-event-bus.test.ts:
(pass) Phase 3: event bus semantics > emits monotonic seq per channel and supports cursors [0.83ms]
(pass) Phase 3: event bus semantics > recording helper captures envelopes and can be stopped [0.25ms]
(pass) Phase 3: event bus semantics > includeSnapshot yields a snapshot envelope before live events [0.17ms]
(pass) Phase 3: event bus semantics > coalescing policy can replace queued events deterministically [0.20ms]

tests/phase4-leak-prevention.test.ts:
(pass) Phase 4: capability leak prevention heuristics > no module-level HostCapabilities singletons in portable src/core [24.06ms]
[0m

[35m[3mthinking[0m[0m
**Exploring installation options**

I’m not sure if we have official `claude` installed yet. I wonder if the repository includes runner scripts to manage the bundle? There might be a `dist` directory, so I should check the `package.json` scripts to see what options might be available. It's important I confirm that to get everything set up correctly!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'cat package.json'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 35ms:[0m
[2m{
  "name": "claude-code-ts-rewrite",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "cli": "bun src/cli.ts",
    "start": "bun src/cli.ts",
    "build": "tsc -p tsconfig.build.json",
    "test": "bun test",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "check:boundaries": "node scripts/check-import-boundaries.mjs"
  },
  "bin": {
    "claude-ts": "dist/cli.js"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "typescript": "^5.8.3"
  },[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'which claude && claude --version || true'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 438ms:[0m
[2m/Users/ronaldeddings/.nvm/versions/node/v22.17.1/bin/claude
2.0.74 (Claude Code)[0m





[35m[3mthinking[0m[0m
**Considering test implementation**

I'm thinking about adding a new test to the Phase 15 file to verify that the policy origin is marked as "invalid" when the managed settings JSON is incorrect and "absent" when it's missing. However, to write this test, I need a fake policy file in a system directory, which might not be accessible due to permissions. 

Instead, I could consider overriding the `resolveLegacyPolicySystemDir` function, but that relies on the actual system path, which isn't safe. I wonder if there's a way to inject the policy settings path as a context flag for the test.
[35m[3mthinking[0m[0m
**Exploring path override options**

I'm considering an alternative approach in `readLegacySettingsFilesSnapshot` where I can include `policySettings`, but I must control the file path. I could modify `legacyPaths.ts` to allow for a `ctx.policySettingsPath` override, even if that adds extra code. 

Phase 15 seems to require this, although it wasn’t planned initially. I'm thinking about adding a temporary `process` capability in `ctx`, but it still uses a fixed system directory that can't be overridden. Perhaps I can set `ctx.process.platform` to "unknown," but that leads to an unmodifiable path. For the tests to utilize `policySettings`, I would need to adjust the path resolution for system policy directories, which might be feasible through `ctx.configDir`. For a test-only solution, the `LegacySettingsPathContext` could incorporate necessary components.
[35m[3mthinking[0m[0m
**Evaluating the policy directory options**

I'm considering adding `policySystemDir?: string | null` or `policySettingsPath?: string` to the code, and this could be part of Phase 15. It's in `core/settings/legacyPaths.ts`, and making these optional overrides is a small change that helps with tests and cross-platform functionality. 

I want to be cautious to ensure this doesn't impact other phases negatively; it should remain optional and not break anything. By updating `resolveLegacyPolicySystemDir` to check for an override in `ctx`, it allows tests to specify a temporary directory. I’ll document this decision in the changelog. Although it feels like jumping ahead, it's actually part of the migration shims for Phase 15. Adding the override seems necessary to support both tests and development.
[35m[3mthinking[0m[0m
**Implementing internal overrides**

The addition of the `ctx` override is purely internal, aimed at tests and embedding, so it's not user-facing, which is fine. I’ll make sure to document this change. 

The plan involves updating `src/core/settings/legacyPaths.ts` by adding `policySystemDir?: string | null` to `LegacySettingsPathContext`. I’ll modify `resolveLegacyPolicySystemDir(ctx)` so that it checks for `ctx.policySystemDir`. Additionally, I’ll adjust `resolveLegacySettingsFilePath` for `policySettings` to allow it without requiring a base path. While this may affect other code, it’s important to improve correctness. If `ctx.process` is missing, we can default to "unknown."
[35m[3mthinking[0m[0m
**Refining path resolutions**

In the code snippet, if the `source` is "policySettings," I’ll resolve the legacy system directory using `ctx` to get the path for `managed-settings.json`. However, right now, `resolveLegacySettingsBaseDir` returns `projectRoot` for `policySettings`, but that won’t be necessary going forward. 

I could keep this function since it might be useful for other computations or parts of the code that search for paths in the future. It's important to ensure everything is structured correctly for those potential uses.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n \"resolveLegacySettingsBaseDir\\(\" src/core/settings/legacyPaths.ts src -S"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 52ms:[0m
[2msrc/core/settings/legacyPaths.ts:27:export function resolveLegacySettingsBaseDir(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): string | null {
src/core/settings/legacyPaths.ts:48:  const base = resolveLegacySettingsBaseDir(source, ctx);
src/core/settings/legacyPaths.ts:27:export function resolveLegacySettingsBaseDir(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): string | null {
src/core/settings/legacyPaths.ts:48:  const base = resolveLegacySettingsBaseDir(source, ctx);[0m


[35m[3mthinking[0m[0m
**Evaluating implementation steps**

The user wants me to locate and fully implement the "Phase 15" section. However, I see there are 15.6 items that seem uncompleted. Maybe we should prioritize the first bullet about merging settings and watcher semantics if those are part of Phase 15. It’s unclear whether I need to implement tasks in 15.6 now or if they’re planned for future phases. I might have to consider the potential changes needed across settings and permissions.
[35m[3mthinking[0m[0m
**Inspecting the project plan**

I need to follow the plan, and it looks like I should focus on the area around 15.6. It’s possible that the details are truncated from previous outputs or there could be more information after 15.6. So, I should inspect that section thoroughly to see what remains. Taking a closer look might reveal essential details that I need for the implementation.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1880,1970p' implementation/1-initial-rewrite-implementation-checklist.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 35ms:[0m
[2m
***Completion Criteria***

- ✅ The core engine boots and runs on iOS (React Native) with filesystem/shell capabilities absent, using only injected portable capabilities.
- ✅ A deterministic scheduler test harness exists, and core concurrency behavior is reproducible under test (timeouts/cancellation/streaming).
- ✅ A replay capture + deterministic reproduction harness exists, and a baseline set of golden captures replays identically across Node + web-like + RN-like adapters.
- ✅ Tool execution is async-first and does not rely on a process-per-task model; streaming output is consistent across CLI/RN/web adapters.
- ✅ Static “no subprocess” enforcement passes across core and host adapters (no `child_process`/spawn/exec usage in the shipped codebase).
- ✅ Legacy `--ripgrep` behavior is replaced by an in-process `search.grep` command/tool with parity and performance gates; no packaged binaries/subprocesses required.
- ✅ Hooks are implemented as portable, serializable async workflows (no shell commands, no env var/stdio protocols).
- ✅ Hook event coverage includes `UserPromptSubmit`, and global hook gating (`disableAllHooks`, managed-only) is specified and validated with golden tests.
- ✅ Permissions decisions are explainable, attributable to sources, and enforced as capability gates across tools/MCP/hooks.
- ✅ Sandbox-network approvals are modeled as first-class policy decisions with queue/leader-worker parity tests and cannot be bypassed by direct network capability use.
- ✅ MCP supports endpoint mode with mobile-safe transports and integrates with elicitation and permissions; direct mode is optional and capability-gated.
- ✅ Legacy `--mcp-cli` workflows are available via engine commands without spawning a separate process, including endpoint-mode telemetry dedupe.
- ✅ Settings layering/merge semantics match legacy behavior unless explicitly changed, with structured errors and portable change propagation.
- ✅ Background agents run cooperatively with explicit budgets and safe mobile lifecycle behavior.
- ✅ Migration plan supports incremental cutover from the existing CLI with shadow-mode diff validation.
- ✅ A phase-gated cutover checklist exists with objective pass/fail criteria (parity suites, conformance matrices, and policy/redaction linting).
- ✅ Diagnostic bundles can be generated on all hosts and pass automated redaction linting.[0m



[35m[3mthinking[0m[0m
**Clarifying Phase 15 tasks**

It seems like there's some confusion regarding Phase 15's tasks; 15.6 portions were truncated earlier, but it appears they might not require immediate implementation. The user wants Phase 15 fully completed, but there are still 15.6 incomplete items, which might be left for future phases. I'm wondering if they were intentionally not completed in Phase 15. However, the validation output issues stem from TypeScript compile errors related to migration and settings, so they're still part of Phase 15.
[35m[3mthinking[0m[0m
**Addressing compile issues and code inspection**

I need to fix the compile errors and add the necessary tests. The user also wants me to read through `bundled cli.js`. To address this, I'll search and inspect the relevant code related to settings origin and migration. Since these are massive minified files, reading the whole thing isn’t really feasible, so I’ll focus on specific snippets around the managed-settings path function. I'll use commands like `rg` and `sed` on lines 4380-4420, and check line counts with `wc -l`. Let's ensure we locate the file paths correctly!
[35m[3mthinking[0m[0m
**Locating line numbers in cli.js**

I noticed that the line numbers in the encyclopedia likely refer to `cli.js`, specifically line 4390. To countercheck, I'll use `wc -l bundles/ClaudeCodeCode/cli.js` to find out the total number of lines in that file. This way, I can accurately see where the relevant sections are and confirm how to approach the code inspection based on that line reference. I want to make sure I'm on the right track!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'wc -l bundles/ClaudeCodeCode/cli.js bundles/ClaudeAgentSDKCode/cli.js'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 58ms:[0m
[2m    4752 bundles/ClaudeCodeCode/cli.js
    4762 bundles/ClaudeAgentSDKCode/cli.js
    9514 total[0m

[35m[3mthinking[0m[0m
**Exploring settings functions**

I'm noting that there are about 4,752 lines in the code. That’s a decent amount to work with! It looks like I need to focus on lines 4,390 to 4,410 to investigate the managed settings path function. I plan to use sed for editing and manipulating the text. This feels like a good way to get to the heart of the matter efficiently!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n \"managed-settings\\.json\" bundles/ClaudeCodeCode/cli.js bundles/ClaudeAgentSDKCode/cli.js | head"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 45ms:[0m
[2mbundles/ClaudeCodeCode/cli.js:4390:`)}function Yo1(A){let{content:Q}=oS0.readFile(A);return Q}function rL(A,Q,B={encoding:"utf-8"}){let G=jA(),Z=A;if(G.existsSync(A))try{let J=G.readlinkSync(A);Z=F71(J)?J:iu2(wJ0(A),J),f(`Writing through symlink: ${A} -> ${Z}`)}catch(J){Z=A}let Y=`${Z}.tmp.${process.pid}.${Date.now()}`;try{f(`Writing to temp file: ${Y}`);let J,I=G.existsSync(Z);if(I)J=G.statSync(Z).mode,f(`Preserving file permissions: ${J.toString(8)}`);else if(B.mode!==void 0)J=B.mode,f(`Setting permissions for new file: ${J.toString(8)}`);let X={encoding:B.encoding,flush:!0};if(!I&&B.mode!==void 0)X.mode=B.mode;if(G.writeFileSync(Y,Q,X),f(`Temp file written successfully, size: ${Q.length} bytes`),I&&J!==void 0)xV5(Y,J),f("Applied original permissions to temp file");f(`Renaming ${Y} to ${Z}`),G.renameSync(Y,Z),f(`File ${Z} written atomically`)}catch(J){f(`Failed to write file atomically: ${J}`),s(J),r("tengu_atomic_write_error",{});try{if(G.existsSync(Y))f(`Cleaning up temp file: ${Y}`),G.unlinkSync(Y)}catch(I){f(`Failed to clean up temp file: ${I}`)}f(`Falling back to non-atomic write for ${Z}`);try{let I={encoding:B.encoding,flush:!0};if(!G.existsSync(Z)&&B.mode!==void 0)I.mode=B.mode;G.writeFileSync(Z,Q,I),f(`File ${Z} written successfully with non-atomic fallback`)}catch(I){throw f(`Non-atomic write also failed: ${I}`),I}}}function H71(A){return eu(A)}function II(A){let Q=A/1024;if(Q<1)return`${A} bytes`;if(Q<1024)return`${Q.toFixed(1).replace(/\.0$/,"")}KB`;let B=Q/1024;if(B<1024)return`${B.toFixed(1).replace(/\.0$/,"")}MB`;return`${(B/1024).toFixed(1).replace(/\.0$/,"")}GB`}function KJA(A){let Q=$J0(A);if(!Q)return"unknown";return nu2.getLanguage(Q.slice(1))?.name??"unknown"}function p81(A){let Q=jA();try{if(!Q.existsSync(A))Q.mkdirSync(A);return!0}catch(B){return s(B instanceof Error?B:Error(String(B))),!1}}function joA(A,Q=YwA){try{return jA().statSync(A).size<=Q}catch{return!1}}var nu2,YwA=262144,HRB,D71,Mj;var M9=L(()=>{h1();Y0();LZ();T0();dV0();xj();pB();o2();XQ();rS0();cY();k3();OZ();nu2=o(JX1(),1);HRB=Z0(async()=>{let A=g9();setTimeout(()=>{A.abort()},1000);let Q=await cL0(r1(),A.signal,15),B=0;for(let G of Q)if(DAA(G)==="CRLF")B++;return B>3?"CRLF":"LF"});D71=HZ1("claude-cli");Mj={baseLogs:()=>OXA(D71.cache,H71(jA().cwd())),errors:()=>OXA(D71.cache,H71(jA().cwd()),"errors"),messages:()=>OXA(D71.cache,H71(jA().cwd()),"messages"),mcpLogs:(A)=>OXA(D71.cache,H71(jA().cwd()),`mcp-logs-${eu(A)}`)}});import{existsSync as fV5}from"fs";import{dirname as ou2,join as AjA,resolve as tTA}from"path";function ru2(){return AjA(sL(),"managed-settings.json")}function bV5(A,Q){if(typeof A==="object"&&A&&"code"in A&&A.code==="ENOENT")f(`Broken symlink or missing file encountered for settings.json at path: ${Q}`);else s(A instanceof Error?A:Error(String(A)))}function qJ0(A){let Q=jA();if(!Q.existsSync(A))return{settings:null,errors:[]};try{let{resolvedPath:B}=gI(Q,A),G=wE(B);if(G.trim()==="")return{settings:{},errors:[]};let Z=h8(G,!1),Y=Jb.safeParse(Z);if(!Y.success)return{settings:null,errors:V00(Y.error,A)};return{settings:Y.data,errors:[]}}catch(B){return bV5(B,A),{settings:null,errors:[]}}}function E71(A){switch(A){case"userSettings":return tTA(mQ());case"policySettings":case"projectSettings":case"localSettings":return tTA(pQ());case"flagSettings":{let Q=NPA();return Q?ou2(tTA(Q)):tTA(pQ())}}}function qF(A){switch(A){case"userSettings":return AjA(E71(A),"settings.json");case"projectSettings":case"localSettings":return AjA(E71(A),iTA(A));case"policySettings":return ru2();case"flagSettings":return NPA()}}function iTA(A){switch(A){case"projectSettings":return AjA(".claude","settings.json");case"localSettings":return AjA(".claude","settings.local.json")}}function uB(A){if(A==="policySettings"){let G=zA0();if(G&&Object.keys(G).length>0)return G}let Q=qF(A);if(!Q)return null;let{settings:B}=qJ0(Q);return B}function nx2(){let A=zA0();if(A&&Object.keys(A).length>0)return"remote";let Q=ru2(),{settings:B}=qJ0(Q);if(B&&Object.keys(B).length>0)return"local";return null}function E2(A,Q){if(A==="policySettings"||A==="flagSettings")return{error:null};let B=qF(A);if(!B)return{error:null};try{let G=ou2(B);if(!jA().existsSync(G))jA().mkdirSync(G);let Z=uB(A);if(!Z&&jA().existsSync(B)){let J=wE(B),I=h8(J);if(I===null)return{error:Error(`Invalid JSON syntax in settings file at ${B}`)};if(I&&typeof I==="object")Z=I,f(`Using raw settings from ${B} due to validation failure`)}let Y=gPA(Z||{},Q,(J,I,X,W)=>{if(I===void 0&&W&&typeof X==="string"){delete W[X];return}if(Array.isArray(I))return I;return});if(NF.markInternalWrite(A),rL(B,JSON.stringify(Y,null,2)+`
bundles/ClaudeAgentSDKCode/cli.js:4400:`)}function ma1(A){let{content:Q}=_S0.readFile(A);return Q}function KM(A,Q,B={encoding:"utf-8"}){let G=jA(),Z=A;if(G.existsSync(A))try{let J=G.readlinkSync(A);Z=W71(J)?J:dg2(rY0(A),J),f(`Writing through symlink: ${A} -> ${Z}`)}catch(J){Z=A}let Y=`${Z}.tmp.${process.pid}.${Date.now()}`;try{f(`Writing to temp file: ${Y}`);let J,I=G.existsSync(Z);if(I)J=G.statSync(Z).mode,f(`Preserving file permissions: ${J.toString(8)}`);else if(B.mode!==void 0)J=B.mode,f(`Setting permissions for new file: ${J.toString(8)}`);let X={encoding:B.encoding,flush:!0};if(!I&&B.mode!==void 0)X.mode=B.mode;if(G.writeFileSync(Y,Q,X),f(`Temp file written successfully, size: ${Q.length} bytes`),I&&J!==void 0)VK5(Y,J),f("Applied original permissions to temp file");f(`Renaming ${Y} to ${Z}`),G.renameSync(Y,Z),f(`File ${Z} written atomically`)}catch(J){f(`Failed to write file atomically: ${J}`),r(J),s("tengu_atomic_write_error",{});try{if(G.existsSync(Y))f(`Cleaning up temp file: ${Y}`),G.unlinkSync(Y)}catch(I){f(`Failed to clean up temp file: ${I}`)}f(`Falling back to non-atomic write for ${Z}`);try{let I={encoding:B.encoding,flush:!0};if(!G.existsSync(Z)&&B.mode!==void 0)I.mode=B.mode;G.writeFileSync(Z,Q,I),f(`File ${Z} written successfully with non-atomic fallback`)}catch(I){throw f(`Non-atomic write also failed: ${I}`),I}}}function X71(A){return Lc(A)}function QI(A){let Q=A/1024;if(Q<1)return`${A} bytes`;if(Q<1024)return`${Q.toFixed(1).replace(/\.0$/,"")}KB`;let B=Q/1024;if(B<1024)return`${B.toFixed(1).replace(/\.0$/,"")}MB`;return`${(B/1024).toFixed(1).replace(/\.0$/,"")}GB`}function VJA(A){let Q=oY0(A);if(!Q)return"unknown";return cg2.getLanguage(Q.slice(1))?.name??"unknown"}function g81(A){let Q=jA();try{if(!Q.existsSync(A))Q.mkdirSync(A);return!0}catch(B){return r(B instanceof Error?B:Error(String(B))),!1}}function SoA(A,Q=KwA){try{return jA().statSync(A).size<=Q}catch{return!1}}var cg2,KwA=262144,hOB,I71,hj;var N9=q(()=>{g1();Q0();NZ();_0();wV0();ij();pB();p2();YQ();TS0();mY();Z8();ZY();cg2=o(lI1(),1);hOB=Z0(async()=>{let A=v9();setTimeout(()=>{A.abort()},1000);let Q=await NL0(s1(),A.signal,15),B=0;for(let G of Q)if(RAA(G)==="CRLF")B++;return B>3?"CRLF":"LF"});I71=eG1("claude-cli");hj={baseLogs:()=>RXA(I71.cache,X71(jA().cwd())),errors:()=>RXA(I71.cache,X71(jA().cwd()),"errors"),messages:()=>RXA(I71.cache,X71(jA().cwd()),"messages"),mcpLogs:(A)=>RXA(I71.cache,X71(jA().cwd()),`mcp-logs-${Lc(A)}`)}});import{existsSync as FK5}from"fs";import{dirname as lg2,join as YjA,resolve as GjA}from"path";function ig2(){return YjA(VM(),"managed-settings.json")}function CK5(A,Q){if(typeof A==="object"&&A&&"code"in A&&A.code==="ENOENT")f(`Broken symlink or missing file encountered for settings.json at path: ${Q}`);else r(A instanceof Error?A:Error(String(A)))}function tY0(A){let Q=jA();if(!Q.existsSync(A))return{settings:null,errors:[]};try{let{resolvedPath:B}=yI(Q,A),G=_E(B);if(G.trim()==="")return{settings:{},errors:[]};let Z=d8(G,!1),Y=Pb.safeParse(Z);if(!Y.success)return{settings:null,errors:c10(Y.error,A)};return{settings:Y.data,errors:[]}}catch(B){return CK5(B,A),{settings:null,errors:[]}}}function J71(A){switch(A){case"userSettings":return GjA(uQ());case"policySettings":case"projectSettings":case"localSettings":return GjA(cQ());case"flagSettings":{let Q=MPA();return Q?lg2(GjA(Q)):GjA(cQ())}}}function xF(A){switch(A){case"userSettings":return YjA(J71(A),"settings.json");case"projectSettings":case"localSettings":return YjA(J71(A),sTA(A));case"policySettings":return ig2();case"flagSettings":return MPA()}}function sTA(A){switch(A){case"projectSettings":return YjA(".claude","settings.json");case"localSettings":return YjA(".claude","settings.local.json")}}function uB(A){if(A==="policySettings"){let G=ee1();if(G&&Object.keys(G).length>0)return G}let Q=xF(A);if(!Q)return null;let{settings:B}=tY0(Q);return B}function rS2(){let A=ee1();if(A&&Object.keys(A).length>0)return"remote";let Q=ig2(),{settings:B}=tY0(Q);if(B&&Object.keys(B).length>0)return"local";return null}function X2(A,Q){if(A==="policySettings"||A==="flagSettings")return{error:null};let B=xF(A);if(!B)return{error:null};try{let G=lg2(B);if(!jA().existsSync(G))jA().mkdirSync(G);let Z=uB(A);if(!Z&&jA().existsSync(B)){let J=_E(B),I=d8(J);if(I===null)return{error:Error(`Invalid JSON syntax in settings file at ${B}`)};if(I&&typeof I==="object")Z=I,f(`Using raw settings from ${B} due to validation failure`)}let Y=dPA(Z||{},Q,(J,I,X,W)=>{if(I===void 0&&W&&typeof X==="string"){delete W[X];return}if(Array.isArray(I))return I;return});if(SF.markInternalWrite(A),KM(B,JSON.stringify(Y,null,2)+`[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '4370,4445p' bundles/ClaudeCodeCode/cli.js"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 30ms:[0m
[2mClaude configuration file not found at: ${A}
A backup file exists at: ${Z}
You can manually restore it by running: cp "${Z}" "${A}"

`);return Sv(Q)}try{let Z=G.readFileSync(A,{encoding:"utf-8"});try{let Y=JSON.parse(C9A(Z));return{...Sv(Q),...Y}}catch(Y){let J=Y instanceof Error?Y.message:String(Y);throw new Qz(J,A,Q)}}catch(Z){if(Z instanceof Qz&&B)throw Z;if(Z instanceof Qz){f(`Config file corrupted, resetting to defaults: ${Z.message}`,{level:"error"}),s(Z),process.stdout.write(`
Claude configuration file at ${A} is corrupted: ${Z.message}
`);let Y=`${A}.corrupted.${Date.now()}`;try{G.copyFileSync(A,Y),f(`Corrupted config backed up to: ${Y}`,{level:"error"})}catch{}let J=`${A}.backup`;if(process.stdout.write(`
Claude configuration file at ${A} is corrupted
The corrupted file has been backed up to: ${Y}
`),G.existsSync(J))process.stdout.write(`A backup file exists at: ${J}
You can manually restore it by running: cp "${J}" "${A}"

`);else process.stdout.write(`
`)}return Sv(Q)}}function l7(){let A=EJ0(),Q=Mn(OD(),mw);if(!Q.projects)return rTA;let B=Q.projects[A]??rTA;if(typeof B.allowedTools==="string")B.allowedTools=h8(B.allowedTools)??[];return B}function nG(A){let Q=EJ0();try{xu2(OD(),mw,(B)=>{let G=B.projects?.[Q]??rTA,Z=A(G);if(Z===G)return B;return{...B,projects:{...B.projects,[Q]:Z}}})}catch(B){f(`Failed to save config with lock: ${B}`,{level:"error"});let G=Mn(OD(),mw),Z=G.projects?.[Q]??rTA,Y=A(Z);if(Y===Z)return;Su2(OD(),{...G,projects:{...G.projects,[Q]:Y}},mw)}}function Gy(){return YXA()!==null}function YXA(){if(hOA())return"development build";if(z0(process.env.DISABLE_AUTOUPDATER))return"DISABLE_AUTOUPDATER set";if(process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC)return"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC set";let A=d1();if(A.autoUpdates===!1&&(A.installMethod!=="native"||A.autoUpdatesProtectedForNative!==!0))return"config";return null}function yuA(){if(z0(process.env.DISABLE_COST_WARNINGS))return!1;if(RB())return!1;let Q=Wd(),B=w$()!==null;if(!Q.hasToken&&!B)return!1;let G=d1(),Z=G.oauthAccount?.organizationRole,Y=G.oauthAccount?.workspaceRole;if(!Z||!Y)return!1;return["admin","billing"].includes(Z)||["workspace_admin","workspace_billing"].includes(Y)}function RU2(){if(!RB())return!1;let A=d6();if(A==="max"||A==="pro")return!0;let B=d1().oauthAccount?.organizationRole;return!!B&&["admin","billing","owner","primary_owner"].includes(B)}function J50(){if(!x5("tengu_c4w_usage_limit_notifications_enabled"))return!1;if(d6()==="team")return b7("tengu_teams_usage_limit_notifications","enabled",!1);return!0}function kk(){let A=d1();if(A.userID)return A.userID;let Q=ZV5(32).toString("hex");return i0((B)=>({...B,userID:Q})),Q}function Y50(){let A=d1();if(A.anonymousId)return A.anonymousId;let Q=`claudecode.v1.${YV5()}`;return i0((B)=>({...B,anonymousId:Q})),Q}function Zu2(){if(!d1().firstStartTime){let Q=new Date().toISOString();i0((B)=>({...B,firstStartTime:B.firstStartTime??Q}))}}function NAA(A){let Q=pQ();if(A==="ExperimentalUltraClaudeMd")return NAA("User");switch(A){case"User":return JQA(mQ(),"CLAUDE.md");case"Local":return JQA(Q,"CLAUDE.local.md");case"Project":return JQA(Q,"CLAUDE.md");case"Managed":return JQA(sL(),"CLAUDE.md");case"ExperimentalUltraClaudeMd":return JQA(mQ(),"ULTRACLAUDE.md")}}function Qo1(){return JQA(sL(),".claude","rules")}function Bo1(){return JQA(mQ(),"rules")}var Pu2,rTA,mw,t7Y,e7Y,Dg,VJ0=!1,EJ0;var xQ=L(()=>{zyA();o2();$8();rQ();pB();uI();OZ();eZ();g0();XQ();M9();F2();Y0();h1();jB();zT();J4();Pu2=o(Gm(),1),rTA={allowedTools:[],mcpContextUris:[],mcpServers:{},enabledMcpjsonServers:[],disabledMcpjsonServers:[],hasTrustDialogAccepted:!1,projectOnboardingSeenCount:0,hasClaudeMdExternalIncludesApproved:!1,hasClaudeMdExternalIncludesWarningShown:!1},mw={numStartups:0,installMethod:void 0,autoUpdates:void 0,theme:"dark",preferredNotifChannel:"auto",verbose:!1,editorMode:"normal",autoCompactEnabled:!0,hasSeenTasksHint:!1,hasSeenStashHint:!1,queuedCommandUpHintCount:0,diffTool:"auto",customApiKeyResponses:{approved:[],rejected:[]},env:{},tipsHistory:{},memoryUsageCount:0,promptQueueUseCount:0,todoFeatureEnabled:!0,showExpandedTodos:!1,messageIdleNotifThresholdMs:60000,autoConnectIde:!1,autoInstallIdeExtension:!0,checkpointingShadowRepos:[],fileCheckpointingEnabled:!0,terminalProgressBarEnabled:!0,cachedStatsigGates:{},cachedDynamicConfigs:{},cachedGrowthBookFeatures:{},respectGitignore:!0};t7Y={...mw,autoUpdates:!1},e7Y={...rTA};Dg={config:null,mtime:0};EJ0=Z0(()=>{let A=pQ();try{let Q=JV5("git rev-parse --show-toplevel",{cwd:A,encoding:"utf8",stdio:["pipe","pipe","ignore"]}).trim();return SKA(Q)}catch{return SKA(Tu2(A))}})});async function yu2(){if(W71===null&&!X71)X71=XV5(),W71=await X71,X71=null,As.cache.clear?.()}function si(A){let Q=As(A);return{customIDs:{sessionId:Q.sessionId,organizationUUID:Q.organizationUuid,accountUUID:Q.accountUuid},userID:Q.deviceId,appVersion:Q.appVersion,email:Q.email,custom:{userType:Q.userType,organizationUuid:Q.organizationUuid,accountUuid:Q.accountUuid,subscriptionType:Q.subscriptionType??"",firstTokenTime:Q.firstTokenTime??0,...Q.githubActionsMetadata&&{githubActor:Q.githubActionsMetadata.actor,githubActorId:Q.githubActionsMetadata.actorId,githubRepository:Q.githubActionsMetadata.repository,githubRepositoryId:Q.githubActionsMetadata.repositoryId,githubRepositoryOwner:Q.githubActionsMetadata.repositoryOwner,githubRepositoryOwnerId:Q.githubActionsMetadata.repositoryOwnerId}}}}function IbQ(){return As(!0)}function IV5(){if(W71!==null)return W71;return}async function XV5(){return}var W71=null,X71=null,As;var Sk=L(()=>{xQ();o2();g0();F2();I6();As=Z0((A)=>{let Q=kk(),B=d1(),G,Z;if(A){if(G=d6()??void 0,G&&B.claudeCodeFirstTokenDate){let X=new Date(B.claudeCodeFirstTokenDate).getTime();if(!isNaN(X))Z=X}}let Y=q8(),J=Y?.organizationUuid,I=Y?.accountUuid;return{deviceId:Q,sessionId:W0(),email:IV5(),appVersion:{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.69",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2025-12-13T00:32:01Z"}.VERSION,organizationUuid:J,accountUuid:I,userType:"external",subscriptionType:G,firstTokenTime:Z,...process.env.GITHUB_ACTIONS==="true"&&{githubActionsMetadata:{actor:process.env.GITHUB_ACTOR,actorId:process.env.GITHUB_ACTOR_ID,repository:process.env.GITHUB_REPOSITORY,repositoryId:process.env.GITHUB_REPOSITORY_ID,repositoryOwner:process.env.GITHUB_REPOSITORY_OWNER,repositoryOwnerId:process.env.GITHUB_REPOSITORY_OWNER_ID}}}})});import{createHash as WV5}from"crypto";function ku2(A){let Q=si(!0),B={networkConfig:{api:"https://statsig.anthropic.com/v1/"},environment:{tier:["test","dev"].includes("production")?"development":"production"},includeCurrentPageUrlWithEvents:!1,logLevel:K71.LogLevel.None,storageProvider:new IK1,customUserCacheKeyFunc:(Y,J)=>{return WV5("sha1").update(Y).update(J.userID||"").digest("hex").slice(0,10)}},G=new K71.StatsigClient(A,Q,B);G.on("error",()=>{wQ.head("https://api.anthropic.com/api/hello").catch(()=>{})});let Z=G.initializeAsync();return process.on("beforeExit",async()=>{await G.flush()}),process.on("exit",()=>{G.flush()}),{client:G,initialized:Z}}function sTA(A){return FJ0()}function XnB(){HJ0=!1,FJ0.cache?.clear?.(),fu2.cache?.clear?.(),Hg.cache?.clear?.(),VV5.cache?.clear?.(),JZ.cache?.clear?.()}function N02(){return aX()}async function u1A(){if(aX())return;try{let A=si(!0),Q=await Hg(),B=fu2(),G=[];if(Q)G.push(Q.updateUserAsync(A));if(B)G.push(B.initialized.then(()=>B.client.updateUserAsync(A)));await Promise.all(G)}catch(A){s(A instanceof Error?A:Error(`Statsig: Force refresh failed: ${A}`))}}function bu2(){if(aX())return;let A=setInterval(()=>{u1A()},KV5);process.on("beforeExit",()=>{clearInterval(A)})}async function CJ0(A,Q){if(aX())return;try{let[B,G]=await Promise.all([Hg(),Ld({model:Q.model})]);if(!B)return;let Z=UbQ(G,Q),Y={eventName:A,metadata:Z};B.logEvent(Y),await B.flush()}catch(B){}}function hu2(A,Q){CJ0(A,Q)}function gu2(){return{...vu2}}async function cx(A,Q){if(aX())return Q;let B=sTA(A);if(!B)return Q;await B.initialized;let G=B.client.getDynamicConfig(A);if(Object.keys(G.value).length===0)return Q;return G.value}function b7(A,Q,B){let G=sTA(A);if(!G)return B;let Z=G.client.getExperiment(A);if(!Z)return B;return Z.get(Q,B)}function ybQ(A,Q){let B=sTA(A);if(!B)return Q;let G=B.client.getDynamicConfig(A);if(!G||Object.keys(G.value).length===0)return Q;return G.value}function x5(A){return DV5(A),d1().cachedStatsigGates[A]??!1}async function PS2(A){if(HJ0)return x5(A);return JZ(A)}function q3A(A,Q){let G=d1().cachedDynamicConfigs?.[A];return EV5(A,Q).then((Z)=>{i0((Y)=>{if(Z===Y.cachedDynamicConfigs?.[A])return Y;return{...Y,cachedDynamicConfigs:{...Y.cachedDynamicConfigs,[A]:Z}}})}),G??Q}function Ow2(A){i0((Q)=>{if(Q.cachedDynamicConfigs?.[A]===void 0)return Q;return{...Q,cachedDynamicConfigs:{...Q.cachedDynamicConfigs,[A]:void 0}}})}var DJ0,K71,KV5=21600000,vu2,HJ0=!1,FJ0,fu2,Hg,JZ,y01=(A,Q)=>{let[B,G]=DJ0.default.useState(Q);return DJ0.default.useEffect(()=>{cx(A,Q).then(G)},[A,Q]),B},VV5,EV5,DV5;var J4=L(()=>{o2();b8();Sh0();yh0();Sk();Y0();h1();xQ();$3A();Mr();DJ0=o(WA(),1),K71=o(Ph0(),1),vu2={};FJ0=Z0(()=>{if(aX())return null;let A=ku2(kh0);return A.initialized.then(()=>{HJ0=!0}),A}),fu2=Z0(()=>{if(aX()||!XK1)return null;return ku2(XK1)});Hg=Z0(async()=>{let A=FJ0();if(!A)return null;return await A.initialized,A.client});JZ=Z0(async(A)=>{if(aX())return!1;let Q=sTA(A);if(!Q)return!1;await Q.initialized;let B=Q.client.checkGate(A);return vu2[A]=B,B});VV5=Z0(async(A,Q)=>{if(aX())return Q;let B=sTA(A);if(!B)return Q;await B.initialized;let G=B.client.getExperiment(A);if(Object.keys(G.value).length===0)return Q;return G.value});EV5=Z0(cx);DV5=Z0(async(A)=>{let Q=await JZ(A);i0((B)=>{if(B.cachedStatsigGates[A]===Q)return B;return{...B,cachedStatsigGates:{...B.cachedStatsigGates,[A]:Q}}})})});import{join as Fg,posix as Rn,sep as IQA}from"path";import{homedir as HV5,tmpdir as FV5}from"os";function On(A){return A.toLowerCase()}function mu2(A,Q){if(dQ()==="windows"){let B=hj(A),G=hj(Q);return Rn.relative(B,G)}return Rn.relative(A,Q)}function rcA(A){if(dQ()==="windows")return hj(A);return A}function UV5(){return JL.map((A)=>qF(A)).filter((A)=>A!==void 0)}function H00(A){let Q=t9(A),B=On(Q);if(B.endsWith("/.claude/settings.json")||B.endsWith("/.claude/settings.local.json"))return!0;return UV5().some((G)=>On(G)===B)}function $V5(A){if(H00(A))return!0;let Q=Fg(pQ(),".claude","commands"),B=Fg(pQ(),".claude","agents"),G=Fg(pQ(),".claude","skills");return Sb(A,Q)||Sb(A,B)||Sb(A,G)}function wV5(A){if(!Eg())return!1;let Q=t9(A);return Sb(Q,Eg())}function du2(A){let Q=mF();return A===Q}function V71(){return Fg(KH(r1()),W0(),"session-memory")+IQA}function $Q1(){return Fg(V71(),"summary.md")}function NV5(A){return A.startsWith(V71())}function $XA(){return!1}function qV5(){return dQ()==="windows"?Fg(FV5(),"claude")+IQA:"/tmp/claude/"}function cu2(){return Fg(qV5(),eu(pQ()))+IQA}function n51(){return Fg(cu2(),W0(),"scratchpad")}function Yu2(){if(!$XA())throw Error("Scratchpad directory feature is not enabled");let A=jA(),Q=n51();if(!A.existsSync(Q))A.mkdirSync(Q);return Q}function LV5(A){if(!$XA())return!1;let Q=n51();return A===Q||A.startsWith(Q+IQA)}function MV5(A){let B=t9(A).split(IQA),G=B[B.length-1];if(A.startsWith("\\\\")||A.startsWith("//"))return!0;for(let Z of zV5){let Y=On(Z);if(B.some((J)=>On(J)===Y))return!0}if(G){let Z=On(G);if(CV5.some((Y)=>On(Y)===Z))return!0}return!1}function pu2(A){if(A.indexOf(":",2)!==-1)return!0;if(/~\d/.test(A))return!0;if(A.startsWith("\\\\?\\")||A.startsWith("\\\\.\\")||A.startsWith("//?/")||A.startsWith("//./"))return!0;if(/[.\s]+$/.test(A))return!0;if(/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(A))return!0;if(/(^|\/|\\)\.{3,}(\/|\\|$)/.test(A))return!0;if(n81(A))return!0;return!1}function PB0(A){let Q=wa(A);for(let B of Q)if(pu2(B))return{safe:!1,message:`Claude requested permissions to write to ${A}, which contains a suspicious Windows path pattern that requires manual approval.`};for(let B of Q)if($V5(B))return{safe:!1,message:`Claude requested permissions to write to ${A}, but you haven't granted it yet.`};for(let B of Q)if(wV5(B));for(let B of Q)if(MV5(B))return{safe:!1,message:`Claude requested permissions to edit ${A} which is a sensitive file.`};return{safe:!0}}function DJA(A){return new Set([pQ(),...A.additionalWorkingDirectories.keys()])}function JT(A,Q){return wa(A).every((G)=>Array.from(DJA(Q)).some((Z)=>Sb(G,Z)))}function Sb(A,Q){let B=t9(A),G=t9(Q),Z=B.replace(/^\/private\/var\//,"/var/").replace(/^\/private\/tmp(\/|$)/,"/tmp$1"),Y=G.replace(/^\/private\/var\//,"/var/").replace(/^\/private\/tmp(\/|$)/,"/tmp$1"),J=On(Z),I=On(Y),X=mu2(I,J);if(X==="")return!0;if(w9A(X))return!1;return!Rn.isAbsolute(X)}function OV5(A){switch(A){case"cliArg":case"command":case"session":return t9(pQ());case"userSettings":case"policySettings":case"projectSettings":case"localSettings":case"flagSettings":return E71(A)}}function zJ0(A){return Rn.join(bC,A)}function RV5({patternRoot:A,pattern:Q,rootPath:B}){let G=Rn.join(A,Q);if(A===B)return zJ0(Q);else if(G.startsWith(`${B}${bC}`)){let Z=G.slice(B.length);return zJ0(Z)}else{let Z=Rn.relative(B,A);if(!Z||Z.startsWith(`..${bC}`)||Z==="..")return null;else{let Y=Rn.join(Z,Q);return zJ0(Y)}}}function eGA(A,Q){let B=new Set(A.get(null)??[]);for(let[G,Z]of A.entries()){if(G===null)continue;for(let Y of Z){let J=RV5({patternRoot:G,pattern:Y,rootPath:Q});if(J)B.add(J)}}return Array.from(B)}function AZA(A){let Q=lu2(A,"read","deny"),B=new Map;for(let[G,Z]of Q.entries())B.set(G,Array.from(Z.keys()));return B}function _V5(A,Q){if(A.startsWith(`${bC}${bC}`)){let G=A.slice(1);if(dQ()==="windows"&&G.match(/^\/[a-z]\//i)){let Z=G[1]?.toUpperCase()??"C",Y=G.slice(2),J=`${Z}:\\`;return{relativePattern:Y.startsWith("/")?Y.slice(1):Y,root:J}}return{relativePattern:G,root:bC}}else if(A.startsWith(`~${bC}`))return{relativePattern:A.slice(1),root:HV5()};else if(A.startsWith(bC))return{relativePattern:A,root:OV5(Q)};let B=A;if(A.startsWith(`.${bC}`))B=A.slice(2);return{relativePattern:B,root:null}}function lu2(A,Q,B){let G=(()=>{switch(Q){case"edit":return m3;case"read":return L8}})(),Z=sY0(A,G,B),Y=new Map;for(let[J,I]of Z.entries()){let{relativePattern:X,root:W}=_V5(J,I.source),K=Y.get(W);if(K===void 0)K=new Map,Y.set(W,K);K.set(X,I)}return Y}function SE(A,Q,B,G){let Z=t9(A);if(dQ()==="windows"&&Z.includes("\\"))Z=hj(Z);let Y=lu2(Q,B,G);for(let[J,I]of Y.entries()){let X=Array.from(I.keys()).map((E)=>{let D=E;if(J===bC&&E.startsWith(bC))D=E.slice(1);if(D.endsWith("/**"))D=D.slice(0,-3);return D}),W=uu2.default().add(X),K=mu2(J??r1(),Z??r1());if(K.startsWith(`..${bC}`))continue;if(!K)continue;let V=W.test(K);if(V.ignored&&V.rule){let E=V.rule.pattern,D=E+"/**";if(I.has(D))return I.get(D)??null;if(J===bC&&!E.startsWith(bC)){E=bC+E;let H=E+"/**";if(I.has(H))return I.get(H)??null}return I.get(E)??null}}return null}function Vp(A,Q,B){if(typeof A.getPath!=="function")return{behavior:"ask",message:`Claude requested permissions to use ${A.name}, but you haven't granted it yet.`};let G=A.getPath(Q),Z=wa(G);for(let K of Z)if(K.startsWith("\\\\")||K.startsWith("//"))return{behavior:"ask",message:`Claude requested permissions to read from ${G}, which appears to be a UNC path that could access network resources.`,decisionReason:{type:"other",reason:"UNC path detected (defense-in-depth check)"}};for(let K of Z)if(pu2(K))return{behavior:"ask",message:`Claude requested permissions to read from ${G}, which contains a suspicious Windows path pattern that requires manual approval.`,decisionReason:{type:"other",reason:"Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"}};for(let K of Z){let V=SE(K,B,"read","deny");if(V)return{behavior:"deny",message:`Permission to read ${G} has been denied.`,decisionReason:{type:"rule",rule:V}}}for(let K of Z){let V=SE(K,B,"read","ask");if(V)return{behavior:"ask",message:`Claude requested permissions to read from ${G}, but you haven't granted it yet.`,decisionReason:{type:"rule",rule:V}}}let Y=EAA(A,Q,B);if(Y.behavior==="allow")return Y;if(JT(G,B))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"mode",mode:"default"}};let I=t9(G),X=jV5(I,Q);if(X.behavior!=="passthrough")return X;let W=SE(G,B,"read","allow");if(W)return{behavior:"allow",updatedInput:Q,decisionReason:{type:"rule",rule:W}};return{behavior:"ask",message:`Claude requested permissions to read from ${G}, but you haven't granted it yet.`,suggestions:mB1(G,"read",B),decisionReason:{type:"workingDir",reason:"Path is outside allowed working directories"}}}function EAA(A,Q,B){if(typeof A.getPath!=="function")return{behavior:"ask",message:`Claude requested permissions to use ${A.name}, but you haven't granted it yet.`};let G=A.getPath(Q),Z=wa(G);for(let K of Z){let V=SE(K,B,"edit","deny");if(V)return{behavior:"deny",message:`Permission to edit ${G} has been denied.`,decisionReason:{type:"rule",rule:V}}}let Y=t9(G),J=TV5(Y,Q);if(J.behavior!=="passthrough")return J;let I=PB0(G);if(!I.safe)return{behavior:"ask",message:I.message,decisionReason:{type:"other",reason:I.message}};for(let K of Z){let V=SE(K,B,"edit","ask");if(V)return{behavior:"ask",message:`Claude requested permissions to write to ${G}, but you haven't granted it yet.`,decisionReason:{type:"rule",rule:V}}}let X=JT(G,B);if(B.mode==="acceptEdits"&&X)return{behavior:"allow",updatedInput:Q,decisionReason:{type:"mode",mode:B.mode}};let W=SE(G,B,"edit","allow");if(W)return{behavior:"allow",updatedInput:Q,decisionReason:{type:"rule",rule:W}};return{behavior:"ask",message:`Claude requested permissions to write to ${G}, but you haven't granted it yet.`,suggestions:mB1(G,"write",B),decisionReason:!X?{type:"workingDir",reason:"Path is outside allowed working directories"}:void 0}}function mB1(A,Q,B){let G=!JT(A,B);if(Q==="read"&&G){let Z=yv(A);return wa(Z).map((I)=>ocA(I,"session")).filter((I)=>I!==void 0)}if(Q==="write"||Q==="create"){let Z=[{type:"setMode",mode:"acceptEdits",destination:"session"}];if(G){let Y=yv(A),J=wa(Y);Z.push({type:"addDirectories",directories:J,destination:"session"})}return Z}return[{type:"setMode",mode:"acceptEdits",destination:"session"}]}function TV5(A,Q){if(du2(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Plan files for current session are allowed for writing"}};if(LV5(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Scratchpad files for current session are allowed for writing"}};return{behavior:"passthrough",message:""}}function jV5(A,Q){let B=Fg(KH(pQ()),"bash-outputs",W0());if(A.startsWith(B))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Bash output files from current session are allowed for reading"}};if(NV5(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Session memory files are allowed for reading"}};if(du2(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Plan files for current session are allowed for reading"}};let G=MeA(),Z=G.endsWith(IQA)?G:G+IQA;if(A===G||A.startsWith(Z))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Tool result files are allowed for reading"}};let Y=cu2();if(A.startsWith(Y))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Project temp directory files are allowed for reading"}};return{behavior:"passthrough",message:""}}var uu2,CV5,zV5,bC;var cY=L(()=>{g0();J4();pB();OZ();$9A();R8();k3();OZ();tK();oG();AV();jB();tI();XQ();NXA();hG0();cF();HAA();uu2=o(TsA(),1),CV5=[".gitconfig",".gitmodules",".bashrc",".bash_profile",".zshrc",".zprofile",".profile",".ripgreprc",".mcp.json"],zV5=[".git",".vscode",".idea",".claude"];bC=Rn.sep});import{isAbsolute as F71,resolve as iu2,relative as PV5,sep as UJ0,basename as C71,dirname as wJ0,extname as $J0,join as OXA}from"path";import{homedir as SV5}from"os";import{chmodSync as xV5}from"fs";function yV5(A){let Q=/[*?[{]/,B=A.match(Q);if(!B||B.index===void 0){let I=wJ0(A),X=C71(A);return{baseDir:I,relativePattern:X}}let G=A.slice(0,B.index),Z=Math.max(G.lastIndexOf("/"),G.lastIndexOf(UJ0));if(Z===-1)return{baseDir:"",relativePattern:A};let Y=G.slice(0,Z),J=A.slice(Z+1);if(Y===""&&Z===0)Y="/";if(dQ()==="windows"&&/^[A-Za-z]:$/.test(Y))Y=Y+UJ0;return{baseDir:Y,relativePattern:J}}async function yRB(A,Q,{limit:B,offset:G},Z,Y){let J=Q,I=A;if(F71(A)){let{baseDir:H,relativePattern:F}=yV5(A);if(H)J=H,I=F}let X=eGA(AZA(Y),J),W=["--files","--glob",I,"--sort=modified","--no-ignore","--hidden"];for(let H of X)W.push("--glob",`!${H}`);let V=(await Sj(W,J,Z)).map((H)=>F71(H)?H:OXA(J,H)),E=V.length>G+B;return{files:V.slice(G,G+B),truncated:E}}function ZH(A){let Q=jA();return Math.ceil(Q.statSync(A).mtimeMs)}function rWB(A,Q=0,B){let Y=jA().readFileSync(A,{encoding:"utf8"}).split(/\r?\n/),J=B!==void 0&&Y.length-Q>B?Y.slice(Q,Q+B):Y.slice(Q);return{content:J.join(`
`),lineCount:J.length,totalLines:Y.length}}function tGA(A,Q,B,G){let Z=Q;if(G==="CRLF")Z=Q.split(`
`).join(`\r
`);rL(A,Z,{encoding:B})}function LD(A){try{let B=jA(),{resolvedPath:G}=gI(B,A),{buffer:Z,bytesRead:Y}=B.readSync(G,{length:4096});if(Y===0)return"utf8";if(Y>=2){if(Z[0]===255&&Z[1]===254)return"utf16le"}if(Y>=3&&Z[0]===239&&Z[1]===187&&Z[2]===191)return"utf8";return"utf8"}catch(B){return s(B),"utf8"}}function DAA(A,Q="utf8"){try{let B=jA(),{resolvedPath:G}=gI(B,A),{buffer:Z,bytesRead:Y}=B.readSync(G,{length:4096}),J=Z.toString(Q,0,Y);return vV5(J)}catch(B){return s(B),"LF"}}function vV5(A){let Q=0,B=0;for(let G=0;G<A.length;G++)if(A[G]===`
`)if(G>0&&A[G-1]==="\r")Q++;else B++;return Q>B?"CRLF":"LF"}function Kp(A){let Q=F71(A)?A:iu2(r1(),A),B=jA(),G=String.fromCharCode(8239),Z=/^(.+)([ \u202F])(AM|PM)(\.png)$/,Y=C71(Q).match(Z);if(Y){if(B.existsSync(Q))return Q;let J=Y[2],I=J===" "?G:" ",X=Q.replace(`${J}${Y[3]}${Y[4]}`,`${I}${Y[3]}${Y[4]}`);if(B.existsSync(X))return X}return Q}function O7A(A){return A.replace(/^\t+/gm,(Q)=>"  ".repeat(Q.length))}function kV5(A){let Q=A?t9(A):void 0,B=Q?PV5(r1(),Q):void 0;return{absolutePath:Q,relativePath:B}}function J8(A){let{relativePath:Q}=kV5(A);if(Q&&!Q.startsWith(".."))return Q;let B=SV5();if(A.startsWith(B+UJ0))return"~"+A.slice(B.length);return A}function ToA(A){let Q=jA();try{let B=wJ0(A),G=C71(A,$J0(A));if(!Q.existsSync(B))return;let J=Q.readdirSync(B).filter((I)=>C71(I.name,$J0(I.name))===G&&OXA(B,I.name)!==A)[0];if(J)return J.name;return}catch(B){s(B);return}}function Ep({content:A,startLine:Q}){if(!A)return"";return A.split(/\r?\n/).map((G,Z)=>{let Y=Z+Q,J=String(Y);if(J.length>=6)return`${J}→${G}`;return`${J.padStart(6," ")}→${G}`}).join(`
`)}function vlQ(A){let Q=jA();if(!Q.existsSync(A))return!0;return Q.isDirEmptySync(A)}function wE(A){let Q=jA(),{resolvedPath:B,isSymlink:G}=gI(Q,A);if(G)f(`Reading through symlink: ${A} -> ${B}`);let Z=LD(B);return Q.readFileSync(B,{encoding:Z}).replaceAll(`\r
`,`[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '4380,4455p' bundles/ClaudeAgentSDKCode/cli.js"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 27ms:[0m
[2mClaude configuration file not found at: ${A}
A backup file exists at: ${Z}
You can manually restore it by running: cp "${Z}" "${A}"

`);return tv(Q)}try{let Z=G.readFileSync(A,{encoding:"utf-8"});try{let Y=JSON.parse(Z);return{...tv(Q),...Y}}catch(Y){let J=Y instanceof Error?Y.message:String(Y);throw new Ez(J,A,Q)}}catch(Z){if(Z instanceof Ez&&B)throw Z;if(Z instanceof Ez){f(`Config file corrupted, resetting to defaults: ${Z.message}`,{level:"error"}),r(Z),process.stdout.write(`
Claude configuration file at ${A} is corrupted: ${Z.message}
`);let Y=`${A}.corrupted.${Date.now()}`;try{G.copyFileSync(A,Y),f(`Corrupted config backed up to: ${Y}`,{level:"error"})}catch{}let J=`${A}.backup`;if(process.stdout.write(`
Claude configuration file at ${A} is corrupted
The corrupted file has been backed up to: ${Y}
`),G.existsSync(J))process.stdout.write(`A backup file exists at: ${J}
You can manually restore it by running: cp "${J}" "${A}"

`);else process.stdout.write(`
`)}return tv(Q)}}function a7(){let A=dY0(),Q=un(PD(),XN);if(!Q.projects)return QjA;let B=Q.projects[A]??QjA;if(typeof B.allowedTools==="string")B.allowedTools=d8(B.allowedTools)??[];return B}function oG(A){let Q=dY0();try{Tg2(PD(),XN,(B)=>{let G=B.projects?.[Q]??QjA,Z=A(G);if(Z===G)return B;return{...B,projects:{...B.projects,[Q]:Z}}})}catch(B){f(`Failed to save config with lock: ${B}`,{level:"error"});let G=un(PD(),XN),Z=G.projects?.[Q]??QjA,Y=A(Z);if(Y===Z)return;_g2(PD(),{...G,projects:{...G.projects,[Q]:Y}},XN)}}function si(){return YXA()!==null}function YXA(){if(cOA())return"development build";if(C0(process.env.DISABLE_AUTOUPDATER))return"DISABLE_AUTOUPDATER set";if(process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC)return"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC set";let A=c1();if(A.autoUpdates===!1&&(A.installMethod!=="native"||A.autoUpdatesProtectedForNative!==!0))return"config";return null}function yuA(){if(C0(process.env.DISABLE_COST_WARNINGS))return!1;if(LB())return!1;let Q=Od(),B=m$()!==null;if(!Q.hasToken&&!B)return!1;let G=c1(),Z=G.oauthAccount?.organizationRole,Y=G.oauthAccount?.workspaceRole;if(!Z||!Y)return!1;return["admin","billing"].includes(Z)||["workspace_admin","workspace_billing"].includes(Y)}function kz2(){if(!LB())return!1;let A=c3();if(A==="max"||A==="pro")return!0;let B=c1().oauthAccount?.organizationRole;return!!B&&["admin","billing","owner","primary_owner"].includes(B)}function d80(){if(!zG("tengu_c4w_usage_limit_notifications_enabled"))return!1;if(c3()==="team")return u7("tengu_teams_usage_limit_notifications","enabled",!1);return!0}function Bf(){let A=c1();if(A.userID)return A.userID;let Q=bW5(32).toString("hex");return i0((B)=>({...B,userID:Q})),Q}function m80(){let A=c1();if(A.anonymousId)return A.anonymousId;let Q=`claudecode.v1.${hW5()}`;return i0((B)=>({...B,anonymousId:Q})),Q}function Ag2(){if(!c1().firstStartTime){let Q=new Date().toISOString();i0((B)=>({...B,firstStartTime:B.firstStartTime??Q}))}}function yAA(A){let Q=cQ();if(A==="ExperimentalUltraClaudeMd")return yAA("User");switch(A){case"User":return zQA(uQ(),"CLAUDE.md");case"Local":return zQA(Q,"CLAUDE.local.md");case"Project":return zQA(Q,"CLAUDE.md");case"Managed":return zQA(VM(),"CLAUDE.md");case"ExperimentalUltraClaudeMd":return zQA(uQ(),"ULTRACLAUDE.md")}}function ba1(){return zQA(VM(),".claude","rules")}function ha1(){return zQA(uQ(),"rules")}var Rg2,QjA,XN,m8Y,d8Y,gg,mY0=!1,dY0;var vQ=q(()=>{wyA();p2();R8();sQ();pB();vI();rZ();u0();YQ();N9();V2();Q0();g1();gB();MT();w4();Rg2=o($m(),1),QjA={allowedTools:[],mcpContextUris:[],mcpServers:{},enabledMcpjsonServers:[],disabledMcpjsonServers:[],hasTrustDialogAccepted:!1,projectOnboardingSeenCount:0,hasClaudeMdExternalIncludesApproved:!1,hasClaudeMdExternalIncludesWarningShown:!1},XN={numStartups:0,installMethod:void 0,autoUpdates:void 0,theme:"dark",preferredNotifChannel:"auto",verbose:!1,editorMode:"normal",autoCompactEnabled:!0,hasSeenTasksHint:!1,hasSeenStashHint:!1,queuedCommandUpHintCount:0,diffTool:"auto",customApiKeyResponses:{approved:[],rejected:[]},env:{},tipsHistory:{},memoryUsageCount:0,promptQueueUseCount:0,todoFeatureEnabled:!0,showExpandedTodos:!1,messageIdleNotifThresholdMs:60000,autoConnectIde:!1,autoInstallIdeExtension:!0,checkpointingShadowRepos:[],fileCheckpointingEnabled:!0,terminalProgressBarEnabled:!0,cachedStatsigGates:{},cachedDynamicConfigs:{},cachedGrowthBookFeatures:{},respectGitignore:!0};m8Y={...XN,autoUpdates:!1},d8Y={...QjA};gg={config:null,mtime:0};dY0=Z0(()=>{let A=cQ();try{return fW5(gW5("git rev-parse --show-toplevel",{cwd:A,encoding:"utf8",stdio:["pipe","pipe","ignore"]}).trim())}catch{return Mg2(A)}})});async function jg2(){if(G71===null&&!B71)B71=mW5(),G71=await B71,B71=null,Ds.cache.clear?.()}function Fn(A){let Q=Ds(A);return{customIDs:{sessionId:Q.sessionId,organizationUUID:Q.organizationUuid,accountUUID:Q.accountUuid},userID:Q.deviceId,appVersion:Q.appVersion,email:Q.email,custom:{userType:Q.userType,organizationUuid:Q.organizationUuid,accountUuid:Q.accountUuid,subscriptionType:Q.subscriptionType??"",firstTokenTime:Q.firstTokenTime??0,...Q.githubActionsMetadata&&{githubActor:Q.githubActionsMetadata.actor,githubActorId:Q.githubActionsMetadata.actorId,githubRepository:Q.githubActionsMetadata.repository,githubRepositoryId:Q.githubActionsMetadata.repositoryId,githubRepositoryOwner:Q.githubActionsMetadata.repositoryOwner,githubRepositoryOwnerId:Q.githubActionsMetadata.repositoryOwnerId}}}}function MfQ(){return Ds(!0)}function uW5(){if(G71!==null)return G71;return}async function mW5(){return}var G71=null,B71=null,Ds;var tk=q(()=>{vQ();p2();u0();V2();Q3();Ds=Z0((A)=>{let Q=Bf(),B=c1(),G,Z;if(A){if(G=c3()??void 0,G&&B.claudeCodeFirstTokenDate){let X=new Date(B.claudeCodeFirstTokenDate).getTime();if(!isNaN(X))Z=X}}let Y=j8(),J=Y?.organizationUuid,I=Y?.accountUuid;return{deviceId:Q,sessionId:W0(),email:uW5(),appVersion:{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.67",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2025-12-11T23:56:11Z"}.VERSION,organizationUuid:J,accountUuid:I,userType:"external",subscriptionType:G,firstTokenTime:Z,...process.env.GITHUB_ACTIONS==="true"&&{githubActionsMetadata:{actor:process.env.GITHUB_ACTOR,actorId:process.env.GITHUB_ACTOR_ID,repository:process.env.GITHUB_REPOSITORY,repositoryId:process.env.GITHUB_REPOSITORY_ID,repositoryOwner:process.env.GITHUB_REPOSITORY_OWNER,repositoryOwnerId:process.env.GITHUB_REPOSITORY_OWNER_ID}}}})});import{createHash as dW5}from"crypto";function Sg2(A){let Q=Fn(!0),B={networkConfig:{api:"https://statsig.anthropic.com/v1/"},environment:{tier:["test","dev"].includes("production")?"development":"production"},includeCurrentPageUrlWithEvents:!1,logLevel:Z71.LogLevel.None,storageProvider:new iW1,customUserCacheKeyFunc:(Y,J)=>{return dW5("sha1").update(Y).update(J.userID||"").digest("hex").slice(0,10)}},G=new Z71.StatsigClient(A,Q,B);G.on("error",()=>{FQ.head("https://api.anthropic.com/api/hello").catch(()=>{})});let Z=G.initializeAsync();return process.on("beforeExit",async()=>{await G.flush()}),process.on("exit",()=>{G.flush()}),{client:G,initialized:Z}}function BjA(A){return lY0()}function PiB(){pY0=!1,lY0.cache?.clear?.(),xg2.cache?.clear?.(),ug.cache?.clear?.(),pW5.cache?.clear?.(),JZ.cache?.clear?.()}function y12(){return iX()}async function t1A(){if(iX())return;try{let A=Fn(!0),Q=await ug(),B=xg2(),G=[];if(Q)G.push(Q.updateUserAsync(A));if(B)G.push(B.initialized.then(()=>B.client.updateUserAsync(A)));await Promise.all(G)}catch(A){r(A instanceof Error?A:Error(`Statsig: Force refresh failed: ${A}`))}}function yg2(){if(iX())return;let A=setInterval(()=>{t1A()},cW5);process.on("beforeExit",()=>{clearInterval(A)})}async function iY0(A,Q){if(iX())return;try{let[B,G]=await Promise.all([ug(),hd({model:Q.model})]);if(!B)return;let Z=kfQ(G,Q),Y={eventName:A,metadata:Z};B.logEvent(Y),await B.flush()}catch(B){}}function vg2(A,Q){iY0(A,Q)}function kg2(){return{...Pg2}}async function Oi(A,Q){if(iX())return Q;let B=BjA(A);if(!B)return Q;await B.initialized;let G=B.client.getDynamicConfig(A);if(Object.keys(G.value).length===0)return Q;return G.value}function u7(A,Q,B){let G=BjA(A);if(!G)return B;let Z=G.client.getExperiment(A);if(!Z)return B;return Z.get(Q,B)}function rfQ(A,Q){let B=BjA(A);if(!B)return Q;let G=B.client.getDynamicConfig(A);if(!G||Object.keys(G.value).length===0)return Q;return G.value}function zG(A){return iW5(A),c1().cachedStatsigGates[A]??!1}async function yP2(A){if(pY0)return zG(A);return JZ(A)}function C6A(A,Q){let G=c1().cachedDynamicConfigs?.[A];return lW5(A,Q).then((Z)=>{i0((Y)=>{if(Z===Y.cachedDynamicConfigs?.[A])return Y;return{...Y,cachedDynamicConfigs:{...Y.cachedDynamicConfigs,[A]:Z}}})}),G??Q}function VN2(A){i0((Q)=>{if(Q.cachedDynamicConfigs?.[A]===void 0)return Q;return{...Q,cachedDynamicConfigs:{...Q.cachedDynamicConfigs,[A]:void 0}}})}var cY0,Z71,cW5=21600000,Pg2,pY0=!1,lY0,xg2,ug,JZ,k01=(A,Q)=>{let[B,G]=cY0.default.useState(Q);return cY0.default.useEffect(()=>{Oi(A,Q).then(G)},[A,Q]),B},pW5,lW5,iW5;var w4=q(()=>{p2();m8();Wh0();Vh0();tk();Q0();g1();vQ();D6A();br();cY0=o(KA(),1),Z71=o(Xh0(),1),Pg2={};lY0=Z0(()=>{if(iX())return null;let A=Sg2(Dh0);return A.initialized.then(()=>{pY0=!0}),A}),xg2=Z0(()=>{if(iX()||!nW1)return null;return Sg2(nW1)});ug=Z0(async()=>{let A=lY0();if(!A)return null;return await A.initialized,A.client});JZ=Z0(async(A)=>{if(iX())return!1;let Q=BjA(A);if(!Q)return!1;await Q.initialized;let B=Q.client.checkGate(A);return Pg2[A]=B,B});pW5=Z0(async(A,Q)=>{if(iX())return Q;let B=BjA(A);if(!B)return Q;await B.initialized;let G=B.client.getExperiment(A);if(Object.keys(G.value).length===0)return Q;return G.value});lW5=Z0(Oi);iW5=Z0(async(A)=>{let Q=await JZ(A);i0((B)=>{if(B.cachedStatsigGates[A]===Q)return B;return{...B,cachedStatsigGates:{...B.cachedStatsigGates,[A]:Q}}})})});import{join as mg,posix as dn,sep as UQA}from"path";import{homedir as nW5,tmpdir as aW5}from"os";function mn(A){return A.toLowerCase()}function bg2(A,Q){if(pQ()==="windows"){let B=LS(A),G=LS(Q);return dn.relative(B,G)}return dn.relative(A,Q)}function scA(A){if(pQ()==="windows")return LS(A);return A}function sW5(){return wL.map((A)=>xF(A)).filter((A)=>A!==void 0)}function i10(A){let Q=a9(A),B=mn(Q);if(B.endsWith("/.claude/settings.json")||B.endsWith("/.claude/settings.local.json"))return!0;return sW5().some((G)=>mn(G)===B)}function tW5(A){if(i10(A))return!0;let Q=mg(cQ(),".claude","commands"),B=mg(cQ(),".claude","agents"),G=mg(cQ(),".claude","skills");return Qh(A,Q)||Qh(A,B)||Qh(A,G)}function eW5(A){if(!hg())return!1;let Q=a9(A);return Qh(Q,hg())}function hg2(A){let Q=sF();return A===Q}function Y71(){return mg(FH(s1()),W0(),"session-memory")+UQA}function $Q1(){return mg(Y71(),"summary.md")}function AK5(A){return A.startsWith(Y71())}function wXA(){return!1}function QK5(){return pQ()==="windows"?mg(aW5(),"claude")+UQA:"/tmp/claude/"}function gg2(){return mg(QK5(),Lc(cQ()))+UQA}function m51(){return mg(gg2(),W0(),"scratchpad")}function Qg2(){if(!wXA())throw Error("Scratchpad directory feature is not enabled");let A=jA(),Q=m51();if(!A.existsSync(Q))A.mkdirSync(Q);return Q}function BK5(A){if(!wXA())return!1;let Q=m51();return A===Q||A.startsWith(Q+UQA)}function GK5(A){let B=a9(A).split(UQA),G=B[B.length-1];if(A.startsWith("\\\\")||A.startsWith("//"))return!0;for(let Z of rW5){let Y=mn(Z);if(B.some((J)=>mn(J)===Y))return!0}if(G){let Z=mn(G);if(oW5.some((Y)=>mn(Y)===Z))return!0}return!1}function ug2(A){if(A.indexOf(":",2)!==-1)return!0;if(/~\d/.test(A))return!0;if(A.startsWith("\\\\?\\")||A.startsWith("\\\\.\\")||A.startsWith("//?/")||A.startsWith("//./"))return!0;if(/[.\s]+$/.test(A))return!0;if(/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(A))return!0;if(/(^|\/|\\)\.{3,}(\/|\\|$)/.test(A))return!0;if(d81(A))return!0;return!1}function VB0(A){let Q=va(A);for(let B of Q)if(ug2(B))return{safe:!1,message:`Claude requested permissions to write to ${A}, which contains a suspicious Windows path pattern that requires manual approval.`};for(let B of Q)if(tW5(B))return{safe:!1,message:`Claude requested permissions to write to ${A}, but you haven't granted it yet.`};for(let B of Q)if(eW5(B));for(let B of Q)if(GK5(B))return{safe:!1,message:`Claude requested permissions to edit ${A} which is a sensitive file.`};return{safe:!0}}function HJA(A){return new Set([cQ(),...A.additionalWorkingDirectories.keys()])}function DT(A,Q){return va(A).every((G)=>Array.from(HJA(Q)).some((Z)=>Qh(G,Z)))}function Qh(A,Q){let B=a9(A),G=a9(Q),Z=B.replace(/^\/private\/var\//,"/var/").replace(/^\/private\/tmp(\/|$)/,"/tmp$1"),Y=G.replace(/^\/private\/var\//,"/var/").replace(/^\/private\/tmp(\/|$)/,"/tmp$1"),J=mn(Z),I=mn(Y),X=bg2(I,J);if(X==="")return!0;if(k8A(X))return!1;return!dn.isAbsolute(X)}function ZK5(A){switch(A){case"cliArg":case"command":case"session":return a9(cQ());case"userSettings":case"policySettings":case"projectSettings":case"localSettings":case"flagSettings":return J71(A)}}function nY0(A){return dn.join(nC,A)}function YK5({patternRoot:A,pattern:Q,rootPath:B}){let G=dn.join(A,Q);if(A===B)return nY0(Q);else if(G.startsWith(`${B}${nC}`)){let Z=G.slice(B.length);return nY0(Z)}else{let Z=dn.relative(B,A);if(!Z||Z.startsWith(`..${nC}`)||Z==="..")return null;else{let Y=dn.join(Z,Q);return nY0(Y)}}}function AZA(A,Q){let B=new Set(A.get(null)??[]);for(let[G,Z]of A.entries()){if(G===null)continue;for(let Y of Z){let J=YK5({patternRoot:G,pattern:Y,rootPath:Q});if(J)B.add(J)}}return Array.from(B)}function QZA(A){let Q=mg2(A,"read","deny"),B=new Map;for(let[G,Z]of Q.entries())B.set(G,Array.from(Z.keys()));return B}function JK5(A,Q){if(A.startsWith(`${nC}${nC}`)){let G=A.slice(1);if(pQ()==="windows"&&G.match(/^\/[a-z]\//i)){let Z=G[1]?.toUpperCase()??"C",Y=G.slice(2),J=`${Z}:\\`;return{relativePattern:Y.startsWith("/")?Y.slice(1):Y,root:J}}return{relativePattern:G,root:nC}}else if(A.startsWith(`~${nC}`))return{relativePattern:A.slice(1),root:nW5()};else if(A.startsWith(nC))return{relativePattern:A,root:ZK5(Q)};let B=A;if(A.startsWith(`.${nC}`))B=A.slice(2);return{relativePattern:B,root:null}}function mg2(A,Q,B){let G=(()=>{switch(Q){case"edit":return i6;case"read":return W5}})(),Z=_Y0(A,G,B),Y=new Map;for(let[J,I]of Z.entries()){let{relativePattern:X,root:W}=JK5(J,I.source),K=Y.get(W);if(K===void 0)K=new Map,Y.set(W,K);K.set(X,I)}return Y}function uE(A,Q,B,G){let Z=a9(A);if(pQ()==="windows"&&Z.includes("\\"))Z=LS(Z);let Y=mg2(Q,B,G);for(let[J,I]of Y.entries()){let X=Array.from(I.keys()).map((E)=>{let D=E;if(J===nC&&E.startsWith(nC))D=E.slice(1);if(D.endsWith("/**"))D=D.slice(0,-3);return D}),W=fg2.default().add(X),K=bg2(J??s1(),Z??s1());if(K.startsWith(`..${nC}`))continue;if(!K)continue;let V=W.test(K);if(V.ignored&&V.rule){let E=V.rule.pattern,D=E+"/**";if(I.has(D))return I.get(D)??null;if(J===nC&&!E.startsWith(nC)){E=nC+E;let H=E+"/**";if(I.has(H))return I.get(H)??null}return I.get(E)??null}}return null}function _p(A,Q,B){if(typeof A.getPath!=="function")return{behavior:"ask",message:`Claude requested permissions to use ${A.name}, but you haven't granted it yet.`};let G=A.getPath(Q),Z=va(G);for(let K of Z)if(K.startsWith("\\\\")||K.startsWith("//"))return{behavior:"ask",message:`Claude requested permissions to read from ${G}, which appears to be a UNC path that could access network resources.`,decisionReason:{type:"other",reason:"UNC path detected (defense-in-depth check)"}};for(let K of Z)if(ug2(K))return{behavior:"ask",message:`Claude requested permissions to read from ${G}, which contains a suspicious Windows path pattern that requires manual approval.`,decisionReason:{type:"other",reason:"Path contains suspicious Windows-specific patterns (alternate data streams, short names, long path prefixes, or three or more consecutive dots) that require manual verification"}};for(let K of Z){let V=uE(K,B,"read","deny");if(V)return{behavior:"deny",message:`Permission to read ${G} has been denied.`,decisionReason:{type:"rule",rule:V}}}for(let K of Z){let V=uE(K,B,"read","ask");if(V)return{behavior:"ask",message:`Claude requested permissions to read from ${G}, but you haven't granted it yet.`,decisionReason:{type:"rule",rule:V}}}let Y=OAA(A,Q,B);if(Y.behavior==="allow")return Y;if(DT(G,B))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"mode",mode:"default"}};let I=a9(G),X=XK5(I,Q);if(X.behavior!=="passthrough")return X;let W=uE(G,B,"read","allow");if(W)return{behavior:"allow",updatedInput:Q,decisionReason:{type:"rule",rule:W}};return{behavior:"ask",message:`Claude requested permissions to read from ${G}, but you haven't granted it yet.`,suggestions:hB1(G,"read",B),decisionReason:{type:"workingDir",reason:"Path is outside allowed working directories"}}}function OAA(A,Q,B){if(typeof A.getPath!=="function")return{behavior:"ask",message:`Claude requested permissions to use ${A.name}, but you haven't granted it yet.`};let G=A.getPath(Q),Z=va(G);for(let K of Z){let V=uE(K,B,"edit","deny");if(V)return{behavior:"deny",message:`Permission to edit ${G} has been denied.`,decisionReason:{type:"rule",rule:V}}}let Y=a9(G),J=IK5(Y,Q);if(J.behavior!=="passthrough")return J;let I=VB0(G);if(!I.safe)return{behavior:"ask",message:I.message,decisionReason:{type:"other",reason:I.message}};for(let K of Z){let V=uE(K,B,"edit","ask");if(V)return{behavior:"ask",message:`Claude requested permissions to write to ${G}, but you haven't granted it yet.`,decisionReason:{type:"rule",rule:V}}}let X=DT(G,B);if(B.mode==="acceptEdits"&&X)return{behavior:"allow",updatedInput:Q,decisionReason:{type:"mode",mode:B.mode}};let W=uE(G,B,"edit","allow");if(W)return{behavior:"allow",updatedInput:Q,decisionReason:{type:"rule",rule:W}};return{behavior:"ask",message:`Claude requested permissions to write to ${G}, but you haven't granted it yet.`,suggestions:hB1(G,"write",B),decisionReason:!X?{type:"workingDir",reason:"Path is outside allowed working directories"}:void 0}}function hB1(A,Q,B){let G=!DT(A,B);if(Q==="read"&&G){let Z=Pf(A);return va(Z).map((I)=>rcA(I,"session")).filter((I)=>I!==void 0)}if(Q==="write"||Q==="create"){let Z=[{type:"setMode",mode:"acceptEdits",destination:"session"}];if(G){let Y=Pf(A),J=va(Y);Z.push({type:"addDirectories",directories:J,destination:"session"})}return Z}return[{type:"setMode",mode:"acceptEdits",destination:"session"}]}function IK5(A,Q){if(hg2(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Plan files for current session are allowed for writing"}};if(BK5(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Scratchpad files for current session are allowed for writing"}};return{behavior:"passthrough",message:""}}function XK5(A,Q){let B=mg(FH(cQ()),"bash-outputs",W0());if(A.startsWith(B))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Bash output files from current session are allowed for reading"}};if(AK5(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Session memory files are allowed for reading"}};if(hg2(A))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Plan files for current session are allowed for reading"}};let G=ReA(),Z=G.endsWith(UQA)?G:G+UQA;if(A===G||A.startsWith(Z))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Tool result files are allowed for reading"}};let Y=gg2();if(A.startsWith(Y))return{behavior:"allow",updatedInput:Q,decisionReason:{type:"other",reason:"Project temp directory files are allowed for reading"}};return{behavior:"passthrough",message:""}}var fg2,oW5,rW5,nC;var mY=q(()=>{u0();w4();pB();ZY();v8A();x8();Z8();ZY();GV();rG();jE();gB();iI();YQ();qXA();zG0();tF();_AA();fg2=o(PsA(),1),oW5=[".gitconfig",".gitmodules",".bashrc",".bash_profile",".zshrc",".zprofile",".profile",".ripgreprc",".mcp.json"],rW5=[".git",".vscode",".idea",".claude"];nC=dn.sep});import{isAbsolute as W71,resolve as dg2,relative as WK5,sep as aY0,basename as K71,dirname as rY0,extname as oY0,join as RXA}from"path";import{homedir as KK5}from"os";import{chmodSync as VK5}from"fs";function EK5(A){let Q=/[*?[{]/,B=A.match(Q);if(!B||B.index===void 0){let I=rY0(A),X=K71(A);return{baseDir:I,relativePattern:X}}let G=A.slice(0,B.index),Z=Math.max(G.lastIndexOf("/"),G.lastIndexOf(aY0));if(Z===-1)return{baseDir:"",relativePattern:A};let Y=G.slice(0,Z),J=A.slice(Z+1);if(Y===""&&Z===0)Y="/";if(pQ()==="windows"&&/^[A-Za-z]:$/.test(Y))Y=Y+aY0;return{baseDir:Y,relativePattern:J}}async function GRB(A,Q,{limit:B,offset:G},Z,Y){let J=Q,I=A;if(W71(A)){let{baseDir:H,relativePattern:F}=EK5(A);if(H)J=H,I=F}let X=AZA(QZA(Y),J),W=["--files","--glob",I,"--sort=modified","--no-ignore","--hidden"];for(let H of X)W.push("--glob",`!${H}`);let V=(await lj(W,J,Z)).map((H)=>W71(H)?H:RXA(J,H)),E=V.length>G+B;return{files:V.slice(G,G+B),truncated:E}}function WH(A){let Q=jA();return Math.ceil(Q.statSync(A).mtimeMs)}function wWB(A,Q=0,B){let Y=jA().readFileSync(A,{encoding:"utf8"}).split(/\r?\n/),J=B!==void 0&&Y.length-Q>B?Y.slice(Q,Q+B):Y.slice(Q);return{content:J.join(`
`),lineCount:J.length,totalLines:Y.length}}function eGA(A,Q,B,G){let Z=Q;if(G==="CRLF")Z=Q.split(`
`).join(`\r
`);KM(A,Z,{encoding:B})}function TD(A){try{let B=jA(),{resolvedPath:G}=yI(B,A),{buffer:Z,bytesRead:Y}=B.readSync(G,{length:4096});if(Y===0)return"utf8";if(Y>=2){if(Z[0]===255&&Z[1]===254)return"utf16le"}if(Y>=3&&Z[0]===239&&Z[1]===187&&Z[2]===191)return"utf8";return"utf8"}catch(B){return r(B),"utf8"}}function RAA(A,Q="utf8"){try{let B=jA(),{resolvedPath:G}=yI(B,A),{buffer:Z,bytesRead:Y}=B.readSync(G,{length:4096}),J=Z.toString(Q,0,Y);return DK5(J)}catch(B){return r(B),"LF"}}function DK5(A){let Q=0,B=0;for(let G=0;G<A.length;G++)if(A[G]===`
`)if(G>0&&A[G-1]==="\r")Q++;else B++;return Q>B?"CRLF":"LF"}function Rp(A){let Q=W71(A)?A:dg2(s1(),A),B=jA(),G=String.fromCharCode(8239),Z=/^(.+)([ \u202F])(AM|PM)(\.png)$/,Y=K71(Q).match(Z);if(Y){if(B.existsSync(Q))return Q;let J=Y[2],I=J===" "?G:" ",X=Q.replace(`${J}${Y[3]}${Y[4]}`,`${I}${Y[3]}${Y[4]}`);if(B.existsSync(X))return X}return Q}function O7A(A){return A.replace(/^\t+/gm,(Q)=>"  ".repeat(Q.length))}function HK5(A){let Q=A?a9(A):void 0,B=Q?WK5(s1(),Q):void 0;return{absolutePath:Q,relativePath:B}}function E8(A){let{relativePath:Q}=HK5(A);if(Q&&!Q.startsWith(".."))return Q;let B=KK5();if(A.startsWith(B+aY0))return"~"+A.slice(B.length);return A}function PoA(A){let Q=jA();try{let B=rY0(A),G=K71(A,oY0(A));if(!Q.existsSync(B))return;let J=Q.readdirSync(B).filter((I)=>K71(I.name,oY0(I.name))===G&&RXA(B,I.name)!==A)[0];if(J)return J.name;return}catch(B){r(B);return}}function Tp({content:A,startLine:Q}){if(!A)return"";return A.split(/\r?\n/).map((G,Z)=>{let Y=Z+Q,J=String(Y);if(J.length>=6)return`${J}→${G}`;return`${J.padStart(6," ")}→${G}`}).join(`
`)}function epQ(A){let Q=jA();if(!Q.existsSync(A))return!0;return Q.isDirEmptySync(A)}function _E(A){let Q=jA(),{resolvedPath:B,isSymlink:G}=yI(Q,A);if(G)f(`Reading through symlink: ${A} -> ${B}`);let Z=TD(B);return Q.readFileSync(B,{encoding:Z}).replaceAll(`\r
`,`[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);

[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/src/core/settings/legacyPaths.ts[0m
@@ -9,2 +9,3 @@
   flagSettingsPath?: string | null;
[32m+  policySystemDir?: string | null;[0m
 };
@@ -18,2 +19,3 @@
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
[32m+  if (ctx.policySystemDir) return ctx.policySystemDir;[0m
   const platform = ctx.process?.platform?.() ?? "unknown";
@@ -47,5 +49,3 @@
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
[31m-  const base = resolveLegacySettingsBaseDir(source, ctx);[0m
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
[31m-  if (!base) return null;[0m
 
@@ -53,7 +53,18 @@
     case "userSettings":
[32m+    case "projectSettings":[0m
[32m+    case "localSettings": {[0m
[32m+      const base = resolveLegacySettingsBaseDir(source, ctx);[0m
[32m+      if (!base) return null;[0m
       return `${base}/settings.json`;
[31m-    case "projectSettings":[0m
[32m+    }[0m
[32m+    case "projectSettings": {[0m
[32m+      const base = resolveLegacySettingsBaseDir(source, ctx);[0m
[32m+      if (!base) return null;[0m
       return `${base}/.claude/settings.json`;
[31m-    case "localSettings":[0m
[32m+    }[0m
[32m+    case "localSettings": {[0m
[32m+      const base = resolveLegacySettingsBaseDir(source, ctx);[0m
[32m+      if (!base) return null;[0m
       return `${base}/.claude/settings.local.json`;
[32m+    }[0m
     case "policySettings": {
[32mapply_patch(auto_approved=true) exited 0 in 23ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM src/core/settings/legacyPaths.ts[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..4ad8d33d6cb38224d2458577ed95fb8f3ce99fdf
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,26 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
     case "userSettings":
+    case "projectSettings":
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;


[35m[3mthinking[0m[0m
**Fixing code logic**

I see that I've mistakenly duplicated cases. I inserted "userSettings," "projectSettings," and "localSettings," but I added them incorrectly, which led to unreachable code and compile errors. I need to correct that to handle each case separately. 

So, my intention is to specify a return path depending on the source: for "policySettings," always return the sys path; for "userSettings," return `${base}/settings.json`; for "projectSettings," use `${base}/.claude/settings.json`; and for "localSettings," `${base}/.claude/settings.local.json`. Then, I'll ensure "flagSettings" is managed elsewhere.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..4ad8d33d6cb38224d2458577ed95fb8f3ce99fdf
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,26 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
     case "userSettings":
+    case "projectSettings":
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;

[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/src/core/settings/legacyPaths.ts[0m
@@ -53,4 +53,2 @@
     case "userSettings":
[31m-    case "projectSettings":[0m
[31m-    case "localSettings": {[0m
       const base = resolveLegacySettingsBaseDir(source, ctx);
@@ -58,3 +56,2 @@
       return `${base}/settings.json`;
[31m-    }[0m
     case "projectSettings": {
[32mapply_patch(auto_approved=true) exited 0 in 23ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM src/core/settings/legacyPaths.ts[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..cae596123226727b5380fcbac0cd696439f82e79
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,23 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
     case "userSettings":
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;


[35m[3mthinking[0m[0m
**Verifying switch cases**

I’m checking to make sure the switch has unique cases like userSettings, projectSettings, localSettings, and policySettings. I’m realizing we might’ve incorrectly removed the localSettings case, but hang on, we actually still have it later. I think it’s important to confirm by looking at the file to ensure everything is right. I want to double-check to prevent any possible errors down the line!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..cae596123226727b5380fcbac0cd696439f82e79
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,23 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
     case "userSettings":
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,120p' src/core/settings/legacyPaths.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 38ms:[0m
[2mimport type { HostFilesystem, HostProcess } from "../types/host.js";
import type { FileBackedSettingsSource } from "./types.js";

export type LegacySettingsPathContext = {
  process?: HostProcess;
  filesystem?: HostFilesystem;
  configDir?: string;
  projectRoot?: string;
  flagSettingsPath?: string | null;
  policySystemDir?: string | null;
};

export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
  const viaEnv = process?.getEnv?.("CLAUDE_CONFIG_DIR");
  if (viaEnv) return viaEnv;
  return null;
}

export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
  if (ctx.policySystemDir) return ctx.policySystemDir;[0m

[35m[3mthinking[0m[0m
**Fixing TypeScript switch errors**

I’ve noticed an issue in the code: the `case "userSettings"` lacks braces. In TypeScript, declaring a constant within a case needs braces to avoid hoisting issues. While it may seem like it’s allowed, using braces is crucial to prevent duplicate declarations, especially since `const base` appears multiple times across cases. So, the plan is to add braces around the userSettings case and possibly choose a different variable name to resolve these conflicts. Additionally, `resolveLegacySettingsBaseDir` can stay as it returns `ctx.projectRoot`, though it remains unused for file paths. I'll patch this up!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..cae596123226727b5380fcbac0cd696439f82e79
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,23 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
     case "userSettings":
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;

[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/src/core/settings/legacyPaths.ts[0m
@@ -52,3 +52,3 @@
   switch (source) {
[31m-    case "userSettings":[0m
[32m+    case "userSettings": {[0m
       const base = resolveLegacySettingsBaseDir(source, ctx);
@@ -56,2 +56,3 @@
       return `${base}/settings.json`;
[32m+    }[0m
     case "projectSettings": {
[32mapply_patch(auto_approved=true) exited 0 in 22ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM src/core/settings/legacyPaths.ts[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;

[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;

[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/tests/phase15-migration.test.ts[0m
@@ -36,2 +36,27 @@
 
[32m+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {[0m
[32m+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));[0m
[32m+    const configDir = path.join(dir, "config");[0m
[32m+    const projectRoot = path.join(dir, "project");[0m
[32m+    const policySystemDir = path.join(dir, "system");[0m
[32m+    await mkdir(configDir, { recursive: true });[0m
[32m+    await mkdir(projectRoot, { recursive: true });[0m
[32m+    await mkdir(policySystemDir, { recursive: true });[0m
[32m+[0m
[32m+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });[0m
[32m+[0m
[32m+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });[0m
[32m+    expect(absent.policyOrigin).toBe("absent");[0m
[32m+    expect(absent.perSource.policySettings?.origin).toBe("absent");[0m
[32m+    expect(absent.errors.length).toBe(0);[0m
[32m+[0m
[32m+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");[0m
[32m+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });[0m
[32m+    expect(invalid.policyOrigin).toBe("invalid");[0m
[32m+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");[0m
[32m+    expect(invalid.errors.length).toBeGreaterThan(0);[0m
[32m+[0m
[32m+    await rm(dir, { recursive: true, force: true });[0m
[32m+  });[0m
[32m+[0m
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
[32mapply_patch(auto_approved=true) exited 0 in 28ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM tests/phase15-migration.test.ts[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'bun test tests/phase15*'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 110ms:[0m
[2mbun test v1.3.4 (5eb2145b)

tests/phase15-engine-only-cli.test.ts:
(pass) Phase 15: engine-only diagnostic mode > engine-only prints a stable JSON report and exits 0 [42.51ms]

tests/phase15-migration.test.ts:
(pass) Phase 15: migration strategy primitives > legacy settings file snapshot merges sources in legacy order [2.40ms]
(pass) Phase 15: migration strategy primitives > policy settings origin is absent/invalid based on managed-settings.json readability [0.82ms]
(pass) Phase 15: migration strategy primitives > legacy permission updates can be persisted back to legacy settings files [1.32ms]
(pass) Phase 15: migration strategy primitives > legacy MCP tool identifiers are canonicalized deterministically [0.02ms]
(pass) Phase 15: migration strategy primitives > shadow evaluation produces no diffs when settings are equivalent [2.56ms]

 6 pass
 0 fail
 23 expect() calls
Ran 6 tests across 2 files. [70.00ms][0m

[35m[3mthinking[0m[0m
**Deciding on the testing approach**

I’m considering whether to conduct a full bun test again. It might not be strictly necessary, but since we've changed the core file, it feels prudent to do a comprehensive test quickly. I want to ensure everything is functioning correctly, even if it's a bit overboard. Better safe than sorry, right? It’s just a matter of balancing caution with efficiency. Let's get it done!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'bun test'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 3.14s:[0m
[2mbun test v1.3.4 (5eb2145b)

tests/phase6-settings.test.ts:
(pass) Phase 6: settings system > enabled sources flag parser matches legacy
(pass) Phase 6: settings system > enabled file sources always include policy+flag (and preserve legacy order) [0.29ms]
(pass) Phase 6: settings system > patch semantics: delete on undefined + arrays replace [0.10ms]
(pass) Phase 6: settings system > storage-backed settings manager merges enabled sources and suppresses self-triggered watch events [1.45ms]
(pass) Phase 6: settings system > export/import bundle captures per-source settings objects [0.22ms]
(pass) Phase 6: settings system > invalid policy settings fail-closed in EffectiveConfig [0.21ms]
(pass) Phase 6: settings system > remote policy refresh writes to cache (storage) [0.15ms]

tests/phase3-event-bus.test.ts:
(pass) Phase 3: event bus semantics > emits monotonic seq per channel and supports cursors [1.00ms]
(pass) Phase 3: event bus semantics > recording helper captures envelopes and can be stopped [0.05ms]
(pass) Phase 3: event bus semantics > includeSnapshot yields a snapshot envelope before live events [0.14ms]
(pass) Phase 3: event bus semantics > coalescing policy can replace queued events deterministically [0.19ms]

tests/phase4-leak-prevention.test.ts:
(pass) Phase 4: capability leak prevention heuristics > no module-level HostCapabilities singletons in portable src/core [12.84ms]
[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'claude --dangerously-skip-permissions -p sayhello'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 8.86s:[0m
[2mHello! How can I help you today with your software engineering tasks?[0m

[35m[3mthinking[0m[0m
**Running the CLI**

I’m getting ready to run our CLI equivalent, which can be `bun src/cli.ts` or `bun run cli`. I need to use the same flags: `--dangerously-skip-permissions -p sayhello`. I think our CLI should accept this flag, but I’m double-checking to be sure. Once I’m confident, I’ll go ahead and run it. Let's see how it performs!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'bun src/cli.ts --dangerously-skip-permissions -p sayhello'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 74ms:[0m
[2mscreen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'bun src/cli.ts --help'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 61ms:[0m
[2mclaude-ts 0.1.0

Usage: claude-ts [options]

Options:
  --version, -v, -V     Print version and exit
  --help                Show help
  --mcp-cli ...         MCP CLI (gated by ENABLE_EXPERIMENTAL_MCP_CLI=1)
  --ripgrep ...         Minimal grep/search mode (portable replacement)
  doctor                Print a portable diagnostics report
  engine-only           Run core diagnostics (no model calls)
  --print-frame         Print one UI frame and exit
  -p, --prompt <text>   Send one prompt, print model output, and exit

Interactive:
  ctrl+o toggles transcript view
  ctrl+e toggles full transcript (in transcript view)

Notes:
  `-p` uses Claude Code credentials (Keychain) or ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN.[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,240p' src/cli.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 32ms:[0m
[2m#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeMcpCliGateSnapshotFromEnv } from "./core/settings/effectiveConfig.js";
import { createEngine } from "./core/engine/createEngine.js";
import { createNodeHostCapabilities } from "./platform/node/host.js";
import { CliAdapter } from "./ui/cli/adapter.js";
import { runNodeCli } from "./ui/cli/nodeEntrypoint.js";
import { runMcpCli } from "./cli/mcpCli.js";
import { runNonInteractivePrompt } from "./cli/prompt.js";
import { runRipgrep } from "./cli/ripgrep.js";
import { runDoctor } from "./cli/doctor.js";
import { runEngineOnlyDiagnostics } from "./cli/engineOnly.js";

function readPackageVersion(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, "..", "package.json"),
    path.resolve(here, "..", "..", "package.json")[0m



[35m[3mthinking[0m[0m
**Evaluating CLI command behavior**

This file's CLI parser only considers argv[0] for commands. When I use an unknown option first, it seems to default to interactive mode, which explains why my command `--dangerously-skip-permissions` caused it to ignore `-p` and print a frame. I realize now that to run in prompt mode, I need to put `-p` as the first argument. However, there's a requirement to execute identical commands from the previous cli.js, which complicates things.
[35m[3mthinking[0m[0m
**Clarifying command validation**

Maybe the requirement is to validate authentication by running `claude --dangerously-skip-permissions -p sayhello` from the old CLI. There's also a reference to the `CLAUDE_CODE_SESSION_ACCESS_TOKEN` in the old cli.js files for context. It seems they only want the old command executed, not our new code. If running `claude ...` works, it confirms credentials are fine, but indicates issues with our code. To test our code, we could run `bun src/cli.ts -p sayhello`, but they insist on using identical commands for consistency, which might be a future update!
[35m[3mthinking[0m[0m
**Understanding phase requirements**

The prompt specifies that I should use the keychain for this phase and verifies that if the official CLI functions properly, then the credentials are good. It doesn't require our CLI to accept `--dangerously-skip-permissions`, but emphasizes that I must run the identical commands from the previous cli.js files, which likely includes the official `claude` CLI. For thoroughness, I could also execute our CLI with `-p sayhello` without the additional flag, so it uses the keychain and provides a model output.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'bun src/cli.ts -p sayhello'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 1.37s:[0m
[2mThe model 'claude-3-7-sonnet-20250219' is deprecated and will reach end-of-life on February 19th, 2026
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.
Hello! I'm Claude Code, a CLI interface to assist you with coding tasks, text generation, and other helpful functions. How can I help you today?[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "dangerously-skip-permissions" -S src tests bundles | head -n 50'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 53ms:[0m
[2mbundles/ClaudeAgentSDKCode/sdk.mjs:7397:        args.push("--allow-dangerously-skip-permissions");
bundles/ClaudeAgentSDKCode/cli.js:4692:`),Q(),A(null)},source:"cliArg"})),{exitOnCtrlC:!1})})}var aC;var Bc2=q(()=>{hA();td2();kG();Ac2();_0();f2();Q0();aC=o(KA(),1)});function Zc2(){if(process.env.CLAUDE_CODE_REMOTE==="true")return;Gc2(IN),Gc2(JJA)}function Gc2(A){let Q=c8(),B=E6A(A.model,Q);if(!d51(B))return;try{Nl.call({prompt:"Warmup",subagent_type:A.agentType,description:"Warmup"},{options:{agentDefinitions:{allAgents:[A],activeAgents:[A]},commands:[],debug:!1,mainLoopModel:c8(),tools:[],verbose:!1,maxThinkingTokens:1000,mcpClients:[],mcpResources:{},isNonInteractiveSession:!1,hasAppendSystemPrompt:!1},abortController:new AbortController,readFileState:new wq({max:1000}),getAppState:async()=>bn(),setAppState:async()=>{},setMessages:async()=>{},setInProgressToolUseIDs:async()=>{},setResponseLength:async()=>{},updateFileHistoryState:async()=>{},agentId:"warmup",messages:[]},async()=>({behavior:"deny",message:"Warmup",decisionReason:{type:"other",reason:"Warmup"}}),aE({content:"Warmup"}),()=>{}).catch(()=>{})}catch{}}var Yc2=q(()=>{N9A();ZqA();YJA();f2();KB();d2();OB1();PG()});var Jc2=q(()=>{A81();WjA();U71();Q0()});var Vc2={};FG(Vc2,{showSetupScreens:()=>Kc2,setup:()=>v71,main:()=>fD5,completeOnboarding:()=>Wc2});import{ReadStream as qD5}from"tty";import{openSync as LD5,existsSync as y71,readFileSync as Ic2,writeFileSync as MD5}from"fs";import{cwd as mJ0}from"process";import{resolve as dJ0}from"path";function OD5(){try{let A=uB("policySettings");if(A){let Q=ng2(A);s("tengu_managed_settings_loaded",{keyCount:Q.length,keys:Q.join(",")})}}catch{}}function RD5(){try{let A=hZ(),Q=process.env.ENABLE_EXPERIMENTAL_MCP_CLI!==void 0?"external_env_var":"external_default",B=!1;s("tengu_mcp_cli_status",{enabled:A,source:Q,legacy_env_var_set:!1})}catch{}}function _D5(){let A=ea(),Q=process.execArgv.some((G)=>{if(A)return/--inspect(-brk)?/.test(G);else return/--inspect(-brk)?|--debug(-brk)?/.test(G)}),B=process.env.NODE_OPTIONS&&/--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);try{return!!global.require("inspector").url()||Q||B}catch{return Q||B}}function Wc2(){i0((A)=>({...A,hasCompletedOnboarding:!0,lastOnboardingVersion:{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.67",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2025-12-11T23:56:11Z"}.VERSION}))}async function Kc2(A,Q,B){if(C0(!1)||process.env.IS_DEMO)return!1;let G=c1(),Z=!1;if(!G.theme||!G.hasCompletedOnboarding)Z=!0,await JI(),await new Promise(async(Y)=>{let{unmount:J}=await O5(s8.default.createElement(n5,{onChangeAppState:ty},s8.default.createElement(Wm2,{onDone:async()=>{Wc2(),J(),await JI(),Y()}})),{exitOnCtrlC:!1})});if(A!=="bypassPermissions"&&process.env.CLAUBBIT!=="true"){let Y=tZ(!1);if(await new Promise(async(W)=>{let{unmount:K}=await O5(s8.default.createElement(n5,null,s8.default.createElement(Om2,{commands:B,onDone:async()=>{if(K(),!Y)await JI();W()}})),{exitOnCtrlC:!1})}),CHA()||!1)n51();Qj1(),Js(),BD();let{errors:X}=Gy();if(X.length===0)await Ad2();if(await lRB())await new Promise(async(W)=>{let{unmount:K}=await O5(s8.default.createElement(n5,null,s8.default.createElement(r81,{onDone:()=>{K(),W()},isStandaloneDialog:!0})),{exitOnCtrlC:!1})})}if(await wZA())await new Promise(async(Y)=>{let{unmount:J}=await O5(s8.default.createElement(n5,null,s8.default.createElement(z51,{showIfAlreadyViewed:!1,location:Z?"onboarding":"policy_update_modal",onDone:async(I)=>{if(I==="escape"){s("tengu_grove_policy_exited",{}),f3(0);return}if(J(),I!=="skip_rendering")await JI();Y()}})),{exitOnCtrlC:!1})});if(process.env.ANTHROPIC_API_KEY){let Y=Ww(process.env.ANTHROPIC_API_KEY);if(Q71(Y)==="new")await new Promise(async(I)=>{let{unmount:X}=await O5(s8.default.createElement(n5,{onChangeAppState:ty},s8.default.createElement(O71,{customApiKeyTruncated:Y,onDone:async()=>{X(),await JI(),I()}})),{exitOnCtrlC:!1})})}if(nTA(),(A==="bypassPermissions"||Q)&&!c1().bypassPermissionsModeAccepted)await new Promise(async(Y)=>{let{unmount:J}=await O5(s8.default.createElement(n5,null,s8.default.createElement(Ed2,{onAccept:()=>{J(),Y()}})))});return Z}async function Xc2(A,Q){try{let B=await XAA(A,Q);if(B.type==="connected")return"✓ Connected";else if(B.type==="needs-auth")return"⚠ Needs authentication";else return"✗ Failed to connect"}catch(B){return"✗ Connection error"}}function TD5(){i0((A)=>({...A,numStartups:(A.numStartups??0)+1})),jD5(),iW0()?.add(1)}async function jD5(){let[A,Q]=await Promise.all([_w(),sCA()]);s("tengu_startup_telemetry",{is_git:A,worktree_count:Q,sandbox_enabled:NB.isSandboxingEnabled(),are_unsandboxed_commands_allowed:NB.areUnsandboxedCommandsAllowed(),is_auto_bash_allowed_if_sandbox_enabled:NB.isAutoAllowBashIfSandboxedEnabled()})}function PD5(){Fd2(),zd2(),Nd2(),Ld2(),$d2()}function SD5(){if(I4()){BD();return}if(tZ(!0))BD()}async function v71(A,Q,B,G,Z){let Y=process.version.match(/^v(\d+)\./)?.[1];if(!Y||parseInt(Y)<18)console.error(pA.bold.red("Error: Claude Code requires Node.js version 18 or higher.")),process.exit(1);if(Z)y$(Z);yY0();let J=BlQ();if(J.status==="restored")console.log(pA.yellow("Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect."));else if(J.status==="failed")console.error(pA.red(`Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${J.backupPath}.`));try{let K=await jcA();if(K.status==="restored")console.log(pA.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));else if(K.status==="failed")console.error(pA.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${K.backupPath}.`))}catch(K){r(K instanceof Error?K:Error(String(K)))}if(MN(A),hu2(),du2(),lu2(),p12(),r12(),pm2(),sb2(),U90(),$90(),y_2(),w9("setup_before_prefetch"),Pu2(),jg2(),OC(s1()),I81(),_l(),I_B(),mm2().catch((K)=>r(K)),pU2(),yV(),SD5(),Wd2(),ug(),yg2(),NfQ(),Xd2(),GCQ(I4()),C0(process.env.CLAUDE_CODE_USE_BEDROCK)&&!C0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH))ZCQ();lRA().catch((K)=>r(K)),WZA([],W0()),xaQ(),w9("setup_after_prefetch");let{hasReleaseNotes:I}=P_A(c1().lastReleaseNotesSeen);if(I)await hw2();let X=v9();if(setTimeout(()=>X.abort(),3000),nSA(s1(),X.signal,[]),Q==="bypassPermissions"||B){if(process.platform!=="win32"&&typeof process.getuid==="function"&&process.getuid()===0&&!process.env.IS_SANDBOX)console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"),process.exit(1)}let W=a7();if(W.lastCost!==void 0&&W.lastDuration!==void 0)s("tengu_exit",{last_session_cost:W.lastCost,last_session_api_duration:W.lastAPIDuration,last_session_tool_duration:W.lastToolDuration,last_session_duration:W.lastDuration,last_session_lines_added:W.lastLinesAdded,last_session_lines_removed:W.lastLinesRemoved,last_session_total_input_tokens:W.lastTotalInputTokens,last_session_total_output_tokens:W.lastTotalOutputTokens,last_session_total_cache_creation_input_tokens:W.lastTotalCacheCreationInputTokens,last_session_total_cache_read_input_tokens:W.lastTotalCacheReadInputTokens,last_session_id:W.lastSessionId})}function xD5(A){try{let Q=A.trim(),B=Q.startsWith("{")&&Q.endsWith("}"),G;if(B){if(!d8(Q))process.stderr.write(pA.red(`Error: Invalid JSON provided to --settings
bundles/ClaudeAgentSDKCode/cli.js:4697:`)}return A}async function gD5(){w9("run_function_start");let A=new E71;w9("run_commander_initialized"),A.hook("preAction",async()=>{w9("preAction_start");let J=sh2();if(J instanceof Promise)await J;w9("preAction_after_init"),Q_B(),PD5(),w9("preAction_after_migrations"),RiB(),w9("preAction_after_remote_settings")}),A.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]","Your prompt",String).helpOption("-h, --help","Display help for command").option("-d, --debug [filter]",'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',(J)=>{return!0}).addOption(new LW("-d2e, --debug-to-stderr","Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--verbose","Override verbose mode setting from config",()=>!0).option("-p, --print","Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.",()=>!0).addOption(new LW("--output-format <format>",'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text","json","stream-json"])).addOption(new LW("--json-schema <schema>",'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-partial-messages","Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)",()=>!0).addOption(new LW("--input-format <format>",'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text","stream-json"])).option("--mcp-debug","[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",()=>!0).option("--dangerously-skip-permissions","Bypass all permission checks. Recommended only for sandboxes with no internet access.",()=>!0).option("--allow-dangerously-skip-permissions","Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.",()=>!0).addOption(new LW("--max-thinking-tokens <tokens>","Maximum number of thinking tokens.  (only works with --print)").argParser(Number).hideHelp()).addOption(new LW("--max-turns <turns>","Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new LW("--max-budget-usd <amount>","Maximum dollar amount to spend on API calls (only works with --print)").argParser((J)=>{let I=Number(J);if(isNaN(I)||I<=0)throw Error("--max-budget-usd must be a positive number greater than 0");return I})).option("--replay-user-messages","Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)",()=>!0).addOption(new LW("--enable-auth-status","Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>",'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>",'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read"). Only works with --print mode.').option("--disallowedTools, --disallowed-tools <tools...>",'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>","Load MCP servers from JSON files or strings (space-separated)").addOption(new LW("--permission-prompt-tool <tool>","MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new LW("--system-prompt <prompt>","System prompt to use for the session").argParser(String)).addOption(new LW("--system-prompt-file <file>","Read system prompt from a file").argParser(String).hideHelp()).addOption(new LW("--append-system-prompt <prompt>","Append a system prompt to the default system prompt").argParser(String)).addOption(new LW("--append-system-prompt-file <file>","Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new LW("--permission-mode <mode>","Permission mode to use for the session").argParser(String).choices(aR)).option("-c, --continue","Continue the most recent conversation",()=>!0).option("-r, --resume [value]","Resume a conversation by session ID, or open interactive picker with optional search term",(J)=>J||!0).option("--fork-session","When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)",()=>!0).option("--no-session-persistence","Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new LW("--resume-session-at <message id>","When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new LW("--rewind-files <user-message-id>","Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>","Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').").option("--agent <agent>","Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>","Beta headers to include in API requests (API key users only)").option("--fallback-model <model>","Enable automatic fallback to specified model when default model is overloaded (only works with --print)").option("--settings <file-or-json>","Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>","Additional directories to allow tool access to").option("--ide","Automatically connect to IDE on startup if exactly one valid IDE is available",()=>!0).option("--strict-mcp-config","Only use MCP servers from --mcp-config, ignoring all other MCP configurations",()=>!0).option("--session-id <uuid>","Use a specific session ID for the conversation (must be a valid UUID)").option("--agents <json>",`JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>","Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <paths...>","Load plugins from directories for this session only (repeatable)").option("--disable-slash-commands","Disable all slash commands",()=>!0).action(async(J,I)=>{if(w9("action_handler_start"),J==="code")s("tengu_code_prompt_ignored",{}),console.warn(pA.yellow("Tip: You can launch Claude Code with just `claude`")),J=void 0;if(J&&typeof J==="string"&&!/\s/.test(J)&&J.length>0)s("tengu_single_word_prompt",{length:J.length});let{debug:X=!1,debugToStderr:W=!1,dangerouslySkipPermissions:K,allowDangerouslySkipPermissions:V=!1,tools:E=[],allowedTools:D=[],disallowedTools:H=[],mcpConfig:F=[],permissionMode:C,addDir:$=[],fallbackModel:O,betas:M=[],ide:L=!1,sessionId:_,includePartialMessages:T,pluginDir:x=[]}=I,b=I.agents,v=I.agent;if(x.length>0)HK0(x),mp();let{outputFormat:m,inputFormat:u}=I,e=I.verbose??c1().verbose,p=I.print,k=I.disableSlashCommands||!1,c=!1,AA=Q81(I.chrome),VA=I,OA=void 0,IA=void 0,PA=I.sdkUrl??void 0;if(PA){if(!u)u="stream-json";if(!m)m="stream-json";if(I.verbose===void 0)e=!0;if(!I.print)p=!0}let kA=I.teleport??null,YA=I.remote??null;if(_){if(I.continue||I.resume)process.stderr.write(pA.red(`Error: --session-id cannot be used with --continue or --resume.
bundles/ClaudeCodeCode/cli.js:4682:`),Q(),A(null)},source:"cliArg"})),{exitOnCtrlC:!1})})}var hC;var Jp2=L(()=>{fA();Bp2();SG();Zp2();T0();u2();Y0();hC=o(WA(),1)});function Xp2(){if(process.env.CLAUDE_CODE_REMOTE==="true")return;Ip2(uw),Ip2(JJA)}function Ip2(A){let Q=g8(),B=U3A(A.model,Q);if(!a51(B))return;try{Jl.call({prompt:"Warmup",subagent_type:A.agentType,description:"Warmup"},{options:{agentDefinitions:{allAgents:[A],activeAgents:[A]},commands:[],debug:!1,mainLoopModel:g8(),tools:[],verbose:!1,maxThinkingTokens:1000,mcpClients:[],mcpResources:{},isNonInteractiveSession:!1,hasAppendSystemPrompt:!1},abortController:new AbortController,readFileState:new Jq({max:1000}),getAppState:async()=>Nn(),setAppState:async()=>{},setMessages:async()=>{},setInProgressToolUseIDs:async()=>{},setResponseLength:async()=>{},updateFileHistoryState:async()=>{},agentId:"warmup",messages:[]},async()=>({behavior:"deny",message:"Warmup",decisionReason:{type:"other",reason:"Warmup"}}),hE({content:"Warmup"}),()=>{}).catch(()=>{})}catch{}}var Wp2=L(()=>{_9A();eNA();YJA();u2();HB();l2();OB1();RG()});var Kp2=L(()=>{Y81();RXA();M71();Y0()});var Fp2={};EG(Fp2,{showSetupScreens:()=>Hp2,setup:()=>m71,main:()=>BF5,completeOnboarding:()=>Dp2});import{ReadStream as dH5}from"tty";import{openSync as cH5,existsSync as u71,readFileSync as Vp2,writeFileSync as pH5}from"fs";import{cwd as WI0}from"process";import{resolve as KI0}from"path";function lH5(){try{let A=uB("policySettings");if(A){let Q=su2(A);r("tengu_managed_settings_loaded",{keyCount:Q.length,keys:Q.join(",")})}}catch{}}function iH5(){try{let A=uZ(),Q=process.env.ENABLE_EXPERIMENTAL_MCP_CLI!==void 0?"external_env_var":"external_default",B=!1;r("tengu_mcp_cli_status",{enabled:A,source:Q,legacy_env_var_set:!1})}catch{}}function nH5(){let A=ga(),Q=process.execArgv.some((G)=>{if(A)return/--inspect(-brk)?/.test(G);else return/--inspect(-brk)?|--debug(-brk)?/.test(G)}),B=process.env.NODE_OPTIONS&&/--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);try{return!!global.require("inspector").url()||Q||B}catch{return Q||B}}function Dp2(){i0((A)=>({...A,hasCompletedOnboarding:!0,lastOnboardingVersion:{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.0.69",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2025-12-13T00:32:01Z"}.VERSION}))}async function Hp2(A,Q,B){if(z0(!1)||process.env.IS_DEMO)return!1;let G=d1(),Z=!1;if(!G.theme||!G.hasCompletedOnboarding)Z=!0,await EI(),await new Promise(async(Y)=>{let{unmount:J}=await $5(o8.default.createElement(u5,{onChangeAppState:uy},o8.default.createElement(Hd2,{onDone:async()=>{Dp2(),J(),await EI(),Y()}})),{exitOnCtrlC:!1})});if(A!=="bypassPermissions"&&process.env.CLAUBBIT!=="true"){let Y=QY(!1);if(await new Promise(async(W)=>{let{unmount:K}=await $5(o8.default.createElement(u5,null,o8.default.createElement(Pd2,{commands:B,onDone:async()=>{if(K(),!Y)await EI();W()}})),{exitOnCtrlC:!1})}),KHA()||!1)e51();wj1(),nr(),nE();let{errors:X}=px();if(X.length===0)await Zc2();if(await q_B())await new Promise(async(W)=>{let{unmount:K}=await $5(o8.default.createElement(u5,null,o8.default.createElement(Q51,{onDone:()=>{K(),W()},isStandaloneDialog:!0})),{exitOnCtrlC:!1})})}if(await $ZA())await new Promise(async(Y)=>{let{unmount:J}=await $5(o8.default.createElement(u5,null,o8.default.createElement(L51,{showIfAlreadyViewed:!1,location:Z?"onboarding":"policy_update_modal",onDone:async(I)=>{if(I==="escape"){r("tengu_grove_policy_exited",{}),f6(0);return}if(J(),I!=="skip_rendering")await EI();Y()}})),{exitOnCtrlC:!1})});if(process.env.ANTHROPIC_API_KEY){let Y=d$(process.env.ANTHROPIC_API_KEY);if(I71(Y)==="new")await new Promise(async(I)=>{let{unmount:X}=await $5(o8.default.createElement(u5,{onChangeAppState:uy},o8.default.createElement(S71,{customApiKeyTruncated:Y,onDone:async()=>{X(),await EI(),I()}})),{exitOnCtrlC:!1})})}if(dTA(),(A==="bypassPermissions"||Q)&&!d1().bypassPermissionsModeAccepted)await new Promise(async(Y)=>{let{unmount:J}=await $5(o8.default.createElement(u5,null,o8.default.createElement(Cc2,{onAccept:()=>{J(),Y()}})))});return Z}async function Ep2(A,Q){try{let B=await oe(A,Q);if(B.type==="connected")return"✓ Connected";else if(B.type==="needs-auth")return"⚠ Needs authentication";else return"✗ Failed to connect"}catch(B){return"✗ Connection error"}}function aH5(){i0((A)=>({...A,numStartups:(A.numStartups??0)+1})),oH5(),HK0()?.add(1)}async function oH5(){let[A,Q]=await Promise.all([Jw(),iCA()]);r("tengu_startup_telemetry",{is_git:A,worktree_count:Q,sandbox_enabled:NB.isSandboxingEnabled(),are_unsandboxed_commands_allowed:NB.areUnsandboxedCommandsAllowed(),is_auto_bash_allowed_if_sandbox_enabled:NB.isAutoAllowBashIfSandboxedEnabled(),auto_updater_disabled:Gy()})}function rH5(){$c2(),Nc2(),Oc2(),_c2(),Lc2()}function sH5(){if(D4()){nE();return}if(QY(!0))nE()}async function m71(A,Q,B,G,Z){let Y=process.version.match(/^v(\d+)\./)?.[1];if(!Y||parseInt(Y)<18)console.error(cA.bold.red("Error: Claude Code requires Node.js version 18 or higher.")),process.exit(1);if(Z)E$(Z);GJ0();let J=blQ();if(J.status==="restored")console.log(cA.yellow("Detected an interrupted iTerm2 setup. Your original settings have been restored. You may need to restart iTerm2 for the changes to take effect."));else if(J.status==="failed")console.error(cA.red(`Failed to restore iTerm2 settings. Please manually restore your original settings with: defaults import com.googlecode.iterm2 ${J.backupPath}.`));try{let K=await TcA();if(K.status==="restored")console.log(cA.yellow("Detected an interrupted Terminal.app setup. Your original settings have been restored. You may need to restart Terminal.app for the changes to take effect."));else if(K.status==="failed")console.error(cA.red(`Failed to restore Terminal.app settings. Please manually restore your original settings with: defaults import com.apple.Terminal ${K.backupPath}.`))}catch(K){s(K instanceof Error?K:Error(String(K)))}if(GN(A),cm2(),nm2(),rm2(),x02(),h02(),ad2(),Qg2(),b90(),h90(),PT2(),L9("setup_before_prefetch"),vm2(),yu2(),FC(r1()),E81(),El(),g_B(),ld2().catch((K)=>s(K)),AN2(),_V(),sH5(),Dc2(),Hg(),bu2(),ZbQ(),Ec2(),gCQ(D4()),z0(process.env.CLAUDE_CODE_USE_BEDROCK)&&!z0(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH))uCQ();uRA().catch((K)=>s(K)),XZA([],W0()),XoQ(),L9("setup_after_prefetch");let{hasReleaseNotes:I}=H_A(d1().lastReleaseNotesSeen);if(I)await e$2();let X=g9();if(setTimeout(()=>X.abort(),3000),pSA(r1(),X.signal,[]),Q==="bypassPermissions"||B){if(process.platform!=="win32"&&typeof process.getuid==="function"&&process.getuid()===0&&!process.env.IS_SANDBOX)console.error("--dangerously-skip-permissions cannot be used with root/sudo privileges for security reasons"),process.exit(1)}let W=l7();if(W.lastCost!==void 0&&W.lastDuration!==void 0)r("tengu_exit",{last_session_cost:W.lastCost,last_session_api_duration:W.lastAPIDuration,last_session_tool_duration:W.lastToolDuration,last_session_duration:W.lastDuration,last_session_lines_added:W.lastLinesAdded,last_session_lines_removed:W.lastLinesRemoved,last_session_total_input_tokens:W.lastTotalInputTokens,last_session_total_output_tokens:W.lastTotalOutputTokens,last_session_total_cache_creation_input_tokens:W.lastTotalCacheCreationInputTokens,last_session_total_cache_read_input_tokens:W.lastTotalCacheReadInputTokens,last_session_id:W.lastSessionId})}function tH5(A){try{let Q=A.trim(),B=Q.startsWith("{")&&Q.endsWith("}"),G;if(B){if(!h8(Q))process.stderr.write(cA.red(`Error: Invalid JSON provided to --settings
bundles/ClaudeCodeCode/cli.js:4687:`)}return A}async function YF5(){L9("run_function_start");let A=new U71;L9("run_commander_initialized"),A.hook("preAction",async()=>{L9("preAction_start");let J=Qu2();if(J instanceof Promise)await J;L9("preAction_after_init"),x_B(),rH5(),L9("preAction_after_migrations"),ZnB(),L9("preAction_after_remote_settings")}),A.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]","Your prompt",String).helpOption("-h, --help","Display help for command").option("-d, --debug [filter]",'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!statsig,!file")',(J)=>{return!0}).addOption(new RW("-d2e, --debug-to-stderr","Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--verbose","Override verbose mode setting from config",()=>!0).option("-p, --print","Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.",()=>!0).addOption(new RW("--output-format <format>",'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text","json","stream-json"])).addOption(new RW("--json-schema <schema>",'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-partial-messages","Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)",()=>!0).addOption(new RW("--input-format <format>",'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text","stream-json"])).option("--mcp-debug","[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)",()=>!0).option("--dangerously-skip-permissions","Bypass all permission checks. Recommended only for sandboxes with no internet access.",()=>!0).option("--allow-dangerously-skip-permissions","Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.",()=>!0).addOption(new RW("--max-thinking-tokens <tokens>","Maximum number of thinking tokens.  (only works with --print)").argParser(Number).hideHelp()).addOption(new RW("--max-turns <turns>","Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new RW("--max-budget-usd <amount>","Maximum dollar amount to spend on API calls (only works with --print)").argParser((J)=>{let I=Number(J);if(isNaN(I)||I<=0)throw Error("--max-budget-usd must be a positive number greater than 0");return I})).option("--replay-user-messages","Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)",()=>!0).addOption(new RW("--enable-auth-status","Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>",'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>",'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read"). Only works with --print mode.').option("--disallowedTools, --disallowed-tools <tools...>",'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>","Load MCP servers from JSON files or strings (space-separated)").addOption(new RW("--permission-prompt-tool <tool>","MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new RW("--system-prompt <prompt>","System prompt to use for the session").argParser(String)).addOption(new RW("--system-prompt-file <file>","Read system prompt from a file").argParser(String).hideHelp()).addOption(new RW("--append-system-prompt <prompt>","Append a system prompt to the default system prompt").argParser(String)).addOption(new RW("--append-system-prompt-file <file>","Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new RW("--permission-mode <mode>","Permission mode to use for the session").argParser(String).choices(hR)).option("-c, --continue","Continue the most recent conversation",()=>!0).option("-r, --resume [value]","Resume a conversation by session ID, or open interactive picker with optional search term",(J)=>J||!0).option("--fork-session","When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)",()=>!0).option("--no-session-persistence","Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new RW("--resume-session-at <message id>","When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new RW("--rewind-files <user-message-id>","Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>","Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-5-20250929').").option("--agent <agent>","Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>","Beta headers to include in API requests (API key users only)").option("--fallback-model <model>","Enable automatic fallback to specified model when default model is overloaded (only works with --print)").option("--settings <file-or-json>","Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>","Additional directories to allow tool access to").option("--ide","Automatically connect to IDE on startup if exactly one valid IDE is available",()=>!0).option("--strict-mcp-config","Only use MCP servers from --mcp-config, ignoring all other MCP configurations",()=>!0).option("--session-id <uuid>","Use a specific session ID for the conversation (must be a valid UUID)").option("--agents <json>",`JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>","Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <paths...>","Load plugins from directories for this session only (repeatable)").option("--disable-slash-commands","Disable all slash commands",()=>!0).action(async(J,I)=>{if(L9("action_handler_start"),J==="code")r("tengu_code_prompt_ignored",{}),console.warn(cA.yellow("Tip: You can launch Claude Code with just `claude`")),J=void 0;if(J&&typeof J==="string"&&!/\s/.test(J)&&J.length>0)r("tengu_single_word_prompt",{length:J.length});let{debug:X=!1,debugToStderr:W=!1,dangerouslySkipPermissions:K,allowDangerouslySkipPermissions:V=!1,tools:E=[],allowedTools:D=[],disallowedTools:H=[],mcpConfig:F=[],permissionMode:C,addDir:U=[],fallbackModel:O,betas:q=[],ide:M=!1,sessionId:_,includePartialMessages:T,pluginDir:y=[]}=I,h=I.agents,x=I.agent;if(y.length>0)fK0(y),Op();let{outputFormat:m,inputFormat:g}=I,t=I.verbose??d1().verbose,p=I.print,k=I.disableSlashCommands||!1,c=!1,AA=J81(I.chrome),VA=I,OA=void 0,EA=void 0,SA=I.sdkUrl??void 0;if(SA){if(!g)g="stream-json";if(!m)m="stream-json";if(I.verbose===void 0)t=!0;if(!I.print)p=!0}let yA=I.teleport??null,ZA=I.remote??null;if(_){if(I.continue||I.resume)process.stderr.write(cA.red(`Error: --session-id cannot be used with --continue or --resume.[0m

[35m[3mthinking[0m[0m
**Considering changelog and compilation**

I need to check off completed items in our plan. It seems like the compile errors might be due to mismatched types; the fix we applied suggests we've aligned everything correctly now. I'll record the change in the changelog. There’s also a need to consider updating the changelog structure, but the instructions say to output only to stdout, not necessarily writing to a file. I should inspect the changelogs directory structure to clarify how earlier phases handled logging.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'ls -1 changelogs | tail'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 33ms:[0m
[2mimplementation-20251216-125408
implementation-20251216-134333
implementation-20251217-052000
implementation-20251217-092658
implementation-20251217-093335
implementation-20251217-130149
implementation-20251220-045604
implementation-20251220-045636
implementation-20251220-072913
implementation-20251220-094506[0m

[35m[3mthinking[0m[0m
**Considering folder organization**

I’m pondering whether to use the same folder for this run or create a new one named `implementation-20251220-<time>`. However, since my instructions focus on output only, maybe I should stick to the existing folder mentioned by the user. It includes previous docs in `changelogs/implementation-20251220-094506/phase-15-validation-attempt-1.txt`, so it seems logical to add a new validation attempt file, `phase-15-validation-attempt-2.txt` and possibly `phase-15-change-log.md`. Let's check what's inside that folder.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'ls -1 changelogs/implementation-20251220-094506'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 32ms:[0m
[2mphase-15-attempt-1.md
phase-15-attempt-2.md
phase-15-changelog.md
phase-15-validation-attempt-1.txt[0m

[35m[3mthinking[0m[0m
**Reviewing changelog updates**

I noticed there are attempt markdown files and a changelog file that might need updating. The user mentioned to only output a PHASE Change Log, so I’ll focus on updating the `phase-15-changelog.md` as well. The phase instructions say to check the update plan file checkboxes and the changelog, so I’ll definitely follow that. I'll start by opening the existing changelog and attempt files to see the current format.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,240p' changelogs/implementation-20251220-094506/phase-15-attempt-1.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 43ms:[0m
[2mReading prompt from stdin...
OpenAI Codex v0.73.0 (research preview)
--------
[1mworkdir:[0m /Users/ronaldeddings/ClaudeCodeTS
[1mmodel:[0m gpt-5.2
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m danger-full-access
[1mreasoning effort:[0m high
[1mreasoning summaries:[0m auto
[1msession id:[0m 019b3c6f-ad96-7502-ac94-ebbab19ba2f5
--------
[36muser[0m
You are implementing PHASE 15 of 19.

==============================================
MISSION: IMPLEMENT THE REWRITE PLAN (PHASE-BY-PHASE)
==============================================

AUTHORITATIVE INPUTS:[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,240p' changelogs/implementation-20251220-094506/phase-15-changelog.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 34ms:[0m
[2m## Attempt 1

Reading prompt from stdin...
OpenAI Codex v0.73.0 (research preview)
--------
[1mworkdir:[0m /Users/ronaldeddings/ClaudeCodeTS
[1mmodel:[0m gpt-5.2
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m danger-full-access
[1mreasoning effort:[0m high
[1mreasoning summaries:[0m auto
[1msession id:[0m 019b3c6f-ad96-7502-ac94-ebbab19ba2f5
--------
[36muser[0m
You are implementing PHASE 15 of 19.

==============================================
MISSION: IMPLEMENT THE REWRITE PLAN (PHASE-BY-PHASE)
==============================================[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,240p' changelogs/implementation-20251220-094506/phase-15-attempt-2.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 25ms:[0m
[2mReading prompt from stdin...
OpenAI Codex v0.73.0 (research preview)
--------
[1mworkdir:[0m /Users/ronaldeddings/ClaudeCodeTS
[1mmodel:[0m gpt-5.2
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m danger-full-access
[1mreasoning effort:[0m high
[1mreasoning summaries:[0m auto
[1msession id:[0m 019b3c89-4cd1-7fe3-a6c9-505de0e8a530
--------
[36muser[0m
You are implementing PHASE 15 of 19.

==============================================
MISSION: IMPLEMENT THE REWRITE PLAN (PHASE-BY-PHASE)
==============================================

AUTHORITATIVE INPUTS:[0m

[35m[3mthinking[0m[0m
**Investigating changelog files**

I'm looking into the changelog attempt files to update phase-15-changelog.md. I might also need to add attempt-3 since attempt-2 already exists. I'll inspect the structure of phase-15-changelog.md; it appears to have a section labeled "## Attempt 1" with lots of log details. This doesn't seem very good since it's mostly a transcript. I’m considering that this file might be designed to collect our change logs. Let’s scroll further to see.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '240,520p' changelogs/implementation-20251220-094506/phase-15-changelog.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 40ms:[0m
[2m[1m/bin/zsh -lc "sed -n '1,200p' src/spec/legacy/envFlags.ts"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 50ms:[0m
[2mexport type LegacyKnobKind = "hostAdapterConfig" | "settingsOverlay" | "policy" | "cliOnly" | "deprecated";

export type LegacyEnvVarMapping = {
  name: string;
  kind: LegacyKnobKind;
  notes?: string;
};

export type LegacyCliFlagMapping = {
  flag: string;
  kind: LegacyKnobKind;
  notes?: string;
};

export const LEGACY_ENV_VARS: readonly LegacyEnvVarMapping[] = [
  { name: "CLAUDE_CODE_SESSION_ACCESS_TOKEN", kind: "hostAdapterConfig", notes: "Node/CLI-only credential ingress" },
  { name: "CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR", kind: "hostAdapterConfig", notes: "Node/CLI-only credential ingress (fd)" },

  { name: "ENABLE_EXPERIMENTAL_MCP_CLI", kind: "cliOnly", notes: "Gates `--mcp-cli` behavior" },[0m

[35m[3mthinking[0m[0m
**Considering changelog organization**

I see the user wants to output a changelog to stdout, which is a bit unclear since it’s not necessarily about updating the existing `phase-15-changelog.md`. They might be referring to this file for recording decisions in a structured way, but it looks messy right now. I'm thinking about creating a new attempt file, `phase-15-attempt-3.md`. The existing files capture raw output, and I might need to inspect the second attempt to check for a final changelog.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "''^'"\\*\\*Summary\\*\\*|"'^# Summary|Summary '"\\(\" changelogs/implementation-20251220-094506/phase-15-attempt-2.md changelogs/implementation-20251220-094506/phase-15-attempt-1.md changelogs/implementation-20251220-094506/phase-15-changelog.md | head -n 50"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 38ms:[0m
[2mchangelogs/implementation-20251220-094506/phase-15-attempt-2.md:69:  1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-changelog.md:56:  1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-changelog.md:308:changelogs/implementation-20251220-094506/phase-15-attempt-1.md:54:  1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-changelog.md:70194:### 1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-changelog.md:71681:### 1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-attempt-1.md:54:  1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-attempt-1.md:306:changelogs/implementation-20251220-094506/phase-15-attempt-1.md:54:  1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-attempt-1.md:70192:### 1) Summary (what you accomplished in Phase 15)
changelogs/implementation-20251220-094506/phase-15-attempt-1.md:71679:### 1) Summary (what you accomplished in Phase 15)[0m

[35m[3mthinking[0m[0m
**Examining large files**

The file I'm dealing with is quite extensive, around 70,000 lines, with transcripts that likely include sections like "### 1) Summary..." added by the agent. I’m considering whether to append a new section at the end for a summary, but the user prefers avoiding bloating and doesn’t want source code printed to stdout. Instead, I think creating a new file, `phase-15-attempt-3.md`, for our change log could work. I need to check specific lines using tools like `sed` and confirm the total line count with `wc -l`.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'wc -l changelogs/implementation-20251220-094506/phase-15-changelog.md changelogs/implementation-20251220-094506/phase-15-attempt-1.md changelogs/implementation-20251220-094506/phase-15-attempt-2.md'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 40ms:[0m
[2m   71736 changelogs/implementation-20251220-094506/phase-15-changelog.md
   71733 changelogs/implementation-20251220-094506/phase-15-attempt-1.md
    6699 changelogs/implementation-20251220-094506/phase-15-attempt-2.md
  150168 total[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'ls -1 changelogs/implementation-20251220-072913 | head'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 31ms:[0m
[2mphase-14-attempt-1.md
phase-14-changelog.md
phase-14-validation-attempt-1.txt[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,120p' changelogs/implementation-20251220-072913/phase-14-changelog.md"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 44ms:[0m
[2m## Summary
- Added Phase 14 deterministic test doubles, regression harness + corpus, and conformance tests covering tool gating/cancellation, scheduler cancellation propagation, engine/host integration, and MCP transport simulation.
- Documented the Phase 14 testing strategy + recommended CI matrix requirements (requirements-first; tooling selection deferred).

## Files changed
Created:
- `docs/rewrite/phase-14/README.md`
- `tests/helpers/inMemoryHost.ts`
- `tests/helpers/inMemoryStorage.ts`
- `tests/helpers/mcpSimulator.ts`
- `tests/helpers/regressionHarness.ts`
- `tests/fixtures/phase14-regression-corpus.json`
- `tests/phase14-integration.test.ts`
- `tests/phase14-mcp-simulator.test.ts`
- `tests/phase14-no-subprocess-core.test.ts`
- `tests/phase14-regression-harness.test.ts`
- `tests/phase14-scheduler-properties.test.ts`
- `tests/phase14-tool-conformance.test.ts`

Modified:[0m


[35m[3mthinking[0m[0m
**Running validation checks**

I’m wondering if we need to run the boundary check now. The previous file mentioned it passed, but including it in our validation seems wise. I’ll go ahead and run `node scripts/check-import-boundaries.mjs`. 

I should also run the legacy bundle commands like `node bundles/ClaudeCodeCode/cli.js --version` and `--help`, which were part of the Phase 14 validation. Even though Phase 15 didn't highlight this, I'll mimic that pattern to ensure thoroughness. Redirecting help output to `/dev/null` will keep things manageable. Let's get these commands executed!
[35m[3mthinking[0m[0m
**Confirming command executions**

I’m considering running `node bundles/.. --mcp-cli --help`, even with the environment toggled, which could produce some warnings—that’s alright. Since the user emphasized the importance of running identical commands from the previous cli.js files, we should do that as well.

Of course, there are additional commands, like running our CLI `bun src/cli.ts -p sayhello`, which may also be relevant. It’s worth noting that some of these commands might incur network usage and token costs. I’ll also make sure to run the boundary check.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node scripts/check-import-boundaries.mjs'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 208ms:[0m
[2mImport boundary check passed.[0m

[35m[3mthinking[0m[0m
**Executing legacy commands**

I need to run the legacy bundle commands with minimal output while capturing exit codes. It makes sense to run them all in a single shell command to ensure efficiency. I’ll specify running `node bundles/ClaudeCodeCode/cli.js --version` and similar commands, but outputs might still print, which is okay. It feels like a good plan to keep it organized and tidy while ensuring everything runs smoothly!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node bundles/ClaudeCodeCode/cli.js --version && node bundles/ClaudeAgentSDKCode/cli.js --version'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 821ms:[0m
[2m2.0.69 (Claude Code)
2.0.67 (Claude Code)[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node bundles/ClaudeCodeCode/cli.js --help >/dev/null && node bundles/ClaudeAgentSDKCode/cli.js --help >/dev/null'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 770ms:[0m
[2m[0m

[35m[3mthinking[0m[0m
**Executing command help**

I'm planning to run the command "mcp-cli help" in both scenarios: first with the default gating off. This should display the main help information and exit with a status of 0. I'll suppress the output for clarity. Then, I'll enable the experimental feature with "ENABLE_EXPERIMENTAL_MCP_CLI=1" and run "mcp-cli help" again. I want to ensure I collect the right information from both attempts while paying attention to the outputs.
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node bundles/ClaudeCodeCode/cli.js --mcp-cli --help >/dev/null && ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help >/dev/null && node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help >/dev/null && ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help >/dev/null'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 1.63s:[0m
[2mWarning: MCP endpoint file not found at /var/folders/y9/178pkym1719_vgbjz6fwl0100000gq/T/claude-code-mcp-cli/5fe6b042-0355-4ad4-b89f-3d600bc4ba51.endpoint (session: 5fe6b042-0355-4ad4-b89f-3d600bc4ba51). Falling back to state file.
Warning: MCP endpoint file not found at /var/folders/y9/178pkym1719_vgbjz6fwl0100000gq/T/claude-code-mcp-cli/daa073bc-08ea-418f-95e8-48fd8110c96c.endpoint (session: daa073bc-08ea-418f-95e8-48fd8110c96c). Falling back to state file.[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node bundles/ClaudeCodeCode/cli.js --ripgrep --version || true; node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version || true'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 758ms:[0m
[2mnode:internal/modules/cjs/loader:1405
  const err = new Error(message);
              ^

Error: Cannot find module '/Users/ronaldeddings/ClaudeCodeTS/bundles/ClaudeCodeCode/ripgrep.node'
Require stack:
- /Users/ronaldeddings/ClaudeCodeTS/bundles/ClaudeCodeCode/cli.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1405:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1061:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1066:22)
    at Module._load (node:internal/modules/cjs/loader:1215:37)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
    at Module.require (node:internal/modules/cjs/loader:1491:12)
    at require (node:internal/modules/helpers:135:16)
    at QD5 (file:///Users/ronaldeddings/ClaudeCodeTS/bundles/ClaudeCodeCode/cli.js:4412:13000)
    at XF5 (file:///Users/ronaldeddings/ClaudeCodeTS/bundles/ClaudeCodeCode/cli.js:4751:6430) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/Users/ronaldeddings/ClaudeCodeTS/bundles/ClaudeCodeCode/cli.js' ]
}[0m
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "{ \\
  echo \"== VALIDATION: phase 15 (attempt 2) ==\"; \\
  echo; \\
  echo \""'$ bun test tests/phase15*"; '"\\
  bun test tests/phase15*; \\
  echo; \\
  echo \""'$ bun test"; '"\\
  bun test; \\
  echo; \\
  echo \""'$ node scripts/check-import-boundaries.mjs"; '"\\
  node scripts/check-import-boundaries.mjs; \\
  echo; \\
  echo \""'$ node bundles/ClaudeCodeCode/cli.js --version"; '"\\
  node bundles/ClaudeCodeCode/cli.js --version; \\
  echo; \\
  echo \""'$ node bundles/ClaudeAgentSDKCode/cli.js --version"; '"\\
  node bundles/ClaudeAgentSDKCode/cli.js --version; \\
  echo; \\
  echo \""'$ node bundles/ClaudeCodeCode/cli.js --help"; '"\\
  node bundles/ClaudeCodeCode/cli.js --help >/dev/null; \\
  echo \"(pass; output suppressed)\"; \\
  echo; \\
  echo \""'$ node bundles/ClaudeAgentSDKCode/cli.js --help"; '"\\
  node bundles/ClaudeAgentSDKCode/cli.js --help >/dev/null; \\
  echo \"(pass; output suppressed)\"; \\
  echo; \\
  echo \""'$ node bundles/ClaudeCodeCode/cli.js --mcp-cli --help"; '"\\
  node bundles/ClaudeCodeCode/cli.js --mcp-cli --help >/dev/null; \\
  echo \"(pass; output suppressed)\"; \\
  echo; \\
  echo \""'$ ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help"; '"\\
  ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help >/dev/null; \\
  echo \"(pass; output suppressed)\"; \\
  echo; \\
  echo \""'$ node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help"; '"\\
  node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help >/dev/null; \\
  echo \"(pass; output suppressed)\"; \\
  echo; \\
  echo \""'$ ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help"; '"\\
  ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help >/dev/null; \\
  echo \"(pass; output suppressed)\"; \\
  echo; \\
  echo \""'$ node bundles/ClaudeCodeCode/cli.js --ripgrep --version"; '"\\
  node bundles/ClaudeCodeCode/cli.js --ripgrep --version || echo \"(expected failure in this repo snapshot: missing ripgrep.node)\"; \\
  echo; \\
  echo \""'$ node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version"; '"\\
  node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version || echo \"(expected failure in this repo snapshot: missing ripgrep.node)\"; \\
  echo; \\
  echo \""'$ claude --dangerously-skip-permissions -p sayhello"; '"\\
  claude --dangerously-skip-permissions -p sayhello; \\
  echo; \\
  echo \""'$ bun src/cli.ts -p sayhello"; '"\\
  bun src/cli.ts -p sayhello; \\
} 2>&1 | tee changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt"[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 18.32s:[0m
[2m== VALIDATION: phase 15 (attempt 2) ==

$ bun test tests/phase15*
bun test v1.3.4 (5eb2145b)

tests/phase15-engine-only-cli.test.ts:
(pass) Phase 15: engine-only diagnostic mode > engine-only prints a stable JSON report and exits 0 [42.79ms]

tests/phase15-migration.test.ts:
(pass) Phase 15: migration strategy primitives > legacy settings file snapshot merges sources in legacy order [2.08ms]
(pass) Phase 15: migration strategy primitives > policy settings origin is absent/invalid based on managed-settings.json readability [0.95ms]
(pass) Phase 15: migration strategy primitives > legacy permission updates can be persisted back to legacy settings files [1.22ms]
(pass) Phase 15: migration strategy primitives > legacy MCP tool identifiers are canonicalized deterministically [0.02ms]
(pass) Phase 15: migration strategy primitives > shadow evaluation produces no diffs when settings are equivalent [2.20ms]

 6 pass
 0 fail
 23 expect() calls
Ran 6 tests across 2 files. [80.00ms]
[0m





[35m[3mthinking[0m[0m
**Updating changelog and tasks**

I'm seeing that the model responded differently due to context, interpreting "sayhello" as an instruction. I'll need to update the changelog file `phase-15-changelog.md` with a summary and bullet points about changes, decisions, and tests. Also, there’s a new validation attempt file to note. Regarding the implementation checklist, I need to check off completed items for phase 15, but I’m not sure if I'd check off 15.6 yet. It might remain for the future since it's large work. I'll mention the unchecked items in phase 15.
[35m[3mthinking[0m[0m
**Updating change log and checklist**

I need to include information in the final change log. In this run, we only fixed type errors and added tests. That leaves some items in phase 15, specifically 15.6 cutover checklist items, still unchecked. I'll mention those. Now, regarding the `implementation/1-initial-rewrite-implementation-checklist.md`, we didn’t change anything, and phase 15 still has unchecked items in 15.6. Even though we added a new test, it doesn't affect the checkboxes. I'll focus on updating `phase-15-changelog.md` next.
[35m[3mthinking[0m[0m
**Inserting summary and changes**

I’ll insert a summary at the top that outlines what we’ve accomplished. This includes fixing the `SettingsPolicyOrigin` typing in the legacy settings migration and shadow mode, ensuring the origin values align with core settings types. I've added a policy system directory override for legacy paths to support deterministic tests and updated Phase 15 tests. I'll list the modified and created files as well and clarify decisions made regarding treating policy settings origin based on envelope meta.
[35m[3mthinking[0m[0m
**Inserting rationale and updates**

I need to add a rationale at the top of the file to explain the addition of an optional `policySystemDir` override for legacy paths. This will help enable tests and allow embedding hosts to redirect the managed-settings path without altering global filesystem paths.

Next, I need to include the tests and validation results, noting that everything from the `bun` tests to the version checks has passed. I’ll also mention that the 15.6 cutover milestone items are still unchecked in the checklist. Finally, I'll highlight the handoff notes for future CLI flag compatibility while ensuring not to jump phases. I'll insert this using `apply_patch`.
[35m[3mthinking[0m[0m
**Inserting summary and formatting**

I want to ensure we avoid a huge patch by adding a concise summary at the top of the file. It’s good practice to possibly add an empty line before "## Attempt 1" for clarity and to keep the structure neat. This will help make it easier to read and maintain. I’ll go ahead and apply the patch to insert these changes now. I’m hoping this will help improve the overall documentation flow!
[3m[35mfile update:[0m[0m
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[3m[35mfile update[0m[0m
[35mM /Users/ronaldeddings/ClaudeCodeTS/changelogs/implementation-20251220-094506/phase-15-changelog.md[0m
@@ -71799,2 +71799,44 @@
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
[32m+## Summary[0m
[32m+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.[0m
[32m+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.[0m
[32m+[0m
[32m+## Files changed[0m
[32m+Created:[0m
[32m+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`[0m
[32m+[0m
[32m+Modified:[0m
[32m+- `src/core/migration/legacySettingsFiles.ts`[0m
[32m+- `src/core/migration/shadow.ts`[0m
[32m+- `src/core/settings/legacyPaths.ts`[0m
[32m+- `tests/phase15-migration.test.ts`[0m
[32m+[0m
[32m+## Decisions made[0m
[32m+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).[0m
[32m+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.[0m
[32m+[0m
[32m+## Tests/validation run + results[0m
[32m+- `bun test tests/phase15*` (pass)[0m
[32m+- `bun test` (pass)[0m
[32m+- `node scripts/check-import-boundaries.mjs` (pass)[0m
[32m+- Legacy bundles:[0m
[32m+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)[0m
[32m+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)[0m
[32m+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)[0m
[32m+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)[0m
[32m+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)[0m
[32m+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)[0m
[32m+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)[0m
[32m+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)[0m
[32m+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)[0m
[32m+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)[0m
[32m+- Auth probe:[0m
[32m+  - `claude --dangerously-skip-permissions -p sayhello` (pass)[0m
[32m+  - `bun src/cli.ts -p sayhello` (pass)[0m
[32m+[0m
[32m+## Remaining work inside Phase 15[0m
[32m+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.[0m
[32m+[0m
[32m+## Handoff notes for next phase[0m
[32m+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.[0m
 
[32mapply_patch(auto_approved=true) exited 0 in 63ms:[0m
[2mSuccess. Updated the following files:[0m
[2mM changelogs/implementation-20251220-094506/phase-15-changelog.md[0m
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");


[35m[3mthinking[0m[0m
**Clarifying update sequence**

I can do a sequence, but the instructions say I shouldn't jump from pending to completed; I need to set things to in_progress first. It seems I can mark multiple items as complete in one call, but I can't skip straight from pending to completed without making them in_progress first. So, it looks like I need to update the plan step-by-step. I'll quickly complete each step one at a time to follow the rules.
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35mPlan update[0m
  [32m✓[0m Read Phase 15 requirements
  [36m→[0m Inspect failing migration modules
  [2m•[0m [2mFix type mismatches and behavior[0m
  [2m•[0m [2mAdd Phase 15 tests[0m
  [2m•[0m [2mRun required validation commands[0m
  [2m•[0m [2mUpdate Phase 15 checklist and changelog[0m
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35mPlan update[0m
  [32m✓[0m Read Phase 15 requirements
  [32m✓[0m Inspect failing migration modules
  [36m→[0m Fix type mismatches and behavior
  [2m•[0m [2mAdd Phase 15 tests[0m
  [2m•[0m [2mRun required validation commands[0m
  [2m•[0m [2mUpdate Phase 15 checklist and changelog[0m
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35mPlan update[0m
  [32m✓[0m Read Phase 15 requirements
  [32m✓[0m Inspect failing migration modules
  [32m✓[0m Fix type mismatches and behavior
  [36m→[0m Add Phase 15 tests
  [2m•[0m [2mRun required validation commands[0m
  [2m•[0m [2mUpdate Phase 15 checklist and changelog[0m
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35mPlan update[0m
  [32m✓[0m Read Phase 15 requirements
  [32m✓[0m Inspect failing migration modules
  [32m✓[0m Fix type mismatches and behavior
  [32m✓[0m Add Phase 15 tests
  [36m→[0m Run required validation commands
  [2m•[0m [2mUpdate Phase 15 checklist and changelog[0m
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35mPlan update[0m
  [32m✓[0m Read Phase 15 requirements
  [32m✓[0m Inspect failing migration modules
  [32m✓[0m Fix type mismatches and behavior
  [32m✓[0m Add Phase 15 tests
  [32m✓[0m Run required validation commands
  [36m→[0m Update Phase 15 checklist and changelog
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35mPlan update[0m
  [32m✓[0m Read Phase 15 requirements
  [32m✓[0m Inspect failing migration modules
  [32m✓[0m Fix type mismatches and behavior
  [32m✓[0m Add Phase 15 tests
  [32m✓[0m Run required validation commands
  [32m✓[0m Update Phase 15 checklist and changelog

[35m[3mthinking[0m[0m
**Reviewing code updates**

I need to ensure the code compiles and that the tests passed. Even though updating the implementation checklist might not be required, the step suggests doing so since we updated the changelog. Should I also update the implementation plan to reflect the new test? It seems unnecessary, but I should verify any unchecked items in Phase 15. Checking the git status is also important since we changed multiple files, including a large changelog. Let’s see what’s up with the status!
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'git status --porcelain'[0m in /Users/ronaldeddings/ClaudeCodeTS[32m succeeded in 38ms:[0m
[2m M implementation/1-initial-rewrite-implementation-checklist.md
 M src/cli.ts
 M src/cli/mcpCli.ts
 M src/cli/ripgrep.ts
 M src/core/index.ts
 M src/core/permissions/rules.ts
 M src/core/settings/legacyPaths.ts
 M src/core/tools/registry.ts
?? changelogs/implementation-20251220-094506/
?? docs/migration/
?? src/cli/engineOnly.ts
?? src/core/migration/
?? src/core/tools/names.ts
?? tests/phase15-engine-only-cli.test.ts
?? tests/phase15-migration.test.ts[0m





[35m[3mthinking[0m[0m
**Checking modifications for Phase 15**

Okay, I need to consider if we should update certain files for Phase 15. While we shouldn't change non-Phase 15 files, I notice some modifications in `src/core/settings/legacyPaths.ts`, which relates to Phase 6 and 15. However, I'm unsure why the `implementation/1-initial...` file was modified—perhaps an earlier attempt checked off items? To satisfy the instruction to check off completed Phase 15 items, we might need to verify those modifications as accurate. Let’s inspect the Phase 15 section closely and check for any discrepancies with `git diff`.
[35m[3mthinking[0m[0m
**Limiting changes for Phase 15**

I need to be careful about implementing other phases. If the checklist file has check marks for phases beyond 15, we might have to revert those changes. Modifications could come from earlier phases, but since we're in Phase 15 of 19, it’s okay for now. We must only modify necessary files. We’ve already changed legacyPaths, migration files, tests, and the changelog. However, git status shows too many unrelated modifications that we should avoid. The user wants to implement Phase 15 and fix issues, so we should clearly list the relevant files we've changed.
[35m[3mthinking[0m[0m
**Listing modified files for Phase 15**

I can’t determine which files are new versus older modifications, but I can list those touched in this run: `src/core/migration/legacySettingsFiles.ts`, `src/core/migration/shadow.ts`, `src/core/settings/legacyPaths.ts`, `tests/phase15-migration.test.ts`, `changelogs/.../phase-15-validation-attempt-2.txt`, and `changelogs/.../phase-15-changelog.md`. The first two files appear untracked, but we’ve used them before with `apply_patch`. It's fine since they exist, just untracked. I'll focus on listing the relevant files modified during this phase, prioritizing the user's instruction to implement only Phase 15.
[35m[3mthinking[0m[0m
**Updating changelog records**

We added a summary to the changelog file, which is quite extensive. Now, I see that `src/core/migration` is untracked, but it should exist as part of Phase 15. I’m considering whether to update `changelogs/implementation-20251220-094506/phase-15-attempt-2.md` or create a new `attempt-3`. Since we’ve documented our summary in `phase-15-changelog.md` and made a validation attempt file, that feels sufficient. However, to keep records, maybe creating `phase-15-attempt-3.md` with our final changes is a good idea, even if it's optional.
[35m[3mthinking[0m[0m
**Crafting the final phase changelog**

I need to ensure that any TypeScript errors from our prompt are resolved. The final response will be a structured changelog including the following sections: Summary, Files Changed, Decisions Made, Tests/Validation Run + Results, Remaining Work Inside Phase 15, and Handoff Notes for the Next Phase. I won’t print any source code, only mention adjustments like fixing the `SettingsPolicyOrigin` mismatches and aligning with bundle semantics. 

I will include the necessary file paths and decisions surrounding mapping origins and policy overrides, as well as any remaining work, like the unchecked Phase 15.6 boxes. I’ll also note that we created a validation attempt file, confirming that `tests/phase15-migration.test.ts` is used for the test run. Based on this detail, I’ll summarize without mentioning any tool logs or unnecessary outputs.
[35m[3mcodex[0m[0m
### 1) Summary (what you accomplished in Phase 15)
- Fixed Phase 15 migration TypeScript errors by aligning legacy settings/shadow code to `SettingsPolicyOrigin = "absent" | "local" | "remote" | "invalid"` (no `null`, no `"system"`).
- Added a deterministic way to test `policySettings` by allowing the legacy managed-policy directory to be overridden in `LegacySettingsPathContext`.
- Added a new Phase 15 test covering `policySettings` origin behavior (absent vs invalid).
- Re-ran Phase 15 + full validation; all required checks pass.

### 2) Files changed (created/modified/deleted)
Created:
- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`

Modified:
- `src/core/migration/legacySettingsFiles.ts`
- `src/core/migration/shadow.ts`
- `src/core/settings/legacyPaths.ts`
- `tests/phase15-migration.test.ts`
- `changelogs/implementation-20251220-094506/phase-15-changelog.md`

Deleted:
- None

### 3) Decisions made (with rationale)
- Mapped legacy policy origin to `absent|invalid|local|remote` (deriving `local|remote` from `settings_document.meta.origin`) to match the legacy bundle’s “remote vs local vs none” semantics while keeping the core type union consistent.
- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to OS-level system directories.

### 4) Tests/validation run + results
- `bun test tests/phase15*` (pass)
- `bun test` (pass)
- `node scripts/check-import-boundaries.mjs` (pass)
- Legacy bundle commands:
  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail: missing `ripgrep.node` in this repo snapshot)
  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail: missing `ripgrep.node` in this repo snapshot)
- Auth probe:
  - `claude --dangerously-skip-permissions -p sayhello` (pass)
  - `bun src/cli.ts -p sayhello` (pass)

### 5) Remaining work inside Phase 15 (if any)
- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.

### 6) Handoff notes for next phase
- If CLI arg-compatibility is addressed next, ensure legacy-style “pre-flags” like `--dangerously-skip-permissions -p ...` don’t fall through to interactive mode (currently `-p` must be `argv[0]` in `src/cli.ts`).
[3m[35mfile update:[0m[0m
diff --git a/changelogs/implementation-20251220-094506/phase-15-changelog.md b/changelogs/implementation-20251220-094506/phase-15-changelog.md
index 4d533e15efab6a77a83aa2f12151ca6a4b8039a4..4bc4ff15fa367257bb35d2e16268369d85d55c13
--- a/changelogs/implementation-20251220-094506/phase-15-changelog.md
+++ b/changelogs/implementation-20251220-094506/phase-15-changelog.md
@@ -71797,4 +71797,46 @@
 - Phase 16 can treat `docs/migration/phase15-migration-strategy.md` as the authoritative rollout/flag reference; wire `src/core/migration/flags.ts` into packaging/runtime config as needed.
 - If you want full legacy `--mcp-cli` parity, the next concrete step inside Phase 15 is implementing a safe direct transport (or a desktop-only adapter) so state-file mode can do `call/read` without reintroducing subprocess-centric orchestration.
 - Legacy bundle `--ripgrep` validation currently can’t be reproduced here because `bundles/*/ripgrep.node` is missing; restore that artifact (or adjust the bundle packaging) before comparing legacy `--ripgrep` behavior.
+## Summary
+- Fixed Phase 15 migration code to use the canonical `SettingsPolicyOrigin` union (`absent|local|remote|invalid`) and avoid `null` origins in legacy settings snapshots and shadow evaluation.
+- Added a test-only/system-agnostic override for the legacy managed policy settings directory and expanded Phase 15 migration tests to cover `policySettings` origin behavior.
+
+## Files changed
+Created:
+- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`
+
+Modified:
+- `src/core/migration/legacySettingsFiles.ts`
+- `src/core/migration/shadow.ts`
+- `src/core/settings/legacyPaths.ts`
+- `tests/phase15-migration.test.ts`
+
+## Decisions made
+- Policy origin mapping: treat missing policy settings as `absent`, parse failures as `invalid`, and otherwise derive `local|remote` from `settings_document.meta.origin` (matching legacy bundle semantics where “remote vs local” is a property of the policy source).
+- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to global system paths.
+
+## Tests/validation run + results
+- `bun test tests/phase15*` (pass)
+- `bun test` (pass)
+- `node scripts/check-import-boundaries.mjs` (pass)
+- Legacy bundles:
+  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
+  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
+  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
+  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
+  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail in this repo snapshot: missing `ripgrep.node`)
+- Auth probe:
+  - `claude --dangerously-skip-permissions -p sayhello` (pass)
+  - `bun src/cli.ts -p sayhello` (pass)
+
+## Remaining work inside Phase 15
+- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.
+
+## Handoff notes for next phase
+- If/when CLI arg-compatibility is addressed, ensure legacy-style “pre-flags” (e.g. `--dangerously-skip-permissions -p ...`) are parsed without falling into interactive mode.
 
diff --git a/src/core/migration/legacySettingsFiles.ts b/src/core/migration/legacySettingsFiles.ts
index 9ce6945385b6b7c28fdabf929db5fdb4d06f9c09..2b42a912e20597fd3943c017dd6099548ebf7b0d
--- a/src/core/migration/legacySettingsFiles.ts
+++ b/src/core/migration/legacySettingsFiles.ts
@@ -2,7 +2,7 @@
 import { CapabilityUnavailableError } from "../types/host.js";
 import type { JsonObject } from "../types/json.js";
 import { mergeSettingsObjectsInOrder } from "../settings/merge.js";
-import type { EffectiveSettingsResult, FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
+import type { FileBackedSettingsSource, SettingsError, SettingsPolicyOrigin, SettingsSourceReadResult } from "../settings/types.js";
 import { parseSettingsJson, serializeSettingsDocument } from "../settings/schema.js";
 import { resolveLegacySettingsFilePath, type LegacySettingsPathContext } from "../settings/legacyPaths.js";
 import { createSettingsDocumentFromObject } from "../settings/storage.js";
@@ -38,21 +38,36 @@
   if (filesystem.kind !== "available") throw new CapabilityUnavailableError("filesystem", filesystem.reason);
 
   const filePath = await resolveLegacySettingsFilePath(source, ctx);
-  if (!filePath) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath: null };
+  if (!filePath) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath: null };
+  }
 
   const exists = await filesystem.value.exists(filePath).catch(() => false);
-  if (!exists) return { source, settings: null, errors: [], origin: null, storageVersion: null, filePath };
+  if (!exists) {
+    const origin = source === "policySettings" ? ("absent" as const) : undefined;
+    return { source, settings: null, errors: [], ...(origin ? { origin } : {}), storageVersion: null, filePath };
+  }
 
   const raw = await filesystem.value.readFileText(filePath);
   const parsed = parseSettingsJson(raw, source);
   const settings = parsed.document?.settings ?? null;
-  const origin: SettingsPolicyOrigin | null =
-    source === "policySettings" ? (parsed.errors.length > 0 && settings === null ? "invalid" : "system") : "local";
+
+  const origin: SettingsPolicyOrigin | undefined =
+    source === "policySettings"
+      ? parsed.errors.length > 0 && settings === null
+        ? "invalid"
+        : parsed.document?.meta?.origin === "remote"
+          ? "remote"
+          : "local"
+      : undefined;
+
+  const errors = parsed.errors.map((e) => ({ ...e, ...(filePath ? { filePath } : {}) }));
   return {
     source,
     settings,
-    errors: parsed.errors,
-    origin,
+    errors,
+    ...(origin ? { origin } : {}),
     storageVersion: null,
     raw,
     filePath
@@ -131,4 +146,3 @@
   await filesystem.value.writeFileText(filePath, toWrite, { atomic: true, ...(mode !== undefined ? { mode } : {}) });
   return { ok: true, wrotePath: filePath, format, diagnostics };
 }
-
diff --git a/src/core/migration/shadow.ts b/src/core/migration/shadow.ts
index cc8c2e04377def409947aed5c2a434ab7190cc5f..64f8315a85fd34e7acf5df1cd1e7742c1f950b4f
--- a/src/core/migration/shadow.ts
+++ b/src/core/migration/shadow.ts
@@ -48,22 +48,23 @@
   policy: SettingsSourceReadResult | undefined;
   policyOrigin: EffectiveSettingsResult["policyOrigin"];
 }): EffectiveSettingsResult {
+  const policySettings: SettingsSourceReadResult =
+    options.policy ?? { source: "policySettings", settings: null, errors: [], origin: "absent", storageVersion: null };
+
   return {
     settings: options.settings,
     errors: [],
     enabledSources: [],
     perSource: {
-      userSettings: { source: "userSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      projectSettings: { source: "projectSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      localSettings: { source: "localSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      flagSettings: { source: "flagSettings", settings: null, errors: [], origin: null, storageVersion: null },
-      policySettings:
-        options.policy ??
-        ({ source: "policySettings", settings: null, errors: [], origin: null, storageVersion: null } as SettingsSourceReadResult),
+      userSettings: { source: "userSettings", settings: null, errors: [], storageVersion: null },
+      projectSettings: { source: "projectSettings", settings: null, errors: [], storageVersion: null },
+      localSettings: { source: "localSettings", settings: null, errors: [], storageVersion: null },
+      flagSettings: { source: "flagSettings", settings: null, errors: [], storageVersion: null },
+      policySettings,
       cliArg: { source: "cliArg", settings: null, errors: [] },
       command: { source: "command", settings: null, errors: [] },
       session: { source: "session", settings: null, errors: [] }
-    } as any,
+    } satisfies EffectiveSettingsResult["perSource"],
     policyOrigin: options.policyOrigin
   };
 }
@@ -103,9 +104,15 @@
     settings: v3Settings,
     policy:
       options.hookResolution?.policySettings !== undefined
-        ? ({ source: "policySettings", settings: options.hookResolution.policySettings, errors: [], origin: "system", storageVersion: null } as any)
+        ? ({
+            source: "policySettings",
+            settings: options.hookResolution.policySettings,
+            errors: [],
+            origin: options.hookResolution.policySettings ? "local" : "absent",
+            storageVersion: null
+          } satisfies SettingsSourceReadResult)
         : undefined,
-    policyOrigin: options.hookResolution?.policySettings ? "system" : "absent"
+    policyOrigin: options.hookResolution?.policySettings ? "local" : "absent"
   });
 
   const legacyPolicy = computePermissionPolicySnapshot(legacyEffective);
diff --git a/src/core/settings/legacyPaths.ts b/src/core/settings/legacyPaths.ts
index 4ab5c39f30a136b0abdb13e39dc6fecafdf628f2..0f2c0905f7846df54001d69681f77a47ed816887
--- a/src/core/settings/legacyPaths.ts
+++ b/src/core/settings/legacyPaths.ts
@@ -7,6 +7,7 @@
   configDir?: string;
   projectRoot?: string;
   flagSettingsPath?: string | null;
+  policySystemDir?: string | null;
 };
 
 export function defaultLegacyConfigDir(process: HostProcess | undefined): string | null {
@@ -16,6 +17,7 @@
 }
 
 export async function resolveLegacyPolicySystemDir(ctx: LegacySettingsPathContext): Promise<string> {
+  if (ctx.policySystemDir) return ctx.policySystemDir;
   const platform = ctx.process?.platform?.() ?? "unknown";
   if (platform === "win32") {
     return "C:\\\\ProgramData\\\\ClaudeCode";
@@ -45,17 +47,24 @@
 }
 
 export async function resolveLegacySettingsFilePath(source: FileBackedSettingsSource, ctx: LegacySettingsPathContext): Promise<string | null> {
-  const base = resolveLegacySettingsBaseDir(source, ctx);
   if (source === "flagSettings") return ctx.flagSettingsPath ?? null;
-  if (!base) return null;
 
   switch (source) {
-    case "userSettings":
+    case "userSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/settings.json`;
-    case "projectSettings":
+    }
+    case "projectSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.json`;
-    case "localSettings":
+    }
+    case "localSettings": {
+      const base = resolveLegacySettingsBaseDir(source, ctx);
+      if (!base) return null;
       return `${base}/.claude/settings.local.json`;
+    }
     case "policySettings": {
       const sys = await resolveLegacyPolicySystemDir(ctx);
       return `${sys}/managed-settings.json`;
diff --git a/tests/phase15-migration.test.ts b/tests/phase15-migration.test.ts
index f2095b780f6f23da3c9233aeee7afe265c687429..d5f8461414a7a9e731aae4cdf35340067f49fa62
--- a/tests/phase15-migration.test.ts
+++ b/tests/phase15-migration.test.ts
@@ -34,6 +34,31 @@
     await rm(dir, { recursive: true, force: true });
   });
 
+  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
+    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
+    const configDir = path.join(dir, "config");
+    const projectRoot = path.join(dir, "project");
+    const policySystemDir = path.join(dir, "system");
+    await mkdir(configDir, { recursive: true });
+    await mkdir(projectRoot, { recursive: true });
+    await mkdir(policySystemDir, { recursive: true });
+
+    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
+
+    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(absent.policyOrigin).toBe("absent");
+    expect(absent.perSource.policySettings?.origin).toBe("absent");
+    expect(absent.errors.length).toBe(0);
+
+    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
+    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
+    expect(invalid.policyOrigin).toBe("invalid");
+    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
+    expect(invalid.errors.length).toBeGreaterThan(0);
+
+    await rm(dir, { recursive: true, force: true });
+  });
+
   test("legacy permission updates can be persisted back to legacy settings files", async () => {
     const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
     const configDir = path.join(dir, "config");

[3m[35mtokens used[0m[0m
314,108
### 1) Summary (what you accomplished in Phase 15)
- Fixed Phase 15 migration TypeScript errors by aligning legacy settings/shadow code to `SettingsPolicyOrigin = "absent" | "local" | "remote" | "invalid"` (no `null`, no `"system"`).
- Added a deterministic way to test `policySettings` by allowing the legacy managed-policy directory to be overridden in `LegacySettingsPathContext`.
- Added a new Phase 15 test covering `policySettings` origin behavior (absent vs invalid).
- Re-ran Phase 15 + full validation; all required checks pass.

### 2) Files changed (created/modified/deleted)
Created:
- `changelogs/implementation-20251220-094506/phase-15-validation-attempt-2.txt`

Modified:
- `src/core/migration/legacySettingsFiles.ts`
- `src/core/migration/shadow.ts`
- `src/core/settings/legacyPaths.ts`
- `tests/phase15-migration.test.ts`
- `changelogs/implementation-20251220-094506/phase-15-changelog.md`

Deleted:
- None

### 3) Decisions made (with rationale)
- Mapped legacy policy origin to `absent|invalid|local|remote` (deriving `local|remote` from `settings_document.meta.origin`) to match the legacy bundle’s “remote vs local vs none” semantics while keeping the core type union consistent.
- Added `policySystemDir?: string` to `LegacySettingsPathContext` so tests (and embedding hosts) can redirect `managed-settings.json` resolution without writing to OS-level system directories.

### 4) Tests/validation run + results
- `bun test tests/phase15*` (pass)
- `bun test` (pass)
- `node scripts/check-import-boundaries.mjs` (pass)
- Legacy bundle commands:
  - `node bundles/ClaudeCodeCode/cli.js --version` (pass)
  - `node bundles/ClaudeAgentSDKCode/cli.js --version` (pass)
  - `node bundles/ClaudeCodeCode/cli.js --help` (pass; output suppressed)
  - `node bundles/ClaudeAgentSDKCode/cli.js --help` (pass; output suppressed)
  - `node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; output suppressed)
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeCodeCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
  - `node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; output suppressed)
  - `ENABLE_EXPERIMENTAL_MCP_CLI=1 node bundles/ClaudeAgentSDKCode/cli.js --mcp-cli --help` (pass; warns endpoint missing)
  - `node bundles/ClaudeCodeCode/cli.js --ripgrep --version` (expected fail: missing `ripgrep.node` in this repo snapshot)
  - `node bundles/ClaudeAgentSDKCode/cli.js --ripgrep --version` (expected fail: missing `ripgrep.node` in this repo snapshot)
- Auth probe:
  - `claude --dangerously-skip-permissions -p sayhello` (pass)
  - `bun src/cli.ts -p sayhello` (pass)

### 5) Remaining work inside Phase 15 (if any)
- Phase 15.6 cutover milestones remain unchecked in `implementation/1-initial-rewrite-implementation-checklist.md`.

### 6) Handoff notes for next phase
- If CLI arg-compatibility is addressed next, ensure legacy-style “pre-flags” like `--dangerously-skip-permissions -p ...` don’t fall through to interactive mode (currently `-p` must be `argv[0]` in `src/cli.ts`).
