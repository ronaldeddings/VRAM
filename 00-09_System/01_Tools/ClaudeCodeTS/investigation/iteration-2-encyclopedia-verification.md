# Iteration 2: Encyclopedia Verification

Goal: verify `CLI_ENCYCLOPEDIA.md` against the authoritative bundled CLIs (`bundles/*/cli.js`) and check what the TypeScript rewrite (`src/`) currently covers.

Authoritative inputs used:
- `bundles/ClaudeAgentSDKCode/cli.js` (contains `VERSION:"2.0.67"`)
- `bundles/ClaudeCodeCode/cli.js` (contains `VERSION:"2.0.69"`)
- `src/`
- `CLI_ENCYCLOPEDIA.md`
- Prior findings: `investigation/investigation-20251220-112837/iterations/iteration-1-output.md`

## Section-by-Section Audit

### How to read minified symbols (practical decoding rules)
- Encyclopedia says: bundled module patterns (`q(()=>{...})` init thunks, wrappers, interop helpers) and why names aren’t stable.
- CLI.js actually: both bundles use `var <X>=q(()=>{...})` module init thunks (e.g. around the MCP gates block) and wrappers like `var <X>=w((exports)=>{...})` plus interop like `o(KA(),1)`.
- TypeScript has: N/A (documentation/strategy).
- Accuracy: ✅ ACCURATE

### Canonicalization strategy for the TS rewrite
- Encyclopedia says: prefer behavioral canonical names and keep a mapping (build symbol ↔ canonical TS).
- CLI.js actually: minified symbol differences across 2.0.67/2.0.69 are real and pervasive; mapping-by-behavior is necessary.
- TypeScript has: partial “canonicalization” infrastructure in places (e.g. legacy tool name mapping via `src/core/migration/toolMapping.ts`), but no universal symbol map is enforced.
- Accuracy: ⚠️ PARTIAL (strategy is sound; repo-wide mapping discipline is not fully realized yet)

### TS rewrite notes (this repo)
- Encyclopedia says: `-p/--prompt` mimics Claude Code OAuth request shape (Bearer token UA/betas, avoid `/v1/messages?beta=true`), and OAuth refresh / OAuth→API-key exchange exist but are gated.
- CLI.js actually: this section is TS-specific; it doesn’t claim CLI.js behavior beyond request-shape constraints.
- TypeScript has: implemented in `src/cli/prompt.ts` (Bearer auth for OAuth, UA `claude-cli/<version> (external, <entrypoint>...)`, sets `anthropic-beta` including `claude-code-20250219` + `oauth-2025-04-20`, avoids SDK beta endpoint; refresh/exchange gated by `CLAUDE_TS_ENABLE_OAUTH_REFRESH` / `CLAUDE_TS_ENABLE_OAUTH_API_KEY_EXCHANGE`).
- Accuracy: ✅ ACCURATE

### Chapter 1 — MCP CLI (internal `--mcp-cli` tool)
- Encyclopedia says: internal `--mcp-cli` mode; endpoint vs state-file mode; lists/calls/tools/resources.
- CLI.js actually: `--mcp-cli` entry exists in both bundles’ bootstrap (`dD5`/`XF5`) and contains endpoint + state-file logic.
- TypeScript has: implemented as `--mcp-cli` in `src/cli.ts` and `src/cli/mcpCli.ts`, but with reduced parity (notably missing direct-connect call/read).
- Accuracy: ⚠️ PARTIAL

### 1.1 Feature gates & timeouts
- Encyclopedia says: `MCP_TOOL_TIMEOUT` env var; experimental gate `ENABLE_EXPERIMENTAL_MCP_CLI`; endpoint gate `ENABLE_MCP_CLI_ENDPOINT` (explicit false strings disable).
- CLI.js actually: 2.0.67 defines `function KAA(){ return parseInt(process.env.MCP_TOOL_TIMEOUT||"",10)||wK5 }`, `hZ()` checks `ENABLE_EXPERIMENTAL_MCP_CLI`, `_XA()` combines with explicit-false parsing for `ENABLE_MCP_CLI_ENDPOINT`; 2.0.69 mirrors via `se/uZ/_n` (definition vs usage is split across different line anchors in the encyclopedia).
- TypeScript has: `computeMcpCliGateSnapshotFromEnv` in `src/core/settings/effectiveConfig.ts` + `runMcpCli` fallback timeout `100_000_000` in `src/cli/mcpCli.ts`.
- Accuracy: ✅ ACCURATE

