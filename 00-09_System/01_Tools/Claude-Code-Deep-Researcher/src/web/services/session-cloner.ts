/**
 * Session Cloner Service
 *
 * Provides functionality to duplicate, clone, and fork sessions.
 * Supports UUID regeneration, entry filtering, and cross-project cloning.
 */

import { randomUUID } from 'crypto';
import { readdir, copyFile, mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { homedir } from 'os';
import type { ConversationEntry } from '../../types/claude-conversation';

export interface CloneOptions {
  /** New name for the cloned session */
  newName?: string;
  /** Target project path (base64 encoded) */
  targetProject?: string;
  /** Whether to regenerate all UUIDs */
  regenerateUuids?: boolean;
  /** Filter entries by type */
  filterTypes?: string[];
  /** Clone entries up to this index (exclusive) */
  upToIndex?: number;
  /** Fork from a specific entry UUID */
  forkFromUuid?: string;
}

export interface CloneResult {
  success: boolean;
  sessionId: string;
  sessionPath: string;
  entryCount: number;
  originalSessionId: string;
  timestamp: string;
}

export class SessionCloner {
  private claudeDir: string;

  constructor() {
    this.claudeDir = join(homedir(), '.claude', 'projects');
  }

  /**
   * Clone a session with various options
   */
  async cloneSession(
    sourceSessionId: string,
    options: CloneOptions = {}
  ): Promise<CloneResult> {
    const {
      newName,
      targetProject,
      regenerateUuids = true,
      filterTypes,
      upToIndex,
      forkFromUuid,
    } = options;

    // Find the source session
    const sourcePath = await this.findSessionPath(sourceSessionId);
    if (!sourcePath) {
      throw new Error(`Session not found: ${sourceSessionId}`);
    }

    // Read and parse the source session
    const entries = await this.readSessionEntries(sourcePath);

    // Apply filtering
    let filteredEntries = entries;

    // Fork from specific UUID
    if (forkFromUuid) {
      const forkIndex = entries.findIndex((e) => e.uuid === forkFromUuid);
      if (forkIndex === -1) {
        throw new Error(`Entry UUID not found: ${forkFromUuid}`);
      }
      filteredEntries = entries.slice(0, forkIndex + 1);
    }

    // Filter by index
    if (upToIndex !== undefined) {
      filteredEntries = filteredEntries.slice(0, upToIndex);
    }

    // Filter by entry type
    if (filterTypes && filterTypes.length > 0) {
      filteredEntries = filteredEntries.filter((entry) => {
        const entryType = this.getEntryType(entry);
        return filterTypes.includes(entryType);
      });
    }

    // Regenerate UUIDs if requested
    if (regenerateUuids) {
      filteredEntries = this.regenerateEntryUuids(filteredEntries);
    }

    // Generate new session ID and path
    const newSessionId = newName || `${sourceSessionId}-clone-${Date.now()}`;
    const targetDir = targetProject
      ? join(this.claudeDir, targetProject)
      : dirname(sourcePath);

    // Ensure target directory exists
    await mkdir(targetDir, { recursive: true });

    const newPath = join(targetDir, `${newSessionId}.jsonl`);

    // Write the new session
    await this.writeSessionEntries(newPath, filteredEntries);

    return {
      success: true,
      sessionId: newSessionId,
      sessionPath: newPath,
      entryCount: filteredEntries.length,
      originalSessionId: sourceSessionId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Fork a session from a specific point
   */
  async forkSession(
    sourceSessionId: string,
    forkFromUuid: string,
    options: Omit<CloneOptions, 'forkFromUuid'> = {}
  ): Promise<CloneResult> {
    return this.cloneSession(sourceSessionId, {
      ...options,
      forkFromUuid,
      newName: options.newName || `${sourceSessionId}-fork-${Date.now()}`,
    });
  }

  /**
   * Create an exact duplicate with new UUIDs
   */
  async duplicateSession(
    sourceSessionId: string,
    newName?: string
  ): Promise<CloneResult> {
    return this.cloneSession(sourceSessionId, {
      newName: newName || `${sourceSessionId}-dup-${Date.now()}`,
      regenerateUuids: true,
    });
  }

  /**
   * Find the path to a session file by ID
   */
  private async findSessionPath(sessionId: string): Promise<string | null> {
    try {
      const projects = await readdir(this.claudeDir);

      for (const project of projects) {
        const projectPath = join(this.claudeDir, project);
        const projectStat = await stat(projectPath);

        if (!projectStat.isDirectory()) continue;

        const files = await readdir(projectPath);
        for (const file of files) {
          if (file === `${sessionId}.jsonl`) {
            return join(projectPath, file);
          }
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Read and parse session entries from a JSONL file
   */
  private async readSessionEntries(path: string): Promise<ConversationEntry[]> {
    const file = Bun.file(path);
    const content = await file.text();
    const lines = content.trim().split('\n');

    return lines
      .filter((line) => line.trim())
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter((entry): entry is ConversationEntry => entry !== null);
  }

  /**
   * Write session entries to a JSONL file
   */
  private async writeSessionEntries(
    path: string,
    entries: ConversationEntry[]
  ): Promise<void> {
    const content = entries.map((e) => JSON.stringify(e)).join('\n') + '\n';
    await Bun.write(path, content);
  }

  /**
   * Regenerate UUIDs for all entries while maintaining relationships
   */
  private regenerateEntryUuids(entries: ConversationEntry[]): ConversationEntry[] {
    // Create a mapping of old UUIDs to new UUIDs
    const uuidMap = new Map<string, string>();

    // First pass: generate new UUIDs for all entries
    for (const entry of entries) {
      if (entry.uuid) {
        uuidMap.set(entry.uuid, randomUUID());
      }
    }

    // Second pass: update entries with new UUIDs and fix relationships
    return entries.map((entry) => {
      const newEntry = { ...entry };

      // Update the entry's UUID
      if (newEntry.uuid && uuidMap.has(newEntry.uuid)) {
        newEntry.uuid = uuidMap.get(newEntry.uuid)!;
      }

      // Update parent UUID reference
      if (newEntry.parentUuid && uuidMap.has(newEntry.parentUuid)) {
        newEntry.parentUuid = uuidMap.get(newEntry.parentUuid)!;
      }

      // Update tool result references
      if ('toolResultBlockId' in newEntry && newEntry.toolResultBlockId) {
        const oldId = newEntry.toolResultBlockId;
        if (uuidMap.has(oldId)) {
          (newEntry as any).toolResultBlockId = uuidMap.get(oldId);
        }
      }

      // Update timestamp
      newEntry.timestamp = new Date().toISOString();

      return newEntry;
    });
  }

  /**
   * Get the type of an entry
   */
  private getEntryType(entry: ConversationEntry): string {
    if ('message' in entry && entry.message) {
      return entry.message.role || 'unknown';
    }
    if ('type' in entry) {
      return (entry as any).type;
    }
    if ('summary' in entry) {
      return 'summary';
    }
    return 'unknown';
  }

  /**
   * List all available projects
   */
  async listProjects(): Promise<
    Array<{ path: string; name: string; sessionCount: number }>
  > {
    try {
      const projects = await readdir(this.claudeDir);
      const result = [];

      for (const project of projects) {
        const projectPath = join(this.claudeDir, project);
        const projectStat = await stat(projectPath);

        if (!projectStat.isDirectory()) continue;

        const files = await readdir(projectPath);
        const sessionCount = files.filter((f) => f.endsWith('.jsonl')).length;

        // Decode project name from base64
        let name = project;
        try {
          name = Buffer.from(project, 'base64').toString('utf-8');
        } catch {
          // Keep original if not base64
        }

        result.push({
          path: project,
          name,
          sessionCount,
        });
      }

      return result;
    } catch {
      return [];
    }
  }

  /**
   * List sessions in a project
   */
  async listSessions(
    projectPath: string
  ): Promise<
    Array<{
      id: string;
      name: string;
      path: string;
      size: number;
      modified: string;
      entryCount: number;
    }>
  > {
    try {
      const fullPath = join(this.claudeDir, projectPath);
      const files = await readdir(fullPath);
      const sessions = [];

      for (const file of files) {
        if (!file.endsWith('.jsonl')) continue;

        const sessionPath = join(fullPath, file);
        const sessionStat = await stat(sessionPath);
        const id = file.replace('.jsonl', '');

        // Count entries
        const entries = await this.readSessionEntries(sessionPath);

        sessions.push({
          id,
          name: id,
          path: sessionPath,
          size: sessionStat.size,
          modified: sessionStat.mtime.toISOString(),
          entryCount: entries.length,
        });
      }

      // Sort by modified date, newest first
      sessions.sort(
        (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
      );

      return sessions;
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const sessionCloner = new SessionCloner();
