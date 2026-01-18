# Implementation Plan 9: Revolutionary Web UI for Claude Code Deep Researcher

## Product Vision

**Claude Code Conversation Workbench** - A powerful Web UI for managing, analyzing, and engineering Claude Code JSONL conversation files with Claude Agent SDK integration.

### What This App Does

This is a **JSONL Conversation Workbench** that enables developers and AI engineers to:

1. **OBSERVE** - Visually inspect and analyze existing Claude Code conversation files
2. **DUPLICATE** - Clone and fork sessions for experimentation
3. **OPTIMIZE** - Reduce context while preserving conversation quality (multi-agent optimization)
4. **MODIFY** - Edit individual JSONL entries with validation
5. **BUILD** - Create complete JSONL conversation files from scratch
6. **FABRICATE** - Programmatically generate custom conversations for testing/training
7. **START/RESUME** - Use Claude Agent SDK to start new sessions or resume existing ones

### Why This Matters

Claude Code stores conversations as JSONL files in `~/.claude/projects/`. This tool provides:
- **Session Engineering**: Craft perfect conversation context for AI agents
- **Context Prebaking**: Build optimized starting points for complex workflows
- **Debugging**: Understand what happened in failed or unexpected sessions
- **Training Data**: Generate conversation data for fine-tuning or testing
- **Session Recovery**: Resume interrupted sessions with modified context

### Target Users

- **AI Engineers** building Claude Code integrations
- **Developers** debugging Claude Code sessions
- **Researchers** analyzing AI conversation patterns
- **Teams** sharing and collaborating on conversation templates

---

## Executive Summary

Transform the CLI-only Claude Code Deep Researcher into a stunning, modern Web UI using Bun.serve with cutting-edge HTML, CSS, and JavaScript features. This plan leverages the latest browser technologies that work across **Chrome, Safari, iOS Safari, and Brave** (Chromium-based) with 85%+ global support.

---

## Core Capabilities (For AI Agent Implementation)

### Capability 1: OBSERVE (Read-Only Analysis)
**Purpose**: Visually inspect and analyze existing JSONL conversation files

**Features**:
- Session browser with project grouping
- Entry-by-entry timeline visualization
- Token usage analytics and cost estimation
- Tool usage frequency and patterns
- 4-layer validation (schema, relationships, tool usage, completeness)
- Conversation tree visualization with parent-child relationships

**Existing Services to Use**:
- `JSONLParser.parseFile()` - Stream entries from JSONL files
- `ConversationBuilder.buildConversationChain()` - Build tree structure
- `StepAnalyzer.analyzeConversation()` - Comprehensive analysis
- `ConversationValidator.validate()` - 4-layer validation

### Capability 2: DUPLICATE (Clone Sessions)
**Purpose**: Create copies of sessions for experimentation

**Features**:
- Clone entire session to new file
- Clone with modifications (rename, filter entries)
- Clone subset of entries (time range, entry types)
- Export to different locations

**New Services Needed**:
- `SessionCloner.clone(sessionId, options)` - Clone session files
- `SessionCloner.cloneWithFilter(sessionId, predicate)` - Filtered cloning

### Capability 3: OPTIMIZE (Context Reduction)
**Purpose**: Reduce token usage while preserving conversation quality

**Features**:
- Automatic context distillation
- Multi-agent optimization strategies
- Token budget targeting
- Quality score preservation
- Before/after comparison view

**Existing Services to Use**:
- `ContextDistiller.distillContext()` - Distill conversation context
- `MultiAgentOptimizer.optimize()` - Multi-agent optimization

### Capability 4: MODIFY (Edit Entries)
**Purpose**: Edit individual JSONL entries with validation

**Features**:
- Visual entry editor with syntax highlighting
- JSON schema validation on edit
- Relationship integrity checking
- Undo/redo history
- Diff view before saving
- Batch modifications

**New Services Needed**:
- `EntryEditor.updateEntry(sessionId, entryIndex, newEntry)` - Update single entry
- `EntryEditor.insertEntry(sessionId, index, entry)` - Insert new entry
- `EntryEditor.deleteEntry(sessionId, index)` - Delete entry
- `EntryEditor.moveEntry(sessionId, fromIndex, toIndex)` - Reorder entries

### Capability 5: BUILD (Create from Scratch)
**Purpose**: Create complete JSONL conversation files from scratch

**Features**:
- Conversation wizard with templates
- Message composer with role selection
- Tool use block builder
- UUID auto-generation with proper chains
- Real-time validation as you build
- Template library (common patterns)

**New Services Needed**:
- `ConversationFactory.createSession(projectPath)` - Initialize new session
- `ConversationFactory.createUserMessage(content)` - Create user message entry
- `ConversationFactory.createAssistantMessage(content, toolUse?)` - Create assistant entry
- `ConversationFactory.createToolResult(toolUseId, result)` - Create tool result
- `ConversationFactory.save(session, filePath)` - Write to JSONL file

### Capability 6: FABRICATE (Programmatic Generation)
**Purpose**: Generate custom conversations programmatically

**Features**:
- Conversation scripting DSL
- Template-based generation
- Variable substitution
- Batch generation from data sources
- Import from external formats (Markdown, JSON)

**New Services Needed**:
- `ConversationGenerator.fromTemplate(template, variables)` - Template-based generation
- `ConversationGenerator.fromMarkdown(markdown)` - Parse Markdown to conversation
- `ConversationGenerator.fromScript(dsl)` - DSL-based generation

### Capability 7: START/RESUME (Agent SDK Integration)
**Purpose**: Launch Claude Agent SDK sessions from the Web UI

**Features**:
- Start new session with prebaked context
- Resume existing session from JSONL
- Live session monitoring
- Session handoff (UI to CLI and back)
- Custom system prompts

**Integration with Claude Agent SDK**:
```typescript
import { Claude } from '@anthropic-ai/claude-code';

// Resume session from JSONL
const claude = new Claude({
  sessionId: existingSessionId,
  conversationContext: await loadFromJSONL(sessionPath)
});

// Start new session with prebaked context
const claude = new Claude({
  systemPrompt: customSystemPrompt,
  conversationContext: fabricatedContext
});
```

