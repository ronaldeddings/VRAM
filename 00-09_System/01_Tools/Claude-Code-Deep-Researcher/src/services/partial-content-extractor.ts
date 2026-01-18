/**
 * Partial Content Extractor Service
 *
 * Intelligently extracts only relevant portions of large file contents:
 * - Multi-pass relevance detection
 * - Section-level extraction (Markdown headers, code functions, config keys)
 * - Keep only referenced sections, summarize remainder
 * - Preserve enough context for understanding
 */

import type {
  ConversationEntry,
  UserMessageEntry,
  AssistantMessageEntry,
  ToolResultContent,
} from '../types/claude-conversation';

// =====================================
// Extraction Types
// =====================================

/** Extracted section from large content */
export interface ExtractedSection {
  /** Section type */
  type: 'markdown-header' | 'code-function' | 'code-class' | 'config-block' | 'full-content';

  /** Section title/identifier */
  title: string;

  /** Extracted content */
  content: string;

  /** Start line number (if available) */
  startLine?: number;

  /** End line number (if available) */
  endLine?: number;

  /** Why this section was included */
  inclusionReason: string;
}

/** Partial extraction result */
export interface PartialExtractionResult {
  /** Original content size */
  originalSize: number;

  /** Extracted content size */
  extractedSize: number;

  /** Reduction percentage */
  reductionPercent: number;

  /** Extracted sections */
  sections: ExtractedSection[];

  /** Summary of omitted content */
  omittedSummary?: string;

  /** Whether full content was kept */
  keptFullContent: boolean;
}

/** Reference detected in conversation */
export interface ContentReference {
  /** Type of reference */
  type: 'keyword' | 'code-snippet' | 'section-mention' | 'contextual';

  /** Referenced text */
  text: string;

  /** Where the reference appeared */
  sourceEntry: string; // UUID

  /** Confidence score (0.0-1.0) */
  confidence: number;
}

/** Extraction configuration */
export interface ExtractionConfig {
  /** Minimum content size to trigger extraction (characters) */
  minSizeForExtraction: number;

  /** Maximum size to keep full content (characters) */
  maxFullContentSize: number;

  /** Target size after extraction (characters) */
  targetExtractedSize: number;

  /** Include context lines around extracted sections */
  contextLines: number;

  /** Minimum confidence score for reference detection */
  minConfidence: number;
}

// =====================================
// Default Configuration
// =====================================

export const DEFAULT_EXTRACTION_CONFIG: ExtractionConfig = {
  minSizeForExtraction: 2000,     // Extract from content >2KB
  maxFullContentSize: 1000,       // Keep full content if <1KB
  targetExtractedSize: 5000,      // Aim for ~5KB after extraction
  contextLines: 2,                // Include 2 lines context
  minConfidence: 0.3,             // Minimum confidence to include reference
};

// =====================================
// Core Extraction Functions
// =====================================

/**
 * Detect references to content in subsequent conversation
 */
export function detectContentReferences(
  toolResultContent: string,
  toolResultIndex: number,
  allEntries: ConversationEntry[]
): ContentReference[] {
  const references: ContentReference[] = [];

  // Look at entries after this tool result
  for (let i = toolResultIndex + 1; i < allEntries.length; i++) {
    const entry = allEntries[i];

    // Check assistant messages for references
    if (entry.type === 'assistant') {
      const assistantText = entry.message.content
        .filter(c => c.type === 'text')
        .map(c => c.type === 'text' ? c.text : '')
        .join(' ');

      // Detect different types of references
      references.push(
        ...detectKeywordReferences(toolResultContent, assistantText, entry.message.id),
        ...detectCodeSnippetReferences(toolResultContent, assistantText, entry.message.id),
        ...detectSectionMentions(toolResultContent, assistantText, entry.message.id),
        ...detectContextualReferences(toolResultContent, assistantText, entry.message.id)
      );
    }

    // Stop after checking next 10 messages (optimization)
    if (i - toolResultIndex > 10) break;
  }

  return deduplicateReferences(references);
}

/**
 * Extract relevant sections based on detected references
 */
