/**
 * REST API Route Handlers
 *
 * Provides endpoints for:
 * - OBSERVE: Session listing, analysis, validation
 * - DUPLICATE: Session cloning and forking
 * - OPTIMIZE: Context distillation
 * - MODIFY: Entry editing
 * - BUILD: Session creation
 * - FABRICATE: Conversation generation
 */

import type { JSONLParser } from '../../services/jsonl-parser';
import type { ConversationBuilder } from '../../services/conversation-builder';
import type { StepAnalyzer } from '../../services/step-analyzer';
import type { SessionManager } from '../../services/session-manager';
import type { ConversationValidator } from '../../validators';
import type { ContextDistiller } from '../../services/context-distiller';
import type { ConversationEntry } from '../../types/claude-conversation';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { stat } from 'fs/promises';

// Import web services
import { sessionCloner } from '../services/session-cloner';
import { entryEditor } from '../services/entry-editor';
import { createSession, ConversationFactory } from '../services/session-builder';
import { conversationGenerator } from '../services/conversation-generator';
import { agentSDKBridge } from '../services/agent-sdk-bridge';
import { MultiAgentOptimizer } from '../../services/multi-agent-optimizer';

export interface APIContext {
  parser: JSONLParser;
  conversationBuilder: ConversationBuilder;
  stepAnalyzer: StepAnalyzer;
  sessionManager: SessionManager;
  validator: ConversationValidator;
  contextDistiller: ContextDistiller;
}

// Route matcher type
type RouteHandler = (
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
) => Promise<Response>;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

// Parse route pattern into regex
function parseRoute(method: string, path: string, handler: RouteHandler): Route {
  const paramNames: string[] = [];
  const pattern = path.replace(/:(\w+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });

  return {
    method,
    pattern: new RegExp(`^${pattern}$`),
    paramNames,
    handler,
  };
}

// =============================================================================
// OBSERVE Handlers - Read-only analysis
// =============================================================================

/**
 * GET /api/projects - List all projects with sessions
 */
