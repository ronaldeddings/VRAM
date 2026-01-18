export type OverlayKind =
  | "message-selector"
  | "sandbox-permission"
  | "tool-permission"
  | "worker-permission"
  | "worker-sandbox-permission"
  | "elicitation"
  | "cost"
  | "ide-onboarding";

export const OVERLAY_PRECEDENCE: readonly OverlayKind[] = [
  "message-selector",
  "sandbox-permission",
  "tool-permission",
  "worker-permission",
  "worker-sandbox-permission",
  "elicitation",
  "cost",
  "ide-onboarding"
] as const;

export type OverlaySelectionInputs = {
  exiting?: boolean;
  exitMessageActive?: boolean;
  messageSelectorOpen?: boolean;
  sandboxPermissionQueueLength?: number;
  pendingSandboxRequestActive?: boolean;
  toolPermissionActive?: boolean;
  workerPermissionQueueLength?: number;
  pendingWorkerRequestActive?: boolean;
  workerSandboxPermissionQueueLength?: number;
  elicitationQueueLength?: number;
  costNoticeActive?: boolean;
  ideOnboardingActive?: boolean;
};

export function selectActiveOverlay(inputs: OverlaySelectionInputs): OverlayKind | null {
  if (inputs.exiting || inputs.exitMessageActive) return null;
  if (inputs.messageSelectorOpen) return "message-selector";

  const hasSandboxPrompt = (inputs.sandboxPermissionQueueLength ?? 0) > 0 || inputs.pendingSandboxRequestActive === true;
  if (hasSandboxPrompt) return "sandbox-permission";

  if (inputs.toolPermissionActive) return "tool-permission";

  const hasWorkerPermission = (inputs.workerPermissionQueueLength ?? 0) > 0 || inputs.pendingWorkerRequestActive === true;
  if (hasWorkerPermission) return "worker-permission";

  if ((inputs.workerSandboxPermissionQueueLength ?? 0) > 0) return "worker-sandbox-permission";
  if ((inputs.elicitationQueueLength ?? 0) > 0) return "elicitation";
  if (inputs.costNoticeActive) return "cost";
  if (inputs.ideOnboardingActive) return "ide-onboarding";
  return null;
}

