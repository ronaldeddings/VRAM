#!/bin/bash

echo "=== Claude Code Conversation Workbench API Test ==="
echo ""

# Get a real session ID
SESSION_ID=$(curl -s "http://localhost:3000/api/sessions?limit=1" | jq -r '.sessions[0].id')
echo "Testing with session ID: $SESSION_ID"
echo ""

echo "1. GET /api/projects"
curl -s http://localhost:3000/api/projects | jq '{projectCount: (.projects | length), firstProject: .projects[0].name}'
echo ""

echo "2. GET /api/sessions"
curl -s "http://localhost:3000/api/sessions?limit=5" | jq '{total, sessionCount: (.sessions | length)}'
echo ""

echo "3. GET /api/sessions/:id"
curl -s "http://localhost:3000/api/sessions/$SESSION_ID" | jq '{id, entryCount, hasMore}'
echo ""

echo "4. GET /api/sessions/:id/entries"
curl -s "http://localhost:3000/api/sessions/$SESSION_ID/entries?limit=3" | jq '{total, entriesReturned: (.entries | length), hasMore}'
echo ""

echo "5. GET /api/sessions/:id/analyze"
curl -s -w "\nHTTP_CODE:%{http_code}" "http://localhost:3000/api/sessions/$SESSION_ID/analyze" | head -c 300
echo ""
echo ""

echo "6. GET /api/sessions/:id/validate"
curl -s -w "\nHTTP_CODE:%{http_code}" "http://localhost:3000/api/sessions/$SESSION_ID/validate" | head -c 300
echo ""
echo ""

echo "7. GET /api/sessions/:id/export"
curl -s "http://localhost:3000/api/sessions/$SESSION_ID/export?format=json" | jq 'length'
echo ""

echo "8. POST /api/sessions/:id/clone"
curl -s -X POST -H "Content-Type: application/json" -w "\nHTTP_CODE:%{http_code}" "http://localhost:3000/api/sessions/$SESSION_ID/clone" | head -c 300
echo ""
echo ""

echo "9. POST /api/sessions/:id/optimize"
curl -s -X POST -H "Content-Type: application/json" -d '{"targetTokens":8000}' -w "\nHTTP_CODE:%{http_code}" "http://localhost:3000/api/sessions/$SESSION_ID/optimize" | head -c 300
echo ""
echo ""

echo "10. POST /api/sessions (create new)"
curl -s -X POST -H "Content-Type: application/json" -d '{"project":"test-api-project","systemPrompt":"Test system"}' "http://localhost:3000/api/sessions" | jq '{success, id, entryCount}'
echo ""

echo "=== Test Complete ==="
