# Triad: Self-Managing AI Agent Orchestration System

## Implementation Plan v2.0

---

## Executive Summary

**Triad** is a self-managing, self-healing AI agent orchestration system that continuously runs Claude, Codex, and Gemini to gain deep contextual understanding of Ron Eddings, Hacker Valley Media, and the entire VRAM filesystem. The system operates autonomously 24/7, with Codex serving as the overseer that can modify the application itself based on insights gathered.

### Core Philosophy

1. **Deep Understanding First**: Each focus area is explored deeply before moving on
2. **Constant Rotation**: Round-robin through all life areas, building cumulative knowledge
3. **Sequential Execution**: Agents run one after another (not concurrently) to avoid rate limits
4. **Self-Improvement**: Codex oversees and modifies the application as needed
5. **Self-Healing**: Automatic detection and repair of issues to maintain uptime
6. **Reports for Consumption**: Agentic layer prepares insights for Ron to consume
7. **Read-Only VRAM**: Never modify VRAM files; only read and understand
8. **Always Running**: Watchdog ensures the system never stops

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TRIAD SYSTEM                                   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                 WATCHDOG (triad-watchdog.sh)                        │ │
│  │                                                                      │ │
│  │   Runs in background, monitors process, restarts if stopped         │ │
│  │   └─ Checks every 30 seconds                                        │ │
│  │   └─ Logs restart events                                            │ │
│  │   └─ Never dies (uses nohup + disown)                               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                              │                                           │
│                              ▼                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    ORCHESTRATOR (Bun.serve)                         │ │
│  │                                                                      │ │
│  │   ┌─────────┐    ┌─────────┐    ┌─────────┐                        │ │
│  │   │ CLAUDE  │ →  │  CODEX  │ →  │ GEMINI  │ → (repeat)             │ │
│  │   │ Runner  │    │ Runner  │    │ Runner  │                        │ │
│  │   └────┬────┘    └────┬────┘    └────┬────┘                        │ │
│  │        │              │              │                              │ │
│  │        ▼              ▼              ▼                              │ │
│  │   ┌─────────┐    ┌─────────┐    ┌─────────┐                        │ │
│  │   │ outputs/│    │ outputs/│    │ outputs/│                        │ │
│  │   │ claude/ │    │  codex/ │    │ gemini/ │                        │ │
│  │   └─────────┘    └─────────┘    └─────────┘                        │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                              │                                           │
│         ┌────────────────────┼────────────────────┐                     │
│         ▼                    ▼                    ▼                     │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  OVERSEER   │    │   SELF-HEALER   │    │ REPORT GENERATOR│         │
│  │(Codex Loop) │    │  (Error Repair) │    │  (For Ron)      │         │
│  │             │    │                 │    │                 │         │
│  │ Improves    │    │ Detects issues  │    │ Prepares daily  │         │
│  │ the app     │    │ Fixes code      │    │ weekly reports  │         │
│  │ constantly  │    │ Auto-restarts   │    │ confidence-based│         │
│  └─────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    CONTEXT LAYER (Read-Only)                        │ │
│  │                                                                      │ │
│  │   /Volumes/VRAM/           ← Johnny.Decimal filesystem              │ │
│  │   search.db                ← Full-text search index                 │ │
│  │   Chrome MCP               ← Web browsing capability                │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
/Volumes/VRAM/00-09_System/01_Tools/triad/
├── package.json
├── tsconfig.json
├── bunfig.toml
├── CLAUDE.md                    # Project instructions
├── triad-watchdog.sh            # Watchdog script (runs independently)
├── start.sh                     # Main startup script
├── stop.sh                      # Graceful shutdown
│
├── src/
│   ├── index.ts                 # Main entry point
│   ├── server.ts                # Bun.serve orchestration server
│   ├── orchestrator.ts          # Agent scheduling & sequencing
│   │
│   ├── runners/
│   │   ├── base-runner.ts       # Abstract base class
│   │   ├── claude-runner.ts     # Claude CLI wrapper
│   │   ├── codex-runner.ts      # Codex CLI wrapper
│   │   └── gemini-runner.ts     # Gemini CLI wrapper
│   │
│   ├── overseer/
│   │   ├── overseer.ts          # Codex oversight loop (improvement)
│   │   ├── self-healer.ts       # Error detection & code repair
│   │   └── prompts.ts           # Oversight prompts
│   │
│   ├── reports/
│   │   ├── report-generator.ts  # Creates reports for Ron
│   │   ├── confidence-tracker.ts # Tracks finding confidence levels
│   │   ├── daily-digest.ts      # Daily summary generator
│   │   ├── weekly-report.ts     # Weekly deep-dive generator
│   │   └── templates/
│   │       ├── daily.md         # Daily report template
│   │       ├── weekly.md        # Weekly report template
│   │       └── insight-card.md  # Individual insight format
│   │
│   ├── context/
│   │   ├── vram-reader.ts       # Read-only VRAM access
│   │   ├── search-client.ts     # Search API client
│   │   ├── focus-tracker.ts     # Tracks deep-dive progress per area
│   │   └── prompt-builder.ts    # Dynamic prompt construction
│   │
│   └── utils/
│       ├── logger.ts            # Structured logging
│       ├── output-manager.ts    # Output file management
│       ├── health-monitor.ts    # Health checks & metrics
│       └── config.ts            # Configuration
│
├── outputs/
│   ├── claude/
│   │   └── [timestamp]-[iteration].md
│   ├── codex/
│   │   └── [timestamp]-[iteration].md
│   ├── gemini/
│   │   └── [timestamp]-[iteration].md
│   ├── overseer/
│   │   └── [timestamp]-decision.md
│   └── healer/
│       └── [timestamp]-repair.md
│
├── reports/                     # ★ REPORTS FOR RON'S CONSUMPTION
│   ├── daily/
│   │   └── [YYYY-MM-DD].md      # Daily digest
│   ├── weekly/
│   │   └── [YYYY-WXX].md        # Weekly deep-dive
│   ├── insights/
│   │   └── [category]/
│   │       └── [finding-id].md  # Individual high-confidence insights
│   ├── opportunities/
│   │   └── [priority]/          # Revenue/growth opportunities
│   └── action-items/
│       └── [date]-actions.md    # Specific action recommendations
│
├── prompts/
│   ├── claude-system.md         # Claude system prompt
│   ├── codex-system.md          # Codex system prompt
│   ├── gemini-system.md         # Gemini system prompt
│   ├── overseer-system.md       # Overseer improvement prompt
│   ├── healer-system.md         # Self-healer diagnosis prompt
│   └── reporter-system.md       # Report generation prompt
│
├── state/
│   ├── iteration.json           # Current iteration count
│   ├── focus-depth.json         # How deep we've gone per area
│   ├── confidence.json          # Confidence levels per finding
│   ├── context-cache.json       # Cached context summaries
│   ├── insights.json            # Accumulated insights
│   ├── health.json              # System health metrics
│   └── errors.json              # Error log for self-healer
│
├── logs/
│   ├── triad.log                # Main application log
│   ├── watchdog.log             # Watchdog activity log
│   └── repairs.log              # Self-healer repair log
│
└── docs/
    ├── plans/
    │   └── implementation-plan.md
    └── README.md
