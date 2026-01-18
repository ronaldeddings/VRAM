import { Config } from "./config";
import { SpeakerRegistry, sherpa_onnx } from "./speaker-registry";
import { join } from "path";
import { existsSync, writeFileSync } from "fs";
import { $ } from "bun";

interface DiarizedSegment {
  start: number;
  end: number;
  speaker: number;
  speakerName?: string;
  confidence?: number;
}

interface TranscriptSegment {
  start: number;
  end: number;
  speaker: string;
  text: string;
  confidence?: number;
}

interface TranscriptionResult {
  segments: TranscriptSegment[];
  speakers: string[];
  duration: number;
}

export class MediaConverter {
  async convertToWav(inputPath: string, outputPath: string): Promise<boolean> {
    try {
      await $`ffmpeg -y -i ${inputPath} -ar 16000 -ac 1 -c:a pcm_s16le ${outputPath}`.quiet();
      return existsSync(outputPath);
    } catch (error) {
      console.error(`Error converting ${inputPath}:`, error);
      return false;
    }
  }

  async getMediaDuration(filePath: string): Promise<number> {
    try {
      const result = await $`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${filePath}`.quiet();
      return parseFloat(result.text().trim());
    } catch (error) {
      console.error(`Error getting duration:`, error);
      return 0;
    }
  }
}

export class Diarizer {
  private sd: any;

  constructor() {
    const config = {
      segmentation: {
        pyannote: {
          model: join(Config.models.pyannote, "model.onnx"),
        },
      },
      embedding: {
        model: Config.models.embedding,
      },
      clustering: {
        numClusters: Config.diarization.numClusters,
        threshold: Config.diarization.threshold,
      },
      minDurationOn: Config.diarization.minDurationOn,
      minDurationOff: Config.diarization.minDurationOff,
    };

    this.sd = new sherpa_onnx.OfflineSpeakerDiarization(config);
  }

  get sampleRate(): number {
    return this.sd.sampleRate;
  }

  process(samples: Float32Array): DiarizedSegment[] {
    const result = this.sd.process(samples);
    return result.map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      speaker: seg.speaker,
    }));
  }

  processFile(wavPath: string): DiarizedSegment[] {
    const wave = sherpa_onnx.readWave(wavPath);
    if (wave.sampleRate !== this.sampleRate) {
      throw new Error(`Expected sample rate ${this.sampleRate}, got ${wave.sampleRate}`);
    }
    return this.process(wave.samples);
  }
}

export class ASREngine {
  private recognizer: any;

  constructor() {
    const config = {
      featConfig: {
        sampleRate: Config.asr.sampleRate,
        featureDim: Config.asr.featureDim,
      },
      modelConfig: {
        whisper: {
          encoder: join(Config.models.whisper, "tiny.en-encoder.onnx"),
          decoder: join(Config.models.whisper, "tiny.en-decoder.onnx"),
        },
        tokens: join(Config.models.whisper, "tiny.en-tokens.txt"),
        numThreads: Config.asr.numThreads,
        provider: "cpu",
        debug: 0,
      },
    };

    this.recognizer = new sherpa_onnx.OfflineRecognizer(config);
  }

  transcribe(samples: Float32Array, sampleRate: number): string {
    const stream = this.recognizer.createStream();
    stream.acceptWaveform({ sampleRate, samples });
    this.recognizer.decode(stream);
    const result = this.recognizer.getResult(stream);
    return result.text?.trim() || "";
  }

  transcribeFile(wavPath: string): string {
    const wave = sherpa_onnx.readWave(wavPath);
    return this.transcribe(wave.samples, wave.sampleRate);
  }
}

export class TranscriptionPipeline {
  private diarizer: Diarizer;
  private asr: ASREngine;
  private registry: SpeakerRegistry;
  private mediaConverter: MediaConverter;

  constructor(registry?: SpeakerRegistry) {
    this.diarizer = new Diarizer();
    this.asr = new ASREngine();
    this.registry = registry || new SpeakerRegistry();
    this.mediaConverter = new MediaConverter();
  }

  async loadRegistry(): Promise<void> {
    await this.registry.load();
  }

