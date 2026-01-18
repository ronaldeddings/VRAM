# Intrinsic & Extrinsic Sizing

## Overview

Intrinsic and extrinsic sizing keywords allow developers to specify dimensions for HTML elements using content-based values rather than fixed pixel measurements. This feature provides more flexible, responsive sizing options that adapt to content.

## Description

Allows for the heights and widths to be specified in intrinsic values using the `max-content`, `min-content`, `fit-content`, and `stretch` (formerly `fill`) properties.

These CSS keywords enable:
- **max-content**: Sets size based on the maximum content width/height
- **min-content**: Sets size based on the minimum content width/height
- **fit-content**: Adapts size to fit available space while respecting min-content and max-content
- **stretch**: Makes the element fill its available space (formerly known as `fill` or `fill-available`)

## Specification Status

- **Status**: Working Draft (WD)
- **W3C Specification**: https://www.w3.org/TR/css3-sizing/
- **Category**: CSS3

## Use Cases & Benefits

### Key Benefits

1. **Responsive Layouts**: Content-based sizing creates more flexible layouts that adapt without media queries
2. **Fluid Typography**: Better control over text sizing in responsive designs
3. **Grid Layouts**: Improved control over grid track sizing with content-aware dimensions
4. **Flexbox Integration**: Enhanced flexibility for flex item sizing
5. **Reduced Fixed Dimensions**: Decreases reliance on fixed pixel values for dimensions
6. **Automatic Content Adaptation**: Elements automatically adjust to their content

### Common Use Cases

- **Text Container Sizing**: Setting widths that expand/contract with content
- **Grid Template Sizing**: Creating responsive grid layouts with `grid-template-rows` and `grid-template-columns`
- **Flexible Navigation**: Building navigation components that size based on link text
- **Content Cards**: Creating card layouts that adapt to their content
- **Image Containers**: Sizing image wrappers responsively
- **Button Sizing**: Buttons that size based on label text

## Browser Support

### Support Legend
- `y` - Supported
- `a` - Partial support
- `x` - Prefix required
- `n` - Not supported

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **Chrome** | 22 | Full (v94+) | Requires prefix (-webkit-) until v46; `stretch` not yet unprefixed (Chrome v46+) |
| **Edge** | 79 | Full | Limited support until v94; notes apply (v79-93) |
| **Firefox** | 3 | Partial | Prefixed with `-moz-` or `-webkit-`; limited to width properties, not height |
| **Safari** | 6.1 | Full (v16.0+) | Partial support with notes until v16.0; now fully supported |
| **Opera** | 15 | Full (v95+) | Prefixed support from v15-32; notes apply from v33-94 |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **iOS Safari** | 7.0-7.1 | Full (v16.0+) | Partial prefixed support until v16.0 |
| **Android** | 4.4 | Full (v142+) | Prefixed support; latest versions fully supported |
| **Samsung Internet** | 4.0 | Full (v17.0+) | Prefixed support until v17.0 |
| **Opera Mini** | all | Not Supported | Never supported |
| **Opera Mobile** | 80 | Partial (v80+) | Recent versions supported with notes |
| **Firefox Android** | 144 | Partial | Limited to width properties |
| **UC Browser** | 15.5 | Partial | Supported with limitations |

### Legacy Browser Support

- **Internet Explorer**: Not supported (all versions 5.5-11)
- **IE Mobile**: Not supported (v10-11)
- **Blackberry**: Supported from v10 with prefix

## Implementation Guidelines

### Property Syntax

```css
/* Width properties */
width: max-content;
width: min-content;
width: fit-content;
width: stretch;

/* Height properties */
height: max-content;
height: min-content;
height: fit-content;
height: stretch;

/* With prefixes (for older browsers) */
width: -webkit-max-content;
width: -webkit-min-content;
width: -webkit-fit-content;
width: -webkit-fill-available; /* or -webkit-stretch */
```

### Prefixed Values