```

---

## NEW: Watchdog System

### Purpose

Ensures Triad **never stops running**. A separate shell script that monitors the main process and restarts it if it dies.

### `triad-watchdog.sh`

```bash
#!/bin/bash
# Triad Watchdog - Ensures the system never stops
# Run with: nohup ./triad-watchdog.sh > /dev/null 2>&1 &

TRIAD_DIR="/Volumes/VRAM/00-09_System/01_Tools/triad"
LOG_FILE="$TRIAD_DIR/logs/watchdog.log"
PID_FILE="$TRIAD_DIR/state/triad.pid"
CHECK_INTERVAL=30  # seconds

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

start_triad() {
    cd "$TRIAD_DIR"
    bun --hot src/index.ts &
    echo $! > "$PID_FILE"
    log "Started Triad with PID $(cat $PID_FILE)"
}

check_triad() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0  # Running
        fi
    fi
    return 1  # Not running
}

log "Watchdog started"

while true; do
    if ! check_triad; then
        log "Triad not running - restarting..."
        start_triad
    fi
    sleep $CHECK_INTERVAL
done
```

### `start.sh` (Main Startup)

```bash
#!/bin/bash
# Start Triad and its Watchdog
TRIAD_DIR="/Volumes/VRAM/00-09_System/01_Tools/triad"
cd "$TRIAD_DIR"

