#!/usr/bin/env bun
/**
 * sync-slack-json.ts - Slack JSON File Synchronization Helper
 *
 * Syncs new/updated JSON files from slackdump export to VRAM structure.
 * Only copies files that are new or have been modified.
 *
 * Can be used standalone or imported by slack-sync.ts
 */

const CONFIG = {
  exportTemp: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/export_temp",
  jsonTarget: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/json",
  lastSyncFile: "/Volumes/VRAM/10-19_Work/14_Communications/14.02_slack/.sync/last_sync.txt",
};

export interface SyncResult {
  channelsUpdated: string[];
  filesAdded: number;
  filesUpdated: number;
  filesSkipped: number;
}

/**
 * Get the last sync timestamp
 */
export async function getLastSyncTime(): Promise<Date> {
  try {
    const content = await Bun.file(CONFIG.lastSyncFile).text();
    return new Date(content.trim());
  } catch {
    // Default to epoch if no sync file (process everything)
    return new Date(0);
  }
}

/**
 * Update the last sync timestamp
 */
export async function updateLastSyncTime(): Promise<void> {
  await Bun.write(CONFIG.lastSyncFile, new Date().toISOString());
}

/**
 * Find all JSON files in a directory that are newer than a given date
 */
async function findNewFiles(dir: string, since: Date): Promise<Map<string, string[]>> {
  const channelFiles = new Map<string, string[]>();

  try {
    // Check if directory exists using fs.stat
    const { stat } = await import("node:fs/promises");
    try {
      const dirStat = await stat(dir);
      if (!dirStat.isDirectory()) {
        console.log(`Path is not a directory: ${dir}`);
        return channelFiles;
      }
    } catch {
      console.log(`Directory not found: ${dir}`);
      return channelFiles;
    }

    // Scan for channel directories
    const glob = new Bun.Glob("*/*.json");
    for await (const file of glob.scan({ cwd: dir })) {
      const [channel, jsonFile] = file.split("/");

      // Skip special directories
      if (channel.startsWith("__") || channel.startsWith(".")) continue;

      // Check file modification time
      const fullPath = `${dir}/${file}`;
      const stat = await Bun.file(fullPath).stat().catch(() => null);

      if (stat && stat.mtime >= since) {
        const files = channelFiles.get(channel) || [];
        files.push(jsonFile);
        channelFiles.set(channel, files);
      }
    }
  } catch (err) {
    console.error(`Error scanning directory: ${err}`);
  }

  return channelFiles;
}

/**
 * Copy files from source to target, preserving directory structure
 */
async function copyFiles(
  sourceDir: string,
  targetDir: string,
  channelFiles: Map<string, string[]>
): Promise<SyncResult> {
  const result: SyncResult = {
    channelsUpdated: [],
    filesAdded: 0,
    filesUpdated: 0,
    filesSkipped: 0,
  };

  for (const [channel, files] of channelFiles) {
    const channelTargetDir = `${targetDir}/${channel}`;

    // Ensure target directory exists
    await Bun.$`mkdir -p ${channelTargetDir}`.quiet();

    for (const jsonFile of files) {
      const sourcePath = `${sourceDir}/${channel}/${jsonFile}`;
      const targetPath = `${channelTargetDir}/${jsonFile}`;

      // Check if target exists
      const targetFile = Bun.file(targetPath);
      const targetExists = await targetFile.exists();

      if (targetExists) {
        // Compare modification times
        const sourceFile = Bun.file(sourcePath);
        const sourceStat = await sourceFile.stat();
        const targetStat = await targetFile.stat();

        if (sourceStat.mtime <= targetStat.mtime) {
          result.filesSkipped++;
          continue;
        }
        result.filesUpdated++;
      } else {
        result.filesAdded++;
      }

      // Copy file
      await Bun.write(targetPath, Bun.file(sourcePath));
    }

    if (files.length > 0) {
      result.channelsUpdated.push(channel);
    }
  }

  return result;
}

/**
 * Sync users.json file
 */
async function syncUsersFile(sourceDir: string, targetDir: string): Promise<boolean> {
  const sourcePath = `${sourceDir}/users.json`;
  const targetPath = `${targetDir}/users.json`;

  const sourceFile = Bun.file(sourcePath);
  if (!(await sourceFile.exists())) {
    return false;
  }

  const targetFile = Bun.file(targetPath);
  const targetExists = await targetFile.exists();

  if (targetExists) {
    const sourceStat = await sourceFile.stat();
    const targetStat = await targetFile.stat();

    if (sourceStat.mtime <= targetStat.mtime) {
      return false; // No update needed
    }
  }

  await Bun.write(targetPath, sourceFile);
  return true;
}

/**
 * Sync channels.json file
 */
async function syncChannelsFile(sourceDir: string, targetDir: string): Promise<boolean> {
  const sourcePath = `${sourceDir}/channels.json`;
  const targetPath = `${targetDir}/channels.json`;

  const sourceFile = Bun.file(sourcePath);
  if (!(await sourceFile.exists())) {
    return false;
  }

  await Bun.write(targetPath, sourceFile);
  return true;
}

/**
 * Main sync function - can be imported and called from slack-sync.ts
 */
export async function syncSlackJson(options?: {
  since?: Date;
  sourceDir?: string;
  targetDir?: string;
}): Promise<SyncResult> {
  const sourceDir = options?.sourceDir || CONFIG.exportTemp;
  const targetDir = options?.targetDir || CONFIG.jsonTarget;
  const since = options?.since || await getLastSyncTime();

  console.log(`Syncing Slack JSON files...`);
  console.log(`  Source: ${sourceDir}`);
  console.log(`  Target: ${targetDir}`);
  console.log(`  Since: ${since.toISOString()}`);

  // Find new/updated files
  const channelFiles = await findNewFiles(sourceDir, since);
  console.log(`  Found ${channelFiles.size} channels with updates`);

  // Copy files
  const result = await copyFiles(sourceDir, targetDir, channelFiles);

  // Sync metadata files
  const usersUpdated = await syncUsersFile(sourceDir, targetDir);
  const channelsUpdated = await syncChannelsFile(sourceDir, targetDir);

  console.log(`\nSync Results:`);
  console.log(`  Channels updated: ${result.channelsUpdated.length}`);
  console.log(`  Files added: ${result.filesAdded}`);
  console.log(`  Files updated: ${result.filesUpdated}`);
  console.log(`  Files skipped: ${result.filesSkipped}`);
  console.log(`  Users.json: ${usersUpdated ? "updated" : "unchanged"}`);
  console.log(`  Channels.json: ${channelsUpdated ? "updated" : "unchanged"}`);

  return result;
}

// Run if executed directly
if (import.meta.main) {
  const args = process.argv.slice(2);
  const fullSync = args.includes("--full");

  const since = fullSync ? new Date(0) : await getLastSyncTime();
  const result = await syncSlackJson({ since });

  // Update last sync time
  if (result.filesAdded > 0 || result.filesUpdated > 0) {
    await updateLastSyncTime();
    console.log(`\nUpdated last sync time to: ${new Date().toISOString()}`);
  }
}
