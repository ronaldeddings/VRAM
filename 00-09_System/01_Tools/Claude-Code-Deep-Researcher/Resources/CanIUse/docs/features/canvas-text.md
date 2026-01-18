# Text API for Canvas

## Overview

The Canvas Text API provides a method of displaying text on HTML Canvas elements. This feature allows developers to render text directly onto canvas elements using the `CanvasRenderingContext2D` interface, enabling dynamic text rendering in games, visualizations, and graphics applications.

**Specification Status:** Living Standard (LS)
**Global Usage:** 93.65% of global browser usage

---

## Specification

- **Official Specification:** [HTML Living Standard - Drawing Text to the Bitmap](https://html.spec.whatwg.org/multipage/scripting.html#drawing-text-to-the-bitmap)
- **Latest Update:** WHATWG HTML Standard

---

## Categories

- Canvas
- HTML5

---

## Overview & Description

The Canvas Text API allows developers to render text onto Canvas elements using the `CanvasRenderingContext2D` interface. This capability is fundamental for creating graphics-rich web applications that need to display text as part of canvas-based visualizations.

### Key Capabilities

The Canvas Text API provides several methods for text rendering:

- **`fillText(text, x, y [, maxWidth])`** - Renders filled text at specified coordinates
- **`strokeText(text, x, y [, maxWidth])`** - Renders outlined text at specified coordinates
- **`measureText(text)`** - Measures the width of text without rendering it

### Text Styling Properties

- `font` - Sets the font family, size, style, and weight
- `fillStyle` - Sets the color/style for filled text
- `strokeStyle` - Sets the color/style for outlined text
- `textAlign` - Horizontal alignment (start, end, left, right, center)
- `textBaseline` - Vertical alignment (top, hanging, middle, alphabetic, ideographic, bottom)
- `direction` - Text directionality (ltr, rtl, inherit)

---

## Benefits & Use Cases

### Primary Benefits

1. **Dynamic Text Rendering** - Generate and display text programmatically without pre-rendering
2. **Performance** - Render text as part of canvas graphics for better performance than DOM-based text
3. **Styling Flexibility** - Apply canvas-based styling with precise control over positioning and appearance
4. **Graphics Integration** - Seamlessly integrate text with canvas drawings, shapes, and images
5. **Custom Typography** - Create unique text effects and animations using canvas drawing capabilities

### Common Use Cases

- **Data Visualizations** - Add labels, titles, and legends to charts and graphs
- **Games** - Display scores, names, health bars, and UI elements over game graphics
- **Animations** - Create animated text effects and transitions
- **Real-time Applications** - Dynamic text rendering for live data displays
- **Image Editors** - Add text overlays to images and graphics
- **Custom Fonts** - Render text with custom styling and transformations
- **Dashboard Applications** - Create interactive dashboards with canvas-based visualizations

---

## Browser Support

### Support Key

| Status | Meaning |
|--------|---------|
| ✅ **Full** (y) | Fully supported |
| ⚠️ **Partial** (p) | Partial support |
| ❌ **No** (n) | Not supported |

### Desktop Browsers

| Browser | First Full Support | Latest Version | Status |
|---------|-------------------|-----------------|--------|
| **Chrome** | 4 | 146+ | ✅ Full |
| **Edge** | 12 | 143+ | ✅ Full |
| **Firefox** | 3.5 | 148+ | ✅ Full |
| **Safari** | 4 | 18.5+ | ✅ Full |
| **Opera** | 10.5 | 122+ | ✅ Full |
| **Internet Explorer** | 9 | 11 | ✅ Full |

### Mobile Browsers

| Browser | First Full Support | Latest Version | Status |
|---------|-------------------|-----------------|--------|
| **iOS Safari** | 3.2 | 26.1+ | ✅ Full |
| **Android Browser** | 2.1 | 142+ | ✅ Full |
| **Chrome Mobile** | 4 | 142+ | ✅ Full |
| **Firefox Mobile** | 4 | 144+ | ✅ Full |
| **Samsung Internet** | 4 | 29+ | ✅ Full |
| **Opera Mobile** | 11 | 80+ | ✅ Full |
| **UC Browser** | 15.5 | 15.5+ | ✅ Full |
| **Opera Mini** | - | - | ❌ No |

### Internet Explorer Support

- **IE 5.5 - 8:** ❌ Not supported / ⚠️ Partial support
- **IE 9 - 11:** ✅ Full support

### Legacy Browsers

- **Blackberry:** Supported (versions 7 and 10)
- **KaiOS:** Supported (versions 2.5+)
- **Baidu Browser:** Supported (version 13.52+)
- **QQ Browser:** Supported (version 14.9+)

---

## Key Implementation Notes

### Basic Usage

```javascript
// Get canvas context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set text properties
ctx.font = '30px Arial';
ctx.fillStyle = '#000000';

// Draw filled text
ctx.fillText('Hello Canvas', 10, 50);

// Draw outlined text
ctx.strokeStyle = '#FF0000';
ctx.strokeText('Outlined Text', 10, 100);

// Measure text width
const metrics = ctx.measureText('Sample');
console.log(metrics.width);
```

### Text Alignment

```javascript
// Set text alignment
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Draw text with alignment
ctx.fillText('Centered Text', canvas.width / 2, canvas.height / 2);
```

### Max Width Constraint

```javascript
// Draw text with maximum width constraint
ctx.fillText('Long text that might be constrained', 10, 50, 200);
```

---

## Known Limitations

### Text Rendering Differences

- Text rendering varies slightly between browsers due to different font rendering engines
- Anti-aliasing and kerning may differ across platforms
- Some advanced typography features may not be available

### Performance Considerations

- Rendering large amounts of text on canvas can impact performance
- Consider caching rendered text as images for frequently redrawn content
- Text rendering is resolution-dependent (retina displays require scaling adjustments)

### Accessibility Notes

- Canvas text is not directly accessible to screen readers
- Use ARIA attributes on the canvas element to provide context
- Consider providing alternative text content for important information

---

## Related Features

### Related Canvas APIs

- [Canvas Element](https://html.spec.whatwg.org/multipage/canvas.html) - The foundation for all canvas graphics
- [Canvas 2D Context](https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element) - Core API for 2D graphics
- [Canvas Drawing Paths](https://html.spec.whatwg.org/multipage/canvas.html#drawing-paths) - Drawing shapes and lines
- [Canvas Images](https://html.spec.whatwg.org/multipage/canvas.html#drawing-images-to-the-canvas) - Working with images on canvas

### Complementary Technologies

- **WebGL** - For 3D graphics with advanced text rendering
- **SVG** - Alternative for scalable vector text
- **DOM Text** - For accessible, semantic text content

---

## Related Resources

### Official Documentation

- [Mozilla Developer Network - Canvas Text API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text)
- [WebPlatform Docs - CanvasRenderingContext2D.fillText](https://webplatform.github.io/docs/apis/canvas/CanvasRenderingContext2D/fillText)
- [HTML Living Standard Specification](https://html.spec.whatwg.org/multipage/scripting.html#drawing-text-to-the-bitmap)

### Tools & Libraries

- [Support Library](https://code.google.com/archive/p/canvas-text/) - Cross-browser canvas text support
- [has.js Test - Canvas Text Detection](https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#canvas-text)

### Learning Resources

- MDN Web Docs - Canvas API Tutorial
- WHATWG HTML Standard Documentation
- Browser Compatibility Resources

---

## Migration & Compatibility Notes

### No Breaking Changes

Canvas Text API has maintained stable support since its initial implementation. No migration or compatibility issues are expected.

### Polyfills

For older browsers (particularly IE 6-8), the Google Canvas Text support library provides additional functionality.

### Progressive Enhancement

Canvas text applications should gracefully degrade on unsupported browsers by:
- Providing fallback HTML content
- Using feature detection
- Implementing canvas capability checks

---

## Global Browser Coverage

Based on current usage statistics:

- **Coverage:** 93.65% of global browser usage
- **No Support:** Only Opera Mini lacks canvas text support
- **Universal Adoption:** Available across all major modern browsers and mobile platforms

This feature is considered safe to use in production for modern web applications with minimal legacy browser concerns.
