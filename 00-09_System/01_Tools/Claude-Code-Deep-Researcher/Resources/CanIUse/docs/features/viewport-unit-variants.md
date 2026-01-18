# Small, Large, and Dynamic Viewport Units

## Overview

The viewport unit variants feature introduces new CSS units that provide more flexible and reliable alternatives to the original `vw` and `vh` units. These new units adapt based on the browser's UI visibility state, addressing critical issues with fixed viewport size measurements.

## Description

Viewport unit variants are CSS length units similar to `vw` (viewport width) and `vh` (viewport height) that adjust based on whether the browser's user interface (address bar, navigation elements, etc.) is shown or hidden. This resolves the long-standing problem where fixed viewport units would cause layout shifts and overflow issues on mobile devices with dynamic browser UI.

The feature defines three main categories of units:

- **Small viewport units (`sv*`)**: `svb`, `svh`, `svi`, `svmax`, `svmin`, `svw` - based on the smallest viewport size when browser UI is shown
- **Large viewport units (`lv*`)**: `lvb`, `lvh`, `lvi`, `lvmax`, `lvmin`, `lvw` - based on the largest viewport size when browser UI is hidden
- **Dynamic viewport units (`dv*`)**: `dvb`, `dvh`, `dvi`, `dvmax`, `dvmin`, `dvw` - adjusts dynamically as browser UI visibility changes
- **Logical units**: `vi` (viewport inline) and `vb` (viewport block) - provide logical directional variants

## Specification Status

