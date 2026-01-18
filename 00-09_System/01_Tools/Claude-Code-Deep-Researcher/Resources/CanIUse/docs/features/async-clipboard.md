# Asynchronous Clipboard API

## Overview

The **Asynchronous Clipboard API** is a modern, Promise-based approach to accessing the system clipboard. It provides a secure and reliable way for web applications to read from and write to the user's clipboard asynchronously, replacing the older synchronous clipboard access methods.

## Description

A modern, asynchronous Clipboard API based on Promises that allows web applications to interact with the system clipboard in a non-blocking manner. This API improves upon the legacy clipboard APIs by providing better security, user control, and error handling through Promise-based asynchronous operations.

## Specification

- **Status**: Working Draft (WD)
- **W3C Specification**: [Clipboard APIs - Async Clipboard API](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api)

## Category

- **JavaScript API**

## Key Features

### Core Methods

The Async Clipboard API provides the following key methods on the `navigator.clipboard` object:

- **`readText()`** - Read plain text from the clipboard
- **`writeText()`** - Write plain text to the clipboard
- **`read()`** - Read formatted data (text, images, etc.) from the clipboard
- **`write()`** - Write formatted data to the clipboard

### Security & Permissions

- Requires user interaction (paste or copy gesture) for clipboard access
- Chromium-based browsers require the `clipboard-write` permission
- Safari displays a "Paste" permission prompt for users to authorize access
- Provides better security than the deprecated synchronous clipboard APIs

## Benefits & Use Cases

### Key Benefits

1. **Non-Blocking Operations**: Async/await syntax prevents UI freezing
2. **Better Security**: Explicit user permission and limited access scope
3. **Improved Error Handling**: Promise-based error management
4. **Modern JavaScript Patterns**: Works seamlessly with modern async/await code
5. **Standardized API**: Replaces various browser-specific clipboard implementations
6. **Rich Content Support**: Handle both text and binary data (images, files)

### Common Use Cases

- **Copy-to-Clipboard Buttons**: Allow users to copy text content with a single click
- **Paste-from-Clipboard Features**: Enable importing data from user's clipboard
- **Note-Taking Applications**: Clipboard-based content management
- **Code Editors**: Code snippet sharing and pasting
- **Design Tools**: Image and asset clipboard integration
- **Developer Tools**: Copying API responses, debug information, or generated code
- **Social Media Sharing**: Quick sharing of links and content
- **Rich Text Editing**: Clipboard operations for WYSIWYG editors

## Browser Support

### Summary by Browser

| Browser | First Support | Notes |
|---------|---|---|
| **Chrome** | 66+ | Full support |
| **Edge** | 79+ | Full support |
| **Firefox** | 125+ | Full support (was partial from 63-124) |
| **Safari** | 13.1+ | Full support |
| **Opera** | 53+ | Full support |
| **iOS Safari** | 14.0+ | Full support |
| **Chrome Android** | 142+ | Full support |
| **Firefox Android** | 144+ | Full support |
| **Samsung Internet** | 25+ | Full support (was partial from 9.2-24) |
| **Opera Mobile** | 80+ | Full support |
| **UC Browser Android** | 15.5+ | Full support |
| **QQ Browser Android** | 14.9+ | Full support |
| **Baidu Browser** | 13.52+ | Full support |

### Legacy/Unsupported Browsers

| Browser | Support |
|---------|---|
| **Internet Explorer** | ❌ Not supported (all versions) |
| **Opera Mini** | ❌ Not supported |
| **BlackBerry** | ❌ Not supported |
| **KaiOS** | ⚠️ Partial (KaiOS 2.5: no support, KaiOS 3.0-3.1: partial support) |

### Platform Coverage

- **Desktop**: 91.84% global usage (all modern browsers)
- **Mobile**: Strong support across modern iOS and Android devices
- **Partial Support**: 0.79% of browsers with limitations

## Detailed Browser Support

### Chromium Browsers
- **Chrome**: Full support from version 66+
- **Edge**: Full support from version 79+
- **Opera**: Full support from version 53+
- **Opera Mobile**: Full support from version 80+
- **UC Browser Android**: Full support from version 15.5+

### Mozilla Firefox
- **Firefox Desktop**: Full support from version 125+ (partial from 63-124 with write-only support)
- **Firefox Android**: Full support from version 144+

### Apple Safari
- **Safari Desktop**: Full support from version 13.1+
- **iOS Safari**: Full support from version 14.0+

