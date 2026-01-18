# CLI Encyclopedia (WIP) — Rebuilding `cli.js` into TypeScript

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

## How to read minified symbols (practical decoding rules)

You’ll repeatedly see the same “shapes”:

- `var X = q(() => { ... })` / `var X = L(() => { ... })`  
  Module initializer (“run-once” thunk). Calling `X()` runs one-time setup (registering constants, globals, etc.).

- `var w = (factory) => () => ( ... )`  
  A module wrapper returning a “require-like” function that caches `exports`.

- `o(KA(), 1)` (or similar)  
  Interop wrapper for default/named exports. The exact helper name differs per build.

Because of this, a “function list” of the whole bundle will include:

- generated bundler/runtime helpers
- third-party library internals
- Emscripten/WASM glue
- first-party product code

Only the last bucket is what you actually want to rewrite into maintainable TS.

---

## Canonicalization strategy for the TS rewrite

When two builds have different minified names, we pick a **canonical name by behavior** and maintain a mapping table:

- `ClaudeAgentSDKCode/cli.js:<line>` name
- `ClaudeCodeCode/cli.js:<line>` name
- canonical TS name (what we’ll implement)
- contracts: inputs/outputs/errors/side-effects

This avoids getting trapped in “uQ vs mQ” renaming.

---

## TS rewrite notes (this repo)

This encyclopedia primarily documents the legacy **bundled** CLIs, but a few integration gotchas are easy to rediscover while rebuilding subsystems.

### Non-interactive prompt mode (`-p/--prompt`) and Claude Code OAuth tokens

Claude Code OAuth session credentials (e.g. `CLAUDE_CODE_SESSION_ACCESS_TOKEN` / Keychain “credentials JSON”) are **not** regular API keys. If you send a “normal” Anthropic API request with these credentials, you can get:

- `400 invalid_request_error: "This credential is only authorized for use with Claude Code and cannot be used for other API requests."`

In this repo, `-p` is implemented to mimic Claude Code’s request shape for OAuth tokens:

- Uses `Authorization: Bearer <token>` (SDK `authToken`), not `x-api-key`
- Uses a Claude Code-like User-Agent: `claude-cli/<version> (external, sdk-cli)`
- Sends `anthropic-beta` including `claude-code-20250219` + `oauth-2025-04-20` (plus the usual Claude Code beta defaults)
- Calls the stable Messages endpoint (`/v1/messages`) rather than `/v1/messages?beta=true`
- For OAuth, sends the identifying system prompt as its own system block: `You are Claude Code, Anthropic's official CLI for Claude.`

Refresh and OAuth→API-key exchange exist as code paths but are intentionally gated behind env flags; do not enable them until the basic `-p` flow is validated.

Reference points in this repo:

- `src/cli/prompt.ts`
- `tests/phase12-cli-entrypoint.test.ts`

# Chapter 1 — MCP CLI (internal `--mcp-cli` tool)

This subsystem exposes an internal CLI mode (triggered by `--mcp-cli`) that can:

- list MCP servers
- list tools/resources
- grep tools
- fetch tool schema info
- call tools
- read resources

It can operate in two modes:

1. **Endpoint mode**: talk to a local HTTP endpoint exposed by a running Claude Code session.
2. **State-file mode**: read a JSON “state file” written by a running session, and (for some actions) create direct client connections.

## 1.1 Feature gates & timeouts

### `KAA()` / `se()` — MCP tool timeout default

- `ClaudeAgentSDKCode/cli.js:4401` defines `function KAA(){...}` (returns timeout)
- `ClaudeCodeCode/cli.js:4750` shows `parseInt(... ) || se()` (same role)

Behavior:

- Reads `process.env.MCP_TOOL_TIMEOUT` as an integer.
- Falls back to a very large default (`wK5=1e8` in 2.0.67), effectively “almost no timeout”.

Canonical TS:

- `getMcpToolTimeoutMs(): number`

### `hZ()` / `uZ()` — experimental MCP CLI flag

- `ClaudeAgentSDKCode/cli.js:4401` defines `function hZ(){ ... ENABLE_EXPERIMENTAL_MCP_CLI ... }`
- `ClaudeCodeCode/cli.js:4750` uses `if(uZ()&&A[0]==="--mcp-cli") ...`

Behavior:

- Returns true only when the experimental MCP CLI is enabled (`ENABLE_EXPERIMENTAL_MCP_CLI`).

Canonical TS:

- `isExperimentalMcpCliEnabled(): boolean`

### `_XA()` / `_n()` — whether MCP CLI endpoint is allowed

- `ClaudeAgentSDKCode/cli.js:4401` defines `function _XA(){return hZ()&&!Iz(process.env.ENABLE_MCP_CLI_ENDPOINT)}`
- `ClaudeCodeCode/cli.js:4750` defines `function mH(){let A=_n(),...}`; `_n()` is the build’s equivalent predicate.

Behavior:

- “Endpoint allowed” is true when:
  - experimental MCP CLI is enabled, and
  - `ENABLE_MCP_CLI_ENDPOINT` is not explicitly turned off (the `Iz()` helper treats `"0"`, `"false"`, `"off"` as explicit false).

Canonical TS:

- `isMcpCliEndpointAllowed(): boolean`

## 1.2 Endpoint discovery & mode selection

### `Uu2()` / `qm2()` — load cached MCP CLI endpoint config

- `ClaudeAgentSDKCode/cli.js:4760` defines `function Uu2(){ if(zJ0===void 0) zJ0=Cu2(); return zJ0 }`
- `ClaudeCodeCode/cli.js:4750` defines `function qm2(){ if(mJ0===void 0) mJ0=wm2(); return mJ0 }`

Behavior:

- Lazily computes and memoizes an “endpoint config” object or `null`.
- The actual loader (`Cu2()` / `wm2()`) is elsewhere; it likely reads an “endpoint file” or environment-driven configuration for an HTTP endpoint and bearer key.

Key insight:

- In the TS rewrite, the loader should be a single module with a stable interface (e.g., `loadMcpCliEndpoint(): { url: string; key: string } | null`).

Canonical TS:

- `getMcpCliEndpoint(): McpCliEndpoint | null` (memoized)

### `lH()` / `mH()` — “should use endpoint mode?”

- `ClaudeAgentSDKCode/cli.js:4760` defines `function lH(){ let A=_XA(), Q=Uu2(); ...; return A && Q!==null }`
- `ClaudeCodeCode/cli.js:4750` defines `function mH(){ let A=_n(), Q=qm2(); ...; return A && Q!==null }`

Behavior:

- Computes whether **endpoint mode** is active.
- Emits a one-time warning (via `console.error(...)`) if endpoint mode is allowed but the endpoint config is missing (falls back to state-file mode).
  - The warning includes:
    - endpoint file path (`$71()` / `O71()`)
    - session id (`NXA()` / `wXA()`)

Canonical TS:

- `shouldUseMcpCliEndpoint(): boolean`
- plus a small “warn once” helper.

## 1.3 Error types

### `class VjA` / `class ZjA` — `ConnectionFailedError`

- `ClaudeAgentSDKCode/cli.js:4760` defines `class VjA extends Error { name="ConnectionFailedError" }`
- `ClaudeCodeCode/cli.js:4750` defines `class ZjA extends Error { name="ConnectionFailedError" }`

Behavior:

- Thrown when an MCP connection cannot be established (or when a client is not in the `connected` state).

Canonical TS:

- `class ConnectionFailedError extends Error`

## 1.4 Analytics wrapper for MCP CLI commands

### `EjA(cmd, thunk, meta?, extraMeta?)` / `YjA(...)`

- `ClaudeAgentSDKCode/cli.js:4760` defines `async function EjA(A,Q,B,G){...}`
- `ClaudeCodeCode/cli.js:4750` defines `async function YjA(A,Q,B,G){...}`

Behavior:

- Measures `duration_ms`.
- Runs `await thunk()` and returns `{ success: true, data }`.
- On error:
  - prints `Error: <message>` to stderr
  - logs a telemetry event `tengu_mcp_cli_command_executed` unless endpoint mode is active
  - returns `{ success: false, error }`
- Metadata handling:
  - `meta` can be a function `(data) => extraFields` or an object of fields.
  - `extraMeta` is merged into telemetry in the error path.

Why telemetry is skipped in endpoint mode:

- In endpoint mode, the running Claude Code session likely logs telemetry centrally; double-logging from the client-side `--mcp-cli` process would be noisy.

Canonical TS:

- `runMcpCliCommand<T>(name: string, fn: () => Promise<T>, meta?: Meta, errorMeta?: Meta): Promise<Result<T>>`

## 1.5 State file access & name normalization

### `cn()` / `Tn()` — read MCP state JSON

- `ClaudeAgentSDKCode/cli.js:4760` defines `function cn(){ let A=i51(); ... JSON.parse(readFileSync(A)) }`
- `ClaudeCodeCode/cli.js:4750` defines `function Tn(){ let A=t51(); ... JSON.parse(readFileSync(A)) }`

Behavior:

- Computes a “state file path” (`i51()` / `t51()`).
- Throws a helpful error if the file does not exist:
  - includes session id
  - suggests “Is Claude Code running?”
- Parses JSON; throws a parsing error with path included.

Canonical TS:

- `readMcpStateFile(): McpState`

### `$u2(state, serverName)` / `Lm2(state, serverName)` — resolve server config

Behavior:

- Look up `state.configs[serverName]`.
- Else look up `state.normalizedNames[serverName]` and then `state.configs[normalizedName]`.

Canonical TS:

- `resolveServerConfig(state: McpState, server: string): McpServerConfig | undefined`

### `qV5(state, serverName)` / `cE5(state, serverName)` — resolve server resources

Behavior:

- Same logic as server config resolution but for `state.resources` which is keyed by server.
- Returns `[]` if not found.

Canonical TS:

- `resolveServerResources(state: McpState, server: string): McpResource[]`

### `UJ0("server/tool")` / `dJ0("server/tool")` — parse CLI identifiers

Behavior:

- Splits on `/`.
- Requires exactly 2 parts, non-empty.
- Throws with message: `Invalid tool identifier '<x>'. Expected format: <server>/<tool>`

Canonical TS:

- `parseServerToolRef(input: string): { server: string; tool: string }`

## 1.6 Endpoint HTTP client (`/mcp`)

### `wQA(schema, request, timeoutMs?)` / `KQA(schema, request, timeoutMs?)`

- `ClaudeAgentSDKCode/cli.js:4760` defines `async function wQA(A,Q,B=1e4){...}`
- `ClaudeCodeCode/cli.js:4750` defines `async function KQA(A,Q,B=1e4){...}`

Behavior:

- Loads endpoint (`Uu2()` / `qm2()`), throws if not enabled.
- Performs HTTP POST to `${endpoint.url}/mcp` with:
  - `Authorization: Bearer <endpoint.key>`
  - JSON body = `request`
- `validateStatus: () => true` so it can handle non-2xx manually.
- If status >= 400:
  - expects `Z.data` has `{ error, type }` shape
  - throws `Error(error || "HTTP ...")`
  - if `type` is present, sets `err.name = type`
- Normalizes common Axios errors:
  - `ECONNREFUSED` → “Connection refused…”
  - timeout → “Request timeout”
  - other Axios → “Network error: …”
- Parses successful payload through `schema.parse(...)` (Zod)

Canonical TS:

- `callMcpEndpoint<T>(schema: z.ZodType<T>, req: McpEndpointRequest, timeoutMs = 10_000): Promise<T>`

## 1.7 Direct-connect tool invocation (state-file mode)

### `LV5(tool, server, args, opts)` / `pE5(tool, server, args, opts)`

- `ClaudeAgentSDKCode/cli.js:4760` defines `async function LV5(A,Q,B,G){...}`
- `ClaudeCodeCode/cli.js:4750` defines `async function pE5(A,Q,B,G){...}`

Behavior (in order):

1. Read `state = cn()` / `Tn()`
2. Resolve server config via `$u2(state, server)` / `Lm2(state, server)`
3. Connect to server via `WAA(server, config)` / `re(server, config)`
4. If client is not `connected`, throw typed failure:
   - `$QA(server, client.type)` / `WQA(server, client.type)` returns a specialized error when possible
   - else throw `new ConnectionFailedError(...)`
5. Determine “actual tool name” to call:
   - Internal tool registry names look like `mcp__<normalizedServer>__<normalizedTool>`.
   - The state file appears to keep:
     - `tools`: array with `name` and possibly `originalToolName`/`originalMcpToolName`
   - So it maps `<server>/<tool>` from CLI input back to the “real” tool name to call on the server.
6. Execute request:
   - `client.request({ method:"tools/call", params:{ name, arguments: args } }, ...)`
7. Close client.

Canonical TS:

- `callMcpToolDirect(server: string, tool: string, args: unknown, opts: { timeoutMs: number; debug: boolean }): Promise<unknown>`

## 1.8 CLI command group and subcommands (`commander`)

The `mcp-cli` command object is constructed with `commander`:

- `ClaudeAgentSDKCode/cli.js:4760` shows `var pn=new E71().name("mcp-cli")...`
- `ClaudeCodeCode/cli.js:4750` shows `var jn=new U71().name("mcp-cli")...`

Subcommands observed in both builds:

- `servers` — list connected servers
- `tools [server]` — list tool names
- `info <server/tool>` — show description + input schema
- `call <server/tool> <args>` — invoke a tool with JSON args (or stdin when args is `-`)
- `grep <pattern>` — regex search across tool names and descriptions
- `resources [server]` — list resources
- `read <resource> [uri]` — read resource content

Each subcommand is wrapped with the analytics helper (`EjA` / `YjA`) and switches between endpoint mode and state-file mode.

Canonical TS:

- `buildMcpCliProgram(): commander.Command`
- `runMcpCli(argv: string[]): Promise<number>`

## 1.9 `--mcp-cli` entry

### `wu2(argv)` / `Mm2(argv)`

- `ClaudeAgentSDKCode/cli.js:4760` defines `async function wu2(A){...}`
- `ClaudeCodeCode/cli.js:4750` defines `async function Mm2(A){...}`

Behavior:

- Performs initialization (`oTA()` / `pTA()`), then starts telemetry flushing (`ug()` / `Hg()`) when not in endpoint mode.
- `await program.parseAsync(argv, { from:"user" })`
- On success returns 0; on error prints error and returns 1.
- Flushes telemetry on both paths (when not in endpoint mode).

Canonical TS:

- `async function mainMcpCli(argv: string[]): Promise<number>`

---

# Chapter 2 — Chrome Native Host message reader (length-prefixed stdin)

This is the small protocol used by Chrome native messaging:

- stdin sends: `<uint32le length><utf8-json payload>`
- repeated

## 2.1 Constants and logging

- `ClaudeAgentSDKCode/cli.js:4760` sets `qu2 = 1048576` (max payload size)
- `ClaudeCodeCode/cli.js:4750` sets `Rm2 = 1048576`

Log helpers:

- `OV5(msg, ...args)` / `iE5(msg, ...args)` writes:
  - `[Claude Chrome Native Host] <msg>`

Canonical TS:

- `const MAX_NATIVE_MESSAGE_BYTES = 1_048_576`
- `function nativeHostLog(...args: unknown[]): void`

## 2.2 `class RV5` / `class nE5` — streaming length-prefixed reader

Definition sites:

- `ClaudeAgentSDKCode/cli.js:4761` contains `class RV5`
- `ClaudeCodeCode/cli.js:4751` contains `class nE5`

State:

- `buffer: Buffer` accumulates unread bytes.
- `pendingResolve: ((value: string | null) => void) | null`
- `closed: boolean`

Constructor:

- Hooks stdin events:
  - `data`: append bytes to `buffer`, call `tryProcessMessage()`
  - `end`/`error`: mark closed; if a read is pending, resolve `null`

`tryProcessMessage()`:

- Only proceeds if a `read()` call is currently waiting (`pendingResolve` set).
- Needs at least 4 bytes for the length prefix.
- Reads `len = buffer.readUInt32LE(0)`.
  - if `len===0` or `len > MAX`: log “Invalid message length”; resolve `null`.
- Needs `4 + len` bytes buffered; otherwise waits for more data.
- Extracts JSON bytes, advances buffer, resolves the pending promise with UTF-8 string.

`async read()`:

- If already closed, returns `null`.
- If buffer already contains a full message, returns it immediately (no promise allocation).
- Else returns a promise that will be resolved by `tryProcessMessage()` when enough bytes arrive.

Canonical TS:

- `class NativeHostReader { read(): Promise<string | null> }`

---

# Chapter 3 — CLI bootstrap / fast paths

## 3.1 Entry function: `dD5()` vs `XF5()`

- `ClaudeAgentSDKCode/cli.js:4761` defines `async function dD5()`
- `ClaudeCodeCode/cli.js:4751` defines `async function XF5()`

Behavior:

1. `argv = process.argv.slice(2)`
2. Fast-path version:
   - If argv is exactly `["--version"]` or `["-v"]` or `["-V"]`, print banner and return.
3. MCP CLI mode:
   - If experimental MCP CLI enabled and `argv[0] === "--mcp-cli"`, then:
     - `process.exit(await mainMcpCli(argv.slice(1)))`
4. Embedded ripgrep:
   - If `argv[0] === "--ripgrep"`:
     - dynamic-import a `ripgrepMain` implementation
     - set `process.exitCode = ripgrepMain(argv.slice(1))`
     - return
5. Main app:
   - dynamic-import `main` and `await main()`

Canonical TS modules:

- `cli/entry.ts` should own this decision tree.
- `mcp/cli.ts` should own the `--mcp-cli` implementation.
- `tools/ripgrep.ts` should own `--ripgrep`.

---

#
# Chapter 4 — Permissions, rules, and tool approval

This is the core “should we allow this tool invocation?” pipeline. It combines:

- global/session permission *modes* (e.g. normal vs bypass)
- rule lists (allow/deny/ask) coming from multiple sources (session/user/project/local/policy/etc.)
- tool-specific permission checks (each tool can inspect its inputs and decide)
- special handling for Bash (sandboxing shortcut) and MCP tool grouping

Primary entrypoints:

- `ClaudeAgentSDKCode/cli.js:4322` — rule parsing + `QW5(...)` decision function
- `ClaudeCodeCode/cli.js:4312` — rule parsing + `LK5(...)` decision function

## 4.1 Data model: `ToolPermissionContext`

Default constructors:

- 2.0.67: `Uw = () => ({ ... })` at `ClaudeAgentSDKCode/cli.js:395`
- 2.0.69: `s$ = () => ({ ... })` at `ClaudeCodeCode/cli.js:396`

Shape (property names are not minified, so this is reliable):

- `mode: string`
  - default is `"default"`
  - other observed modes: `"bypassPermissions"`, `"plan"`, `"acceptEdits"`, `"dontAsk"`
  - elsewhere in the bundle, other tools use modes like `"acceptEdits"` (file write/edit auto-allow) — treat as a broader “permission mode” enum in the TS rewrite.
- `additionalWorkingDirectories: Map<string, { path: string; source: string }>`
  - dynamic expansion of the effective “allowed working dir set” beyond the project root.
- `alwaysAllowRules: Record<string, string[]>`
- `alwaysDenyRules: Record<string, string[]>`
- `alwaysAskRules: Record<string, string[]>`
  - each record is keyed by “destination/source” (examples seen: `"session"`, `"userSettings"`, `"projectSettings"`, `"localSettings"`).
  - each value is an array of **serialized rule strings** like:
    - `"Bash"` (tool-level rule)
    - `"Read(/some/path/**)"` (tool + ruleContent)
    - `"WebFetch(domain:example.com)"` (tool + ruleContent)
- `isBypassPermissionsModeAvailable: boolean`
  - default false; becomes true when policy/settings allow bypass mode for the session.

In TS, make this explicit:

```ts
type PermissionRuleBehavior = "allow" | "deny" | "ask";
type PermissionRuleSource = "session" | "userSettings" | "projectSettings" | "localSettings" | string;

type PermissionMode = "default" | "bypassPermissions" | "plan" | "acceptEdits" | string;

interface ToolPermissionContext {
  mode: PermissionMode;
  additionalWorkingDirectories: Map<string, { path: string; source: PermissionRuleSource }>;
  alwaysAllowRules: Record<PermissionRuleSource, string[]>;
  alwaysDenyRules: Record<PermissionRuleSource, string[]>;
  alwaysAskRules: Record<PermissionRuleSource, string[]>;
  isBypassPermissionsModeAvailable: boolean;
}
```

## 4.2 Rule syntax: `Tool(ruleContent)` and plain tool rules

### Parser: `NL(ruleString)` vs `IL(ruleString)`

- 2.0.67: `NL(A)` at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69: `IL(A)` at `ClaudeCodeCode/cli.js:4312`

Behavior:

- Accepts a serialized string rule.
- If it matches `^([^(]+)\(([^)]+)\)$` then:
  - `toolName = group[1]`
  - `ruleContent = group[2]` (string)
- Otherwise returns `{ toolName: ruleString }` with `ruleContent` absent.

This is intentionally simplistic:

- It does not handle nested parentheses.
- It does not handle escaping.

Canonical TS:

- `parsePermissionRuleString(rule: string): { toolName: string; ruleContent?: string }`

### Stringifier: `X5(ruleValue)` vs `B5(ruleValue)`

- 2.0.67: `X5(A)` at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69: `B5(A)` at `ClaudeCodeCode/cli.js:4312`

Behavior:

- If `ruleContent` exists, returns `${toolName}(${ruleContent})`.
- Else returns `toolName`.

