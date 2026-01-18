// Client Extractor
// Extracts client relationship data from meetings

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { meetingParser, type ParsedMeeting, type MeetingMetadata } from "./meeting-parser";

export interface ClientProfile {
  id: string;
  name: string;
  company?: string;
  firstContact: Date;
  lastContact: Date;
  meetingCount: number;
  totalDuration: number; // seconds
  topics: string[];
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  relationshipHealth: number; // 0-1 scale
  dormant: boolean;
  needsFollowUp: boolean;
  notes: string[];
}

export interface ClientMeetingData {
  clientId: string;
  meetingId: string;
  date: Date;
  duration: number;
  topics: string[];
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  keyPoints: string[];
  actionItems: string[];
}

class ClientExtractor {
  private clientProfiles: Map<string, ClientProfile> = new Map();
  private profilesPath: string;

  constructor() {
    this.profilesPath = `${config.triadPath}/${config.statePath}/client-profiles.json`;
  }

  /**
   * Extract client data from a parsed meeting
   */
  extractFromMeeting(meeting: ParsedMeeting): ClientMeetingData[] {
    const clients: ClientMeetingData[] = [];
    const fullText = meeting.entries.map(e => e.text.toLowerCase()).join(" ");

    // Skip non-client meetings
    if (meeting.meetingType !== "client" && meeting.meetingType !== "sales") {
      return clients;
    }

    // Identify potential client participants (non-team members)
    const knownTeam = ["ron", "eddings", "chris", "emily", "josh", "brandie"];
    const potentialClients = meeting.participants.filter(
      p => !knownTeam.some(t => p.toLowerCase().includes(t))
    );

    for (const clientName of potentialClients) {
      const clientId = this.normalizeClientId(clientName);

      // Extract topics mentioned
      const topics = this.extractTopics(meeting.entries);

      // Analyze sentiment
      const sentiment = this.analyzeSentiment(meeting.entries, clientName);

      // Extract key points
      const keyPoints = this.extractKeyPoints(meeting.entries);

      // Extract action items
      const actionItems = this.extractActionItems(meeting.entries);

      clients.push({
        clientId,
        meetingId: meeting.id,
        date: meeting.date,
        duration: meeting.duration,
        topics,
        sentiment,
        keyPoints,
        actionItems,
      });
    }

    return clients;
  }

