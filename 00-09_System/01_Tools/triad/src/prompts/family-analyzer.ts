// Family Analyzer - Specialized prompts for family and personal life analysis
// Phase 6.1: Family/Life Analysis

import { config } from "../utils/config";

// Family value categories
export type FamilyCategory =
  | "quality_time"
  | "milestones"
  | "traditions"
  | "memories"
  | "growth"
  | "health"
  | "education"
  | "celebrations"
  | "travel"
  | "relationships";

export type LifeCategory =
  | "work_life_balance"
  | "personal_growth"
  | "health_wellness"
  | "hobbies"
  | "social"
  | "financial"
  | "spiritual"
  | "creative"
  | "adventure"
  | "learning";

export interface FamilyEvent {
  id: string;
  type: "birthday" | "anniversary" | "milestone" | "tradition" | "vacation" | "gathering" | "achievement";
  title: string;
  description?: string;
  date?: string;
  recurring?: boolean;
  recurringPattern?: string; // e.g., "yearly", "monthly"
  participants?: string[];
  importance: "high" | "medium" | "low";
  reminderDays?: number; // Days before to remind
  notes?: string;
  lastCelebrated?: string;
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthday?: string;
  interests?: string[];
  notes?: string;
  lastInteraction?: string;
  importantDates?: Array<{ date: string; description: string }>;
}

export interface LifeInsight {
  id: string;
  category: LifeCategory;
  insight: string;
  source: string;
  actionable: boolean;
  suggestedAction?: string;
  priority: "high" | "medium" | "low";
  detectedAt: string;
}

export interface FamilyContext {
  members: FamilyMember[];
  upcomingEvents: FamilyEvent[];
  recentMemories: string[];
  balanceScore: number; // 0-100 work/life balance
  qualityTimeScore: number; // 0-100 family time quality
  recommendations: string[];
}

export class FamilyAnalyzer {
  private vramPath: string;
  private statePath: string;

  constructor() {
    this.vramPath = config.vramPath;
    this.statePath = config.statePath;
  }

  // Generate prompt for family time analysis
  async generateFamilyTimePrompt(): Promise<string> {
    return `You are analyzing personal data to identify family-related insights and opportunities for quality time.

FAMILY CATEGORIES TO CONSIDER:
1. **Quality Time**: Opportunities for meaningful family interactions
2. **Milestones**: Important life events and achievements
3. **Traditions**: Family traditions to maintain or create
4. **Memories**: Past experiences worth preserving or revisiting
5. **Growth**: Family members' development and learning
6. **Health**: Family health and wellness considerations
7. **Education**: Learning opportunities for family
8. **Celebrations**: Birthdays, anniversaries, achievements
9. **Travel**: Family trips and adventures
10. **Relationships**: Maintaining and strengthening family bonds

ANALYZE FOR:
1. Calendar patterns showing family time availability
2. Upcoming important dates (birthdays, anniversaries)
3. Recurring commitments that could involve family
4. Opportunities to create new memories
5. Signs of work-life imbalance affecting family time

OUTPUT FORMAT:
\`\`\`json
{
  "familyInsights": [
    {
      "type": "quality_time|milestone|tradition|memory|etc",
      "insight": "What was discovered",
      "opportunity": "How to act on this",
      "urgency": "immediate|this_week|this_month",
      "participants": ["family members involved"],
      "suggestedDate": "When to do this",
      "confidence": 0.85
    }
  ],
  "upcomingEvents": [
    {
      "event": "Birthday/Anniversary/etc",
      "person": "Who it involves",
      "date": "When",
      "daysAway": 14,
      "suggestion": "How to celebrate"
    }
  ],
  "balanceAssessment": {
    "workLifeScore": 75,
    "familyTimeScore": 80,
    "concerns": ["Areas needing attention"],
    "improvements": ["Suggestions for better balance"]
  },
  "recommendations": [
    {
      "action": "What to do",
      "reason": "Why it matters",
      "timing": "When to do it"
    }
  ]
}
\`\`\`

Focus on actionable insights that enhance family life without being intrusive.`;
  }

  // Generate prompt for personal growth analysis
  async generatePersonalGrowthPrompt(): Promise<string> {
    return `You are analyzing personal data for growth and self-improvement opportunities.

PERSONAL GROWTH AREAS:
1. **Skills Development**: Professional and personal skills
2. **Health & Wellness**: Physical and mental health patterns
3. **Learning**: Educational opportunities and progress
4. **Habits**: Positive habits to reinforce, negative ones to address
5. **Goals**: Progress toward personal goals
6. **Creativity**: Creative outlets and expression
7. **Social**: Social connections and relationship health
8. **Financial**: Financial wellness and planning
9. **Spiritual**: Spiritual or mindfulness practices
10. **Adventure**: New experiences and stepping outside comfort zone

ANALYZE FOR:
1. Patterns in behavior that indicate growth or stagnation
2. Opportunities for skill development
3. Health indicators that need attention
4. Goals mentioned but not acted upon
5. Habits that could be improved
6. Balance between different life areas

OUTPUT FORMAT:
\`\`\`json
{
  "growthOpportunities": [
    {
      "area": "skills|health|learning|etc",
      "observation": "What was noticed",
      "suggestion": "How to grow",
      "effort": "low|medium|high",
      "impact": "low|medium|high",
      "timeframe": "daily|weekly|monthly"
    }
  ],
  "habitAnalysis": {
    "positiveHabits": ["Habits to reinforce"],
    "habitsToImprove": ["Habits needing attention"],
    "suggestedNewHabits": ["New habits to consider"]
  },
  "goalProgress": [
    {
      "goal": "What the goal is",
      "progress": "Current status",
      "nextStep": "What to do next",
      "obstacles": ["What's in the way"]
    }
  ],
  "lifeBalance": {
    "strongAreas": ["Well-balanced areas"],
    "needsAttention": ["Areas needing focus"],
    "overallScore": 75
  },
  "weeklyFocus": {
    "area": "This week's priority",
    "action": "Specific action to take",
    "measureSuccess": "How to know if successful"
  }
}
\`\`\`

Focus on sustainable improvements, not overwhelming changes.`;
  }

