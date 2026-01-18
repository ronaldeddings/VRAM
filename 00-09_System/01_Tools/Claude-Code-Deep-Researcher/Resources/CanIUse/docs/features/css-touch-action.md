# CSS touch-action Property

## Overview

The `touch-action` CSS property provides a declarative mechanism for developers to control how touch gestures are handled on elements. It enables selective disabling of touch scrolling in one or both axes and double-tap zooming, improving the responsiveness and interactivity of web applications on touch-enabled devices.

## Description

`touch-action` is a CSS property that controls filtering of gesture events, providing developers with a declarative mechanism to selectively disable touch scrolling (in one or both axes) or double-tap-zooming.

## Specification Status

**Status:** Recommended (REC)

**Specification:** [W3C Pointer Events - CSS touch-action Property](https://www.w3.org/TR/pointerevents/#the-touch-action-css-property)

The property is now a standardized recommendation, ensuring consistent behavior across major browsers.

## Categories

- CSS

## Benefits and Use Cases

### Primary Benefits
- **Improved Touch Performance:** Eliminate 300ms tap delay by disabling double-tap zoom
- **Better User Experience:** Provide immediate visual feedback on touch interactions
- **Gesture Control:** Prevent unwanted default touch behaviors on interactive elements
- **Mobile Optimization:** Create responsive, touch-friendly web applications

### Common Use Cases
- **Interactive Elements:** Buttons and clickable areas requiring immediate response
- **Custom Gestures:** Implement custom touch gesture handling without default browser interference
- **Drag and Drop:** Enable smooth dragging without scroll interference
- **Games and Interactive Apps:** Fine-grained control over touch event handling
- **Pan/Zoom Controls:** Disable standard zooming to implement custom controls
- **Sliders and Carousels:** Prevent unintended scrolling while swiping

## Browser Support

### Summary Statistics
- **Full Support:** 91.78% of users
- **Partial Support:** 0.32% of users
- **No Support:** 7.90% of users

### Detailed Browser Support Table

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 36+ | ✅ Full Support | Complete support from version 36 onwards |
| **Edge** | 12+ | ✅ Full Support | Full support from Edge 12 |
| **Firefox** | 29-51 | 🔶 Partial | Behind `layout.css.touch_action.enabled` flag |
| **Firefox** | 52+ | ✅ Full Support | Full support with some limitations noted |
| **Safari** | All Versions | ❌ Not Supported | Not applicable to platforms without touch events |
| **Opera** | 9-22 | ❌ Not Supported | Not supported |
| **Opera** | 23+ | ✅ Full Support | Full support from version 23 onwards |
| **iOS Safari** | 3.2-9.2 | ❌ Not Supported | Not applicable to touch event platforms |
| **iOS Safari** | 9.3-12.5 | 🔶 Partial | Limited support (`auto` and `manipulation` only) |
| **iOS Safari** | 13.0+ | ✅ Full Support | Full support from iOS 13 onwards |
| **Android Browser** | 2.1-4.4.4 | ❌ Not Supported | Not supported |
| **Android Browser** | 142+ | ✅ Full Support | Full support in recent versions |
| **Opera Mobile** | 10-12.1 | ❌ Not Supported | Not supported |
| **Opera Mobile** | 80+ | ✅ Full Support | Full support from version 80 onwards |
| **IE Mobile** | 10 | 🔶 Partial | Non-standard properties supported |
| **IE Mobile** | 11 | ✅ Full Support | Full support |
| **Samsung Internet** | 4.0+ | ✅ Full Support | Full support from version 4.0 onwards |
| **UC Browser** | 15.5+ | ✅ Full Support | Full support |
| **Chrome Android** | 142+ | ✅ Full Support | Full support in recent versions |
| **Firefox Android** | 144+ | ✅ Full Support | Full support in recent versions |
| **Opera Mini** | All | ❌ Not Supported | No support across all versions |
| **Baidu Browser** | 13.52+ | ✅ Full Support | Full support |
| **QQ Browser** | 14.9+ | ✅ Full Support | Full support |
| **KaiOS** | 2.5 | 🔶 Partial | Behind feature flag |
| **KaiOS** | 3.0-3.1 | ✅ Full Support | Full support |

**Legend:**
- ✅ Full Support
- 🔶 Partial Support
- ❌ Not Supported

## Implementation Notes

### Partial Support Details

#### Firefox (versions 29-51)
- Supported behind the `layout.css.touch_action.enabled` flag
- Firefox for Windows 8 Touch ('Metro') has this enabled by default

#### Internet Explorer / IE Mobile (versions 10+)
- Supported non-standard properties:
  - `double-tap-zoom`
  - `cross-slide-x`
  - `cross-slide-y`

#### iOS Safari (versions 9.3-12.5)
- Only supports `auto` and `manipulation` values
- Full value support available from version 13.0+

#### Firefox (versions 52-56)
- Not applicable to platforms that do not support pointer or touch events

#### Safari (all versions)
- Not applicable to platforms that do not support touch events

### Key Considerations

1. **Platform Dependency:** The property is most relevant for touch-enabled devices. Desktop browsers handle it but may not exhibit visible behavior differences for touch gestures.

2. **Value Support:** Different browsers may support different values of the `touch-action` property. Always test across target platforms.

3. **Fallback Strategies:** For older browsers without support, consider using JavaScript event listeners as a fallback for custom gesture handling.

4. **Performance:** Using `touch-action` is more performant than JavaScript-based gesture handling, as it allows the browser to optimize touch event processing.

## Common Property Values

The `touch-action` property accepts the following values:

| Value | Description |
|-------|-------------|
| `auto` | Default browser behavior |
| `none` | Disables all touch gestures |
| `manipulation` | Allows pan and pinch-zoom, disables double-tap zoom |
| `pan-x` | Allows horizontal pan |
| `pan-y` | Allows vertical pan |
| `pan-left` | Allows left pan |
| `pan-right` | Allows right pan |
| `pan-up` | Allows up pan |
| `pan-down` | Allows down pan |
| `pinch-zoom` | Allows pinch-zoom |
| `double-tap-zoom` | Allows double-tap zoom |

## Related Resources

### Official Documentation
- [MDN Web Docs - CSS touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)

### Articles and Guides
- [Chrome Blog: 300ms tap delay, gone away](https://developer.chrome.com/blog/300ms-tap-delay-gone-away/)
- [Telerik Blog: What Exactly Is... The 300ms Click Delay](https://www.telerik.com/blogs/what-exactly-is.....-the-300ms-click-delay)

## Recommendations

### For Maximum Compatibility
- Target modern browsers (Chrome 36+, Edge 12+, Firefox 52+, Safari 13+)
- For older browser support, implement JavaScript-based fallbacks
- Test extensively on actual touch devices, not just desktop emulation

### Best Practices
1. Use `touch-action: manipulation` for interactive buttons and form controls
2. Use `touch-action: none` for custom gesture-based interfaces
3. Use specific values (e.g., `pan-x`, `pan-y`) to allow only desired gestures
4. Always test on actual touch devices to verify behavior
5. Provide appropriate feedback for touch interactions (visual and/or haptic)

### Progressive Enhancement
- Start with semantic HTML and CSS
- Apply `touch-action` to progressive enhance touch interaction
- Provide JavaScript event handlers as fallback for older browsers
- Test across a range of devices and browsers

## Browser Compatibility Timeline

- **2014:** Chrome 36 introduces full support
- **2014:** Opera 23 introduces support
- **2015:** Firefox 52 introduces full support
- **2018:** iOS Safari 13 introduces full support
- **2020:** Most modern browsers fully support the property
- **Current:** 91.78% of users have full support

---

**Last Updated:** Based on CanIUse data (current browser release versions)

**Note:** Browser support data is constantly evolving. Always check [CanIUse.com](https://caniuse.com) for the most current compatibility information.