export function extractRelevantSections(
  content: string,
  references: ContentReference[],
  config: ExtractionConfig = DEFAULT_EXTRACTION_CONFIG
): PartialExtractionResult {
  const originalSize = content.length;

  // If content is small enough, keep it all
  if (originalSize <= config.maxFullContentSize) {
    return {
      originalSize,
      extractedSize: originalSize,
      reductionPercent: 0,
      sections: [{
        type: 'full-content',
        title: 'Full Content',
        content,
        inclusionReason: 'Content small enough to keep entirely',
      }],
      keptFullContent: true,
    };
  }

  // If no references found, create intelligent summary
  if (references.length === 0) {
    const summary = createIntelligentSummary(content);
    return {
      originalSize,
      extractedSize: summary.length,
      reductionPercent: ((originalSize - summary.length) / originalSize) * 100,
      sections: [{
        type: 'full-content',
        title: 'Summary',
        content: summary,
        inclusionReason: 'No specific references found, created summary',
      }],
      omittedSummary: `Omitted ${originalSize - summary.length} characters of unreferenced content`,
      keptFullContent: false,
    };
  }

  // Extract referenced sections
  const sections = extractSectionsFromReferences(content, references, config);

  const extractedSize = sections.reduce((sum, s) => sum + s.content.length, 0);

  // If extraction didn't save much, keep full content
  const reductionPercent = ((originalSize - extractedSize) / originalSize) * 100;
  if (reductionPercent < 20) {
    return {
      originalSize,
      extractedSize: originalSize,
      reductionPercent: 0,
      sections: [{
        type: 'full-content',
        title: 'Full Content',
        content,
        inclusionReason: 'Extraction saved <20%, keeping full content',
      }],
      keptFullContent: true,
    };
  }

  return {
    originalSize,
    extractedSize,
    reductionPercent,
    sections,
    omittedSummary: createOmittedSummary(content, sections),
    keptFullContent: false,
  };
}

/**
 * Apply partial extraction to tool result
 */
export function applyPartialExtraction(
  toolResult: ToolResultContent,
  toolResultIndex: number,
  allEntries: ConversationEntry[],
  config: ExtractionConfig = DEFAULT_EXTRACTION_CONFIG
): { modified: boolean; newContent: string; extractionResult?: PartialExtractionResult } {
  // Handle undefined/null content
  if (toolResult.content === undefined || toolResult.content === null) {
    return { modified: false, newContent: '' };
  }

  // Extract content string
  const contentStr = typeof toolResult.content === 'string'
    ? toolResult.content
    : JSON.stringify(toolResult.content);

  // Check if extraction is warranted
  if (contentStr.length < config.minSizeForExtraction) {
    return { modified: false, newContent: contentStr };
  }

  // Detect references
  const references = detectContentReferences(contentStr, toolResultIndex, allEntries);

  // Extract relevant sections
  const extractionResult = extractRelevantSections(contentStr, references, config);

  // Build new content
  let newContent = '';

  if (extractionResult.keptFullContent) {
    newContent = contentStr;
  } else {
    // Add metadata header
    newContent += `[OPTIMIZED: Extracted ${extractionResult.sections.length} relevant sections, `;
    newContent += `reduced from ${formatSize(extractionResult.originalSize)} to ${formatSize(extractionResult.extractedSize)}]\n\n`;

    // Add sections
    for (const section of extractionResult.sections) {
      newContent += `--- ${section.title} ---\n`;
      if (section.inclusionReason) {
        newContent += `[Reason: ${section.inclusionReason}]\n`;
      }
      newContent += section.content + '\n\n';
    }

    // Add omitted summary if available
    if (extractionResult.omittedSummary) {
      newContent += `--- Omitted Content Summary ---\n`;
      newContent += extractionResult.omittedSummary + '\n';
    }
  }

  return {
    modified: !extractionResult.keptFullContent,
    newContent,
    extractionResult,
  };
}

// =====================================
// Reference Detection Functions
// =====================================

/**
 * Detect keyword references (e.g., "installation", "API", "configuration")
 */
