// Action Item Generator - Extract actionable items from insights
// Phase 4.3: Generate prioritized action items from high-confidence insights

import { config } from "../utils/config";

export type ActionCategory =
  | "follow_up"
  | "outreach"
  | "review"
  | "create"
  | "fix"
  | "schedule"
  | "research"
  | "delegate"
  | "decide"
  | "other";

export type ActionPriority = "urgent" | "high" | "medium" | "low";

export type ActionStatus = "pending" | "in_progress" | "completed" | "deferred" | "cancelled";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  priority: ActionPriority;
  status: ActionStatus;
  dueDate?: string;
  effort: "quick" | "short" | "medium" | "long"; // 5min, 30min, 2hr, 4hr+
  source: {
    insightId?: string;
    agent?: string;
    iteration?: number;
    focusArea?: string;
  };
  context: {
    company?: string;
    contact?: string;
    project?: string;
    relatedOpportunityId?: string;
  };
  tags: string[];
  confidence: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ActionIndex {
  items: ActionItem[];
  stats: {
    total: number;
    byCategory: Record<ActionCategory, number>;
    byPriority: Record<ActionPriority, number>;
    byStatus: Record<ActionStatus, number>;
    urgentCount: number;
    overdueCount: number;
  };
  lastUpdated: string;
}

// Action extraction patterns
const actionPatterns = {
  follow_up: {
    patterns: [
      /follow\s*up\s+with\s+([^.]+)/gi,
      /reach\s+out\s+to\s+([^.]+)/gi,
      /check\s+in\s+with\s+([^.]+)/gi,
      /get\s+back\s+to\s+([^.]+)/gi,
      /respond\s+to\s+([^.]+)/gi,
    ],
    defaultEffort: "quick" as const,
  },
  outreach: {
    patterns: [
      /contact\s+([^.]+)/gi,
      /send\s+(?:email|message)\s+to\s+([^.]+)/gi,
      /introduce\s+(?:yourself|yourself to)\s+([^.]+)/gi,
      /connect\s+with\s+([^.]+)/gi,
    ],
    defaultEffort: "short" as const,
  },
  review: {
    patterns: [
      /review\s+([^.]+)/gi,
      /assess\s+([^.]+)/gi,
      /evaluate\s+([^.]+)/gi,
      /analyze\s+([^.]+)/gi,
      /examine\s+([^.]+)/gi,
    ],
    defaultEffort: "medium" as const,
  },
  create: {
    patterns: [
      /create\s+([^.]+)/gi,
      /write\s+([^.]+)/gi,
      /draft\s+([^.]+)/gi,
      /prepare\s+([^.]+)/gi,
      /develop\s+([^.]+)/gi,
    ],
    defaultEffort: "medium" as const,
  },
  fix: {
    patterns: [
      /fix\s+([^.]+)/gi,
      /resolve\s+([^.]+)/gi,
      /address\s+([^.]+)/gi,
      /correct\s+([^.]+)/gi,
    ],
    defaultEffort: "short" as const,
  },
  schedule: {
    patterns: [
      /schedule\s+([^.]+)/gi,
      /set\s+up\s+([^.]+)/gi,
      /book\s+([^.]+)/gi,
      /arrange\s+([^.]+)/gi,
      /plan\s+([^.]+)/gi,
    ],
    defaultEffort: "quick" as const,
  },
  research: {
    patterns: [
      /research\s+([^.]+)/gi,
      /investigate\s+([^.]+)/gi,
      /look\s+into\s+([^.]+)/gi,
      /explore\s+([^.]+)/gi,
      /find\s+out\s+([^.]+)/gi,
    ],
    defaultEffort: "medium" as const,
  },
  delegate: {
    patterns: [
      /delegate\s+([^.]+)/gi,
      /assign\s+([^.]+)/gi,
      /ask\s+(?:team|someone)\s+to\s+([^.]+)/gi,
    ],
    defaultEffort: "quick" as const,
  },
  decide: {
    patterns: [
      /decide\s+(?:on|whether)\s+([^.]+)/gi,
      /make\s+(?:a\s+)?decision\s+(?:on|about)\s+([^.]+)/gi,
      /choose\s+([^.]+)/gi,
    ],
    defaultEffort: "short" as const,
  },
};