# Kill any existing instances
./stop.sh 2>/dev/null

# Start watchdog (which will start Triad)
nohup ./triad-watchdog.sh > /dev/null 2>&1 &
echo $! > state/watchdog.pid
echo "Triad watchdog started with PID $!"
echo "Triad will be running shortly..."
```

### `stop.sh` (Graceful Shutdown)

```bash
#!/bin/bash
# Stop Triad and Watchdog gracefully
TRIAD_DIR="/Volumes/VRAM/00-09_System/01_Tools/triad"

# Stop watchdog first (so it doesn't restart Triad)
if [ -f "$TRIAD_DIR/state/watchdog.pid" ]; then
    kill $(cat "$TRIAD_DIR/state/watchdog.pid") 2>/dev/null
    rm "$TRIAD_DIR/state/watchdog.pid"
fi

# Stop Triad
if [ -f "$TRIAD_DIR/state/triad.pid" ]; then
    kill $(cat "$TRIAD_DIR/state/triad.pid") 2>/dev/null
    rm "$TRIAD_DIR/state/triad.pid"
fi

echo "Triad stopped"
```

---

## NEW: Self-Healing System

### Purpose

Detects when things aren't working and **automatically repairs the code**. Uses Codex to diagnose issues and fix them.

### `src/overseer/self-healer.ts`

```typescript
interface HealthCheck {
  component: string;
  status: "healthy" | "degraded" | "failed";
  lastSuccess: Date;
  consecutiveFailures: number;
  errorMessages: string[];
}

class SelfHealer {
  private healthChecks: Map<string, HealthCheck> = new Map();
  private readonly FAILURE_THRESHOLD = 3;

  async recordResult(component: string, success: boolean, error?: string) {
    const check = this.healthChecks.get(component) || this.createCheck(component);

    if (success) {
      check.status = "healthy";
      check.lastSuccess = new Date();
      check.consecutiveFailures = 0;
      check.errorMessages = [];
    } else {
      check.consecutiveFailures++;
      if (error) check.errorMessages.push(error);

      if (check.consecutiveFailures >= this.FAILURE_THRESHOLD) {
        check.status = "failed";
        await this.initiateRepair(component, check);
      } else {
        check.status = "degraded";
      }
    }

    this.healthChecks.set(component, check);
  }

