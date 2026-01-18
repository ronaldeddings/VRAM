#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title VRAM Search
# @raycast.mode fullOutput
# @raycast.packageName VRAM
# @raycast.icon 🔍

# Optional parameters:
# @raycast.argument1 { "type": "text", "placeholder": "Search query" }

# Documentation:
# @raycast.description Search your VRAM data store
# @raycast.author ronaldeddings

API="http://localhost:3000"
QUERY="$1"

if [ -z "$QUERY" ]; then
  echo "Please provide a search query"
  exit 1
fi

# Check if server is running
if ! curl -s "$API/health" > /dev/null 2>&1; then
  echo "❌ VRAM Search server is not running"
  echo "Start it with: cd /Volumes/VRAM/00-09_System/01_Tools/search_engine && bun server.ts"
  exit 1
fi

# URL encode the query
ENCODED_QUERY=$(echo "$QUERY" | sed 's/ /%20/g')

# Search and format results
RESULTS=$(curl -s "$API/search?q=$ENCODED_QUERY&limit=10")

if echo "$RESULTS" | grep -q '"error"'; then
  echo "❌ Search error: $(echo "$RESULTS" | grep -o '"error":"[^"]*"')"
  exit 1
fi

COUNT=$(echo "$RESULTS" | grep -o '"count":[0-9]*' | cut -d: -f2)
TIME_MS=$(echo "$RESULTS" | grep -o '"time_ms":"[^"]*"' | cut -d'"' -f4)

echo "🔍 Found $COUNT results in ${TIME_MS}ms for: \"$QUERY\""
echo ""

# Parse and display results using jq if available, otherwise basic parsing
if command -v jq &> /dev/null; then
  echo "$RESULTS" | jq -r '.results[] | "📄 \(.filename)\n   Area: \(.area) | Category: \(.category)\n   \(.path)\n"'
else
  # Basic parsing without jq
  echo "$RESULTS" | grep -o '"filename":"[^"]*"' | cut -d'"' -f4 | while read filename; do
    echo "📄 $filename"
  done
fi
