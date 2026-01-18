#!/usr/bin/env bun
/**
 * Context Optimizer CLI
 *
 * Command-line interface for optimizing Claude conversation logs
 */

import { parseArgs } from 'util';
import { resolve, basename } from 'path';
import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import {
  optimizeSingleConversation,
  optimizeMultipleConversations,
  type PipelineConfig,
} from '../services/optimization-pipeline';
import type { OptimizationLevel, OptimizationOptions } from '../services/context-optimizer';
import { MultiAgentOptimizer, type MultiAgentOptimizerConfig } from '../services/multi-agent-optimizer';
import type { ConversationEntry } from '../types/claude-conversation';

// =====================================
// CLI Configuration
// =====================================

interface CLIArgs {
  input?: string;
  sources?: string;
  output: string;
  level: OptimizationLevel;
  threshold?: number;
  preserveRecent?: number;
  preserveUserMessages?: boolean;
  summarizeSize?: number;
  crossSessionDedup?: boolean;
  patternDetection?: boolean;
  partialExtraction?: boolean;
  mergeStrategy?: 'best-of-each' | 'chronological' | 'importance-ranked';
  multiAgent?: boolean;
  agentCount?: number;
  agentModel?: 'sonnet' | 'opus' | 'haiku';
  customPrompt?: string;
  verbose?: boolean;
  dryRun?: boolean;
  report?: boolean;
  help?: boolean;
}

const HELP_TEXT = `
Context Optimizer CLI - Optimize Claude conversation logs

USAGE:
  bun src/cli/context-optimizer-cli.ts [OPTIONS]

SINGLE CONVERSATION:
  --input <path>           Input JSONL file
  --output <path>          Output JSONL file
  --level <level>          Optimization level: minimal | balanced | aggressive | maximum
                           (default: balanced) [Rule-based optimization only]

MULTIPLE CONVERSATIONS:
  --sources <paths>        Comma-separated input JSONL files or glob pattern
                           Example: "Resources/ClaudeLogs/session-*.jsonl"
  --output <path>          Output consolidated JSONL file
  --merge-strategy <strat> Merge strategy: best-of-each | chronological | importance-ranked
                           (default: best-of-each)
  --cross-session-dedup    Enable cross-conversation deduplication
  --pattern-detection      Enable pattern detection for frequently accessed files

MULTI-AGENT OPTIMIZATION (RECOMMENDED):
  --multi-agent            Use AI-driven multi-agent optimization (10 Claude agents)
  --agent-count <n>        Number of agents to spawn (default: 10)
  --agent-model <model>    Model for agents: sonnet | opus | haiku (default: sonnet)
  --custom-prompt <path>   Path to custom optimization prompt file

CUSTOM SETTINGS (Rule-based only):
  --threshold <0.0-1.0>    Custom importance threshold (requires --level custom)
  --preserve-recent <n>    Always preserve last N messages (default: 50)
  --preserve-user          Always preserve all user messages (default: true)
  --no-preserve-user       Allow removing some user messages
  --summarize-size <n>     Summarize tool results larger than N characters (default: 5000)
  --partial-extraction     Enable intelligent partial content extraction (default: true)
  --no-partial-extraction  Disable partial content extraction

OUTPUT:
  --report                 Generate detailed optimization report
  --verbose                Enable verbose logging
  --dry-run                Don't write output file, only show what would happen

EXAMPLES:
  # AI-driven multi-agent optimization (RECOMMENDED)
  bun src/cli/context-optimizer-cli.ts \\
    --input Resources/ClaudeLogs/session.jsonl \\
    --output Resources/ClaudeLogs/session-optimized.jsonl \\
    --multi-agent \\
    --verbose \\
    --report

  # Traditional rule-based optimization (balanced)
  bun src/cli/context-optimizer-cli.ts \\
    --input Resources/ClaudeLogs/session.jsonl \\
    --output Resources/ClaudeLogs/session-optimized.jsonl \\
    --level balanced \\
    --report

  # Multi-agent with custom prompt
  bun src/cli/context-optimizer-cli.ts \\
    --input Resources/ClaudeLogs/large-session.jsonl \\
    --output Resources/ClaudeLogs/large-session-optimized.jsonl \\
    --multi-agent \\
    --agent-count 10 \\
    --agent-model sonnet \\
    --custom-prompt my-optimization-prompt.txt \\
    --verbose
`;

// =====================================
// Main CLI Logic
// =====================================

