// Weekly Report Generator
// Creates comprehensive weekly summary reports

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { confidenceTracker } from "./confidence-tracker";
import { focusTracker } from "../context/focus-tracker";
import { dailyDigest } from "./daily-digest";
import { selfHealer } from "../overseer/self-healer";

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  generatedAt: Date;
  executiveSummary: string;
  insightsByArea: Record<string, { count: number; avgConfidence: number; topInsight: string }>;
  totalIterations: number;
  totalInsights: number;
  confidenceDistribution: { high: number; medium: number; low: number };
  topActionItems: string[];
  systemHealth: { uptime: number; healingAttempts: number; successRate: number };
  weeklyTrends: string[];
  recommendations: string[];
}

class WeeklyReportGenerator {
  private reportsPath: string;

  constructor() {
    this.reportsPath = `${config.triadPath}/${config.reportsPath}/weekly`;
  }

  /**
   * Generate the weekly report
   */
  async generate(): Promise<WeeklyReport> {
    const now = new Date();
    const weekEnd = now.toISOString().split("T")[0];
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Get all insights
    const allInsights = confidenceTracker.getAll();
    const stats = confidenceTracker.getStats();

    // Build insights by area
    const insightsByArea: Record<string, { count: number; avgConfidence: number; topInsight: string }> = {};
    for (const [area, count] of Object.entries(stats.byArea)) {
      const areaInsights = confidenceTracker.getByArea(area);
      const avgConfidence = areaInsights.length > 0
        ? areaInsights.reduce((sum, i) => sum + i.confidence, 0) / areaInsights.length
        : 0;
      const topInsight = areaInsights[0]?.title || "No insights yet";

      insightsByArea[area] = { count, avgConfidence, topInsight };
    }

    // Get focus stats
    const focusStats = focusTracker.getStats();

    // Get healer stats
    const healerStats = selfHealer.getStats();

    // Build executive summary
    const executiveSummary = this.buildExecutiveSummary(
      focusStats.totalIterations,
      stats.total,
      stats.actionable
    );

    // Build action items
    const actionable = confidenceTracker.getActionable();
    const topActionItems = actionable.slice(0, 10).map(i => `[${i.area}] ${i.title}`);

    // Build weekly trends
    const weeklyTrends = this.analyzeWeeklyTrends(allInsights, focusStats);

    // Build recommendations
    const recommendations = this.buildRecommendations(insightsByArea, focusStats);

    const report: WeeklyReport = {
      weekStart,
      weekEnd,
      generatedAt: now,
      executiveSummary,
      insightsByArea,
      totalIterations: focusStats.totalIterations,
      totalInsights: stats.total,
      confidenceDistribution: stats.byConfidence,
      topActionItems,
      systemHealth: {
        uptime: focusStats.totalIterations * config.iterationDelay / 1000 / 60, // rough minutes
        healingAttempts: healerStats.totalAttempts,
        successRate: healerStats.successRate,
      },
      weeklyTrends,
      recommendations,
    };

    // Save report
    await this.saveReport(report, weekEnd);

    await logger.reportGenerated("weekly", `${this.reportsPath}/week-${weekEnd}.json`);

    return report;
  }

  /**
   * Build executive summary
   */
  private buildExecutiveSummary(iterations: number, totalInsights: number, actionable: number): string {
    return `This week, Triad completed ${iterations} analysis iterations, generating ${totalInsights} insights ` +
      `with ${actionable} rated as actionable. The system continues to deepen its understanding of your ` +
      `life areas and identify opportunities for improvement.`;
  }

  /**
   * Analyze weekly trends
   */
  private analyzeWeeklyTrends(
    insights: { area: string; confidence: number; createdAt: Date }[],
    focusStats: { areas: { name: string; visitCount: number; insightsGenerated: number }[] }
  ): string[] {
    const trends: string[] = [];

    // Find most active area
    const mostActive = focusStats.areas
      .sort((a, b) => b.visitCount - a.visitCount)[0];
    if (mostActive?.visitCount > 0) {
      trends.push(`Most analyzed area: ${mostActive.name} (${mostActive.visitCount} visits)`);
    }

    // Find highest insight area
    const highestInsights = focusStats.areas
      .sort((a, b) => b.insightsGenerated - a.insightsGenerated)[0];
    if (highestInsights?.insightsGenerated > 0) {
      trends.push(`Most insights generated in: ${highestInsights.name}`);
    }

    // Check for underexplored areas
    const underexplored = focusStats.areas.filter(a => a.visitCount === 0);
    if (underexplored.length > 0) {
      trends.push(`Areas needing attention: ${underexplored.map(a => a.name).join(", ")}`);
    }

    return trends;
  }

