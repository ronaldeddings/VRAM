// Email Parser
// Parses and indexes email JSON files from VRAM communications

import { config } from "../utils/config";
import { logger } from "../utils/logger";

export interface EmailAddress {
  name: string | null;
  email: string;
}

export interface EmailDate {
  raw: string | null;
  iso: string | null;
  timestamp: number | null;
}

export interface EmailAttachment {
  filename: string | null;
  content_type: string;
  size_bytes: number | null;
}

export interface ParsedEmail {
  id: string;
  messageId: string;
  hash: string;
  subject: string;
  date: Date;
  timestamp: number;
  from: EmailAddress | null;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  replyTo: EmailAddress | null;
  inReplyTo: string;
  references: string[];
  body: string;
  hasHtml: boolean;
  attachmentCount: number;
  attachments: EmailAttachment[];
  labels: string[];
  isMultipart: boolean;
  threadTopic: string;
  referencesCount: number;
  // Derived fields
  isInbound: boolean;
  isOutbound: boolean;
  isReply: boolean;
  isThread: boolean;
  domain: string;
  contactEmail: string; // Primary contact (from if inbound, to[0] if outbound)
  contactName: string;
}

export interface Contact {
  email: string;
  name: string;
  domain: string;
  emailCount: number;
  firstContact: Date;
  lastContact: Date;
  inboundCount: number;
  outboundCount: number;
  subjects: string[];
  labels: string[];
  relationshipScore: number; // 0-1 based on frequency and recency
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  emailCount: number;
  firstDate: Date;
  lastDate: Date;
  emails: ParsedEmail[];
  isResolved: boolean; // Has recent reply
}

export interface EmailVolumeStats {
  totalEmails: number;
  inboundCount: number;
  outboundCount: number;
  uniqueContacts: number;
  threadCount: number;
  avgEmailsPerDay: number;
  topDomains: { domain: string; count: number }[];
  topContacts: { email: string; count: number }[];
  volumeByMonth: { month: string; count: number }[];
  unansweredCount: number;
}

// Ron's email addresses for determining direction
const RON_EMAILS = [
  "ron@hackervalley.com",
  "ron@hackervalleystudio.com",
  "ronaldeddings@gmail.com",
  "reddings@mozilla.com",
];

class EmailParser {
  private emails: Map<string, ParsedEmail> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private threads: Map<string, EmailThread> = new Map();
  private emailsPath: string;
  private indexPath: string;

  constructor() {
    this.emailsPath = `${config.vramPath}/10-19_Work/14_Communications/14.01b_emails_json`;
    this.indexPath = `${config.triadPath}/${config.statePath}/emails-index.json`;
  }

