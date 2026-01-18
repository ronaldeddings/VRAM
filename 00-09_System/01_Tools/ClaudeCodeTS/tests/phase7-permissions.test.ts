import { describe, expect, test } from "bun:test";
import crypto from "node:crypto";
import { availableCapability, unavailableCapability, type HostCapabilities, type HostNetwork, type HostStorage, type StorageNamespace } from "../src/core/types/host.js";
import { asWorkspaceId } from "../src/core/types/workspace.js";
import { createSettingsDocumentFromObject, createSettingsManager, writeSettingsSourceToStorage } from "../src/core/settings/index.js";
import {
  PermissionDecisionCache,
  applyPermissionUpdates,
  buildContentRuleIndex,
  buildPermissionDecisionCacheKey,
  buildToolPermissionContextFromSettings,
  canonicalizeNetworkTargetFromUrl,
  computePermissionPolicySnapshot,
  createEmptyToolPermissionContext,
  decideToolInvocationPermission,
  findFirstPlainRule,
  formatPermissionRuleValue,
  isCacheablePermissionDecision,
  parsePermissionRuleString,
  persistPermissionUpdates,
  suggestPermissionUpdatesForNetworkApproval,
  createPermissionGatedCapabilities
} from "../src/core/permissions/index.js";

function nsKey(ns: StorageNamespace): string {
  return `${ns.scope}:${ns.workspaceId ?? ""}:${ns.sessionId ?? ""}`;
}

