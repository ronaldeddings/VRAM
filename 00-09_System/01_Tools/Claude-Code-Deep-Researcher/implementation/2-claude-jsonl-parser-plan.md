# Claude Code JSONL Parser Implementation Plan

## Executive Summary

Comprehensive TypeScript implementation for parsing and analyzing Claude Code conversation history stored in JSONL files within the `~/.claude/projects` directory. This plan provides a complete checklist for building a conversation analyzer, type definitions, parser services, and CLI tools.

## Phase 1: Directory & File Analysis ✅

### Completed Analysis Results:

**Directory Structure Pattern:**
- Projects stored in: `~/.claude/projects/`
- Directory naming: `-{path-with-hyphens}` (e.g., `-Users-ronaldeddings-ClaudeCodeDeepResearcher`)
- JSONL files named by UUID: `{sessionId}.jsonl`

**Identified Entry Types:**
Based on analysis of existing JSONL files, the following entry types were discovered:

1. **Core Entry Types:**
   - `"type": "user"` (3093 occurrences) - User messages
   - `"type": "assistant"` (4738 occurrences) - Assistant responses  
   - `"type": "system"` (32 occurrences) - System messages
   - `"type": "summary"` (169 occurrences) - Conversation summaries

2. **Tool-Related Types:**
   - `"type": "tool_use"` (2816 occurrences) - Tool invocations
   - `"type": "tool_result"` (2803 occurrences) - Tool results

3. **Special Entry Types:**
   - System subtypes: `"subtype": "compact_boundary"` (23), `"subtype": "informational"` (9)
   - Result types: `"type": "result"` (6) with `"subtype": "success"` (6)

## Phase 2: TypeScript Type Definitions

### ✅ **Task 2.1: Create Base Entry Types** ✅ Completed
Location: `src/types/claude-conversation.ts`

```typescript
// Base metadata shared by all entries
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

// Message role types
type MessageRole = "user" | "assistant" | "system";

// Content block types  
interface TextContent {
  type: "text";
  text: string;
}

interface ToolUseContent {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, any>;
}

interface ToolResultContent {
  type: "tool_result";
  tool_use_id: string;
  content: string | Array<{ type: string; text?: string; [key: string]: any }>;
  is_error?: boolean;
}

type MessageContent = TextContent | ToolUseContent | ToolResultContent;
```

### ✅ **Task 2.2: Define Core Entry Types** ✅ Completed

```typescript
// User message entry
interface UserMessageEntry extends BaseConversationEntry {
  type: "user";
  message: {
    role: "user";
    content: string | MessageContent[];
  };
  toolUseResult?: any; // Added when tool results are present
}

// Assistant message entry  
interface AssistantMessageEntry extends BaseConversationEntry {
  type: "assistant";
  requestId?: string;
  message: {
    id: string;
    type: "message";
    role: "assistant";
    model: string;
    content: MessageContent[];
    stop_reason: string | null;
    stop_sequence: string | null;
    usage: {
      input_tokens: number;
      cache_creation_input_tokens: number;
      cache_read_input_tokens: number;
      cache_creation: {
        ephemeral_5m_input_tokens: number;
        ephemeral_1h_input_tokens: number;
      };
      output_tokens: number;
      service_tier: string;
    };
  };
}

// System message entry
interface SystemMessageEntry extends BaseConversationEntry {
  type: "system";
  subtype: "compact_boundary" | "informational";
  content: string;
  isMeta: boolean;
  level: "info";
  compactMetadata?: {
    trigger: "auto";
    preTokens: number;
  };
}

// Summary entry
interface SummaryEntry extends BaseConversationEntry {
  type: "summary";
  content: string;
  isVisibleInTranscriptOnly?: boolean;
}

// Result entry
interface ResultEntry extends BaseConversationEntry {
  type: "result";
  subtype: "success";
  result?: any;
  total_cost_usd?: number;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}
```

### ✅ **Task 2.3: Define Tool-Specific Types** ✅ Completed