// Urgency indicators
const urgencyIndicators = {
  urgent: ["urgent", "asap", "immediately", "critical", "emergency", "today", "overdue"],
  high: ["important", "priority", "soon", "this week", "by friday", "deadline"],
  medium: ["should", "need to", "this month", "when possible"],
  low: ["consider", "might", "could", "eventually", "someday", "nice to have"],
};

export class ActionItemGenerator {
  private reportsPath: string;
  private statePath: string;
  private actionsPath: string;

  constructor() {
    this.reportsPath = config.reportsPath;
    this.statePath = config.statePath;
    this.actionsPath = `${this.reportsPath}/action-items`;
  }

  async init(): Promise<void> {
    try {
      await Bun.$`mkdir -p ${this.actionsPath}`;
    } catch {
      // Directory might already exist
    }
  }

  // Extract action items from insight text
  extractActions(
    text: string,
    source: ActionItem["source"],
    confidenceThreshold: number = 0.85
  ): Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">[] {
    const actions: Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">[] = [];
    const lines = text.split("\n");

    // Extract from JSON blocks if present
    const jsonActions = this.extractFromJson(text, source);
    actions.push(...jsonActions);

    // Extract from natural language patterns
    for (const line of lines) {
      for (const [category, config] of Object.entries(actionPatterns)) {
        for (const pattern of config.patterns) {
          const matches = [...line.matchAll(pattern)];
          for (const match of matches) {
            const actionText = match[1]?.trim();
            if (actionText && actionText.length > 5 && actionText.length < 200) {
              const priority = this.inferPriority(line);
              const context = this.extractContext(line, text);

              actions.push({
                title: this.generateTitle(category, actionText),
                description: line.trim(),
                category: category as ActionCategory,
                priority,
                effort: config.defaultEffort,
                source,
                context,
                tags: this.extractTags(line),
                confidence: this.calculateConfidence(line, category),
              });
            }
          }
        }
      }
    }

