# KeyboardEvent.code

## Overview

`KeyboardEvent.code` is a DOM API property that represents the **physical key that was pressed**, independent of keyboard layout and active modifier keys. This is essential for applications that need to detect specific keyboard locations rather than character codes.

## Description

The `code` property of a `KeyboardEvent` returns a string representing the physical key position on the keyboard. Unlike `KeyboardEvent.key`, which returns the character based on the current keyboard layout and modifier keys, `code` always returns the same value for the same physical key regardless of language settings or keyboard configuration.

For example, pressing the same physical key will return:
- `"KeyA"` for the `code` property (always consistent)
- `"a"` or `"A"` for the `key` property (depends on shift and keyboard layout)

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: [W3C UI Events - KeyboardEvent.code](https://www.w3.org/TR/uievents/#dom-keyboardevent-code)

## Categories

- DOM (Document Object Model)

## Benefits & Use Cases

### Key Advantages

1. **Keyboard Layout Independence**: Identify physical keys regardless of regional keyboard layouts (QWERTY, AZERTY, Dvorak, etc.)

2. **Gaming & Input Systems**: Essential for games and applications requiring precise keyboard input mapping
   - Bind keys to actions based on physical position rather than character output
   - Consistent behavior across different keyboard layouts

3. **Accessibility Applications**: Create custom keyboard navigation schemes that work globally

4. **Keyboard Shortcuts**: Implement shortcuts based on physical key positions for consistent UX across regions

5. **Keyboard Remapping**: Detect actual keys pressed for remapping and customization tools

### Common Scenarios

- Game control bindings (WASD movement keys)
- IDE and editor keyboard shortcuts
- Keyboard configuration utilities
- Accessibility tools for keyboard customization
- Multi-language text input applications

## Browser Support

### Desktop Browsers

| Browser | Support | First Version | Notes |
|---------|---------|---------------|-------|
| **Chrome** | ✅ Full | 48 | Behind experimental flag in v42-47 |
| **Edge** | ✅ Full | 79 | Supported from initial Chromium version |
| **Firefox** | ✅ Full | 38 | Excellent support |
| **Safari** | ✅ Full | 10.1 | Added in Safari 10.1 |
| **Opera** | ✅ Full | 35 | Follows Chromium; behind flag in v29-34 |
| **Internet Explorer** | ❌ None | — | Not supported in any version |

### Mobile Browsers

| Browser | Support | Version |
|---------|---------|---------|
| **iOS Safari** | ✅ Yes | 10.3+ |
| **Android Firefox** | ✅ Yes | 144+ |
| **Android Chrome** | ⚠️ Partial | Disabled by default; behind experimental flag |
| **Samsung Internet** | ⚠️ Partial | Disabled by default; behind experimental flag |
| **Opera Mini** | ❌ None | Not supported |
| **UC Browser** | ❌ None | Not supported |
| **Opera Mobile** | ❌ None | Not supported |

### Legacy Browsers

| Browser | Support |
|---------|---------|
| IE 5.5 - 11 | ❌ Not supported |
| Edge 12-78 | ❌ Not supported |
| Firefox 2-37 | ❌ Not supported |
| Chrome 4-47 | ❌ Not supported (except behind flag 42-47) |
| Safari 3.1-10 | ❌ Not supported |

## Support Summary

- **Global Support**: ~47.35% of users (based on usage statistics)
- **High Adoption**: Supported in all modern versions of major browsers
- **Mobile Limitations**: Virtual keyboards on mobile typically return empty string for all keys

## Important Notes

### Key Considerations

1. **IME Suppression**: Some key events or their values might be suppressed by Input Method Editors (IMEs) used in East Asian languages. This can prevent `code` from being detected for certain keys during IME composition.

2. **Mobile Virtual Keyboards**: On mobile devices using virtual/on-screen keyboards, all keys are reported as empty strings (`""`). Physical keyboard input on mobile works normally if an external keyboard is connected.

3. **Experimental Availability**: In Chrome and Opera, the feature can be enabled via the "experimental Web Platform features" flag for versions where it's disabled.

4. **No Progressive Enhancement**: If `code` is not supported, there's no direct fallback. Consider using `key` as an alternative for character-based detection, though it behaves differently.

## Usage Example

```javascript
document.addEventListener('keydown', (event) => {
  // Get the physical key code
  console.log('Physical key:', event.code);  // e.g., "KeyA", "ArrowUp"

  // Get the character value
  console.log('Character:', event.key);       // e.g., "a", "A", "ArrowUp"

  // Common game input example
  switch(event.code) {
    case 'KeyW':
      moveForward();
      break;
    case 'KeyA':
      moveLeft();
      break;
    case 'KeyS':
      moveBackward();
      break;
    case 'KeyD':
      moveRight();
      break;
  }
});
```

## Comparison with KeyboardEvent.key

| Property | Returns | Example | Use Case |
|----------|---------|---------|----------|
| `code` | Physical key location | `"KeyA"` | Position-based input, games |
| `key` | Character/symbol | `"a"`, `"A"`, `"@"` | Text input, character detection |

## Enabling in Browsers

### Chrome/Opera (Versions with Flag)

1. Open `chrome://flags` or `opera://flags`
2. Search for "Experimental Web Platform features"
3. Enable the flag
4. Restart the browser

## Related Resources

- [MDN Web Docs - KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
- [Chrome Issue Tracker](https://code.google.com/p/chromium/issues/detail?id=227231)
- [WebKit Feature Request](https://bugs.webkit.org/show_bug.cgi?id=149584)
- [Complete Key Code Reference](https://keycode.info/)

## Recommendations

### When to Use KeyboardEvent.code

✅ **Do use** for:
- Game development and interactive applications
- Keyboard-driven UI navigation
- Keyboard shortcut implementations
- Applications targeting users with diverse keyboard layouts
- Position-based keyboard input systems

❌ **Don't use** for:
- Basic character/text input (use `key` or `keypress` event instead)
- Devices that primarily use virtual keyboards
- Applications that only support specific keyboard layouts
- Situations where character interpretation is needed

### Fallback Strategy

For broader compatibility, consider:

```javascript
function getKeyInput(event) {
  // Try code first (modern browsers)
  if (event.code) {
    return event.code;
  }

  // Fallback to key property
  if (event.key) {
    return event.key;
  }

  // Last resort: keyCode (deprecated)
  return event.keyCode;
}
```

---

**Last Updated**: 2024
**Source**: [CanIUse.com](https://caniuse.com)
