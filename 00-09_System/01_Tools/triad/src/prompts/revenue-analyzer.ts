// Revenue Analyzer - Specialized prompts for revenue opportunity detection
// Phase 4.1: Revenue Detection & Actionable Outputs

import { config } from "../utils/config";

// Revenue opportunity categories
export type RevenueCategory =
  | "sponsorship"
  | "consulting"
  | "speaking"
  | "partnership"
  | "licensing"
  | "affiliate"
  | "product"
  | "service"
  | "referral"
  | "renewal";

export type RevenueStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type RevenueUrgency = "immediate" | "this_week" | "this_month" | "this_quarter" | "long_term";

export interface RevenueSignal {
  id: string;
  source: "email" | "meeting" | "slack" | "web";
  sourceId: string;
  category: RevenueCategory;
  stage: RevenueStage;
  urgency: RevenueUrgency;
  contact: string;
  company?: string;
  estimatedValue?: number;
  confidence: number;
  signals: string[];
  nextAction?: string;
  detectedAt: string;
}

export interface RevenuePipeline {
  signals: RevenueSignal[];
  totalEstimatedValue: number;
  byCategory: Record<RevenueCategory, number>;
  byStage: Record<RevenueStage, number>;
  byUrgency: Record<RevenueUrgency, number>;
  hotLeads: RevenueSignal[];
  staleOpportunities: RevenueSignal[];
  updatedAt: string;
}

export interface RevenueContext {
  pipeline: RevenuePipeline;
  recentActivity: RevenueSignal[];
  trends: RevenueTrend[];
  recommendations: RevenueRecommendation[];
}

export interface RevenueTrend {
  category: RevenueCategory;
  direction: "up" | "down" | "stable";
  change: number;
  period: string;
}

export interface RevenueRecommendation {
  type: "follow_up" | "proposal" | "outreach" | "renewal" | "upsell";
  priority: "high" | "medium" | "low";
  contact: string;
  company?: string;
  reason: string;
  suggestedAction: string;
  estimatedValue?: number;
}

// Revenue signal detection patterns
const revenuePatterns = {
  sponsorship: {
    keywords: [
      "sponsor", "sponsorship", "ad spot", "advertising", "promotional",
      "media kit", "rate card", "CPM", "impression", "brand partnership",
      "content partnership", "paid promotion", "native ad",
    ],
    valueIndicators: ["$", "budget", "Q1", "Q2", "Q3", "Q4", "annual", "per episode"],
  },
  consulting: {
    keywords: [
      "consulting", "advisory", "strategy", "assessment", "audit",
      "retainer", "engagement", "SOW", "statement of work", "proposal",
      "hourly rate", "project scope", "deliverable",
    ],
    valueIndicators: ["rate", "fee", "scope", "timeline", "budget"],
  },
  speaking: {
    keywords: [
      "speaking", "keynote", "conference", "summit", "panel", "webinar",
      "workshop", "presentation", "honorarium", "speaker fee", "event",
      "fireside chat", "moderator",
    ],
    valueIndicators: ["fee", "travel", "accommodation", "stipend"],
  },
  partnership: {
    keywords: [
      "partnership", "collaborate", "joint venture", "co-create",
      "revenue share", "co-marketing", "strategic alliance", "MOU",
      "memorandum of understanding", "partnership agreement",
    ],
    valueIndicators: ["split", "share", "royalty", "commission"],
  },
  licensing: {
    keywords: [
      "license", "licensing", "rights", "syndication", "distribution",
      "exclusive", "non-exclusive", "territory", "rebroadcast",
    ],
    valueIndicators: ["fee", "royalty", "per use", "annual license"],
  },
  affiliate: {
    keywords: [
      "affiliate", "referral program", "commission", "tracking link",
      "promo code", "discount code", "partner program",
    ],
    valueIndicators: ["commission", "percentage", "per sale", "tier"],
  },
  product: {
    keywords: [
      "product", "course", "ebook", "merchandise", "merch", "swag",
      "subscription", "membership", "premium content",
    ],
    valueIndicators: ["price", "pricing", "tier", "plan"],
  },
  service: {
    keywords: [
      "service", "managed", "ongoing", "monthly", "recurring",
      "support", "maintenance", "production",
    ],
    valueIndicators: ["monthly", "annual", "contract", "term"],
  },
  referral: {
    keywords: [
      "referral", "introduce", "connect", "recommend", "refer",
      "finder's fee", "introduction fee",
    ],
    valueIndicators: ["fee", "percentage", "flat rate"],
  },
  renewal: {
    keywords: [
      "renewal", "renew", "extend", "continue", "next season",
      "next year", "upcoming term", "contract extension",
    ],
    valueIndicators: ["same terms", "increase", "adjustment", "renegotiate"],
  },
};

