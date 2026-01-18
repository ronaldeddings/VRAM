# VRAM Naming Conventions

Consistent file naming ensures predictable sorting, easy searching, and clear identification.

## General Principles

1. **Date-first**: Start with date for chronological sorting
2. **Descriptive**: Include meaningful title/description
3. **No spaces**: Use underscores or hyphens
4. **Lowercase extensions**: `.md` not `.MD`
5. **ASCII only**: Avoid special characters

## File Name Patterns

### Standard Pattern

```
YYYY-MM-DD_Title_or_Description.ext
```

**Examples**:
- `2024-01-15_Project_Kickoff_Notes.md`
- `2024-03-22_Quarterly_Review.md`
- `2025-01-10_Budget_Planning.md`

### Timestamped Pattern (Automated Imports)

```
YYYY-MM-DD_HHMMSS_NNNNNN_Title.ext
```

**Components**:
- `YYYY-MM-DD` - Date (year-month-day)
- `HHMMSS` - Time (hours-minutes-seconds, 24h format)
- `NNNNNN` - Sequence number or unique ID
- `Title` - Descriptive title (truncated if needed)

**Examples**:
- `2024-01-01_032239_048125_Security_alert.md`
- `2024-06-15_143022_012345_Meeting_with_client.md`

### Simple Pattern (Manual Files)

```
Title_or_Description.ext
```

**Use for**:
- Configuration files
- Templates
- Reference documents that don't need dates

**Examples**:
- `README.md`
- `config.json`
- `meeting-template.md`

## By Content Type

### Emails

```
YYYY-MM-DD_HHMMSS_NNNNNN_Subject_Line.md
```

- Date/time from email received timestamp
- Subject line truncated to reasonable length
- Located in `14.01_emails/YYYY/`

### Meeting Notes

```
YYYY-MM-DD_Meeting_Type_or_Attendees.md
```

**Examples**:
- `2024-03-15_Weekly_Team_Standup.md`
- `2024-03-20_Client_Review_Acme_Corp.md`
- `2024-04-01_1on1_with_John.md`

### Journal Entries

```
YYYY-MM-DD.md
```

or

```
YYYY-MM-DD_Topic.md
```

**Examples**:
- `2024-01-15.md` (daily journal)
- `2024-01-15_Reflection_on_goals.md` (topical)

### Slack Exports

```
YYYY-MM-DD.json
```

- One file per day per channel
- Located in `14.02_slack/json/channel-name/`

### Project Documents

```
Project_Name_Document_Type.md
```

or with date:

```
YYYY-MM-DD_Project_Name_Document_Type.md
```

**Examples**:
- `VRAM_Technical_Spec.md`
- `2024-Q1_Marketing_Plan.md`

## Folder Naming

### Areas (Top Level)

```
XX-XX_Area_Name/
```

**Examples**:
- `00-09_System/`
- `10-19_Work/`
- `30-39_Personal/`

### Categories

```
XX_Category_Name/
```

**Examples**:
- `14_Communications/`
- `22_Taxes/`
- `30_Journals/`

### Subcategories

```
XX.XX_Subcategory_Name/
```

**Examples**:
- `14.01_emails/`
- `14.02_slack/`

### Year Folders

```
YYYY/
```

Used within categories for large collections:
- `14.01_emails/2024/`
- `14.01_emails/2025/`

## Character Rules

### Allowed Characters

- Letters: `a-z`, `A-Z`
- Numbers: `0-9`
- Separators: `_` (underscore), `-` (hyphen), `.` (dot)

### Avoid

- Spaces (use underscores)
- Special characters: `! @ # $ % ^ & * ( ) + = [ ] { } | \ : ; " ' < > , ?`
- Non-ASCII characters
- Leading/trailing spaces or dots

### Case Conventions

| Element | Convention | Example |
|---------|------------|---------|
| File names | Mixed/Title_Case | `Project_Plan.md` |
| Extensions | lowercase | `.md`, `.json` |
| Folders | Title_Case | `14_Communications` |
| Dates | ISO format | `2024-01-15` |

## Title Truncation

When titles are too long (e.g., email subjects):

1. **Max length**: ~50-80 characters for the title portion
2. **Truncate at word boundary**: Don't cut words in half
3. **Remove trailing articles**: "the", "a", "an"
4. **Keep meaningful words**: Prioritize nouns and verbs

**Example**:
```
Original: "Re: Following up on our discussion about the Q4 marketing strategy and budget allocation"
Truncated: "Re_Following_up_on_Q4_marketing_strategy"
```

## Search Optimization

Names are indexed and searchable. Include:

- **Key terms**: Words you'd search for
- **Context**: Project name, person, topic
- **Type indicators**: "meeting", "notes", "draft"

**Good**: `2024-03-15_Acme_Corp_Contract_Review.md`
**Poor**: `document1.md`
