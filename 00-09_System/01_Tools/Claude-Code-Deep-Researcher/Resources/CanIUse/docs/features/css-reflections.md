# CSS Reflections

## Overview

CSS Reflections provide a method of displaying a reflection of an element directly through CSS. This feature creates mirror-like duplicates of elements, typically positioned below, above, or beside the original element.

## Description

CSS Reflections allow developers to create visual reflection effects on HTML elements using the `-webkit-box-reflect` CSS property. This feature is particularly useful for creating modern, polished user interfaces with minimal JavaScript overhead. The reflection automatically mirrors and fades the duplicated element, providing a professional visual effect commonly seen in Apple's UI designs.

## Specification Status

**Status:** Unofficial (Webkit Extension)
**Specification:** [WebKit Blog Post - CSS Reflections](https://webkit.org/blog/182/css-reflections/)

This feature is a WebKit extension and is not part of the official W3C CSS specifications. It remains a vendor-specific implementation but is widely supported across modern browsers due to WebKit's influence.

## Categories

- **CSS** - Styling and visual effects

## Benefits & Use Cases

### Visual Enhancement
- Create professional mirror effects without additional HTML elements
- Enhance product showcases and portfolio displays
- Add depth and sophistication to UI components

### Performance Benefits
- Reduces DOM complexity compared to image-based reflection solutions
- CSS-based solution provides better performance than JavaScript alternatives
- Hardware acceleration support on modern browsers

### Design Flexibility
- Easily adjustable reflection size and offset
- Smooth fade effects on reflected elements
- Works with any HTML element (images, text, containers, etc.)

### Practical Applications
- **Product Photography:** Mirror reflections below product images
- **Album Covers:** CD/Album cover reflections in music applications
- **Gallery Effects:** Professional image gallery displays
- **Logo Showcases:** Brand logo displays with reflective effects
- **Card Layouts:** Elevated card components with reflection shadows

## Browser Support

| Browser | Supported | Version | Notes |
|---------|-----------|---------|-------|
| **Chrome** | Yes | 4+ | Prefix required (`-webkit-`) |
| **Safari** | Yes | 4+ | Prefix required (`-webkit-`) |
| **Firefox** | No | — | No support; use `-moz-element()` as alternative |
| **Edge** | Yes* | 79+ | Prefix required (`-webkit-`); partial support |
| **Opera** | Yes | 15+ | Prefix required (`-webkit-`) |
| **IE** | No | — | Not supported in any version |
| **iOS Safari** | Yes | 3.2+ | Prefix required (`-webkit-`) |
| **Android Chrome** | Yes | 2.1+ | Prefix required (`-webkit-`) |
| **Samsung Internet** | Yes | 4+ | Prefix required (`-webkit-`) |

### Mobile Browser Support
- **iOS Safari:** Full support (3.2+)
- **Android Chrome:** Full support (2.1+)
- **Opera Mobile:** Limited support; full support from v80+
- **Android Firefox:** No support (v144)
- **Opera Mini:** No support
- **IE Mobile:** No support

### Key Support Notes
- `y x` indicates support with vendor prefix (`-webkit-`)
- Firefox provides an alternative using `-moz-element()` background property
- Internet Explorer (all versions) does not support this feature
- Edge support begins with Chromium-based Edge (v79+)

## Implementation Examples

### Basic Syntax

```css
.element {
  -webkit-box-reflect: <direction> <offset> <mask-image>;
}
```

### Simple Reflection Below Element

```css
.image {
  -webkit-box-reflect: below 10px;
}
```

### Reflection with Fade Effect

```css
.card {
  -webkit-box-reflect: below 10px linear-gradient(
    to bottom,
    transparent,
    transparent 20%,
    rgba(0, 0, 0, 0.2)
  );
}
```

### Reflection to the Right

```css
.logo {
  -webkit-box-reflect: right 5px;
}
```

### Complex Mask with Gradient

```css
.showcase {
  -webkit-box-reflect: below 15px linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
}
```

## Cross-Browser Compatibility Strategy

### For Maximum Browser Support

Since Firefox does not support CSS Reflections, consider these alternatives:

1. **CSS Reflections for WebKit browsers:**
   ```css
   .element {
     -webkit-box-reflect: below 10px linear-gradient(
       to bottom,
       transparent,
       rgba(0, 0, 0, 0.3)
     );
   }
   ```

2. **Firefox Alternative using -moz-element():**
   ```css
   .firefox-fallback::before {
     content: '';
     display: block;
     background: -moz-element(#element-id) no-repeat;
     background-size: 100% 100%;
     transform: scaleY(-1);
     opacity: 0.5;
   }
   ```

3. **Progressive Enhancement with Feature Detection:**
   ```javascript
   if (CSS.supports('-webkit-box-reflect', 'below')) {
     // CSS Reflections supported
   } else if (CSS.supports('background', '-moz-element(#test)')) {
     // Firefox alternative supported
   }
   ```

## CSS Property Details

### `-webkit-box-reflect`

**Direction Values:**
- `above` - Reflection above the element
- `below` - Reflection below the element (most common)
- `left` - Reflection to the left
- `right` - Reflection to the right

**Offset Parameter:**
- Distance between original and reflected element
- Examples: `0`, `5px`, `10px`, `1rem`

**Mask Image Parameter (Optional):**
- Linear gradient for fade effects
- Image URL for custom mask patterns
- Linear-gradient with color stops for smooth transitions

## Notes & Considerations

### Firefox Workaround
Firefox 4+ users can achieve a similar effect using the `-moz-element()` background property combined with transforms. This requires duplicating the element reference and applying CSS transforms to create the mirror effect, but achieves comparable visual results.

### Performance Implications
- CSS Reflections are hardware-accelerated on supported browsers
- Creates a composite layer which may impact memory usage
- Generally more efficient than JavaScript-based reflection solutions
- Minimal impact on modern devices, but consider on resource-constrained environments

### Accessibility Considerations
- Reflections are purely visual and don't affect DOM structure
- Screen readers won't read the reflection content (it's CSS-generated)
- Doesn't impact keyboard navigation
- Semantic HTML structure remains unaffected

### Best Practices
- Use subtle reflections to maintain visual hierarchy
- Combine with opacity/gradients for natural-looking effects
- Test across target browsers and devices
- Provide fallback styles for unsupported browsers
- Consider performance on lower-end devices

## Related Resources

- [MDN - -webkit-box-reflect Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-box-reflect)
- [WebKit Blog - CSS Reflections](https://webkit.org/blog/182/css-reflections/)
- [Can I Use - CSS Reflections](https://caniuse.com/css-reflections)

## Summary

CSS Reflections via `-webkit-box-reflect` is a widely supported feature across modern browsers, with the exception of Firefox and Internet Explorer. It provides an elegant CSS-only solution for creating reflection effects without additional DOM elements. While non-standard, its broad adoption by WebKit-based browsers (Chrome, Safari, Edge, Opera) makes it a viable option for modern web applications targeting contemporary browser versions.

---

**Last Updated:** 2025-12-13
**Data Source:** Can I Use (CanIUse.com)
**Feature ID:** css-reflections
