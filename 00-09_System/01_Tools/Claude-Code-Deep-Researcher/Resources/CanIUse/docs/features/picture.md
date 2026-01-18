# Picture Element

## Overview

The `<picture>` element is a responsive images solution that allows web developers to control which image resource is presented to users based on device characteristics, including display resolution, viewport size, media queries, and image format support.

## Description

A responsive images method to control which image resource a user agent presents to a user, based on resolution, media query and/or support for a particular image format. The `<picture>` element allows web developers to provide multiple image sources and let the browser choose the most appropriate image based on current display conditions and viewport size.

## Specification Status

**Status:** Living Standard (ls)

**Specification Link:** [HTML Living Standard - The Picture Element](https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element)

## Categories

- DOM
- HTML5

## Benefits & Use Cases

### Primary Use Cases

1. **Resolution-based Image Selection**
   - Serve higher resolution images to high-DPI displays
   - Provide optimized images for standard-resolution screens

2. **Viewport-Based Responsiveness**
   - Show different images for mobile, tablet, and desktop viewports
   - Ensure optimal image display across all device sizes

3. **Format Optimization**
   - Serve modern image formats (WebP, AVIF) to supporting browsers
   - Fall back to traditional formats (JPEG, PNG) for older browsers
   - Reduce bandwidth usage with optimized formats

4. **Art Direction**
   - Crop or adjust images differently based on viewport size
   - Show context-appropriate versions of images for different layouts

5. **Performance Optimization**
   - Load appropriate image sizes to reduce page load times
   - Decrease bandwidth consumption on mobile networks
   - Improve Core Web Vitals scores

6. **Accessibility**
   - Maintain semantic HTML structure
   - Support alt text for all image variants

## Browser Support

### Support Legend

- **Y** = Full support
- **N** = No support
- **N d** = No support with vendor prefix (experimental/disabled by default)
- **Y d** = Partial support with feature disabled

### Desktop Browsers

| Browser | First Version | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome | 38 | ✅ Full support | Experimental flag in v37 |
| Firefox | 38 | ✅ Full support | Disabled by default in v34-37 |
| Safari | 9.1 | ✅ Full support | — |
| Edge | 13 | ✅ Full support | Not supported in v12 |
| Opera | 25 | ✅ Full support | Experimental flag in v24 |
| Internet Explorer | — | ❌ Not supported | No support in any version (5.5-11) |

### Mobile Browsers

| Browser | First Version | Current Status | Notes |
|---------|---------------|----------------|-------|
| Chrome for Android | 142 | ✅ Full support | — |
| Firefox for Android | 144 | ✅ Full support | — |
| Safari on iOS | 9.3 | ✅ Full support | — |
| Samsung Internet | 4 | ✅ Full support | — |
| Opera Mobile | 80 | ✅ Full support | — |
| UC Browser | 15.5 | ✅ Full support | — |
| Android Browser | 142 | ✅ Full support | — |
| Opera Mini | All | ❌ Not supported | — |
| Android UC Browser | 15.5 | ✅ Full support | — |
| Baidu Browser | 13.52 | ✅ Full support | — |
| KaiOS | 2.5+ | ✅ Full support | — |

### Support Summary by Browser Family

#### Full Support (Current Versions)
- **Chrome:** 38+
- **Firefox:** 38+
- **Safari:** 9.1+
- **Edge:** 13+
- **Opera:** 25+
- **Samsung Internet:** 4+
- **iOS Safari:** 9.3+

#### No Support
- **Internet Explorer:** All versions
- **Opera Mini:** All versions
- **BlackBerry Browser:** All versions

### Overall Usage Statistics

- **Global Support:** 93.2% of users have browsers with full support
- **Partial Support:** 0%

## Implementation Notes

### Experimental/Feature-Flagged Support

1. **Chrome v37**: Requires enabling "experimental Web Platform features" flag in `chrome://flags`
2. **Opera v24**: Requires enabling "experimental Web Platform features" flag in `opera://flags`
3. **Firefox v34-37**: Requires setting `dom.image.picture.enable` to `true` in `about:config`

### Known Issues

See [unresolved issues and feature requests](https://github.com/ResponsiveImagesCG/picture-element/issues?state=open) in the official specification repository.

## Related Resources & Links

- **[Responsive Images Demos](https://responsiveimages.org/demos/)** - Interactive demonstrations of picture element usage
- **[Tutorial: Better Responsive Images with the Picture Element](https://code.tutsplus.com/tutorials/better-responsive-images-with-the-picture-element--net-36583)** - Comprehensive tutorial
- **[Responsive Images Use Cases](https://usecases.responsiveimages.org/)** - In-depth documentation of common use cases
- **[General Information about Responsive Images](https://responsiveimages.org/)** - Community resource and documentation
- **[Blog Post: Responsive Images on Opera Dev](https://dev.opera.com/articles/responsive-images/)** - Usage guide and best practices
- **[HTML5 Rocks Tutorial](https://www.html5rocks.com/tutorials/responsive/picture-element/)** - Educational deep-dive
- **[Picturefill Polyfill](https://github.com/scottjehl/picturefill)** - Polyfill for picture, srcset, sizes, and related features

## Basic Example

```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 450px)" srcset="medium.jpg">
  <img src="small.jpg" alt="A responsive image">
</picture>
```

### Example with Format Support

```html
<picture>
  <source type="image/webp" srcset="image.webp">
  <source type="image/jpeg" srcset="image.jpg">
  <img src="image.jpg" alt="A fallback image">
</picture>
```

### Example with High-DPI Support

```html
<picture>
  <source media="(min-width: 800px)"
          srcset="large.jpg 1x, large-2x.jpg 2x">
  <source media="(min-width: 450px)"
          srcset="medium.jpg 1x, medium-2x.jpg 2x">
  <img src="small.jpg" alt="Responsive image">
</picture>
```

## Additional Notes

- The `<picture>` element works in conjunction with the `<source>` element and the `<img>` element
- The `<img>` element serves as the fallback for browsers without support
- Modern browsers have excellent support, making this a safe choice for contemporary web development
- Internet Explorer requires either a polyfill (Picturefill) or an alternative responsive image solution
- The specification continues to evolve with new capabilities and optimizations

## Keywords

`<picture>`, responsive images, media queries, image formats, viewport-based images, art direction
