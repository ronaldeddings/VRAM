# VRAM Global Notes
## Directory Exploration Documentation

This document contains comprehensive notes from systematically exploring every directory in the VRAM Personal Data Asset Management System.

---

## 00-09_System Directory

**Purpose**: System infrastructure, tools, configurations, and documentation for the VRAM ecosystem.

### Structure:
- `00_Index` - System indexing
- `01_Tools` - Development and productivity tools
- `02_Config` - Configuration files
- `03_Docs` - Documentation

### Key Tools Discovered:

#### 1. Transcription App (`01_Tools/transcription-app/`)
**Type**: Bun/TypeScript/React web application

**Purpose**: Audio/video transcription with automatic speaker identification using voice embeddings.

**Features**:
- Audio/Video Transcription (MP4, MP3, WAV, M4A, MOV)
- Speaker Identification using voice embeddings
- Speaker Registry Management for known speakers
- Real-time React UI with live status updates
- Self-contained with all models included

**Technology Stack**:
- Runtime: Bun
- Frontend: React 19
- Backend: Bun.serve() with routes
- Speech Recognition: sherpa-onnx (Whisper tiny.en)
- Speaker Diarization: sherpa-onnx (PyAnnote)
- Speaker Embeddings: sherpa-onnx (3D-Speaker)
- Media Conversion: ffmpeg

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with model status |
| GET | `/api/speakers` | List registered speakers |
| POST | `/api/transcribe` | Transcribe an audio/video file |
| POST | `/api/registry/rebuild` | Rebuild registry from labeled transcripts |
| POST | `/api/speakers/add` | Add a new speaker with voice sample |
| POST | `/api/speakers/remove` | Remove a speaker from registry |

**Registered Speakers**:
- Andre Ludwig (3 samples)
- Berna Gallardo (1 sample)
- Emily Humphrey (3 samples)
- Heidi (3 samples)
- Ivan Mendoza (3 samples)
- Jessica Rusch (3 samples)
- Ron Eddings (3 samples)
- Sara Gotwalt (3 samples)
- tracyholden (3 samples)

**Configuration** (`lib/config.ts`):
- Speaker identification threshold: 0.40
- Min segment duration: 5.0 seconds
- Embedding dimension: 512
- Sample rate: 16000 Hz

---

#### 2. Maestro (`01_Tools/Maestro/`)
**Type**: Electron desktop application (v0.14.4)

**Author**: Pedram Amini (pedram@runmaestro.ai)

**Purpose**: Cross-platform desktop app for orchestrating AI agents and projects. Designed for power users who live on the keyboard.

**Tagline**: "Maestro hones fractured attention into focused intent."

**Supported AI Agents**:
- Claude Code
- OpenAI Codex
- OpenCode
- (Planned: Aider, Gemini CLI, Qwen3 Coder)

**Key Features**:
1. **Git Worktrees** - Run AI agents in parallel on isolated branches
2. **Auto Run & Playbooks** - File-system-based task runner for batch processing markdown checklists
3. **Group Chat** - Coordinate multiple AI agents in single conversation with moderator AI
4. **Mobile Remote Control** - Web server with QR code access, Cloudflare tunneling
5. **CLI Tool** (`maestro-cli`) - Headless operation for automation
6. **Multi-Agent Management** - Unlimited agents and terminals in parallel
7. **Message Queueing** - Queue messages while AI is busy
8. **Keyboard-First Design** - Full keyboard control with customizable shortcuts
9. **Session Discovery** - Auto-import existing sessions from providers
10. **Git Integration** - Repo detection, branch display, diff viewer, commit logs
11. **Usage Dashboard** - Analytics for AI usage patterns
12. **Document Graph** - Visual knowledge graph of markdown documentation
13. **12 Beautiful Themes** - Dracula, Monokai, Nord, Tokyo Night, etc.

