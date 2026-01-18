# AVIF Image Format

## Overview

AVIF (AV1 Image File Format) is a modern image format based on the [AV1 video codec](/av1). It provides superior compression compared to WebP, JPEG, PNG, and GIF, making it an excellent choice for next-generation web images. AVIF is designed to be a successor to these traditional formats and offers competitive compression with [JPEG XL](/jpegxl), though JPEG XL is considered more feature-rich.

## Specification

- **Specification**: [AV1 Image Format Specification](https://aomediacodec.github.io/av1-avif/)
- **Status**: Other (Emerging Standard)
- **Standards Body**: [Alliance for Open Media (AOM)](https://aomediacodec.github.io/)

## Benefits and Use Cases

### Key Advantages

- **Superior Compression**: AVIF typically achieves 20-50% better file size reduction compared to JPEG at the same quality level
- **Modern Format**: Built on modern codec technology (AV1), ensuring future compatibility and optimization
- **Quality Preservation**: Maintains excellent visual quality at smaller file sizes
- **Transparency Support**: Supports both lossy and lossless compression with optional alpha channels
- **Web-Optimized**: Designed specifically for modern web delivery and responsive images

### Ideal Use Cases

- High-quality product photography in e-commerce applications
- Hero images and banner graphics on landing pages
- Performance-critical websites aiming to reduce bandwidth consumption
- Mobile-first applications where file size directly impacts user experience
- Situations where CDN bandwidth costs are a significant concern
- Responsive image implementations using `<picture>` elements

## Browser Support

### Support Matrix

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| **Chrome** | 85 | Full support; enabled by default |
| **Edge** | 121 | Full support; enabled by default |
| **Firefox** | 93 | Full support for still images (v93+); animated sequences supported from v113+ |
| **Safari** | 16.4 | Full support on macOS 13+; partial support (16.1-16.3) with limitations |
| **Opera** | 71 | Full support; follows Chromium engine |
| **Samsung Internet** | 14.0 | Full support |
| **iOS Safari** | 16.0 | Partial support (16.0-16.3) with limitations; full support from 16.4+ |

### Support Status Summary

**Global Support**: ~91.6% of users can view AVIF images (as of latest data)

#### Desktop Browsers

| Browser | Status | Version | Details |
|---------|--------|---------|---------|
| Chrome | ✅ Full | 85+ | Complete AVIF support |
| Edge | ✅ Full | 121+ | Complete AVIF support |
| Firefox | ✅ Full | 113+ | Still images from 93+; animated sequences from 113+ |
| Safari | ✅ Full | 16.4+ | macOS 13+ required |
| Opera | ✅ Full | 71+ | Complete AVIF support |
| Internet Explorer | ❌ Not Supported | N/A | No support across all versions |

#### Mobile Browsers

| Browser | Status | Version | Details |
|---------|--------|---------|---------|
| Chrome Mobile | ✅ Full | Latest | Complete AVIF support |
| Firefox Mobile | ✅ Full | Latest | Complete AVIF support |
| Safari iOS | ✅ Full | 16.4+ | Partial support (16.0-16.3) with limitations |
| Samsung Internet | ✅ Full | 14.0+ | Complete AVIF support |
| Opera Mobile | ✅ Full | 80+ | Complete AVIF support |
| UC Browser | ✅ Full | 15.5+ | Complete AVIF support |

### Platform-Specific Notes

#### Firefox Notes

| Status | Versions | Details |
|--------|----------|---------|
| **Disabled by Default** | 77-92 | Can be enabled via `image.avif.enabled` pref in `about:config` |
| **Still Images Only** | 93-112 | Supports still images; animated sequences disabled by default |
| **Animation Support Option** | 111-112 | Animated sequences can be enabled via `image.avif.sequence.enabled` pref in `about:config` |
| **Full Support** | 113+ | Complete AVIF support including animated sequences |

#### Safari Notes

| Version | Status | Limitations |
|---------|--------|------------|
| 16.1-16.3 | Partial (⚠️) | Still images only; no animated sequences; macOS 13+ required; no noise synthesis support |
| 16.4+ | Full ✅ | Complete AVIF support |

#### iOS Safari Notes

| Version | Status | Details |
|---------|--------|---------|
| 16.0-16.3 | Partial ⚠️ | Still images supported; animated sequences not supported; no noise synthesis support |
| 16.4+ | Full ✅ | Complete AVIF support |

#### Microsoft Edge Notes

| Version | Status | Details |
|---------|--------|---------|
| 114-117 | Partial ⚠️ | Can be enabled via `--enable-features=msEdgeAVIF` runtime flag in insider channels |
| 121+ | Full ✅ | Complete AVIF support enabled by default |

## Browser Support Chart

```
Chrome          ████████████████████████ 85 (100%)
Edge            ███████████ 121 (100%)
Firefox         ██████████████████████ 113 (100%)
Safari          █████████████ 16.4 (100%)
Opera           ██████████ 71 (100%)
Samsung         ████████ 14.0 (100%)

Legacy/Unsupported:
IE              ░░░░░░░░░░ None (0%)
Opera Mini      ░░░░░░░░░░ None (0%)
```

## Implementation Guide

### Basic HTML Usage

```html
<!-- Simple image with AVIF fallback -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description">
</picture>

<!-- Multiple format support -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>

<!-- Responsive images with AVIF -->
<picture>
  <source media="(min-width: 768px)" srcset="image-large.avif" type="image/avif">
  <source media="(min-width: 768px)" srcset="image-large.jpg" type="image/jpeg">
  <source srcset="image-small.avif" type="image/avif">
  <img src="image-small.jpg" alt="Description">
</picture>
```

### CSS Background Images

```css
/* AVIF with fallback */
.hero {
  background-image: url('image.avif');
}

/* With fallback for older browsers */
@supports (background-image: url('image.avif')) {
  .hero {
    background-image: url('image.avif');
  }
}

/* Fallback for unsupported browsers */
.hero {
  background-image: url('image.jpg');
}
```

### JavaScript Detection

```javascript
// Check AVIF support
function supportsAVIF() {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/avif').indexOf('image/avif') === 5;
  }
  return false;
}

// Alternative using canvas
function checkAVIFSupport() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    canvas.toDataURL('image/avif');
    return true;
  } catch {
    return false;
  }
}
```

## Conversion and Optimization

### Creating AVIF Files

Popular tools for converting to AVIF:

- **FFmpeg**: `ffmpeg -i input.jpg -c:v libaom-av1 -crf 30 output.avif`
- **ImageMagick**: `convert input.jpg -quality 50 output.avif`
- **libavif**: High-quality encoding library
- **CloudFlare/Squoosh**: Online converters with AVIF support
- **Avifenc**: Official AOM encoder

### Optimization Best Practices

1. **Lossy vs. Lossless**: Use lossy encoding for photographs (smaller files), lossless for graphics
2. **Quality Settings**: Use CRF 23-32 for lossy compression (similar to JPEG 70-85)
3. **Encoding Speed**: Balance quality and encoding time with `-speed` parameter (0-10)
4. **Metadata**: Strip unnecessary metadata to reduce file size

## Known Limitations and Bugs

### Current Limitations

1. **Animated AVIF Support**: Not fully supported in all browsers
   - Firefox: Requires explicit enabling via `about:config` (v113+)
   - Safari: Supports only still images

2. **Safari Limitations** (versions 16.1-16.3)
   - Still images only
   - Requires macOS 13 Ventura or later
   - No support for noise synthesis
   - No animated AVIF sequences

3. **Encoding Complexity**: AVIF encoding is computationally expensive compared to JPEG
   - Slower encoding times
   - Higher CPU usage during conversion

4. **Browser Feature Support**: Not all browsers support all AVIF features
   - Limited support for advanced color spaces
   - Inconsistent animation handling

### Bug Tracking

- **Safari Support**: [WebKit Bug #207750](https://bugs.webkit.org/show_bug.cgi?id=207750)
- **Firefox Animations**: [Mozilla Bug #1686338](https://bugzilla.mozilla.org/show_bug.cgi?id=1686338)

## Comparison with Other Formats

| Format | Compression | Quality | Browser Support | Use Case |
|--------|------------|---------|-----------------|----------|
| **AVIF** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent | ~92% | Modern web images |
| **JPEG XL** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent | ~5% | Future-proof (low adoption) |
| **WebP** | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good | ~97% | Wide compatibility |
| **JPEG** | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Good | ~100% | Universal fallback |
| **PNG** | ⭐⭐ Fair | ⭐⭐⭐⭐⭐ Perfect | ~100% | Lossless/transparency |
| **GIF** | ⭐ Poor | ⭐⭐⭐ Fair | ~100% | Animation (legacy) |

## Resources and Tools

### Documentation and Articles

- **[AVIF for Next-Generation Image Coding](https://netflixtechblog.com/avif-for-next-generation-image-coding-b1d75675fe4)** - Netflix Tech Blog: Comprehensive overview of AVIF benefits and implementation

### Polyfills and Libraries

- **[avif.js](https://github.com/Kagami/avif.js)** - JavaScript polyfill for AVIF support in older browsers

### Related Web Technologies

- [AV1 Video Codec](/av1) - The underlying video codec technology
- [JPEG XL](/jpegxl) - Alternative modern image format
- [WebP](/webp) - Previous generation modern image format

## Migration Strategy

### For New Projects

1. Use AVIF as primary format with `<picture>` element
2. Include WebP as secondary format
3. Use JPEG as final fallback for maximum compatibility

### For Existing Sites

1. Gradually convert high-traffic images to AVIF
2. Implement progressive enhancement using `<picture>`
3. Monitor analytics for browser support
4. Phase out JPEG once browser support reaches 95%+

## Recommendations

- **High-Priority**: Implement AVIF for hero images and product photography (80-90% of data transfer)
- **Medium-Priority**: Convert frequently-viewed content images
- **Low-Priority**: Legacy content and rarely-viewed images (consider JPEG/WebP)

As of the latest data, AVIF support has reached **91.6% global coverage**, making it viable for most modern web applications. Combining AVIF with strategic fallbacks ensures excellent user experience across all browsers.

---

**Last Updated**: 2025-12-13
**Data Source**: [Can I Use - AVIF Image Format](https://caniuse.com/avif)
