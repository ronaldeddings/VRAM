# Brotli Accept-Encoding/Content-Encoding

## Overview

Brotli is a modern lossless compression algorithm developed by Google that provides significantly better compression rates compared to traditional gzip and deflate algorithms. It is designed for use with HTTP content negotiation through the `Accept-Encoding` and `Content-Encoding` headers.

## Description

More effective lossless compression algorithm than gzip and deflate. Brotli achieves better compression ratios with comparable decompression speeds, making it ideal for optimizing content delivery on the web.

## Specification

**Status:** ![Other](https://img.shields.io/badge/status-other-blue)

**RFC:** [RFC 7932 - Brotli Compressed Data Format](https://tools.ietf.org/html/rfc7932)

## Categories

- Other (Network & Compression)

## Benefits and Use Cases

### Performance Optimization
- **Better Compression Ratios:** Typically 15-20% better compression than gzip for JavaScript, CSS, and HTML
- **Reduced Bandwidth:** Smaller file sizes mean faster downloads and reduced server bandwidth consumption
- **Improved User Experience:** Faster page loads, especially on slower connections

### Ideal For
- Large JavaScript bundles
- Stylesheets and CSS files
- HTML documents
- JSON APIs and responses
- Text-based assets

### Server-Side Implementation
- Web servers and hosting providers can automatically compress responses using Brotli
- Requires client browser support through HTTP content negotiation
- Can be used alongside gzip as a fallback for older browsers

### When to Use Brotli vs. Gzip
- **Use Brotli:** Modern browsers, optimized content delivery, maximum compression benefit
- **Use Gzip:** Legacy browser support needed, backward compatibility required
- **Use Both:** Content negotiation allows servers to serve Brotli to capable browsers and gzip to others

## Browser Support

### Support Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 50 | ✅ Full Support (27 May 2016) |
| Firefox | 44 | ✅ Full Support |
| Edge | 15 | ✅ Full Support |
| Safari | 13 | ✅ Full Support |
| Opera | 38 | ✅ Full Support |
| Safari on iOS | 11 | ✅ Full Support (macOS 10.13+) |
| Android | 142+ | ✅ Full Support |

### Desktop Browsers

#### Chrome
- **Full Support:** Chrome 50+ (since May 27, 2016)
- **Partial Support:** Chrome 49 (behind feature flag: "Brotli Content-Encoding")
- **No Support:** Chrome 4-48

#### Firefox
- **Full Support:** Firefox 44+
- **No Support:** Firefox 2-43

#### Edge
- **Full Support:** Edge 15+ (includes all modern versions)
- **No Support:** Edge 12-14

#### Safari
- **Full Support:** Safari 13+
- **Partial Support:** Safari 11-12 (requires macOS 10.13 High Sierra or later)
- **No Support:** Safari 3.1-10

#### Opera
- **Full Support:** Opera 38+
- **Partial Support:** Opera 36-37 (behind feature flag: "Brotli Content-Encoding")
- **No Support:** Opera 9-35

### Mobile Browsers

#### iOS Safari
- **Full Support:** iOS 11+ (requires iOS 11.0-11.2 or later)
- **No Support:** iOS 3.2-10.3

#### Android Browser
- **Full Support:** Android 142+
- **No Support:** Android 2.1-141

#### Chrome on Android
- **Full Support:** Chrome on Android 142+

#### Firefox on Android
- **Full Support:** Firefox on Android 144+

#### Opera Mobile
- **Full Support:** Opera Mobile 80+
- **No Support:** Opera Mobile 10-79

#### Samsung Internet
- **Full Support:** Samsung Internet 5.0+

#### Other Mobile Browsers
- **UC Browser:** Full support from version 15.5+
- **Opera Mini:** No support (all versions)
- **QQ Browser:** Full support from version 14.9+
- **Baidu Browser:** Full support from version 13.52+
- **KaiOS Browser:** Full support from version 2.5+

## Global Usage Statistics

- **Supported:** 93.05% of users
- **Partial Support:** 0%

## Known Issues and Notes

### Implementation Notes

1. **Chrome 49:** Brotli support was available behind the "Brotli Content-Encoding" feature flag before being enabled by default in Chrome 50

2. **Safari/iOS Safari:** Support starting with macOS 10.13 High Sierra (Safari 11) and iOS 11.0+. Earlier versions do not support Brotli compression.

3. **Content Negotiation:** Servers should check the `Accept-Encoding` header to determine if the client supports Brotli and fall back to gzip for unsupported browsers

4. **Internet Explorer:** No support in any version (IE 5.5-11)

5. **Legacy Mobile Browsers:** Opera Mini and older BlackBerry browsers do not support Brotli

## Implementation Guide

### Server Configuration

#### Apache
Use the `brotli` module to enable Brotli compression:

```apache
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_FILTER text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

#### Nginx
Use the `ngx_brotli` module:

```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/html text/plain text/xml text/css text/javascript application/javascript application/json;
```

### Content Negotiation

Servers should support content negotiation by:

1. Checking the `Accept-Encoding` header for "br" (Brotli)
2. Compressing content with Brotli if supported
3. Setting `Content-Encoding: br` in the response header
4. Falling back to `gzip` or uncompressed content for unsupported clients

### Quality Levels

Brotli supports compression quality levels 0-11:
- **Levels 0-2:** Fast compression, lower compression ratio
- **Levels 3-9:** Balanced compression and performance (recommended: 6)
- **Levels 10-11:** Maximum compression, slower

## Related Links

- **[Introducing Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html)** - Official announcement from Google
- **[Blink's Intent to Ship](https://groups.google.com/a/chromium.org/forum/m/#!msg/blink-dev/JufzX024oy0/WEOGbN43AwAJ)** - Chrome implementation details
- **[Official Brotli Repository](https://github.com/google/brotli)** - Source code and documentation
- **[WebKit Bug 154859](https://bugs.webkit.org/show_bug.cgi?id=154859)** - Safari/WebKit implementation tracker

## Recommendations

### For Modern Web Applications
- **Recommended:** Enable Brotli compression on production servers
- **Fallback:** Always configure gzip as a fallback for older browsers
- **Testing:** Test content negotiation to ensure proper compression selection

### Browser Support Considerations
- Current support is excellent (93.05% globally)
- Primary gap is Internet Explorer (completely unsupported) and some legacy mobile browsers
- For most modern applications, Brotli should be considered a standard optimization

### Optimization Tips
1. Pre-compress static assets (CSS, JS) with Brotli at level 11 during build time
2. Use dynamic compression with level 6 for on-the-fly compression
3. Monitor compression metrics to ensure optimal quality level selection
4. Always provide gzip fallback in Accept-Encoding negotiation

---

*Last Updated: December 2024*
*Data Source: Can I Use - Brotli Accept-Encoding/Content-Encoding*
