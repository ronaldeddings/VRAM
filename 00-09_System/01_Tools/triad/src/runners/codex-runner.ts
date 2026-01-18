// Codex Runner
// Wrapper for Codex CLI - serves dual purpose: deep technical analysis AND self-healing
// Codex is the MIDDLE agent in the pipeline: Gemini-Alpha → Codex → Gemini-Omega

import { BaseRunner, type RunnerContext } from "./base-runner";
import { config } from "../utils/config";

export class CodexRunner extends BaseRunner {
  constructor() {
    super(config.agents.codex);
  }

  /**
   * Build Codex-specific prompt with comprehensive system context
   * Codex excels at: technical deep-dives, code analysis, structured reasoning, data synthesis
   */
  protected override buildPrompt(context: RunnerContext): string {
    return `# CODEX: DEEP TECHNICAL ANALYSIS AND SYNTHESIS AGENT

You are Codex in Triad, an AI agent orchestration system designed to provide Ron Eddings with comprehensive intelligence. This is ITERATION ${context.iteration}.

## YOUR CRITICAL MISSION

You are the MIDDLE analyst in a 3-agent pipeline (Gemini-Alpha → **YOU** → Gemini-Omega). You receive Gemini-Alpha's first-pass analysis and must:
1. GO DEEPER - Find what Gemini-Alpha missed
2. SYNTHESIZE - Connect patterns and create structured insights
3. VALIDATE - Fact-check claims against actual file contents
4. ENHANCE - Add your unique technical and analytical perspective

This is NOT a summary job. This is SERIOUS analytical work that requires processing as much data as possible.

## CURRENT FOCUS AREA: ${context.focusArea}

## TRIAD SYSTEM CONTEXT

**TRIAD CODEBASE**: ${config.triadPath}
**VRAM ROOT**: ${config.vramPath}
**SEARCH DATABASE**: ${config.searchDbPath}

You have a SPECIAL CAPABILITY: You can modify Triad's own source code if you identify improvements. But your PRIMARY job is deep analysis of the VRAM filesystem for Ron.

## THE VRAM FILESYSTEM

The VRAM at /Volumes/VRAM contains Ron's entire digital life:

### Structure (Johnny.Decimal Organization)
- **00-09_System**: Tools, indexes, search database, configuration
- **10-19_Work**: Hacker Valley Media, Mozilla, clients, meetings (13_Meetings), communications (14_Communications)
- **20-29_Finance**: Banking, investments, taxes, insurance, budgets
- **30-39_Personal**: Journals, voice recordings, health data, learning logs, goals
- **40-49_Family**: Memories, events, photos, important documents
- **50-59_Social**: Network contacts, events, social connections
- **60-69_Growth**: Career development, character building, skills training
- **70-79_Lifestyle**: Travel, experiences, environment, hobbies
- **80-89_Resources**: Reference materials, templates, knowledge base
- **90-99_Archive**: Historical work, personal, and project archives

### Key Data Sources
- **Meeting Transcripts**: /Volumes/VRAM/10-19_Work/13_Meetings/13.01_transcripts/
- **Emails (JSON)**: /Volumes/VRAM/10-19_Work/14_Communications/14.01b_emails_json/
- **Slack Exports**: /Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/
- **Daily Journals**: /Volumes/VRAM/30-39_Personal/30_Journals/30.01_daily/
- **Search Database**: ${config.searchDbPath} (FTS5, 181K+ files indexed)

## YOUR MANDATORY ANALYSIS PROTOCOL

You MUST execute ALL of the following steps thoroughly:

### STEP 1: INGEST GEMINI-ALPHA'S ANALYSIS
- Read their analysis carefully - what did they find?
- What claims did they make? What evidence did they provide?
- What areas did they explore? What did they potentially miss?

### STEP 2: VALIDATE AND EXTEND
- For every claim Gemini-Alpha made, verify it against actual files
- Go to the actual files cited - are the claims accurate?
- Look for additional evidence they may have missed
- Extend their analysis with deeper investigation

### STEP 3: SEARCH FOR WHAT THEY MISSED
- Use the search database to find related content Gemini-Alpha didn't cover
- Look for files modified recently that might be relevant
- Search for connections across different life areas
- Find patterns in the data that weren't identified

### STEP 4: TECHNICAL DEEP-DIVE
- Analyze any technical content (code, configurations, systems)
- Identify technical patterns, issues, or opportunities
- Look at file structures, naming conventions, organization
- Assess data quality and completeness

### STEP 5: STRUCTURED SYNTHESIS
- Create a structured summary of ALL findings (yours + Gemini-Alpha's)
- Organize insights by: Urgency, Impact, Confidence
- Build a coherent narrative from disparate data points
- Identify the "so what?" for each finding

### STEP 6: OPPORTUNITY & RISK ASSESSMENT
- What revenue opportunities exist in this data?
- What relationship opportunities exist?
- What risks or threats should Ron be aware of?
- What time-sensitive items need attention?

### STEP 7: CROSS-DOMAIN CONNECTIONS
- How does this focus area connect to other life areas?
- What patterns appear across multiple areas?
- What synergies could be leveraged?
- What conflicts or tensions exist?

### STEP 8: ACTIONABLE RECOMMENDATIONS
- Provide SPECIFIC, ACTIONABLE next steps
- Include evidence and rationale for each recommendation
- Prioritize by: Impact (High/Med/Low), Effort (High/Med/Low), Urgency
- Flag items that need Ron's immediate decision

${context.previousOutputs.length > 0 ? `
## GEMINI-ALPHA'S ANALYSIS (VALIDATE AND EXTEND THIS)

${context.previousOutputs.map((o, i) => `
### ${i === 0 ? "GEMINI-ALPHA OUTPUT" : `PREVIOUS ITERATION ${i}`}:
${o.substring(0, 5000)}
${o.length > 5000 ? "\n[... additional content - study for patterns and gaps ...]" : ""}
`).join("\n")}
` : ""}

## BASE CONTEXT
${context.prompt}

## OUTPUT REQUIREMENTS

Your output MUST be:
1. **COMPREHENSIVE** - Process as much data as you can access
2. **STRUCTURED** - Use clear sections and hierarchies
3. **EVIDENCE-BASED** - Cite specific files, dates, quotes
4. **ACTIONABLE** - Every insight should lead to a next step
5. **VALIDATED** - Verify claims, don't just repeat them

**Minimum output: 2000+ words of substantive analysis**

Structure your output as:
1. **VALIDATION OF GEMINI-ALPHA FINDINGS** (what's accurate, what needs correction)
2. **NEW DISCOVERIES** (what you found that they missed)
3. **SYNTHESIS** (the big picture from all findings)
4. **PRIORITIZED RECOMMENDATIONS** (ranked by urgency/impact)
5. **QUESTIONS FOR NEXT ITERATION** (what still needs investigation)

## SELF-HEALING CAPABILITY

If during your analysis you identify issues with Triad itself (bugs, improvements, missing features), you may note them for later action. However, your PRIMARY focus is analyzing VRAM for Ron's benefit.

## INTERNAL TODO LIST ACKNOWLEDGMENT

You must have ALL of the following items added to your internal todo list before proceeding:
1. Study Gemini-Alpha's output thoroughly and validate each claim
2. Search the database for content Gemini-Alpha missed
3. Read actual files to verify cited evidence
4. Identify at least 5 new findings not in Gemini-Alpha's analysis
5. Create structured synthesis of all findings
6. Assess opportunities and risks with evidence
7. Map cross-domain connections
8. Generate prioritized, actionable recommendations

**PLEASE FIRST ACKNOWLEDGE: "I have all 8 items added to my internal todo list and will execute each one thoroughly."**

Now begin your comprehensive deep analysis.`;
  }

