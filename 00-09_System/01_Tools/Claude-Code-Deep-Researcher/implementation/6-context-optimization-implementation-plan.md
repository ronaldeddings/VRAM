# Context Optimization Implementation Plan

## Executive Summary

This plan addresses intelligent context reduction for Claude Code conversation logs to enable efficient session resumption without losing critical information. Analysis of 100+ JSONL log files reveals that conversations can grow to 1,200+ entries (7MB+), with significant context bloat from large file reads, duplicate tool results, and verbose intermediate steps.

### Key Innovations

#### 1. **Copy-Based Approach**
Instead of deleting/modifying lines in place (previous approach), we **copy essential entries** from source JSONL to a new optimized JSONL file. This preserves the original conversation while creating a pristine, optimized context for resumption.

#### 2. **Multi-Conversation Analysis** ⭐ NEW
**Best work happens across multiple conversations**. The optimizer can analyze multiple JSONL files simultaneously to:
- **Find best examples** of similar actions across sessions
- **Deduplicate cross-conversation** (same file read in 3 different sessions → keep best one)
- **Identify patterns** (if always opening certain files → keep most informative instance)
- **Build consolidated context** from multiple related conversations

### Problem Statement

- **Context Window Limits**: Claude has finite context windows, large logs exceed limits
- **Token Costs**: Unnecessary context increases API costs and latency
- **Previous Issues**: Past attempts removed too much context, breaking conversation coherence
- **File Bloat**: Tool results with 15KB-32KB+ content (README files, docs, large file reads)
- **Multi-Session Work**: Best insights scattered across multiple conversation files
- **Redundancy Across Sessions**: Same files/actions repeated in different conversations

### Solution Goals

1. **Intelligent Pruning**: Rank message importance using multi-factor scoring
2. **Context Preservation**: Maintain conversation flow and decision history
3. **Tool Result Summarization**: Replace large file content with metadata + summaries
4. **Deduplication**: Remove redundant tool results (within AND across conversations)
5. **Multi-Conversation Synthesis**: Merge best content from multiple related sessions
6. **Smart Content Selection**: Extract only relevant portions of large files
7. **Configurable**: Allow users to control optimization aggressiveness

---

## Analysis Findings

### Conversation Log Statistics (Sample: 1c18d146-6ccb-44cb-a940-8a9b31b565da.jsonl)

- **Total Entries**: 1,249 JSONL lines
- **File Size**: 7.0 MB
- **Message Distribution**:
  - Assistant: 843 (67.5%)
  - User: 369 (29.5%)
  - File Snapshots: 28 (2.2%)
  - System: 7 (0.6%)
  - Queue Operations: 2 (0.2%)

### Context Bloat Sources

#### 1. **Large File Reads** (Primary Issue)
- **Size**: 15KB-32KB+ per tool result
- **Examples**: README.md, documentation files, large source files
- **Impact**: Single Read tool call can consume 15,000+ characters
- **Frequency**: Multiple large reads throughout conversation

**Sample Large Tool Result:**
```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": [{
      "type": "tool_result",
      "tool_use_id": "toolu_01UfnjFVLKtKCWQhWrimVTP2",
      "content": "# Gemini Agent SDK\n\n[15,693 characters of README content...]"
    }]
  }
}
```

#### 2. **Duplicate Tool Results** (Single & Multi-Conversation)
- **Pattern**: Multiple Read calls for the same file
- **Within Session**: Assistant re-reading files to verify changes (2-5x redundancy)
- **Across Sessions**: Same file read in multiple conversations (3-10x redundancy)
- **Example**: `src/mastra/index.ts` read 4 times in session A, 3 times in session B, 2 times in session C
- **Impact**: Same content consuming context multiple times
- **Solution**: Keep best/most informative instance, reference others

#### 3. **Verbose Assistant Messages**
- **Pattern**: Long thinking blocks, extensive explanations
- **When**: Complex problem-solving, detailed explanations
- **Impact**: 500-2000 tokens per verbose message
- **Note**: Some verbosity is essential for understanding reasoning

#### 4. **Dead-End Exploration**
- **Pattern**: Assistant tries approach A → fails → tries approach B → succeeds
- **Impact**: Entire approach A conversation tree is now irrelevant
- **Challenge**: Hard to identify dead-ends without understanding conversation semantics

#### 5. **File History Snapshots**
- **Pattern**: File backup metadata tracked throughout session
- **Essential**: For undo/rollback functionality
- **Optimizable**: Old snapshots from completed tasks can be summarized

#### 6. **Queue Operations & System Messages**
- **Pattern**: Task queueing, session init, status updates
- **Essential**: Session start/end, error states
- **Optimizable**: Intermediate status updates

### Essential Context (Must Preserve)

#### 1. **Conversation Flow**
- **UUIDs**: Track parent-child relationships via `parentUuid`
- **Thread Continuity**: Maintain logical conversation branches
- **Critical**: Breaking UUID chains breaks conversation coherence

#### 2. **User Instructions & Goals**
- **What**: All user messages expressing intent
- **Why**: Context for understanding what Claude is trying to accomplish
- **Examples**: "Build a feature X", "Fix bug Y", "Explain Z"

#### 3. **Key Assistant Decisions**
- **What**: Major architectural choices, implementation approaches
- **Why**: Understanding the "why" behind code changes
- **Examples**: "I'll use pattern X because Y", "Switching to approach B due to limitation A"

