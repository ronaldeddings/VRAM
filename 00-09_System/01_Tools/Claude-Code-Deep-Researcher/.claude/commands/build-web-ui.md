# Build Web UI - Complete Feature Implementation & Validation

Implement all Web UI features from the implementation plan with full end-to-end testing using Chrome DevTools MCP.

## CRITICAL INSTRUCTIONS

**NEVER mark something as "verified" without implementing it first.** If a feature needs to work, you must:
1. Read the existing code
2. Implement the fix/feature completely
3. Test it end-to-end using Chrome DevTools MCP
4. Walk through the ENTIRE user flow from start to finish
5. Only then mark it as complete

**DO NOT skip steps. DO NOT assume code works without testing.**

---

## MANDATORY: Initialize Progress Tracking

**BEFORE doing ANY work, you MUST execute these steps:**

### Step 1: Create Todo List
Use TodoWrite to create all 11 fix tasks:

```
TodoWrite([
  { content: "Fix 1: Validate API method name (api.ts:405-406)", status: "pending", activeForm: "Fixing validate API method" },
  { content: "Fix 2: Build Session messages not saved", status: "pending", activeForm: "Fixing message persistence" },
  { content: "Fix 3: Templates route context passing", status: "pending", activeForm: "Fixing template routing" },
  { content: "Fix 4: Create template data files", status: "pending", activeForm: "Creating template files" },
  { content: "Fix 5: Validation checkboxes functional", status: "pending", activeForm: "Fixing validation checkboxes" },
  { content: "Fix 6-7: Add data-testid to dialogs", status: "pending", activeForm: "Adding test selectors" },
  { content: "Fix 8: Validate button selector ambiguity", status: "pending", activeForm: "Fixing button selectors" },
  { content: "Fix 9: Dialog cancel buttons", status: "pending", activeForm: "Fixing cancel buttons" },
  { content: "Fix 10: Export download trigger", status: "pending", activeForm: "Fixing export download" },
  { content: "Fix 11: Clone button creates sessions", status: "pending", activeForm: "Fixing clone functionality" },
  { content: "E2E: Full validation suite", status: "pending", activeForm: "Running E2E tests" }
])
```

### Step 2: Verify Server Running
Before testing, ensure the web server is running:
```bash
# Check if server is running on port 3000
curl -s http://localhost:3000 > /dev/null && echo "Server running" || echo "Server NOT running - start with: bun run src/web/server.ts"
```

If server is not running, start it in background before proceeding.

### Step 3: Connect Chrome DevTools
Use `mcp__chrome-devtools__list_pages` to verify browser connection. If no pages, use `mcp__chrome-devtools__new_page` to navigate to `http://localhost:3000`.

---

## GATE RULES

**MUST NOT proceed to next fix until:**
1. ✅ Current fix code is implemented
2. ✅ TodoWrite updated: current fix → "completed"
3. ✅ Chrome DevTools test PASSED
4. ✅ No console errors
5. ✅ Screenshot captured as evidence

**If ANY test fails:**
1. Debug and fix the issue
2. Re-test until passing
3. Only then proceed

---

## Phase 1: Critical Bug Fixes

Execute these fixes in order. After EACH fix, test with Chrome DevTools MCP.

### Fix 1: Validate API Method Name (api.ts:405-406)

**Implementation:**
1. Read `src/web/routes/api.ts` lines 400-420
2. Change `ctx.validator.validate(entries)` to `await ctx.validator.validateConversation(entries)`
3. Ensure the function is async if not already

**Test with Chrome DevTools:**
1. Navigate to `http://localhost:3000/#/validate`
2. Select a project and session
3. Click "Validate Session" button
4. Verify results appear (no errors in console)
5. Take screenshot as evidence

---

### Fix 2: Build Session Messages Not Saved (api.ts POST handler)

