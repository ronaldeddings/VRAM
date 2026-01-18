# Permissions — legacy spec (rules, sources, decision semantics)

This document formalizes the legacy tool-permission system contract (behavior, not implementation).

Primary source: `CLI_ENCYCLOPEDIA.md` Chapter 4 (“Permissions, rules, and tool approval”).

## 1) Tool permission context (stable shape)

Reference: Chapter 4 §4.1.

Stable fields (names are not minified in the bundle and are reliable):
- `mode: string` (observed: `default`, `bypassPermissions`, `plan`, `acceptEdits`, `dontAsk`, …)
- `additionalWorkingDirectories: Map<string, { path: string; source: string }>`
- `alwaysAllowRules: Record<string, string[]>`
- `alwaysDenyRules: Record<string, string[]>`
- `alwaysAskRules: Record<string, string[]>`
- `isBypassPermissionsModeAvailable: boolean`

## 2) Rule syntax (string contract)

Reference: Chapter 4 §4.2.

- Either bare tool name: `ToolName`
- Or tool with content key: `ToolName(ruleContent)`
  - `ruleContent` is parsed as a raw string between the first `(` and the first `)`.
  - No escaping, no nesting; malformed strings fall back to “bare tool name”.

## 3) Rule-source precedence order (critical)

Reference: Chapter 4 §4.3.

Legacy precedence list:
1. `userSettings`
2. `projectSettings`
3. `localSettings`
4. `flagSettings`
5. `policySettings`
6. `cliArg`
7. `command`
8. `session`

Behavioral implication:
- For “plain tool rules” (no `ruleContent`), the first matching rule in this source iteration order is selected.
- For “content-keyed” rules (same tool + different `ruleContent`), later sources overwrite earlier ones when building the rule-content index.

## 4) Matching rules

Reference: Chapter 4 §4.4–§4.6.

Stable behaviors:
- Plain tool rules match only when `ruleContent` is absent.
- MCP rules can target a whole server (`mcp__server__`) or a specific tool (`mcp__server__tool`); server-wide rules match all tools in that server.
- Content-keyed rules apply only to exact tool name matches and use `ruleContent` string as the lookup key.

## 5) Decision order (core algorithm)

Reference: Chapter 4 §4.7.

Legacy decision pipeline, in order:
1. Abort signal check (if aborted, throw abort error).
2. Plain deny rule wins.
3. Plain ask rule, with special-case: Bash ask can be ignored if sandboxing is enabled and “auto allow bash if sandboxed” is enabled.
4. Tool-specific permission check (input schema parse + tool-defined `checkPermissions`), errors fall back to “passthrough”.
5. Tool-specific deny wins.
6. Tool-specific ask is preserved for interactive tools.
7. Mode override: bypass/plan can cause allow when enabled/available.
8. Plain allow rule allows.
9. Else fallback to tool-specific result (commonly ask/passthrough).

## 6) Messaging / explainability (baseline)

Reference: Chapter 4 §4.8.

Legacy includes a discriminated-union “why are we asking/denying?” structure (rule, hook, sandbox override, etc.). The rewrite must preserve *explainability* and attribution, even if copy changes.

