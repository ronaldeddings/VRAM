# Multi-Agent Context Optimization Guide

## Overview

The Multi-Agent Context Optimizer is an AI-driven system that uses 10 parallel Claude agents to intelligently optimize Claude Code conversation logs. Unlike rule-based optimization which uses thresholds and heuristics, this approach makes informed decisions about what content to preserve based on understanding the full conversation context.

## Architecture

### 10-Agent System

**Agents 1-8: Chunk Analyzers**
- Each analyzes a specific chunk of the conversation chronologically
- Makes independent decisions about what to keep vs remove
- Focuses on preserving narrative flow and essential context
- Provides confidence scores for each decision

**Agent 9: Cross-Chunk Context Analyzer**
- Reviews all chunk analyzer decisions
- Identifies cross-chunk dependencies and connections
- Detects narrative threads that span multiple chunks
- Provides override recommendations for entries that are critical for continuity

**Agent 10: Final Decision Coordinator**
- Consolidates all agent recommendations
- Resolves conflicts between analyzers
- Makes final determination on what to keep
- Ensures overall conversation coherence

## Usage

### Basic Usage

```bash
# AI-driven multi-agent optimization (RECOMMENDED)
bun src/cli/context-optimizer-cli.ts \
  --input Resources/ClaudeLogs/session.jsonl \
  --output Resources/ClaudeLogs/session-optimized.jsonl \
  --multi-agent \
  --verbose
```

### Advanced Options

```bash
# Custom agent count and model
bun src/cli/context-optimizer-cli.ts \
  --input Resources/ClaudeLogs/large-session.jsonl \
  --output Resources/ClaudeLogs/large-session-optimized.jsonl \
  --multi-agent \
  --agent-count 10 \
  --agent-model sonnet \
  --verbose \
  --report
```

### Custom Optimization Prompt

Create a custom prompt file to guide the agents' decision-making:

```txt
# my-optimization-prompt.txt
You are analyzing a Claude Code conversation focused on API development.

PRIORITY: Keep all API design decisions, endpoint definitions, and authentication logic.
REMOVE: Verbose debugging output, repetitive error messages, and file reads of the same content.

Focus on preserving the API architecture discussion while removing implementation noise.
```

Then use it:

```bash
bun src/cli/context-optimizer-cli.ts \
  --input Resources/ClaudeLogs/api-project.jsonl \
  --output Resources/ClaudeLogs/api-project-optimized.jsonl \
  --multi-agent \
  --custom-prompt my-optimization-prompt.txt \
  --verbose
```

## How It Works

### Step 1: Chunking

The conversation is divided into chunks based on token limits (default: 20,000 tokens per chunk). This allows:
- Parallel analysis by multiple agents
- Handling of very large conversations that exceed token limits
- Focused analysis on manageable sections

### Step 2: Parallel Chunk Analysis

Agents 1-8 analyze their assigned chunks in parallel:
- Read the entire chunk carefully
- Identify key themes and progression
- Mark entries as KEEP or REMOVE with confidence scores
- Provide reasoning for each decision

**What Agents Keep:**
- Key decisions and their rationale
- Important technical discoveries
- Critical user requirements
- Problem-solving breakthroughs
- Essential file paths and code references
- Unique information not repeated elsewhere

**What Agents Remove:**
- Verbose explanations that can be summarized
- Repetitive acknowledgments
- Redundant file reads
- Duplicate error messages
- Overly detailed progress updates
- Tool usage that didn't contribute to outcomes

### Step 3: Cross-Chunk Analysis

Agent 9 reviews all chunk decisions to:
- Identify cross-chunk references and dependencies
- Ensure removed content in one chunk doesn't break context in another
- Detect narrative threads spanning multiple chunks
- Override chunk decisions when continuity requires it

### Step 4: Final Coordination

Agent 10 consolidates all recommendations:
- Prioritizes cross-chunk analyzer overrides (bigger picture view)
- Resolves conflicts between chunk analyzers
- Applies "when in doubt, keep it" principle
- Validates overall conversation coherence

### Step 5: Token Recalculation

The optimized conversation is processed to:
- Recalculate accurate token counts
- Reset cache tokens to 0 (Claude Code rebuilds cache on resume)
- Ensure proper token metadata for each entry

## Decision Principles

