# Bun HTTP Server Reference

Complete reference for `Bun.serve()` - Bun's high-performance HTTP server.

## Server Configuration

```typescript
interface ServeOptions {
  port?: number;              // Default: 3000 or $BUN_PORT/$PORT/$NODE_PORT
  hostname?: string;          // Default: "0.0.0.0"
  unix?: string;              // Unix domain socket path
  routes?: Routes;            // Route handlers (v1.2.3+)
  fetch: FetchHandler;        // Fallback/main handler
  error?: ErrorHandler;       // Error handler
  websocket?: WebSocketHandler;
  idleTimeout?: number;       // Connection idle timeout (seconds)
  development?: boolean;      // Development mode
  tls?: TLSOptions;          // HTTPS configuration
}

const server = Bun.serve({
  port: 8080,
  hostname: "localhost",
  development: true,

  routes: {
    "/": () => new Response("Home"),
  },

  fetch(req) {
    return new Response("Fallback");
  },
});
```

## Route Patterns

### Static Routes

```typescript
routes: {
  "/": new Response("Home"),
  "/api/health": Response.json({ status: "ok" }),
  "/favicon.ico": Bun.file("./public/favicon.ico"),
}
```

### Dynamic Routes with Parameters

```typescript
routes: {
  "/users/:id": (req) => {
    return Response.json({ userId: req.params.id });
  },

  "/posts/:postId/comments/:commentId": (req) => {
    const { postId, commentId } = req.params;
    return Response.json({ postId, commentId });
  },
}
```

### Per-Method Handlers

```typescript
routes: {
  "/api/users": {
    GET: () => Response.json({ users: [] }),
    POST: async (req) => {
      const body = await req.json();
      return Response.json(body, { status: 201 });
    },
    PUT: async (req) => {
      const body = await req.json();
      return Response.json(body);
    },
    DELETE: () => new Response(null, { status: 204 }),
  },
}
```

### Wildcard Routes

```typescript
routes: {
  // Match all paths starting with /api/
  "/api/*": Response.json({ error: "Not found" }, { status: 404 }),

  // Match specific path first (more specific wins)
  "/api/v1/*": (req) => handleV1(req),
}
```

### Redirects

```typescript
routes: {
  "/old-path": Response.redirect("/new-path"),
  "/external": Response.redirect("https://example.com", 302),
}
```

## Request Object

```typescript
fetch(req: Request, server: Server) {
  // Standard Request properties
  req.url;        // Full URL string
  req.method;     // "GET", "POST", etc.
  req.headers;    // Headers object

  // Read body
  await req.text();
  await req.json();
  await req.formData();
  await req.arrayBuffer();
  await req.blob();

  // Route params (in route handlers)
  req.params;     // { id: "123" } for "/users/:id"

  // Server utilities
  const ip = server.requestIP(req);  // { address, port, family }
  server.timeout(req, 60);           // Set 60s timeout
}
```

## Response Helpers

```typescript
// Plain text
new Response("Hello");

// JSON
Response.json({ data: "value" });
Response.json({ error: "Not found" }, { status: 404 });

// Headers
new Response("OK", {
  status: 200,
  headers: {
    "Content-Type": "text/plain",
    "X-Custom": "value",
  },
});

// Redirect
Response.redirect("/path");
Response.redirect("/path", 301);  // Permanent

// Serve file
Bun.file("./image.png");  // Returns BunFile (Blob subclass)

// Streaming
new Response(readableStream);
```

## WebSocket Support