**New Services Needed**:
- `AgentSDKBridge.startSession(context)` - Start new Agent SDK session
- `AgentSDKBridge.resumeSession(sessionId)` - Resume from JSONL
- `AgentSDKBridge.monitorSession(sessionId)` - Real-time session monitoring

---

## JSONL File Format Reference (For AI Agents)

### File Location
```
~/.claude/projects/{base64-encoded-project-path}/{session-id}.jsonl
```

### Entry Types (Discriminated Union)
```typescript
type ConversationEntry =
  | UserMessageEntry      // type: "user" - Human messages
  | AssistantMessageEntry // type: "assistant" - Claude responses
  | SystemMessageEntry    // type: "system" - System prompts
  | SummaryEntry         // type: "summary" - Context summaries
  | QueueOperationEntry  // type: "queue-operation" - Task queue ops
  | FileHistorySnapshotEntry // type: "file-history-snapshot"
  | ResultEntry          // type: "result" - Tool results
```

### Key Fields
- `uuid`: Unique identifier for the entry
- `parentUuid`: Links to parent message (for threading)
- `timestamp`: ISO 8601 timestamp
- `message.role`: "user" | "assistant" | "system"
- `message.content`: Array of content blocks (text, tool_use, tool_result)

### Tool Use Content Block
```typescript
{
  type: "tool_use",
  id: "toolu_xxx",
  name: "Read" | "Write" | "Edit" | "Bash" | "Grep" | "Glob" | ...,
  input: { /* tool-specific parameters */ }
}
```

### Tool Result Content Block
```typescript
{
  type: "tool_result",
  tool_use_id: "toolu_xxx",
  content: "result string or structured data"
}
```

---

## Technology Stack

### Backend
- **Runtime**: Bun (already used)
- **Server**: Bun.serve with native route handlers
- **WebSocket**: Built-in Bun WebSocket for real-time streaming
- **Database**: bun:sqlite for caching (optional)

### Frontend - Revolutionary Features (All 85%+ Browser Support)

| Feature | Support | Chrome | Safari | iOS | Brave |
|---------|---------|--------|--------|-----|-------|
| CSS Container Queries | 90.6% | 106+ | 16+ | 16+ | ✅ |
| CSS :has() Selector | 91% | 105+ | 15.4+ | 15.4+ | ✅ |
| View Transitions API | 87% | 111+ | 18+ | 18+ | ✅ |
| CSS Nesting | 85% | 120+ | 17.2+ | 17.2+ | ✅ |
| CSS Subgrid | 86.6% | 117+ | 16+ | 16+ | ✅ |
| Dialog Element | 92.6% | 37+ | 15.4+ | 15.4+ | ✅ |
| CSS Cascade Layers | 92% | 99+ | 15.4+ | 15.4+ | ✅ |
| CSS Backdrop Filter | 92.8% | 76+ | 18+ | 18+ | ✅ |
| WebSockets | 93.6% | 16+ | 7+ | 6+ | ✅ |
| CSS Variables | 93.1% | 49+ | 10+ | 10+ | ✅ |

---

## Implementation Checklist

### Phase 1: Project Setup & Server Foundation

- [x] **1.1 Create Web Directory Structure**
  ```
  src/web/
  ├── server.ts           # Bun.serve entry point
  ├── routes/
  │   ├── api.ts          # REST API handlers
  │   └── websocket.ts    # WebSocket handlers
  ├── public/
  │   ├── index.html      # Main HTML entry
  │   ├── css/
  │   │   ├── layers.css  # @layer definitions
  │   │   ├── theme.css   # CSS variables & theming
  │   │   ├── layout.css  # Grid & container queries
  │   │   └── components.css
  │   └── js/
  │       ├── app.js      # Main application
  │       ├── api.js      # API client
  │       └── components/ # Web Components
  └── templates/
      └── partials/       # Reusable HTML fragments
  ```

- [x] **1.2 Create Bun.serve Entry Point** (`src/web/server.ts`)
  - [x] Import existing services (JSONLParser, StepAnalyzer, ConversationBuilder)
  - [x] Configure static file serving for `/public`
  - [x] Set up route handlers for API endpoints
  - [x] Configure WebSocket upgrade handling
  - [x] Add CORS headers for development
  - [x] Implement error handling middleware

- [x] **1.3 Define API Routes**
  ```typescript
  routes: {
    // Static & UI
    "/": indexHtml,

    // OBSERVE - Read-only analysis
    "GET /api/sessions": listSessions,
    "GET /api/sessions/:id": getSession,
    "GET /api/sessions/:id/analyze": analyzeSession,
    "GET /api/sessions/:id/validate": validateSession,
    "GET /api/sessions/:id/entries": getEntries,
    "GET /api/sessions/:id/entries/:index": getEntry,
    "GET /api/sessions/:id/stream": upgradeWebSocket,
    "GET /api/projects": listProjects,

    // DUPLICATE - Clone sessions
    "POST /api/sessions/:id/clone": cloneSession,
    "POST /api/sessions/:id/fork": forkSession,

    // OPTIMIZE - Context reduction
    "POST /api/sessions/:id/optimize": optimizeSession,
    "POST /api/sessions/:id/distill": distillContext,

    // MODIFY - Edit entries
    "PUT /api/sessions/:id/entries/:index": updateEntry,
    "POST /api/sessions/:id/entries": insertEntry,
    "DELETE /api/sessions/:id/entries/:index": deleteEntry,
    "PATCH /api/sessions/:id/entries/reorder": reorderEntries,

    // BUILD - Create from scratch
    "POST /api/sessions": createSession,
    "POST /api/sessions/:id/entries/user": addUserMessage,
    "POST /api/sessions/:id/entries/assistant": addAssistantMessage,
    "POST /api/sessions/:id/entries/tool-result": addToolResult,

    // FABRICATE - Generate programmatically
    "POST /api/generate/from-template": generateFromTemplate,
    "POST /api/generate/from-markdown": generateFromMarkdown,
    "POST /api/templates": listTemplates,
    "GET /api/templates/:id": getTemplate,

    // EXPORT
    "GET /api/sessions/:id/export": exportSession,  // ?format=json|markdown|csv

    // AGENT SDK - Start/Resume
    "POST /api/agent/start": startAgentSession,
    "POST /api/agent/resume/:id": resumeAgentSession,
    "GET /api/agent/:id/status": getAgentStatus,
    "POST /api/agent/:id/stop": stopAgentSession,
    "GET /api/agent/:id/stream": streamAgentSession,  // WebSocket
  }
  ```

