# CSS Repeating Gradients

## Overview

CSS Repeating Gradients provide a method of defining repeating linear or radial color gradients as CSS images. This feature allows developers to create tiled gradient patterns without requiring additional image files or repeated color stop definitions.

## Description

Repeating gradients automatically tile the gradient pattern to fill the entire background area. This is particularly useful for creating diagonal stripe patterns, checkerboard effects, and other repeating visual patterns using pure CSS.

### Key Features

- **Repeating Linear Gradients** (`repeating-linear-gradient`): Creates a linear gradient that repeats along a specified direction
- **Repeating Radial Gradients** (`repeating-radial-gradient`): Creates a radial gradient that repeats outward from a center point
- **Modern Syntax Support**: Modern browsers support the "to (side)" syntax for easier angle specification
- **No Image Dependencies**: Eliminates the need for background images, reducing file size and improving performance

## Specification

**W3C Status**: Candidate Recommendation (CR)

**Official Specification**: [W3C CSS Images Module Level 3 - Repeating Gradients](https://www.w3.org/TR/css3-images/#repeating-gradients)

## Categories

- CSS3

## Use Cases & Benefits

### Common Applications

1. **Background Patterns**
   - Diagonal stripe patterns
   - Checkerboard backgrounds
   - Repeating geometric designs
   - Decorative elements

2. **Visual Enhancements**
   - Progress indicators
   - Loading animations
   - Status displays
   - Visual separators

3. **Performance Optimization**
   - Replacement for background images
   - Reduced HTTP requests
   - Smaller overall page size
   - Scalable without quality loss

4. **Design Flexibility**
   - Easy color adjustments
   - Responsive scaling
   - Dynamic pattern generation
   - No pixel density concerns

## Browser Support

### Support Legend
- **y**: Full support
- **y x**: Support with vendor prefix (deprecated)
- **a**: Partial support
- **a x**: Partial support with vendor prefix
- **n**: No support

### Desktop Browsers

| Browser | First Support | Latest Status | Notes |
|---------|---------------|---------------|-------|
| **Internet Explorer** | 10 | 11 ✓ | Added in IE 10 |
| **Edge** | 12 | Latest ✓ | Full support since initial release |
| **Firefox** | 3.6 ⚠️ | Latest ✓ | Vendor prefix required until v16 |
| **Chrome** | 10 ⚠️ | Latest ✓ | Vendor prefix required until v26 |
| **Safari** | 5.1 ⚠️ | Latest ✓ | Vendor prefix required until v6.1 |
| **Opera** | 11.6 ⚠️ | Latest ✓ | Limited support v11.1-11.5, vendor prefix until v12.1 |

### Mobile Browsers

| Browser | First Support | Latest Status | Notes |
|---------|---------------|---------------|-------|
| **iOS Safari** | 5.0 ⚠️ | Latest ✓ | Vendor prefix required until v6.1 |
| **Android** | 4.0 ⚠️ | Latest ✓ | Vendor prefix required until v4.4 |
| **Chrome for Android** | Latest | 142 ✓ | Full support |
| **Firefox for Android** | Latest | 144 ✓ | Full support |
| **Opera Mini** | All | n | No support |
| **Samsung Internet** | 4.0 | Latest ✓ | Full support |
| **UC Browser** | 15.5+ | ✓ | Full support |
| **BlackBerry** | 10+ | ✓ | Full support |
| **KaiOS** | 2.5+ | ✓ | Full support |

### Support Summary

- **Global Usage**: 93.6% of users have support
- **Full Support**: All modern browsers (Chrome 26+, Firefox 16+, Safari 6.1+, Edge 12+)
- **Partial Support**: IE 10, older versions with vendor prefixes
- **No Support**: IE 9 and earlier, Opera Mini

## Implementation Notes

### Syntax

```css
/* Repeating Linear Gradient */
background: repeating-linear-gradient(
  45deg,
  red,
  red 10px,
  yellow 10px,
  yellow 20px
);

/* Repeating Radial Gradient */
background: repeating-radial-gradient(
  circle,
  red,
  red 10px,
  yellow 10px,
  yellow 20px
);

/* Modern "to" Syntax (Firefox 10+, Chrome 26+, Opera 11.6+) */
background: repeating-linear-gradient(
  to right,
  red,
  blue
);
```

### Vendor Prefix Requirements

For maximum compatibility with older browsers, include vendor prefixes:

```css
background: -webkit-repeating-linear-gradient(45deg, red, red 10px, yellow 10px, yellow 20px);
background: -moz-repeating-linear-gradient(45deg, red, red 10px, yellow 10px, yellow 20px);
background: repeating-linear-gradient(45deg, red, red 10px, yellow 10px, yellow 20px);
```

### Browser Compatibility Notes

1. **Firefox 3.6-15**: Vendor prefix (`-moz-`) required
2. **Chrome 10-25**: Vendor prefix (`-webkit-`) required
3. **Safari 5.1-6**: Vendor prefix (`-webkit-`) required
4. **Opera 11-12**: Vendor prefix (`-webkit-` or `-o-`) required; partial support in 11.1 and 11.5
5. **Modern Syntax**: The `to (side)` syntax is fully supported in:
   - Firefox 10+
   - Chrome 26+
   - Opera 11.6+

### Known Issues

- **Opera 11.1 and 11.5**: Partial support - only linear gradients are supported, radial gradients are not available
- **Older Mobile Browsers**: Early versions (iOS Safari 5.0-5.1, Android 4.0-4.3) require vendor prefixes

## Performance Considerations

- **No Image Files**: Eliminates additional HTTP requests compared to using background images
- **Scalability**: Gradients scale perfectly to any resolution without quality degradation
- **File Size**: CSS-based gradients are typically smaller than equivalent images
- **Rendering**: Hardware acceleration support in modern browsers for smooth rendering

## Examples

### Diagonal Stripes

```css
.striped {
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
}
```

### Checkerboard Pattern

```css
.checkerboard {
  background:
    repeating-conic-gradient(#25252a 0% 25%, transparent 0% 50%) 50% / 60px 60px;
}
```

### Animated Loading Bar

```css
.loader {
  background: repeating-linear-gradient(
    90deg,
    #fff,
    #fff 10px,
    #e6e6e6 10px,
    #e6e6e6 20px
  );
  background-size: 200% 100%;
  animation: loading 2s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## Resources & References

### Official Documentation

- [MDN Web Docs - CSS repeating-linear-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-linear-gradient)
- [MDN Web Docs - CSS repeating-radial-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-radial-gradient)
- [W3C CSS Images Module Level 3](https://www.w3.org/TR/css3-images/)

### Related Features

- [CSS Gradients (Linear & Radial)](./css-gradients.md)
- [CSS Background Images](./css-backgrounds.md)
- [CSS Conic Gradients](./css-conic-gradients.md)

## Browser Testing

When implementing repeating gradients, test across:

1. **Desktop Browsers**: Chrome, Firefox, Safari, Edge
2. **Mobile Browsers**: iOS Safari, Android Chrome, Samsung Internet
3. **Older Browsers**: IE 10-11 (if supporting legacy systems)
4. **Vendor Prefixes**: Apply when targeting browsers older than:
   - Chrome 26, Firefox 16, Safari 6.1, Opera 12.1

## Conclusion

CSS Repeating Gradients are a mature, well-supported web platform feature with excellent browser compatibility (93.6% global support). They provide an efficient, scalable alternative to background images for creating tiled gradient patterns, making them essential for modern web design and development.

For optimal user experience and maximum compatibility, use the standard syntax with appropriate fallbacks for older browsers or include vendor prefixes when necessary.

---

*Last Updated: 2024*
*Specification Status: Candidate Recommendation (CR)*
*Global Support: 93.6%*
