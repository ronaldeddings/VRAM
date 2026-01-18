// Cross-Correlator
// Links meetings, emails, and Slack into unified contact timelines

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { emailParser, type ParsedEmail, type Contact as EmailContact } from "./email-parser";
import { slackParser, type SlackMessage, type SlackUser } from "./slack-parser";
import { meetingParser, type ParsedMeeting } from "./meeting-parser";
import { networkAnalyzer, type UnifiedContact } from "./network-analyzer";

export interface TimelineEvent {
  id: string;
  type: "email" | "meeting" | "slack";
  date: Date;
  summary: string;
  participants: string[];
  sentiment?: number;
  importance: "low" | "medium" | "high";
  source: {
    channel?: string;
    subject?: string;
    meetingId?: string;
    messageId?: string;
  };
  tags: string[];
}

export interface ContactTimeline {
  contactId: string;
  contactName: string;
  events: TimelineEvent[];
  firstInteraction?: Date;
  lastInteraction?: Date;
  totalInteractions: number;
  channelBreakdown: {
    email: number;
    meeting: number;
    slack: number;
  };
  trends: {
    frequency: "increasing" | "stable" | "decreasing";
    sentiment: "improving" | "stable" | "declining";
  };
}

export interface CorrelatedThread {
  id: string;
  topic: string;
  startDate: Date;
  endDate?: Date;
  events: TimelineEvent[];
  participants: string[];
  channels: string[];
  status: "active" | "resolved" | "stale";
  nextAction?: string;
}

export interface RelationshipReport {
  contactId: string;
  contactName: string;
  company?: string;
  relationshipHealth: number; // 0-1
  timeline: ContactTimeline;
  correlatedThreads: CorrelatedThread[];
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
}

class CrossCorrelator {
  private timelines: Map<string, ContactTimeline> = new Map();
  private correlatedThreads: CorrelatedThread[] = [];
  private statePath: string;

  constructor() {
    this.statePath = `${config.triadPath}/${config.statePath}/correlations.json`;
  }

  /**
   * Build unified contact timelines from all sources
   */
  async buildUnifiedTimelines(): Promise<void> {
    await logger.info("cross_correlator_building_timelines", {});

    // Index all sources
    await emailParser.indexAllEmails();
    await slackParser.indexAllChannels();
    await meetingParser.indexTranscripts();
    await networkAnalyzer.buildUnifiedContacts();

    // Get unified contacts as base
    const contacts = networkAnalyzer.getContacts();

    for (const contact of contacts) {
      if (contact.isInternal) continue; // Skip internal team for now

      const timeline = await this.buildContactTimeline(contact);
      this.timelines.set(contact.id, timeline);
    }

    // Find correlated threads across channels
    this.findCorrelatedThreads();

    await logger.info("cross_correlator_timelines_built", {
      timelines: this.timelines.size,
      threads: this.correlatedThreads.length,
    });
  }

  /**
   * Build timeline for a specific contact
   */
  private async buildContactTimeline(contact: UnifiedContact): Promise<ContactTimeline> {
    const events: TimelineEvent[] = [];

    // Gather email events
    const emails = emailParser.getEmailsForContact(contact.email || contact.name);
    for (const email of emails.slice(0, 100)) {
      events.push(this.emailToEvent(email, contact));
    }

    // Gather meeting events
    const meetings = meetingParser.getMeetingsForContact(contact.name);
    for (const meeting of meetings.slice(0, 50)) {
      events.push(this.meetingToEvent(meeting, contact));
    }

    // Gather Slack events (if contact has Slack ID)
    if (contact.slackId) {
      // Would need to add method to get messages by user
      // For now, we'll use the summary data
    }

    // Sort events by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate channel breakdown
    const channelBreakdown = {
      email: events.filter(e => e.type === "email").length,
      meeting: events.filter(e => e.type === "meeting").length,
      slack: events.filter(e => e.type === "slack").length,
    };

    // Calculate trends
    const trends = this.calculateTrends(events);

    return {
      contactId: contact.id,
      contactName: contact.name,
      events,
      firstInteraction: events[0]?.date,
      lastInteraction: events[events.length - 1]?.date,
      totalInteractions: events.length,
      channelBreakdown,
      trends,
    };
  }

  /**
   * Convert email to timeline event
   */
  private emailToEvent(email: ParsedEmail, contact: UnifiedContact): TimelineEvent {
    const isInbound = email.to.some(t => t.toLowerCase().includes("ron"));

    return {
      id: `email_${email.id}`,
      type: "email",
      date: email.date,
      summary: `${isInbound ? "Received" : "Sent"}: ${email.subject.substring(0, 80)}`,
      participants: [email.from, ...email.to],
      importance: this.determineEmailImportance(email),
      source: {
        subject: email.subject,
        messageId: email.id,
      },
      tags: this.extractEmailTags(email),
    };
  }

