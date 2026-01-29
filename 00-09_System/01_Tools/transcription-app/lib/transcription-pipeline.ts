import { Config } from "./config";
import { SpeakerRegistry, sherpa_onnx } from "./speaker-registry";
import {
  consolidateSpeakers,
  type RawSegment,
  type ConsolidatedTranscript,
  type ConsolidationConfig,
} from "./speaker-consolidation";
import { FluidAudioDiarizer, type FluidAudioResult } from "./fluidaudio-diarizer";
import { EnsembleDiarizer, type EnsembleResult } from "./ensemble-diarizer";
import { join } from "path";
import { existsSync, writeFileSync, unlinkSync, mkdirSync, readFileSync } from "fs";
import { $ } from "bun";

interface DiarizedSegment {
  start: number;
  end: number;
  speaker: number;
  speakerName?: string;
  confidence?: number;
  embedding?: Float32Array; // For consolidation
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
  consolidation?: {
    original_speakers: number;
    final_speakers: number;
    reassigned_segments: number;
    thresholds: { absolute: number; relative: number };
  };
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
  private fluidAudio: FluidAudioDiarizer | null = null;
  private ensemble: EnsembleDiarizer | null = null;
  private backend: 'sherpa-onnx' | 'fluidaudio' | 'ensemble';

  constructor() {
    this.backend = Config.diarization.backend || 'sherpa-onnx';

    if (this.backend === 'ensemble') {
      console.log('[Diarizer] Using Ensemble backend (FluidAudio + sherpa-onnx)');
      this.ensemble = new EnsembleDiarizer(Config.ensemble);
    } else if (this.backend === 'fluidaudio') {
      console.log('[Diarizer] Using FluidAudio backend (CoreML)');
      this.fluidAudio = new FluidAudioDiarizer(Config.fluidaudio);
    } else {
      console.log('[Diarizer] Using sherpa-onnx backend');
      const config = {
        segmentation: {
          pyannote: {
            model: join(Config.models.pyannote, "model.onnx"),
          },
          numThreads: Config.diarization.numThreads || 14,
        },
        embedding: {
          model: Config.models.embedding,
          numThreads: Config.embedding?.numThreads || 10,
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
  }

  get sampleRate(): number {
    return this.sd?.sampleRate || 16000;
  }

  process(samples: Float32Array): DiarizedSegment[] {
    if (this.backend === 'fluidaudio' || this.backend === 'ensemble') {
      throw new Error(`${this.backend} backend requires processFileAsync() with a file path`);
    }
    const result = this.sd.process(samples);
    return result.map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      speaker: seg.speaker,
    }));
  }

  processFile(wavPath: string): DiarizedSegment[] {
    if (this.backend === 'sherpa-onnx') {
      const wave = sherpa_onnx.readWave(wavPath);
      if (wave.sampleRate !== this.sampleRate) {
        throw new Error(`Expected sample rate ${this.sampleRate}, got ${wave.sampleRate}`);
      }
      return this.process(wave.samples);
    }
    // FluidAudio and Ensemble require async processing
    throw new Error(`Use processFileAsync() for ${this.backend} backend`);
  }

  async processFileAsync(wavPath: string): Promise<DiarizedSegment[]> {
    if (this.backend === 'ensemble' && this.ensemble) {
      const result = await this.ensemble.process(wavPath);
      console.log(`[Diarizer] Ensemble stats: AGREE=${result.stats.agree}, FLUID_WINS=${result.stats.fluidWins}, SHERPA_WINS=${result.stats.sherpaWins}, UNKNOWN=${result.stats.bothUnknown}, CONFLICTS=${result.stats.conflictFluid + result.stats.conflictSherpa}`);
      return this.ensemble.toDiarizedSegments(result);
    }
    if (this.backend === 'fluidaudio' && this.fluidAudio) {
      const result = await this.fluidAudio.process(wavPath);
      return this.fluidAudio.toDiarizedSegments(result);
    }
    // Fall back to sync method for sherpa-onnx
    return this.processFile(wavPath);
  }