Canonical TS:

- `formatPermissionRuleValue({ toolName, ruleContent }: RuleValue): string`

## 4.3 Flattening rules across sources (precedence list)

### `GXA(ctx)` / `AXA(ctx)` / `l81(ctx)`  (2.0.67)

All defined at `ClaudeAgentSDKCode/cli.js:4322`:

- `GXA(ctx)` → list of allow rules
- `AXA(ctx)` → list of deny rules
- `l81(ctx)` → list of ask rules

Each:

- iterates an array of sources `OY0` (not locally defined in the snippet)
- for each `source` in that list:
  - reads `ctx.alwaysAllowRules[source]` (or deny/ask equivalent)
  - maps each serialized string through `NL(...)`
  - outputs objects `{ source, ruleBehavior, ruleValue }`

### `GXA(ctx)` / `AXA(ctx)` / `r81(ctx)`  (2.0.69)

Same structure at `ClaudeCodeCode/cli.js:4312`, but uses `oY0` and `IL(...)`.

What is `OY0` / `oY0`?

- It’s the **rule-source precedence list** (sources checked in order).

Actual definitions (these are important for a TS rewrite because the order determines which rule “wins” when multiple sources match):

- 2.0.67: `OY0=[...wL,"cliArg","command","session"]` at `ClaudeAgentSDKCode/cli.js` (byte offset ~`9972890`)
- 2.0.69: `oY0=[...JL,"cliArg","command","session"]` at `ClaudeCodeCode/cli.js` (byte offset ~`9979286`)

Where `wL` / `JL` are the shared settings-sources list:

- 2.0.67: `wL=["userSettings","projectSettings","localSettings","flagSettings","policySettings"]` at `ClaudeAgentSDKCode/cli.js` (byte offset ~`4019467`)
- 2.0.69: `JL=["userSettings","projectSettings","localSettings","flagSettings","policySettings"]` at `ClaudeCodeCode/cli.js` (byte offset ~`4019440`)

So the effective rule source precedence order is:

1. `userSettings`
2. `projectSettings`
3. `localSettings`
4. `flagSettings`
5. `policySettings`
6. `cliArg`
7. `command`
8. `session`

Important behavioral implication:

- `GXA/AXA/l81` flatten sources in that order, and `qB0/LB0/MB0` choose the **first** matching rule via `.find(...)`. That means **earlier sources win** over later ones for plain tool rules.
- This ordering is somewhat surprising if you expect session rules to override persisted settings; document it exactly as implemented and decide in the TS rewrite whether to preserve or change it.

Canonical TS:

- `const PERMISSION_RULE_SOURCE_PRECEDENCE: PermissionRuleSource[] = [...]`

## 4.4 Matching rules to a tool (including MCP server-level rules)

### MCP tool name parser: `HV(name)` vs `KV(name)`

These helpers parse the internal `mcp__<server>__<tool?>` format:

- 2.0.67: `HV(A)` at `ClaudeAgentSDKCode/cli.js:4401`
- 2.0.69: `KV(A)` at `ClaudeCodeCode/cli.js:4412`

Behavior:

- Splits by `"__"`.
- If the prefix is not `"mcp"` or server missing → returns `null`.
- If the remainder is empty → `toolName` is `undefined`.
  - this matters because rules can target a whole server (`mcp__server__`) vs a single tool (`mcp__server__tool`).

Canonical TS:

- `parseMcpInternalToolName(name: string): { serverName: string; toolName?: string } | null`

### Rule matcher: `RY0(tool, rule)` vs `rY0(tool, rule)`

- 2.0.67: `RY0(A, Q)` at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69: `rY0(A, Q)` at `ClaudeCodeCode/cli.js:4312`

Behavior:

1. If the rule has `ruleContent` → returns false
   - i.e., this matcher is ONLY for “plain tool rules”, not content-keyed rules.
2. If `ruleValue.toolName === tool.name` → match
3. Else attempt MCP server-level match:
   - parse `ruleValue.toolName` and `tool.name` via `HV/KV`
   - rule matches if:
     - both parse as MCP, AND
     - rule targets only the server (`toolName` is `undefined`), AND
     - `serverName` matches.

This allows rules like:

- allow everything from server `"github"`:
  - ruleValue.toolName might be `mcp__github__`
  - tool invocation name might be `mcp__github__create_issue`

Canonical TS:

- `matchesPlainRule(toolInternalName: string, ruleToolName: string): boolean`

## 4.5 First-match queries: find allow/deny/ask rules

- 2.0.67:
  - `qB0(ctx, tool)` — first matching allow rule
  - `LB0(ctx, tool)` — first matching deny rule
  - `MB0(ctx, tool)` — first matching ask rule
  - all at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69:
  - `mB0`, `dB0`, `cB0` at `ClaudeCodeCode/cli.js:4312`

All three:

- build the flattened list (`GXA`/`AXA`/`r81`)
- return `find(...) || null` using `RY0/rY0`.

Canonical TS:

- `findFirstPlainRule(ctx, tool, behavior): Rule | null`

## 4.6 Content-keyed rules for a specific tool (domain/path/etc.)

Some tools (notably web/network and filesystem tools) want rules like:

- `WebFetch(domain:example.com)`
- `Read(/path/**)`

Those are implemented by building a lookup map for a specific tool name and behavior.

### `mU(ctx, toolDef, behavior)` / `jU(ctx, toolDef, behavior)`

- 2.0.67: `mU(A,Q,B){ return _Y0(A, Q.name, B) }` at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69: `jU(A,Q,B){ return sY0(A, Q.name, B) }` at `ClaudeCodeCode/cli.js:4312`

### `_Y0(ctx, toolName, behavior)` / `sY0(...)`

- 2.0.67: `_Y0(...)` at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69: `sY0(...)` at `ClaudeCodeCode/cli.js:4312`

Behavior:

- Builds a `Map<string, Rule>` keyed by `ruleContent`.
- It scans the flattened rule list for the selected behavior (allow/deny/ask) and keeps only:
  - rules where `ruleValue.toolName === toolName` AND `ruleValue.ruleContent` is defined
- Inserts into map with key = `ruleContent`.

Notes:

- If duplicates exist across sources, later inserts overwrite earlier ones. So precedence depends on the order of `OY0/oY0`.

Canonical TS:

- `buildContentRuleIndex(ctx, toolName, behavior): Map<string, Rule>`

## 4.7 Core decision function: tool permission gate

### `QW5(toolDef, rawInput, ctx, ...)` (2.0.67)

- Definition: `ClaudeAgentSDKCode/cli.js:4322`

### `LK5(toolDef, rawInput, ctx, ...)` (2.0.69)

- Definition: `ClaudeCodeCode/cli.js:4312`

Behavior (same structure in both builds):

0. If the request’s abort signal is aborted, throw an abort error (`FJ` / `UJ`).
1. Load current app state: `state = await ctx.getAppState()`.
2. Deny wins:
   - If there exists a matching *plain* deny rule for this tool (`LB0/dB0`) → return `{ behavior: "deny", decisionReason: { type:"rule", rule }, ... }`.
3. Ask rules next:
   - If there exists a matching *plain* ask rule (`MB0/cB0`) → return `{ behavior: "ask", ... }`
   - Special-case: if tool is Bash and sandboxing has “auto allow bash if sandboxed” enabled:
     - 2.0.67 checks `A.name===n9` with `n9="Bash"` at `ClaudeAgentSDKCode/cli.js:395`
     - 2.0.69 checks `A.name===e9` with `e9="Bash"` at `ClaudeCodeCode/cli.js:396`
     - and calls `NB.isSandboxingEnabled()` + `NB.isAutoAllowBashIfSandboxedEnabled()`
     - If those are true, the ask-rule is ignored (Bash can proceed).
4. Tool-specific permission check:
   - Parse input via `toolDef.inputSchema.parse(rawInput)`.
   - Call `await toolDef.checkPermissions(parsedInput, ctx)` which can return:
     - `deny`, `ask`, `allow`, or `passthrough` (pass to global logic)
   - If parsing/check throws, it is logged, and the decision continues with a default “passthrough” object.
5. If tool-specific returned `deny`, return it immediately.
6. If tool requires user interaction and the tool-specific decision is `ask`, keep `ask` (no mode override).
7. Mode override (global bypass):
   - Reload app state.
   - If `toolPermissionContext.mode === "bypassPermissions"` → allow.
   - If `mode === "plan"` AND `isBypassPermissionsModeAvailable` → allow.
8. Allow rules:
   - If there exists a matching *plain* allow rule (`qB0/mB0`) → allow.
9. Otherwise return whatever tool-specific `behavior` resolved to (commonly `ask` or `passthrough`).

Canonical TS:

- `decideToolInvocationPermission(toolDef, rawInput, ctx): Promise<PermissionDecision>`

## 4.8 Permission-denial messaging and “why are we asking?”

### `YK(toolName, reason)` vs `JK(toolName, reason)`

- 2.0.67: `YK(A,Q)` at `ClaudeAgentSDKCode/cli.js:4322`
- 2.0.69: `JK(A,Q)` at `ClaudeCodeCode/cli.js:4312`

Behavior:

- Produces a human-readable message explaining why approval is required, based on a discriminated union `reason.type`.
- Observed `type` values:
  - `"hook"` — hook blocked or requests approval
  - `"rule"` — rule from some source requires approval
  - `"subcommandResults"` — composite command; some parts require approval
    - for Bash, redirection stripping is applied via `OT/UT` (see §4.9)
  - `"permissionPromptTool"` — a “permission prompt tool” requires approval
  - `"sandboxOverride"` — user requested running outside sandbox
  - `"classifier"` — classifier requires approval
  - `"workingDir"` — outside allowed working dirs
  - `"mode"` — current mode requires approval
  - `"asyncAgent"` — async agent reason string
  - `"other"` — arbitrary reason string

It also references:

- `LG0/ pG0` which wraps a formatter (`ccA/dcA`) to describe the *source* of a rule (e.g., “user settings”, “project settings”, etc.).
- `Mf/Bf` which formats `mode` into a display string.

Canonical TS:

- `formatPermissionPrompt(toolCategory: "Bash" | "Read" | ..., reason: DecisionReason): string`

### Source label formatters: `ccA/nlQ/Vc` vs `dcA/TiQ/rd`

These are small but central for explainability (every permission prompt names the rule source).

2.0.67 definitions are in the “settings source helpers” area:

- `function ccA(source)` — lowercase label used in sentences, at `ClaudeAgentSDKCode/cli.js` (byte offset ~`4018110`)
- `function nlQ(source)` — Title Case label, same area
- `function Vc(source)` — very short-ish label for compact displays (“user”, “project”, “managed”), same area

2.0.69 equivalents:

- `function dcA(source)` — lowercase label, at `ClaudeCodeCode/cli.js` (byte offset ~`4018083`)
- `function TiQ(source)` — Title Case label
- `function rd(source)` — short label

Observed mapping (both builds):

- `"userSettings"` → `ccA/dcA`: `"user settings"`; `nlQ/TiQ`: `"User settings"`; `Vc/rd`: `"user"`
- `"projectSettings"` → `"shared project settings"`; `"Shared project settings"`; `"project"`
- `"localSettings"` → `"project local settings"`; `"Project local settings"`; `"project, gitignored"`
- `"flagSettings"` → `"command line arguments"`; `"Command line arguments"`; `"cli flag"`
- `"policySettings"` → `"enterprise managed settings"`; `"Enterprise managed settings"`; `"managed"`
- `"cliArg"` → `"CLI argument"`; `"CLI argument"`; (no `Vc/rd` case shown)
- `"command"` → `"command configuration"`; `"Command configuration"`; (no `Vc/rd` case shown)
- `"session"` → `"current session"`; `"Current session"`; (no `Vc/rd` case shown)

Canonical TS:

- `formatPermissionRuleSource(source: PermissionRuleSource, style: "sentence" | "title" | "short"): string`

### Permission-mode formatters: `Mf/HpA/ynQ/zS` vs `Bf/DpA/HaQ/gR`

These helpers support:

- showing the current mode in prompts (“Current permission mode (Plan Mode) …”)
- rendering a mode badge/icon in the UI/status line
- normalizing/validating the mode string

2.0.67 (near sandbox/UI helpers; byte offset ~`4145518`):

- `HpA(mode)` — normalizes known modes to themselves, unknown → `"default"`
- `Mf(mode)` — display label:
  - `"default"` → `"Default"`
  - `"plan"` → `"Plan Mode"`
  - `"acceptEdits"` → `"Accept edits"`
  - `"bypassPermissions"` → `"Bypass Permissions"`
  - `"dontAsk"` → `"Don't Ask"`
- `xnQ(mode)` — true when `mode` is `"default"` or `undefined`
- `ynQ(mode)` — returns icon text:
  - `"default"` → `""`
  - `"plan"` → `"⏸"`
  - `"acceptEdits"` → `"⏵⏵"`
  - `"bypassPermissions"` → `"⏵⏵"`
  - `"dontAsk"` → `"⏵⏵"`
- `zS(mode)` — maps mode → theme key (e.g. `"text"`, `"planMode"`, `"autoAccept"`, …)

2.0.69 equivalents (byte offset ~`4145526`):

- `DpA` (normalize), `Bf` (label), `DaQ` (is default), `HaQ` (icon), `gR` (theme key)

Canonical TS:

- `normalizePermissionMode(mode: string | undefined): PermissionMode`
- `formatPermissionMode(mode: PermissionMode): string`
- `getPermissionModeIcon(mode: PermissionMode): string`

## 4.9 Bash redirection parsing used in permission reasoning

When a “composite command” contains multiple operations, the permission prompt tries to show the meaningful parts without redirection noise.

Helper:

- `OT(command)` in 2.0.67 (`ClaudeAgentSDKCode/cli.js:4255`)
- `UT(command)` in 2.0.69 (`ClaudeCodeCode/cli.js:RU module in the OT/UT section`)

High-level behavior:

- Tokenizes a bash command using a shell tokenizer (`dI/mI`), tracking parentheses groups.
- Detects redirection patterns like:
  - `> file`
  - `>> file`
  - `>&2`
  - `1> file`, `2> file`
  - `cmd | > file` patterns
  - process substitutions / `<(...)`
- Produces:
  - `commandWithoutRedirections: string`
  - `redirections: Array<{ target: string; operator: ">" | ">>" }>` (plus possibly captured numeric fd variants)

In the permission prompt, the command that gets displayed may be:

- `commandWithoutRedirections` when redirections were present (so users approve based on “what it does”, not where it writes)

Canonical TS:

- `parseBashRedirections(command: string): { commandWithoutRedirections: string; redirections: Redirection[] }`

## 4.10 Applying permission updates to `ToolPermissionContext`

This is the “write-side” of the permission system: apply a list of updates and optionally persist them into settings files.

### Update types and state mutation (`aX` / `eI`)

- 2.0.67: `aX(current, update)` at `ClaudeAgentSDKCode/cli.js:395`
- 2.0.69: `eI(current, update)` at `ClaudeCodeCode/cli.js:396`

Observed update variants:

- `setMode`
- `addRules`
- `replaceRules`
- `removeRules`
- `addDirectories`
- `removeDirectories`

For rule updates:

- The update includes:
  - `behavior: "allow" | "deny" | "ask"`
  - `destination: string` (scope/source key)
  - `rules: RuleValue[]`
- The implementation stringifies `RuleValue` via `X5/B5` and stores into the corresponding `always*Rules[destination]` list.

For directories:

- Stored in `additionalWorkingDirectories` Map, with value `{ path, source: destination }`.

### Batch apply (`Uf` / `sk`)

- 2.0.67: `Uf(ctx, updates)` at `ClaudeAgentSDKCode/cli.js:395`
- 2.0.69: `sk(ctx, updates)` at `ClaudeCodeCode/cli.js:396`

Just folds `aX/eI` across the list.

### Persistence (`$f` / `eP`)

- 2.0.67: `$f(update)` at `ClaudeAgentSDKCode/cli.js:395`
- 2.0.69: `eP(update)` at `ClaudeCodeCode/cli.js:396`

Key behavior:

- Only persists if `destination` is one of:
  - `"localSettings"`, `"userSettings"`, `"projectSettings"`
  (2.0.67 uses `wCA()`, 2.0.69 uses `FCA()`)
- For rule updates:
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

# Chapter 5 — Settings system (schema, merge, IO, watchers)

This subsystem is the single biggest “hidden dependency” in the bundle. It provides:

- **settings sources** (user/project/local/policy/flag + non-file sources used by permissions)
- **file paths** for settings locations
- JSON parsing + schema validation
- a **merge strategy** to produce “effective settings”
- atomic writes for `settings.json` edits
- a file watcher + subscription mechanism so the UI/AppState can react to changes

It is not just “config”: it drives permissions, sandboxing, hooks, model selection, MCP approvals, etc.

This chapter documents the first-party settings pipeline. The Zod schema itself (`Pb`/`Jb`) is large; we treat it as a type-level dependency for TS rewrite (you’ll want to regenerate TS types from a schema source rather than reverse-engineering the bundled `Pb`/`Jb`).

## 5.1 Settings sources (conceptual model)

Across both builds you can identify these source keys (also used as permission rule sources in Chapter 4):

- File-backed sources:
  - `"userSettings"` — user-wide settings
  - `"projectSettings"` — shared project settings
  - `"localSettings"` — project-local, gitignored settings
  - `"policySettings"` — enterprise/managed settings (local file or remote)
  - `"flagSettings"` — settings loaded from a file path supplied via CLI flags
- Non-file sources (mainly for permissions):
  - `"cliArg"` — rules/settings derived from parsed CLI arguments
  - `"command"` — rules/settings derived from command configuration
  - `"session"` — in-memory session state (not persisted)

The UI labels/formatters for these sources are described in Chapter 4 (§4.8 “Source label formatters”).

## 5.2 “Which sources are enabled?” (`allowedSettingSources`)

There is a runtime global that controls which *user/project/local* settings are considered:

- 2.0.67:
  - `VK0()` returns `ZQ.allowedSettingSources` (global “allowed setting sources” list)
  - `EK0(list)` sets it
- 2.0.69:
  - `yK0()` returns `QQ.allowedSettingSources`
  - `vK0(list)` sets it

The effective “settings sources to read” list is then computed by:

- 2.0.67: `us()` (byte offset ~`4019235`)
- 2.0.69: `Os()` (byte offset ~`4019208`)

Behavior (both):

1. Start with `allowedSettingSources` (a list of source keys, typically some subset of `"userSettings"`, `"projectSettings"`, `"localSettings"`).
2. Always add `"policySettings"` and `"flagSettings"`.
3. Return a de-duplicated array.

There is also a parser for a comma-separated CLI argument to select sources:

- 2.0.67: `alQ(str)` parses `"user,project,local"` into `["userSettings","projectSettings","localSettings"]`
- 2.0.69: `jiQ(str)` same behavior

Canonical TS:

- `type SettingsSource = "userSettings" | "projectSettings" | "localSettings" | "policySettings" | "flagSettings" | "cliArg" | "command" | "session";`
- `getEnabledSettingsSources(): SettingsSource[]` (≈ `us`/`Os`)
- `parseEnabledSettingsSourcesFlag(input: string): ("userSettings"|"projectSettings"|"localSettings")[]` (≈ `alQ`/`jiQ`)

## 5.3 Paths: where each settings source lives

In both builds, the mapping from source → file path is explicit and stable.

### Policy settings path (managed settings)

- 2.0.67:
  - `VM = Z0(() => platformSwitch(...))` in `gB` module (see `ClaudeAgentSDKCode/cli.js:4401`)
  - `ig2()` returns `join(VM(), "managed-settings.json")`
- 2.0.69:
  - `sL = Z0(() => platformSwitch(...))` in `jB` module (see `ClaudeCodeCode/cli.js:4391`)
  - `ru2()` returns `join(sL(), "managed-settings.json")`

The platform defaults are:

- macOS: `"/Library/Application Support/ClaudeCode"`
- Windows: `"C:\\Program Files\\ClaudeCode"` if it exists, else `"C:\\ProgramData\\ClaudeCode"`
- Linux/other: `"/etc/claude-code"`

### Per-source base directories

- 2.0.67: `J71(source)` at `ClaudeAgentSDKCode/cli.js:4400`
- 2.0.69: `E71(source)` at `ClaudeCodeCode/cli.js:4390`

Behavior:

- `"userSettings"` base dir = resolved config dir (`uQ()` / `mQ()`) → usually `~/.claude`
- `"projectSettings"` / `"localSettings"` / `"policySettings"` base dir = resolved project root (`cQ()` / `pQ()`)
  - note: for `"policySettings"` this is only used for some relative computations; the actual file is `managed-settings.json` in the system directory above
- `"flagSettings"` base dir = directory of the flag-provided settings file (`MPA()` / `NPA()`), if any; else project root

### Per-source settings file paths

- 2.0.67: `xF(source)` + `sTA(source)` at `ClaudeAgentSDKCode/cli.js:4400`
- 2.0.69: `qF(source)` + `iTA(source)` at `ClaudeCodeCode/cli.js:4390`

Behavior:

- `"userSettings"` → `<configDir>/settings.json`
- `"projectSettings"` → `<projectRoot>/.claude/settings.json`
- `"localSettings"` → `<projectRoot>/.claude/settings.local.json`
- `"policySettings"` → `<systemDir>/managed-settings.json`
- `"flagSettings"` → the exact file path passed from CLI (`MPA()` / `NPA()`)

Canonical TS:

