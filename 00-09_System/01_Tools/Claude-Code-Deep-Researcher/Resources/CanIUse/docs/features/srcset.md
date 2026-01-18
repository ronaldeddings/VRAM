# Srcset and Sizes Attributes

## Overview

The `srcset` and `sizes` attributes on `<img>` (or `<source>`) elements allow authors to define various image resources and "hints" that assist a user agent in determining the most appropriate image source to display. This feature is essential for responsive web design, enabling browsers to select optimally-sized images based on device characteristics such as high-resolution displays, viewport width, and network conditions.

## Description

The `srcset` and `sizes` attributes provide a native HTML mechanism for responsive images:

- **`srcset` attribute**: Specifies a comma-separated list of image URLs and their descriptors (either resolution or width-based)
- **`sizes` attribute**: Defines media query conditions paired with CSS-like size hints that guide the browser's image selection algorithm

Together, these attributes enable developers to deliver different image variants to different devices and contexts, improving performance, user experience, and page load times.

### Example Usage

```html
<!-- Resolution-based srcset (x descriptor) -->
<img
  src="image.jpg"
  srcset="image.jpg 1x, image-2x.jpg 2x"
  alt="Description"
/>

<!-- Width-based srcset with sizes (w descriptor) -->
<img
  src="image.jpg"
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
  alt="Description"
/>

<!-- Using with picture element source -->
<picture>
  <source
    srcset="image-large.jpg 1024w, image-xlarge.jpg 1536w"
    sizes="(min-width: 1024px) 100vw, 80vw"
    media="(min-width: 768px)"
  />
  <source
    srcset="image-small.jpg 480w, image-medium.jpg 768w"
    sizes="(min-width: 480px) 100vw, 80vw"
  />
  <img src="image-fallback.jpg" alt="Description" />
</picture>
```

## Specification Status

**Status**: Living Standard (ls)

**Official Specification**: [HTML Living Standard - srcset attribute](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset)

The feature is part of the HTML Living Standard and is actively maintained by the WHATWG (Web Hypertext Application Technology Working Group).

## Categories

- HTML5

## Benefits and Use Cases

### Performance Optimization
- Reduce bandwidth consumption by serving appropriately-sized images
- Avoid loading oversized images on mobile and small-screen devices
- Improve page load times and overall website performance

### Device-Aware Image Selection
- Serve high-resolution images (2x, 3x) to devices with high pixel density (Retina displays)
- Deliver standard resolution images to standard displays
- Automatically select the best variant based on device capabilities

### Responsive Design
- Adapt image dimensions based on viewport width
- Provide different image crops for different screen sizes
- Support art direction with the `<picture>` element in combination with srcset
- Optimize for mobile-first design patterns

### User Experience
- Reduce data usage for users on metered connections
- Enable faster page rendering with appropriately-sized assets
- Improve Core Web Vitals scores (LCP, CLS)
- Reduce visual reflow and layout shifts

### SEO Benefits
- Improved page load performance impacts search rankings
- Proper image sizing maintains content quality
- Better accessibility with semantic HTML

## Browser Support

### Support Legend

- **y**: Fully supported
- **a**: Partial support or limited functionality (see notes)
- **n**: Not supported
- **d**: Disabled by default (requires manual enablement)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Chrome** | 38 | ✅ Fully Supported | Full support from version 38 onwards |
| **Edge** | 16 | ✅ Fully Supported | Versions 12-15 had issues; full support from v16 |
| **Firefox** | 38 | ✅ Fully Supported | Versions 32-37 had experimental support (disabled by default) |
| **Safari** | 7.1+ | ⚠️ Partial | Supports resolution descriptor (`x`) only; limited `sizes` support |
| **Opera** | 25 | ✅ Fully Supported | Partial support from v21-24; full support from v25 |
| **Internet Explorer** | — | ❌ Not Supported | No support in any version (IE 5.5-11) |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|--------------|----------------|-------|
| **Chrome Mobile** | 38+ | ✅ Fully Supported | Latest versions (142+) |
| **Firefox Mobile** | 38+ | ✅ Fully Supported | Latest versions (144+) |
| **Safari iOS** | 8+ | ⚠️ Partial | Partial support with notable limitations |
| **Opera Mobile** | 25+ | ✅ Fully Supported | From version 25 onwards |
| **Android Browser** | 4.4.3+ | ⚠️ Partial | Recent versions (142+) support fully |
| **Samsung Internet** | 4+ | ✅ Fully Supported | All versions from 4.0 onwards |
| **UC Browser** | 15.5+ | ✅ Fully Supported | From version 15.5 onwards |
| **Opera Mini** | — | ❌ Not Supported | No support in any version |
| **IE Mobile** | — | ❌ Not Supported | No support (IE Mobile 10-11) |
| **BlackBerry Browser** | — | ❌ Not Supported | No support (BB 7, 10) |