  async initiateRepair(component: string, check: HealthCheck) {
    logger.warn("self_heal_triggered", { component, failures: check.consecutiveFailures });

    const repairPrompt = `
You are the Self-Healer for the Triad system. A component is failing and needs repair.

COMPONENT: ${component}
CONSECUTIVE FAILURES: ${check.consecutiveFailures}
ERROR MESSAGES:
${check.errorMessages.slice(-5).join('\n')}

INSTRUCTIONS:
1. Analyze the error messages
2. Read the relevant source files in src/
3. Identify the root cause
4. Fix the code directly
5. The system will auto-restart after your changes

Be conservative - make minimal changes to fix the issue.
If unsure, add better error handling and logging.

After fixing, output: "REPAIR_COMPLETE: [brief description]"
`;

    // Run Codex to repair
    const result = await codexRunner.execute(repairPrompt);

    // Log the repair
    await Bun.write(
      `outputs/healer/${Date.now()}-repair.md`,
      `# Self-Heal Report\n\n**Component:** ${component}\n\n**Repair:**\n${result.output}`
    );
  }
}
```

### Health Monitoring Points

```typescript
const healthMonitor = {
  // Agent execution health
  "claude-runner": { check: async () => await testClaudeExecution() },
  "codex-runner": { check: async () => await testCodexExecution() },
  "gemini-runner": { check: async () => await testGeminiExecution() },

  // Infrastructure health
  "vram-access": { check: async () => await testVRAMRead() },
  "search-db": { check: async () => await testSearchDB() },
  "file-write": { check: async () => await testOutputWrite() },

  // Server health
  "http-server": { check: async () => await testServerResponds() },
  "memory-usage": { check: async () => process.memoryUsage().heapUsed < 1e9 },
};
```

---

## NEW: Report Generation System

### Purpose

Prepares all insights and findings in formats **ready for Ron's consumption**. Creates daily digests, weekly deep-dives, and individual insight cards that evolve as confidence grows.

### Confidence-Based Report Evolution

```typescript
interface Finding {
  id: string;
  category: string;
  summary: string;
  details: string;
  confidence: number;      // 0.0 - 1.0
  supportingEvidence: string[];
  firstDiscovered: Date;
  lastUpdated: Date;
  iterations: number;      // How many times we've revisited this
  actionable: boolean;
  priority: "low" | "medium" | "high" | "critical";
}

class ConfidenceTracker {
  // Confidence increases with:
  // - Multiple agents agreeing
  // - Multiple iterations finding same insight
  // - More supporting evidence
  // - Corroboration from different data sources

  async updateConfidence(finding: Finding, newEvidence: string[]): number {
    const baseConfidence = finding.confidence;

    // Boost for iteration reinforcement
    const iterationBoost = Math.min(finding.iterations * 0.05, 0.2);

    // Boost for cross-agent agreement
    const agentAgreement = await this.checkAgentAgreement(finding.id);
    const agreementBoost = agentAgreement * 0.1;

    // Boost for diverse evidence sources
    const evidenceDiversity = this.calculateEvidenceDiversity(
      [...finding.supportingEvidence, ...newEvidence]
    );
    const diversityBoost = evidenceDiversity * 0.15;

    return Math.min(
      baseConfidence + iterationBoost + agreementBoost + diversityBoost,
      1.0
    );
  }
}
```

### Report Types

#### 1. Daily Digest (`reports/daily/`)

Generated at end of each day:

```markdown
# Daily Digest: January 14, 2024

## 🎯 Top Insights Today

### High Confidence (>80%)
- **[HVM]** Potential sponsor lead: CrowdStrike mentioned in 3 recent meetings
- **[Finance]** Recurring expense pattern: $450/mo could be consolidated

### Growing Confidence (50-80%)
- **[Network]** Emily Chen connection could lead to Mozilla partnership
- **[Content]** AI security topic gaining traction in listener feedback

## 📊 System Activity
- Iterations completed: 24
- Files analyzed: 1,847
- New insights: 7
- Confidence upgrades: 3

## 🔧 Action Items
1. Review CrowdStrike sponsorship opportunity (High priority)
2. Check consolidated billing options for subscriptions (Medium)

## 📁 Deep Dives Available
- [Full HVM Analysis](../insights/hvm/)
- [Financial Patterns](../insights/finance/)
```

#### 2. Weekly Report (`reports/weekly/`)

Generated every Sunday:

```markdown
# Weekly Report: Week 3, 2024

## Executive Summary

This week, Triad analyzed 12,000+ files and completed 168 iterations.
Key focus areas: Hacker Valley Media growth, Financial optimization.

## 🏆 Highest Confidence Findings

