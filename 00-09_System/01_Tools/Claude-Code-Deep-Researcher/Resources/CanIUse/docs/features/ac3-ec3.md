# AC-3 (Dolby Digital) and EC-3 (Dolby Digital Plus) Codecs

## Overview

AC-3 and EC-3 are multi-channel lossy audio codecs standardized as A/52:2012, commonly used in movies and professional audio applications. AC-3 supports 5.1 channels, while its successor EC-3 (also known as E-AC-3) supports up to 15.1 channels and bit rates up to 6144 kbit/s.

## Specification

- **Standard**: A/52:2012 - Digital Audio Compression (AC-3, E-AC-3)
- **Standardized By**: ATSC (Advanced Television Systems Committee)
- **Official Specification**: [A/52:2012 Digital Audio Compression AC-3 E-AC-3 Standard](https://atsc.org/standard/a522012-digital-audio-compression-ac-3-e-ac-3-standard-12172012/)

## Categories

- Audio Codecs

## Use Cases and Benefits

### Primary Applications

1. **Film and Video Production**
   - Industry standard for 5.1 surround sound in cinema
   - Professional-grade multi-channel audio delivery
   - High-quality soundtrack distribution

2. **Streaming and Broadcasting**
   - EC-3 enables efficient multi-channel audio streaming
   - Variable bit rate support for adaptive streaming
   - Backward compatible with AC-3 legacy systems

3. **Home Theater Systems**
   - Wide hardware support through consumer electronics
   - Multi-channel surround sound playback
   - Industry adoption in AV receivers and speakers

4. **Professional Audio Distribution**
   - Digital television broadcasting
   - DVD and Blu-ray media
   - Streaming services and on-demand platforms

### Technical Benefits

- **Efficient Compression**: Lossy compression reduces file size while maintaining audio quality
- **Multi-Channel Support**: AC-3 offers 5.1, EC-3 supports up to 15.1 channels
- **High Bit Rates**: EC-3 supports up to 6144 kbit/s for lossless-quality delivery
- **Standardized Format**: Industry-wide adoption ensures broad compatibility
- **Flexible Channel Configuration**: Supports various speaker configurations

## Browser Support

### Summary by Browser

| Browser | First Version with Support | Current Status |
|---------|---------------------------|----------------|
| Chrome | Not Supported | ❌ No Support |
| Firefox | Not Supported | ❌ No Support |
| Safari | Not Supported | ❌ No Support |
| Edge | 12-18 (Legacy) | ❌ No Support (Chromium) |
| Opera | Not Supported | ❌ No Support |
| Internet Explorer | Not Supported | ❌ No Support |
| iOS Safari | 9.0+ (with caveats) | ⚠️ Partial Support |
| Android | Not Supported | ❌ No Support |
| Samsung Internet | Not Supported | ❌ No Support |

### Detailed Browser Support Table

#### Desktop Browsers

| Browser | Version | Support Status | Notes |
|---------|---------|----------------|-------|
| **Chrome** | All versions | ❌ Not Supported | No native HTML5 audio support |
| **Firefox** | 2-148 | ❌ Not Supported | Not implemented |
| **Safari** | 3.1-26.2 | ❌ Not Supported | Not implemented |
| **Edge (Legacy)** | 12-18 | ✅ Supported | Only in original EdgeHTML engine |
| **Edge (Chromium)** | 79+ | ❌ Not Supported | Removed in Chromium versions |
| **Opera** | All versions | ❌ Not Supported | Not implemented |
| **Internet Explorer** | All versions | ❌ Not Supported | Not supported |

#### Mobile Browsers

| Browser | Version | Support Status | Notes |
|---------|---------|----------------|-------|
| **iOS Safari** | 9.0+ | ⚠️ Partial Support | Claims "probably" support; actual playback untested |
| **Android Browser** | All versions | ❌ Not Supported | Not implemented |
| **Chrome Android** | All versions | ❌ Not Supported | Not implemented |
| **Firefox Android** | All versions | ❌ Not Supported | Not implemented |
| **Samsung Internet** | All versions | ❌ Not Supported | Not implemented |
| **Opera Mobile** | 12.1 | ⚠️ Partial Support | Claims "probably" support; actual playback untested |
| **BlackBerry Browser** | 10 | ⚠️ Partial Support | Claims "probably" support; actual playback untested |
| **UC Browser** | All versions | ❌ Not Supported | Not implemented |

## Support Status Legend

- **✅ Supported** - Full implementation with reliable playback
- **⚠️ Partial Support** - Claims "probably" supported but actual playback is untested (marked with `#1`)
- **❌ Not Supported** - No implementation or non-functional

## Important Notes and Limitations

### Note #1: Untested Playback Support

Several browsers including iOS Safari (9.0+), Opera Mobile (12.1), and BlackBerry Browser (10) claim "probably" support for AC-3/EC-3 codecs. However, actual playback capability is **untested and unreliable**. Developers should:

- Test thoroughly in each target browser before relying on this support
- Provide fallback audio codecs (MP3, AAC, Vorbis, Opus) for better compatibility
- Not assume support based on positive canisuse data for these browsers

### Browser Engine Considerations

- **Legacy Edge Support**: AC-3/EC-3 was supported in Microsoft Edge 12-18 (EdgeHTML engine), but support was discontinued when Edge switched to Chromium (version 79+)
- **Chromium Limitation**: The Chromium engine (used by Chrome, Edge, Opera, Brave, etc.) does not implement AC-3/EC-3 decoding for HTML5 audio elements

### Audio Format Compatibility

For maximum browser compatibility, use alternative audio codecs:

- **MP3** - Widely supported across all browsers and devices
- **AAC** - Excellent quality, good browser support
- **Vorbis/WebM** - Open format with good support
- **Opus** - Modern codec with excellent quality and efficiency
- **FLAC** - Lossless format with increasing support

## Related Resources

### Official Links

- [Dolby Audio for High-Performance Audio in Microsoft Edge](https://blogs.windows.com/msedgedev/2015/05/26/announcing-dolby-audio-for-high-performance-audio-in-microsoft-edge/) - Microsoft Edge development blog article about Dolby audio support

### Related Web Standards

- [HTML5 Audio Element](https://html.spec.whatwg.org/multipage/media.html#the-audio-element) - Media format support depends on browser and codec implementation
- [Web Audio API](https://webaudio.github.io/web-audio-api/) - Alternative for advanced audio processing
- [Media Source Extensions](https://www.w3.org/TR/media-source/) - For adaptive streaming with multiple audio codecs

### Similar Audio Codecs

- [MP3 (MPEG-2 Audio)](https://caniuse.com/mp3) - Universal browser support
- [AAC (MPEG-4 Audio)](https://caniuse.com/aac) - Excellent quality alternative
- [Vorbis/WebM Audio](https://caniuse.com/vorbis) - Open-source codec
- [Opus Audio](https://caniuse.com/opus) - Modern, efficient codec
- [FLAC Lossless Audio](https://caniuse.com/flac) - Lossless compression

## Implementation Notes

### When to Use AC-3/EC-3

- **Video/Film Delivery**: When targeting devices with hardware AC-3/EC-3 support
- **Smart TVs**: Many modern televisions support these codecs natively
- **Proprietary Applications**: In non-web contexts where browser support isn't required
- **Professional Production**: For master delivery formats before transcoding

### When NOT to Use AC-3/EC-3 for Web

- Do not rely on AC-3/EC-3 for HTML5 audio elements across different browsers
- Browser support is extremely limited (essentially only legacy Edge)
- Mobile support is claimed but untested and unreliable
- No modern browser engines fully implement these codecs for web audio

### Recommended Practice

Use the HTML5 audio element with multiple codec fallbacks:

```html
<audio controls>
  <source src="audio.opus" type="audio/opus">
  <source src="audio.m4a" type="audio/mp4">
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

Choose codecs based on your target audience and quality requirements, avoiding AC-3/EC-3 unless specifically targeting devices with hardware support outside the web platform.

## Data Summary

- **Full Support (y)**: 0%
- **Partial Support (a)**: 9.31%
- **No Support (n)**: ~90.69%
- **Vendor Prefix Required**: No
- **Primary Status**: "Other" (not a W3C standard for web)

---

*Documentation generated from canisuse feature data. Last updated based on browser compatibility database.*
