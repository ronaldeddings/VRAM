import { describe, expect, test } from "bun:test";
import crypto from "node:crypto";
import type { HostCrypto } from "../src/core/types/host.js";
import { drainNotifications, expireCurrentNotification, type NotificationState } from "../src/core/state/notifications.js";
import {
  asAttachmentId,
  asSessionId,
  asToolRunId,
  sensitive,
  type PersistedSessionStateV1,
  type TranscriptLogV1
} from "../src/core/types/state.js";
import { computeTranscriptSummary, redactTranscriptLog } from "../src/core/state/transcript.js";
import { createSessionExport } from "../src/core/state/sessionExport.js";

describe("Phase 5: deterministic queues and redaction", () => {
  test("notification drain is deterministic for equal priority", () => {
    const state: NotificationState = {
      current: null,
      queue: [
        { key: "a", text: "A", priority: "high" },
        { key: "b", text: "B", priority: "high" },
        { key: "c", text: "C", priority: "high" }
      ]
    };

    const drained = drainNotifications(state);
    expect(drained.state.current?.key).toBe("a");
    expect(drained.state.queue.map((n) => n.key)).toEqual(["b", "c"]);

    const expired = expireCurrentNotification(drained.state, "a");
    expect(expired.state.current?.key).toBe("b");
  });

  test("transcript redaction removes sensitive nodes and produces a stable hash", async () => {
    const log: TranscriptLogV1 = {
      schemaVersion: 1,
      events: [
        {
          id: "e1",
          tsMonoMs: 1,
          type: "tool",
          toolRunId: asToolRunId("tr1"),
          stage: "start",
          toolName: "Read",
          input: sensitive({ token: "supersecret" })
        },
        {
          id: "e2",
          tsMonoMs: 2,
          type: "message",
          role: "assistant",
          content: "ok"
        }
      ]
    };

    const { log: redacted, stats } = redactTranscriptLog(log);
    expect(stats.redactedNodes).toBe(1);
    expect(JSON.stringify(redacted)).not.toContain("supersecret");

    const hostCrypto: HostCrypto = {
      digest: async (algorithm, data) => {
        if (algorithm !== "SHA-256") throw new Error(`Unsupported algorithm: ${algorithm}`);
        return new Uint8Array(crypto.createHash("sha256").update(data).digest());
      }
    };

    const a = await computeTranscriptSummary(log, hostCrypto);
    const b = await computeTranscriptSummary(log, hostCrypto);
    expect(a).toEqual(b);
    expect(a.eventCount).toBe(2);
    expect(a.redactedNodes).toBe(1);
    expect(a.sha256Hex).toMatch(/^[0-9a-f]{64}$/);
  });

  test("session export omits out-of-line attachment payloads", () => {
    const session: PersistedSessionStateV1 = {
      schemaVersion: 1,
      id: asSessionId("s1"),
      lifecycle: "ended",
      mode: "live",
      createdAtMonoMs: 0,
      updatedAtMonoMs: 0,
      endedAtMonoMs: 0,
      transcript: { schemaVersion: 1, events: [] },
      attachments: {
        a1: {
          id: asAttachmentId("a1"),
          createdAtMonoMs: 0,
          kind: "text",
          inlineText: "inline secret",
          storageKey: "storage/a1"
        }
      },
      toolRuns: {},
      hookRuns: {},
      mcpConnections: {}
    };

    const exported = createSessionExport(session, 123);
    const exportedAttachment = exported.session.attachments["a1"]!;
    expect(exportedAttachment.inlineText).toBeUndefined();
    expect(exportedAttachment.inlineJson).toBeUndefined();
    expect(exportedAttachment.storageKey).toBeUndefined();
  });
});

