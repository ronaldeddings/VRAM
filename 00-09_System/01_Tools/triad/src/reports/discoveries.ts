// Discoveries - Extract and track interesting findings from agent outputs
// Phase 6.2: Fun Finds and Discoveries

import { config } from "../utils/config";

export type DiscoveryCategory =
  | "fun_fact"
  | "hidden_gem"
  | "connection"
  | "pattern"
  | "opportunity"
  | "memory"
  | "insight"
  | "surprise"
  | "recommendation"
  | "trivia";

export interface Discovery {
  id: string;
  category: DiscoveryCategory;
  title: string;
  description: string;
  source: {
    agent: string;
    iteration: number;
    focusArea?: string;
    timestamp: string;
  };
  tags: string[];
  funScore: number; // 1-10 how interesting/fun
  usefulScore: number; // 1-10 how practically useful
  shareworthy: boolean; // Would Ron want to share this?
  relatedTo?: string[]; // Related people, projects, etc.
  status: "new" | "reviewed" | "shared" | "archived";
  createdAt: string;
  reviewedAt?: string;
}

export interface DiscoveryIndex {
  discoveries: Discovery[];
  stats: {
    total: number;
    byCategory: Record<DiscoveryCategory, number>;
    avgFunScore: number;
    avgUsefulScore: number;
    shareworthyCount: number;
  };
  weeklyDigest: {
    topDiscoveries: Discovery[];
    generatedAt: string;
  } | null;
  lastUpdated: string;
}

// Patterns for detecting interesting discoveries
const discoveryPatterns = {
  fun_fact: {
    indicators: [
      /interesting(?:ly)?/gi,
      /surprising(?:ly)?/gi,
      /fun fact/gi,
      /did you know/gi,
      /turns out/gi,
      /fascinating/gi,
    ],
    minLength: 50,
    maxLength: 500,
  },
  hidden_gem: {
    indicators: [
      /hidden/gi,
      /overlooked/gi,
      /forgotten/gi,
      /discovered/gi,
      /found.*(?:buried|hidden|lost)/gi,
      /treasure/gi,
    ],
    minLength: 30,
    maxLength: 400,
  },
  connection: {
    indicators: [
      /connection.*between/gi,
      /link.*between/gi,
      /related to/gi,
      /connected to/gi,
      /relationship.*between/gi,
      /overlap.*with/gi,
    ],
    minLength: 40,
    maxLength: 500,
  },
  pattern: {
    indicators: [
      /pattern/gi,
      /trend/gi,
      /consistent/gi,
      /recurring/gi,
      /cycle/gi,
      /regular(?:ly)?/gi,
    ],
    minLength: 40,
    maxLength: 400,
  },
  surprise: {
    indicators: [
      /unexpected/gi,
      /surprise/gi,
      /didn't expect/gi,
      /contrary to/gi,
      /plot twist/gi,
      /who knew/gi,
    ],
    minLength: 30,
    maxLength: 400,
  },
};

export class DiscoveryTracker {
  private reportsPath: string;
  private discoveriesPath: string;

  constructor() {
    this.reportsPath = config.reportsPath;
    this.discoveriesPath = `${this.reportsPath}/discoveries`;
  }

  async init(): Promise<void> {
    try {
      await Bun.$`mkdir -p ${this.discoveriesPath}`;
    } catch {
      // Directory might already exist
    }
  }

  // Extract discoveries from agent output
  extractDiscoveries(
    output: string,
    agent: string,
    iteration: number,
    focusArea?: string
  ): Omit<Discovery, "id" | "createdAt" | "status">[] {
    const discoveries: Omit<Discovery, "id" | "createdAt" | "status">[] = [];
    const lines = output.split("\n");

    // Process line by line looking for discovery patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length < 20) continue; // Skip short lines

      for (const [category, config] of Object.entries(discoveryPatterns)) {
        for (const pattern of config.indicators) {
          if (pattern.test(line)) {
            // Get context (surrounding lines)
            const contextStart = Math.max(0, i - 1);
            const contextEnd = Math.min(lines.length, i + 2);
            const context = lines.slice(contextStart, contextEnd).join("\n").trim();

            // Only include if within length bounds
            if (context.length >= config.minLength && context.length <= config.maxLength) {
              const discovery: Omit<Discovery, "id" | "createdAt" | "status"> = {
                category: category as DiscoveryCategory,
                title: this.generateTitle(line, category),
                description: context,
                source: {
                  agent,
                  iteration,
                  focusArea,
                  timestamp: new Date().toISOString(),
                },
                tags: this.extractTags(context),
                funScore: this.calculateFunScore(context, category),
                usefulScore: this.calculateUsefulScore(context),
                shareworthy: this.isShareworthy(context),
                relatedTo: this.extractRelatedEntities(context),
              };

              discoveries.push(discovery);
              break; // Only count once per line
            }
          }
        }
      }
    }