### 1.2 Endpoint discovery & mode selection
- Encyclopedia says: memoized endpoint config loader, endpoint-mode predicate, and a warn-once when endpoint allowed but config missing.
- CLI.js actually: both bundles memoize endpoint config (`Uu2/qm2`) and gate endpoint-mode (`lH/mH`) with a warning when config is missing.
- TypeScript has: endpoint config provider + caching via `createMcpEndpointConfigProvider` (`src/core/mcp/client.ts`), and warn-once behavior exists but message is generic (does not include the legacy endpoint-file path + session id).
- Accuracy: ⚠️ PARTIAL (TS warning behavior differs; CLI.js description matches)

### 1.3 Error types
- Encyclopedia says: `ConnectionFailedError` thrown when MCP connection isn’t established/connected.
- CLI.js actually: both bundles define `class VjA/ZjA extends Error { name="ConnectionFailedError" }`.
- TypeScript has: `ConnectionFailedError` implemented as an `McpError` subclass in `src/core/mcp/errors.ts`.
- Accuracy: ✅ ACCURATE

### 1.4 Analytics wrapper for MCP CLI commands
- Encyclopedia says: wrapper measures `duration_ms`, emits `tengu_mcp_cli_command_executed`, wraps success/failure.
- CLI.js actually: both builds have `EjA/YjA` wrappers and emit `tengu_mcp_cli_command_executed`.
- TypeScript has: `withTelemetry(...)` wrapper in `src/cli/mcpCli.ts` and telemetry plumbing in `src/core/observability/telemetry.ts`.
- Accuracy: ✅ ACCURATE

### 1.5 State file access & name normalization
- Encyclopedia says: legacy state file lives under an OS tmpdir path keyed by session id; name normalization used to map `mcp__<server>__<tool>` names.
- CLI.js actually: both builds read legacy session state and normalize server/tool identifiers (server-level prefixes and `mcp__...` name parsing).
- TypeScript has: legacy state reader + legacy directory logic in `src/cli/mcpCli.ts`, plus normalization/mapping helpers (`src/core/migration/toolMapping.ts`, `src/core/tools/names.ts`).
- Accuracy: ✅ ACCURATE

### 1.6 Endpoint HTTP client (`/mcp`)
- Encyclopedia says: endpoint calls POST `${endpoint.url}/mcp`, `Authorization: Bearer <key>`, robust error normalization, parses schema.
- CLI.js actually: both bundles implement `/mcp` endpoint POST and map network/status errors into typed errors (names set from returned `{ type }` when present).
- TypeScript has: `callMcpEndpoint(...)` in `src/core/mcp/endpointTransport.ts` (fetch-based, validates request/response envelopes, maps HTTP status into `AuthFailedError`/`RateLimitedError`/`ConnectionFailedError`/`ProtocolError`).
- Accuracy: ✅ ACCURATE

### 1.7 Direct-connect tool invocation (state-file mode)
- Encyclopedia says: state-file mode can directly connect and call tools/read resources when endpoint mode isn’t used (`LV5/pE5`, etc.).
- CLI.js actually: both bundles implement state-file-mode direct connects and can `tools/call` and `readResource` via connected clients.
- TypeScript has: **not implemented** (TS `--mcp-cli` help explicitly says `call`/`read` are endpoint-only; state-file mode only supports listing/grep).
- Accuracy: ⚠️ PARTIAL (encyclopedia matches CLI.js; TS coverage missing)

### 1.8 CLI command group and subcommands (`commander`)
- Encyclopedia says: `commander` program with `servers/tools/info/call/grep/resources/read`, switching between endpoint and state-file modes.
- CLI.js actually: `mcp-cli` is built with commander and includes `info`, plus endpoint vs state-file switching.
- TypeScript has: implements `servers/tools/resources/grep/call/read` but **no `info` subcommand**, and TS uses manual arg parsing (not commander); state-file mode is reduced (no direct call/read/info).
- Accuracy: ⚠️ PARTIAL

