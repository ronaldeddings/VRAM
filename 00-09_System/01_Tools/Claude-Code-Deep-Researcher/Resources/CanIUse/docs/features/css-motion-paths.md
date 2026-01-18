# CSS Motion Path

## Overview

CSS Motion Path allows developers to animate HTML elements along a predefined SVG path or CSS shape. This powerful feature enables smooth, complex animations where elements follow curves and shapes rather than being constrained to simple linear or transform-based movements.

## Description

The CSS Motion Path specification provides a way to animate elements along a specific path using the `offset-path` property. Originally defined as the `motion-path` property, this feature allows elements to move smoothly along arbitrary paths, including SVG paths, geometric shapes, and even basic geometric functions.

**Key Related Properties:**
- `offset-path` - Defines the path for animation
- `offset-distance` - Specifies how far along the path the element has moved
- `offset-rotate` - Controls the rotation of the element along the path
- `offset-anchor` - Defines the point on the element that follows the path
- `offset-position` - Sets the initial position of the offset path

## Specification Status

| Status | Link |
|--------|------|
| **Working Draft (WD)** | [W3C Motion Path Specification](https://www.w3.org/TR/motion-1/) |

The specification is currently in Working Draft status, meaning features may change before becoming a standard. However, browser support is quite mature across modern browsers.

## Categories

- **CSS**

## Benefits and Use Cases

### Visual Enhancement
- Create sophisticated UI animations that follow curved paths
- Implement smooth element transitions along predefined routes
- Build complex, visually appealing animations without JavaScript

### Interactive Design
- Animate UI components along SVG paths for custom navigation flows
- Create path-based transitions in single-page applications
- Design animated tutorials or guided experiences

### Data Visualization
- Visualize movement or flow in data-driven applications
- Animate markers or indicators along conceptual or data-driven paths
- Create animated infographics with elements moving along specific trajectories

### Gaming and Creative Content
- Implement smooth character or object movement along designed paths
- Create browser-based games with path-based animation
- Build interactive stories or experiences with animated elements

### Practical Applications
- Animate icons along SVG paths in custom menus
- Create flowing animations for loading indicators
- Design morphing or flowing effects that follow specific paths
- Implement complex page transitions without complicated JavaScript

## Browser Support

### Desktop Browsers

| Browser | First Version with Full Support | Status |
|---------|--------------------------------|--------|
| **Chrome** | 46 | Full Support |
| **Edge** | 79 | Full Support |
| **Firefox** | 72 | Full Support |
| **Safari** | 16.0 | Full Support |
| **Opera** | 33 | Full Support |
| **Internet Explorer** | Not Supported | ❌ Not Supported |

### Mobile Browsers

| Platform | First Version with Full Support | Status |
|----------|--------------------------------|--------|
| **iOS Safari** | 16.0 | Full Support |
| **Android Chrome** | 142 | Full Support |
| **Android Firefox** | 144 | Full Support |
| **Samsung Internet** | 5.0 | Full Support |
| **Opera Mobile** | 80 | Full Support |
| **Android UC Browser** | 15.5 | Full Support |
| **Kaios** | 3.0-3.1 | Full Support |
| **Opera Mini** | Not Supported | ❌ Not Supported |

### Browser Support Summary

- **Overall Support**: 92.23% global usage
- **Modern Browsers**: All major modern browsers support this feature
- **Legacy Browsers**: Not supported in Internet Explorer or older versions
- **Mobile Support**: Excellent support across iOS and Android platforms

## Implementation Notes

### Early Implementation Flags

In earlier versions of some browsers, this feature required experimental flags to be enabled:

- **Chrome 43-45**: Required the "Experimental Web Platform features" flag
- **Opera 30-32**: Required experimental features flag
- **Firefox**: No experimental phase required

### Specification Evolution

The feature was originally called `motion-path` but has been standardized as `offset-path` with the Motion Path specification. Current browser implementations support the modern `offset-path` property name.

## Code Examples

### Basic SVG Path Animation

```css
.element {
  /* Define the path */
  offset-path: path('M 50,50 Q 150,0 250,50 T 350,50');

  /* Control position along the path (0% to 100%) */
  offset-distance: 50%;

  /* Rotate element to face direction of path */
  offset-rotate: auto;

  /* Animate along the path */
  animation: moveAlongPath 3s ease-in-out infinite;
}

@keyframes moveAlongPath {
  0% {
    offset-distance: 0%;
  }
  100% {
    offset-distance: 100%;
  }
}
```

### Shape-based Path Animation

```css
.element {
  /* Use a circle as the path */
  offset-path: circle(100px);
  offset-distance: 0%;
  animation: moveInCircle 4s linear infinite;
}

@keyframes moveInCircle {
  100% {
    offset-distance: 100%;
  }
}
```

### Styled Path with Rotation

```css
.animated-icon {
  /* SVG path definition */
  offset-path: path('M 10,80 Q 95,10 180,80');
  offset-anchor: center center;
  offset-rotate: auto 45deg; /* Auto-rotation plus additional offset */
  animation: traverse 5s ease-in-out;
}

@keyframes traverse {
  0%, 100% {
    offset-distance: 0%;
  }
  50% {
    offset-distance: 50%;
  }
}
```

## Related Resources

- **[W3C Motion Path Specification](https://www.w3.org/TR/motion-1/)** - Official specification
- **[MDN Web Docs - CSS motion-path](https://developer.mozilla.org/en-US/docs/Web/CSS/motion-path)** - Comprehensive documentation
- **[Chrome DevTools Demo](https://googlechrome.github.io/samples/css-motion-path/index.html)** - Interactive demo and examples
- **[CodePen Blog Post](https://codepen.io/danwilson/post/css-motion-paths)** - In-depth explanation and examples

## Known Issues and Limitations

### Firefox Implementation
- **Tracking Bug**: [Firefox Motion Path Bug #1186329](https://bugzilla.mozilla.org/show_bug.cgi?id=1186329)
- Firefox included support relatively early (version 72) and has continued to improve implementation compatibility

### Compatibility Considerations
- **Prefixed versions**: Some older documentation may reference `-webkit-` prefixed versions; use unprefixed `offset-*` properties in production
- **Path syntax**: Different browsers may have varying support for complex SVG path syntax
- **Performance**: Complex paths with frequent keyframe updates may impact performance on lower-end devices

## Polyfills and Fallbacks

For browsers that don't support CSS Motion Path (primarily IE and Opera Mini), consider:

1. **Feature Detection**: Use CSS `@supports` to detect capability
2. **Alternative Animations**: Fall back to simpler transform-based animations
3. **JavaScript Libraries**: Use JavaScript libraries for motion path animation in unsupported browsers
4. **Graceful Degradation**: Provide static positioning as fallback

```css
@supports (offset-path: path('M 0,0')) {
  .element {
    offset-path: path('M 50,50 Q 150,0 250,50');
    animation: moveAlongPath 3s ease-in-out;
  }
}

@supports not (offset-path: path('M 0,0')) {
  .element {
    /* Fallback animation or static positioning */
    position: relative;
    top: 50px;
    left: 50px;
  }
}
```

## Performance Considerations

- **Hardware Acceleration**: Modern browsers typically hardware-accelerate motion path animations
- **Path Complexity**: Simpler paths generally perform better than complex SVG paths
- **Mobile Devices**: Test on actual devices as performance varies significantly
- **Continuous Animation**: Use `will-change` carefully with motion paths to optimize rendering

```css
.optimized-element {
  will-change: offset-distance;
  offset-path: circle(100px);
  animation: moveAlongPath 4s linear infinite;
}
```

## See Also

- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms)
- [SVG Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
- [offset-path Property](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path)

---

**Last Updated**: December 2024
**Feature Maturity**: Mature (92.23% global browser coverage)
