import type { HostCrypto } from "../types/host.js";
import type { CoreStreamEvent } from "../types/runtime.js";

export type CoreStreamSummary = {
  eventCount: number;
  chunkCount: number;
  totalBytes: number;
  sha256Hex: string;
};

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

function chunkToBytes(event: Extract<CoreStreamEvent, { kind: "chunk" }>): Uint8Array {
  if (event.encoding === "binary") return event.data as Uint8Array;
  if (typeof event.data === "string") return new TextEncoder().encode(event.data);
  return event.data as Uint8Array;
}

export async function computeCoreStreamSummaryFromEvents(events: CoreStreamEvent[], crypto: HostCrypto): Promise<CoreStreamSummary> {
  let chunkCount = 0;
  let totalBytes = 0;
  const bytes: Uint8Array[] = [];

  for (const evt of events) {
    if (evt.kind !== "chunk") continue;
    const b = chunkToBytes(evt);
    chunkCount += 1;
    totalBytes += b.length;
    bytes.push(b);
  }

  const digest = await crypto.digest("SHA-256", concatBytes(bytes));
  return { eventCount: events.length, chunkCount, totalBytes, sha256Hex: bytesToHex(digest) };
}

export async function computeCoreStreamSummary(stream: AsyncIterable<CoreStreamEvent>, crypto: HostCrypto): Promise<CoreStreamSummary> {
  const events: CoreStreamEvent[] = [];
  for await (const evt of stream) events.push(evt);
  return await computeCoreStreamSummaryFromEvents(events, crypto);
}

