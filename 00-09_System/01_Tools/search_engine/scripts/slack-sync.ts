#!/usr/bin/env bun
/**
 * slack-sync.ts - Master Slack Sync Orchestration Script
 *
 * Orchestrates the complete Slack synchronization workflow:
 * 1. Incremental slackdump export (via resume)
 * 2. Convert archive to export format
 * 3. Sync JSON files to VRAM structure
 * 4. Incremental Markdown conversion
 * 5. Incremental search engine indexing
 *
 * Usage:
 *   bun scripts/slack-sync.ts              # Normal incremental sync
 *   bun scripts/slack-sync.ts --full       # Force full sync
 *   bun scripts/slack-sync.ts --dry-run    # Show what would happen
 *   bun scripts/slack-sync.ts --skip-export # Skip slackdump, process existing
 *   bun scripts/slack-sync.ts --status     # Show sync status
 */

import { $ } from "bun";

// Configuration
const CONFIG = {
  syncDir: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync",
  archiveDir: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/slackdump_archive",
  exportTemp: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/export_temp",
  jsonTarget: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json",
  mdTarget: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/markdown",
  lastSyncFile: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/last_sync.txt",
  logDir: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/logs",
};

interface SyncOptions {
  full?: boolean;
  dryRun?: boolean;
  skipExport?: boolean;
}

interface SyncResult {
  channelsUpdated: string[];
  filesAdded: number;
  filesUpdated: number;
  chunksIndexed: number;
}

// Helper: Get last sync time
async function getLastSyncTime(): Promise<Date> {
  try {
    const content = await Bun.file(CONFIG.lastSyncFile).text();
    return new Date(content.trim());
  } catch {
    // Default to a week ago if no sync file
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }
}

// Helper: Update last sync time
async function updateLastSyncTime(): Promise<void> {
  await Bun.write(CONFIG.lastSyncFile, new Date().toISOString());
}

// Helper: Log with timestamp
function log(message: string, level: "info" | "warn" | "error" = "info"): void {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: "ℹ️ ",
    warn: "⚠️ ",
    error: "❌",
  }[level];
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Step 1: Run slackdump resume for incremental export
async function runSlackdumpResume(options: SyncOptions): Promise<boolean> {
  if (options.dryRun) {
    log("[DRY RUN] Would run: slackdump resume");
    return true;
  }

  log("Starting slackdump resume...");

  // Check if archive exists
  const archiveExists = await Bun.file(`${CONFIG.archiveDir}/slackdump.sqlite`).exists();

  if (!archiveExists) {
    log("No existing archive found. Creating initial archive...", "warn");
    // For initial archive, we need to run archive command first
    const result = await $`slackdump archive -files=true -member-only -time-from 2025-12-22 -o ${CONFIG.archiveDir} -y`.nothrow().quiet();
    if (result.exitCode !== 0) {
      log(`Archive creation failed: ${result.stderr.toString()}`, "error");
      return false;
    }
    log("Initial archive created successfully");
    return true;
  }

  // Run resume for incremental update
  const result = await $`slackdump resume -files=true ${CONFIG.archiveDir}`.nothrow().quiet();

  if (result.exitCode !== 0) {
    const stderr = result.stderr.toString();
    // "nothing to resume" is not an error
    if (stderr.includes("nothing to resume") || stderr.includes("already up to date")) {
      log("Archive is already up to date");
      return true;
    }
    log(`Resume failed: ${stderr}`, "error");
    return false;
  }

  log("Slackdump resume completed");
  return true;
}

// Step 2: Convert archive to export format
async function convertArchiveToExport(options: SyncOptions): Promise<boolean> {
  if (options.dryRun) {
    log("[DRY RUN] Would run: slackdump convert");
    return true;
  }

  log("Converting archive to export format...");

  // Clean previous export
  await $`rm -rf ${CONFIG.exportTemp}`.nothrow().quiet();

  // Check if archive exists
  const archiveDb = `${CONFIG.archiveDir}/slackdump.sqlite`;
  const archiveExists = await Bun.file(archiveDb).exists();

  if (!archiveExists) {
    log("Archive database not found, skipping conversion", "warn");
    return false;
  }

  const result = await $`slackdump convert -format export -o ${CONFIG.exportTemp} ${CONFIG.archiveDir}`.nothrow().quiet();

  if (result.exitCode !== 0) {
    log(`Convert failed: ${result.stderr.toString()}`, "error");
    return false;
  }

  log("Archive converted to export format");
  return true;
}