**Architecture** (from ARCHITECTURE.md):
- **Dual-Process Architecture**: Electron main/renderer split with strict context isolation
- **Main Process** (`src/main/`): Node.js backend with full system access
- **Renderer Process** (`src/renderer/`): React frontend with no direct Node.js access
- **Process Manager**: Handles PTY processes (terminal) and child processes (AI agents)
- **Layer Stack System**: Centralized modal/overlay management with Escape key handling
- **15 Custom React Hooks** for state management

**Constitution Principles** (from CONSTITUTION.md):
1. **Unattended Excellence** - Maximize autonomous runtime
2. **The Conductor's Perspective** - Fleet management focus
3. **Keyboard Sovereignty** - Hands never leave keyboard
4. **Instant Response** - Zero latency tolerance
5. **Delightful Focus** - Polish over features
6. **Transparent Complexity** - Progressive disclosure

**Technology Stack**:
- Electron 28.1.0
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.11
- Tailwind CSS 3.4.1
- better-sqlite3 (for stats)
- node-pty (for terminal)
- React Flow (for document graph)
- Recharts (for analytics)

**License**: AGPL-3.0

---

### Summary:
The 00-09_System directory contains critical infrastructure tools:
1. **Transcription App** - Self-contained speaker diarization and transcription for podcast/meeting content
2. **Maestro** - Sophisticated multi-agent orchestration platform for AI-assisted development

Both tools demonstrate advanced TypeScript/React patterns and are designed for the Hacker Valley Media workflow.

---

#### 3. Search Engine (`01_Tools/search_engine/`)
**Type**: Bun/TypeScript full-stack search application

**Purpose**: Unified multi-source search engine combining PostgreSQL full-text search (tsvector/tsquery) with semantic vector search (pgvector) using Reciprocal Rank Fusion (RRF).

**Technology Stack**:
- Runtime: Bun 1.1.45
- Database: PostgreSQL with pgvector extension
- Embeddings: Qwen3-VL-Embedding-8B (4096 dimensions) via port 8081
- Server: Bun.serve() on port 3000
- ORM: postgres (Bun SQL driver)

**Data Sources Indexed**:
| Source | Table | Content |
|--------|-------|---------|
| Files | `documents` | Markdown, JSON, TXT files from VRAM |
| Transcripts | `chunks` | Meeting transcript segments with speaker info |
| Emails | `email_chunks` | Email content with threading, CC/BCC |
| Slack | `slack_chunks` | Slack messages with channel, reactions |

**API Endpoints**:
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Web UI |
| GET | `/search` | Keyword search (PostgreSQL FTS) |
| GET | `/semantic` | Vector similarity search |
| GET | `/hybrid` | Combined FTS + semantic with RRF |
| GET | `/file?path=...` | Get file metadata and content |
| GET | `/browse/:area` | Browse files by area |
| GET | `/stats` | Index statistics |
| GET | `/health` | Health check |
| GET | `/contacts` | Contact management |
| GET | `/companies` | Company registry |
| GET | `/meetings` | Meeting intelligence |
| GET | `/analytics/*` | Business intelligence dashboards |

**Search Strategies**:
1. **RRF (default)**: Reciprocal Rank Fusion - `1/(k+rank)` with k=60
2. **Weighted**: Simple weighted combination of FTS + semantic scores
3. **Max**: Take maximum score from either source

**Enhanced Filtering** (Plan 8 implementation):
| Filter | Type | Sources | Example |
|--------|------|---------|---------|
| `year` | integer | All | `?year=2024` |
| `month` | integer | All | `?month=6` |
| `quarter` | integer | All | `?quarter=2` |
| `person` | string | All | `?person=emily` |
| `company` | string | All | `?company=hackervalley` |
| `speaker` | string | Transcript/Slack | `?speaker=Ron` |
| `sentByMe` | boolean | Email | `?sentByMe=true` |
| `hasAttachments` | boolean | Email | `?hasAttachments=true` |
| `isInternal` | boolean | Meetings | `?isInternal=false` |

**Database Schema**:

