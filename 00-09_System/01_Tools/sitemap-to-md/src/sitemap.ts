/**
 * Sitemap fetcher and parser with sitemap index support
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface FetchOptions {
  /** Filter URLs by path pattern (e.g., '/en/' or '/docs/en/') */
  pathFilter?: string;
  /** If true, shows all URLs without filtering */
  noFilter?: boolean;
}

/**
 * Fetches and parses XML sitemap, handling sitemap index files
 */
export async function fetchSitemap(url: string, options: FetchOptions = {}): Promise<SitemapUrl[]> {
  console.log(`📥 Fetching sitemap: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();

  // Check if this is a sitemap index (contains other sitemaps)
  if (isSitemapIndex(xml)) {
    console.log(`📋 Detected sitemap index, fetching child sitemaps...`);
    return fetchSitemapIndex(xml, options);
  }

  // Regular sitemap
  const urls = parseSitemap(xml);
  return filterUrls(urls, options);
}

/**
 * Checks if XML is a sitemap index
 */
function isSitemapIndex(xml: string): boolean {
  return xml.includes('<sitemapindex') || xml.includes('<sitemap>');
}

/**
 * Parses sitemap index and fetches all referenced sitemaps
 */
async function fetchSitemapIndex(xml: string, options: FetchOptions): Promise<SitemapUrl[]> {
  const sitemapUrls: string[] = [];

  // Extract all <sitemap><loc>...</loc></sitemap> entries
  const sitemapMatches = xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g);

  for (const match of sitemapMatches) {
    const sitemapBlock = match[1];
    const locMatch = sitemapBlock.match(/<loc>(.*?)<\/loc>/);
    if (locMatch) {
      sitemapUrls.push(locMatch[1].trim());
    }
  }

  console.log(`   Found ${sitemapUrls.length} child sitemaps`);

  // Fetch all child sitemaps
  const allUrls: SitemapUrl[] = [];
  for (const sitemapUrl of sitemapUrls) {
    try {
      // Recursively fetch (handles nested sitemap indexes)
      const urls = await fetchSitemap(sitemapUrl, { ...options, noFilter: true });
      allUrls.push(...urls);
    } catch (error) {
      console.error(`   ⚠️  Failed to fetch child sitemap ${sitemapUrl}:`,
        error instanceof Error ? error.message : error);
    }
  }

  // Apply filter after collecting all URLs
  return filterUrls(allUrls, options);
}

/**
 * Parses XML sitemap content
 */
function parseSitemap(xml: string): SitemapUrl[] {
  const urls: SitemapUrl[] = [];

  // Extract all <url> blocks
  const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/g);

  for (const match of urlMatches) {
    const urlBlock = match[1];

    // Extract <loc> tag
    const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) continue;

    const url: SitemapUrl = {
      loc: locMatch[1].trim()
    };

    // Extract optional tags
    const lastmodMatch = urlBlock.match(/<lastmod>(.*?)<\/lastmod>/);
    if (lastmodMatch) url.lastmod = lastmodMatch[1].trim();

    const changefreqMatch = urlBlock.match(/<changefreq>(.*?)<\/changefreq>/);
    if (changefreqMatch) url.changefreq = changefreqMatch[1].trim();

    const priorityMatch = urlBlock.match(/<priority>(.*?)<\/priority>/);
    if (priorityMatch) url.priority = priorityMatch[1].trim();

    urls.push(url);
  }

  console.log(`   Found ${urls.length} URLs`);
  return urls;
}

/**
 * Filters URLs by path pattern
 * Supports:
 *   - Simple includes: '/docs/' matches any URL containing '/docs/'
 *   - Start-of-path: '^/docs/' matches URLs where pathname STARTS with '/docs/'
 *   - Exclude pattern: '!/fr/' excludes URLs containing '/fr/'
 */
function filterUrls(urls: SitemapUrl[], options: FetchOptions): SitemapUrl[] {
  if (options.noFilter || !options.pathFilter) {
    return urls;
  }

  const filter = options.pathFilter;

  // Check for special prefixes
  const isStartsWith = filter.startsWith('^');
  const isExclude = filter.startsWith('!');
  const pattern = isStartsWith || isExclude ? filter.slice(1) : filter;

  const filtered = urls.filter(url => {
    try {
      const urlObj = new URL(url.loc);
      const pathname = urlObj.pathname;

      if (isExclude) {
        // Exclude URLs containing the pattern
        return !pathname.includes(pattern);
      } else if (isStartsWith) {
        // Match URLs where pathname starts with pattern
        return pathname.startsWith(pattern);
      } else {
        // Default: includes match
        return pathname.includes(pattern);
      }
    } catch {
      return false;
    }
  });

  if (filtered.length !== urls.length) {
    const mode = isExclude ? 'excluding' : isStartsWith ? 'starting with' : 'matching';
    console.log(`🔍 Filtered to ${filtered.length} URLs ${mode} '${pattern}' (from ${urls.length} total)`);
  }

  return filtered;
}
