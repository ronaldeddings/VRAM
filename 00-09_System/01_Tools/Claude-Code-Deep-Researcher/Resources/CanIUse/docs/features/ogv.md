# Ogg/Theora Video Format

## Overview

**Ogg/Theora** is a free, open-source lossy video compression format developed by the Xiph.Org Foundation. It provides royalty-free video encoding and decoding, making it an attractive option for developers and organizations looking to avoid patent licensing fees.

## Description

Theora is a free lossy video compression format that can be used within the Ogg multimedia container. It is designed to provide high-quality video encoding without the licensing restrictions of proprietary formats. Theora uses a modified discrete cosine transform (DCT) based codec and is particularly well-suited for web video delivery.

## Specification Status

- **Status:** Deprecated/Legacy
- **Specification:** [Theora Official Documentation](https://theora.org/doc/)
- **Maintenance:** Limited - Multiple browsers are actively deprecating support

## Categories

- Other

## Use Cases & Benefits

### Advantages
- **Royalty-Free:** No licensing fees required for encoding or decoding
- **Open Source:** Fully documented format with open-source implementations available
- **Quality:** Provides reasonable video quality for web delivery
- **Compatibility:** Wide historical support across browsers and platforms

### Current Status
As of 2024, Theora support is being deprecated across major browsers due to:
- Superior alternatives (H.264, VP9, AV1)
- Better compression efficiency
- Reduced maintenance burden
- Shift toward standardized modern codecs

## Browser Support Table

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 4 | 119 (Last version) | Deprecated starting v120 |
| **Firefox** | 3.5 | 129 (Last version) | Removed starting v130 |
| **Safari** | Never | Never | No support |
| **Edge** | 17 | 121 (Last version) | Deprecated starting v122 |
| **Opera** | 10.5 | 105 (Last version) | Deprecated starting v106 |
| **iOS Safari** | Never | Never | No support |
| **Android Browser** | Never | Never | No support |
| **Opera Mini** | Never | Never | No support |
| **Samsung Internet** | Never | Never | No support |

### Mobile Browser Support

| Browser | Support |
|---------|---------|
| **Android Firefox** | Yes (144) |
| **Android UC Browser** | Yes (15.5) |
| **Android QQ Browser** | Yes (14.9) |
| **KaiOS** | Yes (2.5+) |
| **Opera Mobile** | Never |
| **Chrome Mobile** | Never |
| **IE Mobile** | Partial (10, 11) |
| **BlackBerry** | No |

## Key Deprecation Timeline

### Chrome
- **Supported:** v4 through v119
- **Deprecated:** v120+
- **Reason:** Shifting to modern video codecs with better compression ratios

### Firefox
- **Supported:** v3.5 through v129
- **Removed:** v130+
- **Status:** Complete removal planned

### Edge (Chromium-based)
- **Supported:** v17 through v121
- **Deprecated:** v122+
- **Reason:** Aligned with Chromium deprecation policy

### Opera
- **Supported:** v10.5 through v105
- **Deprecated:** v106+
- **Reason:** Chromium engine deprecation policy

## Implementation Notes

### Video Playback
To use Ogg/Theora video in HTML5, use the `<video>` element with appropriate source:

```html
<video controls width="640" height="480">
  <source src="video.ogv" type="video/ogg">
  Your browser does not support the video tag.
</video>
```

### Codec Specification
```
MIME Type: video/ogg
File Extension: .ogv (video), .oga (audio), .ogg (container)
Codec: Theora (video), Vorbis/Opus (audio)
```

### Considerations for Modern Development

**Deprecated Format:** Theora is deprecated in favor of:
- **H.264/AVC** - Widely supported, industry standard
- **VP9** - Open codec with excellent compression
- **AV1** - Next-generation open codec with superior compression
- **VP8** - Predecessor to VP9, still supported in many browsers

### Fallback Strategy

For modern web applications, use a video format fallback strategy:

```html
<video controls width="640" height="480">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <source src="video.ogv" type="video/ogg">
  Your browser does not support HTML5 video.
</video>
```

## Platform-Specific Notes

### Desktop Browsers
- **Chrome, Firefox, Edge, Opera:** All actively removing Theora support
- **Safari:** Never supported Theora; uses H.264/HEVC
- **Internet Explorer:** Limited support (IE9-11 marked as partial)

### Mobile Platforms
- **iOS:** No support across any browser (Safari enforces H.264/HEVC)
- **Android:** Variable support; modern Android browsers no longer support Theora
- **Specialized Platforms:** KaiOS and some niche browsers retain support

## Migration Guide

### For Existing Content
If you have Theora-encoded videos, consider:
1. Re-encoding to MP4 (H.264) for broad compatibility
2. Using WebM (VP9) for smaller file sizes
3. Implementing a video hosting service that handles format conversion
4. Adding multiple source formats for progressive enhancement

### For New Projects
- Do **not** use Theora for new projects
- Use H.264/MP4 as baseline for maximum compatibility
- Add WebM (VP9) or AV1 for modern browsers
- Consider video streaming services (HLS, DASH) for adaptive bitrate

## Related Resources

### Official Documentation
- [Theora Official Website](https://theora.org/doc/)
- [Wikipedia - Theora](https://en.wikipedia.org/wiki/Theora)

### Browser Deprecation Notices
- [Chrome Platform Status - Deprecate and remove Theora support](https://chromestatus.com/feature/5158654475239424)
- [Firefox Bug Tracker - Investigate removing Theora support](https://bugzilla.mozilla.org/show_bug.cgi?id=1860492)

### Alternative Codecs
- [WebM Project](https://www.webmproject.org/) - VP8/VP9 codec container
- [AV1 Codec Alliance](https://aomedia.org/) - Next-generation video codec
- [H.264 Standards](https://www.itu.int/rec/T-REC-H.264/en) - Industry standard codec

## Summary

Theora/Ogg is a legacy video format that is being actively deprecated across all major browsers. While it provided a royalty-free alternative to proprietary codecs, modern alternatives offer superior compression ratios and are now standardized across the web. **New projects should not use Theora.** Existing content should be migrated to contemporary formats such as H.264 (MP4) or VP9 (WebM) for continued compatibility and optimal performance.

---

**Last Updated:** December 2024
**Feature Status:** Deprecated and being removed from major browsers
