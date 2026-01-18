import type { HostStorage, StorageNamespace } from "../types/host.js";
import type { PersistedAppStateV1, StateSnapshotV1 } from "../types/state.js";
import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import { canonicalJsonStringify } from "../types/canonicalJson.js";
import { createEmptyPersistedAppState, recoverPersistedAppState } from "./state.js";

export const STATE_SNAPSHOT_STORAGE_KEY = "state/state_snapshot";

export type StateMigrationNote = {
  fromVersion: number;
  toVersion: number;
  note: string;
};

export type HydrationRecoveryNote = {
  kind: "tool_run_cancelled" | "hook_run_cancelled" | "other";
  sessionId: string;
  entityId: string;
  message: string;
};

export type HydrationResult = {
  persisted: PersistedAppStateV1;
  migrations: StateMigrationNote[];
  recovery: HydrationRecoveryNote[];
};

export type SafeHydrationResult = HydrationResult & {
  source: "loaded" | "empty" | "reset";
  error?: string;
};

export class InvalidStateSnapshotError extends Error {
  readonly name = "InvalidStateSnapshotError";
  constructor(message: string) {
    super(message);
  }
}

export function encodeStateSnapshot(snapshot: StateSnapshotV1): string {
  return canonicalJsonStringify(snapshot);
}

export function decodeStateSnapshot(text: string): StateSnapshotV1 {
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== "object") throw new InvalidStateSnapshotError("Snapshot is not an object");
  const obj = parsed as Record<string, unknown>;
  if (obj["kind"] !== "state_snapshot") throw new InvalidStateSnapshotError("Snapshot kind mismatch");
  if (obj["schemaVersion"] !== SCHEMA_VERSION.stateSnapshot) {
    throw new InvalidStateSnapshotError(`Unsupported state snapshot version: ${String(obj["schemaVersion"])}`);
  }
  if (!("state" in obj)) throw new InvalidStateSnapshotError("Snapshot missing state");
  return parsed as StateSnapshotV1;
}

export function migrateStateSnapshot(snapshot: StateSnapshotV1, nowMonoMs: number = Date.now()): HydrationResult {
  const migrations: StateMigrationNote[] = [];
  const recovery: HydrationRecoveryNote[] = [];

  if (snapshot.schemaVersion !== SCHEMA_VERSION.stateSnapshot) {
    throw new InvalidStateSnapshotError(`Unsupported state snapshot schemaVersion: ${snapshot.schemaVersion}`);
  }

  if (snapshot.state.schemaVersion !== 1) {
    throw new InvalidStateSnapshotError(`Unsupported persisted app state version: ${snapshot.state.schemaVersion}`);
  }

  const recovered = recoverPersistedAppState(snapshot.state, nowMonoMs);
  for (const { sessionId, toolRunId } of recovered.report.cancelledToolRuns) {
    recovery.push({
      kind: "tool_run_cancelled",
      sessionId,
      entityId: toolRunId,
      message: "Cancelled in-flight tool run during crash recovery"
    });
  }
  for (const { sessionId, hookRunId } of recovered.report.cancelledHookRuns) {
    recovery.push({
      kind: "hook_run_cancelled",
      sessionId,
      entityId: hookRunId,
      message: "Cancelled in-flight hook run during crash recovery"
    });
  }

  return { persisted: recovered.persisted, migrations, recovery };
}

export async function loadStateSnapshot(
  storage: HostStorage,
  namespace: StorageNamespace,
  key: string = STATE_SNAPSHOT_STORAGE_KEY
): Promise<StateSnapshotV1 | null> {
  const found = await storage.get(namespace, key);
  if (!found) return null;
  return decodeStateSnapshot(found.value);
}

export async function saveStateSnapshot(
  storage: HostStorage,
  namespace: StorageNamespace,
  snapshot: StateSnapshotV1,
  key: string = STATE_SNAPSHOT_STORAGE_KEY,
  options?: { expectedVersion?: string | null }
): Promise<{ version: string }> {
  const encoded = encodeStateSnapshot(snapshot);
  const res = await storage.set(namespace, key, encoded, options);
  return res;
}

export async function safeHydratePersistedAppState(options: {
  storage: HostStorage;
  namespace: StorageNamespace;
  idSource: IdSource;
  clock: MonotonicClock;
  key?: string;
}): Promise<SafeHydrationResult> {
  const key = options.key ?? STATE_SNAPSHOT_STORAGE_KEY;
  try {
    const snapshot = await loadStateSnapshot(options.storage, options.namespace, key);
    if (!snapshot) {
      return {
        source: "empty",
        persisted: createEmptyPersistedAppState({ idSource: options.idSource, clock: options.clock }),
        migrations: [],
        recovery: []
      };
    }

    const migrated = migrateStateSnapshot(snapshot, options.clock.nowMs());
    return { source: "loaded", ...migrated };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      source: "reset",
      persisted: createEmptyPersistedAppState({ idSource: options.idSource, clock: options.clock }),
      migrations: [],
      recovery: [{ kind: "other", sessionId: "", entityId: "", message: `Failed to hydrate state snapshot: ${message}` }],
      error: message
    };
  }
}
