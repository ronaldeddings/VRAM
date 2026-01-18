// Communications Analyzer Prompts
// Specialized prompts for analyzing emails, Slack, and cross-channel communications

import { config } from "../utils/config";
import { logger } from "../utils/logger";
import { emailParser, type ParsedEmail, type Contact } from "../context/email-parser";
import { slackParser, type SlackChannel, type CommunicationBottleneck } from "../context/slack-parser";
import { networkAnalyzer, type UnifiedContact, type MaintenanceAlert, type NetworkingRecommendation } from "../context/network-analyzer";

export interface CommunicationsContext {
  emailSummary?: {
    totalEmails: number;
    unansweredCount: number;
    importantContacts: Contact[];
    recentThreads: string[];
  };
  slackSummary?: {
    totalMessages: number;
    activeChannels: string[];
    bottlenecks: CommunicationBottleneck[];
    workflows: string[];
  };
  networkSummary?: {
    totalContacts: number;
    dormantRelationships: number;
    alerts: MaintenanceAlert[];
    recommendations: NetworkingRecommendation[];
  };
}

export type CommunicationsAnalysisType =
  | "email_health"
  | "relationship_audit"
  | "network_analysis"
  | "slack_patterns"
  | "cross_channel"
  | "opportunity_scan";

class CommunicationsAnalyzer {
  /**
   * Generate prompt for email health analysis
   */
  async generateEmailHealthPrompt(): Promise<string> {
    await emailParser.indexAllEmails();

    const volumeStats = emailParser.getVolumeStats();
    const unanswered = emailParser.getImportantUnanswered();
    const contacts = emailParser.getContacts();
    const dormant = emailParser.getDormantContacts(90);

    return `# Email Communication Health Analysis

## Current Email Statistics
- Total indexed emails: ${volumeStats.totalEmails}
- Daily average: ${volumeStats.avgPerDay.toFixed(1)} emails
- Current thread count: ${volumeStats.threadCount}
- Days covered: ${volumeStats.dateRange.days}

## Unanswered Important Emails (${unanswered.length})
${unanswered.slice(0, 10).map(e => `- From: ${e.from}, Subject: "${e.subject.substring(0, 50)}..." (${this.daysAgo(e.date)} days ago)`).join("\n")}

## Top Active Contacts
${contacts.slice(0, 10).map(c => `- ${c.name} (${c.email}): ${c.emailCount} emails, relationship: ${(c.relationshipScore * 100).toFixed(0)}%`).join("\n")}

## Dormant Relationships Requiring Attention (${dormant.length})
${dormant.slice(0, 10).map(c => `- ${c.name}: Last contact ${this.daysAgo(c.lastContact)} days ago, was ${(c.relationshipScore * 100).toFixed(0)}% strength`).join("\n")}

## Analysis Required

1. **Inbox Health Assessment**: Evaluate the current state of email management
2. **Response Priority**: Which unanswered emails need immediate attention?
3. **Relationship Risks**: Which dormant relationships could impact business?
4. **Communication Patterns**: Any concerning trends in email volume or response times?
5. **Action Items**: Specific recommendations for Ron to act on today

Format your analysis with:
- [EMAIL ACTION] for specific emails to respond to
- [RELATIONSHIP RISK] for concerning dormant contacts
- [PATTERN] for communication trends observed
- [RECOMMENDATION] for process improvements

Focus on actionable insights that can improve communication effectiveness.`;
  }

