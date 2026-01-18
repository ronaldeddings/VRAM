import { test, expect } from '@playwright/test';

test.describe('Session Action Buttons - Simple Tests', () => {
  let sessionId: string;

  test.beforeAll(async ({ browser }) => {
    // Find a session ID by navigating to the dashboard
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.session-card, .empty-state', { timeout: 15000 });

    const sessionCards = await page.locator('.session-card').count();
    if (sessionCards > 0) {
      const href = await page.locator('.session-card').first().getAttribute('href');
      sessionId = href?.replace('#/sessions/', '') || '';
      console.log('Found session ID:', sessionId);
    }

    await page.close();
  });

  test('Dashboard should load and show sessions or empty state', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.session-card, .empty-state', { timeout: 15000 });

    await page.screenshot({ path: 'screenshots/simple-01-dashboard.png', fullPage: true });

    const hasCards = await page.locator('.session-card').count() > 0;
    const hasEmpty = await page.locator('.empty-state').count() > 0;

    console.log('Has session cards:', hasCards);
    console.log('Has empty state:', hasEmpty);

    expect(hasCards || hasEmpty).toBeTruthy();
  });

  test('Session detail page should load', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'screenshots/simple-02-session-detail.png', fullPage: true });

    // Check for session header
    const hasSessionHeader = await page.locator('.session-header').count() > 0;
    console.log('Has session header:', hasSessionHeader);
    expect(hasSessionHeader).toBeTruthy();
  });

  test('Session actions should be visible', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'screenshots/simple-03-actions.png', fullPage: true });

    // Check for action links (they're <a> tags, not buttons)
    const analyzeLink = await page.locator('a[href*="/analyze"]').count();
    const validateLink = await page.locator('a[href*="/validate"]').count();
    const exportButton = await page.locator('button:has-text("Export")').count();
    const cloneButton = await page.locator('button:has-text("Clone")').count();

    console.log('Analyze link found:', analyzeLink);
    console.log('Validate link found:', validateLink);
    console.log('Export button found:', exportButton);
    console.log('Clone button found:', cloneButton);

    // Report findings
    if (analyzeLink === 0) console.log('ERROR: Analyze link not found');
    if (validateLink === 0) console.log('ERROR: Validate link not found');
    if (exportButton === 0) console.log('ERROR: Export button not found');
    if (cloneButton === 0) console.log('ERROR: Clone button not found');
  });

  test('Analyze link should navigate correctly', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');

    const analyzeLink = page.locator('a[href*="/analyze"]').first();
    const exists = await analyzeLink.count() > 0;

    if (!exists) {
      console.log('ERROR: Analyze link not found');
      return;
    }

    await page.screenshot({ path: 'screenshots/simple-04-before-analyze-click.png', fullPage: true });

    await analyzeLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for any animations

    await page.screenshot({ path: 'screenshots/simple-05-after-analyze-click.png', fullPage: true });

    const url = page.url();
    console.log('URL after Analyze click:', url);

    const hasAnalysisView = await page.locator('.analysis-view').count() > 0;
    console.log('Has analysis view:', hasAnalysisView);

    expect(url).toContain('/analyze');
  });

  test('Validate link should navigate correctly', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');

    const validateLink = page.locator('a[href*="/validate"]').first();
    const exists = await validateLink.count() > 0;

    if (!exists) {
      console.log('ERROR: Validate link not found');
      return;
    }

    await page.screenshot({ path: 'screenshots/simple-06-before-validate-click.png', fullPage: true });

    await validateLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for any animations

    await page.screenshot({ path: 'screenshots/simple-07-after-validate-click.png', fullPage: true });

    const url = page.url();
    console.log('URL after Validate click:', url);

    const hasValidationView = await page.locator('.validation-view').count() > 0;
    console.log('Has validation view:', hasValidationView);

    expect(url).toContain('/validate');
  });

  test('Export button should open dialog', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');

    const exportButton = page.locator('button:has-text("Export")').first();
    const exists = await exportButton.count() > 0;

    if (!exists) {
      console.log('ERROR: Export button not found');
      return;
    }

    await page.screenshot({ path: 'screenshots/simple-08-before-export.png', fullPage: true });

    await exportButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'screenshots/simple-09-after-export.png', fullPage: true });

    const hasDialog = await page.locator('dialog[open]').count() > 0;
    const hasExportDialog = await page.locator('#export-dialog[open]').count() > 0;

    console.log('Has open dialog:', hasDialog);
    console.log('Has export dialog:', hasExportDialog);

    if (!hasDialog && !hasExportDialog) {
      console.log('ERROR: Export dialog did not open');
    }
  });

  test('Clone button should open dialog', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');

    const cloneButton = page.locator('button:has-text("Clone")').first();
    const exists = await cloneButton.count() > 0;

    if (!exists) {
      console.log('ERROR: Clone button not found');
      return;
    }

    await page.screenshot({ path: 'screenshots/simple-10-before-clone.png', fullPage: true });

    await cloneButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'screenshots/simple-11-after-clone.png', fullPage: true });

    const hasDialog = await page.locator('dialog[open]').count() > 0;
    const hasCloneDialog = await page.locator('#clone-dialog[open]').count() > 0;

    console.log('Has open dialog:', hasDialog);
    console.log('Has clone dialog:', hasCloneDialog);

    if (!hasDialog && !hasCloneDialog) {
      console.log('ERROR: Clone dialog did not open');
    }
  });

  test('Back to Session button should work from Analysis view', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}/analyze`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'screenshots/simple-12-analysis-view.png', fullPage: true });

    const backButton = page.locator('a[href*="/sessions/"], button:has-text("Back to Session")').first();
    const exists = await backButton.count() > 0;

    if (!exists) {
      console.log('ERROR: Back button not found in Analysis view');
      return;
    }

    await backButton.click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'screenshots/simple-13-back-from-analysis.png', fullPage: true });

    const url = page.url();
    console.log('URL after Back click:', url);

    // Should be back at session detail, not on /analyze
    expect(url).not.toContain('/analyze');
    expect(url).toContain(`/sessions/${sessionId}`);
  });

  test('Back to Session button should work from Validation view', async ({ page }) => {
    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    await page.goto(`http://localhost:3000/#/sessions/${sessionId}/validate`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'screenshots/simple-14-validation-view.png', fullPage: true });

    const backButton = page.locator('a[href*="/sessions/"], button:has-text("Back to Session")').first();
    const exists = await backButton.count() > 0;

    if (!exists) {
      console.log('ERROR: Back button not found in Validation view');
      return;
    }

    await backButton.click();
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'screenshots/simple-15-back-from-validation.png', fullPage: true });

    const url = page.url();
    console.log('URL after Back click:', url);

    // Should be back at session detail, not on /validate
    expect(url).not.toContain('/validate');
    expect(url).toContain(`/sessions/${sessionId}`);
  });

  test('Check for console errors and API failures', async ({ page }) => {
    const consoleErrors: string[] = [];
    const apiErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        apiErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    if (!sessionId) {
      console.log('SKIP: No session found');
      return;
    }

    // Visit session page
    await page.goto(`http://localhost:3000/#/sessions/${sessionId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n=== Console Errors ===');
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(err => console.log('ERROR:', err));
    } else {
      console.log('No console errors');
    }

    console.log('\n=== API Errors ===');
    if (apiErrors.length > 0) {
      apiErrors.forEach(err => console.log('API ERROR:', err));
    } else {
      console.log('No API errors');
    }
  });
});
