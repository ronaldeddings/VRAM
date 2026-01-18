# AV1 Video Format

## Overview

AV1 (AOMedia Video 1) is a royalty-free video codec developed by the Alliance for Open Media. It is designed as a successor to VP9 and as a competitive alternative to HEVC/H.265, offering superior compression efficiency while maintaining open-source and patent-free standards.

## Specification

- **Official Repository**: [AOMedia AV1 Specification](https://github.com/AOMediaCodec/av1-spec)
- **Status**: Other (non-W3C standard, industry specification)

## Categories

- **Video & Media**: Video Format Standards

## Key Benefits & Use Cases

### Compression Efficiency
- Superior compression compared to H.264 and VP9
- Reduces file size by 30-50% compared to H.264 at equivalent quality
- Enables efficient streaming over bandwidth-constrained networks

### Royalty-Free Distribution
- Open-source codec without licensing fees
- Eliminates patent concerns associated with HEVC
- Ideal for content creators and streaming platforms

### Quality Preservation
- Maintains video quality at lower bitrates
- Supports high-resolution content (up to 8K)
- Better quality preservation for archival purposes

### Streaming Applications
- Netflix, YouTube, and other platforms actively use AV1
- Reduces bandwidth costs for streaming services
- Enables better quality at lower bitrates for end users

### Future-Proofing
- Emerging standard gaining increasing support
- Positioned as the next-generation video codec
- Growing ecosystem of encoding/decoding tools

## Browser Support

### Browsers with Full Support

| Browser | First Full Support | Current Status | Notes |
|---------|-------------------|-----------------|-------|
| **Chrome** | 70 | ✅ Supported | All versions 70+ |
| **Firefox** | 67 | ✅ Supported | All versions 67+ |
| **Edge** | 121 | ✅ Supported | All versions 121+ |
| **Opera** | 57 | ✅ Supported | All versions 57+ |
| **Safari** | Not Yet | ⚠️ Partial Support | Available on limited hardware (see notes) |
| **iOS Safari** | Not Yet | ⚠️ Partial Support | Available on limited hardware (see notes) |

### Mobile Browsers

| Browser | Status | Notes |
|---------|--------|-------|
| **Android Browser** | ✅ Supported | Version 142+ |
| **Samsung Internet** | ✅ Supported | Version 12.0+ |
| **Opera Mobile** | ✅ Supported | Version 80+ |
| **Android Chrome** | ✅ Supported | Version 142+ |
| **Android Firefox** | ✅ Supported | Version 144+ |
| **Android UC Browser** | ✅ Supported | Version 15.5+ |
| **Baidu Browser** | ✅ Supported | Version 13.52+ |
| **QQ Browser** | ✅ Supported | Version 14.9+ |
| **Opera Mini** | ❌ Not Supported | All versions |
| **IE Mobile** | ❌ Not Supported | All versions |
| **Blackberry Browser** | ❌ Not Supported | All versions |
| **KaiOS** | ❌ Not Supported | All versions |

### Desktop Browsers (Legacy)

| Browser | Status | Notes |
|---------|--------|-------|
| **Internet Explorer** | ❌ Not Supported | All versions (5.5-11) |
| **Edge (Legacy)** | ⚠️ Limited Support | Windows 10+: Can enable via Microsoft Store AV1 extension |

## Global Browser Support Statistics

- **Full Support**: 82.15% of global browser usage
- **Partial Support**: 9.07% of global browser usage
- **No Support**: 8.78% of global browser usage

## Implementation Notes

### Firefox Support History
- **Firefox 55-64**: Decoding available (behind `media.av1.enabled` flag)
- **Firefox 65**: Full support (Windows 64-bit only)
- **Firefox 66**: Full support (Windows and macOS)
- **Firefox 67+**: Full support (all platforms)

### Safari & iOS Limitation
AV1 support on Safari and iOS is **hardware-dependent** and limited to devices with dedicated AV1 hardware decoders:
- iPhone 15 Pro and later
- M3/M4 MacBook Pro models
- Other Apple devices with compatible hardware

**Related tracking**: [Safari implementation bug](https://bugs.webkit.org/show_bug.cgi?id=207547)

### Edge/Chromium Support
- **Edge versions 18-115**: Could be enabled via Microsoft Store AV1 Video Extension (Windows 10+)
- **Edge versions 121+**: Native support without extension required
- **Edge versions 116-120**: Temporary support gap
- **Firefox tracking**: [Firefox implementation bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1452683)

### Known Issues

- Edge had a period where AV1 support was discontinued (between versions 116-120), then re-enabled at version 121
- Safari/iOS support limited to recent hardware with AV1 decoders
- Some older systems may have CPU decoding limitations

## Related Resources

- **Wikipedia**: [AV1 - Wikipedia Article](https://en.wikipedia.org/wiki/AV1)
- **Sample Videos**:
  - [Bitmovin AV1 Demo](https://bitmovin.com/demos/av1)
  - [Facebook AV1 Sample](https://www.facebook.com/330716120785217/videos/330723190784510/)
- **Implementation Issues**:
  - [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1452683)
  - [Safari Implementation Bug](https://bugs.webkit.org/show_bug.cgi?id=207547)

## Compatibility & Fallback Strategies

### Progressive Enhancement Pattern
```html
<video controls>
  <source src="video.av1.mp4" type="video/mp4; codecs=av01.0.08M.08">
  <source src="video.h264.mp4" type="video/mp4; codecs=avc1.4d401e">
  <p>Your browser doesn't support HTML5 video. Download the video instead.</p>
</video>
```

### Detection & Feature Checking
Modern browsers support the `canPlayType()` method for codec detection:
```javascript
const video = document.createElement('video');
const av1Support = video.canPlayType('video/mp4; codecs=av01.0.08M.08');
```

## Migration Path

### For Content Providers
1. **Phase 1**: Encode content in both AV1 and H.264 (fallback)
2. **Phase 2**: Monitor browser support metrics and analytics
3. **Phase 3**: Gradually increase AV1 bitrate allocation as support grows
4. **Phase 4**: Consider AV1-first strategy once support exceeds 90%

### For Application Developers
- **Immediate**: Implement fallback chains with H.264 as primary
- **Near-term**: Deploy AV1 alongside H.264 with feature detection
- **Long-term**: Transition to AV1-primary once support reaches desired threshold

## Summary

AV1 represents the next generation of video codecs with strong support across modern browsers (82%+ global usage). While not yet universally supported on Safari/iOS due to hardware limitations, it provides significant benefits for streaming platforms, content creators, and end users through superior compression efficiency and royalty-free distribution. Strategic deployment alongside H.264 fallbacks ensures broad compatibility while taking advantage of AV1's efficiency gains.

**Last Updated**: Based on CanIUse data with browser support through latest versions