### Usage Statistics

- **Full Support (y)**: 82.51% of global browser usage
- **Partial Support (a)**: 10.69% of global browser usage
- **Total Coverage**: 93.20% of users

## Implementation Notes

### Feature Support Variations

#### 1. Resolution Descriptor Support (`x` descriptor)
Most browsers support the resolution-based `x` descriptor syntax for high-DPI displays:

```html
<img
  srcset="image.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
  alt="Description"
/>
```

#### 2. Width Descriptor Support (`w` descriptor)
Full `w` descriptor support with `sizes` attribute is more limited:

- **Limited support**: Some browsers (particularly Safari) don't fully support min/max expressions in media queries within the `sizes` attribute
- **Workaround**: Use simpler media query expressions or provide fallback behavior

#### 3. Safari Limitations
Safari browsers (desktop and iOS) have partial support:
- Supports basic `x` descriptor syntax
- Does NOT support min/max expressions in media queries
- Does NOT fully support the `w` descriptor with `sizes`
- **Workaround**: Test thoroughly or use JavaScript polyfills for full functionality

### Known Issues and Bugs

#### Edge Browser (Versions 13-15)
**Issue**: Intermittently displays distorted or incorrectly rendered images when encountering a `srcset` attribute. The behavior is dependent on caching and network timing.

**Status**: Fixed in Edge 16+

**Reference**: [Edge Platform Issue #7778808](https://web.archive.org/web/20171210184313/https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7778808/)

#### Safari JavaScript-Generated Images
**Issue**: When `<img>` elements are dynamically generated with JavaScript in Safari 11+, if the `src` attribute appears before the `srcset` attribute, the browser may load the image specified in `src` even though `srcset` specifies a different image.

**Status**: Ongoing (affects Safari 11 and later)

**Workaround**: Place the `srcset` attribute before the `src` attribute in the HTML structure

**Reference**: [WebKit Bug #190031](https://bugs.webkit.org/show_bug.cgi?id=190031)

#### Firefox Experimental Support (Versions 32-37)
**Note**: Early Firefox versions (32-37) had experimental support that was disabled by default.

**Enablement**: Can be enabled by setting the `about:config` preference `dom.image.srcset.enabled` to `true`

**Status**: Fully enabled by default from Firefox 38 onwards

## Implementation Guidelines

### Best Practices

1. **Always provide a `src` fallback** for older browsers
   ```html
   <img
     src="image.jpg"
     srcset="image-2x.jpg 2x"
     alt="Descriptive text"
   />
   ```

2. **Prefer width descriptors with `sizes` for true responsiveness**
   - More powerful for responsive design
   - Better browser optimization
   - More flexible than resolution descriptors alone

3. **Test across real devices**
   - Device pixel ratios vary
   - Network conditions affect selection
   - Different browsers may behave differently

4. **Use with `<picture>` for art direction**
   - Combine `srcset` with `<picture>` for flexibility
   - Use media queries for complex responsive scenarios

5. **Consider performance implications**
   - Generate multiple image variants
   - Use proper image optimization tools
   - Monitor actual image selection in production

### Browser Support Considerations

- **IE/Legacy**: No native support; use JavaScript polyfills if needed
- **Safari**: Test thoroughly; avoid min/max expressions
- **Mobile**: Generally well-supported; test on target devices
- **Dynamic Images**: In Safari, ensure `srcset` comes before `src`

## Related Resources

### Official Documentation
- **[HTML Specification - srcset](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset)** - The authoritative specification
- **[MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)** - Comprehensive MDN guide
- **[MDN: img element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)** - Complete img element documentation

### Additional Resources
- **[WebKit Blog: Improved support for high-resolution displays with the srcset image attribute](https://www.webkit.org/blog/2910/improved-support-for-high-resolution-displays-with-the-srcset-image-attribute/)** - WebKit implementation details
- **[Eric Portis: Blog post on srcset & sizes](https://ericportis.com/posts/2014/srcset-sizes/)** - Detailed guide and best practices

## Summary

Srcset and sizes attributes are a mature, widely-supported feature for responsive images in modern web development. With support in 93%+ of global browser usage, they should be considered the standard approach for implementing responsive imagery. While some limitations exist (particularly in Safari), the benefits for performance, user experience, and SEO make srcset an essential tool for contemporary web projects.

For the small percentage of users on unsupported browsers (primarily IE), ensure a functional `src` fallback or implement a JavaScript polyfill as needed.

---

*Last updated: 2025-12-13*
*Data source: CanIUse Database*
