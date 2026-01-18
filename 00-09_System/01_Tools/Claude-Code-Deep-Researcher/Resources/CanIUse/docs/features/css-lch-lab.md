# LCH and Lab Color Values

## Overview

The `lch()` and `lab()` color functions provide access to the CIE LAB color space, enabling more intuitive and perceptually uniform color specifications in CSS. These color functions represent colors in a way that closely matches human perception and provide access to a wider spectrum of colors than the traditional RGB color space.

## Key Characteristics

- **Perceptually Uniform**: Colors are specified based on how humans perceive them, not how devices display them
- **Extended Color Gamut**: Access to colors beyond the sRGB color space
- **Intuitive Syntax**: Separates lightness, chroma, and hue components for easier color manipulation
- **Wide Compatibility**: Supported in modern browsers with growing adoption

## Specification Status

**Status:** ![Candidate Recommendation](https://img.shields.io/badge/spec-Candidate%20Recommendation-blue)

**Specification Link:** [CSS Color Module Level 4 - LAB and LCH Color Values](https://www.w3.org/TR/css-color-4/#specifying-lab-lch)

## Categories

- **CSS** - Cascading Style Sheets

## Benefits and Use Cases

### Primary Benefits

1. **Perceptual Consistency**: Colors maintain consistent lightness across different hues, crucial for accessible design and color systems
2. **Intuitive Color Space**: Separates lightness (L), chroma (C), and hue (H) for more predictable color manipulation
3. **Extended Color Gamut**: Access to colors not available in RGB, including vibrant and saturated colors
4. **Display-Independent**: Not limited by device display capabilities in the same way RGB is
5. **Better Color Transitions**: Smoother, more natural color gradients and animations

### Use Cases

- **Accessible Color Systems**: Creating color schemes where lightness is perceptually consistent
- **Design Systems**: Building flexible color palettes that scale intelligently
- **Data Visualization**: Representing data with colors that maintain perceptual relationships
- **Wide Gamut Display Content**: Leveraging modern display capabilities for vibrant colors
- **Color Animations**: Smooth, natural color transitions in interactive designs
- **Brand Color Extensions**: Generating related colors with predictable perceptual relationships

## Browser Support Summary

| Browser | First Full Support | Status |
|---------|-------------------|--------|
| Chrome | 111 | ✅ Full Support |
| Edge | 111 | ✅ Full Support |
| Firefox | 113 | ✅ Full Support |
| Safari | 15 | ✅ Full Support |
| Opera | 98 | ✅ Full Support |
| iOS Safari | 15 | ✅ Full Support |
| Android Chrome | 142 | ✅ Full Support |
| Android Firefox | 144 | ✅ Full Support |
| Samsung Internet | 22 | ✅ Full Support |
| Opera Mobile | 80 | ✅ Full Support |
| Android Browser | 142 | ✅ Full Support |

### Legacy Browser Support

| Browser | Status |
|---------|--------|
| Internet Explorer | ❌ Not Supported |
| Edge (Legacy) | ❌ Not Supported |
| Opera Mini | ❌ Not Supported |
| BlackBerry | ❌ Not Supported |

**Overall Global Support:** ~89.85% of users (as of last update)

## Detailed Browser Support

### Desktop Browsers

#### Chrome
- **Full Support:** 111+
- **Partial Support:** 110 (behind `#enable-experimental-web-platform-features` flag)
- **Earlier versions:** Not supported

#### Edge (Chromium-based)
- **Full Support:** 111+
- **Partial Support:** 110 (behind `#enable-experimental-web-platform-features` flag)
- **Earlier versions:** Not supported

#### Firefox
- **Full Support:** 113+
- **Partial Support:** 111-112 (behind `layout.css.more_color_4.enabled` flag in `about:config`)
- **Earlier versions:** Not supported

#### Safari
- **Full Support:** 15+
- **Earlier versions:** Not supported (14 and below)

#### Opera
- **Full Support:** 98+
- **Earlier versions:** Not supported

### Mobile Browsers

#### iOS Safari
- **Full Support:** 15+
- **Earlier versions:** Not supported (14 and below)

#### Android Chrome
- **Full Support:** 142+

#### Android Firefox
- **Full Support:** 144+

#### Samsung Internet
- **Full Support:** 22+

#### Opera Mobile
- **Full Support:** 80+

#### Android Browser
- **Full Support:** 142+

## Syntax

### LAB Color Function

```css
/* Using lab() color function */
color: lab(50 40 30);
color: lab(50% 40 30);
color: lab(50 40 30 / 0.5); /* With alpha */
color: lab(50 calc(40 + 20) 30);

/* Where:
   - First value: Lightness (0-100 or 0%-100%)
   - Second value: a-axis (-125 to 125)
   - Third value: b-axis (-125 to 125)
   - Alpha: Optional transparency (0-1)
*/
```

### LCH Color Function

```css
/* Using lch() color function */
color: lch(50 40 30);
color: lch(50% 40 30deg);
color: lch(50 40 30 / 0.5); /* With alpha */
color: lch(calc(50 + 10) 40 30deg);

/* Where:
   - First value: Lightness (0-100 or 0%-100%)
   - Second value: Chroma (0-150+)
   - Third value: Hue (0-360 or 0-1 in turns)
   - Alpha: Optional transparency (0-1)
*/
```

## Code Examples

### Basic Color Declaration

```css
/* Simple colors */
.primary {
  background-color: lch(50 130 30);
}

.accent {
  color: lab(70 40 -30);
}

.muted {
  background-color: lch(75 30 200);
}
```

### Building a Color Palette

```css
:root {
  /* Define base colors in LCH */
  --primary-hue: 240;
  --primary-lightness: 50;
  --primary-chroma: 100;

  /* Generate related colors */
  --primary: lch(var(--primary-lightness) var(--primary-chroma) var(--primary-hue));
  --primary-light: lch(75 calc(var(--primary-chroma) * 0.5) var(--primary-hue));
  --primary-dark: lch(30 var(--primary-chroma) var(--primary-hue));
  --primary-muted: lch(60 calc(var(--primary-chroma) * 0.3) var(--primary-hue));
}

.button-primary {
  background-color: var(--primary);
  color: white;
}

.button-primary:hover {
  background-color: var(--primary-dark);
}

.input-placeholder {
  color: var(--primary-muted);
}
```

### Color Animations and Transitions

```css
.color-transition {
  background-color: lch(50 100 0);
  transition: background-color 0.3s ease;
}

.color-transition:hover {
  background-color: lch(50 100 120);
}

/* Smooth hue rotation in LCH space */
@keyframes hue-rotate {
  0% {
    background-color: lch(60 80 0deg);
  }
  100% {
    background-color: lch(60 80 360deg);
  }
}

.animated-box {
  animation: hue-rotate 3s linear infinite;
}
```

### Creating Accessible Color Scales

```css
/* Using LAB to create perceptually uniform color scales */
.scale-light {
  background-color: lab(90 20 15);
}

.scale-medium {
  background-color: lab(60 30 25);
}

.scale-dark {
  background-color: lab(30 40 35);
}

/* All colors have the same a and b values,
   ensuring consistent hue while varying lightness */
```

### Combining with CSS Custom Properties

```css
:root {
  /* Color space selection */
  --use-lch: 1; /* Set to 1 for LCH, 0 for RGB fallback */

  /* Brand color in LCH */
  --brand-lch: lch(65 110 25);
  --brand-rgb: rgb(220, 100, 50);
}

.card {
  /* Will use LCH in supporting browsers */
  background-color: var(--brand-lch);

  /* Fallback for older browsers */
  @supports not (color: lab(0 0 0)) {
    background-color: var(--brand-rgb);
  }
}
```

### With Alpha Channel

```css
.transparent-element {
  background-color: lch(50 100 30 / 0.5);
}

.gradient-text {
  background: linear-gradient(
    90deg,
    lch(50 100 0 / 1),
    lch(50 100 120 / 0)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

## Feature Flags for Early Testing

### Chrome/Edge
Enable experimental support in Chrome/Edge version 110:
1. Navigate to `chrome://flags`
2. Search for "Experimental Web Platform Features"
3. Set the flag to "Enabled"
4. Restart the browser

### Firefox
Enable experimental support in Firefox version 111-112:
1. Navigate to `about:config`
2. Search for `layout.css.more_color_4.enabled`
3. Toggle the value to `true`
4. Restart the browser

## Known Issues and Notes

### Status Notes

- No significant known bugs reported
- Implementation is stable and consistent across modern browsers
- Feature flags available for early testing in Chrome (110) and Firefox (111-112)

### Browser Adoption

- **Rapidly Adopted**: Recently added to Safari 15, all Chromium-based browsers (111+), and Firefox (113+)
- **Mobile Support**: Strong support in modern iOS Safari (15+) and Android browsers
- **Legacy Support**: No support in Internet Explorer or older browser versions

## Fallback Strategies

### Using `@supports` for Progressive Enhancement

```css
.modern-color {
  /* Fallback for older browsers */
  color: rgb(100, 150, 200);

  /* Enhanced color for modern browsers */
  color: lch(60 100 250);
}

/* Or explicit feature detection */
@supports (color: lch(50 100 30)) {
  .element {
    color: lch(50 100 30);
  }
}
```

### JavaScript Fallback Detection

```javascript
// Check if browser supports LCH colors
function supportsCSSLCHColors() {
  const element = document.createElement('div');
  element.style.color = 'lch(50 100 30)';

  // If the color was accepted, the style will be set
  return element.style.color !== '';
}

if (!supportsCSSLCHColors()) {
  // Load fallback styles or use JavaScript-based color conversion
  document.documentElement.classList.add('no-lch-support');
}
```

## Best Practices

### 1. Use LCH for Intuitive Color Relationships

```css
/* LCH is better for creating related colors */
.button {
  background-color: lch(55 100 25);
}

.button:hover {
  background-color: lch(45 100 25); /* Darker, same hue */
}

.button:active {
  background-color: lch(35 100 25); /* Even darker */
}
```

### 2. Document Color Intentions with Comments

```css
/*
 * Color: Vivid Blue
 * LCH: Lightness=60, Chroma=100, Hue=250deg
 * Perceptually uniform across all use cases
 */
.color-vivid-blue {
  color: lch(60 100 250);
}
```

### 3. Maintain CSS Custom Properties for Flexibility

```css
:root {
  --color-lightness: 60;
  --color-chroma: 100;
  --color-hue: 250;
}

.element {
  color: lch(
    var(--color-lightness)
    var(--color-chroma)
    var(--color-hue)
  );
}
```

### 4. Test Color Contrast in LCH Space

```css
/* High contrast background and text */
.high-contrast-dark {
  background-color: lch(20 30 250);  /* Dark blue */
  color: lch(95 5 60);               /* Light neutral */
}

.high-contrast-light {
  background-color: lch(95 5 60);    /* Light neutral */
  color: lch(20 30 250);             /* Dark blue */
}
```

## Related Resources

### Official Specifications and Documentation

- [MDN - lch() color function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch())
- [MDN - lab() color function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lab())
- [W3C CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/#specifying-lab-lch)

### Articles and Guides

- [Lea Verou: LCH colors in CSS - What, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)
- [CSS Land: LCH Color Picker](https://css.land/lch/)

### Browser Issue Trackers

- [Chrome Chromium Issue #1026287](https://bugs.chromium.org/p/chromium/issues/detail?id=1026287)
- [Firefox Bugzilla Issue #1352757](https://bugzilla.mozilla.org/show_bug.cgi?id=1352757)

### Interactive Tools

- [LCH Color Picker - CSS Land](https://css.land/lch/)
- [Color Contrast Checker with LCH Support](https://www.tpgi.com/color-contrast-checker/)

## Summary

LCH and Lab colors represent a significant advancement in CSS color specification, providing developers with perceptually uniform color spaces that better match human perception. With support now available in all modern browsers (89.85% global coverage), they are ready for production use with simple fallbacks for legacy browser support.

The adoption of these color functions enables more intuitive color system design, better accessibility through perceptually consistent lightness, and smoother color transitions. As web standards continue to evolve, LCH and Lab colors will likely become the preferred method for color specification in modern web development.
