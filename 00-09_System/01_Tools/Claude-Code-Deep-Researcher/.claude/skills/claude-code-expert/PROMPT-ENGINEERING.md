# Prompt Engineering Guide

Comprehensive prompt engineering patterns for Claude API and Claude Code.

## Core Principles

### 1. Be Clear and Direct

Provide explicit instructions, not hints. Claude follows instructions literally.

```python
# Bad - vague
"Help me with this code"

# Good - explicit
"Review this Python function for performance issues.
List specific problems and provide optimized alternatives."
```

### 2. Structure with XML Tags

XML tags create clear boundaries and improve parsing accuracy.

```xml
<context>
You are reviewing a Swift codebase using SwiftData for persistence.
The app targets iOS 18+ and macOS 15+.
</context>

<task>
Identify any SwiftData anti-patterns in the provided code.
</task>

<code>
@Model
final class Task {
    var title: String
    // ... code to review
}
</code>

<output_format>
For each issue found:
1. Location (file:line)
2. Problem description
3. Recommended fix with code example
</output_format>
```

### 3. Use Examples (Multishot Prompting)

Show Claude the expected format with input/output pairs.

```xml
<examples>
<example>
<input>function calculateTotal(items) { return items.reduce((sum, i) => sum + i.price, 0); }</input>
<output>
/**
 * Calculates the total price of all items.
 * @param {Array<{price: number}>} items - Array of items with price property
 * @returns {number} Sum of all item prices
 */
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
</output>
</example>

<example>
<input>const getData = async (url) => { const res = await fetch(url); return res.json(); }</input>
<output>
/**
 * Fetches JSON data from a URL.
 * @param {string} url - The endpoint to fetch from
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} If fetch fails or response is not valid JSON
 */
async function getData(url) {
  const response = await fetch(url);
  return response.json();
}
</output>
</example>
</examples>

Now document this function following the same pattern:
<input>{{USER_CODE}}</input>
```

### 4. Chain of Thought

Ask Claude to think step-by-step for complex problems.

```python
system = """Before providing your answer, think through the problem step by step:

1. Identify the core problem
2. List relevant constraints
3. Consider possible approaches
4. Evaluate trade-offs
5. Select the best approach
6. Provide your solution

Show your reasoning in <thinking> tags before the final answer."""

# Or more simply:
"Think step by step about how to solve this, then provide your solution."
```

### 5. Prefill Responses

Start Claude's response to control format.

```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Extract the name and email from: John Smith, john@example.com"},
        {"role": "assistant", "content": '{"name": "'}  # Prefill JSON start
    ]
)
# Claude continues: John Smith", "email": "john@example.com"}
```

## System Prompt Patterns

### Expert Persona

```python
system = """You are a senior software engineer specializing in Swift development.

<expertise>
- Swift 6 with strict concurrency
- SwiftUI and SwiftData
- iOS 18+ and macOS 15+ APIs
- Performance optimization
- Security best practices
</expertise>

<guidelines>
- Write production-quality code
- Include error handling
- Follow Apple's Human Interface Guidelines
- Consider accessibility
- Optimize for both platforms
</guidelines>

<constraints>
- Target iOS 18+ and macOS 15+ only
- Use modern Swift patterns (async/await, actors)
- Avoid deprecated APIs
- Keep responses focused and concise
</constraints>"""
```

### Task-Specific Context

```python
system = """You are helping maintain a large e-commerce codebase.

<codebase_context>
- Framework: React 18 with TypeScript
- State: Redux Toolkit
- Styling: Tailwind CSS
- Testing: Jest + React Testing Library
- Build: Vite
</codebase_context>

<conventions>
- Components in PascalCase
- Hooks prefixed with 'use'
- Tests co-located with components
- Strict TypeScript (no any)
</conventions>

When modifying code, maintain existing patterns and conventions."""
```

### Output Format Control

```python
system = """Always structure your responses as follows:

<analysis>
Brief assessment of the problem or request
</analysis>

<solution>
Your recommended approach with code
</solution>

<alternatives>
Other approaches considered and why they weren't chosen
</alternatives>

<considerations>
Edge cases, potential issues, or things to watch for
</considerations>"""
```

## Advanced Patterns

### Role Assignment

```python
# Give Claude a specific role for consistent behavior
system = """You are CodeReviewer, an expert code review assistant.

Your review style:
- Start with what's done well
- Be specific about issues (file:line)
- Suggest fixes, don't just criticize
- Prioritize: security > correctness > performance > style
- Use severity levels: CRITICAL, HIGH, MEDIUM, LOW"""
```

### Constraint Setting

```python
system = """You must follow these constraints:

ALWAYS:
- Validate inputs before processing
- Handle errors explicitly
- Include type annotations
- Write tests for new functions

NEVER:
- Use eval() or exec()
- Store secrets in code
- Ignore error cases
- Skip input validation

If a request would violate these constraints, explain why and suggest alternatives."""
```

### Iterative Refinement

```python
# First pass: Generate
prompt1 = "Write a function to validate email addresses"

# Second pass: Improve
prompt2 = """Review this code and improve it:
- Add edge case handling
- Improve error messages
- Add documentation
- Optimize if possible

<code>
{previous_response}
</code>"""

# Third pass: Test
prompt3 = """Write comprehensive tests for this function:
- Happy path cases
- Edge cases
- Error cases
- Boundary conditions

<code>
{improved_code}
</code>"""
```

