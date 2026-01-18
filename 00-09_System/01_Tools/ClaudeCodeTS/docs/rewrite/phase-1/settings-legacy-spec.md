# Settings — legacy spec (sources, precedence, IO, merge)

This document formalizes the legacy settings system contract (behavior, not implementation).

Primary source: `CLI_ENCYCLOPEDIA.md` Chapter 5 (“Settings system”).

## 1) Settings sources (canonical)

File-backed sources:
- `userSettings`
- `projectSettings`
- `localSettings`
- `policySettings`
- `flagSettings`

Non-file sources (primarily for permissions / transient overlays):
- `cliArg`
- `command`
- `session`

## 2) Enabled source computation

Legacy behavior (both bundles):
1. Start from `allowedSettingSources` (subset of `userSettings|projectSettings|localSettings`).
2. Always include `policySettings` and `flagSettings`.
3. Return de-duplicated list.

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 5 §5.2.

## 3) Source file locations (legacy stable paths)

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 5 §5.3.

- `userSettings`: `<configDir>/settings.json` (typically `~/.claude/settings.json`)
- `projectSettings`: `<projectRoot>/.claude/settings.json`
- `localSettings`: `<projectRoot>/.claude/settings.local.json`
- `policySettings`: `<systemDir>/managed-settings.json`
  - macOS default: `/Library/Application Support/ClaudeCode/managed-settings.json`
  - Windows default: `C:\Program Files\ClaudeCode` if exists else `C:\ProgramData\ClaudeCode`
  - Linux/other default: `/etc/claude-code`
- `flagSettings`: exact file path supplied by `--settings <file>`

## 4) Reading + validation

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 5 §5.4–§5.5.

Stable behaviors:
- Missing file returns `settings:null` with no errors.
- Empty/whitespace file is treated as `{}` (valid).
- JSON parse errors are not surfaced from the single-file reader (logged then treated as absent); schema validation failures produce structured errors and the settings object is treated as `null`.
- `policySettings` may be remote-managed (preferred when present + non-empty) or local managed-settings file.

## 5) Merge semantics (effective settings)

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 5 §5.6.

Legacy contract:
- Objects are deep-merged.
- Arrays use *union semantics* (dedupe, preserve insertion order).
- Errors are accumulated and deduplicated.
- Sources are iterated in the enabled source order (as returned by `getEnabledSettingsSources()`).

Implication: since the enabled source list ordering is stable and deterministic, effective settings should be deterministic given a deterministic filesystem view.

## 6) Cache + invalidation

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 5 §5.6 and §5.8.

Legacy behavior:
- Effective settings are memoized.
- Cache is invalidated explicitly on watcher events and after writes.

## 7) Patch/write semantics

Reference: `CLI_ENCYCLOPEDIA.md` Chapter 5 §5.7.

Legacy contract:
- `policySettings` and `flagSettings` are read-only for patch writes.
- Patch merges support “delete on undefined”.
- Writes are atomic via temp file + rename when possible, preserve file mode, write through symlink.
- Watcher suppresses events caused by internal writes.
- Special-case for `localSettings`: performs an extra side-effect to ensure gitignore/tracking behavior (legacy detail preserved as a compatibility note; rewrite will model this as host-only optional behavior).

