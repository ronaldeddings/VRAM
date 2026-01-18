import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { AppConfig } from '../types/index.ts';
import { getClaudeProjectsDirectory } from '../utils/path.ts';

// Zod schema for configuration validation
const AppConfigSchema = z.object({
  defaultModel: z.string().optional(),
  maxTurns: z.number().min(1).max(100).default(20),
  allowedTools: z.array(z.string()).default([
    'Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'Glob', 'Grep', 'TodoWrite'
  ]),
  projectsDirectory: z.string().default(getClaudeProjectsDirectory()),
  todoDefaults: z.object({
    maxTasks: z.number().min(1).max(50).default(10),
    requiredTasks: z.array(z.string()).default([])
  }).default({})
});

/**
 * Default application configuration
 */
const DEFAULT_CONFIG: AppConfig = {
  defaultModel: "claude-sonnet-4-20250514",
  maxTurns: 20,
  allowedTools: [
    'Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'Glob', 'Grep', 'TodoWrite'
  ],
  projectsDirectory: getClaudeProjectsDirectory(),
  todoDefaults: {
    maxTasks: 10,
    requiredTasks: []
  }
};

/**
 * Configuration manager class
 */
export class ConfigManager {
  private config: AppConfig;
  private configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || join(process.cwd(), 'config.json');
    this.config = this.loadConfig();
  }

  /**
   * Loads configuration from file, environment variables, and defaults
   */
  private loadConfig(): AppConfig {
    let fileConfig = {};

    // Try to load from config file
    if (existsSync(this.configPath)) {
      try {
        const configFile = readFileSync(this.configPath, 'utf-8');
        fileConfig = JSON.parse(configFile);
      } catch (error) {
        console.warn(`Failed to load config file ${this.configPath}:`, error);
      }
    }

    // Merge with environment variables
    const envConfig = this.loadFromEnvironment();

    // Merge configurations: env > file > defaults
    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...fileConfig,
      ...envConfig
    };

    // Validate and parse with Zod
    try {
      return AppConfigSchema.parse(mergedConfig);
    } catch (error) {
      console.error('Configuration validation failed:', error);
      console.warn('Using default configuration');
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Loads configuration from environment variables
   */
  private loadFromEnvironment(): Partial<AppConfig> {
    const envConfig: any = {};

    if (process.env.CLAUDE_SDK_DEFAULT_MODEL) {
      envConfig.defaultModel = process.env.CLAUDE_SDK_DEFAULT_MODEL;
    }

    if (process.env.CLAUDE_SDK_MAX_TURNS) {
      const maxTurns = parseInt(process.env.CLAUDE_SDK_MAX_TURNS);
      if (!isNaN(maxTurns)) {
        envConfig.maxTurns = maxTurns;
      }
    }

    if (process.env.CLAUDE_SDK_ALLOWED_TOOLS) {
      envConfig.allowedTools = process.env.CLAUDE_SDK_ALLOWED_TOOLS.split(',').map(t => t.trim());
    }

    if (process.env.CLAUDE_SDK_PROJECTS_DIR) {
      envConfig.projectsDirectory = process.env.CLAUDE_SDK_PROJECTS_DIR;
    }

    if (process.env.CLAUDE_SDK_MAX_TASKS) {
      const maxTasks = parseInt(process.env.CLAUDE_SDK_MAX_TASKS);
      if (!isNaN(maxTasks)) {
        envConfig.todoDefaults = { ...envConfig.todoDefaults, maxTasks };
      }
    }

    if (process.env.CLAUDE_SDK_REQUIRED_TASKS) {
      const requiredTasks = process.env.CLAUDE_SDK_REQUIRED_TASKS.split(',').map(t => t.trim());
      envConfig.todoDefaults = { ...envConfig.todoDefaults, requiredTasks };
    }

    return envConfig;
  }

  /**
   * Gets the current configuration
   */
  getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Updates configuration at runtime
   */
  updateConfig(updates: Partial<AppConfig>): void {
    const newConfig = { ...this.config, ...updates };
    
    try {
      this.config = AppConfigSchema.parse(newConfig);
    } catch (error) {
      throw new Error(`Invalid configuration update: ${error}`);
    }
  }

  /**
   * Gets a specific configuration value
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  /**
   * Sets a specific configuration value
   */
  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    const updates = { [key]: value } as Partial<AppConfig>;
    this.updateConfig(updates);
  }

  /**
   * Validates SDK options against current configuration
   */
  validateSdkOptions(options: any): boolean {
    // Check if all specified tools are allowed
    if (options.allowedTools) {
      const allowedTools = this.config.allowedTools;
      const invalidTools = options.allowedTools.filter((tool: string) => !allowedTools.includes(tool));
      if (invalidTools.length > 0) {
        console.warn(`Invalid tools specified: ${invalidTools.join(', ')}`);
        return false;
      }
    }

    // Check max turns
    if (options.maxTurns && options.maxTurns > this.config.maxTurns) {
      console.warn(`Max turns ${options.maxTurns} exceeds configured limit ${this.config.maxTurns}`);
      return false;
    }

    return true;
  }

  /**
   * Creates SDK options from current configuration
   */
  createSdkOptions(overrides: any = {}): any {
    return {
      model: this.config.defaultModel,
      maxTurns: this.config.maxTurns,
      allowedTools: this.config.allowedTools,
      cwd: process.cwd(),
      ...overrides
    };
  }
}