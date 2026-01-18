import { describe, expect, test } from "bun:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { TestClock } from "../src/core/runtime/clock.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { createSeededRandom } from "../src/core/runtime/seededRandom.js";
import { computeCoreStreamSummaryFromEvents } from "../src/core/runtime/streamSummary.js";
import { RuntimeKernel } from "../src/core/runtime/kernel.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { requireCapability } from "../src/core/types/host.js";

describe("Phase 3: determinism helpers", () => {
  test("seeded random produces stable UUIDs for a given seed", () => {
    const a = createSeededRandom("seed");
    const b = createSeededRandom("seed");
    expect(a.randomUUID()).toBe(b.randomUUID());
  });

  test("kernel snapshot is stable and sorted", async () => {
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });
    const kernel = new RuntimeKernel({ clock, idSource });
    kernel.defineLimiter("net", 2);
    kernel.createStream("debug");

    const scope = kernel.createScope({ kind: "session", label: "snap" });
    scope.spawn(async (ctx) => {
      await ctx.yield();
      return ctx.taskId;
    });
    scope.spawn(async (ctx) => ctx.taskId, { priority: "high" });

    await kernel.getScheduler().runUntilIdle();
    const snap = kernel.snapshot();
    const taskIds = snap.tasks.map((t) => t.id);
    expect(taskIds).toEqual([...taskIds].sort((x, y) => x.localeCompare(y)));
  });

  test("core stream summary uses hash + counters (no raw transcript storage)", async () => {
    const configDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-code-rewrite-config-"));
    const host = createNodeHostCapabilities({ configDir });
    const crypto = requireCapability(host, "crypto");
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });
    const kernel = new RuntimeKernel({ clock, idSource });

    const stream = kernel.createStream("debug");
    await stream.pushChunk({ encoding: "utf-8", data: "hello" });
    await stream.pushChunk({ encoding: "utf-8", data: "world" });
    stream.close({ reason: "completed" });

    const events = [];
    for await (const evt of stream) events.push(evt);

    const summary = await computeCoreStreamSummaryFromEvents(events, crypto);
    expect(summary.chunkCount).toBe(2);
    expect(summary.totalBytes).toBeGreaterThan(0);
    expect(summary.sha256Hex.length).toBe(64);
    await fs.rm(configDir, { recursive: true, force: true });
  });

  test("node filesystem adapter returns deterministic directory listings", async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "claude-code-rewrite-listdir-"));
    try {
      await fs.writeFile(path.join(tmp, "b.txt"), "b");
      await fs.writeFile(path.join(tmp, "a.txt"), "a");

      const configDir = await fs.mkdtemp(path.join(os.tmpdir(), "claude-code-rewrite-config-"));
      const host = createNodeHostCapabilities({ configDir });
      const fsCap = requireCapability(host, "filesystem");
      const entries = await fsCap.listDir(tmp);
      const names = entries.map((e) => e.name);
      expect(names).toEqual([...names].sort((x, y) => x.localeCompare(y)));
      await fs.rm(configDir, { recursive: true, force: true });
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});
