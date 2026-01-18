# MPEG-4/H.264 Video Format Support

## Overview

**MPEG-4/H.264** is one of the most commonly used video compression formats on the web today. It provides excellent compression efficiency while maintaining high video quality, making it ideal for streaming and progressive download scenarios.

## Feature Details

- **Full Name**: MPEG-4 Part 10 (H.264/AVC - Advanced Video Coding)
- **Status**: Other (widely adopted de facto standard)
- **Usage**: 93.59% of users globally support this format
- **Category**: Media & Video Formats

## Description

H.264/MPEG-4 AVC is an industry-standard video compression format that offers superior compression efficiency compared to earlier standards. It is the codec of choice for many video platforms, including YouTube, Netflix, and many streaming services. The format is supported across virtually all modern browsers and devices.

## Specification & Standards

For detailed technical specifications, refer to the official specification document:
[H.264/MPEG-4 AVC Technical Specification](http://ip.hhi.de/imagecom_G1/assets/pdfs/csvt_overview_0305.pdf)

## Typical Use Cases

- **Video Streaming**: Primary codec for platforms like YouTube and Netflix
- **Web Video Hosting**: Standard format for embedded video content
- **Mobile Video Playback**: Native support across iOS and Android devices
- **Video Conferencing**: Used in many VoIP and conferencing applications
- **Broadcasting**: Suitable for both live and on-demand content delivery

## Benefits

- **Excellent Compression**: Achieves 2-10x better compression than MPEG-2
- **Quality at Lower Bitrates**: Maintains acceptable quality with reduced bandwidth usage
- **Universal Support**: Supported across desktop, mobile, and tablet devices
- **Licensing Ecosystem**: Patent pool available, reducing licensing complexity
- **Hardware Acceleration**: Many devices feature dedicated H.264 decoding hardware
- **Industry Standard**: De facto standard for professional video production and streaming

## Browser Support

### Support Legend

- **✅ Full Support (y)**: Complete support for H.264/MP4 video
- **⚠️ Partial Support (a)**: Limited support, may require additional configuration or conditions
- **❌ No Support (n)**: Feature not supported

### Desktop Browsers

| Browser | First Supported | Status | Notes |
|---------|-----------------|--------|-------|
| Chrome | 4 | ✅ Full Support | All versions 4+ |
| Firefox | 35 | ✅ Full Support | Windows 7+, Linux with system libraries |
| Safari | 3.2 | ✅ Full Support | Since version 3.2 |
| Edge | 12 | ✅ Full Support | All versions 12+ |
| Opera | 25 | ✅ Full Support | Since version 25 (Chromium-based) |
| Internet Explorer | 9 | ✅ Full Support | IE 9, 10, 11 supported |

### Mobile & Tablet Browsers

| Browser | Support Status | Notes |
|---------|----------------|-------|
| iOS Safari | ✅ Full Support | Since iOS 3.2 |
| Android Browser | ⚠️ Partial Support | Android 2.1-4.3 partial; 4.4+ full support |
| Android Chrome | ✅ Full Support | Latest versions |
| Android Firefox | ✅ Full Support | Latest versions |
| Opera Mini | ❌ No Support | Not supported |
| Samsung Internet | ✅ Full Support | All versions from 4+ |

### Complete Version Support Table

#### Chrome
- Versions 4-146: Fully supported
- Consistent support across all modern versions

#### Firefox
- Versions 1-20: Not supported
- Versions 21-34: Partial support (requires OS-level H.264 libraries)
- Versions 35+: Fully supported
- Windows 7+: Full support since v21
- Linux: Full support since v26 (with system libraries)

#### Safari
- Version 3.1: Not supported
- Versions 3.2-26.2: Fully supported
- Technical Preview (TP): Fully supported

#### Edge
- Versions 12-143: Fully supported
- Consistent support across all versions

#### Opera
- Versions 9-24: Not supported
- Versions 25-122: Fully supported

#### iOS Safari
- iOS 3.2+: Fully supported across all versions

#### Android
- 2.1-4.3: Partial support (marked as "a")
- 4.4+: Full support
- Note: Android 2.3 requires specific handling for video playback

#### Internet Explorer
- 5.5-8: Not supported
- 9-11: Full support

#### Opera Mini
- All versions: Not supported

#### Other Platforms
- BlackBerry 7+: Supported
- Opera Mobile: Supported since v11
- IE Mobile: Supported (v10-11)
- Android UC Browser: Supported (v15.5+)
- Samsung Internet: Supported (v4+)
- Baidu Browser: Supported (v13.52+)
- KaiOS: Supported (v2.5+)

## Known Issues & Limitations

### Performance Issues

**Chrome H.264 Performance Problems**: Chrome may experience performance issues when playing long H.264 videos. For extended video content, consider optimizing video quality or implementing adaptive bitrate streaming.

*Reference*: [HTML5 Video Problems in Chrome](http://oddlystudios.com/blog/html5-video-problems-in-chrome/)

### Multi-Audio Track Support

Browsers handle multiple audio tracks differently:

- **Internet Explorer 11**: Supports multiple audio tracks correctly
- **Firefox**: Plays the last audio track in the file
- **Chrome**: Plays the first audio track in the file

For multi-language video support, consider using separate video files or implementing audio track switching at the application level.

### Windows 7 Resolution Limitations

In Windows 7, the maximum supported resolution is **1920 × 1088 pixels** for both software and DXVA (DirectX Video Acceleration) decoding.

*Reference*: [Microsoft Documentation - H.264 Video Decoder](https://docs.microsoft.com/en-us/windows/win32/medfound/h-264-video-decoder)

## Implementation Notes

### Partial Support Clarification

Partial support ("a" status) in Firefox refers to:
- Lack of native OS X support in earlier versions
- Missing support on some non-Android Linux platforms
- Dependency on system-level H.264 libraries on Linux

### Android 2.3 Special Requirements

Android 2.3 browser requires specific handling to play H.264 videos properly. Web developers should implement fallback mechanisms or platform detection for older Android devices.

*Reference*: [Making HTML5 Video Work on Android Phones](https://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/)

## HTML5 Video Tag Usage

```html
<video width="640" height="360" controls>
  <source src="video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### Checking for Support

```javascript
// Check if browser supports H.264 video
const video = document.createElement('video');
const canPlayH264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '';

if (canPlayH264) {
  console.log('Browser supports H.264 video');
} else {
  console.log('Browser does not support H.264 video');
}
```

## Related References

- [Wikipedia: H.264/MPEG-4 AVC](https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC)
- [Firefox Extension for H.264 Support (Windows 7)](http://www.interoperabilitybridges.com/html5-extension-for-wmp-plugin)

## Related Formats

This feature is part of the broader **video** format family. Related video formats and codecs include:

- WebM (VP8/VP9)
- Theora (Ogg)
- AV1
- HEVC/H.265

## Global Usage Statistics

- **Global Support**: 93.59% of users have browsers with H.264 support
- **Partial Support**: 0% (counted separately)
- **Unsupported**: ~6.41% of users

With over 93% global support, H.264/MP4 is a safe choice for primary video delivery on the web.

---

*Documentation generated from CanIUse feature data. Last updated: 2025-12-13*
