// Quality Tracker - Track and monitor output quality metrics
// Phase 9.1: Quality and Resilience

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { notifier } from "../notifications/notifier";

// Quality dimensions
export type QualityDimension =
  | "relevance"
  | "accuracy"
  | "actionability"
  | "timeliness"
  | "clarity"
  | "depth"
  | "novelty";

// Agent quality score
export interface AgentQualityScore {
  agent: string;
  iteration: number;
  focusArea: string;
  timestamp: string;
  scores: Record<QualityDimension, number>;
  overallScore: number;
  outputLength: number;
  insightsExtracted: number;
  errorCount: number;
  processingTime: number;
}

// Quality trend
export interface QualityTrend {
  dimension: QualityDimension;
  direction: "improving" | "stable" | "declining";
  changeRate: number; // Percentage change
  period: string;
}

// Quality alert
export interface QualityAlert {
  id: string;
  type: "degradation" | "anomaly" | "threshold" | "trend";
  severity: "warning" | "critical";
  dimension: QualityDimension;
  agent?: string;
  message: string;
  currentValue: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
}

// Quality thresholds
interface QualityThresholds {
  minimum: Record<QualityDimension, number>;
  target: Record<QualityDimension, number>;
  degradationPercent: number;
}

const defaultThresholds: QualityThresholds = {
  minimum: {
    relevance: 0.5,
    accuracy: 0.6,
    actionability: 0.4,
    timeliness: 0.5,
    clarity: 0.5,
    depth: 0.4,
    novelty: 0.3,
  },
  target: {
    relevance: 0.8,
    accuracy: 0.85,
    actionability: 0.7,
    timeliness: 0.75,
    clarity: 0.8,
    depth: 0.7,
    novelty: 0.5,
  },
  degradationPercent: 15, // Alert if quality drops by 15%
};

class QualityTracker {
  private statePath: string;
  private scoresPath: string;
  private alertsPath: string;
  private thresholds: QualityThresholds;

  constructor() {
    this.statePath = config.statePath;
    this.scoresPath = `${config.statePath}/quality-scores.json`;
    this.alertsPath = `${config.statePath}/quality-alerts.json`;
    this.thresholds = defaultThresholds;
  }

  // Record quality score for an agent run
  async recordScore(params: {
    agent: string;
    iteration: number;
    focusArea: string;
    output: string;
    insightsExtracted: number;
    errorCount: number;
    processingTime: number;
  }): Promise<AgentQualityScore> {
    const scores = this.evaluateOutput(params.output, params.focusArea);
    const overallScore = this.calculateOverallScore(scores);

    const qualityScore: AgentQualityScore = {
      agent: params.agent,
      iteration: params.iteration,
      focusArea: params.focusArea,
      timestamp: new Date().toISOString(),
      scores,
      overallScore,
      outputLength: params.output.length,
      insightsExtracted: params.insightsExtracted,
      errorCount: params.errorCount,
      processingTime: params.processingTime,
    };

    // Save score
    await this.saveScore(qualityScore);

    // Check for alerts
    await this.checkAlerts(qualityScore);

    return qualityScore;
  }