async function listProjects(
  _req: Request,
  _params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const claudeDir = join(homedir(), '.claude', 'projects');

  try {
    const projects: Array<{
      name: string;
      path: string;
      sessionCount: number;
      lastModified: Date;
    }> = [];

    // Read projects directory
    const entries = await Array.fromAsync(
      new Bun.Glob('*').scan({ cwd: claudeDir, onlyFiles: false })
    );

    for (const entry of entries) {
      const projectPath = join(claudeDir, entry);

      // Check if this is a directory using fs.stat
      try {
        const stats = await stat(projectPath);
        if (!stats.isDirectory()) {
          continue;
        }
      } catch {
        // Skip if stat fails
        continue;
      }

      // Count JSONL files
      const sessions = await Array.fromAsync(
        new Bun.Glob('*.jsonl').scan({ cwd: projectPath })
      );

      // Decode project name - directory names have / replaced with -
      let decodedName = entry;
      if (entry.startsWith('-')) {
        // Path-style encoding: -Users-ronaldeddings-Project -> /Users/ronaldeddings/Project
        decodedName = entry.replace(/-/g, '/');
      }

      projects.push({
        name: decodedName,
        path: entry,
        sessionCount: sessions.length,
        lastModified: new Date(),
      });
    }

    return Response.json({ projects });
  } catch (error) {
    return Response.json(
      { error: 'Failed to list projects', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions - List all sessions
 */
async function listSessions(
  req: Request,
  _params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const url = new URL(req.url);
  const project = url.searchParams.get('project');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  const claudeDir = join(homedir(), '.claude', 'projects');

  try {
    const sessions: Array<{
      id: string;
      project: string;
      projectPath: string;
      filePath: string;
      size: number;
      modifiedAt: Date;
      entryCount?: number;
    }> = [];

    // Get project directories to search
    const projectDirs = project
      ? [project]
      : await Array.fromAsync(
          new Bun.Glob('*').scan({ cwd: claudeDir, onlyFiles: false })
        );

    for (const projectDir of projectDirs) {
      const projectPath = join(claudeDir, projectDir);

      // Get JSONL files in this project
      const files = await Array.fromAsync(
        new Bun.Glob('*.jsonl').scan({ cwd: projectPath })
      );

      for (const file of files) {
        const filePath = join(projectPath, file);
        const bunFile = Bun.file(filePath);

        if (await bunFile.exists()) {
          const sessionId = file.replace('.jsonl', '');

          // Decode project name - directory names have / replaced with -
          let decodedProject = projectDir;
          if (projectDir.startsWith('-')) {
            // Path-style encoding: -Users-ronaldeddings-Project -> /Users/ronaldeddings/Project
            decodedProject = projectDir.replace(/-/g, '/');
          }

          sessions.push({
            id: sessionId,
            project: decodedProject,
            projectPath: projectDir,
            filePath,
            size: bunFile.size,
            modifiedAt: new Date(bunFile.lastModified),
          });
        }
      }
    }

    // Sort by modified date, newest first
    sessions.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

    // Apply pagination
    const paginated = sessions.slice(offset, offset + limit);

    return Response.json({
      sessions: paginated,
      total: sessions.length,
      limit,
      offset,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to list sessions', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/:id - Get session details
 */
async function getSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;
  const url = new URL(req.url);
  const projectPath = url.searchParams.get('project');

  try {
    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);
    const file = Bun.file(filePath);

    return Response.json({
      id,
      filePath,
      size: file.size,
      modifiedAt: new Date(file.lastModified),
      entryCount: entries.length,
      entries: entries.slice(0, 100), // First 100 entries
      hasMore: entries.length > 100,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get session', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/:id/entries - Get session entries with pagination
 */
async function getEntries(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;
  const url = new URL(req.url);
  const projectPath = url.searchParams.get('project');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const type = url.searchParams.get('type'); // Filter by entry type

  try {
    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    let entries = await ctx.parser.parseFileToArray(filePath);

    // Filter by type if specified
    if (type) {
      entries = entries.filter(e => e.type === type);
    }

    const total = entries.length;
    const paginated = entries.slice(offset, offset + limit);

    return Response.json({
      entries: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get entries', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/:id/entries/:index - Get single entry
 */
async function getEntry(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id, index } = params;
  const url = new URL(req.url);
  const projectPath = url.searchParams.get('project');

  try {
    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);
    const idx = parseInt(index);

    if (idx < 0 || idx >= entries.length) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }

    return Response.json({
      index: idx,
      entry: entries[idx],
      total: entries.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to get entry', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/:id/analyze - Comprehensive session analysis
 */
async function analyzeSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;
  const url = new URL(req.url);
  const projectPath = url.searchParams.get('project');

  try {
    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Parse the file to get entries
    const entries = await ctx.parser.parseFileToArray(filePath);

    // Run comprehensive analysis
    const rawAnalysis = ctx.stepAnalyzer.analyzeConversation(entries);

    // Count message types and tool calls for frontend
    let userMessages = 0;
    let assistantMessages = 0;
    let toolCalls = 0;
    const toolUsage: Record<string, number> = {};

    for (const entry of entries) {
      if (entry.type === 'user') userMessages++;
      if (entry.type === 'assistant') {
        assistantMessages++;
        if ('message' in entry && Array.isArray(entry.message.content)) {
          for (const content of entry.message.content) {
            if (content.type === 'tool_use') {
              toolCalls++;
              toolUsage[content.name] = (toolUsage[content.name] || 0) + 1;
            }
          }
        }
      }
    }

    // Transform to frontend-expected format
    const analysis = {
      totalEntries: rawAnalysis.summary.totalEntries,
      userMessages,
      assistantMessages,
      toolCalls,
      tokens: {
        input: rawAnalysis.costs?.inputTokens || 0,
        output: rawAnalysis.costs?.outputTokens || 0,
      },
      estimatedCost: rawAnalysis.costs?.totalCost || 0,
      toolUsage,
      // Include raw analysis for advanced views
      raw: rawAnalysis,
    };

    return Response.json({
      id,
      analysis,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to analyze session', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sessions/:id/validate - 4-layer validation
 */
async function validateSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;
  const url = new URL(req.url);
  const projectPath = url.searchParams.get('project');
  const quick = url.searchParams.get('quick') === 'true';

  try {
    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);

    // Run validation
    const rawValidation = quick
      ? ctx.validator.quickValidate(entries)
      : await ctx.validator.validateConversation(entries);

    // Transform to frontend-expected format with layers array
    const layers = [];
    const allErrors: string[] = [];

    if (rawValidation.validationResults) {
      const results = rawValidation.validationResults;

      // Schema validation layer
      if (results.schema) {
        const schemaErrors = results.schema.errors || [];
        const schemaWarnings = results.schema.warnings || [];
        layers.push({
          name: 'Schema Validation',
          status: results.schema.isValid ? 'valid' : 'invalid',
          message: results.schema.isValid ? 'All entries have valid schema' : `${schemaErrors.length} schema errors`,
          errors: schemaErrors,
          warnings: schemaWarnings,
        });
        allErrors.push(...schemaErrors);
      }

      // Relationships validation layer
      if (results.relationships) {
        const relIssues = results.relationships.summary?.totalIssues || 0;
        layers.push({
          name: 'Relationship Validation',
          status: results.relationships.isValid ? 'valid' : 'invalid',
          message: results.relationships.isValid ? 'All relationships valid' : `${relIssues} relationship issues`,
          errors: results.relationships.treeStructure?.issues || [],
          warnings: [],
        });
        if (results.relationships.treeStructure?.issues) {
          allErrors.push(...results.relationships.treeStructure.issues);
        }
      }

      // Tool usage validation layer
      if (results.toolUsage) {
        const toolIssues = results.toolUsage.invalidToolUses || [];
        layers.push({
          name: 'Tool Usage Validation',
          status: results.toolUsage.isValid ? 'valid' : 'invalid',
          message: results.toolUsage.isValid ? 'All tool uses valid' : `${toolIssues.length} invalid tool uses`,
          errors: toolIssues.map((t: { toolName: string; issue: string }) => `${t.toolName}: ${t.issue}`),
          warnings: [],
        });
      }

      // Completeness validation layer
      if (results.completeness) {
        layers.push({
          name: 'Completeness Check',
          status: results.completeness.isValid ? 'valid' : 'invalid',
          message: results.completeness.isValid ? 'Conversation is complete' : 'Incomplete conversation',
          errors: results.completeness.issues || [],
          warnings: [],
        });
      }
    }

    const validation = {
      isValid: rawValidation.isValid,
      summary: rawValidation.summary,
      layers,
      errors: allErrors.slice(0, 20), // Limit to first 20 errors for display
      raw: rawValidation,
    };

    return Response.json({
      id,
      validation,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to validate session', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// DUPLICATE Handlers - Clone and fork sessions
// =============================================================================

/**
 * POST /api/sessions/:id/clone - Clone a session
 */
async function cloneSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;

  try {
    const body = await req.json() as {
      project?: string;
      targetProject?: string;
      regenerateUuids?: boolean;
      filterType?: string;
      startIndex?: number;
      endIndex?: number;
    };

    const sourcePath = await findSessionFile(id, body.project);
    if (!sourcePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Read source entries
    let entries = await ctx.parser.parseFileToArray(sourcePath);

    // Apply filters if specified
    if (body.filterType) {
      entries = entries.filter(e => e.type === body.filterType);
    }

    if (body.startIndex !== undefined || body.endIndex !== undefined) {
      const start = body.startIndex || 0;
      const end = body.endIndex || entries.length;
      entries = entries.slice(start, end);
    }

    // Regenerate UUIDs if requested
    if (body.regenerateUuids) {
      entries = regenerateUuids(entries);
    }

    // Generate new session ID
    const newSessionId = crypto.randomUUID();

    // Determine target path
    const targetProject = body.targetProject || body.project || getProjectFromPath(sourcePath);
    const claudeDir = join(homedir(), '.claude', 'projects');
    const targetPath = join(claudeDir, targetProject, `${newSessionId}.jsonl`);

    // Write cloned session
    await writeJSONL(targetPath, entries);

    return Response.json({
      success: true,
      originalId: id,
      newId: newSessionId,
      targetPath,
      entryCount: entries.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to clone session', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions/:id/fork - Fork session at specific entry
 */
async function forkSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;

  try {
    const body = await req.json() as {
      project?: string;
      forkAtIndex: number;
      targetProject?: string;
    };

    if (body.forkAtIndex === undefined) {
      return Response.json({ error: 'forkAtIndex is required' }, { status: 400 });
    }

    const sourcePath = await findSessionFile(id, body.project);
    if (!sourcePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Read and slice entries
    const entries = await ctx.parser.parseFileToArray(sourcePath);

    if (body.forkAtIndex < 0 || body.forkAtIndex >= entries.length) {
      return Response.json({ error: 'Invalid fork index' }, { status: 400 });
    }

    const forkedEntries = entries.slice(0, body.forkAtIndex + 1);

    // Generate new session ID
    const newSessionId = crypto.randomUUID();

    // Determine target path
    const targetProject = body.targetProject || body.project || getProjectFromPath(sourcePath);
    const claudeDir = join(homedir(), '.claude', 'projects');
    const targetPath = join(claudeDir, targetProject, `${newSessionId}.jsonl`);

    // Write forked session
    await writeJSONL(targetPath, forkedEntries);

    return Response.json({
      success: true,
      originalId: id,
      newId: newSessionId,
      forkAtIndex: body.forkAtIndex,
      targetPath,
      entryCount: forkedEntries.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fork session', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// OPTIMIZE Handlers - Context reduction
// =============================================================================

/**
 * POST /api/sessions/:id/optimize - Optimize session context
 *
 * Performs context optimization by:
 * 1. Reading the session entries
 * 2. Using AI agents (if numAgents > 1) or rule-based scoring for optimization
 * 3. Creating a new optimized session file
 */
async function optimizeSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;

  try {
    const body = await req.json() as {
      project?: string;
      strategy?: 'comprehensive' | 'minimal' | 'technical';
      targetTokens?: number;
      numAgents?: number;
      customPrompt?: string | null;
      preserveToolResults?: boolean;
      preserveCodeExamples?: boolean;
      aggressiveCompression?: boolean;
    };

    const filePath = await findSessionFile(id, body.project);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Read all entries from the session file
    const entries: ConversationEntry[] = [];
    const content = await Bun.file(filePath).text();
    for (const line of content.split('\n')) {
      if (line.trim()) {
        try {
          entries.push(JSON.parse(line));
        } catch {
          // Skip malformed lines
        }
      }
    }

    if (entries.length === 0) {
      return Response.json({ error: 'Session has no entries' }, { status: 400 });
    }

    // Calculate original token count
    const originalTokens = entries.reduce((acc, entry) => {
      const text = JSON.stringify(entry);
      return acc + Math.ceil(text.length / 4); // Rough token estimate
    }, 0);

    const numAgents = body.numAgents || 1;
    const preserveToolResults = body.preserveToolResults ?? true;
    const preserveCodeExamples = body.preserveCodeExamples ?? true;
    const aggressiveCompression = body.aggressiveCompression ?? false;

    let selectedEntries: ConversationEntry[];
    let agentInfo = '';

    // Use multi-agent optimization if numAgents > 1
    if (numAgents > 1) {
      console.log(`🤖 Running multi-agent optimization with ${numAgents} agents...`);

      try {
        const optimizer = new MultiAgentOptimizer({
          agentCount: numAgents,
          maxTokensPerChunk: body.targetTokens || 20000,
          customPrompt: body.customPrompt || '',
          model: 'sonnet',
          verbose: true,
        });

        const result = await optimizer.optimizeConversation(entries);
        selectedEntries = result.optimizedEntries;

        // Calculate tokens from the stats (RecalculationStats uses different field names)
        const statsOriginal = result.stats.originalInputTokens + result.stats.originalOutputTokens;
        const statsOptimized = result.stats.totalInputTokens + result.stats.totalOutputTokens;
        const statsReduction = statsOriginal > 0 ? Math.round((1 - statsOptimized / statsOriginal) * 100) : 0;

        agentInfo = `\n\n🤖 Multi-agent optimization completed:\n- Agents used: ${numAgents}\n- Execution time: ${result.executionTimeMs}ms\n- Original tokens: ${statsOriginal}\n- Optimized tokens: ${statsOptimized}\n- Reduction: ${statsReduction}%`;

        console.log(`✅ Multi-agent optimization complete: ${statsOriginal} → ${statsOptimized} tokens`);
      } catch (agentError) {
        console.error('Multi-agent optimization failed, falling back to rule-based:', agentError);
        // Fall back to rule-based optimization
        selectedEntries = await runRuleBasedOptimization(entries, body, preserveToolResults, preserveCodeExamples, aggressiveCompression);
        agentInfo = '\n\n⚠️ Multi-agent optimization failed, used rule-based fallback';
      }
    } else {
      // Use simple rule-based optimization
      selectedEntries = await runRuleBasedOptimization(entries, body, preserveToolResults, preserveCodeExamples, aggressiveCompression);
    }

    // Calculate optimized token count
    const optimizedTokens = selectedEntries.reduce((acc, entry) => {
      const text = JSON.stringify(entry);
      return acc + Math.ceil(text.length / 4);
    }, 0);

    const reduction = originalTokens > 0
      ? Math.round((1 - optimizedTokens / originalTokens) * 100)
      : 0;

    // Generate a new session ID for the optimized version
    const curatedSessionId = `${id}-optimized-${Date.now()}`;

    // Get the project directory from the file path
    const projectDir = dirname(filePath);
    const curatedFilePath = join(projectDir, `${curatedSessionId}.jsonl`);

    // Write the curated session file
    const curatedContent = selectedEntries
      .map(entry => JSON.stringify({
        ...entry,
        sessionId: curatedSessionId,
        optimizedFrom: id,
        optimizationStrategy: body.strategy || 'comprehensive',
      }))
      .join('\n');

    await Bun.write(curatedFilePath, curatedContent);

    return Response.json({
      id,
      optimization: {
        originalTokens,
        optimizedTokens,
        reduction,
        originalMessages: entries.length,
        curatedMessages: selectedEntries.length,
        curatedSessionId,
        curatedFilePath,
        strategy: body.strategy || 'comprehensive',
        numAgents,
        preserveToolResults,
        preserveCodeExamples,
        aggressiveCompression,
        context: `Optimized session created: ${curatedSessionId}\n\nReduced from ${entries.length} to ${selectedEntries.length} messages (${reduction}% token reduction)\n\nStrategy: ${body.strategy || 'comprehensive'}${body.customPrompt ? '\nCustom prompt applied' : ''}${agentInfo}`,
      },
    });
  } catch (error) {
    console.error('Optimize error:', error);
    return Response.json(
      { error: 'Failed to optimize session', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Rule-based optimization using scoring algorithm
 */
async function runRuleBasedOptimization(
  entries: ConversationEntry[],
  body: {
    strategy?: 'comprehensive' | 'minimal' | 'technical';
    customPrompt?: string | null;
  },
  preserveToolResults: boolean,
  preserveCodeExamples: boolean,
  aggressiveCompression: boolean
): Promise<ConversationEntry[]> {
  // Strategy-specific configuration
  let maxMessages: number;
  let prioritizeKeywords: string[];

  switch (body.strategy) {
    case 'minimal':
      maxMessages = aggressiveCompression ? 5 : 10;
      prioritizeKeywords = ['essential', 'critical', 'important', 'key', 'must', 'required'];
      break;
    case 'technical':
      maxMessages = aggressiveCompression ? 15 : 30;
      prioritizeKeywords = ['code', 'function', 'class', 'api', 'database', 'schema', 'implementation', 'error', 'fix', 'bug'];
      break;
    case 'comprehensive':
    default:
      maxMessages = aggressiveCompression ? 25 : 50;
      prioritizeKeywords = ['structure', 'purpose', 'organization', 'content', 'key', 'important', 'main', 'summary', 'overview'];
      break;
  }

  // Add custom prompt keywords if provided
  if (body.customPrompt) {
    const customKeywords = body.customPrompt
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3);
    prioritizeKeywords = [...prioritizeKeywords, ...customKeywords];
  }

  // Filter and score entries
  const scoredEntries = entries.map((entry: any, index: number) => {
    let score = 0;
    const entryText = JSON.stringify(entry).toLowerCase();

    // Score based on entry type
    if (entry.type === 'user') score += 10;
    if (entry.type === 'assistant') score += 8;
    if (entry.type === 'summary') score += 15;
    if (entry.type === 'result') score += preserveToolResults ? 5 : 0;

    // Score based on keywords
    for (const keyword of prioritizeKeywords) {
      if (entryText.includes(keyword)) {
        score += 2;
      }
    }

    // Code examples get bonus if preserveCodeExamples is true
    if (preserveCodeExamples) {
      if (entryText.includes('```') || entryText.includes('function') || entryText.includes('class')) {
        score += 5;
      }
    }

    // Position bonus - later messages often have more resolution
    score += Math.floor(index / entries.length * 3);

    // Tool use gets bonus if preserving tool results
    if (preserveToolResults && entry.message?.content) {
      const hasToolUse = Array.isArray(entry.message.content) &&
        entry.message.content.some((c: any) => c.type === 'tool_use' || c.type === 'tool_result');
      if (hasToolUse) score += 3;
    }

    return { entry, score, index };
  });

  // Sort by score and take top entries
  scoredEntries.sort((a, b) => b.score - a.score);
  return scoredEntries
    .slice(0, maxMessages)
    .sort((a, b) => a.index - b.index)
    .map(se => se.entry);
}

// =============================================================================
// MODIFY Handlers - Edit entries
// =============================================================================

/**
 * PUT /api/sessions/:id/entries/:index - Update an entry
 */
async function updateEntry(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id, index } = params;

  try {
    const body = await req.json() as {
      project?: string;
      entry: Partial<ConversationEntry>;
    };

    const filePath = await findSessionFile(id, body.project);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);
    const idx = parseInt(index);

    if (idx < 0 || idx >= entries.length) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Merge update with existing entry
    const updatedEntry = { ...entries[idx], ...body.entry } as ConversationEntry;

    // Validate the updated entry
    const validation = ctx.validator.quickValidate([updatedEntry]);
    if (!validation.isValid) {
      return Response.json({
        error: 'Invalid entry',
        validation,
      }, { status: 400 });
    }

    // Update and save
    entries[idx] = updatedEntry;
    await writeJSONL(filePath, entries);

    return Response.json({
      success: true,
      index: idx,
      entry: updatedEntry,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to update entry', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions/:id/entries - Insert a new entry
 */
async function insertEntry(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;

  try {
    const body = await req.json() as {
      project?: string;
      entry: ConversationEntry;
      index?: number;
    };

    const filePath = await findSessionFile(id, body.project);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);

    // Validate the new entry
    const validation = ctx.validator.quickValidate([body.entry]);
    if (!validation.isValid) {
      return Response.json({
        error: 'Invalid entry',
        validation,
      }, { status: 400 });
    }

    // Insert at specified index or append
    const insertIndex = body.index !== undefined ? body.index : entries.length;
    entries.splice(insertIndex, 0, body.entry);

    // Save
    await writeJSONL(filePath, entries);

    return Response.json({
      success: true,
      index: insertIndex,
      entry: body.entry,
      total: entries.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to insert entry', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sessions/:id/entries/:index - Delete an entry
 */
async function deleteEntry(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id, index } = params;

  try {
    const url = new URL(req.url);
    const projectPath = url.searchParams.get('project');

    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);
    const idx = parseInt(index);

    if (idx < 0 || idx >= entries.length) {
      return Response.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Remove entry
    const deleted = entries.splice(idx, 1)[0];

    // Save
    await writeJSONL(filePath, entries);

    return Response.json({
      success: true,
      deletedIndex: idx,
      deletedEntry: deleted,
      total: entries.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete entry', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// BUILD Handlers - Create sessions
// =============================================================================

/**
 * POST /api/sessions - Create a new session
 */
async function createSessionHandler(
  req: Request,
  _params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  try {
    const body = await req.json() as {
      project: string;
      entries?: ConversationEntry[];
      systemPrompt?: string;
      messages?: Array<{ type: 'user' | 'assistant'; content: string }>;
    };

    if (!body.project) {
      return Response.json({ error: 'project is required' }, { status: 400 });
    }

    // Generate session ID
    const sessionId = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;

    // Initialize entries
    const entries: ConversationEntry[] = body.entries || [];

    // Add system prompt if provided
    if (body.systemPrompt) {
      entries.push({
        type: 'system',
        uuid: crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`,
        timestamp: new Date().toISOString(),
        sessionId,
        message: {
          role: 'system',
          content: body.systemPrompt,
        },
      } as ConversationEntry);
    }

    // Process messages array if provided
    if (body.messages && Array.isArray(body.messages)) {
      let parentUuid: string | undefined = entries.length > 0 ? (entries[entries.length - 1] as any).uuid : undefined;

      for (const msg of body.messages) {
        const entryUuid = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;

        if (msg.type === 'user') {
          entries.push({
            type: 'user',
            uuid: entryUuid,
            parentUuid,
            timestamp: new Date().toISOString(),
            sessionId,
            message: {
              role: 'user',
              content: [{ type: 'text', text: msg.content }],
            },
          } as ConversationEntry);
        } else if (msg.type === 'assistant') {
          entries.push({
            type: 'assistant',
            uuid: entryUuid,
            parentUuid,
            timestamp: new Date().toISOString(),
            sessionId,
            message: {
              id: `msg_${crypto.randomUUID().replace(/-/g, '').substring(0, 24)}`,
              role: 'assistant',
              content: [{ type: 'text', text: msg.content }],
            },
          } as ConversationEntry);
        }

        parentUuid = entryUuid;
      }
    }

    // Encode project path
    const encodedProject = Buffer.from(body.project).toString('base64').replace(/\//g, '-');
    const claudeDir = join(homedir(), '.claude', 'projects');
    const projectDir = join(claudeDir, encodedProject);

    // Ensure project directory exists
    await Bun.$`mkdir -p ${projectDir}`;

    // Write session file
    const filePath = join(projectDir, `${sessionId}.jsonl`);
    await writeJSONL(filePath, entries);

    return Response.json({
      success: true,
      id: sessionId,
      project: body.project,
      filePath,
      entryCount: entries.length,
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to create session', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions/:id/entries/user - Add user message
 */
async function addUserMessage(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;

  try {
    const body = await req.json() as {
      project?: string;
      content: string;
      parentUuid?: string;
    };

    const filePath = await findSessionFile(id, body.project);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);

    // Create user message entry
    const entry: ConversationEntry = {
      type: 'user',
      uuid: crypto.randomUUID(),
      parentUuid: body.parentUuid || entries[entries.length - 1]?.uuid,
      timestamp: new Date().toISOString(),
      sessionId: id,
      message: {
        role: 'user',
        content: [{ type: 'text', text: body.content }],
      },
    } as ConversationEntry;

    entries.push(entry);
    await writeJSONL(filePath, entries);

    return Response.json({
      success: true,
      entry,
      index: entries.length - 1,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to add user message', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions/:id/entries/assistant - Add assistant message
 */
async function addAssistantMessage(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;

  try {
    const body = await req.json() as {
      project?: string;
      content: string;
      toolUse?: Array<{ name: string; input: Record<string, unknown> }>;
      parentUuid?: string;
    };

    const filePath = await findSessionFile(id, body.project);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);

    // Build content blocks
    const contentBlocks: Array<{ type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> }> = [];

    if (body.content) {
      contentBlocks.push({ type: 'text', text: body.content });
    }

    if (body.toolUse) {
      for (const tool of body.toolUse) {
        contentBlocks.push({
          type: 'tool_use',
          id: `toolu_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`,
          name: tool.name,
          input: tool.input,
        });
      }
    }

    // Create assistant message entry
    const entry: ConversationEntry = {
      type: 'assistant',
      uuid: crypto.randomUUID(),
      parentUuid: body.parentUuid || entries[entries.length - 1]?.uuid,
      timestamp: new Date().toISOString(),
      sessionId: id,
      message: {
        role: 'assistant',
        content: contentBlocks,
      },
    } as ConversationEntry;

    entries.push(entry);
    await writeJSONL(filePath, entries);

    return Response.json({
      success: true,
      entry,
      index: entries.length - 1,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to add assistant message', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// EXPORT Handlers
// =============================================================================

/**
 * GET /api/sessions/:id/export - Export session
 */
async function exportSession(
  req: Request,
  params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  const { id } = params;
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'json';
  const projectPath = url.searchParams.get('project');

  try {
    const filePath = await findSessionFile(id, projectPath);
    if (!filePath) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    const entries = await ctx.parser.parseFileToArray(filePath);

    switch (format) {
      case 'json':
        return Response.json(entries, {
          headers: {
            'Content-Disposition': `attachment; filename="${id}.json"`,
          },
        });

      case 'markdown':
        const markdown = entriesToMarkdown(entries);
        return new Response(markdown, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': `attachment; filename="${id}.md"`,
          },
        });

      case 'jsonl':
        const jsonl = entries.map(e => JSON.stringify(e)).join('\n');
        return new Response(jsonl, {
          headers: {
            'Content-Type': 'application/jsonl; charset=utf-8',
            'Content-Disposition': `attachment; filename="${id}.jsonl"`,
          },
        });

      default:
        return Response.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      { error: 'Failed to export session', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// FABRICATE Handlers - DSL-based session creation
// =============================================================================

/**
 * Parse DSL syntax into conversation entries
 *
 * Supports multiple formats:
 * 1. Inline: @system "Your content here"
 * 2. Multiline: @system followed by content on next lines until next @directive
 * 3. Triple quotes: @system """ followed by content and closing """
 */
function parseDSL(dsl: string): { entries: Array<{ type: string; content: string; toolName?: string; toolInput?: string; toolResult?: string }>; errors: string[] } {
  const entries: Array<{ type: string; content: string; toolName?: string; toolInput?: string; toolResult?: string }> = [];
  const errors: string[] = [];

  const lines = dsl.split('\n');
  let currentEntry: { type: string; content: string; toolName?: string; toolInput?: string; toolResult?: string } | null = null;
  let inTripleQuotes = false;
  let contentLines: string[] = [];

  const saveCurrentEntry = () => {
    if (currentEntry && contentLines.length > 0) {
      currentEntry.content = contentLines.join('\n').trim();
      if (currentEntry.content) {
        entries.push(currentEntry);
      }
    }
    currentEntry = null;
    contentLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments (only at start of parsing, not in content)
    if ((trimmed.startsWith('#') || trimmed.startsWith('//')) && !currentEntry) {
      continue;
    }

    // Handle triple quote end
    if (inTripleQuotes && trimmed === '"""') {
      saveCurrentEntry();
      inTripleQuotes = false;
      continue;
    }

    // Continue collecting content in triple quotes mode
    if (inTripleQuotes) {
      contentLines.push(line);
      continue;
    }

    // Check for @directive at start of line
    const directiveMatch = trimmed.match(/^@(system|user|assistant|tool)\b(.*)$/);

    if (directiveMatch) {
      // Save any previous entry
      saveCurrentEntry();

      const type = directiveMatch[1];
      const rest = directiveMatch[2].trim();

      // Handle inline quoted content: @system "content"
      const inlineMatch = rest.match(/^"(.+)"$/);
      if (inlineMatch) {
        entries.push({ type, content: inlineMatch[1] });
        continue;
      }

      // Handle triple quotes start: @system """
      if (rest === '"""') {
        currentEntry = { type, content: '' };
        inTripleQuotes = true;
        continue;
      }

      // Handle tool with inline result: @tool Read {"path": "x"} -> "result"
      if (type === 'tool') {
        const toolMatch = rest.match(/^(\w+)\s+(\{[^}]+\})\s*->\s*"(.+)"$/);
        if (toolMatch) {
          entries.push({
            type: 'tool',
            toolName: toolMatch[1],
            toolInput: toolMatch[2],
            toolResult: toolMatch[3],
            content: `${toolMatch[1]}: ${toolMatch[3]}`,
          });
          continue;
        }
      }

      // Handle bare directive with content on next lines: @system followed by content
      if (!rest) {
        currentEntry = { type, content: '' };
        continue;
      }

      // Handle inline unquoted content: @system Your content here
      if (rest && !rest.startsWith('"')) {
        entries.push({ type, content: rest });
        continue;
      }

      errors.push(`Line ${i + 1}: Invalid DSL syntax: ${trimmed.slice(0, 50)}`);
    } else if (currentEntry && !inTripleQuotes) {
      // Content line for current entry (not in triple quotes mode)
      if (trimmed || contentLines.length > 0) {
        contentLines.push(line);
      }
    }
  }

  // Save any remaining entry
  saveCurrentEntry();

  if (inTripleQuotes) {
    errors.push('Unclosed multiline string (missing closing """)');
  }

  return { entries, errors };
}

/**
 * POST /api/fabricate/parse - Parse DSL and return preview
 */
async function parseDSLHandler(
  req: Request,
  _params: Record<string, string>,
  _ctx: APIContext
): Promise<Response> {
  try {
    const body = await req.json() as { dsl: string };

    if (!body.dsl) {
      return Response.json({ error: 'dsl is required' }, { status: 400 });
    }

    const { entries, errors } = parseDSL(body.dsl);

    return Response.json({
      valid: errors.length === 0,
      entries,
      errors,
      entryCount: entries.length,
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to parse DSL', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fabricate - Create session from DSL
 */
async function fabricateSession(
  req: Request,
  _params: Record<string, string>,
  ctx: APIContext
): Promise<Response> {
  try {
    const body = await req.json() as { project: string; dsl: string };

    if (!body.project) {
      return Response.json({ error: 'project is required' }, { status: 400 });
    }

    if (!body.dsl) {
      return Response.json({ error: 'dsl is required' }, { status: 400 });
    }

    // Parse DSL
    const { entries: dslEntries, errors } = parseDSL(body.dsl);

    if (errors.length > 0) {
      return Response.json({ error: 'DSL parsing errors', errors }, { status: 400 });
    }

    if (dslEntries.length === 0) {
      return Response.json({ error: 'No valid entries in DSL' }, { status: 400 });
    }

    // Generate session ID
    const sessionId = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;

    // Convert DSL entries to JSONL entries
    const entries: ConversationEntry[] = [];
    let parentUuid: string | undefined;

    for (const dslEntry of dslEntries) {
      const entryUuid = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;

      if (dslEntry.type === 'system') {
        entries.push({
          type: 'system',
          uuid: entryUuid,
          timestamp: new Date().toISOString(),
          sessionId,
          message: {
            role: 'system',
            content: dslEntry.content,
          },
        } as ConversationEntry);
      } else if (dslEntry.type === 'user') {
        entries.push({
          type: 'user',
          uuid: entryUuid,
          parentUuid,
          timestamp: new Date().toISOString(),
          sessionId,
          message: {
            role: 'user',
            content: [{ type: 'text', text: dslEntry.content }],
          },
        } as ConversationEntry);
      } else if (dslEntry.type === 'assistant') {
        entries.push({
          type: 'assistant',
          uuid: entryUuid,
          parentUuid,
          timestamp: new Date().toISOString(),
          sessionId,
          message: {
            role: 'assistant',
            content: [{ type: 'text', text: dslEntry.content }],
          },
        } as ConversationEntry);
      } else if (dslEntry.type === 'tool' && dslEntry.toolName) {
        // Create assistant message with tool use
        const toolUseId = `toolu_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
        let toolInput = {};
        try {
          toolInput = JSON.parse(dslEntry.toolInput?.replace(/'/g, '"') || '{}');
        } catch {
          toolInput = { input: dslEntry.toolInput };
        }

        entries.push({
          type: 'assistant',
          uuid: entryUuid,
          parentUuid,
          timestamp: new Date().toISOString(),
          sessionId,
          message: {
            role: 'assistant',
            content: [{
              type: 'tool_use',
              id: toolUseId,
              name: dslEntry.toolName,
              input: toolInput,
            }],
          },
        } as ConversationEntry);

        // Create tool result
        const resultUuid = crypto.randomUUID() as `${string}-${string}-${string}-${string}-${string}`;
        entries.push({
          type: 'result',
          uuid: resultUuid,
          parentUuid: entryUuid,
          timestamp: new Date().toISOString(),
          sessionId,
          toolUseId,
          content: dslEntry.toolResult || '',
        } as ConversationEntry);
      }

      parentUuid = entryUuid;
    }

    // Determine target path
    const claudeDir = join(homedir(), '.claude', 'projects');
    const projectDir = body.project.startsWith('/')
      ? body.project.replace(/\//g, '-').slice(1)
      : body.project;
    const targetPath = join(claudeDir, projectDir, `${sessionId}.jsonl`);

    // Ensure directory exists and write
    await Bun.write(targetPath, entries.map(e => JSON.stringify(e)).join('\n') + '\n');

    return Response.json({
      success: true,
      session: {
        id: sessionId,
        project: body.project,
        filePath: targetPath,
        entryCount: entries.length,
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fabricate session', details: String(error) },
      { status: 500 }
    );
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Find session file by ID, searching across projects if needed
 */
async function findSessionFile(
  sessionId: string,
  projectPath?: string | null
): Promise<string | null> {
  const claudeDir = join(homedir(), '.claude', 'projects');

  // If project specified, look there directly
  if (projectPath) {
    const filePath = join(claudeDir, projectPath, `${sessionId}.jsonl`);
    if (await Bun.file(filePath).exists()) {
      return filePath;
    }
    return null;
  }

  // Search all projects
  const projects = await Array.fromAsync(
    new Bun.Glob('*').scan({ cwd: claudeDir, onlyFiles: false })
  );

  for (const project of projects) {
    const filePath = join(claudeDir, project, `${sessionId}.jsonl`);
    if (await Bun.file(filePath).exists()) {
      return filePath;
    }
  }

  return null;
}

/**
 * Get project directory name from file path
 */
function getProjectFromPath(filePath: string): string {
  const parts = filePath.split('/');
  // Get the directory name before the filename
  return parts[parts.length - 2];
}

/**
 * Write entries to JSONL file
 */
async function writeJSONL(filePath: string, entries: ConversationEntry[]): Promise<void> {
  const content = entries.map(e => JSON.stringify(e)).join('\n');
  await Bun.write(filePath, content);
}

/**
 * Regenerate UUIDs for all entries while maintaining relationships
 */
function regenerateUuids(entries: ConversationEntry[]): ConversationEntry[] {
  const uuidMap = new Map<string, string>();

  return entries.map(entry => {
    const newEntry = { ...entry };

    // Generate new UUID
    const oldUuid = (entry as { uuid?: string }).uuid;
    if (oldUuid) {
      const newUuid = crypto.randomUUID();
      uuidMap.set(oldUuid, newUuid);
      (newEntry as { uuid: string }).uuid = newUuid;
    }

    // Update parent UUID reference
    const parentUuid = (entry as { parentUuid?: string }).parentUuid;
    if (parentUuid && uuidMap.has(parentUuid)) {
      (newEntry as { parentUuid: string }).parentUuid = uuidMap.get(parentUuid)!;
    }

    return newEntry as ConversationEntry;
  });
}

/**
 * Convert entries to Markdown format
 */
function entriesToMarkdown(entries: ConversationEntry[]): string {
  const lines: string[] = ['# Conversation Export\n'];

  for (const entry of entries) {
    const timestamp = (entry as { timestamp?: string }).timestamp;
    const message = (entry as { message?: { role: string; content: unknown } }).message;

    if (message) {
      lines.push(`## ${message.role.toUpperCase()}`);
      if (timestamp) {
        lines.push(`*${timestamp}*\n`);
      }

      if (typeof message.content === 'string') {
        lines.push(message.content);
      } else if (Array.isArray(message.content)) {
        for (const block of message.content) {
          if (block.type === 'text') {
            lines.push(block.text);
          } else if (block.type === 'tool_use') {
            lines.push(`\n**Tool: ${block.name}**`);
            lines.push('```json');
            lines.push(JSON.stringify(block.input, null, 2));
            lines.push('```');
          } else if (block.type === 'tool_result') {
            lines.push('\n**Tool Result:**');
            lines.push('```');
            lines.push(String(block.content));
            lines.push('```');
          }
        }
      }

      lines.push('\n---\n');
    }
  }

  return lines.join('\n');
}

// =============================================================================
// Route Registration
// =============================================================================

const routes: Route[] = [
  // OBSERVE - Read-only
  parseRoute('GET', '/api/projects', listProjects),
  parseRoute('GET', '/api/sessions', listSessions),
  parseRoute('GET', '/api/sessions/:id', getSession),
  parseRoute('GET', '/api/sessions/:id/entries', getEntries),
  parseRoute('GET', '/api/sessions/:id/entries/:index', getEntry),
  parseRoute('GET', '/api/sessions/:id/analyze', analyzeSession),
  parseRoute('GET', '/api/sessions/:id/validate', validateSession),
  parseRoute('GET', '/api/sessions/:id/export', exportSession),

  // DUPLICATE - Clone/fork
  parseRoute('POST', '/api/sessions/:id/clone', cloneSession),
  parseRoute('POST', '/api/sessions/:id/fork', forkSession),

  // OPTIMIZE - Context reduction
  parseRoute('POST', '/api/sessions/:id/optimize', optimizeSession),

  // MODIFY - Edit entries
  parseRoute('PUT', '/api/sessions/:id/entries/:index', updateEntry),
  parseRoute('POST', '/api/sessions/:id/entries', insertEntry),
  parseRoute('DELETE', '/api/sessions/:id/entries/:index', deleteEntry),

  // BUILD - Create sessions
  parseRoute('POST', '/api/sessions', createSessionHandler),
  parseRoute('POST', '/api/sessions/:id/entries/user', addUserMessage),
  parseRoute('POST', '/api/sessions/:id/entries/assistant', addAssistantMessage),

  // FABRICATE - DSL-based session creation
  parseRoute('POST', '/api/fabricate/parse', parseDSLHandler),
  parseRoute('POST', '/api/fabricate', fabricateSession),
];

/**
 * Main API router
 */
export async function apiRouter(req: Request, ctx: APIContext): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  for (const route of routes) {
    if (route.method !== method) continue;

    const match = pathname.match(route.pattern);
    if (match) {
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });

      return route.handler(req, params, ctx);
    }
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}
