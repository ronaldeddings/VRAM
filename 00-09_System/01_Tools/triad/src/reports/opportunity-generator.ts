// Opportunity Generator - Extract and write opportunity cards
// Phase 4.2: Opportunity card generation from agent outputs

import { config } from "../utils/config";
import {
  RevenueSignal,
  RevenueCategory,
  RevenueStage,
  RevenueUrgency,
  revenueAnalyzer,
} from "../prompts/revenue-analyzer";

export interface OpportunityCard {
  id: string;
  type: "revenue" | "relationship" | "content" | "efficiency" | "risk";
  title: string;
  description: string;
  source: {
    agent: string;
    iteration: number;
    timestamp: string;
    outputFile?: string;
  };
  category?: RevenueCategory;
  stage?: RevenueStage;
  urgency: "immediate" | "this_week" | "this_month" | "this_quarter" | "long_term";
  priority: "critical" | "high" | "medium" | "low";
  estimatedValue?: number;
  contact?: string;
  company?: string;
  signals: string[];
  suggestedActions: string[];
  confidence: number;
  status: "new" | "reviewed" | "actioned" | "dismissed";
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  actionedAt?: string;
}

export interface OpportunityIndex {
  cards: OpportunityCard[];
  stats: {
    total: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    totalEstimatedValue: number;
  };
  lastUpdated: string;
}

// Patterns for extracting opportunities from agent outputs
const opportunityPatterns = {
  revenue: {
    triggers: [
      /opportunity.*\$[\d,]+/gi,
      /revenue.*potential/gi,
      /monetiz/gi,
      /sponsor.*interest/gi,
      /consulting.*engagement/gi,
      /speaking.*fee/gi,
      /partnership.*proposal/gi,
    ],
    valuePattern: /\$[\d,]+(?:\.\d{2})?|\d+(?:,\d{3})*\s*(?:dollars|USD)/gi,
  },
  relationship: {
    triggers: [
      /reconnect.*with/gi,
      /follow.*up.*with/gi,
      /reach.*out.*to/gi,
      /relationship.*nurture/gi,
      /high.*value.*contact/gi,
      /dormant.*relationship/gi,
    ],
  },
  content: {
    triggers: [
      /content.*idea/gi,
      /episode.*topic/gi,
      /blog.*post.*about/gi,
      /trending.*topic/gi,
      /audience.*interest/gi,
    ],
  },
  efficiency: {
    triggers: [
      /automate/gi,
      /streamline/gi,
      /optimize.*process/gi,
      /save.*time/gi,
      /improve.*workflow/gi,
    ],
  },
  risk: {
    triggers: [
      /risk.*identified/gi,
      /concern.*about/gi,
      /potential.*issue/gi,
      /warning/gi,
      /attention.*needed/gi,
    ],
  },
};

export class OpportunityGenerator {
  private reportsPath: string;
  private statePath: string;
  private opportunitiesPath: string;

  constructor() {
    this.reportsPath = config.reportsPath;
    this.statePath = config.statePath;
    this.opportunitiesPath = `${this.reportsPath}/opportunities`;
  }

  async init(): Promise<void> {
    // Ensure opportunities directory exists
    const dir = Bun.file(this.opportunitiesPath);
    try {
      await Bun.$`mkdir -p ${this.opportunitiesPath}`;
    } catch {
      // Directory might already exist
    }
  }

