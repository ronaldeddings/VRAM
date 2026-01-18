import { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";

function runCli(args: string[], env?: Record<string, string | undefined>): { code: number; out: string } {
  const mergedEnv: Record<string, string> = { ...process.env } as Record<string, string>;
  for (const [k, v] of Object.entries(env ?? {})) {
    if (v === undefined) delete mergedEnv[k];
    else mergedEnv[k] = v;
  }
  const proc = Bun.spawnSync(["bun", "src/cli.ts", ...args], {
    env: mergedEnv,
    stdout: "pipe",
    stderr: "pipe"
  });
  const out = `${proc.stdout.toString()}\n${proc.stderr.toString()}`.trim();
  return { code: proc.exitCode, out };
}

async function runCliAsync(args: string[], env?: Record<string, string | undefined>): Promise<{ code: number; out: string }> {
  const mergedEnv: Record<string, string> = { ...process.env } as Record<string, string>;
  for (const [k, v] of Object.entries(env ?? {})) {
    if (v === undefined) delete mergedEnv[k];
    else mergedEnv[k] = v;
  }
  const proc = Bun.spawn(["bun", "src/cli.ts", ...args], {
    env: mergedEnv,
    stdout: "pipe",
    stderr: "pipe"
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited
  ]);
  const out = `${stdout}\n${stderr}`.trim();
  return { code, out };
}

describe("Phase 12: runnable CLI entrypoint (repo-level)", () => {
  test("--version fast path prints a version and exits 0", () => {
    const r = runCli(["--version"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("Claude Code TS rewrite");
  });

  test("--help prints usage and exits 0", () => {
    const r = runCli(["--help"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("Usage: claude-ts");
  });

  test("--print-frame boots engine and prints one frame", () => {
    const r = runCli(["--print-frame"]);
    expect(r.code).toBe(0);
    expect(r.out).toContain("screen:");
    expect(r.out).toContain("overlay:");
  });

  test("-p sends a prompt and prints model output (non-interactive)", async () => {
    const server = Bun.serve({
      port: 0,
      async fetch(req) {
        const url = new URL(req.url);
        if (req.method === "POST" && url.pathname === "/v1/messages") {
          const ua = req.headers.get("user-agent");
          const auth = req.headers.get("authorization");
          const beta = req.headers.get("anthropic-beta");
          const apiKey = req.headers.get("x-api-key");
          const xApp = req.headers.get("x-app");
          const dangerous = req.headers.get("anthropic-dangerous-direct-browser-access");
          if (apiKey) return new Response("unexpected x-api-key", { status: 400 });
          if (auth !== "Bearer test-session-token") return new Response("unauthorized", { status: 401 });
          if (!beta?.includes("oauth-2025-04-20")) return new Response("missing oauth beta", { status: 400 });
          if (!beta?.includes("interleaved-thinking-2025-05-14")) return new Response("missing interleaved beta", { status: 400 });
          if (ua !== "claude-cli/2.0.69 (external, sdk-cli)") return new Response("bad ua", { status: 400 });
          if (xApp !== "cli") return new Response("missing x-app", { status: 400 });
          if (dangerous !== "true") return new Response("missing dangerous browser access header", { status: 400 });
          const body = (await req.json()) as { messages?: Array<{ role: string; content: any }> };
          const content = body?.messages?.[0]?.content;
          const prompt =
            typeof content === "string"
              ? content
              : Array.isArray(content)
                ? content.map((b) => (b?.type === "text" ? String(b?.text ?? "") : "")).join("")
                : "";
          return Response.json({
            id: "msg_test",
            type: "message",
            role: "assistant",
            content: [{ type: "text", text: `echo:${prompt}` }],
            model: "claude-test",
            stop_reason: "end_turn"
          });
        }

        return new Response("not found", { status: 404 });
      }
    });
    try {
      const r = await runCliAsync(["-p", "hello"], {
        CLAUDE_CODE_SESSION_ACCESS_TOKEN: "test-session-token",
        CLAUDE_TS_ANTHROPIC_BASE_URL: `http://127.0.0.1:${server.port}`,
        CLAUDE_TS_MODEL: "claude-test",
        CLAUDE_TS_MAX_TOKENS: "16",
        CLAUDE_TS_UPSTREAM_CLAUDE_CLI_VERSION: "2.0.69",
        CLAUDE_TS_INTERLEAVED_THINKING_BETA: "interleaved-thinking-2025-05-14",
        CLAUDE_TS_DISABLE_KEYCHAIN: "1"
      });
      expect(r.code).toBe(0);
      expect(r.out).toContain("echo:hello");
    } finally {
      server.stop(true);
    }
  });

  test("-p without any credentials exits non-zero with a meaningful error", () => {
    const r = runCli(["-p", "hello"], { CLAUDE_TS_DISABLE_KEYCHAIN: "1", ANTHROPIC_API_KEY: "", CLAUDE_CODE_SESSION_ACCESS_TOKEN: "" });
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("Missing credentials");
  });

  test("--mcp-cli is gated (disabled => main help; enabled => mcp-cli help)", () => {
    const disabled = runCli(["--mcp-cli", "--help"], { ENABLE_EXPERIMENTAL_MCP_CLI: undefined });
    expect(disabled.code).toBe(0);
    expect(disabled.out).toContain("Usage: claude-ts");

    const enabled = runCli(["--mcp-cli", "--help"], { ENABLE_EXPERIMENTAL_MCP_CLI: "1" });
    expect(enabled.code).toBe(0);
    expect(enabled.out).toContain("Usage: claude-ts --mcp-cli");
  });

  test("--mcp-cli info returns mode details", () => {
    const r = runCli(["--mcp-cli", "info", "--json"], { ENABLE_EXPERIMENTAL_MCP_CLI: "1", CLAUDE_CODE_SESSION_ID: "" });
    expect(r.code).toBe(0);
    expect(r.out).toContain("\"mode\"");
    expect(r.out).toContain("\"gates\"");
  });

  test("--ripgrep finds matches via portable search.grep (no subprocess)", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-cli-rg-"));
    try {
      await writeFile(path.join(dir, "a.txt"), "hello world\n", "utf8");
      const r = runCli(["--ripgrep", "hello", dir, "--fixed-string", "--no-ignore-case"]);
      expect(r.code).toBe(0);
      expect(r.out).toContain("a.txt:1:");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("legacy command stubs provide help (install/mcp/plugin/update/setup-token)", () => {
    for (const cmd of ["install", "mcp", "plugin", "update", "setup-token"] as const) {
      const r = runCli([cmd, "--help"]);
      expect(r.code).toBe(0);
      expect(r.out).toContain(`Usage: claude-ts ${cmd}`);
      expect(r.out).not.toContain("screen: prompt");
    }
  });

  test("unknown commands error and exit non-zero (no interactive UI fallback)", () => {
    const r = runCli(["definitely-not-a-real-command"]);
    expect(r.code).not.toBe(0);
    expect(r.out).toContain("unknown command");
    expect(r.out).toContain("Usage: claude-ts");
    expect(r.out).not.toContain("screen: prompt");
  });

  test("-p can execute a simple tool loop when enabled (Read tool)", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-cli-tools-"));
    const target = path.join(dir, "note.txt");
    await writeFile(target, "hello from file\n", "utf8");

    let sawToolResult = false;
    const server = Bun.serve({
      port: 0,
      async fetch(req) {
        const url = new URL(req.url);
        if (req.method === "POST" && url.pathname === "/v1/messages") {
          const body = (await req.json()) as any;
          const tools = body?.tools;
          if (!Array.isArray(tools) || tools.length === 0) return new Response("missing tools", { status: 400 });

          const messages = body?.messages ?? [];
          const last = messages[messages.length - 1];
          const lastBlocks = Array.isArray(last?.content) ? last.content : [];
          const toolResult = lastBlocks.find((b: any) => b?.type === "tool_result");

          if (!toolResult) {
            return Response.json({
              id: "msg_tool",
              type: "message",
              role: "assistant",
              content: [{ type: "tool_use", id: "toolu_1", name: "Read", input: { path: target } }],
              model: "claude-test",
              stop_reason: "tool_use"
            });
          }

          sawToolResult = true;
          return Response.json({
            id: "msg_final",
            type: "message",
            role: "assistant",
            content: [{ type: "text", text: "done" }],
            model: "claude-test",
            stop_reason: "end_turn"
          });
        }
        return new Response("not found", { status: 404 });
      }
    });

    try {
      const r = await runCliAsync(["-p", "read the file"], {
        CLAUDE_CODE_SESSION_ACCESS_TOKEN: "test-session-token",
        CLAUDE_TS_ANTHROPIC_BASE_URL: `http://127.0.0.1:${server.port}`,
        CLAUDE_TS_MODEL: "claude-test",
        CLAUDE_TS_MAX_TOKENS: "16",
        CLAUDE_TS_UPSTREAM_CLAUDE_CLI_VERSION: "2.0.69",
        CLAUDE_TS_INTERLEAVED_THINKING_BETA: "interleaved-thinking-2025-05-14",
        CLAUDE_TS_DISABLE_KEYCHAIN: "1",
        CLAUDE_TS_ENABLE_TOOLS: "1"
      });
      expect(r.code).toBe(0);
      expect(r.out).toContain("done");
      expect(sawToolResult).toBe(true);
    } finally {
      server.stop(true);
      await rm(dir, { recursive: true, force: true });
    }
  });
});
