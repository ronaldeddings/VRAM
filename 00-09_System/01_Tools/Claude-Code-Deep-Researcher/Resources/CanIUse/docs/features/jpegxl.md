# JPEG XL Image Format

## Overview

JPEG XL is a modern image format optimized for web environments. It generally offers better compression than WebP, JPEG, PNG, and GIF, and is designed to supersede them. JPEG XL competes with AVIF, which has similar compression quality but fewer features overall.

**File Extension:** `.jxl`

**MIME Type:** `image/jxl`

## Specification Status

- **Status:** Other (Non-W3C Standard)
- **Specification:** [JPEG XL Documentation](https://jpeg.org/jpegxl/documentation.html)

## Key Features & Benefits

### Use Cases

JPEG XL is ideal for the following scenarios:

- **Web Image Optimization** - Superior compression compared to legacy formats (JPEG, PNG, GIF)
- **High-Quality Photography** - Maintains excellent visual quality at smaller file sizes
- **Animated Content** - Supports animated image sequences for modern web applications
- **Lossless Compression** - Offers both lossy and lossless compression options
- **Progressive Decoding** - Better user experience with progressive image loading
- **Format Compatibility** - Can contain JPEG data for backward compatibility

### Advantages

- Better compression efficiency than JPEG, PNG, WebP, and GIF
- Supports both lossy and lossless compression
- Progressive decoding capabilities
- Animated image sequence support
- Designed as a universal image codec replacement
- Superior feature set compared to AVIF

## Browser Support

### Support Status Legend

- **✅ Supported** - Full support for the feature
- **⚠️ Partial** - Partial support (see notes for details)
- **🚩 Disabled** - Supported but requires a flag or preference to enable
- **❌ Not Supported** - No support for the feature
- **⏳ Under Development** - Feature in development

### Desktop Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 91-109 | 🚩 | Can be enabled via `enable-jxl` flag |
| Chrome | 110+ | ❌ | No support |
| Firefox | 90-148 | 🚩 | Can be enabled via `image.jxl.enabled` flag in `about:config` (Nightly only) |
| Safari | 17.0+ | ⚠️ | Partial support - still images only; animated sequences not supported; progressive decoding not supported |
| Edge | 91-109 | 🚩 | Can be enabled via `--enable-features=JXL` runtime flag |
| Edge | 110+ | ❌ | No support |
| Opera | 77-95 | 🚩 | Can be enabled via `enable-jxl` flag |
| Opera | 96+ | ❌ | No support |

### Mobile Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| iOS Safari | 17.0+ | ⚠️ | Partial support - still images only; animated sequences not supported; progressive decoding not supported |
| Android Chrome | 142 | ❌ | No support |
| Android Firefox | 144 | ❌ | No support |
| Samsung Internet | 4-29 | ❌ | No support |
| UC Browser | 15.5 | ❌ | No support |
| QQ Browser | 14.9 | ❌ | No support |
| Baidu Browser | 13.52 | ❌ | No support |

### Legacy & Other Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Internet Explorer | All | ❌ |
| Opera Mini | All | ❌ |
| Blackberry | All | ❌ |
| Opera Mobile | All | ❌ |
| IE Mobile | All | ❌ |
| KaiOS | All | ❌ |

## Current Support Summary

**Global Usage:** ~9.07% with partial/alpha support

- **Full Support:** ⚠️ Safari 17.0+ and iOS Safari 17.0+ (partial - still images only)
- **Development/Flagged:** Chrome 91-109, Firefox 90+, Edge 91-109, Opera 77-95
- **Widespread Adoption:** Not yet widely supported across browsers

## Technical Notes

### Important Limitations

| Note # | Description |
|--------|-------------|
| 1 | Can be enabled via the `enable-jxl` flag in Chromium-based browsers (Chrome, Edge, Opera) |
| 2 | Can be enabled via the `image.jxl.enabled` flag in `about:config` in Firefox Nightly only. This flag is configurable but has no effect in other Firefox builds. |
| 3 | Can be enabled via the `--enable-features=JXL` runtime flag for Edge |
| 4 | ⚠️ **Still Images Only** - Safari and iOS Safari support still images. Animated image sequences are NOT supported. |
| 5 | **No Progressive Decoding** - Partial support in Safari/iOS Safari refers to not supporting progressive decoding. |

## Comparison with Other Formats

| Format | Compression | Lossless | Animated | Browser Support | Status |
|--------|-------------|----------|----------|-----------------|--------|
| **JPEG XL** | Excellent | Yes | Yes | Limited | Emerging |
| AVIF | Excellent | Yes | Yes | Growing | More support |
| WebP | Good | Yes | Yes | Excellent | Widely supported |
| PNG | Moderate | Yes | Limited | Excellent | Widely supported |
| JPEG | Moderate | No | No | Universal | Legacy |
| GIF | Poor | No | Yes | Universal | Legacy |

## Implementation Recommendations

### Progressive Enhancement

Due to limited browser support, implement JPEG XL with fallbacks:

```html
<picture>
  <source srcset="image.jxl" type="image/jxl">
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### When to Use JPEG XL

- **For modern applications targeting Safari 17+** on iOS and macOS
- **In conjunction with fallback formats** for other browsers
- **For new projects** where browser support is acceptable
- **Alongside AVIF and WebP** as part of a progressive enhancement strategy

### When to Avoid

- **For universal browser support** - Adoption is still limited
- **Without proper fallback formats** - Most browsers don't support it
- **In production** without comprehensive testing across target browsers

## References & Resources

### Official Links

- [JPEG XL Official Website](https://jpeg.org/jpegxl/index.html)
- [JPEG XL Documentation](https://jpeg.org/jpegxl/documentation.html)
- [Comparison to Other Image Codecs](https://cloudinary.com/blog/how_jpeg_xl_compares_to_other_image_codecs)

### Browser Support Tracking

- [Chromium Support Issue](https://crbug.com/1178058)
- [Firefox Support Issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1539075)
- [WebKit Support Issue](https://bugs.webkit.org/show_bug.cgi?id=208235)
- [Mozilla Standards Position Request](https://github.com/mozilla/standards-positions/issues/522)
- [2024 Mozilla Standards Position Update](https://github.com/mozilla/standards-positions/pull/1064)

## Related Features

- [WebP Image Format](/webp)
- [AVIF Image Format](/avif)
- [PNG Image Format](/png)
- [Modern Image Formats Overview](/images)

---

*Last Updated: December 2024*
*Data Source: CanIUse Database*
