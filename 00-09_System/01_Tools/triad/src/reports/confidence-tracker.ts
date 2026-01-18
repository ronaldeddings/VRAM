// Confidence Tracker
// Tracks confidence levels for insights and recommendations

import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface InsightCard {
  id: string;
  title: string;
  content: string;
  area: string;
  confidence: number; // 0.0 to 1.0
  sources: string[];
  createdAt: Date;
  updatedAt: Date;
  validations: number;
  actionable: boolean;
}

export interface ConfidenceUpdate {
  insightId: string;
  previousConfidence: number;
  newConfidence: number;
  reason: string;
  timestamp: Date;
}

class ConfidenceTracker {
  private insights: Map<string, InsightCard> = new Map();
  private updates: ConfidenceUpdate[] = [];
  private stateFilePath: string;
  private confidenceFilePath: string;

  constructor() {
    this.stateFilePath = `${config.triadPath}/${config.statePath}/insights.json`;
    this.confidenceFilePath = `${config.triadPath}/${config.statePath}/confidence.json`;
  }

  /**
   * Load insights from disk
   */
  async loadInsights(): Promise<void> {
    try {
      const file = Bun.file(this.stateFilePath);
      if (await file.exists()) {
        const data = await file.json();
        for (const insight of data.insights || []) {
          this.insights.set(insight.id, {
            ...insight,
            createdAt: new Date(insight.createdAt),
            updatedAt: new Date(insight.updatedAt),
          });
        }
        await logger.debug("insights_loaded", { count: this.insights.size });
      }
    } catch (error) {
      await logger.warn("insights_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save insights to disk
   */
  async saveInsights(): Promise<void> {
    try {
      const data = {
        insights: Array.from(this.insights.values()),
        lastUpdated: new Date().toISOString(),
      };
      await Bun.write(this.stateFilePath, JSON.stringify(data, null, 2));
      // Also sync to confidence.json for summary view
      await this.saveConfidenceSummary();
    } catch (error) {
      await logger.error("insights_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save confidence summary to confidence.json (syncs insights → confidence.json)
   */
  async saveConfidenceSummary(): Promise<void> {
    try {
      const stats = this.getStats();
      const allInsights = Array.from(this.insights.values());

      // Convert insights to findings format for confidence.json
      const findings = allInsights.map(insight => ({
        id: insight.id,
        title: insight.title,
        area: insight.area,
        confidence: insight.confidence,
        actionable: insight.actionable,
        validations: insight.validations,
        createdAt: insight.createdAt,
        updatedAt: insight.updatedAt,
      }));

      const confidenceData = {
        findings,
        thresholds: {
          low: config.lowConfidence,
          medium: config.mediumConfidence,
          high: config.highConfidence,
          actionable: config.actionableThreshold,
        },
        stats: {
          total: stats.total,
          byConfidence: stats.byConfidence,
          actionable: stats.actionable,
        },
        lastUpdated: new Date().toISOString(),
      };

      await Bun.write(this.confidenceFilePath, JSON.stringify(confidenceData, null, 2));
      await logger.debug("confidence_summary_saved", {
        total: stats.total,
        actionable: stats.actionable
      });
    } catch (error) {
      await logger.error("confidence_summary_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Add a new insight
   */
  async addInsight(
    title: string,
    content: string,
    area: string,
    confidence: number,
    sources: string[] = []
  ): Promise<InsightCard> {
    const id = `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const insight: InsightCard = {
      id,
      title,
      content,
      area,
      confidence: Math.max(0, Math.min(1, confidence)),
      sources,
      createdAt: now,
      updatedAt: now,
      validations: 0,
      actionable: confidence >= config.actionableThreshold,
    };

    this.insights.set(id, insight);
    await this.saveInsights();

    await logger.info("insight_added", {
      id,
      title,
      area,
      confidence,
    });

    return insight;
  }

  /**
   * Update confidence for an insight
   */
  async updateConfidence(insightId: string, newConfidence: number, reason: string): Promise<boolean> {
    const insight = this.insights.get(insightId);
    if (!insight) return false;

    const update: ConfidenceUpdate = {
      insightId,
      previousConfidence: insight.confidence,
      newConfidence: Math.max(0, Math.min(1, newConfidence)),
      reason,
      timestamp: new Date(),
    };

    this.updates.push(update);
    if (this.updates.length > 100) {
      this.updates = this.updates.slice(-100);
    }

    insight.confidence = update.newConfidence;
    insight.updatedAt = new Date();
    insight.validations++;
    insight.actionable = insight.confidence >= config.actionableThreshold;

    await this.saveInsights();

    await logger.info("confidence_updated", {
      insightId,
      from: update.previousConfidence,
      to: update.newConfidence,
      reason,
    });

    return true;
  }

  /**
   * Validate an insight (increases confidence)
   */
  async validateInsight(insightId: string, amount: number = 0.1): Promise<boolean> {
    const insight = this.insights.get(insightId);
    if (!insight) return false;

    return this.updateConfidence(
      insightId,
      insight.confidence + amount,
      "Validation from additional analysis"
    );
  }

  /**
   * Get insights by confidence level
   */
  getByConfidence(level: "high" | "medium" | "low"): InsightCard[] {
    const threshold =
      level === "high"
        ? config.highConfidence
        : level === "medium"
        ? config.mediumConfidence
        : config.lowConfidence;

    return Array.from(this.insights.values())
      .filter(i =>
        level === "high"
          ? i.confidence >= threshold
          : level === "medium"
          ? i.confidence >= threshold && i.confidence < config.highConfidence
          : i.confidence < threshold
      )
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get actionable insights
   */
  getActionable(): InsightCard[] {
    return Array.from(this.insights.values())
      .filter(i => i.actionable)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get insights by area
   */
  getByArea(area: string): InsightCard[] {
    return Array.from(this.insights.values())
      .filter(i => i.area === area)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get recent insights
   */
  getRecent(count: number = 10): InsightCard[] {
    return Array.from(this.insights.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, count);
  }

  /**
   * Get all insights
   */
  getAll(): InsightCard[] {
    return Array.from(this.insights.values());
  }

  /**
   * Get statistics
   */
  getStats(): {
    total: number;
    byConfidence: { high: number; medium: number; low: number };
    actionable: number;
    byArea: Record<string, number>;
  } {
    const all = Array.from(this.insights.values());
    const byArea: Record<string, number> = {};

    for (const insight of all) {
      byArea[insight.area] = (byArea[insight.area] || 0) + 1;
    }

    return {
      total: all.length,
      byConfidence: {
        high: this.getByConfidence("high").length,
        medium: this.getByConfidence("medium").length,
        low: this.getByConfidence("low").length,
      },
      actionable: this.getActionable().length,
      byArea,
    };
  }

  /**
   * Remove stale insights (low confidence and old)
   */
  async pruneStale(maxAgeDays: number = 30): Promise<number> {
    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    let removed = 0;

    for (const [id, insight] of this.insights) {
      if (insight.confidence < config.lowConfidence && insight.updatedAt.getTime() < cutoff) {
        this.insights.delete(id);
        removed++;
      }
    }

    if (removed > 0) {
      await this.saveInsights();
      await logger.info("insights_pruned", { count: removed });
    }

    return removed;
  }
}

export const confidenceTracker = new ConfidenceTracker();
