# Resize Observer API

## Overview

The **Resize Observer API** provides a method for observing and reacting to changes in the dimensions of DOM elements. It enables developers to efficiently detect when elements are resized without relying on polling or resize events.

## Description

Resize Observer allows you to monitor one or more elements and automatically trigger a callback function whenever any observed element's size changes. This is particularly useful for responsive components that need to adapt to their container dimensions or for laying out content dynamically.

## Specification Status

- **Status**: Working Draft (WD)
- **Specification**: [W3C Resize Observer Specification](https://w3c.github.io/csswg-drafts/resize-observer/)

## Categories

- **DOM** - Document Object Model
- **JS API** - JavaScript API

## Key Benefits & Use Cases

### Benefits

- **Efficient Monitoring**: Observe element size changes without performance-heavy polling
- **Responsive Containers**: Create components that respond to their container size rather than viewport size
- **Dynamic Layouts**: Automatically adjust layouts when content changes dimensions
- **No Global Events**: Avoid relying on the global `resize` event which fires for the window
- **Container Queries Alternative**: Provides a programmatic approach to responding to container dimensions
- **Smooth Transitions**: Enable smooth animations and transitions when dimensions change

### Common Use Cases

1. **Responsive Chart/Graph Components**: Resize visualizations when their container dimensions change
2. **Adaptive Grid Layouts**: Adjust column counts or item sizes based on element dimensions
3. **Text Truncation**: Determine if text should be truncated based on element height
4. **Image Galleries**: Dynamically adjust gallery layout when wrapper resizes
5. **Dashboard Widgets**: Adapt widget content and complexity based on available space
6. **Custom Scrollbar Management**: Adjust scrollbar appearance based on content container size
7. **Video/Media Resizing**: Scale media players to fit their container
8. **Layout Calculations**: Compute layout metrics that depend on element dimensions

## Browser Support

The following table shows Resize Observer API support across major browsers and platforms:

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 64+ | Supported | Full support from version 64 onwards |
| Edge | 79+ | Supported | Full support from version 79 onwards |
| Firefox | 69+ | Supported | Full support from version 69 onwards |
| Safari | 13.1+ | Supported | Full support from version 13.1 onwards |
| Opera | 52+ | Supported | Full support from version 52 onwards |
| Internet Explorer | All versions | Not Supported | No support in any version |

### Mobile & Tablet Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| iOS Safari | 13.4+ | Supported | Full support from version 13.4 onwards |
| Chrome for Android | 142+ | Supported | Full support from version 142 onwards |
| Firefox for Android | 144+ | Supported | Full support from version 144 onwards |
| Samsung Internet | 9.2+ | Supported | Full support from version 9.2 onwards |
| Opera Mobile | 80+ | Supported | Full support from version 80 onwards |
| Android Browser | 142+ | Supported | Full support in recent versions |
| Opera Mini | All versions | Not Supported | No support in any version |

### Feature Notes

- **Chrome 54-63**: Available behind the "Experimental Web Platform Features" flag (indicated by `n d #1`)
- **Safari 13**: Partial support with disabled status (indicated by `n d`)
- **Opera 41-51**: Available behind the "Experimental Web Platform Features" flag

### Global Support

- **Supported globally**: 92.65% of users
- **Partial support**: 0%
- **Usage based on usage statistics from Can I Use**

## API Overview

### Basic Usage

```javascript
// Create a new ResizeObserver
const observer = new ResizeObserver((entries) => {
  for (let entry of entries) {
    console.log('Element:', entry.target);
    console.log('Width:', entry.contentRect.width);
    console.log('Height:', entry.contentRect.height);
  }
});

// Observe an element
const element = document.getElementById('my-element');
observer.observe(element);

// Stop observing
observer.unobserve(element);

// Disconnect all observations
observer.disconnect();
```

### ResizeObserverEntry Properties

- `target`: The DOM element being observed
- `contentRect`: A DOMRectReadOnly object with the element's dimensions
  - `width`: Element's content width
  - `height`: Element's content height
  - `top`: Distance from the top
  - `left`: Distance from the left
  - `bottom`: Distance from the bottom
  - `right`: Distance from the right

## Compatibility Notes

### Fallback Strategy for Older Browsers

For browsers that don't support Resize Observer, consider these alternatives:

1. **Polyfills**: Use polyfills for full compatibility
2. **Event Listeners**: Fall back to window resize events with debouncing
3. **CSS Media Queries**: Use CSS media queries for responsive design
4. **Intersection Observer**: Use Intersection Observer for visibility-based responses

### Experimental Features

Chrome and Opera browsers offered experimental support through a feature flag before general availability. Enable the "Experimental Web Platform Features" flag in `chrome://flags` to test in versions 54-63 (Chrome) and 41-51 (Opera).

## Related Resources

### Official Documentation

- [W3C Resize Observer Specification](https://w3c.github.io/csswg-drafts/resize-observer/)

### Learning & Articles

- [Google Developers: Resize Observer Article](https://developers.google.com/web/updates/2016/10/resizeobserver)
- [Explainer Document](https://github.com/WICG/ResizeObserver/blob/master/explainer.md)

### Polyfills

- [Polyfill based on initial specification](https://github.com/que-etc/resize-observer-polyfill)
- [Polyfill based on latest specification with observer options support](https://github.com/juggle/resize-observer)

### Implementation References

- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1272409)
- [WebKit Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=157743)

## Recommendations

### When to Use Resize Observer

- When you need to respond to element size changes (not just viewport size)
- When implementing responsive, container-based components
- When building dashboards or adaptive layouts
- When you want to avoid global resize event handlers

### Best Practices

1. **Throttle/Debounce Updates**: Consider debouncing expensive operations triggered by resize changes
2. **Unobserve When Done**: Always call `unobserve()` or `disconnect()` when monitoring is no longer needed
3. **Use for Progressive Enhancement**: Provide fallbacks for browsers without Resize Observer
4. **Monitor Specific Dimensions**: Only observe the elements that actually need monitoring
5. **Handle Layout Thrashing**: Be cautious of creating layout thrashing by reading DOM properties in resize callbacks

### Example: Responsive Chart Component

```javascript
class ResponsiveChart {
  constructor(element) {
    this.element = element;
    this.observer = new ResizeObserver(() => this.redrawChart());
    this.observer.observe(element);
  }

  redrawChart() {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    // Redraw chart with new dimensions
  }

  destroy() {
    this.observer.disconnect();
  }
}
```

## Summary

Resize Observer is a modern, efficient API for monitoring element dimension changes. With broad support across modern browsers (92.65% global coverage), it's a reliable choice for responsive component development. For older browser support, polyfills are available and straightforward to implement.