### 1.9 `--mcp-cli` entry
- Encyclopedia says: wrapper initializes, parses args, flushes telemetry when not in endpoint mode.
- CLI.js actually: both builds have `wu2/Mm2` calling `parseAsync` with conditional telemetry flush.
- TypeScript has: entry exists via `src/cli.ts` dispatch → `runMcpCli`, and emits telemetry per command; explicit “flush at end” parity is not clearly replicated.
- Accuracy: ⚠️ PARTIAL

### Chapter 2 — Chrome Native Host message reader (length-prefixed stdin)
- Encyclopedia says: protocol is `<uint32le len><utf8 payload>`, max len 1,048,576, streaming reader class.
- CLI.js actually: both bundles set max to `1048576` and implement streaming buffer logic (`RV5` / `nE5`).
- TypeScript has: `MAX_NATIVE_MESSAGE_BYTES`, `nativeHostLog`, and `NativeHostReader` implemented in `src/platform/desktop/chromeNativeMessaging.ts` (plus `NativeHostWriter`).
- Accuracy: ✅ ACCURATE

### 2.1 Constants and logging
- Encyclopedia says: max payload size = 1,048,576; log prefix `[Claude Chrome Native Host]`.
- CLI.js actually: matches (`qu2/Rm2 = 1048576`, `OV5/iE5` prefix).
- TypeScript has: matches exactly (`src/platform/desktop/chromeNativeMessaging.ts`).
- Accuracy: ✅ ACCURATE

### 2.2 `class RV5` / `class nE5` — streaming length-prefixed reader
- Encyclopedia says: buffer accumulation, pending resolver, close-on-end/error; validates length and reads full frames.
- CLI.js actually: matches the described state machine (including invalid length handling).
- TypeScript has: matches behavior closely (with a minor difference: TS closes on invalid length and resolves null; bundle resolves null without necessarily closing stream).
- Accuracy: ✅ ACCURATE

### Chapter 3 — CLI bootstrap / fast paths
- Encyclopedia says: bootstrap fast-paths for `--version`, `--mcp-cli`, `--ripgrep`, else dynamic-import main.
- CLI.js actually: 2.0.67 `dD5()` and 2.0.69 `XF5()` implement exactly that decision tree.
- TypeScript has: `src/cli.ts` implements `--version`, `--mcp-cli`, `--ripgrep`, plus TS-only commands (`doctor`, `engine-only`, `--print-frame`, `-p/--prompt`); does not replicate all upstream flags (e.g., `--teleport`, `--remote`, etc.).
- Accuracy: ⚠️ PARTIAL

### 3.1 Entry function: `dD5()` vs `XF5()`
- Encyclopedia says: detailed order of checks and behavior of each fast path.
- CLI.js actually: matches (including `process.exit(await mainMcpCli(...))` and `process.exitCode = ripgrepMain(...)`).
- TypeScript has: conceptually similar, but the “main app” is a different TS engine (`runNodeCli`/Ink adapter) and upstream parity is incomplete.
- Accuracy: ⚠️ PARTIAL

### Chapter 4 — Permissions, rules, and tool approval
- Encyclopedia says: permission pipeline with modes + flattened rules + tool-specific checks + Bash special casing + rule persistence.
- CLI.js actually: permission parsing (`NL/IL`), explanation builder (`YK/JK`), Bash redirection parsing (`OT/UT`), and the decision/persist pipeline exist in both bundles.
- TypeScript has: substantial implementation in `src/core/permissions/*`, but not 1:1 (see 4.9).
- Accuracy: ⚠️ PARTIAL

### 4.1 Data model: `ToolPermissionContext`
- Encyclopedia says: stable, non-minified property names (mode + rule buckets + working dirs + bypass availability).
- CLI.js actually: the object shape uses stable field names as documented.
- TypeScript has: `ToolPermissionContext` and related unions in `src/core/permissions/types.ts`.
- Accuracy: ✅ ACCURATE

