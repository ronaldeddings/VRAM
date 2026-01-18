# VRAM Search CLI Guide

Command-line interface for searching the VRAM data store.

## Usage

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine
bun cli.ts [query] [options]
```

## Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--limit` | `-l` | Maximum results | 10 |
| `--area` | `-a` | Filter by area | All |
| `--type` | `-t` | Filter by extension | All |
| `--json` | `-j` | Output as JSON | false |
| `--stats` | `-s` | Show index statistics | false |
| `--help` | `-h` | Show help | - |

## Examples

### Basic Search

```bash
bun cli.ts "security"
```

Output:
```
🔍 Search: "security"
Found 10 results in 24.56ms

📄 2025-04-04_security.md
   Work / Communications
   /Volumes/VRAM/10-19_Work/14_Communications/14.01_emails/2025/2025-04-04_security.md
   ...5 Mindset Shifts →Security← Teams Must Adopt...

📄 2023-01-05_cloud_security.md
   Work / Communications
   ...
```

### Search with Filters

Filter by area:
```bash
bun cli.ts "meeting" -a Work
```

Filter by file type:
```bash
bun cli.ts "meeting" -t md
```

Combine filters:
```bash
bun cli.ts "meeting" -a Work -t md -l 5
```

### JSON Output

For scripting and automation:
```bash
bun cli.ts "security" -j -l 3
```

Output:
```json
{
  "query": "security",
  "results": [...],
  "count": 3,
  "time_ms": "24.56"
}
```

### Index Statistics

View index information without searching:
```bash
bun cli.ts -s
```

Output:
```
📊 Index Statistics

Total files: 181,399
Total size: 4086.83 MB
Areas: 3
Categories: 5

Files by area:
  Work: 177,167
  System: 4,190
  Personal: 42

Files by type:
  .json: 98,146
  .md: 80,641
  .txt: 2,612
```

## Search Syntax

The CLI uses SQLite FTS5 full-text search syntax:

| Syntax | Example | Description |
|--------|---------|-------------|
| Simple | `security` | Match word |
| Phrase | `"cloud security"` | Match exact phrase |
| AND | `security compliance` | Match both words |
| OR | `security OR privacy` | Match either word |
| NOT | `security NOT cloud` | Exclude word |
| Prefix | `secur*` | Match prefix |

## Areas

Valid area values for the `-a` flag:

| Area | Folder Pattern | Description |
|------|----------------|-------------|
| Work | `10-19_*` | Work-related files |
| Finance | `20-29_*` | Financial documents |
| Personal | `30-39_*` | Personal files |
| Archive | `40-49_*` | Archived content |
| System | `00-09_*` | System files |

## File Types

Common values for the `-t` flag:

| Type | Description |
|------|-------------|
| `md` | Markdown files |
| `txt` | Plain text files |
| `json` | JSON data files |

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | No results found |
| 2 | Invalid arguments |

## Tips

1. **Pipe to other tools**:
   ```bash
   bun cli.ts "meeting" -j | jq '.results[].path'
   ```

2. **Open first result**:
   ```bash
   open "$(bun cli.ts "meeting" -j -l 1 | jq -r '.results[0].path')"
   ```

3. **Count results**:
   ```bash
   bun cli.ts "security" -j | jq '.count'
   ```

4. **Search and grep**:
   ```bash
   bun cli.ts "project" -l 100 | grep "2025"
   ```
