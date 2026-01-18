// Notifier - Notification triggers and delivery system
// Phase 8.2: Notifications

import { config } from "../utils/config";
import { logger } from "../utils/logger";

// Notification types
export type NotificationType =
  | "urgent_opportunity"
  | "action_required"
  | "insight_confirmed"
  | "system_alert"
  | "daily_summary"
  | "weekly_report"
  | "relationship_alert"
  | "revenue_signal"
  | "deadline_approaching"
  | "follow_up_reminder";

// Notification priority
export type NotificationPriority = "critical" | "high" | "medium" | "low";

// Notification channel
export type NotificationChannel = "console" | "file" | "webhook" | "email";

// Notification entry
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  details?: Record<string, unknown>;
  source: {
    module: string;
    itemId?: string;
    itemType?: string;
  };
  channels: NotificationChannel[];
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  dismissed: boolean;
}

// Notification preferences
export interface NotificationPreferences {
  enabled: boolean;
  channels: NotificationChannel[];
  priorityThreshold: NotificationPriority;
  quietHours: {
    enabled: boolean;
    start: number; // Hour 0-23
    end: number; // Hour 0-23
  };
  typePreferences: Record<NotificationType, boolean>;
  webhookUrl?: string;
  emailAddress?: string;
}

// Notification trigger rule
export interface TriggerRule {
  name: string;
  type: NotificationType;
  condition: (data: Record<string, unknown>) => boolean;
  priority: NotificationPriority;
  template: (data: Record<string, unknown>) => { title: string; message: string };
}

// Default preferences
const defaultPreferences: NotificationPreferences = {
  enabled: true,
  channels: ["console", "file"],
  priorityThreshold: "medium",
  quietHours: {
    enabled: true,
    start: 22, // 10 PM
    end: 7, // 7 AM
  },
  typePreferences: {
    urgent_opportunity: true,
    action_required: true,
    insight_confirmed: true,
    system_alert: true,
    daily_summary: true,
    weekly_report: true,
    relationship_alert: true,
    revenue_signal: true,
    deadline_approaching: true,
    follow_up_reminder: true,
  },
};

// Built-in trigger rules
const triggerRules: TriggerRule[] = [
  {
    name: "urgent_opportunity_detected",
    type: "urgent_opportunity",
    condition: (data) =>
      data.urgency === "immediate" &&
      (data.estimatedValue as number) >= 10000,
    priority: "critical",
    template: (data) => ({
      title: `Urgent Opportunity: ${data.title}`,
      message: `High-value opportunity detected: ${data.description}\nEstimated value: $${data.estimatedValue}`,
    }),
  },
  {
    name: "action_deadline_approaching",
    type: "deadline_approaching",
    condition: (data) => {
      if (!data.deadline) return false;
      const deadline = new Date(data.deadline as string);
      const now = new Date();
      const hoursUntil = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntil <= 24 && hoursUntil > 0;
    },
    priority: "high",
    template: (data) => ({
      title: `Deadline Approaching: ${data.title}`,
      message: `Action item due within 24 hours: ${data.description}`,
    }),
  },
  {
    name: "relationship_needs_attention",
    type: "relationship_alert",
    condition: (data) =>
      (data.daysSinceContact as number) >= 30 &&
      data.relationshipType === "high_value",
    priority: "medium",
    template: (data) => ({
      title: `Relationship Alert: ${data.contactName}`,
      message: `No contact in ${data.daysSinceContact} days with ${data.contactName}. Consider reaching out.`,
    }),
  },
  {
    name: "revenue_opportunity_signal",
    type: "revenue_signal",
    condition: (data) =>
      data.signalType === "buying_intent" ||
      data.signalType === "budget_mention" ||
      data.signalType === "expansion_discussion",
    priority: "high",
    template: (data) => ({
      title: `Revenue Signal: ${data.source}`,
      message: `${data.signalType} detected: ${data.details}`,
    }),
  },
  {
    name: "system_error_alert",
    type: "system_alert",
    condition: (data) =>
      data.errorCount >= 3 || data.severity === "critical",
    priority: "critical",
    template: (data) => ({
      title: `System Alert: ${data.component}`,
      message: `Error detected: ${data.errorMessage}\nOccurrences: ${data.errorCount}`,
    }),
  },
  {
    name: "insight_validated",
    type: "insight_confirmed",
    condition: (data) =>
      data.validationStatus === "confirmed" &&
      (data.confidence as number) >= 0.9,
    priority: "medium",
    template: (data) => ({
      title: `Insight Confirmed: ${data.category}`,
      message: `High-confidence insight validated: ${data.summary}`,
    }),
  },
  {
    name: "follow_up_overdue",
    type: "follow_up_reminder",
    condition: (data) => {
      if (!data.followUpDate) return false;
      const followUpDate = new Date(data.followUpDate as string);
      const now = new Date();
      return followUpDate < now;
    },
    priority: "medium",
    template: (data) => ({
      title: `Follow-up Overdue: ${data.contactName}`,
      message: `Scheduled follow-up with ${data.contactName} is overdue. Topic: ${data.topic}`,
    }),
  },
];

