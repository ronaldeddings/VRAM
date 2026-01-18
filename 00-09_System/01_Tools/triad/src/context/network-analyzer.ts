// Network Analyzer
// Unified relationship intelligence across emails, meetings, and Slack

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { emailParser, type Contact as EmailContact } from "./email-parser";
import { slackParser, type SlackUser, type CommunicationEdge } from "./slack-parser";
import { meetingParser, type ContactFrequency } from "./meeting-parser";

export interface UnifiedContact {
  id: string;
  name: string;
  email?: string;
  slackId?: string;
  company?: string;
  role?: string;
  tags: string[];
  relationshipScore: number; // 0-1
  communicationChannels: ("email" | "slack" | "meeting")[];
  lastInteraction?: Date;
  interactionCount: number;
  sentiment: number; // -1 to 1
  isInternal: boolean;
  metadata: {
    emailStats?: {
      received: number;
      sent: number;
      responseRate: number;
    };
    slackStats?: {
      messages: number;
      mentions: number;
      channels: string[];
    };
    meetingStats?: {
      count: number;
      lastMeeting?: Date;
      avgDuration?: number;
    };
  };
}

export interface RelationshipEdge {
  from: string;
  to: string;
  strength: number; // 0-1
  channels: string[];
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "rare";
  trend: "growing" | "stable" | "declining";
  lastInteraction?: Date;
}

export interface MaintenanceAlert {
  contactId: string;
  contactName: string;
  type: "dormant" | "declining" | "unresponsive" | "overdue_followup" | "opportunity";
  severity: "low" | "medium" | "high";
  message: string;
  daysSinceContact: number;
  suggestedAction: string;
  priority: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  value: number; // Influence/importance score
  category: "internal" | "client" | "prospect" | "partner" | "media" | "other";
  connections: number;
  betweenness: number; // Centrality measure
  isHub: boolean;
  isBridge: boolean;
}

export interface NetworkingRecommendation {
  type: "reconnect" | "strengthen" | "introduce" | "follow_up" | "leverage";
  priority: number;
  contact: string;
  reason: string;
  suggestedAction: string;
  potentialValue: "low" | "medium" | "high";
  timeframe: "immediate" | "this_week" | "this_month" | "this_quarter";
}

class NetworkAnalyzer {
  private contacts: Map<string, UnifiedContact> = new Map();
  private edges: RelationshipEdge[] = [];
  private nodes: Map<string, NetworkNode> = new Map();
  private statePath: string;

  // Internal team members (Hacker Valley Media)
  private internalMembers = new Set([
    "ron eddings", "chris dingman", "emily", "josh", "brandie", "marco",
    "ron", "chris",
  ]);

  // High-value relationship indicators
  private highValueIndicators = [
    "ciso", "cto", "ceo", "vp", "director", "manager",
    "security", "podcast", "sponsor", "partner", "investor",
    "conference", "speaker", "media",
  ];

  constructor() {
    this.statePath = `${config.triadPath}/${config.statePath}/network-data.json`;
  }

  /**
   * Build unified contact database from all sources
   */
  async buildUnifiedContacts(): Promise<void> {
    // Load email contacts
    await emailParser.indexAllEmails();
    const emailContacts = emailParser.getContacts();

    for (const contact of emailContacts) {
      const id = this.normalizeContactId(contact.name, contact.email);
      this.mergeContact(id, {
        name: contact.name,
        email: contact.email,
        relationshipScore: contact.relationshipScore,
        communicationChannels: ["email"],
        interactionCount: contact.emailCount,
        lastInteraction: contact.lastContact,
        sentiment: 0.5,
        isInternal: this.isInternalMember(contact.name),
        tags: [],
        metadata: {
          emailStats: {
            received: contact.receivedCount,
            sent: contact.sentCount,
            responseRate: contact.responseRate,
          },
        },
      });
    }

    // Load Slack users
    await slackParser.indexAllChannels();
    const slackUsers = slackParser.getUsers();

    for (const user of slackUsers) {
      const id = this.normalizeContactId(user.realName || user.name);
      this.mergeContact(id, {
        name: user.realName || user.name,
        slackId: user.id,
        communicationChannels: ["slack"],
        interactionCount: user.messageCount,
        lastInteraction: user.lastActive,
        sentiment: 0.5,
        isInternal: true, // Slack users are typically internal
        tags: [],
        metadata: {
          slackStats: {
            messages: user.messageCount,
            mentions: user.mentionCount,
            channels: Array.from(user.channels),
          },
        },
      });
    }

    // Load meeting contacts
    await meetingParser.indexTranscripts();
    const meetingContacts = meetingParser.getContactFrequency();

    for (const [name, freq] of Object.entries(meetingContacts)) {
      const id = this.normalizeContactId(name);
      this.mergeContact(id, {
        name,
        communicationChannels: ["meeting"],
        interactionCount: freq.meetingCount,
        lastInteraction: freq.lastMeeting,
        sentiment: 0.5,
        isInternal: this.isInternalMember(name),
        tags: [],
        metadata: {
          meetingStats: {
            count: freq.meetingCount,
            lastMeeting: freq.lastMeeting,
          },
        },
      });
    }

    // Calculate unified relationship scores
    this.calculateUnifiedScores();

    // Build relationship edges
    this.buildRelationshipEdges();

    // Identify network nodes
    this.identifyNetworkNodes();

    await logger.info("network_unified_contacts_built", {
      totalContacts: this.contacts.size,
      edges: this.edges.length,
      nodes: this.nodes.size,
    });
  }

