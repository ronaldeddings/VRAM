// Triad - Self-Managing AI Agent Orchestration System
// Main entry point

import { startServer, updateState, getState } from "./server";
import { config } from "./utils/config";
import { logger } from "./utils/logger";
import { orchestrator } from "./orchestrator";
import { reportGenerator } from "./reports/report-generator";
import { searchClient } from "./context/search-client";

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ████████╗██████╗ ██╗ █████╗ ██████╗                     ║
║   ╚══██╔══╝██╔══██╗██║██╔══██╗██╔══██╗                    ║
║      ██║   ██████╔╝██║███████║██║  ██║                    ║
║      ██║   ██╔══██╗██║██╔══██║██║  ██║                    ║
║      ██║   ██║  ██║██║██║  ██║██████╔╝                    ║
║      ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═════╝                     ║
║                                                            ║
║   Self-Managing AI Agent Orchestration System              ║
║   Version 1.0.0                                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

  await logger.info("triad_starting", {
    version: "1.0.0",
    vramPath: config.vramPath,
    focusAreas: config.focusAreas.map(a => a.name),
  });

  // Initialize state directories
  await ensureDirectories();

  // Connect to VRAM search database (critical for deep analysis)
  const searchConnected = await searchClient.connect();
  if (searchConnected) {
    const stats = searchClient.getStats();
    await logger.info("search_db_ready", {
      totalFiles: stats?.totalFiles,
      totalAreas: stats?.totalAreas
    });
  } else {
    await logger.warn("search_db_unavailable", {
      path: config.searchDbPath,
      message: "Triad will run with limited context"
    });
  }

  // Start the HTTP server
  const server = startServer();

  // Mark as running
  updateState({ running: true });

  // Write PID file for watchdog
  await writePidFile();

  await logger.info("triad_ready", {
    port: config.port,
    agents: Object.keys(config.agents),
  });

  // Initialize report generator (loads persisted insights)
  await reportGenerator.initialize();

  // Initialize orchestrator (loads previous state)
  await orchestrator.initialize();

  console.log("🔺 Triad is ready. Starting orchestration loop...\n");

  // Start the orchestration loop (runs continuously in background)
  orchestrator.start();

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    await shutdown("SIGINT");
  });

  process.on("SIGTERM", async () => {
    await shutdown("SIGTERM");
  });
}

async function ensureDirectories(): Promise<void> {
  const dirs = [
    config.outputPath,
    `${config.outputPath}/claude`,
    `${config.outputPath}/codex`,
    `${config.outputPath}/gemini`,
    `${config.outputPath}/overseer`,
    `${config.outputPath}/healer`,
    config.reportsPath,
    `${config.reportsPath}/daily`,
    `${config.reportsPath}/weekly`,
    config.statePath,
    config.logsPath,
  ];

  for (const dir of dirs) {
    const fullPath = dir.startsWith("/") ? dir : `${config.triadPath}/${dir}`;
    const file = Bun.file(fullPath);
    // Create directory if it doesn't exist by writing a .gitkeep
    const gitkeep = Bun.file(`${fullPath}/.gitkeep`);
    if (!(await gitkeep.exists())) {
      await Bun.write(`${fullPath}/.gitkeep`, "");
    }
  }

  await logger.debug("directories_ensured", { count: dirs.length });
}

async function writePidFile(): Promise<void> {
  const pidPath = `${config.triadPath}/${config.statePath}/triad.pid`;
  await Bun.write(pidPath, process.pid.toString());
  await logger.debug("pid_written", { pid: process.pid, path: pidPath });
}

async function shutdown(signal: string): Promise<void> {
  console.log(`\n🔺 Received ${signal}, shutting down gracefully...`);
  await logger.info("triad_shutdown", { signal });

  // Stop the orchestrator
  orchestrator.stop();
  updateState({ running: false });

  // Clean up PID file
  const pidPath = `${config.triadPath}/${config.statePath}/triad.pid`;
  try {
    const file = Bun.file(pidPath);
    if (await file.exists()) {
      await Bun.write(pidPath, ""); // Clear it
    }
  } catch (e) {
    // Ignore cleanup errors
  }

  console.log("🔺 Triad stopped.\n");
  process.exit(0);
}

// Start the application
main().catch(async (error) => {
  console.error("Fatal error starting Triad:", error);
  await logger.error("triad_fatal", { error: error.message });
  process.exit(1);
});
