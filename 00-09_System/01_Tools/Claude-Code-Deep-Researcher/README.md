# Claude Code JSONL Parser

Comprehensive conversation analyzer for Claude Code JSONL files with streaming parser, validation system, CLI tools, and performance benchmarking.

## 🚀 Features Overview

### Core JSONL Parser Features

1. **🔄 Streaming JSONL Parser** - Memory-efficient parsing of large conversation files using Bun's file API
2. **🏗️ Conversation Builder** - Builds conversation trees and extracts action sequences from flat entry arrays  
3. **🔍 Step Analyzer** - Comprehensive conversation analysis with cost tracking, performance metrics, and insights
4. **✅ Validation System** - 4-layer validation (schema, relationships, tool usage, completeness) with detailed reporting
5. **💻 CLI Interface** - 5 commands for analyzing, listing, exporting, validating, and extracting conversation data
6. **⚡ Performance Benchmarks** - Comprehensive test suite with memory usage tracking and scalability tests

### Technical Achievements

- **✅ Real JSONL Data Analysis** - Based on actual Claude Code conversation files, not mock data
- **✅ Memory Efficient Streaming** - Handles files >5MB with constant memory usage
- **✅ Comprehensive Type System** - 100% TypeScript coverage with discriminated union types  
- **✅ Circular Reference Protection** - Safe handling of malformed conversation chains
- **✅ Production-Ready Validation** - Schema validation, relationship checking, and completeness analysis
- **✅ CLI with Multiple Output Formats** - JSON, text, detailed, table, CSV, and markdown export formats
- **✅ 66 Passing Tests** - Complete test coverage including performance benchmarks

## 📦 Installation

### Global Installation
```bash
# Clone the repository
git clone <repository-url>
cd ClaudeCodeDeepResearcher

# Install dependencies
bun install

# Build the project
bun run build

# Install globally
npm install -g .
```

### Usage
After installation, you can use the conversation analyzer from any directory:

```bash
# Show help
conversation-analyzer --help

# Analyze a specific conversation
conversation-analyzer analyze -c ee7c0da8-c656-49e9-acda-38cab8674ae8

# List all conversations
conversation-analyzer list

# Extract action sequence
conversation-analyzer steps -c SESSION_ID

# Export conversation data
conversation-analyzer export -c SESSION_ID -f markdown

# Validate JSONL file
conversation-analyzer validate -f conversation.jsonl
```

## 🏗️ Project Architecture

The JSONL parser system is built with a modular architecture:

```
src/
├── types/
│   └── claude-conversation.ts    # Complete TypeScript type definitions
├── services/
│   ├── jsonl-parser.ts          # Streaming JSONL parser with validation
│   ├── conversation-builder.ts   # Tree building and action sequence extraction
│   └── step-analyzer.ts         # Comprehensive conversation analysis
├── validators/
│   ├── index.ts                 # Main validation coordinator
│   ├── schema-validator.ts      # Entry structure validation
│   ├── relationship-validator.ts # UUID relationship validation
│   ├── tool-use-validator.ts    # Tool usage pattern validation
│   └── completeness-checker.ts  # Conversation completeness validation
├── cli/
│   └── conversation-analyzer.ts  # CLI interface with 5 commands
└── tests/
    ├── jsonl-parser.test.ts     # Parser tests (13/13 passing)
    ├── conversation-builder.test.ts # Builder tests (15/15 passing) 
    ├── validators.test.ts       # Validation tests (24/24 passing)
    └── performance.test.ts      # Performance benchmarks (14/14 passing)
```

## 💻 CLI Usage

The conversation analyzer provides a comprehensive CLI interface with 5 main commands:

### Core Commands

