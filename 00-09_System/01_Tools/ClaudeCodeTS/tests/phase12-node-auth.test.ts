import { describe, expect, test } from "bun:test";
import { createNodeHostCapabilities } from "../src/platform/node/host.js";
import { requireCapability } from "../src/core/types/host.js";

describe("Phase 12: Node auth token discovery", () => {
  test("CLAUDE_CODE_SESSION_ACCESS_TOKEN is exposed via secrets capability", async () => {
    const prev = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
    process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN = "test-token";
    try {
      const host = createNodeHostCapabilities({ enableKeychain: false, enablePlaintextSecretFallback: false });
      const secrets = requireCapability(host, "secrets");
      expect(await secrets.getSecret("claude_code/session_access_token")).toBe("test-token");
      expect(await secrets.getSecret("CLAUDE_CODE_SESSION_ACCESS_TOKEN")).toBe("test-token");
    } finally {
      if (prev === undefined) delete process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
      else process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN = prev;
    }
  });
});

