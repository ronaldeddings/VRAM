#!/usr/bin/env bun

/**
 * Claude Code Conversation Analyzer CLI
 * Comprehensive tool for analyzing Claude Code conversation history from JSONL files.
 */

import { Command } from 'commander';
import { resolve, basename } from 'path';
import { JSONLParser } from '../services/jsonl-parser.ts';
import { ConversationBuilder } from '../services/conversation-builder.ts';
import { StepAnalyzer } from '../services/step-analyzer.ts';
import type { 
  ConversationEntry, 
  SessionAnalysis,
  ConversationMetadata,
  StepSummary 
} from '../types/claude-conversation.ts';

const program = new Command();

program
  .name('conversation-analyzer')
  .description('Analyze Claude Code conversation history from JSONL files')
  .version('1.0.0');

// Analyze specific conversation
program
  .command('analyze')
  .description('Analyze a specific conversation by session ID or file path')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID/session ID to analyze')
  .option('-f, --format <type>', 'Output format (json|text|detailed)', 'text')
  .option('-p, --project-dir <path>', 'Project directory to search for conversations', process.env.HOME + '/.claude/projects')
  .action(async (options) => {
    try {
      const parser = new JSONLParser();
      const builder = new ConversationBuilder();
      const analyzer = new StepAnalyzer();
      
      // Find conversation file
      const conversationFile = await findConversationFile(options.conversationId, options.projectDir);
      if (!conversationFile) {
        console.error(`❌ Conversation not found: ${options.conversationId}`);
        process.exit(1);
      }
      
      console.log(`🔍 Analyzing conversation: ${basename(conversationFile)}`);
      
      // Parse entries
      const entries: ConversationEntry[] = [];
      for await (const entry of parser.parseFile(conversationFile)) {
        entries.push(entry);
      }
      
      if (entries.length === 0) {
        console.error(`❌ No entries found in conversation file`);
        process.exit(1);
      }
      
      // Build conversation structure
      const conversation = builder.buildConversationChain(entries);
      const actionSequence = builder.extractActionSequence(entries);
      
      // Analyze conversation
      const analysis = await analyzer.analyzeConversation(entries);
      
      // Output results
      switch (options.format) {
        case 'json':
          console.log(JSON.stringify({
            conversation,
            actionSequence,
            analysis
          }, null, 2));
          break;
        case 'detailed':
          printDetailedAnalysis(analysis, conversation, actionSequence);
          break;
        default:
          printTextAnalysis(analysis, conversation);
      }
      
    } catch (error) {
      console.error(`❌ Analysis failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

// List conversations
program
  .command('list')
  .description('List all conversations in project directories')
  .option('-p, --project-dir <path>', 'Project directory to search', process.env.HOME + '/.claude/projects')
  .option('-f, --format <type>', 'Output format (table|json|simple)', 'table')
  .option('--recent <days>', 'Show conversations from last N days', '30')
  .action(async (options) => {
    try {
      const conversations = await discoverConversations(options.projectDir, parseInt(options.recent));
      
      if (conversations.length === 0) {
        console.log('📭 No conversations found');
        return;
      }
      
      switch (options.format) {
        case 'json':
          console.log(JSON.stringify(conversations, null, 2));
          break;
        case 'simple':
          conversations.forEach(conv => {
            console.log(`${conv.sessionId} (${conv.projectPath})`);
          });
          break;
        default:
          printConversationTable(conversations);
      }
      
    } catch (error) {
      console.error(`❌ Failed to list conversations: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

// Extract action steps
program
  .command('steps')
  .description('Extract and display action sequence from conversation')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID to analyze')
  .option('-p, --project-dir <path>', 'Project directory to search', process.env.HOME + '/.claude/projects')
  .option('-f, --format <type>', 'Output format (list|timeline|json)', 'list')
  .option('--tools-only', 'Show only tool usage steps')
  .action(async (options) => {
    try {
      const parser = new JSONLParser();
      const builder = new ConversationBuilder();
      
      const conversationFile = await findConversationFile(options.conversationId, options.projectDir);
      if (!conversationFile) {
        console.error(`❌ Conversation not found: ${options.conversationId}`);
        process.exit(1);
      }
      
      const entries: ConversationEntry[] = [];
      for await (const entry of parser.parseFile(conversationFile)) {
        entries.push(entry);
      }
      
      const actionSequence = builder.extractActionSequence(entries);
      let steps = actionSequence;
      
      if (options.toolsOnly) {
        steps = steps.filter(step => step.type === 'tool_use');
      }
      
      switch (options.format) {
        case 'json':
          console.log(JSON.stringify(steps, null, 2));
          break;
        case 'timeline':
          printTimelineSteps(steps);
          break;
        default:
          printStepsList(steps);
      }
      
    } catch (error) {
      console.error(`❌ Failed to extract steps: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

// Export conversation data
program
  .command('export')
  .description('Export conversation data in various formats')
  .requiredOption('-c, --conversation-id <id>', 'Conversation ID to export')
  .option('-p, --project-dir <path>', 'Project directory to search', process.env.HOME + '/.claude/projects')
  .option('-f, --format <type>', 'Export format (json|markdown|csv)', 'json')
  .option('-o, --output <file>', 'Output file path')
  .action(async (options) => {
    try {
      const parser = new JSONLParser();
      const builder = new ConversationBuilder();
      const analyzer = new StepAnalyzer();
      
      const conversationFile = await findConversationFile(options.conversationId, options.projectDir);
      if (!conversationFile) {
        console.error(`❌ Conversation not found: ${options.conversationId}`);
        process.exit(1);
      }
      
      const entries: ConversationEntry[] = [];
      for await (const entry of parser.parseFile(conversationFile)) {
        entries.push(entry);
      }
      
      const conversation = builder.buildConversationChain(entries);
      const analysis = await analyzer.analyzeConversation(entries);
      
      let output: string;
      
      switch (options.format) {
        case 'markdown':
          output = generateMarkdownReport(conversation, analysis);
          break;
        case 'csv':
          output = generateCSVReport(analysis);
          break;
        default:
          output = JSON.stringify({
            metadata: {
              sessionId: conversation.sessionId,
              exportDate: new Date().toISOString(),
              entryCount: entries.length
            },
            conversation,
            analysis
          }, null, 2);
      }
      
      if (options.output) {
        await Bun.write(options.output, output);
        console.log(`📄 Exported to: ${options.output}`);
      } else {
        console.log(output);
      }
      
    } catch (error) {
      console.error(`❌ Export failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

// Validate JSONL structure
program
  .command('validate')
  .description('Validate JSONL conversation file structure')
  .requiredOption('-f, --file <path>', 'JSONL file path to validate')
  .option('--strict', 'Enable strict validation mode')
  .action(async (options) => {
    try {
      const parser = new JSONLParser();
      
      console.log(`🔍 Validating: ${options.file}`);
      
      let entryCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      for await (const entry of parser.parseFile(options.file)) {
        entryCount++;
        // Basic validation is handled by parser
      }
      
      const metadata = await parser.extractMetadata(options.file);
      
      console.log(`✅ Validation complete:`);
      console.log(`   📊 Entries: ${entryCount}`);
      console.log(`   📁 Session: ${metadata.sessionId}`);
      console.log(`   💾 Size: ${(metadata.size / 1024).toFixed(1)}KB`);
      console.log(`   🛠️  Tools: ${metadata.toolsUsed?.join(', ') || 'none'}`);
      console.log(`   ✨ Success: ${metadata.completedSuccessfully ? 'Yes' : 'No'}`);
      
      if (errorCount > 0) {
        console.log(`\n⚠️  Found ${errorCount} issues:`);
        errors.forEach(error => console.log(`   • ${error}`));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(`❌ Validation failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });

// Helper functions

async function findConversationFile(conversationId: string, projectDir: string): Promise<string | null> {
  try {
    // If it looks like a full path, use it directly
    if (conversationId.includes('/') && conversationId.endsWith('.jsonl')) {
      const file = Bun.file(conversationId);
      if (await file.exists()) {
        return conversationId;
      }
    }
    
    // Search for conversation ID in project directories
    const searchPattern = `${projectDir}/**/${conversationId}.jsonl`;
    const proc = Bun.spawn(['find', projectDir, '-name', `${conversationId}.jsonl`, '-type', 'f']);
    const output = await new Response(proc.stdout).text();
    
    const files = output.trim().split('\n').filter(f => f.length > 0);
    
    return files.length > 0 ? files[0] : null;
  } catch (error) {
    return null;
  }
}

async function discoverConversations(projectDir: string, recentDays: number): Promise<ConversationMetadata[]> {
  const parser = new JSONLParser();
  const conversations: ConversationMetadata[] = [];
  
  // Find all JSONL files
  const proc = Bun.spawn(['find', projectDir, '-name', '*.jsonl', '-type', 'f']);
  const output = await new Response(proc.stdout).text();
  
  const files = output.trim().split('\n').filter(f => f.length > 0);
  
  // Filter by date and extract metadata
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - recentDays);
  
  for (const filePath of files) {
    try {
      const metadata = await parser.extractMetadata(filePath);
      if (metadata.lastModified >= cutoffDate) {
        conversations.push(metadata);
      }
    } catch (error) {
      console.warn(`⚠️  Failed to read metadata from ${filePath}`);
    }
  }
  
  return conversations.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

function printTextAnalysis(analysis: SessionAnalysis, conversation: any): void {
  console.log(`\n📊 Conversation Analysis: ${analysis.sessionId}`);
  console.log(`═══════════════════════════════════════════════`);
  
  console.log(`\n📈 Summary:`);
  console.log(`   Entries: ${analysis.summary.totalEntries}`);
  console.log(`   Tools Used: ${analysis.summary.uniqueTools.join(', ')}`);
  console.log(`   Successful Operations: ${analysis.summary.successfulToolUses}`);
  console.log(`   Failed Operations: ${analysis.summary.failedToolUses}`);
  console.log(`   Error Rate: ${((analysis.summary.failedToolUses / (analysis.summary.successfulToolUses + analysis.summary.failedToolUses)) * 100).toFixed(1)}%`);
  
  console.log(`\n💰 Costs:`);
  console.log(`   Total: $${analysis.costs.totalUSD.toFixed(4)}`);
  console.log(`   Input Tokens: ${analysis.costs.tokenBreakdown.input.toLocaleString()}`);
  console.log(`   Output Tokens: ${analysis.costs.tokenBreakdown.output.toLocaleString()}`);
  console.log(`   Cached Tokens: ${analysis.costs.tokenBreakdown.cached.toLocaleString()}`);
  
  console.log(`\n⚡ Performance:`);
  console.log(`   Avg Response Time: ${analysis.performance.averageResponseTime.toFixed(0)}ms`);
  console.log(`   Longest Operation: ${analysis.performance.longestOperation.toFixed(0)}ms`);
  
  console.log(`\n🔧 Tool Usage:`);
  Object.entries(analysis.performance.toolUsageFrequency)
    .sort(([,a], [,b]) => b - a)
    .forEach(([tool, count]) => {
      console.log(`   ${tool}: ${count} times`);
    });
}

function printDetailedAnalysis(analysis: SessionAnalysis, conversation: any, actionSequence: StepSummary[]): void {
  printTextAnalysis(analysis, conversation);
  
  console.log(`\n📋 Action Timeline:`);
  console.log(`───────────────────────────────────────────────`);
  
  actionSequence.forEach((step, index) => {
    const timestamp = new Date(step.timestamp).toLocaleTimeString();
    const status = step.success !== false ? '✅' : '❌';
    const duration = step.duration ? ` (${step.duration}ms)` : '';
    
    console.log(`${String(index + 1).padStart(3)}. ${timestamp} ${status} ${step.type}: ${step.description}${duration}`);
    if (step.tool) {
      console.log(`     🔧 Tool: ${step.tool}`);
    }
  });
  
  if (analysis.summary.todoEvolution.length > 0) {
    console.log(`\n📝 Todo Evolution:`);
    console.log(`───────────────────────────────────────────────`);
    
    analysis.summary.todoEvolution.forEach((todos, index) => {
      console.log(`\nSnapshot ${index + 1}:`);
      todos.forEach(todo => {
        const statusIcon = todo.status === 'completed' ? '✅' : 
                          todo.status === 'in_progress' ? '🔄' : '📋';
        console.log(`   ${statusIcon} ${todo.content}`);
      });
    });
  }
}

function printConversationTable(conversations: ConversationMetadata[]): void {
  console.log(`\n📚 Found ${conversations.length} conversations:`);
  console.log(`════════════════════════════════════════════════════════════════════════════════════`);
  console.log(`${'Session ID'.padEnd(40)} ${'Project'.padEnd(20)} ${'Size'.padEnd(8)} ${'Date'.padEnd(12)}`);
  console.log(`────────────────────────────────────────────────────────────────────────────────────`);
  
  conversations.forEach(conv => {
    const sessionId = conv.sessionId.substring(0, 37) + (conv.sessionId.length > 37 ? '...' : '');
    const project = conv.projectPath.substring(0, 17) + (conv.projectPath.length > 17 ? '...' : '');
    const size = `${(conv.size / 1024).toFixed(1)}KB`;
    const date = conv.lastModified.toISOString().split('T')[0];
    
    console.log(`${sessionId.padEnd(40)} ${project.padEnd(20)} ${size.padEnd(8)} ${date.padEnd(12)}`);
  });
}

function printStepsList(steps: StepSummary[]): void {
  console.log(`\n📋 Action Steps (${steps.length} total):`);
  console.log(`═══════════════════════════════════════════════`);
  
  steps.forEach((step, index) => {
    const timestamp = new Date(step.timestamp).toLocaleTimeString();
    const status = step.success !== false ? '✅' : '❌';
    const duration = step.duration ? ` (${step.duration}ms)` : '';
    
    console.log(`${String(index + 1).padStart(3)}. ${timestamp} ${status} ${step.type}: ${step.description}${duration}`);
    if (step.tool) {
      console.log(`     🔧 ${step.tool}`);
    }
  });
}

function printTimelineSteps(steps: StepSummary[]): void {
  console.log(`\n🕒 Timeline View:`);
  console.log(`═══════════════════════════════════════════════`);
  
  let currentHour = '';
  
  steps.forEach((step, index) => {
    const date = new Date(step.timestamp);
    const hour = date.toLocaleTimeString().split(':')[0] + ':00';
    
    if (hour !== currentHour) {
      currentHour = hour;
      console.log(`\n⏰ ${hour}`);
      console.log(`   ├─────────────────────────────────────────`);
    }
    
    const time = date.toLocaleTimeString();
    const status = step.success !== false ? '✅' : '❌';
    const tool = step.tool ? ` [${step.tool}]` : '';
    
    console.log(`   │ ${time} ${status} ${step.description}${tool}`);
  });
}

function generateMarkdownReport(conversation: any, analysis: SessionAnalysis): string {
  const date = new Date().toISOString().split('T')[0];
  
  return `# Conversation Analysis Report

**Session ID:** ${analysis.sessionId}  
**Generated:** ${date}  
**Total Entries:** ${analysis.summary.totalEntries}

## Summary

- **Tools Used:** ${analysis.summary.uniqueTools.join(', ')}
- **Successful Operations:** ${analysis.summary.successfulToolUses}
- **Failed Operations:** ${analysis.summary.failedToolUses}
- **Error Rate:** ${((analysis.summary.failedToolUses / (analysis.summary.successfulToolUses + analysis.summary.failedToolUses)) * 100).toFixed(1)}%

## Cost Analysis

- **Total Cost:** $${analysis.costs.totalUSD.toFixed(4)}
- **Input Tokens:** ${analysis.costs.tokenBreakdown.input.toLocaleString()}
- **Output Tokens:** ${analysis.costs.tokenBreakdown.output.toLocaleString()}
- **Cached Tokens:** ${analysis.costs.tokenBreakdown.cached.toLocaleString()}

## Performance Metrics

- **Average Response Time:** ${analysis.performance.averageResponseTime.toFixed(0)}ms
- **Longest Operation:** ${analysis.performance.longestOperation.toFixed(0)}ms

## Tool Usage Frequency

${Object.entries(analysis.performance.toolUsageFrequency)
  .sort(([,a], [,b]) => b - a)
  .map(([tool, count]) => `- **${tool}:** ${count} times`)
  .join('\n')}

## Timeline

${analysis.timeline.map((step, index) => {
  const timestamp = new Date(step.timestamp).toLocaleTimeString();
  const status = step.success !== false ? '✅' : '❌';
  const tool = step.tool ? ` \`${step.tool}\`` : '';
  
  return `${index + 1}. **${timestamp}** ${status} ${step.description}${tool}`;
}).join('\n')}
`;
}

function generateCSVReport(analysis: SessionAnalysis): string {
  const headers = ['timestamp', 'type', 'tool', 'description', 'success', 'duration'];
  const rows = analysis.timeline.map(step => [
    step.timestamp,
    step.type,
    step.tool || '',
    `"${step.description.replace(/"/g, '""')}"`,
    step.success !== false ? 'true' : 'false',
    step.duration || ''
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

// Export for programmatic use
export {
  findConversationFile,
  discoverConversations,
  printTextAnalysis,
  printDetailedAnalysis
};

// Run CLI if this file is executed directly
if (import.meta.main) {
  program.parse();
}