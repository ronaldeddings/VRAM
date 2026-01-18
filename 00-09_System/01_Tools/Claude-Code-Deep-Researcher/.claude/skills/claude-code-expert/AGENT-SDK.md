# Agent SDK Reference

Complete guide for building agents with the Claude Agent SDK in TypeScript and Python.

## Installation

### TypeScript

```bash
npm install @anthropic-ai/claude-code
```

### Python

```bash
pip install claude-code-sdk
```

## Basic Usage

### TypeScript

```typescript
import { Claude } from "@anthropic-ai/claude-code";

const claude = new Claude({
  permissions: {
    tools: {
      Read: true,
      Write: true,
      Edit: true,
      Bash: { enabled: true, allowedCommands: ["npm", "node", "git"] },
      WebFetch: true,
    },
  },
});

// Streaming mode
const stream = claude.message("Create a React component", { stream: true });
for await (const event of stream) {
  if (event.type === "text") {
    process.stdout.write(event.text);
  } else if (event.type === "tool_use") {
    console.log(`Using tool: ${event.name}`);
  }
}

// Single mode
const response = await claude.message("What files are in src/?", { stream: false });
console.log(response.content);
```

### Python

```python
import asyncio
from claude_code_sdk import Claude

async def main():
    claude = Claude(
        permissions={
            "tools": {
                "Read": True,
                "Write": True,
                "Edit": True,
                "Bash": {"enabled": True, "allowedCommands": ["python", "pip"]},
            }
        }
    )

    # Streaming
    async for event in claude.message("Create a Python script", stream=True):
        if event.type == "text":
            print(event.text, end="")
        elif event.type == "tool_use":
            print(f"Using: {event.name}")

    # Single
    response = await claude.message("List files in current directory", stream=False)
    print(response.content)

asyncio.run(main())
```

## Permissions Configuration

### Tool Permissions

```typescript
const claude = new Claude({
  permissions: {
    tools: {
      // Boolean - enable/disable
      Read: true,
      Write: true,
      Edit: true,
      Glob: true,
      Grep: true,
      WebFetch: true,
      WebSearch: true,
      Task: true,

      // Object - fine-grained control
      Bash: {
        enabled: true,
        allowedCommands: ["npm", "node", "git", "swift", "xcodebuild"],
        deniedCommands: ["rm -rf", "sudo"],
      },

      // Path restrictions
      Write: {
        enabled: true,
        allowedPaths: ["./src/**", "./tests/**"],
        deniedPaths: ["./node_modules/**", "./.git/**"],
      },
    },
  },
});
```

### Approval Policies

```typescript
const claude = new Claude({
  permissions: {
    approvalPolicy: "auto", // auto | manual | suggest
    tools: { /* ... */ },
  },

  // Custom approval handler
  onApprovalRequest: async (request) => {
    console.log(`Tool: ${request.tool}, Input: ${request.input}`);
    return await getUserApproval(); // Return true/false
  },
});
```

## Streaming vs Single Mode

### When to Use Streaming

- Real-time UI updates
- Long-running tasks (>10 seconds)
- Progressive display of results
- Interactive applications

```typescript
const stream = claude.message(prompt, { stream: true });

for await (const event of stream) {
  switch (event.type) {
    case "text":
      displayText(event.text);
      break;
    case "thinking":
      displayThinking(event.thinking);
      break;
    case "tool_use":
      displayToolCall(event.name, event.input);
      break;
    case "tool_result":
      displayToolResult(event.result);
      break;
    case "done":
      finalize(event.response);
      break;
    case "error":
      handleError(event.error);
      break;
  }
}
```

### When to Use Single Mode

- Simple queries
- Background processing
- When you only need final result
- Batch operations

```typescript
const response = await claude.message(prompt, { stream: false });
console.log(response.content);
console.log(response.usage); // Token counts
```

## Subagents

### Spawning Subagents

```typescript
const claude = new Claude({
  permissions: {
    tools: {
      Task: true, // Enable Task tool for subagents
      Read: true,
      Write: true,
    },
  },
});

// Claude can now spawn subagents via Task tool
const stream = claude.message(
  "Analyze all TypeScript files in src/ using multiple subagents",
  { stream: true }
);
```

### Subagent Types

```typescript
// In prompts, specify subagent types:
const prompt = `
Use the Task tool with subagent_type='Explore' to search the codebase.
Use the Task tool with subagent_type='general-purpose' for complex analysis.
`;
```

## Sessions

### Creating and Resuming Sessions

```typescript
// Start new session
const response1 = await claude.message("Let's work on the auth module", {
  stream: false,
});
const sessionId = response1.sessionId;

// Resume session later
const response2 = await claude.message("Now add rate limiting", {
  stream: false,
  sessionId: sessionId, // Continue conversation
});
```

### Session Management

```typescript
// Get session info
const session = await claude.getSession(sessionId);
console.log(session.messages);
console.log(session.usage);

// Clear session
await claude.clearSession(sessionId);
```

## Custom Tools

### Defining Custom Tools

