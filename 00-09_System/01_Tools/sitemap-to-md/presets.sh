#!/bin/bash

# Preset configurations for common documentation sites
# Outputs to VRAM Johnny.Decimal structure: 80-89_Resources/80_Reference/docs/
#
# NOTE: This tool works with sites that serve markdown at URL.md endpoints.
# Works: Claude Code, Bun, Vite (partial)
# Doesn't work: TypeScript, Electron, React (no .md endpoint)
#
# Usage: ./presets.sh <preset-name>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VRAM_DOCS="/Volumes/VRAM/80-89_Resources/80_Reference/docs"

case "$1" in
  "claude-code")
    echo "📚 Downloading Claude Code documentation (English)..."
    mkdir -p "$VRAM_DOCS/claude-code"
    bun run "$SCRIPT_DIR/src/index.ts" https://code.claude.com/docs/sitemap.xml -f '/en/' -o "$VRAM_DOCS/claude-code"
    ;;

  "bun")
    echo "📚 Downloading Bun documentation..."
    mkdir -p "$VRAM_DOCS/bun"
    bun run "$SCRIPT_DIR/src/index.ts" https://bun.sh/sitemap.xml -f '/docs/' -o "$VRAM_DOCS/bun"
    ;;

  "vite")
    echo "📚 Downloading Vite documentation..."
    mkdir -p "$VRAM_DOCS/vite"
    bun run "$SCRIPT_DIR/src/index.ts" vite.dev -o "$VRAM_DOCS/vite"
    ;;

  "all")
    echo "📚 Downloading all preset documentation..."
    echo ""
    $0 claude-code
    echo ""
    $0 bun
    echo ""
    $0 vite
    echo ""
    echo "✅ All documentation downloaded to: $VRAM_DOCS"
    ;;

  "list")
    echo "📋 Available presets:"
    echo ""
    echo "  claude-code   Claude Code CLI documentation (English) - 50 pages"
    echo "  bun           Bun runtime documentation - 301 pages"
    echo "  vite          Vite bundler documentation - 37 pages"
    echo "  all           Download all presets"
    echo ""
    echo "Output directory: $VRAM_DOCS"
    echo ""
    echo "Usage: ./presets.sh <preset-name>"
    ;;

  "status")
    echo "📊 Current docs status:"
    echo ""
    for dir in "$VRAM_DOCS"/*/; do
      if [ -d "$dir" ]; then
        name=$(basename "$dir")
        count=$(find "$dir" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
        size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        echo "  $name: $count files ($size)"
      fi
    done
    echo ""
    total=$(find "$VRAM_DOCS" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    echo "  Total: $total markdown files"
    ;;

  *)
    echo "Usage: ./presets.sh <preset-name>"
    echo ""
    echo "Run './presets.sh list' to see available presets"
    echo "Run './presets.sh status' to see current docs"
    echo ""
    echo "Or use the tool directly:"
    echo "  bun run src/index.ts <domain-or-sitemap> -o <output-dir>"
    ;;
esac
