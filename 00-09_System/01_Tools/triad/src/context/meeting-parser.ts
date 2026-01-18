// Meeting Parser
// Parses meeting transcripts from VRAM to extract structured data

import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface MeetingEntry {
  timestamp: string; // MM:SS format
  speaker: string;
  text: string;
}

export interface ParsedMeeting {
  id: string;
  filePath: string;
  date: Date;
  duration: number; // seconds
  participants: string[];
  entries: MeetingEntry[];
  wordCount: number;
  speakerWordCounts: Record<string, number>;
  topics: string[]; // extracted topics/keywords
  meetingType: "internal" | "client" | "podcast" | "sales" | "unknown";
}

export interface MeetingMetadata {
  id: string;
  filePath: string;
  date: string;
  duration: number;
  participants: string[];
  wordCount: number;
  meetingType: string;
  lastAnalyzed: string;
}

class MeetingParser {
  private transcriptsPath: string;
  private indexPath: string;
  private meetingsIndex: Map<string, MeetingMetadata> = new Map();

  constructor() {
    this.transcriptsPath = "/Volumes/VRAM/10-19_Work/13_Meetings/13.01_transcripts";
    this.indexPath = `${config.triadPath}/${config.statePath}/meetings-index.json`;
  }

  /**
   * Parse a single transcript file
   */
  async parseTranscript(filePath: string): Promise<ParsedMeeting | null> {
    try {
      const file = Bun.file(filePath);
      if (!(await file.exists())) {
        return null;
      }

      const content = await file.text();
      const lines = content.split("\n").filter((l) => l.trim());

      // Parse entries
      const entries: MeetingEntry[] = [];
      const linePattern = /^\[(\d{2}:\d{2})\]\s+([^:]+):\s*(.*)$/;

      for (const line of lines) {
        const match = line.match(linePattern);
        if (match) {
          entries.push({
            timestamp: match[1],
            speaker: match[2].trim(),
            text: match[3].trim(),
          });
        }
      }

      if (entries.length === 0) {
        return null;
      }

      // Extract metadata
      const participants = [...new Set(entries.map((e) => e.speaker))];
      const wordCount = entries.reduce(
        (sum, e) => sum + e.text.split(/\s+/).length,
        0
      );

      // Calculate speaker word counts
      const speakerWordCounts: Record<string, number> = {};
      for (const entry of entries) {
        const words = entry.text.split(/\s+/).length;
        speakerWordCounts[entry.speaker] =
          (speakerWordCounts[entry.speaker] || 0) + words;
      }

      // Calculate duration from last timestamp
      const lastTimestamp = entries[entries.length - 1].timestamp;
      const [mins, secs] = lastTimestamp.split(":").map(Number);
      const duration = mins * 60 + secs;

      // Extract date from filename
      const filename = filePath.split("/").pop() || "";
      const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? new Date(dateMatch[1]) : new Date();

      // Generate ID from filename
      const id = filename.replace(".md", "");

      // Detect meeting type
      const meetingType = this.detectMeetingType(entries, participants);

      // Extract topics (simple keyword extraction)
      const topics = this.extractTopics(entries);

      return {
        id,
        filePath,
        date,
        duration,
        participants,
        entries,
        wordCount,
        speakerWordCounts,
        topics,
        meetingType,
      };
    } catch (error) {
      await logger.error("meeting_parse_error", {
        filePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Detect meeting type based on content and participants
   */
  private detectMeetingType(
    entries: MeetingEntry[],
    participants: string[]
  ): ParsedMeeting["meetingType"] {
    const fullText = entries.map((e) => e.text.toLowerCase()).join(" ");

    // Check for podcast indicators
    if (
      fullText.includes("podcast") ||
      fullText.includes("episode") ||
      fullText.includes("listeners") ||
      fullText.includes("hacker valley")
    ) {
      return "podcast";
    }

    // Check for sales/bizdev indicators
    if (
      fullText.includes("proposal") ||
      fullText.includes("quote") ||
      fullText.includes("contract") ||
      fullText.includes("budget") ||
      fullText.includes("pricing")
    ) {
      return "sales";
    }

    // Check for client indicators
    if (
      fullText.includes("deliverable") ||
      fullText.includes("project") ||
      fullText.includes("deadline") ||
      fullText.includes("client")
    ) {
      return "client";
    }

    // Check for internal indicators (team members)
    const knownTeam = ["ron", "chris", "emily", "josh", "brandie"];
    const hasTeamMembers = participants.some((p) =>
      knownTeam.some((t) => p.toLowerCase().includes(t))
    );

    if (
      hasTeamMembers &&
      (fullText.includes("team") ||
        fullText.includes("sprint") ||
        fullText.includes("standup"))
    ) {
      return "internal";
    }

    return "unknown";
  }

  /**
   * Extract topics/keywords from meeting entries
   */
  private extractTopics(entries: MeetingEntry[]): string[] {
    const fullText = entries.map((e) => e.text.toLowerCase()).join(" ");
    const topics: Set<string> = new Set();

    // Business keywords
    const businessKeywords = [
      "revenue",
      "budget",
      "client",
      "project",
      "deadline",
      "deliverable",
      "sponsor",
      "partnership",
      "marketing",
      "content",
      "podcast",
      "episode",
      "security",
      "cybersecurity",
      "hacker",
      "conference",
      "event",
    ];

    for (const keyword of businessKeywords) {
      if (fullText.includes(keyword)) {
        topics.add(keyword);
      }
    }

    return [...topics];
  }

  /**
   * Scan all transcripts and build index
   */
  async buildIndex(): Promise<number> {
    try {
      const years = ["2024", "2025", "2026"];
      let count = 0;

      for (const year of years) {
        const yearPath = `${this.transcriptsPath}/${year}`;
        const dir = Bun.file(yearPath);

        // Use glob to find all .md files
        const glob = new Bun.Glob("*.md");
        for await (const file of glob.scan({ cwd: yearPath, absolute: true })) {
          const meeting = await this.parseTranscript(file);
          if (meeting) {
            this.meetingsIndex.set(meeting.id, {
              id: meeting.id,
              filePath: meeting.filePath,
              date: meeting.date.toISOString(),
              duration: meeting.duration,
              participants: meeting.participants,
              wordCount: meeting.wordCount,
              meetingType: meeting.meetingType,
              lastAnalyzed: new Date().toISOString(),
            });
            count++;
          }
        }
      }

      await this.saveIndex();
      await logger.info("meetings_index_built", { count });
      return count;
    } catch (error) {
      await logger.error("meetings_index_build_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return 0;
    }
  }

  /**
   * Load index from disk
   */
  async loadIndex(): Promise<void> {
    try {
      const file = Bun.file(this.indexPath);
      if (await file.exists()) {
        const data = await file.json();
        for (const meeting of data.meetings || []) {
          this.meetingsIndex.set(meeting.id, meeting);
        }
        await logger.debug("meetings_index_loaded", {
          count: this.meetingsIndex.size,
        });
      }
    } catch (error) {
      await logger.warn("meetings_index_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save index to disk
   */
  async saveIndex(): Promise<void> {
    try {
      const data = {
        meetings: Array.from(this.meetingsIndex.values()),
        lastUpdated: new Date().toISOString(),
        totalCount: this.meetingsIndex.size,
      };
      await Bun.write(this.indexPath, JSON.stringify(data, null, 2));
    } catch (error) {
      await logger.error("meetings_index_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get meetings by type
   */
  getMeetingsByType(type: ParsedMeeting["meetingType"]): MeetingMetadata[] {
    return Array.from(this.meetingsIndex.values()).filter(
      (m) => m.meetingType === type
    );
  }

  /**
   * Get meetings by participant
   */
  getMeetingsByParticipant(participant: string): MeetingMetadata[] {
    const searchTerm = participant.toLowerCase();
    return Array.from(this.meetingsIndex.values()).filter((m) =>
      m.participants.some((p) => p.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get meetings in date range
   */
  getMeetingsInRange(startDate: Date, endDate: Date): MeetingMetadata[] {
    return Array.from(this.meetingsIndex.values()).filter((m) => {
      const date = new Date(m.date);
      return date >= startDate && date <= endDate;
    });
  }

  /**
   * Get recent meetings
   */
  getRecentMeetings(count: number = 10): MeetingMetadata[] {
    return Array.from(this.meetingsIndex.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }

  /**
   * Get meeting frequency per participant
   */
  getParticipantFrequency(): Record<string, number> {
    const frequency: Record<string, number> = {};
    for (const meeting of this.meetingsIndex.values()) {
      for (const participant of meeting.participants) {
        frequency[participant] = (frequency[participant] || 0) + 1;
      }
    }
    return frequency;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalMeetings: number;
    byType: Record<string, number>;
    byMonth: Record<string, number>;
    topParticipants: { name: string; count: number }[];
    averageDuration: number;
  } {
    const meetings = Array.from(this.meetingsIndex.values());
    const byType: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    let totalDuration = 0;

    for (const meeting of meetings) {
      byType[meeting.meetingType] = (byType[meeting.meetingType] || 0) + 1;
      const month = meeting.date.substring(0, 7); // YYYY-MM
      byMonth[month] = (byMonth[month] || 0) + 1;
      totalDuration += meeting.duration;
    }

    const frequency = this.getParticipantFrequency();
    const topParticipants = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalMeetings: meetings.length,
      byType,
      byMonth,
      topParticipants,
      averageDuration: meetings.length > 0 ? totalDuration / meetings.length : 0,
    };
  }
}

export const meetingParser = new MeetingParser();
