# sitemap-to-md

A lightweight TypeScript tool to download sitemaps and convert pages to markdown with automatic discovery and directory structure creation.

## Features

- 🚀 **Auto-Discovery** - Just provide a domain, it finds the sitemap
- 🤖 **robots.txt parsing** - Extracts Sitemap directives automatically
- 📋 **Sitemap Index Support** - Handles sitemap index files recursively
- 🌍 **Language Filtering** - Filter by path (e.g., `/en/` for English only)
- 📁 **Automatic Directory Structure** - Mirrors URL paths
- ⏱️ **Rate Limiting** - Configurable delay between requests
- 🎯 **Works with Bun and Node.js**

## Installation

```bash
bun install
```

## Quick Start

```bash
# Just point at a domain - it figures out the rest!
bun run src/index.ts bun.com -o ./bun-docs

# Or provide a direct sitemap URL
bun run src/index.ts https://code.claude.com/docs/sitemap.xml -o ./claude-docs
```

## Usage

### Auto-Discovery Mode (Recommended)

Just provide a domain name:

```bash
# Discovers sitemap automatically
bun run src/index.ts bun.com -o ./bun-docs
```

The tool will:
1. Check `robots.txt` for `Sitemap:` directives
2. Probe common paths (`/sitemap.xml`, `/sitemap_index.xml`, etc.)
3. Handle sitemap index files (fetch all referenced sitemaps)

### Direct Sitemap URL

```bash
bun run src/index.ts https://platform.claude.com/docs/sitemap.xml -o ./platform-docs
```

### Language/Path Filtering

Filter URLs by path pattern (great for multi-language sites):

```bash
# Only English docs
bun run src/index.ts docs.anthropic.com -f '/en/' -o ./english-docs

# Only API docs
bun run src/index.ts example.com -f '/api/' -o ./api-docs
```

### Dry Run

Preview what would be downloaded:

```bash
bun run src/index.ts bun.com --dry-run
```

## CLI Options

```
sitemap-to-md <domain-or-sitemap-url> [options]

INPUT:
  Can be either:
  - A domain name (e.g., bun.com) - auto-discovers sitemaps
  - A sitemap URL (e.g., https://bun.com/sitemap.xml)

OPTIONS:
  -o, --output <dir>    Output directory (default: ./output)
  -f, --filter <path>   Filter URLs containing this path (e.g., '/en/')
  --no-filter           Skip URL filtering entirely
  -d, --delay <ms>      Delay between requests in milliseconds (default: 100)
  --dry-run             List URLs without downloading
  --discover            Force auto-discovery even for sitemap URLs
  -h, --help            Show this help message
```

## Examples

### Claude Documentation (English Only)

```bash
# Claude Code docs
bun run src/index.ts https://code.claude.com/docs/sitemap.xml -f '/en/' -o ./claude-code-docs

# Claude Platform docs
bun run src/index.ts https://platform.claude.com/docs/sitemap.xml -f '/en/' -o ./platform-docs
```

### Bun Documentation

```bash
bun run src/index.ts bun.com -o ./bun-docs
```

### Preview Before Download

```bash
# See what URLs would be fetched
bun run src/index.ts platform.claude.com --dry-run -f '/en/'
```

## How It Works

1. **Input Resolution**
   - Domain → Auto-discover sitemaps via robots.txt and common paths
   - Sitemap URL → Use directly

2. **Sitemap Fetching**
   - Parses XML sitemap
   - Handles sitemap index files (recursive)
   - Applies path filters

3. **Markdown Download**
   - Appends `.md` to each URL
   - Creates mirror directory structure
   - Respectful delay between requests

## Directory Structure Example

For a sitemap containing:
- `https://docs.example.com/en/docs/intro`
- `https://docs.example.com/en/docs/hosting`
- `https://docs.example.com/en/api/reference`

The tool creates:
```
output/
├── en/
│   ├── docs/
│   │   ├── intro.md
│   │   └── hosting.md
│   └── api/
│       └── reference.md
```

## Compatibility

This tool works with sites that serve markdown versions at `URL.md` endpoints:

| Site | Status | Notes |
|------|--------|-------|
| code.claude.com | ✅ Works | Full markdown support |
| bun.sh | ✅ Works | Full markdown support |
| vite.dev | ⚠️ Partial | Some pages work |
| typescriptlang.org | ❌ No | Sitemap has stale .html URLs |
| electronjs.org | ❌ No | No .md endpoint |
| react.dev | ❌ No | No sitemap found |

## Filter Syntax

The `-f` / `--filter` option supports special prefixes:

| Pattern | Meaning | Example |
|---------|---------|---------|
| `/docs/` | URL contains `/docs/` | `-f '/docs/'` |
| `^/docs/` | URL path STARTS with `/docs/` | `-f '^/docs/'` |
| `!/fr/` | URL does NOT contain `/fr/` | `-f '!/fr/'` |

## Requirements

- **Bun**: v1.0.0 or higher (recommended)
- **Node.js**: v18.0.0 or higher (alternative)

## License

MIT
