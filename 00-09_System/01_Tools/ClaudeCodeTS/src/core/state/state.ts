import type { IdSource } from "../runtime/ids.js";
import type { MonotonicClock } from "../runtime/clock.js";
import {
  asAppId,
  asSessionId,
  type AttachmentRefV1,
  type HookRunEntityV1,
  type McpConnectionEntityV1,
  type PersistedAppStateV1,
  type PersistedSessionStateV1,
  type SessionId,
  type SessionLifecycleState,
  type StateSnapshotV1,
  type ToolRunEntityV1,
  type TranscriptEventV1,
  type TranscriptLogV1
} from "../types/state.js";
import type { LongRunningTaskEntityV1 } from "../types/agents.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { CancellationReason } from "../types/runtime.js";
import type { HostEvent } from "../types/events.js";
import type { Notification, NotificationEffect, NotificationState } from "./notifications.js";
import { addNotification, expireCurrentNotification } from "./notifications.js";

export type SandboxHostPattern = { host: string; port?: number };

export type SandboxPermissionRequest = {
  requestId: string;
  hostPattern: SandboxHostPattern;
  createdAtMonoMs: number;
  origin: "local" | "worker" | "leader";
};

export type ToolPermissionRequest = {
  requestId: string;
  toolName: string;
  createdAtMonoMs: number;
  message?: string;
  rememberChoiceAllowed?: boolean;
  rememberChoiceKey?: string;
};

export type ElicitationRequest = {
  requestId: string;
  createdAtMonoMs: number;
  prompt: string;
  source: "mcp";
  concurrency: "serial" | "parallel";
};

export type WorkerPermissionQueueState = {
  queue: Array<{ requestId: string; createdAtMonoMs: number; message?: string }>;
  selectedIndex: number;
};

export type UiState = {
  notifications: NotificationState;
  sandboxPermissions: { queue: SandboxPermissionRequest[]; pendingLeaderRequest: { requestId: string; host: string } | null };
  toolPermission: { active: ToolPermissionRequest | null; queue: ToolPermissionRequest[] };
  workerPermissions: WorkerPermissionQueueState;
  workerSandboxPermissions: WorkerPermissionQueueState;
  elicitation: { queue: ElicitationRequest[] };
  messageSelectorOpen: boolean;
  costNoticeActive: boolean;
  ideOnboardingActive: boolean;
  exiting: boolean;
  exitMessageActive: boolean;
};

export type AppState = {
  persisted: PersistedAppStateV1;
  ui: UiState;
};

export type StateEffect =
  | NotificationEffect
  | { type: "effect/request-cancelled"; requestId: string; kind: "elicitation" | "tool-permission" | "sandbox-permission" | "worker-permission" | "worker-sandbox-permission"; reason: CancellationReason }
  | { type: "effect/elicitation-cancelled"; requestId: string; reason: CancellationReason }
  | { type: "effect/elicitation-responded"; requestId: string; response: string }
  | {
      type: "effect/tool-permission-decided";
      requestId: string;
      toolName: string;
      decision: "allow" | "deny";
      remember?: boolean;
      rememberChoiceKey?: string;
    }
  | {
      type: "effect/sandbox-permission-decided";
      requestId: string;
      hostPattern: SandboxHostPattern;
      decision: "allow" | "deny";
      remember?: boolean;
    }
  | { type: "effect/worker-permission-decided"; requestId: string; decision: "allow" | "deny"; remember?: boolean }
  | { type: "effect/worker-sandbox-permission-decided"; requestId: string; decision: "allow" | "deny"; remember?: boolean };

export type StateUiEvent = { type: "ui/state-changed"; actionType: StateAction["type"] };