```sql
-- Documents (files)
documents (id, path, filename, extension, content, file_size,
           modified_at, area, category, content_type, search_vector)

-- Chunks (transcripts/file chunks)
chunks (id, file_path, filename, area, category, chunk_index,
        chunk_text, chunk_size, embedding, speakers[], start_time,
        end_time, meeting_id, year, month, quarter, search_vector)

-- Email Chunks
email_chunks (id, email_id, email_path, subject, from_name, from_email,
              to_emails[], cc_emails[], bcc_emails[], email_date, labels[],
              has_attachments, is_reply, is_sent_by_me, thread_id,
              year, month, quarter, chunk_text, embedding, search_vector)

-- Slack Chunks
slack_chunks (id, channel, channel_type, speakers[], user_ids[],
              real_names[], companies[], message_date, message_count,
              has_files, has_reactions, thread_ts, is_edited,
              year, month, quarter, chunk_text, embedding, search_vector)

-- Contacts (CRM)
contacts (id, name, email, company_id, slack_user_id, role, is_me,
          first_seen_at, last_seen_at, email_count, meeting_count,
          slack_count, tags[])

-- Companies
companies (id, name, domain, aliases[], industry, is_customer,
           is_partner, is_prospect)

-- Transcript Meetings
transcript_meetings (id, meeting_id, title, description, start_time,
                     end_time, duration_minutes, year, month, quarter,
                     is_internal, participant_count, file_path)

-- Meeting Participants (junction)
meeting_participants (meeting_id, contact_id, role, speaking_time_seconds)
```

**Hybrid Search Flow**:
```
Query → [Parallel]
         ├─ PostgreSQL FTS (tsvector @@ tsquery) → Keyword Results
         └─ pgvector (embedding <=> query) → Semantic Results
                     ↓
              Reciprocal Rank Fusion
                     ↓
              Combined Results (sorted by RRF score)
```

**CLI Usage**:
```bash
# Basic search
bun cli.ts "security best practices"

# Filter by source and time
bun cli.ts "budget" --sources transcript --year 2024

# Person/company filter
bun cli.ts "proposal" --person emily --company crowdstrike

# Email-specific
bun cli.ts "invoice" --sources email --sent-by-me --has-attachments
```

**Index Statistics** (from database):
- Total indexed files: 181,399+
- Total chunks: 100,000+
- Email chunks: 50,000+
- Slack chunks: 20,000+
- Database size: ~6.9GB

**Architecture Goals** (from Plan 8):
- **People-Centric**: Unified contacts across all sources
- **Time-Aware**: Year/month/quarter filtering for trend analysis
- **Context-Rich**: Threading, meeting context, conversation chains
- **Query-Friendly**: Optimized for business questions, not just keywords

---

## 10-19_Work Directory

**Purpose**: Work-related projects, client work, meetings, and communications for Hacker Valley Media and associated ventures.

### Structure:
- `10_Hacker_Valley_Media` - Main HVM business operations
- `11_Mozilla` - Mozilla-related work (placeholder)
- `12_Clients` - Client project files
- `13_Meetings` - Meeting transcripts and notes
- `14_Communications` - Email archives and correspondence
- `15_Archive` - Archived work materials

### Key Projects Discovered:

#### 1. HVM Website - Payload CMS (`10.09.01_website/hvm-website-payloadcms/`)
**Type**: Next.js 15 + Payload CMS 3 web application

**Purpose**: New website being migrated from HubSpot CMS to a modern headless CMS architecture.

**Technology Stack**:
- Framework: Next.js 15 with App Router
- CMS: Payload CMS 3.x (Lexical rich text editor)
- Styling: Tailwind CSS with CSS variables
- UI Components: Radix UI primitives (shadcn/ui pattern)
- Database: PostgreSQL
- Features: Dark mode, live preview, ISR (revalidation)

**Custom Blocks Implemented**:
| Block | Purpose |
|-------|---------|
| `ArchiveBlock` | Content archive display |
| `SocialLinks` | Social media link grid |
| `EpisodePlayer` | Podcast episode player |
| `StatsDisplay` | Audience statistics showcase |
| `Form` | Lead capture forms |

