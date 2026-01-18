import { SpeakerRegistry } from "../lib/speaker-registry";
import { TranscriptionPipeline } from "../lib/transcription-pipeline";
import { Config } from "../lib/config";
import { join } from "path";
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";

// Initialize components
let registry: SpeakerRegistry | null = null;
let pipeline: TranscriptionPipeline | null = null;

async function initializeComponents() {
  if (!registry) {
    registry = new SpeakerRegistry();
    await registry.load();
  }
  if (!pipeline) {
    pipeline = new TranscriptionPipeline(registry);
  }
}

// API Route Handlers
export async function handleGetSpeakers(): Promise<Response> {
  await initializeComponents();

  const speakers = registry!.listSpeakers().map((name) => ({
    name,
    samples: [],
    embeddings_count: 1,
  }));

  return Response.json({ speakers, count: speakers.length });
}

export async function handleRebuildRegistry(): Promise<Response> {
  await initializeComponents();

  try {
    await registry!.buildFromTranscripts(
      Config.pipeline.transcripts,
      Config.pipeline.wavs
    );
    registry!.save();

    return Response.json({
      success: true,
      speakerCount: registry!.getSpeakerCount(),
      speakers: registry!.listSpeakers(),
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function handleTranscribe(request: Request): Promise<Response> {
  await initializeComponents();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save uploaded file temporarily
    const uploadDir = Config.pipeline.uploads;
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const tempPath = join(uploadDir, file.name);
    const buffer = await file.arrayBuffer();
    writeFileSync(tempPath, Buffer.from(buffer));

    // Process the file
    const result = await pipeline!.processFile(tempPath);

    // Clean up temp file
    try {
      unlinkSync(tempPath);
    } catch (e) {
      // Ignore cleanup errors
    }

    return Response.json(result);
  } catch (error: any) {
    console.error("Transcription error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function handleAddSpeaker(request: Request): Promise<Response> {
  await initializeComponents();

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const file = formData.get("sample") as File | null;

    if (!name || !file) {
      return Response.json({ error: "Name and sample file required" }, { status: 400 });
    }

    // Save sample file
    const samplesDir = join(Config.pipeline.registry, "samples_v2", name);
    if (!existsSync(samplesDir)) {
      mkdirSync(samplesDir, { recursive: true });
    }

    const samplePath = join(samplesDir, file.name);
    const buffer = await file.arrayBuffer();
    writeFileSync(samplePath, Buffer.from(buffer));

    // Add to registry
    const success = registry!.addSpeaker(name, [samplePath]);
    if (success) {
      registry!.save();
      return Response.json({ success: true, name });
    } else {
      return Response.json({ success: false, error: "Failed to add speaker" }, { status: 500 });
    }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function handleRemoveSpeaker(request: Request): Promise<Response> {
  await initializeComponents();

  try {
    const { name } = await request.json();

    if (!name) {
      return Response.json({ error: "Speaker name required" }, { status: 400 });
    }

    const success = registry!.removeSpeaker(name);
    if (success) {
      registry!.save();
      return Response.json({ success: true });
    } else {
      return Response.json({ success: false, error: "Speaker not found" }, { status: 404 });
    }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function handleHealthCheck(): Promise<Response> {
  return Response.json({
    status: "ok",
    version: "1.0.0",
    models: {
      whisper: existsSync(Config.models.whisper),
      pyannote: existsSync(Config.models.pyannote),
      embedding: existsSync(Config.models.embedding),
    },
  });
}
