# KeyboardEvent.key

## Overview

The `KeyboardEvent.key` property provides a string value that identifies the key pressed during a keyboard event. This is a critical API for handling keyboard input in web applications with proper support for character keys, non-character keys (such as arrow keys), and dead keys.

## Description

`KeyboardEvent.key` is a read-only property that returns a string representing the key that was pressed. Unlike the deprecated `keyCode` property which returns numeric codes, this property provides human-readable key identifiers that are consistent across different browsers and keyboard layouts.

### Key Characteristics

- Returns a string representing the actual key pressed (e.g., "a", "Enter", "ArrowUp")
- Respects keyboard layouts and locale settings
- Supports all key types: printable characters, function keys, modifier keys, and control characters
- Values are standardized according to the UI Events specification

## Specification

- **Status**: Working Draft (WD)
- **Specification URL**: https://www.w3.org/TR/uievents/#dom-keyboardevent-key
- **Detailed Key Values**: https://www.w3.org/TR/DOM-Level-3-Events-key/

## Categories

- DOM (Document Object Model)

## Benefits & Use Cases

### Common Use Cases

1. **Keyboard Shortcuts**: Implement application-specific keyboard shortcuts (e.g., Ctrl+S for save)
2. **Game Controls**: Handle keyboard input for game development
3. **Text Input Validation**: Process and validate user input in real-time
4. **Accessibility**: Provide keyboard navigation alternatives to mouse interactions
5. **Form Handling**: Implement Enter-key submission and Tab-key navigation
6. **Search Functionality**: Trigger search on specific key presses
7. **Menu Navigation**: Handle arrow keys for menu navigation

### Key Benefits

- **Human-Readable**: Direct string values are more intuitive than numeric codes
- **Layout-Aware**: Respects user's keyboard layout configuration
- **Standardized**: Consistent behavior across modern browsers
- **Locale-Sensitive**: Properly handles international keyboard layouts
- **Complete Coverage**: Covers character keys, function keys, and special keys

## Browser Support

### Support Legend

- **y**: Fully supported
- **a #n**: Partial support with notes (see Notes section)
- **u**: Unknown support
- **n**: Not supported

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| Chrome | 51+ | ✅ Fully supported |
| Firefox | 29+ | ✅ Fully supported |
| Safari | 10.1+ | ✅ Fully supported |
| Edge | 79+ | ✅ Fully supported (Chromium-based) |
| Opera | 38+ | ✅ Fully supported |
| Internet Explorer | 9-11 | ⚠️ Partial support with non-standard identifiers |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|---------------|---|
| iOS Safari | 10.3+ | ✅ Fully supported |
| Android Chrome | 51+ | ✅ Fully supported |
| Android Firefox | 29+ | ✅ Fully supported |
| Samsung Internet | 5.0+ | ✅ Fully supported |
| Opera Mini | All | ✅ Fully supported |
| Android Browser | 4.4.3+ | ❌ Not supported (legacy) |

### Detailed Version Support

#### Chrome
- **No support**: Versions 4-50
- **Full support**: Version 51+

#### Firefox
- **No support**: Versions 2-22
- **Partial support** (returns "MozPrintableKey"): Versions 23-28
- **Full support**: Version 29+

#### Safari
- **No support**: Versions 3.1-10.0
- **Full support**: Version 10.1+

#### Edge
- **Partial support** with non-standard identifiers: Versions 12-78
- **Full support**: Version 79+

#### Opera
- **No support**: Versions 9-37
- **Unknown support**: Version 12
- **Full support**: Version 12.1+ and 38+

#### Internet Explorer
- **No support**: IE 5.5-8
- **Partial support** with non-standard identifiers and AltGraph issues: IE 9-11

## Implementation Example

```javascript
document.addEventListener('keydown', (event) => {
  console.log(`Key pressed: ${event.key}`);

  // Handle specific keys
  if (event.key === 'Enter') {
    // Handle Enter key
    handleSubmit();
  } else if (event.key === 'ArrowUp') {
    // Handle arrow up
    moveUp();
  } else if (event.key === 'a' && event.ctrlKey) {
    // Handle Ctrl+A
    selectAll();
  }
});
```

## Important Notes

### Mobile Virtual Keyboard Behavior
On mobile devices with virtual keyboards, browser behavior differs:
- **Blink and WebKit-based browsers** (Chrome, Safari, Edge): Report `"Unidentified"` for every key
- **Gecko-based browsers** (Firefox): Report `"Process"` for virtual keyboard input

### IME (Input Method Editor) Considerations
Some key events or their values might be suppressed by the Input Method Editor in use. This is particularly important for languages that use composition (like Japanese, Chinese, or Korean).

### Non-Standard Behavior

#### Firefox (Versions 23-28)
Earlier Firefox versions returned `"MozPrintableKey"` for all character keys instead of the actual key value. Upgrade to Firefox 29+ for standard behavior.

#### Internet Explorer & Legacy Edge
- Uses non-standard key identifiers
- Incorrect behavior with the AltGraph key
- Consider using polyfills for IE support

### Polyfill & Compatibility Layer

For projects requiring Internet Explorer support, use the [shim-keyboard-event-key](https://github.com/shvaikalesh/shim-keyboard-event-key) library to normalize key identifiers.

## Browser Support Statistics

- **Global Support**: 93.14% (with full support)
- **Partial Support**: 0.38%
- **No Support**: ~6.48%

## Related Resources

### Official Documentation
- [MDN Web Docs - KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
- [W3C UI Events Specification](https://www.w3.org/TR/uievents/#dom-keyboardevent-key)
- [Complete List of Key Values](https://www.w3.org/TR/DOM-Level-3-Events-key/)

### Issue Tracking & Discussions
- [Chrome Tracking Bug](https://code.google.com/p/chromium/issues/detail?id=227231)
- [WebKit Feature Request](https://bugs.webkit.org/show_bug.cgi?id=69029)
- [Microsoft Edge Issue](https://web.archive.org/web/20190401104951/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8860571/)

### Polyfills & Shims
- [shim-keyboard-event-key](https://github.com/shvaikalesh/shim-keyboard-event-key) - Provides standard key identifiers for IE and legacy Edge

## Migration from keyCode

If you're migrating from the deprecated `keyCode` property:

```javascript
// Old way (deprecated)
document.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) { // 13 is Enter
    handleSubmit();
  }
});

// New way (recommended)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
});
```

## Conclusion

`KeyboardEvent.key` is a stable, well-supported API that should be the preferred method for handling keyboard input in modern web applications. With 93%+ global support and full implementation in all current browser versions, it provides a reliable and standardized way to detect and respond to keyboard events.

For applications that must support Internet Explorer, consider using the shim-keyboard-event-key polyfill to provide consistent behavior across all browsers.