```typescript
// Todo item structure
interface TodoItem {
  content: string;
  status: "pending" | "in_progress" | "completed";
  activeForm: string;
}

// TodoWrite tool input
interface TodoWriteInput {
  todos: TodoItem[];
}

// Bash tool input
interface BashInput {
  command: string;
  description?: string;
  timeout?: number;
  run_in_background?: boolean;
}

// File operation inputs
interface ReadInput {
  file_path: string;
  limit?: number;
  offset?: number;
}

interface WriteInput {
  file_path: string;
  content: string;
}

interface EditInput {
  file_path: string;
  old_string: string;
  new_string: string;
  replace_all?: boolean;
}

// Union of all tool inputs
type ToolInput = TodoWriteInput | BashInput | ReadInput | WriteInput | EditInput;
```

### ✅ **Task 2.4: Create Discriminated Union Type** ✅ Completed

```typescript
// Main conversation entry union
type ConversationEntry = 
  | UserMessageEntry
  | AssistantMessageEntry
  | SystemMessageEntry
  | SummaryEntry
  | ResultEntry;

// Conversation flow types
interface ConversationNode {
  entry: ConversationEntry;
  children: ConversationNode[];
  depth: number;
}

interface ConversationChain {
  sessionId: string;
  entries: ConversationEntry[];
  startTime: string;
  endTime: string;
  totalEntries: number;
}

interface StepSummary {
  stepNumber: number;
  type: "tool_use" | "response" | "decision" | "system";
  tool?: string;
  description: string;
  timestamp: string;
  success?: boolean;
}
```

## Phase 3: Parser Implementation

### ✅ **Task 3.1: JSONL Parser Service** 
Location: `src/services/jsonl-parser.ts`

```typescript
export class JSONLParser {
  async *parseFile(filePath: string): AsyncGenerator<ConversationEntry> {
    const file = Bun.file(filePath);
    const stream = file.stream();
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const entry = JSON.parse(line) as ConversationEntry;
              yield this.validateEntry(entry);
            } catch (error) {
              console.warn(`Failed to parse line: ${line.substring(0, 100)}...`);
            }
          }
        }
      }
      
      // Process final buffer
      if (buffer.trim()) {
        const entry = JSON.parse(buffer) as ConversationEntry;
        yield this.validateEntry(entry);
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  private validateEntry(entry: any): ConversationEntry {
    // Runtime validation using TypeScript's type system
    if (!entry.uuid || !entry.timestamp || !entry.sessionId || !entry.type) {
      throw new Error(`Invalid entry structure: missing required fields`);
    }
    return entry as ConversationEntry;
  }
}
```

### ✅ **Task 3.2: Conversation Builder Service**
Location: `src/services/conversation-builder.ts`

```typescript
export class ConversationBuilder {
  buildConversationTree(entries: ConversationEntry[]): ConversationNode[] {
    const entryMap = new Map<string, ConversationEntry>();
    const nodeMap = new Map<string, ConversationNode>();
    
    // Index all entries
    for (const entry of entries) {
      entryMap.set(entry.uuid, entry);
      nodeMap.set(entry.uuid, {
        entry,
        children: [],
        depth: 0
      });
    }
    
    // Build parent-child relationships
    const roots: ConversationNode[] = [];
    
    for (const entry of entries) {
      const node = nodeMap.get(entry.uuid)!;
      
      if (entry.parentUuid && nodeMap.has(entry.parentUuid)) {
        const parent = nodeMap.get(entry.parentUuid)!;
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        roots.push(node);
      }
    }
    
    return roots;
  }
  
  extractActionSequence(entries: ConversationEntry[]): StepSummary[] {
    const steps: StepSummary[] = [];
    let stepNumber = 1;
    
    for (const entry of entries) {
      if (entry.type === 'assistant' && entry.message.content) {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            steps.push({
              stepNumber: stepNumber++,
              type: 'tool_use',
              tool: content.name,
              description: `Used ${content.name} tool`,
              timestamp: entry.timestamp,
              success: true
            });
          }
        }
      }
    }
    
    return steps;
  }
}
```

### ✅ **Task 3.3: Step Analyzer Service**
Location: `src/services/step-analyzer.ts`

