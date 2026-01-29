/**
 * Ensemble Diarizer - Combines FluidAudio and sherpa-onnx for improved speaker identification
 *
 * Strategy:
 * 1. Run FluidAudio (fast, 56x RTF) for initial clustering
 * 2. Run sherpa-onnx speaker identification on same audio
 * 3. Merge results using voting/confidence logic
 * 4. For conflicts, use the speaker with higher similarity score
 *
 * Expected improvement: Reduce Unknown from ~26% to ~10% by combining strengths
 */

import { Config } from "./config";
import { FluidAudioDiarizer, type FluidAudioResult } from "./fluidaudio-diarizer";
import { SpeakerRegistry, sherpa_onnx } from "./speaker-registry";
import { join } from "path";

// ============================================================================
// Interfaces
// ============================================================================

export interface DiarizedSegment {
  start: number;
  end: number;
  speaker: number;
  speakerName?: string;
  confidence?: number;
  embedding?: Float32Array;
}

export interface EnsembleSegment extends DiarizedSegment {
  fluidAudioSpeaker?: string;
  sherpaOnnxSpeaker?: string;
  fluidAudioConfidence?: number;
  sherpaOnnxConfidence?: number;
  mergeResult: MergeResult;
}

export enum MergeResult {
  AGREE = "AGREE",                     // Both backends agree
  FLUID_WINS = "FLUID_WINS",           // Sherpa=Unknown, Fluid=named
  SHERPA_WINS = "SHERPA_WINS",         // Fluid=Unknown, Sherpa=named
  BOTH_UNKNOWN = "BOTH_UNKNOWN",       // Both say Unknown
  CONFLICT_FLUID = "CONFLICT_FLUID",   // Conflict resolved in favor of Fluid
  CONFLICT_SHERPA = "CONFLICT_SHERPA", // Conflict resolved in favor of Sherpa
}

export interface EnsembleConfig {
  enabled: boolean;
  conflictStrategy: "higher_confidence" | "fluid_priority" | "sherpa_priority";
  minOverlapRatio: number;  // Minimum overlap to consider segments matching (0.5 = 50%)
  unknownLabel: string;
  debug: boolean;
}

export interface EnsembleResult {
  segments: EnsembleSegment[];
  stats: {
    total: number;
    agree: number;
    fluidWins: number;
    sherpaWins: number;
    bothUnknown: number;
    conflictFluid: number;
    conflictSherpa: number;
  };
  timing: {
    fluidAudioMs: number;
    sherpaOnnxMs: number;
    mergeMs: number;
    totalMs: number;
  };
}

// ============================================================================
// Default Configuration
// ============================================================================

export const defaultEnsembleConfig: EnsembleConfig = {
  enabled: true,
  conflictStrategy: "higher_confidence",
  minOverlapRatio: 0.5,
  unknownLabel: "Unknown Speaker",
  debug: false,
};

// ============================================================================
// Ensemble Diarizer Class
// ============================================================================

export class EnsembleDiarizer {
  private config: EnsembleConfig;
  private fluidAudio: FluidAudioDiarizer;
  private sherpaOnnxDiarizer: any;
  private speakerRegistry: SpeakerRegistry | null = null;

