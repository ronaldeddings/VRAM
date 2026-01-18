#!/bin/bash
# Start Triad and its Watchdog
TRIAD_DIR="/Volumes/VRAM/00-09_System/01_Tools/triad"
cd "$TRIAD_DIR"

# Ensure directories exist
mkdir -p state logs

# Kill any existing instances
./stop.sh 2>/dev/null

echo "Starting Triad AI Agent Orchestration System..."

# Start watchdog (which will start Triad)
nohup ./triad-watchdog.sh > /dev/null 2>&1 &
echo $! > state/watchdog.pid

echo "Watchdog started with PID $(cat state/watchdog.pid)"
echo "Triad will be running shortly..."
echo ""
echo "Check status: curl http://localhost:3002/health"
echo "Stop system: ./stop.sh"
