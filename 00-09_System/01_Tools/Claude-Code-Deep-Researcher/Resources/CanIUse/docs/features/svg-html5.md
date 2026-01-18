# Inline SVG in HTML5

## Overview

Inline SVG in HTML5 is a web feature that allows developers to embed SVG (Scalable Vector Graphics) elements directly within HTML documents. This integration requires an HTML5 parser and has become a standard way to include vector graphics in modern web applications.

## Description

Method of using SVG tags directly in HTML documents. Requires HTML5 parser.

## Specification Status

**Status:** Living Standard (ls)

**Official Specification:** [HTML Living Standard - Embedded Content](https://html.spec.whatwg.org/multipage/embedded-content.html#svg-0)

## Categories

- HTML5
- SVG

## Benefits and Use Cases

### Key Benefits

1. **Scalability** - SVG graphics scale perfectly at any resolution without quality loss
2. **Styling Control** - Apply CSS styling directly to inline SVG elements
3. **Scripting Access** - Manipulate SVG elements using JavaScript DOM APIs
4. **Smaller File Sizes** - Vector format often results in smaller files compared to raster images
5. **Accessibility** - Better semantic structure and accessibility compared to image elements
6. **Animation** - Native support for CSS animations and transitions on SVG elements
7. **Responsive Graphics** - Create graphics that adapt to different screen sizes

### Common Use Cases

- Interactive data visualizations and charts
- Animated icons and logos
- Responsive diagrams and infographics
- Custom UI components and buttons
- Game graphics and animations
- Maps and geospatial visualizations
- Animated backgrounds and transitions

## Browser Support

### Support Legend

- **y** - Fully supported
- **y #1** - Supported with notes (see notes section)
- **p** - Partial support
- **n** - Not supported

### Desktop Browsers

| Browser | Support | Version Range |
|---------|---------|---------------|
| **Internet Explorer** | Limited | v9-11: y #1, v8 and below: p/n |
| **Edge** | Excellent | v12+: y (v12-16: y #1, v17+: y) |
| **Firefox** | Excellent | v4+: y (v2-3.6: p) |
| **Chrome** | Excellent | v7+: y (v4-6: p) |
| **Safari** | Excellent | v5.1+: y (v3.1-5: p) |
| **Opera** | Good | v11.6+: y (earlier versions: p/n) |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | Excellent | v5.0+: y (v3.2-4.3: p) |
| **Android** | Good | v3+: y (v2.1-2.3: n) |
| **Samsung Internet** | Excellent | v4+: y |
| **Opera Mobile** | Good | v12+: y |
| **Chrome Mobile** | Excellent | v142: y |
| **Firefox Mobile** | Excellent | v144: y |
| **Opera Mini** | Excellent | All versions: y |
| **UC Browser** | Supported | v15.5+: y |

### Less Common Browsers

| Browser | Support |
|---------|---------|
| **BlackBerry** | v7+: y (v7: y #1) |
| **IE Mobile** | v10-11: y #1 |
| **Baidu** | v13.52: y |
| **QQ Browser** | v14.9: y |
| **KaiOS** | v2.5-3.1: y |

## Implementation Notes

### Important Limitations and Caveats

**Note #1 - CSS Transform Support:**
In earlier versions of certain browsers (Internet Explorer 9-11, Safari 5.1-8, iOS Safari 5.0-8.x, Android 3-4.x, BlackBerry 7, and IE Mobile 10-11), CSS transforms are not supported on SVG elements. Use the SVG `transform` attribute as a workaround instead of CSS transforms.

**Example:**
```svg
<!-- Use SVG transform attribute instead of CSS transforms -->
<svg width="100" height="100">
  <rect x="10" y="10" width="80" height="80" transform="rotate(45)"/>
</svg>
```

### Android Compatibility Issue

Inline SVG in HTML works in Android 4+, but has bugs when manipulating elements using JavaScript, particularly:

- Setting `className` property directly does not work
- **Workaround:** Use `getAttribute('class')` and `setAttribute('class', 'classname')` instead

**Example:**
```javascript
// Avoid this on Android:
element.className = 'newClass';

// Use this instead:
element.setAttribute('class', 'newClass');
```

## Global Browser Coverage

- **Full Support:** 93.69% of global users
- **Partial/Conditional Support:** 0% with notes
- **No Support:** Minimal (legacy browsers only)

## Quick Reference

### Current Browser Support Summary

- **All modern browsers:** Fully supported
- **Internet Explorer:** Partial support (IE 9-11 have limitations)
- **Mobile browsers:** Excellent support across iOS, Android, and other mobile platforms
- **Legacy browsers:** Limited support in older versions

### Recommended Fallbacks

For maximum compatibility with older browsers:

1. Provide alternative image formats for legacy browsers
2. Use feature detection with JavaScript
3. Test on target browsers before deployment
4. Consider SVG polyfills for older IE versions

## Related Resources

### Official Documentation
- [Mozilla Hacks Blog Post on Inline SVG](https://hacks.mozilla.org/2010/05/firefox-4-the-html5-parser-inline-svg-speed-and-more/)
- [MSDN Test Suite](http://samples.msdn.microsoft.com/ietestcenter/html5/svghtml_harness.htm?url=SVG_HTML_Elements_001)

### Additional Learning Resources

- [MDN Web Docs - SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [W3C SVG Specification](https://www.w3.org/Graphics/SVG/)
- [Can I Use - Inline SVG in HTML5](https://caniuse.com/svg-html5)

## Practical Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .circle {
      fill: blue;
      transition: fill 0.3s ease;
    }

    .circle:hover {
      fill: red;
    }
  </style>
</head>
<body>
  <!-- Inline SVG example -->
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle class="circle" cx="50" cy="50" r="40"/>
  </svg>

  <script>
    // Manipulate SVG with JavaScript
    const circle = document.querySelector('.circle');

    // For Android compatibility, use setAttribute instead of direct property access
    circle.addEventListener('click', function() {
      if (this.getAttribute('class') === 'circle') {
        this.setAttribute('class', 'circle active');
      }
    });
  </script>
</body>
</html>
```

## Conclusion

Inline SVG in HTML5 is a well-supported, mature feature across all modern browsers. It provides a powerful way to include scalable vector graphics directly in web documents with full CSS and JavaScript integration capabilities. While older versions of Internet Explorer and some mobile browsers have limitations, the feature has near-universal support in contemporary web development.

For production applications, the 93.69% global usage coverage makes it safe to use without fallbacks for most use cases, though testing on target browsers remains important for optimal compatibility.
