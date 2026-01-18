# HEIF/HEIC Image Format

## Overview

**HEIF/HEIC** (High Efficiency Image File Format / High Efficiency Image Container) is a modern image format based on the [HEVC video format](https://caniuse.com/hevc). It offers superior compression compared to traditional formats like WebP, JPEG, PNG, and GIF, making it an ideal choice for reducing file sizes while maintaining visual quality.

## Description

HEIC generally has better compression than WebP, JPEG, PNG and GIF. It is hard for browsers to support HEIC because it is [complex and expensive to license](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding#Patent_licensing). [AVIF](https://caniuse.com/avif) and [JPEG XL](https://caniuse.com/jpegxl) provide free licenses and are designed to supersede HEIC.

## Specification Status

- **Status**: Other (non-standard)
- **Official Specification**: [Nokia HEIF Technical Documentation](https://nokiatech.github.io/heif/technical.html)

## Categories

- Other

## Use Cases & Benefits

### Advantages
- **Superior Compression**: Provides better compression ratios than WebP, JPEG, PNG, and GIF
- **Quality Preservation**: Maintains high image quality at smaller file sizes
- **Modern Format**: Built on proven video compression technology (HEVC)

### Challenges
- **Licensing Costs**: Complex and expensive patent licensing makes browser adoption difficult
- **Limited Browser Support**: Currently supported only in recent Safari versions
- **Patent Complexity**: Multiple patent holders make standardization challenging

### Recommended Alternatives
For broader browser support and open licensing, consider these alternatives:
- **[AVIF](https://caniuse.com/avif)** - Free license, modern compression
- **[JPEG XL](https://caniuse.com/jpegxl)** - Free license, designed as HEIC successor

## Browser Support

### Support Summary

| Browser | Status | First Supported Version |
|---------|--------|------------------------|
| **Safari** | ✅ Supported | 17.0 |
| **iOS Safari** | ✅ Supported | 17.0 |
| **Chrome** | ❌ Not Supported | — |
| **Firefox** | ❌ Not Supported | — |
| **Edge** | ❌ Not Supported | — |
| **Opera** | ❌ Not Supported | — |
| **Opera Mobile** | ❌ Not Supported | — |
| **Chrome Mobile** | ❌ Not Supported | — |
| **Firefox Mobile** | ❌ Not Supported | — |
| **UC Browser** | ❌ Not Supported | — |
| **Samsung Internet** | ❌ Not Supported | — |
| **QQ Browser** | ❌ Not Supported | — |
| **Baidu Browser** | ❌ Not Supported | — |
| **KaiOS** | ❌ Not Supported | — |
| **Opera Mini** | ❌ Not Supported | — |
| **BlackBerry** | ❌ Not Supported | — |
| **IE Mobile** | ❌ Not Supported | — |
| **Internet Explorer** | ❌ Not Supported | — |

### Detailed Safari Support

**Desktop Safari:**
- **Unsupported (with note)** - Versions 11.0 through 16.6
  - *Note: Was supported natively in macOS/iOS, but was not supported in Safari*
- **Supported** - Safari 17.0 and later
  - Safari 17.0–17.6
  - Safari 18.0–18.5+
  - Safari 26.0–26.2
  - Safari TP (Technology Preview)

**iOS Safari:**
- **Unsupported (with note)** - iOS 11.0 through 16.5
  - *Note: Was supported natively in macOS/iOS, but was not supported in Safari*
- **Unsupported (no note)** - iOS 16.6–16.7
- **Supported** - iOS 17.0 and later
  - iOS 17.0–17.6+
  - iOS 18.0–18.5+
  - iOS 26.0–26.1

## Global Usage Statistics

- **Supported Usage**: 9.07% of tracked web users
- **Partial Support**: 0% (no partial implementations tracked)

## Important Notes

### Native Operating System Support
The HEIF format has native support in macOS and iOS at the operating system level, allowing these platforms to handle HEIF images natively. However, Safari browser support for displaying HEIF images in web pages came much later, only starting with Safari 17.0.

### Migration Path
For web developers, HEIF is currently a Safari-exclusive format with limited adoption. Consider:
1. Using HEIF for Safari-only applications (iOS/macOS native apps)
2. Using AVIF or JPEG XL for broader cross-browser support
3. Providing fallback formats (JPEG, PNG, or WebP) for non-Safari browsers

## Related Links

- [Wikipedia: High Efficiency Image File Format](https://en.wikipedia.org/wiki/High_Efficiency_Image_File_Format)
- [Firefox Support Tracking](https://bugzilla.mozilla.org/show_bug.cgi?id=HEIF)
- [WebKit Support Tracking](https://bugs.webkit.org/show_bug.cgi?id=230035)

## Related Features

- [AVIF Image Format](https://caniuse.com/avif)
- [JPEG XL Image Format](https://caniuse.com/jpegxl)
- [HEVC Video Format](https://caniuse.com/hevc)
- [WebP Image Format](https://caniuse.com/webp)

---

*Documentation generated from CanIUse feature data. Last updated based on current browser support statistics.*
