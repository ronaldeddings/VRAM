/**
 * Multi-Agent Context Optimizer
 *
 * Intelligent conversation optimization using 10 parallel Claude AI agents.
 * Unlike rule-based optimization, this uses AI-driven decisions to preserve
 * conversation meaning while reducing token usage.
 */

import { query, type AgentDefinition, type Options, type SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { ConversationEntry } from '../types/claude-conversation';
import { calculateTokens, recalculateConversationTokens, type RecalculationStats } from './token-calculator';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// =====================================
// Helper Functions
// =====================================

/**
 * Find the Claude Code executable path
 */
function getClaudeCodeExecutablePath(): string {
  try {
    // Try to find 'claude' executable using 'which'
    const claudePath = execSync('which claude', { encoding: 'utf-8' }).trim();

    if (claudePath) {
      // Check if it's a symlink and resolve to actual cli.js
      try {
        const linkTarget = readFileSync(claudePath, 'utf-8');
        // If it's not a symlink, readFileSync will fail or return actual file content
        return claudePath;
      } catch {
        // It's a real file, use it
        return claudePath;
      }
    }
  } catch {
    // Fall through to default
  }

  // Default fallback - check common installation paths
  const commonPaths = [
    '/Users/ronaldeddings/.nvm/versions/node/v22.17.1/lib/node_modules/@anthropic-ai/claude-code/cli.js',
    '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js',
    '/opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/cli.js',
  ];

  for (const path of commonPaths) {
    try {
      const fs = require('fs');
      if (fs.existsSync(path)) {
        return path;
      }
    } catch {
      continue;
    }
  }

  throw new Error('Could not find Claude Code executable. Please ensure Claude Code is installed.');
}

// =====================================
// Types
// =====================================

export interface ConversationChunk {
  entries: ConversationEntry[];
  chunkIndex: number;
  totalChunks: number;
  startIndex: number;
  endIndex: number;
  tokenCount: number;
}

export interface AgentDecision {
  agentId: number;
  chunkIndex: number;
  keepEntries: number[]; // Indices of entries to keep
  removeEntries: number[]; // Indices of entries to remove
  reasoning: string;
  confidence: number; // 0.0 - 1.0
}

export interface OptimizationResult {
  originalEntries: ConversationEntry[];
  optimizedEntries: ConversationEntry[];
  stats: RecalculationStats;
  agentDecisions: AgentDecision[];
  executionTimeMs: number;
}

export interface MultiAgentOptimizerConfig {
  /**
   * Number of parallel agents to spawn (default: 10)
   * Agents 1-8: Chunk analyzers
   * Agent 9: Cross-chunk context analyzer
   * Agent 10: Final decision coordinator
   */
  agentCount?: number;

  /**
   * Maximum tokens per chunk (default: 20000)
   * Controls how conversation is divided among agents
   */
  maxTokensPerChunk?: number;

  /**
   * Custom optimization prompt to guide agent decisions
   * If not provided, uses default prompt focused on preserving meaning
   */
  customPrompt?: string;

  /**
   * Model to use for agents (default: 'sonnet')
   */
  model?: 'sonnet' | 'opus' | 'haiku';

  /**
   * Enable verbose logging (default: false)
   */
  verbose?: boolean;
}

// =====================================
// Default Prompts
// =====================================

const DEFAULT_CHUNK_ANALYZER_PROMPT = `You are a conversation preservation specialist for Claude Code sessions. Your PRIMARY goal is to identify and keep what is necessary for project continuity and future agent collaboration.

**CORE PRINCIPLE: "KEEP WHAT IS NECESSARY"**

Your mission is NOT to optimize for reduction percentages. Your mission IS to preserve everything needed for:
- Project understanding and context
- Future agent collaboration and continuity
- Technical decision rationale and history
- Problem-solving progression and learnings

**WHAT YOU MUST KEEP (Be Conservative):**
- ALL user instructions, requirements, and preferences
- ALL key technical decisions and their rationale
- ALL problem-solving discoveries and breakthroughs
- ALL file paths, code references, and implementation details
- ALL architectural decisions and design patterns
- ALL error resolutions and debugging insights
- ALL unique information that contributes to project understanding
- ALL context that helps explain why things were done a certain way
- Tool outputs that led to important decisions or discoveries
- Conversation flow that maintains narrative coherence

**WHAT YOU CAN REMOVE (Be Very Selective):**
Only remove content that meets ALL of these criteria:
1. The information is IDENTICAL to content appearing 3+ times in the chunk
2. The removal will NOT affect understanding of any other entry
3. The content adds no unique insight, decision, or discovery
4. You are highly confident (>0.95) that it's truly redundant

Examples of truly safe removals:
- The exact same file read appearing 5+ times with identical output
- Identical "acknowledged" or "I'll help you with that" responses with no new information
- Duplicate stack traces that are byte-for-byte identical

**DECISION FRAMEWORK:**
1. Default stance: KEEP (when uncertain, always preserve)
2. Only mark REMOVE if you meet ALL the strict criteria above
3. If content contributes ANY unique value to project understanding → KEEP
4. If content helps explain the progression of work → KEEP
5. If content shows how a problem was solved → KEEP

**OUTPUT FORMAT:**
Return a JSON object with:
{
  "keepEntries": [array of entry indices to KEEP],
  "removeEntries": [array of entry indices to REMOVE - should be VERY SHORT],
  "reasoning": "Brief explanation of your preservation strategy",
  "confidence": 0.0-1.0 (how confident you are in these decisions)
}

Remember: Your goal is accuracy and project continuity, NOT aggressive optimization. When in doubt, KEEP IT.`;

const DEFAULT_CROSS_CHUNK_PROMPT = `You are a cross-chunk continuity guardian. Your PRIMARY mission is to protect project context that spans across conversation chunks.

**CORE RESPONSIBILITY: PROTECT CROSS-CHUNK CONTEXT**

You review decisions from chunk analyzers with a critical eye toward preserving connections and narrative threads that span multiple chunks. You have VETO POWER to override removal decisions.

**WHAT YOU MUST PROTECT:**
- References that connect chunks (e.g., "as we discussed earlier", "building on the previous approach")
- Technical decisions that influence work in other chunks
- File paths and code references that appear across multiple chunks
- Error resolutions that span multiple attempts across chunks
- Architectural decisions that have downstream effects
- Any content that provides essential context for understanding later chunks
- Narrative threads that explain the progression of the project

**YOUR VETO AUTHORITY:**
If a chunk analyzer marked something for removal, but you see it has cross-chunk importance:
1. OVERRIDE the removal decision immediately
2. Mark it as MUST KEEP with high confidence
3. Explain why the cross-chunk context is critical

**DECISION FRAMEWORK:**
1. Assume chunk analyzers may not see the full picture (they only see their chunk)
2. Be AGGRESSIVE in protecting cross-chunk references
3. If content in chunk A helps explain content in chunk B → OVERRIDE to KEEP
4. If content establishes context used later → OVERRIDE to KEEP
5. When in doubt about cross-chunk importance → OVERRIDE to KEEP

**OUTPUT FORMAT:**
Return a JSON object with:
{
  "overrides": [
    {
      "chunkIndex": number,
      "entryIndex": number,
      "action": "MUST_KEEP",
      "reasoning": "Why this is critical for cross-chunk continuity",
      "confidence": 0.0-1.0
    }
  ],
  "overallReasoning": "Summary of your cross-chunk protection strategy",
  "confidence": 0.0-1.0
}

Remember: You are the guardian of cross-chunk context. Be aggressive in protecting connections. Err on the side of preservation.`;

const DEFAULT_COORDINATOR_PROMPT = `You are the final preservation coordinator. Your PRIMARY mission is to ensure we keep everything necessary for project success and agent collaboration.

**CORE PRINCIPLE: PROJECT VALUE OVER METRICS**

You are making the FINAL decision on what gets preserved. Your goal is NOT to hit a reduction target. Your goal IS to ensure the optimized conversation contains everything needed for:
- Future agents to understand the project completely
- Technical decisions to be traceable and understandable
- Problem-solving progression to be clear
- Project continuity to be maintained

**DECISION HIERARCHY (in order of priority):**
1. **Cross-chunk analyzer overrides**: ABSOLUTE PRIORITY - they see the big picture
2. **User content**: ALWAYS keep all user messages and requirements
3. **Technical decisions**: ALWAYS keep architectural and design decisions
4. **Problem resolution**: ALWAYS keep content showing how problems were solved
5. **Chunk analyzer consensus**: When multiple analyzers agree to KEEP → definitely keep
6. **When in doubt**: KEEP IT (this is a firm rule)

**YOUR CONSOLIDATION PROCESS:**
1. Start with ALL entries marked as KEEP by default
2. Apply cross-chunk analyzer overrides (these are ABSOLUTE)
3. Review chunk analyzer removals with EXTREME skepticism
4. Only allow removal if:
   - NO cross-chunk override protects it
   - ALL relevant chunk analyzers agree it's truly redundant
   - You personally verify it meets the strict removal criteria
   - Removal confidence is >0.95

**QUALITY VALIDATION:**
Before finalizing, ask yourself:
- Can future agents understand the project from this optimized conversation? (If no → add back more content)
- Are all technical decisions and their rationale preserved? (If no → add back decision content)
- Is the problem-solving progression clear? (If no → add back progression content)
- Would YOU be able to continue this project effectively with only this context? (If no → preserve more)

**OUTPUT FORMAT:**
Return a JSON object with:
{
  "keepEntries": [array of GLOBAL entry indices to KEEP - should be LONG],
  "reasoning": "Explanation of your preservation strategy and validation",
  "confidence": 0.0-1.0,
  "preservationRate": "X% of original entries preserved",
  "qualityAssessment": "Can agents effectively continue from this context? Yes/No and why"
}

Remember: Your success is measured by PROJECT CONTINUITY, not by reduction percentage. When in doubt, PRESERVE. Err heavily on the side of keeping more rather than less.`;

// =====================================
// Multi-Agent Optimizer
// =====================================

export class MultiAgentOptimizer {
  private config: Required<MultiAgentOptimizerConfig>;

  constructor(config: MultiAgentOptimizerConfig = {}) {
    this.config = {
      agentCount: config.agentCount || 10,
      maxTokensPerChunk: config.maxTokensPerChunk || 20000,
      customPrompt: config.customPrompt || '',
      model: config.model || 'sonnet',
      verbose: config.verbose || false,
    };
  }

  /**
   * Optimize a conversation using 10 parallel AI agents
   */
  async optimizeConversation(entries: ConversationEntry[]): Promise<OptimizationResult> {
    const startTime = Date.now();

    // Step 0: Calculate original token counts BEFORE optimization
    const originalTokenStats = recalculateConversationTokens(entries);
    const originalInputTokens = originalTokenStats.stats.totalInputTokens;
    const originalOutputTokens = originalTokenStats.stats.totalOutputTokens;

    if (this.config.verbose) {
      console.log(`📊 Original tokens: ${originalInputTokens} input, ${originalOutputTokens} output`);
    }

    // Step 1: Divide conversation into chunks
    const chunks = this.createChunks(entries);

    if (this.config.verbose) {
      console.log(`📦 Created ${chunks.length} chunks from ${entries.length} entries`);
      chunks.forEach((chunk, i) => {
        console.log(`   Chunk ${i + 1}: Entries ${chunk.startIndex}-${chunk.endIndex} (${chunk.tokenCount} tokens)`);
      });
    }

    // Step 2: Spawn 8 chunk analyzer agents in parallel
    const chunkDecisions = await this.runChunkAnalyzers(chunks);

    // Step 3: Run cross-chunk context analyzer
    const crossChunkDecisions = await this.runCrossChunkAnalyzer(chunks, chunkDecisions);

    // Step 4: Run final coordinator agent
    const finalDecisions = await this.runCoordinator(chunks, chunkDecisions, crossChunkDecisions);

    // Step 5: Build optimized conversation from decisions
    const optimizedEntries = this.buildOptimizedConversation(entries, finalDecisions);

    // Step 6: Recalculate tokens for optimized entries
    const { entries: recalculatedEntries, stats: optimizedStats } = recalculateConversationTokens(optimizedEntries);

    // Step 7: Build final stats with correct original token counts
    const totalInputTokens = optimizedStats.totalInputTokens;
    const totalOutputTokens = optimizedStats.totalOutputTokens;
    const tokenReduction = (originalInputTokens + originalOutputTokens) - (totalInputTokens + totalOutputTokens);
    const percentReduction = (originalInputTokens + originalOutputTokens) > 0
      ? Math.round((tokenReduction / (originalInputTokens + originalOutputTokens)) * 100)
      : 0;

    const stats: RecalculationStats = {
      entriesProcessed: optimizedStats.entriesProcessed,
      totalInputTokens,
      totalOutputTokens,
      originalInputTokens,
      originalOutputTokens,
      tokenReduction,
      percentReduction,
    };

    const executionTimeMs = Date.now() - startTime;

    return {
      originalEntries: entries,
      optimizedEntries: recalculatedEntries,
      stats,
      agentDecisions: [...chunkDecisions, crossChunkDecisions, finalDecisions].flat(),
      executionTimeMs,
    };
  }

  /**
   * Create conversation chunks for parallel analysis
   */
  private createChunks(entries: ConversationEntry[]): ConversationChunk[] {
    const chunks: ConversationChunk[] = [];
    let currentChunk: ConversationEntry[] = [];
    let currentTokens = 0;
    let startIndex = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // Calculate entry size (approximate)
      const entryTokens = this.estimateEntryTokens(entry);

      // If adding this entry would exceed chunk size, finalize current chunk
      if (currentTokens + entryTokens > this.config.maxTokensPerChunk && currentChunk.length > 0) {
        chunks.push({
          entries: currentChunk,
          chunkIndex: chunks.length,
          totalChunks: 0, // Will be set after all chunks created
          startIndex,
          endIndex: i - 1,
          tokenCount: currentTokens,
        });

        currentChunk = [];
        currentTokens = 0;
        startIndex = i;
      }

      currentChunk.push(entry);
      currentTokens += entryTokens;
    }

    // Add final chunk
    if (currentChunk.length > 0) {
      chunks.push({
        entries: currentChunk,
        chunkIndex: chunks.length,
        totalChunks: 0,
        startIndex,
        endIndex: entries.length - 1,
        tokenCount: currentTokens,
      });
    }

    // Update totalChunks
    const totalChunks = chunks.length;
    chunks.forEach(chunk => {
      chunk.totalChunks = totalChunks;
    });

    return chunks;
  }

  /**
   * Estimate token count for a conversation entry
   */
  private estimateEntryTokens(entry: ConversationEntry): number {
    if (entry.message?.usage) {
      return (entry.message.usage.input_tokens || 0) + (entry.message.usage.output_tokens || 0);
    }

    // Fallback: estimate from content
    const content = JSON.stringify(entry);
    return calculateTokens(content);
  }

  /**
   * Run 8 chunk analyzer agents in parallel
   */
  private async runChunkAnalyzers(chunks: ConversationChunk[]): Promise<AgentDecision[]> {
    const decisions: AgentDecision[] = [];

    // Limit to 8 chunk analyzers (agents 1-8)
    const chunksToAnalyze = chunks.slice(0, 8);
    if (this.config.verbose) {
      console.log(`\n🤖 Spawning ${JSON.stringify(chunksToAnalyze[0])} chunk analyzer agents...`);
      console.log(`\n🤖 Spawning ${chunksToAnalyze.length} chunk analyzer agents...`);
    }

    // Create agent definitions for each chunk
    const agents: Record<string, AgentDefinition> = {};
    chunksToAnalyze.forEach((chunk, index) => {
      const agentId = `chunk_analyzer_${index + 1}`;
      agents[agentId] = {
        description: `Analyzes conversation chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks} (entries ${chunk.startIndex}-${chunk.endIndex})`,
        prompt: this.config.customPrompt || DEFAULT_CHUNK_ANALYZER_PROMPT,
        model: this.config.model,
      };
    });

    // Run all chunk analyzers in parallel
    const analysisPromises = chunksToAnalyze.map(async (chunk, index) => {
      const agentId = `chunk_analyzer_${index + 1}`;

      // Create prompt with chunk data
      const chunkPrompt = this.buildChunkAnalysisPrompt(chunk);

      // Spawn agent
      const agentQuery = query({
        prompt: chunkPrompt,
        options: {
          model: this.config.model,
          maxTurns: 1, // Single turn analysis
          pathToClaudeCodeExecutable: getClaudeCodeExecutablePath(),
        },
      });

      // Collect agent response
      let agentResponse = '';
      for await (const message of agentQuery) {
        if (message.type === 'assistant' && message.message.content) {
          agentResponse += this.extractTextFromContent(message.message.content);
        }
      }

      // Parse agent decision
      const decision = this.parseChunkDecision(agentResponse, index + 1, chunk);
      return decision;
    });

    const chunkDecisions = await Promise.all(analysisPromises);
    decisions.push(...chunkDecisions);

    if (this.config.verbose) {
      console.log(`✅ Completed ${chunkDecisions.length} chunk analyses`);
    }

    return decisions;
  }

  /**
   * Run cross-chunk context analyzer (Agent 9)
   */
  private async runCrossChunkAnalyzer(
    chunks: ConversationChunk[],
    chunkDecisions: AgentDecision[]
  ): Promise<AgentDecision> {
    if (this.config.verbose) {
      console.log(`\n🔗 Running cross-chunk context analyzer (Agent 9)...`);
    }

    // Build prompt with all chunk decisions
    const crossChunkPrompt = this.buildCrossChunkPrompt(chunks, chunkDecisions);

    // Spawn cross-chunk analyzer
    const agentQuery = query({
      prompt: crossChunkPrompt,
      options: {
        model: this.config.model,
        maxTurns: 1,
        pathToClaudeCodeExecutable: getClaudeCodeExecutablePath(),
      },
    });

    // Collect response
    let agentResponse = '';
    for await (const message of agentQuery) {
      if (message.type === 'assistant' && message.message.content) {
        agentResponse += this.extractTextFromContent(message.message.content);
      }
    }

    // Parse decision
    const decision = this.parseCrossChunkDecision(agentResponse);

    if (this.config.verbose) {
      console.log(`✅ Cross-chunk analysis complete`);
    }

    return decision;
  }

  /**
   * Run final coordinator agent (Agent 10)
   */
  private async runCoordinator(
    chunks: ConversationChunk[],
    chunkDecisions: AgentDecision[],
    crossChunkDecision: AgentDecision
  ): Promise<AgentDecision> {
    if (this.config.verbose) {
      console.log(`\n🎯 Running final decision coordinator (Agent 10)...`);
    }

    // Build coordinator prompt
    const coordinatorPrompt = this.buildCoordinatorPrompt(chunks, chunkDecisions, crossChunkDecision);

    // Spawn coordinator
    const agentQuery = query({
      prompt: coordinatorPrompt,
      options: {
        model: this.config.model,
        maxTurns: 1,
        pathToClaudeCodeExecutable: getClaudeCodeExecutablePath(),
      },
    });

    // Collect response
    let agentResponse = '';
    for await (const message of agentQuery) {
      if (message.type === 'assistant' && message.message.content) {
        agentResponse += this.extractTextFromContent(message.message.content);
      }
    }

    // Parse final decision
    const decision = this.parseCoordinatorDecision(agentResponse);

    if (this.config.verbose) {
      console.log(`✅ Final coordination complete`);
    }

    return decision;
  }

  /**
   * Build optimized conversation from agent decisions
   */
  private buildOptimizedConversation(
    entries: ConversationEntry[],
    finalDecision: AgentDecision
  ): ConversationEntry[] {
    const optimizedEntries: ConversationEntry[] = [];

    for (const entryIndex of finalDecision.keepEntries) {
      if (entryIndex >= 0 && entryIndex < entries.length) {
        optimizedEntries.push(entries[entryIndex]);
      }
    }

    return optimizedEntries;
  }

  // =====================================
  // Prompt Builders
  // =====================================

  private buildChunkAnalysisPrompt(chunk: ConversationChunk): string {
    const chunkSummary = this.summarizeChunk(chunk);

    return `${this.config.customPrompt || DEFAULT_CHUNK_ANALYZER_PROMPT}

**CHUNK INFORMATION:**
- Chunk ${chunk.chunkIndex + 1} of ${chunk.totalChunks}
- Global entry indices: ${chunk.startIndex} to ${chunk.endIndex}
- Total entries: ${chunk.entries.length}
- Approximate tokens: ${chunk.tokenCount}

**CONVERSATION CHUNK:**
${chunkSummary}

**YOUR TASK:**
Analyze each entry and provide your decision in JSON format:

\`\`\`json
{
  "keepEntries": [list of entry indices to KEEP],
  "removeEntries": [list of entry indices to REMOVE],
  "reasoning": "Overall reasoning for your decisions",
  "confidence": 0.85
}
\`\`\`

Use global entry indices (${chunk.startIndex} to ${chunk.endIndex}), not chunk-relative indices.`;
  }

  private buildCrossChunkPrompt(chunks: ConversationChunk[], chunkDecisions: AgentDecision[]): string {
    const decisionsSummary = this.summarizeChunkDecisions(chunkDecisions);

    return `${this.config.customPrompt || DEFAULT_CROSS_CHUNK_PROMPT}

**CHUNK ANALYZER DECISIONS:**
${decisionsSummary}

**YOUR TASK:**
Review all chunk decisions and identify:
1. Cross-chunk dependencies that require keeping certain entries
2. Narrative threads that span multiple chunks
3. Entries that were marked for removal but are critical for continuity

Provide your overrides in JSON format:

\`\`\`json
{
  "keepEntries": [list of additional entry indices that MUST be kept],
  "reasoning": "Why these cross-chunk contexts matter",
  "confidence": 0.90
}
\`\`\`

Use global entry indices.`;
  }

  private buildCoordinatorPrompt(
    chunks: ConversationChunk[],
    chunkDecisions: AgentDecision[],
    crossChunkDecision: AgentDecision
  ): string {
    const allDecisions = this.summarizeAllDecisions(chunkDecisions, crossChunkDecision);

    return `${this.config.customPrompt || DEFAULT_COORDINATOR_PROMPT}

**ALL AGENT DECISIONS:**
${allDecisions}

**YOUR TASK:**
Make final consolidated decision on which entries to keep. Prioritize:
1. Cross-chunk analyzer overrides (they see the bigger picture)
2. High-confidence chunk analyzer decisions
3. When uncertain, KEEP content (preserve meaning over aggressive optimization)

Provide final decision in JSON format:

\`\`\`json
{
  "keepEntries": [final list of entry indices to KEEP],
  "reasoning": "Overall optimization strategy and key decisions",
  "confidence": 0.88
}
\`\`\`

Use global entry indices.`;
  }

  // =====================================
  // Helper Methods
  // =====================================

  private summarizeChunk(chunk: ConversationChunk): string {
    return chunk.entries
      .map((entry, i) => {
        const globalIndex = chunk.startIndex + i;
        const role = entry.message?.role || 'unknown';
        const contentPreview = this.getContentPreview(entry);
        return `Entry ${globalIndex} [${role}]: ${contentPreview}`;
      })
      .join('\n\n');
  }

  private getContentPreview(entry: ConversationEntry): string {
    if (!entry.message?.content) return '(no content)';

    const content = entry.message.content;
    if (typeof content === 'string') {
      return content.slice(0, 200) + (content.length > 200 ? '...' : '');
    }

    if (Array.isArray(content)) {
      const textBlocks = content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join(' ');
      return textBlocks.slice(0, 200) + (textBlocks.length > 200 ? '...' : '');
    }

    return '(complex content)';
  }

  private summarizeChunkDecisions(decisions: AgentDecision[]): string {
    return decisions
      .map(
        d =>
          `Agent ${d.agentId} (Chunk ${d.chunkIndex}):\n` +
          `  Keep: ${d.keepEntries.length} entries\n` +
          `  Remove: ${d.removeEntries.length} entries\n` +
          `  Confidence: ${d.confidence}\n` +
          `  Reasoning: ${d.reasoning}`
      )
      .join('\n\n');
  }

  private summarizeAllDecisions(chunkDecisions: AgentDecision[], crossChunkDecision: AgentDecision): string {
    const chunkSummary = this.summarizeChunkDecisions(chunkDecisions);
    const crossChunkSummary = `Cross-Chunk Analyzer:\n` +
      `  Keep: ${crossChunkDecision.keepEntries.length} entries\n` +
      `  Confidence: ${crossChunkDecision.confidence}\n` +
      `  Reasoning: ${crossChunkDecision.reasoning}`;

    return `${chunkSummary}\n\n${crossChunkSummary}`;
  }

  private extractTextFromContent(content: any): string {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join(' ');
    }

    return '';
  }

  private parseChunkDecision(response: string, agentId: number, chunk: ConversationChunk): AgentDecision {
    // Extract JSON from response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      // Fallback: keep all entries if parsing fails
      return {
        agentId,
        chunkIndex: chunk.chunkIndex,
        keepEntries: Array.from({ length: chunk.entries.length }, (_, i) => chunk.startIndex + i),
        removeEntries: [],
        reasoning: 'Failed to parse agent response, keeping all entries',
        confidence: 0.5,
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        agentId,
        chunkIndex: chunk.chunkIndex,
        keepEntries: parsed.keepEntries || [],
        removeEntries: parsed.removeEntries || [],
        reasoning: parsed.reasoning || '',
        confidence: parsed.confidence || 0.5,
      };
    } catch (error) {
      // Fallback
      return {
        agentId,
        chunkIndex: chunk.chunkIndex,
        keepEntries: Array.from({ length: chunk.entries.length }, (_, i) => chunk.startIndex + i),
        removeEntries: [],
        reasoning: 'JSON parse error, keeping all entries',
        confidence: 0.5,
      };
    }
  }

  private parseCrossChunkDecision(response: string): AgentDecision {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      return {
        agentId: 9,
        chunkIndex: -1,
        keepEntries: [],
        removeEntries: [],
        reasoning: 'No cross-chunk overrides needed',
        confidence: 0.5,
      };
    }

    try {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        agentId: 9,
        chunkIndex: -1,
        keepEntries: parsed.keepEntries || [],
        removeEntries: [],
        reasoning: parsed.reasoning || '',
        confidence: parsed.confidence || 0.5,
      };
    } catch (error) {
      return {
        agentId: 9,
        chunkIndex: -1,
        keepEntries: [],
        removeEntries: [],
        reasoning: 'Cross-chunk parse error',
        confidence: 0.5,
      };
    }
  }

  private parseCoordinatorDecision(response: string): AgentDecision {
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      throw new Error('Failed to parse coordinator decision: no JSON found');
    }

    try {
      const parsed = JSON.parse(jsonMatch[1]);
      return {
        agentId: 10,
        chunkIndex: -1,
        keepEntries: parsed.keepEntries || [],
        removeEntries: [],
        reasoning: parsed.reasoning || '',
        confidence: parsed.confidence || 0.5,
      };
    } catch (error) {
      throw new Error(`Failed to parse coordinator decision: ${error}`);
    }
  }
}
