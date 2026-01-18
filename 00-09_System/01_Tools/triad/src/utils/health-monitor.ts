// Health Monitor
// Monitors system health and triggers self-healing when needed

import { config } from "./config";
import { logger } from "./logger";
import { getState } from "../server";

const HEALTH_STATE_PATH = `${config.triadPath}/${config.statePath}/health.json`;

export interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  message: string;
  lastChecked: Date;
}

export interface HealthStatus {
  overall: "healthy" | "degraded" | "unhealthy";
  checks: HealthCheck[];
  consecutiveFailures: number;
  uptime: number;
  lastHealthy: Date | null;
}

class HealthMonitor {
  private consecutiveFailures: number = 0;
  private lastHealthy: Date | null = null;
  private checks: HealthCheck[] = [];
  private startTime: Date = new Date();

  /**
   * Run all health checks
   */
  async runHealthChecks(): Promise<HealthStatus> {
    this.checks = [];

    // Check 1: Server running
    this.checks.push(await this.checkServer());

    // Check 2: Agent availability
    this.checks.push(await this.checkAgents());

    // Check 3: Search database
    this.checks.push(await this.checkSearchDatabase());

    // Check 4: File system access
    this.checks.push(await this.checkFileSystem());

    // Check 5: Memory usage
    this.checks.push(await this.checkMemory());

    // Determine overall status
    const unhealthyCount = this.checks.filter(c => c.status === "unhealthy").length;
    const degradedCount = this.checks.filter(c => c.status === "degraded").length;

    let overall: "healthy" | "degraded" | "unhealthy";
    if (unhealthyCount > 0) {
      overall = "unhealthy";
      this.consecutiveFailures++;
    } else if (degradedCount > 0) {
      overall = "degraded";
      this.consecutiveFailures = 0;
      this.lastHealthy = new Date();
    } else {
      overall = "healthy";
      this.consecutiveFailures = 0;
      this.lastHealthy = new Date();
    }

    const status: HealthStatus = {
      overall,
      checks: this.checks,
      consecutiveFailures: this.consecutiveFailures,
      uptime: Date.now() - this.startTime.getTime(),
      lastHealthy: this.lastHealthy,
    };

    await logger.healthCheck(overall, Object.fromEntries(this.checks.map(c => [c.name, c.status === "healthy"])));

    // Persist health status to file
    await this.saveHealthStatus(status);

    return status;
  }

