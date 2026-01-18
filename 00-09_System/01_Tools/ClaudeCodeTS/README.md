# Claude Code TS Rewrite (WIP)

This repo is a TypeScript-first rewrite of the Claude Code CLI/engine with a portable core and thin host/UI adapters.

## Run (dev)

- `bun run cli --help`
- `bun run cli --print-frame`
- `bun run cli -p "hello"` (prints model output; uses available credentials; see below)
- `bun run cli` (interactive; minimal UI)

## Credentials (for `-p/--prompt`)

Credential resolution (first match wins):

1. `ANTHROPIC_API_KEY` (standard API key)
2. `ANTHROPIC_AUTH_TOKEN` (long-lived “setup-token” style bearer token)
3. Claude Code credentials:
   - Keychain / secure store (e.g. Claude Code OAuth session credentials JSON)
   - `CLAUDE_CODE_SESSION_ACCESS_TOKEN` (OAuth session access token)

Note: Claude Code OAuth session tokens are **scoped to Claude Code** and require Claude Code-style request headers. This repo’s `-p` path is implemented to match that behavior (and avoids refresh/token-exchange by default).

## Build (Node runnable)

- `bun run build`
- `node dist/cli.js --help`

## Tests

- `bun test`
