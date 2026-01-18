# Claude API Patterns

Complete reference for Claude API usage patterns and best practices.

## Authentication

```python
import anthropic

# From environment variable (recommended)
client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY

# Explicit key
client = anthropic.Anthropic(api_key="sk-ant-...")
```

## Messages API

### Basic Request

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(response.content[0].text)
print(f"Tokens: {response.usage.input_tokens} in, {response.usage.output_tokens} out")
```

### With System Prompt

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system="You are a helpful Swift programming assistant.",
    messages=[
        {"role": "user", "content": "How do I create a SwiftData model?"}
    ]
)
```

### Multi-Turn Conversation

```python
messages = [
    {"role": "user", "content": "What is SwiftData?"},
    {"role": "assistant", "content": "SwiftData is Apple's modern persistence framework..."},
    {"role": "user", "content": "Show me an example model."}
]

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=messages
)
```

## Streaming

### Basic Streaming

```python
with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Write a poem"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### Event-Based Streaming

```python
with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Explain recursion"}]
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "text_delta":
                print(event.delta.text, end="")
        elif event.type == "message_stop":
            print("\n--- Done ---")
```

### TypeScript Streaming

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 4096,
  messages: [{ role: "user", content: "Write a function" }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta") {
    process.stdout.write(event.delta.text || "");
  }
}
```

## Extended Thinking

### Basic Thinking

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Solve this complex algorithm problem..."
    }]
)

# Access thinking
for block in response.content:
    if block.type == "thinking":
        print("Thinking:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
```

### Streaming with Thinking

```python
with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "Design an API"}]
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if hasattr(event.delta, "thinking"):
                print(f"[thinking] {event.delta.thinking}", end="")
            elif hasattr(event.delta, "text"):
                print(event.delta.text, end="")
```

## Tool Use

### Defining Tools

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and state, e.g., 'San Francisco, CA'"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "search_database",
        "description": "Search the product database",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "max_results": {"type": "integer", "default": 10}
            },
            "required": ["query"]
        }
    }
]
```

### Tool Use Loop

```python
def run_conversation(user_message):
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # Check if done
        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Add assistant response and tool results
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

def execute_tool(name, input):
    if name == "get_weather":
        return get_weather(input["location"], input.get("unit", "fahrenheit"))
    elif name == "search_database":
        return search_db(input["query"], input.get("max_results", 10))
```

### Parallel Tool Calls

```python
# Claude can call multiple tools in one response
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    tools=tools,
    messages=[{
        "role": "user",
        "content": "What's the weather in SF and NYC?"
    }]
)

# Response may contain multiple tool_use blocks
tool_calls = [b for b in response.content if b.type == "tool_use"]
# Process all in parallel
results = await asyncio.gather(*[
    execute_tool_async(tc.name, tc.input) for tc in tool_calls
])
```

## Vision

### Image from URL

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "url",
                    "url": "https://example.com/image.jpg"
                }
            },
            {
                "type": "text",
                "text": "What's in this image?"
            }
        ]
    }]
)
```

### Image from Base64

```python
import base64

with open("image.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": image_data
                }
            },
            {"type": "text", "text": "Describe this image"}
        ]
    }]
)
```

## PDF Support

```python
import base64

with open("document.pdf", "rb") as f:
    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": pdf_data
                }
            },
            {"type": "text", "text": "Summarize this document"}
        ]
    }]
)
```

## Prompt Caching

### Basic Caching

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": "You are an expert programmer...",  # Long system prompt
            "cache_control": {"type": "ephemeral"}  # Cache this
        }
    ],
    messages=[{"role": "user", "content": "Write a function"}]
)

# Check cache usage
print(f"Cache read: {response.usage.cache_read_input_tokens}")
print(f"Cache write: {response.usage.cache_creation_input_tokens}")
```

### Extended TTL

