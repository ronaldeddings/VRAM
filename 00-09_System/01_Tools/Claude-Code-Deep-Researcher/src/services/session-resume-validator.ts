/**
 * Session Resume Validator
 *
 * Validates that optimized JSONL files can successfully resume
 * sessions via the ClaudeAgent SDK.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { JSONLParser } from './jsonl-parser';
import { getSessionFilePath } from '../utils/path';
import type { ConversationEntry } from '../types/claude-conversation';

export interface ResumeValidationResult {
  /** Whether the session resume was successful */
  success: boolean;

  /** Session ID that was resumed */
  sessionId: string;

  /** Number of entries in the optimized session */
  entryCount: number;

  /** Whether the AI responded successfully */
  aiResponded: boolean;

  /** Response from the AI if successful */
  response?: string;

  /** Error message if failed */
  error?: string;

  /** Validation timestamp */
  timestamp: string;
}

/**
 * Validate that an optimized JSONL file can successfully resume
 */
export async function validateSessionResume(
  optimizedJSONLPath: string,
  projectPath: string,
  testPrompt: string = "Please confirm you can see the conversation history by summarizing what we've been working on.",
  skipBackup: boolean = false
): Promise<ResumeValidationResult> {
  const startTime = Date.now();
  console.log(`\n🔍 Validating session resume from: ${optimizedJSONLPath}`);

  try {
    // Step 1: Load optimized JSONL
    console.log(`📖 Loading optimized conversation...`);
    const entries = await loadConversation(optimizedJSONLPath);
    console.log(`✅ Loaded ${entries.length} entries`);

    // Step 2: Extract session ID
    const sessionId = extractSessionId(entries);
    if (!sessionId) {
      return {
        success: false,
        sessionId: 'unknown',
        entryCount: entries.length,
        aiResponded: false,
        error: 'Could not extract session ID from optimized JSONL',
        timestamp: new Date().toISOString(),
      };
    }
    console.log(`🔑 Session ID: ${sessionId}`);

    // Step 3: Copy optimized JSONL to Claude session location
    console.log(`📂 Installing optimized session for resumption...`);
    const sessionPath = getSessionFilePath(projectPath, sessionId);

    // Backup original if it exists and skipBackup is false
    if (!skipBackup && existsSync(sessionPath)) {
      const backupPath = `${sessionPath}.backup-${Date.now()}`;
      console.log(`💾 Backing up original session to: ${backupPath}`);
      copyFileSync(sessionPath, backupPath);
    }

    // Ensure directory exists
    const sessionDir = dirname(sessionPath);
    if (!existsSync(sessionDir)) {
      mkdirSync(sessionDir, { recursive: true });
    }

    // Copy optimized JSONL to session location
    copyFileSync(optimizedJSONLPath, sessionPath);
    console.log(`✅ Optimized session installed at: ${sessionPath}`);

    // Step 3: Attempt to resume session
    console.log(`🔄 Attempting to resume session...`);
    console.log(`📝 Test prompt: "${testPrompt}"`);

    let aiResponse = '';
    let aiResponded = false;

    try {
      const response = query({
        prompt: testPrompt,
        options: {
          resume: sessionId,
          model: 'claude-sonnet-4-5',
        },
      });

      // Collect AI response
      for await (const message of response) {
        if (message.type === 'assistant') {
          if (Array.isArray(message.message.content)) {
            const textContent = message.message.content
              .filter(c => c.type === 'text')
              .map(c => c.type === 'text' ? c.text : '')
              .join('');
            aiResponse += textContent;
            aiResponded = true;
          }
        }
      }

      const executionTime = Date.now() - startTime;
      console.log(`✅ Session resume successful!`);
      console.log(`⏱️  Execution time: ${executionTime}ms`);
      console.log(`💬 AI Response: ${aiResponse.substring(0, 200)}...`);

      return {
        success: true,
        sessionId,
        entryCount: entries.length,
        aiResponded,
        response: aiResponse,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        sessionId,
        entryCount: entries.length,
        aiResponded: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      success: false,
      sessionId: 'unknown',
      entryCount: 0,
      aiResponded: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Load conversation from JSONL file
 */
async function loadConversation(filePath: string): Promise<ConversationEntry[]> {
  const parser = new JSONLParser();
  const entries: ConversationEntry[] = [];

  for await (const entry of parser.parseFile(filePath)) {
    entries.push(entry);
  }

  return entries;
}

/**
 * Extract session ID from conversation entries
 */
function extractSessionId(entries: ConversationEntry[]): string | null {
  // Look for session ID in system init message
  const initEntry = entries.find(e => e.type === 'system' && e.subtype === 'init');
  if (initEntry && 'sessionId' in initEntry) {
    return initEntry.sessionId;
  }

  // Fallback: look for sessionId in any entry
  for (const entry of entries) {
    if ('sessionId' in entry && typeof entry.sessionId === 'string') {
      return entry.sessionId;
    }
  }

  return null;
}

/**
 * Print validation report
 */
export function printValidationReport(result: ResumeValidationResult): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Session Resume Validation Report');
  console.log('='.repeat(60));
  console.log(`Session ID: ${result.sessionId}`);
  console.log(`Entry Count: ${result.entryCount}`);
  console.log(`Resume Status: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`AI Responded: ${result.aiResponded ? '✅ YES' : '❌ NO'}`);

  if (result.error) {
    console.log(`\n❌ Error: ${result.error}`);
  }

  if (result.response) {
    console.log(`\n💬 AI Response:`);
    console.log(`   ${result.response.substring(0, 300)}${result.response.length > 300 ? '...' : ''}`);
  }

  console.log(`\n⏰ Validated at: ${result.timestamp}`);
  console.log('='.repeat(60) + '\n');
}