  /**
   * Normalize contact ID for matching across systems
   */
  private normalizeContactId(name?: string, email?: string): string {
    if (email) {
      return email.toLowerCase().trim();
    }
    if (name) {
      return name.toLowerCase().replace(/[^a-z0-9]/g, "_").trim();
    }
    return "unknown_" + Date.now();
  }

  /**
   * Merge contact data from multiple sources
   */
  private mergeContact(id: string, data: Partial<UnifiedContact>): void {
    const existing = this.contacts.get(id);

    if (existing) {
      // Merge channels
      const channels = new Set([
        ...existing.communicationChannels,
        ...(data.communicationChannels || []),
      ]);

      // Merge metadata
      const metadata = {
        ...existing.metadata,
        ...data.metadata,
      };

      // Update with merged data
      this.contacts.set(id, {
        ...existing,
        ...data,
        id,
        communicationChannels: Array.from(channels) as ("email" | "slack" | "meeting")[],
        interactionCount: existing.interactionCount + (data.interactionCount || 0),
        lastInteraction: this.mostRecent(existing.lastInteraction, data.lastInteraction),
        tags: [...new Set([...existing.tags, ...(data.tags || [])])],
        metadata,
      });
    } else {
      this.contacts.set(id, {
        id,
        name: data.name || "Unknown",
        relationshipScore: data.relationshipScore || 0,
        communicationChannels: data.communicationChannels || [],
        interactionCount: data.interactionCount || 0,
        lastInteraction: data.lastInteraction,
        sentiment: data.sentiment || 0.5,
        isInternal: data.isInternal || false,
        tags: data.tags || [],
        metadata: data.metadata || {},
        ...data,
      });
    }
  }

  /**
   * Calculate unified relationship scores
   */
  private calculateUnifiedScores(): void {
    for (const [id, contact] of this.contacts) {
      const factors: number[] = [];

      // Channel diversity (more channels = stronger relationship)
      factors.push(Math.min(1, contact.communicationChannels.length / 3));

      // Interaction frequency
      const interactionScore = Math.min(1, contact.interactionCount / 100);
      factors.push(interactionScore);

      // Recency
      if (contact.lastInteraction) {
        const daysSince = this.daysSince(contact.lastInteraction);
        const recencyScore = Math.max(0, 1 - daysSince / 180);
        factors.push(recencyScore);
      }

      // Email response rate (if available)
      if (contact.metadata.emailStats?.responseRate) {
        factors.push(contact.metadata.emailStats.responseRate);
      }

      // Meeting frequency (if available)
      if (contact.metadata.meetingStats?.count) {
        const meetingScore = Math.min(1, contact.metadata.meetingStats.count / 20);
        factors.push(meetingScore);
      }

      // Calculate weighted average
      contact.relationshipScore = factors.length > 0
        ? factors.reduce((a, b) => a + b, 0) / factors.length
        : 0;

      // Add tags based on value indicators
      this.addValueTags(contact);
    }
  }