```python
# Beta header required
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["extended-cache-ttl-2025-04-11"],
    system=[{
        "type": "text",
        "text": "Large context...",
        "cache_control": {"type": "ephemeral", "ttl": "1h"}  # 1 hour TTL
    }],
    messages=[{"role": "user", "content": "Query"}]
)
```

## Batch Processing

### Create Batch

```python
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "request-1",
            "params": {
                "model": "claude-sonnet-4-5-20250929",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "Hello"}]
            }
        },
        {
            "custom_id": "request-2",
            "params": {
                "model": "claude-sonnet-4-5-20250929",
                "max_tokens": 1024,
                "messages": [{"role": "user", "content": "World"}]
            }
        }
    ]
)

print(f"Batch ID: {batch.id}")
print(f"Status: {batch.processing_status}")
```

### Poll for Results

```python
import time

while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(30)

# Get results
for result in client.messages.batches.results(batch.id):
    print(f"{result.custom_id}: {result.result.message.content[0].text}")
```

## Token Counting

```python
count = client.messages.count_tokens(
    model="claude-sonnet-4-5-20250929",
    messages=[
        {"role": "user", "content": "How many tokens is this?"}
    ],
    system="You are helpful."
)

print(f"Input tokens: {count.input_tokens}")
```

## Error Handling

```python
from anthropic import (
    APIError,
    AuthenticationError,
    RateLimitError,
    APIConnectionError
)

try:
    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        messages=[{"role": "user", "content": "Hello"}]
    )
except AuthenticationError:
    print("Check your API key")
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.response.headers.get('retry-after')}s")
except APIConnectionError:
    print("Network error - check connection")
except APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
```

## Beta Features

### Enable Beta Features

```python
# Use beta client
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["skills-2025-10-02", "code-execution-2025-08-25"],
    messages=[{"role": "user", "content": "Create a spreadsheet"}]
)
```

### Current Beta Headers

| Feature | Beta Header |
|---------|-------------|
| Skills | `skills-2025-10-02` |
| Code Execution | `code-execution-2025-08-25` |
| Files API | `files-api-2025-04-14` |
| Extended Cache | `extended-cache-ttl-2025-04-11` |
| 1M Context | `context-1m-2025-08-07` |
| Structured Output | `structured-outputs-2025-11-13` |
| Advanced Tools | `advanced-tool-use-2025-11-20` |

## Rate Limits

### Headers to Monitor

```python
response = client.messages.create(...)

# Check rate limit headers
headers = response.response.headers
print(f"Requests remaining: {headers.get('anthropic-ratelimit-requests-remaining')}")
print(f"Tokens remaining: {headers.get('anthropic-ratelimit-tokens-remaining')}")
print(f"Reset time: {headers.get('anthropic-ratelimit-requests-reset')}")
```

### Handling Rate Limits

```python
import time
from anthropic import RateLimitError

def make_request_with_retry(messages, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=4096,
                messages=messages
            )
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            retry_after = int(e.response.headers.get("retry-after", 60))
            time.sleep(retry_after)
```

## Service Tiers

```python
# Use priority tier if available
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    service_tier="auto",  # auto | standard_only
    messages=[{"role": "user", "content": "Hello"}]
)

# Check which tier was used
print(f"Service tier: {response.service_tier}")
```

## Best Practices

### Optimize for Cost

1. **Use prompt caching** for repeated context (90% savings)
2. **Use batch API** for async processing (50% savings)
3. **Choose appropriate model**: Haiku for simple, Sonnet for complex
4. **Count tokens** before large requests

### Optimize for Speed

1. **Use streaming** for perceived latency
2. **Enable caching** to skip repeated processing
3. **Use Haiku** for latency-sensitive tasks
4. **Parallelize** independent requests

### Optimize for Quality

1. **Use extended thinking** for complex reasoning
2. **Provide clear system prompts**
3. **Include examples** in prompts
4. **Use appropriate model**: Opus for maximum capability
