# getComputedStyle API

## Overview

`getComputedStyle()` is a DOM API that allows JavaScript to retrieve the current computed CSS styles applied to an element. This includes styles from stylesheets, inline styles, and any values set by CSS animations or transitions.

## Description

The `getComputedStyle()` method returns a `CSSStyleDeclaration` object containing the computed values of all CSS properties for the specified element. This is particularly useful when you need to programmatically access the actual rendered style values as computed by the browser, rather than just the inline styles applied directly to the element.

**Key Capability**: Returns the final computed style values as rendered by the browser, accounting for the full cascade of CSS rules, inheritance, and the browser's default styles.

## Specification Status

- **Status**: Recommendation (REC)
- **W3C Specification**: [CSSOM - getComputedStyle](https://www.w3.org/TR/cssom/#dom-window-getcomputedstyle)

The API is a stable, standardized feature with broad industry support and is unlikely to see significant changes.

## Categories

- CSS3
- DOM
- JS API

## Benefits & Use Cases

### Primary Use Cases

1. **Dynamic Style Inspection**: Programmatically read computed style values at runtime
2. **Responsive Behavior**: Detect applied styles to trigger JavaScript-based responsive logic
3. **Animation Monitoring**: Track computed values during CSS animations or transitions
4. **Conditional Styling**: Make JavaScript decisions based on current computed styles
5. **Style Debugging**: Inspect what styles the browser actually computed for debugging purposes
6. **Layout Calculations**: Determine precise dimensions and positioning values

### Common Applications

- Reading computed `width`, `height`, `display`, `position` values
- Detecting media query-applied styles via JavaScript
- Implementing JavaScript-based animations coordinated with computed styles
- Creating layout-aware JavaScript functionality
- Style validation and testing frameworks

## Syntax

```javascript
// Get computed styles for an element
const element = document.querySelector('.my-element');
const styles = window.getComputedStyle(element);

// Access specific properties
const color = styles.color;
const width = styles.width;
const display = styles.display;

// Optional: Get pseudo-element styles (second parameter)
const pseudoStyles = window.getComputedStyle(element, '::before');
```

### Parameters

- **element** (required): The Element whose computed styles you want to retrieve
- **pseudo** (optional): A string specifying a pseudo-element (e.g., `'::before'`, `'::after'`). If omitted, the styles for the element itself are returned

## Browser Support

The `getComputedStyle()` API has excellent support across modern browsers with nearly universal adoption (93.65% global usage). However, support for pseudo-elements varies.

### Support Legend

- **y**: Full support
- **a**: Partial support (see notes below)
- **n**: No support

### Browser Support Table

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 11 | ✅ Full (146) | Versions 4-10: Partial (pseudo-elements only) |
| **Firefox** | 4 | ✅ Full (148) | Versions 3-3.6: Partial (requires 2nd parameter) |
| **Safari** | 5 | ✅ Full (18.5+) | Versions 3.1-4: Partial (pseudo-elements only) |
| **Edge** | 12 | ✅ Full (143) | All modern versions fully supported |
| **Opera** | 10.6 | ✅ Full (122) | Versions 9-10.5: Partial (pseudo-elements only) |
| **IE** | 9 | ✅ Supported (11) | IE 5.5-8: Not supported; IE 9-11: Full support |

### Mobile & Specialized Browsers

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Safari iOS** | 5.0+ | ✅ Full support |
| **Android Browser** | 4 | ✅ Full support |
| **Chrome Android** | Current | ✅ Full support |
| **Firefox Android** | Current | ✅ Full support |
| **Opera Mobile** | 11 | ✅ Full support |
| **Opera Mini** | All | ⚠️ Partial support |
| **Samsung Internet** | 4+ | ✅ Full support |
| **UC Browser** | 15.5+ | ✅ Full support |
| **Baidu Browser** | 13.52+ | ✅ Full support |
| **QQ Browser** | 14.9+ | ✅ Full support |
| **Kaios** | 2.5+ | ✅ Full support |
| **BlackBerry** | 10 | ✅ Full support |
| **IE Mobile** | 10+ | ✅ Full support |

## Important Notes

### Partial Support Details

1. **Firefox 3.0-3.6 (Partial)**: Early versions required the second parameter to be explicitly included. Current versions support both syntaxes.

2. **Chrome 4-10, Safari 3.1-4, Opera 9-10.5 (Partial)**: These older versions do not support pseudo-element querying via the second parameter. The first parameter (direct element styles) works fine, but pseudo-element styles cannot be reliably retrieved.

3. **Opera Mini (All versions - Partial)**: Opera Mini has limited support for computed style retrieval.

### Browser-Specific Considerations

- **Internet Explorer 8 and below**: No support for `getComputedStyle()`. Consider using the proprietary `currentStyle` property as a fallback for legacy IE support.
- **Legacy Browsers**: For older browser compatibility, you may use polyfills or feature detection
- **Pseudo-elements**: Modern browsers fully support pseudo-element style queries, but older versions (pre-2010) may not

## Usage Example

```javascript
// Basic usage - Get all computed styles
const element = document.querySelector('h1');
const computedStyle = getComputedStyle(element);

console.log(computedStyle.color);        // Get color
console.log(computedStyle.fontSize);     // Get font size
console.log(computedStyle.backgroundColor); // Get background

// Get pseudo-element styles
const beforeStyles = getComputedStyle(element, '::before');
console.log(beforeStyles.content);       // Get ::before content

// Practical example: Check if element is hidden
function isHidden(element) {
    const style = getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden';
}

// Example: Get computed dimensions
const dimensions = {
    width: getComputedStyle(element).width,
    height: getComputedStyle(element).height,
    margin: getComputedStyle(element).margin
};
```

## Historical Context

- **IE 8 and Earlier**: No support; use `element.currentStyle` as a fallback
- **2010-2012**: Pseudo-element support was gradually added to modern browsers
- **2013+**: Full standardized support across all major modern browsers
- **Current Status**: The API is mature, stable, and universally adopted

## Polyfill & Fallbacks

For legacy Internet Explorer support (IE 5.5-8), use the `currentStyle` property:

```javascript
function getStyles(element) {
    // Modern browsers
    if (window.getComputedStyle) {
        return getComputedStyle(element);
    }
    // IE 8 and earlier
    else if (element.currentStyle) {
        return element.currentStyle;
    }
    return null;
}
```

See the IE polyfill linked in the resources section below for more comprehensive solutions.

## Related APIs

- **`element.style`**: Returns inline styles only (not computed values)
- **`element.currentStyle`**: IE-specific property (deprecated)
- **CSS Object Model (CSSOM)**: Broader specification containing this API
- **Computed Style Observer**: New API for monitoring style changes

## Resources & Links

- **[MDN Web Docs - getComputedStyle](https://developer.mozilla.org/en/DOM/window.getComputedStyle)** - Comprehensive documentation and examples
- **[W3C CSSOM Specification](https://www.w3.org/TR/cssom/#dom-window-getcomputedstyle)** - Official specification
- **[Interactive Demo](https://testdrive-archive.azurewebsites.net/HTML5/getComputedStyle/)** - Try getComputedStyle in action
- **[IE Polyfill](https://snipplr.com/view/13523)** - Polyfill implementation for legacy IE support

## Global Usage Statistics

- **Full Support**: 93.65% of global browser usage
- **Partial Support**: 0.04% of global browser usage
- **No Support**: Negligible across modern browsers

These statistics indicate that `getComputedStyle()` is a safe API to use in production applications targeting modern browsers.

---

**Last Updated**: 2024
**Specification Status**: Stable (Recommendation)
**Recommendation**: Safe to use in production; minimal compatibility concerns for modern applications