async function main() {
  const args = parseArgs({
    options: {
      input: { type: 'string' },
      sources: { type: 'string' },
      output: { type: 'string' },
      level: { type: 'string', default: 'balanced' },
      threshold: { type: 'string' },
      'preserve-recent': { type: 'string' },
      'preserve-user': { type: 'boolean', default: true },
      'no-preserve-user': { type: 'boolean', default: false },
      'summarize-size': { type: 'string' },
      'cross-session-dedup': { type: 'boolean', default: false },
      'pattern-detection': { type: 'boolean', default: false },
      'partial-extraction': { type: 'boolean', default: true },
      'no-partial-extraction': { type: 'boolean', default: false },
      'merge-strategy': { type: 'string' },
      'multi-agent': { type: 'boolean', default: false },
      'agent-count': { type: 'string' },
      'agent-model': { type: 'string' },
      'custom-prompt': { type: 'string' },
      verbose: { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      report: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
    allowPositionals: true,
    strict: false,
  });

  const cliArgs = args.values as any as CLIArgs;

  // Show help
  if (cliArgs.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  // Validate arguments
  if (!cliArgs.input && !cliArgs.sources) {
    console.error('Error: Must specify either --input or --sources');
    console.log(HELP_TEXT);
    process.exit(1);
  }

  if (!cliArgs.output) {
    console.error('Error: Must specify --output');
    console.log(HELP_TEXT);
    process.exit(1);
  }

  // Validate level
  const validLevels = ['minimal', 'balanced', 'aggressive', 'maximum', 'custom'];
  if (!validLevels.includes(cliArgs.level)) {
    console.error(`Error: Invalid level "${cliArgs.level}". Must be one of: ${validLevels.join(', ')}`);
    process.exit(1);
  }

  // Build optimization options
  const preserveRecent = args.values['preserve-recent'] as string | undefined;
  const summarizeSize = args.values['summarize-size'] as string | undefined;
  const noPreserveUser = args.values['no-preserve-user'] as boolean;
  const noPartialExtraction = args.values['no-partial-extraction'] as boolean;

  const optimizationOptions: OptimizationOptions = {
    level: cliArgs.level as OptimizationLevel,
    customThreshold: cliArgs.threshold ? parseFloat(cliArgs.threshold) : undefined,
    preserveRecentCount: preserveRecent ? parseInt(preserveRecent) : 50,
    preserveAllUserMessages: !noPreserveUser,
    summarizeLargeResults: summarizeSize ? parseInt(summarizeSize) : 5000,
    crossConversationDedup: args.values['cross-session-dedup'] as boolean,
    patternDetection: args.values['pattern-detection'] as boolean,
    partialExtraction: !noPartialExtraction,
  };

  // Build pipeline config
  const pipelineConfig: PipelineConfig = {
    optimization: optimizationOptions,
    verbose: args.values.verbose as boolean,
    dryRun: args.values['dry-run'] as boolean,
  };

  // Run optimization
  try {
    // Check if multi-agent mode is enabled
    const useMultiAgent = args.values['multi-agent'] as boolean;

    if (useMultiAgent) {
      // Multi-agent AI-driven optimization
      if (!cliArgs.input) {
        console.error('Error: --multi-agent mode currently only supports single conversation (--input)');
        console.error('       Multi-source optimization with --multi-agent coming soon!');
        process.exit(1);
      }

      const inputPath = resolve(cliArgs.input);
      const outputPath = resolve(cliArgs.output);

      console.log('🤖 Multi-Agent AI-Driven Optimization\n');
      console.log('   Spawning 10 Claude agents for intelligent context optimization...\n');

      // Load custom prompt if provided
      let customPrompt: string | undefined;
      const customPromptPath = args.values['custom-prompt'] as string | undefined;
      if (customPromptPath) {
        customPrompt = readFileSync(resolve(customPromptPath), 'utf-8');
        if (cliArgs.verbose) {
          console.log(`   Using custom prompt from: ${customPromptPath}\n`);
        }
      }

      // Parse agent config
      const agentCount = args.values['agent-count']
        ? parseInt(args.values['agent-count'] as string)
        : 10;
      const agentModel = (args.values['agent-model'] as 'sonnet' | 'opus' | 'haiku') || 'sonnet';

      // Load conversation entries
      const fileContent = readFileSync(inputPath, 'utf-8');
      const entries: ConversationEntry[] = fileContent
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      if (cliArgs.verbose) {
        console.log(`   Loaded ${entries.length} entries from ${inputPath}`);
        console.log(`   Agent count: ${agentCount}`);
        console.log(`   Agent model: ${agentModel}\n`);
      }

      // Create multi-agent optimizer
      const optimizer = new MultiAgentOptimizer({
        agentCount,
        model: agentModel,
        customPrompt,
        verbose: cliArgs.verbose,
      });

      // Run optimization
      const result = await optimizer.optimizeConversation(entries);

      // Write output if not dry run
      if (!cliArgs.dryRun) {
        const outputLines = result.optimizedEntries.map(entry => JSON.stringify(entry)).join('\n');
        writeFileSync(outputPath, outputLines + '\n');
        if (cliArgs.verbose) {
          console.log(`\n✅ Wrote ${result.optimizedEntries.length} optimized entries to ${outputPath}`);
        }
      }

      // Print results
      printMultiAgentResults(result, cliArgs);

    } else if (cliArgs.input) {
      // Traditional rule-based single conversation
      const inputPath = resolve(cliArgs.input);
      const outputPath = resolve(cliArgs.output);

      console.log('🔧 Optimizing single conversation (rule-based)...\n');

      const result = await optimizeSingleConversation(
        inputPath,
        outputPath,
        pipelineConfig
      );

      printResults(result, cliArgs);
    } else if (cliArgs.sources) {
      // Multiple conversations
      const inputPaths = await resolveSourcePaths(cliArgs.sources);
      const outputPath = resolve(cliArgs.output);

      console.log(`🔧 Optimizing ${inputPaths.length} conversations...\n`);

      // Add multi-source config
      const mergeStrategy = args.values['merge-strategy'] as 'best-of-each' | 'chronological' | 'importance-ranked' | undefined;
      pipelineConfig.optimization.multiSource = {
        sources: [], // Will be loaded by pipeline
        mergeStrategy: mergeStrategy || 'best-of-each',
      };

      const result = await optimizeMultipleConversations(
        inputPaths,
        outputPath,
        pipelineConfig
      );

      printResults(result, cliArgs);
    }
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    if (cliArgs.verbose && error instanceof Error) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// =====================================
// Helper Functions
// =====================================

/**
 * Resolve source paths (handle glob patterns)
 */
async function resolveSourcePaths(sources: string): Promise<string[]> {
  // Check if it's a comma-separated list
  if (sources.includes(',')) {
    return sources.split(',').map(s => resolve(s.trim()));
  }

  // Check if it's a glob pattern
  if (sources.includes('*')) {
    const matches = await glob(sources, { absolute: true });
    if (matches.length === 0) {
      throw new Error(`No files matched pattern: ${sources}`);
    }
    return matches;
  }

  // Single file
  return [resolve(sources)];
}

/**
 * Print optimization results
 */
function printResults(result: any, cliArgs: CLIArgs) {
  console.log('✅ Optimization complete!\n');

  // Summary
  console.log('📊 Summary:');
  console.log(`   Original: ${result.result.originalCount} entries (${formatSize(result.result.originalSize)})`);
  console.log(`   Optimized: ${result.result.optimizedCount} entries (${formatSize(result.result.optimizedSize)})`);
  console.log(`   Reduction: ${result.result.reductionPercent.toFixed(1)}% entries, ${result.result.sizeReductionPercent.toFixed(1)}% size`);
  console.log(`   Execution time: ${result.executionTimeMs}ms\n`);

  // Operations
  console.log('🔨 Operations:');
  console.log(`   Partial extractions: ${result.result.statistics.partialExtractions || 0}`);
  console.log(`   Deduplicated: ${result.result.statistics.deduplicatedEntries || 0}`);
  console.log(`   Removed (low importance): ${result.result.statistics.removedLowImportance || 0}`);
  if (result.result.statistics.crossConvDuplicates) {
    console.log(`   Cross-conversation duplicates: ${result.result.statistics.crossConvDuplicates}`);
  }
  if (result.result.statistics.patternsDetected) {
    console.log(`   Patterns detected: ${result.result.statistics.patternsDetected}`);
  }
  console.log();

  // Output location
  if (result.outputPath) {
    console.log(`💾 Output written to: ${result.outputPath}\n`);
  } else {
    console.log(`🏃 Dry run - no files written\n`);
  }

  // Detailed report
  if (cliArgs.report) {
    console.log('📄 Detailed Report:');
    console.log('─'.repeat(60));
    printDetailedReport(result.report);
    console.log('─'.repeat(60));
  }

  // Warnings
  if (result.result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.result.warnings.forEach((warning: string) => {
      console.log(`   - ${warning}`);
    });
  }

  // Recommendations
  if (result.report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    result.report.recommendations.forEach((rec: string) => {
      console.log(`   - ${rec}`);
    });
  }
}

/**
 * Print detailed optimization report
 */
function printDetailedReport(report: any) {
  console.log(`\nLevel: ${report.summary.level}`);
  console.log(`Threshold: ${report.summary.threshold}`);
  console.log(`\nBefore:`);
  console.log(`  Entries: ${report.summary.originalEntries}`);
  console.log(`  Size: ${report.summary.originalSizeMB.toFixed(2)} MB`);
  console.log(`\nAfter:`);
  console.log(`  Entries: ${report.summary.optimizedEntries}`);
  console.log(`  Size: ${report.summary.optimizedSizeMB.toFixed(2)} MB`);
  console.log(`\nReduction:`);
  console.log(`  Entries: ${report.summary.reductionPercent.toFixed(1)}%`);
  console.log(`  Size: ${report.summary.sizeReductionPercent.toFixed(1)}%`);

  if (report.crossConversation) {
    console.log(`\nCross-Conversation Analysis:`);
    console.log(`  Total conversations: ${report.crossConversation.totalConversations}`);
    console.log(`  Duplicates found: ${report.crossConversation.duplicatesFound}`);
    console.log(`  Best instances selected: ${report.crossConversation.bestInstancesSelected}`);
    console.log(`  Frequent files detected: ${report.crossConversation.frequentFilesDetected}`);

    if (report.crossConversation.toolUsageStats.length > 0) {
      console.log(`\n  Top Tool Usage:`);
      report.crossConversation.toolUsageStats.slice(0, 5).forEach((stat: any) => {
        console.log(`    ${stat.tool}: ${stat.count} (${stat.percentage.toFixed(1)}%)`);
      });
    }
  }

  console.log(`\nProcessing time: ${report.processingTimeMs}ms`);
}

/**
 * Format size in bytes to human-readable format
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Print multi-agent optimization results
 */
function printMultiAgentResults(result: any, cliArgs: CLIArgs) {
  console.log('\n✅ Multi-Agent Optimization Complete!\n');

  // Summary
  console.log('📊 Summary:');
  console.log(`   Original entries: ${result.originalEntries.length}`);
  console.log(`   Optimized entries: ${result.optimizedEntries.length}`);
  console.log(`   Entries removed: ${result.originalEntries.length - result.optimizedEntries.length}`);
  console.log(`   Reduction: ${((1 - result.optimizedEntries.length / result.originalEntries.length) * 100).toFixed(1)}%`);
  console.log(`   Execution time: ${(result.executionTimeMs / 1000).toFixed(1)}s\n`);

  // Token stats
  console.log('📈 Token Analysis:');
  console.log(`   Original input tokens: ${result.stats.originalInputTokens.toLocaleString()}`);
  console.log(`   Original output tokens: ${result.stats.originalOutputTokens.toLocaleString()}`);
  console.log(`   Optimized input tokens: ${result.stats.totalInputTokens.toLocaleString()}`);
  console.log(`   Optimized output tokens: ${result.stats.totalOutputTokens.toLocaleString()}`);
  console.log(`   Token reduction: ${result.stats.percentReduction.toFixed(1)}%\n`);

  // Agent decisions summary
  console.log('🤖 Agent Decisions:');
  const agentsByType = result.agentDecisions.reduce((acc: any, decision: any) => {
    const type = decision.agentId === 9 ? 'cross-chunk' : decision.agentId === 10 ? 'coordinator' : 'chunk';
    if (!acc[type]) acc[type] = [];
    acc[type].push(decision);
    return acc;
  }, {});

  if (agentsByType.chunk) {
    console.log(`   Chunk analyzers: ${agentsByType.chunk.length} agents`);
    const avgConfidence = agentsByType.chunk.reduce((sum: number, d: any) => sum + d.confidence, 0) / agentsByType.chunk.length;
    console.log(`   Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
  }

  if (agentsByType['cross-chunk']) {
    console.log(`   Cross-chunk analyzer: ${agentsByType['cross-chunk'][0].keepEntries.length} overrides`);
  }

  if (agentsByType.coordinator) {
    console.log(`   Final coordinator: ${agentsByType.coordinator[0].keepEntries.length} entries kept`);
    console.log(`   Coordinator confidence: ${(agentsByType.coordinator[0].confidence * 100).toFixed(1)}%`);
  }

  console.log();

  // Detailed agent reasoning (if verbose or report)
  if (cliArgs.verbose || cliArgs.report) {
    console.log('📝 Agent Reasoning:');
    console.log('─'.repeat(60));

    result.agentDecisions.forEach((decision: any) => {
      const agentName = decision.agentId === 9 ? 'Cross-Chunk Analyzer' :
                        decision.agentId === 10 ? 'Final Coordinator' :
                        `Chunk Analyzer ${decision.agentId}`;
      console.log(`\n${agentName}:`);
      console.log(`  Confidence: ${(decision.confidence * 100).toFixed(1)}%`);
      console.log(`  Reasoning: ${decision.reasoning.slice(0, 200)}${decision.reasoning.length > 200 ? '...' : ''}`);
    });

    console.log('\n' + '─'.repeat(60));
  }

  // Output location
  if (!cliArgs.dryRun) {
    console.log(`\n💾 Optimized conversation saved!`);
  } else {
    console.log(`\n🏃 Dry run - no files written`);
  }
}

// =====================================
// Run CLI
// =====================================

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