- [ ] **1.4 Add npm Scripts to package.json**
  ```json
  {
    "scripts": {
      "dev:web": "bun --hot run src/web/server.ts",
      "build:web": "bun build src/web/server.ts --outdir=dist/web",
      "start:web": "bun run dist/web/server.js"
    }
  }
  ```

---

### Phase 2: Revolutionary CSS Architecture ✅

- [x] **2.1 Implement CSS Cascade Layers** (`css/layers.css`)
  ```css
  /* Layer order determines priority */
  @layer reset, base, theme, layout, components, utilities, states;
  ```
  - [x] `reset` layer for browser normalization
  - [x] `base` layer for element defaults
  - [x] `theme` layer for design tokens
  - [x] `layout` layer for grid systems
  - [x] `components` layer for UI elements
  - [x] `utilities` layer for helpers
  - [x] `states` layer for interactive states

- [x] **2.2 Design Token System with CSS Variables** (`css/theme.css`)
  ```css
  :root {
    /* Color Palette - Dark Mode First */
    --color-bg-primary: oklch(15% 0.02 280);
    --color-bg-secondary: oklch(20% 0.03 280);
    --color-bg-elevated: oklch(25% 0.04 280);

    /* Glass Morphism */
    --glass-bg: oklch(20% 0.02 280 / 0.7);
    --glass-blur: 20px;
    --glass-border: oklch(100% 0 0 / 0.1);

    /* Accent Colors */
    --accent-primary: oklch(70% 0.2 250);
    --accent-success: oklch(75% 0.2 150);
    --accent-warning: oklch(80% 0.2 80);
    --accent-error: oklch(65% 0.25 25);

    /* Typography Scale */
    --font-size-xs: clamp(0.7rem, 0.8vw, 0.8rem);
    --font-size-sm: clamp(0.8rem, 1vw, 0.9rem);
    --font-size-base: clamp(0.9rem, 1.2vw, 1rem);
    --font-size-lg: clamp(1.1rem, 1.5vw, 1.25rem);
    --font-size-xl: clamp(1.3rem, 2vw, 1.5rem);
    --font-size-2xl: clamp(1.8rem, 3vw, 2.5rem);

    /* Spacing Scale */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;

    /* Animation */
    --transition-fast: 150ms ease-out;
    --transition-medium: 300ms ease-out;
    --transition-slow: 500ms ease-out;
  }
  ```

- [x] **2.3 Light Theme Support**
  ```css
  @media (prefers-color-scheme: light) {
    :root {
      --color-bg-primary: oklch(98% 0.01 280);
      --color-bg-secondary: oklch(95% 0.02 280);
      --glass-bg: oklch(100% 0 0 / 0.7);
    }
  }
  ```

- [x] **2.4 Implement Container Queries** (`css/layout.css`)
  ```css
  .card-container {
    container-type: inline-size;
    container-name: card;
  }

  @container card (width < 400px) {
    .card-content {
      flex-direction: column;
    }
  }

  @container card (width >= 400px) {
    .card-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
    }
  }
  ```

- [x] **2.5 Implement CSS :has() for State-Based Styling**
  ```css
  /* Style form group when input is focused */
  .form-group:has(input:focus) {
    --border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px oklch(70% 0.2 250 / 0.2);
  }

  /* Style card when it has errors */
  .validation-card:has(.error) {
    border-left: 4px solid var(--accent-error);
  }

  /* Style sessions list when empty */
  .sessions-list:has(:not(.session-item)) {
    display: grid;
    place-items: center;
    min-height: 200px;
  }
  ```

- [x] **2.6 CSS Nesting for Component Styles**
  ```css
  .session-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: var(--space-4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px oklch(0% 0 0 / 0.2);
    }

    .session-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        font-size: var(--font-size-lg);
        color: var(--color-text-primary);
      }
    }

    .session-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: var(--space-3);

      @container card (width >= 500px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }
  ```

- [x] **2.7 CSS Subgrid for Perfect Alignment**
  ```css
  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--space-4);
  }

  .analysis-card {
    grid-column: span 4;
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3; /* Header, content, footer */
  }
  ```

- [x] **2.8 Glass Morphism with Backdrop Filter**
  ```css
  .glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
  }

  .glass-modal {
    background: oklch(15% 0.02 280 / 0.95);
    backdrop-filter: blur(40px);
    box-shadow:
      0 4px 6px oklch(0% 0 0 / 0.1),
      0 16px 48px oklch(0% 0 0 / 0.3);
  }
  ```

---

### Phase 3: View Transitions for Smooth Navigation ✅

- [x] **3.1 Enable View Transitions**
  ```javascript
  async function navigateTo(route) {
    if (!document.startViewTransition) {
      // Fallback for unsupported browsers
      updateContent(route);
      return;
    }

    const transition = document.startViewTransition(() => {
      updateContent(route);
    });

    await transition.finished;
  }
  ```

- [x] **3.2 Custom Transition Animations**
  ```css
  /* Default crossfade */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 300ms;
    animation-timing-function: ease-out;
  }

  /* Named transitions for specific elements */
  .session-card {
    view-transition-name: session-card;
  }

  ::view-transition-old(session-card) {
    animation: slide-out-left 200ms ease-in;
  }

  ::view-transition-new(session-card) {
    animation: slide-in-right 200ms ease-out;
  }

  @keyframes slide-out-left {
    to { transform: translateX(-100%); opacity: 0; }
  }

  @keyframes slide-in-right {
    from { transform: translateX(100%); opacity: 0; }
  }
  ```

- [x] **3.3 Analysis View Transitions**
  ```css
  .analysis-panel {
    view-transition-name: analysis;
  }

  ::view-transition-old(analysis) {
    animation: scale-down 300ms ease-out;
  }

  ::view-transition-new(analysis) {
    animation: scale-up 300ms ease-out;
  }
  ```

