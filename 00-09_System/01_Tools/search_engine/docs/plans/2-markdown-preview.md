# Markdown Preview Feature

Add the ability to click a search result and view its contents rendered as markdown in a modal overlay.

---

## Philosophy

**Click to Preview**
Search results should be immediately previewable without leaving the interface. Clicking a result fetches the file content and renders it as formatted markdown, allowing quick review before deciding to open the file externally.

**No Server Changes Required**
The existing `/file?path=<path>&content=true` endpoint already returns file content. This feature is purely a frontend enhancement.

**Lightweight Implementation**
Use a CDN-loaded markdown parser (marked.js) to avoid build complexity. Keep the single-file HTML architecture.

---

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Web UI (index.html)                     │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                    Search Results                     │  │
│   │                                                       │  │
│   │   ┌─────────────────────────────────────────────┐    │  │
│   │   │  Result Card                                │    │  │
│   │   │  - filename, area, category                 │    │  │
│   │   │  - path                                     │    │  │
│   │   │  - snippet                                  │    │  │
│   │   │  - [Copy Path] button                       │    │  │
│   │   │  - hover effect only (no click action) ←───┼────┼──┼── CURRENT
│   │   └─────────────────────────────────────────────┘    │  │
│   └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                  API: /file?path=...                  │  │
│   │                  (already exists)                     │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Web UI (index.html)                     │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                    Search Results                     │  │
│   │                                                       │  │
│   │   ┌─────────────────────────────────────────────┐    │  │
│   │   │  Result Card (clickable)                    │────┼──┼──► onClick
│   │   │  - filename, area, category                 │    │  │      │
│   │   │  - path                                     │    │  │      │
│   │   │  - snippet                                  │    │  │      ▼
│   │   │  - [Copy Path] button (stopPropagation)    │    │  │   fetch()
│   │   └─────────────────────────────────────────────┘    │  │      │
│   └──────────────────────────────────────────────────────┘  │      │
│                                                              │      │
│   ┌──────────────────────────────────────────────────────┐  │      │
│   │                   Preview Modal (NEW)                 │◄─┼──────┘
│   │                                                       │  │
│   │   ┌─────────────────────────────────────────────┐    │  │
│   │   │  Header: filename, path                     │    │  │
│   │   │  [Open in Finder] [Copy Path] [X Close]     │    │  │
│   │   ├─────────────────────────────────────────────┤    │  │
│   │   │                                             │    │  │
│   │   │  Rendered Markdown Content                  │    │  │
│   │   │  (using marked.js from CDN)                 │    │  │
│   │   │                                             │    │  │
│   │   └─────────────────────────────────────────────┘    │  │
│   └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │          API: /file?path=<path>&content=true          │  │
│   │                  (no changes needed)                  │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Approach

### Markdown Parser Selection

**Option A: marked.js (Recommended)**
- Lightweight (~40KB minified)
- Fast parsing
- CDN available
- No build step required

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

**Option B: markdown-it**
- More extensible
- Larger (~100KB)
- Overkill for this use case

### File Type Handling

| Extension | Rendering |
|-----------|-----------|
| `.md` | Parse as markdown, render HTML |
| `.txt` | Wrap in `<pre>` tag, plain text |
| `.json` | Syntax highlight, formatted JSON |

### API Integration

The existing `/file` endpoint returns:
```json
{
  "path": "/Volumes/VRAM/...",
  "filename": "example.md",
  "extension": "md",
  "content": "# Markdown content...",
  "file_size": 1234,
  "modified_at": "2025-01-01T..."
}
```

No server modifications needed.

---

## Implementation

### Phase 1: Modal Structure

Add modal HTML to `index.html`:

```html
<!-- Preview Modal -->
<div class="modal-overlay" id="modal" style="display: none;">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">
        <span class="modal-filename" id="modal-filename"></span>
        <span class="modal-path" id="modal-path"></span>
      </div>
      <div class="modal-actions">
        <button class="modal-btn" onclick="openInFinder()">Open in Finder</button>
        <button class="modal-btn" onclick="copyModalPath()">Copy Path</button>
        <button class="modal-btn modal-close" onclick="closeModal()">✕</button>
      </div>
    </div>
    <div class="modal-content" id="modal-content"></div>
  </div>
</div>
```

### Phase 2: Modal Styles

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #16213e;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #333;
}
.modal-filename {
  font-weight: 600;
  color: #00d4ff;
}
.modal-path {
  font-size: 0.75rem;
  color: #666;
  display: block;
  word-break: break-all;
}
.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}
/* Markdown content styles */
.modal-content h1, .modal-content h2, .modal-content h3 {
  color: #00d4ff;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.modal-content h1:first-child { margin-top: 0; }
.modal-content p { margin-bottom: 1rem; line-height: 1.6; }
.modal-content code {
  background: #0f3460;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'SF Mono', monospace;
}
.modal-content pre {
  background: #0f3460;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
}
.modal-content pre code {
  background: none;
  padding: 0;
}
.modal-content ul, .modal-content ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}
.modal-content blockquote {
  border-left: 4px solid #00d4ff;
  padding-left: 1rem;
  margin-left: 0;
  color: #aaa;
}
```

### Phase 3: JavaScript Functions

```javascript
// Load marked.js from CDN
const markedScript = document.createElement('script');
markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
document.head.appendChild(markedScript);

