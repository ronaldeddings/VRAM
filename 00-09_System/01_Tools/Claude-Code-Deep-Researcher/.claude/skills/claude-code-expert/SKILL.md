---
name: claude-code-expert
description: Expert Claude Code engineer with deep knowledge of skills authoring, Agent SDK (TypeScript/Python), Claude API, prompt engineering, MCP servers, hooks, slash commands, and tool use. Use when creating skills, building agents, writing hooks, configuring MCP servers, or implementing Claude API integrations.
---

# Claude Code Expert

Expert-level guidance for Claude Code development, skills authoring, Agent SDK, and Claude API integration.

## Skills Authoring

### SKILL.md Structure

Every skill requires a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: your-skill-name
description: Brief description (max 1024 chars) of what this Skill does and when to use it. Write in third person.
---

# Skill Title

## Instructions
[Clear, step-by-step guidance]

## Examples
[Concrete examples]
```

**Field Requirements**:
- `name`: Max 64 chars, lowercase letters/numbers/hyphens only, no XML tags, no "anthropic"/"claude"
- `description`: Non-empty, max 1024 chars, no XML tags, include trigger words

### Progressive Disclosure

Skills load in three levels:
1. **Metadata** (always loaded): ~100 tokens - `name` and `description` from frontmatter
2. **Instructions** (when triggered): <5K tokens - SKILL.md body
3. **Resources** (as needed): Unlimited - additional bundled files

**Keep SKILL.md body under 500 lines**. Split into supporting files for advanced content.

### Best Practices

```
skill-name/
├── SKILL.md              # Main entry point (loaded when triggered)
├── ADVANCED.md           # Advanced patterns (loaded as needed)
├── REFERENCE.md          # API reference (loaded as needed)
└── scripts/
    └── utility.py        # Executable scripts (executed, not loaded)
```

**Key Principles**:
- Write descriptions in **third person** ("Processes files" not "I can process files")
- Be **concise** - Claude is smart, only add context it doesn't have
- Use **one-level deep references** - avoid nested file chains
- Include **trigger words** in descriptions for discovery
- Test with **Haiku, Sonnet, and Opus** models

For complete authoring guide: See [SKILLS-AUTHORING.md](SKILLS-AUTHORING.md)

## Claude Code Hooks

### Hook Types

| Event | Trigger | Use Case |
|-------|---------|----------|
| `SessionStart` | New session begins | Environment setup, status display |
| `PostToolUse` | After tool execution | Linting, formatting, validation |
| `PreToolUse` | Before tool execution | Approval, logging |
| `Notification` | Notifications sent | Custom alerts |

### Hook Configuration (settings.json)

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "osascript -l JavaScript \"$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.js\"",
        "timeout": 10
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "swift run --package-path $CLAUDE_PROJECT_DIR lint $CLAUDE_FILE_PATH",
        "timeout": 30
      }]
    }]
  }
}
```

**Environment Variables**:
- `$CLAUDE_PROJECT_DIR`: Project root directory
- `$CLAUDE_FILE_PATH`: File being edited (PostToolUse)
- `$CLAUDE_SESSION_ID`: Current session ID

### Hook Input (stdin JSON)

```javascript
// SessionStart
{ "cwd": "/path/to/project", "session_id": "abc123" }

// PostToolUse (Edit/Write)
{ "cwd": "/path/to/project", "tool_input": { "file_path": "/path/to/file.swift" } }
```

## Slash Commands

### Creating Custom Commands

Place `.md` files in `.claude/commands/`:

```bash
.claude/commands/
├── build-ios.md      # /build-ios command
├── test-all.md       # /test-all command
└── deploy/
    └── staging.md    # /deploy:staging command
```

**Command Template**:
```markdown
Build and run the iOS app on simulator:
1. Run `xcodebuild -scheme RonOS -destination 'platform=iOS Simulator,name=iPhone 16'`
2. Report any build errors
3. Launch the simulator if build succeeds
```

Commands can include:
- `$ARGUMENTS` - User-provided arguments
- `@file.md` - Include file contents
- `!command` - Execute shell command

## Agent SDK

### TypeScript SDK

```typescript
import { Claude } from "@anthropic-ai/claude-code";

const claude = new Claude({
  permissions: {
    tools: { Read: true, Write: true, Bash: { enabled: true } },
  },
});

// Streaming mode (real-time)
const stream = claude.message("Create a function...", { stream: true });
for await (const event of stream) {
  console.log(event);
}

// Single mode (wait for completion)
const response = await claude.message("Create a function...", { stream: false });
```

### Python SDK

```python
from claude_code_sdk import Claude

claude = Claude(
    permissions={
        "tools": {"Read": True, "Write": True, "Bash": {"enabled": True}}
    }
)

# Async streaming
async for event in claude.message("Create a function...", stream=True):
    print(event)

# Single response
response = await claude.message("Create a function...", stream=False)
```

### Key SDK Features