1. **Preserve Meaning Over Aggressive Optimization**
   - Better to over-preserve than lose critical context
   - When uncertain, agents keep content

2. **Narrative Flow Matters**
   - Maintain coherent story of the work
   - Keep context needed to understand later references

3. **Cross-Chunk Context Prioritized**
   - Agent 9's overrides have priority
   - Connections across chunks are preserved

4. **Evidence-Based Decisions**
   - Each decision includes reasoning
   - Confidence scores reflect certainty

## Comparison: Multi-Agent vs Rule-Based

### Rule-Based Optimization

```bash
# Traditional approach
bun src/cli/context-optimizer-cli.ts \
  --input session.jsonl \
  --output session-optimized.jsonl \
  --level balanced
```

**Characteristics:**
- Uses importance thresholds (0.8, 0.6, 0.4, 0.2)
- Mechanical scoring based on heuristics
- Fast but may be too aggressive
- Example: 90% reduction (166K → 813 tokens)
- **Risk:** Loses conversation meaning

### Multi-Agent Optimization

```bash
# AI-driven approach
bun src/cli/context-optimizer-cli.ts \
  --input session.jsonl \
  --output session-optimized.jsonl \
  --multi-agent \
  --verbose
```

**Characteristics:**
- AI-driven decisions based on understanding
- Preserves narrative and meaning
- Slower but more intelligent
- Expected: 60-85% reduction with preservation focus
- **Benefit:** Maintains conversation value and project continuity
- **Philosophy:** "Keep what is necessary" rather than "optimize for numbers"

## Example Output

```
🤖 Multi-Agent AI-Driven Optimization

   Spawning 10 Claude agents for intelligent context optimization...

📦 Created 3 chunks from 378 entries
   Chunk 1: Entries 0-125 (18,342 tokens)
   Chunk 2: Entries 126-251 (19,876 tokens)
   Chunk 3: Entries 252-377 (15,234 tokens)

🤖 Spawning 3 chunk analyzer agents...
✅ Completed 3 chunk analyses

🔗 Running cross-chunk context analyzer (Agent 9)...
✅ Cross-chunk analysis complete

🎯 Running final decision coordinator (Agent 10)...
✅ Final coordination complete

✅ Multi-Agent Optimization Complete!

📊 Summary:
   Original entries: 378
   Optimized entries: 198
   Entries removed: 180
   Reduction: 47.6%
   Execution time: 142.3s

📈 Token Analysis:
   Original input tokens: 166,453
   Original output tokens: 12,234
   Optimized input tokens: 72,145
   Optimized output tokens: 8,921
   Token reduction: 54.7%

🤖 Agent Decisions:
   Chunk analyzers: 3 agents
   Average confidence: 87.3%
   Cross-chunk analyzer: 12 overrides
   Final coordinator: 198 entries kept
   Coordinator confidence: 91.2%

💾 Optimized conversation saved!
```

## Performance Considerations

- **Execution Time:** 10-15 minutes for large conversations (300+ entries)
- **Token Usage:** Significant (each agent analyzes its chunk)
- **Best For:** Important conversations you want to preserve for later resume
- **Not Recommended For:** Quick throwaway sessions

## API Integration

```typescript
import { MultiAgentOptimizer } from './services/multi-agent-optimizer';
import type { ConversationEntry } from './types/claude-conversation';

// Load conversation
const entries: ConversationEntry[] = loadConversation();

// Create optimizer
const optimizer = new MultiAgentOptimizer({
  agentCount: 10,
  model: 'sonnet',
  customPrompt: 'Keep API design decisions...',
  verbose: true,
});

// Optimize
const result = await optimizer.optimizeConversation(entries);

// Access results
console.log(`Reduced from ${result.originalEntries.length} to ${result.optimizedEntries.length} entries`);
console.log(`Token reduction: ${result.stats.percentReduction.toFixed(1)}%`);
console.log(`Agent decisions: ${result.agentDecisions.length}`);
```

## Implementation Details

### Files Created

1. **src/services/multi-agent-optimizer.ts** (790 lines)
   - MultiAgentOptimizer class
   - ConversationChunk type
   - AgentDecision type
   - Default prompts for each agent type
   - Chunk creation logic
   - Agent spawning and coordination
   - Decision parsing and consolidation