#### `analyze` - Analyze specific conversations
```bash
# Analyze by session ID (searches in ~/.claude/projects)
conversation-analyzer analyze -c ee7c0da8-c656-49e9-acda-38cab8674ae8

# Analyze by full file path
conversation-analyzer analyze -c /path/to/conversation.jsonl

# Different output formats
conversation-analyzer analyze -c SESSION_ID -f json
conversation-analyzer analyze -c SESSION_ID -f detailed
conversation-analyzer analyze -c SESSION_ID -f text

# Specify custom project directory
conversation-analyzer analyze -c SESSION_ID -p /custom/projects/path
```

**Example Output (text format):**
```
📊 Conversation Analysis: ee7c0da8-c656-49e9-acda-38cab8674ae8
═══════════════════════════════════════════════

📈 Summary:
   Entries: 25
   Tools Used: Read, Write, Edit, Bash, TodoWrite
   Successful Operations: 12
   Failed Operations: 1
   Error Rate: 7.7%

💰 Costs:
   Total: $0.0045
   Input Tokens: 1,250
   Output Tokens: 625
   Cached Tokens: 200

⚡ Performance:
   Avg Response Time: 450ms
   Longest Operation: 1,200ms

🔧 Tool Usage:
   Read: 5 times
   Edit: 3 times
   Write: 2 times
   Bash: 2 times
   TodoWrite: 1 times
```

#### `list` - List conversations
```bash
# List recent conversations (last 30 days)
conversation-analyzer list

# List conversations from last 7 days
conversation-analyzer list --recent 7

# Different output formats
conversation-analyzer list -f table
conversation-analyzer list -f json
conversation-analyzer list -f simple

# Custom project directory
conversation-analyzer list -p /custom/projects/path
```

#### `steps` - Extract action sequence
```bash
# List all steps
conversation-analyzer steps -c SESSION_ID

# Show only tool usage steps
conversation-analyzer steps -c SESSION_ID --tools-only

# Timeline view
conversation-analyzer steps -c SESSION_ID -f timeline

# JSON output
conversation-analyzer steps -c SESSION_ID -f json
```

#### `export` - Export conversation data
```bash
# Export as JSON
conversation-analyzer export -c SESSION_ID -f json

# Export as Markdown report
conversation-analyzer export -c SESSION_ID -f markdown

# Export as CSV (for data analysis)
conversation-analyzer export -c SESSION_ID -f csv

# Save to file
conversation-analyzer export -c SESSION_ID -f markdown -o report.md
```

#### `validate` - Validate JSONL structure
```bash
# Validate a specific file
conversation-analyzer validate -f /path/to/conversation.jsonl

# Strict validation mode
conversation-analyzer validate -f /path/to/conversation.jsonl --strict
```

### Bun Scripts

```bash
# Development commands
bun run analyze                    # Run conversation analyzer CLI
bun run conversation:analyze       # Analyze command
bun run conversation:list          # List command
bun run conversation:steps         # Steps command
bun run conversation:export        # Export command
bun run conversation:validate      # Validate command

# Build and test
bun run build                      # Build all components
bun run test                       # Run all 66 tests
bun run typecheck                  # TypeScript validation
```

## 🔧 Programmatic Usage

```typescript
import { JSONLParser } from './src/services/jsonl-parser';
import { ConversationBuilder } from './src/services/conversation-builder';
import { StepAnalyzer } from './src/services/step-analyzer';
import { ConversationValidator } from './src/validators/index';

// Parse conversation file
const parser = new JSONLParser();
const entries = await parser.parseFileToArray('./conversation.jsonl');

// Build conversation analysis
const builder = new ConversationBuilder();
const tree = builder.buildConversationTree(entries);
const steps = builder.extractActionSequence(entries);
const flowSummary = builder.getFlowSummary(entries);

// Comprehensive analysis
const analyzer = new StepAnalyzer();
const analysis = await analyzer.analyzeConversation(entries);
console.log(`Total cost: $${analysis.costs.totalCost}`);
console.log(`Tools used: ${analysis.summary.toolsUsed.join(', ')}`);

// Validate conversation
const validator = new ConversationValidator();
const report = await validator.validateConversation(entries);
console.log(`Validation: ${report.overall.isValid ? 'PASSED' : 'FAILED'}`);

// Streaming processing for large files
const parser = new JSONLParser();
for await (const entry of parser.parseFile('./large-conversation.jsonl')) {
  // Process each entry as it's read
  console.log(`Processing entry: ${entry.type}`);
}
```

