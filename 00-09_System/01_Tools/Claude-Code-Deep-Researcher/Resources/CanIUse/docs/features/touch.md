# Touch Events

## Overview

Touch Events provide a method of registering when, where, and how the interface is touched on devices with a touch screen. These DOM events are similar to `mousedown`, `mousemove`, and related mouse events, but are specifically designed for touch input.

## Description

The Touch Events API enables web developers to create interactive applications that respond to touch input on devices such as smartphones and tablets. When a user touches a touchscreen, these events fire to indicate the touch action, allowing developers to build gesture-based interfaces and custom touch interactions.

These events are particularly useful for:
- Detecting simultaneous multiple touches (multi-touch gestures)
- Tracking individual touch points across the screen
- Implementing custom gestures and drag-and-drop functionality
- Building mobile-first web applications

## Specification Status

**Status:** Recommended (REC)
**W3C Specification:** [Touch Events - W3C Recommendation](https://www.w3.org/TR/touch-events/)

The Touch Events specification has been standardized by the W3C and is widely recommended for use in modern web development.

## Categories

- **DOM** - Document Object Model APIs
- **JS API** - JavaScript Application Programming Interfaces

## Use Cases & Benefits

### Primary Use Cases

1. **Mobile Web Applications**
   - Create native-like mobile experiences on the web
   - Implement touch-responsive user interfaces
   - Build gesture-driven interactions

2. **Multi-Touch Gestures**
   - Detect pinch-to-zoom interactions
   - Implement two-finger rotate gestures
   - Create swipe navigation patterns

3. **Custom Drag-and-Drop**
   - Build drag-and-drop interfaces optimized for touch
   - Implement touch-based file uploads
   - Create reorderable lists and components

4. **Games & Interactive Applications**
   - Develop browser-based games with touch controls
   - Create interactive drawing applications
   - Build virtual musical instruments

### Key Benefits

- **Native-like Experience** - Provides desktop-class interactivity on mobile devices
- **Multi-Touch Support** - Handle multiple simultaneous touch points
- **Precise Input Tracking** - Access detailed information about each touch event
- **Gesture Recognition** - Enable custom gesture implementations
- **Mobile Optimization** - Create experiences specifically optimized for touch input

## Browser Support

### Summary

Touch Events enjoy broad support across modern browsers and platforms with over **91.77%** global usage coverage.

**Key Support Patterns:**
- ✅ **Full Support:** Chrome (22+), Firefox (18+, 52+), Edge (79+), Opera (15+), Safari Mobile/iOS, Android browsers
- ⚠️ **Partial/Experimental:** Internet Explorer (10-11), Firefox Desktop (4-24 with non-standard implementation), IE Mobile
- ❌ **No Support:** Desktop Safari, Opera Mini, older browser versions

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | v22 | ✅ Full Support | All versions from 22 onward |
| **Edge** | v79 | ✅ Full Support | Legacy Edge (12-18) requires flag or not supported |
| **Firefox** | v18 | ✅ Full Support | Firefox 4-24 had non-standard implementation; 25-51 disabled; re-enabled from 52+ |
| **Opera** | v15 | ✅ Full Support | All versions from 15 onward |
| **Safari** | Not Supported | ❌ No Support | Desktop Safari does not support Touch Events API |
| **Internet Explorer** | v10 | ⚠️ Partial | IE 10-11 have partial support; prefer Pointer Events instead |

### Mobile & Tablet Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| **iOS Safari** | ✅ Full Support | Supported from iOS 3.2 and later |
| **Android Browser** | ✅ Full Support | Supported from Android 2.1 onward; **Note:** Android 2.3 and below do not detect multiple touches |
| **Chrome Mobile** | ✅ Full Support | All recent versions |
| **Firefox Mobile** | ✅ Full Support | From Firefox 52 onward |
| **Samsung Internet** | ✅ Full Support | From v4 onward |
| **Opera Mobile** | ✅ Full Support | From v11 onward (v10 not supported) |
| **Opera Mini** | ❌ No Support | Not supported on all versions |
| **BlackBerry** | ✅ Full Support | BB 7 and 10 support Touch Events |
| **KaiOS** | ✅ Full Support | Supported from KaiOS 3.0+ |
| **IE Mobile** | ⚠️ Limited | Partial support; IE Mobile 11 has annotation-based support |

### Support Legend

- **y** = Supported
- **n** = Not supported
- **a** = Supported with alternate/non-standard implementation
- **p** = Partial support
- **d** = Support can be enabled via flag/setting
- **#N** = See notes below

## Platform Coverage

| Platform | Support | Coverage |
|----------|---------|----------|
| **Windows/Desktop** | Good | Chrome, Edge, Firefox, Opera; Safari and IE limited |
| **macOS/Desktop** | Limited | Chrome, Edge, Firefox, Opera only; Safari not supported |
| **iOS/iPad** | Excellent | Full support across all browsers (Safari, Chrome, Firefox) |
| **Android** | Excellent | Full support across all browsers from Android 2.1+ |
| **Tablet Devices** | Excellent | Widespread support across tablet browsers |

## Implementation Details

### Touch Events Properties

The Touch Events API provides the following key interfaces:

**TouchEvent Object**
- `touches` - All current touch points on the surface
- `targetTouches` - Touch points on the target element
- `changedTouches` - Touch points that changed in this event

**Individual Touch Object Properties**
- `identifier` - Unique identifier for the touch point
- `clientX`, `clientY` - Viewport coordinates
- `screenX`, `screenY` - Screen coordinates
- `pageX`, `pageY` - Document coordinates
- `radiusX`, `radiusY` - Approximate size of touch area
- `rotationAngle` - Rotation of touch area
- `force` - Pressure applied (0.0 to 1.0)
- `target` - The target element

### Touch Event Types

- `touchstart` - Fired when a touch point is placed on the surface
- `touchend` - Fired when a touch point is removed from the surface
- `touchmove` - Fired when a touch point moves across the surface
- `touchenter` - Fired when a touch point enters an element
- `touchleave` - Fired when a touch point leaves an element
- `touchcancel` - Fired when a touch is interrupted

### Basic Usage Example

```javascript
// Listen for touch start
element.addEventListener('touchstart', function(event) {
  console.log('Touch started:', event.touches.length);
});

// Listen for touch move
element.addEventListener('touchmove', function(event) {
  event.preventDefault(); // Prevent default scrolling

  const touch = event.touches[0];
  console.log('Touch position:', touch.clientX, touch.clientY);
});

// Listen for touch end
element.addEventListener('touchend', function(event) {
  console.log('Touch ended');
});

// Detect multi-touch
element.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    console.log('Multi-touch detected:', event.touches.length);
  }
});
```

## Important Notes & Considerations

### Desktop Safari Limitation

Desktop Safari does **not** support the Touch Events API. Developers targeting Safari on desktop should use Pointer Events instead, which provide broader device support.

### Internet Explorer & Pointer Events

Internet Explorer implements the **Pointer Events** specification instead of Touch Events, which supports a wider range of input devices. For IE compatibility, consider using Pointer Events as a more comprehensive solution.

### Android 2.3 and Earlier

**Known Issue:** Android 2.3 and below do **not** detect multiple simultaneous touches. If multi-touch support is critical, verify the Android version or use feature detection.

### Firefox History

- **Firefox 4-24:** Non-standard implementation (experimental support)
- **Firefox 25-51:** Support disabled for site compatibility reasons
- **Firefox 52+:** Full W3C-compliant support enabled
- **Note:** When removed in Firefox, the reference refers to desktop Firefox only

### Polyfills & Fallbacks

For Internet Explorer 10-11 support, the community has developed a polyfill:
- [TouchPolyfill on GitHub](https://github.com/CamHenlin/TouchPolyfill) - Brings W3C Touch Events to IE

### Preferred API for Universal Support

For applications requiring maximum cross-browser compatibility (including desktop Safari and older systems), consider using:
- **Pointer Events** - More comprehensive, supports touch, mouse, and pen input
- **Mouse Events** - Fallback for devices without touch support
- Feature detection and graceful degradation patterns

## Global Usage Statistics

- **Full Support:** 91.77% of global browser usage
- **Partial Support:** 0.06% of global browser usage
- **No Support:** 8.17% of global browser usage

This indicates Touch Events are safe to use as a primary interaction method for mobile-focused applications, with fallbacks recommended for desktop applications.

## Related Resources

### Official Documentation

- **MDN - Touch Events** - [https://developer.mozilla.org/en-US/docs/Web/API/Touch_events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- **W3C Specification** - [https://www.w3.org/TR/touch-events/](https://www.w3.org/TR/touch-events/)

### Reference Materials

- **Quirks Mode - Detailed Support Tables** - [https://www.quirksmode.org/mobile/tableTouch.html](https://www.quirksmode.org/mobile/tableTouch.html)
- **Quirks Mode - Multi-touch Demo** - [https://www.quirksmode.org/m/tests/drag2.html](https://www.quirksmode.org/m/tests/drag2.html)

### Specification Development

- **Spec Development Information** - [http://schepers.cc/getintouch](http://schepers.cc/getintouch)

### Browser Implementation Details

- **Internet Explorer - Gesture & Touch Implementation** - [https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/dev-guides/hh673557(v=vs.85)](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/dev-guides/hh673557(v=vs.85))

### Community Tools

- **TouchPolyfill** - [https://github.com/CamHenlin/TouchPolyfill](https://github.com/CamHenlin/TouchPolyfill) - Polyfill for Touch Events support on Internet Explorer

## Feature Keywords

`touchstart`, `touchend`, `touchmove`, `touchenter`, `touchleave`, `touchcancel`

---

**Last Updated:** Based on CanIUse data (current as of 2024)