// Urgency detection patterns
const urgencyPatterns = {
  immediate: ["urgent", "asap", "today", "immediately", "deadline tomorrow", "need now"],
  this_week: ["this week", "by friday", "end of week", "in a few days"],
  this_month: ["this month", "end of month", "next few weeks", "by the 30th", "by the 31st"],
  this_quarter: ["this quarter", "Q1", "Q2", "Q3", "Q4", "next 90 days"],
  long_term: ["next year", "future", "eventually", "down the road", "long term"],
};

// Stage detection patterns
const stagePatterns = {
  lead: ["interested", "curious", "exploring", "heard about", "initial inquiry"],
  qualified: ["serious", "budget approved", "timeline confirmed", "decision maker"],
  proposal: ["proposal", "quote", "estimate", "SOW", "pricing", "terms"],
  negotiation: ["negotiating", "counter", "revise", "adjust", "final terms"],
  closed_won: ["signed", "confirmed", "booked", "contracted", "paid", "invoice"],
  closed_lost: ["passed", "declined", "not moving forward", "went with competitor"],
};

export class RevenueAnalyzer {
  private vramPath: string;
  private statePath: string;

  constructor() {
    this.vramPath = config.vramPath;
    this.statePath = config.statePath;
  }

  // Generate prompt for sponsorship analysis
  async generateSponsorshipPrompt(): Promise<string> {
    return `You are analyzing communications for Hacker Valley Media sponsorship opportunities.

SPONSORSHIP SIGNALS TO DETECT:
${revenuePatterns.sponsorship.keywords.map(k => `- ${k}`).join("\n")}

VALUE INDICATORS:
${revenuePatterns.sponsorship.valueIndicators.map(v => `- ${v}`).join("\n")}

ANALYZE FOR:
1. **Active Inquiries**: Companies reaching out about sponsorship
2. **Renewal Opportunities**: Existing sponsors approaching renewal
3. **Warm Leads**: Past sponsors who haven't renewed
4. **Cold Outreach Targets**: Companies that fit the sponsor profile

OUTPUT FORMAT:
\`\`\`json
{
  "opportunities": [
    {
      "company": "Company Name",
      "contact": "Contact Person",
      "type": "new|renewal|reactivation",
      "signals": ["specific quotes or signals"],
      "estimatedValue": 5000,
      "urgency": "immediate|this_week|this_month|this_quarter",
      "nextAction": "Suggested follow-up action",
      "confidence": 0.85
    }
  ],
  "summary": "Overall sponsorship pipeline assessment",
  "recommendations": ["Actionable next steps"]
}
\`\`\`

Focus on revenue-generating opportunities. Be specific about monetary values when mentioned.`;
  }

  // Generate prompt for consulting opportunity analysis
  async generateConsultingPrompt(): Promise<string> {
    return `You are analyzing communications for consulting and advisory opportunities.

CONSULTING SIGNALS TO DETECT:
${revenuePatterns.consulting.keywords.map(k => `- ${k}`).join("\n")}

VALUE INDICATORS:
${revenuePatterns.consulting.valueIndicators.map(v => `- ${v}`).join("\n")}

ANALYZE FOR:
1. **Direct Requests**: Companies explicitly asking for consulting help
2. **Problem Signals**: Companies expressing pain points you could solve
3. **Project Opportunities**: Specific projects being discussed
4. **Retainer Potential**: Ongoing advisory relationships

OUTPUT FORMAT:
\`\`\`json
{
  "opportunities": [
    {
      "company": "Company Name",
      "contact": "Contact Person",
      "projectType": "assessment|strategy|implementation|advisory",
      "scope": "Description of potential scope",
      "estimatedValue": 10000,
      "signals": ["specific quotes or signals"],
      "urgency": "immediate|this_week|this_month|this_quarter",
      "nextAction": "Suggested follow-up action",
      "confidence": 0.85
    }
  ],
  "summary": "Overall consulting pipeline assessment",
  "recommendations": ["Actionable next steps"]
}
\`\`\`

Focus on high-value engagements. Identify decision makers and budget holders.`;
  }