### 4.2 Rule syntax: `Tool(ruleContent)` and plain tool rules
- Encyclopedia says: simple regex parser and stringifier with no nested/escaped parentheses support.
- CLI.js actually: `NL/IL` are simple `^([^(]+)\\(([^)]+)\\)$` parsers; `X5/B5` are simple formatters.
- TypeScript has: `parsePermissionRuleString` and `formatPermissionRuleValue` in `src/core/permissions/rules.ts`.
- Accuracy: ✅ ACCURATE

### 4.3 Flattening rules across sources (precedence list)
- Encyclopedia says: merge/flatten allow/deny/ask sources using an explicit precedence list.
- CLI.js actually: both builds fold multiple source buckets into ordered rule lists (preference order matters for “first match”).
- TypeScript has: `LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE` + `flattenRules(...)` in `src/core/permissions/evaluate.ts`.
- Accuracy: ✅ ACCURATE

### 4.4 Matching rules to a tool (including MCP server-level rules)
- Encyclopedia says: tool name matches, plus MCP server-level match (`mcp__server__` matches all that server’s tools).
- CLI.js actually: bundle checks MCP name parts and allows server-level rules.
- TypeScript has: `parseMcpToolName` + `matchesToolName` in `src/core/permissions/rules.ts`.
- Accuracy: ✅ ACCURATE

### 4.5 First-match queries: find allow/deny/ask rules
- Encyclopedia says: “first match wins” queries for deny/ask/allow.
- CLI.js actually: permission checks short-circuit by rule order.
- TypeScript has: `findFirstPlainRule(...)` in `src/core/permissions/evaluate.ts`.
- Accuracy: ✅ ACCURATE

### 4.6 Content-keyed rules for a specific tool (domain/path/etc.)
- Encyclopedia says: index rules keyed by `ruleContent` for tool-specific checks (e.g. WebFetch domain).
- CLI.js actually: bundle builds per-tool keyed maps for some tools.
- TypeScript has: `buildContentRuleIndex(...)` in `src/core/permissions/evaluate.ts` (exact-tool-name + `ruleContent` keying).
- Accuracy: ✅ ACCURATE

### 4.7 Core decision function: tool permission gate
- Encyclopedia says: decision uses deny→ask→tool-specific→mode overrides→allow→default ask; has reasons for UI.
- CLI.js actually: bundle follows the same broad ordering and generates structured “why” reasons.
- TypeScript has: `decideToolInvocationPermission(...)` in `src/core/permissions/evaluate.ts` (mode overrides + deny/ask/allow + tool-specific check hooks).
- Accuracy: ✅ ACCURATE

### 4.8 Permission-denial messaging and “why are we asking?”
- Encyclopedia says: helper formats human-facing explanation strings by reason kind (rule/mode/sandbox override/etc.).
- CLI.js actually: `YK/JK` switch across reason types including redirection-aware summaries for Bash subcommands.
- TypeScript has: `formatPermissionExplanation(...)` and `formatPermissionModeLabel(...)` in `src/core/permissions/explain.ts`; also `PermissionPromptRequest.why` types exist (`src/core/permissions/types.ts`).
- Accuracy: ⚠️ PARTIAL (TS explanations exist, but upstream has more nuanced multi-operation summaries)

### 4.9 Bash redirection parsing used in permission reasoning
- Encyclopedia says: upstream tokenizes bash, tracks parentheses groups, detects many redirection shapes, returns `{ commandWithoutRedirections, redirections[] }`.
- CLI.js actually: upstream parsing is sophisticated (it operates on token streams, recognizes `>&`, pipes into redirection, process substitution, etc.).
- TypeScript has: `parseBashRedirections(...)` in `src/core/permissions/bash.ts`, but it is a much simpler whitespace tokenizer and only handles basic `>` / `>>` (and inline `2>file` forms). It does not match the upstream tokenizer/edge cases.
- Accuracy: ⚠️ PARTIAL (encyclopedia matches CLI.js; TS implementation is a simplification)