**Implementation:**
1. Read `src/web/routes/api.ts` - find `POST /api/sessions` handler
2. Locate where `messages` array is received but not processed
3. Add code to iterate messages and call appropriate builder methods:
   ```typescript
   if (messages && Array.isArray(messages)) {
     for (const msg of messages) {
       if (msg.type === 'user') {
         // Add user message to session
       } else if (msg.type === 'assistant') {
         // Add assistant message to session
       }
     }
   }
   ```
4. Ensure messages are written to JSONL file

**Test with Chrome DevTools:**
1. Navigate to `http://localhost:3000/#/build`
2. Select a project
3. Add system prompt
4. Add a user message using "Add Message" button
5. Add an assistant message
6. Click "Create Session"
7. Navigate to the created session
8. Verify ALL messages appear (not just system prompt)
9. Take screenshot as evidence

---

### Fix 3: Templates Route Context Passing (app.js:62)

**Implementation:**
1. Read `src/web/public/js/app.js` lines 50-76
2. Change `.on('/build', () => this.showBuildSession())` to `.on('/build', (ctx) => this.showBuildSession(ctx))`
3. Update `showBuildSession(ctx)` method to accept and use context parameter
4. Extract query parameters: `const templateId = ctx?.query?.template || new URLSearchParams(window.location.hash.split('?')[1]).get('template')`
5. If templateId exists, load template data and pre-populate form

**Test with Chrome DevTools:**
1. Navigate to `http://localhost:3000/#/templates`
2. Click on "Q&A Session" template card
3. Verify URL changes to `#/build?template=qa`
4. Verify Build form is pre-populated with template data
5. Take screenshot as evidence

---

### Fix 4: Create Template Data Files

**Implementation:**
1. Create directory `src/web/data/templates/`
2. Create 6 template JSON files with pre-defined conversation structures:

`qa.json`:
```json
{
  "id": "qa",
  "name": "Q&A Session",
  "description": "Simple question and answer format",
  "systemPrompt": "You are a helpful assistant. Answer questions clearly and concisely.",
  "messages": [
    { "type": "user", "content": "{{USER_QUESTION}}" }
  ]
}
```

Create similar files for: `code-review.json`, `multi-turn.json`, `tool-session.json`, `agent-handoff.json`, `debugging.json`

3. Add API endpoint or static file serving for template data
4. Update `showBuildSession()` to fetch and apply template data

**Test with Chrome DevTools:**
1. Navigate to `http://localhost:3000/#/templates`
2. Click each template card
3. Verify each navigates to Build with correct pre-population
4. Take screenshots of all 6 templates applied

---

### Fix 5: Validation Checkboxes Functional (app.js)

**Implementation:**
1. Find `showValidate()` method in app.js
2. Locate checkbox elements for validation layers
3. Find the form submit handler (`runValidation` or similar)
4. Add code to read checkbox states:
   ```javascript
   const layers = {
     schema: document.getElementById('validate-schema')?.checked ?? true,
     relationships: document.getElementById('validate-relationships')?.checked ?? true,
     toolUse: document.getElementById('validate-tool-use')?.checked ?? true,
     completeness: document.getElementById('validate-completeness')?.checked ?? true
   };
   ```
5. Pass layers to API call
6. Update API endpoint to accept and use layers parameter

**Test with Chrome DevTools:**
1. Navigate to `http://localhost:3000/#/validate`
2. Uncheck "Schema Validation" checkbox
3. Click "Validate Session"
4. Verify API request only includes selected layers
5. Toggle different combinations and verify behavior
6. Take screenshots as evidence

---

### Fix 6-7: Add data-testid Attributes to Dialogs

**Implementation:**
1. Find export dialog HTML in app.js (search for `export-dialog`)
2. Add data-testid attributes to all interactive elements
3. Find clone dialog HTML in app.js
4. Add data-testid attributes to all interactive elements

