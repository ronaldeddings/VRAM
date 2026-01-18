# KeyboardEvent.location

## Overview

The `KeyboardEvent.location` property indicates the physical location of a key on the input device. This is particularly useful when dealing with keys that have multiple physical locations but represent the same logical key—such as the left or right "Control" keys, or the main keyboard versus numpad numeric keys.

## Description

The `location` property of a `KeyboardEvent` object provides information about where a key was pressed on the physical keyboard. This enables developers to distinguish between:

- **Left vs. Right modifiers**: Different locations for Shift, Control, Alt, and Meta keys
- **Main keyboard vs. Numpad keys**: Distinguishing between the main "1" key and numpad "1" key
- **Other duplicate keys**: Any other keys that appear in multiple physical locations

This is essential for applications that need fine-grained control over keyboard input, such as:
- Custom keyboard shortcuts that differentiate between left and right modifier keys
- Games requiring precise key location awareness
- Accessibility tools that need to map specific physical key locations
- Keyboard layout utilities and input method editors

## Specification Status

**Status**: Working Draft (WD)

**W3C Specification**: [UIEvents - KeyboardEvent.location](https://www.w3.org/TR/uievents/#dom-keyboardevent-location)

The property is defined as part of the W3C's UIEvents specification for DOM Level 3 Events.

## Categories

- **DOM** - Core DOM API

## Benefits and Use Cases

### Primary Use Cases

1. **Keyboard Shortcut Customization**
   - Differentiate between left and right modifier keys
   - Create shortcuts that require specific key locations
   - Implement ergonomic keyboard preferences

2. **Gaming Applications**
   - Precise control mapping for games
   - Differentiate between main keyboard and numpad input
   - Support custom control schemes

3. **Accessibility Features**
   - Map keys to specific physical locations
   - Assist users with specific keyboard layouts
   - Enable adaptive input methods

4. **Input Method Editors (IMEs)**
   - Handle different key locations for text input
   - Support multiple keyboard layouts
   - Improve input accuracy

5. **Keyboard Configuration Tools**
   - Allow users to customize key behavior by location
   - Display physical key layout information
   - Implement keyboard remapping utilities

### Key Benefits

- **Precise Key Identification**: Distinguish between physically different keys with the same logical meaning
- **Enhanced User Control**: Enable more granular keyboard customization
- **Improved Accessibility**: Support diverse input methods and physical keyboards
- **Better Gaming Experience**: Allow precise game control mapping
- **Cross-Platform Consistency**: Standardized way to handle key location data

## Browser Support

### Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully supported |
| ⚠️ | Partial/Alternate support |
| ❌ | Not supported |
| ❓ | Unknown support |

### Detailed Browser Support Table

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 30 | ✅ Full support | Versions 4-29 used non-standard `keyLocation` property |
| **Edge** | 12 | ✅ Full support | All versions from 12 onward support the standard property |
| **Firefox** | 15 | ✅ Full support | Full support since version 15 |
| **Safari** | 6.1 | ✅ Full support | Versions 3.1-6 had limited or non-standard support |
| **Opera** | 12.1 | ✅ Full support | Earlier versions (9-11) had no support |
| **iOS Safari** | 8 | ✅ Full support | Versions below 8 had partial/non-standard support |
| **Android Browser** | 4.4 | ✅ Full support | Versions 2.1-4.3 had partial support |
| **Opera Mini** | None | ❌ No support | Not supported in any version |
| **Internet Explorer** | 9 | ✅ Full support | IE 5.5-8 did not support this feature |
| **Samsung Internet** | 4 | ✅ Full support | Supported since version 4 |

### Mobile and Alternative Browsers

| Browser | Support | Details |
|---------|---------|---------|
| **Android Chrome** | ✅ | Supported (version 142+) |
| **Android Firefox** | ✅ | Supported (version 144+) |
| **Android UC Browser** | ✅ | Supported (version 15.5+) |
| **Opera Mobile** | ✅ | Supported since version 12.1 |
| **IE Mobile** | ✅ | Supported (versions 10-11) |
| **Blackberry Browser** | ⚠️ | Partial support (versions 7, 10 used non-standard property) |
| **Opera Mini** | ❌ | Not supported (all versions) |
| **KaiOS** | ✅ | Supported (versions 2.5+) |

### Global Usage

- **Supported (y)**: 93.58%
- **Partial/Alternate (a)**: 0.01%
- **Not Supported (n)**: 6.41%

## Implementation Notes

### Non-Standard Property Alternative

Some older browsers (Chrome 4-29, Safari 4-5, Opera 15-16, iOS Safari 5.0-7.1, Android 2.3-4.3, Blackberry) used a non-standard property called `keyLocation` from an earlier draft of the DOM Level 3 Events specification instead of the standard `location` property.

**Legacy Code Pattern**:
```javascript
// For compatibility with older browsers
const location = event.location || event.keyLocation;
```

### Location Values

The `location` property returns a numeric constant:

- `0` (KeyboardEvent.DOM_KEY_LOCATION_STANDARD): Main keyboard area
- `1` (KeyboardEvent.DOM_KEY_LOCATION_LEFT): Left side of a duplicated key
- `2` (KeyboardEvent.DOM_KEY_LOCATION_RIGHT): Right side of a duplicated key
- `3` (KeyboardEvent.DOM_KEY_LOCATION_NUMPAD): Numpad area

## Code Examples

### Basic Usage

```javascript
document.addEventListener('keydown', (event) => {
  console.log(`Key: ${event.key}, Location: ${event.location}`);

  // Distinguish between left and right Shift
  if (event.key === 'Shift') {
    if (event.location === 1) {
      console.log('Left Shift pressed');
    } else if (event.location === 2) {
      console.log('Right Shift pressed');
    }
  }
});
```

### Numpad Detection

```javascript
document.addEventListener('keydown', (event) => {
  if (event.location === 3) {
    console.log('Numpad key pressed:', event.key);
  }
});
```

### Modifier Key Detection

```javascript
document.addEventListener('keydown', (event) => {
  const modifierKeys = ['Control', 'Shift', 'Alt', 'Meta'];

  if (modifierKeys.includes(event.key)) {
    const side = event.location === 1 ? 'Left' : 'Right';
    console.log(`${side} ${event.key} pressed`);
  }
});
```

### Compatibility Helper

```javascript
function getKeyLocation(event) {
  // Handle both standard and legacy property
  return event.location !== undefined ? event.location : event.keyLocation;
}

document.addEventListener('keydown', (event) => {
  const location = getKeyLocation(event);
  console.log(`Location: ${location}`);
});
```

## Related Resources

### Official Documentation

- [MDN Web Docs - KeyboardEvent.location](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
- [W3C UIEvents Specification](https://www.w3.org/TR/uievents/#dom-keyboardevent-location)

### Related APIs

- [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
- [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
- [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
- [keydown event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
- [keyup event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event)

## Best Practices

1. **Check for Support**: While modern browsers support this property, always check if it's available for older browser compatibility.

2. **Combine with event.key**: Use `location` together with `event.key` for complete keyboard handling.

3. **Use Standard Property**: Prefer `event.location` over the legacy `event.keyLocation` for new code.

4. **Test Across Devices**: Keyboard behavior may vary across different devices and operating systems.

5. **Provide Fallbacks**: For critical functionality, provide alternative input methods for users on unsupported devices.

## Keywords

- keyboard
- event
- key
- location
- keyLocation (legacy)
- numpad
- modifier keys
- DOM API
- UI Events

---

**Last Updated**: 2025

**Feature Status**: Widely supported in modern browsers with excellent cross-platform coverage.
