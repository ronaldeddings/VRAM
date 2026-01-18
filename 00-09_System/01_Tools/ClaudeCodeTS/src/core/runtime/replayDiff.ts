import type { EngineEventEnvelope } from "../types/events.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import type { ReplayDiff } from "./replay.js";

type DiffOptions = {
  ignoreWallClock?: boolean;
  ignoreEventIds?: boolean;
  ignoreMonoClock?: boolean;
};

function normalizeEnvelope(e: EngineEventEnvelope, options: DiffOptions): unknown {
  return {
    kind: e.kind,
    schemaVersion: e.schemaVersion,
    ...(options.ignoreEventIds ? {} : { eventId: e.eventId }),
    ...(e.sessionId ? { sessionId: e.sessionId } : {}),
    ...(e.workspaceId ? { workspaceId: e.workspaceId } : {}),
    channel: e.channel,
    severity: e.severity,
    seq: e.seq,
    ...(options.ignoreMonoClock ? {} : { tsMonoMs: e.tsMonoMs }),
    ...(options.ignoreWallClock ? {} : e.tsWallMs !== undefined ? { tsWallMs: e.tsWallMs } : {}),
    ...(e.correlationIds ? { correlationIds: e.correlationIds } : {}),
    sensitivity: e.sensitivity,
    payload: e.payload
  };
}

function stableJson(envelopes: EngineEventEnvelope[], options: DiffOptions): string {
  return canonicalJsonStringify(envelopes.map((e) => normalizeEnvelope(e, options)));
}

export function classifyReplayEventDiff(expected: EngineEventEnvelope[], actual: EngineEventEnvelope[]): ReplayDiff {
  const strictOptions: DiffOptions = { ignoreEventIds: false, ignoreWallClock: false, ignoreMonoClock: false };
  const strictA = stableJson(expected, strictOptions);
  const strictB = stableJson(actual, strictOptions);
  if (strictA === strictB) return { classification: "exact", summary: "event streams match exactly" };

  const ignoreClocksA = stableJson(expected, { ignoreEventIds: true, ignoreWallClock: true, ignoreMonoClock: true });
  const ignoreClocksB = stableJson(actual, { ignoreEventIds: true, ignoreWallClock: true, ignoreMonoClock: true });
  if (ignoreClocksA === ignoreClocksB) {
    return { classification: "allowed_nondeterminism", summary: "event streams match when ignoring IDs and clocks" };
  }

  const stripUiA = stableJson(expected.filter((e) => e.channel !== "ui"), { ignoreEventIds: true, ignoreWallClock: true, ignoreMonoClock: true });
  const stripUiB = stableJson(actual.filter((e) => e.channel !== "ui"), { ignoreEventIds: true, ignoreWallClock: true, ignoreMonoClock: true });
  if (stripUiA === stripUiB) {
    return { classification: "benign_ui", summary: "non-UI event streams match; UI differences classified as benign" };
  }

  return { classification: "regression", summary: "event streams differ beyond allowed nondeterminism" };
}
