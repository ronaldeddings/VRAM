# CSS Scroll Snap

## Overview

CSS Scroll Snap is a CSS technique that allows developers to customize scrolling experiences by setting defined snap positions. It enables smooth, predictable scrolling behavior similar to native applications, making it ideal for carousels, galleries, and other scrollable containers.

## Description

CSS Scroll Snap provides properties that allow you to define where a scroll container should pause after scrolling. When a user finishes scrolling, the browser automatically snaps the scroll position to these defined snap points, creating a more polished and controlled experience without requiring JavaScript.

## Specification Details

- **Specification**: [CSS Scroll Snap Level 1](https://www.w3.org/TR/css-scroll-snap-1/)
- **Status**: Candidate Recommendation (CR)
- **Category**: CSS
- **Global Usage**: 92.92% (full support) + 0.43% (partial support)

## Benefits & Use Cases

### Key Benefits

- **Native-like Scrolling**: Creates polished scrolling experiences similar to mobile apps
- **No JavaScript Required**: Pure CSS implementation for better performance
- **Improved UX**: Predictable scroll positions enhance usability
- **Mobile Friendly**: Particularly beneficial for touch devices and carousels
- **Accessibility**: Provides logical stopping points for keyboard navigation

### Common Use Cases

1. **Image Carousels**: Gallery viewers that snap to full images
2. **Product Showcases**: E-commerce product sliders
3. **Section Navigation**: Full-page scroll experiences
4. **Horizontal Scrolling Layouts**: Card-based layouts that snap to columns
5. **Mobile Menus**: Snappable navigation panels
6. **Presentation Slides**: Slide-based content viewing

## Key CSS Properties

### Container Properties

- `scroll-snap-type`: Defines the snap axis and strictness (x, y, block, inline, both)
- `scroll-padding`: Sets offset from scroll container edges

### Child Element Properties

- `scroll-snap-align`: Specifies alignment within snap area (start, center, end, none)
- `scroll-snap-stop`: Forces snap on this element (always, normal)
- `scroll-margin`: Defines margins around snap area

### Legacy Properties (Older Spec)

- `scroll-snap-coordinate`: Older implementation for defining snap positions
- `scroll-snap-destination`: Older implementation for snap alignment
- `scroll-snap-points-x` / `scroll-snap-points-y`: Older implementation for grid snapping

## Browser Support

### Desktop Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **Chrome** | 69 | Full Support | Available since Chrome 69 (2018) |
| **Firefox** | 68 | Full Support | Available since Firefox 68 (2019) |
| **Safari** | 11 | Full Support | Available since Safari 11 (2017) |
| **Edge** | 79 | Full Support | Full support in Chromium-based Edge (2020) |
| **Opera** | 64 | Full Support | Available since Opera 64 (2020) |
| **Internet Explorer** | - | No Support | Not supported |

### Mobile Browsers

| Browser | First Support | Current Status | Notes |
|---------|---------------|----------------|-------|
| **iOS Safari** | 11 | Full Support | Available since iOS 11 (2017) |
| **Android Chrome** | 69+ | Full Support | Aligned with desktop Chrome |
| **Android Firefox** | 68+ | Full Support | Aligned with desktop Firefox |
| **Samsung Internet** | 10.1 | Full Support | Available since Samsung Internet 10.1 |
| **Opera Mobile** | 80+ | Full Support | Available in recent versions |
| **Android Browser** | - | No Support | Not supported in older Android browsers |

### Support Legend

- **y** = Full support
- **a** = Partial support
- **n** = No support
- **d** = Disabled by default / Feature flag required
- **x** = Prefix required or limited implementation

## Partial Support Details

### Internet Explorer (10-11)

- **IE 10-11**: Partial support marked with feature flags
  - Limited to touch screens in IE10
  - Does not support `scroll-snap-coordinate` and `scroll-snap-destination`
  - Supports older version of the specification

### Early Firefox (39-67)

- **Firefox 39-67**: Partial support with note #5
  - Supports properties from an older version of the specification

### Early Safari (9-10)

- **Safari 9-10**: Partial support with notes #4 and #5
  - Does not support the `none` keyword in `scroll-snap-points-x` and `scroll-snap-points-y`
  - Does not support length keywords (`top`, `right`, etc.) in properties
  - Supports older version of the specification

### Edge Legacy (12-18)

- **Edge 12-18**: Partial support
  - Does not support `scroll-snap-coordinate` and `scroll-snap-destination`
  - Modern Edge (79+) has full support

## Important Notes

### iOS Specific

**Note**: CSS Scroll Snap works in the iOS WKWebView, but not UIWebView. If developing for iOS apps using UIWebView, scroll snap functionality will not be available.

### Feature Flags

Some browsers may require enabling experimental features:

- **Chrome 66-68**: Available behind "Experimental Web Platform features" flag
- **Opera 54-63**: Available behind "Experimental Web Platform features" flag
- **Chrome 66+** and **Opera 54+**: Can be enabled via `chrome://flags` (Chrome) or `opera://flags` (Opera)

### Specification Evolution

The CSS Scroll Snap specification has evolved over time:

- **Older Version** (2015): Used properties like `scroll-snap-coordinate`, `scroll-snap-destination`, `scroll-snap-points-x`, `scroll-snap-points-y`
- **Current Version** (Level 1): Simplified to use `scroll-snap-type`, `scroll-snap-align`, `scroll-snap-stop`, `scroll-margin`, and `scroll-padding`

## Browser Compatibility Table Summary

### Desktop Coverage

| Browser | Support Level |
|---------|---------------|
| Chrome | Full (69+) |
| Firefox | Full (68+) |
| Safari | Full (11+) |
| Edge | Full (79+) |
| Opera | Full (64+) |
| IE | None |

### Mobile Coverage

| Platform | Support Level |
|----------|----------------|
| iOS | Full (11+) |
| Android | Full (4.4+) |
| Samsung | Full (10.1+) |

## Related Resources

### Official Documentation

- [W3C CSS Scroll Snap Specification](https://www.w3.org/TR/css-scroll-snap-1/)
- [MDN Web Docs - CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)
- [MDN Web Docs - CSS Scroll Snap Points](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap_Points)

### Tutorials & Articles

- [Blog Post: Setting Native-like Scrolling Offsets in CSS](https://generatedcontent.org/post/66817675443/setting-native-like-scrolling-offsets-in-css-with)

### Polyfills & Tools

- [CSS Scroll Snap Polyfill (Current Spec)](https://www.npmjs.com/package/css-scroll-snap-polyfill)
- [Scroll Snap Polyfill (Older Version)](https://github.com/ckrack/scrollsnap-polyfill)
- [Snapper - CSS Snap Points Carousel](https://github.com/filamentgroup/snapper)

## Basic Example

```css
/* Container setup */
.carousel {
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  scroll-padding: 20px;
}

/* Child elements snap to start */
.carousel > .item {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  scroll-margin: 10px;
}

/* Alternative: snap to center */
.carousel.centered > .item {
  scroll-snap-align: center;
}
```

## Migration Path

If your application currently uses the older CSS Snap Points specification:

1. **Identify legacy properties**: Look for `scroll-snap-coordinate`, `scroll-snap-destination`, `scroll-snap-points-x`, `scroll-snap-points-y`
2. **Update container**: Replace with `scroll-snap-type`
3. **Update children**: Replace snap coordinates with `scroll-snap-align` and `scroll-snap-stop`
4. **Test thoroughly**: Test across all target browsers
5. **Remove vendor prefixes**: Modern browsers no longer require prefixes

## Recommendations

### When to Use CSS Scroll Snap

- Carousels and image galleries
- Horizontal or vertical scrolling layouts
- Touch-optimized interfaces
- Mobile applications
- Full-page scroll experiences

### Fallback Strategies

- For IE 11: Use JavaScript libraries or polyfills
- For older iOS: Provide JavaScript fallback
- For UIWebView: Implement JavaScript scroll snapping

### Best Practices

- Always test on actual devices, especially mobile
- Provide visual feedback for snap positions
- Consider animation properties alongside scroll snap
- Use `scroll-snap-stop: always` for critical snap positions
- Test keyboard navigation in snap containers

## Support Summary

CSS Scroll Snap has excellent modern browser support with over 93% global usage. It's safe to use in new projects targeting modern browsers (Chrome 69+, Firefox 68+, Safari 11+, Edge 79+). For applications requiring IE11 support, consider using polyfills or JavaScript alternatives.

---

**Last Updated**: December 2024
**Specification Version**: CSS Scroll Snap Level 1
**Data Source**: CanIUse Browser Support Database
