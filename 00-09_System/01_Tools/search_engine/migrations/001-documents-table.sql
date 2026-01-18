-- Migration: Create documents table for PostgreSQL FTS
-- Replaces SQLite files table for full-text search

-- Main documents table (replaces SQLite files table)
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    filename TEXT NOT NULL,
    extension TEXT,
    content TEXT,
    file_size INTEGER,
    modified_at TIMESTAMPTZ,
    indexed_at TIMESTAMPTZ DEFAULT NOW(),
    area TEXT,
    category TEXT,

    -- Full-text search vector (auto-generated)
    -- Filename gets weight 'A' (highest), content gets weight 'B'
    search_vector TSVECTOR GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(filename, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(content, '')), 'B')
    ) STORED
);

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING GIN (search_vector);

-- B-tree indexes for filtering
CREATE INDEX IF NOT EXISTS idx_documents_area ON documents (area);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents (category);
CREATE INDEX IF NOT EXISTS idx_documents_extension ON documents (extension);
CREATE INDEX IF NOT EXISTS idx_documents_path ON documents (path);
CREATE INDEX IF NOT EXISTS idx_documents_modified ON documents (modified_at DESC);

-- Add document_id reference to chunks table (for hybrid search)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'chunks' AND column_name = 'document_id'
    ) THEN
        ALTER TABLE chunks ADD COLUMN document_id INTEGER REFERENCES documents(id);
        CREATE INDEX idx_chunks_document ON chunks (document_id);
    END IF;
END $$;

-- Function for keyword search with highlighting
CREATE OR REPLACE FUNCTION search_documents(
    query_text TEXT,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0,
    area_filter TEXT DEFAULT NULL,
    extension_filter TEXT DEFAULT NULL,
    path_prefix TEXT DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    path TEXT,
    filename TEXT,
    area TEXT,
    category TEXT,
    extension TEXT,
    file_size INTEGER,
    modified_at TIMESTAMPTZ,
    snippet TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.path,
        d.filename,
        d.area,
        d.category,
        d.extension,
        d.file_size,
        d.modified_at,
        ts_headline('english', d.content, to_tsquery('english', query_text),
            'StartSel=→, StopSel=←, MaxWords=50, MinWords=20, MaxFragments=3'
        ) AS snippet,
        ts_rank(d.search_vector, to_tsquery('english', query_text)) AS rank
    FROM documents d
    WHERE d.search_vector @@ to_tsquery('english', query_text)
        AND (area_filter IS NULL OR d.area = area_filter)
        AND (extension_filter IS NULL OR d.extension = extension_filter)
        AND (path_prefix IS NULL OR d.path LIKE path_prefix || '%')
    ORDER BY rank DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- Function for getting document statistics
CREATE OR REPLACE FUNCTION get_document_stats()
RETURNS TABLE (
    total_files BIGINT,
    total_size BIGINT,
    areas BIGINT,
    categories BIGINT,
    last_indexed TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT,
        COALESCE(SUM(d.file_size), 0)::BIGINT,
        COUNT(DISTINCT d.area)::BIGINT,
        COUNT(DISTINCT d.category)::BIGINT,
        MAX(d.indexed_at)
    FROM documents d;
END;
$$ LANGUAGE plpgsql;

-- Function for browsing by area
CREATE OR REPLACE FUNCTION browse_by_area(
    area_name TEXT,
    result_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    path TEXT,
    filename TEXT,
    category TEXT,
    extension TEXT,
    file_size INTEGER,
    modified_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.path,
        d.filename,
        d.category,
        d.extension,
        d.file_size,
        d.modified_at
    FROM documents d
    WHERE d.area = area_name
    ORDER BY d.modified_at DESC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;
