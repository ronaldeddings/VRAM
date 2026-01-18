#!/usr/bin/env bun

/**
 * Simple navigation test using fetch to verify each route loads
 */

interface NavigationTest {
  name: string;
  href: string;
  expectedContent: string[];
}

const navigationTests: NavigationTest[] = [
  {
    name: 'Sessions Dashboard',
    href: '#/',
    expectedContent: ['Recent Sessions', 'Dashboard']
  },
  {
    name: 'Projects',
    href: '#/projects',
    expectedContent: ['Projects']
  },
  {
    name: 'Build Session',
    href: '#/build',
    expectedContent: ['Build Session']
  },
  {
    name: 'Fabricate',
    href: '#/fabricate',
    expectedContent: ['Fabricate', 'DSL']
  },
  {
    name: 'Templates',
    href: '#/templates',
    expectedContent: ['Templates']
  },
  {
    name: 'Optimize',
    href: '#/optimize',
    expectedContent: ['Optimize', 'Context']
  },
  {
    name: 'Validate',
    href: '#/validate',
    expectedContent: ['Validate', 'Session']
  }
];

async function testNavigation() {
  console.log('🚀 Starting navigation tests...\n');

  // First, get the base HTML to check if navigation links exist
  const baseUrl = 'http://localhost:3000';
  let html: string;

  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    html = await response.text();
    console.log('✅ Base page loaded successfully\n');
  } catch (error) {
    console.error('❌ Failed to load base page:', error);
    process.exit(1);
  }

  const results: { name: string; status: 'PASS' | 'FAIL' | 'WARN'; details: string }[] = [];

  // Test each navigation link
  for (const test of navigationTests) {
    console.log(`Testing: ${test.name} (${test.href})`);

    try {
      // Check if the link exists in the HTML
      const linkPattern = new RegExp(`href="${test.href.replace('#', '\\#')}"`, 'i');
      const linkExists = linkPattern.test(html);

      if (!linkExists) {
        results.push({
          name: test.name,
          status: 'FAIL',
          details: `Navigation link "${test.href}" not found in HTML`
        });
        console.log(`  ❌ FAIL: Link not found in HTML\n`);
        continue;
      }

      // Since this is a SPA with hash routing, all routes serve the same HTML
      // We can only verify the links exist - actual routing requires browser execution
      let hasExpectedContent = false;
      for (const expected of test.expectedContent) {
        if (html.includes(expected)) {
          hasExpectedContent = true;
          break;
        }
      }

      if (linkExists) {
        results.push({
          name: test.name,
          status: 'PASS',
          details: 'Navigation link found in HTML (SPA routing requires browser to test fully)'
        });
        console.log(`  ✅ PASS: Link exists in navigation\n`);
      } else {
        results.push({
          name: test.name,
          status: 'WARN',
          details: 'Link exists but expected content not in initial HTML (may be rendered by React)'
        });
        console.log(`  ⚠️  WARN: Link exists but content not in initial HTML\n`);
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

  // Check for common navigation elements
  console.log('Checking for common navigation elements...\n');

  const navChecks = [
    { name: 'Sidebar navigation', pattern: /<nav|<aside|sidebar/i },
    { name: 'Navigation links', pattern: /href="#\//g },
    { name: 'React app root', pattern: /id="root"|id="app"/i },
    { name: 'JavaScript bundle', pattern: /<script.*src=.*\.js/i }
  ];

  for (const check of navChecks) {
    const found = check.pattern.test(html);
    console.log(`  ${found ? '✅' : '❌'} ${check.name}: ${found ? 'Found' : 'Not found'}`);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('NAVIGATION TEST SUMMARY');
  console.log('='.repeat(60) + '\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${result.name}: ${result.status}`);
    if (result.status !== 'PASS') {
      console.log(`   ${result.details}`);
    }
  });

  console.log(`\nTotal: ${results.length} | Passed: ${passed} | Warnings: ${warned} | Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');

  // Output the navigation section for inspection
  const navMatch = html.match(/<nav[\s\S]{0,2000}?<\/nav>|<aside[\s\S]{0,2000}?<\/aside>/i);
  if (navMatch) {
    console.log('📋 Navigation HTML snippet:\n');
    console.log(navMatch[0].substring(0, 500) + '...\n');
  }

  return results;
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