  /**
   * Add tags based on high-value indicators
   */
  private addValueTags(contact: UnifiedContact): void {
    const nameLower = contact.name.toLowerCase();
    const emailLower = contact.email?.toLowerCase() || "";

    for (const indicator of this.highValueIndicators) {
      if (nameLower.includes(indicator) || emailLower.includes(indicator)) {
        contact.tags.push(indicator);
      }
    }

    // Categorize based on metadata
    if (contact.metadata.meetingStats && contact.metadata.meetingStats.count > 3) {
      contact.tags.push("active_meeting_contact");
    }
    if (contact.communicationChannels.length >= 2) {
      contact.tags.push("multi_channel");
    }
    if (contact.relationshipScore > 0.7) {
      contact.tags.push("strong_relationship");
    }
  }

  /**
   * Build relationship edges between contacts
   */
  private buildRelationshipEdges(): void {
    // Get edges from Slack
    const graph = slackParser.buildCommunicationGraph();

    for (const edge of graph.edges) {
      const fromId = this.findContactBySlackId(edge.from);
      const toId = this.findContactBySlackId(edge.to);

      if (fromId && toId) {
        this.edges.push({
          from: fromId,
          to: toId,
          strength: Math.min(1, edge.weight / 50),
          channels: edge.channels,
          frequency: this.categorizeFrequency(edge.weight),
          trend: "stable",
          lastInteraction: edge.lastInteraction,
        });
      }
    }

    // Add email thread relationships (simplified - from thread replies)
    // Would need more sophisticated analysis of email threads
  }

  /**
   * Find contact ID by Slack user ID
   */
  private findContactBySlackId(slackId: string): string | null {
    for (const [id, contact] of this.contacts) {
      if (contact.slackId === slackId) {
        return id;
      }
    }
    return null;
  }

  /**
   * Categorize interaction frequency
   */
  private categorizeFrequency(count: number): "daily" | "weekly" | "monthly" | "quarterly" | "rare" {
    if (count > 100) return "daily";
    if (count > 30) return "weekly";
    if (count > 10) return "monthly";
    if (count > 3) return "quarterly";
    return "rare";
  }

  /**
   * Identify network nodes (hubs, bridges, etc.)
   */
  private identifyNetworkNodes(): void {
    // Calculate node metrics
    for (const [id, contact] of this.contacts) {
      const connections = this.edges.filter(e => e.from === id || e.to === id).length;
      const betweenness = this.calculateBetweenness(id);

      const node: NetworkNode = {
        id,
        name: contact.name,
        value: contact.relationshipScore,
        category: this.categorizeContact(contact),
        connections,
        betweenness,
        isHub: connections > 10 || contact.relationshipScore > 0.8,
        isBridge: betweenness > 0.5,
      };

      this.nodes.set(id, node);
    }
  }

  /**
   * Calculate betweenness centrality (simplified)
   */
  private calculateBetweenness(nodeId: string): number {
    // Count how many shortest paths pass through this node
    // Simplified: just count unique pairs this node connects
    const directConnections = new Set<string>();

    for (const edge of this.edges) {
      if (edge.from === nodeId) {
        directConnections.add(edge.to);
      } else if (edge.to === nodeId) {
        directConnections.add(edge.from);
      }
    }

    // Check if any two connections are not directly connected
    const connectionArray = Array.from(directConnections);
    let bridgeCount = 0;

    for (let i = 0; i < connectionArray.length; i++) {
      for (let j = i + 1; j < connectionArray.length; j++) {
        const hasDirectEdge = this.edges.some(e =>
          (e.from === connectionArray[i] && e.to === connectionArray[j]) ||
          (e.from === connectionArray[j] && e.to === connectionArray[i])
        );
        if (!hasDirectEdge) bridgeCount++;
      }
    }

    return Math.min(1, bridgeCount / Math.max(1, connectionArray.length));
  }

  /**
   * Categorize contact type
   */
  private categorizeContact(contact: UnifiedContact): "internal" | "client" | "prospect" | "partner" | "media" | "other" {
    if (contact.isInternal) return "internal";

    const tags = contact.tags.join(" ").toLowerCase();
    const name = contact.name.toLowerCase();

    if (tags.includes("sponsor") || tags.includes("partner")) return "partner";
    if (tags.includes("media") || tags.includes("podcast")) return "media";
    if (contact.metadata.meetingStats && contact.metadata.meetingStats.count > 2) {
      return "client";
    }
    if (contact.communicationChannels.includes("email") && contact.interactionCount < 5) {
      return "prospect";
    }

    return "other";
  }

