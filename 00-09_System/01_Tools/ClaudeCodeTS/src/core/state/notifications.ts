export type NotificationPriority = "immediate" | "high" | "medium" | "low";

export type Notification = {
  key: string;
  text: string;
  priority: NotificationPriority;
  color?: string;
  timeoutMs?: number;
  invalidates?: string[];
};

export type NotificationState = {
  current: Notification | null;
  queue: Notification[];
};

export const DEFAULT_NOTIFICATION_TIMEOUT_MS = 8000;

export type NotificationEffect =
  | { type: "effect/notification-cancel-timeout" }
  | { type: "effect/notification-schedule-timeout"; key: string; timeoutMs: number };

const priorityOrder: Record<NotificationPriority, number> = {
  immediate: 0,
  high: 1,
  medium: 2,
  low: 3
};

function sortByPriority(queue: Notification[]): Notification[] {
  return queue
    .map((notification, index) => ({ notification, index }))
    .sort((a, b) => {
      const pa = priorityOrder[a.notification.priority];
      const pb = priorityOrder[b.notification.priority];
      if (pa !== pb) return pa < pb ? -1 : 1;
      return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
    })
    .map((entry) => entry.notification);
}

function removeInvalidated(queue: Notification[], invalidates: readonly string[] | undefined): Notification[] {
  if (!invalidates || invalidates.length === 0) return queue;
  const invalidated = new Set(invalidates);
  return queue.filter((n) => !invalidated.has(n.key));
}

function dedupeByKey(queue: Notification[], key: string): Notification[] {
  return queue.filter((n) => n.key !== key);
}

export function drainNotifications(state: NotificationState): { state: NotificationState; effects: NotificationEffect[] } {
  if (state.current) return { state, effects: [] };
  if (state.queue.length === 0) return { state, effects: [] };

  const sorted = sortByPriority(state.queue);
  const next = sorted[0]!;
  const remaining = sorted.slice(1);
  const timeoutMs = next.timeoutMs ?? DEFAULT_NOTIFICATION_TIMEOUT_MS;
  return {
    state: { current: next, queue: remaining },
    effects: [{ type: "effect/notification-schedule-timeout", key: next.key, timeoutMs }]
  };
}

export function addNotification(state: NotificationState, notification: Notification): { state: NotificationState; effects: NotificationEffect[] } {
  const invalidates = notification.invalidates ?? [];

  if (notification.priority === "immediate") {
    const prevCurrent = state.current;
    const merged = [...(prevCurrent ? [prevCurrent] : []), ...state.queue];
    const filtered = removeInvalidated(
      merged.filter((n) => n.priority !== "immediate"),
      invalidates
    );

    const nextState: NotificationState = {
      current: notification,
      queue: dedupeByKey(filtered, notification.key)
    };

    const timeoutMs = notification.timeoutMs ?? DEFAULT_NOTIFICATION_TIMEOUT_MS;
    return {
      state: nextState,
      effects: [
        { type: "effect/notification-cancel-timeout" },
        { type: "effect/notification-schedule-timeout", key: notification.key, timeoutMs }
      ]
    };
  }

  const currentKey = state.current?.key ?? null;
  const alreadyQueued = state.queue.some((n) => n.key === notification.key);
  if (currentKey === notification.key || alreadyQueued) {
    const pruned = removeInvalidated(state.queue, invalidates);
    const drained = drainNotifications({ current: state.current, queue: pruned });
    return drained;
  }

  const pruned = removeInvalidated(state.queue, invalidates);
  const next = { current: state.current, queue: [...pruned, notification] };
  return drainNotifications(next);
}

export function expireCurrentNotification(
  state: NotificationState,
  key: string
): { state: NotificationState; effects: NotificationEffect[] } {
  if (!state.current || state.current.key !== key) return { state, effects: [] };

  const invalidates = state.current.invalidates ?? [];
  const pruned = removeInvalidated(state.queue.filter((n) => n.priority !== "immediate"), invalidates);
  const cleared: NotificationState = { current: null, queue: pruned };
  return drainNotifications(cleared);
}
