export type MonotonicClock = {
  nowMs: () => number;
};

export type WallClock = {
  nowMs: () => number;
};

export function systemMonotonicClock(): MonotonicClock {
  const hasPerformance = typeof globalThis.performance !== "undefined" && typeof globalThis.performance.now === "function";
  const baseWall = Date.now();
  const baseMono = hasPerformance ? globalThis.performance.now() : 0;
  return {
    nowMs() {
      if (!hasPerformance) return Date.now();
      return Math.round(baseWall + (globalThis.performance.now() - baseMono));
    }
  };
}

export function systemWallClock(): WallClock {
  return { nowMs: () => Date.now() };
}

export class TestClock implements MonotonicClock, WallClock {
  private t = 0;

  constructor(startMs = 0) {
    this.t = startMs;
  }

  nowMs(): number {
    return this.t;
  }

  advanceBy(deltaMs: number): number {
    if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new Error(`advanceBy expects a non-negative finite number, got ${deltaMs}`);
    this.t += deltaMs;
    return this.t;
  }

  advanceTo(targetMs: number): number {
    if (!Number.isFinite(targetMs) || targetMs < this.t) throw new Error(`advanceTo expects >= current time (${this.t}), got ${targetMs}`);
    this.t = targetMs;
    return this.t;
  }
}

