# Canvas (Basic Support)

## Overview

The HTML Canvas API provides a method of generating fast, dynamic graphics using JavaScript. It allows developers to draw graphics via scripting, enabling real-time rendering of 2D shapes, images, text, and complex visual effects directly in the browser.

## Specification

- **Status:** Living Standard
- **Specification Link:** [WHATWG HTML Scripting - Canvas Element](https://html.spec.whatwg.org/multipage/scripting.html#the-canvas-element)

## Categories

- Canvas
- HTML5

## Benefits and Use Cases

### Primary Use Cases

1. **Dynamic Graphics Generation**
   - Real-time drawing and rendering of complex graphics
   - Procedurally generated content
   - Dynamic visualization of data

2. **Interactive Applications**
   - Drawing and painting applications
   - Games and interactive experiences
   - Animation frameworks

3. **Data Visualization**
   - Charts and graphs
   - Real-time data dashboards
   - Custom visualization components

4. **Image Processing**
   - Client-side image manipulation
   - Filters and effects
   - Image export and generation

5. **Rendering Optimization**
   - GPU-accelerated graphics in modern browsers
   - Efficient rendering compared to DOM manipulation
   - Smooth animations and transitions

### Key Benefits

- **Performance:** Significantly faster than DOM-based animations for complex graphics
- **Flexibility:** Complete control over pixel-level rendering
- **Export Capability:** Convert canvas drawings to image formats (PNG, JPEG, etc.)
- **Accessibility Support:** Screen readers supported in modern browsers
- **Wide Browser Support:** Available across all modern browsers and devices

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Current Status |
|---------|-------------------|----------------|
| Internet Explorer | IE 9+ | Supported |
| Edge | Edge 12+ | Supported |
| Firefox | Firefox 3.6+ | Supported |
| Chrome | Chrome 4+ | Supported |
| Safari | Safari 4+ | Supported |
| Opera | Opera 9+ | Supported |

### Mobile Browsers

| Platform | Browser | Support |
|----------|---------|---------|
| iOS | Safari 3.2+ | Fully Supported |
| Android | Android 3.0+ | Fully Supported |
| Windows Phone | IE Mobile 10+ | Supported |
| BlackBerry | BB 7+ | Supported |
| Opera Mobile | 10.0+ | Supported |
| Samsung Internet | 4.0+ | Supported |

### Support Summary

- **Global Coverage:** 93.65% of users have full support
- **Partial Support:** 0.04% (primarily older versions)
- **Vendor Prefixes:** Not required

## Known Bugs and Limitations

### Android Browser
- **Clipping Limitation:** The Android browser does not support clipping on HTML5 canvas
- **Reference:** [Google Issue Tracker #36934492](https://issuetracker.google.com/issues/36934492)

### iOS Safari
- **Video Source (Older Versions):** iOS versions prior to iOS 8 did not support video as a source for canvas `drawImage()` method
  - Status: Works as of iOS 8+
  - Test case: [JSFiddle example](https://jsfiddle.net/zL8KC/)

- **toDataURL() Size Limits:**
  - Maximum decoded image size (GIF, PNG, TIFF): 3 megapixels (devices with <256MB RAM), 5 megapixels (devices with ≥256MB RAM)
  - Maximum canvas element size: 3 megapixels (<256MB RAM), 5 megapixels (≥256MB RAM)
  - JavaScript execution time: Limited to 10 seconds per top-level entry point

### Internet Explorer / Edge

#### IE 11
- **Issue:** `canvas.toDataURL()` does not work when the canvas contains images with data URI sources
- **Affected:** IE 11 only
- **Reference:** [Microsoft Connect Feedback](https://web.archive.org/web/20171004111538/https://connect.microsoft.com/IE/Feedback/Details/828416)

#### IE 10
- **Missing Methods:** Does not support `setLineDash()` or `lineDashOffset()`
- **Impact:** Line dash patterns not available in IE 10
- **Reference:** [MSDN Forum Discussion](https://social.msdn.microsoft.com/Forums/en-US/85007e72-90ad-4bd9-affd-9a24702219e6/canvasrenderingcontext2dsetlinedash-and-linedashoffset-missing?forum=winappswithhtml5)

#### IE and Edge (Global)
- **SVG globalAlpha Issue:** `globalAlpha` is not respected when drawing SVG graphics to canvas
- **Workaround:** Avoid relying on globalAlpha transparency for SVG content in IE/Edge
- **References:**
  - [Microsoft Connect Feedback](https://connect.microsoft.com/IE/feedback/details/1847897/globalalpha-ignored-when-drawing-svg-to-canvas)
  - [Test case](https://jsfiddle.net/p7b0wmcu/)

### Opera Mini
- **Limitation:** Opera Mini supports the canvas element but cannot execute animations or run complex interactive applications
- **Use Case:** Static canvas content only

## Feature Notes

### Accessibility
- **Screen Reader Support:** Chrome, Firefox, and IE support the [accessible canvas element sub-DOM](http://www.paciellogroup.com/blog/2012/06/html5-canvas-accessibility-in-firefox-13/)
- **Focus Ring Drawing:** Firefox and Chrome support the `drawFocusRing()` method for improving accessibility
- **Best Practice:** Provide fallback content and ARIA labels for canvas-based content

### toDataURL() Method
- **Partial Support:** Early versions of Firefox (2.0-3.5) and Safari (3.1-3.2) do not support this method
- **Full Support:** Available in all modern browsers

## Basic Example

```javascript
// Get canvas element and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw a simple rectangle
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 100);

// Draw text
ctx.fillStyle = 'white';
ctx.font = '16px Arial';
ctx.fillText('Hello Canvas', 20, 60);

// Export as image
const imageData = canvas.toDataURL('image/png');
```

## Fallback Support

For older browsers without canvas support, consider:
1. Using `<canvas>` with fallback content (displayed in unsupported browsers)
2. Using polyfills like [ExplorerCanvas](https://github.com/arv/ExplorerCanvas) for IE8 and below
3. Detecting canvas support with feature detection methods

```html
<canvas id="myCanvas" width="300" height="150">
  Your browser does not support HTML5 Canvas.
  <!-- Fallback content here -->
</canvas>
```

## Related Resources

### Official Documentation
- **[MDN Web Docs - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)** - Comprehensive API reference
- **[MDN Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)** - Step-by-step guide by Mozilla

### Learning Resources
- **[Canvas Tutorial & Cheat Sheet](https://skilled.co/html-canvas/)** - Quick reference and examples
- **[Dive Into HTML5 - Canvas](https://diveintohtml5.info/canvas.html)** - In-depth tutorial

### Tools and Libraries
- **[Canvas Animation Kit](http://glimr.rubyforge.org/cake/canvas.html)** - Animation utilities
- **[has.js Canvas Detection](https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#canvas)** - Feature detection test

### Polyfills and Compatibility
- **[ExplorerCanvas](https://github.com/arv/ExplorerCanvas)** - Canvas implementation for Internet Explorer (legacy)

## Implementation Guidelines

### Feature Detection

```javascript
// Check if canvas is supported
function canvasSupported() {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
}

// Check for specific features
function canDataURLExport() {
  try {
    const canvas = document.createElement('canvas');
    canvas.toDataURL('image/png');
    return true;
  } catch (e) {
    return false;
  }
}
```

### Performance Considerations

1. **Batch Drawing Operations:** Group multiple draw commands together
2. **Cache Frequently Drawn Elements:** Pre-render static content to off-screen canvas
3. **Use RequestAnimationFrame:** For optimal animation performance
4. **Be Mindful of Canvas Size:** Larger canvas elements consume more memory and processing power
5. **Consider WebGL:** For highly complex 3D graphics or intensive computations

## Version Support Details

### Early Adoption (Partial Support)
- Firefox 2.0-3.5: Partial support (no `toDataURL()`)
- Safari 3.1-3.2: Partial support (no `toDataURL()`)
- Android 2.1-2.3: Partial support

### Full Support Timeline
- **Internet Explorer:** Since IE 9 (IE 6-8 require polyfill)
- **Firefox:** Since Firefox 3.6
- **Chrome:** Since Chrome 4
- **Safari:** Since Safari 4
- **Opera:** Since Opera 9

## Migration from Flash

Canvas replaced Flash for many interactive graphics use cases:
- **Advantages:** Native browser support, better performance, standardized API
- **Considerations:** Different drawing model, no timeline-based animation by default, different text rendering capabilities

## See Also

- [WebGL API](/docs/features/webgl/) - 3D graphics
- [SVG](/docs/features/svg/) - Vector graphics
- [requestAnimationFrame](/docs/features/requestanimationframe/) - Animation timing
- [Blob API](/docs/features/blobbuilder/) - Data export and manipulation
