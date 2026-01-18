# Iteration 3: CLI Command Parity

## Commands Found in Original
- `doctor`
- `install`
- `mcp`
- `plugin`
- `setup-token`
- `update`
- `mcp add`
- `mcp add-from-claude-desktop`
- `mcp add-json`
- `mcp get`
- `mcp list`
- `mcp remove`
- `mcp reset-project-choices`
- `mcp serve`
- `plugin disable`
- `plugin enable`
- `plugin i`
- `plugin install`
- `plugin marketplace`
- `plugin remove`
- `plugin uninstall`
- `plugin update`
- `plugin validate`
- `plugin marketplace add`
- `plugin marketplace list`
- `plugin marketplace remove`
- `plugin marketplace rm`
- `plugin marketplace update`

## Command Test Results
| Command | Original | TypeScript | Test Output |
|---------|----------|------------|-------------|
| `--help` | ✅ | ✅ | `claude-ts 0.1.0

Usage: claude-ts [options]

Options:` |
| `--version` | ✅ | ✅ | `0.1.0 (Claude Code TS rewrite)` |
| `doctor --help` | ✅ | ✅ | `Usage: claude-ts doctor [options]

Options:
  --json                  Output machine-readable JSON (doctor report only)
  --bundle <path>         Write a redacted diagnostic bundle JSON file` |
| `install --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `setup-token --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `update --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp add --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp add-from-claude-desktop --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp add-json --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp get --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp list --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp remove --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp reset-project-choices --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `mcp serve --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin disable --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin enable --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin i --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin install --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin marketplace --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin remove --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin uninstall --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin update --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin validate --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin marketplace add --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin marketplace list --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin marketplace remove --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin marketplace rm --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `plugin marketplace update --help` | ✅ | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |

## Flag Parity
| Flag | Original | TypeScript | Status |
|------|----------|------------|--------|
| `--add-dir <directories...>` | ✅ | ❌ | ❌ missing |
| `--agent <agent>` | ✅ | ❌ | ❌ missing |
| `--agents <json>` | ✅ | ❌ | ❌ missing |
| `--allow-dangerously-skip-permissions` | ✅ | ❌ | ❌ missing |
| `--allowedTools, --allowed-tools <tools...>` | ✅ | ❌ | ❌ missing |
| `--append-system-prompt <prompt>` | ✅ | ❌ | ❌ missing |
| `--betas <betas...>` | ✅ | ❌ | ❌ missing |
| `-c, --continue` | ✅ | ❌ | ❌ missing |
| `--dangerously-skip-permissions` | ✅ | ❌ | ❌ missing |
| `-d, --debug [filter]` | ✅ | ❌ | ❌ missing |
| `-d, --debug` | ✅ | ❌ | ❌ missing |
| `--disable-slash-commands` | ✅ | ❌ | ❌ missing |
| `--disallowedTools, --disallowed-tools <tools...>` | ✅ | ❌ | ❌ missing |
| `-e, --env <env...>` | ✅ | ❌ | ❌ missing |
| `--fallback-model <model>` | ✅ | ❌ | ❌ missing |
| `--force` | ✅ | ❌ | ❌ missing |
| `--fork-session` | ✅ | ❌ | ❌ missing |
| `-H, --header <header...>` | ✅ | ❌ | ❌ missing |
| `-h, --help` | ✅ | ✅ | ✅ |
| `--ide` | ✅ | ❌ | ❌ missing |
| `--include-partial-messages` | ✅ | ❌ | ❌ missing |
| `--input-format <format>` | ✅ | ❌ | ❌ missing |
| `--json-schema <schema>` | ✅ | ❌ | ❌ missing |
| `--max-budget-usd <amount>` | ✅ | ❌ | ❌ missing |
| `--mcp-config <configs...>` | ✅ | ❌ | ❌ missing |
| `--mcp-debug` | ✅ | ❌ | ❌ missing |
| `--model <model>` | ✅ | ❌ | ❌ missing |
| `--no-session-persistence` | ✅ | ❌ | ❌ missing |
| `--output-format <format>` | ✅ | ❌ | ❌ missing |
| `--permission-mode <mode>` | ✅ | ❌ | ❌ missing |
| `--plugin-dir <paths...>` | ✅ | ❌ | ❌ missing |
| `-p, --print` | ✅ | ✅ | ⚠️ name/semantics differ (-p is --print vs --prompt) |
| `--replay-user-messages` | ✅ | ❌ | ❌ missing |
| `-r, --resume [value]` | ✅ | ❌ | ❌ missing |
| `-s, --scope <scope>` | ✅ | ❌ | ❌ missing |
| `--session-id <uuid>` | ✅ | ❌ | ❌ missing |
| `--setting-sources <sources>` | ✅ | ❌ | ❌ missing |
| `--settings <file-or-json>` | ✅ | ❌ | ❌ missing |
| `--strict-mcp-config` | ✅ | ❌ | ❌ missing |
| `--system-prompt <prompt>` | ✅ | ❌ | ❌ missing |
| `--tools <tools...>` | ✅ | ❌ | ❌ missing |
| `-t, --transport <transport>` | ✅ | ❌ | ❌ missing |
| `--verbose` | ✅ | ❌ | ❌ missing |
| `-v, --version` | ✅ | ✅ | ✅ |

