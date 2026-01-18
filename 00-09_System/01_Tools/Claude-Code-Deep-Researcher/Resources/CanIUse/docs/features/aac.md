# AAC Audio File Format

## Overview

**AAC** (Advanced Audio Coding) is a modern audio compression format designed as the successor to MP3. It delivers significantly better sound quality at the same bitrate compared to MP3, making it the preferred format for high-quality audio in web and mobile applications.

## Description

Advanced Audio Coding is an audio format standardized by the ISO/IEC, widely used for music distribution and streaming. AAC provides superior audio fidelity and efficiency compared to its predecessor, MP3, and has become the de facto standard for professional audio production and consumer devices.

## Specification

- **Status**: Other
- **Specification**: [Digital Preservation Network - AAC Format](http://www.digitalpreservation.gov/formats/fdd/fdd000114.shtml)
- **Category**: Audio Format
- **Use Context**: `<audio>` HTML5 element

## Categories

- Other

## Benefits & Use Cases

### Key Advantages

- **Superior Sound Quality**: Better compression efficiency than MP3 at equivalent bitrates
- **Smaller File Sizes**: Reduced bandwidth requirements for streaming and distribution
- **Broad Compatibility**: Supported across virtually all modern browsers and devices
- **Professional Standard**: Industry standard for music production and distribution (iTunes, Spotify, YouTube)
- **Patent-Free Implementation**: Widely available codecs for web integration
- **Effective Compression**: Optimized for both speech and music content

### Primary Use Cases

1. **Music Streaming**: Reduced bandwidth and storage requirements
2. **Podcasts**: Standard format for podcast distribution platforms
3. **Video Audio Tracks**: Common audio codec for video content
4. **Mobile Applications**: Preferred format on iOS and Android
5. **Web Audio**: Native support in HTML5 `<audio>` elements
6. **Adaptive Bitrate Streaming**: Used in DASH and HLS streaming protocols

## Browser Support

### Comprehensive Support Table

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| **Chrome** | 12+ | ✅ Full | Complete support from v12 onwards |
| **Edge** | 12+ | ✅ Full | Full support across all versions |
| **Firefox** | 22+ | ⚠️ Partial | Limited to AAC in MP4 container with OS codecs |
| **Safari** | 4+ | ✅ Full | Supported since Safari 4 |
| **Opera** | 15+ | ✅ Full | Support from v15 onwards |
| **IE** | 9-11 | ✅ Full | Supported in IE9 and later |
| **iOS Safari** | 4.0+ | ✅ Full | Full support on iOS devices |
| **Android** | 3+ | ✅ Full | Native support on Android 3+ |
| **Opera Mini** | All | ❌ No | Not supported on Opera Mini |
| **Samsung Internet** | 4+ | ✅ Full | Full support from v4 onwards |
| **UC Browser** | 15.5+ | ✅ Full | Support from v15.5 |
| **Opera Mobile** | 80+ | ✅ Full | Support from v80 onwards |
| **KaiOS** | 2.5+ | ⚠️ Partial | Limited support |

### First Version with Full Support

- Chrome: **v12**
- Edge: **v12**
- Safari: **v4**
- Opera: **v15**
- IE: **v9**
- iOS Safari: **v4.0-4.1**
- Android: **v3**
- Samsung Internet: **v4**

### Global Usage Statistics

- **Full Support**: 91.4% of users
- **Partial Support**: 2.19% of users
- **No Support**: ~6.4% of users

## Implementation Details

### HTML5 Audio Element

```html
<audio controls>
  <source src="audio.aac" type="audio/aac">
  <source src="audio.mp4" type="audio/mp4">
  Your browser does not support the audio element.
</audio>
```

### MIME Types

- `audio/aac` - AAC in raw format
- `audio/mp4` - AAC in MP4 container (more widely supported)
- `audio/mpeg` - For compatibility with MP3-aware systems

### Codec Specification

When specifying with codec parameters:

```html
<source src="audio.mp4" type="audio/mp4; codecs=\"mp4a.40.2\"">
```

## Known Issues & Notes

### Firefox Limitation

Firefox has partial support for AAC with specific constraints:

- **Supported Container**: Only AAC wrapped in MP4 container
- **Codec Requirement**: Requires the operating system to have AAC codecs pre-installed
- **Note**: Raw AAC format is not supported in Firefox

This means Firefox users may not be able to play AAC files unless they're in MP4 containers and system codecs are available.

### Important Considerations

- Support specifically refers to AAC playback in the HTML5 `<audio>` element, not other usage contexts
- Different containers (raw AAC vs MP4) have varying browser support levels
- Mobile devices typically have better native AAC support due to OS-level codec availability

## Compatibility Matrix Summary

### Desktop Browsers
- **Chrome**: ✅ Full support (v12+)
- **Firefox**: ⚠️ Partial support (MP4 container only)
- **Safari**: ✅ Full support (v4+)
- **Opera**: ✅ Full support (v15+)
- **Edge**: ✅ Full support (v12+)
- **IE**: ✅ Full support (v9+)

### Mobile Browsers
- **iOS Safari**: ✅ Full (v4+)
- **Android Chrome**: ✅ Full (v3+)
- **Samsung Internet**: ✅ Full (v4+)
- **Opera Mobile**: ✅ Full (v80+)
- **UC Browser**: ✅ Full (v15.5+)

### Legacy & Limited Browsers
- **Opera Mini**: ❌ No support
- **IE Mobile**: ✅ Full (v10), ❌ No (v11)
- **Blackberry**: ⚠️ From v10+

## Recommended Implementation Strategy

### For Maximum Compatibility

```html
<audio controls>
  <!-- Primary: MP4 container with AAC (broadest support) -->
  <source src="audio.mp4" type="audio/mp4">
  <!-- Fallback: Ogg Vorbis for older Firefox -->
  <source src="audio.ogg" type="audio/ogg">
  <!-- Fallback: MP3 for legacy browsers -->
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

### For Modern Browsers Only

```html
<audio controls>
  <source src="audio.mp4" type="audio/mp4">
  Your browser does not support the audio element.
</audio>
```

## Related Resources

### References

- [AAC Format on Wikipedia](https://en.wikipedia.org/wiki/Advanced_Audio_Coding)
- [Digital Preservation Network - AAC Specification](http://www.digitalpreservation.gov/formats/fdd/fdd000114.shtml)
- [HTML5 Audio Element MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
- [Can I Use - AAC Support](https://caniuse.com/aac)

### Related Audio Formats

- [MP3 Format](./mp3.md) - Legacy format, broader compatibility
- [Ogg Vorbis](./ogg-vorbis.md) - Open format alternative
- [FLAC](./flac.md) - Lossless audio codec
- [WebM Audio](./webm-audio.md) - Modern web format

## Summary

AAC is a mature, widely-supported audio format with excellent browser compatibility across all major platforms. With 91.4% global support, it's suitable for most web audio applications. The primary consideration is Firefox's MP4 container requirement. For maximum compatibility, include MP4 as the primary source with fallbacks for legacy browsers or specific use cases.

---

*Last Updated: 2024 | Based on CanIUse Data*