- **Permissions**: Control tool access granularly
- **Subagents**: Spawn child agents with `Task` tool
- **Sessions**: Resume conversations with session IDs
- **Custom Tools**: Define custom tool schemas
- **MCP Integration**: Connect MCP servers
- **Cost Tracking**: Monitor token usage

For complete SDK reference: See [AGENT-SDK.md](AGENT-SDK.md)

## MCP Server Integration

### Configuration (.claude/settings.json)

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": { "DEFAULT_MINIMUM_TOKENS": "10000" }
    },
    "xcode-build": {
      "command": "npx",
      "args": ["-y", "xcodebuildmcp@latest"]
    }
  }
}
```

### Using MCP Tools

Reference MCP tools with fully qualified names: `ServerName:tool_name`

```markdown
Use the BigQuery:bigquery_schema tool to retrieve table schemas.
Use the GitHub:create_issue tool to create issues.
```

### Remote MCP Servers

```json
{
  "mcpServers": {
    "remote-server": {
      "url": "https://mcp.example.com/v1",
      "headers": { "Authorization": "Bearer $API_KEY" }
    }
  }
}
```

## Claude API Patterns

### Messages API

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)
```

### Extended Thinking

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{"role": "user", "content": "Solve this complex problem..."}]
)
```

### Tool Use

```python
tools = [{
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string", "description": "City name"}
        },
        "required": ["location"]
    }
}]

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in SF?"}]
)
```

For complete API patterns: See [API-PATTERNS.md](API-PATTERNS.md)

## Prompt Engineering

### Core Principles

1. **Be Clear and Direct**: Provide explicit instructions, not hints
2. **Use XML Tags**: Structure content with `<tag>content</tag>`
3. **Show Examples**: Include input/output pairs (multishot)
4. **Chain of Thought**: Ask Claude to think step-by-step
5. **Prefill Responses**: Start Claude's response for format control

### XML Tag Patterns

```xml
<context>
Background information relevant to the task
</context>

<instructions>
Step-by-step instructions for Claude to follow
</instructions>

<examples>
<example>
<input>Example input</input>
<output>Expected output</output>
</example>
</examples>

<output_format>
Specify the exact format required
</output_format>
```

### System Prompt Best Practices

```python
system = """You are a senior software engineer specializing in Swift.

<guidelines>
- Write clean, maintainable code
- Follow Swift 6 conventions
- Include error handling
- Add inline comments for complex logic
</guidelines>

<constraints>
- Keep responses concise
- Focus on iOS 18+/macOS 15+ compatibility
- Use SwiftUI and SwiftData patterns
</constraints>"""
```

For complete prompt engineering: See [PROMPT-ENGINEERING.md](PROMPT-ENGINEERING.md)

## Tool Use Patterns

### Available Tools in Claude Code

| Tool | Purpose | Token Overhead |
|------|---------|----------------|
| `Read` | Read files | ~245 tokens |
| `Write` | Create files | ~700 tokens |
| `Edit` | Modify files | ~700 tokens |
| `Bash` | Execute commands | ~245 tokens |
| `Glob` | Find files | Minimal |
| `Grep` | Search content | Minimal |
| `Task` | Spawn subagents | Variable |
| `WebFetch` | Fetch URLs | Minimal |
| `WebSearch` | Search web | $10/1K searches |

### Best Practices

1. **Prefer specialized tools** over Bash for file operations
2. **Batch tool calls** when independent
3. **Use Task for exploration** with `subagent_type=Explore`
4. **Parallel execution** for independent operations

For complete tools reference: See [TOOLS-AND-MCP.md](TOOLS-AND-MCP.md)

## Models Reference

### Current Models (Claude 4.5)

| Model | Best For | Pricing (MTok) |
|-------|----------|----------------|
| `claude-opus-4-5` | Maximum capability, complex tasks | $5 in / $25 out |
| `claude-sonnet-4-5` | Coding, agents, long tasks | $3 in / $15 out |
| `claude-haiku-4-5` | Fast responses, high volume | $1 in / $5 out |

### Model Selection

- **Opus 4.5**: Professional engineering, advanced agents, complex specialized tasks
- **Sonnet 4.5**: Autonomous coding, multi-hour research, large context workflows
- **Haiku 4.5**: Real-time apps, cost-sensitive deployments, sub-agents

### Key Features

- **Extended Thinking**: All 4.5 models (enable with `thinking` parameter)
- **Context Awareness**: Tracks token usage across conversation
- **1M Context**: Beta for Sonnet models (`context-1m-2025-08-07`)

## Reference Documentation

- **Skills Authoring**: See [SKILLS-AUTHORING.md](SKILLS-AUTHORING.md)
- **Agent SDK**: See [AGENT-SDK.md](AGENT-SDK.md)
- **API Patterns**: See [API-PATTERNS.md](API-PATTERNS.md)
- **Prompt Engineering**: See [PROMPT-ENGINEERING.md](PROMPT-ENGINEERING.md)
- **Tools & MCP**: See [TOOLS-AND-MCP.md](TOOLS-AND-MCP.md)
- **Local Docs**: `ClaudeDocs/` directory for official documentation
