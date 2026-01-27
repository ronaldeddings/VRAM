-- migrations/004-speaker-embeddings.sql
-- Speaker Voice Embeddings for pgvector
-- Created: 2026-01-27
-- Enables: Voice speaker identification via 512-dim embeddings from sherpa-onnx 3D-Speaker model

BEGIN;

-- Ensure pgvector extension exists
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Phase 1: Speaker Embeddings Table
-- ============================================

-- Stores individual voice sample embeddings
CREATE TABLE IF NOT EXISTS speaker_embeddings (
  id SERIAL PRIMARY KEY,
  speaker_name TEXT NOT NULL,
  sample_path TEXT NOT NULL,
  embedding vector(512) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(speaker_name, sample_path)
);

-- ============================================
-- Phase 2: Speakers Metadata Table
-- ============================================

-- Fast lookups and metadata tracking
CREATE TABLE IF NOT EXISTS speakers (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  embedding_count INTEGER DEFAULT 0,
  threshold FLOAT DEFAULT 0.55,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Phase 3: HNSW Index for Similarity Search
-- ============================================

-- HNSW index for fast cosine similarity search
-- m=16: connections per layer (good for 512-dim vectors)
-- ef_construction=64: build-time accuracy vs speed tradeoff
CREATE INDEX IF NOT EXISTS idx_speaker_embeddings_hnsw
ON speaker_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- ============================================
-- Phase 4: Supporting Indexes
-- ============================================

-- Index for speaker name lookups
CREATE INDEX IF NOT EXISTS idx_speaker_embeddings_name ON speaker_embeddings(speaker_name);

-- Index for speakers table
CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);

COMMIT;

-- ============================================
-- Phase 5: Stored Functions
-- (Outside transaction for CREATE OR REPLACE)
-- ============================================

-- Find similar speakers by embedding
CREATE OR REPLACE FUNCTION find_similar_speakers(
  query_embedding vector(512),
  similarity_threshold FLOAT DEFAULT 0.55,
  max_results INTEGER DEFAULT 5
)
RETURNS TABLE(
  speaker_name TEXT,
  similarity FLOAT,
  sample_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    se.speaker_name,
    (1 - (se.embedding <=> query_embedding))::FLOAT as similarity,
    COUNT(*) OVER (PARTITION BY se.speaker_name) as sample_count
  FROM speaker_embeddings se
  WHERE 1 - (se.embedding <=> query_embedding) >= similarity_threshold
  ORDER BY se.embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Add or update speaker embedding
CREATE OR REPLACE FUNCTION add_speaker_embedding(
  p_speaker_name TEXT,
  p_sample_path TEXT,
  p_embedding vector(512)
)
RETURNS INTEGER AS $$
DECLARE
  new_id INTEGER;
BEGIN
  INSERT INTO speaker_embeddings (speaker_name, sample_path, embedding)
  VALUES (p_speaker_name, p_sample_path, p_embedding)
  ON CONFLICT (speaker_name, sample_path)
  DO UPDATE SET embedding = p_embedding, updated_at = NOW()
  RETURNING id INTO new_id;

  -- Update speaker metadata
  INSERT INTO speakers (name, embedding_count)
  VALUES (p_speaker_name, 1)
  ON CONFLICT (name)
  DO UPDATE SET
    embedding_count = (SELECT COUNT(*) FROM speaker_embeddings WHERE speaker_name = p_speaker_name),
    updated_at = NOW();

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Remove speaker and all embeddings
CREATE OR REPLACE FUNCTION remove_speaker(p_speaker_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM speaker_embeddings WHERE speaker_name = p_speaker_name;
  DELETE FROM speakers WHERE name = p_speaker_name;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Get speaker statistics
CREATE OR REPLACE FUNCTION get_speaker_stats()
RETURNS TABLE(
  total_speakers BIGINT,
  total_embeddings BIGINT,
  avg_embeddings_per_speaker FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT speaker_name)::BIGINT,
    COUNT(*)::BIGINT,
    COUNT(*)::FLOAT / NULLIF(COUNT(DISTINCT speaker_name), 0)
  FROM speaker_embeddings;
END;
$$ LANGUAGE plpgsql;

-- Analyze tables for query optimization
ANALYZE speaker_embeddings;
ANALYZE speakers;
