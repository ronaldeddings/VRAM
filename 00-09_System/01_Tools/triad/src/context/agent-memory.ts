// Agent Memory - Shared knowledge base between AI agents
// Phase 7.1: Agent Collaboration

import { config } from "../utils/config";

// Agent types
export type AgentType = "claude" | "codex" | "gemini";

// Knowledge types
export type KnowledgeType =
  | "fact"
  | "insight"
  | "question"
  | "hypothesis"
  | "recommendation"
  | "observation"
  | "pattern"
  | "correlation"
  | "disagreement"
  | "consensus";

// Agent strengths for routing
export interface AgentStrengths {
  agent: AgentType;
  strengths: string[];
  bestFor: string[];
  limitations: string[];
  preferredContextSize: "small" | "medium" | "large";
  creativityLevel: "conservative" | "balanced" | "creative";
}

// Knowledge item stored in shared memory
export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  content: string;
  summary: string;
  source: {
    agent: AgentType;
    iteration: number;
    timestamp: string;
    focusArea: string;
  };
  confidence: number;
  tags: string[];
  relatedTo: string[]; // Other knowledge item IDs
  validatedBy: AgentType[];
  disputedBy: AgentType[];
  status: "pending" | "validated" | "disputed" | "superseded";
  createdAt: string;
  updatedAt: string;
}

// Consensus tracking
export interface ConsensusItem {
  id: string;
  topic: string;
  positions: Array<{
    agent: AgentType;
    position: string;
    confidence: number;
    reasoning: string;
  }>;
  consensus: boolean;
  consensusStatement?: string;
  disagreementSummary?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Agent context for prompts
export interface AgentContext {
  recentInsights: KnowledgeItem[];
  openQuestions: KnowledgeItem[];
  consensusItems: ConsensusItem[];
  activeHypotheses: KnowledgeItem[];
  otherAgentFindings: Array<{
    agent: AgentType;
    summary: string;
    confidence: number;
  }>;
}

// Agent strengths definitions
const agentStrengthsMap: Record<AgentType, AgentStrengths> = {
  claude: {
    agent: "claude",
    strengths: [
      "nuanced analysis",
      "ethical reasoning",
      "creative synthesis",
      "conversational flow",
      "document analysis",
    ],
    bestFor: [
      "relationship analysis",
      "sentiment detection",
      "strategic recommendations",
      "content creation",
      "meeting summaries",
    ],
    limitations: [
      "real-time data",
      "code execution",
      "mathematical proofs",
    ],
    preferredContextSize: "large",
    creativityLevel: "balanced",
  },
  codex: {
    agent: "codex",
    strengths: [
      "code analysis",
      "structured data processing",
      "pattern recognition in data",
      "systematic analysis",
      "technical documentation",
    ],
    bestFor: [
      "data extraction",
      "structured output",
      "technical analysis",
      "system debugging",
      "configuration review",
    ],
    limitations: [
      "nuanced interpretation",
      "emotional intelligence",
      "creative writing",
    ],
    preferredContextSize: "medium",
    creativityLevel: "conservative",
  },
  gemini: {
    agent: "gemini",
    strengths: [
      "multimodal understanding",
      "broad knowledge synthesis",
      "rapid information processing",
      "cross-domain connections",
      "trend analysis",
    ],
    bestFor: [
      "research synthesis",
      "trend identification",
      "cross-referencing",
      "news analysis",
      "market insights",
    ],
    limitations: [
      "deep specialized analysis",
      "long-term context retention",
      "code generation",
    ],
    preferredContextSize: "large",
    creativityLevel: "creative",
  },
};

// Question routing rules
const questionRouting: Array<{
  patterns: RegExp[];
  preferredAgent: AgentType;
  fallbackAgent: AgentType;
  reason: string;
}> = [
  {
    patterns: [/relationship/i, /sentiment/i, /feel/i, /trust/i, /rapport/i],
    preferredAgent: "claude",
    fallbackAgent: "gemini",
    reason: "Claude excels at relationship and sentiment analysis",
  },
  {
    patterns: [/code/i, /data/i, /structure/i, /extract/i, /parse/i],
    preferredAgent: "codex",
    fallbackAgent: "claude",
    reason: "Codex is best for structured data and code analysis",
  },
  {
    patterns: [/trend/i, /market/i, /news/i, /industry/i, /competitor/i],
    preferredAgent: "gemini",
    fallbackAgent: "claude",
    reason: "Gemini excels at trend analysis and broad synthesis",
  },
  {
    patterns: [/strategic/i, /recommend/i, /should/i, /advice/i, /suggest/i],
    preferredAgent: "claude",
    fallbackAgent: "gemini",
    reason: "Claude provides nuanced strategic recommendations",
  },
  {
    patterns: [/summarize/i, /overview/i, /brief/i, /highlight/i],
    preferredAgent: "claude",
    fallbackAgent: "gemini",
    reason: "Claude generates high-quality summaries",
  },
];

class AgentMemory {
  private statePath: string;
  private memoryPath: string;

