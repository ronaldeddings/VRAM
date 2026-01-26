# VRAM Search API Reference

REST API documentation for the VRAM Search server.

## Base URL

```
http://localhost:3000
```

## Search Endpoints

### GET /search

Keyword search using PostgreSQL tsvector full-text search.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `limit` | integer | No | 20 | Max results (1-100) |
| `offset` | integer | No | 0 | Pagination offset |
| `area` | string | No | - | Filter by area |
| `type` | string | No | - | Filter by extension (md, txt, json) |
| `sources` | string | No | all | Comma-separated: file,email,slack,transcript |

**Example Request**:
```bash
curl "http://localhost:3000/search?q=security&limit=5&area=Work"
```

**Example Response**:
```json
{
  "query": "security",
  "results": [
    {
      "path": "/Volumes/VRAM/10-19_Work/.../security.md",
      "filename": "security.md",
      "area": "Work",
      "extension": "md",
      "file_size": 13029,
      "snippet": "...5 Mindset Shifts →Security← Teams Must Adopt..."
    }
  ],
  "count": 1,
  "time_ms": "24.56"
}
```

---

### GET /semantic

Semantic search using pgvector embeddings.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `limit` | integer | No | 10 | Max results |
| `sources` | string | No | all | Sources to search |

**Example**:
```bash
curl "http://localhost:3000/semantic?q=project%20planning&limit=5"
```

---

### GET /hybrid

Combined keyword + semantic search using Reciprocal Rank Fusion.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `limit` | integer | No | 10 | Max results |
| `fts_weight` | float | No | 0.4 | Weight for keyword results (0-1) |
| `strategy` | string | No | rrf | Fusion strategy: rrf, weighted, max |
| `sources` | string | No | all | Sources to search |

**Example**:
```bash
curl "http://localhost:3000/hybrid?q=meeting%20notes&limit=10&fts_weight=0.5"
```

---

### GET /search/slack

Slack-specific semantic search.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `limit` | integer | No | 10 | Max results |
| `channel` | string | No | - | Filter by channel name |

**Example**:
```bash
curl "http://localhost:3000/search/slack?q=podcast&limit=5"
```

---

### GET /search/emails

Email-specific semantic search.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query |
| `limit` | integer | No | 10 | Max results |

---

## Resource Endpoints

### GET /

Serves the Web UI.

**Response**: HTML page

---

### GET /file

Retrieve file metadata and optionally content.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `path` | string | Yes | - | Full file path |
| `content` | boolean | No | false | Include file content |

**Example Request**:
```bash
curl "http://localhost:3000/file?path=/Volumes/VRAM/10-19_Work/example.md&content=true"
```

**Example Response**:
```json
{
  "id": 12345,
  "path": "/Volumes/VRAM/10-19_Work/example.md",
  "filename": "example.md",
  "extension": "md",
  "area": "Work",
  "category": "Projects",
  "file_size": 1024,
  "modified_at": "2025-01-10T12:00:00.000Z",
  "indexed_at": "2025-01-12T09:50:39.000Z",
  "content": "# Example\n\nFile content here..."
}
```

---

### GET /browse/:area

Browse files by area.

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `area` | string | Area name (Work, Finance, Personal, Archive, System) |

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 50 | Max results (1-500) |

**Example Request**:
```bash
curl "http://localhost:3000/browse/Work?limit=10"
```

**Example Response**:
```json
{
  "area": "Work",
  "files": [
    {
      "path": "/Volumes/VRAM/10-19_Work/...",
      "filename": "example.md",
      "extension": "md",
      "file_size": 1024,
      "modified_at": "2025-01-10T12:00:00.000Z",
      "category": "Projects"
    }
  ],
  "count": 10
}
```

---

### GET /stats

Get index statistics.

**Example Request**:
```bash
curl "http://localhost:3000/stats"
```

**Example Response**:
```json
{
  "total_files": 181399,
  "total_size": 4285352786,
  "areas": 3,
  "categories": 5,
  "last_indexed": "2026-01-12 09:50:39",
  "by_area": [
    {"area": "Work", "count": 177167, "size": 3814375359},
    {"area": "System", "count": 4190, "size": 470887752},
    {"area": "Personal", "count": 42, "size": 89675}
  ],
  "by_extension": [
    {"extension": "json", "count": 98146},
    {"extension": "md", "count": 80641},
    {"extension": "txt", "count": 2612}
  ]
}
```

---

### GET /health

Basic health check endpoint.

**Example Request**:
```bash
curl "http://localhost:3000/health"
```

**Example Response**:
```json
{
  "status": "healthy",
  "postgres": "connected",
  "embedding_server": "available"
}
```

---

### GET /health/slack-sync

Slack sync status and health.

**Example Request**:
```bash
curl "http://localhost:3000/health/slack-sync"
```

**Example Response**:
```json
{
  "status": "ok",
  "message": "Slack sync is up to date",
  "last_sync": "2026-01-24T16:45:29.513Z",
  "age_hours": 2.5,
  "archive_exists": true,
  "archive_size_mb": 156.2,
  "healthy": true
}
```

**Status Values**:
| Status | Description |
|--------|-------------|
| `ok` | Sync completed within 25 hours |
| `stale` | Sync is overdue (> 25 hours) |
| `warning` | Sync has never run |
| `error` | Error checking sync status |

---

### GET /embedding/status

Embedding server status.

**Example Response**:
```json
{
  "available": true,
  "port": 8081,
  "model": "Qwen3-Embedding-8B"
}
```

---

## CORS

All endpoints include CORS headers allowing cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Error Responses

Errors return JSON with an `error` field:

```json
{
  "error": "Missing ?q= parameter"
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad request (missing required parameter) |
| 404 | Not found (file or endpoint) |
| 500 | Internal server error |

## Rate Limits

No rate limits are enforced. The server is designed for local use only.