### 1. Sponsorship Pipeline (94% confidence)
Three companies have shown repeated interest patterns...
[Full analysis with evidence]

### 2. Content Strategy Opportunity (88% confidence)
Cross-referencing listener feedback with industry trends...
[Full analysis with evidence]

## 📈 Confidence Progression

| Finding | Start of Week | End of Week | Change |
|---------|--------------|-------------|--------|
| CrowdStrike opportunity | 45% | 94% | +49% |
| Mozilla partnership | 30% | 52% | +22% |
| Subscription consolidation | 60% | 78% | +18% |

## 🔄 Areas Needing More Analysis
- Personal wellness patterns (limited journal data)
- Family event planning (minimal recent activity)

## 💡 Recommendations for Ron
1. **This Week**: Schedule call with CrowdStrike contact
2. **This Week**: Review attached expense analysis
3. **Next Week**: Consider journaling more for wellness insights
```

#### 3. Insight Cards (`reports/insights/[category]/`)

Individual findings with full context:

```markdown
# Insight: Potential CrowdStrike Sponsorship

**ID:** HVM-2024-0042
**Category:** Hacker Valley Media / Partnerships
**Confidence:** 94%
**Priority:** High
**First Discovered:** 2024-01-10
**Last Updated:** 2024-01-14

## Summary

CrowdStrike representatives have been mentioned in 3 separate meeting transcripts
over the past 2 weeks, with increasing specificity about podcast sponsorship.

## Supporting Evidence

1. **Meeting 2024-01-08**: "...George from CrowdStrike mentioned they're looking
   for security podcast partnerships..."
   - Source: `/Volumes/VRAM/10-19_Work/13_Meetings/13.01_transcripts/2024/...`

2. **Email 2024-01-10**: Thread with subject "RE: Podcast Collab?"
   - Source: `/Volumes/VRAM/10-19_Work/14_Communications/14.01_emails/2024/...`

3. **Meeting 2024-01-12**: "...follow up with CrowdStrike, they have budget..."
   - Source: `/Volumes/VRAM/10-19_Work/13_Meetings/13.01_transcripts/2024/...`

## Agent Analysis

- **Claude**: "Strong signal - three independent mentions with budget confirmation"
- **Codex**: "Pattern matches previous successful sponsor acquisitions"
- **Gemini**: "CrowdStrike has active podcast advertising program per web search"

## Recommended Actions

1. [ ] Draft sponsorship proposal
2. [ ] Schedule follow-up call with George
3. [ ] Research CrowdStrike's other podcast sponsorships for rate comparison

## Confidence History

| Date | Confidence | Reason |
|------|------------|--------|
| 2024-01-10 | 35% | First mention detected |
| 2024-01-11 | 55% | Second mention, email found |
| 2024-01-12 | 75% | Third mention, budget confirmed |
| 2024-01-14 | 94% | Cross-agent agreement, web corroboration |
```

### Report Generation Schedule

```typescript
const reportSchedule = {
  // Continuous: Update insight cards as confidence changes
  insightCards: "on_confidence_change",

  // Every 4 hours: Quick status update
  statusUpdate: "*/4 * * * *",

  // Daily at 11 PM: Generate daily digest
  dailyDigest: "0 23 * * *",

  // Sunday at 6 PM: Generate weekly report
  weeklyReport: "0 18 * * 0",

  // On high-confidence threshold: Generate opportunity alert
  opportunityAlert: "on_confidence_above_90",
};
```

---

## Deep Understanding Strategy

### The "Go Deep, Then Move On" Pattern

Each focus area gets **intensive exploration** before rotating:

```typescript
interface FocusAreaState {
  area: string;
  currentDepth: number;       // 1-5 (shallow to exhaustive)
  filesAnalyzed: number;
  insightsGained: number;
  confidenceAverage: number;
  lastVisit: Date;
  visitCount: number;
}

