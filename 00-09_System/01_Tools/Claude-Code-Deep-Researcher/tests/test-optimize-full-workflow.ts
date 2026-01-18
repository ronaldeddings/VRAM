/**
 * Complete workflow test for Optimize view
 */

import { chromium, Browser, Page } from 'playwright';

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testFullWorkflow() {
  const browser: Browser = await chromium.launch({
    headless: false,
    slowMo: 800
  });

  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log('\n=== Complete Optimize Workflow Test ===\n');

  const results = {
    projectSelectWorks: false,
    sessionSelectWorks: false,
    sessionSelectEnabled: false,
    strategySelectWorks: false,
    maxTokensWorks: false,
    preserveToolCallsWorks: false,
    preserveCodeWorks: false,
    optimizeButtonWorks: false,
    apiCalled: false,
    apiSuccess: false,
    resultsDisplayed: false,
    errors: [] as string[]
  };

  try {
    console.log('1. Navigating to Optimize view...');
    await page.goto('http://localhost:3000/#/optimize');
    await delay(2000);

    // Set up API response listener
    let apiResponse: any = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/optimize')) {
        results.apiCalled = true;
        console.log(`   → API called: ${response.url()}`);
        console.log(`   → Status: ${response.status()}`);

        if (response.status() === 200) {
          results.apiSuccess = true;
          try {
            apiResponse = await response.json();
            console.log(`   → Response received successfully`);
          } catch (e) {
            console.log(`   ✗ Failed to parse response`);
          }
        } else {
          const errorText = await response.text();
          console.log(`   ✗ API error: ${errorText.substring(0, 200)}`);
          results.errors.push(`API error: ${errorText.substring(0, 100)}`);
        }
      }
    });

    // 1. Test Project Select
    console.log('\n2. Testing Project Select...');
    const projectSelect = page.locator('text=Project').locator('..').locator('select').first();
    const projectOptions = await projectSelect.locator('option').count();
    console.log(`   ✓ Found ${projectOptions} projects`);

    if (projectOptions > 1) {
      await projectSelect.selectOption({ index: 1 });
      results.projectSelectWorks = true;
      console.log(`   ✓ Selected first project`);
      await delay(2000); // Wait for sessions to load
    }

    // 2. Test Session Select (should now be enabled)
    console.log('\n3. Testing Session Select...');
    const sessionSelect = page.locator('text=Session').locator('..').locator('select').first();
    results.sessionSelectEnabled = await sessionSelect.isEnabled();
    console.log(`   ✓ Session select enabled: ${results.sessionSelectEnabled}`);

    if (results.sessionSelectEnabled) {
      const sessionOptions = await sessionSelect.locator('option').count();
      console.log(`   ✓ Found ${sessionOptions} sessions`);

      if (sessionOptions > 1) {
        // Select first non-placeholder option
        await sessionSelect.selectOption({ index: 1 });
        results.sessionSelectWorks = true;
        const selectedValue = await sessionSelect.inputValue();
        console.log(`   ✓ Selected session: ${selectedValue.substring(0, 50)}...`);
        await delay(1500);
      } else {
        console.log(`   ⚠ No sessions available for selected project`);
        results.errors.push('No sessions available');
      }
    }

    // 3. Test Strategy Select
    console.log('\n4. Testing Strategy Select...');
    const strategySelect = page.locator('text=Strategy').locator('..').locator('select').first();
    const strategies = await strategySelect.locator('option').allTextContents();
    console.log(`   ✓ Available strategies: ${strategies.join(', ')}`);

    await strategySelect.selectOption('minimal');
    await delay(500);
    let selectedStrategy = await strategySelect.inputValue();
    console.log(`   ✓ Selected: ${selectedStrategy}`);

    await strategySelect.selectOption('comprehensive');
    await delay(500);
    selectedStrategy = await strategySelect.inputValue();
    console.log(`   ✓ Changed to: ${selectedStrategy}`);
    results.strategySelectWorks = true;

    // 4. Test Max Tokens Input
    console.log('\n5. Testing Max Tokens Input...');
    const maxTokensInput = page.locator('text=Max Tokens').locator('..').locator('input').first();
    const originalValue = await maxTokensInput.inputValue();
    console.log(`   ✓ Original value: ${originalValue}`);

    await maxTokensInput.fill('100000');
    await delay(500);
    const newValue = await maxTokensInput.inputValue();
    console.log(`   ✓ Updated to: ${newValue}`);
    results.maxTokensWorks = (newValue === '100000');

    // 5. Test Preserve Tool Calls Checkbox
    console.log('\n6. Testing Preserve Tool Calls Checkbox...');
    const toolCallsCheckbox = page.locator('text=Preserve tool call history')
      .locator('..').locator('input[type="checkbox"]').first();
    const toolCallsInitial = await toolCallsCheckbox.isChecked();
    console.log(`   ✓ Initial state: ${toolCallsInitial}`);

    await toolCallsCheckbox.click();
    await delay(500);
    const toolCallsToggled = await toolCallsCheckbox.isChecked();
    console.log(`   ✓ After toggle: ${toolCallsToggled}`);
    results.preserveToolCallsWorks = (toolCallsInitial !== toolCallsToggled);

    // 6. Test Preserve Code Checkbox
    console.log('\n7. Testing Preserve Code Snippets Checkbox...');
    const codeCheckbox = page.locator('text=Preserve code snippets')
      .locator('..').locator('input[type="checkbox"]').first();
    const codeInitial = await codeCheckbox.isChecked();
    console.log(`   ✓ Initial state: ${codeInitial}`);

    await codeCheckbox.click();
    await delay(500);
    const codeToggled = await codeCheckbox.isChecked();
    console.log(`   ✓ After toggle: ${codeToggled}`);
    results.preserveCodeWorks = (codeInitial !== codeToggled);

    // 7. Test Optimize Button
    console.log('\n8. Testing Optimize Context Button...');
    const optimizeButton = page.locator('button:has-text("Optimize Context")');
    const buttonEnabled = await optimizeButton.isEnabled();
    console.log(`   ✓ Button enabled: ${buttonEnabled}`);

    if (buttonEnabled && results.sessionSelectWorks) {
      console.log('\n9. Executing Full Optimization Workflow...');
      await optimizeButton.click();
      results.optimizeButtonWorks = true;
      console.log(`   ✓ Clicked Optimize Context`);

      // Wait for optimization to complete
      await delay(5000);

      // Check for results
      const resultsDiv = page.locator('#opt-results').first();
      const resultsVisible = await resultsDiv.isVisible();
      console.log(`   ✓ Results visible: ${resultsVisible}`);

      if (resultsVisible) {
        const resultsText = await resultsDiv.textContent();
        console.log(`   ✓ Results content length: ${resultsText?.length || 0} chars`);

        // Check for specific metrics
        const hasTokens = resultsText?.includes('Token') || resultsText?.includes('token');
        const hasReduction = resultsText?.includes('Reduction') || resultsText?.includes('reduction');
        const hasContext = resultsText && resultsText.length > 100;

        console.log(`   ✓ Contains token info: ${hasTokens}`);
        console.log(`   ✓ Contains reduction info: ${hasReduction}`);
        console.log(`   ✓ Has substantive content: ${hasContext}`);

        results.resultsDisplayed = hasTokens && hasReduction && hasContext;

        if (apiResponse) {
          console.log('\n   API Response Summary:');
          console.log(`   - Tokens before: ${apiResponse.tokensBefore || 'N/A'}`);
          console.log(`   - Tokens after: ${apiResponse.tokensAfter || 'N/A'}`);
          console.log(`   - Reduction: ${apiResponse.reductionPercent || 'N/A'}%`);
          console.log(`   - Context length: ${apiResponse.distilledContext?.length || 0} chars`);
        }
      } else {
        // Check for empty state message
        const emptyStateText = await resultsDiv.textContent();
        console.log(`   ⚠ Results state: ${emptyStateText?.substring(0, 100)}`);
      }
    } else if (!results.sessionSelectWorks) {
      console.log(`   ⚠ Skipping optimization - no session selected`);
      results.errors.push('No session available to test optimization');
    }

    // Take final screenshot
    await page.screenshot({
      path: '/Users/ronaldeddings/Claude-Code-Deep-Researcher/optimize-workflow-complete.png',
      fullPage: true
    });
    console.log('\n✓ Screenshot saved');

  } catch (error) {
    console.error('\n✗ Test error:', error);
    results.errors.push(String(error));

    await page.screenshot({
      path: '/Users/ronaldeddings/Claude-Code-Deep-Researcher/optimize-workflow-error.png',
      fullPage: true
    });
  } finally {
    // Print summary
    console.log('\n=== Test Results Summary ===\n');
    console.log(`✓ Project Select: ${results.projectSelectWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Session Select Enabled: ${results.sessionSelectEnabled ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Session Select Works: ${results.sessionSelectWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Strategy Select: ${results.strategySelectWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Max Tokens Input: ${results.maxTokensWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Preserve Tool Calls: ${results.preserveToolCallsWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Preserve Code: ${results.preserveCodeWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ Optimize Button: ${results.optimizeButtonWorks ? 'PASS' : 'FAIL'}`);
    console.log(`✓ API Called: ${results.apiCalled ? 'YES' : 'NO'}`);
    console.log(`✓ API Success: ${results.apiSuccess ? 'YES' : 'NO'}`);
    console.log(`✓ Results Displayed: ${results.resultsDisplayed ? 'PASS' : 'FAIL'}`);

    if (results.errors.length > 0) {
      console.log('\n⚠ Errors encountered:');
      results.errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
    }

    const totalTests = 11;
    const passedTests = Object.values(results).filter(v => v === true).length;
    console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed\n`);

    await delay(3000);
    await browser.close();
  }
}

testFullWorkflow().catch(console.error);
