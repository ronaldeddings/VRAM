# WebM Video Format

## Overview

WebM is a multimedia format designed to provide a royalty-free, high-quality open video compression format for use with HTML5 video. It supports the video codecs VP8 and VP9, offering a modern alternative to proprietary video formats.

## Description

WebM is an open-source video format that was created as part of the HTML5 video standardization effort. It eliminates the need for proprietary licensing fees by providing a completely free codec solution. The format supports both VP8 and VP9 video codecs and is optimized for web delivery with excellent compression rates and quality retention.

## Specification Status

**Current Status:** Other

**Official Specification:** [WebM Project](https://www.webmproject.org)

The WebM format is maintained and developed by the WebM Project, which is an open project supported by major browser vendors and technology companies.

## Categories

- Other

## Benefits & Use Cases

### Primary Advantages

- **Royalty-Free:** No licensing fees required for encoding or playback
- **Open Source:** Fully open-source implementation and specifications
- **Excellent Compression:** High-quality video at smaller file sizes compared to alternatives
- **Web Optimization:** Designed specifically for web and HTML5 delivery
- **Modern Codecs:** Supports both VP8 and VP9, with VP9 providing superior compression

### Common Use Cases

- Streaming video content on websites
- Fallback video format for browsers that support it
- Video content distribution without licensing concerns
- Progressive enhancement alongside other video formats (H.264, VP9)
- Open-source projects and platforms requiring license-free codecs

## Browser Support

### Support Legend

- **y** = Supported
- **a** = Partial support
- **p** = Partial support
- **n** = Not supported

### Desktop Browsers

| Browser | First Support | Latest Version | Support Level | Notes |
|---------|---------------|-----------------|---------------|-------|
| **Chrome** | 25 | 146+ | Full | Native support since v25 |
| **Firefox** | 28 | 148+ | Full | Full support from v28 onward |
| **Edge** | 79 | 143+ | Full | Supported since Chromium migration (v79+) |
| **Safari** | 16.0 | 26.2+ | Full | Full support from macOS Sierra (16.0+) |
| **Opera** | 16 | 122+ | Full | Full support from v16 onward |
| **Internet Explorer** | Never | - | No | Not supported in any version |

### Mobile Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **iOS Safari** | 17.4+ | Full support; partial support (requires macOS 11.3+) in earlier versions |
| **Android Browser** | 142+ | Full support in modern versions |
| **Chrome for Android** | 142+ | Full support |
| **Firefox for Android** | 144+ | Full support |
| **Samsung Internet** | 5.0+ | Full support from v5.0 onward |
| **Opera Mobile** | 80+ | Full support from v80 onward |
| **UC Browser** | 15.5+ | Full support |
| **Android UC** | 15.5+ | Full support |
| **QQ Browser** | 14.9+ | Full support |
| **Baidu Browser** | 13.52+ | Full support |
| **KaiOS** | 2.5+ | Full support |
| **Opera Mini** | Never | Not supported in any version |
| **IE Mobile** | Never | Not supported (partial in v10-11) |
| **Blackberry** | Never | Not supported |

## Historical Support Details

### Chrome
- **Early support (v6-24):** Partial support (#1)
- **Full support (v25+):** Complete codec support
- **Current:** Full support in all modern versions

### Firefox
- **Early support (v4-27):** Partial support (#1)
- **Full support (v28+):** Complete codec support
- **Current:** Full support in all modern versions

### Safari
- **v3.2-5.1:** Partial support
- **v6-12:** Partial support with system codec installation (#3)
- **v12.1-13.1:** Partial support (VP8 codec #4)
- **v14:** Multiple partial support variations (#4, #5, #6)
- **v14.1-15.6:** Partial support with Big Sur requirement (#7, #8)
- **v16.0+:** Full support (#8)

### Edge
- **v12-18:** Partial support
- **v79+:** Full support (Chromium-based)

### Opera
- **v10.6-15:** Partial support (#1)
- **v16+:** Full support

### iOS Safari
- **v12.2-15.8:** Partial support with various codec restrictions (#4, #5, #8)
- **v17.4+:** Full support (#8)

## Important Notes

### Codec Support Variations

**Note #1:** Older browser versions did not support all codecs. Early implementations had limited codec availability.

**Note #2:** Older Edge versions did not support progressive sources. This was resolved in Chromium-based Edge.

**Note #3:** Can be enabled in Internet Explorer and Safari for macOS by manually installing the codecs in the operating system. This requires additional system-level setup.

### Apple Platform Details

**Note #4:** Supports [VP8 codec used in WebRTC](https://webkit.org/blog/8672).

**Note #5:** Supports [VP9 codec used in WebRTC](https://webkit.org/blog/10929) (off by default).

**Note #6:** Supports [VP9 WebM used in MediaSource](https://bugs.webkit.org/show_bug.cgi?id=216652#c1) on [macOS Big Sur or later](https://trac.webkit.org/changeset/264747/webkit).

**Note #7:** Safari 14.1 – 15.6 has full support of WebM, but requires macOS 11.3 Big Sur or later.

### Universal Notes

**Note #8:** Does not support alpha transparency. WebM video files do not include an alpha channel for transparency effects.

## Global Support Statistics

- **Full Support (y):** 91.65% of users
- **Partial Support (a):** 1.34% of users
- **No Support (n):** Remaining percentage

## Recommended Implementation

### HTML5 Video Implementation

For robust video delivery, use WebM as part of a format fallback strategy:

```html
<video width="640" height="360" controls>
  <source src="video.webm" type="video/webm">
  <source src="video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### Format Priority Strategy

1. **Primary:** WebM (VP9 codec) - Best compression
2. **Fallback:** H.264/MP4 - Maximum compatibility
3. **Alternative:** WebM (VP8 codec) - Good compression, older browser support

### Considerations

- Test video playback across target browsers before deployment
- Consider using a video player library (Video.js, Plyr, etc.) for consistent behavior
- Be aware of alpha transparency limitations if transparency is required
- For iOS users on older versions, ensure MP4 fallback is available
- Monitor codec support in your target audience's browser versions

## Specification & Resources

### Official Links

- [WebM Official Website](https://www.webmproject.org) - Project homepage and specifications
- [WebM Wikipedia Article](https://en.wikipedia.org/wiki/WebM) - Historical context and technical overview

### Related Standards

- Parent Standard: [HTML5 Video Element](https://html.spec.whatwg.org/multipage/media.html)
- Related Codecs: VP8, VP9, Opus (audio)
- Keywords: Matroska

### Related Features

For comprehensive video support, also consider:
- H.264/MPEG-4 Part 10 (video/mp4)
- VP9 video codec specifications
- Opus audio codec for WebM audio

## Summary

WebM has achieved excellent support across modern browsers (91.65% full support) with particular strength in:
- Desktop browsers (Chrome, Firefox, Edge, Opera, Safari 16+)
- Android devices and browsers
- Mobile platforms (iOS 17.4+)

The format remains a viable choice for web video delivery, especially when combined with H.264/MP4 as a fallback for maximum compatibility. The gradual addition of full Safari support starting with version 16.0 has significantly improved WebM's viability across all major platforms.

---

*Last updated: 2025-12-13*
*Data source: CanIUse.com WebM feature database*
