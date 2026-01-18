# CSS image-set

## Overview

CSS `image-set()` is a method of letting the browser pick the most appropriate CSS image from a given set based on display resolution and other device characteristics. This function enables developers to provide multiple image sources with different resolutions, allowing browsers to select the optimal image for the user's device.

## Specification

| Property | Value |
|----------|-------|
| **Specification** | [CSS Images Module Level 4](https://w3c.github.io/csswg-drafts/css-images-4/#image-set-notation) |
| **Status** | Working Draft (WD) |
| **Standardization Level** | Not yet stable |

## Categories

- **CSS** - Cascading Style Sheets

## Syntax

```css
/* Basic syntax */
background-image: image-set(
  url('image.png') 1x,
  url('image-2x.png') 2x
);

/* With type function (limited support) */
background-image: image-set(
  url('image.webp') type('image/webp') 1x,
  url('image.png') type('image/png') 1x
);
```

## Key Features

### Resolution Descriptors
- **`x` units**: Specify pixel ratio (e.g., `1x`, `2x`, `3x`)
  - `1x` - Standard resolution (96 DPI)
  - `2x` - High DPI displays (e.g., Retina displays)
  - `3x` - Ultra-high DPI displays

### Resolution Units
- **`dppx`** (dots per pixel) - Also valid for specifying resolution
- **`dpi`** (dots per inch) - Alternative unit support

### Image Format Specification
- **`type()` function**: Allows specifying image format/MIME type
  - Example: `type('image/webp')`, `type('image/jpeg')`
  - Browser can skip unsupported formats

## Use Cases and Benefits

### 1. **Responsive Image Resolution**
Serve high-resolution images to Retina and high-DPI displays without wasting bandwidth on standard displays.

```css
.hero-image {
  background-image: image-set(
    url('hero-mobile.jpg') 1x,
    url('hero-mobile-2x.jpg') 2x,
    url('hero-mobile-3x.jpg') 3x
  );
}
```

### 2. **Format Optimization**
Deliver modern image formats (WebP, AVIF) to supporting browsers while providing fallbacks.

```css
.logo {
  background-image: image-set(
    url('logo.avif') type('image/avif'),
    url('logo.webp') type('image/webp'),
    url('logo.png') type('image/png')
  );
}
```

### 3. **Battery and Bandwidth Efficiency**
On mobile devices and data-saving modes, serve lower-resolution images to reduce bandwidth consumption.

### 4. **CSS-only Image Selection**
Handle multiple image sources entirely in CSS without requiring JavaScript or HTML attributes.

### 5. **Device Pixel Ratio Adaptation**
Automatically select images based on the device's pixel ratio, improving visual clarity without overloading devices.

## Browser Support

### Summary
- **Full Support**: Chrome 113+, Edge 113+, Firefox 89+, Safari 17+, Opera 99+
- **Partial Support**: Chrome 21-112, Edge 79-112, Safari 6-16, Opera 15-98 (limited to `url()` with `x` units only)
- **Mobile Support**: iOS Safari 17+, Android 142+
- **No Support**: Internet Explorer all versions, Opera Mini

### Detailed Browser Support Table

| Browser | Full Support | Partial Support | Notes |
|---------|:---:|:---:|---------|
| **Chrome** | 113+ | 21-112 | Limited support requires `-webkit-` prefix and only accepts `url()` with `x` resolution |
| **Edge** | 113+ | 79-112 | Same limitations as Chrome in partial support phase |
| **Firefox** | 89+ | 88 | Full unprefixed support from v89; partial in v88 |
| **Safari** | 17+ | 6-16 | Partial support with known limitations on `type()` and omitted resolution |
| **Opera** | 99+ | 15-98 | Follows Chromium's implementation timeline |
| **iOS Safari** | 17+ | 6-16 | Mobile Safari parity with desktop Safari |
| **Opera Mobile** | 80+ | — | Full support from v80 |
| **Android Chrome** | 142+ | — | Full support in latest versions |
| **Android Firefox** | 144+ | — | Full support in latest versions |
| **IE / IE Mobile** | ❌ | — | Never supported |
| **Opera Mini** | ❌ | — | No support on Opera Mini |
| **Blackberry** | — | 10 | Limited support on BB10 |
| **Samsung Internet** | 23+ | 4-22 | Full support from v23 onward |

## Browser Compatibility Matrix

### Desktop Browsers
```
Chrome:     ▓▓░ (63% usage)   Full support from v113 onward
Firefox:    ▓▓░ (10% usage)   Full support from v89 onward
Safari:     ▓░░ (15% usage)   Full support from v17 onward
Edge:       ▓▓░ (10% usage)   Full support from v113 onward
Opera:      ░░░ (2% usage)    Full support from v99 onward
```

### Mobile Browsers
```
iOS Safari: ▓░░ (25% usage)   Full support from v17 onward
Android:    ▓▓░ (62% usage)   Full support from v142 onward
Samsung:    ▓░░ (8% usage)    Full support from v23 onward
```

### Global Usage Statistics
- **Full Support**: 86.26%
- **Partial Support**: 6.87%
- **No Support**: 6.87%

## Known Limitations and Bugs

### Note #1: Limited Initial Support
In Chromium-based browsers (Chrome 21+, Edge 79+, Opera 15+) and WebKit browsers (Safari 6+), support is very limited:
- **Only `url()` accepted** as the image source
- **Only `x` units accepted** as resolution descriptor
- Requires `-webkit-` prefix in older versions
- Does not support `type()` function
- Does not support `dppx` or `dpi` units
- Does not support `calc()` for resolution values

**Affected versions:**
- Chrome: 21-112
- Edge: 79-112
- Opera: 15-98
- Safari: 6-16
- iOS Safari: 6-16

### Note #2: Generated Images in Content
Firefox doesn't support generated images (like gradients) in the `content` property when using `image-set()`.
- **Example that fails:** `content: image-set(linear-gradient())`
- **Firefox versions affected:** 88-112
- **Status:** [Bug 1696314](https://bugzilla.mozilla.org/show_bug.cgi?id=1696314)
- **Workaround:** Use `background-image` instead of `content`, or use static image files

### Note #3: Missing `type()` Function Support
Safari and related WebKit browsers don't support the `type()` function for specifying image format.
- **Affected versions:** Safari 6-16, iOS Safari 6-16
- **Issue:** Cannot serve format-specific images (WebP, AVIF, etc.)
- **WebKit Bug:** [Issue #225185](https://bugs.webkit.org/show_bug.cgi?id=225185)
- **Workaround:** Use fallback with multiple CSS rules or JavaScript

### Note #4: Resolution Omission Not Supported
Safari and WebKit browsers require explicit resolution descriptors; omitting resolution is not supported.
- **Affected versions:** Safari 6-16, iOS Safari 6-16
- **Example that fails:**
  ```css
  /* Not supported in partial support browsers */
  background-image: image-set(url('image.png'), url('image-2x.png') 2x);
  ```
- **Workaround:** Always include explicit resolution for each image

### Note #5: calc() Function for Resolution
Modern implementations don't support using `calc()` for resolution values in some browsers.
- **Example not supported:**
  ```css
  background-image: image-set(url('image.png') calc(1 * 1x));
  ```
- **Affected versions:** Chrome 21-112, Edge 79-112, Opera 15-98
- **Workaround:** Use literal resolution values (1x, 2x, etc.)

## Implementation Guide

### Basic Usage

```css
/* Simple case: two resolutions */
.card {
  background-image: image-set(
    url('card.png') 1x,
    url('card@2x.png') 2x
  );
  background-size: 400px 200px;
}
```

### Production-Ready with Fallback

```css
.hero {
  /* Fallback for non-supporting browsers */
  background-image: url('hero.png');

  /* Modern browsers with full support */
  background-image: image-set(
    url('hero.webp') type('image/webp') 1x,
    url('hero-2x.webp') type('image/webp') 2x,
    url('hero.png') type('image/png') 1x,
    url('hero-2x.png') type('image/png') 2x
  );

  background-size: cover;
  background-position: center;
}
```

### Mobile-First Approach

```css
.background {
  background-image: image-set(
    url('bg-mobile.jpg') 1x,
    url('bg-mobile-2x.jpg') 2x
  );
}

@media (min-width: 768px) {
  .background {
    background-image: image-set(
      url('bg-desktop.jpg') 1x,
      url('bg-desktop-2x.jpg') 2x
    );
  }
}
```

### Format Negotiation

```css
.icon {
  background-image: image-set(
    url('icon.avif') type('image/avif'),
    url('icon.webp') type('image/webp'),
    url('icon.svg+xml') type('image/svg+xml'),
    url('icon.png') type('image/png')
  );
}
```

## Alternatives and Complements

### 1. **HTML `<picture>` Element** (Better Support)
- More mature, wider browser support
- Preferred for responsive images
- Allows art direction and format selection
- Works with `srcset` attribute

```html
<picture>
  <source srcset="image-2x.webp 2x" type="image/webp" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.png" />
</picture>
```

### 2. **`<img srcset>` Attribute**
- Simpler syntax for resolution-based selection
- Better browser support (95%+)
- Great for content images

```html
<img
  src="image.png"
  srcset="image.png 1x, image-2x.png 2x"
  alt="Description"
/>
```

### 3. **CSS `background-size` with Media Queries**
- Traditional approach with wide support
- More verbose but very compatible

```css
.background {
  background-image: url('image.png');
}

@media (min-device-pixel-ratio: 2) {
  .background {
    background-image: url('image-2x.png');
    background-size: 50%;
  }
}
```

### 4. **SVG Images**
- Scalable to any resolution
- Smallest file size for icons and logos
- Vector format ideal for web

```css
.icon {
  background-image: url('icon.svg');
}
```

## Comparison Table

| Method | Browser Support | Simplicity | Formats | Responsive | Recommended Use |
|--------|:---:|:---:|:---:|:---:|---------|
| `image-set()` | ~87% | Medium | Yes | Yes | Modern CSS background images |
| `<picture>` + `srcset` | ~98% | Medium | Yes | Yes | HTML content images (preferred) |
| `<img srcset>` | ~98% | Simple | No | Yes | Simple responsive images |
| Media Queries | ~100% | Complex | No | Yes | Legacy/maximum compatibility |
| SVG | ~98% | Simple | No | Yes | Icons, logos, vector graphics |

## Performance Considerations

### Bandwidth Savings
- **1x vs 2x:** Up to 300-400% less bandwidth on standard displays
- **Format negotiation:** 20-40% additional savings with WebP/AVIF
- **Mobile data:** Crucial for users on metered connections

### Optimization Strategies

1. **Image Optimization**
   - Optimize all variants (compress, resize, format)
   - Use modern formats (WebP, AVIF) with fallbacks
   - Consider lazy loading for below-the-fold images

2. **File Naming Convention**
   ```
   icon.png           (1x standard)
   icon-2x.png        (2x retina)
   icon-3x.png        (3x ultra-high DPI)
   icon.webp          (1x WebP format)
   icon-2x.webp       (2x WebP format)
   ```

3. **Caching Strategy**
   - Use cache busting for image updates
   - Set appropriate `Cache-Control` headers
   - Consider CDN distribution for images

## Testing and Detection

### Feature Detection

```javascript
/* CSS.supports() method */
const supported = CSS.supports('background-image: image-set(url(test.png) 1x)');
console.log('image-set support:', supported);
```

### Manual Testing

```css
/* Test support */
.test {
  background-image: url('fallback.png'); /* Fallback */
  background-image: image-set(
    url('test1x.png') 1x,
    url('test2x.png') 2x
  );
  width: 100px;
  height: 100px;
  border: 1px solid red;
}
```

### Browser DevTools
- Inspect computed styles to verify which image is selected
- Check Network tab to confirm correct image is downloaded
- Test with device emulation and different pixel ratios

## Related Standards and Features

### Related W3C Specifications
- [CSS Images Module Level 3](https://www.w3.org/TR/css-images-3/) - Previous version with `image()` notation
- [CSS Images Module Level 4](https://w3c.github.io/csswg-drafts/css-images-4/) - Current spec with `image-set()`
- [Responsive Images](https://html.spec.whatwg.org/multipage/embedded-content.html#responsive-images) - HTML picture/srcset spec
- [CSS Media Queries](https://www.w3.org/TR/mediaqueries-5/) - For device-specific selection

### Related CSS Features
- `image()` notation - Similar function with fallback support
- `url()` function - Basic image reference
- `linear-gradient()`, `radial-gradient()` - For background images
- Media queries with `device-pixel-ratio`

### Related HTML Features
- `<picture>` element - HTML-based responsive images
- `<img srcset>` attribute - Simple responsive image syntax
- `<source>` element - Format negotiation

## Web Platform Tests

- [W3C Web Platform Tests](https://wpt.fyi/results/css/css-images/image-set/image-set-parsing.html) - Official conformance tests
- Covers parsing, resolution selection, and format handling

## Issue Tracking

### Implementation Bugs

| Browser | Issue | Status |
|---------|-------|--------|
| **Firefox** | [Bug 1696314](https://bugzilla.mozilla.org/show_bug.cgi?id=image-set) - Full implementation and generated images support | Open/In Progress |
| **Chromium** | [Issue 630597](https://bugs.chromium.org/p/chromium/issues/detail?id=630597) - Update and unprefix image-set() | Open/In Progress |
| **WebKit** | [Bug 225185](https://bugs.webkit.org/show_bug.cgi?id=225185) - Support type() function | Open/In Progress |

## Migration Guide

### From Multiple Background Rules

**Before (Media Queries):**
```css
.image {
  background-image: url('image.png');
}

@media (min-device-pixel-ratio: 2) {
  .image {
    background-image: url('image-2x.png');
    background-size: 50%;
  }
}
```

**After (image-set):**
```css
.image {
  background-image: image-set(
    url('image.png') 1x,
    url('image-2x.png') 2x
  );
}
```

### From `<picture>` to CSS

**Keep using `<picture>` for:**
- Content images (use `<img>`)
- Art direction requirements
- Maximum compatibility needs

**Use `image-set()` for:**
- Background images
- Decorative images
- Modern browser targeting (87%+ coverage)

## Caniuse References

- **Feature ID:** css-image-set
- **Chrome Platform Status:** 5432024223449088
- **Global Support:** 86.26% (with ~6.87% additional partial support)
- **Last Updated:** December 2024

## Examples in the Wild

### Real-World Implementation Pattern

```css
/* Comprehensive production-ready pattern */
.hero-section {
  /* Fallback for very old browsers */
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
              url('hero-default.jpg') center/cover;

  /* Modern browsers with full image-set support */
  background-image:
    linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
    image-set(
      url('hero-avif.avif') type('image/avif') 1x,
      url('hero-avif-2x.avif') type('image/avif') 2x,
      url('hero-webp.webp') type('image/webp') 1x,
      url('hero-webp-2x.webp') type('image/webp') 2x,
      url('hero.jpg') type('image/jpeg') 1x,
      url('hero-2x.jpg') type('image/jpeg') 2x
    );

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  height: 500px;
}

@media (max-width: 768px) {
  .hero-section {
    background-attachment: scroll;
    height: 300px;
  }
}
```

## Summary

CSS `image-set()` is a modern, CSS-native way to serve resolution-appropriate images without requiring HTML changes. While support has reached critical mass (87% globally), careful consideration of fallbacks and browser limitations is still necessary for production use. The feature pairs well with modern image formats (WebP, AVIF) and progressive enhancement strategies. For maximum compatibility and support, consider complementing `image-set()` usage with HTML-based solutions like `<picture>` and `srcset` attributes.

### Key Takeaways
- **Use `image-set()`** for background images with excellent modern browser support
- **Provide fallbacks** for the ~13% of browsers without full support
- **Test thoroughly** across devices and pixel ratios
- **Optimize images** in all served formats and resolutions
- **Monitor support** as WebKit adoption improves
