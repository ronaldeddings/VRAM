// Daily Digest Generator
// Creates daily summary reports for Ron

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { confidenceTracker } from "./confidence-tracker";
import { focusTracker } from "../context/focus-tracker";
import { outputManager } from "../utils/output-manager";
import { overseer } from "../overseer/overseer";

export interface DailyDigest {
  date: string;
  generatedAt: Date;
  summary: string;
  topInsights: { title: string; content: string; confidence: number; area: string }[];
  areasCovered: string[];
  iterationsRun: number;
  healthStatus: string;
  actionItems: string[];
  nextFocus: string;
}

class DailyDigestGenerator {
  private reportsPath: string;

  constructor() {
    this.reportsPath = `${config.triadPath}/${config.reportsPath}/daily`;
  }

  /**
   * Generate the daily digest
   */
  async generate(): Promise<DailyDigest> {
    const today = new Date().toISOString().split("T")[0];

    // Get top insights
    const actionableInsights = confidenceTracker.getActionable().slice(0, 5);
    const recentInsights = confidenceTracker.getRecent(10);
    const topInsights = actionableInsights.length > 0 ? actionableInsights : recentInsights.slice(0, 5);

    // Get focus area stats
    const focusStats = focusTracker.getStats();
    const areasCovered = focusStats.areas
      .filter(a => a.visitCount > 0 && a.lastVisited?.toISOString().startsWith(today))
      .map(a => a.name);

    // Get output stats
    const outputStats = outputManager.getStats();

    // Get overseer status
    const overseerStatus = overseer.getStatus();

    // Determine next focus
    const nextFocus = focusTracker.getCurrentFocusArea();

    // Build summary
    const summary = this.buildSummary(topInsights.length, areasCovered.length, outputStats.totalIterations);

    // Build action items
    const actionItems = this.buildActionItems(topInsights);

    const digest: DailyDigest = {
      date: today,
      generatedAt: new Date(),
      summary,
      topInsights: topInsights.map(i => ({
        title: i.title,
        content: i.content.substring(0, 200) + (i.content.length > 200 ? "..." : ""),
        confidence: i.confidence,
        area: i.area,
      })),
      areasCovered,
      iterationsRun: outputStats.totalIterations,
      healthStatus: overseerStatus.healthStatus,
      actionItems,
      nextFocus: nextFocus.name,
    };

    // Save digest
    await this.saveDigest(digest);

    await logger.reportGenerated("daily", `${this.reportsPath}/${today}.json`);

    return digest;
  }

  /**
   * Build the summary text
   */
  private buildSummary(insightsCount: number, areasCount: number, iterations: number): string {
    return `Today, Triad analyzed ${areasCount} life areas across ${iterations} iterations, generating ${insightsCount} actionable insights. ` +
      `The system continues to build understanding of your work, finances, personal growth, and relationships.`;
  }

  /**
   * Build action items from insights
   */
  private buildActionItems(insights: { title: string; area: string; confidence: number }[]): string[] {
    const items: string[] = [];

    for (const insight of insights.slice(0, 5)) {
      if (insight.confidence >= config.actionableThreshold) {
        items.push(`[${insight.area}] Review: ${insight.title}`);
      }
    }

    if (items.length === 0) {
      items.push("Continue building insights - no high-confidence actions yet");
    }

    return items;
  }

  /**
   * Save digest to file
   */
  private async saveDigest(digest: DailyDigest): Promise<void> {
    const filename = `${this.reportsPath}/${digest.date}.json`;
    await Bun.write(filename, JSON.stringify(digest, null, 2));

    // Also save as markdown for easy reading
    const mdContent = this.formatAsMarkdown(digest);
    await Bun.write(`${this.reportsPath}/${digest.date}.md`, mdContent);
  }

  /**
   * Format digest as markdown
   */
  private formatAsMarkdown(digest: DailyDigest): string {
    let md = `# Daily Digest - ${digest.date}\n\n`;
    md += `*Generated at ${digest.generatedAt.toLocaleString()}*\n\n`;
    md += `## Summary\n\n${digest.summary}\n\n`;

    md += `## Top Insights\n\n`;
    for (const insight of digest.topInsights) {
      md += `### ${insight.title}\n`;
      md += `*${insight.area} | Confidence: ${Math.round(insight.confidence * 100)}%*\n\n`;
      md += `${insight.content}\n\n`;
    }

    md += `## Action Items\n\n`;
    for (const item of digest.actionItems) {
      md += `- ${item}\n`;
    }

    md += `\n## System Status\n\n`;
    md += `- **Health**: ${digest.healthStatus}\n`;
    md += `- **Iterations Today**: ${digest.iterationsRun}\n`;
    md += `- **Areas Covered**: ${digest.areasCovered.join(", ") || "None yet"}\n`;
    md += `- **Next Focus**: ${digest.nextFocus}\n`;

    return md;
  }

  /**
   * Get the latest digest
   */
  async getLatest(): Promise<DailyDigest | null> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const file = Bun.file(`${this.reportsPath}/${today}.json`);
      if (await file.exists()) {
        return await file.json();
      }
    } catch (error) {
      await logger.warn("daily_digest_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return null;
  }

  /**
   * List available digests
   */
  async listDigests(): Promise<string[]> {
    try {
      const glob = new Bun.Glob("*.json");
      const files: string[] = [];
      for await (const file of glob.scan({ cwd: this.reportsPath })) {
        files.push(file.replace(".json", ""));
      }
      return files.sort().reverse();
    } catch {
      return [];
    }
  }
}

export const dailyDigest = new DailyDigestGenerator();
