/**
 * Test script for Optimize view in Claude Code Conversation Workbench
 * Tests all UI elements and the full optimization workflow
 */

import { chromium, Browser, Page } from 'playwright';

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testOptimizeView() {
  const browser: Browser = await chromium.launch({
    headless: false,
    slowMo: 500 // Slow down actions for visibility
  });

  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log('\n=== Testing Optimize View ===\n');

  try {
    // Navigate to the Optimize view
    console.log('1. Navigating to Optimize view...');
    await page.goto('http://localhost:3000/#/optimize');
    await delay(2000);

    // Test 1: Project Select Dropdown
    console.log('\n2. Testing Project Select dropdown...');
    const projectSelect = page.locator('text=Project').locator('..').locator('select, [role="combobox"]').first();
    const projectExists = await projectSelect.count() > 0;
    console.log(`   ✓ Project select exists: ${projectExists}`);

    if (projectExists) {
      // Click to open dropdown (for custom select components)
      await projectSelect.click();
      await delay(1000);

      // Look for options in dropdown
      const projectOptions = await page.locator('[role="option"]').count();
      console.log(`   ✓ Project options count: ${projectOptions}`);

      if (projectOptions > 0) {
        // Select the first real project
        const firstOption = page.locator('[role="option"]').first();
        const firstProjectValue = await firstOption.textContent();
        console.log(`   ✓ Selecting first project: ${firstProjectValue}`);
        await firstOption.click();
        await delay(1500);
      } else {
        // Try native select element
        const nativeOptions = await projectSelect.locator('option').count();
        if (nativeOptions > 1) {
          console.log(`   ✓ Using native select with ${nativeOptions} options`);
          await projectSelect.selectOption({ index: 1 });
          await delay(1500);
        }
      }
    }

    // Test 2: Session Select Dropdown
    console.log('\n3. Testing Session Select dropdown...');
    const sessionSelect = page.locator('select#sessionSelect');
    const sessionExists = await sessionSelect.count() > 0;
    console.log(`   ✓ Session select exists: ${sessionExists}`);

    if (sessionExists) {
      const isSessionEnabled = await sessionSelect.isEnabled();
      console.log(`   ✓ Session select enabled: ${isSessionEnabled}`);

      if (isSessionEnabled) {
        const sessionOptions = await sessionSelect.locator('option').count();
        console.log(`   ✓ Session options count: ${sessionOptions}`);

        if (sessionOptions > 1) {
          const firstSessionValue = await sessionSelect.locator('option').nth(1).getAttribute('value');
          console.log(`   ✓ Selecting first session: ${firstSessionValue}`);
          await sessionSelect.selectOption({ index: 1 });
          await delay(1500);
        }
      }
    }

    // Test 3: Strategy Select Dropdown
    console.log('\n4. Testing Strategy Select dropdown...');
    const strategySelect = page.locator('select#strategySelect');
    const strategyExists = await strategySelect.count() > 0;
    console.log(`   ✓ Strategy select exists: ${strategyExists}`);

    if (strategyExists) {
      const strategyOptions = await strategySelect.locator('option').allTextContents();
      console.log(`   ✓ Strategy options: ${strategyOptions.join(', ')}`);

      // Test selecting different strategies
      await strategySelect.selectOption('comprehensive');
      await delay(500);
      console.log(`   ✓ Selected 'comprehensive' strategy`);
    }

    // Test 4: Max Tokens Input
    console.log('\n5. Testing Max Tokens input...');
    const maxTokensInput = page.locator('input#maxTokens');
    const maxTokensExists = await maxTokensInput.count() > 0;
    console.log(`   ✓ Max tokens input exists: ${maxTokensExists}`);

    if (maxTokensExists) {
      const currentValue = await maxTokensInput.inputValue();
      console.log(`   ✓ Current max tokens value: ${currentValue}`);

      await maxTokensInput.fill('150000');
      await delay(500);
      const newValue = await maxTokensInput.inputValue();
      console.log(`   ✓ Updated max tokens to: ${newValue}`);
    }

    // Test 5: Preserve Tool Call History Checkbox
    console.log('\n6. Testing "Preserve tool call history" checkbox...');
    const preserveToolCallsCheckbox = page.locator('input#preserveToolCalls');
    const preserveToolCallsExists = await preserveToolCallsCheckbox.count() > 0;
    console.log(`   ✓ Preserve tool calls checkbox exists: ${preserveToolCallsExists}`);

    if (preserveToolCallsExists) {
      const isChecked = await preserveToolCallsCheckbox.isChecked();
      console.log(`   ✓ Initially checked: ${isChecked}`);

      await preserveToolCallsCheckbox.click();
      await delay(500);
      const newCheckedState = await preserveToolCallsCheckbox.isChecked();
      console.log(`   ✓ After toggle: ${newCheckedState}`);
    }

    // Test 6: Preserve Code Snippets Checkbox
    console.log('\n7. Testing "Preserve code snippets" checkbox...');
    const preserveCodeCheckbox = page.locator('input#preserveCode');
    const preserveCodeExists = await preserveCodeCheckbox.count() > 0;
    console.log(`   ✓ Preserve code checkbox exists: ${preserveCodeExists}`);

    if (preserveCodeExists) {
      const isChecked = await preserveCodeCheckbox.isChecked();
      console.log(`   ✓ Initially checked: ${isChecked}`);

      await preserveCodeCheckbox.click();
      await delay(500);
      const newCheckedState = await preserveCodeCheckbox.isChecked();
      console.log(`   ✓ After toggle: ${newCheckedState}`);
    }

    // Test 7: Optimize Context Button
    console.log('\n8. Testing "Optimize Context" button...');
    const optimizeButton = page.locator('button:has-text("Optimize Context")');
    const optimizeButtonExists = await optimizeButton.count() > 0;
    console.log(`   ✓ Optimize button exists: ${optimizeButtonExists}`);

    if (optimizeButtonExists) {
      const isEnabled = await optimizeButton.isEnabled();
      console.log(`   ✓ Optimize button enabled: ${isEnabled}`);

      if (isEnabled) {
        console.log('\n9. Testing full optimization workflow...');

        // Set up network listener to capture API calls
        page.on('response', async (response) => {
          if (response.url().includes('/api/optimize')) {
            console.log(`   ✓ API call to: ${response.url()}`);
            console.log(`   ✓ Response status: ${response.status()}`);

            if (response.status() === 200) {
              try {
                const json = await response.json();
                console.log(`   ✓ Response received with keys: ${Object.keys(json).join(', ')}`);
              } catch (e) {
                console.log(`   ✗ Failed to parse response JSON: ${e}`);
              }
            } else {
              const text = await response.text();
              console.log(`   ✗ Error response: ${text}`);
            }
          }
        });

        // Click optimize button
        await optimizeButton.click();
        console.log(`   ✓ Clicked Optimize Context button`);

        // Wait for results to appear
        await delay(3000);

        // Check for results display
        const resultsContainer = page.locator('#optimizationResults');
        const resultsVisible = await resultsContainer.isVisible().catch(() => false);
        console.log(`   ✓ Results container visible: ${resultsVisible}`);

        if (resultsVisible) {
          // Check for specific result elements
          const tokensBefore = page.locator('text=/Tokens Before:/');
          const tokensAfter = page.locator('text=/Tokens After:/');
          const reduction = page.locator('text=/Reduction:/');

          const hasTokensBefore = await tokensBefore.count() > 0;
          const hasTokensAfter = await tokensAfter.count() > 0;
          const hasReduction = await reduction.count() > 0;

          console.log(`   ✓ Tokens Before displayed: ${hasTokensBefore}`);
          console.log(`   ✓ Tokens After displayed: ${hasTokensAfter}`);
          console.log(`   ✓ Reduction % displayed: ${hasReduction}`);

          // Get the distilled context if visible
          const distilledContext = page.locator('#distilledContext');
          const hasDistilledContext = await distilledContext.count() > 0;
          console.log(`   ✓ Distilled context displayed: ${hasDistilledContext}`);

          if (hasDistilledContext) {
            const contextText = await distilledContext.textContent();
            console.log(`   ✓ Distilled context length: ${contextText?.length || 0} characters`);
          }
        }
      } else {
        console.log(`   ✗ Optimize button is disabled - check if project and session are selected`);
      }
    }

    // Take a screenshot of the final state
    await page.screenshot({ path: '/Users/ronaldeddings/Claude-Code-Deep-Researcher/optimize-view-test.png', fullPage: true });
    console.log('\n✓ Screenshot saved to optimize-view-test.png');

    console.log('\n=== Test Complete ===\n');

  } catch (error) {
    console.error('\n✗ Test failed with error:', error);
  } finally {
    await delay(2000);
    await browser.close();
  }
}

// Run the test
testOptimizeView().catch(console.error);
