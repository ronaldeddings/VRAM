# naturalWidth & naturalHeight Image Properties

## Overview

The `naturalWidth` and `naturalHeight` properties define the intrinsic (actual) dimensions of an image, regardless of how it is displayed through CSS or HTML width/height attributes. These properties return the real pixel dimensions of the image as it exists on the server.

## Description

When you display an image on a web page, you can control how large it appears using CSS or HTML attributes (e.g., `width: 200px; height: 200px`). However, the image file itself has an original size that may differ from what is displayed. The `naturalWidth` and `naturalHeight` properties provide access to these original dimensions.

**Key Differences:**
- `width` / `height`: The displayed dimensions (what you see on screen)
- `naturalWidth` / `naturalHeight`: The intrinsic dimensions (the actual image file size)

## Specification

**Status:** Living Standard (LS)
**Specification URL:** [HTML Standard - DOM img naturalWidth](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-naturalwidth)

## Categories

- DOM (Document Object Model)
- HTML5

## Benefits & Use Cases

### 1. **Responsive Image Handling**
Determine the original aspect ratio of an image to maintain proper proportions when resizing.

```javascript
const img = new Image();
img.src = 'photo.jpg';
img.onload = function() {
  const aspectRatio = this.naturalWidth / this.naturalHeight;
  // Use aspect ratio for responsive layout
};
```

### 2. **Image Validation**
Verify that uploaded images meet minimum dimension requirements before processing.

```javascript
const validateImage = (img) => {
  if (img.naturalWidth < 800 || img.naturalHeight < 600) {
    console.warn('Image is too small');
  }
};
```

### 3. **Adaptive Content Loading**
Load different image resolutions based on device capabilities and display context.

```javascript
const img = document.querySelector('img');
img.onload = function() {
  if (this.naturalWidth > 1920) {
    // High-resolution image loaded
  }
};
```

### 4. **Gallery & Portfolio Applications**
Automatically create thumbnail layouts and image galleries with correct proportions.

```javascript
const calculateThumbnailSize = (img, maxWidth) => {
  const aspectRatio = img.naturalWidth / img.naturalHeight;
  return {
    width: maxWidth,
    height: maxWidth / aspectRatio
  };
};
```

### 5. **Image Comparison Tools**
Build before/after sliders or comparison interfaces with accurate dimension tracking.

### 6. **Canvas Manipulation**
When drawing images to canvas, knowing the natural dimensions ensures proper scaling and quality.

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img = document.getElementById('myImage');

ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
```

## Browser Support

| Browser | Supported From | Status |
|---------|---|---|
| **Internet Explorer** | 9 | ✓ Supported |
| IE 5.5 - 8 | - | ✗ Not Supported |
| **Edge** | 12 | ✓ Supported (All versions) |
| **Firefox** | 2 | ✓ Supported (All versions) |
| **Chrome** | 4 | ✓ Supported (All versions) |
| **Safari** | 3.1 | ✓ Supported (All versions) |
| **Opera** | 9 | ✓ Supported (All versions) |
| **iOS Safari** | 3.2 | ✓ Supported (All versions) |
| **Android Browser** | 2.1 | ✓ Supported (All versions) |
| **Opera Mini** | All versions | ✓ Supported |
| **Samsung Internet** | 4 | ✓ Supported (All versions) |
| **UC Browser** | 15.5+ | ✓ Supported |
| **KaiOS** | 2.5+ | ✓ Supported |

### Global Support Statistics
- **Supported:** 93.69% of users
- **No Support:** ~6.31% of users (primarily older IE versions)

## Usage Example

```javascript
// Basic usage
const img = document.getElementById('myImage');

if (img.complete) {
  // Image is already loaded
  console.log('Natural width:', img.naturalWidth);
  console.log('Natural height:', img.naturalHeight);
} else {
  // Wait for image to load
  img.addEventListener('load', function() {
    console.log('Natural width:', this.naturalWidth);
    console.log('Natural height:', this.naturalHeight);
  });
}

// Compare displayed vs. natural dimensions
console.log('Displayed size:', img.width, 'x', img.height);
console.log('Actual size:', img.naturalWidth, 'x', img.naturalHeight);
```

## Known Issues & Limitations

### Firefox SVG Bug
**Issue:** Firefox returns `0` for `naturalWidth` and `naturalHeight` on SVG images without explicit width and height attributes.

**Workaround:** Always define explicit `width` and `height` attributes on SVG images, or use alternative methods:

```javascript
// For SVG images
const svgImg = document.querySelector('img[src$=".svg"]');
if (svgImg.naturalWidth === 0) {
  // Fallback for SVG without explicit dimensions
  const svgDoc = svgImg.contentDocument || svgImg.getSVGDocument();
  if (svgDoc) {
    const svgElement = svgDoc.documentElement;
    const width = svgElement.getAttribute('viewBox').split(' ')[2];
    const height = svgElement.getAttribute('viewBox').split(' ')[3];
  }
}
```

**Reference:** [Firefox Bug #700533](https://bugzilla.mozilla.org/show_bug.cgi?id=700533)

### Older Internet Explorer Support
For Internet Explorer versions 5.5 through 8, this property is not available. Use polyfills or feature detection:

```javascript
function getImageDimensions(img) {
  if (img.naturalWidth !== undefined) {
    return {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
  } else {
    // Fallback for older IE
    return {
      width: img.width,
      height: img.height
    };
  }
}
```

## Related Properties & Methods

- **`HTMLImageElement.width`** - The displayed width of the image
- **`HTMLImageElement.height`** - The displayed height of the image
- **`HTMLImageElement.complete`** - Boolean indicating if the image has finished loading
- **`HTMLImageElement.currentSrc`** - The URL of the currently displayed image
- **Image.onload** - Event triggered when the image finishes loading

## Recommended Links

- [WHATWG HTML Standard - img.naturalWidth](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-naturalwidth)
- [Blog Post: naturalWidth and naturalHeight in IE](https://www.jacklmoore.com/notes/naturalwidth-and-naturalheight-in-ie/)
- [GitHub Gist: Getting Natural Dimensions in Older IE](https://gist.github.com/jalbertbowden/5273983)
- [MDN Web Docs: HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
- [Can I Use: naturalWidth & naturalHeight](https://caniuse.com/img-naturalwidth-naturalheight)

## Best Practices

1. **Always Check Image Load Status**
   ```javascript
   if (img.complete && img.naturalWidth !== 0) {
     // Safe to use naturalWidth/naturalHeight
   }
   ```

2. **Handle Load Events Properly**
   ```javascript
   img.addEventListener('load', function() {
     // Safe to access naturalWidth here
   });
   img.addEventListener('error', function() {
     // Handle failed image loads
   });
   ```

3. **Use Feature Detection**
   ```javascript
   const supportsNaturalDimensions = 'naturalWidth' in img;
   ```

4. **Account for SVG Quirks**
   - Test SVG behavior across browsers
   - Consider using `viewBox` as a fallback for SVGs
   - Document any browser-specific behaviors

5. **Consider Dynamic Images**
   - If images are loaded dynamically, ensure handlers are attached before setting `src`
   - Use event delegation for dynamically generated image elements

## Summary

The `naturalWidth` and `naturalHeight` properties are essential for working with images in JavaScript, offering near-universal browser support (93.69% globally). They enable responsive design patterns, image validation, and proper aspect ratio handling. While there are minor quirks with SVG images in Firefox and lack of support in older IE versions, modern development can safely rely on these properties with appropriate fallbacks.