### 4.10 Applying permission updates to `ToolPermissionContext`
- Encyclopedia says: update variants (`setMode`, `add/replace/removeRules`, `add/removeDirectories`) + batch apply + persistence to specific settings scopes.
- CLI.js actually: bundle has update folding and persistence gating to user/project/local settings.
- TypeScript has: `applyPermissionUpdates(...)` in `src/core/permissions/updates.ts` and persistence via `persistPermissionUpdates(...)` in `src/core/permissions/persistence.ts` (with policy enforcement).
- Accuracy: ✅ ACCURATE

### Chapter 5 — Settings system (schema, merge, IO, watchers)
- Encyclopedia says: settings sources + paths + parsing/validation + merge + patch writes + watcher/subscription system.
- CLI.js actually: both bundles have this pipeline and treat settings as a core dependency.
- TypeScript has: implemented in `src/core/settings/*` with storage-based IO and subscription.
- Accuracy: ✅ ACCURATE

### 5.1 Settings sources (conceptual model)
- Encyclopedia says: file-backed (user/project/local/policy/flag) + overlays (cliArg/command/session).
- CLI.js actually: source keys match and are used in both settings and permissions.
- TypeScript has: `SettingsSource` unions and overlays in `src/core/settings/types.ts` and `src/core/settings/manager.ts`.
- Accuracy: ✅ ACCURATE

### 5.2 “Which sources are enabled?” (`allowedSettingSources`)
- Encyclopedia says: runtime allowed list + always includes policy+flag; parses CLI comma list.
- CLI.js actually: both builds compute enabled sources by de-duping allowed + adding policy/flag.
- TypeScript has: `parseEnabledSettingSourcesFlag(...)` + `computeEnabledFileSettingsSources(...)` in `src/core/settings/sources.ts`, and default allowed list in `src/core/settings/manager.ts`.
- Accuracy: ✅ ACCURATE

### 5.3 Paths: where each settings source lives
- Encyclopedia says: stable mapping; Windows policy dir is Program Files if exists else ProgramData; policy settings file is `managed-settings.json`.
- CLI.js actually: uses platform switches and existence checks for Windows policy dir; file names match.
- TypeScript has: path logic split across host + legacy paths:
  - config dir default is `~/.claude` in `src/platform/node/host.ts` (matches docs),
  - but Windows policy system dir in `src/core/settings/legacyPaths.ts` is simplified to always `C:\\\\ProgramData\\\\ClaudeCode` (missing the Program Files existence check described).
- Accuracy: ⚠️ PARTIAL (TS Windows policy-dir logic differs)

### 5.4 Reading + validating a single settings file
- Encyclopedia says: read JSON + validate against schema; report errors; corrupted-file handling exists.
- CLI.js actually: both bundles parse, validate, and include “corrupted config” backup/restore messaging paths.
- TypeScript has: storage-backed read + schema validation in `src/core/settings/storage.ts` and `src/core/settings/schema.ts` (file corruption backup UI parity is not implemented because TS stores settings in storage abstraction, not raw files).
- Accuracy: ⚠️ PARTIAL

### 5.5 Getting settings for a *source*: `uB(source)`
- Encyclopedia says: per-source getter used throughout the app.
- CLI.js actually: both builds have per-source accessors for settings fragments.
- TypeScript has: per-source snapshot via `SettingsManager.getEffective().perSource[...]` (`src/core/settings/manager.ts`).
- Accuracy: ✅ ACCURATE

### 5.6 Merging settings into “effective settings”
- Encyclopedia says: merge pipeline yields “effective settings” and errors.
- CLI.js actually: both builds merge across ordered sources and track errors.
- TypeScript has: merge via `mergeSettingsObjectsInOrder(...)` + manager recomputation (`src/core/settings/merge.ts`, `src/core/settings/manager.ts`).
- Accuracy: ✅ ACCURATE

### 5.7 Writing settings patches (partial updates)
- Encyclopedia says: partial updates/patch writes; atomic persistence; source gating.
- CLI.js actually: both builds apply partial updates and persist to destination.
- TypeScript has: `patchSource(...)` and `updateSource(...)` with internal-write suppression in `src/core/settings/manager.ts`, patch application in `src/core/settings/patch.ts`.
- Accuracy: ✅ ACCURATE