  /**
   * Save health status to state file
   */
  private async saveHealthStatus(status: HealthStatus): Promise<void> {
    try {
      const data = {
        ...status,
        checks: status.checks.map(c => ({
          ...c,
          lastChecked: c.lastChecked.toISOString(),
        })),
        lastHealthy: status.lastHealthy?.toISOString() || null,
        savedAt: new Date().toISOString(),
      };
      await Bun.write(HEALTH_STATE_PATH, JSON.stringify(data, null, 2));
      await logger.debug("health_status_saved", { path: HEALTH_STATE_PATH });
    } catch (error) {
      await logger.error("health_status_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Check if server is running
   */
  private async checkServer(): Promise<HealthCheck> {
    try {
      const state = getState();
      return {
        name: "server",
        status: state.running ? "healthy" : "unhealthy",
        message: state.running ? "Server is running" : "Server is not running",
        lastChecked: new Date(),
      };
    } catch {
      return {
        name: "server",
        status: "unhealthy",
        message: "Could not get server state",
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check if agents are available
   */
  private async checkAgents(): Promise<HealthCheck> {
    const agents = ["claude", "codex", "gemini"];
    const available: string[] = [];

    for (const agent of agents) {
      try {
        const proc = Bun.spawn(["which", agent], { stdout: "pipe", stderr: "pipe" });
        await proc.exited;
        if (proc.exitCode === 0) {
          available.push(agent);
        }
      } catch {
        // Agent not available
      }
    }

    if (available.length === agents.length) {
      return {
        name: "agents",
        status: "healthy",
        message: `All agents available: ${available.join(", ")}`,
        lastChecked: new Date(),
      };
    } else if (available.length > 0) {
      return {
        name: "agents",
        status: "degraded",
        message: `Some agents available: ${available.join(", ")}`,
        lastChecked: new Date(),
      };
    } else {
      return {
        name: "agents",
        status: "unhealthy",
        message: "No agents available",
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check search database
   */
  private async checkSearchDatabase(): Promise<HealthCheck> {
    try {
      const file = Bun.file(config.searchDbPath);
      if (await file.exists()) {
        return {
          name: "search_db",
          status: "healthy",
          message: "Search database accessible",
          lastChecked: new Date(),
        };
      } else {
        return {
          name: "search_db",
          status: "degraded",
          message: "Search database not found",
          lastChecked: new Date(),
        };
      }
    } catch (error) {
      return {
        name: "search_db",
        status: "unhealthy",
        message: `Search database error: ${error instanceof Error ? error.message : "Unknown"}`,
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check file system access
   */
  private async checkFileSystem(): Promise<HealthCheck> {
    try {
      const vramFile = Bun.file(config.vramPath);
      // Check if we can list directories
      const glob = new Bun.Glob("*");
      let count = 0;
      for await (const _ of glob.scan({ cwd: config.vramPath })) {
        count++;
        if (count > 0) break;
      }

      return {
        name: "filesystem",
        status: "healthy",
        message: "VRAM filesystem accessible",
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        name: "filesystem",
        status: "unhealthy",
        message: `Filesystem error: ${error instanceof Error ? error.message : "Unknown"}`,
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemory(): Promise<HealthCheck> {
    try {
      // Use RSS (Resident Set Size) for more accurate memory measurement
      const memUsage = process.memoryUsage();
      const rss = memUsage.rss;
      const heapUsed = memUsage.heapUsed;

      // Use RSS in MB for display, with reasonable thresholds
      const rssMB = Math.round(rss / 1024 / 1024);
      const heapMB = Math.round(heapUsed / 1024 / 1024);

      // Consider unhealthy if RSS exceeds 1GB
      if (rssMB < 500) {
        return {
          name: "memory",
          status: "healthy",
          message: `Memory: ${rssMB}MB RSS, ${heapMB}MB heap`,
          lastChecked: new Date(),
        };
      } else if (rssMB < 1000) {
        return {
          name: "memory",
          status: "degraded",
          message: `High memory: ${rssMB}MB RSS, ${heapMB}MB heap`,
          lastChecked: new Date(),
        };
      } else {
        return {
          name: "memory",
          status: "unhealthy",
          message: `Critical memory: ${rssMB}MB RSS, ${heapMB}MB heap`,
          lastChecked: new Date(),
        };
      }
    } catch {
      return {
        name: "memory",
        status: "degraded",
        message: "Could not check memory",
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check if self-healing should be triggered
   */
  shouldTriggerHealing(): boolean {
    return this.consecutiveFailures >= config.maxConsecutiveFailures;
  }

  /**
   * Get error context for self-healing
   */
  getErrorContext(): string {
    const unhealthyChecks = this.checks.filter(c => c.status !== "healthy");
    if (unhealthyChecks.length === 0) return "No errors detected";

    return unhealthyChecks
      .map(c => `[${c.name}] ${c.status}: ${c.message}`)
      .join("\n");
  }

  /**
   * Reset failure counter after successful healing
   */
  resetFailures(): void {
    this.consecutiveFailures = 0;
  }

  /**
   * Get simple status for API
   */
  getSimpleStatus(): { healthy: boolean; checks: Record<string, boolean> } {
    return {
      healthy: this.checks.every(c => c.status === "healthy"),
      checks: Object.fromEntries(this.checks.map(c => [c.name, c.status === "healthy"])),
    };
  }
}

export const healthMonitor = new HealthMonitor();