class FocusTracker {
  // Start shallow, go deeper each visit
  async determineDepth(area: string): Promise<number> {
    const state = await this.getState(area);

    // First visit: overview (depth 1)
    // Second visit: key files deep-dive (depth 2)
    // Third visit: cross-reference patterns (depth 3)
    // Fourth visit: edge case analysis (depth 4)
    // Fifth visit: synthesis and action items (depth 5)

    return Math.min(state.visitCount + 1, 5);
  }

  // Move on when we've achieved understanding
  shouldMoveOn(state: FocusAreaState): boolean {
    return (
      state.currentDepth >= 5 ||
      state.confidenceAverage >= 0.85 ||
      state.insightsGained >= 20
    );
  }
}
```

### Focus Area Rotation

```
Round 1 (Getting Acquainted):
  HVM → Career → Finance → Personal → Network → Meta
  (Shallow pass - identify key files and themes)

Round 2 (Building Understanding):
  HVM → Career → Finance → Personal → Network → Meta
  (Medium depth - analyze key files, form hypotheses)

Round 3 (Finding Patterns):
  HVM → Career → Finance → Personal → Network → Meta
  (Deep dive - cross-reference, build confidence)

Round 4+ (Continuous Refinement):
  Priority-based rotation focusing on:
  - Areas with new data
  - Low-confidence findings that need more evidence
  - User-requested deep dives
  - Seasonal relevance (tax season → Finance)
```

---

## Component Specifications

### 1. Orchestrator Server (`src/server.ts`)

**Purpose**: Main Bun server that manages the agent execution loop

**Features**:
- Bun.serve with hot reload (`bun --hot`)
- Sequential agent execution with configurable delays
- Health check and status endpoints
- Graceful shutdown handling
- Integration with watchdog via PID file

```typescript
Bun.serve({
  port: 3001,
  routes: {
    "/health": () => Response.json({ status: "running", iteration: N }),
    "/status": () => Response.json({
      agents: {...},
      lastRun: {...},
      uptime: process.uptime(),
      healthChecks: {...}
    }),
    "/insights": () => Response.json({ insights: [...] }),
    "/reports": () => Response.json({ latest: {...}, available: [...] }),
    "/reports/daily": () => Bun.file("reports/daily/latest.md"),
    "/reports/weekly": () => Bun.file("reports/weekly/latest.md"),
    "/pause": () => { /* pause loop */ },
    "/resume": () => { /* resume loop */ },
  }
});
```

### 2. Agent Runners (`src/runners/`)

Each runner executes its respective CLI tool and captures output.

**Claude Runner** (`claude-runner.ts`):
```bash
claude --dangerously-skip-permissions -p "{prompt}"
```

**Codex Runner** (`codex-runner.ts`):
```bash
codex exec --dangerously-bypass-approvals-and-sandbox --skip-git-repo-check "{prompt}"
```

**Gemini Runner** (`gemini-runner.ts`):
```bash
gemini --yolo -p "{prompt}"
```

**Common Interface**:
```typescript
interface AgentRunner {
  name: string;
  execute(prompt: string): Promise<AgentResult>;
  isAvailable(): Promise<boolean>;
}

interface AgentResult {
  agent: string;
  timestamp: string;
  iteration: number;
  prompt: string;
  output: string;
  duration: number;
  success: boolean;
  error?: string;
}
```

### 3. Overseer System (`src/overseer/overseer.ts`)

**Purpose**: Codex runs periodically to analyze outputs and **improve the application**

**Decision Points**:
1. Are the prompts effective?
2. Is the application gathering valuable insights?
3. Should the execution order change?
4. Should new report types be added?
5. Can the system be made more efficient?

**Note**: This is separate from Self-Healer. Overseer improves; Self-Healer repairs.

### 4. Context Layer (`src/context/`)

**VRAM Reader** - Read-only access to VRAM filesystem:
```typescript
class VRAMReader {
  private readonly basePath = "/Volumes/VRAM";