#### 4. **File Modifications**
- **What**: Which files were changed and why
- **Why**: Track evolution of codebase through session
- **Include**: Write/Edit tool uses with brief summaries
- **Exclude**: Full file contents from Read results

#### 5. **Error States & Failures**
- **What**: Failed operations, error messages, debugging context
- **Why**: Understanding what was tried and didn't work
- **Critical**: Prevents repeating failed approaches

#### 6. **Current Task State**
- **What**: Active todos, in-progress work, pending actions
- **Why**: Resume session knowing what's incomplete
- **Include**: TodoWrite entries, task lists, action items

#### 7. **Session Continuity Window**
- **What**: Last N messages (N=20-50) before optimization point
- **Why**: Immediate context for coherent resumption
- **Critical**: Always preserve recent conversation

---

## Architecture Design

### Core Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    Context Optimizer                             │
│                                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐   │
│  │   Parser    │ →  │   Analyzer   │ →  │   Optimizer     │   │
│  │             │    │              │    │                 │   │
│  │ Load JSONL  │    │ Score        │    │ Copy Essential  │   │
│  │ Parse       │    │ Messages     │    │ Entries         │   │
│  │ Validate    │    │              │    │                 │   │
│  └─────────────┘    └──────────────┘    └─────────────────┘   │
│         │                    │                     │            │
│         │                    │                     ↓            │
│         │                    │            ┌─────────────────┐   │
│         │                    │            │   Serializer    │   │
│         │                    │            │                 │   │
│         │                    │            │ Write New JSONL │   │
│         │                    │            └─────────────────┘   │
│         ↓                    ↓                     ↓            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Context Optimizer Report                    │  │
│  │  - Original size vs Optimized size                       │  │
│  │  - Messages kept/removed/summarized                      │  │
│  │  - Preservation statistics                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Message Scoring System (Enhanced for Multi-Conversation)

**Multi-Factor Importance Score (0.0 - 1.0)**

```typescript
type MessageImportance = {
  // Position-based (NOT time-based)
  recency: number;         // 0.0-1.0 (based on message position from end)

  // Core importance factors
  userIntent: number;      // 0.0-1.0 (user messages = 1.0)
  taskCriticality: number; // 0.0-1.0 (file edits, key decisions = high)
  toolImpact: number;      // 0.0-1.0 (writes > reads, errors = high)

  // Deduplication factors
  contentSize: number;     // 0.0-1.0 (inversely proportional to size)
  uniqueness: number;      // 0.0-1.0 (duplicate within session = low)
  crossConvUniqueness: number; // 0.0-1.0 (duplicate across sessions = low)
  informationQuality: number;  // 0.0-1.0 (best version of duplicate content)

  // Context factors
  branchRelevance: number; // 0.0-1.0 (dead-end branches = low)
  patternFrequency: number; // 0.0-1.0 (if action repeated across sessions = higher)

  finalScore: number;      // weighted average
};
```

**Scoring Algorithm:**

```
// Recency based on position, not time
recency = 1.0 - (position_from_end / total_messages)

// Cross-conversation uniqueness
if (content_seen_in_other_conversations) {
  crossConvUniqueness = 0.3
  informationQuality = compareWithOtherInstances() // 0.0-1.0
} else {
  crossConvUniqueness = 1.0
  informationQuality = 1.0
}

// Pattern frequency (if same action in multiple conversations)
patternFrequency = min(1.0, occurrences_across_conversations / 3)

finalScore = (
  recency            * 0.20 +  // position-based
  userIntent         * 0.20 +
  taskCriticality    * 0.15 +
  toolImpact         * 0.12 +
  uniqueness         * 0.08 +
  crossConvUniqueness* 0.10 +  // NEW: cross-session dedup
  informationQuality * 0.08 +  // NEW: best version selection
  branchRelevance    * 0.05 +
  patternFrequency   * 0.02    // NEW: pattern detection
) - (contentSize * 0.1)  // penalty for large content
```

**Thresholds:**
- **Keep Verbatim**: score ≥ 0.75
- **Keep Summarized**: 0.50 ≤ score < 0.75
- **Keep Metadata Only**: 0.25 ≤ score < 0.50
- **Remove**: score < 0.25

### Optimization Strategies

#### Strategy 1: Intelligent Partial Content Extraction ⭐ NEW

**Problem**: Large files often have small relevant portions, but we don't know what's needed upfront.

**Solution**: Multi-pass relevance extraction
1. **First pass**: Identify what topics/sections are referenced in subsequent messages
2. **Extract relevant sections**: Keep only portions that Claude actually used/discussed
3. **Summarize remainder**: Brief summary of other sections

**Example - README File:**

**Original (15,693 chars):**
```json
{
  "type": "tool_result",
  "content": "# Gemini Agent SDK\n\n## Features\n[500 chars]...\n\n## Installation\n[300 chars]...\n\n## Usage\n[2000 chars]...\n\n## API Reference\n[12,893 chars]..."
}
```

**If Claude only discussed Features & Installation:**
```json
{
  "type": "tool_result",
  "content": "# Gemini Agent SDK\n\n## Features\n[500 chars - KEPT]...\n\n## Installation\n[300 chars - KEPT]...\n\n[SUMMARIZED: 13KB of Usage examples and API Reference omitted - not referenced in conversation]",
  "optimization_metadata": {
    "original_size": 15693,
    "kept_sections": ["Features", "Installation"],
    "summarized_sections": ["Usage", "API Reference"],
    "optimization": "partial_extraction",
    "size_reduction": "94%"
  }
}
```

