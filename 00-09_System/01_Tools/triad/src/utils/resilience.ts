// Resilience - Circuit breaker, graceful degradation, and error recovery
// Phase 9.2: System Resilience

import { config } from "./config";
import { logger } from "./logger";

// Circuit breaker states
export type CircuitState = "closed" | "open" | "half-open";

// Degradation levels
export type DegradationLevel = "normal" | "reduced" | "minimal" | "emergency";

// Circuit breaker for a service
export interface CircuitBreaker {
  name: string;
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailure?: string;
  lastSuccess?: string;
  openedAt?: string;
  halfOpenAt?: string;
  config: {
    failureThreshold: number;
    successThreshold: number;
    timeout: number; // ms before trying half-open
    resetTimeout: number; // ms before resetting counts
  };
}

// Error record
export interface ErrorRecord {
  id: string;
  service: string;
  error: string;
  stack?: string;
  context: Record<string, unknown>;
  timestamp: string;
  recovered: boolean;
  recoveryAttempts: number;
  recoveryStrategy?: string;
}

// Health status
export interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy" | "critical";
  degradationLevel: DegradationLevel;
  circuits: Record<string, CircuitBreaker>;
  recentErrors: number;
  uptime: number;
  lastCheck: string;
}

// Recovery strategy
export interface RecoveryStrategy {
  name: string;
  condition: (error: Error, context: Record<string, unknown>) => boolean;
  recover: (error: Error, context: Record<string, unknown>) => Promise<boolean>;
  maxAttempts: number;
}

class ResilienceManager {
  private circuits: Map<string, CircuitBreaker> = new Map();
  private errors: ErrorRecord[] = [];
  private recoveryStrategies: RecoveryStrategy[] = [];
  private degradationLevel: DegradationLevel = "normal";
  private statePath: string;
  private startTime: Date;

  constructor() {
    this.statePath = config.statePath;
    this.startTime = new Date();
    this.initializeDefaultStrategies();
  }

  // Initialize default recovery strategies
  private initializeDefaultStrategies(): void {
    // Retry strategy
    this.recoveryStrategies.push({
      name: "simple_retry",
      condition: (error) =>
        error.message.includes("timeout") || error.message.includes("ECONNRESET"),
      recover: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true; // Signal to retry
      },
      maxAttempts: 3,
    });

    // API rate limit strategy
    this.recoveryStrategies.push({
      name: "rate_limit_backoff",
      condition: (error) =>
        error.message.includes("rate limit") || error.message.includes("429"),
      recover: async (_, context) => {
        const backoffTime = (context.attempt as number || 1) * 5000;
        await logger.info("rate_limit_backoff", { backoffTime });
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        return true;
      },
      maxAttempts: 5,
    });