---

### Phase 4: Native Dialog Element for Modals ✅

- [x] **4.1 Session Detail Dialog**
  ```html
  <dialog id="session-dialog" class="glass-modal">
    <header class="dialog-header">
      <h2>Session Analysis</h2>
      <button type="button" class="btn-close" onclick="this.closest('dialog').close()">
        <svg><!-- Close icon --></svg>
      </button>
    </header>
    <main class="dialog-content">
      <!-- Dynamic content -->
    </main>
    <footer class="dialog-actions">
      <button type="button" class="btn-secondary" value="cancel">Cancel</button>
      <button type="button" class="btn-primary" value="confirm">Analyze</button>
    </footer>
  </dialog>
  ```

- [x] **4.2 Dialog Styling with Backdrop**
  ```css
  dialog {
    border: none;
    border-radius: 16px;
    padding: 0;
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
  }

  dialog::backdrop {
    background: oklch(0% 0 0 / 0.6);
    backdrop-filter: blur(4px);
    animation: fade-in 200ms ease-out;
  }

  dialog[open] {
    animation: dialog-open 300ms ease-out;
  }

  @keyframes dialog-open {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
  }
  ```

- [x] **4.3 Export Options Dialog**
  - [x] JSON export preview
  - [x] Markdown export preview
  - [ ] CSV export with column selection
  - [x] Copy to clipboard functionality

- [x] **4.4 Validation Results Dialog**
  - [x] 4-layer validation display
  - [x] Error/warning breakdown
  - [ ] Quick fix suggestions

---

### Phase 5: Real-Time WebSocket Streaming ✅

- [x] **5.1 WebSocket Handler** (`routes/websocket.ts`)
  ```typescript
  export const websocketHandler = {
    async open(ws) {
      console.log('Client connected');
    },

    async message(ws, message) {
      const { type, sessionId } = JSON.parse(message);

      switch (type) {
        case 'stream-analysis':
          await streamAnalysis(ws, sessionId);
          break;
        case 'stream-entries':
          await streamEntries(ws, sessionId);
          break;
      }
    },

    close(ws) {
      console.log('Client disconnected');
    }
  };
  ```

- [x] **5.2 Streaming Analysis Function**
  ```typescript
  async function* streamAnalysis(ws, sessionId) {
    const parser = new JSONLParser();
    const filePath = await findSessionFile(sessionId);

    let processed = 0;
    for await (const entry of parser.parseFile(filePath)) {
      processed++;

      ws.send(JSON.stringify({
        type: 'entry',
        data: entry,
        progress: { processed }
      }));

      // Periodic analysis updates
      if (processed % 10 === 0) {
        const partialAnalysis = analyzePartial(entries);
        ws.send(JSON.stringify({
          type: 'partial-analysis',
          data: partialAnalysis
        }));
      }
    }

    ws.send(JSON.stringify({ type: 'complete' }));
  }
  ```