  // Generate prompt for speaking engagement analysis
  async generateSpeakingPrompt(): Promise<string> {
    return `You are analyzing communications for speaking and presentation opportunities.

SPEAKING SIGNALS TO DETECT:
${revenuePatterns.speaking.keywords.map(k => `- ${k}`).join("\n")}

VALUE INDICATORS:
${revenuePatterns.speaking.valueIndicators.map(v => `- ${v}`).join("\n")}

ANALYZE FOR:
1. **Event Invitations**: Conferences, summits, webinars requesting speakers
2. **Panel Opportunities**: Requests to join panels or moderate discussions
3. **Workshop Requests**: Training or workshop facilitation opportunities
4. **Recurring Engagements**: Organizations that might want multiple sessions

OUTPUT FORMAT:
\`\`\`json
{
  "opportunities": [
    {
      "event": "Event Name",
      "organizer": "Organization",
      "contact": "Contact Person",
      "type": "keynote|panel|workshop|webinar|fireside",
      "date": "Event date if known",
      "location": "Location or Virtual",
      "estimatedFee": 2500,
      "signals": ["specific quotes or signals"],
      "nextAction": "Suggested follow-up action",
      "confidence": 0.85
    }
  ],
  "summary": "Overall speaking pipeline assessment",
  "recommendations": ["Actionable next steps"]
}
\`\`\`

Note travel requirements and time commitments. Flag conflicting dates.`;
  }

  // Generate prompt for partnership analysis
  async generatePartnershipPrompt(): Promise<string> {
    return `You are analyzing communications for strategic partnership opportunities.

PARTNERSHIP SIGNALS TO DETECT:
${revenuePatterns.partnership.keywords.map(k => `- ${k}`).join("\n")}

VALUE INDICATORS:
${revenuePatterns.partnership.valueIndicators.map(v => `- ${v}`).join("\n")}

ANALYZE FOR:
1. **Strategic Alliances**: Organizations proposing joint initiatives
2. **Co-Marketing**: Opportunities for shared promotion
3. **Revenue Sharing**: Partnerships with revenue split arrangements
4. **Content Partnerships**: Collaborative content creation opportunities

OUTPUT FORMAT:
\`\`\`json
{
  "opportunities": [
    {
      "partner": "Partner Organization",
      "contact": "Contact Person",
      "partnershipType": "strategic|co-marketing|revenue-share|content",
      "proposal": "Summary of proposed partnership",
      "potentialValue": "estimated annual value",
      "signals": ["specific quotes or signals"],
      "risks": ["potential concerns"],
      "nextAction": "Suggested follow-up action",
      "confidence": 0.85
    }
  ],
  "summary": "Overall partnership pipeline assessment",
  "recommendations": ["Actionable next steps"]
}
\`\`\`

Evaluate strategic fit with Hacker Valley Media's brand and audience.`;
  }