  /**
   * Parse a single email JSON file
   */
  async parseEmailFile(filePath: string): Promise<ParsedEmail | null> {
    try {
      const file = Bun.file(filePath);
      if (!(await file.exists())) return null;

      const data = await file.json();
      return this.parseEmailData(data);
    } catch (error) {
      await logger.warn("email_parse_error", {
        file: filePath,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Parse email JSON data into ParsedEmail
   */
  private parseEmailData(data: any): ParsedEmail {
    const from = data.headers?.from || null;
    const to = data.headers?.to || [];
    const timestamp = data.headers?.date?.timestamp || 0;
    const date = new Date(timestamp * 1000);

    // Determine direction
    const fromEmail = from?.email?.toLowerCase() || "";
    const isOutbound = RON_EMAILS.some((e) => fromEmail.includes(e.toLowerCase()));
    const isInbound = !isOutbound;

    // Get primary contact
    let contactEmail = "";
    let contactName = "";
    if (isInbound && from) {
      contactEmail = from.email;
      contactName = from.name || "";
    } else if (isOutbound && to.length > 0) {
      contactEmail = to[0].email;
      contactName = to[0].name || "";
    }

    // Extract domain from contact email
    const domain = contactEmail.includes("@")
      ? contactEmail.split("@")[1]
      : "";

    const parsed: ParsedEmail = {
      id: data.id?.hash || `${timestamp}_${Math.random().toString(36).slice(2)}`,
      messageId: data.id?.message_id || "",
      hash: data.id?.hash || "",
      subject: data.headers?.subject || "(No Subject)",
      date,
      timestamp,
      from: from ? { name: from.name, email: from.email } : null,
      to: to.map((t: any) => ({ name: t.name, email: t.email })),
      cc: (data.headers?.cc || []).map((c: any) => ({ name: c.name, email: c.email })),
      bcc: (data.headers?.bcc || []).map((b: any) => ({ name: b.name, email: b.email })),
      replyTo: data.headers?.reply_to
        ? { name: data.headers.reply_to.name, email: data.headers.reply_to.email }
        : null,
      inReplyTo: data.headers?.in_reply_to || "",
      references: data.headers?.references || [],
      body: data.content?.body || "",
      hasHtml: data.content?.has_html_version || false,
      attachmentCount: data.attachments?.count || 0,
      attachments: (data.attachments?.files || []).map((f: any) => ({
        filename: f.filename,
        content_type: f.content_type,
        size_bytes: f.size_bytes,
      })),
      labels: data.metadata?.labels || [],
      isMultipart: data.metadata?.is_multipart || false,
      threadTopic: data.threading?.thread_topic || "",
      referencesCount: data.threading?.references_count || 0,
      // Derived
      isInbound,
      isOutbound,
      isReply: !!(data.headers?.in_reply_to),
      isThread: (data.threading?.references_count || 0) > 0,
      domain,
      contactEmail,
      contactName,
    };

    return parsed;
  }

  /**
   * Scan and index emails from a year directory
   */
  async indexYear(year: string): Promise<number> {
    const yearPath = `${this.emailsPath}/${year}`;
    let count = 0;

    try {
      const glob = new Bun.Glob("*.json");
      for await (const file of glob.scan({ cwd: yearPath, absolute: true })) {
        const email = await this.parseEmailFile(file);
        if (email) {
          this.emails.set(email.id, email);
          this.updateContact(email);
          this.updateThread(email);
          count++;
        }
      }
    } catch (error) {
      await logger.warn("email_year_index_error", {
        year,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return count;
  }

  /**
   * Index all emails (recent years only for performance)
   */
  async indexAllEmails(years: string[] = ["2024", "2025"]): Promise<void> {
    await logger.info("email_indexing_started", { years });

    let totalCount = 0;
    for (const year of years) {
      const count = await this.indexYear(year);
      totalCount += count;
      await logger.debug("email_year_indexed", { year, count });
    }

    await logger.info("email_indexing_complete", {
      totalEmails: totalCount,
      uniqueContacts: this.contacts.size,
      threads: this.threads.size,
    });
  }

  /**
   * Update contact from email
   */
  private updateContact(email: ParsedEmail): void {
    if (!email.contactEmail) return;

    const contactId = email.contactEmail.toLowerCase();
    let contact = this.contacts.get(contactId);

    if (!contact) {
      contact = {
        email: email.contactEmail,
        name: email.contactName,
        domain: email.domain,
        emailCount: 0,
        firstContact: email.date,
        lastContact: email.date,
        inboundCount: 0,
        outboundCount: 0,
        subjects: [],
        labels: [],
        relationshipScore: 0,
      };
      this.contacts.set(contactId, contact);
    }

    contact.emailCount++;
    if (email.isInbound) contact.inboundCount++;
    if (email.isOutbound) contact.outboundCount++;

    if (email.date < contact.firstContact) contact.firstContact = email.date;
    if (email.date > contact.lastContact) contact.lastContact = email.date;

    if (email.subject && !contact.subjects.includes(email.subject)) {
      contact.subjects.push(email.subject);
      if (contact.subjects.length > 20) contact.subjects.shift();
    }

    for (const label of email.labels) {
      if (!contact.labels.includes(label)) {
        contact.labels.push(label);
      }
    }

    // Update name if we have a better one
    if (!contact.name && email.contactName) {
      contact.name = email.contactName;
    }

    // Calculate relationship score
    contact.relationshipScore = this.calculateRelationshipScore(contact);
  }

  /**
   * Calculate relationship score based on interaction patterns
   */
  private calculateRelationshipScore(contact: Contact): number {
    let score = 0;

    // Frequency factor (more emails = higher score)
    const frequencyScore = Math.min(contact.emailCount / 50, 1) * 0.3;
    score += frequencyScore;

    // Recency factor (recent contact = higher score)
    const daysSinceContact = (Date.now() - contact.lastContact.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysSinceContact / 90) * 0.3;
    score += recencyScore;

    // Bidirectional factor (two-way communication = higher score)
    const bidirectionalRatio = Math.min(contact.inboundCount, contact.outboundCount) /
      Math.max(contact.inboundCount, contact.outboundCount, 1);
    const bidirectionalScore = bidirectionalRatio * 0.2;
    score += bidirectionalScore;

    // Duration factor (longer relationship = higher score)
    const relationshipDays = (contact.lastContact.getTime() - contact.firstContact.getTime()) /
      (1000 * 60 * 60 * 24);
    const durationScore = Math.min(relationshipDays / 365, 1) * 0.2;
    score += durationScore;

    return Math.min(1, score);
  }

  /**
   * Update thread from email
   */
  private updateThread(email: ParsedEmail): void {
    // Use subject-based threading (simplified)
    const threadKey = this.normalizeSubject(email.subject);
    let thread = this.threads.get(threadKey);

    if (!thread) {
      thread = {
        id: threadKey,
        subject: email.subject,
        participants: [],
        emailCount: 0,
        firstDate: email.date,
        lastDate: email.date,
        emails: [],
        isResolved: false,
      };
      this.threads.set(threadKey, thread);
    }

    thread.emailCount++;
    thread.emails.push(email);

    if (email.date < thread.firstDate) thread.firstDate = email.date;
    if (email.date > thread.lastDate) {
      thread.lastDate = email.date;
      // Check if resolved (last email was outbound)
      thread.isResolved = email.isOutbound;
    }

    // Add participants
    if (email.from?.email && !thread.participants.includes(email.from.email)) {
      thread.participants.push(email.from.email);
    }
    for (const to of email.to) {
      if (!thread.participants.includes(to.email)) {
        thread.participants.push(to.email);
      }
    }
  }

  /**
   * Normalize subject for threading
   */
  private normalizeSubject(subject: string): string {
    return subject
      .toLowerCase()
      .replace(/^(re:|fwd?:|fw:)\s*/gi, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);
  }

  /**
   * Get emails by contact
   */
  getEmailsByContact(email: string): ParsedEmail[] {
    const contactId = email.toLowerCase();
    return Array.from(this.emails.values())
      .filter((e) => e.contactEmail.toLowerCase() === contactId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get emails by domain
   */
  getEmailsByDomain(domain: string): ParsedEmail[] {
    return Array.from(this.emails.values())
      .filter((e) => e.domain.toLowerCase() === domain.toLowerCase())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get unanswered inbound emails
   */
  getUnansweredEmails(daysBack: number = 30): ParsedEmail[] {
    const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
    const unanswered: ParsedEmail[] = [];

    for (const thread of this.threads.values()) {
      // Check if thread has recent inbound with no outbound response
      if (!thread.isResolved && thread.lastDate.getTime() > cutoff) {
        const lastEmail = thread.emails[thread.emails.length - 1];
        if (lastEmail.isInbound) {
          unanswered.push(lastEmail);
        }
      }
    }

    return unanswered.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get important unanswered (high relationship score contacts)
   */
  getImportantUnanswered(daysBack: number = 14, minScore: number = 0.5): ParsedEmail[] {
    const unanswered = this.getUnansweredEmails(daysBack);
    return unanswered.filter((email) => {
      const contact = this.contacts.get(email.contactEmail.toLowerCase());
      return contact && contact.relationshipScore >= minScore;
    });
  }

  /**
   * Get email volume statistics
   */
  getVolumeStats(): EmailVolumeStats {
    const emails = Array.from(this.emails.values());
    const inbound = emails.filter((e) => e.isInbound);
    const outbound = emails.filter((e) => e.isOutbound);

    // Domain counts
    const domainCounts = new Map<string, number>();
    for (const email of emails) {
      if (email.domain) {
        domainCounts.set(email.domain, (domainCounts.get(email.domain) || 0) + 1);
      }
    }

    // Contact counts
    const contactCounts = new Map<string, number>();
    for (const email of emails) {
      if (email.contactEmail) {
        contactCounts.set(email.contactEmail, (contactCounts.get(email.contactEmail) || 0) + 1);
      }
    }

    // Volume by month
    const monthCounts = new Map<string, number>();
    for (const email of emails) {
      const month = email.date.toISOString().slice(0, 7);
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
    }

    // Calculate average emails per day
    const dateRange = emails.length > 0
      ? (Math.max(...emails.map((e) => e.timestamp)) - Math.min(...emails.map((e) => e.timestamp))) / (24 * 60 * 60)
      : 1;
    const avgPerDay = emails.length / Math.max(dateRange, 1);

    return {
      totalEmails: emails.length,
      inboundCount: inbound.length,
      outboundCount: outbound.length,
      uniqueContacts: this.contacts.size,
      threadCount: this.threads.size,
      avgEmailsPerDay: Math.round(avgPerDay * 10) / 10,
      topDomains: Array.from(domainCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([domain, count]) => ({ domain, count })),
      topContacts: Array.from(contactCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([email, count]) => ({ email, count })),
      volumeByMonth: Array.from(monthCounts.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => ({ month, count })),
      unansweredCount: this.getUnansweredEmails().length,
    };
  }

  /**
   * Get all contacts sorted by relationship score
   */
  getTopContacts(limit: number = 50): Contact[] {
    return Array.from(this.contacts.values())
      .sort((a, b) => b.relationshipScore - a.relationshipScore)
      .slice(0, limit);
  }

  /**
   * Get dormant high-value contacts
   */
  getDormantContacts(daysSinceContact: number = 60, minScore: number = 0.4): Contact[] {
    const cutoff = Date.now() - daysSinceContact * 24 * 60 * 60 * 1000;
    return Array.from(this.contacts.values())
      .filter((c) => c.lastContact.getTime() < cutoff && c.relationshipScore >= minScore)
      .sort((a, b) => b.relationshipScore - a.relationshipScore);
  }

  /**
   * Search emails by content
   */
  searchEmails(query: string, limit: number = 50): ParsedEmail[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.emails.values())
      .filter((e) =>
        e.subject.toLowerCase().includes(queryLower) ||
        e.body.toLowerCase().includes(queryLower) ||
        e.contactEmail.toLowerCase().includes(queryLower) ||
        e.contactName.toLowerCase().includes(queryLower)
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get recent emails
   */
  getRecentEmails(count: number = 50): ParsedEmail[] {
    return Array.from(this.emails.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  /**
   * Get contact by email
   */
  getContact(email: string): Contact | undefined {
    return this.contacts.get(email.toLowerCase());
  }

  /**
   * Get all contacts
   */
  getAllContacts(): Contact[] {
    return Array.from(this.contacts.values());
  }

  /**
   * Get all emails
   */
  getAllEmails(): ParsedEmail[] {
    return Array.from(this.emails.values());
  }

  /**
   * Get thread by subject
   */
  getThread(subject: string): EmailThread | undefined {
    const key = this.normalizeSubject(subject);
    return this.threads.get(key);
  }

  /**
   * Save email index to disk
   */
  async saveIndex(): Promise<void> {
    try {
      const data = {
        contacts: Array.from(this.contacts.values()),
        stats: this.getVolumeStats(),
        lastUpdated: new Date().toISOString(),
      };
      await Bun.write(this.indexPath, JSON.stringify(data, null, 2));
    } catch (error) {
      await logger.error("email_index_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Load email index from disk
   */
  async loadIndex(): Promise<void> {
    try {
      const file = Bun.file(this.indexPath);
      if (await file.exists()) {
        const data = await file.json();

        for (const contact of data.contacts || []) {
          this.contacts.set(contact.email.toLowerCase(), {
            ...contact,
            firstContact: new Date(contact.firstContact),
            lastContact: new Date(contact.lastContact),
          });
        }

        await logger.debug("email_index_loaded", {
          contacts: this.contacts.size,
        });
      }
    } catch (error) {
      await logger.warn("email_index_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const emailParser = new EmailParser();