**Relevance Detection Strategies:**
- **Keyword matching**: Claude mentioned "installation" → keep Installation section
- **Code references**: Claude copied code from section → keep that section
- **Contextual mentions**: "As the README explains..." → keep relevant parts
- **Pattern**: If no references found → full summarization

#### Strategy 2: Tool Result Summarization (Full File)

**When**: Content not referenced, or references are too scattered

**Before (15,693 chars):**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01XYZ",
  "content": "# Gemini Agent SDK\n\nTypeScript SDK for...[15,693 chars]"
}
```

**After (Summary):**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01XYZ",
  "content": "[SUMMARIZED: Read Resources/ClaudeAgentSDKCode/README.md (15.7KB) - Gemini Agent SDK documentation, features: query/prompt, web search, MCP integration, multi-model support]",
  "optimization_metadata": {
    "original_size": 15693,
    "optimization": "summarized",
    "summary_strategy": "file_read_large"
  }
}
```

**Generate summaries preserving:**
- File path
- File type (README, source code, config, etc.)
- Key topics/sections
- Original size

#### Strategy 3: Deduplication (Within & Across Conversations) ⭐ ENHANCED

**Detect Patterns:**
- **Within session**: Same file read multiple times
- **Across sessions**: Same file read in different conversations
- Same tool called with identical inputs

**Selection Strategy** (when duplicates found):
1. **Compare information quality** of each instance:
   - Which instance has more context around it?
   - Which led to successful outcomes vs dead-ends?
   - Which has Claude's analysis/insights in adjacent messages?
2. **Keep best instance**, reference others

**Example - Cross-Conversation Deduplication:**

**Session A** (line 45):
```json
{
  "tool_use_id": "toolu_A_01XYZ",
  "content": "[full README.md content]"
}
// Claude's next message: "I see the API uses OAuth2..."
```

**Session B** (line 12):
```json
{
  "tool_use_id": "toolu_B_02ABC",
  "content": "[same README.md content]"
}
// Claude's next message: "Let me try reading package.json instead..."
```

**Session C** (line 89):
```json
{
  "tool_use_id": "toolu_C_03DEF",
  "content": "[same README.md content]"
}
// Claude's next message: "Based on this README, I'll implement OAuth using..."
```

**Decision**: Keep Session C instance (best context - Claude actually used the info), reference Sessions A & B:

**Session A Optimized:**
```json
{
  "tool_use_id": "toolu_A_01XYZ",
  "content": "[DUPLICATE: See Session C for best version - Read README.md]",
  "optimization_metadata": {
    "best_instance_session": "session-C.jsonl",
    "best_instance_tool_use_id": "toolu_C_03DEF",
    "optimization": "cross_session_deduplicated",
    "reason": "Session C has better surrounding context"
  }
}
```

**Session C Optimized:**
```json
{
  "tool_use_id": "toolu_C_03DEF",
  "content": "[full README.md content - KEPT as best instance]",
  "optimization_metadata": {
    "also_seen_in": ["session-A.jsonl", "session-B.jsonl"],
    "selected_as_best": true,
    "reason": "Claude used this information to implement OAuth"
  }
}
```

#### Strategy 3: Dead-End Branch Pruning

**Challenge**: Identifying branches that led nowhere

**Heuristic Indicators:**
1. Assistant message → error → different approach
2. Multiple failed tool uses in sequence
3. Assistant says "let me try different approach"

**Action:**
- Mark branch as low-relevance (branchRelevance = 0.2)
- Keep final error message + pivot point
- Remove intermediate failed attempts

**Example Branch:**
```
User: "Fix the bug"
Assistant: "I'll try approach A"  [KEEP - pivot point]
Tool: Read file X                  [REMOVE]
Tool: Edit file X                  [REMOVE]
Tool: Test                         [REMOVE]
Result: Error Y                    [KEEP - error state]
Assistant: "Approach A failed, trying B"  [KEEP - pivot]
Tool: Read file Z                  [KEEP - new approach]
[continues...]
```

#### Strategy 4: Conversation Window Preservation

**Always Keep:**
- **Last N messages** (N=20-50, configurable)
- **First message** (session start context)
- **All user messages** in preserved window

**Rationale**: Recent context is critical for coherent resumption

#### Strategy 5: Metadata Preservation

**For ALL entries** (even removed ones), preserve:
```typescript
type MessageMetadata = {
  uuid: string;
  parentUuid: string | null;
  timestamp: string;
  type: string;
  optimization_action: 'kept' | 'summarized' | 'deduplicated' | 'removed';
  original_size?: number;
  importance_score?: number;
};
```

**Purpose**:
- Maintain UUID chain integrity
- Allow conversation flow reconstruction
- Support detailed optimization reports

---

## Implementation Checklist

### Phase 1: Core Infrastructure ✓ Critical

#### 1.1 Multi-Conversation Analyzer ⭐ NEW
- [ ] **Create `src/services/multi-conversation-analyzer.ts`**
  - Export `analyzeMultipleConversations()` function
  - Export `ConversationIndex` type
  - Export `CrossConversationPattern` type

