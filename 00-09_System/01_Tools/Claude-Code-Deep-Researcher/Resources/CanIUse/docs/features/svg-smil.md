# SVG SMIL Animation

## Overview

SVG SMIL (Synchronized Multimedia Integration Language) animation is the native XML-based method for animating SVG (Scalable Vector Graphics) elements directly within SVG documents. SMIL provides a declarative approach to creating animations without requiring JavaScript or external animation libraries.

## Description

SMIL animation allows you to animate SVG properties using dedicated animation elements (`<animate>`, `<animateMotion>`, `<animateColor>`, and `<set>`) directly within your SVG markup. This provides a lightweight, standardized way to create smooth transitions and dynamic visual effects on SVG graphics.

## Specification Status

- **Status**: W3C Recommendation (REC)
- **Specification URL**: [SVG 1.1 Animation - W3C](https://www.w3.org/TR/SVG11/animate.html)

## Categories

- SVG

## Use Cases & Benefits

### Key Use Cases
- **Declarative Animations**: Define animations directly in SVG markup without JavaScript
- **Looping Animations**: Create repeating animations with built-in timing controls
- **Synchronized Motion**: Animate multiple properties in sync using motion paths and timing
- **Data Visualization**: Animate chart elements, progress indicators, and infographics
- **Interactive SVG**: Combine with event handlers for interactive animated graphics
- **Lightweight Solutions**: Reduce dependency on JavaScript animation libraries

### Benefits
- **No JavaScript Required**: Pure XML-based animation syntax
- **Native Performance**: Optimized by browsers for SVG elements
- **Precise Timing Control**: Built-in `begin`, `end`, `dur`, and `repeat` attributes
- **Chainable Animations**: Sequence animations using timing attributes
- **Accessibility Friendly**: Declarative approach integrates well with accessibility features

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| **Chrome** | ✅ Full Support | v5+ |
| **Firefox** | ✅ Full Support | v4+ |
| **Safari** | ✅ Full Support | v6+ (partial support v3.1-5.1) |
| **Edge** | ✅ Full Support | v79+ (partial support v12-18) |
| **Opera** | ✅ Full Support | v9+ |
| **iOS Safari** | ✅ Full Support | v6.0+ (partial support v3.2-5.1) |
| **Android Browser** | ✅ Full Support | v3+ |
| **Opera Mini** | ❌ Not Supported | |
| **Internet Explorer** | ❌ Not Supported | Versions 5.5-11 do not support SMIL |
| **IE Mobile** | ⚠️ Partial | v10-11 have partial support |

### Support Legend
- ✅ **Full Support (y)**: SMIL animation fully supported
- ⚠️ **Partial Support (a/p)**: Limited or incomplete support
- ❌ **Not Supported (n)**: No support for SMIL animation

### Support Details by Browser

**Desktop Browsers:**
- Chrome: Full support from v5 onwards
- Firefox: Full support from v4 onwards
- Safari: Full support from v6 onwards (limited in v3.1-5.1)
- Edge: Full support from v79 onwards
- Opera: Full support from v9 onwards

**Mobile Browsers:**
- iOS Safari: Full support from v6.0+ onwards
- Android: Full support from v3.0 onwards
- Samsung Internet: Full support from v4.0 onwards

**Global Usage**: 93.27% of users worldwide have browsers that support SMIL animation

## Known Issues & Limitations

### Animation Events Bug
No animation events (onbegin/onrepeat/onend) are fired in WebKit/Blink browsers during animation. This affects Chrome, Edge, Safari, and Opera browsers, making it difficult to detect animation lifecycle events in these browsers.

**Reference**: [WebKit Bug #63727](https://bugs.webkit.org/show_bug.cgi?id=63727)

### Android Browser Limitation
Animation in SVG is not supported in inline SVG on Android browsers prior to version 4.4. External SVG files work fine, but embedding SVG directly in HTML requires Android 4.4+.

### Partial Support Notes
In older Safari versions (4-5.1), SMIL animation has partial support and does not work in:
- HTML files (only in standalone SVG files)
- CSS background images

## Resources & References

### Learning Resources
- [SVG WOW Animation Examples](http://svg-wow.org/blog/category/animation/) - Comprehensive examples and demonstrations
- [MDN Web Docs - SVG Animation with SMIL](https://developer.mozilla.org/en/SVG/SVG_animation_with_SMIL) - Official documentation and tutorials

### Polyfills & Libraries
- [FakeSmile](https://leunen.me/fakesmile/) - JavaScript library to add SMIL support to browsers without native support
- [has.js Detection](https://raw.github.com/phiggins42/has.js/master/detect/graphics.js#svg-smil) - Feature detection for SMIL support
- [SVGEventListener Polyfill](https://github.com/madsgraphics/SVGEventListener) - Polyfill for SMIL animate events on SVG

## Example Usage

### Basic Animation
```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue">
    <animate attributeName="r" from="40" to="20" dur="2s" repeatCount="infinite" />
  </circle>
</svg>
```

### Animation with Motion Path
```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle r="10" fill="red">
    <animateMotion dur="3s" repeatCount="infinite">
      <mpath href="#path1" />
    </animateMotion>
  </circle>
  <path id="path1" d="M 20 20 L 180 180" stroke="black" stroke-width="2" fill="none" />
</svg>
```

### Sequenced Animations
```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="80" fill="green">
    <animate attributeName="width" from="80" to="20" dur="2s" />
    <animate attributeName="height" from="80" to="20" dur="2s" begin="2s" />
  </rect>
</svg>
```

## Alternative Approaches

If SMIL support is insufficient for your use case, consider these alternatives:
- **CSS Animations & Transitions**: Standard CSS-based animation for SVG
- **JavaScript Libraries**: GreenSock (GSAP), Three.js, D3.js
- **Web Animations API**: Native JavaScript animation API with broader browser support
- **Canvas API**: For more complex, frame-based animations

## Browser Compatibility Considerations

While SMIL has excellent modern browser support (93.27% global usage), Internet Explorer and older browsers do not support it. If legacy browser support is required, use JavaScript-based animation libraries or implement feature detection with fallbacks.

For production use, it is recommended to:
1. Test SMIL animations across target browsers
2. Implement JavaScript fallbacks if IE support is needed
3. Use feature detection to determine available capabilities
4. Consider the animation event bug limitations in WebKit/Blink browsers

## Related Standards

- **CSS Animations**: [CSS Animations Module Level 1](https://www.w3.org/TR/css-animations-1/)
- **CSS Transitions**: [CSS Transitions Module Level 1](https://www.w3.org/TR/css-transitions-1/)
- **SVG Specification**: [Scalable Vector Graphics (SVG) 1.1](https://www.w3.org/TR/SVG11/)
- **Web Animations API**: [Web Animations](https://www.w3.org/TR/web-animations-1/)
