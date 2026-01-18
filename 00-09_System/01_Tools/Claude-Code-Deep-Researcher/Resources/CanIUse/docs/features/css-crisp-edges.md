# Crisp Edges/Pixelated Images

## Overview

The `image-rendering` property with `crisp-edges` and `pixelated` values enables rendering images using an algorithm that preserves edges and contrast, without smoothing colors or introducing blur. This is particularly useful for pixel art, low-resolution images, and other content where maintaining sharp edges and clarity is desired.

**Official values**: `crisp-edges` and `pixelated`

---

## Specification

- **Status**: Candidate Recommendation (CR)
- **Spec**: [CSS Images Module Level 3 - image-rendering](https://w3c.github.io/csswg-drafts/css-images-3/#valdef-image-rendering-crisp-edges)

---

## Categories

- CSS
- CSS3

---

## Benefits & Use Cases

### When to Use

- **Pixel Art**: Display pixel-perfect artwork without anti-aliasing artifacts
- **Retro Gaming Assets**: Render game sprites and textures with crisp appearance
- **Charts and Diagrams**: Maintain clarity in scaled graphics
- **Low-Resolution Images**: Scale up small images while preserving sharpness
- **Technical Illustrations**: Display technical diagrams without blur on scaling
- **Bitmap Fonts**: Render bitmap-based fonts crisply

### Key Advantages

1. **Preserves Image Detail**: Maintains edges and contrast when scaling
2. **Improves Readability**: Better for text-based graphics and icons
3. **Aesthetic Control**: Allows intentional "pixelated" visual effect
4. **Performance**: Can be more efficient than smooth interpolation
5. **Consistency**: Ensures predictable rendering across browsers

### Example Use Cases

```css
/* Pixel art game assets */
.game-sprite {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* Retro-style graphics */
.retro-graphic {
  image-rendering: crisp-edges;
}

/* Scaled bitmap images */
.bitmap-graphic {
  image-rendering: pixelated;
  width: 400px;
  height: 300px;
}
```

---

## Browser Support

### Support Summary

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 41 | Supports `pixelated` value |
| **Firefox** | 3.6 | Initially only `crisp-edges` (v3.6-64), `pixelated` from v65+ |
| **Safari** | 10 | Full support for both values |
| **Edge** | 79 | Supports `pixelated` value |
| **Opera** | 28 | Supports `pixelated` value |
| **iOS Safari** | 10.0+ | Full support |
| **Android Chrome** | 142 | Supports `pixelated` value |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **Chrome** | 41+ | ✅ Full Support | Supports `pixelated` value |
| **Firefox** | 3.6-64 | ⚠️ Partial | Only `crisp-edges` value |
| **Firefox** | 65+ | ✅ Full Support | Both values supported |
| **Safari** | 10+ | ✅ Full Support | Both values supported |
| **Edge** | 79+ | ✅ Full Support | Supports `pixelated` value |
| **Opera** | 11.6-12.1 | ⚠️ Partial | Only `crisp-edges` value |
| **Opera** | 28+ | ✅ Full Support | Supports `pixelated` value |
| **Internet Explorer** | All versions | ❌ No Support | Uses non-standard `-ms-interpolation-mode: nearest-neighbor` |

#### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| **iOS Safari** | 10.0+ | ✅ Full Support | Both values supported |
| **Android Chrome** | 142+ | ✅ Full Support | Supports `pixelated` value |
| **Firefox Mobile** | 144+ | ✅ Full Support | Both values supported |
| **Samsung Internet** | 4+ | ✅ Full Support | Supports `pixelated` value |
| **Opera Mobile** | 12+ (with prefix) | ⚠️ Partial | Only with `-webkit-` prefix |
| **Opera Mobile** | 28+ | ✅ Full Support | Supports `pixelated` value |
| **Opera Mini** | All versions | ❌ No Support | Not supported |

### Global Usage

- **Full Support (y)**: ~93.24%
- **Partial Support (a)**: ~0.44%
- **No Support (n)**: ~6.32%

---

## Implementation Notes

### Prefix Requirements

**Important**: Prefixes apply to the **value**, not the `image-rendering` property.

#### Prefixed Values

- **Firefox (v3.6-64)**: Use `-moz-crisp-edges` instead of `crisp-edges`
- **Safari (v6-9)**: Use `-webkit-optimize-contrast` (non-standard)
- **Opera (v11.6-12.1)**: Use `-webkit-optimize-contrast` with prefix

#### Recommended Syntax

```css
img {
  /* Provide both standard values for maximum compatibility */
  image-rendering: crisp-edges;
  image-rendering: pixelated;

  /* Older Firefox versions (rarely needed today) */
  image-rendering: -moz-crisp-edges;
}
```

### Property Scope

The `image-rendering` property applies to:

- **Universally Supported**: `<img>` elements, CSS background images, `<canvas>` elements (in most modern browsers)
- **Limited Support**: Some older browsers only support `<img>` or specific contexts
- **Not Supported**: WebGL contexts (Safari has a known bug)

---

## Known Issues & Limitations

### 1. WebGL Context Bug in Safari

**Issue**: Safari had a bug where `image-rendering: pixelated` is not supported for WebGL contexts.

**Status**: Known issue in WebKit browser engine

**Workaround**: Use alternative rendering approaches for WebGL content in Safari

**References**: [WebKit Bug #193895](https://bugs.webkit.org/show_bug.cgi?id=193895)

### 2. Limited Canvas Support

**Issue**: `image-rendering:-webkit-optimize-contrast;` and `-ms-interpolation-mode:nearest-neighbor` do not affect CSS images in some browsers.

**Affected Browsers**: Older Internet Explorer versions

**Impact**: CSS background images may not respect the image-rendering property in legacy IE

### 3. Pixel Value vs Crisp-Edges Inconsistency

**Issue**: Different browsers support different values:

- **Chrome, Edge, Opera**: Support `pixelated` value
- **Firefox**: Initially only `crisp-edges`, modern versions support both
- **Safari**: Full support for both values

**Recommendation**: Declare both values for maximum compatibility

### 4. Canvas and Background Image Limitations

**Issue**: In some browsers (older Safari versions), the property only works on `<img>` and CSS backgrounds, not `<canvas>` elements.

**Affected Versions**: Safari 6-9, iOS Safari up to 9.x

**Status**: Fixed in modern versions

---

## Related CSS Properties

- [`image-orientation`](https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation) - Rotate images without rotating the entire element
- [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) - Control how replaced content fills its box
- [`object-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) - Position replaced content
- [`filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) - Apply graphical effects

---

## Related Links

### Official Documentation

- [MDN Web Docs - CSS Image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering)
- [W3C CSS Images Module Level 3](https://w3c.github.io/csswg-drafts/css-images-3/#valdef-image-rendering-crisp-edges)

### Articles & Resources

- [HTML5Rocks: Pixelated Images](https://developer.chrome.com/blog/pixelated/)

### Browser Issue Trackers

- [Firefox Bug #856337: Implement image-rendering: pixelated](https://bugzilla.mozilla.org/show_bug.cgi?id=856337)
- [Chrome Bug #317991: Implement image-rendering:crisp-edges](https://bugs.chromium.org/p/chromium/issues/detail?id=317991)
- [WebKit Bug #193895: image-rendering: pixelated not supported for WebGL](https://bugs.webkit.org/show_bug.cgi?id=193895)

---

## Code Examples

### Basic Usage

```css
/* Apply crisp edge rendering to images */
img.pixel-art {
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}
```

### With Fallback for Older Browsers

```css
img.retro {
  /* Modern browsers */
  image-rendering: crisp-edges;
  image-rendering: pixelated;

  /* Older Firefox */
  image-rendering: -moz-crisp-edges;

  /* Safari 6-9 (non-standard) */
  image-rendering: -webkit-optimize-contrast;
}
```

### Scaling Pixel Art

```css
.game-sprite {
  image-rendering: pixelated;
  width: 200px;
  height: 200px;
  /* Original image: 50px × 50px, scaled 4x */
}
```

### Canvas Usage

```javascript
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Note: CSS image-rendering doesn't affect canvas directly
// For canvas, use imageSmoothingEnabled property instead
ctx.imageSmoothingEnabled = false;
```

### CSS Background Images

```css
.sprite-sheet {
  background-image: url('sprites.png');
  background-size: 100px 100px;
  image-rendering: pixelated;

  width: 100px;
  height: 100px;
}
```

---

## Browser Detection

### JavaScript Feature Detection

```javascript
// Check if browser supports crisp-edges/pixelated
function supportsImageRendering() {
  const img = new Image();
  const style = img.style;

  // Test if property is recognized (not foolproof)
  style.imageRendering = 'crisp-edges';
  return style.imageRendering === 'crisp-edges';
}

// More reliable: Test actual rendering behavior
function testPixelArtRendering() {
  const canvas = document.createElement('canvas');
  return typeof canvas.getContext('2d').imageSmoothingEnabled !== 'undefined';
}
```

### CSS Feature Queries

```css
@supports (image-rendering: crisp-edges) {
  img.pixel-art {
    image-rendering: crisp-edges;
  }
}

@supports (image-rendering: pixelated) {
  img.pixel-art {
    image-rendering: pixelated;
  }
}
```

---

## Migration Guide

### From `-webkit-optimize-contrast` to Standard

If you're currently using `-webkit-optimize-contrast`:

```css
/* Old approach */
img {
  image-rendering: -webkit-optimize-contrast;
}

/* Modern approach */
img {
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}
```

### From `-ms-interpolation-mode` to Standard

If you're using the IE-specific syntax:

```css
/* Old IE approach */
img {
  -ms-interpolation-mode: nearest-neighbor;
}

/* Modern approach */
img {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

---

## Compatibility Checklist

- ✅ Modern Chrome/Edge (v41+)
- ✅ Modern Firefox (v65+)
- ✅ Modern Safari (v10+)
- ✅ Modern Opera (v28+)
- ⚠️ Older Firefox (v3.6-64) - requires `-moz-crisp-edges`
- ⚠️ Older Safari (v6-9) - requires `-webkit-optimize-contrast`
- ❌ Internet Explorer - no standard support
- ✅ Mobile browsers - widely supported in modern versions

---

## Conclusion

The `image-rendering` property with `crisp-edges` and `pixelated` values provides excellent support across modern browsers (93%+ global usage). It's ideal for pixel art, retro graphics, and other content requiring sharp, clear rendering. Use both standard values for maximum compatibility, and fallback to non-standard prefixes only if supporting very old browsers is necessary.

For most new projects, simply using the standard CSS property without prefixes is recommended, as browser support is mature and widespread.
