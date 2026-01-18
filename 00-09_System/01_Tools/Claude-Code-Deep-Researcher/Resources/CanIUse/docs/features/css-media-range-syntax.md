# Media Queries: Range Syntax

## Overview

The **CSS Media Range Syntax** provides a modern, less verbose way to write media queries for range-type features such as width, height, and other dimensional properties. Instead of using verbose `min-width` and `max-width` properties, developers can now use mathematical comparison operators (`<`, `>`, `<=`, `>=`) in media query expressions.

### What It Is

Media range syntax is a syntax improvement in CSS Media Queries Level 4 that allows developers to use comparison operators directly in media queries, making them more readable and concise.

### Quick Example

```css
/* Old syntax */
@media (min-width: 100px) and (max-width: 1900px) {
  /* styles */
}

/* New range syntax */
@media (100px <= width <= 1900px) {
  /* styles */
}
```

Both queries are equivalent, but the second uses range syntax for greater clarity.

---

## Specification & Status

| Property | Value |
|----------|-------|
| **Specification** | [CSS Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/#mq-range-context) |
| **Status** | Candidate Recommendation (CR) |
| **W3C URL** | https://www.w3.org/TR/mediaqueries-4/#mq-range-context |

---

## Categories

- **CSS** - Cascading Style Sheets

---

## Benefits & Use Cases

### Reduced Verbosity
Range syntax eliminates the need to repeat the property name and `and` operators, making media queries shorter and more readable.

**Example: Responsive Typography**
```css
/* Using range syntax */
@media (20em <= width <= 40em) {
  body { font-size: 14px; }
}

@media (40em < width <= 64em) {
  body { font-size: 16px; }
}

@media (width > 64em) {
  body { font-size: 18px; }
}
```

### Improved Readability
The mathematical operators make the intent clear at a glance - you can see the range constraints immediately without parsing `min-` and `max-` prefixes.

### Complex Range Queries
Range syntax excels when combining multiple range constraints:

```css
/* Easier to read with range syntax */
@media (400px <= width <= 800px) and (200px <= height <= 600px) {
  /* tablet-like dimensions */
}
```

### Supported Range Features
Range syntax works with any CSS media feature that accepts a range of values:
- `width` / `height`
- `aspect-ratio`
- `color-gamut`
- `device-width` / `device-height` (deprecated)
- `resolution`
- And other dimensional features

### Common Use Cases
1. **Responsive Design Breakpoints** - Define layouts for mobile, tablet, and desktop
2. **Device-Specific Styling** - Target specific device characteristics
3. **Accessibility Features** - Query reduced motion, color schemes, contrast preferences
4. **Performance Optimization** - Serve different resources based on device capabilities

---

## Browser Support

### Summary

| Browser | First Supported Version | Global Usage |
|---------|------------------------|--------------|
| **Chrome** | 104+ | 90.67% |
| **Edge** | 104+ | 90.67% |
| **Firefox** | 63+ | 90.67% |
| **Safari** | 16.4+ | 90.67% |
| **Opera** | 91+ | 90.67% |
| **iOS Safari** | 16.4+ | 90.67% |
| **Android** | 142+ | 90.67% |
| **Samsung** | 20+ | 90.67% |

### Detailed Browser Support

#### Desktop Browsers

**Chrome / Chromium-Based**
- **Full Support From**: Chrome 104 (September 2022)
- **Subsequent Versions**: All versions from 105 onwards support range syntax
- **Current Status**: Fully supported

**Firefox**
- **Full Support From**: Firefox 63 (October 2018)
- **Subsequent Versions**: All versions from 64 onwards support range syntax
- **Current Status**: Fully supported
- **Note**: Firefox was an early adopter of this feature

**Safari**
- **Full Support From**: Safari 16.4 (March 2023)
- **Subsequent Versions**: All versions from 16.5 onwards support range syntax
- **Current Status**: Fully supported

**Opera**
- **Full Support From**: Opera 91 (May 2023)
- **Subsequent Versions**: All versions from 92 onwards support range syntax
- **Current Status**: Fully supported

**Edge**
- **Full Support From**: Edge 104 (September 2022)
- **Subsequent Versions**: All versions from 105 onwards support range syntax
- **Current Status**: Fully supported

#### Mobile Browsers

**iOS Safari**
- **Full Support From**: iOS 16.4 (May 2023)
- **Subsequent Versions**: All versions from 16.5 onwards support range syntax
- **Current Status**: Fully supported

**Android Chrome**
- **Full Support From**: Android 142
- **Current Status**: Fully supported

**Android Firefox**
- **Full Support From**: Android Firefox 144
- **Current Status**: Fully supported

**Samsung Internet**
- **Full Support From**: Samsung 20 (2023)
- **Subsequent Versions**: All versions from 21 onwards support range syntax
- **Current Status**: Fully supported

**Opera Mini**
- **Support Status**: Not supported (all versions)
- **Reason**: Opera Mini doesn't support modern CSS features

#### No Support

- **Internet Explorer** (all versions) - Unsupported
- **Legacy Edge** (versions 12-103) - Unsupported
- **Older Chrome** (versions 4-103) - Unsupported
- **Older Firefox** (versions 2-62) - Unsupported
- **Older Safari** (versions 3.1-16.3) - Unsupported
- **BlackBerry Browser** - Unsupported

### Support Timeline

- **2018**: Firefox 63 implements range syntax (early adoption)
- **2022**: Chrome 104 and Edge 104 add support (September)
- **2023**: Safari 16.4 and iOS Safari 16.4 add support (March)
- **2023**: Opera 91 adds support (May)
- **Current**: 90.67% global coverage with widespread browser support

---

## Syntax Examples

### Basic Range Syntax

```css
/* Greater than or equal to */
@media (width >= 768px) {
  /* tablet and up */
}

/* Less than or equal to */
@media (width <= 1200px) {
  /* up to desktop */
}

/* Greater than */
@media (width > 768px) {
  /* wider than tablet */
}

/* Less than */
@media (width < 768px) {
  /* smaller than tablet */
}
```

### Range Constraints

```css
/* Combined range */
@media (400px <= width <= 800px) {
  /* between 400px and 800px */
}

/* Equivalent to old syntax: */
@media (min-width: 400px) and (max-width: 800px) {
  /* same thing */
}
```

### Multiple Conditions

```css
/* Multiple ranges */
@media (width >= 768px) and (height >= 600px) {
  /* tablet or larger with sufficient height */
}

/* Combining with other features */
@media (width > 1024px) and (color-gamut: p3) {
  /* wide screen with wide color gamut */
}
```

### Advanced Examples

```css
/* Aspect ratio range */
@media (1 <= aspect-ratio <= 2) {
  /* square to 2:1 aspect ratio */
}

/* High resolution displays */
@media (resolution >= 2dppx) {
  /* retina or higher density */
}

/* Complex responsive layout */
@media (width < 768px) {
  /* mobile */
  body { padding: 1rem; }
}

@media (768px <= width < 1024px) {
  /* tablet */
  body { padding: 2rem; }
}

@media (width >= 1024px) {
  /* desktop */
  body { padding: 3rem; }
}
```

---

## Known Issues & Notes

### No Known Bugs
As of the latest data, there are no reported critical bugs or issues with media range syntax implementation in supported browsers.

### Compatibility Considerations

**When to Use Progressive Enhancement**
If you need to support older browsers (IE, Safari < 16.4, older Chrome), consider using a polyfill or fallback approach:

```css
/* Fallback for older browsers */
@media (min-width: 768px) and (max-width: 1024px) {
  /* fallback syntax */
}

/* Modern browsers will use this if supported */
@media (768px <= width <= 1024px) {
  /* range syntax */
}
```

**Note**: Browsers that don't support range syntax will simply ignore the media query and not apply the styles. This is safe behavior - not a breaking change.

---

## Migration Guide

### From Legacy Syntax to Range Syntax

| Legacy Syntax | Range Syntax | Notes |
|---------------|--------------|-------|
| `(min-width: 768px)` | `(width >= 768px)` | Greater than or equal |
| `(max-width: 1024px)` | `(width <= 1024px)` | Less than or equal |
| `(min-width: 768px) and (max-width: 1024px)` | `(768px <= width <= 1024px)` | Combined range |
| `(min-height: 600px)` | `(height >= 600px)` | Works with any range feature |

### Best Practices

1. **Use Range Syntax for New Projects** - Modern and more readable
2. **Support Fallbacks for Broad Compatibility** - Useful if targeting older browsers
3. **Combine with Other Operators** - Range syntax works well with `and`, `or`, `not`
4. **Consistent Formatting** - Maintain consistent operator placement for readability

---

## Related Features & Links

### Official Documentation
- [MDN: Using Media Queries - Syntax Improvements in Level 4](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
- [W3C CSS Media Queries Level 4 Specification](https://www.w3.org/TR/mediaqueries-4/#mq-range-context)

### Browser Implementation & Tracking
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1422225#c55)
- [WebKit/Safari Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=180234)

### Articles & Guides
- [Bram.us: Media Queries Level 4: Media Query Range Contexts](https://www.bram.us/2021/10/26/media-queries-level-4-media-query-range-contexts/)
- [Chrome Blog: New Syntax for Range Media Queries in Chrome 104](https://developer.chrome.com/blog/media-query-range-syntax/)

### Tooling & Polyfills
- [PostCSS Polyfill: postcss-media-minmax](https://github.com/postcss/postcss-media-minmax) - Transpile range syntax for older browsers

### Related CSS Features
- [CSS Media Queries](https://www.w3.org/TR/mediaqueries-4/)
- [CSS Media Feature Examples](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)
- [Responsive Web Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

## Feature Status

| Metric | Value |
|--------|-------|
| **Global Usage** | 90.67% |
| **Spec Status** | Candidate Recommendation |
| **Major Browser Support** | Yes (all modern browsers) |
| **Mobile Support** | Yes (iOS 16.4+, Android 142+) |
| **Polyfill Available** | Yes (PostCSS) |

---

## Quick Checklist

- [x] Modern browser support (Chrome 104+, Firefox 63+, Safari 16.4+)
- [x] High global usage (90.67%)
- [x] Works across desktop and mobile
- [x] Backwards compatible (ignores unsupported syntax gracefully)
- [x] Polyfill available for older browsers
- [x] Well-documented and standardized
- [x] No known critical bugs

**Recommendation**: Safe to use in modern web applications. For broader browser support, use progressive enhancement with fallback syntax.
