// Meeting Analyzer Prompts
// Specialized prompts for analyzing meeting transcripts

import { config } from "../utils/config";
import { meetingParser, type ParsedMeeting } from "../context/meeting-parser";
import { clientExtractor } from "../context/client-extractor";
import { bizdevExtractor } from "../context/bizdev-extractor";
import { teamExtractor } from "../context/team-extractor";

export interface MeetingPromptContext {
  meeting: ParsedMeeting;
  recentMeetings: ParsedMeeting[];
  participantHistory: {
    participant: string;
    meetingCount: number;
    topics: string[];
    lastMeeting?: Date;
  }[];
  meetingType: ParsedMeeting["meetingType"];
}

export interface MeetingAnalysisOutput {
  summary: string;
  keyDecisions: string[];
  actionItems: { assignee: string; task: string; deadline?: string }[];
  risks: string[];
  opportunities: string[];
  followUpNeeded: boolean;
  sentiment: "positive" | "neutral" | "negative";
  confidenceScore: number;
}

class MeetingAnalyzer {
  /**
   * Build context for meeting analysis
   */
  async buildMeetingContext(meetingId: string): Promise<MeetingPromptContext | null> {
    const meetings = meetingParser.getRecentMeetings(20);
    const meetingMeta = meetings.find(m => m.id === meetingId);

    if (!meetingMeta) return null;

    const meeting = await meetingParser.parseTranscript(meetingMeta.filePath);
    if (!meeting) return null;

    // Get recent meetings for context
    const recentMeetings: ParsedMeeting[] = [];
    for (const recent of meetings.slice(0, 5)) {
      if (recent.id !== meetingId) {
        const parsed = await meetingParser.parseTranscript(recent.filePath);
        if (parsed) recentMeetings.push(parsed);
      }
    }

    // Build participant history
    const participantHistory = [];
    for (const participant of meeting.participants) {
      const history = meetingParser.getMeetingsByParticipant(participant);
      const topics = new Set<string>();
      for (const h of history.slice(0, 10)) {
        const parsed = await meetingParser.parseTranscript(h.filePath);
        if (parsed) {
          parsed.topics.forEach(t => topics.add(t));
        }
      }
      participantHistory.push({
        participant,
        meetingCount: history.length,
        topics: [...topics],
        lastMeeting: history.length > 0 ? new Date(history[0].date) : undefined,
      });
    }

    return {
      meeting,
      recentMeetings,
      participantHistory,
      meetingType: meeting.meetingType,
    };
  }

  /**
   * Generate prompt for internal team meetings
   */
  generateInternalMeetingPrompt(context: MeetingPromptContext): string {
    const { meeting, participantHistory } = context;

    return `# Internal Team Meeting Analysis

## Meeting Details
- **Date**: ${meeting.date.toISOString().split("T")[0]}
- **Duration**: ${Math.round(meeting.duration / 60)} minutes
- **Participants**: ${meeting.participants.join(", ")}
- **Topics Detected**: ${meeting.topics.join(", ") || "General discussion"}

## Participant Context
${participantHistory.map(p => `- **${p.participant}**: ${p.meetingCount} meetings, typically discusses: ${p.topics.slice(0, 3).join(", ") || "various topics"}`).join("\n")}

## Transcript Summary
Total words: ${meeting.wordCount}
Speaker distribution:
${Object.entries(meeting.speakerWordCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([speaker, words]) => `- ${speaker}: ${words} words (${Math.round((words / meeting.wordCount) * 100)}%)`)
  .join("\n")}

## Key Transcript Excerpts
${meeting.entries.slice(0, 30).map(e => `[${e.timestamp}] ${e.speaker}: ${e.text.substring(0, 150)}...`).join("\n")}

## Analysis Request
As an AI analyst for Hacker Valley Media's internal operations, analyze this team meeting for:

1. **Team Health Indicators**
   - Overall team sentiment and morale
   - Workload distribution and balance
   - Communication effectiveness

2. **Operational Insights**
   - Key decisions made
   - Blockers identified and their impact
   - Action items and ownership

3. **Process Improvements**
   - Recurring issues that need addressing
   - Workflow optimizations suggested
   - Resource allocation concerns

4. **Strategic Alignment**
   - How this meeting advances company goals
   - Risks to project timelines
   - Opportunities identified

Output Format:
- Use bullet points for clarity
- Assign confidence scores (0-1) to key insights
- Highlight actionable items with [ACTION] prefix
- Flag risks with [RISK] prefix
- Note opportunities with [OPPORTUNITY] prefix`;
  }

