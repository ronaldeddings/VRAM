// Triad Logger
// Structured logging utility for the AI Agent Orchestration System

import { config } from "./config";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  data?: Record<string, unknown>;
}

class Logger {
  private logFile: string;

  constructor() {
    this.logFile = `${config.logsPath}/triad.log`;
  }

  private formatEntry(level: LogLevel, event: string, data?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      event,
      data,
    };
  }

  private async writeToFile(entry: LogEntry): Promise<void> {
    const line = JSON.stringify(entry) + "\n";
    const file = Bun.file(this.logFile);
    const existing = await file.exists() ? await file.text() : "";
    await Bun.write(this.logFile, existing + line);
  }

  private formatConsole(entry: LogEntry): string {
    const levelColors: Record<LogLevel, string> = {
      debug: "\x1b[90m",   // Gray
      info: "\x1b[36m",    // Cyan
      warn: "\x1b[33m",    // Yellow
      error: "\x1b[31m",   // Red
    };
    const reset = "\x1b[0m";
    const time = entry.timestamp.split("T")[1]?.split(".")[0] || "";
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : "";
    return `${levelColors[entry.level]}[${time}] [${entry.level.toUpperCase()}]${reset} ${entry.event}${dataStr}`;
  }

  async log(level: LogLevel, event: string, data?: Record<string, unknown>): Promise<void> {
    const entry = this.formatEntry(level, event, data);
    console.log(this.formatConsole(entry));
    await this.writeToFile(entry);
  }

  async debug(event: string, data?: Record<string, unknown>): Promise<void> {
    await this.log("debug", event, data);
  }

  async info(event: string, data?: Record<string, unknown>): Promise<void> {
    await this.log("info", event, data);
  }

  async warn(event: string, data?: Record<string, unknown>): Promise<void> {
    await this.log("warn", event, data);
  }

  async error(event: string, data?: Record<string, unknown>): Promise<void> {
    await this.log("error", event, data);
  }

  // Specialized logging methods
  async agentStart(agent: string, iteration: number): Promise<void> {
    await this.info("agent_start", { agent, iteration });
  }

  async agentComplete(agent: string, iteration: number, duration: number, success: boolean): Promise<void> {
    await this.info("agent_complete", { agent, iteration, duration, success });
  }

  async agentError(agent: string, iteration: number, error: string): Promise<void> {
    await this.error("agent_error", { agent, iteration, error });
  }

  async iterationStart(iteration: number, focusArea: string): Promise<void> {
    await this.info("iteration_start", { iteration, focusArea });
  }

  async iterationComplete(iteration: number, insights: number, duration: number): Promise<void> {
    await this.info("iteration_complete", { iteration, insights, duration });
  }

  async healthCheck(status: string, checks: Record<string, boolean>): Promise<void> {
    await this.info("health_check", { status, checks });
  }

  async selfHealTriggered(component: string, failures: number): Promise<void> {
    await this.warn("self_heal_triggered", { component, failures });
  }

  async reportGenerated(type: string, path: string): Promise<void> {
    await this.info("report_generated", { type, path });
  }
}

export const logger = new Logger();