- [x] **5.3 Client WebSocket Handler**
  ```javascript
  class AnalysisStream {
    constructor(sessionId) {
      this.ws = new WebSocket(`ws://localhost:3000/ws`);
      this.sessionId = sessionId;
    }

    start(onProgress, onComplete) {
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          type: 'stream-analysis',
          sessionId: this.sessionId
        }));
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'complete') {
          onComplete(data);
        } else {
          onProgress(data);
        }
      };
    }
  }
  ```

---

### Phase 6: DUPLICATE & CLONE Services ✅

- [x] **6.1 Session Cloner Service** (`src/web/services/session-cloner.ts`)
  ```typescript
  export class SessionCloner {
    // Clone entire session to new location
    async clone(sessionId: string, options: CloneOptions): Promise<string> {
      const source = await this.findSessionFile(sessionId);
      const entries = await this.parser.parseFileToArray(source);
      const newSessionId = crypto.randomUUID();

      // Update UUIDs if requested
      if (options.regenerateUuids) {
        entries = this.regenerateUuids(entries);
      }

      // Write to new file
      const dest = this.getSessionPath(options.projectPath, newSessionId);
      await this.writeJSONL(dest, entries);

      return newSessionId;
    }

    // Clone with filtering
    async cloneWithFilter(
      sessionId: string,
      predicate: (entry: ConversationEntry) => boolean
    ): Promise<string>;

    // Clone time range
    async cloneTimeRange(
      sessionId: string,
      start: Date,
      end: Date
    ): Promise<string>;

    // Fork session at specific entry
    async forkAt(sessionId: string, entryIndex: number): Promise<string>;
  }
  ```

- [x] **6.2 Clone UI Components**
  - [x] Clone dialog with options
  - [ ] Target project selector
  - [x] UUID regeneration toggle
  - [ ] Time range picker for partial clone
  - [ ] Fork point selector in timeline

---

### Phase 7: MODIFY & EDIT Services ✅

- [x] **7.1 Entry Editor Service** (`src/web/services/entry-editor.ts`)
  ```typescript
  export class EntryEditor {
    // Update single entry
    async updateEntry(
      sessionId: string,
      index: number,
      newEntry: Partial<ConversationEntry>
    ): Promise<void> {
      const entries = await this.loadEntries(sessionId);

      // Validate changes
      const merged = { ...entries[index], ...newEntry };
      const validation = this.validator.validateEntry(merged);
      if (!validation.valid) throw new ValidationError(validation.errors);

      // Check relationship integrity
      this.checkRelationshipIntegrity(entries, index, merged);

      // Update and save
      entries[index] = merged;
      await this.saveEntries(sessionId, entries);
    }

    // Insert new entry
    async insertEntry(
      sessionId: string,
      index: number,
      entry: ConversationEntry
    ): Promise<void>;

    // Delete entry (with relationship repair)
    async deleteEntry(sessionId: string, index: number): Promise<void>;

    // Reorder entries
    async moveEntry(
      sessionId: string,
      fromIndex: number,
      toIndex: number
    ): Promise<void>;

    // Batch update
    async batchUpdate(
      sessionId: string,
      operations: EditOperation[]
    ): Promise<void>;
  }
  ```

- [ ] **7.2 Entry Editor UI Components**
  - [ ] JSON editor with syntax highlighting
  - [ ] Schema validation indicators
  - [ ] Relationship integrity warnings
  - [ ] Undo/redo stack
  - [ ] Diff viewer before save
  - [ ] Batch edit mode

- [ ] **7.3 Edit History Service** (`src/web/services/edit-history.ts`)
  ```typescript
  export class EditHistory {
    private stack: EditOperation[] = [];
    private pointer: number = -1;

    push(operation: EditOperation): void;
    undo(): EditOperation | null;
    redo(): EditOperation | null;
    canUndo(): boolean;
    canRedo(): boolean;
  }
  ```

---

### Phase 8: BUILD & CREATE Services ✅

- [x] **8.1 Conversation Factory Service** (`src/web/services/session-builder.ts`)
  ```typescript
  export class ConversationFactory {
    // Create new empty session
    createSession(projectPath: string): SessionBuilder {
      return new SessionBuilder(projectPath);
    }

    // Create user message entry
    createUserMessage(content: string): UserMessageEntry {
      return {
        uuid: crypto.randomUUID(),
        type: 'user',
        timestamp: new Date().toISOString(),
        message: {
          role: 'user',
          content: [{ type: 'text', text: content }]
        }
      };
    }

    // Create assistant message with optional tool use
    createAssistantMessage(
      content: string,
      toolUse?: ToolUseBlock[]
    ): AssistantMessageEntry {
      const contentBlocks: ContentBlock[] = [];

      if (content) {
        contentBlocks.push({ type: 'text', text: content });
      }

      if (toolUse) {
        contentBlocks.push(...toolUse);
      }

      return {
        uuid: crypto.randomUUID(),
        type: 'assistant',
        timestamp: new Date().toISOString(),
        message: {
          role: 'assistant',
          content: contentBlocks
        }
      };
    }

    // Create tool use block
    createToolUse(
      name: string,
      input: Record<string, any>
    ): ToolUseBlock {
      return {
        type: 'tool_use',
        id: `toolu_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`,
        name,
        input
      };
    }

    // Create tool result entry
    createToolResult(
      toolUseId: string,
      result: string | object,
      isError?: boolean
    ): ToolResultBlock;
  }
  ```

- [x] **8.2 Session Builder** (`src/web/services/session-builder.ts`)
  ```typescript
  export class SessionBuilder {
    private entries: ConversationEntry[] = [];
    private lastUuid: string | null = null;

    // Fluent API for building conversations
    addSystemPrompt(content: string): this;
    addUserMessage(content: string): this;
    addAssistantMessage(content: string): this;
    addToolUse(name: string, input: object): this;
    addToolResult(result: string): this;

    // Build and validate
    build(): ConversationEntry[];
    validate(): ValidationResult;

    // Save to file
    async save(filePath?: string): Promise<string>;
  }
  ```

- [ ] **8.3 Conversation Builder UI**
  - [ ] Step-by-step wizard
  - [ ] Message composer with role tabs
  - [ ] Tool use block builder
  - [ ] Content block editor (text, tool_use, tool_result)
  - [ ] Real-time validation feedback
  - [ ] Preview panel showing JSONL output

- [x] **8.4 Template Library**
  ```typescript
  // Built-in templates
  const TEMPLATES = {
    'code-review': {
      name: 'Code Review Session',
      description: 'Review code and suggest improvements',
      entries: [/* ... */]
    },
    'bug-fix': {
      name: 'Bug Fix Workflow',
      description: 'Systematic bug investigation and fix',
      entries: [/* ... */]
    },
    'feature-implementation': {
      name: 'Feature Implementation',
      description: 'Implement a new feature step by step',
      entries: [/* ... */]
    }
  };
  ```
  - [ ] Template browser UI
  - [ ] Template preview
  - [ ] Custom template creation
  - [ ] Template import/export

---

### Phase 9: FABRICATE & GENERATE Services ✅

- [x] **9.1 Conversation Generator Service** (`src/web/services/conversation-generator.ts`)
  ```typescript
  export class ConversationGenerator {
    // Generate from template with variables
    async fromTemplate(
      templateId: string,
      variables: Record<string, string>
    ): Promise<ConversationEntry[]> {
      const template = await this.loadTemplate(templateId);
      return this.interpolate(template.entries, variables);
    }

    // Parse Markdown to conversation
    async fromMarkdown(markdown: string): Promise<ConversationEntry[]> {
      // Parse format:
      // ## User
      // message content
      //
      // ## Assistant
      // response content
      //
      // ```tool:Read
      // {"file_path": "/path/to/file"}
      // ```
    }

    // Generate from DSL script
    async fromScript(script: string): Promise<ConversationEntry[]> {
      // DSL format:
      // @system "You are a helpful assistant"
      // @user "Help me fix this bug"
      // @assistant "I'll help you fix that bug."
      // @tool Read { file_path: "/src/main.ts" }
      // @result "file contents..."
    }

    // Batch generation from CSV/JSON data
    async batchGenerate(
      template: string,
      dataSource: string | object[]
    ): Promise<ConversationEntry[][]>;
  }
  ```

- [ ] **9.2 Fabrication UI**
  - [ ] Template editor with variable highlighting
  - [ ] Markdown import wizard
  - [ ] DSL script editor with syntax highlighting
  - [ ] Batch generation from CSV upload
  - [ ] Preview generated conversations
  - [ ] Bulk export options

- [x] **9.3 DSL Parser** (`src/web/services/conversation-generator.ts`)
  ```typescript
  // Conversation DSL syntax
  const DSL_SYNTAX = `
    @system "system prompt content"
    @user "user message"
    @assistant "assistant response"
    @tool ToolName { json: "input" }
    @result "tool result content"
    @error "error message"

    # Variables
    $projectPath = "/path/to/project"
    @user "Analyze $projectPath"

    # Loops
    @each file in $files {
      @tool Read { file_path: file }
      @result "{{file.content}}"
    }
  `;
  ```

---

### Phase 10: Agent SDK Integration ✅

- [x] **10.1 Agent SDK Bridge Service** (`src/web/services/agent-sdk-bridge.ts`)
  ```typescript
  import { Claude } from '@anthropic-ai/claude-code';

  export class AgentSDKBridge {
    private activeSessions: Map<string, Claude> = new Map();

    // Start new session with prebaked context
    async startSession(options: {
      projectPath: string;
      systemPrompt?: string;
      context?: ConversationEntry[];
      workingDirectory?: string;
    }): Promise<AgentSession> {
      const claude = new Claude({
        projectPath: options.projectPath,
        systemPrompt: options.systemPrompt,
      });

      // Inject prebaked context if provided
      if (options.context) {
        await this.injectContext(claude, options.context);
      }

      const sessionId = crypto.randomUUID();
      this.activeSessions.set(sessionId, claude);

      return {
        sessionId,
        status: 'running',
        startedAt: new Date()
      };
    }

    // Resume session from JSONL file
    async resumeSession(sessionId: string): Promise<AgentSession> {
      const sessionPath = await this.findSessionFile(sessionId);
      const entries = await this.parser.parseFileToArray(sessionPath);

      // Reconstruct session state
      const claude = new Claude({
        sessionId,
        conversationHistory: this.toClaudeFormat(entries)
      });

      this.activeSessions.set(sessionId, claude);

      return {
        sessionId,
        status: 'running',
        resumedAt: new Date()
      };
    }

    // Send message to active session
    async sendMessage(
      sessionId: string,
      message: string
    ): Promise<AsyncIterable<AgentEvent>>;

    // Monitor session in real-time
    streamSession(sessionId: string): ReadableStream<AgentEvent>;

    // Stop running session
    async stopSession(sessionId: string): Promise<void>;

    // Get session status
    getStatus(sessionId: string): AgentSessionStatus;
  }
  ```

- [ ] **10.2 Agent Session UI**
  - [ ] Session launcher dialog
  - [ ] Context preview before launch
  - [ ] Live session monitor
  - [ ] Real-time message stream
  - [ ] Tool execution visualization
  - [ ] Session stop/pause controls
  - [ ] Handoff to CLI button

- [x] **10.3 Context Injection**
  ```typescript
  // Inject prebaked context into new session
  async injectContext(
    claude: Claude,
    context: ConversationEntry[]
  ): Promise<void> {
    // Convert entries to Claude conversation format
    const messages = context.map(entry => ({
      role: entry.message.role,
      content: entry.message.content
    }));

    // Set as conversation history
    await claude.setConversationHistory(messages);
  }
  ```

- [x] **10.4 Session Handoff**
  - [x] Export session state for CLI resume
  - [x] Generate `claude --resume` command
  - [ ] Copy session ID to clipboard
  - [ ] Deep link to CLI

---

### Phase 11: Main UI Components (OBSERVE) - Partial ⚠️

- [x] **11.1 Session List View**
  - [ ] Virtual scrolling for large lists
  - [x] Search and filter capabilities
  - [x] Sort by date, size, project
  - [ ] Grid/List view toggle
  - [ ] Lazy loading with intersection observer
  - [x] Quick actions (Analyze, Clone, Edit, Launch)

- [ ] **11.2 Analysis Dashboard**
  - [ ] Token usage visualization (SVG charts)
  - [ ] Tool usage frequency breakdown
  - [ ] Cost estimation display
  - [ ] Timeline of conversation steps
  - [ ] Todo evolution tracking
  - [ ] Conversation tree visualization

- [ ] **11.3 Conversation Timeline**
  - [ ] Entry-by-entry visualization
  - [ ] Collapsible tool results
  - [ ] Syntax highlighted code blocks
  - [ ] Jump to specific entry
  - [ ] Filter by message type
  - [ ] Inline editing (MODIFY integration)
  - [ ] Fork button at any entry (DUPLICATE integration)

- [ ] **11.4 Validation Report View**
  - [ ] 4-layer validation results
  - [ ] Error severity indicators
  - [ ] Expandable error details
  - [ ] Quick navigation to issues
  - [ ] One-click fix suggestions

- [ ] **11.5 Export Panel**
  - [ ] Format selection (JSON, Markdown, CSV)
  - [ ] Preview before download
  - [ ] Copy to clipboard
  - [ ] Custom field selection
  - [ ] Export optimized version (OPTIMIZE integration)

---

### Phase 12: HTML Structure with Semantic Elements ✅

- [x] **12.1 Main Layout** (`index.html`)
  ```html
  <!DOCTYPE html>
  <html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark light">
    <title>Claude Code Deep Researcher</title>

    <!-- Preload critical CSS -->
    <link rel="preload" href="/css/layers.css" as="style">

    <!-- CSS Layers -->
    <link rel="stylesheet" href="/css/layers.css">
    <link rel="stylesheet" href="/css/theme.css">
    <link rel="stylesheet" href="/css/layout.css">
    <link rel="stylesheet" href="/css/components.css">

    <!-- ES Modules -->
    <script type="module" src="/js/app.js"></script>
  </head>
  <body>
    <div class="app-layout">
      <aside class="sidebar glass-panel">
        <nav class="main-nav" aria-label="Main navigation">
          <!-- Navigation items -->
        </nav>
      </aside>

      <main class="main-content">
        <header class="page-header glass-panel">
          <h1>Sessions</h1>
          <div class="header-actions">
            <!-- Action buttons -->
          </div>
        </header>

        <section class="content-area" id="content">
          <!-- Dynamic content -->
        </section>
      </main>
    </div>

    <!-- Dialogs -->
    <dialog id="session-dialog" class="glass-modal">
      <!-- Session dialog content -->
    </dialog>

    <dialog id="export-dialog" class="glass-modal">
      <!-- Export dialog content -->
    </dialog>
  </body>
  </html>
  ```

- [x] **12.2 Session Card Component**
  ```html
  <article class="session-card glass-panel" data-session-id="">
    <header class="session-header">
      <h3 class="session-title"></h3>
      <time class="session-date" datetime=""></time>
    </header>

    <dl class="session-stats">
      <div class="stat">
        <dt>Entries</dt>
        <dd class="stat-value"></dd>
      </div>
      <div class="stat">
        <dt>Tokens</dt>
        <dd class="stat-value"></dd>
      </div>
      <div class="stat">
        <dt>Tools</dt>
        <dd class="stat-value"></dd>
      </div>
    </dl>

    <footer class="session-actions">
      <button class="btn-icon" aria-label="Analyze">
        <svg><!-- Analyze icon --></svg>
      </button>
      <button class="btn-icon" aria-label="Export">
        <svg><!-- Export icon --></svg>
      </button>
    </footer>
  </article>
  ```

---

### Phase 13: JavaScript Application Architecture ✅

- [x] **13.1 Main Application** (`js/app.js`)
  ```javascript
  import { Router } from './router.js';
  import { APIClient } from './api.js';
  import { SessionList } from './components/session-list.js';
  import { AnalysisDashboard } from './components/analysis-dashboard.js';

  class App {
    constructor() {
      this.api = new APIClient();
      this.router = new Router();
      this.setupRoutes();
    }

    setupRoutes() {
      this.router.on('/', () => this.showSessionList());
      this.router.on('/session/:id', (params) => this.showAnalysis(params.id));
      this.router.on('/session/:id/validate', (params) => this.showValidation(params.id));
    }

    async showSessionList() {
      const sessions = await this.api.listSessions();
      const list = new SessionList(sessions);
      this.renderWithTransition(list);
    }

    async renderWithTransition(component) {
      if (document.startViewTransition) {
        await document.startViewTransition(() => {
          document.querySelector('#content').replaceChildren(component.render());
        }).finished;
      } else {
        document.querySelector('#content').replaceChildren(component.render());
      }
    }
  }

  new App();
  ```

- [x] **13.2 API Client** (`js/api.js`)
  ```javascript
  export class APIClient {
    constructor(baseUrl = '/api') {
      this.baseUrl = baseUrl;
    }

    async listSessions(options = {}) {
      const params = new URLSearchParams(options);
      const response = await fetch(`${this.baseUrl}/sessions?${params}`);
      return response.json();
    }

    async analyzeSession(sessionId) {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}/analyze`);
      return response.json();
    }

    streamAnalysis(sessionId) {
      return new WebSocket(`ws://localhost:3000/ws/sessions/${sessionId}/stream`);
    }
  }
  ```

- [x] **13.3 Component Base Class**
  ```javascript
  export class Component {
    constructor() {
      this.element = null;
    }

    render() {
      throw new Error('render() must be implemented');
    }

    update(data) {
      // Efficient DOM updates
    }

    destroy() {
      this.element?.remove();
    }
  }
  ```

---

### Phase 14: Performance Optimizations

- [ ] **14.1 Critical CSS Inlining**
  - [ ] Extract above-the-fold CSS
  - [ ] Inline critical styles in `<head>`
  - [ ] Defer non-critical CSS loading

- [ ] **14.2 Lazy Loading**
  ```javascript
  // Intersection Observer for lazy loading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadSessionDetails(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px' });
  ```

- [ ] **14.3 Virtual Scrolling for Large Lists**
  - [ ] Implement windowed rendering
  - [ ] Recycle DOM nodes
  - [ ] Smooth scroll restoration

- [ ] **14.4 Caching Strategy**
  - [ ] Cache session list in memory
  - [ ] Cache analysis results
  - [ ] Use IndexedDB for persistence
  - [ ] Implement stale-while-revalidate

---

### Phase 15: Accessibility & Progressive Enhancement

- [ ] **15.1 Keyboard Navigation**
  - [ ] Focus management for dialogs
  - [ ] Skip links for main content
  - [ ] Arrow key navigation in lists
  - [ ] Escape to close dialogs

- [ ] **15.2 ARIA Attributes**
  ```html
  <section aria-labelledby="sessions-heading" aria-busy="false">
    <h2 id="sessions-heading">Sessions</h2>
    <ul role="list" aria-label="Session list">
      <li role="listitem">...</li>
    </ul>
  </section>
  ```

- [ ] **15.3 Reduced Motion Support**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }
  }
  ```