  constructor() {
    this.statePath = config.statePath;
    this.memoryPath = `${config.statePath}/agent-memory.json`;
  }

  // Get agent strengths
  getAgentStrengths(agent: AgentType): AgentStrengths {
    return agentStrengthsMap[agent];
  }

  // Route question to best agent
  routeQuestion(question: string): {
    preferredAgent: AgentType;
    fallbackAgent: AgentType;
    reason: string;
    confidence: number;
  } {
    for (const rule of questionRouting) {
      for (const pattern of rule.patterns) {
        if (pattern.test(question)) {
          return {
            preferredAgent: rule.preferredAgent,
            fallbackAgent: rule.fallbackAgent,
            reason: rule.reason,
            confidence: 0.8,
          };
        }
      }
    }

    // Default to Claude for general questions
    return {
      preferredAgent: "claude",
      fallbackAgent: "gemini",
      reason: "Default routing for general questions",
      confidence: 0.5,
    };
  }

  // Store knowledge item
  async storeKnowledge(item: Omit<KnowledgeItem, "id" | "createdAt" | "updatedAt">): Promise<KnowledgeItem> {
    const memory = await this.loadMemory();
    const now = new Date().toISOString();

    const newItem: KnowledgeItem = {
      ...item,
      id: `know-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      validatedBy: [],
      disputedBy: [],
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    memory.knowledge.push(newItem);
    await this.saveMemory(memory);

    return newItem;
  }

  // Extract knowledge from agent output
  async extractKnowledge(
    agentOutput: string,
    source: { agent: AgentType; iteration: number; focusArea: string }
  ): Promise<KnowledgeItem[]> {
    const items: KnowledgeItem[] = [];
    const now = new Date().toISOString();

    // Try to parse JSON knowledge blocks
    const jsonMatch = agentOutput.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.knowledge && Array.isArray(parsed.knowledge)) {
          for (const k of parsed.knowledge) {
            const item = await this.storeKnowledge({
              type: k.type || "insight",
              content: k.content || k.insight || "",
              summary: k.summary || k.content?.substring(0, 100) || "",
              source: {
                agent: source.agent,
                iteration: source.iteration,
                timestamp: now,
                focusArea: source.focusArea,
              },
              confidence: k.confidence || 0.6,
              tags: k.tags || [],
              relatedTo: k.relatedTo || [],
            });
            items.push(item);
          }
        }
      } catch {
        // Fall back to text extraction
      }
    }

    // Extract insights from text
    const insightPatterns = [
      /insight[:\s]+([^\n]+)/gi,
      /found that[:\s]+([^\n]+)/gi,
      /discovered[:\s]+([^\n]+)/gi,
      /observation[:\s]+([^\n]+)/gi,
      /pattern[:\s]+([^\n]+)/gi,
    ];

    for (const pattern of insightPatterns) {
      const matches = agentOutput.matchAll(pattern);
      for (const match of matches) {
        const content = match[1].trim();
        if (content.length > 20 && content.length < 500) {
          const item = await this.storeKnowledge({
            type: this.detectKnowledgeType(content),
            content,
            summary: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
            source: {
              agent: source.agent,
              iteration: source.iteration,
              timestamp: now,
              focusArea: source.focusArea,
            },
            confidence: 0.6,
            tags: this.extractTags(content),
            relatedTo: [],
          });
          items.push(item);
        }
      }
    }

    // Extract questions
    const questionPattern = /\?[^.!?]*$/gm;
    const questions = agentOutput.match(questionPattern);
    if (questions) {
      for (const q of questions.slice(0, 3)) {
        const item = await this.storeKnowledge({
          type: "question",
          content: q.trim(),
          summary: q.trim(),
          source: {
            agent: source.agent,
            iteration: source.iteration,
            timestamp: now,
            focusArea: source.focusArea,
          },
          confidence: 0.5,
          tags: ["open_question"],
          relatedTo: [],
        });
        items.push(item);
      }
    }

    return items;
  }

  // Detect knowledge type from content
  private detectKnowledgeType(content: string): KnowledgeType {
    const lowerContent = content.toLowerCase();

    if (/hypothesis|might|could be|possibly|if.*then/i.test(content)) {
      return "hypothesis";
    }
    if (/recommend|suggest|should|consider/i.test(content)) {
      return "recommendation";
    }
    if (/pattern|recurring|consistently|always|trend/i.test(content)) {
      return "pattern";
    }
    if (/correlation|related|connected|linked/i.test(content)) {
      return "correlation";
    }
    if (/observed|noticed|saw|found/i.test(content)) {
      return "observation";
    }
    if (/\?/.test(content)) {
      return "question";
    }

    return "insight";
  }

  // Extract tags from content
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    const lowerContent = content.toLowerCase();

    // Domain tags
    if (/revenue|sales|sponsor|money|budget/i.test(content)) tags.push("revenue");
    if (/client|customer|relationship/i.test(content)) tags.push("relationships");
    if (/team|employee|staff|colleague/i.test(content)) tags.push("team");
    if (/content|podcast|episode|show/i.test(content)) tags.push("content");
    if (/email|message|communication/i.test(content)) tags.push("communications");
    if (/meeting|call|discussion/i.test(content)) tags.push("meetings");
    if (/family|personal|life/i.test(content)) tags.push("personal");

    // Urgency tags
    if (/urgent|immediately|asap|critical/i.test(content)) tags.push("urgent");
    if (/opportunity|potential|growth/i.test(content)) tags.push("opportunity");
    if (/risk|warning|concern|issue/i.test(content)) tags.push("risk");

    return tags;
  }

  // Validate knowledge item (agent agrees)
  async validateKnowledge(knowledgeId: string, validatingAgent: AgentType): Promise<void> {
    const memory = await this.loadMemory();
    const item = memory.knowledge.find(k => k.id === knowledgeId);

    if (item) {
      if (!item.validatedBy.includes(validatingAgent)) {
        item.validatedBy.push(validatingAgent);
      }
      // Remove from disputed if previously disputed
      item.disputedBy = item.disputedBy.filter(a => a !== validatingAgent);
      item.updatedAt = new Date().toISOString();

      // Check for consensus (2+ agents agree)
      if (item.validatedBy.length >= 2) {
        item.status = "validated";
        item.confidence = Math.min(1.0, item.confidence + 0.15);
      }

      await this.saveMemory(memory);
    }
  }

  // Dispute knowledge item (agent disagrees)
  async disputeKnowledge(knowledgeId: string, disputingAgent: AgentType, reason?: string): Promise<void> {
    const memory = await this.loadMemory();
    const item = memory.knowledge.find(k => k.id === knowledgeId);

    if (item) {
      if (!item.disputedBy.includes(disputingAgent)) {
        item.disputedBy.push(disputingAgent);
      }
      // Remove from validated if previously validated
      item.validatedBy = item.validatedBy.filter(a => a !== disputingAgent);
      item.updatedAt = new Date().toISOString();

      // Check for disputed status (2+ agents disagree)
      if (item.disputedBy.length >= 2) {
        item.status = "disputed";
        item.confidence = Math.max(0.1, item.confidence - 0.2);
      }

      await this.saveMemory(memory);
    }
  }

  // Get context for an agent
  async getAgentContext(forAgent: AgentType, focusArea: string): Promise<AgentContext> {
    const memory = await this.loadMemory();

    // Get recent insights from other agents
    const recentInsights = memory.knowledge
      .filter(k =>
        k.source.agent !== forAgent &&
        k.status !== "disputed" &&
        k.type === "insight"
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Get open questions
    const openQuestions = memory.knowledge
      .filter(k => k.type === "question" && k.status === "pending")
      .slice(0, 5);

    // Get active hypotheses
    const activeHypotheses = memory.knowledge
      .filter(k => k.type === "hypothesis" && k.status !== "superseded")
      .slice(0, 5);

    // Get consensus items
    const consensusItems = memory.consensus
      .filter(c => !c.resolvedAt)
      .slice(0, 5);

    // Summarize other agents' findings
    const otherAgentFindings: AgentContext["otherAgentFindings"] = [];
    const agents: AgentType[] = ["claude", "codex", "gemini"];

    for (const agent of agents) {
      if (agent !== forAgent) {
        const agentInsights = memory.knowledge
          .filter(k => k.source.agent === agent && k.status !== "disputed")
          .slice(0, 5);

        if (agentInsights.length > 0) {
          const avgConfidence = agentInsights.reduce((sum, i) => sum + i.confidence, 0) / agentInsights.length;
          otherAgentFindings.push({
            agent,
            summary: `${agent} found ${agentInsights.length} insights including: ${agentInsights.map(i => i.summary).join(", ")}`,
            confidence: avgConfidence,
          });
        }
      }
    }

    return {
      recentInsights,
      openQuestions,
      consensusItems,
      activeHypotheses,
      otherAgentFindings,
    };
  }

  // Generate context prompt for agent
  async generateContextPrompt(forAgent: AgentType, focusArea: string): Promise<string> {
    const context = await this.getAgentContext(forAgent, focusArea);
    const strengths = this.getAgentStrengths(forAgent);

    let prompt = `## Your Role as ${forAgent.toUpperCase()}

You excel at: ${strengths.strengths.join(", ")}
Best suited for: ${strengths.bestFor.join(", ")}

## Previous Agent Findings

`;

    if (context.otherAgentFindings.length > 0) {
      for (const finding of context.otherAgentFindings) {
        prompt += `### ${finding.agent.toUpperCase()} (confidence: ${Math.round(finding.confidence * 100)}%)
${finding.summary}

`;
      }
    } else {
      prompt += "No previous findings from other agents yet.\n\n";
    }

    if (context.recentInsights.length > 0) {
      prompt += `## Recent Insights to Build On

${context.recentInsights.map(i => `- ${i.summary} (${i.source.agent}, confidence: ${Math.round(i.confidence * 100)}%)`).join("\n")}

`;
    }

    if (context.openQuestions.length > 0) {
      prompt += `## Open Questions to Investigate

${context.openQuestions.map(q => `- ${q.content}`).join("\n")}

`;
    }

    if (context.activeHypotheses.length > 0) {
      prompt += `## Hypotheses to Validate or Challenge

${context.activeHypotheses.map(h => `- ${h.summary} (proposed by ${h.source.agent})`).join("\n")}

`;
    }

    prompt += `## Instructions

1. Build on previous findings where relevant
2. If you disagree with a previous finding, explain why
3. If you validate a previous finding, note that you agree
4. Propose new hypotheses based on your analysis
5. Record any questions that emerge

Output your findings in a structured format with clear confidence levels.
`;

    return prompt;
  }

  // Track consensus/disagreement
  async trackConsensus(
    topic: string,
    agent: AgentType,
    position: string,
    confidence: number,
    reasoning: string
  ): Promise<ConsensusItem> {
    const memory = await this.loadMemory();

    // Find existing consensus item for this topic
    let consensusItem = memory.consensus.find(
      c => c.topic.toLowerCase() === topic.toLowerCase() && !c.resolvedAt
    );

    if (!consensusItem) {
      consensusItem = {
        id: `cons-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        topic,
        positions: [],
        consensus: false,
        createdAt: new Date().toISOString(),
      };
      memory.consensus.push(consensusItem);
    }

