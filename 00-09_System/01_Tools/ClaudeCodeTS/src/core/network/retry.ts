export type BackoffConfig = {
  baseMs: number;
  factor: number;
  maxMs: number;
  jitter?: "none" | "full";
};

export function computeBackoffDelayMs(attempt: number, config: BackoffConfig, rng?: () => number): number {
  const exp = config.baseMs * Math.pow(config.factor, Math.max(0, attempt - 1));
  const capped = Math.min(config.maxMs, exp);
  const jitter = config.jitter ?? "full";
  if (jitter === "none") return Math.floor(capped);
  const r = rng ? rng() : 0.5;
  return Math.floor(r * capped);
}

export type RetryOptions = {
  maxAttempts: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  backoff: BackoffConfig;
  sleep: (ms: number) => Promise<void>;
  rng?: () => number;
  signal?: AbortSignal;
};

export async function retryWithBackoff<T>(fn: (attempt: number) => Promise<T>, options: RetryOptions): Promise<T> {
  const shouldRetry = options.shouldRetry ?? (() => true);
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    options.signal?.throwIfAborted?.();
    try {
      return await fn(attempt);
    } catch (error) {
      if (attempt >= options.maxAttempts) throw error;
      if (!shouldRetry(error, attempt)) throw error;
      const delay = computeBackoffDelayMs(attempt, options.backoff, options.rng);
      await options.sleep(delay);
    }
  }
  throw new Error("retryWithBackoff: unreachable");
}

