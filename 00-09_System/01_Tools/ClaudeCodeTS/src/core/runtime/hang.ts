import type { MonotonicClock } from "./clock.js";
import type { RuntimeSnapshot } from "../types/runtime.js";

export type HangCategory = "tool" | "mcp" | "agent" | "generic";

export type HangThresholds = Partial<Record<HangCategory, number>>;

export type HangIncident = {
  category: HangCategory;
  summary: string;
  snapshot: RuntimeSnapshot;
};

export class HangDetector {
  private readonly clock: MonotonicClock;
  private readonly thresholdsMs: Record<HangCategory, number>;

  private lastProgressMonoMsByCategory: Record<HangCategory, number>;
  private firedByCategory = new Set<HangCategory>();
  private waitingOnUser = false;

  constructor(options: { clock: MonotonicClock; thresholdsMs?: HangThresholds }) {
    this.clock = options.clock;
    this.thresholdsMs = {
      generic: 30_000,
      tool: 60_000,
      mcp: 60_000,
      agent: 60_000,
      ...options.thresholdsMs
    };
    const now = this.clock.nowMs();
    this.lastProgressMonoMsByCategory = { generic: now, tool: now, mcp: now, agent: now };
  }

  setWaitingOnUser(value: boolean): void {
    this.waitingOnUser = value;
  }

  recordProgress(category: HangCategory = "generic"): void {
    this.lastProgressMonoMsByCategory[category] = this.clock.nowMs();
    this.firedByCategory.delete(category);
  }

  check(category: HangCategory, snapshot: RuntimeSnapshot): HangIncident | null {
    if (this.waitingOnUser) return null;
    if (this.firedByCategory.has(category)) return null;

    const now = this.clock.nowMs();
    const last = this.lastProgressMonoMsByCategory[category];
    const threshold = this.thresholdsMs[category];
    if (now - last < threshold) return null;

    this.firedByCategory.add(category);
    return {
      category,
      summary: `No progress for ${now - last}ms (threshold ${threshold}ms)`,
      snapshot
    };
  }
}