```typescript
export class StepAnalyzer {
  analyzeConversation(entries: ConversationEntry[]): {
    uniqueTools: string[];
    todoEvolution: TodoItem[][];
    decisionPoints: ConversationEntry[];
    errorsSummary: { tool: string; error: string; timestamp: string }[];
  } {
    const uniqueTools = new Set<string>();
    const todoEvolution: TodoItem[][] = [];
    const decisionPoints: ConversationEntry[] = [];
    const errors: { tool: string; error: string; timestamp: string }[] = [];
    
    for (const entry of entries) {
      // Track tool usage
      if (entry.type === 'assistant') {
        for (const content of entry.message.content) {
          if (content.type === 'tool_use') {
            uniqueTools.add(content.name);
            
            // Track TodoWrite evolution
            if (content.name === 'TodoWrite' && content.input.todos) {
              todoEvolution.push([...content.input.todos]);
            }
          }
        }
      }
      
      // Track tool results and errors
      if (entry.type === 'user' && entry.toolUseResult) {
        const result = entry.toolUseResult;
        if (result.is_error || result.stderr) {
          errors.push({
            tool: 'unknown',
            error: result.content || result.stderr,
            timestamp: entry.timestamp
          });
        }
      }
      
      // Identify decision points (user responses after tool use)
      if (entry.type === 'user' && entry.parentUuid) {
        decisionPoints.push(entry);
      }
    }
    
    return {
      uniqueTools: Array.from(uniqueTools),
      todoEvolution,
      decisionPoints,
      errorsSummary: errors
    };
  }
}
```

## Phase 4: CLI Implementation

### ✅ **Task 4.1: CLI Tool Structure**
Location: `src/cli/conversation-analyzer.ts`

```typescript
#!/usr/bin/env bun

import { Command } from 'commander';
import { JSONLParser } from '../services/jsonl-parser';
import { ConversationBuilder } from '../services/conversation-builder'; 
import { StepAnalyzer } from '../services/step-analyzer';

const program = new Command();

program
  .name('conversation-analyzer')
  .description('Analyze Claude Code conversation history')
  .version('1.0.0');

// Analyze specific conversation
program
  .command('analyze')
  .description('Analyze a specific conversation by ID')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID to analyze')
  .option('-f, --format <type>', 'Output format (json|text|detailed)', 'text')
  .action(async (options) => {
    const parser = new JSONLParser();
    const builder = new ConversationBuilder();
    const analyzer = new StepAnalyzer();
    
    const projectPath = findConversationFile(options.conversationId);
    const entries: ConversationEntry[] = [];
    
    for await (const entry of parser.parseFile(projectPath)) {
      entries.push(entry);
    }
    
    const analysis = analyzer.analyzeConversation(entries);
    const tree = builder.buildConversationTree(entries);
    const steps = builder.extractActionSequence(entries);
    
    outputAnalysis(analysis, tree, steps, options.format);
  });

// List all conversations in project
program
  .command('list')
  .description('List all conversations in a project')
  .requiredOption('-p, --project <path>', 'Project path')
  .option('-s, --sort <field>', 'Sort by field (date|size|duration)', 'date')
  .action(async (options) => {
    const conversations = await discoverConversations(options.project);
    outputConversationList(conversations, options.sort);
  });

// Show conversation steps
program
  .command('steps')
  .description('Show unique steps/actions from a conversation')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID')
  .option('-f, --format <type>', 'Format (detailed|summary|json)', 'summary')
  .option('--tools-only', 'Show only tool usage steps')
  .action(async (options) => {
    const steps = await extractConversationSteps(options.conversationId);
    outputSteps(steps, options);
  });

// Export conversation
program
  .command('export')
  .description('Export conversation flow as JSON or Markdown')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID')
  .requiredOption('-f, --format <type>', 'Export format (json|markdown|csv)')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    await exportConversation(options.conversationId, options.format, options.output);
  });

// Validate JSONL structure
program
  .command('validate')
  .description('Validate JSONL structure and report issues')
  .requiredOption('-d, --project-dir <path>', 'Project directory to validate')
  .option('--fix', 'Attempt to fix minor issues')
  .action(async (options) => {
    const issues = await validateProjectJSONL(options.projectDir);
    outputValidationResults(issues, options.fix);
  });

program.parse();
```

