# VRAM Workflows

How data flows into and through the VRAM system.

## Data Ingestion Workflows

### Email Import

**Source**: Gmail, Outlook, or other email providers

**Process**:
1. Export emails (MBOX, EML, or API)
2. Convert to Markdown format
3. Extract metadata to JSON
4. Organize by year: `14.01_emails/YYYY/`
5. Index automatically via file watcher

**Automation Options**:
- Google Takeout (manual, periodic)
- IMAP sync script (automated)
- Zapier/Make integration

**Output Structure**:
```
14_Communications/
├── 14.01_emails/
│   └── 2024/
│       └── 2024-01-15_103000_012345_Subject_Line.md
└── 14.01b_emails_json/
    └── 2024/
        └── 2024-01-15_103000_012345_Subject_Line.json
```

### Slack Export

**Source**: Slack workspace export

**Process**:
1. Request Slack export (admin)
2. Extract JSON files
3. Organize by channel and date
4. Optionally convert to Markdown
5. Index JSON files for search

**Output Structure**:
```
14.02_slack/
├── json/
│   ├── general/
│   │   └── 2024-01-15.json
│   └── project-channel/
└── markdown/
    └── 2024/
```

### Meeting Notes

**Source**: Manual capture during/after meetings

**Process**:
1. Create from template
2. Fill during meeting
3. Add action items
4. Save to `13_Meetings/`
5. Reference in project folders if needed

**Quick Capture Flow**:
1. Open template (Raycast, Alfred, or shortcut)
2. Title with date and meeting name
3. Note attendees and agenda
4. Capture key points
5. Save and close

### Voice Recordings

**Source**: Voice Memos, Otter.ai, meeting recordings

**Process**:
1. Record audio
2. Transcribe (manual or automated)
3. Save transcript as Markdown
4. Optionally keep audio file
5. Index transcript

**Tools**:
- Whisper (local transcription)
- Otter.ai (cloud transcription)
- MacWhisper (Mac app)

### Journal Entries

**Source**: Daily practice

**Process**:
1. Create dated file: `YYYY-MM-DD.md`
2. Write freely
3. Save to `30_Journals/YYYY/`
4. Auto-indexed

**Triggers**:
- Morning routine
- Evening reflection
- Weekly review

### Web Clippings

**Source**: Browser, read-later apps

**Process**:
1. Clip article/page
2. Convert to Markdown
3. Add source URL and date
4. Save to `80_Reference/` or relevant project
5. Index for search

**Tools**:
- MarkDownload (browser extension)
- Jina Reader API
- Custom scripts

## Search Workflow

### Finding Information

1. **Start broad**: Search for key term
2. **Filter by area**: Narrow to Work, Personal, etc.
3. **Filter by type**: Narrow to md, json, txt
4. **Review snippets**: Check context in results
5. **Open file**: Navigate to full document

### Search Interfaces

| Method | Best For |
|--------|----------|
| Web UI | Visual browsing, filters |
| CLI | Scripting, quick searches |
| Raycast | Fastest access, keyboard-driven |
| API | Automation, integration |

### Search Tips

- Use quotes for phrases: `"project kickoff"`
- Use OR for alternatives: `meeting OR call`
- Use area filter to reduce noise
- Search for names, dates, or unique terms

## File Organization Workflow

### New File

1. Determine content type
2. Identify correct area/category
3. Create with proper naming convention
4. Add content
5. Save (auto-indexed)

### Existing File Updates

1. Find file via search or navigation
2. Edit in place
3. Save (auto-reindexed)

### Archiving

1. Identify outdated/completed items
2. Move to relevant archive folder:
   - Project archive: `15_Archive/`
   - Financial archive: `25_Archive/`
   - System archive: `90-99_Archive/`
3. Verify search still finds archived items

### Reorganization

1. Identify misplaced files
2. Move to correct location
3. Update any references
4. Watcher handles reindexing

## Automation Patterns

### Periodic Imports

```bash
# Example: Weekly email import
0 0 * * 0 /path/to/email-import-script.sh

# Example: Daily Slack sync
0 1 * * * /path/to/slack-sync.sh
```

### Real-time Indexing

The file watcher (`watcher.ts`) handles:
- New file detection
- File modification updates
- File deletion cleanup

### Backup Automation

```bash
# Example: Daily backup to external drive
0 3 * * * rsync -av /Volumes/VRAM/ /Volumes/Backup/VRAM/
```

## Integration Points

### Input Integrations

| Source | Method | Frequency |
|--------|--------|-----------|
| Email | Export/API | Weekly |
| Slack | Export | Monthly |
| Calendar | API/Export | Weekly |
| Voice Memos | Manual | As needed |
| Web Articles | Clipper | As needed |

### Output Integrations

| Destination | Method | Use Case |
|-------------|--------|----------|
| Obsidian | Symlink/Copy | Second brain |
| Bear | Export | Mobile access |
| Notion | API | Collaboration |
| Git | Commit | Version control |

## Workflow Checklists

### Daily

- [ ] Morning journal entry
- [ ] Process inbox/captures
- [ ] Evening reflection

### Weekly

- [ ] Review and file loose items
- [ ] Import new emails if manual
- [ ] Weekly review journal

### Monthly

- [ ] Archive completed projects
- [ ] Review folder organization
- [ ] Check backup integrity
- [ ] Review search index stats

### Quarterly

- [ ] Major reorganization if needed
- [ ] Update workflows documentation
- [ ] Clean up archives
- [ ] Review data retention
