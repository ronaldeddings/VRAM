import type { HostCrypto } from "../types/host.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

export async function sha256Hex(crypto: HostCrypto, bytes: Uint8Array): Promise<string> {
  const digest = await crypto.digest("SHA-256", bytes);
  return toHex(digest);
}

export async function sha256HexForString(crypto: HostCrypto, value: string): Promise<string> {
  const enc = new TextEncoder();
  return await sha256Hex(crypto, enc.encode(value));
}

export async function sha256HexForCanonicalJson(crypto: HostCrypto, value: unknown): Promise<string> {
  const canonical = canonicalJsonStringify(value);
  return await sha256HexForString(crypto, canonical);
}

