import { test } from '@playwright/test';

test('debug dashboard and session view', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Take screenshot of dashboard
  await page.screenshot({ path: 'screenshots/debug-01-dashboard.png', fullPage: true });

  // Check what's on the page
  const pageContent = await page.content();
  console.log('\n=== Page HTML Length ===');
  console.log(pageContent.length);

  // Check for various elements
  console.log('\n=== Element Checks ===');
  console.log('Has session-card data-testid:', await page.locator('[data-testid="session-card"]').count());
  console.log('Has any card elements:', await page.locator('[class*="card"]').count());
  console.log('Has any session text:', await page.locator('text=/session/i').count());
  console.log('Has loading indicator:', await page.locator('text=/loading/i').count());
  console.log('Has error message:', await page.locator('text=/error/i').count());

  // Check URL
  console.log('\n=== Current URL ===');
  console.log(page.url());

  // Get page title
  console.log('\n=== Page Title ===');
  console.log(await page.title());

  // List all visible text on page
  console.log('\n=== Visible Text (first 500 chars) ===');
  const bodyText = await page.locator('body').textContent();
  console.log(bodyText?.slice(0, 500));

  // Check for API calls
  console.log('\n=== Network Activity ===');
  const responses: string[] = [];
  page.on('response', response => {
    responses.push(`${response.status()} ${response.url()}`);
  });

  // Wait a bit more
  await page.waitForTimeout(2000);

  // Take another screenshot
  await page.screenshot({ path: 'screenshots/debug-02-dashboard-after-wait.png', fullPage: true });

  console.log('\n=== Recent Network Responses ===');
  responses.forEach(r => console.log(r));
});