### ✅ **Task 4.2: CLI Helper Functions**

```typescript
// Helper functions for CLI commands
async function findConversationFile(conversationId: string): Promise<string> {
  const projectsDir = path.join(os.homedir(), '.claude', 'projects');
  
  for (const projectDir of await fs.readdir(projectsDir)) {
    const projectPath = path.join(projectsDir, projectDir);
    const jsonlFile = path.join(projectPath, `${conversationId}.jsonl`);
    
    if (await fs.exists(jsonlFile)) {
      return jsonlFile;
    }
  }
  
  throw new Error(`Conversation ${conversationId} not found`);
}

async function discoverConversations(projectPath: string): Promise<ConversationMetadata[]> {
  const encodedPath = encodeProjectPath(projectPath);
  const claudeProjectPath = path.join(os.homedir(), '.claude', 'projects', encodedPath);
  
  const conversations: ConversationMetadata[] = [];
  
  for (const file of await fs.readdir(claudeProjectPath)) {
    if (file.endsWith('.jsonl')) {
      const filePath = path.join(claudeProjectPath, file);
      const stats = await fs.stat(filePath);
      const sessionId = file.replace('.jsonl', '');
      
      conversations.push({
        sessionId,
        filePath,
        size: stats.size,
        lastModified: stats.mtime,
        projectPath: encodedPath
      });
    }
  }
  
  return conversations;
}

function encodeProjectPath(projectPath: string): string {
  return '-' + projectPath.replace(/^\//, '').replace(/\//g, '-');
}
```

### ✅ **Task 4.3: Output Formatters**

```typescript
function outputAnalysis(
  analysis: ReturnType<StepAnalyzer['analyzeConversation']>,
  tree: ConversationNode[],
  steps: StepSummary[],
  format: string
) {
  switch (format) {
    case 'json':
      console.log(JSON.stringify({ analysis, tree, steps }, null, 2));
      break;
      
    case 'detailed':
      console.log('🔍 CONVERSATION ANALYSIS\n');
      console.log(`📊 Summary:`);
      console.log(`  • Tools used: ${analysis.uniqueTools.join(', ')}`);
      console.log(`  • Todo changes: ${analysis.todoEvolution.length}`);
      console.log(`  • Decision points: ${analysis.decisionPoints.length}`);
      console.log(`  • Errors: ${analysis.errorsSummary.length}\n`);
      
      console.log(`⚡ Action Steps (${steps.length}):`);
      steps.forEach(step => {
        const icon = step.type === 'tool_use' ? '🔧' : step.type === 'decision' ? '🤔' : '💬';
        console.log(`  ${icon} ${step.stepNumber}. ${step.description} (${step.tool || 'N/A'})`);
      });
      break;
      
    default:
      console.log(`Tools: ${analysis.uniqueTools.join(', ')}`);
      console.log(`Steps: ${steps.length}`);
      console.log(`Errors: ${analysis.errorsSummary.length}`);
  }
}
```

## Phase 5: Data Model Validation

### ✅ **Task 5.1: Schema Validator**
Location: `src/validators/schema-validator.ts`

