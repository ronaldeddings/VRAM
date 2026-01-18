// Life Optimizer - Pattern analysis and improvement suggestions
// Phase 6.3: Life Optimization

import { config } from "../utils/config";

// Life optimization categories
export type OptimizationCategory =
  | "time_management"
  | "energy_management"
  | "relationship_quality"
  | "health_habits"
  | "productivity"
  | "stress_reduction"
  | "skill_development"
  | "financial_health"
  | "work_life_balance"
  | "personal_fulfillment";

export type PatternType =
  | "positive_habit"
  | "negative_habit"
  | "opportunity"
  | "risk"
  | "trend"
  | "correlation"
  | "anomaly";

export type ImpactLevel = "transformative" | "significant" | "moderate" | "minor";

export interface LifePattern {
  id: string;
  category: OptimizationCategory;
  patternType: PatternType;
  title: string;
  description: string;
  evidence: string[];
  frequency: "daily" | "weekly" | "monthly" | "occasional";
  impact: ImpactLevel;
  trend: "improving" | "stable" | "declining";
  confidence: number;
  detectedAt: string;
  lastSeen: string;
  occurrences: number;
}

export interface OptimizationSuggestion {
  id: string;
  category: OptimizationCategory;
  title: string;
  description: string;
  rationale: string;
  basedOn: string[]; // Pattern IDs
  actionSteps: string[];
  effort: "minimal" | "low" | "medium" | "high";
  expectedImpact: ImpactLevel;
  timeframe: "immediate" | "this_week" | "this_month" | "this_quarter";
  priority: "critical" | "high" | "medium" | "low";
  status: "suggested" | "accepted" | "in_progress" | "completed" | "dismissed";
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  feedback?: string;
}

export interface WeeklyOptimizationReport {
  id: string;
  weekOf: string;
  overallScore: number; // 0-100
  categoryScores: Record<OptimizationCategory, number>;
  topPatterns: LifePattern[];
  suggestions: OptimizationSuggestion[];
  wins: string[];
  areasForImprovement: string[];
  weeklyFocus: {
    category: OptimizationCategory;
    goal: string;
    actions: string[];
  };
  comparison: {
    vsLastWeek: number;
    vsLastMonth: number;
    trend: "improving" | "stable" | "declining";
  };
  generatedAt: string;
}

// Pattern detection rules
const patternIndicators: Record<PatternType, { keywords: RegExp[]; signals: string[] }> = {
  positive_habit: {
    keywords: [
      /consistently/i,
      /regularly/i,
      /always/i,
      /every (day|morning|week)/i,
      /routine/i,
      /habit of/i,
      /discipline/i,
    ],
    signals: ["routine established", "consistent behavior", "positive pattern"],
  },
  negative_habit: {
    keywords: [
      /procrastinat/i,
      /avoid/i,
      /skip/i,
      /neglect/i,
      /forget/i,
      /overcommit/i,
      /late/i,
      /miss/i,
    ],
    signals: ["recurring issue", "pattern of avoidance", "consistent delay"],
  },
  opportunity: {
    keywords: [
      /could/i,
      /potential/i,
      /opportunity/i,
      /room for/i,
      /untapped/i,
      /leverage/i,
      /optimize/i,
    ],
    signals: ["growth potential", "unused capacity", "improvement available"],
  },
  risk: {
    keywords: [
      /burnout/i,
      /stress/i,
      /overwork/i,
      /unsustainable/i,
      /warning sign/i,
      /concern/i,
      /risk/i,
    ],
    signals: ["warning indicator", "potential issue", "concerning pattern"],
  },
  trend: {
    keywords: [
      /increasing/i,
      /decreasing/i,
      /growing/i,
      /declining/i,
      /trending/i,
      /over time/i,
      /gradually/i,
    ],
    signals: ["directional change", "measurable shift", "evolution observed"],
  },
  correlation: {
    keywords: [
      /when.*then/i,
      /correlat/i,
      /connect/i,
      /linked/i,
      /relationship between/i,
      /affects/i,
      /impacts/i,
    ],
    signals: ["connected factors", "cause and effect", "relationship identified"],
  },
  anomaly: {
    keywords: [
      /unusual/i,
      /unexpected/i,
      /anomal/i,
      /outlier/i,
      /surprising/i,
      /different from/i,
      /deviation/i,
    ],
    signals: ["unexpected finding", "deviation from norm", "unique occurrence"],
  },
};

