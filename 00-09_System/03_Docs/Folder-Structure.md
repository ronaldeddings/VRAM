# VRAM Folder Structure

VRAM uses the **Johnny.Decimal** organizational system - a method for organizing information using numbers.

## Johnny.Decimal Principles

### The Rules

1. **Areas** (top level): Groups of 10 numbers (00-09, 10-19, etc.)
2. **Categories** (second level): Individual numbers within an area (10, 11, 12, etc.)
3. **Subcategories** (third level): Decimal notation (14.01, 14.02, etc.)
4. **Maximum depth**: Only 3 levels - Area → Category → Subcategory

### Naming Convention

```
XX-XX_AreaName/
├── XX_CategoryName/
│   ├── XX.XX_SubcategoryName/
│   │   └── files...
│   └── files...
└── files...
```

## Area Definitions

### 00-09 System
Infrastructure, tools, and meta-organization.

```
00-09_System/
├── 00_Index/          # Search database and indexes
├── 01_Tools/          # Scripts, utilities, search engine
├── 02_Config/         # Configuration files
└── 03_Docs/           # System documentation (this folder)
```

### 10-19 Work
Professional and business-related content.

```
10-19_Work/
├── 10_Hacker_Valley_Media/   # Primary business
├── 11_Mozilla/               # Mozilla work
├── 12_Clients/               # Client projects
├── 13_Meetings/              # Meeting notes and recordings
├── 14_Communications/        # Emails, Slack, messages
│   ├── 14.01_emails/         # Email archives (Markdown)
│   ├── 14.01b_emails_json/   # Email metadata (JSON)
│   ├── 14.02_slack/          # Slack exports
│   └── 14.03_other/          # Other communications
└── 15_Archive/               # Archived work items
```

### 20-29 Finance
Financial records and planning.

```
20-29_Finance/
├── 20_Banking/        # Bank statements, accounts
├── 21_Investments/    # Investment records
├── 22_Taxes/          # Tax documents
├── 23_Insurance/      # Insurance policies
├── 24_Real_Estate/    # Property documents
└── 25_Archive/        # Archived financial records
```

### 30-39 Personal
Personal development and private matters.

```
30-39_Personal/
├── 30_Journals/       # Daily journals and reflection
├── 30_Reflection/     # Deeper reflection pieces
├── 31_Capture/        # Quick captures and notes
├── 31_Recordings/     # Voice memos, recordings
├── 32_Health/         # Health records and tracking
├── 33_Learning/       # Learning notes and courses
├── 34_Goals/          # Goals and planning
├── 35_Messages/       # Personal messages
└── 36_Archive/        # Archived personal items
```

### 40-49 Family
Family-related documents and memories.

```
40-49_Family/
├── 40_Documents/      # Family documents
├── 41_Memories/       # Photos, videos, memories
├── 42_Planning/       # Family planning
└── ...
```

### 50-59 Social
Social connections and community involvement.

```
50-59_Social/
├── 50_Contacts/       # Contact information
├── 51_Events/         # Social events
└── ...
```

### 60-69 Growth
Personal and professional development.

```
60-69_Growth/
├── 60_Skills/         # Skill development
├── 61_Reading/        # Books and reading notes
├── 62_Courses/        # Online courses
└── ...
```

### 70-79 Lifestyle
Hobbies, travel, and daily life.

```
70-79_Lifestyle/
├── 70_Home/           # Home management
├── 71_Travel/         # Travel planning and logs
├── 72_Hobbies/        # Hobby projects
└── ...
```

### 80-89 Resources
Reference materials and collected resources.

```
80-89_Resources/
├── 80_Reference/      # Reference documents
├── 81_Templates/      # Reusable templates
├── 82_Assets/         # Digital assets
└── ...
```

### 90-99 Archive
Long-term storage for historical content.

```
90-99_Archive/
├── 90_Historical/     # Historical documents
├── 91_Completed/      # Completed projects
└── ...
```

## Navigation Tips

### Finding Things

1. **Know the area**: What domain does this belong to?
2. **Find the category**: What type of content is it?
3. **Check subcategories**: Is there a more specific location?

### Example Lookups

| Looking for... | Location |
|----------------|----------|
| Work email from 2024 | `10-19_Work/14_Communications/14.01_emails/2024/` |
| Tax documents | `20-29_Finance/22_Taxes/` |
| Journal entry | `30-39_Personal/30_Journals/` |
| Search engine code | `00-09_System/01_Tools/search_engine/` |

## Creating New Locations

### When to Create a New Category

- Content doesn't fit existing categories
- You have 5+ files of a distinct type
- The category is clearly defined and bounded

### When to Create a Subcategory

- Category has grown large (50+ files)
- Clear logical subdivision exists
- Improves findability

### Naming Rules

1. Use underscores for spaces: `14_Communications` not `14 Communications`
2. Use Title_Case for multi-word names
3. Keep names concise but descriptive
4. Prefix with appropriate number

## Special Folders

### Excluded from Search Index

These folders are not indexed by VRAM Search:

- `00_Index/` - Contains the search database itself
- `node_modules/` - Development dependencies
- `Backup/` - Backup files (separate backup system)
- `tools/` - External tools (legacy location)

### Archive Folders

Each area has an archive category (e.g., `15_Archive`, `25_Archive`) for:
- Completed projects
- Outdated documents
- Historical reference material
