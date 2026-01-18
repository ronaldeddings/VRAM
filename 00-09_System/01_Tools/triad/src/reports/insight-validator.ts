// Insight Validator - Multi-agent validation and insight graduation
// Phase 7.3: Insight Validation

import { config } from "../utils/config";
import { agentMemory, AgentType, KnowledgeItem } from "../context/agent-memory";

// Validation status
export type ValidationStatus =
  | "pending_validation"
  | "needs_review"
  | "validated"
  | "disputed"
  | "confirmed"
  | "rejected";

// Validation entry
export interface ValidationEntry {
  agent: AgentType;
  verdict: "agree" | "disagree" | "uncertain";
  confidence: number;
  reasoning: string;
  timestamp: string;
}

// Validated insight
export interface ValidatedInsight {
  id: string;
  originalInsightId: string;
  content: string;
  summary: string;
  category: string;
  source: {
    agent: AgentType;
    iteration: number;
    focusArea: string;
    timestamp: string;
  };
  originalConfidence: number;
  currentConfidence: number;
  validations: ValidationEntry[];
  status: ValidationStatus;
  graduatedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    validationCount: number;
    agreementCount: number;
    disagreementCount: number;
    consensusScore: number; // 0-1 score of how much agents agree
  };
}

// Validation rules
interface ValidationRule {
  name: string;
  check: (insight: ValidatedInsight) => { passed: boolean; message: string };
}

const validationRules: ValidationRule[] = [
  {
    name: "minimum_validations",
    check: (insight) => ({
      passed: insight.validations.length >= 2,
      message: insight.validations.length >= 2
        ? "Has sufficient validations"
        : `Needs ${2 - insight.validations.length} more validation(s)`,
    }),
  },
  {
    name: "majority_agreement",
    check: (insight) => {
      const agreements = insight.validations.filter(v => v.verdict === "agree").length;
      const total = insight.validations.filter(v => v.verdict !== "uncertain").length;
      const majority = total > 0 && agreements / total >= 0.5;
      return {
        passed: majority,
        message: majority
          ? "Majority of agents agree"
          : "Majority of agents disagree or uncertain",
      };
    },
  },
  {
    name: "confidence_threshold",
    check: (insight) => ({
      passed: insight.currentConfidence >= config.confidence.high,
      message: insight.currentConfidence >= config.confidence.high
        ? "Confidence meets threshold"
        : `Confidence ${(insight.currentConfidence * 100).toFixed(0)}% below ${(config.confidence.high * 100).toFixed(0)}% threshold`,
    }),
  },
  {
    name: "no_strong_disagreement",
    check: (insight) => {
      const strongDisagreements = insight.validations.filter(
        v => v.verdict === "disagree" && v.confidence >= 0.8
      );
      return {
        passed: strongDisagreements.length === 0,
        message: strongDisagreements.length === 0
          ? "No strong disagreements"
          : `${strongDisagreements.length} strong disagreement(s) from: ${strongDisagreements.map(d => d.agent).join(", ")}`,
      };
    },
  },
];

class InsightValidator {
  private statePath: string;
  private validatorPath: string;

  constructor() {
    this.statePath = config.statePath;
    this.validatorPath = `${config.statePath}/validated-insights.json`;
  }

