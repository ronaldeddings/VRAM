# Printing Events: `beforeprint` and `afterprint`

## Overview

The `beforeprint` and `afterprint` events allow JavaScript to detect and respond to printing actions. The `window` object fires the `beforeprint` event when a print dialog is shown (user initiates print via Ctrl+P, Cmd+P, or File > Print), and the `afterprint` event fires after the print dialog is closed, regardless of whether the user completed the print action or cancelled it.

This feature enables developers to dynamically modify the printed document, optimize page layout for printing, display/hide specific content for print, and restore the page after the print dialog closes.

**Specification Status:** Living Standard (ls)

**Specification Link:** [WHATWG HTML Standard - Printing](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#printing)

---

## Categories

- **HTML5**
- **JS API**

---

## Benefits & Use Cases

### 1. **Dynamic Print Styling Without CSS Media Queries**
Enhance or modify CSS dynamically before printing, allowing for JavaScript-based logic to determine what gets printed.

```javascript
window.addEventListener('beforeprint', () => {
  document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('print-mode');
});
```

### 2. **Hide/Show Print-Specific Content**
Control visibility of elements beyond what `@media print` can achieve. Show print instructions, hide navigation, or conditionally display supplementary information.

```javascript
window.addEventListener('beforeprint', () => {
  document.getElementById('no-print').style.display = 'none';
  document.getElementById('print-only').style.display = 'block';
});

window.addEventListener('afterprint', () => {
  document.getElementById('no-print').style.display = 'block';
  document.getElementById('print-only').style.display = 'none';
});
```

### 3. **Generate or Fetch Print Content**
Load additional data, generate QR codes, fetch print-specific content, or prepare complex layouts on demand.

```javascript
window.addEventListener('beforeprint', async () => {
  const data = await fetch('/api/print-data').then(r => r.json());
  document.getElementById('print-content').innerHTML = renderData(data);
});
```

### 4. **Analytics and User Tracking**
Track when users print pages for analytics, user behavior analysis, or engagement metrics.

```javascript
window.addEventListener('beforeprint', () => {
  trackEvent('page_printed', { url: window.location.href });
});
```

### 5. **Document Preparation**
Adjust layout, expand collapsed sections, remove advertisements, or prepare the DOM structure for better printing.

```javascript
window.addEventListener('beforeprint', () => {
  // Expand collapsible sections for print
  document.querySelectorAll('.collapsed').forEach(el => {
    el.classList.remove('collapsed');
  });
});
```

### 6. **Resource Management**
Warn users about bandwidth-intensive operations during printing, or pre-load resources needed for the printed output.

### 7. **Multi-Page Document Handling**
Manage complex pagination, generate table of contents, or adjust page breaks for better readability.

---

## Browser Support

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **Internet Explorer** | 6 | ✅ Yes (IE 6-11) | Partial support in IE 5.5 |
| **Edge** | 12 | ✅ Yes (12+) | Full support in all versions |
| **Firefox** | 6 | ✅ Yes (6+) | Full support since Firefox 6 |
| **Chrome** | 63 | ✅ Yes (63+) | Added in Chrome 63 (April 2018) |
| **Safari** | 13 | ✅ Yes (13+) | Added in Safari 13 (September 2019) |
| **Opera** | 50 | ✅ Yes (50+) | Added in Opera 50 (August 2017) |
| **iOS Safari** | 13.0 | ✅ Yes (13+) | Added in iOS 13 |
| **Opera Mobile** | 80 | ✅ Yes (80+) | Support added in version 80 |
| **Android Chrome** | 142 | ✅ Yes (142+) | Full support |
| **Android Firefox** | 144 | ✅ Yes (144+) | Full support |
| **Android UC Browser** | 15.5 | ✅ Yes | Supported |
| **Android QQ Browser** | 14.9 | ✅ Yes | Supported |
| **Baidu Browser** | 13.52 | ✅ Yes | Supported |
| **KaiOS** | 2.5 | ✅ Yes (2.5+) | Full support |

### Limited or Deprecated Support

| Browser | Status | Notes |
|---------|--------|-------|
| **Opera Mini** | ❌ No | Not supported (all versions) |
| **Samsung Internet** | ❌ No | Not supported in recent versions |
| **Android Browser** | ❌ No | Not supported |
| **BlackBerry** | ❓ Partial (Unknown) | Limited data for BB 7 & 10 |
| **IE Mobile** | ❓ Partial (Unknown) | IE Mobile 10-11 status unclear |

### Usage Statistics

- **Global Support:** 90.82% of users have browsers with full support
- **Active Partial Support:** 0% (minimal partial implementation)

---

## Implementation Examples

### Basic Event Listeners

```javascript
// Simple logging
window.addEventListener('beforeprint', () => {
  console.log('User opened print dialog');
});

window.addEventListener('afterprint', () => {
  console.log('Print dialog closed');
});
```

### Complete Example: Dynamic Print Styling

```javascript
const printState = {
  originalTitle: document.title,
  originalStyles: new Map()
};

window.addEventListener('beforeprint', () => {
  // Update page title for print
  document.title = 'Invoice #12345 - Print Version';

  // Store original display values
  const hiddenElements = document.querySelectorAll('.no-print');
  hiddenElements.forEach(el => {
    printState.originalStyles.set(el, el.style.display);
    el.style.display = 'none';
  });

  // Add print-specific styles
  document.body.classList.add('printing');

  // Generate additional content
  const footer = document.createElement('div');
  footer.className = 'print-footer';
  footer.textContent = `Printed on ${new Date().toLocaleString()}`;
  document.body.appendChild(footer);
});

window.addEventListener('afterprint', () => {
  // Restore original title
  document.title = printState.originalTitle;

  // Restore original styles
  printState.originalStyles.forEach((display, el) => {
    el.style.display = display;
  });

  // Remove print-specific classes
  document.body.classList.remove('printing');

  // Clean up temporary elements
  document.querySelectorAll('.print-footer').forEach(el => el.remove());
});
```

### Feature Detection

```javascript
// Check if the browser supports beforeprint/afterprint events
const printEventsSupported = () => {
  return 'beforeprint' in window && 'afterprint' in window;
};

if (printEventsSupported()) {
  window.addEventListener('beforeprint', handleBeforePrint);
} else {
  // Fallback: use @media print in CSS or warn user
  console.warn('Print events not supported in this browser');
}
```

### Alternative: Using `window.matchMedia('print')`

As noted in the official documentation, `window.matchMedia('print')` provides wider browser support for detecting print scenarios:

```javascript
// More compatible approach (works in older browsers)
const mediaQueryList = window.matchMedia('print');

mediaQueryList.addListener((mql) => {
  if (mql.matches) {
    console.log('Entering print mode');
  } else {
    console.log('Exiting print mode');
  }
});

// Modern API (addEventListener)
mediaQueryList.addEventListener('change', (mql) => {
  if (mql.matches) {
    // Print mode active
  } else {
    // Print mode inactive
  }
});
```

---

## Known Issues & Workarounds

### Issue 1: Chrome & Chromium-Based Browsers
**Status:** Feature added in Chrome 63, now widely supported
**Impact:** Earlier versions (pre-2018) do not support these events
**Workaround:** Use `window.matchMedia('print')` for broader compatibility

**Reference:** [Chrome Issue #218205 - Implement beforeprint and afterprint events](https://bugs.chromium.org/p/chromium/issues/detail?id=218205)

### Issue 2: Safari Implementation
**Status:** Added in Safari 13 (2019), now fully supported
**Impact:** Earlier Safari versions do not support these events
**Workaround:** Feature detection with fallback to CSS media queries

**Reference:** [WebKit Bug #19937 - beforeprint/afterprint events](https://bugs.webkit.org/show_bug.cgi?id=19937)

### Issue 3: Mobile Browser Limitations
**Status:** Limited support in some mobile browsers (Samsung Internet, older Android browsers)
**Impact:** Print functionality may be unavailable on mobile
**Workaround:** Implement feature detection and provide graceful degradation

### Issue 4: Event Timing
**Note:** The `beforeprint` event fires when the print dialog opens, and `afterprint` fires when it closes—not when actually sending to printer. This is important for performance-sensitive operations.

### Issue 5: DOM Modifications During Print
**Best Practice:** Minimize heavy DOM manipulation in print event handlers. Avoid large reflows/repaints that could delay the print dialog.

---

## Compatibility Considerations

### No Prefix Required
The `beforeprint` and `afterprint` events require **no vendor prefixes** (`webkit`, `moz`, etc.).

### Fallback Strategy
For maximum compatibility, combine these events with CSS media queries:

```css
@media print {
  .no-print { display: none; }
  .print-only { display: block; }
}
```

```javascript
// JavaScript enhancement
window.addEventListener('beforeprint', () => {
  document.body.classList.add('print-mode');
});
```

### Feature Detection Pattern
```javascript
const hasPrintEvents = typeof window.onbeforeprint === 'function' ||
                       ('onbeforeprint' in window);

const hasMatchMedia = window.matchMedia &&
                      typeof window.matchMedia('print').addListener === 'function';

const printSupport = hasPrintEvents || hasMatchMedia ? 'Good' : 'Limited';
```

---

## Related Features & Links

### Official Resources
- **[MDN Web Docs - Detecting print requests](https://developer.mozilla.org/en-US/docs/Web/Guide/Printing#Detecting_print_requests)** - Comprehensive guide to print event detection
- **[WHATWG HTML Specification - Printing](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#printing)** - Official specification
- **[MDN - Window: beforeprint event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeprint_event)**
- **[MDN - Window: afterprint event](https://developer.mozilla.org/en-US/docs/Web/API/Window/afterprint_event)**

### Related Browser APIs
- **[`window.matchMedia('print')`](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#media_query_syntax)** - Broader browser support for print detection
- **[CSS `@media print`](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)** - CSS-based print styling
- **[`window.print()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print)** - Programmatically trigger print dialog
- **[Page Break API](https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-after)** - Control page breaks in printed output

### Browser Issue Trackers
- **[Chrome Issue #218205 - beforeprint/afterprint events](https://bugs.chromium.org/p/chromium/issues/detail?id=218205)**
- **[WebKit Bug #19937 - beforeprint/afterprint events](https://bugs.webkit.org/show_bug.cgi?id=19937)**

---

## Notes

> Due to its wider support, consider using `window.matchMedia('print')` where possible.

This note from the CanIUse database highlights an important implementation consideration: while `beforeprint` and `afterprint` events are well-supported in modern browsers, `window.matchMedia('print')` has broader compatibility across older browser versions and may be a better choice for projects requiring maximum backward compatibility.

**Recommendation:** Use `beforeprint`/`afterprint` events for modern applications with updated browser support requirements. For legacy application support, supplement with `window.matchMedia('print')` as a fallback detection mechanism.

---

## Version History

- **Internet Explorer 6** - Initial support (oldest supported version)
- **Firefox 6** (2011) - First Mozilla Firefox version with support
- **Chrome 63** (April 2018) - Added after years of community requests
- **Safari 13** (September 2019) - Finally implemented in WebKit
- **Opera 50** (August 2017) - Inherited support from Chromium base
- **iOS Safari 13** (September 2019) - Synchronized with macOS Safari

---

## Summary

The `beforeprint` and `afterprint` events are now widely supported across all modern browsers, making them a reliable choice for implementing sophisticated print functionality. With 90.82% global user support, they provide an excellent foundation for building dynamic, user-friendly printing features without requiring server-side solutions or complex workarounds.

For optimal compatibility and flexibility, combine these JavaScript events with CSS `@media print` rules and consider fallback to `window.matchMedia('print')` for older browser support.