function detectKeywordReferences(
  content: string,
  assistantText: string,
  sourceEntryId: string
): ContentReference[] {
  const references: ContentReference[] = [];

  // Extract potential section headers from content
  const headers = extractHeaders(content);

  for (const header of headers) {
    // Check if header keywords appear in assistant text
    const keywords = header.toLowerCase().split(/\s+/);

    for (const keyword of keywords) {
      if (keyword.length < 4) continue; // Skip short words

      if (assistantText.toLowerCase().includes(keyword)) {
        references.push({
          type: 'keyword',
          text: header,
          sourceEntry: sourceEntryId,
          confidence: 0.6,
        });
        break;
      }
    }
  }

  return references;
}

/**
 * Detect code snippet references (direct code copying)
 */
function detectCodeSnippetReferences(
  content: string,
  assistantText: string,
  sourceEntryId: string
): ContentReference[] {
  const references: ContentReference[] = [];

  // Extract code blocks from content
  const codeBlocks = extractCodeBlocks(content);

  for (const block of codeBlocks) {
    // Check for direct mentions of code (look for significant overlap)
    const codeLines = block.split('\n').filter(l => l.trim().length > 10);

    for (const line of codeLines) {
      if (assistantText.includes(line.trim())) {
        references.push({
          type: 'code-snippet',
          text: block.substring(0, 200), // First 200 chars
          sourceEntry: sourceEntryId,
          confidence: 0.9,
        });
        break;
      }
    }
  }

  return references;
}

/**
 * Detect section mentions (e.g., "As the README explains...")
 */
function detectSectionMentions(
  content: string,
  assistantText: string,
  sourceEntryId: string
): ContentReference[] {
  const references: ContentReference[] = [];

  // Common mention patterns
  const mentionPatterns = [
    /as (?:the |mentioned in |shown in |described in )?([^,.]+)/gi,
    /according to (?:the )?([^,.]+)/gi,
    /in (?:the )?([A-Z][^,.]+) (?:section|file|documentation)/gi,
  ];

  for (const pattern of mentionPatterns) {
    const matches = assistantText.matchAll(pattern);

    for (const match of matches) {
      if (match[1]) {
        references.push({
          type: 'section-mention',
          text: match[1],
          sourceEntry: sourceEntryId,
          confidence: 0.7,
        });
      }
    }
  }

  return references;
}

/**
 * Detect contextual references (topic continuity)
 */
function detectContextualReferences(
  content: string,
  assistantText: string,
  sourceEntryId: string
): ContentReference[] {
  const references: ContentReference[] = [];

  // Extract key topics from content (simplified)
  const topics = extractTopics(content);

  for (const topic of topics) {
    if (assistantText.toLowerCase().includes(topic.toLowerCase())) {
      references.push({
        type: 'contextual',
        text: topic,
        sourceEntry: sourceEntryId,
        confidence: 0.4,
      });
    }
  }

  return references;
}

/**
 * Deduplicate references
 */
