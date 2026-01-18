import { describe, expect, test } from "bun:test";
import fs from "node:fs/promises";
import path from "node:path";

import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { ToolRegistry, ToolRunner } from "../src/core/tools/index.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import {
  HookEngine,
  applyHookEffects,
  createToolPipelineHooks,
  loadPluginHooks,
  normalizeHooksConfig,
  normalizeLegacyAsyncTimeoutMs,
  parseLegacyAsyncHookInitialStdout
} from "../src/core/hooks/index.js";

describe("Phase 9: hooks system redesign", () => {
  test("normalizeHooksConfig is deterministic and compiles matchers", () => {
    const input = {
      PreToolUse: [
        { matcher: "a|b|c", hooks: [{ type: "workflow", actions: [{ kind: "AppendTranscriptContext", text: "x" }] }] },
        { matcher: "*", hooks: [{ type: "workflow", actions: [{ kind: "AppendTranscriptContext", text: "y" }] }] }
      ]
    };
    const a = normalizeHooksConfig(input, { source: "settings" });
    const b = normalizeHooksConfig(input, { source: "settings" });
    expect(a.canonical).toBe(b.canonical);
    expect(a.errors.length).toBe(0);
    expect(a.config.PreToolUse?.length).toBe(2);
    expect(a.config.PreToolUse?.[0]?.matcherCompiled.kind).toBe("match_all");
  });

  test("normalizeHooksConfig reports invalid regex with source attribution", () => {
    const input = {
      PreToolUse: [{ matcher: "([", hooks: [{ type: "workflow", actions: [{ kind: "AppendTranscriptContext", text: "x" }] }] }]
    };
    const res = normalizeHooksConfig(input, { source: "plugin" });
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.errors[0]?.source).toBe("plugin");
    expect(res.config.PreToolUse?.[0]?.matcherCompiled.kind).toBe("invalid");
  });

  test("ToolRunner integrates PreToolUse/PostToolUse via createToolPipelineHooks", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(1);
    const idSource = createMonotonicIdSource();

    const registry = new ToolRegistry();
    registry.registerBuiltin({
      id: "builtin/test.sum",
      name: "test.sum",
      inputSchema: {
        schemaName: "test.sum.in",
        schemaVersion: 1,
        parse: (v) =>
          typeof v === "object" && v !== null && typeof (v as any).a === "number" && typeof (v as any).b === "number"
            ? { ok: true, value: v as any }
            : { ok: false, message: "expected {a:number,b:number}" }
      },
      outputSchema: {
        schemaName: "test.sum.out",
        schemaVersion: 1,
        parse: (v) => (typeof v === "object" && v !== null && "sum" in (v as any) ? { ok: true, value: v as any } : { ok: false, message: "expected {sum}" })
      },
      run: async (_ctx, input) => {
        return { data: { sum: input.a + input.b } };
      }
    });

    const hooksInput = {
      PreToolUse: [
        {
          matcher: "test.sum",
          hooks: [{ type: "workflow", actions: [{ kind: "UpdateToolInput", mode: "merge", value: { b: 40 } }] }]
        }
      ],
      PostToolUse: [
        {
          matcher: "test.sum",
          hooks: [{ type: "workflow", actions: [{ kind: "UpdateToolOutput", mode: "merge_data", value: { note: "ok" } }] }]
        }
      ]
    };
    const normalized = normalizeHooksConfig(hooksInput, { source: "settings" });
    expect(normalized.errors.length).toBe(0);

    const pipelineHooks = createToolPipelineHooks({ host, clock, idSource, hooks: normalized.config, workspaceTrusted: true });
    const runner = new ToolRunner(registry, { host, idSource, clock, hooks: pipelineHooks });

    const res = await runner.run({ toolName: "test.sum", input: { a: 2, b: 3 } });
    expect(res.kind).toBe("completed");
    expect(res.result.data.sum).toBe(42);
    expect((res.result.data as any).note).toBe("ok");
  });

  test("ToolRunner calls afterToolFailure on tool error", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(1);
    const idSource = createMonotonicIdSource();

    const registry = new ToolRegistry();
    registry.registerBuiltin({
      id: "builtin/test.fail",
      name: "test.fail",
      inputSchema: { schemaName: "test.fail.in", schemaVersion: 1, parse: (v) => ({ ok: true, value: v }) },
      outputSchema: { schemaName: "test.fail.out", schemaVersion: 1, parse: (v) => ({ ok: true, value: v }) },
      run: async () => {
        throw new Error("boom");
      }
    });

    let called = false;
    const runner = new ToolRunner(registry, {
      host,
      idSource,
      clock,
      hooks: {
        afterToolFailure: async () => {
          called = true;
          return {};
        }
      }
    });

    const res = await runner.run({ toolName: "test.fail", input: {} });
    expect(res.kind).toBe("failed");
    expect(called).toBe(true);
  });

  test("applyHookEffects rejects conflicting merge updates", () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    expect(() =>
      applyHookEffects(
        [
          { kind: "UpdateToolInput", mode: "merge", value: { a: 1 }, hookId: "h1", source: "settings" },
          { kind: "UpdateToolInput", mode: "merge", value: { a: 2 }, hookId: "h2", source: "settings" }
        ],
        { host, eventName: "PreToolUse", toolInput: { a: 0 } }
      )
    ).toThrow();
  });

  test("applyHookEffects dedupes transcript appends and permission updates; denies unsupported IO effects", () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const applied = applyHookEffects(
      [
        { kind: "AppendTranscriptContext", text: "hello", dedupeKey: "k1", hookId: "h1", source: "settings" },
        { kind: "AppendTranscriptContext", text: "hello", dedupeKey: "k1", hookId: "h2", source: "settings" },
        {
          kind: "ProposePermissionUpdates",
          updates: [{ type: "setMode", mode: "dontAsk", destination: "session" }],
          hookId: "h1",
          source: "settings"
        },
        {
          kind: "ProposePermissionUpdates",
          updates: [{ type: "setMode", mode: "dontAsk", destination: "session" }],
          hookId: "h2",
          source: "settings"
        },
        { kind: "EmitNotification", title: "t", message: "m", hookId: "h1", source: "settings" },
        { kind: "StartBackgroundTask", label: "bg", hookId: "h1", source: "settings" }
      ],
      { host, eventName: "PreToolUse", toolInput: {} }
    );
    expect(applied.transcriptAppends.length).toBe(1);
    expect(applied.permissionUpdates.length).toBe(1);
    expect(applied.notifications.length).toBe(0);
    expect(applied.backgroundTasks.length).toBe(0);
    expect(applied.audit.some((a) => a.kind === "effect_denied" && a.effect === "EmitNotification")).toBe(true);
    expect(applied.audit.some((a) => a.kind === "effect_denied" && a.effect === "StartBackgroundTask")).toBe(true);
  });

  test("applyHookEffects applies first BlockContinuation and keeps status line/file suggestions first-win", () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const applied = applyHookEffects(
      [
        { kind: "SetStatusLine", lines: ["a"], hookId: "h1", source: "settings" },
        { kind: "SetStatusLine", lines: ["b"], hookId: "h2", source: "settings" },
        { kind: "SuggestFiles", files: ["x.ts"], hookId: "h1", source: "settings" },
        { kind: "SuggestFiles", files: ["y.ts"], hookId: "h2", source: "settings" },
        { kind: "BlockContinuation", reasonCode: "r1", message: "stop", hookId: "h1", source: "settings" },
        { kind: "BlockContinuation", reasonCode: "r2", message: "stop2", hookId: "h2", source: "settings" }
      ],
      { host, eventName: "PreToolUse", toolInput: {} }
    );
    expect(applied.blocked?.reasonCode).toBe("r1");
    expect(applied.statusLine?.lines).toEqual(["a"]);
    expect(applied.fileSuggestions?.files).toEqual(["x.ts"]);
  });

  test("HookEngine enforces allowNestedToolRuns for RunTool", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(1);
    const idSource = createMonotonicIdSource();

    const hooksInput = {
      PreToolUse: [
        {
          matcher: "*",
          hooks: [{ type: "workflow", actions: [{ kind: "RunTool", toolName: "x", input: {}, withHooks: false }] }]
        }
      ]
    };
    const normalized = normalizeHooksConfig(hooksInput, { source: "settings" });
    const engine = new HookEngine({ host, clock, idSource, hooks: normalized.config });
    const res = await engine.runEventBatch({
      host,
      eventName: "PreToolUse",
      tool: { name: "test.sum", input: { a: 1, b: 2 } },
      workspaceTrusted: true,
      callTool: async () => ({ data: { ok: true } })
    });
    expect(res.outcomes.some((o) => o.status === "non_blocking_error")).toBe(true);
  });

  test("legacy async hook stdout mapping detects async:true and clamps timeout", () => {
    const parsed = parseLegacyAsyncHookInitialStdout('{"async": true, "asyncTimeout": 1}');
    expect(parsed.kind).toBe("json");
    if (parsed.kind !== "json") return;
    const normalized = normalizeLegacyAsyncTimeoutMs(parsed.value, { defaultTimeoutMs: 60_000, minTimeoutMs: 5_000, maxTimeoutMs: 120_000 });
    expect(normalized.timeoutMs).toBe(5_000);
  });

  test("legacy async hook parser matches legacy heuristics (parse only when stdout is JSON-shaped)", () => {
    expect(parseLegacyAsyncHookInitialStdout("hello").kind).toBe("plain");
    expect(parseLegacyAsyncHookInitialStdout("{ not json }").kind).toBe("plain");
    expect(parseLegacyAsyncHookInitialStdout('{ "async": false }').kind).toBe("plain");
  });

  test("loadPluginHooks reads plugins/*/hooks/hooks.json and merges", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const tmp = path.join(process.cwd(), "tests", ".tmp-phase9-plugins");
    await fs.rm(tmp, { recursive: true, force: true });
    await fs.mkdir(path.join(tmp, "plugins", "p1", "hooks"), { recursive: true });
    await fs.mkdir(path.join(tmp, "plugins", "p2", "hooks"), { recursive: true });
    await fs.writeFile(
      path.join(tmp, "plugins", "p1", "hooks", "hooks.json"),
      JSON.stringify({ PreToolUse: [{ matcher: "a", hooks: [{ type: "workflow", actions: [{ kind: "AppendTranscriptContext", text: "x" }] }] }] }),
      "utf8"
    );
    await fs.writeFile(
      path.join(tmp, "plugins", "p2", "hooks", "hooks.json"),
      JSON.stringify({ PreToolUse: [{ matcher: "b", hooks: [{ type: "workflow", actions: [{ kind: "AppendTranscriptContext", text: "y" }] }] }] }),
      "utf8"
    );

    const loaded = await loadPluginHooks({ host, configDir: tmp });
    expect(loaded.errors.length).toBe(0);
    expect(loaded.hooks.PreToolUse?.length).toBe(2);
  });
});
