import type {
  EngineEvent,
  EngineEventChannel,
  EngineEventCorrelationIds,
  EngineEventEnvelope,
  EngineEventSensitivity,
  EngineEventSeverity
} from "../types/events.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import { BoundedAsyncQueue, type DropPolicy } from "../runtime/queue.js";

export type ChannelPolicy = {
  bufferSize: number;
  dropPolicy: DropPolicy;
  mustDeliver: boolean;
  coalesce?: {
    key: (envelope: EngineEventEnvelope) => string | null;
    minIntervalMs?: number;
  };
};

export type EventBusOptions = {
  sessionId?: string;
  workspaceId?: string;
  idSource: IdSource;
  clock: MonotonicClock;
  wallClockMs?: () => number;
  channelPolicies?: Partial<Record<EngineEventChannel, Partial<ChannelPolicy>>>;
  channelSnapshots?: Partial<Record<EngineEventChannel, () => EngineEventEnvelope | null>>;
};

export type EngineEventCursor = {
  channel: EngineEventChannel;
  seq: number;
};

export type SubscribeOptions = {
  channel?: EngineEventChannel;
  cursor?: EngineEventCursor;
  replayBuffered?: boolean;
  includeSnapshot?: boolean;
};

export type Subscriber = {
  id: string;
  channel: EngineEventChannel | undefined;
  queue: BoundedAsyncQueue<EngineEventEnvelope>;
};

const defaultPolicies: Record<EngineEventChannel, ChannelPolicy> = {
  ui: { bufferSize: 256, dropPolicy: "drop_oldest", mustDeliver: true },
  transcript: { bufferSize: 512, dropPolicy: "drop_oldest", mustDeliver: true },
  diagnostic: { bufferSize: 512, dropPolicy: "drop_oldest", mustDeliver: false },
  telemetry: { bufferSize: 512, dropPolicy: "drop_oldest", mustDeliver: false },
  debug: { bufferSize: 512, dropPolicy: "drop_oldest", mustDeliver: false }
};

function mergePolicy(base: ChannelPolicy, override?: Partial<ChannelPolicy>): ChannelPolicy {
  if (!override) return base;
  const coalesce = override.coalesce ?? base.coalesce;
  return {
    bufferSize: override.bufferSize ?? base.bufferSize,
    dropPolicy: override.dropPolicy ?? base.dropPolicy,
    mustDeliver: override.mustDeliver ?? base.mustDeliver,
    ...(coalesce ? { coalesce } : {})
  };
}

export class EventBus {
  readonly sessionId: string | undefined;
  readonly workspaceId: string | undefined;

  private readonly idSource: IdSource;
  private readonly clock: MonotonicClock;
  private readonly wallClockMs: (() => number) | undefined;
  private readonly policies: Record<EngineEventChannel, ChannelPolicy>;
  private readonly snapshots: Partial<Record<EngineEventChannel, () => EngineEventEnvelope | null>>;

  private readonly subscribers = new Map<string, Subscriber>();
  private readonly bufferedByChannel = new Map<EngineEventChannel, EngineEventEnvelope[]>();
  private readonly bufferedMaxByChannel = new Map<EngineEventChannel, number>();
  private readonly seqByChannel = new Map<EngineEventChannel, number>();

  constructor(options: EventBusOptions) {
    this.sessionId = options.sessionId;
    this.workspaceId = options.workspaceId;
    this.idSource = options.idSource;
    this.clock = options.clock;
    this.wallClockMs = options.wallClockMs;

    this.policies = { ...defaultPolicies };
    for (const [channel, base] of Object.entries(defaultPolicies) as Array<[EngineEventChannel, ChannelPolicy]>) {
      const merged = mergePolicy(base, options.channelPolicies?.[channel]);
      this.policies[channel] = merged;
      this.bufferedByChannel.set(channel, []);
      this.bufferedMaxByChannel.set(channel, Math.max(0, merged.bufferSize));
      this.seqByChannel.set(channel, 0);
    }

    this.snapshots = options.channelSnapshots ?? {};
  }

  getCursor(channel: EngineEventChannel): EngineEventCursor {
    return { channel, seq: this.seqByChannel.get(channel) ?? 0 };
  }

