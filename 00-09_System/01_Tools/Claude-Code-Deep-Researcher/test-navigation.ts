#!/usr/bin/env bun

/**
 * Test script for Claude Code Conversation Workbench navigation
 * Tests all 7 sidebar navigation links
 */

import { chromium, type Browser, type Page } from 'playwright';

interface NavigationTest {
  name: string;
  href: string;
  expectedContent: string;
}

const navigationTests: NavigationTest[] = [
  {
    name: 'Sessions Dashboard',
    href: '#/',
    expectedContent: 'Recent Sessions'
  },
  {
    name: 'Projects',
    href: '#/projects',
    expectedContent: 'Projects'
  },
  {
    name: 'Build Session',
    href: '#/build',
    expectedContent: 'Build Session'
  },
  {
    name: 'Fabricate',
    href: '#/fabricate',
    expectedContent: 'Fabricate'
  },
  {
    name: 'Templates',
    href: '#/templates',
    expectedContent: 'Templates'
  },
  {
    name: 'Optimize',
    href: '#/optimize',
    expectedContent: 'Optimize'
  },
  {
    name: 'Validate',
    href: '#/validate',
    expectedContent: 'Validate'
  }
];

async function testNavigation() {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🚀 Starting navigation tests...\n');

    // Launch browser
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();

    // Navigate to base URL
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('✅ Initial page loaded\n');

    const results: { name: string; status: 'PASS' | 'FAIL'; details: string }[] = [];

    // Test each navigation link
    for (const test of navigationTests) {
      console.log(`Testing: ${test.name} (${test.href})`);

      try {
        // Find and click the navigation link
        const link = await page.locator(`a[href="${test.href}"]`).first();

        if (!await link.isVisible()) {
          results.push({
            name: test.name,
            status: 'FAIL',
            details: 'Navigation link not found or not visible'
          });
          console.log(`  ❌ FAIL: Link not found\n`);
          continue;
        }

        await link.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500); // Allow for React rendering

        // Verify the expected content appears
        const content = await page.content();
        const hasExpectedContent = content.includes(test.expectedContent);

        if (hasExpectedContent) {
          results.push({
            name: test.name,
            status: 'PASS',
            details: 'Navigation successful, expected content found'
          });
          console.log(`  ✅ PASS: Page loaded correctly\n`);
        } else {
          // Take a screenshot for debugging
          const screenshotPath = `/tmp/nav-test-${test.name.replace(/\s+/g, '-').toLowerCase()}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });

          results.push({
            name: test.name,
            status: 'FAIL',
            details: `Expected content "${test.expectedContent}" not found. Screenshot: ${screenshotPath}`
          });
          console.log(`  ❌ FAIL: Expected content not found\n`);
        }
      } catch (error) {
        results.push({
          name: test.name,
          status: 'FAIL',
          details: `Error: ${error instanceof Error ? error.message : String(error)}`
        });
        console.log(`  ❌ FAIL: ${error instanceof Error ? error.message : String(error)}\n`);
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('NAVIGATION TEST SUMMARY');
    console.log('='.repeat(60) + '\n');

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;

    results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.name}: ${result.status}`);
      if (result.status === 'FAIL') {
        console.log(`   ${result.details}`);
      }
    });

    console.log(`\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('='.repeat(60) + '\n');

    return results;
  } catch (error) {
    console.error('❌ Fatal error during testing:', error);
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

// Run tests
testNavigation()
  .then(() => {
    console.log('✅ All tests completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
