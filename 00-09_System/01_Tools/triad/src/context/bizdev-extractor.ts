// Business Development Extractor
// Identifies sales opportunities and tracks prospects from meetings

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { meetingParser, type ParsedMeeting } from "./meeting-parser";

export interface Prospect {
  id: string;
  name: string;
  company?: string;
  source: "meeting" | "email" | "referral" | "inbound" | "unknown";
  firstContactDate: Date;
  lastContactDate: Date;
  stage: "discovery" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost" | "stale";
  score: number; // 0-100
  estimatedValue?: number;
  signals: ProspectSignal[];
  nextAction?: string;
  notes: string[];
}

export interface ProspectSignal {
  type: "budget" | "authority" | "need" | "timeline" | "interest" | "objection";
  content: string;
  confidence: number;
  date: Date;
  source: string;
}

export interface PipelineSummary {
  totalProspects: number;
  byStage: Record<string, number>;
  totalEstimatedValue: number;
  staleCount: number;
  hotProspects: Prospect[];
  needsFollowUp: Prospect[];
}

class BizdevExtractor {
  private prospects: Map<string, Prospect> = new Map();
  private prospectsPath: string;

  constructor() {
    this.prospectsPath = `${config.triadPath}/${config.statePath}/prospects.json`;
  }

  /**
   * Extract business development signals from a meeting
   */
  extractFromMeeting(meeting: ParsedMeeting): ProspectSignal[] {
    const signals: ProspectSignal[] = [];
    const entries = meeting.entries;
    const fullText = entries.map(e => e.text.toLowerCase()).join(" ");

    // Budget signals
    if (fullText.includes("budget") || fullText.includes("$") || fullText.includes("cost") || fullText.includes("price")) {
      const budgetEntries = entries.filter(e =>
        e.text.toLowerCase().includes("budget") ||
        e.text.includes("$") ||
        e.text.toLowerCase().includes("cost")
      );
      for (const entry of budgetEntries.slice(0, 3)) {
        signals.push({
          type: "budget",
          content: entry.text.substring(0, 200),
          confidence: 0.7,
          date: meeting.date,
          source: meeting.id,
        });
      }
    }

    // Authority signals
    if (fullText.includes("decision") || fullText.includes("approve") || fullText.includes("sign off")) {
      const authEntries = entries.filter(e =>
        e.text.toLowerCase().includes("decision") ||
        e.text.toLowerCase().includes("approve")
      );
      for (const entry of authEntries.slice(0, 3)) {
        signals.push({
          type: "authority",
          content: entry.text.substring(0, 200),
          confidence: 0.6,
          date: meeting.date,
          source: meeting.id,
        });
      }
    }

    // Need signals
    if (fullText.includes("need") || fullText.includes("looking for") || fullText.includes("require") || fullText.includes("want")) {
      const needEntries = entries.filter(e =>
        e.text.toLowerCase().includes("need") ||
        e.text.toLowerCase().includes("looking for") ||
        e.text.toLowerCase().includes("require")
      );
      for (const entry of needEntries.slice(0, 5)) {
        signals.push({
          type: "need",
          content: entry.text.substring(0, 200),
          confidence: 0.8,
          date: meeting.date,
          source: meeting.id,
        });
      }
    }

    // Timeline signals
    if (fullText.includes("when") || fullText.includes("deadline") || fullText.includes("quarter") || fullText.includes("month")) {
      const timelineEntries = entries.filter(e =>
        e.text.toLowerCase().includes("deadline") ||
        e.text.toLowerCase().includes("quarter") ||
        e.text.toLowerCase().includes("by the end of")
      );
      for (const entry of timelineEntries.slice(0, 3)) {
        signals.push({
          type: "timeline",
          content: entry.text.substring(0, 200),
          confidence: 0.7,
          date: meeting.date,
          source: meeting.id,
        });
      }
    }

    // Interest signals
    if (fullText.includes("interested") || fullText.includes("excited") || fullText.includes("love") || fullText.includes("great")) {
      const interestEntries = entries.filter(e =>
        e.text.toLowerCase().includes("interested") ||
        e.text.toLowerCase().includes("excited") ||
        e.text.toLowerCase().includes("love")
      );
      for (const entry of interestEntries.slice(0, 3)) {
        signals.push({
          type: "interest",
          content: entry.text.substring(0, 200),
          confidence: 0.6,
          date: meeting.date,
          source: meeting.id,
        });
      }
    }

    // Objection signals
    if (fullText.includes("concern") || fullText.includes("worry") || fullText.includes("not sure") || fullText.includes("hesitant")) {
      const objectionEntries = entries.filter(e =>
        e.text.toLowerCase().includes("concern") ||
        e.text.toLowerCase().includes("worry") ||
        e.text.toLowerCase().includes("not sure")
      );
      for (const entry of objectionEntries.slice(0, 3)) {
        signals.push({
          type: "objection",
          content: entry.text.substring(0, 200),
          confidence: 0.7,
          date: meeting.date,
          source: meeting.id,
        });
      }
    }

    return signals;
  }