// Step 3: Sync JSON files to VRAM structure
async function syncJsonFiles(options: SyncOptions): Promise<SyncResult> {
  const result: SyncResult = {
    channelsUpdated: [],
    filesAdded: 0,
    filesUpdated: 0,
    chunksIndexed: 0,
  };

  if (options.dryRun) {
    log("[DRY RUN] Would sync JSON files");
    return result;
  }

  log("Syncing JSON files to VRAM structure...");

  const lastSync = await getLastSyncTime();
  const exportDir = CONFIG.exportTemp;

  // Check if export directory exists using fs.stat
  const { stat: fsStat } = await import("node:fs/promises");
  try {
    const dirStat = await fsStat(exportDir);
    if (!dirStat.isDirectory()) {
      log("Export path is not a directory, skipping JSON sync", "warn");
      return result;
    }
  } catch {
    log("Export directory not found, skipping JSON sync", "warn");
    return result;
  }

  // Find all channel directories
  const glob = new Bun.Glob("*");
  const channelDirs: string[] = [];

  for await (const entry of glob.scan({ cwd: exportDir, onlyFiles: false })) {
    const fullPath = `${exportDir}/${entry}`;
    const stat = await fsStat(fullPath).catch(() => null);
    if (stat?.isDirectory() && !entry.startsWith("__") && !entry.startsWith(".")) {
      channelDirs.push(entry);
    }
  }

  for (const channel of channelDirs) {
    const sourceDir = `${exportDir}/${channel}`;
    const targetDir = `${CONFIG.jsonTarget}/${channel}`;

    // Ensure target directory exists
    await $`mkdir -p ${targetDir}`.quiet();

    // Find JSON files in channel
    const jsonGlob = new Bun.Glob("*.json");
    for await (const jsonFile of jsonGlob.scan({ cwd: sourceDir })) {
      const sourcePath = `${sourceDir}/${jsonFile}`;
      const targetPath = `${targetDir}/${jsonFile}`;

      // Check if file is new or updated
      const sourceFile = Bun.file(sourcePath);
      const targetFile = Bun.file(targetPath);
      const targetExists = await targetFile.exists();

      if (!targetExists) {
        result.filesAdded++;
      } else {
        const sourceStat = await sourceFile.stat();
        const targetStat = await targetFile.stat();
        if (sourceStat.mtime > targetStat.mtime) {
          result.filesUpdated++;
        } else {
          continue; // Skip unchanged files
        }
      }

      // Copy file
      await Bun.write(targetPath, sourceFile);

      if (!result.channelsUpdated.includes(channel)) {
        result.channelsUpdated.push(channel);
      }
    }
  }

  // Copy users.json if it exists and is newer
  const usersSource = `${exportDir}/users.json`;
  const usersTarget = `${CONFIG.jsonTarget}/users.json`;
  if (await Bun.file(usersSource).exists()) {
    await Bun.write(usersTarget, Bun.file(usersSource));
    log("Updated users.json");
  }

  log(`JSON sync complete: ${result.filesAdded} added, ${result.filesUpdated} updated, ${result.channelsUpdated.length} channels`);
  return result;
}

// Step 4: Convert updated channels to Markdown
async function convertToMarkdown(channelsUpdated: string[], options: SyncOptions): Promise<void> {
  if (options.dryRun) {
    log(`[DRY RUN] Would convert ${channelsUpdated.length} channels to Markdown`);
    return;
  }

  if (channelsUpdated.length === 0) {
    log("No channels to convert to Markdown");
    return;
  }

  log(`Converting ${channelsUpdated.length} channels to Markdown...`);

  // Import and run the incremental converter
  try {
    const converterPath = `${import.meta.dir}/convert-slack-md-incremental.ts`;
    const converterExists = await Bun.file(converterPath).exists();

    if (converterExists) {
      const { convertChannelsToMarkdown } = await import("./convert-slack-md-incremental");
      await convertChannelsToMarkdown(channelsUpdated);
    } else {
      log("Incremental MD converter not found, skipping", "warn");
    }
  } catch (err) {
    log(`Markdown conversion error: ${err}`, "error");
  }

  log("Markdown conversion complete");
}

// Step 5: Index new content to search engine
async function indexNewContent(channelsUpdated: string[], options: SyncOptions): Promise<number> {
  if (options.dryRun) {
    log(`[DRY RUN] Would index ${channelsUpdated.length} channels`);
    return 0;
  }

  if (channelsUpdated.length === 0) {
    log("No new content to index");
    return 0;
  }

  log(`Indexing ${channelsUpdated.length} channels to search engine...`);

  try {
    const indexerPath = `${import.meta.dir}/index-slack-incremental.ts`;
    const indexerExists = await Bun.file(indexerPath).exists();

    if (indexerExists) {
      const { indexChannels } = await import("./index-slack-incremental");
      const count = await indexChannels(channelsUpdated);
      log(`Indexed ${count} chunks`);
      return count;
    } else {
      log("Incremental indexer not found, skipping", "warn");
      return 0;
    }
  } catch (err) {
    log(`Indexing error: ${err}`, "error");
    return 0;
  }
}

