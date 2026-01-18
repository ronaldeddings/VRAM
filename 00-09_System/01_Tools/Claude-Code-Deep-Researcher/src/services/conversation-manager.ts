import type { Options, SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { ExecutionResult, DuplicationResult, DuplicateAndResumeResult } from '../types/index.ts';
import { ClaudeCodeService } from './claude-code.ts';
import { PromptExecutor } from './prompt-executor.ts';
import { SessionManager } from './session-manager.ts';
import { generateSessionId } from '../utils/session.ts';

/**
 * Conversation management service implementing resume and duplication features
 * Implements Core Features 3, 4, and 5
 */
export class ConversationManager {
  private claudeCodeService: ClaudeCodeService;
  private promptExecutor: PromptExecutor;
  private sessionManager: SessionManager;

  constructor(claudeCodeService: ClaudeCodeService, promptExecutor: PromptExecutor, sessionManager: SessionManager) {
    this.claudeCodeService = claudeCodeService;
    this.promptExecutor = promptExecutor;
    this.sessionManager = sessionManager;
  }

  /**
   * Core Feature 3: Resume Conversation - Resume previous conversations from where they left off
   * Resumes an existing conversation by session ID and continues with new prompt
   */
  async resumeConversation(sessionId: string, prompt: string, options: Partial<Options> = {}): Promise<ExecutionResult> {
    console.log(`🔄 Resuming conversation: ${sessionId}`);
    
    try {
      // Validate session exists
      if (!this.sessionManager.validateSession(sessionId)) {
        return {
          success: false,
          messages: [],
          error: `Session ${sessionId} not found or invalid`
        };
      }

      // Get session metadata for context
      const metadata = this.sessionManager.getSessionMetadata(sessionId);
      if (!metadata) {
        return {
          success: false,
          messages: [],
          error: `Failed to load metadata for session ${sessionId}`
        };
      }

      console.log(`📊 Session info - Project: ${metadata.projectPath}, Messages: ${metadata.messageCount}`);

      // Execute prompt with resume option using PromptExecutor for proper result handling
      const resumeOptions = { ...options, resume: sessionId };
      const result = await this.promptExecutor.runPrompt(prompt, resumeOptions);

      if (result.success) {
        console.log(`✅ Conversation resumed successfully`);
      } else {
        console.error(`❌ Failed to resume conversation: ${result.error}`);
      }

      return result;

    } catch (error) {
      console.error(`❌ Resume conversation error:`, error);
      return {
        success: false,
        messages: [],
        error: error instanceof Error ? error.message : 'Unknown resume error'
      };
    }
  }

  /**
   * Core Feature 4: Duplicate Conversation - Create exact copies of existing conversations
   * Creates a new conversation with optimized context from an existing session
   */
  async duplicateConversation(sourceSessionId: string): Promise<DuplicationResult> {
    console.log(`📋 Duplicating conversation: ${sourceSessionId}`);
    
    try {
      // Validate source session exists
      if (!this.sessionManager.validateSession(sourceSessionId)) {
        return {
          newSessionId: '',
          success: false,
          error: `Source session ${sourceSessionId} not found or invalid`
        };
      }

      // Use the new true duplication method that copies the actual session files
      const newSessionId = this.sessionManager.duplicateSession(sourceSessionId);
      
      if (!newSessionId) {
        return {
          newSessionId: '',
          success: false,
          error: `Failed to duplicate session files for ${sourceSessionId}`
        };
      }

      console.log(`✅ Conversation duplicated successfully`);
      console.log(`📋 Complete conversation history preserved`);
      
      return {
        newSessionId,
        success: true
      };

    } catch (error) {
      console.error(`❌ Duplicate conversation error:`, error);
      return {
        newSessionId: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown duplication error'
      };
    }
  }

  /**
   * Core Feature 5: Duplicate & Resume - Duplicate a conversation and immediately continue it
   * Combines duplication and immediate continuation with a new prompt
   */
  async duplicateAndResume(sourceSessionId: string, prompt: string, options: Partial<Options> = {}): Promise<DuplicateAndResumeResult> {
    console.log(`🔄📋 Duplicating and resuming conversation: ${sourceSessionId}`);
    
    try {
      // Step 1: Duplicate the conversation
      const duplicationResult = await this.duplicateConversation(sourceSessionId);
      
      if (!duplicationResult.success) {
        return {
          newSessionId: '',
          messages: [],
          success: false,
          error: `Duplication failed: ${duplicationResult.error}`
        };
      }

      const newSessionId = duplicationResult.newSessionId;
      console.log(`✅ Duplication completed, new session: ${newSessionId}`);

      // Step 2: Continue immediately with the provided prompt
      const resumeResult = await this.resumeConversation(newSessionId, prompt, options);

      if (resumeResult.success) {
        console.log(`✅ Duplicate and resume completed successfully`);
        return {
          newSessionId,
          messages: resumeResult.messages,
          success: true
        };
      } else {
        return {
          newSessionId,
          messages: resumeResult.messages,
          success: false,
          error: `Resume failed after successful duplication: ${resumeResult.error}`
        };
      }

    } catch (error) {
      console.error(`❌ Duplicate and resume error:`, error);
      return {
        newSessionId: '',
        messages: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown duplicate and resume error'
      };
    }
  }

  /**
   * Lists all available sessions that can be resumed or duplicated
   */
  async listAvailableSessions(projectPath?: string): Promise<{
    sessions: Array<{
      sessionId: string;
      projectPath: string;
      lastActivity: string;
      messageCount: number;
      canResume: boolean;
    }>;
    totalSessions: number;
  }> {
    try {
      const projects = projectPath ? [projectPath] : this.sessionManager.findAllProjects();
      const allSessions: any[] = [];

      for (const project of projects) {
        const projectSessions = this.sessionManager.getProjectSessionHistory(project);
        
        for (const sessionInfo of projectSessions) {
          const metadata = this.sessionManager.getSessionMetadata(sessionInfo.sessionId);
          
          allSessions.push({
            sessionId: sessionInfo.sessionId,
            projectPath: project,
            lastActivity: sessionInfo.timestamp,
            messageCount: metadata?.messageCount || 0,
            canResume: this.sessionManager.validateSession(sessionInfo.sessionId)
          });
        }
      }

      // Sort by last activity (most recent first)
      allSessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

      return {
        sessions: allSessions,
        totalSessions: allSessions.length
      };

    } catch (error) {
      console.error(`❌ Failed to list available sessions:`, error);
      return {
        sessions: [],
        totalSessions: 0
      };
    }
  }

  /**
   * Gets detailed information about a specific session
   */
  async getSessionDetails(sessionId: string): Promise<{
    sessionId: string;
    metadata: any;
    summary: string;
    canResume: boolean;
    canDuplicate: boolean;
  } | null> {
    try {
      if (!this.sessionManager.validateSession(sessionId)) {
        return null;
      }

      const metadata = this.sessionManager.getSessionMetadata(sessionId);
      const summary = this.sessionManager.createSessionSummary(sessionId);

      if (!metadata || !summary) {
        return null;
      }

      return {
        sessionId,
        metadata,
        summary,
        canResume: true,
        canDuplicate: true
      };

    } catch (error) {
      console.error(`❌ Failed to get session details for ${sessionId}:`, error);
      return null;
    }
  }


  /**
   * Validates that a session can be safely resumed or duplicated
   */
  validateSessionForOperation(sessionId: string, operation: 'resume' | 'duplicate'): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!this.sessionManager.validateSession(sessionId)) {
      issues.push('Session does not exist or is not accessible');
      return { valid: false, issues };
    }

    const metadata = this.sessionManager.getSessionMetadata(sessionId);
    if (!metadata) {
      issues.push('Failed to load session metadata');
      return { valid: false, issues };
    }

    // Check if session has sufficient content for operations
    if (metadata.messageCount < 2) {
      issues.push('Session has insufficient message history');
    }

    // For duplication, check if we can extract meaningful context
    if (operation === 'duplicate') {
      const context = this.sessionManager.extractEssentialContext(sessionId);
      if (!context) {
        issues.push('Failed to extract context for duplication');
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Gets the session manager instance
   */
  getSessionManager(): SessionManager {
    return this.sessionManager;
  }

  /**
   * Gets the Claude Code service instance
   */
  getClaudeCodeService(): ClaudeCodeService {
    return this.claudeCodeService;
  }
}