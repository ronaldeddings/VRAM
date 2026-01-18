# CSS3 object-fit / object-position

## Overview

The `object-fit` and `object-position` CSS properties provide developers with powerful control over how replaced elements (images, videos, and other embedded content) scale and position within their container boxes.

## Description

The `object-fit` property specifies how an object (image or video) should fit inside its box. The `object-position` property allows the object to be repositioned similar to how `background-image` positioning works.

### What It Does

Rather than relying on workarounds or JavaScript, developers can now use pure CSS to:
- Control how images fill their containers
- Maintain aspect ratios automatically
- Position objects within their containers precisely
- Replace layout-breaking image stretching with semantic CSS solutions

## Specification Status

**Status:** Candidate Recommendation (CR)

**Specification URL:** [W3C CSS Images Module Level 3](https://www.w3.org/TR/css3-images/)

## Categories

- CSS3

## Benefits & Use Cases

### Key Benefits

1. **Responsive Images Without JavaScript**
   - Images automatically fit containers while maintaining aspect ratios
   - No JavaScript required for common responsive patterns

2. **Modern Image Gallery Layouts**
   - Create uniform grid layouts where all images display consistently
   - Mix portrait and landscape images seamlessly

3. **Video Thumbnail Consistency**
   - Video covers maintain consistent dimensions
   - Thumbnails display without distortion

4. **Reduced Layout Shifts**
   - Images scale predictably without container overflow
   - Eliminates content shifting as images load

5. **Cleaner HTML & CSS**
   - Removes need for wrapper elements and aspect-ratio hacks
   - Simplifies responsive design patterns

### Common Use Cases

- **Hero Images:** Full-width images that scale proportionally
- **Product Galleries:** Uniform product image display with consistent dimensions
- **Avatar Displays:** Circular images that maintain aspect ratio
- **Video Backgrounds:** Full-screen video that fills containers without distortion
- **Social Media Embeds:** Consistent sizing of embedded media
- **Thumbnail Grids:** Pinterest-style layouts with mixed image dimensions

## Object-fit Values

| Value | Behavior |
|-------|----------|
| `fill` | Stretches the object to fill the box, may distort aspect ratio (default) |
| `contain` | Scales object to fit within the box while maintaining aspect ratio |
| `cover` | Scales object to cover the entire box while maintaining aspect ratio, may crop |
| `scale-down` | Uses whichever is smaller: the object's original size or `contain` |
| `none` | Does not resize the object, displays at original size |

## Browser Support

### Current Support Overview

**Global Usage:** 93.23% of users have full support (as of latest data)

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---|---|---|
| **Chrome** | 32 | Fully Supported | All recent versions support full `object-fit` and `object-position` |
| **Firefox** | 36 | Fully Supported | Full support since Firefox 36 (2015) |
| **Safari** | 10 | Fully Supported | Full support since Safari 10 (2016) |
| **Edge** | 79 | Fully Supported | Full support in Chromium-based Edge (79+) |
| **Opera** | 19 | Fully Supported | Full support since Opera 19 (2013) |
| **Internet Explorer** | None | Not Supported | No version of IE supports this feature |

### Mobile Browsers

| Platform | First Support | Current Status | Notes |
|----------|---|---|---|
| **iOS Safari** | 10.0 | Fully Supported | Full support in iOS 10+ |
| **Android Chrome** | 4.4.3 | Fully Supported | Full support in modern Android browsers |
| **Samsung Internet** | 4.0 | Fully Supported | Full support across all versions |
| **Opera Mobile** | 11 | Partial/Full | Prefixed support in early versions; full support from 80+ |
| **Firefox Mobile** | 36 | Fully Supported | Matches desktop Firefox support |
| **Opera Mini** | All | Partial Support | Limited support (marked with `x`) |

### Legacy Support

| Browser | Status |
|---------|--------|
| Internet Explorer 5.5-11 | Not Supported |
| Edge 12-78 | Not Supported (15-18) or Partial (16-18) |
| Safari 7.1-9.1 | Partial Support* |
| Firefox 2-35 | Not Supported |
| Chrome 4-31 | Not Supported |

## Browser Support Notes

### Partial Support

**#1 - Safari 7.1-9.1 (iOS Safari 8-9.3):**
Partial support indicates that Safari versions 7.1 through 9.1 support the `object-fit` property but do **not** support `object-position`. The positioning functionality was added in later versions.

**#2 - Edge 16-18:**
Partial support in Edge versions 16-18 indicates that `object-fit` only supports the `<img>` element at that time. Support for other replaced elements was limited. This limitation was resolved when Edge transitioned to Chromium (version 79+).

## Implementation Notes

### Vendor Prefixes

No vendor prefixes are required for `object-fit` and `object-position` in modern browsers.

### Fallback Strategies

For projects requiring IE 11 or earlier Edge support, consider:

1. **Feature Detection:**
   ```javascript
   const supportsObjectFit = 'objectFit' in document.documentElement.style;
   ```

2. **CSS Fallbacks:**
   ```css
   img {
     width: 100%;
     height: auto;
     object-fit: cover;
   }
   ```

3. **Polyfills:**
   - [object-fit-images](https://github.com/bfred-it/object-fit-images/) - Lightweight polyfill for IE and early Edge

### Performance Considerations

- `object-fit` is a CSS-only solution with excellent performance
- No JavaScript required for basic functionality
- Minimal impact on rendering performance
- Recommended over JavaScript-based solutions for better performance

## Related Properties

- **`object-position`** - Aligns the object within its box (similar to `background-position`)
- **`width` / `height`** - Defines the box dimensions
- **`aspect-ratio`** - Can be combined with `object-fit` for responsive sizing
- **`background-size`** - Similar property for background images

## Example Code

### Basic Image Scaling

```css
/* Display image maintaining aspect ratio, with letterboxing */
img {
  width: 300px;
  height: 300px;
  object-fit: contain;
}

/* Display image covering the entire box, may crop */
img.cover {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

/* Position the image in the center of the box */
img.centered {
  width: 300px;
  height: 300px;
  object-fit: cover;
  object-position: center;
}

/* Top-left alignment */
img.top-left {
  width: 300px;
  height: 300px;
  object-fit: cover;
  object-position: top left;
}
```

### Responsive Image Gallery

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: center;
}
```

### Video Background

```css
video.background {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  object-position: center;
}
```

## Additional Resources

### Official Documentation

- [MDN - object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit)
- [MDN - object-position](https://developer.mozilla.org/docs/Web/CSS/object-position)
- [W3C CSS Images Module Level 3 Specification](https://www.w3.org/TR/css3-images/)

### Community Resources

- [Dev.Opera - CSS3 object-fit and object-position](https://dev.opera.com/articles/view/css3-object-fit-object-position/)
- [WebPlatform Docs - object-fit](https://webplatform.github.io/docs/css/properties/object-fit)

### Polyfills & Tools

- [object-fit-images Polyfill](https://github.com/bfred-it/object-fit-images/) - For IE and older Edge versions

## Browser Statistics

| Support Level | Usage Percentage |
|---|---|
| Full Support (y) | 93.23% |
| Partial Support (a) | 0.01% |
| No Support (n) | 6.76% |

## Summary

The `object-fit` and `object-position` properties are essential modern CSS features with excellent support across all contemporary browsers. They enable developers to handle responsive images and embedded media elegantly without JavaScript workarounds. While legacy browsers like Internet Explorer lack support, the wide adoption across modern browsers (93%+ of users) makes this a reliable solution for current web development projects.

For projects targeting recent browser versions, `object-fit` is recommended as the primary solution for responsive image handling. For environments requiring legacy browser support, the lightweight object-fit-images polyfill provides a viable fallback solution.
