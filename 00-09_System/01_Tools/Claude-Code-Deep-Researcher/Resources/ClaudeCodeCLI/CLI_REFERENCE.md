# CLI Reference

This document lists command-line arguments and flags observed in the Claude Code CLI binary.

## Core Options

These flags appear to be the primary controls for the Claude CLI:

- `--model [name]`: Specify the AI model to use (e.g., `claude-3-5-sonnet...`).
- `--system-prompt [text]`: Provide a custom system prompt.
- `--system-prompt-file [path]`: Load system prompt from a file.
- `--print`: Print the response to stdout (likely without the interactive UI).
- `--verbose`: Enable verbose output.
- `--version`: Show version information.
- `--help`: Show help.
- `--session-id [id]`: Resume or specify a session.
- `--resume`: Resume the last session.
- `--new-session`: Force a new session.
- `--dangerously-skip-permissions`: Bypass permission prompts for tool execution (Use with caution).

## Debugging & Development

- `--debug`: Enable debug mode.
- `--debug-to-stderr`: Send debug logs to stderr.
- `--test-fixtures-root`: For internal testing.
- `--run-tests`: Internal test runner.
- `--force`: Force operations.
- `--no-color`: Disable colored output.

## Model Context Protocol (MCP)

The tool has built-in MCP support:

- `--mcp-config [path]`: Path to MCP configuration file.
- `--mcp-debug`: Enable debugging for MCP connections.
- `--strict-mcp-config`: Enforce strict config validation.
- `--mcp-cli`: Access the internal MCP CLI tool.

## Sub-Tool Flags (Passthrough)

The CLI appears to embed or wrap other tools like `grep` and `git`. You may see these flags supported, likely passed to the underlying tool:

### Search / Grep Options
- `--after-context`, `--before-context`, `--context`
- `--files-with-matches`, `--files-without-match`
- `--ignore-case`, `--smart-case`
- `--word-regexp`, `--line-regexp`
- `--fixed-strings`
- `--max-count`
- `--max-depth`

### Git / Diff Options
- `--diff-algorithm`
- `--word-diff`
- `--ignore-space-at-eol`
- `--name-only`, `--name-status`
- `--staged`, `--cached`
- `--full-index`

## Other Options

- `--timeout [ms]`: Set operation timeouts.
- `--headless`: Run without UI (inferred from `incognito` or similar flags).
- `--incognito`: Don't save session history.
- `--profile`: Enable profiling.