  // Generate comprehensive revenue scan prompt
  async generateFullRevenueScanPrompt(): Promise<string> {
    const allKeywords = Object.values(revenuePatterns)
      .flatMap(p => p.keywords)
      .slice(0, 50); // Top 50 keywords

    return `You are performing a comprehensive revenue opportunity scan across all communications.

REVENUE CATEGORIES TO ANALYZE:
1. **Sponsorship**: Brand partnerships, advertising, promotional content
2. **Consulting**: Advisory services, assessments, strategy work
3. **Speaking**: Events, conferences, webinars, workshops
4. **Partnership**: Strategic alliances, revenue sharing, co-creation
5. **Licensing**: Content rights, syndication, distribution
6. **Product**: Courses, memberships, merchandise
7. **Service**: Ongoing production, support, managed services
8. **Referral**: Introduction fees, finder's fees
9. **Renewal**: Existing relationships up for renewal

KEY SIGNALS TO DETECT:
${allKeywords.map(k => `- ${k}`).join("\n")}

URGENCY LEVELS:
- **Immediate**: Action needed today/tomorrow
- **This Week**: Needs attention within 7 days
- **This Month**: Can be scheduled this month
- **This Quarter**: Longer-term opportunity
- **Long Term**: Future potential

OUTPUT FORMAT:
\`\`\`json
{
  "hotOpportunities": [
    {
      "category": "sponsorship|consulting|speaking|etc",
      "company": "Company Name",
      "contact": "Contact Person",
      "summary": "Brief description",
      "estimatedValue": 5000,
      "urgency": "immediate|this_week|this_month",
      "signals": ["specific evidence"],
      "nextAction": "Recommended action",
      "confidence": 0.9
    }
  ],
  "pipeline": {
    "totalEstimatedValue": 50000,
    "byCategory": {
      "sponsorship": 20000,
      "consulting": 15000,
      "speaking": 10000,
      "other": 5000
    }
  },
  "staleOpportunities": [
    {
      "description": "Opportunity that went cold",
      "lastActivity": "2025-01-01",
      "reactivationSuggestion": "How to revive"
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "action": "Specific recommended action",
      "rationale": "Why this matters now"
    }
  ]
}
\`\`\`

Be aggressive about identifying revenue potential. Quantify when possible.`;
  }

  // Generate lost revenue analysis prompt
  async generateLostRevenuePrompt(): Promise<string> {
    return `You are analyzing communications for missed or lost revenue opportunities.

ANALYZE FOR:
1. **Unanswered Inquiries**: Revenue-related emails that weren't responded to
2. **Dropped Conversations**: Discussions that stopped before closing
3. **Lost Deals**: Opportunities that went to competitors or were declined
4. **Expired Renewals**: Contracts or partnerships that weren't renewed
5. **Underpriced Deals**: Engagements that could have commanded higher rates

RECOVERY SIGNALS:
- Recent activity from dormant contacts
- Changes in company circumstances
- New budget cycles (Q1, fiscal year)
- Industry events or triggers

OUTPUT FORMAT:
\`\`\`json
{
  "lostOpportunities": [
    {
      "type": "unanswered|dropped|lost|expired|underpriced",
      "originalValue": 5000,
      "company": "Company Name",
      "contact": "Contact Person",
      "lastActivity": "2025-01-01",
      "reason": "Why it was lost if known",
      "recoveryPotential": "high|medium|low",
      "recoverySuggestion": "How to potentially recover"
    }
  ],
  "estimatedLostRevenue": 25000,
  "recoverableAmount": 10000,
  "priorityRecoveries": [
    {
      "company": "Best recovery target",
      "action": "Recommended approach",
      "timing": "When to act"
    }
  ],
  "processImprovements": [
    "Suggestions to prevent future losses"
  ]
}
\`\`\`

Focus on recoverable opportunities and process improvements.`;
  }

  // Get full revenue context for agents
  async getFullContext(): Promise<RevenueContext> {
    // Load existing pipeline if available
    const pipelinePath = `${this.statePath}/revenue-pipeline.json`;
    let pipeline: RevenuePipeline;

    try {
      const file = Bun.file(pipelinePath);
      if (await file.exists()) {
        pipeline = await file.json();
      } else {
        pipeline = this.createEmptyPipeline();
      }
    } catch {
      pipeline = this.createEmptyPipeline();
    }

    // Get recent activity
    const recentActivity = pipeline.signals
      .filter(s => {
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return new Date(s.detectedAt).getTime() > dayAgo;
      })
      .slice(0, 10);

    // Calculate trends (placeholder - would need historical data)
    const trends: RevenueTrend[] = [];

    // Generate recommendations
    const recommendations = this.generateRecommendations(pipeline);

    return {
      pipeline,
      recentActivity,
      trends,
      recommendations,
    };
  }

  private createEmptyPipeline(): RevenuePipeline {
    return {
      signals: [],
      totalEstimatedValue: 0,
      byCategory: {
        sponsorship: 0,
        consulting: 0,
        speaking: 0,
        partnership: 0,
        licensing: 0,
        affiliate: 0,
        product: 0,
        service: 0,
        referral: 0,
        renewal: 0,
      },
      byStage: {
        lead: 0,
        qualified: 0,
        proposal: 0,
        negotiation: 0,
        closed_won: 0,
        closed_lost: 0,
      },
      byUrgency: {
        immediate: 0,
        this_week: 0,
        this_month: 0,
        this_quarter: 0,
        long_term: 0,
      },
      hotLeads: [],
      staleOpportunities: [],
      updatedAt: new Date().toISOString(),
    };
  }

