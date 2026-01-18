# CSS Namespaces

## Overview

CSS namespaces allow you to target elements from different namespaces (such as SVG) using the `@namespace` at-rule in combination with the pipe (`|`) namespace selector. This feature is essential for styling elements that exist in non-HTML namespaces within your documents.

## Description

Using the `@namespace` at-rule, elements of other namespaces (e.g. SVG) can be targeted using the pipe (`|`) selector. This enables developers to:

- Target SVG elements specifically within HTML documents
- Differentiate between elements with the same tag name but from different namespaces
- Apply namespace-specific styling rules without affecting HTML elements
- Combine multiple namespace declarations in a single stylesheet

## Specification Status

**Status:** ![Recommendation](https://img.shields.io/badge/Status-Recommendation-blue)

**Specification URL:** [CSS Namespaces - W3C](https://w3c.github.io/csswg-drafts/css-namespaces/)

CSS Namespaces is a mature W3C Recommendation standard, indicating it has reached a stable state and is widely implemented across modern browsers.

## Categories

- **CSS** - Core CSS specification

## Benefits and Use Cases

### Key Benefits

1. **SVG Styling** - Target and style SVG elements embedded within HTML documents without affecting HTML elements with the same tag name
2. **Namespace Clarity** - Explicitly declare namespace prefixes for improved code readability and maintainability
3. **Conflict Prevention** - Avoid style conflicts between elements from different namespaces
4. **XML Document Support** - Apply styles to elements in XML documents with multiple namespaces
5. **Cross-Namespace Consistency** - Maintain consistent styling patterns across multiple namespaces

### Common Use Cases

- **Embedded SVG Graphics** - Style SVG elements that are embedded directly in HTML
- **Icon Systems** - Create robust icon styling that won't conflict with HTML element styles
- **XML Processing** - Apply CSS to XML documents containing multiple namespaces
- **Web Components** - Style custom elements and their internal SVG content
- **Document Fragments** - Apply namespace-specific styles to imported XML content

## Browser Support

### First Version with Full Support

| Browser | First Version | Release Year |
|---------|---------------|--------------|
| Chrome | 4 | 2010 |
| Firefox | 2 | 2006 |
| Safari | 4 | 2009 |
| Opera | 9 | 2006 |
| Edge | 12 | 2015 |
| Internet Explorer | 9 | 2011 |
| iOS Safari | 4.2-4.3 | 2010 |
| Android | 2.1 | 2010 |

### Support Status by Browser

#### Desktop Browsers

**Chrome/Chromium-based**
- ✅ **Chrome 4+** - Full support since 2010
- ✅ **Edge 12+** - Full support since initial release
- ✅ **Opera 9+** - Full support since initial release

**Mozilla Firefox**
- ✅ **Firefox 2+** - Full support since initial release
- Current version: **148** - Full support

**Apple Safari**
- ⚠️ **Safari 3.1-3.2** - Partial/Unknown support
- ✅ **Safari 4+** - Full support since 2009
- Current version: **18.5+** - Full support

**Internet Explorer**
- ❌ **IE 5.5-8** - No support
- ✅ **IE 9-11** - Full support since IE 9

#### Mobile Browsers

**iOS Safari**
- ⚠️ **iOS 3.2** - Partial/Unknown support
- ⚠️ **iOS 4.0-4.1** - Partial/Unknown support
- ✅ **iOS 4.2+** - Full support since iOS 4.2

**Android Browser**
- ✅ **Android 2.1+** - Full support since initial release

**Mobile Opera**
- ✅ **Opera Mobile 10+** - Full support since version 10

**Samsung Internet**
- ✅ **Samsung 4+** - Full support since initial release

#### Other Browsers

- ✅ **Opera Mini** - Full support (all versions)
- ✅ **BlackBerry Browser 7+** - Full support
- ✅ **UC Browser 15.5+** - Full support
- ✅ **Baidu Browser 13.52+** - Full support
- ✅ **KaiOS 2.5+** - Full support

### Overall Support

**Global Usage:** 93.69% of users have browsers with full CSS Namespace support

This indicates excellent browser coverage, with only legacy and unsupported browsers lacking this feature.

## Syntax and Examples

### Basic Namespace Declaration

```css
/* Declare an SVG namespace */
@namespace svg "http://www.w3.org/2000/svg";

/* Declare a default namespace */
@namespace "http://www.w3.org/1999/xhtml";
```

### Namespace Selector Usage

```css
/* Target any SVG element */
svg|rect {
  fill: blue;
  stroke: red;
}

/* Target SVG circle elements specifically */
svg|circle {
  r: 50px;
  fill: green;
}

/* Combine with other selectors */
svg|g svg|text {
  font-family: Arial, sans-serif;
  font-size: 14px;
}
```

### Complete Example

```css
@namespace svg "http://www.w3.org/2000/svg";

/* Style SVG rects without affecting HTML elements */
svg|rect {
  fill: #3498db;
  transition: fill 0.3s ease;
}

svg|rect:hover {
  fill: #2980b9;
}

/* Style SVG text elements */
svg|text {
  fill: #2c3e50;
  font-weight: bold;
}
```

### HTML with SVG

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    @namespace svg "http://www.w3.org/2000/svg";

    svg|rect {
      fill: navy;
    }

    rect {
      fill: red; /* Won't match SVG rects */
    }
  </style>
</head>
<body>
  <svg width="200" height="200">
    <rect x="10" y="10" width="50" height="50" />
  </svg>
</body>
</html>
```

## Known Limitations and Notes

- No specific bugs or limitations documented for this feature
- Support is nearly universal across modern browsers
- Only legacy browsers (Internet Explorer 8 and earlier, very old Safari versions) lack support
- The feature works reliably for its intended purpose of namespace differentiation

## Related Resources

### Official Documentation

- **[MDN Web Docs - CSS @namespace](https://developer.mozilla.org/en-US/docs/Web/CSS/@namespace)** - Comprehensive reference guide with examples and browser compatibility details

### Additional Resources

- **[W3C CSS Namespaces Specification](https://w3c.github.io/csswg-drafts/css-namespaces/)** - Official specification document
- **[SVG Styling with CSS](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS)** - Guide to styling SVG with CSS
- **[CSS Selectors Level 3](https://www.w3.org/TR/selectors-3/)** - Related CSS selector specifications

## Summary

CSS Namespaces is a well-established W3C Recommendation with excellent browser support. With 93.69% global coverage, it can be safely used in production without fallback concerns for modern browsers. The feature is particularly valuable for projects that embed SVG content within HTML documents and require precise styling control without namespace conflicts.
