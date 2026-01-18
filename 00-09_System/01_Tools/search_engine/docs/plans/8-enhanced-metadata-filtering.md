# Plan 8: Enhanced Metadata & Granular Filtering

## Philosophy

Transform the VRAM Search Engine from a basic search tool into a **personal business intelligence platform**. The goal is to enable granular querying across all communication channels (emails, Slack, transcripts) to gain actionable insights about:

- **Yourself**: Track your communication patterns, meeting load, response times
- **Your Business**: Monitor project discussions, deliverable tracking, content production
- **Business Partners**: Identify key relationships, collaboration frequency, expertise areas
- **Prospects & Customers**: Follow-up tracking, engagement history, deal progression

**Core Principles**:
1. **People-Centric**: Unify contacts across all sources for relationship intelligence
2. **Time-Aware**: Enable filtering by year, month, quarter for trend analysis
3. **Context-Rich**: Preserve threading, meeting context, and conversation chains
4. **Query-Friendly**: Optimize for common business questions, not just keyword search

---

## Current vs Target Architecture

### Current State
```
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
├─────────────────────────────────────────────────────────────┤
│  email_chunks          │  slack_chunks      │  chunks        │
│  ├─ email_id           │  ├─ channel        │  ├─ file_path  │
│  ├─ from_email         │  ├─ speakers[]     │  ├─ speakers[] │
│  ├─ to_emails[]        │  ├─ user_ids[]     │  ├─ start_time │
│  ├─ email_date         │  ├─ message_date   │  └─ end_time   │
│  └─ labels[]           │  └─ channel_type   │                │
│                        │                     │                │
│  ⚠️ No unified contacts │ ⚠️ No real names   │ ⚠️ No meeting  │
│  ⚠️ No year filtering   │ ⚠️ No companies    │    metadata    │
│  ⚠️ No thread tracking  │ ⚠️ No thread links │ ⚠️ No duration │
└─────────────────────────────────────────────────────────────┘
```

### Target State
```
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
├─────────────────────────────────────────────────────────────┤
│  contacts (NEW)        │  companies (NEW)   │  transcript_   │
│  ├─ id                 │  ├─ id             │  meetings (NEW)│
│  ├─ name               │  ├─ name           │  ├─ meeting_id │
│  ├─ email (unique)     │  ├─ domain         │  ├─ title      │
│  ├─ company_id →       │  └─ aliases[]      │  ├─ start_time │
│  ├─ slack_user_id      │                    │  ├─ duration   │
│  └─ first_seen_at      │                    │  ├─ is_internal│
│                        │                    │  └─ participants│
├─────────────────────────────────────────────────────────────┤
│  email_chunks          │  slack_chunks      │  chunks        │
│  + cc_emails[]         │  + real_names[]    │  + meeting_id  │
│  + bcc_emails[]        │  + companies[]     │  + participant │
│  + thread_id           │  + thread_ts       │    _ids[]      │
│  + year (generated)    │  + year (generated)│  + year        │
│  + month (generated)   │  + month           │  + month       │
│  + is_sent_by_me       │  + is_edited       │                │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema Enhancements

### Phase 1: Core Tables

#### 1.1 Companies Table
```sql
-- Track companies for business relationship analysis
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,              -- e.g., "hackervalley.com"
  aliases TEXT[] DEFAULT '{}',     -- Alternative names/domains
  industry TEXT,                   -- Optional categorization
  is_customer BOOLEAN DEFAULT false,
  is_partner BOOLEAN DEFAULT false,
  is_prospect BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_name ON companies USING gin(to_tsvector('english', name));
```

#### 1.2 Contacts Table
```sql
-- Unified contact registry across all communication channels
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,               -- Primary identifier
  company_id INTEGER REFERENCES companies(id),
  slack_user_id TEXT,              -- Link to Slack identity
  role TEXT,                       -- Job title/role
  is_me BOOLEAN DEFAULT false,     -- Flag for your own records
  first_seen_at TIMESTAMPTZ,       -- First appearance in data
  last_seen_at TIMESTAMPTZ,        -- Most recent appearance
  email_count INTEGER DEFAULT 0,   -- Denormalized counters
  meeting_count INTEGER DEFAULT 0,
  slack_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',        -- Custom tags (prospect, customer, etc)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_slack ON contacts(slack_user_id);
