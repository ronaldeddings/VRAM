/**
 * WebSocket Handler for Real-Time Streaming
 *
 * Provides real-time streaming for:
 * - Session analysis progress
 * - Entry-by-entry streaming
 * - Live session monitoring
 * - Agent SDK session events
 */

import type { ServerWebSocket } from 'bun';
import { serviceContext } from '../server';

export interface WebSocketData {
  connectedAt: number;
  subscriptions: Set<string>;
  sessionId?: string;
}

interface WSMessage {
  type: string;
  sessionId?: string;
  data?: unknown;
}

/**
 * WebSocket handler configuration for Bun.serve
 */
export const websocketHandler = {
  /**
   * Called when a new WebSocket connection opens
   */
  open(ws: ServerWebSocket<WebSocketData>) {
    console.log(`[WS] Client connected at ${new Date().toISOString()}`);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: Date.now(),
      message: 'Connected to Claude Code Deep Researcher WebSocket',
    }));
  },

  /**
   * Called when a message is received
   */
  async message(ws: ServerWebSocket<WebSocketData>, message: string | Buffer) {
    try {
      const msg: WSMessage = JSON.parse(message.toString());

      switch (msg.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;

        case 'subscribe':
          if (msg.sessionId) {
            ws.data.subscriptions.add(msg.sessionId);
            ws.send(JSON.stringify({
              type: 'subscribed',
              sessionId: msg.sessionId,
            }));
          }
          break;

        case 'unsubscribe':
          if (msg.sessionId) {
            ws.data.subscriptions.delete(msg.sessionId);
            ws.send(JSON.stringify({
              type: 'unsubscribed',
              sessionId: msg.sessionId,
            }));
          }
          break;

        case 'stream-entries':
          await streamEntries(ws, msg.sessionId!);
          break;

        case 'stream-analysis':
          await streamAnalysis(ws, msg.sessionId!);
          break;

        case 'stream-validation':
          await streamValidation(ws, msg.sessionId!);
          break;

        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${msg.type}`,
          }));
      }
    } catch (error) {
      console.error('[WS] Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  },

  /**
   * Called when the connection is closed
   */
  close(ws: ServerWebSocket<WebSocketData>, code: number, reason: string) {
    console.log(`[WS] Client disconnected: ${code} ${reason}`);
  },

  /**
   * Called when a drain event occurs (backpressure relieved)
   */
  drain(ws: ServerWebSocket<WebSocketData>) {
    console.log('[WS] Drain event - backpressure relieved');
  },
};

/**
 * Stream entries from a session file one by one
 */
async function streamEntries(
  ws: ServerWebSocket<WebSocketData>,
  sessionId: string
): Promise<void> {
  const { parser } = serviceContext;

  try {
    // Find session file
    const filePath = await findSessionFile(sessionId);
    if (!filePath) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Session not found',
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'stream-start',
      sessionId,
      streamType: 'entries',
    }));

    let index = 0;
    let totalTokens = 0;

    // Stream entries using the parser
    for await (const entry of parser.parseFile(filePath)) {
      // Estimate tokens for progress
      const entryTokens = estimateTokens(entry);
      totalTokens += entryTokens;

      ws.send(JSON.stringify({
        type: 'entry',
        index,
        entry,
        progress: {
          processed: index + 1,
          tokens: totalTokens,
        },
      }));

      index++;

      // Small delay to prevent overwhelming the client
      if (index % 50 === 0) {
        await Bun.sleep(10);
      }
    }

    ws.send(JSON.stringify({
      type: 'stream-complete',
      sessionId,
      streamType: 'entries',
      summary: {
        totalEntries: index,
        totalTokens,
      },
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: error instanceof Error ? error.message : 'Stream failed',
    }));
  }
}

/**
 * Stream analysis progress for a session
 */
async function streamAnalysis(
  ws: ServerWebSocket<WebSocketData>,
  sessionId: string
): Promise<void> {
  const { parser, stepAnalyzer } = serviceContext;

  try {
    const filePath = await findSessionFile(sessionId);
    if (!filePath) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Session not found',
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'stream-start',
      sessionId,
      streamType: 'analysis',
    }));

    // Phase 1: Parse entries
    ws.send(JSON.stringify({
      type: 'analysis-phase',
      phase: 'parsing',
      message: 'Parsing JSONL entries...',
    }));

    const entries = await parser.parseFileToArray(filePath);

    ws.send(JSON.stringify({
      type: 'analysis-progress',
      phase: 'parsing',
      progress: 100,
      data: {
        entryCount: entries.length,
        entryTypes: countEntryTypes(entries),
      },
    }));

    // Phase 2: Build conversation tree
    ws.send(JSON.stringify({
      type: 'analysis-phase',
      phase: 'building-tree',
      message: 'Building conversation tree...',
    }));

    await Bun.sleep(50); // Allow UI to update

    // Phase 3: Analyze steps
    ws.send(JSON.stringify({
      type: 'analysis-phase',
      phase: 'analyzing',
      message: 'Analyzing conversation steps...',
    }));

    const analysis = await stepAnalyzer.analyzeConversation(filePath);

    ws.send(JSON.stringify({
      type: 'analysis-progress',
      phase: 'analyzing',
      progress: 100,
      data: {
        stepCount: analysis.steps?.length || 0,
        toolUsage: analysis.toolUsage,
        tokenUsage: analysis.tokenUsage,
      },
    }));

    // Phase 4: Calculate metrics
    ws.send(JSON.stringify({
      type: 'analysis-phase',
      phase: 'metrics',
      message: 'Calculating metrics...',
    }));

    ws.send(JSON.stringify({
      type: 'stream-complete',
      sessionId,
      streamType: 'analysis',
      analysis,
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: error instanceof Error ? error.message : 'Analysis failed',
    }));
  }
}

/**
 * Stream validation progress for a session
 */
async function streamValidation(
  ws: ServerWebSocket<WebSocketData>,
  sessionId: string
): Promise<void> {
  const { parser, validator } = serviceContext;

  try {
    const filePath = await findSessionFile(sessionId);
    if (!filePath) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Session not found',
      }));
      return;
    }

    ws.send(JSON.stringify({
      type: 'stream-start',
      sessionId,
      streamType: 'validation',
    }));

    // Parse entries
    const entries = await parser.parseFileToArray(filePath);

    // Layer 1: Schema validation
    ws.send(JSON.stringify({
      type: 'validation-layer',
      layer: 1,
      name: 'Schema Validation',
      status: 'running',
    }));

    await Bun.sleep(50);

    // Layer 2: Relationship validation
    ws.send(JSON.stringify({
      type: 'validation-layer',
      layer: 2,
      name: 'Relationship Validation',
      status: 'running',
    }));

    await Bun.sleep(50);

    // Layer 3: Tool use validation
    ws.send(JSON.stringify({
      type: 'validation-layer',
      layer: 3,
      name: 'Tool Use Validation',
      status: 'running',
    }));

    await Bun.sleep(50);

    // Layer 4: Completeness check
    ws.send(JSON.stringify({
      type: 'validation-layer',
      layer: 4,
      name: 'Completeness Check',
      status: 'running',
    }));

    // Run full validation
    const validation = validator.validate(entries);

    ws.send(JSON.stringify({
      type: 'stream-complete',
      sessionId,
      streamType: 'validation',
      validation,
    }));
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'error',
      message: error instanceof Error ? error.message : 'Validation failed',
    }));
  }
}

/**
 * Find session file by ID
 */
async function findSessionFile(sessionId: string): Promise<string | null> {
  const { homedir } = await import('os');
  const { join } = await import('path');

  const claudeDir = join(homedir(), '.claude', 'projects');

  // Search all projects
  const projects = await Array.fromAsync(
    new Bun.Glob('*').scan({ cwd: claudeDir, onlyFiles: false })
  );

  for (const project of projects) {
    const filePath = join(claudeDir, project, `${sessionId}.jsonl`);
    if (await Bun.file(filePath).exists()) {
      return filePath;
    }
  }

  return null;
}

/**
 * Estimate token count for an entry (rough estimate)
 */
function estimateTokens(entry: unknown): number {
  const json = JSON.stringify(entry);
  // Rough estimate: ~4 characters per token
  return Math.ceil(json.length / 4);
}

/**
 * Count entry types in an array
 */
function countEntryTypes(entries: Array<{ type: string }>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    counts[entry.type] = (counts[entry.type] || 0) + 1;
  }
  return counts;
}
