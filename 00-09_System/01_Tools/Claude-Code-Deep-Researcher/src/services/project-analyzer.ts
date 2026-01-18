import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, relative } from 'path';
import type { ClaudeCodeService } from './claude-code.ts';
import type { PromptExecutor } from './prompt-executor.ts';
import type { ExecutionResult } from '../types/index.ts';
import { ConfigManager } from './config.ts';

export interface ProjectStructure {
  files: FileInfo[];
  directories: string[];
  totalFiles: number;
  totalSize: number;
  fileTypes: { [key: string]: number };
  keyFiles: FileInfo[];
}

export interface FileInfo {
  path: string;
  relativePath: string;
  size: number;
  extension: string;
  isKey: boolean;
  content?: string;
}

export interface AnalysisResult {
  structure: ProjectStructure;
  analysis: ExecutionResult;
  sessionId: string;
  summary: string;
}

/**
 * Service for deep content analysis and understanding
 * Stage 1 of the context pre-baking system
 * Handles diverse content types: code, documents, transcripts, research, media, etc.
 */
export class ProjectAnalyzer {
  private promptExecutor: PromptExecutor;
  private projectRoot: string;
  private configManager: ConfigManager;

  // Key files that should always be analyzed (all content types)
  private keyFilePatterns = [
    // Documentation and information files
    'README.md', 'readme.md', 'README.txt', 'readme.txt',
    'CHANGELOG.md', 'HISTORY.md', 'NOTES.md', 'notes.md',
    'TODO.md', 'todo.txt', 'TASKS.md', 'tasks.txt',
    'INDEX.md', 'index.txt', 'CONTENTS.md', 'contents.txt',
    'SUMMARY.md', 'summary.txt', 'OVERVIEW.md', 'overview.txt',
    'INTRODUCTION.md', 'intro.txt', 'PREFACE.md', 'preface.txt',
    'GUIDE.md', 'guide.txt', 'MANUAL.md', 'manual.txt',
    // Research and academic files
    'abstract.txt', 'abstract.md', 'bibliography.txt', 'references.txt',
    'methodology.md', 'findings.md', 'conclusion.md', 'analysis.md',
    'literature-review.md', 'research.md', 'study.md', 'report.md',
    'thesis.md', 'dissertation.md', 'paper.md', 'article.md',
    // Business and project files
    'requirements.txt', 'requirements.md', 'specs.md', 'specifications.md',
    'proposal.md', 'proposal.txt', 'plan.md', 'plan.txt',
    'charter.md', 'charter.txt', 'scope.md', 'objectives.md',
    'strategy.md', 'roadmap.md', 'timeline.md', 'schedule.md',
    // Meeting and conversation files
    'transcript.txt', 'transcript.md', 'meeting-notes.md', 'minutes.md',
    'interview.md', 'conversation.txt', 'dialogue.md', 'discussion.md',
    'session-notes.md', 'call-log.md', 'recording-summary.md',
    // Content and media files
    'script.md', 'script.txt', 'content.md', 'copy.txt',
    'slides.md', 'presentation.md', 'deck.md', 'story.md',
    // Technical configuration files (when present)
    'package.json', 'tsconfig.json', 'config.json', 'settings.json',
    '.gitignore', '.env.example', 'Dockerfile', 'docker-compose.yml',
    'index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts'
  ];

  // File extensions to analyze (broad range for different content types)
  private contentExtensions = new Set([
    // Text and documentation
    '.md', '.txt', '.rtf', '.doc', '.docx', '.pdf',
    '.tex', '.rst', '.adoc', '.org',
    // Code and technical files
    '.js', '.ts', '.jsx', '.tsx', '.vue',
    '.py', '.rb', '.go', '.rs', '.java',
    '.c', '.cpp', '.h', '.hpp',
    '.css', '.scss', '.sass', '.less',
    '.html', '.htm', '.xml', '.svg',
    // Data and configuration
    '.json', '.yaml', '.yml', '.toml', '.ini', '.cfg',
    '.csv', '.tsv', '.xlsx', '.xls',
    // Research and academic
    '.bib', '.ris', '.enw',
    // Transcripts and conversations
    '.transcript', '.log', '.chat',
    // Archives and compressed
    '.zip', '.tar', '.gz', '.7z',
    // Environment and system
    '.env', '.sh', '.bat', '.ps1',
    // Media metadata
    '.srt', '.vtt', '.ass'
  ]);

