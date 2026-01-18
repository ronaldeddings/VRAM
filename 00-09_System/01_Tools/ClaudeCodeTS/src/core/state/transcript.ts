import type { HostCrypto } from "../types/host.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import { REDACTED, type Sensitive, type TranscriptEventV1, type TranscriptLogV1 } from "../types/state.js";

export type RedactionStats = {
  redactedNodes: number;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isSensitive(value: unknown): value is Sensitive<unknown> {
  return isPlainObject(value) && value["kind"] === "sensitive" && "value" in value;
}

function redactValue(value: unknown, stats: RedactionStats): unknown {
  if (isSensitive(value)) {
    stats.redactedNodes += 1;
    return REDACTED;
  }
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((v) => redactValue(v, stats));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = redactValue(v, stats);
    return out;
  }
  return value;
}

export function redactTranscriptEvent(event: TranscriptEventV1): { event: TranscriptEventV1; stats: RedactionStats } {
  const stats: RedactionStats = { redactedNodes: 0 };
  const redacted = redactValue(event, stats) as TranscriptEventV1;
  return { event: redacted, stats };
}

export function redactTranscriptLog(log: TranscriptLogV1): { log: TranscriptLogV1; stats: RedactionStats } {
  const stats: RedactionStats = { redactedNodes: 0 };
  const events = log.events.map((evt) => redactValue(evt, stats) as TranscriptEventV1);
  return { log: { ...log, events }, stats };
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

export async function computeTranscriptSummary(
  log: TranscriptLogV1,
  crypto: HostCrypto
): Promise<{ eventCount: number; sha256Hex: string; redactedNodes: number }> {
  const { log: redacted, stats } = redactTranscriptLog(log);
  const json = canonicalJsonStringify(redacted, { pretty: false });
  const data = new TextEncoder().encode(json);
  const digest = await crypto.digest("SHA-256", data);
  return { eventCount: redacted.events.length, sha256Hex: bytesToHex(digest), redactedNodes: stats.redactedNodes };
}

