import type { AppState, UiState } from "./state.js";
import { selectActiveOverlay } from "./overlays.js";

export function selectActiveSessionId(state: AppState): string | null {
  return state.persisted.activeSessionId ?? null;
}

export function selectActiveSession(state: AppState) {
  const id = state.persisted.activeSessionId;
  if (!id) return null;
  return state.persisted.sessions[id] ?? null;
}

export function selectOverlay(ui: UiState): ReturnType<typeof selectActiveOverlay> {
  return selectActiveOverlay({
    exiting: ui.exiting,
    exitMessageActive: ui.exitMessageActive,
    messageSelectorOpen: ui.messageSelectorOpen,
    sandboxPermissionQueueLength: ui.sandboxPermissions.queue.length,
    pendingSandboxRequestActive: ui.sandboxPermissions.pendingLeaderRequest !== null,
    toolPermissionActive: ui.toolPermission.active !== null,
    workerPermissionQueueLength: ui.workerPermissions.queue.length,
    pendingWorkerRequestActive: false,
    workerSandboxPermissionQueueLength: ui.workerSandboxPermissions.queue.length,
    elicitationQueueLength: ui.elicitation.queue.length,
    costNoticeActive: ui.costNoticeActive,
    ideOnboardingActive: ui.ideOnboardingActive
  });
}

