import { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { readLegacySettingsFilesSnapshot, applyPermissionUpdatesToLegacySettingsFile } from "../src/core/migration/legacySettingsFiles.js";
import { canonicalizeLegacyToolIdentifier } from "../src/core/migration/toolMapping.js";
import { computeEffectiveConfig } from "../src/core/settings/effectiveConfig.js";
import { runShadowEvaluation } from "../src/core/migration/shadow.js";

describe("Phase 15: migration strategy primitives", () => {
  test("legacy settings file snapshot merges sources in legacy order", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-settings-"));
    const configDir = path.join(dir, "config");
    const projectRoot = path.join(dir, "project");
    await mkdir(configDir, { recursive: true });
    await mkdir(path.join(projectRoot, ".claude"), { recursive: true });

    await writeFile(path.join(configDir, "settings.json"), JSON.stringify({ a: 1, list: [1], hooks: { Foo: [] } }, null, 2), "utf8");
    await writeFile(path.join(projectRoot, ".claude", "settings.json"), JSON.stringify({ a: 2, list: [2] }, null, 2), "utf8");
    await writeFile(path.join(projectRoot, ".claude", "settings.local.json"), JSON.stringify({ a: 3, list: [2, 3] }, null, 2), "utf8");

    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
    const snapshot = await readLegacySettingsFilesSnapshot(
      host,
      { configDir, projectRoot },
      { enabledSources: ["userSettings", "projectSettings", "localSettings"] }
    );

    expect(snapshot.effectiveSettings.a).toBe(3);
    expect(snapshot.effectiveSettings.list).toEqual([1, 2, 3]);
    expect(snapshot.errors.length).toBe(0);

    await rm(dir, { recursive: true, force: true });
  });

  test("policy settings origin is absent/invalid based on managed-settings.json readability", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-policy-"));
    const configDir = path.join(dir, "config");
    const projectRoot = path.join(dir, "project");
    const policySystemDir = path.join(dir, "system");
    await mkdir(configDir, { recursive: true });
    await mkdir(projectRoot, { recursive: true });
    await mkdir(policySystemDir, { recursive: true });

    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });

    const absent = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
    expect(absent.policyOrigin).toBe("absent");
    expect(absent.perSource.policySettings?.origin).toBe("absent");
    expect(absent.errors.length).toBe(0);

    await writeFile(path.join(policySystemDir, "managed-settings.json"), "{", "utf8");
    const invalid = await readLegacySettingsFilesSnapshot(host, { configDir, projectRoot, policySystemDir }, { enabledSources: ["policySettings"] });
    expect(invalid.policyOrigin).toBe("invalid");
    expect(invalid.perSource.policySettings?.origin).toBe("invalid");
    expect(invalid.errors.length).toBeGreaterThan(0);

    await rm(dir, { recursive: true, force: true });
  });

  test("legacy permission updates can be persisted back to legacy settings files", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-perms-"));
    const configDir = path.join(dir, "config");
    await mkdir(configDir, { recursive: true });

    const initial = {
      kind: "settings_document",
      schemaVersion: 1,
      settings: { permissions: { allow: ["Read(/tmp/**)"] } }
    };
    await writeFile(path.join(configDir, "settings.json"), JSON.stringify(initial, null, 2) + "\n", "utf8");

    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
    const res = await applyPermissionUpdatesToLegacySettingsFile({
      host,
      ctx: { configDir },
      source: "userSettings",
      updates: [{ type: "addRules", behavior: "allow", destination: "userSettings", rules: [{ toolName: "Bash" }] }]
    });

    expect(res.ok).toBe(true);
    expect(res.ok && res.format).toBe("envelope_v1");
    expect(res.ok && res.wrotePath).toBe(path.join(configDir, "settings.json"));

    const written = JSON.parse(await Bun.file(path.join(configDir, "settings.json")).text()) as any;
    expect(written.kind).toBe("settings_document");
    expect(written.schemaVersion).toBe(1);
    expect(written.settings.permissions.allow).toContain("Bash");

    await rm(dir, { recursive: true, force: true });
  });

  test("legacy MCP tool identifiers are canonicalized deterministically", () => {
    expect(canonicalizeLegacyToolIdentifier({ kind: "mcp_rule", ruleToolName: "mcp__My Server__Read File" })).toBe(
      "mcp__my-server__read-file"
    );
    expect(canonicalizeLegacyToolIdentifier({ kind: "mcp_ref", server: "My Server", tool: "Read File" })).toBe(
      "mcp__my-server__read-file"
    );
  });

  test("shadow evaluation produces no diffs when settings are equivalent", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "claude-ts-phase15-shadow-"));
    const configDir = path.join(dir, "config");
    const projectRoot = path.join(dir, "project");
    await mkdir(configDir, { recursive: true });
    await mkdir(path.join(projectRoot, ".claude"), { recursive: true });

    await writeFile(path.join(configDir, "settings.json"), JSON.stringify({ permissions: { allow: ["Bash"] } }, null, 2), "utf8");
    await writeFile(path.join(projectRoot, ".claude", "settings.json"), JSON.stringify({ hooks: { Foo: [] } }, null, 2), "utf8");

    const host = createNodeHostCapabilities({ enableKeychain: false, configDir });
    const legacySnapshot = await readLegacySettingsFilesSnapshot(
      host,
      { configDir, projectRoot },
      { enabledSources: ["userSettings", "projectSettings"] }
    );

    const cfg = computeEffectiveConfig({
      effectiveSettings: legacySnapshot.effectiveSettings,
      policySource: undefined,
      policyOrigin: "absent",
      host,
      env: {}
    });

    const shadow = await runShadowEvaluation({
      host,
      legacySettingsCtx: { configDir, projectRoot },
      v3EffectiveSettings: legacySnapshot.effectiveSettings,
      v3EffectiveConfig: cfg,
      legacyEffectiveConfig: cfg,
      toolInvocation: { toolName: "Bash", input: { command: "echo hi" } },
      hookResolution: { policySettings: null },
      mcpModeSelection: { preferredMode: "endpoint", endpointAllowed: true, endpointPresent: false, directAvailable: true }
    });

    expect(shadow.diffs).toEqual([]);
    await rm(dir, { recursive: true, force: true });
  });
});