---

#### 2. HVM Website - HubSpot (`10.09.01_website/hackervalley-website-hubspot/`)
**Type**: HubSpot CMS theme (current production site)

**Purpose**: Current hackervalley.com website running on HubSpot CMS.

**Technology Stack**:
- Platform: HubSpot CMS with DND (Drag & Drop) areas
- Template Engine: HubL (HubSpot Language)
- CSS Architecture: ITCSS-style (generic → objects → elements → components → utilities)
- Responsive: Mobile breakpoint at 767px

**Development Workflow**:
- GitHub Actions deployment via `@hubspot/cli`
- Local development: `hs watch src hackervalleymedia`
- Style Guide: BEM class structure, semantic HTML, accessibility-first

**Code Style Standards** (from STYLEGUIDE.md):
- HTML: Semantic markup, ARIA attributes, tabindex for keyboard nav
- CSS: BEM naming, alphabetized declarations, flexbox over float
- JavaScript: ES5 for IE11 compatibility, event bubbling, no jQuery
- HubL: Spaces around variables `{{ variable }}`, filters adjacent `{{ var|filter }}`

---

#### 3. Migration Documentation (`10.09.01_website/`)

**Migration Plan** (`MIGRATION-IMPLEMENTATION-PLAN.md`):
- 10-phase migration from HubSpot to Payload CMS
- Comprehensive 2742-line implementation roadmap
- Covers: Foundation, Design System, Collections, Blocks, Forms, SEO, Deployment

**Brand Style Guide** (`hacker-valley-brand-style-guide.md`):
- Primary Font: Balboa (800 ExtraBold for headlines)
- Body Fonts: Acumin Pro Condensed, Montserrat, Raleway
- Color Tokens: Primary blue, dark backgrounds, cybersecurity aesthetic
- Spacing System: 8px base grid

**Website Audit** (`hacker-valley-website-audit.md`):
- Current site assessment with UX recommendations
- Identified messaging inconsistencies
- Button style standardization needed
- Missing pages: Pricing, Case Studies, Team, FAQ

---

#### 4. Communications Archive (`14_Communications/14.01b_emails_json/`)
**Type**: Email archive in JSON format

**Purpose**: Archived email correspondence organized by year (2022+).

**Structure**:
- Files named: `YYYY-MM-DD_HHMMSS_ID_Subject.json`
- Contains: headers, body (plain + HTML), attachments metadata, threading info
- Labels: Gmail-style (Archived, Important, Category Personal)

**Sample Email Types**:
- Client communications (PlexTrac, CrowdStrike)
- Production sync meetings
- Marketing outreach
- Podcast guest coordination

---

### Business Context:
**Hacker Valley Media** is a cybersecurity creative media agency featuring:
- **Audience**: 50,000+ monthly listeners from 150+ countries
- **Content**: 400+ podcast episodes
- **Demographics**: 49% Senior Leadership, 33% Enterprise
- **Services**: Podcast Sponsorship, Brand Videos, Testimonials, Event Coverage
- **Clients**: CrowdStrike, NetSPI, Axonius, Deepwatch, PlexTrac

---

### Summary:
The 10-19_Work directory contains Hacker Valley Media's core business operations:
1. **Active Website Migration** - HubSpot → Payload CMS with comprehensive planning docs
2. **Brand Assets** - Complete style guide and design system
3. **Communication Archive** - Structured email history for business continuity
4. **Client Work** - Project files and meeting documentation

The migration represents a significant technology modernization effort moving from proprietary HubSpot CMS to an open-source Next.js/Payload stack.

---

## 20-29_Finance Directory

**Purpose**: Financial records, banking, investments, taxes, and insurance documents.

**Status**: Placeholder structure only - no data files yet