  // Directories to skip (common system/cache directories)
  private skipDirectories = new Set([
    // Version control and system
    '.git', '.svn', '.hg', '.bzr',
    // Editor and IDE
    '.vscode', '.idea', '.vs', '.atom',
    // Build and development artifacts  
    'node_modules', 'dist', 'build', 'target', 'bin', 'obj',
    '.next', '.nuxt', 'coverage', '.nyc_output',
    // Temporary and cache directories
    'tmp', 'temp', '.tmp', '.temp', 'cache', '.cache',
    'logs', '.logs', '__pycache__', '.pytest_cache',
    // Cloud and deployment
    '.serverless', '.aws', '.azure', '.gcp',
    // System directories
    '.DS_Store', 'Thumbs.db', '$RECYCLE.BIN'
  ]);

  // Files to skip (large generated or lock files)
  private skipFiles = new Set([
    // Package manager lock files
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'Pipfile.lock', 'poetry.lock', 'composer.lock', 'Gemfile.lock',
    // Large data files that are typically not meant for analysis
    'data.json', 'dataset.csv', 'database.sql', 'dump.sql',
    // System files
    '.DS_Store', 'Thumbs.db', 'desktop.ini',
    // Large media files (keep smaller ones for metadata analysis)
    '*.mp4', '*.avi', '*.mov', '*.mkv', '*.mp3', '*.wav', '*.flac'
  ]);

  constructor(promptExecutor: PromptExecutor, projectRoot: string = process.cwd(), configManager?: ConfigManager) {
    this.promptExecutor = promptExecutor;
    this.projectRoot = projectRoot;
    this.configManager = configManager || new ConfigManager();
  }

  /**
   * Performs comprehensive content analysis with ALL files included
   */
  async analyzeProject(customPrompt?: string): Promise<AnalysisResult> {
    console.log('🔍 Starting deep content analysis...');
    
    // Step 1: Scan project structure (include ALL files when no custom prompt)
    const structure = await this.scanProjectStructure(customPrompt);
    console.log(`📊 Found ${structure.totalFiles} files in ${structure.directories.length} directories`);

    // Step 2: Generate comprehensive analysis prompt
    const analysisPrompt = this.generateAnalysisPrompt(structure, customPrompt);

    // Step 3: Run deep analysis with Claude Code
    const analysis = await this.promptExecutor.runPrompt(analysisPrompt);

    // Check if analysis failed
    if (!analysis.success) {
      console.error(`❌ Analysis failed: ${analysis.error}`);
      throw new Error(`Content analysis failed: ${analysis.error}`);
    }

    if (!analysis.sessionId) {
      console.error('❌ No session ID returned from analysis');
      throw new Error('Content analysis did not return a valid session ID');
    }

    // Step 4: Generate summary
    const summary = this.generateProjectSummary(structure, analysis);

    return {
      structure,
      analysis,
      sessionId: analysis.sessionId,
      summary
    };
  }

  /**
   * Performs content analysis with a custom prompt
   */
  async analyzeProjectWithCustomPrompt(customPrompt: string): Promise<AnalysisResult> {
    console.log('🔍 Starting custom content analysis...');
    
    // Use the main analyzeProject method with custom prompt
    return this.analyzeProject(customPrompt);
  }