  async emit(
    payload: EngineEvent,
    meta: {
      channel: EngineEventChannel;
      severity: EngineEventSeverity;
      sensitivity?: EngineEventSensitivity;
      correlationIds?: EngineEventCorrelationIds;
      tsWallMs?: number;
    }
  ): Promise<EngineEventEnvelope> {
    const nextSeq = (this.seqByChannel.get(meta.channel) ?? 0) + 1;
    this.seqByChannel.set(meta.channel, nextSeq);

    const envelope: EngineEventEnvelope = {
      kind: "engine_event_envelope",
      schemaVersion: SCHEMA_VERSION.engineEventEnvelope,
      eventId: this.idSource.nextId("evt"),
      ...(this.sessionId ? { sessionId: this.sessionId } : {}),
      ...(this.workspaceId ? { workspaceId: this.workspaceId } : {}),
      channel: meta.channel,
      severity: meta.severity,
      seq: nextSeq,
      tsMonoMs: this.clock.nowMs(),
      ...(meta.tsWallMs !== undefined
        ? { tsWallMs: meta.tsWallMs }
        : this.wallClockMs
          ? { tsWallMs: this.wallClockMs() }
          : {}),
      ...(meta.correlationIds ? { correlationIds: meta.correlationIds } : {}),
      sensitivity: meta.sensitivity ?? "internal",
      payload
    };

    this.bufferEvent(envelope);
    await this.fanOut(envelope);
    return envelope;
  }

  private bufferEvent(envelope: EngineEventEnvelope): void {
    const list = this.bufferedByChannel.get(envelope.channel);
    if (!list) return;
    const policy = this.policies[envelope.channel];
    const coalesceKeyFn = policy.coalesce?.key;
    const minIntervalMs = policy.coalesce?.minIntervalMs;
    const key = coalesceKeyFn ? coalesceKeyFn(envelope) : null;

    if (key && list.length > 0) {
      const last = list[list.length - 1]!;
      const lastKey = coalesceKeyFn ? coalesceKeyFn(last) : null;
      const withinInterval = minIntervalMs === undefined ? true : envelope.tsMonoMs - last.tsMonoMs <= minIntervalMs;
      if (lastKey === key && withinInterval) list[list.length - 1] = envelope;
      else list.push(envelope);
    } else {
      list.push(envelope);
    }
    const max = this.bufferedMaxByChannel.get(envelope.channel) ?? 0;
    if (max <= 0) return;
    while (list.length > max) list.shift();
  }

  private async fanOut(envelope: EngineEventEnvelope): Promise<void> {
    const policy = this.policies[envelope.channel];
    const coalesceKeyFn = policy.coalesce?.key;
    const minIntervalMs = policy.coalesce?.minIntervalMs;
    const shouldCoalesce = coalesceKeyFn
      ? (existing: EngineEventEnvelope, incoming: EngineEventEnvelope) => {
          const k1 = coalesceKeyFn(existing);
          const k2 = coalesceKeyFn(incoming);
          if (!k1 || !k2) return false;
          if (k1 !== k2) return false;
          if (minIntervalMs === undefined) return true;
          return incoming.tsMonoMs - existing.tsMonoMs <= minIntervalMs;
        }
      : undefined;

    const deliveries: Array<Promise<void>> = [];
    for (const subscriber of this.subscribers.values()) {
      if (subscriber.channel && subscriber.channel !== envelope.channel) continue;
      deliveries.push(subscriber.queue.push(envelope, shouldCoalesce ? { coalesce: shouldCoalesce } : undefined).then(() => undefined));
    }
    await Promise.all(deliveries);
  }

  subscribe(options: SubscribeOptions = {}): AsyncIterable<EngineEventEnvelope> & { unsubscribe: () => void } {
    const channel = options.channel;
    const policy = channel
      ? this.policies[channel]
      : ({ bufferSize: 512, dropPolicy: "drop_oldest", mustDeliver: false } satisfies ChannelPolicy);
    const queue = new BoundedAsyncQueue<EngineEventEnvelope>({
      maxSize: Math.max(0, policy.bufferSize),
      dropPolicy: policy.dropPolicy
    });

    const id = this.idSource.nextId("sub");
    const subscriber: Subscriber = { id, channel, queue };
    this.subscribers.set(id, subscriber);

    const iterator = this.createSubscriptionIterator(subscriber, options);
    return Object.assign(iterator, {
      unsubscribe: () => {
        this.subscribers.delete(id);
        queue.close({ kind: "closed", message: "unsubscribed" });
      }
    });
  }

  private async *createSubscriptionIterator(
    subscriber: Subscriber,
    options: SubscribeOptions
  ): AsyncGenerator<EngineEventEnvelope> {
    const channel = subscriber.channel;

    if (options.includeSnapshot && channel) {
      const snapshotProvider = this.snapshots[channel];
      const snapshot = snapshotProvider ? snapshotProvider() : null;
      if (snapshot) yield snapshot;
    }

    if (options.replayBuffered && channel) {
      const buffered = this.bufferedByChannel.get(channel) ?? [];
      const afterSeq = options.cursor?.seq ?? 0;
      for (const evt of buffered) {
        if (evt.seq > afterSeq) yield evt;
      }
    }

    for await (const evt of subscriber.queue) yield evt;
  }
}