```html
<!-- Export Dialog -->
<dialog id="export-dialog" data-testid="export-dialog">
  <button data-testid="export-close" aria-label="Close">×</button>
  <button data-testid="export-json" data-format="json">JSON</button>
  <button data-testid="export-markdown" data-format="markdown">Markdown</button>
  <button data-testid="export-jsonl" data-format="jsonl">JSONL</button>
  <button data-testid="export-copy" id="copy-export">Copy</button>
  <button data-testid="export-cancel" value="cancel">Cancel</button>
  <button data-testid="export-download" id="download-export">Export</button>
</dialog>

<!-- Clone Dialog -->
<dialog id="clone-dialog" data-testid="clone-dialog">
  <button data-testid="clone-close" aria-label="Close">×</button>
  <input type="text" data-testid="clone-name-input" id="clone-name" />
  <input type="checkbox" data-testid="clone-regenerate-uuids" id="regenerate-uuids" />
  <button data-testid="clone-cancel" value="cancel">Cancel</button>
  <button data-testid="clone-submit" id="clone-confirm">Clone</button>
</dialog>
```

**Test with Chrome DevTools:**
1. Navigate to a session view
2. Click Export button
3. Take snapshot and verify data-testid attributes present
4. Click Clone button
5. Take snapshot and verify data-testid attributes present

---

### Fix 8: Validate Button Selector Ambiguity

**Implementation:**
1. Find session action buttons in `showSession()` method
2. Add unique classes to session-specific action buttons:
   ```javascript
   <a href="#/sessions/${sessionId}/validate"
      class="btn btn-secondary session-action-validate"
      data-testid="session-validate-button">
      Validate
   </a>
   ```
3. Ensure the session-specific validate is distinct from global nav validate

**Test with Chrome DevTools:**
1. Navigate to a session detail view
2. Take snapshot to identify all validate links
3. Click the session-specific Validate button
4. Verify URL is `/sessions/{id}/validate` (NOT just `/validate`)
5. Take screenshot as evidence

---

### Fix 9: Dialog Cancel Buttons

**Implementation:**
1. Find export dialog event listeners in app.js
2. Locate cancel button handler (or add if missing):
   ```javascript
   const exportDialog = document.getElementById('export-dialog');
   exportDialog.querySelector('[value="cancel"]').addEventListener('click', (e) => {
     e.preventDefault();
     exportDialog.close();
   });
   ```
3. Do the same for clone dialog
4. Ensure both dialogs close when Cancel is clicked

**Test with Chrome DevTools:**
1. Navigate to a session
2. Click Export button to open dialog
3. Click Cancel button
4. Verify dialog closes
5. Repeat for Clone dialog
6. Take screenshots before/after

---

### Fix 10: Export Download Trigger

**Implementation:**
1. Find export download handler in app.js
2. Verify/fix the download logic:
   ```javascript
   async downloadExport(sessionId, format) {
     try {
       const response = await fetch(`/api/sessions/${sessionId}/export?format=${format}`);
       if (!response.ok) throw new Error('Export failed');

       const blob = await response.blob();
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `session-${sessionId}.${format}`;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);

       this.showToast('Export downloaded successfully');
     } catch (error) {
       this.showToast('Export failed: ' + error.message, 'error');
     }
   }
   ```
3. Ensure the download button calls this method with correct parameters

**Test with Chrome DevTools:**
1. Navigate to a session
2. Click Export button
3. Select JSON format
4. Click Export/Download button
5. Verify file downloads (check Downloads panel or wait for download event)
6. Check file contains valid session data
7. Repeat for Markdown and JSONL formats
8. Take screenshots as evidence

---

### Fix 11: Clone Button Creates Sessions

**Implementation:**
1. Find clone confirm button handler in app.js
2. Verify/fix the clone logic:
   ```javascript
   async cloneSession(sessionId) {
     const nameInput = document.getElementById('clone-name');
     const regenerateCheckbox = document.getElementById('regenerate-uuids');

     const name = nameInput?.value || `Clone of ${sessionId}`;
     const regenerateUuids = regenerateCheckbox?.checked ?? true;

     try {
       const response = await fetch(`/api/sessions/${sessionId}/clone`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name, regenerateUuids })
       });

       if (!response.ok) throw new Error('Clone failed');

       const { sessionId: newSessionId } = await response.json();

       // Close dialog
       document.getElementById('clone-dialog').close();

       // Navigate to new session
       window.location.hash = `/sessions/${newSessionId}`;

       this.showToast('Session cloned successfully');
     } catch (error) {
       this.showToast('Clone failed: ' + error.message, 'error');
     }
   }
   ```
