import type { MonotonicClock } from "../runtime/clock.js";
import { BoundedAsyncQueue, type DropPolicy } from "../runtime/queue.js";
import type { HookRunId } from "../types/state.js";
import type { HookStreamEvent, HookStreamEventKind } from "./types.js";

export type HookStream = AsyncIterable<HookStreamEvent> & {
  readonly hookRunId: HookRunId;
  readonly closed: boolean;
  stats: () => { dropped: number; buffered: number; maxBuffered: number; emitted: number };
  emit: (event: Omit<HookStreamEvent, "hookRunId" | "seq" | "tsMonoMs">) => Promise<void>;
  close: (reason: "completed" | "cancelled" | "error" | "closed") => void;
};

export type HookStreamOptions = {
  hookRunId: HookRunId;
  clock: MonotonicClock;
  maxBuffered: number;
  dropPolicy: DropPolicy;
};

export function createHookStream(options: HookStreamOptions): HookStream {
  const queue = new BoundedAsyncQueue<HookStreamEvent>({
    maxSize: Math.max(0, options.maxBuffered),
    dropPolicy: options.dropPolicy
  });
  const queueStats = queue.stats.bind(queue);

  let emitted = 0;
  let seq = 0;

  const emit = async (evt: Omit<HookStreamEvent, "hookRunId" | "seq" | "tsMonoMs">): Promise<void> => {
    if (queueStats().closed) return;
    seq += 1;
    emitted += 1;
    await queue.push({ hookRunId: options.hookRunId, seq, tsMonoMs: options.clock.nowMs(), ...evt } as HookStreamEvent);
  };

  const close: HookStream["close"] = (reason) => {
    if (queueStats().closed) return;
    seq += 1;
    emitted += 1;
    queue.closeWithFinalItem(
      { hookRunId: options.hookRunId, seq, tsMonoMs: options.clock.nowMs(), kind: "close", hookId: "system", payload: { reason } },
      { kind: "closed", message: "hook stream closed" }
    );
  };

  const stream: HookStream = Object.assign(queue, {
    hookRunId: options.hookRunId,
    get closed() {
      return queueStats().closed;
    },
    stats() {
      const s = queueStats();
      return { dropped: s.dropped, buffered: s.size, maxBuffered: s.maxSize, emitted };
    },
    emit,
    close
  });

  return stream;
}

export function isHookStreamEventKind(kind: unknown): kind is HookStreamEventKind {
  return (
    kind === "progress" ||
    kind === "success" ||
    kind === "non_blocking_error" ||
    kind === "blocking_error" ||
    kind === "cancelled" ||
    kind === "diagnostic" ||
    kind === "close"
  );
}

