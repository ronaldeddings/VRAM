# requestAnimationFrame

## Overview

The `requestAnimationFrame()` method is a Web API that allows developers to execute a callback function before the next repaint, enabling more efficient script-based animations. It synchronizes with the browser's repaint cycle, typically aligned with the display's refresh rate (usually 60Hz). The API also includes support for `cancelAnimationFrame()`, which allows cancellation of scheduled animation frames.

## Description

The requestAnimationFrame API provides a more efficient alternative to traditional animation methods such as `setTimeout()` and `setInterval()`. By synchronizing with the browser's rendering engine, it ensures animations run at optimal performance without causing unnecessary CPU and power consumption. The callback function receives a DOMHighResTimeStamp indicating when the repaint is scheduled to occur.

### Key Benefits

- **Performance Optimization**: Animations run synchronized with the browser's repaint cycle
- **Power Efficiency**: Reduces unnecessary CPU usage and battery drain
- **Smooth Animations**: Eliminates jank and provides 60fps animations when possible
- **Automatic Throttling**: Callbacks are paused when the tab is not visible
- **Precision Timing**: Receives accurate timing information for synchronization

## Specification

**Status**: [Living Standard (LS)](https://html.spec.whatwg.org/multipage/webappapis.html#animation-frames)

The requestAnimationFrame API is part of the HTML Living Standard and is maintained by the WHATWG (Web Hypertext Application Technology Working Group).

## Categories

- **JS API** - JavaScript Web APIs

## Use Cases & Benefits

### Common Use Cases

1. **Smooth Animations**
   - CSS animations fallback for older browsers
   - Canvas-based drawings and visualizations
   - WebGL/Three.js rendering loops

2. **Interactive Applications**
   - Games and interactive media
   - Data visualizations and charts
   - Real-time monitoring dashboards

3. **UI Updates**
   - Scroll effects and parallax
   - DOM manipulation animations
   - UI transitions and micro-interactions

4. **Performance-Critical Code**
   - Physics simulations
   - Layout calculations
   - Image processing

### Benefits

- **Browser-Optimized**: The browser can optimize the animation loop with other operations
- **Energy Efficient**: Reduces unnecessary processing and battery consumption
- **Automatic Pause**: Animations pause when tabs are in the background
- **Frame-Rate Aware**: Adapts to the device's actual refresh rate
- **Better Control**: Cancelable via `cancelAnimationFrame()`

## Basic Usage

### Simple Animation Example

```javascript
// Request animation frame for smooth animation
function animate(timestamp) {
  // Perform animation updates
  element.style.left = (timestamp / 10) + 'px';

  // Request next frame
  requestAnimationFrame(animate);
}

// Start animation
const animationId = requestAnimationFrame(animate);

// Stop animation
cancelAnimationFrame(animationId);
```

### With Polyfill for Older Browsers

```javascript
// Polyfill for browsers that don't support requestAnimationFrame
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 1000 / 60);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}
```

## Browser Support

### Support Legend

- **✓ (y)** - Fully supported
- **◐ (a)** - Partially supported (lacking `cancelAnimationFrame`)
- **✗ (n)** - Not supported
- **x** - Requires vendor prefix

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|--------------|-------------------|
| Chrome | 24 | ✓ Fully Supported |
| Edge | 12 | ✓ Fully Supported |
| Firefox | 11 | ✓ Fully Supported (22+) |
| Safari | 6 | ✓ Fully Supported (6.1+) |
| Opera | 15 | ✓ Fully Supported |
| Internet Explorer | 10 | ✓ IE 10-11 |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|--------------|-------------------|
| iOS Safari | 6.0 | ✓ Fully Supported (6.1+) |
| Android Chrome | 4.4 | ✓ Fully Supported |
| Android Firefox | Latest | ✓ Fully Supported |
| Opera Mobile | 80 | ✓ Fully Supported |
| Samsung Internet | 4.0 | ✓ Fully Supported |
| IE Mobile | 10 | ✓ Supported (10-11) |

### Unsupported Platforms

- Opera Mini (all versions)
- Old Android versions (< 4.4)
- Old iOS versions (< 6.0)
- Older BlackBerry devices (< 10)

### Feature Completeness

| Feature | Support Level |
|---------|----------------|
| `requestAnimationFrame()` | 93.59% of users |
| `cancelAnimationFrame()` | 93.59% of users |
| High-Resolution Timestamps | Modern browsers |

## Important Notes

### Partial Support Details

1. **Firefox 4-10**: Partial support with vendor prefix (`mozRequestAnimationFrame`)
   - Lacks `cancelAnimationFrame` support in early versions
   - Full support from Firefox 11 onwards

2. **Chrome 10-21**: Partial support with vendor prefix (`webkitRequestAnimationFrame`)
   - Versions 10-17: Missing `cancelAnimationFrame`
   - Versions 18-21: Missing standard `cancelAnimationFrame`, supports `webkitCancelRequestAnimationFrame`
   - Full support from Chrome 22 onwards

3. **Safari 6.0**: Partial support with vendor prefix (`webkitRequestAnimationFrame`)
   - `cancelAnimationFrame` support added in Safari 6.1

4. **iOS Safari 6.0-6.1**: Partial support with vendor prefix
   - Known issue with iOS 6: requestAnimationFrame may not work reliably
   - Full support from iOS 7.0 onwards

### Platform-Specific Notes

- **Safari 6.0**: Requires prefix, implementation had issues
- **iOS 6**: Known bug where animations may not execute properly
- **Chrome 10-21**: Required vendor prefixes and workarounds for cancellation
- **Firefox 4-10**: Required `moz` prefix for both request and cancel functions

## Polyfill & Fallback Strategy

### Recommended Polyfill Implementation

```javascript
(function() {
  let lastTime = 0;
  const vendors = ['webkit', 'moz'];

  for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                  window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());
```

## Performance Considerations

### Best Practices

1. **Single Animation Loop**: Use a single `requestAnimationFrame` call coordinating multiple animations
2. **Avoid Heavy Operations**: Keep callback functions lightweight to maintain frame rate
3. **Check Visibility**: Use Page Visibility API to pause animations when tabs are hidden
4. **Throttling**: Implement throttling for high-frequency events before passing to animation loop

### Example: Optimized Animation Loop

```javascript
const elements = document.querySelectorAll('.animate');
let animationId;

function updateAnimations(timestamp) {
  elements.forEach(el => {
    // Update element state
    el.style.transform = `translateX(${timestamp / 10}px)`;
  });

  animationId = requestAnimationFrame(updateAnimations);
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
  } else {
    animationId = requestAnimationFrame(updateAnimations);
  }
});

// Start animation
animationId = requestAnimationFrame(updateAnimations);
```

## Browser History

### Timeline

- **2011**: Apple introduces `requestAnimationFrame` in WebKit
- **2011**: Mozilla implements with `moz` prefix in Firefox 4
- **2011**: Google implements with `webkit` prefix in Chrome 10
- **2012**: Internet Explorer 10 adds support
- **2012**: Opera 15+ adds support
- **2012**: Safari 6+ adds support
- **2013**: Chrome 22 removes prefix requirement
- **2013**: Firefox 11+ removes prefix requirement
- **2013**: Widespread adoption across modern browsers

## Related Features

- **CSS Animations** - Native CSS-based animations
- **CSS Transitions** - CSS property change animations
- **Web Workers** - Background script execution
- **Page Visibility API** - Detect tab visibility state
- **Performance API** - Accurate timing measurements
- **Canvas API** - Drawing and animation support
- **WebGL** - GPU-accelerated graphics

## Relevant Links

### Official Documentation

- [WHATWG HTML Living Standard - Animation Frames](https://html.spec.whatwg.org/multipage/webappapis.html#animation-frames)
- [MDN Web Docs - requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [WebPlatform Docs](https://webplatform.github.io/docs/dom/Window/requestAnimationFrame)

### Educational Resources

- [Paul Irish: requestAnimationFrame for Smart Animating](https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
- [Mozilla Hacks: Animating with JavaScript - From setInterval to requestAnimationFrame](https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/)

### Demos & Examples

- [CSS-Tricks: requestAnimationFrame](https://css-tricks.com/)
- [JavaScript.info: requestAnimationFrame](https://javascript.info/)

## Support Summary

**Overall Support**: 93.59% of global users

requestAnimationFrame has achieved nearly universal support across modern browsers. The main limitation is:

- **Older Devices**: Android < 4.4 and iOS < 6.0 lack support
- **Old Browsers**: IE < 10 requires fallback implementation
- **Opera Mini**: No support (typically for performance-limited devices)

For modern web applications targeting current devices and browsers, requestAnimationFrame can be used without fallbacks. For broader compatibility, a simple polyfill using `setTimeout` is recommended.

---

*Last Updated: December 2024*
*Data Source: CanIUse Feature Database*
