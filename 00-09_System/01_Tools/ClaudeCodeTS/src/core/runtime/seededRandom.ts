import type { UuidLike } from "./ids.js";

function fnv1a32(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

function formatUuidV4(bytes: Uint8Array): string {
  const b = new Uint8Array(bytes);
  if (b.length !== 16) throw new Error(`uuid expects 16 bytes, got ${b.length}`);
  b[6] = ((b[6] ?? 0) & 0x0f) | 0x40;
  b[8] = ((b[8] ?? 0) & 0x3f) | 0x80;
  const h = bytesToHex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export type SeededRandom = {
  nextUint32: () => number;
  nextBytes: (size: number) => Uint8Array;
  randomUUID: () => string;
};

export function createSeededRandom(seed: string): SeededRandom {
  const next = mulberry32(fnv1a32(seed));
  return {
    nextUint32: () => Math.floor(next() * 2 ** 32) >>> 0,
    nextBytes: (size) => {
      const out = new Uint8Array(size);
      for (let i = 0; i < size; i++) out[i] = Math.floor(next() * 256) & 0xff;
      return out;
    },
    randomUUID: () => formatUuidV4(new Uint8Array(Array.from({ length: 16 }, () => Math.floor(next() * 256) & 0xff)))
  };
}

export function createSeededUuidLike(seed: string): UuidLike {
  const r = createSeededRandom(seed);
  return { randomUUID: r.randomUUID };
}
