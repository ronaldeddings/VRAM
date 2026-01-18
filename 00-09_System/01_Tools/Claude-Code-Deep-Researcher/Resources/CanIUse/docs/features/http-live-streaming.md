# HTTP Live Streaming (HLS)

## Overview

HTTP Live Streaming (HLS) is an HTTP-based media streaming communications protocol developed by Apple. It enables adaptive bitrate streaming of media content over standard HTTP networks, making it suitable for both live and on-demand video delivery across various devices and network conditions.

## Description

HTTP Live Streaming is a standards-based protocol that allows media content to be served over HTTP infrastructure. It breaks media streams into small segments and encodes them at various bitrates, enabling clients to dynamically select the quality based on available bandwidth. This adaptive behavior ensures optimal playback quality and minimizes buffering across diverse network conditions and devices.

## Specification Status

**Status:** Unofficial/Proprietary
**Specification:** [RFC 8216](https://tools.ietf.org/html/rfc8216)

This specification provides the technical details for implementing HLS streaming.

## Categories

- **Other**

## Benefits & Use Cases

### Key Benefits

- **Adaptive Bitrate Streaming:** Automatically adjusts video quality based on network conditions
- **Wide Device Support:** Works across iOS, Android, macOS, tvOS, and various browsers
- **Live and On-Demand:** Suitable for both live broadcasts and pre-recorded content
- **Firewall Friendly:** Uses standard HTTP, which works across most networks
- **Scalability:** Leverages existing CDN infrastructure for efficient content delivery
- **Bandwidth Optimization:** Reduces unnecessary data transmission with adaptive quality selection

### Common Use Cases

- **Live Event Streaming:** Sports events, news broadcasts, live conferences
- **Video On-Demand (VOD):** Movies, TV shows, educational content
- **Internet Television:** Streaming TV platforms and OTT services
- **Webcasting:** Corporate events, webinars, training sessions
- **Content Distribution:** Multi-device content delivery at scale

## Browser Support

### Support Summary

HLS has varying levels of support across browsers:

- **Excellent:** Safari (desktop & iOS), Samsung Internet, Android browsers
- **Good:** Chrome (v142+), Opera Mobile, BlackBerry, Android 3+
- **Limited:** Edge (v12-18 only), Firefox (not supported), Opera (not supported)
- **Poor/None:** Internet Explorer, older browser versions

### Browser Support Table

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Safari (Desktop)** | 6.0 | ✅ Full Support (6.0+) | Native support across all modern versions |
| **Safari (iOS)** | 3.2 | ✅ Full Support (3.2+) | Supported since iPhone OS 3.2 |
| **Chrome** | 142 | ✅ Full Support (142+) | Recent addition to Chrome |
| **Firefox** | None | ❌ Not Supported | No native HLS support |
| **Edge** | 12-18 | ⚠️ Limited (v12-18 only) | Supported in legacy Edge, dropped in Chromium Edge |
| **Opera** | None | ❌ Not Supported | Not supported in any version |
| **Opera Mini** | N/A | ❌ Not Supported | Not supported |
| **Opera Mobile** | 80 | ✅ Partial Support (v80+) | Recently added support |
| **Android Browser** | 3.0 | ✅ Full Support (3.0+) | Supported since Android 3.0 |
| **Android Chrome** | 142 | ✅ Full Support (142+) | Follows Chrome desktop support |
| **Android Firefox** | 144 | ✅ Full Support (144+) | Recently added |
| **Samsung Internet** | 4.0 | ✅ Full Support (4.0+) | Wide version support |
| **BlackBerry** | 10 | ✅ Partial Support (v10+) | Limited to BB10+ |
| **UC Browser (Android)** | 15.5 | ✅ Full Support (15.5+) | Supported in recent versions |
| **Baidu Browser** | 13.52 | ✅ Full Support (13.52+) | Recent version support |
| **QQ Browser (Android)** | 14.9 | ✅ Full Support (14.9+) | Supported in recent versions |
| **KaiOS** | None | ❌ Not Supported | Not supported in any version |
| **IE Mobile** | None | ❌ Not Supported | Not supported |

### Mobile & Platform Support

- **iOS Safari:** Full native support since iOS 3.2
- **Android:** Native support from Android 3.0 onwards
- **Samsung Internet:** Full support from version 4.0
- **Desktop Browsers:** Primarily Safari; Chrome added support in v142

## Global Support Statistics

- **Supported:** 68.01% of global browser usage
- **No Support:** 31.99% of global browser usage

## Technical Notes

### Implementation without Native Support

HLS can be used in browsers that don't natively support it through the use of a JavaScript library, provided that the browser supports [Media Source Extensions](/mediasource). This allows for broader compatibility across different platforms and older browser versions.

### Media Source Extensions Dependency

Browsers implementing HLS via JavaScript libraries rely on the Media Source Extensions API, which must be available in the target browser to enable this fallback approach.

## Relevant Links

- [Wikipedia: HTTP Live Streaming](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
- [Apple Developer: Streaming](https://developer.apple.com/streaming/)
- [RFC 8216 Specification](https://tools.ietf.org/html/rfc8216)
- [Media Source Extensions Documentation](/mediasource)

## Related Keywords

`apple http live streaming`, `m3u8`

## Recommendations

### When to Use HLS

✅ **Recommended for:**
- Apple ecosystem targeting (iOS, macOS, tvOS)
- Live streaming applications
- Cross-platform video delivery
- Adaptive bitrate streaming requirements
- Existing Apple infrastructure or services

⚠️ **Consider alternatives for:**
- Browsers lacking native HLS support (use JavaScript polyfills with Media Source Extensions)
- Extremely low-latency requirements (consider DASH or RTMP)
- Devices without Media Source Extensions support

### Implementation Strategy

1. **Primary delivery:** Use native HLS for Safari and iOS
2. **Fallback:** Implement JavaScript HLS player (e.g., hls.js) for browsers supporting Media Source Extensions
3. **Format selection:** Create content in HLS format (M3U8 playlists with MPEG-TS or fMP4 segments)
4. **Testing:** Validate across target platforms and browser versions
5. **CDN delivery:** Utilize CDN infrastructure for optimal performance

## Version History Summary

- **Safari:** Native support since v6.0 (2012)
- **iOS Safari:** Native support since iOS 3.2 (2008)
- **Android:** Native support from Android 3.0 Honeycomb onwards
- **Chrome:** Recently added in v142 (2024)
- **Firefox:** No native support; requires polyfills
- **Legacy Edge:** Supported in v12-18; dropped in Chromium-based Edge
