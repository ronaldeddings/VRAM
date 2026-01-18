import { describe, expect, test } from "bun:test";
import { canonicalJsonStringify } from "../src/core/types/canonicalJson.js";
import { smokeCheckHostCapabilities } from "../src/platform/smoke.js";
import { unavailableCapability } from "../src/core/types/host.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { NODE_REQUIRED_CAPABILITIES } from "../src/platform/node/index.js";
import { createReactNativeHostCapabilities, RN_MINIMAL_REQUIRED_CAPABILITIES } from "../src/platform/rn/index.js";
import { createWebHostCapabilities, WEB_MINIMAL_REQUIRED_CAPABILITIES } from "../src/platform/web/index.js";

describe("Phase 2: architecture/boundaries", () => {
  test("import boundary script passes", () => {
    const proc = Bun.spawnSync(["node", "scripts/check-import-boundaries.mjs"], { stdout: "pipe", stderr: "pipe" });
    expect(proc.exitCode).toBe(0);
  });

  test("host capability smoke check reports missing required", () => {
    const host = {
      clock: unavailableCapability({ kind: "not-provided" }),
      random: unavailableCapability({ kind: "not-provided" }),
      crypto: unavailableCapability({ kind: "not-provided" }),
      secrets: unavailableCapability({ kind: "not-provided" }),
      storage: unavailableCapability({ kind: "not-provided" }),
      filesystem: unavailableCapability({ kind: "not-provided" }),
      network: unavailableCapability({ kind: "not-provided" }),
      lifecycle: unavailableCapability({ kind: "not-provided" }),
      telemetry: unavailableCapability({ kind: "not-provided" }),
      background: unavailableCapability({ kind: "not-provided" }),
      fileTransfer: unavailableCapability({ kind: "not-provided" }),
      shell: unavailableCapability({ kind: "not-provided" }),
      localEndpoint: unavailableCapability({ kind: "not-provided" }),
      ipc: unavailableCapability({ kind: "not-provided" }),
      process: unavailableCapability({ kind: "not-provided" }),
      clipboard: unavailableCapability({ kind: "not-provided" }),
      notifications: unavailableCapability({ kind: "not-provided" }),
      haptics: unavailableCapability({ kind: "not-provided" })
    };

    expect(smokeCheckHostCapabilities(host, ["storage", "network"]).missing).toEqual(["storage", "network"]);
  });

  test("host capability smoke check passes for provided adapters (node/rn/web)", () => {
    const nodeHost = createNodeHostCapabilities();
    expect(smokeCheckHostCapabilities(nodeHost, NODE_REQUIRED_CAPABILITIES).missing).toEqual([]);

    const rnHost = createReactNativeHostCapabilities();
    expect(smokeCheckHostCapabilities(rnHost, RN_MINIMAL_REQUIRED_CAPABILITIES).missing).toEqual([]);

    const makeStorage = () => {
      const map = new Map<string, string>();
      return {
        getItem: (k: string) => map.get(k) ?? null,
        setItem: (k: string, v: string) => void map.set(k, v),
        removeItem: (k: string) => void map.delete(k)
      };
    };

    const prevLocalStorage = (globalThis as unknown as { localStorage?: unknown }).localStorage;
    const prevSessionStorage = (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;
    (globalThis as unknown as { localStorage?: unknown }).localStorage = makeStorage();
    (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage = makeStorage();
    try {
      const webHost = createWebHostCapabilities();
      expect(smokeCheckHostCapabilities(webHost, WEB_MINIMAL_REQUIRED_CAPABILITIES).missing).toEqual([]);
    } finally {
      (globalThis as unknown as { localStorage?: unknown }).localStorage = prevLocalStorage;
      (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage = prevSessionStorage;
    }
  });

  test("canonical JSON stringification is stable (key order)", () => {
    const input = { b: 1, a: { d: 4, c: 3 } };
    expect(canonicalJsonStringify(input)).toBe('{"a":{"c":3,"d":4},"b":1}');
  });
});
