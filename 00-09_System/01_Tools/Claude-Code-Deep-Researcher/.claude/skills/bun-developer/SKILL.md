---
name: bun-developer
description: Expert Bun runtime and toolkit guidance for JavaScript/TypeScript development. Use when writing Bun code, building servers with Bun.serve, running tests with bun test, using bun:sqlite, Bun Shell ($), file I/O with Bun.file/Bun.write, package management with bun install, or configuring bunfig.toml. Covers HTTP servers, WebSockets, testing, SQLite, shell scripting, and Node.js compatibility.
---

# Bun Developer Expert

Expert guidance for Bun - the fast all-in-one JavaScript runtime, bundler, test runner, and package manager.

## Quick Reference

### Running Bun

```bash
# Run a file
bun run index.ts

# Run with hot reload
bun --hot index.ts

# Run package.json scripts
bun run start
bun start  # shorthand

# Install dependencies
bun install
bun add react
bun add -d @types/react  # dev dependency
```

### Project Initialization

```bash
bun init my-app  # Creates new project with templates: Blank, React, or Library
```

## HTTP Server (Bun.serve)

### Basic Server with Routes

```typescript
const server = Bun.serve({
  port: 3000,
  routes: {
    // Static response
    "/api/status": new Response("OK"),

    // Dynamic route with params
    "/users/:id": req => new Response(`User ${req.params.id}`),

    // Per-method handlers
    "/api/posts": {
      GET: () => Response.json({ posts: [] }),
      POST: async req => {
        const body = await req.json();
        return Response.json({ created: true, ...body }, { status: 201 });
      },
    },

    // Wildcard routes
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),

    // Serve files
    "/favicon.ico": Bun.file("./favicon.ico"),

    // Redirects
    "/old": Response.redirect("/new"),
  },

  // Fallback handler
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },

  // Error handler
  error(error) {
    return new Response("Server Error", { status: 500 });
  },
});

console.log(`Server running at ${server.url}`);
```

### HTML Imports (Full-Stack Apps)

```typescript
import homepage from "./index.html";

Bun.serve({
  routes: {
    "/": homepage,  // Serves bundled HTML with HMR in dev
  },
});
```

### Server Methods

```typescript
// Hot reload routes
server.reload({ routes: { "/": () => new Response("v2") } });

// Stop server
await server.stop();       // Graceful
await server.stop(true);   // Force close all connections

// Get client IP
const ip = server.requestIP(req);  // { address, port }

// Set per-request timeout
server.timeout(req, 60);  // 60 seconds

// Server metrics
server.pendingRequests;
server.pendingWebSockets;
```

### WebSocket Server

```typescript
Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req, { data: { userId: "123" } })) {
      return;  // Upgraded successfully
    }
    return new Response("Not a WebSocket request");
  },

  websocket: {
    open(ws) {
      ws.subscribe("chat");
      ws.send("Welcome!");
    },
    message(ws, message) {
      ws.publish("chat", message);  // Broadcast to topic
    },
    close(ws) {
      ws.unsubscribe("chat");
    },
  },
});
```

## File I/O

### Reading Files (Bun.file)

```typescript
const file = Bun.file("data.txt");

file.size;           // bytes
file.type;           // MIME type
await file.exists(); // boolean

// Read contents
await file.text();        // string
await file.json();        // parsed JSON
await file.arrayBuffer(); // ArrayBuffer
await file.bytes();       // Uint8Array
await file.stream();      // ReadableStream
```

### Writing Files (Bun.write)

```typescript
// Write string
await Bun.write("output.txt", "Hello World");

// Write from Response
const response = await fetch("https://example.com");
await Bun.write("page.html", response);

// Copy file
await Bun.write("copy.txt", Bun.file("original.txt"));

// Write to stdout
await Bun.write(Bun.stdout, Bun.file("data.txt"));
```

### Incremental Writing (FileSink)

