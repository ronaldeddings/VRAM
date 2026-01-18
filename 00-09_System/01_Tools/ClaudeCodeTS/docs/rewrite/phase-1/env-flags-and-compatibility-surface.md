# Env vars + CLI flags — legacy compatibility surface (Phase 1 inventory)

Goal: inventory the environment variables and CLI flags that affect behavior so the rewrite can preserve parity and later define explicit mappings (`host config` → `settings overlay` → `policy`).

Primary sources:
- `CLI_ENCYCLOPEDIA.md` (mentions the most critical ones per subsystem)
- Bundle scans (generated lists under `docs/rewrite/phase-1/generated/`)
- Installed CLI help output (`docs/rewrite/phase-1/generated/claude-help.txt`)

## 1) Authentication-related env vars (legacy)

Legacy bundles recognize:
- `CLAUDE_CODE_SESSION_ACCESS_TOKEN` (preferred)
- `CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR` (fallback; reads token from fd)

Evidence in bundles:
- `bundles/ClaudeAgentSDKCode/cli.js` defines `Le()` returning `process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || <fd-token>` (search for `function Le()`).
- `bundles/ClaudeCodeCode/cli.js` main path considers “remote client type” when either is set (search for `CLAUDE_CODE_SESSION_ACCESS_TOKEN||process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR`).

Rewrite contract:
- Treat authentication as a host capability (credential store) and expose a typed “session token provider” interface; env vars remain a Node/CLI host affordance only.

## 2) Generated inventories (do not hand-edit)

- `docs/rewrite/phase-1/generated/env-vars.process-env-dot.txt`
  - Extracted from `process.env.FOO` patterns in both bundles.
- `docs/rewrite/phase-1/generated/env-vars.process-env-bracket.txt`
  - Extracted from `process.env["FOO"]` patterns.
- `docs/rewrite/phase-1/generated/cli-flags.top-200.txt`
  - High-frequency `--flag` tokens found in both bundles (includes third-party flags, e.g. ripgrep).
- `docs/rewrite/phase-1/generated/claude-help.txt`
  - Canonical user-facing CLI flags for the installed `claude` binary in this environment.

## 2.1 Curated env vars by subsystem (Phase 1 baseline)

This is a *curated* list of the highest-signal env vars referenced in the encyclopedia and/or visible in bundles.

Authentication / remote:
- `CLAUDE_CODE_SESSION_ACCESS_TOKEN`
- `CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR`

MCP CLI:
- `ENABLE_EXPERIMENTAL_MCP_CLI`
- `ENABLE_MCP_CLI_ENDPOINT`
- `MCP_TOOL_TIMEOUT`
- `MAX_MCP_OUTPUT_TOKENS`

Hooks:
- `CLAUDE_CODE_SHELL_PREFIX`

Entrypoint selection / automation:
- `CLAUDE_CODE_ENTRYPOINT`
- `CLAUDE_CODE_ACTION` (GitHub Action entry)
- `GITHUB_ACTIONS`

## 3) Phase-1 mapping skeleton (to be expanded)

Initial categorization (Phase 1 only; not final):
- **Host adapter config**: Node/CLI-only ingress (env vars, argv flags) that becomes typed host configuration at the boundary.
- **Settings overlay**: values that become part of a versioned settings document or runtime settings overlay (portable).
- **Policy**: values that are managed/locked down by policy and must be attributed.
- **CLI-only toggles**: knobs that only affect the CLI adapter UX and cannot exist on mobile/web.
- **Deprecated**: env/flags that cannot be carried forward; must have explicit replacements.

Curated mapping (Phase 1 baseline):

| Knob | Kind | v3 mapping (target) | Notes |
|---|---|---|---|
| `CLAUDE_CODE_SESSION_ACCESS_TOKEN` | host adapter config | host `secrets` capability (Node env alias) | never persisted |
| `CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR` | host adapter config | host `secrets` capability (fd alias) | never persisted |
| `ENABLE_EXPERIMENTAL_MCP_CLI` | CLI-only | CLI adapter gate for `--mcp-cli` | keep as CLI-only |
| `ENABLE_MCP_CLI_ENDPOINT` | CLI-only | CLI adapter gate for endpoint mode | keep as CLI-only |
| `MCP_TOOL_TIMEOUT` | settings overlay | `EffectiveConfig.mcp.toolTimeoutMs` | later: policy override allowed |
| `MAX_MCP_OUTPUT_TOKENS` | settings overlay | `EffectiveConfig.mcp.maxOutputTokens` | later: policy override allowed |
| `CLAUDE_CODE_SHELL_PREFIX` | deprecated | replace with host automation capability config | legacy subprocess artifact |

Key CLI flags (Phase 1 baseline):
- `--mcp-cli`: CLI-only entrypoint (gated by `ENABLE_EXPERIMENTAL_MCP_CLI`).
- `--ripgrep`: CLI-only entrypoint (desktop/CLI only).

Deprecation map (Phase 1 baseline):
- Any env var that provides behavior on Node by relying on `process.env` should have a replacement path for mobile/web:
  - “env var” → host adapter config UI → settings overlay and/or policy.
- `CLAUDE_CODE_SHELL_PREFIX` (hooks): will not exist on mobile/web; replacement is a redesigned hook workflow model (Phase 9) that never shells out.

Golden tests (Phase 1 baseline):
- `tests/phase1-legacy-spec.test.ts` asserts that `--mcp-cli` behavior is gated by `ENABLE_EXPERIMENTAL_MCP_CLI` and consistent across both bundles.
- `docs/rewrite/phase-1/fixtures/*` contains offline captures demonstrating the same gating + fallback warning behavior.
