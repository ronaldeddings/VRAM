# Triad Documentation

## What is Triad?

Triad is a self-managing AI agent orchestration system that continuously runs three AI agents (Claude, Codex, and Gemini) to build deep contextual understanding of your personal and professional life data stored in VRAM.

## Key Features

### 1. Continuous Operation
- Runs 24/7 via watchdog script
- Automatic restart on failure
- Self-healing capabilities

### 2. Three-Agent Architecture
- **Claude**: Primary analyst - explores files, identifies patterns
- **Codex**: Validator & healer - verifies insights, fixes code
- **Gemini**: Pattern recognizer - finds cross-domain connections

### 3. Deep Focus Strategy
Each life area gets intensive exploration before moving to the next:
1. Overview pass (depth 1)
2. Key file deep-dive (depth 2)
3. Cross-reference patterns (depth 3)
4. Edge case analysis (depth 4)
5. Synthesis and actions (depth 5)

### 4. Confidence-Based Insights
Findings grow in confidence as they're validated:
- Low confidence (<30%): Initial hypothesis
- Medium confidence (30-60%): Some evidence
- High confidence (60-85%): Strong evidence
- Actionable (>90%): Ready for action

### 5. Report Generation
- **Daily Digests**: End-of-day summary of key insights
- **Weekly Reports**: Comprehensive analysis with trends
- **Insight Cards**: Individual findings with full evidence

## Architecture Overview

```
Watchdog (triad-watchdog.sh)
    └── Orchestrator (Bun.serve)
            ├── Claude Runner
            ├── Codex Runner
            ├── Gemini Runner
            ├── Self-Healer
            ├── Overseer
            └── Report Generator
```

## Quick Start

### Start Triad
```bash
cd /Volumes/VRAM/00-09_System/01_Tools/triad
./start.sh
```

### Check Status
```bash
curl http://localhost:3002/status
```

### View Insights
```bash
curl http://localhost:3002/insights
```

### Stop Triad
```bash
./stop.sh
```

## File Structure

| Directory | Purpose |
|-----------|---------|
| `src/` | TypeScript source code |
| `outputs/` | Raw agent output files |
| `reports/` | Generated reports for consumption |
| `state/` | Persistent state (iteration counts, insights) |
| `logs/` | Application and watchdog logs |
| `prompts/` | System prompts for agents |
| `docs/` | Documentation |

## Safety Constraints

1. **Read-Only VRAM**: Triad never modifies files in VRAM
2. **Self-Modification Limits**: Only modifies files within triad/ directory
3. **Rate Limiting**: 5-second delays between agent calls
4. **Watchdog**: External script prevents permanent failures

## Monitoring

### Health Check
```bash
curl http://localhost:3002/health
# Returns: {"status":"running","iteration":42,"uptime":"3h 45m"}
```

### Logs
- `logs/triad.log` - Main application log
- `logs/watchdog.log` - Watchdog restart events
- `logs/repairs.log` - Self-healer activity

## Configuration

Edit `src/utils/config.ts` to adjust:
- Timing (agent delays, iteration frequency)
- Confidence thresholds
- Focus areas
- Report schedules

## Troubleshooting

### Triad Not Starting
1. Check if port 3002 is in use: `lsof -i :3002`
2. Review logs: `tail -f logs/triad.log`
3. Verify VRAM is mounted: `ls /Volumes/VRAM`

### Agents Failing
1. Check individual agent CLIs work:
   - `claude --version`
   - `codex --version`
   - `gemini --version`
2. Review output files in `outputs/` for errors

### Self-Healer Not Fixing Issues
1. Check `outputs/healer/` for repair attempts
2. Review error patterns in `state/errors.json`
3. Manual intervention may be needed for complex issues

## Development

### Run with Hot Reload
```bash
bun --hot src/index.ts
```

### Type Checking
```bash
bun run typecheck
```

### Project Dependencies
```bash
bun install
```

## See Also

- [Implementation Plan](plans/implementation-plan.md) - Detailed design document
- [CLAUDE.md](../CLAUDE.md) - AI assistant instructions
