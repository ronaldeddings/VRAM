# Tools and MCP Reference

Complete reference for Claude Code tools and MCP (Model Context Protocol) server integration.

## Built-in Tools

### File Operations

#### Read

Read file contents from the filesystem.

```
Purpose: Read files, images, PDFs, Jupyter notebooks
Token Overhead: ~245 tokens
Best For: Understanding code before modifications
```

**Parameters**:
- `file_path` (required): Absolute path to file
- `offset` (optional): Line number to start from
- `limit` (optional): Number of lines to read

**Usage Notes**:
- Always read before Write or Edit
- Can read images (PNG, JPG) - multimodal
- Can read PDFs page by page
- Can read Jupyter notebooks with outputs
- Use for understanding context before changes

#### Write

Create or overwrite files.

```
Purpose: Create new files
Token Overhead: ~700 tokens
Best For: New file creation only
```

**Parameters**:
- `file_path` (required): Absolute path
- `content` (required): File contents

**Usage Notes**:
- Prefer Edit for existing files
- Requires Read first for existing files
- Use absolute paths only

#### Edit

Modify existing files with string replacement.

```
Purpose: Targeted file modifications
Token Overhead: ~700 tokens
Best For: Precise code changes
```

**Parameters**:
- `file_path` (required): Absolute path
- `old_string` (required): Text to replace (must be unique)
- `new_string` (required): Replacement text
- `replace_all` (optional): Replace all occurrences

**Usage Notes**:
- `old_string` must be unique in file
- Preserve exact indentation from Read output
- Use `replace_all` for renaming variables
- Requires Read first

### Search Operations

#### Glob

Fast pattern-based file finding.

```
Purpose: Find files by name patterns
Token Overhead: Minimal
Best For: File discovery
```

**Parameters**:
- `pattern` (required): Glob pattern (e.g., `**/*.swift`)
- `path` (optional): Directory to search

**Patterns**:
```bash
**/*.swift       # All Swift files recursively
src/**/*.ts      # TypeScript in src/
*.{js,jsx,ts,tsx} # Multiple extensions
**/Test*.swift   # Files starting with Test
```

#### Grep

Content search using ripgrep.

```
Purpose: Search file contents
Token Overhead: Minimal
Best For: Finding code patterns
```

**Parameters**:
- `pattern` (required): Regex pattern
- `path` (optional): Search directory
- `glob` (optional): File filter pattern
- `type` (optional): File type (js, py, swift)
- `output_mode`: `files_with_matches`, `content`, `count`
- `-n`: Show line numbers
- `-i`: Case insensitive
- `-A/-B/-C`: Context lines

**Examples**:
```python
# Find function definitions
pattern: "func\s+\w+"
type: "swift"

# Find imports
pattern: "import.*SwiftData"
output_mode: "content"
-n: true

# Find TODO comments
pattern: "TODO|FIXME"
-i: true
```

### Execution

#### Bash

Execute shell commands.

```
Purpose: Run commands, git, npm, etc.
Token Overhead: ~245 tokens
Best For: Build, test, git operations
```

**Parameters**:
- `command` (required): Shell command
- `timeout` (optional): Max ms (default 120000)
- `run_in_background` (optional): Non-blocking

**Safe Operations**:
- `git status`, `git diff`, `git log`
- `npm install`, `npm test`, `npm run`
- `swift build`, `swift test`
- `xcodebuild` commands
- `ls`, `pwd`, `which`

**Avoid**:
- `rm -rf` without explicit permission
- `sudo` commands
- `git push --force`
- Interactive commands (`git rebase -i`)

### Web Operations

#### WebFetch

Fetch and process web content.

```
Purpose: Retrieve web content
Token Overhead: Minimal
Best For: Documentation, API references
```

**Parameters**:
- `url` (required): URL to fetch
- `prompt` (required): What to extract

**Usage**:
```python
url: "https://docs.swift.org/swift-book/"
prompt: "Extract the concurrency chapter summary"
```

#### WebSearch

Search the web.

```
Purpose: Find current information
Cost: $10/1K searches
Best For: Recent docs, current events
```

**Parameters**:
- `query` (required): Search query
- `allowed_domains` (optional): Limit to domains
- `blocked_domains` (optional): Exclude domains

### Agent Operations

#### Task

Spawn subagents for complex work.

```
Purpose: Delegate to specialized agents
Token Overhead: Variable
Best For: Parallel exploration, complex analysis
```

**Parameters**:
- `prompt` (required): Task description
- `subagent_type` (required): Agent type
- `model` (optional): haiku, sonnet, opus
- `run_in_background` (optional): Async execution

**Agent Types**:
- `Explore`: Quick codebase exploration
- `general-purpose`: Complex multi-step tasks
- `Plan`: Implementation planning

**Usage**:
```python
# Parallel exploration
subagent_type: "Explore"
prompt: "Find all SwiftData model definitions"

# Complex analysis
subagent_type: "general-purpose"
prompt: "Analyze the authentication flow and identify security issues"
```

#### TodoWrite

Track task progress.

```
Purpose: Task management
Best For: Multi-step operations
```

**Structure**:
```json
{
  "todos": [
    {
      "content": "Task description",
      "status": "pending|in_progress|completed",
      "activeForm": "Present continuous form"
    }
  ]
}
```

