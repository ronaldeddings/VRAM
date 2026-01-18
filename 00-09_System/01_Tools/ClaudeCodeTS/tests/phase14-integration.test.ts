import { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { createEngine } from "../src/core/engine/createEngine.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { createWebHostCapabilities } from "../src/platform/web/index.js";
import { createReactNativeHostCapabilities } from "../src/platform/rn/index.js";

function makeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    }
  };
}

async function collectUiEvents(engine: ReturnType<typeof createEngine>, steps: () => Promise<void>): Promise<string[]> {
  const types: string[] = [];
  const unsub = engine.subscribe((evt) => {
    if (evt.channel !== "ui") return;
    const t = (evt.payload as any)?.type;
    if (typeof t === "string") types.push(t);
  });
  try {
    await steps();
  } finally {
    unsub();
  }
  return types;
}

describe("Phase 14: integration tests (engine + host adapters)", () => {
  test("engine boots on node/web/RN-like hosts and emits ready/stopped", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });

    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "claude-code-ts-phase14-"));
    try {
      const nodeHost = createNodeHostCapabilities({ configDir: tmp, enableKeychain: false });
      const nodeEngine = createEngine({ host: nodeHost, clock, idSource });
      const nodeTypes = await collectUiEvents(nodeEngine, async () => {
        await nodeEngine.start();
        await nodeEngine.stop("done");
      });
      expect(nodeTypes).toContain("engine/ready");
      expect(nodeTypes).toContain("engine/stopped");

      const prevLocalStorage = (globalThis as any).localStorage;
      const prevSessionStorage = (globalThis as any).sessionStorage;
      (globalThis as any).localStorage = makeStorage();
      (globalThis as any).sessionStorage = makeStorage();
      try {
        const webHost = createWebHostCapabilities();
        const webEngine = createEngine({ host: webHost, clock, idSource });
        const webTypes = await collectUiEvents(webEngine, async () => {
          await webEngine.start();
          await webEngine.stop("done");
        });
        expect(webTypes).toContain("engine/ready");
        expect(webTypes).toContain("engine/stopped");
      } finally {
        (globalThis as any).localStorage = prevLocalStorage;
        (globalThis as any).sessionStorage = prevSessionStorage;
      }

      const rnHost = createReactNativeHostCapabilities();
      const rnEngine = createEngine({ host: rnHost, clock, idSource });
      const rnTypes = await collectUiEvents(rnEngine, async () => {
        await rnEngine.start();
        await rnEngine.stop("done");
      });
      expect(rnTypes).toContain("engine/ready");
      expect(rnTypes).toContain("engine/stopped");
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

