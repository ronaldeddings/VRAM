# Deep Internals: State, Sessions, and Project Architecture

**Status**: Reverse Engineered Technical Specification
**Artifact**: `@anthropic-ai/claude-code` (v2.0.69)

This document provides a low-level explanation of how the Claude Code CLI manages state, maps directories to projects, and handles session resumption.

## 1. The Project Mapping Architecture

The CLI does not pollute your project directories with metadata (like `.git` does). Instead, it centralizes all state in `~/.claude` (or `CLAUDE_CONFIG_DIR`). It links your current working directory to this central store using a **Sanitized Path Mapping** strategy.

### Path Sanitization (`eu` function)

To create a unique key for every project on your disk, the CLI transforms the absolute path by replacing all non-alphanumeric characters with hyphens (`-`).

**Logic:**
```javascript
// Function eu(A) in cli.js
function sanitizePath(path) {
  return path.replace(/[^a-zA-Z0-9]/g, "-");
}
```

**Example:**
*   **Original Path**: `/Users/ronald/my-app`
*   **Sanitized Key**: `-Users-ronald-my-app`
*   **Storage Location**: `~/.claude/projects/-Users-ronald-my-app/`

### The Projects Directory (`~/.claude/projects/`)

This directory contains subdirectories named after these sanitized keys. Inside each subdirectory, you will find the actual session data for that project.

```
~/.claude/projects/
├── -Users-ronald-project-alpha/      # Data for /Users/ronald/project-alpha
│   ├── 550e8400-e29b....jsonl        # A session in this project
│   └── agent-550e8400....jsonl       # Debug logs for sub-agents
└── -Users-ronald-project-beta/
    └── ...
```

## 2. Global Project Configuration

While *session data* lives in the `projects` folder, *permissions and settings* are stored in the main `~/.claude/config.json` file under the `projects` key.

### Schema

The `projects` key maps the **original absolute path** to a metadata object:

```json
{
  "projects": {
    "/Users/ronald/my-app": {
      "hasTrustDialogAccepted": true,          // User has approved tools for this path
      "allowedTools": [],                      // Allowlist for specific tools
      "mcpServers": {},                        // MCP server config specific to this project
      "enabledMcpjsonServers": [],
      "projectOnboardingSeenCount": 1,         // Has the user seen the welcome message?
      "hasClaudeMdExternalIncludesApproved": false
    }
  }
}
```

## 3. Session Resolution & Auto-Resume

When you run `claude` without arguments, it must decide whether to start a new session or resume an existing one.

### Discovery Algorithm

1.  **Identify Context**: The CLI determines the Current Working Directory (CWD).
2.  **Resolve Storage Path**: It applies the sanitization function to CWD to find the corresponding folder in `~/.claude/projects/`.
3.  **Scan for Sessions**: It reads that directory looking for files ending in `.jsonl`.
4.  **Sort by Recency**: It performs a `stat` on every file and sorts them by `mtime` (Modification Time), descending.
5.  **Select Candidate**:
    *   If a file exists, the most recent one is the candidate for "Last Session".
    *   The CLI may prompt you to resume this session or start a new one depending on how much time has passed or the specific command used.

## 4. The `--resume` (`-r`) Argument Flow

The `--resume` argument bypasses the discovery algorithm and directly targets a session.

### Implementation Logic

The argument parser checks the input string against three patterns:

1.  **UUID Check**:
    *   **Regex**: `^[0-9a-f]{8}-[0-9a-f]{4}-...$`
    *   **Action**: If it matches, the CLI assumes it is a Session ID. It looks for this ID within the *current project's* storage folder (`~/.claude/projects/{SANITIZED_CWD}/{UUID}.jsonl`).

2.  **File Path Check**:
    *   **Condition**: Ends with `.jsonl`.
    *   **Action**: It treats the string as a direct file path (relative or absolute). This allows you to share session files or store them outside the standard location.
    *   **Note**: This is useful for archiving sessions or sharing context with teammates.

3.  **URL Check**:
    *   **Condition**: Valid `http://` or `https://` URL.
    *   **Action**: Triggers a "Session Ingress" workflow. The CLI attempts to fetch the session data from the URL (likely expecting a raw JSONL response or a specific Anthropic API endpoint) and hydrates the local state with it.

## 5. Remote Persistence & Sync

The CLI is designed to work with Anthropic's web interface.

*   **Ingress**: Pulling remote sessions (via URL).
*   **Egress**: Pushing local sessions.
    *   The CLI sends `PUT` requests to `api.anthropic.com/v1/sessions/...`.
    *   It uses an Optimistic Locking mechanism via the `Last-Uuid` header to prevent overwriting changes if multiple clients are active.
    *   **Authentication**: Requires an OAuth token (stored in `config.json` or `~/.claude.json`), distinct from the API Key.

## 6. Sub-Agent Logging (`agent-*.jsonl`)

The CLI uses a multi-agent architecture (Planner/Executor).
*   **Main Session**: `{UUID}.jsonl` contains the user-facing conversation.
*   **Sub-Agent Traces**: `agent-{UUID}.jsonl` contains the internal "thoughts", tool executions, and step-by-step planning of the sub-agents.
*   **Linkage**: The main session likely references the sub-agent trace ID, allowing the UI (or debug tools) to expand a "Thinking..." block and show the detailed execution steps.
