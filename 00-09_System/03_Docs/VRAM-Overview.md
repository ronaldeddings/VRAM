# VRAM Overview

**VRAM** (Ron Eddings' memory on disk) is a personal data asset management system designed to centralize, organize, and make searchable all digital information across work, personal, and archival domains.

## Purpose

VRAM serves as the single source of truth for all text-based digital assets:

- **Consolidation**: All important data lives in one searchable location
- **Organization**: Johnny.Decimal structure provides intuitive navigation
- **Searchability**: Full-text search across 180,000+ files in milliseconds
- **Longevity**: Plain text formats ensure future accessibility
- **Portability**: Self-contained on a dedicated volume

## Philosophy

### Plain Text First
All data is stored in human-readable formats (Markdown, JSON, plain text). This ensures:
- No vendor lock-in
- Easy scripting and automation
- Future-proof accessibility
- Simple backup and sync

### Structure Over Tags
Instead of relying on tags or complex metadata, VRAM uses folder hierarchy to organize content. The Johnny.Decimal system provides:
- Predictable locations for all content types
- Maximum 2 levels of depth within areas
- Unique numeric identifiers for each category

### Local First
VRAM lives on a dedicated local volume, providing:
- Instant access without network dependency
- Full control over data
- Privacy by default
- Easy backup to external drives or cloud

## Core Components

### Storage Layer
- **Volume**: `/Volumes/VRAM` (dedicated SSD/partition)
- **Structure**: Johnny.Decimal organization (00-99 areas)
- **Formats**: Markdown (.md), JSON (.json), Plain Text (.txt)

### Index Layer
- **Database**: SQLite with FTS5 full-text search
- **Location**: `00-09_System/00_Index/search.db`
- **Performance**: Sub-100ms search across all files

### Interface Layer
- **Web UI**: Browser-based search at localhost:3000
- **CLI**: Command-line search tool
- **Raycast**: Quick launcher integration
- **API**: REST endpoints for automation

## Data Domains

| Area | Range | Purpose |
|------|-------|---------|
| System | 00-09 | VRAM infrastructure, tools, config, docs |
| Work | 10-19 | Professional projects, clients, communications |
| Finance | 20-29 | Banking, investments, taxes, insurance |
| Personal | 30-39 | Journals, health, learning, goals |
| Family | 40-49 | Family-related documents and memories |
| Social | 50-59 | Social connections and community |
| Growth | 60-69 | Personal development and skills |
| Lifestyle | 70-79 | Hobbies, travel, home |
| Resources | 80-89 | Reference materials and resources |
| Archive | 90-99 | Historical and archived content |

## Key Metrics

- **Total Files**: 181,399
- **Total Size**: ~4 GB
- **Search Speed**: ~25ms average
- **File Types**: Markdown (80K), JSON (98K), Text (2.6K)

## Getting Started

1. **Search**: Open http://localhost:3000 or use `bun cli.ts "query"`
2. **Browse**: Navigate the folder structure in Finder
3. **Add Content**: Place files in appropriate category folders
4. **Auto-Index**: File watcher updates search index automatically

## Related Documentation

- [Folder Structure](./Folder-Structure.md) - Johnny.Decimal organization
- [Naming Conventions](./Naming-Conventions.md) - File naming standards
- [Data Types](./Data-Types.md) - What goes where
- [Workflows](./Workflows.md) - Import and processing workflows
- [Maintenance](./Maintenance.md) - Backup and upkeep procedures
