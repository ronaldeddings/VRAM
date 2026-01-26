#!/bin/bash

# Example scripts for sitemap-to-md
# Make this file executable: chmod +x example.sh

echo "📚 sitemap-to-md Examples"
echo ""

# Example 1: Auto-discover from domain
echo "1️⃣  Auto-discover from domain:"
echo "   bun run src/index.ts bun.com -o ./bun-docs"
echo ""

# Example 2: Claude Code docs (English only)
echo "2️⃣  Claude Code docs (English only):"
echo "   bun run src/index.ts https://code.claude.com/docs/sitemap.xml -f '/en/' -o ./claude-code-docs"
echo ""

# Example 3: Claude Platform docs (English only)
echo "3️⃣  Claude Platform docs (English only):"
echo "   bun run src/index.ts https://platform.claude.com/docs/sitemap.xml -f '/en/' -o ./platform-docs"
echo ""

# Example 4: Dry run to preview
echo "4️⃣  Dry run to preview URLs:"
echo "   bun run src/index.ts platform.claude.com --dry-run"
echo ""

# Example 5: All docs (no filter)
echo "5️⃣  All docs (no language filter):"
echo "   bun run src/index.ts docs.example.com --no-filter -o ./all-docs"
echo ""

# Uncomment to run one of these:
# bun run src/index.ts bun.com -o ./bun-docs
# bun run src/index.ts https://code.claude.com/docs/sitemap.xml -f '/en/' -o ./claude-code-docs