  constructor(config: Partial<EnsembleConfig> = {}) {
    this.config = { ...defaultEnsembleConfig, ...config };

    // Initialize FluidAudio
    this.fluidAudio = new FluidAudioDiarizer(Config.fluidaudio);

    // Initialize sherpa-onnx diarizer
    const sherpaConfig = {
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
    this.sherpaOnnxDiarizer = new sherpa_onnx.OfflineSpeakerDiarization(sherpaConfig);

    this.log("EnsembleDiarizer initialized with both backends");
  }

  private log(message: string): void {
    if (this.config.debug) {
      console.log(`[Ensemble] ${message}`);
    }
  }

  /**
   * Initialize speaker registry for identification
   */
  async initializeRegistry(): Promise<void> {
    if (!this.speakerRegistry) {
      this.speakerRegistry = new SpeakerRegistry();
      await this.speakerRegistry.loadFromPostgres();
      this.log(`Speaker registry loaded with ${this.speakerRegistry.getSpeakerCount()} speakers`);
    }
  }

  /**
   * Run FluidAudio diarization
   */
  async runFluidAudio(wavPath: string): Promise<DiarizedSegment[]> {
    const result = await this.fluidAudio.process(wavPath);
    return this.fluidAudio.toDiarizedSegments(result);
  }

  /**
   * Run sherpa-onnx diarization
   */
  runSherpaOnnx(wavPath: string): DiarizedSegment[] {
    const wave = sherpa_onnx.readWave(wavPath);
    const result = this.sherpaOnnxDiarizer.process(wave.samples);
    return result.map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      speaker: seg.speaker,
    }));
  }

  /**
   * Identify speakers using the registry
   */
  async identifySpeakers(
    wavPath: string,
    segments: DiarizedSegment[]
  ): Promise<DiarizedSegment[]> {
    await this.initializeRegistry();
    if (!this.speakerRegistry) {
      throw new Error("Speaker registry not initialized");
    }

    const wave = sherpa_onnx.readWave(wavPath);
    const sampleRate = wave.sampleRate;
    const samples = wave.samples;

    const identified: DiarizedSegment[] = [];

    for (const seg of segments) {
      const startSample = Math.floor(seg.start * sampleRate);
      const endSample = Math.floor(seg.end * sampleRate);
      const segmentSamples = samples.slice(startSample, endSample);

      // Skip very short segments
      if (segmentSamples.length < sampleRate * 0.5) {
        identified.push({
          ...seg,
          speakerName: this.config.unknownLabel,
          confidence: 0,
        });
        continue;
      }

      // Identify speaker using registry's method (returns name, confidence, embedding)
      const { name, confidence, embedding } = await this.speakerRegistry.identifySpeakerWithEmbedding(
        segmentSamples,
        sampleRate
      );

      identified.push({
        ...seg,
        speakerName: name,
        confidence: confidence,
        embedding,
      });
    }

    return identified;
  }

  /**
   * Calculate overlap ratio between two segments
   */
  private calculateOverlap(seg1: DiarizedSegment, seg2: DiarizedSegment): number {
    const overlapStart = Math.max(seg1.start, seg2.start);
    const overlapEnd = Math.min(seg1.end, seg2.end);
    const overlapDuration = Math.max(0, overlapEnd - overlapStart);

    const seg1Duration = seg1.end - seg1.start;
    const seg2Duration = seg2.end - seg2.start;
    const minDuration = Math.min(seg1Duration, seg2Duration);

    return minDuration > 0 ? overlapDuration / minDuration : 0;
  }

  /**
   * Find matching segment from another backend based on timestamp overlap
   */
  private findMatchingSegment(
    segment: DiarizedSegment,
    candidates: DiarizedSegment[]
  ): DiarizedSegment | null {
    let bestMatch: DiarizedSegment | null = null;
    let bestOverlap = 0;

    for (const candidate of candidates) {
      const overlap = this.calculateOverlap(segment, candidate);
      if (overlap > bestOverlap && overlap >= this.config.minOverlapRatio) {
        bestOverlap = overlap;
        bestMatch = candidate;
      }
    }

    return bestMatch;
  }

  /**
   * Merge results from both backends using voting logic
   */
  mergeResults(
    fluidSegments: DiarizedSegment[],
    sherpaSegments: DiarizedSegment[]
  ): EnsembleSegment[] {
    const merged: EnsembleSegment[] = [];
    const usedSherpaIndices = new Set<number>();

    for (const fluidSeg of fluidSegments) {
      const sherpaSeg = this.findMatchingSegment(fluidSeg, sherpaSegments);
      if (sherpaSeg) {
        const sherpaIdx = sherpaSegments.indexOf(sherpaSeg);
        usedSherpaIndices.add(sherpaIdx);
      }

      const fluidName = fluidSeg.speakerName || this.config.unknownLabel;
      const sherpaName = sherpaSeg?.speakerName || this.config.unknownLabel;
      const fluidConf = fluidSeg.confidence || 0;
      const sherpaConf = sherpaSeg?.confidence || 0;

      const isFluidUnknown = fluidName === this.config.unknownLabel;
      const isSherpaUnknown = sherpaName === this.config.unknownLabel;

      let finalSpeaker: string;
      let finalConfidence: number;
      let mergeResult: MergeResult;

      if (fluidName === sherpaName) {
        // Both agree
        finalSpeaker = fluidName;
        finalConfidence = Math.max(fluidConf, sherpaConf);
        mergeResult = MergeResult.AGREE;
      } else if (isFluidUnknown && isSherpaUnknown) {
        // Both unknown
        finalSpeaker = this.config.unknownLabel;
        finalConfidence = 0;
        mergeResult = MergeResult.BOTH_UNKNOWN;
      } else if (isFluidUnknown && !isSherpaUnknown) {
        // Sherpa wins - it named someone Fluid missed
        finalSpeaker = sherpaName;
        finalConfidence = sherpaConf;
        mergeResult = MergeResult.SHERPA_WINS;
      } else if (!isFluidUnknown && isSherpaUnknown) {
        // Fluid wins - it named someone Sherpa missed
        finalSpeaker = fluidName;
        finalConfidence = fluidConf;
        mergeResult = MergeResult.FLUID_WINS;
      } else {
        // Conflict - both named different speakers
        if (this.config.conflictStrategy === "higher_confidence") {
          if (fluidConf >= sherpaConf) {
            finalSpeaker = fluidName;
            finalConfidence = fluidConf;
            mergeResult = MergeResult.CONFLICT_FLUID;
          } else {
            finalSpeaker = sherpaName;
            finalConfidence = sherpaConf;
            mergeResult = MergeResult.CONFLICT_SHERPA;
          }
        } else if (this.config.conflictStrategy === "fluid_priority") {
          finalSpeaker = fluidName;
          finalConfidence = fluidConf;
          mergeResult = MergeResult.CONFLICT_FLUID;
        } else {
          finalSpeaker = sherpaName;
          finalConfidence = sherpaConf;
          mergeResult = MergeResult.CONFLICT_SHERPA;
        }
      }

      merged.push({
        start: fluidSeg.start,
        end: fluidSeg.end,
        speaker: fluidSeg.speaker,
        speakerName: finalSpeaker,
        confidence: finalConfidence,
        embedding: fluidSeg.embedding || sherpaSeg?.embedding,
        fluidAudioSpeaker: fluidName,
        sherpaOnnxSpeaker: sherpaName,
        fluidAudioConfidence: fluidConf,
        sherpaOnnxConfidence: sherpaConf,
        mergeResult,
      });
    }

    // Add any sherpa segments that didn't overlap with fluid segments
    sherpaSegments.forEach((sherpaSeg, idx) => {
      if (!usedSherpaIndices.has(idx)) {
        const sherpaName = sherpaSeg.speakerName || this.config.unknownLabel;
        merged.push({
          start: sherpaSeg.start,
          end: sherpaSeg.end,
          speaker: sherpaSeg.speaker,
          speakerName: sherpaName,
          confidence: sherpaSeg.confidence || 0,
          embedding: sherpaSeg.embedding,
          fluidAudioSpeaker: this.config.unknownLabel,
          sherpaOnnxSpeaker: sherpaName,
          fluidAudioConfidence: 0,
          sherpaOnnxConfidence: sherpaSeg.confidence || 0,
          mergeResult: MergeResult.SHERPA_WINS,
        });
      }
    });

    // Sort by start time
    merged.sort((a, b) => a.start - b.start);

    return merged;
  }

  /**
   * Calculate statistics from merged results
   */
  private calculateStats(segments: EnsembleSegment[]): EnsembleResult["stats"] {
    const stats = {
      total: segments.length,
      agree: 0,
      fluidWins: 0,
      sherpaWins: 0,
      bothUnknown: 0,
      conflictFluid: 0,
      conflictSherpa: 0,
    };

    for (const seg of segments) {
      switch (seg.mergeResult) {
        case MergeResult.AGREE:
          stats.agree++;
          break;
        case MergeResult.FLUID_WINS:
          stats.fluidWins++;
          break;
        case MergeResult.SHERPA_WINS:
          stats.sherpaWins++;
          break;
        case MergeResult.BOTH_UNKNOWN:
          stats.bothUnknown++;
          break;
        case MergeResult.CONFLICT_FLUID:
          stats.conflictFluid++;
          break;
        case MergeResult.CONFLICT_SHERPA:
          stats.conflictSherpa++;
          break;
      }
    }

    return stats;
  }

  /**
   * Main processing method - runs both backends and merges results
   */
  async process(wavPath: string): Promise<EnsembleResult> {
    const startTime = Date.now();

    // Step 1: Run FluidAudio (fast)
    this.log("Running FluidAudio diarization...");
    const fluidStart = Date.now();
    const fluidSegments = await this.runFluidAudio(wavPath);
    const fluidTime = Date.now() - fluidStart;
    this.log(`FluidAudio: ${fluidSegments.length} segments in ${fluidTime}ms`);

    // Step 2: Run sherpa-onnx
    this.log("Running sherpa-onnx diarization...");
    const sherpaStart = Date.now();
    const sherpaSegments = this.runSherpaOnnx(wavPath);
    const sherpaTime = Date.now() - sherpaStart;
    this.log(`sherpa-onnx: ${sherpaSegments.length} segments in ${sherpaTime}ms`);

    // Step 3: Identify speakers for both sets
    this.log("Identifying speakers...");
    const identifyStart = Date.now();
    const [fluidIdentified, sherpaIdentified] = await Promise.all([
      this.identifySpeakers(wavPath, fluidSegments),
      this.identifySpeakers(wavPath, sherpaSegments),
    ]);
    const identifyTime = Date.now() - identifyStart;
    this.log(`Speaker identification completed in ${identifyTime}ms`);

    // Step 4: Merge results
    this.log("Merging results...");
    const mergeStart = Date.now();
    const merged = this.mergeResults(fluidIdentified, sherpaIdentified);
    const mergeTime = Date.now() - mergeStart;

    const totalTime = Date.now() - startTime;

    const stats = this.calculateStats(merged);
    this.log(`Merge complete: ${stats.total} segments`);
    this.log(`  AGREE: ${stats.agree}, FLUID_WINS: ${stats.fluidWins}, SHERPA_WINS: ${stats.sherpaWins}`);
    this.log(`  BOTH_UNKNOWN: ${stats.bothUnknown}, CONFLICTS: ${stats.conflictFluid + stats.conflictSherpa}`);

    return {
      segments: merged,
      stats,
      timing: {
        fluidAudioMs: fluidTime,
        sherpaOnnxMs: sherpaTime + identifyTime,
        mergeMs: mergeTime,
        totalMs: totalTime,
      },
    };
  }

  /**
   * Convert ensemble segments to standard DiarizedSegment format
   */
  toDiarizedSegments(result: EnsembleResult): DiarizedSegment[] {
    return result.segments.map((seg) => ({
      start: seg.start,
      end: seg.end,
      speaker: seg.speaker,
      speakerName: seg.speakerName,
      confidence: seg.confidence,
      embedding: seg.embedding,
    }));
  }

  /**
   * Get configuration
   */
  getConfig(): EnsembleConfig {
    return { ...this.config };
  }
}

// Export singleton with default config
export const ensembleDiarizer = new EnsembleDiarizer({ debug: true });
