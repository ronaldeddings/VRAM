import type { JsonArray, JsonObject, JsonValue } from "./json.js";

export type CanonicalJsonStringifyOptions = {
  pretty?: boolean;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null) return false;
  if (typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function toCanonicalJsonValue(value: unknown, seen: Set<unknown>): JsonValue {
  if (value === null) return null;

  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Non-finite numbers are not JSON-serializable");
    return value;
  }
  if (typeof value === "bigint") throw new TypeError("bigint is not JSON-serializable");
  if (typeof value === "undefined") throw new TypeError("undefined is not JSON-serializable");
  if (typeof value === "function") throw new TypeError("function is not JSON-serializable");
  if (typeof value === "symbol") throw new TypeError("symbol is not JSON-serializable");

  if (value instanceof Date) throw new TypeError("Date is not JSON-serializable; use ISO strings explicitly");

  if (seen.has(value)) throw new TypeError("Circular references are not JSON-serializable");
  seen.add(value);

  try {
    if (Array.isArray(value)) {
      const out: JsonArray = value.map((v) => toCanonicalJsonValue(v, seen));
      return out;
    }

    if (isPlainObject(value)) {
      const entries = Object.entries(value).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      const out: JsonObject = {};
      for (const [k, v] of entries) out[k] = toCanonicalJsonValue(v, seen);
      return out;
    }

    throw new TypeError("Only plain objects/arrays are JSON-serializable for canonical encoding");
  } finally {
    seen.delete(value);
  }
}

export function canonicalJsonStringify(value: unknown, options: CanonicalJsonStringifyOptions = {}): string {
  const canonical = toCanonicalJsonValue(value, new Set());
  return JSON.stringify(canonical, null, options.pretty ? 2 : undefined);
}