  // ONLY these methods exist - no write methods
  async searchFiles(query: string): Promise<SearchResult[]>;
  async readFile(path: string): Promise<string>;
  async browseArea(area: string): Promise<FileInfo[]>;
  async getStats(): Promise<IndexStats>;

  // Johnny.Decimal aware methods
  async getAreaContents(area: "Work" | "Personal" | ...): Promise<FileInfo[]>;
  async getCategoryContents(category: string): Promise<FileInfo[]>;
}
```

---

## Execution Flow

### Main Loop

```
┌─────────────────────────────────────────────────────────────┐
│                     ITERATION N                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. BUILD CONTEXT                                           │
│     └─ Determine current focus area and depth               │
│     └─ Read previous outputs from all agents                │
│     └─ Query VRAM search index for relevant files           │
│     └─ Load accumulated insights and confidence levels      │
│                                                              │
│  2. RUN CLAUDE                                              │
│     └─ Build prompt with context + focus directive          │
│     └─ Execute: claude --dangerously-skip-permissions       │
│     └─ Save output to outputs/claude/                       │
│     └─ Record health status                                 │
│     └─ Wait 5 seconds (rate limit buffer)                   │
│                                                              │
│  3. RUN CODEX                                               │
│     └─ Build prompt with context + Claude output            │
│     └─ Execute: codex exec --dangerously-bypass-...         │
│     └─ Save output to outputs/codex/                        │
│     └─ Record health status                                 │
│     └─ Wait 5 seconds                                       │
│                                                              │
│  4. RUN GEMINI                                              │
│     └─ Build prompt with context + Claude + Codex outputs   │
│     └─ Execute: gemini --yolo                               │
│     └─ Save output to outputs/gemini/                       │
│     └─ Record health status                                 │
│     └─ Wait 5 seconds                                       │
│                                                              │
│  5. EXTRACT & UPDATE INSIGHTS                               │
│     └─ Parse outputs for key findings                       │
│     └─ Update confidence levels                             │
│     └─ Generate/update insight cards for high-confidence    │
│     └─ Update insights.json                                 │
│                                                              │
│  6. CHECK HEALTH & SELF-HEAL (if needed)                    │
│     └─ Review health metrics                                │
│     └─ If failures detected, trigger self-healer            │
│                                                              │
│  7. RUN OVERSEER (every 5th iteration)                      │
│     └─ Analyze system performance                           │
│     └─ Decide: improve or continue                          │
│     └─ If improve: Codex edits src/ → Bun auto-restarts    │
│                                                              │
│  8. GENERATE REPORTS (on schedule)                          │
│     └─ Update insight cards (continuous)                    │
│     └─ Daily digest (at 11 PM)                              │
│     └─ Weekly report (Sunday 6 PM)                          │
│                                                              │
│  9. UPDATE FOCUS TRACKING                                   │
│     └─ Record depth progress                                │
│     └─ Check if should move to next area                    │
│     └─ Increment iteration counter                          │
│                                                              │
│  10. REPEAT (goto step 1)                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

### `config.ts`

```typescript
export const config = {
  // Execution timing
  agentDelay: 5000,           // 5 seconds between agents
  iterationDelay: 60000,      // 1 minute between iterations
  overseerFrequency: 5,       // Run overseer every 5th iteration
  watchdogInterval: 30000,    // Check every 30 seconds

  // Paths
  vramPath: "/Volumes/VRAM",
  searchDbPath: "/Volumes/VRAM/00-09_System/00_Index/search.db",
  outputPath: "./outputs",
  reportsPath: "./reports",
  statePath: "./state",
  logsPath: "./logs",

  // Server
  port: 3001,

  // Context limits
  maxPreviousOutputs: 5,
  maxContextTokens: 50000,

  // Health thresholds
  maxConsecutiveFailures: 3,
  healthCheckInterval: 60000,

  // Confidence thresholds
  lowConfidence: 0.3,
  mediumConfidence: 0.6,
  highConfidence: 0.85,
  actionableThreshold: 0.9,

  // Focus areas rotation
  focusAreas: [
    "hacker_valley_media",
    "career_skills",
    "financial",
    "personal_growth",
    "relationships",
    "meta_analysis"
  ],

  // Depth settings
  maxDepthPerArea: 5,
  minInsightsBeforeMove: 3,

  // Report schedule (cron format)
  reports: {
    dailyDigest: "0 23 * * *",
    weeklyReport: "0 18 * * 0"
  }
};
```