```typescript
const claude = new Claude({
  permissions: { tools: { Read: true } },

  customTools: [
    {
      name: "search_database",
      description: "Search the product database",
      input_schema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          limit: { type: "number", description: "Max results" },
        },
        required: ["query"],
      },
      handler: async (input) => {
        const results = await db.search(input.query, input.limit || 10);
        return JSON.stringify(results);
      },
    },
    {
      name: "send_notification",
      description: "Send a notification to the user",
      input_schema: {
        type: "object",
        properties: {
          message: { type: "string" },
          priority: { type: "string", enum: ["low", "normal", "high"] },
        },
        required: ["message"],
      },
      handler: async (input) => {
        await notifications.send(input.message, input.priority);
        return "Notification sent";
      },
    },
  ],
});
```

### Python Custom Tools

```python
claude = Claude(
    permissions={"tools": {"Read": True}},
    custom_tools=[
        {
            "name": "get_weather",
            "description": "Get current weather",
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"}
                },
                "required": ["city"]
            },
            "handler": lambda input: get_weather_data(input["city"])
        }
    ]
)
```

## MCP Integration

### Configuring MCP Servers

```typescript
const claude = new Claude({
  permissions: { tools: { Read: true, Bash: { enabled: true } } },

  mcpServers: {
    "database": {
      command: "node",
      args: ["./mcp-servers/database-server.js"],
      env: { DATABASE_URL: process.env.DATABASE_URL },
    },
    "github": {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: { GITHUB_TOKEN: process.env.GITHUB_TOKEN },
    },
  },
});
```

### Remote MCP Servers

```typescript
const claude = new Claude({
  mcpServers: {
    "remote-api": {
      url: "https://mcp.example.com/v1",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  },
});
```

## System Prompts

### Modifying System Prompts

```typescript
const claude = new Claude({
  systemPrompt: `You are an expert Swift developer.

<guidelines>
- Follow Swift 6 conventions
- Use SwiftUI and SwiftData patterns
- Include proper error handling
- Write tests for new code
</guidelines>

<context>
Project: RonOS - iOS/macOS app
Framework: Swift 6, SwiftUI, SwiftData
Target: iOS 18+, macOS 15+
</context>`,

  permissions: { tools: { Read: true, Write: true } },
});
```

### Appending to System Prompt

```typescript
const claude = new Claude({
  systemPromptAppend: `
Additional context for this session:
- Focus on performance optimization
- Avoid breaking changes
`,
  permissions: { /* ... */ },
});
```

## Cost Tracking

### Monitoring Usage

```typescript
const stream = claude.message(prompt, { stream: true });

for await (const event of stream) {
  if (event.type === "done") {
    console.log("Input tokens:", event.response.usage.input_tokens);
    console.log("Output tokens:", event.response.usage.output_tokens);
    console.log("Cache read:", event.response.usage.cache_read_input_tokens);
    console.log("Cache write:", event.response.usage.cache_creation_input_tokens);
  }
}
```

### Cost Calculation

```typescript
const PRICING = {
  "claude-sonnet-4-5": { input: 3, output: 15 }, // per MTok
  "claude-opus-4-5": { input: 5, output: 25 },
  "claude-haiku-4-5": { input: 1, output: 5 },
};

function calculateCost(usage, model) {
  const pricing = PRICING[model];
  return (
    (usage.input_tokens * pricing.input / 1_000_000) +
    (usage.output_tokens * pricing.output / 1_000_000)
  );
}
```

## Todo Tracking

### Accessing Todo State

```typescript
const stream = claude.message("Build the auth module", { stream: true });

for await (const event of stream) {
  if (event.type === "tool_use" && event.name === "TodoWrite") {
    console.log("Todo update:", event.input.todos);
  }
}
```

## Structured Outputs

### JSON Schema Responses

```typescript
const response = await claude.message(
  "Extract product info from this text: ...",
  {
    stream: false,
    responseSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        price: { type: "number" },
        category: { type: "string" },
      },
      required: ["name", "price"],
    },
  }
);

const product = JSON.parse(response.content);
```

## Error Handling

### Common Errors

```typescript
try {
  const response = await claude.message(prompt, { stream: false });
} catch (error) {
  if (error.code === "rate_limit_error") {
    await sleep(error.retryAfter * 1000);
    // Retry
  } else if (error.code === "invalid_request_error") {
    console.error("Bad request:", error.message);
  } else if (error.code === "authentication_error") {
    console.error("Check API key");
  } else if (error.code === "permission_error") {
    console.error("Tool not permitted:", error.tool);
  }
}
```

### Streaming Error Handling

```typescript
const stream = claude.message(prompt, { stream: true });

for await (const event of stream) {
  if (event.type === "error") {
    console.error("Stream error:", event.error);
    // Handle gracefully
    break;
  }
}
```

## Best Practices

### Performance

1. **Use streaming** for long tasks
2. **Enable prompt caching** for repeated context
3. **Batch operations** when possible
4. **Use Haiku** for simple subagent tasks

### Security

1. **Restrict tool permissions** to minimum required
2. **Validate tool inputs** in custom handlers
3. **Use allowed/denied paths** for file access
4. **Avoid exposing secrets** in prompts

### Reliability

1. **Implement retry logic** for rate limits
2. **Handle stream interruptions** gracefully
3. **Set reasonable timeouts**
4. **Monitor token usage** to avoid surprises
