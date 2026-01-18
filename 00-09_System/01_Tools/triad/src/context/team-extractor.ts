// Team Extractor
// Extracts team health and workload data from internal meetings

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { meetingParser, type ParsedMeeting } from "./meeting-parser";

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  lastMeetingDate?: Date;
  meetingCount: number;
  sentimentHistory: { date: Date; sentiment: number }[];
  currentWorkload: "low" | "normal" | "high" | "overloaded" | "unknown";
  blockers: string[];
  recentTopics: string[];
}

export interface TeamMeeting {
  id: string;
  date: Date;
  participants: string[];
  topics: string[];
  blockers: string[];
  decisions: string[];
  actionItems: string[];
  overallSentiment: number; // -1 to 1
}

export interface TeamHealthIndicators {
  overallHealth: number; // 0-1
  workloadBalance: number; // 0-1
  communicationFlow: number; // 0-1
  blockerCount: number;
  unresolvedIssues: string[];
  trends: {
    sentimentTrend: "improving" | "stable" | "declining";
    workloadTrend: "increasing" | "stable" | "decreasing";
  };
}

class TeamExtractor {
  private teamMembers: Map<string, TeamMember> = new Map();
  private teamMeetings: TeamMeeting[] = [];
  private teamPath: string;

  // Known team members for Hacker Valley Media
  private knownTeam = [
    { name: "Ron Eddings", role: "Co-founder/Host" },
    { name: "Chris Dingman", role: "Co-founder" },
    { name: "Emily", role: "Team Member" },
    { name: "Josh", role: "Team Member" },
    { name: "Brandie", role: "Team Member" },
  ];

  constructor() {
    this.teamPath = `${config.triadPath}/${config.statePath}/team-health.json`;
    this.initializeTeamMembers();
  }

  private initializeTeamMembers(): void {
    for (const member of this.knownTeam) {
      const id = member.name.toLowerCase().replace(/\s+/g, "-");
      this.teamMembers.set(id, {
        id,
        name: member.name,
        role: member.role,
        meetingCount: 0,
        sentimentHistory: [],
        currentWorkload: "unknown",
        blockers: [],
        recentTopics: [],
      });
    }
  }

  /**
   * Extract team data from internal meeting
   */
  extractFromMeeting(meeting: ParsedMeeting): TeamMeeting | null {
    // Only process internal meetings
    if (meeting.meetingType !== "internal") return null;

    const entries = meeting.entries;
    const fullText = entries.map((e) => e.text.toLowerCase()).join(" ");

    // Extract blockers
    const blockers = this.extractBlockers(entries);

    // Extract decisions
    const decisions = this.extractDecisions(entries);

    // Extract action items
    const actionItems = this.extractActionItems(entries);

    // Calculate sentiment
    const overallSentiment = this.calculateSentiment(entries);

    // Extract topics
    const topics = this.extractTopics(entries);

    const teamMeeting: TeamMeeting = {
      id: meeting.id,
      date: meeting.date,
      participants: meeting.participants,
      topics,
      blockers,
      decisions,
      actionItems,
      overallSentiment,
    };

    this.teamMeetings.push(teamMeeting);

    // Update team member data
    this.updateTeamMembers(meeting, overallSentiment);

    return teamMeeting;
  }

  /**
   * Extract blockers from meeting
   */
  private extractBlockers(entries: ParsedMeeting["entries"]): string[] {
    const blockers: string[] = [];
    const blockerKeywords = ["blocked", "waiting", "stuck", "can't", "unable", "issue", "problem", "delay"];

    for (const entry of entries) {
      const text = entry.text.toLowerCase();
      if (blockerKeywords.some((k) => text.includes(k))) {
        blockers.push(`${entry.speaker}: ${entry.text.substring(0, 150)}`);
      }
    }

    return blockers.slice(0, 10);
  }

  /**
   * Extract decisions made
   */
  private extractDecisions(entries: ParsedMeeting["entries"]): string[] {
    const decisions: string[] = [];
    const decisionKeywords = ["decided", "agreed", "will do", "going to", "let's", "plan is"];

    for (const entry of entries) {
      const text = entry.text.toLowerCase();
      if (decisionKeywords.some((k) => text.includes(k))) {
        decisions.push(entry.text.substring(0, 150));
      }
    }

    return decisions.slice(0, 10);
  }