## Missing Commands
1. `mcp`
1. `plugin`
1. `setup-token`
1. `update`
1. `install`
1. `mcp serve`
1. `mcp add`
1. `mcp remove`
1. `mcp list`
1. `mcp get`
1. `mcp add-json`
1. `mcp add-from-claude-desktop`
1. `mcp reset-project-choices`
1. `plugin validate`
1. `plugin marketplace`
1. `plugin install`
1. `plugin i`
1. `plugin uninstall`
1. `plugin remove`
1. `plugin enable`
1. `plugin disable`
1. `plugin update`
1. `plugin marketplace add`
1. `plugin marketplace list`
1. `plugin marketplace remove`
1. `plugin marketplace rm`
1. `plugin marketplace update`

## Missing Flags
1. `--add-dir <directories...>`
1. `--agent <agent>`
1. `--agents <json>`
1. `--allow-dangerously-skip-permissions`
1. `--allowedTools, --allowed-tools <tools...>`
1. `--append-system-prompt <prompt>`
1. `--betas <betas...>`
1. `-c, --continue`
1. `--dangerously-skip-permissions`
1. `-d, --debug [filter]`
1. `-d, --debug`
1. `--disable-slash-commands`
1. `--disallowedTools, --disallowed-tools <tools...>`
1. `-e, --env <env...>`
1. `--fallback-model <model>`
1. `--force`
1. `--fork-session`
1. `-H, --header <header...>`
1. `--ide`
1. `--include-partial-messages`
1. `--input-format <format>`
1. `--json-schema <schema>`
1. `--max-budget-usd <amount>`
1. `--mcp-config <configs...>`
1. `--mcp-debug`
1. `--model <model>`
1. `--no-session-persistence`
1. `--output-format <format>`
1. `--permission-mode <mode>`
1. `--plugin-dir <paths...>`
1. `--replay-user-messages`
1. `-r, --resume [value]`
1. `-s, --scope <scope>`
1. `--session-id <uuid>`
1. `--setting-sources <sources>`
1. `--settings <file-or-json>`
1. `--strict-mcp-config`
1. `--system-prompt <prompt>`
1. `--tools <tools...>`
1. `-t, --transport <transport>`
1. `--verbose`

## Broken Commands
1. (none)

## Working Commands
1. `doctor`: ✅

## Prompt-Specified Test Commands
| Command | Result | Output |
|---------|--------|--------|
| `bun run cli --help` | ✅ | `claude-ts 0.1.0

Usage: claude-ts [options]

Options:` |
| `bun run cli --version` | ✅ | `0.1.0 (Claude Code TS rewrite)` |
| `bun run cli -p "test prompt"` | ✅ | `The model 'claude-3-7-sonnet-20250219' is deprecated and will reach end-of-life on February 19th, 2026
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.
I understand you want to test if I'm working correctly. This is Claude Code, Anthropic's CLI interface for Claude. I'm here and ready to …` |
| `bun run cli --dangerously-skip-permissions -p "test"` | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `bun run cli chat --help` | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `bun run cli run --help` | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |
| `bun run cli config --help` | ❌ | `screen: prompt
overlay: none
last: (none)
hint: ctrl+o to toggle transcript` |

## Interactive Mode Test
- Command: `echo "exit" | bun run cli` (implemented via stdin piping)
- Result: ❌ (printed help; TS CLI does not start interactive by default)
- Output: `claude-ts 0.1.0

Usage: claude-ts [options]

Options:
  --version, -v, -V     Print version and exit
  --help                Show help
  --mcp-cli ...         MCP CLI (gated by ENABLE_EXPERIMENTAL_MCP_CLI=1)
  --ripgrep ...         Minimal grep/search mode (portable replacement)`