export type StateAction =
  | { type: "app/restore-persisted"; persisted: PersistedAppStateV1 }
  | { type: "app/session-created"; session: PersistedSessionStateV1 }
  | { type: "app/session-lifecycle-set"; sessionId: SessionId; lifecycle: SessionLifecycleState; tsMonoMs: number; error?: string }
  | { type: "app/task/upsert"; task: LongRunningTaskEntityV1; tsMonoMs: number }
  | { type: "app/task/remove"; taskId: string; tsMonoMs: number }
  | { type: "session/transcript/append-event"; sessionId: SessionId; event: TranscriptEventV1; tsMonoMs: number }
  | { type: "session/transcript/set-bounded"; sessionId: SessionId; bounded: TranscriptLogV1["bounded"]; tsMonoMs: number }
  | { type: "session/attachment/upsert"; sessionId: SessionId; attachment: AttachmentRefV1; tsMonoMs: number }
  | { type: "session/tool-run/upsert"; sessionId: SessionId; toolRun: ToolRunEntityV1; tsMonoMs: number }
  | { type: "session/hook-run/upsert"; sessionId: SessionId; hookRun: HookRunEntityV1; tsMonoMs: number }
  | { type: "session/mcp-connection/upsert"; sessionId: SessionId; connection: McpConnectionEntityV1; tsMonoMs: number }
  | { type: "ui/notification/add"; notification: Notification }
  | { type: "ui/notification/expired"; key: string }
  | { type: "ui/sandbox-permission/enqueue"; request: SandboxPermissionRequest }
  | { type: "ui/sandbox-permission/dequeue"; requestId: string }
  | { type: "ui/sandbox-permission/set-pending-leader"; pending: { requestId: string; host: string } | null }
  | { type: "ui/sandbox-permission/resolve"; requestId: string; decision: "allow" | "deny"; remember?: boolean }
  | { type: "ui/tool-permission/set-active"; active: ToolPermissionRequest | null }
  | { type: "ui/tool-permission/enqueue"; request: ToolPermissionRequest }
  | { type: "ui/tool-permission/resolve"; requestId: string; decision: "allow" | "deny"; remember?: boolean }
  | { type: "ui/worker-permissions/enqueue"; request: { requestId: string; createdAtMonoMs: number; message?: string } }
  | { type: "ui/worker-permissions/dequeue"; requestId: string }
  | { type: "ui/worker-permissions/set-selected-index"; selectedIndex: number }
  | { type: "ui/worker-permissions/resolve"; requestId: string; decision: "allow" | "deny"; remember?: boolean }
  | { type: "ui/worker-sandbox-permissions/enqueue"; request: { requestId: string; createdAtMonoMs: number; message?: string } }
  | { type: "ui/worker-sandbox-permissions/dequeue"; requestId: string }
  | { type: "ui/worker-sandbox-permissions/set-selected-index"; selectedIndex: number }
  | { type: "ui/worker-sandbox-permissions/resolve"; requestId: string; decision: "allow" | "deny"; remember?: boolean }
  | { type: "ui/elicitation/enqueue"; request: ElicitationRequest }
  | { type: "ui/elicitation/dequeue"; requestId: string }
  | { type: "ui/elicitation/respond"; requestId: string; response: string }
  | { type: "ui/elicitation/cancel"; requestId: string; reason: CancellationReason }
  | { type: "ui/elicitation/clear" }
  | { type: "ui/queues/clear"; reason: CancellationReason }
  | { type: "ui/message-selector/set-open"; open: boolean }
  | { type: "ui/cost-notice/set-active"; active: boolean }
  | { type: "ui/ide-onboarding/set-active"; active: boolean }
  | { type: "ui/exit/set"; exiting: boolean; exitMessageActive?: boolean };

export type StateCommand =
  | { type: "cmd/create-session"; sessionId?: SessionId; activate?: boolean; nowMonoMs?: number }
  | { type: "cmd/host-event"; event: HostEvent; nowMonoMs?: number }
  | { type: "cmd/restore-from-snapshot"; snapshot: StateSnapshotV1 };

export function createEmptyTranscriptLog(nowMonoMs: number): TranscriptLogV1 {
  return { schemaVersion: 1, events: [] };
}

