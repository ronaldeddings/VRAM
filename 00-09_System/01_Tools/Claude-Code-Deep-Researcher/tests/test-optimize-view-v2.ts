/**
 * Test script for Optimize view - Version 2 with better selectors
 */

import { chromium, Browser, Page } from 'playwright';

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testOptimizeView() {
  const browser: Browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log('\n=== Testing Optimize View (V2) ===\n');

  try {
    // Navigate
    console.log('1. Navigating to Optimize view...');
    await page.goto('http://localhost:3000/#/optimize');
    await delay(2000);

    // Test project select
    console.log('\n2. Testing Project Select...');
    const projectSelectWrapper = page.locator('text=Project').locator('..');
    await delay(500);

    // Find the select/dropdown
    const projectDropdown = projectSelectWrapper.locator('select, button, [role="combobox"]').first();
    const projectExists = await projectDropdown.count() > 0;
    console.log(`   ✓ Project dropdown exists: ${projectExists}`);

    if (projectExists) {
      const tagName = await projectDropdown.evaluate((el) => el.tagName);
      console.log(`   ✓ Element type: ${tagName}`);

      // Click to interact
      await projectDropdown.click();
      await delay(1500);

      // Look for visible options (could be in a portal/menu)
      const visibleOptions = await page.locator('[role="option"]:visible').count();
      console.log(`   ✓ Visible options: ${visibleOptions}`);

      if (visibleOptions > 0) {
        const firstOption = page.locator('[role="option"]:visible').first();
        const optionText = await firstOption.textContent();
        console.log(`   ✓ Selecting: ${optionText?.trim()}`);
        await firstOption.click();
        await delay(2000);
      } else {
        // Check if it's a native select
        const nativeOptions = await projectDropdown.locator('option').count();
        console.log(`   ✓ Native select options: ${nativeOptions}`);
        if (nativeOptions > 1) {
          await projectDropdown.selectOption({ index: 1 });
          await delay(2000);
        }
      }
    }

    // Test session select
    console.log('\n3. Testing Session Select...');
    const sessionSelectWrapper = page.locator('text=Session').locator('..');
    const sessionDropdown = sessionSelectWrapper.locator('select, button, [role="combobox"]').first();
    const sessionExists = await sessionDropdown.count() > 0;
    console.log(`   ✓ Session dropdown exists: ${sessionExists}`);

    if (sessionExists) {
      const isEnabled = await sessionDropdown.isEnabled();
      console.log(`   ✓ Session dropdown enabled: ${isEnabled}`);

      if (isEnabled) {
        await sessionDropdown.click();
        await delay(1500);

        const visibleOptions = await page.locator('[role="option"]:visible').count();
        console.log(`   ✓ Visible session options: ${visibleOptions}`);

        if (visibleOptions > 0) {
          const firstOption = page.locator('[role="option"]:visible').first();
          const optionText = await firstOption.textContent();
          console.log(`   ✓ Selecting: ${optionText?.trim()}`);
          await firstOption.click();
          await delay(2000);
        } else {
          const nativeOptions = await sessionDropdown.locator('option').count();
          console.log(`   ✓ Native select options: ${nativeOptions}`);
          if (nativeOptions > 1) {
            await sessionDropdown.selectOption({ index: 1 });
            await delay(2000);
          }
        }
      }
    }

    // Test strategy select
    console.log('\n4. Testing Strategy Select...');
    const strategySelectWrapper = page.locator('text=Strategy').locator('..');
    const strategyDropdown = strategySelectWrapper.locator('select, button, [role="combobox"]').first();
    const strategyExists = await strategyDropdown.count() > 0;
    console.log(`   ✓ Strategy dropdown exists: ${strategyExists}`);

    if (strategyExists) {
      const currentValue = await strategyDropdown.evaluate((el: any) => el.value || el.textContent);
      console.log(`   ✓ Current strategy: ${currentValue}`);
    }

    // Test max tokens input
    console.log('\n5. Testing Max Tokens Input...');
    const maxTokensWrapper = page.locator('text=Max Tokens').locator('..');
    const maxTokensInput = maxTokensWrapper.locator('input[type="number"], input[type="text"]').first();
    const maxTokensExists = await maxTokensInput.count() > 0;
    console.log(`   ✓ Max tokens input exists: ${maxTokensExists}`);

    if (maxTokensExists) {
      const currentValue = await maxTokensInput.inputValue();
      console.log(`   ✓ Current value: ${currentValue}`);

      await maxTokensInput.fill('150000');
      await delay(500);
      const newValue = await maxTokensInput.inputValue();
      console.log(`   ✓ Updated to: ${newValue}`);
    }

    // Test preserve tool call history checkbox
    console.log('\n6. Testing "Preserve tool call history" checkbox...');
    const preserveToolCallsLabel = page.locator('text=Preserve tool call history');
    const preserveToolCallsCheckbox = preserveToolCallsLabel.locator('..').locator('input[type="checkbox"]').first();
    const preserveToolCallsExists = await preserveToolCallsCheckbox.count() > 0;
    console.log(`   ✓ Checkbox exists: ${preserveToolCallsExists}`);

    if (preserveToolCallsExists) {
      const isChecked = await preserveToolCallsCheckbox.isChecked();
      console.log(`   ✓ Initially checked: ${isChecked}`);

      await preserveToolCallsCheckbox.click();
      await delay(500);
      const newChecked = await preserveToolCallsCheckbox.isChecked();
      console.log(`   ✓ After toggle: ${newChecked}`);
    }

    // Test preserve code snippets checkbox
    console.log('\n7. Testing "Preserve code snippets" checkbox...');
    const preserveCodeLabel = page.locator('text=Preserve code snippets');
    const preserveCodeCheckbox = preserveCodeLabel.locator('..').locator('input[type="checkbox"]').first();
    const preserveCodeExists = await preserveCodeCheckbox.count() > 0;
    console.log(`   ✓ Checkbox exists: ${preserveCodeExists}`);

    if (preserveCodeExists) {
      const isChecked = await preserveCodeCheckbox.isChecked();
      console.log(`   ✓ Initially checked: ${isChecked}`);

      await preserveCodeCheckbox.click();
      await delay(500);
      const newChecked = await preserveCodeCheckbox.isChecked();
      console.log(`   ✓ After toggle: ${newChecked}`);
    }

    // Test Optimize Context button
    console.log('\n8. Testing "Optimize Context" button...');
    const optimizeButton = page.locator('button:has-text("Optimize Context")');
    const buttonExists = await optimizeButton.count() > 0;
    console.log(`   ✓ Button exists: ${buttonExists}`);

    if (buttonExists) {
      const isEnabled = await optimizeButton.isEnabled();
      console.log(`   ✓ Button enabled: ${isEnabled}`);

      // Set up response listener
      let apiCalled = false;
      let apiSuccess = false;
      let responseData: any = null;

      page.on('response', async (response) => {
        if (response.url().includes('/api/optimize')) {
          apiCalled = true;
          console.log(`   ✓ API called: ${response.url()}`);
          console.log(`   ✓ Status: ${response.status()}`);

          if (response.status() === 200) {
            apiSuccess = true;
            try {
              responseData = await response.json();
              console.log(`   ✓ Response keys: ${Object.keys(responseData).join(', ')}`);
            } catch (e) {
              console.log(`   ✗ Failed to parse JSON: ${e}`);
            }
          } else {
            try {
              const errorText = await response.text();
              console.log(`   ✗ Error response: ${errorText}`);
            } catch (e) {
              console.log(`   ✗ Could not read error response`);
            }
          }
        }
      });

      // Click the button
      if (isEnabled) {
        console.log('\n9. Testing full workflow...');
        await optimizeButton.click();
        await delay(4000); // Wait for API call and results

        // Check for results
        const resultsSection = page.locator('text=Results').locator('..');
        const resultsText = await resultsSection.textContent();
        console.log(`   ✓ Results section content: ${resultsText?.substring(0, 200)}...`);

        // Look for specific metrics
        const hasMetrics = resultsText?.includes('tokens') || resultsText?.includes('reduction');
        console.log(`   ✓ Contains metrics: ${hasMetrics}`);

        if (apiCalled) {
          console.log(`   ✓ API was called: ${apiSuccess ? 'SUCCESS' : 'FAILED'}`);
          if (responseData) {
            console.log(`   ✓ Response data:`, JSON.stringify(responseData, null, 2).substring(0, 500));
          }
        } else {
          console.log(`   ✗ API was not called`);
        }
      }
    }

    // Final screenshot
    await page.screenshot({
      path: '/Users/ronaldeddings/Claude-Code-Deep-Researcher/optimize-view-test-v2.png',
      fullPage: true
    });
    console.log('\n✓ Screenshot saved');

    console.log('\n=== Test Complete ===\n');

  } catch (error) {
    console.error('\n✗ Test failed:', error);
    await page.screenshot({
      path: '/Users/ronaldeddings/Claude-Code-Deep-Researcher/optimize-view-error.png',
      fullPage: true
    });
  } finally {
    await delay(3000);
    await browser.close();
  }
}

testOptimizeView().catch(console.error);