### Structure:
| Category | Subcategories |
|----------|--------------|
| `20_Banking` | 20.01_checking, 20.02_savings, 20.03_credit_cards |
| `21_Investments` | 21.01_brokerage, 21.02_retirement, 21.03_crypto |
| `22_Taxes` | 22.01_2023, 22.02_2024, 22.03_2025, 22.04_2026 |
| `23_Insurance` | 23.01_health, 23.02_life, 23.03_auto, 23.04_home |
| `24_Real_Estate` | Property folders |
| `25_Archive` | Historical records |

---

## 30-39_Personal Directory

**Purpose**: Personal journals, recordings, health tracking, goals, and messaging archives.

**Status**: Active - Contains significant data

### Structure:
| Category | Subcategories | Content |
|----------|--------------|---------|
| `30_Journals` | 30.01_daily, 30.02_weekly, 30.03_monthly | Obsidian-style journals with YAML frontmatter |
| `31_Capture` | 31.03_rewind | **14,475 audio snippets** from Rewind app |
| `31_Recordings` | voice_memos, limitless, rewind | Personal recordings |
| `32_Health` | workouts, medical, nutrition | Health tracking |
| `33_Learning` | books, courses, notes | Educational content |
| `34_Goals` | vision, annual, reviews | Goal tracking |
| `35_Messages` | imessage, signal, whatsapp, other | Message exports |
| `36_Archive` | Historical personal data |

### Rewind Audio Collection:
- **Count**: 14,475 audio snippets
- **Format**: M4A files
- **Organization**: Date folders (e.g., `2025_06_21/snippets/`)
- **Date Range**: 2024-08 through 2025-06

### Journal Format (Obsidian-compatible):
```yaml
---
entity_type: Daily Note
date: YYYY-MM-DD
energy_morning: "7"
energy_evening: "8"
mood_overall: "7"
workout_done: true
meditation_done: true
sleep_hours: "5"
sleep_quality: "6"
weight: "162"
---
```

Features Dataview queries for tasks, meetings, health dashboards, and goals progress.

---

## 40-49_Family Directory

**Purpose**: Family memories, events, photos, and important documents.

**Status**: Placeholder structure only

### Structure:
- `40_Memories` - Family memories and stories
- `41_Events` - Family events and gatherings
- `42_Photos` - Photo archives by year
- `43_Documents` - Legal, medical, important docs
- `44_Archive` - Historical family records

---

## 50-59_Social Directory

**Purpose**: People relationships, social events, and contacts.

**Status**: Placeholder structure only

### Structure:
- `50_People` - family, friends, colleagues, clients
- `51_Events` - Social event records
- `52_Archive` - Historical social data

---

## 60-69_Growth Directory

**Purpose**: Personal and professional development tracking.

**Status**: Placeholder structure only

### Structure:
- `60_Career` - skills, achievements, portfolio
- `61_Character` - Character development
- `62_Emotional` - Emotional growth
- `63_Spiritual` - Spiritual journey
- `64_Vision` - Life vision and planning

---

## 70-79_Lifestyle Directory

**Purpose**: Experiences, travel, and living environment.

**Status**: Placeholder structure only

### Structure:
- `70_Experiences` - Life experiences
- `71_Travel` - Travel records
- `72_Environment` - Living space documentation
- `73_Archive` - Historical lifestyle data

---

## 80-89_Resources Directory

**Purpose**: Reference materials, templates, and knowledge base.

**Status**: Placeholder structure only

### Structure:
- `80_Reference` - books, articles, research
- `81_Templates` - Reusable templates
- `82_Knowledge` - how_tos, processes, standards
- `83_Archive` - Archived resources

---

## 90-99_Archive Directory

**Purpose**: Long-term archive for all life areas.

**Status**: Placeholder structure only

### Structure:
- `90_Work_Archive` - Archived work projects
- `91_Personal_Archive` - Personal archives
- `92_Project_Archive` - Completed project archives
- `93_Media_Archive` - Media archives

---

## Backup Directory

**Purpose**: System backups, database dumps, and migrated data archives.