  /**
   * Generate prompt for client meetings
   */
  generateClientMeetingPrompt(context: MeetingPromptContext): string {
    const { meeting, participantHistory } = context;

    // Identify client vs team members
    const knownTeam = ["ron", "chris", "emily", "josh", "brandie"];
    const clients = meeting.participants.filter(
      p => !knownTeam.some(t => p.toLowerCase().includes(t))
    );

    return `# Client Meeting Analysis

## Meeting Details
- **Date**: ${meeting.date.toISOString().split("T")[0]}
- **Duration**: ${Math.round(meeting.duration / 60)} minutes
- **Client Participants**: ${clients.join(", ") || "Unknown"}
- **Team Members**: ${meeting.participants.filter(p => knownTeam.some(t => p.toLowerCase().includes(t))).join(", ")}
- **Topics**: ${meeting.topics.join(", ") || "General discussion"}

## Client Context
${clients.map(c => {
  const history = participantHistory.find(p => p.participant === c);
  return history
    ? `- **${c}**: ${history.meetingCount} previous meetings, interests: ${history.topics.slice(0, 3).join(", ") || "new contact"}`
    : `- **${c}**: First meeting`;
}).join("\n")}

## Meeting Flow
${meeting.entries.slice(0, 40).map(e => `[${e.timestamp}] ${e.speaker}: ${e.text.substring(0, 150)}...`).join("\n")}

## Analysis Request
As a client relationship analyst for Hacker Valley Media, analyze this meeting for:

1. **Client Sentiment**
   - Overall client mood and engagement
   - Satisfaction indicators
   - Concerns or frustrations expressed

2. **Relationship Health**
   - Trust level indicators
   - Communication quality
   - Alignment with client expectations

3. **Business Signals**
   - Upsell/cross-sell opportunities
   - Renewal risk indicators
   - Expansion potential

4. **Action Items**
   - Commitments made by both parties
   - Deliverables discussed
   - Timeline expectations

5. **Follow-up Recommendations**
   - Immediate next steps
   - Relationship nurturing suggestions
   - Risk mitigation actions

Output Format:
- Prioritize revenue-impacting insights
- Assign confidence scores (0-1) to assessments
- Mark follow-up items with urgency level (HIGH/MEDIUM/LOW)
- Flag relationship risks with [CLIENT RISK] prefix
- Note opportunities with [CLIENT OPPORTUNITY] prefix`;
  }

  /**
   * Generate prompt for sales/discovery meetings
   */
  generateSalesMeetingPrompt(context: MeetingPromptContext): string {
    const { meeting, participantHistory } = context;

    return `# Sales/Discovery Meeting Analysis

## Meeting Details
- **Date**: ${meeting.date.toISOString().split("T")[0]}
- **Duration**: ${Math.round(meeting.duration / 60)} minutes
- **Participants**: ${meeting.participants.join(", ")}
- **Topics**: ${meeting.topics.join(", ") || "Discovery discussion"}

## BANT Signal Detection
Analyze transcript for:
- **B**udget: Mentions of budget, cost, pricing, investment
- **A**uthority: Decision-maker identification, approval process
- **N**eed: Pain points, requirements, problems to solve
- **T**imeline: Urgency, deadlines, implementation timing

## Prospect Intelligence
${participantHistory.map(p => `- **${p.participant}**: ${p.meetingCount > 1 ? `${p.meetingCount} interactions, warming lead` : "New prospect"}`).join("\n")}

## Conversation Flow
${meeting.entries.slice(0, 50).map(e => `[${e.timestamp}] ${e.speaker}: ${e.text.substring(0, 150)}...`).join("\n")}

## Analysis Request
As a sales intelligence analyst for Hacker Valley Media, analyze this meeting for:

1. **Prospect Qualification**
   - BANT score (0-100 for each dimension)
   - Overall deal probability
   - Deal size indicators

2. **Sales Stage Assessment**
   - Current stage: Discovery → Qualification → Proposal → Negotiation → Close
   - Stage progression indicators
   - Blockers to advancement

3. **Competitive Intelligence**
   - Competitors mentioned
   - Differentiators discussed
   - Win/loss factors

4. **Next Steps**
   - Immediate follow-up actions
   - Proposal elements to include
   - Objections to address

5. **Deal Strategy**
   - Recommended approach
   - Key stakeholders to engage
   - Risk mitigation

Output Format:
- Lead with deal probability and stage
- Quantify BANT signals with confidence
- Mark deal risks with [DEAL RISK] prefix
- Note buying signals with [BUYING SIGNAL] prefix
- Recommend specific actions with [SALES ACTION] prefix`;
  }