  /**
   * Extract action items
   */
  private extractActionItems(entries: ParsedMeeting["entries"]): string[] {
    const actionItems: string[] = [];
    const actionKeywords = ["will", "going to", "need to", "should", "i'll", "let me"];

    for (const entry of entries) {
      const text = entry.text.toLowerCase();
      if (actionKeywords.some((k) => text.includes(k))) {
        actionItems.push(`${entry.speaker}: ${entry.text.substring(0, 150)}`);
      }
    }

    return actionItems.slice(0, 15);
  }

  /**
   * Extract meeting topics
   */
  private extractTopics(entries: ParsedMeeting["entries"]): string[] {
    const fullText = entries.map((e) => e.text.toLowerCase()).join(" ");
    const topics: Set<string> = new Set();

    const topicKeywords = [
      "project", "deadline", "release", "content", "episode", "sponsor",
      "client", "marketing", "website", "social", "event", "conference",
      "budget", "revenue", "hiring", "tool", "process"
    ];

    for (const keyword of topicKeywords) {
      if (fullText.includes(keyword)) {
        topics.add(keyword);
      }
    }

    return [...topics];
  }

  /**
   * Calculate overall sentiment of meeting
   */
  private calculateSentiment(entries: ParsedMeeting["entries"]): number {
    const fullText = entries.map((e) => e.text.toLowerCase()).join(" ");

    const positiveWords = ["great", "awesome", "good", "excellent", "happy", "excited", "love", "perfect", "amazing"];
    const negativeWords = ["bad", "frustrated", "annoyed", "worried", "concerned", "difficult", "problem", "issue", "delay"];

    let score = 0;
    for (const word of positiveWords) {
      const matches = fullText.match(new RegExp(word, "g"));
      if (matches) score += matches.length * 0.1;
    }

    for (const word of negativeWords) {
      const matches = fullText.match(new RegExp(word, "g"));
      if (matches) score -= matches.length * 0.1;
    }

    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Update team member data from meeting
   */
  private updateTeamMembers(meeting: ParsedMeeting, sentiment: number): void {
    for (const participant of meeting.participants) {
      const memberId = participant.toLowerCase().replace(/\s+/g, "-");
      let member = this.teamMembers.get(memberId);

      if (!member) {
        // Add new team member if not known
        member = {
          id: memberId,
          name: participant,
          meetingCount: 0,
          sentimentHistory: [],
          currentWorkload: "unknown",
          blockers: [],
          recentTopics: [],
        };
        this.teamMembers.set(memberId, member);
      }

      member.meetingCount++;
      member.lastMeetingDate = meeting.date;
      member.sentimentHistory.push({ date: meeting.date, sentiment });

      // Keep only last 20 sentiment entries
      if (member.sentimentHistory.length > 20) {
        member.sentimentHistory = member.sentimentHistory.slice(-20);
      }

      // Update recent topics
      member.recentTopics = [...new Set([...member.recentTopics, ...meeting.topics])].slice(-10);

      // Estimate workload from language
      const memberEntries = meeting.entries.filter((e) =>
        e.speaker.toLowerCase().includes(participant.toLowerCase())
      );
      const memberText = memberEntries.map((e) => e.text.toLowerCase()).join(" ");

      if (memberText.includes("swamped") || memberText.includes("overwhelmed") || memberText.includes("too much")) {
        member.currentWorkload = "overloaded";
      } else if (memberText.includes("busy") || memberText.includes("lot going on")) {
        member.currentWorkload = "high";
      } else if (memberText.includes("caught up") || memberText.includes("good pace")) {
        member.currentWorkload = "normal";
      }

      // Extract member-specific blockers
      const blockerKeywords = ["blocked", "waiting", "stuck", "can't"];
      for (const entry of memberEntries) {
        if (blockerKeywords.some((k) => entry.text.toLowerCase().includes(k))) {
          member.blockers.push(entry.text.substring(0, 100));
        }
      }
      member.blockers = member.blockers.slice(-5);
    }
  }

  /**
   * Generate team health indicators
   */
  generateHealthIndicators(): TeamHealthIndicators {
    const members = Array.from(this.teamMembers.values());
    const recentMeetings = this.teamMeetings.slice(-10);

    // Calculate overall health from sentiment
    const avgSentiment = recentMeetings.length > 0
      ? recentMeetings.reduce((sum, m) => sum + m.overallSentiment, 0) / recentMeetings.length
      : 0;
    const overallHealth = (avgSentiment + 1) / 2; // Convert -1..1 to 0..1

    // Calculate workload balance
    const workloadCounts = { low: 0, normal: 0, high: 0, overloaded: 0, unknown: 0 };
    for (const member of members) {
      workloadCounts[member.currentWorkload]++;
    }
    const workloadBalance = members.length > 0
      ? (workloadCounts.normal + workloadCounts.low) / members.length
      : 0.5;

    // Calculate communication flow (meeting frequency)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentMeetingCount = this.teamMeetings.filter((m) => m.date >= thirtyDaysAgo).length;
    const communicationFlow = Math.min(1, recentMeetingCount / 8); // Expect ~2 meetings/week

    // Collect all blockers
    const allBlockers = recentMeetings.flatMap((m) => m.blockers);

    // Determine trends
    const recentSentiments = recentMeetings.slice(-5).map((m) => m.overallSentiment);
    const olderSentiments = recentMeetings.slice(-10, -5).map((m) => m.overallSentiment);
    const recentAvg = recentSentiments.length > 0
      ? recentSentiments.reduce((a, b) => a + b, 0) / recentSentiments.length
      : 0;
    const olderAvg = olderSentiments.length > 0
      ? olderSentiments.reduce((a, b) => a + b, 0) / olderSentiments.length
      : 0;

    let sentimentTrend: "improving" | "stable" | "declining" = "stable";
    if (recentAvg > olderAvg + 0.2) sentimentTrend = "improving";
    else if (recentAvg < olderAvg - 0.2) sentimentTrend = "declining";

    return {
      overallHealth,
      workloadBalance,
      communicationFlow,
      blockerCount: allBlockers.length,
      unresolvedIssues: allBlockers.slice(0, 5),
      trends: {
        sentimentTrend,
        workloadTrend: "stable", // TODO: Calculate from workload history
      },
    };
  }

  /**
   * Get all team members
   */
  getTeamMembers(): TeamMember[] {
    return Array.from(this.teamMembers.values());
  }

  /**
   * Get recent meetings
   */
  getRecentMeetings(count: number = 10): TeamMeeting[] {
    return this.teamMeetings
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, count);
  }

