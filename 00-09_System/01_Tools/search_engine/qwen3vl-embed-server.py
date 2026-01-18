#!/usr/bin/env python3
"""
Qwen3-VL-Embedding Server - High-performance parallel embedding generation
Exposes HTTP API for Bun-based indexer
"""

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import time

app = FastAPI(title="Qwen3-VL Embedding Server")

# Global model and processor
_model = None
_processor = None
_device = None

class EmbeddingRequest(BaseModel):
    texts: List[str]
    normalize: bool = True
    output_dim: int = 4096

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    dimensions: int
    processing_time_ms: float

def load_model():
    """Load model once at startup"""
    global _model, _processor, _device

    if _model is not None:
        return

    print("Loading Qwen3-VL-Embedding model...")
    start = time.time()

    from transformers import Qwen3VLForConditionalGeneration, AutoProcessor

    model_name = "Qwen/Qwen3-VL-Embedding-8B"

    # Use MPS for Mac, CUDA for GPU, else CPU
    if torch.backends.mps.is_available():
        _device = "mps"
    elif torch.cuda.is_available():
        _device = "cuda"
    else:
        _device = "cpu"

    print(f"Using device: {_device}")

    _processor = AutoProcessor.from_pretrained(
        model_name,
        trust_remote_code=True
    )

    _model = Qwen3VLForConditionalGeneration.from_pretrained(
        model_name,
        torch_dtype=torch.float16 if _device != "cpu" else torch.float32,
        device_map="auto" if _device != "mps" else None,
        trust_remote_code=True
    )

    if _device == "mps":
        _model = _model.to(_device)

    _model.eval()

    print(f"Model loaded in {time.time() - start:.1f}s")

def generate_embeddings_sync(texts: List[str], normalize: bool, output_dim: int) -> List[List[float]]:
    """Generate embeddings for a batch of texts"""
    global _model, _processor, _device

    embeddings = []

    with torch.no_grad():
        for text in texts:
            try:
                # Skip empty texts
                if not text or not text.strip():
                    embeddings.append([0.0] * output_dim)
                    continue

                # Process single text
                inputs = _processor(
                    text=text,
                    return_tensors="pt"
                )

                # Move to device
                inputs = {k: v.to(_device) if isinstance(v, torch.Tensor) else v for k, v in inputs.items()}

                # Generate embedding from hidden states
                outputs = _model(**inputs, output_hidden_states=True)

                if outputs.hidden_states is None:
                    print(f"Warning: No hidden states for text: {text[:50]}...")
                    embeddings.append([0.0] * output_dim)
                    continue

                hidden_states = outputs.hidden_states[-1]

                # Mean pooling
                embedding = hidden_states.mean(dim=1).squeeze()

                # Truncate to output_dim if needed
                if output_dim and embedding.shape[-1] > output_dim:
                    embedding = embedding[:output_dim]

                # Normalize if requested
                if normalize:
                    embedding = torch.nn.functional.normalize(embedding, p=2, dim=-1)

                embeddings.append(embedding.cpu().tolist())
            except Exception as e:
                print(f"Error processing text: {str(e)[:100]}")
                embeddings.append([0.0] * output_dim)

    return embeddings

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "model": "Qwen3-VL-Embedding-8B", "device": _device}

@app.post("/embeddings", response_model=EmbeddingResponse)
def create_embeddings(request: EmbeddingRequest):
    """Generate embeddings for a batch of texts"""
    if not request.texts:
        raise HTTPException(status_code=400, detail="No texts provided")

    start = time.time()

    embeddings = generate_embeddings_sync(
        request.texts,
        request.normalize,
        request.output_dim
    )

    processing_time = (time.time() - start) * 1000

    return EmbeddingResponse(
        embeddings=embeddings,
        dimensions=len(embeddings[0]) if embeddings else 0,
        processing_time_ms=processing_time
    )

@app.post("/embedding")
async def create_single_embedding(text: str, normalize: bool = True, output_dim: int = 4096):
    """Generate embedding for a single text (convenience endpoint)"""
    result = await create_embeddings(EmbeddingRequest(
        texts=[text],
        normalize=normalize,
        output_dim=output_dim
    ))
    return {
        "embedding": result.embeddings[0],
        "dimensions": result.dimensions,
        "processing_time_ms": result.processing_time_ms
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081, log_level="info")