  /**
   * Build recommendations
   */
  private buildRecommendations(
    insightsByArea: Record<string, { count: number; avgConfidence: number }>,
    focusStats: { areas: { name: string; visitCount: number }[] }
  ): string[] {
    const recommendations: string[] = [];

    // Recommend focusing on low-insight areas
    const lowInsightAreas = Object.entries(insightsByArea)
      .filter(([_, data]) => data.count < 3)
      .map(([area]) => area);
    if (lowInsightAreas.length > 0) {
      recommendations.push(`Increase focus on: ${lowInsightAreas.join(", ")}`);
    }

    // Recommend reviewing high-confidence insights
    const highConfAreas = Object.entries(insightsByArea)
      .filter(([_, data]) => data.avgConfidence >= config.highConfidence)
      .map(([area]) => area);
    if (highConfAreas.length > 0) {
      recommendations.push(`Review actionable insights in: ${highConfAreas.join(", ")}`);
    }

    // Default recommendation
    if (recommendations.length === 0) {
      recommendations.push("Continue building baseline understanding across all areas");
    }

    return recommendations;
  }

  /**
   * Save report to file
   */
  private async saveReport(report: WeeklyReport, weekEnd: string): Promise<void> {
    const filename = `${this.reportsPath}/week-${weekEnd}.json`;
    await Bun.write(filename, JSON.stringify(report, null, 2));

    // Also save as markdown
    const mdContent = this.formatAsMarkdown(report);
    await Bun.write(`${this.reportsPath}/week-${weekEnd}.md`, mdContent);
  }

  /**
   * Format report as markdown
   */
  private formatAsMarkdown(report: WeeklyReport): string {
    let md = `# Weekly Report\n\n`;
    md += `**Week**: ${report.weekStart} to ${report.weekEnd}\n\n`;
    md += `*Generated at ${report.generatedAt.toLocaleString()}*\n\n`;

    md += `## Executive Summary\n\n${report.executiveSummary}\n\n`;

    md += `## Insights by Area\n\n`;
    for (const [area, data] of Object.entries(report.insightsByArea)) {
      md += `### ${area}\n`;
      md += `- Insights: ${data.count}\n`;
      md += `- Avg Confidence: ${Math.round(data.avgConfidence * 100)}%\n`;
      md += `- Top Insight: ${data.topInsight}\n\n`;
    }

    md += `## Top Action Items\n\n`;
    for (const item of report.topActionItems) {
      md += `- ${item}\n`;
    }

    md += `\n## Weekly Trends\n\n`;
    for (const trend of report.weeklyTrends) {
      md += `- ${trend}\n`;
    }

    md += `\n## Recommendations\n\n`;
    for (const rec of report.recommendations) {
      md += `- ${rec}\n`;
    }

    md += `\n## System Health\n\n`;
    md += `- Uptime: ~${Math.round(report.systemHealth.uptime)} minutes\n`;
    md += `- Healing Attempts: ${report.systemHealth.healingAttempts}\n`;
    md += `- Success Rate: ${Math.round(report.systemHealth.successRate * 100)}%\n`;

    md += `\n## Confidence Distribution\n\n`;
    md += `- High: ${report.confidenceDistribution.high}\n`;
    md += `- Medium: ${report.confidenceDistribution.medium}\n`;
    md += `- Low: ${report.confidenceDistribution.low}\n`;

    return md;
  }

  /**
   * Get the latest report
   */
  async getLatest(): Promise<WeeklyReport | null> {
    try {
      const glob = new Bun.Glob("week-*.json");
      const files: string[] = [];
      for await (const file of glob.scan({ cwd: this.reportsPath })) {
        files.push(file);
      }
      if (files.length === 0) return null;

      const latest = files.sort().reverse()[0];
      const file = Bun.file(`${this.reportsPath}/${latest}`);
      return await file.json();
    } catch (error) {
      await logger.warn("weekly_report_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return null;
  }
}

export const weeklyReport = new WeeklyReportGenerator();