    // Add or update position
    const existingPosition = consensusItem.positions.find(p => p.agent === agent);
    if (existingPosition) {
      existingPosition.position = position;
      existingPosition.confidence = confidence;
      existingPosition.reasoning = reasoning;
    } else {
      consensusItem.positions.push({ agent, position, confidence, reasoning });
    }

    // Check for consensus (all agents agree on similar position)
    if (consensusItem.positions.length >= 2) {
      const positions = consensusItem.positions.map(p => p.position.toLowerCase());
      const allSimilar = positions.every(p => this.positionsSimilar(p, positions[0]));

      if (allSimilar) {
        consensusItem.consensus = true;
        consensusItem.consensusStatement = `Agents agree: ${consensusItem.positions[0].position}`;
        consensusItem.resolvedAt = new Date().toISOString();
      } else if (consensusItem.positions.length >= 3) {
        // Check for majority
        const positionCounts = new Map<string, number>();
        for (const p of positions) {
          positionCounts.set(p, (positionCounts.get(p) || 0) + 1);
        }
        const maxCount = Math.max(...positionCounts.values());
        if (maxCount >= 2) {
          consensusItem.consensus = true;
          const majorityPosition = [...positionCounts.entries()].find(([_, count]) => count === maxCount)?.[0];
          consensusItem.consensusStatement = `Majority agrees: ${majorityPosition}`;
        }
      }
    }