  /**
   * Generate prompt for podcast recording meetings
   */
  generatePodcastMeetingPrompt(context: MeetingPromptContext): string {
    const { meeting, participantHistory } = context;

    return `# Podcast Recording Analysis

## Episode Details
- **Recording Date**: ${meeting.date.toISOString().split("T")[0]}
- **Duration**: ${Math.round(meeting.duration / 60)} minutes
- **Participants**: ${meeting.participants.join(", ")}
- **Topics**: ${meeting.topics.join(", ") || "Episode content"}

## Guest Information
${participantHistory.filter(p => !["ron", "chris"].some(t => p.participant.toLowerCase().includes(t))).map(g =>
  `- **${g.participant}**: ${g.meetingCount > 1 ? "Returning guest" : "First appearance"}`
).join("\n")}

## Episode Flow
Total words: ${meeting.wordCount}
Speaker distribution:
${Object.entries(meeting.speakerWordCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([speaker, words]) => `- ${speaker}: ${words} words (${Math.round((words / meeting.wordCount) * 100)}%)`)
  .join("\n")}

## Content Excerpts
${meeting.entries.slice(0, 50).map(e => `[${e.timestamp}] ${e.speaker}: ${e.text.substring(0, 150)}...`).join("\n")}

## Analysis Request
As a content analyst for Hacker Valley Media podcast, analyze this recording for:

1. **Content Quality**
   - Key themes and topics covered
   - Memorable quotes and soundbites
   - Educational value delivered

2. **Guest Performance**
   - Expertise demonstrated
   - Engagement level
   - Chemistry with hosts

3. **Marketing Potential**
   - Social media clip opportunities
   - Blog post topics
   - Guest amplification potential

4. **Production Notes**
   - Audio quality indicators (if mentioned)
   - Sections needing editing
   - Timestamps for highlights

5. **Audience Value**
   - Target audience appeal
   - Actionable takeaways
   - Controversy/engagement potential

Output Format:
- Extract quotable moments with timestamps
- Rate content quality (1-10)
- Mark clip-worthy sections with [CLIP] prefix
- Note marketing angles with [PROMO] prefix
- Flag editing needs with [EDIT] prefix`;
  }

  /**
   * Generate prompt for unknown/general meetings
   */
  generateGeneralMeetingPrompt(context: MeetingPromptContext): string {
    const { meeting, participantHistory } = context;

    return `# Meeting Analysis

## Meeting Details
- **Date**: ${meeting.date.toISOString().split("T")[0]}
- **Duration**: ${Math.round(meeting.duration / 60)} minutes
- **Participants**: ${meeting.participants.join(", ")}
- **Topics**: ${meeting.topics.join(", ") || "General discussion"}

## Participant Context
${participantHistory.map(p => `- **${p.participant}**: ${p.meetingCount} meetings in system`).join("\n")}

## Transcript Overview
Total words: ${meeting.wordCount}
${meeting.entries.slice(0, 40).map(e => `[${e.timestamp}] ${e.speaker}: ${e.text.substring(0, 150)}...`).join("\n")}

## Analysis Request
Analyze this meeting for:

1. **Meeting Classification**
   - Likely meeting type (internal/client/sales/podcast/other)
   - Primary purpose
   - Key stakeholders

2. **Key Outcomes**
   - Decisions made
   - Action items
   - Open questions

3. **Business Impact**
   - Revenue implications
   - Relationship implications
   - Operational implications

4. **Follow-up Needs**
   - Immediate actions required
   - Future meeting suggestions
   - Documentation needs

Output Format:
- Classify meeting type with confidence
- List key outcomes
- Prioritize follow-up actions
- Note any concerns or risks`;
  }