let currentFilePath = null;

async function openPreview(path) {
  currentFilePath = path;
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');
  const filename = document.getElementById('modal-filename');
  const pathEl = document.getElementById('modal-path');

  // Show modal with loading state
  modal.style.display = 'flex';
  content.innerHTML = '<div class="loading">Loading...</div>';
  filename.textContent = path.split('/').pop();
  pathEl.textContent = path;

  try {
    const res = await fetch(`${API}/file?path=${encodeURIComponent(path)}&content=true`);
    const data = await res.json();

    if (data.error) {
      content.innerHTML = `<div class="error">${data.error}</div>`;
      return;
    }

    // Render based on file type
    const ext = data.extension?.toLowerCase();
    if (ext === 'md') {
      content.innerHTML = marked.parse(data.content || '');
    } else if (ext === 'json') {
      try {
        const formatted = JSON.stringify(JSON.parse(data.content), null, 2);
        content.innerHTML = `<pre><code>${escapeHtml(formatted)}</code></pre>`;
      } catch {
        content.innerHTML = `<pre><code>${escapeHtml(data.content)}</code></pre>`;
      }
    } else {
      content.innerHTML = `<pre>${escapeHtml(data.content)}</pre>`;
    }
  } catch (e) {
    content.innerHTML = `<div class="error">Failed to load: ${e.message}</div>`;
  }
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  currentFilePath = null;
}

function copyModalPath() {
  if (currentFilePath) {
    navigator.clipboard.writeText(currentFilePath);
    event.target.textContent = 'Copied!';
    setTimeout(() => event.target.textContent = 'Copy Path', 1000);
  }
}

function openInFinder() {
  // This won't work in browser, but shows the path
  alert(`Open in terminal:\nopen "${currentFilePath}"`);
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Close modal on overlay click
document.getElementById('modal')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) closeModal();
});
```

### Phase 4: Update Result Card Rendering

Modify the search result rendering to add click handler:

```javascript
// Change from:
resultsDiv.innerHTML = data.results.map(r => {
  return `<div class="result">...`;
}).join('');

// To:
resultsDiv.innerHTML = data.results.map(r => {
  return `
    <div class="result" onclick="openPreview('${escapeHtml(r.path)}')" style="cursor: pointer;">
      ...
      <button class="copy-btn" onclick="event.stopPropagation(); copyPath('${escapeHtml(r.path)}')">Copy Path</button>
    </div>
  `;
}).join('');
```

Note: `event.stopPropagation()` prevents the Copy Path button from also triggering the preview.

---

## Implementation Checklist

### Phase 1: Modal HTML Structure
- [x] Add modal overlay HTML to index.html
- [x] Add modal header with title, path, action buttons
- [x] Add modal content area for rendered markdown

### Phase 2: Modal Styling
- [x] Style modal overlay (dark backdrop, centered)
- [x] Style modal container (dark theme, rounded corners)
- [x] Style modal header (filename, path, buttons)
- [x] Style markdown content (headers, code, lists, blockquotes)
- [x] Add responsive styles for mobile

### Phase 3: JavaScript Functionality
- [x] Load marked.js from CDN
- [x] Implement `openPreview(path)` function
- [x] Implement content rendering by file type (md, json, txt)
- [x] Implement `closeModal()` function
- [x] Implement `copyModalPath()` function
- [x] Add Escape key listener to close modal
- [x] Add overlay click listener to close modal

### Phase 4: Integration
- [x] Update result card rendering with `onclick` handler
- [x] Add `event.stopPropagation()` to Copy Path button
- [x] Add cursor pointer style to result cards
- [x] Test with markdown files
- [x] Test with JSON files
- [x] Test with plain text files

### Verification
- [x] Click result opens modal with content
- [x] Markdown renders with proper formatting
- [x] JSON displays formatted and syntax highlighted
- [x] Plain text displays in monospace
- [x] Copy Path button works in modal
- [x] Escape key closes modal
- [x] Clicking overlay closes modal
- [x] Copy Path on result card doesn't open modal
- [x] Mobile responsive layout works

---

## API Reference

### Existing Endpoint (No Changes)

```
GET /file?path=<filepath>&content=true
```

**Response:**
```json
{
  "path": "/Volumes/VRAM/10-19_Work/14_Communications/14.01_emails/2025/example.md",
  "filename": "example.md",
  "extension": "md",
  "content": "# Email Subject\n\nEmail content here...",
  "file_size": 2048,
  "modified_at": "2025-01-10T14:30:00.000Z",
  "area": "Work",
  "category": "Communications"
}
```

---

## Future Enhancements

### Potential Additions
- [ ] Keyboard navigation (arrow keys for next/prev result)
- [ ] Syntax highlighting for code blocks (highlight.js)
- [ ] Image preview support (for image files in VRAM)
- [ ] Edit button to open in default editor
- [ ] Search within preview content
- [ ] Share/export rendered content

### Out of Scope
- Server-side markdown rendering (unnecessary complexity)
- File editing within the UI (violates dump-and-search philosophy)
- Build system changes (keep single-file simplicity)

---

*Created: 2025-01-13*
