#!/usr/bin/env bun
/**
 * Unified Startup Script
 * Starts both the embedding server (llama-server) and the API server
 */

import { spawn, type Subprocess } from "bun";

const LLAMA_SERVER = "/opt/homebrew/bin/llama-server";
const MODEL_PATH = "/Users/ronaldeddings/.lmstudio/models/Qwen/Qwen3-Embedding-8B-GGUF/Qwen3-Embedding-8B-Q8_0.gguf";
const EMBED_PORT = 8081;
const API_PORT = 3000;

// Track child processes for cleanup
let embedProcess: Subprocess | null = null;
let apiProcess: Subprocess | null = null;

async function checkPort(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      signal: AbortSignal.timeout(1000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(port: number, name: string, maxWait = 60000): Promise<boolean> {
  const start = Date.now();
  process.stdout.write(`⏳ Waiting for ${name} on port ${port}`);

  while (Date.now() - start < maxWait) {
    if (await checkPort(port)) {
      console.log(` ✅`);
      return true;
    }
    process.stdout.write(".");
    await Bun.sleep(1000);
  }

  console.log(` ❌ timeout`);
  return false;
}

async function startEmbeddingServer(): Promise<Subprocess> {
  console.log("🚀 Starting embedding server (llama-server)...");
  console.log(`   Model: ${MODEL_PATH.split('/').pop()}`);
  console.log(`   Port: ${EMBED_PORT}`);

  const proc = spawn({
    cmd: [
      LLAMA_SERVER,
      "-m", MODEL_PATH,
      "--embedding",
      "--pooling", "last",
      "--port", String(EMBED_PORT),
      "-np", "1",           // 1 parallel slot
      "-c", "8192",         // context size
      "-ngl", "99",         // GPU layers
      "-nocb"               // no continuous batching
    ],
    stdout: "pipe",
    stderr: "pipe",
  });

  // Log embedding server output in background
  (async () => {
    const reader = proc.stderr?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      // Only log important messages
      if (text.includes("HTTP server") || text.includes("error") || text.includes("model loaded")) {
        console.log(`   [embed] ${text.trim()}`);
      }
    }
  })();

  return proc;
}

async function startAPIServer(): Promise<Subprocess> {
  console.log("\n🌐 Starting API server...");
  console.log(`   Port: ${API_PORT}`);

  const proc = spawn({
    cmd: ["bun", "server.ts"],
    cwd: import.meta.dir,
    stdout: "inherit",
    stderr: "inherit",
  });

  return proc;
}

async function cleanup() {
  console.log("\n\n🛑 Shutting down...");

  if (apiProcess) {
    console.log("   Stopping API server...");
    apiProcess.kill();
  }

  if (embedProcess) {
    console.log("   Stopping embedding server...");
    embedProcess.kill();
  }

  console.log("   Done. Goodbye!");
  process.exit(0);
}

// Handle shutdown signals
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║       VRAM Search Engine Startup       ║");
  console.log("╚════════════════════════════════════════╝\n");

  // Check if embedding server is already running
  if (await checkPort(EMBED_PORT)) {
    console.log(`✅ Embedding server already running on port ${EMBED_PORT}`);
  } else {
    // Start embedding server
    embedProcess = await startEmbeddingServer();

    // Wait for embedding server to be ready
    const embedReady = await waitForServer(EMBED_PORT, "embedding server", 90000);
    if (!embedReady) {
      console.error("❌ Failed to start embedding server");
      console.error("   Check that the model file exists and llama-server is installed");
      process.exit(1);
    }
  }

  // Check if API server is already running
  if (await checkPort(API_PORT)) {
    console.log(`⚠️  API server already running on port ${API_PORT}`);
    console.log("   Kill it first or use a different port");
    process.exit(1);
  }

  // Start API server
  apiProcess = await startAPIServer();

  // Wait for API server to be ready
  const apiReady = await waitForServer(API_PORT, "API server", 10000);
  if (!apiReady) {
    console.error("❌ Failed to start API server");
    cleanup();
    process.exit(1);
  }

  console.log("\n╔════════════════════════════════════════╗");
  console.log("║          All Systems Running!          ║");
  console.log("╠════════════════════════════════════════╣");
  console.log(`║  🔍 Search UI:  http://localhost:${API_PORT}    ║`);
  console.log(`║  🧠 Embeddings: http://localhost:${EMBED_PORT}   ║`);
  console.log("╠════════════════════════════════════════╣");
  console.log("║  Press Ctrl+C to stop all services     ║");
  console.log("╚════════════════════════════════════════╝\n");

  // Keep the process running and wait for child processes
  await Promise.race([
    apiProcess.exited,
    embedProcess?.exited ?? new Promise(() => {}),
  ]);

  console.log("⚠️  A server process exited unexpectedly");
  cleanup();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  cleanup();
});
