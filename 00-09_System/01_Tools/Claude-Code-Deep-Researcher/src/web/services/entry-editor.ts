/**
 * Entry Editor Service
 *
 * Provides functionality to modify, update, insert, and delete
 * entries within session files.
 */

import { randomUUID } from 'crypto';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import type { ConversationEntry } from '../../types/claude-conversation';

export interface EntryUpdate {
  /** New content for text blocks */
  content?: string;
  /** New tool name */
  toolName?: string;
  /** New tool input */
  toolInput?: Record<string, unknown>;
  /** Updated metadata */
  metadata?: Record<string, unknown>;
}

export interface InsertOptions {
  /** UUID of entry to insert after */
  afterUuid?: string;
  /** Index to insert at */
  atIndex?: number;
  /** The entry to insert */
  entry: Partial<ConversationEntry>;
}

export interface EditResult {
  success: boolean;
  entryUuid: string;
  sessionId: string;
  operation: 'update' | 'insert' | 'delete';
  timestamp: string;
}

export class EntryEditor {
  private claudeDir: string;

  constructor() {
    this.claudeDir = join(homedir(), '.claude', 'projects');
  }

  /**
   * Update an existing entry in a session
   */
  async updateEntry(
    sessionId: string,
    entryUuid: string,
    updates: EntryUpdate
  ): Promise<EditResult> {
    const sessionPath = await this.findSessionPath(sessionId);
    if (!sessionPath) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const entries = await this.readSessionEntries(sessionPath);
    const entryIndex = entries.findIndex((e) => e.uuid === entryUuid);

    if (entryIndex === -1) {
      throw new Error(`Entry not found: ${entryUuid}`);
    }

    // Apply updates
    const entry = entries[entryIndex];
    const updatedEntry = this.applyUpdates(entry, updates);

    entries[entryIndex] = updatedEntry;

    // Write back
    await this.writeSessionEntries(sessionPath, entries);

    return {
      success: true,
      entryUuid,
      sessionId,
      operation: 'update',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Insert a new entry into a session
   */
  async insertEntry(
    sessionId: string,
    options: InsertOptions
  ): Promise<EditResult> {
    const sessionPath = await this.findSessionPath(sessionId);
    if (!sessionPath) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const entries = await this.readSessionEntries(sessionPath);

    // Generate UUID if not provided
    const newEntry: ConversationEntry = {
      uuid: randomUUID(),
      timestamp: new Date().toISOString(),
      ...options.entry,
    } as ConversationEntry;

    // Determine insertion point
    let insertIndex = entries.length;

    if (options.afterUuid) {
      const afterIndex = entries.findIndex((e) => e.uuid === options.afterUuid);
      if (afterIndex !== -1) {
        insertIndex = afterIndex + 1;
      }
    } else if (options.atIndex !== undefined) {
      insertIndex = Math.max(0, Math.min(options.atIndex, entries.length));
    }

    // Update parent UUID if inserting after another entry
    if (insertIndex > 0 && !newEntry.parentUuid) {
      const previousEntry = entries[insertIndex - 1];
      if (previousEntry.uuid) {
        newEntry.parentUuid = previousEntry.uuid;
      }
    }

    // Insert the entry
    entries.splice(insertIndex, 0, newEntry);

    // Update the next entry's parent UUID if needed
    if (insertIndex < entries.length - 1) {
      const nextEntry = entries[insertIndex + 1];
      if (nextEntry.parentUuid === entries[insertIndex - 1]?.uuid) {
        nextEntry.parentUuid = newEntry.uuid;
      }
    }

    // Write back
    await this.writeSessionEntries(sessionPath, entries);

    return {
      success: true,
      entryUuid: newEntry.uuid!,
      sessionId,
      operation: 'insert',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Delete an entry from a session
   */
  async deleteEntry(sessionId: string, entryUuid: string): Promise<EditResult> {
    const sessionPath = await this.findSessionPath(sessionId);
    if (!sessionPath) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const entries = await this.readSessionEntries(sessionPath);
    const entryIndex = entries.findIndex((e) => e.uuid === entryUuid);

    if (entryIndex === -1) {
      throw new Error(`Entry not found: ${entryUuid}`);
    }

    // Get the entry being deleted
    const deletedEntry = entries[entryIndex];

    // Update parent references for subsequent entries
    if (entryIndex < entries.length - 1) {
      const nextEntry = entries[entryIndex + 1];
      if (nextEntry.parentUuid === entryUuid) {
        // Point to the deleted entry's parent instead
        nextEntry.parentUuid = deletedEntry.parentUuid;
      }
    }

    // Remove the entry
    entries.splice(entryIndex, 1);

    // Write back
    await this.writeSessionEntries(sessionPath, entries);

    return {
      success: true,
      entryUuid,
      sessionId,
      operation: 'delete',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Reorder entries in a session
   */
  async reorderEntry(
    sessionId: string,
    entryUuid: string,
    newIndex: number
  ): Promise<EditResult> {
    const sessionPath = await this.findSessionPath(sessionId);
    if (!sessionPath) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const entries = await this.readSessionEntries(sessionPath);
    const currentIndex = entries.findIndex((e) => e.uuid === entryUuid);

    if (currentIndex === -1) {
      throw new Error(`Entry not found: ${entryUuid}`);
    }

    // Remove from current position
    const [entry] = entries.splice(currentIndex, 1);

    // Clamp new index
    const targetIndex = Math.max(0, Math.min(newIndex, entries.length));

    // Insert at new position
    entries.splice(targetIndex, 0, entry);

    // Rebuild parent relationships
    this.rebuildParentRelationships(entries);

    // Write back
    await this.writeSessionEntries(sessionPath, entries);

    return {
      success: true,
      entryUuid,
      sessionId,
      operation: 'update',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Batch update multiple entries
   */
  async batchUpdate(
    sessionId: string,
    updates: Array<{ uuid: string; updates: EntryUpdate }>
  ): Promise<{ success: boolean; updated: number; failed: number }> {
    const sessionPath = await this.findSessionPath(sessionId);
    if (!sessionPath) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const entries = await this.readSessionEntries(sessionPath);
    let updated = 0;
    let failed = 0;

    for (const { uuid, updates: entryUpdates } of updates) {
      const index = entries.findIndex((e) => e.uuid === uuid);
      if (index !== -1) {
        entries[index] = this.applyUpdates(entries[index], entryUpdates);
        updated++;
      } else {
        failed++;
      }
    }

    // Write back
    await this.writeSessionEntries(sessionPath, entries);

    return { success: failed === 0, updated, failed };
  }

  /**
   * Apply updates to an entry
   */
  private applyUpdates(
    entry: ConversationEntry,
    updates: EntryUpdate
  ): ConversationEntry {
    const updated = { ...entry };

    // Update content
    if (updates.content !== undefined && 'message' in updated) {
      const message = updated.message as any;
      if (typeof message.content === 'string') {
        message.content = updates.content;
      } else if (Array.isArray(message.content)) {
        // Find text block and update
        const textBlock = message.content.find(
          (c: any) => c.type === 'text'
        );
        if (textBlock) {
          textBlock.text = updates.content;
        }
      }
    }

    // Update tool name
    if (updates.toolName !== undefined && 'message' in updated) {
      const message = updated.message as any;
      if (Array.isArray(message.content)) {
        const toolBlock = message.content.find(
          (c: any) => c.type === 'tool_use'
        );
        if (toolBlock) {
          toolBlock.name = updates.toolName;
        }
      }
    }

    // Update tool input
    if (updates.toolInput !== undefined && 'message' in updated) {
      const message = updated.message as any;
      if (Array.isArray(message.content)) {
        const toolBlock = message.content.find(
          (c: any) => c.type === 'tool_use'
        );
        if (toolBlock) {
          toolBlock.input = updates.toolInput;
        }
      }
    }

    // Update metadata
    if (updates.metadata !== undefined) {
      (updated as any).metadata = {
        ...(updated as any).metadata,
        ...updates.metadata,
      };
    }

    // Update timestamp
    updated.timestamp = new Date().toISOString();

    return updated;
  }

  /**
   * Rebuild parent relationships for a list of entries
   */
  private rebuildParentRelationships(entries: ConversationEntry[]): void {
    for (let i = 1; i < entries.length; i++) {
      const previous = entries[i - 1];
      const current = entries[i];

      // Only update if there was a parent relationship before
      if (current.parentUuid) {
        current.parentUuid = previous.uuid;
      }
    }

    // First entry should have no parent
    if (entries.length > 0 && entries[0].parentUuid) {
      delete entries[0].parentUuid;
    }
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
    } catch {
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
}

// Export singleton instance
export const entryEditor = new EntryEditor();
