# VRAM Search API Reference

REST API documentation for the VRAM Search server.

## Base URL

```
http://localhost:3000
```

## Endpoints

### GET /

Serves the Web UI.

**Response**: HTML page

---

### GET /search

Full-text search across indexed files.

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | Yes | - | Search query (FTS5 syntax) |
| `limit` | integer | No | 20 | Max results (1-100) |
| `offset` | integer | No | 0 | Pagination offset |
| `area` | string | No | - | Filter by area (Work, Finance, Personal, Archive, System) |

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
      "path": "/Volumes/VRAM/10-19_Work/14_Communications/14.01_emails/2025/2025-04-04_security.md",
      "filename": "2025-04-04_security.md",
      "area": "Work",
      "category": "Communications",
      "extension": "md",
      "file_size": 13029,
      "modified_at": "2025-12-30T10:57:47.000Z",
      "snippet": "...5 Mindset Shifts →Security← Teams Must Adopt..."
    }
  ],
  "count": 1,
  "time_ms": "24.56"
}
```

**FTS5 Query Syntax**:
- Simple terms: `security`
- Phrases: `"cloud security"`
- AND (implicit): `security compliance`
- OR: `security OR privacy`
- NOT: `security NOT cloud`
- Prefix: `secur*`

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

Health check endpoint.

**Example Request**:
```bash
curl "http://localhost:3000/health"
```

**Example Response**:
```
OK
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
