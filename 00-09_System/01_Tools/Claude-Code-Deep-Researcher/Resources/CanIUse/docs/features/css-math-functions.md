# CSS Math Functions: `min()`, `max()`, and `clamp()`

## Overview

CSS math functions (`min()`, `max()`, and `clamp()`) provide advanced mathematical expressions in CSS, extending the capabilities of the `calc()` function. These functions enable more responsive and flexible styling without the need for media queries or JavaScript.

**Key Functions:**
- **`min()`** - Returns the smallest value from a list
- **`max()`** - Returns the largest value from a list
- **`clamp()`** - Constrains a value between a minimum and maximum

## Specification Status

| Status | Link |
|--------|------|
| **W3C Working Draft (WD)** | [CSS Values and Units Module Level 4](https://www.w3.org/TR/css-values-4/#math-function) |

The feature is part of the CSS Values and Units Module Level 4 specification, which defines advanced mathematical functions for CSS.

## Categories

- CSS
- Values and Units
- Responsive Design

## Use Cases and Benefits

### Responsive Design Without Media Queries
Create fluid layouts that automatically scale between minimum and maximum values:

```css
/* Responsive font size */
font-size: clamp(1rem, 2.5vw, 2rem);

/* Flexible width */
width: min(100%, 500px);

/* Padding that scales */
padding: max(1rem, 5vw);
```

### Constraint-Based Layouts
Simplify complex layout logic by expressing constraints directly in CSS:

```css
/* Content width: minimum 300px, preferred 80vw, maximum 1200px */
width: clamp(300px, 80vw, 1200px);

/* Responsive image with constraints */
img {
  max-width: min(100%, 800px);
}
```

### Flexible Component Sizing
Design components that gracefully adapt to different container sizes:

```css
/* Button padding that responds to viewport */
padding: clamp(0.5rem, 1vw, 2rem) clamp(1rem, 2vw, 3rem);

/* Grid gap that scales */
gap: clamp(1rem, 3%, 3rem);
```

### Intelligent Value Selection
Use `min()` and `max()` for responsive decisions:

```css
/* Use smaller of viewport width or fixed value */
max-width: min(calc(100vw - 2rem), 1000px);

/* Ensure minimum readability */
line-height: max(1.5, 0.5rem);
```

## Browser Support

### Support Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 79 | ✅ Supported |
| Edge | 79 | ✅ Supported |
| Firefox | 75 | ✅ Supported |
| Safari | 13.1 | ✅ Supported |
| Opera | 66 | ✅ Supported |

### Detailed Browser Support

#### Desktop Browsers

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| **Chrome** | 79+ | Full support for all three functions |
| **Edge** | 79+ | Full support, released with Chromium-based Edge |
| **Firefox** | 75+ | Full support across all versions |
| **Safari** | 13.1+ | Full support; previous versions (11.1-13) had partial support (missing `clamp()`) |
| **Opera** | 66+ | Full support, aligned with Chrome releases |
| **IE 11** | ❌ Not supported | No support in any version |

#### Mobile Browsers

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| **iOS Safari** | 13.4+ | Full support (partial in 11.3-13.0) |
| **Android Chrome** | 142+ | Full support |
| **Android Firefox** | 144+ | Full support |
| **Samsung Internet** | 12.0+ | Full support |
| **Opera Mobile** | 80+ | Full support |
| **Android UC Browser** | 15.5+ | Full support |

#### Legacy/Other Browsers

| Browser | Status |
|---------|--------|
| **Internet Explorer** | ❌ No support (all versions) |
| **Opera Mini** | ❌ No support |
| **BlackBerry** | ❌ No support |
| **IE Mobile** | ❌ No support |

### Global Support Coverage

- **Full Support:** 92.44% of global browser usage
- **Partial Support:** 0.08% of global browser usage
- **No Support:** 7.48% of global browser usage

## Known Issues and Limitations

### Safari Limitation (Resolved)

| Version | Issue |
|---------|-------|
| Safari 11.1 - 13.0 | **Partial Support:** `clamp()` function not supported; only `min()` and `max()` available |
| Safari 13.1+ | **Full Support:** All three functions fully supported |

If you need to support Safari 11.1-13.0, use feature detection and fallbacks for `clamp()`:

```css
/* Fallback approach for older Safari */
.element {
  /* Fallback for Safari < 13.1 */
  width: calc(100% - 2rem);

  /* Modern syntax with clamp */
  width: clamp(300px, calc(100% - 2rem), 1000px);
}
```

### iOS Safari Limitation (Resolved)

| Version | Issue |
|---------|--------|
| iOS Safari 11.3 - 13.3 | **Partial Support:** Missing `clamp()` function |
| iOS Safari 13.4+ | **Full Support:** All functions available |

### Prefixes

- **No vendor prefixes required** - These functions use standard CSS without `-webkit-`, `-moz-`, or `-ms-` prefixes

## Browser Support Badges

```
Chrome: ✅ 79+
Firefox: ✅ 75+
Safari: ✅ 13.1+ (partial 11.1-13.0)
Edge: ✅ 79+
Opera: ✅ 66+
IE: ❌ No support
```

## Testing and Examples

### Live Test Case
- [JSFiddle Test Case](https://jsfiddle.net/as9t4jek/) - Interactive demonstration of all three functions

### Practical Examples

#### Example 1: Responsive Font Size
```css
h1 {
  /* Minimum 1.5rem, preferred 5vw, maximum 3rem */
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

#### Example 2: Flexible Container
```css
.container {
  /* Width adapts between 300px and 90vw, preferring 80vw */
  width: clamp(300px, 80vw, 1200px);
  margin: 0 auto;
}
```

#### Example 3: Responsive Spacing
```css
.card {
  /* Padding scales with viewport, between 1rem and 3rem */
  padding: clamp(1rem, 5vw, 3rem);
  gap: clamp(0.5rem, 2vw, 1.5rem);
}
```

#### Example 4: Feature Detection with Fallback
```javascript
// Test support
const supportsClamp = CSS.supports('width', 'clamp(1px, 100%, 1px)');

if (supportsClamp) {
  console.log('CSS math functions are supported');
} else {
  console.log('Fallback to media queries required');
}
```

## Resources and Documentation

### Official Documentation
- [MDN: CSS `min()` Function](https://developer.mozilla.org/en-US/docs/Web/CSS/min)
- [MDN: CSS `max()` Function](https://developer.mozilla.org/en-US/docs/Web/CSS/max)
- [MDN: CSS `clamp()` Function](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)

### Tutorials and Guides
- [Getting Started With CSS Math Functions Level 4](https://webdesign.tutsplus.com/tutorials/mathematical-expressions-calc-min-and-max--cms-29735) - Comprehensive guide on Tuts+ Design
- [Introduction to CSS Math Functions](https://stackdiary.com/css-math-functions/) - Modern CSS implementation guide

### Bug Tracking
- [Firefox Support Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=css-min-max)
- [Chrome Support Bug](https://crbug.com/825895)

## Recommendations

### When to Use

✅ **Use CSS math functions when:**
- Designing responsive layouts that need to scale smoothly between breakpoints
- Creating flexible components that adapt to container size
- Implementing constraint-based sizing logic
- Building modern web applications with minimal JavaScript
- You need to support modern browsers (Chrome 79+, Firefox 75+, Safari 13.1+)

### When to Avoid or Provide Fallbacks

⚠️ **Provide fallbacks when:**
- Supporting IE 11 or older browsers
- Supporting Safari versions 11.1-13.0 (for `clamp()` specifically)
- Supporting iOS Safari versions below 13.4
- Working with legacy projects that require broad browser compatibility

### Fallback Strategy

For projects requiring broader support, use the `@supports` rule:

```css
/* Modern syntax */
.element {
  width: clamp(300px, 80vw, 1000px);
}

/* Fallback for older browsers */
@supports not (width: clamp(1px, 1%, 1px)) {
  .element {
    width: 80vw;
    min-width: 300px;
    max-width: 1000px;
  }
}
```

## Summary

CSS math functions (`min()`, `max()`, and `clamp()`) are now widely supported across modern browsers, providing an elegant solution for responsive design without media queries. With 92% global browser coverage and support in all major modern browsers, they should be a standard part of contemporary CSS workflows.

The feature has achieved excellent adoption across Chrome, Firefox, Safari, Edge, and Opera, making it safe for production use in modern web applications targeting contemporary browser versions.