For broader browser compatibility, use prefixed versions:
- `-webkit-max-content`
- `-webkit-min-content`
- `-webkit-fit-content`
- `-webkit-fill-available` (or `-webkit-stretch`)
- `-moz-max-content`
- `-moz-min-content`
- `-moz-fit-content`
- `-moz-available` (Firefox's version of stretch)

### Best Practices

1. **Always use prefixes** for production code targeting broader browser support
2. **Test in target browsers** as support varies significantly
3. **Combine with fallbacks** for unsupported browsers
4. **Note flexbox limitations** - These properties don't work with `flex-basis` in many browsers

## Known Issues & Limitations

### Critical Limitations

1. **Flexbox Support**: Does not work with the `flex-basis` property in most browsers. See [Chromium bug #240765](https://bugs.chromium.org/p/chromium/issues/detail?id=240765)

2. **Firefox Height Support**: Firefox does not support `height`, `min-height`, or `max-height` properties - only `width`. [Firefox bug #567039](https://bugzilla.mozilla.org/show_bug.cgi?id=567039)

3. **Stretch Not Unprefixed**: Chrome does not yet unprefix `stretch` (also known as `fill` or `fill-available`). [Chromium bug #611857](https://bugs.chromium.org/p/chromium/issues/detail?id=611857)

4. **Safari Grid Limitation**: Safari does not support usage with CSS Grid Layout properties such as `grid-template-rows` and `grid-template-columns`

5. **Firefox Stretch Alternative**: Firefox supports `-moz-available` keyword rather than `stretch`. [Firefox bug #1495868](https://bugzilla.mozilla.org/show_bug.cgi?id=1495868)

### Browser-Specific Notes

- **Firefox (3-65)**: Limited to width properties only, requires `-webkit-` or `-moz-` prefix
- **Firefox (66+)**: Added support for `-moz-fit-content` and `-moz-available`, but still limited to width
- **Chrome (22-45)**: Requires `-webkit-` prefix
- **Chrome (46+)**: `max-content`, `min-content`, and `fit-content` supported; `stretch` still requires `-webkit-` prefix
- **Unofficial Values**: Older WebKit browsers support the unofficial `intrinsic` value which acts the same as `max-content`

## Browser Compatibility Summary

**Global Support**: 90.15% of users have full support (`y`), 3.11% have partial support (`a`)

### Supported in Most Modern Browsers
- Chrome 46+
- Edge 79+
- Safari 16+
- Firefox 3+ (limited)
- Opera 15+ (limited)

### Not Supported
- Internet Explorer (all versions)
- Opera Mini
- Very old mobile browsers

## Related Links

- **W3C CSS Sizing Module Level 3**: https://www.w3.org/TR/css3-sizing/
- **Tutorial**: [Design From the Inside Out With CSS Min-Content](https://thenewcode.com/662/Design-From-the-Inside-Out-With-CSS-Min-Content)
- **MDN Web Docs**: CSS Sizing keywords and width/height properties
- **Can I Use Reference**: Full compatibility data and test cases

## Keywords

`fill`, `fill-available`, `max-content`, `min-content`, `fit-content`, `contain-floats`, `intrinsic`, `extrinsic`, `sizing`

## Additional Resources

### Test Cases
- [Codepen: Intrinsic Width Test](https://codepen.io/shshaw/pen/Kiwaz)
- [CSS Sizing Specification Tests](https://www.w3.org/TR/2015/WD-css-flexbox-1-20150514/#flex-basis-property)

### Bug Tracking
- Chromium Issue Tracker: https://bugs.chromium.org/p/chromium/
- Firefox Bugzilla: https://bugzilla.mozilla.org/
- WebKit Bugs: https://bugs.webkit.org/

## Implementation Recommendations

### For Maximum Compatibility
```css
.responsive-container {
  width: fit-content;
  width: -webkit-fit-content;
  width: -moz-fit-content;

  height: max-content;
  height: -webkit-max-content;
  height: -moz-max-content;
}
```

### For Modern Browsers Only
```css
.modern-layout {
  width: fit-content;
  height: max-content;
}
```

### Fallback Pattern
```css
.flexible-width {
  width: 100%; /* fallback for unsupported browsers */
  width: fit-content;
}
```

---

**Last Updated**: December 2024
**Data Source**: Can I Use - Intrinsic & Extrinsic Sizing
**Global Browser Support**: 90.15% full support + 3.11% partial support = 93.26% total