### 5.8 Watchers + subscriptions (`SF` / `NF`)
- Encyclopedia says: watcher/subscription system with internal-write suppression and app-side subscription.
- CLI.js actually: both builds have change notifications and React-side subscribers.
- TypeScript has: subscription via storage events + event bus in `src/core/settings/manager.ts`; React/Ink-side wiring is different from upstream but the “settings updated” events exist.
- Accuracy: ✅ ACCURATE

### Chapter 6 — Hooks subsystem (commands, prompts, agents)
- Encyclopedia says: hooks multiplexing (settings + plugin + session), matchers, streaming vs non-streaming execution, parsing outputs into effects.
- CLI.js actually: extensive hooks engine exists in both bundles (`gn/Ln` streaming generators, `hY0/XJ0`, matchers, command hooks).
- TypeScript has: substantial hooks system in `src/core/hooks/*` (matchers, runner, interpreter, tool pipeline hooks), but it is not yet wired into an end-to-end model/tool loop (see iteration-1 findings).
- Accuracy: ⚠️ PARTIAL

### Chapter 7 — AppState runtime + notifications (React/Ink state backbone)
- Encyclopedia says: AppState provider + notification queue semantics; defines priority/timeouts/invalidations.
- CLI.js actually: AppState + notifications exist (symbol maps and described queue semantics); deeper verification beyond spot-check is not completed in this iteration.
- TypeScript has: notification queue logic exists and matches the documented semantics (`src/core/state/notifications.ts`), but upstream’s React/Ink AppState provider architecture is not reproduced 1:1.
- Accuracy: ⚠️ PARTIAL

### Chapter 8 — Teleport + remote sessions (resume web sessions across machines)
- Encyclopedia says: teleport/remote session flows and key helpers; OAuth-only requirement.
- CLI.js actually: teleport UI/logic exists (e.g. `tengu_teleport_*` telemetry and resume UI components; symbol map entries appear in the bundle).
- TypeScript has: no teleport/remote session implementation found in `src/`.
- Accuracy: ⚠️ PARTIAL

### Chapter 9 — Main REPL UI (Ink/React root component)
- Encyclopedia says: main REPL UI root, tool-use context and UI overlays, worker/leader prompts, transcript hotkeys.
- CLI.js actually: REPL root exists and integrates tools/permissions/hooks; deeper verification beyond spot-check is not completed in this iteration.
- TypeScript has: TS has a CLI UI (`src/ui/*`) and engine scaffolding, but no upstream-equivalent main model loop/tool calling yet (per iteration-1).
- Accuracy: ⚠️ PARTIAL

### Chapter 10 — Session browser / resume picker UI
- Encyclopedia says: resume picker screen/list UI, cross-project helpers, and feature-gated tree browser.
- CLI.js actually: session browser UI exists (commands/components mentioned in the encyclopedia appear in the bundle).
- TypeScript has: no equivalent session browser UI found in `src/`.
- Accuracy: ⚠️ PARTIAL

### Chapter 11 — Slash commands (command objects + `/resume` deep dive)
- Encyclopedia says: command object “kinds”, `/resume` behavior, and plugin migration patterns (e.g. `/review` moved to marketplace plugin).
- CLI.js actually: slash command system is present and integrated into the REPL.
- TypeScript has: no upstream-equivalent slash command system found (TS has `src/core/commands/*`, but it is an internal engine command registry, not the REPL slash command UX).
- Accuracy: ⚠️ PARTIAL

### Chapter 12 — Update/install/doctor + embedded ripgrep
- Encyclopedia says: `update/install/doctor` commands and internal `--ripgrep` fast path.
- CLI.js actually: all exist (including `--ripgrep` in bootstrap).
- TypeScript has: `--ripgrep` exists (`src/cli/ripgrep.ts`) and `doctor` exists (`src/cli/doctor.ts`), but `update/install` parity is not implemented.
- Accuracy: ⚠️ PARTIAL

