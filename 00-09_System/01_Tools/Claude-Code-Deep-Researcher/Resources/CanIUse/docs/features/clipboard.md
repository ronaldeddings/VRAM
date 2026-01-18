# Synchronous Clipboard API

## Overview

The Synchronous Clipboard API provides JavaScript developers with programmatic access to copy, cut, and paste events, as well as direct interaction with the operating system clipboard. This API enables web applications to read from and write to the user's clipboard, supporting text and URL data types with proper security constraints.

## Description

API to provide copy, cut and paste events as well as provide access to the OS clipboard.

## Specification Status

**Status:** Working Draft (WD)
**Specification:** [W3C Clipboard APIs](https://www.w3.org/TR/clipboard-apis/)

## Categories

- JavaScript API

## Benefits and Use Cases

### Key Benefits

- **User Workflow Integration** - Enable seamless clipboard operations within web applications
- **Enhanced Copy/Paste UX** - Programmatically handle clipboard events for better user experience
- **Data Transfer** - Facilitate efficient data sharing between applications and the clipboard
- **Accessibility** - Support keyboard shortcuts and accessibility features for clipboard operations

### Common Use Cases

1. **Copy-to-Clipboard Buttons** - One-click copying of text, codes, or links
2. **Rich Text Editors** - Handle paste events with proper formatting
3. **Code Snippet Tools** - Allow users to copy code snippets with custom formatting
4. **Data Management** - Detect and handle cut/copy operations in data-sensitive applications
5. **Developer Tools** - Provide clipboard integration for build tools and IDEs

## Browser Support

| Browser | First Version | Notes |
|---------|---------------|-------|
| **Chrome** | 13 | Partial support (limited to events); Full API from Chrome 58+ |
| **Edge** | 12 | Partial support; Async API from Edge 79+ |
| **Firefox** | 22 | Partial support (events only); Async operations from Firefox 41+ |
| **Safari** | 4 | Partial support initially; Full support from Safari 12+ |
| **Opera** | 12.1 | Partial support (events); Full API from Opera 45+ |
| **iOS Safari** | 5.0+ | Partial support; Full support from iOS 12+ |
| **Android Browser** | 4.4 | Partial support (events) |
| **Chrome for Android** | 142+ | Full support |
| **Firefox Android** | 144+ | Paste event only |
| **Samsung Internet** | 4+ | Partial support; Full from version 7.2+ |

### Support Legend

- **y** - Fully Supported
- **a** - Partial Support
- **n** - Not Supported
- **u** - Unknown

## Desktop Browser Support Summary

| Browser | Support Level | First Version |
|---------|---------------|---------------|
| Chrome | Full (Async) | 58+ |
| Edge | Full (Async) | 79+ |
| Firefox | Full (Async) | 41+ |
| Safari | Full | 12+ |
| Opera | Full (Async) | 45+ |

## Mobile Browser Support Summary

| Platform | Support Level | First Version |
|----------|---------------|---------------|
| iOS Safari | Full | 12+ |
| Android (native) | Partial | 4.4+ |
| Chrome Mobile | Full | 142+ |
| Firefox Mobile | Paste only | 144+ |
| Samsung Internet | Full (Async) | 7.2+ |

## Known Issues and Bugs

### Firefox Bug (Pre-v41)

**Issue:** Before Firefox 41, `queryCommandEnabled()` and `execCommand()` with arguments `cut`, `copy`, or `paste` would throw errors instead of returning `false`.

**Impact:** Applications targeting older Firefox versions need error handling for clipboard operations.

**Status:** Resolved in Firefox 41+

## Implementation Considerations

### Security

- **User Action Requirement** - Chrome 42+, Opera 29+, and Firefox 41+ restrict clipboard reading/writing to user-initiated actions (click events, keydown, etc.)
- **IE Security Prompt** - Internet Explorer displays a security prompt when accessing the OS clipboard
- **Secure Context** - Modern implementations require secure (HTTPS) contexts

### Event Limitations by Browser

#### IE/Edge (Pre-v79)
- Only supports `Text` and `URL` data types
- Uses non-standard method (`window.clipboardData`)
- Fires `copy` event only on valid selections
- `cut` and `paste` only in focused editable fields

#### Firefox (Versions 22-40)
- Only fires `copy` event on valid selections
- `cut` and `paste` only in focused editable fields
- No `ClipboardEvent` constructor support

#### Safari & Opera
- Does not support `ClipboardEvent` constructor
- Limited to shortcut key-based clipboard access (not via `document.execCommand()`)

#### Modern Implementations (Chrome 58+, Firefox 41+, Edge 79+)
- Support cut & copy events without focused editable field
- Do not fire `paste` with `document.execCommand('paste')`
- Support asynchronous Clipboard API for better control

### Async vs Synchronous

The modern Asynchronous Clipboard API (`navigator.clipboard.writeText()`, `navigator.clipboard.readText()`) is recommended over synchronous `document.execCommand()` for:
- Better security model
- Promise-based error handling
- Support for richer data types
- Explicit user permission requests

## Usage Statistics

- **Full Support (y):** 10.42% of users
- **Partial Support (a):** 83.2% of users
- **No Support (n):** 6.38% of users

## Related Links

- [MDN Web Docs - ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)
- [W3C Clipboard APIs Specification](https://www.w3.org/TR/clipboard-apis/)
- [Guide on Cross-Platform Clipboard Access](https://www.lucidchart.com/techblog/2014/12/02/definitive-guide-copying-pasting-javascript/)

## Implementation Examples

### Basic Copy Event Handler

```javascript
document.addEventListener('copy', (event) => {
  const selectedText = window.getSelection().toString();
  event.clipboardData.setData('text/plain', selectedText);
  event.preventDefault();
});
```

### Async Clipboard Writing (Modern)

```javascript
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
```

### Async Clipboard Reading (Modern)

```javascript
async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Clipboard content:', text);
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
}
```

## Recommendations

1. **Prefer Async API** - Use the modern Asynchronous Clipboard API for new projects
2. **User Feedback** - Always provide visual feedback when clipboard operations occur
3. **Error Handling** - Implement robust error handling for clipboard access failures
4. **Security Awareness** - Be mindful of clipboard privacy concerns and user expectations
5. **Feature Detection** - Check for feature support before using clipboard APIs

## Keywords

`cut`, `copy`, `paste`, `clipboarddata`, `clipboardevent`
