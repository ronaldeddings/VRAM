# Animated PNG (APNG)

## Overview

**Animated PNG (APNG)** is a file format that extends the PNG specification to support animated images. Like animated GIFs, APNG allows sequences of frames to create animations, but with the advanced features of PNG: **24-bit color support** and **alpha transparency** (including semi-transparent pixels).

This makes APNG ideal for creating high-quality animations with superior color fidelity and transparency compared to the legacy GIF format.

## Description

Where support for APNG is missing, only the first frame is displayed.

## Specification

- **Status**: Candidate Recommendation (CR)
- **Specification**: [PNG Specification (W3C)](https://www.w3.org/TR/png)

The APNG format was standardized as an extension to the PNG specification and has been adopted by major browsers.

## Categories

- **PNG Image Format**

## Benefits and Use Cases

### Benefits

- **Superior Color Quality**: Full 24-bit true color support (16 million colors) compared to GIF's 256-color palette
- **Alpha Transparency**: Full alpha channel support for semi-transparent pixels and smooth edges
- **Lossless Compression**: Maintains visual quality without compression artifacts
- **Modern Alternative to GIF**: Provides animated capabilities with modern image features
- **Smaller File Sizes**: Typically produces smaller files than equivalent GIFs while maintaining better quality
- **Wide Browser Support**: Now supported by all modern browsers (93.11% global usage)

### Use Cases

1. **Web Animations**: Animated icons, loaders, and decorative elements
2. **UI Feedback**: Loading indicators, status animations, hover effects
3. **Rich Media**: Game graphics, interactive media, and visual content
4. **Marketing**: Animated banners and promotional graphics
5. **Accessibility**: Animations with transparency for complex backgrounds
6. **Scientific Visualization**: Charts and data visualizations with animation
7. **Product Photography**: Step-by-step visual guides with superior quality

## Browser Support

### Summary by Browser

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Firefox** | 3.0 (2008) | Full support |
| **Opera** | 9.5 (2008) | Full support |
| **Safari** | 8.0 (2014) | Full support |
| **Chrome** | 59 (2017) | Full support |
| **Edge** | 79 (2020) | Full support |
| **iOS Safari** | 8.0 (2014) | Full support |
| **Android Browser** | 142+ | Full support |
| **Internet Explorer** | Not supported | - |

### Global Usage

- **Full Support**: 93.11% of users
- **No Support**: 6.89% of users
- **Partial Support**: 0%

### Desktop Browsers

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 59 | Since Chrome 59 (April 2017) |
| Firefox | 3 | Since Firefox 3 (2008) - longest support |
| Safari | 8 | Since Safari 8 (2014) |
| Edge | 79 | Since Edge 79 (January 2020) |
| Opera | 46 | Since Opera 46 (2016) with Chromium base |
| IE 11 | ❌ No support | Not supported |

### Mobile Browsers

| Platform | Minimum Version | Notes |
|----------|-----------------|-------|
| iOS Safari | 8.0 | Since iOS 8 (2014) |
| Android Browser | 142+ | Modern Android versions |
| Chrome Android | 142+ | Latest versions |
| Firefox Android | 144+ | Latest versions |
| Samsung Browser | 7.2 | Since Samsung 7.2 |
| Opera Mobile | 10+ | Since Opera Mobile 10 |

### Legacy/Limited Support

| Browser | Status |
|---------|--------|
| Opera Mini | ❌ No support (all versions) |
| Internet Explorer | ❌ No support (all versions) |
| Blackberry | ❌ No support |
| IE Mobile | ❌ No support |

## Progressive Enhancement Strategy

For browsers without native APNG support, consider these approaches:

### 1. Graceful Fallback
```html
<img src="animation.apng" alt="Animated icon">
```
The image will display the first frame in unsupporting browsers, which is often acceptable.

### 2. Picture Element with Fallback
```html
<picture>
  <source srcset="animation.apng" type="image/apng">
  <img src="animation.gif" alt="Animated icon">
</picture>
```
This approach uses GIF as a fallback for older browsers.

### 3. Canvas-Based Polyfill
For applications requiring APNG support in older browsers, use a polyfill:
- **apng-canvas**: A JavaScript library that provides APNG support via canvas rendering in browsers that don't natively support it

## Technical Notes

### Important Considerations

- **First Frame Display**: Where APNG is not supported, only the first frame of the animation will be displayed. This should ideally be the most representative or static frame.
- **Browser Compatibility**: Almost all modern browsers support APNG natively (93.11% global usage)
- **Fallback Strategy**: The first frame should be meaningful to ensure a decent user experience even in unsupporting browsers
- **File Format**: APNG files are still standard PNG files with additional animation chunks, making them compatible with PNG decoders that ignore unknown chunks

### Related Standards

- **PNG (Portable Network Graphics)**: Base specification
- **GIF (Graphics Interchange Format)**: Legacy animated image format
- **WebP Animation**: Alternative modern format with potentially better compression
- **AVIF**: Newer format with advanced compression (limited animation support)

## Known Issues

None reported. APNG is a stable, well-supported standard with no known implementation issues.

## Related Resources

### Official Documentation
- [W3C PNG Specification](https://www.w3.org/TR/png)
- [Wikipedia: Animated PNG](https://en.wikipedia.org/wiki/APNG)

### Tools and Libraries
- [APNG Canvas Polyfill](https://github.com/davidmz/apng-canvas) - JavaScript library providing APNG support via canvas for older browsers
- [Chrome Extension](https://chrome.google.com/webstore/detail/ehkepjiconegkhpodgoaeamnpckdbblp) - Additional APNG support for Chrome (historical)

### Related Features
- [WebP Animation](/features/webp) - Modern alternative format
- [GIF Format](/features/gif) - Legacy animated image format
- [Alpha Channel/PNG](/features/png) - Base PNG image format support
- [CSS Animations](/features/css-animation) - CSS-based animation alternative

### Issue Tracking
- [Chromium Issue #437662](https://code.google.com/p/chromium/issues/detail?id=437662) - Historical issue (fixed in Chrome 59)

## Implementation Examples

### Basic HTML Usage
```html
<!-- Simple APNG image -->
<img src="loading-spinner.apng" alt="Loading indicator">

<!-- With fallback -->
<picture>
  <source srcset="animation.apng" type="image/apng">
  <img src="animation.gif" alt="Animation fallback">
</picture>
```

### CSS Background
```css
.animated-background {
  background-image: url('pattern.apng');
  background-repeat: repeat;
}
```

### Canvas-based Playback (for Polyfill)
```javascript
// Using apng-canvas library for manual APNG playback
const img = document.querySelector('img[src$=".apng"]');
const canvas = document.createElement('canvas');
// Polyfill would handle animation playback here
```

## Summary

APNG is a stable, widely-supported modern image format that successfully combines the benefits of PNG (true color, alpha transparency) with animation capabilities. With 93.11% global browser support and native implementation in all major modern browsers, APNG can be safely used in contemporary web applications with simple GIF fallbacks for the small percentage of legacy users.

---

**Last Updated**: 2025-12-13
**Data Source**: CanIUse - Animated PNG Feature Database
