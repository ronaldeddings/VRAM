import { describe, expect, test } from "bun:test";
import path from "node:path";
import fs from "node:fs/promises";

import { createMonotonicIdSource } from "../src/core/runtime/ids.js";
import { TestClock } from "../src/core/runtime/clock.js";
import { ToolRegistry, ToolRunner, createInMemoryAttachmentStore, searchGrepTool, patchApplyTool } from "../src/core/tools/index.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";

describe("Phase 8: tool execution layer", () => {
  test("ToolRunner validates schemas and emits a close event", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(1000);
    const idSource = createMonotonicIdSource();

    const registry = new ToolRegistry();
    registry.registerBuiltin({
      id: "builtin/test.echo",
      name: "test.echo",
      inputSchema: {
        schemaName: "test.echo.in",
        schemaVersion: 1,
        parse: (v) => (typeof v === "string" ? { ok: true, value: v } : { ok: false, message: "expected string" })
      },
      outputSchema: {
        schemaName: "test.echo.out",
        schemaVersion: 1,
        parse: (v) =>
          typeof v === "object" && v !== null && "echo" in (v as any)
            ? { ok: true, value: v as any }
            : { ok: false, message: "expected { echo }" }
      },
      run: async (ctx, input) => {
        await ctx.emit({ kind: "text", payload: input, sensitivity: "internal" });
        return { data: { echo: input }, display: { title: "echo" } };
      }
    });

    const runner = new ToolRunner(registry, { host, idSource, clock, maxBufferedEvents: 64 });
    const res = await runner.run({ toolName: "test.echo", input: "hi" });
    expect(res.kind).toBe("completed");

    const events: string[] = [];
    for await (const e of res.stream) {
      if (e.kind === "text") events.push(String(e.payload));
      if (e.kind === "close") events.push("close");
    }
    expect(events).toContain("hi");
    expect(events[events.length - 1]).toBe("close");
  });

  test("search.grep golden output matches fixtures (normalized ordering)", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(1);
    const idSource = createMonotonicIdSource();

    const registry = new ToolRegistry();
    registry.registerBuiltin(searchGrepTool);
    const runner = new ToolRunner(registry, { host, idSource, clock, maxBufferedEvents: 256 });

    const fixtureRoot = path.join(process.cwd(), "tests", "fixtures", "phase8-grep-repo");
    const expected = JSON.parse(await fs.readFile(path.join(process.cwd(), "tests", "fixtures", "phase8-grep-expected.json"), "utf8")) as any;

    const res = await runner.run({
      toolName: "search.grep",
      input: { root: fixtureRoot, query: expected.query, ignoreCase: expected.ignoreCase, regex: false, maxMatches: 100 }
    });
    expect(res.kind).toBe("completed");
    expect(res.result.data.matches).toEqual(expected.matches);
  });

  test("patch.apply previewOnly does not write; apply writes and produces a diff attachment", async () => {
    const host = createNodeHostCapabilities({ enableKeychain: false });
    const clock = new TestClock(1);
    const idSource = createMonotonicIdSource();

    const registry = new ToolRegistry();
    registry.registerBuiltin(patchApplyTool);
    const runner = new ToolRunner(registry, { host, idSource, clock, maxBufferedEvents: 256 });

    const tmpDir = path.join(process.cwd(), "tests", ".tmp-phase8-patch");
    const tmpFile = path.join(tmpDir, "file.txt");
    const tmpFileCrLf = path.join(tmpDir, "crlf-unicode.txt");
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(tmpFile, "one\ntwo\nthree\n", "utf8");
    await fs.writeFile(tmpFileCrLf, "uno\r\ndos\r\ncafé\r\n", "utf8");

    const editSet = {
      kind: "edit_set",
      schemaVersion: 1,
      previewOnly: true,
      files: [
        {
          path: "tests/.tmp-phase8-patch/file.txt",
          newline: "preserve",
          hunks: [{ startLine: 2, deleteLines: ["two"], insertLines: ["TWO"] }]
        },
        {
          path: "tests/.tmp-phase8-patch/crlf-unicode.txt",
          newline: "preserve",
          hunks: [{ startLine: 3, deleteLines: ["café"], insertLines: ["caffè"] }]
        }
      ]
    };

    const attachments = createInMemoryAttachmentStore({ idSource, host, defaultSensitivity: "internal" });

    const preview = await runner.run({ toolName: "patch.apply", input: editSet, attachments });
    expect(preview.kind).toBe("completed");
    const afterPreview = await fs.readFile(tmpFile, "utf8");
    expect(afterPreview).toBe("one\ntwo\nthree\n");
    expect(preview.result.data.previewOnly).toBe(true);
    expect(preview.result.data.previewAttachment).toBeTruthy();

    const apply = await runner.run({ toolName: "patch.apply", input: { ...editSet, previewOnly: false }, attachments });
    expect(apply.kind).toBe("completed");
    const afterApply = await fs.readFile(tmpFile, "utf8");
    expect(afterApply).toBe("one\nTWO\nthree\n");
    const afterApplyCrLf = await fs.readFile(tmpFileCrLf, "utf8");
    expect(afterApplyCrLf).toBe("uno\r\ndos\r\ncaffè\r\n");

    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  test("engine core tool layer does not use subprocess APIs", async () => {
    const root = path.join(process.cwd(), "src", "core", "tools");
    const files: string[] = [];
    const walk = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) await walk(p);
        else if (e.isFile() && p.endsWith(".ts")) files.push(p);
      }
    };
    await walk(root);

    const banned = ["child_process", "node:child_process", "Bun.spawn", "Bun.spawnSync", "spawn-rx", "execFile("];
    for (const f of files) {
      const content = await fs.readFile(f, "utf8");
      for (const token of banned) {
        expect(content.includes(token), `Found banned token ${token} in ${path.relative(process.cwd(), f)}`).toBe(false);
      }
    }
  });
});
