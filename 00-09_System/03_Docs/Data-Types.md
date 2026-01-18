# VRAM Data Types

Guide to what data goes where in the VRAM system.

## Supported File Formats

### Primary Formats (Indexed)

| Format | Extension | Use Case |
|--------|-----------|----------|
| Markdown | `.md` | Documents, notes, emails, journals |
| JSON | `.json` | Structured data, metadata, exports |
| Plain Text | `.txt` | Simple notes, logs, transcripts |

### Secondary Formats (Not Indexed)

| Format | Extension | Use Case |
|--------|-----------|----------|
| PDF | `.pdf` | Official documents, contracts |
| Images | `.png`, `.jpg` | Screenshots, diagrams |
| Audio | `.mp3`, `.m4a` | Voice memos, recordings |
| Video | `.mp4`, `.mov` | Screen recordings |

## Data Type Locations

### Communications

#### Emails
**Location**: `10-19_Work/14_Communications/14.01_emails/YYYY/`

**Format**: Markdown with YAML frontmatter
```markdown
# Subject Line

## Metadata

- **From:** sender@example.com
- **To:** recipient@example.com
- **Date:** 2024-01-15 10:30:00

## Content

Email body converted to markdown...
```

**Companion JSON**: `14.01b_emails_json/` contains raw metadata

#### Slack Messages
**Location**: `10-19_Work/14_Communications/14.02_slack/`

**Structure**:
```
14.02_slack/
├── json/           # Raw JSON exports by channel
│   ├── channel-name/
│   │   ├── 2024-01-15.json
│   │   └── 2024-01-16.json
│   └── dm-username/
└── markdown/       # Converted readable format
    └── YYYY/
        └── MM/
```

#### Other Messages
**Location**: `10-19_Work/14_Communications/14.03_other/`

For: LinkedIn messages, Twitter DMs, SMS exports, etc.

### Meetings

#### Meeting Notes
**Location**: `10-19_Work/13_Meetings/`

**Format**: Markdown
```markdown
# Meeting: [Title]

**Date**: 2024-01-15
**Attendees**: Person A, Person B
**Type**: Weekly Standup / Client Call / 1:1

## Agenda

1. Topic one
2. Topic two

## Notes

Discussion points...

## Action Items

- [ ] Task for Person A
- [ ] Task for Person B

## Next Steps

Follow-up plans...
```

#### Transcripts
**Location**: `10-19_Work/13_Meetings/transcripts/` or alongside meeting notes

**Format**: Plain text or Markdown

### Journals & Reflection

#### Daily Journals
**Location**: `30-39_Personal/30_Journals/YYYY/`

**Format**: Markdown dated files
```markdown
# 2024-01-15

## Morning

Thoughts and plans...

## Evening

Reflection on the day...
```

#### Reflection Pieces
**Location**: `30-39_Personal/30_Reflection/`

For: Longer-form reflection, life reviews, deep thinking

### Financial Records

#### Bank Statements
**Location**: `20-29_Finance/20_Banking/`

**Format**: PDF (original) + Markdown summary if needed

#### Tax Documents
**Location**: `20-29_Finance/22_Taxes/YYYY/`

**Structure**:
```
22_Taxes/
├── 2023/
│   ├── W2_Employer_Name.pdf
│   ├── 1099_Contractor.pdf
│   └── Return_Filed.pdf
└── 2024/
```

### Projects

#### Work Projects
**Location**: `10-19_Work/10_[Company]/[Project]/` or `12_Clients/[Client]/`

**Typical Structure**:
```
Project_Name/
├── README.md           # Project overview
├── notes/              # Meeting notes, research
├── docs/               # Specifications, plans
└── archive/            # Completed/old items
```

#### Personal Projects
**Location**: `30-39_Personal/34_Goals/` or `60-69_Growth/`

### Reference Materials

#### Collected Resources
**Location**: `80-89_Resources/80_Reference/`

For: Saved articles, documentation, guides

#### Templates
**Location**: `80-89_Resources/81_Templates/` or `00-09_System/03_Docs/Templates/`

### Archives

Each area has an archive subcategory:
- `10-19_Work/15_Archive/`
- `20-29_Finance/25_Archive/`
- `30-39_Personal/36_Archive/`
- `90-99_Archive/` (system-wide archive)

## Content Conversion

### Email to Markdown

Original email → Markdown with:
- Subject as H1
- Metadata block with From/To/Date
- Body converted to Markdown
- Attachments noted or extracted

### Slack to Markdown

JSON export → Markdown with:
- Messages grouped by day
- User names resolved
- Timestamps formatted
- Thread replies indented

### Voice to Text

Audio recording → Markdown transcript:
- Speaker identification
- Timestamps
- Summary at top

## Metadata Standards

### YAML Frontmatter (Optional)

For files that need structured metadata:
```yaml
---
title: Document Title
date: 2024-01-15
tags: [tag1, tag2]
source: email|slack|manual
---
```

### JSON Metadata Files

For complex metadata, use companion `.json` files:
- `document.md` - content
- `document.json` - metadata

## Size Guidelines

| Content Type | Typical Size | Max Recommended |
|--------------|--------------|-----------------|
| Email | 1-50 KB | 500 KB |
| Meeting notes | 2-20 KB | 100 KB |
| Journal entry | 1-10 KB | 50 KB |
| JSON export | 10-500 KB | 10 MB |
| Transcript | 10-100 KB | 1 MB |

For larger files, consider:
- Splitting into multiple files
- Summarizing with link to original
- Moving to archive
