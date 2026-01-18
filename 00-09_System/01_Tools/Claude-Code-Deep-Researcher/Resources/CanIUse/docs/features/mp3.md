# MP3 Audio Format

## Overview

MP3 (MPEG-1 Audio Layer 3) is a popular lossy audio compression format that has been widely used for digital audio distribution and playback. It uses perceptual audio coding to achieve significant file size reduction while maintaining reasonable audio quality.

## Description

The MP3 format is one of the most established audio compression standards in digital media. It works by removing parts of the audio that are less perceptible to the human ear, resulting in files that are typically 10-12 times smaller than uncompressed audio while maintaining acceptable quality for most listening purposes.

## Specification Status

**Status:** Other
**Specification URL:** [MP3 Format Reference](http://mpgedit.org/mpgedit/mpeg_format/MP3Format.html)

## Categories

- Audio Formats

## Use Cases & Benefits

MP3 support in the HTML5 `<audio>` element enables:

- **Music Streaming**: Delivery of compressed audio content over the internet with reasonable bandwidth usage
- **Podcasting**: Distribution of long-form audio content with manageable file sizes
- **Audio Effects**: Background music and sound effects in web applications
- **Media Players**: Browser-native audio playback without requiring plugins
- **Legacy Format Support**: Compatibility with vast libraries of existing MP3 files
- **Audio Testing**: Testing audio playback capabilities and audio element functionality

## Browser Support

### Desktop Browsers

| Browser | First Support | Latest Status | Notes |
|---------|---------------|---------------|-------|
| Chrome | 4+ | ✅ Supported (v146+) | Full support since version 4 |
| Edge | 12+ | ✅ Supported (v143+) | All versions supported |
| Firefox | 22+ | ✅ Supported (v148+) | Partial support in v3.5-21 (OS-limited) |
| Safari | 4+ | ✅ Supported (v26.2+) | Supported from version 4 onward |
| Opera | 15+ | ✅ Supported (v122+) | Support added in version 15 |
| Internet Explorer | 9+ | ✅ Supported (v11) | Supported from IE9 to IE11 |

### Mobile Browsers

| Browser | Support Status | Notes |
|---------|---|---|
| iOS Safari | ✅ Supported | From iOS 4.0-4.1 onward |
| Android Browser | ✅ Supported | From Android 2.3 onward |
| Chrome for Android | ✅ Supported (v142+) | Full support |
| Firefox for Android | ✅ Supported (v144+) | Full support |
| Opera Mobile | ✅ Supported (v11+) | Supported from v11 onward |
| Samsung Internet | ✅ Supported (v4+) | Supported from version 4 onward |
| UC Browser | ✅ Supported (v15.5+) | Full support |
| Opera Mini | ❌ Not Supported | Does not support MP3 in audio element |
| BlackBerry | ✅ Supported (v7-10) | Supported in BlackBerry OS 7+ |
| Baidu | ✅ Supported (v13.52+) | Full support |
| QQ | ✅ Supported (v14.9+) | Full support |
| KaiOS | ✅ Supported (v2.5+) | Full support |

## Overall Support Statistics

- **Full Support:** 93.59% of users
- **Partial Support:** 0.06% of users
- **No Support:** Minimal/Legacy browsers only

MP3 format support in the HTML5 audio element has near-universal coverage across all modern browsers and devices.

## Implementation Notes

### Important Information

Support statistics refer to the MP3 format's use within the HTML5 `<audio>` element, not other contexts where MP3 might be used (such as in media files for download or third-party media players).

### Partial Support Details

Partial support in older Firefox versions (3.5-21) was limited to certain operating systems and has since been superseded by full support in Firefox 22 and later.

## Basic Usage Example

```html
<!-- Simple audio element with MP3 source -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

<!-- Multiple sources for fallback support -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>

<!-- With additional attributes -->
<audio controls preload="metadata" width="300" height="32">
  <source src="podcast.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

## Related Audio Formats

For comprehensive audio format support, consider providing multiple formats:

- **OGG Vorbis** - Open-source alternative with good quality
- **WAV** - Uncompressed format for highest quality
- **FLAC** - Lossless compression format
- **AAC/M4A** - Modern compressed format used by iTunes

## Related Links

- [Wikipedia: MP3](https://en.wikipedia.org/wiki/MP3)
- [MDN Web Docs: HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [W3C: HTML Living Standard - Media Elements](https://html.spec.whatwg.org/multipage/media.html)

## Legacy Information

**MPEG-1 Standard:** The MP3 format is based on the MPEG-1 Audio Layer 3 standard, which was designed to provide quality audio at very low bit rates (typically 128 kbps or higher).

---

*Last Updated: 2025*
*Documentation based on CanIUse compatibility data*
