#!/bin/bash
# Stop Triad and Watchdog gracefully
TRIAD_DIR="/Volumes/VRAM/00-09_System/01_Tools/triad"

echo "Stopping Triad..."

# Stop watchdog first (so it doesn't restart Triad)
if [ -f "$TRIAD_DIR/state/watchdog.pid" ]; then
    PID=$(cat "$TRIAD_DIR/state/watchdog.pid")
    if ps -p "$PID" > /dev/null 2>&1; then
        kill "$PID" 2>/dev/null
        echo "Stopped watchdog (PID $PID)"
    fi
    rm -f "$TRIAD_DIR/state/watchdog.pid"
fi

# Stop Triad
if [ -f "$TRIAD_DIR/state/triad.pid" ]; then
    PID=$(cat "$TRIAD_DIR/state/triad.pid")
    if ps -p "$PID" > /dev/null 2>&1; then
        kill "$PID" 2>/dev/null
        echo "Stopped Triad (PID $PID)"
    fi
    rm -f "$TRIAD_DIR/state/triad.pid"
fi

echo "Triad stopped"
