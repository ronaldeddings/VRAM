import { join } from "path";

// Base path - the app root directory
const APP_ROOT = join(import.meta.dir, "..");

export const Config = {
  // Model paths (local to app)
  models: {
    whisper: join(APP_ROOT, "models/sherpa-onnx-whisper-tiny.en"),
    pyannote: join(APP_ROOT, "models/sherpa-onnx-pyannote-segmentation-3-0"),
    embedding: join(APP_ROOT, "models/3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k/3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k.onnx"),
    vad: join(APP_ROOT, "models/silero_vad.onnx"),
  },

  // Data paths (local to app)
  pipeline: {
    root: join(APP_ROOT, "data"),
    registry: join(APP_ROOT, "data/speaker_registry"),
    transcripts: join(APP_ROOT, "data/transcripts"),
    wavs: join(APP_ROOT, "data/wavs"),
    output: join(APP_ROOT, "data/output"),
    uploads: join(APP_ROOT, "uploads"),
  },

  // Speaker identification settings
  speaker: {
    threshold: 0.40, // Lowered from 0.50 for better short segment matching
    minSegmentDuration: 5.0, // seconds
    embeddingDim: 512,
  },

  // Diarization settings
  diarization: {
    numClusters: -1, // auto-detect
    threshold: 0.5,
    minDurationOn: 0.2,
    minDurationOff: 0.5,
  },

  // ASR settings
  asr: {
    sampleRate: 16000,
    featureDim: 80,
    numThreads: 2,
  },
};

export type ConfigType = typeof Config;
