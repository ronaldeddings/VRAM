import { describe, expect, test } from "bun:test";
import { canonicalJsonStringify } from "../src/core/types/canonicalJson.js";
import { runRegressionScenario, type RegressionScenario } from "./helpers/regressionHarness.js";

type Corpus = { scenarios: Array<RegressionScenario & { expected: any }> };

describe("Phase 14: legacy regression harness (portable, deterministic)", () => {
  test("fixture corpus replays and matches expected outputs", async () => {
    const corpus = (await Bun.file("tests/fixtures/phase14-regression-corpus.json").json()) as Corpus;
    expect(Array.isArray(corpus.scenarios)).toBe(true);

    for (const scenario of corpus.scenarios) {
      const result = await runRegressionScenario(scenario);

      const normalized = {
        effectiveSettings: {
          allowManagedHooksOnly: (result.effectiveSettings as any).allowManagedHooksOnly ?? null,
          permissions: (result.effectiveSettings as any).permissions ?? null
        },
        policy: result.policy,
        toolPermissionDecision: result.toolPermissionDecision
          ? {
              behavior: result.toolPermissionDecision.behavior,
              reasonCode: result.toolPermissionDecision.reasonCode,
              attribution: result.toolPermissionDecision.attribution
            }
          : null,
        hooksCanonical: result.hooksCanonical ? JSON.parse(result.hooksCanonical) : null,
        mcpSelectedMode: result.mcpSelectedMode ?? null
      };

      expect(canonicalJsonStringify(normalized)).toBe(canonicalJsonStringify(scenario.expected));
    }
  });

  test("replaying the same scenario twice is stable", async () => {
    const corpus = (await Bun.file("tests/fixtures/phase14-regression-corpus.json").json()) as Corpus;
    const first = corpus.scenarios[0];
    expect(first).toBeTruthy();
    if (!first) return;

    const a = await runRegressionScenario(first);
    const b = await runRegressionScenario(first);
    expect(canonicalJsonStringify(a)).toBe(canonicalJsonStringify(b));
  });
});