### Structured Data Extraction

```python
system = """Extract information into this exact JSON structure:

{
  "entities": [
    {
      "name": "string",
      "type": "person|organization|location",
      "confidence": 0.0-1.0
    }
  ],
  "relationships": [
    {
      "subject": "entity name",
      "predicate": "relationship type",
      "object": "entity name"
    }
  ],
  "summary": "one sentence summary"
}

Respond ONLY with valid JSON, no other text."""
```

## Prompt Templates

### Code Review

```xml
<task>Review this code for issues</task>

<code language="{{LANGUAGE}}">
{{CODE}}
</code>

<review_criteria>
- Security vulnerabilities
- Performance issues
- Code quality
- Best practices
- Potential bugs
</review_criteria>

<output_format>
## Summary
[One paragraph overview]

## Issues Found
### [SEVERITY] Issue Title
- **Location**: file:line
- **Problem**: Description
- **Fix**: Code example

## Positive Aspects
[What's done well]

## Recommendations
[Prioritized improvement suggestions]
</output_format>
```

### Feature Implementation

```xml
<context>
Project: {{PROJECT_NAME}}
Language: {{LANGUAGE}}
Framework: {{FRAMEWORK}}
</context>

<requirements>
{{FEATURE_REQUIREMENTS}}
</requirements>

<existing_patterns>
{{RELEVANT_CODE_SAMPLES}}
</existing_patterns>

<constraints>
- Follow existing code style
- Maintain backward compatibility
- Include error handling
- Add appropriate tests
</constraints>

<deliverables>
1. Implementation code
2. Unit tests
3. Usage documentation
4. Integration notes
</deliverables>
```

### Bug Investigation

```xml
<bug_report>
**Symptoms**: {{SYMPTOMS}}
**Expected**: {{EXPECTED_BEHAVIOR}}
**Actual**: {{ACTUAL_BEHAVIOR}}
**Steps to reproduce**: {{STEPS}}
</bug_report>

<relevant_code>
{{CODE}}
</relevant_code>

<investigation_request>
1. Identify the root cause
2. Explain why this bug occurs
3. Provide a fix
4. Suggest tests to prevent regression
</investigation_request>
```

### Documentation Generation

```xml
<code>
{{CODE_TO_DOCUMENT}}
</code>

<documentation_requirements>
- API reference (all public functions)
- Usage examples
- Parameter descriptions
- Return value descriptions
- Error conditions
- Edge cases
</documentation_requirements>

<style>
- Clear, concise language
- Code examples for each function
- Markdown format
- Include type information
</style>
```

## Tool Use Prompting

### Guiding Tool Selection

```python
system = """You have access to these tools:
- Read: Read file contents
- Write: Create new files
- Edit: Modify existing files
- Bash: Run commands
- Grep: Search file contents
- Glob: Find files by pattern

Tool selection guidelines:
- Use Grep before Read to find relevant code
- Use Glob to discover files before operating on them
- Prefer Edit over Write for existing files
- Use Read to understand context before changes
- Batch independent tool calls for efficiency"""
```

### Structured Tool Workflows

```python
system = """When implementing features, follow this workflow:

1. DISCOVER: Use Glob to find relevant files
2. UNDERSTAND: Read key files to understand patterns
3. PLAN: Outline changes needed
4. IMPLEMENT: Make changes with Edit/Write
5. VERIFY: Run tests with Bash
6. DOCUMENT: Update relevant docs

Always explain your reasoning before each tool call."""
```

## Best Practices

### Do

1. **Be specific**: "Add input validation for email field" not "improve the code"
2. **Provide context**: Include relevant code, constraints, and goals
3. **Use examples**: Show the format you want
4. **Set boundaries**: Define what's in/out of scope
5. **Structure prompts**: Use XML tags for complex prompts
6. **Iterate**: Start simple, add complexity as needed

### Don't

1. **Be vague**: Avoid "make it better" without criteria
2. **Overload**: Don't combine unrelated tasks
3. **Assume context**: Provide necessary background
4. **Skip constraints**: Always mention critical requirements
5. **Forget format**: Specify output format for structured data
6. **Ignore examples**: Examples are powerful, use them

### Optimization Tips

1. **Front-load important info**: Put critical instructions early
2. **Use bullet points**: Easier to parse than paragraphs
3. **Be consistent**: Use same terms throughout
4. **Test variations**: Try different phrasings
5. **Cache common prompts**: Use prompt caching for repeated context
6. **Monitor tokens**: Keep prompts efficient

## Debugging Prompts

### When Claude Doesn't Follow Instructions

```python
# Make instructions explicit
"You MUST include error handling. Do not skip this step."

# Add verification
"After writing the code, verify it includes:
- Input validation
- Error handling
- Type annotations
List any missing items."

# Use examples
"Here's an example of what I want: [example]
Now do the same for: [input]"
```

### When Output Format Is Wrong

```python
# Be explicit about format
"Respond with ONLY valid JSON. No explanation, no markdown."

# Prefill the response
{"role": "assistant", "content": "```json\n{"}

# Provide schema
"Output must match this schema exactly: {schema}"
```

### When Responses Are Too Long/Short

```python
# Length control
"Provide a brief response (2-3 sentences maximum)."
"Give a comprehensive analysis (minimum 500 words)."

# Content focus
"Focus only on security issues. Ignore style and performance."
"Be thorough. Cover all edge cases."
```