  // Evaluate output quality
  private evaluateOutput(
    output: string,
    focusArea: string
  ): Record<QualityDimension, number> {
    const scores: Record<QualityDimension, number> = {
      relevance: 0,
      accuracy: 0,
      actionability: 0,
      timeliness: 0,
      clarity: 0,
      depth: 0,
      novelty: 0,
    };

    // Relevance: Check for focus area mentions and related terms
    const relevanceTerms = this.getRelevanceTerms(focusArea);
    const relevanceCount = relevanceTerms.reduce((count, term) => {
      const regex = new RegExp(term, "gi");
      return count + (output.match(regex)?.length || 0);
    }, 0);
    scores.relevance = Math.min(1.0, relevanceCount / 10);

    // Accuracy: Check for confidence indicators and hedging language
    const hedgingTerms = ["might", "could", "possibly", "uncertain", "unclear"];
    const hedgingCount = hedgingTerms.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      return count + (output.match(regex)?.length || 0);
    }, 0);
    scores.accuracy = Math.max(0.3, 1.0 - hedgingCount * 0.1);

    // Actionability: Check for action verbs and recommendations
    const actionTerms = [
      "should",
      "recommend",
      "action",
      "follow up",
      "reach out",
      "schedule",
      "consider",
      "prioritize",
      "next step",
    ];
    const actionCount = actionTerms.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      return count + (output.match(regex)?.length || 0);
    }, 0);
    scores.actionability = Math.min(1.0, actionCount / 5);

    // Timeliness: Check for time-sensitive language
    const timeTerms = [
      "urgent",
      "immediate",
      "deadline",
      "today",
      "this week",
      "soon",
      "overdue",
      "pending",
    ];
    const timeCount = timeTerms.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      return count + (output.match(regex)?.length || 0);
    }, 0);
    scores.timeliness = Math.min(1.0, 0.5 + timeCount * 0.1);

    // Clarity: Check for structure and readability indicators
    const hasHeaders = /^##?\s+/m.test(output);
    const hasBullets = /^[-*]\s+/m.test(output);
    const avgSentenceLength = this.calculateAvgSentenceLength(output);
    scores.clarity =
      (hasHeaders ? 0.2 : 0) +
      (hasBullets ? 0.2 : 0) +
      Math.max(0, 0.6 - avgSentenceLength / 100);

    // Depth: Check for detailed analysis indicators
    const depthTerms = [
      "because",
      "therefore",
      "analysis",
      "trend",
      "pattern",
      "correlation",
      "insight",
      "suggests",
    ];
    const depthCount = depthTerms.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      return count + (output.match(regex)?.length || 0);
    }, 0);
    scores.depth = Math.min(1.0, depthCount / 8);

    // Novelty: Check for unique findings indicators
    const noveltyTerms = [
      "discovered",
      "surprising",
      "unexpected",
      "new",
      "interesting",
      "notable",
      "unique",
      "first time",
    ];
    const noveltyCount = noveltyTerms.reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      return count + (output.match(regex)?.length || 0);
    }, 0);
    scores.novelty = Math.min(1.0, noveltyCount / 4);

    return scores;
  }

  // Get relevance terms for focus area
  private getRelevanceTerms(focusArea: string): string[] {
    const termMap: Record<string, string[]> = {
      hacker_valley_media: [
        "podcast",
        "episode",
        "sponsor",
        "content",
        "audience",
        "cybersecurity",
        "guest",
      ],
      career_skills: [
        "skill",
        "learning",
        "career",
        "growth",
        "development",
        "training",
        "improvement",
      ],
      financial: [
        "budget",
        "revenue",
        "expense",
        "investment",
        "financial",
        "money",
        "cost",
      ],
      personal_growth: [
        "goal",
        "habit",
        "routine",
        "health",
        "wellness",
        "improvement",
        "progress",
      ],
      relationships: [
        "family",
        "friend",
        "relationship",
        "connection",
        "social",
        "community",
        "network",
      ],
      meta_analysis: [
        "pattern",
        "trend",
        "correlation",
        "synthesis",
        "overview",
        "summary",
        "analysis",
      ],
      meeting_analysis: [
        "meeting",
        "discussion",
        "decision",
        "action item",
        "follow-up",
        "attendee",
      ],
      communications_analysis: [
        "email",
        "message",
        "communication",
        "response",
        "thread",
        "conversation",
      ],
    };

    return termMap[focusArea] || [focusArea.replace(/_/g, " ")];
  }

  // Calculate average sentence length
  private calculateAvgSentenceLength(text: string): number {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    const totalWords = sentences.reduce(
      (sum, s) => sum + s.trim().split(/\s+/).length,
      0
    );
    return totalWords / sentences.length;
  }

  // Calculate overall score
  private calculateOverallScore(
    scores: Record<QualityDimension, number>
  ): number {
    const weights: Record<QualityDimension, number> = {
      relevance: 0.2,
      accuracy: 0.2,
      actionability: 0.2,
      timeliness: 0.1,
      clarity: 0.1,
      depth: 0.1,
      novelty: 0.1,
    };

    let total = 0;
    for (const [dimension, weight] of Object.entries(weights)) {
      total += scores[dimension as QualityDimension] * weight;
    }

    return total;
  }

  // Check for quality alerts
  private async checkAlerts(score: AgentQualityScore): Promise<void> {
    const alerts: QualityAlert[] = [];

    // Check threshold violations
    for (const [dimension, value] of Object.entries(score.scores)) {
      const dim = dimension as QualityDimension;
      const minimum = this.thresholds.minimum[dim];

      if (value < minimum) {
        alerts.push({
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          type: "threshold",
          severity: value < minimum * 0.5 ? "critical" : "warning",
          dimension: dim,
          agent: score.agent,
          message: `${dim} score (${(value * 100).toFixed(0)}%) below minimum threshold (${(minimum * 100).toFixed(0)}%)`,
          currentValue: value,
          threshold: minimum,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        });
      }
    }

    // Check for degradation compared to recent history
    const recentScores = await this.getRecentScores(score.agent, 5);
    if (recentScores.length >= 3) {
      const avgRecent = this.calculateAverageScore(recentScores);

      for (const [dimension, value] of Object.entries(score.scores)) {
        const dim = dimension as QualityDimension;
        const avgValue = avgRecent[dim];
        const changePercent = ((avgValue - value) / avgValue) * 100;

        if (changePercent >= this.thresholds.degradationPercent) {
          alerts.push({
            id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            type: "degradation",
            severity: changePercent >= this.thresholds.degradationPercent * 2 ? "critical" : "warning",
            dimension: dim,
            agent: score.agent,
            message: `${dim} score dropped ${changePercent.toFixed(0)}% from recent average`,
            currentValue: value,
            threshold: avgValue,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          });
        }
      }
    }

    // Save and notify for alerts
    for (const alert of alerts) {
      await this.saveAlert(alert);
      await notifier.checkTriggers(
        {
          severity: alert.severity,
          component: "quality_tracker",
          errorMessage: alert.message,
          errorCount: 1,
        },
        "quality_tracker",
        alert.id,
        "quality_alert"
      );
    }
  }

  // Calculate average scores from multiple entries
  private calculateAverageScore(
    scores: AgentQualityScore[]
  ): Record<QualityDimension, number> {
    const dimensions: QualityDimension[] = [
      "relevance",
      "accuracy",
      "actionability",
      "timeliness",
      "clarity",
      "depth",
      "novelty",
    ];

    const avg: Record<QualityDimension, number> = {} as Record<
      QualityDimension,
      number
    >;

    for (const dim of dimensions) {
      const sum = scores.reduce((total, s) => total + s.scores[dim], 0);
      avg[dim] = sum / scores.length;
    }

    return avg;
  }

  // Get quality trends
  async getTrends(period: "day" | "week" | "month" = "week"): Promise<QualityTrend[]> {
    const allScores = await this.loadScores();
    const now = new Date();
    const periodMs =
      period === "day"
        ? 24 * 60 * 60 * 1000
        : period === "week"
          ? 7 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

    const recentScores = allScores.filter(
      (s) => now.getTime() - new Date(s.timestamp).getTime() < periodMs
    );

    const previousScores = allScores.filter(
      (s) =>
        now.getTime() - new Date(s.timestamp).getTime() >= periodMs &&
        now.getTime() - new Date(s.timestamp).getTime() < periodMs * 2
    );

    if (recentScores.length === 0 || previousScores.length === 0) {
      return [];
    }

    const recentAvg = this.calculateAverageScore(recentScores);
    const previousAvg = this.calculateAverageScore(previousScores);

    const dimensions: QualityDimension[] = [
      "relevance",
      "accuracy",
      "actionability",
      "timeliness",
      "clarity",
      "depth",
      "novelty",
    ];

    const trends: QualityTrend[] = [];

    for (const dim of dimensions) {
      const changeRate =
        previousAvg[dim] > 0
          ? ((recentAvg[dim] - previousAvg[dim]) / previousAvg[dim]) * 100
          : 0;

      trends.push({
        dimension: dim,
        direction:
          changeRate > 5 ? "improving" : changeRate < -5 ? "declining" : "stable",
        changeRate,
        period,
      });
    }

    return trends;
  }

  // Get agent quality summary
  async getAgentSummary(agent?: string): Promise<{
    totalScores: number;
    averageScore: number;
    byAgent: Record<string, { count: number; avgScore: number }>;
    byFocusArea: Record<string, { count: number; avgScore: number }>;
    recentTrend: "improving" | "stable" | "declining";
  }> {
    const scores = await this.loadScores();
    const filteredScores = agent ? scores.filter((s) => s.agent === agent) : scores;

    if (filteredScores.length === 0) {
      return {
        totalScores: 0,
        averageScore: 0,
        byAgent: {},
        byFocusArea: {},
        recentTrend: "stable",
      };
    }

    const byAgent: Record<string, { count: number; totalScore: number }> = {};
    const byFocusArea: Record<string, { count: number; totalScore: number }> = {};
    let totalScore = 0;

    for (const score of filteredScores) {
      totalScore += score.overallScore;

      if (!byAgent[score.agent]) {
        byAgent[score.agent] = { count: 0, totalScore: 0 };
      }
      byAgent[score.agent].count++;
      byAgent[score.agent].totalScore += score.overallScore;

      if (!byFocusArea[score.focusArea]) {
        byFocusArea[score.focusArea] = { count: 0, totalScore: 0 };
      }
      byFocusArea[score.focusArea].count++;
      byFocusArea[score.focusArea].totalScore += score.overallScore;
    }

    // Calculate recent trend
    const trends = await this.getTrends("day");
    const overallTrend = trends.reduce((sum, t) => sum + t.changeRate, 0) / trends.length;
    const recentTrend: "improving" | "stable" | "declining" =
      overallTrend > 3 ? "improving" : overallTrend < -3 ? "declining" : "stable";

    return {
      totalScores: filteredScores.length,
      averageScore: totalScore / filteredScores.length,
      byAgent: Object.fromEntries(
        Object.entries(byAgent).map(([k, v]) => [
          k,
          { count: v.count, avgScore: v.totalScore / v.count },
        ])
      ),
      byFocusArea: Object.fromEntries(
        Object.entries(byFocusArea).map(([k, v]) => [
          k,
          { count: v.count, avgScore: v.totalScore / v.count },
        ])
      ),
      recentTrend,
    };
  }

  // Get quality report for inclusion in daily/weekly reports
  async getQualityReport(): Promise<string> {
    const summary = await this.getAgentSummary();
    const trends = await this.getTrends("week");
    const alerts = await this.getActiveAlerts();

    let report = `## Quality Metrics\n\n`;
    report += `**Overall Score**: ${(summary.averageScore * 100).toFixed(0)}%\n`;
    report += `**Recent Trend**: ${summary.recentTrend}\n`;
    report += `**Total Evaluations**: ${summary.totalScores}\n\n`;

    report += `### By Agent\n`;
    for (const [agent, data] of Object.entries(summary.byAgent)) {
      report += `- **${agent}**: ${(data.avgScore * 100).toFixed(0)}% avg (${data.count} runs)\n`;
    }

    report += `\n### Weekly Trends\n`;
    for (const trend of trends) {
      const emoji =
        trend.direction === "improving"
          ? "📈"
          : trend.direction === "declining"
            ? "📉"
            : "➡️";
      report += `- ${emoji} **${trend.dimension}**: ${trend.direction} (${trend.changeRate > 0 ? "+" : ""}${trend.changeRate.toFixed(1)}%)\n`;
    }

    if (alerts.length > 0) {
      report += `\n### Active Alerts\n`;
      for (const alert of alerts) {
        const emoji = alert.severity === "critical" ? "🚨" : "⚠️";
        report += `- ${emoji} ${alert.message}\n`;
      }
    }

    return report;
  }

  // Get active alerts
  async getActiveAlerts(): Promise<QualityAlert[]> {
    const alerts = await this.loadAlerts();
    return alerts.filter((a) => !a.acknowledged);
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<QualityAlert | null> {
    const alerts = await this.loadAlerts();
    const alert = alerts.find((a) => a.id === alertId);

    if (!alert) return null;

    alert.acknowledged = true;
    await this.saveAllAlerts(alerts);

    return alert;
  }

  // Get recent scores
  async getRecentScores(agent?: string, limit: number = 10): Promise<AgentQualityScore[]> {
    const scores = await this.loadScores();
    let filtered = agent ? scores.filter((s) => s.agent === agent) : scores;

    filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return filtered.slice(0, limit);
  }

  // Update thresholds
  updateThresholds(updates: Partial<QualityThresholds>): void {
    this.thresholds = { ...this.thresholds, ...updates };
  }

  // Save score
  private async saveScore(score: AgentQualityScore): Promise<void> {
    const scores = await this.loadScores();
    scores.push(score);

    // Keep last 1000 scores
    if (scores.length > 1000) {
      scores.splice(0, scores.length - 1000);
    }

    await Bun.write(this.scoresPath, JSON.stringify(scores, null, 2));
  }

  // Save alert
  private async saveAlert(alert: QualityAlert): Promise<void> {
    const alerts = await this.loadAlerts();
    alerts.push(alert);

    // Keep last 100 alerts
    if (alerts.length > 100) {
      alerts.splice(0, alerts.length - 100);
    }

    await Bun.write(this.alertsPath, JSON.stringify(alerts, null, 2));
  }

  // Save all alerts
  private async saveAllAlerts(alerts: QualityAlert[]): Promise<void> {
    await Bun.write(this.alertsPath, JSON.stringify(alerts, null, 2));
  }

  // Load scores
  private async loadScores(): Promise<AgentQualityScore[]> {
    try {
      const file = Bun.file(this.scoresPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Load alerts
  private async loadAlerts(): Promise<QualityAlert[]> {
    try {
      const file = Bun.file(this.alertsPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }
}

export const qualityTracker = new QualityTracker();
