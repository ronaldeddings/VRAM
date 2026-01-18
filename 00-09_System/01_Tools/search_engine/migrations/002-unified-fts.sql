-- migrations/002-unified-fts.sql
-- Add content_type infrastructure and FTS support to all content tables
-- Created: 2026-01-18
-- Note: Using regular columns + UPDATE instead of GENERATED ALWAYS due to immutability constraints

BEGIN;

-- ============================================
-- Phase 0: Content Type Infrastructure
-- ============================================

-- Add content_type to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'file';
CREATE INDEX IF NOT EXISTS idx_documents_content_type ON documents (content_type);

-- Add content_type to chunks table
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'file';
CREATE INDEX IF NOT EXISTS idx_chunks_content_type ON chunks (content_type);

-- Classify existing documents as transcripts based on path
UPDATE documents
SET content_type = 'transcript'
WHERE path LIKE '%/13_Meetings/13.01_transcripts/%'
  AND content_type = 'file';

-- Classify existing chunks as transcripts based on speakers
UPDATE chunks
SET content_type = 'transcript'
WHERE speakers IS NOT NULL
  AND array_length(speakers, 1) > 0
  AND content_type = 'file';

-- Fallback: Also classify by path for any chunks without speakers
UPDATE chunks
SET content_type = 'transcript'
WHERE file_path LIKE '%/13_Meetings/13.01_transcripts/%'
  AND content_type = 'file';

COMMIT;

-- ============================================
-- Chunks table: Add FTS for transcript search
-- (Outside transaction for large table operations)
-- ============================================

ALTER TABLE chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Populate search_vector for chunks
UPDATE chunks
SET search_vector =
  setweight(to_tsvector('english', coalesce(array_to_string(speakers, ' '), '')), 'A') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'B');

CREATE INDEX IF NOT EXISTS idx_chunks_search ON chunks USING GIN (search_vector);

-- Partial index for transcript-only searches (more efficient)
CREATE INDEX IF NOT EXISTS idx_chunks_transcript_search
ON chunks USING GIN (search_vector)
WHERE content_type = 'transcript';

-- ============================================
-- Email chunks: Add search_vector column
-- ============================================

ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Populate search_vector for emails
UPDATE email_chunks
SET search_vector =
  setweight(to_tsvector('english', coalesce(subject, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(from_name, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'C');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_email_chunks_search
ON email_chunks USING GIN (search_vector);

-- Drop the old partial index on subject only (if exists)
DROP INDEX IF EXISTS idx_email_chunks_subject;

-- ============================================
-- Slack chunks: Add search_vector column
-- ============================================

ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

-- Populate search_vector for slack
UPDATE slack_chunks
SET search_vector =
  setweight(to_tsvector('english', coalesce(channel, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(array_to_string(speakers, ' '), '')), 'B') ||
  setweight(to_tsvector('english', coalesce(chunk_text, '')), 'C');

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_slack_chunks_search
ON slack_chunks USING GIN (search_vector);

-- Analyze tables to update statistics
ANALYZE documents;
ANALYZE chunks;
ANALYZE email_chunks;
ANALYZE slack_chunks;