  getBackend(): string {
    return this.backend;
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
          encoder: join(Config.models.whisper, "large-v3-encoder.onnx"),
          decoder: join(Config.models.whisper, "large-v3-decoder.onnx"),
        },
        tokens: join(Config.models.whisper, "large-v3-tokens.txt"),
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

/**
 * WhisperCppASREngine - Uses whisper-server HTTP API with Metal GPU acceleration
 * Model stays loaded in memory for fast inference on Apple Silicon (M3 Ultra)
 */
export class WhisperCppASREngine {
  private tempDir: string;
  private tempCounter: number = 0;
  private serverUrl: string = "http://127.0.0.1:8178";

  constructor() {
    this.tempDir = join(Config.pipeline.root, "temp_asr");

    // Ensure temp directory exists
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
  }

  /**
   * Write Float32Array samples to a temporary WAV file
   */
  private writeTempWav(samples: Float32Array, sampleRate: number): string {
    const tempPath = join(this.tempDir, `segment_${Date.now()}_${this.tempCounter++}.wav`);

    // WAV file header parameters
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);

    // Convert Float32 [-1.0, 1.0] to Int16 [-32768, 32767]
    const int16Samples = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]!));
      int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    const dataSize = int16Samples.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');

    // fmt chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // chunk size
    view.setUint16(20, 1, true);  // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // data chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write PCM data
    const dataView = new Int16Array(buffer, 44);
    dataView.set(int16Samples);

    writeFileSync(tempPath, Buffer.from(buffer));
    return tempPath;
  }

  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  /**
   * Transcribe audio samples using whisper-server HTTP API with Metal GPU
   */
  async transcribe(samples: Float32Array, sampleRate: number): Promise<string> {
    // Write samples to temp WAV file
    const tempWavPath = this.writeTempWav(samples, sampleRate);

    try {
      // Use curl to send multipart/form-data - more reliable than JS FormData
      const result = await $`curl -s ${this.serverUrl}/inference -H "Content-Type: multipart/form-data" -F file="@${tempWavPath}" -F temperature="0" -F response_format="json"`.text();

      try {
        const parsed = JSON.parse(result);
        return parsed.text?.trim() || "";
      } catch {
        console.error('Failed to parse whisper response:', result);
        return "";
      }
    } catch (error: any) {
      console.error('Whisper transcription error:', error.message);
      return "";
    } finally {
      // Clean up temp WAV file
      try {
        unlinkSync(tempWavPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Transcribe a WAV file directly
   */
  async transcribeFile(wavPath: string): Promise<string> {
    try {
      // Use curl to send multipart/form-data - more reliable than JS FormData
      const result = await $`curl -s ${this.serverUrl}/inference -H "Content-Type: multipart/form-data" -F file="@${wavPath}" -F temperature="0" -F response_format="json"`.text();

      try {
        const parsed = JSON.parse(result);
        return parsed.text?.trim() || "";
      } catch {
        console.error('Failed to parse whisper response:', result);
        return "";
      }
    } catch (error: any) {
      console.error('Whisper transcription error:', error.message);
      return "";
    }
  }
}

export class TranscriptionPipeline {
  private diarizer: Diarizer;
  private asr: WhisperCppASREngine;
  private registry: SpeakerRegistry;
  private mediaConverter: MediaConverter;

  constructor(registry?: SpeakerRegistry) {
    this.diarizer = new Diarizer();
    this.asr = new WhisperCppASREngine(); // Use whisper.cpp with Metal GPU
    this.registry = registry || new SpeakerRegistry();
    this.mediaConverter = new MediaConverter();
    console.log("🚀 Using whisper.cpp with Metal GPU acceleration");
  }

  async loadRegistry(): Promise<void> {
    await this.registry.load();
  }

  /**
   * Check if a WAV file needs sample rate conversion to 16kHz
   * Returns true if file is not 16kHz mono, which degrades speaker embedding quality
   */
  private async needsSampleRateConversion(wavPath: string): Promise<boolean> {
    try {
      const result = await $`ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate,channels -of csv=p=0 ${wavPath}`.quiet();
      const [sampleRate, channels] = result.text().trim().split(",").map(Number);
      // Need conversion if not 16kHz or not mono
      return sampleRate !== 16000 || channels !== 1;
    } catch {
      // If we can't determine, assume conversion needed
      return true;
    }
  }

  async processFile(
    inputPath: string,
    outputDir?: string,
    options?: {
      consolidate?: boolean;
      consolidation_absolute_threshold?: number;
      consolidation_relative_threshold?: number;
    }
  ): Promise<TranscriptionResult> {
    const baseName = inputPath.split("/").pop()!.replace(/\.[^/.]+$/, "");
    const outDir = outputDir || Config.pipeline.output;

    // Always convert to 16kHz mono WAV for optimal speaker embedding quality
    // Note: sherpa-onnx internal resampling degrades embedding quality vs ffmpeg
    let wavPath = inputPath;
    const needsConversion = !inputPath.endsWith(".wav") || await this.needsSampleRateConversion(inputPath);

    if (needsConversion) {
      wavPath = join(Config.pipeline.wavs, `${baseName}_16khz.wav`);
      console.log(`Converting ${inputPath} to 16kHz WAV for optimal embedding quality...`);
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
    let diarizedSegments: DiarizedSegment[];
    const backend = this.diarizer.getBackend();
    if (backend === 'ensemble' || backend === 'fluidaudio') {
      // Use async method for FluidAudio and Ensemble backends
      diarizedSegments = await this.diarizer.processFileAsync(wavPath);
    } else {
      // Use sync method for sherpa-onnx
      diarizedSegments = this.diarizer.process(wave.samples);
    }
    console.log(`Found ${diarizedSegments.length} diarized segments`);

    // Step 2: Identify speakers for each segment (with embeddings for consolidation)
    // Skip if ensemble backend already did identification
    const minIdDuration = (Config.speaker as any).minIdentificationDuration ?? 3.0;
    const speakersFound = new Set<string>();
    const skipIdentification = backend === 'ensemble' && diarizedSegments.some(s => s.speakerName);

    if (skipIdentification) {
      console.log(`Speakers already identified by ensemble backend, collecting names...`);
      for (const segment of diarizedSegments) {
        if (segment.speakerName) {
          speakersFound.add(segment.speakerName);
        }
      }
    } else {
      console.log(`Identifying speakers (min duration: ${minIdDuration}s)...`);
    }

    for (const segment of diarizedSegments) {
      // Skip if already identified by ensemble
      if (skipIdentification && segment.speakerName) {
        continue;
      }

      const startSample = Math.floor(segment.start * wave.sampleRate);
      const endSample = Math.floor(segment.end * wave.sampleRate);
      const segmentSamples = wave.samples.slice(startSample, endSample);
      const segmentDuration = segmentSamples.length / wave.sampleRate;

      if (segmentDuration >= minIdDuration) {
        // Meets minimum duration - run speaker identification
        const { name, confidence, embedding } = await this.registry.identifySpeakerWithEmbedding(
          segmentSamples,
          wave.sampleRate
        );
        segment.speakerName = name;
        segment.confidence = confidence;
        segment.embedding = embedding;
        speakersFound.add(name);
      } else if (segmentDuration >= 0.5) {
        // Short but usable - still compute embedding for consolidation but lower confidence
        const { name, confidence, embedding } = await this.registry.identifySpeakerWithEmbedding(
          segmentSamples,
          wave.sampleRate
        );
        // Apply confidence penalty for short segments (linear scale from 0.5s to minIdDuration)
        const penaltyFactor = segmentDuration / minIdDuration;
        segment.speakerName = name;
        segment.confidence = confidence * penaltyFactor;
        segment.embedding = embedding;
        speakersFound.add(name);
      } else {
        // Too short - mark as unknown, no embedding
        segment.speakerName = "Unknown Speaker";
        segment.confidence = 0;
        speakersFound.add("Unknown Speaker");
      }
    }

    // Step 3: Apply speaker consolidation (if enabled)
    let consolidationResult: ConsolidatedTranscript | null = null;
    // Use passed option if provided, otherwise fall back to config
    const consolidationEnabled = options?.consolidate !== undefined
      ? options.consolidate
      : (Config.consolidation?.enabled ?? true);

    if (consolidationEnabled) {
      console.log("Applying speaker consolidation...");
      const meetingDuration = wave.samples.length / wave.sampleRate;

      // Convert diarized segments to raw segments for consolidation
      const rawSegments: RawSegment[] = diarizedSegments
        .filter((seg) => seg.embedding) // Only segments with embeddings
        .map((seg) => ({
          start_time: seg.start,
          end_time: seg.end,
          text: "", // Will be filled during transcription
          speaker_name: seg.speakerName || "Unknown Speaker",
          similarity_score: seg.confidence || 0,
          embedding: seg.embedding!,
        }));

      // Use passed options if provided, otherwise fall back to config values
      const consolidationConfig: Partial<ConsolidationConfig> = {
        enabled: true,
        absolute_threshold_seconds: options?.consolidation_absolute_threshold
          ?? Config.consolidation?.absoluteThresholdSeconds ?? 60.0,
        relative_threshold_percent: options?.consolidation_relative_threshold
          ?? Config.consolidation?.relativeThresholdPercent ?? 0.10,
        min_reassignment_similarity: Config.consolidation?.minReassignmentSimilarity ?? 0.35,
        merge_adjacent_segments: Config.consolidation?.mergeAdjacentSegments ?? true,
        merge_gap_threshold: Config.consolidation?.mergeGapThreshold ?? 1.0,
      };

      consolidationResult = consolidateSpeakers(rawSegments, meetingDuration, consolidationConfig);

      // Update diarized segments with consolidated speaker names
      const consolidatedMap = new Map<string, string>(); // original -> consolidated
      for (const seg of consolidationResult.segments) {
        if (seg.was_reassigned) {
          consolidatedMap.set(seg.original_speaker, seg.speaker_name);
        }
      }

      // Apply reassignments to diarized segments
      for (const seg of diarizedSegments) {
        const originalName = seg.speakerName || "Unknown Speaker";
        const consolidatedName = consolidatedMap.get(originalName);
        if (consolidatedName) {
          seg.speakerName = consolidatedName;
        }
      }

      // Update speakersFound with consolidated speakers
      speakersFound.clear();
      for (const speaker of consolidationResult.speakers) {
        speakersFound.add(speaker.name);
      }

      console.log(
        `Consolidation: ${consolidationResult.metadata.original_speaker_count} → ${consolidationResult.metadata.final_speaker_count} speakers`
      );
    }

    // Step 4: Merge adjacent segments with same speaker
    diarizedSegments = this.mergeAdjacentSegments(diarizedSegments);
    console.log(`After merging: ${diarizedSegments.length} segments`);

    // Step 5: Transcribe each segment using whisper.cpp with Metal GPU
    console.log("Transcribing segments with Metal GPU acceleration...");
    const transcriptSegments: TranscriptSegment[] = [];
    let processedCount = 0;

    for (const segment of diarizedSegments) {
      const startSample = Math.floor(segment.start * wave.sampleRate);
      const endSample = Math.floor(segment.end * wave.sampleRate);
      const segmentSamples = wave.samples.slice(startSample, endSample);

      // Whisper has a 30-second limit, so we process in chunks
      const maxDuration = 30; // seconds
      const maxSamples = maxDuration * wave.sampleRate;

      if (segmentSamples.length <= maxSamples) {
        const text = await this.asr.transcribe(segmentSamples, wave.sampleRate);
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

          const text = await this.asr.transcribe(chunkSamples, wave.sampleRate);
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

      // Progress indicator
      processedCount++;
      if (processedCount % 50 === 0) {
        console.log(`  Transcribed ${processedCount}/${diarizedSegments.length} segments...`);
      }
    }

    // Step 6: Generate output
    const result: TranscriptionResult = {
      segments: transcriptSegments,
      speakers: Array.from(speakersFound),
      duration: wave.samples.length / wave.sampleRate,
    };

    // Add consolidation metadata if available
    if (consolidationResult) {
      result.consolidation = {
        original_speakers: consolidationResult.metadata.original_speaker_count,
        final_speakers: consolidationResult.metadata.final_speaker_count,
        reassigned_segments: consolidationResult.metadata.segments_reassigned,
        thresholds: {
          absolute: consolidationResult.metadata.thresholds_used.absolute,
          relative: consolidationResult.metadata.thresholds_used.relative,
        },
      };
    }

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
