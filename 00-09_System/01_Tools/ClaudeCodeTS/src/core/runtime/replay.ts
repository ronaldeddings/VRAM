import type { EngineEventEnvelope, HostEvent } from "../types/events.js";
import type { RuntimeSnapshot } from "../types/runtime.js";

export type ReplayCapabilityDescriptor = {
  name: string;
  available: boolean;
  version?: string;
  notes?: string;
};

export type ReplayRedactionEntry = {
  path: string;
  method: "removed" | "hashed" | "elided";
  rationale: string;
};

export type ReplayRedactionManifest = {
  createdAtWallMs: number;
  entries: ReplayRedactionEntry[];
};

export type ReplayInjectedEvent =
  | { kind: "host"; tsMonoMs: number; event: HostEvent }
  | { kind: "ui"; tsMonoMs: number; inputId: string; payload: unknown };

export type ReplayRecordedNondeterminism =
  | { kind: "filesystem"; key: string; tsMonoMs: number; response: unknown }
  | { kind: "network"; key: string; tsMonoMs: number; response: unknown }
  | { kind: "random"; key: string; tsMonoMs: number; value: string };

export type ReplayAssertionCheckpoint = {
  tsMonoMs: number;
  eventCursor?: { channel: string; seq: number };
  snapshotHash?: string;
};

export type ReplayCapture = {
  schemaVersion: 1;
  createdAtWallMs: number;
  seed: string;
  capabilities: ReplayCapabilityDescriptor[];
  injected: ReplayInjectedEvent[];
  nondeterminism: ReplayRecordedNondeterminism[];
  events: EngineEventEnvelope[];
  checkpoints?: ReplayAssertionCheckpoint[];
  redaction: ReplayRedactionManifest;
  notes?: string;
};

export type ReplayDiffClassification = "exact" | "benign_ui" | "allowed_nondeterminism" | "regression";

export type ReplayDiff = {
  classification: ReplayDiffClassification;
  summary: string;
  details?: unknown;
};

export type ReplayResult = {
  ok: boolean;
  diffs: ReplayDiff[];
  finalSnapshot?: RuntimeSnapshot;
};