- [ ] **Define Multi-Conversation Types**
  ```typescript
  type ConversationSource = {
    filePath: string;
    sessionId: string;
    entries: ConversationEntry[];
    metadata: {
      totalEntries: number;
      sizeBytes: number;
      dateRange: { first: string; last: string };
    };
  };

  type ContentFingerprint = {
    hash: string;              // content hash for deduplication
    toolName: string;          // Read, Write, Edit, etc.
    resourcePath?: string;     // file path if applicable
    contentSize: number;
    contentPreview: string;    // first 200 chars
  };

  type CrossConversationPattern = {
    fingerprint: ContentFingerprint;
    occurrences: Array<{
      sessionId: string;
      filePath: string;
      entryIndex: number;
      toolUseId: string;
      surroundingContext: {
        userMessageBefore?: string;
        assistantMessageAfter?: string;
        wasUsedInConversation: boolean;
        ledToSuccess: boolean;
      };
    }>;
    bestInstanceIndex: number;  // index into occurrences array
    bestInstanceReason: string;
  };

  type ConversationIndex = {
    allSessions: ConversationSource[];
    contentIndex: Map<string, CrossConversationPattern>;  // hash -> pattern
    fileAccessPatterns: Map<string, string[]>;  // file path -> session IDs
    frequentlyAccessedFiles: string[];  // files accessed in 3+ sessions
  };
  ```

- [ ] **Implement Cross-Conversation Analysis**
  - `buildContentIndex()` - hash all tool results across all conversations
  - `detectDuplicateContent()` - find same content in multiple sessions
  - `rankInstancesByQuality()` - score each instance of duplicate content
  - `identifyAccessPatterns()` - files frequently opened across sessions

#### 1.2 Context Optimizer Service
- [ ] **Create `src/services/context-optimizer.ts`**
  - Export `optimizeContext()` function (single conversation)
  - Export `optimizeMultipleConversations()` function ⭐ NEW
  - Export `OptimizationOptions` type
  - Export `OptimizationReport` type

- [ ] **Define Configuration Types**
  ```typescript
  type OptimizationLevel = 'conservative' | 'balanced' | 'aggressive';

  type OptimizationOptions = {
    level: OptimizationLevel;

    // Multi-conversation options ⭐ NEW
    sourceConversations?: string[];  // paths to multiple JSONL files
    crossSessionDedup?: boolean;     // default: true
    patternDetection?: boolean;      // default: true
    smartMerge?: boolean;            // merge related conversations

    // Existing options
    preserveRecentCount: number;    // default: 30 (position-based now!)
    largeContentThresholdKB: number; // default: 5
    summaryMaxLength: number;        // default: 200

    // Partial extraction ⭐ NEW
    partialExtractionEnabled?: boolean;  // default: true
    relevanceDetectionDepth?: number;    // default: 10 (look ahead N messages)

    scoreThresholds: {
      keepVerbatim: number;          // default: 0.75
      keepSummarized: number;        // default: 0.50
      keepMetadata: number;          // default: 0.25
    };
    deduplicationEnabled: boolean;   // default: true
    deadEndPruningEnabled: boolean;  // default: true
  };

  type OptimizationReport = {
    // Source stats
    sourceConversations: number;     // ⭐ NEW
    originalEntryCount: number;
    originalSizeBytes: number;

    // Output stats
    optimizedEntryCount: number;
    optimizedSizeBytes: number;
    reductionPercentage: number;

    // Action breakdown
    entriesKept: number;
    entriesSummarized: number;
    entriesPartiallyExtracted: number;  // ⭐ NEW
    entriesDeduplicated: number;
    entriesCrossSessionDeduped: number; // ⭐ NEW
    entriesRemoved: number;

    // Cross-conversation insights ⭐ NEW
    crossConversationPatterns?: {
      totalDuplicatesFound: number;
      filesAccessedMultipleTimes: string[];
      bestInstanceSelections: number;
    };

    preservedMessages: {
      user: number;
      assistant: number;
      system: number;
      toolResults: number;
    };
  };
  ```

#### 1.3 Message Scoring Engine (Enhanced) ⭐ UPDATED
- [ ] **Create `src/services/message-scorer.ts`**
  - Implement `scoreMessage()` function
  - Implement `scoreMessageWithCrossConversationContext()` ⭐ NEW

- [ ] **Implement Scoring Factors**:
  - `calculateRecencyScore()` - **position-based** (not time-based!) ⭐ UPDATED
  - `calculateUserIntentScore()` - user vs assistant
  - `calculateTaskCriticalityScore()` - edits/writes vs reads
  - `calculateToolImpactScore()` - tool importance ranking
  - `calculateContentSizeScore()` - size penalty
  - `calculateUniquenessScore()` - deduplication detection (within session)
  - `calculateCrossConvUniquenessScore()` - cross-session deduplication ⭐ NEW
  - `calculateInformationQualityScore()` - best version of duplicate ⭐ NEW
  - `calculateBranchRelevanceScore()` - dead-end detection
  - `calculatePatternFrequencyScore()` - repeated across sessions ⭐ NEW

- [ ] **Weighted Score Calculation**
  - Implement configurable weight system
  - Support different profiles (conservative/balanced/aggressive)
  - Cross-conversation aware scoring

#### 1.4 Partial Content Extractor ⭐ NEW
- [ ] **Create `src/services/partial-content-extractor.ts`**
  - Export `extractRelevantSections()` function
  - Export `detectReferences()` function

- [ ] **Implement Reference Detection**
  - `analyzeSubsequentMessages()` - look ahead N messages for references
  - `extractKeywords()` - identify mentioned topics/sections
  - `matchContentSections()` - map keywords to file sections
  - `scoreRelevance()` - calculate relevance score per section

