#!/bin/bash
# VRAM Search Engine - Unified Startup Script
# Starts both embedding server (llama-server) and API server

export PATH="/Users/ronaldeddings/.bun/bin:/opt/homebrew/bin:$PATH"
cd /Volumes/VRAM/00-09_System/01_Tools/search_engine

# Kill any existing processes on our ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8081 | xargs kill -9 2>/dev/null
sleep 1

# Start unified server
exec bun start
