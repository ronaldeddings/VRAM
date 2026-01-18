import { describe, expect, test } from "bun:test";
import { ToolRegistry, ToolRunner } from "../src/core/tools/index.js";
import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { requireCapability } from "../src/core/types/host.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";

describe("Phase 14: tool conformance tests (capabilities, cancellation, schema)", () => {
  test("tool host view policy-denies non-granted capabilities (typed denial surface)", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });

    const registry = new ToolRegistry();
    registry.registerBuiltin({
      id: "builtin/test.cap-gate",
      name: "test.cap-gate",
      inputSchema: { schemaName: "in", schemaVersion: 1, parse: () => ({ ok: true, value: null }) },
      outputSchema: {
        schemaName: "out",
        schemaVersion: 1,
        parse: (v) =>
          typeof v === "object" && v !== null && "filesystemKind" in (v as any) ? { ok: true, value: v as any } : { ok: false, message: "expected kind" }
      },
      run: async (ctx) => {
        const fs = ctx.host.filesystem;
        let threw = false;
        try {
          requireCapability(ctx.host, "filesystem");
        } catch {
          threw = true;
        }
        return { data: { filesystemKind: fs.kind, reasonKind: fs.kind === "unavailable" ? fs.reason.kind : null, threw } };
      }
    });

    const runner = new ToolRunner(registry, { host, idSource, clock });
    const res = await runner.run({ toolName: "test.cap-gate", input: null });
    expect(res.kind).toBe("completed");
    if (res.kind !== "completed") return;
    expect(res.result.data.filesystemKind).toBe("unavailable");
    expect(res.result.data.reasonKind).toBe("policy-denied");
    expect(res.result.data.threw).toBe(true);
  });

  test("cancellation terminates streams with a cancelled outcome", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });

    const registry = new ToolRegistry();
    registry.registerBuiltin({
      id: "builtin/test.cancel",
      name: "test.cancel",
      inputSchema: { schemaName: "in", schemaVersion: 1, parse: () => ({ ok: true, value: null }) },
      outputSchema: { schemaName: "out", schemaVersion: 1, parse: () => ({ ok: true, value: null }) },
      run: async (ctx) => {
        await ctx.emit({ kind: "text", payload: "started", sensitivity: "internal" });
        await new Promise<void>((resolve, reject) => {
          if (!ctx.signal) return resolve();
          if (ctx.signal.aborted) return reject(ctx.signal.reason ?? new Error("aborted"));
          ctx.signal.addEventListener("abort", () => reject(ctx.signal?.reason ?? new Error("aborted")), { once: true });
        });
        return { data: null };
      }
    });

    const runner = new ToolRunner(registry, { host, idSource, clock, maxBufferedEvents: 32 });
    const ctrl = new AbortController();
    const pending = runner.run({ toolName: "test.cancel", input: null, signal: ctrl.signal });
    queueMicrotask(() => ctrl.abort(new Error("cancelled")));
    const res = await pending;

    expect(res.kind).toBe("cancelled");
    const events: string[] = [];
    for await (const evt of res.stream) events.push(evt.kind);
    expect(events.includes("text")).toBe(true);
    expect(events[events.length - 1]).toBe("close");
  });

  test("invalid output is surfaced as a typed ToolError", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(0);
    const idSource = createMonotonicIdSource({ startAt: 0 });

    const registry = new ToolRegistry();
    registry.registerBuiltin({
      id: "builtin/test.bad-out",
      name: "test.bad-out",
      inputSchema: { schemaName: "in", schemaVersion: 1, parse: () => ({ ok: true, value: null }) },
      outputSchema: { schemaName: "out", schemaVersion: 1, parse: () => ({ ok: false, message: "nope" }) },
      run: async () => ({ data: { not: "valid" } })
    });

    const runner = new ToolRunner(registry, { host, idSource, clock });
    const res = await runner.run({ toolName: "test.bad-out", input: null });
    expect(res.kind).toBe("failed");
    if (res.kind !== "failed") return;
    expect(res.error.code).toBe("invalid_output");
  });
});