function deduplicateReferences(references: ContentReference[]): ContentReference[] {
  const seen = new Set<string>();
  const unique: ContentReference[] = [];

  for (const ref of references) {
    const key = `${ref.type}:${ref.text.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(ref);
    }
  }

  return unique.sort((a, b) => b.confidence - a.confidence);
}

// =====================================
// Section Extraction Functions
// =====================================

/**
 * Extract sections from content based on references
 */
function extractSectionsFromReferences(
  content: string,
  references: ContentReference[],
  config: ExtractionConfig
): ExtractedSection[] {
  const sections: ExtractedSection[] = [];

  // Detect file type
  const fileType = detectFileType(content);

  if (fileType === 'markdown') {
    sections.push(...extractMarkdownSections(content, references, config));
  } else if (fileType === 'code') {
    sections.push(...extractCodeSections(content, references, config));
  } else if (fileType === 'config') {
    sections.push(...extractConfigSections(content, references, config));
  } else {
    // Generic extraction
    sections.push(...extractGenericSections(content, references, config));
  }

  return sections;
}

/**
 * Extract Markdown sections based on headers
 */
function extractMarkdownSections(
  content: string,
  references: ContentReference[],
  config: ExtractionConfig
): ExtractedSection[] {
  const sections: ExtractedSection[] = [];
  const lines = content.split('\n');

  let currentSection: { title: string; content: string[]; startLine: number } | null = null;

  lines.forEach((line, index) => {
    // Detect header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)/);

    if (headerMatch) {
      // Save previous section if it matches references
      if (currentSection) {
        const matchingRef = references.find(ref =>
          currentSection!.title.toLowerCase().includes(ref.text.toLowerCase())
        );

        if (matchingRef) {
          sections.push({
            type: 'markdown-header',
            title: currentSection.title,
            content: currentSection.content.join('\n'),
            startLine: currentSection.startLine,
            endLine: index - 1,
            inclusionReason: `Referenced as "${matchingRef.text}" (${matchingRef.type})`,
          });
        }
      }

      // Start new section
      currentSection = {
        title: headerMatch[2],
        content: [line],
        startLine: index,
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    }
  });

  // Check final section
  if (currentSection) {
    const matchingRef = references.find(ref =>
      currentSection!.title.toLowerCase().includes(ref.text.toLowerCase())
    );

    if (matchingRef) {
      sections.push({
        type: 'markdown-header',
        title: currentSection.title,
        content: currentSection.content.join('\n'),
        startLine: currentSection.startLine,
        endLine: lines.length - 1,
        inclusionReason: `Referenced as "${matchingRef.text}" (${matchingRef.type})`,
      });
    }
  }

  return sections;
}

/**
 * Extract code sections (functions, classes)
 */
function extractCodeSections(
  content: string,
  references: ContentReference[],
  config: ExtractionConfig
): ExtractedSection[] {
  // Simplified - would need language-specific parsing
  return extractGenericSections(content, references, config);
}

/**
 * Extract config sections (YAML/JSON keys)
 */
function extractConfigSections(
  content: string,
  references: ContentReference[],
  config: ExtractionConfig
): ExtractedSection[] {
  // Simplified - would need format-specific parsing
  return extractGenericSections(content, references, config);
}

/**
 * Generic section extraction using text search
 */
function extractGenericSections(
  content: string,
  references: ContentReference[],
  config: ExtractionConfig
): ExtractedSection[] {
  const sections: ExtractedSection[] = [];
  const lines = content.split('\n');

  for (const ref of references.slice(0, 5)) { // Top 5 references
    // Find lines containing reference text
    const matchingLines = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.toLowerCase().includes(ref.text.toLowerCase()));

    for (const { line, index } of matchingLines) {
      // Extract with context
      const startLine = Math.max(0, index - config.contextLines);
      const endLine = Math.min(lines.length - 1, index + config.contextLines);

      const sectionContent = lines.slice(startLine, endLine + 1).join('\n');

      sections.push({
        type: 'full-content',
        title: `Context around "${ref.text.substring(0, 50)}"`,
        content: sectionContent,
        startLine,
        endLine,
        inclusionReason: `Referenced in conversation (${ref.type})`,
      });
    }
  }

  return sections;
}

// =====================================
// Helper Functions
// =====================================

function extractHeaders(content: string): string[] {
  const headers: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      headers.push(match[2]);
    }
  }

  return headers;
}

function extractCodeBlocks(content: string): string[] {
  const blocks: string[] = [];
  const regex = /```[\s\S]*?```/g;
  const matches = content.matchAll(regex);

  for (const match of matches) {
    blocks.push(match[0]);
  }

  return blocks;
}

function extractTopics(content: string): string[] {
  // Simplified topic extraction
  const words = content.toLowerCase().split(/\s+/);
  const wordFreq = new Map<string, number>();

  for (const word of words) {
    if (word.length > 5) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  }

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function detectFileType(content: string): 'markdown' | 'code' | 'config' | 'text' {
  if (content.includes('# ') || content.includes('## ')) return 'markdown';
  if (content.includes('function ') || content.includes('class ')) return 'code';
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) return 'config';
  return 'text';
}

function createIntelligentSummary(content: string): string {
  const lines = content.split('\n');
  const firstLines = lines.slice(0, 10).join('\n');
  const size = content.length;

  return `[Content Summary: ${formatSize(size)}, ${lines.length} lines]\n\n${firstLines}\n\n... (content omitted for brevity)`;
}

function createOmittedSummary(content: string, sections: ExtractedSection[]): string {
  const omittedSize = content.length - sections.reduce((sum, s) => sum + s.content.length, 0);
  return `${formatSize(omittedSize)} of content omitted (kept ${sections.length} relevant sections)`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
