# KeyboardEvent.charCode

## Overview

A legacy `KeyboardEvent` property that gives the Unicode codepoint number of a character key pressed during a `keypress` event.

## Description

`KeyboardEvent.charCode` is a deprecated property that returns the Unicode value of the character represented by the key that was pressed during a `keypress` event. This property was used in earlier web development to capture character input from the keyboard.

**Important Note:** This property is **legacy and deprecated**. Modern development should use [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) or [`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) instead, which provide more reliable and standardized ways to handle keyboard input.

## Specification Status

- **Status:** Unofficial (unoff)
- **Specification:** [W3C UIEvents Specification](https://w3c.github.io/uievents/#dom-keyboardevent-charcode)

## Categories

- DOM (Document Object Model)

## Use Cases & Benefits

While `charCode` is deprecated, understanding it is useful for:

1. **Legacy Code Maintenance** - Maintaining or updating older web applications that still use this property
2. **Cross-Browser Compatibility** - Understanding why older code may have workarounds
3. **Text Input Handling** - Historically used to capture and validate character input
4. **Custom Keyboard Handlers** - Building custom keyboard event handling in legacy systems
5. **Character Code Detection** - Determining what character was pressed based on its Unicode value

## Browser Support

### Legend

| Symbol | Meaning |
|--------|---------|
| `y` | Full support |
| `n` | No support |
| `u` | Partial/Unknown support |
| `#` | Notes apply to this entry |

### Desktop Browsers

| Browser | Minimum Version | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Chrome** | 4+ | Supported | Full support from v4 onwards |
| **Edge** | 12+ | Supported | Full support from v12 onwards |
| **Firefox** | 3+ | Supported | Partial support in v2, full from v3 |
| **Internet Explorer** | 9+ | Supported | No support in IE 5.5-8, full from IE 9 |
| **Opera** | 12.1+ | Supported | No support before v12, unsupported in v12, full from v12.1 |
| **Safari** | 4+ | Supported | Partial support in v3.1-3.2, full from v4 |

### Mobile & Tablet Browsers

| Browser | Minimum Version | Current Status | Notes |
|---------|-----------------|----------------|-------|
| **Android Browser** | 2.3+ | Supported | Partial in v2.1-2.2, full from v2.3 |
| **BlackBerry** | 7+ | Supported | Full support from v7 |
| **iOS Safari** | 5.0+ | Supported | Partial in v3.2-4.2, full from v5.0 |
| **Opera Mini** | All | Not Supported | No support in any version |
| **Opera Mobile** | 12.1+ | Supported | No support before v12, partial in v12, full from v12.1 |
| **Samsung Internet** | 4+ | Supported | Full support from v4 onwards |
| **UC Browser** | 15.5+ | Supported | Full support from v15.5 |
| **Android Firefox** | 144 | Not Supported | Does not support keypress event |
| **IE Mobile** | 10-11 | Not Supported | Does not support keypress event |
| **QQ Browser** | 14.9+ | Supported | Full support from v14.9 |
| **Baidu Browser** | 13.52+ | Supported | Full support from v13.52 |
| **KaiOS** | 2.5+ | Supported | Full support from v2.5 |

### Overall Support Coverage

- **Global Usage:** 93.35% of tracked browsers support this feature
- **Partial Support:** 0%
- **No Support:** Limited to Opera Mini and some mobile browsers

## Important Notes

### Limitations & Deprecation Warnings

1. **Legacy Property** - This property is deprecated and should not be used in new projects
2. **IME Suppression** - Some key events or their values might be suppressed by the Input Method Editor (IME) in use
3. **Mobile Keyboards** - On mobile devices with virtual keyboards, all keys may be reported as 0
4. **keypress Event Dependency** - This property is only meaningful during `keypress` events, which is also deprecated

### Migration Guide

Replace `charCode` usage with modern alternatives:

```javascript
// Old approach (deprecated)
document.addEventListener('keypress', (event) => {
  const charCode = event.charCode;
  console.log('Character code:', charCode);
});

// Modern approach
document.addEventListener('keydown', (event) => {
  const key = event.key;
  const code = event.code;
  console.log('Key:', key, 'Code:', code);
});

// For character input specifically
document.addEventListener('input', (event) => {
  const character = event.target.value[event.target.value.length - 1];
  console.log('Character:', character);
});
```

## Related Properties & Events

- [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) - Modern replacement, returns the character representation
- [`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) - Returns the physical key location
- [`KeyboardEvent.keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) - Also deprecated, similar to charCode
- [`keypress` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event) - Deprecated event that fires for character input
- [`keydown` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) - Modern replacement for keyboard input handling
- [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) - Recommended for text input handling

## Relevant Links

- [MDN Web Docs - KeyboardEvent.charCode](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
- [W3C UIEvents Specification](https://w3c.github.io/uievents/#dom-keyboardevent-charcode)

## Keywords

keyboard, event, key, character, code, charCode, DOM, deprecated, legacy

---

**Last Updated:** 2024
**Status:** Deprecated - Use modern keyboard event APIs instead
