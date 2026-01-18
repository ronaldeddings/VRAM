# createImageBitmap

Create image bitmap with support for resizing and adjusting quality

## Overview

The `createImageBitmap()` method creates a bitmap from a variety of image sources, including `<img>` elements, `<canvas>` elements, `<video>` elements, `ImageData` objects, `Blob` objects, and `ImageBitmap` objects. This API is particularly useful for offloading image processing to Web Workers and for optimizing image handling in high-performance applications.

The method supports several options for image manipulation, including resizing and quality adjustment, making it a powerful tool for image preprocessing before rendering or analysis.

## Specification

- **Specification**: [HTML Living Standard - createImageBitmap](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#dom-createimagebitmap)
- **Status**: Living Standard (ls)

## Categories

- JavaScript API

## Benefits & Use Cases

### Performance Optimization
- **Worker Offloading**: Process images in Web Workers without blocking the main thread
- **Efficient Bitmap Creation**: Create optimized bitmap representations of images for rendering
- **Reduced Memory Footprint**: Process large images by resizing before storage or display

### Image Manipulation
- **Server-Side Image Resizing**: Resize images on the client-side before upload or canvas rendering
- **Quality Control**: Adjust compression quality for optimal balance between file size and visual quality
- **Batch Processing**: Handle multiple images efficiently in parallel using workers

### Advanced Graphics
- **Canvas Optimization**: Pre-process images before drawing to canvas
- **WebGL Integration**: Create optimized textures for WebGL rendering
- **Image Analysis**: Prepare images for machine learning or computer vision tasks in workers

### Web Applications
- **Thumbnail Generation**: Create thumbnails without server round-trips
- **Progressive Loading**: Process images incrementally without blocking UI
- **Cross-Origin Images**: Handle images from different origins in controlled manner

## Browser Support

### Summary

| Browser | First Full Support | Current Support |
|---------|-------------------|-----------------|
| Chrome | 59 | Yes (v59+) |
| Edge | 79 | Yes (v79+) |
| Firefox | 98 | Yes (v98+) |
| Safari | 17.0 | Yes (v17.0+) |
| Opera | 46 | Yes (v46+) |
| iOS Safari | 17.0 | Yes (v17.0+) |

### Detailed Browser Support Table

| Browser/Platform | Full Support | Partial Support | Notes |
|---|---|---|---|
| **Chrome** | v59+ | v50-58 (partial) | Partial support from v50 with various limitations |
| **Edge** | v79+ | — | Full support since Chromium migration |
| **Firefox** | v98+ | v42-97 (partial) | Partial support with known limitations; v93-97 has reduced partial support |
| **Safari** | v17.0+ | v15-16.6 (partial) | Partial support from v15 |
| **Opera** | v46+ | v37-45 (partial) | Partial support from v37 |
| **iOS Safari** | v17.0+ | v15-16.6 (partial) | Partial support from v15 |
| **Android Chrome** | v142+ | — | Full support on modern Android versions |
| **Android Firefox** | v144+ | — | Full support with note #7 |
| **Samsung Internet** | v6.2+ | — | Full support from v6.2+ |
| **Opera Mobile** | v80+ | — | Full support from v80 |
| **Android UC Browser** | v15.5+ | — | Full support from v15.5 |
| **QQ Browser** | v14.9+ | — | Full support from v14.9 |
| **Baidu Browser** | v13.52+ | — | Full support from v13.52 |
| **IE/IE Mobile** | Not Supported | — | No support for any version |
| **Opera Mini** | Not Supported | — | No support |
| **BlackBerry** | Not Supported | — | No support for any version |

### Global Support Statistics

- **Full Support (Yes)**: 91.36%
- **Partial Support (Partial)**: 1.33%
- **No Support**: 7.31%

## Known Limitations & Bugs

### Browser-Specific Limitations

#### Chrome (v50-58)
- Note #1: No support for options parameter, `resizeWidth`, `resizeHeight`, `resizeQuality`, or `SVGImageElement` as Source Image

#### Chrome (v52-58)
- Note #2: No support for `resizeWidth`, `resizeHeight`, `resizeQuality`, or `SVGImageElement` as Source Image

#### Chrome (v54-58)
- Note #3: No support for `SVGImageElement` as Source Image

#### Firefox (v42-92)
- Note #4: No support for `resizeWidth`, `resizeHeight`, and `resizeQuality`
  - [Bugzilla #1363861](https://bugzilla.mozilla.org/show_bug.cgi?id=1363861)
- Note #5: No support for `createImageBitmap(source, options)` interface
  - [Bugzilla #1335594](https://bugzilla.mozilla.org/show_bug.cgi?id=1335594)

#### Firefox (v93-97)
- Note #4: No support for `resizeWidth`, `resizeHeight`, and `resizeQuality`
  - [Bugzilla #1363861](https://bugzilla.mozilla.org/show_bug.cgi?id=1363861)

#### Firefox (v98+)
- Note #7: No support for `resizeQuality`
  - [Bugzilla #1363861](https://bugzilla.mozilla.org/show_bug.cgi?id=1363861)

#### Safari (v15-16.6) & iOS Safari (v15-16.6)
- Note #6: No support for `premultiplyAlpha` with `ImageData` as Source Image
  - [WebKit Bug #237082](https://bugs.webkit.org/show_bug.cgi?id=237082)

#### KaiOS (v2.5-3.1)
- Note #4: No support for `resizeWidth`, `resizeHeight`, and `resizeQuality`
- Note #5: No support for `createImageBitmap(source, options)` interface

### Recommended Approach for Maximum Compatibility

When targeting older browsers, consider:

1. **Feature Detection**: Check for method availability and specific parameter support
2. **Fallback Implementations**: Provide alternative image processing using Canvas API
3. **Progressive Enhancement**: Start with fallbacks and enhance when full support is available
4. **Polyfill Considerations**: For critical use cases, consider canvas-based fallbacks rather than full polyfills

## Usage Examples

### Basic Usage

```javascript
// From canvas element
const canvas = document.getElementById('myCanvas');
createImageBitmap(canvas).then(imageBitmap => {
  // Use the bitmap
  context.drawImage(imageBitmap, 0, 0);
});

// From Blob
fetch('image.png')
  .then(response => response.blob())
  .then(blob => createImageBitmap(blob))
  .then(imageBitmap => {
    // Use the bitmap
  });
```

### With Resizing Options

```javascript
const img = document.getElementById('myImage');

// Resize image with quality control
createImageBitmap(img, {
  resizeWidth: 100,
  resizeHeight: 100,
  resizeQuality: 'high'  // Only in Chrome 59+, Safari 17+, Firefox 98+
}).then(imageBitmap => {
  // Use resized bitmap
});
```

### In Web Worker

```javascript
// Main thread
const img = document.getElementById('myImage');
worker.postMessage({ image: img }, [img]);

// Worker thread
self.onmessage = (event) => {
  const img = event.data.image;
  createImageBitmap(img).then(imageBitmap => {
    // Process bitmap in worker
  });
};
```

### Cropping

```javascript
const source = document.getElementById('myImage');

// Crop a region from the image
createImageBitmap(source, {
  sx: 10,      // x-coordinate of crop origin
  sy: 10,      // y-coordinate of crop origin
  sw: 100,     // crop width
  sh: 100      // crop height
}).then(imageBitmap => {
  // Use cropped bitmap
});
```

## Related Links

- [MDN: createImageBitmap() Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/createImageBitmap)
- [HTML Living Standard Specification](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#dom-createimagebitmap)
- [ImageBitmap Documentation](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## Polyfill & Workarounds

### Canvas-Based Fallback

For older browsers, consider using the Canvas API as a fallback:

```javascript
function createImageBitmapFallback(source, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof createImageBitmap !== 'undefined') {
      createImageBitmap(source, options).then(resolve).catch(reject);
      return;
    }

    // Fallback using Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const onLoad = () => {
      canvas.width = options.resizeWidth || source.width;
      canvas.height = options.resizeHeight || source.height;
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    if (source instanceof HTMLImageElement) {
      if (source.complete) {
        onLoad();
      } else {
        source.addEventListener('load', onLoad);
        source.addEventListener('error', reject);
      }
    } else {
      onLoad();
    }
  });
}
```

## See Also

- `ImageBitmap` interface
- `Canvas.OffscreenCanvas` (complementary API)
- `WorkerGlobalScope` (use in Web Workers)
- `Blob` and `Uint8Array` for image data sources
