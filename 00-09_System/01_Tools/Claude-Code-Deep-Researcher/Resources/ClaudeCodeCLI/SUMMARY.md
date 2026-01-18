# Claude Code CLI: Reverse Engineering Project

**Index of Analysis**

This folder contains extensive documentation on the internal workings of the `@anthropic-ai/claude-code` CLI tool (v2.0.69), derived from "black box" binary analysis.

## Documentation Modules

### 1. [README.md](./README.md)
**Start Here.** High-level overview of the tool, its purpose, and basic installation/usage findings.

### 2. [CONFIGURATION.md](./CONFIGURATION.md)
**User Manual.** Detailed list of all:
-   **Environment Variables** (`ANTHROPIC_API_KEY`, `CLAUDE_CODE_*`).
-   **Configuration Files** (`config.json`, `managed-settings.json`).
-   **Flags** (`--model`, `--resume`).

### 3. [ARCHITECTURE.md](./ARCHITECTURE.md)
**System Design.** Explains the technology stack:
-   Node.js + React (Ink) UI.
-   Model Context Protocol (MCP) Core.
-   External dependencies (Git, Ripgrep).

### 4. [STATE_AND_SESSIONS.md](./STATE_AND_SESSIONS.md)
**Data Structures.** Explains where your data lives:
-   The `~/.claude/` directory layout.
-   How `.jsonl` session logs work.
-   How the CLI tracks project permissions.

### 5. [DEEP_INTERNALS.md](./DEEP_INTERNALS.md)
**Technical Deep Dive.** Explains the "Magic":
-   **Path Sanitization**: How `process.cwd()` is mapped to storage.
-   **Session Resolution**: The algorithm for finding the "current" session.
-   **Sync Protocol**: How data moves between local disk and Anthropic's cloud.

### 6. [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
**API Reference.** For developers building on top of the CLI:
-   JSON Schemas for config and logs.
-   Function signatures for key internal utilities.
-   Protocol details.

### 7. [INTERNALS_COMPENDIUM.md](./INTERNALS_COMPENDIUM.md)
**Advanced Mechanics.** The "Hacker's Guide":
-   **Context Compression**: The "Middle-Out" algorithm (2000 msg threshold).
-   **Tool Wrappers**: How `ripgrep` is spawned and managed.
-   **Time Travel**: How file checkpointing works.

## Methodology
The analysis was performed by inspecting the minified source code `cli.js`, identifying string literals, regex patterns, and control flow structures (e.g., `grep` for environment variables, analyzing function call graphs).