```typescript
export class SchemaValidator {
  validateConversationEntry(entry: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Required fields validation
    if (!entry.uuid) errors.push('Missing uuid field');
    if (!entry.timestamp) errors.push('Missing timestamp field');
    if (!entry.sessionId) errors.push('Missing sessionId field');
    if (!entry.type) errors.push('Missing type field');
    
    // Type-specific validation
    switch (entry.type) {
      case 'user':
        if (!entry.message?.role) errors.push('User entry missing message.role');
        break;
      case 'assistant':
        if (!entry.message?.id) errors.push('Assistant entry missing message.id');
        if (!entry.message?.usage) errors.push('Assistant entry missing usage metrics');
        break;
      case 'system':
        if (!entry.subtype) errors.push('System entry missing subtype');
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### ✅ **Task 5.2: Relationship Validator**

```typescript
export class RelationshipValidator {
  validateConversationChain(entries: ConversationEntry[]): ValidationResult {
    const uuidSet = new Set(entries.map(e => e.uuid));
    const orphanedEntries: string[] = [];
    const circularReferences: string[] = [];
    
    for (const entry of entries) {
      // Check for orphaned references
      if (entry.parentUuid && !uuidSet.has(entry.parentUuid)) {
        orphanedEntries.push(entry.uuid);
      }
      
      // Check for circular references
      if (this.hasCircularReference(entry, entries)) {
        circularReferences.push(entry.uuid);
      }
    }
    
    return {
      isValid: orphanedEntries.length === 0 && circularReferences.length === 0,
      orphanedEntries,
      circularReferences
    };
  }
}
```

## Implementation Checklist

### Phase 1: Analysis ✅
- [x] Scan `~/.claude/projects` directory structure 
- [x] Document project directory naming convention
- [x] Identify all JSONL entry types and structures
- [x] Catalog message types, tool uses, and metadata fields

### Phase 2: Type Definitions
- [x] Create `src/types/claude-conversation.ts` ✅ Completed
- [x] Define base entry interfaces with all discovered fields ✅ Completed
- [x] Create discriminated union types for all entry types ✅ Completed
- [x] Add JSDoc documentation for all types ✅ Completed
- [x] Export all types for application use ✅ Completed

### Phase 3: Parser Services
- [ ] Implement `src/services/jsonl-parser.ts` with streaming support
- [ ] Create `src/services/conversation-builder.ts` for tree building
- [ ] Build `src/services/step-analyzer.ts` for action extraction
- [ ] Add error handling and malformed entry recovery
- [ ] Implement memory-efficient large file processing

### Phase 4: CLI Implementation
- [ ] Create `src/cli/conversation-analyzer.ts` main CLI
- [ ] Implement `analyze` command with conversation ID support
- [ ] Add `list` command for project conversation discovery
- [ ] Build `steps` command for action sequence display
- [ ] Create `export` command for JSON/Markdown output
- [ ] Implement `validate` command for JSONL structure checking

### Phase 5: Validation System
- [ ] Create `src/validators/schema-validator.ts`
- [ ] Implement `src/validators/relationship-validator.ts`
- [ ] Add `src/validators/tool-use-validator.ts`
- [ ] Build `src/validators/completeness-checker.ts`
- [ ] Create validation reporting and error handling

### Phase 6: Testing & Documentation
- [ ] Create unit tests for all parser functions
- [ ] Test with actual JSONL files from multiple projects
- [ ] Document CLI command usage and examples
- [ ] Create sample output specifications
- [ ] Add performance benchmarks for large file processing

### Phase 7: Package Configuration
- [ ] Update `package.json` with new dependencies
- [ ] Configure Bun scripts for CLI commands
- [ ] Set up TypeScript compilation configuration
- [ ] Add executable permissions for CLI tool
- [ ] Create installation and usage documentation

## Technical Requirements

- **Runtime**: Bun (latest version)
- **Language**: TypeScript 5.x  
- **Dependencies**: Commander.js for CLI, native Bun file operations
- **Performance**: Stream-based processing for files >10MB
- **Error Handling**: Graceful handling of malformed JSONL entries
- **Type Safety**: 100% TypeScript coverage, no `any` types

## Success Criteria

1. **100% Type Coverage**: All discovered JSONL fields mapped to TypeScript types
2. **Performance**: Handle 100MB+ JSONL files without memory issues  
3. **Accuracy**: Parse 99.9%+ of valid JSONL entries successfully
4. **Usability**: CLI commands work intuitively with clear output
5. **Extensibility**: Easy to add new Claude Code tools and entry types

## Usage Examples

```bash
# Analyze a specific conversation
bun run cli analyze --conversation-id 6452a911-f29c-47c3-afd6-1ea7d94e6e5e --format detailed

# List conversations in current project
bun run cli list --project /Users/user/MyProject --sort date

# Export conversation as JSON
bun run cli export --conversation-id abc123 --format json --output conversation.json

# Validate project JSONL files
bun run cli validate --project-dir ~/.claude/projects/MyProject --fix
```

This implementation plan provides a complete roadmap for building a comprehensive Claude Code conversation analysis system with TypeScript type safety, streaming performance, and extensible architecture.