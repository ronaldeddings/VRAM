// Email Revenue Extractor
// Extracts revenue signals, cold leads, and sponsor inquiries from emails

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { emailParser, type ParsedEmail, type Contact } from "./email-parser";

export interface RevenueSignal {
  id: string;
  type: "inquiry" | "proposal" | "negotiation" | "closed" | "renewal" | "upsell";
  source: "email";
  email: ParsedEmail;
  contact: Contact | undefined;
  signals: string[];
  estimatedValue: "low" | "medium" | "high" | "unknown";
  urgency: "low" | "medium" | "high";
  confidence: number;
  extractedAt: Date;
}

export interface ColdLead {
  contact: Contact;
  lastEmail: ParsedEmail;
  daysSinceContact: number;
  previousEngagement: "high" | "medium" | "low";
  revenueSignals: string[];
  reengagementPriority: number; // 0-1
  suggestedAction: string;
}

export interface SponsorInquiry {
  id: string;
  email: ParsedEmail;
  contact: Contact | undefined;
  company: string;
  inquiryType: "new" | "renewal" | "expansion" | "general";
  signals: string[];
  followUpStatus: "pending" | "responded" | "closed";
  estimatedValue: "low" | "medium" | "high" | "unknown";
  extractedAt: Date;
}

export interface ReengagementOpportunity {
  contact: Contact;
  reason: string;
  lastContact: Date;
  suggestedApproach: string;
  priority: number; // 0-1
  relatedEmails: ParsedEmail[];
}

// Revenue signal keywords
const REVENUE_KEYWORDS = {
  inquiry: [
    "interested in", "looking for", "can you help", "want to discuss",
    "exploring options", "considering", "need assistance", "quote",
    "pricing", "cost", "budget", "investment",
  ],
  proposal: [
    "proposal", "quote", "estimate", "scope", "deliverables",
    "timeline", "project plan", "statement of work", "sow",
  ],
  negotiation: [
    "negotiate", "terms", "contract", "agreement", "discount",
    "counter offer", "revision", "adjust", "modify terms",
  ],
  closed: [
    "signed", "approved", "confirmed", "deal", "partnership",
    "proceed", "move forward", "accepted", "agreement signed",
  ],
  renewal: [
    "renewal", "renew", "continue", "extend", "another year",
    "re-sign", "ongoing", "next phase",
  ],
  upsell: [
    "additional", "expand", "more services", "upgrade", "increase",
    "add on", "extra", "enhancement", "scale up",
  ],
};

// Sponsor-specific keywords for Hacker Valley Media
const SPONSOR_KEYWORDS = [
  "sponsor", "sponsorship", "advertise", "advertising", "ad placement",
  "podcast ad", "episode sponsor", "media buy", "brand partnership",
  "influencer", "collaboration", "promotion", "campaign", "ad read",
  "pre-roll", "mid-roll", "post-roll", "banner", "placement",
];

// High-value domain indicators
const HIGH_VALUE_DOMAINS = [
  "google.com", "microsoft.com", "amazon.com", "salesforce.com",
  "ibm.com", "oracle.com", "cisco.com", "vmware.com", "crowdstrike.com",
  "paloaltonetworks.com", "fortinet.com", "splunk.com", "elastic.co",
  "datadog.com", "cloudflare.com", "hashicorp.com", "snyk.io",
];

class EmailRevenueExtractor {
  private revenueSignals: RevenueSignal[] = [];
  private coldLeads: ColdLead[] = [];
  private sponsorInquiries: SponsorInquiry[] = [];
  private statePath: string;

  constructor() {
    this.statePath = `${config.triadPath}/${config.statePath}/email-revenue.json`;
  }

  /**
   * Analyze email for revenue signals
   */
  analyzeEmail(email: ParsedEmail): RevenueSignal | null {
    const textLower = `${email.subject} ${email.body}`.toLowerCase();
    const signals: string[] = [];
    let type: RevenueSignal["type"] = "inquiry";
    let maxMatches = 0;

    // Check each signal type
    for (const [signalType, keywords] of Object.entries(REVENUE_KEYWORDS)) {
      const matches = keywords.filter((k) => textLower.includes(k));
      if (matches.length > maxMatches) {
        maxMatches = matches.length;
        type = signalType as RevenueSignal["type"];
      }
      signals.push(...matches);
    }

    // Only return if we found revenue signals
    if (signals.length === 0) return null;

    // Estimate value based on domain and keywords
    const estimatedValue = this.estimateValue(email, textLower);

    // Calculate urgency
    const urgency = this.calculateUrgency(email, textLower);

    // Calculate confidence
    const confidence = Math.min(0.9, 0.3 + signals.length * 0.1);

    const contact = emailParser.getContact(email.contactEmail);

    const revenueSignal: RevenueSignal = {
      id: `rev_${email.id}`,
      type,
      source: "email",
      email,
      contact,
      signals: [...new Set(signals)],
      estimatedValue,
      urgency,
      confidence,
      extractedAt: new Date(),
    };

    this.revenueSignals.push(revenueSignal);
    return revenueSignal;
  }