  /**
   * Get appropriate prompt based on meeting type
   */
  async generateMeetingPrompt(meetingId: string): Promise<string | null> {
    const context = await this.buildMeetingContext(meetingId);
    if (!context) return null;

    switch (context.meetingType) {
      case "internal":
        return this.generateInternalMeetingPrompt(context);
      case "client":
        return this.generateClientMeetingPrompt(context);
      case "sales":
        return this.generateSalesMeetingPrompt(context);
      case "podcast":
        return this.generatePodcastMeetingPrompt(context);
      default:
        return this.generateGeneralMeetingPrompt(context);
    }
  }

  /**
   * Parse AI response into structured output
   */
  parseAnalysisOutput(response: string): Partial<MeetingAnalysisOutput> {
    const output: Partial<MeetingAnalysisOutput> = {
      keyDecisions: [],
      actionItems: [],
      risks: [],
      opportunities: [],
      followUpNeeded: false,
      confidenceScore: 0.5,
    };

    // Extract action items
    const actionRegex = /\[ACTION\]\s*(.+?)(?:\n|$)/gi;
    let match;
    while ((match = actionRegex.exec(response)) !== null) {
      const parts = match[1].split(":");
      output.actionItems?.push({
        assignee: parts.length > 1 ? parts[0].trim() : "Team",
        task: parts.length > 1 ? parts.slice(1).join(":").trim() : parts[0].trim(),
      });
    }

    // Extract risks
    const riskRegex = /\[(RISK|DEAL RISK|CLIENT RISK)\]\s*(.+?)(?:\n|$)/gi;
    while ((match = riskRegex.exec(response)) !== null) {
      output.risks?.push(match[2].trim());
    }

    // Extract opportunities
    const oppRegex = /\[(OPPORTUNITY|CLIENT OPPORTUNITY|BUYING SIGNAL)\]\s*(.+?)(?:\n|$)/gi;
    while ((match = oppRegex.exec(response)) !== null) {
      output.opportunities?.push(match[2].trim());
    }

    // Determine sentiment from response
    const positiveWords = ["positive", "excellent", "strong", "good", "enthusiastic"];
    const negativeWords = ["concern", "risk", "issue", "problem", "negative"];
    const responseLower = response.toLowerCase();

    const positiveCount = positiveWords.filter(w => responseLower.includes(w)).length;
    const negativeCount = negativeWords.filter(w => responseLower.includes(w)).length;

    if (positiveCount > negativeCount + 2) {
      output.sentiment = "positive";
    } else if (negativeCount > positiveCount + 2) {
      output.sentiment = "negative";
    } else {
      output.sentiment = "neutral";
    }

    // Check for follow-up indicators
    output.followUpNeeded = response.toLowerCase().includes("follow-up") ||
      response.toLowerCase().includes("follow up") ||
      (output.actionItems?.length || 0) > 0;

    return output;
  }

  /**
   * Get meeting focus area for agent rotation
   */
  getMeetingFocusAreas(): string[] {
    return [
      "meeting_transcript_analysis",
      "client_relationship_intelligence",
      "sales_pipeline_review",
      "team_health_assessment",
      "podcast_content_analysis",
    ];
  }