  // Submit insight for validation
  async submitForValidation(insight: KnowledgeItem): Promise<ValidatedInsight> {
    const existing = await this.getValidatedInsight(insight.id);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const validatedInsight: ValidatedInsight = {
      id: `val-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      originalInsightId: insight.id,
      content: insight.content,
      summary: insight.summary,
      category: insight.tags[0] || "general",
      source: insight.source,
      originalConfidence: insight.confidence,
      currentConfidence: insight.confidence,
      validations: [],
      status: "pending_validation",
      createdAt: now,
      updatedAt: now,
      metadata: {
        validationCount: 0,
        agreementCount: 0,
        disagreementCount: 0,
        consensusScore: 0,
      },
    };

    await this.saveValidatedInsight(validatedInsight);
    return validatedInsight;
  }

  // Add validation from an agent
  async addValidation(
    insightId: string,
    validation: Omit<ValidationEntry, "timestamp">
  ): Promise<ValidatedInsight | null> {
    const insight = await this.getValidatedInsight(insightId);
    if (!insight) return null;

    // Check if agent already validated
    const existingValidation = insight.validations.find(v => v.agent === validation.agent);
    if (existingValidation) {
      // Update existing validation
      existingValidation.verdict = validation.verdict;
      existingValidation.confidence = validation.confidence;
      existingValidation.reasoning = validation.reasoning;
      existingValidation.timestamp = new Date().toISOString();
    } else {
      // Add new validation
      insight.validations.push({
        ...validation,
        timestamp: new Date().toISOString(),
      });
    }

    // Update metadata
    insight.metadata.validationCount = insight.validations.length;
    insight.metadata.agreementCount = insight.validations.filter(v => v.verdict === "agree").length;
    insight.metadata.disagreementCount = insight.validations.filter(v => v.verdict === "disagree").length;

    // Calculate consensus score
    const nonUncertain = insight.validations.filter(v => v.verdict !== "uncertain");
    if (nonUncertain.length > 0) {
      const agreements = nonUncertain.filter(v => v.verdict === "agree").length;
      const disagreements = nonUncertain.filter(v => v.verdict === "disagree").length;
      // Score is 1 if all agree, 0 if all disagree, 0.5 if split
      insight.metadata.consensusScore = agreements / (agreements + disagreements);
    }

    // Update confidence based on validations
    insight.currentConfidence = this.calculateAdjustedConfidence(insight);

    // Update status
    insight.status = this.determineStatus(insight);
    insight.updatedAt = new Date().toISOString();

    // Update in agent memory
    if (validation.verdict === "agree") {
      await agentMemory.validateKnowledge(insight.originalInsightId, validation.agent);
    } else if (validation.verdict === "disagree") {
      await agentMemory.disputeKnowledge(insight.originalInsightId, validation.agent, validation.reasoning);
    }

    await this.saveValidatedInsight(insight);
    return insight;
  }

  // Calculate adjusted confidence based on validations
  private calculateAdjustedConfidence(insight: ValidatedInsight): number {
    let confidence = insight.originalConfidence;

    for (const validation of insight.validations) {
      if (validation.verdict === "agree") {
        // Each agreement increases confidence
        confidence += 0.05 * validation.confidence;
      } else if (validation.verdict === "disagree") {
        // Each disagreement decreases confidence
        confidence -= 0.1 * validation.confidence;
      }
      // Uncertain has no effect
    }

    // Clamp between 0.1 and 1.0
    return Math.max(0.1, Math.min(1.0, confidence));
  }

  // Determine status based on validations
  private determineStatus(insight: ValidatedInsight): ValidationStatus {
    const validations = insight.validations;

    if (validations.length === 0) {
      return "pending_validation";
    }

    const agreements = validations.filter(v => v.verdict === "agree").length;
    const disagreements = validations.filter(v => v.verdict === "disagree").length;
    const total = validations.length;

    // Check for confirmation (all validation rules pass)
    const ruleResults = validationRules.map(rule => rule.check(insight));
    const allRulesPassed = ruleResults.every(r => r.passed);

    if (allRulesPassed && agreements >= 2 && disagreements === 0) {
      return "confirmed";
    }

    if (disagreements >= 2 || insight.metadata.consensusScore < 0.3) {
      return "disputed";
    }

    if (total >= 2 && agreements > disagreements) {
      return "validated";
    }

    if (validations.length > 0) {
      return "needs_review";
    }

    return "pending_validation";
  }

  // Try to graduate insight to confirmed status
  async tryGraduate(insightId: string): Promise<{
    graduated: boolean;
    insight: ValidatedInsight | null;
    ruleResults: Array<{ name: string; passed: boolean; message: string }>;
  }> {
    const insight = await this.getValidatedInsight(insightId);
    if (!insight) {
      return { graduated: false, insight: null, ruleResults: [] };
    }

    const ruleResults = validationRules.map(rule => ({
      name: rule.name,
      ...rule.check(insight),
    }));

    const allPassed = ruleResults.every(r => r.passed);

    if (allPassed && insight.status !== "confirmed") {
      insight.status = "confirmed";
      insight.graduatedAt = new Date().toISOString();
      insight.updatedAt = new Date().toISOString();
      await this.saveValidatedInsight(insight);
    }

    return {
      graduated: allPassed,
      insight,
      ruleResults,
    };
  }

  // Reject an insight
  async rejectInsight(insightId: string, reason: string): Promise<ValidatedInsight | null> {
    const insight = await this.getValidatedInsight(insightId);
    if (!insight) return null;

    insight.status = "rejected";
    insight.rejectedAt = new Date().toISOString();
    insight.updatedAt = new Date().toISOString();

    // Add rejection as a validation
    insight.validations.push({
      agent: "claude" as AgentType, // System rejection
      verdict: "disagree",
      confidence: 1.0,
      reasoning: `Rejected: ${reason}`,
      timestamp: new Date().toISOString(),
    });

    await this.saveValidatedInsight(insight);
    return insight;
  }

  // Generate validation prompt for agent
  generateValidationPrompt(insight: ValidatedInsight, forAgent: AgentType): string {
    return `## Insight Validation Task

You are being asked to validate an insight from ${insight.source.agent}.

### Original Insight
**Content**: ${insight.content}
**Category**: ${insight.category}
**Focus Area**: ${insight.source.focusArea}
**Original Confidence**: ${(insight.originalConfidence * 100).toFixed(0)}%
**Current Confidence**: ${(insight.currentConfidence * 100).toFixed(0)}%

### Existing Validations
${insight.validations.length > 0
  ? insight.validations.map(v =>
      `- **${v.agent}**: ${v.verdict} (${(v.confidence * 100).toFixed(0)}% confident) - "${v.reasoning}"`
    ).join("\n")
  : "No validations yet."}

### Your Task
Based on your analysis, do you:
1. **AGREE** - The insight is accurate and valuable
2. **DISAGREE** - The insight is inaccurate or misleading
3. **UNCERTAIN** - You cannot determine validity

Provide your response in JSON format:
\`\`\`json
{
  "verdict": "agree|disagree|uncertain",
  "confidence": 0.8,
  "reasoning": "Your explanation for the verdict"
}
\`\`\`

Consider:
- Is the insight factually accurate based on available data?
- Is it actionable and valuable?
- Does it contradict known information?
- Is the confidence level appropriate?
`;
  }

  // Parse validation response from agent
  parseValidationResponse(response: string): Omit<ValidationEntry, "timestamp" | "agent"> | null {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.verdict && ["agree", "disagree", "uncertain"].includes(parsed.verdict)) {
          return {
            verdict: parsed.verdict,
            confidence: parsed.confidence || 0.5,
            reasoning: parsed.reasoning || "No reasoning provided",
          };
        }
      }

