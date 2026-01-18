# CSS Pointer-Events (for HTML)

## Overview

The CSS `pointer-events` property allows developers to control whether an element responds to pointer events (mouse, touch, or pen interactions). When set to `none`, the element will not receive hover or click events, and these events will instead be processed by elements behind it.

## Description

This CSS property provides a powerful mechanism for managing event interaction on web elements. Setting `pointer-events: none` effectively makes an element "transparent" to pointer events, allowing events to pass through to underlying elements. This is particularly useful for overlay elements, disabled states, and interactive component behavior.

## Current Specification Status

**Status:** Unofficial/Working Draft
**Specification URL:** [CSS4 UI - pointer-events](https://wiki.csswg.org/spec/css4-ui#pointer-events)

The `pointer-events` property originated in the SVG specification and has been extended for HTML elements. The SVG 2.0 specification defines additional values, including `bounding-box`, which allows the rectangular area around an element to receive pointer events (currently only supported in Chrome 65+).

## Categories

- CSS3

## Benefits and Use Cases

- **Disabling Interactive Elements:** Prevent click/hover events on disabled buttons or form elements
- **Overlay Management:** Create non-interactive overlays or loading spinners that don't block interaction with underlying content
- **Visual Layering:** Allow clicks to pass through decorative elements to interactive ones below
- **Custom Event Handling:** Enable custom event handling by bypassing default pointer event behavior
- **Performance Optimization:** Reduce event processing overhead for non-interactive visual elements
- **Accessibility:** Create accessible experiences by managing pointer event flow through complex UI hierarchies

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Internet Explorer** | 11+ | Not supported in IE 5.5-10. Bugs noted in IE 11 for links and select elements. |
| **Edge** | 12+ | Full support from Edge 12 onwards. Bugs noted in Edge 17 and below for links. |
| **Firefox** | 3.6+ | Supported since Firefox 3.6. Full support in all modern versions. |
| **Chrome** | 4+ | Supported since Chrome 4. Full support including SVG elements and bounding-box value. |
| **Safari** | 4+ | Supported since Safari 4. Full support in all modern versions. |
| **Opera** | 15+ | Supported since Opera 15 (with Chromium). Not supported in Opera 9-12.1. |
| **iOS Safari** | 3.2+ | Full support across all versions. |
| **Android** | 2.1+ | Full support across versions. |
| **Opera Mobile** | 80+ | Not supported in Opera Mobile until version 80. |
| **Opera Mini** | Not Supported | Does not support `pointer-events` on any version. |

### Usage Statistics

- **Global Support:** 93.6% of users have browsers that support `pointer-events`
- **Partial Support:** 0%
- **No Support:** 6.4%

## Implementation Examples

### Basic Usage

```css
/* Disable pointer events on an element */
.overlay {
  pointer-events: none;
}

/* Re-enable pointer events on a child element */
.overlay.interactive {
  pointer-events: auto;
}

/* Disable pointer events on disabled buttons */
button:disabled {
  pointer-events: none;
  opacity: 0.6;
}
```

### Common Patterns

```css
/* Loading overlay that doesn't block interaction */
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* Modal dialog that is interactive */
.modal {
  pointer-events: auto;
}

/* Interactive element within non-interactive container */
.overlay {
  pointer-events: none;
}

.overlay .close-button {
  pointer-events: auto;
}
```

## Known Issues and Bugs

### Internet Explorer and Edge

- **Links Compatibility Issue:** `pointer-events: none` does not work on links in IE11 and Edge 17 and below unless:
  - `display` is set to `block` or `inline-block`, OR
  - `position` is set to `absolute` or `fixed`

- **Select Element Issue:** In IE11, `pointer-events: none` does not work on `select` elements if only a parent has the property set. The property must be set directly on the `select` element itself to work.

- **SVG vs HTML Detection:** IE 9 and 10 incorrectly report support for `pointer-events` on HTML elements (they return `true` when checking `'pointerEvents' in document.documentElement.style`) because they support it on SVG elements. However, they do not actually support it on HTML elements.

### Cross-browser Scrollbar Issue

- **Firefox Behavior:** Moving the scrollbar on an object with `pointer-events: none` works in Firefox
- **Chrome & IE Behavior:** In Chrome and Internet Explorer, scrollbar interaction does not work when `pointer-events: none` is applied

### SVG Bounding-Box Value

- **Limited Support:** The SVG 2.0 specification defines a `bounding-box` value for `pointer-events`. When set, the rectangular area around the element can receive pointer events
- **Browser Support:** Only Chrome 65+ currently supports the `bounding-box` value

## Historical Context

The `pointer-events` property was already part of the SVG specification, and all SVG-supporting browsers support the property on SVG elements. The extension to HTML elements provides similar functionality for HTML-based user interfaces.

## Related Resources

- **[MDN Web Docs - pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)** - Comprehensive documentation with examples
- **[Article & Tutorial](https://robertnyman.com/2010/03/22/css-pointer-events-to-allow-clicks-on-underlying-elements/)** - In-depth article and usage tutorial
- **[has.js Detection Test](https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-pointerevents)** - Feature detection code
- **[Polyfill](https://github.com/kmewhort/pointer_events_polyfill)** - JavaScript polyfill for unsupported browsers

## Accessibility Considerations

When using `pointer-events: none`, ensure that:

1. Keyboard accessibility is not affected
2. Elements are still accessible to screen readers
3. Focus management is properly handled
4. Visual feedback for hover/focus states is maintained where appropriate

The `pointer-events` property only affects pointer events; it does not affect keyboard events or assistive technology access.

## Performance Notes

- `pointer-events: none` can improve performance by reducing the number of elements that need to receive and process pointer events
- Use judiciously on deeply nested element hierarchies
- Consider using it on large non-interactive overlay elements rather than individual small elements

---

**Last Updated:** 2025-12-13
**Source:** CanIUse
**Data Current As Of:** Latest CanIUse database