  /**
   * Analyzes large projects in batches to handle file limits
   */
  async analyzeProjectInBatches(customPrompt?: string): Promise<AnalysisResult> {
    console.log('🔍 Starting batched project analysis...');
    
    // Step 1: Scan project structure
    const structure = await this.scanProjectStructure(customPrompt);
    const maxFilesPerBatch = this.configManager.get('prebakeEnhancements.stage1.maxFilesPerBatch') || 50;
    
    console.log(`📊 Found ${structure.totalFiles} files in ${structure.directories.length} directories`);
    
    if (structure.files.length <= maxFilesPerBatch) {
      // No batching needed, use regular analysis
      return this.analyzeProject(customPrompt);
    }
    
    // Step 2: Create file batches
    const batches = this.createFileBatches(structure.files, maxFilesPerBatch);
    console.log(`📦 Processing ${batches.length} batches of ${maxFilesPerBatch} files each`);
    
    // Step 3: Process each batch
    const batchResults: ExecutionResult[] = [];
    let mainSessionId: string | undefined;
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} files)...`);
      
      // Create batch-specific structure
      const batchStructure: ProjectStructure = {
        files: batch,
        directories: structure.directories,
        totalFiles: batch.length,
        totalSize: batch.reduce((sum, f) => sum + f.size, 0),
        fileTypes: this.getFileTypesFromFiles(batch),
        keyFiles: batch.filter(f => f.isKey)
      };
      
      // Generate batch-specific prompt
      const batchPrompt = this.generateBatchPrompt(batchStructure, i + 1, batches.length, customPrompt);
      
      // Run analysis for this batch with retry logic
      const batchResult = await this.runBatchWithRetry(batchPrompt, i + 1, 3);
      
      if (!batchResult.success) {
        console.error(`❌ Batch ${i + 1} analysis failed after retries: ${batchResult.error}`);
        throw new Error(`Batch analysis failed: ${batchResult.error}`);
      }
      
      batchResults.push(batchResult);
      
      // Use the first batch's session ID as main session
      if (i === 0) {
        mainSessionId = batchResult.sessionId;
      }
    }
    
    // Step 4: Consolidate batch results
    const consolidatedResult = this.consolidateBatchResults(batchResults, structure);
    
    // Step 5: Generate summary
    const summary = this.generateProjectSummary(structure, consolidatedResult);
    
    return {
      structure,
      analysis: consolidatedResult,
      sessionId: mainSessionId || consolidatedResult.sessionId || 'batch-analysis',
      summary
    };
  }

  /**
   * Creates file batches for processing
   */
  private createFileBatches(files: FileInfo[], batchSize: number): FileInfo[][] {
    const batches: FileInfo[][] = [];
    
    for (let i = 0; i < files.length; i += batchSize) {
      batches.push(files.slice(i, i + batchSize));
    }
    
    return batches;
  }

  /**
   * Gets file type distribution from a list of files
   */
  private getFileTypesFromFiles(files: FileInfo[]): { [key: string]: number } {
    const fileTypes: { [key: string]: number } = {};
    
    files.forEach(file => {
      if (file.extension) {
        fileTypes[file.extension] = (fileTypes[file.extension] || 0) + 1;
      }
    });
    
    return fileTypes;
  }

  /**
   * Generates a batch-specific analysis prompt
   */
  private generateBatchPrompt(batchStructure: ProjectStructure, batchNumber: number, totalBatches: number, customPrompt?: string): string {
    const fileTree = this.generateFileTree(batchStructure);
    const fileTypeStats = Object.entries(batchStructure.fileTypes)
      .sort(([,a], [,b]) => b - a)
      .map(([ext, count]) => `${ext}: ${count} files`)
      .join(', ');
    
    if (!customPrompt) {
      const allFilePaths = batchStructure.files.map(f => f.relativePath);
      
      return `**BATCH ${batchNumber}/${totalBatches}**: Read and analyze files in this batch for comprehensive project understanding.

# BATCH OVERVIEW