  private generateRecommendations(pipeline: RevenuePipeline): RevenueRecommendation[] {
    const recommendations: RevenueRecommendation[] = [];

    // Hot leads need immediate follow-up
    for (const lead of pipeline.hotLeads.slice(0, 3)) {
      recommendations.push({
        type: "follow_up",
        priority: "high",
        contact: lead.contact,
        company: lead.company,
        reason: `Hot lead with ${lead.urgency} urgency`,
        suggestedAction: lead.nextAction || "Send follow-up email",
        estimatedValue: lead.estimatedValue,
      });
    }

    // Stale opportunities might need reactivation
    for (const stale of pipeline.staleOpportunities.slice(0, 2)) {
      recommendations.push({
        type: "outreach",
        priority: "medium",
        contact: stale.contact,
        company: stale.company,
        reason: "Opportunity has gone cold",
        suggestedAction: "Send check-in email to revive conversation",
        estimatedValue: stale.estimatedValue,
      });
    }

    return recommendations;
  }

  // Detect revenue signals from text
  detectSignals(text: string): { category: RevenueCategory; confidence: number; matches: string[] }[] {
    const results: { category: RevenueCategory; confidence: number; matches: string[] }[] = [];
    const lowerText = text.toLowerCase();

    for (const [category, patterns] of Object.entries(revenuePatterns)) {
      const matches: string[] = [];

      for (const keyword of patterns.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          matches.push(keyword);
        }
      }

      if (matches.length > 0) {
        // Boost confidence if value indicators present
        let confidence = Math.min(0.5 + matches.length * 0.1, 0.9);
        for (const indicator of patterns.valueIndicators) {
          if (lowerText.includes(indicator.toLowerCase())) {
            confidence = Math.min(confidence + 0.05, 0.95);
          }
        }

        results.push({
          category: category as RevenueCategory,
          confidence,
          matches,
        });
      }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // Detect urgency from text
  detectUrgency(text: string): RevenueUrgency {
    const lowerText = text.toLowerCase();

    for (const [urgency, patterns] of Object.entries(urgencyPatterns)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          return urgency as RevenueUrgency;
        }
      }
    }

    return "this_quarter"; // Default
  }

  // Detect stage from text
  detectStage(text: string): RevenueStage {
    const lowerText = text.toLowerCase();

    for (const [stage, patterns] of Object.entries(stagePatterns)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          return stage as RevenueStage;
        }
      }
    }

    return "lead"; // Default
  }
}

// Revenue-specific output templates
export const revenueOutputTemplates = {
  opportunity_card: `## Revenue Opportunity Card

**Company**: {{company}}
**Contact**: {{contact}}
**Category**: {{category}}
**Stage**: {{stage}}
**Urgency**: {{urgency}}

### Estimated Value
${{estimatedValue}}

### Signals Detected
{{#signals}}
- {{.}}
{{/signals}}

### Recommended Next Action
{{nextAction}}

### Confidence: {{confidence}}%

---
*Detected: {{detectedAt}}*`,

  pipeline_summary: `# Revenue Pipeline Summary

## Overview
- **Total Pipeline Value**: ${{totalValue}}
- **Hot Opportunities**: {{hotCount}}
- **Stale Opportunities**: {{staleCount}}

## By Category
{{#categories}}
- **{{name}}**: ${{value}} ({{count}} opportunities)
{{/categories}}

## By Stage
{{#stages}}
- **{{name}}**: {{count}} opportunities
{{/stages}}

## Immediate Actions Required
{{#immediateActions}}
1. {{action}} - {{company}} (${{value}})
{{/immediateActions}}

## This Week's Focus
{{#weeklyFocus}}
- {{item}}
{{/weeklyFocus}}

---
*Updated: {{updatedAt}}*`,

  revenue_alert: `🚨 **REVENUE ALERT**

**Type**: {{alertType}}
**Priority**: {{priority}}

{{message}}

**Recommended Action**: {{action}}

---
*Generated: {{timestamp}}*`,
};

export const revenueAnalyzer = new RevenueAnalyzer();
