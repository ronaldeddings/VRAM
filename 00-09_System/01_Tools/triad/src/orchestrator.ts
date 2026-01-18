// Triad Orchestrator
// Main loop that runs agents sequentially and manages the system

import { config, type FocusArea } from "./utils/config";
import { logger } from "./utils/logger";
import { updateState, getState } from "./server";
import { outputManager } from "./utils/output-manager";
import { CodexRunner } from "./runners/codex-runner";
import { GeminiRunner } from "./runners/gemini-runner";
import type { RunnerContext, RunnerResult } from "./runners/base-runner";
import { promptBuilder } from "./context/prompt-builder";
import { overseer } from "./overseer/overseer";
import { reportGenerator } from "./reports/report-generator";
import { healthMonitor } from "./utils/health-monitor";

class Orchestrator {
  private gemini1Runner: GeminiRunner;  // Gemini-Alpha: First pass analysis
  private codexRunner: CodexRunner;      // Codex: Deep analysis & synthesis
  private gemini2Runner: GeminiRunner;   // Gemini-Omega: Final pass & connections

  private iteration: number = 0;
  private currentFocusIndex: number = 0;
  private running: boolean = false;

  constructor() {
    this.gemini1Runner = new GeminiRunner("gemini1");  // Alpha instance
    this.codexRunner = new CodexRunner();
    this.gemini2Runner = new GeminiRunner("gemini2");  // Omega instance
  }

  /**
   * Initialize the orchestrator and load state
   */
  async initialize(): Promise<void> {
    this.iteration = await outputManager.loadState();
    await logger.info("orchestrator_initialized", { startingIteration: this.iteration });
  }

  /**
   * Start the main orchestration loop
   */
  async start(): Promise<void> {
    if (this.running) {
      await logger.warn("orchestrator_already_running");
      return;
    }

    this.running = true;
    updateState({ running: true });
    await logger.info("orchestrator_started");

    while (this.running) {
      try {
        // Check if paused
        const state = getState();
        if (state.paused) {
          await logger.debug("orchestrator_paused");
          await this.sleep(config.watchdogInterval);
          continue;
        }

        // Run an iteration
        await this.runIteration();

        // Wait before next iteration
        await this.sleep(config.iterationDelay);

      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await logger.error("orchestrator_error", { error: message });
        updateState({ errors: [...getState().errors, message].slice(-10) });

        // Wait before retrying
        await this.sleep(config.iterationDelay);
      }
    }
  }

  /**
   * Stop the orchestration loop
   */
  async stop(): Promise<void> {
    this.running = false;
    updateState({ running: false });
    await logger.info("orchestrator_stopped");
  }

  /**
   * Run a single iteration of the agent loop
   */
  private async runIteration(): Promise<void> {
    this.iteration++;
    await outputManager.saveCurrentIterationNumber(this.iteration);

    // Get current focus area
    const focusArea = this.getNextFocusArea();
    await logger.iterationStart(this.iteration, focusArea.name);

    // Start iteration tracking
    outputManager.startIteration(this.iteration, focusArea.name);

    // Get previous outputs for context
    const previousOutputs = outputManager.getRecentOutputs();

    // Build comprehensive prompt using promptBuilder (includes search + file context)
    const basePrompt = await promptBuilder.buildPrompt({
      focusArea,
      iteration: this.iteration,
      previousOutputs
    });

    await logger.debug("prompt_built", {
      focusArea: focusArea.name,
      promptLength: basePrompt.length,
      hasPreviousOutputs: previousOutputs.length > 0
    });

    // Run agents sequentially: Gemini-Alpha → Codex → Gemini-Omega
    const results: RunnerResult[] = [];

    // 1. Run Gemini-Alpha (first pass - initial deep analysis)
    const gemini1Result = await this.runAgent(
      this.gemini1Runner,
      focusArea,
      basePrompt,
      previousOutputs
    );
    results.push(gemini1Result);
    await this.sleep(config.agentDelay);

    // 2. Run Codex (with Gemini-Alpha's output - synthesis & deep dive)
    const codexPreviousOutputs = gemini1Result.success
      ? [gemini1Result.output, ...previousOutputs]
      : previousOutputs;
    const codexResult = await this.runAgent(
      this.codexRunner,
      focusArea,
      basePrompt,
      codexPreviousOutputs
    );
    results.push(codexResult);
    await this.sleep(config.agentDelay);

    // 3. Run Gemini-Omega (final pass - connections & recommendations)
    const gemini2PreviousOutputs = [
      ...(gemini1Result.success ? [gemini1Result.output] : []),
      ...(codexResult.success ? [codexResult.output] : []),
      ...previousOutputs,
    ];
    const gemini2Result = await this.runAgent(
      this.gemini2Runner,
      focusArea,
      basePrompt,
      gemini2PreviousOutputs
    );
    results.push(gemini2Result);

    // 4. Extract insights from agent outputs
    let insightsExtracted = 0;
    for (const result of results) {
      if (result.success && result.output.length > 100) {
        const extracted = await this.extractAndSaveInsights(result.output, focusArea.name);
        insightsExtracted += extracted;
      }
    }

    // 5. Run Overseer (full oversight cycle) every N iterations
    let overseerSummary: string | undefined;
    if (this.iteration % config.overseerFrequency === 0) {
      const overseerReport = await overseer.runOversightCycle(this.iteration);
      if (overseerReport.insights.length > 0) {
        overseerSummary = `Insights: ${overseerReport.insights.join("; ")}`;
        insightsExtracted += overseerReport.insights.length;
      }
    }

    // 6. Check report schedule (generates daily/weekly reports if due)
    await reportGenerator.checkSchedule();

    // Complete the iteration
    const successCount = results.filter(r => r.success).length;
    await outputManager.completeIteration(overseerSummary, insightsExtracted);

    // Save health status to file
    await healthMonitor.runHealthChecks();

    // Update state
    updateState({
      iteration: this.iteration,
      lastRun: new Date(),
      lastAgent: this.gemini2Runner.getName(),
    });

    await logger.info("iteration_complete_summary", {
      iteration: this.iteration,
      focusArea: focusArea.name,
      successCount,
      totalAgents: results.length,
      hadOverseer: !!overseerSummary,
    });
  }