  /**
   * Convert meeting to timeline event
   */
  private meetingToEvent(meeting: ParsedMeeting, contact: UnifiedContact): TimelineEvent {
    return {
      id: `meeting_${meeting.id}`,
      type: "meeting",
      date: meeting.date,
      summary: `Meeting: ${meeting.title || "Discussion"} (${meeting.duration}min)`,
      participants: meeting.participants,
      sentiment: meeting.entries.length > 0 ? 0.5 : undefined, // Would need sentiment calculation
      importance: meeting.meetingType === "sales" ? "high" : "medium",
      source: {
        meetingId: meeting.id,
      },
      tags: meeting.topics,
    };
  }

  /**
   * Determine email importance
   */
  private determineEmailImportance(email: ParsedEmail): "low" | "medium" | "high" {
    const subject = email.subject.toLowerCase();
    const body = email.body.toLowerCase();

    const highPriority = ["urgent", "important", "asap", "deadline", "contract", "proposal"];
    const mediumPriority = ["meeting", "follow up", "update", "review", "schedule"];

    if (highPriority.some(k => subject.includes(k) || body.includes(k))) {
      return "high";
    }
    if (mediumPriority.some(k => subject.includes(k) || body.includes(k))) {
      return "medium";
    }
    return "low";
  }

  /**
   * Extract tags from email content
   */
  private extractEmailTags(email: ParsedEmail): string[] {
    const tags: string[] = [];
    const text = `${email.subject} ${email.body}`.toLowerCase();

    const tagKeywords = {
      "sponsor": ["sponsor", "sponsorship", "advertising"],
      "proposal": ["proposal", "quote", "estimate"],
      "podcast": ["podcast", "episode", "guest", "interview"],
      "meeting": ["meeting", "call", "schedule"],
      "follow-up": ["follow up", "following up", "touch base"],
      "contract": ["contract", "agreement", "terms"],
      "opportunity": ["opportunity", "interested", "partnership"],
    };

    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      if (keywords.some(k => text.includes(k))) {
        tags.push(tag);
      }
    }

