import {
  handleGetSpeakers,
  handleRebuildRegistry,
  handleTranscribe,
  handleAddSpeaker,
  handleRemoveSpeaker,
  handleHealthCheck,
} from "./api/routes";

// Import the HTML file for serving the React app
const htmlFile = Bun.file("./index.html");

const server = Bun.serve({
  port: 3000,

  routes: {
    // Health check
    "/api/health": handleHealthCheck,

    // Speaker registry endpoints
    "/api/speakers": handleGetSpeakers,

    // Static responses for route definitions
    "/api/registry/rebuild": {
      POST: handleRebuildRegistry,
    },

    "/api/transcribe": {
      POST: handleTranscribe,
    },

    "/api/speakers/add": {
      POST: handleAddSpeaker,
    },

    "/api/speakers/remove": {
      POST: handleRemoveSpeaker,
    },
  },

  // Handle all other requests
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle method-specific routes that Bun.serve routes don't support directly
    if (pathname === "/api/registry/rebuild" && request.method === "POST") {
      return handleRebuildRegistry();
    }

    if (pathname === "/api/transcribe" && request.method === "POST") {
      return handleTranscribe(request);
    }

    if (pathname === "/api/speakers/add" && request.method === "POST") {
      return handleAddSpeaker(request);
    }

    if (pathname === "/api/speakers/remove" && request.method === "POST") {
      return handleRemoveSpeaker(request);
    }

    // Serve static files for the React app
    if (pathname === "/" || pathname === "/index.html") {
      return new Response(htmlFile, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Handle client-side bundle
    if (pathname === "/client.tsx") {
      const result = await Bun.build({
        entrypoints: ["./client.tsx"],
        minify: false,
      });

      if (result.success && result.outputs.length > 0) {
        const output = result.outputs[0];
        return new Response(output, {
          headers: { "Content-Type": "application/javascript" },
        });
      }
    }

    // Serve App.tsx as module
    if (pathname === "/App.tsx") {
      const result = await Bun.build({
        entrypoints: ["./App.tsx"],
        minify: false,
      });

      if (result.success && result.outputs.length > 0) {
        const output = result.outputs[0];
        return new Response(output, {
          headers: { "Content-Type": "application/javascript" },
        });
      }
    }

    // 404 for unmatched routes
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`
🎙️  Speaker Transcription Pipeline Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Server running at: http://localhost:${server.port}

API Endpoints:
  GET  /api/health           - Health check
  GET  /api/speakers         - List registered speakers
  POST /api/transcribe       - Transcribe audio/video file
  POST /api/registry/rebuild - Rebuild registry from transcripts
  POST /api/speakers/add     - Add new speaker
  POST /api/speakers/remove  - Remove speaker

Open http://localhost:${server.port} in your browser to use the UI.
`);
