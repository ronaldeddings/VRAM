# Selection API

## Overview

The Selection API provides developers with the ability to access and manipulate selected content within a document. This is a fundamental API for creating rich text editing applications, implementing copy-to-clipboard functionality, and building interactive text-based features.

## Description

The Selection API enables JavaScript code to programmatically interact with text selections in the browser. The API includes:

- **`window.getSelection()`** - Method to retrieve the current text selection
- **`selectstart` event** - Fires when the user initiates a selection
- **`selectionchange` event** - Fires when the selection changes (on `document`)

These features allow developers to build custom text selection behaviors, implement sophisticated text editing interfaces, and create enhanced user experiences around text content.

## Specification

- **Official Spec**: [W3C Selection API](https://www.w3.org/TR/selection-api/)
- **Status**: Working Draft (WD)
- **Maturity Level**: Moderately mature with broad browser support

## Categories

- **JavaScript API**

## Benefits & Use Cases

### Primary Use Cases

1. **Text Editors & Rich Text Applications**
   - Detect and respond to text selection changes
   - Build custom text editing interfaces
   - Implement selection-based formatting tools

2. **Copy-to-Clipboard Features**
   - Provide enhanced clipboard functionality
   - Create one-click copy buttons with custom selection behavior
   - Implement clipboard manager features

3. **Accessibility Features**
   - Announce selected text to screen readers
   - Provide selection-based navigation
   - Support selection-based content highlighting

4. **Search & Highlighting**
   - Highlight search results dynamically
   - Implement find-and-highlight functionality
   - Create selection-based search behaviors

5. **Text Analysis Tools**
   - Analyze selected text properties
   - Implement selection-based statistics (word count, character count)
   - Build text-based analytics features

### Key Benefits

- **Standard API**: Part of official W3C specification with consistent implementation
- **Broad Support**: Supported across all modern browsers
- **Event-Driven**: Integrates with standard event system
- **Developer-Friendly**: Simple API with clear semantics

## Browser Support

The following table shows Selection API support across major browsers:

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 15+ | Full Support | Complete implementation |
| **Edge** | 12+ | Full Support | Complete implementation |
| **Firefox** | 52+ | Full Support | Full support from v52+ (limited in older versions) |
| **Safari** | 5.1+ | Full Support | Full support from v5.1+ |
| **Opera** | 15+ | Full Support | Complete implementation |
| **Internet Explorer** | 9+ | Partial Support | IE 9-11 have full support; IE 6-8 have limited support |
| **iOS Safari** | 5.0-5.1+ | Partial Support | Supports core API but does not support `selectstart` event |
| **Android Browser** | 4.2+ | Full Support | Full support from v4.2+ |
| **Samsung Internet** | 4+ | Full Support | Complete implementation |

### Global Usage Statistics

- **Full Support (Y)**: 84.22% of users
- **Partial Support (A)**: 9.47% of users
- **No Support (N)**: <1% of users

This represents excellent coverage for modern web development.

## Implementation Notes

### Browser-Specific Limitations

#### #1: Limited `getSelection()` or Event Support
**Affected Browsers**: Firefox 2-51, Opera 9-12.1, iOS Safari 3.2-4.1, Opera Mini (all versions)

Older versions of Firefox and Opera support `window.getSelection()` but lack the selection events (`selectstart` and `selectionchange`). These browsers can detect selections but cannot listen to selection changes in real-time.

#### #2: Selection Events Without `getSelection()`
**Affected Browsers**: Internet Explorer 6-8

These older IE versions support selection events but not the `window.getSelection()` method, limiting the ability to programmatically access selected text content.

#### #3: No `selectstart` Event Support
**Affected Browsers**: iOS Safari (all versions)

iOS Safari supports the core Selection API and `selectionchange` events, but does not implement the `selectstart` event. This affects use cases that require detecting when a selection begins.

#### #4: `getSelection()` Timing Issue
**Affected Browsers**: Android Browser 4.2-4.3

On these versions, `window.getSelection()` may fail when called from button tap listeners, as the selection is lost immediately before the listener code executes.

#### #5: Feature Behind Flag
**Affected Browsers**: Firefox 43-51, KaiOS 2.5

Selection events are supported but disabled by default. They can be enabled via the `dom.select_events.enabled` flag in Firefox's about:config.

## Related APIs

For complete text manipulation and selection capabilities, consider these related APIs:

- **[DOM Range API](https://caniuse.com/dom-range)** - Access and manipulate ranges of content (complementary to Selection API)
- **[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)** - Modern clipboard access
- **[execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)** - Execute editing commands (deprecated but widely supported)

## Resources & References

### Official Documentation

- [MDN Web Docs - Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection)
- [W3C Selection API Specification](https://www.w3.org/TR/selection-api/)
- [MDN - window.getSelection()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection)
- [MDN - selectionchange Event](https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event)
- [MDN - selectstart Event](https://developer.mozilla.org/en-US/docs/Web/API/Element/selectstart_event)

### Related Discussions

- [Firefox Support Bug Tracker](https://bugzilla.mozilla.org/show_bug.cgi?id=1231923)

## Example Code

### Basic Selection Detection

```javascript
// Get the current selection
const selection = window.getSelection();

// Check if there is a selection
if (selection.toString().length > 0) {
  console.log('Selected text:', selection.toString());
}
```

### Listening to Selection Changes

```javascript
// Listen for selection changes
document.addEventListener('selectionchange', function() {
  const selection = window.getSelection();
  console.log('Selection changed:', selection.toString());
});
```

### Clearing Selection

```javascript
// Remove the current selection
window.getSelection().removeAllRanges();
```

### Getting Selection Range Details

```javascript
const selection = window.getSelection();
if (selection.rangeCount > 0) {
  const range = selection.getRangeAt(0);
  console.log('Start:', range.startContainer, range.startOffset);
  console.log('End:', range.endContainer, range.endOffset);
}
```

## Migration Guide

### From Older Methods

If you've been using `document.selection` (IE legacy API), migrate to the standard API:

```javascript
// Old IE-only approach
// var selection = document.selection.createRange().text;

// Modern standard approach
var selection = window.getSelection().toString();
```

## Recommendations

### When to Use Selection API

- **✅ Use when**: You need to detect or respond to user text selections
- **✅ Use when**: Building text editors or rich content applications
- **✅ Use when**: Creating enhanced clipboard features
- **✅ Use when**: Implementing text-based analytics or accessibility features

### Browser Support Considerations

For most modern web applications, the Selection API has sufficient support (84.22% full support). However, consider:

- **iOS Safari**: Lacks `selectstart` event; use `selectionchange` for selection detection
- **Older IE**: If supporting IE 6-8, use feature detection and fallbacks
- **Android 4.2-4.3**: Be aware of timing issues with `getSelection()` in button handlers

### Feature Detection

```javascript
// Detect Selection API support
if (typeof window.getSelection === 'function') {
  console.log('Selection API is supported');
} else {
  console.log('Selection API not available');
}

// Detect selection events
if ('onselectionchange' in document) {
  console.log('selectionchange event is supported');
}
```

## Performance Considerations

- Selection changes fire frequently; use event debouncing if needed
- `window.getSelection()` is lightweight and safe to call repeatedly
- Avoid excessive DOM manipulation in `selectionchange` event handlers

---

**Last Updated**: December 2024
**Based on CanIUse Data**: Global usage 84.22% full support + 9.47% partial support
