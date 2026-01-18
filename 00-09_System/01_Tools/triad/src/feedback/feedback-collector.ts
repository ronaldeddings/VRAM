// Feedback Collector - Track user engagement and learn preferences
// Phase 8.3: Feedback Collection and Learning

import { config } from "../utils/config";

// Feedback types
export type FeedbackType =
  | "helpful"
  | "not_helpful"
  | "accurate"
  | "inaccurate"
  | "actionable"
  | "not_actionable"
  | "timely"
  | "too_late"
  | "duplicate"
  | "surprising"
  | "expected";

// Engagement types
export type EngagementType =
  | "viewed"
  | "dismissed"
  | "saved"
  | "acted_on"
  | "shared"
  | "expanded"
  | "flagged";

// Feedback entry
export interface FeedbackEntry {
  id: string;
  itemId: string;
  itemType: "insight" | "opportunity" | "action" | "discovery" | "suggestion";
  feedbackType: FeedbackType;
  rating?: number; // 1-5 stars
  comment?: string;
  timestamp: string;
}

// Engagement entry
export interface EngagementEntry {
  id: string;
  itemId: string;
  itemType: string;
  engagementType: EngagementType;
  duration?: number; // Time spent in seconds
  timestamp: string;
}

// Learned preference
export interface LearnedPreference {
  category: string;
  preferenceType: "content" | "timing" | "format" | "priority";
  preference: string;
  confidence: number;
  evidence: string[];
  learnedAt: string;
  lastUpdated: string;
}

// Feedback statistics
export interface FeedbackStats {
  totalFeedback: number;
  positiveRate: number;
  actionRate: number;
  averageRating: number;
  byType: Record<FeedbackType, number>;
  byItemType: Record<string, number>;
}

class FeedbackCollector {
  private statePath: string;
  private feedbackPath: string;
  private engagementPath: string;
  private preferencesPath: string;

  constructor() {
    this.statePath = config.statePath;
    this.feedbackPath = `${config.statePath}/feedback.json`;
    this.engagementPath = `${config.statePath}/engagement.json`;
    this.preferencesPath = `${config.statePath}/preferences.json`;
  }

  // Record feedback
  async recordFeedback(
    itemId: string,
    itemType: FeedbackEntry["itemType"],
    feedbackType: FeedbackType,
    rating?: number,
    comment?: string
  ): Promise<FeedbackEntry> {
    const feedback = await this.loadFeedback();

    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      itemId,
      itemType,
      feedbackType,
      rating,
      comment,
      timestamp: new Date().toISOString(),
    };

    feedback.push(entry);
    await this.saveFeedback(feedback);

    // Update preferences based on feedback
    await this.learnFromFeedback(entry);

