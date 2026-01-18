IMPORTANT! THIS IS NOT A REACT APP. Pure CSS, HTML, and BUN!

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code Deep Researcher is a comprehensive conversation analyzer and session management toolkit for Claude Code JSONL files. It provides:
- Streaming JSONL parser for Claude Code conversation logs
- 4-layer validation system (schema, relationships, tool usage, completeness)
- Session resume/duplicate capabilities via Claude Agent SDK
- Context optimization for prebaking conversation context
- Multi-agent conversation analysis

## Build & Development Commands

```bash
# Install dependencies
bun install

# Build all components (creates dist/ directory)
bun run build

# Run TypeScript type checking
bun run typecheck

# Run all tests (66 tests across 4 test suites)
bun test

# Run specific test file
bun test tests/jsonl-parser.test.ts
bun test tests/validators.test.ts
bun test tests/performance.test.ts

# Development mode with hot reload
bun run dev
```

## CLI Tools

After building, four CLI tools are available:

```bash
# Main conversation analyzer (5 commands: analyze, list, steps, export, validate)
bun run src/cli/conversation-analyzer.ts <command>

# Context optimizer for prebaking
bun run src/cli/context-optimizer-cli.ts

# Session resume validator
bun run src/cli/validate-session-resume.ts
```

## Architecture

### Service Layer (`src/services/`)

The codebase uses a service-oriented architecture:

- **ClaudeCodeApp** (`claude-sdk-app.ts`): Main facade coordinating all services
- **JSONLParser** (`jsonl-parser.ts`): Streaming parser using Bun's file API for memory-efficient large file handling
- **ConversationBuilder** (`conversation-builder.ts`): Builds conversation trees from flat JSONL entries, extracts action sequences
- **StepAnalyzer** (`step-analyzer.ts`): Comprehensive analysis with cost tracking, tool usage patterns, performance metrics
- **SessionManager** (`session-manager.ts`): Manages session files in `~/.claude/projects/`
- **ContextDistiller** (`context-distiller.ts`): Distills conversation context for session resume
- **MultiAgentOptimizer** (`multi-agent-optimizer.ts`): Handles conversations with Task tool sub-agents

### Validation System (`src/validators/`)

4-layer validation coordinated by `ConversationValidator`:
1. **SchemaValidator**: Entry structure and field requirements
2. **RelationshipValidator**: UUID chains and parent-child relationships
3. **ToolUseValidator**: Tool call/result pairing
4. **CompletenessChecker**: Conversation termination and quality patterns

### Type System (`src/types/claude-conversation.ts`)

Discriminated union types for all JSONL entry types with type guards:
- `ConversationEntry` = UserMessageEntry | AssistantMessageEntry | SystemMessageEntry | SummaryEntry | QueueOperationEntry | FileHistorySnapshotEntry | ResultEntry
- Type guards: `isUserMessage()`, `isAssistantMessage()`, `isToolUseContent()`, etc.

## Key Dependencies

- `@anthropic-ai/claude-agent-sdk`: SDK for session management and prompt execution
- `@anthropic-ai/tokenizer`: Token counting for context optimization
- `commander`: CLI interface
- `zod`: Schema validation

## JSONL Data Location

Conversation files are stored at: `~/.claude/projects/{encoded-project-path}/{session-id}.jsonl`

Project paths are base64-encoded in the directory name.

## Testing

Tests use Bun's built-in test runner. Performance tests generate synthetic JSONL files to benchmark parsing speed (target: >2000 entries/sec, actual: >600,000 entries/sec).


IMPORTANT! THIS IS NOT A REACT APP. Pure CSS, HTML, and BUN!