  async processFile(inputPath: string, outputDir?: string): Promise<TranscriptionResult> {
    const baseName = inputPath.split("/").pop()!.replace(/\.[^/.]+$/, "");
    const outDir = outputDir || Config.pipeline.output;

    // Convert to WAV if needed
    let wavPath = inputPath;
    if (!inputPath.endsWith(".wav")) {
      wavPath = join(Config.pipeline.wavs, `${baseName}.wav`);
      console.log(`Converting ${inputPath} to WAV...`);
      const success = await this.mediaConverter.convertToWav(inputPath, wavPath);
      if (!success) {
        throw new Error(`Failed to convert ${inputPath} to WAV`);
      }
    }

    // Load audio
    const wave = sherpa_onnx.readWave(wavPath);
    console.log(`Processing ${baseName}: ${(wave.samples.length / wave.sampleRate).toFixed(1)}s of audio`);

    // Step 1: Run diarization
    console.log("Running speaker diarization...");
    let diarizedSegments = this.diarizer.process(wave.samples);
    console.log(`Found ${diarizedSegments.length} diarized segments`);

    // Step 2: Identify speakers for each segment
    console.log("Identifying speakers...");
    const speakersFound = new Set<string>();

    for (const segment of diarizedSegments) {
      const startSample = Math.floor(segment.start * wave.sampleRate);
      const endSample = Math.floor(segment.end * wave.sampleRate);
      const segmentSamples = wave.samples.slice(startSample, endSample);

      if (segmentSamples.length > wave.sampleRate * 0.5) {
        // At least 0.5 seconds
        const { name, confidence } = this.registry.identifySpeaker(segmentSamples, wave.sampleRate);
        segment.speakerName = name;
        segment.confidence = confidence;
        speakersFound.add(name);
      } else {
        segment.speakerName = "Unknown Speaker";
        segment.confidence = 0;
        speakersFound.add("Unknown Speaker");
      }
    }

    // Step 3: Merge adjacent segments with same speaker
    diarizedSegments = this.mergeAdjacentSegments(diarizedSegments);
    console.log(`After merging: ${diarizedSegments.length} segments`);

    // Step 4: Transcribe each segment
    console.log("Transcribing segments...");
    const transcriptSegments: TranscriptSegment[] = [];

    for (const segment of diarizedSegments) {
      const startSample = Math.floor(segment.start * wave.sampleRate);
      const endSample = Math.floor(segment.end * wave.sampleRate);
      const segmentSamples = wave.samples.slice(startSample, endSample);

      // Whisper offline mode has a limit, so we process in chunks
      const maxDuration = 30; // seconds
      const maxSamples = maxDuration * wave.sampleRate;

      if (segmentSamples.length <= maxSamples) {
        const text = this.asr.transcribe(segmentSamples, wave.sampleRate);
        if (text.length > 0) {
          transcriptSegments.push({
            start: segment.start,
            end: segment.end,
            speaker: segment.speakerName || "Unknown Speaker",
            text,
            confidence: segment.confidence,
          });
        }
      } else {
        // Split into chunks
        for (let i = 0; i < segmentSamples.length; i += maxSamples) {
          const chunkSamples = segmentSamples.slice(i, Math.min(i + maxSamples, segmentSamples.length));
          const chunkStart = segment.start + i / wave.sampleRate;
          const chunkEnd = segment.start + (i + chunkSamples.length) / wave.sampleRate;

          const text = this.asr.transcribe(chunkSamples, wave.sampleRate);
          if (text.length > 0) {
            transcriptSegments.push({
              start: chunkStart,
              end: chunkEnd,
              speaker: segment.speakerName || "Unknown Speaker",
              text,
              confidence: segment.confidence,
            });
          }
        }
      }
    }

    // Step 5: Generate output
    const result: TranscriptionResult = {
      segments: transcriptSegments,
      speakers: Array.from(speakersFound),
      duration: wave.samples.length / wave.sampleRate,
    };

    // Save transcript
    const transcriptPath = join(outDir, `${baseName}_transcript.txt`);
    this.saveTranscript(result, transcriptPath);

    return result;
  }

  private resolveUnknownSpeakers(segments: DiarizedSegment[]): DiarizedSegment[] {
    // Resolve short "Unknown Speaker" segments by looking at adjacent segments
    const resolved = [...segments];
    const maxUnknownDuration = 3.0; // seconds - short segments to try to resolve

    for (let i = 0; i < resolved.length; i++) {
      const segment = resolved[i];
      if (!segment || segment.speakerName !== "Unknown Speaker") continue;

      const duration = segment.end - segment.start;
      if (duration > maxUnknownDuration) continue;

      const prev = i > 0 ? resolved[i - 1] : null;
      const next = i < resolved.length - 1 ? resolved[i + 1] : null;

      const prevSpeaker = prev?.speakerName;
      const nextSpeaker = next?.speakerName;

      // If both adjacent segments have the same known speaker, use that
      if (prevSpeaker && nextSpeaker &&
          prevSpeaker !== "Unknown Speaker" &&
          prevSpeaker === nextSpeaker) {
        segment.speakerName = prevSpeaker;
        segment.confidence = 0.3; // Lower confidence for inferred speaker
      }
      // If only one adjacent segment has a known speaker, use that
      else if (prevSpeaker && prevSpeaker !== "Unknown Speaker") {
        segment.speakerName = prevSpeaker;
        segment.confidence = 0.25;
      }
      else if (nextSpeaker && nextSpeaker !== "Unknown Speaker") {
        segment.speakerName = nextSpeaker;
        segment.confidence = 0.25;
      }
    }

    return resolved;
  }

  private mergeAdjacentSegments(segments: DiarizedSegment[]): DiarizedSegment[] {
    if (segments.length === 0) return segments;

    // First resolve unknown speakers based on context
    const resolved = this.resolveUnknownSpeakers(segments);

    const first = resolved[0];
    if (!first) return resolved;

    const merged: DiarizedSegment[] = [];
    let current: DiarizedSegment = { ...first };

    for (let i = 1; i < resolved.length; i++) {
      const next = resolved[i];
      if (!next) continue;
      // Merge if same speaker and gap is small
      if (current.speakerName === next.speakerName && next.start - current.end < 1.0) {
        current.end = next.end;
      } else {
        merged.push(current);
        current = { ...next };
      }
    }
    merged.push(current);

    return merged;
  }

  private saveTranscript(result: TranscriptionResult, outputPath: string): void {
    const lines: string[] = [];

    // Header
    lines.push("=".repeat(60));
    lines.push("TRANSCRIPT");
    lines.push(`Duration: ${result.duration.toFixed(1)} seconds`);
    lines.push(`Speakers identified: ${result.speakers.join(", ")}`);
    lines.push("=".repeat(60));
    lines.push("");

    // Segments
    for (const segment of result.segments) {
      const timeStr = `${segment.start.toFixed(2)} -- ${segment.end.toFixed(2)}`;
      lines.push(`${timeStr}: ${segment.speaker}: ${segment.text}`);
    }

    writeFileSync(outputPath, lines.join("\n"));
    console.log(`Saved transcript to ${outputPath}`);
  }

  getRegistry(): SpeakerRegistry {
    return this.registry;
  }
}

export { sherpa_onnx };