  /**
   * Generate meeting-focused prompt for agent rotation
   */
  async generateRotationPrompt(focusArea: string): Promise<string | null> {
    const recentMeetings = meetingParser.getRecentMeetings(10);

    if (recentMeetings.length === 0) {
      return null;
    }

    switch (focusArea) {
      case "meeting_transcript_analysis":
        // Analyze most recent unanalyzed meeting
        const newest = recentMeetings[0];
        return this.generateMeetingPrompt(newest.id);

      case "client_relationship_intelligence":
        // Analyze client meetings pattern
        const clientMeetings = meetingParser.getMeetingsByType("client");
        const clientStats = clientExtractor.getStats();
        return `# Client Relationship Intelligence Review

## Current Client Portfolio
- Total tracked clients: ${clientStats.totalClients}
- Dormant relationships: ${clientStats.dormantCount}
- Needs follow-up: ${clientStats.needsFollowUpCount}
- Average relationship health: ${(clientStats.avgRelationshipHealth * 100).toFixed(0)}%

## Recent Client Meetings (${clientMeetings.length} total)
${clientMeetings.slice(0, 5).map(m => `- ${m.date.split("T")[0]}: ${m.participants.join(", ")}`).join("\n")}

## Analysis Request
Review the client relationship data and provide:
1. Clients at risk of churning
2. Upsell/expansion opportunities
3. Relationship maintenance priorities
4. Communication gap analysis
5. Account health trends

Format insights with confidence scores and actionable recommendations.`;

      case "sales_pipeline_review":
        const pipeline = bizdevExtractor.generatePipelineSummary();
        return `# Sales Pipeline Intelligence Review

## Pipeline Overview
- Total prospects: ${pipeline.totalProspects}
- Total estimated value: $${pipeline.totalEstimatedValue.toLocaleString()}
- Stale prospects: ${pipeline.staleCount}

## Stage Distribution
${Object.entries(pipeline.byStage).map(([stage, count]) => `- ${stage}: ${count}`).join("\n")}

## Hot Prospects (Score > 70)
${pipeline.hotProspects.map(p => `- ${p.name}: Score ${p.score}, Stage: ${p.stage}`).join("\n") || "None"}

## Needs Follow-up
${pipeline.needsFollowUp.map(p => `- ${p.name}: Last contact ${p.lastContactDate.toISOString().split("T")[0]}`).join("\n") || "All up to date"}

## Analysis Request
Provide strategic sales intelligence:
1. Deal prioritization recommendations
2. Stale lead re-engagement strategy
3. Pipeline velocity analysis
4. Win probability assessments
5. Resource allocation suggestions

Format with confidence scores and specific next actions.`;

      case "team_health_assessment":
        const health = teamExtractor.generateHealthIndicators();
        const team = teamExtractor.getTeamMembers();
        return `# Team Health Intelligence Review

## Team Health Metrics
- Overall health: ${(health.overallHealth * 100).toFixed(0)}%
- Workload balance: ${(health.workloadBalance * 100).toFixed(0)}%
- Communication flow: ${(health.communicationFlow * 100).toFixed(0)}%
- Active blockers: ${health.blockerCount}

## Team Member Status
${team.map(m => `- ${m.name} (${m.role || "Team Member"}): ${m.currentWorkload} workload, ${m.meetingCount} meetings`).join("\n")}

## Trends
- Sentiment: ${health.trends.sentimentTrend}
- Workload: ${health.trends.workloadTrend}

## Unresolved Issues
${health.unresolvedIssues.slice(0, 5).join("\n") || "None tracked"}

## Analysis Request
Provide team health intelligence:
1. Individual team member assessments
2. Workload rebalancing recommendations
3. Blocker resolution priorities
4. Team morale improvement suggestions
5. Process optimization opportunities

Format insights with specific, actionable recommendations.`;

      case "podcast_content_analysis":
        const podcastMeetings = meetingParser.getMeetingsByType("podcast");
        return `# Podcast Content Intelligence Review

## Recent Episodes (${podcastMeetings.length} total)
${podcastMeetings.slice(0, 5).map(m => `- ${m.date.split("T")[0]}: ${m.participants.join(", ")}, ${Math.round(m.duration / 60)} min`).join("\n")}

## Content Analysis Request
Analyze podcast recording patterns for:
1. Guest diversity and expertise coverage
2. Topic distribution and gaps
3. Episode length optimization
4. Content series opportunities
5. Cross-promotion potential

Provide strategic content recommendations with confidence scores.`;

      default:
        return null;
    }
  }
}

export const meetingAnalyzer = new MeetingAnalyzer();