    // Memory recovery strategy
    this.recoveryStrategies.push({
      name: "memory_recovery",
      condition: (error) =>
        error.message.includes("heap") || error.message.includes("memory"),
      recover: async () => {
        if (global.gc) {
          global.gc();
          await logger.info("forced_gc");
        }
        return true;
      },
      maxAttempts: 2,
    });
  }

  // Create or get circuit breaker
  getCircuit(name: string): CircuitBreaker {
    if (!this.circuits.has(name)) {
      this.circuits.set(name, {
        name,
        state: "closed",
        failureCount: 0,
        successCount: 0,
        config: {
          failureThreshold: 3,
          successThreshold: 2,
          timeout: 30000, // 30 seconds
          resetTimeout: 60000, // 1 minute
        },
      });
    }
    return this.circuits.get(name)!;
  }

  // Record success for circuit
  recordSuccess(circuitName: string): void {
    const circuit = this.getCircuit(circuitName);
    circuit.successCount++;
    circuit.lastSuccess = new Date().toISOString();

    if (circuit.state === "half-open") {
      if (circuit.successCount >= circuit.config.successThreshold) {
        circuit.state = "closed";
        circuit.failureCount = 0;
        circuit.successCount = 0;
        logger.info("circuit_closed", { circuit: circuitName });
      }
    }
  }

  // Record failure for circuit
  recordFailure(circuitName: string, error: Error): void {
    const circuit = this.getCircuit(circuitName);
    circuit.failureCount++;
    circuit.lastFailure = new Date().toISOString();

    if (circuit.state === "closed") {
      if (circuit.failureCount >= circuit.config.failureThreshold) {
        circuit.state = "open";
        circuit.openedAt = new Date().toISOString();
        logger.warn("circuit_opened", {
          circuit: circuitName,
          failureCount: circuit.failureCount,
        });

        // Schedule half-open transition
        setTimeout(() => {
          if (circuit.state === "open") {
            circuit.state = "half-open";
            circuit.halfOpenAt = new Date().toISOString();
            circuit.successCount = 0;
            logger.info("circuit_half_open", { circuit: circuitName });
          }
        }, circuit.config.timeout);
      }
    } else if (circuit.state === "half-open") {
      // Failed while testing, reopen
      circuit.state = "open";
      circuit.openedAt = new Date().toISOString();
      logger.warn("circuit_reopened", { circuit: circuitName });
    }
  }

  // Check if circuit allows request
  canExecute(circuitName: string): boolean {
    const circuit = this.getCircuit(circuitName);

    switch (circuit.state) {
      case "closed":
        return true;
      case "open":
        // Check if timeout has passed
        if (circuit.openedAt) {
          const elapsed = Date.now() - new Date(circuit.openedAt).getTime();
          if (elapsed >= circuit.config.timeout) {
            circuit.state = "half-open";
            circuit.halfOpenAt = new Date().toISOString();
            circuit.successCount = 0;
            return true;
          }
        }
        return false;
      case "half-open":
        return true;
    }
  }

  // Execute with circuit breaker protection
  async executeWithCircuit<T>(
    circuitName: string,
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    if (!this.canExecute(circuitName)) {
      await logger.warn("circuit_blocked", { circuit: circuitName });
      if (fallback) {
        return fallback();
      }
      throw new Error(`Circuit ${circuitName} is open`);
    }

    try {
      const result = await operation();
      this.recordSuccess(circuitName);
      return result;
    } catch (error) {
      this.recordFailure(circuitName, error as Error);

      // Try recovery
      const recovered = await this.attemptRecovery(error as Error, {
        circuit: circuitName,
      });

      if (recovered) {
        // Retry once after recovery
        try {
          const result = await operation();
          this.recordSuccess(circuitName);
          return result;
        } catch (retryError) {
          this.recordFailure(circuitName, retryError as Error);
        }
      }

      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }

  // Attempt error recovery
  async attemptRecovery(
    error: Error,
    context: Record<string, unknown>
  ): Promise<boolean> {
    const errorRecord: ErrorRecord = {
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      service: (context.circuit as string) || "unknown",
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      recovered: false,
      recoveryAttempts: 0,
    };

    for (const strategy of this.recoveryStrategies) {
      if (strategy.condition(error, context)) {
        errorRecord.recoveryStrategy = strategy.name;

        for (let attempt = 1; attempt <= strategy.maxAttempts; attempt++) {
          errorRecord.recoveryAttempts = attempt;

          try {
            const recovered = await strategy.recover(error, {
              ...context,
              attempt,
            });

            if (recovered) {
              errorRecord.recovered = true;
              this.errors.push(errorRecord);
              await logger.info("error_recovered", {
                strategy: strategy.name,
                attempts: attempt,
              });
              return true;
            }
          } catch (recoveryError) {
            await logger.error("recovery_failed", {
              strategy: strategy.name,
              attempt,
              error:
                recoveryError instanceof Error
                  ? recoveryError.message
                  : "Unknown",
            });
          }
        }
      }
    }

    this.errors.push(errorRecord);
    return false;
  }

  // Set degradation level
  setDegradationLevel(level: DegradationLevel): void {
    if (this.degradationLevel !== level) {
      logger.warn("degradation_level_changed", {
        from: this.degradationLevel,
        to: level,
      });
      this.degradationLevel = level;
    }
  }

  // Get current degradation level
  getDegradationLevel(): DegradationLevel {
    return this.degradationLevel;
  }

  // Check if operation is allowed at current degradation level
  isOperationAllowed(operation: string): boolean {
    const allowedOperations: Record<DegradationLevel, string[]> = {
      normal: ["*"], // All operations
      reduced: [
        "core_analysis",
        "insight_extraction",
        "report_generation",
        "health_check",
      ],
      minimal: ["core_analysis", "health_check", "error_logging"],
      emergency: ["health_check", "error_logging"],
    };

    const allowed = allowedOperations[this.degradationLevel];
    return allowed.includes("*") || allowed.includes(operation);
  }

  // Auto-adjust degradation based on system state
  async autoAdjustDegradation(): Promise<void> {
    const health = await this.getSystemHealth();

    if (health.status === "critical") {
      this.setDegradationLevel("emergency");
    } else if (health.status === "unhealthy") {
      this.setDegradationLevel("minimal");
    } else if (health.status === "degraded") {
      this.setDegradationLevel("reduced");
    } else {
      this.setDegradationLevel("normal");
    }
  }

  // Get system health status
  async getSystemHealth(): Promise<SystemHealth> {
    const circuits: Record<string, CircuitBreaker> = {};
    let openCircuits = 0;
    let halfOpenCircuits = 0;

    for (const [name, circuit] of this.circuits) {
      circuits[name] = circuit;
      if (circuit.state === "open") openCircuits++;
      if (circuit.state === "half-open") halfOpenCircuits++;
    }

    const recentErrors = this.errors.filter(
      (e) => Date.now() - new Date(e.timestamp).getTime() < 5 * 60 * 1000
    ).length;

    let status: SystemHealth["status"];
    if (openCircuits >= 2 || recentErrors >= 10) {
      status = "critical";
    } else if (openCircuits >= 1 || recentErrors >= 5) {
      status = "unhealthy";
    } else if (halfOpenCircuits >= 1 || recentErrors >= 2) {
      status = "degraded";
    } else {
      status = "healthy";
    }

    return {
      status,
      degradationLevel: this.degradationLevel,
      circuits,
      recentErrors,
      uptime: Math.floor((Date.now() - this.startTime.getTime()) / 1000),
      lastCheck: new Date().toISOString(),
    };
  }

  // Get error history
  getErrorHistory(limit: number = 20): ErrorRecord[] {
    return this.errors
      .slice(-limit)
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  // Add custom recovery strategy
  addRecoveryStrategy(strategy: RecoveryStrategy): void {
    this.recoveryStrategies.push(strategy);
  }

  // Configure circuit breaker
  configureCircuit(
    name: string,
    config: Partial<CircuitBreaker["config"]>
  ): void {
    const circuit = this.getCircuit(name);
    circuit.config = { ...circuit.config, ...config };
  }

  // Reset circuit manually
  resetCircuit(name: string): void {
    const circuit = this.getCircuit(name);
    circuit.state = "closed";
    circuit.failureCount = 0;
    circuit.successCount = 0;
    circuit.openedAt = undefined;
    circuit.halfOpenAt = undefined;
    logger.info("circuit_reset", { circuit: name });
  }

  // Clear error history
  clearErrorHistory(): void {
    this.errors = [];
    logger.info("error_history_cleared");
  }

  // Save state
  async saveState(): Promise<void> {
    const state = {
      circuits: Object.fromEntries(this.circuits),
      errors: this.errors.slice(-50), // Keep last 50
      degradationLevel: this.degradationLevel,
      timestamp: new Date().toISOString(),
    };

    await Bun.write(
      `${this.statePath}/resilience.json`,
      JSON.stringify(state, null, 2)
    );
  }

  // Load state
  async loadState(): Promise<void> {
    try {
      const file = Bun.file(`${this.statePath}/resilience.json`);
      if (await file.exists()) {
        const state = await file.json();

        for (const [name, circuit] of Object.entries(state.circuits || {})) {
          this.circuits.set(name, circuit as CircuitBreaker);
        }

        this.errors = state.errors || [];
        this.degradationLevel = state.degradationLevel || "normal";
      }
    } catch {
      // Fresh start
    }
  }
}

export const resilience = new ResilienceManager();