2. **src/cli/context-optimizer-cli.ts** (updated)
   - Added --multi-agent flag
   - Added --agent-count, --agent-model, --custom-prompt flags
   - Multi-agent execution path
   - printMultiAgentResults function

3. **implementation/7-multi-agent-optimization-guide.md** (this file)
   - Complete usage documentation
   - Architecture explanation
   - Examples and best practices

### Key Technical Decisions

1. **Chunk Size: 20,000 tokens**
   - Balances parallel processing with context completeness
   - Allows agents to see enough context to make informed decisions
   - Prevents token limit issues

2. **10 Agents: 8 chunk + 1 cross-chunk + 1 coordinator**
   - Optimal balance between parallelism and coordination overhead
   - Chunk analyzers work independently and in parallel
   - Cross-chunk analyzer sees the bigger picture
   - Coordinator makes final consolidated decisions

3. **JSON Response Format**
   - Structured output for reliable parsing
   - keepEntries array with global indices
   - Confidence scores for decision quality
   - Reasoning text for transparency

4. **Fallback Strategy**
   - If JSON parsing fails, keep all entries (safe default)
   - Prevents data loss from parsing errors
   - Logs warnings for debugging

## Future Enhancements

1. **Multi-Source Support**
   - Extend to work with --sources flag
   - Optimize multiple conversations together
   - Detect cross-conversation patterns

2. **Incremental Optimization**
   - Optimize only new entries since last optimization
   - Preserve previous agent decisions
   - Faster re-optimization

3. **Agent Specialization**
   - Security-focused agent
   - Performance-focused agent
   - Code quality agent
   - UX-focused agent

4. **Learning System**
   - Track optimization outcomes
   - Learn from user feedback
   - Improve decision-making over time

## Troubleshooting

### Issue: Need even more preservation (less than 60% reduction)

**Solution:** Create ultra-conservative custom prompt:

```txt
ULTRA-CONSERVATIVE PRESERVATION MODE

Your PRIMARY mission: Keep EVERYTHING that could possibly be useful.

CORE RULES:
1. If you're not 100% certain something is redundant → KEEP IT
2. If content appears less than 10 times identically → KEEP IT
3. If there's ANY chance it contributes to project understanding → KEEP IT
4. User messages, technical decisions, file paths, code → ALWAYS KEEP
5. When estimating redundancy, assume you might be wrong → KEEP IT

REMOVAL CRITERIA (all must be true):
- Content appears 10+ times with ZERO variation
- Removal has ZERO impact on any other entry
- You are 99%+ confident it's truly redundant
- Content provides absolutely no unique value

Your success metric: Future agents can understand and continue the project perfectly.
Reduction percentage is IRRELEVANT. Project continuity is EVERYTHING.
```

**Expected result:** 40-60% reduction with maximum preservation

### Issue: Agents are too conservative

**Solution:** Use custom prompt to be more aggressive:

```txt
Be aggressive in removing redundant content.
REMOVE: All file reads that don't contribute to final solution.
REMOVE: Verbose explanations and progress updates.
KEEP ONLY: Key decisions, technical breakthroughs, and unique insights.
```

### Issue: Agents are too aggressive

**Solution:** Emphasize preservation in custom prompt:

```txt
Prioritize preserving conversation meaning and context.
KEEP: Anything that contributes to understanding the project.
REMOVE ONLY: Truly redundant content that appears multiple times.
When uncertain, ALWAYS keep the content.
```

### Issue: Long execution time

**Solutions:**
1. Reduce agent count: `--agent-count 5`
2. Use faster model: `--agent-model haiku`
3. Process in batches if very large

### Issue: High token usage

**Solutions:**
1. Use smaller model: `--agent-model haiku`
2. Reduce chunk size in code (maxTokensPerChunk config)
3. Optimize fewer conversations at once

## Conclusion

The Multi-Agent Context Optimizer represents a paradigm shift from mechanical rule-based optimization to AI-driven intelligent decision-making. By using 10 parallel Claude agents that understand the full conversation context, it preserves conversation meaning while achieving significant token reduction.

**Use Cases:**
- Important project conversations to resume later
- Comprehensive technical discussions
- Architecture decision records
- Problem-solving sessions
- Any conversation where meaning > raw token count

**Not Suitable For:**
- Quick throwaway sessions
- Simple one-off questions
- Time-sensitive optimizations
- Conversations where aggressive reduction is acceptable