  // Generate prompt for memories and traditions
  async generateMemoriesPrompt(): Promise<string> {
    return `You are analyzing data to surface precious memories and suggest ways to create new ones.

MEMORY CATEGORIES:
1. **Family Moments**: Special times with family
2. **Achievements**: Personal and family accomplishments
3. **Milestones**: Life transitions and important dates
4. **Traditions**: Annual or recurring meaningful events
5. **Travel Memories**: Trips and adventures
6. **Learning Moments**: Times of growth and discovery
7. **Celebrations**: Parties, gatherings, special occasions
8. **Everyday Magic**: Small moments that matter

ANALYZE FOR:
1. Photos, videos, or notes that capture special moments
2. Recurring events that could become traditions
3. Past experiences worth revisiting or recreating
4. Missed opportunities to document important moments
5. Traditions that may have lapsed

OUTPUT FORMAT:
\`\`\`json
{
  "memoriesFound": [
    {
      "type": "family|achievement|milestone|tradition|etc",
      "memory": "Description of the memory",
      "date": "When it occurred",
      "significance": "Why it matters",
      "preservationSuggestion": "How to preserve or revisit"
    }
  ],
  "traditionOpportunities": [
    {
      "tradition": "What it could be",
      "frequency": "yearly|monthly|weekly",
      "participants": ["Who should be involved"],
      "firstOccasion": "When to start"
    }
  ],
  "memoryCreationIdeas": [
    {
      "idea": "What to do",
      "timing": "When to do it",
      "why": "Why this would be meaningful"
    }
  ],
  "anniversariesThisMonth": [
    {
      "date": "When",
      "event": "What happened",
      "yearsAgo": 5,
      "suggestionToCelebrate": "How to mark it"
    }
  ]
}
\`\`\`

Focus on preserving and creating meaningful moments.`;
  }

  // Generate prompt for work-life balance analysis
  async generateBalancePrompt(): Promise<string> {
    return `You are analyzing patterns to assess and improve work-life balance.

BALANCE INDICATORS:
1. **Time Allocation**: How time is split between work and personal
2. **Boundary Setting**: Work bleeding into personal time
3. **Recovery Time**: Adequate rest and recharge
4. **Family Time**: Quality time with loved ones
5. **Personal Time**: Self-care and individual pursuits
6. **Energy Levels**: Signs of burnout or sustained energy
7. **Commitments**: Overcommitment vs healthy engagement
8. **Flexibility**: Ability to adjust when needed

WARNING SIGNS TO DETECT:
- Working during family time
- Skipping meals or exercise
- Declining social invitations
- No personal hobbies or interests
- Weekend work becoming normal
- Vacation time unused
- Sleep disruption patterns

OUTPUT FORMAT:
\`\`\`json
{
  "balanceAssessment": {
    "overallScore": 70,
    "workHoursPattern": "description of work patterns",
    "personalTimeQuality": "high|medium|low",
    "boundaryHealth": "strong|moderate|weak",
    "burnoutRisk": "low|moderate|high"
  },
  "redFlags": [
    {
      "flag": "What's concerning",
      "evidence": "Why we think this",
      "impact": "How it affects life",
      "intervention": "What to do about it"
    }
  ],
  "greenFlags": [
    {
      "flag": "What's working well",
      "evidence": "Why we think this",
      "reinforcement": "How to maintain it"
    }
  ],
  "recommendations": [
    {
      "area": "work|personal|family|health",
      "recommendation": "What to change",
      "implementation": "How to do it",
      "expectedBenefit": "What will improve"
    }
  ],
  "weeklyActions": [
    {
      "day": "Monday|Tuesday|etc",
      "action": "Specific action",
      "duration": "15 min|1 hour|etc",
      "purpose": "Why this helps"
    }
  ]
}
\`\`\`

Focus on sustainable balance, not perfection.`;
  }

