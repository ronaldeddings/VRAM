import { describe, expect, test } from "bun:test";
import { LEGACY_OVERLAY_PRECEDENCE } from "../src/spec/legacy/appstate.js";
import { LEGACY_HOOK_EVENT_NAMES } from "../src/spec/legacy/hooks.js";
import { LEGACY_MCP_ENV_VARS } from "../src/spec/legacy/mcpCli.js";
import { computeLegacyMcpCliGateSnapshot } from "../src/spec/legacy/envFlags.js";
import { LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE, formatPermissionRuleValue, parsePermissionRuleString } from "../src/spec/legacy/permissions.js";
import { LEGACY_SETTINGS_SOURCE_ORDER } from "../src/spec/legacy/settings.js";
import { OVERLAY_PRECEDENCE } from "../src/core/state/overlays.js";

const BUNDLE_PATHS = [
  "bundles/ClaudeCodeCode/cli.js",
  "bundles/ClaudeAgentSDKCode/cli.js"
] as const;

async function readBundleText(path: string): Promise<string> {
  return await Bun.file(path).text();
}

describe("Phase 1: legacy spec carry-over", () => {
  test("overlay precedence matches captured legacy order", () => {
    expect(OVERLAY_PRECEDENCE).toEqual(LEGACY_OVERLAY_PRECEDENCE);
  });

  test("permission rule parse/format roundtrip", () => {
    const cases = [
      "Read",
      "Bash(ls -la)",
      "mcp__server__tool(domain:example.com)",
      "ToolWithParens(hello world)"
    ];

    for (const input of cases) {
      const parsed = parsePermissionRuleString(input);
      const formatted = formatPermissionRuleValue(parsed);
      expect(formatted).toBe(input);
    }

    expect(parsePermissionRuleString("Tool()")).toEqual({ toolName: "Tool()" });
  });

  test("bundle env vars include legacy MCP CLI toggles", async () => {
    const envVars = Object.values(LEGACY_MCP_ENV_VARS);
    for (const bundlePath of BUNDLE_PATHS) {
      const text = await readBundleText(bundlePath);
      for (const envVar of envVars) expect(text).toContain(envVar);
    }
  });

  test("bundle contains canonical settings-source precedence list", async () => {
    const literal = `["${LEGACY_SETTINGS_SOURCE_ORDER.join('","')}"]`;
    for (const bundlePath of BUNDLE_PATHS) {
      const text = await readBundleText(bundlePath);
      expect(text).toContain(literal);
    }
  });

  test("bundle contains canonical permission rule-source precedence list", async () => {
    for (const bundlePath of BUNDLE_PATHS) {
      const text = await readBundleText(bundlePath);
      for (const source of LEGACY_PERMISSION_RULE_SOURCE_PRECEDENCE) expect(text).toContain(`"${source}"`);
      expect(text).toContain('"cliArg"');
      expect(text).toContain('"command"');
      expect(text).toContain('"session"');
    }
  });

  test("bundle contains hook event names captured in v3 spec", async () => {
    for (const bundlePath of BUNDLE_PATHS) {
      const text = await readBundleText(bundlePath);
      for (const name of LEGACY_HOOK_EVENT_NAMES) expect(text).toContain(name);
    }
  });

  test("MCP CLI env gates match observed bundle behavior", () => {
    const snap = computeLegacyMcpCliGateSnapshot({
      ENABLE_EXPERIMENTAL_MCP_CLI: "1",
      ENABLE_MCP_CLI_ENDPOINT: "1",
      MCP_TOOL_TIMEOUT: "1234",
      MAX_MCP_OUTPUT_TOKENS: "250"
    });
    expect(snap).toEqual({
      enableExperimentalMcpCli: true,
      enableMcpCliEndpoint: true,
      mcpToolTimeoutMs: 1234,
      maxMcpOutputTokens: 250
    });

    const snap2 = computeLegacyMcpCliGateSnapshot({
      ENABLE_EXPERIMENTAL_MCP_CLI: "true",
      ENABLE_MCP_CLI_ENDPOINT: "0"
    });
    expect(snap2.enableExperimentalMcpCli).toBe(true);
    expect(snap2.enableMcpCliEndpoint).toBe(false);
  });

  test("bundle `--mcp-cli` is gated by ENABLE_EXPERIMENTAL_MCP_CLI", () => {
    const args = ["node", "bundles/ClaudeCodeCode/cli.js", "--mcp-cli", "--help"];

    const procNoGate = Bun.spawnSync(args, { env: { ...process.env }, stdout: "pipe", stderr: "pipe" });
    expect(procNoGate.exitCode).toBe(0);
    const outNoGate = `${procNoGate.stdout.toString()}\n${procNoGate.stderr.toString()}`;
    expect(outNoGate).toContain("Usage: claude");

    const procGate = Bun.spawnSync(args, {
      env: { ...process.env, ENABLE_EXPERIMENTAL_MCP_CLI: "1" },
      stdout: "pipe",
      stderr: "pipe"
    });
    expect(procGate.exitCode).toBe(0);
    const outGate = `${procGate.stdout.toString()}\n${procGate.stderr.toString()}`;
    expect(outGate).toContain("Usage: mcp-cli");
  });

  test("both bundles agree on MCP CLI gating snapshot (env/flag mapping)", () => {
    const run = (bundlePath: string, env: Record<string, string | undefined>) => {
      const proc = Bun.spawnSync(["node", bundlePath, "--mcp-cli", "--help"], {
        env: { ...process.env, ...env },
        stdout: "pipe",
        stderr: "pipe"
      });
      const out = `${proc.stdout.toString()}\n${proc.stderr.toString()}`;
      return {
        exitCode: proc.exitCode,
        isMcpCli: out.includes("Usage: mcp-cli"),
        isClaudeCli: out.includes("Usage: claude"),
        warnedFallback: out.includes("Falling back to state file")
      };
    };

    const aNo = run("bundles/ClaudeCodeCode/cli.js", {});
    const bNo = run("bundles/ClaudeAgentSDKCode/cli.js", {});
    expect(aNo).toEqual({ exitCode: 0, isMcpCli: false, isClaudeCli: true, warnedFallback: false });
    expect(bNo).toEqual({ exitCode: 0, isMcpCli: false, isClaudeCli: true, warnedFallback: false });

    const aYes = run("bundles/ClaudeCodeCode/cli.js", { ENABLE_EXPERIMENTAL_MCP_CLI: "1" });
    const bYes = run("bundles/ClaudeAgentSDKCode/cli.js", { ENABLE_EXPERIMENTAL_MCP_CLI: "1" });
    expect(aYes.exitCode).toBe(0);
    expect(bYes.exitCode).toBe(0);
    expect(aYes.isMcpCli).toBe(true);
    expect(bYes.isMcpCli).toBe(true);
    expect(aYes.warnedFallback).toBe(true);
    expect(bYes.warnedFallback).toBe(true);
  });
});
