import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import type { SessionInfo, SessionMessage, SessionMetadata } from '../types/index.ts';
import { 
  getEncodedProjectDirectory, 
  getSessionFilePath, 
  getClaudeProjectsDirectory,
  decodeProjectPath 
} from '../utils/path.ts';
import { 
  generateSessionId, 
  validateSessionId, 
  parseSessionFile, 
  extractSessionMetadata,
  createSessionSummary
} from '../utils/session.ts';

/**
 * Session management service for Claude Code conversations
 * Handles JSONL file operations and session state tracking
 */
export class SessionManager {
  private projectsDirectory: string;
  private sessionCache: Map<string, SessionMessage[]> = new Map();

  constructor(projectsDirectory?: string) {
    this.projectsDirectory = projectsDirectory || getClaudeProjectsDirectory();
  }

  /**
   * Finds all project directories in the Claude projects folder
   */
  findAllProjects(): string[] {
    if (!existsSync(this.projectsDirectory)) {
      return [];
    }

    const projects: string[] = [];
    const directories = readdirSync(this.projectsDirectory, { withFileTypes: true });

    for (const dir of directories) {
      if (dir.isDirectory() && dir.name.startsWith('-')) {
        try {
          const projectPath = decodeProjectPath(dir.name);
          projects.push(projectPath);
        } catch (error) {
          console.warn(`Failed to decode project path: ${dir.name}`);
        }
      }
    }

    return projects;
  }

  /**
   * Finds all session files for a specific project
   */
  findProjectSessions(projectPath: string): string[] {
    const projectDir = getEncodedProjectDirectory(projectPath);
    
    if (!existsSync(projectDir)) {
      return [];
    }

    const files = readdirSync(projectDir);
    const sessionIds: string[] = [];

    for (const file of files) {
      if (file.endsWith('.jsonl')) {
        const sessionId = file.replace('.jsonl', '');
        if (validateSessionId(sessionId)) {
          sessionIds.push(sessionId);
        }
      }
    }

    return sessionIds;
  }

  /**
   * Finds a session by ID across all projects
   */
  findSessionById(sessionId: string): string | null {
    if (!validateSessionId(sessionId)) {
      return null;
    }

    const projects = this.findAllProjects();
    
    for (const projectPath of projects) {
      const sessions = this.findProjectSessions(projectPath);
      if (sessions.includes(sessionId)) {
        return getSessionFilePath(projectPath, sessionId);
      }
    }

    return null;
  }

