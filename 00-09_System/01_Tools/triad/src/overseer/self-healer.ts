// Self-Healer
// Uses Codex to diagnose and fix issues in Triad

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { healthMonitor } from "../utils/health-monitor";
import { CodexRunner } from "../runners/codex-runner";

export interface HealingResult {
  success: boolean;
  action: string;
  details: string;
  timestamp: Date;
  duration: number;
}

export interface HealingHistory {
  attempts: HealingResult[];
  totalAttempts: number;
  successfulHeals: number;
  lastAttempt: Date | null;
}

class SelfHealer {
  private codexRunner: CodexRunner;
  private history: HealingHistory;
  private historyFilePath: string;
  private isHealing: boolean = false;

  constructor() {
    this.codexRunner = new CodexRunner();
    this.historyFilePath = `${config.triadPath}/${config.statePath}/healing-history.json`;
    this.history = {
      attempts: [],
      totalAttempts: 0,
      successfulHeals: 0,
      lastAttempt: null,
    };
  }

  /**
   * Load healing history from disk
   */
  async loadHistory(): Promise<void> {
    try {
      const file = Bun.file(this.historyFilePath);
      if (await file.exists()) {
        const data = await file.json();
        this.history = {
          ...data,
          lastAttempt: data.lastAttempt ? new Date(data.lastAttempt) : null,
          attempts: data.attempts.map((a: HealingResult) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })),
        };
      }
    } catch (error) {
      await logger.warn("healing_history_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save healing history to disk
   */
  async saveHistory(): Promise<void> {
    try {
      await Bun.write(this.historyFilePath, JSON.stringify(this.history, null, 2));
    } catch (error) {
      await logger.error("healing_history_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Attempt to heal the system
   */
  async heal(): Promise<HealingResult> {
    if (this.isHealing) {
      return {
        success: false,
        action: "skipped",
        details: "Healing already in progress",
        timestamp: new Date(),
        duration: 0,
      };
    }

    this.isHealing = true;
    const startTime = Date.now();

    try {
      await logger.selfHealTriggered("system", this.history.totalAttempts + 1);

      // Get error context from health monitor
      const errorContext = healthMonitor.getErrorContext();

      // Run Codex in self-healing mode
      const result = await this.codexRunner.runSelfHealing(errorContext);

      const healingResult: HealingResult = {
        success: result.success,
        action: result.success ? "fixed" : "attempted",
        details: result.success ? result.output : result.error || "Unknown error",
        timestamp: new Date(),
        duration: result.duration,
      };

      // Record in history
      this.history.attempts.push(healingResult);
      this.history.totalAttempts++;
      if (result.success) {
        this.history.successfulHeals++;
        healthMonitor.resetFailures();
      }
      this.history.lastAttempt = new Date();

      // Keep only last 50 attempts
      if (this.history.attempts.length > 50) {
        this.history.attempts = this.history.attempts.slice(-50);
      }

      await this.saveHistory();

      await logger.info("self_heal_complete", {
        success: result.success,
        duration: result.duration,
        action: healingResult.action,
      });

      return healingResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await logger.error("self_heal_error", { error: message });

      return {
        success: false,
        action: "failed",
        details: message,
        timestamp: new Date(),
        duration: Date.now() - startTime,
      };
    } finally {
      this.isHealing = false;
    }
  }

  /**
   * Run diagnostics without making changes
   */
  async diagnose(): Promise<{ issues: string[]; recommendations: string[] }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check health status
    const health = await healthMonitor.runHealthChecks();

    for (const check of health.checks) {
      if (check.status !== "healthy") {
        issues.push(`${check.name}: ${check.message}`);

        // Add recommendations based on check type
        switch (check.name) {
          case "agents":
            recommendations.push("Verify CLI tools are installed and in PATH");
            break;
          case "search_db":
            recommendations.push("Run the search engine indexer to rebuild search.db");
            break;
          case "filesystem":
            recommendations.push("Check VRAM volume is mounted");
            break;
          case "memory":
            recommendations.push("Consider restarting the application");
            break;
          case "server":
            recommendations.push("Check for port conflicts on 3002");
            break;
        }
      }
    }

    return { issues, recommendations };
  }

  /**
   * Get healing statistics
   */
  getStats(): { totalAttempts: number; successRate: number; lastAttempt: Date | null } {
    return {
      totalAttempts: this.history.totalAttempts,
      successRate: this.history.totalAttempts > 0
        ? this.history.successfulHeals / this.history.totalAttempts
        : 1,
      lastAttempt: this.history.lastAttempt,
    };
  }

  /**
   * Check if healing is currently in progress
   */
  isHealingInProgress(): boolean {
    return this.isHealing;
  }

  /**
   * Get recent healing attempts
   */
  getRecentAttempts(count: number = 5): HealingResult[] {
    return this.history.attempts.slice(-count);
  }
}

export const selfHealer = new SelfHealer();
