import { Config } from "./config";
import { join } from "path";
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "fs";

// Import sherpa-onnx-node
const sherpa_onnx = require("sherpa-onnx-node");

interface SpeakerData {
  name: string;
  samples: string[];
  embeddings_count: number;
}

interface RegistryData {
  speakers: Record<string, SpeakerData>;
  embedding_dim: number;
  threshold: number;
}

export class EmbeddingEngine {
  private extractor: any;

  constructor() {
    const config = {
      model: Config.models.embedding,
      numThreads: 2,
      debug: false,
    };
    this.extractor = new sherpa_onnx.SpeakerEmbeddingExtractor(config);
  }

  get dim(): number {
    return this.extractor.dim;
  }

  computeEmbedding(samples: Float32Array, sampleRate: number): Float32Array {
    const stream = this.extractor.createStream();
    stream.acceptWaveform({ sampleRate, samples });
    return this.extractor.compute(stream);
  }

  computeFromFile(wavPath: string): Float32Array {
    const wave = sherpa_onnx.readWave(wavPath);
    return this.computeEmbedding(wave.samples, wave.sampleRate);
  }

  cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] ?? 0;
      const bVal = b[i] ?? 0;
      dotProduct += aVal * bVal;
      normA += aVal * aVal;
      normB += bVal * bVal;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export class SpeakerRegistry {
  private engine: EmbeddingEngine;
  private manager: any;
  private registryPath: string;
  private embeddingsPath: string;
  private speakersPath: string;
  private samplesPath: string;
  private speakerData: RegistryData;

  constructor(registryPath?: string) {
    this.registryPath = registryPath || Config.pipeline.registry;
    this.embeddingsPath = join(this.registryPath, "embeddings.json");
    this.speakersPath = join(this.registryPath, "speakers.json");
    this.samplesPath = join(this.registryPath, "samples_v2");

    this.engine = new EmbeddingEngine();
    this.manager = new sherpa_onnx.SpeakerEmbeddingManager(this.engine.dim);

    this.speakerData = {
      speakers: {},
      embedding_dim: this.engine.dim,
      threshold: Config.speaker.threshold,
    };

    // Create directories if needed
    if (!existsSync(this.registryPath)) {
      mkdirSync(this.registryPath, { recursive: true });
    }
    if (!existsSync(this.samplesPath)) {
      mkdirSync(this.samplesPath, { recursive: true });
    }
  }

  async load(): Promise<boolean> {
    if (!existsSync(this.speakersPath)) {
      console.log("No speaker registry found, starting fresh");
      return false;
    }

    try {
      const rawData = JSON.parse(readFileSync(this.speakersPath, "utf-8"));

      // Handle both Python format (flat) and TypeScript format (wrapped)
      let speakersMap: Record<string, any>;

      if (rawData.speakers) {
        // TypeScript format: { speakers: {...}, embedding_dim, threshold }
        this.speakerData = rawData;
        speakersMap = rawData.speakers;
      } else {
        // Python format: flat object with speaker names as keys
        speakersMap = rawData;
        this.speakerData = {
          speakers: {},
          embedding_dim: this.engine.dim,
          threshold: Config.speaker.threshold,
        };
      }

      // Load embeddings from sample files
      for (const [name, speaker] of Object.entries(speakersMap)) {
        if (!speaker) continue;
        const speakerInfo = speaker as any;
        const embeddings: Float32Array[] = [];

        // Handle both formats: sample_files (Python) or samples (TypeScript)
        const sampleFiles = speakerInfo.sample_files || speakerInfo.samples || [];
        const samplePaths: string[] = [];

        for (const sampleFile of sampleFiles) {
          // If it's just a filename, prepend the samples_v2 path
          const fullPath = sampleFile.includes("/")
            ? sampleFile
            : join(this.samplesPath, sampleFile);

          if (existsSync(fullPath)) {
            try {
              const embedding = this.engine.computeFromFile(fullPath);
              embeddings.push(embedding);
              samplePaths.push(fullPath);
            } catch (err) {
              console.warn(`Failed to compute embedding for ${fullPath}:`, err);
            }
          } else {
            console.warn(`Sample file not found: ${fullPath}`);
          }
        }

        if (embeddings.length > 0) {
          this.manager.addMulti({ name, v: embeddings });

          // Store in normalized format
          this.speakerData.speakers[name] = {
            name,
            samples: samplePaths,
            embeddings_count: embeddings.length,
          };
        }
      }

      console.log(`Loaded ${this.manager.getNumSpeakers()} speakers from registry`);
      return true;
    } catch (error) {
      console.error("Error loading registry:", error);
      return false;
    }
  }

  save(): void {
    writeFileSync(this.speakersPath, JSON.stringify(this.speakerData, null, 2));
    console.log(`Saved registry with ${Object.keys(this.speakerData.speakers).length} speakers`);
  }

  addSpeaker(name: string, samplePaths: string[]): boolean {
    const embeddings: Float32Array[] = [];

    for (const samplePath of samplePaths) {
      if (existsSync(samplePath)) {
        try {
          const embedding = this.engine.computeFromFile(samplePath);
          embeddings.push(embedding);
        } catch (error) {
          console.error(`Error processing ${samplePath}:`, error);
        }
      }
    }

    if (embeddings.length === 0) {
      console.error(`No valid samples found for ${name}`);
      return false;
    }

    // Add to manager
    const ok = this.manager.addMulti({ name, v: embeddings });
    if (!ok) {
      console.error(`Failed to add speaker ${name} to manager`);
      return false;
    }

    // Update speaker data
    this.speakerData.speakers[name] = {
      name,
      samples: samplePaths,
      embeddings_count: embeddings.length,
    };

    return true;
  }

  removeSpeaker(name: string): boolean {
    if (!this.speakerData.speakers[name]) {
      return false;
    }

    this.manager.remove(name);
    delete this.speakerData.speakers[name];
    return true;
  }

  identifySpeaker(samples: Float32Array, sampleRate: number): { name: string; confidence: number } {
    const embedding = this.engine.computeEmbedding(samples, sampleRate);
    const result = this.manager.search({
      v: embedding,
      threshold: this.speakerData.threshold,
    });

    if (result === "") {
      return { name: "Unknown Speaker", confidence: 0 };
    }

    // Calculate confidence by comparing against all registered embeddings
    // For now, return threshold as minimum confidence
    return { name: result, confidence: this.speakerData.threshold };
  }

  identifyFromFile(wavPath: string): { name: string; confidence: number } {
    const wave = sherpa_onnx.readWave(wavPath);
    return this.identifySpeaker(wave.samples, wave.sampleRate);
  }

  listSpeakers(): string[] {
    return this.manager.getAllSpeakerNames();
  }

  getSpeakerCount(): number {
    return this.manager.getNumSpeakers();
  }

  getEmbeddingEngine(): EmbeddingEngine {
    return this.engine;
  }

  // Build registry from labeled transcripts
  async buildFromTranscripts(transcriptsDir: string, wavsDir: string): Promise<void> {
    const transcriptFiles = readdirSync(transcriptsDir).filter((f) => f.endsWith(".txt"));

    for (const file of transcriptFiles) {
      const baseName = file.replace("_transcript.txt", "").replace(".txt", "");
      const wavPath = join(wavsDir, `${baseName}.wav`);

      if (!existsSync(wavPath)) {
        console.log(`WAV file not found for ${file}, skipping`);
        continue;
      }

      const transcriptPath = join(transcriptsDir, file);
      await this.extractSpeakersFromTranscript(transcriptPath, wavPath);
    }

    this.save();
  }

  private async extractSpeakersFromTranscript(transcriptPath: string, wavPath: string): Promise<void> {
    const content = readFileSync(transcriptPath, "utf-8");
    const lines = content.split("\n");

    const speakerSegments: Map<string, { start: number; end: number }[]> = new Map();

    // Parse transcript format: "start -- end: Speaker Name: text"
    const linePattern = /^(\d+\.?\d*)\s+--\s+(\d+\.?\d*):\s*([^:]+):\s*(.*)$/;

    for (const line of lines) {
      const match = line.match(linePattern);
      if (match) {
        const [, startStr, endStr, speaker] = match;
        if (!startStr || !endStr || !speaker) continue;
        const start = parseFloat(startStr);
        const end = parseFloat(endStr);
        const speakerName = speaker.trim();

        if (!speakerSegments.has(speakerName)) {
          speakerSegments.set(speakerName, []);
        }
        speakerSegments.get(speakerName)!.push({ start, end });
      }
    }

    // Extract samples for each speaker
    const wave = sherpa_onnx.readWave(wavPath);

    for (const [speaker, segments] of speakerSegments) {
      // Find longest segment for this speaker
      const longestSegment = segments.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));

      if (longestSegment.end - longestSegment.start >= Config.speaker.minSegmentDuration) {
        const startSample = Math.floor(longestSegment.start * wave.sampleRate);
        const endSample = Math.floor(longestSegment.end * wave.sampleRate);
        const segmentSamples = wave.samples.slice(startSample, endSample);

        // Compute and store embedding
        const embedding = this.engine.computeEmbedding(segmentSamples, wave.sampleRate);

        if (!this.speakerData.speakers[speaker]) {
          this.speakerData.speakers[speaker] = {
            name: speaker,
            samples: [],
            embeddings_count: 0,
          };
        }

        // Add to manager
        this.manager.add({ name: speaker, v: embedding });
        this.speakerData.speakers[speaker].embeddings_count++;
      }
    }
  }
}

export { sherpa_onnx };
