# Media Queries: resolution feature

## Overview

The CSS Media Queries `resolution` feature allows developers to apply styles based on the device pixel density (device pixels per CSS unit). This is essential for optimizing layouts and assets for different screen resolutions, from standard displays to high-DPI devices like Retina screens.

## Description

This feature enables media queries to be set based on the device pixels used per CSS unit. The standard approach uses `min-resolution` and `max-resolution` properties with units like `dpi`, `dpcm`, or `dppx`. Some browsers also support the non-standard `-webkit-device-pixel-ratio` syntax for backwards compatibility.

The `resolution` media feature is particularly useful for:
- Serving high-resolution images on Retina or high-DPI displays
- Adjusting font rendering for crisp text on dense pixel displays
- Optimizing layouts for different device pixel ratios
- Progressive enhancement of visual assets

## Specification

- **Specification**: [CSS Media Queries Level 4 - resolution](https://www.w3.org/TR/mediaqueries-4/#resolution)
- **Status**: Candidate Recommendation (CR)
- **First Published**: Part of Media Queries Level 3, refined in Level 4

## Categories

- CSS
- CSS3

## Usage

### Basic Syntax

```css
/* Using dppx (device pixels per CSS pixel) */
@media (min-resolution: 2dppx) {
  /* Styles for high-DPI displays */
}

/* Using dpi (dots per inch) */
@media (min-resolution: 192dpi) {
  /* Styles for 192+ DPI displays */
}

/* Using dpcm (dots per centimeter) */
@media (min-resolution: 75dpcm) {
  /* Styles for high-resolution displays */
}

/* Using x unit (alias for dppx) - modern approach */
@media (min-resolution: 2x) {
  /* Styles for Retina and high-DPI devices */
}
```

### Practical Examples

#### Responsive Images for High-DPI Displays

```css
.hero-image {
  background-image: url('image-1x.jpg');
}

@media (min-resolution: 2dppx) {
  .hero-image {
    background-image: url('image-2x.jpg');
  }
}

@media (min-resolution: 3dppx) {
  .hero-image {
    background-image: url('image-3x.jpg');
  }
}
```

#### Font Rendering Optimization

```css
body {
  font-weight: 400;
}

@media (min-resolution: 2dppx) {
  /* Use lighter font weight on high-DPI displays */
  /* as pixels appear smaller and crisper */
  body {
    font-weight: 300;
  }
}
```

#### Range Syntax (Modern)

```css
/* Check for minimum resolution */
@media (min-resolution: 2dppx) {
  /* Retina and higher */
}

/* Check for maximum resolution */
@media (max-resolution: 1.99dppx) {
  /* Standard density displays */
}

/* Range syntax (newest browsers) */
@media (192dpi <= resolution <= 384dpi) {
  /* Mid-range DPI displays */
}
```

## Browser Support

### Summary by Browser

| Browser | First Full Support | Notes |
|---------|-------------------|-------|
| Chrome | 68 | Full support from version 68 onwards |
| Firefox | 62 | Full support from version 62 onwards |
| Safari | 16.0 | Full support from version 16.0 onwards |
| Edge | 79 | Full support from version 79 onwards |
| Opera | 55 | Full support from version 55 onwards |
| iOS Safari | 16.0 | Full support from iOS 16.0 onwards |
| Android | 142+ | Full support in recent versions |

### Detailed Support Matrix

#### Desktop Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | 4-67 | Partial | Supports non-standard `-webkit-device-pixel-ratio` and `-webkit-min-device-pixel-ratio` |
| Chrome | 68+ | Full | Complete standard support |
| Firefox | 3.5-15 | Partial | Only supports `dpi` unit; use `-moz-device-pixel-ratio` |
| Firefox | 16-61 | Partial | Missing `x` unit (alias for `dppx`) |
| Firefox | 62+ | Full | Complete standard support |
| Safari | 4-15.6 | Partial | Supports non-standard `-webkit-device-pixel-ratio` |
| Safari | 16.0+ | Full | Complete standard support |
| Edge Legacy | 12-18 | Partial | No `x` unit support; known bug with `min-resolution < 1dpcm` |
| Edge (Chromium) | 79+ | Full | Complete standard support |
| Opera | 9-12 | Partial | Supports non-standard `-webkit-device-pixel-ratio` |
| Opera | 12.1 | Full | Brief full support before regression |
| Opera | 15-54 | Partial | Missing `x` unit support |
| Opera | 55+ | Full | Complete standard support |

#### Mobile Browsers

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| iOS Safari | 4.0-15.6 | Partial | Supports non-standard `-webkit-device-pixel-ratio` |
| iOS Safari | 16.0+ | Full | Complete standard support |
| Android | 2.1-4.3 | Partial | Supports non-standard `-webkit-device-pixel-ratio` |
| Android | 4.4-4.4.4 | Partial | Missing `x` unit support |
| Android | 142+ | Full | Complete standard support |
| Opera Mini | All | Partial | Supports `dpi` unit only |
| Opera Mobile | 10-12 | Partial | Supports non-standard `-webkit-device-pixel-ratio` |
| Opera Mobile | 12.1 | Full | Full support |
| Opera Mobile | 15-79 | Partial | Missing `x` unit support |
| Opera Mobile | 80+ | Full | Complete standard support |
| Samsung Internet | 4-9.2 | Partial | Missing `x` unit support |
| Samsung Internet | 10.1+ | Full | Complete standard support |

## Global Usage Statistics

- **Full Support**: 92.11%
- **Partial Support**: 1.58%
- **No Support**: ~6.31%

## Benefits and Use Cases

### 1. **High-DPI Display Optimization**
Serve appropriately sized images and adjust rendering for Retina displays (2x, 3x pixel density) without impacting standard displays.

### 2. **Image Asset Management**
Implement responsive image strategies by serving different resolution versions based on device capabilities, reducing unnecessary data transfer on standard displays.

### 3. **Typography Enhancement**
Adjust font weights, sizes, and anti-aliasing strategies for high-resolution displays where pixels are smaller and crisper.

### 4. **Layout Tweaks**
Fine-tune spacing, border widths, and other layout properties to maintain visual consistency across different device pixel densities.

### 5. **Progressive Enhancement**
Provide baseline styling for all users while progressively enhancing the experience for users with high-DPI displays.

### 6. **Performance Optimization**
Reduce bandwidth consumption by avoiding unnecessary high-resolution assets on standard displays while ensuring quality on capable devices.

## Known Issues and Bugs

### Edge Legacy (v18 and below)
**Bug**: `min-resolution` values less than `1dpcm` are ignored.
- **Impact**: Media queries like `@media (min-resolution: 0.5dpcm)` will not work as expected
- **Workaround**: Use higher resolution values or update to Edge 79+ (Chromium-based)
- **Status**: Fixed in Edge 79+
- **Reference**: [JSFiddle demonstrating the bug](https://jsfiddle.net/behmjd5t/)

## Unit Support Notes

### Understanding Resolution Units

- **`dpi`** (dots per inch): Traditional unit, 1 dpi = ~0.039 dpcm
- **`dpcm`** (dots per centimeter): Metric equivalent, 1 dpcm ≈ 2.54 dpi
- **`dppx`** (device pixels per CSS pixel): Modern standard, most reliable across browsers
- **`x`** (alias for dppx): Newer, more intuitive syntax (e.g., `2x` for Retina)

### Browser-Specific Limitations

1. **Internet Explorer 9-11**: Supports `dpi` only, not `dppx` or `dpcm`
2. **Firefox 3.5-15**: Supports `dpi` only; use `-moz-device-pixel-ratio` for other units
3. **Webkit Browsers (older)**: Support non-standard `-webkit-device-pixel-ratio` instead of standard syntax
4. **Multiple browsers pre-2020**: Don't support `x` unit; use `2dppx` instead of `2x`
5. **Opera Mini**: Limited to `dpi` unit

## Related Technologies and Links

### Official Specifications and Standards

- [CSS Media Queries Level 4 - resolution feature](https://www.w3.org/TR/mediaqueries-4/#resolution)
- [CSS Values and Units Module Level 4 - x unit](https://drafts.csswg.org/css-values/#dppx)
- [WHATWG Compatibility Standard - webkit-device-pixel-ratio](https://compat.spec.whatwg.org/#css-media-queries-webkit-device-pixel-ratio)

### Implementation References

- [How to unprefix -webkit-device-pixel-ratio](https://www.w3.org/blog/CSS/2012/06/14/unprefix-webkit-device-pixel-ratio/)
- [WebKit Bug 78087: Implement the 'resolution' media query](https://bugs.webkit.org/show_bug.cgi?id=78087)
- [Chrome Status: Support 'x' as a resolution unit](https://chromestatus.com/feature/5150549246738432)
- [Mozilla Firefox Bug 1460655: Support 'x' as a resolution unit](https://bugzilla.mozilla.org/show_bug.cgi?id=1460655)

### Documentation and Learning

- [MDN Web Docs - CSS @media resolution](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/resolution)

## Migration Guide

### From Non-Standard to Standard Syntax

**Old (non-standard):**
```css
@media (-webkit-min-device-pixel-ratio: 2) {
  /* Webkit-only syntax */
}

@media (-moz-min-device-pixel-ratio: 2) {
  /* Firefox-only syntax */
}
```

**New (standard):**
```css
@media (min-resolution: 2dppx) {
  /* Works across all modern browsers */
}

/* Or using x unit (modern) */
@media (min-resolution: 2x) {
  /* Even more intuitive */
}
```

## Recommendations

1. **Use `dppx` or `x` units** for modern browsers instead of `dpi` or `dpcm`
2. **Consider fallbacks** if supporting older browsers; use vendor-prefixed versions for compatibility
3. **Test on actual devices** to ensure your media queries work as expected across different pixel densities
4. **Use responsive images** instead of background images when possible for better semantics and performance
5. **Check browser statistics** before deciding to support older browsers with limited resolution feature support

## Related Features

- Parent Feature: [CSS Media Queries](https://caniuse.com/css-mediaqueries)
- Related: Media Queries Level 4
- Related: Responsive Design
- Related: Device Adaptation

## Keywords

`@media`, `device-pixel-ratio`, `resolution`, `dppx`, `dpcm`, `dpi`, `retina`, `high-dpi`, `device-pixel-density`
