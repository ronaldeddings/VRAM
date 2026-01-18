# SVG Fonts

## Overview

SVG Fonts is a method of using fonts defined as SVG shapes. However, this feature has been **removed from SVG 2.0** and is now considered a **deprecated feature** with support being actively removed from browsers.

## Specification Status

| Aspect | Details |
|--------|---------|
| **Spec Status** | Recommendation (REC) |
| **Specification URL** | [SVG 1.1 Fonts](https://www.w3.org/TR/SVG11/fonts.html) |
| **Current Status** | Deprecated - removed from SVG 2.0 |
| **Deprecation Info** | [SVG 2.0 Changes](https://www.w3.org/TR/SVG2/changes.html#fonts) |

## Category

- **SVG**

## Description

SVG Fonts allow developers to embed font definitions directly within SVG documents using SVG shape primitives. While this was a valid approach in SVG 1.1, the feature has been officially removed from the SVG 2.0 specification and is being deprecated across all major browsers.

## Use Cases & Benefits (Historical)

> Note: These use cases are primarily historical, as SVG Fonts are deprecated and should not be used for new projects.

- Embedding custom fonts directly within SVG documents
- Ensuring font rendering consistency in SVG graphics
- Reducing external font file dependencies (historically)
- Creating vector-based font definitions alongside vector graphics

## Browser Support

### Support Legend

- **y** - Full support
- **n** - No support
- **p** - Partial support
- **n #[digit]** - No support with note reference

### Support Table

| Browser | Versions | Status | Notes |
|---------|----------|--------|-------|
| **Chrome** | 4-37 | ✅ Supported | Removed from Chrome 38+ (except Windows Vista/XP) |
| **Chrome** | 38-50 | ⚠️ Limited | Windows Vista and XP only |
| **Chrome** | 51+ | ❌ Not Supported | Fully removed |
| **Safari** | 3.2-18.5+ | ✅ Supported | Continues to support |
| **Firefox** | All versions | ❌ Not Supported | Never supported |
| **Edge** | All versions | ❌ Not Supported | No support across all versions |
| **IE** | 6-8 | ⚠️ Partial | Limited partial support |
| **IE** | 5.5, 9-11 | ❌ Not Supported | No support |
| **Opera** | 9-24 | ✅ Supported | Removed from Opera 25+ |
| **Opera** | 25-36 | ⚠️ Limited | Phased removal with notes |
| **Opera** | 37+ | ❌ Not Supported | Fully removed |
| **iOS Safari** | 3.2-18.5+ | ✅ Supported | Continues to support |
| **Android Browser** | 3-4.4.4 | ✅ Supported | Limited to older versions |
| **Android Browser** | 2.1-2.3, 142+ | ❌ Not Supported | Not supported |
| **Opera Mobile** | 10-12.1 | ✅ Supported | Supported in older versions |
| **Opera Mobile** | 80+ | ❌ Not Supported | Removed |
| **Opera Mini** | All versions | ⚠️ Limited | SVG images only, not in HTML |
| **Samsung Internet** | 4 | ✅ Supported | Early version only |
| **Samsung Internet** | 5+ | ❌ Not Supported | Removed from version 5+ |
| **BlackBerry** | 7, 10 | ✅ Supported | Limited support |

### Current Support Summary

- **Actively Supported**: Safari and iOS Safari (Apple ecosystem)
- **Deprecated/Removed**: Chrome, Firefox, Edge, Opera, most Android browsers
- **Never Supported**: Firefox, Edge (all versions)
- **Partial/Conditional**: IE 6-8, Opera Mini

## Global Usage

- **Current Usage**: 10.7% of websites
- **With Fallback Support**: 0% (no partial implementation tracking)

## Migration & Alternatives

Since SVG Fonts are deprecated, consider these modern alternatives:

1. **WOFF/WOFF2** - Web Open Font Format (recommended)
   - Modern, compressed font format
   - Excellent browser support
   - Smaller file sizes

2. **TrueType/OpenType** - Traditional font formats
   - Universal support
   - Suitable fallback option

3. **System Fonts** - OS-level font stacks
   - No external font dependencies
   - Best performance

4. **Google Fonts/Font Libraries** - Cloud-hosted font services
   - Easy implementation
   - Regular updates
   - No maintenance required

## Important Notes

1. **No longer use SVG Fonts for new projects** - The feature is deprecated and being removed from browsers
2. **Windows limitation in Chrome** - Chrome 38-50 only supports SVG Fonts on Windows Vista and XP
3. **Opera Mini limitations** - SVG Fonts in Opera Mini only work within SVG images, not in HTML documents
4. **Safari continues support** - Apple's Safari is among the few browsers continuing to support SVG Fonts

## Related Resources

### Technical Documentation

- [Blog Post: Why are SVG Fonts so different?](http://jeremie.patonnier.net/post/2011/02/07/Why-are-SVG-Fonts-so-different)
- [Blog Post: The iPad and SVG Fonts in Mobile Safari](https://opentype.info/blog/2010/04/13/the-ipad-and-svg-fonts-in-mobile-safari.html)

### Parent Feature

- [Font Face API](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)

## Recommendation

**Do not use SVG Fonts for new web projects.** Instead, use modern font delivery methods such as WOFF/WOFF2 through `@font-face` declarations or established font services. If you have existing SVG Fonts, plan migration to a modern font format as browser support continues to decline.
