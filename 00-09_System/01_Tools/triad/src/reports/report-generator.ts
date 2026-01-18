// Report Generator
// Central coordinator for all report types

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { dailyDigest, type DailyDigest } from "./daily-digest";
import { weeklyReport, type WeeklyReport } from "./weekly-report";
import { confidenceTracker, type InsightCard } from "./confidence-tracker";

export interface ReportSchedule {
  dailyDigestHour: number; // Hour of day (0-23) for daily digest
  weeklyReportDay: number; // Day of week (0=Sunday, 6=Saturday)
  weeklyReportHour: number;
  insightCardOnChange: boolean; // Generate insight cards on confidence changes
}

class ReportGenerator {
  private schedule: ReportSchedule;
  private lastDailyGenerated: string | null = null;
  private lastWeeklyGenerated: string | null = null;

  constructor() {
    this.schedule = {
      dailyDigestHour: 23, // 11 PM
      weeklyReportDay: 0, // Sunday
      weeklyReportHour: 18, // 6 PM
      insightCardOnChange: true,
    };
  }

  /**
   * Check if reports should be generated (called from main loop)
   */
  async checkSchedule(): Promise<void> {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Log schedule check for debugging
    await logger.debug("schedule_check", {
      currentHour: hour,
      dailyTriggerHour: this.schedule.dailyDigestHour,
      weeklyTriggerDay: this.schedule.weeklyReportDay,
      weeklyTriggerHour: this.schedule.weeklyReportHour,
      dayOfWeek,
      lastDailyGenerated: this.lastDailyGenerated,
      lastWeeklyGenerated: this.lastWeeklyGenerated,
    });

    // Check daily digest
    if (hour >= this.schedule.dailyDigestHour && this.lastDailyGenerated !== today) {
      await logger.info("report_scheduler_daily", { time: now.toISOString() });
      await this.generateDailyDigest();
      this.lastDailyGenerated = today;
    }

    // Check weekly report
    const weekId = this.getWeekId(now);
    if (
      dayOfWeek === this.schedule.weeklyReportDay &&
      hour >= this.schedule.weeklyReportHour &&
      this.lastWeeklyGenerated !== weekId
    ) {
      await logger.info("report_scheduler_weekly", { time: now.toISOString() });
      await this.generateWeeklyReport();
      this.lastWeeklyGenerated = weekId;
    }
  }

  /**
   * Generate a daily digest
   */
  async generateDailyDigest(): Promise<DailyDigest> {
    await logger.info("generating_daily_digest");
    return await dailyDigest.generate();
  }

  /**
   * Generate a weekly report
   */
  async generateWeeklyReport(): Promise<WeeklyReport> {
    await logger.info("generating_weekly_report");
    return await weeklyReport.generate();
  }

  /**
   * Add an insight (with automatic confidence tracking)
   */
  async addInsight(
    title: string,
    content: string,
    area: string,
    confidence: number,
    sources: string[] = []
  ): Promise<InsightCard> {
    return await confidenceTracker.addInsight(title, content, area, confidence, sources);
  }

  /**
   * Get insights for display
   */
  getInsights(options: {
    area?: string;
    confidence?: "high" | "medium" | "low";
    actionableOnly?: boolean;
    limit?: number;
  } = {}): InsightCard[] {
    let insights: InsightCard[];

    if (options.actionableOnly) {
      insights = confidenceTracker.getActionable();
    } else if (options.confidence) {
      insights = confidenceTracker.getByConfidence(options.confidence);
    } else if (options.area) {
      insights = confidenceTracker.getByArea(options.area);
    } else {
      insights = confidenceTracker.getAll();
    }

    if (options.limit) {
      insights = insights.slice(0, options.limit);
    }

    return insights;
  }

  /**
   * Get the latest daily digest
   */
  async getLatestDaily(): Promise<DailyDigest | null> {
    return await dailyDigest.getLatest();
  }

  /**
   * Get the latest weekly report
   */
  async getLatestWeekly(): Promise<WeeklyReport | null> {
    return await weeklyReport.getLatest();
  }

  /**
   * Get report statistics
   */
  getStats(): {
    insights: ReturnType<typeof confidenceTracker.getStats>;
    lastDaily: string | null;
    lastWeekly: string | null;
  } {
    return {
      insights: confidenceTracker.getStats(),
      lastDaily: this.lastDailyGenerated,
      lastWeekly: this.lastWeeklyGenerated,
    };
  }

  /**
   * Get week identifier
   */
  private getWeekId(date: Date): string {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
  }

  /**
   * Force generate all reports (for testing)
   */
  async forceGenerateAll(): Promise<{ daily: DailyDigest; weekly: WeeklyReport }> {
    const daily = await this.generateDailyDigest();
    const weekly = await this.generateWeeklyReport();
    return { daily, weekly };
  }

  /**
   * Initialize - load saved state
   */
  async initialize(): Promise<void> {
    await confidenceTracker.loadInsights();
    await logger.info("report_generator_initialized");
  }

  /**
   * Prune old low-confidence insights
   */
  async pruneStaleInsights(maxAgeDays: number = 30): Promise<number> {
    return await confidenceTracker.pruneStale(maxAgeDays);
  }
}

export const reportGenerator = new ReportGenerator();
