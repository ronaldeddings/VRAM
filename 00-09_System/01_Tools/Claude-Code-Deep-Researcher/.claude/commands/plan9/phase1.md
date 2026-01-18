# Phase 1: Project Setup & Server Foundation

Execute Phase 1 of Implementation Plan 9 with quality gates.

## Pre-Checks

1. **Verify Bun Version**
   ```bash
   bun --version
   ```
   Requires Bun 1.0+ for Bun.serve routes API.

2. **Check Existing Project Structure**
   ```bash
   ls -la src/
   ls -la src/services/
   ```

## Implementation Checklist

### 1.1 Create Web Directory Structure

Create the following directory structure:

```
src/web/
├── server.ts           # Bun.serve entry point
├── routes/
│   ├── api.ts          # REST API handlers
│   └── websocket.ts    # WebSocket handlers
├── public/
│   ├── index.html      # Main HTML entry
│   ├── css/
│   │   ├── layers.css  # @layer definitions
│   │   ├── theme.css   # CSS variables & theming
│   │   ├── layout.css  # Grid & container queries
│   │   └── components.css
│   └── js/
│       ├── app.js      # Main application
│       ├── api.js      # API client
│       └── components/ # Web Components
└── templates/
    └── partials/       # Reusable HTML fragments
```

### 1.2 Create Bun.serve Entry Point

Reference: **bun-developer skill** for Bun.serve patterns

Create `src/web/server.ts`:

```typescript
import type { Server } from "bun";

// Import existing services
import { JSONLParser } from "../services/jsonl-parser";
import { StepAnalyzer } from "../services/step-analyzer";
import { ConversationBuilder } from "../services/conversation-builder";
import { SessionManager } from "../services/session-manager";

const PORT = process.env.PORT || 3000;

const server = Bun.serve({
  port: PORT,

  routes: {
    // Static files & UI
    "/": () => new Response(Bun.file("src/web/public/index.html")),
    "/css/*": (req) => handleStaticFile(req, "src/web/public"),
    "/js/*": (req) => handleStaticFile(req, "src/web/public"),

    // API Routes - OBSERVE
    "GET /api/sessions": listSessions,
    "GET /api/sessions/:id": getSession,
    "GET /api/sessions/:id/analyze": analyzeSession,
    "GET /api/sessions/:id/validate": validateSession,
    "GET /api/projects": listProjects,

    // API Routes - DUPLICATE
    "POST /api/sessions/:id/clone": cloneSession,

    // API Routes - OPTIMIZE
    "POST /api/sessions/:id/optimize": optimizeSession,

    // Wildcard fallback
    "/api/*": () => Response.json({ error: "Not found" }, { status: 404 }),
  },

  // WebSocket upgrade handling
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (upgraded) return undefined;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not found", { status: 404 });
  },

  websocket: {
    open(ws) {
      console.log("WebSocket client connected");
    },
    message(ws, message) {
      // Handle streaming requests
    },
    close(ws) {
      console.log("WebSocket client disconnected");
    },
  },

  error(error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`🚀 Web UI running at http://localhost:${server.port}`);

// Helper functions
function handleStaticFile(req: Request, basePath: string): Response {
  const url = new URL(req.url);
  const filePath = `${basePath}${url.pathname}`;
  const file = Bun.file(filePath);
  return new Response(file);
}

// Route handlers (stubs - implement in routes/api.ts)
async function listSessions(req: Request): Promise<Response> {
  // TODO: Implement
  return Response.json({ sessions: [] });
}

async function getSession(req: Request): Promise<Response> {
  const id = req.params?.id;
  return Response.json({ id, entries: [] });
}

async function analyzeSession(req: Request): Promise<Response> {
  return Response.json({ analysis: {} });
}

async function validateSession(req: Request): Promise<Response> {
  return Response.json({ validation: {} });
}

async function listProjects(req: Request): Promise<Response> {
  return Response.json({ projects: [] });
}

async function cloneSession(req: Request): Promise<Response> {
  return Response.json({ cloned: true });
}

async function optimizeSession(req: Request): Promise<Response> {
  return Response.json({ optimized: true });
}

export { server };
```

### 1.3 Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev:web": "bun --hot run src/web/server.ts",
    "start:web": "bun run src/web/server.ts",
    "build:web": "bun build src/web/server.ts --outdir=dist/web"
  }
}
```

### 1.4 Create Minimal index.html

Create `src/web/public/index.html`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>Claude Code Conversation Workbench</title>
  <link rel="stylesheet" href="/css/layers.css">
  <link rel="stylesheet" href="/css/theme.css">
  <link rel="stylesheet" href="/css/layout.css">
  <link rel="stylesheet" href="/css/components.css">
  <script type="module" src="/js/app.js"></script>
</head>
<body>
  <div class="app-layout">
    <aside class="sidebar glass-panel">
      <nav class="main-nav" aria-label="Main navigation">
        <a href="/" class="nav-link active">Sessions</a>
        <a href="/build" class="nav-link">Build</a>
        <a href="/templates" class="nav-link">Templates</a>
      </nav>
    </aside>
    <main class="main-content">
      <header class="page-header glass-panel">
        <h1>Claude Code Conversation Workbench</h1>
      </header>
      <section class="content-area" id="content">
        <p>Loading sessions...</p>
      </section>
    </main>
  </div>
</body>
</html>
```

## Quality Gates

### Gate 1: TypeScript Validation
```bash
bun run typecheck
```

### Gate 2: Server Starts Successfully
```bash
bun run src/web/server.ts &
curl http://localhost:3000/api/sessions
kill %1
```

### Gate 3: Static Files Served
```bash
curl http://localhost:3000/ | head -5
```

## Completion Criteria

- [ ] Directory structure created
- [ ] server.ts compiles without errors
- [ ] Server starts on port 3000
- [ ] API routes respond with JSON
- [ ] Static files served correctly
- [ ] WebSocket upgrade works
- [ ] package.json scripts added

## Next Phase

After completing Phase 1, proceed to:
`/plan9:phase2` - CSS Architecture
