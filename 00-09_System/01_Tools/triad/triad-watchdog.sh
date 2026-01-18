#!/bin/bash
# Triad Watchdog - Ensures the system never stops
# Run with: nohup ./triad-watchdog.sh > /dev/null 2>&1 &

TRIAD_DIR="/Volumes/VRAM/00-09_System/01_Tools/triad"
LOG_FILE="$TRIAD_DIR/logs/watchdog.log"
PID_FILE="$TRIAD_DIR/state/triad.pid"
CHECK_INTERVAL=30  # seconds

# Ensure log directory exists
mkdir -p "$TRIAD_DIR/logs"
mkdir -p "$TRIAD_DIR/state"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

start_triad() {
    cd "$TRIAD_DIR"
    # Use regular bun run for production stability (no hot reload)
    # Capture output to log file for debugging
    bun run src/index.ts >> "$TRIAD_DIR/logs/triad-console.log" 2>&1 &
    echo $! > "$PID_FILE"
    log "Started Triad with PID $(cat $PID_FILE)"
}

check_triad() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0  # Running
        fi
    fi
    return 1  # Not running
}

log "Watchdog started"

while true; do
    if ! check_triad; then
        log "Triad not running - restarting..."
        start_triad
    fi
    sleep $CHECK_INTERVAL
done
