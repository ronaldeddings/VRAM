# Viewport Units: vw, vh, vmin, vmax

## Overview

Viewport units are CSS length units that represent a percentage of the current viewport dimensions. These units allow developers to create responsive designs based on the size of the browser window rather than the device or parent element.

## Description

Length units representing a percentage of the current viewport dimensions:

- **vw** (viewport width): 1vw = 1% of the viewport's width
- **vh** (viewport height): 1vh = 1% of the viewport's height
- **vmin** (viewport minimum): 1vmin = 1% of the smaller of viewport width or height
- **vmax** (viewport maximum): 1vmax = 1% of the larger of viewport width or height

## Specification

- **Current Status**: Candidate Recommendation (CR)
- **Specification Link**: [CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/#viewport-relative-lengths)

## Categories

- CSS3

## Benefits and Use Cases

### Primary Use Cases

1. **Full-Height Layouts**: Create full-screen hero sections and landing pages
   ```css
   .hero {
     height: 100vh;
   }
   ```

2. **Responsive Typography**: Scale font sizes responsively with viewport
   ```css
   h1 {
     font-size: 5vw;
   }
   ```

3. **Responsive Spacing**: Maintain proportional spacing across different screen sizes
   ```css
   .container {
     padding: 10vw;
   }
   ```

4. **Adaptive Dimensions**: Create elements that scale proportionally to viewport
   ```css
   .square {
     width: 50vw;
     height: 50vw;
   }
   ```

5. **Flexible Layouts**: Build layouts that adapt to orientation changes
   ```css
   .column {
     width: 100vmin;
   }
   ```

### Key Benefits

- **Viewport-Relative Sizing**: Elements scale with browser window size automatically
- **Responsive Design**: Less reliance on media queries for basic scaling
- **Proportional Layouts**: Maintain consistent proportions across different screen sizes
- **Flexible Typography**: Create fluid typography that scales with viewport
- **Simplified Calculations**: Easier to calculate proportional sizes without JavaScript

## Browser Support

| Browser | First Support | Current Support | Notes |
|---------|---------------|-----------------|-------|
| **Chrome** | 26 (Partial: v20-25) | Full support (v26+) | Partial support (#2) until v34 |
| **Edge** | 16 | Full support | Partial support (#2) in v12-15 |
| **Firefox** | 19 | Full support | Known issue with `100vh` on `display: table` |
| **Safari** | 6.1 (Partial: v6) | Full support | Partial support (#2) in v6, buggy (#3) in v7+ |
| **Opera** | 15 | Full support | - |
| **iOS Safari** | 8 (Partial: v6-7.1) | Full support | Buggy in v6-7.1 (#2, #3) |
| **Android Browser** | 4.4 | Full support | - |
| **Samsung Internet** | 4.0 | Full support | - |
| **IE** | Partial (v9-11) | Not supported | Limited/partial support only |
| **Opera Mini** | Not supported | Not supported | - |

### Support Legend

- **y** = Full support
- **a** = Partial support (see notes)
- **n** = Not supported

### Usage Statistics

- **Full Support**: 93.2% of users
- **Partial Support**: 0.39% of users
- **No Support**: ~6% of users (primarily older IE versions)

## Partial Support Details

### Note #1: IE9 - "vm" Instead of "vmin"
IE9 recognizes the `vm` unit instead of the standard `vmin` unit. Use vendor prefixes or feature detection for IE9 support.

### Note #2: Missing "vmax" Unit Support
Partial support in versions of Chrome (v20-25), Edge (v12-15), Safari (v6), and IE Mobile (v10-11) refers to not supporting the `vmax` unit. All other viewport units are supported.

### Note #3: iOS 7 - Buggy vh Behavior
Partial support in iOS Safari 6.0-6.1 and iOS 7.0-7.1 is due to buggy behavior of the `vh` unit. See workarounds in the links section.

## Known Issues and Bugs

### Firefox
- **Bug**: `100vh` has no effect on elements with `display: table`
- **Workaround**: Use alternative display values or explicit height values
- **Reference**: [Firefox Bug #1221721](https://bugzilla.mozilla.org/show_bug.cgi?id=1221721)

### Chrome (v20-25)
- Viewport units not supported for:
  - Border widths
  - Column gaps
  - Transform values
  - Box shadows
  - `calc()` expressions
- **Resolution**: Upgraded in v26+

### Safari & iOS Safari (v6-7)
- Viewport units not supported for:
  - Border widths
  - Column gaps
  - Transform values
  - Box shadows
  - `calc()` expressions

### iOS 7 Safari
- **Bug**: Viewport unit values reset to 0 if the page is left and returned to after 60 seconds
- **Workaround**: Re-apply viewport units with JavaScript if needed

### Internet Explorer
- **IE 9 (Print Mode)**: Interprets `vh` as page units (30vh = 30 pages)
- **IE 9 (Zoom)**: Does not calculate viewport units correctly when browser/OS is zoomed
- **IE 9 (iframes)**: Viewport units calculated in parent window context, not iframe context
- **IE 10-11 (3D Transforms)**: Using `vw` units with 3D transforms causes unexpected behavior
- **IE & Edge (Decimal Truncation)**: Truncates units to 2 decimal places; fractional values may render incorrectly

### Cross-Browser Issue: 100vw and Scrollbars
All browsers except Firefox incorrectly include the vertical scrollbar in `100vw` calculations. This can cause horizontal scrollbars when `overflow: auto` is set.

**Example Problem**:
```css
body {
  width: 100vw;    /* Includes vertical scrollbar width */
  overflow: auto;  /* Creates unwanted horizontal scrollbar */
}
```

**Solutions**:
- Use `width: 100%` for full-width elements
- Use `max-width: 100%` to prevent overflow
- See [CodePen example](https://codepen.io/CiTA/pen/zYBmYBJ)

### Mobile Safari and Chrome for Android
- **Bug**: `100vw` and `100vh` are sized to the "largest possible viewport" which may be larger than `<html> 100%` (the "smallest possible viewport")
- **Context**: This occurs during user scrolling as the URL bar resizes
- **Note**: On iPad with sidebar visible, the largest viewport may be when content is scrolled beneath the blurred sidebar
- **Reference**: [Google Developers: URL Bar Resizing](https://developers.google.com/web/updates/2016/12/url-bar-resizing)

## Workarounds and Polyfills

### Polyfills Available

1. **vminpoly** - Basic viewport unit polyfill
   - Repository: [saabi/vminpoly](https://github.com/saabi/vminpoly)

2. **viewport-units-buggyfill** - Fixes buggy viewport unit support
   - Repository: [rodneyrehm/viewport-units-buggyfill](https://github.com/rodneyrehm/viewport-units-buggyfill)
   - Handles many of the iOS and older browser issues

### Manual Workarounds

For older browsers without viewport unit support, use JavaScript-based solutions:

```javascript
// Calculate and apply viewport-relative sizing
function setViewportUnits() {
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;

  // Apply as CSS variables
  document.documentElement.style.setProperty('--vw', vw + 'px');
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

// Listen for resize events
window.addEventListener('resize', setViewportUnits);
setViewportUnits();
```

Then use in CSS:
```css
.element {
  width: calc(var(--vw) * 50);
  height: calc(var(--vh) * 50);
}
```

## Best Practices

1. **Test Across Browsers**: Viewport unit behavior varies, especially on mobile
2. **Provide Fallbacks**: Use pixel or percentage values as fallbacks for older browsers
3. **Be Cautious with 100vh**: Consider scrollbar behavior and mobile URL bars
4. **Use vmin/vmax Strategically**: Great for responsive typography and flexible layouts
5. **Combine with calc()**: Use `calc()` for complex responsive calculations
6. **Mobile Considerations**: Test thoroughly on iOS and Android for scrollbar and URL bar interactions

## Example Code

### Full-Screen Hero Section with Fallback
```css
.hero {
  height: 100vh;
  height: 100dvh; /* Use dynamic viewport height if available */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Responsive Typography
```css
h1 {
  font-size: clamp(2rem, 5vw, 3rem); /* Min, preferred, max */
  line-height: 1.2;
}
```

### Adaptive Square Element
```css
.square {
  width: min(50vw, 500px);
  aspect-ratio: 1;
}
```

### Flexible Spacing
```css
.container {
  padding: clamp(1rem, 5vw, 3rem);
}
```

## Related Links

- **Blog Post**: [CSS-Tricks - Viewport Sized Typography](https://css-tricks.com/viewport-sized-typography/)
- **Polyfill**: [GitHub - vminpoly](https://github.com/saabi/vminpoly)
- **Buggyfill**: [GitHub - viewport-units-buggyfill](https://github.com/rodneyrehm/viewport-units-buggyfill)
- **Issue Discussion**: [Blog Post - iOS7 Mobile Safari And Viewport Units](https://blog.rodneyrehm.de/archives/34-iOS7-Mobile-Safari-And-Viewport-Units.html)
- **W3C Specification**: [CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/#viewport-relative-lengths)
- **Google Developers**: [URL Bar Resizing on Mobile](https://developers.google.com/web/updates/2016/12/url-bar-resizing)

## Additional Notes

### Keywords
`vm`, `viewport-percentage`, `100vh`, `100vw`

### Modern Alternatives
Consider using newer viewport-relative units when targeting modern browsers:
- **dvh** (dynamic viewport height): Accounts for dynamic URL bar changes on mobile
- **dvw** (dynamic viewport width): Dynamic viewport width alternative
- **svh** (small viewport height): Based on smallest viewport height (with UI chrome)
- **lvh** (large viewport height): Based on largest viewport height

These newer units address many of the issues encountered with traditional `vh`/`vw` units on mobile devices.

---

*Last Updated: 2024*
*Based on CanIUse data*