  /**
   * Analyze email for sponsor inquiry
   */
  analyzeSponsorInquiry(email: ParsedEmail): SponsorInquiry | null {
    const textLower = `${email.subject} ${email.body}`.toLowerCase();
    const signals = SPONSOR_KEYWORDS.filter((k) => textLower.includes(k));

    if (signals.length === 0) return null;

    // Determine inquiry type
    let inquiryType: SponsorInquiry["inquiryType"] = "general";
    if (textLower.includes("renew") || textLower.includes("continue")) {
      inquiryType = "renewal";
    } else if (textLower.includes("expand") || textLower.includes("more") || textLower.includes("additional")) {
      inquiryType = "expansion";
    } else if (signals.length >= 2) {
      inquiryType = "new";
    }

    // Extract company from email domain
    const company = this.extractCompany(email);

    const contact = emailParser.getContact(email.contactEmail);

    const inquiry: SponsorInquiry = {
      id: `spn_${email.id}`,
      email,
      contact,
      company,
      inquiryType,
      signals: [...new Set(signals)],
      followUpStatus: email.isOutbound ? "responded" : "pending",
      estimatedValue: this.estimateSponsorValue(email, textLower),
      extractedAt: new Date(),
    };

    this.sponsorInquiries.push(inquiry);
    return inquiry;
  }

  /**
   * Identify cold leads from contacts
   */
  identifyColdLeads(minDaysSinceContact: number = 45, minRelationshipScore: number = 0.3): ColdLead[] {
    const contacts = emailParser.getAllContacts();
    const now = Date.now();
    this.coldLeads = [];

    for (const contact of contacts) {
      const daysSinceContact = (now - contact.lastContact.getTime()) / (1000 * 60 * 60 * 24);

      // Only consider contacts that have gone cold but had previous engagement
      if (daysSinceContact >= minDaysSinceContact && contact.relationshipScore >= minRelationshipScore) {
        const emails = emailParser.getEmailsByContact(contact.email);
        const lastEmail = emails[0];

        if (!lastEmail) continue;

        // Check for revenue signals in past emails
        const revenueSignals = this.extractRevenueSignalsFromHistory(emails);

        // Calculate re-engagement priority
        const previousEngagement = this.categorizePreviousEngagement(contact);
        const reengagementPriority = this.calculateReengagementPriority(
          contact,
          daysSinceContact,
          revenueSignals.length
        );

        // Suggest action based on context
        const suggestedAction = this.suggestReengagementAction(contact, emails, revenueSignals);

        const coldLead: ColdLead = {
          contact,
          lastEmail,
          daysSinceContact: Math.round(daysSinceContact),
          previousEngagement,
          revenueSignals,
          reengagementPriority,
          suggestedAction,
        };

        this.coldLeads.push(coldLead);
      }
    }

    // Sort by re-engagement priority
    this.coldLeads.sort((a, b) => b.reengagementPriority - a.reengagementPriority);

    return this.coldLeads;
  }

  /**
   * Find re-engagement opportunities
   */
  findReengagementOpportunities(): ReengagementOpportunity[] {
    const opportunities: ReengagementOpportunity[] = [];
    const coldLeads = this.identifyColdLeads();

    for (const lead of coldLeads.slice(0, 20)) {
      const emails = emailParser.getEmailsByContact(lead.contact.email);

      opportunities.push({
        contact: lead.contact,
        reason: this.determineReengagementReason(lead),
        lastContact: lead.contact.lastContact,
        suggestedApproach: lead.suggestedAction,
        priority: lead.reengagementPriority,
        relatedEmails: emails.slice(0, 5),
      });
    }

    return opportunities;
  }

  /**
   * Get pending sponsor inquiries
   */
  getPendingSponsorInquiries(): SponsorInquiry[] {
    return this.sponsorInquiries
      .filter((i) => i.followUpStatus === "pending")
      .sort((a, b) => b.extractedAt.getTime() - a.extractedAt.getTime());
  }

  /**
   * Get all sponsor inquiries
   */
  getAllSponsorInquiries(): SponsorInquiry[] {
    return this.sponsorInquiries.sort(
      (a, b) => b.extractedAt.getTime() - a.extractedAt.getTime()
    );
  }

