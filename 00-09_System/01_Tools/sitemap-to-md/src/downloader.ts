/**
 * Markdown downloader with directory structure creation
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { SitemapUrl } from './sitemap';

export interface DownloadOptions {
  outputDir: string;
  baseUrl: string;
  delay?: number; // Delay between requests in ms
}

/**
 * Downloads pages as markdown and creates directory structure
 */
export async function downloadPages(
  urls: SitemapUrl[],
  options: DownloadOptions
): Promise<void> {
  const { outputDir, baseUrl, delay = 100 } = options;

  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`⏱️  Delay between requests: ${delay}ms`);
  console.log(`📄 Downloading ${urls.length} pages...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      await downloadPage(url, options);
      successCount++;

      // Progress indicator
      if ((i + 1) % 10 === 0 || i === urls.length - 1) {
        console.log(`Progress: ${i + 1}/${urls.length} (✅ ${successCount}, ❌ ${errorCount})`);
      }

      // Respectful delay between requests
      if (i < urls.length - 1 && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ Error downloading ${url.loc}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log(`\n✨ Download complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
}

/**
 * Downloads a single page as markdown
 */
async function downloadPage(url: SitemapUrl, options: DownloadOptions): Promise<void> {
  const { outputDir, baseUrl } = options;

  // Parse URL to create directory structure
  const urlObj = new URL(url.loc);
  const path = urlObj.pathname;

  // Convert URL path to file path
  // Example: /en/docs/hosting -> en/docs/hosting.md
  let filePath = path.replace(/^\//, ''); // Remove leading slash

  // If path ends with /, use index.md
  if (filePath.endsWith('/')) {
    filePath = join(filePath, 'index.md');
  } else if (!filePath.endsWith('.md')) {
    filePath = `${filePath}.md`;
  }

  const fullPath = join(outputDir, filePath);

  // Create directory structure
  const dir = dirname(fullPath);
  await mkdir(dir, { recursive: true });

  // Fetch markdown version by adding .md to the URL
  const mdUrl = `${url.loc}.md`;

  console.log(`⬇️  ${path} → ${filePath}`);

  const response = await fetch(mdUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const content = await response.text();

  // Write file
  await writeFile(fullPath, content, 'utf-8');
}