    await this.saveMemory(memory);
    return consensusItem;
  }

  // Check if positions are similar
  private positionsSimilar(pos1: string, pos2: string): boolean {
    // Simple similarity check
    const words1 = new Set(pos1.split(/\s+/));
    const words2 = new Set(pos2.split(/\s+/));
    const intersection = [...words1].filter(w => words2.has(w));
    const similarity = intersection.length / Math.max(words1.size, words2.size);
    return similarity > 0.5;
  }

  // Get knowledge items
  async getKnowledge(filters?: {
    type?: KnowledgeType;
    agent?: AgentType;
    status?: KnowledgeItem["status"];
    tag?: string;
    limit?: number;
  }): Promise<KnowledgeItem[]> {
    const memory = await this.loadMemory();
    let items = memory.knowledge;

    if (filters?.type) {
      items = items.filter(k => k.type === filters.type);
    }
    if (filters?.agent) {
      items = items.filter(k => k.source.agent === filters.agent);
    }
    if (filters?.status) {
      items = items.filter(k => k.status === filters.status);
    }
    if (filters?.tag) {
      items = items.filter(k => k.tags.includes(filters.tag));
    }

    items = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (filters?.limit) {
      items = items.slice(0, filters.limit);
    }

    return items;
  }

  // Get consensus items
  async getConsensusItems(resolved?: boolean): Promise<ConsensusItem[]> {
    const memory = await this.loadMemory();
    let items = memory.consensus;

    if (resolved !== undefined) {
      items = items.filter(c => resolved ? c.resolvedAt : !c.resolvedAt);
    }

    return items;
  }

