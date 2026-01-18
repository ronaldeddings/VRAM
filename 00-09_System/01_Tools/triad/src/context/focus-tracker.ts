// Focus Tracker
// Manages rotation through focus areas and tracks depth of exploration

import { config, type FocusArea } from "../utils/config";
import { logger } from "../utils/logger";

export interface FocusAreaState {
  id: string;
  name: string;
  path: string;
  visitCount: number;
  lastVisited: Date | null;
  insightsGenerated: number;
  depthLevel: number;
  completed: boolean;
}

export interface FocusState {
  currentIndex: number;
  areas: FocusAreaState[];
  totalIterations: number;
  lastUpdated: Date;
}

class FocusTracker {
  private state: FocusState;
  private stateFilePath: string;

  constructor() {
    this.stateFilePath = `${config.triadPath}/${config.statePath}/focus-state.json`;
    this.state = this.initializeState();
  }

  /**
   * Initialize state with all focus areas
   */
  private initializeState(): FocusState {
    return {
      currentIndex: 0,
      areas: config.focusAreas.map(area => ({
        id: area.id,
        name: area.name,
        path: area.path,
        visitCount: 0,
        lastVisited: null,
        insightsGenerated: 0,
        depthLevel: 0,
        completed: false,
      })),
      totalIterations: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Load state from disk
   */
  async loadState(): Promise<void> {
    try {
      const file = Bun.file(this.stateFilePath);
      if (await file.exists()) {
        const data = await file.json();
        this.state = {
          ...data,
          lastUpdated: new Date(data.lastUpdated),
          areas: data.areas.map((a: FocusAreaState) => ({
            ...a,
            lastVisited: a.lastVisited ? new Date(a.lastVisited) : null,
          })),
        };
        await logger.debug("focus_state_loaded", { currentIndex: this.state.currentIndex });
      }
    } catch (error) {
      await logger.warn("focus_state_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      // Keep default state
    }
  }

  /**
   * Save state to disk
   */
  async saveState(): Promise<void> {
    try {
      this.state.lastUpdated = new Date();
      await Bun.write(this.stateFilePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      await logger.error("focus_state_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get the next focus area to analyze
   */
  getNextFocusArea(): FocusArea {
    const nextArea = config.focusAreas[this.state.currentIndex];

    // Update state
    const areaState = this.state.areas[this.state.currentIndex];
    areaState.visitCount++;
    areaState.lastVisited = new Date();
    areaState.depthLevel = Math.min(areaState.depthLevel + 1, config.maxDepthPerArea);

    // Move to next area (round-robin)
    this.state.currentIndex = (this.state.currentIndex + 1) % config.focusAreas.length;
    this.state.totalIterations++;

    // Save asynchronously
    this.saveState().catch(() => {});

    return nextArea;
  }

  /**
   * Get current focus area without advancing
   */
  getCurrentFocusArea(): FocusArea {
    return config.focusAreas[this.state.currentIndex];
  }

  /**
   * Record insights generated for an area
   */
  async recordInsights(areaId: string, count: number): Promise<void> {
    const areaState = this.state.areas.find(a => a.id === areaId);
    if (areaState) {
      areaState.insightsGenerated += count;

      // Check if area has reached completion threshold
      if (areaState.insightsGenerated >= config.minInsightsBeforeMove * 3) {
        areaState.completed = true;
      }

      await this.saveState();
    }
  }

  /**
   * Get statistics for all focus areas
   */
  getStats(): { areas: FocusAreaState[]; totalIterations: number; completedAreas: number } {
    return {
      areas: this.state.areas,
      totalIterations: this.state.totalIterations,
      completedAreas: this.state.areas.filter(a => a.completed).length,
    };
  }

  /**
   * Get the area with fewest visits (for balancing)
   */
  getLeastVisitedArea(): FocusArea {
    const sorted = [...this.state.areas].sort((a, b) => a.visitCount - b.visitCount);
    const leastVisited = sorted[0];
    return config.focusAreas.find(a => a.id === leastVisited.id) || config.focusAreas[0];
  }

  /**
   * Get areas that need more attention
   */
  getUnderexploredAreas(): FocusArea[] {
    const avgVisits = this.state.totalIterations / config.focusAreas.length;
    return this.state.areas
      .filter(a => a.visitCount < avgVisits * 0.75)
      .map(a => config.focusAreas.find(fa => fa.id === a.id)!)
      .filter(Boolean);
  }

  /**
   * Reset focus tracking (for fresh starts)
   */
  async reset(): Promise<void> {
    this.state = this.initializeState();
    await this.saveState();
    await logger.info("focus_state_reset");
  }

  /**
   * Get a summary of focus tracking for prompts
   */
  getSummaryForPrompt(): string {
    const stats = this.getStats();
    let summary = "## Focus Area Coverage\n\n";

    for (const area of stats.areas) {
      const status = area.completed ? "✓" : area.visitCount > 0 ? "○" : "·";
      summary += `${status} **${area.name}**: ${area.visitCount} visits, ${area.insightsGenerated} insights, depth ${area.depthLevel}/${config.maxDepthPerArea}\n`;
    }

    summary += `\n*Total iterations: ${stats.totalIterations}, Completed areas: ${stats.completedAreas}/${stats.areas.length}*`;

    return summary;
  }
}

export const focusTracker = new FocusTracker();
