# Architecture of State: Projects & Sessions

**Analysis of `~/.claude` structure and `resume` functionality.**

## The `~/.claude` Directory

The Claude Code CLI maintains its state in a configuration directory, typically `~/.claude` (or the path specified by `CLAUDE_CONFIG_DIR`). This directory acts as the central database for the tool.

### Structure (Inferred)

```
~/.claude/
├── config.json           # Main configuration (User settings)
├── history.jsonl         # Global command history (for "up arrow" recall)
├── sessions/             # (Likely) Directory storing active and past sessions
│   ├── {UUID}.jsonl      # Individual session data (Messages, Context)
│   └── agent-{UUID}.jsonl # Sub-agent session data
├── projects/             # Project-specific metadata
└── mcp-logs/             # Logs for Model Context Protocol servers
```

### The `projects` Concept

The CLI tracks "projects" in two ways:

1.  **Config Map**: The `config.json` file contains a `projects` key. This is a map where:
    -   **Key**: The absolute path to a project directory on your machine.
    -   **Value**: An object storing permissions and state, specifically `{ "hasTrustDialogAccepted": true }`.
    -   **Purpose**: This allows the CLI to remember if you've authorized it to run tools in a specific folder without asking for permission every time (if configured).

2.  **Projects Directory**: The code references a `projects` directory (`~/.claude/projects`). This likely stores more granular state per project if needed, separate from the main config file to avoid bloat.

## Session Management

Sessions are the core unit of interaction. Every time you run `claude`, you are in a session.

### Session Files (`.jsonl`)
Sessions are stored as **JSON Lines** (`.jsonl`) files. Each line represents an event or message in the conversation history. This allows for append-only writes, which is robust and efficient.

-   **Filename**: `{UUID}.jsonl` (e.g., `550e8400-e29b-41d4-a716-446655440000.jsonl`).
-   **Content**:
    -   User messages.
    -   Assistant responses.
    -   Tool use results (e.g., `ripgrep` output).
    -   System events.

### The `--resume` (`-r`) Argument

The `--resume` flag is the mechanism to reload this state. The argument parser (`cli.js`) handles it as follows:

1.  **Input Handling**: The flag accepts a single string argument.
2.  **Resolution Logic**:
    -   **Is it a URL?** If the string is a URL, it attempts to ingress/import a session from that URL.
    -   **Is it a File Path?** If the string ends in `.jsonl` (e.g., `./my-saved-session.jsonl`), it treats it as a direct path to a session file and loads it.
    -   **Is it a UUID?** If the string matches a UUID format (validated by internal function `QC()`), it assumes it is a Session ID. It then constructs the path to the internal session store (e.g., `~/.claude/sessions/{UUID}.jsonl`) and attempts to load it.
3.  **Execution**:
    -   Once the file is located, the CLI reads the JSONL content line-by-line to reconstruct the `sessionMessages` and context.
    -   It effectively "replays" the history into its memory so the LLM knows what happened previously.
    -   The session continues appending to this file.

### "Project" Connection to Resume

When you run `claude` *without* `--resume`:
1.  The CLI checks if there is an active/recent session associated with the **current working directory** (Project).
2.  It uses the `projects` metadata to look up the last `sessionId` for this path.
3.  If found, it might prompt you to resume it.
4.  If you use `--resume` without an ID, it explicitly tries to resume the last session for the current context.

## Summary

-   **`~/.claude/projects`**: Connects your local folders to permissions and metadata.
-   **`~/.claude/sessions/*.jsonl`**: The actual "brain" of your past work.
-   **`--resume <ID>`**: Points the tool to a specific `.jsonl` file in the sessions directory.
-   **`--resume <file.jsonl>`**: specific file path.