## Files in this batch (${batchStructure.totalFiles} files, ${Math.round(batchStructure.totalSize / 1024)}KB)
\`\`\`
${fileTree}
\`\`\`

## File Type Distribution (this batch)
${fileTypeStats}

# BATCH INSTRUCTIONS

**READ EVERY FILE IN THIS BATCH:**

${allFilePaths.map(path => `- Use Read tool on: ${path}`).join('\n')}

**IMPORTANT**: This is batch ${batchNumber} of ${totalBatches}. Focus on analyzing these specific files while maintaining awareness that this is part of a larger project analysis.

# ANALYSIS FOR THIS BATCH

Analyze the files in this batch and provide insights about:
1. Content and purpose of files in this batch
2. How these files relate to overall project structure
3. Key patterns, dependencies, or relationships discovered
4. Notable findings or insights from this subset

**Continue to maintain comprehensive analysis across all batches.**`;
    } else {
      // Enhanced custom prompt for batch
      return this.enhanceCustomPrompt(`BATCH ${batchNumber}/${totalBatches}: ${customPrompt}`, batchStructure);
    }
  }

  /**
   * Runs a batch with retry logic for failures
   */
  private async runBatchWithRetry(batchPrompt: string, batchNumber: number, maxRetries: number): Promise<ExecutionResult> {
    let lastError: string = '';
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} for batch ${batchNumber}...`);
        
        const result = await this.promptExecutor.runPrompt(batchPrompt);
        
        if (result.success) {
          if (attempt > 1) {
            console.log(`✅ Batch ${batchNumber} succeeded on attempt ${attempt}`);
          }
          return result;
        }
        
        lastError = result.error || 'Unknown error';
        console.warn(`⚠️ Batch ${batchNumber} attempt ${attempt} failed: ${lastError}`);
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`⚠️ Batch ${batchNumber} attempt ${attempt} threw error: ${lastError}`);
        
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    return {
      success: false,
      messages: [],
      error: `Batch ${batchNumber} failed after ${maxRetries} attempts. Last error: ${lastError}`
    };
  }

  /**
   * Consolidates results from multiple batches
   */
  private consolidateBatchResults(batchResults: ExecutionResult[], structure: ProjectStructure): ExecutionResult {
    // Combine all messages from batches
    const allMessages = batchResults.flatMap(result => result.messages || []);
    
    // Calculate total costs and tokens
    const totalCost = batchResults.reduce((sum, result) => sum + (result.cost || 0), 0);
    const totalTokensInput = batchResults.reduce((sum, result) => sum + (result.tokenUsage?.input || 0), 0);
    const totalTokensOutput = batchResults.reduce((sum, result) => sum + (result.tokenUsage?.output || 0), 0);
    
    // Combine extracted results
    const combinedResults = batchResults
      .map(result => result.extractedResult || '')
      .filter(result => result.length > 0)
      .join('\n\n---\n\n');
    
    // Calculate total execution time
    const totalExecutionTime = batchResults.reduce((sum, result) => sum + (result.executionTime || 0), 0);
    
    return {
      success: true,
      messages: allMessages,
      sessionId: batchResults[0]?.sessionId,
      extractedResult: combinedResults,
      cost: totalCost,
      tokenUsage: {
        input: totalTokensInput,
        output: totalTokensOutput
      },
      executionTime: totalExecutionTime
    };
  }

  /**
   * Scans the directory structure and content
   * When customPrompt is undefined, includes ALL discovered files for comprehensive analysis
   */
  private async scanProjectStructure(customPrompt?: string): Promise<ProjectStructure> {
    const files: FileInfo[] = [];
    const directories: string[] = [];
    const fileTypes: { [key: string]: number } = {};
    let totalSize = 0;
    const skippedFiles: string[] = [];
    const skippedReasons: { [key: string]: string } = {};

    const scanDirectory = (dirPath: string, relativeDirPath: string = '') => {
      const relativeDir = relative(this.projectRoot, dirPath);
      if (this.skipDirectories.has(relativeDir)) {
        return;
      }

      try {
        const entries = readdirSync(dirPath);
        
        for (const entry of entries) {
          const fullPath = join(dirPath, entry);
          const relativePath = join(relativeDirPath, entry);
          
          try {
            const stats = statSync(fullPath);
            
            if (stats.isDirectory()) {
              if (!this.skipDirectories.has(entry)) {
                directories.push(relativePath);
                scanDirectory(fullPath, relativePath);
              }
            } else if (stats.isFile()) {
              // Skip large generated files
              if (this.skipFiles.has(entry)) {
                continue;
              }

              const extension = extname(entry).toLowerCase();
              
              // When no custom prompt: include ALL files (remove filtering)
              // When custom prompt exists: use existing selective content reading
              const shouldIncludeFile = !customPrompt || 
                                       this.contentExtensions.has(extension) || 
                                       this.isKeyFile(entry);
              
              if (shouldIncludeFile) {
                const fileInfo: FileInfo = {
                  path: fullPath,
                  relativePath,
                  size: stats.size,
                  extension,
                  isKey: this.isKeyFile(entry)
                };

                // When no custom prompt: don't filter by size, include all files
                // When custom prompt: preserve existing size-based content reading
                if (!customPrompt) {
                  // No size restrictions - include ALL files for comprehensive analysis
                  try {
                    fileInfo.content = readFileSync(fullPath, 'utf-8');
                  } catch (error) {
                    // Enhanced error handling for file access issues
                    this.handleFileReadError(error, relativePath, 'comprehensive analysis', skippedFiles, skippedReasons);
                  }
                } else {
                  // Existing logic: Read content for key files and small files
                  if (fileInfo.isKey || stats.size < 50000) { // < 50KB
                    try {
                      fileInfo.content = readFileSync(fullPath, 'utf-8');
                    } catch (error) {
                      // Enhanced error handling for file access issues
                      this.handleFileReadError(error, relativePath, 'selective analysis', skippedFiles, skippedReasons);
                    }
                  }
                }

                files.push(fileInfo);
                totalSize += stats.size;

                // Track file type usage
                if (extension) {
                  fileTypes[extension] = (fileTypes[extension] || 0) + 1;
                }
              }
            }
          } catch (error) {
            // Enhanced error handling with fallback strategies
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            if (errorMessage.includes('EACCES') || errorMessage.includes('permission denied')) {
              console.warn(`⚠️ Permission denied for ${relativePath} - creating fallback entry`);
              // Create fallback entry for permission denied files
              try {
                const fallbackInfo = this.createFileInfoFallback(fullPath, relativePath, { size: 0 }, 'Permission denied');
                files.push(fallbackInfo);
              } catch (fallbackError) {
                console.warn(`⚠️ Failed to create fallback for ${relativePath}: ${fallbackError}`);
              }
            } else {
              console.warn(`⚠️ Skipping ${relativePath}: ${errorMessage}`);
            }
          }
        }
      } catch (error) {
        console.warn(`⚠️ Cannot read directory ${dirPath}: ${error}`);
      }
    };

    scanDirectory(this.projectRoot);

    // Identify key files
    const keyFiles = files.filter(f => f.isKey);

    // Log skipped files for transparency
    if (skippedFiles.length > 0) {
      console.log(`📋 Skipped ${skippedFiles.length} files during analysis:`);
      skippedFiles.forEach(file => {
        console.log(`   - ${file}: ${skippedReasons[file]}`);
      });
    }

    return {
      files,
      directories,
      totalFiles: files.length,
      totalSize,
      fileTypes,
      keyFiles
    };
  }

  /**
   * Enhanced error handling for file access issues
   */
  private handleFileReadError(error: any, filePath: string, context: string, skippedFiles?: string[], skippedReasons?: { [key: string]: string }): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let reason = '';
    
    if (errorMessage.includes('EACCES') || errorMessage.includes('permission denied')) {
      reason = 'Permission denied';
      console.warn(`⚠️ Permission denied for ${filePath} during ${context} - skipping file`);
    } else if (errorMessage.includes('EISDIR')) {
      reason = 'Is directory';
      console.warn(`⚠️ ${filePath} is a directory, not a file - skipping`);
    } else if (errorMessage.includes('ENOENT')) {
      reason = 'File not found';
      console.warn(`⚠️ File ${filePath} not found - may have been deleted during scan`);
    } else if (errorMessage.includes('EMFILE') || errorMessage.includes('ENFILE')) {
      console.warn(`⚠️ Too many open files - system limit reached at ${filePath}`);
      // For file handle exhaustion, we should throw to stop scanning
      throw new Error(`File handle limit exceeded. Consider reducing batch size or file count.`);
    } else if (this.isBinaryFileError(errorMessage, filePath)) {
      reason = 'Binary file';
      console.warn(`⚠️ Skipping binary file ${filePath} during ${context}`);
    } else {
      reason = errorMessage;
      console.warn(`⚠️ Failed to read ${filePath} during ${context}: ${errorMessage}`);
    }
    
    // Track skipped files for transparency
    if (skippedFiles && skippedReasons) {
      skippedFiles.push(filePath);
      skippedReasons[filePath] = reason;
    }
  }

  /**
   * Determines if the error is due to trying to read a binary file as text
   */
  private isBinaryFileError(errorMessage: string, filePath: string): boolean {
    // Common binary file extensions
    const binaryExtensions = ['.exe', '.dll', '.so', '.dylib', '.bin', '.dat', 
                             '.img', '.iso', '.zip', '.tar', '.gz', '.7z',
                             '.mp3', '.mp4', '.avi', '.mkv', '.jpg', '.png', '.gif'];
    
    const extension = extname(filePath).toLowerCase();
    return binaryExtensions.includes(extension) || 
           errorMessage.includes('Invalid character') ||
           errorMessage.includes('malformed');
  }

  /**
   * Implements fallback strategies for unreadable files
   */
  private createFileInfoFallback(filePath: string, relativePath: string, stats: any, reason: string): FileInfo {
    const extension = extname(filePath).toLowerCase();
    
    return {
      path: filePath,
      relativePath,
      size: stats.size,
      extension,
      isKey: this.isKeyFile(filePath),
      content: `[FILE UNREADABLE: ${reason}]`
    };
  }

  /**
   * Checks if a file is considered a key content file
   */
  private isKeyFile(filename: string): boolean {
    return this.keyFilePatterns.some(pattern => {
      if (pattern.includes('*')) {
        return filename.match(new RegExp(pattern.replace('*', '.*')));
      }
      return filename === pattern || filename.toLowerCase() === pattern.toLowerCase();
    });
  }

  /**
   * Enhances a custom prompt with content structure context
   */
  private enhanceCustomPrompt(customPrompt: string, structure: ProjectStructure): string {
    const keyFileContents = structure.keyFiles
      .filter(f => f.content)
      .map(f => `## ${f.relativePath}\n\`\`\`\n${f.content}\`\`\``)
      .join('\n\n');

    const fileTree = this.generateFileTree(structure);
    const fileTypeStats = Object.entries(structure.fileTypes)
      .sort(([,a], [,b]) => b - a)
      .map(([ext, count]) => `${ext}: ${count} files`)
      .join(', ');

    return `${customPrompt}

# CONTENT CONTEXT PROVIDED

## File Tree (${structure.totalFiles} files, ${Math.round(structure.totalSize / 1024)}KB)
\`\`\`
${fileTree}
\`\`\`

## File Type Distribution
${fileTypeStats}

## Key Files Analysis
${keyFileContents}

Please use this content context to fulfill the above request.`;
  }

  /**
   * Generates comprehensive analysis prompt
   * When customPrompt is undefined, generates explicit file reading instructions
   */
  private generateAnalysisPrompt(structure: ProjectStructure, customPrompt?: string): string {
    const fileTree = this.generateFileTree(structure);
    const fileTypeStats = Object.entries(structure.fileTypes)
      .sort(([,a], [,b]) => b - a)
      .map(([ext, count]) => `${ext}: ${count} files`)
      .join(', ');

    if (!customPrompt) {
      // Generate prompt that explicitly requests reading ALL files
      const allFilePaths = structure.files.map(f => f.relativePath);
      const maxFilesPerBatch = this.configManager.get('prebakeEnhancements.stage1.maxFilesPerBatch') || 50;
      
      // Determine if batching is needed
      const needsBatching = allFilePaths.length > maxFilesPerBatch;
      const batchInfo = needsBatching ? 
        `\n\n# BATCHING STRATEGY\n\nThis project has ${allFilePaths.length} files, which exceeds the batch limit of ${maxFilesPerBatch}.\nProcess files in batches of ${maxFilesPerBatch} to ensure all files are analyzed systematically.\nEnsure session continuity across batches and maintain comprehensive coverage.` : '';
      
      return `Read and analyze EVERY file in this project to provide comprehensive understanding.

# PROJECT OVERVIEW

## File Tree (${structure.totalFiles} files, ${Math.round(structure.totalSize / 1024)}KB)
\`\`\`
${fileTree}
\`\`\`

## File Type Distribution
${fileTypeStats}${batchInfo}

# CRITICAL INSTRUCTIONS

**YOU MUST USE THE READ TOOL ON EVERY SINGLE FILE LISTED BELOW:**

${allFilePaths.map(path => `- Use Read tool on: ${path}`).join('\n')}

**DO NOT SKIP ANY FILES** - Read all ${structure.totalFiles} files regardless of size or type.

# ANALYSIS REQUIREMENTS

After reading ALL files, provide comprehensive analysis covering:

1. **Content Purpose & Domain**: What is this collection for? What type of content does it contain? What domain or field does it relate to?
2. **Organization & Structure**: How is the content organized? What patterns, hierarchies, or organizational principles can you identify?
3. **Content Types & Formats**: What types of files, documents, or materials are present? What formats and media types are used?
4. **Key Components & Sections**: What are the main elements, themes, topics, or sections? What appears to be most important?
5. **Relationships & Connections**: How do the different parts relate to each other? Are there clear workflows, dependencies, or logical sequences?
6. **Context & Background**: What context, background information, or broader purpose can you infer from the content?
7. **Usage & Workflow**: How might this content be used, processed, or consumed? What appears to be the intended audience or use case?
8. **Dependencies & References**: What external references, sources, links, tools, or dependencies are mentioned or required?
9. **Quality & Completeness**: What is the apparent state, quality, and completeness of the content? Are there gaps or areas that seem unfinished?
10. **Getting Started**: What would someone need to know to understand, navigate, or work with this content effectively?

Focus on understanding the content holistically. Adapt your analysis approach based on what you discover - whether it's software code, business documents, research materials, meeting transcripts, creative content, educational materials, or any other type of content.

**Remember: You must read ALL ${structure.totalFiles} files before providing your analysis.**`;
    } else {
      // Use custom prompt with enhanced context
      return this.enhanceCustomPrompt(customPrompt, structure);
    }
  }

  /**
   * Generates a file tree representation
   */
  private generateFileTree(structure: ProjectStructure): string {
    const tree: { [key: string]: any } = {};
    
    // Build tree structure
    structure.files.forEach(file => {
      const parts = file.relativePath.split('/');
      let current = tree;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue; // Skip empty parts
        
        if (i === parts.length - 1) {
          // It's a file
          current[part] = file.isKey ? '📋' : '📄';
        } else {
          // It's a directory
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part] as { [key: string]: any };
        }
      }
    });

    // Convert tree to string representation
    const renderTree = (obj: any, prefix = ''): string => {
      const entries = Object.entries(obj);
      return entries.map(([key, value], index) => {
        const isLast = index === entries.length - 1;
        const currentPrefix = prefix + (isLast ? '└── ' : '├── ');
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        
        if (typeof value === 'string') {
          return `${currentPrefix}${value} ${key}`;
        } else {
          return `${currentPrefix}📁 ${key}\n${renderTree(value, nextPrefix)}`;
        }
      }).join('\n');
    };

    return renderTree(tree);
  }

  /**
   * Generates a content analysis summary
   */
  private generateProjectSummary(structure: ProjectStructure, analysis: ExecutionResult): string {
    const extractedResult = analysis.extractedResult || 'Analysis completed';
    
    return `# Content Analysis Summary

**Location**: ${relative(process.cwd(), this.projectRoot) || 'Current Directory'}
**Files**: ${structure.totalFiles} (${Math.round(structure.totalSize / 1024)}KB)
**File Types**: ${Object.keys(structure.fileTypes).join(', ')}
**Analysis Cost**: $${analysis.cost?.toFixed(4) || '0.0000'}
**Tokens**: ${analysis.tokenUsage?.input || 0}→${analysis.tokenUsage?.output || 0}

## Key Insights
${extractedResult}

**Session ID**: ${analysis.sessionId}
**Generated**: ${new Date().toISOString()}`;
  }
}