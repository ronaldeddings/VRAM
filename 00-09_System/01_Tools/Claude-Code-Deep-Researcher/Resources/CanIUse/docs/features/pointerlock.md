# Pointer Lock API

## Overview

The **Pointer Lock API** (also known as Mouse Lock) provides web applications with access to raw mouse movement data by removing the constraints of screen boundaries. This API is essential for immersive interactive applications like first-person games, real-time strategy games, and 3D modeling applications.

## Description

The Pointer Lock API enables developers to access unrestricted mouse movement data without the cursor being constrained by screen edges. When pointer lock is active, the cursor disappears and applications receive raw movement deltas (movementX and movementY) instead of absolute coordinates. This is particularly valuable for applications that require full-range mouse control and cannot function effectively with traditional cursor boundaries.

### Key Features
- Access to raw mouse movement data without cursor boundaries
- Cursor hiding during lock state
- Movement delta information (movementX and movementY)
- User consent requirement for security and privacy
- Escape key support for user control

## Specification Status

**Status:** Recommendation (REC)
**Specification:** [W3C Pointer Lock Specification](https://www.w3.org/TR/pointerlock/)

The Pointer Lock API is a W3C Recommended standard, indicating it has been thoroughly reviewed and is stable for production use.

## Categories

- **JavaScript API** - Core web API for pointer manipulation and input handling

## Use Cases & Benefits

### Primary Use Cases

1. **Gaming Applications**
   - First-person shooter games requiring unrestricted aiming
   - Real-time strategy games with full 3D camera control
   - Action games needing precise mouse-based movement
   - Flight simulators and vehicle control games

2. **3D Visualization & CAD**
   - 3D model viewers with intuitive camera control
   - Computer-aided design applications
   - Architectural visualization tools
   - Scientific visualization platforms

3. **Immersive Applications**
   - Virtual reality experiences in web browsers
   - Interactive presentations with full control
   - Real-time data visualization with camera control
   - Training simulations and educational tools

### Key Benefits

- **Enhanced User Experience** - Natural, unrestricted control without cursor constraints
- **Improved Gameplay** - Full mouse range enables competitive gaming scenarios
- **Professional Applications** - CAD and 3D tools benefit from unlimited movement space
- **Immersion** - Hiding the cursor and providing raw movement creates better immersion
- **User Control** - Escape key always allows users to exit pointer lock state

## Browser Support

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 22+ | ✅ Full Support | Stable from v37+ |
| **Firefox** | 50+ | ✅ Full Support | Experimental (x) from v14-49 |
| **Safari** | 10.1+ | ✅ Full Support | |
| **Edge** | 13+ | ✅ Full Support | |
| **Opera** | 15+ | ✅ Full Support | Experimental (x) from v15-23 |
| **Firefox (Android)** | 144+ | ✅ Full Support | |
| **Safari (iOS)** | - | ❌ Not Supported | Not available on iOS versions |
| **Android Browser** | - | ❌ Not Supported | |
| **Internet Explorer** | All | ❌ Not Supported | |

### Legend

- ✅ **Full Support** - Feature is fully implemented and stable
- ⚠️ **Experimental** (x) - Feature requires vendor prefix or experimental flag
- ⚠️ **Partial Support** (u) - Feature has limited or uncertain support
- ❌ **Not Supported** - Feature is not available

### Browser Coverage

- **Global Support:** 38.11% of users have Pointer Lock API support
- **Major Desktop Browsers:** Supported in all modern versions (Chrome, Firefox, Safari, Edge, Opera)
- **Mobile Platforms:** Limited support; not available on iOS Safari

### Mobile Considerations

- **iOS/iPadOS:** No support for Pointer Lock API
- **Android:** Variable support depending on browser
  - Android Firefox: Supported (v144+)
  - Android Chrome: Limited support
  - Stock Android Browser: Not supported
- **Mobile Limitations:** Touch-based input paradigm makes pointer lock less practical on mobile devices

## Implementation Notes

### API Methods

```javascript
// Request pointer lock
element.requestPointerLock();

// Exit pointer lock
document.exitPointerLock();

// Get locked element
document.pointerLockElement

// Listen for lock changes
document.addEventListener('pointerlockchange', (event) => {
  // Handle lock state change
});

// Listen for lock errors
document.addEventListener('pointerlockerror', (event) => {
  // Handle lock error
});
```

### Movement Data

Once pointer lock is active, mouse move events provide:
- `movementX` - Relative horizontal movement since last event
- `movementY` - Relative vertical movement since last event
- Absolute `clientX` and `clientY` remain unchanged

### Browser Prefixes

- **Chrome:** Experimental support (versions 16-21) required vendor prefix `-webkit-`
- **Firefox:** Experimental support (versions 14-49) required vendor prefix `-moz-`
- **Opera:** Experimental support (versions 15-23) required vendor prefix `-webkit-`

### Security Considerations

1. **User Consent:** Pointer lock requires user interaction (click, etc.) to activate
2. **Trust Context:** Must be requested in response to user action
3. **Escape Key:** Users can always exit pointer lock using Escape key
4. **Security Prompt:** Browsers may show security prompts before allowing pointer lock
5. **Same-Origin Policy:** Cannot be triggered by cross-origin frames without permission

### Compatibility Recommendations

For maximum compatibility:

```javascript
// Feature detection
if ('requestPointerLock' in document.documentElement ||
    'mozRequestPointerLock' in document.documentElement ||
    'webkitRequestPointerLock' in document.documentElement) {
  // Pointer lock supported
}

// With vendor prefix handling
const requestPointerLock = element.requestPointerLock ||
                           element.mozRequestPointerLock ||
                           element.webkitRequestPointerLock;

// Handle vendor-prefixed events
document.addEventListener('pointerlockchange', handleChange);
document.addEventListener('mozpointerlockchange', handleChange);
document.addEventListener('webkitpointerlockchange', handleChange);
```

## Related Keywords

- `mouselock` - Alternative name for pointer lock
- `requestPointerLock` - Method to activate pointer lock
- `pointerLockElement` - Property showing currently locked element
- `exitPointerLock` - Method to deactivate pointer lock
- `movementX` - Horizontal movement delta
- `movementY` - Vertical movement delta

## References

### Official Documentation
- [MDN Web Docs - Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)
- [W3C Pointer Lock Specification](https://www.w3.org/TR/pointerlock/)

### Examples & Demos
- [MDN Simple Pointer Lock Demo](https://mdn.github.io/dom-examples/pointer-lock/)

### Additional Resources
- [Can I Use - Pointer Lock](https://caniuse.com/pointerlock)
- [MDN Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) - Often used with Pointer Lock

## Notes

- Pointer Lock is particularly useful when combined with the Fullscreen API for immersive experiences
- The API automatically clears pointer lock when the user presses the Escape key
- Some browsers may require the page to be in focus for pointer lock to function
- Mobile browsers have limited utility for pointer lock due to the touch-based input paradigm
- For games, consider combining with the Gamepad API for complete input control

---

**Last Updated:** 2025
**Data Source:** CanIUse Feature Database