  // Load memory from file
  private async loadMemory(): Promise<{
    knowledge: KnowledgeItem[];
    consensus: ConsensusItem[];
  }> {
    try {
      const file = Bun.file(this.memoryPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }

    return { knowledge: [], consensus: [] };
  }

  // Save memory to file
  private async saveMemory(memory: { knowledge: KnowledgeItem[]; consensus: ConsensusItem[] }): Promise<void> {
    await Bun.write(this.memoryPath, JSON.stringify(memory, null, 2));
  }

  // Clean up old memory items
  async cleanupOldMemory(maxAgeDays: number = 30): Promise<number> {
    const memory = await this.loadMemory();
    const cutoff = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000).toISOString();

    const initialCount = memory.knowledge.length;

    // Remove old items that are not validated
    memory.knowledge = memory.knowledge.filter(
      k => k.createdAt > cutoff || k.status === "validated"
    );

    await this.saveMemory(memory);

    return initialCount - memory.knowledge.length;
  }

  // Get memory statistics
  async getStats(): Promise<{
    totalKnowledge: number;
    byType: Record<KnowledgeType, number>;
    byAgent: Record<AgentType, number>;
    byStatus: Record<string, number>;
    consensusItems: number;
    resolvedConsensus: number;
  }> {
    const memory = await this.loadMemory();

    const byType: Record<string, number> = {};
    const byAgent: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const item of memory.knowledge) {
      byType[item.type] = (byType[item.type] || 0) + 1;
      byAgent[item.source.agent] = (byAgent[item.source.agent] || 0) + 1;
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    }

    return {
      totalKnowledge: memory.knowledge.length,
      byType: byType as Record<KnowledgeType, number>,
      byAgent: byAgent as Record<AgentType, number>,
      byStatus,
      consensusItems: memory.consensus.length,
      resolvedConsensus: memory.consensus.filter(c => c.resolvedAt).length,
    };
  }
}

export const agentMemory = new AgentMemory();
