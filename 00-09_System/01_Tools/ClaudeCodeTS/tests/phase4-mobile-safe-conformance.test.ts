import { describe, expect, test } from "bun:test";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { createSeededRandom } from "../src/core/runtime/seededRandom.js";
import { buildCapabilityComplianceReport } from "../src/core/capabilities/compliance.js";
import { createCapabilityView } from "../src/core/capabilities/view.js";
import { createStateStore } from "../src/core/state/store.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import { availableCapability, unavailableCapability, type HostCapabilities, type StorageNamespace } from "../src/core/types/host.js";

function versionFor(value: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `v_${(h >>> 0).toString(16)}`;
}

function nsKey(ns: StorageNamespace, key: string): string {
  return `${ns.scope}:${ns.workspaceId ?? ""}:${ns.sessionId ?? ""}:${key}`;
}

describe("Phase 4: minimal mobile-safe conformance", () => {
  test("boots with no filesystem/process/local endpoints and core subsystems still function", async () => {
    const testClock = new TestClock(0);
    const seeded = createSeededRandom("mobile-seed");

    const storageMap = new Map<string, { value: string; version: string }>();
    const secretsMap = new Map<string, string>();

    const host: HostCapabilities = {
      clock: availableCapability({ nowMs: () => testClock.nowMs(), nowWallMs: () => 0 }),
      random: availableCapability({ randomUUID: () => seeded.randomUUID() }),
      crypto: unavailableCapability({ kind: "not-provided" }),
      secrets: availableCapability({
        getSecret: async (name) => secretsMap.get(name) ?? null,
        setSecret: async (name, value) => void secretsMap.set(name, value),
        deleteSecret: async (name) => void secretsMap.delete(name),
        invalidateSecret: async (name) => void secretsMap.delete(name)
      }),
      storage: availableCapability({
        get: async (ns, key) => storageMap.get(nsKey(ns, key)) ?? null,
        set: async (ns, key, value, options) => {
          const k = nsKey(ns, key);
          const existing = storageMap.get(k) ?? null;
          const expected = options?.expectedVersion ?? undefined;
          if (expected !== undefined) {
            if (expected === null) {
              if (existing !== null) throw new Error("conflict");
            } else if (existing?.version !== expected) {
              throw new Error("conflict");
            }
          }
          const version = versionFor(value);
          storageMap.set(k, { value, version });
          return { version };
        },
        delete: async (ns, key) => {
          storageMap.delete(nsKey(ns, key));
        }
      }),
      filesystem: unavailableCapability({ kind: "not-provided" }),
      network: availableCapability({ fetch }),
      lifecycle: availableCapability({ subscribe: () => () => {}, getConnectionState: () => "unknown" }),
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

    const report = buildCapabilityComplianceReport(host);
    expect(report.missingRequired).toEqual([]);

    const view = createCapabilityView(host, ["clock", "random", "storage", "secrets", "network", "lifecycle"]);
    expect(view.filesystem.kind).toBe("unavailable");
    expect(view.process.kind).toBe("unavailable");

    const store = createStateStore({ idSource: createMonotonicIdSource(), clock: testClock });
    await store.dispatchCommand({ type: "cmd/create-session", activate: true });
    expect(store.getState().persisted.activeSessionId).toBeTruthy();

    const kernel = new RuntimeKernel({ clock: testClock, idSource: createMonotonicIdSource() });
    const scope = kernel.createScope({ kind: "session", label: "mobile" });
    const handle = scope.spawn(async (ctx) => {
      await ctx.yield();
      return "ok";
    });
    await kernel.getScheduler().runUntilIdle();
    expect((await handle.done).kind).toBe("success");
  });
});
