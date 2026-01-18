# CSS Mix-Blend-Mode

Blending of HTML/SVG elements using CSS blend modes.

## Overview

CSS `mix-blend-mode` allows blending between arbitrary SVG and HTML elements, enabling developers to create sophisticated visual effects by controlling how an element's colors blend with its background. This property supports multiple blend modes that produce different compositional effects.

## Specification

- **Status:** Candidate Recommendation (CR)
- **Specification URL:** [W3C Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/#mix-blend-mode)
- **Latest Update:** 2023

## Categories

- CSS

## What is Mix-Blend-Mode?

The `mix-blend-mode` CSS property defines how an element's content should blend with its background. It implements standard compositing and blending operations commonly found in image editing software.

### Supported Blend Modes

The property accepts the following values:

- `normal` - Default blending (no blending)
- `multiply` - Darkens by multiplying colors
- `screen` - Lightens by inverting and multiplying
- `overlay` - Combination of multiply and screen
- `darken` - Selects darker color
- `lighten` - Selects lighter color
- `color-dodge` - Brightens by decreasing contrast
- `color-burn` - Darkens by increasing contrast
- `hard-light` - Overlay effect based on blend color
- `soft-light` - Subtle overlay effect
- `difference` - Subtracts darker from lighter
- `exclusion` - Similar to difference, lower contrast
- `hue` - Uses hue of blend color
- `saturation` - Uses saturation of blend color
- `color` - Uses hue and saturation of blend color
- `luminosity` - Uses luminosity of blend color

## Use Cases and Benefits

### Visual Effects & Design

- **Image Overlays:** Create sophisticated image composition effects with text or decorative elements
- **Color Overlays:** Apply tinted overlays on backgrounds and images
- **Creative Typography:** Blend text with background imagery for artistic effects
- **Layered Designs:** Compose multiple visual layers with complex blending

### UI/UX Applications

- **Hover States:** Enhance interactive elements with blend mode transitions
- **Modal Dialogs:** Create semi-transparent overlays with better visual integration
- **Navigation Menus:** Add visual depth to dropdown menus and overlays
- **Background Effects:** Design sophisticated background patterns and gradients

### Performance Benefits

- **GPU Acceleration:** Blend modes are typically GPU-accelerated in modern browsers
- **CSS-Only:** No JavaScript required for blending effects
- **Lightweight:** Minimal performance impact compared to image-based effects
- **Responsive:** Automatically adapts to different screen sizes

## Browser Support

### Desktop Browsers

| Browser | First Version with Full Support | Current Status |
|---------|--------------------------------|-----------------|
| Chrome | 41 | ✅ Fully Supported |
| Firefox | 32 | ✅ Fully Supported |
| Safari | 7.1† | ⚠️ Partial (Limited blend modes) |
| Edge | 79 | ✅ Fully Supported |
| Opera | 29 | ✅ Fully Supported |
| Internet Explorer | — | ❌ Not Supported |

### Mobile Browsers

| Platform | First Version with Full Support | Current Status |
|----------|--------------------------------|-----------------|
| iOS Safari | 8† | ⚠️ Partial (Limited blend modes) |
| Android Browser | 142 | ✅ Fully Supported |
| Chrome for Android | 142 | ✅ Fully Supported |
| Firefox for Android | 144 | ✅ Fully Supported |
| Samsung Internet | 5.0 | ✅ Fully Supported |
| Opera Mobile | 80 | ✅ Fully Supported |
| Opera Mini | — | ❌ Not Supported |

### Global Support Statistics

- **Full Support:** 82.5% of users
- **Partial Support:** 10.69% of users (mainly Safari/iOS)
- **No Support:** ~6.8% of users

## Implementation Notes

### Partial Support (Safari and iOS Safari)

Safari and iOS Safari versions 7.1 and later support `mix-blend-mode`, but with limitations:

**⚠️ Note:** Partial support in Safari refers to not supporting the following blend modes:
- `hue`
- `saturation`
- `color`
- `luminosity`

All other blend modes are fully supported in Safari.

### Experimental Flags

**Chrome versions 29-40** required manual enablement:
- Access `chrome://flags`
- Search for "experimental Web Platform features"
- Enable the flag to use mix-blend-mode
- Restart the browser

Chrome version 41 and later have this feature enabled by default.

## Known Bugs and Issues

### Firefox on macOS

**Issue:** Firefox on macOS [has a bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1135271) where content may turn entirely black when using certain blend modes.

**Workaround:** Test thoroughly on macOS Firefox, and consider providing fallback styles for critical content.

### Chrome and Opera Rendering Issues

**Issue:** [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=762966) and Opera sometimes render `mix-blend-mode` incorrectly, particularly with certain color combinations or blend modes.

**Workaround:** [A workaround is available](https://codepen.io/lumio/pen/vJqExB) that involves adjusting element positioning or using `transform: translateZ(0)` to force GPU acceleration.

## Browser Compatibility Details

### Desktop Support Timeline

```
IE 5.5 - 11:     No support
Edge 12-18:       No support
Edge 79+:         Full support ✅

Firefox 2-31:     No support
Firefox 32+:      Full support ✅

Chrome 4-40:      No/Experimental support
Chrome 41+:       Full support ✅

Safari 3.1-7:     No support
Safari 7.1+:      Partial support (⚠️ limited blend modes)

Opera 9-28:       No support
Opera 29+:        Full support ✅
```

### Mobile Support Timeline

```
iOS Safari 3.2-7.0:  No support
iOS Safari 8+:       Partial support (⚠️)

Android 2.1-4.4.3:   No support
Android 142+:        Full support ✅

Opera Mobile 10-79:   No support
Opera Mobile 80+:     Full support ✅

Samsung Internet 4:   No support
Samsung Internet 5.0+: Full support ✅
```

## Practical Example

```css
/* Simple overlay with multiply blend mode */
.image-overlay {
  position: relative;
  display: inline-block;
}

.image-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 0, 0.3);
  mix-blend-mode: multiply;
}

/* Text with color dodge blend mode */
.blend-text {
  mix-blend-mode: color-dodge;
  color: white;
  font-weight: bold;
}

/* Screen blend mode for lightening effects */
.light-overlay {
  mix-blend-mode: screen;
  background: rgba(255, 255, 200, 0.5);
}
```

## Fallback Strategies

For browsers without full support:

```css
.element {
  /* Provide a safe fallback background */
  background: rgba(0, 0, 0, 0.3);

  /* Apply mix-blend-mode for supported browsers */
  mix-blend-mode: multiply;
}
```

For gradient overlays, consider using semi-transparent colors without blend modes as a fallback.

## Related Features

- [CSS `backdrop-filter`](https://caniuse.com/backdrop-filter) - Filter effects for backgrounds
- [CSS `opacity`](https://caniuse.com/css-opacity) - Basic transparency
- [CSS `transform`](https://caniuse.com/transforms2d) - 2D transformations
- [SVG Blending](https://www.w3.org/TR/SVG2/) - SVG-specific blending

## Resources and References

### Official Documentation
- [MDN Web Docs: mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)
- [W3C Compositing and Blending Level 1 Specification](https://www.w3.org/TR/compositing-1/#mix-blend-mode)

### Tutorials and Examples
- [CodePen Example](https://codepen.io/bennettfeely/pen/csjzd) - Interactive blend mode demonstrations
- [CSS-Tricks: Basics of CSS Blend Modes](https://css-tricks.com/basics-css-blend-modes/) - Comprehensive blog post
- [Blend Mode Workaround](https://codepen.io/lumio/pen/vJqExB) - Solution for Chrome/Opera rendering issues

### Testing and Validation
- [CanIUse: mix-blend-mode](https://caniuse.com/css-mixblendmode) - Full browser support chart
- Browser DevTools color picker (often shows blend mode effects)

## Summary

CSS `mix-blend-mode` is a well-supported feature in modern browsers with excellent coverage on desktop (Chrome, Firefox, Edge, Opera) and strong support on mobile platforms. While Safari's partial support and some browser-specific bugs exist, the feature is suitable for production use with appropriate fallbacks and testing.

The 82.5% global support rate makes it viable for modern web applications, though developers should test thoroughly and consider providing fallback styles for critical visual effects, particularly on Safari-based browsers.

---

**Last Updated:** 2025
**Data Source:** CanIUse
**Specification Status:** Candidate Recommendation (CR)