  /**
   * Normalize client name to ID
   */
  private normalizeClientId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  }

  /**
   * Extract topics from meeting entries
   */
  private extractTopics(entries: ParsedMeeting["entries"]): string[] {
    const fullText = entries.map(e => e.text.toLowerCase()).join(" ");
    const topics: Set<string> = new Set();

    const topicKeywords = [
      "budget", "timeline", "deadline", "scope", "deliverable",
      "requirement", "feature", "integration", "security", "compliance",
      "training", "support", "maintenance", "contract", "pricing",
      "proposal", "strategy", "roadmap", "milestone"
    ];

    for (const keyword of topicKeywords) {
      if (fullText.includes(keyword)) {
        topics.add(keyword);
      }
    }

    return [...topics];
  }

  /**
   * Analyze sentiment of meeting for a specific participant
   */
  private analyzeSentiment(
    entries: ParsedMeeting["entries"],
    participant: string
  ): ClientMeetingData["sentiment"] {
    const participantEntries = entries.filter(
      e => e.speaker.toLowerCase().includes(participant.toLowerCase())
    );

    const text = participantEntries.map(e => e.text.toLowerCase()).join(" ");

    const positiveWords = ["great", "excellent", "happy", "pleased", "love", "perfect", "amazing", "thank"];
    const negativeWords = ["concerned", "worried", "issue", "problem", "disappointed", "frustrated", "delay"];

    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of positiveWords) {
      if (text.includes(word)) positiveCount++;
    }

    for (const word of negativeWords) {
      if (text.includes(word)) negativeCount++;
    }

    if (positiveCount > negativeCount + 2) return "positive";
    if (negativeCount > positiveCount + 2) return "negative";
    if (positiveCount > 0 || negativeCount > 0) return "neutral";
    return "unknown";
  }

  /**
   * Extract key discussion points
   */
  private extractKeyPoints(entries: ParsedMeeting["entries"]): string[] {
    const keyPoints: string[] = [];

    for (const entry of entries) {
      const text = entry.text.toLowerCase();

      // Look for important phrases
      if (
        text.includes("need to") ||
        text.includes("should") ||
        text.includes("important") ||
        text.includes("priority") ||
        text.includes("decision") ||
        text.includes("agree")
      ) {
        keyPoints.push(entry.text.substring(0, 100));
      }
    }

    return keyPoints.slice(0, 10);
  }

  /**
   * Extract action items from meeting
   */
  private extractActionItems(entries: ParsedMeeting["entries"]): string[] {
    const actionItems: string[] = [];

    for (const entry of entries) {
      const text = entry.text.toLowerCase();

      // Look for action item patterns
      if (
        text.includes("will") ||
        text.includes("going to") ||
        text.includes("let me") ||
        text.includes("i'll") ||
        text.includes("follow up") ||
        text.includes("send") ||
        text.includes("schedule")
      ) {
        actionItems.push(entry.text.substring(0, 100));
      }
    }

    return actionItems.slice(0, 10);
  }

  /**
   * Build client profile from meeting history
   */
  async buildClientProfile(clientId: string): Promise<ClientProfile | null> {
    const meetings = meetingParser.getMeetingsByParticipant(clientId);
    if (meetings.length === 0) return null;

    const sortedMeetings = meetings.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstContact = new Date(sortedMeetings[0].date);
    const lastContact = new Date(sortedMeetings[sortedMeetings.length - 1].date);
    const totalDuration = meetings.reduce((sum, m) => sum + m.duration, 0);

    // Collect all topics
    const allTopics: Set<string> = new Set();
    for (const meeting of meetings) {
      // Parse each meeting for topics
      const parsed = await meetingParser.parseTranscript(meeting.filePath);
      if (parsed) {
        for (const topic of parsed.topics) {
          allTopics.add(topic);
        }
      }
    }

    // Calculate relationship health
    const daysSinceLastContact = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60 * 24);
    let relationshipHealth = 1;

    if (daysSinceLastContact > 90) relationshipHealth = 0.3;
    else if (daysSinceLastContact > 60) relationshipHealth = 0.5;
    else if (daysSinceLastContact > 30) relationshipHealth = 0.7;
    else if (daysSinceLastContact > 14) relationshipHealth = 0.9;

    // Adjust for meeting frequency
    const meetingsPerMonth = meetings.length / Math.max(1, (Date.now() - firstContact.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (meetingsPerMonth >= 2) relationshipHealth = Math.min(1, relationshipHealth + 0.1);

    const profile: ClientProfile = {
      id: clientId,
      name: clientId.replace(/-/g, " "),
      firstContact,
      lastContact,
      meetingCount: meetings.length,
      totalDuration,
      topics: [...allTopics],
      sentiment: "unknown",
      relationshipHealth,
      dormant: daysSinceLastContact > 60,
      needsFollowUp: daysSinceLastContact > 30 && daysSinceLastContact <= 60,
      notes: [],
    };

    this.clientProfiles.set(clientId, profile);
    return profile;
  }

  /**
   * Get dormant clients (no contact in 60+ days)
   */
  getDormantClients(): ClientProfile[] {
    return Array.from(this.clientProfiles.values()).filter(c => c.dormant);
  }

  /**
   * Get clients needing follow-up
   */
  getClientsNeedingFollowUp(): ClientProfile[] {
    return Array.from(this.clientProfiles.values()).filter(c => c.needsFollowUp);
  }

  /**
   * Get all client profiles
   */
  getAllProfiles(): ClientProfile[] {
    return Array.from(this.clientProfiles.values());
  }

  /**
   * Load profiles from disk
   */
  async loadProfiles(): Promise<void> {
    try {
      const file = Bun.file(this.profilesPath);
      if (await file.exists()) {
        const data = await file.json();
        for (const profile of data.profiles || []) {
          this.clientProfiles.set(profile.id, {
            ...profile,
            firstContact: new Date(profile.firstContact),
            lastContact: new Date(profile.lastContact),
          });
        }
        await logger.debug("client_profiles_loaded", { count: this.clientProfiles.size });
      }
    } catch (error) {
      await logger.warn("client_profiles_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save profiles to disk
   */
  async saveProfiles(): Promise<void> {
    try {
      const data = {
        profiles: Array.from(this.clientProfiles.values()),
        lastUpdated: new Date().toISOString(),
      };
      await Bun.write(this.profilesPath, JSON.stringify(data, null, 2));
    } catch (error) {
      await logger.error("client_profiles_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalClients: number;
    dormantCount: number;
    needsFollowUpCount: number;
    avgRelationshipHealth: number;
  } {
    const profiles = Array.from(this.clientProfiles.values());
    const avgHealth = profiles.length > 0
      ? profiles.reduce((sum, p) => sum + p.relationshipHealth, 0) / profiles.length
      : 0;

    return {
      totalClients: profiles.length,
      dormantCount: this.getDormantClients().length,
      needsFollowUpCount: this.getClientsNeedingFollowUp().length,
      avgRelationshipHealth: avgHealth,
    };
  }
}

export const clientExtractor = new ClientExtractor();
