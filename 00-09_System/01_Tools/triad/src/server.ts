// Triad Server
// Main Bun.serve orchestration server for the AI Agent Orchestration System

import { config } from "./utils/config";
import { logger } from "./utils/logger";
import { reportGenerator } from "./reports/report-generator";
import { opportunityGenerator } from "./reports/opportunity-generator";
import { actionItemGenerator } from "./reports/action-item-generator";
import { discoveryTracker } from "./reports/discoveries";
import { familyAnalyzer } from "./prompts/family-analyzer";
import { lifeOptimizer } from "./reports/life-optimizer";
import { feedbackCollector } from "./feedback/feedback-collector";
import { insightValidator } from "./reports/insight-validator";
import { agentMemory } from "./context/agent-memory";
import { notifier } from "./notifications/notifier";
import { qualityTracker } from "./metrics/quality-tracker";
import { freshnessTracker } from "./metrics/freshness-tracker";
import { resilience } from "./utils/resilience";

interface ServerState {
  iteration: number;
  running: boolean;
  paused: boolean;
  startTime: Date;
  lastAgent: string | null;
  lastRun: Date | null;
  errors: string[];
}

const state: ServerState = {
  iteration: 0,
  running: false,
  paused: false,
  startTime: new Date(),
  lastAgent: null,
  lastRun: null,
  errors: [],
};

export function updateState(updates: Partial<ServerState>): void {
  Object.assign(state, updates);
}

export function getState(): ServerState {
  return { ...state };
}

