import { createDeferred, type Deferred } from "./deferred.js";

export type DropPolicy = "drop_oldest" | "drop_newest" | "block_producer";

export type QueueCloseReason =
  | { kind: "closed"; message?: string }
  | { kind: "cancelled"; message?: string }
  | { kind: "error"; message?: string };

export type QueueStats = {
  size: number;
  maxSize: number;
  dropped: number;
  closed: boolean;
};

export class BoundedAsyncQueue<T> implements AsyncIterable<T> {
  private readonly maxSize: number;
  private readonly dropPolicy: DropPolicy;

  private readonly items: T[] = [];
  private dropped = 0;
  private closed = false;
  private closeReason: QueueCloseReason | undefined;

  private waitingConsumer: Deferred<void> | undefined;
  private waitingProducer: Deferred<void> | undefined;

  constructor(options: { maxSize: number; dropPolicy: DropPolicy }) {
    this.maxSize = Math.max(0, options.maxSize);
    this.dropPolicy = options.dropPolicy;
  }

  stats(): QueueStats {
    return {
      size: this.items.length,
      maxSize: this.maxSize,
      dropped: this.dropped,
      closed: this.closed
    };
  }

  close(reason: QueueCloseReason = { kind: "closed" }): void {
    if (this.closed) return;
    this.closed = true;
    this.closeReason = reason;
    this.waitingConsumer?.resolve();
    this.waitingProducer?.resolve();
  }

  closeWithFinalItem(item: T, reason: QueueCloseReason = { kind: "closed" }): void {
    if (this.closed) return;
    this.closeReason = reason;

    if (this.maxSize === 0) {
      this.dropped += 1;
      this.closed = true;
      this.waitingConsumer?.resolve();
      this.waitingProducer?.resolve();
      return;
    }

    while (this.items.length >= this.maxSize) {
      this.items.shift();
      this.dropped += 1;
    }

    this.items.push(item);
    this.closed = true;
    this.waitingConsumer?.resolve();
    this.waitingProducer?.resolve();
  }

  async push(item: T, options?: { coalesce?: (existing: T, incoming: T) => boolean }): Promise<void> {
    if (this.closed) return;
    if (this.maxSize === 0) {
      this.dropped += 1;
      return;
    }

    if (options?.coalesce && this.items.length > 0) {
      const lastIdx = this.items.length - 1;
      const last = this.items[lastIdx]!;
      if (options.coalesce(last, item)) {
        this.items[lastIdx] = item;
        this.waitingConsumer?.resolve();
        return;
      }
    }

    if (this.items.length >= this.maxSize) {
      if (this.dropPolicy === "drop_newest") {
        this.dropped += 1;
        return;
      }
      if (this.dropPolicy === "drop_oldest") {
        this.items.shift();
        this.dropped += 1;
      } else if (this.dropPolicy === "block_producer") {
        while (!this.closed && this.items.length >= this.maxSize) {
          if (!this.waitingProducer) this.waitingProducer = createDeferred<void>();
          await this.waitingProducer.promise;
          this.waitingProducer = undefined;
        }
        if (this.closed) return;
      }
    }

    this.items.push(item);
    this.waitingConsumer?.resolve();
  }

  private shift(): T | undefined {
    const item = this.items.shift();
    if (item !== undefined && this.items.length < this.maxSize) this.waitingProducer?.resolve();
    return item;
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    while (true) {
      const item = this.shift();
      if (item !== undefined) {
        yield item;
        continue;
      }

      if (this.closed) return;

      if (!this.waitingConsumer) this.waitingConsumer = createDeferred<void>();
      await this.waitingConsumer.promise;
      this.waitingConsumer = undefined;
    }
  }
}
