// Freshness Tracker - Track data freshness and prioritize stale areas
// Phase 9.3: Data Freshness Management

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { notifier } from "../notifications/notifier";

// Freshness status
export type FreshnessStatus = "fresh" | "aging" | "stale" | "critical";

// Area freshness record
export interface AreaFreshness {
  area: string;
  lastAnalyzed: string;
  lastInsight: string | null;
  analysisCount: number;
  insightCount: number;
  averageQuality: number;
  status: FreshnessStatus;
  staleDays: number;
  priority: number; // 0-1, higher = more urgent
}

// Freshness thresholds (in hours)
interface FreshnessThresholds {
  fresh: number;
  aging: number;
  stale: number;
  critical: number;
}

const defaultThresholds: FreshnessThresholds = {
  fresh: 24, // Less than 24 hours
  aging: 48, // 24-48 hours
  stale: 72, // 48-72 hours
  critical: 168, // More than 72 hours (1 week)
};

// Area priority weights
const areaPriorityWeights: Record<string, number> = {
  hacker_valley_media: 1.0, // Core business
  career_skills: 0.7,
  financial: 0.9,
  personal_growth: 0.6,
  relationships: 0.8,
  meta_analysis: 0.5,
  meeting_analysis: 0.9,
  communications_analysis: 0.8,
};

class FreshnessTracker {
  private statePath: string;
  private freshnessPath: string;
  private thresholds: FreshnessThresholds;

  constructor() {
    this.statePath = config.statePath;
    this.freshnessPath = `${config.statePath}/freshness.json`;
    this.thresholds = defaultThresholds;
  }

  // Record analysis for an area
  async recordAnalysis(
    area: string,
    hasInsight: boolean,
    quality: number
  ): Promise<AreaFreshness> {
    const freshness = await this.loadFreshness();
    const now = new Date().toISOString();

    let areaData = freshness.find((f) => f.area === area);

    if (!areaData) {
      areaData = {
        area,
        lastAnalyzed: now,
        lastInsight: null,
        analysisCount: 0,
        insightCount: 0,
        averageQuality: 0,
        status: "fresh",
        staleDays: 0,
        priority: 0,
      };
      freshness.push(areaData);
    }

    // Update analysis data
    areaData.lastAnalyzed = now;
    areaData.analysisCount++;

    // Update quality (exponential moving average)
    const alpha = 0.3;
    areaData.averageQuality =
      alpha * quality + (1 - alpha) * (areaData.averageQuality || quality);

    if (hasInsight) {
      areaData.lastInsight = now;
      areaData.insightCount++;
    }

    // Update status and priority
    this.updateStatus(areaData);

    await this.saveFreshness(freshness);

    return areaData;
  }

  // Update freshness status for an area
  private updateStatus(areaData: AreaFreshness): void {
    const now = new Date();
    const lastAnalyzed = new Date(areaData.lastAnalyzed);
    const hoursSince = (now.getTime() - lastAnalyzed.getTime()) / (1000 * 60 * 60);

    // Determine status
    if (hoursSince < this.thresholds.fresh) {
      areaData.status = "fresh";
    } else if (hoursSince < this.thresholds.aging) {
      areaData.status = "aging";
    } else if (hoursSince < this.thresholds.stale) {
      areaData.status = "stale";
    } else {
      areaData.status = "critical";
    }

    areaData.staleDays = Math.floor(hoursSince / 24);

    // Calculate priority
    const baseWeight = areaPriorityWeights[areaData.area] || 0.5;
    const stalenessScore = Math.min(1.0, hoursSince / this.thresholds.critical);
    const qualityPenalty = areaData.averageQuality < 0.5 ? 0.2 : 0;

    areaData.priority = Math.min(1.0, baseWeight * stalenessScore + qualityPenalty);
  }

  // Get all area freshness data
  async getAllFreshness(): Promise<AreaFreshness[]> {
    const freshness = await this.loadFreshness();

    // Update all statuses
    for (const area of freshness) {
      this.updateStatus(area);
    }

    await this.saveFreshness(freshness);

    return freshness.sort((a, b) => b.priority - a.priority);
  }

  // Get stale areas that need attention
  async getStaleAreas(): Promise<AreaFreshness[]> {
    const freshness = await this.getAllFreshness();
    return freshness.filter(
      (f) => f.status === "stale" || f.status === "critical"
    );
  }

