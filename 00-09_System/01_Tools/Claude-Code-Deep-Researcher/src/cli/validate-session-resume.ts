#!/usr/bin/env bun
/**
 * Session Resume Validation CLI
 *
 * Command-line tool to validate that optimized JSONL files can resume sessions
 */

import { parseArgs } from 'util';
import { resolve } from 'path';
import { validateSessionResume, printValidationReport } from '../services/session-resume-validator';

const HELP_TEXT = `
Session Resume Validation CLI - Validate optimized JSONL session resumption

USAGE:
  bun src/cli/validate-session-resume.ts --input <path> --project <path> [OPTIONS]

OPTIONS:
  --input <path>          Path to optimized JSONL file (required)
  --project <path>        Project path (required, use "." for current directory)
  --prompt <text>         Test prompt to send (default: summary request)
  --skip-backup           Skip backing up original session file
  --help                  Show this help message

EXAMPLES:
  # Validate single optimized session
  bun src/cli/validate-session-resume.ts \\
    --input /tmp/test-optimized.jsonl \\
    --project .

  # Validate with custom test prompt
  bun src/cli/validate-session-resume.ts \\
    --input /tmp/test-optimized.jsonl \\
    --project /Users/ronaldeddings/ClaudeCodeDeepResearcher \\
    --prompt "What were the last 3 things we worked on?"
`;

async function main() {
  const args = parseArgs({
    options: {
      input: { type: 'string' },
      project: { type: 'string' },
      prompt: { type: 'string' },
      'skip-backup': { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
    allowPositionals: false,
  });

  const cliArgs = args.values as any;

  // Show help
  if (cliArgs.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  // Validate arguments
  if (!cliArgs.input) {
    console.error('Error: Must specify --input');
    console.log(HELP_TEXT);
    process.exit(1);
  }

  if (!cliArgs.project) {
    console.error('Error: Must specify --project');
    console.log(HELP_TEXT);
    process.exit(1);
  }

  const inputPath = resolve(cliArgs.input);
  const projectPath = resolve(cliArgs.project);
  const testPrompt = cliArgs.prompt as string | undefined;
  const skipBackup = args.values['skip-backup'] as boolean;

  console.log('🧪 Session Resume Validation Test\n');
  console.log(`Input: ${inputPath}`);
  console.log(`Project: ${projectPath}`);
  if (testPrompt) {
    console.log(`Test Prompt: "${testPrompt}"`);
  }

  try {
    const result = await validateSessionResume(inputPath, projectPath, testPrompt, skipBackup);
    printValidationReport(result);

    if (!result.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Validation failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
