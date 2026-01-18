# CSS clip-path Property (for HTML)

## Overview

The `clip-path` property defines the visible region of an HTML element using SVG shapes or CSS basic shapes. This powerful CSS feature allows developers to create complex clipping masks without requiring additional SVG or image elements.

**Status:** Candidate Recommendation (CR)
**W3C Specification:** [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/#the-clip-path)

---

## Description

The `clip-path` CSS property restricts which part of an element is visible. You can clip an element using:

- **CSS Basic Shapes**: `circle()`, `ellipse()`, `polygon()`, `inset()`, `rect()`, `xywh()`
- **SVG References**: `url()` syntax to reference SVG shapes (both inline and external)

This enables sophisticated visual effects like custom image masks, complex geometric designs, and creative layout possibilities without extra markup.

---

## Categories

- **CSS3** - Advanced CSS Layout and Masking

---

## Syntax and Use Cases

### Basic Shape Examples

```css
/* Circular clip */
.circle {
  clip-path: circle(50%);
}

/* Elliptical clip */
.ellipse {
  clip-path: ellipse(40% 60%);
}

/* Polygon-based clip (custom shapes) */
.polygon {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

/* Rectangular inset with rounded corners effect */
.inset {
  clip-path: inset(10px 20px 30px 40px);
}

/* SVG URL reference (inline) */
.svg-clip {
  clip-path: url(#myClipPath);
}
```

---

## Benefits and Use Cases

### Visual Design
- Create custom image masks and artistic effects
- Design complex hero sections with non-rectangular shapes
- Build interactive UI elements with clipped backgrounds

### Web Design Patterns
- Diagonal and angled section dividers
- Hexagonal or circular image galleries
- Creative card designs and component layouts
- Animated clip-path transitions for interactive effects

### Performance
- Hardware-accelerated rendering in modern browsers
- Lighter weight alternative to complex SVG filtering
- Eliminates need for image preprocessing or pre-clipped assets

### Accessibility
- Maintains semantic HTML structure
- Works with transparent backgrounds
- Compatible with screen readers (clipping is visual only)

---

## Browser Support

### Support Legend
- **Y** = Fully Supported
- **A** = Partial Support (see notes)
- **N** = Not Supported
- **X** = Prefix Required

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 55+ | Partial | Shapes and inline SVG, but not external SVG shapes |
| **Firefox** | 54+ | Full | Complete support for all features |
| **Safari** | 13.1+ | Partial | Shapes and inline SVG, but not external SVG shapes |
| **Edge** | 79+ | Partial | Shapes and inline SVG, but not external SVG shapes |
| **Opera** | 42+ | Partial | Shapes and inline SVG, but not external SVG shapes |
| **iOS Safari** | 13.0+ | Partial | Shapes and inline SVG, but not external SVG shapes |
| **Android** | 4.4+ | Partial | Shapes and inline SVG, but not external SVG shapes |
| **Firefox Android** | 144+ | Full | Complete support |

### Platform Coverage
- **Modern Browsers**: 91.14% usage with partial/full support
- **Legacy Browsers**: IE, older Edge, and older Safari versions have no support
- **Mobile**: Good coverage on Android and iOS devices from mid-range versions

---

## Known Issues and Notes

### Current Limitations

1. **External SVG Shapes Not Universally Supported**
   - Chrome, Safari, Opera, and Edge do not support `clip-path: url()` referencing shapes in external SVG files
   - Workaround: Use inline SVG references or CSS basic shapes
   - Reference: [Chromium Issue #109212](https://bugs.chromium.org/p/chromium/issues/detail?id=109212), [WebKit Issue #104442](https://bugs.webkit.org/show_bug.cgi?id=104442)

2. **Partial Implementation Details**
   - Chrome/Safari versions 24-54 (Chrome) and 7-12 (Safari) required `-webkit-` prefix
   - Edge 18 had limited support with `-webkit-` prefix
   - Firefox 47-53 only supported `url()` syntax (no basic shapes)

3. **Feature Flags**
   - Firefox required `layout.css.clip-path-shapes.enabled` flag for shape support in older versions
   - Edge required "Enable CSS Clip-Path" flag for basic implementation in v18

### SVG Support Note
> Support refers to the `clip-path` CSS property on HTML elements specifically. Support for `clip-path` in SVG is supported in all browsers with basic SVG support.

---

## Implementation Guidelines

### Recommended Pattern

```css
/* Use basic shapes for broad compatibility */
.clipped-image {
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  transition: clip-path 0.3s ease;
}

.clipped-image:hover {
  clip-path: circle(50%);
}
```

### Fallback Strategy

```css
.hero-section {
  /* Fallback: visible by default */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* Progressive enhancement */
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 100px), 0 100%);
}
```

### Animation Example

```css
@keyframes clipAnimation {
  0% {
    clip-path: circle(0%);
  }
  100% {
    clip-path: circle(50%);
  }
}

.animated-clip {
  animation: clipAnimation 1s ease-out;
}
```

---

## Related Resources

### Official Documentation
- [CSS Masking Module Level 1 - W3C Specification](https://www.w3.org/TR/css-masking-1/#the-clip-path)
- [CSS Tricks - clip-path Property Guide](https://css-tricks.com/almanac/properties/c/clip/)

### Interactive Examples
- [CodePen: Clipping an Image with a Polygon](https://codepen.io/dubrod/details/myNNyW/)
- [Visual Test Cases](https://lab.iamvdo.me/css-svg-masks)

### Related Features
- [CSS Masks](/features/css-masks) - Parent feature providing mask-image and related properties
- [SVG](/features/svg) - Required for external SVG clip-path references
- [CSS Transforms](/features/css-transforms) - Often combined with clip-path for advanced effects

---

## Statistics

- **Usage with Full Support (Y)**: 2.12%
- **Usage with Partial Support (A)**: 91.14%
- **Total Supported Across Browsers**: 93.26%

---

## Vendor Prefixes

Historically required `-webkit-` prefix in:
- Chrome versions 24-54
- Safari versions 7-12
- Opera versions 15-41
- Android browsers 4.4+
- iOS Safari 7.0-12.5

Modern browsers (2019+) no longer require prefixes.

---

## Browser Prefix Usage Note

While the standard `clip-path` property is now widely recognized, older implementations may still be found using `-webkit-clip-path`. Modern build tools and autoprefixers handle this automatically for broad browser compatibility.