3. Ensure clone confirm button calls this method
4. Verify API endpoint exists and works

**Test with Chrome DevTools:**
1. Navigate to a session
2. Note the session ID
3. Click Clone button
4. Enter a name "Test Clone"
5. Click Clone confirm button
6. Verify dialog closes
7. Verify navigation to new session URL
8. Verify new session has different ID
9. Verify new session contains same conversation data
10. Take screenshots as evidence

---

## Phase 2: End-to-End Feature Validation

After implementing ALL fixes, perform complete end-to-end testing of each major feature.

### E2E Test 1: Full Session Lifecycle

1. Start at dashboard (`#/`)
2. Click "Build Session" in sidebar
3. Select a project
4. Enter system prompt
5. Add 2 user messages and 2 assistant messages
6. Create session
7. Verify session appears in dashboard
8. Click session to view
9. Verify all messages display correctly
10. Click Analyze - verify analysis results
11. Click Validate - verify validation results
12. Export as JSON - verify download
13. Clone session - verify new session created

### E2E Test 2: Templates Flow

1. Navigate to Templates (`#/templates`)
2. Click each template
3. Verify each pre-populates Build form correctly
4. Create session from template
5. Verify session created with template content

### E2E Test 3: Optimize Flow

1. Navigate to Optimize (`#/optimize`)
2. Select project and session
3. Configure optimization options
4. Run optimization
5. Verify results display

### E2E Test 4: Validate Flow

1. Navigate to Validate (`#/validate`)
2. Select project and session
3. Toggle individual validation layers
4. Run validation
5. Verify only selected layers run
6. Verify results display correctly

---

## Chrome DevTools MCP Testing Protocol

For EVERY feature, execute this protocol:

1. **Take Initial Snapshot**: `mcp__chrome-devtools__take_snapshot`
2. **Navigate**: Use click/fill tools to interact
3. **Capture Network**: Monitor API calls with `mcp__chrome-devtools__list_network_requests`
4. **Check Console**: Verify no errors with `mcp__chrome-devtools__list_console_messages`
5. **Take Final Snapshot**: Document end state
6. **Screenshot**: `mcp__chrome-devtools__take_screenshot` for visual evidence

---

## Completion Criteria

A feature is ONLY complete when:
- [ ] Code implementation is done
- [ ] No TypeScript/lint errors
- [ ] Feature works in browser (tested with DevTools MCP)
- [ ] Full user flow tested start-to-finish
- [ ] No console errors during testing
- [ ] API calls succeed (200 status)
- [ ] Screenshot evidence captured
- [ ] **TodoWrite updated to mark task "completed"**

**DO NOT proceed to next feature until current feature passes ALL criteria.**

---

## FINAL CHECKPOINT

**After completing ALL fixes and E2E tests:**

1. **Verify Todo List**: Run TodoRead to confirm ALL 11 items show "completed"
2. **Generate Summary Report**: List each fix with:
   - Implementation changes made
   - Test results (pass/fail)
   - Screenshot file references
3. **Run Final Validation**:
   ```bash
   bun run typecheck
   bun test
   ```
4. **Report to User**: Present complete summary with evidence

**The task is NOT complete until ALL todos show "completed" status.**

---

## Arguments

$ARGUMENTS

- `--fix N` - Fix only issue number N (still creates full todo list but only executes specified fix)
- `--phase N` - Run only phase N
- `--skip-tests` - Skip DevTools testing (NOT RECOMMENDED - defeats purpose)
- `--verbose` - Show detailed progress
- `--dry-run` - Show what would be done without making changes
