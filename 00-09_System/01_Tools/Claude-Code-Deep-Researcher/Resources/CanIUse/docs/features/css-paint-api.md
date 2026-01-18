# CSS Painting API

## Overview

The **CSS Painting API** is a part of the CSS Houdini specification that allows developers to programmatically generate images used by CSS properties. This powerful API enables custom rendering of backgrounds, borders, and other CSS properties through JavaScript.

## Description

The CSS Painting API allows developers to:
- Create custom paint functions using JavaScript
- Generate dynamic, resolution-independent images at runtime
- Replace background images, border-image, and mask-image with custom paint implementations
- Leverage GPU acceleration for high-performance custom graphics

Instead of relying on static images or canvas elements, developers can write JavaScript paint worklets that CSS can invoke whenever the element needs to be repainted.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification URL**: https://drafts.css-houdini.org/css-paint-api/

## Categories

- CSS
- JS API

## Benefits & Use Cases

### Custom Visual Effects
- Create animated backgrounds without video or canvas
- Implement complex gradients and patterns dynamically
- Build resolution-independent graphics that scale perfectly

### Dynamic Theming
- Generate colors and patterns based on runtime data
- Create theme-aware visual components
- Implement responsive design patterns at the rendering level

### Performance Optimization
- Reduce file size by replacing static images with code
- Enable GPU-accelerated rendering
- Defer expensive rendering calculations until needed

### Interactive Graphics
- Create interactive visualization elements
- Build data-driven graphics that respond to state changes
- Implement advanced SVG-like effects in CSS

### Examples
- Dynamic gradient backgrounds that respond to user input
- Procedurally generated patterns
- Animated visual effects without JavaScript animation loops
- Custom styling for complex UI components

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | 65+ | Full support from v65 onwards |
| **Edge** | 79+ | Full support from v79 onwards (Chromium-based) |
| **Firefox** | ❌ No | Not supported (considered for future implementation) |
| **Safari** | ⚠️ Experimental | Supported with Developer > Experimental Features enabled (12.1+) |
| **Opera** | 52+ | Full support from v52 onwards (Chromium-based) |
| **iOS Safari** | ❌ No | Not supported on any version |
| **Android Chrome** | 142+ | Full support from v142 onwards |
| **Samsung Internet** | 9.2+ | Full support from v9.2 onwards |
| **Opera Mobile** | 80+ | Full support from v80 onwards |
| **UC Browser** | 15.5+ | Supported from v15.5 onwards |
| **Android UC Browser** | 15.5+ | Supported from v15.5 onwards |
| **Baidu Browser** | 13.52+ | Supported from v13.52 onwards |
| **QQ Browser** | 14.9+ | Supported from v14.9 onwards |

### Browser Support Summary

**Full Support**: Chrome 65+, Edge 79+, Opera 52+, and Chromium-based browsers

**Experimental Support**: Safari 12.1+ (requires enabling in Experimental Features)

**No Support**: Firefox, iOS Safari, Opera Mini, Blackberry

**Global Usage**: Approximately 80.17% of users have browsers that support CSS Painting API

## Implementation Notes

### Key Points

1. **Paint Worklets**: CSS Painting API uses "paint worklets" - JavaScript code that runs in a separate context and can be invoked by CSS

2. **Context7 API**: Paint worklets receive a 2D context similar to HTML5 Canvas, allowing familiar drawing operations

3. **Input Properties**: Paint worklets can read custom CSS properties (CSS variables) as input parameters

4. **Performance**: Paintings are automatically cached and only re-rendered when necessary

5. **Experimental Feature**: While at Candidate Recommendation stage, some browsers (like Safari) still require experimental features to be enabled

### Usage Pattern

```javascript
// Register a paint worklet
CSS.paintWorklet.addModule('path/to/paint.js');

// In the paint module (paint.js):
registerPaint('myPaint', class {
  static get inputProperties() {
    return ['--my-color'];
  }

  paint(ctx, geometry, properties) {
    // Custom drawing code
    const color = properties.get('--my-color').toString();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, geometry.width, geometry.height);
  }
});
```

### CSS Usage

```css
element {
  background-image: paint(myPaint);
  --my-color: #FF0000;
}
```

## Related Resources

- **Google CSS Paint API Introduction**: https://developers.google.com/web/updates/2018/01/paintapi
  - Official introduction and tutorial from Google Chrome team

- **Is Houdini Ready Yet?**: https://ishoudinireadyyet.com/
  - Comprehensive resource tracking CSS Houdini API implementation status across browsers

## Compatibility Notes

### Progressive Enhancement Strategy

Since CSS Painting API has limited browser support, use graceful degradation:

```css
.element {
  /* Fallback for unsupported browsers */
  background: linear-gradient(to right, #ff0000, #00ff00);

  /* CSS Painting API (will override fallback in supporting browsers) */
  background-image: paint(customGradient);
}
```

### Feature Detection

```javascript
if ('paintWorklet' in CSS) {
  // CSS Painting API is supported
  CSS.paintWorklet.addModule('paint.js');
} else {
  // Fallback behavior
}
```

### Safari Consideration

Safari support is gated behind experimental features. To enable in development:
1. Open Safari Develop menu
2. Navigate to Experimental Features
3. Enable "CSS Painting API"

## See Also

- [CSS Houdini Specification](https://drafts.css-houdini.org/)
- [CSS Properties and Values API](https://drafts.css-houdini.org/css-properties-values-api/)
- [CSS Typed OM](https://drafts.css-houdini.org/css-typed-om/)
- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

**Last Updated**: December 2025
**Source**: CanIUse Feature Database
