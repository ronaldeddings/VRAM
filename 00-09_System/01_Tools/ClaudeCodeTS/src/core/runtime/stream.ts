import type { CoreStreamDiagnostic, CoreStreamEvent, CoreStreamProgress, CoreStreamChunk, CoreStreamClose, StreamId } from "../types/runtime.js";
import type { MonotonicClock } from "./clock.js";
import { BoundedAsyncQueue, type DropPolicy } from "./queue.js";

export type CoreStream = AsyncIterable<CoreStreamEvent> & {
  readonly id: StreamId;
  readonly closed: boolean;
  stats: () => { dropped: number; buffered: number; maxBuffered: number };
  pushChunk: (chunk: Omit<CoreStreamChunk, "kind" | "seq" | "tsMonoMs">) => Promise<void>;
  pushProgress: (progress: Omit<CoreStreamProgress, "kind" | "seq" | "tsMonoMs">) => Promise<void>;
  pushDiagnostic: (diag: Omit<CoreStreamDiagnostic, "kind" | "seq" | "tsMonoMs">) => Promise<void>;
  close: (close: Omit<CoreStreamClose, "kind" | "seq" | "tsMonoMs">) => void;
};

export type CoreStreamOptions = {
  id: StreamId;
  clock: MonotonicClock;
  maxBuffered: number;
  dropPolicy: DropPolicy;
  onEmitSeq?: (seq: number) => void;
  onClosed?: () => void;
};

export function createCoreStream(options: CoreStreamOptions): CoreStream {
  const queue = new BoundedAsyncQueue<CoreStreamEvent>({
    maxSize: Math.max(0, options.maxBuffered),
    dropPolicy: options.dropPolicy
  });

  let seq = 0;
  let closed = false;

  const emit = async (event: Omit<CoreStreamEvent, "seq" | "tsMonoMs">): Promise<void> => {
    if (closed) return;
    seq += 1;
    const envelope = { ...event, seq, tsMonoMs: options.clock.nowMs() } as CoreStreamEvent;
    options.onEmitSeq?.(seq);
    await queue.push(envelope);
  };

  const stream: CoreStream = Object.assign(queue, {
    id: options.id,
    get closed() {
      return closed;
    },
    stats() {
      const s = queue.stats();
      return { dropped: s.dropped, buffered: s.size, maxBuffered: s.maxSize };
    },
    pushChunk: (chunk: Omit<CoreStreamChunk, "kind" | "seq" | "tsMonoMs">) => emit({ kind: "chunk", ...chunk }),
    pushProgress: (progress: Omit<CoreStreamProgress, "kind" | "seq" | "tsMonoMs">) => emit({ kind: "progress", ...progress }),
    pushDiagnostic: (diag: Omit<CoreStreamDiagnostic, "kind" | "seq" | "tsMonoMs">) => emit({ kind: "diagnostic", ...diag }),
    close: (closeInfo: Omit<CoreStreamClose, "kind" | "seq" | "tsMonoMs">) => {
      if (closed) return;
      closed = true;
      seq += 1;
      const closeEvent: CoreStreamClose = { kind: "close", ...closeInfo, seq, tsMonoMs: options.clock.nowMs() };
      options.onEmitSeq?.(seq);
      queue.closeWithFinalItem(closeEvent, { kind: "closed", message: "stream closed" });
      options.onClosed?.();
    }
  });

  return stream;
}