CREATE INDEX idx_contacts_name ON contacts USING gin(to_tsvector('english', name));
CREATE INDEX idx_contacts_tags ON contacts USING gin(tags);
```

#### 1.3 Transcript Meetings Table
```sql
-- Meeting-level metadata for transcripts (from Fathom JSON)
CREATE TABLE IF NOT EXISTS transcript_meetings (
  id SERIAL PRIMARY KEY,
  meeting_id TEXT UNIQUE NOT NULL, -- Fathom call ID
  title TEXT,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM start_time)) STORED,
  month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM start_time)) STORED,
  quarter INTEGER GENERATED ALWAYS AS (EXTRACT(QUARTER FROM start_time)) STORED,
  is_internal BOOLEAN DEFAULT false,
  team_domain TEXT,                -- e.g., "hackervalley.com"
  permalink TEXT,                  -- Fathom shareable link
  video_url TEXT,
  participant_count INTEGER,
  file_path TEXT,                  -- Link back to source file
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meetings_date ON transcript_meetings(start_time);
CREATE INDEX idx_meetings_year ON transcript_meetings(year);
CREATE INDEX idx_meetings_month ON transcript_meetings(year, month);
CREATE INDEX idx_meetings_internal ON transcript_meetings(is_internal);
CREATE INDEX idx_meetings_title ON transcript_meetings USING gin(to_tsvector('english', title));
```

#### 1.4 Meeting Participants Junction Table
```sql
-- Many-to-many: meetings <-> contacts
CREATE TABLE IF NOT EXISTS meeting_participants (
  id SERIAL PRIMARY KEY,
  meeting_id INTEGER REFERENCES transcript_meetings(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  role TEXT,                       -- 'host', 'speaker', 'attendee'
  speaking_time_seconds INTEGER,   -- Optional: calculated from cues
  UNIQUE(meeting_id, contact_id)
);

CREATE INDEX idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_contact ON meeting_participants(contact_id);
CREATE INDEX idx_meeting_participants_role ON meeting_participants(role);
```

### Phase 2: Enhance Existing Tables

#### 2.1 Email Chunks Enhancements
```sql
-- Add new columns to email_chunks
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS cc_emails TEXT[] DEFAULT '{}';
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS bcc_emails TEXT[] DEFAULT '{}';
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS thread_id TEXT;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS month INTEGER;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS quarter INTEGER;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS is_sent_by_me BOOLEAN DEFAULT false;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS from_contact_id INTEGER REFERENCES contacts(id);
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS importance TEXT;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS attachment_count INTEGER DEFAULT 0;
ALTER TABLE email_chunks ADD COLUMN IF NOT EXISTS attachment_names TEXT[] DEFAULT '{}';

-- Populate year/month/quarter from email_date
UPDATE email_chunks SET
  year = EXTRACT(YEAR FROM email_date),
  month = EXTRACT(MONTH FROM email_date),
  quarter = EXTRACT(QUARTER FROM email_date)
WHERE year IS NULL;

-- Add indexes for new filter columns
CREATE INDEX IF NOT EXISTS idx_email_year ON email_chunks(year);
CREATE INDEX IF NOT EXISTS idx_email_month ON email_chunks(year, month);
CREATE INDEX IF NOT EXISTS idx_email_quarter ON email_chunks(year, quarter);
CREATE INDEX IF NOT EXISTS idx_email_sent_by_me ON email_chunks(is_sent_by_me);
CREATE INDEX IF NOT EXISTS idx_email_thread ON email_chunks(thread_id);
CREATE INDEX IF NOT EXISTS idx_email_from_contact ON email_chunks(from_contact_id);
CREATE INDEX IF NOT EXISTS idx_email_cc ON email_chunks USING gin(cc_emails);
```

#### 2.2 Slack Chunks Enhancements
```sql
-- Add new columns to slack_chunks
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS real_names TEXT[] DEFAULT '{}';
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS companies TEXT[] DEFAULT '{}';
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS thread_ts TEXT;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS is_thread_reply BOOLEAN DEFAULT false;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS month INTEGER;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS quarter INTEGER;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;
ALTER TABLE slack_chunks ADD COLUMN IF NOT EXISTS emoji_reactions TEXT[] DEFAULT '{}';

-- Populate year/month/quarter from message_date
UPDATE slack_chunks SET
  year = EXTRACT(YEAR FROM message_date),
  month = EXTRACT(MONTH FROM message_date),
  quarter = EXTRACT(QUARTER FROM message_date)
WHERE year IS NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_slack_year ON slack_chunks(year);
CREATE INDEX IF NOT EXISTS idx_slack_month ON slack_chunks(year, month);
CREATE INDEX IF NOT EXISTS idx_slack_thread ON slack_chunks(thread_ts);
CREATE INDEX IF NOT EXISTS idx_slack_real_names ON slack_chunks USING gin(real_names);
CREATE INDEX IF NOT EXISTS idx_slack_companies ON slack_chunks USING gin(companies);
```

#### 2.3 Chunks (Transcripts) Enhancements
```sql
-- Add meeting linkage to chunks table
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS meeting_id INTEGER REFERENCES transcript_meetings(id);
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS month INTEGER;
ALTER TABLE chunks ADD COLUMN IF NOT EXISTS quarter INTEGER;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_chunks_meeting ON chunks(meeting_id);
CREATE INDEX IF NOT EXISTS idx_chunks_year ON chunks(year);
CREATE INDEX IF NOT EXISTS idx_chunks_month ON chunks(year, month);
```

---

## API Enhancements

### New Filter Parameters

All search endpoints (`/search`, `/semantic`, `/hybrid`) will support:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `year` | integer | Filter by year | `?year=2024` |
| `month` | integer | Filter by month (1-12) | `?month=6` |
| `quarter` | integer | Filter by quarter (1-4) | `?quarter=2` |
| `date_from` | ISO date | Start of date range | `?date_from=2024-01-01` |
| `date_to` | ISO date | End of date range | `?date_to=2024-06-30` |
| `person` | string | Filter by contact name/email | `?person=emily` |
| `company` | string | Filter by company name | `?company=hackervalley` |
| `is_internal` | boolean | Internal vs external meetings | `?is_internal=true` |
| `sent_by_me` | boolean | Emails I sent | `?sent_by_me=true` |
| `has_attachments` | boolean | Messages with attachments | `?has_attachments=true` |

### New Endpoints

#### `/contacts` - Contact Management
```
GET /contacts                  - List all contacts
GET /contacts?q=emily          - Search contacts by name/email
GET /contacts/:id              - Get contact details
GET /contacts/:id/activity     - Get all activity for a contact
POST /contacts/:id/tags        - Add tags to contact
```

#### `/companies` - Company Management
```
GET /companies                 - List all companies
GET /companies?q=cyber         - Search companies
GET /companies/:id/contacts    - Get contacts at company
GET /companies/:id/activity    - Get all activity with company
```

#### `/meetings` - Meeting Intelligence
```
GET /meetings                  - List all meetings
GET /meetings?year=2024        - Filter by year
GET /meetings?person=emily     - Meetings with specific person
GET /meetings/:id              - Get meeting details with transcript
GET /meetings/:id/participants - Get participant list
```

#### `/analytics` - Business Intelligence
```
GET /analytics/communication   - Communication volume over time
GET /analytics/contacts        - Most contacted people
GET /analytics/companies       - Most engaged companies
GET /analytics/meetings        - Meeting patterns and load
```

---

## Implementation Phases

### Phase 0: Database Migration
**Files**: `migrations/003-enhanced-metadata.sql`

- [ ] Create `companies` table
- [ ] Create `contacts` table
- [ ] Create `transcript_meetings` table
- [ ] Create `meeting_participants` junction table
- [ ] Add new columns to `email_chunks`
- [ ] Add new columns to `slack_chunks`
- [ ] Add new columns to `chunks`
- [ ] Create all new indexes
- [ ] Run migration

### Phase 1: Contact & Company Extraction
**Files**: `contact-extractor.ts`

- [ ] Create contact extraction logic from emails (from, to, cc, bcc)
- [ ] Create contact extraction from Slack user profiles
- [ ] Create contact extraction from transcript participants
- [ ] Auto-extract company from email domain
- [ ] Deduplicate contacts by email
- [ ] Link Slack user IDs to contacts
- [ ] Populate `first_seen_at` and `last_seen_at`
- [ ] Update counters (email_count, meeting_count, slack_count)

### Phase 2: Transcript Meeting Indexer
**Files**: `transcript-indexer.ts`

- [ ] Parse Fathom JSON structure
- [ ] Extract meeting metadata (title, duration, timestamps)
- [ ] Extract participants with roles
- [ ] Determine internal vs external from team_domain
- [ ] Link participants to contacts table
- [ ] Store transcript cues with speaker identification
- [ ] Calculate speaking time per participant
- [ ] Generate embeddings for transcript chunks

### Phase 3: Email Enhancement
**Files**: `email-indexer.ts` (update)

- [ ] Extract CC and BCC recipients
- [ ] Extract thread_id from references/in_reply_to
- [ ] Populate year/month/quarter columns
- [ ] Detect `is_sent_by_me` from sender email
- [ ] Link from_email to contact_id
- [ ] Extract attachment metadata
- [ ] Parse importance/priority headers

### Phase 4: Slack Enhancement
**Files**: `slack-indexer.ts` (update)

- [ ] Extract real_name from user_profile
- [ ] Extract company from user_profile
- [ ] Detect thread replies from thread_ts
- [ ] Track edited messages
- [ ] Extract emoji reactions
- [ ] Populate year/month/quarter columns
- [ ] Link speakers to contact_id

### Phase 5: Search API Updates
**Files**: `server.ts`, `pg-fts.ts`, `hybrid-search.ts`

- [ ] Add year/month/quarter filter parameters
- [ ] Add date_from/date_to range filtering
- [ ] Add person filter (by contact name/email)
- [ ] Add company filter
- [ ] Add is_internal filter for meetings
- [ ] Add sent_by_me filter for emails
- [ ] Add has_attachments filter
- [ ] Update all search functions to use new filters

### Phase 6: New API Endpoints
**Files**: `server.ts`

- [ ] Implement `/contacts` endpoints
- [ ] Implement `/companies` endpoints
- [ ] Implement `/meetings` endpoints
- [ ] Implement basic `/analytics` endpoints
- [ ] Add pagination to all list endpoints

### Phase 7: Web UI Enhancements
**Files**: `index.html`

- [ ] Add year selector dropdown
- [ ] Add month selector dropdown
- [ ] Add person/contact filter input
- [ ] Add company filter input
- [ ] Add "Sent by me" toggle for emails
- [ ] Add internal/external toggle for meetings
- [ ] Display contact/company info in results
- [ ] Add meeting metadata display

### Phase 8: CLI Enhancements
**Files**: `cli.ts`

- [ ] Add `--year` flag
- [ ] Add `--month` flag
- [ ] Add `--person` flag
- [ ] Add `--company` flag
- [ ] Add `--sent-by-me` flag
- [ ] Add `--internal` / `--external` flags
- [ ] Update help text

---

## Example Queries Enabled

After implementation, the following queries become possible:

### Business Intelligence
```bash
# Who have I emailed most in 2024?
bun cli.ts --year 2024 --sent-by-me --stats

# What meetings did I have with Acme Corp?
bun cli.ts meetings --company "acme"

# Show all follow-ups needed (emails I received but didn't reply to)
curl "/search?sources=email&sent_by_me=false&is_reply=false&year=2024"
```

### Relationship Tracking
```bash
# All communications with Emily
bun cli.ts "project update" --person emily

# External meetings in Q4 2024
curl "/meetings?is_internal=false&year=2024&quarter=4"

# Slack discussions about proposals
bun cli.ts "proposal" --sources slack --year 2024
```

### Content Discovery
```bash
# Find attachments shared about invoices
curl "/search?q=invoice&has_attachments=true"

# Meeting transcripts mentioning budget
bun cli.ts "budget" --sources transcript --year 2024
```

---

## Data Flow

```
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│   Email JSON       │     │   Slack JSON       │     │   Fathom JSON      │
│   (/14.01b_...)    │     │   (/14.02_...)     │     │   (Backup/...)     │
└─────────┬──────────┘     └─────────┬──────────┘     └─────────┬──────────┘
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Contact Extractor                                 │
│   - Parse sender/recipients from emails                                  │
│   - Parse user_profile from Slack messages                              │
│   - Parse participants from Fathom transcripts                          │
│   - Auto-extract company from email domain                              │
│   - Deduplicate by email address                                        │
└─────────────────────────────────────────────────────────────────────────┘
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL Database                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  companies   │  │   contacts   │  │  transcript_ │  │  meeting_   │  │
│  │              │◄─┤              │◄─┤   meetings   │◄─┤participants │  │
│  └──────────────┘  └──────┬───────┘  └──────────────┘  └─────────────┘  │
│                           │                                              │
│  ┌──────────────┐  ┌──────┴───────┐  ┌──────────────┐                   │
│  │email_chunks  │  │ slack_chunks │  │    chunks    │                   │
│  │+ from_contact│  │+ real_names  │  │+ meeting_id  │                   │
│  │+ year/month  │  │+ companies   │  │+ year/month  │                   │
│  │+ thread_id   │  │+ thread_ts   │  │              │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Search API                                      │
│   GET /search?q=...&year=2024&person=emily&company=acme                 │
│   GET /contacts/:id/activity                                             │
│   GET /analytics/communication                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

| Query Pattern | Index Used | Expected Performance |
|---------------|------------|---------------------|
| Filter by year | `idx_*_year` | <10ms |
| Filter by year+month | `idx_*_month` | <10ms |
| Filter by person (contact) | `idx_contacts_email` + JOIN | <50ms |
| Filter by company | `idx_companies_domain` + JOIN | <50ms |
| Full-text + year filter | GIN + btree composite | <100ms |
| Analytics aggregation | Requires materialized views for scale | <500ms |

### Optimization Strategies

1. **Denormalized Counters**: Contact table includes `email_count`, `meeting_count`, `slack_count` to avoid expensive JOINs for common analytics
2. **Generated Columns**: `year`, `month`, `quarter` are derived from timestamps for efficient filtering
3. **Partial Indexes**: Separate indexes for transcripts vs files in chunks table
4. **GIN Indexes**: For array columns (tags, speakers, labels)

---

## Migration Strategy

1. **Non-Destructive**: All changes are additive (new tables, new columns)
2. **Backfill Required**: After migration, run contact extraction and re-index to populate new fields
3. **Incremental**: Each phase can be deployed independently
4. **Rollback Safe**: Can drop new columns/tables without affecting existing functionality

---

## Verification Checklist

After implementation:

- [ ] Can filter emails by year/month
- [ ] Can filter Slack messages by year/month
- [ ] Can filter meetings by year/month
- [ ] Can search by person name across all sources
- [ ] Can search by company across all sources
- [ ] Contacts table populated with deduped entries
- [ ] Companies auto-extracted from email domains
- [ ] Meeting metadata extracted from Fathom JSON
- [ ] Analytics endpoints return meaningful data
- [ ] Web UI displays new filter options
- [ ] CLI supports new filter flags
- [ ] Performance within acceptable thresholds

---

## Test Cases for Verification

Actual test cases from the VRAM data to validate implementation correctness.

### Email Test Cases

#### E1: Person Filter Test - Emily Humphrey HubSpot Invitation
**Source File**: `14.01b_emails_json/2024/2024-01-02_172034_045481_Emily Humphrey has invited you to join them in Hub.json`

| Field | Expected Value |
|-------|----------------|
| `from_name` | Emily Humphrey |
| `from_email` | emily@hackervalley.com |
| `subject` | Contains "invited you to join" |
| `year` | 2024 |
| `month` | 1 |
| `labels` | ["Archived", "Important", "Opened", "Category Updates"] |
| `is_sent_by_me` | false |

**Verification Query**:
```sql
SELECT * FROM email_chunks
WHERE from_email = 'emily@hackervalley.com'
  AND year = 2024
  AND month = 1;
```

#### E2: Sent By Me + Threading Test - Invoice Reply
**Source File**: `14.01b_emails_json/2025/2025-01-02_190924_022978_Re Invoice #2025-01-02749.json`

| Field | Expected Value |
|-------|----------------|
| `from_name` | Ron Eddings |
| `from_email` | Ron@hackervalley.com |
| `is_sent_by_me` | true |
| `year` | 2025 |
| `labels` | Contains "Sent" |
| `thread_id` | Should be populated (has in_reply_to/references) |

**Verification Query**:
```sql
SELECT * FROM email_chunks
WHERE is_sent_by_me = true
  AND year = 2025
  AND thread_id IS NOT NULL;
```

#### E3: CC/BCC + Attachment Test - CrowdStrike Invoice
**Source File**: `14.01b_emails_json/2024/2024-01-03_052349_045248_Hacker Valley Media Invoice, Full-Service Podcast.json`

| Field | Expected Value |
|-------|----------------|
| `from_name` | Ron Eddings |
| `from_email` | Ron@hackervalley.com |
| `to_emails` | ["apinvoices@crowdstrike.com"] |
| `cc_emails` | ["jeffrey.taylor@crowdstrike.com", "emily@hackervalley.com"] |
| `bcc_emails` | ["44814285@bcc.hubspot.com"] |
| `is_sent_by_me` | true |
| `year` | 2024 |
| `attachment_count` | 1 |
| `attachment_names` | ["HVM 2024 Full-Service Podcast Production Support.pdf"] |
| `labels` | ["Archived", "Sent", "Opened"] |

**Verification Query**:
```sql
SELECT * FROM email_chunks
WHERE is_sent_by_me = true
  AND year = 2024
  AND attachment_count > 0
  AND 'emily@hackervalley.com' = ANY(cc_emails);
```

### Slack Test Cases

#### S1: User Profile + Real Name Test - ea-support Channel
**Source File**: `14.02_slack/json/ea-support/2025-05-28.json`

| Field | Expected Value |
|-------|----------------|
| `channel` | ea-support |
| `user_id` | U08TY6VE0PP |
| `real_names` | Contains "Berna Gallardo" |
| `display_name` | Berna Gallardo |
| `year` | 2025 |
| `month` | 5 |
| `message_text` | "Good morning Team!" |
| `timestamp` | 1748435846.249129 |

**Verification Query**:
```sql
SELECT * FROM slack_chunks
WHERE channel = 'ea-support'
  AND year = 2025
  AND 'Berna Gallardo' = ANY(real_names);
```

#### S2: Edited Message Test - hacker-valley-media-team
**Source File**: `14.02_slack/json/hacker-valley-media-team/2021-12-10.json`

| Field | Expected Value |
|-------|----------------|
| `channel` | hacker-valley-media-team |
| `user_id` | U01JT8G60AD |
| `real_names` | Contains "Allan Alford" |
| `is_edited` | true |
| `year` | 2021 |
| `month` | 12 |
| `emoji_reactions` | Contains "clap", "crossed_swords" |

**Verification Query**:
```sql
SELECT * FROM slack_chunks
WHERE channel = 'hacker-valley-media-team'
  AND is_edited = true
  AND 'Allan Alford' = ANY(real_names);
```

#### S3: Thread Test - hacker-valley-media-team
**Source File**: `14.02_slack/json/hacker-valley-media-team/2021-12-10.json`

| Field | Expected Value |
|-------|----------------|
| `channel` | hacker-valley-media-team |
| `thread_ts` | 1639152006.001900 |
| `is_thread_reply` | false (parent message) |
| `reply_count` | 3 |
| `year` | 2021 |
| `month` | 12 |

**Verification Query**:
```sql
SELECT * FROM slack_chunks
WHERE thread_ts IS NOT NULL
  AND year = 2021
  AND channel = 'hacker-valley-media-team';
```

### Transcript Test Cases

#### T1: Multi-Participant External Meeting - Darby Copenhaver
**Source File**: `Backup/meetings/fathom_transcripts/2025/2025-01-16-213084945.json`

| Field | Expected Value |
|-------|----------------|
| `meeting_id` | 213084945 |
| `title` | Darby Copenhaver |
| `description` | agencymastery360.com |
| `start_time` | 2025-01-16T20:30:00.000000Z |
| `duration_minutes` | 26 |
| `year` | 2025 |
| `month` | 1 |
| `is_internal` | false (external domain agencymastery360.com) |
| `participant_count` | 2 unique people |

**Participants Expected**:
| Name | Email | Role | Company |
|------|-------|------|---------|
| Ron Eddings | ron@hackervalley.com | host | Hacker Valley Media |
| Darby Copenhaver | darby@agencymastery360.com | attendee | (external) |

**Verification Query**:
```sql
SELECT tm.*,
       array_agg(c.name) as participant_names
FROM transcript_meetings tm
JOIN meeting_participants mp ON mp.meeting_id = tm.id
JOIN contacts c ON c.id = mp.contact_id
WHERE tm.meeting_id = '213084945'
GROUP BY tm.id;
```

#### T2: Internal Multi-Person Meeting - Marketing Onboarding
**Source File**: `Backup/meetings/fathom_transcripts/2024/2024-04-08-83610269.json`

| Field | Expected Value |
|-------|----------------|
| `meeting_id` | 83610269 |
| `title` | Marketing onboarding sync |
| `description` | Layne Finnegan |
| `start_time` | 2024-04-08T14:00:00.000000Z |
| `duration_minutes` | 66 |
| `year` | 2024 |
| `month` | 4 |
| `quarter` | 2 |

**Participants Expected**:
| Name | Email | Role |
|------|-------|------|
| Emily Humphrey | emily@hackervalley.com | host |
| Layne Finnegan | laynefinnegan@gmail.com | attendee |
| Ron Eddings | (inferred) | speaker |

**Speakers in Transcript**: Layne Finnegan, Emily Humphrey, Ron Eddings

**Verification Query**:
```sql
SELECT tm.*, c.name, mp.role
FROM transcript_meetings tm
JOIN meeting_participants mp ON mp.meeting_id = tm.id
JOIN contacts c ON c.id = mp.contact_id
WHERE tm.year = 2024 AND tm.month = 4
  AND tm.title ILIKE '%marketing%onboarding%';
```

#### T3: Customer/Partner Meeting - Descope
**Source File**: `Backup/meetings/fathom_transcripts/2024/2024-11-11-179175157.json`

| Field | Expected Value |
|-------|----------------|
| `meeting_id` | 179175157 |
| `title` | Call |
| `description` | Descope |
| `start_time` | 2024-11-11T23:00:00.000000Z |
| `duration_minutes` | 36 |
| `year` | 2024 |
| `month` | 11 |
| `quarter` | 4 |
| `is_internal` | false (external company Descope) |

**Participants Expected**:
| Name | Email | Role | Company |
|------|-------|------|---------|
| Ron Eddings | ron@hackervalley.com | host | Hacker Valley Media |
| Rishi Bhargava | r@descope.com | attendee | Descope |

**Verification Query**:
```sql
-- Query for company-based filtering
SELECT tm.*, c.name, co.name as company_name
FROM transcript_meetings tm
JOIN meeting_participants mp ON mp.meeting_id = tm.id
JOIN contacts c ON c.id = mp.contact_id
LEFT JOIN companies co ON co.id = c.company_id
WHERE co.name ILIKE '%descope%'
   OR c.email LIKE '%@descope.com';
```

### Contact & Company Extraction Verification

After running the contact extractor, verify these entries exist:

#### Expected Contacts
| Name | Email | Source | Company |
|------|-------|--------|---------|
| Ron Eddings | ron@hackervalley.com | Email/Transcript | Hacker Valley Media |
| Emily Humphrey | emily@hackervalley.com | Email/Transcript | Hacker Valley Media |
| Darby Copenhaver | darby@agencymastery360.com | Transcript | Agency Mastery 360 |
| Rishi Bhargava | r@descope.com | Transcript | Descope |
| Layne Finnegan | laynefinnegan@gmail.com | Transcript | - |
| Jeff Taylor | jeffrey.taylor@crowdstrike.com | Email (CC) | CrowdStrike |
| Berna Gallardo | - | Slack | - |
| Allan Alford | - | Slack | - |
| Ivan Mendoza | - | Slack | - |

#### Expected Companies
| Name | Domain | Source |
|------|--------|--------|
| Hacker Valley Media | hackervalley.com | Email/Transcript |
| CrowdStrike | crowdstrike.com | Email |
| Descope | descope.com | Transcript |
| Agency Mastery 360 | agencymastery360.com | Transcript |

### Comprehensive Query Tests

After full implementation, these queries should return correct results:

```bash
# Find all communications with Rishi from Descope
bun cli.ts --person "rishi" --sources all

# Find all Q4 2024 meetings (should include Descope call)
curl "/meetings?year=2024&quarter=4"

# Find emails Ron sent with attachments in 2024
curl "/search/emails?sent_by_me=true&has_attachments=true&year=2024"

# Find all Slack messages from Allan Alford
curl "/search/slack?person=allan%20alford"

# Find all internal meetings in April 2024
curl "/meetings?year=2024&month=4&is_internal=true"
```

---

*Created: 2026-01-18*
