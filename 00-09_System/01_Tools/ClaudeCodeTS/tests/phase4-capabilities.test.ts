import { describe, expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import {
  CapabilityPolicyDeniedError,
  CapabilityUnavailableError,
  availableCapability,
  requireCapability,
  unavailableCapability
} from "../src/core/types/host.js";
import { normalizePortablePath } from "../src/core/filesystem/path.js";
import { computeBackoffDelayMs, retryWithBackoff } from "../src/core/network/retry.js";
import { allowAllCapabilitiesPolicy } from "../src/core/capabilities/policy.js";
import { createCapabilityView } from "../src/core/capabilities/view.js";
import { buildCapabilityComplianceReport } from "../src/core/capabilities/compliance.js";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";

describe("Phase 4: host capabilities", () => {
  test("requireCapability throws typed errors", () => {
    const host = {
      clock: unavailableCapability({ kind: "not-provided" }),
      random: unavailableCapability({ kind: "disabled" }),
      crypto: unavailableCapability({ kind: "unsupported" }),
      secrets: unavailableCapability({ kind: "not-provided" }),
      storage: unavailableCapability({ kind: "not-provided" }),
      filesystem: unavailableCapability({ kind: "not-provided" }),
      network: unavailableCapability({ kind: "not-provided" }),
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

    expect(() => requireCapability(host, "storage")).toThrow(CapabilityUnavailableError);

    const host2 = { ...host, network: unavailableCapability({ kind: "policy-denied", message: "no", policyId: "p1" }) };
    expect(() => requireCapability(host2, "network")).toThrow(CapabilityPolicyDeniedError);
  });

  test("capability view can policy-deny individual caps", () => {
    const host = {
      clock: availableCapability({ nowMs: () => 1 }),
      random: unavailableCapability({ kind: "not-provided" }),
      crypto: unavailableCapability({ kind: "not-provided" }),
      secrets: unavailableCapability({ kind: "not-provided" }),
      storage: unavailableCapability({ kind: "not-provided" }),
      filesystem: unavailableCapability({ kind: "not-provided" }),
      network: availableCapability({ fetch: fetch }),
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

    const view = createCapabilityView(host, ["clock", "network"], {
      policy: allowAllCapabilitiesPolicy(),
      policyContext: { subject: "engine" },
      policyId: "test-policy"
    });

    expect(view.clock.kind).toBe("available");
    expect(view.network.kind).toBe("available");
    expect(view.storage.kind).toBe("unavailable");
    if (view.storage.kind === "unavailable") expect(view.storage.reason.kind).toBe("policy-denied");
  });

  test("capability compliance report flags missing required", () => {
    const host = createNodeHostCapabilities();
    const report = buildCapabilityComplianceReport(host);
    expect(report.missingRequired.length).toBe(0);
  });

  test("node storage provides CAS semantics", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "claude-code-ts-"));
    try {
      const host = createNodeHostCapabilities({ configDir: tmp, storageSubdir: "test-storage" });
      const storage = requireCapability(host, "storage");

      const ns = { scope: "app" } as const;
      const k = "hello";
      const v1 = await storage.set(ns, k, "one", { expectedVersion: null });
      const r1 = await storage.get(ns, k);
      expect(r1?.value).toBe("one");
      expect(r1?.version).toBe(v1.version);

      await expect(storage.set(ns, k, "two", { expectedVersion: "not-a-version" })).rejects.toBeTruthy();
      const v2 = await storage.set(ns, k, "two", { expectedVersion: v1.version });
      const r2 = await storage.get(ns, k);
      expect(r2?.value).toBe("two");
      expect(r2?.version).toBe(v2.version);
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });

  test("portable path normalization is POSIX-like", () => {
    expect(normalizePortablePath("a/b/../c")).toBe("a/c");
    expect(normalizePortablePath("/a//b/./c")).toBe("/a/b/c");
    expect(normalizePortablePath("..\\a\\b")).toBe("../a/b");
  });

  test("retry/backoff is deterministic with injected RNG", async () => {
    expect(computeBackoffDelayMs(1, { baseMs: 100, factor: 2, maxMs: 1000, jitter: "full" }, () => 0.25)).toBe(25);

    let attempts = 0;
    let slept = 0;
    const out = await retryWithBackoff(
      async () => {
        attempts += 1;
        if (attempts < 3) throw new Error("no");
        return "ok";
      },
      {
        maxAttempts: 5,
        backoff: { baseMs: 10, factor: 2, maxMs: 1000, jitter: "none" },
        sleep: async () => {
          slept += 1;
        }
      }
    );

    expect(out).toBe("ok");
    expect(attempts).toBe(3);
    expect(slept).toBe(2);
  });
});