  /**
   * Generate prompt for relationship audit
   */
  async generateRelationshipAuditPrompt(): Promise<string> {
    await networkAnalyzer.buildUnifiedContacts();

    const summary = networkAnalyzer.generateNetworkSummary();
    const alerts = networkAnalyzer.generateMaintenanceAlerts();
    const recommendations = networkAnalyzer.generateRecommendations();
    const highValue = networkAnalyzer.getHighValueNodes();

    return `# Professional Relationship Audit

## Network Overview
- Total contacts: ${summary.totalContacts}
- Internal team: ${summary.internalContacts}
- External contacts: ${summary.externalContacts}
- Strong relationships (>70%): ${summary.strongRelationships}
- Dormant relationships: ${summary.dormantRelationships}
- Network health score: ${(summary.networkHealth * 100).toFixed(0)}%

## High-Value Network Nodes
${highValue.slice(0, 10).map(n => `- ${n.name}: ${n.connections} connections, ${n.isHub ? "HUB" : ""} ${n.isBridge ? "BRIDGE" : ""} (${n.category})`).join("\n")}

## Relationship Maintenance Alerts (${alerts.length})
${alerts.slice(0, 15).map(a => `- [${a.severity.toUpperCase()}] ${a.type}: ${a.message}
  → ${a.suggestedAction}`).join("\n\n")}

## Networking Recommendations (${recommendations.length})
${recommendations.slice(0, 10).map(r => `- [${r.type.toUpperCase()}] ${r.contact}
  Reason: ${r.reason}
  Action: ${r.suggestedAction}
  Value: ${r.potentialValue} | Timeline: ${r.timeframe}`).join("\n\n")}

## Analysis Required

1. **Network Health**: Is Ron's professional network healthy and diverse?
2. **Relationship Priorities**: Which relationships need immediate attention?
3. **Strategic Gaps**: Are there missing connection types in the network?
4. **Leverage Opportunities**: How can existing relationships be better utilized?
5. **Risk Mitigation**: Which declining relationships could impact Hacker Valley Media?

Format your analysis with:
- [RELATIONSHIP ACTION] for specific contacts to reach out to
- [NETWORK INSIGHT] for strategic observations about the network
- [OPPORTUNITY] for potential valuable connections
- [RISK ALERT] for relationships that need intervention

Provide specific, actionable recommendations for relationship management.`;
  }