  /**
   * Calculate prospect score based on signals
   */
  calculateScore(signals: ProspectSignal[]): number {
    let score = 50; // Base score

    const typeWeights: Record<ProspectSignal["type"], number> = {
      budget: 15,
      authority: 12,
      need: 20,
      timeline: 15,
      interest: 10,
      objection: -8,
    };

    for (const signal of signals) {
      score += typeWeights[signal.type] * signal.confidence;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determine prospect stage from signals
   */
  determineStage(signals: ProspectSignal[], daysSinceLastContact: number): Prospect["stage"] {
    if (daysSinceLastContact > 45) return "stale";

    const hasNeed = signals.some(s => s.type === "need");
    const hasBudget = signals.some(s => s.type === "budget");
    const hasAuthority = signals.some(s => s.type === "authority");
    const hasTimeline = signals.some(s => s.type === "timeline");

    // Count strong signals
    const strongSignals = [hasNeed, hasBudget, hasAuthority, hasTimeline].filter(Boolean).length;

    if (strongSignals >= 4) return "negotiation";
    if (strongSignals >= 3) return "proposal";
    if (strongSignals >= 2) return "qualification";
    return "discovery";
  }

  /**
   * Create or update prospect from meeting data
   */
  async updateProspect(
    prospectId: string,
    name: string,
    signals: ProspectSignal[],
    meetingDate: Date,
    company?: string
  ): Promise<Prospect> {
    let prospect = this.prospects.get(prospectId);

    if (!prospect) {
      prospect = {
        id: prospectId,
        name,
        company,
        source: "meeting",
        firstContactDate: meetingDate,
        lastContactDate: meetingDate,
        stage: "discovery",
        score: 50,
        signals: [],
        notes: [],
      };
    }

    // Update with new data
    prospect.lastContactDate = meetingDate > prospect.lastContactDate ? meetingDate : prospect.lastContactDate;
    prospect.signals = [...prospect.signals, ...signals];
    prospect.score = this.calculateScore(prospect.signals);

    const daysSinceLastContact = (Date.now() - prospect.lastContactDate.getTime()) / (1000 * 60 * 60 * 24);
    prospect.stage = this.determineStage(prospect.signals, daysSinceLastContact);

    this.prospects.set(prospectId, prospect);
    return prospect;
  }

  /**
   * Get stale prospects (no contact in 45+ days, not closed)
   */
  getStaleProspects(): Prospect[] {
    return Array.from(this.prospects.values()).filter(
      p => p.stage === "stale"
    );
  }

  /**
   * Get hot prospects (score > 70, active)
   */
  getHotProspects(): Prospect[] {
    return Array.from(this.prospects.values())
      .filter(p => p.score >= 70 && p.stage !== "stale" && !p.stage.startsWith("closed"))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get prospects needing follow-up
   */
  getProspectsNeedingFollowUp(): Prospect[] {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return Array.from(this.prospects.values()).filter(
      p => p.lastContactDate < thirtyDaysAgo &&
           p.stage !== "stale" &&
           !p.stage.startsWith("closed")
    );
  }

  /**
   * Generate pipeline summary
   */
  generatePipelineSummary(): PipelineSummary {
    const prospects = Array.from(this.prospects.values());
    const byStage: Record<string, number> = {};

    for (const prospect of prospects) {
      byStage[prospect.stage] = (byStage[prospect.stage] || 0) + 1;
    }

    const totalEstimatedValue = prospects
      .filter(p => p.estimatedValue && !p.stage.startsWith("closed_lost") && p.stage !== "stale")
      .reduce((sum, p) => sum + (p.estimatedValue || 0), 0);

    return {
      totalProspects: prospects.length,
      byStage,
      totalEstimatedValue,
      staleCount: this.getStaleProspects().length,
      hotProspects: this.getHotProspects().slice(0, 5),
      needsFollowUp: this.getProspectsNeedingFollowUp().slice(0, 5),
    };
  }

  /**
   * Load prospects from disk
   */
  async loadProspects(): Promise<void> {
    try {
      const file = Bun.file(this.prospectsPath);
      if (await file.exists()) {
        const data = await file.json();
        for (const prospect of data.prospects || []) {
          this.prospects.set(prospect.id, {
            ...prospect,
            firstContactDate: new Date(prospect.firstContactDate),
            lastContactDate: new Date(prospect.lastContactDate),
            signals: prospect.signals.map((s: any) => ({
              ...s,
              date: new Date(s.date),
            })),
          });
        }
        await logger.debug("prospects_loaded", { count: this.prospects.size });
      }
    } catch (error) {
      await logger.warn("prospects_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save prospects to disk
   */
  async saveProspects(): Promise<void> {
    try {
      const data = {
        prospects: Array.from(this.prospects.values()),
        lastUpdated: new Date().toISOString(),
      };
      await Bun.write(this.prospectsPath, JSON.stringify(data, null, 2));
    } catch (error) {
      await logger.error("prospects_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Get all prospects
   */
  getAllProspects(): Prospect[] {
    return Array.from(this.prospects.values());
  }
}

export const bizdevExtractor = new BizdevExtractor();