---

## Safety & Constraints

### Read-Only VRAM Access

```typescript
class VRAMReader {
  private readonly basePath = "/Volumes/VRAM";

  // ONLY these methods exist - no write methods
  async read(path: string): Promise<string>;
  async exists(path: string): Promise<boolean>;
  async search(query: string): Promise<SearchResult[]>;
  async list(directory: string): Promise<FileInfo[]>;
}
```

### Self-Modification Boundaries

The system can ONLY modify files within `/Volumes/VRAM/00-09_System/01_Tools/triad/`:
- `src/` - Application source code
- `prompts/` - Prompt templates
- `state/` - State files
- `outputs/` - Agent outputs
- `reports/` - Generated reports
- `logs/` - Log files

The system CANNOT modify:
- Any VRAM files outside triad directory
- The watchdog script (safety mechanism)
- System files

---

## Implementation Phases

### Phase 1: Foundation (Days 1-2)

- [x] Create directory structure
- [x] Initialize Bun project with dependencies
- [x] Create watchdog script
- [x] Create start.sh and stop.sh
- [x] Implement basic orchestrator server
- [x] Test watchdog restart behavior

### Phase 2: Agent Runners (Day 3)

- [x] Implement base runner interface
- [x] Implement Claude runner
- [x] Implement Codex runner
- [x] Implement Gemini runner
- [x] Add output file management
- [x] Test sequential execution

### Phase 3: Context & Focus (Day 4)

- [x] Implement VRAM reader (read-only)
- [x] Create search client
- [x] Build prompt builder
- [x] Implement focus area tracker
- [x] Implement depth progression

### Phase 4: Self-Healing (Day 5)

- [x] Create health monitor
- [x] Implement self-healer
- [x] Add error detection logic
- [x] Test repair triggering
- [x] Verify auto-restart works

### Phase 5: Overseer (Day 6)

- [x] Create overseer prompts
- [x] Implement oversight loop
- [x] Add modification detection
- [x] Test improvement cycle

### Phase 6: Report Generation (Day 7)

- [x] Implement confidence tracker
- [x] Create daily digest generator
- [x] Create weekly report generator
- [x] Implement insight card generator (via confidence-tracker)
- [x] Test report scheduling (via report-generator)

### Phase 7: Polish & Deploy (Day 8)

- [x] Add comprehensive logging (via logger.ts)
- [x] Create status dashboard endpoint (via server.ts /status)
- [x] Create CLAUDE.md project instructions
- [x] Create docs/README.md documentation
- [x] Initialize state files
- [x] Test full end-to-end flow (server + endpoints verified)
- [x] Deploy and monitor (launched via start.sh, watchdog active)

---

## Success Metrics

1. **System Reliability**: 99.9% uptime (watchdog ensures restart within 30s)
2. **Insight Quality**: At least 10 actionable insights per week
3. **Confidence Growth**: Average confidence increases week-over-week
4. **Self-Improvement**: Overseer makes meaningful improvements weekly
5. **Self-Healing**: 95% of issues auto-repaired without intervention
6. **Report Usefulness**: Ron reads and acts on daily/weekly reports

---

*Plan Version: 2.0*
*Updated: 2024-01-14*
*Changes: Removed embeddings, added reporting layer, added self-healing, added watchdog*
*Status: Awaiting Final Approval*
