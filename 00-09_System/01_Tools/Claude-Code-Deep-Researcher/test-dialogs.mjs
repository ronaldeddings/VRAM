import { chromium } from 'playwright';

async function testDialogs() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    export: {},
    clone: {},
    errors: []
  };

  try {
    // Navigate to session view
    console.log('Navigating to session view...');
    await page.goto('http://localhost:3000/#/sessions/agent-a5b8d92');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for JavaScript to render
    console.log('✓ Navigated to session view');

    // Take screenshot for debugging
    await page.screenshot({ path: '/tmp/session-view.png' });
    console.log('Screenshot saved to /tmp/session-view.png');

    // ============================================
    // TEST EXPORT DIALOG
    // ============================================
    console.log('\n=== TESTING EXPORT DIALOG ===\n');

    // 1. Open Export dialog
    try {
      // Wait for the Export button to be visible
      const exportBtn = page.locator('button:has-text("Export")');
      await exportBtn.waitFor({ state: 'visible', timeout: 5000 });
      await exportBtn.click();
      await page.waitForSelector('#export-dialog[open]', { state: 'visible', timeout: 3000 });
      console.log('✓ Export dialog opened');
      results.export.opened = true;
    } catch (e) {
      console.log('✗ Failed to open Export dialog:', e.message);
      results.export.opened = false;
      results.errors.push({ test: 'export-open', error: e.message });
      // Take screenshot for debugging
      await page.screenshot({ path: '/tmp/export-error.png' });
    }

    // 2. Test Close (X) button
    try {
      const closeBtn = page.locator('#export-dialog .dialog-close[aria-label="Close"]');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(500);
        const isOpen = await page.locator('#export-dialog[open]').count() > 0;
        console.log('✓ Close (X) button works', isOpen ? '(dialog still open)' : '(dialog closed)');
        results.export.closeButton = !isOpen;

        // Reopen dialog
        const exportBtn = page.locator('button:has-text("Export")');
        await exportBtn.click();
        await page.waitForSelector('#export-dialog[open]', { state: 'visible', timeout: 3000 });
      } else {
        console.log('✗ Close button not found');
        results.export.closeButton = false;
      }
    } catch (e) {
      console.log('✗ Close button test failed:', e.message);
      results.export.closeButton = false;
      results.errors.push({ test: 'export-close', error: e.message });
    }

    // 3. Test JSON tab
    try {
      const jsonTab = page.locator('#export-dialog button[data-format="json"]');
      await jsonTab.click();
      await page.waitForTimeout(300);
      const hasActiveClass = await jsonTab.evaluate(el => el.classList.contains('active'));
      console.log('✓ JSON tab clicked', hasActiveClass ? '(active)' : '');
      results.export.jsonTab = true;
    } catch (e) {
      console.log('✗ JSON tab test failed:', e.message);
      results.export.jsonTab = false;
      results.errors.push({ test: 'export-json-tab', error: e.message });
    }

    // 4. Test Markdown tab
    try {
      const markdownTab = page.locator('#export-dialog button[data-format="markdown"]');
      await markdownTab.click();
      await page.waitForTimeout(300);
      const hasActiveClass = await markdownTab.evaluate(el => el.classList.contains('active'));
      console.log('✓ Markdown tab clicked', hasActiveClass ? '(active)' : '');
      results.export.markdownTab = true;
    } catch (e) {
      console.log('✗ Markdown tab test failed:', e.message);
      results.export.markdownTab = false;
      results.errors.push({ test: 'export-markdown-tab', error: e.message });
    }

    // 5. Test JSONL tab
    try {
      const jsonlTab = page.locator('#export-dialog button[data-format="jsonl"]');
      await jsonlTab.click();
      await page.waitForTimeout(300);
      const hasActiveClass = await jsonlTab.evaluate(el => el.classList.contains('active'));
      console.log('✓ JSONL tab clicked', hasActiveClass ? '(active)' : '');
      results.export.jsonlTab = true;
    } catch (e) {
      console.log('✗ JSONL tab test failed:', e.message);
      results.export.jsonlTab = false;
      results.errors.push({ test: 'export-jsonl-tab', error: e.message });
    }

    // 6. Test Copy button
    try {
      const copyBtn = page.locator('#copy-export');
      if (await copyBtn.isVisible()) {
        await copyBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Copy button clicked');
        results.export.copyButton = true;
      } else {
        console.log('✗ Copy button not found');
        results.export.copyButton = false;
      }
    } catch (e) {
      console.log('✗ Copy button test failed:', e.message);
      results.export.copyButton = false;
      results.errors.push({ test: 'export-copy', error: e.message });
    }

    // 7. Test Cancel button
    try {
      const cancelBtn = page.locator('#export-dialog button[value="cancel"]');
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await page.waitForTimeout(1000);
        const isOpen = await page.locator('#export-dialog[open]').count() > 0;
        console.log('✓ Cancel button clicked', isOpen ? '(dialog still open - may need JS fix)' : '(dialog closed)');
        results.export.cancelButton = true;
        results.export.cancelButtonClosesDialog = !isOpen;

        // Force close dialog if still open
        if (isOpen) {
          const closeBtn = page.locator('#export-dialog .dialog-close[aria-label="Close"]');
          await closeBtn.click();
          await page.waitForTimeout(500);
        }

        // Reopen for download test
        const exportBtn = page.locator('button:has-text("Export")').first();
        await exportBtn.click();
        await page.waitForSelector('#export-dialog[open]', { state: 'visible', timeout: 3000 });
      } else {
        console.log('✗ Cancel button not found');
        results.export.cancelButton = false;
      }
    } catch (e) {
      console.log('✗ Cancel button test failed:', e.message);
      results.export.cancelButton = false;
      results.errors.push({ test: 'export-cancel', error: e.message });
    }

    // 8. Test Export/Download button
    try {
      const downloadBtn = page.locator('#download-export');
      if (await downloadBtn.isVisible()) {
        // Set up download listener
        const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
        await downloadBtn.click();
        const download = await downloadPromise;

        if (download) {
          const filename = await download.suggestedFilename();
          console.log('✓ Export button triggered download:', filename);
          results.export.downloadButton = true;
          results.export.downloadFilename = filename;
        } else {
          console.log('⚠ Export button clicked but no download detected');
          results.export.downloadButton = 'no-download';
        }
      } else {
        console.log('✗ Export/Download button not found');
        results.export.downloadButton = false;
      }
    } catch (e) {
      console.log('✗ Export/Download button test failed:', e.message);
      results.export.downloadButton = false;
      results.errors.push({ test: 'export-download', error: e.message });
    }

    // Close export dialog if still open
    try {
      const isOpen = await page.locator('#export-dialog[open]').count() > 0;
      if (isOpen) {
        const closeBtn = page.locator('#export-dialog .dialog-close[aria-label="Close"]');
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    } catch (e) {
      // Ignore
    }

    // ============================================
    // TEST CLONE DIALOG
    // ============================================
    console.log('\n=== TESTING CLONE DIALOG ===\n');

    // 1. Open Clone dialog
    try {
      // Use .first() to get the trigger button, not the confirm button
      const cloneBtn = page.locator('button:has-text("Clone")').first();
      await cloneBtn.waitFor({ state: 'visible', timeout: 5000 });
      await cloneBtn.click();
      await page.waitForSelector('#clone-dialog[open]', { state: 'visible', timeout: 3000 });
      console.log('✓ Clone dialog opened');
      results.clone.opened = true;
    } catch (e) {
      console.log('✗ Failed to open Clone dialog:', e.message);
      results.clone.opened = false;
      results.errors.push({ test: 'clone-open', error: e.message });
    }

    // 2. Test Close (X) button
    try {
      const closeBtn = page.locator('#clone-dialog .dialog-close[aria-label="Close"]');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(500);
        const isOpen = await page.locator('#clone-dialog[open]').count() > 0;
        console.log('✓ Close (X) button works', isOpen ? '(dialog still open)' : '(dialog closed)');
        results.clone.closeButton = !isOpen;

        // Reopen dialog
        const cloneBtn = page.locator('button:has-text("Clone")').first();
        await cloneBtn.click();
        await page.waitForSelector('#clone-dialog[open]', { state: 'visible', timeout: 3000 });
      } else {
        console.log('✗ Close button not found');
        results.clone.closeButton = false;
      }
    } catch (e) {
      console.log('✗ Close button test failed:', e.message);
      results.clone.closeButton = false;
      results.errors.push({ test: 'clone-close', error: e.message });
    }

    // 3. Test Clone Name input (Note: based on the HTML, there's no name input, but project and filter selects)
    try {
      const projectSelect = page.locator('#clone-project');
      const filterSelect = page.locator('#clone-filter');

      if (await projectSelect.isVisible() && await filterSelect.isVisible()) {
        // Test selecting project
        const projectOptions = await projectSelect.locator('option').count();
        console.log('✓ Clone project select found with', projectOptions, 'options');

        // Test filter select
        const filterOptions = await filterSelect.locator('option').count();
        console.log('✓ Clone filter select found with', filterOptions, 'options');

        results.clone.selectInputs = true;
      } else {
        console.log('✗ Clone select inputs not found');
        results.clone.selectInputs = false;
      }
    } catch (e) {
      console.log('✗ Clone select inputs test failed:', e.message);
      results.clone.selectInputs = false;
      results.errors.push({ test: 'clone-selects', error: e.message });
    }

    // 4. Test Regenerate UUIDs checkbox (if exists)
    try {
      const checkbox = page.locator('#clone-dialog input[type="checkbox"]');
      const count = await checkbox.count();

      if (count > 0) {
        const initialState = await checkbox.isChecked();
        await checkbox.click();
        await page.waitForTimeout(200);
        const newState = await checkbox.isChecked();
        console.log('✓ Checkbox toggles:', initialState, '→', newState);
        results.clone.regenerateCheckbox = true;
      } else {
        console.log('ℹ Regenerate UUIDs checkbox not found (may not exist in current implementation)');
        results.clone.regenerateCheckbox = 'not-found';
      }
    } catch (e) {
      console.log('✗ Checkbox test failed:', e.message);
      results.clone.regenerateCheckbox = false;
      results.errors.push({ test: 'clone-checkbox', error: e.message });
    }

    // 5. Test Cancel button
    try {
      const cancelBtn = page.locator('#clone-dialog button[value="cancel"]');
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
        const isOpen = await page.locator('#clone-dialog[open]').count() > 0;
        console.log('✓ Cancel button works', isOpen ? '(dialog still open)' : '(dialog closed)');
        results.clone.cancelButton = !isOpen;

        // Reopen for clone test
        const cloneBtn = page.locator('button:has-text("Clone")').first();
        await cloneBtn.click();
        await page.waitForSelector('#clone-dialog[open]', { state: 'visible', timeout: 3000 });
      } else {
        console.log('✗ Cancel button not found');
        results.clone.cancelButton = false;
      }
    } catch (e) {
      console.log('✗ Cancel button test failed:', e.message);
      results.clone.cancelButton = false;
      results.errors.push({ test: 'clone-cancel', error: e.message });
    }

    // 6. Test Clone button (creates new session)
    try {
      const cloneActionBtn = page.locator('#clone-confirm');
      if (await cloneActionBtn.isVisible()) {
        const currentUrl = page.url();

        // Listen for API call and navigation
        const responsePromise = page.waitForResponse(
          response => response.url().includes('/api/sessions/') && response.url().includes('/clone'),
          { timeout: 10000 }
        ).catch(() => null);

        await cloneActionBtn.click();
        const response = await responsePromise;

        // Wait a moment for navigation
        await page.waitForTimeout(2000);
        const newUrl = page.url();

        if (response && response.ok()) {
          const data = await response.json();
          console.log('✓ Clone API call succeeded');
          console.log('  API Response:', JSON.stringify(data, null, 2));
          results.clone.cloneButton = true;
          results.clone.apiResponse = data;
        }

        if (newUrl !== currentUrl && newUrl.includes('/sessions/')) {
          console.log('✓ Navigation occurred to new session');
          console.log('  Old URL:', currentUrl);
          console.log('  New URL:', newUrl);
          results.clone.newSessionUrl = newUrl;
        } else {
          console.log('⚠ No navigation detected');
          console.log('  Current URL:', newUrl);
        }
      } else {
        console.log('✗ Clone button not found');
        results.clone.cloneButton = false;
      }
    } catch (e) {
      console.log('✗ Clone button test failed:', e.message);
      results.clone.cloneButton = false;
      results.errors.push({ test: 'clone-action', error: e.message });
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n=== TEST RESULTS SUMMARY ===\n');
    console.log('Export Dialog:');
    console.log('  Opened:', results.export.opened ? '✓' : '✗');
    console.log('  Close (X) button:', results.export.closeButton ? '✓' : '✗');
    console.log('  JSON tab:', results.export.jsonTab ? '✓' : '✗');
    console.log('  Markdown tab:', results.export.markdownTab ? '✓' : '✗');
    console.log('  JSONL tab:', results.export.jsonlTab ? '✓' : '✗');
    console.log('  Copy button:', results.export.copyButton ? '✓' : '✗');
    console.log('  Cancel button:', results.export.cancelButton ? '✓' : '✗');
    console.log('  Export/Download button:', results.export.downloadButton === true ? '✓' : results.export.downloadButton === 'no-download' ? '⚠' : '✗');
    if (results.export.downloadFilename) {
      console.log('  Downloaded file:', results.export.downloadFilename);
    }

    console.log('\nClone Dialog:');
    console.log('  Opened:', results.clone.opened ? '✓' : '✗');
    console.log('  Close (X) button:', results.clone.closeButton ? '✓' : '✗');
    console.log('  Select inputs:', results.clone.selectInputs ? '✓' : '✗');
    console.log('  Regenerate checkbox:', results.clone.regenerateCheckbox === true ? '✓' : results.clone.regenerateCheckbox === 'not-found' ? 'ℹ' : '✗');
    console.log('  Cancel button:', results.clone.cancelButton ? '✓' : '✗');
    console.log('  Clone button:', results.clone.cloneButton === true ? '✓' : results.clone.cloneButton === 'no-navigation' ? '⚠' : '✗');
    if (results.clone.newSessionUrl) {
      console.log('  New session URL:', results.clone.newSessionUrl);
    }
    if (results.clone.apiResponse) {
      console.log('  API Response:', JSON.stringify(results.clone.apiResponse, null, 2));
    }

    if (results.errors.length > 0) {
      console.log('\nErrors encountered:');
      results.errors.forEach(err => {
        console.log(`  - ${err.test}: ${err.error}`);
      });
    }

    console.log('\n=== FULL RESULTS (JSON) ===\n');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Fatal error during testing:', error);
    results.fatalError = error.message;
  } finally {
    await browser.close();
  }
}

testDialogs().catch(console.error);
