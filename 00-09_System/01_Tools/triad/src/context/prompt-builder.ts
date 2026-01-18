// Prompt Builder
// Constructs context-rich prompts for AI agents

import { config, type FocusArea } from "../utils/config";
import { searchClient } from "./search-client";
import { vramReader } from "./vram-reader";
import { logger } from "../utils/logger";

export interface PromptContext {
  focusArea: FocusArea;
  iteration: number;
  previousOutputs: string[];
  recentFiles?: string[];
  searchResults?: string[];
}

class PromptBuilder {
  /**
   * Build a comprehensive prompt for an agent
   */
  async buildPrompt(context: PromptContext): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push(this.buildHeader(context));

    // Focus area context
    sections.push(await this.buildFocusAreaContext(context.focusArea));

    // Recent files in the focus area
    const recentFilesSection = await this.buildRecentFilesSection(context.focusArea);
    if (recentFilesSection) {
      sections.push(recentFilesSection);
    }

    // Search-based context
    const searchSection = await this.buildSearchContext(context.focusArea);
    if (searchSection) {
      sections.push(searchSection);
    }

    // Previous outputs for continuity
    if (context.previousOutputs.length > 0) {
      sections.push(this.buildPreviousOutputsSection(context.previousOutputs));
    }

    // Task section
    sections.push(this.buildTaskSection(context.focusArea));

    return sections.join("\n\n---\n\n");
  }

  /**
   * Build the header section
   */
  private buildHeader(context: PromptContext): string {
    return `# Triad Analysis Session

**Focus Area**: ${context.focusArea.name}
**Iteration**: ${context.iteration}
**Timestamp**: ${new Date().toISOString()}

You are analyzing Ron Eddings' VRAM filesystem to provide valuable insights.`;
  }

  /**
   * Build focus area context
   */
  private async buildFocusAreaContext(focusArea: FocusArea): Promise<string> {
    let context = `## Focus Area: ${focusArea.name}\n\n`;

    if (focusArea.path) {
      const fullPath = `${config.vramPath}/${focusArea.path}`;
      context += `**Path**: ${fullPath}\n\n`;

      // Get directory info
      const dirInfo = await vramReader.getDirectoryInfo(focusArea.path);
      if (dirInfo) {
        context += `**Contents**: ${dirInfo.files} files in ${dirInfo.subdirectories} subdirectories\n`;
      }

      // Get subdirectories for structure overview
      const subdirs = await vramReader.listDirectories(focusArea.path);
      if (subdirs.length > 0) {
        context += `\n**Structure**:\n`;
        for (const subdir of subdirs.slice(0, 10)) {
          context += `- ${subdir}\n`;
        }
        if (subdirs.length > 10) {
          context += `- ... and ${subdirs.length - 10} more\n`;
        }
      }
    } else {
      context += "**Scope**: Cross-area meta-analysis\n";
      context += "Analyze patterns and connections across all areas.\n";
    }

    return context;
  }

  /**
   * Build section with recent files
   */
  private async buildRecentFilesSection(focusArea: FocusArea): Promise<string | null> {
    if (!focusArea.path) return null;

    try {
      const files = await vramReader.listFiles(focusArea.path, "**/*.{md,txt,json}");
      if (files.length === 0) return null;

      let section = `## Recent Files\n\n`;
      section += `Sample files in this area:\n\n`;

      for (const file of files.slice(0, 10)) {
        const info = await vramReader.getFileInfo(`${focusArea.path}/${file}`);
        if (info) {
          const modified = info.modifiedAt.toLocaleDateString();
          section += `- **${info.filename}** (${modified})\n`;
        }
      }

      if (files.length > 10) {
        section += `\n*${files.length - 10} more files available*\n`;
      }

      return section;
    } catch (error) {
      await logger.debug("prompt_files_error", {
        focusArea: focusArea.name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Build section with search-based context
   */
  private async buildSearchContext(focusArea: FocusArea): Promise<string | null> {
    if (!searchClient.isConnected()) {
      return null;
    }

    try {
      // Get relevant content from search database
      const searchTerms = this.getFocusAreaSearchTerms(focusArea);
      const results = searchClient.search(searchTerms, { limit: 5 });

      if (results.length === 0) return null;

      let section = `## Related Content (from search index)\n\n`;

      for (const result of results) {
        section += `### ${result.filename}\n`;
        section += `*${result.area} > ${result.category}*\n\n`;
        if (result.snippet) {
          section += `${result.snippet}\n\n`;
        }
      }

      return section;
    } catch (error) {
      await logger.debug("prompt_search_error", {
        focusArea: focusArea.name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Build section with previous outputs
   */
  private buildPreviousOutputsSection(previousOutputs: string[]): string {
    let section = `## Context from Previous Analysis\n\n`;
    section += `Recent insights to build upon:\n\n`;

    for (let i = 0; i < Math.min(3, previousOutputs.length); i++) {
      const output = previousOutputs[i];
      const truncated = output.length > 500 ? output.substring(0, 500) + "..." : output;
      section += `### Previous Output ${i + 1}\n\n${truncated}\n\n`;
    }

    return section;
  }

  /**
   * Build the task section
   */
  private buildTaskSection(focusArea: FocusArea): string {
    return `## Your Task

Analyze the "${focusArea.name}" area and provide:

1. **Key Observations**: What patterns or themes do you notice?
2. **Insights**: What valuable conclusions can be drawn?
3. **Opportunities**: What actions could benefit Ron?
4. **Connections**: How does this relate to other life areas?
5. **Recommendations**: Specific, actionable next steps

Use the search database at \`${config.searchDbPath}\` for deep content exploration.

Be thorough but focused. Quality insights over quantity.`;
  }

  /**
   * Get search terms for a focus area
   */
  private getFocusAreaSearchTerms(focusArea: FocusArea): string {
    const termMap: Record<string, string> = {
      hacker_valley_media: "podcast OR episode OR Hacker Valley OR cybersecurity",
      career_skills: "career OR skills OR professional OR development",
      financial: "budget OR investment OR finance OR money",
      personal_growth: "goals OR habits OR learning OR growth",
      relationships: "family OR relationships OR events",
      meta_analysis: "insight OR pattern OR connection OR summary",
    };

    return termMap[focusArea.id] || focusArea.name;
  }

  /**
   * Build a mini prompt for quick tasks
   */
  buildQuickPrompt(task: string, context: string = ""): string {
    return `${context ? context + "\n\n" : ""}Task: ${task}

Provide a concise, actionable response.`;
  }

  /**
   * Build an overseer synthesis prompt
   */
  buildOverseerPrompt(outputs: string[], focusArea: string, iteration: number): string {
    let prompt = `# Overseer Synthesis

**Focus Area**: ${focusArea}
**Iteration**: ${iteration}

## Agent Outputs to Synthesize

`;

    outputs.forEach((output, i) => {
      prompt += `### Agent ${i + 1}\n\n${output}\n\n`;
    });

    prompt += `## Your Synthesis Task

1. **Key Themes**: What common patterns emerge?
2. **Conflicts**: Any disagreements between agents?
3. **Priority Insights**: Most important findings?
4. **Action Items**: Concrete next steps for Ron
5. **Meta-Observations**: What should the system focus on next?

Provide a structured synthesis that maximizes value for Ron.`;

    return prompt;
  }
}

export const promptBuilder = new PromptBuilder();
