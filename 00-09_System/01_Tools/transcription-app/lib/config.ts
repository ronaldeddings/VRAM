import { join } from "path";

// Base path - the app root directory
const APP_ROOT = join(import.meta.dir, "..");

export const Config = {
  // Model paths (local to app)
  models: {
    whisper: join(APP_ROOT, "models/sherpa-onnx-whisper-large-v3"),
    whisperGgml: join(APP_ROOT, "models/whisper-ggml/ggml-large-v3.bin"), // whisper.cpp GGML model
    pyannote: join(APP_ROOT, "models/sherpa-onnx-pyannote-segmentation-3-0"),
    embedding: join(APP_ROOT, "models/3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k/3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k.onnx"),
    vad: join(APP_ROOT, "models/silero_vad.onnx"),
  },

  // Data paths (local to app)
  pipeline: {
    root: join(APP_ROOT, "data"),
    registry: join(APP_ROOT, "data/speaker_registry"),
    embeddingsCache: join(APP_ROOT, "data/speaker_registry/embeddings_cache.json"),
    transcripts: join(APP_ROOT, "data/transcripts"),
    wavs: join(APP_ROOT, "data/wavs"),
    output: join(APP_ROOT, "data/output"),
    uploads: join(APP_ROOT, "uploads"),
  },

  // Speaker identification settings
  speaker: {
    threshold: 0.40, // EER-calibrated: 0.365 optimal, using 0.40 for good balance (89%+ accuracy)
    highConfidenceThreshold: 0.60, // For high-confidence matches only
    minSegmentDuration: 3.0, // seconds - research shows 3-5s optimal for embeddings
    embeddingDim: 512,
    usePostgres: process.env.USE_POSTGRES_SPEAKERS !== 'false', // Default: true, set USE_POSTGRES_SPEAKERS=false to use JSON cache
    postgresUrl: process.env.SPEAKER_POSTGRES_URL || 'postgres://ronaldeddings@localhost:5432/vram_embeddings',
    useAggregatedCentroids: true, // Use IQR-filtered L2-normalized centroids from speaker_centroids table
    useQualityWeightedCentroids: true, // Use duration×SNR weighted centroids (SOTA improvement)
    // Minimum duration requirements (per Azure/AssemblyAI recommendations)
    minEnrollmentDuration: 30.0, // 30 seconds total audio for enrollment
    minIdentificationDuration: 3.0, // 3 seconds minimum for runtime identification
  },

  // Embedding extraction settings
  embedding: {
    numThreads: 10, // Threads for speaker embedding extraction
  },

  // Diarization settings
  diarization: {
    numClusters: -1, // auto-detect
    threshold: 0.5,
    minDurationOn: 0.2,
    minDurationOff: 0.5,
    numThreads: 14, // Threads for PyAnnote speaker diarization
    backend: (process.env.DIARIZATION_BACKEND as 'sherpa-onnx' | 'fluidaudio' | 'ensemble') || 'sherpa-onnx',
  },

  // Ensemble diarization settings (combines FluidAudio + sherpa-onnx)
  ensemble: {
    enabled: process.env.ENSEMBLE_ENABLED === 'true',
    conflictStrategy: (process.env.ENSEMBLE_CONFLICT_STRATEGY as 'higher_confidence' | 'fluid_priority' | 'sherpa_priority') || 'higher_confidence',
    minOverlapRatio: parseFloat(process.env.ENSEMBLE_MIN_OVERLAP || '0.5'),
    unknownLabel: 'Unknown Speaker',
    debug: process.env.ENSEMBLE_DEBUG === 'true',
  },

  // FluidAudio settings (CoreML-based diarization for Apple Silicon)
  fluidaudio: {
    binaryPath: process.env.FLUIDAUDIO_PATH ||
      '/Volumes/VRAM/00-09_System/01_Tools/fluidaudio-test/.build/release/fluidaudiocli',
    mode: (process.env.FLUIDAUDIO_MODE as 'streaming' | 'offline') || 'offline',
    clusteringThreshold: parseFloat(process.env.FLUIDAUDIO_THRESHOLD || '0.7'),
    outputDir: process.env.FLUIDAUDIO_OUTPUT_DIR || '/tmp/fluidaudio',
    debug: process.env.FLUIDAUDIO_DEBUG === 'true',
  },

  // ASR settings
  asr: {
    sampleRate: 16000,
    featureDim: 80,
    numThreads: 14, // Increased for M3 Ultra 28-core
  },

  // Fathom integration settings
  fathom: {
    backupDir: process.env.VRAM_PATH
      ? `${process.env.VRAM_PATH}/Backup/meetings`
      : '/Volumes/VRAM/Backup/meetings',
    outputDir: process.env.VRAM_PATH
      ? `${process.env.VRAM_PATH}/10-19_Work/13_Meetings`
      : '/Volumes/VRAM/10-19_Work/13_Meetings',
    syncInterval: 30 * 60 * 1000,  // 30 minutes
    minDelay: 30000,               // 30 seconds between API calls
    maxDelay: 300000,              // 5 minutes max delay
    maxCallsPerSync: 50,           // Limit calls per sync run
    teamDomain: process.env.FATHOM_TEAM_DOMAIN || 'hackervalley.com',
  },

  // Search engine integration
  searchEngine: {
    database: process.env.SEARCH_ENGINE_DB || 'postgres://ronaldeddings@localhost:5432/vram_embeddings',
    chunkSize: 500,                // Words per chunk
    overlapSize: 50,               // Overlap between chunks
  },

  // Speaker consolidation settings (reduces over-fragmentation)
  consolidation: {
    enabled: true,                          // Enable speaker consolidation post-processing
    absoluteThresholdSeconds: 60.0,         // Min 60s speaking time to qualify as participant
    relativeThresholdPercent: 0.10,         // OR 10% of meeting duration to qualify
    minReassignmentSimilarity: 0.35,        // Min similarity to reassign unqualified segments
    mergeAdjacentSegments: true,            // Merge adjacent segments from same speaker
    mergeGapThreshold: 1.0,                 // Max gap (seconds) for merging adjacent segments
  },
};

export type ConfigType = typeof Config;
