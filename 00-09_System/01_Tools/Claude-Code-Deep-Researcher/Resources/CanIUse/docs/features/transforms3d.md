# CSS3 3D Transforms

## Overview

CSS3 3D Transforms enable developers to transform elements in three-dimensional space, creating immersive visual experiences through rotation, scaling, translation, and perspective manipulation.

## Description

Method of transforming an element in the third dimension using the `transform` property. Includes support for the `perspective` property to set the perspective in z-space and the `backface-visibility` property to toggle display of the reverse side of a 3D-transformed element.

### Key Features

- **3D Transform Functions**: Support for `rotateX()`, `rotateY()`, `rotateZ()`, `rotate3d()`, `translateZ()`, `translate3d()`, and `scaleZ()`
- **Perspective**: Create depth perception for 3D transformations
- **Transform Origin**: Control the point around which transformations occur
- **Backface Visibility**: Toggle whether the back of an element is visible when facing away
- **Transform Style**: Preserve 3D space for nested transformed elements

## Specification

- **Status**: Working Draft (WD)
- **Spec URL**: [CSS Transforms Module Level 2](https://w3c.github.io/csswg-drafts/css-transforms-2/)

## Categories

- CSS3

## Use Cases & Benefits

### Common Applications

1. **Interactive UI Elements**
   - Flip cards and panels
   - Rotating buttons and menus
   - Depth-based navigation effects

2. **Visual Effects**
   - Image galleries with 3D depth
   - Product showcases
   - Animated presentations

3. **Game Development**
   - Game boards and pieces
   - 3D scene composition (with limitations)
   - Interactive environments

4. **Data Visualization**
   - 3D charts and graphs
   - Multidimensional data representation
   - Scientific visualization

### Key Benefits

- **Hardware Acceleration**: Modern browsers can utilize GPU for smooth animations
- **Performance**: More efficient than software-based 3D rendering alternatives
- **Accessibility**: Preserves semantic HTML while adding visual depth
- **No Plugin Required**: Native browser support eliminates Flash or other plugins
- **CSS-Based**: Easy integration with existing CSS workflows

## Browser Support

### Summary Statistics

- **Full Support**: 93.26% global usage
- **Partial Support**: 0.33% global usage
- **No Support**: 6.41% global usage

### Detailed Browser Support Table

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | 36+ | Full support from v36; required `-webkit-` prefix v12-35 |
| **Edge** | 12+ | Full support since initial release |
| **Firefox** | 16+ | Full support from v16; `-moz-` prefix required v10-15 |
| **Safari** | 4+ | `-webkit-` prefix required through v15.3; full support from v15.4 |
| **Opera** | 23+ | Full support from v23; `-o-` prefix required v15-22 |
| **iOS Safari** | 3.2+ | `-webkit-` prefix required through v15.3; full support from v15.4 |
| **Android** | 3+ | `-webkit-` prefix required through v4.4.4; full support from v142+ |
| **IE/IE Mobile** | 10-11 | Partial support (#1) - no `transform-style: preserve-3d` |
| **Opera Mini** | — | Not supported |

### Platform-Specific Support

- **BlackBerry**: 7+ (with `-webkit-` prefix), 10+
- **Samsung Internet**: 4+ (full support)
- **UC Browser**: 15.5+
- **Chrome Mobile**: 142+
- **Firefox Mobile**: 144+
- **Opera Mobile**: 80+ (full support)
- **KaiOS**: 2.5+

## Prefix Requirements

### Vendor Prefixes

| Browser | Prefix Required | Duration |
|---------|-----------------|----------|
| Chrome | `-webkit-` | v12 - v35 |
| Firefox | `-moz-` | v10 - v15 |
| Safari | `-webkit-` | v4 - v15.3 |
| Opera | `-o-` | v15 - v22 |

### Example with Prefixes

```css
.element-3d {
  /* Standard syntax */
  transform: rotateX(45deg) rotateY(45deg);
  perspective: 1000px;

  /* Webkit browsers (older versions) */
  -webkit-transform: rotateX(45deg) rotateY(45deg);
  -webkit-perspective: 1000px;

  /* Firefox (older versions) */
  -moz-transform: rotateX(45deg) rotateY(45deg);
  -moz-perspective: 1000px;
}
```

## Known Issues & Limitations

### Browser-Specific Bugs

1. **Linux and Older Windows**
   - Machines without WebGL support may treat 3D transforms as if `perspective: none`
   - Workaround: Test for WebGL capability or provide fallbacks

2. **Firefox on Windows**
   - Plugin content within no-op 3D transforms renders incorrectly
   - Issue: [Bugzilla #1048279](https://bugzilla.mozilla.org/show_bug.cgi?id=1048279)
   - Workaround: Avoid nesting plugins in transformed elements

3. **Firefox - Perspective on Body**
   - The `perspective` property doesn't work on the `body` element
   - Must be applied to an inner element instead
   - Workaround: Wrap content in a container div and apply perspective there

4. **Chrome - Clip Path + Backface Visibility**
   - Combining `clip-path` and `backface-visibility` produces visible noise
   - Status: Recently fixed in newer Chrome versions
   - Workaround: Use alternative approaches if affecting earlier Chrome versions

5. **Position Fixed Breakage**
   - 3D transforms may break `position: fixed` styles on contained elements
   - Workaround: Restructure DOM or use alternative positioning methods

### Partial Support Notes

- **IE 10-11 (#1)**: Do not support `transform-style: preserve-3d` property
  - Cannot nest 3D transformed elements
  - Limitation: Cannot create true 3D hierarchies

- **Safari 9-15.3 (#2)**: Requires vendor prefix for `backface-visibility` property
  - Must use `-webkit-backface-visibility`
  - Full unprefixed support from v15.4+

## Implementation Recommendations

### Progressive Enhancement

```css
/* Fallback for non-supporting browsers */
.card {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 3D enhancement for supporting browsers */
@supports (transform: rotateY(45deg)) {
  .card {
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .card-inner {
    transform: rotateY(45deg);
  }
}
```

### Vendor Prefix Strategy

For maximum compatibility with older browsers:

```css
.transform-3d {
  -webkit-transform: rotateX(45deg);
  -moz-transform: rotateX(45deg);
  -o-transform: rotateX(45deg);
  transform: rotateX(45deg);
}
```

Use tools like **Autoprefixer** to automatically manage vendor prefixes.

### Performance Considerations

1. **Enable Hardware Acceleration**
   ```css
   .optimized {
     transform: translateZ(0); /* Force GPU acceleration */
     will-change: transform;
   }
   ```

2. **Minimize Repaints**
   - Apply 3D transforms to absolutely positioned elements
   - Use `transform` instead of position changes

3. **Test Performance**
   - Performance varies significantly across devices
   - Mobile devices may have limited 3D transformation support
   - Test on target devices for smooth animations

## Related Resources

### Learning Resources

- [Multi-browser demo](http://css3.bradshawenterprises.com/flip/) - Interactive examples of 3D transforms
- [Mozilla Hacks Article](https://hacks.mozilla.org/2011/10/css-3d-transformations-in-firefox-nightly/) - In-depth explanation of 3D CSS transformations
- [3D CSS Tester](http://thewebrocks.com/demos/3D-css-tester/) - Interactive testing tool
- [Intro to CSS 3D Transforms](https://3dtransforms.desandro.com/) - Comprehensive guide with examples

### Detection & Testing

- [has.js CSS Transform Detection](https://raw.github.com/phiggins42/has.js/master/detect/css.js#css-transform) - Feature detection library
- [WebPlatform Docs](https://webplatform.github.io/docs/css/properties/transform/) - Comprehensive documentation

### Official Specification

- [W3C CSS Transforms Module Level 2](https://w3c.github.io/csswg-drafts/css-transforms-2/) - Official working draft

## Keywords

`css`, `3d`, `3dtransforms`, `backface-visibility`, `perspective`, `transform-origin`, `transform-style`, `rotateX`, `rotateY`, `rotateZ`, `translate3d`, `translateZ`, `scaleZ`, `rotate3d`

## Summary

CSS3 3D Transforms have near-universal browser support (93.26% global usage) and are safe for production use. With careful attention to known issues and proper fallbacks, 3D transforms provide a powerful, GPU-accelerated way to create engaging, interactive web experiences. Modern browsers offer full support without vendor prefixes, while older versions require `-webkit-`, `-moz-`, or `-o-` prefixes for compatibility.