function computeVersion(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function createInMemoryStorage(): HostStorage {
  const data = new Map<string, { value: string; version: string }>();
  const subs = new Map<string, Set<(e: any) => void>>();

  function emit(ns: StorageNamespace, event: any): void {
    const k = nsKey(ns);
    const set = subs.get(k);
    if (!set) return;
    for (const h of set) h(event);
  }

  return {
    get: async (ns, key) => {
      const rec = data.get(`${nsKey(ns)}:${key}`);
      if (!rec) return null;
      return { value: rec.value, version: rec.version };
    },
    set: async (ns, key, value, options) => {
      const full = `${nsKey(ns)}:${key}`;
      const existing = data.get(full) ?? null;
      const expected = options?.expectedVersion;
      if (expected !== undefined) {
        const actual = existing?.version ?? null;
        if (expected === null) {
          if (existing !== null) throw new Error("conflict");
        } else if (existing === null || existing.version !== expected) {
          throw new Error("conflict");
        }
      }
      const version = computeVersion(value);
      data.set(full, { value, version });
      emit(ns, { namespace: ns, key, kind: "set", version });
      return { version };
    },
    delete: async (ns, key) => {
      data.delete(`${nsKey(ns)}:${key}`);
      emit(ns, { namespace: ns, key, kind: "delete" });
    },
    subscribe: (ns, handler) => {
      const k = nsKey(ns);
      const set = subs.get(k) ?? new Set();
      set.add(handler);
      subs.set(k, set);
      return () => {
        const cur = subs.get(k);
        cur?.delete(handler);
        if (cur && cur.size === 0) subs.delete(k);
      };
    }
  };
}

function createHostWithStorage(storage: HostStorage, network?: HostNetwork): HostCapabilities {
  return {
    clock: unavailableCapability({ kind: "not-provided" }),
    random: unavailableCapability({ kind: "not-provided" }),
    crypto: unavailableCapability({ kind: "not-provided" }),
    secrets: unavailableCapability({ kind: "not-provided" }),
    storage: availableCapability(storage),
    filesystem: unavailableCapability({ kind: "not-provided" }),
    network: network ? availableCapability(network) : unavailableCapability({ kind: "not-provided" }),
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
}

describe("Phase 7: permissions engine", () => {
  test("rule parsing/stringifying matches legacy grammar", () => {
    expect(parsePermissionRuleString("Bash")).toEqual({ toolName: "Bash" });
    expect(parsePermissionRuleString("Read(/x/**)")).toEqual({ toolName: "Read", ruleContent: "/x/**" });
    expect(formatPermissionRuleValue({ toolName: "Read", ruleContent: "/x/**" })).toBe("Read(/x/**)");
  });

  test("plain rules: first match wins by legacy source order; content rules overwrite later sources", () => {
    const ctx = createEmptyToolPermissionContext();
    ctx.alwaysDenyRules.userSettings = ["Bash"];
    ctx.alwaysDenyRules.session = ["Bash"];
    const deny = findFirstPlainRule(ctx as any, "Bash", "deny");
    expect(deny?.source).toBe("userSettings");

    ctx.alwaysAllowRules.userSettings = ["Read(/a)"];
    ctx.alwaysAllowRules.session = ["Read(/a)"];
    const index = buildContentRuleIndex(ctx as any, "Read", "allow");
    expect(index.get("/a")?.source).toBe("session");
  });

  test("decision pipeline preserves legacy ordering (deny > ask > tool-specific > mode override > allow > fallback)", async () => {
    const toolPermissionContext = createEmptyToolPermissionContext();
    toolPermissionContext.alwaysDenyRules.userSettings = ["Bash"];

    const settings = { settings: {}, errors: [], enabledSources: [], perSource: {}, policyOrigin: "absent" } as any;
    const policy = computePermissionPolicySnapshot(settings);

    const host = createHostWithStorage(createInMemoryStorage());
    const ctx = {
      settings,
      toolPermissionContext,
      host,
      policy,
      sandbox: { sandboxingEnabled: true, autoAllowBashIfSandboxed: true }
    };

    const denied = await decideToolInvocationPermission({ toolName: "Bash", input: "echo hi" }, ctx);
    expect(denied.behavior).toBe("deny");
    expect(denied.reasonCode).toBe("rule_deny");

    toolPermissionContext.alwaysDenyRules.userSettings = [];
    toolPermissionContext.alwaysAskRules.userSettings = ["Bash"];
    const allowedByToolSpecific = await decideToolInvocationPermission(
      {
        toolName: "Bash",
        input: "echo hi > out.txt",
        checkPermissions: async (_input, _ctx) => ({ behavior: "allow", explanation: "sandboxed allow" })
      },
      ctx
    );
    expect(allowedByToolSpecific.behavior).toBe("allow");
  });

  test("settings-driven context builder reads permissions.* from per-source settings", async () => {
    const storage = createInMemoryStorage();
    const host = createHostWithStorage(storage);
    const ctx = { workspaceId: asWorkspaceId("ws_p7"), sessionId: "sess_p7" };

    await writeSettingsSourceToStorage(
      storage,
      "userSettings",
      ctx,
      createSettingsDocumentFromObject({ permissions: { allow: ["Bash"], additionalDirectories: ["~/projects"] } }),
      { expectedVersion: null }
    );
    await writeSettingsSourceToStorage(storage, "flagSettings", ctx, createSettingsDocumentFromObject({}), { expectedVersion: null });

    const mgr = createSettingsManager(host, ctx);
    await mgr.initialize();
    const effective = mgr.getEffective();
    const policy = computePermissionPolicySnapshot(effective);
    const built = buildToolPermissionContextFromSettings(effective, policy);
    expect(built.ctx.alwaysAllowRules.userSettings).toEqual(["Bash"]);
    expect([...built.ctx.additionalWorkingDirectories.keys()]).toContain("~/projects");
    mgr.dispose();
  });

  test("permission updates persist via SettingsManager.updateSource and preserve array operations", async () => {
    const storage = createInMemoryStorage();
    const host = createHostWithStorage(storage);
    const ctx = { workspaceId: asWorkspaceId("ws_p7_persist"), sessionId: "sess_p7_persist" };

    await writeSettingsSourceToStorage(storage, "localSettings", ctx, createSettingsDocumentFromObject({ permissions: { allow: ["Read(/a)"] } }), {
      expectedVersion: null
    });
    await writeSettingsSourceToStorage(storage, "flagSettings", ctx, createSettingsDocumentFromObject({}), { expectedVersion: null });

    const mgr = createSettingsManager(host, ctx);
    await mgr.initialize();
    const policy = computePermissionPolicySnapshot(mgr.getEffective());

    const res = await persistPermissionUpdates({
      manager: mgr,
      policy,
      actor: "user",
      nowWallMs: 1,
      workspaceId: "ws_p7_persist",
      updates: [
        { type: "addRules", behavior: "allow", destination: "localSettings", rules: [{ toolName: "Read", ruleContent: "/b" }] }
      ]
    });
    expect(res.ok).toBe(true);
    expect((mgr.getEffective().perSource.localSettings?.settings as any).permissions.allow).toEqual(["Read(/a)", "Read(/b)"]);
    mgr.dispose();
  });

  test("network target canonicalization and local-network classification work", () => {
    const r1 = canonicalizeNetworkTargetFromUrl("https://Example.COM/path");
    expect(r1.ok).toBe(true);
    if (r1.ok) {
      expect(r1.target.host).toBe("example.com");
      expect(r1.target.port).toBe(443);
    }

    const r2 = canonicalizeNetworkTargetFromUrl("http://127.0.0.1/");
    expect(r2.ok).toBe(true);
    if (r2.ok) expect(r2.target.classification).toBe("loopback");

    const r3 = canonicalizeNetworkTargetFromUrl("http://[::1]/");
    expect(r3.ok).toBe(true);
    if (r3.ok) expect(r3.target.classification).toBe("loopback");
  });

  test("network approvals can be enforced by permission-gated network capability", async () => {
    let approvals = 0;
    const network: HostNetwork = {
      fetch: async () => new Response("ok")
    };
    const host = createHostWithStorage(createInMemoryStorage(), network);
    const policy = {
      schemaVersion: 1,
      policyOrigin: "absent",
      managedOnly: false,
      canPersistTo: { userSettings: true, projectSettings: true, localSettings: true },
      allowBypassPermissionsMode: true,
      allowSandboxOverride: true,
      allowLocalNetwork: true
    } as const;

    const { gated } = createPermissionGatedCapabilities({
      host,
      policy,
      createRequestId: () => "req1",
      nowMonoMs: () => 1,
      approveNetwork: async () => {
        approvals += 1;
        return { decision: "allow", remember: true };
      }
    });

    await gated.network.value.fetch("https://example.com");
    await gated.network.value.fetch("https://example.com");
    expect(approvals).toBe(1);
  });

  test("network approval persistence suggests legacy WebFetch(domain:host) rule updates", () => {
    const updates = suggestPermissionUpdatesForNetworkApproval({
      request: {
        requestId: "r1",
        createdAtMonoMs: 1,
        workspaceScope: "workspace",
        origin: "local",
        reason: { kind: "sandbox" },
        target: { scheme: "https", host: "example.com", port: 443, hostKind: "hostname", classification: "unknown" }
      },
      decision: { decision: "allow", remember: true },
      destination: "localSettings"
    });
    expect(updates.length).toBe(1);
    expect((updates[0] as any).rules[0].toolName).toBe("WebFetch");
    expect((updates[0] as any).rules[0].ruleContent).toBe("domain:example.com");
  });

  test("decision cache stores allow/deny but not ask by default", () => {
    const cache = new PermissionDecisionCache({ maxEntries: 10 });
    const allowDecision = { behavior: "allow", reasonCode: "rule_allow", explanation: "ok", attribution: { sources: [] } } as any;
    const askDecision = { behavior: "ask", reasonCode: "passthrough", explanation: "ask", attribution: { sources: [] } } as any;

    const key1 = buildPermissionDecisionCacheKey({ toolName: "Read", inputRiskSignature: { a: 1 } });
    expect(isCacheablePermissionDecision(allowDecision)).toBe(true);
    cache.set(key1, allowDecision);
    expect(cache.get(key1)?.behavior).toBe("allow");

    const key2 = buildPermissionDecisionCacheKey({ toolName: "Read", inputRiskSignature: { a: 2 } });
    expect(isCacheablePermissionDecision(askDecision)).toBe(false);
    expect(cache.get(key2)).toBeNull();
  });

  test("applyPermissionUpdates is deterministic", () => {
    const ctx = createEmptyToolPermissionContext();
    const res = applyPermissionUpdates(ctx, [
      { type: "addRules", behavior: "allow", destination: "session", rules: [{ toolName: "Bash" }] },
      { type: "setMode", destination: "session", mode: "plan" }
    ] as any);
    expect(res.ctx.mode).toBe("plan");
    expect(res.ctx.alwaysAllowRules.session).toEqual(["Bash"]);
  });
});
