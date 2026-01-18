# CSS3 2D Transforms

## Overview

CSS3 2D Transforms provide a powerful method for transforming HTML elements in a two-dimensional plane. This feature enables web developers to rotate, scale, translate, and skew elements without affecting the document flow, creating dynamic and engaging user interfaces.

## Description

CSS3 2D Transforms allow developers to apply visual transformations to elements using CSS properties. These transformations include:

- **Rotation**: Rotate elements around a center point
- **Scaling**: Increase or decrease the size of elements
- **Translation**: Move elements along the X and Y axes
- **Skewing**: Distort elements along the X and Y axes
- **Transform Origin**: Control the point around which transformations occur

The implementation includes support for both the `transform` property (which applies transformations) and the `transform-origin` property (which specifies the point of origin for the transformation).

## Specification Status

**Status**: Candidate Recommendation (CR)

**Specification URL**: [W3C CSS3 2D Transforms](https://www.w3.org/TR/css3-2d-transforms/)

The specification is mature and widely supported across modern browsers, though some older browsers may require vendor prefixes or workarounds.

## Categories

- **CSS3**

## Use Cases & Benefits

### Design & User Interface
- Create dynamic hover effects and transitions
- Build interactive UI elements without JavaScript
- Implement smooth animations and visual feedback
- Enhance visual hierarchy with dynamic scaling

### Performance Optimization
- Perform GPU-accelerated transformations
- Improve animation performance compared to layout-based changes
- Reduce JavaScript calculations for visual effects
- Minimize repaints and reflows during animations

### Web Applications
- Create rotating loaders and spinners
- Build interactive card flip animations
- Implement image galleries with transform effects
- Develop custom animated controls and widgets

### Accessibility & Usability
- Provide visual feedback for user interactions
- Enhance form validation with animated indicators
- Create tooltip and popover positioning without JavaScript
- Implement responsive design patterns

## Browser Support

### Support Legend

- **y** - Full support
- **y x** - Support with vendor prefix (e.g., `-webkit-`, `-moz-`)
- **p** - Partial support
- **n** - No support
- **#1** - Reference to footnotes (see Notes section)

### Desktop Browsers

| Browser | First Full Support | Current Status | Notes |
|---------|-------------------|----------------|-------|
| **Chrome** | 36 | Full (v146) | Unprefixed from v36+ |
| **Edge** | 17 | Full (v143) | Prefixed support from v12-16 |
| **Firefox** | 16 | Full (v148) | Prefixed support from v3.5-15 |
| **Internet Explorer** | 9 | Partial (IE9-11) | Requires prefix; SVG limitations#1 |
| **Opera** | 12.1 | Full (v122) | Unprefixed from v12.1+; prefixed v10.5-22 |
| **Safari** | 9 | Full (v18.5) | Unprefixed from v9+; prefixed v3.1-8 |

### Mobile Browsers

| Browser | First Full Support | Current Status | Notes |
|---------|-------------------|----------------|-------|
| **iOS Safari** | 9.0 | Full (18.5-18.7) | Unprefixed from v9+; prefixed v3.2-8.4 |
| **Android Browser** | 2.1 | Full (v142) | Prefixed support through v4.4.4 |
| **Chrome Mobile** | N/A | Full (v142) | Same as Chrome desktop |
| **Firefox Mobile** | N/A | Full (v144) | Same as Firefox desktop |
| **Samsung Internet** | 4 | Full (v29) | Full support across versions |
| **Opera Mobile** | 11 | Full (v80) | No support in v10 |
| **Opera Mini** | N/A | No Support | Not supported in any version |

### Global Browser Support

**Usage Statistics** (as of data collection):
- **Full Support**: 93.65% of users
- **Partial Support**: 0%
- **No Support**: 6.35% of users

This indicates that CSS3 2D Transforms are safe to use in production for the vast majority of modern browsers.

## Known Issues & Limitations

### Bug Reports

1. **Android 2.3 Background Scaling**
   - Scaling transforms fail to scale element background images on Android 2.3
   - **Workaround**: Apply background image directly to pseudo-elements or use alternative styling

2. **IE9 Textarea Caret Disappearance**
   - When using the `translate` transform on a `textarea` element in IE9, the text cursor (caret) disappears
   - **Workaround**: Avoid transforms on form inputs in IE9, or use JavaScript to manage focus indicators

3. **Firefox Transform Origin on SVG (Firefox 42 and below)**
   - The `transform-origin` property is not supported on SVG elements in Firefox 42 and earlier versions
   - **Current Status**: Fixed in Firefox 43+
   - **Reference**: [Mozilla Bug #923193](https://bugzilla.mozilla.org/show_bug.cgi?id=923193)

### Vendor Prefix Requirements

Older browser versions require vendor-specific prefixes:

- **WebKit browsers** (Chrome <36, Safari <9, iOS Safari <9): `-webkit-transform`, `-webkit-transform-origin`
- **Firefox** (Firefox <16): `-moz-transform`, `-moz-transform-origin`
- **Opera** (Opera <12.1): `-o-transform`, `-o-transform-origin`
- **Internet Explorer**: Uses proprietary filters (see Legacy Support section)

### SVG Limitations

- **IE9-IE11** does not support CSS transforms on SVG elements; use the SVG `transform` attribute instead
- **Firefox** versions up to 42 do not support `transform-origin` on SVG elements

## Implementation Notes

### Legacy Browser Support

The scale transform can be emulated in **IE < 9** using Microsoft's `zoom` extension. Other transforms are not easily possible without JavaScript or using the MS Matrix filter.

For IE 8 and below, consider using:
- Microsoft Matrix filter for basic transforms
- JavaScript-based transformation libraries
- Graceful degradation strategies

### CSS Syntax

```css
/* Basic transforms */
.element {
  transform: rotate(45deg);
  transform: scale(1.5);
  transform: translate(50px, 100px);
  transform: skew(10deg, 20deg);
  transform-origin: center;
}

/* Multiple transforms (comma-separated) */
.element {
  transform: rotate(45deg) scale(1.5) translate(50px, 100px);
  transform-origin: 50% 50%;
}
```

### Performance Considerations

- Transforms are GPU-accelerated in modern browsers
- Use transforms for animation instead of changing position or size properties
- Combine with `will-change` property for additional optimization hints
- Test performance on mobile devices, as some older devices may struggle

### Prefixing Strategies

Use CSS vendor prefixes for maximum compatibility:

```css
.element {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
```

Or use tools like Autoprefixer to automatically manage prefixes during build time.

## Related Resources

### Official Documentation
- **[W3C CSS Transforms Module Level 1](https://www.w3.org/TR/css-transforms-1/)** - Current specification
- **[MDN Web Docs - CSS transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)** - Comprehensive reference documentation
- **[WebPlatform Docs](https://webplatform.github.io/docs/css/properties/transform/)** - Community-maintained documentation

### Interactive Tools
- **[Westciv Transforms Live Editor](https://www.westciv.com/tools/transforms/)** - Interactive transform generator and visualizer

### Legacy Support & Utilities
- **[CSS Sandpaper](http://www.webresourcesdepot.com/cross-browser-css-transforms-csssandpaper/)** - Workaround script for IE legacy support
- **[IE Transforms Translator](https://www.useragentman.com/IETransformsTranslator/)** - Converter for Internet Explorer compatibility
- **[has.js CSS Transform Test](https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-transform)** - Feature detection script

### Browser Platform Status
- **[Microsoft Edge Platform Status - SVG Transforms](https://developer.microsoft.com/en-us/microsoft-edge/status/supportcsstransformsonsvg/)** - Status of SVG transform support in Edge

## Keywords & Related Features

**Associated Keywords**: transformation, translate, translateX, translateY, translateZ, transform3D, rotation, rotate, scale, skew, CSS-transforms, transform-origin

**Related CSS Features**:
- CSS3 3D Transforms (for advanced perspective effects)
- CSS Transitions (for animating transform changes)
- CSS Animations (for complex transform sequences)
- CSS `will-change` property (for performance optimization)

## Summary

CSS3 2D Transforms is a mature, widely-supported feature that provides an essential foundation for modern web design. With 93.65% browser support and availability in all major modern browsers, it's safe to use in production with appropriate fallbacks for legacy browsers. The combination of performance benefits and visual capabilities makes it indispensable for contemporary web development.

---

*Documentation generated from CanIUse data for feature: transforms2d*