  /**
   * Run a single agent
   */
  private async runAgent(
    runner: CodexRunner | GeminiRunner,
    focusArea: FocusArea,
    basePrompt: string,
    previousOutputs: string[]
  ): Promise<RunnerResult> {
    const context: RunnerContext = {
      iteration: this.iteration,
      focusArea: focusArea.name,
      previousOutputs,
      prompt: basePrompt,
    };

    const result = await runner.run(context);

    // Record in output manager
    outputManager.recordOutput({
      agent: runner.getName(),
      iteration: this.iteration,
      focusArea: focusArea.name,
      output: result.output,
      timestamp: result.timestamp,
      success: result.success,
      duration: result.duration,
    });

    updateState({ lastAgent: runner.getName() });

    return result;
  }

  /**
   * Get the next focus area in rotation
   */
  private getNextFocusArea(): FocusArea {
    const focusArea = config.focusAreas[this.currentFocusIndex];
    this.currentFocusIndex = (this.currentFocusIndex + 1) % config.focusAreas.length;
    return focusArea;
  }


  /**
   * Extract insights from agent output and save to report generator
   */
  private async extractAndSaveInsights(output: string, focusArea: string): Promise<number> {
    const insights: string[] = [];
    const lines = output.split("\n");

    // Look for insight patterns (bullets, numbered lists, headers)
    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty or very short lines
      if (trimmed.length < 20) continue;

      // Extract key insight patterns
      if (
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ") ||
        trimmed.startsWith("• ") ||
        trimmed.match(/^\d+\.\s/) ||
        trimmed.startsWith("**") ||
        trimmed.startsWith("##")
      ) {
        const content = trimmed
          .replace(/^[-*•\d.#]+\s*/, "")
          .replace(/\*\*/g, "")
          .trim();

        if (content.length > 20 && content.length < 500) {
          insights.push(content);
        }
      }
    }

    // Add top insights to report generator (limit to 5 per agent output)
    let added = 0;
    for (const insight of insights.slice(0, 5)) {
      // Generate a title from the first ~50 chars
      const title = insight.substring(0, 50) + (insight.length > 50 ? "..." : "");

      // Estimate confidence based on content patterns
      let confidence = 0.5; // baseline
      if (insight.includes("recommend") || insight.includes("should")) confidence += 0.15;
      if (insight.includes("opportunity") || insight.includes("action")) confidence += 0.15;
      if (insight.includes("critical") || insight.includes("important")) confidence += 0.1;
      if (insight.includes("$") || insight.includes("budget") || insight.includes("revenue")) confidence += 0.1;
      confidence = Math.min(confidence, 0.95);

      await reportGenerator.addInsight(
        title,
        insight,
        focusArea,
        confidence,
        [`iteration-${this.iteration}`]
      );
      added++;
    }

    return added;
  }

  /**
   * Sleep for a specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current iteration number
   */
  getIteration(): number {
    return this.iteration;
  }

  /**
   * Check if running
   */
  isRunning(): boolean {
    return this.running;
  }
}

export const orchestrator = new Orchestrator();