  /**
   * Loads and parses a session file
   */
  loadSession(sessionId: string): SessionMessage[] | null {
    // Check cache first
    if (this.sessionCache.has(sessionId)) {
      return this.sessionCache.get(sessionId)!;
    }

    const sessionPath = this.findSessionById(sessionId);
    if (!sessionPath || !existsSync(sessionPath)) {
      return null;
    }

    try {
      const content = readFileSync(sessionPath, 'utf-8');
      const messages = parseSessionFile(content);
      
      // Cache the parsed session
      this.sessionCache.set(sessionId, messages);
      
      return messages;
    } catch (error) {
      console.error(`Failed to load session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Gets session metadata without loading full content
   */
  getSessionMetadata(sessionId: string): SessionMetadata | null {
    const messages = this.loadSession(sessionId);
    if (!messages || messages.length === 0) {
      return null;
    }

    try {
      return extractSessionMetadata(messages);
    } catch (error) {
      console.error(`Failed to extract metadata for session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Gets the latest session for a project
   */
  getLatestSession(projectPath: string): SessionInfo | null {
    const sessions = this.findProjectSessions(projectPath);
    if (sessions.length === 0) {
      return null;
    }

    // Sort sessions by modification time (most recent first)
    const sessionPaths = sessions.map(sessionId => ({
      sessionId,
      path: getSessionFilePath(projectPath, sessionId)
    }));

    sessionPaths.sort((a, b) => {
      try {
        const statA = require('fs').statSync(a.path);
        const statB = require('fs').statSync(b.path);
        return statB.mtime.getTime() - statA.mtime.getTime();
      } catch {
        return 0;
      }
    });

    const latestSessionId = sessionPaths[0]?.sessionId;
    if (!latestSessionId) {
      return null;
    }
    
    const metadata = this.getSessionMetadata(latestSessionId);
    
    if (!metadata) {
      return null;
    }

    return {
      sessionId: latestSessionId,
      projectPath,
      timestamp: metadata.lastActivity,
      cwd: projectPath // Simplified - could be more sophisticated
    };
  }

  /**
   * Gets all sessions for a project with metadata
   */
  getProjectSessionHistory(projectPath: string): SessionInfo[] {
    const sessions = this.findProjectSessions(projectPath);
    const sessionInfos: SessionInfo[] = [];

    for (const sessionId of sessions) {
      const metadata = this.getSessionMetadata(sessionId);
      if (metadata) {
        sessionInfos.push({
          sessionId,
          projectPath,
          timestamp: metadata.lastActivity,
          cwd: projectPath
        });
      }
    }

    // Sort by timestamp (most recent first)
    sessionInfos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return sessionInfos;
  }

  /**
   * Creates a session summary for analysis
   */
  createSessionSummary(sessionId: string): string | null {
    const messages = this.loadSession(sessionId);
    if (!messages) {
      return null;
    }

    return createSessionSummary(messages);
  }

  /**
   * Validates that a session exists and is readable
   */
  validateSession(sessionId: string): boolean {
    return this.loadSession(sessionId) !== null;
  }

  /**
   * Creates a new session directory if it doesn't exist
   */
  ensureProjectDirectory(projectPath: string): void {
    const projectDir = getEncodedProjectDirectory(projectPath);
    if (!existsSync(projectDir)) {
      mkdirSync(projectDir, { recursive: true });
    }
  }

  /**
   * Generates a new unique session ID
   */
  generateSessionId(): string {
    return generateSessionId();
  }

  /**
   * Clears the session cache
   */
  clearCache(): void {
    this.sessionCache.clear();
  }

  /**
   * Gets session cache statistics
   */
  getCacheStats(): { size: number; sessions: string[] } {
    return {
      size: this.sessionCache.size,
      sessions: Array.from(this.sessionCache.keys())
    };
  }

  /**
   * Extracts essential context from a session for duplication
   */
  extractEssentialContext(sessionId: string): {
    summary: string;
    cwd: string;
    gitBranch: string;
    keyInsights: string[];
  } | null {
    const messages = this.loadSession(sessionId);
    if (!messages || messages.length === 0) {
      return null;
    }

    const metadata = extractSessionMetadata(messages);
    const summary = createSessionSummary(messages);
    
    // Extract key insights from the conversation
    const keyInsights: string[] = [];
    
    // Look for significant decisions or findings
    messages.forEach(msg => {
      if (msg.type === 'assistant' && typeof msg.message.content === 'string') {
        const content = msg.message.content.toLowerCase();
        if (content.includes('important') || content.includes('key') || content.includes('solution')) {
          keyInsights.push(msg.message.content.substring(0, 200) + '...');
        }
      }
    });

    const firstMessage = messages[0]!;
    
    return {
      summary,
      cwd: firstMessage.cwd,
      gitBranch: firstMessage.gitBranch || 'main',
      keyInsights: keyInsights.slice(0, 5) // Limit to 5 key insights
    };
  }

  /**
   * Creates a true duplicate of a session by copying the actual session files
   * This preserves the complete conversation history for proper context
   */
  duplicateSession(sourceSessionId: string): string | null {
    try {
      // Validate source session exists
      if (!this.validateSession(sourceSessionId)) {
        console.error(`Source session ${sourceSessionId} not found`);
        return null;
      }

      // Find the source session file path by searching all projects
      const sourceSessionFile = this.findSessionById(sourceSessionId);
      if (!sourceSessionFile) {
        console.error(`Could not find source session file for ${sourceSessionId}`);
        return null;
      }

      // Generate new session ID
      const newSessionId = generateSessionId();
      console.log(`🆕 Generated new session ID for duplication: ${newSessionId}`);

      // Extract the project directory from the source session file path
      // Path structure: projectsDirectory/encodedProject/sessions/sessionId.jsonl
      const sessionsDirPath = sourceSessionFile.replace(`/${sourceSessionId}.jsonl`, '');
      const newSessionFile = join(sessionsDirPath, `${newSessionId}.jsonl`);

      // Make sure the sessions directory exists
      if (!existsSync(sessionsDirPath)) {
        console.error(`Sessions directory does not exist: ${sessionsDirPath}`);
        return null;
      }

      // Read the source session file and update session IDs
      const sourceContent = readFileSync(sourceSessionFile, 'utf-8');
      const sourceLines = sourceContent.trim().split('\n');
      
      // Update each message to have the new session ID
      const updatedLines = sourceLines.map(line => {
        try {
          const message = JSON.parse(line);
          message.sessionId = newSessionId;
          return JSON.stringify(message);
        } catch (error) {
          console.warn(`Warning: Could not parse message line, copying as-is:`, error);
          return line;
        }
      });
      
      // Write the updated content to the new session file
      writeFileSync(newSessionFile, updatedLines.join('\n') + '\n', 'utf-8');
      
      console.log(`✅ Session files copied and updated successfully`);
      console.log(`📁 Updated session ID from ${sourceSessionId} to ${newSessionId}`);

      // Clear cache to ensure fresh data
      this.sessionCache.delete(sourceSessionId);
      this.sessionCache.delete(newSessionId);

      return newSessionId;

    } catch (error) {
      console.error(`❌ Failed to duplicate session ${sourceSessionId}:`, error);
      return null;
    }
  }
}