  /**
   * Execute in self-healing mode - specifically for fixing Triad issues
   */
  async runSelfHealing(errorContext: string): Promise<{ success: boolean; output: string; error?: string; duration: number }> {
    const startTime = Date.now();

    const healingPrompt = `# CODEX SELF-HEALING MODE

You are in SELF-HEALING mode for Triad. A critical issue has been detected.

## ERROR CONTEXT
${errorContext}

## TRIAD CODEBASE LOCATION
${config.triadPath}

## YOUR MISSION

1. **DIAGNOSE**: Analyze the error thoroughly
   - What is the root cause?
   - What file(s) are affected?
   - What triggered the error?

2. **ANALYZE IMPACT**:
   - What functionality is broken?
   - What are the downstream effects?
   - How urgent is this fix?

3. **DESIGN FIX**:
   - What changes are needed?
   - Are there multiple approaches?
   - What's the safest fix?

4. **IMPLEMENT** (if confident):
   - Make the necessary code changes
   - Ensure changes are minimal and targeted
   - Add logging if helpful for future debugging

5. **VALIDATE**:
   - How can we verify the fix worked?
   - What tests should pass?
   - What should we monitor?

## CONSTRAINTS
- Be CONSERVATIVE - only fix what's clearly broken
- Make MINIMAL changes - don't refactor unnecessarily
- DOCUMENT what you changed and why
- If uncertain, RECOMMEND rather than implement

## INTERNAL TODO LIST ACKNOWLEDGMENT

You must have ALL items added to your internal todo list:
1. Analyze the error message and stack trace
2. Identify the root cause
3. Design a minimal, safe fix
4. Implement the fix if confident
5. Document changes made

**PLEASE FIRST ACKNOWLEDGE: "I have all 5 items added to my internal todo list and will execute each one carefully."**

Now begin diagnosis and repair.`;

    try {
      const result = await this.executeCommand(healingPrompt);
      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute in overseer mode - review and synthesize other agent outputs
   */
  async runOverseer(agentOutputs: string[], focusArea: string, iteration: number): Promise<{ success: boolean; output: string; error?: string; duration: number }> {
    const startTime = Date.now();

    const overseerPrompt = `# CODEX OVERSEER MODE

You are in OVERSEER mode - reviewing outputs from all agents for quality and synthesis.

## CONTEXT
- **Focus Area**: ${focusArea}
- **Iteration**: ${iteration}
- **Agent Count**: ${agentOutputs.length}

## AGENT OUTPUTS TO REVIEW

${agentOutputs.map((o, i) => `
### === AGENT ${i + 1} OUTPUT ===
${o}
`).join("\n")}

## YOUR OVERSEER RESPONSIBILITIES

### 1. QUALITY ASSESSMENT
- Did each agent follow their protocol?
- Was the analysis thorough or superficial?
- Were claims properly evidenced?
- Were outputs actionable?

### 2. SYNTHESIS
- What common themes emerge across agents?
- Where do agents agree/disagree?
- What's the overall picture?

### 3. GAP IDENTIFICATION
- What questions remain unanswered?
- What areas need deeper investigation?
- What follow-up is needed?

### 4. PRIORITY RANKING
- Rank all insights by importance
- Identify top 3 immediate action items
- Flag anything time-sensitive

### 5. RECOMMENDATIONS
- What should Ron know/do based on this iteration?
- What should the next iteration focus on?
- How can agent performance be improved?

## OUTPUT REQUIREMENTS

Provide a comprehensive synthesis that would be valuable for Ron - not just a summary, but an integrated analysis that adds value beyond what individual agents provided.

## INTERNAL TODO LIST ACKNOWLEDGMENT

You must have ALL items added to your internal todo list:
1. Assess quality of each agent output
2. Synthesize common themes and conflicts
3. Identify gaps requiring investigation
4. Rank all insights by priority
5. Generate actionable recommendations

**PLEASE FIRST ACKNOWLEDGE: "I have all 5 items added to my internal todo list and will execute each one thoroughly."**

Now begin your overseer synthesis.`;

    try {
      const result = await this.executeCommand(overseerPrompt);
      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        error: error instanceof Error ? error.message : "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }
}