  // Get priority areas for next analysis
  async getPriorityAreas(limit: number = 3): Promise<string[]> {
    const freshness = await this.getAllFreshness();
    return freshness
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit)
      .map((f) => f.area);
  }

  // Get freshness for specific area
  async getAreaFreshness(area: string): Promise<AreaFreshness | null> {
    const freshness = await this.loadFreshness();
    const areaData = freshness.find((f) => f.area === area);

    if (areaData) {
      this.updateStatus(areaData);
    }

    return areaData || null;
  }

  // Check for freshness alerts
  async checkAlerts(): Promise<void> {
    const staleAreas = await this.getStaleAreas();

    for (const area of staleAreas) {
      if (area.status === "critical") {
        await notifier.checkTriggers(
          {
            severity: "critical",
            component: "freshness_tracker",
            errorMessage: `Area "${area.area}" has not been analyzed in ${area.staleDays} days`,
            errorCount: 1,
          },
          "freshness_tracker",
          area.area,
          "stale_area"
        );
      }
    }
  }

  // Get freshness summary
  async getSummary(): Promise<{
    totalAreas: number;
    byStatus: Record<FreshnessStatus, number>;
    averageStaleDays: number;
    priorityAreas: string[];
    healthScore: number;
  }> {
    const freshness = await this.getAllFreshness();

    const byStatus: Record<FreshnessStatus, number> = {
      fresh: 0,
      aging: 0,
      stale: 0,
      critical: 0,
    };

    let totalStaleDays = 0;

    for (const area of freshness) {
      byStatus[area.status]++;
      totalStaleDays += area.staleDays;
    }

    // Calculate health score (0-100)
    const weights = { fresh: 100, aging: 70, stale: 30, critical: 0 };
    let healthScore = 0;
    for (const [status, count] of Object.entries(byStatus)) {
      healthScore += (count / freshness.length) * weights[status as FreshnessStatus];
    }

    return {
      totalAreas: freshness.length,
      byStatus,
      averageStaleDays:
        freshness.length > 0 ? totalStaleDays / freshness.length : 0,
      priorityAreas: freshness.slice(0, 3).map((f) => f.area),
      healthScore,
    };
  }

  // Generate freshness report for inclusion in reports
  async getFreshnessReport(): Promise<string> {
    const summary = await this.getSummary();
    const freshness = await this.getAllFreshness();

    let report = `## Data Freshness Report\n\n`;
    report += `**Health Score**: ${summary.healthScore.toFixed(0)}/100\n`;
    report += `**Average Staleness**: ${summary.averageStaleDays.toFixed(1)} days\n\n`;

    report += `### Status Overview\n`;
    report += `- Fresh: ${summary.byStatus.fresh}\n`;
    report += `- Aging: ${summary.byStatus.aging}\n`;
    report += `- Stale: ${summary.byStatus.stale}\n`;
    report += `- Critical: ${summary.byStatus.critical}\n\n`;

    report += `### Priority Areas\n`;
    for (const area of freshness.slice(0, 5)) {
      const statusEmoji = {
        fresh: "✅",
        aging: "🟡",
        stale: "🟠",
        critical: "🔴",
      };
      report += `- ${statusEmoji[area.status]} **${area.area}**: `;
      report += `${area.staleDays}d old, priority ${(area.priority * 100).toFixed(0)}%\n`;
    }

    if (summary.byStatus.critical > 0 || summary.byStatus.stale > 0) {
      report += `\n### Recommendations\n`;
      for (const area of freshness.filter((f) => f.status === "critical" || f.status === "stale").slice(0, 3)) {
        report += `- Prioritize analysis of **${area.area}** (${area.staleDays} days since last analysis)\n`;
      }
    }

    return report;
  }

  // Suggest focus area for next iteration
  async suggestNextFocusArea(currentRotation: string[]): Promise<string> {
    const freshness = await this.getAllFreshness();

    // Find the highest priority area that's in the rotation
    for (const area of freshness) {
      if (currentRotation.includes(area.area)) {
        return area.area;
      }
    }

    // Default to first area in rotation
    return currentRotation[0];
  }

  // Initialize freshness data for all configured areas
  async initializeAreas(areas: string[]): Promise<void> {
    const freshness = await this.loadFreshness();

    for (const area of areas) {
      if (!freshness.find((f) => f.area === area)) {
        freshness.push({
          area,
          lastAnalyzed: new Date(0).toISOString(), // Never analyzed
          lastInsight: null,
          analysisCount: 0,
          insightCount: 0,
          averageQuality: 0,
          status: "critical",
          staleDays: 999,
          priority: 1.0,
        });
      }
    }

    await this.saveFreshness(freshness);
  }

  // Update thresholds
  updateThresholds(updates: Partial<FreshnessThresholds>): void {
    this.thresholds = { ...this.thresholds, ...updates };
  }

  // Load freshness data
  private async loadFreshness(): Promise<AreaFreshness[]> {
    try {
      const file = Bun.file(this.freshnessPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Save freshness data
  private async saveFreshness(freshness: AreaFreshness[]): Promise<void> {
    await Bun.write(this.freshnessPath, JSON.stringify(freshness, null, 2));
  }
}

export const freshnessTracker = new FreshnessTracker();