- [ ] **15.4 Feature Detection Fallbacks**
  ```javascript
  // Container queries fallback
  if (!CSS.supports('container-type: inline-size')) {
    document.body.classList.add('no-container-queries');
  }

  // View transitions fallback
  if (!document.startViewTransition) {
    // Use traditional DOM updates
  }
  ```

---

### Phase 16: Testing & Quality Assurance - Partial ⚠️

- [x] **16.1 Unit Tests**
  - [ ] API client methods
  - [x] Component rendering (SessionBuilder, ConversationDSL)
  - [x] Router navigation
  - [ ] WebSocket handlers

- [ ] **16.2 Integration Tests**
  - [ ] Server route handlers
  - [ ] WebSocket streaming
  - [ ] Full analysis workflow

- [x] **16.3 Browser Testing**
  - [x] Chrome (latest) - Tested via DevTools MCP
    - [x] Dashboard (`/`) - Recent Sessions, Projects list ✅
    - [x] Session Detail (`/sessions/:id`) - Entry viewer, Analyze/Validate buttons ✅
    - [x] Projects (`/projects`) - Project cards with session counts ✅
    - [x] Build Session (`/build`) - Project dropdown, message builder ✅
    - [x] Fabricate (`/fabricate`) - DSL editor, syntax reference ✅
    - [x] Templates (`/templates`) - 6 template options ✅
    - [x] Optimize (`/optimize`) - Strategy options, token limits ✅
    - [x] Validate (`/validate`) - 4-layer validation checkboxes ✅
    - [x] Theme toggle - Light/Dark mode switching ✅
    - [x] Navigation - All sidebar links functional ✅
  - [ ] Safari (18+)
  - [ ] iOS Safari (18+)
  - [ ] Brave (latest)
  - [ ] Firefox (for reference)

