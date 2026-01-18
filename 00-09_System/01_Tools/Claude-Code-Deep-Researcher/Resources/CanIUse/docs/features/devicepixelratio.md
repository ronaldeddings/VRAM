# Window.devicePixelRatio

## Overview

`Window.devicePixelRatio` is a read-only property that returns the ratio of the physical pixel size of the current display device to the size of one CSS pixel. This property is essential for responsive design and handling high-density displays such as Retina screens.

## Description

The Device Pixel Ratio (DPR) represents the relationship between device pixels and CSS pixels. A ratio of 2 means that one CSS pixel is rendered as 2x2 device pixels, which is common on modern smartphones and high-resolution displays.

As a webpage is zoomed in, the number of device pixels that one CSS pixel covers increases, and therefore the value of `devicePixelRatio` will also increase proportionally.

### Key Characteristics

- **Type**: Read-only floating-point number
- **Returns**: A positive number representing the device pixel ratio
- **Scope**: Window object
- **Cross-browser**: Widely supported across modern browsers

## Specification Status

- **Current Status**: Working Draft (WD)
- **Specification**: [CSSOM View Module - W3C](https://w3c.github.io/csswg-drafts/cssom-view/#dom-window-devicepixelratio)

## Categories

- CSS
- DOM

## Benefits and Use Cases

### 1. **Responsive Image Handling**
Serve different image resolutions based on device pixel ratio to optimize load times and rendering quality:

```javascript
const dpr = window.devicePixelRatio;
const imageSrc = dpr >= 2 ? 'image@2x.png' : 'image.png';
```

### 2. **Canvas Rendering Optimization**
Adjust canvas resolution for crisp graphics on high-DPR displays:

```javascript
const canvas = document.querySelector('canvas');
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

const ctx = canvas.getContext('2d');
ctx.scale(dpr, dpr);
```

### 3. **Adaptive UI Scaling**
Adjust UI elements, fonts, or icons based on display density:

```javascript
if (window.devicePixelRatio >= 2) {
  document.body.classList.add('high-dpi');
}
```

### 4. **Performance Monitoring**
Track performance metrics adjusted for display density to ensure consistent user experience:

```javascript
const pixelDensity = window.devicePixelRatio;
// Adjust performance thresholds based on rendering overhead
```

### 5. **Graphics and Animation Quality**
Optimize graphics rendering quality and animation frame rates for different device capabilities.

### 6. **SVG and Vector Graphics**
Scale vector graphics appropriately for high-density displays.

## Browser Support

| Browser | Support Status | First Version | Notes |
|---------|---|---|---|
| **Internet Explorer** | ❌ | 11 | IE 11+ only |
| **Edge** | ✅ | 12+ | Full support from version 12 onwards |
| **Chrome** | ✅ | 4+ | Full support since early versions |
| **Firefox** | ✅ | 18+ | Full support from version 18 onwards |
| **Safari** | ✅ | 3.1+ | Full support since early versions |
| **Opera** | ✅ | 11.6+ | Full support from version 11.6 onwards |
| **iOS Safari** | ✅ | 3.2+ | Full support across all versions |
| **Android Browser** | ✅ | 2.1+ | Full support since version 2.1 |
| **Opera Mini** | ✅ | All | Full support in all versions |
| **Mobile IE** | ⚠️ | 10-11 | Supported from version 11 onwards |
| **Opera Mobile** | ✅ | 12+ | Full support from version 12+ |
| **Samsung Internet** | ✅ | 4+ | Full support from version 4 onwards |

### Global Usage

- **Supported**: 93.58% of users globally
- **Partial/No Support**: 6.42%

### Legacy Browser Considerations

- **Internet Explorer 10 and earlier**: Not supported
- **Firefox versions 1-17**: Not supported
- **Opera versions before 11.6**: Not supported

## Code Examples

### Basic Usage

```javascript
// Get the device pixel ratio
const ratio = window.devicePixelRatio;
console.log(`Device Pixel Ratio: ${ratio}`); // e.g., 2, 1.5, 1
```

### Responsive Image Serving

```javascript
function getOptimalImageUrl(basePath) {
  const dpr = window.devicePixelRatio;

  if (dpr >= 3) {
    return `${basePath}@3x.png`;
  } else if (dpr >= 2) {
    return `${basePath}@2x.png`;
  } else {
    return `${basePath}.png`;
  }
}

// Usage
const imgSrc = getOptimalImageUrl('assets/logo');
document.querySelector('img').src = imgSrc;
```

### Canvas High-DPI Rendering

```javascript
function setupCanvasHighDPI(canvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvasElement.getBoundingClientRect();

  // Set canvas resolution based on DPR
  canvasElement.width = rect.width * dpr;
  canvasElement.height = rect.height * dpr;

  // Scale context to match device pixels
  const ctx = canvasElement.getContext('2d');
  ctx.scale(dpr, dpr);

  // Reset styling to maintain visual size
  canvasElement.style.width = `${rect.width}px`;
  canvasElement.style.height = `${rect.height}px`;

  return ctx;
}
```

### Media Query Alternative (CSS)

```css
/* Using CSS media queries for device pixel ratio */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .high-dpi-element {
    background-image: url('image@2x.png');
    background-size: 100% 100%;
  }
}
```

### Monitoring Zoom Level Changes

```javascript
let currentZoom = 1;

function handleZoomChange() {
  const newDpr = window.devicePixelRatio;

  if (newDpr !== currentZoom) {
    currentZoom = newDpr;
    console.log(`Zoom changed to: ${currentZoom}x`);
    // Trigger UI updates or image reloading
  }
}

window.addEventListener('resize', handleZoomChange);
```

## Important Notes

- **Zoom Sensitivity**: The `devicePixelRatio` value changes when the user zooms in or out of the page. This is different from just the physical device's pixel density.
- **Read-Only**: This property cannot be set directly; it's determined by the browser and device.
- **CSS Alternative**: Use CSS media queries with `min-resolution` or `-webkit-device-pixel-ratio` for CSS-based responsive behavior.
- **Accessibility**: Always provide fallbacks for users with older browsers or assistive technologies.

## Related Resources

### Official Documentation
- [MDN Web Docs - Window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)

### Related APIs
- [Window.matchMedia()](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) - For responsive design with media queries
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - For high-quality graphics rendering
- [CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) - For CSS-based device pixel ratio handling

### Best Practices
1. Always provide a fallback for older browsers
2. Use CSS media queries when possible for better performance
3. Test on actual devices with different pixel ratios
4. Consider performance implications of high-DPR rendering
5. Cache DPR values to avoid repeated calculations

## Support Matrix Summary

| Browser Family | Minimum Version | Support Status |
|---|---|---|
| Chrome/Edge/Chromium | 4 / 12 | ✅ Full Support |
| Firefox | 18 | ✅ Full Support |
| Safari | 3.1 | ✅ Full Support |
| Opera | 11.6 | ✅ Full Support |
| Mobile Browsers | Varies | ✅ Mostly Supported |
| Internet Explorer | 11 | ⚠️ Limited (v11 only) |

---

*Last Updated: 2025*
*Based on CanIUse data for Window.devicePixelRatio*
