# Architecture & Internals

**Status**: Inferred from Binary Analysis

## Tech Stack

1.  **Runtime**: Node.js (Version >= 18.0.0).
2.  **Language**: TypeScript (compiled/minified to JavaScript).
3.  **UI Framework**: **React** running in the terminal.
    -   Evidence: Presence of `React` internal flags (`--react-internal-module-start`), `--color-timeline-react` flags.
    -   Likely uses **Ink** or a similar React renderer for CLI.
4.  **Bundling**: Minified single-file executable (likely bundled with ESBuild or Webpack).

## Core Components

### 1. Model Context Protocol (MCP) Integration
The CLI is built around the **Model Context Protocol (MCP)**. It acts as both a client (connecting to tools) and potentially a host.
-   **Config**: `managed-mcp.json`, `mcp-config`.
-   **Function**: Enables the LLM to access the file system, run commands, and check context safely.

### 2. External Tool Orchestration
The CLI does not reimplement everything; it orchestrates existing powerful tools:
-   **Ripgrep (`rg`)**: Used for high-performance file searching.
-   **Git**: Used for version control operations.
-   **Node.js**: Used for executing JavaScript/TypeScript code.

### 3. Session Management
-   **Persistence**: Sessions are saved to disk (referenced by `--session-id`, `--resume`).
-   **Checkpoints**: The tool supports file checkpointing (`CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING`) to revert changes if the AI makes a mistake.

### 4. Telemetry & logging
-   **Sentry**: Used for error reporting.
-   **Logging**: Structured logging (JSON/Text) to `CLAUDE_CODE_DEBUG_LOGS_DIR`.
-   **Profiling**: Built-in startup and performance profiling (`CLAUDE_CODE_PROFILE_STARTUP`).

## File Structure (Inferred)

```
~/.claude/              # Configuration Root
├── config.json         # User Config
├── sessions/           # Saved session history
├── logs/               # Debug logs
└── mcp-settings.json   # MCP Tool configuration
```

## Security Model

-   **Permission System**: Tools (like file writes or shell commands) require user approval unless `--dangerously-skip-permissions` is used.
-   **Sandboxing**: Mentions of "Bubblewrap" (`CLAUDE_CODE_BUBBLEWRAP`) suggest containerization or sandboxing attempts for executed code.