- [ ] **16.4 Performance Testing**
  - [ ] Lighthouse scores (target 90+)
  - [ ] Core Web Vitals
  - [ ] Large file handling (>5MB)
  - [ ] WebSocket stability

---

### Phase 17: Documentation & Deployment

- [ ] **17.1 Update README**
  - [ ] Web UI usage instructions
  - [ ] Configuration options
  - [ ] Browser requirements

- [ ] **17.2 API Documentation**
  - [ ] REST endpoint reference
  - [ ] WebSocket protocol spec
  - [ ] Response schemas

- [ ] **17.3 Deployment Configuration**
  - [ ] Production build script
  - [ ] Environment variables
  - [ ] Docker configuration (optional)

---

## File Structure After Implementation

```
src/
├── web/
│   ├── server.ts              # Bun.serve entry point
│   ├── routes/
│   │   ├── api.ts             # REST API handlers
│   │   ├── sessions.ts        # Session endpoints
│   │   └── websocket.ts       # WebSocket handlers
│   ├── public/
│   │   ├── index.html         # Main HTML
│   │   ├── css/
│   │   │   ├── layers.css     # @layer definitions
│   │   │   ├── theme.css      # CSS variables
│   │   │   ├── layout.css     # Grid & containers
│   │   │   └── components.css # UI components
│   │   └── js/
│   │       ├── app.js         # Main application
│   │       ├── api.js         # API client
│   │       ├── router.js      # Client-side router
│   │       └── components/
│   │           ├── session-list.js
│   │           ├── analysis-dashboard.js
│   │           ├── timeline.js
│   │           └── validation-report.js
│   └── templates/
│       └── partials/
├── services/                   # Existing services (unchanged)
├── cli/                        # Existing CLI (unchanged)
└── types/                      # Existing types (reused)
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 100 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| WebSocket Latency | < 100ms |
| Large File Rendering | < 2s for 5MB |
| Browser Support | Chrome, Safari, iOS, Brave |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| View Transitions not supported | Feature detection with graceful fallback |
| Safari 17.x :has() issues | Progressive enhancement |
| Container Queries in older Safari | Fallback media queries |
| WebSocket connection drops | Auto-reconnect with exponential backoff |
| Large session files | Virtual scrolling + streaming |

---

## Dependencies

No new npm dependencies required. Uses:
- Bun native file serving
- Bun native WebSocket
- Existing `@anthropic-ai/tokenizer`
- Native Web APIs (Container Queries, View Transitions, Dialog, etc.)

---

*Created: 2024-12-13*
*Updated: 2025-12-13*
*Status: Core Implementation Complete - UI Views Pending*
*Priority: High*

---

## Implementation Summary

### Completed Phases ✅
- Phase 1: Project Setup & Server Foundation
- Phase 2: Revolutionary CSS Architecture
- Phase 3: View Transitions for Smooth Navigation
- Phase 4: Native Dialog Element for Modals
- Phase 5: Real-Time WebSocket Streaming
- Phase 6: DUPLICATE & CLONE Services
- Phase 7: MODIFY & EDIT Services (service layer only)
- Phase 8: BUILD & CREATE Services
- Phase 9: FABRICATE & GENERATE Services
- Phase 10: Agent SDK Integration
- Phase 12: HTML Structure with Semantic Elements
- Phase 13: JavaScript Application Architecture

### Partially Complete ⚠️
- Phase 11: Main UI Components (OBSERVE) - Dashboard exists, detail views need implementation
- Phase 16: Testing & Quality Assurance - Web services tests (16 passing), Chrome tested

### Pending 📋
- Phase 7.2-7.3: Entry Editor UI Components, Edit History Service
- Phase 8.3: Conversation Builder UI wizard
- Phase 9.2: Fabrication UI
- Phase 10.2: Agent Session UI
- Phase 11.2-11.5: Analysis Dashboard, Timeline, Validation Report, Export Panel views
- Phase 14: Performance Optimizations
- Phase 15: Accessibility & Progressive Enhancement
- Phase 17: Documentation & Deployment

### Missing Items Identified During Testing
- [x] npm scripts for web server (`dev:web`, `start:web`) - Added to package.json
- [x] Theme toggle functional (works correctly, tested via DevTools MCP)
- [x] View routes for /build, /fabricate, /templates, /optimize, /validate (all implemented and working)

### Bugs Fixed During DevTools MCP Testing (2025-12-13)

**Issue 1: Empty Projects List**
- **Root Cause**: `Bun.file(path).exists()` returns false for directories
- **Fix**: Changed to use `fs/promises` `stat()` function in `api.ts:listProjects()`
- **Files Modified**: `src/web/routes/api.ts`

**Issue 2: Garbled Project Names**
- **Root Cause**: Code incorrectly tried to base64 decode directory names that use path-style encoding (`-` → `/`)
- **Fix**: Changed from base64 decoding to simple string replacement: `entry.replace(/-/g, '/')`
- **Files Modified**: `src/web/routes/api.ts`

**Issue 3: Sessions Not Loading in Dashboard**
- **Root Cause**: API client called wrong endpoint (`/api/projects/:path/sessions` vs `/api/sessions?project=xxx`)
- **Fix**: Updated `listSessions()` method to use correct query parameter format
- **Files Modified**: `src/web/public/js/api.js`

**Issue 4: Session Detail View Not Rendering**
- **Root Cause 1**: Destructuring `{ session }` from API response that returns session directly
- **Root Cause 2**: Using `session.modified` property but API returns `modifiedAt`
- **Fix**: Removed destructuring and updated all property references to `modifiedAt`
- **Files Modified**: `src/web/public/js/app.js`

### Test Summary (2025-12-13)

| Route | Status | Notes |
|-------|--------|-------|
| `/` (Dashboard) | ✅ Pass | Shows Recent Sessions and Projects |
| `/sessions/:id` | ✅ Pass | Entry viewer, Analyze/Validate buttons |
| `/projects` | ✅ Pass | All projects with session counts |
| `/build` | ✅ Pass | Project dropdown populated, message builder |
| `/fabricate` | ✅ Pass | DSL editor with syntax reference |
| `/templates` | ✅ Pass | 6 template options displayed |
| `/optimize` | ✅ Pass | Strategy options, token limits, checkboxes |
| `/validate` | ✅ Pass | 4-layer validation checkboxes |
| Theme Toggle | ✅ Pass | Dark/Light mode switching |
| Navigation | ✅ Pass | All sidebar links functional |