    // Filter by confidence and deduplicate
    return this.deduplicateActions(
      actions.filter(a => a.confidence >= confidenceThreshold)
    );
  }

  private extractFromJson(
    text: string,
    source: ActionItem["source"]
  ): Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">[] {
    const actions: Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">[] = [];

    // Look for JSON blocks with action items
    const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/g;
    let match;

    while ((match = jsonRegex.exec(text)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        const items = parsed.actions || parsed.actionItems || parsed.nextSteps || parsed.recommendations || [];

        for (const item of items) {
          if (typeof item === "string") {
            actions.push({
              title: item.substring(0, 100),
              description: item,
              category: this.inferCategory(item),
              priority: this.inferPriority(item),
              effort: "short",
              source,
              context: {},
              tags: [],
              confidence: 0.85,
            });
          } else if (typeof item === "object") {
            actions.push({
              title: item.action || item.title || item.item || "Action Item",
              description: item.description || item.rationale || item.reason || "",
              category: this.normalizeCategory(item.type || item.category),
              priority: this.normalizePriority(item.priority),
              effort: this.normalizeEffort(item.effort || item.timeRequired),
              dueDate: item.dueDate || item.deadline,
              source,
              context: {
                company: item.company,
                contact: item.contact,
                project: item.project,
              },
              tags: item.tags || [],
              confidence: item.confidence || 0.85,
            });
          }
        }
      } catch {
        // Invalid JSON, skip
      }
    }

    return actions;
  }

  private inferCategory(text: string): ActionCategory {
    const lower = text.toLowerCase();
    for (const [category, config] of Object.entries(actionPatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(lower)) {
          return category as ActionCategory;
        }
      }
    }
    return "other";
  }

  private normalizeCategory(category: string | undefined): ActionCategory {
    if (!category) return "other";
    const lower = category.toLowerCase();
    const categories: ActionCategory[] = [
      "follow_up", "outreach", "review", "create", "fix",
      "schedule", "research", "delegate", "decide", "other"
    ];
    for (const cat of categories) {
      if (lower.includes(cat.replace("_", " ")) || lower.includes(cat)) {
        return cat;
      }
    }
    return "other";
  }

  private inferPriority(text: string): ActionPriority {
    const lower = text.toLowerCase();
    for (const [priority, indicators] of Object.entries(urgencyIndicators)) {
      for (const indicator of indicators) {
        if (lower.includes(indicator)) {
          return priority as ActionPriority;
        }
      }
    }
    return "medium";
  }

  private normalizePriority(priority: string | undefined): ActionPriority {
    if (!priority) return "medium";
    const lower = priority.toLowerCase();
    if (lower.includes("urgent") || lower.includes("critical")) return "urgent";
    if (lower.includes("high")) return "high";
    if (lower.includes("low")) return "low";
    return "medium";
  }

  private normalizeEffort(effort: string | undefined): ActionItem["effort"] {
    if (!effort) return "short";
    const lower = effort.toLowerCase();
    if (lower.includes("quick") || lower.includes("5 min") || lower.includes("fast")) return "quick";
    if (lower.includes("long") || lower.includes("hours") || lower.includes("complex")) return "long";
    if (lower.includes("medium") || lower.includes("hour")) return "medium";
    return "short";
  }

  private extractContext(line: string, fullText: string): ActionItem["context"] {
    const context: ActionItem["context"] = {};

    // Extract company mentions
    const companyMatch = line.match(/(?:with|at|from|for)\s+([A-Z][a-zA-Z\s]+(?:Inc|Corp|LLC|Ltd|Co)?)/);
    if (companyMatch) {
      context.company = companyMatch[1].trim();
    }

    // Extract contact mentions
    const contactMatch = line.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s|$|,|\.)/);
    if (contactMatch) {
      context.contact = contactMatch[1];
    }

    // Extract project mentions
    const projectMatch = line.match(/(?:project|initiative|campaign)\s+["']?([^"'.,]+)["']?/i);
    if (projectMatch) {
      context.project = projectMatch[1].trim();
    }

    return context;
  }

  private extractTags(line: string): string[] {
    const tags: string[] = [];
    const lower = line.toLowerCase();

    // Domain tags
    if (lower.includes("sponsor") || lower.includes("advertising")) tags.push("revenue");
    if (lower.includes("podcast") || lower.includes("episode")) tags.push("content");
    if (lower.includes("client") || lower.includes("customer")) tags.push("client");
    if (lower.includes("team") || lower.includes("internal")) tags.push("team");
    if (lower.includes("security") || lower.includes("cyber")) tags.push("security");

    return tags;
  }

  private calculateConfidence(text: string, category: string): number {
    let confidence = 0.7; // Base confidence

    // Boost for explicit action verbs
    const actionVerbs = ["must", "need to", "should", "will", "have to"];
    for (const verb of actionVerbs) {
      if (text.toLowerCase().includes(verb)) {
        confidence += 0.05;
      }
    }

    // Boost for specific details
    if (text.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/)) confidence += 0.05; // Has names
    if (text.match(/\d{4}-\d{2}-\d{2}/)) confidence += 0.05; // Has dates
    if (text.match(/\$[\d,]+/)) confidence += 0.05; // Has amounts

    // Cap at 0.95
    return Math.min(confidence, 0.95);
  }

  private generateTitle(category: string, actionText: string): string {
    const categoryPrefixes: Record<string, string> = {
      follow_up: "Follow up:",
      outreach: "Contact:",
      review: "Review:",
      create: "Create:",
      fix: "Fix:",
      schedule: "Schedule:",
      research: "Research:",
      delegate: "Delegate:",
      decide: "Decide:",
      other: "Action:",
    };

    const prefix = categoryPrefixes[category] || "Action:";
    const cleanText = actionText.replace(/^(the|a|an)\s+/i, "");
    const title = cleanText.charAt(0).toUpperCase() + cleanText.slice(1);

    if (title.length > 60) {
      return `${prefix} ${title.substring(0, 57)}...`;
    }
    return `${prefix} ${title}`;
  }

  private deduplicateActions(
    actions: Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">[]
  ): Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">[] {
    const seen = new Set<string>();
    return actions.filter(action => {
      const key = `${action.category}-${action.title.toLowerCase().substring(0, 40)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Save action item
  async saveAction(
    action: Omit<ActionItem, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<ActionItem> {
    const now = new Date().toISOString();
    const item: ActionItem = {
      ...action,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    // Save individual item
    const itemPath = `${this.actionsPath}/${item.id}.json`;
    await Bun.write(itemPath, JSON.stringify(item, null, 2));

    // Update index
    await this.updateIndex(item);

    return item;
  }

  private async updateIndex(newItem: ActionItem): Promise<void> {
    const indexPath = `${this.actionsPath}/index.json`;
    let index: ActionIndex;

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

    // Add or update item in index
    const existingIdx = index.items.findIndex(i => i.id === newItem.id);
    if (existingIdx >= 0) {
      index.items[existingIdx] = newItem;
    } else {
      index.items.unshift(newItem);
    }

    // Keep only last 1000 items in index
    if (index.items.length > 1000) {
      index.items = index.items.slice(0, 1000);
    }

    // Recalculate stats
    index.stats = this.calculateStats(index.items);
    index.lastUpdated = new Date().toISOString();

    await Bun.write(indexPath, JSON.stringify(index, null, 2));
  }

  private createEmptyIndex(): ActionIndex {
    return {
      items: [],
      stats: {
        total: 0,
        byCategory: {} as Record<ActionCategory, number>,
        byPriority: {} as Record<ActionPriority, number>,
        byStatus: {} as Record<ActionStatus, number>,
        urgentCount: 0,
        overdueCount: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateStats(items: ActionItem[]): ActionIndex["stats"] {
    const now = new Date();
    const stats: ActionIndex["stats"] = {
      total: items.length,
      byCategory: {} as Record<ActionCategory, number>,
      byPriority: {} as Record<ActionPriority, number>,
      byStatus: {} as Record<ActionStatus, number>,
      urgentCount: 0,
      overdueCount: 0,
    };

    for (const item of items) {
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      stats.byPriority[item.priority] = (stats.byPriority[item.priority] || 0) + 1;
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;

      if (item.priority === "urgent" && item.status === "pending") {
        stats.urgentCount++;
      }

      if (item.dueDate && new Date(item.dueDate) < now && item.status === "pending") {
        stats.overdueCount++;
      }
    }

    return stats;
  }

  // Get action items with filters
  async getActions(filters?: {
    category?: ActionCategory;
    priority?: ActionPriority;
    status?: ActionStatus;
    limit?: number;
  }): Promise<ActionItem[]> {
    const indexPath = `${this.actionsPath}/index.json`;

    try {
      const file = Bun.file(indexPath);
      if (!(await file.exists())) {
        return [];
      }

      const index: ActionIndex = await file.json();
      let items = index.items;

      // Apply filters
      if (filters?.category) {
        items = items.filter(i => i.category === filters.category);
      }
      if (filters?.priority) {
        items = items.filter(i => i.priority === filters.priority);
      }
      if (filters?.status) {
        items = items.filter(i => i.status === filters.status);
      }

      // Sort by priority and creation date
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      items.sort((a, b) => {
        const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (pDiff !== 0) return pDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      // Apply limit
      if (filters?.limit) {
        items = items.slice(0, filters.limit);
      }

      return items;
    } catch {
      return [];
    }
  }

  // Get priority actions (urgent + high priority pending)
  async getPriorityActions(): Promise<ActionItem[]> {
    const all = await this.getActions({ status: "pending" });
    return all.filter(item => item.priority === "urgent" || item.priority === "high");
  }

  // Update action status
  async updateStatus(actionId: string, status: ActionStatus): Promise<ActionItem | null> {
    const itemPath = `${this.actionsPath}/${actionId}.json`;

    try {
      const file = Bun.file(itemPath);
      if (!(await file.exists())) {
        return null;
      }

      const item: ActionItem = await file.json();
      item.status = status;
      item.updatedAt = new Date().toISOString();

      if (status === "completed") {
        item.completedAt = item.updatedAt;
      }

      await Bun.write(itemPath, JSON.stringify(item, null, 2));
      await this.updateIndex(item);

      return item;
    } catch {
      return null;
    }
  }

  // Process insight and extract action items
  async processInsight(
    insight: { id: string; text: string; confidence: number; focusArea?: string },
    agent: string,
    iteration: number
  ): Promise<ActionItem[]> {
    await this.init();

    // Only process high-confidence insights
    if (insight.confidence < config.highConfidence) {
      return [];
    }

    const source: ActionItem["source"] = {
      insightId: insight.id,
      agent,
      iteration,
      focusArea: insight.focusArea,
    };

    const extracted = this.extractActions(insight.text, source, config.highConfidence);
    const saved: ActionItem[] = [];

    for (const action of extracted) {
      const item = await this.saveAction(action);
      saved.push(item);
    }

    return saved;
  }
}

export const actionItemGenerator = new ActionItemGenerator();
