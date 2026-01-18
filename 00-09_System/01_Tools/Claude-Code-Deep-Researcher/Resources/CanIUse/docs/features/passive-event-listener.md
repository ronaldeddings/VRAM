# Passive Event Listeners

## Overview

Passive event listeners are a web platform feature that improves scrolling performance by allowing event listeners to be marked as non-cancellable. This enables browser optimizations that result in smoother scrolling experiences, particularly on touch devices.

## Description

Event listeners created with the `passive: true` option cannot cancel (`preventDefault()`) the events they receive. Primarily intended to be used with touch events and `wheel` events. Since they cannot prevent scrolls, passive event listeners allow the browser to perform optimizations that result in smoother scrolling.

## Specification

- **Standard**: WHATWG DOM Specification
- **Status**: Living Standard (LS)
- **Spec URL**: https://dom.spec.whatwg.org/#dom-addeventlisteneroptions-passive

## Categories

- DOM

## Benefits & Use Cases

### Performance Optimization
- **Smoother Scrolling**: The primary benefit is enabling browsers to optimize scroll performance, resulting in noticeably smoother user experiences
- **Reduced Jank**: By eliminating the need for the browser to wait for event handlers to determine if they will call `preventDefault()`, passive listeners reduce main thread blocking
- **Mobile Friendly**: Particularly beneficial on touch devices where scroll responsiveness is critical

### Common Applications
- **Touch Events**: Handling `touchstart`, `touchmove`, `touchend` events
- **Wheel Events**: Processing mouse wheel and trackpad events
- **Scroll Performance**: Any scenario where you want to monitor events without blocking the default behavior

### Best Practice
Passive event listeners should be used for any event handler that:
- Does not need to call `preventDefault()`
- Monitors or logs events without modifying behavior
- Performs non-blocking operations

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status |
|---------|:-------------:|:--------------:|
| Chrome | 51+ | Yes (v146+) |
| Edge | 16+ | Yes (v143+) |
| Firefox | 49+ | Yes (v148+) |
| Safari | 10+ | Yes (v26.1+) |
| Opera | 38+ | Yes (v122+) |
| Internet Explorer | Never | Not Supported |

### Mobile Browsers

| Browser | First Support | Current Status |
|---------|:-------------:|:--------------:|
| Chrome (Android) | 51+ | Yes (v142+) |
| Firefox (Android) | 49+ | Yes (v144+) |
| Safari (iOS) | 10+ | Yes (v26.1+) |
| Samsung Internet | 5.0+ | Yes (v29+) |
| Opera Mobile | 80+ | Yes |
| Android Browser | Recent | Yes (v142+) |

### Unsupported Browsers

- Internet Explorer (all versions)
- Opera Mini (all versions)
- BlackBerry (all versions)
- IE Mobile (10, 11)

## Usage Statistics

- **Global Support**: 93.05% of users have browsers with native support
- **Partial/Alternative Support**: 0%
- **Vendor Prefix Required**: No

## Implementation Example

### Basic Usage

```javascript
// Using passive event listener
element.addEventListener('touchstart', handleTouchStart, { passive: true });

// Event handler that doesn't call preventDefault()
function handleTouchStart(event) {
  console.log('Touch started at:', event.touches[0].clientX);
  // No preventDefault() call - handler is non-cancellable
}
```

### With Cancellation Fallback

```javascript
// For wheel events - passive by default in modern browsers
element.addEventListener('wheel', handleWheel, { passive: true });

// Handler that needs to detect if preventDefault() is called
function handleWheel(event) {
  if (event.defaultPrevented) {
    return; // Event was already handled
  }
  // Process wheel event
  console.log('Wheel delta:', event.deltaY);
}
```

### Mixed Approach

```javascript
// Non-passive listener for events that need preventDefault()
document.addEventListener('keydown', handleKeyDown, { passive: false });

// Passive listener for performance-critical events
document.addEventListener('scroll', handleScroll, { passive: true });
```

## Key Features

- **Backwards Compatible**: Non-supporting browsers safely ignore the `passive` option
- **Feature Detection**: Can be detected with feature detection patterns
- **Performance Critical**: Especially important for mobile applications and scroll-heavy pages
- **Browser Optimization**: Allows browsers to perform scroll optimizations without waiting for JavaScript

## Notes

- The `passive` option is part of the EventListenerOptions object
- Browsers may provide warnings in the console if passive listeners are used appropriately
- Most modern event libraries and frameworks now support passive listeners natively
- This feature is particularly important for Web Core Vitals and performance metrics

## Related Resources

### Official Documentation
- [Improving scroll performance with passive event listeners - Google Developers Updates](https://developers.google.com/web/updates/2016/06/passive-event-listeners?hl=en)

### Implementation References
- [WICG EventListenerOptions Repository](https://github.com/WICG/EventListenerOptions)
- [WICG Polyfill Implementation](https://github.com/WICG/EventListenerOptions/blob/gh-pages/EventListenerOptions.polyfill.js)

### Interactive Examples
- [JS Bin Test Case](https://jsbin.com/jaqaku/edit?html,js,output)

## Recommendations

1. **Use Passive Listeners by Default**: For touch and wheel events, use `{ passive: true }` unless you specifically need to cancel the event
2. **Performance Monitoring**: Monitor your application's scroll performance using tools like Lighthouse or WebPageTest
3. **Polyfill for Legacy Browsers**: If you need to support older browsers, use the WICG polyfill
4. **Framework Support**: Most modern frameworks (React, Vue, Angular) handle this automatically in recent versions

## Browser Implementation Timeline

- **2016**: Introduced in Chrome 51 as an optimization for scroll performance
- **2016**: Quickly adopted by other modern browsers (Firefox 49, Edge 16, Safari 10)
- **2023+**: Widely supported across all modern browsers and devices
- **Today**: Standard practice in web development for performance-critical applications
