/**
 * Smart Chunking Module
 *
 * Intelligent content chunking with transcript detection and speaker awareness.
 * Uses research-backed chunk sizes: 1500-2000 chars (~400-500 tokens) with 20-25% overlap.
 */

export interface ChunkConfig {
  targetSize: number;      // Target characters per chunk
  minSize: number;         // Minimum chunk size
  overlap: number;         // Overlap characters
  maxSize: number;         // Maximum chunk size
}

export const TRANSCRIPT_CONFIG: ChunkConfig = {
  targetSize: 1800,
  minSize: 1200,
  overlap: 400,
  maxSize: 2200
};

export const DOCUMENT_CONFIG: ChunkConfig = {
  targetSize: 1800,
  minSize: 1000,
  overlap: 300,
  maxSize: 2200
};

export interface Chunk {
  text: string;
  index: number;
  speakers?: string[];
  startTime?: string;
  endTime?: string;
  isTranscript: boolean;
}

/**
 * Detect if content is a transcript based on timestamp patterns
 */
export function isTranscript(content: string): boolean {
  // Check for timestamp pattern [HH:MM] or [H:MM]
  const timestampPattern = /\[\d{1,2}:\d{2}\]/g;
  const matches = content.match(timestampPattern);
  return matches !== null && matches.length >= 3;
}

/**
 * Smart chunk content based on type detection
 */
export function smartChunk(content: string, filePath: string): Chunk[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  // Skip very short content - just return as single chunk
  if (content.length < 500) {
    return [{
      text: content,
      index: 0,
      isTranscript: false
    }];
  }

  if (isTranscript(content)) {
    return chunkTranscript(content, TRANSCRIPT_CONFIG);
  }

  return chunkDocument(content, DOCUMENT_CONFIG);
}

/**
 * Chunk transcript with speaker awareness
 */
function chunkTranscript(content: string, config: ChunkConfig): Chunk[] {
  const turns = parseTranscriptTurns(content);

  if (turns.length === 0) {
    // Fallback to document chunking if parsing fails
    return chunkDocument(content, config);
  }

  const chunks: Chunk[] = [];
  let currentText = "";
  let currentSpeakers = new Set<string>();
  let startTime = "";
  let endTime = "";

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const turnText = turn.fullText + "\n\n";

    // Check if adding this turn would exceed max size
    if (currentText.length + turnText.length > config.maxSize && currentText.length >= config.minSize) {
      // Finalize current chunk
      chunks.push({
        text: currentText.trim(),
        index: chunks.length,
        speakers: Array.from(currentSpeakers),
        startTime,
        endTime,
        isTranscript: true
      });

      // Start new chunk with overlap
      const overlapText = getOverlapText(currentText, config.overlap);
      currentText = overlapText + turnText;
      currentSpeakers = new Set([turn.speaker]);
      startTime = turn.timestamp;
      endTime = turn.timestamp;
    } else {
      currentText += turnText;
      currentSpeakers.add(turn.speaker);
      if (!startTime) startTime = turn.timestamp;
      endTime = turn.timestamp;
    }
  }

  // Add final chunk if substantial
  if (currentText.length >= config.minSize / 2) {
    chunks.push({
      text: currentText.trim(),
      index: chunks.length,
      speakers: Array.from(currentSpeakers),
      startTime,
      endTime,
      isTranscript: true
    });
  }

  return chunks;
}

/**
 * Chunk regular documents
 */
function chunkDocument(content: string, config: ChunkConfig): Chunk[] {
  const chunks: Chunk[] = [];
  let start = 0;

  while (start < content.length) {
    let end = start + config.targetSize;

    // Try to break at paragraph boundary
    if (end < content.length) {
      const nextParagraph = content.indexOf("\n\n", end - 200);
      if (nextParagraph !== -1 && nextParagraph < end + 200) {
        end = nextParagraph + 2;
      }
    } else {
      end = content.length;
    }

    const chunkText = content.slice(start, end).trim();

    if (chunkText.length >= config.minSize / 2) {
      chunks.push({
        text: chunkText,
        index: chunks.length,
        isTranscript: false
      });
    }

    // Move start with overlap
    start = end - config.overlap;
    if (start >= content.length - config.overlap) break;
  }

  return chunks;
}

/**
 * Parse transcript into speaker turns
 */
function parseTranscriptTurns(content: string): Array<{
  timestamp: string;
  speaker: string;
  text: string;
  fullText: string;
}> {
  const turnRegex = /\[(\d{1,2}:\d{2})\]\s*([^:]+):\s*([^\[]*)/g;
  const turns = [];

  let match;
  while ((match = turnRegex.exec(content)) !== null) {
    const text = match[3].trim();
    // Skip empty or boilerplate turns
    if (text.length < 10 || isBoilerplate(text)) continue;

    turns.push({
      timestamp: match[1],
      speaker: match[2].trim(),
      text: text,
      fullText: `[${match[1]}] ${match[2].trim()}: ${text}`
    });
  }

  return turns;
}

/**
 * Get overlap text from end of chunk
 */
function getOverlapText(text: string, overlapSize: number): string {
  if (text.length <= overlapSize) return text;

  // Try to start overlap at a sentence boundary
  const overlapStart = text.length - overlapSize;
  const sentenceEnd = text.lastIndexOf(". ", overlapStart + 100);

  if (sentenceEnd > overlapStart) {
    return text.slice(sentenceEnd + 2);
  }

  return text.slice(overlapStart);
}

/**
 * Check if text is boilerplate
 */
function isBoilerplate(text: string): boolean {
  const patterns = [
    /^thank you\.?$/i,
    /^thanks\.?$/i,
    /^okay\.?$/i,
    /^yes\.?$/i,
    /^no\.?$/i,
    /^mhm\.?$/i,
    /^uh-huh\.?$/i,
    /^right\.?$/i,
  ];

  const trimmed = text.trim();
  return patterns.some(p => p.test(trimmed));
}