    // Also look for JSON-structured discoveries
    const jsonDiscoveries = this.extractFromJson(output, agent, iteration, focusArea);
    discoveries.push(...jsonDiscoveries);

    // Deduplicate
    return this.deduplicateDiscoveries(discoveries);
  }

  private extractFromJson(
    text: string,
    agent: string,
    iteration: number,
    focusArea?: string
  ): Omit<Discovery, "id" | "createdAt" | "status">[] {
    const discoveries: Omit<Discovery, "id" | "createdAt" | "status">[] = [];
    const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/g;
    let match;

    while ((match = jsonRegex.exec(text)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        const items = parsed.discoveries || parsed.funFinds || parsed.insights || [];

        for (const item of items) {
          if (typeof item === "object" && (item.discovery || item.finding || item.insight)) {
            discoveries.push({
              category: this.inferCategory(item),
              title: item.title || item.discovery || item.finding || "Discovery",
              description: item.description || item.detail || item.context || "",
              source: {
                agent,
                iteration,
                focusArea,
                timestamp: new Date().toISOString(),
              },
              tags: item.tags || [],
              funScore: item.funScore || this.calculateFunScore(item.description || "", "fun_fact"),
              usefulScore: item.usefulScore || 5,
              shareworthy: item.shareworthy ?? false,
              relatedTo: item.relatedTo || [],
            });
          }
        }
      } catch {
        // Invalid JSON, skip
      }
    }

    return discoveries;
  }

  private inferCategory(item: Record<string, unknown>): DiscoveryCategory {
    const text = JSON.stringify(item).toLowerCase();
    if (text.includes("connection") || text.includes("link")) return "connection";
    if (text.includes("pattern") || text.includes("trend")) return "pattern";
    if (text.includes("hidden") || text.includes("gem")) return "hidden_gem";
    if (text.includes("surprise") || text.includes("unexpected")) return "surprise";
    if (text.includes("memory") || text.includes("remember")) return "memory";
    return "fun_fact";
  }

  private generateTitle(line: string, category: string): string {
    // Clean up and truncate
    let title = line.replace(/[#*`]/g, "").replace(/^\s*[-•]\s*/, "").trim();

    // If starts with lowercase, capitalize
    title = title.charAt(0).toUpperCase() + title.slice(1);

    // Truncate if needed
    if (title.length > 80) {
      title = title.substring(0, 77) + "...";
    }

    return title || `${category.replace("_", " ")} discovery`;
  }

  private extractTags(text: string): string[] {
    const tags: string[] = [];
    const lower = text.toLowerCase();

    // Domain tags
    if (lower.includes("podcast") || lower.includes("episode")) tags.push("podcast");
    if (lower.includes("client") || lower.includes("customer")) tags.push("business");
    if (lower.includes("family") || lower.includes("kid")) tags.push("family");
    if (lower.includes("security") || lower.includes("cyber")) tags.push("security");
    if (lower.includes("money") || lower.includes("revenue")) tags.push("finance");
    if (lower.includes("health") || lower.includes("fitness")) tags.push("health");

    return tags;
  }

  private calculateFunScore(text: string, category: string): number {
    let score = 5; // Base score

    // Boost for certain words
    const funWords = ["amazing", "incredible", "wow", "cool", "awesome", "exciting", "fun", "interesting"];
    for (const word of funWords) {
      if (text.toLowerCase().includes(word)) {
        score += 0.5;
      }
    }

    // Category bonuses
    if (category === "surprise" || category === "fun_fact") score += 1;
    if (category === "hidden_gem") score += 1.5;

    // Cap at 10
    return Math.min(Math.round(score), 10);
  }

  private calculateUsefulScore(text: string): number {
    let score = 5; // Base score

    // Boost for actionable language
    const actionWords = ["should", "could", "opportunity", "recommend", "suggest", "action", "next step"];
    for (const word of actionWords) {
      if (text.toLowerCase().includes(word)) {
        score += 0.5;
      }
    }

    // Boost for specificity
    if (text.match(/\$[\d,]+/)) score += 1; // Has dollar amounts
    if (text.match(/\d{4}-\d{2}-\d{2}/)) score += 0.5; // Has dates
    if (text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/)) score += 0.5; // Has names

    // Cap at 10
    return Math.min(Math.round(score), 10);
  }

  private isShareworthy(text: string): boolean {
    // Shareworthy if interesting AND not too personal
    const funIndicators = ["interesting", "surprising", "fascinating", "amazing", "incredible"];
    const hasFunIndicator = funIndicators.some(i => text.toLowerCase().includes(i));

    const personalIndicators = ["password", "secret", "private", "confidential", "personal"];
    const hasPersonalIndicator = personalIndicators.some(i => text.toLowerCase().includes(i));

    return hasFunIndicator && !hasPersonalIndicator && text.length > 50;
  }

  private extractRelatedEntities(text: string): string[] {
    const entities: string[] = [];

    // Extract names (simple pattern)
    const nameMatches = text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/g) || [];
    entities.push(...nameMatches.slice(0, 3));

    // Extract company-like names
    const companyMatches = text.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:\s+(?:Inc|Corp|LLC|Ltd))?/g) || [];
    entities.push(...companyMatches.filter(c => c.length > 3).slice(0, 2));

    // Deduplicate
    return [...new Set(entities)];
  }

  private deduplicateDiscoveries(
    discoveries: Omit<Discovery, "id" | "createdAt" | "status">[]
  ): Omit<Discovery, "id" | "createdAt" | "status">[] {
    const seen = new Set<string>();
    return discoveries.filter(d => {
      const key = `${d.category}-${d.title.toLowerCase().substring(0, 40)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Save discovery
  async saveDiscovery(
    discovery: Omit<Discovery, "id" | "createdAt" | "status">
  ): Promise<Discovery> {
    const newDiscovery: Discovery = {
      ...discovery,
      id: `disc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // Save individual discovery
    const discoveryPath = `${this.discoveriesPath}/${newDiscovery.id}.json`;
    await Bun.write(discoveryPath, JSON.stringify(newDiscovery, null, 2));

    // Update index
    await this.updateIndex(newDiscovery);

    return newDiscovery;
  }

  private async updateIndex(newDiscovery: Discovery): Promise<void> {
    const indexPath = `${this.discoveriesPath}/index.json`;
    let index: DiscoveryIndex;

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

    // Add discovery
    const existingIdx = index.discoveries.findIndex(d => d.id === newDiscovery.id);
    if (existingIdx >= 0) {
      index.discoveries[existingIdx] = newDiscovery;
    } else {
      index.discoveries.unshift(newDiscovery);
    }

    // Keep only last 500 discoveries
    if (index.discoveries.length > 500) {
      index.discoveries = index.discoveries.slice(0, 500);
    }

    // Recalculate stats
    index.stats = this.calculateStats(index.discoveries);
    index.lastUpdated = new Date().toISOString();

    await Bun.write(indexPath, JSON.stringify(index, null, 2));
  }

  private createEmptyIndex(): DiscoveryIndex {
    return {
      discoveries: [],
      stats: {
        total: 0,
        byCategory: {} as Record<DiscoveryCategory, number>,
        avgFunScore: 0,
        avgUsefulScore: 0,
        shareworthyCount: 0,
      },
      weeklyDigest: null,
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateStats(discoveries: Discovery[]): DiscoveryIndex["stats"] {
    const stats: DiscoveryIndex["stats"] = {
      total: discoveries.length,
      byCategory: {} as Record<DiscoveryCategory, number>,
      avgFunScore: 0,
      avgUsefulScore: 0,
      shareworthyCount: 0,
    };

    if (discoveries.length === 0) return stats;

    let totalFun = 0;
    let totalUseful = 0;

    for (const discovery of discoveries) {
      stats.byCategory[discovery.category] = (stats.byCategory[discovery.category] || 0) + 1;
      totalFun += discovery.funScore;
      totalUseful += discovery.usefulScore;
      if (discovery.shareworthy) stats.shareworthyCount++;
    }

    stats.avgFunScore = Math.round((totalFun / discoveries.length) * 10) / 10;
    stats.avgUsefulScore = Math.round((totalUseful / discoveries.length) * 10) / 10;

    return stats;
  }

  // Get discoveries
  async getDiscoveries(filters?: {
    category?: DiscoveryCategory;
    minFunScore?: number;
    shareworthy?: boolean;
    status?: Discovery["status"];
    limit?: number;
  }): Promise<Discovery[]> {
    const indexPath = `${this.discoveriesPath}/index.json`;

    try {
      const file = Bun.file(indexPath);
      if (!(await file.exists())) {
        return [];
      }

      const index: DiscoveryIndex = await file.json();
      let discoveries = index.discoveries;

      // Apply filters
      if (filters?.category) {
        discoveries = discoveries.filter(d => d.category === filters.category);
      }
      if (filters?.minFunScore) {
        discoveries = discoveries.filter(d => d.funScore >= filters.minFunScore);
      }
      if (filters?.shareworthy !== undefined) {
        discoveries = discoveries.filter(d => d.shareworthy === filters.shareworthy);
      }
      if (filters?.status) {
        discoveries = discoveries.filter(d => d.status === filters.status);
      }

      // Sort by fun score descending
      discoveries.sort((a, b) => b.funScore - a.funScore);

      // Apply limit
      if (filters?.limit) {
        discoveries = discoveries.slice(0, filters.limit);
      }

      return discoveries;
    } catch {
      return [];
    }
  }

  // Get latest discoveries
  async getLatestDiscoveries(limit: number = 10): Promise<Discovery[]> {
    return this.getDiscoveries({ status: "new", limit });
  }

  // Generate weekly fun finds digest
  async generateWeeklyDigest(): Promise<string> {
    const discoveries = await this.getDiscoveries({ minFunScore: 7, limit: 10 });

    if (discoveries.length === 0) {
      return "No fun discoveries this week!";
    }

    let digest = `# 🎉 Weekly Fun Finds\n\n`;
    digest += `*${new Date().toLocaleDateString()}*\n\n`;

    for (const discovery of discoveries) {
      const emoji = this.getCategoryEmoji(discovery.category);
      digest += `## ${emoji} ${discovery.title}\n\n`;
      digest += `${discovery.description}\n\n`;
      digest += `*Fun Score: ${"⭐".repeat(Math.min(discovery.funScore, 5))}*\n\n`;
      digest += `---\n\n`;
    }

    // Save digest
    const digestPath = `${this.discoveriesPath}/weekly-digest-${new Date().toISOString().split("T")[0]}.md`;
    await Bun.write(digestPath, digest);

    return digest;
  }

  private getCategoryEmoji(category: DiscoveryCategory): string {
    const emojis: Record<DiscoveryCategory, string> = {
      fun_fact: "🎯",
      hidden_gem: "💎",
      connection: "🔗",
      pattern: "📊",
      opportunity: "🚀",
      memory: "📸",
      insight: "💡",
      surprise: "🎊",
      recommendation: "👍",
      trivia: "🎲",
    };
    return emojis[category] || "✨";
  }

  // Process agent output
  async processAgentOutput(
    output: string,
    agent: string,
    iteration: number,
    focusArea?: string
  ): Promise<Discovery[]> {
    await this.init();

    const extracted = this.extractDiscoveries(output, agent, iteration, focusArea);
    const saved: Discovery[] = [];

    for (const discovery of extracted) {
      // Only save discoveries with reasonable fun or useful scores
      if (discovery.funScore >= 5 || discovery.usefulScore >= 6) {
        const disc = await this.saveDiscovery(discovery);
        saved.push(disc);
      }
    }

    return saved;
  }
}

export const discoveryTracker = new DiscoveryTracker();