  /**
   * Generate relationship maintenance alerts
   */
  generateMaintenanceAlerts(): MaintenanceAlert[] {
    const alerts: MaintenanceAlert[] = [];
    const now = new Date();

    for (const [id, contact] of this.contacts) {
      // Skip internal members
      if (contact.isInternal) continue;

      const daysSinceContact = contact.lastInteraction
        ? this.daysSince(contact.lastInteraction)
        : 365;

      // Dormant relationship
      if (daysSinceContact > 90 && contact.relationshipScore > 0.3) {
        alerts.push({
          contactId: id,
          contactName: contact.name,
          type: "dormant",
          severity: contact.relationshipScore > 0.6 ? "high" : "medium",
          message: `No contact with ${contact.name} in ${daysSinceContact} days`,
          daysSinceContact,
          suggestedAction: "Send a check-in email or schedule a call",
          priority: Math.round(contact.relationshipScore * 100),
        });
      }

      // Declining relationship (would need historical data)
      // For now, use recency as a proxy

      // High-value contact needs attention
      if (contact.tags.some(t => this.highValueIndicators.includes(t)) && daysSinceContact > 30) {
        alerts.push({
          contactId: id,
          contactName: contact.name,
          type: "opportunity",
          severity: daysSinceContact > 60 ? "high" : "medium",
          message: `High-value contact ${contact.name} hasn't been engaged recently`,
          daysSinceContact,
          suggestedAction: "Consider reaching out with relevant content or update",
          priority: 80 + Math.round(contact.relationshipScore * 20),
        });
      }

      // Unresponsive (low response rate)
      if (contact.metadata.emailStats &&
          contact.metadata.emailStats.responseRate < 0.2 &&
          contact.metadata.emailStats.sent > 5) {
        alerts.push({
          contactId: id,
          contactName: contact.name,
          type: "unresponsive",
          severity: "low",
          message: `${contact.name} has low email response rate (${(contact.metadata.emailStats.responseRate * 100).toFixed(0)}%)`,
          daysSinceContact,
          suggestedAction: "Try different communication channel or adjust approach",
          priority: 30,
        });
      }
    }

    return alerts.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Identify high-value network nodes
   */
  getHighValueNodes(): NetworkNode[] {
    return Array.from(this.nodes.values())
      .filter(n => n.isHub || n.isBridge || n.value > 0.7)
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Generate networking recommendations
   */
  generateRecommendations(): NetworkingRecommendation[] {
    const recommendations: NetworkingRecommendation[] = [];
    const alerts = this.generateMaintenanceAlerts();

    // Convert dormant alerts to reconnect recommendations
    for (const alert of alerts.filter(a => a.type === "dormant")) {
      recommendations.push({
        type: "reconnect",
        priority: alert.priority,
        contact: alert.contactName,
        reason: alert.message,
        suggestedAction: alert.suggestedAction,
        potentialValue: alert.severity === "high" ? "high" : "medium",
        timeframe: alert.daysSinceContact > 180 ? "this_month" : "this_week",
      });
    }

    // Identify bridge opportunities (contacts who could connect networks)
    const bridges = Array.from(this.nodes.values()).filter(n => n.isBridge && !n.isHub);
    for (const bridge of bridges.slice(0, 5)) {
      const contact = this.contacts.get(bridge.id);
      if (contact && !contact.isInternal) {
        recommendations.push({
          type: "leverage",
          priority: 70,
          contact: bridge.name,
          reason: `${bridge.name} bridges different network groups`,
          suggestedAction: "Maintain relationship for network expansion opportunities",
          potentialValue: "high",
          timeframe: "this_quarter",
        });
      }
    }

    // Strengthen multi-channel relationships
    for (const [id, contact] of this.contacts) {
      if (contact.communicationChannels.length === 1 &&
          contact.relationshipScore > 0.5 &&
          !contact.isInternal) {
        const missingChannel = contact.communicationChannels.includes("meeting")
          ? "email"
          : "meeting";

        recommendations.push({
          type: "strengthen",
          priority: 50,
          contact: contact.name,
          reason: `Strong relationship but only via ${contact.communicationChannels[0]}`,
          suggestedAction: `Consider connecting via ${missingChannel}`,
          potentialValue: "medium",
          timeframe: "this_month",
        });
      }
    }

    // Follow-up on high-value opportunities
    for (const alert of alerts.filter(a => a.type === "opportunity")) {
      recommendations.push({
        type: "follow_up",
        priority: alert.priority,
        contact: alert.contactName,
        reason: alert.message,
        suggestedAction: alert.suggestedAction,
        potentialValue: "high",
        timeframe: "immediate",
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate network summary
   */
  generateNetworkSummary(): {
    totalContacts: number;
    internalContacts: number;
    externalContacts: number;
    strongRelationships: number;
    dormantRelationships: number;
    highValueNodes: number;
    bridgeNodes: number;
    topRecommendations: NetworkingRecommendation[];
    topAlerts: MaintenanceAlert[];
    networkHealth: number;
  } {
    const external = Array.from(this.contacts.values()).filter(c => !c.isInternal);
    const strong = external.filter(c => c.relationshipScore > 0.7);
    const dormant = external.filter(c =>
      c.lastInteraction && this.daysSince(c.lastInteraction) > 90
    );

    const highValueNodes = Array.from(this.nodes.values()).filter(n => n.isHub);
    const bridges = Array.from(this.nodes.values()).filter(n => n.isBridge);

    const recommendations = this.generateRecommendations();
    const alerts = this.generateMaintenanceAlerts();

    // Network health score
    const healthFactors = [
      strong.length / Math.max(1, external.length), // Strong relationship ratio
      1 - (dormant.length / Math.max(1, external.length)), // Active relationship ratio
      Math.min(1, highValueNodes.length / 5), // Hub presence
      Math.min(1, bridges.length / 3), // Bridge presence
    ];
    const networkHealth = healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length;

    return {
      totalContacts: this.contacts.size,
      internalContacts: this.contacts.size - external.length,
      externalContacts: external.length,
      strongRelationships: strong.length,
      dormantRelationships: dormant.length,
      highValueNodes: highValueNodes.length,
      bridgeNodes: bridges.length,
      topRecommendations: recommendations.slice(0, 10),
      topAlerts: alerts.slice(0, 10),
      networkHealth,
    };
  }

  /**
   * Get all contacts
   */
  getContacts(): UnifiedContact[] {
    return Array.from(this.contacts.values());
  }

  /**
   * Get contact by ID
   */
  getContact(id: string): UnifiedContact | undefined {
    return this.contacts.get(id);
  }

  /**
   * Check if name is internal team member
   */
  private isInternalMember(name: string): boolean {
    return this.internalMembers.has(name.toLowerCase());
  }

  /**
   * Get most recent of two dates
   */
  private mostRecent(a?: Date, b?: Date): Date | undefined {
    if (!a) return b;
    if (!b) return a;
    return a > b ? a : b;
  }

  /**
   * Calculate days since a date
   */
  private daysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Load cached network data
   */
  async loadNetworkData(): Promise<void> {
    try {
      const file = Bun.file(this.statePath);
      if (await file.exists()) {
        const data = await file.json();

        // Restore contacts
        for (const contact of data.contacts || []) {
          this.contacts.set(contact.id, {
            ...contact,
            lastInteraction: contact.lastInteraction ? new Date(contact.lastInteraction) : undefined,
            metadata: {
              ...contact.metadata,
              meetingStats: contact.metadata?.meetingStats ? {
                ...contact.metadata.meetingStats,
                lastMeeting: contact.metadata.meetingStats.lastMeeting
                  ? new Date(contact.metadata.meetingStats.lastMeeting)
                  : undefined,
              } : undefined,
            },
          });
        }

        // Restore edges
        this.edges = (data.edges || []).map((e: any) => ({
          ...e,
          lastInteraction: e.lastInteraction ? new Date(e.lastInteraction) : undefined,
        }));

        // Restore nodes
        for (const node of data.nodes || []) {
          this.nodes.set(node.id, node);
        }

        await logger.debug("network_data_loaded", {
          contacts: this.contacts.size,
          edges: this.edges.length,
          nodes: this.nodes.size,
        });
      }
    } catch (error) {
      await logger.warn("network_data_load_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Save network data to cache
   */
  async saveNetworkData(): Promise<void> {
    try {
      const data = {
        contacts: Array.from(this.contacts.values()),
        edges: this.edges,
        nodes: Array.from(this.nodes.values()),
        lastUpdated: new Date().toISOString(),
      };

      await Bun.write(this.statePath, JSON.stringify(data, null, 2));

      await logger.debug("network_data_saved", {
        contacts: this.contacts.size,
        edges: this.edges.length,
      });
    } catch (error) {
      await logger.error("network_data_save_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const networkAnalyzer = new NetworkAnalyzer();