- [ ] **Implement Section Extraction**
  - For **Markdown files**: Extract by headers (##, ###)
  - For **Code files**: Extract by functions, classes, imports
  - For **Config files**: Extract by top-level keys
  - For **Other files**: Extract by paragraphs/blocks

- [ ] **Generate Hybrid Content**
  - Keep relevant sections verbatim
  - Summarize non-referenced sections
  - Maintain file structure/hierarchy

#### 1.5 Tool Result Summarizer
- [ ] **Create `src/services/tool-result-summarizer.ts`**
  - Implement `summarizeToolResult()` function
  - File read summarization:
    - Extract file path, size, file type
    - For code files: detect language, main exports/imports
    - For docs: extract title, key sections
    - For configs: note config type, key settings
  - Generic summarization for other tool results
  - Preserve tool_use_id for reference chain

- [ ] **Summarization Templates**
  - Code files: `[SUMMARIZED: Read {path} ({size}) - {language} file, exports: {exports}]`
  - Docs: `[SUMMARIZED: Read {path} ({size}) - {doc_type}, sections: {sections}]`
  - Config: `[SUMMARIZED: Read {path} ({size}) - {config_type} configuration]`
  - Generic: `[SUMMARIZED: {tool} result ({size}) - {brief_description}]`

#### 1.4 Deduplication Detector
- [ ] **Create `src/services/deduplication-detector.ts`**
  - Implement `detectDuplicateToolResults()` function
  - Build content hash map for tool results
  - Track tool_use_id for duplicates
  - Handle partial duplicates (same file, different section)

- [ ] **Duplicate Replacement Logic**
  - Generate reference to original tool_use_id
  - Preserve metadata for traceability

#### 1.5 Dead-End Branch Analyzer
- [ ] **Create `src/services/branch-analyzer.ts`**
  - Implement `analyzeBranches()` function
  - Detect error patterns
  - Identify pivot points ("trying different approach")
  - Mark low-relevance branches

- [ ] **Branch Pruning Strategy**
  - Keep pivot points and final errors
  - Remove intermediate failed attempts
  - Preserve branch entry points for context

---

### Phase 2: Optimization Pipeline ✓ Critical

#### 2.1 Main Optimization Function
- [ ] **Implement `optimizeContext()` in `context-optimizer.ts`**
  ```typescript
  async function optimizeContext(
    sourceJsonlPath: string,
    outputJsonlPath: string,
    options: OptimizationOptions = DEFAULT_OPTIONS
  ): Promise<OptimizationReport>
  ```

- [ ] **Pipeline Steps**:
  1. Load and parse source JSONL using existing parser
  2. Build conversation graph (UUID → parentUUID relationships)
  3. Score all messages
  4. Identify duplicates and dead-end branches
  5. Determine preservation strategy for each entry
  6. Copy/transform entries to new JSONL
  7. Generate optimization report

#### 2.2 Entry Processing Logic
- [ ] **Create `src/services/entry-processor.ts`**
  - Implement `processEntry()` function
  - Handle different entry types:
    - User messages: always keep verbatim
    - Assistant messages: score-based keep/summarize
    - Tool results: score + size-based summarization
    - System messages: keep init/error, optimize status updates
    - File snapshots: summarize old ones, keep recent

- [ ] **Preservation Actions**:
  - **Keep Verbatim**: Copy entry as-is
  - **Summarize**: Replace content with summary
  - **Deduplicate**: Replace with reference
  - **Remove**: Don't copy, but log in metadata

#### 2.3 JSONL Writer
- [ ] **Create `src/services/optimized-jsonl-writer.ts`**
  - Implement streaming JSONL writer
  - Preserve entry order
  - Maintain UUID relationships
  - Add optimization_metadata to entries
  - Ensure valid JSONL format

- [ ] **Metadata Annotation**
  - Add `optimization_metadata` field to modified entries:
    ```json
    {
      "optimization_metadata": {
        "optimization_action": "summarized",
        "original_size": 15693,
        "summary_strategy": "file_read_large",
        "optimization_timestamp": "2025-11-15T..."
      }
    }
    ```

---

### Phase 3: ClaudeAgent SDK Integration ✓ Critical

#### 3.1 Session Resume with Optimized Context
- [ ] **Create `src/services/agent-session-manager.ts`**
  - Implement `resumeWithOptimizedContext()` function
  - Load optimized JSONL
  - Convert to SDK message format
  - Resume session using SDK `resume` option

- [ ] **Conversion Logic**
  - Map JSONL entries to `SDKUserMessage` and `SDKAssistantMessage`
  - Preserve UUIDs and session_id
  - Handle summarized content appropriately

#### 3.2 Optimization Workflow
- [ ] **Create workflow script `scripts/optimize-and-resume.ts`**
  ```typescript
  // 1. Run session, log to original JSONL
  const conversation = query({
    prompt: "...",
    options: { /* ... */ }
  });

  // 2. Optimize context
  const report = await optimizeContext(
    'session.jsonl',
    'session-optimized.jsonl',
    { level: 'balanced' }
  );

  // 3. Resume with optimized context
  const resumedConversation = query({
    prompt: "Continue working...",
    options: {
      resume: 'session-optimized.jsonl'
    }
  });
  ```

- [ ] **CLI Integration**
  - Add `optimize` command
  - Support optimization options via flags
  - Display optimization report

---

### Phase 4: Testing & Validation ✓ Critical

#### 4.1 Unit Tests

- [ ] **Test: Message Scoring**
  - Verify recency scoring (recent = higher)
  - Verify user messages score highest
  - Verify file edits score higher than reads
  - Verify large content receives size penalty
  - Verify duplicate detection lowers uniqueness score

- [ ] **Test: Tool Result Summarization**
  - Test file read summarization (README, source, config)
  - Test large content threshold detection
  - Test summary length constraints
  - Test metadata preservation

- [ ] **Test: Deduplication**
  - Test identical content detection
  - Test tool_use_id reference generation
  - Test partial duplicate handling

- [ ] **Test: Dead-End Branch Detection**
  - Test error pattern detection
  - Test pivot point identification
  - Test branch relevance scoring

- [ ] **Test: Entry Processing**
  - Test keep verbatim logic
  - Test summarization logic
  - Test deduplication logic
  - Test removal logic
  - Test metadata annotation

#### 4.2 Integration Tests

- [ ] **Test: Full Optimization Pipeline**
  - Load sample JSONL (use Resources/ClaudeLogs samples)
  - Run optimization with different levels
  - Verify output JSONL validity
  - Verify UUID chain integrity
  - Verify conversation flow preservation

- [ ] **Test: Size Reduction**
  - Measure original vs optimized file size
  - Verify reduction targets:
    - Conservative: 20-30% reduction
    - Balanced: 40-60% reduction
    - Aggressive: 60-80% reduction

- [ ] **Test: Context Preservation**
  - Verify all user messages preserved
  - Verify recent window fully preserved
  - Verify key decisions preserved
  - Verify file modification history intact

#### 4.3 End-to-End Tests

- [ ] **Test: Resume Session with Optimized Context**
  - Create test session
  - Optimize conversation log
  - Resume using optimized log
  - Verify Claude maintains context
  - Verify no conversation coherence loss

- [ ] **Test: Multi-Round Optimization**
  - Session 1 → Optimize → Session 2 → Optimize → Session 3
  - Verify context doesn't degrade over rounds
  - Verify essential information survives multiple optimizations

- [ ] **Test: Real-World Scenarios**
  - Use actual ClaudeLogs samples:
    - `1c18d146-6ccb-44cb-a940-8a9b31b565da.jsonl` (large, 1249 entries)
    - `1754816e-421a-4f35-843b-949afb76a7f9.jsonl` (medium, 93 entries)
    - `074b8683-9b28-4ffb-bb52-5cc462e3f876.jsonl` (small, 11 entries)
  - Optimize each
  - Verify reduction vs preservation balance

#### 4.4 Validation Tests

- [ ] **Test: Conversation Coherence**
  - Load optimized conversation
  - Ask Claude to summarize what happened in session
  - Verify Claude can reconstruct:
    - Original goal
    - Key decisions made
    - Files modified
    - Current state

- [ ] **Test: Information Loss Detection**
  - Manually review optimized logs
  - Flag any critical information lost
  - Adjust scoring/summarization strategies
  - Iterate until <5% information loss

---

### Phase 5: CLI & User Experience ✓ Important

#### 5.1 Command-Line Interface

- [ ] **Add `optimize` command to CLI**

**Single Conversation:**
```bash
npm run optimize -- \
  --source Resources/ClaudeLogs/session.jsonl \
  --output Resources/ClaudeLogs/session-optimized.jsonl \
  --level balanced \
  --preserve-recent 30 \
  --report
```

**Multiple Conversations:** ⭐ NEW
```bash
npm run optimize -- \
  --sources "Resources/ClaudeLogs/session-A.jsonl,Resources/ClaudeLogs/session-B.jsonl,Resources/ClaudeLogs/session-C.jsonl" \
  --output Resources/ClaudeLogs/combined-optimized.jsonl \
  --level balanced \
  --cross-session-dedup \
  --pattern-detection \
  --report
```

**With Glob Pattern:** ⭐ NEW
```bash
npm run optimize -- \
  --sources "Resources/ClaudeLogs/project-*" \
  --output Resources/ClaudeLogs/project-consolidated.jsonl \
  --level balanced \
  --smart-merge \
  --report
```

- [ ] **Command Options**:
  - `--source <path>`: Single source JSONL file
  - `--sources <paths>`: Multiple source JSONL files (comma-separated or glob) ⭐ NEW
  - `--output <path>`: Output JSONL file (required)
  - `--level <conservative|balanced|aggressive>`: Optimization level
  - `--preserve-recent <n>`: Number of recent messages to preserve (position-based!)
  - `--threshold <kb>`: Large content threshold in KB
  - `--cross-session-dedup`: Enable cross-conversation deduplication ⭐ NEW
  - `--pattern-detection`: Detect frequently accessed files ⭐ NEW
  - `--smart-merge`: Merge related conversations intelligently ⭐ NEW
  - `--partial-extraction`: Enable intelligent section extraction ⭐ NEW
  - `--report`: Display detailed optimization report
  - `--dry-run`: Show what would be optimized without writing output

#### 5.2 Optimization Report Display

- [ ] **Implement Report Formatter**
  - Display before/after statistics
  - Show reduction percentages
  - List entries by optimization action
  - Highlight potential issues (high information loss, broken chains)

- [ ] **Example Report (Single Conversation)**:
  ```
  Context Optimization Report
  ============================

  Source: Resources/ClaudeLogs/session.jsonl
  Output: Resources/ClaudeLogs/session-optimized.jsonl
  Level: balanced

  Original:  1,249 entries | 7.0 MB
  Optimized:   487 entries | 2.1 MB
  Reduction: 61.0% entries | 70.0% size

  Entries by Action:
  - Kept Verbatim:         250 (51.3%)
  - Summarized:            120 (24.6%)
  - Partially Extracted:    60 (12.3%)  ⭐ NEW
  - Deduplicated:          57 (11.7%)
  - Removed:              762

  Preserved Messages:
  - User messages:     all 369 (100%)
  - Assistant msgs:    150 of 843 (17.8%)
  - Tool results:      120 of 350 (34.3%)
  - System messages:   all 7 (100%)

  Warnings: None
  ```

- [ ] **Example Report (Multi-Conversation)**: ⭐ NEW
  ```
  Multi-Conversation Optimization Report
  =======================================

  Sources: 3 conversations
    - Resources/ClaudeLogs/session-A.jsonl (845 entries, 4.2 MB)
    - Resources/ClaudeLogs/session-B.jsonl (412 entries, 1.8 MB)
    - Resources/ClaudeLogs/session-C.jsonl (1,249 entries, 7.0 MB)

  Output: Resources/ClaudeLogs/combined-optimized.jsonl
  Level: balanced

  Combined Original: 2,506 entries | 13.0 MB
  Optimized:          523 entries |  1.9 MB
  Reduction:         79.1% entries | 85.4% size

  Entries by Action:
  - Kept Verbatim:              180 (34.4%)
  - Summarized:                 140 (26.8%)
  - Partially Extracted:         85 (16.3%)
  - Deduplicated (within):       45 (8.6%)
  - Cross-Session Deduped:       73 (14.0%)  ⭐ NEW
  - Removed:                  1,983

  Cross-Conversation Insights:
  - Duplicate content found:     118 instances
  - Files accessed 3+ times:     12 files
  - Best instance selections:    73 (kept best version from different sessions)

  Frequently Accessed Files:
  - README.md (accessed in all 3 sessions → kept best instance from session-C)
  - src/index.ts (accessed in sessions A, C → kept session-C version)
  - package.json (accessed in all 3 sessions → kept session-A version)

  Preserved Messages:
  - User messages:     all 487 (100%)
  - Assistant msgs:    220 of 1,542 (14.3%)
  - Tool results:      185 of 420 (44.0%)
  - System messages:   all 12 (100%)

  Warnings: None
  ```

#### 5.3 Interactive Mode

- [ ] **Implement Interactive Optimization**
  - Ask user for optimization level
  - Preview high-impact decisions
  - Allow manual override for specific entries
  - Confirm before writing output

---

### Phase 6: Documentation & Examples ✓ Important

#### 6.1 API Documentation

- [ ] **Document `context-optimizer.ts` API**
  - `optimizeContext()` function
  - `OptimizationOptions` type
  - `OptimizationReport` type
  - Scoring algorithm explanation

- [ ] **Document Optimization Strategies**
  - When to use each optimization level
  - How scoring works
  - Summarization strategies
  - Deduplication logic
  - Dead-end branch detection

#### 6.2 Usage Examples

- [ ] **Example: Basic Optimization**
  ```typescript
  import { optimizeContext } from './services/context-optimizer';

  const report = await optimizeContext(
    'session.jsonl',
    'session-optimized.jsonl',
    { level: 'balanced' }
  );

  console.log(`Reduced size by ${report.reductionPercentage}%`);
  ```

- [ ] **Example: Custom Configuration**
  ```typescript
  const report = await optimizeContext(
    'session.jsonl',
    'session-optimized.jsonl',
    {
      level: 'balanced',
      preserveRecentCount: 50,
      largeContentThresholdKB: 10,
      scoreThresholds: {
        keepVerbatim: 0.80,
        keepSummarized: 0.60,
        keepMetadata: 0.30
      }
    }
  );
  ```

- [ ] **Example: Resume with Optimized Context**
  ```typescript
  import { query } from './services/agent-runner';
  import { optimizeContext } from './services/context-optimizer';

  // Optimize previous session
  await optimizeContext(
    'session-previous.jsonl',
    'session-previous-optimized.jsonl'
  );

  // Resume with optimized context
  const conversation = query({
    prompt: "Continue working on the feature",
    options: {
      resume: 'session-previous-optimized.jsonl'
    }
  });
  ```

#### 6.3 Best Practices Guide

- [ ] **Write guide: "When to Optimize Context"**
  - Session exceeded context window
  - High API costs from large context
  - Session becoming slow
  - Preparing for long-running project

- [ ] **Write guide: "Choosing Optimization Level"**
  - Conservative: Short sessions, critical work
  - Balanced: Most use cases
  - Aggressive: Very long sessions, exploration work

- [ ] **Write guide: "Validating Optimized Context"**
  - Check optimization report
  - Manually review optimized JSONL
  - Test resumption with sample prompts
  - Verify Claude maintains context

#### 6.4 README Updates

- [ ] **Add Context Optimization section to README**
  - Feature overview
  - Quick start guide
  - CLI usage examples
  - Configuration options

---

## Testing Strategy

### Test Data Sources

1. **Use Actual ClaudeLogs Samples**
   - Copy 5-10 diverse files from `Resources/ClaudeLogs/` to `src/tests/fixtures/optimization-samples/`
   - Include variety:
     - Large sessions (1000+ entries)
     - Medium sessions (50-200 entries)
     - Small sessions (10-50 entries)
     - Different conversation types (debugging, feature implementation, exploration)

2. **Create Synthetic Test Cases**
   - High duplication (same file read 10 times)
   - Dead-end branches (multiple failed approaches)
   - Large file reads (mock 30KB+ README files)
   - Mixed content (code, docs, configs)

### Test Execution Plan

#### Unit Tests
```bash
npm test -- src/tests/context-optimizer/
```
**Expected**: All scoring, summarization, deduplication logic works correctly

#### Integration Tests
```bash
npm test -- src/tests/integration/context-optimization.test.ts
```
**Expected**: Full optimization pipeline produces valid, reduced JSONL

#### E2E Tests
```bash
npm test -- src/tests/e2e/optimization-resume.test.ts
```
**Expected**: Can resume sessions with optimized context without coherence loss

### Success Metrics

- **Size Reduction**:
  - Conservative: 20-30%
  - Balanced: 40-60%
  - Aggressive: 60-80%

- **Information Preservation**:
  - User messages: 100%
  - Recent window: 100%
  - File modifications: 100%
  - Key decisions: >95%

- **Resume Quality**:
  - Claude can summarize session correctly: >90%
  - Claude maintains context awareness: >95%
  - No conversation breaks: >98%

---

## Success Criteria

### ✅ Definition of Done

1. **Functional**: Can optimize any Claude conversation JSONL file
2. **Configurable**: Support 3 optimization levels + custom options
3. **Preserves Context**: Claude can resume with optimized logs coherently
4. **Tested**: >95% code coverage, E2E tests pass
5. **Documented**: Clear API docs, usage examples, best practices
6. **CLI**: User-friendly command-line interface
7. **Validated**: Tested on real ClaudeLogs samples with good results
8. **SDK Integration**: Works seamlessly with ClaudeAgent SDK resume

### Verification Checklist

- [ ] Run full test suite: `npm test`
- [ ] Optimize 5+ real ClaudeLogs samples
- [ ] Verify size reduction targets met
- [ ] Resume sessions with optimized logs successfully
- [ ] Validate conversation coherence maintained
- [ ] Check optimization reports accurate
- [ ] Verify CLI works correctly
- [ ] Test all optimization levels
- [ ] Validate documentation complete
- [ ] Confirm examples work

---

## Risk Mitigation

### Risk: Over-Optimization

**Issue**: Removing too much context, breaking conversation

**Mitigation**:
- Always preserve last N messages verbatim
- Conservative scoring thresholds by default
- User override for critical entries
- Detailed optimization report for review
- Dry-run mode to preview changes

### Risk: UUID Chain Breakage

**Issue**: Removing entries breaks parentUuid relationships

**Mitigation**:
- Track all UUIDs in metadata
- Maintain UUID→parentUUID map
- Validate chain integrity after optimization
- Keep metadata for removed entries

### Risk: Semantic Understanding Required

**Issue**: Detecting dead-ends requires understanding conversation meaning

**Mitigation**:
- Use heuristics (error patterns, pivot keywords)
- Conservative dead-end detection
- User can disable branch pruning
- Focus on clear signals (explicit errors, "trying different approach")

### Risk: Large File Summarization Quality

**Issue**: Poor summaries lose critical information

**Mitigation**:
- Test summaries against real examples
- Template-based summarization (consistent format)
- Preserve file path, size, type metadata
- Allow user to mark files as "never summarize"

---

## Timeline Estimate

### Updated Timeline (with Multi-Conversation Features)

- **Phase 1** (Core Infrastructure): 12-18 hours ⭐ +4-6h for multi-conversation
- **Phase 2** (Optimization Pipeline): 8-12 hours ⭐ +2h for partial extraction
- **Phase 3** (SDK Integration): 4-6 hours (unchanged)
- **Phase 4** (Testing & Validation): 12-18 hours ⭐ +2-3h for cross-session tests
- **Phase 5** (CLI & UX): 5-8 hours ⭐ +1-2h for multi-source UI
- **Phase 6** (Documentation): 5-8 hours ⭐ +1-2h for new examples

**Total**: 46-70 hours of focused development (+10-15 hours for multi-conversation capabilities)

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Select test JSONL samples** from ClaudeLogs
3. **Begin Phase 1** - build core infrastructure
4. **Iterate with testing** - validate each phase before proceeding
5. **Gather feedback** - test with real use cases throughout

---

## Appendix: Scoring Examples

### Example 1: Recent User Message
```json
{
  "type": "user",
  "timestamp": "2025-11-15T10:00:00Z", // recent
  "message": {"role": "user", "content": "Fix the bug"}
}
```
**Score**: 1.0 (kept verbatim)
- Recency: 1.0 (just now)
- UserIntent: 1.0 (user message)
- TaskCriticality: 0.8 (explicit task)
- **Final**: 0.95

### Example 2: Large README Read (Old)
```json
{
  "type": "user",
  "timestamp": "2025-11-15T08:00:00Z", // 2 hours ago
  "message": {
    "content": [{
      "type": "tool_result",
      "content": "[15KB README content]"
    }]
  }
}
```
**Score**: 0.35 (summarized)
- Recency: 0.3 (2 hours old)
- UserIntent: 0.0 (tool result)
- ToolImpact: 0.3 (read = low)
- ContentSize: 0.1 (large penalty)
- **Final**: 0.35

### Example 3: Failed Tool in Dead-End Branch
```json
{
  "type": "user",
  "message": {
    "content": [{
      "type": "tool_result",
      "content": "Error: file not found"
    }]
  }
}
```
**Score**: 0.2 (removed if in dead-end branch)
- BranchRelevance: 0.2 (dead-end detected)
- ToolImpact: 0.8 (error = high normally)
- **Final**: 0.2 (but keep final error in branch)

---

## Contact & Feedback

For questions or feedback on this implementation plan, please create an issue in the repository or contact the development team.

**Last Updated**: 2025-11-15
**Plan Version**: 1.0
**Status**: Ready for Review