  // Extract opportunities from agent output text
  extractOpportunities(
    output: string,
    agent: string,
    iteration: number
  ): Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] {
    const opportunities: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] = [];

    // Try to parse JSON blocks from output
    const jsonBlocks = this.extractJsonBlocks(output);
    for (const block of jsonBlocks) {
      const parsed = this.parseOpportunityJson(block, agent, iteration);
      if (parsed) {
        opportunities.push(...parsed);
      }
    }

    // Also scan for natural language patterns
    const nlOpportunities = this.extractNaturalLanguageOpportunities(output, agent, iteration);
    opportunities.push(...nlOpportunities);

    return opportunities;
  }

  private extractJsonBlocks(text: string): string[] {
    const blocks: string[] = [];
    const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/g;
    let match;

    while ((match = jsonRegex.exec(text)) !== null) {
      blocks.push(match[1]);
    }

    // Also try to find standalone JSON objects
    const standaloneRegex = /\{[\s\S]*?"opportunities"[\s\S]*?\}/g;
    while ((match = standaloneRegex.exec(text)) !== null) {
      if (!blocks.includes(match[0])) {
        blocks.push(match[0]);
      }
    }

    return blocks;
  }

  private parseOpportunityJson(
    json: string,
    agent: string,
    iteration: number
  ): Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] | null {
    try {
      const parsed = JSON.parse(json);
      const opportunities: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] = [];

      // Handle various JSON formats
      const items = parsed.opportunities || parsed.hotOpportunities || parsed.items || [];

      for (const item of items) {
        const opp: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status"> = {
          type: this.inferType(item),
          title: item.company || item.title || item.summary || "Opportunity",
          description: item.summary || item.description || item.proposal || "",
          source: {
            agent,
            iteration,
            timestamp: new Date().toISOString(),
          },
          category: item.category,
          stage: item.stage,
          urgency: this.normalizeUrgency(item.urgency),
          priority: this.calculatePriority(item),
          estimatedValue: this.parseValue(item.estimatedValue || item.potentialValue || item.estimatedFee),
          contact: item.contact,
          company: item.company || item.partner || item.event,
          signals: item.signals || [],
          suggestedActions: this.extractActions(item),
          confidence: item.confidence || 0.7,
        };

        opportunities.push(opp);
      }

      return opportunities.length > 0 ? opportunities : null;
    } catch {
      return null;
    }
  }

  private extractNaturalLanguageOpportunities(
    text: string,
    agent: string,
    iteration: number
  ): Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] {
    const opportunities: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const [type, patterns] of Object.entries(opportunityPatterns)) {
        for (const trigger of patterns.triggers) {
          if (trigger.test(line)) {
            // Extract context (surrounding lines)
            const contextStart = Math.max(0, i - 2);
            const contextEnd = Math.min(lines.length, i + 3);
            const context = lines.slice(contextStart, contextEnd).join("\n");

            // Extract value if present
            let value: number | undefined;
            if (type === "revenue" && opportunityPatterns.revenue.valuePattern) {
              const valueMatch = line.match(opportunityPatterns.revenue.valuePattern);
              if (valueMatch) {
                value = this.parseValue(valueMatch[0]);
              }
            }

            // Extract company/contact mentions
            const companyMatch = line.match(/(?:from|with|at|for)\s+([A-Z][a-zA-Z\s]+(?:Inc|Corp|LLC|Ltd)?)/);
            const contactMatch = line.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);

            const opp: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status"> = {
              type: type as OpportunityCard["type"],
              title: this.generateTitle(line, type),
              description: context,
              source: {
                agent,
                iteration,
                timestamp: new Date().toISOString(),
              },
              urgency: this.inferUrgency(context),
              priority: value && value > 10000 ? "high" : "medium",
              estimatedValue: value,
              company: companyMatch?.[1],
              contact: contactMatch?.[1],
              signals: [line.trim()],
              suggestedActions: this.generateActions(type, line),
              confidence: 0.6,
            };

            opportunities.push(opp);
            break; // Only count once per line
          }
        }
      }
    }

    // Deduplicate similar opportunities
    return this.deduplicateOpportunities(opportunities);
  }

  private inferType(item: Record<string, unknown>): OpportunityCard["type"] {
    if (item.category || item.estimatedValue || item.revenue) return "revenue";
    if (item.contact || item.relationship) return "relationship";
    if (item.topic || item.content || item.episode) return "content";
    if (item.process || item.workflow || item.automation) return "efficiency";
    if (item.risk || item.warning || item.concern) return "risk";
    return "revenue"; // Default
  }

  private normalizeUrgency(urgency: string | undefined): OpportunityCard["urgency"] {
    if (!urgency) return "this_month";
    const lower = urgency.toLowerCase();
    if (lower.includes("immediate") || lower.includes("urgent") || lower.includes("asap")) return "immediate";
    if (lower.includes("week")) return "this_week";
    if (lower.includes("month")) return "this_month";
    if (lower.includes("quarter")) return "this_quarter";
    return "long_term";
  }

  private calculatePriority(item: Record<string, unknown>): OpportunityCard["priority"] {
    const value = this.parseValue(item.estimatedValue || item.potentialValue);
    const confidence = (item.confidence as number) || 0.5;
    const urgency = this.normalizeUrgency(item.urgency as string);

    // Score based on multiple factors
    let score = 0;

    if (value) {
      if (value >= 50000) score += 4;
      else if (value >= 20000) score += 3;
      else if (value >= 5000) score += 2;
      else score += 1;
    }

    if (urgency === "immediate") score += 3;
    else if (urgency === "this_week") score += 2;
    else if (urgency === "this_month") score += 1;

    if (confidence >= 0.9) score += 2;
    else if (confidence >= 0.7) score += 1;

    if (score >= 7) return "critical";
    if (score >= 5) return "high";
    if (score >= 3) return "medium";
    return "low";
  }

  private parseValue(value: unknown): number | undefined {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[$,\s]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  private extractActions(item: Record<string, unknown>): string[] {
    const actions: string[] = [];
    if (item.nextAction) actions.push(item.nextAction as string);
    if (item.suggestedAction) actions.push(item.suggestedAction as string);
    if (item.action) actions.push(item.action as string);
    if (Array.isArray(item.recommendations)) {
      actions.push(...(item.recommendations as string[]));
    }
    return actions;
  }

  private generateTitle(line: string, type: string): string {
    // Truncate and clean up for title
    const cleaned = line.replace(/[#*`]/g, "").trim();
    if (cleaned.length > 60) {
      return cleaned.substring(0, 57) + "...";
    }
    return cleaned || `${type.charAt(0).toUpperCase() + type.slice(1)} Opportunity`;
  }

  private inferUrgency(context: string): OpportunityCard["urgency"] {
    const lower = context.toLowerCase();
    if (lower.includes("urgent") || lower.includes("immediately") || lower.includes("asap")) return "immediate";
    if (lower.includes("this week") || lower.includes("by friday")) return "this_week";
    if (lower.includes("this month") || lower.includes("end of month")) return "this_month";
    if (lower.includes("this quarter") || lower.includes("q1") || lower.includes("q2")) return "this_quarter";
    return "long_term";
  }

  private generateActions(type: string, line: string): string[] {
    switch (type) {
      case "revenue":
        return ["Review opportunity details", "Prepare proposal or quote", "Schedule follow-up call"];
      case "relationship":
        return ["Send reconnection email", "Schedule catch-up call", "Add to CRM for tracking"];
      case "content":
        return ["Add to content calendar", "Research topic further", "Draft outline"];
      case "efficiency":
        return ["Document current process", "Identify automation tools", "Create improvement plan"];
      case "risk":
        return ["Assess impact and likelihood", "Develop mitigation strategy", "Monitor closely"];
      default:
        return ["Review and take action"];
    }
  }

  private deduplicateOpportunities(
    opportunities: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[]
  ): Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">[] {
    const seen = new Set<string>();
    return opportunities.filter(opp => {
      const key = `${opp.type}-${opp.company || ""}-${opp.contact || ""}-${opp.title.substring(0, 30)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Save opportunity card to file and index
  async saveOpportunity(
    opportunity: Omit<OpportunityCard, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<OpportunityCard> {
    const now = new Date().toISOString();
    const card: OpportunityCard = {
      ...opportunity,
      id: `opp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    // Save individual card
    const cardPath = `${this.opportunitiesPath}/${card.id}.json`;
    await Bun.write(cardPath, JSON.stringify(card, null, 2));

    // Update index
    await this.updateIndex(card);

    return card;
  }

  // Update opportunities index
  private async updateIndex(newCard: OpportunityCard): Promise<void> {
    const indexPath = `${this.opportunitiesPath}/index.json`;
    let index: OpportunityIndex;

    try {
      const file = Bun.file(indexPath);
      if (await file.exists()) {
        index = await file.json();
      } else {
        index = this.createEmptyIndex();
      }
    } catch {
      index = this.createEmptyIndex();
    }

    // Add or update card in index
    const existingIdx = index.cards.findIndex(c => c.id === newCard.id);
    if (existingIdx >= 0) {
      index.cards[existingIdx] = newCard;
    } else {
      index.cards.unshift(newCard);
    }

    // Keep only last 500 cards in index
    if (index.cards.length > 500) {
      index.cards = index.cards.slice(0, 500);
    }

    // Recalculate stats
    index.stats = this.calculateStats(index.cards);
    index.lastUpdated = new Date().toISOString();

    await Bun.write(indexPath, JSON.stringify(index, null, 2));
  }

  private createEmptyIndex(): OpportunityIndex {
    return {
      cards: [],
      stats: {
        total: 0,
        byType: {},
        byPriority: {},
        byStatus: {},
        totalEstimatedValue: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateStats(cards: OpportunityCard[]): OpportunityIndex["stats"] {
    const stats: OpportunityIndex["stats"] = {
      total: cards.length,
      byType: {},
      byPriority: {},
      byStatus: {},
      totalEstimatedValue: 0,
    };

    for (const card of cards) {
      stats.byType[card.type] = (stats.byType[card.type] || 0) + 1;
      stats.byPriority[card.priority] = (stats.byPriority[card.priority] || 0) + 1;
      stats.byStatus[card.status] = (stats.byStatus[card.status] || 0) + 1;
      if (card.estimatedValue) {
        stats.totalEstimatedValue += card.estimatedValue;
      }
    }

    return stats;
  }

  // Get opportunities for API
  async getOpportunities(filters?: {
    type?: OpportunityCard["type"];
    priority?: OpportunityCard["priority"];
    status?: OpportunityCard["status"];
    limit?: number;
  }): Promise<OpportunityCard[]> {
    const indexPath = `${this.opportunitiesPath}/index.json`;

    try {
      const file = Bun.file(indexPath);
      if (!(await file.exists())) {
        return [];
      }

      const index: OpportunityIndex = await file.json();
      let cards = index.cards;

      // Apply filters
      if (filters?.type) {
        cards = cards.filter(c => c.type === filters.type);
      }
      if (filters?.priority) {
        cards = cards.filter(c => c.priority === filters.priority);
      }
      if (filters?.status) {
        cards = cards.filter(c => c.status === filters.status);
      }

      // Sort by priority and urgency
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const urgencyOrder = { immediate: 0, this_week: 1, this_month: 2, this_quarter: 3, long_term: 4 };

      cards.sort((a, b) => {
        const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (pDiff !== 0) return pDiff;
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });

      // Apply limit
      if (filters?.limit) {
        cards = cards.slice(0, filters.limit);
      }

      return cards;
    } catch {
      return [];
    }
  }

  // Get today's opportunities
  async getTodayOpportunities(): Promise<OpportunityCard[]> {
    const today = new Date().toISOString().split("T")[0];
    const all = await this.getOpportunities({ status: "new" });

    return all.filter(card => {
      return card.createdAt.startsWith(today) ||
             card.urgency === "immediate" ||
             card.urgency === "this_week";
    });
  }

  // Update opportunity status
  async updateStatus(
    opportunityId: string,
    status: OpportunityCard["status"]
  ): Promise<OpportunityCard | null> {
    const cardPath = `${this.opportunitiesPath}/${opportunityId}.json`;

    try {
      const file = Bun.file(cardPath);
      if (!(await file.exists())) {
        return null;
      }

      const card: OpportunityCard = await file.json();
      card.status = status;
      card.updatedAt = new Date().toISOString();

      if (status === "reviewed") {
        card.reviewedAt = card.updatedAt;
      } else if (status === "actioned") {
        card.actionedAt = card.updatedAt;
      }

      await Bun.write(cardPath, JSON.stringify(card, null, 2));
      await this.updateIndex(card);

      return card;
    } catch {
      return null;
    }
  }

  // Process agent output and extract opportunities
  async processAgentOutput(
    output: string,
    agent: string,
    iteration: number
  ): Promise<OpportunityCard[]> {
    await this.init();

    const extracted = this.extractOpportunities(output, agent, iteration);
    const saved: OpportunityCard[] = [];

    for (const opp of extracted) {
      // Only save opportunities with reasonable confidence
      if (opp.confidence >= 0.5) {
        const card = await this.saveOpportunity(opp);
        saved.push(card);
      }
    }

    return saved;
  }
}

export const opportunityGenerator = new OpportunityGenerator();