```typescript
const writer = Bun.file("log.txt").writer();

writer.write("Line 1\n");
writer.write("Line 2\n");
writer.flush();  // Force write to disk
writer.end();    // Flush and close
```

### Directories (node:fs)

```typescript
import { readdir, mkdir } from "node:fs/promises";

// List directory
const files = await readdir("./src");
const allFiles = await readdir("./", { recursive: true });

// Create directory
await mkdir("path/to/dir", { recursive: true });
```

## SQLite (bun:sqlite)

### Basic Usage

```typescript
import { Database } from "bun:sqlite";

const db = new Database("app.db");          // File-based
const db = new Database(":memory:");        // In-memory
const db = new Database("app.db", { readonly: true });
const db = new Database("app.db", { strict: true });  // Throw on missing params

// Enable WAL mode for better performance
db.run("PRAGMA journal_mode = WAL;");
```

### Queries

```typescript
// Prepare and execute
const query = db.query("SELECT * FROM users WHERE id = ?");

query.get(1);              // First row as object
query.all(1);              // All rows as array
query.values(1);           // All rows as arrays
query.run(1);              // Execute, return { lastInsertRowid, changes }

// Named parameters
const q = db.query("SELECT * FROM users WHERE name = $name");
q.all({ $name: "Alice" });

// With strict: true, omit prefix
q.all({ name: "Alice" });

// Iterate results
for (const row of db.query("SELECT * FROM users").iterate()) {
  console.log(row);
}
```

### Map Results to Classes

```typescript
class User {
  id: number;
  name: string;
  get displayName() { return `User: ${this.name}`; }
}

const users = db.query("SELECT id, name FROM users").as(User).all();
users[0].displayName;  // "User: Alice"
```

### Transactions

```typescript
const insertUser = db.prepare("INSERT INTO users (name) VALUES (?)");

const insertMany = db.transaction((names: string[]) => {
  for (const name of names) insertUser.run(name);
  return names.length;
});

const count = insertMany(["Alice", "Bob", "Charlie"]);
// Automatically commits on success, rolls back on error
```

### Import Syntax

```typescript
import db from "./app.sqlite" with { type: "sqlite" };
db.query("SELECT * FROM users").all();
```

## Bun Shell ($)

### Basic Commands

```typescript
import { $ } from "bun";

await $`echo "Hello World"`;           // Prints to stdout
const output = await $`ls -la`.text(); // Capture as string
const data = await $`cat config.json`.json();  // Parse as JSON
```

### Error Handling

```typescript
try {
  await $`failing-command`.text();
} catch (err) {
  console.log(err.exitCode);
  console.log(err.stderr.toString());
}

// Don't throw on non-zero exit
const { exitCode, stdout } = await $`maybe-fails`.nothrow().quiet();
```

### Piping and Redirection

```typescript
// Pipes
await $`cat file.txt | grep "pattern" | wc -l`;

// Redirect to file
await $`echo "log" > output.txt`;
await $`echo "more" >> output.txt`;  // Append

// Redirect from JavaScript objects
const response = new Response("data");
await $`cat < ${response}`;

// Write to buffer
const buffer = Buffer.alloc(100);
await $`echo "hello" > ${buffer}`;
```

### Environment and Working Directory

```typescript
// Set env for single command
await $`echo $FOO`.env({ FOO: "bar" });

// Set cwd
await $`pwd`.cwd("/tmp");

// Global defaults
$.env({ NODE_ENV: "production" });
$.cwd("/app");
```

### Built-in Commands (Cross-Platform)

`cd`, `ls`, `rm`, `echo`, `pwd`, `cat`, `touch`, `mkdir`, `which`, `mv`, `exit`, `true`, `false`, `yes`, `seq`, `dirname`, `basename`

## Testing (bun:test)

### Writing Tests

```typescript
import { expect, test, describe, beforeEach, afterEach } from "bun:test";

describe("math", () => {
  test("addition", () => {
    expect(2 + 2).toBe(4);
  });

  test("async", async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
```

### Test Modifiers

