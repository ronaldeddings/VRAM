# Developer Guide: Internals & Specifications

**Warning**: This documentation is based on reverse-engineering the minified `cli.js` binary (v2.0.69). It is not official Anthropic documentation.

## 1. Storage Layout & Algorithms

The Claude Code CLI uses a deterministic directory structure to manage state.

### 1.1 Path Sanitization Algorithm
To map a project directory to a storage folder, the CLI uses the following sanitization function:

```typescript
/**
 * Converts a file system path to a safe directory name.
 * Replaces all non-alphanumeric characters with hyphens.
 */
function sanitizePath(path: string): string {
  return path.replace(/[^a-zA-Z0-9]/g, "-");
}
```

**Usage:**
- `input`: `/Users/alice/dev/backend-api`
- `output`: `-Users-alice-dev-backend-api`
- `location`: `~/.claude/projects/-Users-alice-dev-backend-api/`

### 1.2 Session Resolution
To find the active session for a directory:
1. Calculate `sanitizedPath` for `process.cwd()`.
2. List files in `~/.claude/projects/{sanitizedPath}/`.
3. Filter for `*.jsonl`.
4. Sort by `fs.stat().mtime` (descending).
5. The first file is the current/latest session.

## 2. File Formats

### 2.1 Session Logs (`.jsonl`)
Session files are Append-Only JSON Lines. Each line is a JSON object representing an event.

**Common Fields:**
```typescript
interface SessionEvent {
  type: "user" | "assistant" | "tool_use" | "tool_result" | "system";
  timestamp: string; // ISO 8601
  uuid: string; // Unique Event ID
  session_id: string; // Parent Session ID
}
```

**Event Types (Inferred):**

**User Message:**
```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "List files in src/"
  }
}
```

**Tool Use:**
```json
{
  "type": "tool_use",
  "tool_use_id": "toolu_01...",
  "name": "ls",
  "input": { "path": "src/" }
}
```

**Tool Result:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01...",
  "content": "index.ts\nutils.ts..."
}
```

### 2.2 Configuration (`config.json`)
Located at `~/.claude/config.json`.

**Schema:**
```typescript
interface Config {
  // Global User Settings
  userSettings: {
    model?: string; // e.g. "claude-3-5-sonnet-..."
    alwaysThinkingEnabled?: boolean;
    theme?: "light" | "dark";
  };

  // Project-Specific Permissions
  projects: Record<string, ProjectMetadata>;
}

interface ProjectMetadata {
  hasTrustDialogAccepted: boolean;
  allowedTools: string[];
  mcpServers: Record<string, any>;
  projectOnboardingSeenCount: number;
}
```

## 3. Remote Synchronization Protocol

The CLI syncs local sessions with Anthropic's cloud (`api.anthropic.com`) if authenticated.

### 3.1 Egress (Sync Up)
- **Endpoint**: `PUT /v1/sessions/{session_id}/log` (or similar)
- **Headers**:
  - `Authorization`: `Bearer {oauth_token}`
  - `X-Organization-Uuid`: `{org_uuid}`
  - `Last-Uuid`: `{last_seen_event_uuid}` (Optimistic Locking)
- **Payload**: The new JSONL line(s) to append.

### 3.2 Ingress (Sync Down / Resume via URL)
- **Endpoint**: `GET /v1/sessions`
- **Logic**: The CLI fetches the session history and replays it into the local state.

## 4. MCP (Model Context Protocol) Integration

The CLI acts as an **MCP Host**.
- It reads `.mcp.json` in the project root.
- It spins up MCP servers as subprocesses (`stdio` transport).
- It proxies "tool use" requests from the LLM to these subprocesses.

**Configuration (`.mcp.json`):**
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "mcp/sqlite"]
    }
  }
}
```

## 5. Sub-Agents & Tracing

The CLI uses a "Planner/Executor" model.
- **Main Session**: High-level conversation.
- **Sub-Agent Logs**: `~/.claude/projects/.../agent-{UUID}.jsonl`
- **Correlation**: The main session likely contains a "thought" or "plan" event that references the sub-agent's UUID. This allows the UI to show a spinner while the sub-agent works in the background.

```