export function startServer() {
  const server = Bun.serve({
    port: config.port,

    async fetch(request: Request): Promise<Response> {
      const url = new URL(request.url);
      const path = url.pathname;

      // CORS headers for local development
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      try {
        switch (path) {
          case "/":
          case "/health": {
            return Response.json({
              status: state.running ? "running" : "stopped",
              iteration: state.iteration,
              uptime: Math.floor((Date.now() - state.startTime.getTime()) / 1000),
              paused: state.paused,
            }, { headers });
          }

          case "/status": {
            return Response.json({
              ...state,
              uptime: Math.floor((Date.now() - state.startTime.getTime()) / 1000),
              config: {
                port: config.port,
                agentDelay: config.agentDelay,
                iterationDelay: config.iterationDelay,
                focusAreas: config.focusAreas.map(a => a.name),
              },
            }, { headers });
          }

          case "/insights": {
            // TODO: Load from state/insights.json
            const insightsFile = Bun.file(`${config.statePath}/insights.json`);
            const insights = await insightsFile.exists()
              ? await insightsFile.json()
              : { insights: [], lastUpdated: null };
            return Response.json(insights, { headers });
          }

          case "/reports": {
            // List available reports
            const dailyDir = `${config.reportsPath}/daily`;
            const weeklyDir = `${config.reportsPath}/weekly`;

            return Response.json({
              daily: [], // TODO: List files in daily dir
              weekly: [], // TODO: List files in weekly dir
              lastGenerated: null,
            }, { headers });
          }

          case "/reports/daily/latest": {
            // TODO: Return latest daily report
            return Response.json({ message: "No reports yet" }, { headers });
          }

          case "/reports/weekly/latest": {
            // TODO: Return latest weekly report
            return Response.json({ message: "No reports yet" }, { headers });
          }

          case "/pause": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            state.paused = true;
            await logger.info("system_paused");
            return Response.json({ status: "paused" }, { headers });
          }

          case "/resume": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            state.paused = false;
            await logger.info("system_resumed");
            return Response.json({ status: "resumed" }, { headers });
          }

          case "/reports/generate/daily": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            await logger.info("manual_daily_report_trigger");
            const dailyReport = await reportGenerator.generateDailyDigest();
            return Response.json({
              status: "generated",
              report: dailyReport
            }, { headers });
          }

          case "/reports/generate/weekly": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            await logger.info("manual_weekly_report_trigger");
            const weeklyReport = await reportGenerator.generateWeeklyReport();
            return Response.json({
              status: "generated",
              report: weeklyReport
            }, { headers });
          }

          case "/logs": {
            const logFile = Bun.file(`${config.logsPath}/triad.log`);
            if (await logFile.exists()) {
              const logs = await logFile.text();
              const lines = logs.trim().split("\n").slice(-100); // Last 100 lines
              return Response.json({ logs: lines.map(l => JSON.parse(l)) }, { headers });
            }
            return Response.json({ logs: [] }, { headers });
          }

          // Opportunity endpoints
          case "/opportunities": {
            const type = url.searchParams.get("type") as any;
            const priority = url.searchParams.get("priority") as any;
            const status = url.searchParams.get("status") as any;
            const limit = url.searchParams.get("limit");

            const opportunities = await opportunityGenerator.getOpportunities({
              type: type || undefined,
              priority: priority || undefined,
              status: status || undefined,
              limit: limit ? parseInt(limit) : undefined,
            });
            return Response.json({ opportunities, count: opportunities.length }, { headers });
          }

          case "/opportunities/today": {
            const opportunities = await opportunityGenerator.getTodayOpportunities();
            return Response.json({ opportunities, count: opportunities.length }, { headers });
          }

          // Action item endpoints
          case "/action-items": {
            const category = url.searchParams.get("category") as any;
            const priority = url.searchParams.get("priority") as any;
            const status = url.searchParams.get("status") as any;
            const limit = url.searchParams.get("limit");

            const actions = await actionItemGenerator.getActions({
              category: category || undefined,
              priority: priority || undefined,
              status: status || undefined,
              limit: limit ? parseInt(limit) : undefined,
            });
            return Response.json({ actions, count: actions.length }, { headers });
          }

          case "/action-items/priority": {
            const actions = await actionItemGenerator.getPriorityActions();
            return Response.json({ actions, count: actions.length }, { headers });
          }

          // Discovery endpoints
          case "/discoveries": {
            const category = url.searchParams.get("category") as any;
            const limit = url.searchParams.get("limit");

            const discoveries = await discoveryTracker.getDiscoveries({
              category: category || undefined,
              limit: limit ? parseInt(limit) : undefined,
            });
            return Response.json({ discoveries, count: discoveries.length }, { headers });
          }

          case "/discoveries/latest": {
            const discoveries = await discoveryTracker.getLatestDiscoveries(10);
            return Response.json({ discoveries, count: discoveries.length }, { headers });
          }

          case "/discoveries/digest": {
            const digest = await discoveryTracker.generateWeeklyDigest();
            return Response.json({ digest }, { headers });
          }

          // Family endpoints
          case "/family/upcoming": {
            const days = url.searchParams.get("days");
            const events = await familyAnalyzer.getUpcomingEvents(days ? parseInt(days) : 30);
            return Response.json({ events, count: events.length }, { headers });
          }

          case "/family/context": {
            const context = await familyAnalyzer.getFullContext();
            return Response.json(context, { headers });
          }

          // Life optimization endpoints
          case "/life/patterns": {
            const category = url.searchParams.get("category") as any;
            const patternType = url.searchParams.get("type") as any;

            const patterns = await lifeOptimizer.getPatterns({
              category: category || undefined,
              patternType: patternType || undefined,
            });
            return Response.json({ patterns, count: patterns.length }, { headers });
          }

          case "/life/suggestions": {
            const category = url.searchParams.get("category") as any;
            const status = url.searchParams.get("status") as any;

            const suggestions = await lifeOptimizer.getSuggestions({
              category: category || undefined,
              status: status || undefined,
            });
            return Response.json({ suggestions, count: suggestions.length }, { headers });
          }

          case "/life/summary": {
            const summary = await lifeOptimizer.getOptimizationSummary();
            return Response.json(summary, { headers });
          }

          case "/life/report": {
            if (request.method === "POST") {
              await logger.info("manual_life_report_trigger");
              const report = await lifeOptimizer.generateWeeklyReport();
              return Response.json({ status: "generated", report }, { headers });
            }
            // GET returns last generated report if available
            const patterns = await lifeOptimizer.getPatterns();
            const summary = await lifeOptimizer.getOptimizationSummary();
            return Response.json({ patterns: patterns.length, summary }, { headers });
          }

          // Dashboard endpoint - executive summary
          case "/dashboard": {
            const [
              opportunities,
              actions,
              discoveries,
              familyContext,
              lifeSummary,
            ] = await Promise.all([
              opportunityGenerator.getTodayOpportunities(),
              actionItemGenerator.getPriorityActions(),
              discoveryTracker.getLatestDiscoveries(5),
              familyAnalyzer.getFullContext(),
              lifeOptimizer.getOptimizationSummary(),
            ]);

            return Response.json({
              timestamp: new Date().toISOString(),
              system: {
                status: state.running ? "running" : "stopped",
                iteration: state.iteration,
                paused: state.paused,
                uptime: Math.floor((Date.now() - state.startTime.getTime()) / 1000),
              },
              opportunities: {
                count: opportunities.length,
                urgent: opportunities.filter(o => o.urgency === "immediate").length,
                items: opportunities.slice(0, 5),
              },
              actions: {
                count: actions.length,
                urgent: actions.filter(a => a.priority === "urgent").length,
                items: actions.slice(0, 5),
              },
              discoveries: {
                count: discoveries.length,
                items: discoveries,
              },
              family: {
                upcomingEvents: familyContext.upcomingEvents.length,
                recommendations: familyContext.recommendations.slice(0, 3),
              },
              life: {
                overallScore: lifeSummary.overallScore,
                focus: lifeSummary.focus,
                wins: lifeSummary.wins,
              },
            }, { headers });
          }

          // Feedback endpoints
          case "/feedback": {
            if (request.method === "POST") {
              const body = await request.json();
              const { itemId, itemType, feedbackType, rating, comment } = body;

              if (!itemId || !itemType || !feedbackType) {
                return Response.json(
                  { error: "Missing required fields: itemId, itemType, feedbackType" },
                  { status: 400, headers }
                );
              }

              const entry = await feedbackCollector.recordFeedback(
                itemId,
                itemType,
                feedbackType,
                rating,
                comment
              );
              await logger.info("feedback_recorded", { itemId, feedbackType });
              return Response.json({ status: "recorded", entry }, { headers });
            }

            // GET returns feedback stats
            const stats = await feedbackCollector.getStats();
            const recent = await feedbackCollector.getRecentFeedback(20);
            return Response.json({ stats, recent }, { headers });
          }

          case "/feedback/preferences": {
            const preferences = await feedbackCollector.getPreferences();
            return Response.json({ preferences, count: preferences.length }, { headers });
          }

          case "/feedback/report": {
            const report = await feedbackCollector.generatePreferenceReport();
            return Response.json({ report }, { headers });
          }

          case "/engagement": {
            if (request.method === "POST") {
              const body = await request.json();
              const { itemId, itemType, engagementType, duration } = body;

              if (!itemId || !itemType || !engagementType) {
                return Response.json(
                  { error: "Missing required fields: itemId, itemType, engagementType" },
                  { status: 400, headers }
                );
              }

              const entry = await feedbackCollector.recordEngagement(
                itemId,
                itemType,
                engagementType,
                duration
              );
              return Response.json({ status: "recorded", entry }, { headers });
            }

            return Response.json({ error: "Method not allowed" }, { status: 405, headers });
          }

          // Validation endpoints
          case "/validation/pending": {
            const limit = url.searchParams.get("limit");
            const insights = await insightValidator.getPendingValidation(
              limit ? parseInt(limit) : 10
            );
            return Response.json({ insights, count: insights.length }, { headers });
          }

          case "/validation/confirmed": {
            const limit = url.searchParams.get("limit");
            const insights = await insightValidator.getConfirmedInsights(
              limit ? parseInt(limit) : undefined
            );
            return Response.json({ insights, count: insights.length }, { headers });
          }

          case "/validation/stats": {
            const stats = await insightValidator.getStats();
            return Response.json(stats, { headers });
          }

          // Agent memory endpoints
          case "/memory/knowledge": {
            const agent = url.searchParams.get("agent") as any;
            const type = url.searchParams.get("type") as any;
            const limit = url.searchParams.get("limit");

            const knowledge = await agentMemory.getKnowledge({
              agent: agent || undefined,
              type: type || undefined,
              limit: limit ? parseInt(limit) : undefined,
            });
            return Response.json({ knowledge, count: knowledge.length }, { headers });
          }

          case "/memory/consensus": {
            const consensus = await agentMemory.getConsensusItems();
            return Response.json({ consensus, count: consensus.length }, { headers });
          }

          case "/memory/disputed": {
            const disputed = await agentMemory.getDisputedItems();
            return Response.json({ disputed, count: disputed.length }, { headers });
          }

          // Notification endpoints
          case "/notifications": {
            if (request.method === "POST") {
              const body = await request.json();
              const { type, priority, title, message, source } = body;

              if (!type || !priority || !title || !message) {
                return Response.json(
                  { error: "Missing required fields: type, priority, title, message" },
                  { status: 400, headers }
                );
              }

              const notification = await notifier.sendImmediate({
                type,
                priority,
                title,
                message,
                source: source || { module: "api" },
              });
              return Response.json({ status: "sent", notification }, { headers });
            }

            // GET returns notifications
            const type = url.searchParams.get("type") as any;
            const priority = url.searchParams.get("priority") as any;
            const unreadOnly = url.searchParams.get("unreadOnly") === "true";
            const limit = url.searchParams.get("limit");

            const notifications = await notifier.getNotifications({
              type: type || undefined,
              priority: priority || undefined,
              unreadOnly,
              limit: limit ? parseInt(limit) : undefined,
            });
            return Response.json({ notifications, count: notifications.length }, { headers });
          }

          case "/notifications/stats": {
            const stats = await notifier.getStats();
            return Response.json(stats, { headers });
          }

          case "/notifications/preferences": {
            if (request.method === "POST") {
              const body = await request.json();
              const preferences = await notifier.updatePreferences(body);
              return Response.json({ status: "updated", preferences }, { headers });
            }

            const preferences = notifier.getPreferences();
            return Response.json({ preferences }, { headers });
          }

          case "/notifications/process-queue": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            const processed = await notifier.processQueuedNotifications();
            return Response.json({ status: "processed", count: processed }, { headers });
          }

          // Quality tracking endpoints
          case "/quality/scores": {
            const agent = url.searchParams.get("agent") as any;
            const focusArea = url.searchParams.get("focusArea") as any;
            const limit = url.searchParams.get("limit");

            const scores = await qualityTracker.getScores({
              agent: agent || undefined,
              focusArea: focusArea || undefined,
              limit: limit ? parseInt(limit) : undefined,
            });
            return Response.json({ scores, count: scores.length }, { headers });
          }

          case "/quality/trends": {
            const agent = url.searchParams.get("agent");
            const dimension = url.searchParams.get("dimension") as any;
            const period = url.searchParams.get("period");

            const trends = await qualityTracker.getTrends(
              agent || undefined,
              dimension || undefined,
              period ? parseInt(period) : undefined
            );
            return Response.json({ trends }, { headers });
          }

          case "/quality/summary": {
            const summary = await qualityTracker.getAgentSummary();
            return Response.json({ summary }, { headers });
          }

          case "/quality/report": {
            const report = await qualityTracker.getQualityReport();
            return Response.json({ report }, { headers });
          }

          case "/quality/alerts": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            await qualityTracker.checkAlerts();
            return Response.json({ status: "alerts_checked" }, { headers });
          }

          // Freshness tracking endpoints
          case "/freshness": {
            const freshness = await freshnessTracker.getAllFreshness();
            return Response.json({ freshness, count: freshness.length }, { headers });
          }

          case "/freshness/stale": {
            const staleAreas = await freshnessTracker.getStaleAreas();
            return Response.json({ staleAreas, count: staleAreas.length }, { headers });
          }

          case "/freshness/priority": {
            const limit = url.searchParams.get("limit");
            const priorityAreas = await freshnessTracker.getPriorityAreas(
              limit ? parseInt(limit) : 3
            );
            return Response.json({ priorityAreas }, { headers });
          }

          case "/freshness/summary": {
            const summary = await freshnessTracker.getSummary();
            return Response.json(summary, { headers });
          }

          case "/freshness/report": {
            const report = await freshnessTracker.getFreshnessReport();
            return Response.json({ report }, { headers });
          }

          // System health and resilience endpoints
          case "/health/system": {
            const systemHealth = await resilience.getSystemHealth();
            return Response.json(systemHealth, { headers });
          }

          case "/health/circuits": {
            const systemHealth = await resilience.getSystemHealth();
            return Response.json({
              circuits: systemHealth.circuits,
              degradationLevel: systemHealth.degradationLevel,
            }, { headers });
          }

          case "/health/errors": {
            const limit = url.searchParams.get("limit");
            const errors = resilience.getErrorHistory(limit ? parseInt(limit) : 20);
            return Response.json({ errors, count: errors.length }, { headers });
          }

          case "/health/reset-circuit": {
            if (request.method !== "POST") {
              return Response.json({ error: "Method not allowed" }, { status: 405, headers });
            }
            const body = await request.json();
            const { circuit } = body;
            if (!circuit) {
              return Response.json(
                { error: "Missing required field: circuit" },
                { status: 400, headers }
              );
            }
            resilience.resetCircuit(circuit);
            return Response.json({ status: "circuit_reset", circuit }, { headers });
          }

          case "/health/degradation": {
            if (request.method === "POST") {
              const body = await request.json();
              const { level } = body;
              if (!level) {
                return Response.json(
                  { error: "Missing required field: level" },
                  { status: 400, headers }
                );
              }
              resilience.setDegradationLevel(level);
              return Response.json({ status: "level_set", level }, { headers });
            }
            return Response.json({
              degradationLevel: resilience.getDegradationLevel(),
            }, { headers });
          }

          // Comprehensive system dashboard
          case "/health/dashboard": {
            const [
              systemHealth,
              qualitySummary,
              freshnessSummary,
              notificationStats,
            ] = await Promise.all([
              resilience.getSystemHealth(),
              qualityTracker.getAgentSummary(),
              freshnessTracker.getSummary(),
              notifier.getStats(),
            ]);

            return Response.json({
              timestamp: new Date().toISOString(),
              system: systemHealth,
              quality: qualitySummary,
              freshness: freshnessSummary,
              notifications: notificationStats,
            }, { headers });
          }

          default:
            return Response.json({ error: "Not found" }, { status: 404, headers });
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        await logger.error("server_error", { path, error: message });
        return Response.json({ error: message }, { status: 500, headers });
      }
    },
  });

  logger.info("server_started", { port: config.port });
  console.log(`\n🔺 Triad Server running at http://localhost:${config.port}`);
  console.log(`   Health: http://localhost:${config.port}/health`);
  console.log(`   Status: http://localhost:${config.port}/status\n`);

  return server;
}