  /**
   * Get high-value revenue signals
   */
  getHighValueSignals(): RevenueSignal[] {
    return this.revenueSignals
      .filter((s) => s.estimatedValue === "high" || s.confidence >= 0.7)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get all revenue signals
   */
  getAllRevenueSignals(): RevenueSignal[] {
    return this.revenueSignals.sort(
      (a, b) => b.extractedAt.getTime() - a.extractedAt.getTime()
    );
  }

  /**
   * Get cold leads
   */
  getColdLeads(): ColdLead[] {
    return this.coldLeads;
  }

  /**
   * Scan all emails for revenue signals and sponsor inquiries
   */
  async scanAllEmails(): Promise<{
    revenueCount: number;
    sponsorCount: number;
    coldLeadCount: number;
  }> {
    const emails = emailParser.getAllEmails();

    for (const email of emails) {
      // Only analyze inbound emails for revenue/sponsor signals
      if (email.isInbound) {
        this.analyzeEmail(email);
        this.analyzeSponsorInquiry(email);
      }
    }

    // Identify cold leads
    this.identifyColdLeads();

    await logger.info("email_revenue_scan_complete", {
      revenueCount: this.revenueSignals.length,
      sponsorCount: this.sponsorInquiries.length,
      coldLeadCount: this.coldLeads.length,
    });

    return {
      revenueCount: this.revenueSignals.length,
      sponsorCount: this.sponsorInquiries.length,
      coldLeadCount: this.coldLeads.length,
    };
  }

  /**
   * Generate revenue summary
   */
  generateRevenueSummary(): {
    totalSignals: number;
    byType: Record<string, number>;
    byValue: Record<string, number>;
    highPriorityCount: number;
    pendingSponsors: number;
    coldLeadsCount: number;
    topOpportunities: ReengagementOpportunity[];
  } {
    const byType: Record<string, number> = {};
    const byValue: Record<string, number> = {};

    for (const signal of this.revenueSignals) {
      byType[signal.type] = (byType[signal.type] || 0) + 1;
      byValue[signal.estimatedValue] = (byValue[signal.estimatedValue] || 0) + 1;
    }

    return {
      totalSignals: this.revenueSignals.length,
      byType,
      byValue,
      highPriorityCount: this.getHighValueSignals().length,
      pendingSponsors: this.getPendingSponsorInquiries().length,
      coldLeadsCount: this.coldLeads.length,
      topOpportunities: this.findReengagementOpportunities().slice(0, 5),
    };
  }

  // Private helper methods

  private estimateValue(email: ParsedEmail, textLower: string): RevenueSignal["estimatedValue"] {
    // High value indicators
    if (HIGH_VALUE_DOMAINS.some((d) => email.domain.toLowerCase().includes(d))) {
      return "high";
    }
    if (textLower.includes("enterprise") || textLower.includes("annual") || textLower.includes("contract")) {
      return "high";
    }

    // Medium value indicators
    if (email.attachmentCount > 0) return "medium";
    if (textLower.includes("project") || textLower.includes("engagement")) return "medium";

    // Low value indicators
    if (textLower.includes("free") || textLower.includes("trial")) return "low";

    return "unknown";
  }

  private calculateUrgency(email: ParsedEmail, textLower: string): RevenueSignal["urgency"] {
    // High urgency indicators
    if (textLower.includes("urgent") || textLower.includes("asap") || textLower.includes("immediately")) {
      return "high";
    }
    if (textLower.includes("deadline") || textLower.includes("this week")) {
      return "high";
    }

    // Medium urgency
    if (textLower.includes("soon") || textLower.includes("next week") || textLower.includes("schedule")) {
      return "medium";
    }

    return "low";
  }

  private estimateSponsorValue(email: ParsedEmail, textLower: string): SponsorInquiry["estimatedValue"] {
    if (HIGH_VALUE_DOMAINS.some((d) => email.domain.toLowerCase().includes(d))) {
      return "high";
    }
    if (textLower.includes("campaign") || textLower.includes("series") || textLower.includes("multiple episodes")) {
      return "high";
    }
    if (textLower.includes("single episode") || textLower.includes("one-time")) {
      return "medium";
    }
    return "unknown";
  }

  private extractCompany(email: ParsedEmail): string {
    // Try to get company from sender name
    if (email.contactName) {
      const atMatch = email.contactName.match(/@\s*(.+)/);
      if (atMatch) return atMatch[1].trim();
    }

    // Fall back to domain
    if (email.domain) {
      return email.domain.replace(/\.(com|org|net|io|co)$/i, "");
    }

    return "Unknown";
  }

  private extractRevenueSignalsFromHistory(emails: ParsedEmail[]): string[] {
    const signals: string[] = [];

    for (const email of emails.slice(0, 10)) {
      const textLower = `${email.subject} ${email.body}`.toLowerCase();

      for (const keywords of Object.values(REVENUE_KEYWORDS)) {
        for (const keyword of keywords) {
          if (textLower.includes(keyword) && !signals.includes(keyword)) {
            signals.push(keyword);
          }
        }
      }
    }

    return signals.slice(0, 10);
  }

  private categorizePreviousEngagement(contact: Contact): "high" | "medium" | "low" {
    if (contact.emailCount >= 20 && contact.relationshipScore >= 0.6) return "high";
    if (contact.emailCount >= 5 && contact.relationshipScore >= 0.3) return "medium";
    return "low";
  }

  private calculateReengagementPriority(
    contact: Contact,
    daysSinceContact: number,
    signalCount: number
  ): number {
    let priority = 0;

    // Relationship score factor (30%)
    priority += contact.relationshipScore * 0.3;

    // Recency factor - prefer not too old (20%)
    const recencyScore = daysSinceContact < 90 ? 1 - (daysSinceContact - 45) / 90 : 0.2;
    priority += recencyScore * 0.2;

    // Signal count factor (30%)
    priority += Math.min(signalCount / 5, 1) * 0.3;

    // Email count factor (20%)
    priority += Math.min(contact.emailCount / 30, 1) * 0.2;

    return Math.min(1, priority);
  }

  private suggestReengagementAction(contact: Contact, emails: ParsedEmail[], signals: string[]): string {
    // Check if there was a proposal or negotiation
    if (signals.includes("proposal") || signals.includes("quote")) {
      return "Follow up on previous proposal - check if still relevant";
    }

    // Check for past sponsor relationship
    const sponsorSignals = emails.some((e) =>
      SPONSOR_KEYWORDS.some((k) => e.subject.toLowerCase().includes(k) || e.body.toLowerCase().includes(k))
    );
    if (sponsorSignals) {
      return "Re-engage about sponsorship - new season/content opportunities";
    }

    // Check for bidirectional communication
    if (contact.outboundCount > 0 && contact.inboundCount > 0) {
      return "Send friendly check-in - reference past conversations";
    }

    // Default action
    return "Send value-add content or industry update";
  }

  private determineReengagementReason(lead: ColdLead): string {
    if (lead.revenueSignals.length > 3) {
      return "Strong revenue signals in past communications";
    }
    if (lead.previousEngagement === "high") {
      return "Previously high-engagement contact gone quiet";
    }
    if (lead.daysSinceContact > 90) {
      return "Long-term relationship needs nurturing";
    }
    return "Potential opportunity based on past interactions";
  }

  /**
   * Save state to disk
   */
  async saveState(): Promise<void> {
    try {
      const data = {
        revenueSignals: this.revenueSignals.slice(-100),
        sponsorInquiries: this.sponsorInquiries.slice(-50),
        coldLeads: this.coldLeads.slice(0, 30),
        lastUpdated: new Date().toISOString(),
      };
      await Bun.write(this.statePath, JSON.stringify(data, null, 2));
    } catch (error) {
      await logger.error("email_revenue_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Load state from disk
   */
  async loadState(): Promise<void> {
    try {
      const file = Bun.file(this.statePath);
      if (await file.exists()) {
        const data = await file.json();

        this.revenueSignals = (data.revenueSignals || []).map((s: any) => ({
          ...s,
          extractedAt: new Date(s.extractedAt),
          email: { ...s.email, date: new Date(s.email.date) },
        }));

        this.sponsorInquiries = (data.sponsorInquiries || []).map((i: any) => ({
          ...i,
          extractedAt: new Date(i.extractedAt),
          email: { ...i.email, date: new Date(i.email.date) },
        }));

        this.coldLeads = (data.coldLeads || []).map((l: any) => ({
          ...l,
          contact: {
            ...l.contact,
            firstContact: new Date(l.contact.firstContact),
            lastContact: new Date(l.contact.lastContact),
          },
          lastEmail: { ...l.lastEmail, date: new Date(l.lastEmail.date) },
        }));

        await logger.debug("email_revenue_state_loaded", {
          revenueSignals: this.revenueSignals.length,
          sponsorInquiries: this.sponsorInquiries.length,
          coldLeads: this.coldLeads.length,
        });
      }
    } catch (error) {
      await logger.warn("email_revenue_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const emailRevenueExtractor = new EmailRevenueExtractor();
