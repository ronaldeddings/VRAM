// Triad Configuration
// Central configuration for the AI Agent Orchestration System

export const config = {
  // Execution timing
  agentDelay: 5000,           // 5 seconds between agents
  iterationDelay: 60000,      // 1 minute between iterations
  overseerFrequency: 5,       // Run overseer every 5th iteration
  watchdogInterval: 30000,    // Check every 30 seconds

  // Paths
  vramPath: "/Volumes/VRAM",
  searchDbPath: "/Volumes/VRAM/00-09_System/00_Index/search.db",
  triadPath: "/Volumes/VRAM/00-09_System/01_Tools/triad",
  outputPath: "./outputs",
  reportsPath: "./reports",
  statePath: "./state",
  logsPath: "./logs",
  promptsPath: "./prompts",

  // Server
  port: 3002,

  // Context limits
  maxPreviousOutputs: 5,
  maxContextTokens: 150000, // must always be 150K tokens...config.

  // Health thresholds
  maxConsecutiveFailures: 3,
  healthCheckInterval: 60000,

  // Confidence thresholds
  lowConfidence: 0.3,
  mediumConfidence: 0.6,
  highConfidence: 0.85,
  actionableThreshold: 0.9,

  // Focus areas rotation (based on Johnny.Decimal areas)
  focusAreas: [
    { id: "hacker_valley_media", name: "Hacker Valley Media", path: "10-19_Work/10_Hacker_Valley_Media" },
    { id: "career_skills", name: "Career & Skills", path: "10-19_Work" },
    { id: "financial", name: "Financial", path: "20-29_Finance" },
    { id: "personal_growth", name: "Personal Growth", path: "30-39_Personal" },
    { id: "relationships", name: "Relationships & Family", path: "40-49_Family" },
    { id: "meta_analysis", name: "Meta Analysis", path: "" },  // Cross-area analysis
    // Meeting-focused analysis areas
    { id: "meeting_transcripts", name: "Meeting Transcript Analysis", path: "10-19_Work/13_Meetings/13.01_transcripts" },
    { id: "client_relationships", name: "Client Relationship Intelligence", path: "10-19_Work/13_Meetings" },
    { id: "sales_pipeline", name: "Sales Pipeline Review", path: "10-19_Work/13_Meetings" },
    { id: "team_health", name: "Team Health Assessment", path: "10-19_Work/13_Meetings" },
    // Communications-focused analysis areas
    { id: "email_health", name: "Email Communication Health", path: "10-19_Work/14_Communications/14.01b_emails_json" },
    { id: "relationship_audit", name: "Relationship Audit", path: "10-19_Work/14_Communications" },
    { id: "slack_patterns", name: "Slack Communication Patterns", path: "10-19_Work/14_Communications/14.02_slack" },
    { id: "cross_channel", name: "Cross-Channel Communication", path: "10-19_Work/14_Communications" },
    { id: "opportunity_scan", name: "Opportunity Scan", path: "10-19_Work/14_Communications" },
  ],

  // Depth settings
  maxDepthPerArea: 5,
  minInsightsBeforeMove: 3,

  // CLI commands for agents (Gemini1 → Codex → Gemini2)
  agents: {
    gemini1: {
      name: "Gemini-Alpha",
      command: "gemini",
      args: ["--yolo", "-p"],
    },
    codex: {
      name: "Codex",
      command: "codex",
      args: ["exec", "--dangerously-bypass-approvals-and-sandbox", "--skip-git-repo-check"],
    },
    gemini2: {
      name: "Gemini-Omega",
      command: "gemini",
      args: ["--yolo", "-p"],
    },
  },

  // Report schedule (cron format for reference)
  reports: {
    dailyDigest: "0 23 * * *",      // 11 PM daily
    weeklyReport: "0 18 * * 0",     // 6 PM Sunday
    insightCardUpdate: "on_change", // When confidence changes
  },
} as const;

export type Config = typeof config;
export type FocusArea = typeof config.focusAreas[number];
export type AgentConfig = typeof config.agents[keyof typeof config.agents];