export function createEmptyUiState(): UiState {
  return {
    notifications: { current: null, queue: [] },
    sandboxPermissions: { queue: [], pendingLeaderRequest: null },
    toolPermission: { active: null, queue: [] },
    workerPermissions: { queue: [], selectedIndex: 0 },
    workerSandboxPermissions: { queue: [], selectedIndex: 0 },
    elicitation: { queue: [] },
    messageSelectorOpen: false,
    costNoticeActive: false,
    ideOnboardingActive: false,
    exiting: false,
    exitMessageActive: false
  };
}

export function createEmptyPersistedAppState(options: { idSource: IdSource; clock: MonotonicClock }): PersistedAppStateV1 {
  const now = options.clock.nowMs();
  return {
    schemaVersion: 1,
    appId: asAppId(options.idSource.nextId("app")),
    createdAtMonoMs: now,
    updatedAtMonoMs: now,
    sessions: {},
    tasks: {}
  };
}

export function createAppState(options: { idSource: IdSource; clock: MonotonicClock }): AppState {
  return { persisted: createEmptyPersistedAppState(options), ui: createEmptyUiState() };
}

export function createStateSnapshot(persisted: PersistedAppStateV1): StateSnapshotV1 {
  return { kind: "state_snapshot", schemaVersion: SCHEMA_VERSION.stateSnapshot, state: persisted };
}

export type CrashRecoveryReport = {
  cancelledToolRuns: Array<{ sessionId: SessionId; toolRunId: string }>;
  cancelledHookRuns: Array<{ sessionId: SessionId; hookRunId: string }>;
};

export function recoverPersistedAppState(
  persisted: PersistedAppStateV1,
  nowMonoMs: number
): { persisted: PersistedAppStateV1; report: CrashRecoveryReport } {
  const report: CrashRecoveryReport = { cancelledToolRuns: [], cancelledHookRuns: [] };
  const nextSessions: Record<string, PersistedSessionStateV1> = {};

  const crashCancel: CancellationReason = { kind: "unknown", message: "Recovered from crash (tool/hook run left in-flight)" };

  for (const [sessionKey, session] of Object.entries(persisted.sessions)) {
    const nextToolRuns: typeof session.toolRuns = {};
    for (const [id, run] of Object.entries(session.toolRuns)) {
      if (run.status === "running" || run.status === "created") {
        nextToolRuns[id] = { ...run, status: "cancelled", cancelled: crashCancel, endedAtMonoMs: nowMonoMs };
        report.cancelledToolRuns.push({ sessionId: session.id, toolRunId: id });
      } else {
        nextToolRuns[id] = run;
      }
    }

    const nextHookRuns: typeof session.hookRuns = {};
    for (const [id, run] of Object.entries(session.hookRuns)) {
      if (run.status === "running" || run.status === "created") {
        nextHookRuns[id] = { ...run, status: "cancelled", cancelled: crashCancel, endedAtMonoMs: nowMonoMs };
        report.cancelledHookRuns.push({ sessionId: session.id, hookRunId: id });
      } else {
        nextHookRuns[id] = run;
      }
    }

    nextSessions[sessionKey] = {
      ...session,
      toolRuns: nextToolRuns,
      hookRuns: nextHookRuns,
      updatedAtMonoMs: nowMonoMs
    };
  }

  return {
    persisted: { ...persisted, sessions: nextSessions, tasks: persisted.tasks ?? {}, updatedAtMonoMs: nowMonoMs },
    report
  };
}

function updatePersistedSession(
  persisted: PersistedAppStateV1,
  sessionId: SessionId,
  tsMonoMs: number,
  update: (session: PersistedSessionStateV1) => PersistedSessionStateV1
): PersistedAppStateV1 | null {
  const session = persisted.sessions[sessionId];
  if (!session) return null;
  const nextSession = update(session);
  const nextSessions = { ...persisted.sessions, [sessionId]: nextSession };
  return {
    ...persisted,
    sessions: nextSessions,
    updatedAtMonoMs: Math.max(persisted.updatedAtMonoMs, tsMonoMs)
  };
}