class Notifier {
  private statePath: string;
  private notificationsPath: string;
  private preferencesPath: string;
  private preferences: NotificationPreferences;

  constructor() {
    this.statePath = config.statePath;
    this.notificationsPath = `${config.statePath}/notifications.json`;
    this.preferencesPath = `${config.statePath}/notification-preferences.json`;
    this.preferences = defaultPreferences;
  }

  // Initialize and load preferences
  async initialize(): Promise<void> {
    this.preferences = await this.loadPreferences();
  }

  // Check trigger rules and create notifications
  async checkTriggers(
    data: Record<string, unknown>,
    module: string,
    itemId?: string,
    itemType?: string
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const rule of triggerRules) {
      try {
        if (rule.condition(data)) {
          const { title, message } = rule.template(data);
          const notification = await this.createNotification({
            type: rule.type,
            priority: rule.priority,
            title,
            message,
            details: data,
            source: { module, itemId, itemType },
          });

          if (notification) {
            notifications.push(notification);
          }
        }
      } catch (error) {
        // Rule evaluation failed, skip
        await logger.warn("notification_rule_error", {
          rule: rule.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return notifications;
  }

  // Create a notification
  async createNotification(params: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    details?: Record<string, unknown>;
    source: {
      module: string;
      itemId?: string;
      itemType?: string;
    };
  }): Promise<Notification | null> {
    // Check if notifications are enabled
    if (!this.preferences.enabled) {
      return null;
    }

    // Check type preference
    if (!this.preferences.typePreferences[params.type]) {
      return null;
    }

    // Check priority threshold
    if (!this.meetsPriorityThreshold(params.priority)) {
      return null;
    }

    // Check quiet hours (except for critical)
    if (params.priority !== "critical" && this.isQuietHours()) {
      // Queue for later delivery
      return this.queueNotification(params);
    }

    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: params.type,
      priority: params.priority,
      title: params.title,
      message: params.message,
      details: params.details,
      source: params.source,
      channels: this.preferences.channels,
      createdAt: new Date().toISOString(),
      dismissed: false,
    };

    // Deliver notification
    await this.deliverNotification(notification);

    // Save notification
    await this.saveNotification(notification);

    return notification;
  }

  // Deliver notification to all configured channels
  private async deliverNotification(notification: Notification): Promise<void> {
    for (const channel of notification.channels) {
      try {
        switch (channel) {
          case "console":
            await this.deliverToConsole(notification);
            break;
          case "file":
            await this.deliverToFile(notification);
            break;
          case "webhook":
            await this.deliverToWebhook(notification);
            break;
          case "email":
            // Email delivery would require external service integration
            await logger.info("email_notification_skipped", {
              notificationId: notification.id,
              reason: "Email delivery not yet implemented",
            });
            break;
        }
      } catch (error) {
        await logger.error("notification_delivery_error", {
          channel,
          notificationId: notification.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    notification.deliveredAt = new Date().toISOString();
  }

  // Deliver to console
  private async deliverToConsole(notification: Notification): Promise<void> {
    const priorityEmoji = {
      critical: "🚨",
      high: "⚠️",
      medium: "ℹ️",
      low: "📝",
    };

    const emoji = priorityEmoji[notification.priority];
    console.log(`\n${emoji} [${notification.priority.toUpperCase()}] ${notification.title}`);
    console.log(`   ${notification.message}`);
    console.log(`   Source: ${notification.source.module}`);
    console.log(`   Time: ${notification.createdAt}\n`);
  }

  // Deliver to file
  private async deliverToFile(notification: Notification): Promise<void> {
    const notificationLogPath = `${config.logsPath}/notifications.log`;
    const logEntry = {
      ...notification,
      loggedAt: new Date().toISOString(),
    };

    const file = Bun.file(notificationLogPath);
    let content = "";
    if (await file.exists()) {
      content = await file.text();
    }
    content += JSON.stringify(logEntry) + "\n";
    await Bun.write(notificationLogPath, content);
  }

  // Deliver to webhook
  private async deliverToWebhook(notification: Notification): Promise<void> {
    if (!this.preferences.webhookUrl) {
      return;
    }

    try {
      await fetch(this.preferences.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: notification.type,
          priority: notification.priority,
          title: notification.title,
          message: notification.message,
          timestamp: notification.createdAt,
          source: notification.source,
        }),
      });

      await logger.info("webhook_notification_sent", {
        notificationId: notification.id,
      });
    } catch (error) {
      await logger.error("webhook_notification_error", {
        notificationId: notification.id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Queue notification for later delivery
  private async queueNotification(params: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    details?: Record<string, unknown>;
    source: {
      module: string;
      itemId?: string;
      itemType?: string;
    };
  }): Promise<Notification> {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: params.type,
      priority: params.priority,
      title: params.title,
      message: params.message,
      details: params.details,
      source: params.source,
      channels: this.preferences.channels,
      createdAt: new Date().toISOString(),
      dismissed: false,
    };

    // Save as queued
    await this.saveNotification(notification, true);

    return notification;
  }

  // Process queued notifications
  async processQueuedNotifications(): Promise<number> {
    if (this.isQuietHours()) {
      return 0;
    }

    const queuePath = `${config.statePath}/notification-queue.json`;
    const file = Bun.file(queuePath);

    if (!(await file.exists())) {
      return 0;
    }

    const queue: Notification[] = await file.json();
    let processed = 0;

    for (const notification of queue) {
      await this.deliverNotification(notification);
      await this.saveNotification(notification);
      processed++;
    }

    // Clear queue
    await Bun.write(queuePath, "[]");

    if (processed > 0) {
      await logger.info("processed_queued_notifications", { count: processed });
    }

    return processed;
  }

  // Check if priority meets threshold
  private meetsPriorityThreshold(priority: NotificationPriority): boolean {
    const priorityLevels: Record<NotificationPriority, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return (
      priorityLevels[priority] >= priorityLevels[this.preferences.priorityThreshold]
    );
  }

  // Check if in quiet hours
  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const { start, end } = this.preferences.quietHours;

    if (start <= end) {
      // Same day range (e.g., 9 AM - 6 PM)
      return currentHour >= start && currentHour < end;
    } else {
      // Overnight range (e.g., 10 PM - 7 AM)
      return currentHour >= start || currentHour < end;
    }
  }

  // Get notifications
  async getNotifications(options?: {
    type?: NotificationType;
    priority?: NotificationPriority;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<Notification[]> {
    let notifications = await this.loadNotifications();

    if (options?.type) {
      notifications = notifications.filter((n) => n.type === options.type);
    }

    if (options?.priority) {
      notifications = notifications.filter((n) => n.priority === options.priority);
    }

    if (options?.unreadOnly) {
      notifications = notifications.filter((n) => !n.readAt && !n.dismissed);
    }

    // Sort by creation date (newest first)
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (options?.limit) {
      notifications = notifications.slice(0, options.limit);
    }

    return notifications;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<Notification | null> {
    const notifications = await this.loadNotifications();
    const notification = notifications.find((n) => n.id === notificationId);

    if (!notification) {
      return null;
    }

    notification.readAt = new Date().toISOString();
    await this.saveAllNotifications(notifications);

    return notification;
  }

  // Dismiss notification
  async dismiss(notificationId: string): Promise<Notification | null> {
    const notifications = await this.loadNotifications();
    const notification = notifications.find((n) => n.id === notificationId);

    if (!notification) {
      return null;
    }

    notification.dismissed = true;
    await this.saveAllNotifications(notifications);

    return notification;
  }

  // Get notification statistics
  async getStats(): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
    recentCount: number;
  }> {
    const notifications = await this.loadNotifications();
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    let unread = 0;
    let recentCount = 0;

    for (const notification of notifications) {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byPriority[notification.priority] =
        (byPriority[notification.priority] || 0) + 1;

      if (!notification.readAt && !notification.dismissed) {
        unread++;
      }

      if (new Date(notification.createdAt) > dayAgo) {
        recentCount++;
      }
    }

    return {
      total: notifications.length,
      unread,
      byType: byType as Record<NotificationType, number>,
      byPriority: byPriority as Record<NotificationPriority, number>,
      recentCount,
    };
  }

  // Update preferences
  async updatePreferences(
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    this.preferences = { ...this.preferences, ...updates };
    await this.savePreferences(this.preferences);
    return this.preferences;
  }

  // Get preferences
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Add custom trigger rule
  addTriggerRule(rule: TriggerRule): void {
    triggerRules.push(rule);
  }

  // Send immediate notification (bypass checks)
  async sendImmediate(params: {
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    source: {
      module: string;
      itemId?: string;
      itemType?: string;
    };
  }): Promise<Notification> {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: params.type,
      priority: params.priority,
      title: params.title,
      message: params.message,
      source: params.source,
      channels: this.preferences.channels,
      createdAt: new Date().toISOString(),
      dismissed: false,
    };

    await this.deliverNotification(notification);
    await this.saveNotification(notification);

    return notification;
  }

  // Save single notification
  private async saveNotification(
    notification: Notification,
    toQueue: boolean = false
  ): Promise<void> {
    const path = toQueue
      ? `${config.statePath}/notification-queue.json`
      : this.notificationsPath;

    const file = Bun.file(path);
    let notifications: Notification[] = [];

    if (await file.exists()) {
      notifications = await file.json();
    }

    notifications.push(notification);

    // Keep last 500 notifications (or unlimited for queue)
    if (!toQueue && notifications.length > 500) {
      notifications = notifications.slice(-500);
    }

    await Bun.write(path, JSON.stringify(notifications, null, 2));
  }

  // Save all notifications
  private async saveAllNotifications(notifications: Notification[]): Promise<void> {
    await Bun.write(this.notificationsPath, JSON.stringify(notifications, null, 2));
  }

  // Load notifications
  private async loadNotifications(): Promise<Notification[]> {
    try {
      const file = Bun.file(this.notificationsPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Load preferences
  private async loadPreferences(): Promise<NotificationPreferences> {
    try {
      const file = Bun.file(this.preferencesPath);
      if (await file.exists()) {
        const saved = await file.json();
        return { ...defaultPreferences, ...saved };
      }
    } catch {
      // Use defaults
    }
    return defaultPreferences;
  }

  // Save preferences
  private async savePreferences(preferences: NotificationPreferences): Promise<void> {
    await Bun.write(this.preferencesPath, JSON.stringify(preferences, null, 2));
  }
}

export const notifier = new Notifier();
