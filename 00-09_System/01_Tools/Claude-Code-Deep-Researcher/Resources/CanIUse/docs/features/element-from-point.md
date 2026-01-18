# document.elementFromPoint()

## Overview

`document.elementFromPoint()` is a DOM API that performs hit-testing on the document to determine which element would receive a click event at a specific viewport-relative coordinate.

## Description

Given coordinates for a point relative to the viewport, `elementFromPoint()` returns the element that a click event would be dispatched to if the user were to click at that point. In essence, it performs the same hit-testing logic that the browser uses when processing user clicks, allowing developers to programmatically determine which element occupies a specific screen position.

This is particularly useful for:
- Custom event handling systems
- Drag-and-drop implementations
- Hit detection in games or interactive applications
- UI testing and automation
- Coordinate-based element selection

## Specification Status

**Status**: Working Draft (WD)
**Specification**: [CSSOM View Module - elementFromPoint](https://www.w3.org/TR/cssom-view-1/#dom-document-elementfrompoint)

The feature is defined in the CSSOM View specification, which standardizes viewport-related DOM APIs.

## Categories

- **DOM** - Document Object Model API

## Browser Support

### Desktop Browsers

| Browser | First Support | Status | Current Support |
|---------|---------------|--------|-----------------|
| **Internet Explorer** | 6 | ✅ Supported | ✅ 6-11 |
| **Edge** | 12 | ✅ Supported | ✅ All modern versions |
| **Firefox** | 3 | ✅ Supported | ✅ 3+ (fully supported) |
| **Chrome** | 15 | ✅ Supported | ✅ 15+ (fully supported) |
| **Safari** | 5 | ✅ Supported | ✅ 5+ (fully supported) |
| **Opera** | 11 | ✅ Supported | ✅ 11+ (fully supported) |

### Mobile Browsers

| Browser | First Support | Status | Current Support |
|---------|---------------|--------|-----------------|
| **iOS Safari** | 4.0 | ✅ Supported | ✅ 4.0+ (fully supported) |
| **Chrome Android** | All | ✅ Supported | ✅ Fully supported |
| **Firefox Android** | All | ✅ Supported | ✅ Fully supported |
| **Opera Mobile** | 12 | ✅ Supported | ✅ 12+ |
| **Opera Mini** | All | ✅ Supported | ✅ Fully supported |
| **Android Browser** | 2.3 | ✅ Supported | ✅ 2.3+ |
| **Samsung Internet** | 4.0 | ✅ Supported | ✅ 4.0+ |
| **UC Browser** | 15.5 | ✅ Supported | ✅ 15.5+ |

### Legacy & Unsupported Versions

| Browser | Version | Status |
|---------|---------|--------|
| IE | 5.5 | ❌ Unsupported |
| Chrome | 4-14 | ❌ Unsupported |
| Firefox | 2 | ❌ Unsupported |
| Safari | 3.1-4 | ❌ Unsupported |
| Opera | 9-10.6 | ❌ Unsupported |
| iOS Safari | 3.2 | ❌ Unsupported |
| Opera Mobile | 10-11.5 | ❌ Unsupported |
| Android | 2.1-2.2 | ❌ Unsupported |

## Usage Statistics

- **Usage (with full support)**: 93.72% of global browser market
- **Usage (with partial support)**: 0%
- **Total Supported**: 93.72%

The API enjoys nearly universal support across modern browsers, making it safe to use without fallbacks in contemporary web development.

## Use Cases & Benefits

### Common Use Cases

1. **Interactive Element Detection**
   - Determine which DOM element is at a specific screen position
   - Useful for custom UI frameworks and interactive applications

2. **Drag-and-Drop Implementation**
   - Find target elements during drag operations
   - Implement custom drop-zone detection without relying solely on mouse events

3. **Game Development**
   - Perform hit-testing for click-based games in the browser
   - Determine collision points and interactive element selection

4. **Custom Event Systems**
   - Build custom event handling that requires precise element detection
   - Implement alternative pointer/click event flows

5. **Testing & Automation**
   - Test which element would receive events at specific coordinates
   - Automate UI testing by identifying elements at known positions
   - Headless testing and accessibility verification

6. **Touch & Pointer Event Handling**
   - Supplement touch and pointer events with precise element detection
   - Handle edge cases where standard events don't provide needed information

### Benefits

- **Native Browser API**: No external libraries required
- **Performance**: Direct hit-testing at native browser speed
- **Accuracy**: Uses the same algorithm browsers use for click detection
- **Simplicity**: Single method call with minimal overhead
- **Cross-Platform**: Consistent behavior across all modern browsers

## Implementation Notes

### Important Compatibility Note

Older versions of Safari and Opera (pre-2009 era) require absolute document coordinates rather than viewport-relative coordinates. If supporting very legacy browsers is necessary, coordinate transformation may be required. However, given their market share, this is rarely a practical concern in modern development.

### Method Signature

```javascript
const element = document.elementFromPoint(x, y);
```

### Parameters

- **x** (number): Horizontal coordinate relative to the viewport
- **y** (number): Vertical coordinate relative to the viewport

### Return Value

- Returns the `Element` node at the specified coordinates
- Returns `null` if no element exists at the coordinates or if the coordinates are invalid
- The return value respects CSS pointer-events styling (elements with `pointer-events: none` are skipped)

### Example Usage

```javascript
// Find element at mouse position
document.addEventListener('click', (e) => {
  const clickTarget = document.elementFromPoint(e.clientX, e.clientY);
  console.log('Clicked element:', clickTarget);
});

// Find element at arbitrary coordinates
const element = document.elementFromPoint(100, 200);
if (element) {
  console.log('Element at (100, 200):', element.tagName, element.className);
}
```

## Related APIs

- **`Element.elementsFromPoint()`** - Returns all elements at a point (array), including those obscured by others
- **`Document.caretRangeFromPoint()`** - Returns a text range at a point
- **Pointer Events** - Low-level pointer interaction events
- **Mouse Events** - Traditional mouse click and movement events

## Additional Resources

- **[MDN Web Docs - elementFromPoint](https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint)** - Comprehensive documentation with examples
- **[W3C CSSOM View Module](https://www.w3.org/TR/cssom-view-1/#dom-document-elementfrompoint)** - Official specification
- **[Can I Use - elementFromPoint](https://caniuse.com/element-from-point)** - Live browser support data

## Summary

`document.elementFromPoint()` is a well-established, near-universally supported API for performing hit-detection on web documents. With 93.72% support across modern browsers and full support in all contemporary versions of major browsers, it is safe to use without polyfills or fallbacks. It remains an essential tool for implementing interactive features, custom event systems, and testing frameworks in modern web applications.