function setTranscriptBounded(log: TranscriptLogV1, bounded: TranscriptLogV1["bounded"]): TranscriptLogV1 {
  if (bounded) return { ...log, bounded };
  const { bounded: _removed, ...rest } = log;
  return rest;
}

export function reduceAppState(state: AppState, action: StateAction): { state: AppState; effects: StateEffect[]; events: StateUiEvent[] } {
  switch (action.type) {
    case "app/restore-persisted": {
      const next: AppState = { persisted: action.persisted, ui: createEmptyUiState() };
      return { state: next, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "app/session-created": {
      const sessions = { ...state.persisted.sessions, [action.session.id]: action.session };
      const nextPersisted: PersistedAppStateV1 = {
        ...state.persisted,
        sessions,
        activeSessionId: state.persisted.activeSessionId ?? action.session.id,
        updatedAtMonoMs: Math.max(state.persisted.updatedAtMonoMs, action.session.updatedAtMonoMs)
      };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "app/session-lifecycle-set": {
      const session = state.persisted.sessions[action.sessionId];
      if (!session) return { state, effects: [], events: [] };
      const nextSessionBase: PersistedSessionStateV1 = {
        ...session,
        lifecycle: action.lifecycle,
        updatedAtMonoMs: action.tsMonoMs,
        ...(action.lifecycle === "ended" ? { endedAtMonoMs: action.tsMonoMs } : {}),
        ...(action.lifecycle === "error" ? { error: action.error ?? session.error ?? "Session error" } : {})
      };

      const nextSessions: Record<string, PersistedSessionStateV1> = { ...state.persisted.sessions };
      if (action.lifecycle === "active") {
        for (const [id, other] of Object.entries(nextSessions)) {
          if (id === action.sessionId) continue;
          if (other.lifecycle === "active") {
            nextSessions[id] = { ...other, lifecycle: "paused", updatedAtMonoMs: action.tsMonoMs };
          }
        }
      }
      nextSessions[action.sessionId] = nextSessionBase;

      const nextPersisted: PersistedAppStateV1 = {
        ...state.persisted,
        sessions: nextSessions,
        updatedAtMonoMs: Math.max(state.persisted.updatedAtMonoMs, action.tsMonoMs)
      };
      if (action.lifecycle === "active") nextPersisted.activeSessionId = action.sessionId;
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "app/task/upsert": {
      const tasks = { ...(state.persisted.tasks ?? {}), [action.task.id]: action.task };
      const nextPersisted: PersistedAppStateV1 = { ...state.persisted, tasks, updatedAtMonoMs: Math.max(state.persisted.updatedAtMonoMs, action.tsMonoMs) };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "app/task/remove": {
      const existing = state.persisted.tasks ?? {};
      if (!(action.taskId in existing)) return { state, effects: [], events: [] };
      const { [action.taskId]: _removed, ...rest } = existing;
      const nextPersisted: PersistedAppStateV1 = { ...state.persisted, tasks: rest, updatedAtMonoMs: Math.max(state.persisted.updatedAtMonoMs, action.tsMonoMs) };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "session/transcript/append-event": {
      const nextPersisted = updatePersistedSession(state.persisted, action.sessionId, action.tsMonoMs, (sess) => ({
        ...sess,
        transcript: { ...sess.transcript, events: [...sess.transcript.events, action.event] },
        updatedAtMonoMs: action.tsMonoMs
      }));
      if (!nextPersisted) return { state, effects: [], events: [] };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "session/transcript/set-bounded": {
      const nextPersisted = updatePersistedSession(state.persisted, action.sessionId, action.tsMonoMs, (sess) => ({
        ...sess,
        transcript: setTranscriptBounded(sess.transcript, action.bounded),
        updatedAtMonoMs: action.tsMonoMs
      }));
      if (!nextPersisted) return { state, effects: [], events: [] };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "session/attachment/upsert": {
      const nextPersisted = updatePersistedSession(state.persisted, action.sessionId, action.tsMonoMs, (sess) => ({
        ...sess,
        attachments: { ...sess.attachments, [action.attachment.id]: action.attachment },
        updatedAtMonoMs: action.tsMonoMs
      }));
      if (!nextPersisted) return { state, effects: [], events: [] };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "session/tool-run/upsert": {
      const nextPersisted = updatePersistedSession(state.persisted, action.sessionId, action.tsMonoMs, (sess) => ({
        ...sess,
        toolRuns: { ...sess.toolRuns, [action.toolRun.id]: action.toolRun },
        updatedAtMonoMs: action.tsMonoMs
      }));
      if (!nextPersisted) return { state, effects: [], events: [] };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "session/hook-run/upsert": {
      const nextPersisted = updatePersistedSession(state.persisted, action.sessionId, action.tsMonoMs, (sess) => ({
        ...sess,
        hookRuns: { ...sess.hookRuns, [action.hookRun.id]: action.hookRun },
        updatedAtMonoMs: action.tsMonoMs
      }));
      if (!nextPersisted) return { state, effects: [], events: [] };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "session/mcp-connection/upsert": {
      const nextPersisted = updatePersistedSession(state.persisted, action.sessionId, action.tsMonoMs, (sess) => ({
        ...sess,
        mcpConnections: { ...sess.mcpConnections, [action.connection.id]: action.connection },
        updatedAtMonoMs: action.tsMonoMs
      }));
      if (!nextPersisted) return { state, effects: [], events: [] };
      return { state: { ...state, persisted: nextPersisted }, effects: [], events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "ui/notification/add": {
      const { state: nextNotif, effects } = addNotification(state.ui.notifications, action.notification);
      return { state: { ...state, ui: { ...state.ui, notifications: nextNotif } }, effects, events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "ui/notification/expired": {
      const { state: nextNotif, effects } = expireCurrentNotification(state.ui.notifications, action.key);
      return { state: { ...state, ui: { ...state.ui, notifications: nextNotif } }, effects, events: [{ type: "ui/state-changed", actionType: action.type }] };
    }
    case "ui/sandbox-permission/enqueue": {
      return {
        state: { ...state, ui: { ...state.ui, sandboxPermissions: { ...state.ui.sandboxPermissions, queue: [...state.ui.sandboxPermissions.queue, action.request] } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/sandbox-permission/dequeue": {
      const nextQueue = state.ui.sandboxPermissions.queue.filter((r) => r.requestId !== action.requestId);
      return {
        state: { ...state, ui: { ...state.ui, sandboxPermissions: { ...state.ui.sandboxPermissions, queue: nextQueue } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/sandbox-permission/set-pending-leader": {
      return {
        state: { ...state, ui: { ...state.ui, sandboxPermissions: { ...state.ui.sandboxPermissions, pendingLeaderRequest: action.pending } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/sandbox-permission/resolve": {
      const req = state.ui.sandboxPermissions.queue.find((r) => r.requestId === action.requestId) ?? null;
      const nextQueue = state.ui.sandboxPermissions.queue.filter((r) => r.requestId !== action.requestId);
      const effects: StateEffect[] = [];
      if (req) {
        effects.push({
          type: "effect/sandbox-permission-decided",
          requestId: req.requestId,
          hostPattern: req.hostPattern,
          decision: action.decision,
          ...(action.remember !== undefined ? { remember: action.remember } : {})
        });
      }
      return {
        state: { ...state, ui: { ...state.ui, sandboxPermissions: { ...state.ui.sandboxPermissions, queue: nextQueue } } },
        effects,
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/tool-permission/set-active": {
      return {
        state: { ...state, ui: { ...state.ui, toolPermission: { ...state.ui.toolPermission, active: action.active } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/tool-permission/enqueue": {
      if (state.ui.toolPermission.active === null) {
        return {
          state: { ...state, ui: { ...state.ui, toolPermission: { ...state.ui.toolPermission, active: action.request } } },
          effects: [],
          events: [{ type: "ui/state-changed", actionType: action.type }]
        };
      }
      return {
        state: { ...state, ui: { ...state.ui, toolPermission: { ...state.ui.toolPermission, queue: [...state.ui.toolPermission.queue, action.request] } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/tool-permission/resolve": {
      const active = state.ui.toolPermission.active;
      const isActive = active?.requestId === action.requestId;
      const effects: StateEffect[] = [];

      let nextActive = state.ui.toolPermission.active;
      let nextQueue = state.ui.toolPermission.queue;
      if (isActive) {
        const remember = action.remember === true && active?.rememberChoiceAllowed === true;
        effects.push({
          type: "effect/tool-permission-decided",
          requestId: action.requestId,
          toolName: active.toolName,
          decision: action.decision,
          ...(remember ? { remember: true } : {}),
          ...(remember ? { rememberChoiceKey: active.rememberChoiceKey } : {})
        });

        const [next, ...rest] = state.ui.toolPermission.queue;
        nextActive = next ?? null;
        nextQueue = rest;
      }

      return {
        state: { ...state, ui: { ...state.ui, toolPermission: { active: nextActive, queue: nextQueue } } },
        effects,
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-permissions/enqueue": {
      const queue = [...state.ui.workerPermissions.queue, action.request];
      return {
        state: { ...state, ui: { ...state.ui, workerPermissions: { ...state.ui.workerPermissions, queue } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-permissions/dequeue": {
      const queue = state.ui.workerPermissions.queue.filter((r) => r.requestId !== action.requestId);
      const selectedIndex = Math.min(state.ui.workerPermissions.selectedIndex, Math.max(0, queue.length - 1));
      return {
        state: { ...state, ui: { ...state.ui, workerPermissions: { queue, selectedIndex } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-permissions/set-selected-index": {
      const clamped = Math.max(0, Math.min(action.selectedIndex, Math.max(0, state.ui.workerPermissions.queue.length - 1)));
      return {
        state: { ...state, ui: { ...state.ui, workerPermissions: { ...state.ui.workerPermissions, selectedIndex: clamped } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-permissions/resolve": {
      const queue = state.ui.workerPermissions.queue.filter((r) => r.requestId !== action.requestId);
      const selectedIndex = Math.min(state.ui.workerPermissions.selectedIndex, Math.max(0, queue.length - 1));
      return {
        state: { ...state, ui: { ...state.ui, workerPermissions: { queue, selectedIndex } } },
        effects: [
          {
            type: "effect/worker-permission-decided",
            requestId: action.requestId,
            decision: action.decision,
            ...(action.remember !== undefined ? { remember: action.remember } : {})
          }
        ],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-sandbox-permissions/enqueue": {
      const queue = [...state.ui.workerSandboxPermissions.queue, action.request];
      return {
        state: { ...state, ui: { ...state.ui, workerSandboxPermissions: { ...state.ui.workerSandboxPermissions, queue } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-sandbox-permissions/dequeue": {
      const queue = state.ui.workerSandboxPermissions.queue.filter((r) => r.requestId !== action.requestId);
      const selectedIndex = Math.min(state.ui.workerSandboxPermissions.selectedIndex, Math.max(0, queue.length - 1));
      return {
        state: { ...state, ui: { ...state.ui, workerSandboxPermissions: { queue, selectedIndex } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-sandbox-permissions/set-selected-index": {
      const clamped = Math.max(0, Math.min(action.selectedIndex, Math.max(0, state.ui.workerSandboxPermissions.queue.length - 1)));
      return {
        state: { ...state, ui: { ...state.ui, workerSandboxPermissions: { ...state.ui.workerSandboxPermissions, selectedIndex: clamped } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/worker-sandbox-permissions/resolve": {
      const queue = state.ui.workerSandboxPermissions.queue.filter((r) => r.requestId !== action.requestId);
      const selectedIndex = Math.min(state.ui.workerSandboxPermissions.selectedIndex, Math.max(0, queue.length - 1));
      return {
        state: { ...state, ui: { ...state.ui, workerSandboxPermissions: { queue, selectedIndex } } },
        effects: [
          {
            type: "effect/worker-sandbox-permission-decided",
            requestId: action.requestId,
            decision: action.decision,
            ...(action.remember !== undefined ? { remember: action.remember } : {})
          }
        ],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/elicitation/enqueue": {
      const queue = [...state.ui.elicitation.queue, action.request];
      return {
        state: { ...state, ui: { ...state.ui, elicitation: { queue } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/elicitation/dequeue": {
      const queue = state.ui.elicitation.queue.filter((r) => r.requestId !== action.requestId);
      return {
        state: { ...state, ui: { ...state.ui, elicitation: { queue } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/elicitation/respond": {
      const req = state.ui.elicitation.queue.find((r) => r.requestId === action.requestId) ?? null;
      const queue = state.ui.elicitation.queue.filter((r) => r.requestId !== action.requestId);
      const effects: StateEffect[] = [];
      if (req) effects.push({ type: "effect/elicitation-responded", requestId: action.requestId, response: action.response });
      return {
        state: { ...state, ui: { ...state.ui, elicitation: { queue } } },
        effects,
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/elicitation/cancel": {
      const queue = state.ui.elicitation.queue.filter((r) => r.requestId !== action.requestId);
      return {
        state: { ...state, ui: { ...state.ui, elicitation: { queue } } },
        effects: [
          { type: "effect/request-cancelled", requestId: action.requestId, kind: "elicitation", reason: action.reason },
          { type: "effect/elicitation-cancelled", requestId: action.requestId, reason: action.reason }
        ],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/elicitation/clear": {
      return {
        state: { ...state, ui: { ...state.ui, elicitation: { queue: [] } } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/queues/clear": {
      const effects: StateEffect[] = [];

      for (const r of state.ui.sandboxPermissions.queue) {
        effects.push({ type: "effect/request-cancelled", requestId: r.requestId, kind: "sandbox-permission", reason: action.reason });
      }

      if (state.ui.toolPermission.active) {
        effects.push({ type: "effect/request-cancelled", requestId: state.ui.toolPermission.active.requestId, kind: "tool-permission", reason: action.reason });
      }
      for (const r of state.ui.toolPermission.queue) {
        effects.push({ type: "effect/request-cancelled", requestId: r.requestId, kind: "tool-permission", reason: action.reason });
      }

      for (const r of state.ui.workerPermissions.queue) {
        effects.push({ type: "effect/request-cancelled", requestId: r.requestId, kind: "worker-permission", reason: action.reason });
      }
      for (const r of state.ui.workerSandboxPermissions.queue) {
        effects.push({ type: "effect/request-cancelled", requestId: r.requestId, kind: "worker-sandbox-permission", reason: action.reason });
      }
      for (const r of state.ui.elicitation.queue) {
        effects.push({ type: "effect/request-cancelled", requestId: r.requestId, kind: "elicitation", reason: action.reason });
      }

      return {
        state: {
          ...state,
          ui: {
            ...state.ui,
            sandboxPermissions: { queue: [], pendingLeaderRequest: null },
            toolPermission: { active: null, queue: [] },
            workerPermissions: { queue: [], selectedIndex: 0 },
            workerSandboxPermissions: { queue: [], selectedIndex: 0 },
            elicitation: { queue: [] },
            messageSelectorOpen: false
          }
        },
        effects,
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/message-selector/set-open": {
      return {
        state: { ...state, ui: { ...state.ui, messageSelectorOpen: action.open } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/cost-notice/set-active": {
      return {
        state: { ...state, ui: { ...state.ui, costNoticeActive: action.active } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/ide-onboarding/set-active": {
      return {
        state: { ...state, ui: { ...state.ui, ideOnboardingActive: action.active } },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
    case "ui/exit/set": {
      return {
        state: {
          ...state,
          ui: {
            ...state.ui,
            exiting: action.exiting,
            exitMessageActive: action.exitMessageActive ?? state.ui.exitMessageActive
          }
        },
        effects: [],
        events: [{ type: "ui/state-changed", actionType: action.type }]
      };
    }
  }
}

export function commandToActions(
  state: AppState,
  command: StateCommand,
  deps: { idSource: IdSource; clock: MonotonicClock }
): StateAction[] {
  switch (command.type) {
    case "cmd/create-session": {
      const sessionId = command.sessionId ?? asSessionId(deps.idSource.nextId("sess"));
      const now = command.nowMonoMs ?? deps.clock.nowMs();
      const session: PersistedSessionStateV1 = {
        schemaVersion: 1,
        id: sessionId,
        lifecycle: "created",
        mode: "live",
        createdAtMonoMs: now,
        updatedAtMonoMs: now,
        transcript: createEmptyTranscriptLog(now),
        attachments: {},
        toolRuns: {},
        hookRuns: {},
        mcpConnections: {}
      };
      const actions: StateAction[] = [{ type: "app/session-created", session }];
      if (command.activate) actions.push({ type: "app/session-lifecycle-set", sessionId, lifecycle: "active", tsMonoMs: now });
      return actions;
    }
    case "cmd/host-event": {
      const now = command.nowMonoMs ?? deps.clock.nowMs();
      if (command.event.type === "host/backgrounded") {
        return [{ type: "ui/queues/clear", reason: { kind: "host_lifecycle", event: "backgrounded", message: "host backgrounded" } }];
      }
      if (command.event.type === "host/stop") {
        return [{ type: "ui/queues/clear", reason: { kind: "host_lifecycle", event: "stop", message: "host stop" } }];
      }
      if (command.event.type === "host/cancel") {
        const requestId = command.event.requestId;
        if (!requestId) return [];
        return [{ type: "ui/elicitation/cancel", requestId, reason: { kind: "user_cancel", message: "cancel request" } }];
      }
      if (command.event.type === "host/user-input") {
        const text = command.event.text;
        if (!text || !text.trim()) return [];

        const actions: StateAction[] = [];
        const activeId = state.persisted.activeSessionId;
        const activeSession = activeId ? state.persisted.sessions[activeId] ?? null : null;
        const sessionId = activeSession ? activeSession.id : asSessionId(deps.idSource.nextId("sess"));
        if (!activeSession) {
          const session: PersistedSessionStateV1 = {
            schemaVersion: 1,
            id: sessionId,
            lifecycle: "created",
            mode: "live",
            createdAtMonoMs: now,
            updatedAtMonoMs: now,
            transcript: createEmptyTranscriptLog(now),
            attachments: {},
            toolRuns: {},
            hookRuns: {},
            mcpConnections: {}
          };
          actions.push({ type: "app/session-created", session });
          actions.push({ type: "app/session-lifecycle-set", sessionId, lifecycle: "active", tsMonoMs: now });
        }

        actions.push({
          type: "session/transcript/append-event",
          sessionId,
          tsMonoMs: now,
          event: { id: deps.idSource.nextId("evt"), tsMonoMs: now, type: "message", role: "user", content: text, sensitivity: "public" }
        });
        return actions;
      }
      void now;
      return [];
    }
    case "cmd/restore-from-snapshot": {
      const recovered = recoverPersistedAppState(command.snapshot.state, deps.clock.nowMs());
      return [{ type: "app/restore-persisted", persisted: recovered.persisted }];
    }
  }
}
