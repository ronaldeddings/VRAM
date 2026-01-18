# CSS font-stretch

## Overview

The `font-stretch` CSS property allows you to select the appropriate font width variation when a font family has multiple width-based variants. This property does not cause the browser to artificially stretch or compress text, but rather selects pre-designed condensed, normal, or expanded font variations if they exist within the font family.

**Note:** `font-stretch` is an alias of the CSS [`font-width`](https://www.w3.org/TR/css-fonts-4/#font-width-prop) property introduced in CSS Fonts Module Level 4.

---

## Specification

| Property | Value |
|----------|-------|
| **Status** | Working Draft (WD) |
| **Specification** | [W3C CSS Fonts Module Level 4](https://www.w3.org/TR/css-fonts-4/#font-stretch-prop) |
| **Standards Track** | Yes |

---

## Categories

- **CSS Fonts**

---

## Benefits and Use Cases

### Enhanced Typography Control
- **Design Flexibility:** Select from multiple font widths (ultra-condensed, condensed, semi-condensed, normal, semi-expanded, expanded, extra-expanded, ultra-expanded) without requiring multiple font files
- **Responsive Design:** Adjust font widths based on viewport size or layout constraints
- **Optimal Spacing:** Choose wider or narrower variants to improve text readability and layout balance

### Performance Optimization
- **Single Font File:** Use variable fonts with built-in width variations instead of loading multiple font files
- **Reduced Bandwidth:** Eliminate the need to load separate condensed or expanded font variants
- **Faster Load Times:** Variable fonts with font-stretch support load once and provide all width variations

### Design Quality
- **Professional Typography:** Leverage font designer's intentional width variations rather than browser-scaled distortions
- **Improved Readability:** Width-optimized variants typically render more legibly than stretched text
- **Consistent Quality:** Professional-grade typography across all supported width ranges

### Real-World Applications
- **Headlines & Titles:** Use wider fonts for impact, or condensed fonts for tight spaces
- **Responsive Navigation:** Adjust font width to fit menu items in limited horizontal space
- **Data Tables:** Use condensed fonts to fit more content in narrow columns
- **Branding:** Maintain visual consistency with brand-specific font width requirements
- **Multi-Language Support:** Different languages may benefit from different font widths

---

## Browser Support

### Support Summary by Browser

| Browser | First Full Support | Latest Status |
|---------|-------------------|----------------|
| **Chrome** | 48 | Fully Supported |
| **Firefox** | 9 | Fully Supported |
| **Safari** | 11 | Fully Supported |
| **Edge** | 12 | Fully Supported |
| **Opera** | 35 | Fully Supported |
| **Internet Explorer** | 9 | Supported (IE 9+) |
| **iOS Safari** | 10.3 | Fully Supported |
| **Samsung Internet** | 5.0 | Fully Supported |

### Global Usage

- **Full Support:** 93.57% of users
- **Partial Support:** 0%
- **No Support:** 6.43% of users

### Detailed Browser Version Support

#### Desktop Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| Chrome | v48+ | Full support |
| Firefox | v9+ | Full support |
| Safari | v11+ | Full support |
| Edge | v12+ | Full support |
| Opera | v35+ | Full support |
| IE 9+ | v9-11 | Full support |

#### Mobile Browsers

| Browser | First Support | Status |
|---------|---------------|--------|
| iOS Safari | v10.3+ | Full support |
| Android Browser | v142 | Full support |
| Android Chrome | v142 | Full support |
| Android Firefox | v144 | Full support |
| Opera Mobile | v80+ | Full support |
| Samsung Internet | v5.0+ | Full support |

#### Limited/No Support

| Browser | Status |
|---------|--------|
| Opera Mini | Not supported |
| Blackberry Browser | Not supported (BB7, 10) |

---

## CSS Syntax

```css
/* Keyword values */
font-stretch: ultra-condensed;
font-stretch: extra-condensed;
font-stretch: condensed;
font-stretch: semi-condensed;
font-stretch: normal;
font-stretch: semi-expanded;
font-stretch: expanded;
font-stretch: extra-expanded;
font-stretch: ultra-expanded;

/* Percentage values */
font-stretch: 50%;
font-stretch: 100%;
font-stretch: 200%;

/* Global values */
font-stretch: inherit;
font-stretch: initial;
font-stretch: unset;
```

### Supported Values

| Value | Percentage | Description |
|-------|-----------|-------------|
| `ultra-condensed` | 50% | Ultra-narrow font variant |
| `extra-condensed` | 62.5% | Extra-narrow font variant |
| `condensed` | 75% | Narrow font variant |
| `semi-condensed` | 87.5% | Semi-narrow font variant |
| `normal` | 100% | Default font width |
| `semi-expanded` | 112.5% | Semi-wide font variant |
| `expanded` | 125% | Wide font variant |
| `extra-expanded` | 150% | Extra-wide font variant |
| `ultra-expanded` | 200% | Ultra-wide font variant |

---

## Example Usage

### Basic Keyword Values

```css
/* Using condensed font for narrow spaces */
h1 {
  font-family: 'Variable Font Family', sans-serif;
  font-stretch: condensed;
}

/* Using expanded font for headlines */
.headline {
  font-stretch: expanded;
}

/* Normal width (default) */
body {
  font-stretch: normal;
}
```

### Responsive Font Width

```css
/* Desktop: wide font */
.title {
  font-stretch: expanded;
  font-size: 2.5rem;
}

/* Tablet: normal width */
@media (max-width: 768px) {
  .title {
    font-stretch: normal;
    font-size: 2rem;
  }
}

/* Mobile: condensed font */
@media (max-width: 480px) {
  .title {
    font-stretch: condensed;
    font-size: 1.5rem;
  }
}
```

### Variable Font with font-stretch

```css
@font-face {
  font-family: 'Variable Font';
  src: url('variable-font.woff2') format('woff2');
  font-weight: 100 900;
  font-stretch: 50% 200%; /* Supports range of widths */
}

body {
  font-family: 'Variable Font', sans-serif;
  font-stretch: 100%; /* Using percentage value */
}

.narrow {
  font-stretch: 75%; /* Condensed */
}

.wide {
  font-stretch: 150%; /* Extra-expanded */
}
```

### Navigation Menu Example

```css
/* Use condensed fonts to fit menu items in narrow header */
nav {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
}

nav a {
  font-family: 'Open Sans', sans-serif;
  font-stretch: semi-condensed;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 1024px) {
  nav a {
    font-stretch: normal;
  }
}
```

---

## Known Issues and Limitations

### Font Availability
- **Dependency on Font:** The property only works if the selected font family includes the specified width variant
- **Fallback Behavior:** If the exact width variant doesn't exist, browsers will use the closest available width
- **Font Licensing:** Variable fonts with width support may have licensing restrictions

### Browser Compatibility Considerations
- **IE 9-11:** Full support but variable font support may be limited
- **Older Mobile Devices:** Some older Android devices (< v142) and opera mini don't support this property

### Performance Notes
- **Variable Fonts Recommended:** For best results and performance, use variable fonts that include width variations
- **Font File Size:** Variable fonts are generally larger than single-width fonts but smaller than multiple font files

---

## Implementation Notes

### Testing for Support

```javascript
// Feature detection
const supportsFont Stretch = CSS.supports('font-stretch: condensed');

if (supportsFontStretch) {
  // Use font-stretch safely
  document.documentElement.style.fontStretch = 'condensed';
} else {
  // Fallback: load alternative font or use standard fonts
}
```

### Best Practices

1. **Use Variable Fonts:** For maximum flexibility and performance, use variable fonts with width support
2. **Progressive Enhancement:** Apply font-stretch to enhance typography while maintaining fallback fonts
3. **Test with Real Fonts:** Verify that your chosen fonts actually support the width values you're using
4. **Performance Consideration:** Load variable fonts efficiently using font-display property
5. **Accessibility:** Ensure that font width changes don't impact text readability or contrast

### Font Families with font-stretch Support

Popular variable fonts that support font-stretch include:
- IBM Plex (multiple families)
- Roboto Flex
- Crimson Text
- Libre Franklin
- Inter (has some width variations)

---

## Related Features

- [CSS `font-weight` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight) - Controls font thickness
- [CSS `font-style` Property](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style) - Controls font styling (normal, italic, oblique)
- [CSS Variable Fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_fonts_guide) - Comprehensive guide to variable fonts
- [CSS `font-width` Property](https://www.w3.org/TR/css-fonts-4/#font-width-prop) - The standardized alias for `font-stretch`
- [CSS `font` Shorthand](https://developer.mozilla.org/en-US/docs/Web/CSS/font) - Combines multiple font properties

---

## Additional Resources

### Official Documentation
- [MDN Web Docs - font-stretch](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch)
- [W3C CSS Fonts Module Level 4 Specification](https://www.w3.org/TR/css-fonts-4/#font-stretch-prop)

### Learning Resources
- [CSS Tricks - font-stretch Article](https://css-tricks.com/almanac/properties/f/font-stretch/)
- [Variable Fonts Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_fonts_guide)
- [Google Fonts - Variable Fonts](https://fonts.google.com/?vf=display=swap)

### Tools & Resources
- [CanIUse - font-stretch](https://caniuse.com/font-stretch)
- [WebFont Loader](https://github.com/typekit/webfontloader) - For managing font loading
- [Font Bureau](https://www.fontbureau.com/) - Variable font resources

---

## Browser Support Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully Supported |
| ⚠️ | Partial Support / Buggy |
| ❌ | Not Supported |
| 🔶 | Limited Support |

---

**Last Updated:** December 2025
**Data Source:** CanIUse
**Global Usage:** 93.57% (Full Support)