  // Get family context for agents
  async getFullContext(): Promise<FamilyContext> {
    const membersPath = `${this.statePath}/family-members.json`;
    const eventsPath = `${this.statePath}/family-events.json`;

    let members: FamilyMember[] = [];
    let events: FamilyEvent[] = [];

    try {
      const membersFile = Bun.file(membersPath);
      if (await membersFile.exists()) {
        members = await membersFile.json();
      }
    } catch {
      // No members file yet
    }

    try {
      const eventsFile = Bun.file(eventsPath);
      if (await eventsFile.exists()) {
        const allEvents: FamilyEvent[] = await eventsFile.json();
        // Filter to upcoming events
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        events = allEvents.filter(e => {
          if (!e.date) return false;
          const eventDate = new Date(e.date);
          return eventDate >= now && eventDate <= thirtyDaysFromNow;
        });
      }
    } catch {
      // No events file yet
    }

    return {
      members,
      upcomingEvents: events,
      recentMemories: [],
      balanceScore: 75, // Default placeholder
      qualityTimeScore: 70, // Default placeholder
      recommendations: this.generateRecommendations(members, events),
    };
  }

  private generateRecommendations(members: FamilyMember[], events: FamilyEvent[]): string[] {
    const recommendations: string[] = [];

    // Check for upcoming birthdays
    const now = new Date();
    for (const member of members) {
      if (member.birthday) {
        const birthday = new Date(member.birthday);
        birthday.setFullYear(now.getFullYear());
        if (birthday < now) {
          birthday.setFullYear(now.getFullYear() + 1);
        }
        const daysUntil = Math.ceil((birthday.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
        if (daysUntil <= 30) {
          recommendations.push(`${member.name}'s birthday is in ${daysUntil} days - start planning!`);
        }
      }
    }

    // Check for family members not contacted recently
    for (const member of members) {
      if (member.lastInteraction) {
        const lastContact = new Date(member.lastInteraction);
        const daysSince = Math.floor((now.getTime() - lastContact.getTime()) / (24 * 60 * 60 * 1000));
        if (daysSince > 30) {
          recommendations.push(`Reach out to ${member.name} - it's been ${daysSince} days since last contact`);
        }
      }
    }

    // Suggest quality time if no recent events
    if (events.length === 0) {
      recommendations.push("Consider planning a family activity this month");
    }

    return recommendations;
  }

  // Save family member
  async saveMember(member: Omit<FamilyMember, "id" | "createdAt">): Promise<FamilyMember> {
    const membersPath = `${this.statePath}/family-members.json`;
    let members: FamilyMember[] = [];

    try {
      const file = Bun.file(membersPath);
      if (await file.exists()) {
        members = await file.json();
      }
    } catch {
      // Fresh start
    }

    const newMember: FamilyMember = {
      ...member,
      id: `fam-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };

    members.push(newMember);
    await Bun.write(membersPath, JSON.stringify(members, null, 2));

    return newMember;
  }

  // Save family event
  async saveEvent(event: Omit<FamilyEvent, "id" | "createdAt">): Promise<FamilyEvent> {
    const eventsPath = `${this.statePath}/family-events.json`;
    let events: FamilyEvent[] = [];

    try {
      const file = Bun.file(eventsPath);
      if (await file.exists()) {
        events = await file.json();
      }
    } catch {
      // Fresh start
    }

    const newEvent: FamilyEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date().toISOString(),
    };

    events.push(newEvent);
    await Bun.write(eventsPath, JSON.stringify(events, null, 2));

    return newEvent;
  }

  // Get upcoming events
  async getUpcomingEvents(days: number = 30): Promise<FamilyEvent[]> {
    const eventsPath = `${this.statePath}/family-events.json`;

    try {
      const file = Bun.file(eventsPath);
      if (!(await file.exists())) {
        return [];
      }

      const allEvents: FamilyEvent[] = await file.json();
      const now = new Date();
      const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      return allEvents
        .filter(e => {
          if (!e.date) return false;
          const eventDate = new Date(e.date);
          return eventDate >= now && eventDate <= cutoff;
        })
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    } catch {
      return [];
    }
  }
}

// Family output templates
export const familyOutputTemplates = {
  family_insight: `## Family Insight

**Category**: {{category}}
**Type**: {{type}}

### What We Found
{{insight}}

### Opportunity
{{opportunity}}

### Suggested Action
{{suggestedAction}}

### When
{{timing}}

---
*Confidence: {{confidence}}%*`,

  upcoming_event: `## Upcoming Family Event

**Event**: {{title}}
**Date**: {{date}}
**Days Away**: {{daysAway}}

### Who's Involved
{{#participants}}
- {{.}}
{{/participants}}

### How to Celebrate
{{suggestion}}

---
*Importance: {{importance}}*`,

  balance_report: `# Work-Life Balance Report

## Overall Score: {{overallScore}}/100

### Strengths
{{#greenFlags}}
- ✅ {{flag}}
{{/greenFlags}}

### Areas for Improvement
{{#redFlags}}
- ⚠️ {{flag}}
{{/redFlags}}

### This Week's Focus
{{weeklyFocus}}

### Recommended Actions
{{#recommendations}}
1. **{{area}}**: {{recommendation}}
{{/recommendations}}

---
*Generated: {{generatedAt}}*`,
};

export const familyAnalyzer = new FamilyAnalyzer();
