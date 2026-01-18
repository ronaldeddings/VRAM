// Overseer
// High-level oversight system that monitors and improves Triad

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { healthMonitor } from "../utils/health-monitor";
import { selfHealer } from "./self-healer";
import { CodexRunner } from "../runners/codex-runner";
import { outputManager } from "../utils/output-manager";
import { focusTracker } from "../context/focus-tracker";
import { reportGenerator } from "../reports/report-generator";

export interface OverseerReport {
  timestamp: Date;
  healthStatus: string;
  insights: string[];
  recommendations: string[];
  systemImprovements: string[];
  nextActions: string[];
}

class Overseer {
  private codexRunner: CodexRunner;
  private lastReport: OverseerReport | null = null;
  private reportFilePath: string;

  constructor() {
    this.codexRunner = new CodexRunner();
    this.reportFilePath = `${config.triadPath}/${config.statePath}/overseer-report.json`;
  }

  /**
   * Run a full oversight cycle
   */
  async runOversightCycle(iteration: number): Promise<OverseerReport> {
    await logger.info("overseer_cycle_start", { iteration });

    const report: OverseerReport = {
      timestamp: new Date(),
      healthStatus: "unknown",
      insights: [],
      recommendations: [],
      systemImprovements: [],
      nextActions: [],
    };

    try {
      // 1. Health check
      const health = await healthMonitor.runHealthChecks();
      report.healthStatus = health.overall;

      // 2. Trigger healing if needed
      if (healthMonitor.shouldTriggerHealing()) {
        await logger.warn("overseer_triggering_heal", {
          consecutiveFailures: health.consecutiveFailures,
        });
        await selfHealer.heal();
      }

      // 3. Analyze agent outputs
      const agentOutputs = outputManager.getRecentOutputs(10);
      if (agentOutputs.length > 0) {
        const focusArea = focusTracker.getCurrentFocusArea();
        const synthesisResult = await this.codexRunner.runOverseer(
          agentOutputs.slice(0, 5),
          focusArea.name,
          iteration
        );

        if (synthesisResult.success) {
          // Parse insights from synthesis
          report.insights = this.extractInsights(synthesisResult.output);
          report.recommendations = this.extractRecommendations(synthesisResult.output);

          // Persist insights to reportGenerator
          for (const insight of report.insights.slice(0, 5)) {
            const title = insight.substring(0, 50) + (insight.length > 50 ? "..." : "");
            await reportGenerator.addInsight(
              title,
              insight,
              focusArea.name,
              0.75, // Overseer insights get high confidence
              [`overseer-iteration-${iteration}`]
            );
          }
        }
      }

      // 4. Check for system improvements
      report.systemImprovements = await this.identifyImprovements();

      // 5. Determine next actions
      report.nextActions = this.determineNextActions(report);

      // Save report
      this.lastReport = report;
      await this.saveReport();

      await logger.info("overseer_cycle_complete", {
        iteration,
        healthStatus: report.healthStatus,
        insightsCount: report.insights.length,
        recommendationsCount: report.recommendations.length,
      });

      return report;
    } catch (error) {
      await logger.error("overseer_cycle_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return report;
    }
  }

  /**
   * Extract insights from overseer output
   */
  private extractInsights(output: string): string[] {
    const insights: string[] = [];

    // Look for common insight patterns
    const lines = output.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ") ||
        trimmed.startsWith("1.") ||
        trimmed.startsWith("•")
      ) {
        const content = trimmed.replace(/^[-*•\d.]\s*/, "");
        if (content.length > 10 && content.length < 500) {
          insights.push(content);
        }
      }
    }

    return insights.slice(0, 10);
  }

  /**
   * Extract recommendations from overseer output
   */
  private extractRecommendations(output: string): string[] {
    const recommendations: string[] = [];
    const lowerOutput = output.toLowerCase();

    // Look for recommendation patterns
    const patterns = [
      /recommend(?:s|ation)?[:\s]+([^.]+)/gi,
      /should\s+([^.]+)/gi,
      /suggest(?:s|ion)?[:\s]+([^.]+)/gi,
      /consider\s+([^.]+)/gi,
    ];

    for (const pattern of patterns) {
      const matches = output.matchAll(pattern);
      for (const match of matches) {
        const rec = match[1].trim();
        if (rec.length > 10 && rec.length < 300) {
          recommendations.push(rec);
        }
      }
    }

    return [...new Set(recommendations)].slice(0, 5);
  }

  /**
   * Identify potential system improvements
   */
  private async identifyImprovements(): Promise<string[]> {
    const improvements: string[] = [];
    const stats = outputManager.getStats();
    const focusStats = focusTracker.getStats();

    // Check success rate
    if (stats.successRate < 0.8) {
      improvements.push(`Agent success rate is ${Math.round(stats.successRate * 100)}% - investigate failures`);
    }

    // Check underexplored areas
    const underexplored = focusTracker.getUnderexploredAreas();
    if (underexplored.length > 0) {
      improvements.push(`Areas need more attention: ${underexplored.map(a => a.name).join(", ")}`);
    }

    // Check completion progress
    const completionRate = focusStats.completedAreas / focusStats.areas.length;
    if (focusStats.totalIterations > 100 && completionRate < 0.5) {
      improvements.push("Consider deeper analysis - completion rate is low");
    }

    return improvements;
  }

  /**
   * Determine next actions based on report
   */
  private determineNextActions(report: OverseerReport): string[] {
    const actions: string[] = [];

    if (report.healthStatus === "unhealthy") {
      actions.push("Priority: Address system health issues");
    }

    if (report.insights.length < 3) {
      actions.push("Generate more insights in next iteration");
    }

    if (report.recommendations.length > 0) {
      actions.push(`Review ${report.recommendations.length} recommendations`);
    }

    if (report.systemImprovements.length > 0) {
      actions.push("Consider system improvements identified");
    }

    // Default action
    if (actions.length === 0) {
      actions.push("Continue normal operation");
    }

    return actions;
  }

  /**
   * Save report to file
   */
  private async saveReport(): Promise<void> {
    if (this.lastReport) {
      try {
        await Bun.write(this.reportFilePath, JSON.stringify(this.lastReport, null, 2));
        await logger.debug("overseer_report_saved", { path: this.reportFilePath });
      } catch (error) {
        await logger.error("overseer_report_save_error", {
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  /**
   * Load last report from file
   */
  async loadLastReport(): Promise<OverseerReport | null> {
    try {
      const file = Bun.file(this.reportFilePath);
      if (await file.exists()) {
        const data = await file.json();
        this.lastReport = {
          ...data,
          timestamp: new Date(data.timestamp),
        };
        return this.lastReport;
      }
    } catch (error) {
      await logger.warn("overseer_report_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return null;
  }

  /**
   * Get the last report
   */
  getLastReport(): OverseerReport | null {
    return this.lastReport;
  }

  /**
   * Get quick status for API
   */
  getStatus(): { lastReport: Date | null; healthStatus: string; insightsCount: number } {
    return {
      lastReport: this.lastReport?.timestamp || null,
      healthStatus: this.lastReport?.healthStatus || "unknown",
      insightsCount: this.lastReport?.insights.length || 0,
    };
  }
}

export const overseer = new Overseer();