- `getSettingsFilePath(source: FileBackedSettingsSource): string | null`
- `getSettingsBaseDir(source: FileBackedSettingsSource): string`

## 5.4 Reading + validating a single settings file

### File reader: `tY0(path)` vs `qJ0(path)`

- 2.0.67: `tY0(filePath)` at `ClaudeAgentSDKCode/cli.js:4400`
- 2.0.69: `qJ0(filePath)` at `ClaudeCodeCode/cli.js:4390`

Returns `{ settings: object | null, errors: ValidationError[] }`.

Behavior:

1. If file does not exist → `{ settings:null, errors:[] }`
2. Resolve symlinks (via `yI/gI` helpers) and read file content (`_E/wE`).
3. If file content is empty/whitespace → treat as `{}` (valid empty settings).
4. Parse JSON (`d8/h8`).
5. Validate against Zod schema (`Pb/Jb`):
   - success → `{ settings: parsed, errors:[] }`
   - failure → `{ settings:null, errors: <converted zod issues> }`
6. On read/IO errors:
   - logs the error (and special-cases broken symlinks for `settings.json`)
   - returns `{ settings:null, errors:[] }` (note: IO errors are logged but not surfaced as structured errors here)

Supporting helpers:

- 2.0.67: `CK5(err, filePath)` logs broken symlink vs generic errors
- 2.0.69: `bV5(err, filePath)` same

Schema URL constant:

- 2.0.67: `olQ="https://json.schemastore.org/claude-code-settings.json"`
- 2.0.69: `PiQ="https://json.schemastore.org/claude-code-settings.json"`

Canonical TS:

- `readAndValidateSettingsFile(path: string): { settings: ClaudeCodeSettings | null; errors: SettingsError[] }`

## 5.5 Getting settings for a *source*: `uB(source)`

- Name is stable in both builds: `uB(source)` (see `ClaudeAgentSDKCode/cli.js:4400` and `ClaudeCodeCode/cli.js:4390`)

Behavior:

- For `"policySettings"`:
  - If a remote/managed settings object exists (`ee1()` / `zA0()`), return it (only when non-empty).
  - Otherwise fall back to reading `managed-settings.json`.
- For other file-backed sources:
  - Resolve file path via `xF/qF`.
  - Return `settings` from `tY0/qJ0`, or `null` if missing/invalid.

Companion helper:

- 2.0.67: `rS2()` returns `"remote" | "local" | null` for policy settings origin
- 2.0.69: `nx2()` same

Canonical TS:

- `getSettingsForSource(source: FileBackedSettingsSource): ClaudeCodeSettings | null`

## 5.6 Merging settings into “effective settings”

### Merge semantics

When multiple sources are enabled, the code merges settings objects with:

- deep merge for objects
- *array union* for arrays (deduplicate, preserve insertion order)
- an explicit “delete on undefined” behavior when applying patches (see §5.7)

Array union helper:

- 2.0.67: `zK5(arr1, arr2)` (unique union), and `pg2(a,b)` which applies it when both are arrays
- 2.0.69: `hV5(arr1, arr2)` + `au2(a,b)`

### Recompute merged settings: `UK5()` vs `gV5()`

- 2.0.67: `UK5()` at `ClaudeAgentSDKCode/cli.js:4401`
- 2.0.69: `gV5()` at `ClaudeCodeCode/cli.js:4391`

Returns `{ settings: object, errors: SettingsError[] }`.

Behavior (both builds; names differ):

1. Guard against re-entrancy with a boolean (`sY0` / `NJ0`).
2. Initialize:
   - `settings = {}`
   - `errors = []`
   - `dedupeErrors = new Set()` keyed by `"file:path:message"`
   - `dedupePaths = new Set()` keyed by resolved absolute path (prevents reading the same file twice)
3. Iterate enabled sources `us()/Os()`:
   - If source is `"policySettings"`:
     - merge in `uB("policySettings")` if present, and continue
   - Otherwise:
     - compute file path `xF/qF(source)`
     - skip if no file path (non-file sources)
     - resolve absolute path and skip if already seen
     - call `tY0/qJ0(filePath)` to read + validate
     - append structured errors, deduping
     - merge `settings` with that file’s `settings` if present
4. Append additional config errors from other subsystems:
   - `["user","project","local"].flatMap((scope) => AX(scope).errors)` (2.0.67)
   - `["user","project","local"].flatMap((scope) => JX(scope).errors)` (2.0.69)
5. Return `{ settings, errors }`.

### Cached getter: `CQ()` vs `NQ()`

These are the canonical accessors used throughout the rest of the bundle (sandbox, hooks, MCP approvals, etc.):

- 2.0.67:
  - `dV()` returns merged settings object (or `{}` if missing)
  - `Gy()` memoizes the `{settings, errors}` result in `ZjA`
  - module init `gB` assigns `CQ=dV` (see `ClaudeAgentSDKCode/cli.js:4401`)
- 2.0.69:
  - `R7()` returns merged settings object
  - `px()` memoizes the `{settings, errors}` result in `eTA`
  - module init `jB` assigns `NQ=R7` (see `ClaudeCodeCode/cli.js:4391`)

Cache invalidation:

- 2.0.67: `hR()` sets `ZjA=null`
- 2.0.69: `TR()` sets `eTA=null`

Canonical TS:

- `getEffectiveSettings(): ClaudeCodeSettings` (≈ `CQ` / `NQ`)
- `getEffectiveSettingsWithErrors(): { settings: ClaudeCodeSettings; errors: SettingsError[] }` (≈ `Gy`/`px`)
- `invalidateSettingsCache(): void` (≈ `hR` / `TR`)

## 5.7 Writing settings patches (partial updates)

### Atomic write helper: `KM` vs `rL`

- 2.0.67: `KM(path, content, opts?)` at `ClaudeAgentSDKCode/cli.js:4400`
- 2.0.69: `rL(path, content, opts?)` at `ClaudeCodeCode/cli.js:4390`

Behavior:

- Writes to `<path>.tmp.<pid>.<timestamp>` first, then renames over the target (atomic on most filesystems).
- Preserves original file mode if overwriting an existing file.
- Falls back to direct write if the atomic path fails.
- Writes “through symlink”:
  - if the target path is a symlink, it tries to resolve it and write to the resolved path.

### “Apply patch to settings file” function: `X2(source, patch)` vs `E2(source, patch)`

- 2.0.67: `X2(source, patch)` at `ClaudeAgentSDKCode/cli.js:4400`
- 2.0.69: `E2(source, patch)` at `ClaudeCodeCode/cli.js:4390`

Behavior:

1. No-op for read-only sources:
   - if `source === "policySettings" || source === "flagSettings"` → `{ error:null }`
2. Resolve the file path (`xF/qF`) and create the parent directory if needed.
3. Load current settings object:
   - Prefer validated `uB(source)`
   - If validation failed but JSON is parseable:
     - read raw file and JSON-parse it
     - use the raw object as the base
     - log `Using raw settings from <file> due to validation failure`
   - If JSON syntax is invalid → return `{ error: Error("Invalid JSON syntax ...") }`
4. Merge the patch into the base object using a deep-merge helper (`dPA/gPA`) with a customizer:
   - if patch value is `undefined`, delete that key from the destination object
   - if patch value is an array, replace/merge using array behavior rather than element-wise object merge
5. Mark the write as internal so the watcher can ignore it:
   - 2.0.67: `SF.markInternalWrite(source)`
   - 2.0.69: `NF.markInternalWrite(source)`
6. Write JSON with indentation + trailing newline via atomic writer.
7. Invalidate the effective-settings cache (`hR/TR`).
8. Special-case for `"localSettings"`:
   - 2.0.67: `G80(sTA("localSettings"), cQ())`
   - 2.0.69: `q80(iTA("localSettings"), pQ())`
   This looks like a “ensure local settings file is gitignored / tracked correctly” side-effect.

Canonical TS:

- `updateSettingsFile(source: WritableSettingsSource, patch: DeepPartial<ClaudeCodeSettings>): { error: Error | null }`

## 5.8 Watchers + subscriptions (`SF` / `NF`)

The settings system exposes a small event bus so other systems can react to settings changes.

### Public interface

- 2.0.67: `SF={ initialize: Lt3, dispose: elQ, subscribe: Mt3, markInternalWrite: Ot3, notifyChange: jt3 }` at `ClaudeAgentSDKCode/cli.js` (byte offset ~`4020857`)
- 2.0.69: `NF={ initialize: se6, dispose: viQ, subscribe: te6, markInternalWrite: ee6, notifyChange: GA3 }` at `ClaudeCodeCode/cli.js` (byte offset ~`4020830`)

### Watch initialization: `Lt3()` vs `se6()`

Behavior:

