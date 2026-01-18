# Dynamic Adaptive Streaming over HTTP (MPEG-DASH)

## Overview

**Dynamic Adaptive Streaming over HTTP (MPEG-DASH)** is an HTTP-based media streaming communications protocol that provides an alternative to HTTP Live Streaming (HLS). It enables adaptive bitrate streaming, allowing video and audio content to be delivered over standard HTTP connections with automatic quality adjustment based on network conditions.

## Specification

- **Official Standard**: [ISO/IEC 23009-1](https://www.iso.org/standard/65274.html)
- **Status**: Other (not a W3C specification, but an ISO standard)
- **Specification URL**: https://www.iso.org/standard/65274.html

## Categories

- Other

## Description

MPEG-DASH is a standardized protocol developed by the ISO/IEC and the Moving Picture Experts Group (MPEG) that allows for the delivery of video and audio content over the internet using standard HTTP web servers. Unlike HLS which is primarily associated with Apple platforms, MPEG-DASH is platform-agnostic and widely used across different streaming services and platforms.

## Key Benefits and Use Cases

### Primary Benefits
- **Adaptive Bitrate Streaming**: Automatically adjusts video quality based on network bandwidth and device capabilities
- **Standardization**: ISO/IEC standard ensures wide industry support and interoperability
- **Platform Agnostic**: Works across different devices and platforms without platform-specific implementations
- **HTTP-Based**: Leverages existing HTTP infrastructure and CDN networks for efficient content delivery
- **Network Efficiency**: Optimizes bandwidth usage by adapting to changing network conditions in real-time
- **Low Latency Options**: Supports low-latency streaming for live content delivery

### Typical Use Cases
- Video streaming services (Netflix, Amazon Prime, Disney+, YouTube)
- Live streaming events and broadcasts
- Educational video platforms
- Professional video delivery
- Enterprise multimedia delivery
- Sports streaming and entertainment platforms

## Browser Support

### Support Status Summary
- **Overall Native Support**: Very Limited
- **Primary Support Method**: JavaScript libraries (via Media Source Extensions)
- **Workaround**: Use JavaScript implementations like dash.js when native support is unavailable

### Detailed Browser Support Table

| Browser | Support Status | Notes |
|---------|---|---|
| **Internet Explorer** | ❌ None | Not supported in any version |
| **Edge** | ✅ Partial | Versions 12-18 support MPEG-DASH natively |
| | ❌ No | Versions 79+ do not support MPEG-DASH |
| **Firefox** | ❌ No | Not supported in current or recent versions |
| | ⚠️ Experimental | Versions 21-22 had experimental support with flags (see notes) |
| **Chrome** | ❌ No | Not supported in any version (4-146+) |
| **Safari** | ❌ No | Not supported in any version (3.1-26+) |
| **Opera** | ❌ No | Not supported in any version (9-122+) |
| **iOS Safari** | ❌ No | Not supported in any version |
| **Opera Mini** | ❌ No | Not supported |
| **Android Browser** | ❌ No | Not supported |
| **BlackBerry** | ❌ No | Not supported |
| **Opera Mobile** | ❌ No | Not supported |
| **IE Mobile** | ❌ No | Not supported |
| **UC Browser** | ❌ No | Not supported |
| **Samsung Internet** | ❌ No | Not supported in any version |
| **Chrome Android** | ❌ No | Not supported |
| **Firefox Android** | ❌ No | Not supported |
| **Opera Android** | ❌ No | Not supported |
| **QQ Browser** | ❌ No | Not supported |
| **Baidu Browser** | ❌ No | Not supported |
| **KaiOS Browser** | ❌ No | Not supported |

### Version Details

#### Edge (Limited Support)
- **Versions 12-18**: Support for MPEG-DASH ✅
- **Versions 79+**: No support ❌

#### Firefox (Experimental Only)
- **Versions 21-22**: Experimental support with flags
  - Can be enabled via `media.dash.enabled` flag
  - Only WebM video format is supported
- **All Other Versions**: No support ❌

#### All Other Browsers
- **No native support** across Chrome, Safari, Opera, and mobile browsers

## Current Implementation Status

### Usage Statistics
- **Percentage with Support**: 0%
- **Percentage with Partial Support**: 0%
- **Native Browser Support**: Extremely limited (only Edge 12-18)

## Important Notes

### Key Implementation Notes

1. **JavaScript Library Alternative**: MPEG-DASH can be implemented in browsers that don't natively support it using JavaScript libraries, provided they support **Media Source Extensions (MSE)**. This is the recommended approach for broad browser compatibility.

2. **Media Source Extensions Requirement**: Most modern browsers support Media Source Extensions, which allow JavaScript-based streaming implementations to work effectively.

3. **Popular Implementation**: The dash.js library is a widely-used open-source JavaScript implementation of MPEG-DASH that provides compatibility across modern browsers.

4. **Firefox Experimental Support**: Firefox versions 21-22 had experimental support that required enabling the `media.dash.enabled` flag, and only supported WebM video format.

### Practical Deployment Strategies

#### Approach 1: JavaScript Library (Recommended)
```javascript
// Using dash.js for MPEG-DASH playback
const video = document.querySelector('video');
const dashjs = window.dashjs;

const player = dashjs.MediaPlayer().create();
player.initialize(video, 'path/to/manifest.mpd', true);
```

#### Approach 2: Fallback Options
- Use HLS as primary for Safari users
- Use MPEG-DASH with JavaScript fallback for other browsers
- Implement content negotiation on the server side

#### Approach 3: Platform-Specific Solutions
- Web: JavaScript implementations (dash.js, Shaka Player)
- Native Apps: Platform-specific streaming frameworks
- Smart TVs: Built-in MPEG-DASH support in many modern TV sets

## Technical Details

### Manifest Format
- MPEG-DASH uses **Media Presentation Description (MPD)** XML format for streaming manifests
- Specifies available bitrates, segments, and stream information

### Supported Codecs
- **Video**: H.264/AVC, H.265/HEVC, VP9, AV1
- **Audio**: AAC, HE-AAC, AC-3, EC-3, Opus, FLAC

### Key Advantages Over HLS
- Open ISO standard vs. proprietary Apple format
- Better support for multiple codecs and encryption standards
- More granular bitrate adaptation
- More efficient segment delivery

## Related Technologies

- **HTTP Live Streaming (HLS)**: Apple's proprietary streaming protocol
- **Media Source Extensions (MSE)**: Required for JavaScript-based MPEG-DASH implementations
- **Encrypted Media Extensions (EME)**: For DRM-protected content delivery
- **dash.js**: Popular open-source JavaScript MPEG-DASH player library

## Relevant Links

### Official Resources
- [ISO/IEC 23009-1 Standard](https://www.iso.org/standard/65274.html)

### Educational Resources
- [Wikipedia - Dynamic Adaptive Streaming over HTTP](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)

### Implementation Libraries
- [dash.js - JavaScript MPEG-DASH Player](https://github.com/Dash-Industry-Forum/dash.js/)
- [Dash Industry Forum](https://dashif.org/) - Standards and development

### Related Standards
- [Media Source Extensions (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)
- [Encrypted Media Extensions (EME)](https://www.w3.org/TR/encrypted-media/)

## Browser Compatibility Summary

### Recommended Implementation Strategy for Maximum Compatibility

Given the lack of widespread native support, the recommended approach is:

1. **Use JavaScript Library**: Implement MPEG-DASH via dash.js or Shaka Player
2. **Check for MSE Support**: Verify browser supports Media Source Extensions API
3. **Provide Fallback**: Offer HLS or progressive download as fallback for older browsers
4. **Test Across Devices**: Ensure consistent playback on target browsers and devices

### Examples of Services Using MPEG-DASH
- Netflix (as primary streaming protocol)
- Amazon Prime Video
- YouTube (for Chromebook and selected regions)
- Disney+ (on compatible platforms)
- Many live sports streaming services
- Professional video delivery platforms

## Summary

MPEG-DASH is a powerful, standardized adaptive streaming protocol that is ideal for modern web video delivery. While native browser support is extremely limited, its wide adoption through JavaScript libraries makes it the de facto standard for video streaming across the web. Most major streaming services rely on MPEG-DASH as their primary delivery mechanism, demonstrating its industry importance despite limited native browser implementation.

---

**Last Updated**: December 2025
**Data Source**: CanIUse Browser Support Database
