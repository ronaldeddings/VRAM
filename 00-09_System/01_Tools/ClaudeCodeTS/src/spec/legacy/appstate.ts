export type LegacyNotificationPriority = "immediate" | "high" | "medium" | "low";

export type LegacyNotification = {
  key: string;
  text: string;
  priority: LegacyNotificationPriority;
  color?: string;
  timeoutMs?: number;
  invalidates?: string[];
};

export type LegacyOverlay =
  | "message-selector"
  | "sandbox-permission"
  | "tool-permission"
  | "worker-permission"
  | "worker-sandbox-permission"
  | "elicitation"
  | "cost"
  | "ide-onboarding";

export const LEGACY_OVERLAY_PRECEDENCE = [
  "message-selector",
  "sandbox-permission",
  "tool-permission",
  "worker-permission",
  "worker-sandbox-permission",
  "elicitation",
  "cost",
  "ide-onboarding"
] as const satisfies ReadonlyArray<LegacyOverlay>;