  /**
   * Generate prompt for Slack communication patterns
   */
  async generateSlackAnalysisPrompt(): Promise<string> {
    await slackParser.indexAllChannels();

    const commSummary = slackParser.generateCommunicationSummary();
    const bottlenecks = slackParser.identifyBottlenecks();
    const workflows = slackParser.trackWorkflowDiscussions();
    const channels = slackParser.getChannels();

    return `# Slack Team Communication Analysis

## Communication Summary
- Total messages indexed: ${commSummary.totalMessages}
- Active channels: ${commSummary.totalChannels}
- Team members: ${commSummary.totalUsers}
- Avg messages/day: ${commSummary.avgMessagesPerDay.toFixed(1)}
- Thread engagement: ${(commSummary.threadEngagement * 100).toFixed(0)}%
- Communication health: ${(commSummary.communicationHealth * 100).toFixed(0)}%

## Most Active Channel: #${commSummary.mostActiveChannel}
Most Active User: ${commSummary.mostActiveUser}

## Channel Activity
${channels.slice(0, 10).map(c => `- #${c.name}: ${c.messageCount} messages, ${c.participantCount} participants, ${c.threadCount} threads`).join("\n")}

## Communication Bottlenecks (${bottlenecks.length})
${bottlenecks.map(b => `- [${b.severity.toUpperCase()}] ${b.type}
  ${b.description}
  Impact: ${b.affectedUsers.length} users affected
  → ${b.recommendation}`).join("\n\n")}

## Recent Workflow Discussions (${workflows.length})
${workflows.slice(0, 10).map(w => `- #${w.channel}: "${w.topic}"
  Participants: ${w.participants.length} | Messages: ${w.messageCount} | Status: ${w.resolved ? "✅ Resolved" : "🔄 Open"}
  Keywords: ${w.keywords.join(", ")}`).join("\n\n")}

## Analysis Required

1. **Team Communication Health**: How effectively is the team communicating?
2. **Bottleneck Assessment**: Are there communication single points of failure?
3. **Channel Optimization**: Are channels being used effectively?
4. **Workflow Tracking**: Are open discussions being resolved?
5. **Team Dynamics**: Any concerning patterns in team interaction?

Format your analysis with:
- [TEAM INSIGHT] for observations about team communication
- [BOTTLENECK] for communication flow issues
- [WORKFLOW] for discussion items needing attention
- [RECOMMENDATION] for process improvements

Focus on actionable insights to improve team collaboration.`;
  }

  /**
   * Generate prompt for cross-channel communication analysis
   */
  async generateCrossChannelPrompt(): Promise<string> {
    await networkAnalyzer.buildUnifiedContacts();

    const contacts = networkAnalyzer.getContacts();
    const multiChannel = contacts.filter(c => c.communicationChannels.length >= 2);
    const singleChannel = contacts.filter(c => c.communicationChannels.length === 1 && !c.isInternal);

    return `# Cross-Channel Communication Analysis

## Multi-Channel Contacts (${multiChannel.length})
These contacts engage across multiple channels:
${multiChannel.slice(0, 15).map(c => `- ${c.name}: ${c.communicationChannels.join(", ")} (strength: ${(c.relationshipScore * 100).toFixed(0)}%)
  Interactions: ${c.interactionCount} | Last: ${c.lastInteraction ? this.daysAgo(c.lastInteraction) + " days ago" : "Unknown"}`).join("\n")}

## Single-Channel Contacts (External, ${singleChannel.length})
These external contacts only engage through one channel:
${singleChannel.slice(0, 15).map(c => `- ${c.name}: ${c.communicationChannels[0]} only (strength: ${(c.relationshipScore * 100).toFixed(0)}%)
  Interactions: ${c.interactionCount}`).join("\n")}

## Channel Distribution
${this.calculateChannelDistribution(contacts)}

## Analysis Required

1. **Channel Effectiveness**: Which channels are most effective for different contact types?
2. **Engagement Depth**: Are multi-channel contacts more valuable?
3. **Migration Opportunities**: Which single-channel contacts should be engaged elsewhere?
4. **Communication Strategy**: How should Ron optimize channel selection?
5. **Blind Spots**: Are there contacts falling through the cracks between channels?

Format your analysis with:
- [CHANNEL INSIGHT] for observations about channel usage
- [MIGRATION OPPORTUNITY] for contacts to engage on additional channels
- [STRATEGY] for communication approach recommendations
- [BLIND SPOT] for potential missed opportunities

Provide strategic recommendations for multi-channel communication optimization.`;
  }

  /**
   * Generate prompt for opportunity scanning
   */
  async generateOpportunityScanPrompt(): Promise<string> {
    await networkAnalyzer.buildUnifiedContacts();

    const recommendations = networkAnalyzer.generateRecommendations();
    const alerts = networkAnalyzer.generateMaintenanceAlerts();
    const contacts = networkAnalyzer.getContacts();

    // Filter for high-value external contacts
    const highValueExternal = contacts
      .filter(c => !c.isInternal && c.tags.length > 0)
      .sort((a, b) => b.relationshipScore - a.relationshipScore);

    // Find reconnect opportunities
    const reconnectOpps = recommendations.filter(r => r.type === "reconnect" && r.potentialValue === "high");

    return `# Communication Opportunity Scan

## High-Value External Contacts (${highValueExternal.length})
${highValueExternal.slice(0, 15).map(c => `- ${c.name}${c.company ? ` (${c.company})` : ""}
  Tags: ${c.tags.join(", ")}
  Channels: ${c.communicationChannels.join(", ")}
  Last interaction: ${c.lastInteraction ? this.daysAgo(c.lastInteraction) + " days ago" : "Unknown"}
  Relationship strength: ${(c.relationshipScore * 100).toFixed(0)}%`).join("\n\n")}

## High-Value Reconnection Opportunities (${reconnectOpps.length})
${reconnectOpps.map(r => `- ${r.contact}
  Reason: ${r.reason}
  Suggested action: ${r.suggestedAction}
  Timeframe: ${r.timeframe}`).join("\n\n")}

## Priority Alerts for Business Development
${alerts.filter(a => a.type === "opportunity" || a.type === "dormant").slice(0, 10).map(a => `- [${a.severity.toUpperCase()}] ${a.contactName}
  ${a.message}
  Days since contact: ${a.daysSinceContact}
  → ${a.suggestedAction}`).join("\n\n")}

## Analysis Required

1. **Revenue Opportunities**: Which contacts represent potential revenue?
2. **Partnership Potential**: Are there partnership opportunities being missed?
3. **Content Collaboration**: Who could be guests or collaborators?
4. **Sponsor Leads**: Are there potential sponsor relationships?
5. **Strategic Relationships**: Which contacts align with Hacker Valley Media's goals?

Format your analysis with:
- [REVENUE OPPORTUNITY] for potential business opportunities
- [PARTNERSHIP] for collaboration possibilities
- [CONTENT OPPORTUNITY] for podcast/content collaborations
- [ACTION REQUIRED] for time-sensitive outreach

Focus on specific opportunities that could benefit Hacker Valley Media.`;
  }

  /**
   * Get full communications context for agent prompt
   */
  async getFullContext(): Promise<CommunicationsContext> {
    await emailParser.indexAllEmails();
    await slackParser.indexAllChannels();
    await networkAnalyzer.buildUnifiedContacts();

    const emailStats = emailParser.getVolumeStats();
    const slackSummary = slackParser.generateCommunicationSummary();
    const networkSummary = networkAnalyzer.generateNetworkSummary();

    return {
      emailSummary: {
        totalEmails: emailStats.totalEmails,
        unansweredCount: emailParser.getImportantUnanswered().length,
        importantContacts: emailParser.getContacts().slice(0, 10),
        recentThreads: [],
      },
      slackSummary: {
        totalMessages: slackSummary.totalMessages,
        activeChannels: slackParser.getChannels().map(c => c.name).slice(0, 5),
        bottlenecks: slackSummary.topBottlenecks,
        workflows: slackSummary.recentWorkflows.map(w => w.topic).slice(0, 5),
      },
      networkSummary: {
        totalContacts: networkSummary.totalContacts,
        dormantRelationships: networkSummary.dormantRelationships,
        alerts: networkSummary.topAlerts.slice(0, 5),
        recommendations: networkSummary.topRecommendations.slice(0, 5),
      },
    };
  }

  /**
   * Generate prompt based on analysis type
   */
  async generatePrompt(analysisType: CommunicationsAnalysisType): Promise<string> {
    switch (analysisType) {
      case "email_health":
        return this.generateEmailHealthPrompt();
      case "relationship_audit":
        return this.generateRelationshipAuditPrompt();
      case "slack_patterns":
        return this.generateSlackAnalysisPrompt();
      case "cross_channel":
        return this.generateCrossChannelPrompt();
      case "opportunity_scan":
        return this.generateOpportunityScanPrompt();
      case "network_analysis":
        return this.generateRelationshipAuditPrompt(); // Same as relationship audit
      default:
        return this.generateEmailHealthPrompt();
    }
  }

  /**
   * Calculate days ago from a date
   */
  private daysAgo(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate channel distribution for contacts
   */
  private calculateChannelDistribution(contacts: UnifiedContact[]): string {
    const dist = {
      email: 0,
      slack: 0,
      meeting: 0,
      multi: 0,
    };

    for (const c of contacts) {
      if (c.communicationChannels.length > 1) {
        dist.multi++;
      } else if (c.communicationChannels.includes("email")) {
        dist.email++;
      } else if (c.communicationChannels.includes("slack")) {
        dist.slack++;
      } else if (c.communicationChannels.includes("meeting")) {
        dist.meeting++;
      }
    }

    return `- Email-only: ${dist.email}
- Slack-only: ${dist.slack}
- Meeting-only: ${dist.meeting}
- Multi-channel: ${dist.multi}`;
  }
}

export const communicationsAnalyzer = new CommunicationsAnalyzer();

// Communication output templates
export const communicationTemplates = {
  email_health: {
    type: "email_health",
    sections: [
      { name: "Inbox Status", required: true, format: "kv" },
      { name: "Priority Responses", required: true, format: "list", prefix: "[EMAIL ACTION]" },
      { name: "Relationship Risks", required: false, format: "list", prefix: "[RELATIONSHIP RISK]" },
      { name: "Patterns Observed", required: false, format: "list", prefix: "[PATTERN]" },
      { name: "Recommendations", required: true, format: "list", prefix: "[RECOMMENDATION]" },
    ],
  },
  relationship_audit: {
    type: "relationship_audit",
    sections: [
      { name: "Network Health", required: true, format: "kv" },
      { name: "Priority Contacts", required: true, format: "list", prefix: "[RELATIONSHIP ACTION]" },
      { name: "Network Insights", required: false, format: "list", prefix: "[NETWORK INSIGHT]" },
      { name: "Opportunities", required: false, format: "list", prefix: "[OPPORTUNITY]" },
      { name: "Risk Alerts", required: true, format: "list", prefix: "[RISK ALERT]" },
    ],
  },
  slack_patterns: {
    type: "slack_patterns",
    sections: [
      { name: "Team Health", required: true, format: "kv" },
      { name: "Team Insights", required: true, format: "list", prefix: "[TEAM INSIGHT]" },
      { name: "Bottlenecks", required: false, format: "list", prefix: "[BOTTLENECK]" },
      { name: "Workflows", required: false, format: "list", prefix: "[WORKFLOW]" },
      { name: "Recommendations", required: true, format: "list", prefix: "[RECOMMENDATION]" },
    ],
  },
  opportunity_scan: {
    type: "opportunity_scan",
    sections: [
      { name: "Opportunity Summary", required: true, format: "paragraph" },
      { name: "Revenue Opportunities", required: true, format: "list", prefix: "[REVENUE OPPORTUNITY]" },
      { name: "Partnerships", required: false, format: "list", prefix: "[PARTNERSHIP]" },
      { name: "Content Opportunities", required: false, format: "list", prefix: "[CONTENT OPPORTUNITY]" },
      { name: "Required Actions", required: true, format: "list", prefix: "[ACTION REQUIRED]" },
    ],
  },
};
