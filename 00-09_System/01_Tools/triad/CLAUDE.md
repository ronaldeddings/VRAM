# Triad - AI Agent Orchestration System

## Project Overview

Triad is a self-managing, self-healing AI agent orchestration system that continuously runs Claude, Codex, and Gemini to gain deep contextual understanding of Ron Eddings, Hacker Valley Media, and the VRAM filesystem.

## Architecture

```
triad/
├── src/
│   ├── index.ts           # Main entry point
│   ├── server.ts          # Bun.serve HTTP server
│   ├── orchestrator.ts    # Agent sequencing loop
│   ├── runners/           # AI agent wrappers
│   ├── context/           # VRAM access & prompt building
│   ├── overseer/          # Self-healing & oversight
│   ├── reports/           # Report generation
│   └── utils/             # Config, logging, health
├── outputs/               # Agent output files
├── reports/               # Generated reports for Ron
├── state/                 # Persistent state files
└── logs/                  # Application logs
```

## Key Constraints

### READ-ONLY VRAM ACCESS
- **NEVER write to /Volumes/VRAM** (except within triad/ directory)
- Use `vram-reader.ts` for all VRAM access
- Query `search.db` for full-text search

### SELF-MODIFICATION BOUNDARIES
The system may ONLY modify files within:
- `src/` - Application source code
- `prompts/` - Prompt templates
- `state/` - State files
- `outputs/` - Agent outputs
- `reports/` - Generated reports
- `logs/` - Log files

### EXECUTION MODEL
- Agents run **sequentially**, not concurrently
- 5-second delay between agents (rate limiting)
- 1-minute delay between iterations
- Overseer runs every 5th iteration

## Commands

```bash
# Start (with watchdog)
./start.sh

# Stop gracefully
./stop.sh

# Development mode
bun --hot src/index.ts

# Type check
bun run typecheck
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /health | Health check (status, iteration) |
| GET /status | Full system status |
| GET /insights | Accumulated insights |
| GET /reports | Available reports |
| POST /pause | Pause orchestration loop |
| POST /resume | Resume orchestration loop |

## Configuration

See `src/utils/config.ts` for all settings:
- Port: 3002
- Agent delay: 5 seconds
- Iteration delay: 1 minute
- Overseer frequency: every 5 iterations
- Confidence thresholds: low (0.3), medium (0.6), high (0.85), actionable (0.9)

## Focus Areas

The system rotates through these Johnny.Decimal areas:
1. `hacker_valley_media` (10-19_Work)
2. `career_skills` (60-69_Growth)
3. `financial` (20-29_Finance)
4. `personal_growth` (30-39_Personal)
5. `relationships` (40-49_Family, 50-59_Social)
6. `meta_analysis` (cross-area synthesis)

## Self-Healing

When consecutive failures occur (threshold: 3):
1. Error messages collected
2. Codex diagnoses and fixes code
3. System auto-restarts via hot reload

## Report Schedule

- **Daily Digest**: 11 PM - summarizes day's insights
- **Weekly Report**: Sunday 6 PM - comprehensive analysis
- **Insight Cards**: Updated on confidence changes

## Development Guidelines

1. Use Bun APIs exclusively (Bun.serve, Bun.file, bun:sqlite)
2. All timestamps in ISO 8601 format
3. Log all significant events via `logger.ts`
4. Update state files after each operation
5. Never suppress errors silently

## Testing

```bash
# Verify server responds
curl http://localhost:3002/health

# Check status
curl http://localhost:3002/status

# View insights
curl http://localhost:3002/insights
```

## Watchdog

The `triad-watchdog.sh` script ensures 24/7 uptime:
- Checks process every 30 seconds
- Auto-restarts if process dies
- Logs all restart events to `logs/watchdog.log`
