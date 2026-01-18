# Speaker Transcription Pipeline

A self-contained TypeScript/React web application using Bun that provides transcription with automatic speaker identification, built on sherpa-onnx.

## Features

- **Audio/Video Transcription**: Upload MP4, MP3, WAV, M4A, or MOV files for transcription
- **Speaker Identification**: Automatically identifies speakers using voice embeddings
- **Speaker Registry Management**: Build and manage a registry of known speakers
- **Real-time UI**: Modern React interface with live status updates
- **Full-stack Bun**: Single server handles both API and frontend
- **Self-Contained**: All models and data included - no external dependencies

## Project Structure

```
transcription-app/
├── index.ts              # Main server entry point
├── start.sh              # Start script with environment setup
├── index.html            # React app entry point
├── client.tsx            # React client initialization
├── App.tsx               # Main React component
├── lib/
│   ├── config.ts              # Configuration paths and settings
│   ├── speaker-registry.ts    # Speaker embedding management
│   └── transcription-pipeline.ts  # ASR and diarization
├── api/
│   └── routes.ts         # API route handlers
├── models/               # ONNX models (self-contained)
│   ├── sherpa-onnx-whisper-tiny.en/    # Whisper ASR model
│   ├── sherpa-onnx-pyannote-segmentation-3-0/  # Diarization model
│   ├── 3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k/  # Embedding model
│   └── silero_vad.onnx   # Voice activity detection
├── data/                 # Application data
│   ├── speaker_registry/      # Speaker embeddings and samples
│   │   ├── speakers.json      # Speaker metadata
│   │   └── samples_v2/        # Voice samples (WAV files)
│   ├── transcripts/           # Output transcripts
│   ├── wavs/                  # Converted WAV files
│   └── output/                # Processed output files
├── uploads/              # Temporary upload directory
└── package.json
```

## Prerequisites

- [Bun](https://bun.sh/) v1.2+ installed
- ffmpeg installed (for media conversion)

## Installation

```bash
cd transcription-app
bun install
```

## Running the Server

```bash
# Start the server
bun start

# Or run in development mode with hot reload
bun run dev
```

The server will start at http://localhost:3000

> Note: The native library paths are automatically configured in the npm scripts.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with model status |
| GET | `/api/speakers` | List registered speakers |
| POST | `/api/transcribe` | Transcribe an audio/video file |
| POST | `/api/registry/rebuild` | Rebuild registry from labeled transcripts |
| POST | `/api/speakers/add` | Add a new speaker with voice sample |
| POST | `/api/speakers/remove` | Remove a speaker from registry |

## Configuration

Edit `lib/config.ts` to customize:

- Model paths
- Speaker identification threshold (default: 0.50)
- Diarization settings
- ASR settings

## Usage

1. **Start the server** using `./start.sh`
2. **Open the UI** at http://localhost:3000
3. **Upload files** to transcribe with speaker identification
4. **Manage speakers** in the Registry tab

### Example API Usage

```bash
# Health check
curl http://localhost:3000/api/health

# List speakers
curl http://localhost:3000/api/speakers

# Transcribe a file
curl -X POST http://localhost:3000/api/transcribe \
  -F "file=@/path/to/audio.wav"
```

## Technology Stack

- **Runtime**: Bun
- **Frontend**: React 19
- **Backend**: Bun.serve() with routes
- **Speech Recognition**: sherpa-onnx (Whisper tiny.en)
- **Speaker Diarization**: sherpa-onnx (PyAnnote)
- **Speaker Embeddings**: sherpa-onnx (3D-Speaker)
- **Media Conversion**: ffmpeg

## Moving the App

This application is fully self-contained. To move it to another location:

1. Copy the entire `transcription-app` folder
2. Run `bun install` in the new location
3. Run `bun start`

All models and data are included in the app directory.
