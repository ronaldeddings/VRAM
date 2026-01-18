# Pointer Events

## Overview

**Pointer events** provide a unified interface for handling input from mice, touchscreens, and pens. This specification eliminates the need for separate implementations and makes it easier to author cross-device pointer interactions.

> **Note:** This feature is different from the unrelated CSS property `pointer-events`.

## Description

This specification integrates various inputs from mice, touchscreens, and pens, making separate implementations no longer necessary and authoring for cross-device pointers easier. Not to be mistaken with the unrelated "pointer-events" CSS property.

## Specification Status

**Status:** [Recommendation (REC)](https://www.w3.org/TR/pointerevents/)

This is a mature, standardized specification recommended for use in production environments.

## Categories

- CSS
- DOM
- JS API

## Key Benefits & Use Cases

### Why Use Pointer Events?

- **Unified Interface:** Handle mouse, touch, and pen input with a single event API
- **Reduced Complexity:** No need to manage multiple event handlers for different input types
- **Better Accessibility:** Improved support for assistive technologies and alternative input methods
- **Cross-Device Compatibility:** Write once, works across devices with different input mechanisms
- **Advanced Interactions:** Support for pressure sensitivity, tilt, and other advanced pointer features
- **Modern Approach:** Replaces the older `touchstart`/`mousedown` pattern with standardized events

### Common Use Cases

- Interactive drawing and painting applications
- Touch-friendly UI components and gestures
- Drag-and-drop operations
- Multi-touch gestures
- Pen/stylus input on tablets
- Cross-device game controls
- Accessibility improvements for input handling

## Browser Support

Browser support data current as of latest CanIUse data. Support levels indicated as:
- **y** = Full support
- **a** = Partial support with notes
- **p** = Partial support (usually experimental/behind flag)
- **n** = No support
- **d** = Support with prefix or flag

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome | 22 (partial) | 55+ (full) | Full support from v55+ |
| Firefox | 6 (partial) | 59+ (full) | Requires flag until v59; partial support only for mouse input |
| Safari | 6.1 (partial) | 13+ (full) | Full support from v13+ |
| Edge | 12+ (full) | All versions | Full support since initial release |
| Opera | 15 (partial) | 42+ (full) | Full support from v42+ |
| IE | 10 (partial) | 11 (full) | Partial support in v10; full in v11 |

### Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| iOS Safari | 13.2+ (full) | Partial support in earlier versions |
| Android Chrome | 142+ (full) | Full support in current versions |
| Android Firefox | 144+ (full) | Full support in current versions |
| Samsung Internet | 6.2+ (full) | Full support from v6.2+ |
| Opera Mobile | 80+ (full) | Full support from v80+ |
| Android UC Browser | 15.5+ (full) | Full support from v15.5+ |
| Android QQ | 14.9+ (full) | Full support from v14.9+ |
| Baidu | 13.52+ (full) | Full support from v13.52+ |
| Opera Mini | No support | Not supported |
| IE Mobile | 11 (full) | Full support in v11 |
| KaiOS | 3.0+ (full) | Full support from v3.0+ |

### Support Summary by Percentage

- **Usage Percentage (Full Support):** 93.02%
- **Global Coverage:** Supported in all modern browsers
- **Legacy Support:** Available through polyfills for older browsers

## Implementation Details

### Pointer Event Types

Key pointer events supported:

- `pointerdown` - Fired when a pointer enters the active button state
- `pointerup` - Fired when a pointer is no longer in the active button state
- `pointermove` - Fired when a pointer changes coordinates
- `pointercancel` - Fired when a pointer is disrupted
- `pointerover` - Fired when a pointer is moved into an element's hit test area
- `pointerout` - Fired when a pointer is moved out of an element's hit test area
- `pointerenter` - Fired when a pointer enters an element or its descendants
- `pointerleave` - Fired when a pointer leaves an element and its descendants

### Browser-Specific Notes

#### Firefox
- **Versions 6-58:** Partial support (disabled by default)
- **Version 28+:** Requires `dom.w3c_pointer_events.enabled` flag
- **Version 59+:** Full support enabled by default
- **Limitation:** Only supports mouse input by default
- **Windows-Only:** Touch support can be enabled with `layers.async-pan-zoom.enabled` and `dom.w3c_touch_events.enabled` flags
- **Reference:** [Firefox Pointer Events Documentation](https://hacks.mozilla.org/2015/08/pointer-events-now-in-firefox-nightly/)

#### Chrome
- **Versions 22-54:** Partial support (can be enabled with `#enable-pointer-events` flag)
- **Version 55+:** Full support enabled by default

#### Safari
- **Versions 6.1-12:** Partial support (experimental)
- **Version 12.1:** Partial support with experimental flag (available under `Experimental Features` menu)
- **Version 13+:** Full support enabled by default

#### IE/Edge
- **IE 10:** Partial support - lacks `pointerenter` and `pointerleave` events
- **IE 11+:** Full support
- **Edge 12+:** Full support from initial release

#### iOS Safari
- **iOS 13.0-13.1:** Partial support with issues:
  - `element.releasePointerCapture(pointerID)` only partially implemented
  - Calling it after `pointerdown` does not dispatch boundary events (`pointerover`/`pointerleave`) during pointer movements
  - Value of `pointerevent.buttons` is incorrect on `pointermove` events generated by touches (0 instead of 1)
- **iOS 13.2+:** Full support

#### Mobile Browsers
- **Android devices:** Partial to full support depending on version
- **Opera Mobile:** Full support from v80
- **Samsung Internet:** Full support from v6.2+

## Known Issues & Limitations

### iOS Safari (v13.0-13.1)
1. **Partial `releasePointerCapture` Implementation**
   - `element.releasePointerCapture(pointerID)` is only partially implemented
   - Calling it after `pointerdown` does not result in boundary events (`pointerover`, `pointerleave`) being dispatched during pointer movements

2. **Incorrect `buttons` Property**
   - The value of `pointerevent.buttons` is incorrect on `pointermove` events generated by touches
   - Returns `0` when it should return `1`

### Firefox (Pre-v59)
- Support is disabled by default
- Only supports mouse input (not touch)
- On Windows, touch input requires additional flags to be enabled

### Internet Explorer 10
- Missing `pointerenter` and `pointerleave` events

## Resources & Further Reading

### Official Documentation
- [W3C Pointer Events Specification](https://www.w3.org/TR/pointerevents/)
- [Pointer Event API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

### Implementation Tools
- [DeepTissue.js - Abstraction Library](https://deeptissuejs.com/) - Simplifies working with pointer events
- [PEP: Pointer Events Polyfill](https://github.com/jquery/PEP) - Polyfill for older browsers

### Bug Tracking
- [Mozilla Bugzilla #822898 - Implement pointer events](https://bugzilla.mozilla.org/show_bug.cgi?id=822898)

## Related Features

- **Touch Events** - Lower-level touch input API (being superseded by Pointer Events)
- **Mouse Events** - Traditional mouse event handling
- **pointer-events CSS Property** - Controls whether an element can be the target of pointer events (unrelated to this API)

## Usage Example

```javascript
// Simple pointer event handler
element.addEventListener('pointerdown', (event) => {
  console.log('Pointer down at:', event.clientX, event.clientY);
  console.log('Pointer type:', event.pointerType); // 'mouse', 'touch', or 'pen'
});

element.addEventListener('pointermove', (event) => {
  // Handle pointer movement
  console.log('Pointer moved to:', event.clientX, event.clientY);
});

element.addEventListener('pointerup', (event) => {
  console.log('Pointer released');
});

element.addEventListener('pointercancel', (event) => {
  console.log('Pointer interaction cancelled');
});
```

## Recommendations

### For Modern Projects
- **Use Pointer Events** for all new pointer interaction handling
- Works across all modern browsers without polyfills
- Provides superior cross-device compatibility

### For Legacy Support
- Implement feature detection
- Provide polyfill (PEP) for IE 10 and older browsers
- Use abstraction libraries like DeepTissue.js for better compatibility

### Best Practices
- Always handle `pointercancel` events for proper cleanup
- Use `setPointerCapture()` for drag-and-drop operations
- Test with multiple pointer types (mouse, touch, pen) when possible
- Consider accessibility implications when implementing custom pointer interactions

---

*Last updated: 2025 | Based on CanIUse data*
