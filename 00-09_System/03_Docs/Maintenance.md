# VRAM Maintenance

Procedures for keeping the VRAM system healthy and reliable.

## Backup Strategy

### 3-2-1 Rule

- **3** copies of data (original + 2 backups)
- **2** different storage types (SSD + external/cloud)
- **1** offsite backup (cloud or physical offsite)

### Backup Locations

| Copy | Location | Method | Frequency |
|------|----------|--------|-----------|
| Primary | `/Volumes/VRAM` | Active use | - |
| Local Backup | External drive | rsync/Time Machine | Daily |
| Cloud Backup | Backblaze/iCloud | Automated sync | Continuous |

### Backup Commands

**Full Backup (rsync)**:
```bash
rsync -avz --delete /Volumes/VRAM/ /Volumes/BackupDrive/VRAM/
```

**Incremental Backup**:
```bash
rsync -avz --delete --backup --backup-dir=/Volumes/BackupDrive/VRAM-incremental/$(date +%Y-%m-%d) /Volumes/VRAM/ /Volumes/BackupDrive/VRAM/
```

**Verify Backup**:
```bash
diff -rq /Volumes/VRAM/ /Volumes/BackupDrive/VRAM/
```

### Time Machine

If using Time Machine:
1. Include VRAM volume in backup
2. Exclude `00_Index/search.db` (can be rebuilt)
3. Exclude `node_modules/` directories

### Cloud Backup

**Recommended Services**:
- Backblaze B2 (cost-effective)
- iCloud Drive (Apple ecosystem)
- Resilio Sync (P2P, encrypted)

**Exclude from Cloud**:
- `search.db` (large, rebuildable)
- `node_modules/` (rebuildable)
- `.DS_Store` files

## Search Index Maintenance

### Check Index Health

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine
bun cli.ts -s
```

**Healthy indicators**:
- File count matches expected (~181K)
- No errors in stats output
- Search returns results quickly

### Rebuild Index

When to rebuild:
- Index corruption suspected
- Major file reorganization
- After restoring from backup

```bash
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Remove old database
rm /Volumes/VRAM/00-09_System/00_Index/search.db

# Rebuild
bun indexer.ts
```

**Expected time**: ~5-10 minutes for full rebuild

### Index Optimization

SQLite maintenance (optional, monthly):
```bash
sqlite3 /Volumes/VRAM/00-09_System/00_Index/search.db "VACUUM;"
sqlite3 /Volumes/VRAM/00-09_System/00_Index/search.db "ANALYZE;"
```

## Service Management

### Check Service Status

```bash
# Server
curl -s http://localhost:3000/health

# Watcher (check if running)
pgrep -f "bun watcher.ts"

# launchd services
launchctl list | grep vram
```

### Restart Services

**Manual restart**:
```bash
# Kill existing
lsof -ti:3000 | xargs kill -9
pkill -f "bun watcher.ts"

# Start fresh
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine
bun server.ts &
bun watcher.ts &
```

**Via launchd**:
```bash
launchctl stop com.vram.search-server
launchctl start com.vram.search-server

launchctl stop com.vram.file-watcher
launchctl start com.vram.file-watcher
```

### View Logs

```bash
# Server logs
tail -f /tmp/vram-server.log
tail -f /tmp/vram-server.err

# Watcher logs
tail -f /tmp/vram-watcher.log
tail -f /tmp/vram-watcher.err
```

## Storage Management

### Check Disk Usage

```bash
# Overall VRAM size
du -sh /Volumes/VRAM

# By area
du -sh /Volumes/VRAM/*/

# Largest directories
du -h /Volumes/VRAM/*/* | sort -hr | head -20
```

### Find Large Files

```bash
find /Volumes/VRAM -type f -size +10M -exec ls -lh {} \;
```

### Find Duplicate Files

```bash
# Using fdupes (install via Homebrew)
fdupes -r /Volumes/VRAM/10-19_Work/
```

### Cleanup Recommendations

| Item | Action | Frequency |
|------|--------|-----------|
| `.DS_Store` files | Delete | Monthly |
| Empty directories | Remove | Quarterly |
| Large JSON exports | Archive/compress | Quarterly |
| Old logs | Rotate/delete | Monthly |

**Remove .DS_Store files**:
```bash
find /Volumes/VRAM -name ".DS_Store" -delete
```

## Data Integrity

### Verify File Integrity

```bash
# Count files by type
find /Volumes/VRAM -name "*.md" | wc -l
find /Volumes/VRAM -name "*.json" | wc -l
find /Volumes/VRAM -name "*.txt" | wc -l
```

### Check for Broken Files

```bash
# Find empty files
find /Volumes/VRAM -type f -empty

# Find files with unusual permissions
find /Volumes/VRAM -type f ! -perm 644
```

### Validate JSON Files

```bash
# Check all JSON files are valid
find /Volumes/VRAM -name "*.json" -exec sh -c 'jq . "{}" > /dev/null 2>&1 || echo "Invalid: {}"' \;
```

## Archiving

### When to Archive

- Project completed
- Content older than 2+ years
- Low access frequency
- Reference only (not active)

### Archive Process

1. **Identify**: Review items for archiving
2. **Verify**: Ensure content is complete
3. **Move**: Transfer to archive folder
4. **Compress** (optional): Zip rarely accessed items
5. **Document**: Note what was archived and when

### Archive Locations

| Source | Archive Destination |
|--------|---------------------|
| `10-19_Work/*` | `10-19_Work/15_Archive/` |
| `20-29_Finance/*` | `20-29_Finance/25_Archive/` |
| `30-39_Personal/*` | `30-39_Personal/36_Archive/` |
| Cross-area | `90-99_Archive/` |

## Monitoring

### Daily Checks (Automated)

- Server health endpoint responding
- Watcher process running
- No error accumulation in logs

### Weekly Checks

- [ ] Search returns expected results
- [ ] Recent files are indexed
- [ ] Backup completed successfully
- [ ] Disk space adequate (>20% free)

### Monthly Checks

- [ ] Full backup verification
- [ ] Index statistics review
- [ ] Storage usage trends
- [ ] Service log review
- [ ] Cleanup old logs

### Quarterly Review

- [ ] Folder structure assessment
- [ ] Archive old content
- [ ] Update documentation
- [ ] Review and optimize workflows
- [ ] Test backup restoration

## Disaster Recovery

### Recovery Scenarios

#### Scenario 1: Index Corruption

1. Stop services
2. Delete `search.db`
3. Rebuild index: `bun indexer.ts`
4. Restart services

#### Scenario 2: File Loss

1. Stop services
2. Restore from backup
3. Rebuild index
4. Restart services

#### Scenario 3: Drive Failure

1. Replace drive
2. Restore VRAM from backup
3. Reinstall Bun if needed
4. Rebuild index
5. Restart services

### Recovery Time Objectives

| Scenario | Target Recovery Time |
|----------|---------------------|
| Index rebuild | < 15 minutes |
| Partial restore | < 1 hour |
| Full restore | < 4 hours |

## Maintenance Schedule

### Daily
- Automated backups run
- Services health check

### Weekly
- Review recent additions
- Verify backup completion
- Check disk space

### Monthly
- Clean up logs
- Remove temp files
- Index optimization
- Review storage usage

### Quarterly
- Archive old content
- Full backup test
- Documentation update
- Workflow review