```typescript
Bun.serve({
  fetch(req, server) {
    // Upgrade HTTP to WebSocket
    if (req.url.endsWith("/ws")) {
      const success = server.upgrade(req, {
        data: { userId: getUserId(req) },  // Attach custom data
        headers: { "Set-Cookie": "..." },
      });
      if (success) return;  // Don't return Response if upgraded
    }
    return new Response("Not found", { status: 404 });
  },

  websocket: {
    // Max message size (default: 16MB)
    maxPayloadLength: 1024 * 1024,

    // Backpressure settings
    backpressureLimit: 1024 * 1024,
    closeOnBackpressureLimit: false,

    // Idle timeout
    idleTimeout: 120,  // seconds

    // Compression
    perMessageDeflate: true,

    // Handlers
    open(ws) {
      console.log("Connected:", ws.data.userId);
      ws.subscribe("chat");
    },

    message(ws, message) {
      // message is string | Buffer
      ws.send("Echo: " + message);
      ws.publish("chat", message);  // To all subscribers
    },

    close(ws, code, reason) {
      console.log("Closed:", code, reason);
    },

    drain(ws) {
      // Called when backpressure is relieved
    },
  },
});
```

### ServerWebSocket API

```typescript
ws.send(data);                    // Send to this client
ws.publish(topic, data);          // Publish to topic
ws.subscribe(topic);              // Subscribe to topic
ws.unsubscribe(topic);           // Unsubscribe
ws.isSubscribed(topic);          // Check subscription
ws.close(code?, reason?);        // Close connection
ws.terminate();                   // Force close

ws.data;                         // Custom data from upgrade
ws.readyState;                   // 0=connecting, 1=open, 2=closing, 3=closed
ws.remoteAddress;                // Client IP
ws.binaryType;                   // "nodebuffer" | "arraybuffer" | "uint8array"

// From server
server.publish(topic, data);     // Broadcast to topic
server.subscriberCount(topic);   // Count subscribers
```

## Server Methods

```typescript
const server = Bun.serve({ ... });

// Properties
server.port;              // Port number
server.hostname;          // Hostname
server.url;              // Full URL object
server.development;      // Boolean
server.id;               // Server identifier
server.pendingRequests;  // In-flight HTTP requests
server.pendingWebSockets; // Active WebSocket connections

// Methods
server.stop();           // Graceful shutdown (wait for requests)
server.stop(true);       // Force close all connections

server.reload(options);  // Hot reload fetch, error, routes handlers

server.ref();           // Keep process alive
server.unref();         // Allow process to exit

server.fetch(req);      // Make request to self (testing)

server.requestIP(req);  // Get client IP
server.timeout(req, seconds);  // Set request timeout

server.publish(topic, data);   // WebSocket broadcast
server.subscriberCount(topic); // WebSocket subscriber count
```

## TLS/HTTPS

```typescript
Bun.serve({
  port: 443,

  tls: {
    cert: Bun.file("./cert.pem"),
    key: Bun.file("./key.pem"),

    // Optional
    ca: Bun.file("./ca.pem"),
    passphrase: "secret",
    serverName: "example.com",
    lowMemoryMode: false,
  },

  fetch(req) {
    return new Response("Secure!");
  },
});
```

## Unix Domain Sockets

```typescript
Bun.serve({
  unix: "/tmp/my-app.sock",

  fetch(req) {
    return new Response("Hello from Unix socket");
  },
});

// Abstract namespace (Linux only)
Bun.serve({
  unix: "\0my-abstract-socket",
  fetch(req) { ... },
});
```

## Export Default Syntax

```typescript
// server.ts - Alternative syntax
import type { Serve } from "bun";

export default {
  port: 3000,

  fetch(req) {
    return new Response("Hello");
  },
} satisfies Serve.Options<undefined>;

// Run with: bun server.ts
```

## Development Mode

```bash
# Enable hot module replacement
bun --hot server.ts

# Watch mode (restarts on change)
bun --watch server.ts
```

```typescript
// Check if in development
if (server.development) {
  console.log("Development mode enabled");
}
```

## Error Handling

```typescript
Bun.serve({
  fetch(req) {
    throw new Error("Something went wrong");
  },

  error(error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  },
});
```

## Performance Tips

1. **Use routes object** instead of manual URL parsing in fetch
2. **Enable WAL mode** for SQLite databases
3. **Use Bun.file()** for static files (uses sendfile)
4. **Stream large responses** instead of loading into memory
5. **Use WebSocket pub/sub** for real-time features
6. **Set appropriate timeouts** for slow clients
