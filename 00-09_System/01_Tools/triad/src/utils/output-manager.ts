// Output Manager
// Manages agent outputs, history, and context for Triad

import { config } from "./config";
import { logger } from "./logger";

export interface AgentOutput {
  agent: string;
  iteration: number;
  focusArea: string;
  output: string;
  timestamp: Date;
  success: boolean;
  duration: number;
}

export interface IterationSummary {
  iteration: number;
  focusArea: string;
  startTime: Date;
  endTime?: Date;
  agentOutputs: AgentOutput[];
  overseerSummary?: string;
  insightsExtracted: number;
}

class OutputManager {
  private currentIteration: IterationSummary | null = null;
  private iterationHistory: IterationSummary[] = [];

  /**
   * Start a new iteration
   */
  startIteration(iteration: number, focusArea: string): void {
    this.currentIteration = {
      iteration,
      focusArea,
      startTime: new Date(),
      agentOutputs: [],
      insightsExtracted: 0,
    };
  }

  /**
   * Record an agent's output for the current iteration
   */
  recordOutput(output: AgentOutput): void {
    if (this.currentIteration) {
      this.currentIteration.agentOutputs.push(output);
    }
  }

  /**
   * Complete the current iteration
   */
  async completeIteration(overseerSummary?: string, insightsCount?: number): Promise<void> {
    if (this.currentIteration) {
      this.currentIteration.endTime = new Date();
      this.currentIteration.overseerSummary = overseerSummary;
      this.currentIteration.insightsExtracted = insightsCount || 0;

      // Save to history
      this.iterationHistory.push(this.currentIteration);

      // Persist to file
      await this.saveIterationToFile(this.currentIteration);

      // Keep only recent history in memory
      if (this.iterationHistory.length > config.maxPreviousOutputs * 3) {
        this.iterationHistory = this.iterationHistory.slice(-config.maxPreviousOutputs * 3);
      }

      const duration = this.currentIteration.endTime.getTime() - this.currentIteration.startTime.getTime();
      await logger.iterationComplete(
        this.currentIteration.iteration,
        this.currentIteration.insightsExtracted,
        duration
      );

      this.currentIteration = null;
    }
  }

  /**
   * Get outputs from the current iteration
   */
  getCurrentIterationOutputs(): string[] {
    if (!this.currentIteration) return [];
    return this.currentIteration.agentOutputs
      .filter(o => o.success)
      .map(o => o.output);
  }

  /**
   * Get recent successful outputs across iterations for context
   */
  getRecentOutputs(count: number = config.maxPreviousOutputs): string[] {
    const allOutputs: AgentOutput[] = [];

    // From history
    for (const iter of this.iterationHistory) {
      allOutputs.push(...iter.agentOutputs.filter(o => o.success));
    }

    // From current iteration
    if (this.currentIteration) {
      allOutputs.push(...this.currentIteration.agentOutputs.filter(o => o.success));
    }

    // Sort by timestamp descending and take most recent
    allOutputs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return allOutputs.slice(0, count).map(o => o.output);
  }

  /**
   * Get outputs from a specific agent
   */
  getAgentOutputs(agent: string, count: number = 5): string[] {
    const allOutputs: AgentOutput[] = [];

    for (const iter of this.iterationHistory) {
      allOutputs.push(...iter.agentOutputs.filter(o => o.agent === agent && o.success));
    }

    if (this.currentIteration) {
      allOutputs.push(...this.currentIteration.agentOutputs.filter(o => o.agent === agent && o.success));
    }

    allOutputs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return allOutputs.slice(0, count).map(o => o.output);
  }

  /**
   * Save iteration data to file for persistence
   */
  private async saveIterationToFile(iteration: IterationSummary): Promise<void> {
    const filename = `${config.triadPath}/${config.statePath}/iteration-${iteration.iteration.toString().padStart(5, "0")}.json`;

    await Bun.write(filename, JSON.stringify(iteration, null, 2));
    await logger.debug("iteration_saved", { iteration: iteration.iteration, path: filename });
  }

  /**
   * Load iteration state from disk
   */
  async loadState(): Promise<number> {
    const stateFile = Bun.file(`${config.triadPath}/${config.statePath}/current-iteration.json`);

    if (await stateFile.exists()) {
      try {
        const data = await stateFile.json();
        return data.iteration || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  }

  /**
   * Save current iteration number
   */
  async saveCurrentIterationNumber(iteration: number): Promise<void> {
    const stateFile = `${config.triadPath}/${config.statePath}/current-iteration.json`;
    await Bun.write(stateFile, JSON.stringify({ iteration, updatedAt: new Date().toISOString() }));
  }

  /**
   * Get statistics
   */
  getStats(): { totalIterations: number; totalOutputs: number; successRate: number } {
    let totalOutputs = 0;
    let successfulOutputs = 0;

    for (const iter of this.iterationHistory) {
      totalOutputs += iter.agentOutputs.length;
      successfulOutputs += iter.agentOutputs.filter(o => o.success).length;
    }

    return {
      totalIterations: this.iterationHistory.length,
      totalOutputs,
      successRate: totalOutputs > 0 ? successfulOutputs / totalOutputs : 1,
    };
  }
}

export const outputManager = new OutputManager();