- **Status**: Working Draft (WD)
- **Specification URL**: [W3C CSS Values and Units Module Level 4](https://www.w3.org/TR/css-values-4/#viewport-variants)

## Categories

- CSS

## Benefits and Use Cases

### Solving Mobile Viewport Issues

The original viewport units (`vw`, `vh`) calculate based on the full viewport size, which includes hidden browser UI. When the browser UI appears or disappears (e.g., on scroll), elements sized with these units would cause unexpected overflow or layout shifts.

### Responsive Full-Screen Layouts

These units enable developers to:
- Create truly full-screen layouts that adapt to browser UI visibility
- Design mobile-friendly hero sections and full-viewport containers
- Implement responsive slides without overflow issues
- Build layouts that work predictably across different devices and browsers

### Use Case Examples

1. **Full-height containers**: Use `dvh` instead of `vh` to prevent overflow when browser UI appears
2. **Mobile app-like interfaces**: Leverage `svh` to create layouts that work with visible UI
3. **Responsive typography**: Size text relative to available viewport space that adapts dynamically
4. **Hero sections**: Create landing page sections that scale appropriately on mobile and desktop
5. **Modal dialogs**: Size modal overlays to fit the actual available viewport

## Browser Support Table

| Browser | Earliest Support | Status |
|---------|------------------|--------|
| **Chrome** | 108 | Fully Supported |
| **Edge** | 108 | Fully Supported |
| **Firefox** | 101 | Fully Supported |
| **Safari** | 15.4 | Fully Supported |
| **Opera** | 94 | Fully Supported |
| **iOS Safari** | 15.4 | Fully Supported |
| **Android Browser** | 142 | Fully Supported |
| **Chrome Android** | 142 | Fully Supported |
| **Firefox Android** | 144 | Fully Supported |
| **Opera Mobile** | 80 | Fully Supported |
| **Samsung Internet** | 21 | Fully Supported |
| **Opera Mini** | — | Not Supported |
| **IE / IE Mobile** | — | Not Supported |

### Support Legend

- `y`: Fully supported
- `n`: Not supported
- `n d #1`: Not supported but behind experimental flag (requires enabling "Experimental Web Platform features")

### Desktop Browser Timeline

- **2023 Q1**: Chrome 108+, Edge 108+ support
- **2023 Q1**: Firefox 101+ support
- **2022 Q4**: Safari 15.4+ support
- **2023 Q3**: Opera 94+ support

### Mobile Browser Timeline

- **2024**: Android 142+, Chrome Android 142+, Firefox Android 144+
- **2023**: iOS Safari 15.4+, Opera Mobile 80+
- **2024**: Samsung Internet 21+

## Unit Reference

### Small Viewport Units (`sv*`)

Used when browser UI is visible, representing the smallest available viewport.

- `svw`: 1% of small viewport width
- `svh`: 1% of small viewport height
- `svi`: 1% of small viewport inline size
- `svb`: 1% of small viewport block size
- `svmin`: 1% of the smaller of `svw` or `svh`
- `svmax`: 1% of the larger of `svw` or `svh`

### Large Viewport Units (`lv*`)

Used when browser UI is hidden, representing the largest available viewport.

- `lvw`: 1% of large viewport width
- `lvh`: 1% of large viewport height
- `lvi`: 1% of large viewport inline size
- `lvb`: 1% of large viewport block size
- `lvmin`: 1% of the smaller of `lvw` or `lvh`
- `lvmax`: 1% of the larger of `lvw` or `lvh`

### Dynamic Viewport Units (`dv*`)

Adapts dynamically as browser UI visibility changes, providing the best experience.

- `dvw`: 1% of dynamic viewport width
- `dvh`: 1% of dynamic viewport height
- `dvi`: 1% of dynamic viewport inline size
- `dvb`: 1% of dynamic viewport block size
- `dvmin`: 1% of the smaller of `dvw` or `dvh`
- `dvmax`: 1% of the larger of `dvw` or `dvh`

### Example Usage

```css
/* Mobile hero section that adapts to browser UI */
.hero {
  height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Container that works with visible browser UI */
.container {
  height: 100svh;
  overflow-y: auto;
}

/* Fallback for older browsers */
.responsive-section {
  height: 100vh; /* Fallback */
  height: 100dvh; /* Modern browsers */
}

/* Using logical units for writing-mode independent sizing */
.block-container {
  block-size: 100dvb; /* Dynamic viewport block size */
}
```

## Notes

### Known Issues

**Safari 15.6 on macOS**: There is a reported issue where the `dvh` unit is calculated as larger than expected. This can cause layout issues in some cases.

- **Issue Reference**: [WebKit Bug #242758](https://bugs.webkit.org/show_bug.cgi?id=242758)
- **Workaround**: Use `svh` or `lvh` explicitly when full dynamic height is problematic

### Experimental Support

In Chrome and Edge versions 100-107, the feature is available behind the "Experimental Web Platform features" flag:
1. Navigate to `chrome://flags/` or `edge://flags/`
2. Search for "Experimental Web Platform features"
3. Enable the flag
4. Restart the browser

## Related Resources

- **[Specification](https://www.w3.org/TR/css-values-4/#viewport-variants)** - W3C CSS Values and Units Module Level 4
- **[Blog Post](https://www.bram.us/2021/07/08/the-large-small-and-dynamic-viewports/)** - Bram.us article explaining the new units in detail
- **[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/length#relative_length_units_based_on_viewport)** - Relative length units based on viewport
- **[Chrome Bug Tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=1093055)** - Chromium implementation progress
- **[Mozilla Bug Tracker](https://bugzilla.mozilla.org/show_bug.cgi?id=1610815)** - Firefox implementation progress
- **[WebKit Bug Tracker](https://bugs.webkit.org/show_bug.cgi?id=219287)** - Safari/WebKit implementation progress

## Implementation Notes

### Choosing the Right Unit

- **Use `dvh`/`dvw`** for most responsive layouts - provides the best cross-browser user experience
- **Use `svh`/`svw`** when you want to ensure content fits with browser UI visible
- **Use `lvh`/`lvw`** when you want maximum space with browser UI hidden
- **Use `vmin`/`vmax`** logical variants for languages with different writing modes

### Progressive Enhancement

Since browser support is still rolling out, use a fallback strategy:

```css
.fullscreen-container {
  height: 100vh; /* Fallback for older browsers */
  height: 100dvh; /* Modern browsers */
}
```

### Performance Considerations

Dynamic viewport units (`dv*`) trigger layout recalculations when browser UI appears/disappears. For better performance on mobile:
- Use static sizing when possible
- Combine with media queries for responsive breakpoints
- Consider using `svh` for above-the-fold content if dynamic updates cause jank

## Browser Compatibility Data

**Global Support**: 90.83% of users have browsers that support this feature

**Regional Variations**:
- Well-supported in modern Chrome, Firefox, Safari, and Edge versions
- Strong support on iOS (15.4+) and modern Android devices
- Limited support on legacy browsers and Opera Mini

## Related Features

- [CSS Viewport Units (original `vw`, `vh`)](https://caniuse.com/viewport-units)
- [CSS Custom Properties (CSS Variables)](https://caniuse.com/css-variables)
- [CSS Media Queries](https://caniuse.com/css-mediaqueries)
