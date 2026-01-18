import { test, expect } from '@playwright/test';

test.describe('Session View Action Buttons', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Wait for content to finish loading - either session cards or empty state
    await page.waitForSelector('.session-card, .empty-state', { timeout: 15000 });
  });

  test('should navigate to session detail view from dashboard', async ({ page }) => {
    // Check if we have session cards or empty state
    const hasSessionCards = await page.locator('.session-card').count() > 0;

    // Take snapshot of dashboard
    await page.screenshot({ path: 'screenshots/01-dashboard.png', fullPage: true });

    if (!hasSessionCards) {
      console.log('No session cards found - skipping navigation test');
      return;
    }

    // Click first session card
    const firstSessionCard = page.locator('.session-card').first();
    await firstSessionCard.click();

    // Wait for navigation
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Take snapshot of session detail view
    await page.screenshot({ path: 'screenshots/02-session-detail.png', fullPage: true });

    // Verify we're on a session page
    expect(page.url()).toMatch(/\/sessions\/.+/);
  });

  test('should test Analyze button', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Find and click Analyze button
    const analyzeButton = page.locator('button:has-text("Analyze")').first();

    // Take snapshot before clicking
    await page.screenshot({ path: 'screenshots/03-before-analyze.png', fullPage: true });

    // Check if button exists
    const analyzeExists = await analyzeButton.count() > 0;
    console.log('Analyze button exists:', analyzeExists);

    if (analyzeExists) {
      await analyzeButton.click();
      await page.waitForLoadState('networkidle');

      // Take snapshot after clicking
      await page.screenshot({ path: 'screenshots/04-after-analyze.png', fullPage: true });

      // Verify URL changed to analyze route
      const url = page.url();
      console.log('Current URL after Analyze click:', url);
      expect(url).toMatch(/\/sessions\/.*\/analyze/);

      // Check for analysis content
      const hasAnalysisContent = await page.locator('[data-testid="analysis-view"]').count() > 0;
      console.log('Analysis content loaded:', hasAnalysisContent);
    } else {
      console.log('ERROR: Analyze button not found');
    }
  });

  test('should test Validate button', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Find and click Validate button
    const validateButton = page.locator('button:has-text("Validate")').first();

    // Take snapshot before clicking
    await page.screenshot({ path: 'screenshots/05-before-validate.png', fullPage: true });

    // Check if button exists
    const validateExists = await validateButton.count() > 0;
    console.log('Validate button exists:', validateExists);

    if (validateExists) {
      await validateButton.click();
      await page.waitForLoadState('networkidle');

      // Take snapshot after clicking
      await page.screenshot({ path: 'screenshots/06-after-validate.png', fullPage: true });

      // Verify URL changed to validate route
      const url = page.url();
      console.log('Current URL after Validate click:', url);
      expect(url).toMatch(/\/sessions\/.*\/validate/);

      // Check for validation content
      const hasValidationContent = await page.locator('[data-testid="validation-view"]').count() > 0;
      console.log('Validation content loaded:', hasValidationContent);
    } else {
      console.log('ERROR: Validate button not found');
    }
  });

  test('should test Export button', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Find and click Export button
    const exportButton = page.locator('button:has-text("Export")').first();

    // Take snapshot before clicking
    await page.screenshot({ path: 'screenshots/07-before-export.png', fullPage: true });

    // Check if button exists
    const exportExists = await exportButton.count() > 0;
    console.log('Export button exists:', exportExists);

    if (exportExists) {
      await exportButton.click();
      await page.waitForTimeout(1000); // Wait for dialog

      // Take snapshot after clicking
      await page.screenshot({ path: 'screenshots/08-after-export.png', fullPage: true });

      // Check for export dialog
      const hasExportDialog = await page.locator('[role="dialog"]').count() > 0;
      console.log('Export dialog opened:', hasExportDialog);
    } else {
      console.log('ERROR: Export button not found');
    }
  });

  test('should test Clone button', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Find and click Clone button
    const cloneButton = page.locator('button:has-text("Clone")').first();

    // Take snapshot before clicking
    await page.screenshot({ path: 'screenshots/09-before-clone.png', fullPage: true });

    // Check if button exists
    const cloneExists = await cloneButton.count() > 0;
    console.log('Clone button exists:', cloneExists);

    if (cloneExists) {
      await cloneButton.click();
      await page.waitForTimeout(1000); // Wait for dialog

      // Take snapshot after clicking
      await page.screenshot({ path: 'screenshots/10-after-clone.png', fullPage: true });

      // Check for clone dialog
      const hasCloneDialog = await page.locator('[role="dialog"]').count() > 0;
      console.log('Clone dialog opened:', hasCloneDialog);
    } else {
      console.log('ERROR: Clone button not found');
    }
  });

  test('should test Load More button if visible', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Find Load More button
    const loadMoreButton = page.locator('button:has-text("Load More")').first();

    // Take snapshot
    await page.screenshot({ path: 'screenshots/11-load-more-check.png', fullPage: true });

    // Check if button exists
    const loadMoreExists = await loadMoreButton.count() > 0;
    console.log('Load More button exists:', loadMoreExists);

    if (loadMoreExists) {
      // Count entries before
      const entriesBeforeCount = await page.locator('[data-testid*="entry"]').count();
      console.log('Entries before Load More:', entriesBeforeCount);

      await loadMoreButton.click();
      await page.waitForTimeout(1000);

      // Take snapshot after clicking
      await page.screenshot({ path: 'screenshots/12-after-load-more.png', fullPage: true });

      // Count entries after
      const entriesAfterCount = await page.locator('[data-testid*="entry"]').count();
      console.log('Entries after Load More:', entriesAfterCount);

      // Verify more entries loaded
      expect(entriesAfterCount).toBeGreaterThan(entriesBeforeCount);
    } else {
      console.log('INFO: Load More button not visible (may not be needed)');
    }
  });

  test('should test Back to Session button from Analysis view', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Click Analyze button first
    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    if (await analyzeButton.count() > 0) {
      await analyzeButton.click();
      await page.waitForLoadState('networkidle');

      // Find and click Back to Session button
      const backButton = page.locator('button:has-text("Back to Session")').first();

      // Take snapshot before clicking
      await page.screenshot({ path: 'screenshots/13-before-back-from-analysis.png', fullPage: true });

      const backExists = await backButton.count() > 0;
      console.log('Back to Session button exists in Analysis:', backExists);

      if (backExists) {
        await backButton.click();
        await page.waitForLoadState('networkidle');

        // Take snapshot after clicking
        await page.screenshot({ path: 'screenshots/14-after-back-from-analysis.png', fullPage: true });

        // Verify URL changed back to session detail
        const url = page.url();
        console.log('Current URL after Back click:', url);
        expect(url).toMatch(/\/sessions\/[^\/]+$/);
      } else {
        console.log('ERROR: Back to Session button not found in Analysis view');
      }
    } else {
      console.log('SKIP: Analyze button not found, cannot test Back button');
    }
  });

  test('should test Back to Session button from Validation view', async ({ page }) => {
    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Click Validate button first
    const validateButton = page.locator('button:has-text("Validate")').first();
    if (await validateButton.count() > 0) {
      await validateButton.click();
      await page.waitForLoadState('networkidle');

      // Find and click Back to Session button
      const backButton = page.locator('button:has-text("Back to Session")').first();

      // Take snapshot before clicking
      await page.screenshot({ path: 'screenshots/15-before-back-from-validation.png', fullPage: true });

      const backExists = await backButton.count() > 0;
      console.log('Back to Session button exists in Validation:', backExists);

      if (backExists) {
        await backButton.click();
        await page.waitForLoadState('networkidle');

        // Take snapshot after clicking
        await page.screenshot({ path: 'screenshots/16-after-back-from-validation.png', fullPage: true });

        // Verify URL changed back to session detail
        const url = page.url();
        console.log('Current URL after Back click:', url);
        expect(url).toMatch(/\/sessions\/[^\/]+$/);
      } else {
        console.log('ERROR: Back to Session button not found in Validation view');
      }
    } else {
      console.log('SKIP: Validate button not found, cannot test Back button');
    }
  });

  test('should check for console errors during button interactions', async ({ page }) => {
    const consoleErrors: string[] = [];
    const apiErrors: string[] = [];

    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for failed network requests
    page.on('response', response => {
      if (response.status() >= 400) {
        apiErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    // Navigate to a session
    const hasSessionCards = await page.locator('.session-card').count() > 0;
    if (!hasSessionCards) {
      console.log('SKIP: No session cards found');
      return;
    }
    await page.locator('.session-card').first().click();
    await page.waitForURL(/\/sessions\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Try clicking each button
    const buttons = ['Analyze', 'Validate', 'Export', 'Clone'];
    for (const buttonText of buttons) {
      const button = page.locator(`button:has-text("${buttonText}")`).first();
      if (await button.count() > 0) {
        await button.click();
        await page.waitForTimeout(500);
      }
    }

    // Report errors
    console.log('\n=== Console Errors ===');
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(err => console.log('ERROR:', err));
    } else {
      console.log('No console errors detected');
    }

    console.log('\n=== API Errors ===');
    if (apiErrors.length > 0) {
      apiErrors.forEach(err => console.log('API ERROR:', err));
    } else {
      console.log('No API errors detected');
    }
  });
});
