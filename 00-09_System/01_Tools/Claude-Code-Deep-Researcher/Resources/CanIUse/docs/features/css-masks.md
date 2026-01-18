# CSS Masks

## Overview

Method of displaying part of an element, using a selected image as a mask. CSS Masks allow developers to hide portions of an element by applying an image mask, creating complex visual effects and non-rectangular element shapes without needing additional DOM elements.

## Specification Status

- **Status**: Candidate Recommendation (CR)
- **Specification**: [CSS Masking Module Level 1](https://www.w3.org/TR/css-masking-1/)
- **Global Usage**: 86.69% with full support, 6.58% with partial support

## Categories

- **CSS**

## Benefits and Use Cases

### Design and Visual Effects
- **Complex Shape Masking**: Create non-rectangular element shapes using images as masks
- **Gradient Masking**: Apply gradient-based masks for fade effects and transparency layers
- **Advanced Compositing**: Layer elements with sophisticated visual effects
- **Image Manipulation**: Clip or fade images without additional HTML elements

### Performance and Clean Code
- **Reduce DOM Complexity**: Achieve visual effects without extra wrapper elements
- **CSS-Only Solutions**: Pure CSS approach for masking operations
- **Declarative Graphics**: Define masking directly in stylesheets
- **Smooth Animations**: Animate mask properties for dynamic visual transitions

### Practical Applications
- **Hero Images with Fades**: Create header images that fade to transparent at edges
- **Advanced Borders**: Design decorative borders and frames
- **Icon Masking**: Apply masks to create complex icon variations
- **Photo Effects**: Professional photo editing effects in the browser
- **SVG Integration**: Combine CSS masks with inline SVG elements

## Browser Support

### Desktop Browsers

| Browser | First Full Support | Current Status | Notes |
|---------|-------------------|----------------|-------|
| **Chrome** | 120 | Fully Supported | Partial support from v4+ (requires prefix) |
| **Firefox** | 53 | Fully Supported | Partial support from v3.5+ (SVG only) |
| **Safari** | 15.4 | Fully Supported | Partial support from v4+ (requires prefix) |
| **Edge** | 120 | Fully Supported | Partial support from v18+ (requires prefix) |
| **Opera** | 106 | Fully Supported | Partial support from v15+ (requires prefix) |
| **IE 11** | Not Supported | Not Supported | No support in any version |

### Mobile Browsers

| Browser | First Full Support | Current Status | Notes |
|---------|-------------------|----------------|-------|
| **iOS Safari** | 15.4 | Fully Supported | Partial support from v3.2+ (requires prefix) |
| **Chrome Android** | 120 | Fully Supported | Follows desktop Chrome |
| **Firefox Android** | 53+ | Fully Supported | Follows desktop Firefox |
| **Samsung Internet** | 25 | Fully Supported | Partial support from v4+ (requires prefix) |
| **Opera Mini** | Never | Not Supported | No support in any version |
| **Opera Mobile** | 80 | Fully Supported | Newer versions supported |

### Legacy and Special Browsers

| Browser | Support | Notes |
|---------|---------|-------|
| **Android Browser** | Partial (v2.1-4.4) | Limited support with prefix, full support in v142+ |
| **Blackberry** | Partial | Limited support in v7 and v10 |
| **KaiOS** | Full (v3.0+) | Partial support in v2.5 |
| **UC Browser** | Partial (v15.5) | Limited support |
| **Baidu Browser** | Partial (v13.52) | Limited support |
| **QQ Browser** | Partial (v14.9) | Limited support |

## Feature Support Notes

### Partial Support Limitations

1. **WebKit/Blink Browsers** (#1): Partial support refers to supporting `mask-image` and `mask-box-image` properties, but lacking support for other parts of the spec. This includes missing support for properties like:
   - `mask-size`
   - `mask-position`
   - `mask-repeat`
   - `mask-composite`
   - `mask-mode`
   - `mask-type`
   - `mask-clip`

2. **Firefox** (#2): Partial support (v3.5-52) refers to only support for inline SVG mask elements (e.g., `mask: url(#foo)`). Full CSS mask image support added in Firefox 53.

3. **Android Browser** (#3): Partial support (v2.1-4.3) refers to supporting the `mask-box-image` shorthand but not the longhand properties.

4. **Edge Legacy** (#4): Could be enabled in MS Edge behind the "Enable CSS Masking" flag in earlier versions.

5. **Edge 17** (#5): Partial support refers to supporting `mask-image` and `mask-size`.

6. **Edge 18** (#6): Partial support refers to supporting `mask-image`, `mask-size`, `mask-position`, `mask-repeat`, and `mask-composite`.

7. **Edge Compatibility** (#7): Edge also recognizes and supports all the `-webkit-` prefixed equivalents of the unprefixed properties for site compatibility.

## Vendor Prefixes

### WebKit Prefix Requirements

For partial support in WebKit-based browsers (Chrome <120, Safari <15.4, Opera <106), use the `-webkit-` prefix:

```css
/* Prefixed versions for older browsers */
-webkit-mask-image: url(mask.png);
-webkit-mask-size: 100% 100%;
-webkit-mask-position: center;
-webkit-mask-repeat: no-repeat;

/* Modern unprefixed syntax (widely supported now) */
mask-image: url(mask.png);
mask-size: 100% 100%;
mask-position: center;
mask-repeat: no-repeat;
```

## Common CSS Properties

### Core Mask Properties

```css
/* Shorthand property */
mask: <mask-image> || <mask-size> || <mask-position> || <mask-repeat> || <mask-origin> || <mask-clip> || <mask-composite> || <mask-mode>;

/* Individual properties */
mask-image: url(mask.svg) | url(mask.png) | linear-gradient(...);
mask-size: auto | cover | contain | 100% | 50px;
mask-position: center | top | 50% 50%;
mask-repeat: repeat | repeat-x | repeat-y | no-repeat;
mask-origin: border-box | padding-box | content-box;
mask-clip: border-box | padding-box | content-box | margin-box;
mask-composite: add | subtract | intersect | exclude;
mask-mode: alpha | luminance | match-source;
mask-type: luminance | alpha;
mask-border: url(border-mask.png) <slice> <width> <outset> <repeat>;
```

### Mask Border Properties

```css
mask-border-image: url(mask.png) <slice> <width> <outset> <repeat>;
mask-border-image-source: url(mask.png);
mask-border-image-slice: <number> | <percentage>;
mask-border-image-width: <length> | <number> | <percentage>;
mask-border-image-outset: <length> | <number>;
mask-border-image-repeat: stretch | repeat | round;
```

## Code Examples

### Basic Mask Image

```css
.masked-element {
  width: 300px;
  height: 200px;
  background-image: url(image.jpg);
  mask-image: url(mask.png);
}
```

### SVG Mask Reference

```html
<svg style="display: none;">
  <defs>
    <mask id="my-mask">
      <rect width="100%" height="100%" fill="white"/>
      <circle cx="50%" cy="50%" r="50" fill="black"/>
    </mask>
  </defs>
</svg>

<style>
  .element {
    mask: url(#my-mask);
  }
</style>
```

### Gradient Mask

```css
.gradient-mask {
  background: url(image.jpg);
  mask-image: linear-gradient(to bottom,
    white 0%,
    white 80%,
    transparent 100%
  );
  mask-size: 100% 100%;
}
```

### Mask Animation

```css
@keyframes slide-mask {
  0% {
    mask-position: 0 0;
  }
  100% {
    mask-position: 100% 0;
  }
}

.animated-mask {
  background: url(image.jpg);
  mask-image: url(mask.png);
  mask-size: 200% 100%;
  animation: slide-mask 2s ease-in-out infinite;
}
```

### Text Mask Effect

```css
.masked-text {
  font-size: 48px;
  background: linear-gradient(to right, #ff0000, #0000ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Alternative: using mask */
  mask-image: linear-gradient(to right, white, transparent);
}
```

## Related Links

- [MDN - CSS Masks](https://developer.mozilla.org/en-US/docs/Web/CSS/mask) - Comprehensive documentation and examples
- [WebPlatform Docs - mask](https://webplatform.github.io/docs/css/properties/mask) - Cross-browser documentation
- [HTML5 Rocks - CSS Masking Tutorial](https://www.html5rocks.com/en/tutorials/masking/adobe/) - In-depth guide and techniques
- [Visual Test Cases](https://lab.iamvdo.me/css-svg-masks) - Interactive test cases and browser compatibility
- [Detailed Blog Post](https://web.archive.org/web/20160505054016/http://thenittygritty.co/css-masking) - Historical reference via Internet Archive
- [Firefox Implementation Bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1224422) - Firefox development tracking

## Migration Guide

### From IE/Legacy Filters to CSS Masks

```css
/* Legacy IE approach (outdated) */
filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(...);

/* Modern CSS Masks approach (current standard) */
mask-image: url(mask.png);
mask-size: 100% 100%;
```

### From Clip-Path to Masks

While `clip-path` is simpler for geometric shapes, CSS Masks are better for:
- Image-based masking
- Gradient masking
- Complex, irregular shapes defined by image data

```css
/* clip-path - geometric shapes */
clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);

/* mask - image-based */
mask-image: url(complex-mask.png);
```

## Browser Compatibility Summary

### Full Support (Latest Versions)
- Chrome 120+
- Firefox 53+
- Safari 15.4+
- Edge 120+
- Opera 106+
- Most modern mobile browsers

### Partial/Limited Support
- Older versions of Chrome, Firefox, Safari, Edge, and Opera require `-webkit-` prefix
- Android Browser 2.1-4.4: Partial support
- KaiOS: Partial support in v2.5

### No Support
- Internet Explorer (all versions)
- Opera Mini (all versions)
- Legacy Android browsers

## Performance Considerations

1. **GPU Acceleration**: Modern browsers accelerate mask rendering on GPU
2. **Mask Image Size**: Larger mask images have performance impact
3. **SVG Masks**: Inline SVG masks are efficient but require DOM elements
4. **Repaints**: Animated masks can trigger repaints; use GPU-friendly properties
5. **Composite Modes**: Complex `mask-composite` operations may have performance cost

## Best Practices

1. **Use Optimized Masks**: Keep mask images small and optimized
2. **Prefer Unprefixed Properties**: Target modern browsers when possible
3. **Test Fallbacks**: Ensure acceptable appearance in unsupported browsers
4. **Combine with Clip-Path**: Use `clip-path` for geometric shapes, masks for images
5. **Performance Testing**: Test on actual devices, especially for animations
6. **Accessibility**: Ensure masked content is accessible to screen readers
7. **SVG Considerations**: Inline SVG masks may impact page size; consider external files for large projects

## Known Issues and Limitations

- **Partial Spec Support**: Many browsers support only subset of properties (especially `mask-image`)
- **SVG-Only in Some Versions**: Older Firefox versions only support SVG masks
- **Prefix Requirements**: Older WebKit browsers require `-webkit-` prefix
- **Performance Variations**: Mask rendering performance varies across browsers and devices
- **Print Media**: Mask support in print stylesheets is limited or unavailable
- **CORS Restrictions**: Mask images must respect CORS policies

## Conclusion

CSS Masks provide powerful capabilities for creating sophisticated visual effects with minimal DOM impact. With full support in modern browsers and graceful degradation in older versions, CSS Masks are ready for production use with appropriate fallbacks.