### Chapter 13 — Built-in background agents (Magic Docs + classifier + session memory + prompt suggestion)
- Encyclopedia says: Magic Docs agent (parses `# MAGIC DOC: ...`), session quality classifier, and shared helpers; provides bundle line anchors (~4543/4533, etc.).
- CLI.js actually: verified: both bundles contain the Magic Docs prompt text and `# MAGIC DOC` parsing logic at the referenced lines (e.g. 2.0.67 `tV5` at `cli.js:4543`, 2.0.69 `UD5` at `cli.js:4533`), plus the classifier helpers nearby.
- TypeScript has: no Magic Docs/classifier/session-memory/prompt-suggestion background agents found in `src/`.
- Accuracy: ⚠️ PARTIAL

### Next chapters (to expand)
- Encyclopedia says: roadmap of future chapters (git, plugin system, etc.).
- CLI.js actually: many additional subsystems exist (see “Undocumented Functionality Found”).
- TypeScript has: varies by subsystem; many are not yet implemented.
- Accuracy: ✅ ACCURATE

## Undocumented Functionality Found

The encyclopedia focuses on internal `--mcp-cli` and several core subsystems, but the bundles also expose major **user-facing** command groups that are not described as their own chapters yet.

Extracted from both bundles via `.command("...")` scan (unique command strings):

| Function/Class / CLI Surface | In CLI.js | In Encyclopedia | In TypeScript |
|------------------------------|-----------|-----------------|---------------|
| `claude mcp ...` (user-facing MCP management) incl. `serve`, `add*`, `remove`, `get`, `list`, `reset-project-choices` | ✅ | ❌ (only `--mcp-cli`) | ❌ |
| `claude plugin ...` (validate/install/update/enable/disable/uninstall) | ✅ | ❌ (plugin system mentioned, but not CLI commands) | ❌ |
| `claude marketplace ...` (add/list/update marketplaces) | ✅ | ❌ | ❌ |
| `claude setup-token` (long-lived token setup flow) | ✅ | ❌ | ❌ |

## Version Check

- Encyclopedia versions: 2.0.67, 2.0.69
- Actual bundle versions (matched via `rg -o 'VERSION:\"2\\.0\\.[0-9]+\"' bundles/*/cli.js`):
  - `bundles/ClaudeAgentSDKCode/cli.js`: `VERSION:"2.0.67"` (also contains `VERSION:"2.0.0"` in other embedded metadata)
  - `bundles/ClaudeCodeCode/cli.js`: `VERSION:"2.0.69"` (also contains `VERSION:"2.0.0"` in other embedded metadata)
- TypeScript version:
  - package version: `0.1.0` (`package.json`)
  - default upstream version used for UA shaping in `-p`: `2.0.69` (`src/cli/prompt.ts`, env override `CLAUDE_TS_UPSTREAM_CLAUDE_CLI_VERSION`)

## Encyclopedia Corrections Needed

1. Add a dedicated chapter for the **user-facing MCP management CLI** (`claude mcp ...`) to avoid confusion with the internal `--mcp-cli`.
2. Add a chapter for **marketplace + plugin CLI management** (`claude marketplace`, `claude plugin`) and `setup-token` (these are substantial and currently “invisible” in the encyclopedia headings).
3. Clarify in Chapter 1 that some 2.0.69 anchors (e.g. `cli.js:4750`) point to **usage sites** (e.g. `parseInt(...)||se()`) rather than the function definition site; this is accurate but easy to misread during verification.
4. In Chapter 5.3, note that Windows policy directory selection is “Program Files if exists else ProgramData” in the bundles; TS currently always uses ProgramData unless further logic is added.

## Missing TypeScript Coverage

1. Chapter 1 parity gaps: missing `info` command, missing state-file-mode direct connect for `call`/`read` (TS `--mcp-cli` restricts them to endpoint-only).
2. Chapter 4.9 parity gap: TS bash-redirection parser is a simplified tokenizer and does not match upstream edge cases.
3. Chapters 8–13: teleport/remote sessions, session browser/resume picker, slash commands UX, update/install plumbing, and background agents (Magic Docs/classifier/session memory/prompt suggestion) are not implemented in `src/`.
4. Undocumented bundle CLI surfaces: `claude mcp`, `claude marketplace`, `claude plugin`, `claude setup-token` are not implemented in `src/`.