  /**
   * Load team data from disk
   */
  async loadTeamData(): Promise<void> {
    try {
      const file = Bun.file(this.teamPath);
      if (await file.exists()) {
        const data = await file.json();

        // Load team members
        for (const member of data.members || []) {
          this.teamMembers.set(member.id, {
            ...member,
            lastMeetingDate: member.lastMeetingDate ? new Date(member.lastMeetingDate) : undefined,
            sentimentHistory: (member.sentimentHistory || []).map((s: any) => ({
              ...s,
              date: new Date(s.date),
            })),
          });
        }

        // Load meetings
        this.teamMeetings = (data.meetings || []).map((m: any) => ({
          ...m,
          date: new Date(m.date),
        }));

        await logger.debug("team_data_loaded", {
          members: this.teamMembers.size,
          meetings: this.teamMeetings.length,
        });
      }
    } catch (error) {
      await logger.warn("team_data_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save team data to disk
   */
  async saveTeamData(): Promise<void> {
    try {
      const data = {
        members: Array.from(this.teamMembers.values()),
        meetings: this.teamMeetings,
        lastUpdated: new Date().toISOString(),
      };
      await Bun.write(this.teamPath, JSON.stringify(data, null, 2));
    } catch (error) {
      await logger.error("team_data_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const teamExtractor = new TeamExtractor();