```typescript
test.skip("skipped", () => {});
test.todo("not implemented yet", () => {});
test.only("only this runs", () => {});

test.if(process.platform === "darwin")("macOS only", () => {});
test.skipIf(process.platform === "win32")("skip on Windows", () => {});

// Retry flaky tests
test("network", async () => {}, { retry: 3 });

// Repeat for stability testing
test("stable", () => {}, { repeats: 10 });

// Custom timeout
test("slow", async () => {}, 30000);
```

### Parametrized Tests

```typescript
test.each([
  [1, 2, 3],
  [2, 3, 5],
])("add(%i, %i) = %i", (a, b, expected) => {
  expect(a + b).toBe(expected);
});
```

### Common Matchers

```typescript
expect(value).toBe(exact);
expect(value).toEqual(deepEqual);
expect(value).toBeTruthy();
expect(value).toBeNull();
expect(value).toBeDefined();
expect(array).toContain(item);
expect(array).toHaveLength(n);
expect(string).toMatch(/regex/);
expect(object).toHaveProperty("key");
expect(number).toBeGreaterThan(n);
expect(fn).toThrow("error");
expect(promise).resolves.toBe(value);
expect(promise).rejects.toThrow();
expect(mock).toHaveBeenCalledWith(args);
expect(value).toMatchSnapshot();
```

### Running Tests

```bash
bun test                    # Run all tests
bun test src/              # Run tests in directory
bun test --watch           # Watch mode
bun test --coverage        # With coverage
bun test --timeout 60000   # Custom timeout
bun test --only            # Only .only tests
bun test --todo            # Run .todo tests
```

## Package Management

### Installing Packages

```bash
bun install              # Install all dependencies
bun add react            # Add dependency
bun add -d typescript    # Add dev dependency
bun add -g cowsay        # Install globally
bun remove lodash        # Remove package

bun install --frozen-lockfile  # CI: fail if lockfile out of sync
bun ci                         # Alias for above
bun install --production       # Skip devDependencies
```

### bunx (npx alternative)

```bash
bunx cowsay "Hello"      # Run package without installing
bunx --bun vite          # Force Bun runtime for Node CLIs
```

## Configuration (bunfig.toml)

```toml
# Runtime
preload = ["./setup.ts"]
jsx = "react"
logLevel = "debug"  # "debug" | "warn" | "error"
smol = true         # Reduce memory at cost of performance

# Custom loaders
[loader]
".yaml" = "text"

# Test runner
[test]
root = "./__tests__"
coverage = true
coverageThreshold = 0.8
preload = ["./test-setup.ts"]

# Package manager
[install]
optional = true
dev = true
frozenLockfile = false
exact = false              # Use ^ ranges by default
linker = "hoisted"         # or "isolated"

[install.cache]
disable = false

# bun run behavior
[run]
bun = true    # Auto-alias node to bun
shell = "bun" # Use Bun's shell (cross-platform)
```

## TypeScript Support

Bun natively supports TypeScript without configuration. For type hints:

```bash
bun add -d @types/bun
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "types": ["bun-types"]
  }
}
```

## Node.js Compatibility

Bun implements most Node.js APIs. Use `node:` prefix for built-in modules:

```typescript
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
```

**Fully supported:** fs, path, os, crypto, http, https, stream, buffer, events, util, url, querystring, assert, child_process, worker_threads, dns, net, tls, zlib

## Additional Resources

For detailed reference documentation, see the supporting files in this skill:
- [HTTP-SERVER.md](HTTP-SERVER.md) - Complete Bun.serve API reference
- [SQLITE.md](SQLITE.md) - Full SQLite documentation
- [TESTING.md](TESTING.md) - Complete test runner guide
- [SHELL.md](SHELL.md) - Bun Shell reference
- [PACKAGE-MANAGER.md](PACKAGE-MANAGER.md) - Package management details

**Official Documentation:** https://bun.com/docs
**LLM-optimized docs:** https://bun.com/docs/llms.txt
