# Iteration 4: Subprocess Pattern Migration

## Original Subprocess Usage

Counts are from `investigation/investigation-20251220-112837/extractions/claude-code-subprocess.txt` (bundled `bundles/ClaudeCodeCode/cli.js`).

| Pattern | Count | Purpose |
|---------|-------|---------|
| `spawn()` | 11 | Process execution plumbing (e.g. `spawn-rx` wrapper around `child_process.spawn`) |
| `exec()` | 184 | Mixed: true subprocess execution plus many non-subprocess `.exec()` regex calls (bundled/minified) |
| `fork()` | 67 | Process isolation / executable-subcommand patterns (bundled CLI/framework code) |
| `execSync()` | 1 | Synchronous shell-out (system introspection / environment probing) |
| `spawnSync()` | 2 | Synchronous process calls (rare but present) |
| `execFile()` | 6 | Direct binary invocation (e.g. `rg`/platform utilities) |
| `child_process` | 44 | Direct dependency on Node subprocess APIs |

## TypeScript Subprocess Usage

Search basis: `rg -n "node:child_process|execSync\\(|spawnSync\\(|fork\\(|spawn\\(|exec\\(|execFile\\(" src --type ts`

| Pattern | Count | Location | Justified? |
|---------|-------|----------|------------|
| `node:child_process` | 1 | `src/platform/node/host.ts` | Yes: Node-only host integration |
| `execFile()` | 5 | `src/platform/node/host.ts` | Yes: macOS Keychain via `security` CLI, awaited/promisified |
| `execSync()` | 0 | n/a | n/a |
| `spawnSync()` | 0 | n/a | n/a |
| `fork()` | 0 | n/a | n/a |

Notes:
- `spawn(` appears in `src/` as in-process task scheduling (e.g. `scope.spawn()`), not OS subprocess spawning.
- No `child_process.exec()`/`spawn()`/`fork()` usage remains in `src/` aside from the `execFile`-based keychain helper in the Node host.

## Migration Status by Feature

| Feature | Original Method | New Method | Status |
|---------|-----------------|------------|--------|
| Shell commands | `spawn()` / `exec()` / sync variants | `HostShell` capability exists but not provided by default | Migrated away from implicit subprocess; shell execution effectively disabled unless a host supplies it |
| Ripgrep/search | `execFile(rg)` | In-process `search.grep` tool using `HostFilesystem` | Migrated (no subprocess) |
| Git operations | `exec(git …)` (per original CLI behavior) | No git-specific implementation found in `src/` | Removed from core (or delegated externally) |
| Editor launching | Subprocess/open-app patterns (original CLI behavior) | No editor-launching implementation found in `src/` | Removed from core (or delegated to UI/host) |
| Hooks | Script/process hooks (subprocess-based) | `src/core/hooks/runner.ts` workflow hooks interpreted in-process; can call tools via `ctx.callTool` | Migrated (no subprocess) |
| Background tasks | Detached processes / forked workers | `src/core/runtime/*` task scheduler + scopes | Migrated (async tasks, not subprocesses) |
| Secret storage (macOS) | Shelling out to platform tooling | `src/platform/node/host.ts` calls `security` via `execFile` (promisified + awaited) | Still subprocess-based but isolated to Node host and already async |

## Platform Abstraction

- Capability layer: found (`src/core/types/host.ts` and `src/core/capabilities/catalog.ts`).
- Shell abstraction: found (`HostShell` in `src/core/types/host.ts`), but all shipped platforms currently mark it unavailable:
  - Web: `src/platform/web/index.ts`
  - React Native: `src/platform/rn/index.ts`
  - Node: `src/platform/node/host.ts` (explicitly “not provided by default”)
- Works on React Native: yes for core logic (no subprocess usage); shell automation is unsupported there.

## Remaining Issues

1. Node host still shells out to `security` for macOS Keychain (`src/platform/node/host.ts`); it is already async (`promisify(execFile)` + `await`) and guarded by `allowSubprocess`, but remains a subprocess dependency by design.
2. `HostShell` exists but is not provided by default on any platform; if “shell command execution” is still a desired feature, it needs an explicit host implementation (and policy surface) rather than ad-hoc subprocess calls.
