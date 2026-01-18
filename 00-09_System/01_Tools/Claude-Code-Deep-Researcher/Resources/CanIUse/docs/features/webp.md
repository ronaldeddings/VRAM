# WebP Image Format

## Overview

WebP is a modern image format developed by Google that supports both lossy and lossless compression, animation, and alpha transparency. It is designed to supersede older image formats including JPEG, PNG, and GIF while offering superior compression ratios and better quality at smaller file sizes.

## Description

Image format (based on the VP8 video format) that supports lossy and lossless compression, as well as animation and alpha transparency. WebP generally has better compression than JPEG, PNG and GIF and is designed to supersede them. [AVIF](/avif) and [JPEG XL](/jpegxl) are designed to supersede WebP.

## Specification Status

**Status:** Other
**Specification:** [https://developers.google.com/speed/webp/](https://developers.google.com/speed/webp/)

## Categories

- Other

## Key Features & Benefits

### Format Capabilities
- **Lossy Compression** - Reduces file size with minimal visual quality loss
- **Lossless Compression** - Preserves image quality while reducing file size
- **Animation Support** - Replaces animated GIF with better compression
- **Alpha Transparency** - Supports transparent backgrounds like PNG
- **Superior Compression** - Typically 25-35% smaller than equivalent JPEG/PNG files

### Use Cases & Benefits
- Faster page load times through reduced image file sizes
- Lower bandwidth consumption for image-heavy websites
- Better user experience on mobile devices with limited connectivity
- Improved Core Web Vitals metrics (Largest Contentful Paint)
- Reduced server storage requirements
- Efficient animation alternative to GIF format

## Browser Support

### Support Legend
- **y** = Full support
- **a** = Partial support (see notes)
- **p** = Partial support (legacy)
- **n** = No support

### Desktop Browsers

| Browser | Supported Version | Notes |
|---------|------------------|-------|
| **Chrome** | 32+ | Full support from v32 onwards |
| **Firefox** | 65+ | Full support from v65 onwards |
| **Safari** | 16+ | Full support from v16.0 onwards |
| **Edge** | 18+ | Full support from v18 onwards |
| **Opera** | 19+ | Full support from v19 onwards |
| **Internet Explorer** | None | Not supported in any version |

### Mobile Browsers

| Browser | Supported Version | Notes |
|---------|------------------|-------|
| **iOS Safari** | 14.0+ | Full support (requires macOS 11 Big Sur or later for macOS) |
| **Android Browser** | 4.2+ | Full support from v4.2 onwards |
| **Chrome Android** | 142+ | Full support |
| **Firefox Android** | 144+ | Full support |
| **Samsung Internet** | 4.0+ | Full support from v4.0 onwards |
| **Opera Mobile** | 11.1+ | Full support from v11.1 onwards |
| **Opera Mini** | All versions | Full support |

### Regional/Alternative Browsers

| Browser | Supported Version | Notes |
|---------|------------------|-------|
| **UC Browser Android** | 15.5+ | Full support |
| **QQ Browser Android** | 14.9+ | Full support |
| **Baidu Browser** | 13.52+ | Full support |
| **KaiOS** | 3.0+ | Full support from v3.0 onwards |
| **BlackBerry** | None | Not supported |

### Current Support Coverage
- **Global Usage with Full Support:** 92.67%
- **Global Usage with Partial Support:** 0.14%

## Implementation Notes

### Partial Support Details

**Note #1:** Chrome v9-22 and Opera v11.1-18
- Partial support refers to not supporting lossless, alpha and animated WebP images.
- Only lossy WebP images are supported in these versions.

**Note #2:** Chrome v23-31 and Opera v12-18
- Partial support refers to not supporting animated WebP images.
- Both lossy and lossless formats are supported, but animations are not.

**Note #3:** Safari 14.0 – 15.6 (macOS)
- Has full support of WebP, but requires macOS 11 Big Sur or later.
- Full native support began in Safari 16.0.

### Known Issues

**Microsoft Edge Application Guard Mode Bug:**
WebP images display as a broken image icon in Microsoft Edge v18 when running in Application Guard mode, even when an alternative image source format is available. This is a rendering issue specific to the sandboxed Application Guard environment.

## Implementation Recommendations

### Fallback Strategy

Since WebP support is nearly universal but not 100%, implement fallback strategies:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### Browser Detection

For JavaScript detection, use the Modernizr library or implement feature detection:

```javascript
function canUseWebp() {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp') === 'data:image/webp;base64,UklGRjIAAAAASVNHUkoxAP4AAAAA';
}
```

### Version Compatibility

- **Legacy Support Required (IE, older Safari):** Use PNG/JPEG fallbacks with `<picture>` element
- **Modern Browsers (>95% users):** Safe to serve WebP directly with minimal fallback needs
- **Mobile Support:** Excellent across all modern mobile platforms

## Related Resources

### Official Documentation
- [WebP Official Website](https://developers.google.com/speed/webp/) - Google's WebP documentation and specifications
- [WebP Browser Support FAQ](https://developers.google.com/speed/webp/faq#which_web_browsers_natively_support_webp) - Official FAQ addressing browser support questions
- [WebP Encoder/Decoder](https://github.com/webmproject/libwebp) - libwebp GitHub repository with encoder and decoder source code

### Learning & Guides
- [Bitsofcode: Why and How to Use WebP Images Today](https://bitsofco.de/why-and-how-to-use-webp-images-today/) - Comprehensive guide on WebP implementation

### Related Formats
- [AVIF](/avif) - Next-generation format designed to supersede WebP
- [JPEG XL](/jpegxl) - Another modern format designed to supersede WebP

## Summary

WebP is a mature, widely-supported image format with excellent compression characteristics and universal browser support across modern browsers. With 92.67% global support and nearly universal adoption in current browser versions, WebP is recommended for all new web projects. Simple fallback strategies using the `<picture>` element ensure compatibility with older browsers and edge cases.
