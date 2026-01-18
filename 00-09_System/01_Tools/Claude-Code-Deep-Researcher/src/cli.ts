#!/usr/bin/env bun

import { ClaudeCodeApp } from './claude-sdk-app.ts';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Command Line Interface for Claude Code SDK Application
 * Exposes all 6 core features as CLI commands
 */

interface CliCommand {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[], app: ClaudeCodeApp) => Promise<void>;
}

/**
 * CLI command handlers
 */
const commands: CliCommand[] = [
  {
    name: 'run',
    description: 'Feature 1: Execute a prompt through Claude Code SDK',
    usage: 'run <prompt> [--stream]',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Prompt required for run command');
        process.exit(1);
      }

      const prompt = args.join(' ').replace(/--stream/g, '').trim();
      const useStream = args.includes('--stream');

      if (useStream) {
        console.log('🔄 Running prompt with streaming...\n');
        
        for await (const { message, progress } of app.runPromptStream(prompt)) {
          console.log(`${progress} [${message.type}]`);
          
          if (message.type === 'result') {
            break;
          }
        }
      } else {
        console.log('🚀 Running prompt...\n');
        const result = await app.runPrompt(prompt);
        
        if (result.success) {
          console.log('✅ Prompt executed successfully');
          if (result.extractedResult) {
            console.log('\n📝 Result:', result.extractedResult);
          }
        } else {
          console.error('❌ Prompt failed:', result.error);
          process.exit(1);
        }
      }
    }
  },

  {
    name: 'set-limits',
    description: 'Feature 2: Set maximum number of tasks in todo lists',
    usage: 'set-limits <maxTasks> [requiredTask1,requiredTask2,...]',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Max tasks number required');
        process.exit(1);
      }

      const maxTasks = parseInt(args[0]!);
      if (isNaN(maxTasks) || maxTasks < 1) {
        console.error('❌ Max tasks must be a positive number');
        process.exit(1);
      }

      const requiredTasks = args[1] ? args[1].split(',').map(t => t.trim()) : undefined;
      
      await app.setTodoLimits(maxTasks, requiredTasks);
      console.log(`✅ Todo limits set: max=${maxTasks}, required=${requiredTasks?.length || 0}`);
    }
  },

  {
    name: 'run-controlled',
    description: 'Feature 2 Extended: Run prompt with todo control',
    usage: 'run-controlled <prompt>',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Prompt required for run-controlled command');
        process.exit(1);
      }

      const prompt = args.join(' ');
      console.log('🎯 Running prompt with todo control...\n');
      
      const result = await app.runPromptWithTodoControl(prompt);
      
      if (result.success) {
        console.log('✅ Controlled prompt executed successfully');
        if (result.extractedResult) {
          console.log('\n📝 Result:', result.extractedResult);
        }
      } else {
        console.error('❌ Controlled prompt failed:', result.error);
        process.exit(1);
      }
    }
  },

  {
    name: 'resume',
    description: 'Feature 3: Resume a previous conversation',
    usage: 'resume <sessionId> <prompt>',
    handler: async (args, app) => {
      if (args.length < 2) {
        console.error('❌ Session ID and prompt required for resume command');
        process.exit(1);
      }

      const sessionId = args[0]!;
      const prompt = args.slice(1).join(' ');
      
      console.log(`🔄 Resuming conversation ${sessionId}...\n`);
      
      const result = await app.resumeConversation(sessionId, prompt);
      
      if (result.success) {
        console.log('✅ Conversation resumed successfully');
        if (result.extractedResult) {
          console.log('\n📝 Result:', result.extractedResult);
        }
      } else {
        console.error('❌ Resume failed:', result.error);
        process.exit(1);
      }
    }
  },

  {
    name: 'duplicate',
    description: 'Feature 4: Duplicate an existing conversation',
    usage: 'duplicate <sourceSessionId>',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Source session ID required for duplicate command');
        process.exit(1);
      }

      const sourceSessionId = args[0]!;
      
      console.log(`📋 Duplicating conversation ${sourceSessionId}...\n`);
      
      const result = await app.duplicateConversation(sourceSessionId);
      
      if (result.success) {
        console.log('✅ Conversation duplicated successfully');
        console.log(`🆕 New session ID: ${result.newSessionId}`);
      } else {
        console.error('❌ Duplication failed:', result.error);
        process.exit(1);
      }
    }
  },

  {
    name: 'duplicate-resume',
    description: 'Feature 5: Duplicate a conversation and immediately continue it',
    usage: 'duplicate-resume <sourceSessionId> <prompt>',
    handler: async (args, app) => {
      if (args.length < 2) {
        console.error('❌ Source session ID and prompt required for duplicate-resume command');
        process.exit(1);
      }

      const sourceSessionId = args[0]!;
      const prompt = args.slice(1).join(' ');
      
      console.log(`🔄📋 Duplicating and resuming conversation ${sourceSessionId}...\n`);
      
      const result = await app.duplicateAndResume(sourceSessionId, prompt);
      
      if (result.success) {
        console.log('✅ Duplicate and resume completed successfully');
        console.log(`🆕 New session ID: ${result.newSessionId}`);
        if (result.messages.length > 0) {
          console.log(`📊 Generated ${result.messages.length} messages`);
        }
      } else {
        console.error('❌ Duplicate and resume failed:', result.error);
        process.exit(1);
      }
    }
  },

  {
    name: 'specify-tasks',
    description: 'Feature 6: Specify required and forbidden tasks',
    usage: 'specify-tasks <requiredTask1,requiredTask2,...> [forbiddenTask1,forbiddenTask2,...]',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Required tasks list needed');
        process.exit(1);
      }

      const requiredTasks = args[0]!.split(',').map(t => t.trim());
      const forbiddenTasks = args[1] ? args[1].split(',').map(t => t.trim()) : undefined;
      
      await app.specifyRequiredTasks(requiredTasks, forbiddenTasks);
      console.log(`✅ Task specification set: required=${requiredTasks.length}, forbidden=${forbiddenTasks?.length || 0}`);
    }
  },

  {
    name: 'run-specified',
    description: 'Feature 6 Extended: Run prompt with task specification',
    usage: 'run-specified <prompt> --max-tasks <number> --required <task1,task2> [--forbidden <task1,task2>]',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Prompt required for run-specified command');
        process.exit(1);
      }

      // Parse arguments
      const maxTasksIndex = args.indexOf('--max-tasks');
      const requiredIndex = args.indexOf('--required');
      const forbiddenIndex = args.indexOf('--forbidden');

      let prompt = '';
      let maxTasks = 10;
      let requiredTasks: string[] = [];
      let forbiddenTasks: string[] = [];

      // Extract prompt (everything before first flag)
      let promptEnd = args.length;
      if (maxTasksIndex !== -1) promptEnd = Math.min(promptEnd, maxTasksIndex);
      if (requiredIndex !== -1) promptEnd = Math.min(promptEnd, requiredIndex);
      if (forbiddenIndex !== -1) promptEnd = Math.min(promptEnd, forbiddenIndex);
      
      prompt = args.slice(0, promptEnd).join(' ');

      // Extract max tasks
      if (maxTasksIndex !== -1 && maxTasksIndex + 1 < args.length) {
        maxTasks = parseInt(args[maxTasksIndex + 1]!) || 10;
      }

      // Extract required tasks
      if (requiredIndex !== -1 && requiredIndex + 1 < args.length) {
        requiredTasks = args[requiredIndex + 1]!.split(',').map(t => t.trim());
      }

      // Extract forbidden tasks
      if (forbiddenIndex !== -1 && forbiddenIndex + 1 < args.length) {
        forbiddenTasks = args[forbiddenIndex + 1]!.split(',').map(t => t.trim());
      }

      const requirements = { maxTasks, requiredTasks, forbiddenTasks };
      
      console.log('🎯 Running prompt with task specification...\n');
      
      const result = await app.runPromptWithTaskSpec(prompt, requirements);
      
      if (result.success) {
        console.log('✅ Specified prompt executed successfully');
        if (result.extractedResult) {
          console.log('\n📝 Result:', result.extractedResult);
        }
      } else {
        console.error('❌ Specified prompt failed:', result.error);
        process.exit(1);
      }
    }
  },

  {
    name: 'list-sessions',
    description: 'List available sessions for resume/duplicate operations',
    usage: 'list-sessions [projectPath]',
    handler: async (args, app) => {
      const projectPath = args[0] || undefined;
      
      console.log('📋 Listing available sessions...\n');
      
      const { sessions, totalSessions } = await app.listAvailableSessions(projectPath);
      
      if (totalSessions === 0) {
        console.log('📭 No sessions found');
        return;
      }

      console.log(`📊 Found ${totalSessions} sessions:\n`);
      
      sessions.slice(0, 10).forEach((session, index) => {
        console.log(`${index + 1}. Session: ${session.sessionId}`);
        console.log(`   Project: ${session.projectPath}`);
        console.log(`   Last Activity: ${session.lastActivity}`);
        console.log(`   Messages: ${session.messageCount}`);
        console.log(`   Can Resume: ${session.canResume ? '✅' : '❌'}`);
        console.log('');
      });

      if (totalSessions > 10) {
        console.log(`... and ${totalSessions - 10} more sessions`);
      }
    }
  },

  {
    name: 'session-info',
    description: 'Get detailed information about a specific session',
    usage: 'session-info <sessionId>',
    handler: async (args, app) => {
      if (args.length === 0) {
        console.error('❌ Session ID required');
        process.exit(1);
      }

      const sessionId = args[0]!;
      
      console.log(`🔍 Getting session information for ${sessionId}...\n`);
      
      const details = await app.getSessionDetails(sessionId);
      
      if (!details) {
        console.error('❌ Session not found or inaccessible');
        process.exit(1);
      }

      console.log(`📋 Session Details:`);
      console.log(`   ID: ${details.sessionId}`);
      console.log(`   Can Resume: ${details.canResume ? '✅' : '❌'}`);
      console.log(`   Can Duplicate: ${details.canDuplicate ? '✅' : '❌'}`);
      console.log(`\n📊 Metadata:`);
      console.log(`   Project: ${details.metadata.projectPath}`);
      console.log(`   Messages: ${details.metadata.messageCount}`);
      console.log(`   Start Time: ${details.metadata.startTime}`);
      console.log(`   Last Activity: ${details.metadata.lastActivity}`);
      console.log(`\n📝 Summary:`);
      console.log(details.summary);
    }
  },

  {
    name: 'demo',
    description: 'Demonstrate all 6 core features with a test workflow',
    usage: 'demo',
    handler: async (args, app) => {
      console.log('🎬 Starting complete feature demonstration...\n');
      
      try {
        const results = await app.demonstrateAllFeatures();
        console.log('\n' + results.summary);
      } catch (error) {
        console.error('❌ Demo failed:', error);
        process.exit(1);
      }
    }
  },

  {
    name: 'status',
    description: 'Show application status and configuration',
    usage: 'status',
    handler: async (args, app) => {
      console.log('📊 Claude Code SDK Application Status\n');
      
      // Service validation
      const validation = app.validateServices();
      console.log(`🔧 Services: ${validation.valid ? '✅ All OK' : '❌ Issues detected'}`);
      if (!validation.valid) {
        validation.issues.forEach(issue => console.log(`   ⚠️ ${issue}`));
      }
      
      // Configuration
      const config = app.getConfiguration();
      console.log(`\n⚙️ Configuration:`);
      console.log(`   Max Turns: ${config.maxTurns}`);
      console.log(`   Allowed Tools: ${config.allowedTools.length} tools`);
      console.log(`   Projects Directory: ${config.projectsDirectory}`);
      
      // Todo state
      const todoState = app.getTodoState();
      console.log(`\n📋 Todo State:`);
      console.log(`   Max Tasks: ${todoState.requirements.maxTasks}`);
      console.log(`   Required Tasks: ${todoState.requirements.requiredTasks.length}`);
      console.log(`   Current Todos: ${todoState.todos.length}`);
      console.log(`   Completion Rate: ${todoState.stats.completionRate.toFixed(1)}%`);
      
      // Session statistics
      const sessions = await app.listAvailableSessions();
      console.log(`\n📁 Sessions:`);
      console.log(`   Total Available: ${sessions.totalSessions}`);
      console.log(`   Can Resume: ${sessions.sessions.filter(s => s.canResume).length}`);
    }
  },

  {
    name: 'prebake-context',
    description: 'Pre-bake project context: Deep analysis → Clean template creation',
    usage: 'prebake-context [project-path] [options]\nOptions:\n  --max-length <n>      Max context tokens (default: 8000)\n  --focus <areas>       Focus areas (comma-separated)\n  --stages <1,2,3>      Run specific stages only (default: all)\n  --stage1-prompt <p>   Custom prompt for stage 1\n  --stage2-prompt <p>   Custom prompt for stage 2\n  --stage3-prompt <p>   Custom prompt for stage 3\n  --input-session <id>  Use existing session as input (for stage-only runs)\n  --no-optimize         Disable stage 3 optimization\n  --aggressive          Use aggressive compression\n  --max-tokens <n>      Max tokens per message in stage 3',
    handler: async (args, app) => {
      // Parse flag positions
      const maxLengthIndex = args.indexOf('--max-length');
      const focusIndex = args.indexOf('--focus');
      const maxTokensIndex = args.indexOf('--max-tokens');
      const stagesIndex = args.indexOf('--stages');
      const stage1PromptIndex = args.indexOf('--stage1-prompt');
      const stage2PromptIndex = args.indexOf('--stage2-prompt');
      const stage3PromptIndex = args.indexOf('--stage3-prompt');
      const inputSessionIndex = args.indexOf('--input-session');
      
      // Get flag values
      const flagValues = new Set();
      const flagIndexes = [maxLengthIndex, focusIndex, maxTokensIndex, stagesIndex, stage1PromptIndex, stage2PromptIndex, stage3PromptIndex, inputSessionIndex];
      flagIndexes.forEach(index => {
        if (index !== -1 && index + 1 < args.length) {
          flagValues.add(args[index + 1]);
        }
      });
      
      // Find first non-flag argument as project path, or use current directory
      const nonFlagArgs = args.filter(arg => !arg.startsWith('--') && !flagValues.has(arg));
      const projectPath = nonFlagArgs.length > 0 ? nonFlagArgs[0] : process.cwd();
      
      const options: any = {
        maxContextLength: maxLengthIndex !== -1 && args[maxLengthIndex + 1] 
          ? parseInt(args[maxLengthIndex + 1]) 
          : 128000,
        focusAreas: focusIndex !== -1 && args[focusIndex + 1]
          ? args[focusIndex + 1].split(',').map(area => area.trim())
          : undefined,
        includeCodeExamples: !args.includes('--no-code'),
        includeArchitecture: !args.includes('--no-arch'), 
        includeWorkflows: !args.includes('--no-workflow'),
        // Stage 3: Content Optimization options
        enableOptimization: !args.includes('--no-optimize'),
        stage3Options: {
          aggressiveCompression: args.includes('--aggressive'),
          maxTokensPerMessage: maxTokensIndex !== -1 && args[maxTokensIndex + 1]
            ? parseInt(args[maxTokensIndex + 1])
            : 200,
          preserveCodeExamples: !args.includes('--no-code'),
          removeToolCalls: true,
          removeIntermediateSteps: args.includes('--aggressive'),
          condenseLargeFiles: true,
          maxFileSnippetLines: 50
        }
      };

      // Parse custom prompts
      if (stage1PromptIndex !== -1 && args[stage1PromptIndex + 1]) {
        options.stage1Prompt = args[stage1PromptIndex + 1];
      }
      if (stage2PromptIndex !== -1 && args[stage2PromptIndex + 1]) {
        options.stage2Prompt = args[stage2PromptIndex + 1];
      }
      if (stage3PromptIndex !== -1 && args[stage3PromptIndex + 1]) {
        options.stage3Prompt = args[stage3PromptIndex + 1];
      }

      // Parse stage selection
      if (stagesIndex !== -1 && args[stagesIndex + 1]) {
        const stageList = args[stagesIndex + 1].split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
        if (stageList.length > 0) {
          options.stages = stageList;
        }
      }

      // Parse input session for stage-only runs
      if (inputSessionIndex !== -1 && args[inputSessionIndex + 1]) {
        options.inputSessionId = args[inputSessionIndex + 1];
      }
      
      console.log(`🧠 Pre-baking project context for: ${projectPath}`);
      console.log(`⚙️  Options:`);
      console.log(`   Max Length: ${options.maxContextLength} tokens`);
      console.log(`   Focus Areas: ${options.focusAreas?.join(',') || 'all'}`);
      console.log(`   Stages: ${options.stages?.join(',') || 'all (1,2,3)'}`);
      if (options.stage1Prompt) console.log(`   Stage 1 Custom Prompt: ${options.stage1Prompt.substring(0, 50)}...`);
      if (options.stage2Prompt) console.log(`   Stage 2 Custom Prompt: ${options.stage2Prompt.substring(0, 50)}...`);
      if (options.inputSessionId) console.log(`   Input Session: ${options.inputSessionId}`);
      console.log(`   Optimization: ${options.enableOptimization ? 'enabled' : 'disabled'}`);
      
      try {
        const result = await app.prebakeProjectContext(projectPath, options);
        
        if (result.success) {
          console.log('\n🎉 Context pre-baking completed successfully!');
          console.log(`\n📊 Results:`);
          console.log(`   Analysis Session: ${result.analysisSession || 'N/A (stage skipped)'}`);
          console.log(`   Template Session: ${result.templateSession}`);
          console.log(`   Total Cost: $${result.cost.toFixed(4)}`);
          console.log(`   Tokens Used: ${result.tokensUsed.input}→${result.tokensUsed.output}`);
          
          if (result.stageResults) {
            console.log(`\n📋 Stage Results:`);
            if (result.stageResults.stage1) {
              console.log(`   Stage 1: ✅ ${result.stageResults.stage1.summary}`);
            }
            if (result.stageResults.stage2) {
              console.log(`   Stage 2: ✅ Reduced from ${result.stageResults.stage2.originalMessages} to ${result.stageResults.stage2.curatedMessages} messages`);
            }
            if (result.stageResults.stage3) {
              console.log(`   Stage 3: ✅ ${result.stageResults.stage3.optimizedMessages || 0} optimized messages`);
            }
          }
          
          console.log(`\n🚀 To use the template:`);
          console.log(`   bun run src/cli.ts resume ${result.templateSession} "Your prompt here"`);
        } else {
          console.error('❌ Context pre-baking failed:', result.error);
          process.exit(1);
        }
      } catch (error) {
        console.error('❌ Context pre-baking failed:', error);
        process.exit(1);
      }
    }
  },

  {
    name: 'help',
    description: 'Show help information',
    usage: 'help [command]',
    handler: async (args, app) => {
      if (args.length > 0) {
        const commandName = args[0];
        const command = commands.find(c => c.name === commandName);
        
        if (command) {
          console.log(`\n📖 ${command.name} - ${command.description}`);
          console.log(`Usage: ${command.usage}\n`);
        } else {
          console.error(`❌ Unknown command: ${commandName}`);
          process.exit(1);
        }
      } else {
        console.log('\n🚀 Claude Code SDK Application CLI\n');
        console.log('Available commands:\n');
        
        commands.forEach(command => {
          console.log(`  ${command.name.padEnd(16)} - ${command.description}`);
        });
        
        console.log('\nUse "help <command>" for detailed usage information.\n');
        
        console.log('📋 Core Features:');
        console.log('  1. run              - Execute prompts through Claude Code SDK');
        console.log('  2. set-limits       - Control maximum tasks in todo lists');
        console.log('  3. resume           - Resume previous conversations');
        console.log('  4. duplicate        - Create copies of existing conversations');
        console.log('  5. duplicate-resume - Duplicate and immediately continue conversations');
        console.log('  6. specify-tasks    - Specify required and forbidden tasks');
        console.log('');
      }
    }
  }
];

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('❌ No command provided. Use "help" for available commands.');
    process.exit(1);
  }

  const commandName = args[0];
  const commandArgs = args.slice(1);
  
  const command = commands.find(c => c.name === commandName);
  
  if (!command) {
    console.error(`❌ Unknown command: ${commandName}`);
    console.log('Use "help" for available commands.');
    process.exit(1);
  }

  try {
    // Initialize the application
    const configPath = process.env.CLAUDE_SDK_CONFIG || undefined;
    const app = new ClaudeCodeApp(configPath);
    
    // Execute the command
    await command.handler(commandArgs, app);
    
  } catch (error) {
    console.error('❌ Command execution failed:', error);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (import.meta.main) {
  main().catch(error => {
    console.error('❌ CLI error:', error);
    process.exit(1);
  });
}