## 📊 Type System

The parser includes comprehensive TypeScript types based on real JSONL data analysis:

```typescript
// Base conversation entry
interface BaseConversationEntry {
  uuid: string;
  timestamp: string;
  parentUuid: string | null;
  logicalParentUuid?: string;
  isSidechain: boolean;
  userType: "external";
  cwd: string;
  sessionId: string;
  version: string;
  gitBranch: string;
}

// Discriminated union for all entry types
type ConversationEntry = 
  | UserMessageEntry
  | AssistantMessageEntry  
  | SystemMessageEntry
  | SummaryEntry
  | ResultEntry;

// Tool-specific types
interface ToolUseContent {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, any>;
}

// Comprehensive message types covering all SDK patterns
interface SDKMessage {
  id: string;
  type: 'message';
  role: 'assistant';
  model: string;
  content: MessageContent[];
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: TokenUsage;
}
```

## ⚡ Performance

The parser is optimized for high performance with comprehensive benchmarks:

### Performance Metrics
- **Parse Rate**: 600,000+ entries/second
- **Memory Usage**: <10KB per entry with streaming
- **Large File Support**: Handles 10,000+ entry files in <5 seconds
- **Concurrent Processing**: Multiple file parsing with minimal memory impact

### Test Results (All 66 Tests Passing)
```
tests/jsonl-parser.test.ts:      13 pass  (Parser functionality)
tests/conversation-builder.test.ts: 15 pass  (Tree building and sequences)
tests/validators.test.ts:        24 pass  (4-layer validation system)
tests/performance.test.ts:       14 pass  (Performance benchmarks)

Total: 66 pass, 0 fail
```

### Benchmark Output
```
📊 Performance test files generated:
   Small: 57.6KB
   Medium: 580.3KB  
   Large: 5.7MB

✅ Small file (100 entries): 2.4ms
✅ Medium file (1,000 entries): 2.5ms
✅ Large file (10,000 entries): 18.3ms
✅ Memory usage: 0.0MB for 5,000 entries
🎯 Parse rate: 610,175 entries/sec (target: 2,000)
```

## 🔍 Analysis Capabilities

### Conversation Analysis
- **Cost Tracking**: Token usage and USD cost calculation
- **Performance Metrics**: Response times, operation duration, success rates
- **Tool Usage Analysis**: Frequency, patterns, success/failure rates
- **Flow Analysis**: Conversation phases, decision points, tool switches
- **Todo Evolution**: Task management progression throughout conversation

### Validation System
- **Schema Validation**: Field requirements, type checking, format validation
- **Relationship Validation**: UUID chains, parent-child relationships, temporal order
- **Tool Use Validation**: Tool call patterns, missing results, error detection
- **Completeness Checking**: Conversation termination, quality metrics, pattern analysis

### Export Formats
- **JSON**: Complete structured data for programmatic processing
- **Markdown**: Professional reports with formatted analysis
- **CSV**: Tabular data for spreadsheet analysis  
- **Text**: Human-readable console output
- **Table**: Formatted tables for terminal display

## 🧪 Testing

### Comprehensive Test Suite

```bash
# Run all tests
bun test

# Run specific test suites
bun test tests/jsonl-parser.test.ts
bun test tests/conversation-builder.test.ts
bun test tests/validators.test.ts
bun test tests/performance.test.ts
```

### Test Coverage
- **JSONLParser**: 13 tests covering parsing, validation, metadata extraction, error handling
- **ConversationBuilder**: 15 tests covering tree building, circular references, action sequences
- **Validators**: 24 tests covering schema, relationships, tool usage, completeness
- **Performance**: 14 tests covering parsing speed, memory usage, scalability, regression

