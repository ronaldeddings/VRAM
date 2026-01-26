#!/usr/bin/env node

/**
 * sitemap-to-md - Download sitemap and convert pages to markdown
 *
 * Enhanced with auto-discovery and flexible filtering
 */

import { fetchSitemap } from './sitemap';
import { downloadPages } from './downloader';
import { autoDiscoverSitemaps, looksLikeSitemapUrl, normalizeBaseUrl } from './discovery';

interface Config {
  input: string;           // Domain or sitemap URL
  outputDir: string;
  delay: number;
  pathFilter?: string;     // Filter URLs by path (e.g., '/en/')
  noFilter: boolean;       // Skip filtering entirely
  dryRun: boolean;         // List URLs without downloading
  discover: boolean;       // Force auto-discovery mode
}

async function main() {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const config = parseArgs(args);

  if (!config) {
    printUsage();
    process.exit(1);
  }

  try {
    console.log('🚀 sitemap-to-md starting...\n');

    // Determine sitemap URLs to process
    const sitemapUrls = await resolveSitemaps(config);

    if (sitemapUrls.length === 0) {
      console.log('❌ No sitemaps found. Try providing a direct sitemap URL.');
      process.exit(1);
    }

    // Fetch and collect all URLs from all sitemaps
    let allUrls: Awaited<ReturnType<typeof fetchSitemap>> = [];

    for (const sitemapUrl of sitemapUrls) {
      const urls = await fetchSitemap(sitemapUrl, {
        pathFilter: config.pathFilter,
        noFilter: config.noFilter
      });
      allUrls.push(...urls);
    }

    // Deduplicate URLs
    const seen = new Set<string>();
    allUrls = allUrls.filter(url => {
      if (seen.has(url.loc)) return false;
      seen.add(url.loc);
      return true;
    });

    console.log(`\n📊 Total unique URLs: ${allUrls.length}`);

    if (allUrls.length === 0) {
      console.log('⚠️  No URLs to download');
      return;
    }

    // Dry run mode - just list URLs
    if (config.dryRun) {
      console.log('\n📋 URLs that would be downloaded (dry run):');
      for (const url of allUrls.slice(0, 20)) {
        console.log(`   ${url.loc}`);
      }
      if (allUrls.length > 20) {
        console.log(`   ... and ${allUrls.length - 20} more`);
      }
      return;
    }

    // Extract base URL for the downloader
    const baseUrl = new URL(allUrls[0].loc).origin;

    // Download all pages
    await downloadPages(allUrls, {
      outputDir: config.outputDir,
      baseUrl,
      delay: config.delay
    });

    console.log('\n🎉 All done!');
    console.log(`📁 Output: ${config.outputDir}`);
  } catch (error) {
    console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * Resolves input to sitemap URL(s)
 */
async function resolveSitemaps(config: Config): Promise<string[]> {
  const { input, discover } = config;

  // If it looks like a sitemap URL and not forcing discovery, use directly
  if (looksLikeSitemapUrl(input) && !discover) {
    console.log(`📎 Using provided sitemap URL: ${input}`);
    return [input];
  }

  // Auto-discovery mode
  console.log(`🔍 Auto-discovering sitemaps for: ${input}\n`);

  const result = await autoDiscoverSitemaps(input);

  if (result.sitemaps.length > 0) {
    console.log(`\n✅ Found ${result.sitemaps.length} sitemap(s) via ${result.source}`);
    return result.sitemaps;
  }

  // Last resort: try common sitemap.xml directly
  const fallbackUrl = `${normalizeBaseUrl(input)}/sitemap.xml`;
  console.log(`\n🔄 Trying fallback: ${fallbackUrl}`);

  try {
    const response = await fetch(fallbackUrl);
    if (response.ok) {
      return [fallbackUrl];
    }
  } catch {
    // Ignore
  }

  return [];
}

function parseArgs(args: string[]): Config | null {
  if (args.length === 0) {
    return null;
  }

  const config: Config = {
    input: '',
    outputDir: './output',
    delay: 100,
    noFilter: false,
    dryRun: false,
    discover: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      return null;
    }

    if (arg === '-o' || arg === '--output') {
      config.outputDir = args[++i];
      continue;
    }

    if (arg === '-d' || arg === '--delay') {
      config.delay = parseInt(args[++i], 10);
      continue;
    }

    if (arg === '-f' || arg === '--filter') {
      config.pathFilter = args[++i];
      continue;
    }

    if (arg === '--no-filter') {
      config.noFilter = true;
      continue;
    }

    if (arg === '--dry-run') {
      config.dryRun = true;
      continue;
    }

    if (arg === '--discover') {
      config.discover = true;
      continue;
    }

    // First positional argument is the input (domain or sitemap URL)
    if (!config.input) {
      config.input = arg;
    }
  }

  if (!config.input) {
    return null;
  }

  return config;
}

function printUsage() {
  console.log(`
sitemap-to-md - Download sitemap and convert pages to markdown

USAGE:
  sitemap-to-md <domain-or-sitemap-url> [options]

INPUT:
  Can be either:
  - A domain name (e.g., bun.com) - auto-discovers sitemaps
  - A sitemap URL (e.g., https://bun.com/sitemap.xml)

OPTIONS:
  -o, --output <dir>    Output directory (default: ./output)
  -f, --filter <path>   Filter URLs containing this path (e.g., '/en/' or '/docs/')
  --no-filter           Skip URL filtering entirely
  -d, --delay <ms>      Delay between requests in milliseconds (default: 100)
  --dry-run             List URLs without downloading
  --discover            Force auto-discovery even for sitemap URLs
  -h, --help            Show this help message

EXAMPLES:
  # Auto-discover from domain (easiest!)
  sitemap-to-md bun.com -o ./bun-docs

  # Direct sitemap URL
  sitemap-to-md https://code.claude.com/docs/sitemap.xml -o ./claude-code-docs

  # Filter to English docs only
  sitemap-to-md docs.anthropic.com -f '/en/' -o ./anthropic-en

  # Dry run to preview what would be downloaded
  sitemap-to-md platform.claude.com --dry-run

  # Multiple language sites - get only English
  sitemap-to-md docs.example.com -f '/en/' -o ./english-docs

AUTO-DISCOVERY:
  When given a domain, the tool will:
  1. Check robots.txt for Sitemap: directives
  2. Probe common sitemap paths (/sitemap.xml, /sitemap_index.xml, etc.)
  3. Handle sitemap index files (fetch all referenced sitemaps)
`);
}

// Run main function
main();
