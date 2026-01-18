# Gamepad API Documentation

## Overview

The **Gamepad API** is a web standard that enables JavaScript developers to detect and respond to input from USB gamepad controllers connected to a user's computer. This API provides a standardized way to access game controller input in web applications, making it possible to build interactive games and applications with full controller support in modern web browsers.

## Specification Status

- **Current Status**: Working Draft (WD)
- **Specification**: [W3C Gamepad Specification](https://www.w3.org/TR/gamepad/)
- **Global Usage**: 92.71% (as of latest data)

## Description

API to support input from USB gamepad controllers through JavaScript. This enables web developers to create games and interactive applications that respond to button presses, stick movement, and other input from standard gaming controllers.

## Categories

- **JavaScript API**

## Benefits and Use Cases

### Primary Use Cases

1. **Browser-Based Gaming**
   - Full support for multiplayer web games
   - Console-like gaming experiences in the browser
   - Native controller input without external libraries

2. **Game Development**
   - Port existing game engines to web
   - Support controller input alongside keyboard/mouse
   - Enhance accessibility through familiar controller interfaces

3. **Interactive Applications**
   - Creative tools with controller support
   - Media players with gamepad controls
   - Educational applications with engaging input methods

4. **Accessibility**
   - Alternative input method for users who prefer controllers
   - Customizable button mapping for accessibility needs
   - Support for specialized gaming peripherals

### Key Benefits

- **Standardized API** - Consistent behavior across modern browsers
- **Cross-Platform** - Works on desktop browsers with connected gamepads
- **Low Latency** - Direct hardware access for responsive input
- **Multiple Controllers** - Support for multiple simultaneous gamepads
- **Button and Axis Support** - Full analog stick and trigger detection

## Browser Support

### Support Status Legend
- ✅ **Supported (y)** - Full support available
- ❌ **Not Supported (n)** - No support
- ⚠️ **Partial Support (y x)** - Limited or experimental support

### Desktop Browsers

| Browser | Minimum Version | Current Support | Notes |
|---------|-----------------|-----------------|-------|
| **Chrome** | 25 | ✅ Full Support (v146+) | Experimental prefix in v21-24 |
| **Firefox** | 29 | ✅ Full Support (v148+) | Stable support from v29 onward |
| **Safari** | 10.1 | ✅ Full Support (v26+) | Added in Safari 10.1 |
| **Edge** | 12 | ✅ Full Support (v143+) | Available since initial release |
| **Opera** | 24 | ✅ Full Support (v122+) | Support from v24 onward |
| **Internet Explorer** | - | ❌ Not Supported | No support across all versions |

### Mobile Browsers

| Browser | Minimum Version | Current Support | Notes |
|---------|-----------------|-----------------|-------|
| **iOS Safari** | 10.3 | ✅ Full Support (v26+) | Added in iOS 10.3 |
| **Android Chrome** | Latest | ✅ Full Support | Support available |
| **Samsung Internet** | 4.0 | ✅ Full Support (v29+) | Available from v4.0 |
| **Android Firefox** | Latest | ✅ Full Support | Support available |
| **Opera Mobile** | 80 | ✅ Full Support | Limited earlier versions |
| **UC Browser** | 15.5 | ✅ Full Support | Limited support |
| **Opera Mini** | - | ❌ Not Supported | No support |
| **Android Browser** | 4.4+ | ❌ Not Supported | Legacy browser |
| **BlackBerry Browser** | - | ❌ Not Supported | No support |
| **IE Mobile** | - | ❌ Not Supported | No support |
| **KaiOS** | 3.0+ | ✅ Full Support | Support from v3.0+ |
| **Baidu** | 13.52+ | ✅ Full Support | Support available |
| **QQ Browser** | 14.9+ | ✅ Full Support | Support available |

### Support Summary

**Overall Coverage**: 92.71% of global browser usage

**Widely Supported**:
- ✅ All modern desktop browsers (Chrome, Firefox, Safari, Edge, Opera)
- ✅ Mobile browsers (iOS Safari, Android Chrome, Samsung Internet)
- ✅ Modern emerging browsers (KaiOS, Baidu, QQ Browser)

**Not Supported**:
- ❌ Internet Explorer (all versions)
- ❌ Opera Mini
- ❌ Legacy Android browsers

## Implementation Notes

### Browser Compatibility Considerations

- **Chrome Versions 21-24**: Used experimental vendor prefix (requires `webkit` prefix)
- **Chrome Version 25+**: Full unprefixed support
- **Firefox**: Stable support since version 29
- **Safari**: Desktop and iOS support available since versions 10.1 and 10.3 respectively

### Fallback Strategy

For applications requiring broader compatibility with older browsers, consider:
1. Feature detection using `navigator.getGamepads()`
2. Graceful degradation with alternative keyboard/mouse controls
3. Progressive enhancement for users with supported controllers

### Mobile Considerations

- Gamepad support on mobile is more limited than desktop
- Physical controllers may be required (on-screen gamepads not supported)
- iOS devices require external Bluetooth controllers
- Android devices vary in hardware support

## Related Resources

### Documentation and Tutorials

1. **[Controller Demo](https://luser.github.io/gamepadtest/)**
   - Interactive test page for checking gamepad support and functionality
   - Useful for debugging controller detection issues

2. **[MDN Web Docs - Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)**
   - Comprehensive reference documentation
   - API reference, guides, and examples
   - Browser compatibility details

3. **[HTML5Rocks Article](https://www.html5rocks.com/en/tutorials/doodles/gamepad/)**
   - In-depth introduction to Gamepad API
   - Historical context and implementation details

4. **[Detailed Tutorial](https://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345)**
   - Game development focused guide
   - Practical examples for browser games
   - Best practices for controller implementation

## Quick Start Example

```javascript
// Check if Gamepad API is available
if ('getGamepads' in navigator) {
  // Retrieve all connected gamepads
  const gamepads = navigator.getGamepads();

  // Check first gamepad
  if (gamepads[0]) {
    const gamepad = gamepads[0];

    // Read button states
    console.log('Buttons:', gamepad.buttons);

    // Read analog stick positions
    console.log('Left Stick:', {
      x: gamepad.axes[0],
      y: gamepad.axes[1]
    });

    // Read right stick or triggers
    console.log('Right Stick/Triggers:', {
      x: gamepad.axes[2],
      y: gamepad.axes[3]
    });
  }
} else {
  console.log('Gamepad API not supported');
}
```

## Specification Details

- **W3C Status**: Working Draft
- **First Implementation**: Chrome 21 (experimental)
- **First Stable Implementation**: Chrome 25

## Additional Information

- **Known Issues**: None reported
- **Prefixing Required**: No (fully unprefixed in all modern browsers)
- **Chrome Issue ID**: 5118776383111168

---

*Last Updated: Based on caniuse database - December 2025*
*For the most current information, refer to the [W3C Gamepad Specification](https://www.w3.org/TR/gamepad/) and [Can I Use Gamepad](https://caniuse.com/gamepad)*