## 🔧 Configuration

### Environment Variables
```bash
# Default project directory (overrides ~/.claude/projects)
export CLAUDE_PROJECTS_DIR="/custom/path/to/projects"

# Default output format
export CLAUDE_ANALYZER_FORMAT="detailed"

# Enable debug output
export CLAUDE_ANALYZER_DEBUG="true"
```

### Configuration File
Create `~/.claude-analyzer.json`:
```json
{
  "projectDir": "/custom/path/to/projects",
  "defaultFormat": "detailed",
  "maxFileSize": "100MB",
  "cacheResults": true,
  "outputDir": "./analysis-reports"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **File not found error:**
   ```bash
   # Verify the session ID exists
   conversation-analyzer list | grep SESSION_ID
   
   # Check project directory
   ls ~/.claude/projects/*/SESSION_ID.jsonl
   ```

2. **Permission denied:**
   ```bash
   # Fix file permissions
   chmod +r ~/.claude/projects/*/*.jsonl
   ```

3. **Memory errors with large files:**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=8192"
   ```

4. **Invalid JSONL format:**
   ```bash
   # Validate the file structure
   conversation-analyzer validate -f problematic-file.jsonl --strict
   ```

### Debug Mode
```bash
# Set debug environment variable
export DEBUG="conversation-analyzer:*"

# Run with verbose output
conversation-analyzer analyze -c SESSION_ID --verbose
```

## 📝 Development

### Setup
```bash
# Install dependencies
bun install

# Build the project
bun run build

# Run TypeScript check
bun run typecheck

# Development mode with hot reload
bun run dev

# Run all tests
bun test
```

### Contributing
- Follow TypeScript strict mode requirements
- Add tests for all new functionality
- Update documentation for API changes
- Ensure all 66 tests pass before submitting

## 🚀 Integration Examples

### GitHub Actions
```yaml
name: Analyze Conversations
on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Monday

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: |
          # Analyze recent conversations
          conversation-analyzer list --recent 7 -f json > recent-conversations.json
          
          # Generate reports
          for session_id in $(jq -r '.[].sessionId' recent-conversations.json); do
            conversation-analyzer export -c "$session_id" -f markdown -o "reports/$session_id.md"
          done
```

### Shell Aliases
Add to your `.bashrc` or `.zshrc`:
```bash
# Convenient aliases
alias claude-analyze="conversation-analyzer analyze"
alias claude-list="conversation-analyzer list"
alias claude-steps="conversation-analyzer steps"
alias claude-export="conversation-analyzer export"
alias claude-validate="conversation-analyzer validate"

# Quick analysis of latest conversation
alias claude-latest="claude-list -f simple --recent 1 | head -1 | xargs claude-analyze -c"
```

## 📄 Real-World Usage

### Batch Analysis
```bash
#!/bin/bash
# analyze-all-recent.sh

# Get list of recent conversations
CONVERSATIONS=$(conversation-analyzer list -f simple --recent 7)

# Analyze each conversation
for session_id in $CONVERSATIONS; do
    echo "Analyzing $session_id..."
    conversation-analyzer analyze -c "$session_id" -f text > "analysis-$session_id.txt"
done
```

### Performance Monitoring
```bash
# Export all recent conversations as CSV
for session_id in $(conversation-analyzer list -f simple --recent 30); do
    conversation-analyzer export -c "$session_id" -f csv >> performance-data.csv
done

# Analyze performance trends
python analyze_performance.py performance-data.csv
```

### Error Analysis
```bash
# List conversations and filter for those with errors
conversation-analyzer list -f json | \
  jq '.[] | select(.completedSuccessfully == false) | .sessionId' | \
  while read session_id; do
    echo "Analyzing failed conversation: $session_id"
    conversation-analyzer analyze -c "$session_id" -f detailed
  done
```

## 📜 License

MIT License - This project provides comprehensive JSONL parsing and analysis capabilities for Claude Code conversation files with production-ready performance and validation.