# CSS background-blend-mode

Allows blending between CSS background images, gradients, and colors using blend mode algorithms for creative visual effects.

## Overview

The `background-blend-mode` property defines how an element's background images, gradients, and colors blend together and with the element's background color. This enables advanced visual effects like multiply, screen, overlay, and many other blend modes without requiring additional image processing or JavaScript.

## Specification

- **Status:** Candidate Recommendation (CR)
- **Specification Link:** [W3C Compositing and Blending Level 1](https://www.w3.org/TR/compositing-1/#propdef-background-blend-mode)
- **Property:** `background-blend-mode`
- **Values:** `normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`

## Categories

- **CSS** - Cascading Style Sheets

## Benefits and Use Cases

### Creative Design Effects
- Create sophisticated visual effects without image editing software
- Blend multiple background layers for dynamic, layered designs
- Combine gradients with background images for enhanced visual depth

### Performance Optimization
- Reduce server-side image composition processing
- Eliminate need for pre-rendered composite images
- Enable responsive, dynamic backgrounds with minimal file sizes

### Interactive Experiences
- Create hover effects with blend mode transitions
- Build dynamic backgrounds that adapt to content changes
- Combine with CSS animations for engaging visual interactions

### Common Applications
- **Typography Enhancement:** Blend text shadows or background images with text
- **Hero Sections:** Create dramatic overlays on background images
- **Image Effects:** Apply color tints, multiply effects, or screen blends
- **Gradient Combinations:** Layer multiple gradients with different blend modes
- **Dark/Light Mode:** Use blend modes for theme variations
- **Watermarks:** Overlay images with screen or overlay blend modes

## Browser Support

The following table shows the first version of each browser with full support for `background-blend-mode`:

| Browser | First Support | Current Status |
|---------|---------------|----------------|
| **Chrome** | 35 | ✅ Supported |
| **Edge** | 79 | ✅ Supported |
| **Firefox** | 30 | ✅ Supported |
| **Safari** | 10.1 | ✅ Supported |
| **Opera** | 22 | ✅ Supported |
| **iOS Safari** | 10.3 | ✅ Supported |
| **Android Chrome** | 4.4 (modern versions) | ✅ Supported |
| **Internet Explorer** | N/A | ❌ Not Supported |
| **Opera Mini** | N/A | ❌ Not Supported |

### Support Summary

**Global Usage:** 93.18% of users have full support

**Notable Support Details:**
- **Partial Support (Older Versions):**
  - Safari 7.1 - 10.0: Partial support (missing `hue`, `saturation`, `color`, and `luminosity` blend modes)
  - iOS Safari 8 - 10.2: Partial support (missing advanced blend modes)
  - Chrome 46: Partial support with serious bugs in `multiply`, `difference`, and `exclusion` modes
  - Opera 33: Partial support with known issues

- **No Support:**
  - Internet Explorer (all versions)
  - Opera Mini (all versions)
  - Older Android browsers (pre-5.0)
  - Older BlackBerry versions

## Known Issues and Bugs

### iOS Safari

**Issue:** iOS Safari does not fully support multiple `background-blend-modes` on the same element when multiple background layers are present.

**Workaround:**
- Test thoroughly with multiple background layers on iOS devices
- Consider fallback designs for complex multi-layer blend scenarios
- Use JavaScript feature detection to provide alternative styling

### Chrome 46

**Issue:** Chrome 46 contains serious bugs with the following blend modes:
- `multiply`
- `difference`
- `exclusion`

**Workaround:** Upgrade to Chrome 47 or later for correct behavior. If supporting Chrome 46 is required, avoid these blend modes or use JavaScript-based workarounds.

### Advanced Blend Modes in Older Safari

**Issue:** Safari versions 7.1 through 10.0 do not support:
- `hue`
- `saturation`
- `color`
- `luminosity`

**Workaround:** Use feature detection or fallback to `normal` mode. Modern Safari (10.1+) has full support.

## Basic Usage Example

```css
/* Simple multiply blend mode for darkening an image */
.hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
                    url('background.jpg');
  background-blend-mode: multiply;
}

/* Screen blend mode for lightening effect */
.overlay-light {
  background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),
                    url('image.jpg');
  background-blend-mode: screen;
}

/* Multiple blend modes for different backgrounds */
.layered {
  background-image: url('layer1.png'), url('layer2.png');
  background-blend-mode: multiply, screen;
}
```

## Blend Mode Reference

Common blend modes and their effects:

| Blend Mode | Effect | Use Case |
|-----------|--------|----------|
| `normal` | Default - top layer covers bottom | Standard layering |
| `multiply` | Darkens - like overlaying transparencies | Darkening overlays |
| `screen` | Lightens - opposite of multiply | Lightening effects |
| `overlay` | Combines multiply and screen | Enhanced contrast |
| `darken` | Keeps darker pixels | Shadow effects |
| `lighten` | Keeps lighter pixels | Highlight effects |
| `color-dodge` | Brightens highlights significantly | Extreme lightening |
| `color-burn` | Darkens shadows significantly | Extreme darkening |
| `soft-light` | Subtle contrast adjustment | Gentle lighting |
| `hard-light` | Strong contrast adjustment | Bold effects |
| `difference` | Subtracts colors | Inversion effects |
| `exclusion` | Similar to difference, lower contrast | Subtle color shifts |
| `hue` | Uses color of blend layer | Color overlay |
| `saturation` | Uses saturation of blend layer | Saturation control |
| `color` | Uses hue and saturation | Color replacement |
| `luminosity` | Uses luminosity of blend layer | Brightness only |

## Related Resources

- [MDN Web Docs - background-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode)
- [CodePen Example](https://codepen.io/bennettfeely/pen/rxoAc) - Interactive blend mode demonstrations
- [Bennett Feely's Gradient Demo](https://bennettfeely.com/gradients/) - Advanced gradient and blend mode examples
- [Blog Post on Web Design Techniques](https://medium.com/web-design-technique/6b51bf53743a) - Practical implementation guide

## Testing Checklist

When implementing `background-blend-mode`:

- [ ] Test all blend modes you plan to use in target browsers
- [ ] Verify behavior with multiple background layers (especially on iOS)
- [ ] Test gradient + image combinations
- [ ] Confirm behavior across mobile browsers
- [ ] Use `@supports` rules for fallback styling:

```css
@supports (mix-blend-mode: multiply) {
  .overlay {
    background-blend-mode: multiply;
  }
}
```

- [ ] Consider providing fallback colors or different styling for unsupported browsers
- [ ] Test with accessibility tools (ensure sufficient contrast)
- [ ] Verify performance impact with complex blend scenarios

## Browser Compatibility Notes

- **Evergreen Browsers:** All modern versions of Chrome, Firefox, Edge, Safari, and Opera have full support
- **Mobile:** Modern iOS (10.3+) and Android (modern versions) have reliable support
- **Legacy:** Internet Explorer has no support; plan accordingly for older environments
- **Progressive Enhancement:** Use feature detection with CSS `@supports` to provide graceful fallbacks

---

**Last Updated:** 2025-12-13
**Global Usage:** 93.18% with full support, 0.02% with partial support