      // Try to parse without code block
      if (response.toLowerCase().includes("agree")) {
        return { verdict: "agree", confidence: 0.6, reasoning: "Implicit agreement" };
      }
      if (response.toLowerCase().includes("disagree")) {
        return { verdict: "disagree", confidence: 0.6, reasoning: "Implicit disagreement" };
      }
    } catch {
      // Parse error
    }

    return null;
  }

  // Get insights pending validation
  async getPendingValidation(limit: number = 10): Promise<ValidatedInsight[]> {
    const insights = await this.loadInsights();
    return insights
      .filter(i => i.status === "pending_validation" || i.status === "needs_review")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, limit);
  }

  // Get validated insight by ID
  async getValidatedInsight(id: string): Promise<ValidatedInsight | null> {
    const insights = await this.loadInsights();
    return insights.find(i => i.id === id || i.originalInsightId === id) || null;
  }

  // Get insights by status
  async getInsightsByStatus(status: ValidationStatus): Promise<ValidatedInsight[]> {
    const insights = await this.loadInsights();
    return insights.filter(i => i.status === status);
  }

  // Get confirmed insights
  async getConfirmedInsights(limit?: number): Promise<ValidatedInsight[]> {
    const insights = await this.loadInsights();
    let confirmed = insights.filter(i => i.status === "confirmed");
    confirmed = confirmed.sort((a, b) =>
      new Date(b.graduatedAt || b.updatedAt).getTime() -
      new Date(a.graduatedAt || a.updatedAt).getTime()
    );
    return limit ? confirmed.slice(0, limit) : confirmed;
  }

  // Get validation statistics
  async getStats(): Promise<{
    total: number;
    byStatus: Record<ValidationStatus, number>;
    averageConfidence: number;
    averageValidations: number;
    graduationRate: number;
  }> {
    const insights = await this.loadInsights();

    const byStatus: Record<string, number> = {};
    let totalConfidence = 0;
    let totalValidations = 0;

    for (const insight of insights) {
      byStatus[insight.status] = (byStatus[insight.status] || 0) + 1;
      totalConfidence += insight.currentConfidence;
      totalValidations += insight.validations.length;
    }

    const confirmed = byStatus["confirmed"] || 0;
    const total = insights.length;

    return {
      total,
      byStatus: byStatus as Record<ValidationStatus, number>,
      averageConfidence: total > 0 ? totalConfidence / total : 0,
      averageValidations: total > 0 ? totalValidations / total : 0,
      graduationRate: total > 0 ? confirmed / total : 0,
    };
  }

  // Save validated insight
  private async saveValidatedInsight(insight: ValidatedInsight): Promise<void> {
    const insights = await this.loadInsights();
    const index = insights.findIndex(i => i.id === insight.id);

    if (index >= 0) {
      insights[index] = insight;
    } else {
      insights.push(insight);
    }

    await Bun.write(this.validatorPath, JSON.stringify(insights, null, 2));
  }

  // Load all insights
  private async loadInsights(): Promise<ValidatedInsight[]> {
    try {
      const file = Bun.file(this.validatorPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Process agent output for validation opportunities
  async processAgentOutputForValidation(
    agentOutput: string,
    agent: AgentType,
    iteration: number
  ): Promise<{
    validationsAdded: number;
    insightsCreated: number;
  }> {
    let validationsAdded = 0;
    let insightsCreated = 0;

    // Look for validation responses in output
    const validationMatches = agentOutput.matchAll(
      /validating insight[:\s]+([a-z0-9-]+)[\s\S]*?```json\s*([\s\S]*?)\s*```/gi
    );

    for (const match of validationMatches) {
      const insightId = match[1];
      try {
        const validation = JSON.parse(match[2]);
        if (validation.verdict) {
          await this.addValidation(insightId, {
            agent,
            verdict: validation.verdict,
            confidence: validation.confidence || 0.5,
            reasoning: validation.reasoning || "",
          });
          validationsAdded++;
        }
      } catch {
        // Parse error, skip
      }
    }

    // Also extract knowledge and submit for validation
    const knowledgeItems = await agentMemory.extractKnowledge(agentOutput, {
      agent,
      iteration,
      focusArea: "validation",
    });

    for (const item of knowledgeItems) {
      if (item.confidence >= config.confidence.medium) {
        await this.submitForValidation(item);
        insightsCreated++;
      }
    }

    return { validationsAdded, insightsCreated };
  }
}

export const insightValidator = new InsightValidator();