**Status**: Active - Contains substantial backup data

### Structure & Contents:

#### Database Backups:
| File | Size | Date |
|------|------|------|
| `vram_embeddings_20260118_103024.dump` | 4.4 GB | Jan 18, 2026 |
| `vram_embeddings_20260118_135440.dump` | 5.2 GB | Jan 18, 2026 |
| `vram_embeddings_20260118_164544.dump` | 5.7 GB | Jan 18, 2026 |
| `vram_embeddings_20260119_053336.dump` | 6.9 GB | Jan 19, 2026 |

#### Journal Backups (`journals/`):
- **Daily Notes**: 40 files (Oct 2025)
- **Weekly Notes**: 2 files (W41, W42)
- Format: Obsidian markdown with YAML frontmatter

#### Meeting Backups (`meetings/`):
**Fathom Meeting Platform Exports**:
| Type | 2023 | 2024 | 2025 | 2026 |
|------|------|------|------|------|
| JSON metadata | 302 | 1,481 | 1,329 | 34 |
| MP4 recordings | ~2,090 total across years |
| Transcripts | 342 | 2,023 | 1,625 | 37 |

#### Message Backups (`messages/`):
- **AllMail.mbox**: 15.5 GB Gmail archive
- `hackervalley_emails_json/` - Parsed JSON emails
- `hackervalley_emails_markdown/` - Markdown conversions
- `slack/` - Slack exports

#### Recording Backups (`recordings/`):
| Source | Count/Size |
|--------|------------|
| iOS Voice Memos | 334 files (2018-2020) |
| Limitless Pendant | Recordings |
| Rewind | 3 export folders (2025-2026) |

#### Tools Backup (`tools/`):
- `transcription-app/` - Previous version backup

#### Documentation:
- `reportfinal.md` (36KB) - Complete VRAM system manual

---

## VRAM System Philosophy (from reportfinal.md)

### Three Core Principles:

1. **Dump and Search**: Data flows one direction - in. Files are artifacts; value comes from search.

2. **Structure Enables Discovery**: Johnny.Decimal numbering gives every location a unique address.

3. **Applications on Top**: Folder structure is foundation. Search, AI, automation are layers on top.

### System Architecture:

```
ACCESS LAYER → Web UI, CLI, Raycast
     ↓
SEARCH LAYER → Bun.serve() API + bun:sqlite + FTS5
     ↓
AUTOMATION LAYER → File Watcher, Scheduled Indexer, Import Scripts
     ↓
DATA LAYER → /Volumes/VRAM/ (Markdown, JSON, TXT, Media)
```

### Search Database Schema:
- **files table**: path, filename, extension, content, file_size, modified_at, area, category
- **files_fts**: FTS5 virtual table with porter stemming and unicode tokenization
- **API Endpoints**: `/search`, `/file`, `/browse/:area`, `/stats`, `/health`

### Data Flow:
- Email → Markdown with YAML frontmatter
- Meetings → TXT transcripts + JSON metadata + MP4 recordings
- Messages → Platform exports organized by thread
- Recordings → Audio/video by date

---

## Summary Statistics

| Directory | Status | Content |
|-----------|--------|---------|
| 00-09_System | Active | Transcription App, Maestro, Search Engine |
| 10-19_Work | Active | HVM Website projects, emails |
| 20-29_Finance | Placeholder | Empty structure |
| 30-39_Personal | Active | 14K+ Rewind files, journals |
| 40-49_Family | Placeholder | Empty structure |
| 50-59_Social | Placeholder | Empty structure |
| 60-69_Growth | Placeholder | Empty structure |
| 70-79_Lifestyle | Placeholder | Empty structure |
| 80-89_Resources | Placeholder | Empty structure |
| 90-99_Archive | Placeholder | Empty structure |
| Backup | Active | 6.9GB database, meetings, emails |

**Total Indexed Content**: Approximately 20GB+ of structured personal data spanning 2018-2026.

---