### User Interaction

#### AskUserQuestion

Request user input.

```
Purpose: Get clarification or decisions
Best For: Ambiguous requirements
```

**Parameters**:
- `questions`: Array of questions (1-4)
  - `question`: The question text
  - `header`: Short label (max 12 chars)
  - `options`: 2-4 choices with labels/descriptions
  - `multiSelect`: Allow multiple selections

## Tool Usage Patterns

### Efficient Discovery

```python
# 1. Find files first
Glob: pattern="**/*.swift"

# 2. Search for patterns
Grep: pattern="@Model", type="swift"

# 3. Read specific files
Read: file_path="/path/to/Model.swift"
```

### Safe File Modification

```python
# 1. Always read first
Read: file_path="/path/to/file.swift"

# 2. Make targeted edits
Edit:
  file_path="/path/to/file.swift"
  old_string="old code"
  new_string="new code"

# 3. Verify changes
Bash: command="swift build"
```

### Parallel Operations

```python
# Independent operations can run in parallel
# Send multiple tool calls in one message

# Parallel reads
Read: file_path="/path/to/file1.swift"
Read: file_path="/path/to/file2.swift"
Read: file_path="/path/to/file3.swift"

# Parallel searches
Grep: pattern="TODO", path="/src"
Grep: pattern="FIXME", path="/src"
```

### Background Tasks

```python
# Long-running operations
Bash:
  command="npm run build"
  run_in_background=true

# Check status later
TaskOutput: task_id="abc123"
```

## MCP Server Integration

### Configuration

MCP servers are configured in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "API_KEY": "value"
      }
    }
  }
}
```

### Local Server (Command)

```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["./mcp-servers/db-server.js"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### NPX Package

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "DEFAULT_MINIMUM_TOKENS": "10000"
      }
    }
  }
}
```

### Remote Server (URL)

```json
{
  "mcpServers": {
    "remote-api": {
      "url": "https://mcp.example.com/v1",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

### Using MCP Tools

MCP tools are prefixed with `mcp__servername__`:

```
mcp__context7__resolve-library-id
mcp__context7__get-library-docs
mcp__XcodeBuildMCP__build_sim
mcp__XcodeBuildMCP__list_sims
```

### Common MCP Servers

#### Context7 (Documentation)

```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"]
  }
}
```

**Tools**:
- `resolve-library-id`: Find library ID
- `get-library-docs`: Fetch documentation

**Usage**:
```python
# 1. Resolve library
mcp__context7__resolve-library-id:
  libraryName: "SwiftUI"

# 2. Get docs
mcp__context7__get-library-docs:
  context7CompatibleLibraryID: "/apple/swiftui"
  topic: "NavigationSplitView"
```

#### XcodeBuildMCP (iOS/macOS)

```json
{
  "xcode-build": {
    "command": "npx",
    "args": ["-y", "xcodebuildmcp@latest"]
  }
}
```

**Tools**:
- `list_sims`: List simulators
- `build_sim`: Build for simulator
- `build_macos`: Build for macOS
- `test_sim`: Run tests
- `list_schemes`: List project schemes

#### Chrome DevTools

```json
{
  "chrome": {
    "command": "npx",
    "args": ["-y", "@anthropic-ai/mcp-chrome-devtools"]
  }
}
```

**Tools**:
- `take_snapshot`: DOM snapshot
- `take_screenshot`: Visual capture
- `click`, `fill`, `hover`: Interactions
- `navigate_page`: Navigation
- `evaluate_script`: Run JavaScript

## Tool Selection Guidelines

### When to Use Each Tool

| Need | Tool | Why |
|------|------|-----|
| Find files | Glob | Fast pattern matching |
| Find code | Grep | Content search |
| Read file | Read | Full content access |
| New file | Write | Clean creation |
| Change file | Edit | Precise modifications |
| Run command | Bash | System operations |
| Get docs | WebFetch/Context7 | External information |
| Complex task | Task | Parallel processing |
| User input | AskUserQuestion | Clarification |

### Tool Combinations

**Feature Implementation**:
```
1. Glob → Find relevant files
2. Grep → Find patterns to follow
3. Read → Understand existing code
4. Edit → Make changes
5. Bash → Test changes
```

**Code Review**:
```
1. Grep → Find modified areas
2. Read → Review changes
3. Task (Explore) → Check impacts
4. TodoWrite → Track issues
```

**Documentation**:
```
1. Glob → Find source files
2. Read → Extract signatures
3. Context7 → Get conventions
4. Write → Create docs
```

## Best Practices

### Efficiency

1. **Batch independent calls**: Multiple Reads in one message
2. **Use Grep before Read**: Narrow down files first
3. **Prefer Task for exploration**: Offload large searches
4. **Cache-friendly patterns**: Reuse tool results

### Safety

1. **Always Read before Edit**: Understand context
2. **Use absolute paths**: Prevent traversal
3. **Validate before execution**: Check commands
4. **No auto-commit**: Wait for user permission

### Quality

1. **Verify changes**: Run tests after edits
2. **Check both platforms**: iOS and macOS
3. **Document modifications**: Update relevant docs
4. **Clean up**: Remove temp files
