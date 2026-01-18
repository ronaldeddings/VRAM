# HEVC/H.265 Video Format

## Overview

**HEVC** (High Efficiency Video Coding), also known as **H.265**, is a modern video compression standard designed to succeed the widely-used H.264 codec. It offers significantly improved compression efficiency, enabling better video quality at lower bitrates compared to its predecessor.

## Description

HEVC is a next-generation video codec that provides substantial improvements in compression technology. However, widespread browser adoption has been limited due to two primary factors:

1. **Complex Licensing Requirements**: HEVC involves intricate patent licensing agreements that make it expensive and complicated for browser vendors to support
2. **Competing Standards**: The emergence of royalty-free alternatives like [AV1](/av1) provides comparable compression quality without the licensing burden

As a result, HEVC support remains fragmented across web browsers, with adoption primarily limited to Safari and certain mobile platforms where hardware acceleration is available.

## Specification

- **Standards Body**: ITU-T (International Telecommunication Union - Telecommunication Standardization Sector)
- **Specification URL**: [ITU-T H.265 Recommendation](https://www.itu.int/rec/T-REC-H.265)
- **Status**: Other (not a W3C/WHATWG standard)

## Categories

- Video Codecs & Formats

## Key Benefits & Use Cases

### Benefits
- **Superior Compression**: 50% better compression efficiency compared to H.264
- **Lower Bitrates**: Maintain equivalent quality at half the bandwidth
- **Mobile Efficiency**: Reduced data consumption and improved battery life on mobile devices
- **4K/8K Ready**: Better suited for ultra-high-resolution content delivery

### Use Cases
- Streaming services on Apple platforms (iOS, macOS, tvOS)
- Mobile video delivery on iOS and Android devices with hardware support
- Professional video production and archival
- Surveillance and security systems
- Bandwidth-constrained delivery scenarios

## Browser Support

### Support Legend
- **Y**: Full support
- **A**: Partial/Alternative support (hardware-dependent)
- **N**: Not supported
- **D**: Disabled by default

### Major Browsers

| Browser | Status | First Support | Notes |
|---------|--------|---------------|-------|
| **Safari** | ✅ Yes | 13.0 | Full support on macOS 10.13+ and iOS 11.0+ |
| **Chrome** | ⚠️ Partial | 107 | Hardware acceleration only; see notes |
| **Edge** | ⚠️ Partial | 12 (partial), 79+ (full) | Requires hardware support and OS dependencies |
| **Firefox** | ❌ No | N/A | No native browser support; OS API access in 137+ |
| **Opera** | ⚠️ Partial | 94 | Hardware acceleration on supported devices |
| **iOS Safari** | ✅ Yes | 11.0 | Full support on iOS 11.0+ |
| **Android Chrome** | ⚠️ Partial | 142 | Hardware acceleration on compatible devices |
| **Samsung Internet** | ✅ Yes | 21 | Full support on Samsung Galaxy devices |

### Desktop Browsers (Latest Versions)

| Browser | Version | Support | Conditions |
|---------|---------|---------|------------|
| Chrome | 146 | Partial | Hardware acceleration required |
| Edge | 143 | Partial | Hardware acceleration + OS requirements |
| Firefox | 148 | Partial | OS API access (hardware support needed) |
| Safari | 18.2+ | Full | Native support on macOS |
| Opera | 122 | Partial | Hardware acceleration required |

### Mobile Browsers

| Browser | Version | Support | Conditions |
|---------|---------|---------|------------|
| iOS Safari | 18.5+ | Full | All iOS 11.0+ devices |
| Android Chrome | 142+ | Partial | Hardware acceleration required |
| Android Firefox | 144+ | Partial | Hardware support needed |
| Samsung Internet | 29 | Full | Samsung Galaxy devices |
| Baidu | 13.52+ | Full | Full support |

### Unsupported Browsers

- Opera Mini (all versions)
- Older Firefox versions (119 and below)
- Internet Explorer (all versions except IE 11 with hardware support)

## Support Details by Platform

### macOS
- **Safari**: Full support since macOS 10.13
- **Chrome/Edge**: Hardware acceleration available with system libraries
- **Firefox**: Requires explicit opt-in via `media.wmf.hevc.enabled` preference

### iOS & iPadOS
- **Safari**: Native support since iOS 11.0
- **All browsers**: Limited to native OS video capabilities
- Full support on iOS 11.0 and later

### Windows
- **Edge**: Requires Windows 10 1709+ with hardware support
- Optional: Install "HEVC Video Extension" from Microsoft Store
- **Firefox**: Nightly builds only with hardware support
- **Chrome**: Requires compatible hardware and drivers

### Android
- **Chrome**: Hardware acceleration for compatible devices
- **Firefox**: Available with hardware support
- **Samsung Internet**: Full support on Samsung devices from version 21+
- Most devices require hardware HEVC decoder

### Linux
- **Chromium-based**: VAAPI hardware acceleration support available
- No general support in Firefox

## Technical Notes

### Hardware Acceleration
Most HEVC support across browsers relies on hardware acceleration:
- Requires compatible GPU with HEVC decoding capabilities
- Performance varies significantly by device and hardware
- Software decoding implementation limited or unavailable

### Feature Limitations
- **Chrome/Edge**: 10-bit and higher color depths not universally supported
- **Firefox Nightly**: 10-bit colors not supported in early implementations
- **Platform Dependencies**: Support varies based on OS-level video framework availability

### Patent Licensing
- HEVC is covered by multiple patent pools (HEVC Advance, Velos Media, etc.)
- Complexity and cost of licensing has discouraged some browser vendors
- Free alternatives (VP9, AV1) have affected adoption rates

### Alternative Codecs

Consider these alternatives for better cross-browser support:

- **H.264 (AVC)**: Widely supported, but older technology
- **VP9**: Open-source, good compression, widespread support
- **AV1**: Modern, royalty-free, excellent compression; increasing browser support
- **VP8**: Open format, broad compatibility, less efficient compression

## Common Implementation Notes

### Detection
```javascript
const video = document.createElement('video');
const canPlayHevc = video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"');
// Returns: "probably", "maybe", or ""
```

### When to Use HEVC
- ✅ Primarily for iOS and Safari-based delivery
- ✅ When hardware acceleration is guaranteed
- ⚠️ As secondary format with fallback to H.264 or VP9
- ❌ Not recommended as sole video format for broad web deployment

### Fallback Strategy
Recommend using `<video>` element with multiple sources:
```html
<video controls>
  <source src="video.mp4" type="video/mp4; codecs=hev1">
  <source src="video-h264.mp4" type="video/mp4; codecs=avc1">
  <source src="video-vp9.webm" type="video/webm; codecs=vp9">
  Your browser does not support HTML5 video.
</video>
```

## Global Usage Statistics

- **Full Support**: 12.57%
- **Partial Support**: 77.96%
- **No Support**: 9.47%

The high partial support percentage reflects hardware-dependent implementations across mobile platforms and Windows systems with compatible hardware.

## Related Resources

### Official Documentation
- [ITU-T H.265 Specification](https://www.itu.int/rec/T-REC-H.265)
- [Mozilla Developer Network - HEVC/H.265](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs#hevc_h.265)
- [Wikipedia - High Efficiency Video Coding](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)

### Browser Implementation Issues
- [Firefox Support Status (WontFix)](https://bugzilla.mozilla.org/show_bug.cgi?format=default&id=1332136)
- [Chrome Support Status (WontFix)](https://bugs.chromium.org/p/chromium/issues/detail?id=684382)
- [Firefox OS API Support Discussion](https://bugzilla.mozilla.org/show_bug.cgi?id=1842838)

### Related Features
- [AV1 Video Format](/av1) - Modern alternative with royalty-free licensing
- [H.264 Video Format](/h264) - Predecessor codec with broader support
- [VP9 Video Format](/vp9) - Open-source alternative codec
- [WebM Format](/webm) - Royalty-free container with VP8/VP9 codecs

## Implementation Considerations

### For Content Providers
1. **Primary Format**: Use HEVC for iOS-first strategies
2. **Transcoding**: Maintain H.264 versions for broader compatibility
3. **Bandwidth Savings**: Expect 30-50% bitrate reduction vs H.264
4. **Testing**: Verify hardware support on target devices before deployment

### For Web Developers
1. **Always Include Fallback**: Never serve HEVC as the only video source
2. **Test Across Devices**: Hardware support varies significantly
3. **Check Capabilities**: Use `canPlayType()` to detect support
4. **Monitor Adoption**: Track user agent and device capabilities

### Browser Vendor Perspectives

**Apple (Safari)**: Strong support via native macOS/iOS frameworks
**Google (Chrome)**: Limited to hardware acceleration; licensing concerns cited
**Mozilla (Firefox)**: Exploring OS-level API access; full browser support unlikely
**Microsoft (Edge)**: Full support with hardware acceleration and OS requirements

---

**Last Updated**: 2025
**Data Source**: CanIUse Feature Database
**License**: Documentation provided for reference purposes
