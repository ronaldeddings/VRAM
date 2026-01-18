// Base Runner Interface
// Abstract class for AI agent runners (Claude, Codex, Gemini)

import { config, type AgentConfig } from "../utils/config";
import { logger } from "../utils/logger";

export interface RunnerResult {
  success: boolean;
  output: string;
  error?: string;
  duration: number;
  timestamp: Date;
  agent: string;
}

export interface RunnerContext {
  iteration: number;
  focusArea: string;
  previousOutputs: string[];
  prompt: string;
}

export abstract class BaseRunner {
  protected name: string;
  protected command: string;
  protected args: readonly string[];
  protected outputDir: string;

  constructor(agentConfig: AgentConfig) {
    this.name = agentConfig.name;
    this.command = agentConfig.command;
    this.args = agentConfig.args;
    this.outputDir = `${config.triadPath}/${config.outputPath}/${this.name.toLowerCase()}`;
  }

  /**
   * Execute the agent with the given context
   */
  async run(context: RunnerContext): Promise<RunnerResult> {
    const startTime = Date.now();
    await logger.agentStart(this.name, context.iteration);

    try {
      // Build the full command
      const fullPrompt = this.buildPrompt(context);
      const result = await this.executeCommand(fullPrompt);

      // Save output to file
      await this.saveOutput(context.iteration, result.output);

      const duration = Date.now() - startTime;
      await logger.agentComplete(this.name, context.iteration, duration, result.success);

      return {
        ...result,
        duration,
        timestamp: new Date(),
        agent: this.name,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      await logger.agentError(this.name, context.iteration, errorMessage);

      return {
        success: false,
        output: "",
        error: errorMessage,
        duration,
        timestamp: new Date(),
        agent: this.name,
      };
    }
  }

  /**
   * Build the prompt for the agent including context
   */
  protected buildPrompt(context: RunnerContext): string {
    // Each runner can customize this
    return context.prompt;
  }

  /**
   * Execute the CLI command and return result
   */
  protected async executeCommand(prompt: string): Promise<{ success: boolean; output: string; error?: string }> {
    const proc = Bun.spawn([this.command, ...this.args, prompt], {
      cwd: config.vramPath, // Run from VRAM root for context
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      return {
        success: false,
        output: output,
        error: stderr || `Exit code: ${exitCode}`,
      };
    }

    return {
      success: true,
      output: output.trim(),
    };
  }

  /**
   * Save agent output to file for history and context
   */
  protected async saveOutput(iteration: number, output: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${this.outputDir}/iter-${iteration.toString().padStart(5, "0")}-${timestamp}.txt`;

    await Bun.write(filename, output);
    await logger.debug("output_saved", { agent: this.name, iteration, path: filename });
  }

  /**
   * Get recent outputs for context building
   */
  async getRecentOutputs(count: number = config.maxPreviousOutputs): Promise<string[]> {
    const glob = new Bun.Glob("*.txt");
    const files: string[] = [];

    for await (const file of glob.scan({ cwd: this.outputDir, absolute: true })) {
      files.push(file);
    }

    // Sort by filename (which includes timestamp) and get latest
    files.sort().reverse();
    const recentFiles = files.slice(0, count);

    const outputs: string[] = [];
    for (const file of recentFiles) {
      const content = await Bun.file(file).text();
      outputs.push(content);
    }

    return outputs;
  }

  /**
   * Get the agent name
   */
  getName(): string {
    return this.name;
  }
}