    return entry;
  }

  // Record engagement
  async recordEngagement(
    itemId: string,
    itemType: string,
    engagementType: EngagementType,
    duration?: number
  ): Promise<EngagementEntry> {
    const engagement = await this.loadEngagement();

    const entry: EngagementEntry = {
      id: `eng-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      itemId,
      itemType,
      engagementType,
      duration,
      timestamp: new Date().toISOString(),
    };

    engagement.push(entry);
    await this.saveEngagement(engagement);

    // Update preferences based on engagement
    await this.learnFromEngagement(entry);

    return entry;
  }

  // Learn from feedback
  private async learnFromFeedback(entry: FeedbackEntry): Promise<void> {
    const preferences = await this.loadPreferences();
    const now = new Date().toISOString();

    // Positive feedback types
    const positiveFeedback = ["helpful", "accurate", "actionable", "timely", "surprising"];
    // Negative feedback types
    const negativeFeedback = ["not_helpful", "inaccurate", "not_actionable", "too_late", "duplicate"];

    const isPositive = positiveFeedback.includes(entry.feedbackType);

    // Find or create preference for this item type
    let preference = preferences.find(
      p => p.category === entry.itemType && p.preferenceType === "content"
    );

    if (!preference) {
      preference = {
        category: entry.itemType,
        preferenceType: "content",
        preference: isPositive ? `User values ${entry.itemType}s` : `User wants fewer ${entry.itemType}s`,
        confidence: 0.3,
        evidence: [],
        learnedAt: now,
        lastUpdated: now,
      };
      preferences.push(preference);
    }

    // Update confidence based on feedback
    if (isPositive) {
      preference.confidence = Math.min(1.0, preference.confidence + 0.05);
      preference.preference = `User values ${entry.itemType}s`;
    } else {
      preference.confidence = Math.max(0.1, preference.confidence - 0.05);
    }

    preference.evidence.push(
      `${entry.feedbackType} feedback on ${entry.timestamp}`
    );
    preference.lastUpdated = now;

    // Learn from specific feedback types
    if (entry.feedbackType === "timely") {
      await this.updateTimingPreference(entry, "good", preferences);
    } else if (entry.feedbackType === "too_late") {
      await this.updateTimingPreference(entry, "bad", preferences);
    }

    if (entry.feedbackType === "duplicate") {
      await this.updateDuplicateThreshold(entry, preferences);
    }

    await this.savePreferences(preferences);
  }

  // Learn from engagement
  private async learnFromEngagement(entry: EngagementEntry): Promise<void> {
    const preferences = await this.loadPreferences();
    const now = new Date().toISOString();

    // Track engagement patterns
    const engagementValue: Record<EngagementType, number> = {
      viewed: 0.01,
      expanded: 0.02,
      saved: 0.05,
      acted_on: 0.1,
      shared: 0.08,
      dismissed: -0.03,
      flagged: -0.05,
    };

    const value = engagementValue[entry.engagementType] || 0;

    // Find or create preference
    let preference = preferences.find(
      p => p.category === entry.itemType && p.preferenceType === "priority"
    );

    if (!preference) {
      preference = {
        category: entry.itemType,
        preferenceType: "priority",
        preference: "neutral",
        confidence: 0.3,
        evidence: [],
        learnedAt: now,
        lastUpdated: now,
      };
      preferences.push(preference);
    }

    // Update confidence based on engagement
    preference.confidence = Math.max(0.1, Math.min(1.0, preference.confidence + value));
    preference.evidence.push(
      `${entry.engagementType} on ${entry.timestamp}${entry.duration ? ` (${entry.duration}s)` : ""}`
    );
    preference.lastUpdated = now;

    // Update preference description based on confidence
    if (preference.confidence >= 0.7) {
      preference.preference = "high_priority";
    } else if (preference.confidence >= 0.4) {
      preference.preference = "medium_priority";
    } else {
      preference.preference = "low_priority";
    }

    await this.savePreferences(preferences);
  }

  // Update timing preference
  private async updateTimingPreference(
    entry: FeedbackEntry,
    timing: "good" | "bad",
    preferences: LearnedPreference[]
  ): Promise<void> {
    const now = new Date().toISOString();

    let timingPref = preferences.find(
      p => p.category === entry.itemType && p.preferenceType === "timing"
    );

    if (!timingPref) {
      timingPref = {
        category: entry.itemType,
        preferenceType: "timing",
        preference: "standard_timing",
        confidence: 0.3,
        evidence: [],
        learnedAt: now,
        lastUpdated: now,
      };
      preferences.push(timingPref);
    }

    if (timing === "good") {
      timingPref.confidence = Math.min(1.0, timingPref.confidence + 0.1);
      timingPref.preference = "timing_is_good";
    } else {
      timingPref.confidence = Math.max(0.1, timingPref.confidence - 0.1);
      timingPref.preference = "needs_earlier_delivery";
    }

    timingPref.evidence.push(`${timing} timing feedback on ${entry.timestamp}`);
    timingPref.lastUpdated = now;
  }

  // Update duplicate threshold
  private async updateDuplicateThreshold(
    entry: FeedbackEntry,
    preferences: LearnedPreference[]
  ): Promise<void> {
    const now = new Date().toISOString();

    let dupPref = preferences.find(
      p => p.category === "deduplication" && p.preferenceType === "content"
    );

    if (!dupPref) {
      dupPref = {
        category: "deduplication",
        preferenceType: "content",
        preference: "increase_dedup_threshold",
        confidence: 0.3,
        evidence: [],
        learnedAt: now,
        lastUpdated: now,
      };
      preferences.push(dupPref);
    }

    dupPref.confidence = Math.min(1.0, dupPref.confidence + 0.1);
    dupPref.evidence.push(`Duplicate feedback on ${entry.itemId}`);
    dupPref.lastUpdated = now;
  }

  // Get feedback statistics
  async getStats(): Promise<FeedbackStats> {
    const feedback = await this.loadFeedback();

    const byType: Record<string, number> = {};
    const byItemType: Record<string, number> = {};
    let totalRating = 0;
    let ratingCount = 0;
    let positiveCount = 0;
    let actionCount = 0;

    const positiveFeedback = ["helpful", "accurate", "actionable", "timely", "surprising"];

    for (const entry of feedback) {
      byType[entry.feedbackType] = (byType[entry.feedbackType] || 0) + 1;
      byItemType[entry.itemType] = (byItemType[entry.itemType] || 0) + 1;

      if (entry.rating) {
        totalRating += entry.rating;
        ratingCount++;
      }

      if (positiveFeedback.includes(entry.feedbackType)) {
        positiveCount++;
      }

      if (entry.feedbackType === "actionable") {
        actionCount++;
      }
    }

    return {
      totalFeedback: feedback.length,
      positiveRate: feedback.length > 0 ? positiveCount / feedback.length : 0,
      actionRate: feedback.length > 0 ? actionCount / feedback.length : 0,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      byType: byType as Record<FeedbackType, number>,
      byItemType,
    };
  }

  // Get learned preferences
  async getPreferences(): Promise<LearnedPreference[]> {
    return this.loadPreferences();
  }

  // Get preferences for specific category
  async getPreferencesForCategory(category: string): Promise<LearnedPreference[]> {
    const preferences = await this.loadPreferences();
    return preferences.filter(p => p.category === category);
  }

  // Get confidence adjustment for item type
  async getConfidenceAdjustment(itemType: string): Promise<number> {
    const preferences = await this.loadPreferences();
    const pref = preferences.find(
      p => p.category === itemType && p.preferenceType === "content"
    );

    if (!pref) return 0;

    // Return adjustment between -0.1 and +0.1 based on preference confidence
    return (pref.confidence - 0.5) * 0.2;
  }

  // Check if item type is valued
  async isItemTypeValued(itemType: string): Promise<boolean> {
    const preferences = await this.loadPreferences();
    const pref = preferences.find(
      p => p.category === itemType && p.preferenceType === "content"
    );

    return pref ? pref.confidence >= 0.5 : true; // Default to valued
  }

  // Get priority level for item type
  async getPriorityLevel(itemType: string): Promise<"high" | "medium" | "low"> {
    const preferences = await this.loadPreferences();
    const pref = preferences.find(
      p => p.category === itemType && p.preferenceType === "priority"
    );

    if (!pref) return "medium";

    if (pref.confidence >= 0.7) return "high";
    if (pref.confidence >= 0.4) return "medium";
    return "low";
  }

  // Get feedback for specific item
  async getFeedbackForItem(itemId: string): Promise<FeedbackEntry[]> {
    const feedback = await this.loadFeedback();
    return feedback.filter(f => f.itemId === itemId);
  }

  // Get recent feedback
  async getRecentFeedback(limit: number = 20): Promise<FeedbackEntry[]> {
    const feedback = await this.loadFeedback();
    return feedback
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get engagement for specific item
  async getEngagementForItem(itemId: string): Promise<EngagementEntry[]> {
    const engagement = await this.loadEngagement();
    return engagement.filter(e => e.itemId === itemId);
  }

  // Generate preference report
  async generatePreferenceReport(): Promise<string> {
    const preferences = await this.loadPreferences();
    const stats = await this.getStats();

    let report = `# User Preference Report\n\n`;
    report += `## Feedback Summary\n`;
    report += `- Total feedback entries: ${stats.totalFeedback}\n`;
    report += `- Positive rate: ${(stats.positiveRate * 100).toFixed(1)}%\n`;
    report += `- Action rate: ${(stats.actionRate * 100).toFixed(1)}%\n`;
    report += `- Average rating: ${stats.averageRating.toFixed(1)}/5\n\n`;

    report += `## Learned Preferences\n\n`;

    // Group by category
    const categories = [...new Set(preferences.map(p => p.category))];
    for (const category of categories) {
      report += `### ${category}\n`;
      const catPrefs = preferences.filter(p => p.category === category);
      for (const pref of catPrefs) {
        report += `- **${pref.preferenceType}**: ${pref.preference} (${(pref.confidence * 100).toFixed(0)}% confident)\n`;
      }
      report += "\n";
    }

    report += `## Recommendations for System\n\n`;

    // Generate recommendations based on preferences
    for (const pref of preferences.filter(p => p.confidence >= 0.7)) {
      if (pref.preferenceType === "priority" && pref.preference === "high_priority") {
        report += `- Increase frequency of ${pref.category} outputs\n`;
      } else if (pref.preferenceType === "priority" && pref.preference === "low_priority") {
        report += `- Decrease frequency of ${pref.category} outputs\n`;
      } else if (pref.preferenceType === "timing" && pref.preference === "needs_earlier_delivery") {
        report += `- Deliver ${pref.category} outputs earlier\n`;
      }
    }

    return report;
  }

  // Load feedback from file
  private async loadFeedback(): Promise<FeedbackEntry[]> {
    try {
      const file = Bun.file(this.feedbackPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Save feedback to file
  private async saveFeedback(feedback: FeedbackEntry[]): Promise<void> {
    await Bun.write(this.feedbackPath, JSON.stringify(feedback, null, 2));
  }

  // Load engagement from file
  private async loadEngagement(): Promise<EngagementEntry[]> {
    try {
      const file = Bun.file(this.engagementPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Save engagement to file
  private async saveEngagement(engagement: EngagementEntry[]): Promise<void> {
    await Bun.write(this.engagementPath, JSON.stringify(engagement, null, 2));
  }

  // Load preferences from file
  private async loadPreferences(): Promise<LearnedPreference[]> {
    try {
      const file = Bun.file(this.preferencesPath);
      if (await file.exists()) {
        return await file.json();
      }
    } catch {
      // Fresh start
    }
    return [];
  }

  // Save preferences to file
  private async savePreferences(preferences: LearnedPreference[]): Promise<void> {
    await Bun.write(this.preferencesPath, JSON.stringify(preferences, null, 2));
  }
}

export const feedbackCollector = new FeedbackCollector();