// Category detection rules
const categoryIndicators: Record<OptimizationCategory, { keywords: RegExp[]; domains: string[] }> = {
  time_management: {
    keywords: [/time/i, /schedule/i, /calendar/i, /deadline/i, /priorit/i, /late/i, /early/i],
    domains: ["scheduling", "planning", "priorities"],
  },
  energy_management: {
    keywords: [/energy/i, /tired/i, /fatigue/i, /sleep/i, /rest/i, /refresh/i, /exhausted/i],
    domains: ["sleep", "rest", "vitality"],
  },
  relationship_quality: {
    keywords: [/relationship/i, /family/i, /friend/i, /connection/i, /social/i, /partner/i, /colleague/i],
    domains: ["family", "friends", "networking"],
  },
  health_habits: {
    keywords: [/health/i, /exercise/i, /diet/i, /fitness/i, /wellness/i, /medical/i, /nutrition/i],
    domains: ["fitness", "nutrition", "medical"],
  },
  productivity: {
    keywords: [/productiv/i, /efficient/i, /output/i, /accomplish/i, /complete/i, /deliver/i, /achieve/i],
    domains: ["work output", "efficiency", "achievement"],
  },
  stress_reduction: {
    keywords: [/stress/i, /relax/i, /calm/i, /anxiety/i, /overwhelm/i, /peace/i, /mindful/i],
    domains: ["mental health", "relaxation", "mindfulness"],
  },
  skill_development: {
    keywords: [/learn/i, /skill/i, /develop/i, /improve/i, /training/i, /education/i, /grow/i],
    domains: ["learning", "training", "development"],
  },
  financial_health: {
    keywords: [/financ/i, /money/i, /budget/i, /invest/i, /saving/i, /expense/i, /income/i],
    domains: ["budgeting", "investing", "expenses"],
  },
  work_life_balance: {
    keywords: [/balance/i, /work.*life/i, /life.*work/i, /boundary/i, /separation/i, /integration/i],
    domains: ["boundaries", "integration", "balance"],
  },
  personal_fulfillment: {
    keywords: [/fulfill/i, /purpose/i, /meaning/i, /passion/i, /joy/i, /satisfaction/i, /happy/i],
    domains: ["purpose", "meaning", "joy"],
  },
};

class LifeOptimizer {
  private statePath: string;
  private reportsPath: string;

  constructor() {
    this.statePath = config.statePath;
    this.reportsPath = config.reportsPath;
  }

  // Detect patterns from agent output
  detectPatternType(content: string): PatternType | null {
    for (const [patternType, indicators] of Object.entries(patternIndicators)) {
      for (const keyword of indicators.keywords) {
        if (keyword.test(content)) {
          return patternType as PatternType;
        }
      }
    }
    return null;
  }