// Step 6: Enhance new chunks with metadata
async function enhanceNewChunks(options: SyncOptions): Promise<void> {
  if (options.dryRun) {
    log("[DRY RUN] Would enhance new chunks");
    return;
  }

  log("Enhancing new chunks with metadata...");

  try {
    // Run the enhancer script
    const enhancerPath = `${import.meta.dir}/../slack-enhancer.ts`;
    if (await Bun.file(enhancerPath).exists()) {
      await $`bun ${enhancerPath}`.quiet();
      log("Chunk enhancement complete");
    }
  } catch (err) {
    log(`Enhancement error: ${err}`, "warn");
  }
}

// Show status
async function showStatus(): Promise<void> {
  const lastSync = await getLastSyncTime();
  const ageMs = Date.now() - lastSync.getTime();
  const ageHours = (ageMs / (1000 * 60 * 60)).toFixed(1);

  console.log("\n📊 Slack Sync Status\n" + "=".repeat(40));
  console.log(`Last sync: ${lastSync.toISOString()}`);
  console.log(`Age: ${ageHours} hours`);

  // Check archive status
  const archiveExists = await Bun.file(`${CONFIG.archiveDir}/slackdump.sqlite`).exists();
  console.log(`Archive: ${archiveExists ? "✅ exists" : "❌ not found"}`);

  // Check export temp
  const exportExists = await Bun.file(CONFIG.exportTemp).exists().catch(() => false);
  console.log(`Export temp: ${exportExists ? "✅ exists" : "⬜ empty"}`);

  // Status assessment
  const status = parseFloat(ageHours) < 24 ? "✅ healthy" : parseFloat(ageHours) < 48 ? "⚠️ stale" : "❌ outdated";
  console.log(`Status: ${status}`);
  console.log("=".repeat(40) + "\n");
}

// Main function
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Check for status flag
  if (args.includes("--status")) {
    await showStatus();
    return;
  }

  const options: SyncOptions = {
    full: args.includes("--full"),
    dryRun: args.includes("--dry-run"),
    skipExport: args.includes("--skip-export"),
  };

  console.log("\n🔄 VRAM Slack Sync\n" + "=".repeat(50));
  console.log(`Mode: ${options.full ? "full" : "incremental"}`);
  console.log(`Dry run: ${options.dryRun ? "yes" : "no"}`);
  console.log("=".repeat(50) + "\n");

  const startTime = performance.now();
  let success = true;

  try {
    // Step 1: Incremental slackdump export
    if (!options.skipExport) {
      log("📥 Step 1: Fetching new messages from Slack...");
      success = await runSlackdumpResume(options);
      if (!success && !options.dryRun) {
        log("Export failed, continuing with existing data", "warn");
      }
    } else {
      log("📥 Step 1: Skipping export (--skip-export)");
    }

    // Step 2: Convert archive to export format
    log("📁 Step 2: Converting to JSON export format...");
    const converted = await convertArchiveToExport(options);

    // Step 3: Sync JSON to VRAM structure
    log("📋 Step 3: Syncing JSON files to VRAM...");
    const syncResult = await syncJsonFiles(options);

    // Step 4: Convert updated channels to Markdown
    log("📝 Step 4: Converting to Markdown...");
    await convertToMarkdown(syncResult.channelsUpdated, options);

    // Step 5: Index new content
    log("🔍 Step 5: Indexing to search engine...");
    syncResult.chunksIndexed = await indexNewContent(syncResult.channelsUpdated, options);

    // Step 6: Enhance new chunks
    log("✨ Step 6: Enhancing metadata...");
    await enhanceNewChunks(options);

    // Update last sync time
    if (!options.dryRun) {
      await updateLastSyncTime();
    }

    const elapsed = (performance.now() - startTime) / 1000;

    console.log("\n" + "=".repeat(50));
    console.log("✅ Sync Complete!\n");
    console.log(`  Channels updated: ${syncResult.channelsUpdated.length}`);
    console.log(`  Files added: ${syncResult.filesAdded}`);
    console.log(`  Files updated: ${syncResult.filesUpdated}`);
    console.log(`  Chunks indexed: ${syncResult.chunksIndexed}`);
    console.log(`  Time: ${elapsed.toFixed(1)}s`);
    console.log("=".repeat(50) + "\n");

  } catch (err) {
    log(`Sync failed: ${err}`, "error");
    process.exit(1);
  }
}

// Run
main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