### Samsung & Other Android Browsers
- **Samsung Internet**: Full support from version 25+ (partial from 9.2-24)
- **Chrome Android**: Full support from version 142+
- **Baidu Browser**: Full support from version 13.52+
- **QQ Browser**: Full support from version 14.9+

## Implementation Notes

### Security Considerations

The Async Clipboard API handles security differently across browsers:

1. **Chromium Browsers** (Chrome, Edge, Opera)
   - Require the `clipboard-write` permission to be granted
   - Permission is typically granted through user gestures (click, keyboard input)
   - Reading and writing both require user permission

2. **Safari Browsers**
   - Display a "Paste" authorization option when clipboard reading is attempted
   - Users must explicitly approve clipboard access
   - More lenient for write operations than read operations

### Partial Support Details

- **Firefox 63-124**: Only supports the `writeText()` method (write-only)
- **Samsung Internet 9.2-24**: Supports writing to clipboard but not reading
- **KaiOS 3.0-3.1**: Partial implementation with write-only support
- **Android Browser 142**: Supports writing to clipboard but not reading

### Usage Recommendations

- Always wrap clipboard operations in try-catch blocks for error handling
- Check for `navigator.clipboard` availability before using the API
- Provide fallback mechanisms for older browsers or restricted environments
- Use the API within user-initiated events (clicks, keyboard input) for best compatibility
- Test clipboard permissions across target browsers before deployment

## Code Examples

### Basic Text Copy
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

### Basic Text Paste
```javascript
async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Clipboard content:', text);
    return text;
  } catch (err) {
    console.error('Failed to read clipboard:', err);
  }
}
```

### Feature Detection
```javascript
function hasClipboardAPI() {
  return navigator.clipboard && navigator.clipboard.writeText;
}

if (hasClipboardAPI()) {
  // Use Async Clipboard API
} else {
  // Use fallback method (e.g., older document.execCommand)
}
```

### With Rich Media
```javascript
async function copyImage(imageBlob) {
  try {
    const data = [new ClipboardItem({
      'image/png': imageBlob
    })];
    await navigator.clipboard.write(data);
    console.log('Image copied to clipboard');
  } catch (err) {
    console.error('Failed to copy image:', err);
  }
}
```

## Known Issues & Workarounds

### Firefox Partial Support (Pre-125)
- Firefox versions before 125 only support `writeText()` method
- The `read()` and `readText()` methods are not available
- **Workaround**: Detect Firefox version and use fallback for read operations

### Safari Paste Authorization
- Safari displays an authorization dialog for read operations
- This may affect user experience but is a security measure
- **Workaround**: Document the permission flow for users

### Permission Handling
- Some browsers may deny clipboard access in iframes or sandboxed contexts
- Private browsing mode may restrict clipboard access
- **Workaround**: Provide informative error messages and fallback UI

### Mobile Platform Variations
- Mobile browsers have varying levels of clipboard support
- Some require explicit user permissions
- **Workaround**: Test thoroughly across target mobile platforms and provide appropriate fallbacks

## Related Standards & APIs

- **[Clipboard Events](https://www.w3.org/TR/clipboard-apis/#clipboard-event-api)** - Legacy clipboard API using copy/paste events
- **[File API](https://w3c.github.io/FileAPI/)** - For working with files and blobs in clipboard operations
- **[Data Transfer API](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-object)** - Related drag-and-drop clipboard functionality

## External Resources

### Official Documentation
- **[MDN Web Docs - Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)** - Comprehensive MDN reference and examples
- **[W3C Async Clipboard Explainer](https://github.com/w3c/clipboard-apis/blob/master/explainer.adoc)** - Official W3C explainer document

### Articles & Guides
- **[Unlocking Clipboard Access - Web.dev](https://web.dev/async-clipboard/)** - Detailed guide on using the Async Clipboard API from Google Web Fundamentals

### Bug Tracking
- **[Firefox Implementation](https://bugzilla.mozilla.org/show_bug.cgi?id=1619251)** - Firefox bug tracker for Async Clipboard API implementation

## Browser Statistics

- **Full Support**: 91.84% of global users
- **Partial Support**: 0.79% of global users
- **No Support**: 7.37% of global users

## Summary

The Asynchronous Clipboard API is now broadly supported across all modern browsers, making it a safe choice for contemporary web applications. With support for both text and rich media content, and built-in security measures, it represents the modern standard for clipboard interaction in web applications. While some legacy browsers lack support, the widespread adoption across Chrome, Firefox, Safari, and Edge makes it suitable for most production deployments targeting modern browsers.

---

*Last updated: December 2024*
*Data source: CanIUse.com*
