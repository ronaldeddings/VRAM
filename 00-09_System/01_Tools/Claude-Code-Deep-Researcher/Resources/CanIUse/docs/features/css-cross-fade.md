# CSS Cross-Fade Function

## Overview

The **CSS `cross-fade()` function** is an image function that creates a smooth visual transition between images. It allows one image to fade into another based on a percentage value, enabling seamless image blending without JavaScript.

This feature is useful for creating image galleries, slideshow effects, hover transitions, and other visual effects where gradual image transitions enhance user experience.

## Specification

| Property | Value |
|----------|-------|
| **Status** | Candidate Recommendation (CR) |
| **Specification** | [CSS Images Module Level 4](https://w3c.github.io/csswg-drafts/css-images-4/#cross-fade-function) |
| **Category** | CSS |

## Syntax

```css
/* Basic cross-fade between two images */
background-image: cross-fade(image-1, image-2);

/* With percentage (0-100%) controlling the blend */
background-image: cross-fade(30%, image-1, image-2);

/* Multiple images with varying percentages */
background-image: cross-fade(25%, image-1, 75%, image-2);
```

### Parameters

- **Images**: URLs or image data representing the images to cross-fade
- **Percentage**: Optional value (0-100%) controlling the opacity/blend ratio of each image
- If no percentage is specified, images are typically blended at 50%/50%

## Benefits and Use Cases

### Visual Effects
- **Image Galleries**: Smooth transitions between gallery images
- **Slideshow Effects**: Professional-looking image slideshows without animation libraries
- **Loading States**: Subtle transitions while content loads
- **Hover Effects**: Image changes on hover with elegant fade transitions

### Web Design
- **Hero Section Transitions**: Blend multiple background images for visual depth
- **Product Image Viewers**: Seamless transitions between product photos
- **Background Animations**: Creating dynamic backgrounds with multiple images
- **Responsive Imagery**: Progressive enhancement for visual presentations

### Performance Advantages
- Pure CSS solution—no JavaScript required
- Hardware-accelerated rendering on supported browsers
- Reduces DOM manipulation for image transitions
- Lighter alternative to animated GIFs or video backgrounds

## Browser Support

### Support Summary

| Browser | First Version | Status |
|---------|---------------|--------|
| **Chrome** | 17+ | Supported (prefixed: `-webkit-`) |
| **Edge** | 79+ | Supported (prefixed: `-webkit-`) |
| **Firefox** | Not supported | Pending implementation |
| **Safari** | 10+ | Fully supported (unprefixed from v10) |
| **Opera** | 15+ | Supported (prefixed: `-webkit-`) |
| **iOS Safari** | 10+ | Fully supported (unprefixed from v10) |
| **Android Chrome** | 4.4+ | Supported (prefixed: `-webkit-`) |

### Global Usage Coverage

- **Full Support**: 91.02% of global users
- **Partial Support (Prefixed)**: Various legacy versions
- **No Support**: Firefox, Opera Mini, BlackBerry, IE/IE Mobile

### Detailed Browser Version Support

#### Desktop Browsers

**Chrome & Edge**
- Chrome 17+: Full support with `-webkit-` prefix
- Edge 79+: Full support with `-webkit-` prefix
- All subsequent versions fully supported

**Safari**
- Safari 5.1-9: Supported with `-webkit-` prefix
- Safari 10+: Full support without prefix

**Firefox**
- All versions: Not supported (feature request tracked)

**Opera**
- Opera 15+: Full support with `-webkit-` prefix
- Legacy versions (9-12.1): Not supported

#### Mobile Browsers

**iOS Safari**
- iOS 5.0+: Supported with `-webkit-` prefix (versions 5.0-9.3)
- iOS 10+: Full support without prefix

**Android Browsers**
- Android 4.4+: Supported with `-webkit-` prefix
- Android Chrome 142+: Full support

**Other Mobile Browsers**
- Opera Mobile 80+: Supported with `-webkit-` prefix
- Samsung Internet 4+: Supported with `-webkit-` prefix
- UC Browser, QQ Browser, Baidu Browser: Supported with `-webkit-` prefix

**Not Supported**
- Opera Mini: No support
- Android Firefox 144: Not supported
- BlackBerry 7, 10: Not supported
- IE Mobile 10, 11: Not supported

## Implementation Guide

### Basic Implementation

```css
/* Cross-fade between two background images */
.image-container {
  background-image:
    -webkit-cross-fade(url('image1.jpg'), url('image2.jpg'));
  background-image: cross-fade(url('image1.jpg'), url('image2.jpg'));
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 300px;
}
```

### With Percentage Control

```css
/* Blend 30% first image, 70% second image */
.transition-image {
  background-image:
    -webkit-cross-fade(30%, url('before.jpg'), url('after.jpg'));
  background-image: cross-fade(30%, url('before.jpg'), url('after.jpg'));
}
```

### Progressive Enhancement Example

```css
.gallery-image {
  /* Fallback for unsupported browsers */
  background-image: url('image1.jpg');

  /* Modern cross-fade support */
  background-image:
    -webkit-cross-fade(url('image1.jpg'), url('image2.jpg'));
  background-image: cross-fade(url('image1.jpg'), url('image2.jpg'));
}
```

### With CSS Variables

```css
:root {
  --fade-percentage: 50%;
  --image-1: url('image1.jpg');
  --image-2: url('image2.jpg');
}

.dynamic-fade {
  background-image:
    -webkit-cross-fade(var(--fade-percentage), var(--image-1), var(--image-2));
  background-image: cross-fade(var(--fade-percentage), var(--image-1), var(--image-2));
}
```

## Known Issues and Notes

### Current Status
- No major known bugs reported
- Feature is stable across supported browsers
- Implementation is consistent across Webkit-based browsers

### Browser Compatibility Notes

#### Firefox
- **Status**: Not implemented
- **Tracking**: Issue #546052 in Mozilla Bugzilla
- **Workaround**: Use CSS animations with `background-image` or JavaScript fade transitions

#### Chromium-based Browsers
- Currently requires `-webkit-` prefix
- **Chromium Issue**: #614906 tracks unprefixing effort
- **Note**: May be unprefixed in future versions

#### Safari
- Full support without prefix from version 10 onwards
- Older versions (5.1-9) require `-webkit-` prefix
- iOS Safari follows the same support pattern as desktop Safari

### Fallback Strategies

For Firefox and unsupported browsers, consider:
1. **Static Fallback**: Display the primary image
2. **JavaScript Alternative**: Use jQuery crossfade or custom fade animations
3. **CSS Animations**: Animate `background-image` with opacity transitions on layered elements
4. **Feature Detection**: Use JavaScript to detect support and apply alternatives

```javascript
// Simple feature detection
function supportsCrossFade() {
  const style = document.createElement('div').style;
  return (style.backgroundImage = 'cross-fade(red, blue)') !== '';
}
```

## Related Resources

### Official Documentation
- [MDN Web Docs - CSS cross-fade()](https://developer.mozilla.org/en-US/docs/Web/CSS/cross-fade())
- [W3C CSS Images Module Level 4 Specification](https://w3c.github.io/csswg-drafts/css-images-4/#cross-fade-function)

### Issue Tracking
- [Firefox Bug #546052 - Implement cross-fade()](https://bugzilla.mozilla.org/show_bug.cgi?id=546052)
- [Chromium Issue #614906 - Unprefix `-webkit-cross-fade()`](https://bugs.chromium.org/p/chromium/issues/detail?id=614906)

### Related CSS Features
- [`background-blend-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode) - Blend images using different blend modes
- [`mask-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) - Create complex image transitions with masks
- [`mix-blend-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) - Control how elements blend with background
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations) - Animate between images over time
- [CSS Filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) - Apply visual effects to images

## Recommendations

### For Production Use
- **High Adoption (91%)**: Safe to use with `cross-fade()` syntax
- **Always include `-webkit-` prefix** for broad compatibility
- **Provide fallback images** for Firefox users and older browsers
- **Test across target browsers** before deployment
- **Consider user experience**: Use `prefers-reduced-motion` for accessibility

### Code Example with Best Practices

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable cross-fade for users who prefer reduced motion */
  .gallery-image {
    background-image: url('image1.jpg');
  }
}

@media (prefers-reduced-motion: no-preference) {
  .gallery-image {
    background-image:
      -webkit-cross-fade(url('image1.jpg'), url('image2.jpg'));
    background-image: cross-fade(url('image1.jpg'), url('image2.jpg'));
  }
}
```

### For Universal Support
- Use as progressive enhancement
- Provide JavaScript fade alternatives for Firefox
- Consider CSS-based opacity transitions as fallback
- Use feature detection before relying on functionality

## Summary

The CSS `cross-fade()` function is a well-supported feature for creating smooth image transitions with pure CSS. With 91% global coverage and support across major browsers (except Firefox), it's suitable for most modern web projects. Always use vendor prefixes for broad compatibility and provide fallbacks for unsupported browsers.
