/**
 * Claude Code Deep Researcher - Web UI Server
 *
 * Bun.serve-based HTTP server with WebSocket support for real-time streaming.
 * Provides REST API for session management, analysis, and CRUD operations.
 */

import { JSONLParser } from '../services/jsonl-parser';
import { ConversationBuilder } from '../services/conversation-builder';
import { StepAnalyzer } from '../services/step-analyzer';
import { SessionManager } from '../services/session-manager';
import { ConversationValidator } from '../validators';
import { ContextDistiller } from '../services/context-distiller';
import { apiRouter, type APIContext } from './routes/api';
import { websocketHandler, type WebSocketData } from './routes/websocket';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || 'localhost';

// Initialize services
const parser = new JSONLParser();
const conversationBuilder = new ConversationBuilder(parser);
const stepAnalyzer = new StepAnalyzer(parser, conversationBuilder);
const sessionManager = new SessionManager();
const validator = new ConversationValidator();
// Note: ContextDistiller is created per-request in the optimize endpoint with the correct project path
// This is a default instance for other potential uses
const contextDistiller = new ContextDistiller();

// Service context for route handlers
export const serviceContext: APIContext = {
  parser,
  conversationBuilder,
  stepAnalyzer,
  sessionManager,
  validator,
  contextDistiller,
};

// Static file MIME types
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// Get MIME type from file extension
function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.'));
  return MIME_TYPES[ext] || 'application/octet-stream';
}

// Serve static files from public directory
async function serveStatic(pathname: string): Promise<Response | null> {
  // Default to index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = `${import.meta.dir}/public${pathname}`;
  const file = Bun.file(filePath);

  if (await file.exists()) {
    return new Response(file, {
      headers: {
        'Content-Type': getMimeType(pathname),
        'Cache-Control': pathname.includes('/css/') || pathname.includes('/js/')
          ? 'public, max-age=3600'
          : 'no-cache',
      },
    });
  }

  return null;
}

// CORS headers for development
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Main server configuration
const server = Bun.serve<WebSocketData>({
  port: PORT,
  hostname: HOST,

  // Main request handler
  async fetch(req, server) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // WebSocket upgrade for streaming endpoints
    if (pathname === '/ws' || pathname.startsWith('/ws/')) {
      const upgraded = server.upgrade(req, {
        data: {
          connectedAt: Date.now(),
          subscriptions: new Set<string>(),
        },
      });

      if (upgraded) {
        return undefined; // Bun handles the upgrade
      }

      return new Response('WebSocket upgrade failed', { status: 400 });
    }

    // API routes
    if (pathname.startsWith('/api/')) {
      try {
        const response = await apiRouter(req, serviceContext);
        // Add CORS headers to API responses
        const headers = new Headers(response.headers);
        Object.entries(CORS_HEADERS).forEach(([key, value]) => {
          headers.set(key, value);
        });
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch (error) {
        console.error('API Error:', error);
        return Response.json(
          {
            error: error instanceof Error ? error.message : 'Internal server error',
            stack: process.env.NODE_ENV === 'development' && error instanceof Error
              ? error.stack
              : undefined,
          },
          {
            status: 500,
            headers: CORS_HEADERS,
          }
        );
      }
    }

    // Static file serving
    const staticResponse = await serveStatic(pathname);
    if (staticResponse) {
      return staticResponse;
    }

    // SPA fallback - serve index.html for all unmatched routes
    const indexResponse = await serveStatic('/index.html');
    if (indexResponse) {
      return indexResponse;
    }

    // 404 Not Found
    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  },

  // WebSocket handlers
  websocket: websocketHandler,

  // Error handler
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   Claude Code Deep Researcher - Web UI                        ║
║                                                               ║
║   Server running at: http://${HOST}:${PORT}                      ║
║   WebSocket endpoint: ws://${HOST}:${PORT}/ws                    ║
║                                                               ║
║   API Endpoints:                                              ║
║   • GET  /api/sessions          - List all sessions           ║
║   • GET  /api/sessions/:id      - Get session details         ║
║   • GET  /api/sessions/:id/analyze - Analyze session          ║
║   • GET  /api/sessions/:id/validate - Validate session        ║
║   • POST /api/sessions/:id/clone - Clone session              ║
║   • POST /api/sessions          - Create new session          ║
║   • PUT  /api/sessions/:id/entries/:idx - Update entry        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

export default server;