    return tags;
  }

  /**
   * Calculate interaction trends
   */
  private calculateTrends(events: TimelineEvent[]): {
    frequency: "increasing" | "stable" | "decreasing";
    sentiment: "improving" | "stable" | "declining";
  } {
    if (events.length < 3) {
      return { frequency: "stable", sentiment: "stable" };
    }

    // Split events into two halves
    const mid = Math.floor(events.length / 2);
    const firstHalf = events.slice(0, mid);
    const secondHalf = events.slice(mid);

    // Calculate frequency trend
    const firstPeriod = firstHalf.length > 0 ?
      (firstHalf[firstHalf.length - 1].date.getTime() - firstHalf[0].date.getTime()) / firstHalf.length :
      Infinity;
    const secondPeriod = secondHalf.length > 0 ?
      (secondHalf[secondHalf.length - 1].date.getTime() - secondHalf[0].date.getTime()) / secondHalf.length :
      Infinity;

    let frequency: "increasing" | "stable" | "decreasing" = "stable";
    if (secondPeriod < firstPeriod * 0.7) {
      frequency = "increasing";
    } else if (secondPeriod > firstPeriod * 1.3) {
      frequency = "decreasing";
    }

    // Sentiment trend would need actual sentiment data
    const sentiment: "improving" | "stable" | "declining" = "stable";

    return { frequency, sentiment };
  }

  /**
   * Find correlated threads across channels
   */
  private findCorrelatedThreads(): void {
    this.correlatedThreads = [];

    // Group events by topic keywords
    const topicGroups = new Map<string, TimelineEvent[]>();

    for (const timeline of this.timelines.values()) {
      for (const event of timeline.events) {
        for (const tag of event.tags) {
          if (!topicGroups.has(tag)) {
            topicGroups.set(tag, []);
          }
          topicGroups.get(tag)!.push(event);
        }
      }
    }

    // Create correlated threads from topic groups
    for (const [topic, events] of topicGroups) {
      if (events.length < 2) continue;

      // Sort by date
      events.sort((a, b) => a.date.getTime() - b.date.getTime());

      // Group into time-based threads (events within 30 days of each other)
      const threads = this.groupIntoThreads(events, 30);

      for (const thread of threads) {
        if (thread.length < 2) continue;

        const participants = new Set<string>();
        const channels = new Set<string>();

        for (const e of thread) {
          e.participants.forEach(p => participants.add(p));
          channels.add(e.type);
        }

        this.correlatedThreads.push({
          id: `thread_${topic}_${thread[0].date.getTime()}`,
          topic,
          startDate: thread[0].date,
          endDate: thread[thread.length - 1].date,
          events: thread,
          participants: Array.from(participants),
          channels: Array.from(channels),
          status: this.determineThreadStatus(thread),
        });
      }
    }

    // Sort by most recent activity
    this.correlatedThreads.sort((a, b) =>
      (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0)
    );
  }

  /**
   * Group events into time-based threads
   */
  private groupIntoThreads(events: TimelineEvent[], maxGapDays: number): TimelineEvent[][] {
    const threads: TimelineEvent[][] = [];
    let currentThread: TimelineEvent[] = [];

    for (const event of events) {
      if (currentThread.length === 0) {
        currentThread.push(event);
      } else {
        const lastEvent = currentThread[currentThread.length - 1];
        const dayGap = (event.date.getTime() - lastEvent.date.getTime()) / (1000 * 60 * 60 * 24);

        if (dayGap <= maxGapDays) {
          currentThread.push(event);
        } else {
          threads.push(currentThread);
          currentThread = [event];
        }
      }
    }

    if (currentThread.length > 0) {
      threads.push(currentThread);
    }

    return threads;
  }

  /**
   * Determine thread status
   */
  private determineThreadStatus(events: TimelineEvent[]): "active" | "resolved" | "stale" {
    const lastEvent = events[events.length - 1];
    const daysSinceLastEvent = (Date.now() - lastEvent.date.getTime()) / (1000 * 60 * 60 * 24);

    // Check for resolution indicators
    const hasResolution = events.some(e =>
      e.summary.toLowerCase().includes("completed") ||
      e.summary.toLowerCase().includes("resolved") ||
      e.summary.toLowerCase().includes("signed") ||
      e.summary.toLowerCase().includes("confirmed")
    );

    if (hasResolution) return "resolved";
    if (daysSinceLastEvent > 30) return "stale";
    return "active";
  }

  /**
   * Generate comprehensive relationship report
   */
  generateRelationshipReport(contactId: string): RelationshipReport | null {
    const timeline = this.timelines.get(contactId);
    if (!timeline) return null;

    const contact = networkAnalyzer.getContact(contactId);
    if (!contact) return null;

    // Find threads involving this contact
    const contactThreads = this.correlatedThreads.filter(t =>
      t.participants.some(p =>
        p.toLowerCase().includes(contact.name.toLowerCase()) ||
        (contact.email && p.toLowerCase().includes(contact.email.toLowerCase()))
      )
    );

    // Generate insights
    const insights = this.generateInsights(timeline, contactThreads);

    // Generate recommendations
    const recommendations = this.generateRecommendations(timeline, contactThreads);

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(timeline, contactThreads);

    return {
      contactId,
      contactName: contact.name,
      company: contact.company,
      relationshipHealth: contact.relationshipScore,
      timeline,
      correlatedThreads: contactThreads,
      insights,
      recommendations,
      riskFactors,
    };
  }

  /**
   * Generate insights from timeline
   */
  private generateInsights(timeline: ContactTimeline, threads: CorrelatedThread[]): string[] {
    const insights: string[] = [];

    // Frequency insight
    if (timeline.trends.frequency === "increasing") {
      insights.push("Communication frequency is increasing - relationship is growing");
    } else if (timeline.trends.frequency === "decreasing") {
      insights.push("Communication frequency is declining - consider re-engagement");
    }

    // Channel preference
    const maxChannel = Object.entries(timeline.channelBreakdown)
      .sort((a, b) => b[1] - a[1])[0];
    insights.push(`Preferred communication channel: ${maxChannel[0]} (${maxChannel[1]} interactions)`);

    // Active threads
    const activeThreads = threads.filter(t => t.status === "active");
    if (activeThreads.length > 0) {
      insights.push(`${activeThreads.length} active conversation thread(s) with this contact`);
    }

    // Stale threads
    const staleThreads = threads.filter(t => t.status === "stale");
    if (staleThreads.length > 0) {
      insights.push(`${staleThreads.length} stale thread(s) may need follow-up`);
    }

    // Recency
    if (timeline.lastInteraction) {
      const daysSince = Math.floor((Date.now() - timeline.lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 60) {
        insights.push(`Last interaction was ${daysSince} days ago - relationship may be dormant`);
      }
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(timeline: ContactTimeline, threads: CorrelatedThread[]): string[] {
    const recommendations: string[] = [];

    // Follow-up on stale threads
    const staleThreads = threads.filter(t => t.status === "stale");
    for (const thread of staleThreads.slice(0, 3)) {
      recommendations.push(`Follow up on stale "${thread.topic}" discussion from ${thread.endDate?.toLocaleDateString()}`);
    }

    // Channel diversification
    if (timeline.channelBreakdown.meeting === 0 && timeline.totalInteractions > 5) {
      recommendations.push("Consider scheduling a meeting to strengthen the relationship");
    }

    // Re-engagement for declining frequency
    if (timeline.trends.frequency === "decreasing") {
      recommendations.push("Schedule a check-in to maintain relationship momentum");
    }

    // Multi-channel engagement
    const channelsUsed = Object.entries(timeline.channelBreakdown).filter(([, count]) => count > 0).length;
    if (channelsUsed === 1 && timeline.totalInteractions > 10) {
      recommendations.push("Expand to additional communication channels for stronger engagement");
    }

    return recommendations;
  }

  /**
   * Identify risk factors
   */
  private identifyRiskFactors(timeline: ContactTimeline, threads: CorrelatedThread[]): string[] {
    const riskFactors: string[] = [];

    // Declining engagement
    if (timeline.trends.frequency === "decreasing") {
      riskFactors.push("Communication frequency is declining");
    }

    // Long gap since last interaction
    if (timeline.lastInteraction) {
      const daysSince = Math.floor((Date.now() - timeline.lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince > 90) {
        riskFactors.push(`No contact in ${daysSince} days - relationship at risk`);
      }
    }

    // Unresolved important threads
    const staleImportant = threads.filter(t =>
      t.status === "stale" &&
      t.events.some(e => e.importance === "high")
    );
    if (staleImportant.length > 0) {
      riskFactors.push(`${staleImportant.length} important thread(s) have gone stale`);
    }

    // Single point of contact
    if (timeline.totalInteractions > 20 && timeline.channelBreakdown.meeting === 0) {
      riskFactors.push("Relationship is primarily text-based - may lack personal connection");
    }

    return riskFactors;
  }

  /**
   * Get timeline for a contact
   */
  getTimeline(contactId: string): ContactTimeline | undefined {
    return this.timelines.get(contactId);
  }

  /**
   * Get all correlated threads
   */
  getCorrelatedThreads(): CorrelatedThread[] {
    return this.correlatedThreads;
  }

  /**
   * Get active threads needing attention
   */
  getActiveThreads(): CorrelatedThread[] {
    return this.correlatedThreads.filter(t => t.status === "active");
  }

  /**
   * Get stale threads needing follow-up
   */
  getStaleThreads(): CorrelatedThread[] {
    return this.correlatedThreads.filter(t => t.status === "stale");
  }

  /**
   * Save correlation data
   */
  async saveCorrelationData(): Promise<void> {
    try {
      const data = {
        timelines: Array.from(this.timelines.entries()).map(([id, timeline]) => ({
          id,
          ...timeline,
        })),
        correlatedThreads: this.correlatedThreads,
        lastUpdated: new Date().toISOString(),
      };

      await Bun.write(this.statePath, JSON.stringify(data, null, 2));

      await logger.debug("correlation_data_saved", {
        timelines: this.timelines.size,
        threads: this.correlatedThreads.length,
      });
    } catch (error) {
      await logger.error("correlation_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Load correlation data
   */
  async loadCorrelationData(): Promise<void> {
    try {
      const file = Bun.file(this.statePath);
      if (await file.exists()) {
        const data = await file.json();

        // Restore timelines
        for (const timeline of data.timelines || []) {
          this.timelines.set(timeline.id, {
            ...timeline,
            firstInteraction: timeline.firstInteraction ? new Date(timeline.firstInteraction) : undefined,
            lastInteraction: timeline.lastInteraction ? new Date(timeline.lastInteraction) : undefined,
            events: (timeline.events || []).map((e: any) => ({
              ...e,
              date: new Date(e.date),
            })),
          });
        }

        // Restore threads
        this.correlatedThreads = (data.correlatedThreads || []).map((t: any) => ({
          ...t,
          startDate: new Date(t.startDate),
          endDate: t.endDate ? new Date(t.endDate) : undefined,
          events: (t.events || []).map((e: any) => ({
            ...e,
            date: new Date(e.date),
          })),
        }));

        await logger.debug("correlation_data_loaded", {
          timelines: this.timelines.size,
          threads: this.correlatedThreads.length,
        });
      }
    } catch (error) {
      await logger.warn("correlation_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const crossCorrelator = new CrossCorrelator();