- Builds a list of watched settings files (via `Rt3()` / `AA3()`; includes `settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, plus policy/flag locations as available).
- Starts a filesystem watcher with:
  - ignore `.git`
  - `ignoreInitial: true`
  - `awaitWriteFinish` stabilization
- Emits `Detected change to <path>` and notifies subscribers.

### Internal write suppression

The watcher maintains a `Map<filePath, timestamp>`:

- 2.0.67: `pcA`
- 2.0.69: `ccA`

When a change event arrives, it checks:

- if the file was recently written by the process (within a TTL like `qt3/re6`), it suppresses emitting to subscribers.

This prevents infinite loops:

- `X2/E2` writes settings → watcher sees change → subscriber recomputes settings → subscriber triggers more writes.

### Mapping paths back to sources

- 2.0.67: `AiQ(path)` returns the source key by searching `wL.find((src) => xF(src) === path)`
- 2.0.69: `kiQ(path)` uses `JL` and `qF`

### Subscription usage in the app

There is a React-side hook that listens for changes and updates AppState:

- 2.0.67: `I8A(callback)` calls `hR()` then `CQ()` before invoking the callback
- 2.0.69: `V8A(callback)` calls `TR()` then `NQ()`

Canonical TS:

- `interface SettingsEvents { subscribe(cb: (source: SettingsSource, effective: ClaudeCodeSettings) => void): Unsubscribe; markInternalWrite(source: WritableSettingsSource): void; notifyChange(source: SettingsSource): void }`
- `initializeSettingsWatcher(): void`

---

## Chapter 6 — Hooks subsystem (commands, prompts, agents)

This chapter documents the **Hooks** system: user-/project-/local-/policy-/plugin-configured “callbacks” that run at specific lifecycle events (pre-tool, post-tool, stop, etc.).

High-level: hooks are a **multiplexer + executor**:

1. Build a `hookInput` object (base fields + event-specific fields).
2. Select matching hook definitions for this event (from settings + plugin hooks + session hooks).
3. Execute each hook in order, yielding progress messages in the REPL UI.
4. Parse hook output (plain text vs structured JSON).
5. Convert output into standardized effects: block/allow/ask, updated tool input, extra transcript context, stop reasons, etc.

There are two execution “modes”:

- **REPL streaming mode**: yields progress messages (`hook_progress`, `hook_success`, `hook_non_blocking_error`, `hook_blocking_error`) as the hook runs.
  - 2.0.67: `gn(...)` (async generator)
  - 2.0.69: `Ln(...)` (async generator)
- **Outside-REPL mode** (non-streaming): returns an array of results (used by `SessionEnd`, `Notification`, `PreCompact`, status line, etc.).
  - 2.0.67: `hY0(...)`
  - 2.0.69: `XJ0(...)`

### 6.1 Symbol map (2.0.67 vs 2.0.69)

Top-level exports:

- 2.0.67: `var $g2={}; FG($g2,{ ... })` at `ClaudeAgentSDKCode/cli.js:4347`
- 2.0.69: `var Lu2={}; EG(Lu2,{ ... })` at `ClaudeCodeCode/cli.js:4337`

Core engine:

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Workspace trust gating | `Cg2()` | `wu2()` |
| Base hook input builder | `JD(permissionMode, sessionId?)` | `sE(permissionMode, sessionId?)` |
| Hook output parser (stdout → `{json|plainText}`) | `zg2(stdout)` | `Nu2(stdout)` |
| Hook output interpreter (JSON → effects + transcript message) | `Ug2(...)` | `qu2(...)` |
| Execute hook command via shell + stdin JSON | `e51(...)` | `Y71(...)` |
| Streaming executor (REPL) | `gn(...)` | `Ln(...)` |
| Non-streaming executor | `hY0(...)` | `XJ0(...)` |
| Hook matcher aggregator (settings + plugin + session) | `$W5(appState?)` | `mK5(appState?)` |
| Event matcher (tool/source/type → command list) | `bY0(appState?, event, input)` | `IJ0(appState?, event, input)` |
| Matcher predicate (regex / `a|b|c` / wildcard) | `UW5(query, matcher)` | `uK5(query, matcher)` |
| `$ARGUMENTS` prompt templating | `t51(prompt, args)` | `Z71(prompt, args)` |
| Abort-signal combiner | `ry(a, b?)` | `hy(a, b?)` |

Hook wrappers (exported APIs):

| Hook event | Purpose | 2.0.67 | 2.0.69 |
|---|---|---:|---:|
| `PreToolUse` | run before a tool executes | `executePreToolHooks: jQ0` | `executePreToolHooks: sQ0` |
| `PostToolUse` | run after successful tool use | `executePostToolHooks: PQ0` | `executePostToolHooks: tQ0` |
| `PostToolUseFailure` | run after tool error/interrupt | `executePostToolUseFailureHooks: SQ0` | `executePostToolUseFailureHooks: eQ0` |
| `PermissionRequest` | hook the permission prompt flow | `executePermissionRequestHooks: Z50` | `executePermissionRequestHooks: h50` |
| `Stop` / `SubagentStop` | run on stop request | `executeStopHooks: xQ0` | `executeStopHooks: AB0` |
| `UserPromptSubmit` | run on prompt submission | `executeUserPromptSubmitHooks: U50` | `executeUserPromptSubmitHooks: t50` |
| `SessionStart` | run when session begins | `executeSessionStartHooks: ra1` | `executeSessionStartHooks: Ho1` |
| `SessionEnd` | run when session ends | `executeSessionEndHooks: RG0` | `executeSessionEndHooks: nG0` |
| `SubagentStart` | run when a subagent begins | `executeSubagentStartHooks: h70` | `executeSubagentStartHooks: YG0` |
| `Notification` | run on notifications | `executeNotificationHooks: dA0` | `executeNotificationHooks: G10` |
| `PreCompact` | run before compaction | `executePreCompactHooks: Y10` | `executePreCompactHooks: R10` |
| `StatusLine` | compute status line lines | `executeStatusLineCommand: e60` | `executeStatusLineCommand: U80` |
| `FileSuggestion` | compute file suggestions | `executeFileSuggestionCommand: k60` | `executeFileSuggestionCommand: A80` |

Blocking-message formatters:

| Message | Meaning | 2.0.67 | 2.0.69 |
|---|---|---:|---:|
| “pre-tool hook blocked” | shown when a hook blocks tool execution | `_Q0(toolName, blockingError)` | `oQ0(toolName, blockingError)` |
| “stop hook feedback” | shown when stop hook blocks exit | `TQ0(blockingError)` | `rQ0(blockingError)` |
| “prompt submit blocked” | shown when submit hook blocks | `z50(blockingError)` | `s50(blockingError)` |

### 6.2 Hook config sources and precedence (settings + plugins + session hooks)

Hooks can come from three “layers”:

1. **Settings hooks**: from effective settings’ `hooks` field.
2. **Plugin hooks**: from plugins directory (`~/.claude/plugins/*/hooks/hooks.json`), merged in if policy allows.
3. **Session hooks**: temporary in-memory hooks stored in `AppState.sessionHooks`.

There is also a policy gate:

- If `policySettings.allowManagedHooksOnly === true`, the system uses **only** policy-managed hooks and excludes plugin hooks + user/project/local settings hooks.

#### 6.2.1 Effective hooks cache (settings hooks)

Both bundles maintain a normalized/sorted cached view of “effective hooks” (from settings/policy):

- 2.0.67:
  - `SY0()` chooses the hooks object:
    - if `uB("policySettings")?.allowManagedHooksOnly===!0` → `policySettings.hooks ?? {}`
    - else → `CQ().hooks ?? {}`
  - `xY0(hooks)` normalizes:
    - sorts event keys
    - sorts matchers (`matcher || ""`)
    - sorts hook commands inside each matcher via `uC(hook)` (human-readable representation)
  - `yY0()` initializes cache `hn = xY0(SY0())`
  - `jTA()` refreshes cache after settings writes
  - `wk2()` diffs cached vs current and returns a human-readable “hooks configuration changed” report
  - `Xg2()` returns cached hooks (initializing if needed)
  - Policy gate boolean: `YA1()`

- 2.0.69:
  - `QJ0()` chooses:
    - if `uB("policySettings")?.allowManagedHooksOnly===!0` → `policySettings.hooks ?? {}`
    - else → `NQ().hooks ?? {}`
  - `BJ0(hooks)` normalizes similarly (sorting matchers and hooks using `PC(hook)` stringification)
  - `GJ0()` initializes cache `qn = BJ0(QJ0())`
  - `MTA()` refreshes cache after settings writes
  - `Mf2()` diffs cached vs current and returns a summary
  - `Eu2()` returns cached hooks (initializing if needed)
  - Policy gate boolean: `GA1()`

Canonical TS:

```ts
type HookEventName =
  | "PreToolUse"
  | "PostToolUse"
  | "PostToolUseFailure"
  | "PermissionRequest"
  | "Stop"
  | "SubagentStop"
  | "UserPromptSubmit"
  | "SessionStart"
  | "SessionEnd"
  | "SubagentStart"
  | "Notification"
  | "PreCompact";

type HookMatcher = { matcher?: string; hooks: HookDefinition[] };
type HooksConfig = Partial<Record<HookEventName, HookMatcher[]>>;
```

#### 6.2.2 Plugin hooks

The matcher aggregator includes plugin hooks only when the policy does *not* enforce `allowManagedHooksOnly`.

- 2.0.67: `$W5(appState?)` calls `_PA()` to read plugin hooks if `!YA1()`
- 2.0.69: `mK5(appState?)` calls `MPA()` if `!GA1()`

These plugin hooks are treated as “additional matchers” for the same hook events.

Canonical TS:

```ts
type PluginHooks = HooksConfig; // same structural shape; different provenance
```

#### 6.2.3 Session hooks (in-memory, per-session)

Session hooks are stored in `AppState.sessionHooks[sessionId]` and can be added/cleared at runtime.

In 2.0.69, the core primitives are visible in one contiguous region:

- `MF8(setAppState, sessionId, event, matcher, hook, onHookSuccess?)` writes into `sessionHooks`
- `mMA(setAppState, sessionId, event, matcher, callback, errorMessage, opts?)` is a convenience that creates a `{type:"function", callback, timeout, ...}` hook and calls `MF8(...)`
- `TB1(appState, sessionId, event?)` returns a `Map<event, matchers>` for session hooks
  - note: it uses `WQ2(...)` to strip out `type:"function"` hooks before passing to matching/execution (function hooks are internal-only)
- `jB1(setAppState, sessionId)` clears all session hooks for that session

In 2.0.67, session hooks are referenced via the same `TB1(...)` name and cleared in `RG0(...)`:

- `RG0(reason, { setAppState })` calls `jB1(setAppState, W0())` after running `SessionEnd` hooks

The hook matcher aggregator merges session hooks last:

- 2.0.67: `$W5(appState?)`
- 2.0.69: `mK5(appState?)`

Canonical TS:

```ts
type SessionHooksState = Record<string /* sessionId */, { hooks: HooksConfig }>;
```

### 6.3 Hook matching: from (event,input) → concrete hook commands

The main selection function is:

- 2.0.67: `bY0(appState?, eventName, hookInput)`
- 2.0.69: `IJ0(appState?, eventName, hookInput)`

It works in four steps:

1. Build a merged map of hook matchers by event (`$W5` / `mK5`).
2. Determine a “match query” string depending on `hook_event_name`:
   - `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` → `tool_name`
   - `SessionStart` → `source`
   - `PreCompact` → `trigger`
   - `Notification` → `notification_type`
   - `SessionEnd` → `reason`
   - `SubagentStart` → `agent_type`
   - otherwise: no query (all hooks for that event run)
3. Filter matchers:
   - If there is no query, all matchers apply.
   - If query exists, a matcher applies if:
     - matcher is missing/empty, OR
     - `UW5/uK5(query, matcher)` returns true.
4. Flatten hooks and **dedupe**:
   - `command` hooks deduped by `command`
   - `prompt` hooks deduped by `prompt`
   - `agent` hooks deduped by `prompt([])` (stringified for empty args)
   - `callback` hooks are *not* deduped by key and are appended as-is

#### 6.3.1 Matchers: `UW5/uK5(query, matcher)`

Match syntax:

- `null` / `undefined` / empty matcher: matches all queries
- `"*"` matches all queries
- If matcher is alphanumeric + `_` + `|` only:
  - exact match allowed (`matcher === query`)
  - pipe means “one-of”: `"Read|Write|Bash"`
- Otherwise it is treated as a regex:
  - `new RegExp(matcher).test(query)`
  - invalid regex logs an error and returns false

Canonical TS:

```ts
function matchesHookMatcher(query: string, matcher?: string): boolean;
```

### 6.4 Hook input: what gets passed to hooks

Base hook input contains common context:

- 2.0.67: `JD(permissionMode, sessionId?)`
- 2.0.69: `sE(permissionMode, sessionId?)`

Both return:

```ts
{
  session_id: string;           // defaults to W0() (current session)
  transcript_path: string;      // yNA/hNA(sessionId)
  cwd: string;                  // r1/s1 (current working dir)
  permission_mode: PermissionMode | undefined;
}
```

Event-specific fields are layered on top by wrappers:

- `PreToolUse`: `{ hook_event_name:"PreToolUse", tool_name, tool_input, tool_use_id }`
- `PostToolUse`: `{ hook_event_name:"PostToolUse", tool_name, tool_input, tool_response, tool_use_id }`
- `PostToolUseFailure`: `{ hook_event_name:"PostToolUseFailure", tool_name, tool_input, tool_use_id, error, is_interrupt }`
- `PermissionRequest`: `{ hook_event_name:"PermissionRequest", tool_name, tool_input, permission_suggestions }`
- `Notification`: `{ hook_event_name:"Notification", message, title, notification_type }`
- `UserPromptSubmit`: `{ hook_event_name:"UserPromptSubmit", prompt }`
- `SessionStart`: `{ hook_event_name:"SessionStart", source }`
- `SessionEnd`: `{ hook_event_name:"SessionEnd", reason }`
- `SubagentStart`: `{ hook_event_name:"SubagentStart", agent_id, agent_type }`
- `Stop`: `{ hook_event_name:"Stop", stop_hook_active }`
- `SubagentStop`: `{ hook_event_name:"SubagentStop", stop_hook_active, agent_id, agent_transcript_path }`
- `PreCompact`: `{ hook_event_name:"PreCompact", trigger, custom_instructions }`

Important nuance: many hooks are executed with `permission_mode` passed through from the tool permission context, but some are invoked with `permission_mode` omitted (`void 0`), especially outside-REPL hooks.

### 6.5 Hook command execution (shell hooks): `e51` vs `Y71`

“Command hooks” execute a shell command and write `hookInput` JSON to stdin.

- 2.0.67: `e51(hookCommand, hookEvent, hookName, stdinJSON, signal, envFilePath?)`
- 2.0.69: `Y71(hookCommand, hookEvent, hookName, stdinJSON, signal, envFilePath?)`

Shared behavior:

- Builds an env with:
  - `...process.env`
  - `CLAUDE_PROJECT_DIR=<projectDir>` (from `cQ()/pQ()`)
  - For `SessionStart` only: `CLAUDE_ENV_FILE=<tempEnvFile>` if provided
- Builds the command string:
  - if `process.env.CLAUDE_CODE_SHELL_PREFIX` is set, it prefixes the command via `SmA/jmA(shellPrefix, hookCommand.command)`
- Uses Node `child_process.spawn(..., { shell: true, cwd: <cwd>, env })`
- Writes `stdinJSON` to stdin, then closes stdin.
- Collects stdout/stderr as UTF-8.
- Respects timeouts:
  - `hookCommand.timeout` (seconds) if provided
  - otherwise a default (often 60s)
- Returns `{ stdout, stderr, status, aborted? }`

#### 6.5.1 Async hook protocol (“background hooks”)

Both versions support “async hooks” whose *initial* stdout is a JSON object containing `{ async: true, asyncTimeout?: number }`.

Mechanism:

- While streaming stdout, once `stdout.trim()` includes `"}"`:
  - attempt `JSON.parse(stdout.trim())`
  - if it matches `MXA/LXA` (`"async" in obj && obj.async===true`):
    - compute an ID like `async_hook_<pid>`
    - “background” the process using a wrapper `TmA(child, signal, timeout).background(id)`
    - register background streams for later consumption (`eoB/_rB` etc.)
    - resolve the execution as success with `status: 0` and the partial stdout/stderr

This is how long-running hooks can return quickly while continuing to stream data in the background.

#### 6.5.2 Error normalization

`EPIPE` while writing stdin is treated as a controlled failure:

- stdout: `""`
- stderr: a specific message indicating the hook closed stdin early
- status: `1`

Abort errors (`ABORT_ERR`) are treated as cancellation:

- stderr: `"Hook cancelled"`
- status: `1`
- `aborted: true`

### 6.6 Hook output formats: plain text vs validated JSON

The hook executor distinguishes:

- **Plain output**: any stdout not starting with `{` (after `trim()`).
  - It is treated as plain text (no structured effects).
- **Structured output**: stdout starting with `{`.
  - Attempt to parse and validate using a Zod schema:
    - 2.0.67: `r51` union schema, parsed via `zg2(stdout)` and `r51.safeParse(...)`
    - 2.0.69: `B71` union schema, parsed via `Nu2(stdout)` and `B71.safeParse(...)`

If validation fails, the system still returns `plainText` but also records a `validationError` (and logs it).

#### 6.6.1 Output schema: `r51/B71`

It’s a union of:

1. **Async response**:
   - `{ async: true, asyncTimeout?: number }`
2. **Synchronous structured output**:
   - `continue?: boolean` (default true)
   - `suppressOutput?: boolean` (default false)
   - `stopReason?: string`
   - `decision?: "approve" | "block"` (coarse allow/block)
   - `reason?: string` (explanation for decision)
   - `systemMessage?: string` (warning shown to user)
   - `hookSpecificOutput?: {...}` (event-specific payload; see below)

The `hookSpecificOutput` union includes:

- `PreToolUse`:
  - `permissionDecision?: "allow" | "deny" | "ask"`
  - `permissionDecisionReason?: string`
  - `updatedInput?: Record<string, unknown>`
- `UserPromptSubmit` / `SessionStart` / `SubagentStart`:
  - `additionalContext?: string`
- `PostToolUse`:
  - `additionalContext?: string`
  - `updatedMCPToolOutput?: unknown`
- `PostToolUseFailure`:
  - `additionalContext?: string`
- `PermissionRequest`:
  - `decision`:
    - allow branch: `{ behavior:"allow", updatedInput?: Record<string,unknown>, updatedPermissions?: PermissionUpdate[] }`
    - deny branch: `{ behavior:"deny", message?: string, interrupt?: boolean }`

Where `PermissionUpdate[]` is a discriminated union:

- `addRules` / `replaceRules` / `removeRules` with `{ rules: ToolRule[], behavior: "allow"|"deny"|"ask", destination: ... }`
- `setMode` with `{ mode: PermissionMode, destination: ... }`
- `addDirectories` / `removeDirectories` with `{ directories: string[], destination: ... }`

Those structures are defined by:

- 2.0.67: `o51` (permission update schema), `a51` (rule schema), `LXA` (destination enum)
- 2.0.69: `Q71` (permission update schema), `A71` (rule schema), `qXA` (destination enum)

### 6.7 Hook output interpretation: `Ug2` vs `qu2`

After parsing structured output JSON, it is converted into concrete effects:

- “Continue” control:
  - if `continue === false` → set `preventContinuation: true`
  - if `stopReason` is present → attach `stopReason`
- Coarse decision:
  - `decision:"approve"` → `permissionBehavior:"allow"`
  - `decision:"block"` → `permissionBehavior:"deny"` + `blockingError`
- System warning:
  - `systemMessage` becomes a user-visible warning (kept as `systemMessage`)
- Permission decision refinement for `PreToolUse`:
  - `hookSpecificOutput.permissionDecision` can set `permissionBehavior` to `allow|deny|ask`
  - `permissionDecisionReason` is stored as `hookPermissionDecisionReason`
  - `updatedInput` can override the tool input that will be executed
- Context augmentation:
  - `additionalContext` is used to add extra transcript/context for certain events
- MCP output rewrite:
  - `PostToolUse.hookSpecificOutput.updatedMCPToolOutput` can replace the output for MCP tools
- PermissionRequest hook:
  - `hookSpecificOutput.decision.behavior` becomes `permissionBehavior` allow/deny
  - allow-branch `updatedInput` can modify tool input
  - allow-branch `updatedPermissions` can apply permission rule updates

The interpreter also optionally enforces the event name:

- If an `expectedHookEvent` is provided and the JSON declares a different event, it throws.

Finally it produces a transcript message:

- success: `hook_success`
- blocking: `hook_blocking_error`

2.0.67 uses `r9(...)` to build the message; 2.0.69 uses `A4(...)`.

### 6.8 Prompt hooks and agent hooks (model-driven hooks)

Not all hooks are “shell command” hooks. The system supports:

- **Prompt hooks** (`type:"prompt"`): run a prompt through the same message-building pipeline as normal user prompts, and (if needed) query the model to evaluate a boolean “condition met” outcome.
- **Agent hooks** (`type:"agent"`): spawn a dedicated, non-interactive “hook agent” that must produce a structured `{"ok":...}` result by calling a tool.

These are heavily used in stop-hook scenarios (“did the agent actually complete the plan?”).

#### 6.8.1 `$ARGUMENTS` templating: `t51/Z71`

Prompt and agent hook prompts can include `$ARGUMENTS`, which is replaced with a string argument payload.

- 2.0.67: `t51(prompt, args)` at `ClaudeAgentSDKCode/cli.js:4327` (byte offset ~`10003155`)
- 2.0.69: `Z71(prompt, args)` at `ClaudeCodeCode/cli.js:4317` (byte offset ~`10009630`)

Exact behavior:

- If `prompt.includes("$ARGUMENTS")`, replace all occurrences.
- Else append:
  - two newlines
  - `ARGUMENTS: ${args}`

#### 6.8.2 Prompt hooks (model evaluation)

The prompt-hook flow (2.0.67 shown; 2.0.69 is structurally the same with renamed symbols) does:

1. Preprocess the prompt via `t51/Z71`.
2. Pass the prompt through `uT(...)` (the same “prompt → messages” pipeline used elsewhere).
   - If `uT` decides it “should not query”, the hook is treated as success and its messages are converted into a human-readable transcript snippet.
3. If it *should* query:
   - Build a system prompt instructing the model to output **only JSON**:
     - `{"ok": true}` or `{"ok": false, "reason": "..." }`
   - Query the model with `maxThinkingTokens: 0` and `querySource:"hook_prompt"`.
   - Parse the returned text as JSON (`d8(...)`), validate via zod:
     - 2.0.67: `tTA`
     - 2.0.69: `nTA`
4. Outcomes:
   - if `ok:false`:
     - outcome: `"blocking"`
     - sets `preventContinuation: true` and `stopReason`
     - creates a blocking error message referencing the prompt
   - if parse/validation fails:
     - outcome: `"non_blocking_error"`
   - if `ok:true`:
     - outcome: `"success"`

This is “model-as-hook-condition-evaluator”.

#### 6.8.3 Agent hooks (dedicated hook agent, tool-required)

Agent hooks are stronger than prompt hooks: they spawn an actual agent loop and require the agent to emit a structured result via a tool call.

The hook agent:

- runs as `isNonInteractiveSession: true`
- uses `maxThinkingTokens: 0`
- has a `max turns` limit of `50` (hard-coded guard; logs `Hooks: Agent turn N hit max turns, aborting`)

To force the agent to produce a deterministic “ok / not ok” output, the engine:

1. Creates a special tool definition (2.0.67 `CW5()`, 2.0.69 `hK5()`) that instructs:
   - “Use this tool exactly once at the end of your response.”
   - Input schema: `{ ok: boolean, reason?: string }`
2. Constructs a new `toolUseContext` for the hook agent, with:
   - a unique agent ID like `hook-agent-<uuid>`
   - a private abort controller
   - an overridden `getAppState()` that temporarily modifies `toolPermissionContext`:
     - sets mode to `"dontAsk"`
     - injects an allow rule to read the transcript path (`Read(/<path>)`) into `alwaysAllowRules.session`
3. Adds a session hook `function` hook (via `lMA/mMA`) that forces tool call completion:
   - it registers a session hook for `"Stop"` that surfaces a timeout/error message (“You MUST call the Stop tool...”)
4. Runs the agent loop (`kU/LU(...)`) and monitors stream events:
   - When it sees a `structured_output` attachment, it validates it via zod and then aborts.
5. After completion, it clears the temporary session hook state (`jB1(...)`) so it doesn’t leak.

Agent hook outcomes:

- If no structured output was produced:
  - outcome: `"cancelled"` (and logs `tengu_agent_stop_hook_error` / max turns)
- If structured output `ok:false`:
  - outcome: `"blocking"`
  - returns a `blockingError` referencing the hook prompt
- If `ok:true`:
  - outcome: `"success"`

### 6.9 Streaming executor: `gn` vs `Ln` (REPL hook execution)

The REPL executor:

- checks `disableAllHooks`:
  - 2.0.67: `if (CQ().disableAllHooks) return;`
  - 2.0.69: `if (NQ().disableAllHooks) return;`
- checks workspace trust gate (`Cg2/wu2`)
- loads app state (if `toolUseContext` provides it)
- selects matching hooks (`bY0/IJ0`)
- emits progress and completion messages for each hook
- aggregates counts: success / blocking / non-blocking error / cancelled

The executor yields objects shaped like:

```ts
{ message: TranscriptMessage | ProgressMessage }
```

Where progress messages include:

- hook event name
- hook name (`<event>:<matchQuery>` when applicable)
- the specific hook command/prompt/agent being run
- optional status line (if the hook config includes it)

### 6.10 Non-streaming executor: `hY0` vs `XJ0`

Outside-REPL execution returns a simple array:

```ts
type HookRunResult = { command: string; succeeded: boolean; output: string };
```

Key behavior:

- It executes:
  - `callback` hooks (calls JS callback with abort handling)
  - `command` hooks (shell execution)
- It explicitly refuses to run certain hook types outside REPL:
  - `prompt` hooks: “not yet supported outside REPL”
  - `agent` hooks: “not yet supported outside REPL”
  - `function` hooks: treated as an internal error (“Function hooks should only be used in REPL context (Stop hooks).”)

Used by:

- `Notification` hooks (`dA0/G10`)
- `SessionEnd` hooks (`RG0/nG0`)
- `PreCompact` hooks (`Y10/R10`)
- status line and file suggestion commands (`e60/U80`, `k60/A80`)

### 6.11 SessionEnd hook cleanup

After running `SessionEnd` hooks:

- The system prints failures to stderr:
  - `SessionEnd hook [<command>] failed: <output>`
- If a `setAppState` callback is provided, it clears all session hooks for the current session:
  - 2.0.67: `RG0(...)` calls `jB1(setAppState, W0())`
  - 2.0.69: `nG0(...)` does the same

This prevents session hooks from persisting into future sessions.

---

## Chapter 7 — AppState runtime + notifications (React/Ink state backbone)

This chapter documents the “runtime state container” that the Ink/React UI uses everywhere: an `AppStateProvider` plus helper hooks for reading/updating state, reacting to settings changes, and showing transient notifications.

Even though this is “just React state”, it is **first-party product logic** because:

- the `AppState` object is the CLI’s *single source of truth* for UI screens, queues, and runtime flags
- it stitches together: settings, tool permissions, plugins, MCP, tasks, file history, notifications, and more
- it exposes a stable abstraction boundary for a TypeScript rewrite (treat it like a Redux slice, but implemented with context + tuple)

### 7.1 Symbol map (2.0.67 vs 2.0.69)

Provider and hooks:

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Default state factory | `bn()` | `Nn()` |
| AppStateProvider component | `n5(...)` | `u5(...)` |
| Context tuple hook (“must be in provider”) | `RQ()` | `yQ()` |
| Optional tuple hook (“may be null”) | `lH2()` | `fF2()` |
| React default import | `rV` | `dV` |
| Tuple context | `PY0` | `AJ0` |
| Nested-provider guard context | `Bg2` | `Ju2` |
| Provider initializer thunk | `f2` | `u2` |

Notifications:

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| `useNotifications()` hook | `fG()` | `xG()` |
| Next-notification selector | `EW5(queue)` | `vK5(queue)` |
| Priority ordering map | `Zg2` | `Xu2` |
| Default timeout | `Gg2 = 8000` | `Iu2 = 8000` |
| Timeout handle | `HQA` | `GQA` |

Definition anchors:

- 2.0.67 default state: `function bn(){return {...}}` at `ClaudeAgentSDKCode/cli.js` (byte offset ~`9978684`)
- 2.0.69 default state: `function Nn(){return {...}}` at `ClaudeCodeCode/cli.js` (byte offset ~`9985080`)
- Providers: `ClaudeAgentSDKCode/cli.js:4322` (`n5(...)`), `ClaudeCodeCode/cli.js:4312` (`u5(...)`)

### 7.2 The `AppState` object (what lives in global UI state)

`bn()` / `Nn()` returns the baseline `AppState`. It is intentionally “wide” and groups multiple subsystems:

Common fields (both):

- `settings`: effective settings snapshot (`dV()` in 2.0.67, `R7()` in 2.0.69)
- `tasks`: task registry (`{}`)
- `verbose`: boolean
- `mainLoopModel`: selected model for loop (nullable)
- `mainLoopModelForSession`: per-session override (nullable)
- `statusLineText`: string or `undefined` (UI status line)
- `showExpandedTodos`: boolean
- `toolPermissionContext`: default tool permission context (`Uw()` / `s$()`)
- `agent`: current agent selection (optional)
- `agentDefinitions`: `{ activeAgents: AgentDef[]; allAgents: AgentDef[] }`
- `fileHistory`: `{ snapshots: []; trackedFiles: Set }`
- `mcp`: `{ clients: []; tools: []; commands: []; resources: {} }`
- `plugins`: `{ enabled: []; disabled: []; commands: []; agents: []; errors: []; installationStatus: { marketplaces: []; plugins: [] } }`
- `todos`: `{}` (per-session todo state is injected later)
- `notifications`: `{ current: Notification|null; queue: Notification[] }`
- `elicitation`: `{ queue: [] }`
- `thinkingEnabled`: boolean from `LB1()`
- `feedbackSurvey`: `{ timeLastShown: number|null; submitCountAtLastAppearance: number|null }`
- `sessionHooks`: `{}` (see Chapter 6)
- `inbox`: `{ messages: [] }`
- `workerPermissions`: `{ queue: []; selectedIndex: number }`
- `pendingWorkerRequest`: nullable
- `promptSuggestion`: `{ text: string|null; shownAt: number; acceptedAt: number }`
- `queuedCommands`: `[]`
- `gitDiff`: `{ stats: null; perFileStats: Map; hunks: Map; lastUpdated: number }`

Differences:

- 2.0.69 adds sandbox-permission queues:
  - `workerSandboxPermissions: { queue: []; selectedIndex: number }`
  - `pendingSandboxRequest: null`

Canonical TS direction:

```ts
type AppState = {
  settings: ClaudeCodeSettings;
  toolPermissionContext: ToolPermissionContext;
  notifications: { current: Notification | null; queue: Notification[] };
  sessionHooks: SessionHooksState;
  // ...plus the rest (split into TS sub-interfaces per subsystem)
};
```

### 7.3 Provider mechanics: `n5/u5` (tuple context + previous state)

The provider is a thin state container with an important detail: it stores both the **current state** and the **previous state**.

Implementation outline (both builds):

1. **Nested provider guard**
   - checks `useContext(Bg2/Ju2)`
   - if already `true`, throws: `"AppStateProvider can not be nested within another AppStateProvider"`

2. **Internal provider state**
   - `useState({ currentState: initialState ?? bn/Nn(), previousState: null })`

3. **`setAppState` wrapper**
   - exposes a function (call it `setAppState`) that takes an updater:
     - `updater: (prev: AppState) => AppState`
   - writes:
     - `previousState = currentState`
     - `currentState = updater(currentState)`
   - invokes `onChangeAppState?.({ newState, oldState })`

4. **Context value shape**
   - a 2-tuple: `[currentState, setAppState]`
   - it mutates the tuple by setting `tuple.__IS_INITIALIZED__ = true`
     - this is how `useAppState` detects “not inside provider” without relying on `undefined` checks.

Canonical TS:

```ts
type AppStateStore = readonly [
  AppState,
  (updater: (prev: AppState) => AppState) => void
] & { __IS_INITIALIZED__?: true };

type OnAppStateChange = (args: { newState: AppState; oldState: AppState }) => void;
```

### 7.4 Access hooks: `RQ/yQ` and `lH2/fF2`

Both bundles expose two accessors:

- **Strict accessor** (`RQ()` / `yQ()`):
  - reads the tuple from context
  - if `!tuple.__IS_INITIALIZED__`, throws:
    - `"useAppState cannot be called outside of an <AppStateProvider />"`

- **Optional accessor** (`lH2()` / `fF2()`):
  - returns `null` if not initialized
  - otherwise returns the tuple

In TS rewrite terms, these correspond to:

```ts
function useAppState(): AppStateStore;
function useAppStateOptional(): AppStateStore | null;
```

### 7.5 Mount-time permission-mode correction (remote-loaded edge)

Both providers run a mount `useEffect` that disables bypass permissions mode if it’s available but should not be active.

Observed logic (names differ):

- if `toolPermissionContext.isBypassPermissionsModeAvailable && ZTA()/KTA()`:
  - log: `"Disabling bypass permissions mode on mount (remote settings loaded before mount)"`
  - update `toolPermissionContext` via `d_A/a_A(...)` (a “strip bypass” helper)

This is a subtle ordering fix: remote settings can load before the React tree mounts, so the provider normalizes once it’s in control.

### 7.6 Settings-change integration (watcher → invalidate caches → update AppState)

The provider subscribes to the settings watcher hook:

- 2.0.67: `I8A(callback)`
- 2.0.69: `V8A(callback)`

On settings change:

1. Log: `Settings changed from <source>, updating AppState`
2. Invalidate internal caches (several `p51/n51` style calls; names vary per build)
3. Update:
   - `state.settings = newEffectiveSettings`
   - `state.toolPermissionContext = recomputeToolPermissionContext(prevContext, envInfo)`
4. Re-apply the mount-time bypass disable guard if needed.

This is the bridge from “JSON file watcher” (Chapter 5) into “live UI state”.

### 7.7 Notifications queue: `fG/xG` and `EW5/vK5`

The notification system is a mini scheduler with two slots:

- `notifications.current`: the currently displayed notification (or `null`)
- `notifications.queue`: pending notifications

Priority model:

- 2.0.67: `Zg2={immediate:0,high:1,medium:2,low:3}`
- 2.0.69: `Xu2={immediate:0,high:1,medium:2,low:3}`

Next-notification selection:

- `EW5/vK5(queue)` sorts by priority and picks the first.

#### 7.7.1 The `addNotification(...)` algorithm

The `useNotifications` hook returns `{ addNotification }`. Adding a notification:

- If `priority === "immediate"`:
  - cancels any existing timeout
  - sets a new timeout for this notification (`timeoutMs ?? 8000`)
  - sets `current` to the new notification
  - re-queues the previous `current` (if any) plus the existing queue *after filtering*:
    - drop other `"immediate"` notifications
    - drop notifications whose `key` is in `invalidates`
  - when the timeout fires, it clears `current` (if still the same key) and removes invalidated queued items

- Else (non-immediate):
  - enqueues only if its `key` is not already present in queue and not currently displayed
  - drops queued items that are invalidated by the new notification
  - triggers “drain” (see below)

Canonical TS:

```ts
type NotificationPriority = "immediate" | "high" | "medium" | "low";

type Notification = {
  key: string;
  text: string;
  priority: NotificationPriority;
  color?: "warning" | "error" | "info" | string;
  timeoutMs?: number;
  invalidates?: string[];
};
```

#### 7.7.2 Queue draining: “show next if idle”

The hook defines an internal “drain” function (`B` in both snippets):

- If `current !== null`, do nothing.
- Else pick next notification from `queue`:
  - set it to `current`
  - remove it from the queue
  - start a timeout that clears `current` after `timeoutMs ?? 8000`
  - when cleared, call drain again to show the next.

This produces a simple FIFO-like experience, but with priority reordering.

---

## Chapter 8 — Teleport + remote sessions (resume web sessions across machines)

This chapter documents “Teleport”, which is the CLI’s mechanism for:

- resuming a Claude Code **web session** (hosted at `https://claude.ai/code/<id>`) into a local CLI run
- ensuring you’re in the **right git repository**
- switching to the session’s **git branch**
- importing the session’s **event log** as local conversation messages

It also documents `--remote <description>`, which creates a new “remote session” (a server-side session record) and prints a link + teleport command for resuming it later.

Important: Teleport/remote sessions require **Claude.ai OAuth** (a “Claude account”), not API-key-only auth.

### 8.1 Symbol map (2.0.67 vs 2.0.69)

Core primitives:

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Generate session title/branch (LLM) | `XJ8(description, signal)` | `DI8(description, signal)` |
| Ensure git clean (hard error) | `WQ1()` | `IQ1()` |
| Get current git branch | `XQ1()` | `JQ1()` |
| Branch checkout/sync | `WJ8(branch)` / `VJ8(branch)` | `HI8(branch)` / `CI8(branch)` |
| Apply branch switch + build resume messages | `IMA(messages, branch?)` | `BMA(messages, branch?)` |
| Validate session repo vs local repo | `voB(sessionId)` | `XrB(sessionId)` |
| Resume session (ID → {log, branch}) | `XMA(sessionId)` | `GMA(sessionId)` |
| Parse teleport arg (URL or id) | `ToB(arg)` | `BrB(arg)` |
| Resume teleport from arg | `boB(arg)` | `VrB(arg)` |
| Preflight resolver (login/stash UI) | `foB(errorsToIgnore?)` | `KrB(errorsToIgnore?)` |
| Create remote session wrapper | `hoB(description, signal)` | `ErB(description, signal)` |
| Create remote session (API POST) | `KMA({initialMessage, description, signal})` | `YMA({initialMessage, description, signal})` |
| Fetch session events list | `HJ8(sessionId, orgUuid, token)` | `$I8(sessionId, orgUuid, token)` |
| Event validator | `DJ8(event)` | `UI8(event)` |
| “Select session to resume” flow | `Qc2()` + `ND5` | `Yp2()` + `mH5` |
| Git-stash UI for teleport | `roB(...)` | `roB(...)` (same symbol in 2.0.69) |

CLI entrypoint integration (both bundles):

- `--teleport [session]` (hidden option)
- `--remote <description>` (hidden option)

Anchors:

- Teleport block begins around `ClaudeAgentSDKCode/cli.js:1586` (byte offset ~`7462604`)
- Teleport block begins around `ClaudeCodeCode/cli.js:1586` (byte offset ~`7457234`)
- CLI entrypoint teleport/remote decision:
  - 2.0.67: `ClaudeAgentSDKCode/cli.js:4713` (byte offset ~`10291766`)
  - 2.0.69: `ClaudeCodeCode/cli.js:4703` (byte offset ~`10299803`)

### 8.2 CLI flags behavior: `--remote` and `--teleport`

The CLI “action handler” (the `claude` command entrypoint) processes these in a mutually exclusive region:

- If `--remote <description>` is provided:
  - it creates a remote session via `hoB/ErB`
  - prints:
    - `Created remote session: <title>`
    - `View: https://claude.ai/code/<id>?m=0`
    - `Resume with: claude --teleport <id>`
  - exits `0` on success, `1` on failure

- Else if `--teleport` is provided:
  - if `--teleport` is passed with no argument (`true` or empty string):
    - interactive mode: show a list of sessions and let the user pick one
  - if `--teleport <id>` is provided:
    - direct mode: resume that session id

The teleport flag is also passed into the main loop options as `teleport: yA/kA`.

### 8.3 Remote session creation: `KMA` vs `YMA`

`--remote <description>` calls:

- 2.0.67: `hoB(description, signal)` → `KMA({ initialMessage: description, signal })`
- 2.0.69: `ErB(description, signal)` → `YMA({ initialMessage: description, signal })`

They also run preflight resolution **but ignore** `needsGitStash`:

- 2.0.67: `foB(new Set(["needsGitStash"]))` inside `hoB`
- 2.0.69: `KrB(new Set(["needsGitStash"]))` inside `ErB`

Meaning:

- login/auth is required
- clean git is *not* required to create the remote session (it only matters when you later teleport into it)

#### 8.3.1 Session payload construction (what gets sent to `/v1/sessions`)

`KMA/YMA` does:

1. Ensure authenticated state (e.g. `await pk()/await Mk()`).
2. Get OAuth access token:
   - 2.0.67: `r3()?.accessToken`
   - 2.0.69: `t6()?.accessToken`
3. Get organization UUID:
   - 2.0.67: `AP()`
   - 2.0.69: `mj()`
4. Determine current repo (if any):
   - 2.0.67: `await EM()` returns `owner/name` or `null`
   - 2.0.69: `await tL()` returns `owner/name` or `null`
5. Generate a title + branch name:
   - 2.0.67: `XJ8(B || Q || "Background task", signal)`
   - 2.0.69: `DI8(B || Q || "Background task", signal)`
   - This uses a model query with `querySource:"teleport_generate_title"` and expects `<title>...</title>` and `<branch>...</branch>` tags.
6. Choose an environment:
   - fetch available environments:
     - 2.0.67: `gYA()` (calls `/v1/environment_providers`)
     - 2.0.69: `bYA()`
   - select `settings.remote.defaultEnvironmentId` if present:
     - 2.0.67: `CQ()?.remote?.defaultEnvironmentId`
     - 2.0.69: `NQ()?.remote?.defaultEnvironmentId`
   - else use first environment.
7. Build `sources/outcomes` session_context:
   - if in repo, include:
     - a `source` describing `git_repository` URL and revision
     - an `outcome` describing github repo and branches (includes the generated branch name)
8. Build initial events:
   - if an initial message exists, include a single “user” event:
     - uuid via `randomUUID()` (`ZJ8/WI8`)
     - message `{ role: "user", content: initialMessage }`
9. POST to:
   - `${BASE_API_URL}/v1/sessions`
   - payload:
     - `{ title, events, session_context, environment_id }`
10. Return the session record (must include at least `id` and `title`), or `null` on failure.

Canonical TS:

```ts
type RemoteSessionCreateRequest = {
  title: string;
  events: Array<{ type: "event"; data: { uuid: string; type: "user"; message: { role: "user"; content: string } } }>;
  session_context: { sources: any[]; outcomes: any[]; model: string };
  environment_id: string;
};
```

### 8.4 Teleport direct mode: `--teleport <id>`

The direct mode path (both bundles) is:

1. Emit telemetry: `tengu_teleport_resume_session { mode: "direct" }`.
2. Validate that the current working directory is a checkout of the session’s git repository:
   - 2.0.67: `voB(sessionId)`
   - 2.0.69: `XrB(sessionId)`
3. If mismatch/not-in-repo:
   - attempt to compute candidate paths to a local checkout of the required repo
   - if any are found, show a UI to let the user pick one:
     - 2.0.67: renders `ad2` inside `n5`
     - 2.0.69: renders `tc2` inside `u5`
   - if the user picks a path:
     - `process.chdir(path)` and update internal CWD trackers (`MN/GN`, `vW0/BK0`, etc.)
   - if no candidate paths:
     - throw an operation error instructing:
       - “You must run claude --teleport <id> from a checkout of <repo>.”
4. Ensure git working directory is clean (hard error):
   - 2.0.67: `await WQ1()` calls `Bt()`; throws `oZ` with formatted message.
   - 2.0.69: `await IQ1()` calls `ds()`; throws `tZ` with formatted message.
5. Run teleport resume:
   - 2.0.67: `let result = await boB(sessionId)`
   - 2.0.69: `let result = await VrB(sessionId)`
6. Check out the branch + produce local “resume messages”:
   - 2.0.67: `IMA(k0A(result.log), result.branch)` → `.messages`
   - 2.0.69: `BMA(M0A(result.log), result.branch)` → `.messages`

That message list becomes the initial conversation history passed into the UI.

### 8.5 Teleport interactive mode: `--teleport` (no argument)

Interactive mode:

- emits `tengu_teleport_interactive_mode`
- shows a “select a session to resume” UI (table of sessions with last-updated times)
- returns either:
  - `null` (user cancelled), or
  - `{ log: SDKMessage[]; branch?: string }`

Implementation:

- 2.0.67: `Qc2()` renders `ND5` which wraps the picker component and the resume logic.
- 2.0.69: `Yp2()` renders `mH5` similarly.

Key details:

- It classifies errors into buckets (`network|auth|api|other`) and gives targeted suggestions.
- It logs telemetry on resume attempts: `tengu_teleport_resume_session { source, session_id }`.

### 8.6 Repo validation: `voB` vs `XrB`

Before doing any branch switch, Teleport checks that the local repo matches the session’s repo:

1. Require OAuth token and org UUID (otherwise return `{status:"error"}`).
2. Fetch session metadata:
   - GET `${BASE_API_URL}/v1/sessions/<id>`
3. Read the session’s required repository URL from:
   - `session_context.sources.find((s) => s.type === "git_repository")`
4. Convert URL → canonical repo string:
   - 2.0.67: `ub(url)` (likely returns `owner/name` or null)
   - 2.0.69: `Cb(url)`
5. Compare with local repo:
   - local repo string from `EM()/tL()` (or null if not in a repo)
6. Return one of:
   - `no_repo_required`
   - `not_in_repo` (sessionRepo present, but local is null)
   - `match`
   - `mismatch`
   - `error`

This is what drives the “pick a repo path” UI in the CLI entrypoint.

### 8.7 Resume core: `XMA/GMA` + `HJ8/$I8` (session events → local log)

The core “resume by session id” function:

- 2.0.67: `XMA(sessionId)`
- 2.0.69: `GMA(sessionId)`

Behavior:

1. If `process.env.TELEPORT_RESUME_URL` is set:
   - it uses that URL directly (`koB/WrB` style) instead of session id API calls.
2. Otherwise:
   - requires OAuth access token
   - requires org UUID
   - validates repo constraints via `EJ8/zI8` (server-side metadata check)
   - fetches session events via `HJ8/$I8`

#### 8.7.1 Fetching events: `HJ8` vs `$I8`

It calls:

- GET `${BASE_API_URL}/v1/sessions/<id>/events`
  - validates response shape `data.data` is an array
  - filters items using `DJ8/UI8` (drops `env_manager_log` and `control_response`)

It also attempts to fetch session details:

- GET `${BASE_API_URL}/v1/sessions/<id>`
  - reads branch name from `session_context.outcomes` git info
  - uses the first branch if available

Return shape:

```ts
type TeleportResumeResult = { log: SDKMessage[]; branch?: string };
```

### 8.8 Branch switching and “resume messages”: `IMA` vs `BMA`

After the remote log is fetched, Teleport moves the local repo to the right branch:

- reads current branch via `XQ1/JQ1`
- if a target branch exists:
  - fetches it from origin (best-effort; special-cases refspec errors)
  - checks out the branch
  - pulls / syncs (implementation split across `WJ8/VJ8` vs `HI8/CI8`)

Then it produces “resume messages”, composed of:

- a transformed form of the remote event log (`k0A/M0A(log)` is the log→messages mapping)
- a meta message warning that app state may differ across machines
- a “Session resumed…” notification message, optionally with a warning if branch restore failed

These are assembled by helpers (`xoB/JrB`, `JJ8/VI8`, `YJ8/KI8`).

### 8.9 Preflight resolution UI: `foB/KrB` + `roB` (stash + login)

There is a “resolve teleport errors” pathway that can present UI to:

- ask the user to login (Claude.ai OAuth)
- offer to `git stash` local changes before teleport

Mechanics:

- `J10/lA0` computes a `Set` of required fixes:
  - `needsLogin` if not authenticated
  - `needsGitStash` if git working directory has changes
- if there are errors, it mounts a temporary UI component (`IQ1/YQ1`) which:
  - for `needsGitStash`: renders `roB` (lists changed files; offers “stash changes and continue”)
  - for `needsLogin`: renders an embedded login flow

After resolution, it retries the checks and continues.

Note: the CLI entrypoint for `--teleport <id>` still calls `IQ1/WQ1` (hard error) before `VrB/boB`, so interactive stash UI may not be reached unless the repo is already clean.

---

## Chapter 9 — Main REPL UI (Ink/React root component)

This chapter documents the “main app” React component that powers the interactive CLI UI (the REPL). It is the backbone that:

- holds the conversation messages and streaming state
- parses/executes slash commands and “modes” (prompt vs bash, etc.)
- constructs the tool-use context passed into the model loop
- renders overlays for permission prompts, message selector, IDE onboarding, cost notices, etc.
- brokers sandbox networking decisions (2.0.69 adds “worker/leader mediated” network approval)

### 9.1 Symbol map (2.0.67 ↔ 2.0.69)

Core component + AppState:

- 2.0.67: `r0A(props)` = main UI root component
- 2.0.69: `b0A(props)` = main UI root component
- 2.0.67: `RQ()` = `useAppState()` returning `[state, setState]`
- 2.0.69: `yQ()` = `useAppState()` returning `[state, setState]`

Model + tools:

- 2.0.67: `En()` = “current main-loop model” hook (resolves `mainLoopModelForSession ?? mainLoopModel ?? default`)
- 2.0.69: `ai()` = same (hook)
- 2.0.67: `LH(toolPermissionContext)` = list of enabled built-in tools (minus a few special tools; filtered by deny rules)
- 2.0.69: `UH(toolPermissionContext)` = same

Transcript hotkeys:

- 2.0.67: `qN2(screen, setScreen, bumpToggleId, setShowAll, maybeResetTerminal)`
- 2.0.69: `wq2(screen, setScreen, bumpToggleId, setShowAll, maybeResetTerminal)`

IDE selection listener:

- 2.0.67: `MN2(mcpClients, setIdeSelection)`
- 2.0.69: `qq2(mcpClients, setIdeSelection)`

Spinner tip (“did you know…”) loader:

- 2.0.67: `Fq2({theme, readFileState})` = choose next spinner tip if enabled
- 2.0.69: `DL2({theme, readFileState})` = same
- 2.0.67: `Cq2(tip)` = mark tip shown + analytics
- 2.0.69: `HL2(tip)` = same

Bypass-permissions “gate” auto-disable effect:

- 2.0.67: `$q2()` = mount effect that may force-disable bypass mode
- 2.0.69: `zL2()` = same

Sandbox network prompt UI component:

- 2.0.67: `Lq2({hostPattern, onUserResponse})` = “Network request outside of sandbox” UI
- 2.0.69: `T70({hostPattern, onUserResponse})` = same (renamed)

2.0.69-only additions:

- `AppState.workerSandboxPermissions` (queue of network approval requests originating from a worker)
- `AppState.pendingSandboxRequest` (used to render “Waiting for leader…” overlay)
- Overlay selector includes `"worker-sandbox-permission"`

### 9.2 What `b0A/r0A` “is” in TS terms

Canonical TS name suggestion: `MainApp` / `MainRepl`.

It is an Ink + React component (or React-like runtime) that:

1. Pulls the global AppState.
2. Builds the effective tool list and command list.
3. Owns *session-local UI state* (input buffer, screen mode, overlays).
4. Orchestrates the “submit → run slash command → maybe query model → stream events → render” loop.
5. Renders overlays in front of the prompt when needed.

### 9.3 Props contract (“inputs to the app”)

Both versions accept essentially the same props (2.0.69 just adds/renames a few):

- `commands`: array of command definitions (built-in commands + plugin commands + MCP commands)
- `debug`: boolean, more debug output
- `initialPrompt`: string | undefined; initial user prompt (stdin / CLI arg)
- `initialTools`: array of tool definitions to add to built-in tool list (e.g., MCP tools)
- `initialMessages`: initial conversation messages (from `--continue`, `--resume`, hooks, etc.)
- `initialFileHistorySnapshots`: used to rehydrate file-history UI and read-file cache
- `mcpClients`: list of connected MCP servers
- `dynamicMcpConfig`: dynamic MCP config override (from IDE auto-connect, etc.)
- `mcpCliEndpoint`: optional “MCP CLI endpoint” object
- `autoConnectIdeFlag`: `--ide` style behavior; used by the IDE auto-connect effect
- `strictMcpConfig`: boolean; lock down MCP config
- `systemPrompt`: optional custom system prompt
- `appendSystemPrompt`: optional “append” system prompt
- `onBeforeQuery`: optional callback before model query
- `onTurnComplete`: optional callback after query completes
- `disabled`: optional: disables prompt input (rare)
- `mainThreadAgentDefinition`: optional agent definition that replaces/augments main thread behavior
- `disableSlashCommands`: bool; makes `/…` behave like normal text input

In a TS rewrite, treat this as the boundary between:

- CLI/entrypoint (parsing args, loading settings, selecting tools/commands)
- UI runtime (this component)

### 9.4 Global state inputs (`AppState`) used by the UI root

`b0A/r0A` reads and updates many parts of AppState:

- `toolPermissionContext` (permissions + working directory trust + allow/deny rules)
- `mcp` (clients/tools/commands/resources)
- `plugins` and `agentDefinitions` (for agent selection + plugin commands + startup notices)
- `notifications` (banner queue shown above the prompt)
- `elicitation.queue` (MCP “ask user” prompts)
- `todos` (per-session todo lists; used by UI and tools)
- `workerPermissions.queue` (team/worker permission requests; leader UI)
- 2.0.69 only: `workerSandboxPermissions.queue` (team/worker network approvals)
- `pendingWorkerRequest` and 2.0.69 `pendingSandboxRequest` (waiting overlays)
- `fileHistory` (snapshots + tracked files)
- `spinnerTip`, `showExpandedTodos`, `thinkingEnabled`, `feedbackSurvey`, etc.

### 9.5 Built-in tool list composition: `UH` vs `LH`

These functions define what the model *can* use by default.

#### 9.5.1 Source tool registry: `m81` / `f81`

- 2.0.69: `m81()` returns an array of built-in tool objects (plus a few gated tools based on env flags).
- 2.0.67: `f81()` is the equivalent.

These are “first-party tools” like:

- `Bash`
- file edit tools
- file read tools
- search tools
- “task”/agent tools (subagents)
- (optionally) LSP tool when `ENABLE_LSP_TOOL` is set

The exact registry members are long; in TS, this should become a normal `tools/index.ts` export list.

#### 9.5.2 Filtering + enabling: `UH(toolPermissionContext)` / `LH(toolPermissionContext)`

Both do the same conceptual job:

1. Exclude a small set of special tools by name:
   - 2.0.69 excludes `{Gb.name, Zb.name, wC}`.
   - 2.0.67 excludes `{_b.name, Tb.name, PC}`.
2. Apply “deny entire tool” rules from the permission engine:
   - 2.0.69 calls `AXA(toolPermissionContext)` and drops rules where `ruleContent === undefined`.
   - 2.0.67 uses a slightly inlined form but same idea.
3. Filter to only tools whose `isEnabled()` returns `true`.

Key insight for the rewrite:

- The tools registry is *not* the only gate. Tools may exist but be disabled by:
  - platform checks (Windows/macOS/Linux)
  - settings
  - experimental flags
  - permission policy (deny rules)

#### 9.5.3 “Structured output tool”: `wC` vs `PC`

2.0.69 defines:

- `wC = "StructuredOutput"`
- `Z70` = the “StructuredOutput” tool object (always enabled, read-only, etc.)

This tool is treated specially:

- It is excluded from the normal `UH()` list so it doesn’t appear as an ordinary tool.
- It is used when the CLI wants the model to produce a JSON-schema-validated final output.

The 2.0.67 equivalent constant is `PC`.

### 9.6 Screen state machine + transcript mode

The UI has a “screen mode” string state, with at least:

- `"prompt"`: normal REPL
- `"transcript"`: condensed transcript view with special hotkeys

The transcript view renders the same message list component in a different style and shows a hint:

- “Showing detailed transcript · ctrl+o to toggle”

#### 9.6.1 Transcript hotkeys: `wq2` / `qN2`

2.0.69 `wq2(screen, setScreen, bumpToggleId, setShowAllInTranscript, maybeResetTerminal)`:

- `ctrl+o`: toggle `prompt` ↔ `transcript`
  - increments a “toggle id” to force component resets
  - clears “show all” state
  - calls `maybeResetTerminal()` if a certain context (`Pz`) is not present
- `ctrl+e` (only on `transcript`): toggles `showAllInTranscript`
- `ctrl+c` or `esc` (only on `transcript`): exits transcript back to prompt

2.0.67 `qN2` is behavior-identical.

In TS, you want something like:

- `useTranscriptHotkeys({screen, setScreen, setShowAll, bumpKey, maybeResetTerminal})`

The “context” check (`useContext(Pz)`) likely means:

- “am I embedded in a focused input dialog / nested UI that already owns key handling?”

### 9.7 Overlay selection (the UI “modal stack”)

Both versions compute a single string `overlay` (2.0.69: `H5`, 2.0.67: `$5`) via a local function:

- 2.0.69: `function _W() { ... }`
- 2.0.67: `function OW() { ... }`

Overlay precedence (2.0.69, simplified):

1. If “exiting” or “exit message” is active: no overlays.
2. If message selector is open: `"message-selector"`.
3. If sandbox permission requests exist: `"sandbox-permission"`.
4. If tool permission prompt is active: `"tool-permission"`.
5. If worker permission prompt exists: `"worker-permission"`.
6. 2.0.69 only: if worker sandbox permission prompt exists: `"worker-sandbox-permission"`.
7. If elicitation exists: `"elicitation"`.
8. If cost notice should be shown: `"cost"`.
9. If IDE onboarding should be shown: `"ide-onboarding"`.

Important: the overlay system is intentionally *single-choice*.

- Multiple queues exist, but only the highest-priority one renders at a time.
- Queues are advanced by “onDone / onReject / onAbort” callbacks that slice the front.

### 9.8 Sandbox networking prompts (local + team-mediated)

When sandboxing is enabled, the sandbox layer calls a callback to decide whether a host may be contacted.

#### 9.8.1 Local prompt queue (both versions)

Both versions maintain a local queue of:

```ts
type SandboxHostPrompt = {
  hostPattern: { host: string; port?: number };
  resolvePromise: (allow: boolean) => void;
};
```

and render it using the sandbox permission dialog component:

- 2.0.69: `T70(...)`
- 2.0.67: `Lq2(...)`

The user can answer:

- Yes (allow once)
- Yes and don’t ask again for this host (persist allow rule)
- No (deny once), and Claude should be told what to do differently

Persisting “don’t ask again” writes a permission rule:

- `toolName: rX` (2.0.69) / `toolName: mW` (2.0.67)
- `ruleContent: domain:<host>`
- `behavior: allow` (or deny in the local prompt case)
- destination: `"localSettings"`

After writing settings:

- it calls `NB.refreshConfig()` to update sandbox config

Then it resolves all queued prompts for that host with the chosen boolean.

#### 9.8.2 Team-mediated network approvals (2.0.69 only)

2.0.69 adds a mode where a “worker” instance cannot decide network access; it must ask a “leader”.

Key functions:

- `cMA()` returns `true` when:
  - there is a team name (`hw()`)
  - `process.env.CLAUDE_CODE_AGENT_ID` exists
  - and `!PF8()` (likely: “not the leader / not in leader mode”)
- `CQ2()` generates request ids: `sandbox-${Date.now()}-${random}`
- `zQ2(host, requestId, teamName?)` attempts to send a “sandbox permission request” to the team leader via mailbox
- `qQ2({requestId, host, resolve})` registers a callback to resolve later when leader responds
- `UQ2(workerName, requestId, host, allow, teamName?)` sends leader’s response back to the worker

How the callback works inside `b0A`:

1. Sandbox calls `RX(hostPattern)`.
2. If `cMA()` is true:
   - it generates `requestId = CQ2()`
   - calls `zQ2(host, requestId)`
     - if that *fails*, it falls back to local prompt queue
     - if that *succeeds*, it:
       - registers the resolver callback via `qQ2({requestId, host, resolve})`
       - sets `AppState.pendingSandboxRequest = { requestId, host }`
       - (UI shows “Waiting for leader to approve network access to <host>”)
3. If `cMA()` is false: it always uses the local prompt queue.

Leader-side UI:

- 2.0.69 has `workerSandboxPermissions.queue` and overlay `"worker-sandbox-permission"`.
- It reuses the same `T70(...)` UI, but the `onUserResponse` path:
  - sends the decision to the worker via `UQ2(...)`
  - optionally persists an allow rule locally (only on “allow”)
  - pops the queue entry

In a TS rewrite this should become an explicit module:

- `team/permissionMailbox.ts`
- `sandbox/networkApproval.ts`
- `ui/NetworkApprovalDialog.tsx`

### 9.9 IDE integration: selection changes + auto-connect

There are two separate IDE-related pathways inside the UI root:

1. “Auto-connect IDE” effect: `vN2(...)`
   - watches a detected IDE server
   - if auto-connect is enabled (settings or env flags), it updates `dynamicMcpConfig` to include IDE connection info
   - if needed, triggers “IDE onboarding” UI and/or installs extensions

2. “Selection change” listener: `qq2` / `MN2`
   - subscribes to an IDE client’s `selection_changed` notifications
   - normalizes the selection into a small object:
     - `lineCount`, `lineStart`, `text`, `filePath`
   - stores it in state (`ideSelection`) and resets when the IDE client changes

This selection state is passed into slash commands and/or prompt-building to “attach” editor context.

### 9.10 Query submission pipeline (high-level)

The core flow is:

1. User submits input (`x3` / `h6` in the snippets).
2. The “command runner” (`c31` / `N61`) decides whether the input is:
   - a slash command
   - a mode switch
   - something to send to the model
3. If it needs the model:
   - it constructs a `ToolUseContext` object (`HZ` / `DZ`) which bundles:
     - `options` (tools, commands, model choice, maxThinkingTokens, MCP clients/resources, theme, etc.)
     - `getAppState` and `setAppState` (with special behavior: it injects `alwaysAllowRules.command`)
     - message state mutation callbacks
     - `readFileState` cache and file-history update hook
     - permission prompt queue hooks
     - UI setters for spinner, response length, tool JSX, etc.
4. It invokes the streaming model loop (`LU` / `kU`), pushing streamed messages into UI state.
5. It resets loading state at the end, increments counters, and triggers `onTurnComplete` if provided.

The important rewrite takeaway:

- `ToolUseContext` is the “god object” that many tools depend on.
- Splitting it into:
  - “core context” (messages + state + abort controller)
  - “ui services” (spinners, notifications, overlays)
  - “permission services”
  will make the TypeScript refactor much easier.

### 9.11 Differences between 2.0.67 and 2.0.69 in the UI root

The core structure is the same, but 2.0.69 adds new collaborative/sandbox features:

- 2.0.69 adds `workerSandboxPermissions` + `pendingSandboxRequest` to AppState and uses them in overlay selection/render.
- 2.0.69 adds team-mediated sandbox network approvals (`cMA`, `CQ2`, `zQ2`, `qQ2`, `UQ2`, plus mailbox poller integration).
- 2.0.69’s sandbox decision callback (`RX`) may choose between:
  - local prompt, or
  - “ask leader and wait”.
- 2.0.67’s sandbox decision callback (`NX`) always enqueues a local prompt and returns a promise.

Both versions share:

- tool permission prompts (per-tool allow/deny)
- worker permission prompts (leader approves tool uses)
- elicitation prompts
- transcript mode and hotkeys (just minified name differences)
- IDE onboarding + auto-connect scaffolding

---

## Chapter 10 — Session browser / resume picker UI

This chapter documents the “pick a conversation to resume” screen. It exists in both builds and shows a searchable list of prior sessions, then transitions into the main REPL with the loaded conversation.

There are two layers:

1. The *screen* component that handles loading logs and then mounting the main REPL after selection:
   - 2.0.69: `vd2(...)`
   - 2.0.67: `jm2(...)`
2. The *list* component that renders the session list and handles filtering/search/rename/preview:
   - 2.0.69: `UTA(...)`
   - 2.0.67: `LTA(...)`

### 10.1 Symbol map (2.0.67 ↔ 2.0.69)

Screen:

- 2.0.69: `vd2(props)` = session browser screen
- 2.0.67: `jm2(props)` = session browser screen

Cross-project helper + “different directory” message:

- 2.0.69: `w51(log, showAllProjects, worktreePaths)` = compute cross-project resume command (see 10.4)
- 2.0.67: `F51(log, showAllProjects, worktreePaths)` = same
- 2.0.69: `vD5({command})` = “This conversation is from a different directory… (copied)” message + auto-exit
- 2.0.67: `HE5({command})` = same
- 2.0.69: `Vn(text)` = copy-to-clipboard helper
- 2.0.67: `_n(text)` = same

List UI:

- 2.0.69: `UTA({logs, ...})` = conversation list UI (“Resume”)
- 2.0.67: `LTA({logs, ...})` = conversation list UI (“Resume Session”)

Log loading functions (inferred by call sites):

- 2.0.69: `wb(worktreePaths)` = load logs for the current repo/worktrees
- 2.0.69: `vNA()` = load logs for *all* projects
- 2.0.67: `pb(worktreePaths)` = same as `wb`
- 2.0.67: `gNA()` = same as `vNA`

Conversation loader:

- 2.0.69: `Dl(sessionRef, undefined)` = load a specific conversation and its file history snapshots
- 2.0.67: `Tl(sessionRef, undefined)` = same

### 10.2 When this UI is mounted

The CLI entrypoint mounts `vd2/jm2` when “resume intent” exists but the CLI doesn’t have an unambiguous session to load directly. Typical cases:

- user ran `claude --resume` without an id
- user ran `claude --continue` but there are multiple candidates / none
- user ran `claude --resume <query>` and it wasn’t an exact id (depending on feature flags)

It is also used *inside the REPL* via the `/resume` slash command (see Chapter 11), which mounts `UTA/LTA` in a local-jsx command UI.

### 10.3 `vd2` / `jm2`: screen-level behavior

Both versions implement the same 3-phase screen:

1. Show list of conversation logs.
2. When the user selects a log:
   - load the full conversation (`Dl/Tl`)
   - update global “current session id” tracking
   - mount the main REPL (`b0A/r0A`) with `initialMessages` + `initialFileHistorySnapshots`
3. If a session is from a different directory:
   - show a message containing a “cd … && claude --resume …” command
   - copy it to clipboard
   - exit shortly after

Concrete state (2.0.69 names; 2.0.67 analogous):

- `C`: `logs` (array), initialized from `initialLogs`
- `O`: `isLoadingLogs`
- `M`: `showAllProjects` toggle
- `T`: `loadedConversation` (object containing `messages` and maybe `fileHistorySnapshots`)
- `h`: `crossProjectCommand` string shown by `vD5`

#### 10.3.1 Log loading

`vd2/jm2` accepts `worktreePaths` from the CLI layer, then:

- filters out `isSidechain` logs for display (`m = C.filter((e)=>!e.isSidechain)`)
- exposes a “show all projects” toggle:
  - if OFF: load logs via `wb/pb(worktreePaths)` (repo-scoped)
  - if ON: load logs via `vNA/gNA()` (global)
- sets `isLoadingLogs` while reloading, and shows “Loading conversations…” UI.

There is also a feature-gated `onLogsChanged` callback:

- 2.0.69: `g = $b()` decides whether list changes (e.g., rename) should trigger reload
- 2.0.67: `u = cb()` equivalent

When enabled, the list component can call `onLogsChanged` after renames to refresh the list.

#### 10.3.2 Selecting a conversation

On selection, both versions do:

1. Determine whether the session is cross-project (`w51/F51`).
2. If cross-project and “not same repo worktree”:
   - copy a suggested resume command to clipboard
   - render `vD5/HE5` (different-directory message) and return early
3. Otherwise, load the conversation:
   - `conv = await Dl/Tl(selection)`
   - if `conv.sessionId` exists:
     - store it as the “current session id” (`E$` vs `y$`)
     - refresh auth/mcp state (best-effort) (`eL/DM`, `bHA/cHA`, plus a conditional `XQA()`)
4. Ensure some global readiness (`EI/JI` guarded by `!oD()/!AH()`).
5. Set `loadedConversation` → causes the main app to mount with:
   - `initialPrompt: ""` (empty)
   - `initialMessages: conv.messages`
   - `initialFileHistorySnapshots: conv.fileHistorySnapshots`

### 10.4 Cross-project resume helper: `w51` / `F51`

`w51(log, showAllProjects, worktreePaths)` attempts to answer:

- “If the user picked a conversation outside the current working directory, should we:
  - resume it here anyway, or
  - instruct them to `cd` and rerun `claude --resume <id>`?”

Observed behavior in both bundles:

- If `showAllProjects` is false, it returns `{ isCrossProject: false }` (because, by construction, the list should already be repo-scoped).
- If `showAllProjects` is true and `log.projectPath` differs from the current cwd:
  - it returns `{ isCrossProject: true, isSameRepoWorktree: false, command: "cd <projectPath> && claude --resume <sessionId>" }`
  - it uses the first `messages.find(m => m.sessionId)?.sessionId` as the id
  - it quotes/escapes the path via `w6/F3` (path shell-escaping helper)

Important nuance:

- Both functions contain dead/unreachable code that *appears* intended to detect “same repo worktree” by comparing `projectPath` to the provided `worktreePaths`.
- In the bundles as shipped, that `if (worktreePaths.some(...)) { isSameRepoWorktree: true }` branch is unreachable because the function returns earlier in an unconditional block.
- As a result, the UI always treats cross-project sessions as “not same worktree” and prints the `cd ... && claude --resume ...` command, even if the selected `projectPath` is within the allowed `worktreePaths`.

For the TypeScript rewrite, you’ll want to decide the intended semantics:

- Option A (current behavior): always force a separate `cd` + restart when resuming from another project.
- Option B (likely intended): allow “same repo different worktree” to resume in-process without forcing restart.

### 10.5 “Different directory” message: `vD5` / `HE5`

If the screen decides a session cannot be resumed in-process, it renders:

- “This conversation is from a different directory.”
- “To resume, run: `cd … && claude --resume …`”
- “(Command copied to clipboard)”

It also auto-exits shortly after rendering:

- `setTimeout(() => process.exit(0), 100)`

This is intentionally brief: it behaves like a “handoff instruction” screen.

### 10.6 Clipboard helper: `Vn` / `_n`

This helper tries platform-specific commands in order:

- macOS: `pbcopy`
- Linux: `xclip -selection clipboard` then `wl-copy`
- Windows: `clip`
- WSL: `clip.exe`

It logs an error for each failed command attempt, then logs a final failure if none work.

There is also a user-facing error message selector:

- 2.0.69: `$51()`
- 2.0.67: `H51()`

that returns a platform-specific “how to install clipboard tool” message.

### 10.7 Conversation list component: `UTA` / `LTA` (UI encyclopedia)

This is the heavyweight UI that makes `/resume` pleasant.

#### 10.7.1 Inputs

Both versions take:

- `logs`: array of “conversation log” items (includes `modified`, `messages`, `gitBranch`, optional `tag`, optional `projectPath`, etc.)
- `maxHeight`: height budget in rows
- `forceWidth`: optional width override
- `onCancel`: called when user cancels (often exits)
- `onSelect`: called with the chosen log
- `onLogsChanged`: optional callback (used after rename to refresh list)
- `initialSearchQuery`: optional query to seed search UI
- `showAllProjects`: whether to display `projectPath` and enable cross-project behaviors
- `onToggleAllProjects`: callback to toggle the above

#### 10.7.2 Internal modes (“view state”)

There is a `mode` state:

- `"list"`: normal browsing
- `"search"`: inline text entry after pressing `/` (simple substring filter)
- `"deep-search"`: fuzzy search / full-text search over a precomputed “searchableText”
- `"rename"`: rename focused session id → calls `rtA/ttA(sessionId, newTitle)`
- `"preview"`: open a preview UI for the focused session (component `ev2/Bv2`)

In TS, this wants to become a discriminated union:

```ts
type SessionBrowserMode =
  | { kind: "list" }
  | { kind: "search"; query: string }
  | { kind: "deepSearch"; query: string }
  | { kind: "rename"; sessionId: string; draft: string }
  | { kind: "preview"; log: Log };
```

#### 10.7.3 Filters supported

The list supports multiple orthogonal filters:

- Tag filter (if any logs have `.tag`):
  - “tabs” across `["All", ...sortedUniqueTags]`
  - `tab` cycles, `shift+tab` cycles backwards
  - analytics: `tengu_session_tag_filter_changed`
- Branch filter:
  - key: `b`
  - uses current git branch (loaded once via `If/jf()` on mount)
  - when enabled, filters `log.gitBranch === currentBranch`
- Simple search:
  - key: `/` enters search mode
  - filters by substring match against:
    - session display title (`LWA/PWA(log)`)
    - `gitBranch`
    - `tag`
  - exit via `esc` or `enter`, or deleting back to empty
- Deep search:
  - entered via `:` in some variants (the display line renders `:<query>`)
  - uses Fuse.js (`cU/Q$`) over `searchableText`
  - also records snippets, rendered under each result

#### 10.7.4 Keyboard shortcuts (from bundled logic)

In list mode:

- `a`: toggle “all projects” (only if `onToggleAllProjects` exists)
  - analytics: `tengu_session_all_projects_toggled`
- `b`: toggle branch filter
  - analytics: `tengu_session_branch_filter_toggled`
- `/`: toggle search input
  - analytics: `tengu_session_search_toggled`
- `r`: rename focused session (feature-flagged; only when “advanced resume UI” is enabled)
  - analytics: `tengu_session_rename_started`
- `p`: preview focused session (feature-flagged)
  - analytics: `tengu_session_preview_opened`

In rename mode:

- `esc`: cancel rename and return to list
- `enter`: submit rename (calls `rtA/ttA`)

In search / deep-search mode:

- `esc` / `enter`: exit mode and return to list
- backspace/delete edits the query; clearing the query exits

There is also “expand/collapse” behavior when sessions are grouped:

- if the currently-focused group is collapsed, UI hints: “· → to expand”
- once expanded: “· ← to collapse”
- analytics: `tengu_session_group_expanded`

#### 10.7.5 Grouped sessions (“forks”) and advanced layout

When the “advanced resume UI” flag is enabled (`$b/cb`), the list:

- groups logs by session id (and/or fork lineage) using `GI5/gY5`
- renders an “expanded” tree UI (`sv2/Av2`) with:
  - a group header node
  - child nodes for forks
- maintains a `Set` of expanded group keys to remember expand/collapse state

When the flag is disabled, it renders a plain options list (`S0`).

---

## Chapter 11 — Slash commands (command objects + `/resume` deep dive)

This chapter covers the CLI’s “slash command” system as it appears in the bundles, and then documents `/resume` end-to-end because it is both user-facing and a key integration point for session persistence.

### 11.1 Command “kinds” in the bundle

Commands are objects carried around in arrays and passed into the UI root (`b0A/r0A`). There are multiple command kinds; the bundle most clearly shows:

1. **`type: "local-jsx"`**
   - The command renders a React/Ink element (a mini-screen).
   - The command can also “finish” by calling an `onDone` callback, optionally with a message and display mode.
   - Examples:
     - `/resume` (2.0.67: `dY5`, 2.0.69: `JI5`)
     - `/exit` (2.0.67: `r61`, 2.0.69 equivalent exists)

2. **`type: "prompt"`**
   - The command returns a prompt template (messages) for the model to follow.
   - Often sourced from:
     - built-in command definitions
     - project `.claude/commands/*.md`
     - local `~/.claude/commands/*.md`
     - plugin command bundles

The TS rewrite should formalize these as explicit interfaces and remove the “duck-typing” feel.

### 11.2 How `/resume` is represented (2.0.67 ↔ 2.0.69)

2.0.69:

- Local-jsx command object: `JI5`
- Picker component: `YI5`
- Inline “result message” component: `fZ0`
- Error copy helper: `Vk2`
- Cross-project helper: `w51` (see Chapter 10)

2.0.67:

- Local-jsx command object: `dY5`
- Picker component: `mY5`
- Inline “result message” component: `DZ0`
- Error copy helper: `Iv2`
- Cross-project helper: `F51` (see Chapter 10)

### 11.3 `/resume` user experience (the “two modes”)

`/resume` supports two entry styles:

1. `/resume` with no args:
   - opens an interactive picker (`YI5/mY5`) which shows sessions and lets the user browse/search/filter/rename/preview (feature gated)
2. `/resume <arg>` with args:
   - tries to interpret `<arg>` as:
     - a session id, or
     - (if feature flag enabled) an exact match to a session title
   - if there isn’t a unique match, it prints a message telling the user what happened

### 11.4 `/resume` command callback contract

Both versions expect the host UI (the REPL) to provide a callback in the tool-use context:

- `context.resume?.(sessionId, log, entrypoint)`

The `/resume` command never directly rehydrates state itself; it delegates to `resume(...)`, then calls its own `onDone` with `{ display: "skip" }` to avoid printing extra text.

For the rewrite, canonicalize:

```ts
type ResumeEntrypoint =
  | "slash_command_picker"
  | "slash_command_session_id"
  | "slash_command_title";

type ResumeFn = (sessionId: string, log: SessionLog, entrypoint: ResumeEntrypoint) => Promise<void>;
```

### 11.5 `/resume` implementation details (with args)

2.0.69 logic (2.0.67 identical with renamed helpers):

1. Trim args string.
2. If no args:
   - mount the picker component (`YI5`).
3. Else:
   - load current-repo worktree paths via `Ic(pQ())` (2.0.67: `qc(cQ())`)
   - load repo-scoped logs via `wb(worktreePaths)` (2.0.67: `pb(worktreePaths)`)
4. Try to parse the arg as a session id:
   - 2.0.69: `QC(arg)` and `x_(log)` for log→id
   - 2.0.67: `KC(arg)` and `g_(log)`
   - if found, choose the most recently modified matching log and call `resume(...)` with entrypoint `"slash_command_session_id"`.
5. If feature flag `$b/cb` is enabled:
   - run exact title search:
     - 2.0.69: `fGA(arg, { exact: true })`
     - 2.0.67: `bGA(arg, { exact: true })`
   - if exactly 1 match: resume with entrypoint `"slash_command_title"`
   - if multiple: print “Found N sessions matching … Please use /resume to pick a specific session.”
6. Otherwise: print “Session … was not found.”

The “print a message” UI path uses a tiny component (`fZ0/DZ0`) that renders:

- `> /resume <args>` dimmed
- the error line
- then auto-calls `onDone(...)` on the next tick

### 11.6 `/resume` implementation details (interactive picker)

The picker component (`YI5/mY5`) is thin glue over the list UI (`UTA/LTA`):

- On mount:
  - fetch `worktreePaths` from the current cwd
  - load logs (repo-scoped by default)
- Supports “show all projects” toggle:
  - reloads logs using global loader `vNA/gNA`
- On select:
  1. extract the session id from the log (via `QC(x_(log))` / `KC(g_(log))`)
  2. compute cross-project behavior via `w51/F51`
  3. if cross-project:
     - if “same repo worktree”: resume immediately (intended; may be unreachable in the bundled helper as noted in Chapter 10)
     - otherwise:
       - copy a recommended `cd ... && claude --resume <id>` command to clipboard
       - print a multi-line user-display message explaining what to do
  4. else resume immediately with entrypoint `"slash_command_picker"`

Cancel path:

- prints “Resume cancelled” as a system message

### 11.7 Version differences highlighted by `/review` (a prompt command)

The `/review` command shows how command behavior changes across versions:

- 2.0.67: `/review` is a built-in `type: "prompt"` command that instructs Claude to:
  - use GitHub CLI (`gh pr ...`) via Bash
  - fetch diff and provide a code review
- 2.0.69: `/review` still exists but is replaced with a message telling the user it has moved to a plugin:
  - “install code-review@claude-code-marketplace”
  - “run /code-review:code-review”

This is important for a unified TS rewrite: you’ll need to decide whether “migrated to plugin” commands live in core or are generated from plugin metadata.

---

## Chapter 12 — Update/install/doctor + embedded ripgrep

This chapter documents the “distribution plumbing” baked into the CLI:

- `claude update` (check for updates, install if possible)
- `claude install` (install the native build, optionally a target version)
- `claude doctor` (diagnostic UI for updater + installation health)
- internal `--ripgrep` mode (executes a bundled/vendor ripgrep binary)

These pieces are crucial for a unified TypeScript rewrite because they sit at the boundary between:

- the JS/Node “launcher” and its packaging approach (native/bun vs npm)
- the user’s shell environment (PATH, permissions, multiple installations)
- bundled dependencies (ripgrep) that tools rely on

### 12.1 CLI surface: commands and internal flags

Both versions use commander-style parsing to expose:

- `claude doctor` — “Check the health of your Claude Code auto-updater”
- `claude update` — “Check for updates and install if available”
- `claude install [target]` — “Install Claude Code native build”
  - option: `--force`

Both versions also include an internal fast-path:

- `claude --ripgrep ...`
  - the CLI entrypoint detects `process.argv[2] === "--ripgrep"` and then calls `ripgrepMain(args)`
  - this is used as the “embedded rg runner” for tools and diagnostics

### 12.2 `claude update`: `nc2` (2.0.69) vs `cd2` (2.0.67)

`nc2/cd2` is the implementation of `claude update`.

High-level flow:

1. Emit analytics:
   - `tengu_update_check`
2. Print current version.
3. Compute update channel:
   - 2.0.69 reads `R7()?.autoUpdatesChannel ?? "latest"`
4. Run diagnostic:
   - `diagnostic = await ZXA()`
   - logs “Installation type” and “Config install method”
5. Print warnings from the diagnostic:
   - multiple installations found
   - PATH issues, leftover orphan installs, missing permissions, etc.
6. If `installMethod` is missing in config, set it based on installation type.
7. Branch by installation type:
   - `development`: cannot update
   - `package-manager`: instruct to update via package manager (special-cases Homebrew)
   - `native`: run the native updater (`$h` / `ph`) and report success/up-to-date/lock-held
   - (other types exist in the diagnostic: `npm-global`, `npm-local`, `unknown`; update logic continues beyond the snippet, but diagnostic warnings already cover common remediation)

Key user-visible behaviors:

- If multiple installs exist, it prints each install path and marks the currently-running one.
- If config’s `installMethod` disagrees with what’s running, it warns and updates config to match.
- For Homebrew installs, it prints `brew upgrade claude-code` when an update is available.
- For native installs, it handles “another process holds a lock” and suggests trying again.

### 12.3 Installation diagnostic: `ZXA()`

`ZXA()` is the “what is installed and how healthy is it?” function used by:

- `claude update` (preflight + warning printer)
- `claude doctor` (diagnostic UI)

Observed return shape (inferred from call sites and printed fields):

```ts
type InstallationType =
  | "development"
  | "package-manager"
  | "native"
  | "npm-global"
  | "npm-local"
  | "unknown";

type RipgrepStatus = {
  working: boolean;
  mode: "builtin" | "system";
  systemPath: string | null; // only when mode === "system"
};

type InstallationDiagnostic = {
  installationType: InstallationType;
  version: string;
  installationPath: string;   // “where the running install lives”
  invokedBinary: string;      // argv0/argv1-ish
  configInstallMethod: string; // derived from settings ("global"/"local"/"native"/"unknown"/"not set")
  autoUpdates: string;        // “enabled/disabled (reason)” summary
  hasUpdatePermissions: boolean | null;
  packageManager?: string;    // e.g. "homebrew"
  multipleInstallations: Array<{ type: string; path: string }>;
  warnings: Array<{ issue: string; fix: string }>;
  recommendation?: string;    // doctor UI renders as 2 lines (headline + details)
  ripgrepStatus: RipgrepStatus;
};
```

`ZXA()` is not a simple “detect install type” helper — it also:

- enumerates multiple installs (native, npm-global, npm-local, orphaned node_modules, etc.)
- produces suggested fixes (commands like `rm -rf ...`, PATH edits, uninstall instructions)
- checks update permissions for npm-global installs (detects whether `npm install -g` can run without sudo)
- checks ripgrep availability and mode

In a TS rewrite, treat this as a “diagnostics module” with its own testable pure helpers:

- path detection
- OS-specific fix messages
- lock inspection
- permissions probing

### 12.4 `claude doctor`: UI screen `W51` (2.0.69) / `Z51` (2.0.67)

`doctor` mounts a small UI that prints a multi-section report and exits when done.

The UI:

- loads `diagnostic = await ZXA()`
- inspects agent directories:
  - user agents dir (`~/.claude/.../agents` style)
  - project agents dir (`<repo>/.claude/agents`)
  - shows parse errors if any agent files failed to parse
- inspects plugin errors (`Q.plugins.errors`)
- inspects invalid settings (filters out `mcpErrorMetadata` to avoid noise)
- summarizes environment variable issues via `zy2/wx2` (returns a list of `{name, status, message}`)
- prints ripgrep health:
  - “Search: OK/Not working (bundled/vendor/system <path>)”

It also has optional version-lock inspection:

- 2.0.69 checks `Si()` to decide whether version locks are relevant (likely “native build / bun embedded”)
- it computes `locksDir`, cleans stale locks, and lists active locks with PID and “running/stale” status

Exit behavior:

- It listens for `Enter`, `Esc`, or `Ctrl+C` and then calls `onDone("...dismissed", {display:"system"})`.

### 12.5 Native updater: `$h` (2.0.69) / `ph` (2.0.67)

The “native install” update mechanism is distinct from npm installs. It uses:

- a “versions directory” (stores multiple native binaries)
- a “staging directory” (temporary download/install)
- a “locks directory” (to avoid multiple processes updating at once)

The native updater function:

- checks whether auto-updater is allowed/enabled (2.0.69: `xOA()`, 2.0.67: `bOA()`)
- checks “latest version” via `S90/E90` (network fetch; returns string version or null)
- attempts to install/switch to that version via `QL8/oN8`
  - returns `{ success, lockHolderPid? }` when it can’t acquire the update lock
- if it successfully installs (or even just detects success), it updates config to:
  - `installMethod: "native"`
  - `autoUpdates: false`
  - `autoUpdatesProtectedForNative: true`
  - (meaning: prevent legacy auto-updater from toggling back on)

There is also ongoing housekeeping:

- cleanup of old Windows executables (`claude.exe.old.*`)
- cleanup of stale staging dirs and temp install artifacts
- cleanup of old versions beyond a retention count, respecting locks
- acquisition of a “running version” lock so a running version isn’t deleted by cleanup

### 12.6 `claude install [target]`: reusing an internal installer

The top-level `install` command doesn’t implement installation directly. Instead, it:

1. Ensures setup is initialized (`m71/v71(...)`).
2. Calls an internal `.call(...)` handler (`rc2` in 2.0.69, `id2` in 2.0.67) with:
   - `target` (positional arg; “stable/latest/specific version” semantics)
   - `--force` translated into extra args
3. Exits with code based on whether the returned status string includes `"failed"`.

This implies the installer logic is also available inside the REPL as a command, and the top-level command is a thin wrapper.

### 12.7 Embedded ripgrep: internal `--ripgrep` and selection logic

The bundles include a “ripgrep abstraction” so tools can rely on `rg` even when:

- the system doesn’t have ripgrep installed
- the CLI runs as a bundled “native” build with vendored binaries

Two core concepts:

1. **Config selection** (agent build names; code build analogous):
   - `iSA()` returns a `{ mode, command, args }` triple:
     - `mode: "system"` uses `rg` from PATH
     - `mode: "builtin"` uses a packaged ripgrep binary
   - It respects env flags such as:
     - `USE_BUILTIN_RIPGREP` (forces builtin)
2. **Health check / caching**:
   - first-use test runs `rg --version` with a timeout
   - caches `{ working, lastTested, config }`
   - emits `tengu_ripgrep_availability` analytics

The entrypoint’s internal mode:

- when invoked as `claude --ripgrep <args...>`:
  - the CLI loads a small module that exports `ripgrepMain`
  - runs `ripgrepMain(args)` and sets `process.exitCode`
  - returns without starting the main UI

This is used in native/bundled contexts where the “real rg binary” is shipped inside the app and can be accessed relative to the executable.

The doctor UI uses this indirectly:

- it prints a “Search: OK/Not working” line and reports whether the active rg is:
  - “bundled” (bun embedded)
  - “vendor” (shipped under `vendor/ripgrep/...`)
  - “system” (from PATH, with an explicit path)

### 12.8 Auto-updater notifications surfacing in the main UI

The REPL root component stores an “auto updater result” object in state and, when present, pushes any `notifications` into AppState’s notification queue with low priority:

- `addNotification({ key: "auto-updater-notification", text: ..., priority: "low" })`

This is how background update checks can surface “there is a newer version” hints without interrupting the main loop.

---

## Chapter 13 — Built-in background agents (Magic Docs + classifier + session memory + prompt suggestion)

This chapter documents two built-in “background” subsystems intended to run in the **main REPL thread**:

1. **Magic Docs**: keeps special docs current by re-running an **Edit-only** agent against files marked with `# MAGIC DOC: ...`.
2. **Session quality classifier**: classifies the current conversation for telemetry signals (frustration + explicit “create a PR” requests).

As we keep digging, Chapter 13 is also becoming the place to document two additional “background-ish” subsystems that share a similar shape (agent-like logic + feature flags + intended-to-run automatically):

3. **Session memory**: maintains a structured notes file under the config dir and can use it to compact conversation history.
4. **Prompt suggestion**: generates a short “what to do next” suggestion for the UI.

### 13.1 Symbol map (2.0.67 ↔ 2.0.69)

#### Magic Docs agent (“# MAGIC DOC: …”)

Primary entrypoints (all clustered around the same area of the bundle):

- 2.0.67: `ClaudeAgentSDKCode/cli.js:4543`
- 2.0.69: `ClaudeCodeCode/cli.js:4533`

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Load prompt template from config dir (fallback to built-in default) | `tV5()` | `UD5()` |
| Embedded default prompt template provider | `sV5()` | `zD5()` |
| `{{var}}` template substitution | `eV5(template, vars)` | `$D5(template, vars)` |
| Build per-doc prompt (includes optional per-doc instructions) | `uu2(contents, path, title, instructions?)` | `lm2(...)` |
| Parse Magic Doc header (+ optional italicized instruction line) | `BE5(contents)` | `qD5(contents)` |
| Agent definition object | `GE5()` | `LD5()` |
| “Update this magic doc” loop (read → prompt → stream agent) | `ZE5(docRef, ctx)` | `MD5(docRef, ctx)` |
| Module init + background trigger | `cu2` | `am2` |
| Empty placeholder | `du2()` | `nm2()` |
| Tracked docs registry (`Map`) | `q71` | `T71` |

#### Session quality classifier agent

Primary entrypoints:

- 2.0.67: `ClaudeAgentSDKCode/cli.js:4552`
- 2.0.69: `ClaudeCodeCode/cli.js:4542`

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Extract user utterances (bounded length) | `pu2(messages)` | `om2(messages)` |
| Format conversation summary (assistant hidden) | `JE5(lines)` | `RD5(lines)` |
| Parse classifier XML-ish output | `IE5(text)` | `_D5(text)` |
| Empty placeholder | `lu2()` | `rm2()` |
| Agent config object (`{ name, shouldRun, buildMessages, ... }`) | `XE5` | `TD5` |
| Module init | `iu2` | `sm2` |

#### Shared helpers used by both agents

These aren’t “owned” by either subsystem, but both rely on them:

- Tool-use guard: scans backward for the most recent **assistant** message and returns `true` if its content contains a `tool_use` block (so most callsites use `!DTA(...)` / `!ITA(...)` to mean “safe to do background work”):
  - 2.0.67: `DTA(messages)` at `ClaudeAgentSDKCode/cli.js:2929`
  - 2.0.69: `ITA(messages)` at `ClaudeCodeCode/cli.js:2931`
- XML-ish tag extraction helper (used by the classifier’s `parseResponse`):
  - 2.0.67: `t2(xml, tagName)` at `ClaudeAgentSDKCode/cli.js:2929`
  - 2.0.69: `Q9(xml, tagName)` at `ClaudeCodeCode/cli.js:2931`

#### 13.1.1 Execution model: “post-sampling hooks” (`XB1`)

Both bundles include a small “background callback” registry that appears intended to run after a model sampling step:

- Register a hook:
  - 2.0.67: `XB1(fn)` at `ClaudeAgentSDKCode/cli.js:1774` (pushes into `m12`)
  - 2.0.69: `XB1(fn)` at `ClaudeCodeCode/cli.js:1774` (pushes into `j02`)
- Run all hooks (sequentially, `await` each):
  - 2.0.67: `d12(messages, systemPrompt, userContext, systemContext, toolUseContext, querySource)` at `ClaudeAgentSDKCode/cli.js:1774`
  - 2.0.69: `P02(messages, systemPrompt, userContext, systemContext, toolUseContext, querySource)` at `ClaudeCodeCode/cli.js:1774`

The runner constructs a single context object:

`{ messages, systemPrompt, userContext, systemContext, toolUseContext, querySource }`

and then calls each registered hook as `await hook(ctx)`, logging failures as `Post-sampling hook failed: ...`.

Important wiring observations in these bundles:

- A repository-wide search for `XB1(` returns only 2 matches per build: the `XB1` definition itself and the **session memory** registration:
  - 2.0.67: `hu2()` calls `XB1(oV5)` at `ClaudeAgentSDKCode/cli.js:4494`
  - 2.0.69: `cm2()` calls `XB1(FD5)` at `ClaudeCodeCode/cli.js:4484`
- The hook runner is actually invoked from the core query pipeline (after the model has produced output), so registered hooks are *wired*:
  - 2.0.67: `if ($.length > 0) d12([...D, ...$], Q, B, G, Y, W)` at `ClaudeAgentSDKCode/cli.js:1780`
  - 2.0.69: `if (O.length > 0) P02([...H, ...O], Q, B, G, Y, W)` at `ClaudeCodeCode/cli.js:1780`
- There is still **no evidence** that Magic Docs’ background callback (`IYY` / `wIY`) or the session quality classifier config (`XE5` / `TD5`) are registered/scheduled via `XB1` in these bundles.

#### 13.1.2 Session memory symbol map (2.0.67 ↔ 2.0.69)

Primary entrypoints:

- 2.0.67: `ClaudeAgentSDKCode/cli.js:4458` and `ClaudeAgentSDKCode/cli.js:4494`
- 2.0.69: `ClaudeCodeCode/cli.js:4448` and `ClaudeCodeCode/cli.js:4484`

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Load notes template (config override → built-in default) | `vu2()` | `hm2()` |
| Load session-memory prompt (config override → built-in default) | `mV5()` | `XD5()` |
| Build prompt string from current notes | `ku2(currentNotes, notesPath)` | `gm2(currentNotes, notesPath)` |
| Split notes into sections + estimate token sizes | `dV5(notes)` + `cV5(sectionSizes)` | `WD5(notes)` + `KD5(sectionSizes)` |
| “Should run update now?” gate | `nV5(messages)` | `DD5(messages)` |
| Session-memory directory path (session-scoped) | `Y71()` | `V71()` |
| Notes file path (`summary.md`) | `$Q1()` | `$Q1()` |
| Read/create notes file and return contents | `aV5(toolUseCtx)` | `HD5(toolUseCtx)` |
| Module init (register post-sampling hook) | `hu2()` | `cm2()` |
| Post-sampling hook function | `oV5(ctx)` | `FD5(ctx)` |
| “Update in progress” marker (set/clear + waiter) | `qrB()` / `LrB()` / `MrB()` | `AsB()` / `QsB()` / `BsB()` |
| Notes contents reader (sync) | `OrB()` | `GsB()` |
| Store/load “last UUID included in notes” checkpoint | `NrB(uuid)` / `wrB()` | `erB(uuid)` / `trB()` |
| Permission allowlist predicate (session memory reads) | `AK5(path)` | `NV5(path)` |
| Feature gate for notes-based compaction | `LQ1()` | `LQ1()` |
| Notes-based compaction builder | `MQ1(messages, agentId, threshold?)` | `MQ1(messages, agentId, threshold?)` |
| Auto-compact path that tries notes-based compaction first | `xrB(messages, ctx, querySource)` | `wsB(messages, ctx, querySource)` |
| Config + thresholds (2.0.69 only) | *(none)* | `ZsB(config)` / `YsB()` / `VsB()` / `EsB()` / `DsB()` |
| Telemetry for extraction (2.0.69 only) | *(none)* | `tengu_session_memory_extraction` |

#### 13.1.3 Prompt suggestion symbol map (2.0.67 ↔ 2.0.69)

Primary entrypoints:

- 2.0.67: `ClaudeAgentSDKCode/cli.js:1774`
- 2.0.69: `ClaudeCodeCode/cli.js:1774`

| Concept | 2.0.67 symbol | 2.0.69 symbol |
|---|---:|---:|
| Init (feature flag + env override) | `r12()` | `h02()` |
| Run (attempt generation, then write to AppState) | `s12(ctx)` | `g02(ctx)` |
| Generate suggestion via forked query | `mD8(ctx)` | `nH8(ctx)` |
| Suppress heuristics (too long, formatting, etc.) | `dD8(text)` | `aH8(text)` |
| Suppression telemetry | `NQ0(reason, text)` | `cQ0(reason, text)` |
| Feature flag name | `uD8="tengu_prompt_suggestion"` | `lH8="tengu_prompt_suggestion"` |
| UI callsite | *(no callsite found)* | `g02(...)` called in the main UI loop (`ClaudeCodeCode/cli.js:2645`) |

### 13.2 Magic Docs agent (“# MAGIC DOC: …”)

The Magic Docs system is built around a strict file marker:

```
# MAGIC DOC: <title>
```

Optionally, the doc can include a **single italicized instruction line** immediately after the header (either `*...*` or `_..._`). This line becomes “document-specific update instructions” that are spliced into the system prompt.

#### 13.2.1 Prompt template: config override + built-in default

- 2.0.67: `tV5()` at `ClaudeAgentSDKCode/cli.js:4543`
- 2.0.69: `UD5()` at `ClaudeCodeCode/cli.js:4533`

Behavior:

- Looks for a prompt template at:
  - 2.0.67: `join(uQ(), "magic-docs", "prompt.md")`
  - 2.0.69: `join(mQ(), "magic-docs", "prompt.md")`
- If that file exists and can be read, uses its contents.
- Otherwise falls back to an embedded default template:
  - 2.0.67: `sV5()` at `ClaudeAgentSDKCode/cli.js:4494`
  - 2.0.69: `zD5()` at `ClaudeCodeCode/cli.js:4484`

The template is rendered with naive global string replacement:

- 2.0.67: `eV5(template, vars)` at `ClaudeAgentSDKCode/cli.js:4543`
- 2.0.69: `$D5(template, vars)` at `ClaudeCodeCode/cli.js:4533`

It replaces every `{{key}}` with the corresponding string value from `vars`.

#### 13.2.2 Header + instruction parsing

- 2.0.67: `BE5(contents)` at `ClaudeAgentSDKCode/cli.js:4550`
- 2.0.69: `qD5(contents)` at `ClaudeCodeCode/cli.js:4540`

Behavior:

- Title extraction:
  - matches `^#\\s*MAGIC\\s+DOC:\\s*(.+)$` (case-insensitive, multiline)
  - trims the captured title
- Instruction extraction:
  - looks at the first “contentful” line after the header (allows an extra blank line)
  - if that line matches `^[_*](.+?)[_*]\\s*$`, it uses the captured inner string as `instructions`.

Canonical TS:

- `parseMagicDocHeader(contents: string): { title: string; instructions?: string } | null`

#### 13.2.3 Running the updater (Edit-only agent sandboxing)

- 2.0.67: `ZE5(docRef, ctx)` at `ClaudeAgentSDKCode/cli.js:4550`
- 2.0.69: `MD5(docRef, ctx)` at `ClaudeCodeCode/cli.js:4540`

High-level loop per doc:

1. Ensure the file still exists; otherwise delete from the registry (`q71` / `T71`).
2. Read the file content via an internal file-read tool (`H6.call(...)` / `V3.call(...)` with `{ file_path }`).
3. If the file no longer has a Magic Doc header, drop it from the registry.
4. Build a per-doc prompt (`uu2(...)` / `lm2(...)`) that includes:
   - `docContents`, `docPath`, `docTitle`
   - optional “DOCUMENT-SPECIFIC UPDATE INSTRUCTIONS” block if an italic line was found
5. Run the agent via the shared streaming agent runner (`sIA(...)`).

Important safety property: this agent defines a per-run `canUseTool` guard that only allows:

- the Edit tool (`i6` / `m3`), and
- only when `input.file_path === docRef.path`.

Everything else is denied with a clear “only Edit is allowed for <path>” message.

Canonical TS boundaries:

- `loadMagicDocsPromptTemplate(): Promise<string>`
- `buildMagicDocUpdatePrompt(args): Promise<string>`
- `runMagicDocUpdate(docRef, ctx): Promise<void>`

#### 13.2.4 Background trigger and registry mechanics (WIP)

- 2.0.67: `cu2 = q(() => { ... })` at `ClaudeAgentSDKCode/cli.js:4550`
- 2.0.69: `am2 = L(() => { ... })` at `ClaudeCodeCode/cli.js:4540`

This initializer:

- creates the header regexes
- creates the registry map (`q71` / `T71`)
- defines a background callback (`IYY = iP(...)` / `wIY = yP(...)`) that:
  - runs only when `querySource === "repl_main_thread"`
  - skips when the last assistant message contains a `tool_use` block (`DTA(messages)` / `ITA(messages)`)
  - iterates every registered doc and calls `ZE5/MD5` to update it

However, in these bundles there is **no callsite** that registers this callback into the post-sampling hook registry (`XB1(...)`; see §13.1.1), so this “background trigger” appears inert even if the registry map were populated.

What’s still missing in this encyclopedia:

- The exact callsites that **populate** the registry map (`q71` / `T71`) with `{ path: string, ... }` doc refs.
  - In both builds, a search for `q71` / `T71` only turns up the Magic Docs module itself (delete/size/values usage), and there are no direct `.set(...)` callsites to point at.
- Any callsite that registers `IYY` / `wIY` with `XB1(...)` (or an alternative scheduler).

#### 13.2.5 When this code is initialized

Both bundles initialize Magic Docs during the “main UI import” bootstrap:

- 2.0.67: `Ec2()` calls `cu2()` at `ClaudeAgentSDKCode/cli.js:4760`
- 2.0.69: `Cp2()` calls `am2()` at `ClaudeCodeCode/cli.js:4750`

This means the Magic Docs machinery is available in normal REPL sessions, but it will remain inert unless something both:

- populates the registry map (`q71` / `T71`), and
- registers the callback (`IYY` / `wIY`) with `XB1(...)` (or another scheduler).

### 13.3 Session quality classifier (frustration + PR request)

This is a low-cost classifier that watches user messages and emits telemetry only when it detects one of two signals:

1. The user seems frustrated.
2. The user explicitly asked to send/create/open/push a GitHub pull request.

#### 13.3.1 Input extraction and prompt construction

- 2.0.67: `pu2(messages)` / `JE5(lines)` at `ClaudeAgentSDKCode/cli.js:4550`
- 2.0.69: `om2(messages)` / `RD5(lines)` at `ClaudeCodeCode/cli.js:4540`

Behavior:

- Pulls only `type === "user"` messages.
- Extracts text from either:
  - `message.content` as a string, or
  - an array of content blocks, concatenating `type === "text"` blocks.
- Trims and truncates each user message to `300` chars (`YE5` / `OD5`).
- Formats the conversation as repeated two-line blocks:
  - `User: ...`
  - `Asst: [response hidden]`

The agent prompt asks the model to emit two tags:

- `<frustrated>true/false</frustrated>`
- `<pr_request>true/false</pr_request>`

(See the literal prompt at `ClaudeAgentSDKCode/cli.js:4552` and `ClaudeCodeCode/cli.js:4542`.)

#### 13.3.2 Parsing and telemetry emission

- 2.0.67: `IE5(text)` at `ClaudeAgentSDKCode/cli.js:4552`
- 2.0.69: `_D5(text)` at `ClaudeCodeCode/cli.js:4542`

These parse the XML-ish response by extracting the inner text of the `frustrated` and `pr_request` tags and comparing against the string `"true"`.

The agent is configured with:

- `useTools: false` (pure classifier)
- a fixed `systemPrompt` describing the classification task
- a `logResult(...)` callback that emits `tengu_session_quality_classification` **only if at least one signal is true**
  - fields: `uuid`, `isFrustrated`, `hasPRRequest`, `messageCount`

#### 13.3.3 When this code is initialized

Like Magic Docs, the classifier is initialized as part of the “main UI import” bootstrap:

- 2.0.67: `Ec2()` calls `iu2()` at `ClaudeAgentSDKCode/cli.js:4760`
- 2.0.69: `Cp2()` calls `sm2()` at `ClaudeCodeCode/cli.js:4750`

At runtime, if something invokes this classifier config, it only considers `querySource === "repl_main_thread"`, and it only emits telemetry when at least one flag is true.

Wiring status in these bundles:

- A repository-wide search for the literal classifier name `session_quality_classifier` only finds the config object definition itself (`XE5` / `TD5`) at `ClaudeAgentSDKCode/cli.js:4552` and `ClaudeCodeCode/cli.js:4542`.
- No callsites were found that invoke `XE5.shouldRun(...)` / `TD5.shouldRun(...)` or otherwise schedule this classifier, so it appears to be defined but unused in these bundled builds.

### 13.4 Session memory (notes file + update agent + notes-based compaction)

Session memory is a per-session “notes file” mechanism with **two distinct faces** in the bundles:

1. A **user-facing** “add memory” path (UI `mode: "memorySelect"`, typically entered via `#`) that appends bullet items to the notes file and shows a “Memory updated … · /memory to edit” notification.
2. A **background update agent** (implemented as a post-sampling hook) that periodically rewrites a structured notes template via a forked `EB1(...)` query, and (optionally) enables notes-based auto-compaction.

#### 13.4.1 Notes template + prompt files

Both builds allow overriding two session-memory files:

- Template: `.../session-memory/config/template.md` (`vu2()` / `hm2()`)
- Prompt: `.../session-memory/config/prompt.md` (`mV5()` / `XD5()`)

If the override files do not exist (or fail to load), the code falls back to an embedded default template string (`gV5` / `JD5`) and a built-in prompt string provider (`uV5()` / `ID5()`).

The “build prompt” helper (`ku2` / `gm2`) also parses the current notes file into sections and appends “please condense section X” warnings if any section is over ~`2000` tokens (`yu2` / `bm2`).

Paths worth separating (these are different roots):

- **Config override root** (prompt/template overrides):
  - 2.0.67: `join(uQ(), "session-memory")` (assigned as `oA0`) at `ClaudeAgentSDKCode/cli.js:1635`
  - 2.0.69: `join(mQ(), "session-memory")` (assigned as `K10`) at `ClaudeCodeCode/cli.js:1635`
- **Session-scoped notes directory**:
  - 2.0.67: `Y71() = join(FH(s1()), W0(), "session-memory") + UQA` at `ClaudeAgentSDKCode/cli.js:4393`
  - 2.0.69: `V71() = join(KH(r1()), W0(), "session-memory") + IQA` at `ClaudeCodeCode/cli.js:4383`
- **Session-scoped notes file**:
  - 2.0.67: `$Q1() = join(Y71(), "summary.md")` at `ClaudeAgentSDKCode/cli.js:4393`
  - 2.0.69: `$Q1() = join(V71(), "summary.md")` at `ClaudeCodeCode/cli.js:4383`

#### 13.4.2 User input: “add memory” (append-only helper; `mode: "memorySelect"`)

Primary entrypoints:

- 2.0.67: `m$2(input, precedingBlocks, attachments, toolUseCtx, memoryPath)` at `ClaudeAgentSDKCode/cli.js:2644`
  - writer: `g$2 = iP(async (text, toolUseCtx, memoryPath) => ...)` at `ClaudeAgentSDKCode/cli.js:2643`
- 2.0.69: `nN2(input, precedingBlocks, attachments, toolUseCtx, memoryPath)` at `ClaudeCodeCode/cli.js:2645`
  - writer: `lN2 = yP(async (text, toolUseCtx, memoryPath) => ...)` at `ClaudeCodeCode/cli.js:2644`

Both bundles include a user-input path that:

- Logs `tengu_input_memory` for the user action.
- Normalizes the added line into a `- ...` bullet (via `H65` / `Z55`).
- Appends to the memory file path and updates `readFileState` to match.
- Emits `tengu_add_memory_start` + `tengu_add_memory_success` / `tengu_add_memory_failure`.
- Shows a notification with a “Memory updated in … · /memory to edit” UI component (`b$2` / `cN2`).

This path appears independent of the background update hook (it writes content but does not set the “checkpoint UUID” used by notes-based compaction).

#### 13.4.3 Background update agent (hook registration + execution)

**Registration**

- 2.0.67: `hu2()` registers `oV5` via `XB1(oV5)` (`ClaudeAgentSDKCode/cli.js:4494`)
- 2.0.69: `cm2()` registers `FD5` via `XB1(FD5)` (`ClaudeCodeCode/cli.js:4484`)

Both are gated on `JZ("tengu_session_memory")`, and both skip entirely if auto-compaction is disabled at the settings/env level (`Sh()` / `Jh()`).

**Execution guard**

The update hook is only intended to run in the main REPL thread (`querySource === "repl_main_thread"`) and uses different heuristics:

- 2.0.67: `nV5(messages)` runs when either:
  - the most recent assistant message does **not** contain `tool_use` (`!DTA(messages)`), or
  - there have been ≥3 assistant tool calls since the last “checkpoint UUID” (`lV5=3`, tracked via `bu2` + `iV5`).
- 2.0.69: `DD5(messages)` adds richer gating:
  - waits until a minimum token count has accrued (`VsB()` vs `minimumMessageTokensToInit`)
  - then only triggers when both:
    - enough tokens have accumulated since the last update (`EsB()`), and
    - enough tool calls have occurred since the last checkpoint (`ED5(...) >= DsB()`),
    - or “enough tokens since last update” and “latest assistant has no tool_use” (`!ITA(messages)`).
  - The thresholds come from `WMA` defaults, can be overridden via remote config `cx("tengu_sm_config", {})`, and are stored in `cYA` (`ZsB` / `YsB`).

**Hook body**

Both hooks:

1. Ensure the session-memory directory exists, and ensure the notes file exists (write the default template if missing).
2. Read the notes file using the Read tool (`H6` / `V3`) to seed `readFileState`.
3. Build a prompt using `ku2(...)` / `gm2(...)`.
4. Run a forked query (`EB1`) with:
   - `querySource: "session_memory"`, `forkLabel: "session_memory"`
   - tools denied except “Edit the notes file at exactly this path”
5. If the latest assistant message has **no** tool-use, store its UUID as the next “checkpoint UUID” (`NrB` / `erB`).

2.0.69 additionally emits `tengu_session_memory_extraction` with model usage and the active config thresholds.

**Wiring status**

The post-sampling hook runner (`d12` / `P02`) is invoked from the core query pipeline, so the session-memory update hook is not “just registered” — it can actually run (subject to `querySource === "repl_main_thread"` and the gating heuristics):

- 2.0.67: `d12([...D, ...$], Q, B, G, Y, W)` at `ClaudeAgentSDKCode/cli.js:1780`
- 2.0.69: `P02([...H, ...O], Q, B, G, Y, W)` at `ClaudeCodeCode/cli.js:1780`

#### 13.4.4 Notes-based compaction (prefers session memory checkpoint)

Both bundles add an “auto-compact” fast path that tries to compact using session memory notes *before* falling back to normal summarization compaction:

- Gate: `LQ1()` requires both `JZ("tengu_session_memory")` and `JZ("tengu_sm_compact")`.
- Builder: `MQ1(messages, agentId, threshold?)`:
  - waits for any ongoing memory update to finish (`MrB` / `BsB`)
  - reads the last stored checkpoint UUID (`wrB` / `trB`) and notes file contents (`OrB` / `GsB`)
  - finds that UUID inside `messages`, and replaces earlier history with:
    - a compaction boundary marker
    - a single “summary” message whose content is literally the notes file, wrapped/normalized (`deA` / `geA`)
    - optional attachments
    - the messages after the checkpoint UUID (“messagesToKeep”)
  - rejects compaction if the estimated post-compact token count still exceeds the auto-compact threshold (logs `tengu_sm_compact_threshold_exceeded`)
- Auto path: `xrB(...)` / `wsB(...)` calls `MQ1` first, then falls back to the normal compactor `CQ1(...)` if needed.

#### 13.4.5 “Past session” memory injection block (`attachment.type === "memory"`)

Independently of the current session’s notes file, both bundles can inject **previews of past session notes** into the model context by rendering an attachment of type `"memory"` into a single meta system message:

- 2.0.67: `case "memory": ... <session-memory> ... </session-memory>` at `ClaudeAgentSDKCode/cli.js:3072`
- 2.0.69: `case "memory": ... <session-memory> ... </session-memory>` at `ClaudeCodeCode/cli.js:3074`

The injected `<session-memory>` message:

- concatenates `A.memories` into repeated “## Previous Session (date)” blocks
- includes `fullPath` to the *full* notes file (with an optional “(N more lines in full file)” hint)
- warns that these summaries may be unrelated/outdated and instructs the agent to use the Read tool with the provided paths when a past session is truly relevant

### 13.5 Prompt suggestion (UI “what to do next”)

Prompt suggestion is a small forked-query subsystem that tries to generate a short “what should we do next?” string and store it into AppState for the UI to display.

#### 13.5.1 Feature gate + init

Both builds initialize a boolean `CB1`:

- If `process.env.CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION === "false"` → disabled
- If `=== "1"` → enabled
- Otherwise → `CB1 = await JZ("tengu_prompt_suggestion")`

Init is called during startup:

- 2.0.67: `r12()` at `ClaudeAgentSDKCode/cli.js:4692`
- 2.0.69: `h02()` at `ClaudeCodeCode/cli.js:4682`

#### 13.5.2 Generation + suppression

Both builds run a forked query (`EB1`) with:

- `querySource: "prompt_suggestion"`, `forkLabel: "prompt_suggestion"`
- tools denied (suggestion-only)
- output postprocessed to extract a single assistant `text` block and `trim()`.

The suppression filter (`dD8` / `aH8`) drops suggestions that are empty, `"done"`, ≥100 chars, contain formatting, look like context-limit errors, or are gratitude/closure messages, and logs `tengu_prompt_suggestion { outcome: "suppressed", reason: ... }`.

#### 13.5.3 Wiring status (2.0.67 vs 2.0.69)

- 2.0.69: `g02(...)` is called directly from the main UI loop (`ClaudeCodeCode/cli.js:2645`), so prompt suggestion appears wired.
- 2.0.67: no callsites were found for `s12(...)`, so prompt suggestion appears defined but unused in that build.

## Chapter 14 — User-Facing CLI Command Surface (mcp, plugin, setup-token)

This chapter documents the **user-facing command groups** that exist in the bundled CLIs but are easy to miss if you only study the internal fast paths (`--mcp-cli`, `--ripgrep`) or the REPL UI.

Why this matters for the TS rewrite:
- These commands define “discoverability” and expected entrypoints (`claude mcp ...`, `claude plugin ...`, `claude setup-token`, `claude install`, `claude update`).
- The TS rewrite can be *architecturally correct* but still feel broken if `--help` and `X --help` flows don’t behave like a normal CLI.
- Command names/flags are also part of docs, onboarding, and support workflows — they must exist even if their implementations start as stubs.

Authoritative extraction used here:
- `investigation/iteration-3-cli-parity.md` (command + flag parity report)
- `investigation/investigation-20251220-112837/extractions/claude-code-commands.txt` (string-based commander `.command(...)` extraction)

### 14.1 Command tree observed in bundles (2.0.67 / 2.0.69)

Top-level commands (observed):
- `doctor`
- `install [target]`
- `update`
- `setup-token`
- `mcp`
- `plugin`

`mcp` subcommands (observed):
- `mcp serve`
- `mcp add <name> <commandOrUrl> [args...]`
- `mcp add-from-claude-desktop`
- `mcp add-json <name> <json>`
- `mcp get <name>`
- `mcp list`
- `mcp remove <name>`
- `mcp reset-project-choices`

`plugin` subcommands (observed):
- `plugin validate <path>`
- `plugin install <plugin>` (and alias `plugin i <plugin>`)
- `plugin uninstall <plugin>` (and alias `plugin remove <plugin>`)
- `plugin enable <plugin>`
- `plugin disable <plugin>`
- `plugin update <plugin>`
- `plugin marketplace ...` (see below)

`plugin marketplace` subcommands (observed):
- `plugin marketplace add <source>`
- `plugin marketplace list`
- `plugin marketplace remove <name>` (and alias `plugin marketplace rm <name>`)
- `plugin marketplace update [name]`

Notes:
- This chapter only asserts the command *tree* and high-level purpose. Deep behavior (IO paths, network interactions, prompts) should be documented as follow-ups once the definitions are mapped to bundle symbols in Chapter 3’s bootstrap parsing.
- For TS rewrite parity tracking, treat “help + exit semantics” as a first-class behavior even before full implementations exist.

### 14.2 Behavioral expectations (help, exit codes, and “unknown command”)

Legacy CLIs behave like a conventional command-line app:
- `claude --help` prints usage and exits 0.
- `claude <command> --help` prints that command’s help and exits 0.
- Unknown commands/flags error and exit non-zero (they do not drop into a REPL UI).

The TS rewrite’s investigation reports currently show a mismatch here (commands missing, and some `X --help` invocations falling into interactive UI output). This is a **parity bug** because it changes how users discover functionality.

### 14.3 Relationship to internal modes (`--mcp-cli`, `--ripgrep`)

Important distinction:
- `claude mcp ...` is a *user-facing* command group (manages MCP servers/config for the user).
- `claude --mcp-cli ...` is an *internal diagnostic/automation mode* with endpoint/state-file behavior.

The TS rewrite should not replace one with the other:
- internal `--mcp-cli` can remain for debugging, but it does not satisfy the user-facing `mcp` command group expectations.

## Next chapters (to expand)

High-value subsystems to document next (they are large but “rewrite-worthy”):

1. Permissions + rules engine (always-allow/deny/ask; prompt reasons)
2. AppState provider + UI components — documented across Chapters 7, 9, and 10; remaining: deeper per-overlay component internals
3. Teleport + remote sessions — documented in Chapter 8; remaining: “remote tasks” + any additional teleport-related agents
4. Hooks — documented in Chapter 6; remaining: deeper per-hook handler inventory + error handling edge cases
5. Settings schema + validation + merge precedence — partially documented earlier; remaining: full schema inventory and migration behaviors
6. Slash commands — architecture + `/resume` documented in Chapter 11; remaining: major commands like `/permissions`, `/login`, `/agents`, `/config`, `/mcp`, `/ide`, `/memory`
7. Plugin system — command/skill/agent loading from plugin manifests and directories
8. Built-in tool catalog — `m81/f81` tool registry, per-tool contracts, and TS module boundaries
9. MCP server/client integration — non-CLI MCP behavior inside the REPL (resources, tools, prompts, elicitation)
