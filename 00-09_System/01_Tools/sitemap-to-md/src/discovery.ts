/**
 * Sitemap auto-discovery from robots.txt and common paths
 */

export interface DiscoveredSitemaps {
  source: 'robots.txt' | 'common-paths' | 'direct';
  sitemaps: string[];
}

/**
 * Common sitemap locations to check
 */
const COMMON_SITEMAP_PATHS = [
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/sitemaps/sitemap.xml',
  '/sitemap/sitemap.xml',
  '/docs/sitemap.xml',
  '/api/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemaps.xml',
];

/**
 * Fetches robots.txt and extracts Sitemap directives
 */
export async function discoverFromRobotsTxt(domain: string): Promise<string[]> {
  const robotsUrl = `${normalizeBaseUrl(domain)}/robots.txt`;

  try {
    console.log(`🤖 Checking robots.txt: ${robotsUrl}`);
    const response = await fetch(robotsUrl);

    if (!response.ok) {
      console.log(`   ⚠️  robots.txt not found (${response.status})`);
      return [];
    }

    const text = await response.text();
    const sitemaps: string[] = [];

    // Parse Sitemap: directives (case-insensitive)
    const lines = text.split('\n');
    for (const line of lines) {
      const match = line.match(/^Sitemap:\s*(.+)$/i);
      if (match) {
        const sitemapUrl = match[1].trim();
        sitemaps.push(sitemapUrl);
        console.log(`   ✅ Found: ${sitemapUrl}`);
      }
    }

    if (sitemaps.length === 0) {
      console.log(`   ℹ️  No Sitemap directives found in robots.txt`);
    }

    return sitemaps;
  } catch (error) {
    console.log(`   ⚠️  Could not fetch robots.txt: ${error instanceof Error ? error.message : error}`);
    return [];
  }
}

/**
 * Probes common sitemap paths on a domain
 */
export async function discoverFromCommonPaths(domain: string): Promise<string[]> {
  const baseUrl = normalizeBaseUrl(domain);
  const discovered: string[] = [];

  console.log(`🔍 Probing common sitemap paths...`);

  // Check paths in parallel for speed
  const checks = COMMON_SITEMAP_PATHS.map(async (path) => {
    const url = `${baseUrl}${path}`;
    try {
      // Fetch actual content to verify it's XML (HEAD can lie about content-type)
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'Accept': 'application/xml, text/xml' }
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        // Must be XML content-type to be valid
        if (contentType.includes('xml')) {
          const text = await response.text();
          // Verify it actually contains sitemap XML structure
          if (text.includes('<urlset') || text.includes('<sitemapindex')) {
            console.log(`   ✅ Found: ${url}`);
            return url;
          }
        }
      }
    } catch {
      // Silently ignore fetch errors
    }
    return null;
  });

  const results = await Promise.all(checks);
  for (const result of results) {
    if (result) discovered.push(result);
  }

  if (discovered.length === 0) {
    console.log(`   ℹ️  No sitemaps found at common paths`);
  }

  return discovered;
}

/**
 * Full auto-discovery: robots.txt first, then common paths
 */
export async function autoDiscoverSitemaps(domain: string): Promise<DiscoveredSitemaps> {
  // Try robots.txt first (authoritative)
  const robotsSitemaps = await discoverFromRobotsTxt(domain);
  if (robotsSitemaps.length > 0) {
    return { source: 'robots.txt', sitemaps: robotsSitemaps };
  }

  // Fall back to common path probing
  const commonSitemaps = await discoverFromCommonPaths(domain);
  if (commonSitemaps.length > 0) {
    return { source: 'common-paths', sitemaps: commonSitemaps };
  }

  return { source: 'direct', sitemaps: [] };
}

/**
 * Normalizes domain input to base URL
 * Handles: example.com, https://example.com, https://example.com/path
 */
export function normalizeBaseUrl(input: string): string {
  let url = input.trim();

  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Parse and extract origin (removes path, query, hash)
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    // If parsing fails, try adding https and retry
    try {
      const parsed = new URL(`https://${input}`);
      return parsed.origin;
    } catch {
      throw new Error(`Invalid domain or URL: ${input}`);
    }
  }
}

/**
 * Checks if input looks like a sitemap URL vs just a domain
 */
export function looksLikeSitemapUrl(input: string): boolean {
  return input.endsWith('.xml') || input.includes('sitemap');
}