  // Detect optimization category
  detectCategory(content: string): OptimizationCategory {
    let bestMatch: OptimizationCategory = "personal_fulfillment";
    let highestScore = 0;

    for (const [category, indicators] of Object.entries(categoryIndicators)) {
      let score = 0;
      for (const keyword of indicators.keywords) {
        if (keyword.test(content)) {
          score += 2;
        }
      }
      for (const domain of indicators.domains) {
        if (content.toLowerCase().includes(domain.toLowerCase())) {
          score += 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = category as OptimizationCategory;
      }
    }

    return bestMatch;
  }

  // Calculate impact level based on content signals
  calculateImpact(content: string): ImpactLevel {
    const transformativeSignals = /life.?changing|transform|breakthrough|major shift/i;
    const significantSignals = /significant|substantial|important|notable/i;
    const moderateSignals = /moderate|helpful|useful|beneficial/i;

    if (transformativeSignals.test(content)) return "transformative";
    if (significantSignals.test(content)) return "significant";
    if (moderateSignals.test(content)) return "moderate";
    return "minor";
  }

  // Extract patterns from agent output
  async extractPatterns(agentOutput: string, source: { agent: string; iteration: number }): Promise<LifePattern[]> {
    const patterns: LifePattern[] = [];
    const now = new Date().toISOString();

    // Try to parse JSON patterns first
    const jsonMatch = agentOutput.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.lifePatterns && Array.isArray(parsed.lifePatterns)) {
          for (const p of parsed.lifePatterns) {
            patterns.push({
              id: `pat-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
              category: p.category || this.detectCategory(p.description || ""),
              patternType: p.type || this.detectPatternType(p.description || "") || "trend",
              title: p.title || p.pattern || "Detected Pattern",
              description: p.description || "",
              evidence: p.evidence || [],
              frequency: p.frequency || "occasional",
              impact: p.impact || this.calculateImpact(p.description || ""),
              trend: p.trend || "stable",
              confidence: p.confidence || 0.6,
              detectedAt: now,
              lastSeen: now,
              occurrences: 1,
            });
          }
        }
      } catch {
        // Fall back to text extraction
      }
    }

    // Text-based pattern extraction
    const patternMatches = agentOutput.match(/pattern[:\s]+([^\n]+)/gi);
    if (patternMatches) {
      for (const match of patternMatches.slice(0, 5)) {
        const description = match.replace(/^pattern[:\s]+/i, "").trim();
        if (description.length > 20) {
          const patternType = this.detectPatternType(description);
          if (patternType) {
            patterns.push({
              id: `pat-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
              category: this.detectCategory(description),
              patternType,
              title: description.substring(0, 50) + (description.length > 50 ? "..." : ""),
              description,
              evidence: [`Detected by ${source.agent} in iteration ${source.iteration}`],
              frequency: "occasional",
              impact: this.calculateImpact(description),
              trend: "stable",
              confidence: 0.6,
              detectedAt: now,
              lastSeen: now,
              occurrences: 1,
            });
          }
        }
      }
    }

    return patterns;
  }

  // Generate suggestions based on patterns
  async generateSuggestions(patterns: LifePattern[]): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    const now = new Date().toISOString();

    // Group patterns by category
    const categoryPatterns = new Map<OptimizationCategory, LifePattern[]>();
    for (const pattern of patterns) {
      const existing = categoryPatterns.get(pattern.category) || [];
      existing.push(pattern);
      categoryPatterns.set(pattern.category, existing);
    }

    for (const [category, catPatterns] of categoryPatterns) {
      // Find negative habits to address
      const negativeHabits = catPatterns.filter(p => p.patternType === "negative_habit");
      for (const habit of negativeHabits.slice(0, 2)) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          category,
          title: `Address: ${habit.title}`,
          description: `Work on improving this pattern: ${habit.description}`,
          rationale: "Addressing negative habits frees up energy and improves overall life quality",
          basedOn: [habit.id],
          actionSteps: this.generateActionSteps(habit, "address"),
          effort: "medium",
          expectedImpact: habit.impact,
          timeframe: "this_week",
          priority: habit.impact === "transformative" ? "critical" : "high",
          status: "suggested",
          createdAt: now,
        });
      }

      // Find opportunities to leverage
      const opportunities = catPatterns.filter(p => p.patternType === "opportunity");
      for (const opp of opportunities.slice(0, 2)) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          category,
          title: `Capitalize on: ${opp.title}`,
          description: `Take advantage of this opportunity: ${opp.description}`,
          rationale: "Leveraging opportunities compounds positive outcomes",
          basedOn: [opp.id],
          actionSteps: this.generateActionSteps(opp, "capitalize"),
          effort: "low",
          expectedImpact: opp.impact,
          timeframe: "this_month",
          priority: "medium",
          status: "suggested",
          createdAt: now,
        });
      }

      // Find risks to mitigate
      const risks = catPatterns.filter(p => p.patternType === "risk");
      for (const risk of risks.slice(0, 1)) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          category,
          title: `Mitigate: ${risk.title}`,
          description: `Take action to address this risk: ${risk.description}`,
          rationale: "Proactive risk mitigation prevents larger problems",
          basedOn: [risk.id],
          actionSteps: this.generateActionSteps(risk, "mitigate"),
          effort: "high",
          expectedImpact: "significant",
          timeframe: "immediate",
          priority: "critical",
          status: "suggested",
          createdAt: now,
        });
      }

      // Reinforce positive habits
      const positiveHabits = catPatterns.filter(p => p.patternType === "positive_habit");
      for (const habit of positiveHabits.slice(0, 1)) {
        suggestions.push({
          id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          category,
          title: `Reinforce: ${habit.title}`,
          description: `Continue and strengthen this positive pattern: ${habit.description}`,
          rationale: "Reinforcing positive habits makes them more automatic and effective",
          basedOn: [habit.id],
          actionSteps: this.generateActionSteps(habit, "reinforce"),
          effort: "minimal",
          expectedImpact: "moderate",
          timeframe: "this_week",
          priority: "medium",
          status: "suggested",
          createdAt: now,
        });
      }
    }

    return suggestions;
  }

  // Generate action steps based on pattern and action type
  private generateActionSteps(pattern: LifePattern, actionType: string): string[] {
    const category = pattern.category;
    const baseSteps: Record<string, string[]> = {
      address: [
        "Identify the trigger for this behavior",
        "Set a specific, measurable goal to improve",
        "Create accountability by sharing with someone",
        "Track progress daily for one week",
        "Reward yourself for improvement",
      ],
      capitalize: [
        "Schedule time specifically for this opportunity",
        "Identify resources needed to pursue it",
        "Set a deadline for taking first action",
        "Create a simple plan with 3 key steps",
        "Review progress weekly",
      ],
      mitigate: [
        "Assess the full scope of the risk",
        "Identify warning signs to watch for",
        "Create a contingency plan",
        "Take one immediate preventive action",
        "Schedule a check-in to monitor",
      ],
      reinforce: [
        "Acknowledge and celebrate this positive pattern",
        "Make it easier by removing friction",
        "Connect it to a bigger purpose",
        "Share the benefit with others",
        "Build on it by adding a related habit",
      ],
    };

    const steps = baseSteps[actionType] || baseSteps.address;

    // Customize based on category
    const categoryCustomizations: Record<OptimizationCategory, string> = {
      time_management: "Block specific time on your calendar",
      energy_management: "Monitor your energy levels throughout the day",
      relationship_quality: "Schedule dedicated time for relationships",
      health_habits: "Track with a health app or journal",
      productivity: "Use a productivity system to track",
      stress_reduction: "Practice a relaxation technique daily",
      skill_development: "Set a learning goal for this week",
      financial_health: "Review your financial numbers",
      work_life_balance: "Set clear boundaries for work hours",
      personal_fulfillment: "Reflect on what brings you joy",
    };

    if (categoryCustomizations[category]) {
      steps.push(categoryCustomizations[category]);
    }

    return steps.slice(0, 5);
  }

  // Calculate category scores from patterns
  calculateCategoryScores(patterns: LifePattern[]): Record<OptimizationCategory, number> {
    const scores: Record<OptimizationCategory, number> = {
      time_management: 50,
      energy_management: 50,
      relationship_quality: 50,
      health_habits: 50,
      productivity: 50,
      stress_reduction: 50,
      skill_development: 50,
      financial_health: 50,
      work_life_balance: 50,
      personal_fulfillment: 50,
    };

    for (const pattern of patterns) {
      const category = pattern.category;
      let adjustment = 0;

      // Positive patterns increase score
      if (pattern.patternType === "positive_habit") {
        adjustment = pattern.impact === "transformative" ? 15 :
                     pattern.impact === "significant" ? 10 :
                     pattern.impact === "moderate" ? 5 : 2;
      }
      // Negative patterns decrease score
      else if (pattern.patternType === "negative_habit" || pattern.patternType === "risk") {
        adjustment = pattern.impact === "transformative" ? -15 :
                     pattern.impact === "significant" ? -10 :
                     pattern.impact === "moderate" ? -5 : -2;
      }
      // Opportunities slightly increase score
      else if (pattern.patternType === "opportunity") {
        adjustment = 3;
      }

      // Apply trend modifier
      if (pattern.trend === "improving") {
        adjustment *= 1.2;
      } else if (pattern.trend === "declining") {
        adjustment *= 0.8;
      }

      // Apply confidence modifier
      adjustment *= pattern.confidence;

      scores[category] = Math.max(0, Math.min(100, scores[category] + adjustment));
    }

    return scores;
  }

  // Generate weekly optimization report
  async generateWeeklyReport(): Promise<WeeklyOptimizationReport> {
    const now = new Date();
    const weekOf = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split("T")[0];

    // Load patterns
    const patterns = await this.getPatterns();
    const suggestions = await this.getSuggestions();

    // Calculate scores
    const categoryScores = this.calculateCategoryScores(patterns);
    const overallScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) / Object.keys(categoryScores).length;

    // Identify top patterns
    const topPatterns = patterns
      .filter(p => p.confidence >= 0.6)
      .sort((a, b) => {
        const impactOrder = { transformative: 4, significant: 3, moderate: 2, minor: 1 };
        return (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0);
      })
      .slice(0, 5);

    // Identify wins (completed positive patterns)
    const wins = patterns
      .filter(p => p.patternType === "positive_habit" && p.trend === "improving")
      .map(p => p.title)
      .slice(0, 3);

    // Identify areas for improvement
    const areasForImprovement = Object.entries(categoryScores)
      .filter(([_, score]) => score < 50)
      .sort((a, b) => a[1] - b[1])
      .map(([category]) => category)
      .slice(0, 3);

    // Select weekly focus (lowest scoring important category)
    const focusCategory = areasForImprovement[0] as OptimizationCategory || "personal_fulfillment";
    const focusSuggestions = suggestions.filter(s => s.category === focusCategory && s.status === "suggested");

    const report: WeeklyOptimizationReport = {
      id: `opt-report-${weekOf}`,
      weekOf,
      overallScore: Math.round(overallScore),
      categoryScores,
      topPatterns,
      suggestions: suggestions.filter(s => s.status === "suggested").slice(0, 10),
      wins: wins.length > 0 ? wins : ["Keep observing patterns for wins to emerge"],
      areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement : ["All areas balanced - maintain consistency"],
      weeklyFocus: {
        category: focusCategory,
        goal: `Improve ${focusCategory.replace(/_/g, " ")} score by focusing on key patterns`,
        actions: focusSuggestions[0]?.actionSteps || [
          "Identify one small improvement to make",
          "Track progress for 7 days",
          "Reflect on results at week end",
        ],
      },
      comparison: {
        vsLastWeek: 0, // Would need historical data
        vsLastMonth: 0,
        trend: "stable",
      },
      generatedAt: new Date().toISOString(),
    };

    // Save report
    await this.saveReport(report);

    return report;
  }

  // Save pattern
  async savePattern(pattern: LifePattern): Promise<void> {
    const patternsPath = `${this.statePath}/life-patterns.json`;
    let patterns: LifePattern[] = [];

    try {
      const file = Bun.file(patternsPath);
      if (await file.exists()) {
        patterns = await file.json();
      }
    } catch {
      // Fresh start
    }

    // Check for existing similar pattern
    const existingIndex = patterns.findIndex(
      p => p.category === pattern.category &&
           p.patternType === pattern.patternType &&
           p.title.toLowerCase() === pattern.title.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Update existing pattern
      patterns[existingIndex].lastSeen = pattern.lastSeen;
      patterns[existingIndex].occurrences += 1;
      patterns[existingIndex].confidence = Math.min(
        1.0,
        patterns[existingIndex].confidence + 0.05
      );
    } else {
      patterns.push(pattern);
    }

    await Bun.write(patternsPath, JSON.stringify(patterns, null, 2));
  }

  // Save suggestion
  async saveSuggestion(suggestion: OptimizationSuggestion): Promise<void> {
    const suggestionsPath = `${this.statePath}/life-suggestions.json`;
    let suggestions: OptimizationSuggestion[] = [];

    try {
      const file = Bun.file(suggestionsPath);
      if (await file.exists()) {
        suggestions = await file.json();
      }
    } catch {
      // Fresh start
    }

    suggestions.push(suggestion);
    await Bun.write(suggestionsPath, JSON.stringify(suggestions, null, 2));
  }

  // Save report
  async saveReport(report: WeeklyOptimizationReport): Promise<void> {
    const reportPath = `${this.reportsPath}/optimization/${report.weekOf}-optimization.json`;

    // Ensure directory exists
    const dir = `${this.reportsPath}/optimization`;
    await Bun.$`mkdir -p ${dir}`.quiet();

    await Bun.write(reportPath, JSON.stringify(report, null, 2));
  }

  // Get patterns
  async getPatterns(filters?: { category?: OptimizationCategory; patternType?: PatternType }): Promise<LifePattern[]> {
    const patternsPath = `${this.statePath}/life-patterns.json`;

    try {
      const file = Bun.file(patternsPath);
      if (!(await file.exists())) {
        return [];
      }

      let patterns: LifePattern[] = await file.json();

      if (filters?.category) {
        patterns = patterns.filter(p => p.category === filters.category);
      }
      if (filters?.patternType) {
        patterns = patterns.filter(p => p.patternType === filters.patternType);
      }

      return patterns;
    } catch {
      return [];
    }
  }

  // Get suggestions
  async getSuggestions(filters?: { category?: OptimizationCategory; status?: OptimizationSuggestion["status"] }): Promise<OptimizationSuggestion[]> {
    const suggestionsPath = `${this.statePath}/life-suggestions.json`;

    try {
      const file = Bun.file(suggestionsPath);
      if (!(await file.exists())) {
        return [];
      }

      let suggestions: OptimizationSuggestion[] = await file.json();

      if (filters?.category) {
        suggestions = suggestions.filter(s => s.category === filters.category);
      }
      if (filters?.status) {
        suggestions = suggestions.filter(s => s.status === filters.status);
      }

      return suggestions;
    } catch {
      return [];
    }
  }

  // Update suggestion status
  async updateSuggestionStatus(
    suggestionId: string,
    status: OptimizationSuggestion["status"],
    feedback?: string
  ): Promise<void> {
    const suggestionsPath = `${this.statePath}/life-suggestions.json`;

    try {
      const file = Bun.file(suggestionsPath);
      if (!(await file.exists())) return;

      const suggestions: OptimizationSuggestion[] = await file.json();
      const index = suggestions.findIndex(s => s.id === suggestionId);

      if (index >= 0) {
        suggestions[index].status = status;
        if (feedback) {
          suggestions[index].feedback = feedback;
        }
        if (status === "accepted") {
          suggestions[index].acceptedAt = new Date().toISOString();
        }
        if (status === "completed") {
          suggestions[index].completedAt = new Date().toISOString();
        }

        await Bun.write(suggestionsPath, JSON.stringify(suggestions, null, 2));
      }
    } catch {
      // Handle error silently
    }
  }

  // Process agent output for life patterns
  async processAgentOutput(
    agentOutput: string,
    source: { agent: string; iteration: number }
  ): Promise<{ patterns: LifePattern[]; suggestions: OptimizationSuggestion[] }> {
    // Extract patterns
    const patterns = await this.extractPatterns(agentOutput, source);

    // Save patterns
    for (const pattern of patterns) {
      await this.savePattern(pattern);
    }

    // Generate suggestions from patterns
    const suggestions = await this.generateSuggestions(patterns);

    // Save suggestions
    for (const suggestion of suggestions) {
      await this.saveSuggestion(suggestion);
    }

    return { patterns, suggestions };
  }

  // Get optimization summary for weekly report integration
  async getOptimizationSummary(): Promise<{
    overallScore: number;
    topPriorities: string[];
    wins: string[];
    focus: string;
  }> {
    const patterns = await this.getPatterns();
    const scores = this.calculateCategoryScores(patterns);
    const overallScore = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    );

    // Find low-scoring areas
    const lowScoreAreas = Object.entries(scores)
      .filter(([_, score]) => score < 50)
      .sort((a, b) => a[1] - b[1])
      .map(([category]) => category.replace(/_/g, " "));

    // Find wins
    const positivePatterns = patterns
      .filter(p => p.patternType === "positive_habit" && p.trend === "improving")
      .map(p => p.title);

    return {
      overallScore,
      topPriorities: lowScoreAreas.slice(0, 3),
      wins: positivePatterns.slice(0, 3),
      focus: lowScoreAreas[0] || "Maintain balance across all areas",
    };
  }
}

// Life optimization templates for reports
export const lifeOptimizationTemplates = {
  weekly_summary: `## Life Optimization Summary

### Overall Score: {{overallScore}}/100

### This Week's Wins 🎉
{{#wins}}
- {{.}}
{{/wins}}

### Areas for Focus 🎯
{{#topPriorities}}
- {{.}}
{{/topPriorities}}

### Weekly Focus
**{{focus}}**

---
*Generated: {{generatedAt}}*`,

  category_report: `## {{category}} Analysis

**Score**: {{score}}/100
**Trend**: {{trend}}

### Patterns Detected
{{#patterns}}
- **{{title}}** ({{patternType}})
  {{description}}
{{/patterns}}

### Suggestions
{{#suggestions}}
1. **{{title}}**
   {{description}}
   - Effort: {{effort}}
   - Expected Impact: {{expectedImpact}}
{{/suggestions}}

---
*Last updated: {{updatedAt}}*`,
};

export const lifeOptimizer = new LifeOptimizer();
