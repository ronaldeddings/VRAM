# Claude Code CLI Documentation

**Status**: Unofficial Documentation (Reverse Engineered / Black Box Analysis)
**Version**: 2.0.69 (based on source package.json)
**Binary Source**: `Resources/ClaudeCodeSource/cli.js`

## Overview

This documentation describes the **Claude Code CLI**, a terminal-based AI assistant tool. The analysis is based on inspecting the minified source code and identifying observable interfaces such as environment variables, command-line flags, and configuration files.

## Core Capabilities

Based on the embedded strings and libraries, this tool appears to:
1.  **Interact with LLMs**: Specifically Anthropic's Claude models (`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`).
2.  **Execute Tools**: It has built-in support for searching files (`ripgrep`), managing git repositories (`git`), and executing shell commands.
3.  **Model Context Protocol (MCP)**: It acts as an MCP client (and potentially server), allowing it to connect to external data sources and tools.
4.  **Remote Execution**: Support for remote environments (`CLAUDE_CODE_REMOTE`).

## Installation & Entry Point

The tool is a Node.js application.
Entry point: `cli.js`

```bash
node cli.js [flags] [query]
```

## Data Storage

The tool interacts with the file system for configuration and caching.
- **Config Directory**: Likely `~/.claude/` or adhering to `XDG_CONFIG_HOME`.
- **Log Files**: `CLAUDE_CODE_DEBUG_LOGS_DIR` suggests logging capabilities.
- **Checkpoints**: `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` implies it saves state/history.

## Key Components

- **Shell Integration**: Deep integration with Bash/Zsh (`CLAUDE_CODE_SHELL`, `process.env.SHELL`).
- **Telemetry**: Uses Sentry and potentially other analytics (`CLAUDE_CODE_ENABLE_TELEMETRY`).
- **Update Mechanism**: Auto-update capability (`DISABLE_AUTOUPDATER`).

## Usage

See [CLI Reference](./CLI_REFERENCE.md) for command line arguments.
See [Configuration](./CONFIGURATION.md) for environment variables and config files.
See [Architecture](./ARCHITECTURE.md) for internal details.
