# KeyboardEvent.which

## Overview

`KeyboardEvent.which` is a legacy property of the `KeyboardEvent` interface that provides information about which key was pressed during a keyboard event. It returns a numeric value representing the keyboard key, equivalent to either `KeyboardEvent.keyCode` or `KeyboardEvent.charCode` depending on whether the key is alphanumeric.

## Description

The `which` property is part of the legacy keyboard event handling API and has been superseded by more modern approaches. This property maps to the appropriate key code based on the event type:

- For **key events** (keydown, keyup): Returns the key code value
- For **character events** (keypress): Returns the character code value

### Current Status

**Specification Status**: Unofficial (unoff)

This feature is documented in the [W3C UI Events specification](https://w3c.github.io/uievents/#dom-uievent-which) but is considered legacy and deprecated.

## Categories

- DOM (Document Object Model)

## Use Cases & Benefits

### Primary Use Cases

1. **Legacy Application Support**: Maintaining compatibility with older codebases that rely on `which` for keyboard event handling
2. **Backward Compatibility**: Supporting applications that predate modern keyboard event APIs
3. **Cross-Browser Keyboard Detection**: Providing consistent keyboard input detection across older browser versions

### Benefits

- **Wide Browser Support**: Nearly universal support across all modern and legacy browsers
- **Simple API**: Straightforward numeric key code that's easy to work with
- **Established Patterns**: Decades of established code patterns for keyboard handling

### Modern Alternatives

Modern web development should use these alternatives instead:

- **`KeyboardEvent.code`**: Hardware key location (preferred for games and keyboard shortcuts)
- **`KeyboardEvent.key`**: Actual character/key name (preferred for text input)
- **`InputEvent`**: For character input validation and handling

## Browser Support

### Support Key

| Symbol | Meaning |
|--------|---------|
| **y** | Fully supported |
| **n** | Not supported |
| **u** | Unknown/Partial support |
| **a** | Alternate implementation or known issues |

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| Chrome | v4 | ✅ Fully Supported | Consistent support across all versions |
| Firefox | v2 | ✅ Fully Supported | Universal support since early Firefox releases |
| Safari | v5.1 | ✅ Fully Supported | v5 had unknown/partial support |
| Edge (Chromium) | v12 | ✅ Fully Supported | All Chromium-based versions supported |
| Internet Explorer | v9 | ✅ Fully Supported | Supported from IE9 onwards; not available in IE5.5-8 |
| Opera | v10.0 | ✅ Fully Supported | Support from version 10.0 onwards |

### Mobile Browsers

| Platform | First Support | Current Status | Notes |
|----------|---|---|---|
| iOS Safari | v5.0-5.1 | ✅ Fully Supported | Unknown support in earlier versions |
| Android Browser | v2.3 | ✅ Fully Supported | Partial/unknown support in v2.1-2.2 |
| Samsung Internet | v5.0+ | ⚠️ Partial Support | Known issues (#1) - key codes may not match expected values |
| Opera Mobile | v10 | ✅ Fully Supported | Consistent support across versions |
| Android Chrome | v142 | ⚠️ Partial Support | Known issues (#1) with key code values |
| Android Firefox | v144 | ⚠️ Partial Support | Known issues (#1) with key code values |
| UC Browser | v15.5+ | ✅ Fully Supported | Limited version data |
| Opera Mini | all | ❌ Not Supported | No support in any version |
| BlackBerry | v7-10 | ✅ Fully Supported | Limited device support |
| Other Browsers | Baidu, KaiOS | Mixed | Partial support with known issues |

### Usage Statistics

- **Fully Supported (y)**: 49.57% of global usage
- **Partial/Issues (a)**: 44.08% of global usage
- **Not Supported (n)**: Minimal percentage

## Known Issues & Limitations

### Issue #1: Key Code Mismatch

**Affected Platforms**: Samsung Internet (v5.0+), Android Chrome (v142+), Android Firefox (v144+), Baidu Browser (v13.52+)

**Description**: The `event.which` numeric value for keys does not always match the expected value. The difference may be dependent on whether using a hardware keyboard versus an on-screen (virtual) keyboard.

### Global Limitations

1. **IME Suppression**: Some key events or their values might be suppressed by Input Method Editors (IME) in use
2. **Mobile Virtual Keyboards**: On mobile devices with virtual keyboards, all keys are reported as `229` (indicating composition/IME input)
3. **Legacy & Deprecated**: This property is legacy and officially deprecated in favor of modern keyboard event properties

## Implementation Notes

### Browser Compatibility Considerations

- **Internet Explorer**: Support begins at IE9; earlier versions (5.5-8) do not support this property
- **Mobile Safari**: Has uncertain support in versions prior to 5.0; reliable from 5.0-5.1 onwards
- **Mobile Devices**: Virtual keyboard input may report inconsistent key values (particularly the value `229`)
- **Hardware vs. Virtual**: Behavior differs between hardware keyboards and on-screen keyboards, especially on Android

### Migration Path

If you're using this legacy property, consider modernizing to:

```javascript
// Legacy approach
document.addEventListener('keydown', function(event) {
  const keyCode = event.which;
  // ...
});

// Modern approach - for key identity
document.addEventListener('keydown', function(event) {
  const key = event.key;      // 'a', 'Enter', 'Shift', etc.
  const code = event.code;    // 'KeyA', 'Enter', 'ShiftLeft', etc.
  // ...
});
```

## References & Resources

- **MDN Web Docs**: [KeyboardEvent.which](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)
- **W3C Specification**: [UI Events - which property](https://w3c.github.io/uievents/#dom-uievent-which)
- **W3C Note on IME**: [Keys and IME Suppression](https://www.w3.org/TR/2019/WD-uievents-20190530/#keys-IME)

## Summary

`KeyboardEvent.which` is a legacy but widely supported property for keyboard event handling. While nearly all modern browsers support it, developers should prefer modern alternatives like `KeyboardEvent.key` and `KeyboardEvent.code` for new implementations. The property has known compatibility issues on mobile platforms, particularly with virtual keyboards and Samsung/Android implementations.

---

**Last Updated**: Based on CanIUse data for KeyboardEvent.which feature documentation.

**Note**: This is a legacy feature with widespread but inconsistent support. New development should use modern keyboard event APIs (`key` and `code` properties) instead.
