import type { EngineEventChannel, EngineEventSensitivity, EngineEventSeverity } from "../types/events.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { JsonObject } from "../types/json.js";
import type { LogCorrelationIds, LogPrivacyTier, LogSeverity, StructuredLogRecordV1 } from "../types/observability.js";
import { BoundedAsyncQueue, type DropPolicy } from "../runtime/queue.js";
import type { EventBus } from "../events/bus.js";
import type { Sampler } from "./sampling.js";
import { createDeterministicSampler } from "./sampling.js";

export type LogSink = {
  write: (record: StructuredLogRecordV1) => Promise<void> | void;
  flush?: () => Promise<void>;
  getDropCount?: () => number;
};

export function createConsoleLogSink(options: { to?: "stdout" | "stderr"; json?: boolean } = {}): LogSink {
  const to = options.to ?? "stderr";
  const json = options.json ?? true;
  return {
    write: async (record) => {
      const line = json ? JSON.stringify(record) : `[${record.severity}] ${record.subsystem}: ${record.message}`;
      if (to === "stdout") console.log(line);
      else console.error(line);
    }
  };
}

export type LogSinkStats = {
  dropped: number;
  buffered: number;
};

export type BufferedLogSink = LogSink & {
  stats: () => LogSinkStats;
};

function nowWallMs(): number {
  return Date.now();
}

function normalizePrivacy(privacy: LogPrivacyTier): EngineEventSensitivity {
  if (privacy === "public") return "public";
  if (privacy === "internal") return "internal";
  return "pii";
}

function normalizeSeverity(severity: LogSeverity): EngineEventSeverity {
  if (severity === "debug") return "debug";
  if (severity === "info") return "info";
  if (severity === "warn") return "warn";
  return "error";
}

export function createEventBusLogSink(bus: EventBus, options: { channel?: EngineEventChannel } = {}): LogSink {
  const channel = options.channel ?? "diagnostic";
  return {
    write: async (record) => {
      await bus.emit(
        { type: "diag/structured-log", record },
        { channel, severity: normalizeSeverity(record.severity), sensitivity: normalizePrivacy(record.privacy) }
      );
    }
  };
}

export function createBufferedLogSink(
  sink: LogSink,
  options: { maxBuffered: number; dropPolicy: DropPolicy; pump?: "auto" | "manual" } = { maxBuffered: 512, dropPolicy: "drop_oldest", pump: "auto" }
): BufferedLogSink {
  const queue = new BoundedAsyncQueue<StructuredLogRecordV1>({ maxSize: Math.max(0, options.maxBuffered), dropPolicy: options.dropPolicy });
  let pumping = false;

  const pumpOnce = async (): Promise<void> => {
    if (pumping) return;
    pumping = true;
    try {
      const it = queue[Symbol.asyncIterator]();
      while (true) {
        const next = await it.next();
        if (next.done) break;
        await sink.write(next.value);
      }
    } finally {
      pumping = false;
    }
  };

  if (options.pump !== "manual") void pumpOnce();

  return {
    write: async (record) => {
      await queue.push(record);
    },
    flush: async () => {
      queue.close({ kind: "closed", message: "flush" });
      await pumpOnce();
      if (sink.flush) await sink.flush();
    },
    getDropCount: () => queue.stats().dropped,
    stats: () => ({ dropped: queue.stats().dropped, buffered: queue.stats().size })
  };
}

const PRIVACY_ORDER: Record<LogPrivacyTier, number> = { public: 0, internal: 1, sensitive: 2 };

function privacyAllowed(privacy: LogPrivacyTier, max: LogPrivacyTier): boolean {
  return PRIVACY_ORDER[privacy] <= PRIVACY_ORDER[max];
}

function redactFieldsForPrivacy(fields: JsonObject): JsonObject {
  return { __redacted_keys: Object.keys(fields).sort() };
}

export function createPrivacyEnforcingLogSink(sink: LogSink, options: { maxPrivacy: LogPrivacyTier }): LogSink {
  const maxPrivacy = options.maxPrivacy;
  return {
    write: async (record) => {
      if (privacyAllowed(record.privacy, maxPrivacy)) return await sink.write(record);
      const redactedFields = record.fields ? redactFieldsForPrivacy(record.fields) : undefined;
      const redacted: StructuredLogRecordV1 = {
        ...record,
        privacy: maxPrivacy,
        redacted: true,
        message: "<redacted>",
        ...(redactedFields ? { fields: redactedFields } : {})
      };
      await sink.write(redacted);
    },
    ...(sink.flush ? { flush: sink.flush } : {}),
    ...(sink.getDropCount ? { getDropCount: sink.getDropCount } : {})
  };
}

export type Logger = {
  log: (entry: { subsystem: string; severity: LogSeverity; message: string; fields?: JsonObject; privacy?: LogPrivacyTier; correlationIds?: LogCorrelationIds }) => Promise<void>;
  child: (fields: { subsystem?: string; correlationIds?: LogCorrelationIds; privacy?: LogPrivacyTier }) => Logger;
};

export function createLogger(
  sink: LogSink,
  options: { defaultPrivacy?: LogPrivacyTier; seed?: string; sampler?: Sampler; maxPrivacy?: LogPrivacyTier } = {}
): Logger {
  const sampler = options.sampler ?? createDeterministicSampler(options.seed ?? "default");
  const defaultPrivacy = options.defaultPrivacy ?? "internal";
  const enforcedSink = options.maxPrivacy ? createPrivacyEnforcingLogSink(sink, { maxPrivacy: options.maxPrivacy }) : sink;

  const base: { subsystem?: string; correlationIds?: LogCorrelationIds; privacy?: LogPrivacyTier } = {};

  const mk = (ctx: typeof base): Logger => ({
    log: async ({ subsystem, severity, message, fields, privacy, correlationIds }) => {
      const subsys = subsystem ?? ctx.subsystem ?? "unknown";
      const corr = correlationIds ?? ctx.correlationIds;
      const priv = privacy ?? ctx.privacy ?? defaultPrivacy;

      const samplingKey = `${subsys}:${severity}:${message}`;
      const rate =
        subsys.startsWith("tool_stream") || subsys.startsWith("mcp_chunk") ? 0.01 : severity === "debug" ? 0.1 : 1;
      const sampled = sampler.shouldSample(samplingKey, rate);
      const record: StructuredLogRecordV1 = {
        kind: "structured_log_record",
        schemaVersion: SCHEMA_VERSION.structuredLogRecord,
        tsWallMs: nowWallMs(),
        subsystem: subsys,
        severity,
        message,
        ...(corr ? { correlationIds: corr } : {}),
        privacy: priv,
        ...(fields ? { fields } : {}),
        sampling: { sampled, ...(sampled ? {} : { rule: `rate:${rate}` }) }
      };
      if (!sampled) return;
      await enforcedSink.write(record);
    },
    child: (more) => mk({ ...ctx, ...more, ...(more.correlationIds ? { correlationIds: { ...ctx.correlationIds, ...more.correlationIds } } : {}) })
  });

  return mk(base);
}
