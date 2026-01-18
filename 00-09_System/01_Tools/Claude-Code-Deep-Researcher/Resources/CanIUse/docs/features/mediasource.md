# Media Source Extensions

## Overview

Media Source Extensions (MSE) is a W3C Recommendation that provides a JavaScript API for building robust, extensible media applications on the web. The API allows developers to dynamically generate media streams for `<video>` and `<audio>` elements using JavaScript, enabling advanced media player implementations with features like adaptive bitrate streaming, live streaming, and custom buffering logic.

## Specification Status

**Status:** W3C Recommendation (REC)
**Specification URL:** https://www.w3.org/TR/media-source/
**Usage Adoption:** 83.89% (full support) + 9.32% (partial support) = 93.21% global browser coverage

## Categories

- DOM
- JS API

## Description

The Media Source Extensions API allows JavaScript to access and manipulate media data that is fed to `<video>` and `<audio>` elements. This enables developers to:

- Implement adaptive bitrate streaming (ABR) by switching between quality levels based on network conditions
- Create custom video players with dynamic source switching
- Build live streaming applications with fine-grained control over buffering
- Concatenate media segments without interruption
- Implement complex media workflows with JavaScript-driven quality selection

## Key Benefits and Use Cases

### Primary Use Cases

1. **Adaptive Bitrate Streaming (ABR)**
   - Dynamically switch video quality based on available bandwidth
   - Essential for streaming services like Netflix, YouTube, and HLS/DASH implementations

2. **Live Streaming**
   - Fine-grained control over buffering and playback
   - Ability to manage live segments and adapt to network conditions
   - Support for DVR functionality with custom seeking

3. **Custom Media Players**
   - Build sophisticated video players with custom UI controls
   - Implement complex playback logic without relying on native controls
   - Enable seamless media concatenation and quality switching

4. **Media Composition**
   - Combine multiple media sources into a single playback stream
   - Implement video editing and mixing capabilities
   - Create dynamic media experiences

### Technical Benefits

- **Flexibility:** Complete control over media pipeline through JavaScript
- **Performance:** Efficient streaming with optimized buffering strategies
- **Interoperability:** Support across major streaming protocols (HLS, DASH)
- **Scalability:** Enable efficient bandwidth management for global distribution

## Browser Support

### Support Legend

- ✅ **Yes (y)** – Full support
- ⚠️ **Partial (a)** – Partial or conditional support
- ❌ **No (n)** – Not supported
- 🔧 **Disabled (d)** – Support requires enabling feature flag
- ⚡ **Prefixed (x)** – Support via vendor prefix (webkit, moz, ms, o)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 23.0 (with -webkit prefix) | ✅ 31+ | Full support from v31 onwards |
| **Firefox** | 42.0 | ✅ 42+ | Full support from v42 onwards |
| **Safari** | 8.0 | ✅ 8.0+ | Full support in macOS and iOS |
| **Edge** | 12.0 | ✅ 12.0+ | Full support from initial release |
| **Opera** | 15.0 | ✅ 15.0+ | Full support from v15 onwards |
| **Internet Explorer** | ⚠️ 11 | Partial (11) | IE11 support limited to Windows 8+ |

### Mobile Browsers

| Platform | Browser | Status | Notes |
|----------|---------|--------|-------|
| **iOS Safari** | 13.0+ | ⚠️ Partial | Full support only in iPadOS 13+; limited on iPhone |
| **Android** | 4.4.3+ | ✅ Yes | Full support from Android 4.4.3 onwards |
| **Android Chrome** | 142+ | ✅ Yes | Full support in current versions |
| **Android Firefox** | 144+ | ✅ Yes | Full support in current versions |
| **Samsung Internet** | 9.2+ | ✅ Yes | Full support from v9.2 onwards |
| **UC Browser** | 15.5+ | ✅ Yes | Full support in current versions |
| **Opera Mobile** | 80+ | ✅ Yes | Full support in current versions |
| **IE Mobile** | 11 | ✅ Yes | Full support in IE Mobile 11 |
| **KaiOS** | 2.5+ | ✅ Yes | Full support in v2.5+ |
| **Opera Mini** | All | ❌ No | Not supported in any version |
| **Blackberry** | 7-10 | ❌ No | No support |

## Browser Support Matrix Details

### Chrome/Chromium-based

- **Versions 4-22:** Not supported
- **Versions 17-30:** Supported with `-webkit-` prefix
- **Version 31+:** Full support without prefix

### Firefox

- **Versions 2-41:** Not supported (some versions with disabled flag)
- **Version 42+:** Full support

### Safari

- **Versions 3.1-7.1:** Not supported
- **Version 8.0+:** Full support (including macOS and iOS)

### Internet Explorer & Edge

- **IE 5.5-10:** Not supported
- **IE 11:** Partial support (Windows 8+ only)
- **Edge 12+:** Full support across all versions

### Safari on iOS

Media Source Extensions support on iOS Safari is conditional:
- Full support only available in **iPadOS 13+**
- Limited or no support on iPhone devices
- Status: Partial (`a #2`) for versions 13.0 and later

## Important Notes

### iOS Limitation (#2)
Media Source Extensions are **fully supported only in iPadOS**, specifically version 13 and later. iPhone Safari versions have conditional or limited support. This is an important consideration for mobile video streaming applications targeting iOS devices.

### Internet Explorer (#1)
Partial support in IE11 is limited to **Windows 8 and later** platforms. Earlier Windows versions or other environments with IE11 may not have MSE support.

### Feature Flags
- Chrome versions 17-30 required the `-webkit-` prefix to access MSE functionality
- Firefox versions 25-41 had the feature available but disabled by default (requires flag enabling)

## Implementation Considerations

### Compatibility Approach

For maximum compatibility, consider:

1. **Feature Detection:** Use `if (window.MediaSource)` to detect support
2. **Fallback Strategy:** Implement fallback to native `<video>` elements for unsupported browsers
3. **Prefix Handling:** Include vendor prefixes for older Chrome/Safari versions
4. **iOS Considerations:** Detect iOS Safari separately; limited MSE support may require alternative approaches
5. **Codec Support:** Check supported codec combinations using `MediaSource.isTypeSupported()`

### Recommended Minimum Support

For production applications:
- **Desktop:** Chrome 31+, Firefox 42+, Safari 8+, Edge 12+
- **Mobile:** Android 4.4.3+, iOS Safari 13+ (iPad), Samsung Internet 9.2+

## Relevant Links

- **MDN Web Docs - MediaSource API**
  https://developer.mozilla.org/en-US/docs/Web/API/MediaSource

- **MSDN Article - Media Source Extensions**
  https://msdn.microsoft.com/en-us/library/dn594470%28v=vs.85%29.aspx

- **Interactive Demo**
  https://simpl.info/mse/

- **W3C Specification**
  https://www.w3.org/TR/media-source/

## Global Support Statistics

- **Full Support (y):** 83.89% of users
- **Partial Support (a):** 9.32% of users
- **No Support (n):** 6.79% of users

**Combined Coverage:** 93.21% of users have some level of Media Source Extensions support

## See Also

- [HTML5 Audio and Video Elements](/docs/features/audio.md)
- [Adaptive Bitrate Streaming (HLS/DASH)](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery)
- [Fetch API](/docs/features/fetch.md) - For loading media segments
- [Service Workers](/docs/features/serviceworkers.md) - For media caching strategies
